# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.2] - 2024-09-06

### Added

- `loomtype init` now automatically adds verification instructions to AI assistant files
- Auto-detection of AI files (CLAUDE.md, AGENTS.md, .cursorrules, .github/copilot-instructions.md)
- Creates AGENTS.md if no AI files exist
- Idempotent operation - safe to run init multiple times

### Changed

- Combined config creation and AI instructions into single `init` command
- Simplified workflow from 3 steps to 2

## [0.1.1] - 2024-09-06

### Added

- Support for `.loomtype.yml` extension in addition to `.loomtype.yaml`
- Elapsed time display for checks taking longer than 1 second

### Changed

- Error message now mentions both `.yaml` and `.yml` extensions when config not found

## [0.1.0] - 2024-09-06

### Added

- Initial release of loomtype
- Core CLI with `init`, `verify`, `help`, and `version` commands
- Pattern specification in YAML format
- Shell command verification system with four expectation types:
  - Default "found" check (non-empty output)
  - Exact string match
  - Contains substring check (`contains:text`)
  - Exit code check (`exit 0`)
- Timeout support for long-running commands
- Cross-platform support (Windows PowerShell, Unix shells)
- Colored output with helpful error messages
- Integration test suite
- Example configurations for Node.js, Django, and React projects
- TypeScript implementation with strict mode
- Comprehensive documentation and README

### Technical Details

- Built with TypeScript and ES modules
- Minimal dependencies (chalk for colors, js-yaml for parsing)
- Supports Node.js 16+
- Integration tests using Jest
- GitHub Actions CI for multiple Node versions

[Unreleased]: https://github.com/rivendare/loomtype/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/rivendare/loomtype/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/rivendare/loomtype/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/rivendare/loomtype/releases/tag/v0.1.0
