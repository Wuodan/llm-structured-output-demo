const OBFUSCATE_MASK = [0x5a, 0xc3, 0x17, 0x9f, 0x4d, 0x22, 0xb7, 0x01];
const DEFAULT_API_KEY_OBFUSCATED =
  '29a83af03f0fc13077a271ae7f1bd63563f771a67512d36368a171fe7d1a853569f323f92913d4316fa576a72c1ad2303bfb25fd7d1384376af32efc791781653ff726ae2947d6636d';

function deobfuscate(obfHex) {
  if (typeof obfHex !== 'string') throw new TypeError('obfHex must be a hex string');
  const len = obfHex.length / 2;
  const masked = new Uint8Array(len);
  for (let i = 0; i < len; i++) masked[i] = parseInt(obfHex.substr(i * 2, 2), 16);
  const orig = new Uint8Array(len);
  for (let i = 0; i < len; i++) orig[i] = masked[i] ^ OBFUSCATE_MASK[i % OBFUSCATE_MASK.length];
  if (typeof Buffer !== 'undefined' && Buffer.from) {
    return Buffer.from(orig).toString('utf8');
  }
  return new TextDecoder().decode(orig);
}

// Initial open/closed state for each collapsible section.
const SECTION_DEFAULTS = {
  explanation: true,
  config: false,
  input: true,
  prompts: false,
  response: false,
  output: true,
};

const OUTPUT_FIELDS = [
  { key: 'customer_name', label: 'Customer Name' },
  { key: 'issue_category', label: 'Issue Category' },
  { key: 'product_name', label: 'Product Name' },
  { key: 'product_model', label: 'Product Model' },
  { key: 'order_number', label: 'Order Number' },
  { key: 'summary', label: 'Summary' },
];

document.addEventListener('DOMContentLoaded', () => {
  const elements = mapElements();
  setupSections(SECTION_DEFAULTS);
  prefillApiKey(elements.apiKey);
  elements.processButton.addEventListener('click', () => handleProcess(elements));
});

function mapElements() {
  return {
    providerUrl: document.getElementById('provider-url'),
    apiKey: document.getElementById('api-key'),
    model: document.getElementById('model-name'),
    systemPrompt: document.getElementById('system-prompt'),
    userPrompt: document.getElementById('user-prompt'),
    customerInput: document.getElementById('customer-input'),
    responseArea: document.getElementById('response-area'),
    tableContainer: document.getElementById('output-table-container'),
    processButton: document.getElementById('process-button'),
    status: document.getElementById('config-status'),
  };
}

function setupSections(defaults) {
  document.querySelectorAll('[data-section]').forEach((section) => {
    const key = section.dataset.section;
    const body = section.querySelector('.section-body');
    const toggle = section.querySelector('.toggle-btn');
    const desired = Object.prototype.hasOwnProperty.call(defaults, key) ? defaults[key] : true;
    setBodyState(body, toggle, Boolean(desired));
    toggle.addEventListener('click', () => {
      setBodyState(body, toggle, body.hidden);
    });
  });
}

function setBodyState(body, toggle, open) {
  body.hidden = !open;
  toggle.textContent = open ? 'Hide' : 'Show';
  toggle.setAttribute('aria-expanded', String(open));
}

function prefillApiKey(input) {
  try {
    input.value = deobfuscate(DEFAULT_API_KEY_OBFUSCATED);
  } catch (err) {
    input.value = '';
  }
}

async function handleProcess(elements) {
  updateStatus(elements, 'info', 'Sending request…');
  elements.processButton.disabled = true;
  elements.processButton.textContent = 'Processing…';
  elements.responseArea.value = '';
  renderTable(elements.tableContainer, null);

  const url = elements.providerUrl.value.trim();
  const model = elements.model.value.trim();
  const systemPrompt = elements.systemPrompt.value.trim();
  const userPrompt = elements.userPrompt.value.trim();
  const inputText = elements.customerInput.value.trim();

  const apiKeyInput = elements.apiKey.value.trim();

  const errors = [];
  if (!url) errors.push('LLM provider URL is required.');
  if (!model) errors.push('Model is required.');
  if (!apiKeyInput) errors.push('API key is required.');

  if (errors.length) {
    updateStatus(elements, 'error', errors.join(' '));
    resetButton(elements.processButton);
    return;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKeyInput}`,
      },
      body: JSON.stringify(
        {
          "model": model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
            { role: 'user', content: inputText }
          ]
        }
      )
    });

    const responseText = await response.text();
    if (!response.ok) {
      throw `HTTP ${response.status} ${response.statusText}\n${responseText}`;
    }

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (err) {
      throw 'Failed to parse provider response JSON.';
    }

    const content = parsed?.choices?.[0]?.message?.content;
    if (!content) {
      throw 'Provider response did not include any message content.';
    }

    handleModelResponse(content.trim(), elements);
  } catch (err) {
    elements.responseArea.value = typeof err === 'string' ? err : `Network error: ${err.message}`;
    renderTable(elements.tableContainer, null);
    updateStatus(elements, 'error', 'Unable to reach the model endpoint.');
  } finally {
    resetButton(elements.processButton);
  }
}

function handleModelResponse(modelText, elements) {
  elements.responseArea.value = modelText;
  try {
    const parsed = JSON.parse(modelText);
    elements.responseArea.value = JSON.stringify(parsed, null, 2);
    renderTable(elements.tableContainer, parsed);
    updateStatus(elements, 'info', 'Parsed JSON successfully.');
  } catch (err) {
    renderTable(elements.tableContainer, null);
    updateStatus(elements, 'error', 'Response was not valid JSON.');
  }
}

// Builds a deterministic table so missing JSON keys just render empty cells.
function renderTable(container, data) {
  container.innerHTML = '';
  if (!data || typeof data !== 'object') return;

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  OUTPUT_FIELDS.forEach((field) => {
    const th = document.createElement('th');
    th.textContent = field.label;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);

  const tbody = document.createElement('tbody');
  const row = document.createElement('tr');
  OUTPUT_FIELDS.forEach((field) => {
    const td = document.createElement('td');
    const value = data[field.key];
    td.textContent = value === undefined || value === null ? '' : String(value);
    row.appendChild(td);
  });
  tbody.appendChild(row);

  table.appendChild(thead);
  table.appendChild(tbody);
  container.appendChild(table);
}

function updateStatus(elements, status, message) {
  elements.status.dataset.status = status;
  elements.status.textContent = message;
}

function resetButton(button) {
  button.disabled = false;
  button.textContent = 'Process';
}
