import type {Hero} from "./actors/hero.ts";
import type {Monster} from "./actors/monster.ts";
import {d10} from "./util/die.ts";
import {clamp, range} from 'lodash';

const did_hero_win_initiative = (hero: Hero, enemy: Monster) => {
    const hero_roll = d10() + hero.evasion
    const enemy_roll = d10() + enemy.evasion
    const hero_passed = hero_roll < hero.speed
    const enemy_passed = enemy_roll < enemy.speed
    if (hero_passed && enemy_passed || !hero_passed && !enemy_passed) {
        return hero_roll >= enemy_roll
    }
    return hero_passed;
}

const hero_takes_hit = (hero: Hero, enemy: Monster) => {

};

const enemy_takes_hit = (defender: Monster, attacker: Hero) => {
    const damage_roll = d10() + attacker.strength
    const damage_dealt = clamp(damage_roll, 0, attacker.strength)
    console.log(`${attacker.name} hits ${defender.name} for ${damage_dealt} damage (rolled ${damage_roll} vs ${defender.toughness})`)
    defender.hp.current -= damage_dealt
}

const hero_turn = (hero: Hero, enemy: Monster) => {
    range(hero.speed).forEach(() => {
        const attack_roll = d10()
        const target = hero.accuracy + enemy.evasion
        console.log(`${hero.name} attacks ${enemy.name} (rolled ${attack_roll} vs ${target}`);
        if (attack_roll >= target) {
            enemy_takes_hit(enemy, hero)
            if (enemy.hp.current <= 0) {
                console.log(`${enemy.name} dies!`)
                return
            }
        } else {
            console.log(`${hero.name} misses ${enemy.name}`)
        }
    })
};

const enemy_turn = (hero: Hero, enemy: Monster) => {
    range(enemy.speed).forEach(() => {
        const attack_roll = d10()
        const target = enemy.accuracy + hero.evasion
        console.log(`${enemy.name} attacks ${hero.name} (rolled ${attack_roll} vs ${target})`)
        if (attack_roll  >= target) {
            hero_takes_hit(hero, enemy)
        }
    })
};

export const run_combat_round = (hero: Hero, enemy: Monster) => {
    console.log("=== New Combat Round ===")
    if (did_hero_win_initiative(hero, enemy)) {
        hero_turn(hero, enemy)
        enemy_turn(hero, enemy)
    } else {
        enemy_turn(hero, enemy)
        hero_turn(hero, enemy)
    }
}