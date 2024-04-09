import { Game } from "./Game.ts";
import { createBox } from "./Box.ts";

export class Player {
    private _game: Game;
    constructor(game: Game) {
        this._game = game;
        this._game.setCreateBoxStrategy(this.createBoxStrategy.bind(this));
    }

    init() {
        this.initKeyboard();
        this._game.addBox();
    }

    createBoxStrategy() {
        return createBox();
    }

    initKeyboard() {
        window.addEventListener("keyup", this.handleKeyup.bind(this));
        window.addEventListener("keydown", this.handleKeydown.bind(this));
    }

    handleKeyup(e: KeyboardEvent) {
        if (e.code === "ArrowDown") {
            this._game.resetSpeed();
        }
    }

    handleKeydown(e: KeyboardEvent) {
        switch (e.code) {
            case "ArrowLeft":
                this._game.moveBoxToLeft();
                break;
            case "ArrowRight":
                this._game.moveBoxToRight();
                break;
            case "ArrowUp":
                this._game.rotateBox();
                break;
            case "ArrowDown":
                this._game.speedUp();
                break;
        }
    }
}