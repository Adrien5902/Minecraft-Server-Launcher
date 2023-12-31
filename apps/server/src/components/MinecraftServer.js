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
        stop_server: new Permission("Stopper le serveur", false),
        console: new Permission("Accès à la console", 0, "slider"),
        edit_display: new Permission("Modifier le serveur (nom, icône...)", false),
        edit_properties: new Permission("Modifier les propriétés du serveur", false),
        edit_permissions: new Permission("Modifier les permissions", false),
    }

    static defaultPermissions = mapObject(this.permissions, (perm) => perm.value)

    saveConfig(){
        fs.writeFileSync(path.join(this.path, "config.json"), JSON.stringify(this.config, null, 4))
    }

    /**
     * @param {string | MinecraftServer} pathName 
     * @returns {MinecraftServer}
     */
    static readFromPathName(pathName){
        if(pathName instanceof MinecraftServer) return pathName

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
            icon: fs.existsSync(iconPath) && 'data:image/jpeg;base64,'+fs.readFileSync(iconPath).toString('base64')
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

    static create(name, ownerID){
        const pathName = Math.max(...fs.readdirSync(serverDir).map(name => Number(name)))
        const serverPath = path.join(serverDir, String(pathName))
        fs.mkdirSync(serverPath)

        let config = {
            name,
            owner: ownerID,
            permissions: {
                all: this.defaultPermissions
            }
        }

        const server = new this(pathName, config)
        server.saveConfig()
    }
}