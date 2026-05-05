import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';

export default function EpicSavings() {
  const [games, setGames] = useState([]);
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    fetch('/scraped_games/epic-savings/category_summary.json?')
      .then((res) => res.json())
      .then((data) => setGames(data));
  }, []);

  const slideLeft = () => {
    if (scrollIndex > 0) {
      setScrollIndex(scrollIndex - 6);
    }
  };

  const slideRight = () => {
    if (scrollIndex < games.length - 6) {
      setScrollIndex(scrollIndex + 6);
    }
  };

  const getFolderName = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <div className="max-w-[1200px] mx-auto mt-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-bold">Epic Savings Spotlight</h2>
        <div className="flex gap-2">
          <button onClick={slideLeft} className="w-8 h-8 rounded-full bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]">‹</button>
          <button onClick={slideRight} className="w-8 h-8 rounded-full bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]">›</button>
        </div>
      </div>
      <div className="overflow-hidden">
        <div
          className="flex gap-5 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${scrollIndex * 198}px)` }}>
          {games.map((game, index) => {
            const folderName = getFolderName(game.title);
            const imageSrc = `/scraped_games/epic-savings/${folderName}/cover.jpg`;
            const { discount, oldPrice, newPrice } = game;

            return (
              <div key={index} className="min-w-[178px] max-w-[178px] cursor-pointer group">
                <div className="relative w-full h-[238px] rounded-lg mb-3 bg-[#1a1a1a]">
                  <img
                    src={imageSrc}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                  <div className="absolute inset-0 group-hover:bg-white/10 transition-colors duration-300 pointer-events-none"></div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80">
                      <Bookmark size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-white text-sm mb-2 line-clamp-2 hover:text-gray-300 min-h-[40px]">{game.title}</p>
                <div className="flex items-center gap-2">
                  {discount && (<span className="bg-blue-600 text-white text-xs px-2 rounded">{discount}</span>)}
                  {oldPrice && (<span className="text-gray-500 text-sm line-through">{oldPrice}</span>)}
                  {newPrice && (<span className="text-white text-sm">{newPrice}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
