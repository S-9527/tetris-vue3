import { initMap } from "./map.ts";
import { Box } from "./Box.ts";
import { render } from "./renderer.ts";
import { addTicker } from "./ticker.ts";
import { speed } from "./config.ts";
export * from './config'

export function startGame(map: number[][]) {
    initMap(map)
    const box = new Box(1,3);
    let n = 0;
    const handleTicker = (i: number) => {
        n += i;
        if (n >= speed) {
            n = 0;
            moveDown(box, map);
        }
        render(box, map);
    };
    addTicker(handleTicker);
}

export function moveDown(box: Box, map: number[][]) {
    box.y++;
}