import "./style.css"
import User from '../User'

export default function ServerVignette({owner, icon, name, onClick}){
    return (
        <div className="server-vignette" onClick={onClick}>
            <img src={icon}></img>
            <div className="server-vignette-text">
                <span>{name}</span>
                <span className="server-vignette-owner">{owner?.username}</span>
            </div>
        </div>
    )
}