import { isAnyMovementKeyDown } from "../controller/MappedInputController";
import Lizard from "../scenes/enemies/Lizard";
import StateMachine from "./StateMachine";

type LizardStates = "idle" | "walk" | "dash" | "damage" | "dead";

export class LizardStateMachine extends StateMachine<LizardStates>{
    private _lizard: Lizard;
    private _lizTimer: Phaser.Time.TimerEvent | undefined;

    public get lizTimer(): Phaser.Time.TimerEvent | undefined {
        return this._lizTimer;
    }
    public set lizTimer(value: Phaser.Time.TimerEvent | undefined) {
        this._lizTimer = value;
    }
   
    constructor(lizard: Lizard) {
        super("idle");
        this._lizard = lizard;

     

        this.addState("idle", {
            enter: (stateParams: any[]) => {
                console.log('Lizard enters Idle state');
                this._lizard.anims.play("lizard-run", true);
            },
            exit: () => {
                console.log('Lizard exits Idle state');
            },
            update: () => {
                console.log('Lizard is idle');
                if (isAnyMovementKeyDown(this._lizard.lizInput.getInput()))
                    return this.createTransitionResult("walk", []);
                
            }
        });

        this.addState("walk", {
            enter: (stateParams: any[]) => {
                console.log('Lizard enters walk state');
                this._lizard.anims.play("lizard-run");
            },
            exit: () => {
                console.log('Lizard exits walk state');
            },
            update: () => {
                console.log('Lizard is walking');
                const curInput = this._lizard.lizInput.getInput();
                if (!isAnyMovementKeyDown(curInput))
                    return this.createTransitionResult("idle", []);

                const speed = 50;

                if (curInput.left) {
                    lizard.setVelocity(-speed, 0);
                } else if (curInput.right) {
                    lizard.setVelocity(speed, 0);
                } else if (curInput.up) {
                    lizard.setVelocity(0, -speed);
                } else if (curInput.down) {
                    lizard.setVelocity(0, speed);
                }
            }
        });

        this.addState("damage", {
            enter: (stateParams: any[]) => {
                console.log('lizard enters damage state')
                if (!stateParams)
                    return;

                const dir = stateParams[0] as Phaser.Math.Vector2;
                const damage = stateParams[1] as number;

                lizard.setVelocity(dir.x, dir.y);
                lizard.setTint(0xff0000);
                lizard.health -= damage;
                this.lizTimer = undefined;
            },

            exit: () => {
                console.log('lizard exits damage state')
                lizard.setVelocity(0, 0);
                lizard.clearTint();
                if (this.lizTimer)
                    this.lizTimer.remove();
            },

            update: () => {

                if (lizard.health <= 0)
                    return this.createTransitionResult("dead", []);

                if (!this.lizTimer)
                    this.lizTimer = lizard.scene.time.delayedCall(250, () => {
                        console.log("delayed call")
                        this.transition("idle", [])
                    });
            }
        });

        this.addState("dead", {
            enter: (stateParams: any[]) => {
                console.log('lizard enters dead state')
                lizard.disableBody();
                lizard.setVisible(false);
            }
        });

        this.transition("idle", []);
    }
}