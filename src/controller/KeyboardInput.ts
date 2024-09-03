import { MappedInput } from "./MappedInput";

export class KeyboardInput implements MappedInput {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    constructor(scene: Phaser.Scene) {
        this.cursors = scene.input.keyboard?.createCursorKeys();
    }

    getInput() {
        if (!this.cursors) {
            return {
                left: false,
                right: false,
                up: false,
                down: false
            }
        } else {
            return {
                left: this.cursors.left.isDown,
                right: this.cursors.right.isDown,
                up: this.cursors.up.isDown,
                down: this.cursors.down.isDown
            };
        }
    }
}
