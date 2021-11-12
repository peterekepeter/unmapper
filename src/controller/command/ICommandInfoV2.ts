import { StatefulInteraction } from "../interactions/stateful/StatefulInteraction"
import { AsyncCommand, ICommandV2 } from "./ICommand"

export interface ICommandInfoV2 {
    description?: string;
    exec?: ICommandV2;
    execAsync?: AsyncCommand;
    shortcut?: string;
    /** old commands don't return new state */
    legacy_handling?: boolean;
    args?: {
        name?: string;
        interaction_factory?: () => StatefulInteraction;
        example_values?: unknown[];
        default_value?: unknown;
    }[],
    keep_status_by_default?: boolean
    uses_interaction_buffer?: boolean
}
