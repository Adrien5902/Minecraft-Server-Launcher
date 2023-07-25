import "./style.css"

export default function Button({fancy = true, text, onClick, color="var(--primary)", textColor="var(--text)"}){
    return (
    <button
        style={{
            "--color": color,
            "--textColor": textColor
        }}
        onClick={onClick}
        className={fancy ? "fancy" : ""}
    >
        {text}
    </button>
    )
}