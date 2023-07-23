import Header from "./Header";
import { useEffect, useState } from "react";

import ServerList from "./ServerList";
import ServerContainer from "./ServerContainer";
import Account from "./Account"
const { ipcRenderer } = window.require("electron");

function App() {
    const [page, displayPage] = useState("server-list")
    const [currentServerPathName, setCurrentServerPathName] = useState(null)
    const [userData, setUserData] = useState(null)

    function setting(setting, defaultValue){
        const [value, set] = useState(defaultValue)
        useEffect(()=>{
            set(ipcRenderer.sendSync("getSetting", setting))
        }, [])

        let output = {
            value,
            set: (newValue) => {
                set(newValue)
                ipcRenderer.sendSync("setSetting", setting, newValue)
            }
        }
        return output
    }

    const {value: lightTheme, set: setLightTheme} = setting("lightTheme", false)
    const {value: developperMode, set: setDevelopperMode} = setting("developperMode", false)

    useEffect(() => {
        setUserData(ipcRenderer.sendSync("getUserData"))
    }, [])

    const pages = {
        "server-list": (
            <ServerList displayPage={displayPage} setCurrentServerPathName={setCurrentServerPathName}></ServerList>
        ),
        "create-server": (
            <>+</>
        ),
        "account": (
            <Account lightTheme={lightTheme} setTheme={setLightTheme} developperMode={developperMode} setDevelopperMode={setDevelopperMode} userData={userData}></Account>
        ),
        "server":(
            <ServerContainer developperMode={developperMode} serverPathName={currentServerPathName} currentUserId={userData?.id}></ServerContainer>
        )
    }

    return (
        <div id="app" lighttheme={String(lightTheme)}>
            <Header displayPage={displayPage} page={page}></Header>
            <div id="content">{pages[page]}</div>
        </div>
    );
}

export default App;
