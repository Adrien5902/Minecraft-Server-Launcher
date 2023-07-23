const {ipcRenderer} = window.require("electron")

export function request(event, cb, ...args){
    ipcRenderer.once(event, (ipcEvent, ...res)=>{
        if(typeof cb == "function") cb(...res)
    })
    ipcRenderer.send("request", event, ...args)
}

export function listen(event, cb){
    ipcRenderer.send("listen", event)
    ipcRenderer.on(event, (...data) => {
        if(typeof cb == "function") cb(...data)
    })
}