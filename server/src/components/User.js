//@ts-check
import fs from 'fs'
import MinecraftServer from './MinecraftServer.js';
import mapObject from '../init.js';

export default class User{
    /**
    * @param {{
    *    username :string
    *    discriminator :string
    *    id :string
    *    global_name :string | null
    *    avatar :string | null | undefined
    *    locale? :string
    * }} obj
    */
    constructor(obj){
        this.username = obj.username; 
        this.discriminator = obj.discriminator; 
        this.id = obj.id; 
        this.global_name = obj.global_name; 
        this.avatar = obj.avatar;
        this.locale = obj.locale
    }
    
    /** @type {User[]} */
    static #users = [];

    static async loadUsers() {
        try {
            const data = await fs.promises.readFile("users.json", "utf8");
            this.#users = JSON.parse(data);
        } catch (error) {
            if(error.errno == -4058){
                this.#users = [];
                fs.writeFileSync("users.json", JSON.stringify(this.#users))
            }else{
                console.error("Error loading users:", error);
            }
        }
    }

    static async saveUsers() {
        console.log("save")
        try {
            const data = JSON.stringify(this.#users, null, 4);
            await fs.promises.writeFile("users.json", data, "utf8");
        } catch (error) {
            console.error("Error saving users:", error);
        }
    }

    static get users() {
        return this.#users;
    }

    static set users(usersArray) {
        this.#users = usersArray;
        this.saveUsers();
    }
    
    /**
     * @param {User} user 
     */
    static pushUser(user) {
        this.#users.push(user);
        this.saveUsers();
    }

    static getFromID = (userID) => this.#users.find(user => user.id == userID)

    /**
     * @param {MinecraftServer | string} server 
     */
    getUserServerPermissions(server){
        if(typeof server == "string") server = MinecraftServer.readFromPathName(server)
        if(server.config.owner == this.id){
            return mapObject(MinecraftServer.defaultPermissions, () => true)
        }else{
            return server.config.permissions[this.id]
            ?? server.config.permissions.all
            ?? MinecraftServer.defaultPermissions
        }
    }

    /**
     * @param {MinecraftServer | string} server
     * @param {*} permission
     */
    getUserServerPermission(server, permission){
        if(typeof server == "string") server = MinecraftServer.readFromPathName(server)
        if(server.config.owner == this.id){
            return true
        }else{
            return server.config.permissions[this.id]?.[permission]
            ?? server.config.permissions.all?.[permission]
            ?? MinecraftServer.defaultPermissions[permission]
        }
    }
}

User.loadUsers();