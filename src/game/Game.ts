import { Box, createBox } from "./Box.ts";
import { render } from "./renderer.ts";
import { hitBottomBoundary, hitBottomBox, hitLeftBoundary, hitLeftBox, hitRightBoundary, hitRightBox} from "./hit.ts";
import { addBoxToMap, checkLegalBoxInMap, eliminateLine, initMap } from "./map.ts";
import { GameConfig } from "./config.ts";
import { Player} from "./Player.ts";
import { addTicker, removeTicker } from "./ticker.ts";

export class Game {
    private readonly _map: number[][];
    private _activeBox: Box;
    private readonly _autoMoveToDown: boolean;
    private _createBoxStrategy: OmitThisParameter<() => Box>;
    private _config: GameConfig;
    private _player: Player

    constructor(map: number[][]) {
        this._map = initMap(map);
        this._activeBox = createBox();
        this._autoMoveToDown = true;
        this._createBoxStrategy = createBox;
        this._config = new GameConfig();
        this._player = new Player(this)
    }

    start() {
        this._player.init();
        addTicker(this.handleTicker.bind(this));
    }

    setCreateBoxStrategy(strategy: OmitThisParameter<() => Box>) {
        this._createBoxStrategy = strategy;
    }

    handleTicker(i: number) {
        this.handleAutoMoveToDown(i);
        render(this._activeBox, this._map);
    }

    _n = 0;
    handleAutoMoveToDown(i: number) {
        if (!this._autoMoveToDown) return;
        this._n += i;
        if (this._n >= this.getSpeed()) {
            this._n = 0;
            this.moveBoxToDown();
        }
    }

    getSpeed() {
        return this._config.speed;
    }

    resetSpeed() {
        this._config.resetSpeed();
    }

    speedUp() {
        this._config.speedUp();
    }

    render() {
        render(this._activeBox, this._map);
    }

    rotateBox() {
        if (checkLegalBoxInMap(this._activeBox, this._map)) {
            return;
        }

        this._activeBox.rotate();
    }

    moveBoxToLeft() {
        if (hitLeftBoundary(this._activeBox, this._map) || hitLeftBox(this._activeBox, this._map)) return;
        if (this.isGameOver()) return;
        this._activeBox.x--;
    }

    moveBoxToRight() {
        if (hitRightBoundary(this._activeBox, this._map) || hitRightBox(this._activeBox, this._map)) return;
        if (this.isGameOver()) return;
        this._activeBox.x++;
    }

    moveBoxToDown() {
        if (!this._activeBox) return;

        if (hitBottomBoundary(this._activeBox, this._map) || hitBottomBox(this._activeBox, this._map)) {
            this.nextBox(this._activeBox);
            return;
        }

        this._activeBox.y++;
    }

    nextBox(activeBox: Box) {
        addBoxToMap(activeBox, this._map);
        eliminateLine(this._map);

        if (this.isGameOver()) {
            this.endGame();
            return;
        }

        this.addBox();
    }

    endGame() {
        alert("game over");
        removeTicker(this.handleTicker.bind(this));
    }

    isGameOver() {
        return this._activeBox.y <= 0;
    }

    addBox() {
        if (this.isGameOver()) return;
        this._activeBox = this._createBoxStrategy();
    }
}