import { Scene } from 'phaser';
import { createLizardAnims } from '../anims/EnemyAnims';
import { createCharacterAnims } from '../anims/CharacterAnims';
import { createChestAnims } from '../anims/TreasureAnims';
import { GameManager } from '../utils/GameManager';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        this.add.text(100, 100, "Festival Story");

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');

        this.load.image("tilesetImage", "tiles/dungeon_tiles_extruded.png");

        this.load.tilemapTiledJSON("dungeon", "tiles/dungeon-01.json");

        this.load.atlas("faune", "characters/faune/faune.png", "characters/faune/faune.json");
        this.load.image("knife", "weapons/weapon_knife.png");

        this.load.image("ui-heart-empty", "ui/ui_heart_empty.png");
        this.load.image("ui-heart-full", "ui/ui_heart_full.png");

        this.load.atlas("lizard", "enemies/lizard/lizard.png", "enemies/lizard/lizard.json");
        this.load.atlas("treasure", "items/treasure.png", "items/treasure.json");
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.

        GameManager.loadPlayer();
        this.createAnimations();
        this.scene.start('Game');
    }

    createAnimations() {
        createLizardAnims(this.anims);
        createCharacterAnims(this.anims);
        createChestAnims(this.anims);
    }
}
