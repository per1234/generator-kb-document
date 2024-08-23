const prompts = [
  {
    inquirer: {
      type: "checkbox",
      name: "fooPrompt",
      message: "Foo message:",
      choices: [
        {
          name: "Pippo choice",
          value: "pippoChoice",
        },
        {
          name: "Pluto choice",
          value: "plutoChoice",
        },
      ],
    },
    processors: [
      {
        processor: "template",
        template: "- The answer value is <%- answer %>",
      },
    ],
    usages: ["content"],
  },
];

export default prompts;
