import { useState } from "react";
import './style.css'
import { request } from "../../../../socket";
import React from "react";
import User from "../../../User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

function AddSomeone({addUser}) {
    const [searchUsers, setSearchUsers] = useState(null)

    function handleUserClick(userData){
        document.getElementById("permissions-add-someone-input").value = ""
        addUser(userData)
        search()
    }
    
    function search(input){
        if(input) request("searchUsers", setSearchUsers, input)
        else setSearchUsers([])
    }

    return ( 
        <div className="permissions-add-someone">
            <span className="centered-flex">
                <label htmlFor="permissions-add-someone-input">
                    <FontAwesomeIcon icon={solid("magnifying-glass")}/>
                </label>
                <input 
                    id="permissions-add-someone-input"
                    onChange={(e)=>search(e.target.value)}
                    type="text"
                    placeholder="Aujouter quelqu'un... (recherche par pseudo Discord)"
                />
            </span>
            <div id="permissions-add-someone-search">{
                searchUsers ? searchUsers.map((userData, index) => 
                    <User
                        key={index}
                        userData={userData}
                        onClick={handleUserClick}
                    />
                ) : ""
            }</div>
        </div>
    );
}

export default AddSomeone;