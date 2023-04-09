const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron');
const { Client, Authenticator } = require('minecraft-launcher-core');
const launcher = new Client();
ipcMain.on('launch-minecraft', (event,data) => {

    console.log('[LAUNCHER] Version : '+data.version+" Username : "+data.username)
    let version_id = data.version.split('-')[1]
    let version_type = data.version.split('-')[0]
    let opts = {
        authorization: Authenticator.getAuth(data.username),
        root: "./minecraft",
        version: {
            number: version_id,
            type: version_type
        },
        memory: {
            max: "1G",
            min: "1G"
        },
    }
    launcher.launch(opts);

    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));
});
let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 900,
        height: 900,
        autoHideMenuBar:true,
        webPreferences: {
            nodeIntegration: true, 
            contextIsolation: false
            
        }
    })

    mainWindow.loadFile('index.html')

    
    mainWindow.on('closed', function() {
        mainWindow = null
    })
}

app.on('ready', function() {
    createWindow()
})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow()
    }
})