const prompts = [
  {
    frontMatterPath: "/zzz/foo",
    inquirer: {
      type: "input",
      name: "fooPrompt",
      message: "Foo message:",
    },
    usage: ["front matter"],
  },
  {
    frontMatterPath: "/zzz/bar",
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
      type: "checkbox",
      name: "bazPrompt",
      message: "Baz message:",
      choices: [
        {
          name: "Qwer choice",
          value: "qwerChoice",
        },
        {
          name: "Asdf choice",
          value: "asdfChoice",
        },
      ],
    },
    usage: ["front matter"],
  },
];

export default prompts;
