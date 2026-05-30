import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Bookmark, ChevronDown, Search, X, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useWishlistStore } from "../store/useWishlistStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { getSlug, getPrice } from "../utils/helpers";

const categories = [
  { key: "top-sellers", label: "Top Sellers", url: "https://epic-games-api-eta.vercel.app/top-sellers/category_summary.json" },
  { key: "epic-savings", label: "Epic Savings", url: "https://epic-games-api-eta.vercel.app/epic-savings/category_summary.json" },
  { key: "most-popular", label: "Most Popular", url: "https://epic-games-api-eta.vercel.app/most-popular/category_summary.json" },
  { key: "top-player-reviewed", label: "Top Player Reviewed", url: "https://epic-games-api-eta.vercel.app/top-player-reviewed/category_summary.json" }
]

const popularGenres = [
  { name: "Action", title: "Action Games" },
  { name: "Action-Adventure", title: "Action-Adventure Games" },
  { name: "Adventure", title: "Adventure Games" },
  { name: "RPG", title: "RPG" },
  { name: "Simulation", title: "Simulation" }
]

const priceFilters = ["Free", "Under $5.00", "Under $10.00", "Under $20.00", "Under $30.00", "$14.99 and above", "Discounted"]

const genreFilters = [
  "Action", "Action-Adventure", "Adventure", "Card Game", "Casual", "City Builder", "Comedy", "Dungeon Crawler",
  "Exploration", "Fantasy", "Fighting", "First Person", "Horror", "Indie", "Music", "Narration", "Open World",
  "Platformer", "Puzzle", "Racing", "Retro", "Rhythm", "Rogue-Lite", "RPG", "Shooter", "Simulation", "Sports",
  "Stealth", "Strategy", "Survival", "Turn-Based", "Turn-Based Strategy"
]

const featureFilters = ["Achievements", "Cloud Saves", "Co-op", "Competitive", "Controller Support", 
  "Cross Platform", "Local Multiplayer", "Multiplayer", "Online Multiplayer", "Single Player", "VR"]

const platformFilters = ["Mac OS", "Windows", "Linux"]


const getDate = (date) => {
  const [month, day, year] = date.split("/").map(Number)
  return new Date(2000 + year, month - 1, day)
}

const priceMatches = (game, filter) => {
  const price = getPrice(game.newPrice)
  if (filter == "Free") return price == 0
  if (filter == "Discounted") {
    if (game.discount) return true
    return false
  }
  if (filter == "Under $5.00") return price > 0 && price < 5
  if (filter == "Under $10.00") return price > 0 && price < 10
  if (filter == "Under $20.00") return price > 0 && price < 20
  if (filter == "Under $30.00") return price > 0 && price < 30
  if (filter == "$14.99 and above") return price >= 14.99
}

const PopularGenresSlider = ({ games, setFilters, t }) => {
  const openGenre = (genre) => {
    setFilters((prev) => ({ ...prev, genre: [genre] }))
    window.scrollTo({ top: 420, behavior: "smooth" })
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 mt-8">
      <h2 className="text-xl font-bold text-white mb-4">{t("popularGenres")}</h2>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
        {popularGenres.map((genre) => {
          const genreGames = games.filter((game) => game.genres.includes(genre.name)).slice(0, 3)
          const covers = genreGames.map((game) => `https://epic-games-api-eta.vercel.app/${game.endpoint}/${getSlug(game.title)}/cover.jpg`)
          return (
            <div key={genre.name} onClick={() => openGenre(genre.name)} className="min-w-[180px] md:min-w-0 md:flex-1 bg-[#202024] hover:bg-[#2a2a30] rounded-xl p-4 cursor-pointer">
              <div className="relative h-[140px] md:h-[150px] mb-3">
                <div className="absolute left-0 top-5 w-[58%] h-[115px] rounded-md overflow-hidden bg-[#101014] opacity-60">
                  <img src={covers[1]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="absolute right-0 top-5 w-[58%] h-[115px] rounded-md overflow-hidden bg-[#101014] opacity-60">
                  <img src={covers[2]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="absolute left-1/2 top-0 -translate-x-1/2 z-10 w-[62%] h-[130px] rounded-md overflow-hidden bg-[#101014]">
                  <img src={covers[0]} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
              <p className="text-white text-center text-sm font-semibold">{t(genre.title)}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const SortDropdown = ({ value, onChange, t }) => {
  const [open, setOpen] = useState(false)
  const options = [
    { value: "all", label: t("all") },
    { value: "new-release", label: t("newRelease") },
    { value: "alphabetical", label: t("alphabetical") },
    { value: "price-high", label: t("priceHighToLow") },
    { value: "price-low", label: t("priceLowToHigh") }
  ]
  const selectedLabel = options.find((i) => i.value == value).label

  return (
    <div className="relative z-[10]">
      <button onClick={() => setOpen(!open)} 
        className="flex items-center justify-between min-w-[140px] gap-2 bg-[#202024] hover:bg-[#2a2a30] transition-colors text-white text-sm px-3 py-2 rounded-md outline-none cursor-pointer">
        <span>{selectedLabel}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div>
          <div className="fixed inset-0 z-0" onClick={() => setOpen(false)}></div>
          <div className="absolute top-full left-0 md:right-0 md:left-auto mt-1 w-full md:w-44 bg-[#202024] rounded-md shadow-xl py-1 z-10 border border-[#303036]">
            {options.map((opt) => (
              <div key={opt.value} onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
                className={`px-4 py-2 text-sm cursor-pointer ${value == opt.value ? 'text-white bg-[#303036]' : 'text-gray-300 hover:text-white hover:bg-[#2a2a30]'}`}>{opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const Browse = () => {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get("category")
  let keywordParam = searchParams.get("keyword")
  if (!keywordParam) keywordParam = ""
  const priceParam = searchParams.get("price")
  let categoryList = []
  let priceList = []
  if (categoryParam) categoryList = [categoryParam]
  if (priceParam) priceList = [priceParam]
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("all")
  const [keyword, setKeyword] = useState(keywordParam)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    category: categoryList,
    price: priceList,
    genre: [], features: [], platform: []
  })

  const [catOpen, setCatOpen] = useState(categoryParam ? true : false)
  const [priceOpen, setPriceOpen] = useState(priceParam ? true : false)
  const [genreOpen, setGenreOpen] = useState(false)
  const [featOpen, setFeatOpen] = useState(false)
  const [platOpen, setPlatOpen] = useState(false)
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const { t } = useLanguageStore()

  useEffect(() => setKeyword(keywordParam), [keywordParam])

  useEffect(() => {
    let category = []
    let price = []
    if (categoryParam) category = [categoryParam]
    if (priceParam) price = [priceParam]
    setFilters((prev) => ({ ...prev, category, price }))
  }, [categoryParam, priceParam])

  useEffect(() => { document.body.style.overflow = mobileFilterOpen ? "hidden" : "auto" }, [mobileFilterOpen])

  useEffect(() => {
    const loadGames = async () => {
      const requests = categories.map((item) =>
        axios.get(item.url).then((res) => res.data.map((game) => ({ ...game, endpoint: item.key })))
      )
      const data = await Promise.all(requests)
      const list = data.flat()
      const tekOyun = list.filter((game, i) => list.findIndex((item) => item.title == game.title) == i)
      setGames(tekOyun)
      setLoading(false)
    }
    loadGames()
  }, [])

  useEffect(() => setCurrentPage(1), [keyword, sortBy, filters])
  
  const toggleFilter = (name, value) => {setFilters(prev => ({...prev,
      [name]: prev[name].includes(value) ? prev[name].filter(item => item != value) : [...prev[name], value],
    }))
  }

  // search ve filtr
  const searchText = keyword.trim().toLowerCase()
  const shownGames = games.filter((game) => {
    if (searchText) {
      const title = game.title.toLowerCase()
      const developer = game.developer.toLowerCase()
      const publisher = game.publisher.toLowerCase()
      if (!title.includes(searchText) && !developer.includes(searchText) && !publisher.includes(searchText)) return false
    }
    if (filters.category.length && !filters.category.includes(game.endpoint)) return false
    if (filters.price.length && !filters.price.some((i) => priceMatches(game, i))) return false
    if (filters.genre.length && !game.genres.some((i) => filters.genre.includes(i))) return false
    if (filters.features.length && !game.features.some((i) => filters.features.includes(i))) return false
    if (filters.platform.length && !filters.platform.includes(game.platform)) return false
    return true
  })
  const sortMethods = {
    "alphabetical": (a, b) => a.title.localeCompare(b.title),
    "price-high":   (a, b) => getPrice(b.newPrice) - getPrice(a.newPrice),
    "price-low":    (a, b) => getPrice(a.newPrice) - getPrice(b.newPrice),
    "new-release":  (a, b) => getDate(b.releaseDate) - getDate(a.releaseDate)
  }
  let sortedGames = shownGames
  if (sortBy != "all") {
    sortedGames = [...shownGames].sort(sortMethods[sortBy])
  }

  const perPage = 20
  const totalPages = Math.ceil(sortedGames.length / perPage)
  const firstGame = (currentPage - 1) * perPage
  const paginatedGames = sortedGames.slice(firstGame, firstGame + perPage)
  const pageStart = Math.max(1, currentPage - 2)
  const pageEnd = Math.min(totalPages, pageStart + 4)
  const pages = Array.from({ length: pageEnd - pageStart + 1 }, (_, i) => pageStart + i)
  const changePage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div>
      <PopularGenresSlider games={games} setFilters={setFilters} t={t} />
      <div className="max-w-[1200px] mx-auto mt-8 px-4 flex flex-col md:flex-row gap-8 pb-20">
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-[100] bg-[#121214] overflow-y-auto md:hidden">
            <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-[#202024]">
              <h3 className="text-white text-lg font-bold">{t("filters")}</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="text-gray-400 hover:text-white">
                <X size={22} />
              </button>
            </div>
            <div className="px-4 pt-4 pb-10">
              {/* MOBİL FİLTR */}
              <div>
                <div className="flex items-center gap-2 bg-[#202024] rounded-md px-3 mb-6">
                  <Search size={16} className="text-gray-400 min-w-max" />
                  <input type="text" placeholder={t("keywords")} value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full bg-transparent text-sm text-white py-3 outline-none placeholder:text-gray-400" />
                </div>
                <div className="border-b border-[#202024] py-4">
                  <button onClick={() => setCatOpen(!catOpen)} className="w-full flex items-center justify-between text-white hover:text-gray-300">
                    <span className="text-sm font-semibold">{t("category")}</span>
                    <ChevronDown size={18} className={catOpen ? "transition-transform duration-200 rotate-180" : "transition-transform duration-200"} />
                  </button>
                  {catOpen && (
                    <div className="flex flex-col gap-3 mt-4">
                      {categories.map((c) => (
                        <label key={c.key} className="flex items-center gap-3 cursor-pointer select-none">
                          <input type="checkbox" checked={filters.category.includes(c.key)} onChange={() => toggleFilter("category", c.key)} />
                          <span className="text-gray-300 text-sm">{t(c.label)}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <div className="border-b border-[#202024] py-4">
                  <button onClick={() => setPriceOpen(!priceOpen)} className="w-full flex items-center justify-between text-white hover:text-gray-300">
                    <span className="text-sm font-semibold">{t("price")}</span>
                    <ChevronDown size={18} className={priceOpen ? "transition-transform duration-200 rotate-180" : "transition-transform duration-200"} />
                  </button>
                  {priceOpen && (
                    <div className="flex flex-col gap-3 mt-4">
                      {priceFilters.map((p) => (
                        <label key={p} className="flex items-center gap-3 cursor-pointer select-none">
                          <input type="checkbox" checked={filters.price.includes(p)} onChange={() => toggleFilter("price", p)} />
                          <span className="text-gray-300 text-sm">{t(p)}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <div className="border-b border-[#202024] py-4">
                  <button onClick={() => setGenreOpen(!genreOpen)} className="w-full flex items-center justify-between text-white hover:text-gray-300">
                    <span className="text-sm font-semibold">{t("genre")}</span>
                    <ChevronDown size={18} className={genreOpen ? "transition-transform duration-200 rotate-180" : "transition-transform duration-200"} />
                  </button>
                  {genreOpen && (
                    <div className="flex flex-col gap-3 mt-4">
                      {genreFilters.map((g) => (
                        <label key={g} className="flex items-center gap-3 cursor-pointer select-none">
                          <input type="checkbox" checked={filters.genre.includes(g)} onChange={() => toggleFilter("genre", g)} />
                          <span className="text-gray-300 text-sm">{t(g)}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <div className="border-b border-[#202024] py-4">
                  <button onClick={() => setFeatOpen(!featOpen)} className="w-full flex items-center justify-between text-white hover:text-gray-300">
                    <span className="text-sm font-semibold">{t("features")}</span>
                    <ChevronDown size={18} className={featOpen ? "transition-transform duration-200 rotate-180" : "transition-transform duration-200"} />
                  </button>
                  {featOpen && (
                    <div className="flex flex-col gap-3 mt-4">
                      {featureFilters.map((f) => (
                        <label key={f} className="flex items-center gap-3 cursor-pointer select-none">
                          <input type="checkbox" checked={filters.features.includes(f)} onChange={() => toggleFilter("features", f)} />
                          <span className="text-gray-300 text-sm">{t(f)}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <div className="border-b border-[#202024] py-4">
                  <button onClick={() => setPlatOpen(!platOpen)} className="w-full flex items-center justify-between text-white hover:text-gray-300">
                    <span className="text-sm font-semibold">{t("platform")}</span>
                    <ChevronDown size={18} className={platOpen ? "transition-transform duration-200 rotate-180" : "transition-transform duration-200"} />
                  </button>
                  {platOpen && (
                    <div className="flex flex-col gap-3 mt-4">
                      {platformFilters.map((p) => (
                        <label key={p} className="flex items-center gap-3 cursor-pointer select-none">
                          <input type="checkbox" checked={filters.platform.includes(p)} onChange={() => toggleFilter("platform", p)} />
                          <span className="text-gray-300 text-sm">{t(p)}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => setMobileFilterOpen(false)} className="mt-6 w-full bg-white text-black font-semibold py-3 rounded-lg text-sm">
                {t("showResults")}
              </button>
            </div>
          </div>
        )}
        {/* PC FİLTR */}
        <div className="hidden md:block md:w-[240px] md:order-2">
          <h3 className="text-white text-lg font-bold mb-4">{t("filters")}</h3>
          <div>
            <div className="flex items-center gap-2 bg-[#202024] rounded-md px-3 mb-6">
              <Search size={16} className="text-gray-400 min-w-max" />
              <input type="text" placeholder={t("keywords")} value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full bg-transparent text-sm text-white py-3 outline-none placeholder:text-gray-400" />
            </div>
            <div className="border-b border-[#202024] py-4">
              <button onClick={() => setCatOpen(!catOpen)} className="w-full flex items-center justify-between text-white hover:text-gray-300">
                <span className="text-sm font-semibold">{t("category")}</span>
                <ChevronDown size={18} className={catOpen ? "transition-transform duration-200 rotate-180" : "transition-transform duration-200"} />
              </button>
              {catOpen && (
                <div className="flex flex-col gap-3 mt-4">
                  {categories.map((c) => (
                    <label key={c.key} className="flex items-center gap-3 cursor-pointer select-none">
                      <input type="checkbox" checked={filters.category.includes(c.key)} onChange={() => toggleFilter("category", c.key)} />
                      <span className="text-gray-300 text-sm">{t(c.label)}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="border-b border-[#202024] py-4">
              <button onClick={() => setPriceOpen(!priceOpen)} className="w-full flex items-center justify-between text-white hover:text-gray-300">
                <span className="text-sm font-semibold">{t("price")}</span>
                <ChevronDown size={18} className={priceOpen ? "transition-transform duration-200 rotate-180" : "transition-transform duration-200"} />
              </button>
              {priceOpen && (
                <div className="flex flex-col gap-3 mt-4">
                  {priceFilters.map((p) => (
                    <label key={p} className="flex items-center gap-3 cursor-pointer select-none">
                      <input type="checkbox" checked={filters.price.includes(p)} onChange={() => toggleFilter("price", p)} />
                      <span className="text-gray-300 text-sm">{t(p)}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="border-b border-[#202024] py-4">
              <button onClick={() => setGenreOpen(!genreOpen)} className="w-full flex items-center justify-between text-white hover:text-gray-300">
                <span className="text-sm font-semibold">{t("genre")}</span>
                <ChevronDown size={18} className={genreOpen ? "transition-transform duration-200 rotate-180" : "transition-transform duration-200"} />
              </button>
              {genreOpen && (
                <div className="flex flex-col gap-3 mt-4">
                  {genreFilters.map((g) => (
                    <label key={g} className="flex items-center gap-3 cursor-pointer select-none">
                      <input type="checkbox" checked={filters.genre.includes(g)} onChange={() => toggleFilter("genre", g)} />
                      <span className="text-gray-300 text-sm">{t(g)}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="border-b border-[#202024] py-4">
              <button onClick={() => setFeatOpen(!featOpen)} className="w-full flex items-center justify-between text-white hover:text-gray-300">
                <span className="text-sm font-semibold">{t("features")}</span>
                <ChevronDown size={18} className={featOpen ? "transition-transform duration-200 rotate-180" : "transition-transform duration-200"} />
              </button>
              {featOpen && (
                <div className="flex flex-col gap-3 mt-4">
                  {featureFilters.map((f) => (
                    <label key={f} className="flex items-center gap-3 cursor-pointer select-none">
                      <input type="checkbox" checked={filters.features.includes(f)} onChange={() => toggleFilter("features", f)} />
                      <span className="text-gray-300 text-sm">{t(f)}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="border-b border-[#202024] py-4">
              <button onClick={() => setPlatOpen(!platOpen)} className="w-full flex items-center justify-between text-white hover:text-gray-300">
                <span className="text-sm font-semibold">{t("platform")}</span>
                <ChevronDown size={18} className={platOpen ? "transition-transform duration-200 rotate-180" : "transition-transform duration-200"} />
              </button>
              {platOpen && (
                <div className="flex flex-col gap-3 mt-4">
                  {platformFilters.map((p) => (
                    <label key={p} className="flex items-center gap-3 cursor-pointer select-none">
                      <input type="checkbox" checked={filters.platform.includes(p)} onChange={() => toggleFilter("platform", p)} />
                      <span className="text-gray-300 text-sm">{t(p)}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 md:order-1">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-gray-400 text-sm">{t("show")}</span>
            <SortDropdown value={sortBy} onChange={setSortBy} t={t} />
            <button onClick={() => setMobileFilterOpen(true)} className="md:hidden ml-auto flex items-center gap-2 bg-[#202024] text-white text-sm px-3 py-2 rounded-md">
              <SlidersHorizontal size={15} />
              {t("filters")}
            </button>
          </div>
          {keyword && <p className="text-gray-400 text-sm mb-5">{t("resultsFor")} <span className="text-white">"{keyword}"</span></p>}
          {loading ? (
            <div className="text-white text-center py-20">{t("loading")}</div>
          ) : sortedGames.length == 0 ? (
            <div className="text-gray-400 text-center py-20">{t("noGamesFound")}</div>
          ) : (
            <div>
              <div className="flex flex-wrap gap-4">
                {paginatedGames.map((game) => {
                  const folderName = getSlug(game.title)
                  const imageSrc = `https://epic-games-api-eta.vercel.app/${game.endpoint}/${folderName}/cover.jpg`
                  const inWishlist = isInWishlist(game.title)
                  return (
                    <Link key={game.title} to={`/game/${folderName}?from=${game.endpoint}`} className="w-[47%] sm:w-[31%] md:w-[23%] group">
                      <div className="relative w-full rounded-lg overflow-hidden bg-[#1a1a1a]">
                        <img src={imageSrc} alt={game.title} className="w-full h-full object-contain" />
                        <div className="absolute inset-0 group-hover:bg-white/10"></div>
                        <div className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100">
                          <button onClick={(e) => {
                            e.preventDefault()
                            toggleWishlist(game)
                          }} className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center">
                            <Bookmark size={16} className={inWishlist ? "fill-white" : ""} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-gray-400 text-[12px] uppercase font-semibold mb-1">{t("baseGame")}</p>
                        <p className="text-white text-sm font-semibold mb-1">{game.title}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {game.discount && <span className="bg-[#26bbff] text-black text-[12px] font-bold px-2 py-1 rounded">{game.discount}</span>}
                          {game.oldPrice && <span className="text-gray-500 text-xs line-through">{game.oldPrice}</span>}
                          {game.newPrice && <span className="text-white text-sm">{game.newPrice}</span>}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button onClick={() => changePage(Math.max(1, currentPage - 1))} disabled={currentPage == 1} className="w-10 h-10 rounded-md text-white disabled:opacity-40 flex items-center justify-center">
                    <ChevronLeft size={20} />
                  </button>
                  {pages.map((page) => (
                    <button key={page} onClick={() => changePage(page)} className={currentPage == page ? "w-10 h-10 rounded-md text-sm bg-[#202024] text-white" : "w-10 h-10 rounded-md text-sm text-gray-400 hover:text-white"}>
                      {page}
                    </button>
                  ))}
                  <button onClick={() => changePage(Math.min(totalPages, currentPage + 1))} disabled={currentPage == totalPages} className="w-10 h-10 rounded-md text-white disabled:opacity-40 flex items-center justify-center">
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default Browse
