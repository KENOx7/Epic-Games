import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift } from 'lucide-react';
import axios from 'axios';

const MYSTERY_IMAGE = 'https://cdn1.epicgames.com/offer/d5241c76f178492ea1540fce45616757/image24_1200x1600-22d04473c1b145ca885d2867c05f5ea3?resize=1&w=360&h=480&quality=medium';
const UNLOCK_DATE = new Date('2026-05-14T19:00:00');

function useCountdown(target) {
  function calc() {
    const diff = target - Date.now();
    if (diff <= 0) return '00:00:00:00';
    
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    
    return [d, h, m, s].map(n => String(n).padStart(2, '0')).join(':');
  }

  const [time, setTime] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);

  return time;
}

function toSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function FreeGames() {
  const [games, setGames] = useState([]);
  const countdown = useCountdown(UNLOCK_DATE);

  useEffect(() => {
    axios.get('https://epic-games-a-pi.vercel.app/free/category_summary.json')
      .then(res => setGames(res.data))
      .catch(err => console.error("Failed to load free games:", err));
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto mt-10 px-4">
      <div className="bg-[#18181c] rounded-2xl p-6 md:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Gift size={20} className="text-white" />
            <h2 className="text-white text-lg font-bold">Free Games</h2>
          </div>
          <a
            href="https://store.epicgames.com/en-US/free-games"
            target="_blank"
            rel="noreferrer"
            className="text-white text-sm px-4 py-1.5 border border-[#3a3a3a] rounded transition hover:bg-white/10"
          >
            View More
          </a>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          
          {/* Active Free Games */}
          {games.map((game, idx) => {
            const slug = toSlug(game.title);
            const cover = `/scraped_games/free/${slug}/cover.jpg`;
            
            return (
              <Link key={idx} to={`/game/${slug}?from=free`} className="block group">
                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-[#1a1a1a]">
                  <img
                    src={cover}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 group-hover:bg-white/10 transition-colors duration-300 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 right-0 bg-[#26bbff] text-black text-[11px] font-bold text-center py-1.5 uppercase">
                    FREE NOW
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-white text-sm font-semibold mb-1">
                    {game.title}
                  </p>
                  <p className="text-[#aaa] text-xs">
                    Free Now - May 14 at 07:00 PM
                  </p>
                </div>
              </Link>
            );
          })}

          {/* Upcoming Mystery Games */}
          {[0, 1].map(i => (
            <div key={`mystery-${i}`} className="cursor-default">
              <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-[#1a1a1a]">
                <img
                  src={MYSTERY_IMAGE}
                  alt="Mystery Game"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[11px] font-bold text-center py-1.5 uppercase">
                  MYSTERY GAME
                </div>
              </div>
              <div className="mt-3">
                <p className="text-white text-sm font-semibold mb-1">
                  Mystery Game
                </p>
                <p className="text-[#26bbff] text-xs">
                  Unlocking in {countdown}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
