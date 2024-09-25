import Phaser from "phaser";
import Chest from "../items/Chest";
import { sceneEvents } from "../events/EventCenter";
import { MappedInputController } from "../controller/MappedInputController";
import { KeyboardInput } from "../controller/KeyboardInput";
import { PlayerStateMachine } from "../stateMachine/PlayerStateMachine";
import { EventManager } from "../events/EventManager";
import { BaseDungeonScene } from "../scenes/BaseDungeonScene";

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
    private _stateMachine: PlayerStateMachine;
    private _playerInputControl: MappedInputController;
    private _viewVector: Phaser.Math.Vector2;
    public get viewVector(): Phaser.Math.Vector2 {
        return this._viewVector;
    }
    public set viewVector(value: Phaser.Math.Vector2) {
        this._viewVector = value;
    }

    private _gameScene: BaseDungeonScene;
    public get gameScene(): BaseDungeonScene {
        return this._gameScene;
    }
    public set gameScene(value: BaseDungeonScene) {
        this._gameScene = value;
    }

    constructor(scene: BaseDungeonScene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);

        this._playerInputControl = new KeyboardInput(scene.input.keyboard?.createCursorKeys());
        this.gameScene = scene;
    }

    initStateMachine() {
        this._stateMachine = new PlayerStateMachine(this);
/*
        sceneEvents.off("player-hurt-by-enemy");//Alte Eventlistener entfernen nach dem Szenenwechsel
        sceneEvents.on("player-hurt-by-enemy", (dir: Phaser.Math.Vector2) => {
            if (this._stateMachine.getState() !== "damage" && this._stateMachine.getState() !== "dead") {
                console.error("before transition");
                this._stateMachine.transition("damage", [dir]);
            }
        });
        */
       EventManager.on("player-hurt-by-enemy", (dir: Phaser.Math.Vector2) => {
        if (this._stateMachine.getState() !== "damage" && this._stateMachine.getState() !== "dead") {
            console.error("before transition");
            this._stateMachine.transition("damage", [dir]);
        }
    });
    }

    getStateMachine(){
        return this._stateMachine;
    }

    update() {
        if (this._stateMachine)
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
    let sprite = new Faune(this.scene as BaseDungeonScene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);

    sprite.body?.setSize(sprite.width * 0.5, sprite.height * 0.8);

    return sprite;
})