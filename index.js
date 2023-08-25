const { app, BrowserWindow,ipcMain } = require('electron')
const { Client, Authenticator } = require('minecraft-launcher-core');
const launcher = new Client();
function getAppDataPath() {
    if (process.platform === 'win32') {
      return process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
    } else if (process.platform === 'linux' || process.platform === 'darwin') {
      return path.join(os.homedir());
    } else {
      throw new Error(`Unsupported platform: ${process.platform}`);
    }
  }
ipcMain.on('launch-minecraft', (event,data) => {

    console.log('[LAUNCHER] Version : '+data.version+" Username : "+data.username)
    let version_id = data.version.split('-')[1]
    let version_type = data.version.split('-')[0]
    let opts = {
        authorization: Authenticator.getAuth(data.username),
        root: `${getAppDataPath()}/.minecraft`,
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
        width: 1406,
        height: 803,
        webPreferences: {
            nodeIntegration: true, 
            contextIsolation: false,
            enableRemoteModule: true,
            frame:true,
            enableRemoteModule:true,
            devTools: false
        }
    })
    mainWindow.removeMenu()
    mainWindow.loadFile('login.html')
    
    
    mainWindow.on('closed', function() {
        mainWindow = null
    })
    ipcMain.on('minimize', () => {
        mainWindow.minimize()
      })
      ipcMain.on('maximize', () => {
        mainWindow.maximize()
      })
      ipcMain.on('unmaximize', () => {
        mainWindow.unmaximize()
      })
      ipcMain.on('close', () => {
        app.quit()
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
