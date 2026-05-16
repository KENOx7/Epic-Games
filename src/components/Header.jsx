import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Earth, TextAlignJustify, X, Search, ChevronDown, ChevronUp, Bookmark, ShoppingCart, ArrowRight, } from "lucide-react";
import axios from "axios";
import logo from "../assets/logo.png";
import store from "../assets/store.svg";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { LanguageContext } from "../context/LanguageContext";

const categories = [
  {
    key: "top-sellers",
    url: "https://epic-games-api-eta.vercel.app/top-sellers/category_summary.json",
  },
  {
    key: "epic-savings",
    url: "https://epic-games-api-eta.vercel.app/epic-savings/category_summary.json",
  },
  {
    key: "most-popular",
    url: "https://epic-games-api-eta.vercel.app/most-popular/category_summary.json",
  },
  {
    key: "top-player-reviewed",
    url: "https://epic-games-api-eta.vercel.app/top-player-reviewed/category_summary.json",
  },
];

function getFolderName(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [games, setGames] = useState([]);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const searchRef = useRef(null);
  const langRef = useRef(null);
  const navigate = useNavigate();

  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { language, setLanguage, t } = useContext(LanguageContext);

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
    }

    loadGames();
  }, []);

  useEffect(() => {
    function closeMenus(e) {

      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", closeMenus);

    return () => {
      document.removeEventListener("mousedown", closeMenus);
    };
  }, []);

  const results = searchText.trim()
    ? games
      .filter((game) => {
        const text = searchText.toLowerCase();

        return (
          game.title.toLowerCase().includes(text) ||
          game.developer?.toLowerCase().includes(text) ||
          game.publisher?.toLowerCase().includes(text)
        );
      })
      .slice(0, 5)
    : [];

  const searchSubmit = (e) => {
    e.preventDefault();

    const text = searchText.trim();

    if (!text) return;

    setSearchOpen(false);
    setMobileSearchOpen(false);
    setSearchText("");
    navigate(`/browse?keyword=${encodeURIComponent(text)}`);
  };

  const openGame = () => {
    setSearchOpen(false);
    setMobileSearchOpen(false);
    setSearchText("");
  };

  const viewAllResults = () => {
    const text = searchText.trim();

    if (!text) return;

    setSearchOpen(false);
    setMobileSearchOpen(false);
    setSearchText("");
    navigate(`/browse?keyword=${encodeURIComponent(text)}`);
  };

  return (
    <>
      <header className="relative z-[60] bg-[#121216] h-[72px] w-full flex items-center justify-between p-5">
        <div className="flex items-center gap-5">
          <Link to="/" className="flex items-center gap-5 hover:opacity-80">
            <img src={logo} alt="logo" className="h-[40px]" />
            <img src={store} alt="store" className="w-[54px] h-[32px]" />
          </Link>

          <Link to="/support" className="hidden md:block text-white hover:text-gray-300">
            {t("support")}
          </Link>

          <Link to="/" className="hidden md:block text-white hover:text-gray-300">
            {t("distribute")}
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative hidden md:block" ref={langRef}>
            <button 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="text-white hover:opacity-60 flex items-center justify-center mt-1"
            >
              <Earth size={24} />
            </button>
            
            {langDropdownOpen && (
              <div className="absolute right-0 top-10 bg-[#18181c] rounded-md shadow-xl py-2 w-[150px] z-50">
                <button 
                  onClick={() => { setLanguage("en"); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-5 py-2.5 hover:bg-[#2a2a30] ${language === "en" ? "text-white font-bold" : "text-[#AEAEAF]"}`}
                >
                  English
                </button>
                <button 
                  onClick={() => { setLanguage("tr"); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-5 py-2.5 hover:bg-[#2a2a30] ${language === "tr" ? "text-white font-bold" : "text-[#AEAEAF]"}`}
                >
                  Türkçe
                </button>
                <button 
                  onClick={() => { setLanguage("ru"); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-5 py-2.5 hover:bg-[#2a2a30] ${language === "ru" ? "text-white font-bold" : "text-[#AEAEAF]"}`}
                >
                  Русский
                </button>
                <button 
                  onClick={() => { setLanguage("az"); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-5 py-2.5 hover:bg-[#2a2a30] ${language === "az" ? "text-white font-bold" : "text-[#AEAEAF]"}`}
                >
                  Azərbaycanca
                </button>
              </div>
            )}
          </div>

          <button className="hidden md:block text-white bg-[#353539] p-2 px-4 rounded-md hover:bg-[#656567] text-sm font-semibold">
            {t("signIn")}
          </button>

          <button className="bg-[#26BBFF] md:p-2 p-1 px-3 rounded-md hover:bg-[#72D3FF] text-black text-sm font-bold">
            {t("download")}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white hover:opacity-60"
          >
            {menuOpen ? <X /> : <TextAlignJustify />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="md:hidden bg-[#121216] fixed inset-0 z-[60] flex flex-col p-5 gap-6">
          <div className="flex justify-between items-center">
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
              <img src={logo} alt="logo" className="h-[40px]" />
              <img src={store} alt="store" className="w-[54px] h-[32px]" />
            </Link>

            <button
              onClick={() => setMenuOpen(false)}
              className="text-white hover:opacity-60"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex justify-end items-center gap-5 mt-4">
            <button className="text-white bg-[#353539] p-2 px-4 rounded-md hover:bg-[#656567] text-sm font-semibold">
              {t("signIn")}
            </button>
          </div>

          <ul>
            <li className="text-white text-[32px] font-bold">{t("menu")}</li>
            <li className="pt-10">
              <Link to="/support" onClick={() => setMenuOpen(false)} className="text-white hover:text-gray-300">
                {t("support")}
              </Link>
            </li>
            <li className="text-white pt-5">
              <Link to="/" onClick={() => setMenuOpen(false)} className="text-white hover:text-gray-300">
                {t("distribute")}
              </Link>
            </li>
          </ul>
          
          <div className="mt-auto border-t border-[#2a2a30] pt-6 pb-2">
            <div className="flex gap-4">
              <button 
                onClick={() => setLanguage("en")} 
                className={`text-sm ${language === "en" ? "text-white font-bold" : "text-gray-400"}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage("tr")} 
                className={`text-sm ${language === "tr" ? "text-white font-bold" : "text-gray-400"}`}
              >
                TR
              </button>
              <button 
                onClick={() => setLanguage("ru")} 
                className={`text-sm ${language === "ru" ? "text-white font-bold" : "text-gray-400"}`}
              >
                RU
              </button>
              <button 
                onClick={() => setLanguage("az")} 
                className={`text-sm ${language === "az" ? "text-white font-bold" : "text-gray-400"}`}
              >
                AZ
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#101014] h-[100px] w-full sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto h-full flex justify-between items-center px-4 xl:px-0">
          <div className="flex items-center">
            <div className="hidden md:block relative" ref={searchRef}>
              <form onSubmit={searchSubmit} className="flex items-center">
                <div className="bg-[#202024] text-[#AEAEAF] w-[40px] h-[40px] rounded-l-full flex items-center justify-center">
                  <Search size={16} />
                </div>

                <input
                  type="text"
                  placeholder={t("searchStore")}
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => {
                    if (searchText.trim()) {
                      setSearchOpen(true);
                    }
                  }}
                  className="bg-[#202024] text-[#AEAEAF] w-[190px] h-[40px] rounded-r-full outline-none"
                />
              </form>

              {searchOpen && searchText.trim() && (
                <div className="absolute top-[48px] left-0 w-[380px] bg-[#18181c] rounded-lg shadow-2xl border border-[#2a2a30] overflow-hidden z-50">
                  {results.length > 0 ? (
                    <>
                      <p className="text-[#AEAEAF] text-[11px] uppercase font-bold px-4 pt-4 pb-2">
                        Top Results
                      </p>

                      {results.map((game) => {
                        const folderName = getFolderName(game.title);
                        const imageSrc = `https://epic-games-api-eta.vercel.app/${game.endpoint}/${folderName}/cover.jpg`;

                        return (
                          <Link
                            key={game.title}
                            to={`/game/${folderName}?from=${game.endpoint}`}
                            onClick={openGame}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#2a2a30]"
                          >
                            <img
                              src={imageSrc}
                              alt={game.title}
                              className="w-[40px] h-[52px] object-cover rounded bg-[#111]"
                            />

                            <div>
                              <p className="text-[#AEAEAF] text-[11px]">
                                Base Game
                              </p>
                              <p className="text-white text-sm font-semibold">
                                {game.title}
                              </p>
                            </div>
                          </Link>
                        );
                      })}

                      <button
                        onClick={viewAllResults}
                        className="w-full text-left px-4 py-3 text-white text-sm hover:bg-[#2a2a30] border-t border-[#2a2a30] flex items-center gap-2"
                      >
                        View all results
                        <ArrowRight size={14} />
                      </button>
                    </>
                  ) : (
                    <p className="text-[#AEAEAF] text-sm px-4 py-6 text-center">
                      No results found
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden text-[#AEAEAF] hover:text-white"
            >
              <Search size={24} />
            </button>

            <div className="flex items-center gap-6 ml-8">
              <Link
                to="/"
                className="text-white hover:opacity-80 transition-opacity"
              >
                {t("discover")}
              </Link>

              <Link
                to="/browse"
                className="text-[#AEAEAF] hover:text-white transition-colors"
              >
                {t("browse")}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[#AEAEAF]">
            <Link
              to="/wishlist"
              className="relative hover:text-white flex items-center"
            >
              <Bookmark size={20} />

              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative hover:text-white flex items-center"
            >
              <ShoppingCart size={20} />

              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="fixed inset-0 bg-[#121216] z-[60] flex flex-col p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-[20px] font-bold">Search</h2>

            <button
              onClick={() => {
                setMobileSearchOpen(false);
                setSearchText("");
              }}
              className="text-[#AEAEAF] hover:text-white"
            >
              <X size={28} />
            </button>
          </div>

          <form onSubmit={searchSubmit}>
            <div className="flex items-center bg-[#202024] rounded-full px-4 py-3 h-[50px]">
              <Search className="text-[#AEAEAF] mr-3" size={20} />

              <input
                autoFocus
                type="text"
                placeholder={t("searchStore")}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="bg-transparent text-white outline-none w-full"
              />
            </div>
          </form>

          {searchText.trim() && (
            <div className="mt-4">
              {results.length > 0 ? (
                <>
                  <p className="text-[#AEAEAF] text-[11px] uppercase font-bold px-2 pb-2">
                    Top Results
                  </p>

                  {results.map((game) => {
                    const folderName = getFolderName(game.title);
                    const imageSrc = `https://epic-games-api-eta.vercel.app/${game.endpoint}/${folderName}/cover.jpg`;

                    return (
                      <Link
                        key={game.title}
                        to={`/game/${folderName}?from=${game.endpoint}`}
                        onClick={openGame}
                        className="flex items-center gap-3 px-2 py-2.5 hover:bg-[#2a2a30] rounded-md"
                      >
                        <img
                          src={imageSrc}
                          alt={game.title}
                          className="w-[40px] h-[52px] object-cover rounded bg-[#111]"
                        />

                        <div>
                          <p className="text-[#AEAEAF] text-[11px]">
                            Base Game
                          </p>
                          <p className="text-white text-sm font-semibold">
                            {game.title}
                          </p>
                        </div>
                      </Link>
                    );
                  })}

                  <button
                    onClick={viewAllResults}
                    className="w-full text-left px-2 py-3 text-white text-sm flex items-center gap-2 mt-2"
                  >
                    View all results
                    <ArrowRight size={14} />
                  </button>
                </>
              ) : (
                <p className="text-[#AEAEAF] text-sm text-center mt-8">
                  No results found
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Header;