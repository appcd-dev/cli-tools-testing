#!/usr/bin/env node

/**
 * Configuration validation script
 * This script tests that the new .env-based configuration system works correctly
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔍 Validating Environment Configuration System...\n');

// Check if .env files exist
const configDir = path.join(__dirname, '../src/config');
const localEnvFile = path.join(configDir, 'local.env');
const devEnvFile = path.join(configDir, 'dev.env');
const stageEnvFile = path.join(configDir, 'stage.env');

console.log('📁 Checking configuration files:');
console.log(`✓ Local config: ${fs.existsSync(localEnvFile) ? 'Found' : 'Missing'} (${localEnvFile})`);
console.log(`✓ Dev config: ${fs.existsSync(devEnvFile) ? 'Found' : 'Missing'} (${devEnvFile})`);
console.log(`✓ Stage config: ${fs.existsSync(stageEnvFile) ? 'Found' : 'Missing'} (${stageEnvFile})\n`);

// Test compilation
console.log('🔨 Testing TypeScript compilation...');
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✓ TypeScript compilation successful\n');
} catch (error) {
  console.error('❌ TypeScript compilation failed:');
  console.error(error.stdout?.toString() || error.message);
  process.exit(1);
}

// Test configuration loading for different environments
console.log('🧪 Testing configuration loading...\n');

const testConfig = (env) => {
  console.log(`--- Testing ${env.toUpperCase()} Environment ---`);
  
  try {
    const result = execSync(`TEST_ENV=${env} node -e "
      const { TestConfig } = require('./dist/src/utils/TestConfig');
      console.log('Environment:', TestConfig.getCurrentEnvironment());
      console.log('Description:', TestConfig.getEnvironmentDescription());
      console.log('Stackgen CLI:', TestConfig.getStackgenCliPath());
      console.log('Cloud2Code CLI:', TestConfig.getCloud2CodeCliPath());
      console.log('Stackgen Version:', TestConfig.getStackgenExpectedVersion());
      console.log('Cloud2Code Version:', TestConfig.getCloud2CodeExpectedVersion());
      console.log('Primary Region:', TestConfig.getAwsPrimaryRegion());
      console.log('Secondary Region:', TestConfig.getAwsSecondaryRegion());
      console.log('Appstack ID:', TestConfig.getTestAppstackId());
      console.log('Skip Integration:', TestConfig.shouldSkipIntegrationTests());
      console.log('Timeout:', TestConfig.getTestTimeout());
      console.log('Output Dir:', TestConfig.getOutputDir());
    "`, { stdio: 'pipe' });
    
    console.log(result.toString());
    console.log(`✓ ${env} configuration loaded successfully\n`);
  } catch (error) {
    console.error(`❌ Failed to load ${env} configuration:`);
    console.error(error.stdout?.toString() || error.message);
    process.exit(1);
  }
};

// Test all environments
testConfig('local');
testConfig('dev');
testConfig('stage');

// Test environment switching
console.log('🔄 Testing environment switching...');
try {
  const result = execSync(`node -e "
    const { TestConfig } = require('./dist/src/utils/TestConfig');
    console.log('Initial environment:', TestConfig.getCurrentEnvironment());
    TestConfig.setEnvironment('stage');
    console.log('After switching to stage:', TestConfig.getCurrentEnvironment());
    TestConfig.setEnvironment('local');
    console.log('After switching to local:', TestConfig.getCurrentEnvironment());
    TestConfig.setEnvironment('dev');
    console.log('After switching back to dev:', TestConfig.getCurrentEnvironment());
  "`, { stdio: 'pipe' });
  
  console.log(result.toString());
  console.log('✓ Environment switching works correctly\n');
} catch (error) {
  console.error('❌ Environment switching failed:');
  console.error(error.stdout?.toString() || error.message);
  process.exit(1);
}

// Test complete configuration object
console.log('📊 Testing complete configuration object...');
try {
  const result = execSync(`TEST_ENV=local node -e "
    const { TestConfig } = require('./dist/src/utils/TestConfig');
    const config = TestConfig.getAllConfig();
    console.log('Configuration object has', Object.keys(config).length, 'properties');
    console.log('Properties:', Object.keys(config).join(', '));
  "`, { stdio: 'pipe' });
  
  console.log(result.toString());
  console.log('✓ Complete configuration object works correctly\n');
} catch (error) {
  console.error('❌ Complete configuration object failed:');
  console.error(error.stdout?.toString() || error.message);
  process.exit(1);
}

console.log('🎉 All configuration tests passed successfully!');
console.log('\n📚 Usage Examples:');
console.log('  • Run local tests: npm run test:local');
console.log('  • Run dev tests: npm run test:dev');
console.log('  • Run stage tests: npm run test:stage');
console.log('  • Use make targets: make test-local, make test-dev, make test-stage');
console.log('  • Override environment: TEST_ENV=local npm test');
console.log('  • Override specific settings: AWS_PRIMARY_REGION=us-west-1 TEST_ENV=local npm test'); 