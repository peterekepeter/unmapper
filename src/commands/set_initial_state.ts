import { ICommandInfoV2 } from "../controller/command/ICommandInfoV2"
import { reset_initial_level_state, set_initial_level_state } from "../initial_state"


export const set_initial_state: ICommandInfoV2 = {
    description: 'Set initial state (useful for development)',
    exec: state => {
        set_initial_level_state(state)
        return state
    }
}

export const reset_initial_state: ICommandInfoV2 = {
    description: 'Reset initial state to default',
    exec: state => {
        reset_initial_level_state()
        return state
    }
}