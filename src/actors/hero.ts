import type {Creature} from "./creature.ts";
import {type Gauge, make_gauge} from "../util/gauge.ts";

export type Hero = Creature & {
    strength: number
    courage: Gauge
}

export const generate_hero = (name: string): Hero => {
    return {
        name: name,
        accuracy: 0,
        evasion: 0,
        hp: make_gauge(5),
        luck: 0,
        speed: 0,
        courage: make_gauge(5),
        strength: 0,
    }
}