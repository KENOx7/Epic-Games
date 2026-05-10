import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Oyunun adından qovluq adını yaradan sadə funksiya
function getFolderName(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Bir sütunu (kateqoriyanı) göstərən komponent
function GameColumn({ title, endpoint }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    // Vercel API-dən məlumatları çəkirik
    axios.get(`https://epic-games-api-eta.vercel.app/${endpoint}/category_summary.json`)
      .then((res) => {
        // Yalnız ilk 5 oyunu götürürük
        setGames(res.data.slice(0, 5));
      })
  }, [endpoint]);

  return (
    <div className="flex-1 w-full border-r border-[#2a2a2a] last:border-0 md:pr-4 last:pr-0 mb-8 md:mb-0">
      {/* Başlıq hissəsi */}
      <div className="flex items-center justify-between mb-4 group">
        <h3 className="text-white text-lg">{title}</h3>
        <span className="text-white hover:underline cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">View More</span>
      </div>

      {/* Oyunların siyahısı */}
      <div className="flex flex-col gap-3">
        {games.map((game, index) => {
          const folderName = getFolderName(game.title);
          const imageSrc = `https://epic-games-api-eta.vercel.app/${endpoint}/${folderName}/cover.jpg`;

          return (
            <Link 
              key={index} 
              to={`/game/${folderName}?from=${endpoint}`}
              className="flex items-center gap-4 hover:bg-[#2a2a2a] p-2 rounded-lg transition-colors group"
            >
              {/* Şəkil */}
              <div className="w-[60px] h-[80px] rounded-md overflow-hidden bg-[#1a1a1a] flex-shrink-0 relative">
                <img src={imageSrc} alt={game.title} className="w-full h-full object-cover" />
                {/* Hover olduqda ağ effekt (Epic Games stili) */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Məlumatlar */}
              <div className="flex flex-col justify-center">
                <p className="text-white text-sm font-semibold mb-1 line-clamp-1">{game.title}</p>
                
                {/* Qiymət */}
                <div className="flex items-center gap-2">
                  {game.discount && (
                    <span className="bg-[#26bbff] text-black text-[11px] font-bold px-1.5 py-0.5 rounded">
                      {game.discount}
                    </span>
                  )}
                  {game.oldPrice && (
                    <span className="text-gray-500 text-xs line-through">
                      {game.oldPrice}
                    </span>
                  )}
                  {game.newPrice && (
                    <span className="text-white text-sm">
                      {game.newPrice}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}

// Əsas komponent - 3 sütunu yan-yana qoyur
export default function GameCategories() {
  return (
    <div className="max-w-[1200px] mx-auto mt-14 px-4">
      {/* md ekranlarda yan-yana (flex-row), mobildə isə alt-alta (flex-col) olacaq */}
      <div className="flex flex-col md:flex-row gap-6 border-b border-[#2a2a2a] pb-8">
        
        <GameColumn 
          title="Epic Savings Spotlight" 
          endpoint="epic-savings" 
        />
        
        <GameColumn 
          title="Most Popular" 
          endpoint="most-popular" 
        />
        
        <GameColumn 
          title="Top Player Reviewed" 
          endpoint="top-player-reviewed" 
        />
        
      </div>
    </div>
  );
}
