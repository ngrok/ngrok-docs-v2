#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Parse mintErrors.md to extract files with tag issues
function parseErrorsFromMintFile() {
    const mintErrorsPath = './mintErrors.md';
    if (!fs.existsSync(mintErrorsPath)) {
        console.log('mintErrors.md not found');
        return [];
    }
    
    const content = fs.readFileSync(mintErrorsPath, 'utf8');
    const errors = [];
    
    const lines = content.split('\n');
    for (const line of lines) {
        // Look for parsing errors with tag closure issues
        const match = line.match(/parsing error (\.\/[^:]+):(\d+):\d+ - Expected a closing tag for `<(\w+)>`/);
        if (match) {
            const [, filePath, lineNum, tagName] = match;
            errors.push({
                file: filePath,
                line: parseInt(lineNum),
                tag: tagName
            });
        }
    }
    
    return errors;
}

// Fix tag formatting issues in a file
function fixTagsInFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix common tag formatting issues
    const tagPatterns = [
        // Fix <Tip> without title that has content on same line
        {
            pattern: /<(Tip|Note|Info|Warning)>\s*([^<\n]+)/g,
            replacement: '<$1>\n**$2**\n\n'
        },
        // Fix missing line breaks after opening tags
        {
            pattern: /<(Tip|Note|Info|Warning)>([^<\n]*\n)(?!\s*(\*\*|<\/|\n))/g,
            replacement: '<$1>\n$2\n'
        },
        // Fix closing tags that are not on their own line
        {
            pattern: /([^\n])<\/(Tip|Note|Info|Warning)>/g,
            replacement: '$1\n</$2>'
        },
        // Fix indentation issues - ensure tags are at proper level
        {
            pattern: /^(\s*)<(Tip|Note|Info|Warning)>/gm,
            replacement: '<$2>'
        },
        {
            pattern: /^(\s*)<\/(Tip|Note|Info|Warning)>/gm,
            replacement: '</$2>'
        }
    ];
    
    for (const { pattern, replacement } of tagPatterns) {
        const newContent = content.replace(pattern, replacement);
        if (newContent !== content) {
            content = newContent;
            modified = true;
        }
    }
    
    // Additional specific fixes for common issues
    
    // Fix incomplete content that ends abruptly
    content = content.replace(
        /ngrok's IP Restriction action uses \[CIDRs\]\([^)]+\) to specific IPs or IP ranges\. The `\/32` notation refers to a single IPv4 address, like `/g,
        "ngrok's IP Restriction action uses [CIDRs](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) to specify IPs or IP ranges. The `/32` notation refers to a single IPv4 address, like `1.1.1.1/32`."
    );
    
    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`Fixed tags in: ${filePath}`);
        return true;
    }
    
    return false;
}

// Main execution
function main() {
    console.log('Parsing errors from mintErrors.md...');
    const errors = parseErrorsFromMintFile();
    
    if (errors.length === 0) {
        console.log('No tag errors found in mintErrors.md');
        return;
    }
    
    console.log(`Found ${errors.length} tag errors`);
    
    // Get unique files with errors
    const uniqueFiles = [...new Set(errors.map(e => e.file))];
    
    let fixedCount = 0;
    for (const file of uniqueFiles) {
        const relativeFile = file.startsWith('./') ? file.substring(2) : file;
        if (fixTagsInFile(relativeFile)) {
            fixedCount++;
        }
    }
    
    console.log(`\nFixed tags in ${fixedCount} files`);
    console.log('Run "mint dev" to check if issues are resolved');
}

main();
