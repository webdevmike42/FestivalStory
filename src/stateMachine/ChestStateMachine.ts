import Faune from "../characters/Faune";
import { EventManager, GAME_EVENTS } from "../events/EventManager";
import Chest from "../items/Chest";
import StateMachine from "./StateMachine";

type ChestSwitchStates = "open" | "closed"

export class ChestStateMachine extends StateMachine<ChestSwitchStates>{
    private _chest: Chest;

    public get chest(): Chest {
        return this._chest;
    }
    public set chest(value: Chest) {
        this._chest = value;
    }

    constructor(chest: Chest) {
        super("closed");
        this._chest = chest;

        this.addState("closed", {
            enter: (stateParams: any[]) => {
                console.log('Chest enters closed state');
                
                EventManager.emit(GAME_EVENTS.CHEST_CLOSED, this.chest);
                this.chest.anims.play('chest-closed');

                EventManager.on(GAME_EVENTS.PLAYER_ATTEMPT_OPEN_CHEST + this.chest.chestId, (chest: Chest, player:Faune) => {
                    console.error("in event");
                    
                    //if (chest === this.chest) {
                        console.error("yeah");
                        player.coins += this.chest.open();
                        EventManager.emit(GAME_EVENTS.PLAYER_COINS_CHANGED, player.coins);
                    //}
                });
            },
            exit: () => {
                console.log('Chest exits closed state');
                EventManager.off(GAME_EVENTS.PLAYER_ATTEMPT_OPEN_CHEST + this.chest.chestId);
            }
        });

        this.addState("open", {
            enter: (stateParams: any[]) => {
                console.log('chest enters open state');
                EventManager.emit(GAME_EVENTS.CHEST_OPENED, this.chest);
                this.chest.anims.play('chest-open', true);
            },
            exit: () => {
                console.log('chest exits open state');
            }
        });

        this.transition("closed",[]);
    }
}