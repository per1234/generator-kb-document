const prompts = [
  {
    frontMatterPath: "/bar",
    inquirer: {
      type: "input",
      name: "barPrompt",
      message: "Bar message:",
    },
    usages: ["front matter"],
  },
  {
    frontMatterPath: "/tags",
    inquirer: {
      type: "input",
      name: "fooPrompt",
      message: "Foo message:",
    },
    processors: [
      {
        processor: "csv",
        delimiter: ",",
      },
    ],
    usages: ["front matter"],
  },
];

export default prompts;
