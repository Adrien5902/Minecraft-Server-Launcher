import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import SidebarButton from './SidebarButton.jsx';
import './style.css'

function Sidebar({setManageMenu, manageMenu}) {
    function button(text, menu, icon){
        const onClick = () => setManageMenu(menu)
        const selected = manageMenu == menu
        return <SidebarButton
            text={text}
            selected={selected}
            onClick={onClick}
            icon={icon}
        />
    }

    return ( 
    <nav className="sidebar">
        {button("Serveur", "display", solid("power-off"))}
        {button("Permissions", "perms", solid("user-lock"))}
    </nav>
    );
}

export default Sidebar;