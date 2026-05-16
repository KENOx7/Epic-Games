import React, { useContext, useEffect, useState } from "react";
import { Bookmark, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { WishlistContext } from "../context/WishlistContext";

function getFolderName(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function TopPlayerReviewed() {
  const [games, setGames] = useState([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  useEffect(() => {
    axios
      .get(
        "https://epic-games-api-eta.vercel.app/top-player-reviewed/category_summary.json"
      )
      .then((res) => {
        setGames(res.data);
      });
  }, []);

  const getStep = () => {
    return window.innerWidth < 768 ? 2 : 6;
  };

  const slideLeft = () => {
    const step = getStep();
    setScrollIndex((prev) => Math.max(0, prev - step));
  };

  const slideRight = () => {
    const step = getStep();
    setScrollIndex((prev) => Math.min(games.length - step, prev + step));
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    
    if (distance > minSwipeDistance) {
      slideRight();
    }
    if (distance < -minSwipeDistance) {
      slideLeft();
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto mt-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <Link to="/browse?category=top-player-reviewed" className="flex items-center group">
          <h2 className="text-white text-xl font-bold">Top Player Reviewed</h2>
          <ChevronRight className="text-white ml-1 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

        <div className="flex gap-2">
          <button
            onClick={slideLeft}
            className="w-8 h-8 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white"
          >
            ‹
          </button>

          <button
            onClick={slideRight}
            className="w-8 h-8 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white"
          >
            ›
          </button>
        </div>
      </div>

      <div 
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex gap-5 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${scrollIndex * 198}px)` }}
        >
          {games.map((game) => {
            const folderName = getFolderName(game.title);
            const imageSrc = `https://epic-games-api-eta.vercel.app/top-player-reviewed/${folderName}/cover.jpg`;
            const inWishlist = isInWishlist(game.title);

            return (
              <Link
                key={game.title}
                to={`/game/${folderName}?from=top-player-reviewed`}
                className="block w-[178px] shrink-0 group"
              >
                <div className="relative w-full h-[238px] rounded-lg overflow-hidden bg-[#1a1a1a]">
                  <img
                    src={imageSrc}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 group-hover:bg-white/10" />
                  <div className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist({ ...game, endpoint: "top-player-reviewed" });
                      }}
                      className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center"
                    >
                      <Bookmark
                        size={16}
                        className={inWishlist ? "fill-white" : ""}
                      />
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-white text-sm font-semibold mb-1">
                    {game.title}
                  </p>

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
    </div>
  );
}