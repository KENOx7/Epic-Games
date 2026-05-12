import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

// 3 target URLs with their category folder names
const CATEGORIES = [
    {
        url: 'https://store.epicgames.com/en-US/collection/top-player-reviewed',
        folder: 'top-player-reviewed'
    },
    {
        url: 'https://store.epicgames.com/collection/most-popular',
        folder: 'most-popular'
    }
];

// Helper to format names like "Hogwarts Legacy" to "hogwarts-legacy"
const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

// Helper to download an image (supports both http and https)
const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (response) => {
            // Follow redirects
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

// Helper for delaying execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeEpicGames() {
    console.log('🚀 Starting Epic Games Scraper...');

    // Ensure output directory exists
    const outputDir = path.join(process.cwd(), 'scraped_games');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Process each category separately
    for (const category of CATEGORIES) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📂 Category: ${category.folder}`);
        console.log(`🔗 URL: ${category.url}`);
        console.log(`${'='.repeat(60)}`);

        // Create category folder
        const categoryDir = path.join(outputDir, category.folder);
        if (!fs.existsSync(categoryDir)) {
            fs.mkdirSync(categoryDir, { recursive: true });
        }

        try {
            await page.goto(category.url, { waitUntil: 'networkidle2', timeout: 60000 });
            await delay(3000);

            // ============================================================
            // STEP 1: Scroll and collect game cards with cover images
            // ============================================================
            let gameCards = [];
            let previousCount = 0;
            let retries = 0;

            while (gameCards.length < 60 && retries < 20) {
                // Extract game cards: link + cover image from data-testid="picture"
                const cards = await page.evaluate(() => {
                    const results = [];
                    // Find all anchor tags that link to game pages (/p/)
                    const anchors = Array.from(document.querySelectorAll('a[href*="/p/"]'));

                    for (const anchor of anchors) {
                        const href = anchor.href;
                        if (!href || !href.includes('/p/')) continue;

                        // Look for data-testid="picture" inside this anchor or its parent card
                        let card = anchor.closest('[class]') || anchor;
                        let pictureDiv = anchor.querySelector('[data-testid="picture"]');
                        if (!pictureDiv) {
                            pictureDiv = card.querySelector('[data-testid="picture"]');
                        }

                        let coverUrl = '';
                        if (pictureDiv) {
                            const img = pictureDiv.querySelector('img');
                            if (img) {
                                coverUrl = img.getAttribute('data-image') || img.src || '';
                            }
                        }

                        // Get game title from the image alt or any heading
                        let title = '';
                        if (pictureDiv) {
                            const img = pictureDiv.querySelector('img');
                            if (img) title = img.alt || '';
                        }
                        if (!title) {
                            const heading = anchor.querySelector('h1, h2, h3, h4, h5, h6, span');
                            if (heading) title = heading.innerText || '';
                        }

                        if (href && title) {
                            results.push({
                                url: href,
                                title: title.trim(),
                                coverImageUrl: coverUrl
                            });
                        }
                    }

                    // Deduplicate by URL
                    const seen = new Set();
                    return results.filter(r => {
                        if (seen.has(r.url)) return false;
                        seen.add(r.url);
                        return true;
                    });
                });

                // Merge new cards (avoid duplicates)
                const existingUrls = new Set(gameCards.map(c => c.url));
                for (const card of cards) {
                    if (!existingUrls.has(card.url)) {
                        gameCards.push(card);
                        existingUrls.add(card.url);
                    }
                }

                if (gameCards.length >= 60) break;

                // Scroll down to load more
                await page.evaluate(() => window.scrollBy(0, 1500));
                await delay(1500);

                if (gameCards.length === previousCount) {
                    retries++;
                } else {
                    retries = 0;
                }
                previousCount = gameCards.length;

                process.stdout.write(`\r   ⏳ Found ${gameCards.length}/60 game cards so far...`);
            }

            console.log(); // New line

            // Limit to 60
            gameCards = gameCards.slice(0, 60);
            console.log(`✅ Collected ${gameCards.length} game cards from ${category.folder}`);

            // ============================================================
            // STEP 2: For each card, create folder & save cover image NOW
            // ============================================================
            for (let i = 0; i < gameCards.length; i++) {
                const card = gameCards[i];
                const safeFolderName = slugify(card.title);
                const gameFolderPath = path.join(categoryDir, safeFolderName);

                if (!fs.existsSync(gameFolderPath)) {
                    fs.mkdirSync(gameFolderPath, { recursive: true });
                }

                // Save cover image immediately
                if (card.coverImageUrl) {
                    const coverPath = path.join(gameFolderPath, 'cover.jpg');
                    try {
                        const cleanCoverUrl = card.coverImageUrl.split('?')[0];
                        await downloadImage(cleanCoverUrl, coverPath);
                        console.log(`   🖼️ [${i + 1}/${gameCards.length}] Cover saved: ${card.title}`);
                    } catch (e) {
                        console.log(`   ⚠️ [${i + 1}/${gameCards.length}] Cover download failed: ${card.title}`);
                    }
                } else {
                    console.log(`   ⚠️ [${i + 1}/${gameCards.length}] No cover image found: ${card.title}`);
                }

                // Store folder path for later use
                card._folderPath = gameFolderPath;
                card._safeFolderName = safeFolderName;
            }

            // ============================================================
            // STEP 3: Visit each game page for details & additional images
            // ============================================================
            const categoryScrapedData = [];

            for (let i = 0; i < gameCards.length; i++) {
                const card = gameCards[i];
                console.log(`\n   [${i + 1}/${gameCards.length}] Scraping details: ${card.title}`);
                console.log(`   🔗 ${card.url}`);

                try {
                    await page.goto(card.url, { waitUntil: 'networkidle2', timeout: 60000 });
                    await delay(3000);

                    // Extract game details
                    const gameData = await page.evaluate(() => {
                        const safeTrim = (str) => (str ? str.trim() : '');

                        const titleElement = document.querySelector('h1');
                        const title = titleElement ? titleElement.innerText : 'Unknown Title';

                        const priceElement = Array.from(document.querySelectorAll('span, div'))
                            .find(el => el.innerText && (el.innerText.includes('$') || el.innerText.toLowerCase() === 'free') && el.innerText.length < 15 && el.innerText.length > 2);
                        const price = priceElement ? priceElement.innerText : 'Unknown Price';

                        let description = '';
                        try {
                            const idDesc = document.getElementById('about-long-description');
                            if (idDesc) {
                                description = idDesc.innerText.trim();
                            } else {
                                description = "No description available.";
                            }
                        } catch (e) { }

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
                            } catch (e) { }
                            return 'N/A';
                        };

                        const developer = extractSidebarField('Developer');
                        const publisher = extractSidebarField('Publisher');
                        const releaseDate = extractSidebarField('Release Date');

                        let platform = extractSidebarField('Platform');
                        if (platform === 'N/A' || platform === '') {
                            try {
                                const allDivs = Array.from(document.querySelectorAll('div, li'));
                                let pDiv = null;
                                for (const div of allDivs) {
                                    const text = (div.innerText || '').trim();
                                    if (text.includes('Platform')) {
                                        if (!pDiv || text.length < pDiv.innerText.length) pDiv = div;
                                    }
                                }
                                if (pDiv && pDiv.querySelectorAll('svg').length > 0) platform = 'Windows';
                            } catch (e) { }
                        }

                        const extractTags = (label) => {
                            try {
                                const allDivs = Array.from(document.querySelectorAll('div, section, ul'));
                                let tagDiv = null;
                                for (const div of allDivs) {
                                    const text = (div.innerText || '').trim();
                                    if (text.startsWith(label) && text.length > label.length) {
                                        if (!tagDiv || text.length < tagDiv.innerText.length) {
                                            tagDiv = div;
                                        }
                                    }
                                }
                                if (tagDiv) {
                                    let elements = Array.from(tagDiv.querySelectorAll('a')).map(el => safeTrim(el.innerText)).filter(Boolean);
                                    if (elements.length === 0) {
                                        elements = Array.from(tagDiv.querySelectorAll('li')).map(el => safeTrim(el.innerText)).filter(Boolean);
                                    }
                                    if (elements.length > 0) {
                                        const uniqueMap = new Map();
                                        elements.forEach(el => uniqueMap.set(el.toLowerCase(), el));
                                        return Array.from(uniqueMap.values());
                                    }
                                    const lines = tagDiv.innerText.split('\n').map(t => safeTrim(t)).filter(Boolean);
                                    return Array.from(new Set(lines.filter(t => t !== label)));
                                }
                            } catch (e) { }
                            return [];
                        };

                        const genres = extractTags('Genres');
                        const features = extractTags('Features');

                        let playerRating = 'N/A';
                        try {
                            const h2s = Array.from(document.querySelectorAll('h2'));
                            const ratingH2 = h2s.find(h => {
                                const text = h.innerText.trim();
                                return text.match(/^([1-4](\.\d)?|5(\.0)?)$/);
                            });

                            if (ratingH2) {
                                playerRating = ratingH2.innerText.trim();
                            } else {
                                const allDivs = Array.from(document.querySelectorAll('div, span, section'));
                                let ratingDiv = null;
                                for (const div of allDivs) {
                                    const text = (div.innerText || '').trim();
                                    if (text.includes('Epic Player Rating')) {
                                        if (!ratingDiv || text.length < ratingDiv.innerText.length) {
                                            ratingDiv = div;
                                        }
                                    }
                                }
                                if (ratingDiv) {
                                    const textToMatch = ratingDiv.innerText.replace('Epic Player Rating', '').trim();
                                    const match = textToMatch.match(/\b([1-4](\.\d)?|5(\.0)?)\b/);
                                    if (match) playerRating = match[0];
                                }
                            }
                        } catch (e) { }

                        // Collect cover-2 specifically
                        let cover2Url = null;
                        try {
                            const cover2Img = document.querySelector('div.css-2azk84 img') || document.querySelector('div.css-uwwqev[data-testid="picture"] img');
                            if (cover2Img) {
                                cover2Url = cover2Img.getAttribute('data-image') || cover2Img.src;
                            }
                        } catch (e) { }

                        // Collect age rating image
                        let ageUrl = null;
                        try {
                            const ageImg = document.querySelector('[data-testid="ratings-image"] img');
                            if (ageImg) {
                                ageUrl = ageImg.getAttribute('data-image') || ageImg.src;
                            }
                        } catch (e) { }

                        // Collect all meaningful images from the game page
                        const imgElements = Array.from(document.querySelectorAll('img'));
                        let imageUrls = imgElements
                            .map(img => img.getAttribute('data-image') || img.src)
                            .filter(src => src && src.startsWith('http') && !src.includes('logo') && !src.includes('avatar') && !src.includes('icon') && !src.includes('.svg') && !src.includes('.svg?'))
                            .filter((value, index, self) => self.indexOf(value) === index);

                        if (cover2Url) {
                            imageUrls = imageUrls.filter(url => url !== cover2Url);
                        }
                        if (ageUrl) {
                            imageUrls = imageUrls.filter(url => url !== ageUrl);
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
                            cover2Url,
                            ageUrl
                        };
                    });

                    if (gameData.title === 'Unknown Title') {
                        console.log(`   ⚠️ Could not find title, skipping details...`);
                        continue;
                    }

                    // Download additional images to the already-created game folder
                    const gameFolderPath = card._folderPath;
                    const safeFolderName = card._safeFolderName;
                    const downloadedImageNames = ['cover.jpg']; // cover already saved

                    if (gameData.cover2Url) {
                        const cleanCover2Url = gameData.cover2Url.split('?')[0];
                        let ext = path.extname(cleanCover2Url);
                        if (!ext || ext.length > 5) ext = '.jpg';
                        const cover2Name = `cover-2${ext}`;
                        const cover2Path = path.join(gameFolderPath, cover2Name);
                        try {
                            await downloadImage(cleanCover2Url, cover2Path);
                            downloadedImageNames.push(cover2Name);
                            console.log(`   🖼️ Cover-2 saved.`);
                        } catch (e) {
                            console.log(`   ⚠️ Failed to download cover-2: ${cleanCover2Url}`);
                        }
                    }

                    if (gameData.ageUrl) {
                        const cleanAgeUrl = gameData.ageUrl.split('?')[0];
                        let ext = path.extname(cleanAgeUrl);
                        if (!ext || ext.length > 5) ext = '.png';
                        const ageName = `age${ext}`;
                        const agePath = path.join(gameFolderPath, ageName);
                        try {
                            await downloadImage(cleanAgeUrl, agePath);
                            downloadedImageNames.push(ageName);
                            console.log(`   🖼️ Age rating saved.`);
                        } catch (e) {
                            console.log(`   ⚠️ Failed to download age rating: ${cleanAgeUrl}`);
                        }
                    }

                    let imgCounter = 1;

                    console.log(`   ⬇️ Downloading ${gameData.images.length} additional images...`);
                    for (const imgUrl of gameData.images) {
                        const cleanUrl = imgUrl.split('?')[0];
                        let ext = path.extname(cleanUrl);
                        if (!ext || ext.length > 5) ext = '.jpg';

                        const imageName = `image-${imgCounter}${ext}`;
                        const imagePath = path.join(gameFolderPath, imageName);

                        try {
                            await downloadImage(cleanUrl, imagePath);
                            downloadedImageNames.push(imageName);
                            imgCounter++;
                        } catch (e) {
                            console.log(`   ⚠️ Failed to download: ${cleanUrl}`);
                        }

                        if (imgCounter > 10) break;
                    }

                    // Save JSON data
                    const gameDetails = {
                        url: card.url,
                        title: gameData.title,
                        price: gameData.price,
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

                    fs.writeFileSync(
                        path.join(gameFolderPath, 'details.json'),
                        JSON.stringify(gameDetails, null, 2)
                    );

                    categoryScrapedData.push(gameDetails);

                    // Save category summary incrementally
                    fs.writeFileSync(
                        path.join(categoryDir, 'category_summary.json'),
                        JSON.stringify(categoryScrapedData, null, 2)
                    );

                    console.log(`   ✅ Finished: ${gameData.title} (${downloadedImageNames.length} images)`);

                } catch (error) {
                    console.error(`   ❌ Error scraping ${card.url}:`, error.message);
                }
            }

            console.log(`\n🏁 Category "${category.folder}" complete: ${categoryScrapedData.length} games scraped.`);

        } catch (error) {
            console.error(`❌ Error processing category ${category.folder}:`, error.message);
        }
    }

    console.log(`\n🎉 All categories scraped successfully!`);
    console.log(`📂 Check the "scraped_games" folder for results.`);

    await browser.close();
}

// Utility to auto-scroll the page to trigger lazy loading
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight || totalHeight > 5000) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

scrapeEpicGames();
