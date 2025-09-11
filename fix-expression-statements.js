#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing ExpressionStatement errors in integration files...');

function getAllIntegrationFiles() {
  const integrationDir = './integrations';
  const files = [];
  
  function traverse(dir) {
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
  }
  
  if (fs.existsSync(integrationDir)) {
    traverse(integrationDir);
  }
  
  return files;
}

function fixExpressionStatement(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let modified = false;
    const fixedLines = lines.map((line, index) => {
      // Look for lines that might be causing ExpressionStatement errors
      const trimmed = line.trim();
      
      // Common patterns that cause ExpressionStatement errors
      if (index < 10) { // Usually near the top of files
        // Pattern: variable declarations or function calls at file start
        if (trimmed.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/)) {
          console.log(`  Found expression statement in ${filePath}:${index + 1}: ${trimmed}`);
          modified = true;
          return `{/* ${line} */}`;
        }
        
        // Pattern: variable assignments
        if (trimmed.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/)) {
          console.log(`  Found assignment in ${filePath}:${index + 1}: ${trimmed}`);
          modified = true;
          return `{/* ${line} */}`;
        }
        
        // Pattern: standalone expressions that aren't imports/exports
        if (trimmed.match(/^[a-zA-Z_$][a-zA-Z0-9_$.]*\s*;?\s*$/) && 
            !trimmed.startsWith('import') && 
            !trimmed.startsWith('export') &&
            !trimmed.startsWith('#') &&
            !trimmed.startsWith('<') &&
            !trimmed.startsWith('//') &&
            !trimmed.startsWith('/*') &&
            !trimmed.includes(':')) {
          console.log(`  Found standalone expression in ${filePath}:${index + 1}: ${trimmed}`);
          modified = true;
          return `{/* ${line} */}`;
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

function main() {
  const integrationFiles = getAllIntegrationFiles();
  console.log(`📁 Found ${integrationFiles.length} integration files to check`);
  
  let fixedCount = 0;
  
  for (const file of integrationFiles) {
    if (fixExpressionStatement(file)) {
      fixedCount++;
      console.log(`✅ Fixed ${file}`);
    }
  }
  
  console.log(`\n🎉 Fixed ExpressionStatement errors in ${fixedCount} files`);
  
  // Also fix some specific problematic patterns
  console.log('\n🔍 Checking specific known problematic patterns...');
  
  // Look for specific patterns that commonly cause issues
  const specificFixes = [
    {
      pattern: /^const\s+/,
      replacement: '{/* const ',
      suffix: ' */}'
    },
    {
      pattern: /^let\s+/,
      replacement: '{/* let ',
      suffix: ' */}'
    },
    {
      pattern: /^var\s+/,
      replacement: '{/* var ',
      suffix: ' */}'
    }
  ];
  
  let additionalFixes = 0;
  for (const file of integrationFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      let modified = content;
      
      for (const fix of specificFixes) {
        const regex = new RegExp(fix.pattern.source, 'gm');
        if (regex.test(content)) {
          modified = modified.replace(regex, fix.replacement);
          if (fix.suffix) {
            modified = modified + fix.suffix;
          }
        }
      }
      
      if (modified !== content) {
        fs.writeFileSync(file, modified);
        additionalFixes++;
        console.log(`✅ Applied specific pattern fixes to ${file}`);
      }
    } catch (err) {
      console.log(`⚠️ Error with specific pattern fixes for ${file}:`, err.message);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`- Expression statement fixes: ${fixedCount}`);
  console.log(`- Specific pattern fixes: ${additionalFixes}`);
  console.log(`- Total files processed: ${integrationFiles.length}`);
}

main();
