import SidebarButton from './SidebarButton';
import './style.css'
import Loading from '../../Loading/index';
import { faPowerOff, faUserLock } from '@fortawesome/free-solid-svg-icons';

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
            icon={faPowerOff}
        />}

        {currentPermissions.edit_permissions && 
        <SidebarButton
            text="Permissions"
            to={managePath("perms")}
            icon={faUserLock}
        />}
        </>
        }
    </nav>
    );
}

export default Sidebar;