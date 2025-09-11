const fs = require('fs');
const path = require('path');

const galleryDir = './snippets/traffic-policy/gallery';

// Get all .mdx files in the gallery directory
const files = fs.readdirSync(galleryDir);
const mdxFiles = files.filter(file => file.endsWith('.mdx'));

console.log(`Found ${mdxFiles.length} MDX files to clean:`, mdxFiles);

mdxFiles.forEach(mdxFile => {
    const mdxPath = path.join(galleryDir, mdxFile);
    
    console.log(`Cleaning ${mdxFile}`);
    
    // Read the MDX file
    const content = fs.readFileSync(mdxPath, 'utf8');
    
    // Remove "export default (" from the beginning and ");" from the end
    let cleanedContent = content;
    
    // Remove the first line if it starts with "export default ("
    const lines = content.split('\n');
    if (lines[0].trim() === 'export default (') {
        lines.shift(); // Remove first line
    }
    
    // Remove the last line if it's ");"
    if (lines[lines.length - 1].trim() === ');') {
        lines.pop(); // Remove last line
    }
    
    cleanedContent = lines.join('\n');
    
    // Write the cleaned content back
    fs.writeFileSync(mdxPath, cleanedContent);
    
    console.log(`✓ Cleaned ${mdxFile}`);
});

console.log('Cleanup complete!');
