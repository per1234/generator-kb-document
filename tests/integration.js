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

describe("running the generator", () => {
  describe("with nonexistent prompts data path", () => {
    const thisTestDataPath = path.join(
      testDataPath,
      "nonexistent-prompts-data",
    );
    const answers = {
      kbDocumentTitle: documentTitle,
    };
    const localConfig = {
      kbPath: "kb",
      promptsDataPath: path.join(thisTestDataPath, "prompts.js"),
      templatePath: path.join(thisTestDataPath, "primary-document.ejs"),
    };

    test("rejects, with expected error", () =>
      expect(
        helpers
          .run(Generator, generatorOptions)
          .withAnswers(answers)
          .withLocalConfig(localConfig),
      ).rejects.toThrow(localConfig.promptsDataPath));
  });

  describe("with nonexistent template path", () => {
    const thisTestDataPath = path.join(testDataPath, "nonexistent-template");
    const answers = {
      kbDocumentTitle: documentTitle,
    };
    const localConfig = {
      kbPath: "kb",
      promptsDataPath: path.join(thisTestDataPath, "prompts.js"),
      templatePath: path.join(thisTestDataPath, "primary-document.ejs"),
    };

    test("rejects", () =>
      expect(
        helpers
          .run(Generator, generatorOptions)
          .withAnswers(answers)
          .withLocalConfig(localConfig),
      ).rejects.toThrow(localConfig.templatePath));
  });

  describe("with data file that doesn't provide a default export", () => {
    const thisTestDataPath = path.join(
      testDataPath,
      "no-prompts-data-default-export",
    );
    const answers = {
      kbDocumentTitle: documentTitle,
    };
    const localConfig = {
      kbPath: "kb",
      promptsDataPath: path.join(thisTestDataPath, "prompts.js"),
      templatePath: path.join(thisTestDataPath, "primary-document.ejs"),
    };

    test("rejects", () =>
      expect(
        helpers
          .run(Generator, generatorOptions)
          .withAnswers(answers)
          .withLocalConfig(localConfig),
      ).rejects.toThrow("does not provide a default export"));
  });

  describe("with prompts data that is not an array", () => {
    const thisTestDataPath = path.join(testDataPath, "prompts-data-not-array");
    const answers = {
      kbDocumentTitle: documentTitle,
    };
    const localConfig = {
      kbPath: "kb",
      promptsDataPath: path.join(thisTestDataPath, "prompts.js"),
      templatePath: path.join(thisTestDataPath, "primary-document.ejs"),
    };

    test("rejects", () =>
      expect(
        helpers
          .run(Generator, generatorOptions)
          .withAnswers(answers)
          .withLocalConfig(localConfig),
      ).rejects.toThrow("must be array"));
  });

  describe("with prompt data missing required frontMatterPath property", () => {
    const thisTestDataPath = path.join(
      testDataPath,
      "prompt-data-missing-frontMatterPath",
    );
    const answers = {
      kbDocumentTitle: documentTitle,
      fooPrompt: "plutoChoice",
    };
    const localConfig = {
      kbPath: "kb",
      promptsDataPath: path.join(thisTestDataPath, "prompts.js"),
      templatePath: path.join(thisTestDataPath, "primary-document.ejs"),
    };

    test("rejects", () =>
      expect(
        helpers
          .run(Generator, generatorOptions)
          .withAnswers(answers)
          .withLocalConfig(localConfig),
      ).rejects.toThrow("missing frontMatterPath"));
  });

  describe("with sort processor applied to non-array answer values", () => {
    const thisTestDataPath = path.join(
      testDataPath,
      "sort-processor-non-array",
    );
    const answers = {
      kbDocumentTitle: documentTitle,
    };
    const localConfig = {
      kbPath: "kb",
      promptsDataPath: path.join(thisTestDataPath, "prompts.js"),
      templatePath: path.join(thisTestDataPath, "primary-document.ejs"),
    };

    test("rejects", () =>
      expect(
        helpers
          .run(Generator, generatorOptions)
          .withAnswers(answers)
          .withLocalConfig(localConfig),
      ).rejects.toThrow('"sort" processor used with non-array "fooPrompt"'));
  });

  describe("with template processor that has invalid syntax", () => {
    const thisTestDataPath = path.join(
      testDataPath,
      "template-processor-invalid",
    );
    const answers = {
      kbDocumentTitle: documentTitle,
    };
    const localConfig = {
      kbPath: "kb",
      promptsDataPath: path.join(thisTestDataPath, "prompts.js"),
      templatePath: path.join(thisTestDataPath, "primary-document.ejs"),
    };

    test("rejects", () =>
      expect(
        helpers
          .run(Generator, generatorOptions)
          .withAnswers(answers)
          .withLocalConfig(localConfig),
      ).rejects.toThrow('Invalid syntax in template for "fooPrompt"'));
  });

  describe("with template processor that fails", () => {
    const thisTestDataPath = path.join(
      testDataPath,
      "template-processor-failure",
    );
    const answers = {
      kbDocumentTitle: documentTitle,
    };
    const localConfig = {
      kbPath: "kb",
      promptsDataPath: path.join(thisTestDataPath, "prompts.js"),
      templatePath: path.join(thisTestDataPath, "primary-document.ejs"),
    };

    test("rejects", () =>
      expect(
        helpers
          .run(Generator, generatorOptions)
          .withAnswers(answers)
          .withLocalConfig(localConfig),
      ).rejects.toThrow('Failed to expand template for "fooPrompt"'));
  });

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
      description: "user prompt with content+front matter usage",
      testdataFolderName: "content-front-matter-usage-prompt-data",
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
    "with valid configuration ($description)",
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
