import Faune from "../characters/Faune";

export interface PlayerData  {
    health: number,
    maxHealth: number,
    position: { x:number, y: number },
    texture: string,
    frame: string
}

export class GameManager {
    static playerData : PlayerData;

    static loadPlayer(){
        this.playerData = {
            health: 100,
            maxHealth: 100,
            position: { x: 120, y: 120 },
            texture: "faune",
            frame: "walk-side-3.png"
        }   
    }

    static createPlayer(scene: Phaser.Scene): Faune {
        return new Faune(scene, this.playerData.position.x, this.playerData.position.y, this.playerData.texture, this.playerData.frame);
    }

    static updatePlayerData(newData: PlayerData) {
        this.playerData = { ...this.playerData, ...newData };
    }
}