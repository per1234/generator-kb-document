const prompts = [
  {
    frontMatterPath: "/foo/bar",
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
    usages: ["front matter"],
  },
  {
    frontMatterPath: "/foo/baz",
    inquirer: {
      type: "rawlist",
      name: "barPrompt",
      message: "Bar message:",
      choices: [
        {
          name: "Asdf choice",
          value: "asdfChoice",
        },
        {
          name: "Qwer choice",
          value: "qwerChoice",
        },
      ],
    },
    usages: ["front matter"],
  },
];

export default prompts;
