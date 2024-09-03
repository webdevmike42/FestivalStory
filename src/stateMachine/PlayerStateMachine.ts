import Faune from "../characters/Faune";
import { sceneEvents } from "../events/EventCenter";
import Chest from "../items/Chest";
import StateMachine from "./StateMachine";

type PlayerStates = "idle" | "walk" | "attack" | "damage" | "dead";

const createPlayerStateMachine = (player: Faune): StateMachine<PlayerStates> => {
    const fsm: StateMachine<PlayerStates> = new StateMachine<PlayerStates>("idle");
    let timer: Phaser.Time.TimerEvent | undefined;

    fsm.addState("idle", {
        enter: (stateParams: any[]) => {
            //console.log('Player enters Idle state')
            if (stateParams && typeof stateParams[0] === "string")
                player.anims.play(stateParams[0])
            else
                player.anims.play("faune-idle-down");
        },
        //exit: () => console.log('Player exits Idle state'),
        update: () => {
            if (player.cursors.left.isDown || player.cursors.right.isDown || player.cursors.up.isDown || player.cursors.down.isDown) {
                return fsm.createTransitionResult("walk", []);
            }

            if (Phaser.Input.Keyboard.JustDown(player.cursors.space!)) {
                if (player.activeChest && player.activeChest instanceof Chest) {
                    player.coins += player.activeChest.open();
                    sceneEvents.emit("player-coins-changed", player.coins);
                } else
                    return fsm.createTransitionResult("attack", []);
            }

        }
    });

    fsm.addState("walk", {

        update: () => {
            const cursors: Phaser.Types.Input.Keyboard.CursorKeys = player.cursors;

            if (!(cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown)) {
                player.setVelocity(0, 0);
                const parts: string[] = player.anims.currentAnim?.key.split('-') || [];
                parts[1] = 'idle';

                return fsm.createTransitionResult("idle", [parts.join("-")]);
            }

            player.activeChest = undefined;

            const speed: number = 100;
            let vx = 0;
            let vy = 0;

            if (cursors.left?.isDown) {
                vx = -speed;
                player.scaleX = -1;
                if (player.body !== null) player.body.offset.x = 24;
            }
            if (cursors.right?.isDown) {
                vx = speed;
                player.scaleX = 1;
                if (player.body !== null) player.body.offset.x = 8;
            }
            if (cursors.up?.isDown) {
                vy = -speed;
            }
            if (cursors.down?.isDown) {
                vy = speed;
            }

            if (vx !== 0 || vy !== 0) {
                player.setVelocity(vx, vy);
                if (vx !== 0) {
                    player.anims.play("faune-walk-side", true);
                } else if (vy < 0) {
                    player.anims.play('faune-walk-up', true);
                } else if (vy > 0) {
                    player.anims.play('faune-walk-down', true);
                }
            }

        }
    });

    fsm.addState("damage", {
        enter: (stateParams: any[]) => {
            console.log('Player enters damage state')
            if (!stateParams)
                return;

            const dir = stateParams[0] as Phaser.Math.Vector2;

            player.setVelocity(dir.x, dir.y);
            player.setTint(0xff0000);
            player.health--;
            timer = undefined;
            sceneEvents.emit("player-health-changed", player.health);    //todo: put events in enum in separat
        },

        exit: () => {
            player.setVelocity(0, 0);
            player.clearTint();
            if (timer)
                timer.remove();
        },

        update: () => {

            if (player.health <= 0)
                return fsm.createTransitionResult("dead", []);

            if (!timer)
                timer = player.scene.time.delayedCall(250, () => {
                    console.log("delayed call")
                    fsm.transition("idle", [])
                });
        }
    });

    fsm.addState("dead", {
        enter: (stateParams: any[]) => {
            console.log('Player enters dead state')
            player.anims.play("faune-faint");
            sceneEvents.emit("destroy-player-lizard-collider");
        }
    });

    fsm.addState("attack", {
        enter: (stateParams: any[]) => {
            console.log('Player enters attack state')

            if (!player.knives)
                return;

            const knife = player.knives.get(player.x, player.y, "knife") as Phaser.Physics.Arcade.Image;

            if (!knife)
                return;

            const parts: string[] = player.anims.currentAnim?.key.split('-') || [];
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
                    if (player.scaleX < 0)
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
            const parts: string[] = player.anims.currentAnim?.key.split('-') || [];
            parts[1] = 'idle';
            return fsm.createTransitionResult("idle", [parts.join("-")]);
        }
    });

    fsm.transition("idle", []);

    return fsm;
}

export {
    createPlayerStateMachine
}