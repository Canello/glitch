export class ImageDataContainer {
    constructor(imageData) {
        this.imageData = imageData;
    }

    get width() {
        return this.imageData.width;
    }

    get height() {
        return this.imageData.height;
    }

    getIndex(row, col) {
        const { width } = this.imageData;
        return (row * width + col) * 4;
    }

    getPixel(row, col) {
        const { data } = this.imageData;
        const index = this.getIndex(row, col);

        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3] / 255;

        return [r, g, b, a];
    }

    setPixel(row, col, [r, g, b, a]) {
        const { data } = this.imageData;
        const index = this.getIndex(row, col);

        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = 255 * a;
    }
}
