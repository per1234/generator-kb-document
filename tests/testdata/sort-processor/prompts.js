const prompts = [
  {
    inquirer: {
      type: "checkbox",
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
    usages: ["content"],
  },
];

export default prompts;
