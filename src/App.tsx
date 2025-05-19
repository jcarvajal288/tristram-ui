import './App.css'
import {generate_hero, type Hero} from "./actors/hero.ts";
import HeroCard from "./actors/HeroCard.tsx";
import {Button, Stack} from "@mui/material";
import {useEffect, useState} from 'react';
import {enter_dungeon} from "./dungeon.ts";

const App = () => {
    const [heroes, setHeroes] = useState<Hero[]>([])

    useEffect(() => {
        setHeroes([
            generate_hero("Bob Johnson"),
            generate_hero("Rick Sanchez"),
            generate_hero("Charles Norris"),
        ])
    }, [])

    return (
        <Stack>
        {
            heroes.map((hero: Hero) => (
                <Stack direction='row' key={`${hero.name}`}>
                    <HeroCard hero={hero}/>
                    <Button
                        data-testid={`${hero.name}-enter-dungeon`}
                        onClick={() => enter_dungeon(hero)}
                    >
                        Enter Dungeon
                    </Button>
                </Stack>
            ))
        }
        </Stack>
    )
};

export default App
