const prompts = [
  {
    inquirer: {
      type: "input",
      name: "fooPrompt",
      message: "Foo message:",
    },
    processors: [
      {
        processor: "sort",
      },
    ],
    usages: ["content"],
  },
];

export default prompts;
