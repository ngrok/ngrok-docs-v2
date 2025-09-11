#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read all the import errors from mintErrors.md to understand the patterns
function parseErrors() {
  const errorsContent = fs.readFileSync('mintErrors.md', 'utf8');
  const lines = errorsContent.split('\n');
  
  const importErrors = [];
  
  lines.forEach(line => {
    const match = line.match(/Invalid import path (\.\/[^\\s]+) in ([^\\s]+)\./);
    if (match) {
      importErrors.push({
        relativePath: match[1],
        filePath: match[2]
      });
    }
  });
  
  return importErrors;
}

// Fix import paths in a file
function fixImportsInFile(filePath, imports) {
  console.log(`Fixing imports in: ${filePath}`);
  
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.log(`  Warning: Could not read file ${filePath}`);
    return;
  }
  
  let modified = false;
  
  imports.forEach(relativePath => {
    // Convert relative path to absolute path based on file location
    const fileDir = path.dirname(filePath);
    const absolutePath = convertToAbsolutePath(relativePath, fileDir);
    
    if (absolutePath) {
      // Replace the import in the content
      const oldImport = relativePath;
      const newImport = absolutePath;
      
      if (content.includes(oldImport)) {
        content = content.replace(new RegExp(escapeRegex(oldImport), 'g'), newImport);
        console.log(`  ${oldImport} → ${newImport}`);
        modified = true;
      }
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ Updated ${filePath}`);
  }
}

// Convert relative path to absolute path starting with /snippets/
function convertToAbsolutePath(relativePath, fileDir) {
  // Remove the leading './'
  const cleanPath = relativePath.replace(/^\.\//, '');
  
  // Determine the absolute path based on the file's directory
  if (fileDir.includes('/snippets/obs/events/reference')) {
    return `/snippets/obs/events/reference/${cleanPath}`;
  } else if (fileDir.includes('/snippets/obs')) {
    return `/snippets/obs/${cleanPath}`;
  } else if (fileDir.includes('/snippets/traffic-policy')) {
    // For traffic policy, we need to be more specific based on the structure
    const relativeDirFromSnippets = fileDir.replace(/.*\/snippets\//, '');
    return `/snippets/${relativeDirFromSnippets}/${cleanPath}`;
  } else if (fileDir.includes('/snippets/')) {
    // Generic snippets path
    const relativeDirFromSnippets = fileDir.replace(/.*\/snippets\//, '');
    return `/snippets/${relativeDirFromSnippets}/${cleanPath}`;
  } else if (fileDir.includes('/guides/') && cleanPath.startsWith('img/')) {
    // Handle image imports in guides
    return `/public/${cleanPath}`;
  } else {
    console.log(`  Warning: Could not determine absolute path for ${relativePath} in ${fileDir}`);
    return null;
  }
}

// Escape special regex characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}

// Group errors by file
function groupErrorsByFile(errors) {
  const grouped = {};
  
  errors.forEach(error => {
    if (!grouped[error.filePath]) {
      grouped[error.filePath] = [];
    }
    grouped[error.filePath].push(error.relativePath);
  });
  
  return grouped;
}

// Main execution
function main() {
  console.log('🔧 Parsing import errors from mintErrors.md...');
  const errors = parseErrors();
  console.log(`Found ${errors.length} import path errors`);
  
  console.log('\\n📁 Grouping errors by file...');
  const groupedErrors = groupErrorsByFile(errors);
  const fileCount = Object.keys(groupedErrors).length;
  console.log(`Need to fix ${fileCount} files`);
  
  console.log('\\n🛠️  Fixing import paths...');
  Object.entries(groupedErrors).forEach(([filePath, imports]) => {
    fixImportsInFile(filePath, imports);
  });
  
  console.log('\\n✅ Import path fixing complete!');
  console.log('\\n💡 Next steps:');
  console.log('1. Run `mint dev` again to check for remaining errors');
  console.log('2. Fix any missing component files');
  console.log('3. Handle any remaining manual fixes needed');
}

if (require.main === module) {
  main();
}

module.exports = { convertToAbsolutePath, fixImportsInFile };
