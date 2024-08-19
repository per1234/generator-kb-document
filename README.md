# @per1234/generator-kb-document

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
[![Spell Check status](https://github.com/per1234/generator-kb-document/actions/workflows/spell-check-task.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/spell-check-task.yml)
[![Sync Labels status](https://github.com/per1234/generator-kb-document/actions/workflows/sync-labels-npm.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/sync-labels-npm.yml)

This is a [**Yeoman**](https://yeoman.io/) generator that creates a new document in a [**Markdown**](https://daringfireball.net/projects/markdown/) file-based knowledge base.

The generator can be configured to prompt the user for arbitrary information, which can be referenced in the document template in order to populate the created document with basic content.

Although it is configurable enough to make it a general purpose tool for developing knowledge bases on any subject matter, the generator is opinionated on the structure of the knowledge base.

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
