import { it, expect } from "vitest";
import { getBottomRowPoints } from "../game/matrix.ts";

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