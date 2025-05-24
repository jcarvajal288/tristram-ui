import './App.css'
import {generate_hero, type Hero} from "./actors/hero.ts";
import {useEffect, useState} from 'react';
import {create_dungeon, type Dungeon} from "./dungeon.ts";
import {HeroRoster} from "./actors/HeroRoster.tsx";

const App = () => {
    const [heroes, setHeroes] = useState<Hero[]>([])
    const dungeon: Dungeon = create_dungeon(20)

    useEffect(() => {
        setHeroes([
            generate_hero("Bob Johnson"),
            generate_hero("Rick Sanchez"),
            generate_hero("Charles Norris"),
        ])
    }, [])

    useEffect(() => {}, [heroes])

    return (
        <HeroRoster heroes={heroes} dungeon={dungeon}/>
    )
};

export default App
