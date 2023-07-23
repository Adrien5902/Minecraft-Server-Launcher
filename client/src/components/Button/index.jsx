import "./style.css"

export default function Button({text, onClick, className, color="var(--primary)", textColor="var(--text)"}){
    return (
    <button
        style={{
            "--color": color,
            "--textColor": textColor
        }}
        onClick={onClick}
        className={className}
    >
        {text}
    </button>
    )
}