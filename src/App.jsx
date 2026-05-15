import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./index.css";

import Header from "./components/Header";
import Slider from "./components/Slider";
import FreeGames from "./components/FreeGames";
import EpicSavings from "./components/EpicSavings";
import MostPopular from "./components/MostPopular";
import TopPlayerReviewed from "./components/TopPlayerReviewed";
import TopSellers from "./components/TopSellers";
import GameCategories from "./components/GameCategories";
import MegaSale from "./components/MegaSale";

import GameDetails from "./pages/GameDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Footer from "./components/Footer";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}

function Home() {
  return (
    <>
      <MegaSale />
      <Slider />
      <EpicSavings />
      <FreeGames />
      <GameCategories />
      <MostPopular />
      <TopPlayerReviewed />
      <TopSellers />
    </>
  );
}

import Browse from "./pages/Browse";

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <ScrollToTop />
        <div className="bg-[#101014] min-h-screen text-white">
          <Header />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game/:slug" element={<GameDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/browse" element={<Browse />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}