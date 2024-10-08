import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import GameUI from './scenes/GameUI';
import { Preloader } from './scenes/Preloader';
import {Dungeon01Floor00} from "./scenes/Dungeon01Floor00";

import { Game, Types } from "phaser";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    physics: {
        default: 'arcade', // Aktiviert die Arcade-Physik
        arcade: {
            gravity: { x: 0,y: 0 }, // Optional: Schwerkraft einstellen
            debug: true
        }
    },
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainGame,
        GameUI,
        Dungeon01Floor00
    ]
};

export default new Game(config);
