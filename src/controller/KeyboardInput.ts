import { MappedInputController, NO_INPUT } from "./MappedInputController";

export class KeyboardInput implements MappedInputController {
    private _cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    constructor(cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined) {
        this._cursors = cursors; 
    }

    getInput() {
        if (!this._cursors) {
            return {
                ...NO_INPUT
            };
        }

        return {
            left: this._cursors.left.isDown,
            right: this._cursors.right.isDown,
            up: this._cursors.up.isDown,
            down: this._cursors.down.isDown,
            actionPressed: Phaser.Input.Keyboard.JustDown(this._cursors.space),
            dashPressed: false
        };
    }
}
