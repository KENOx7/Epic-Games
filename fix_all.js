import fs from 'fs';
import path from 'path';

function cleanConflicts(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Regex to match Git merge conflict markers and keep the incoming changes (the bottom part)
    const conflictRegex = /<<<<<<< HEAD(?:.*?)\r?\n(?:.*?\r?\n)*?=======\r?\n((?:.*?\r?\n)*?)>>>>>>>.*?(?:\r?\n|$)/g;
    
    const newContent = content.replace(conflictRegex, '$1');
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`🛠️ Fixed Git conflicts in: ${filePath}`);
    }
}

function traverseDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.json')) {
            cleanConflicts(fullPath);
        }
    }
}

const targetDir = path.join(process.cwd(), 'scraped_games');
console.log('🔍 Scanning for Git conflicts...');
traverseDir(targetDir);

console.log('\n🏗️ Rebuilding all category_summary.json files...');
const categories = fs.readdirSync(targetDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

for (const category of categories) {
    const catDir = path.join(targetDir, category);
    const summaryFile = path.join(catDir, 'category_summary.json');
    const folders = fs.readdirSync(catDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const summary = [];
    for (const folder of folders) {
        const detailsPath = path.join(catDir, folder, 'details.json');
        if (fs.existsSync(detailsPath)) {
            try {
                const data = JSON.parse(fs.readFileSync(detailsPath, 'utf8'));
                summary.push(data);
            } catch (err) {
                console.error(`🚨 Still failing to parse: ${detailsPath}`);
                console.error(err.message);
            }
        }
    }
    
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log(`✅ Successfully rebuilt: scraped_games/${category}/category_summary.json`);
}

console.log('\n🎉 All JSON files are fixed and rebuilt!');
