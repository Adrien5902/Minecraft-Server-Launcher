import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { request } from "../../../socket";
import Loading from "../../Loading";
import User from "../../User";
import Input from "../../Input"
import ConfirmSave from "../../ConfirmSave";
import './style.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FoldChevron from "../../Input/FoldChevron";
import AddSomeone from "./AddSomeone";
import { faCirclePlay, faEye, faGears, faGlobeAmericas, faLayerGroup, faPen, faPowerOff, faShieldHalved, faTerminal, faUserShield, faXmark } from "@fortawesome/free-solid-svg-icons";
import { UserResolvable } from "../../../types";

const permissionsLocale = {
    view: (<span><FontAwesomeIcon icon={faEye}/> Voir le serveur</span>),
    start_server: (<span><FontAwesomeIcon icon={faCirclePlay}/> Allumer le serveur</span>),
    stop_server: (<span><FontAwesomeIcon icon={faPowerOff}/> Éteindre le serveur</span>),
    edit_display: (<span><FontAwesomeIcon icon={faPen}/> Modifier le serveur (nom, icône...)</span>),
    edit_properties: (<span><FontAwesomeIcon icon={faGears}/> Modifier les propriétés du serveur</span>),
    edit_permissions: (<span><FontAwesomeIcon icon={faUserShield}/> Modifier les permissions</span>),
    console: (<span><FontAwesomeIcon icon={faTerminal}/> Accès à la console</span>),
}

interface Permissions{
    console: number
    edit_display: boolean
    edit_permissions: boolean
    edit_properties: boolean
    start_server: boolean
    stop_server: boolean
    view: boolean
}

function ServerPermissions({resetPermissions, currentPermissions}) {
    const [searchParams] = useSearchParams();
    const serverPathName = searchParams.get("s")
    const [changed, setChanged] = useState(false)

    function mapObject<T, R>(
        obj: T,
        f: (value: any, key: string, obj: T) => R
      ): Record<string, R> {
        return Object.keys(obj).reduce((result, key) => {
          const res = f(obj[key], key, obj);
          if (res !== undefined) result[key] = res;
          return result;
        }, {} as Record<string, R>);
      }
      

    const [permissions, setPermissions] = useState<{
        defaultPermissions: {
            [K in keyof Permissions]: {
              name: string;
              value: Permissions[K];
              type: K extends "console" ? "slider" : "boolean";
            };
        };
        permissions: {
            [userID: string]: Permissions
        }[]
        users: UserResolvable[]
    }>(null)

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

    function addUser(userData: UserResolvable){
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
            <h1><span><FontAwesomeIcon icon={faShieldHalved}/> Permissions :</span></h1>
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
                        ((e.target as HTMLHeadingElement).closest(".permissions-title").querySelector(".fold-chevron") as HTMLDivElement).click()
                    }}>
                        <FoldChevron selector={`.permissions-list[userid="${userID}"]`}/>
                        {
                        userID == "all" ? 
                        <><span>Tout le monde</span><FontAwesomeIcon icon={faGlobeAmericas}/></>
                        :
                        <>
                            <User userData={permissions.users.find(user => user.id = userID)}/>
                            <FontAwesomeIcon
                                icon={faXmark}
                                onClick={removeUser}
                                className="permissions-remove-user"
                            />
                        </>
                        }
                    </h2>
                    <div className="permissions-list" data-userid={String(userID)}>
                        <Input
                            type="boolean"
                            label={<span><FontAwesomeIcon icon={faLayerGroup}/> Toutes les permissions</span>}
                            autoUpdate={true}
                            value={allValue}
                            onChange={setAll}
                            key={0}
                        />
                        {
                        userPermissions.map((permission, index) => {
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