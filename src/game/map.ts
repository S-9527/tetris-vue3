import { gameCol, gameRow } from "../game";
import { Box } from "./Box.ts";

export function initMap(map: number[][]) {
    for (let i = 0; i < gameRow; i++) {
        map.push(Array(gameCol).fill(0));
    }

    return map;
}

export function addBoxToMap(box: Box, map: number[][]) {
    for (let i = 0; i < box.shape.length; i++) {
        for (let j = 0; j < box.shape[0].length; j++) {
            const row = box.y + i;
            const col = box.x + j;

            if (box.shape[i][j] > 0) {
                map[row][col] = -1;
            }
        }
    }
}

export function eliminateLine(map: number[][]) {
    let lines: Array<number> = [];
    map.forEach((arr, i) => {
        const boo = arr.every(v => v === -1);
        if (boo) lines.push(i);
    })

    const mapCol = map[0].length;

    lines.forEach((n) => {
        map.splice(n, 1);
        map.unshift(new Array(mapCol).fill(0));
    });
}

export function checkLegalPointInMap(point: { x: number; y: number }) {
    const checkCol = point.x < 0 || point.x >= gameCol;
    const checkRow = point.y < 0 || point.y >= gameRow;
    return !checkCol && !checkRow;
}

export function checkLegalBoxInMap(box: Box, map: number[][]) {
    const shape = box.shape;
    const row = shape.length;
    const col = shape[0].length;

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const xx = box.x + j;
            const yy = box.y + i;

            if (!checkLegalPointInMap({ x: xx, y: yy })) return true;
            if (isHardPoint({ row: yy, col: xx, map })) return true;
        }
    }

    return false;
}

export function isHardPoint({ row, col, map }: { row: number; col: number; map: number[][] }) {
    return map[row][col] < 0;
}
