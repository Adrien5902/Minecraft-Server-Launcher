import { useEffect, useRef, useState } from 'react';
import Button from '../Input/Button';
import './style.css'

function ConfirmSave({onConfirm, onCancel, displayed: d}) {
    const [displayed, setDisplayed] = useState(d)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        setDisplayed(d)
    }, [d])

    const handleACLick = (e) => {
        if (ref.current.getAttribute("data-displayed") == "true"){
            e.preventDefault()
        
            ref.current.animate(
                [
                    {transform: "translateX(0)"},
                    {background: "red", transform: "translateX(.7em)"},
                    {transform: "translateX(-.7em)"},
                    {transform: "translateX(.7em)"},
                    {background: "red", transform: "translateX(-.7em)"},
                    {transform: "translateX(0)"},
                ], 
                {duration: 350}
            )
        }
    }

    function lockLinks(){
        document.querySelectorAll("a").forEach(a => {
            a.addEventListener("click", handleACLick)
        })
    }

    function unlockLinks(){
        document.querySelectorAll("a").forEach(a => {
            a.removeEventListener("click", handleACLick)
        })
    }

    useEffect(() => {
        lockLinks()
        return () => {
            unlockLinks()
        }
    })

    return (
        <div ref={ref} className="confirm-save" data-displayed={String(displayed)}>
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