const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('.')[0];

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/cli_tests/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testTimeout: 25000,
  reporters: [
    "default",
    [ "jest-html-reporter", {
      pageTitle: "Test Report",
      outputPath:"reports/test-report-${timestamp}.html"
    }]
  ]
  
}; 