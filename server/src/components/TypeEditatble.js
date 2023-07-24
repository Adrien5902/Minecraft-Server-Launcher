export default class TypeEditatble{
    constructor(name, defaultValue){
        this.name = name
        this.value = defaultValue
        this.type = typeof this.value
    }
}