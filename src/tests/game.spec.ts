import {it, expect, describe} from "vitest";
import { Box } from "../game/Box.ts";
import { render } from "../game/renderer.ts";

describe("map", () => {
    it("should render", () => {
        const box = new Box(1,2);
        const map = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ]

        render(box, map);

        expect(map).toEqual([
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0],
            [0, 1, 1, 0, 0],
            [0, 0, 0, 0, 0],
        ])
    })
})