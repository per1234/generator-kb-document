import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import slug from "slug";
import Generator from "yeoman-generator";

export default class extends Generator {
  #answers;

  #filePath;

  #promptData;

  initializing() {
    // Validate configuration.
    const promptDataPath = this.config.get("promptDataPath");
    const absolutePromptDataPath = this.destinationPath(promptDataPath);
    if (!existsSync(absolutePromptDataPath)) {
      return Promise.reject(
        new Error(
          `Prompt data file was not found at the location specified in .yo-rc.json:\n${absolutePromptDataPath}`,
        ),
      );
    }

    const templatePath = this.config.get("templatePath");
    const absoluteTemplatePath = this.destinationPath(templatePath);
    if (!existsSync(this.destinationPath(absoluteTemplatePath))) {
      return Promise.reject(
        new Error(
          `Template file was not found at the location specified in .yo-rc.json:\n${absoluteTemplatePath}`,
        ),
      );
    }

    const promptDataPathUrl = pathToFileURL(absolutePromptDataPath);

    return import(promptDataPathUrl).then((promptData) => {
      if (!("default" in promptData)) {
        return Promise.reject(
          new Error("Prompt data file does not provide a default export"),
        );
      }

      if (!Array.isArray(promptData.default)) {
        return Promise.reject(
          new Error("Prompt data default export is not an array."),
        );
      }

      this.#promptData = promptData.default;

      return Promise.resolve();
    });
  }

  prompting() {
    const builtInPrompts = [
      {
        type: "input",
        name: "kbDocumentTitle",
        message: "Knowledge base document title:",
      },
    ];

    const prompts = builtInPrompts.concat(this.#promptData);

    return this.prompt(prompts).then((answers) => {
      this.#answers = answers;
    });
  }

  configuring() {
    // Process answers

    // Trim whitespace from free text inputs.
    this.#answers.kbDocumentTitle = this.#answers.kbDocumentTitle.trim();

    const documentFolderName = slug(this.#answers.kbDocumentTitle);
    const documentFolderPath = this.destinationPath(
      this.config.get("kbPath"),
      documentFolderName,
    );

    const filename = "doc.md";
    this.#filePath = this.destinationPath(documentFolderPath, filename);
  }

  writing() {
    this.fs.copyTpl(
      this.config.get("templatePath"),
      this.#filePath,
      this.#answers,
    );
  }

  ending() {
    this.log(
      `\n\nA new knowledge base document has been created at ${this.#filePath}\n\n`,
    );
  }
}
