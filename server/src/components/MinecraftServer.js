import {serverDir} from "./../../config.js"
import fs from "fs"
import path from "path"
import User from "./User.js"
import { errors } from "../errors.js"
import sharp from "sharp"

export default class MinecraftServer{
    /**
     * @param {string | Number} pathName 
     * @param {} config 
     */
    constructor(pathName, config){
        this.pathName = String(pathName)
        this.path = path.join(serverDir, pathName)
        this.config = config
    }

    static create(name, minecraft_version, id){
        const serverPath = path.join(serverDir, pathName)

        let config = {
            name,
            minecraft_version: minecraft_version
        }

        const server = new this(path, config)
    }

    static readFromPathName(pathName){
        const serverPath = path.join(serverDir, String(pathName))

        if(!fs.existsSync(serverPath) | !fs.lstatSync(serverPath).isDirectory()) throw errors.serverDoesNotExist(serverPath)

        const config = JSON.parse(fs.readFileSync(path.join(serverPath, "config.json")))
        
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
            visibility: this.config.visibility,
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
}