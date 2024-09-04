import Phaser from "phaser";
import Chest from "../items/Chest";
import { sceneEvents } from "../events/EventCenter";
import { MappedInputController } from "../controller/MappedInputController";
import { KeyboardInput } from "../controller/KeyboardInput";
import { PlayerStateMachine } from "../stateMachine/PlayerStateMachine";

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
    private _playerInputControl: MappedInputController;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);

        this._stateMachine = new PlayerStateMachine(this);
        this._playerInputControl = new KeyboardInput(scene.input.keyboard?.createCursorKeys());

        console.log(this._playerInputControl)

        sceneEvents.on("player-hurt-by-enemy", (dir: Phaser.Math.Vector2) => {
            if (this._stateMachine.getState() !== "damage" && this._stateMachine.getState() !== "dead") {
                this._stateMachine.transition("damage", [dir]);
            }
        });
    }

    update() {
        this._stateMachine.update();
    }

    public get playerInput(): MappedInputController {
        return this._playerInputControl;
    }
    public set playerInput(value: MappedInputController) {
        this._playerInputControl = value;
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
    set health(health: number) {
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