export const gameRow = 20;
export const gameCol = 10;
export const speed = {
    default: 1000,
    min: 30,
    factor: 0.6
};

export class GameConfig {
    _speed: number
    constructor() {
        this._speed = 0;
        this.initSpeed();
    }

    initSpeed() {
        this._speed = speed.default
    }

    speedUp() {
        this._speed *= speed.factor
        if (this._speed <= speed.min) {
            this._speed = speed.min
        }
    }

    resetSpeed() {
        this.initSpeed();
    }

    get speed() {
        return this._speed;
    }
}