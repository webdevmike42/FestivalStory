import Phaser from "phaser";
import { MappedInput } from "../../controller/MappedInput";
import { Lizard_AI_Input } from "../../controller/Lizard_AI_Input";
import { KeyboardInput } from "../../controller/KeyboardInput";

export default class Lizard extends Phaser.Physics.Arcade.Sprite {
    private _lizInput: MappedInput;
 
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number, input?: MappedInput) {
        super(scene, x, y, texture, frame);
        this.anims.play("lizard-run");
        this._lizInput = input || new Lizard_AI_Input(scene,this);

        scene.time.delayedCall(2000, () => {
            this._lizInput = new KeyboardInput(scene);
        })
    }
    

    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt);

        const speed = 50;
        const { left, right, up, down } = this._lizInput.getInput();

        if (left) {
            this.setVelocity(-speed, 0);
        } else if (right) {
            this.setVelocity(speed, 0);
        } else if (up) {
            this.setVelocity(0, -speed);
        } else if (down) {
            this.setVelocity(0, speed);
        } else {
            this.setVelocity(0, 0);
        }
    }

    public get lizInput(): MappedInput {
        return this._lizInput;
    }
    public set lizInput(value: MappedInput) {
        this._lizInput = value;
    }
}



/*
import Phaser from "phaser";
import { ControlStrategy } from "../../controller/ControlStrategy";
import { AIControl } from "../../controller/Lizard_AI_Control";

export default class Lizard extends Phaser.Physics.Arcade.Sprite {
    private controlStrategy: ControlStrategy;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number, controlStrategy?: ControlStrategy) {
        super(scene, x, y, texture, frame);
        this.controlStrategy = controlStrategy || new AIControl(scene, this);

        this.anims.play("lizard-run");

        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, (go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) => {
            if (go !== this) {
                return;
            }

            this.controlStrategy.update(this);
        }, this);
    }

    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt);
        this.controlStrategy.update(this);
    }

    setControlStrategy(strategy: ControlStrategy) {
        this.controlStrategy = strategy;
    }
}


*/



/*
import Phaser from "phaser"

enum Direction {
    UP, DOWN, LEFT, RIGHT
}

export default class Lizard extends Phaser.Physics.Arcade.Sprite {
    private direction: Direction = Direction.RIGHT;
    private moveEvent: Phaser.Time.TimerEvent;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);

        this.anims.play("lizard-run");

        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, (go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) => {
            if (go !== this) {
                return;
            }

            this.setRandomNewDirection(this.direction);

        }, this);

        this.moveEvent = scene.time.addEvent({
            delay: 2000,
            callback: () => {
                this.setRandomNewDirection(this.direction);
            },
            loop: true
        })
    }

    setRandomNewDirection(excludeDirection: Direction) {
        let newDirection = Phaser.Math.Between(0, 3);

        while (newDirection === excludeDirection)
            newDirection = Phaser.Math.Between(0, 3)

        this.direction = newDirection;
    }

    destroy(fromScene?: boolean | undefined): void {

        this.moveEvent.destroy();
        super.destroy(fromScene);   //call super() at the end
        
    }


    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt); //call super() in the beginning

        const speed = 50;

        switch (this.direction) {
            case Direction.UP:
                this.setVelocity(0, -speed);
                break;
            case Direction.DOWN:
                this.setVelocity(0, speed);
                break;
            case Direction.LEFT:
                this.setVelocity(-speed, 0);
                break;
            case Direction.RIGHT:
                this.setVelocity(speed, 0);
                break;
        }
    }
}*/