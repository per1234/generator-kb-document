# @per1234/generator-kb-document

[![Check npm status](https://github.com/per1234/generator-kb-document/actions/workflows/check-npm-task.yml/badge.svg)](https://github.com/per1234/generator-kb-document/actions/workflows/check-npm-task.yml)

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
