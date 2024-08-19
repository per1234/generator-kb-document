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
      title: documentTitle,
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
      title: documentTitle,
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
      title: documentTitle,
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
      title: documentTitle,
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

  describe.each([
    {
      description: "no user prompts",
      testdataFolderName: "no-prompts-data",
      answers: {
        kbDocumentTitle: documentTitle,
      },
    },
    {
      description: "has user prompts",
      testdataFolderName: "with-prompts-data",
      answers: {
        kbDocumentTitle: documentTitle,
        fooPromptName: "foo prompt answer",
      },
    },
  ])(
    "with valid configuration ($description)",
    ({ testdataFolderName, answers }) => {
      const thisTestDataPath = path.join(testDataPath, testdataFolderName);
      const localConfig = {
        kbPath: "kb",
        promptsDataPath: path.join(thisTestDataPath, "prompts.js"),
        templatePath: path.join(thisTestDataPath, "primary-document.ejs"),
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
