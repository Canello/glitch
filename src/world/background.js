import { ImageLoaderScreen, Screen } from "../screen/screen.js";
import { transpose } from "../utils/math.js";

export class Background {
    static instance;

    constructor() {
        if (!Background.instance) {
            Background.instance = this;
            const screen = new Screen();
            this.numRows = 100;
            this.numCols = 100;
            this.rowGap = screen.height / (this.numRows - 1);
            this.colGap = screen.width / (this.numCols - 1);
            this.grid = this.makeGrid();
        }

        return Background.instance;
    }

    makeGrid() {
        const grid = [];

        for (let i = 0; i < this.numRows; i++) {
            const row = [];

            for (let j = 0; j < this.numCols; j++) {
                const x = this.colGap * j;
                const y = this.rowGap * i;
                row.push(new Point(x, y));
            }

            grid.push(row);
        }

        return grid;
    }

    render() {
        const data = new ImageLoaderScreen().getImageData();
        this.renderSquares(data);
        this.renderRows();
        this.renderCols();
        // const screen = new Screen();
        // screen.setImageData(data);
    }

    renderSquares(imageDataContainer) {
        const c = new Screen().c;

        // get a pixel based on point coordinates
        // const [r,g,b,a] = imageDataContainer.getPixel(x, y)
        // const color = `rgba(${r}, ${g}, ${b}, ${a})`

        for (let row of this.grid) {
            for (let point of row) {
                c.fillStyle = "red"; // color of pixel in the middle of this square
                c.fillRect(point.x, point.y, this.colGap, this.rowGap);
            }
        }
    }

    renderRows() {
        const c = new Screen().c;

        for (let row of this.grid) {
            if (row.length < 2) return;
            c.lineWidth = 1;

            for (let i = 0; i < row.length - 1; i++) {
                const startPoint = row[i];
                const finishPoint = row[i + 1];

                c.beginPath();
                c.moveTo(startPoint.xDistorted, startPoint.yDistorted);
                c.lineTo(finishPoint.xDistorted, finishPoint.yDistorted);
                c.strokeStyle = "rgba(255, 255, 255, 0.75)";
                c.stroke();
            }
        }
    }

    renderCols() {
        const c = new Screen().c;
        const gridT = transpose(this.grid);

        for (let col of gridT) {
            if (col.length < 2) return;
            c.lineWidth = 1;

            for (let i = 0; i < col.length - 1; i++) {
                const startPoint = col[i];
                const finishPoint = col[i + 1];

                c.beginPath();
                c.moveTo(startPoint.xDistorted, startPoint.yDistorted);
                c.lineTo(finishPoint.xDistorted, finishPoint.yDistorted);
                c.strokeStyle = "rgba(255, 255, 255, 0.4)";
                c.stroke();
            }
        }
    }

    getPointsInArea(x1, x2, y1, y2) {
        x1 = Screen.xBounded(x1);
        x2 = Screen.xBounded(x2);
        y1 = Screen.yBounded(y1);
        y2 = Screen.yBounded(y2);

        const xMin = Math.min(x1, x2);
        const xMax = Math.max(x1, x2);
        const yMin = Math.min(y1, y2);
        const yMax = Math.max(y1, y2);

        const isZeroSizeArea = (xMax - xMin) * (yMax - yMin) === 0;
        if (isZeroSizeArea) return [];

        const jMin = Math.ceil(xMin / this.colGap);
        const jMax = Math.floor(xMax / this.colGap);
        const iMin = Math.ceil(yMin / this.rowGap);
        const iMax = Math.floor(yMax / this.rowGap);

        const points = [];

        for (let i = iMin; i <= iMax; i++) {
            for (let j = jMin; j <= jMax; j++) {
                points.push(this.grid[i][j]);
            }
        }

        return points;
    }

    getClosestPoint(x, y) {
        const [i, j] = this.getClosestPointRowCol(x, y);
        return this.grid[i][j];
    }

    getClosestPointRowCol(x, y) {
        x = Screen.xBounded(x);
        y = Screen.yBounded(y);

        const i = Math.round(y / this.rowGap);
        const j = Math.round(x / this.colGap);

        return [i, j];
    }

    resetDistortions() {
        this.grid.forEach((row) =>
            row.forEach((point) => point.resetDistortion())
        );
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = new RGB(255, 255, 255, 1);
        this.dx = 0;
        this.dy = 0;
        this.dr = 0;
        this.dg = 0;
        this.db = 0;
    }

    get xDistorted() {
        return this.x + this.dx;
    }

    get yDistorted() {
        return this.y + this.dy;
    }

    get colorDistorted() {
        const { r, g, b, a } = this.color;
        return new RGB(r + this.dr, g + this.dg, b + this.db, a);
    }

    distort(dx, dy) {
        this.dx = this.dx + dx;
        this.dy = this.dy + dy;
    }

    resetDistortion() {
        this.dx = 0;
        this.dy = 0;
        this.dr = 0;
        this.dg = 0;
        this.db = 0;
    }
}

class RGB {
    constructor(r, g, b, a) {
        this._r = this.boundedColor(r);
        this._g = this.boundedColor(g);
        this._b = this.boundedColor(b);
        this._a = this.boundedOpacity(a);
    }

    set r(value) {
        this._r = this.boundedColor(value);
    }

    set g(value) {
        this._g = this.boundedColor(value);
    }

    set b(value) {
        this._b = this.boundedColor(value);
    }

    set a(value) {
        this._a = this.boundedOpacity(value);
    }

    get r() {
        return this._r;
    }

    get g() {
        return this._g;
    }

    get b() {
        return this._b;
    }

    get a() {
        return this._a;
    }

    boundedColor(value) {
        if (value > 255) {
            value = 255;
        } else if (value < 0) {
            value = 0;
        }
        return value;
    }

    boundedOpacity(value) {
        if (value > 1) {
            value = 1;
        } else if (value < 0) {
            value = 0;
        }
        return value;
    }
}
