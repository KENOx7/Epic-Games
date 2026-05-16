import React, { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { WishlistContext } from "../context/WishlistContext";

const categories = [
  {
    key: "top-sellers",
    label: "Top Sellers",
    url: "https://epic-games-api-eta.vercel.app/top-sellers/category_summary.json",
  },
  {
    key: "epic-savings",
    label: "Epic Savings",
    url: "https://epic-games-api-eta.vercel.app/epic-savings/category_summary.json",
  },
  {
    key: "most-popular",
    label: "Most Popular",
    url: "https://epic-games-api-eta.vercel.app/most-popular/category_summary.json",
  },
  {
    key: "top-player-reviewed",
    label: "Top Player Reviewed",
    url: "https://epic-games-api-eta.vercel.app/top-player-reviewed/category_summary.json",
  },
];

const popularGenres = [
  { name: "Action", title: "Action Games" },
  { name: "Action-Adventure", title: "Action-Adventure Games" },
  { name: "Adventure", title: "Adventure Games" },
  { name: "RPG", title: "RPG" },
  { name: "Simulation", title: "Simulation" },
];

const priceFilters = [
  "Free",
  "Under $5.00",
  "Under $10.00",
  "Under $20.00",
  "Under $30.00",
  "$14.99 and above",
  "Discounted",
];

const genreFilters = [
  "Action",
  "Action-Adventure",
  "Adventure",
  "Card Game",
  "Casual",
  "City Builder",
  "Comedy",
  "Dungeon Crawler",
  "Exploration",
  "Fantasy",
  "Fighting",
  "First Person",
  "Horror",
  "Indie",
  "Music",
  "Narration",
  "Open World",
  "Platformer",
  "Puzzle",
  "Racing",
  "Retro",
  "Rhythm",
  "Rogue-Lite",
  "RPG",
  "Shooter",
  "Simulation",
  "Sports",
  "Stealth",
  "Strategy",
  "Survival",
  "Turn-Based",
  "Turn-Based Strategy",
];

const featureFilters = [
  "Achievements",
  "Cloud Saves",
  "Co-op",
  "Competitive",
  "Controller Support",
  "Cross Platform",
  "Local Multiplayer",
  "Multiplayer",
  "Online Multiplayer",
  "Single Player",
  "VR",
];

const platformFilters = ["Mac OS", "Windows", "Linux"];

const fallbackCover =
  "https://epic-games-api-eta.vercel.app/most-popular/grand-theft-auto-v/cover.jpg";

function getFolderName(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getPrice(price) {
  if (!price || price === "Free") {
    return 0;
  }

  const number = price.replace(/,/g, "").match(/[\d.]+/);
  return number ? Number(number[0]) : 0;
}

function getDate(date) {
  if (!date) {
    return 0;
  }

  const [month, day, year] = date.split("/").map(Number);
  return new Date(2000 + year, month - 1, day);
}

function priceMatches(game, filter) {
  const price = getPrice(game.newPrice);

  if (filter === "Free") return price === 0;
  if (filter === "Discounted") return game.discount;
  if (filter === "Under $5.00") return price > 0 && price < 5;
  if (filter === "Under $10.00") return price > 0 && price < 10;
  if (filter === "Under $20.00") return price > 0 && price < 20;
  if (filter === "Under $30.00") return price > 0 && price < 30;
  if (filter === "$14.99 and above") return price >= 14.99;

  return false;
}

function PopularGenresSlider({ games, setFilters }) {
  const openGenre = (genre) => {
    setFilters((prev) => ({
      ...prev,
      genre: [genre],
    }));

    window.scrollTo({
      top: 420,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 mt-8">
      <h2 className="text-xl font-bold text-white mb-4">Popular Genres</h2>

      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
        {popularGenres.map((genre) => {
          const genreGames = games
            .filter((game) => game.genres?.includes(genre.name))
            .slice(0, 3);

          const covers = genreGames.map((game) => {
            const folderName = getFolderName(game.title);
            return `https://epic-games-api-eta.vercel.app/${game.endpoint}/${folderName}/cover.jpg`;
          });

          const cover1 = covers[0] || fallbackCover;
          const cover2 = covers[1] || fallbackCover;
          const cover3 = covers[2] || fallbackCover;

          return (
            <div
              key={genre.name}
              onClick={() => openGenre(genre.name)}
              className="min-w-[180px] md:min-w-0 md:flex-1 bg-[#202024] hover:bg-[#2a2a30] rounded-xl p-4 cursor-pointer"
            >
              <div className="relative h-[140px] md:h-[150px] mb-3">
                <div className="absolute left-0 top-5 w-[58%] h-[115px] rounded-md overflow-hidden bg-[#101014] opacity-60">
                  <img
                    src={cover2}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute right-0 top-5 w-[58%] h-[115px] rounded-md overflow-hidden bg-[#101014] opacity-60">
                  <img
                    src={cover3}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute left-1/2 top-0 -translate-x-1/2 z-10 w-[62%] h-[130px] rounded-md overflow-hidden bg-[#101014]">
                  <img
                    src={cover1}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <p className="text-white text-center text-sm font-semibold">
                {genre.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Browse() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const keywordParam = searchParams.get("keyword") || "";
  const priceParam = searchParams.get("price") || "";

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("all");
  const [keyword, setKeyword] = useState(keywordParam);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    category: categoryParam ? [categoryParam] : [],
    price: priceParam ? [priceParam] : [],
    genre: [],
    features: [],
    platform: [],
  });

  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  useEffect(() => {
    setKeyword(keywordParam);
  }, [keywordParam]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categoryParam ? [categoryParam] : [],
      price: priceParam ? [priceParam] : [],
    }));
  }, [categoryParam, priceParam]);

  useEffect(() => {
    async function loadGames() {
      const requests = categories.map((category) => {
        return axios.get(category.url).then((res) => {
          return res.data.map((game) => ({
            ...game,
            endpoint: category.key,
          }));
        });
      });

      const results = await Promise.all(requests);
      const list = [];

      results.flat().forEach((game) => {
        const exists = list.some((item) => item.title === game.title);

        if (!exists) {
          list.push(game);
        }
      });

      setGames(list);
      setLoading(false);
    }

    loadGames();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, sortBy, filters]);

  const toggleFilter = (name, value) => {
    setFilters((prev) => {
      const list = prev[name];

      if (list.includes(value)) {
        return {
          ...prev,
          [name]: list.filter((item) => item !== value),
        };
      }

      return {
        ...prev,
        [name]: [...list, value],
      };
    });
  };

  let shownGames = games;

  if (keyword.trim()) {
    const text = keyword.toLowerCase();

    shownGames = shownGames.filter((game) => {
      return (
        game.title.toLowerCase().includes(text) ||
        game.developer?.toLowerCase().includes(text) ||
        game.publisher?.toLowerCase().includes(text)
      );
    });
  }

  if (filters.category.length > 0) {
    shownGames = shownGames.filter((game) => {
      return filters.category.includes(game.endpoint);
    });
  }

  if (filters.price.length > 0) {
    shownGames = shownGames.filter((game) => {
      return filters.price.some((filter) => priceMatches(game, filter));
    });
  }

  if (filters.genre.length > 0) {
    shownGames = shownGames.filter((game) => {
      return game.genres?.some((genre) => filters.genre.includes(genre));
    });
  }

  if (filters.features.length > 0) {
    shownGames = shownGames.filter((game) => {
      return game.features?.some((feature) =>
        filters.features.includes(feature)
      );
    });
  }

  if (filters.platform.length > 0) {
    shownGames = shownGames.filter((game) => {
      return filters.platform.some((platform) => {
        return game.platform?.toLowerCase().includes(platform.toLowerCase());
      });
    });
  }

  if (sortBy === "alphabetical") {
    shownGames = [...shownGames].sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
  }

  if (sortBy === "price-high") {
    shownGames = [...shownGames].sort((a, b) => {
      return getPrice(b.newPrice) - getPrice(a.newPrice);
    });
  }

  if (sortBy === "price-low") {
    shownGames = [...shownGames].sort((a, b) => {
      return getPrice(a.newPrice) - getPrice(b.newPrice);
    });
  }

  if (sortBy === "new-release") {
    shownGames = [...shownGames].sort((a, b) => {
      return getDate(b.releaseDate) - getDate(a.releaseDate);
    });
  }

  const perPage = 20;
  const totalPages = Math.ceil(shownGames.length / perPage);
  const firstGame = (currentPage - 1) * perPage;
  const paginatedGames = shownGames.slice(firstGame, firstGame + perPage);

  const pages = [];
  const pageStart = Math.max(1, currentPage - 2);
  const pageEnd = Math.min(totalPages, pageStart + 4);

  for (let page = pageStart; page <= pageEnd; page++) {
    pages.push(page);
  }

  const changePage = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {!loading && games.length > 0 && (
        <PopularGenresSlider games={games} setFilters={setFilters} />
      )}

      <div className="max-w-[1200px] mx-auto mt-8 px-4 flex flex-col md:flex-row gap-8 pb-20">
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-[#121214] overflow-y-auto md:hidden">
            <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-[#202024]">
              <h3 className="text-white text-lg font-bold">Filters</h3>

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            <div className="px-4 pt-4 pb-10">
              <FilterPanel
                keyword={keyword}
                setKeyword={setKeyword}
                filters={filters}
                toggleFilter={toggleFilter}
              />

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="mt-6 w-full bg-white text-black font-semibold py-3 rounded-lg text-sm"
              >
                Show Results
              </button>
            </div>
          </div>
        )}

        <div className="hidden md:block md:w-[240px] md:min-w-[240px] md:order-2">
          <h3 className="text-white text-lg font-bold mb-4">Filters</h3>

          <FilterPanel
            keyword={keyword}
            setKeyword={setKeyword}
            filters={filters}
            toggleFilter={toggleFilter}
          />
        </div>

        <div className="flex-1 min-w-0 md:order-1">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-gray-400 text-sm">Show:</span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#202024] text-white text-sm px-3 py-2 rounded-md outline-none"
            >
              <option value="all">All</option>
              <option value="new-release">New Release</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
            </select>

            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden ml-auto flex items-center gap-1.5 bg-[#202024] text-white text-sm px-3 py-2 rounded-md"
            >
              <SlidersHorizontal size={15} />
              Filter
            </button>
          </div>

          {keyword && (
            <p className="text-gray-400 text-sm mb-5">
              Results for <span className="text-white">"{keyword}"</span>
            </p>
          )}

          {loading ? (
            <div className="text-white text-center py-20">Loading...</div>
          ) : shownGames.length === 0 ? (
            <div className="text-gray-400 text-center py-20">
              No games found.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-4">
                {paginatedGames.map((game) => {
                  const folderName = getFolderName(game.title);
                  const imageSrc = `https://epic-games-api-eta.vercel.app/${game.endpoint}/${folderName}/cover.jpg`;
                  const inWishlist = isInWishlist(game.title);

                  return (
                    <Link
                      key={game.title}
                      to={`/game/${folderName}?from=${game.endpoint}`}
                      className="w-[47%] sm:w-[31%] md:w-[23%] group"
                    >
                      <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-[#1a1a1a]">
                        <img
                          src={imageSrc}
                          alt={game.title}
                          className="w-full h-full object-contain"
                        />

                        <div className="absolute inset-0 group-hover:bg-white/10 pointer-events-none"></div>

                        <div className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWishlist(game);
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
                        <p className="text-gray-400 text-[11px] uppercase font-semibold mb-1">
                          Base Game
                        </p>

                        <p className="text-white text-sm font-semibold mb-1 line-clamp-2">
                          {game.title}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
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

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button
                    onClick={() => changePage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-md text-white disabled:opacity-40 flex items-center justify-center"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {pages.map((page) => (
                    <button
                      key={page}
                      onClick={() => changePage(page)}
                      className={`w-10 h-10 rounded-md text-sm ${
                        currentPage === page
                          ? "bg-[#202024] text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      changePage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-md text-white disabled:opacity-40 flex items-center justify-center"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function FilterPanel({ keyword, setKeyword, filters, toggleFilter }) {
  return (
    <>
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Keywords"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full bg-[#202024] text-sm text-white rounded-md py-2.5 pl-10 pr-4 outline-none placeholder:text-gray-400"
        />
      </div>

      <FilterSection title="Category" defaultOpen={filters.category.length > 0}>
        {categories.map((category) => (
          <Checkbox
            key={category.key}
            label={category.label}
            checked={filters.category.includes(category.key)}
            onChange={() => toggleFilter("category", category.key)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Price" defaultOpen={filters.price.length > 0}>
        {priceFilters.map((price) => (
          <Checkbox
            key={price}
            label={price}
            checked={filters.price.includes(price)}
            onChange={() => toggleFilter("price", price)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Genre" defaultOpen={filters.genre.length > 0}>
        {genreFilters.map((genre) => (
          <Checkbox
            key={genre}
            label={genre}
            checked={filters.genre.includes(genre)}
            onChange={() => toggleFilter("genre", genre)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Features" defaultOpen={filters.features.length > 0}>
        {featureFilters.map((feature) => (
          <Checkbox
            key={feature}
            label={feature}
            checked={filters.features.includes(feature)}
            onChange={() => toggleFilter("features", feature)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Platform" defaultOpen={filters.platform.length > 0}>
        {platformFilters.map((platform) => (
          <Checkbox
            key={platform}
            label={platform}
            checked={filters.platform.includes(platform)}
            onChange={() => toggleFilter("platform", platform)}
          />
        ))}
      </FilterSection>
    </>
  );
}

function FilterSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (defaultOpen) {
      setOpen(true);
    }
  }, [defaultOpen]);

  return (
    <div className="border-b border-[#202024] py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-white hover:text-gray-300"
      >
        <span className="text-sm font-semibold">{title}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {open && <div className="flex flex-col gap-3 mt-4">{children}</div>}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <div
      onClick={onChange}
      className="flex items-center gap-3 cursor-pointer select-none"
    >
      <div
        className={`w-[18px] h-[18px] rounded flex items-center justify-center border ${
          checked ? "bg-white border-white" : "border-gray-500"
        }`}
      >
        {checked && <Check size={14} className="text-black" />}
      </div>

      <span className="text-gray-300 text-sm">{label}</span>
    </div>
  );
}

export default Browse;