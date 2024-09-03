import Phaser from "phaser";
import Chest from "../items/Chest";
import { sceneEvents } from "../events/EventCenter";
import { createPlayerStateMachine } from "../stateMachine/PlayerStateMachine";

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            faune(x: number, y: number, texture: string, frame?: string | number): Faune
        }
    }
}

export default class Faune extends Phaser.Physics.Arcade.Sprite {
    
    private _health = 3;
    private _coins = 3;
    private _knives: Phaser.Physics.Arcade.Group;
    private _activeChest: Chest | undefined;
    private _stateMachine;
    private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);

        this._stateMachine = createPlayerStateMachine(this);
        
        sceneEvents.on("player-hurt-by-enemy", (dir: Phaser.Math.Vector2) => {
            if(this._stateMachine.getState() !== "damage" && this._stateMachine.getState() !== "dead"){
                this._stateMachine.transition("damage",[dir]);
            }
        });   
    }
        
    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        this._cursors = cursors;
        this._stateMachine.update();
    }

    public get cursors(): Phaser.Types.Input.Keyboard.CursorKeys {
        return this._cursors;
    }
    public set cursors(value: Phaser.Types.Input.Keyboard.CursorKeys) {
        this._cursors = value;
    }

    public get activeChest(): Chest | undefined {
        return this._activeChest;
    }
    public set activeChest(value: Chest | undefined) {
        this._activeChest = value;
    }

    public get coins() {
        return this._coins;
    }
    public set coins(value) {
        this._coins = value;
    }

    public get knives(): Phaser.Physics.Arcade.Group {
        return this._knives;
    }
    public set knives(value: Phaser.Physics.Arcade.Group) {
        this._knives = value;
    }

    setChest(chest: Chest) {
        this.activeChest = chest;
    }

    get health() {
        return this._health;
    }
    set health(health:number){
        this._health = health;
    }
}

Phaser.GameObjects.GameObjectFactory.register('faune', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
    let sprite = new Faune(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);

    sprite.body?.setSize(sprite.width * 0.5, sprite.height * 0.8);

    return sprite;
})