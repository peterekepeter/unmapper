import * as React from "react"

export const buttonStyle = {
    border: '1px solid #333',
    borderTopColor: '#555',
    background: '#333',
    color: '#aaa',
    boxShadow: '0px 1px 1px #000',
    borderRadius: '2px',
    outline: 'none'
};

export const UiButton = ({ ...props }) => 
    <button style={buttonStyle} {...props}/>;
