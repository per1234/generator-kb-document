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

const primaryDocumentFilename = "doc.md";

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

  #templateContext;

  #filePath;

  #promptsData;

  initializing() {
    this.config.defaults({
      sortFrontMatter: true,
      universalFrontMatter: {},
    });

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
    let frontMatterObject = this.config.get("universalFrontMatter");
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
                      primaryDocumentFilename,
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

          if (promptData.usage.includes("content")) {
            this.#templateContext[answerKey] = answerValue;
          }

          if (promptData.usage.includes("front matter")) {
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

    const sortFrontMatter = this.config.get("sortFrontMatter");
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
