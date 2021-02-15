import { createSignal } from 'reactive-signals';
import { create_history } from './history';
import { create_initial_editor_state, EditorState } from '../model/EditorState';
import { create_command_registry, ICommandInfoV2 } from './command_registry';
import { Interaction } from '../model/interactions/Interaction';

export type IAppController = ReturnType<typeof createController>;

export const createController = () => {

    let current_state: EditorState = create_initial_editor_state();
    const state_signal = createSignal<EditorState>(current_state);
    const command_registry = create_command_registry();
    const commandsShownState = createSignal(false);
    state_signal.value = current_state;
    const history = create_history(() => current_state, new_state => legacy_state_change(new_state));

    async function execute_undoable_command(command_info: ICommandInfoV2, ...args: unknown[]){
        const next_state = await command_info.exec(current_state, ...args)
        if (command_info.legacy_handling){
            // legacy commands update state_signal & history directly
            return
        }
        undoable_state_change(next_state);
    }

    async function execute_preview_command(command_info: ICommandInfoV2, ...args: unknown[]){
        if (command_info.legacy_handling){
            return // legacy commands cannot be previewed
        }
        const next_state = await command_info.exec(current_state, ...args)
        preview_state_change(next_state)
    }

    function undoable_state_change(next_state: EditorState)
    {
        if (state_signal.value === next_state){
            // no change
            return;
        }
        if (state_signal.value.map !== next_state.map){
            // map state change triggers history push
            history.push();
        }
        current_state = next_state
        state_signal.value = next_state
    }

    function legacy_state_change(next_state: EditorState){
        current_state = next_state
        state_signal.value = next_state
    }

    function preview_state_change(next_state: EditorState){
        state_signal.value = next_state
    }

    function showAllCommands(){
        commandsShownState.value = true;
    }

    function update_interaction(interaction: Interaction){
        preview_state_change({ ...current_state, interaction });
    }

    return {
        execute: execute_undoable_command,
        preview: execute_preview_command,
        commands: command_registry,
        state_signal,
        commandsShownState,
        showAllCommands,
        undo: history.back,
        redo: history.forward,
    }
}