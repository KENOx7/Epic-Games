import { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLanguageStore } from "../store/useLanguageStore";
import { getSlug } from "../utils/helpers";

const mysteryImage = "https://cdn1.epicgames.com/offer/d5241c76f178492ea1540fce45616757/image24_1200x1600-22d04473c1b145ca885d2867c05f5ea3?resize=1&w=360&h=480&quality=medium"
const unlockDate = new Date("2026-06-01T19:00:00")

function FreeGames() {
  const [games, setGames] = useState([])
  const [time, setTime] = useState("00:00:00:00")
  const { t } = useLanguageStore()

  useEffect(() => {
    axios.get("https://epic-games-api-eta.vercel.app/free/category_summary.json")
      .then((res) => setGames(res.data))
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const left = unlockDate - Date.now()
      if (left <= 0) {
        setTime("00:00:00:00")
        return
      }
      const day = Math.floor(left / 86400000)
      const hour = Math.floor((left % 86400000) / 3600000)
      const minute = Math.floor((left % 3600000) / 60000)
      const second = Math.floor((left % 60000) / 1000)
      setTime([day, hour, minute, second].map((item) => item.toString()).join(":"))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const gizliOyun = [1, 2]

  return (
    <div className="max-w-[1200px] mx-auto mt-10 px-4">
      <div className="bg-[#18181c] rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Gift size={20} className="text-white" />
            <h2 className="text-white text-lg font-bold">{t("freeGames")}</h2>
          </div>
          <Link to="/browse?price=Free" className="text-white text-sm px-4 py-2 border border-[#3a3a3a] rounded hover:bg-white/10">
            {t("viewMore")}
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {games.map((game) => {
            const slug = getSlug(game.title)
            const cover = `https://epic-games-api-eta.vercel.app/free/${slug}/cover.jpg`
            return (
              <Link key={game.title} to={`/game/${slug}?from=free`} className="block">
                <div className="relative w-full rounded-lg bg-[#1a1a1a]">
                  <img src={cover} alt={game.title} className="w-full h-full object-contain" />
                  <div className="absolute inset-0 hover:bg-white/10" />
                  <div className="absolute bottom-0 left-0 right-0 bg-[#26bbff] text-black text-[12px] font-bold text-center py-2 uppercase">
                    {t("freeNow")}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-white text-sm font-semibold mb-1">{game.title}</p>
                  <p className="text-[#aaa] text-xs">{t("freeNow")} - May 14 at 07:00 PM</p>
                </div>
              </Link>
            )
          })}
          {gizliOyun.map((item) => (
            <div key={item} className="cursor-default">
              <div className="relative w-full rounded-lg bg-[#1a1a1a]">
                <img src={mysteryImage} alt="Mystery Game" className="w-full h-full object-contain" />
                <div className="absolute bg-black/40" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[12px] font-bold text-center py-2 uppercase">
                  {t("mysteryGame")}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-white text-sm font-semibold mb-1">{t("mysteryGame")}</p>
                <p className="text-[#26bbff] text-xs">{t("unlockingIn")} {time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default FreeGames