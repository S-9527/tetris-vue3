export const gameRow = 10;
export const gameCol = 10;
export let speed = {
    default: 1000,
    min: 100,
    factor: 0.9
};

export function speedUp() {
    speed.default *= speed.factor;
    if (speed.default <= speed.min) {
        speed.default = speed.min;
    }
}

export function resetSpeed() {
    speed.default = 1000;
}