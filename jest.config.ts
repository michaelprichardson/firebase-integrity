/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */
const packageJson = require("./package.json");

export default {
  name: packageJson.name,
  displayName: packageJson.name,
  coverageDirectory: "coverage",
  coverageReporters: [
    "text",
    "text-summary",
  ],
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: [
    "(/src/__tests__/.*|(\\.|/)(test|spec))\\.(ts)$"
  ],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
};
