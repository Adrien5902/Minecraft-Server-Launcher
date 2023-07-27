import { useEffect, useState } from 'react';
import Button from '../Input/Button';
import './style.css'

function ConfirmSave({onConfirm, onCancel}) {
    const handleACLick = (e) => {
        if (document.querySelector(".confirm-save")) e.preventDefault()
        
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

    useEffect(()=>{
        remove()
        document.querySelectorAll("a").forEach(a => {
            a.addEventListener("click", handleACLick)
        })
    }, [])

    function remove(){
        document.querySelectorAll("a").forEach(a => {
            a.removeEventListener("click", handleACLick)
        })
    }

    return ( 
        <div className="confirm-save">
            <span>Sauvergarder les modifications ?</span>
            <div className='confirm-save-buttons'>
                <Button
                    fancy={false}
                    text="Annuler"
                    color='var(--background)'
                    onClick={()=>{
                        remove()
                        onCancel()
                    }}
                />
                <Button
                    color='lime'
                    fancy={false}
                    text="Sauvegarder"
                    textColor='white'
                    onClick={()=>{
                        remove()
                        onConfirm()
                    }}
                />
            </div>
        </div>
    );
}

export default ConfirmSave;