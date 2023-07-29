require('update-electron-app')()

const {domain} = require("../config")

const { app, BrowserWindow, dialog } = require('electron')
const { ipcMain } = require('electron');
const fs = require("fs")
const path = require("path")
const isDev = require("electron-is-dev")

const { io } = require('socket.io-client');
const Store = require("electron-store")
const store = new Store()

app.allowRendererProcessReuse = false;
app.getAppPath = () => process.cwd();

const socket = io(domain, {autoConnect: false});

ipcMain.on('request', (ipcEvent, event, ...args) => {
    socket.once(event, (...res)=>{
        if(!ipcEvent.sender.isDestroyed())
        ipcEvent.sender.send(event, ...res)
    })
    socket.emit(event, ...args)
});

ipcMain.on('emit', (ipcEvent, event, ...args) => {
    socket.emit(event, ...args)
});

ipcMain.on('listen', (ipcEvent, event) => {
    socket.on(event, (...data)=>{
        if(!ipcEvent.sender.isDestroyed())
        ipcEvent.sender.send(event, ...data)
    })
});

let currentWin
function createWindow (loadType, pathToLoad, nodeIntegration = false, size = {x: 800, y: 600}, frame = true) {
    let oldWin
    if(currentWin && !currentWin.isDestroyed()){
        oldWin = currentWin
    }
    
    const win = new BrowserWindow({
        width: size.x,
        height: size.y,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration,
            contextIsolation: !nodeIntegration
        },
        frame
    })

    oldWin?.close()
    currentWin = win

    win.setBackgroundColor("hsl(0 0% 8%)")

    if(loadType == "url"){
        win.loadURL(pathToLoad)
    }else if(loadType == "file"){
        win.loadFile(pathToLoad)
    }

    return win
}

/** @type {BrowserWindow | undefined} */
function connectionFailed() {
    let win = createWindow("file", isDev ? "./public/connection_failed.html" : path.join(__dirname, '../build', 'connection_failed.html'), true, {x: 340, y: 420}, false)
    win.setResizable(false)
    socket.once("connect", () => {
        openApp()
    });
}

ipcMain.on("retry", ()=>{
    authenticateSocket()
})
ipcMain.on("close", ()=>{
    if(!currentWin.isDestroyed())
    currentWin.close()
})

function createMainWin(){
    let mainWin = createWindow(
        isDev ? "url" : "file",
        isDev ? "http://localhost:3000/index.html" : path.join(__dirname, '../build'),
        true
    )

    mainWin.maximize()

    ipcMain.once('log-out', (ipcEvent) => {
        store.delete("discord-token")
        discordAuth()
    });
}

let userData
/**@type {BrowserWindow | undefined} */
function openApp(){
    socket.once("log-in", (ok, data) => {
        if(!ok){
            discordAuth()
            return
        }

        userData = data
        createMainWin()
    })
}

ipcMain.on("getUserData", (ipcEvent) => {
    ipcEvent.returnValue = userData
})

ipcMain.on("setSetting", (ipcEvent, setting, value)=>{
    store.set(setting, !!value)
    ipcEvent.returnValue = null
})
ipcMain.on("getSetting", (ipcEvent, setting)=>{
    ipcEvent.returnValue = store.get(setting) ?? false
})

ipcMain.on("openAFile", (ipcEvent, arg) => {
    arg = {
        properties: [
            "openFile"
        ], 
        ...arg
    }
    const filePathArr = dialog.showOpenDialogSync(arg)
    if(filePathArr){
        ipcEvent.returnValue = fs.readFileSync(filePathArr[0])
    }else{
        ipcEvent.returnValue = null
    }
})

const redirectUri = 'https://localhost/discord-auth';
const clientId = "1130980980136624128"

const oauthUrl = 
`https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`;

function discordAuth(){
    if(socket.connected) socket.disconnect()
    let authWin = createWindow("url", oauthUrl)
    authWin.maximize()
    authWin.webContents.on('will-navigate', (navigateEvent, redirectUrl) => {
        const urlParams = new URLSearchParams(new URL(redirectUrl).search);
        const code = urlParams.get('code');
            if (code) {
                socket.io.opts.query = { code };
                socket.connect()
                socket.once("connect_error", () => {
                    connectionFailed()
                });
                socket.once("discordToken", (newtoken)=>{
                    token = newtoken
                    socket.io.opts.query = { token };
                    store.set("discord-token", token)
                })
                openApp()
            }
    });
}

async function authenticateSocket() {
    if(socket.connected){
        createMainWin()
        return
    }

    let token = store.get("discord-token")

    if(!token){
        discordAuth()
    }else{
        socket.io.opts.query = { token };
        socket.connect();
        socket.once("connect_error", () => {
            connectionFailed()
        });
        openApp()
    }
}

app.whenReady().then(() => {
    authenticateSocket();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            authenticateSocket();
        }
    })
})

app.on("window-all-closed", () => {app.quit()})