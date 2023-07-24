import { useEffect, useState } from "react"
import {request} from "../../socket.js"
import "./style.css"
import Sidebar from './Sidebar'
import Display from "./Display/"

export default function ServerContainer({serverPathName, developperMode, currentUserId}){
    const [manageMenu, setManageMenu] = useState("display")
    const [permissions, setPermissions] = useState(null)

    useEffect(()=>{
        request("getPermissions", setPermissions, serverPathName)
    })

    const menus = {
        display: <Display permissions={permissions} serverPathName={serverPathName} developperMode={developperMode} currentUserId={currentUserId} />,
        perms: <span>DFQSD</span>
    }

    return (
        <>
            <Sidebar setManageMenu={setManageMenu} manageMenu={manageMenu}></Sidebar>

            <div id="manage-server">
                {menus[manageMenu]}
            </div>
        </>
    )
}