import { StateMergeFn } from "../../controller/command/ICommand"
import { ICommandInfoV2 } from "../../controller/command/ICommandInfoV2"
import { Actor } from "../../model/Actor"
import { create_actor_selection } from "../../model/EditorSelection"
import { EditorState } from "../../model/EditorState"
import { import_map_obj } from "../../model/loader/import_obj/import_map_obj"
import { range } from "../../util/range"

export const import_file_command: ICommandInfoV2 = {
    description: "Import file",
    shortcut: 'ctrl + alt + o',
    execAsync: import_file,
}

async function import_file(merge: StateMergeFn): Promise<void> {
    const files = await get_user_files(".obj")
    let imported_actors: Actor[] = []
    for (const file of files){
        const text = await file.text()
        const obj_data = import_map_obj(text)
        imported_actors = [...imported_actors, ...obj_data.actors]
    }
    merge((s: EditorState) => ({
        ...s, 
        map: {
            ...s.map,
            actors: [
                ...s.map.actors,
                ...imported_actors,
            ],
        },
        selection: {
            ...s.selection,
            actors: range(s.map.actors.length, s.map.actors.length + imported_actors.length)
                .map(i => create_actor_selection(i)),
        }, 
    }))
}

function get_user_files(...accepts: string[]): Promise<FileList> {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    if (accepts.length > 0){
        input.accept = accepts.join(", ")
    }
    input.hidden = true
    input.click()
    return new Promise((resolve, reject) => {
        input.onchange = () => {
            resolve(input.files)
        }
    })
}
