export function getBottomRowPoints(matrix: number[][]) {
    let points = [];
    const col = matrix[0].length;
    const row = matrix.length;
    for (let i = 0; i < col; i++) {
        for (let j = row - 1; j >= 0; j--) {
            const point = matrix[j][i];
            if (point) {
                points.push({ x: i, y: j });
                break;
            }
        }
    }
    return points;
}

export function getLeftPoints(matrix: number[][]) {
    let points = [];
    const col = matrix[0].length;
    const row = matrix.length;
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            if (matrix[i][j]) {
                points.push({
                    x: j,
                    y: i,
                });
                break;
            }
        }
    }
    return points;
}

export function getRightPoints(matrix: number[][]) {
    let points = [];
    const col = matrix[0].length;
    const row = matrix.length;

    for (let i = 0; i < row; i++) {
        for (let j = col - 1; j >= 0; j--) {
            if (matrix[i][j]) {
                points.push({
                    x: j,
                    y: i,
                });
                break;
            }
        }
    }
    return points;
}

const mapFn: Record<string, Function> = {
    left: getLeftPoints,
    right: getRightPoints,
    bottom: getBottomRowPoints,
};

export function getPointsHandler(direction: string) {
    return mapFn[direction];
}

export function rotate(matrix: number[][]) {
    let temp: Array<any> = [];
    const row = matrix.length;
    const col = matrix[0].length;
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const newRow: number = row - 1 - j;

            if (!temp[newRow]) {
                temp[newRow] = [];
            }

            temp[newRow][i] = matrix[i][j];
        }
    }

    return temp;
}