import { useEffect, useState } from 'react';
import Button from '../Input/Button';
import './style.css'

function ConfirmSave({onConfirm, onCancel, displayed: d}) {
    const [displayed, setDisplayed] = useState(d)

    useEffect(()=>{
        setDisplayed(d)
    }, [d])

    const handleACLick = (e) => {
        if (document.querySelector('.confirm-save[displayed="true"]')){
            e.preventDefault()
        
            document.querySelectorAll(".confirm-save").forEach(confirmSave => {
                confirmSave.animate([
                    {transform: "translateX(0)"},
                    {background: "red", transform: "translateX(.7em)"},
                    {transform: "translateX(-.7em)"},
                    {transform: "translateX(.7em)"},
                    {background: "red", transform: "translateX(-.7em)"},
                    {transform: "translateX(0)"},
                ], {duration: 350})
            })
        }
    }

    function add(){
        document.querySelectorAll("a").forEach(a => {
            a.addEventListener("click", handleACLick)
        })
    }

    function remove(){
        document.querySelectorAll("a").forEach(a => {
            a.removeEventListener("click", handleACLick)
        })
    }

    return ( 
        <div className="confirm-save" displayed={String(displayed)}>
            {displayed ? add() : remove()}
            <span>Sauvergarder les modifications ?</span>
            <div className='confirm-save-buttons'>
                <Button
                    fancy={false}
                    text="Annuler"
                    color='var(--background)'
                    onClick={()=>{
                        onCancel()
                    }}
                />
                <Button
                    color='lime'
                    fancy={false}
                    text="Sauvegarder"
                    textColor='white'
                    onClick={()=>{
                        onConfirm()
                    }}
                />
            </div>
        </div>
    );
}

export default ConfirmSave;