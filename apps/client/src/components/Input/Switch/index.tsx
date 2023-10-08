import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './style.css'
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { CSSProperties } from "react";

function Switch({
    updateValue,
    value,
    properties = {
        on: {
            icon: faCheck,
            color: "lime"
        },
        off: {
            icon: faXmark,
            color: "red"
        }
    },
    onChange
}) {
    return ( 
    <div 
        onClick={()=> {updateValue(!value); onChange(!value)}}
        data-value={value}
        style={{justifyContent: value ? "right":"left"}} 
        className="switch"
    >
        <div className="switch-inner"></div>
        <FontAwesomeIcon 
            style={{"--onColor": properties.on.color, "--offColor": properties.off.color} as CSSProperties} className="switch-icon"
            icon={(value ? properties.on.icon : properties.off.icon)}
        />
    </div> );
}

export default Switch;