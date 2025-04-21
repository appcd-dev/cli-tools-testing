import { CliTestHelper } from '../utils/CliTestHelper';

describe('CLI Tests', () => {
  let cli: CliTestHelper;

  beforeAll(() => {
    // Replace this with the actual path to your CLI executable
    cli = new CliTestHelper('/opt/homebrew/bin/stackgen');
  });

  describe('Stackgen CLI Testing', () => {
    it('should successfully give the version of cloud2code cli', async () => {
      const result = await cli.expectOutputContains({
        command: 'version',
      }, '0.52.0');
      // expect(result.stdout).toContain('0.48.1');
    });

    it('should throw unique name excception when importing resource-override-policy', async () => {
      const result = await cli.expectCommandFailure({
        command: 'upload resource-override-policy',
        args: [
          '-p', '/Users/gauravchavan/Work/projects/cloud2code-automation/src/inputs/valid_policy_custom_resources.json'
        ],
      });
      
      expect(result.stderr).toContain('policy with same name already exists');
    });

    it('should fail to import resource-override-policy due to unique name constraint', async () => {
      const result = await cli.expectCommandFailure({
        command: 'upload resource-override-policy',
        args: [
          '-p', '/Users/gauravchavan/Work/projects/cloud2code-automation/src/inputs/policy_custom_resources.json'
        ],
      });
      
      expect(result.stderr).toContain('policy with same name already exists');
    });

    it('should list all the appstacks and their uuids', async () => {
      const result = await cli.expectCommandSuccess({
        command: 'appstack show'
      });
      
      expect(result.stdout).toContain('App Stack Name');
      expect(result.stdout).toContain('version');
      expect(result.stdout).toContain('uuid');
    });


    it('should handle invalid region gracefully', async () => {
      const result = await cli.expectCommandFailure({
        command: 'import aws',
        args: [
          '--region', 'invalid-region'
        ]
      });
      expect(result.exitCode).toBe(1);
      // expect(result.stderr).toContain('Could not connect to the endpoint URL: "https://s3.invalid-region.amazonaws.com/"');
    });

    it('stackgen import with default region', async () => {
      const result = await cli.expectCommandFailure({
        command: 'import state',
        args: [
          '--file', '../inputs/tfstates/aws/aws_vpc.tfstate'
        ]
      });
      expect(result.exitCode).toBe(1);
      expect(result.stdout).toContain('Appstack created successfully');
      expect(result.stdout).toContain('Starting Terraform state import');
      expect(result.stdout).toContain('cloudProvider: gcp');
      expect(result.stdout).toContain('Terraform state file uploaded successfully');
      expect(result.stdout).toContain('appstackID: ');
      expect(result.stdout).toContain('baseAppStackID: ');
      expect(result.stdout).toContain('Imported state successfully');
    });

  });
}); 