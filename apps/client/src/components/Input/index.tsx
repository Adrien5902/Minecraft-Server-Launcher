import { useEffect, useState } from "react";
import Switch from "./Switch";
import './style.css'

interface Props{
    type?: string
    label: string | JSX.Element
    value: any
    autoUpdate?: boolean
    onChange: (newValue: any) => unknown
    properties?: any
    index?: number
    id?: string
    className?: string
}

function Input({className, id, type, label, value: defaultValue, autoUpdate = false, onChange, properties}: Props) {
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

    return <div className={"input" + (className ? className : "")} id={id} data-type={type}>
        {label ? <label>{label}</label> : ""}
        {getInput()}
    </div>
}

export default Input;