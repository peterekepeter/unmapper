import { create_initial_editor_state, EditorState } from '../model/EditorState'
import { GeometryCache } from '../model/geometry/GeometryCache'
import { UnrealMap } from '../model/UnrealMap'
import { deep_freeze } from '../util/deep_freeze'
import { Signal } from '../util/Signal'
import { create_command_registry } from './command/command_registry'
import { ICommandInfoV2 } from "./command/ICommandInfoV2"
import { create_history } from './history'
import { InteractionController } from './interactions/InteractionController'
import { InteractionRenderState } from './interactions/InteractionRenderState'

export class AppController {

    /** lastest non-preview state */
    current_state: EditorState;
    /** latest shown state */
    state_signal = new Signal<EditorState>();

    commands = create_command_registry();
    commands_shown_state = new Signal(false);
    geometry_cache = new GeometryCache();
    interaction = new InteractionController(this);

    preview_command: ICommandInfoV2;
    preview_command_args: unknown[];

    history = create_history<UnrealMap>({
        get_state: () => this.current_state.map,
        set_state: new_state => this.direct_state_change({ ...this.current_state, map: new_state }),
    });

    constructor(initial_state?: EditorState) {
        this.state_signal.subscribe(state => {
            this.geometry_cache.actors = state.map.actors
        })
        this.current_state = initial_state ?? create_initial_editor_state()
        this.state_signal.value = this.current_state
    }

    interactively_execute(command_info: ICommandInfoV2): void {
        if (command_info && command_info.keep_status_by_default){
            this.execute(command_info)
        }
        else {
            this.interaction.interactively_execute(command_info)
        }
    }

    execute(command_info: ICommandInfoV2, ...args: unknown[]): void {
        let next_state: EditorState

        let current_state = this.current_state
        if (command_info.keep_status_by_default !== true && (current_state.status.is_error || current_state.status.message)){
            current_state = { ... current_state, status: { is_error: false, message: '' } }
        }
        
        next_state = command_info.exec(current_state, ...args)

        if (next_state.interaction_render_state) {
            next_state = { ...next_state, interaction_render_state: null }
        }

        if (command_info.legacy_handling) {
            return // legacy commands update state_signal & history directly
        }

        this.undoable_state_change(next_state)

        if (this.preview_command != null){
            this.preview(this.preview_command, ...this.preview_command_args)
        }
    }

    reset_preview(): void {
        this.preview_command = null
        this.preview_command_args = null
        if (this.current_state !== this.state_signal.value){
            this.state_signal.value = this.current_state
        }
    }

    preview(command_info: ICommandInfoV2, ...args: unknown[]): void {
        this.preview_command_with_interaction(null, command_info, args)
    }

    preview_command_with_interaction(
        interaction_render_state: InteractionRenderState,
        command_info: ICommandInfoV2,
        args: unknown[],
    ): void {
        if (command_info.legacy_handling) {
            return // legacy commands cannot be previewed
        }
        this.preview_command = command_info
        this.preview_command_args = args
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
        this.direct_state_change(next_state)
    }

    private direct_state_change(next_state: EditorState) {
        this.current_state = deep_freeze(next_state)
        this.preview_state_change(next_state)
    }

    private preview_state_change(next_state: EditorState) {
        this.state_signal.value = deep_freeze(next_state)
    }

    public show_all_commands(): void {
        this.commands_shown_state.value = true
    }

    viewport_usage: boolean[] = [];

    public free_viewport(viewport: number): void {
        this.viewport_usage[viewport] = false
    }

    public allocate_viewport(): number {
        for (let i=0; i<10; i++){
            if (!this.viewport_usage[i]){
                this.viewport_usage[i] = true
                return i
            }
        }
    }

}

export const create_controller = (): AppController => new AppController()
