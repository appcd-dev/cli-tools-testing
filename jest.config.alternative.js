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
  verbose: false, // Required for jest-html-reporters to capture console logs
  reporters: [
    "default",
    [
      "jest-html-reporters",
      {
        publicPath: "./reports",
        filename: `test-report-enhanced-${timestamp}.html`,
        expand: true,
        hideIcon: false,
        pageTitle: "CLI Test Report - Enhanced",
        logoImgPath: undefined,
        includeFailureMsg: true,
        includeConsoleLog: false,
        includeTestData: true,
        testCommand: "npm run test",
        openReport: false,
        failureMessageOnly: 0
      }
    ]
  ]
  
};
