import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useLocation } from "react-router-dom";
import "./style.css"
import { CSSProperties, useEffect, useState } from "react";

export default function HeaderButton({ icon, text, color, to }) {
    const location = useLocation();
    const [selected, setSelected] = useState(false);
    
    useEffect(() => {
        setSelected(location.pathname === to);
    }, [location.pathname, to]);

    return (
        <Link
            to={to}
            data-selected={String(selected)}
            style={{
                "--color": color 
            } as CSSProperties}
            className={'header-button'}
        >
            <div>
                <FontAwesomeIcon icon={icon}/> <span>{text}</span>
            </div>
        </Link>
    );
}
