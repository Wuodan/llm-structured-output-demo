# LLM-DEMO : Project Idea

This describes the project idea for the LLM-DEMO project.

The final product is a one-file website which shows and tests capabilities of LLMs.

## Website Layout

The website is minmal with a title, a subtitle and a short text below.
Keep it simple, no frills - this will be a large source file anyway.

It is split into only 2 files: index.html and index.js and must work when started from the file system.

### Table of Contents

Then follows a dynamic ToC, each entry is a link to a section.
This is a flat structure, one level only.
Each item represents a section of the website, which opens when the item is clicked (other open sections are then closed).
On startup, the available sections are scanned dynamically and the ToC is generated.
The item in the ToC is the title of the section.

### Sections

#### Section Template

A section is a part of the website which is hidden on start and displayed/hidden when the user clicks on the corresponding item in the ToC.
The section also has an X button to close the section.

A section has a title, a subtitle and a short text below.

#### Section Configuration

In the configuration section is a form for the user to configure settings which will be used in the other sections.

The form has a submit button to save the settings.

##### Provider configuration

In the provider configuration one can enter one or several p
