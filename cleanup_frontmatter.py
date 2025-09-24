#!/usr/bin/env python3
"""
Script to clean up excess frontmatter in MDX files.

This script identifies MDX files with multiple frontmatter blocks (delimited by ---)
and removes the content between the second and third set of dashes, including the third set.
"""

import os
import re
import sys

def has_markdown_headings_or_codeblocks_between(content, start_pos, end_pos):
    """Check if there are markdown headings or codeblocks between two positions."""
    section = content[start_pos:end_pos]
    
    # Check for markdown headings (lines starting with #)
    if re.search(r'^\s*#+\s', section, re.MULTILINE):
        return True
    
    # Check for code blocks (``` or ~~~)
    if re.search(r'```|~~~', section):
        return True
    
    return False

def clean_frontmatter(file_path):
    """Clean up excess frontmatter in an MDX file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all --- sequences that are on their own line
        dash_pattern = r'^---\s*$'
        matches = list(re.finditer(dash_pattern, content, re.MULTILINE))
        
        if len(matches) < 3:
            # Not enough --- sequences to have excess frontmatter
            return False
        
        # We need to check sequences of exactly 3 dashes
        valid_frontmatter_blocks = []
        
        for i, match in enumerate(matches):
            # Check if this is exactly "---" (3 dashes) on its own line
            line_start = content.rfind('\n', 0, match.start()) + 1
            line_end = content.find('\n', match.end())
            if line_end == -1:
                line_end = len(content)
            
            line_content = content[line_start:line_end].strip()
            if line_content == '---':
                valid_frontmatter_blocks.append(match)
        
        if len(valid_frontmatter_blocks) < 3:
            return False
        
        # Check for the pattern where we have valid frontmatter followed by excess
        # We look for the first pair that forms valid frontmatter, then any subsequent blocks
        first_dash = valid_frontmatter_blocks[0]
        second_dash = valid_frontmatter_blocks[1]
        
        # Check if the content between first and second dash contains markdown headings or codeblocks
        if has_markdown_headings_or_codeblocks_between(content, first_dash.end(), second_dash.start()):
            # This isn't valid frontmatter structure
            return False
        
        # Look for a third dash that should be removed
        if len(valid_frontmatter_blocks) >= 3:
            third_dash = valid_frontmatter_blocks[2]
            
            # Check if there are any markdown headings or codeblocks between second and third
            if has_markdown_headings_or_codeblocks_between(content, second_dash.end(), third_dash.start()):
                # This third dash might be legitimate markdown, not excess frontmatter
                return False
            
            # Remove content from the end of the second dash to the end of the third dash
            new_content = content[:second_dash.end()] + content[third_dash.end():]
            
            # Write the cleaned content back to the file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"Cleaned: {file_path}")
            return True
    
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False
    
    return False

def main():
    """Main function to process all MDX files."""
    if len(sys.argv) > 1:
        # Process specific files if provided
        files_to_process = sys.argv[1:]
    else:
        # Find all .mdx files in the current directory and subdirectories
        files_to_process = []
        for root, dirs, files in os.walk('.'):
            for file in files:
                if file.endswith('.mdx'):
                    files_to_process.append(os.path.join(root, file))
    
    cleaned_count = 0
    total_count = len(files_to_process)
    
    print(f"Processing {total_count} MDX files...")
    
    for file_path in files_to_process:
        if clean_frontmatter(file_path):
            cleaned_count += 1
    
    print(f"\nCleaned {cleaned_count} out of {total_count} files.")

if __name__ == "__main__":
    main()
