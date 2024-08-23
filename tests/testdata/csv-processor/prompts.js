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
        processor: "csv",
        delimiter: ",",
      },
    ],
    usage: ["front matter"],
  },
];

export default prompts;
