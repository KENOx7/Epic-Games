import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function MostPopular() {
  const [games, setGames] = useState([]);
  const [scrollindex, setscrollindex] = useState(0);

  useEffect(() => {
    axios.get('https://epic-games-a-pi.vercel.app/most-popular/category_summary.json')
      .then((res) => setGames(res.data));
  }, []);

  const slideLeft = () => {
    const step = window.innerWidth < 768 ? 2 : 6;
    if (scrollindex > 0) {
      setscrollindex(Math.max(0, scrollindex - step));
    }
  };

  const slideRight = () => {
    const step = window.innerWidth < 768 ? 2 : 6;
    if (scrollindex < games.length - step) {
      setscrollindex(Math.min(games.length - step, scrollindex + step));
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
        <h2 className="text-white text-xl font-bold">Most Popular</h2>
        <div className="flex gap-2">
          <button onClick={slideLeft} className="w-8 h-8 rounded-full bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]">‹</button>
          <button onClick={slideRight} className="w-8 h-8 rounded-full bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]">›</button>
        </div>
      </div>
      <div className="overflow-hidden">
        <div
          className="flex gap-5 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${scrollindex * 198}px)` }}>
          {games.map((game, index) => {
            const folderName = getFolderName(game.title);
            const imageSrc = `https://epic-games-a-pi.vercel.app/most-popular/${folderName}/cover.jpg`;
            const { discount, oldPrice, newPrice } = game;

            return (
              <Link key={index} to={`/game/${folderName}?from=most-popular`} className="block flex-shrink-0 w-[178px] group">
                <div className="relative w-full h-[238px] rounded-lg overflow-hidden bg-[#1a1a1a]">
                  <img
                    src={imageSrc}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 group-hover:bg-white/10 transition-colors duration-300 pointer-events-none"></div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition">
                      <Bookmark size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-white text-sm font-semibold mb-1">
                    {game.title}
                  </p>
                  <div className="flex items-center gap-2">
                    {discount && (<span className="bg-[#26bbff] text-black text-[11px] font-bold px-1.5 py-0.5 rounded">{discount}</span>)}
                    {oldPrice && (<span className="text-gray-500 text-xs line-through">{oldPrice}</span>)}
                    {newPrice && (<span className="text-white text-sm">{newPrice}</span>)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
