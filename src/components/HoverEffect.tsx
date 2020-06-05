import React = require("react");

export const hoverStyleDefaultCSS : React.CSSProperties = { 

}

export const hoverStyleCSS : React.CSSProperties = {
    opacity: .5
}

export function HoverEffect({ 
    defaultStyle = hoverStyleDefaultCSS, 
    hoverStyle = hoverStyleCSS, 
    ...props }) {
    const [isHover, setHover] = React.useState(false);
    return <div {...props} 
        onMouseEnter={() => setHover(true)} 
        onMouseLeave={() => setHover(false)} 
        style={isHover ? hoverStyle : defaultStyle} />;
}
