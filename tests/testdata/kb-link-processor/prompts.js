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
    usage: ["content"],
  },
];

export default prompts;
