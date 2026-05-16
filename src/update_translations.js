const fs = require('fs');
const file = 'c:/Users/Admin/Downloads/mirta silecem/Epic Games/src/translations.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const newKeys = {
  "discoverNow": { en: "Discover now", tr: "Hemen Keşfet", ru: "Узнать больше", az: "İndi Kəşf Et" },

  "slide1Title": { en: "Fortnite | Star Wars", tr: "Fortnite | Star Wars", ru: "Fortnite | Star Wars", az: "Fortnite | Star Wars" },
  "slide1Subtitle": { en: "AVAILABLE NOW", tr: "ŞİMDİ OYNA", ru: "УЖЕ ДОСТУПНО", az: "İNDİ MÖVCUDDUR" },
  "slide1Desc": { en: "All-new Star Wars Islands have come to Fortnite - everything from single-player role-playing games, to shooters, tycoons and more await!", tr: "Yepyeni Star Wars Adaları Fortnite'a geldi - tek oyunculu RPG'lerden nişancı oyunlarına kadar her şey seni bekliyor!", ru: "Новые острова Star Wars уже в Fortnite - вас ждут RPG, шутеры и многое другое!", az: "Tamamilə yeni Star Wars Adaları Fortnite-a gəldi - tək oyunçulu RPG-lərdən tutmuş atıcılara qədər hər şey sizi gözləyir!" },

  "slide2Title": { en: "Hogwarts Legacy", tr: "Hogwarts Legacy", ru: "Hogwarts Legacy", az: "Hogwarts Legacy" },
  "slide2Subtitle": { en: "CELEBRATE 25 YEARS OF HARRY POTTER MAGIC!", tr: "HARRY POTTER BÜYÜSÜNÜN 25. YILINI KUTLA!", ru: "ОТПРАЗДНУЙТЕ 25-ЛЕТИЕ МАГИИ ГАРРИ ПОТТЕРА!", az: "HARRY POTTER SEHRİNİN 25 İLLİYİNİ QEYD ET!" },
  "slide2Desc": { en: "Play Hogwarts Legacy free and be at the center of your own adventure in the wizarding world.", tr: "Hogwarts Legacy'i ücretsiz oyna ve büyücülük dünyasındaki maceranın merkezinde ol.", ru: "Играйте в Hogwarts Legacy бесплатно и станьте центром своего приключения в волшебном мире.", az: "Hogwarts Legacy-ni pulsuz oyna və sehrbazlıq dünyasındakı macəranın mərkəzində ol." },

  "slide3Title": { en: "Epic Savings", tr: "Epic Tasarrufları", ru: "Epic Скидки", az: "Epic Qənaətləri" },
  "slide3Subtitle": { en: "APRIL 23 - MAY 7", tr: "23 NİSAN - 7 MAYIS", ru: "23 АПРЕЛЯ - 7 МАЯ", az: "23 APREL - 7 MAY" },
  "slide3Desc": { en: "Save big on must-play games and discover new adventures.", tr: "Önemli oyunlarda büyük tasarruf et ve yeni maceralar keşfet.", ru: "Сэкономьте на лучших играх и откройте для себя новые приключения.", az: "Əsas oyunlarda böyük qənaət et və yeni macəralar kəşf et." },

  "slide4Title": { en: "May the 4th Be With You", tr: "4 Mayıs Seninle Olsun", ru: "Да пребудет с тобой 4 мая", az: "4 May Səninlə Olsun" },
  "slide4Subtitle": { en: "SPECIAL OFFERS", tr: "ÖZEL TEKLİFLER", ru: "СПЕЦИАЛЬНЫЕ ПРЕДЛОЖЕНИЯ", az: "XÜSUSİ TƏKLİFLƏR" },
  "slide4Desc": { en: "Celebrate Star Wars day with amazing deals.", tr: "Star Wars gününü harika fırsatlarla kutla.", ru: "Отпразднуйте день Звездных войн с отличными предложениями.", az: "Star Wars gününü möhtəşəm təkliflərlə qeyd et." },

  "slide5Title": { en: "MONGIL: STAR DIVE", tr: "MONGIL: STAR DIVE", ru: "MONGIL: STAR DIVE", az: "MONGIL: STAR DIVE" },
  "slide5Subtitle": { en: "NEW RELEASE", tr: "YENİ ÇIKIŞ", ru: "НОВЫЙ РЕЛИЗ", az: "YENİ BURAXILIŞ" },
  "slide5Desc": { en: "Dive into a new adventure in the stars.", tr: "Yıldızlarda yeni bir maceraya dal.", ru: "Погрузитесь в новое приключение среди звезд.", az: "Ulduzlarda yeni bir macəraya dal." },

  "slide6Title": { en: "007 First Light", tr: "007 First Light", ru: "007 First Light", az: "007 First Light" },
  "slide6Subtitle": { en: "COMING SOON", tr: "YAKINDA", ru: "СКОРО", az: "TEZLİKLƏ" },
  "slide6Desc": { en: "The iconic spy returns in a new thriller.", tr: "İkonik casus yeni bir gerilimle geri dönüyor.", ru: "Культовый шпион возвращается в новом триллере.", az: "İkonik casus yeni bir trillerlə geri dönür." }
};

for (const [key, trans] of Object.entries(newKeys)) {
  if (data.en) data.en[key] = trans.en;
  if (data.tr) data.tr[key] = trans.tr;
  if (data.ru) data.ru[key] = trans.ru;
  if (data.az) data.az[key] = trans.az;
}

fs.writeFileSync(file, JSON.stringify(data, null, 2));
