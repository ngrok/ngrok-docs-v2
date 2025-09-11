#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Starting systematic error fixing...');

// First, let's try to run mintlify and capture errors differently
const { spawn } = require('child_process');

function runMintlifyCheck() {
  return new Promise((resolve) => {
    console.log('📊 Running mintlify check to get current errors...');
    
    const mintProcess = spawn('npx', ['mintlify', 'dev'], {
      stdio: 'pipe',
      timeout: 60000
    });

    let allOutput = '';

    mintProcess.stdout.on('data', (data) => {
      allOutput += data.toString();
    });

    mintProcess.stderr.on('data', (data) => {
      allOutput += data.toString();
    });

    // Kill after reasonable time
    setTimeout(() => {
      mintProcess.kill('SIGTERM');
    }, 50000);

    mintProcess.on('close', () => {
      resolve(allOutput);
    });

    mintProcess.on('error', () => {
      resolve(allOutput);
    });
  });
}

// Known remaining issues from previous analysis
async function fixKnownIssues() {
  console.log('🔍 Fixing known remaining issues...');
  
  const fixes = [];
  
  // Fix snippet files with "!" character at beginning
  const snippetDir = './snippets';
  if (fs.existsSync(snippetDir)) {
    const snippetFiles = getAllFiles(snippetDir, ['.md']);
    
    for (const file of snippetFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        if (content.startsWith('<!')) {
          // This looks like it should be a comment, let's fix it
          const fixed = content.replace(/^<!(.*)$/m, '{/* $1 */}');
          if (fixed !== content) {
            fs.writeFileSync(file, fixed);
            fixes.push(`Fixed snippet comment in ${file}`);
          }
        }
      } catch (err) {
        console.log(`⚠️ Could not process ${file}:`, err.message);
      }
    }
  }

  // Fix import/export parsing issues in specific files  
  const problematicFiles = [
    './getting-started/index.mdx',
    './pricing-limits/free-plan-limits.mdx',
    './universal-gateway/examples/blue-green-deployments.mdx',
    './universal-gateway/examples/canary-deployments.mdx',
    './universal-gateway/examples/multiplex.mdx',
    './universal-gateway/global-load-balancer.mdx',
    './universal-gateway/load-balancing-multiple-clouds.mdx',
    './universal-gateway/http.mdx',
    './universal-gateway/tls-termination.mdx',
    './universal-gateway/tcp.mdx',
    './universal-gateway/tls.mdx'
  ];

  for (const file of problematicFiles) {
    if (fs.existsSync(file)) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        let fixed = content;

        // Fix common acorn parsing issues
        // Look for problematic import/export patterns
        fixed = fixed.replace(/^import\s+(.+?)\s+from\s+['"]([^'"]+)['"];?\s*$/gm, (match, imported, path) => {
          // Ensure proper import syntax
          if (!imported.includes('{') && !imported.includes('*')) {
            return `import ${imported} from '${path}';`;
          }
          return match;
        });

        // Fix expression statements that aren't imports/exports
        const lines = fixed.split('\n');
        const fixedLines = lines.map(line => {
          const trimmed = line.trim();
          // If it's not an import/export but looks like JS code at start of file
          if (trimmed.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/)) {
            return `{/* ${line} */}`;
          }
          return line;
        });

        fixed = fixedLines.join('\n');

        if (fixed !== content) {
          fs.writeFileSync(file, fixed);
          fixes.push(`Fixed import/export parsing in ${file}`);
        }
      } catch (err) {
        console.log(`⚠️ Could not process ${file}:`, err.message);
      }
    }
  }

  return fixes;
}

function getAllFiles(dir, extensions) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const item of items) {
      if (item.name.startsWith('.') || item.name.startsWith('_')) continue;
      
      const fullPath = path.join(currentDir, item.name);
      
      if (item.isDirectory()) {
        traverse(fullPath);
      } else if (item.isFile()) {
        const ext = path.extname(item.name);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Main execution
async function main() {
  console.log('🚀 Starting comprehensive error fixing...');
  
  // First fix known issues
  const fixes = await fixKnownIssues();
  
  console.log(`\n✅ Applied ${fixes.length} fixes:`);
  fixes.forEach(fix => console.log(`  - ${fix}`));
  
  // Then run mintlify to see what's left
  console.log('\n📊 Running mintlify to check remaining errors...');
  const output = await runMintlifyCheck();
  
  // Save the output
  fs.writeFileSync('final-error-check.md', output);
  console.log('📝 Final error check saved to final-error-check.md');
  
  // Quick analysis
  const errorLines = output.split('\n').filter(line => line.includes('parsing error'));
  console.log(`\n📈 Remaining parsing errors: ${errorLines.length}`);
  
  if (errorLines.length > 0) {
    console.log('\n🔍 Remaining error types:');
    const errorTypes = {};
    errorLines.forEach(line => {
      if (line.includes('Could not parse import/exports with acorn')) {
        errorTypes['Import/Export Parse'] = (errorTypes['Import/Export Parse'] || 0) + 1;
      } else if (line.includes('Expected a closing tag')) {
        errorTypes['Unclosed Tags'] = (errorTypes['Unclosed Tags'] || 0) + 1;
      } else if (line.includes('Unexpected character')) {
        errorTypes['Unexpected Character'] = (errorTypes['Unexpected Character'] || 0) + 1;
      } else {
        errorTypes['Other'] = (errorTypes['Other'] || 0) + 1;
      }
    });
    
    Object.entries(errorTypes).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`);
    });
  }
  
  console.log('\n🎉 Error fixing complete!');
}

main().catch(console.error);
