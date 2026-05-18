import Slider from "../components/Slider";
import FreeGames from "../components/FreeGames";
import EpicSavings from "../components/EpicSavings";
import MostPopular from "../components/MostPopular";
import TopPlayerReviewed from "../components/TopPlayerReviewed";
import TopSellers from "../components/TopSellers";
import GameCategories from "../components/GameCategories";
import MegaSale from "../components/MegaSale";

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

export default Home;
