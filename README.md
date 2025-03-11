# CLI Testing Framework

A TypeScript-based testing framework for automating CLI command testing, specifically designed for cloud operations.

## Features

- Execute CLI commands with various flags and options
- Verify command output and exit codes

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Usage

1. Create a new test file in the `src/cli_tests` directory
2. Import the `CliTestHelper` class:
```typescript
import { CliTestHelper } from '../utils/CliTestHelper';
```

3. Initialize the helper with your CLI executable path:
```typescript
const cli = new CliTestHelper('./path-to-your-cli');
```

4. Write your tests:
```typescript
describe('CLI Tests', () => {
  it('should execute command successfully', async () => {
    const result = await cli.expectCommandSuccess({
      command: 'your-command',
      args: ['--flag', 'value']
    });
    
    expect(result.stdout).toContain('expected output');
  });
});
```

## Available Methods

- `executeCommand(options)`: Execute a command and return the result
- `expectCommandSuccess(options)`: Execute a command and expect it to succeed
- `expectCommandFailure(options, expectedExitCode)`: Execute a command and expect it to fail
- `expectOutputContains(options, expectedOutput)`: Execute a command and expect output to contain text
- `expectOutputMatches(options, regex)`: Execute a command and expect output to match regex

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Handling Interactive Prompts

For commands that require user input, you can simulate responses using environment variables:

```typescript
const result = await cli.expectCommandSuccess({
  command: 'configure',
  env: {
    CLI_INPUT_NAME: 'test-project',
    CLI_INPUT_ENV: 'development'
  }
});
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 
