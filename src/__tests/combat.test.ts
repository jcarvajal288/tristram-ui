import {describe, it, expect, vi} from "vitest";
import {type Hero} from "../actors/hero.ts";
import {type Monster} from "../actors/monster.ts";
import * as Die from "../util/die.ts"
import {enemy_takes_hit, run_combat_round} from "../combat.ts";
import {make_gauge} from "../util/gauge.ts";
import {cloneDeep} from "lodash";

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

        const hero = cloneDeep(test_hero)
        const monster = cloneDeep(test_monster)
        run_combat_round(hero, monster)
        expect(monster.hp.current).toEqual(2)
    })

    describe('enemy_takes_hit', () => {

        const eth_hero = {
            ...cloneDeep(test_hero),
            strength: 3
        }

        const eth_enemy = {
            ...cloneDeep(test_monster),
            toughness: 5
        }

        it('enemy takes hit below toughness', () => {
            mockD10.mockReturnValueOnce(1)
            const monster = cloneDeep(eth_enemy)
            const hero = cloneDeep(eth_hero)
            enemy_takes_hit(monster, hero)
            expect(monster.hp.current).toEqual(monster.hp.maximum)
        })

        it('enemy takes hit at exact toughness', () => {
            mockD10.mockReturnValueOnce(2)
            const monster = cloneDeep(eth_enemy)
            const hero = cloneDeep(eth_hero)
            enemy_takes_hit(monster, hero)
            expect(monster.hp.current).toEqual(monster.hp.maximum)
        })

        it('enemy takes hit above toughness and below hero strength', () => {
            mockD10.mockReturnValueOnce(4)
            const monster = cloneDeep(eth_enemy)
            const hero = cloneDeep(eth_hero)
            enemy_takes_hit(monster, hero)
            expect(monster.hp.current).toEqual(monster.hp.maximum - 2)
        })

        it('enemy takes hit above toughness and above hero strength', () => {
            mockD10.mockReturnValueOnce(7)
            const monster = cloneDeep(eth_enemy)
            const hero = cloneDeep(eth_hero)
            enemy_takes_hit(monster, hero)
            expect(monster.hp.current).toEqual(monster.hp.maximum - 3)
        })
    })
})
