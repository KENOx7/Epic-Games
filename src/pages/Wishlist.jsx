import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Bookmark, ShoppingCart } from "lucide-react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";

function getSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart, isInCart } = useContext(CartContext);

  if (wishlist.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-10 mt-10 min-h-[60vh]">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Wishlist</h1>

        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bookmark size={64} className="text-gray-500 mb-6" />

          <h2 className="text-2xl font-bold mb-2">Your Wishlist is empty</h2>

          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Find games and add them to your wishlist to buy them later.
          </p>

          <Link
            to="/"
            className="bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200"
          >
            Shop for Games
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10 mt-10 min-h-[60vh]">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8">Wishlist</h1>

      <div className="grid grid-cols-1 gap-6">
        {wishlist.map((game) => {
          const cover = game.saved_images?.find((img) => {
            return img === "cover.jpg" || img === "cover.png";
          });

          const slug = getSlug(game.title);
          const endpoint = game.endpoint || "epic-savings";
          const basePath =
            game.cartBasePath ||
            `https://epic-games-api-eta.vercel.app/${endpoint}/${slug}`;

          const coverUrl = `${basePath}/${cover || "cover.jpg"}`;
          const inCart = isInCart(game.title);

          return (
            <div
              key={game.title}
              className="bg-[#18181c] rounded-xl p-4 flex flex-col sm:flex-row gap-4"
            >
              <div className="w-full sm:w-[120px] h-[220px] sm:h-[160px] bg-[#111] rounded-lg overflow-hidden shrink-0">
                <img
                  src={coverUrl}
                  alt={game.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between gap-4 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div className="min-w-0">
                    {game.genres && (
                      <span className="inline-block bg-[#2a2a2a] text-xs px-2 py-1 rounded text-gray-300 mb-2">
                        {Array.isArray(game.genres)
                          ? game.genres.join(", ")
                          : game.genres}
                      </span>
                    )}

                    <h2 className="text-lg sm:text-xl font-bold">
                      {game.title}
                    </h2>
                  </div>

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
                        {game.newPrice || "Free"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                  <button
                    onClick={() => removeFromWishlist(game.title)}
                    className="text-sm text-gray-400 underline sm:px-2 py-2 text-left sm:text-center"
                  >
                    Remove
                  </button>

                  {inCart ? (
                    <Link
                      to="/cart"
                      className="border border-[#3a3a3a] px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={14} />
                      View in Cart
                    </Link>
                  ) : (
                    <button
                      onClick={() => addToCart(game, basePath)}
                      className="border border-[#3a3a3a] px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={14} />
                      Add to Cart
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