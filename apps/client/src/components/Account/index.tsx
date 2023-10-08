import User from "../User"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from "../Input/Button"
import Input from "../Input"
const { ipcRenderer } = window.require("electron")
import './style.css'
import { faDiscord } from "@fortawesome/free-brands-svg-icons"
import { faGears, faIdCard, faMoon, faSun } from "@fortawesome/free-solid-svg-icons"

export default function Account({userData, developperMode, setDevelopperMode, setTheme, lightTheme}){
    return (
        <>
        <h1>Connecté via discord <FontAwesomeIcon style={{margin:"0 .2em"}} icon={faDiscord} /> : </h1>
        <div style={{
            fontSize: "5vw",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
        }}>
            {userData ? <User pfpSize="512" userData={userData}></User>:""}
        </div>
        
        {developperMode ? <><FontAwesomeIcon icon={faIdCard}/> {"id discord : " + userData.id} <br/></> : ""}

        <Button
            text="Se déconnecter"
            onClick={()=>{ipcRenderer.send("log-out")}}
            color="red"
            textColor="white"
        ></Button>

        <br/><br/>

        <h1><FontAwesomeIcon icon={faGears}/> Paramètres :</h1>
        <div id="settings">
            <Input 
                label="Thème"
                onChange={setTheme}
                value={lightTheme}
                autoUpdate={true}
                properties={{
                    on:{
                        color: "var(--accent)",
                        icon: faSun
                    }, off:{
                        color: "gray",
                        icon: faMoon
                    }
                }}
            />
            <Input
                label="Mode développeur"
                onChange={setDevelopperMode}
                value={developperMode}
                autoUpdate={true}
            />
        </div>
        </>
    )
}