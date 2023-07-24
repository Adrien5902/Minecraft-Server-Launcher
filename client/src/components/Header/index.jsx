import './style.css'
import HeaderButton from './HeaderButton'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default function Header(){
    return (
    <header>
        <div>
            <img src="assets/mc-icon.webp" alt="" style={{height: "1.5em", margin: "4px"}}/>
            <span 
                style={{
                    fontFamily: "'Ubuntu', sans-serif",
                    fontSize: "100%"
                }}
            >Adrien5902 Minecraft server launcher</span>
        </div>

        <div>
            <HeaderButton
                color="white"
                icon={solid("list")}
                text="Liste des serveurs"
                to="/index.html"
            ></HeaderButton>

            <HeaderButton
                color="var(--accent)"
                icon={solid("plus")}
                text="Créer un serveur"
                to="/create-server"
            ></HeaderButton>

            <HeaderButton
                color="var(--secondary)"
                icon={solid("user")}
                text="Mon compte"
                to="/account"
            ></HeaderButton>
        </div>
    </header>
    )
}
