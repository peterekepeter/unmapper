import * as React from "react";
import { FunctionComponent } from "react";
import { StatusBarItem as Item } from "./StatusBarItem";

export const EditModeStatus: FunctionComponent<{ vertex_mode: boolean }>
    = ({ vertex_mode }) => vertex_mode
        ? <Item tip="Edit commands will change vertex data">Vertex Mode</Item>
        : <Item tip="Selection and editing done at object level">Object Mode</Item>
