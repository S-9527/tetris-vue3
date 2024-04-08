import { Box } from "./Box.ts";

export function render(box: Box, map: number[][]) {
    reset(map);
    _render(box, map);
}

function _render(box: Box, map: number[][]) {
    for (let i = 0; i < box.shape.length; i++) {
        box.shape[0].forEach((_, j) => {
            const row = i + box.y;
            const col = j + box.x;
            if (box.shape[i][j] > 0) {
                map[row][col] = 1;
            }
        })
    }
}

function reset(map: number[][]) {
    for (let i = 0; i < map.length; i++) {
        map[0].forEach((_, j) => {
            if (map[i][j] > 0) {
                map[i][j] = 0;
            }
        })
    }
}