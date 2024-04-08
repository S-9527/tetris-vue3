import { it, describe, expect } from "vitest";
import { getBottomRowPoints, rotate } from "../game/matrix.ts";

it("should return bottom points", () => {
    const matrix = [
        [1, 1],
        [1, 1],
    ];

    expect(getBottomRowPoints(matrix)).toEqual([
        { x: 0, y: 1 },
        { x: 1, y: 1 }
    ]);

    const block = [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
    ];

    expect(getBottomRowPoints(block)).toEqual([
        { x: 1, y: 2 }
    ]);
});

describe("Rotate", () => {
    it("rotate 逆时针90度旋转 ", () => {
        const matrix = [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ];

        // 90
        expect(rotate(matrix)).toEqual([
            [1, 0, 0],
            [1, 1, 0],
            [0, 1, 0],
        ]);

        // 180
        expect(rotate(rotate(matrix))).toEqual([
            [0, 0, 0],
            [0, 1, 1],
            [1, 1, 0],
        ]);

        // // 270
        expect(rotate(rotate(rotate(matrix)))).toEqual([
            [0, 1, 0],
            [0, 1, 1],
            [0, 0, 1],
        ]);

        // 0
        expect(rotate(rotate(rotate(rotate(matrix))))).toEqual([
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ]);
    });
});