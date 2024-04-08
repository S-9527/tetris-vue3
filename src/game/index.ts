import { addBoxToMap, initMap } from "./map.ts";
import { Box, createBox } from "./Box.ts";
import { render } from "./renderer.ts";
import { addTicker } from "./ticker.ts";
import { gameCol, resetSpeed, speed, speedUp } from "./config.ts";
import { hitBottomBoundary, hitBottomBox } from "./hit.ts";
export * from './config'

let activeBox: any = null;
export function startGame(map: number[][]) {
    initMap(map)
    activeBox = createBox();
    let n = 0;
    const handleTicker = (i: number) => {
        n += i;
        if (n >= speed.default) {
            n = 0;
            moveDown(activeBox, map);
        }
        render(activeBox, map);
    };
    addTicker(handleTicker);
    keyboard();
}

export function moveDown(box: Box, map: number[][]) {
    if (hitBottomBoundary(box, map) || hitBottomBox(box, map)) {
        addBoxToMap(box, map);
        activeBox = createBox();
        return;
    }

    box.y++;
}

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
            if (activeBox.x <= 0) return;
            activeBox.x--;
            break;
        case "ArrowRight":
            if (activeBox.x + activeBox.shape.length >= gameCol) return;
            activeBox.x++;
            break;
        case "ArrowDown":
            speedUp();
            break;
    }
}