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
        fs.readdir(serverDir, null, (err, serverPathNames)=>{
            if(err){
                throw errors.serverDirNotFound
            }

            const servers = serverPathNames.map((serverPathName) =>
                MinecraftServer.readFromPathName(serverPathName).vignette()
            )

            resolve({
                public: servers.filter((server)=> server.visibility == "public"),
                mine: servers.filter((server)=> server.owner?.id == this.id),
                sharedWithMe: []//servers.filter((server)=> server.visibility == "public")
            })
        })
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

    hasPermission(pathName, permission){

    }
}