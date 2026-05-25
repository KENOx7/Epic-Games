import { create } from "zustand";

export const useWishlistStore = create((set, get) => ({
  wishlist: JSON.parse(localStorage.getItem("epic_wishlist") || "[]"),

  addToWishlist: (game) => set((state) => {
    if (state.wishlist.some((item) => item.title == game.title)) return state
    const newWishlist = [...state.wishlist, game]
    localStorage.setItem("epic_wishlist", JSON.stringify(newWishlist))
    return { wishlist: newWishlist }
  }),

  removeFromWishlist: (title) => set((state) => {
    const newWishlist = state.wishlist.filter((game) => game.title != title)
    localStorage.setItem("epic_wishlist", JSON.stringify(newWishlist))
    return { wishlist: newWishlist }
  }),

  toggleWishlist: (game) => {
    if (get().isInWishlist(game.title)) {
      get().removeFromWishlist(game.title)
    } else {
      get().addToWishlist(game)
    }
  },

  isInWishlist: (title) => get().wishlist.some((game) => game.title == title)
}))