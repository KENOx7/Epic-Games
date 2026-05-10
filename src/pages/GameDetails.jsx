import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import Checkout from '../components/Checkout';

// Oyunun slug-ini yaratmaq üçün (URL-də istifadə olunur)
function slugYarat(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function GameDetails() {
  const { slug } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const from = queryParams.get('from') || 'epic-savings';

  const [game, setGame] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Oyun məlumatlarının yüklənməsi
  useEffect(() => {
    window.scrollTo(0, 0);
    const url = `https://epic-games-api-eta.vercel.app/${from}/category_summary.json`;
    axios.get(url)
      .then((res) => {
        // Slug-a uyğun oyunu tapırıq
        const tapilmis = res.data.find((g) => slugYarat(g.title) === slug);
        if (tapilmis) {
          setGame(tapilmis);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, from]);

  if (loading) {
    return (
      <div className="bg-[#101014] min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-lg">Yüklənir...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="bg-[#101014] min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-gray-400 text-lg">Oyun tapılmadı</p>
        <Link to="/" className="text-[#26BBFF] hover:underline">← Geri qayıt</Link>
      </div>
    );
  }

  const folderName = slugYarat(game.title);
  const basePath = `https://epic-games-api-eta.vercel.app/${from}/${folderName}`;

  // Screenshot şəkillərin siyahısı (cover və age xaric)
  const screenshots = (game.saved_images || [])
    .filter((img) => img !== 'cover.jpg' && !img.startsWith('cover-2') && !img.startsWith('age'))
    .map((img) => game.title === 'Trash Goblin' ? img.replace('.png', '.jpg') : img);

  const ageImage = (game.saved_images || []).find(img => img.startsWith('age'));

  // Hazırda seçilmiş şəkil
  const currentImage = screenshots.length > 0
    ? `${basePath}/${screenshots[selectedImage]}`
    : `${basePath}/cover.jpg`;

  // Ulduzların göstərilməsi (rating üçün)
  const rating = parseFloat(game.playerRating) || 0;
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;

  return (
    <div className="bg-[#101014] min-h-screen text-white">

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <Checkout
          game={game}
          basePath={basePath}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}

      {/* Yuxarı hissə - oyun adı və geri düyməsi */}
      <div className="max-w-[1200px] mx-auto px-4 pt-6">
        <Link to="/" className="flex items-center gap-2 text-[#26BBFF] mb-5 text-sm hover:underline w-fit">
          <ArrowLeft size={18} />
          Mağazaya qayıt
        </Link>

        <h1 className="text-3xl font-bold mb-2">{game.title}</h1>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < fullStars ? '#FFD700' : (i === fullStars && hasHalf ? '#FFD700' : 'none')}
                color={i < fullStars || (i === fullStars && hasHalf) ? '#FFD700' : '#555'}
              />
            ))}
          </div>
          <span className="text-gray-400 text-sm">{game.playerRating}</span>
        </div>
      </div>

      {/* Əsas content - 2 sütunlu sadə flex layout */}
      <div className="max-w-[1200px] mx-auto px-4 pb-10 flex flex-col lg:flex-row-reverse gap-8">

        {/* 1. Qiymət və Məlumat paneli (Mobildə Üstdə, PC-də Sağ Tərəfdə) */}
        <div className="w-full lg:w-[320px]">

          {/* Cover şəkil */}
          <div className="w-full h-[200px] lg:h-[180px] rounded-lg overflow-hidden mb-4 bg-[#1a1a1e]">
            <img
              src={(() => {
                const cover2 = game.saved_images && game.saved_images.find(img => img.startsWith('cover-2'));
                const cover = game.saved_images && game.saved_images.find(img => img === 'cover.jpg' || img === 'cover.png');
                return cover2 ? `${basePath}/${cover2}` : (cover ? `${basePath}/${cover}` : `${basePath}/cover.jpg`);
              })()}
              alt={game.title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Qiymət hissəsi */}
          <div className="bg-[#1a1a1e] rounded-lg p-5 mb-4">
            <div className="flex items-center gap-3 mb-3">
              {game.discount && (
                <span className="bg-[#26BBFF] text-black font-bold px-2.5 py-1 rounded-md text-sm">
                  {game.discount}
                </span>
              )}
              {game.oldPrice && (
                <span className="text-gray-500 line-through text-sm">{game.oldPrice}</span>
              )}
              {game.newPrice ? (
                <span className="text-white font-bold text-lg">{game.newPrice}</span>
              ) : (
                <span className="text-white font-bold text-lg">—</span>
              )}
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-3 bg-[#26BBFF] text-black font-bold text-sm rounded-lg mb-2 hover:bg-[#72D3FF] transition"
            >
              Buy Now
            </button>

            <button className="w-full py-3 bg-[#2a2a30] text-white text-sm rounded-lg flex items-center justify-center gap-2 mb-2 hover:bg-[#3a3a40] transition">
              <ShoppingCart size={16} /> Add to Cart
            </button>

            <button className="w-full py-3 bg-[#2a2a30] text-white text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-[#3a3a40] transition">
              <Heart size={16} /> Wishlist
            </button>
          </div>

          {/* Oyun məlumatları */}
          <div className="bg-[#1a1a1e] rounded-lg p-5">
            <InfoRow label="Developer" value={game.developer} />
            <InfoRow label="Publisher" value={game.publisher} />
            <InfoRow label="Release Date" value={game.releaseDate} />
            <InfoRow label="Platform" value={game.platform} />

            <div className="border-t border-[#2a2a30] mt-4 pt-4 flex justify-center">
              <button className="flex items-center gap-2 text-gray-400 py-2 px-5 rounded-md text-sm hover:text-white transition">
                <Share2 size={14} /> Share
              </button>
            </div>
          </div>

          {/* Age Rating Card */}
          {ageImage && (
            <div className="bg-[#1a1a1e] rounded-lg p-5 mt-4 flex items-center gap-4">
              <div className="w-12 h-12 flex-none bg-[#2a2a30] rounded-md overflow-hidden flex items-center justify-center p-1">
                <img src={`${basePath}/${ageImage}`} alt="Age Rating" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Age Rating</p>
                <p className="text-gray-400 text-xs">Recommended age rating for this game.</p>
              </div>
            </div>
          )}
        </div>

        {/* 2. Sol hissə - Şəkillər və Açıqlama */}
        <div className="flex-1 min-w-0">

          {/* Böyük şəkil */}
          <div className="relative group w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden bg-[#1a1a1e] mb-4">
            <img
              src={currentImage}
              alt={game.title}
              className="w-full h-full object-cover"
            />
            {screenshots.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage(prev => prev === 0 ? screenshots.length - 1 : prev - 1)}
                  className="absolute left-4 top-[45%] w-10 h-10 bg-black/60 hover:bg-black/90 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => setSelectedImage(prev => prev === screenshots.length - 1 ? 0 : prev + 1)}
                  className="absolute right-4 top-[45%] w-10 h-10 bg-black/60 hover:bg-black/90 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Kiçik screenshotlar */}
          {screenshots.length > 1 && (
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => {
                  const container = document.getElementById('thumbnails-container');
                  if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                }}
                className="w-10 h-10 flex-none rounded-full bg-[#2a2a30] hover:bg-[#3a3a40] flex items-center justify-center text-white transition hidden md:flex"
              >
                <ChevronLeft size={20} />
              </button>

              <div id="thumbnails-container" className="hide-scrollbar flex-1 flex gap-2 overflow-x-auto">
                {screenshots.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-[110px] flex-none h-[64px] rounded-md overflow-hidden cursor-pointer transition-all ${selectedImage === index ? 'border-2 border-[#26BBFF] opacity-100' : 'border-2 border-transparent opacity-60 hover:opacity-80'
                      }`}
                  >
                    <img
                      src={`${basePath}/${img}`}
                      alt={`screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  const container = document.getElementById('thumbnails-container');
                  if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                }}
                className="w-10 h-10 flex-none rounded-full bg-[#2a2a30] hover:bg-[#3a3a40] flex items-center justify-center text-white transition hidden md:flex"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Oyun haqqında məlumat */}
          <div>
            {/* Janr və xüsusiyyətlər */}
            <div className="flex gap-12 mb-6 flex-wrap">
              {game.genres && game.genres.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Genres</p>
                  <div className="flex gap-2 flex-wrap">
                    {game.genres.map((genre) => (
                      <span key={genre} className="bg-[#1e1e24] px-3 py-1 rounded text-sm text-gray-300">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {game.features && game.features.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Features</p>
                  <div className="flex gap-2 flex-wrap">
                    {game.features.map((feature) => (
                      <span key={feature} className="bg-[#1e1e24] px-3 py-1 rounded text-sm text-gray-300">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Açıqlama */}
            <h2 className="text-xl font-bold mb-3">{game.title}</h2>
            <p className="text-gray-300 text-sm mt-2 whitespace-pre-wrap">
              {game.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Məlumat sətri komponenti (Developer, Publisher və s.)
function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between px-[2px] mb-3 text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-white text-right">{value}</span>
    </div>
  );
}
