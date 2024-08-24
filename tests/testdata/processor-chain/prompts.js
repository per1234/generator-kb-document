const prompts = [
  {
    inquirer: {
      type: "input",
      name: "fooPrompt",
      message: "Foo message:",
    },
    processors: [
      {
        processor: "csv",
      },
      {
        processor: "sort",
      },
    ],
    usages: ["content"],
  },
];

export default prompts;
