import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ShoppingCart } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart, isInCart } = useContext(CartContext);

  const getPrice = (price) => {
    if (!price || price === 'Free') return 0;
    return parseFloat(price.replace(/[^0-9.]/g, ''));
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10 mt-10 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-8">Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bookmark size={64} className="text-gray-500 mb-6" />
          <h2 className="text-2xl font-bold mb-2">Your Wishlist is empty</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Find games and add them to your wishlist to buy them later.
          </p>
          <Link
            to="/"
            className="bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition"
          >
            Shop for Games
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {wishlist.map((game, index) => {
            const cover = game.saved_images?.find(
              img => img === 'cover.jpg' || img === 'cover.png'
            );

            const slug = game.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-');

            const basePath =
              game.cartBasePath ||
              `https://epic-games-api-eta.vercel.app/${game.endpoint || 'epic-savings'}/${slug}`;

            const coverUrl = `${basePath}/${cover || 'cover.jpg'}`;

            return (
              <div
                key={index}
                className="bg-[#18181c] rounded-xl p-4 flex gap-4"
              >
                <div className="w-[120px] h-[160px] bg-[#111] rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={coverUrl}
                    alt={game.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between gap-4">
                    <div>
                      {game.genres && (
                        <span className="bg-[#2a2a2a] text-xs px-2 py-1 rounded text-gray-300">
                          {game.genres.join ? game.genres.join(', ') : game.genres}
                        </span>
                      )}

                      <h2 className="text-xl font-bold mt-2">
                        {game.title}
                      </h2>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
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
                          {game.newPrice || 'Free'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      onClick={() => removeFromWishlist(game.title)}
                      className="text-sm text-gray-400 underline"
                    >
                      Remove
                    </button>

                    {isInCart(game.title) ? (
                      <Link 
                        to="/cart"
                        className="border border-[#3a3a3a] px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                      >
                        <ShoppingCart size={14} />
                        View in Cart
                      </Link>
                    ) : (
                      <button 
                        onClick={() => addToCart(game, basePath)}
                        className="border border-[#3a3a3a] px-4 py-2 rounded-lg text-sm flex items-center gap-2"
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
      )}
    </div>
  );
}
