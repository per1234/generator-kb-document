import { afterAll, beforeEach, describe, expect, test } from "@jest/globals";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import helpers, { result } from "yeoman-test";
import Generator from "../app";

const moduleFilePath = fileURLToPath(import.meta.url);
const moduleFolderPath = path.dirname(moduleFilePath);
const testDataPath = path.join(moduleFolderPath, "testdata");
const generatorPath = path.join(moduleFolderPath, "../app/index.js");
const generatorOptions = { resolved: generatorPath };
const documentTitle = "Foo Title";
const documentSlug = "foo-title";
const documentFilename = "doc.md";

// Clean the temporary test folder after each test.
afterAll(async () => {
  await result.cleanup();
});

describe("invalid configuration", () => {
  describe.each([
    {
      description: "nonexistent prompts data path",
      testdataFolderName: "nonexistent-prompts-data",
      answers: {
        kbDocumentTitle: documentTitle,
      },
      exceptionMessagePattern: path.join(
        testDataPath,
        "nonexistent-prompts-data",
        "nonexistent.js",
      ),
      localConfigData: {
        promptsDataFilename: "nonexistent.js",
        templateFilename: "primary-document.ejs",
      },
    },
    {
      description: "nonexistent template path",
      testdataFolderName: "nonexistent-template",
      answers: {
        kbDocumentTitle: documentTitle,
      },
      exceptionMessagePattern: path.join(
        testDataPath,
        "nonexistent-template",
        "nonexistent.ejs",
      ),
      localConfigData: {
        promptsDataFilename: "prompts.js",
        templateFilename: "nonexistent.ejs",
      },
    },
    {
      description: "data file that doesn't provide a default export",
      testdataFolderName: "no-prompts-data-default-export",
      answers: {
        kbDocumentTitle: documentTitle,
      },
      exceptionMessagePattern: "does not provide a default export",
      localConfigData: {
        promptsDataFilename: "prompts.js",
        templateFilename: "primary-document.ejs",
      },
    },
    {
      description: "prompts data that is not an array",
      testdataFolderName: "prompts-data-not-array",
      answers: {
        kbDocumentTitle: documentTitle,
      },
      exceptionMessagePattern: "must be array",
      localConfigData: {
        promptsDataFilename: "prompts.js",
        templateFilename: "primary-document.ejs",
      },
    },
    {
      description: "prompt data missing required frontMatterPath property",
      testdataFolderName: "prompt-data-missing-frontMatterPath",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "plutoChoice",
      },
      exceptionMessagePattern: "missing frontMatterPath",
      localConfigData: {
        promptsDataFilename: "prompts.js",
        templateFilename: "primary-document.ejs",
      },
    },
    {
      description: "join processor applied to non-array answer values",
      testdataFolderName: "join-processor-non-array",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
      },
      exceptionMessagePattern:
        '"join" processor used with non-array "fooPrompt"',
      localConfigData: {
        promptsDataFilename: "prompts.js",
        templateFilename: "primary-document.ejs",
      },
    },
    {
      description: "sort processor applied to non-array answer values",
      testdataFolderName: "sort-processor-non-array",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
      },
      exceptionMessagePattern:
        '"sort" processor used with non-array "fooPrompt"',
      localConfigData: {
        promptsDataFilename: "prompts.js",
        templateFilename: "primary-document.ejs",
      },
    },
    {
      description: "template processor that has invalid syntax",
      testdataFolderName: "template-processor-invalid",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
      },
      exceptionMessagePattern: 'Invalid syntax in template for "fooPrompt"',
      localConfigData: {
        promptsDataFilename: "prompts.js",
        templateFilename: "primary-document.ejs",
      },
    },
    {
      description: "template processor that fails",
      testdataFolderName: "template-processor-failure",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
      },
      exceptionMessagePattern: 'Failed to expand template for "fooPrompt"',
      localConfigData: {
        promptsDataFilename: "prompts.js",
        templateFilename: "primary-document.ejs",
      },
    },
  ])(
    "$description",
    ({
      testdataFolderName,
      answers,
      exceptionMessagePattern,
      localConfigData,
    }) => {
      const thisTestDataPath = path.join(testDataPath, testdataFolderName);
      const localConfig = {
        kbPath: "kb",
        promptsDataPath: path.join(
          thisTestDataPath,
          localConfigData.promptsDataFilename,
        ),
        templatePath: path.join(
          thisTestDataPath,
          localConfigData.templateFilename,
        ),
      };

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
      description: "no user prompts",
      testdataFolderName: "no-prompts-data",
      answers: {
        kbDocumentTitle: documentTitle,
      },
    },
    {
      description: "user prompt with content usage",
      testdataFolderName: "content-usage-prompt-data",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "foo prompt answer",
      },
    },
    {
      description: "user prompt with front matter usage, array path",
      testdataFolderName: "array-path-front-matter-usage-prompt-data",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "plutoChoice",
        barPrompt: "asdfChoice",
      },
    },
    {
      description: "object prompt with front matter usage, object path",
      testdataFolderName: "object-path-front-matter-usage-prompt-data",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "plutoChoice",
        barPrompt: "asdfChoice",
      },
    },
    {
      description: "object prompt with front matter usage, answer array",
      testdataFolderName: "front-matter-usage-answer-array-prompt-data",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "plutoChoice",
        barPrompt: ["qwerChoice", "zxcvChoice"],
      },
    },
    {
      description: "user prompt with content+front matter usages",
      testdataFolderName: "content-front-matter-usages-prompt-data",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "plutoChoice",
      },
    },
    {
      description: "front matter sorting disabled",
      testdataFolderName: "unsorted-front-matter",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
        barPrompt: "barValue",
        bazPrompt: ["qwerChoice", "asdfChoice"],
      },
      sortFrontMatter: false,
    },
    {
      description: "front matter sorting enabled",
      testdataFolderName: "sorted-front-matter",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
        barPrompt: "barValue",
        bazPrompt: ["qwerChoice", "asdfChoice"],
      },
      sortFrontMatter: true,
    },
    {
      description: "universal front matter",
      testdataFolderName: "universalFrontMatter",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
      },
      universalFrontMatter: {
        foo: "bar",
      },
    },
    {
      description: "processor chain",
      testdataFolderName: "processor-chain",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "plutoValue,pippoValue",
      },
    },
    {
      description: "csv processor",
      testdataFolderName: "csv-processor",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "barValue,fooValue",
      },
    },
    {
      description: "csv processor, default delimiter",
      testdataFolderName: "csv-processor-default-delimiter",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "barValue,fooValue",
      },
    },
    {
      description: "csv processor, empty answer",
      testdataFolderName: "csv-processor-empty-answer",
      answers: {
        kbDocumentTitle: documentTitle,
        barPrompt: "barValue",
        fooPrompt: "",
      },
    },
    {
      description: "join processor, default separator",
      testdataFolderName: "join-processor",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: ["pippoChoice", "plutoChoice"],
      },
    },
    {
      description: "join processor, custom separator",
      testdataFolderName: "join-processor-custom-separator",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: ["pippoChoice", "plutoChoice"],
      },
    },
    {
      description: "kb-link processor",
      testdataFolderName: "kb-link-processor",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "Bar Title",
      },
    },
    {
      description: "kb-link processor, answer array",
      testdataFolderName: "kb-link-processor-answer-array",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: ["Pippo Title", "Pluto Title"],
      },
    },
    {
      description: "sort processor",
      testdataFolderName: "sort-processor",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: ["plutoChoice", "pippoChoice"],
      },
    },
    {
      description: "template processor",
      testdataFolderName: "template-processor",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: "fooValue",
      },
    },
    {
      description: "template processor, answer array",
      testdataFolderName: "template-processor-answer-array",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPrompt: ["pippoChoice", "plutoChoice"],
      },
    },
  ])(
    "with $description",
    ({
      testdataFolderName,
      answers,
      sortFrontMatter,
      universalFrontMatter,
    }) => {
      const thisTestDataPath = path.join(testDataPath, testdataFolderName);
      const localConfig = {
        kbPath: "kb",
        promptsDataPath: path.join(thisTestDataPath, "prompts.js"),
        sortFrontMatter,
        templatePath: path.join(thisTestDataPath, "primary-document.ejs"),
        universalFrontMatter,
      };
      const documentFilePath = path.join(
        localConfig.kbPath,
        documentSlug,
        documentFilename,
      );

      beforeEach(async () => {
        await helpers
          .run(Generator, generatorOptions)
          .withAnswers(answers)
          .withLocalConfig(localConfig);
      });

      test("generates a new KB document", () => {
        result.assertFile(documentFilePath);
      });

      test("with the expected content", () => {
        const goldenMasterPath = path.join(
          thisTestDataPath,
          "golden",
          documentSlug,
          documentFilename,
        );

        const goldenMasterContent = readFileSync(goldenMasterPath, {
          encoding: "utf8",
        });

        result.assertEqualsFileContent(documentFilePath, goldenMasterContent);
      });
    },
  );
});
