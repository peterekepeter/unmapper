import { InteractionType } from "../interactions/InteractionType";
import { ICommandV2 } from "./ICommand";


export interface ICommandInfoV2 {
    description?: string;
    exec?: ICommandV2;
    shortcut?: string;
    /** old commands don't return new state */
    legacy_handling?: boolean;
    args?: {
        name?: string;
        interaction_type?: InteractionType;
        example_values?: unknown[];
        default_value?: unknown;
    }[]
}
