import React, { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLanguageStore } from "../store/useLanguageStore";

const MYSTERY_IMAGE = "https://cdn1.epicgames.com/offer/d5241c76f178492ea1540fce45616757/image24_1200x1600-22d04473c1b145ca885d2867c05f5ea3?resize=1&w=360&h=480&quality=medium"
const UNLOCK_DATE = new Date("2026-05-23T19:00:00")

function useCountdown(targetDate) {
  const getTime = () => {
    const zaman = targetDate - Date.now()
    if (zaman <= 0) { return "00:00:00:00" }
    const gun = Math.floor(zaman / 86400000)
    const saat = Math.floor((zaman % 86400000) / 3600000)
    const deqiqe = Math.floor((zaman % 3600000) / 60000)
    const saniye = Math.floor((zaman % 60000) / 1000)
    return [gun, saat, deqiqe, saniye].map((item) => item.toString()).join(":")
  }
  const [time, setTime] = useState(getTime)
  useEffect(() => {
    const timer = setInterval(() => {setTime(getTime())}, 1000)
    return () => clearInterval(timer)}, [targetDate])
  return time
}

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function FreeGames() {
  const [games, setGames] = useState([])
  const countdown = useCountdown(UNLOCK_DATE)
  const { t } = useLanguageStore()

  useEffect(() => {
    axios
      .get("https://epic-games-api-eta.vercel.app/free/category_summary.json")
      .then((res) => {
        setGames(res.data)
      })
  }, [])

  return (
    <div className="max-w-[1200px] mx-auto mt-10 px-4">
      <div className="bg-[#18181c] rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Gift size={20} className="text-white" />
            <h2 className="text-white text-lg font-bold">{t("freeGames")}</h2>
          </div>
          <Link to="/browse?price=Free" className="text-white text-sm px-4 py-1.5 border border-[#3a3a3a] rounded hover:bg-white/10">
            {t("viewMore")}
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {games.map((game) => {
            const slug = toSlug(game.title)
            const cover = `https://epic-games-api-eta.vercel.app/free/${slug}/cover.jpg`
            return (
              <Link key={game.title} to={`/game/${slug}?from=free`} className="block">
                <div className="relative w-full rounded-lg bg-[#1a1a1a]">
                  <img src={cover} alt={game.title} className="w-full h-full object-contain" />
                  <div className="absolute inset-0 hover:bg-white/10" />
                  <div className="absolute bottom-0 left-0 right-0 bg-[#26bbff] text-black text-[11px] font-bold text-center py-1.5 uppercase">
                    {t("freeNow")}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-white text-sm font-semibold mb-1">{game.title}</p>
                  <p className="text-[#aaa] text-xs">{t("freeNow")} - May 14 at 07:00 PM</p>
                </div>
              </Link>
            );
          })}
          <div className="cursor-default">
            <div className="relative w-full rounded-lg bg-[#1a1a1a]">
              <img src={MYSTERY_IMAGE} alt="Mystery Game" className="w-full h-full object-contain" />
              <div className="absolute bg-black/40" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[11px] font-bold text-center py-1.5 uppercase">
                {t("mysteryGame")}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-white text-sm font-semibold mb-1">{t("mysteryGame")}</p>
              <p className="text-[#26bbff] text-xs">{t("unlockingIn")} {countdown}</p>
            </div>
          </div>
          <div className="cursor-default">
            <div className="relative w-full rounded-lg bg-[#1a1a1a]">
              <img src={MYSTERY_IMAGE} alt="Mystery Game" className="w-full h-full object-contain" />
              <div className="absolute bg-black/40" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[11px] font-bold text-center py-1.5 uppercase">
                {t("mysteryGame")}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-white text-sm font-semibold mb-1">{t("mysteryGame")}</p>
              <p className="text-[#26bbff] text-xs">{t("unlockingIn")} {countdown}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreeGames