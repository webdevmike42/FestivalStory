import Phaser from "phaser";
declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            faune(x: number, y: number, texture: string, frame?: string | number): Faune
        }
    }
}

enum HealthStates {
    IDLE,
    DAMAGE,
    DEAD
}

export default class Faune extends Phaser.Physics.Arcade.Sprite {
    private healthState = HealthStates.IDLE;
    private damageTime = 0;
    private _health = 3;
    private knives: Phaser.Physics.Arcade.Group;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);

        this.anims.play("faune-idle-down");
    }

    setKnives(knives: Phaser.Physics.Arcade.Group) {
        this.knives = knives;
    }

    get health() {
        return this._health;
    }

    handleDamage(dir: Phaser.Math.Vector2) {
        if (this.healthState === HealthStates.DAMAGE || this.healthState === HealthStates.DEAD)
            return;

        this.setVelocity(dir.x, dir.y);

        this.setTint(0xff0000);
        this.healthState = HealthStates.DAMAGE;
        this.damageTime = 0;
        this._health--;
        if (this.health <= 0) {
            this.healthState = HealthStates.DEAD;
            this.anims.play("faune-faint");
            this.setVelocity(0, 0);
            this.clearTint();
        }
    }

    private throwKnife() {
        if (!this.knives)
            return;
        const parts: string[] = this.anims.currentAnim?.key.split('-') || [];
        const direction = parts[2];
        const vec = new Phaser.Math.Vector2(0, 0);

        switch (direction) {
            case "up":
                vec.y = -1;
                break;
            case "down":
                vec.y = 1;
                break;
            default:
            case "side":
                if (this.scaleX < 0)
                    vec.x = -1;
                else
                    vec.x = 1;
                break;
        }

        const angle = vec.angle();
        const knife = this.knives.get(this.x, this.y, "knife") as Phaser.Physics.Arcade.Image;
        knife.setActive(true);
        knife.setVisible(true);
        knife.x += vec.x * 16;
        knife.y += vec.y * 16;
        knife.setRotation(angle);
        knife.setVelocity(vec.x * 300, vec.y * 300);
    }

    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt);

        switch (this.healthState) {
            case HealthStates.IDLE:
                break;
            case HealthStates.DAMAGE:
                this.damageTime += dt;
                if (this.damageTime >= 250) {
                    this.healthState = HealthStates.IDLE;
                    this.clearTint();
                    this.damageTime = 0;
                }
                break;
        }

    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (!cursors || this.healthState === HealthStates.DAMAGE || this.healthState === HealthStates.DEAD)
            return;

        if (Phaser.Input.Keyboard.JustDown(cursors.space!)) {
            this.throwKnife();
        }

        const speed: number = 100;
        let vx = 0;
        let vy = 0;

        if (cursors.left?.isDown) {
            vx = -speed;
            this.scaleX = -1;
            if (this.body !== null) this.body.offset.x = 24;
        }
        if (cursors.right?.isDown) {
            vx = speed;
            this.scaleX = 1;
            if (this.body !== null) this.body.offset.x = 8;
        }
        if (cursors.up?.isDown) {
            vy = -speed;
        }
        if (cursors.down?.isDown) {
            vy = speed;
        }

        if (vx !== 0 || vy !== 0) {
            this.setVelocity(vx, vy);
            if (vx !== 0) {
                this.anims.play("faune-walk-side", true);
            } else if (vy < 0) {
                this.anims.play('faune-walk-up', true);
            } else if (vy > 0) {
                this.anims.play('faune-walk-down', true);
            }
        } else {
            this.setVelocity(0, 0);
            const parts: string[] = this.anims.currentAnim?.key.split('-') || [];
            parts[1] = 'idle';
            this.anims.play(parts.join('-'));
        }
    }
}

Phaser.GameObjects.GameObjectFactory.register('faune', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
    let sprite = new Faune(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);

    sprite.body?.setSize(sprite.width * 0.5, sprite.height * 0.8);

    return sprite;
})