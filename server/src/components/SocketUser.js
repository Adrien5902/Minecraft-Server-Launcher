//@ts-check
import fs from 'fs'
import {Socket} from "socket.io"
import {serverDir} from '../../config.js'
import {ServerLauncherError, errors} from '../errors.js'
import MinecraftServer from './MinecraftServer.js'
import { oauth } from '../init.js'
import DiscordOauth2 from "discord-oauth2"
import User from './User.js'

export default class SocketUser extends User{
    /**
     * @param {Socket} socket 
     * @param {DiscordOauth2.User} discordInfo 
     */
    constructor(socket, discordInfo){
        super(discordInfo)

        this.socket = socket
        this.socket.onAny((event, ...arg) => {
            if(typeof this[event] == "function"){
                try {
                    let res = this[event](...arg)
                    
                    if(res instanceof Promise)
                    res.then(data => this.socket.emit(event, data))
                    else
                    this.socket.emit(event, res)
                } catch (error) {
                    if(error instanceof ServerLauncherError){
                        this.socket.emit("error", error.message)
                    }else{
                        throw error
                    }
                }
            }
        })
    }

    /**
     * @param {Socket} socket 
     * @param {string} token 
     */
    static connection = (socket, token) => new Promise((resolve) => {
        oauth.getUser(token)
        .then((discordInfo) => {
            const user = new this(socket, discordInfo)
            
            const userDB = User.users.find(u => u.id == user.id)
            if(!userDB){
                User.pushUser(new User(discordInfo))
            }else{
                Object.assign(userDB, discordInfo)
            }
            
            socket.emit("log-in", true, discordInfo)
            resolve(user)
        })
        .catch(err => socket.emit("log-in", false))
    })
    
    getServerList = () => new Promise((resolve, reject) => {
        const serverPathNames = fs.readdirSync(serverDir)

        const servers = serverPathNames.map((serverPathName) => MinecraftServer.readFromPathName(serverPathName))
        const filterdServers = {
            public: servers.filter(server => server.config.permissions.all.view).map(server => server.vignette()),
            mine: servers.filter(server => server.config.owner == this.id).map(server => server.vignette()),
            sharedWithMe: servers.filter(server => this.getPermission("view", server)).map(server => server.vignette())
        }
        resolve(filterdServers)
    })

    /**
     * @param {string} pathName 
     */
    getServerVignette(pathName){
        return MinecraftServer.readFromPathName(pathName).vignette()
    }

    currentOnServer(){
        return null
    }
    
    changeServerIcon(serverPathName, iconData){
        let server = MinecraftServer.readFromPathName(serverPathName)
        return server.setIcon(iconData)
    }

    /**
     * @param {string} permission 
     * @param {MinecraftServer | string} server 
     * @returns 
     */
    getPermission(permission, server){
        if(typeof server == "string") server = MinecraftServer.readFromPathName(server)
        return server?.config.permissions[this.id]?.[permission]
    }

    /**
     * @param {MinecraftServer | string} server 
     * @returns 
     */
    getServerPermissions(server){
        if(typeof server == "string") server = MinecraftServer.readFromPathName(server)
        return server?.config.permissions
    }

    createServer(name, ){

    }
}