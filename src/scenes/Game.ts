import { Scene } from 'phaser';
import { debugDraw } from '../utils/debug';
import { createLizardAnims } from '../anims/EnemyAnims';
import { createCharacterAnims } from '../anims/CharacterAnims';
import Lizard from './enemies/Lizard';
import '../characters/Faune';
import Faune from '../characters/Faune';
import { sceneEvents } from '../events/EventCenter';
import { createChestAnims } from '../anims/TreasureAnims';
import Chest from '../items/Chest';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private faune!: Faune;
    private playerLizardsCollider: Phaser.Physics.Arcade.Collider;
    private knives!: Phaser.Physics.Arcade.Group;
    private lizards!: Phaser.Physics.Arcade.Group;

    constructor() {
        super('Game');
    }

    preload() {
        if (this.input.keyboard !== null)
            this.cursors = this.input.keyboard?.createCursorKeys();
    }

    createAnimations() {
        createLizardAnims(this.anims);
        createCharacterAnims(this.anims);
        createChestAnims(this.anims);
    }

    createCamera() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000000);
        this.camera.startFollow(this.faune, true);
    }

    create() {
        this.scene.run("game-ui");

        this.createAnimations();

        const map = this.make.tilemap({ key: "dungeon" });
        const tileset = map.addTilesetImage("dungeon", "tiles", 16, 16, 1, 2);

        if (tileset !== null) {
            map.createLayer("Ground", tileset);
            const wallsLayer: Phaser.Tilemaps.TilemapLayer | null = map.createLayer("Walls", tileset);

            const chests = this.physics.add.staticGroup({
                classType: Chest
            })

            const chestLayer: Phaser.Tilemaps.ObjectLayer | null = map.getObjectLayer("Chests");
            chestLayer?.objects.forEach(chestObj => {
                if (chestObj) {
                    // correct x and y because origin is in the middle of the object
                    chests.get(chestObj.x! + chestObj.width! * 0.5, chestObj.y! - chestObj.height! * 0.5, "treasure");
                }
            });


            this.lizards = this.physics.add.group({
                classType: Lizard,
                createCallback: (go) => {
                    const lizGo = go as Lizard;
                    if (lizGo.body)
                        lizGo.body.onCollide = true;
                }
            })


            const lizardLayer: Phaser.Tilemaps.ObjectLayer | null = map.getObjectLayer("Lizards");
            lizardLayer?.objects.forEach(lizObj => {
                if (lizObj) {
                    // correct x and y because origin is in the middle of the object
                    this.lizards.get(lizObj.x! + lizObj.width! * 0.5, lizObj.y! - lizObj.height! * 0.5, "lizard");
                }
            });

            if (wallsLayer !== null) {
                wallsLayer.setCollisionByProperty({ collides: true });

                //debugDraw(wallsLayer, this);

                this.faune = this.add.faune(128, 128, "faune", "walk-side-3.png")

                this.physics.add.collider(this.faune, wallsLayer);

                this.physics.add.collider(this.lizards, wallsLayer);

                this.playerLizardsCollider = this.physics.add.collider(this.lizards, this.faune, (player: any, lizard: any) => {
                    sceneEvents.emit("player-hurt-by-enemy", new Phaser.Math.Vector2((player as Faune).x - (lizard as Lizard).x, (player as Faune).y - (lizard as Lizard).y).normalize().scale(200));
                }, undefined, this);

                sceneEvents.on("destroy-player-lizard-collider", () => {
                    this.playerLizardsCollider.destroy();
                })

                this.knives = this.physics.add.group({
                    classType: Phaser.Physics.Arcade.Image,
                    maxSize: 3
                });

                this.physics.add.collider(this.knives, wallsLayer, this.handleKnifeWallCollision, undefined, this);
                this.physics.add.collider(this.knives, this.lizards, this.handleKnifeLizardCollision, undefined, this);
                this.physics.add.collider(this.knives, chests, this.handleKnifeWallCollision, undefined, this);

                this.physics.add.collider(this.faune, chests, this.handlePlayerChestCollision, undefined, this);

                this.faune.knives = this.knives;
            }
        }

        this.createCamera();
    }

    private handlePlayerChestCollision(obj1: any, obj2: any) {
        const chest = obj2 as Chest;
        this.faune.setChest(chest);
    }

    private handleKnifeLizardCollision(obj1: any, obj2: any) {
        this.knives.killAndHide(obj1);
        this.lizards.killAndHide(obj2);
    }

    private handleKnifeWallCollision(obj1: any, obj2: any) {
        this.knives.killAndHide(obj1);
    }

    update(t: number, dt: number) {
        this.faune.update(this.cursors);
    }
}