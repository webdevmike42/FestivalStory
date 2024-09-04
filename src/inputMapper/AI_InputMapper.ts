import { InputMapper, MappedInput } from "./InputMapper";

export class AI_InputMapper extends InputMapper {
  
    isAnyMovementKeyPressed(): boolean {
        return this.input.up || this.input.down || this.input.left || this.input.right;
    }

    pressDownMovementKey(): void{
        this.input.down = true;
    }

    releaseDownMovementKey(): void{
        this.input.down = false;
    }
    
}