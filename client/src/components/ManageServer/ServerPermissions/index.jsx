import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { request } from "../../../socket";
import Loading from "../../Loading";
import User from "../../User";
import Input from "../../Input"
import ConfirmSave from "../../ConfirmSave";
import './style.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import FoldChevron from "../../Input/FoldChevron";
import AddSomeone from "./AddSomeone";

const permissionsLocale = {
    view: (<span><FontAwesomeIcon icon={solid("eye")}/> Voir le serveur</span>),
    start_server: (<span><FontAwesomeIcon icon={solid("circle-play")}/> Allumer le serveur</span>),
    stop_server: (<span><FontAwesomeIcon icon={solid("power-off")}/> Éteindre le serveur</span>),
    edit_display: (<span><FontAwesomeIcon icon={solid("pen")}/> Modifier le serveur (nom, icône...)</span>),
    edit_properties: (<span><FontAwesomeIcon icon={solid("gears")}/> Modifier les propriétés du serveur</span>),
    edit_permissions: (<span><FontAwesomeIcon icon={solid("user-shield")}/> Modifier les permissions</span>),
    console: (<span><FontAwesomeIcon icon={solid("terminal")}/> Accès à la console</span>),
}

function ServerPermissions({resetPermissions, currentPermissions}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const serverPathName = searchParams.get("s")
    const [changed, setChanged] = useState(false)

    function mapObject(obj, callback) {
        return Object.keys(obj).reduce((result, key) => {
            const res = callback(obj[key], key, obj)
            if(res !== undefined) result[key] = res;
            return result;
        }, {});
    }

    const [permissions, setPermissions] = useState(null)

    function updatePermissions(perms) {
        setChanged(true)
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            permissions: perms,
        }));
    }

    function handleChange(userID, key, value){
        let perms = permissions.permissions
        perms[userID][key] = value
        updatePermissions(perms)
    }

    function requestPerms(){
        request("getServerPermissions", setPermissions, serverPathName)
        setChanged(false)
    }

    useEffect(()=>{
        requestPerms()
    }, [searchParams])

    function savePermissions(){
        request("setServerPermissions", requestPerms, serverPathName, permissions.permissions)
        resetPermissions()
}

    function addUser(userData){
        if(permissions.permissions[userData.id]) return
        let prevPermissions = permissions
        prevPermissions.users.push(userData)
        prevPermissions.permissions[userData.id] = {}
        setPermissions(prevPermissions)
        updatePermissions(prevPermissions.permissions)
        setChanged(true)
    }

    if(!currentPermissions) return <Loading/>

    if(!currentPermissions.edit_permissions) history.go(-1)

    return ( 
        <>
        <div id="permissions-content-container">
            <h1><span><FontAwesomeIcon icon={solid("shield-halved")}/> Permissions :</span></h1>
            {
            permissions ? 
            
            Object.keys(permissions.permissions).map(userID => {
                const userPermissions = Object.values(mapObject(
                    permissions.defaultPermissions, (permission, key)=>{
                        permissions.permissions[userID][key] ??= permission.value
                        return {
                            name: permissionsLocale[key] ?? permission.name,
                            type: permission.type,
                            key,
                            value: permissions.permissions[userID][key],
                        }
                    }
                ))

                function getAllValue(){
                    const perms = permissions.permissions[userID]
                    return Object.values(perms).every(v => v === true)
                }
                let allValue = getAllValue()

                function setAll(value){
                    let perms = permissions.permissions
                    for(const {key} of userPermissions){
                        perms[userID][key] = value
                    }
                    updatePermissions(perms)
                    getAllValue()
                }

                function removeUser(){
                    let prevPerms = permissions.permissions
                    delete prevPerms[userID]
                    updatePermissions(prevPerms)
                }

                return <div className="permissions">
                    <h2 className="permissions-title" onClick={(e)=>{
                        e.target.closest(".permissions-title").querySelector(".fold-chevron").click()
                    }}>
                        <FoldChevron selector={`.permissions-list[userid="${userID}"]`}/>
                        {
                        userID == "all" ? 
                        <><span>Tout le monde</span><FontAwesomeIcon icon={solid("globe-americas")}/></>
                        :
                        <>
                            <User userData={permissions.users.find(user => user.id = userID)}/>
                            <FontAwesomeIcon
                                icon={solid("xmark")}
                                onClick={removeUser}
                                className="permissions-remove-user"
                            />
                        </>
                        }
                    </h2>
                    <div className="permissions-list" userid={String(userID)}>
                        <Input
                            type="boolean"
                            label={<span><FontAwesomeIcon icon={solid("layer-group")}/> Toutes les permissions</span>}
                            autoUpdate={true}
                            value={allValue}
                            onChange={setAll}
                        />
                        {
                        userPermissions.map((permission, index) => {
                            userPermissions.push(permission)
                            return <Input
                                key={index}
                                label={permission.name}
                                value={permission.value}
                                type={permission.type}
                                autoUpdate={true}
                                onChange={v => handleChange(userID, permission.key, v)}
                            />
                        })
                        }
                    </div>
                </div>
            })
            
            : <Loading/>

            }

            <AddSomeone
                addUser={addUser}
            />
        </div>

        <ConfirmSave
            onConfirm={savePermissions}
            onCancel={requestPerms}
            displayed={changed}
        />
        </>
    );
}

export default ServerPermissions;