import { sceneEvents } from "../events/EventCenter";
import { EventManager, GAME_EVENTS } from "../events/EventManager";
import FloorSwitch from "../objects/FloorSwitch";
import { BaseDungeonScene } from "../scenes/BaseDungeonScene";
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

        this.addState("released", {
            enter: (stateParams: any[]) => {
                console.log('FS enters released state');
                sceneEvents.emit(this._floorSwitch.releaseEvent, this._floorSwitch);
                this.floorSwitch.anims.play('chest-closed');
            },
            exit: () => {
                console.log('FS exits released state');
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


                const chest = (this.floorSwitch.scene as BaseDungeonScene).getChestByTiledId(this.floorSwitch.opensChestTiledId);
                if (chest) {
                    EventManager.emit(GAME_EVENTS.PLAYER_ATTEMPT_OPEN_CHEST + chest.chestId, chest, this.floorSwitch.player);
                }
            },
            exit: () => {
                console.log('FS exits pressed state');
            },
            update: () => {
                if (!this.floorSwitch.staysPressed && !this.floorSwitch.scene.physics.overlap(this.floorSwitch, this.floorSwitch.player))
                    return this.createTransitionResult("released", []);
            }
        });
    }
}