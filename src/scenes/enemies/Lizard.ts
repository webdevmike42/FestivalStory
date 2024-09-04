import Phaser from "phaser";
import { MappedInputController } from "../../controller/MappedInputController";
import { Lizard_AI_Input } from "../../controller/Lizard_AI_Input";
import { LizardStateMachine } from "../../stateMachine/LizardStateMachine";
import { sceneEvents } from "../../events/EventCenter";

export default class Lizard extends Phaser.Physics.Arcade.Sprite {
    private _lizInput: MappedInputController;
    private _stateMachine: LizardStateMachine;
    private _health = 2;
    

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number, input?: MappedInputController) {
        super(scene, x, y, texture, frame);

        this._lizInput = input || new Lizard_AI_Input(scene, this);
        this._stateMachine = new LizardStateMachine(this);

        sceneEvents.on("lizard-hurt", (dir: Phaser.Math.Vector2, damage: number) => {
            if (this._stateMachine.getState() !== "damage" && this._stateMachine.getState() !== "dead") {
                this._stateMachine.transition("damage", [dir,damage]);
            }
        });
    }

    update() {
        this._stateMachine.update();
    }

    public get lizInput(): MappedInputController {
        return this._lizInput;
    }
    public set lizInput(value: MappedInputController) {
        this._lizInput = value;
    }

    public get health() {
        return this._health;
    }
    public set health(value) {
        this._health = value;
    }
}