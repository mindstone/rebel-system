# Known Skill Sources

Reference for the researcher subagent when evaluating potential skills.

## Trusted Sources (High Trust)

| Source | URL | Notes |
|--------|-----|-------|
| Anthropic Skills | github.com/anthropics/skills | Official Anthropic skills repository |

## Evaluation Criteria

When evaluating a skill source, consider:

### 1. Reputation
- Is the organization/author well-known?
- Do they have a track record of quality software?
- Are they verified on GitHub?

### 2. Community Activity
- **Stars**: Higher is generally better, but context matters
- **Recent commits**: Active maintenance is a good sign
- **Issues/discussions**: Healthy community engagement
- **Forks**: Popular skills tend to have more forks

### 3. Code Quality
- Clear SKILL.md with good documentation
- Well-structured files
- No obfuscated code
- Appropriate dependencies (or none)

### 4. Security Posture
- Limited file system access
- No unnecessary network calls
- Clear about what permissions it needs
- No embedded binaries (or documented ones)

## Red Flags

- **Anonymous authors** with no GitHub history
- **No documentation** or vague descriptions
- **Obfuscated code** or minified scripts
- **Network calls** to unknown endpoints
- **Excessive permissions** for the stated purpose
- **Recent repo** with no community (could be clone/impersonation)

## Example Evaluation

```
Evaluating: anthropics/skills/skills/pdf

✅ Source: Official Anthropic repository (verified organization)
✅ Stars: 1.2k (high community interest)
✅ Last commit: 2 days ago (actively maintained)
✅ Documentation: Clear SKILL.md with usage examples
✅ Dependencies: Uses standard pdftk CLI tool
⚠️ Note: Uses subprocess to invoke external tool

Recommendation: HIGH TRUST - Official source with good community engagement
```
