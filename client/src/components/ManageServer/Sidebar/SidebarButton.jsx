import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

function SidebarButton({icon, text, onClick, selected: select}) {
    const [selected, setSelected] = useState(false)

    useEffect(()=>{
        setSelected(select)
    }, [select])

    return ( 
    <div onClick={onClick} className="sidebar-button" select={String(selected)}>
        <div className="sidebar-button-select"></div>
        <div className="sidebar-button-container">
            <FontAwesomeIcon icon={icon}/>
            <span>{text}</span>
        </div>
    </div>
    );
}

export default SidebarButton;