import { initMap } from "./map.ts";
import { Box } from "./Box.ts";
import { render } from "./renderer.ts";
export * from './config'

export function startGame(map: number[][]) {
    initMap(map)
    const box = new Box(1,3);
    render(box, map);
}