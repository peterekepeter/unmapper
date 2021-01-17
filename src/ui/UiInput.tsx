import React = require("react");
import { font } from "./typography";

const uiTextStyle : React.CSSProperties = {
    ...font,
    background: 'none',
    color: 'inherit',
    fontSize: 'inherit',
    border: 'none',
    outline: 'none'
};

export function UiInput({ 
    value: original_value = "", 
    next_value = (value: string) => { }, 
    preview_value = (value: string) => { } 
}) {
    const [edited_value, set_edited_value] = React.useState('');
    const [dirty, set_dirty] = React.useState(false);
    return <input 
        value={dirty ? edited_value : original_value} 
        onChange={(event)=>{ 
            const value = event.target.value;
            set_edited_value(value);
            set_dirty(true);
            preview_value(edited_value);
        }}
        onBlur={() => save_value_edit()}
        onKeyDown={(event) =>{
            console.log(event.key);
            switch(event.key){
                case "Enter":
                    save_value_edit();
                    event.preventDefault();
                    break;
                case "Escape":
                    cancel_value_edit();
                    event.preventDefault();
                    break;
            }
        }}
        style={uiTextStyle}></ input>
    
    function save_value_edit(){
        if (dirty){
            if (edited_value !== original_value){
                next_value(edited_value);
            } else {
                preview_value(original_value)
            }
            set_dirty(false);
        }
    }

    function cancel_value_edit(){
        if (dirty){
            preview_value(original_value);
            set_dirty(false);
        }
    }
}