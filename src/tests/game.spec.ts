import {it, expect, describe} from "vitest";
import { Box } from "../game/Box.ts";
import { render } from "../game/renderer.ts";
import { moveDown } from "../game";

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
    it('should moveDown', () => {
        const map = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ];

        const box = new Box();
        box.shape = [
            [1, 1],
            [1, 1],
        ];

        moveDown(box, map);
        expect(box.y).toBe(1);

        moveDown(box, map);
        expect(box.y).toBe(2);
    });
})