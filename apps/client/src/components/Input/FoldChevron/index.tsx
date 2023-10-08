import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import './style.css'
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const FoldChevron = ({folded: defaultFolded = false, selector}) => {
    const [folded, setFolded] = useState(defaultFolded)

    useEffect(()=>{
        document.querySelector(selector)?.classList.toggle("folded", folded)
    }, [folded, selector])

    useEffect(()=>{
        document.querySelector(selector)?.classList.add("folding")
    }, [])

    function handleClick(){
        setFolded(!folded)
    }

    return ( 
        <div className="fold-chevron" onClick={handleClick} data-folded={String(folded)}>
            <FontAwesomeIcon icon={faChevronDown}/>
        </div>
    );
}

export default FoldChevron;