# Contributing to loomtype

First off, thanks for taking the time to contribute! 🎉

## Code of Conduct

Please be respectful and considerate in all interactions. We aim to maintain a welcoming environment for everyone, regardless of background or experience level.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Your environment (OS, Node.js version, npm version)
- Any relevant error messages or logs

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- A clear and descriptive title
- Detailed description of the proposed feature
- Why this enhancement would be useful
- Examples of how it would work

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes (`npm test`)
4. Make sure your code lints (`npm run lint`)
5. Update the documentation if needed
6. Issue that pull request!

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/loomtype.git
cd loomtype

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

## Development Workflow

```bash
# Watch mode for development
npm run watch

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

## Project Structure

```
src/
├── index.ts        # Main Loomtype class
├── cli.ts          # CLI entry point
├── types.ts        # TypeScript interfaces
└── __tests__/      # Integration tests
```

## Testing

- Write integration tests for new features
- Tests go in `src/__tests__/`
- Run tests with `npm test`
- Note: Coverage metrics show 0% because integration tests spawn separate processes, but all functionality is tested

## Coding Standards

- TypeScript strict mode enabled
- Use meaningful variable names
- Add types for all parameters and return values
- Keep functions focused and small
- Write clear error messages for users

## Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Keep first line under 72 characters
- Reference issues and pull requests when relevant

## Versioning

We use [SemVer](http://semver.org/) for versioning:
- MAJOR version for incompatible API changes
- MINOR version for backwards-compatible functionality
- PATCH version for backwards-compatible bug fixes

## Release Process

Releases are managed by maintainers:
1. Update version in package.json
2. Update CHANGELOG.md
3. Create git tag
4. Push to npm registry

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
