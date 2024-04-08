import { it, describe, expect } from "vitest";
import { getLeftPoints, getRightPoints, rotate } from "../game/matrix.ts";

describe("获取边界点", () => {
    it("获取 matrix 左侧的边界点", () => {
        const matrix = [
            [0, 0, 3],
            [0, 3, 3],
            [0, 3, 0],
        ];

        expect(getLeftPoints(matrix)).toEqual([
            { x: 2, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
        ]);
    });

    it("获取 matrix 右侧的边界点", () => {
        const matrix = [
            [0, 0, 3],
            [0, 3, 3],
            [0, 3, 0],
        ];

        expect(getRightPoints(matrix)).toEqual([
            { x: 2, y: 0 },
            { x: 2, y: 1 },
            { x: 1, y: 2 },
        ]);
    });
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