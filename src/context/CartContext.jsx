import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // LocalStorage-dən səbəti oxuyuruq
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('epic_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Səbət dəyişəndə LocalStorage-ə yazırıq
  useEffect(() => {
    localStorage.setItem('epic_cart', JSON.stringify(cart));
  }, [cart]);

  // Səbətə oyun əlavə etmək (şəkilləri düzgün çəkmək üçün basePath-i də saxlayırıq)
  const addToCart = (game, basePath) => {
    if (!cart.find(item => item.title === game.title)) {
      setCart([...cart, { ...game, cartBasePath: basePath }]);
    }
  };

  // Səbətdən silmək
  const removeFromCart = (title) => {
    setCart(cart.filter(item => item.title !== title));
  };

  // Oyunun səbətdə olub-olmadığını yoxlamaq
  const isInCart = (title) => {
    return cart.some(item => item.title === title);
  };

  // Səbəti tamamilə təmizləmək (Checkout etdikdən sonra)
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isInCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
