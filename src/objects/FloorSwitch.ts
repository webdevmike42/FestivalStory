import Phaser from "phaser";
import { FloorSwitchStateMachine } from "../stateMachine/FloorSwitchStateMachine";
import Faune from "../characters/Faune";

enum TiledProperties {
    PRESS_EVENT = "pressEvent",
    RELEASE_EVENT = "releaseEvent"
}

export default class FloorSwitch extends Phaser.Physics.Arcade.Sprite {
    private _stateMachine: FloorSwitchStateMachine;
    private _staysPressed = false;
    private _fsName: string;
    public get fsName(): string {
        return this._fsName;
    }
    public set fsName(value: string) {
        this._fsName = value;
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
        this.fsName = tiledObject.name;
        tiledObject.properties.forEach((prop: any, index: number) => {
            //console.error(index);
            //console.error(prop["name"]);
            if (prop["name"] === TiledProperties.PRESS_EVENT)
                this.pressEvent = prop["value"];
            if (prop["name"] === TiledProperties.RELEASE_EVENT)
                this.releaseEvent = prop["value"];
        });
    }
}

const getFloorSwitchByName = (fsName: string, floorSwitches: FloorSwitch[]): FloorSwitch | undefined => {
    return floorSwitches.find(fs => fs.fsName === fsName);
}

export {
    getFloorSwitchByName
}