const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
require('electron-reload')(__dirname)
require('dotenv').config()

let mainWindow
let workerWindow
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/getNum/index.html`)
  // mainWindow.loadURL('https://qmstest.digihcs.com/')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  workerWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			worldSafeExecuteJavaScript: true,
			// preload: __dirname + '/preload.js'
		}
	});
	workerWindow.loadURL(`file://${__dirname}/getNum/worker.html`)
	workerWindow.hide()
	// workerWindow.webContents.openDevTools();
	workerWindow.on('closed', () => {
		workerWindow = undefined
	})
}

ipcMain.on('print', (event, content) => {
	if (workerWindow) {
		workerWindow.webContents.send('print', content)
	}
})
ipcMain.on('readyToPrint', (event) => {
	if (workerWindow) {
		workerWindow.webContents.print({
      silent: false,
      printBackground: true
    })
	}
})

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})