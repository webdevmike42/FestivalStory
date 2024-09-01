import { Scene } from 'phaser';
import { debugDraw } from '../utils/debug';
import { createLizardAnims } from '../anims/EnemyAnims';
import { createCharacterAnims } from '../anims/CharacterAnims';
import Lizard from './enemies/Lizard';
import '../characters/Faune';
import Faune from '../characters/Faune';
import StateMachine from '../stateMachine/StateMachine';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private faune!: Faune;

    constructor() {
        super('Game');
    }

    preload() {
        if (this.input.keyboard !== null)
            this.cursors = this.input.keyboard?.createCursorKeys();
    }

    create() {
        createLizardAnims(this.anims);
        createCharacterAnims(this.anims);

        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        const map = this.make.tilemap({ key: "dungeon" });
        const tileset = map.addTilesetImage("dungeon", "tiles");

        if (tileset !== null) {
            map.createLayer("Ground", tileset);
            const wallsLayer: Phaser.Tilemaps.TilemapLayer | null = map.createLayer("Walls", tileset);

            if (wallsLayer !== null) {
                wallsLayer.setCollisionByProperty({ collides: true });

                debugDraw(wallsLayer, this);


                this.faune = this.add.faune(128, 128, "faune", "walk-side-3.png")

                this.physics.add.collider(this.faune, wallsLayer);

                const lizards = this.physics.add.group({
                    classType: Lizard,
                    createCallback: (go) => {
                        const lizGo = go as Lizard;
                        if (lizGo.body)
                            lizGo.body.onCollide = true;
                    }
                })

                lizards.get(256, 128, "lizard");

                this.physics.add.collider(lizards, wallsLayer);

                this.physics.add.collider(lizards, this.faune, this.handlePlayerLizardCollision, undefined, this);
            }
        }

        this.camera.startFollow(this.faune, true);

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });

        type PlayerState = 'Idle' | 'Running' | 'Jumping';
        const playerStateMachine = new StateMachine<PlayerState>("Idle");

        playerStateMachine.addState('Idle', {
            enter: () => console.log('Player enters Idle state'),
            exit: () => console.log('Player exits Idle state'),
            update: () => console.log('Player is Idle'),
        });

        playerStateMachine.addState('Jumping', {
            enter: () => console.log('Player enters Jumping state'),
            exit: () => console.log('Player exits Jumping state'),
            update: () => console.log('Player is Jumping'),
        });

        playerStateMachine.transition("Idle");
        playerStateMachine.transition("Running");
        playerStateMachine.transition("Jumping");
        playerStateMachine.transition("Idle");
        playerStateMachine.transition("Idle");
        
        
    }

    private handlePlayerLizardCollision(obj1: any, obj2: any) {
        const lizard = obj2 as Lizard;

        const dx = this.faune.x - lizard.x;
        const dy = this.faune.y - lizard.y

        const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

        this.faune.setVelocity(dir.x, dir.y);
        this.faune.handleDamage(dir);
    }

    update(t: number, dt: number) {
        this.faune.update(this.cursors);
    }
}