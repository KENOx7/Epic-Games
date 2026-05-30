import { useEffect, useRef, useState } from "react";
import { Bookmark, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useWishlistStore } from "../store/useWishlistStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { getSlug } from "../utils/helpers";

function TopSellers() {
  const [games, setGames] = useState([])
  const [scrollIndex, setScrollIndex] = useState(0)
  const touchStart = useRef(0)
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const { t } = useLanguageStore()

  useEffect(() => {
    axios.get("https://epic-games-api-eta.vercel.app/top-sellers/category_summary.json")
      .then((res) => setGames(res.data))
  }, [])

  const sol = () => {
    let addim = 6
    if (window.innerWidth < 768) {
      addim = 2
    } else if (window.innerWidth < 1024) {
      addim = 4
    }
    let yeniIndex = scrollIndex - addim
    if (yeniIndex < 0) {
      yeniIndex = 0
    }
    setScrollIndex(yeniIndex)
  }

  const sag = () => {
    let addim = 6
    if (window.innerWidth < 768) {
      addim = 2
    } else if (window.innerWidth < 1024) {
      addim = 4
    }
    const sonuncuIndex = games.length - addim
    let yeniIndex = scrollIndex + addim
    if (yeniIndex > sonuncuIndex) {
      yeniIndex = sonuncuIndex
    }
    if (yeniIndex < 0) {
      yeniIndex = 0
    }
    setScrollIndex(yeniIndex)
  }

  const handleTouchStart = (e) => touchStart.current = e.touches[0].clientX
  const handleTouchEnd = (e) => {
    const distance = touchStart.current - e.changedTouches[0].clientX
    if (distance > 50) sag()
    if (distance < -50) sol()
  }

  return (
    <div className="max-w-[1200px] mx-auto mt-10 px-4 mb-4">
      <div className="flex items-center justify-between mb-6">
        <Link to="/browse?category=top-sellers" className="flex items-center group">
          <h2 className="text-white text-xl font-bold">{t("Top Sellers")}</h2>
          <ChevronRight className="text-white ml-1 transition-transform duration-300 group-hover:translate-x-2" />
        </Link>
        <div className="flex gap-2">
          <button onClick={sol} className="w-8 h-8 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white">‹</button>
          <button onClick={sag} className="w-8 h-8 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white">›</button>
        </div>
      </div>
      <div className="overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="flex gap-5 transition-transform duration-500 ease-out" style={{ transform: `translateX(-${scrollIndex * 198}px)` }}>
          {games.map((game) => {
            const slug = getSlug(game.title)
            const img = `https://epic-games-api-eta.vercel.app/top-sellers/${slug}/cover.jpg`
            const active = isInWishlist(game.title)
            return (
              <Link key={game.title} to={`/game/${slug}?from=top-sellers`} className="block w-[178px] flex-none group">
                <div className="relative w-full h-[238px] rounded-lg overflow-hidden bg-[#1a1a1a]">
                  <img src={img} alt={game.title} className="object-cover h-full w-full" />
                  <div className="absolute inset-0 group-hover:bg-white/10" />
                  <div className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100">
                    <button onClick={(e) => {
                      e.preventDefault()
                      toggleWishlist({ ...game, endpoint: "top-sellers" })
                    }} className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center">
                      <Bookmark size={16} className={active ? "fill-white" : ""} />
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-white text-sm font-semibold mb-1">{game.title}</p>
                  <div className="flex items-center gap-2">
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
    </div>
  )
}
export default TopSellers