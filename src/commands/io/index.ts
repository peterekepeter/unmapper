import { ICommandInfoV2 } from "../../controller/command"
import { import_file_command } from "./import_file_command"

export function get_io_commands(): ICommandInfoV2[]{
    return [import_file_command]
}
