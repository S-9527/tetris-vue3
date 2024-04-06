import { gameCol, gameRow } from "../game";

export function initMap(map: number[][]) {
    for (let i = 0; i < gameRow; i++) {
        map.push(Array(gameCol).fill(0));
    }
}