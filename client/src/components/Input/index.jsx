import Switch from "./Switch";
import './style.css'

function Input({type, label, inputName, defaultValue, autoUpdate = false, onChange, properties}) {
    function getInput(){
        switch (type) {
            case "switch":
                return <Switch name={inputName} defaultValue={defaultValue} autoUpdate={autoUpdate} onChange={onChange} properties={properties}/>
            default:
                return <input type="text"/>
        }
    }

    return <div className="input" type={type}>
        <label>{label}</label>
        {getInput()}
    </div>
}

export default Input;