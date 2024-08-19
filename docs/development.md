# Development Guide

This is the documentation for subjects related to project development.

---

For information about contributing to the project, see the [**Contributor Guide**](CONTRIBUTING.md).

For information about project maintenance, see the [**Maintainer Guide**](maintainer-guide/maintainer-guide.md).

---

## Prerequisites

The following development tools must be available in your local environment:

- [**Go**](https://go.dev/dl/) - programming language, dependency manager
  - The **Go** version in use is defined in the `toolchain` directive of [`go.mod`](../go.mod). The minimum supported version is defined in the `go` directive of [`go.mod`](../go.mod).
  - [**gvm**](https://github.com/moovweb/gvm#installing) is recommended if you want to manage multiple installations of **Go** on your system.
- [**Node.js** / **npm**](https://nodejs.org/en/download/package-manager) - Node.js dependencies management tool
  - The **Node.js** version in use is defined in the `engines.node` field of [`package.json`](../package.json).
  - [**nvm**](https://github.com/nvm-sh/nvm#installing-and-updating) is recommended if you want to manage multiple installations of **Node.js** on your system.
- [**Python**](https://wiki.python.org/moin/BeginnersGuide/Download)
  - The **Python** version in use is defined in the `tool.poetry.dependencies` field of [`pyproject.toml`](../pyproject.toml).
- [**Task**](https://taskfile.dev/installation/) - task runner tool
  - Install **Task** by the following command from a terminal in a path under the repository:
    ```text
    go install github.com/go-task/task/v3/cmd/task
    ```

## Common Development Operations

### Running Checks

Checks and tests are set up to ensure the project content is functional and compliant with the established standards.

You can run the full suite of checks by running the following command from a terminal in a path under the repository:

```text
task check
```

### Automatic Corrections

Tools are provided to automatically bring the project into compliance with some of the required checks.

You can make these automatic fixes by running the following command from a terminal in a path under the repository:

```text
task fix
```

### Other Operations

Individual tasks are provided for each specific common validation and automated correction operation. The convenience `check` and `fix` tasks run all of the relevant individual tasks, so it is not necessary for the contributor to use the individual tasks. However, in some cases it may be more efficient to run the single specific task of interest.

You can learn the names of all the available tasks by running the following command from a terminal in a path under the repository:

```text
task --list
```

## Project Components

This is an overview of the distinct components of the project:

- [**Project documentation**](../docs): Information about the project.
- [**Generator**](../app): The **Yeoman** generator.
- [**GitHub Actions workflows**](../.github/workflows): Provide automated validation and project management.
- **Dependencies manifests**: Specify the project's code and tool dependencies.
  - [**Go** modules](../tools.go)
  - [**npm** packages](../package.json)
  - [**Python** packages](../pyproject.toml)
- [**Taskfile**](../Taskfile.yml): Definitions of the [**Task** tool](https://taskfile.dev/) tasks for common development operations.
- **Development tool configuration files**: configuration files for the project's various development tools are stored in the [root of the repository](..). See the comments in the individual files for more information.
