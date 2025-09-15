#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Read docs.json
const docsData = JSON.parse(fs.readFileSync('./docs.json', 'utf8'));

// Find the pages array at line 595 (Integrations section)
const integrationsSection = docsData.navigation.find(item => 
  item.item === 'Integrations' || (item.pages && item.pages.includes('integrations/index'))
);

if (!integrationsSection) {
  console.log('Could not find Integrations section');
  process.exit(1);
}

console.log('Found Integrations section:', integrationsSection.item);

// Process the pages array
const processPages = (pages) => {
  pages.forEach(page => {
    if (typeof page === 'object' && page.pages) {
      console.log(`Processing group: ${page.group}`);
      
      // Find the index file in this group
      const indexFile = page.pages.find(p => typeof p === 'string' && p.endsWith('/index'));
      
      if (indexFile) {
        console.log(`Found index file: ${indexFile}`);
        
        // Convert to MDX file path
        const mdxPath = `./${indexFile}.mdx`;
        
        if (fs.existsSync(mdxPath)) {
          console.log(`Processing MDX file: ${mdxPath}`);
          updateMDXFile(mdxPath, page.group);
        } else {
          console.log(`MDX file not found: ${mdxPath}`);
        }
      }
      
      // Recursively process nested pages if any
      processPages(page.pages);
    }
  });
};

const updateMDXFile = (filePath, groupName) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      console.log(`No frontmatter found in ${filePath}`);
      return;
    }
    
    const frontmatterText = frontmatterMatch[1];
    const restOfContent = content.substring(frontmatterMatch[0].length);
    
    // Parse frontmatter properties
    const frontmatterLines = frontmatterText.split('\n');
    const frontmatter = {};
    let updatedFrontmatter = [];
    
    frontmatterLines.forEach(line => {
      const match = line.match(/^(\s*)([\w-]+):\s*(.*)$/);
      if (match) {
        const [, indent, key, value] = match;
        frontmatter[key] = value.replace(/^["']|["']$/g, '');
        
        if (key === 'title') {
          // Change title to sidebarTitle
          updatedFrontmatter.push(`${indent}sidebarTitle: ${value}`);
        } else {
          updatedFrontmatter.push(line);
        }
      } else {
        updatedFrontmatter.push(line);
      }
    });
    
    // Create new title from name property
    let newTitle = groupName;
    if (frontmatter.name) {
      newTitle = frontmatter.name;
    }
    
    // Capitalize first letter of each word and replace hyphens with spaces
    newTitle = newTitle
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    // Add "Overview" to the end
    newTitle += ' Overview';
    
    // Add the new title property at the beginning
    updatedFrontmatter.unshift(`title: "${newTitle}"`);
    
    // Reconstruct the file
    const newContent = `---\n${updatedFrontmatter.join('\n')}\n---${restOfContent}`;
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath} with new title: "${newTitle}"`);
    
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
};

// Start processing
processPages(integrationsSection.pages);

console.log('Processing complete!');
