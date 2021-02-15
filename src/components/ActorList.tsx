import React = require("react");
import { HoverEffect } from "../ui/HoverEffect";
import { UiText } from "../ui/UiText";
import { SectionTitle } from "../ui/SectionTitle";
import { createController } from "../controller";
import { Actor } from "../model/Actor";
import { themeColors } from "../theme";
import { useSignal } from "./useSignal";
import { toggle_actor_selected_command } from "../commands/selection/toggle_actor_selected";
import { make_actor_selection_command } from "../commands/selection/make_actor_selection";

export function ActorList({ controller = createController() }) {

    const map = useSignal(controller.state_signal).map;
    const colors = useSignal(themeColors);

    return <div style={{overflow:"hidden", display:'grid'}}>
        <SectionTitle>Objects</SectionTitle>
        <div style={{overflow:'auto', scrollbarColor: 'dark'}}>
        {
            map.actors.map(actor => 
                <div key={actor.name} style={{
                    userSelect:'none', 
                    background:actor.selected ? colors.accent : null,
                    color:actor.selected ? colors.background : null 
                    }} onClick={event => handleClick(event, actor)}>
                    <HoverEffect>
                        <UiText>{actor.name}</UiText>
                    </HoverEffect>
                </div>
            )
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
