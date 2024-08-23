const prompts = [
  {
    inquirer: {
      type: "input",
      name: "fooPrompt",
      message: "Foo message:",
    },
    processors: [
      {
        processor: "join",
      },
    ],
    usages: ["content"],
  },
];

export default prompts;
