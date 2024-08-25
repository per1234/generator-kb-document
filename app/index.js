import Ajv from "ajv";
import { compile as ejsCompile } from "ejs";
import JSONPointer from "jsonpointer";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { join as pathPosixJoin } from "node:path/posix";
import { pathToFileURL } from "node:url";
import slug from "slug";
import { fileURLToPath } from "url";
import { stringify as yamlStringify } from "yaml";
import Generator from "yeoman-generator";

const documentPrimaryFileName = "doc.md";

/* eslint-disable no-use-before-define */
function sortThing(thing) {
  let sortedThing = thing;
  if (Array.isArray(thing)) {
    sortedThing = sortArrayRecursively(thing);
  } else if (typeof thing === "object") {
    sortedThing = sortObjectRecursively(thing);
  }
  return sortedThing;
}
/* eslint-enable no-use-before-define */

function sortArrayRecursively(array) {
  array.sort();
  const sortedArray = array.map((element) => sortThing(element));
  return sortedArray;
}

function sortObjectRecursively(object) {
  const keys = Object.keys(object);
  keys.sort();
  const sortedObject = {};
  for (let keysIndex = 0; keysIndex < keys.length; keysIndex += 1) {
    let value = object[keys[keysIndex]];
    value = sortThing(value);
    sortedObject[keys[keysIndex]] = value;
  }
  return sortedObject;
}

export default class extends Generator {
  #answers;

  #documentFolderPath;

  #generatorConfiguration;

  #templateContext;

  #templatePath;

  #filename;

  #filePath;

  #promptsData;

  initializing() {
    const generatorConfigurationDefaults = {
      sortFrontMatter: true,
      universalFrontMatter: {},
    };

    // Use defaults for any configuration property not set by user in generator configuration.
    this.#generatorConfiguration = Object.assign(
      generatorConfigurationDefaults,
      this.config.getAll(),
    );

    // Validate configuration.
    const { promptsDataPath } = this.#generatorConfiguration;
    const absolutePromptsDataPath = this.destinationPath(promptsDataPath);
    if (!existsSync(absolutePromptsDataPath)) {
      return Promise.reject(
        new Error(
          `Prompts data file was not found at the location specified in .yo-rc.json:\n${absolutePromptsDataPath}`,
        ),
      );
    }

    const { documentPrimaryTemplatePath } = this.#generatorConfiguration;
    const absoluteDocumentPrimaryTemplatePath = this.destinationPath(
      documentPrimaryTemplatePath,
    );
    if (
      !existsSync(this.destinationPath(absoluteDocumentPrimaryTemplatePath))
    ) {
      return Promise.reject(
        new Error(
          `Document primary template file was not found at the location specified in .yo-rc.json:\n${absoluteDocumentPrimaryTemplatePath}`,
        ),
      );
    }

    const { documentSupplementTemplatePath } = this.#generatorConfiguration;
    const absoluteDocumentSupplementTemplatePath = this.destinationPath(
      documentSupplementTemplatePath,
    );
    if (
      !existsSync(this.destinationPath(absoluteDocumentSupplementTemplatePath))
    ) {
      return Promise.reject(
        new Error(
          `Document supplement template file was not found at the location specified in .yo-rc.json:\n${absoluteDocumentSupplementTemplatePath}`,
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
          promptData.usages.includes("front matter") &&
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
    const universalBuiltInPrompts = [
      {
        inquirer: {
          type: "rawlist",
          name: "kbDocumentOperation",
          message: "Which operation would you like to perform?",
          choices: [
            {
              name: "Create new document",
              value: "new",
            },
            {
              name: "Add a supplement file to an existing document",
              value: "supplement",
            },
          ],
        },
        operations: ["new", "supplement"],
        usages: ["content"],
      },
      {
        inquirer: {
          type: "input",
          name: "kbDocumentTitle",
          message: "Knowledge base document title:",
        },
        operations: ["new", "supplement"],
        usages: ["content"],
      },
    ];

    const supplementBuiltInPrompts = [
      {
        inquirer: {
          type: "input",
          name: "kbDocumentSupplementTitle",
          message: "Supplement title:",
        },
        operations: ["supplement"],
        usages: ["content"],
      },
    ];

    const universalBuiltInInquirerPrompts = universalBuiltInPrompts.map(
      (promptData) => promptData.inquirer,
    );

    // Present the universal prompts.
    const promptsPromise = this.prompt(universalBuiltInInquirerPrompts).then(
      (universalBuiltInAnswers) => {
        this.#answers = universalBuiltInAnswers;

        // Validate the document title answer immediately so the user doesn't waste time answering all the additional prompts.
        const documentFolderName = slug(this.#answers.kbDocumentTitle);
        this.#documentFolderPath = this.destinationPath(
          this.#generatorConfiguration.kbPath,
          documentFolderName,
        );
        if (
          this.#answers.kbDocumentOperation === "supplement" &&
          !existsSync(this.#documentFolderPath)
        ) {
          return Promise.reject(
            new Error(
              `Target document "${this.#answers.kbDocumentTitle}" for the supplement file was not found.`,
            ),
          );
        }

        const operationConditionalPrompts = supplementBuiltInPrompts.concat(
          this.#promptsData,
        );
        const operationFilteredPrompts = operationConditionalPrompts.filter(
          (prompt) => {
            if (!("operations" in prompt)) {
              // Default to presenting the prompt for all operations.
              return true;
            }

            return prompt.operations.includes(
              this.#answers.kbDocumentOperation,
            );
          },
        );
        this.#promptsData = universalBuiltInPrompts.concat(
          operationFilteredPrompts,
        );

        const operationFilteredInquirerPrompts = operationFilteredPrompts.map(
          (promptData) => promptData.inquirer,
        );

        // Present the additional prompts.
        return this.prompt(operationFilteredInquirerPrompts).then(
          (operationFilteredAnswers) => {
            // Merge the answers to the additional prompts into the the universal prompt answers.
            Object.assign(this.#answers, operationFilteredAnswers);
          },
        );
      },
    );

    return promptsPromise;
  }

  configuring() {
    // Process answers
    this.#templateContext = [];
    let frontMatterObject = this.#generatorConfiguration.universalFrontMatter;
    Object.keys(this.#answers).forEach((answerKey) => {
      this.#promptsData.forEach((promptData) => {
        // Determine whether this is the prompt data for the answer.
        if (answerKey === promptData.inquirer.name) {
          let answerValue = this.#answers[answerKey];

          // Trim whitespace from string values.
          if (typeof answerValue === "string") {
            answerValue = answerValue.trim();
          }

          if ("processors" in promptData) {
            promptData.processors.forEach((processor) => {
              switch (processor.processor) {
                case "csv": {
                  let delimiter = ",";
                  if ("delimiter" in processor) {
                    delimiter = processor.delimiter;
                  }

                  // `String.prototype.split()` returns a single element array if it is an empty string:
                  // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/split#using_split
                  if (answerValue !== undefined && answerValue !== "") {
                    answerValue = answerValue.split(delimiter);

                    // Trim whitespace from elements.
                    answerValue = answerValue.map((element) => element.trim());
                  } else {
                    answerValue = [];
                  }

                  break;
                }
                case "join": {
                  let separator = "\n";
                  if ("separator" in processor) {
                    separator = processor.separator;
                  }

                  if (Array.isArray(answerValue)) {
                    answerValue = answerValue.join(separator);
                  } else {
                    throw new Error(
                      `"join" processor used with non-array "${answerKey}" prompt answer`,
                    );
                  }
                  break;
                }
                case "kb-link": {
                  const getLinkMarkup = function getLinkMarkup(
                    context,
                    targetDocumentTitle,
                  ) {
                    const targetDocumentFolderName = slug(targetDocumentTitle);
                    // POSIX compliant paths must be used in the link, regardless of the host architecture.
                    const targetPathKbRelativePosix = pathPosixJoin(
                      targetDocumentFolderName,
                      documentPrimaryFileName,
                    );
                    // Just in case Windows systems are uptight about POSIX compliant path separators, normalize it to
                    // the native path separator for use in the filesystem operation.
                    const targetPathKbRelativeNative = path.normalize(
                      targetPathKbRelativePosix,
                    );
                    const absoluteTargetPath = context.destinationPath(
                      context.config.get("kbPath"),
                      targetPathKbRelativeNative,
                    );
                    const linkPath = pathPosixJoin(
                      "..",
                      targetPathKbRelativePosix,
                    );

                    if (!existsSync(absoluteTargetPath)) {
                      context.log(
                        `warning: Linked KB document "${targetDocumentTitle}" does not exist.`,
                      );
                    }

                    return `[**${targetDocumentTitle}**](${linkPath})`;
                  };

                  if (Array.isArray(answerValue)) {
                    answerValue = answerValue.map((answerValueElement) =>
                      getLinkMarkup(this, answerValueElement),
                    );
                  } else {
                    answerValue = getLinkMarkup(this, answerValue);
                  }

                  break;
                }
                case "sort": {
                  if (Array.isArray(answerValue)) {
                    answerValue.sort();
                  } else {
                    throw new Error(
                      `"sort" processor used with non-array "${answerKey}" prompt answer`,
                    );
                  }
                  break;
                }
                case "template": {
                  let compiledTemplate;
                  try {
                    compiledTemplate = ejsCompile(processor.template);
                  } catch (error) {
                    throw new Error(
                      `Invalid syntax in template for "${answerKey}" prompt answer:\n${error}`,
                    );
                  }

                  try {
                    if (Array.isArray(answerValue)) {
                      answerValue = answerValue.map((answerValueElement) =>
                        compiledTemplate({ answer: answerValueElement }),
                      );
                    } else {
                      answerValue = compiledTemplate({ answer: answerValue });
                    }
                  } catch (error) {
                    throw new Error(
                      `Failed to expand template for "${answerKey}" prompt answer:\n${error}`,
                    );
                  }
                  break;
                }
                // This case can never be reached under normal operation because valid processor values are enforced by
                // the prompts data validation.
                /* istanbul ignore next */
                default: {
                  throw new Error(`Unknown processor ${processor.processor}`);
                }
              }
            });
          }

          if (promptData.usages.includes("content")) {
            this.#templateContext[answerKey] = answerValue;
          }

          if (promptData.usages.includes("front matter")) {
            // Concatenate answer arrays to existing front matter content instead of overwriting.
            if (Array.isArray(answerValue)) {
              const frontMatterPathContent = JSONPointer.get(
                frontMatterObject,
                promptData.frontMatterPath,
              );
              if (Array.isArray(frontMatterPathContent)) {
                answerValue = frontMatterPathContent.concat(answerValue);
              }
            }

            JSONPointer.set(
              frontMatterObject,
              promptData.frontMatterPath,
              answerValue,
            );
          }
        }
      });
    });

    const { sortFrontMatter } = this.#generatorConfiguration;
    if (sortFrontMatter) {
      frontMatterObject = sortThing(frontMatterObject);
    }

    // Generate front matter.
    const frontMatterString = yamlStringify(frontMatterObject, null, {
      directives: false,
    });
    // Markdown front matter is wrapped in YAML "directives end markers". The `yaml` package doesn't provide a clean way
    // to add one at the end of the document so the markers are added manually.
    const frontMatterDocument = `---\n${frontMatterString}---`;
    // Make front matter available for use in the document template.
    this.#templateContext.kbDocumentFrontMatter = frontMatterDocument;

    // Determine path for generated file.
    switch (this.#answers.kbDocumentOperation) {
      case "new": {
        this.#filename = documentPrimaryFileName;

        this.#templatePath =
          this.#generatorConfiguration.documentPrimaryTemplatePath;

        break;
      }
      case "supplement": {
        const fileSlug = slug(this.#answers.kbDocumentSupplementTitle);
        this.#filename = `${fileSlug}.md`;

        this.#templatePath =
          this.#generatorConfiguration.documentSupplementTemplatePath;

        break;
      }
      // This case can never be reached under normal operation because the operation is set by a built-in prompt that
      // only offers valid values.
      /* istanbul ignore next */
      default: {
        throw new Error(
          `Unknown operation: ${this.#answers.kbDocumentOperation}.`,
        );
      }
    }
    this.#filePath = this.destinationPath(
      this.#documentFolderPath,
      this.#filename,
    );
  }

  writing() {
    this.fs.copyTpl(this.#templatePath, this.#filePath, this.#templateContext);
  }

  ending() {
    switch (this.#answers.kbDocumentOperation) {
      case "new": {
        this.log(
          `\n\nA new knowledge base document has been created at ${this.#filePath}\n\n`,
        );

        break;
      }
      case "supplement": {
        this.log(
          `\n\nA knowledge base document supplement file has been created at ${this.#filePath}`,
        );
        this.log("\nMarkup for adding link in document primary file:");
        this.log(
          `[**${this.#answers.kbDocumentSupplementTitle}**](${this.#filename})\n\n`,
        );

        break;
      }
      // This case can never be reached under normal operation because the operation is set by a built-in prompt that
      // only offers valid values.
      /* istanbul ignore next */
      default: {
        throw new Error(
          `Unknown operation: ${this.#answers.kbDocumentOperation}.`,
        );
      }
    }
  }
}
