import Phaser from 'phaser'
import { ChestStateMachine } from '../stateMachine/ChestStateMachine';
import Faune from '../characters/Faune';
import { BaseDungeonScene } from '../scenes/BaseDungeonScene';
import { GameManager } from '../utils/GameManager';

enum TiledProperties {
    TODO = "todo"
}

export default class Chest extends Phaser.Physics.Arcade.Sprite {
    private readonly _chestId: string = GameManager.generateUID();
    public get chestId(): string {
        return this._chestId;
    }

    private _stateMachine: ChestStateMachine;
    public get chestName(): string {
        return this.tiledObject.name;
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

    public get tiledId(): number {
        return this.tiledObject.id;
    }
    
    private _tiledObject: Phaser.Types.Tilemaps.TiledObject;
    public get tiledObject(): Phaser.Types.Tilemaps.TiledObject {
        return this._tiledObject;
    }
    public set tiledObject(value: Phaser.Types.Tilemaps.TiledObject) {
        this._tiledObject = value;
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
        this.tiledObject = tiledObject;
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