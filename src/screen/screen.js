import { ImageDataContainer } from "./image-data-container.js";

export class BaseScreen {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.c = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    clear() {
        this.c.clearRect(0, 0, this.width, this.height);
    }

    xBounded(x) {
        x = x < 0 ? 0 : x;
        x = x > this.width ? this.width : x;
        return x;
    }

    yBounded(y) {
        y = y < 0 ? 0 : y;
        y = y > this.height ? this.height : y;
        return y;
    }

    getImageData() {
        return new ImageDataContainer(
            this.c.getImageData(0, 0, this.width, this.height)
        );
    }

    setImageData(imageDataContainer) {
        this.c.putImageData(imageDataContainer.imageData, 0, 0);
    }
}

export class Screen extends BaseScreen {
    static instance;

    constructor() {
        if (!Screen.instance) {
            super("screen");
            Screen.instance = this;
        }

        return Screen.instance;
    }
}

export class ImageLoaderScreen extends BaseScreen {
    static instance;

    constructor() {
        if (!ImageLoaderScreen.instance) {
            super("image-loader");
            ImageLoaderScreen.instance = this;
        }

        return ImageLoaderScreen.instance;
    }
}
