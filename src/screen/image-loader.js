import { ImageLoaderScreen } from "./screen.js";

export class ImageLoader {
    static instance;

    constructor() {
        if (!ImageLoader.instance) {
            ImageLoader.instance = this;

            this.image = null;
            this.screen = new ImageLoaderScreen();
        }

        return ImageLoader.instance;
    }

    async load(src) {
        const image = new Image();
        image.src = src;
        try {
            await new Promise((resolve, reject) => {
                image.onload = () => {
                    this.image = image;
                    this.draw(this.image);
                    resolve();
                };
                image.onerror = reject;
            });
        } catch (err) {
            console.log(`Error loading image from: ${src}`);
        }
    }

    draw(image) {
        const [x, y, width, height] = this.fitToScreen(image);
        this.screen.c.drawImage(image, x, y, width, height);
    }

    fitToScreen(image) {
        const screenAspect = this.screen.width / this.screen.height;
        const imageAspect = image.width / image.height;

        let x, y, width, height;

        if (imageAspect > screenAspect) {
            height = this.screen.height;
            width = height * imageAspect;
            x = (this.screen.width - width) / 2;
            y = 0;
        } else {
            width = this.screen.width;
            height = width / imageAspect;
            x = 0;
            y = (this.screen.height - height) / 2;
        }

        return [x, y, width, height];
    }
}
