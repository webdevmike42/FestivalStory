import Lizard from "../enemies/Lizard";
import { BaseDungeonScene } from "./BaseDungeonScene";


export class Dungeon01Floor00 extends BaseDungeonScene {
    

    constructor() {
        super('Dungeon01Floor00');
    }

    create() {
        super.create("dungeon", "tilesetImage"); 

    }

    update(t: number, dt: number) {
        this.player.update();
        
        this.enemies.children.each((lizard: Phaser.GameObjects.GameObject, index: number) => {
            (lizard as Lizard).update();
            return true;
        });
    /*
        this.floorSwitches.children.each((floorSwitch: Phaser.GameObjects.GameObject, index: number) => {
            (floorSwitch as FloorSwitch).update();
            return true;
        });
      */  
    }
}