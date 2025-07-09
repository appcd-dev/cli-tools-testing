const { allure } = require('allure-jest');

// Global setup for Allure reporting
declare global {
  namespace jest {
    interface Matchers<R> {
      toAllureStep(stepName: string): R;
    }
  }
}

// Helper function to add test step
export const step = (name: string, testFunction: () => Promise<void> | void) => {
  return allure.step(name, testFunction);
};

// Helper function to add attachment
export const addAttachment = (name: string, content: string | Buffer, type: string = 'text/plain') => {
  return allure.attachment(name, content, type);
};

// Helper function to add environment info
export const addEnvironmentInfo = (name: string, value: string) => {
  return allure.environment(name, value);
};

// Helper function to add issue link
export const addIssue = (name: string, url: string) => {
  return allure.issue(name, url);
};

// Helper function to add test case link
export const addTestCase = (name: string, url: string) => {
  return allure.testCaseId(name, url);
};

// Helper function to add epic
export const addEpic = (name: string) => {
  return allure.epic(name);
};

// Helper function to add feature
export const addFeature = (name: string) => {
  return allure.feature(name);
};

// Helper function to add story
export const addStory = (name: string) => {
  return allure.story(name);
};

// Helper function to add severity
export const addSeverity = (severity: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial') => {
  return allure.severity(severity);
};

// Helper function to add description
export const addDescription = (description: string) => {
  return allure.description(description);
};

// Add environment information at startup
const testEnv = process.env.TEST_ENV || 'local';
addEnvironmentInfo('Test Environment', testEnv);
addEnvironmentInfo('Node.js Version', process.version);
addEnvironmentInfo('Platform', process.platform);
addEnvironmentInfo('Architecture', process.arch); 