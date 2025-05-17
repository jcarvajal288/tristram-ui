import type {Creature} from "./creature.ts";
import {type Gauge, make_gauge} from "../util/gauge.ts";

export type Hero = Creature & {
    strength: number
    courage: Gauge
    armor_locations: ArmorLocations
}

export const generate_hero = (name: string): Hero => {
    return {
        name: name,
        accuracy: 7,
        evasion: 0,
        hp: make_gauge(5),
        luck: 0,
        speed: 1,
        courage: make_gauge(5),
        strength: 1,
        armor_locations: make_armor_locations()
    }
}

export type ArmorLocations = {
    head: number
    arms: number
    body: number
    waist: number
    legs: number
}

export const make_armor_locations = (): ArmorLocations => ({
    head: 0,
    arms: 0,
    body: 0,
    waist: 0,
    legs: 0
})