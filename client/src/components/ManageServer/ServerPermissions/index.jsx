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

function ServerPermissions() {
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

    return ( 
        <>
        <h1><FontAwesomeIcon icon={solid("shield-halved")}/>Permissions :</h1>
        {
        permissions ? 
        
        Object.keys(permissions.permissions).map(userID => {
            const userPermissions = Object.values(mapObject(permissions.defaultPermissions, (permission, key)=>{
                permissions.permissions[userID][key] = permissions.permissions[userID][key] ?? permission.value
                return {
                    name: permission.name,
                    type: permission.type,
                    key,
                    value: permissions.permissions[userID][key],
                }
            }))

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

            return <div>
                <h2>
                    <FoldChevron selector={`.permissions-list[userid="${userID}"]`}/>
                    {
                    userID == "all" ? 
                    <span>Tout le monde</span>
                    :<User userData={permissions.users.find(user => user.id = userID)}/>
                    }
                </h2>
                <div className="permissions-list" userid={String(userID)}>
                    <Input
                        type="boolean"
                        label="Tout"
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

        {changed ? <ConfirmSave onConfirm={()=>{}} onCancel={requestPerms}/> : ""}
        </>
    );
}

export default ServerPermissions;