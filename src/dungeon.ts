import {fallen, horror, type Monster} from "./actors/monster.ts";
import {d10, d6} from "./util/die.ts";
import {range} from "lodash";
import type {Hero} from "./actors/hero.ts";
import {run_combat} from "./combat.ts";

export type Dungeon = {
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
    console.log(monster_roll)
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        rooms: range(num_rooms).map((_) => create_room())
    }
}

export const enter_room = (room: Room, hero: Hero) => {
    console.log(`${hero.name} enters a new room`)
    room.enemies.forEach((enemy) => {
        run_combat(hero, enemy);
    })
}

export const enter_dungeon = (dungeon: Dungeon, hero: Hero) => {
    console.log(`${hero.name} enters the dungeon`)
    for (const room of dungeon.rooms) {
        enter_room(room, hero)
        if (hero.hp.current <= 0) {
            break;
        }
        if (hero.courage.current <= 0) {
            break;
        }
    }
}