import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cart: JSON.parse(localStorage.getItem("epic_cart") || "[]"),
  
  addToCart: (game, basePath) => set((state) => {
    if (state.cart.find((item) => item.title == game.title)) return state
    const newCart = [...state.cart, { ...game, cartBasePath: basePath }]
    localStorage.setItem("epic_cart", JSON.stringify(newCart))
    return { cart: newCart }
  }),
  
  removeFromCart: (title) => set((state) => {
    const newCart = state.cart.filter((game) => game.title != title)
    localStorage.setItem("epic_cart", JSON.stringify(newCart))
    return { cart: newCart }
  }),
  
  clearCart: () => {
    localStorage.setItem("epic_cart", JSON.stringify([]))
    set({ cart: [] })
  },
  
  isInCart: (title) => get().cart.find((game) => game.title == title)
}))