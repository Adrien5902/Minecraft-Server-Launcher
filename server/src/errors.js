import { serverDir } from "../config.js"

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

export const errors = {
    serverDoesNotExist: (path) => new ServerLauncherPathError(path, "Le serveur n'existe pas !"),
    serverDirNotFound: new ServerLauncherError(serverDir, "Emplacement des serveurs introuvable, vérifiez le fichier config.js")
}