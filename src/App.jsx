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

import Browse from "./pages/Browse";
import GameDetails from "./pages/GameDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Support from "./pages/Support";
import Footer from "./components/Footer";

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
      <MostPopular />
      <GameCategories />
      <TopPlayerReviewed />
      <TopSellers />
    </>
  );
}

function App() {
  return (
    <>
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
            <Route path="/support" element={<Support />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
}
export default App;