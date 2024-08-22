const prompts = [
  {
    frontMatterPath: "/tags",
    inquirer: {
      type: "input",
      name: "fooPrompt",
      message: "Foo message:",
    },
    processors: [
      {
        name: "csv",
      },
    ],
    usage: ["front matter"],
  },
];

export default prompts;
