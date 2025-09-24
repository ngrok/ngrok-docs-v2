#!/bin/bash

# Script to restore frontmatter from 2 commits ago for all MDX files

echo "=== Restoring frontmatter from HEAD~2 for all MDX files ==="
echo

# Get all MDX files
MDX_FILES=$(find . -name "*.mdx" -type f | sort)
TOTAL_FILES=$(echo "$MDX_FILES" | wc -l)
PROCESSED=0
CHANGED=0
NO_CHANGE=0
ERRORS=0

echo "Found $TOTAL_FILES MDX files to process"
echo

# Function to extract frontmatter from file (from first --- to second ---)
extract_frontmatter() {
    local file="$1"
    if [[ -f "$file" ]]; then
        sed -n '1,/^---$/p' "$file" 2>/dev/null
    fi
}

# Function to extract body content (everything after the second ---)
extract_body() {
    local file="$1"
    if [[ -f "$file" ]]; then
        if grep -q "^---$" "$file" 2>/dev/null; then
            # File has frontmatter, get content after it
            sed -n '/^---$/,$p' "$file" 2>/dev/null | tail -n +2
        else
            # File has no frontmatter, get all content
            cat "$file" 2>/dev/null
        fi
    fi
}

# Process each MDX file
while IFS= read -r file; do
    if [[ -z "$file" ]]; then
        continue
    fi
    
    PROCESSED=$((PROCESSED + 1))
    echo "[$PROCESSED/$TOTAL_FILES] Processing: $file"
    
    # Check if file exists in HEAD~2
    if ! git show "HEAD~2:$file" >/dev/null 2>&1; then
        echo "  ⚠ File doesn't exist in HEAD~2, skipping"
        continue
    fi
    
    # Get the old frontmatter from HEAD~2
    OLD_FRONTMATTER=$(git show "HEAD~2:$file" 2>/dev/null | sed -n '1,/^---$/p')
    if [[ -z "$OLD_FRONTMATTER" ]]; then
        echo "  ⚠ No frontmatter in HEAD~2 version, skipping"
        continue
    fi
    
    # Get current frontmatter and body
    CURRENT_FRONTMATTER=$(extract_frontmatter "$file")
    CURRENT_BODY=$(extract_body "$file")
    
    # Compare frontmatter
    OLD_HASH=$(echo "$OLD_FRONTMATTER" | shasum 2>/dev/null | cut -d' ' -f1)
    CURRENT_HASH=$(echo "$CURRENT_FRONTMATTER" | shasum 2>/dev/null | cut -d' ' -f1)
    
    if [[ "$OLD_HASH" == "$CURRENT_HASH" ]]; then
        echo "  ✓ Frontmatter unchanged"
        NO_CHANGE=$((NO_CHANGE + 1))
        continue
    fi
    
    # Create backup
    if ! cp "$file" "$file.backup" 2>/dev/null; then
        echo "  ✗ Failed to create backup"
        ERRORS=$((ERRORS + 1))
        continue
    fi
    
    # Create new file with old frontmatter + current body
    {
        echo "$OLD_FRONTMATTER"
        echo ""  # Add blank line after frontmatter
        echo "$CURRENT_BODY"
    } > "$file.tmp"
    
    # Replace original file
    if mv "$file.tmp" "$file" 2>/dev/null; then
        echo "  ✓ Frontmatter restored"
        CHANGED=$((CHANGED + 1))
    else
        echo "  ✗ Failed to update file"
        # Restore from backup
        mv "$file.backup" "$file" 2>/dev/null
        ERRORS=$((ERRORS + 1))
        continue
    fi
    
done <<< "$MDX_FILES"

echo
echo "=== Summary ==="
echo "Total files processed: $PROCESSED"
echo "Files changed: $CHANGED"
echo "Files unchanged: $NO_CHANGE"
echo "Errors: $ERRORS"

if [[ $CHANGED -gt 0 ]]; then
    echo
    echo "✓ Frontmatter restored for $CHANGED files"
    echo "📁 Backup files created (*.mdx.backup) - you can delete them once satisfied"
fi

if [[ $ERRORS -gt 0 ]]; then
    echo "⚠ $ERRORS files had errors during processing"
fi
