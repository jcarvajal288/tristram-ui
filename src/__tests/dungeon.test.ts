import {describe, it, expect, vi} from "vitest";
import * as Die from "../util/die.ts";
import {create_dungeon} from "../dungeon.ts";

describe('Dungeon', () => {

    const mockD6 = vi.spyOn(Die, 'd6')
    const mockD10 = vi.spyOn(Die, 'd10')

    it('should create a 5 room dungeon', () => {
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

        const dungeon = create_dungeon(5);
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
})