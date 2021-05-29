import * as React from "react"
import { FunctionComponent } from "react"
import { StatusBarItem as Item } from "./StatusBarItem"

export const UvModeStatus: FunctionComponent<{ preserve_vertex: boolean }>
    = ({ preserve_vertex }) => preserve_vertex
        ? <Item tip="Editor will try to preserve vertex UVs">Vertex Uv</Item>
        : <Item tip="Editor will try to preserve polygon UVs">Polygon Uv</Item>
