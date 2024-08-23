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
    usages: ["front matter"],
  },
  {
    frontMatterPath: "/tags",
    inquirer: {
      type: "checkbox",
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
        {
          name: "Zxcv choice",
          value: "zxcvChoice",
        },
      ],
    },
    usages: ["front matter"],
  },
];

export default prompts;
