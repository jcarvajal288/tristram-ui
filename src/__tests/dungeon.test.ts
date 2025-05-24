import {describe, it, expect, vi, beforeEach} from "vitest";
import * as Die from "../util/die.ts";
import * as Combat from "../combat.ts"
import {generate_hero, type Hero} from "../actors/hero.ts";
import {cloneDeep} from "lodash";
import {set_gauge} from "../util/gauge.ts";
import {create_dungeon, enter_dungeon} from "../dungeon.ts";

describe('Dungeon', () => {

    const mockD6 = vi.spyOn(Die, 'd6')
    const mockD10 = vi.spyOn(Die, 'd10')
    const run_combat_spy = vi.spyOn(Combat, 'run_combat')

    const create_test_dungeon = () => {
        const room1_monster_roll = 8
        const room1_gold_amount_roll = 1
        const room2_monster_roll = 2
        const room3_monster_roll = 6
        const room4_monster_roll = 1
        const room4_gold_amount_roll = 4
        const room5_monster_roll = 10;
        [
            room1_monster_roll,
            room1_gold_amount_roll,
            room2_monster_roll,
            room3_monster_roll,
            room4_monster_roll,
            room4_gold_amount_roll,
            room5_monster_roll,
        ].forEach((roll) => mockD10.mockReturnValueOnce(roll))

        const room1_gold_roll = 1
        const room2_gold_roll = 6
        const room3_gold_roll = 3
        const room4_gold_roll = 2
        const room5_gold_roll = 5;
        [
            room1_gold_roll,
            room2_gold_roll,
            room3_gold_roll,
            room4_gold_roll,
            room5_gold_roll,
        ].forEach((roll) => mockD6.mockReturnValueOnce(roll))
        return create_dungeon(5)
    };

    const test_dungeon = create_test_dungeon()

    beforeEach(() => {
        vi.resetAllMocks()
    })

    it('should create a 5 room dungeon', () => {
        const dungeon = cloneDeep(test_dungeon);
        expect(dungeon.rooms).toHaveLength(5)
        expect(dungeon.rooms[0].enemies).toHaveLength(0)
        expect(dungeon.rooms[0].gold).toEqual(1)
        expect(dungeon.rooms[1].enemies[0].name).toEqual('Fallen')
        expect(dungeon.rooms[1].gold).toEqual(0)
        expect(dungeon.rooms[2].enemies[0].name).toEqual('Horror')
        expect(dungeon.rooms[2].gold).toEqual(0)
        expect(dungeon.rooms[3].enemies[0].name).toEqual('Fallen')
        expect(dungeon.rooms[3].gold).toEqual(4)
        expect(dungeon.rooms[4].enemies).toHaveLength(0)
        expect(dungeon.rooms[4].gold).toEqual(0)
    })

    it('hero kills each monster in the dungeon', () => {
        const dungeon = cloneDeep(test_dungeon)
        const hero = generate_hero('Test Hero');
        hero.hp.current = 999
        hero.strength = 10

        enter_dungeon(dungeon, hero);
        expect(run_combat_spy).toHaveBeenCalledTimes(3);
        dungeon.rooms.forEach((room) => {
            expect(room.enemies.length).toEqual(0)
        })
    })

    it('hero dies before fighting final monster', () => {
        const dungeon = cloneDeep(test_dungeon)
        const hero: Hero = generate_hero('Test Hero');
        hero.hp.current = 1
        hero.strength = 10

        const hero_initiative_roll = 10
        const enemy_initiative_roll = 1
        const hero_attack_roll = 10
        const hero_damage_roll = 10
        const hero_initiative_roll2 = 1
        const enemy_initiative_roll2 = 10
        const enemy_attack_roll = 10;
        [
            hero_initiative_roll,
            enemy_initiative_roll,
            hero_attack_roll,
            hero_damage_roll,
            hero_initiative_roll2,
            enemy_initiative_roll2,
            enemy_attack_roll
        ].forEach((value) => mockD10.mockReturnValueOnce(value))
        mockD6.mockReturnValueOnce(1)

        enter_dungeon(dungeon, hero);
        expect(run_combat_spy).toHaveBeenCalledTimes(2);
        expect(dungeon.rooms[0].enemies.length).toEqual(0)
        expect(dungeon.rooms[1].enemies.length).toEqual(0)
        expect(dungeon.rooms[2].enemies.length).toEqual(1)
        expect(dungeon.rooms[3].enemies.length).toEqual(1)
        expect(dungeon.rooms[4].enemies.length).toEqual(0)
    })

    it('hero loses courage before fighting final monster', () => {
        const dungeon = cloneDeep(test_dungeon)
        const hero: Hero = generate_hero('Test Hero');
        hero.hp.current = 100
        set_gauge(hero.courage, 2)

        const hero_initiative_roll = 9
        const enemy_initiative_roll = 1
        const hero_attack_roll = 1
        const hero_damage_roll = 1
        const enemy_attack_roll = 9
        const enemy_damage_roll = 9
        const hero_initiative_roll2 = 1
        const enemy_initiative_roll2 = 9
        const enemy_attack_roll2 = 9;
        [
            hero_initiative_roll,
            enemy_initiative_roll,
            hero_attack_roll,
            hero_damage_roll,
            enemy_attack_roll,
            enemy_damage_roll,
            hero_initiative_roll2,
            enemy_initiative_roll2,
            enemy_attack_roll2
        ].forEach((value) => mockD10.mockReturnValueOnce(value));
        [1, 1, 1, 1].forEach((value) => mockD6.mockReturnValueOnce(value))

        enter_dungeon(dungeon, hero);
        expect(run_combat_spy).toHaveBeenCalledTimes(1);
    })

    it('hero collects gold from the dungeon', () => {
        const dungeon = cloneDeep(test_dungeon)
        const hero: Hero = generate_hero('Test Hero');
        hero.hp.current = 100
        hero.courage.current = 100
        hero.strength = 10
        enter_dungeon(dungeon, hero)
        expect(hero.gold).toEqual(5)
    })
})