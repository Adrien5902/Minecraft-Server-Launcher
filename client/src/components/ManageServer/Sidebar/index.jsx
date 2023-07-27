import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import SidebarButton from './SidebarButton.jsx';
import './style.css'
import Loading from '../../Loading/index.jsx';

function Sidebar({serverPathName, currentPermissions}) {
    function managePath(path){
        return `/manage-server/${path}?s=${serverPathName}`
    }

    return ( 
    <nav className="sidebar">
        {
        !currentPermissions ? <Loading/> :
        <>
        {currentPermissions?.view &&
        <SidebarButton
            text="Serveur"
            to={managePath("")}
            icon={solid("power-off")}
        />}

        {currentPermissions.edit_permissions && 
        <SidebarButton
            text="Permissions"
            to={managePath("perms")}
            icon={solid("user-lock")}
        />}
        </>
        }
    </nav>
    );
}

export default Sidebar;