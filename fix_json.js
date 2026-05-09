import fs from 'fs';
import path from 'path';

const targetDir = './scraped_games/trending';
const summaryFile = path.join(targetDir, 'category_summary.json');

try {
    const folders = fs.readdirSync(targetDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const summary = [];

    for (const folder of folders) {
        const detailsPath = path.join(targetDir, folder, 'details.json');
        if (fs.existsSync(detailsPath)) {
            try {
                const data = JSON.parse(fs.readFileSync(detailsPath, 'utf8'));
                summary.push(data);
            } catch (err) {
                console.error(`🚨 Error parsing JSON in file: ${detailsPath}`);
                console.error(err.message);
            }
        }
    }

    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log('✅ category_summary.json (trending) successfully rebuilt!');
} catch (e) {
    console.error('❌ Error:', e);
}
