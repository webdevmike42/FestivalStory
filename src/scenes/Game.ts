import { Scene } from 'phaser';
import { debugDraw } from '../utils/debug';
import { createLizardAnims } from '../anims/EnemyAnims';
import { createCharacterAnims } from '../anims/CharacterAnims';
import Lizard from './enemies/Lizard';
import '../characters/Faune';
import Faune from '../characters/Faune';
import StateMachine from '../stateMachine/StateMachine';
import { sceneEvents } from '../events/EventCenter';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private faune!: Faune;
    private playerLizardsCollider: Phaser.Physics.Arcade.Collider;

    constructor() {
        super('Game');
    }

    preload() {
        if (this.input.keyboard !== null)
            this.cursors = this.input.keyboard?.createCursorKeys();
    }

    create() {
        this.scene.run("game-ui");

        createLizardAnims(this.anims);
        createCharacterAnims(this.anims);

        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000000);        

        const map = this.make.tilemap({ key: "dungeon" });
        const tileset = map.addTilesetImage("dungeon", "tiles");

        if (tileset !== null) {
            map.createLayer("Ground", tileset);
            const wallsLayer: Phaser.Tilemaps.TilemapLayer | null = map.createLayer("Walls", tileset);

            if (wallsLayer !== null) {
                wallsLayer.setCollisionByProperty({ collides: true });

                //debugDraw(wallsLayer, this);


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

                this.playerLizardsCollider = this.physics.add.collider(lizards, this.faune, this.handlePlayerLizardCollision, undefined, this);

                /*
                const knives = this.add.group({
                    classType: Phaser.Physics.Arcade.Image
                });*/
            }
        }

        this.camera.startFollow(this.faune, true);
/*
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
        
        */
    }

    private handlePlayerLizardCollision(obj1: any, obj2: any) {
        const lizard = obj2 as Lizard;

        const dx = this.faune.x - lizard.x;
        const dy = this.faune.y - lizard.y

        const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

        this.faune.setVelocity(dir.x, dir.y);
        this.faune.handleDamage(dir);
        sceneEvents.emit("player-health-changed", this.faune.health)    //todo: put events in enum in separat file

        if(this.faune.health <= 0)
            this.playerLizardsCollider.destroy();
    }

    update(t: number, dt: number) {
        this.faune.update(this.cursors);
    }
}