import { ICommandInfoV2 } from "../../controller/command"
import { Actor } from "../../model/Actor"
import { change_actors } from "../../model/algorithms/editor_state_change"


export const make_actor_selection_command : ICommandInfoV2 = {
    keep_status_by_default: true,
    exec(state, to_select : Actor) {
        let matched = false
        const result = change_actors(state, function(prev_actor){
            const should_select = prev_actor === to_select
            matched ||= should_select
            if (should_select === prev_actor.selected){
                return prev_actor
            }
            return prev_actor.immutable_update(a => a.selected = should_select)
        })
        if (!matched && to_select){
            throw new Error("didn't match anything from given state")
        }
        return result
    }
}