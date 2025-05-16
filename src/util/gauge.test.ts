import {describe, it, expect} from "vitest";
import {make_gauge, reset} from "./gauge.ts";

describe('Gauge', () => {

    it('should be able to be reset', () => {
        const gauge = make_gauge(5);
        expect(gauge.current).toEqual(5);
        expect(gauge.maximum).toEqual(5);
        gauge.current = 2
        reset(gauge)
        expect(gauge.current).toEqual(5);
    })
})