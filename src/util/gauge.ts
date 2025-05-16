export type Gauge = {
    current: number;
    maximum: number
}

export const reset = (gauge: Gauge) => gauge.current = gauge.maximum

export const make_gauge = (max: number) => {
    return {
        current: max,
        maximum: max
    }
}