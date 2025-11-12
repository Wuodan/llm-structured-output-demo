# TASK: Write project kickoff prompt

I will start a small project to demonstrate "structured output". Project name: 'LLM-structrured-output-demo'
Your task here in this chat is to write me a markdown prompt for an AI to code the project autonomously (test and all).

> **Do not start to code or suggest code. Your task is the kickoff prompt only!**

We can discuss this in chat first, but I absolutly need that prompt as downloadable file from in the end.

Here follows my current prompt:

---

The project source code shall be one hml file plus one .js file only.

> **IMPORTANT: Very basic source code, this is for learning so it must be brief and easy to read.**

The html webiste shall have a title, a subtitle, and a short instruction/information section first.

## Website sections
Then follow several sections all having this layout:
- Title
- section is hiddable, I can set which are shown at start
- short description/instruction text
- form/output elements

### Section Explanation
has brief informational text (audience software developers) explaining what happens:
The prompts instruct LLM to return structured output


### Section Config
has these form elements:
- LLM provider url: defaults to openrouter /vi
- API-Key

### Section Input
form elements:
- input textarea: default from your example above
- Send/process button

### Section Prompts
Form elememnts (default filled with your example form above
- system prompt
- user prommpt

### Section Response
Form element:
- output textarea (readonly): nicely formatted json response

### Section Output
output element:
- table of response jaon

## JS code
The js code does:
- handling of hiding/showing sections
- onClick of the button:
  1. sends the input text (Section Input) plus prompts (Section Prompt) to the LLM from the config section
  2. Writes the response from the LLM to the output textare in Section Response
    - if the resonse is proper JSOM, pretty-print it
    - if the response is not parseable as JSON, write it raw
  3. if response is parseable fill Section Ouput. otherwise clear output