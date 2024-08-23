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
    usage: ["content"],
  },
];

export default prompts;
