import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import './style.css'

function FoldChevron({folded: defaultFolded = false, selector}) {
    const [folded, setFolded] = useState(defaultFolded)

    useEffect(()=>{
        document.querySelector(selector).classList.toggle("folded", folded)
    }, [folded, selector])

    useEffect(()=>{
        document.querySelector(selector).classList.add("folding")
    }, [])

    function handleClick(){
        setFolded(!folded)
    }

    return ( 
        <div className="fold-chevron" onClick={handleClick} folded={String(folded)}>
            <FontAwesomeIcon icon={solid("chevron-down")}/>
        </div>
    );
}

export default FoldChevron;