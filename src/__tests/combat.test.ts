import {describe, it, expect, vi} from "vitest";
import {generate_hero, type Hero} from "../actors/hero.ts";
import {fallen, type Monster} from "../actors/monster.ts";
import * as Die from "../util/die.ts"
import {run_combat_round} from "../combat.ts";
import {make_gauge} from "../util/gauge.ts";

describe('Combat', () => {

    const mockD10 = vi.spyOn(Die, 'd10')
    const test_hero: Hero = {
        name: 'Test Hero',
        accuracy: 7,
        evasion: 0,
        hp: make_gauge(5),
        luck: 0,
        speed: 1,
        courage: make_gauge(5),
        strength: 1,
    }

    const test_monster: Monster = {
        name: "Fallen",
        accuracy: 5,
        evasion: 0,
        luck: 0,
        speed: 1,
        hp: make_gauge(3),
        toughness: 2,
        damage: 1    }

    it('Hero can hit enemy and do damage', () => {
        const hero_init_roll = 8
        const enemy_init_roll = 3
        const hero_attack_roll = 8;
        const hero_damage_roll = 5;
        [
            hero_init_roll,
            enemy_init_roll,
            hero_attack_roll,
            hero_damage_roll
        ].forEach(value => mockD10.mockReturnValueOnce(value))

        const hero = { ...test_hero }
        const monster = { ...test_monster }
        run_combat_round(hero, monster)
        expect(monster.hp.current).toEqual(2)
    })
})
