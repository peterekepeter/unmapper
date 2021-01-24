import React = require("react");
import { font } from "./typography";

const uiTextStyle: React.CSSProperties = {
    ...font,
    background: 'none',
    color: 'inherit',
    fontSize: 'inherit',
    border: 'none',
    outline: 'none'
};

type UiInputProps = {
    value?: string,
    suggested_value?: string,
    next_value?: (value: string) => void,
    preview_value?: (value: string) => void,
    value_drag?: (delta_y: number, cursor_at: number) => void
}

export function UiInput({
    value: original_value = "",
    suggested_value = null,
    next_value = null,
    preview_value = null,
    value_drag = null
}: UiInputProps) {
    const [edited_value, set_edited_value] = React.useState('')
    const [dirty, set_dirty] = React.useState(false)
    const pointer_down_at_y = React.useRef<number>(null);
    const cursor_at = React.useRef(0)
    const prev_suggested_value = React.useRef<string>(null);
    if (suggested_value !== null && suggested_value !== undefined){
        if (prev_suggested_value.current !== suggested_value){
            set_edited_value(suggested_value);
            set_dirty(true);
            prev_suggested_value.current = suggested_value;
            if (preview_value) preview_value(suggested_value)
        }
    }
    return <input
        value={dirty ? edited_value : original_value}
        onPointerDown={value_drag ? (event) => {
            const input = event.target as HTMLInputElement
            pointer_down_at_y.current = event.clientY
            cursor_at.current = Math.floor(input.selectionEnd);
        } : null}
        onPointerMove={value_drag ? (event) => {
            if (pointer_down_at_y.current !== null) {
                const input = event.target as HTMLInputElement
                value_drag(
                    event.clientY - pointer_down_at_y.current,
                    Math.min(input.selectionStart, input.selectionEnd))
                pointer_down_at_y.current = event.clientY
            }
        } : null}
        onPointerUp={value_drag ? (event) => {
            pointer_down_at_y.current = null
        } : null}
        onChange={(event) => {
            const value = event.target.value
            set_edited_value(value)
            set_dirty(true)
            if (preview_value) preview_value(original_value)
        }}
        onBlur={() => save_value_edit()}
        onKeyDown={(event) => {
            console.log(event.key);
            switch (event.key) {
                case "Enter":
                    save_value_edit()
                    event.preventDefault()
                    break
                case "Escape":
                    cancel_value_edit()
                    event.preventDefault()
                    break
            }
        }}
        style={uiTextStyle}></ input>

    function save_value_edit() {
        if (dirty) {
            if (edited_value !== original_value) {
                if (next_value) next_value(edited_value)
            } else {
                if (preview_value) preview_value(original_value)
            }
            set_dirty(false)
        }
    }

    function cancel_value_edit() {
        if (dirty) {
            if (preview_value) preview_value(original_value)
            set_dirty(false)
        }
    }
}