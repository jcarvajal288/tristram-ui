import './App.css'
import {generate_hero} from "./actors/hero.ts";
import HeroCard from "./actors/HeroCard.tsx";
import {Button, Stack} from "@mui/material";

const App = () => {
  const hero = generate_hero("Bob Johnson")

  return (
      <Stack>
        <HeroCard hero={hero}/>
        <Button>Enter Dungeon</Button>
      </Stack>
  )
};

export default App
