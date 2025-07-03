import { CliTestHelper } from '../utils/CliTestHelper';
import { TestConfig } from '../utils/TestConfig';

describe('CLI Tests', () => {
  let cli: CliTestHelper;

  beforeAll(() => {
    // Print current environment configuration
    TestConfig.printCurrentConfig();
    
    // Use environment-aware CLI path
    cli = new CliTestHelper(TestConfig.getStackgenCliPath());
  });

  describe.only('Stackgen CLI Testing', () => {
    it('should successfully give the version of stackgen cli', async () => {
      const result = await cli.expectOutputContains({
        command: 'version',
      }, TestConfig.getStackgenExpectedVersion());
    });
/*========================================================================================================================*/
    it.skip('should successfully upload resource-restriction-policy', async () => {
      // Skip integration tests in CI unless explicitly enabled
      if (TestConfig.shouldSkipIntegrationTests()) {
        console.log('Skipping integration test in CI environment');
        return;
      }

      const result = await cli.expectCommandSuccess({
        command: 'upload resource-restriction-policy',
        args: [
          '-p', TestConfig.getPolicyPath('version-restriction.json')
        ],
        timeout: TestConfig.getTestTimeout()
      });

      expect(result.stdout).toContain('resource restriction policy upload complete!');
    });
/*========================================================================================================================*/
    it.skip('should fail to import resource-override-policy due to unique name constraint', async () => {
      // Skip integration tests in CI unless explicitly enabled
      if (TestConfig.shouldSkipIntegrationTests()) {
        console.log('Skipping integration test in CI environment');
        return;
      }

      const result = await cli.expectCommandFailure({
        command: 'upload resource-restriction-policy',
        args: [
          '-p', TestConfig.getPolicyPath('version-restriction.json')
        ],
        timeout: TestConfig.getTestTimeout()
      });

      expect(result.stderr).toContain('policy with same name already exists');
    });
/*========================================================================================================================*/
    it('should list all the appstacks and their uuids', async () => {
      // Skip integration tests in CI unless explicitly enabled
      if (TestConfig.shouldSkipIntegrationTests()) {
        console.log('Skipping integration test in CI environment');
        return;
      }

      const result = await cli.expectCommandSuccess({
        command: 'appstack show',
        timeout: TestConfig.getTestTimeout()
      });

      expect(result.stdout).toContain('App Stack Name');
      expect(result.stdout).toContain('version');
      expect(result.stdout).toContain('uuid');
    });
/*========================================================================================================================*/
    it('successful import state command', async () => {
      // Skip integration tests in CI unless explicitly enabled
      if (TestConfig.shouldSkipIntegrationTests()) {
        console.log('Skipping integration test in CI environment');
        return;
      }

      const result = await cli.expectCommandSuccess({
        command: 'import state',
        args: [
          '--file', TestConfig.getTfStatePath('aws_vpc4.tfstate')
        ],
        timeout: TestConfig.getTestTimeout()
      });
      expect(result.stdout).toContain('Appstack created successfully');
      expect(result.stdout).toContain('Starting import to the appstack');
      expect(result.stdout).toContain('Starting Terraform state import');
      expect(result.stdout).toContain('Uploading tfstate file');
      expect(result.stdout).toContain('Import completed successfully');
      expect(result.stdout).toContain('Imported state successfully');
      expect(result.stdout).toContain('You can view the topology at :');
    });
/*========================================================================================================================*/
    it('successful import state command with an appstack id', async () => {
      // Skip integration tests in CI unless explicitly enabled
      if (TestConfig.shouldSkipIntegrationTests()) {
        console.log('Skipping integration test in CI environment');
        return;
      }

      console.log('TestConfig.getTfStatePath(aws_vpc4.tfstate) : ', TestConfig.getTfStatePath('aws_vpc4.tfstate'));
      const result = await cli.expectCommandSuccess({
        command: 'import state',
        args: [
          '--file', TestConfig.getTfStatePath('aws_vpc4.tfstate'),
          '--appstack-id', TestConfig.getTestAppstackId()
        ],
        timeout: TestConfig.getTestTimeout()
      });
      expect(result.stdout).toContain('Starting import process');
      expect(result.stdout).toContain('Creating new appstack version');
      expect(result.stdout).toContain('Appstack version created successfully');
      expect(result.stdout).toContain('Starting import to the appstack');
      expect(result.stdout).toContain('Importing Terraform state');
      expect(result.stdout).toContain('Uploading tfstate file');
      expect(result.stdout).toContain('Import completed successfully');
      expect(result.stdout).toContain('Imported state successfully');
      expect(result.stdout).toContain('You can view the topology at :');
    });
/*========================================================================================================================*/
    it('should handle invalid command gracefully', async () => {
      const result = await cli.expectCommandFailure({
        command: 'import state',
        args: [
        ],
        timeout: TestConfig.getTestTimeout()
      });
      expect(result.stderr).toContain('required flag(s) "file" not set');
    });
/*========================================================================================================================*/
  });
}); 