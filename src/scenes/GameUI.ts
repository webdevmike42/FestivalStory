import Phaser from "phaser";
import { sceneEvents } from "../events/EventCenter";
import { EventManager } from "../events/EventManager";

export default class GameUI extends Phaser.Scene {

    private hearts!: Phaser.GameObjects.Group


    constructor() {
        super({ key: "game-ui" });
    }

    create() {
        const coinsLabel = this.add.text(205, 20, "0");
        this.add.image(200,27,"treasure","coin_anim_f0.png");

        EventManager.on("player-coins-changed", (coins : number) => {
            coinsLabel.text = coins.toLocaleString();
        })

        this.hearts = this.add.group({
            classType: Phaser.GameObjects.Image
        });

        this.hearts.createMultiple({
            key: "ui-heart-full",
            setXY: {
                x: 200,
                y: 10,
                stepX: 16
            },
            quantity: 3
        });

        EventManager.on("player-health-changed", (newHealth: number) => {
            this.hearts.children.each((go, index) => {
                (go as Phaser.GameObjects.Image).setTexture((index <= newHealth - 1) ? "ui-heart-full" : "ui-heart-empty")
                return true;
            });
        });

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off("player-health-changed");
            sceneEvents.off("player-coins-changed");
        });
    }


}