import { serverDir } from "../config.js"
import MinecraftServer from "./components/MinecraftServer.js"

export class ServerLauncherError extends Error{
    constructor(message){
        super(message)
    }
}

export class ServerLauncherPathError extends ServerLauncherError{
    constructor(path, message){
        super(message + " Vérifiez l'emplacement '" + path + "'")
    }
}

export class PermissionServerLauncherError extends ServerLauncherError{
    constructor(permissionKey){
        const permissionName = MinecraftServer.permissions[permissionKey].name
        super("Vous devez avoir la permission : " + permissionName)
    }
}

export const errors = {
    permission: (permissionKey) => new PermissionServerLauncherError(permissionKey),
    serverDoesNotExist: (path) => new ServerLauncherPathError(path, "Le serveur n'existe pas !"),
    serverDirNotFound: new ServerLauncherError(serverDir, "Emplacement des serveurs introuvable, vérifiez le fichier config.js")
}