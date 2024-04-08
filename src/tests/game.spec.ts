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
            [0, 0, 0, 0, 0]
        ];

        const box = new Box();
        box.shape = [
            [1, 0, 0],
            [1, 1, 0],
            [0, 1, 0],
        ];

        box.y = 0;

        moveDown(box, map);
        expect(box.y).toBe(1);

        moveDown(box, map);
        expect(box.y).toBe(2);

        moveDown(box, map);
        expect(box.y).toBe(2);

        expect(map).toEqual([
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [-1, 0, 0, 0, 0],
            [-1, -1, 0, 0, 0],
            [0, -1, 0, 0, 0],
        ]);
    });
    it("moveDown when hit other box", () => {
        const map = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [-1, -1, 0, 0, 0],
            [-1, -1, 0, 0, 0],
        ];

        const box = new Box();
        box.shape = [
            [1, 1],
            [1, 1],
        ];
        box.y = 0;

        moveDown(box, map);
        expect(box.y).toBe(0);
        expect(map).toEqual([
            [-1, -1, 0, 0, 0],
            [-1, -1, 0, 0, 0],
            [-1, -1, 0, 0, 0],
            [-1, -1, 0, 0, 0],
        ]);
    });
    it("moveDown when box shape is not full", () => {
        const map = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [-1, 0, 0, 0, 0],
            [-1, -1, 0, 0, 0],
            [0, -1, 0, 0, 0],
        ];

        const box = new Box();
        box.shape = [
            [1, 0, 0],
            [1, 1, 0],
            [0, 1, 0],
        ];
        box.y = 0;

        moveDown(box, map);
        expect(box.y).toBe(1);
        moveDown(box, map);
        expect(box.y).toBe(1);
        expect(map).toEqual([
            [0, 0, 0, 0, 0],
            [-1, 0, 0, 0, 0],
            [-1, -1, 0, 0, 0],
            [-1, -1, 0, 0, 0],
            [-1, -1, 0, 0, 0],
            [0, -1, 0, 0, 0],
        ]);
    });
    it("eliminate line", () => {
        const map = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, -1, -1],
        ];

        const box = new Box();
        box.shape = [
            [1, 1],
            [1, 1],
        ];
        box.y = 2;

        moveDown(box, map);
        expect(map).toEqual([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [-1, -1, 0, 0],
        ]);
    })
})