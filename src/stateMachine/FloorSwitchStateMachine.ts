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

    constructor(floorSwitch: FloorSwitch) {
        super("released");
        this._floorSwitch = floorSwitch;

        this.initStates();
        this.start();
    }

    initStates(){
        this.addState("released", {
            enter: (stateParams: any[]) => {
                console.log('FS enters released state');
                this.floorSwitch.play('chest-closed');
            },
            exit: () => {
                console.log('FS exits released state');
            },
            update: () => {
                return undefined;
                
            }
        });

        this.addState("pressed", {
            enter: (stateParams: any[]) => {
                console.log('FS enters pressed state');
                this.floorSwitch.play('chest-open');
            },
            exit: () => {
                console.log('FS exits pressed state');
            },
            update: () => {
                return undefined;
            }   
        });
    }

    start(){
        this.transition("released",[]);
    }
}