//@ts-check

import {serverDir} from "./../../config.js"
import fs from "fs"
import path from "path"
import User from "./User.js"
import { errors } from "../errors.js"
import sharp from "sharp"
import Permission from "./Permission.js";
import mapObject from "../init.js"

export default class MinecraftServer{
    /**
     * @param {string | Number} pathName 
     * @param {{
     *      name : string
     *      owner : string | null
     *      permissions : {
     *          all : {[permission : string] : any},
     *          [UserID : string] : {[permission : string] : any}
     *      }
     * }} config 
     */
    constructor(pathName, config){
        this.pathName = String(pathName)
        this.path = path.join(serverDir, this.pathName)
        this.config = config
    }

    /** @type {{[key: string] : Permission}} */
    static permissions = {
        view: new Permission("Voir le serveur", false),
        start_server: new Permission("Allumer le serveur", false),
        stop_server: new Permission("Éteindre le serveur", false),
        edit_properties: new Permission("Modifier les propriétés du serveur", false),
        edit_display: new Permission("Modifier le serveur (nom, icône...)", false),
        edit_permissions: new Permission("Modifier les permissions", false),
    }

    static defaultPermissions = mapObject(this.permissions, (perm) => perm.value)

    /**
     * @param {string} name 
     * @param {string | number} pathName 
     * @param {string | null} ownerID 
     */
    static create(name, pathName, ownerID){
        const serverPath = path.join(serverDir, String(pathName))
        fs.mkdirSync(serverPath)

        let config = {
            name,
            owner: ownerID,
            permissions: {
                all: this.defaultPermissions
            }
        }

        fs.writeFileSync(serverPath, JSON.stringify(config))

        const server = new this(pathName, config)
    }

    static readFromPathName(pathName){
        const serverPath = path.join(serverDir, String(pathName))

        if(!fs.existsSync(serverPath) || !fs.lstatSync(serverPath).isDirectory()) throw errors.serverDoesNotExist(serverPath)

        const config = JSON.parse(fs.readFileSync(path.join(serverPath, "config.json")).toString())
        
        const server = new this(pathName, config)

        return server
    }

    getOwner(){
        return User.users.find(u => u.id == this.config.owner) ?? null
    }

    vignette(){
        const iconPath = path.join(this.path, "server-icon.png")
        return {
            pathName: this.pathName,
            serverName: this.config.name,
            owner: this.getOwner(),
            icon: fs.existsSync(iconPath) ? 'data:image/jpeg;base64,'+fs.readFileSync(iconPath).toString('base64') : "assets/server-icon.png"
        }
    }

    setIcon(inputBuffer){
        sharp(inputBuffer)
        .resize(64, 64)
        .toFile(path.join(this.path, 'server-icon.png'), (err, info) => {  });
        return null
    }

    start(){

    }

    setUserPermissions(){

    }
}