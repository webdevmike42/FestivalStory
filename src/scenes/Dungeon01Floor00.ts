import Lizard from "../enemies/Lizard";
import FloorSwitch from "../objects/FloorSwitch";
import { BaseDungeonScene } from "./BaseDungeonScene";


export class Dungeon01Floor00 extends BaseDungeonScene {
    

    constructor() {
        super('Dungeon01Floor00');
    }

    create() {
        super.create("dungeon", "tilesetImage"); 
        const floorSwitchLayer: Phaser.Tilemaps.ObjectLayer | null = this.tilemap.getObjectLayer("FloorSwitches");
        floorSwitchLayer?.objects.forEach(fsObj => {
            if (fsObj) {
                // correct x and y because origin is in the middle of the object
                const fs: FloorSwitch = this.floorSwitches.get(fsObj.x!+50 + fsObj.width! * 0.5, fsObj.y! - fsObj.height! * 0.5, "treasure");
                fs.init(this.player, fsObj.properties || []);
            }
        });
    }

    update(t: number, dt: number) {
        super.update(t,dt);
    
        this.floorSwitches.children.each((floorSwitch: Phaser.GameObjects.GameObject, index: number) => {
            (floorSwitch as FloorSwitch).update(t,dt);
            return true;
        });
    }
}