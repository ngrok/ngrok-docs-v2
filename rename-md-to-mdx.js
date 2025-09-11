#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function renameAllMdFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
      // Recursively process subdirectories
      renameAllMdFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // Rename .md files to .mdx
      const newPath = fullPath.replace(/\.md$/, '.mdx');
      try {
        fs.renameSync(fullPath, newPath);
        console.log(`Renamed: ${fullPath} → ${newPath}`);
      } catch (error) {
        console.error(`Error renaming ${fullPath}:`, error.message);
      }
    }
  }
}

// Start from the current directory
const rootDir = process.cwd();
console.log(`Starting to rename .md files to .mdx in: ${rootDir}`);

try {
  renameAllMdFiles(rootDir);
  console.log('Done! All .md files have been renamed to .mdx');
} catch (error) {
  console.error('Error during processing:', error.message);
  process.exit(1);
}
