import Header from './components/Header';
import Slider from './components/Slider';
import EpicSavings from './components/EpicSavings';
import './index.css';

function App() {
  return (
    <div className="bg-[#121212] min-h-screen text-white pt-8">
      <Header />
      <main className="mt-8">
        <Slider />
        <EpicSavings />
      </main>
    </div>
  );
}

export default App;
