import TypeEditatble from "./TypeEditatble.js";

export default class Permission extends TypeEditatble{
    constructor(name, defaultValue, type){
        super(name, defaultValue, type)
    }
}