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

This is a [**Yeoman**](https://yeoman.io/) generator that creates [new documents](#create-new-document) and [supplemental files](#add-a-document-supplement-file) in a [**Markdown**](https://daringfireball.net/projects/markdown/) file-based knowledge base.

The generator can be configured to prompt the user for arbitrary information, which can be referenced in the document template in order to populate the created document with basic content.

Although it is configurable enough to make it a general purpose tool for developing knowledge bases on any subject matter, the generator is opinionated on the [structure of the knowledge base](#knowledge-base-structure).

Project website: https://github.com/per1234/generator-kb-document

## Table of contents

<!-- toc -->

- [Installation](#installation)
- [Configuration](#configuration)
  - [Generator Configuration File](#generator-configuration-file)
    - [`kbPath`](#kbpath)
    - [`promptsConfigurationPath`](#promptsconfigurationpath)
    - [`sortFrontMatter`](#sortfrontmatter)
    - [`documentPrimaryTemplatePath`](#documentprimarytemplatepath)
    - [`documentSupplementTemplatePath`](#documentsupplementtemplatepath)
    - [`universalFrontMatter`](#universalfrontmatter)
    - [Generator Configuration JSON Schema](#generator-configuration-json-schema)
  - [Prompts Configuration File](#prompts-configuration-file)
    - [`inquirer`](#inquirer)
    - [`operations`](#operations)
    - [`usages`](#usages)
    - [`frontMatterPath`](#frontmatterpath)
    - [`processors`](#processors)
    - [Prompts Configuration JSON Schema](#prompts-configuration-json-schema)
  - [Document File Template](#document-file-template)
    - [Built-in Prompts](#built-in-prompts)
    - [Prompts from Prompts Configuration File](#prompts-from-prompts-configuration-file)
  - [Answer Arrays](#answer-arrays-1)
- [Generator Usage](#generator-usage)
  - [Create New Document](#create-new-document)
  - [Add a Document Supplement File](#add-a-document-supplement-file)
  - [Answer via Command Line Flag](#answer-via-command-line-flag)
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

#### `promptsConfigurationPath`

The path of the [prompts configuration file](#prompts-configuration-file).

#### `sortFrontMatter`

**Default value:** `true`

Boolean value to configure whether the items in the [generated front matter document](#front-matter) should be sorted in lexicographical order.

#### `documentPrimaryTemplatePath`

The path of the [template](#document-file-template) for the knowledge base document primary file.

#### `documentSupplementTemplatePath`

The path of the [template](#document-file-template)for knowledge base document supplemental files.

#### `universalFrontMatter`

**Default value:** `{}`

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

You can also use the [**prompts configuration file**](#prompts-configuration-file) to configure prompts so that front matter data will be set according to the answers provided during the document creation process.

For information on front matter, see [the **Informational Structure** section](#informational-structure).

#### Generator Configuration JSON Schema

A [JSON schema](https://json-schema.org/) for validation of the generator configuration is provided [**here**](etc/generator-kb-document-configuration-schema.json).

### Prompts Configuration File

The prompts configuration file defines the additional prompts that will be presented when the generator is run. The prompt names can be referenced in the [document file template](#document-file-template), which will cause the generator user's answer to the prompt to be filled in the generated knowledge base document. This allows the basic content of the knowledge base document to be efficiently populated in a standardized format at the time of document creation.

The prompts configuration file is written in the [**JavaScript** programming language](https://wikipedia.org/wiki/JavaScript) programming language.

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

#### `operations`

**Default value:** `["new", "supplement"]`

The `operations` property is an array of strings which specify on which operations the generator should present the prompt to the user.

The user

```text
{
  inquirer: {
    <Inquirer Question object>
  },
  operations: [
    "new",
    "supplement",
  ],
  <...>
}
```

##### `new`

The prompt should be presented when the user selected ["**Create new document**"](#create-new-document) from the built-in "**Which operation would you like to perform?**" prompt.

##### `supplement`

The prompt should be presented when the user selected ["**Add a supplement file to an existing document**"](#add-a-document-supplement-file) from the built-in "**Which operation would you like to perform?**" prompt.

<a name="prompt-configuration-usages-property"></a>

#### `usages`

**Default value:** `["content"]`

The `usages` property is an array of strings which specify how the generator should make the prompt answer available for use in the [document file template](#document-file-template):

```text
{
  inquirer: {
    <Inquirer Question object>
  },
  usages: [
    "content",
    "front matter",
  ],
  <...>
}
```

##### `content`

The answer can be referenced by the value from the [`inquirer` object's](#inquirer) `name` property anywhere in the [document file template](#document-file-template).

##### `front matter`

The answer will be included in the generated front matter document, which can be referenced as `kbDocumentFrontMatter` in the [document file template](#document-file-template). The answers to all prompts with `usages` property that contains `"front matter"` will be merged into the [front matter document](#document-file-template-front-matter).

For information on front matter, see [the **Informational Structure** section](#informational-structure).

---

❗ If you include `"front matter"` in the `usages` property, you must also set the [`frontMatterPath` property](#frontmatterpath).

---

#### `frontMatterPath`

The `frontMatterPath` property is a string that specifies the data path in the front matter document under which the answer should be added.

The JSON pointer notation is used:

https://datatracker.ietf.org/doc/html/rfc6901

---

**ⓘ** The `frontMatterPath` property is only relevant when the [`usages`](#prompt-configuration-usages-property) property contains `"front matter"`.

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
  usages: ["front matter"],
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

<a name="prompts-configuration-file-frontmatterpath-answer-arrays"></a>

##### Answer Arrays

A prompt might produce answer values in either of two data formats:

- Single answer
- [Answer array](#configuration-answer-arrays)

In the case of an answer array, if we used `/tags/-` as in [the above example](#array-as-path) (which is appropriate for prompt types that produce a single answer value), we would end up appending the array as an element in the `tags` array, giving an unintended front matter data structure like this:

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

For a better understanding of the prompts configuration file format and functionality, see the [**Example** section](#generator-example).

#### `processors`

**Default value:** `[]`

The `processors` property is an array of processor configuration objects which specify optional processing operations that should be performed on the answer to the prompt before making making the value available for use in the [document file template](#document-file-template):

```text
{
  inquirer: {
    <Inquirer Question object>
  },
  usages: [
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

It may be necessary for a single prompt to accept multiple answer values. When the set of possible answer values is fixed, the [`checkbox` prompt type](https://github.com/SBoudrias/Inquirer.js/tree/main/packages/checkbox#inquirercheckbox) can be used to handle this nicely. Unfortunately **Inquirer** doesn't provide any equivalent prompt type for accepting multiple free text answer values. In this case, the best solution will be to use the [`input` prompt type](https://github.com/SBoudrias/Inquirer.js/tree/main/packages/input#inquirerinput) and pass the set of values in a string that has a delimiter-separated format (commonly referred to as [CSV](https://en.wikipedia.org/wiki/Comma-separated_values)).

This processor handles the parsing of a delimiter-separated answer value, converting it to an [answer array](#configuration-answer-arrays).

###### `delimiter`

**Default value:** `","`

This processor converts the string answer value to an array by splitting it on delimiters. The delimiter can be configured via the processor configuration object's `delimiter` property:

```text
{
  processor: "csv",
  delimiter: ",",
}
```

##### `processor: "join"`

The `join` processor transforms an [answer array](#configuration-answer-arrays) into a single string by concatenating all the elements.

###### `separator`

**Default value:** `"\n"`

The string to insert between the elements can be configured via the processor configuration object's `separator` property.

```text
{
  processor: "join",
  separator: "\n",
}
```

##### `processor: "kb-link"`

The `kb-link` processor transforms an answer value into a link to the document of that name in the knowledge base.

```text
{
  processor: "kb-link",
}
```

When the input is an [answer array](#configuration-answer-arrays), each of the elements in the array is transformed into a link.

##### `processor: "sort"`

The `sort` processor sorts an [answer array](#configuration-answer-arrays) in lexicographical order.

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

When the input is an [answer array](#configuration-answer-arrays), the processor transforms each of the elements in the array.

#### Prompts Configuration JSON Schema

A [JSON schema](https://json-schema.org/) for validation of the prompts configuration is provided [**here**](etc/generator-kb-document-prompts-configuration-schema.json).

### Document File Template

This file is the template for the knowledge base document files that will be created by the generator.

It is written in the **EJS** template language:

https://ejs.co/

---

❗ The **EJS** [`<%- reference %>` tag format](https://ejs.co/#:~:text=Outputs%20the%20unescaped%20value%20into%20the%20template) should be used in the template rather than the `<%= reference %>` format. The latter is [intended for use in generating HTML code](https://ejs.co/#:~:text=into%20the%20template%20%28-,HTML%20escaped,-%29) and is not appropriate for our use of generating Markdown.

---

For a better understanding of the document file template format and functionality, see the [**Example** section](#example).

#### Built-in Prompts

In addition to the custom prompts the user defines in their [prompts configuration file](#prompts-configuration-file), the generator always displays a series of prompts for information that is used by the generator.

The answers to these "built-in" prompts are available for use in the template just the same as the user-defined prompts.

##### Operation

The answer to the "**Which operation would you like to perform?**" prompt is available for use in the template via the `kbDocumentOperation` variable:

```ejs
<%- kbDocumentOperation %>
```

- If the user chose the "[**Create new document**](#create-new-document)" option, the value will be `new`.
- If the user chose the "[**Add a supplement file to an existing document**](#add-a-document-supplement-file)" option, the value will be `supplement`.

##### Document Title

The answer to the "**Knowledge base document title**" prompt is available for use in the template via the `kbDocumentTitle` variable:

```ejs
<%- kbDocumentTitle %>
```

It is recommended to use this as the document's H1 [heading](https://www.markdownguide.org/basic-syntax/#headings):

```ejs
# <%- kbDocumentTitle %>
```

##### Supplement Title

If the user selects the "**Add a supplement file to an existing document**" option from the "**Which operation would you like to perform?**" prompt, they will also be presented with a "**Supplement title**" prompt. The answer to this prompt is available for use in the template via the `kbDocumentSupplementTitle` variable:

```ejs
<%- kbDocumentSupplementTitle %>
```

It is recommended to use this as the document supplement file's H1 [heading](https://www.markdownguide.org/basic-syntax/#headings):

```ejs
# <%- kbDocumentSupplementTitle %>
```

#### Prompts from Prompts Configuration File

##### `"content"` Prompts

If a prompt defined in the [prompts configuration file](#prompts-configuration-file) has `"content"` in its [`usages`](#prompt-configuration-usages-property) property, you can use the answer by referencing the value of the `name` property of the prompt configuration [`inquirer` object](#inquirer) in the template:

```ejs
<%- <prompt name> %>
```

<a name="document-file-template-front-matter"></a>

##### Front Matter

Front matter data can come from two sources:

- The `universalFrontMatter` key in the [**generator configuration file**](#generator-configuration-file).
- Prompts defined in the [**prompts configuration file**](#prompts-configuration-file) that have `"front matter"` in their [`usages`](#prompt-configuration-usages-property) property.

This data is used to populate a single generated front matter document. That front matter document is available for use in the template via the `kbDocumentFrontMatter` variable:

```ejs
<%- kbDocumentFrontMatter %>
```

For information on front matter, see [the **Informational Structure** section](#informational-structure).

<a name="configuration-answer-arrays"></a>

### Answer Arrays

The [`checkbox` **Inquirer** prompt type](https://github.com/SBoudrias/Inquirer.js/tree/main/packages/checkbox#inquirercheckbox) allows the user to select multiple answers from the prompt. For this reason, it produces an array of answer values rather than a single value as is done by other prompt types.

Arrays of answer values are also produced by the [`csv` processor](#processor-csv).

There are special considerations for handling this distinct answer data type:

- [In answer processing](#processors)
- [In front matter](#prompts-configuration-file-frontmatterpath-answer-arrays)
- [In the document file template](#document-file-template)

---

**ⓘ** **Inquirer** doesn't provide a prompt type for obtaining multiple free text answers. If you need this capability in your project, the generator can be configured to extract multiple values from a single answer in delimiter-separated format. See the information [**here**](#processor-csv) for details.

---

## Generator Usage

### Create New Document

This procedure is used to add a new document to the knowledge base.

1. Run the following command from a terminal in a path under the knowledge base project:
   ```text
   npx yo @per1234/kb-document
   ```
1. The "**Which operation would you like to perform?**" prompt will be displayed in the terminal. Select the "**Create new document**" option and press the <kbd>**Enter**</kbd> key.
1. The "**Knowledge base document title**" prompt will be displayed in the terminal. Type the title you want to use for the new knowledge base document and press the <kbd>**Enter**</kbd> key.
1. If you defined additional prompts in the [prompts configuration file](#prompts-configuration-file), they will be presented in turn. Answer these prompts.
1. At the end of the process you will see an "**A new document has been created at ...**" message printed in the terminal. Open the file at the path shown in the message.<br />
   You will see the file has been populated according to the [document file template](#document-file-template) and your answers to the prompts.
1. Manually fill in the document content.

### Add a Document Supplement File

This procedure is used to add a supplement file to an existing knowledge base document. Knowledge base document supplements are used to split lengthy document content into multiple files (as opposed to having it all in the document primary file).

1. Run the following command from a terminal in a path under the knowledge base project:
   ```text
   npx yo @per1234/kb-document
   ```
1. The "**Which operation would you like to perform?**" prompt will be displayed in the terminal. Select the "**Add a supplement file to an existing document**" option and press the <kbd>**Enter**</kbd> key.
1. The "**Knowledge base document title**" prompt will be displayed in the terminal. Type the title of the existing knowledge base document to which you want to add a supplement file and press the <kbd>**Enter**</kbd> key.
1. If you defined additional prompts in the [prompts configuration file](#prompts-configuration-file), they will be presented in turn. Answer these prompts.
1. At the end of the process you will see an "**A knowledge base document supplement file has been created at ...**" message printed in the terminal. Open the file at the path shown in the message.<br />
   You will see the file has been populated according to the [document file template](#document-file-template) and your answers to the prompts.
1. Manually fill in the document content.

### Answer via Command Line Flag

As an alternative to providing answers via the human-friendly prompts interface, the generator supports providing answers via command line flags passed to the generator invocation:

```text
npx yo @per1234/kb-document --<prompt name>=<answer>
```

---

**ⓘ** You can provide multiple answers to a single prompt (for prompt types that produce an [answer array](#configuration-answer-arrays)) by passing the flag multiple times:

```text
npx yo @per1234/kb-document --foo="Pippo" --foo="Pluto"
```

---

Providing answers via command line flags can be useful for automated use cases for which the generator's interactive prompt interface is not appropriate.

The built-in prompts have the following names:

- **Which operation would you like to perform?**: `kbDocumentOperation`
- **Knowledge base document title**: `kbDocumentTitle`
- **Supplement title**: `kbDocumentSupplementTitle`

As for additional [user-configured prompts](#prompts-configuration-file), the prompt name is defined by the `name` property of the [**Inquirer** `Question` object](#inquirer).

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
    "promptsConfigurationPath": "generator-kb-document/prompts.js",
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
    usages: ["front matter"],
  },
  {
    inquirer: {
      type: "input",
      name: "homePageUrl",
      message: "Home page URL:",
    },
    usages: ["content"],
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
│   ├── <supplement title slug>.md
│   ...
...
```

- **\<knowledge base folder\>/**: This folder is the container for all the knowledge base content files.
- **\<document title slug\>/**: This folder is the container for all the document content files. The folder name is a [normalized](https://github.com/Trott/slug#example) version of the document title.
- **doc.md**: The knowledge base document primary file, written in the [**Markdown** markup language](https://www.markdownguide.org/).
- **\<supplement title slug\>.md**: A knowledge base document supplement file, the name of which is a normalized version of the supplement title. Document supplements are used to split lengthy document content into multiple files.

### Informational Structure

Although not part of the official **Markdown** specifications, it is common for **Markdown** tooling to recognize metadata defined in a [**YAML**](https://www.yaml.info/learn/index.html) document at the start of a **MarkDown** file. The term for this is "front matter".

The metadata defined in front matter can be used for various purposes, including

- Assigning categorical tags to a document.
  - The standardized way to do this is a [sequence](https://www.yaml.info/learn/index.html#:~:text=Sequence,-A%20sequence%20is) (i.e., array) under the `tags` key.
- Configuration of tools that consume Markdown files and recognize special front matter keys.
  - Some tools (e.g., [**Material for MkDocs**](https://squidfunk.github.io/mkdocs-material/setup/setting-up-tags/), [**Obsidian**](https://help.obsidian.md/Editing+and+formatting/Tags)) use the data from the `tags` key.

The [file structure](#file-structure) produced by the generator is flat at the document scope, with all documents stored under the root of the knowledge base folder rather than attempting to support the definition of an informational structure via folder hierarchies.

The information structure of the knowledge base should instead be defined by tags. It is through these tags that the user navigates and searches the knowledge base.

The generator can be configured to populate the front matter of the new document according to the user's answers to prompts. See the documentation for the [prompts configuration file](#prompts-configuration-file) and [document file template](#document-file-template) for details.

## Contributing

See [the **Contributor Guide**](docs/CONTRIBUTING.md).

### Acknowledgments

Thanks to the open source community who contribute to this project and the software and resources it uses!

See the [**Acknowledgments page**](docs/acknowledgments.md) for details.
