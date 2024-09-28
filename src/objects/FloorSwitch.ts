import Phaser from "phaser";
import { FloorSwitchStateMachine } from "../stateMachine/FloorSwitchStateMachine";
import Faune from "../characters/Faune";
import { BaseDungeonScene } from "../scenes/BaseDungeonScene";

enum TiledProperties {
    PRESS_EVENT = "pressEvent",
    RELEASE_EVENT = "releaseEvent",
    OPEN_CHEST = "OpenChest",
    STAYS_PRESSED = "staysPressed"
}

export default class FloorSwitch extends Phaser.Physics.Arcade.Sprite {
    private _stateMachine: FloorSwitchStateMachine;
    private _staysPressed = false;

    public get tiledId(): number {
        return this.tiledObject.id;
    }

    private _tiledObject: Phaser.Types.Tilemaps.TiledObject;
    public get tiledObject(): Phaser.Types.Tilemaps.TiledObject {
        return this._tiledObject;
    }
    public set tiledObject(value: Phaser.Types.Tilemaps.TiledObject) {
        this._tiledObject = value;
    }

    private _fsName: string;
    public get fsName(): string {
        return this.tiledObject.name;
    }

    public get staysPressed() {
        return this._staysPressed;
    }
    public set staysPressed(value) {
        this._staysPressed = value;
    }

    private _tiledProperties: any[];
    public get tiledProperties(): any[] {
        return this._tiledProperties;
    }
    public set tiledProperties(value: any[]) {
        this._tiledProperties = value;
    }

    private _pressEvent: string;
    public get pressEvent(): string {
        return this._pressEvent;
    }
    public set pressEvent(value: string) {
        this._pressEvent = value;
    }

    private _releaseEvent: string;
    public get releaseEvent(): string {
        return this._releaseEvent;
    }
    public set releaseEvent(value: string) {
        this._releaseEvent = value;
    }

    private _player: Faune;
    public get player(): Faune {
        return this._player;
    }
    public set player(value: Faune) {
        this._player = value;
    }

    private _opensChestTiledId: number;
    public get opensChestTiledId(): number {
        return this._opensChestTiledId;
    }
    public set opensChestTiledId(value: number) {
        this._opensChestTiledId = value;
    }

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
    }

    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt);

        if (!this._stateMachine) {
            this._stateMachine = new FloorSwitchStateMachine(this);
        }
    }

    update(t: number, dt: number) {
        super.update(t, dt);
        this._stateMachine.update();
    }

    init(player: Faune, tiledObject: Phaser.Types.Tilemaps.TiledObject) {
        this.player = player;
        this.tiledObject = tiledObject;

        tiledObject.properties.forEach((prop: any, index: number) => {
            if (prop["name"] === TiledProperties.PRESS_EVENT)
                this.pressEvent = prop["value"];
            if (prop["name"] === TiledProperties.RELEASE_EVENT)
                this.releaseEvent = prop["value"];
            if (prop["name"] === "OpenChest")
                this.opensChestTiledId = prop["value"];
            if (prop["name"] === TiledProperties.STAYS_PRESSED)
                this.staysPressed = prop["value"];
        });
    }
}

const getFloorSwitchByName = (fsName: string, floorSwitches: FloorSwitch[]): FloorSwitch | undefined => {
    return floorSwitches.find(fs => fs.fsName === fsName);
}

export {
    getFloorSwitchByName
}