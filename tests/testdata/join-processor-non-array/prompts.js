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
    usage: ["content"],
  },
];

export default prompts;
