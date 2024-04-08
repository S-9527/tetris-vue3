import {it, expect, describe} from "vitest";
import { Box } from "../game/Box.ts";
import { render } from "../game/renderer.ts";
import { Game } from "../game/Game.ts";

describe("map", () => {
    it("should render", () => {
        const box = new Box();
        const map = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ]

        render(box, map);

        expect(map).toEqual([
            [1, 1, 0, 0, 0],
            [1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
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
        const game = new Game(box, map);

        game.moveBoxToDown();
        expect(box.y).toBe(1);

        game.moveBoxToDown();
        expect(box.y).toBe(2);

        game.moveBoxToDown();
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

        const game = new Game(box, map);

        game.moveBoxToDown();
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

        const game = new Game(box, map);

        game.moveBoxToDown();
        expect(box.y).toBe(1);
        game.moveBoxToDown();
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

        const game = new Game(box, map);

        game.moveBoxToDown();
        expect(map).toEqual([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [-1, -1, 0, 0],
        ]);
    })
})