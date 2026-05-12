import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Şəkillərin olduğu ana qovluq
const directoryPath = path.join(process.cwd(), 'scraped_games');

// Bütün faylları tapmaq üçün rekursiv funksiya
const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (fullPath.match(/\.(jpg|jpeg|png|webp)$/i)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
};

const compressImages = async () => {
  console.log('Şəkillər axtarılır...');
  const imageFiles = getAllFiles(directoryPath);
  console.log(`Cəmi ${imageFiles.length} şəkil tapıldı. Sıxılma başlayır...`);

  let compressedCount = 0;
  let savedBytes = 0;

  for (const filePath of imageFiles) {
    try {
      const statsBefore = fs.statSync(filePath);
      
      // Faylı əvvəlcə yaddaşa (buffer) oxuyuruq ki, Windows faylı kilidləməsin
      const inputBuffer = fs.readFileSync(filePath);
      
      const metadata = await sharp(inputBuffer).metadata();
      let sharpInstance = sharp(inputBuffer);
      
      // Çox böyük şəkillərin enini 1200px-ə qədər kiçildirik (daha böyükdürsə)
      if (metadata.width > 1200) {
          sharpInstance = sharpInstance.resize(1200); 
      }

      // Formatına görə keyfiyyəti 75-ə salırıq
      if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
          sharpInstance = sharpInstance.jpeg({ quality: 75 });
      } else if (metadata.format === 'png') {
          sharpInstance = sharpInstance.png({ quality: 75, compressionLevel: 8 });
      } else if (metadata.format === 'webp') {
          sharpInstance = sharpInstance.webp({ quality: 75 });
      }
      
      // Faylı yaddaşa alıb sonra üzərinə yazırıq
      const outputBuffer = await sharpInstance.toBuffer();
      fs.writeFileSync(filePath, outputBuffer);
      
      const statsAfter = fs.statSync(filePath);
      
      // Qazanılan fərqi hesablayırıq
      if(statsBefore.size > statsAfter.size) {
        savedBytes += (statsBefore.size - statsAfter.size);
      }
      
      compressedCount++;
      console.log(`[+] Sıxıldı: ${path.basename(filePath)}`);
    } catch (error) {
      console.error(`[-] Xəta baş verdi (${path.basename(filePath)}):`, error.message);
    }
  }

  const savedMB = (savedBytes / (1024 * 1024)).toFixed(2);
  console.log('\n=======================================');
  console.log(`Bitti! Cəmi ${compressedCount} şəkil sıxıldı.`);
  console.log(`Ümumi qazanılan yaddaş: ${savedMB} MB`);
  console.log('=======================================');
};

compressImages();
