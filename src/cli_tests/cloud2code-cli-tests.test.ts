import { CliTestHelper } from '../utils/CliTestHelper';

describe('CLI Tests', () => {
  let cli: CliTestHelper;

  beforeAll(() => {
    // Replace this with the actual path to your CLI executable
    cli = new CliTestHelper('/opt/homebrew/bin/cloud2code');
  });

  describe('Cloud2Code CLI Testing', () => {
    it('should successfully give the version of cloud2code cli', async () => {
      const result = await cli.expectCommandSuccess({
        command: 'version',
        // args: ['--region', 'us-west-2'],
      });
      
      // Verify the output contains expected information
      expect(result.stdout).toContain('0.2.0');
    });

    it('should successfully import aws_neptune_cluster resources', async () => {
      const result = await cli.expectCommandSuccess({
        command: 'import aws',
        args: [
          '--region', 'eu-west-2',
          '--include', 'aws_neptune_cluster',
          '--output-dir', '/Users/gauravchavan/Documents/Autodesk/Cloud2codeImports/aws_neptune_cluster'
        ],
      });
      
      // Verify the output contains expected information
      expect(result.stdout).toContain('Include: [aws_neptune_cluster]');
      expect(result.stdout).toContain('Writing TFState Done!');
      expect(result.stdout).toContain('Scanning aws_neptune_cluster [1/1] Done!');
    });

    it('should not import any aws_neptune_cluster resources due to their absence of resourcesin the region', async () => {
      const result = await cli.expectCommandSuccess({
        command: 'import aws',
        args: [
          '--region', 'us-west-2',
          '--include', 'aws_neptune_cluster',
          '--output-dir', '/Users/gauravchavan/Documents/Autodesk/Cloud2codeImports/aws_neptune_cluster'
        ],
      });
      
      // Verify the output contains expected information
      expect(result.stdout).toContain('Include: [aws_neptune_cluster]');
      expect(result.stdout).toContain('Writing TFState Done!');
      expect(result.stdout).not.toContain('Scanning aws_neptune_cluster [1/1] Done!');
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