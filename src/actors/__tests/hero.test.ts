import {describe, it, expect} from "vitest";
import {generate_hero, make_armor_locations} from "../hero.ts";

describe('HeroCard', () => {

    it('should generate a hero', () => {
        expect(generate_hero('Bob Johnson')).toEqual({
            name: 'Bob Johnson',
            accuracy: 7,
            evasion: 0,
            hp: { current: 5, maximum: 5 },
            luck: 0,
            speed: 1,
            courage: { current: 5, maximum: 5},
            strength: 1,
            armor_locations: make_armor_locations()
        })
    })
})