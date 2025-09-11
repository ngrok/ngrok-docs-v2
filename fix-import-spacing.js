const fs = require('fs');
const path = require('path');

function fixImportSpacing(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let lastImportLineIndex = -1;
  let inFrontmatter = false;
  let frontmatterEndIndex = -1;
  
  // Skip frontmatter if it exists
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (i === 0 && line === '---') {
      inFrontmatter = true;
      continue;
    }
    
    if (inFrontmatter && line === '---') {
      frontmatterEndIndex = i;
      inFrontmatter = false;
      continue;
    }
    
    if (inFrontmatter) {
      continue;
    }
    
    // Check for import statements
    if (line.startsWith('import ')) {
      lastImportLineIndex = i;
    } else if (line.length > 0 && !line.startsWith('import ')) {
      // Found non-import, non-empty line
      break;
    }
  }
  
  // If we found imports, check if there's an empty line after the last one
  if (lastImportLineIndex >= 0) {
    const nextLineIndex = lastImportLineIndex + 1;
    
    // Check if there's a next line and if it's not empty
    if (nextLineIndex < lines.length && lines[nextLineIndex].trim() !== '') {
      // Insert empty line after last import
      lines.splice(nextLineIndex, 0, '');
      
      // Write back to file
      fs.writeFileSync(filePath, lines.join('\n'));
      console.log(`Fixed import spacing in: ${filePath}`);
      return true;
    }
  }
  
  return false;
}

function getAllMdxFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    if (item === 'node_modules' || item.startsWith('.')) continue;
    
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results = results.concat(getAllMdxFiles(fullPath));
    } else if (item.endsWith('.mdx')) {
      results.push(fullPath);
    }
  }
  
  return results;
}

function main() {
  // Find all .mdx files in the repository
  const mdxFiles = getAllMdxFiles(process.cwd());
  
  console.log(`Found ${mdxFiles.length} MDX files`);
  
  let fixedCount = 0;
  
  for (const file of mdxFiles) {
    try {
      if (fixImportSpacing(file)) {
        fixedCount++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`\nProcessed ${mdxFiles.length} files`);
  console.log(`Fixed import spacing in ${fixedCount} files`);
}

main();
