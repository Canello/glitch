import { Background } from "./background.js";
import { Screen } from "../screen/screen.js";

export class World {
    static instance;

    constructor() {
        if (!World.instance) {
            World.instance = this;

            this.background = new Background();
        }

        return World.instance;
    }

    start() {
        this.stateLoop();
        this.renderingLoop();
    }

    stateLoop() {
        this.tick();
        setTimeout(this.stateLoop.bind(this), 50);
    }

    renderingLoop() {
        new Screen().clear();
        this.background.render();
        requestAnimationFrame(this.renderingLoop.bind(this));
    }

    tick() {
        this.background.resetDistortions();
    }
}
