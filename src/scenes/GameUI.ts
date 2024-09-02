import Phaser from "phaser";
import { sceneEvents } from "../events/EventCenter";

export default class GameUI extends Phaser.Scene {

    private hearts!: Phaser.GameObjects.Group


    constructor() {
        super({ key: "game-ui" });
    }

    create() {
        const coinsLabel = this.add.text(5, 20, "0");

        sceneEvents.on("player-coins-changed", (coins : number) => {
            coinsLabel.text = coins.toString();
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

        sceneEvents.on("player-health-changed", (newHealth: number) => {
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