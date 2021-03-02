import { createSignal } from 'reactive-signals';
import { create_history } from './history';
import { create_initial_editor_state, EditorState } from '../model/EditorState';
import { create_command_registry } from './command/command_registry';
import { ICommandInfoV2 } from "./command/ICommandInfoV2";
import { UnrealMap } from '../model/UnrealMap';
import { GeometryCache } from '../model/geometry/GeometryCache';
import { InteractionController } from './interactions/InteractionController';
import { IInteractionRenderState } from './interactions/IInteractionRenderState';

export class AppController {

    current_state: EditorState = create_initial_editor_state();
    state_signal = createSignal<EditorState>(this.current_state);
    commands = create_command_registry();
    commands_shown_state = createSignal(false);
    geometry_cache = new GeometryCache();
    interaction = new InteractionController(this);

    history = create_history<UnrealMap>({
        get_state: () => this.current_state.map,
        set_state: new_state => this.direct_state_change({ ...this.current_state, map: new_state })
    });

    constructor() {
        this.state_signal.event(state => {
            this.geometry_cache.actors = state.map.actors;
        })
    }

    interactively_execute(command_info: ICommandInfoV2): void {
        this.interaction.interactively_execute(command_info);
    }

    execute(command_info: ICommandInfoV2, ...args: unknown[]): void {
        const next_state = command_info.exec(this.current_state, ...args)
        if (command_info.legacy_handling) {
            return // legacy commands update state_signal & history directly
        }
        this.undoable_state_change(next_state)
    }

    preview(command_info: ICommandInfoV2, ...args: unknown[]): void {
        if (command_info.legacy_handling) {
            return // legacy commands cannot be previewed
        }
        const next_state = command_info.exec(this.current_state, ...args)
        this.preview_state_change(next_state)
    }

    preview_command_with_interaction(
        interaction_render_state: IInteractionRenderState,
        command_info: ICommandInfoV2,
        args: unknown[]
    ): void {
        let next_state = command_info.exec(this.current_state, ...args)
        next_state = { ...next_state, interaction_render_state }
        this.preview_state_change(next_state)
    }

    private undoable_state_change(next_state: EditorState) {
        if (this.state_signal.value === next_state) {
            return // no change
        }
        if (this.state_signal.value.map !== next_state.map) {
            this.history.push() // map state change triggers history push
        }
        this.current_state = next_state
        this.state_signal.value = next_state
    }

    private direct_state_change(next_state: EditorState) {
        this.current_state = next_state
        this.state_signal.value = next_state
    }

    private preview_state_change(next_state: EditorState) {
        this.state_signal.value = next_state
    }

    public show_all_commands(): void {
        this.commands_shown_state.value = true;
    }

}

export const create_controller = (): AppController => new AppController();