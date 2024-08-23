const prompts = [
  {
    inquirer: {
      type: "rawlist",
      name: "fooPrompt",
      message: "Foo message:",
      choices: [
        {
          name: "Pluto choice",
          value: "plutoChoice",
        },
        {
          name: "Pippo choice",
          value: "pippoChoice",
        },
      ],
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