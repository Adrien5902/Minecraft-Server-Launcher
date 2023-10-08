import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

function SidebarButton({icon, text, to}) {
    const location = useLocation();
    const [selected, setSelected] = useState(false);
    
    useEffect(() => {
        setSelected(location.pathname === new URL(to, 'http://localhost').pathname);
    }, [location.pathname, to]);

    return ( 
    <Link to={to} className="sidebar-button" select={String(selected)}>
        <div className="sidebar-button-select"></div>
        <div className="sidebar-button-container">
            <FontAwesomeIcon icon={icon}/>
            <span>{text}</span>
        </div>
    </Link>
    );
}

export default SidebarButton;