import './style.css'
import HeaderButton from '../HeaderButton'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default function Header({displayPage, page}){
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
                href="server-list"
                displayPage={displayPage}
                page={page}
            ></HeaderButton>

            <HeaderButton
                color="var(--accent)"
                icon={solid("plus")}
                text="Créer un serveur"
                href="create-server"
                displayPage={displayPage}
                page={page}
            ></HeaderButton>

            <HeaderButton
                color="var(--secondary)"
                icon={solid("user")}
                text="Mon compte"
                href="account"
                displayPage={displayPage}
                page={page}
            ></HeaderButton>
        </div>
    </header>
    )
}
