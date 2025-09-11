#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Directory containing error files
const errorsDir = './snippets/errors';

// Get all .mdx files in the errors directory (excluding the details subdirectory)
function getAllErrorFiles() {
  const files = fs.readdirSync(errorsDir);
  return files
    .filter(file => file.endsWith('.mdx') && !file.startsWith('_'))
    .map(file => path.join(errorsDir, file));
}

// Transform a single file
function transformFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file contains ErrorDetails import
  const importRegex = /import\s*\{\s*ErrorDetails\s*\}\s*from\s*["']\/snippets\/components\/ErrorDetails["'];?\s*\n?/;
  const importMatch = content.match(importRegex);
  
  if (!importMatch) {
    console.log(`  - No ErrorDetails import found, skipping`);
    return;
  }
  
  // Find ErrorDetails component usage and extract error prop value
  const componentRegex = /<ErrorDetails\s+error=["']([^"']+)["']\s*\/>/;
  const componentMatch = content.match(componentRegex);
  
  if (!componentMatch) {
    console.log(`  - No ErrorDetails component usage found, skipping`);
    return;
  }
  
  const errorValue = componentMatch[1];
  console.log(`  - Found error value: ${errorValue}`);
  
  // Remove the old import
  content = content.replace(importRegex, '');
  
  // Add new import after the frontmatter
  const frontmatterEnd = content.indexOf('---', 3) + 3;
  const beforeFrontmatter = content.substring(0, frontmatterEnd);
  const afterFrontmatter = content.substring(frontmatterEnd);
  
  const newImport = `import ErrorDetails from "/snippets/errors/details/_${errorValue}.mdx";\n`;
  content = beforeFrontmatter + '\n' + newImport + afterFrontmatter;
  
  // Replace ErrorDetails component usage - remove error prop
  content = content.replace(componentRegex, '<ErrorDetails />');
  
  // Clean up any extra blank lines
  content = content.replace(/\n\n\n+/g, '\n\n');
  
  fs.writeFileSync(filePath, content);
  console.log(`  - Transformed successfully`);
}

// Main execution
function main() {
  const errorFiles = getAllErrorFiles();
  console.log(`Found ${errorFiles.length} error files to process\n`);
  
  let processed = 0;
  let skipped = 0;
  
  errorFiles.forEach(file => {
    try {
      const originalContent = fs.readFileSync(file, 'utf8');
      transformFile(file);
      
      // Check if file was actually modified
      const newContent = fs.readFileSync(file, 'utf8');
      if (originalContent !== newContent) {
        processed++;
      } else {
        skipped++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
      skipped++;
    }
  });
  
  console.log(`\nCompleted: ${processed} files processed, ${skipped} files skipped`);
}

main();
