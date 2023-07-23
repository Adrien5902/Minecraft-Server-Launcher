import { useState } from "react"
import './style.css'

const {ipcRenderer} = window.require("electron")
const fs = window.require("fs")

function EditableImage({src, autoUpdate = false, onChange, supportedFormats = ['png', 'jpeg', 'jpg']}) {
    const [currentSrc, setSrc] = useState(src)

    function handleClick(){
        const iconBuffer = ipcRenderer.sendSync("openAFile", {
            filters:[{name: 'Images', extensions: supportedFormats }]
        })

        if(iconBuffer){
            if(onChange) onChange(iconBuffer)

            if(autoUpdate){
                const blob = new Blob([iconBuffer], { type: 'image/jpeg' });
                const reader = new FileReader();
                reader.onload = function () {
                    setSrc(reader.result)
                };
                reader.readAsDataURL(blob);
            }
        }
    }

    return ( 
    <div className="editable-image" onClick={handleClick}>
        <img src={autoUpdate ? currentSrc: src}/>
    </div> 
    );
}

export default EditableImage;