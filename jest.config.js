// See: https://jestjs.io/docs/configuration
export default {
  collectCoverage: true,
  collectCoverageFrom: ["**/app/*.{js,jsx}"],
  coverageDirectory: "coverage",
  // `lcov` is used by Codecov, `text` is required for `jest --coverage` to print a report to the terminal.
  coverageReporters: ["lcov", "text"],
  testMatch: ["**/tests/*.js"],
  // See: https://jestjs.io/docs/ecmascript-modules#:~:text=disable%20code%20transforms%20by%20passing%20transform%3A%20%7B%7D
  transform: {},
};
