#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function parseMarkdownFile(content) {
  // Extract frontmatter
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: '', body: content, hasFrontmatter: false };
  }
  
  return {
    frontmatter: match[1],
    body: match[2],
    hasFrontmatter: true
  };
}

function parseFrontmatter(frontmatterStr) {
  const props = {};
  const lines = frontmatterStr.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && trimmed.includes(':')) {
      const colonIndex = trimmed.indexOf(':');
      const key = trimmed.substring(0, colonIndex).trim();
      let value = trimmed.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      props[key] = value;
    }
  }
  
  return props;
}

function serializeFrontmatter(props) {
  const lines = [];
  for (const [key, value] of Object.entries(props)) {
    // Quote the value if it contains special characters or spaces
    const needsQuotes = /[:\n\r]/.test(value) || value !== value.trim();
    const quotedValue = needsQuotes ? `"${value.replace(/"/g, '\\"')}"` : value;
    lines.push(`${key}: ${quotedValue}`);
  }
  return lines.join('\n');
}

function fixImports(content) {
  // Fix imports from /snippets/components/ to end with .jsx
  const importRegex = /^import\s+.*?\s+from\s+["']\/snippets\/components\/[^"']*(?<!\.jsx)["'];?$/gm;
  
  return content.replace(importRegex, (match) => {
    // Check if it already ends with .jsx
    if (match.includes('.jsx"') || match.includes(".jsx'")) {
      return match;
    }
    
    // Add .jsx before the closing quote
    return match.replace(/["'];?$/, (quote) => {
      const isQuoted = quote.startsWith('"');
      const hasSemicolon = quote.endsWith(';');
      const baseQuote = isQuoted ? '"' : "'";
      return `.jsx${baseQuote}${hasSemicolon ? ';' : ''}`;
    });
  });
}

function fixH1AndTitle(frontmatter, body, frontmatterProps) {
  // Find H1 headings
  const h1Regex = /^#\s+(.+)$/gm;
  const h1Matches = [...body.matchAll(h1Regex)];
  
  if (h1Matches.length === 0) {
    return { frontmatter, body, changed: false };
  }
  
  const h1Text = h1Matches[0][1].trim();
  const titleProp = frontmatterProps.title;
  
  if (titleProp) {
    // Compare title and H1 (case insensitive)
    if (titleProp.toLowerCase() === h1Text.toLowerCase()) {
      // Remove the H1
      const newBody = body.replace(h1Regex, '').replace(/^\n+/, '');
      return { frontmatter, body: newBody, changed: true };
    }
    // If they don't match, do nothing
    return { frontmatter, body, changed: false };
  } else {
    // No title property, add H1 text to frontmatter and remove H1
    const newFrontmatterProps = { ...frontmatterProps, title: h1Text };
    const newFrontmatter = serializeFrontmatter(newFrontmatterProps);
    const newBody = body.replace(h1Regex, '').replace(/^\n+/, '');
    return { frontmatter: newFrontmatter, body: newBody, changed: true };
  }
}

async function processFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  const { frontmatter, body, hasFrontmatter } = parseMarkdownFile(content);
  
  // Fix imports
  let fixedBody = fixImports(body);
  let importChanged = fixedBody !== body;
  
  // Parse frontmatter props
  const frontmatterProps = hasFrontmatter ? parseFrontmatter(frontmatter) : {};
  
  // Fix H1 and title
  const { frontmatter: newFrontmatter, body: finalBody, changed: h1Changed } = 
    fixH1AndTitle(frontmatter, fixedBody, frontmatterProps);
  
  const totalChanged = importChanged || h1Changed;
  
  if (totalChanged) {
    let newContent;
    if (hasFrontmatter || h1Changed) {
      newContent = `---\n${newFrontmatter}\n---\n${finalBody}`;
    } else {
      newContent = finalBody;
    }
    
    fs.writeFileSync(filePath, newContent);
    console.log(`  ✓ Updated ${filePath}`);
  } else {
    console.log(`  - No changes needed for ${filePath}`);
  }
}

function findMarkdownFiles(dir) {
  const files = [];
  
  function walkDir(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.git') {
          walkDir(fullPath);
        }
      } else if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(dir);
  return files;
}

async function main() {
  try {
    // Find all .md and .mdx files
    const files = findMarkdownFiles(process.cwd());
    
    console.log(`Found ${files.length} markdown files to process`);
    
    for (const file of files) {
      await processFile(file);
    }
    
    console.log('\nProcessing complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
