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
[![Check Shell Scripts status](https://github.com/per1234/generator-kb-document/actions/workflows/check-shell-task.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/check-shell-task.yml)
[![Check Taskfiles status](https://github.com/per1234/generator-kb-document/actions/workflows/check-taskfiles.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/check-taskfiles.yml)
[![Check ToC status](https://github.com/per1234/generator-kb-document/actions/workflows/check-toc-task.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/check-toc-task.yml)
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

Project website: https://github.com/per1234/generator-kb-document

## Table of contents

<!-- toc -->

- [Installation](#installation)
- [Configuration](#configuration)
  - [Generator Configuration File](#generator-configuration-file)
    - [`kbPath`](#kbpath)
    - [`promptsDataPath`](#promptsdatapath)
    - [`sortFrontMatter`](#sortfrontmatter)
    - [`templatePath`](#templatepath)
    - [`universalFrontMatter`](#universalfrontmatter)
  - [Prompts Data File](#prompts-data-file)
    - [`inquirer`](#inquirer)
    - [`usage`](#usage)
    - [`frontMatterPath`](#frontmatterpath)
    - [`processors`](#processors)
  - [Document File Template](#document-file-template)
    - [Document Title](#document-title)
    - [Prompts from Prompts Data File](#prompts-from-prompts-data-file)
- [Generator Usage](#generator-usage)
- [Example](#example)
- [Knowledge Base Structure](#knowledge-base-structure)
  - [File Structure](#file-structure)
  - [Informational Structure](#informational-structure)
- [Contributing](#contributing)
  - [Acknowledgments](#acknowledgments)

<!-- tocstop -->

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
    <generator configuration>
  }
}
```

For a better understanding of the configuration file format and functionality, see the [**Example** section](#example).

#### `kbPath`

The path of the [knowledge base folder](#knowledge-base-structure).

#### `promptsDataPath`

The path of the generator [prompts data file](#prompts-data-file).

#### `sortFrontMatter`

Boolean value to configure whether the items in the [generated front matter document](#front-matter) should be sorted in lexicographical order.

#### `templatePath`

The path of the knowledge base [document file template](#document-file-template).

#### `universalFrontMatter`

Object defining data that should be added to the front matter of every document the generator creates.

For example, if you set the `universalFrontMatter` like so:

```text
"universalFrontMatter": {
  "foo": "bar"
}
```

The front matter document available for use in your template via the [`kbDocumentFrontMatter` variable](#front-matter) will contain this content:

```text
---
foo: bar
<...>
```

This is static data. An example usage would be configuring tools that consume Markdown files and recognize special front matter keys.

You can also use the [**prompts data file**](#prompts-data-file) to configure prompts so that front matter data will be set according to the answers provided during the document creation process.

For information on front matter, see [the **Informational Structure** section](#informational-structure).

### Prompts Data File

The prompts data file defines the additional prompts that will be presented when the generator is run. The prompt names can be referenced in the [document file template](#document-file-template), which will cause the generator user's answer to the prompt to be filled in the generated knowledge base document. This allows the basic content of the knowledge base document to be efficiently populated in a standardized format at the time of document creation.

The prompts data file is written in the [**JavaScript** programming language](https://wikipedia.org/wiki/JavaScript) programming language.

The code must [export](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export) an [array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) of prompt configuration objects as the [default export](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export):

```text
const prompts = [
  <prompt configuration objects>
];

export default prompts;
```

The generator displays the prompts to the user in the order of the elements in the array.

---

The prompt configuration object contains the following properties:

#### `inquirer`

The `inquirer` property is an [**Inquirer**](https://github.com/SBoudrias/Inquirer.js) `Question` object. The format of the `Question` object is documented here:

https://github.com/SBoudrias/Inquirer.js/tree/main/packages/inquirer#question

The style of the prompt is configured by the `Question.type` property. The prompt types are explained here:

https://github.com/SBoudrias/Inquirer.js/tree/main/packages/prompts#prompts

```text
{
  inquirer: {
    <Inquirer Question object>
  },
  <...>
},
```

<a name="prompt-data-usage-property"></a>

#### `usage`

The `usage` property is an array of strings which specify how the generator should make the prompt answer available for use in the [document file template](#document-file-template):

```text
{
  inquirer: {
    <Inquirer Question object>
  },
  usage: [
    "content",
    "front matter",
  ],
  <...>
}
```

##### `content`

The answer can be referenced by the value from the [`inquirer` object's](#inquirer) `name` property anywhere in the [document file template](#document-file-template).

##### `front matter`

The answer will be included in the generated front matter document, which can be referenced as `kbDocumentFrontMatter` in the [document file template](#document-file-template). The answers to all prompts with `usage` property that contains `"front matter"` will be merged into the [front matter document](#document-file-template-front-matter).

For information on front matter, see [the **Informational Structure** section](#informational-structure).

---

❗ If you include `"front matter"` in the `usage` property, you must also set the [`frontMatterPath` property](#frontmatterpath).

---

#### `frontMatterPath`

The `frontMatterPath` property is a string that specifies the data path in the front matter document under which the answer should be added.

The JSON pointer notation is used:

https://datatracker.ietf.org/doc/html/rfc6901

---

**ⓘ** The `frontMatterPath` property is only relevant when the [`usage`](#prompt-data-usage-property) property contains `"front matter"`.

---

##### Object as Path

With the following prompt configuration object:

```javascript
{
  frontMatterPath: "/tags",
  inquirer: {
    type: "rawlist",
    name: "someTag",
    message: "Some tag:",
    choices: [
      {
        name: "Foo",
        value: "foo",
      },
      {
        name: "Bar",
        value: "bar",
      },
    ],
  },
  usage: ["front matter"],
}
```

And the following [document file template](#document-file-template):

```ejs
<%- kbDocumentFrontMatter %>
```

If the user answers "**Foo**" to the "**Some tag:**" prompt, the value of the `tags` key in the root object (AKA "[mapping](https://www.yaml.info/learn/index.html#:~:text=items%20and%20more.-,Mapping,-The%20most%20common) in YAML language terminology) will be set to the answer value `foo`. The front matter in the generated document will contain:

```markdown
---
tags: foo
---
```

##### Array as Path

In the example above, the prompt is being used to assign a [categorical tag](#informational-structure) to the document. In this case we actually want to append the answer value as an element in an array rather than setting the value of the key to a single string.

In this case we must instead set the property [to `"/tags/-"`](https://datatracker.ietf.org/doc/html/rfc6901#:~:text=exactly%20the%20single%20character%20%22%2D%22):

```text
frontMatterPath: "/tags/-"
```

If the user answers "**Foo**" to the "**Some tag:**" prompt, the front matter in the generated document will contain:

```markdown
---
tags:
  - foo
---
```

##### Answer Arrays

The [`checkbox` **Inquirer** prompt type](https://github.com/SBoudrias/Inquirer.js/tree/main/packages/checkbox#inquirercheckbox) allows the user to select multiple answers from the prompt. For this reason, it produces an array of answer values rather than a single value as is done by other prompt types. Arrays of answer values are also produced by the [`csv` processor](#processor-csv).

In this case if we used `/tags/-` as in [the above example](#array-as-path) (which is appropriate for prompt types that produce a single answer value), we would end up appending the array of answers as an element in the `tags` array, giving an unintended front matter data structure like this:

```markdown
---
tags:
  - - foo
    - bar
---
```

The intended data structure will be obtained by instead specifying the target key:

```text
frontMatterPath: "/tags"
```

Which will result in the front matter in the generated document having a structure like this:

```markdown
---
tags:
  - foo
  - bar
---
```

Just as with the single answer prompts, the answers from prompts that produce an array of answers will be merged into any existing data that was added to the front matter by previous prompts.

---

For a better understanding of the prompts data file format and functionality, see the [**Example** section](#generator-example).

---

**ⓘ** A [JSON schema](https://json-schema.org/) for validation of the prompts data is provided [**here**](etc/generator-kb-document-prompts-data-schema.json).

---

#### `processors`

**Default value:** `[]`

The `processors` property is an array of processor configuration objects which specify optional processing operations that should be performed on the answer to the prompt before making making the value available for use in the [document file template](#document-file-template):

```text
{
  inquirer: {
    <Inquirer Question object>
  },
  usage: [
    "content"
  ],
  processors: [
    {
      <processor configuration object>
    },
  ],
  <...>
}
```

The processing operations will be applied in sequence, following the order from the `processors` array.

##### `processor: "csv"`

It may be necessary for a single prompt to accept multiple answer values. When the set of possible answer values is fixed, the [`checkbox` prompt type](https://github.com/SBoudrias/Inquirer.js/tree/main/packages/checkbox#inquirercheckbox) can be used to handle this nicely, outputting an array of answers. Unfortunately **Inquirer** doesn't provide any equivalent prompt type for accepting multiple free text answer values. In this case, the best solution will be to use the [`input` prompt type](https://github.com/SBoudrias/Inquirer.js/tree/main/packages/input#inquirerinput) and pass the set of values in a string that has a delimiter-separated format (commonly referred to as [CSV](https://en.wikipedia.org/wiki/Comma-separated_values)).

###### `delimiter`

**Default value:** `","`

This processor converts the string answer value to an array by splitting it on delimiters. The delimiter can be configured via the processor configuration object's `delimiter` property:

```text
{
  processor: "csv",
  delimiter: ",",
}
```

##### `processor: "sort"`

The `sort` processor sorts an answer array in lexicographical order.

```text
{
  processor: "sort",
}
```

##### `processor: "template"`

The `template` processor transforms an answer value according to the provided template.

The template is written in the **EJS** template language:

https://ejs.co/

The answer value is available for referencing in the template as `answer`.

```text
{
  processor: "template",
  template: "The answer value is <%- answer %>",
}
```

### Document File Template

This file is the template for the knowledge base document files that will be created by the generator.

It is written in the **EJS** template language:

https://ejs.co/

---

❗ The **EJS** [`<%- reference %>` tag format](https://ejs.co/#:~:text=Outputs%20the%20unescaped%20value%20into%20the%20template) should be used in the template rather than the `<%= reference %>` format. The latter is [intended for use in generating HTML code](https://ejs.co/#:~:text=into%20the%20template%20%28-,HTML%20escaped,-%29) and is not appropriate for our use of generating Markdown.

---

For a better understanding of the document file template format and functionality, see the [**Example** section](#example).

#### Document Title

In addition to the custom prompts the user defines in their [prompts data file](#prompts-data-file), the generator always displays a "**Knowledge base document title**" prompt. The reason for this "built-in" prompt is that the generator bases the [folder name](#file-structure) of the new document on the title.

The answer to the "**Knowledge base document title**" prompt is available for use in the template via the `kbDocumentTitle` variable:

```ejs
<%- kbDocumentTitle %>
```

It is recommended to use this as the document's H1 [heading](https://www.markdownguide.org/basic-syntax/#headings):

```ejs
# <%- kbDocumentTitle %>
```

#### Prompts from Prompts Data File

##### `"content"` Prompts

If a prompt defined in the [prompts data file](#prompts-data-file) has `"content"` in its [`usage`](#prompt-data-usage-property) property, you can use the answer by referencing the value of the `name` property of the prompt data [`inquirer` object](#inquirer) in the template:

```ejs
<%- <prompt name> %>
```

<a name="document-file-template-front-matter"></a>

##### Front Matter

Front matter data can come from two sources:

- The `universalFrontMatter` key in the [**generator configuration file**](#generator-configuration-file).
- Prompts defined in the [**prompts data file**](#prompts-data-file) that have `"front matter"` in their [`usage`](#prompt-data-usage-property) property.

This data is used to populate a single generated front matter document. That front matter document is available for use in the template via the `kbDocumentFrontMatter` variable:

```ejs
<%- kbDocumentFrontMatter %>
```

For information on front matter, see [the **Informational Structure** section](#informational-structure).

## Generator Usage

1. Run the following command from a terminal in a path under the knowledge base project:
   ```text
   npx yo @per1234/kb-document
   ```
1. The "**Knowledge base document title**" prompt will be displayed in the terminal. Type the title you want to use for the new knowledge base document and press the <kbd>**Enter**</kbd> key.
1. If you defined additional prompts in the [prompts data file](#prompts-data-file), they will be presented in turn. Answer these prompts.
1. At the end of the process you will see an "**A new document has been created at ...**" message printed in the terminal. Open the file at the path shown in the message.<br />
   You will see the file has been populated according to the [document file template](#document-file-template) and your answers to the prompts.
1. Manually fill in the document content.

<a name="generator-example"></a>

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
    "promptsDataPath": "generator-kb-document/prompts.js",
    "templatePath": "generator-kb-document/template.ejs"
  }
}
```

**`prompts.js`:**

```javascript
const prompts = [
  {
    frontMatterPath: "/tags/-",
    inquirer: {
      type: "rawlist",
      name: "topic",
      message: "Topic:",
      choices: [
        {
          name: "Cooking",
          value: "cooking",
        },
        {
          name: "Games",
          value: "games",
        },
      ],
    },
    usage: ["front matter"],
  },
  {
    inquirer: {
      type: "input",
      name: "homePageUrl",
      message: "Home page URL:",
    },
    usage: ["content"],
  },
];

export default prompts;
```

**`template.ejs`:**

```ejs
<%- kbDocumentFrontMatter %>

# <%- kbDocumentTitle %>

Home Page: <%- homePageUrl %>
```

The following generator run:

```text
$ npx yo @per1234/kb-document
? Knowledge base document title: My Document
? Topic: Games
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
---
tags:
  - games
---

# My Document

Home Page: https://example.com
```

## Knowledge Base Structure

### File Structure

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

### Informational Structure

Although not part of the official **Markdown** specifications, it is common for **Markdown** tooling to recognize metadata defined in a [**YAML**](https://www.yaml.info/learn/index.html) document at the start of a **MarkDown** file. The term for this is "front matter".

The metadata defined in front matter can be used for various purposes, including

- Assigning categorical tags to a document.
  - The standardized way to do this is a [sequence](https://www.yaml.info/learn/index.html#:~:text=Sequence,-A%20sequence%20is) (i.e., array) under the `tags` key.
- Configuration of tools that consume Markdown files and recognize special front matter keys.
  - Some tools (e.g., [**Material for MkDocs**](https://squidfunk.github.io/mkdocs-material/setup/setting-up-tags/), [**Obsidian**](https://help.obsidian.md/Editing+and+formatting/Tags)) use the data from the `tags` key.

The [file structure](#file-structure) produced by the generator is flat at the document scope, with all documents stored under the root of the knowledge base folder rather than attempting to support the definition of an informational structure via folder hierarchies.

The information structure of the knowledge base should instead be defined by tags. It is through these tags that the user navigates and searches the knowledge base.

The generator can be configured to populate the front matter of the new document according to the user's answers to prompts. See the documentation for the [prompts data file](#prompts-data-file) and [document file template](#document-file-template) for details.

## Contributing

See [the **Contributor Guide**](docs/CONTRIBUTING.md).

### Acknowledgments

Thanks to the open source community who contribute to this project and the software and resources it uses!

See the [**Acknowledgments page**](docs/acknowledgments.md) for details.
