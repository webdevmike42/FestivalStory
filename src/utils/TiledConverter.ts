import Phaser from "phaser";
import Chest from "../items/Chest";
import FloorSwitch from "../objects/FloorSwitch";
import Faune from "../characters/Faune";

enum LAYER_NAMES {
    CHEST_LAYER = "Chests",
    FLOORSWITCH_LAYER = "FloorSwitches"
}

//create tiled-objectlayer to objects and stores relevant properties in gameobject, e.g. tiledId
//logic for linking created gameObjects via custom properties, e.g. resolve link via tiledId stored in "openChest"-property of FloorSwitch, which links to the chest that should open


export class TiledConverter {
    static convertChestLayer(tilemap: Phaser.Tilemaps.Tilemap, scene: Phaser.Scene, player : Faune) {
        const chests: Phaser.Physics.Arcade.StaticGroup = scene.physics.add.staticGroup({
            classType: Chest
        });

        if (tilemap) {
            const chestLayer: Phaser.Tilemaps.ObjectLayer | null = tilemap.getObjectLayer(LAYER_NAMES.CHEST_LAYER);
            chestLayer?.objects.forEach(chestObj => {
                if (chestObj) {
                    // correct x and y because origin is in the middle of the object
                    const chest: Chest = chests.get(chestObj.x! + chestObj.width! * 0.5, chestObj.y! - chestObj.height! * 0.5, "treasure");
                    chest.init(player, chestObj);
                }
            });
        }

        return chests;
    }

    static convertFloorSwitchLayer(tilemap: Phaser.Tilemaps.Tilemap, scene: Phaser.Scene, player:Faune) {
        const floorSwitches: Phaser.Physics.Arcade.StaticGroup = scene.physics.add.staticGroup({
            classType: FloorSwitch
        });

        const floorSwitchLayer: Phaser.Tilemaps.ObjectLayer | null = tilemap.getObjectLayer(LAYER_NAMES.FLOORSWITCH_LAYER);
        floorSwitchLayer?.objects.forEach(fsObj => {
            if (fsObj) {
                // correct x and y because origin is in the middle of the object
                const fs: FloorSwitch = floorSwitches.get(fsObj.x! + fsObj.width! * 0.5, fsObj.y! - fsObj.height! * 0.5, "treasure");
                fs.init(player, fsObj);
            }
        });

        return floorSwitches;
    }
}