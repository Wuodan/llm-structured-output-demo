# Structured Output Demo

Small browser-only example that calls an OpenAI-compatible chat completions endpoint and renders structured JSON output as both prettified text and a table. No build step, frameworks, or storage required.

## Run Locally
1. Clone or download this repo.
2. Open `index.html` in a modern desktop browser (double-click is fine).
3. Expand the **Config** section, verify the provider URL, API key, and model, then click **Process** under **Input**.

## How It Works
- Prompts insist that the LLM returns **only valid JSON** with the documented schema.
- The JavaScript replaces the `<<<INPUT_TEXTAREA_CONTENT>>>` placeholder with the textarea contents before calling the configured endpoint (default: OpenRouter).
- On success the model text is shown in the Response section; valid JSON is pretty-printed and converted into a table with deterministic columns.
- HTTP errors or malformed JSON are surfaced inline; the API key is never persisted locally.

## Configuration
- **LLM Provider URL:** Any OpenAI-compatible `/chat/completions` endpoint. Change it in the Config section before clicking Process.
- **API Key:** Enter a bearer token for the chosen provider. The field ships with an obfuscated default but you should replace it with your own credentials.
- **Model:** Defaults to `qwen/qwen-2.5-coder-32b-instruct:free`, but any compatible identifier will work.

## Manual Test Checklist
1. **Happy path:** Keep defaults, click Process, expect valid JSON + table.
2. **Invalid JSON:** Remove “Return ONLY valid JSON” from the prompt. Response shows the raw text, Output stays empty.
3. **Missing fields:** Ask the model for fewer keys; table renders with blank cells rather than errors.
4. **Bad credentials:** Clear the API key and click Process. You should see an inline error without a network call.
5. **Endpoint switch:** Swap the provider URL for another OpenAI-compatible service; confirm the request still works.
6. **Toggle UI:** Collapse/expand sections with the Show/Hide buttons; opening state matches the JS config on reload.
7. **Large input:** Paste a lengthy email to ensure the UI stays responsive.

## Troubleshooting
- **HTTP errors:** The Response textarea shows the provider status code and body; fix credentials or endpoint and retry.
- **No table output:** The model likely returned non-JSON text. Reapply the strict prompt or inspect the Response section for formatting issues.
- **Browser blocks request:** Some providers require CORS headers; run the page from a local static server if your provider enforces stricter origins.
