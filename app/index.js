import Ajv from "ajv";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import slug from "slug";
import { fileURLToPath } from "url";
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

      // Validate prompts data format.
      const moduleFilePath = fileURLToPath(import.meta.url);
      const moduleFolderPath = path.dirname(moduleFilePath);
      const schemaPath = path.join(
        moduleFolderPath,
        "../etc/generator-kb-document-prompts-data-schema.json",
      );
      const rawSchema = readFileSync(schemaPath, {
        encoding: "utf8",
      });
      const schema = JSON.parse(rawSchema);
      const ajv = new Ajv();
      const schemaValidator = ajv.compile(schema);

      const valid = schemaValidator(promptsData.default);
      if (!valid) {
        const validationErrors = JSON.stringify(
          schemaValidator.errors,
          null,
          2,
        );
        return Promise.reject(
          new Error(
            `Prompts data has an invalid data format:\n${validationErrors}`,
          ),
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
