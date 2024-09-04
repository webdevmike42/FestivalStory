export interface MappedInputResult {
    left: boolean, right: boolean, up: boolean, down: boolean, actionPressed: boolean, dashPressed:boolean
}

export interface MappedInputController {
    getInput(): MappedInputResult;
}

export const NO_INPUT : MappedInputResult = Object.freeze({
    left: false,
    right: false,
    up: false,
    down: false,
    actionPressed: false,
    dashPressed: false
});

export const createMappedInputResult = () => {
    return {...NO_INPUT};
}

export const isAnyMovementKeyDown = (mappedInput : MappedInputResult) => {
    return mappedInput.up || mappedInput.down || mappedInput.left || mappedInput.right;
}