const fs = require('fs');
const path = require('path');

function findMdxFiles(dir) {
  let mdxFiles = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      mdxFiles = mdxFiles.concat(findMdxFiles(fullPath));
    } else if (item.endsWith('.mdx')) {
      mdxFiles.push(fullPath);
    }
  }
  
  return mdxFiles;
}

function fixMdImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Look for imports like /snippets/example.md or ./example.md or ../example.md
  const mdImportRegex = /(import\s+[^"']*)["']([^"']*\.md)["']/g;
  const replacementRegex = /(\/[^"']*\.md|\.\/[^"']*\.md|\.\.\/[^"']*\.md)/g;
  
  let hasChanges = false;
  let newContent = content.replace(mdImportRegex, (match, prefix, importPath) => {
    hasChanges = true;
    const newImportPath = importPath.replace(/\.md$/, '.mdx');
    console.log(`In ${filePath}: ${importPath} -> ${newImportPath}`);
    return `${prefix}"${newImportPath}"`;
  });
  
  // Also check for other import patterns
  newContent = newContent.replace(/(['"])[^'"]*\.md\1/g, (match) => {
    const quote = match[0];
    const path = match.slice(1, -1);
    if (path.includes('/') || path.startsWith('.')) {
      hasChanges = true;
      const newPath = path.replace(/\.md$/, '.mdx');
      console.log(`In ${filePath}: ${path} -> ${newPath}`);
      return `${quote}${newPath}${quote}`;
    }
    return match;
  });
  
  if (hasChanges) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated: ${filePath}`);
  }
  
  return hasChanges;
}

const workspaceRoot = '/Users/s.hansfordngrok.com/Documents/GitHub/ngrok-private/ngrok-docs-v2';
const mdxFiles = findMdxFiles(workspaceRoot);

console.log(`Found ${mdxFiles.length} MDX files`);

let totalChanges = 0;
for (const mdxFile of mdxFiles) {
  if (fixMdImports(mdxFile)) {
    totalChanges++;
  }
}

console.log(`\nCompleted! Updated ${totalChanges} files with .md import fixes`);
