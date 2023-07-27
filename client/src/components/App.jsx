import Header from "./Header";
import { useEffect, useState } from "react";
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

    return (
        <div id="app" lighttheme={String(lightTheme)}>
            <Header></Header>
            <div id="content">
                <Routes>
                    <Route path="/index.html" element={<ServerList></ServerList>}></Route>
                    <Route path="/account" element={<Account lightTheme={lightTheme} setTheme={setLightTheme} developperMode={developperMode} setDevelopperMode={setDevelopperMode} userData={userData}></Account>}></Route>
                    <Route path="/manage-server/*" element={<ManageServer developperMode={developperMode}></ManageServer>} ></Route>
                    <Route path="/server" element={<ManageServer developperMode={developperMode} currentUserId={userData?.id}></ManageServer>}></Route>
                </Routes>
            </div>
        </div>
    );
}

export default App;
