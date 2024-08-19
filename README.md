# @per1234/generator-kb-document

[![Check EJS status](https://github.com/per1234/generator-kb-document/actions/workflows/check-ejs-task.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/check-ejs-task.yml)
[![Check Files status](https://github.com/per1234/generator-kb-document/actions/workflows/check-files-task.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/check-files-task.yml)
[![Check General Formatting status](https://github.com/per1234/generator-kb-document/actions/workflows/check-general-formatting-task.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/check-general-formatting-task.yml)
[![Check Go status](https://github.com/per1234/generator-kb-document/actions/workflows/check-go-task.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/check-go-task.yml)
[![Check JavaScript status](https://github.com/per1234/generator-kb-document/actions/workflows/check-javascript-task.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/check-javascript-task.yml)
[![Check JSON status](https://github.com/per1234/generator-kb-document/actions/workflows/check-json-task.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/check-json-task.yml)
[![Check License status](https://github.com/per1234/generator-kb-document/actions/workflows/check-license.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/check-license.yml)
[![Check Markdown status](https://github.com/per1234/generator-kb-document/actions/workflows/check-markdown-task.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/check-markdown-task.yml)
[![Check npm status](https://github.com/per1234/generator-kb-document/actions/workflows/check-npm-task.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/check-npm-task.yml)
[![Check Poetry status](https://github.com/per1234/generator-kb-document/actions/workflows/check-poetry-task.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/check-poetry-task.yml)
[![Check Prettier Formatting status](https://github.com/per1234/generator-kb-document/actions/workflows/check-prettier-formatting-task.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/check-prettier-formatting-task.yml)
[![Check Taskfiles status](https://github.com/per1234/generator-kb-document/actions/workflows/check-taskfiles.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/check-taskfiles.yml)
[![Check Workflows status](https://github.com/per1234/generator-kb-document/actions/workflows/check-workflows-task.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/check-workflows-task.yml)
[![Check YAML status](https://github.com/per1234/generator-kb-document/actions/workflows/check-yaml-task.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/check-yaml-task.yml)
[![Release npm Package status](https://github.com/per1234/generator-kb-document/actions/workflows/release-npm.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/release-npm.yml)
[![Spell Check status](https://github.com/per1234/generator-kb-document/actions/workflows/spell-check-task.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/spell-check-task.yml)
[![Sync Labels status](https://github.com/per1234/generator-kb-document/actions/workflows/sync-labels-npm.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/sync-labels-npm.yml)
[![Test JavaScript status](https://github.com/per1234/generator-kb-document/actions/workflows/test-javascript-jest-task.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/test-javascript-jest-task.yml)
[![Code coverage](https://codecov.io/gh/per1234/generator-kb-document/graph/badge.svg?token=I2HAZ6OeMs)](https://codecov.io/gh/per1234/generator-kb-document)

This is a [**Yeoman**](https://yeoman.io/) generator that creates a new document in a [**Markdown**](https://daringfireball.net/projects/markdown/) file-based knowledge base.

The generator can be configured to prompt the user for arbitrary information, which can be referenced in the document template in order to populate the created document with basic content.

Although it is configurable enough to make it a general purpose tool for developing knowledge bases on any subject matter, the generator is opinionated on the [structure of the knowledge base](#knowledge-base-structure).

## Installation

Install the **npm** packages for [**Yeoman**](https://yeoman.io/) and the generator as development dependencies of your project:

```text
npm install --save-dev yo @per1234/generator-kb-document
```

## Configuration

### Generator Configuration File

**Yeoman** generators are configured by a [JSON](https://www.json.org/) file named [`.yo-rc.json`](https://yeoman.io/authoring/storage.html#yo-rcjson-structure).

Create a file named `.yo-rc.json` in the root of your knowledge base project and open it in any text editor.

This generator is configured via the keys under the `@per1234/generator-kb-document` object in the `.yo-rc.json` file:

```text
{
  "@per1234/generator-kb-document": {
    [<generator configuration elements>]
  }
}
```

For a better understanding of the configuration file format and functionality, see the [**Example** section](#example).

#### `kbPath`

The path of the [knowledge base folder](#knowledge-base-structure).

#### `promptDataPath`

The path of the generator [prompt data file](#prompt-data-file).

#### `templatePath`

The path of the knowledge base [document file template](#document-file-template).

### Prompt Data File

The prompt data file defines the additional prompts that will be presented when the generator is run. The prompt names can be referenced in the [document file template](#document-file-template), which will cause the generator user's answer to the prompt to be filled in the generated knowledge base document. This allows the basic content of the knowledge base document to be efficiently populated in a standardized format at the time of document creation.

The prompt data file is written in the [**JavaScript** programming language](https://wikipedia.org/wiki/JavaScript) programming language.

The code must [export](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export) an [array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) of prompt configuration objects as the [default export](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export):

```text
const prompts = [<prompt configuration objects>];

export default prompts;
```

The array contains [**Inquirer**](https://github.com/SBoudrias/Inquirer.js) prompt configuration objects. The **Inquirer** prompt configuration objects are documented here:

https://github.com/SBoudrias/Inquirer.js/tree/main/packages/prompts#prompts

For a better understanding of the prompt data file format and functionality, see the [**Example** section](#example).

### Document File Template

This file is the template for the knowledge base document files that will be created by the generator.

It is written in the **EJS** template language:

https://ejs.co/

For a better understanding of the document file template format and functionality, see the [**Example** section](#example).

#### Built-in Prompts

- `kbDocumentTitle`: The answer to the "**Knowledge base document title**" prompt.

#### Prompts from Prompt Data File

You can use the answers to any of the prompts defined in the [prompt data file](#prompt-data-file) in the template by referencing the `name` field value from the prompt configuration object.

## Usage

1. Run the following command from a terminal in a path under the knowledge base project:
   ```text
   npx yo @per1234/kb-document
   ```
1. The "**Knowledge base document title**" prompt will be displayed in the terminal. Type the title you want to use for the new knowledge base document and press the <kbd>**Enter**</kbd> key.
1. If you defined additional prompts in the [prompt data file](#prompt-data-file), they will be presented in turn. Answer these prompts.
1. At the end of the process you will see an "**A new document has been created at ...**" message printed in the terminal. Open the file at the path shown in the message.<br />
   You will see the file has been populated according to the [document file template](#document-file-template) and your answers to the prompts.
1. Manually fill in the document content.

## Example

It might be helpful to take a look at a full example of a configuration and usage of the generator.

Let's say you have a knowledge base project with this file structure:

```text
<project folder>/
├── .yo-rc.json
├── generator-kb-document/
│   ├── prompts.js
│   └── template.ejs
├── my-kb/
│   │
│   ...
...
```

**`.yo-rc.json`:**

```json
{
  "@per1234/generator-kb-document": {
    "kbPath": "my-kb",
    "promptDataPath": "generator-kb-document/prompts.js",
    "templatePath": "generator-kb-document/template.ejs"
  }
}
```

**`prompts.js`:**

```javascript
const prompts = [
  {
    type: "input",
    name: "homePageUrl",
    message: "Home page URL",
  },
];

export default prompts;
```

For example, if you want to prompt the user to provide a home page URL, you would add the following content to the file:

```javascript
const prompts = [
  {
    type: "input",
    name: "homePageUrl",
    message: "Home page URL",
  },
];

export default prompts;
```

**`template.ejs`:**

```ejs
# <%- kbDocumentTitle %>

Home Page: <%- homePageUrl %>
```

The following generator run:

```text
$ npx yo @per1234/kb-document
? Knowledge base document title: My Document
? Home page URL: https://example.com

A new knowledge base document has been created at C:\my-kb-project\my-kb\my-document\doc.md
```

will result in the following file structure:

```text
<project folder>/
├── .yo-rc.json
├── generator-kb-document/
│   ├── prompts.js
│   └── template.ejs
├── my-kb/
│   ├── my-document/
│   │   └── doc.md
│   │
│   ...
...
```

And the generated `<project folder>/my-kb/my-document/doc.md` having the following content:

```markdown
# My Document

Home Page: https://example.com
```

## Knowledge Base Structure

The knowledge base is composed of a collection of files, which have the following structure:

```text
<knowledge base folder>/
├── <document title slug>/
│   ├── doc.md
│   ...
...
```

- **\<knowledge base folder\>/**: This folder is the container for all the knowledge base content files.
- **\<document title slug\>/**: This folder is the container for all the document content files. The folder name is a [normalized](https://github.com/Trott/slug#example) version of the document title.
- **doc.md**: The primary document file, written in the [**Markdown** markup language](https://www.markdownguide.org/).

## Contributing

See [the **Contributor Guide**](docs/CONTRIBUTING.md).

### Acknowledgments

Thanks to the open source community who contribute to this project and the software and resources it uses!

See the [**Acknowledgments page**](docs/acknowledgments.md) for details.
