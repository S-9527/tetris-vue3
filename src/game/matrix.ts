export function getBottomRowPoints(matrix: number[][]) {
    const points: any = [];
    const row = matrix.length;
    matrix[row - 1].forEach((_, j) => {
        if (matrix[row - 1][j] > 0) {
            points.push({
                x: j,
                y: row - 1,
            });
        }
    });

    return points;
}