import { getBottomRowPoints } from "./matrix";

export function hitBottomBoundary(box, map) {
    const points = getBottomRowPoints(box.shape);
    const mapRow = map.length;

    return points.some((point) => {
        return point.y + box.y + 1 >= mapRow;
    });
}

export function hitBottomBox(box, map) {
    const points = getBottomRowPoints(box.shape);

    return points.some((point) => {
        const col = point.x + box.x;
        const row = point.y + box.y + 1;
        return map[row][col] < 0;
    });
}