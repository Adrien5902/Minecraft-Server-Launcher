import './style.css'
import HeaderButton from './HeaderButton'
import { faList, faPlus, faUser } from '@fortawesome/free-solid-svg-icons'

export default function Header(){
    return (
    <header>
        <div>
            <img src="/assets/mc-icon.webp" alt="" style={{height: "1.5em", margin: "4px"}}/>
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
                icon={faList}
                text="Liste des serveurs"
                to="/"
            ></HeaderButton>

            <HeaderButton
                color="var(--accent)"
                icon={faPlus}
                text="Créer un serveur"
                to="/create-server"
            ></HeaderButton>

            <HeaderButton
                color="var(--secondary)"
                icon={faUser}
                text="Mon compte"
                to="/account"
            ></HeaderButton>
        </div>
    </header>
    )
}
