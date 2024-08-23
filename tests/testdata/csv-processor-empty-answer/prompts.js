const prompts = [
  {
    frontMatterPath: "/bar",
    inquirer: {
      type: "input",
      name: "barPrompt",
      message: "Bar message:",
    },
    usage: ["front matter"],
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
    usage: ["front matter"],
  },
];

export default prompts;
