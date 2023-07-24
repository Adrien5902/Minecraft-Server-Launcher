import { useEffect, useState } from "react"
import {request} from "../../socket.js"
import "./style.css"
import Sidebar from './Sidebar'
import Display from "./Display/"
import { Route, Routes, useSearchParams } from "react-router-dom"

export default function ManageServer({developperMode, currentUserId}){
    const [searchParams, setSearchParams] = useSearchParams();
    const serverPathName = searchParams.get("s")

    const [permissions, setPermissions] = useState(null)

    useEffect(()=>{
        request("getPermissions", setPermissions, serverPathName)
    }, [])

    return (
        <>
            <Sidebar serverPathName={serverPathName}></Sidebar>
            <Routes>
                <Route path="/" developperMode={developperMode} element={<Display permissions={permissions} serverPathName={serverPathName} developperMode={developperMode} currentUserId={currentUserId} />}></Route>
                <Route path="/perms" element={<span>Test</span>}></Route>
            </Routes>
        </>
    )
}