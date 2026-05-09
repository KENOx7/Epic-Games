import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Slider from './components/Slider';
import FreeGames from './components/FreeGames';
import EpicSavings from './components/EpicSavings';
import GameDetails from './pages/GameDetails';
import './index.css';
import Trending from './components/Trending';

// Ana sehife komponenti
function Home() {
  return (
    <div className="bg-[#101014]">
      <Slider />
      <EpicSavings />
      <FreeGames />
      <Trending/>
    </div>
  );
}

function App() {
  return (
    <div className="bg-[#121212] min-h-screen text-white">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:slug" element={<GameDetails />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
