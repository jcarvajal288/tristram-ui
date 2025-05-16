import './App.css'
import {generate_hero} from "./actors/hero.ts";
import HeroCard from "./actors/HeroCard.tsx";

const App = () => {
  const hero = generate_hero("Bob Johnson")

  return (
    <HeroCard hero={hero}/>
  )
};

export default App
