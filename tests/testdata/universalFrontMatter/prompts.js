const prompts = [
  {
    frontMatterPath: "/tags/-",
    inquirer: {
      type: "input",
      name: "fooPrompt",
      message: "Foo message:",
    },
    usages: ["front matter"],
  },
];

export default prompts;
