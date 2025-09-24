#!/bin/bash

# Script to clean up all MDX backup files

echo "=== Cleaning up MDX backup files ==="
echo

# Find all backup files
BACKUP_FILES=$(find . -name "*.mdx.backup" -type f)
BACKUP_COUNT=$(echo "$BACKUP_FILES" | grep -c "backup" 2>/dev/null || echo "0")

if [[ $BACKUP_COUNT -eq 0 ]]; then
    echo "No backup files found."
    exit 0
fi

echo "Found $BACKUP_COUNT backup files to delete:"
echo "$BACKUP_FILES" | head -10
if [[ $BACKUP_COUNT -gt 10 ]]; then
    echo "... and $((BACKUP_COUNT - 10)) more"
fi
echo

# Delete all backup files
echo "Deleting backup files..."
find . -name "*.mdx.backup" -type f -delete

# Verify deletion
REMAINING=$(find . -name "*.mdx.backup" -type f | wc -l)
if [[ $REMAINING -eq 0 ]]; then
    echo "✓ All $BACKUP_COUNT backup files deleted successfully"
else
    echo "⚠ $REMAINING backup files remain"
fi
