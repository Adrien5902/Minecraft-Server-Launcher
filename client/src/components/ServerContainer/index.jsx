import { useEffect, useState } from "react"
import Button from "./../Button"
import Loading from "./../Loading"
import {request} from "./../../socket.js"
import "./style.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro"
import User from "../User"
import EditableImage from "../Input/EditableImage"

export default function ServerContainer({serverPathName, developperMode, currentUserId}){
    const [currentOnServer, setCurrentOnServer] = useState(undefined)
    const [serverVignette, setServerVignette] = useState(null)

    useEffect(()=>{
        request("currentOnServer", setCurrentOnServer)
        request("getServerVignette", setServerVignette, serverPathName)
    }, [])

    function changeServerIcon(iconBuffer){
        request("changeServerIcon", setTimeout(()=>{
            request("getServerVignette", setServerVignette, serverPathName)
        }, 1000), serverPathName, iconBuffer)
    }

    return (
        <>
            <div>
                <h1>
                {
                    serverVignette ? 
                    <>
                        <EditableImage
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
                
                <div className="owner">
                    <span>Par : </span>
                    {serverVignette ? <User userData={serverVignette.owner} currentUserId={currentUserId}/> : <Loading/>}
                </div>
                
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
            </div>
        </>
    )
}