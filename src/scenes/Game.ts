import { debugDraw } from '../utils/debug';
import Lizard from '../enemies/Lizard';
import '../characters/Faune';
import Faune from '../characters/Faune';
import { sceneEvents } from '../events/EventCenter';
import Chest from '../items/Chest';
import FloorSwitch from '../objects/FloorSwitch';
import { BaseDungeonScene } from './BaseDungeonScene';
import { GameManager } from '../utils/GameManager';

export class Game extends BaseDungeonScene {
    // camera: Phaser.Cameras.Scene2D.Camera;
    msg_text: Phaser.GameObjects.Text;
    private faune!: Faune;
    private playerLizardsCollider: Phaser.Physics.Arcade.Collider;
    private knives!: Phaser.Physics.Arcade.Group;
    private lizards!: Phaser.Physics.Arcade.Group;
    private floorSwitches!: Phaser.Physics.Arcade.Group;

    constructor() {
        super('Game');
    }

    create() {
        super.create("dungeon", "tilesetImage");
        
        this.time.delayedCall(1000, () => {
            this.scene.start("Dungeon01Floor00");
        });

    }

    private handlePlayerChestCollision(obj1: any, obj2: any) {
        const chest = obj2 as Chest;
        this.faune.setChest(chest);
    }

    private handleKnifeLizardCollision(obj1: any, obj2: any) {
        const lizard = obj2 as Lizard;
        const knife = obj1 as Phaser.Physics.Arcade.Image;


        this.knives.killAndHide(knife);
        sceneEvents.emit("lizard-hurt", new Phaser.Math.Vector2(lizard.x - knife.x, lizard.y - knife.y).normalize().scale(200), 1);
    }

    private handleKnifeWallCollision(obj1: any, obj2: any) {
        this.knives.killAndHide(obj1);
    }

    update(t: number, dt: number) {
        super.update(t,dt);
        
    /*
        this.floorSwitches.children.each((floorSwitch: Phaser.GameObjects.GameObject, index: number) => {
            (floorSwitch as FloorSwitch).update();
            return true;
        });
      */  
    }
}