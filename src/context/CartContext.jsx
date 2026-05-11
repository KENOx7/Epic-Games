import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("epic_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("epic_cart", JSON.stringify(cart));
  }, [cart]);

  const isInCart = (title) => {
    return cart.some((game) => game.title === title);
  };

  const addToCart = (game, basePath) => {
    setCart((prev) => {
      const exists = prev.some((item) => item.title === game.title);

      if (exists) {
        return prev;
      }

      return [...prev, { ...game, cartBasePath: basePath }];
    });
  };

  const removeFromCart = (title) => {
    setCart((prev) => prev.filter((game) => game.title !== title));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        isInCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}