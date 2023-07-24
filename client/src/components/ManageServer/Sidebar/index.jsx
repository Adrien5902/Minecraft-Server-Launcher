import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import SidebarButton from './SidebarButton.jsx';
import './style.css'

function Sidebar({serverPathName}) {
    function managePath(path){
        return `/manage-server/${path}?s=${serverPathName}`
    }
    
    return ( 
    <nav className="sidebar">
        <SidebarButton
            text="Serveur"
            to={managePath("")}
            icon={solid("power-off")}
        />

        <SidebarButton
            text="Permissions"
            to={managePath("perms")}
            icon={solid("user-lock")}
        />
    </nav>
    );
}

export default Sidebar;