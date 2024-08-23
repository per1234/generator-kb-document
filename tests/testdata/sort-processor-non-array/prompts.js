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
    usage: ["content"],
  },
];

export default prompts;
