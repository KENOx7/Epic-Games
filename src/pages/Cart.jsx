import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Gift, Bookmark } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import Checkout from "../components/Checkout";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const getPrice = (price) => {
    if (!price || price === "Free" || price === "—") return 0;
    return parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
  };

  let total = 0;
  let discount = 0;

  cart.forEach((game) => {
    const oldPrice = getPrice(game.oldPrice || game.newPrice);
    const newPrice = getPrice(game.newPrice || game.oldPrice);

    total += oldPrice;

    if (oldPrice > newPrice) {
      discount += oldPrice - newPrice;
    }
  });

  const subtotal = total - discount;
  const subtotalText = subtotal.toFixed(2);

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const finishCheckout = () => {
    clearCart();
    setIsCheckoutOpen(false);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto mt-10 px-4 min-h-[60vh]">
        <h1 className="text-4xl font-bold mb-8">My Cart</h1>

        <div className="bg-[#18181c] rounded-xl p-10 text-center flex flex-col items-center">
          <Gift size={64} className="mb-4 text-[#3a3a3a]" />

          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Shop for games and apps.</p>

          <Link
            to="/"
            className="bg-[#26bbff] text-black font-bold px-6 py-3 rounded-lg"
          >
            Shop for Games
          </Link>
        </div>
      </div>
    );
  }

  const checkoutGame = {
    title: `${cart.length} Item${cart.length > 1 ? "s" : ""} in Cart`,
    publisher: "Epic Games Store",
    oldPrice: `$${total.toFixed(2)}`,
    newPrice: subtotal === 0 ? "Free" : `$${subtotalText}`,
    discount: discount > 0 ? `-$${discount.toFixed(2)}` : null,
  };

  return (
    <div className="max-w-[1200px] mx-auto mt-10 px-4 min-h-[60vh]">
      {isCheckoutOpen && (
        <Checkout
          game={checkoutGame}
          basePath={cart[0]?.cartBasePath || ""}
          cartItems={cart}
          onClose={closeCheckout}
          onSuccess={finishCheckout}
        />
      )}

      <h1 className="text-4xl font-bold mb-8">My Cart</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          {cart.map((game) => {
            const cover = game.saved_images?.find((img) => {
              return img === "cover.jpg" || img === "cover.png";
            });

            const coverUrl = `${game.cartBasePath}/${cover || "cover.jpg"}`;
            const inWishlist = isInWishlist(game.title);

            return (
              <div
                key={game.title}
                className="bg-[#18181c] rounded-xl p-4 flex gap-4"
              >
                <div className="w-[120px] h-[160px] bg-[#111] rounded-lg overflow-hidden shrink-0">
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
                          {Array.isArray(game.genres)
                            ? game.genres.join(", ")
                            : game.genres}
                        </span>
                      )}

                      <h2 className="text-xl font-bold mt-2">{game.title}</h2>

                      {game.newPrice !== "Free" && (
                        <p className="text-sm text-gray-400 mt-3">
                          Refundable
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2">
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

                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      onClick={() => removeFromCart(game.title)}
                      className="text-sm text-gray-400 underline"
                    >
                      Remove
                    </button>

                    <button
                      onClick={() => toggleWishlist(game)}
                      className="border border-[#3a3a3a] px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                    >
                      <Bookmark
                        size={14}
                        className={inWishlist ? "fill-white" : ""}
                      />
                      {inWishlist ? "In Wishlist" : "Move to Wishlist"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full lg:w-[320px]">
          <div className="bg-[#18181c] rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Summary</h2>

            <div className="flex justify-between mb-3 text-sm">
              <span>Price</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between mb-3 text-sm">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between border-t border-[#333] pt-4 mb-6 font-bold">
              <span>Subtotal</span>
              <span>${subtotalText}</span>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full bg-[#26bbff] text-black font-bold py-3.5 rounded-lg"
            >
              Check Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}