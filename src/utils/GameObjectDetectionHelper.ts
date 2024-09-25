import Phaser, { Physics } from "phaser";
import Faune from "../characters/Faune";
import Chest from "../items/Chest";
import { BaseDungeonScene } from "../scenes/BaseDungeonScene";

export function getNearestOverlappingChest(player: Faune, scene: BaseDungeonScene): Chest | undefined {
  const helperBox = scene.add.rectangle(player.x + player.viewVector.x * player.displayWidth, player.y + player.viewVector.y * player.displayHeight, player.displayWidth, player.displayHeight);
  const sceneChests: Chest[] = scene.getObjectsByType(Chest);
  let overlappingChests: Chest[] = scene.getObjectsByType(Chest);;
  //let prevDistance = 0, curDistance = 0;

  sceneChests.forEach((chest, index) => {
    if (scene.physics.overlap(chest, helperBox))
      overlappingChests.push(chest);
  }, scene);

  if (overlappingChests.length === 0)
    return undefined;

  return overlappingChests.reduce((prevChest: Chest, curChest: Chest, index: number) => {
    console.log("Index: " + index);
    console.log(prevChest);
    console.log(curChest);
    //curDistance = Phaser.Math.Distance.Between(player.x, player.y, curChest.x, curChest.y);
    //if(!prevChest && prevDistance
    return curChest;

  }, overlappingChests[0]);
}