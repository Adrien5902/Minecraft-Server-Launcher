import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import './style.css'

function Switch({
    defaultValue, 
    autoUpdate = false, 
    onChange, 
    properties = {
        on: {
            icon: solid("check"),
            color: "lime"
        },
        off: {
            icon: solid("xmark"),
            color: "red"
        }
    }
}) {
    const [value, setValue] = useState(defaultValue)

    function handleClick(){
        onChange(!value)
        if(autoUpdate){
            setValue(!value)
        }
    }

    return ( 
    <div 
        onClick={handleClick} 
        value={value} 
        style={{justifyContent: value ? "right":"left"}} 
        className="switch"
    >
        <div className="switch-inner"></div>
        <FontAwesomeIcon 
            style={{"--onColor": properties.on.color, "--offColor": properties.off.color}} className="switch-icon"
            icon={(value ? properties.on.icon : properties.off.icon)}
        />
    </div> );
}

export default Switch;