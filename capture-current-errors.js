#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');

console.log('🔍 Starting Mintlify error capture...');

// Start mintlify dev process
const mintProcess = spawn('npx', ['mintlify', 'dev'], {
  stdio: ['ignore', 'pipe', 'pipe']
});

let errorOutput = '';
let stdoutOutput = '';

// Capture stderr (where errors are typically output)
mintProcess.stderr.on('data', (data) => {
  const text = data.toString();
  errorOutput += text;
  process.stderr.write(text); // Also show in real-time
});

// Capture stdout
mintProcess.stdout.on('data', (data) => {
  const text = data.toString();
  stdoutOutput += text;
  process.stdout.write(text); // Also show in real-time
});

// Set timeout to kill process after 2 minutes to allow full parsing
const timeout = setTimeout(() => {
  console.log('\n⏰ Timeout reached, terminating process...');
  mintProcess.kill('SIGTERM');
}, 120000);

mintProcess.on('close', (code) => {
  clearTimeout(timeout);
  
  console.log(`\n📊 Process exited with code: ${code}`);
  
  // Combine all output
  const allOutput = stdoutOutput + errorOutput;
  
  // Write to file
  fs.writeFileSync('current-errors.md', allOutput);
  console.log('📝 Errors saved to current-errors.md');
  
  // Quick analysis
  const lines = allOutput.split('\n');
  const errorLines = lines.filter(line => line.includes('parsing error'));
  
  console.log(`\n📈 Quick Analysis:`);
  console.log(`- Total output lines: ${lines.length}`);
  console.log(`- Parsing error lines: ${errorLines.length}`);
  
  if (errorLines.length > 0) {
    console.log(`\n🔍 Error types found:`);
    const errorTypes = {};
    errorLines.forEach(line => {
      if (line.includes('Could not parse import/exports with acorn')) {
        errorTypes['Import/Export Parse Errors'] = (errorTypes['Import/Export Parse Errors'] || 0) + 1;
      } else if (line.includes('Expected a closing tag')) {
        errorTypes['Unclosed Tag Errors'] = (errorTypes['Unclosed Tag Errors'] || 0) + 1;
      } else if (line.includes('Unexpected character')) {
        errorTypes['Unexpected Character Errors'] = (errorTypes['Unexpected Character Errors'] || 0) + 1;
      } else if (line.includes('Unexpected `ExpressionStatement`')) {
        errorTypes['Expression Statement Errors'] = (errorTypes['Expression Statement Errors'] || 0) + 1;
      } else {
        errorTypes['Other Parsing Errors'] = (errorTypes['Other Parsing Errors'] || 0) + 1;
      }
    });
    
    Object.entries(errorTypes).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`);
    });
  }
  
  console.log('\n✅ Error capture complete!');
});

mintProcess.on('error', (err) => {
  clearTimeout(timeout);
  console.error('❌ Failed to start mintlify process:', err);
  process.exit(1);
});
