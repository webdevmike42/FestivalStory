import Faune from "../characters/Faune";
import Lizard from "../enemies/Lizard";
import { sceneEvents } from "../events/EventCenter";
import Chest from "../items/Chest";
import FloorSwitch from "../objects/FloorSwitch";
import { GameManager } from "../utils/GameManager";
import { EventManager } from "../events/EventManager";
import { debugDraw } from "../utils/debug";

export class BaseDungeonScene extends Phaser.Scene {
    private _player: Faune;
    public get player(): Faune {
        return this._player;
    }
    public set player(value: Faune) {
        this._player = value;
    }
    camera: Phaser.Cameras.Scene2D.Camera;
    tilemap: Phaser.Tilemaps.Tilemap;
    tileset: Phaser.Tilemaps.Tileset | null;
    enemies: Phaser.Physics.Arcade.Group;
    playerEnemyCollider: Phaser.Physics.Arcade.Collider;
    floorSwitches : Phaser.Physics.Arcade.Group;

    create(mapKey: string, tilesetImageKey: string) {

        if (!this.scene.isActive('game-ui')) {
            this.scene.launch('game-ui').bringToTop("game-ui");
        }

        this.createDungeonBasics(mapKey, tilesetImageKey, 16, 16);
    }

    createDungeonBasics(mapKey: string, tilesetImageKey: string, tileWidth: number, tileHeight: number) {
        // Gemeinsame Logik für alle Dungeon-Szenen

        this.tilemap = this.createTilemap("dungeon", "tilesetImage", 16, 16);
        this.tileset = this.tilemap.getTileset("dungeon");
        this.enemies = this.physics.add.group();

        if (this.tileset !== null) {
            this.tilemap.createLayer("Ground", this.tileset);

            this.addPlayer();

            const knives = this.physics.add.group({
                classType: Phaser.Physics.Arcade.Image,
                maxSize: 3
            });

            const wallsLayer: Phaser.Tilemaps.TilemapLayer | null = this.tilemap.createLayer("Walls", this.tileset);

            if (wallsLayer !== null) {
                wallsLayer.setCollisionByProperty({ collides: true });
                this.physics.add.collider(knives, wallsLayer, (obj1: any, obj2: any) => {
                    knives.killAndHide(obj1);
                }, undefined, this);

                debugDraw(wallsLayer, this);
            }

            const chests = this.physics.add.staticGroup({
                classType: Chest
            })

            const chestLayer: Phaser.Tilemaps.ObjectLayer | null = this.tilemap.getObjectLayer("Chests");
            chestLayer?.objects.forEach(chestObj => {
                if (chestObj) {
                    // correct x and y because origin is in the middle of the object
                    chests.get(chestObj.x! + chestObj.width! * 0.5, chestObj.y! - chestObj.height! * 0.5, "treasure");
                }
            });

            this.floorSwitches = this.physics.add.group({
                classType: FloorSwitch
            });

            const lizards = this.physics.add.group({
                classType: Lizard,
                createCallback: (go) => {
                    const lizGo = go as Lizard;
                    if (lizGo.body) {
                        lizGo.body.onCollide = true;
                        this.enemies.add(lizGo);
                    }
                }
            })

            const lizardLayer: Phaser.Tilemaps.ObjectLayer | null = this.tilemap.getObjectLayer("Lizards");

            lizardLayer?.objects.forEach(lizObj => {
                if (lizObj) {
                    // correct x and y because origin is in the middle of the object
                    //lizards.get(lizObj.x! + lizObj.width! * 0.5, lizObj.y! - lizObj.height! * 0.5, "lizard");
                }
            });

            if (wallsLayer) {
                this.physics.add.collider(this.player, wallsLayer);
                this.physics.add.collider(this.enemies, wallsLayer);
            }

            if (!this.playerEnemyCollider) {
                this.playerEnemyCollider = this.physics.add.collider(this.enemies, this.player, (player, enemy) => {
                    const vecP = new Phaser.Math.Vector2((this.player as Phaser.GameObjects.GameObject).body?.position);
                    const vecE = new Phaser.Math.Vector2((enemy as Phaser.GameObjects.GameObject).body?.position);
                    sceneEvents.emit("player-hurt-by-enemy", vecP.subtract(vecE).normalize().scale(200));
                }, undefined, this);
            }

            EventManager.on("destroy-player-lizard-collider", () => {
                this.playerEnemyCollider.destroy();
            })

            this.physics.add.collider(knives, lizards, (obj1: any, obj2: any) => {
                const lizard = obj2 as Lizard;
                const knife = obj1 as Phaser.Physics.Arcade.Image;

                sceneEvents.emit("lizard-hurt", new Phaser.Math.Vector2(lizard.x - knife.x, lizard.y - knife.y).normalize().scale(200), 1);
                knives.killAndHide(knife);
            }, undefined, this);

            this.physics.add.collider(knives, chests, (obj1: any, obj2: any) => {
                knives.killAndHide(obj1);
            }, undefined, this);

            this.physics.add.collider(this.player, chests, (obj1: any, obj2: any) => {
                const chest = obj2 as Chest;
                this.player.setChest(chest);
            }, undefined, this);


            this.player.knives = knives;

            this.createCamera();

            this.events.on('shutdown', this.destroy, this);
        }
    }

    createCamera() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000000);
        this.camera.startFollow(this.player, true);
    }

    addPlayer() {
        this.player = new Faune(
            this,
            GameManager.playerData.position.x,
            GameManager.playerData.position.y,
            GameManager.playerData.texture,
            GameManager.playerData.frame
        );

        this.player.initStateMachine();

        this.physics.add.existing(this.player); // Fügt Physik-Body hinzu

        // Sicherstellen, dass der Physik-Body aktiv ist
        if (this.player.body) {
            (this.player.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
        }

        this.children.add(this.player); // Spieler zur Display-Liste hinzufügen
        this.player.setDepth(10);
    }

    createTilemap(mapKey: string, tilesetImageKey: string, tileWidth: number, tileHeight: number) {
        const map = this.make.tilemap({ key: mapKey });
        map.addTilesetImage(mapKey, tilesetImageKey, tileWidth, tileHeight, 1, 2);

        return map;
    }

    destroy() {
        if (this.playerEnemyCollider) {
            this.playerEnemyCollider.destroy();
        }
    }

    update(t: number, dt: number){
        this.player.update();
        
        this.enemies.children.each((enemy: Phaser.GameObjects.GameObject, index: number) => {
            (enemy).update();
            return true;
        });
    }
}