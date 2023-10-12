import Button from '../../Input/Button'
import Loading from "../../Loading"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import User from "../../User"
import EditableImage from "../../Input/EditableImage"
import { useEffect, useState } from "react"
import { request } from "../../../socket"
import { faIdCard } from '@fortawesome/free-solid-svg-icons'

function Display({currentUserId, developperMode, serverPathName, currentPermissions}) {
    const [currentOnServer, setCurrentOnServer] = useState(undefined)
    const [serverVignette, setServerVignette] = useState(null)

    function changeServerIcon(iconBuffer: string){
        request("changeServerIcon", () => setTimeout(()=>{
            request("getServerVignette", setServerVignette, serverPathName)
        }, 1000), serverPathName, iconBuffer)
    }

    useEffect(()=>{
        request("currentOnServer", setCurrentOnServer)
        request("getServerVignette", setServerVignette, serverPathName)
    }, [])

    if(!serverVignette) return <Loading/>

    return ( 
        <>
        <h1>
            <EditableImage
                editable={currentPermissions?.edit_display ?? false}
                src={serverVignette.icon || "/assets/server-icon.png"}
                autoUpdate={false}
                onChange={changeServerIcon}
                supportedFormats={['png']}
            />
            <span>{serverVignette.serverName}</span>
        </h1>
        
        {developperMode ? <h3><FontAwesomeIcon icon={faIdCard}/> Id du serveur : {serverVignette?.pathName}</h3> : ""}
        
        {
        serverVignette?.owner &&
        <h3 className="owner">
            <span>Par : </span>
            <User userData={serverVignette.owner} currentUserId={currentUserId}/>
        </h3>
        }
        
        {
        currentOnServer === undefined ? <Loading></Loading> :
        currentOnServer === null ?
            <Button
                text={"Lancer le serveur"}
                color="var(--accent)"
                onClick={() => {}}
            ></Button> 
            :
        currentOnServer == serverPathName ?
            <Button
                text={"Arrrêter le serveur"}
                color="red"
                onClick={() => {}}
            ></Button> 
            :
            <span>Un serveur est déjà lancé !</span>
        }
        </>
    );
}

export default Display;