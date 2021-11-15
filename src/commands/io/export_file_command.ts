import { ICommandInfoV2 } from "../../controller/command/ICommandInfoV2"
import { EditorState } from "../../model/EditorState"
import { export_map_obj } from "../../model/loader/export_obj/export_map_obj"

export const export_file_command: ICommandInfoV2 = {
    description: "Export file",
    shortcut: 'ctrl + alt + s',
    exec: export_file,
}

function export_file(state: EditorState): EditorState {
    const string_content = export_map_obj(state, true)
    const blob = new Blob([string_content], { type: 'text/plain' })
    const a = document.createElement('a')
    a.download = 'export.obj'
    a.href = window.URL.createObjectURL(blob)
    // a.dataset.downloadurl = ['text/plain', a.download, a.href].join(';')
    a.click()
    return state
}
