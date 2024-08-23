const prompts = [
  {
    inquirer: {
      type: "input",
      name: "fooPrompt",
      message: "Foo message:",
    },
    processors: [
      {
        processor: "template",
        template: "The answer value is <%- answer %>",
      },
    ],
    usages: ["content"],
  },
];

export default prompts;
