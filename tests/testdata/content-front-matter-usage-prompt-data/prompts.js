const prompts = [
  {
    frontMatterPath: "/tags/-",
    inquirer: {
      type: "rawlist",
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
    usage: ["content", "front matter"],
  },
];

export default prompts;
