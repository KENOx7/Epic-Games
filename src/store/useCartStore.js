import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cart: JSON.parse(localStorage.getItem("epic_cart") || "[]"),
  
  addToCart: (game, basePath) => {
    set((state) => {
      const exists = state.cart.some((item) => item.title === game.title);
      if (exists) return state;
      
      const newCart = [...state.cart, { ...game, cartBasePath: basePath }];
      localStorage.setItem("epic_cart", JSON.stringify(newCart));
      return { cart: newCart };
    });
  },
  
  removeFromCart: (title) => {
    set((state) => {
      const newCart = state.cart.filter((game) => game.title !== title);
      localStorage.setItem("epic_cart", JSON.stringify(newCart));
      return { cart: newCart };
    });
  },
  
  clearCart: () => {
    localStorage.setItem("epic_cart", JSON.stringify([]));
    set({ cart: [] });
  },
  
  isInCart: (title) => {
    return get().cart.some((game) => game.title === title);
  },
}));
