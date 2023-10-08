const {ipcRenderer} = window.require("electron")

export function request(event: string, cb: (...res: any) => void, ...args: any){
    ipcRenderer.once(event, (_ipcEvent, ...res: any)=>{
        if(typeof cb == "function") cb(...res)
    })
    ipcRenderer.send("request", event, ...args)
}

export function emit(event: string, ...args: any){
    ipcRenderer.send("emit", event, ...args)
}

export function listen(event: string, cb: (...data: any) => void){
    ipcRenderer.send("listen", event)
    ipcRenderer.on(event, (...data: any) => {
        if(typeof cb == "function") cb(...data)
    })
}

export function formatSearch(text: string){
    return text.toLowerCase().replaceAll(" ", "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}