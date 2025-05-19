/** @jest-environment jsdom */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import {describe, expect, it, vi} from "vitest";
import App from "../App.tsx";
import {userEvent} from "@testing-library/user-event";
import * as Dungeon from '../dungeon.ts'
import {generate_hero} from "../actors/hero.ts";

describe('App', () => {

    const enter_dungeon_spy = vi.spyOn(Dungeon, 'enter_dungeon')

    it('heroes can be sent to the dungeon', async () => {
        render(<App/>)
        await userEvent.click(screen.getByTestId('Bob Johnson-enter-dungeon'));
        expect(enter_dungeon_spy).toHaveBeenCalledWith(generate_hero('Bob Johnson'))
    })
})