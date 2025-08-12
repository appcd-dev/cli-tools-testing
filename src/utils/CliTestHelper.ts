import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface CliCommandOptions {
  command: string;
  args?: string[];
  env?: NodeJS.ProcessEnv;
  timeout?: number;
}

export interface CliCommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

interface TableColumn {
  name: string;
  value: string | RegExp;
}

interface TableRow {
  [key: string]: string;
}

export class CliTestHelper {
  private cliPath: string;

  constructor(cliPath: string) {
    this.cliPath = cliPath;
  }

  async executeCommand(options: CliCommandOptions): Promise<CliCommandResult> {
    const { command, args = [], env = {}, timeout = 300000 } = options;
    const fullCommand = `${this.cliPath} ${command} ${args.join(' ')}`;

    try {
      const { stdout, stderr } = await execAsync(fullCommand, {
        env: { ...process.env, ...env },
        timeout,
      });

      return {
        stdout,
        stderr,
        exitCode: 0,
      };
    } catch (error: any) {
      return {
        stdout: error.stdout || '',
        stderr: error.stderr || error.message,
        exitCode: error.code || 1,
      };
    }
  }

  async expectCommandSuccess(options: CliCommandOptions): Promise<CliCommandResult> {
    const result = await this.executeCommand(options);
    
    if (result.exitCode !== 0) {
      const { command, args = [] } = options;
      const fullCommand = `${this.cliPath} ${command} ${args.join(' ')}`;
      
      // Create a detailed error message that will appear in HTML reports
      const errorDetails = [
        '═══════════════════════════════════════════════════════════════',
        '🚫 COMMAND EXECUTION FAILED',
        '═══════════════════════════════════════════════════════════════',
        '',
        `📋 FAILED COMMAND:`,
        `   ${fullCommand}`,
        '',
        `❌ EXIT CODE: ${result.exitCode}`,
        '',
        '📤 STDOUT OUTPUT:',
        '───────────────────────────────────────────────────────────────',
        result.stdout || '(no output)',
        '',
        '🔥 STDERR OUTPUT:',
        '───────────────────────────────────────────────────────────────',
        result.stderr || '(no errors)',
        '',
        '═══════════════════════════════════════════════════════════════'
      ].join('\n');
      
      throw new Error(errorDetails);
    }
    
    return result;
  }

  async expectCommandFailure(options: CliCommandOptions, expectedExitCode: number = 1): Promise<CliCommandResult> {
    const result = await this.executeCommand(options);
    expect(result.exitCode).toBe(expectedExitCode);
    return result;
  }



  async expectOutputContains(options: CliCommandOptions, expectedOutput: string): Promise<CliCommandResult> {
    const result = await this.executeCommand(options);
    
    try {
      expect(result.stdout).toContain(expectedOutput);
    } catch (error) {
      const { command, args = [] } = options;
      const fullCommand = `${this.cliPath} ${command} ${args.join(' ')}`;
      
      // Create enhanced error message for output assertion failures
      const errorDetails = [
        '═══════════════════════════════════════════════════════════════',
        '🚫 OUTPUT ASSERTION FAILED',
        '═══════════════════════════════════════════════════════════════',
        '',
        `📋 EXECUTED COMMAND:`,
        `   ${fullCommand}`,
        '',
        `❌ EXIT CODE: ${result.exitCode}`,
        '',
        `🔍 EXPECTED OUTPUT TO CONTAIN:`,
        `   "${expectedOutput}"`,
        '',
        '📤 ACTUAL STDOUT OUTPUT:',
        '───────────────────────────────────────────────────────────────',
        result.stdout || '(no output)',
        '',
        '🔥 STDERR OUTPUT:',
        '───────────────────────────────────────────────────────────────',
        result.stderr || '(no errors)',
        '',
        '═══════════════════════════════════════════════════════════════'
      ].join('\n');
      
      throw new Error(errorDetails);
    }
    
    return result;
  }

  async expectOutputMatches(options: CliCommandOptions, regex: RegExp): Promise<CliCommandResult> {
    const result = await this.executeCommand(options);
    
    try {
      expect(result.stdout).toMatch(regex);
    } catch (error) {
      const { command, args = [] } = options;
      const fullCommand = `${this.cliPath} ${command} ${args.join(' ')}`;
      
      // Create enhanced error message for regex assertion failures
      const errorDetails = [
        '═══════════════════════════════════════════════════════════════',
        '🚫 REGEX ASSERTION FAILED',
        '═══════════════════════════════════════════════════════════════',
        '',
        `📋 EXECUTED COMMAND:`,
        `   ${fullCommand}`,
        '',
        `❌ EXIT CODE: ${result.exitCode}`,
        '',
        `🔍 EXPECTED OUTPUT TO MATCH REGEX:`,
        `   ${regex}`,
        '',
        '📤 ACTUAL STDOUT OUTPUT:',
        '───────────────────────────────────────────────────────────────',
        result.stdout || '(no output)',
        '',
        '🔥 STDERR OUTPUT:',
        '───────────────────────────────────────────────────────────────',
        result.stderr || '(no errors)',
        '',
        '═══════════════════════════════════════════════════════════════'
      ].join('\n');
      
      throw new Error(errorDetails);
    }
    
    return result;
  }

  /**
   * Enhanced assertion helper that includes command details in failure messages
   */
  assertResultContains(result: CliCommandResult, options: CliCommandOptions, field: 'stdout' | 'stderr', expectedText: string): void {
    const fieldValue = result[field];
    
    try {
      expect(fieldValue).toContain(expectedText);
    } catch (error) {
      const { command, args = [] } = options;
      const fullCommand = `${this.cliPath} ${command} ${args.join(' ')}`;
      
      const errorDetails = [
        '═══════════════════════════════════════════════════════════════',
        `🚫 ${field.toUpperCase()} ASSERTION FAILED`,
        '═══════════════════════════════════════════════════════════════',
        '',
        `📋 EXECUTED COMMAND:`,
        `   ${fullCommand}`,
        '',
        `❌ EXIT CODE: ${result.exitCode}`,
        '',
        `🔍 EXPECTED ${field.toUpperCase()} TO CONTAIN:`,
        `   "${expectedText}"`,
        '',
        '📤 ACTUAL STDOUT OUTPUT:',
        '───────────────────────────────────────────────────────────────',
        result.stdout || '(no output)',
        '',
        '🔥 STDERR OUTPUT:',
        '───────────────────────────────────────────────────────────────',
        result.stderr || '(no errors)',
        '',
        '═══════════════════════════════════════════════════════════════'
      ].join('\n');
      
      throw new Error(errorDetails);
    }
  }

  // // Table verification methods
  // private parseTable(output: string): TableRow[] {
  //   // Split output into lines and remove empty lines
  //   const lines = output.split('\n').filter(line => line.trim());
    
  //   // Find the header line (usually contains column names)
  //   const headerLine = lines.findIndex(line => 
  //     line.includes('---') || // Markdown table separator
  //     line.includes('===') || // Alternative separator
  //     line.includes('  ')     // Space-separated columns
  //   );

  //   if (headerLine === -1) {
  //     throw new Error('No table header found in output');
  //   }

  //   // Parse header
  //   const header = lines[headerLine - 1]
  //     .split(/\s+/)
  //     .map(col => col.trim())
  //     .filter(Boolean);

  //   // Parse rows
  //   const rows: TableRow[] = [];
  //   for (let i = headerLine + 1; i < lines.length; i++) {
  //     const row = lines[i].split(/\s+/).map(cell => cell.trim());
  //     if (row.length === header.length) {
  //       const rowObj: TableRow = {};
  //       header.forEach((col, index) => {
  //         rowObj[col] = row[index];
  //       });
  //       rows.push(rowObj);
  //     }
  //   }

  //   return rows;
  // }

  // async expectTableContains(options: CliCommandOptions, expectedColumns: TableColumn[]): Promise<CliCommandResult> {
  //   const result = await this.executeCommand(options);
  //   const table = this.parseTable(result.stdout);

  //   // Verify each expected column exists and matches
  //   expectedColumns.forEach(({ name, value }) => {
  //     const columnExists = table.some(row => name in row);
  //     expect(columnExists).toBe(true, `Column "${name}" not found in table`);

  //     if (value instanceof RegExp) {
  //       const columnMatches = table.some(row => value.test(row[name]));
  //       expect(columnMatches).toBe(true, `No row found matching "${value}" in column "${name}"`);
  //     } else {
  //       const columnContains = table.some(row => row[name].includes(value));
  //       expect(columnContains).toBe(true, `No row found containing "${value}" in column "${name}"`);
  //     }
  //   });

  //   return result;
  // }

  // async expectTableRowCount(options: CliCommandOptions, expectedCount: number): Promise<CliCommandResult> {
  //   const result = await this.executeCommand(options);
  //   const table = this.parseTable(result.stdout);
  //   expect(table.length).toBe(expectedCount);
  //   return result;
  // }

  // async expectTableRow(options: CliCommandOptions, expectedRow: TableRow): Promise<CliCommandResult> {
  //   const result = await this.executeCommand(options);
  //   const table = this.parseTable(result.stdout);
    
  //   const rowFound = table.some(row => {
  //     return Object.entries(expectedRow).every(([key, value]) => {
  //       if (value instanceof RegExp) {
  //         return value.test(row[key]);
  //       }
  //       return row[key] === value;
  //     });
  //   });

  //   expect(rowFound).toBe(true, `Expected row not found in table: ${JSON.stringify(expectedRow)}`);
  //   return result;
  // }

  // async expectTableColumnValues(options: CliCommandOptions, columnName: string, expectedValues: (string | RegExp)[]): Promise<CliCommandResult> {
  //   const result = await this.executeCommand(options);
  //   const table = this.parseTable(result.stdout);
    
  //   const columnValues = table.map(row => row[columnName]);
    
  //   expectedValues.forEach(value => {
  //     if (value instanceof RegExp) {
  //       expect(columnValues.some(v => value.test(v))).toBe(true, 
  //         `No value found matching "${value}" in column "${columnName}"`);
  //     } else {
  //       expect(columnValues).toContain(value, 
  //         `Value "${value}" not found in column "${columnName}"`);
  //     }
  //   });

  //   return result;
  // }
} 