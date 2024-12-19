import { ImageLoader } from "./screen/image-loader.js";
import { World } from "./world/world.js";

(async function main() {
    const imageLoader = new ImageLoader();
    await imageLoader.load("../images/road.jpg");

    const world = new World();
    world.start();
})();
