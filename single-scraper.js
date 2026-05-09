import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

// ============================================================
// ISTIFADE: node single-scraper.js <EPIC_GAMES_URL>
// Misal: node single-scraper.js https://store.epicgames.com/en-US/p/arranger-a-rolepuzzling-adventure-dbfde7
// ============================================================

const GAME_URL = process.argv[2];

if (!GAME_URL) {
    console.error('❌ URL verilmedi!');
    console.error('Istifade: node single-scraper.js <EPIC_GAMES_URL>');
    process.exit(1);
}

// Helper: "Arranger A Role..." -> "arranger-a-role..."
const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

// Helper: Sekil yuklemek (http ve https destekler)
const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode === 200) {
                response.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                response.resume();
                resolve(null);
            }
        }).on('error', reject);
    });
};

// Helper: Gecikmek
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================
// fixPrices mantigi - JSON-u otomatik duzeldir
// ============================================================
function fixPrices(json) {
    const processItem = (item) => {
        if (item && item.price && typeof item.price === 'string') {
            const priceList = item.price.split('\n');
            let discount = null;
            let oldPrice = null;
            let newPrice = null;

            priceList.forEach((p) => {
                if (p.includes('%')) {
                    discount = p.trim();
                } else if (p.includes('*')) {
                    oldPrice = p.replace('*', '').trim();
                } else {
                    newPrice = p.trim();
                }
            });

            // Eger endirim yoxdursa ozumuz hesabla
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
            if (oldPrice)  item.oldPrice = oldPrice;
            if (newPrice)  item.newPrice = newPrice;
        }
    };

    if (Array.isArray(json)) {
        json.forEach(processItem);
    } else {
        processItem(json);
    }

    return json;
}

// ============================================================
// ANA FUNKSIYA
// ============================================================
async function scrapeSingleGame() {
    console.log('🚀 Tek oyun scraper bashladi...');
    console.log(`🔗 URL: ${GAME_URL}`);

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    try {
        // Birbaşa oyun sehifesine git
        await page.goto(GAME_URL, { waitUntil: 'networkidle2', timeout: 60000 });
        await delay(3000);

        // ============================================================
        // Oyun melumatlarini topla
        // ============================================================
        const gameData = await page.evaluate(() => {
            const safeTrim = (str) => (str ? str.trim() : '');

            // Bashliq
            const titleElement = document.querySelector('h1');
            const title = titleElement ? titleElement.innerText : 'Unknown Title';

            // Qiymet
            const priceElement = Array.from(document.querySelectorAll('span, div'))
                .find(el =>
                    el.innerText &&
                    (el.innerText.includes('$') || el.innerText.toLowerCase() === 'free') &&
                    el.innerText.length < 15 &&
                    el.innerText.length > 2
                );
            const price = priceElement ? priceElement.innerText : 'Unknown Price';

            // Tesvir
            let description = '';
            const idDesc = document.getElementById('about-long-description');
            if (idDesc) {
                description = idDesc.innerText.trim();
            } else {
                description = 'No description available.';
            }

            // Sidebar melumatlarini al (Developer, Publisher, vs.)
            const extractSidebarField = (label) => {
                try {
                    const allDivs = Array.from(document.querySelectorAll('div, li'));
                    let bestDiv = null;
                    for (const div of allDivs) {
                        const text = (div.innerText || '').trim();
                        if (text.includes(label) && text.length > label.length) {
                            if (!bestDiv || text.length < bestDiv.innerText.length) {
                                bestDiv = div;
                            }
                        }
                    }
                    if (bestDiv) {
                        let val = bestDiv.innerText.trim().replace(label, '').trim();
                        val = val.replace(/^\n+/, '').trim();
                        return val.split('\n')[0].trim();
                    }
                } catch (e) {}
                return 'N/A';
            };

            const developer   = extractSidebarField('Developer');
            const publisher   = extractSidebarField('Publisher');
            const releaseDate = extractSidebarField('Release Date');

            let platform = extractSidebarField('Platform');
            if (platform === 'N/A' || platform === '') platform = 'Windows';

            // Tag-lari al (Janrlar, Xususiyyetler)
            const extractTags = (label) => {
                try {
                    const allDivs = Array.from(document.querySelectorAll('div, section, ul'));
                    let tagDiv = null;
                    for (const div of allDivs) {
                        const text = (div.innerText || '').trim();
                        if (text.startsWith(label) && text.length > label.length) {
                            if (!tagDiv || text.length < tagDiv.innerText.length) tagDiv = div;
                        }
                    }
                    if (tagDiv) {
                        let elements = Array.from(tagDiv.querySelectorAll('a'))
                            .map(el => safeTrim(el.innerText)).filter(Boolean);
                        if (elements.length === 0) {
                            elements = Array.from(tagDiv.querySelectorAll('li'))
                                .map(el => safeTrim(el.innerText)).filter(Boolean);
                        }
                        if (elements.length > 0) {
                            const uniqueMap = new Map();
                            elements.forEach(el => uniqueMap.set(el.toLowerCase(), el));
                            return Array.from(uniqueMap.values());
                        }
                        const lines = tagDiv.innerText.split('\n')
                            .map(t => safeTrim(t)).filter(Boolean);
                        return Array.from(new Set(lines.filter(t => t !== label)));
                    }
                } catch (e) {}
                return [];
            };

            const genres   = extractTags('Genres');
            const features = extractTags('Features');

            // Oyuncu reytinqi
            let playerRating = 'N/A';
            try {
                const h2s = Array.from(document.querySelectorAll('h2'));
                const ratingH2 = h2s.find(h => h.innerText.trim().match(/^([1-4](\.\d)?|5(\.0)?)$/));
                if (ratingH2) {
                    playerRating = ratingH2.innerText.trim();
                } else {
                    const allDivs = Array.from(document.querySelectorAll('div, span, section'));
                    let ratingDiv = null;
                    for (const div of allDivs) {
                        const text = (div.innerText || '').trim();
                        if (text.includes('Epic Player Rating')) {
                            if (!ratingDiv || text.length < ratingDiv.innerText.length) ratingDiv = div;
                        }
                    }
                    if (ratingDiv) {
                        const textToMatch = ratingDiv.innerText.replace('Epic Player Rating', '').trim();
                        const match = textToMatch.match(/\b([1-4](\.\d)?|5(\.0)?)\b/);
                        if (match) playerRating = match[0];
                    }
                }
            } catch (e) {}

            // Cover-2 (css-uwwqev konteynerinden)
            let cover2Url = null;
            const cover2Img = document.querySelector('div.css-uwwqev[data-testid="picture"] img');
            if (cover2Img) {
                cover2Url = cover2Img.getAttribute('data-image') || cover2Img.src;
            }

            // Butun sekilleri topla (SVG-leri, logolari, avatarlari istisna et)
            const imgElements = Array.from(document.querySelectorAll('img'));
            let imageUrls = imgElements
                .map(img => img.getAttribute('data-image') || img.src)
                .filter(src =>
                    src &&
                    src.startsWith('http') &&
                    !src.includes('logo') &&
                    !src.includes('avatar') &&
                    !src.includes('icon') &&
                    !src.includes('.svg')
                )
                .filter((value, index, self) => self.indexOf(value) === index);

            // cover2-ni image listesinden cikar (ayrica saxlanacaq)
            if (cover2Url) {
                imageUrls = imageUrls.filter(url => url !== cover2Url);
            }

            return {
                title,
                price,
                developer,
                publisher,
                releaseDate,
                platform,
                genres,
                features,
                playerRating,
                description,
                images: imageUrls,
                cover2Url
            };
        });

        if (gameData.title === 'Unknown Title') {
            console.error('❌ Oyun bashligi tapilmadi. URL-i yoxlayin.');
            await browser.close();
            process.exit(1);
        }

        console.log(`✅ Oyun tapildi: "${gameData.title}"`);

        // ============================================================
        // Qovluq yarat
        // ============================================================
        const outputDir  = path.join(process.cwd(), 'scraped_games', 'single');
        const folderName = slugify(gameData.title);
        const gameFolderPath = path.join(outputDir, folderName);

        if (!fs.existsSync(gameFolderPath)) {
            fs.mkdirSync(gameFolderPath, { recursive: true });
        }

        console.log(`📂 Qovluq: scraped_games/single/${folderName}`);

        // ============================================================
        // Cover yuklenmir - user ozü yukleyecek
        // ============================================================
        console.log(`ℹ️  cover.jpg yuklenmir — bunu ozun yukle.`);

        const downloadedImageNames = [];

        // Cover-2 yukle (eger varsa)
        if (gameData.cover2Url) {
            const cleanCover2 = gameData.cover2Url.split('?')[0];
            let ext = path.extname(cleanCover2);
            if (!ext || ext.length > 5) ext = '.jpg';
            const cover2Name = `cover-2${ext}`;
            try {
                await downloadImage(cleanCover2, path.join(gameFolderPath, cover2Name));
                downloadedImageNames.push(cover2Name);
                console.log(`🖼️  cover-2 yuklenildi.`);
            } catch (e) {
                console.log(`⚠️  cover-2 yuklenilmedi.`);
            }
        }

        // Diger sekilleri yukle (max 10)
        console.log(`⬇️  ${gameData.images.length} sekil yuklenilir...`);
        let imgCounter = 1;

        for (const imgUrl of gameData.images) {
            if (imgCounter > 10) break;

            const cleanUrl = imgUrl.split('?')[0];
            let ext = path.extname(cleanUrl);
            if (!ext || ext.length > 5) ext = '.jpg';

            const imageName = `image-${imgCounter}${ext}`;
            const imagePath = path.join(gameFolderPath, imageName);

            try {
                await downloadImage(cleanUrl, imagePath);
                downloadedImageNames.push(imageName);
                imgCounter++;
                console.log(`   ✅ ${imageName}`);
            } catch (e) {
                console.log(`   ⚠️ yuklenilmedi: ${cleanUrl}`);
            }
        }

        // ============================================================
        // JSON melu matlarini yaz + fixPrices otomatik islet
        // ============================================================
        const gameDetails = {
            url: GAME_URL,
            title: gameData.title,
            price: gameData.price,             // fixPrices bunu parcalayacaq
            developer: gameData.developer,
            publisher: gameData.publisher,
            releaseDate: gameData.releaseDate,
            platform: gameData.platform,
            genres: gameData.genres,
            features: gameData.features,
            playerRating: gameData.playerRating,
            description: gameData.description,
            saved_images: downloadedImageNames
        };

        // fixPrices mantigini otomatik islet
        const fixed = fixPrices(gameDetails);

        const jsonPath = path.join(gameFolderPath, 'details.json');
        fs.writeFileSync(jsonPath, JSON.stringify(fixed, null, 2));
        console.log(`\n📄 details.json saxlanildi (qiymetler otomatik duzeldildi).`);

        console.log(`\n🎉 Tamamlandi! "${gameData.title}"`);
        console.log(`   📂 Qovluq : scraped_games/single/${folderName}`);
        console.log(`   🖼️  Sekiller: ${downloadedImageNames.length} eded`);
        console.log(`   ⚠️  Cover   : ozun yukle!`);

    } catch (error) {
        console.error('❌ Xeta:', error.message);
    }

    await browser.close();
}

scrapeSingleGame();
