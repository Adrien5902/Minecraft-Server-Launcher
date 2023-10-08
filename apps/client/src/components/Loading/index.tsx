import { CSSProperties } from "react";

export default function Loading({style}: {style?: CSSProperties}){
    return <span className="tripledotloading" style={style}>Chargement</span>
}