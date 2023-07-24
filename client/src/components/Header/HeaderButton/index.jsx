import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom";
import "./style.css"

export default function HeaderButton({ icon, text, color, to }) {
  let isSelected = window.location.pathname === to ? " selected" : "";

    return (
        <Link
            to={to}
            style={{
                "--color": color 
            }}
            className={'header-button' + isSelected}
        >
            <div>
                <FontAwesomeIcon icon={icon}/> <span>{text}</span>
            </div>
        </Link>
    );
}
