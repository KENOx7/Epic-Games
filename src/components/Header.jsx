import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Earth, TextAlignJustify, X, Search, Bookmark,
          ShoppingCart, ArrowRight, User, LogOut, } from "lucide-react";
import axios from "axios";
import logo from "../assets/logo.png";
import store from "../assets/store.svg";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { useAuthStore } from "../store/useAuthStore";

// Axtarış üçün lazım olan oyun məlumatlarını bu 4 fərqli API-dan çəkirik
const categories = [
  { key: "top-sellers", url: "https://epic-games-api-eta.vercel.app/top-sellers/category_summary.json" },
  { key: "epic-savings", url: "https://epic-games-api-eta.vercel.app/epic-savings/category_summary.json" },
  { key: "most-popular", url: "https://epic-games-api-eta.vercel.app/most-popular/category_summary.json" },
  { key: "top-player-reviewed", url: "https://epic-games-api-eta.vercel.app/top-player-reviewed/category_summary.json" },
]

// Saytın dəstəklədiyi dillərin siyahısı
const languages = [
  { code: "en", label: "English", short: "EN" },
  { code: "tr", label: "Türkçe", short: "TR" },
  { code: "ru", label: "Русский", short: "RU" },
  { code: "az", label: "Azərbaycanca", short: "AZ" },
]

// Oyunun adından şəkilin URL-i üçün uyğun qovluq adını (slug) yaradan funksiya
const getFolderName = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

function Header() {
  // State-lər: menyuların və axtarışın açıq olub-olmadığını yoxlamaq üçün
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [games, setGames] = useState([]) // Bütün oyunların axtarış bazası burada saxlanılır
  const [langOpen, setLangOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  // Ref-lər: ekranda pəncərədən (dropdown) kənara vurulduğunu anlamaq üçün istifadə olunur
  const searchRef = useRef(null)
  const langRef = useRef(null)
  const userRef = useRef(null)

  const navigate = useNavigate()

  // Zustand (Global State) mağazalarından lazımi state-ləri götürürük
  const cart = useCartStore((state) => state.cart)
  const wishlist = useWishlistStore((state) => state.wishlist)
  const { language, setLanguage, t } = useLanguageStore()
  const { user, logOut } = useAuthStore()

  // Səhifənin ilk yüklənməsində (Mount) bütün kateqoriyalardan oyunları gətirib vahid bazada toplayır
  useEffect(() => {
    const loadGames = async () => {
      // Hər bir kateqoriya API-nə getməsi üçün sorğu siyahısı hazırlayırıq
      const requests = categories.map((category) =>
        axios.get(category.url).then((res) =>
          // Gələn oyun məlumatlarının içinə gələcəkdə link qura bilmək üçün `endpoint` məlumatını da əlavə edirik
          res.data.map((game) => ({ ...game, endpoint: category.key }))
        )
      )

      // Bütün API-ların eyni anda cavab verməsini gözləyirik (Promise.all sürət qazandırır)
      const data = await Promise.all(requests)
      const allGames = data.flat() // 4 fərqli massivi birləşdirib bir dənə uzun massivə çeviririk
      const uniqueGames = []

      // Təkrarlanan oyunları süzgəcdən keçiririk (eyni oyun həm "top sellers" həm "popular"da ola bilər)
      allGames.forEach((game) => {
        if (!uniqueGames.find((item) => item.title === game.title)) {uniqueGames.push(game)}
      })
      // Süzülmüş, təkrarsız cəmi oyun bazasını state-ə mənimsədirik
      setGames(uniqueGames)}
    loadGames()}, [])

  // Səhifənin istənilən başqa bir yerinə kliklədikdə açıq olan dropdown-ları bağlamaq üçündür
  useEffect(() => {
    const closeDropdowns = (e) => {
      // contains metodu yoxlayır ki, basılan yer həmin div-in daxilidir yoxsa xarici
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false)
    }

    // click eventini aktivləşdiririk
    document.addEventListener("mousedown", closeDropdowns)
    
    // Component silinəndə (unmount) event-i ləğv edirik ki, yaddaş problemi yaranmasın
    return () => document.removeEventListener("mousedown", closeDropdowns)}, [])

  // Axtarış sözünü kiçik hərflərə çevirib kənarlarındakı boşluqları təmizləyirik
  const searchValue = searchText.trim().toLowerCase()

  // Ekranda (Search altındakı kiçik pəncərədə) axtarış nəticəsini süzən (filterləyən) hissə
  const results = searchValue
    ? games.filter((game) => {
        const title = game.title.toLowerCase()
        const developer = game.developer?.toLowerCase() || ""
        const publisher = game.publisher?.toLowerCase() || ""

        // Əgər axtarılan söz oyunun adında, tərtibatçısında və ya yayımçısında varsa onu siyahıya alır
        return (title.includes(searchValue) || developer.includes(searchValue) || publisher.includes(searchValue))
      }).slice(0, 5) : []

  // Axtarışla bağlı bütün açıq pəncərələri (mobil daxil) bağlayıb mətni sıfırlayır
  const closeSearch = () => {setSearchOpen(false); setMobileSearchOpen(false); setSearchText("")}

  // Enter-ə basanda və ya "Bütün nəticələrə bax" klikləndikdə Axtarış səhifəsinə (/browse) yönləndirir
  const goSearchPage = (e) => {e?.preventDefault()
    if (!searchValue) return // Əgər axtarış boşdursa heç nə etmə
    // URL-in korlanmaması üçün mətni encode edib Browse səhifəsinə göndəririk
    navigate(`/browse?keyword=${encodeURIComponent(searchText.trim())}`); closeSearch()}

  // Dil dəyişdirildikdə həm qlobal state-i güncəlləyir, həm də dil seçimi pəncərəsini bağlayır
  const changeLanguage = (code) => {setLanguage(code); setLangOpen(false)}

  // İstifadəçi hesabı düyməsindən sistemdən çıxdıqda (Log Out)
  const handleLogOut = () => {logOut(); setUserOpen(false)}

  return (
    <div>
      {/* -------------- BİRİNCİ QARA HEADER HİSSƏSİ (Loqo, Support, İstifadeci, Dil) -------------- */}
      <header className="relative z-[60] bg-[#121216] h-[72px] w-full flex items-center justify-between p-5">
        {/* Sol tərəf: Loqolar və səhifə linkləri */}
        <div className="flex items-center gap-5">
          <Link to="/" className="flex items-center gap-5 hover:opacity-80">
            <img src={logo} alt="logo" className="h-[40px]" />
            <img src={store} alt="store" className="w-[54px] h-[32px]" />
          </Link>
          <Link to="/support" className="hidden md:block text-white hover:text-gray-300">{t("support")}</Link>
          <Link to="/" className="hidden md:block text-white hover:text-gray-300">{t("distribute")}</Link>
        </div>
        {/* Sağ tərəf: Dil, İstifadəçi, Yüklə düyməsi, Mobil menu ikonu */}
        <div className="flex items-center gap-5">
          {/* Dil seçimi qutusu (PC üçün) */}
          <div className="relative hidden md:block" ref={langRef}>
            <button onClick={() => setLangOpen(!langOpen)} className="text-white hover:opacity-60 flex items-center justify-center mt-1">
              <Earth size={24} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-10 bg-[#18181c] rounded-md shadow-xl py-2 w-[150px] z-50">
                {languages.map((item) => (
                  <button key={item.code} onClick={() => changeLanguage(item.code)}
                    className={`w-full text-left px-5 py-2.5 hover:bg-[#2a2a30] ${language == item.code ? "text-white font-bold" : "text-[#AEAEAF]"}`}>{item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Əgər User (İstifadəçi) daxil olubsa profil ikonunu, olmayıbsa "Sign In" yazısını göstərir */}
          {user ? (
            <div className="relative" ref={userRef}>
              <button onClick={() => setUserOpen(!userOpen)} className="text-[#AEAEAF] hover:text-white flex items-center justify-center 
                p-2 rounded-full hover:bg-[#202024] transition-colors"><User size={20} />
              </button>
              {userOpen && (
                <div className="absolute right-0 top-10 bg-[#18181c] rounded-md shadow-xl py-2 w-[200px] z-50 border border-[#2e2e34]">
                  <div className="px-4 py-2 border-b border-[#2e2e34] mb-2">
                    <p className="text-white text-sm font-semibold truncate">{user.email}</p>
                  </div>
                  <button onClick={handleLogOut} className="w-full text-left px-4 py-2 text-sm text-[#AEAEAF] 
                    hover:text-white hover:bg-[#2a2a30] flex items-center gap-2"><LogOut size={16} />{t("logOut")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-white bg-[#353539] py-2 px-3 md:py-2.5 md:px-4 rounded-md 
              hover:bg-[#656567] text-xs md:text-sm font-semibold transition-colors">{t("signIn")}
            </Link>
          )}
          {/* Göy rəngli Yüklə düyməsi */}
          <button className="hidden md:block bg-[#26BBFF] py-2.5 px-4 rounded-md hover:bg-[#72D3FF] text-black text-sm font-bold">{t("download")}</button>
          {/* Mobil Menyu İkonu (PC-də gizlənir) */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white hover:opacity-60">
            {menuOpen ? <X /> : <TextAlignJustify />}
          </button>
        </div>
      </header>
      {/* -------------- MOBİL MENYU OVERLAY (Ekrani tutan menyu pəncərəsi) -------------- */}
      {menuOpen && (
        <div className="md:hidden bg-[#121216] fixed inset-0 z-[60] flex flex-col">
          {/* Mobil Menyunun Header-i (Düzgün layout shift olmasın deyə əsas header ilə eyni hündürlük və strukturda yazılıb) */}
          <div className="h-[72px] w-full flex items-center justify-between p-5">
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-5 hover:opacity-80">
              <img src={logo} alt="logo" className="h-[40px]" />
              <img src={store} alt="store" className="w-[54px] h-[32px]" />
            </Link>
            <button onClick={() => setMenuOpen(false)} className="text-white hover:opacity-60">
              <X size={24} />
            </button>
          </div>
          {/* Mobil Menyunun Kontenti (Dillər və Səhifələr) */}
          <div className="flex flex-col px-5 pb-5 gap-6">
            <div className="flex justify-end items-center mt-2">
              <div className="flex items-center gap-4">
                <div className="flex gap-4">
                  {languages.map((item) => (
                    <button key={item.code} onClick={() => setLanguage(item.code)} 
                    className={`text-sm ${language == item.code ? "text-white font-bold" : "text-gray-400"}`}>
                      {item.short}
                    </button>
                  ))}
                </div>
                <Earth className="text-[#AEAEAF]" size={24} />
              </div>
            </div>
            <ul>
              <li className="text-white text-[32px] font-bold">{t("menu")}</li>
              <li className="pt-10"><Link to="/support" onClick={() => setMenuOpen(false)} 
                className="text-white hover:text-gray-300">{t("support")}
              </Link></li>
              <li className="pt-5"><Link to="/" onClick={() => setMenuOpen(false)} 
                className="text-white hover:text-gray-300">{t("distribute")}
              </Link></li>
            </ul>
          </div>
        </div>
      )}

      {/* -------------- İKİNCİ HEADER HİSSƏSİ (Search, Discover, Browse, Wishlist, Cart) -------------- */}
      <div className="bg-[#101014] h-[100px] w-full sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto h-full flex justify-between items-center px-4 xl:px-0">
          {/* Sol Tərəf: Axtarış çubuğu və Naviqasiya */}
          <div className="flex items-center">
            {/* PC üçün Search Inputu */}
            <div className="hidden md:block relative" ref={searchRef}>
              <form onSubmit={goSearchPage} className="flex items-center">
                <div className="bg-[#202024] text-[#AEAEAF] w-[40px] h-[40px] rounded-l-full flex items-center justify-center">
                  <Search size={16} />
                </div>
                <input type="text" placeholder={t("searchStore")} value={searchText}
                  onChange={(e) => { setSearchText(e.target.value); setSearchOpen(true) }}
                  onFocus={() => { if (searchText.trim()) setSearchOpen(true) }}
                  className="bg-[#202024] text-[#AEAEAF] w-[190px] h-[40px] rounded-r-full outline-none" />
              </form>
              {/* PC üçün Axtarış Nəticələri Pəncərəsi (Dropdown) */}
              {searchOpen && searchValue && (
                <div className="absolute top-[48px] left-0 w-[380px] bg-[#18181c] rounded-lg shadow-2xl border border-[#2a2a30] overflow-hidden z-50">
                  {results.length > 0 ? (
                    <div>
                      <p className="text-[#AEAEAF] text-[11px] uppercase font-bold px-4 pt-4 pb-2">{t("topResults")}</p>
                      {results.map((game) => {
                        const folderName = getFolderName(game.title)
                        const imageSrc = `https://epic-games-api-eta.vercel.app/${game.endpoint}/${folderName}/cover.jpg`
                        return (
                          <Link key={game.title} to={`/game/${folderName}?from=${game.endpoint}`} 
                            onClick={closeSearch} 
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#2a2a30]">
                            <img src={imageSrc} alt={game.title} className="w-[40px] h-[52px] object-cover rounded bg-[#111]" />
                            <div>
                              <p className="text-[#AEAEAF] text-[11px]">{t("baseGame")}</p>
                              <p className="text-white text-sm font-semibold">{game.title}</p>
                            </div>
                          </Link>
                        )
                      })}
                      {/* Daha çox nəticəyə baxmaq üçün düymə */}
                      <button onClick={goSearchPage} className="w-full text-left px-4 py-3 text-white text-sm hover:bg-[#2a2a30] border-t border-[#2a2a30] flex items-center gap-2">
                        {t("viewAllResults")} <ArrowRight size={14} />
                      </button>
                    </div>
                  ) : (
                    // Əgər heç bir oyun tapılmasa bu yazını göstəririk
                    <p className="text-[#AEAEAF] text-sm px-4 py-6 text-center">{t("noGamesFound")}</p>)}
                </div>
              )}
            </div>
            {/* Mobil üçün Search İkonu (basanda pəncərəni tam ekranda açır) */}
            <button onClick={() => setMobileSearchOpen(true)} className="md:hidden text-[#AEAEAF] hover:text-white">
              <Search size={24} />
            </button>
            {/* Discover və Browse Naviqasiyası */}
            <div className="flex items-center gap-6 ml-8">
              <Link to="/" className="text-white hover:opacity-80 transition-opacity">{t("discover")}</Link>
              <Link to="/browse" className="text-[#AEAEAF] hover:text-white transition-colors">{t("browse")}</Link>
            </div>
          </div>
          {/* Sağ Tərəf: Wishlist və Cart (Səbət) İkonları */}
          <div className="flex items-center gap-6 text-[#AEAEAF]">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative hover:text-white flex items-center">
              <Bookmark size={20} />
              {/* Əgər wishlistdə oyun varsa üzərində xəbərdarlıq (badget) rəqəmi göstərilir */}
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold 
                                 w-4 h-4 flex items-center justify-center rounded-full">{wishlist.length}</span>
              )}
            </Link>
            {/* Səbət */}
            <Link to="/cart" className="relative hover:text-white flex items-center">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold 
                                 w-4 h-4 flex items-center justify-center rounded-full">{cart.length}</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* -------------- MOBİL ÜÇÜN AXTARIŞ OVERLAY-i -------------- */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 bg-[#121216] z-[60] flex flex-col p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-[20px] font-bold">{t("search")}</h2>
            <button onClick={closeSearch} className="text-[#AEAEAF] hover:text-white">
              <X size={28} />
            </button>
          </div>

          {/* Mobildə böyük formada görünən axtarış inputu */}
          <form onSubmit={goSearchPage}>
            <div className="flex items-center bg-[#202024] rounded-full px-4 py-3 h-[50px]">
              <Search className="text-[#AEAEAF] mr-3" size={20} />
              <input autoFocus type="text" placeholder={t("searchStore")} value={searchText} 
                     onChange={(e) => setSearchText(e.target.value)} 
                     className="bg-transparent text-white outline-none w-full" />
            </div>
          </form>

          {/* Mobildə axtarış nəticələri */}
          {searchValue && (
            <div className="mt-4">
              {results.length > 0 ? (
                <div>
                  <p className="text-[#AEAEAF] text-[11px] uppercase font-bold px-2 pb-2">{t("topResults")}</p>
                  {results.map((game) => {
                    const folderName = getFolderName(game.title)
                    const imageSrc = `https://epic-games-api-eta.vercel.app/${game.endpoint}/${folderName}/cover.jpg`
                    return (
                      <Link key={game.title} to={`/game/${folderName}?from=${game.endpoint}`} onClick={closeSearch} className="flex items-center gap-3 px-2 py-2.5 hover:bg-[#2a2a30] rounded-md">
                        <img src={imageSrc} alt={game.title} className="w-[40px] h-[52px] object-cover rounded bg-[#111]" />
                        <div>
                          <p className="text-[#AEAEAF] text-[11px]">{t("baseGame")}</p>
                          <p className="text-white text-sm font-semibold">{game.title}</p>
                        </div>
                      </Link>
                    )
                  })}
                  <button onClick={goSearchPage} className="w-full text-left px-2 py-3 text-white text-sm flex items-center gap-2 mt-2">
                    {t("viewAllResults")} <ArrowRight size={14} />
                  </button>
                </div>) : (<p className="text-[#AEAEAF] text-sm text-center mt-8">{t("noGamesFound")}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Header