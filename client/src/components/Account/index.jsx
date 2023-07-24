import User from "../User"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { brands, solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import Button from "../Input/Button"
import Input from "../Input"
const { ipcRenderer } = window.require("electron")
import './style.css'

export default function Account({userData, developperMode, setDevelopperMode, setTheme, lightTheme}){
    return (
        <>
        <h1>Connecté via discord <FontAwesomeIcon style={{margin:"0 .2em"}} icon={brands("discord")} /> : </h1>
        <div style={{
            fontSize: "5vw",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
        }}>
            {userData ? <User pfpSize="512" userData={userData}></User>:""}
        </div>
        
        {developperMode ? <><FontAwesomeIcon icon={solid("id-card")}/> {"id discord : " + userData.id} <br/></> : ""}

        <Button
            text="Se déconnecter"
            onClick={()=>{ipcRenderer.send("log-out")}}
            color="red"
        ></Button>

        <br/><br/>

        <h1><FontAwesomeIcon icon={solid("gears")}/> Paramètres :</h1>
        <div id="settings">
            <Input 
                label="Thème"
                type="switch"
                onChange={setTheme}
                defaultValue={lightTheme}
                autoUpdate={true}
                properties={{
                    on:{
                        color: "var(--accent)",
                        icon: solid("sun")
                    }, off:{
                        color: "gray",
                        icon: solid("moon")
                    }
                }}
            />
            <Input
                label="Mode développeur"
                type="switch"
                onChange={setDevelopperMode}
                defaultValue={developperMode}
                autoUpdate={true}
            />
        </div>
        </>
    )
}