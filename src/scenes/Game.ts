import { Scene } from 'phaser';
import { debugDraw } from '../utils/debug';


export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private faune!: Phaser.Physics.Arcade.Sprite;

    constructor() {
        super('Game');
    }

    preload() {
        if (this.input.keyboard !== null)
            this.cursors = this.input.keyboard?.createCursorKeys();
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        const map = this.make.tilemap({ key: "dungeon" });
        const tileset = map.addTilesetImage("dungeon", "tiles");

        if(tileset !== null ){
            map.createLayer("Ground", tileset);
            const wallsLayer : Phaser.Tilemaps.TilemapLayer | null = map.createLayer("Walls", tileset);
            
            if(wallsLayer !== null){
                wallsLayer.setCollisionByProperty({ collides: true });

                debugDraw(wallsLayer,this);

                this.faune = this.physics.add.sprite(128, 128, "faune", "walk-side-3.png");
                this.faune.setSize(16,32);
                this.physics.add.collider(this.faune, wallsLayer);
            }
        }

        this.faune.anims.create({
            key: 'faune-idle-down',
            frames: [{ key: 'faune', frame: 'walk-down-3.png' }]
        })

        this.faune.anims.create({
            key: 'faune-idle-up',
            frames: [{ key: 'faune', frame: 'walk-up-3.png' }]
        })

        this.faune.anims.create({
            key: 'faune-idle-side',
            frames: [{ key: 'faune', frame: 'walk-side-3.png' }]
        })

        this.faune.anims.create({
            key: 'faune-walk-down',
            frames: this.faune.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'walk-down-', suffix: '.png' }),
            repeat: -1,
            frameRate: 15
        })

        this.faune.anims.create({
            key: 'faune-walk-up',
            frames: this.faune.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'walk-up-', suffix: '.png' }),
            repeat: -1,
            frameRate: 15
        })

        this.faune.anims.create({
            key: 'faune-walk-side',
            frames: this.faune.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'walk-side-', suffix: '.png' }),
            repeat: -1,
            frameRate: 15
        })

        this.faune.anims.create({
            key: 'faune-faint',
            frames: this.faune.anims.generateFrameNames('faune', { start: 1, end: 4, prefix: 'faint-', suffix: '.png' }),
            frameRate: 15
        })


        this.faune.anims.play("faune-idle-down");

        this.camera.startFollow(this.faune, true);

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }

    update(t: number, dt: number) {
        if (!(this.cursors && this.faune))
            return;

        const speed: number = 100;
        let vx = 0;
        let vy = 0;

        if (this.cursors.left?.isDown) {
            vx = -speed;
            this.faune.scaleX = -1;
            if (this.faune.body !== null) this.faune.body.offset.x = 24;
        }
        if (this.cursors.right?.isDown) {
            vx = speed;
            this.faune.scaleX = 1;
            if (this.faune.body !== null) this.faune.body.offset.x = 8;
        }
        if (this.cursors.up?.isDown) {
            vy = -speed;
        }
        if (this.cursors.down?.isDown) {
            vy = speed;
        }

        if (vx !== 0 || vy !== 0) {
            this.faune.setVelocity(vx, vy);
            if (vx !== 0) {
                this.faune.anims.play('faune-walk-side', true);
            } else if (vy < 0) {
                this.faune.anims.play('faune-walk-up', true);
            } else if (vy > 0) {
                this.faune.anims.play('faune-walk-down', true);
            }
        } else {
            this.faune.setVelocity(0, 0);
            const parts: string[] = this.faune.anims.currentAnim?.key.split('-') || [];
            parts[1] = 'idle';
            this.faune.anims.play(parts.join('-'));
        }
    }
}
