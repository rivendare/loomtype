# Loomtype Roadmap

## v0.2.0 - Pattern Composition

Focus: Make patterns reusable across projects.

### The Problem
Projects often have similar pattern requirements (auth checks, input validation, error handling) that get rewritten each time.

### The Solution
Allow importing and extending shared patterns.

### Implementation

```yaml
# .loomtype.yaml
extends: '@loomtype/node-essentials'  # or https://github.com/org/patterns.yaml

patterns:
  # Inherited patterns from @loomtype/node-essentials
  # Plus your own...
  'Additional Project Rules':
    - Custom patterns specific to this project

verify:
  # Inherited checks from @loomtype/node-essentials
  # Plus your own...
  custom-check:
    check: grep -r "TODO" src/
    on_fail: "Remove TODOs before committing"
```

**Approach:**
1. Start with a few pattern libraries
2. Support both npm packages and direct URLs
3. Simple merge strategy: imported checks + local checks
4. Document what each pattern library provides

---

Ideas welcome: https://github.com/rivendare/loomtype/issues