import * as dotenv from 'dotenv';
import * as path from 'path';

export class TestConfig {
  private static initialized = false;

  /**
   * Initialize the configuration by loading the appropriate .env file
   */
  private static initialize(): void {
    if (this.initialized) return;

    const environment = process.env.TEST_ENV || 'local';
    // Resolve path relative to project root, not dist directory
    const envFile = path.join(process.cwd(), 'src', 'config', `${environment}.env`);

    try {
      const result = dotenv.config({ path: envFile });
      if (result.error) {
        console.warn(`Warning: Could not load ${envFile}, using default values`);
      } else {
        console.log(`Loaded configuration from ${envFile}`);
      }
    } catch (error) {
      console.warn(`Warning: Error loading environment file: ${error}`);
    }

    this.initialized = true;
  }

  /**
   * Set the environment for testing
   * @param environment - The environment name ('local', 'dev', or 'stage')
   */
  static setEnvironment(environment: string): void {
    process.env.TEST_ENV = environment;
    this.initialized = false; // Force re-initialization
    this.initialize();
    console.log(`Test environment set to: ${this.getCurrentEnvironment()}`);
  }

  // CLI Path Methods
  static getStackgenCliPath(): string {
    this.initialize();
    return process.env.STACKGEN_CLI_PATH || '/opt/homebrew/bin/stackgen';
  }

  static getCloud2CodeCliPath(): string {
    this.initialize();
    return process.env.CLOUD2CODE_CLI_PATH || '/opt/homebrew/bin/cloud2code';
  }

  // Expected Version Methods
  static getStackgenExpectedVersion(): string {
    this.initialize();
    return process.env.STACKGEN_EXPECTED_VERSION || '0.62.0';
  }

  static getCloud2CodeExpectedVersion(): string {
    this.initialize();
    return process.env.CLOUD2CODE_EXPECTED_VERSION || '0.2.0';
  }

  // AWS Configuration Methods
  static getAwsPrimaryRegion(): string {
    this.initialize();
    return process.env.AWS_PRIMARY_REGION || 'eu-west-2';
  }

  static getAwsSecondaryRegion(): string {
    this.initialize();
    return process.env.AWS_SECONDARY_REGION || 'us-west-2';
  }

  // Appstack Methods
  static getTestAppstackId(): string {
    this.initialize();
    return process.env.TEST_APPSTACK_ID || '00000000-0000-0000-0000-000000000000';
  }

  // Test Data Path Methods
  static getTestDataBasePath(): string {
    this.initialize();
    return process.env.TEST_DATA_PATH || '/var/lib/testData';
  }

  static getPolicyPath(policyFile: string): string {
    this.initialize();
    const basePath = this.getTestDataBasePath();
    const policyBasePath = process.env.POLICY_BASE_PATH;

    if (policyBasePath && policyBasePath.trim()) {
      return path.join(basePath, policyBasePath, policyFile);
    }
    return path.join(basePath, policyFile);
  }

  static getTfStatePath(stateFile: string): string {
    this.initialize();
    const basePath = this.getTestDataBasePath();
    const tfstateBasePath = process.env.TFSTATE_BASE_PATH;

    if (tfstateBasePath && tfstateBasePath.trim()) {
      return path.join(basePath, tfstateBasePath, stateFile);
    }

    return path.join(basePath + '/', stateFile);
  }

  // Test Configuration Methods
  static shouldSkipIntegrationTests(): boolean {
    this.initialize();
    const skipIntegration = process.env.SKIP_INTEGRATION_TESTS?.toLowerCase();
    if (skipIntegration === 'true') return true;
    if (skipIntegration === 'false') return false;

    // Fallback to CI detection if not explicitly set
    return (process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true') &&
      process.env.RUN_INTEGRATION_TESTS !== 'true';
  }

  static getTestTimeout(): number {
    this.initialize();
    const timeout = process.env.TEST_TIMEOUT;
    return timeout ? parseInt(timeout, 10) : 300000;
  }

  static getOutputDir(suffix?: string): string {
    this.initialize();
    const baseDir = process.env.OUTPUT_DIR || './terraform-outputs';
    return suffix ? path.join(baseDir, suffix) : baseDir;
  }

  // Environment Info Methods
  static getCurrentEnvironment(): string {
    this.initialize();
    return process.env.ENVIRONMENT_NAME || process.env.TEST_ENV || 'local';
  }

  static getEnvironmentDescription(): string {
    this.initialize();
    return process.env.ENVIRONMENT_DESCRIPTION || 'Default environment configuration';
  }

  // Utility Methods
  static printCurrentConfig(): void {
    this.initialize();
    console.log('='.repeat(50));
    console.log(`Current Test Environment: ${this.getCurrentEnvironment()}`);
    console.log(`Stackgen CLI: ${this.getStackgenCliPath()}`);
    console.log(`Cloud2Code CLI: ${this.getCloud2CodeCliPath()}`);
    console.log(`Stackgen Expected Version: ${this.getStackgenExpectedVersion()}`);
    console.log(`Cloud2Code Expected Version: ${this.getCloud2CodeExpectedVersion()}`);
    console.log(`Primary AWS Region: ${this.getAwsPrimaryRegion()}`);
    console.log(`Secondary AWS Region: ${this.getAwsSecondaryRegion()}`);
    console.log(`Test Appstack ID: ${this.getTestAppstackId()}`);
    console.log(`Test Data Path: ${this.getTestDataBasePath()}`);
    console.log(`Skip Integration Tests: ${this.shouldSkipIntegrationTests()}`);
    console.log(`Test Timeout: ${this.getTestTimeout()}ms`);
    console.log(`Output Directory: ${this.getOutputDir()}`);
    console.log('='.repeat(50));
  }

  /**
   * Get all current configuration as an object (for debugging)
   */
  static getAllConfig(): Record<string, any> {
    this.initialize();
    return {
      environment: this.getCurrentEnvironment(),
      description: this.getEnvironmentDescription(),
      stackgenCliPath: this.getStackgenCliPath(),
      cloud2codeCliPath: this.getCloud2CodeCliPath(),
      stackgenExpectedVersion: this.getStackgenExpectedVersion(),
      cloud2codeExpectedVersion: this.getCloud2CodeExpectedVersion(),
      awsPrimaryRegion: this.getAwsPrimaryRegion(),
      awsSecondaryRegion: this.getAwsSecondaryRegion(),
      testAppstackId: this.getTestAppstackId(),
      testDataBasePath: this.getTestDataBasePath(),
      skipIntegrationTests: this.shouldSkipIntegrationTests(),
      testTimeout: this.getTestTimeout(),
      outputDir: this.getOutputDir()
    };
  }
} 