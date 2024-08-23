const prompts = [
  {
    inquirer: {
      type: "checkbox",
      name: "fooPrompt",
      message: "Foo message:",
      choices: [
        {
          name: "Pippo choice",
          value: "Pippo Title",
        },
        {
          name: "Pluto choice",
          value: "Pluto Title",
        },
      ],
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