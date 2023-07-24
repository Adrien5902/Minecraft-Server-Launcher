import Header from "./Header";
import { useEffect, useState, memo, useMemo } from "react";
import { Routes, Route } from 'react-router-dom';

import ServerList from "./ServerList";
import ManageServer from "./ManageServer";
import Account from "./Account"
const { ipcRenderer } = window.require("electron");

function App() {
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

    // const memoRoutes = useMemo(()=>(
    // ), [lightTheme, developperMode, userData])

    return (
        <div id="app" lighttheme={String(lightTheme)}>
            <Header></Header>
            <Routes>
                <Route path="/" element={<ServerList></ServerList>}></Route>
                <Route path="account" element={<Account lightTheme={lightTheme} setTheme={setLightTheme} developperMode={developperMode} setDevelopperMode={setDevelopperMode} userData={userData}></Account>}></Route>
                <Route path="server" element={<ManageServer developperMode={developperMode} currentUserId={userData?.id}></ManageServer>}></Route>
            </Routes>
        </div>
    );
}

export default App;
