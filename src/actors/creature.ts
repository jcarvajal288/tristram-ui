import type {Gauge} from '../util/gauge.ts'

export type Creature = {
    name: string
    accuracy: number
    evasion: number
    luck: number
    speed: number
    hp: Gauge
}