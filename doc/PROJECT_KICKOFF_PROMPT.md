# Project Kickoff Prompt — **LLM-structrured-output-demo**

You are an autonomous senior software engineer. Your task is to implement a tiny **browser-only** demo that shows **structured output** from an LLM. Do **not** add extra files or dependencies beyond what’s specified here.

## Goal
Build a single static webpage that demonstrates **structured output** end‑to‑end. The page has:
- A title, subtitle, and short intro.
- Six **collapsible sections** (Explanation, Config, Input, Prompts, Response, Output).

The goal is educational clarity: minimal, readable code that makes the structured‑output flow obvious (inputs → prompt → LLM call → JSON parse → table).

## Deliverables
- Exactly **1 HTML file** and **1 JavaScript file**. No bundlers, no frameworks, no CSS libraries.
- A short **README.md** (for developers) that explains what the demo does and how to use it locally.
- Minimal, easy-to-read code (educational); keep everything small and well-commented.
- Works locally by opening the HTML file in a browser; no server is required.

## Technical Constraints
- Pure vanilla JS (ES6+), HTML5 only. No external packages.
- Use the **OpenAI-compatible Chat Completions** endpoint (default to OpenRouter `https://openrouter.ai/api/v1/chat/completions`). Allow the user to change the URL.
- HTTP method: `POST`, `Content-Type: application/json`.
- Auth: `Authorization: Bearer <API_KEY>` from the “Config” section input.
- **Never** log or persist the API key. Do not store to localStorage or send anywhere except the configured endpoint.
- Handle provider-specific error messages gracefully and show them in the Response textarea.

## UX Copy (top of page)
- **Title:** “Structured Output Demo”
- **Subtitle:** “Turn unstructured text into JSON and a table (minimal example).”
- **Intro text:** One short paragraph explaining: “This page calls an LLM with a system + user prompt that requests **structured output** (JSON). If the JSON is valid, it’s shown below and rendered as a table.”

## Sections (layout: Title → collapsible/hidden → short description → form/output elements)
Each section is collapsible with a simple Show/Hide toggle. A configuration flag in JS determines which sections are open on first load.

1) ### **Explanation**
   - Brief text (for developers) describing that prompts instruct the LLM to return **only valid JSON** structured data.

2) ### **Config**
   - Fields:
     - **LLM Provider URL** (default: `https://openrouter.ai/api/v1/chat/completions`).
     - **API Key** (password input, default: value returned by `deobfuscate('29a83af03f0fc13077a271ae7f1bd63563f771a67512d36368a171fe7d1a853569f323f92913d4316fa576a72c1ad2303bfb25fd7d1384376af32efc791781653ff726ae2947d6636d')` do NOt write that value in the code!)
     - **Model** The LLM model (default:`qwen/qwen-2.5-coder-32b-instruct:free').
   - Note: Do not validate the key format; just require non-empty on submit.
   - Note: If API-Key is empty, the code shall use the base64 decoded value of `c2stb3ItdjEtYWQyMGQ3Zjk3YTQ2ZWZjOTFhZjZjNzgyYzIxM2RiZTI1MWYzNWFhN2E2NTI2ZWZkYzY3MjMxMmQwOTZkYWE3ZA==`.  Do not write the decoded value in the code.
   - section is hidden by default

3) ### **Input**
   - Elements:
     - **Textarea** with a realistic default customer email (see Default Data below).
     - **“Process” button**.
   - section is visible by default

4) ### **Prompts**
   - Elements (pre-filled defaults; user-editable):
     - **System prompt**.
     - **User prompt**.
   - The prompts must strictly instruct: “Return **ONLY** valid JSON.”
   - section is hidden by default

5) ### **Response**
   - Elements:
     - **Readonly textarea** showing raw model response body.
   - Behavior:
     - If the response is valid JSON, **pretty-print**.
     - If parsing fails, show the raw text as-is.
   - section is hidden by default

6) ### **Output**
   - Elements:
     - **Rendered table** derived from parsed JSON (clear/empty if JSON invalid).
   - Behavior:
     - Build the table dynamically from a known schema (see JSON Schema below).
     - If keys are missing, render empty cells; never crash.
   - section is visible by default

## Default Data
### Default Email (unstructured input)
Use this realistic customer message as the default in the Input textarea:
```
Hi Support,

I purchased the Aurora Smart Lamp (model A-200) on October 12 from your web store. It connected fine initially, but it no longer joins my Wi-Fi (2.4 GHz). I reset the lamp twice and reinstalled the mobile app. Still no luck. Could you help? My order number should be 78431-DE. If you need more info, let me know.

Thanks,
Lisa Meyer
```
### Default Prompts
**System prompt (default):**
```
You are a structured-output assistant for a customer-service system.
Analyze incoming messages and return ONLY valid JSON with clearly typed fields.
Return ONLY valid JSON, with no explanations.
```

**User prompt (default):**
```
Classify the customer request below and extract structured fields.

Required JSON keys:
{
  "customer_name": string,
  "issue_category": one of ["technical", "billing", "shipping", "product_question", "other"],
  "product_name": string | null,
  "product_model": string | null,
  "order_number": string | null,
  "summary": string  // short plain-text summary of the problem
}

Customer message:
<<<INPUT_TEXTAREA_CONTENT>>>

Return ONLY valid JSON.
```

## JSON Schema (expected response shape)
The app expects a top-level JSON object with the following keys (all required; use `null` if unknown):
```json
{
  "customer_name": "string or null",
  "issue_category": "technical | billing | shipping | product_question | other",
  "product_name": "string or null",
  "product_model": "string or null",
  "order_number": "string or null",
  "summary": "string"
}
```

## Behavior & Logic
- **Collapsible sections:** Each section has a button to toggle visibility. Initial open/closed state is determined by a small JS config object (e.g., open Explanation and Input by default).
- **Process button flow:**
  1. Read Config (URL, model + API key). If either is empty, show a friendly inline error and stop.
  2. Read Prompts + Input text.
  3. Build a Chat Completions request:
     - `messages`: include the system (if provided) and one user message combining the user prompt with the input text (replace placeholder `<<<INPUT_TEXTAREA_CONTENT>>>`).
     - Consider adding `temperature: 0` for determinism.
  4. `fetch` the configured endpoint with headers and body.
  5. On success:
     - Extract the model’s text (OpenAI-compatible: `choices[0].message.content`).
     - Write it to the Response textarea.
     - Try `JSON.parse`. If valid, pretty-print in the Response textarea and render the table in **Output**. If invalid, leave Output empty and keep the raw text.
  6. On failure: show the HTTP status + error body in the Response textarea; clear Output.
- **Security:** Never persist the API key; never send it to other endpoints.
- **Accessibility:** Ensure labels are associated with inputs; keyboard accessible toggles; minimal but semantic HTML.
- **Internationalization:** Keep strings simple; no i18n layer required.

## Acceptance Criteria
- Exactly one `.html` and one `.js` file; no other assets.
- A concise **README.md** written for developers that explains the goal, how to run locally, how to change the endpoint, and a short troubleshooting section.
- Page title, subtitle, and short intro at the top.
- Six sections implemented and collapsible; initial visibility configurable in JS.
- Working Config, Input, Prompts, Process button, Response textarea, and Output table.
- Valid JSON pretty-prints; invalid JSON shows raw response; table only renders on valid JSON.
- Clear, readable, well-commented minimal code (brief, not “clever”).
- No external services beyond the configured LLM endpoint.
- Works by double-clicking the HTML file in a modern desktop browser.

## Test Plan (write code testing this)
1. **Happy path:** Keep defaults, paste the default email, click Process. With a valid API key, you should see valid JSON, pretty-printed, and a table with name, category, product, model, order number, and summary.
2. **Invalid JSON:** Temporarily change the user prompt to remove “Return ONLY valid JSON”. Verify Response shows raw text and Output table is blank.
3. **Missing fields:** Ask the model for only some fields. Verify the table renders with empty cells for missing keys; no crash.
4. **Bad credentials:** Clear the API key and click Process. Verify a friendly error; no request is sent.
5. **Endpoint switch:** Change the provider URL to another OpenAI-compatible endpoint you control. Verify the request still works.
6. **Toggle UI:** Collapse/expand each section; initial state respects the JS config.
7. **Large input:** Paste a longer email; app remains responsive and behaves as above.

## Non-Goals
- No streaming, retries, or tool/function-calling.
- No persistence, analytics, or logging of secrets.
- No CSS frameworks; minimal inline styles or basic HTML only.

## Definition of Done
- Two small, readable files delivered (HTML + JS), plus a short developer-oriented README.md.
- Manual tests above pass.
- Code comments explain the core flow succinctly (inputs → prompt → fetch → JSON parse → table).
