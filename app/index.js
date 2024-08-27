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

  #promptsConfiguration;

  initializing() {
    const generatorConfigurationDefaults = {
      sortFrontMatter: true,
      universalFrontMatter: {},
    };

    const promptConfigurationDefaults = {
      operations: ["new", "supplement"],
      processors: [],
      usages: ["content"],
    };

    const promptConfigurationProcessorDefaults = [
      {
        processor: "csv",
        delimiter: ",",
      },
      {
        processor: "join",
        separator: "\n",
      },
    ];

    this.#generatorConfiguration = this.config.getAll();

    // Provide a user friendly message if the generator configuration is missing.
    // this.config.getAll() always returns an object so empty object is used as indicator of missing generator config.
    if (Object.keys(this.#generatorConfiguration).length === 0) {
      return Promise.reject(
        new Error(
          "Missing generator configuration.\nSee: https://github.com/per1234/generator-kb-document#generator-configuration-file",
        ),
      );
    }

    // Validate generator configuration data format against JSON schema.
    const moduleFilePath = fileURLToPath(import.meta.url);
    const moduleFolderPath = path.dirname(moduleFilePath);
    const generatorConfigurationSchemaPath = path.join(
      moduleFolderPath,
      "../etc/generator-kb-document-configuration-schema.json",
    );
    const rawGeneratorConfigurationSchema = readFileSync(
      generatorConfigurationSchemaPath,
      {
        encoding: "utf8",
      },
    );
    const generatorConfigurationSchema = JSON.parse(
      rawGeneratorConfigurationSchema,
    );
    const ajv = new Ajv();
    const generatorConfigurationSchemaValidator = ajv.compile(
      generatorConfigurationSchema,
    );

    const generatorConfigurationValid = generatorConfigurationSchemaValidator(
      this.#generatorConfiguration,
    );
    if (!generatorConfigurationValid) {
      const validationErrors = JSON.stringify(
        generatorConfigurationSchemaValidator.errors,
        null,
        2,
      );
      return Promise.reject(
        new Error(
          `Generator configuration has an invalid data format:\n${validationErrors}`,
        ),
      );
    }

    // Use defaults for any configuration property not set by user in generator configuration.
    this.#generatorConfiguration = Object.assign(
      generatorConfigurationDefaults,
      this.#generatorConfiguration,
    );

    // Perform additional generator configuration validations that are not possible via the JSON schema.
    const { promptsConfigurationPath } = this.#generatorConfiguration;
    const absolutePromptsConfigurationPath = this.destinationPath(
      promptsConfigurationPath,
    );
    if (!existsSync(absolutePromptsConfigurationPath)) {
      return Promise.reject(
        new Error(
          `Prompts configuration file was not found at the location specified in .yo-rc.json:\n${absolutePromptsConfigurationPath}`,
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

    const promptsConfigurationPathUrl = pathToFileURL(
      absolutePromptsConfigurationPath,
    );

    return import(promptsConfigurationPathUrl).then((promptsConfiguration) => {
      if (!("default" in promptsConfiguration)) {
        return Promise.reject(
          new Error(
            "Prompts configuration file does not provide a default export",
          ),
        );
      }

      this.#promptsConfiguration = promptsConfiguration.default;

      // Validate prompts configuration data format.
      // Validation using JSON schema.
      const promptsConfigurationSchemaPath = path.join(
        moduleFolderPath,
        "../etc/generator-kb-document-prompts-configuration-schema.json",
      );
      const promptsConfigurationRawSchema = readFileSync(
        promptsConfigurationSchemaPath,
        {
          encoding: "utf8",
        },
      );
      const promptsConfigurationSchema = JSON.parse(
        promptsConfigurationRawSchema,
      );
      const promptsConfigurationSchemaValidator = ajv.compile(
        promptsConfigurationSchema,
      );

      const valid = promptsConfigurationSchemaValidator(
        this.#promptsConfiguration,
      );
      if (!valid) {
        const validationErrors = JSON.stringify(
          promptsConfigurationSchemaValidator.errors,
          null,
          2,
        );
        return Promise.reject(
          new Error(
            `Prompts configuration has an invalid data format:\n${validationErrors}`,
          ),
        );
      }

      // Use defaults for prompt configuration properties not set by user in prompts configuration file.
      this.#promptsConfiguration = this.#promptsConfiguration.map(
        (promptConfiguration) => {
          const promptConfigurationWithDefaults = {
            ...promptConfigurationDefaults,
            ...promptConfiguration,
          };

          promptConfigurationWithDefaults.processors =
            promptConfigurationWithDefaults.processors.map((processor) => {
              let processorWithDefaults = processor;
              promptConfigurationProcessorDefaults.forEach(
                (promptConfigurationProcessorDefault) => {
                  if (
                    processorWithDefaults.processor ===
                    promptConfigurationProcessorDefault.processor
                  ) {
                    processorWithDefaults = {
                      ...promptConfigurationProcessorDefault,
                      ...processor,
                    };
                  }
                },
              );

              return processorWithDefaults;
            });

          return promptConfigurationWithDefaults;
        },
      );

      // Perform additional validations that are not possible via the JSON schema.
      let missingFrontMatterPath = false;
      let missingFrontMatterPathName = "";
      this.#promptsConfiguration.forEach((promptConfiguration) => {
        if (
          promptConfiguration.usages.includes("front matter") &&
          !("frontMatterPath" in promptConfiguration)
        ) {
          missingFrontMatterPath = true;
          missingFrontMatterPathName = promptConfiguration.inquirer.name;
        }
      });

      if (missingFrontMatterPath) {
        return Promise.reject(
          new Error(
            `Data for ${missingFrontMatterPathName} prompt has "front matter" usage configuration, but missing frontMatterPath property.`,
          ),
        );
      }

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
        processors: [],
        usages: ["content"],
      },
      {
        inquirer: {
          type: "input",
          name: "kbDocumentTitle",
          message: "Knowledge base document title:",
        },
        operations: ["new", "supplement"],
        processors: [],
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
        processors: [],
        usages: ["content"],
      },
    ];

    const universalBuiltInInquirerPrompts = universalBuiltInPrompts.map(
      (promptConfiguration) => promptConfiguration.inquirer,
    );

    this.#answers = {};

    // Get answers from command line flags.
    const setFlagAnswers = (inquirerPrompts) =>
      inquirerPrompts.map((inquirerPrompt) => {
        const updatedInquirerPrompt = inquirerPrompt;
        if (inquirerPrompt.name in this.options) {
          let answerValue = this.options[inquirerPrompt.name];

          // The flag system doesn't have any way to know the correct type for the option and the user doesn't have any
          // control over the type it uses. So string values must be converted to arrays for prompt types that generate
          // answer arrays.
          if (
            typeof answerValue === "string" &&
            inquirerPrompt.type === "checkbox"
          ) {
            answerValue = [answerValue];
          }

          this.#answers[inquirerPrompt.name] = answerValue;
          // Don't present the prompt if answer provided via flag.
          updatedInquirerPrompt.when = false;
        } else {
          updatedInquirerPrompt.when = true;
        }

        return updatedInquirerPrompt;
      });

    const universalBuiltInInquirerPromptsPerFlagAnswers = setFlagAnswers(
      universalBuiltInInquirerPrompts,
    );

    // Present the universal prompts.
    const promptsPromise = this.prompt(
      universalBuiltInInquirerPromptsPerFlagAnswers,
    ).then((universalBuiltInAnswers) => {
      // Merge answers from the prompts into the answers from command line flags.
      Object.assign(this.#answers, universalBuiltInAnswers);

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
        this.#promptsConfiguration,
      );
      const operationFilteredPrompts = operationConditionalPrompts.filter(
        (prompt) =>
          prompt.operations.includes(this.#answers.kbDocumentOperation),
      );
      this.#promptsConfiguration = universalBuiltInPrompts.concat(
        operationFilteredPrompts,
      );

      const operationFilteredInquirerPrompts = operationFilteredPrompts.map(
        (promptConfiguration) => promptConfiguration.inquirer,
      );

      const operationFilteredInquirerPromptsPerFlagAnswers = setFlagAnswers(
        operationFilteredInquirerPrompts,
      );

      // Present the additional prompts.
      return this.prompt(operationFilteredInquirerPromptsPerFlagAnswers).then(
        (operationFilteredAnswers) => {
          // Merge the answers to the additional prompts into the universal prompt answers.
          Object.assign(this.#answers, operationFilteredAnswers);
        },
      );
    });

    return promptsPromise;
  }

  configuring() {
    // Process answers
    this.#templateContext = [];
    let frontMatterObject = this.#generatorConfiguration.universalFrontMatter;
    Object.keys(this.#answers).forEach((answerKey) => {
      this.#promptsConfiguration.forEach((promptConfiguration) => {
        // Determine whether this is the prompt configuration for the answer.
        if (answerKey === promptConfiguration.inquirer.name) {
          let answerValue = this.#answers[answerKey];

          // Trim whitespace from string values.
          if (typeof answerValue === "string") {
            answerValue = answerValue.trim();
          }

          promptConfiguration.processors.forEach((processor) => {
            switch (processor.processor) {
              case "csv": {
                // `String.prototype.split()` returns a single element array if it is an empty string:
                // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/split#using_split
                if (answerValue !== undefined && answerValue !== "") {
                  answerValue = answerValue.split(processor.delimiter);

                  // Trim whitespace from elements.
                  answerValue = answerValue.map((element) => element.trim());
                } else {
                  answerValue = [];
                }

                break;
              }
              case "join": {
                if (Array.isArray(answerValue)) {
                  answerValue = answerValue.join(processor.separator);
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
              // the prompts configuration validation.
              /* istanbul ignore next */
              default: {
                throw new Error(`Unknown processor ${processor.processor}`);
              }
            }
          });

          if (promptConfiguration.usages.includes("content")) {
            this.#templateContext[answerKey] = answerValue;
          }

          if (promptConfiguration.usages.includes("front matter")) {
            // Concatenate answer arrays to existing front matter content instead of overwriting.
            if (Array.isArray(answerValue)) {
              const frontMatterPathContent = JSONPointer.get(
                frontMatterObject,
                promptConfiguration.frontMatterPath,
              );
              if (Array.isArray(frontMatterPathContent)) {
                answerValue = frontMatterPathContent.concat(answerValue);
              }
            }

            JSONPointer.set(
              frontMatterObject,
              promptConfiguration.frontMatterPath,
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
