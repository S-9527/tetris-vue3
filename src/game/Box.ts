import { rotate } from "./matrix.ts";

export class Box {
    shape: number[][];
    x: number;
    y: number;
    type: number;
    private _rotateStrategy: any[] = [];
    private _rotateIndex = 0;
    constructor(type: number = 0) {
        this.x = 0;
        this.y = 0;
        this.type = type;
        this.shape = [
            [1, 1],
            [1, 1],
        ];
    }

    rotate() {
        const rotateHandler: Function = this._rotateStrategy[this._rotateIndex];
        if (!rotateHandler) return;
        this.shape = rotateHandler(this.shape);
        this._rotateIndex = this.nextRotateIndex();
    }

    nextRotateIndex() {
        this._rotateIndex ++;
        if (this._rotateIndex >= this._rotateStrategy.length) {
            this._rotateIndex = 0;
        }

        return this._rotateIndex;
    }

    setRotateStrategy(strategy: any) {
        if (!strategy) return
        this._rotateStrategy = strategy;
    }
}

const shapeTemplate: any  = {
    1: {
        type: 1,
        shape: [
            [1, 1],
            [1, 1],
        ],
    },
    2: {
        type: 2,
        shape: [
            [1, 0, 0],
            [1, 1, 0],
            [0, 1, 0],
        ],
        rotateStrategy: [rotate, (m: number[][]) => rotate(rotate(rotate(m)))],
    },
    3: {
        type: 4,
        shape: [
            [0, 0, 1],
            [0, 1, 1],
            [0, 1, 0],
        ],
        rotateStrategy: [rotate, (m: number[][]) => rotate(rotate(rotate(m)))],
    },
    4: {
        type: 4,
        shape: [
            [1, 0, 0],
            [1, 0, 0],
            [1, 1, 0],
        ],
        rotateStrategy: [rotate, rotate, rotate, rotate],
    },
    5: {
        type: 5,
        shape: [
            [0, 0, 1],
            [0, 0, 1],
            [0, 1, 1],
        ],
        rotateStrategy: [rotate, rotate, rotate, rotate],
    },
    6: {
        type: 6,
        shape: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 0, 0],
        ],
        rotateStrategy: [rotate, rotate, rotate, rotate],
    },
    7: {
        type: 7,
        shape: [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ],
        rotateStrategy: [rotate, (m: number[][]) => rotate(rotate(rotate(m)))],
    }
};

export function createBox() {
    const { shape, type, rotateStrategy } = randomGenerateShape();
    const box = new Box(type);

    box.shape = shape;
    box.setRotateStrategy(rotateStrategy)

    return box;
}

export function createBoxByType(type: number) {
    const box = new Box(type);
    const { shape, rotateStrategy } = shapeTemplate[type];

    box.shape = shape;
    box.setRotateStrategy(rotateStrategy);

    return box;
}

function randomGenerateShape() {
    const max = Object.keys(shapeTemplate).length;
    const type = Math.floor(Math.random() * max) + 1;
    return shapeTemplate[type];
}