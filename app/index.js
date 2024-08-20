import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import slug from "slug";
import Generator from "yeoman-generator";

export default class extends Generator {
  #answers;

  #filePath;

  #promptsData;

  initializing() {
    // Validate configuration.
    const promptsDataPath = this.config.get("promptsDataPath");
    const absolutePromptsDataPath = this.destinationPath(promptsDataPath);
    if (!existsSync(absolutePromptsDataPath)) {
      return Promise.reject(
        new Error(
          `Prompts data file was not found at the location specified in .yo-rc.json:\n${absolutePromptsDataPath}`,
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

    const promptsDataPathUrl = pathToFileURL(absolutePromptsDataPath);

    return import(promptsDataPathUrl).then((promptsData) => {
      if (!("default" in promptsData)) {
        return Promise.reject(
          new Error("Prompts data file does not provide a default export"),
        );
      }

      if (!Array.isArray(promptsData.default)) {
        return Promise.reject(
          new Error("Prompts data default export is not an array."),
        );
      }

      this.#promptsData = promptsData.default;

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

    const prompts = builtInPrompts.concat(this.#promptsData);

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
