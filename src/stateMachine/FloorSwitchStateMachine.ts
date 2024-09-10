import { sceneEvents } from "../events/EventCenter";
import { EventManager } from "../events/EventManager";
import FloorSwitch from "../objects/FloorSwitch";
import StateMachine from "./StateMachine";

type FloorSwitchStates = "pressed" | "released"

export class FloorSwitchStateMachine extends StateMachine<FloorSwitchStates>{
    private _floorSwitch: FloorSwitch;

    public get floorSwitch(): FloorSwitch {
        return this._floorSwitch;
    }
    public set floorSwitch(value: FloorSwitch) {
        this._floorSwitch = value;
    }

    constructor(floorSwitch: FloorSwitch, pressCallback: Function = () => { }, releaseCallback: Function = () => { }) {
        super("released");
        this._floorSwitch = floorSwitch;

        this.addState("released", {
            enter: (stateParams: any[]) => {
                console.log('FS enters released state');
                sceneEvents.emit(this._floorSwitch.releaseEvent, this._floorSwitch);
                this.floorSwitch.anims.play('chest-closed');
            },
            update: () => {
                if (this.floorSwitch.scene.physics.overlap(this.floorSwitch, this._floorSwitch.player))
                    return this.createTransitionResult("pressed", []);
            }
        });

        this.addState("pressed", {
            enter: (stateParams: any[]) => {
                console.log('FS enters pressed state');
                sceneEvents.emit(this._floorSwitch.pressEvent, this._floorSwitch);
                this.floorSwitch.anims.play('chest-open', true);
                console.log(this.floorSwitch.anims.currentAnim?.key);
            },
            exit: () => {
                console.log('FS exits pressed state');
            },
            update: () => {
                const isOverlapping = this.floorSwitch.scene.physics.overlap(this.floorSwitch, this.floorSwitch.player); // Spieler oder ein anderes Objekt
                if (!this.floorSwitch.staysPressed && !isOverlapping)
                    return this.createTransitionResult("released", []);
            }
        });
    }
}