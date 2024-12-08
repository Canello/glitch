import { ImageLoader } from "./image-loader.js";
import { Screen } from "./screen/screen.js";

(async function main() {
    const screen = new Screen();
    const c = screen.c;

    const imageLoader = new ImageLoader();
    await imageLoader.load("../images/road.jpg");

    const imageData = c.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // TODO substitute distortion effect below for glitch effect
    // Example distortion: Shift red channel
    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            const index = (y * imageData.width + x) * 4;
            const shift = (y % 20) * 4; // Example wave effect
            data[index] = data[index + shift] || 0; // Shift red channel
        }
    }

    c.putImageData(imageData, 0, 0);
})();
