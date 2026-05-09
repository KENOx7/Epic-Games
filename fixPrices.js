import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, 'scraped_games');

function processFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);
    let modified = false;

    const processItem = (item) => {
      if (item && item.price && typeof item.price === 'string') {
        // "Unknown Price" olanlar üçün Coming Soon
        if (item.price.trim() === 'Unknown Price') {
          delete item.price;
          item.newPrice = 'Coming Soon';
          modified = true;
          return;
        }

        const priceList = item.price.split('\n');
        let discount = null;
        let oldPrice = null;
        let newPrice = null;

        priceList.forEach((p) => {
          if (p.includes('%')) {
            discount = p;
          } else if (p.includes('*')) {
            oldPrice = p.replace('*', '').trim();
          } else {
            newPrice = p.trim();
          }
        });

        if (!discount && oldPrice && newPrice && newPrice !== 'Free') {
           const oldVal = parseFloat(oldPrice.replace(/[^0-9.]/g, ''));
           const newVal = parseFloat(newPrice.replace(/[^0-9.]/g, ''));
           if (oldVal > 0 && newVal < oldVal) {
             const endirim = Math.round(((oldVal - newVal) / oldVal) * 100);
             discount = `-${endirim}%`;
           }
        }

        delete item.price;
        
        if (discount) item.discount = discount;
        if (oldPrice) item.oldPrice = oldPrice;
        if (newPrice) item.newPrice = newPrice;
        
        modified = true;
      }
    };

    if (Array.isArray(json)) {
      json.forEach(processItem);
    } else {
      processItem(json);
    }

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
      console.log(`Updated: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing file ${filePath}:`, err.message);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.json')) {
      processFile(fullPath);
    }
  }
}

traverseDir(targetDir);
console.log('Done modifying JSON files.');
