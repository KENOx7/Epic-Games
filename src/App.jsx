import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Slider from './components/Slider';
import EpicSavings from './components/EpicSavings';
import GameDetails from './pages/GameDetails';
import './index.css';

// Ana sehife komponenti
function Home() {
  return (
    <>
      <Slider />
      <EpicSavings />
    </>
  );
}

function App() {
  return (
    <div className="bg-[#121212] min-h-screen text-white pt-8">
      <Header />
      <main className="mt-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:slug" element={<GameDetails />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
