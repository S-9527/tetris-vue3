import { Game } from "./Game.ts";
import { createBox } from "./Box.ts";
import { initMap } from "./map.ts";
import { addTicker } from "./ticker.ts";
export * from './config.ts'

let game: Game;
export function startGame(map: number[][]) {
    const box = createBox();
    game = new Game(box, initMap(map));
    game.start();
}

addTicker(() => {
    game.render();
});