/** @jest-environment jsdom */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import {describe, expect, it, vi} from "vitest";
import App from "../App.tsx";
import {userEvent} from "@testing-library/user-event";
import * as DungeonApi from '../dungeon.ts'
import {generate_hero} from "../actors/hero.ts";
import type {Dungeon} from "../dungeon.ts";

describe('App', () => {

    const test_dungeon: Dungeon = {
        rooms: []
    }

    const enter_dungeon_spy = vi.spyOn(DungeonApi, 'enter_dungeon')
    vi.spyOn(DungeonApi, 'create_dungeon').mockReturnValueOnce(test_dungeon)

    it('heroes can be sent to the dungeon', async () => {
        render(<App/>)
        await userEvent.click(screen.getByTestId('Bob Johnson-enter-dungeon'));
        expect(enter_dungeon_spy).toHaveBeenCalledWith(test_dungeon, generate_hero('Bob Johnson'))
    })
})