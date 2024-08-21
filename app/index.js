import Ajv from "ajv";
import JSONPointer from "jsonpointer";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import slug from "slug";
import { fileURLToPath } from "url";
import { stringify as yamlStringify } from "yaml";
import Generator from "yeoman-generator";

export default class extends Generator {
  #answers;

  #templateContext;

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
      // Validation using JSON schema.
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

      // Perform additional validations that are not possible via the JSON schema.
      let missingFrontMatterPath = false;
      let missingFrontMatterPathName = "";
      promptsData.default.forEach((promptData) => {
        if (
          promptData.usage.includes("front matter") &&
          !("frontMatterPath" in promptData)
        ) {
          missingFrontMatterPath = true;
          missingFrontMatterPathName = promptData.inquirer.name;
        }
      });

      if (missingFrontMatterPath) {
        return Promise.reject(
          new Error(
            `Data for ${missingFrontMatterPathName} prompt has "front matter" usage configuration, but missing frontMatterPath property.`,
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
        inquirer: {
          type: "input",
          name: "kbDocumentTitle",
          message: "Knowledge base document title:",
        },
        usage: ["content"],
      },
    ];

    this.#promptsData = builtInPrompts.concat(this.#promptsData);

    const inquirerPrompts = this.#promptsData.map(
      (promptData) => promptData.inquirer,
    );

    return this.prompt(inquirerPrompts).then((answers) => {
      this.#answers = answers;
    });
  }

  configuring() {
    // Process answers
    this.#templateContext = [];
    const frontMatterObject = {};
    Object.keys(this.#answers).forEach((answerKey) => {
      this.#promptsData.forEach((promptData) => {
        // Determine whether this is the prompt data for the answer.
        if (answerKey === promptData.inquirer.name) {
          const answerValue = this.#answers[answerKey];

          if (promptData.usage.includes("content")) {
            this.#templateContext[answerKey] = answerValue;
          }

          if (promptData.usage.includes("front matter")) {
            JSONPointer.set(
              frontMatterObject,
              promptData.frontMatterPath,
              answerValue,
            );
          }
        }
      });
    });

    // Generate front matter.
    const frontMatterString = yamlStringify(frontMatterObject, null, {
      collectionStyle: "block",
      directives: false,
    });
    // Markdown front matter is wrapped in YAML "directives end markers". The `yaml` package doesn't provide a clean way
    // to add one at the end of the document so the markers are added manually.
    const frontMatterDocument = `---\n${frontMatterString}---`;
    // Make front matter available for use in the document template.
    this.#templateContext.kbDocumentFrontMatter = frontMatterDocument;

    // Trim whitespace from free text inputs.
    this.#answers.kbDocumentTitle = this.#answers.kbDocumentTitle.trim();

    // Determine path for generated file.
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
      this.#templateContext,
    );
  }

  ending() {
    this.log(
      `\n\nA new knowledge base document has been created at ${this.#filePath}\n\n`,
    );
  }
}
