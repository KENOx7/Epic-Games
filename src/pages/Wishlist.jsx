import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Bookmark, ShoppingCart, CircleDollarSign } from "lucide-react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { LanguageContext } from "../context/LanguageContext";

function getSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getReward(price) {
  if (!price || price === "Free") {
    return "0.00";
  }

  const number = Number(price.slice(1));
  return (number * 0.05).toFixed(2);
}

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart, isInCart } = useContext(CartContext);
  const { t } = useContext(LanguageContext);

  if (wishlist.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-10 mt-10 min-h-[60vh]">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">{t("wishlistTitle")}</h1>

        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bookmark size={64} className="text-gray-500 mb-6" />

          <h2 className="text-2xl font-bold mb-2">{t("wishlistEmpty")}</h2>

          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            {t("wishlistEmptyDesc")}
          </p>

          <Link
            to="/"
            className="bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200"
          >
            {t("shopGames")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10 mt-10 min-h-[60vh]">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8">{t("wishlistTitle")}</h1>

      <div className="grid grid-cols-1 gap-6">
        {wishlist.map((game) => {
          const slug = getSlug(game.title);
          const endpoint = game.endpoint || "epic-savings";

          const basePath =
            game.cartBasePath ||
            `https://epic-games-api-eta.vercel.app/${endpoint}/${slug}`;

          const cover = game.saved_images?.find((img) => {
            return img === "cover.jpg" || img === "cover.png";
          });

          const ageImage = game.saved_images?.find((img) => {
            return img.startsWith("age");
          });

          const coverUrl = `${basePath}/${cover || "cover.jpg"}`;
          const ageUrl = ageImage ? `${basePath}/${ageImage}` : null;
          const inCart = isInCart(game.title);

          return (
            <div
              key={game.title}
              className="bg-[#18181c] rounded-xl p-4 flex flex-col sm:flex-row gap-4"
            >
              <div className="flex gap-4 flex-1 min-w-0">
                <Link
                  to={`/game/${slug}?from=${endpoint}`}
                  className="w-[74px] h-[100px] sm:w-[120px] sm:h-[160px] bg-[#111] rounded-lg overflow-hidden shrink-0"
                >
                  <img
                    src={coverUrl}
                    alt={game.title}
                    className="w-full h-full object-contain"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-[#2a2a2a] text-[10px] sm:text-xs px-2 py-1 rounded text-gray-300 font-bold">
                      {t("baseGame")}
                    </span>

                    {game.features?.includes("Early Access") && (
                      <span className="bg-[#2a2a2a] text-[10px] sm:text-xs px-2 py-1 rounded text-gray-300 font-bold">
                        {t("earlyAccess")}
                      </span>
                    )}
                  </div>

                  <Link to={`/game/${slug}?from=${endpoint}`}>
                    <h2 className="text-lg sm:text-xl font-bold leading-tight line-clamp-2">
                      {game.title}
                    </h2>
                  </Link>

                  {game.platform && (
                    <p className="text-gray-500 text-xs mt-3">
                      {game.platform}
                    </p>
                  )}

                  {ageUrl && (
                    <div className="border border-[#333] rounded-lg p-3 mt-4 hidden sm:flex items-center gap-3 max-w-[260px]">
                      <img
                        src={ageUrl}
                        alt="Age rating"
                        className="w-12 h-12 object-contain bg-white"
                      />

                      <div>
                        <p className="text-white text-sm font-bold">
                          {game.ageRating || "12+"}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {game.ageDescription ? t(game.ageDescription) || game.ageDescription : t("moderateViolence")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {ageUrl && (
                <div className="border border-[#333] rounded-lg p-3 flex sm:hidden items-center gap-3">
                  <img
                    src={ageUrl}
                    alt="Age rating"
                    className="w-12 h-12 object-contain bg-white"
                  />

                  <div>
                    <p className="text-white text-sm font-bold">
                      {game.ageRating || "12+"}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {game.ageDescription ? t(game.ageDescription) || game.ageDescription : t("moderateViolence")}
                    </p>
                  </div>
                </div>
              )}

              <div className="sm:w-auto sm:min-w-[260px] flex flex-col sm:items-end sm:justify-between gap-4">
                <div className="sm:text-right">
                  <div className="flex flex-wrap items-center sm:justify-end gap-2">
                    {game.discount && (
                      <span className="bg-[#26bbff] text-black text-xs font-bold px-2 py-1 rounded">
                        {game.discount}
                      </span>
                    )}

                    {game.oldPrice && (
                      <span className="text-gray-500 line-through text-sm">
                        {game.oldPrice}
                      </span>
                    )}

                    <span className="text-lg font-bold">
                      {game.newPrice || t("Free")}
                    </span>
                  </div>

                  {game.saleEnds && (
                    <p className="text-gray-400 text-xs mt-2">
                      {t("saleEndsPrefix")} {game.saleEnds}
                    </p>
                  )}

                  <p className="text-[#b7d36b] text-sm flex items-center gap-2 sm:justify-end mt-4 sm:whitespace-nowrap">
                    <CircleDollarSign size={16} className="text-yellow-300" />
                    {t("earnEpicRewards")} ${getReward(game.newPrice)}
                  </p>


                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => removeFromWishlist(game.title)}
                    className="text-sm text-gray-400 underline"
                  >
                    {t("remove")}
                  </button>

                  {inCart ? (
                    <Link
                      to="/cart"
                      className="border border-[#3a3a3a] px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={14} />
                      {t("viewInCart")}
                    </Link>
                  ) : (
                    <button
                      onClick={() => addToCart(game, basePath)}
                      className="bg-[#26bbff] sm:bg-transparent text-black sm:text-white border border-[#26bbff] sm:border-[#3a3a3a] px-4 py-2 rounded-lg text-sm font-bold sm:font-normal flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={14} className="hidden sm:block" />
                      {t("addToCartBtn")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}