import React = require("react")
import { useSignal } from "./useSignal"
import { themeColors } from "../theme"
import { createController } from "../controller";
import { UiText } from "../ui/UiText";
import { font } from "../ui/typography";
import { getAllCommands, ICommandInfo } from "../controller/commands";
import { buttonStyle } from "../ui/UiButton";

export const CommandPalette = ({ controller = createController() }) => {
    
    const colors = useSignal(themeColors);
    const shown = useSignal(controller.commandsShownState);
    const [value, setValue] = React.useState('');
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [isMouseOver, xxx] = React.useState(false);

    function setIsMouseOver(state:boolean){
        console.log('mouseover', state);
        xxx(state);
    }

    if (!shown){
        return <></>;
    }

    const matching = getMatchingCommands(value);

    return <div style={{
        background: colors.background,
        color: colors.foreground,
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translate(-50%, 0)',
        width: '800px',
        maxWidth: '80%',
        margin: '1rem',
        boxShadow: '0px 2px 4px #0008, 0px 8px 32px #0008',
        borderRadius: '2px'
    }}
    onMouseEnter={()=>setIsMouseOver(true)}
    onMouseLeave={()=>setIsMouseOver(false)}>
        <div style={{margin:'2px'}}> 
            <UiText>&gt;</UiText><input 
                spellCheck="false" 
                autoFocus 
                onChange={input}
                value={value}
                style={{
                    background:'none',
                    color: colors.foreground,
                    border: 'none',
                    outline: 'none',
                    ...font,
                    fontSize: '14px',
                }} 
                onBlur={handleBlur}
                onKeyDown={keydown}/>
        </div>
        {matching.map(
            (cmd, index) => <CommandItem 
                key={cmd.description}
                command={cmd} 
                selected={index===selectedIndex}
                onMouseEnter={()=>setSelectedIndex(index)}
                onClick={()=>{setSelectedIndex(index);submit()}}/>)}
    </div>

    function input(event: React.ChangeEvent<HTMLInputElement>){
        setValue(event.target.value);
    }

    function keydown(event : React.KeyboardEvent<HTMLInputElement>)
    {
        if (event.key === 'Escape'){
            cancel();
        }
        else if (event.key === 'Enter'){
            submit();
        } 
        else if(event.key === 'ArrowUp')
        {
            setSelectedIndex(selectedIndex - 1);
        } 
        else if (event.key === 'ArrowDown') 
        {
            setSelectedIndex(selectedIndex + 1);
        }
    }

    function submit(){
        const cmds = getMatchingCommands(value);
        const cmd = cmds[selectedIndex];
        if (cmd){
            cmd.implementation();
        }
        hide();
    }

    function cancel() {
        hide();
    }

    function hide(){
        setValue('');
        setSelectedIndex(0);
        controller.commandsShownState.value = false;
    }

    function handleBlur(){
        if (!isMouseOver){
            hide();
        }
    }
}

function getMatchingCommands(str : string){
    return getAllCommands().filter(
        cmd => cmd.description.toLocaleLowerCase()
            .indexOf(str.toLocaleLowerCase()) >= 0);
}

const CommandItem = ({command, selected, onClick, onMouseEnter} : {command:ICommandInfo, selected:boolean, onClick:()=>void, onMouseEnter:()=>void}) => {
    const background = selected 
        ? themeColors.value.accent + '2'
        : 'none'
        
    return <div style={{
            padding: '6px',
            fontSize: '14px', 
            background, 
            display:'flex', 
            cursor:'pointer'
        }} 
        onClick={onClick}
        onMouseEnter={onMouseEnter}>
        <UiText>{command.description}</UiText>
        <div style={{flexGrow:1}}></div>
        <Shortcut str={command.shortcut}/>
    </div>
}

const Shortcut = ({str}:{str: string}) => {
    if (!str){
        return <></>;
    }
    return <>{str.split(/\s+/).map((token,index) => token === '+' 
        ? (<span key={token + index} style={shortcutKeySeparatorStyle}>{token}</span>)
        : (<span key={token} style={shortcutKeyStyle}>{token}</span>))}</>;
}

const shortcutKeySeparatorStyle = {
    marginLeft: '2px',
    marginRight: '2px',
    ...font
}

const shortcutKeyStyle = {
    ...font,
    ...buttonStyle
}
