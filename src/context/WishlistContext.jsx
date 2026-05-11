import { createContext, useEffect, useState } from "react";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("epic_wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    localStorage.setItem("epic_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (title) => {
    return wishlist.some((game) => game.title === title);
  };

  const addToWishlist = (game) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.title === game.title);
      return exists ? prev : [...prev, game];
    });
  };

  const removeFromWishlist = (title) => {
    setWishlist((prev) => prev.filter((game) => game.title !== title));
  };

  const toggleWishlist = (game) => {
    if (isInWishlist(game.title)) {
      removeFromWishlist(game.title);
      return;
    }

    addToWishlist(game);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}