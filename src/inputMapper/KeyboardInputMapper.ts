import { InputMapper } from "./InputMapper";

export class KeyboardInputMapper extends InputMapper {
    private _cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    constructor(cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined) {
        super();
        this._cursors = cursors;
    }

    isAnyMovementKeyPressed(): boolean {
        if (!this._cursors)
            return false;

        return this._cursors.up.isDown || this._cursors.down.isDown || this._cursors.left.isDown || this._cursors.right.isDown;
    }

    
}