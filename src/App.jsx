import { Route, Routes } from "react-router-dom";
import "./index.css";

import Header from "./components/Header";
import Slider from "./components/Slider";
import FreeGames from "./components/FreeGames";
import EpicSavings from "./components/EpicSavings";
import MostPopular from "./components/MostPopular";
import TopPlayerReviewed from "./components/TopPlayerReviewed";
import TopSellers from "./components/TopSellers";
import GameCategories from "./components/GameCategories";

import GameDetails from "./pages/GameDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

function Home() {
  return (
    <>
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

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <div className="bg-[#101014] min-h-screen text-white">
          <Header />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game/:slug" element={<GameDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Routes>
          </main>
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}