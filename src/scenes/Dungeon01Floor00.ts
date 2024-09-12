import { BaseDungeonScene } from "./BaseDungeonScene";


export class Dungeon01Floor00 extends BaseDungeonScene {
    

    constructor() {
        super('Dungeon01Floor00');
    }

    create() {
        super.create("dungeon", "tilesetImage"); 
    }

    update(t: number, dt: number) {
        super.update(t,dt);
    }
}