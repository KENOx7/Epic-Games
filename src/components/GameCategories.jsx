import { useEffect, useState } from "react";
import { Bookmark, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useWishlistStore } from "../store/useWishlistStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { getSlug } from "../utils/helpers";

function GameColumn({ titleKey, endpoint }) {
  const [games, setGames] = useState([])
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const { t } = useLanguageStore()

  useEffect(() => {
    axios.get(`https://epic-games-api-eta.vercel.app/${endpoint}/category_summary.json`)
      .then((res) => setGames(res.data.slice(0, 5)))
  }, [endpoint])

  return (
    <div className="flex-1 w-full md:border-r border-[#2a2a2a] last:border-0 md:pr-4 last:pr-0 mb-8 md:mb-0">
      <Link to={`/browse?category=${endpoint}`} className="flex items-center mb-4 group w-fit">
        <h3 className="text-white text-lg">{t(titleKey)}</h3>
        <ChevronRight className="text-white ml-1 transition-transform duration-300 group-hover:translate-x-2" />
      </Link>
      <div className="flex flex-col gap-3">
        {games.map((game) => {
          const slug = getSlug(game.title)
          const img = `https://epic-games-api-eta.vercel.app/${endpoint}/${slug}/cover.jpg`
          const active = isInWishlist(game.title)
          return (
            <Link key={game.title} to={`/game/${slug}?from=${endpoint}`} className="flex items-center gap-4 p-2 rounded-lg hover:bg-[#2a2a2a] group">
              <div className="relative w-[60px] h-[80px] flex-none rounded-md overflow-hidden bg-[#111]">
                <img src={img} alt={game.title} className="object-cover" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100" />
                <div className="absolute top-1 right-1 md:opacity-0 md:group-hover:opacity-100">
                  <button onClick={(e) => {
                    e.preventDefault()
                    toggleWishlist({ ...game, endpoint })
                  }} className="w-5 h-5 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center">
                    <Bookmark size={12} className={active ? "fill-white" : ""} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <p className="text-white text-sm font-semibold mb-1 line-clamp-1">{game.title}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {game.discount && <span className="bg-[#26bbff] text-black text-[12px] font-bold px-2 py-1 rounded">{game.discount}</span>}
                  {game.oldPrice && <span className="text-gray-500 text-xs line-through">{game.oldPrice}</span>}
                  {game.newPrice && <span className="text-white text-sm">{game.newPrice}</span>}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
function GameCategories() {
  return (
    <div className="max-w-[1200px] mx-auto mt-14 px-4">
      <div className="flex flex-col md:flex-row gap-6 border-b border-[#2a2a2a] pb-8">
        <GameColumn titleKey="Epic Savings Spotlight" endpoint="epic-savings" />
        <GameColumn titleKey="Most Popular" endpoint="most-popular" />
        <GameColumn titleKey="Top Player Reviewed" endpoint="top-player-reviewed" />
      </div>
    </div>
  )
}
export default GameCategories