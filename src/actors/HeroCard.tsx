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
                <StatLabel label='Strength' amount={props.hero.accuracy}/>
                <StatLabel label='Evasion' amount={props.hero.accuracy}/>
                <StatLabel label='Luck' amount={props.hero.accuracy}/>
                <StatLabel label='Speed' amount={props.hero.accuracy}/>
            </Stack>
        </Stack>
    )
}

export default HeroCard;