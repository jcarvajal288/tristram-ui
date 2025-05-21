import type {Hero} from "./actors/hero.ts";
import type {Monster} from "./actors/monster.ts";
import {d10, d6} from "./util/die.ts";
import {clamp, range} from 'lodash';

export const did_hero_win_initiative = (hero: Hero, enemy: Monster) => {
    const hero_roll = d10()
    const enemy_roll = d10()
    const hero_passed = hero_roll < hero.speed + hero.evasion
    const enemy_passed = enemy_roll < enemy.speed + enemy.evasion
    const did_hero_win = (hero_passed && enemy_passed || !hero_passed && !enemy_passed)
        ? hero_roll + hero.evasion >= enemy_roll + enemy.evasion
        : hero_passed;
    if (did_hero_win) {
        console.log(`${hero.name} wins initiative (${hero_roll} vs ${enemy_roll})`)
    } else {
        console.log(`${hero.name} loses initiative (${hero_roll} vs ${enemy_roll})`)
    }
    return did_hero_win
}

export const hero_takes_hit = (hero: Hero, enemy: Monster) => {
    const roll_hit_location = () => {
        switch(d6()) {
            case 1: return 'head'
            case 2: return 'arms'
            case 3:
            case 4: return 'body'
            case 5: return 'waist'
            case 6: return 'legs'
            default: return 'body'
        }
    }

    const take_severe_wound = () => {
        console.log(`${hero.name} suffers a severe ${hit_location} wound!`)
        hero.courage.current -= 1
        console.log(`${hero.name}'s courage is decreased to ${hero.courage.current}`)
        if (current_armor > 0) {
            hero.hp.current -= enemy.damage - current_armor
        } else {
            hero.hp.current -= enemy.damage
        }
        console.log(`${hero.name}'s hp is decreased to ${hero.hp.current}!`)
    }

    const hit_location = roll_hit_location()
    const current_armor = hero.armor_locations[hit_location]

    console.log(`${enemy.name} hits ${hero.name} in the ${hit_location} for ${enemy.damage}`)
    if (hit_location === 'head') {
        if (hero.armor_locations['head'] > -1) {
            hero.armor_locations['head'] -= enemy.damage
            if (hero.armor_locations['head'] < -1) {
                hero.armor_locations['head'] = -1
            }
        }
        if (hero.armor_locations['head'] <= -1) {
            take_severe_wound()
        }
    } else {
        if (hero.armor_locations[hit_location] > -2) {
            hero.armor_locations[hit_location] -= enemy.damage
            if (hero.armor_locations[hit_location] < -2) {
                hero.armor_locations[hit_location] = -2
            }
        }
        if (hero.armor_locations[hit_location] == -1) {
            console.log(`${hero.name} suffers a light ${hit_location} wound!`)
        } else if (hero.armor_locations[hit_location] == -2) {
            take_severe_wound()
        }
    }
};

export const enemy_takes_hit = (defender: Monster, attacker: Hero) => {
    const damage_roll = d10() + attacker.strength
    const damage_dealt = clamp(damage_roll - defender.toughness, 0, attacker.strength)
    console.log(`${attacker.name} hits ${defender.name} for ${damage_dealt} damage (rolled ${damage_roll} vs ${defender.toughness})`)
    defender.hp.current -= damage_dealt
}

export const hero_turn = (hero: Hero, enemy: Monster) => {
    range(hero.speed).forEach(() => {
        const attack_roll = d10()
        const target = hero.accuracy + enemy.evasion
        console.log(`${hero.name} attacks ${enemy.name} (rolled ${attack_roll} vs ${target})`);
        if (attack_roll >= target) {
            enemy_takes_hit(enemy, hero)
            if (enemy.hp.current <= 0) {
                return
            }
        } else {
            console.log(`${hero.name} misses ${enemy.name}`)
        }
    })
};

export const enemy_turn = (hero: Hero, enemy: Monster) => {
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
        if (enemy.hp.current <= 0) return;
        enemy_turn(hero, enemy)
    } else {
        enemy_turn(hero, enemy)
        if (hero.hp.current <= 0) return;
        hero_turn(hero, enemy)
    }
}

export const run_combat = (hero: Hero, enemy: Monster) => {
    console.log(`${hero.name} fights a ${enemy.name}`)
    while (true) {
        run_combat_round(hero, enemy)
        if (enemy.hp.current <= 0) {
            console.log(`${enemy.name} dies!`)
            break;
        }
        if (hero.hp.current <= 0) {
            console.log(`${hero.name} has died!`)
            break;
        }
        if (hero.courage.current <= 0) {
            console.log(`${hero.name} retreats!`)
            break;
        }
    }
}