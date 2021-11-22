module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  coverageProvider: "v8",
  coverageReporters: [
    "json-summary"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/scripts/$1"
  },
  testEnvironment: "jsdom"
};
