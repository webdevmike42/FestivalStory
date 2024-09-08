import Phaser from "phaser";
import { sceneEvents } from "../events/EventCenter";
import { FloorSwitchStateMachine } from "../stateMachine/FloorSwitchStateMachine";

export default class FloorSwitch extends Phaser.Physics.Arcade.Sprite {
    private _stateMachine: FloorSwitchStateMachine;
    private _overlappingObject: Phaser.GameObjects.GameObject | undefined;
    private staysPressed = false;
    
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this._stateMachine = new FloorSwitchStateMachine(this);

        sceneEvents.on("floorSwitch-overlapped", (floorSwitch: FloorSwitch, overlappingObject: Phaser.GameObjects.GameObject) => {
            if(floorSwitch === this && this._stateMachine.getState() === "released"){
                this._overlappingObject = overlappingObject
                this._stateMachine.transition("pressed",[overlappingObject]);
            }
        });

        this.scene.physics.world.on("worldstep", () => {
            if(!this.staysPressed && this._stateMachine.getState() === "pressed" && !this.scene.physics.overlap(this,this._overlappingObject)){
                this._overlappingObject = undefined;
                this._stateMachine.transition("released",[]);
            }
        })
    }

    update() {
        this._stateMachine.update();
    }
}