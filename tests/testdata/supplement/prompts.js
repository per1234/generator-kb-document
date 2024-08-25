const prompts = [
  {
    frontMatterPath: "/supplementOperationPrompt",
    inquirer: {
      type: "input",
      name: "supplementOperationPrompt",
      message: "supplementOperationPrompt message:",
    },
    operations: ["supplement"],
    usages: ["front matter", "content"],
  },
  {
    frontMatterPath: "/newOperationPrompt",
    inquirer: {
      type: "input",
      name: "newOperationPrompt",
      message: "newOperationPrompt message:",
    },
    operations: ["new"],
    usages: ["front matter", "content"],
  },
  {
    frontMatterPath: "/supplementallOperationPromptOperationPrompt",
    inquirer: {
      type: "input",
      name: "allOperationPrompt",
      message: "allOperationPrompt message:",
    },
    operations: ["new", "supplement"],
    usages: ["front matter", "content"],
  },
];

export default prompts;
