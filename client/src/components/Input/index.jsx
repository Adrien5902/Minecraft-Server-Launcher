import { useEffect, useState } from "react";
import Switch from "./Switch";
import './style.css'

function Input({type, label, value: defaultValue, autoUpdate = false, onChange = ()=>{}, properties}) {
    const [value, setValue] = useState(defaultValue)

    function updateValue(newValue){
        if(autoUpdate) setValue(newValue)
        onChange(newValue)
    }

    useEffect(()=>{
        setValue(defaultValue)
    }, [defaultValue])

    type = type ?? typeof value
    function getInput(){
        switch (type) {
            case "boolean":
                return <Switch value={value} updateValue={updateValue} onChange={onChange} properties={properties}/>
            default:
                return <input type="text" value={value ?? ""} placeholder={properties?.placeholder} onChange={(e)=>{setValue(e.target.value); onChange(e.target.value)}}/>
        }
    }

    return <div className="input" type={type}>
        {label ? <label>{label}</label> : ""}
        {getInput()}
    </div>
}

export default Input;