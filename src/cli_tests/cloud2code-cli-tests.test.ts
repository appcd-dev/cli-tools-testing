import { CliTestHelper } from '../utils/CliTestHelper';
import { TestConfig } from '../utils/TestConfig';

describe.skip('CLI Tests', () => {
  let cli: CliTestHelper;

  beforeAll(() => {
    // Print current environment configuration
    TestConfig.printCurrentConfig();
    
    // Use environment-aware CLI path
    cli = new CliTestHelper(TestConfig.getCloud2CodeCliPath());
  });

  describe.skip('Cloud2Code CLI Testing', () => {
    it('should successfully give the version of cloud2code cli', async () => {
      const result = await cli.expectCommandSuccess({
        command: 'version',
      });

      // Verify the output contains expected information
      expect(result.stdout).toContain(TestConfig.getCloud2CodeExpectedVersion());
    });

    it('should successfully import aws_neptune_cluster resources', async () => {
      // Skip integration tests in CI unless explicitly enabled
      if (TestConfig.shouldSkipIntegrationTests()) {
        console.log('Skipping integration test in CI environment');
        return;
      }

      const result = await cli.expectCommandSuccess({
        command: 'import aws',
        args: [
          '--region', TestConfig.getAwsPrimaryRegion(),
          '--include', 'aws_neptune_cluster',
          '--output-dir', TestConfig.getOutputDir('aws_neptune_cluster')
        ],
        timeout: TestConfig.getTestTimeout()
      });

      // Verify the output contains expected information
      expect(result.stdout).toContain('Include: [aws_neptune_cluster]');
      expect(result.stdout).toContain('Writing TFState Done!');
      expect(result.stdout).toContain('Scanning aws_neptune_cluster [1/1] Done!');
    });

    it('should not import any aws_neptune_cluster resources due to their absence in the region', async () => {
      // Skip integration tests in CI unless explicitly enabled
      if (TestConfig.shouldSkipIntegrationTests()) {
        console.log('Skipping integration test in CI environment');
        return;
      }

      const result = await cli.expectCommandSuccess({
        command: 'import aws',
        args: [
          '--region', TestConfig.getAwsSecondaryRegion(),
          '--include', 'aws_neptune_cluster',
          '--output-dir', TestConfig.getOutputDir('aws_neptune_cluster')
        ],
        timeout: TestConfig.getTestTimeout()
      });

      // Verify the output contains expected information
      expect(result.stdout).toContain('Include: [aws_neptune_cluster]');
      expect(result.stdout).toContain('Writing TFState Done!');
      expect(result.stdout).not.toContain('Scanning aws_neptune_cluster [1/1] Done!');
    });

    it('should successfully import all aws_iam and related resources', async () => {
      // Skip integration tests in CI unless explicitly enabled
      if (TestConfig.shouldSkipIntegrationTests()) {
        console.log('Skipping integration test in CI environment');
        return;
      }

      const result = await cli.expectCommandSuccess({
        command: 'import aws',
        args: [
          '--region', TestConfig.getAwsPrimaryRegion(),
          '--include', 'aws_iam_account_password_policy,aws_iam_openid_connect_provider,aws_iam_instance_profile,aws_iam_access_key,aws_iam_policy,aws_iam_role,aws_iam_saml_provider,aws_iam_user,aws_iam_user_policy,aws_iam_user_policy_attachment,aws_iam_role_policy',
          '--output-dir', TestConfig.getOutputDir('aws_iam_' + Date.now())
        ],
        timeout: TestConfig.getTestTimeout()
      });

      // Verify the output contains expected information
      expect(result.stdout).toContain('Include: [aws_iam_account_password_policy aws_iam_openid_connect_provider aws_iam_instance_profile aws_iam_access_key aws_iam_policy aws_iam_role aws_iam_saml_provider aws_iam_user aws_iam_user_policy aws_iam_user_policy_attachment aws_iam_role_policy]');
      expect(result.stdout).toContain('Scanning aws_iam_account_password_policy');
      expect(result.stdout).toContain('Scanning aws_iam_openid_connect_provider');
      expect(result.stdout).toContain('Scanning aws_iam_instance_profile');
      expect(result.stdout).toContain('Scanning aws_iam_access_key');
      expect(result.stdout).toContain('Scanning aws_iam_policy');
      expect(result.stdout).toContain('Scanning aws_iam_role');
      expect(result.stdout).toContain('Scanning aws_iam_saml_provider');
      expect(result.stdout).toContain('Scanning aws_iam_user');
      expect(result.stdout).toContain('Scanning aws_iam_user_policy');
      expect(result.stdout).toContain('Scanning aws_iam_user_policy_attachment');
      expect(result.stdout).toContain('Scanning aws_iam_role_policy');
      expect(result.stdout).toContain('Writing TFState Done!');
    });

    // it('should handle invalid region gracefully', async () => {
    //   const result = await cli.expectCommandFailure({
    //     command: 'import aws',
    //     args: [
    //       '--region', 'invalid-region',

    //     ]
    //   });
    //   expect(result.exitCode).toBe(255);
    //   // expect(result.stderr).toContain('Could not connect to the endpoint URL: "https://s3.invalid-region.amazonaws.com/"');
    // });

    // it('should create a new resource with specified options', async () => {
    //   const result = await cli.expectCommandSuccess({
    //     command: 'create',
    //     args: [
    //       '--name', 'test-resource',
    //       '--type', 'ec2',
    //       '--size', 't2.micro'
    //     ],
    //   });

    //   expect(result.stdout).toMatch(/Resource created successfully/);
    // });

    // it('should handle interactive prompts', async () => {
    //   // Example of handling interactive prompts
    //   const result = await cli.expectCommandSuccess({
    //     command: 'configure',
    //     env: {
    //       // Set environment variables to simulate user input
    //       CLI_INPUT_NAME: 'test-project',
    //       CLI_INPUT_ENV: 'development'
    //     }
    //   });

    //   expect(result.stdout).toContain('Configuration completed');
    // });
  });
}); 