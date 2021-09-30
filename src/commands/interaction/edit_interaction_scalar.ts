import { ICommandInfoV2 } from "../../controller/command"
import { EditorState } from "../../model/EditorState"

export const edit_interaction_scalar_command: ICommandInfoV2 = { 
    keep_status_by_default: true, 
    exec: edit_interaction_scalar, 
}

export function edit_interaction_scalar(state:EditorState, key: string): EditorState {
    let expression = ''
    if (state.interaction_buffer.scalar){
        expression = state.interaction_buffer.scalar.expression
    }
    switch (key) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            expression += key
            break
        case '.':
            if (expression.indexOf(key) === -1){
                expression += '.'
            } else {
                throw new Error("value already has fractional part")
            }
            break
        case '+':
            if (expression.startsWith('-')){
                expression = expression.substr(1)
            } else {
                throw new Error("value already positive")
            }
            break
        case '-':
            if (!expression.startsWith('-')){
                expression = '-' + expression
            } else {
                throw new Error("value already negative")
            }
            break
        case 'Backspace':
            if (expression.length > 0){
                expression = expression.substr(0, expression.length - 1)
            } else {
                throw new Error("value already empty")
            }
            break
        default:
            throw new Error("invalid key")
    }
    const value = Number(expression)
    return {
        ...state,
        interaction_buffer: {
            ...state.interaction_buffer,
            scalar: { expression, value },
        },
    }
}

export function edit_interaction_scalar_accepts_key(state: EditorState, key: string): boolean {
    let expression = ''
    if (state.interaction_buffer.scalar){
        expression = state.interaction_buffer.scalar.expression
    }
    switch (key) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            return true
        case '.':
            return expression.indexOf(key) === -1
        case '+':
            return expression.startsWith('-')
        case '-':
            return !expression.startsWith('-')
        case 'Backspace':
            return expression.length > 0
        default:
            return false
    }
}
