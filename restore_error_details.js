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

// Add ErrorDetails import and component to files that don't have them
function restoreErrorDetails(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Extract error code from filename
  const filename = path.basename(filePath, '.mdx');
  const errorCode = filename; // err_ngrok_100, etc.
  
  // Check if file already has ErrorDetails import or component
  const hasImport = content.includes('import ErrorDetails from');
  const hasOldImport = content.includes('import { ErrorDetails } from');
  const hasComponent = content.includes('<ErrorDetails');
  
  if (hasImport || hasOldImport || hasComponent) {
    console.log(`  - Already has ErrorDetails, skipping`);
    return;
  }
  
  // Add import after frontmatter
  const frontmatterEnd = content.indexOf('---', 3) + 3;
  const beforeFrontmatter = content.substring(0, frontmatterEnd);
  const afterFrontmatter = content.substring(frontmatterEnd);
  
  const importStatement = `import { ErrorDetails } from "/snippets/components/ErrorDetails";\n`;
  content = beforeFrontmatter + '\n' + importStatement + afterFrontmatter;
  
  // Find where to add the ErrorDetails component - after the Message section
  const messageIndex = content.indexOf('### Message');
  if (messageIndex === -1) {
    console.log(`  - No Message section found, adding after frontmatter`);
    // Add it after the frontmatter and import
    const addAfterIndex = content.indexOf('\n', frontmatterEnd + importStatement.length + 1);
    content = content.substring(0, addAfterIndex) + '\n\n<ErrorDetails error="' + errorCode + '" />\n' + content.substring(addAfterIndex);
  } else {
    // Look for the next section (### Further help) or end of file
    const nextSectionIndex = content.indexOf('### Further help');
    if (nextSectionIndex === -1) {
      // Add at end of file
      content = content + '\n\n<ErrorDetails error="' + errorCode + '" />\n';
    } else {
      // Add before Further help section
      content = content.substring(0, nextSectionIndex) + '<ErrorDetails error="' + errorCode + '" />\n\n' + content.substring(nextSectionIndex);
    }
  }
  
  // Clean up any extra blank lines
  content = content.replace(/\n\n\n+/g, '\n\n');
  
  fs.writeFileSync(filePath, content);
  console.log(`  - Added ErrorDetails import and component`);
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
      restoreErrorDetails(file);
      
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
