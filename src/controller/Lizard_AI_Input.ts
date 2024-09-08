import Lizard from "../enemies/Lizard";
import { MappedInputController, MappedInputResult, createMappedInputResult } from "./MappedInputController";

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export class Lizard_AI_Input implements MappedInputController {
    private direction: Direction = Direction.RIGHT;
    private _mappedInput: MappedInputResult = createMappedInputResult();
    private moveEvent: Phaser.Time.TimerEvent;
    private dashEvent: Phaser.Time.TimerEvent;

    constructor(private scene: Phaser.Scene, lizard: Lizard) {
        this.setRandomNewDirection(this.direction);
       
        this.moveEvent = scene.time.addEvent({
            delay: 2000,
            callback: () => {
                this.setRandomNewDirection(this.direction);
                this._mappedInput.dashPressed = false;
            },
            loop: true
        });

        this.dashEvent = scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this._mappedInput.dashPressed = true;
            },
            loop: true
        });

        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, (go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) => {
            if (go !== lizard) {
                return;
            }

            this.setRandomNewDirection(this.direction);
        }, scene);
    }

    setRandomNewDirection(excludeDirection: Direction) {
        let newDirection = Phaser.Math.Between(0, 3);

        while (newDirection === excludeDirection)
            newDirection = Phaser.Math.Between(0, 3)

        this.direction = newDirection;

        this._mappedInput.left = this.direction === Direction.LEFT;
        this._mappedInput.right = this.direction === Direction.RIGHT;
        this._mappedInput.up = this.direction === Direction.UP;
        this._mappedInput.down = this.direction === Direction.DOWN;
    }

    getInput(): MappedInputResult {
        return {
            ... this._mappedInput
        };
    }

    destroy() {
        this.moveEvent.destroy();
        this.dashEvent.destroy();
    }
}