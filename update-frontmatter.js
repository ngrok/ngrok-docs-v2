const fs = require('fs');
const path = require('path');

// Function to parse frontmatter from a markdown file
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  
  const [, frontmatterStr, body] = match;
  const frontmatter = {};
  
  // Simple YAML parser for our needs
  frontmatterStr.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      frontmatter[key] = value.replace(/^["']|["']$/g, ''); // Remove quotes
    }
  });
  
  return { frontmatter, body };
}

// Function to serialize frontmatter back to YAML
function serializeFrontmatter(frontmatter) {
  const lines = [];
  for (const [key, value] of Object.entries(frontmatter)) {
    lines.push(`${key}: ${value}`);
  }
  return lines.join('\n');
}

// Function to find the first H1 heading in markdown content
function findFirstH1(content) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      return {
        line: i,
        text: line.slice(2).trim()
      };
    }
  }
  return null;
}

// Function to update a markdown file according to the requirements
function updateMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, body } = parseFrontmatter(content);
    
    // Check if file has sidebar_label
    if (!frontmatter.sidebar_label) {
      return false; // No changes needed
    }
    
    let updatedBody = body;
    let updatedFrontmatter = { ...frontmatter };
    let hasChanges = false;
    
    // Check if there's a title property
    if (frontmatter.title) {
      const firstH1 = findFirstH1(body);
      
      if (firstH1) {
        // H1 exists - check if it's different from title prop
        if (firstH1.text !== frontmatter.title) {
          const lines = body.split('\n');
          lines[firstH1.line] = `# ${frontmatter.title}`;
          updatedBody = lines.join('\n');
          hasChanges = true;
          console.log(`Updated H1 in ${filePath}: "${firstH1.text}" -> "${frontmatter.title}"`);
        }
      } else {
        // No H1 exists - create one
        updatedBody = `# ${frontmatter.title}\n\n${body}`;
        hasChanges = true;
        console.log(`Added H1 in ${filePath}: "${frontmatter.title}"`);
      }
      
      // Delete title prop
      delete updatedFrontmatter.title;
      hasChanges = true;
    }
    
    // Rename sidebar_label to title
    updatedFrontmatter.title = frontmatter.sidebar_label;
    delete updatedFrontmatter.sidebar_label;
    hasChanges = true;
    console.log(`Renamed sidebar_label to title in ${filePath}: "${frontmatter.sidebar_label}"`);
    
    if (hasChanges) {
      const newContent = `---\n${serializeFrontmatter(updatedFrontmatter)}\n---\n${updatedBody}`;
      fs.writeFileSync(filePath, newContent, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively find all .md and .mdx files
function findMarkdownFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main function
function main() {
  const docsDir = path.join(__dirname, 'docs');
  
  if (!fs.existsSync(docsDir)) {
    console.error('docs directory not found');
    return;
  }
  
  console.log('Finding markdown files...');
  const markdownFiles = findMarkdownFiles(docsDir);
  console.log(`Found ${markdownFiles.length} markdown files`);
  
  let updatedCount = 0;
  let totalWithSidebarLabel = 0;
  
  for (const filePath of markdownFiles) {
    const relativePath = path.relative(__dirname, filePath);
    
    // Check if file has sidebar_label first
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { frontmatter } = parseFrontmatter(content);
      
      if (frontmatter.sidebar_label) {
        totalWithSidebarLabel++;
        console.log(`\nProcessing: ${relativePath}`);
        
        const wasUpdated = updateMarkdownFile(filePath);
        if (wasUpdated) {
          updatedCount++;
        }
      }
    } catch (error) {
      console.error(`Error reading ${relativePath}:`, error.message);
    }
  }
  
  console.log(`\nDone! Updated ${updatedCount} out of ${totalWithSidebarLabel} files with sidebar_label.`);
}

if (require.main === module) {
  main();
}

module.exports = { updateMarkdownFile, findMarkdownFiles, parseFrontmatter };
