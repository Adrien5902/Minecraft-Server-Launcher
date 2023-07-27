//@ts-check
import fs from 'fs'
import {Socket} from "socket.io"
import {serverDir} from '../../config.js'
import {ServerLauncherError, errors} from '../errors.js'
import MinecraftServer from './MinecraftServer.js'
import mapObject, { formatSearch, oauth } from '../init.js'
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
                Object.assign(userDB, new User(discordInfo))
            }
            
            socket.emit("log-in", true, new User(discordInfo))
            resolve(user)
        })
        .catch(err => socket.emit("log-in", false))
    })
    
    getServerList = () => new Promise((resolve, reject) => {
        const serverPathNames = fs.readdirSync(serverDir)

        const servers = serverPathNames.map((serverPathName) => MinecraftServer.readFromPathName(serverPathName))
        const serverVignette = server => server.vignette()
        const filterdServers = {
            public: servers.filter(server => server.config.permissions.all.view && server.config.permissions?.[this.id]?.view !== false).map(serverVignette),
            mine: servers.filter(server => server.config.owner == this.id).map(serverVignette),
            sharedWithMe: servers.filter(server => server.config.permissions?.[this.id]?.view && server.config.owner != this.id).map(serverVignette)
        }
        resolve(filterdServers)
    })

    /**
     * @param {string | MinecraftServer} server 
     */
    getServerVignette(server){
        server = MinecraftServer.readFromPathName(server)
        return server.vignette()
    }

    currentOnServer(){
        return null
    }
    
    /**
     * @param {MinecraftServer | string} server 
     * @param {*} iconData 
     * @returns 
     */
    changeServerIcon(server, iconData){
        server = MinecraftServer.readFromPathName(server)

        this.checkForPermission(server, "edit_permissions")
        return server.setIcon(iconData)
    }

    /**
     * @param {MinecraftServer | string} server 
     */
    getServerPermissions(server){
        server = MinecraftServer.readFromPathName(server)
        return {
            //@ts-ignore
            defaultPermissions: server.constructor.permissions,
            permissions: server.config.permissions,
            users: Object.values(mapObject(server.config.permissions, (perms, userID)=>{
                if(userID == "all") return
                return User.getFromID(userID)
            })),
        }
    }

    /**
     * @param {MinecraftServer | string} server 
     * @param {*} permissions 
     */
    setServerPermissions(server, permissions){
        server = MinecraftServer.readFromPathName(server)
        this.checkForPermission(server, "edit_permissions")

        //@ts-ignore
        permissions.all.view ??= MinecraftServer.defaultPermissions.view
        delete permissions[server.config.owner ?? ""]
        server.config.permissions = permissions
        server.saveConfig()
        return null
    }
    
    /**
     * @param {string} permissionKey
     * @param {string | MinecraftServer} server
     */
    checkForPermission(server, permissionKey){
        if (!this.getUserServerPermission(server, permissionKey))
        throw errors.permission(permissionKey)
    }

    /**
     * @param {string} input 
     */
    searchUsers(input = ""){
        const formatedInput = formatSearch(String(input))
        if (!formatedInput) return []
        return User.users.filter(
            ({username, global_name}) => 
            formatSearch(username).includes(formatedInput)
            ||
            global_name ? formatSearch(global_name ?? "").includes(formatedInput) : null
        ).slice(0, 4)
    }

    createServer(name, ){

    }
}