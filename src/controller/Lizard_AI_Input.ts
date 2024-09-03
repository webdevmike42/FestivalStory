import Lizard from "../scenes/enemies/Lizard";
import { MappedInput } from "./MappedInput";

enum Direction{
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export class Lizard_AI_Input implements MappedInput {
    private direction: Direction;
    private moveEvent: Phaser.Time.TimerEvent;

    constructor(private scene: Phaser.Scene, lizard:Lizard) {
        this.setRandomDirection();

        this.moveEvent = scene.time.addEvent({
            delay: 2000,
            callback: () => {
                this.setRandomDirection();
            },
            loop: true
        });

        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, (go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) => {
            if (go !== lizard) {
                return;
            }

            this.setRandomDirection();
        }, scene);
    }

    setRandomDirection() {
        let newDirection = Phaser.Math.Between(0, 3) as Direction;
        while (newDirection === this.direction) {
            newDirection = Phaser.Math.Between(0, 3);
        }
        this.direction = newDirection;
    }

    getInput() {
        return {
            left: this.direction === Direction.LEFT,
            right: this.direction === Direction.RIGHT,
            up: this.direction === Direction.UP,
            down: this.direction === Direction.DOWN
        };
    }

    destroy() {
        this.moveEvent.destroy();
    }
}
