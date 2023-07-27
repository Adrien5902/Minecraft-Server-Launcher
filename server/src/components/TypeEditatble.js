export default class TypeEditatble{
    constructor(name, defaultValue, type = null){
        this.name = name
        this.value = defaultValue
        this.type = type ?? typeof this.value
    }
}