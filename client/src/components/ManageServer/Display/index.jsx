import Button from '../../Input/Button'
import Loading from "../../Loading"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro"
import User from "../../User"
import EditableImage from "../../Input/EditableImage"
import { useEffect, useState } from "react"
import { request } from "../../../socket"

function Display({currentUserId, developperMode, serverPathName, permissions}) {
    const [currentOnServer, setCurrentOnServer] = useState(undefined)
    const [serverVignette, setServerVignette] = useState(null)

    function changeServerIcon(iconBuffer){
        request("changeServerIcon", setTimeout(()=>{
            request("getServerVignette", setServerVignette, serverPathName)
        }, 1000), serverPathName, iconBuffer)
    }

    useEffect(()=>{
        request("currentOnServer", setCurrentOnServer)
        request("getServerVignette", setServerVignette, serverPathName)
    }, [])

    return ( 
        <>
        <h1 className="centered-flex">
        {
            serverVignette ? 
            <>
                <EditableImage
                    editable={permissions?.edit_display ?? false}
                    src={serverVignette.icon}
                    autoUpdate={false}
                    onChange={changeServerIcon}
                    supportedFormats={['png']}
                />
                <span>{serverVignette.serverName}</span>
            </> 

            : <Loading/>
        }
        </h1>
        
        {developperMode ? <h3><FontAwesomeIcon icon={solid("id-card")}/> Id du serveur : {serverVignette?.pathName}</h3> : ""}
        
        {
        serverVignette?.owner ?
        <h3 className="owner">
            <span>Par : </span>
            {serverVignette ? <User userData={serverVignette.owner} currentUserId={currentUserId}/> : <Loading/>}
        </h3>
        : ""
        }
        
        {
        currentOnServer === undefined ? <Loading></Loading> :
        currentOnServer === null ?
            <Button
                text={"Lancer le serveur"}
                color="var(--accent)"
            ></Button> 
            :
        currentOnServer == serverPathName ?
            <Button
                text={"Arrrêter le serveur"}
                color="red"
            ></Button> 
            :
            <span>Un serveur est déjà lancé !</span>
        }
        </>
    );
}

export default Display;