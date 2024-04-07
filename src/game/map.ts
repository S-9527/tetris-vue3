import { gameCol, gameRow, resetSpeed, speedUp } from "../game";
import { Box, createBox } from "./Box.ts";

export function initMap(map: number[][]) {
    for (let i = 0; i < gameRow; i++) {
        map.push(Array(gameCol).fill(0));
    }
}

keyboard()

let activeBox: Box | null = null;

export function keyboard() {
    window.addEventListener("keyup", handleKeyup);
    window.addEventListener("keydown", handleKeydown);
}
function handleKeyup(e: KeyboardEvent) {
    if (e.code === "ArrowDown") {
        resetSpeed();
    }
}

function handleKeydown(e: KeyboardEvent) {
    if (!activeBox) return;
    switch (e.code) {
        case "ArrowLeft":
            activeBox.x--;
            break;
        case "ArrowRight":
            activeBox.x++;
            break;
        case "ArrowDown":
            speedUp();
            break;
    }
}

export function addBox() {
    const box = createBox();
    activeBox = box;
    return box;
}
