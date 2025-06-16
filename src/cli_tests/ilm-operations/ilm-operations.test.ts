import { CliTestHelper } from '../../utils/CliTestHelper';

describe('CLI Tests', () => {
    let cli: CliTestHelper;

    beforeAll(() => {
        // Replace this with the actual path to your CLI executable
        cli = new CliTestHelper('/opt/homebrew/bin/stackgen');
    });

    describe.only('Stackgen CLI Testing - ILM Happy paths', () => {
        it('should successfully give the version of cloud2code cli', async () => {
            const result = await cli.expectOutputContains({
                command: 'version',
            }, '0.61.0');
            // expect(result.stdout).toContain('0.48.1');
        });
    });
}); 