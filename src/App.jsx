import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Slider from './components/Slider';
import FreeGames from './components/FreeGames';
import EpicSavings from './components/EpicSavings';
import GameDetails from './pages/GameDetails';
import './index.css';
import MostPopular from './components/MostPopular';
import TopPlayerReviewed from './components/TopPlayerReviewed';
import TopSellers from './components/TopSellers';
import GameCategories from './components/GameCategories';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';

// Ana sehife komponenti
function Home() {
  return (
    <div className="bg-[#101014]">
      <Slider />
      <EpicSavings />
      <FreeGames />
      <GameCategories />
      <MostPopular/>
      <TopPlayerReviewed/>
      <TopSellers />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <div className="bg-[#101014] min-h-screen text-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:slug" element={<GameDetails />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
      </div>
    </CartProvider>
  );
}

export default App;
