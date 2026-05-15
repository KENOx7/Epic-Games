import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
  Copy,
  Check,
} from "lucide-react";
import axios from "axios";
import Checkout from "../components/Checkout";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const GameDetails = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const from = params.get("from") || "epic-savings";

  const { addToCart, isInCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const [game, setGame] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    axios
      .get(`https://epic-games-api-eta.vercel.app/${from}/category_summary.json`)
      .then((res) => {
        const foundGame = res.data.find((item) => createSlug(item.title) === slug);
        setGame(foundGame || null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, from]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

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

        <Link to="/" className="text-[#26BBFF] hover:underline">
          ← Geri qayıt
        </Link>
      </div>
    );
  }

  const folderName = createSlug(game.title);
  const basePath = `https://epic-games-api-eta.vercel.app/${from}/${folderName}`;

  const images = game.saved_images || [];

  const screenshots = images.filter((img) => {
    return (
      img !== "cover.jpg" &&
      img !== "cover.png" &&
      !img.startsWith("cover-2") &&
      !img.startsWith("age")
    );
  });

  const ageImage = images.find((img) => img.startsWith("age"));
  const cover2 = images.find((img) => img.startsWith("cover-2"));
  const cover1 = images.find((img) => img === "cover.jpg" || img === "cover.png");

  const coverSrc = `${basePath}/${cover2 || cover1 || "cover.jpg"}`;
  const currentImage =
    screenshots.length > 0
      ? `${basePath}/${screenshots[selectedImage]}`
      : `${basePath}/cover.jpg`;

  const rating = parseFloat(game.playerRating) || 0;
  const fullStars = Math.round(rating);

  const inCart = isInCart(game.title);
  const inWishlist = isInWishlist(game.title);

  const goPrev = () => {
    setSelectedImage((prev) => {
      return prev === 0 ? screenshots.length - 1 : prev - 1;
    });
  };

  const goNext = () => {
    setSelectedImage((prev) => {
      return prev === screenshots.length - 1 ? 0 : prev + 1;
    });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart || screenshots.length < 2) return;

    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;

    if (distance > 50) {
      goNext();
    }

    if (distance < -50) {
      goPrev();
    }
  };

  return (
    <div className="bg-[#101014] min-h-screen text-white">
      {checkoutOpen && (
        <Checkout
          game={game}
          basePath={basePath}
          onClose={() => setCheckoutOpen(false)}
        />
      )}

      {shareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#1a1a1e] rounded-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShareOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-center mb-6">Share Game</h2>

            <div className="flex items-center bg-[#101014] border border-gray-700 rounded-lg overflow-hidden">
              <input
                readOnly
                value={window.location.href}
                className="bg-transparent text-gray-300 px-4 py-3 flex-1 outline-none text-sm"
              />

              <button
                onClick={copyLink}
                className="w-12 p-3 border-l border-gray-700 bg-[#1a1a1e] text-gray-400 hover:text-white flex justify-center"
              >
                {copied ? (
                  <Check size={16} className="text-[#b7d36b]" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>

            {copied && (
              <p className="text-[#b7d36b] text-sm mt-3 text-center">
                Link kopyalandı!
              </p>
            )}
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-4 pt-6">
        <h1 className="text-3xl font-bold mb-2">{game.title}</h1>

        <div className="flex items-center gap-2 mb-6">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={16}
                fill={index < fullStars ? "white" : "none"}
                color={index < fullStars ? "white" : "#555"}
              />
            ))}
          </div>

          <span className="text-gray-300 text-sm ml-1">
            {game.playerRating}
          </span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 pb-10 flex flex-col lg:flex-row-reverse gap-8">
        <div className="w-full lg:w-[320px]">
          <div className="w-full h-[200px] lg:h-[180px] rounded-lg overflow-hidden mb-4">
            <img
              src={coverSrc}
              alt={game.title}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              {game.discount && (
                <span className="bg-[#26BBFF] text-black font-bold px-2.5 py-1 rounded-md text-sm">
                  {game.discount}
                </span>
              )}

              {game.oldPrice && (
                <span className="text-gray-500 line-through text-sm">
                  {game.oldPrice}
                </span>
              )}

              <span className="text-white font-bold text-lg">
                {game.newPrice || "—"}
              </span>
            </div>

            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full py-3 bg-[#26BBFF] hover:bg-[#72D3FF] text-black font-bold text-sm rounded-lg mb-2"
            >
              Buy Now
            </button>

            {inCart ? (
              <button
                onClick={() => navigate("/cart")}
                className="w-full py-3 bg-[#2a2a30] hover:bg-[#3a3a40] text-white text-sm rounded-lg flex items-center justify-center gap-2 mb-2"
              >
                <ShoppingCart size={16} />
                View in Cart
              </button>
            ) : (
              <button
                onClick={() => addToCart(game, basePath)}
                className="w-full py-3 bg-[#2a2a30] hover:bg-[#3a3a40] text-white text-sm rounded-lg flex items-center justify-center gap-2 mb-2"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            )}

            <button
              onClick={() => toggleWishlist({ ...game, endpoint: from })}
              className="w-full py-3 bg-[#2a2a30] hover:bg-[#3a3a40] text-white text-sm rounded-lg flex items-center justify-center gap-2"
            >
              <Bookmark size={16} className={inWishlist ? "fill-white" : ""} />
              {inWishlist ? "In Wishlist" : "Wishlist"}
            </button>
          </div>

          <div>
            <div className="flex justify-between px-[2px] mb-3 text-sm">
              <span className="text-gray-400">Developer</span>
              <span className="text-white text-right">{game.developer}</span>
            </div>
            <div className="flex justify-between px-[2px] mb-3 text-sm">
              <span className="text-gray-400">Publisher</span>
              <span className="text-white text-right">{game.publisher}</span>
            </div>
            <div className="flex justify-between px-[2px] mb-3 text-sm">
              <span className="text-gray-400">Release Date</span>
              <span className="text-white text-right">{game.releaseDate}</span>
            </div>
            <div className="flex justify-between px-[2px] mb-3 text-sm">
              <span className="text-gray-400">Platform</span>
              <span className="text-white text-right">{game.platform}</span>
            </div>

            <div className="border-t border-[#2a2a30] mt-4 pt-4 flex justify-center">
              <button
                onClick={() => setShareOpen(true)}
                className="flex items-center gap-2 text-gray-400 hover:text-white py-2 px-5 rounded-md text-sm"
              >
                <Share2 size={14} />
                Share
              </button>
            </div>
          </div>

          {ageImage && (
            <div className="mt-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#2a2a30] rounded-md overflow-hidden flex items-center justify-center p-1 shrink-0">
                <img
                  src={`${basePath}/${ageImage}`}
                  alt="Age Rating"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <p className="text-white text-sm font-bold">Age Rating</p>
                <p className="text-gray-400 text-xs">
                  Recommended age rating for this game.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div
            className="relative group w-full aspect-video rounded-xl overflow-hidden bg-[#1a1a1e] mb-4"
            onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={currentImage}
              alt={game.title}
              className="w-full h-full object-contain"
            />

            {screenshots.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  onClick={goNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {screenshots.length > 1 && (
            <div className="flex gap-2 overflow-x-auto mb-8 hide-scrollbar">
              {screenshots.map((img, index) => (
                <button
                  key={img}
                  onClick={() => setSelectedImage(index)}
                  className={`w-[110px] h-[64px] rounded-md overflow-hidden shrink-0 border-2 ${
                    selectedImage === index
                      ? "border-[#26BBFF]"
                      : "border-transparent opacity-60 hover:opacity-90"
                  }`}
                >
                  <img
                    src={`${basePath}/${img}`}
                    alt={`screenshot ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div>
            <div className="flex gap-12 mb-6 flex-wrap">
              {game.genres && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Genres</p>

                  <div className="flex gap-2 flex-wrap">
                    {game.genres.map((genre) => (
                      <span
                        key={genre}
                        className="bg-[#1e1e24] px-3 py-1 rounded text-sm text-gray-300"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {game.features && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Features</p>

                  <div className="flex gap-2 flex-wrap">
                    {game.features.map((feature) => (
                      <span
                        key={feature}
                        className="bg-[#1e1e24] px-3 py-1 rounded text-sm text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold mb-3">{game.title}</h2>

            <p className="text-gray-300 text-sm mt-2 whitespace-pre-wrap">
              {game.description}
            </p>

            <div className="mt-16">
              <h2 className="text-xl font-bold mb-6">
                {game.title} System Requirements
              </h2>

              <div className="bg-[#1a1a1e] rounded-lg p-6 md:p-10">
                <div className="border-b border-[#2a2a30] mb-8">
                  <button className="text-white border-b-2 border-[#26BBFF] pb-3 font-bold text-sm">
                    Windows
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-10">
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-6">Minimum</h3>

                    <div className="flex flex-col gap-5">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">OS version</p>
                        <p className="text-sm">Windows 10 version 21H1 (build 19043) or newer</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">CPU</p>
                        <p className="text-sm">Intel Core i3-8100 or Ryzen 5 1400</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Memory</p>
                        <p className="text-sm">6 GB</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">GPU</p>
                        <p className="text-sm">Nvidia GeForce GT 1030 (2 GB) or AMD Radeon RX 560 (2 GB) or Intel UHD Graphics 630</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">DirectX</p>
                        <p className="text-sm">DirectX 11</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-6">Recommended</h3>

                    <div className="flex flex-col gap-5">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">OS version</p>
                        <p className="text-sm">Windows 10 version 21H1 (build 19043) or newer</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">CPU</p>
                        <p className="text-sm">Intel Core i5-11600 or AMD Ryzen 5 5600</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Memory</p>
                        <p className="text-sm">8 GB</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">GPU</p>
                        <p className="text-sm">Nvidia GeForce GTX 1070 (8 GB) or AMD Radeon RX 5600 XT (6 GB) or Intel Arc A750 (8 GB)</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">DirectX</p>
                        <p className="text-sm">DirectX 12</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#2a2a30] pt-8 mb-10">
                  <h3 className="text-gray-400 text-xs mb-2">
                    Languages Supported
                  </h3>
                  <p className="text-sm mb-4">Audio: English</p>
                  <p className="text-sm">
                    Text: English, French, Italian, German, Spanish (Spain),
                    Russian, Japanese, Korean, Chinese (Simplified)
                  </p>
                </div>

                <div className="text-gray-400 text-xs">
                  <p className="mb-3">
                    {game.title} © 2025 Developed and Published by Broken Arms
                    Games srl. All rights reserved.
                  </p>

                  <a
                    href="#"
                    className="flex items-center gap-1 text-white hover:underline font-bold"
                  >
                    Privacy Policy
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



export default GameDetails;