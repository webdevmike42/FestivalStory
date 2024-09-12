import '../characters/Faune';
import FloorSwitch, { getFloorSwitchByName } from '../objects/FloorSwitch';
import { BaseDungeonScene } from './BaseDungeonScene';

export class Game extends BaseDungeonScene {
    first = true;
    constructor() {
        super('Game');
    }

    create() {
        super.create("dungeon", "tilesetImage");

        this.time.delayedCall(2000, () => {
            this.scene.start("Dungeon01Floor00");
        })
    }

    update(t: number, dt: number) {
        if(this.first){
            console.log(getFloorSwitchByName("FloorSwitchOpenChest",this.floorSwitches.children.entries as FloorSwitch[]));
            this.first = false;
        }
        super.update(t, dt);
        
    }
}