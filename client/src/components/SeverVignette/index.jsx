import "./style.css"
import { Link } from "react-router-dom"

export default function ServerVignette({owner, icon, name, serverPathName}){
    return (
        <Link className="server-vignette" to={"/manage-server/?s="+serverPathName}>
            <img src={icon}></img>
            <div className="server-vignette-text">
                <span>{name}</span>
                <span className="server-vignette-owner">{owner?.username}</span>
            </div>
        </Link>
    )
}