const prompts = [
  {
    inquirer: {
      type: "input",
      name: "fooPrompt",
      message: "Foo message:",
    },
    processors: [
      {
        processor: "kb-link",
      },
    ],
    usages: ["content"],
  },
];

export default prompts;
