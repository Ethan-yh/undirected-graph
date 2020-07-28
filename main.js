// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const prim = require('./main/prim')
const kruskal = require('./main/kruskal')
const dijkstra = require('./main/dijkstra')
const floyd = require('./main/floyd')


function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('getMstByPrim', (event, arg) => {
    var mst = prim.prim(arg);
    console.log(arg)
    event.sender.send('replyMst', mst);
})

ipcMain.on('getMstByKruskal', (event, arg) => {
    var mst = kruskal.kruskal(arg);
    console.log(arg)
    event.sender.send('replyMst', mst);
})

ipcMain.on('getSingleSource', (event, arg) => {
    var paths = dijkstra.dijkstra(arg.source, arg.adjMatrix);
    event.sender.send('replySingleSource', paths);
})

ipcMain.on('getMultiSource', (event, arg) => {
    var paths = floyd.floyd(arg);
    event.sender.send('replyMultiSource', paths);
})