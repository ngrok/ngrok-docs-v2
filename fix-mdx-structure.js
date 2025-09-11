#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing MDX structure issues causing ExpressionStatement errors...');

function getAllMdxFiles() {
  const files = [];
  
  function traverse(dir) {
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        if (item.name.startsWith('.') || item.name.startsWith('_')) continue;
        
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory()) {
          traverse(fullPath);
        } else if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
          files.push(fullPath);
        }
      }
    } catch (err) {
      // Skip directories we can't read
    }
  }
  
  traverse('./');
  return files;
}

function fixMdxStructure(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let modified = false;
    let inFrontMatter = false;
    let frontMatterEnded = false;
    
    const fixedLines = lines.map((line, index) => {
      const trimmed = line.trim();
      
      // Track frontmatter
      if (trimmed === '---') {
        if (!inFrontMatter && index === 0) {
          inFrontMatter = true;
          return line;
        } else if (inFrontMatter) {
          inFrontMatter = false;
          frontMatterEnded = true;
          return line;
        }
      }
      
      if (inFrontMatter) {
        return line;
      }
      
      // After frontmatter, look for the pattern causing issues
      if (frontMatterEnded) {
        // If we have imports followed immediately by a JSX element without a blank line
        const nextLine = index < lines.length - 1 ? lines[index + 1].trim() : '';
        
        if (line.startsWith('import ') && nextLine.startsWith('<')) {
          // Add a blank line after import
          modified = true;
          return line + '\n';
        }
        
        // If we have a JSX component that's not properly structured in MDX
        if (trimmed.startsWith('<') && !trimmed.endsWith('>') && !trimmed.includes('</')) {
          // This might be a JSX component that needs to be on its own line
          const prevLine = index > 0 ? lines[index - 1].trim() : '';
          if (prevLine.startsWith('import ') || prevLine === '') {
            // Add blank line before JSX component if needed
            if (prevLine.startsWith('import ')) {
              modified = true;
              return '\n' + line;
            }
          }
        }
      }
      
      return line;
    });
    
    if (modified) {
      const fixedContent = fixedLines.join('\n');
      fs.writeFileSync(filePath, fixedContent);
      return true;
    }
  } catch (err) {
    console.log(`⚠️ Error processing ${filePath}:`, err.message);
  }
  
  return false;
}

// More direct approach - fix the specific pattern causing issues
function fixImportJsxPattern(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Look for the specific pattern: import statement followed immediately by JSX
    const pattern = /(import .+?from .+?;)\n(<[A-Z][^>]*>)/g;
    const fixed = content.replace(pattern, '$1\n\n$2');
    
    if (fixed !== content) {
      fs.writeFileSync(filePath, fixed);
      return true;
    }
  } catch (err) {
    console.log(`⚠️ Error processing ${filePath}:`, err.message);
  }
  
  return false;
}

function main() {
  const mdxFiles = getAllMdxFiles();
  console.log(`📁 Found ${mdxFiles.length} MDX/MD files to check`);
  
  let fixedCount = 0;
  let patternFixedCount = 0;
  
  // First pass: fix specific import+JSX pattern
  for (const file of mdxFiles) {
    if (fixImportJsxPattern(file)) {
      patternFixedCount++;
      console.log(`✅ Fixed import+JSX pattern in ${file}`);
    }
  }
  
  // Second pass: fix general MDX structure issues
  for (const file of mdxFiles) {
    if (fixMdxStructure(file)) {
      fixedCount++;
      console.log(`✅ Fixed MDX structure in ${file}`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`- Import+JSX pattern fixes: ${patternFixedCount}`);
  console.log(`- MDX structure fixes: ${fixedCount}`);
  console.log(`- Total files processed: ${mdxFiles.length}`);
  
  // Show some examples of what was fixed
  if (patternFixedCount > 0) {
    console.log(`\n🔍 Fixed pattern: import followed immediately by JSX component`);
    console.log(`   Before: import X from 'Y';\\n<Tip>`);
    console.log(`   After:  import X from 'Y';\\n\\n<Tip>`);
  }
}

main();
