import { gameCol, gameRow } from "../game";
import { Box } from "./Box.ts";

export function initMap(map: number[][]) {
    for (let i = 0; i < gameRow; i++) {
        map.push(Array(gameCol).fill(0));
    }
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
