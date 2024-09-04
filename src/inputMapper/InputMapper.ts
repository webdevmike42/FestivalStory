const NO_MAPPED_INPUT = Object.freeze({
    left: false,
    right: false,
    up: false,
    down: false,
    actionPressed: false,
    dashPressed: false
});

export interface MappedInput { left: boolean, right: boolean, up: boolean, down: boolean, actionPressed: boolean, dashPressed: boolean }

export class InputMapper {
    private _input: MappedInput = { ...NO_MAPPED_INPUT }


    /*
        createMappedInput(): MappedInput {
            return {
                ...NO_MAPPED_INPUT
            };
        };
        */
    isAnyMovementKeyPressed(): boolean {
        return this._input.up || this._input.down || this._input.left || this._input.right;
    }

    pressDownMovementKey(): void {
        this._input.down = true;
    }

    releaseDownMovementKey(): void {
        this._input.down = false;
    }

    public get input(): MappedInput {
        return this._input;
    }
    public set input(value: MappedInput) {
        this._input = value;
    }
}