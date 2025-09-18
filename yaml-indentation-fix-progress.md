# YAML Indentation Fix Progress

## Overview
This document tracks progress on fixing YAML indentation in all MDX files in `snippets/traffic-policy/actions/` directory.

## Correct YAML Indentation Pattern
Based on `traffic-policy/actions/add-headers.mdx` lines 72-79:
```yaml
on_http_request:
  - actions:
    - type: "add-headers"
      config:
        headers:
          x-client-ip: "${conn.client_ip}"
```

## Indentation Rules
- Use 2 spaces per indentation level
- `on_http_request:` at root (0 spaces)
- `- actions:` indented 2 spaces
- `- type:` indented 4 spaces
- `config:` indented 6 spaces
- Config properties indented 8 spaces

## Files Found (200+ total)
Found 200+ MDX files using: `snippets/traffic-policy/actions/**/*.mdx`

## Issues Identified
Based on sample files checked:

1. **rate-limit/examples/basic-example.mdx** - Lines 12-23:
   - Missing proper indentation for `config:` and its properties
   - `config:` should be indented 6 spaces, currently at 4
   - Properties under config need proper 8-space indentation

2. **add-headers/examples/http-add-client-ip-headers-to-all-requests.mdx** - Lines 11-18:
   - Missing proper indentation for `config:` and `headers:`
   - Similar issues with config block indentation

## Common Problems Seen
- `config:` block often incorrectly indented
- Properties under `config:` not consistently indented to 8 spaces
- Some files missing indentation entirely after `- type:` line

## Progress Status
- [x] Identified correct indentation pattern
- [x] Found all target MDX files (200+)
- [x] Analyzed sample files for common issues
- [x] **STARTED FIXES**: Fixed 3 files so far
- [ ] **REMAINING WORK**: Systematically fix remaining ~197 files

## Files Fixed So Far
1. ✅ `rate-limit/examples/basic-example.mdx` - Fixed config block indentation
2. ✅ `add-headers/examples/http-add-client-ip-headers-to-all-requests.mdx` - Fixed config block indentation  
3. ✅ `add-headers/examples/http-add-headers-to-response.mdx` - Fixed config block + expressions indentation
4. ✅ `deny/http/examples/http-basic-example.mdx` - Fixed config block indentation
5. ✅ `log/examples/basic-example.mdx` - Fixed config block indentation
6. ✅ `close-connection/examples/basic-example.mdx` - Fixed malformed YAML block + indentation
7. ✅ `basic-auth/examples/basic-example.mdx` - Fixed multiple config blocks indentation
8. ✅ `circuit-breaker/examples/basic-example.mdx` - Fixed config block indentation
9. ✅ `jwt-validation/examples/basic-example.mdx` - Fixed deeply nested config indentation
10. ✅ `oauth/examples/basic-example.mdx` - Fixed config block indentation
11. ✅ `oidc/examples/basic-example.mdx` - Fixed config block indentation
12. ✅ `redirect/examples/1-basic-example.mdx` - Fixed config block indentation
13. ✅ `redirect/examples/2-with-regex.mdx` - Fixed config + expressions indentation
14. ✅ `url-rewrite/examples/1-basic-example.mdx` - Fixed config + expressions indentation
15. ✅ `custom-response/examples/http-json-single-interpolation.mdx` - Fixed config + expressions indentation
16. ✅ `remove-headers/examples/http-removing-headers-from-all-requests.mdx` - Fixed config block indentation
17. ✅ `verify-webhook/examples/basic-example.mdx` - Fixed multiple config blocks indentation

## Files Still Need Fixing (Partial List - More Investigation Needed)
- Many more files likely have similar issues

## Next Steps for Continuation
1. Start with the example files as they are most visible
2. Work systematically through each action type directory
3. Focus on files containing YAML code blocks (```yaml)
4. Check each file for proper 2-space indentation pattern
5. Fix only files that need changes

## Command to Find Files
```bash
find snippets/traffic-policy/actions -name "*.mdx" | head -20  # Process in batches
```

## Files to Check Next
Start with these directories in order:
- `add-headers/examples/`
- `rate-limit/examples/`  
- `log/examples/`
- `deny/examples/`
- Continue through all action types...

**Note**: This is a large task that will likely require multiple sessions due to context window limits.
