import { Game } from "./Game.ts";
import { addTicker } from "./ticker.ts";
export * from './config.ts'

let game: Game;
export function startGame(map: number[][]) {
    game = new Game(map);
    game.start();
}

addTicker(() => {
    game.render();
});