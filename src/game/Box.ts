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