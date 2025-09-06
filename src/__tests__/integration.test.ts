import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { dedent } from '../utils.js';

describe('loomtype CLI integration tests', () => {
  let testDir: string;
  let originalDir: string;
  const cli = path.join(process.cwd(), 'bin', 'cli.js');

  beforeEach(() => {
    // save original directory
    originalDir = process.cwd();
    // create a temporary directory for testing
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'loomtype-test-'));
    process.chdir(testDir);
  });

  afterEach(() => {
    // restore original directory before cleanup
    process.chdir(originalDir);
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  describe('init command', () => {
    it('should create .loomtype.yaml file', () => {
      execSync(`node ${cli} init`, { encoding: 'utf8' });

      expect(fs.existsSync('.loomtype.yaml')).toBe(true);
      const content = fs.readFileSync('.loomtype.yaml', 'utf8');
      expect(content).toContain('version: 1.0');
      expect(content).toContain('patterns:');
      expect(content).toContain('verify:');
    });

    it('should not overwrite existing file', () => {
      fs.writeFileSync('.loomtype.yaml', 'existing content');

      const output = execSync(`node ${cli} init`, { encoding: 'utf8' });

      expect(output).toContain('already exists');
      expect(fs.readFileSync('.loomtype.yaml', 'utf8')).toBe('existing content');
    });
  });

  describe('verify command', () => {
    it('should pass when checks succeed', () => {
      const config = dedent(`
        version: 1.0
        name: Test
        verify:
          test-check:
            check: echo "test"
            expect: test
      `);
      fs.writeFileSync('.loomtype.yaml', config);

      const output = execSync(`node ${cli} verify`, { encoding: 'utf8' });

      expect(output).toContain('✓');
      expect(output).toContain('All checks passed');
    });

    it('should fail when checks do not match', () => {
      const config = dedent(`
        version: 1.0
        name: Test
        verify:
          test-check:
            check: echo "wrong"
            expect: right
            on_fail: "Fix this test"
      `);
      fs.writeFileSync('.loomtype.yaml', config);

      let error: (Error & { stdout?: string; status?: number }) | undefined;
      try {
        execSync(`node ${cli} verify`, { encoding: 'utf8' });
      } catch (e) {
        error = e as Error & { stdout?: string; status?: number };
      }

      expect(error).toBeDefined();
      expect(error?.stdout).toContain('✗');
      expect(error?.stdout).toContain('Fix this test');
    });

    it('should handle no verify section', () => {
      const config = dedent(`
        version: 1.0
        name: Test
        patterns:
          Test:
            - Test pattern
      `);
      fs.writeFileSync('.loomtype.yaml', config);

      const output = execSync(`node ${cli} verify`, { encoding: 'utf8' });

      expect(output).toContain('No verification checks defined');
    });

    it('should handle timeout option', () => {
      const config = dedent(`
        version: 1.0
        name: Test
        verify:
          slow-check:
            check: sleep 2
            expect: exit 0
            timeout: 100
            on_fail: "Command timed out"
      `);
      fs.writeFileSync('.loomtype.yaml', config);

      let error: (Error & { stdout?: string; status?: number }) | undefined;
      try {
        execSync(`node ${cli} verify`, { encoding: 'utf8' });
      } catch (e) {
        error = e as Error & { stdout?: string; status?: number };
      }

      expect(error).toBeDefined();
      expect(error?.stdout).toContain('✗');
      // command should timeout since sleep 2 > 100ms timeout
    });
  });

  describe('help command', () => {
    it('should show help text', () => {
      const output = execSync(`node ${cli} help`, { encoding: 'utf8' });

      expect(output).toContain('loomtype');
      expect(output).toContain('verify AI implemented');
      expect(output).toContain('init');
      expect(output).toContain('verify');
    });
  });

  describe('version command', () => {
    it('should show version', () => {
      const output = execSync(`node ${cli} version`, { encoding: 'utf8' });

      // version should be a semantic version number
      expect(output.trim()).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('error handling', () => {
    it('should handle missing config file gracefully', () => {
      let error: (Error & { stderr?: string; status?: number }) | undefined;
      try {
        execSync(`node ${cli} verify`, { encoding: 'utf8', stdio: 'pipe' });
      } catch (e) {
        error = e as Error & { stderr?: string; status?: number };
      }

      expect(error).toBeDefined();
      expect(error?.status).toBe(1);
      expect(error?.stderr).toContain('No .loomtype.yaml or .loomtype.yml found');
    });

    it('should handle invalid YAML gracefully', () => {
      fs.writeFileSync('.loomtype.yaml', 'invalid: yaml: content: {');

      let error: (Error & { stderr?: string; status?: number }) | undefined;
      try {
        execSync(`node ${cli} verify`, { encoding: 'utf8', stdio: 'pipe' });
      } catch (e) {
        error = e as Error & { stderr?: string; status?: number };
      }

      expect(error).toBeDefined();
      expect(error?.status).toBe(1);
      expect(error?.stderr).toContain('Invalid YAML');
    });

    it('should handle command errors with helpful messages', () => {
      const config = dedent(`
        version: 1.0
        name: Test
        verify:
          bad-command:
            check: this-command-does-not-exist
            expect: found
            on_fail: "Install the missing tool"
      `);
      fs.writeFileSync('.loomtype.yaml', config);

      let error: (Error & { stdout?: string; status?: number }) | undefined;
      try {
        execSync(`node ${cli} verify`, { encoding: 'utf8' });
      } catch (e) {
        error = e as Error & { stdout?: string; status?: number };
      }

      expect(error).toBeDefined();
      expect(error?.stdout).toContain('✗');
      expect(error?.stdout).toContain('Install the missing tool');
    });

    it('should handle multiple check patterns correctly', () => {
      const config = dedent(`
        version: 1.0
        name: Test
        verify:
          exact-match:
            check: echo "exact"
            expect: exact
          contains-check:
            check: echo "this contains target word"
            expect: contains:target
          exit-code-check:
            check: exit 0
            expect: exit 0
          default-found-check:
            check: echo "something"
      `);
      fs.writeFileSync('.loomtype.yaml', config);

      const output = execSync(`node ${cli} verify`, { encoding: 'utf8' });

      expect(output).toContain('exact-match... ✓');
      expect(output).toContain('contains-check... ✓');
      expect(output).toContain('exit-code-check... ✓');
      expect(output).toContain('default-found-check... ✓');
      expect(output).toContain('All checks passed (4/4)');
    });

    it('should support .loomtype.yml extension', () => {
      // clean up any existing files
      if (fs.existsSync('.loomtype.yaml')) {
        fs.unlinkSync('.loomtype.yaml');
      }
      if (fs.existsSync('.loomtype.yml')) {
        fs.unlinkSync('.loomtype.yml');
      }

      const config = dedent(`
        version: 1.0
        name: Test
        verify:
          simple-check:
            check: echo "hello"
            expect: hello
      `);
      fs.writeFileSync('.loomtype.yml', config);

      const output = execSync(`node ${cli} verify`, { encoding: 'utf8' });
      expect(output).toContain('simple-check... ✓');

      // clean up
      fs.unlinkSync('.loomtype.yml');
    });

    it('should show elapsed time for slow checks', () => {
      const config = dedent(`
        version: 1.0
        name: Test
        verify:
          slow-check:
            check: sleep 1.1 && echo "done"
            expect: done
      `);
      fs.writeFileSync('.loomtype.yaml', config);

      const output = execSync(`node ${cli} verify`, { encoding: 'utf8' });
      expect(output).toMatch(/slow-check\.\.\. ✓ \(1\.\ds\)/);
    });
  });
});
