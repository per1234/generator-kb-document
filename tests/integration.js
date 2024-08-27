import { afterAll, beforeEach, describe, expect, test } from "@jest/globals";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import helpers, { result } from "yeoman-test";
import Generator from "../app";

const moduleFilePath = fileURLToPath(import.meta.url);
const moduleFolderPath = path.dirname(moduleFilePath);
const testDataPath = path.join(moduleFolderPath, "testdata");
const generatorPath = path.join(moduleFolderPath, "../app/index.js");
const generatorOptions = { resolved: generatorPath };
const kbPath = "kb";
const documentTitle = "Foo Title";
const documentSlug = "foo-title";
const documentPrimaryFileName = "doc.md";
const documentSupplementTitle = "Foo Supplement";
const documentSupplementFilename = "foo-supplement.md";

// Function for preparing test folder for running a "supplement" operation.
function supplementDoInDirFunction(destinationFolderPath) {
  mkdirSync(path.join(destinationFolderPath, kbPath, documentSlug), {
    recursive: true,
  });
}

// Clean the temporary test folder after each test.
afterAll(async () => {
  await result.cleanup();
});

describe("invalid configuration", () => {
  // The test table does not accommodate this test so it is implemented independently.
  describe("missing generator configuration", () => {
    test("rejects, with expected error", () =>
      expect(
        helpers.run(Generator, generatorOptions).withLocalConfig({}),
      ).rejects.toThrow("Missing generator configuration"));
  });

  describe.each([
    {
      description: "generator configuration has invalid data format",
      testdataFolderName: "generator-configuration-invalid-data-format",
      additionalLocalConfig: {
        foo: "bar",
      },
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
      },
      exceptionMessagePattern:
        "Generator configuration has an invalid data format",
      localConfigData: {
        promptsConfigurationFilename: "prompts.js",
        documentPrimaryTemplateFilename: "template.ejs",
        documentSupplementTemplateFilename: "template.ejs",
      },
    },
    {
      description: "nonexistent prompts configuration path",
      testdataFolderName: "nonexistent-prompts-configuration",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
      },
      exceptionMessagePattern: path.join(
        testDataPath,
        "nonexistent-prompts-configuration",
        "nonexistent.js",
      ),
      localConfigData: {
        promptsConfigurationFilename: "nonexistent.js",
        documentPrimaryTemplateFilename: "template.ejs",
        documentSupplementTemplateFilename: "template.ejs",
      },
    },
    {
      description: "nonexistent document primary template path",
      testdataFolderName: "nonexistent-primary-template",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
      },
      exceptionMessagePattern: `Document primary template file was not found at the location specified in .yo-rc.json:\n${path.join(
        testDataPath,
        "nonexistent-primary-template",
        "nonexistent.ejs",
      )}`,
      localConfigData: {
        promptsConfigurationFilename: "prompts.js",
        documentPrimaryTemplateFilename: "nonexistent.ejs",
        documentSupplementTemplateFilename: "document-supplement.ejs",
      },
    },
    {
      description: "nonexistent document supplement template path",
      testdataFolderName: "nonexistent-supplement-template",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
      },
      exceptionMessagePattern: `Document supplement template file was not found at the location specified in .yo-rc.json:\n${path.join(
        testDataPath,
        "nonexistent-supplement-template",
        "nonexistent.ejs",
      )}`,
      localConfigData: {
        promptsConfigurationFilename: "prompts.js",
        documentPrimaryTemplateFilename: "document-primary.ejs",
        documentSupplementTemplateFilename: "nonexistent.ejs",
      },
    },
    {
      description: "data file that doesn't provide a default export",
      testdataFolderName: "no-prompts-configuration-default-export",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
      },
      exceptionMessagePattern: "does not provide a default export",
      localConfigData: {
        promptsConfigurationFilename: "prompts.js",
        documentPrimaryTemplateFilename: "template.ejs",
        documentSupplementTemplateFilename: "template.ejs",
      },
    },
    {
      description: "prompts configuration that is not an array",
      testdataFolderName: "prompts-configuration-not-array",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
      },
      exceptionMessagePattern: "must be array",
      localConfigData: {
        promptsConfigurationFilename: "prompts.js",
        documentPrimaryTemplateFilename: "template.ejs",
        documentSupplementTemplateFilename: "template.ejs",
      },
    },
    {
      description:
        "prompt configuration missing required frontMatterPath property",
      testdataFolderName: "prompt-configuration-missing-frontMatterPath",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "plutoChoice",
      },
      exceptionMessagePattern: "missing frontMatterPath",
      localConfigData: {
        promptsConfigurationFilename: "prompts.js",
        documentPrimaryTemplateFilename: "template.ejs",
        documentSupplementTemplateFilename: "template.ejs",
      },
    },
    {
      description: "join processor applied to non-array answer values",
      testdataFolderName: "join-processor-non-array",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
      },
      exceptionMessagePattern:
        '"join" processor used with non-array "fooPrompt"',
      localConfigData: {
        promptsConfigurationFilename: "prompts.js",
        documentPrimaryTemplateFilename: "template.ejs",
        documentSupplementTemplateFilename: "template.ejs",
      },
    },
    {
      description: "sort processor applied to non-array answer values",
      testdataFolderName: "sort-processor-non-array",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
      },
      exceptionMessagePattern:
        '"sort" processor used with non-array "fooPrompt"',
      localConfigData: {
        promptsConfigurationFilename: "prompts.js",
        documentPrimaryTemplateFilename: "template.ejs",
        documentSupplementTemplateFilename: "template.ejs",
      },
    },
    {
      description: "template processor that has invalid syntax",
      testdataFolderName: "template-processor-invalid",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
      },
      exceptionMessagePattern: 'Invalid syntax in template for "fooPrompt"',
      localConfigData: {
        promptsConfigurationFilename: "prompts.js",
        documentPrimaryTemplateFilename: "template.ejs",
        documentSupplementTemplateFilename: "template.ejs",
      },
    },
    {
      description: "template processor that fails",
      testdataFolderName: "template-processor-failure",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
      },
      exceptionMessagePattern: 'Failed to expand template for "fooPrompt"',
      localConfigData: {
        promptsConfigurationFilename: "prompts.js",
        documentPrimaryTemplateFilename: "template.ejs",
        documentSupplementTemplateFilename: "template.ejs",
      },
    },
    {
      description: "with nonexistent supplement target document",
      testdataFolderName: "supplement-nonexistent-document",
      answers: {
        kbDocumentOperation: "supplement",
        kbDocumentTitle: documentTitle,
        kbDocumentSupplementTitle: documentSupplementTitle,
      },
      exceptionMessagePattern: `Target document "${documentTitle}" for the supplement file was not found.`,
      localConfigData: {
        promptsConfigurationFilename: "prompts.js",
        documentPrimaryTemplateFilename: "template.ejs",
        documentSupplementTemplateFilename: "template.ejs",
      },
    },
  ])(
    "$description",
    ({
      testdataFolderName,
      additionalLocalConfig,
      answers,
      exceptionMessagePattern,
      localConfigData,
    }) => {
      const thisTestDataPath = path.join(testDataPath, testdataFolderName);
      const localConfigBase = {
        documentPrimaryTemplatePath: path.join(
          thisTestDataPath,
          localConfigData.documentPrimaryTemplateFilename,
        ),
        documentSupplementTemplatePath: path.join(
          thisTestDataPath,
          localConfigData.documentSupplementTemplateFilename,
        ),
        kbPath,
        promptsConfigurationPath: path.join(
          thisTestDataPath,
          localConfigData.promptsConfigurationFilename,
        ),
      };
      const localConfig = Object.assign(localConfigBase, additionalLocalConfig);

      test("rejects, with expected error", () => {
        expect(
          helpers
            .run(Generator, generatorOptions)
            .withAnswers(answers)
            .withLocalConfig(localConfig),
        ).rejects.toThrow(exceptionMessagePattern);
      });
    },
  );
});

describe("valid configuration", () => {
  describe.each([
    {
      description: "answer from option",
      testdataFolderName: "answer-from-option",
      options: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
      },
      answers: {
        kbDocumentOperation: "new",
      },
      doInDirFunction: () => {},
    },
    {
      description: "answer array from single option",
      testdataFolderName: "answer-array-from-single-option",
      options: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "pippoChoice",
      },
      answers: {
        kbDocumentOperation: "new",
      },
      doInDirFunction: () => {},
    },
    {
      description: "no user prompts",
      testdataFolderName: "no-prompts-configuration",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
      },
      doInDirFunction: () => {},
    },
    {
      description: "prompt configuration usages default",
      testdataFolderName: "prompt-configuration-usages-default",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
      },
      doInDirFunction: () => {},
    },
    {
      description: "user prompt with content usage",
      testdataFolderName: "content-usage-prompt-configuration",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "foo prompt answer",
      },
      doInDirFunction: () => {},
    },
    {
      description: "user prompt with front matter usage, array path",
      testdataFolderName: "array-path-front-matter-usage-prompt-configuration",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "plutoChoice",
        barPrompt: "asdfChoice",
      },
      doInDirFunction: () => {},
    },
    {
      description: "object prompt with front matter usage, object path",
      testdataFolderName: "object-path-front-matter-usage-prompt-configuration",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "plutoChoice",
        barPrompt: "asdfChoice",
      },
      doInDirFunction: () => {},
    },
    {
      description: "object prompt with front matter usage, answer array",
      testdataFolderName:
        "front-matter-usage-answer-array-prompt-configuration",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "plutoChoice",
        barPrompt: ["qwerChoice", "zxcvChoice"],
      },
      doInDirFunction: () => {},
    },
    {
      description: "user prompt with content+front matter usages",
      testdataFolderName: "content-front-matter-usages-prompt-configuration",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "plutoChoice",
      },
      doInDirFunction: () => {},
    },
    {
      description: "front matter sorting default",
      testdataFolderName: "generator-configuration-sortfrontmatter-default",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
        barPrompt: "barValue",
        bazPrompt: ["qwerChoice", "asdfChoice"],
      },
      doInDirFunction: () => {},
    },
    {
      description: "front matter sorting disabled",
      testdataFolderName: "unsorted-front-matter",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
        barPrompt: "barValue",
        bazPrompt: ["qwerChoice", "asdfChoice"],
      },
      doInDirFunction: () => {},
      sortFrontMatter: false,
    },
    {
      description: "front matter sorting enabled",
      testdataFolderName: "sorted-front-matter",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
        barPrompt: "barValue",
        bazPrompt: ["qwerChoice", "asdfChoice"],
      },
      doInDirFunction: () => {},
      sortFrontMatter: true,
    },
    {
      description: "universal front matter default",
      testdataFolderName:
        "generator-configuration-universalfrontmatter-default",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
      },
      doInDirFunction: () => {},
    },
    {
      description: "universal front matter",
      testdataFolderName: "universalFrontMatter",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
      },
      doInDirFunction: () => {},
      universalFrontMatter: {
        foo: "bar",
      },
    },
    {
      description: "prompt configuration processors default",
      testdataFolderName: "prompt-configuration-processors-default",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
      },
      doInDirFunction: () => {},
    },
    {
      description: "processor chain",
      testdataFolderName: "processor-chain",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "plutoValue,pippoValue",
      },
      doInDirFunction: () => {},
    },
    {
      description: "csv processor",
      testdataFolderName: "csv-processor",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "barValue,fooValue",
      },
      doInDirFunction: () => {},
    },
    {
      description: "csv processor, default delimiter",
      testdataFolderName: "csv-processor-default-delimiter",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "barValue,fooValue",
      },
      doInDirFunction: () => {},
    },
    {
      description: "csv processor, empty answer",
      testdataFolderName: "csv-processor-empty-answer",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        barPrompt: "barValue",
        fooPrompt: "",
      },
      doInDirFunction: () => {},
    },
    {
      description: "join processor, default separator",
      testdataFolderName: "join-processor-default-separator",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: ["pippoChoice", "plutoChoice"],
      },
      doInDirFunction: () => {},
    },
    {
      description: "join processor, custom separator",
      testdataFolderName: "join-processor-custom-separator",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: ["pippoChoice", "plutoChoice"],
      },
      doInDirFunction: () => {},
    },
    {
      description: "kb-link processor",
      testdataFolderName: "kb-link-processor",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "Bar Title",
      },
      doInDirFunction: () => {},
    },
    {
      description: "kb-link processor, answer array",
      testdataFolderName: "kb-link-processor-answer-array",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: ["Pippo Title", "Pluto Title"],
      },
      doInDirFunction: () => {},
    },
    {
      description: "sort processor",
      testdataFolderName: "sort-processor",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: ["plutoChoice", "pippoChoice"],
      },
      doInDirFunction: () => {},
    },
    {
      description: "template processor",
      testdataFolderName: "template-processor",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
      },
      doInDirFunction: () => {},
    },
    {
      description: "template processor, answer array",
      testdataFolderName: "template-processor-answer-array",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: ["pippoChoice", "plutoChoice"],
      },
      doInDirFunction: () => {},
    },
    {
      description: 'prompt configuration operations default, "new" operation',
      testdataFolderName: "prompt-configuration-operations-default",
      answers: {
        kbDocumentOperation: "new",
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
      },
      doInDirFunction: () => {},
    },
    {
      description:
        'prompt configuration operations default, "supplement" operation',
      testdataFolderName: "prompt-configuration-operations-default",
      answers: {
        kbDocumentOperation: "supplement",
        kbDocumentTitle: documentTitle,
        kbDocumentSupplementTitle: documentSupplementTitle,
        fooPrompt: "fooValue",
      },
      doInDirFunction: supplementDoInDirFunction,
    },
    {
      description: "document supplement",
      testdataFolderName: "supplement",
      answers: {
        kbDocumentOperation: "supplement",
        kbDocumentTitle: documentTitle,
        kbDocumentSupplementTitle: documentSupplementTitle,
        supplementOperationPrompt: "supplementOperationPrompt Value",
        newOperationPrompt: "newOperationPrompt Value",
        allOperationPrompt: "allOperationPrompt Value",
      },
      doInDirFunction: supplementDoInDirFunction,
    },
  ])(
    "with $description",
    ({
      testdataFolderName,
      answers,
      doInDirFunction,
      options,
      sortFrontMatter,
      universalFrontMatter,
    }) => {
      const thisTestDataPath = path.join(testDataPath, testdataFolderName);
      const localConfig = {
        documentPrimaryTemplatePath: path.join(
          thisTestDataPath,
          "document-primary.ejs",
        ),
        documentSupplementTemplatePath: path.join(
          thisTestDataPath,
          "document-supplement.ejs",
        ),
        kbPath,
        promptsConfigurationPath: path.join(thisTestDataPath, "prompts.js"),
        sortFrontMatter,
        universalFrontMatter,
      };

      let createdFilename = "";
      if (answers.kbDocumentOperation === "new") {
        createdFilename = documentPrimaryFileName;
      } else {
        createdFilename = documentSupplementFilename;
      }
      const documentFilePath = path.join(
        localConfig.kbPath,
        documentSlug,
        createdFilename,
      );

      beforeEach(async () => {
        await helpers
          .run(Generator, generatorOptions)
          .withAnswers(answers)
          .withLocalConfig(localConfig)
          .withOptions(options)
          .doInDir(doInDirFunction);
      });

      test("generates a new KB document", () => {
        result.assertFile(documentFilePath);
      });

      test("with the expected content", () => {
        const goldenMasterPath = path.join(
          thisTestDataPath,
          "golden",
          documentSlug,
          createdFilename,
        );

        const goldenMasterContent = readFileSync(goldenMasterPath, {
          encoding: "utf8",
        });

        result.assertEqualsFileContent(documentFilePath, goldenMasterContent);
      });
    },
  );
});
