import { useEffect, useState } from "react"
import { request } from "../../socket"
import ServerVignette from '../SeverVignette'
import Loading from "./../Loading"
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default function ServerList({displayPage, setCurrentServerPathName}){
    const [servers, setServers] = useState(null)

    useEffect(()=>{
        request("getServerList", setServers)
    }, [])

    function serverVignettes(serversArray){
        return serversArray.map(
            ({icon, serverName, owner, pathName}, index) =>
            (<ServerVignette
                name={serverName}
                icon={icon}
                owner={owner}
                key={index}
                onClick={() => {
                    displayPage("server")
                    setCurrentServerPathName(pathName)
                }}
            >
            </ServerVignette>)
        )
    }
    
    return (
        <>
            <h2><FontAwesomeIcon icon={solid("user-shield")}/> Mes serveurs :</h2>
            <div id="my-servers" className="server-list">
                {
                servers?.mine ? 
                servers.mine.length ?
                    serverVignettes(servers.mine)
                    : "Vous n'avez pas encore créé de serveur appuyer sur le bouton là-haut pour ↗ en créer un !"
                    : <Loading></Loading>
                }
            </div>

            <h2><FontAwesomeIcon icon={solid("share-from-square")}/> Partagés avec moi :</h2>
            <div id="sharedWithMe-servers" className="server-list">
                {
                servers?.sharedWithMe ? 
                servers.sharedWithMe.length ?
                    serverVignettes(servers.sharedWithMe)
                    : "Personne ne vous a partagé de serveur 😢"
                    : <Loading></Loading>
                }
            </div>

            <h2><FontAwesomeIcon icon={solid("earth-americas")}/> Serveurs publics :</h2>
            <div id="public-servers" className="server-list">
                {
                servers?.public ? 
                servers.public.length ?
                    serverVignettes(servers.public)
                    : "Il semblerait qu'il n'exitste aucun serveur public 😭"
                    : <Loading></Loading>
                }
            </div>
        </>
    )
}