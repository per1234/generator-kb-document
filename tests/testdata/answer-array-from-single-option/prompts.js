const prompts = [
  {
    frontMatterPath: "/tags",
    inquirer: {
      type: "checkbox",
      name: "fooPrompt",
      message: "Foo message:",
      choices: [
        {
          name: "Pippo choice",
          value: "pippoChoice",
        },
      ],
    },
    usages: ["front matter"],
  },
];

export default prompts;
