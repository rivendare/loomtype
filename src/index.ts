/**
 * loomtype - Pattern specifications for AI-assisted development
 *
 * Purpose:   Reduce AI iteration cycles by providing comprehensive upfront specifications
 * Approach:  Simple pattern templates + shell command verification
 *
 */

import fs from 'fs';
import yaml from 'js-yaml';
import { execSync } from 'child_process';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { Config, Result } from './types.js';
import { dedent } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DEFAULT_TIMEOUT_MS = 10000;
const SEPARATOR_LENGTH = 40;

class Loomtype {
  private configPath: string;

  constructor() {
    // support both .yaml and .yml extensions
    if (fs.existsSync('.loomtype.yaml')) {
      this.configPath = '.loomtype.yaml';
    } else if (fs.existsSync('.loomtype.yml')) {
      this.configPath = '.loomtype.yml';
    } else {
      this.configPath = '.loomtype.yaml'; // default for init
    }
  }

  loadConfig(): Config {
    if (!fs.existsSync(this.configPath)) {
      console.error(chalk.red('No .loomtype.yaml or .loomtype.yml found'));
      console.log('\nRun `loomtype init` to create one');
      process.exit(1);
    }

    try {
      return yaml.load(fs.readFileSync(this.configPath, 'utf8')) as Config;
    } catch (e) {
      console.error(chalk.red('Invalid YAML:'), (e as Error).message);
      process.exit(1);
    }
  }

  /**
   * Verify implementation - simple shell command checks
   */
  verify(config: Config): boolean {
    if (!config.verify || Object.keys(config.verify).length === 0) {
      console.log(chalk.yellow('No verification checks defined in .loomtype.yaml'));
      console.log('\nAdd a `verify:` section with checks. Example:');
      const example = dedent(`
        verify:
          soft-delete:
            check: grep -r "deleted_at" src/
            expect: found
            on_fail: "Add deleted_at field to models"
      `);
      console.log(chalk.gray(example));
      return true;
    }

    console.log(chalk.bold('\nVerifying implementation...\n'));

    const results: Result[] = [];

    for (const [name, check] of Object.entries(config.verify)) {
      process.stdout.write(`${name}... `);
      const startTime = Date.now();

      try {
        const output = execSync(check.check, {
          stdio: 'pipe',
          encoding: 'utf8',
          timeout: check.timeout || DEFAULT_TIMEOUT_MS,
          shell: process.platform === 'win32' ? 'powershell.exe' : undefined,
        }).toString();

        const passed = this.checkExpectation(output, check.expect);

        if (passed) {
          const elapsed = Date.now() - startTime;
          const timeStr = elapsed > 1000 ? chalk.gray(` (${(elapsed / 1000).toFixed(1)}s)`) : '';
          console.log(chalk.green('✓') + timeStr);
          results.push({ name, passed: true });
        } else {
          console.log(chalk.red('✗'));
          results.push({ name, passed: false, reason: 'Output mismatch' });
        }
      } catch (e) {
        console.log(chalk.red('✗'));
        const error = e as Error & { code?: string };
        const reason =
          error.code === 'ETIMEDOUT'
            ? `Command timed out after ${check.timeout || DEFAULT_TIMEOUT_MS}ms`
            : error.message;
        results.push({ name, passed: false, reason });
      }
    }

    // print summary
    const separator = '-'.repeat(SEPARATOR_LENGTH);
    console.log(`\n${separator}`);
    const passed = results.filter(r => r.passed).length;
    const total = results.length;

    if (passed === total) {
      console.log(chalk.green.bold(`✓ All checks passed (${passed}/${total})`));
    } else {
      console.log(chalk.red(`${passed}/${total} checks passed`));
      console.log('\n' + chalk.red('Failed checks:'));
      results
        .filter(r => !r.passed)
        .forEach(r => {
          console.log(chalk.red(`  ✗ ${r.name}`));
          if (r.reason) console.log(chalk.gray(`    ${r.reason}`));

          const check = config.verify![r.name];
          if (check.on_fail) {
            console.log(chalk.yellow(`    → ${check.on_fail}`));
          }
        });
    }

    return passed === total;
  }

  /**
   * Initialize a new project
   */
  init() {
    let configCreated = false;

    if (fs.existsSync(this.configPath)) {
      console.log(chalk.yellow('.loomtype.yaml already exists'));
    } else {
      const template = dedent(`
        version: 1.0
        name: My Project
        description: Add your project description here

        patterns:
          'Core Principles':
            - Describe what matters most for your project
            - Explain the patterns your team follows
            - List any specific technical requirements

        verify:
          example-check:
            check: echo "Replace this with your actual verification command"
            expect: Replace this with your actual verification command
            on_fail: Explain what needs to be fixed
      `);

      fs.writeFileSync(this.configPath, template);
      console.log(chalk.green(`✓ Created .loomtype.yaml template`));
      configCreated = true;
    }

    // always try to add verification instructions to AI files
    this.addAIInstructions();

    if (configCreated) {
      console.log('\n' + chalk.bold('Next steps:'));
      console.log('  1. Edit .loomtype.yaml to add your patterns and verification checks');
      console.log('  2. AI will run ' + chalk.cyan('loomtype verify') + ' until all checks pass');
      console.log('  3. You can also run ' + chalk.cyan('loomtype verify') + ' yourself');
    }
  }

  /**
   * Add loomtype verification instructions to AI assistant files
   */
  private addAIInstructions() {
    // AI assistant files to look for (in order of preference)
    // prettier-ignore
    const aiFiles = [
      'AGENTS.md',
      'CLAUDE.md',
      '.cursorrules',
      '.github/copilot-instructions.md'
    ];

    // find existing AI file or use AGENTS.md as default
    let targetFile = aiFiles.find(file => fs.existsSync(file));

    if (!targetFile) {
      targetFile = 'AGENTS.md';
      // create with minimal header
      fs.writeFileSync(targetFile, '# AI Assistant Instructions\n\n');
    }

    // check if loomtype is installed globally
    const isGlobal =
      fs.existsSync('/usr/local/bin/loomtype') ||
      fs.existsSync('/usr/bin/loomtype') ||
      process.env.PATH?.split(':').some(dir => fs.existsSync(path.join(dir, 'loomtype')));

    const verifyCommand = isGlobal ? 'loomtype verify' : 'npx loomtype verify';

    // the instruction block to add
    const blockStart = '<!-- BEGIN LOOMTYPE BLOCK - DO NOT EDIT -->';
    const blockEnd = '<!-- END LOOMTYPE BLOCK -->';
    const block = dedent(`
      ${blockStart}
      ## Pattern Verification

      This project uses loomtype for pattern verification. After making code changes:

      1. Run \`${verifyCommand}\`
      2. If any checks fail, read the on_fail hints and fix them
      3. Repeat until all checks pass

      The patterns and verification checks are defined in \`.loomtype.yaml\`
      ${blockEnd}
    `);

    // read existing content
    const content = fs.readFileSync(targetFile, 'utf8');

    // check if block already exists
    if (content.includes(blockStart)) {
      console.log(chalk.green(`✓ Already added to ${targetFile}`));
      return;
    }

    // append the block
    const newContent = content.trimEnd() + '\n\n' + block + '\n';
    fs.writeFileSync(targetFile, newContent);

    console.log(chalk.green(`✓ Added to ${targetFile}`));
  }

  run(command?: string) {
    const cmd = command || 'help';

    switch (cmd) {
      case 'init':
        this.init();
        break;

      case 'verify':
      case 'check': {
        const verifyConfig = this.loadConfig();
        const passed = this.verify(verifyConfig);
        process.exit(passed ? 0 : 1);
        break; // note: actually unreachable due to process.exit, but satisfies linter
      }

      case 'version': {
        const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
        console.log(pkg.version);
        break;
      }

      case 'help':
      default:
        console.log(
          dedent(`
            ${chalk.bold('loomtype')} - verify AI implemented your requirements

            ${chalk.bold('Usage:')}
              loomtype init          Create .loomtype.yaml and AI instructions
              loomtype verify        Check if patterns are implemented
              loomtype help          Show this help message
              loomtype version       Show version

            ${chalk.bold('Workflow:')}
              1. ${chalk.cyan('loomtype init')}         # Creates config + AI instructions
              2. ${chalk.gray('<AI implements code>')}
              3. ${chalk.cyan('loomtype verify')}       # AI verifies patterns exist

            ${chalk.bold('What this does:')}
              • Captures patterns you keep explaining to AI
              • Verifies implementation with shell commands  
              • Provides hints when checks fail

            ${chalk.bold('Config:')} .loomtype.yaml
            ${chalk.bold('Docs:')} https://github.com/rivendare/loomtype
        `)
        );
    }
  }

  private checkExpectation(output: string, expect?: string): boolean {
    if (!expect || expect === 'found') {
      // default: check if output is non-empty
      return output.trim().length > 0;
    }

    if (expect === 'exit 0') {
      // if we got here without error, command exited 0
      return true;
    }

    if (expect.startsWith('contains:')) {
      // check if output contains string
      const searchStr = expect.substring(9).trim();
      return output.includes(searchStr);
    }

    // exact match
    return output.trim() === expect.trim();
  }
}

export { Loomtype };
