import * as React from "react"
import { HoverEffect } from "../ui/HoverEffect";
import { UiText } from "../ui/UiText";
import { SectionTitle } from "../ui/SectionTitle";
import { AppController } from "../controller/AppController";
import { Actor } from "../model/Actor";
import { themeColors } from "../theme";
import { use_signal } from "./useSignal";
import { toggle_actor_selected_command } from "../commands/selection/toggle_actor_selected";
import { make_actor_selection_command } from "../commands/selection/make_actor_selection";

export function ActorList({ controller = new AppController() }) {

    const state = use_signal(controller.state_signal)
    const map = state.map
    const colors = use_signal(themeColors)

    return <div style={{overflow:"hidden", display:'grid'}}>
        <SectionTitle>Objects</SectionTitle>
        <div style={{overflow:'auto', scrollbarColor: 'dark'}}>
        {
            map.actors.map((actor, index) => {
                const selected = state.selection.actors.find(a => a.actor_index === index)
                return <div key={index} style={{
                    userSelect:'none', 
                    background: selected ? colors.accent : null,
                    color: selected ? colors.background : null 
                    }} onClick={event => handleClick(event, actor)}>
                    <HoverEffect>
                        <UiText>{actor.name}</UiText>
                    </HoverEffect>
                </div>
            })
        }
        </div>
    </div>;

    function handleClick(event: React.MouseEvent<HTMLElement>, actor : Actor){
        if (event.ctrlKey){
            controller.execute(toggle_actor_selected_command, actor);
        } else {
            controller.execute(make_actor_selection_command, actor);
        }
    }
}
