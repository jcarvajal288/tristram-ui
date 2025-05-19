import {fallen, horror, type Monster} from "./actors/monster.ts";
import {d10, d6} from "./util/die.ts";
import {range} from "lodash";

export type Dungeon = {
    current_room: number
    rooms: Room[]
}

type Room = {
    enemies: Monster[]
    gold: number
}

const create_room = (): Room => {
    const room: Room = {
        enemies: [],
        gold: 0
    }
    const monster_roll = d10()
    if (monster_roll <= 4) {
        room.enemies.push(fallen())
    } else if (monster_roll <= 6) {
        room.enemies.push(horror())
    }

    if (d6() <= 2) {
        room.gold = d10()
    }
    return room
}

export const create_dungeon = (num_rooms: number): Dungeon => {
    return {
        current_room: 0,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        rooms: range(num_rooms).map((_) => create_room())
    }
}