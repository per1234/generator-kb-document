const prompts = [
  {
    frontMatterPath: "/tags/-",
    inquirer: {
      type: "input",
      name: "fooPrompt",
      message: "Foo message:",
    },
    usage: ["front matter"],
  },
];

export default prompts;
