import { useEffect, useState } from "react"
import {request} from "../../socket"
import "./style.css"
import Sidebar from './Sidebar'
import Display from "./Display"
import ServerPermissions from "./ServerPermissions"
import { Route, Routes, useSearchParams } from "react-router-dom"

export default function ManageServer({developperMode, currentUserId}){
    const [searchParams] = useSearchParams();
    const serverPathName = searchParams.get("s")

    const [currentPermissions, setCurrentPermissions] = useState(null)

    function resetPermissions(){
        request("getUserServerPermissions", setCurrentPermissions, serverPathName)
    }

    useEffect(()=>{
        resetPermissions()
    }, [])

    return (
        <>
            <Sidebar currentPermissions={currentPermissions} serverPathName={serverPathName}></Sidebar>
            <div id="manage-server">
                <Routes>
                    <Route
                        path="/"
                        element={<Display 
                            currentPermissions={currentPermissions}
                            serverPathName={serverPathName}
                            developperMode={developperMode}
                            currentUserId={currentUserId}
                        />}
                    ></Route>
                    <Route
                        path="/perms"
                        element={<ServerPermissions
                            currentPermissions={currentPermissions}
                            resetPermissions={resetPermissions}
                        ></ServerPermissions>}>
                    </Route>
                </Routes>
            </div>
        </>
    )
}