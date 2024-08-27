import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        /*
        this.msg_text = this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
        this.msg_text.setOrigin(0.5);
        */
       

        const map = this.make.tilemap({key:"dungeon"});
        const tileset = map.addTilesetImage("dungeon","tiles");

        if(tileset != null){
            map.createLayer("Ground",tileset);
            const wallsLayer = map.createLayer("Walls",tileset);
            wallsLayer?.setCollisionByProperty({collides: true});

            const debugGraphics = this.add.graphics().setAlpha(0.7);
            wallsLayer?.renderDebug(debugGraphics, {
                tileColor: null,
                collidingTileColor: new Phaser.Display.Color(243,234,48,255),
                faceColor: new Phaser.Display.Color(40,39,37,255)
            });
        }

        
        

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }
}
