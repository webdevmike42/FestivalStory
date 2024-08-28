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
}