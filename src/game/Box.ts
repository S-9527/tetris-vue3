export class Box {
    shape: number[][];
    x: number;
    y: number;
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
        this.shape = [
            [1, 1],
            [1, 1],
        ];
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
    },
    3: {
        type: 4,
        shape: [
            [0, 0, 1],
            [0, 1, 1],
            [0, 1, 0],
        ]
    },
    4: {
        type: 4,
        shape: [
            [1, 0, 0],
            [1, 0, 0],
            [1, 1, 0],
        ],
    },
    5: {
        type: 5,
        shape: [
            [0, 0, 1],
            [0, 0, 1],
            [0, 1, 1],
        ],
    },
    6: {
        type: 6,
        shape: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 0, 0],
        ],
    },
    7: {
        type: 7,
        shape: [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ]
    }
};

export function createBox() {
    const box = new Box();
    const { shape } = randomGenerateShape();
    box.shape = shape;
    return box;
}

function randomGenerateShape() {
    const max = Object.keys(shapeTemplate).length;
    const type = Math.floor(Math.random() * max) + 1;
    return shapeTemplate[type];
}