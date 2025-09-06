# <img src="https://raw.githubusercontent.com/rivendare/loomtype/main/assets/logo.png" alt="loomtype" width="34" height="34"> loomtype

[![npm version](https://badge.fury.io/js/loomtype.svg)](https://www.npmjs.com/package/loomtype)
[![CI](https://github.com/rivendare/loomtype/actions/workflows/ci.yml/badge.svg)](https://github.com/rivendare/loomtype/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**tl;dr - give AI context about your patterns, then verify it implemented them correctly

**Why "loomtype"?**

➡️ Helps AI weave your patterns into code and verify they hold. (Named by AI because it was free on npm.)

## Why This Exists

> "Treating AI like a 'junior developer who doesn't learn' became my mental model for success."
> — Vincent Quigley, [Sanity.io](https://www.sanity.io/blog/first-attempt-will-be-95-garbage)

Every time you work with AI on a new project, you explain the same patterns:
- "Hash passwords with bcrypt, never store plain text"
- "Use environment variables for secrets, not hardcoded values"  
- "Add input validation to all API endpoints"

Capturing these in a YAML file with shell commands to verify implementation cuts the back-and-forth significantly.

**New projects**: Define patterns upfront, AI implements them correctly.  
**Existing projects**: Capture your conventions so AI follows them instead of making up new ones.

## How It Works

1. **Define patterns and verification in `.loomtype.yaml`**
   ```yaml
   # .loomtype.yaml
   version: 1.0
   name: API Service
   description: REST API with production patterns

   patterns:
     'Database':
       - Use environment variables for database credentials
       - Create indexes on foreign keys
       - Use transactions for multi-step operations
     
     'API Security':
       - Hash passwords with bcrypt (never store plain text)
       - Validate all input with Joi, Zod, or similar
   
   verify:
     password-hashing:
       check: grep -rE "bcrypt|argon2" src/
       expect: found
       on_fail: "Hash passwords with bcrypt: npm install bcrypt"
     
     env-variables:
       check: grep -r "process.env\|dotenv" src/
       expect: found
       on_fail: "Use environment variables for secrets (install dotenv)"
     
     input-validation:
       check: grep -rE "\.validate\(|\.safeParse\(|Joi\.|zod" src/
       expect: found
       on_fail: "Add input validation to your API endpoints"
   ```

2. **Give the YAML file to AI along with instructions to use `loomtype verify`**

3. **AI iteratively implements and verifies**
   ```bash
   loomtype verify
   ```
   ```
   password-hashing... ✓
   env-variables... ✓
   input-validation... ✓
   
   ✓ All checks passed (3/3)
   ```

## Installation

```bash
npm install -g loomtype
```

## Quick Start

```bash
# create .loomtype.yaml with your patterns
loomtype init

# verify AI implemented them correctly
loomtype verify
```

## How to Use with AI

Give your AI this prompt:

```
This project uses loomtype for pattern verification. Please:

1. Read the .loomtype.yaml file to understand required patterns
2. Implement all patterns described
3. After each major change, run `loomtype verify` 
4. If any checks fail, read the on_fail hints and fix them
5. Continue until all checks pass

Important: Keep running `loomtype verify` as you work to ensure patterns are properly implemented!
```

## Examples

Check out the [examples directory](./examples) for real-world `.loomtype.yaml` files:
- [Node.js REST API](./examples/nodejs-api.yaml)
- [Django Application](./examples/python-django.yaml)  
- [React TypeScript](./examples/react-typescript.yaml)

## Commands

```bash
loomtype init           # create .loomtype.yaml
loomtype verify         # check patterns exist
loomtype help           # show help
loomtype version        # show version
```

## How Verification Works

Verification uses simple shell commands:

```yaml
verify:
  # check if pattern exists (default)
  soft-delete:
    check: grep -r "deleted_at" src/
    on_fail: "Add deleted_at field to models"
    
  # check for specific output  
  node-version:
    check: node --version
    expect: v20.0.0
    on_fail: "Install Node.js v20"
    
  # check if output contains string
  typescript:
    check: npm ls typescript
    expect: contains:typescript@5
    on_fail: "Upgrade TypeScript: npm install typescript@5"
    
  # check exit code
  tests-pass:
    check: npm test
    expect: exit 0
    on_fail: "Fix failing tests before proceeding"
```


## Design Philosophy

- **Pattern context next to verification** - The "why" lives with the "how to check"
- **Language agnostic** - Same format works for any language or framework
- **Shell commands** - Use tools you already have (grep, npm, pytest, etc.)
- **Built for AI** - Clear error messages guide AI to fix issues iteratively

## FAQ

**Q: Is this a code generator?**  
A: No. It gives AI context about what patterns to implement. The AI writes the code.

**Q: Why not just use package.json scripts or Makefile?**  
A: Those separate the "what to check" from "why it matters". See [Design Philosophy](#design-philosophy).

**Q: What if patterns conflict?**  
A: You own the patterns. If they conflict, fix your `.loomtype.yaml`.

**Q: Can I use this with [language/framework]?**  
A: Yes. Verification is just shell commands - use whatever tools you have.

**Q: How is this different from templates?**  
A: Templates are code. This is specifications. AI can adapt patterns to any codebase.


## Troubleshooting

**"Command not found" on Windows**  
Shell commands differ between platforms. Use cross-platform commands or check for the OS:
```yaml
verify:
  node-check:
    check: node --version || echo "Node not found"
```

**"Command timed out"**  
Increase timeout for slow commands:
```yaml
verify:
  slow-test:
    check: npm test
    timeout: 30000  # 30 seconds
```

**"No such file or directory"**  
Ensure paths exist before checking them. Use relative paths from project root.

## Contributing

PRs welcome.

## License

MIT
