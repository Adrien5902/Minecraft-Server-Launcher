//@ts-check
import fs from 'fs'

export default class User{
    /**
     * @param {{
    *    username :string
    *    discriminator :string
    *    id :string
    *    global_name :string | null
    *    avatar :string | null | undefined
     * }} obj
     */
    constructor(obj){
        this.username = obj.username; 
        this.discriminator = obj.discriminator; 
        this.id = obj.id; 
        this.global_name = obj.global_name; 
        this.avatar = obj.avatar;
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
}

User.loadUsers();