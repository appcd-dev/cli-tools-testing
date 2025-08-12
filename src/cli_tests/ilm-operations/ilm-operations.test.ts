import { CliTestHelper } from '../../utils/CliTestHelper';
import { TestConfig } from '../../utils/TestConfig';

describe.skip('CLI Tests', () => {
    let cli: CliTestHelper;

    beforeAll(() => {
        // Print current environment configuration
        TestConfig.printCurrentConfig();
        
        // Use environment-aware CLI path
        cli = new CliTestHelper(TestConfig.getStackgenCliPath());
    });

    describe('Stackgen CLI Testing - ILM Happy paths', () => {
        it('should successfully give the version of stackgen cli', async () => {
            const result = await cli.expectOutputContains({
                command: 'version',
            }, TestConfig.getStackgenExpectedVersion());
            // expect(result.stdout).toContain('0.48.1');
        });
    });
}); 