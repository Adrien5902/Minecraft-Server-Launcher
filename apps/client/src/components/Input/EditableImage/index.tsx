import { useEffect, useState } from "react"
import './style.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotateRight, faSquarePen } from "@fortawesome/free-solid-svg-icons"

const {ipcRenderer} = window.require("electron")

function EditableImage({editable = true, src, autoUpdate = false, onChange, supportedFormats = ['png', 'jpeg', 'jpg']}) {
    const [currentSrc, setSrc] = useState(src)
    const [reloading, setReloading] = useState(false)
    
    function changeSrc(src){
        setReloading(false)
        setSrc(src)
    }

    useEffect(()=>{
        changeSrc(src)
    }, [src])

    function handleClick(){
        if(!editable) return
        const iconBuffer = ipcRenderer.sendSync("openAFile", {
            filters:[{name: 'Images', extensions: supportedFormats }]
        })

        if(iconBuffer){
            if(onChange) onChange(iconBuffer)

            if(autoUpdate){
                setReloading(true)
                const blob = new Blob([iconBuffer], { type: 'image/jpeg' });
                const reader = new FileReader();
                reader.onload = function () {
                    changeSrc(reader.result)
                };
                reader.readAsDataURL(blob);
            }else{
                setReloading(true)
            }
        }
    }

    return ( 
    <div className="editable-image centered-flex" onClick={handleClick} data-editable={String(editable)}>
        <div className="editable-image-container centered-flex">
            {reloading ? 
                <FontAwesomeIcon icon={faRotateRight} className="editable-image-reload"/>
                : 
                <img src={currentSrc}/>
            }
        </div>
        <FontAwesomeIcon className="editable-image-pen" icon={faSquarePen}/>
    </div> 
    );
}

export default EditableImage;