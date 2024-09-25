import Phaser from 'phaser'
import { ChestStateMachine } from '../stateMachine/ChestStateMachine';
import Faune from '../characters/Faune';
import { BaseDungeonScene } from '../scenes/BaseDungeonScene';
import { GameManager } from '../utils/GameManager';

enum TiledProperties {
    TODO = "todo"
}

export default class Chest extends Phaser.Physics.Arcade.Sprite {
    private _stateMachine: ChestStateMachine;
    private _chestName: string;
    public get chestName(): string {
        return this._chestName;
    }
    public set chestName(value: string) {
        this._chestName = value;
    }
    private _coins: number;
    public get coins(): number {
        return this._coins;
    }
    public set coins(value: number) {
        this._coins = value;
    }

    private _player: Faune;
    public get player(): Faune {
        return this._player;
    }
    public set player(value: Faune) {
        this._player = value;
    }

    private _tiledProperties: any[];
    public get tiledProperties(): any[] {
        return this._tiledProperties;
    }
    public set tiledProperties(value: any[]) {
        this._tiledProperties = value;
    }
    private readonly _chestId: string = GameManager.generateUID();
    public get chestId(): string {
        return this._chestId;
    }

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);

        //this.play('chest-closed');
    }

    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt);

        if (!this._stateMachine) {
            this._stateMachine = new ChestStateMachine(this);
        }
    }

    update(t: number, dt: number) {
        super.update(t, dt);
        this._stateMachine.update();
    }

    init(player: Faune, tiledObject: Phaser.Types.Tilemaps.TiledObject) {

        this.player = player;
        this.chestName = tiledObject.name;
        /*
        tiledObject.properties.forEach((prop: any, index: number) => {
            //console.error(index);
            //console.error(prop["name"]);
            if (prop["name"] === TiledProperties.PRESS_EVENT)
                this.pressEvent = prop["value"];
            if (prop["name"] === TiledProperties.RELEASE_EVENT)
                this.releaseEvent = prop["value"];
        });
        */
    }


    open() {
        if (this.anims.currentAnim?.key !== 'chest-closed') {
            return 0;
        }

        this.play('chest-open');
        return Phaser.Math.Between(50, 200);
    }
}

const getChestByName = (chestName: string, chests: Chest[]): Chest | undefined => {
    return chests.find(chest => chest.chestName === chestName);
}



export {
    getChestByName
}