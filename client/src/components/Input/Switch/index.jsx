import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './style.css'

function Switch({
    updateValue,
    value,
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
    return ( 
    <div 
        onClick={()=>updateValue(!value)}
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