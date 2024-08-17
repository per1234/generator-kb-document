# Development Guide

## Prerequisites

The following development tools must be available in your local environment:

- [**Node.js** / **npm**](https://nodejs.org/en/download/package-manager) - Node.js dependencies management tool
  - The **Node.js** version in use is defined in the `engines.node` field of [`package.json`](../package.json).
  - [**nvm**](https://github.com/nvm-sh/nvm#installing-and-updating) is recommended if you want to manage multiple installations of **Node.js** on your system.

## Project Components

This is an overview of the distinct components of the project:

- [**Project documentation**](../docs): Information about the project.
- **Dependencies manifests**: Specify the project's code and tool dependencies.
  - [**npm** packages](../package.json)
- **Development tool configuration files**: configuration files for the project's various development tools are stored in the [root of the repository](..). See the comments in the individual files for more information.
