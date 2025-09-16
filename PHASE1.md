# Integration Directory Restructuring - Phase 1

## Overview
Restructure the integrations directory based on the new structure shown in structure.png, and update the categorization system accordingly.

## Categories (from structure.png)
Based on structure.png, the new integration categories are:
- `cli-credentials` - Command line interface and credential management integrations
- `dashboard-sso` - Single Sign-On integrations for the ngrok dashboard
- `event-destinations` - Event streaming and log destination integrations
- `guides` - General guides and uncategorized integrations (default fallback)
- `kubernetes-ingress` - Kubernetes ingress and cluster management integrations
- `oauth` - OAuth authentication provider integrations
- `webhooks` - Webhook development and testing integrations

## Tasks

### 1. Create iCategories.json
Create a JSON file with category objects containing:
- `name`: Category name (without leading underscore)
- `items`: Empty array (to be populated by categorization script)
- `keywords`: Array of strings for keyword matching

### 2. Write Categorization Script
Script should:
- Import iCategories.json and snippets/custom-scripts/data/integrations.json
- For each integration, check frontMatter.title, frontMatter.description, and frontMatter.tags
- Match against category keywords (case-insensitive, partial matching)
- Add integration path to matching category's items array
- Default to "guides" category if no match found

### 3. Write Validation Script
Script should verify:
- Every integration path appears in exactly one category
- No integration appears in multiple categories
- No integrations are missing from categorization

### 4. Expected Keyword Matching Examples
- **cli-credentials**: "cli", "command line", "credentials", "authentication", "1password", "password vault"
- **dashboard-sso**: "dashboard sso", "saml", "single sign-on", "sso" (when combined with dashboard context)
- **event-destinations**: "event destination", "logs", "events", "firehose", "kinesis", "cloudwatch", "datadog", "azure logs"
- **kubernetes-ingress**: "kubernetes", "k8s", "ingress", "cluster", "operator", "aks", "eks", "rancher", "linkerd"
- **oauth**: "oauth", "authenticate users", "authentication" (when not cli/dashboard related)
- **webhooks**: "webhooks", "webhook", "develop and test", "from localhost"
- **guides**: Default fallback for everything else

## File Locations
- Source: `/snippets/custom-scripts/data/integrations.json`
- Output: `iCategories.json` (root directory)
- Scripts: Can be created in `/snippets/custom-scripts/` directory

## Validation Criteria
- Total integrations in source file: 100 items
- Sum of items across all categories should equal 100
- No duplicate paths across categories
- Each integration path should appear exactly once

## Next Steps
After completion:
1. Review categorization results manually
2. Adjust keywords if needed for better accuracy
3. Prepare for Phase 2: Update docs.json structure
4. Plan directory restructuring implementation
