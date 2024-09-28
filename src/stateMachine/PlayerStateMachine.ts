import Faune from "../characters/Faune";
import { isAnyMovementKeyDown } from "../controller/MappedInputController";
import { EventManager, GAME_EVENTS } from "../events/EventManager";
import Chest, { getChestByName } from "../items/Chest";
import StateMachine from "./StateMachine";

type PlayerStates = "idle" | "walk" | "attack" | "damage" | "dead";

export class PlayerStateMachine extends StateMachine<PlayerStates>{
    private _player: Faune;
    private _timer: Phaser.Time.TimerEvent | undefined;

    constructor(player: Faune) {
        super("idle");
        this._player = player;
        this.initStates();
        this.start();
    }

    public get player(): Faune {
        return this._player;
    }
    public set player(value: Faune) {
        this._player = value;
    }

    public get timer(): Phaser.Time.TimerEvent | undefined {
        return this._timer;
    }
    public set timer(value: Phaser.Time.TimerEvent | undefined) {
        this._timer = value;
    }

    private initStates() {

        this.addState("idle", {
            enter: (stateParams: any[]) => {
                //console.log('Player enters Idle state')
                if (stateParams && typeof stateParams[0] === "string")
                    this.player.anims.play(stateParams[0])
                else
                    this.player.anims.play("faune-idle-down");
            },
            update: () => {
                const pInput = this.player.playerInput.getInput();
                if (pInput.up || pInput.down || pInput.left || pInput.right) {
                    return this.createTransitionResult("walk", []);
                }

                if (pInput.actionPressed) {
                    const gScene = this.player.gameScene;
                    const helperBox = gScene.add.rectangle(this.player.x + this.player.viewVector.x * this.player.displayWidth, this.player.y + this.player.viewVector.y * this.player.displayHeight, this.player.displayWidth, this.player.displayHeight);
                    helperBox.setVisible(false);
                    gScene.physics.add.existing(helperBox);

                    let nearestChest: Chest | undefined = undefined;
                    let shortestDistance = Infinity;

                    // Overlap-Erkennung
                    const overlap = gScene.physics.add.overlap(helperBox, gScene.getChests(), (helper, chestObj) => {
                        const chest = chestObj as Chest;
                        const distance = Phaser.Math.Distance.Between(helperBox.x, helperBox.y, chest.x, chest.y);
                        if (distance < shortestDistance) {
                            shortestDistance = distance;
                            nearestChest = chest;
                        }
                    });

                    gScene.physics.world.once('worldstep', () => {
                        if (nearestChest) {
                            console.error(nearestChest);
                            EventManager.emit(GAME_EVENTS.PLAYER_ATTEMPT_OPEN_CHEST + nearestChest.chestId, nearestChest, this.player);
                        }
                        helperBox.destroy();
                        gScene.physics.world.removeCollider(overlap);
                        nearestChest = undefined;
                        shortestDistance = Infinity;
                    });
                }
            }
        });

        this.addState("walk", {
            update: () => {
                const curInput = this.player.playerInput.getInput();

                //has to be before resetting active chest
                if (!isAnyMovementKeyDown(curInput)) {
                    this.player.setVelocity(0, 0);
                    const parts: string[] = this.player.anims.currentAnim?.key.split('-') || [];
                    parts[1] = 'idle';

                    return this.createTransitionResult("idle", [parts.join("-")]);
                }

                //has to be after possible switch to idle state
                this.player.activeChest = undefined;

                if (curInput.actionPressed) {
                    return this.createTransitionResult("attack", []);
                }

                const speed: number = 100;
                let vx = 0;
                let vy = 0;

                if (curInput.left) {
                    vx = -speed;
                    this.player.scaleX = -1;
                    this.player.viewVector = new Phaser.Math.Vector2(-1, 0);

                    if (this.player.body !== null)
                        this.player.body.offset.x = 24;
                }
                if (curInput.right) {
                    vx = speed;
                    this.player.scaleX = 1;
                    this.player.viewVector = new Phaser.Math.Vector2(1, 0);

                    if (this.player.body !== null)
                        this.player.body.offset.x = 8;
                }
                if (curInput.up) {
                    vy = -speed;
                    this.player.viewVector = new Phaser.Math.Vector2(0, -1);
                }
                if (curInput.down) {
                    vy = speed;
                    this.player.viewVector = new Phaser.Math.Vector2(0, 1);
                }

                if (vx !== 0 || vy !== 0) {
                    this.player.setVelocity(vx, vy);
                    if (vx !== 0) {
                        this.player.anims.play("faune-walk-side", true);
                    } else if (vy < 0) {
                        this.player.anims.play('faune-walk-up', true);
                    } else if (vy > 0) {
                        this.player.anims.play('faune-walk-down', true);
                    }
                }
            }
        });

        this.addState("damage", {
            enter: (stateParams: any[]) => {
                console.error('Player enters damage state');
                console.error(this._player.body);

                if (!stateParams)
                    return;

                const dir = stateParams[0] as Phaser.Math.Vector2;

                if (this.player.body)
                    this.player.setVelocity(dir.x, dir.y);
                this.player.setTint(0xff0000);
                this.player.health--;
                this.timer = undefined;
                EventManager.emit(GAME_EVENTS.PLAYER_HEALTH_CHANGED, this.player.health);
            },

            exit: () => {
                this.player.setVelocity(0, 0);
                this.player.clearTint();
                if (this.timer)
                    this.timer.remove();
            },

            update: () => {

                if (this.player.health <= 0)
                    return this.createTransitionResult("dead", []);

                if (!this.timer)
                    this.timer = this.player.scene.time.delayedCall(250, () => {
                        this.transition("idle", [])

                    });
            }
        });

        this.addState("dead", {
            enter: (stateParams: any[]) => {
                console.log('Player enters dead state')
                this.player.anims.play("faune-faint");
                EventManager.emit(GAME_EVENTS.DESTROY_PLAYER_LIZARD_COLLIDER);
            }
        });

        this.addState("attack", {
            enter: (stateParams: any[]) => {
                console.log('Player enters attack state')

                if (!this.player.knives)
                    return;

                const knife = this.player.knives.get(this.player.x, this.player.y, "knife") as Phaser.Physics.Arcade.Image;

                if (!knife)
                    return;

                const parts: string[] = this.player.anims.currentAnim?.key.split('-') || [];
                const direction = parts[2];
                const vec = new Phaser.Math.Vector2(0, 0);

                switch (direction) {
                    case "up":
                        vec.y = -1;
                        break;
                    case "down":
                        vec.y = 1;
                        break;
                    default:
                    case "side":
                        if (this.player.scaleX < 0)
                            vec.x = -1;
                        else
                            vec.x = 1;
                        break;
                }

                const angle = vec.angle();

                knife.setActive(true);
                knife.setVisible(true);
                knife.x += vec.x * 16;
                knife.y += vec.y * 16;
                knife.setRotation(angle);
                knife.setVelocity(vec.x * 300, vec.y * 300);
            },
            update: () => {
                const parts: string[] = this.player.anims.currentAnim?.key.split('-') || [];
                parts[1] = 'idle';
                return this.createTransitionResult("idle", [parts.join("-")]);
            }
        });
    }

    private start() {
        this.transition("idle", []);
        this.player.viewVector = new Phaser.Math.Vector2(1,0);
    }
}