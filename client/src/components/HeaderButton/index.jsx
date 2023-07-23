import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./style.css"
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro"

export default function HeaderButton({displayPage, icon, text, color, href, page}){
    let isSelected = page == href ? " selected" : ""
    
    return (
        <a 
            style={{
                "--color": color 
            }}

            className={'header-button' + isSelected}

            onClick={(e) => {
                displayPage(href)
            }}
        >
            <div>
                <FontAwesomeIcon icon={icon}/> <span>{text}</span>
            </div>
        </a>
    )
}