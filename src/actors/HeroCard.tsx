import type {Hero} from "./hero.ts";
import {Stack, Typography} from "@mui/material";

const StatLabel = (props: { label: string, amount: number }) => {
    return (
        <Stack>
            <Typography>{props.amount}</Typography>
            <Typography variant='subtitle1'>{props.label}</Typography>
        </Stack>
    )
}

const HeroCard = (props: { hero: Hero }) => {
    return (
        <Stack>
            <Typography variant='h5'>{props.hero.name}</Typography>
            <Stack direction='row' gap={1}>
                <StatLabel label='Accuracy' amount={props.hero.accuracy}/>
                <StatLabel label='Strength' amount={props.hero.strength}/>
                <StatLabel label='Evasion' amount={props.hero.evasion}/>
                <StatLabel label='Luck' amount={props.hero.luck}/>
                <StatLabel label='Speed' amount={props.hero.speed}/>
            </Stack>
            <Stack direction='row' gap={1}>
                <Typography>{`HP: ${props.hero.hp.current}/${props.hero.hp.maximum}`}</Typography>
                <Typography>{`Gold: ${props.hero.gold}`}</Typography>
            </Stack>
        </Stack>
    )
}

export default HeroCard;