#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the badErrorImports.md file and extract file paths
function extractFilePaths() {
  const badImportsFile = '/Users/s.hansfordngrok.com/Documents/GitHub/ngrok-private/ngrok-docs-v2/badErrorImports.md';
  const content = fs.readFileSync(badImportsFile, 'utf8');
  
  const filePaths = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Look for pattern: "imported from /snippets/errors/err_ngrok_XXXX.mdx"
    const match = line.match(/imported from (\/snippets\/errors\/err_ngrok_\d+\.mdx)/);
    if (match) {
      const fullPath = '/Users/s.hansfordngrok.com/Documents/GitHub/ngrok-private/ngrok-docs-v2' + match[1];
      if (!filePaths.includes(fullPath)) {
        filePaths.push(fullPath);
      }
    }
  }
  
  return filePaths;
}

// Remove import statement and ErrorDetails component from a file
function fixFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove import statement for ErrorDetails
    const importRegex = /^import\s+ErrorDetails\s+from\s+['"](\.\/|\.\.\/)*details\/_err_ngrok_\d+\.mdx['"];?\s*$/gm;
    if (importRegex.test(content)) {
      content = content.replace(importRegex, '');
      modified = true;
      console.log(`Removed import statement from: ${path.basename(filePath)}`);
    }
    
    // Remove ErrorDetails component usage
    const componentRegex = /<ErrorDetails\s*\/?>.*?(<\/ErrorDetails>)?/gs;
    if (componentRegex.test(content)) {
      content = content.replace(componentRegex, '');
      modified = true;
      console.log(`Removed ErrorDetails component from: ${path.basename(filePath)}`);
    }
    
    // Also remove standalone <ErrorDetails /> or <ErrorDetails/>
    const standaloneRegex = /<ErrorDetails\s*\/?>/g;
    if (standaloneRegex.test(content)) {
      content = content.replace(standaloneRegex, '');
      modified = true;
      console.log(`Removed standalone ErrorDetails from: ${path.basename(filePath)}`);
    }
    
    // Clean up extra whitespace and empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${path.basename(filePath)}`);
      return true;
    } else {
      console.log(`No changes needed for: ${path.basename(filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function
function main() {
  console.log('Extracting file paths from badErrorImports.md...');
  const filePaths = extractFilePaths();
  console.log(`Found ${filePaths.length} files to fix:`);
  
  let fixedCount = 0;
  for (const filePath of filePaths) {
    if (fixFile(filePath)) {
      fixedCount++;
    }
  }
  
  console.log(`\nProcessing complete. Fixed ${fixedCount} out of ${filePaths.length} files.`);
}

// Run the script
main();
