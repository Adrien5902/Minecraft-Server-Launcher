import { useEffect, useState } from "react"
import {request} from "../../socket.js"
import "./style.css"
import Sidebar from './Sidebar'
import Display from "./Display/"
import ServerPermissions from "./ServerPermissions"
import { Route, Routes, useSearchParams } from "react-router-dom"

export default function ManageServer({developperMode, currentUserId}){
    const [searchParams, setSearchParams] = useSearchParams();
    const serverPathName = searchParams.get("s")

    const [currentPermissions, setCurrentPermissions] = useState(null)

    useEffect(()=>{
        request("getUserServerPermissions", setCurrentPermissions, serverPathName)
    }, [])

    return (
        <>
            <Sidebar currentPermissions={currentPermissions} serverPathName={serverPathName}></Sidebar>
            <div id="manage-server">
                <Routes>
                    <Route
                        path="/"
                        developperMode={developperMode}
                        element={<Display 
                            currentPermissions={currentPermissions}
                            serverPathName={serverPathName}
                            developperMode={developperMode}
                            currentUserId={currentUserId}
                        />}
                    ></Route>
                    <Route
                        path="/perms"
                        element={<ServerPermissions></ServerPermissions>}>
                    </Route>
                </Routes>
            </div>
        </>
    )
}