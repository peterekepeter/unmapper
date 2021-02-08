import { InteractionType } from "./InteractionType";

export class Interaction {
    readonly type: InteractionType;

    get is_default(){
        return this === Interaction.DEFAULT;
    }

    constructor(type: InteractionType = InteractionType.Default){
        this.type = type;
    }

    static DEFAULT = new Interaction();
}
