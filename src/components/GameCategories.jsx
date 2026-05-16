import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, ChevronRight } from "lucide-react";
import axios from "axios";
import { WishlistContext } from "../context/WishlistContext";
import { LanguageContext } from "../context/LanguageContext";

function getFolderName(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function GameColumn({ title, endpoint }) {
  const [games, setGames] = useState([]);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    axios
      .get(`https://epic-games-api-eta.vercel.app/${endpoint}/category_summary.json`)
      .then((res) => {
        setGames(res.data.slice(0, 5));
      });
  }, [endpoint]);

  return (
    <div className="flex-1 w-full md:border-r border-[#2a2a2a] last:border-0 md:pr-4 last:pr-0 mb-8 md:mb-0">
      <Link
        to={`/browse?category=${endpoint}`}
        className="flex items-center mb-4 group w-fit"
      >
        <h3 className="text-white text-lg">{t(title)}</h3>
        <ChevronRight className="text-white ml-1 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>

      <div className="flex flex-col gap-3">
        {games.map((game) => {
          const folderName = getFolderName(game.title);
          const imageSrc = `https://epic-games-api-eta.vercel.app/${endpoint}/${folderName}/cover.jpg`;
          const inWishlist = isInWishlist(game.title);

          return (
            <Link
              key={game.title}
              to={`/game/${folderName}?from=${endpoint}`}
              className="flex items-center gap-4 hover:bg-[#2a2a2a] p-2 rounded-lg group"
            >
              <div className="w-[60px] h-[80px] rounded-md overflow-hidden bg-[#111] shrink-0 relative">
                <img
                  src={imageSrc}
                  alt={game.title}
                  className="w-full h-full object-contain"
                />

                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100" />

                <div className="absolute top-1 right-1 md:opacity-0 md:group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist({ ...game, endpoint });
                    }}
                    className="w-5 h-5 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center"
                  >
                    <Bookmark
                      size={12}
                      className={inWishlist ? "fill-white" : ""}
                    />
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <p className="text-white text-sm font-semibold mb-1 line-clamp-1">
                  {game.title}
                </p>

                <div className="flex items-center gap-2 flex-wrap">
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

export default function GameCategories() {
  return (
    <div className="max-w-[1200px] mx-auto mt-14 px-4">
      <div className="flex flex-col md:flex-row gap-6 border-b border-[#2a2a2a] pb-8">
        <GameColumn title="Epic Savings Spotlight" endpoint="epic-savings" />
        <GameColumn title="Most Popular" endpoint="most-popular" />
        <GameColumn title="Top Player Reviewed" endpoint="top-player-reviewed" />
      </div>
    </div>
  );
}