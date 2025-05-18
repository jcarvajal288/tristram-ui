import {describe, it, expect, vi, beforeEach} from "vitest";
import {type Hero, type ArmorLocations, make_armor_locations} from "../actors/hero.ts";
import {type Monster} from "../actors/monster.ts";
import * as Die from "../util/die.ts"
import {enemy_takes_hit, enemy_turn, hero_takes_hit, hero_turn, run_combat_round} from "../combat.ts";
import {make_gauge} from "../util/gauge.ts";
import {cloneDeep} from "lodash";

describe('Combat', () => {

    const mockD6 = vi.spyOn(Die, 'd6')
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
        armor_locations: make_armor_locations()
    }

    const test_enemy: Monster = {
        name: "Test Monster",
        accuracy: 5,
        evasion: 0,
        luck: 0,
        speed: 1,
        hp: make_gauge(3),
        toughness: 2,
        damage: 1    }

    beforeEach(() => {
        vi.resetAllMocks()
    })

    it('both hero and enemy miss each other', () => {
        const hero_init_roll = 8
        const enemy_init_roll = 3
        const hero_attack_roll = 8;
        const hero_damage_roll = 5;
        const enemy_attack_roll = 5;
        [
            hero_init_roll,
            enemy_init_roll,
            hero_attack_roll,
            hero_damage_roll,
            enemy_attack_roll
        ].forEach(value => mockD10.mockReturnValueOnce(value))
    })

    it('hero kills enemy before enemy can act', () => {
        const hero_init_roll = 8
        const enemy_init_roll = 3
        const hero_attack_roll = 8;
        const hero_damage_roll = 5;
        [
            hero_init_roll,
            enemy_init_roll,
            hero_attack_roll,
            hero_damage_roll,
        ].forEach(value => mockD10.mockReturnValueOnce(value))

        mockD6.mockReturnValueOnce(4)

        const hero = cloneDeep(test_hero)
        const enemy = cloneDeep(test_enemy)
        hero.strength = enemy.hp.current
        run_combat_round(hero, enemy)
        expect(enemy.hp.current).toEqual(0)
        Object.keys(hero.armor_locations).forEach((hl) => {
            expect(hero.armor_locations[hl as keyof ArmorLocations]).toEqual(0);
        })
    })

    it('enemy kills hero before hero can act', () => {
        const hero_init_roll = 4
        const enemy_init_roll = 5
        const enemy_attack_roll = 8;
        [
            hero_init_roll,
            enemy_init_roll,
            enemy_attack_roll,
        ].forEach(value => mockD10.mockReturnValueOnce(value))

        mockD6.mockReturnValueOnce(4)

        const hero = cloneDeep(test_hero)
        const enemy = cloneDeep(test_enemy)
        enemy.damage = hero.hp.current
        run_combat_round(hero, enemy)
        expect(enemy.hp.current).toEqual(enemy.hp.maximum)
        expect(hero.hp.current).toEqual(0)
    })

    describe('hero_turn', () => {

        const ht_hero = {
            ...cloneDeep(test_hero),
            accuracy: 5
        }

        const ht_enemy = {
            ...cloneDeep(test_enemy),
        }

        it('hero misses enemy', () => {
            mockD10.mockReturnValueOnce(4)
            const hero: Hero = cloneDeep(ht_hero)
            const enemy: Monster = cloneDeep(ht_enemy)
            hero_turn(hero, enemy)
            expect(enemy.hp.current).toEqual(enemy.hp.maximum)
        })

        it('hero hits enemy', () => {
            mockD10.mockReturnValueOnce(5)
            const hero: Hero = cloneDeep(ht_hero)
            const enemy: Monster = cloneDeep(ht_enemy)
            hero_turn(hero, enemy)
            expect(enemy.hp.current).toEqual(enemy.hp.maximum - 1)
        })
    })

    describe('enemy turn', () => {
        const et_hero = {
            ...cloneDeep(test_hero),
            evasion: 2,
            armor_locations: {
                head: 2,
                arms: 2,
                body: 2,
                waist: 2,
                legs: 2,
            }
        }

        const et_enemy = {
            ...cloneDeep(test_enemy),
            accuracy: 5,
            damage: 1
        }

        it('enemy misses hero', () => {
            mockD10.mockReturnValueOnce(4)
            const hero: Hero = cloneDeep(et_hero)
            const enemy: Monster = cloneDeep(et_enemy)
            enemy_turn(hero, enemy)
            expect(hero.hp.current).toEqual(hero.hp.maximum)
        })

        it('enemy hits hero', () => {
            mockD10.mockReturnValueOnce(7)
            mockD6.mockReturnValueOnce(1)
            const hero: Hero = cloneDeep(et_hero)
            const enemy: Monster = cloneDeep(et_enemy)
            enemy_turn(hero, enemy)
            expect(hero.armor_locations['head']).toEqual(1)
        })
    })

    describe('hero_takes_hit', () => {

        const hth_hero = {
            ...cloneDeep(test_hero),
            armor_locations: {
                head: 2,
                arms: 2,
                body: 2,
                waist: 2,
                legs: 2,
            }
        }

        const hth_enemy = {
            ...cloneDeep(test_enemy),
            strength: 1
        }

        const die_roll_for_location = (location: string): number => {
            switch (location) {
                case 'head': return 1;
                case 'arms': return 2;
                case 'body': return 3;
                case 'waist': return 5;
                case 'legs': return 6;
                default: return 4;
            }
        }

        it.each([
            'head', 'arms', 'body', 'waist', 'legs'
        ])("hero takes hit to the %s that doesn't pierce armor", (hit_location) => {
            mockD6.mockReturnValueOnce(die_roll_for_location(hit_location))
            const hero: Hero = cloneDeep(hth_hero)
            const enemy: Monster = cloneDeep(hth_enemy)
            hero_takes_hit(hero, enemy)
            expect(hero.armor_locations[hit_location as keyof ArmorLocations]).toEqual(1)
            Object.keys(hero.armor_locations).filter(x => x !== hit_location).forEach((hl) => {
                expect(hero.armor_locations[hl as keyof ArmorLocations]).toEqual(2)
            })
            expect(hero.hp.current).toEqual(hero.hp.maximum)
        })

        it.each([
            'arms', 'body', 'waist', 'legs'
        ])("hero takes hit to the %s that gives light wound", (hit_location) => {
            mockD6.mockReturnValueOnce(die_roll_for_location(hit_location))
            const hero: Hero = cloneDeep(hth_hero)
            const enemy: Monster = cloneDeep(hth_enemy)
            enemy.damage = 3
            hero_takes_hit(hero, enemy)
            expect(hero.armor_locations[hit_location as keyof ArmorLocations]).toEqual(-1)
            Object.keys(hero.armor_locations).filter(x => x !== hit_location).forEach((hl) => {
                expect(hero.armor_locations[hl as keyof ArmorLocations]).toEqual(2)
            })
            expect(hero.hp.current).toEqual(hero.hp.maximum)
        })

        it("hero takes hit to the head that gives severe wound", () => {
            mockD6.mockReturnValueOnce(die_roll_for_location('head'))
            const hero: Hero = cloneDeep(hth_hero)
            const enemy: Monster = cloneDeep(hth_enemy)
            enemy.damage = 5
            hero_takes_hit(hero, enemy)
            expect(hero.armor_locations['head']).toEqual(-1);
            ['arms', 'body', 'waist', 'legs'].forEach((hl) => {
                expect(hero.armor_locations[hl as keyof ArmorLocations]).toEqual(2)
            })
            expect(hero.hp.current).toEqual(hero.hp.maximum - 3)
            expect(hero.courage.current).toEqual(hero.courage.maximum - 1)
        })

        it.each([
            'arms', 'body', 'waist', 'legs'
        ])("hero takes hit to the %s that gives severe wound", (hit_location) => {
            mockD6.mockReturnValueOnce(die_roll_for_location(hit_location))
            const hero: Hero = cloneDeep(hth_hero)
            const enemy: Monster = cloneDeep(hth_enemy)
            enemy.damage = 5
            hero_takes_hit(hero, enemy)
            expect(hero.armor_locations[hit_location as keyof ArmorLocations]).toEqual(-2)
            Object.keys(hero.armor_locations).filter(x => x !== hit_location).forEach((hl) => {
                expect(hero.armor_locations[hl as keyof ArmorLocations]).toEqual(2)
            })
            expect(hero.hp.current).toEqual(hero.hp.maximum - 3)
            expect(hero.courage.current).toEqual(hero.courage.maximum - 1)
        })
    })

    describe('enemy_takes_hit', () => {

        const eth_hero = {
            ...cloneDeep(test_hero),
            strength: 3
        }

        const eth_enemy = {
            ...cloneDeep(test_enemy),
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
