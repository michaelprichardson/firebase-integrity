/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */
const packageJson = require("./package.json");

export default {
  name: packageJson.name,
  displayName: packageJson.name,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: [
    "text",
    "text-summary",
  ],
  preset: "ts-jest",
  roots: [
    '<rootDir>/__tests__',
    '<rootDir>',
  ],
  testEnvironment: "node",
  testRegex: [
    "(__tests__\/.*(\\.|\/))(test.ts)$"
  ],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
};
