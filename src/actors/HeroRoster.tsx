import type {Hero} from "./hero.ts";
import {type Dungeon, enter_dungeon} from "../dungeon.ts";
import {Button, Stack} from "@mui/material";
import HeroCard from "./HeroCard.tsx";

type HeroRoster = {
    heroes: Hero[]
    dungeon: Dungeon
}

export const HeroRoster = (props: HeroRoster) => {

    return (
        <Stack>
            {
                props.heroes.map((hero: Hero) => (
                    <Stack direction='row' key={`${hero.name}`}>
                        <HeroCard hero={hero}/>
                        <Button
                            data-testid={`${hero.name}-enter-dungeon`}
                            onClick={() => enter_dungeon(props.dungeon, hero)}
                        >
                            Enter Dungeon
                        </Button>
                    </Stack>
                ))
            }
        </Stack>
    )
}