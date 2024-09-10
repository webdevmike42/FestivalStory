import Phaser from 'phaser'

export default class Chest extends Phaser.Physics.Arcade.Sprite {
/*
    private _coins: number;

    get coins() {
        if (this.anims.currentAnim?.key !== "chest-closed")
            return 0;

        return this._coins;
    }
*/

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);

        this.play('chest-closed');
    }

    open() {
        if (this.anims.currentAnim?.key !== 'chest-closed') {
            return 0;
        }

        this.play('chest-open');
        return Phaser.Math.Between(50, 200);
    }
}
