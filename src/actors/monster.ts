import type {Creature} from "./creature.ts";
import {make_gauge} from "../util/gauge.ts";

export type Monster = Creature & {
    toughness: number
    damage: number
}

export const fallen = (): Monster => {
    return {
        name: "Fallen",
        accuracy: 5,
        evasion: 0,
        luck: 0,
        speed: 1,
        hp: make_gauge(3),
        toughness: 2,
        damage: 1
    }
}

export const horror = (): Monster => {
    return {
        accuracy: 4,
        damage: 2,
        evasion: 0,
        hp: make_gauge(8),
        luck: 0,
        name: "Horror",
        speed: 2,
        toughness: 6
    }
}