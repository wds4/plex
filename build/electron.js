const path = require('path');
// here, do this:
// const fs = require('fs');
// elsewhere, do this:
// const fs = window.require('fs');

const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');

require('../src/main');
/*
// this works (assume also have: const fs = require('fs'); above )
// elesewhere, do
let data = "This is a file containing a collection of books.";

fs.writeFile("src/plex/neuroCore/neuroCoreFunctions/books.txt", data, (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
    console.log("The written has the following contents:");
    // console.log(fs.readFileSync("books.txt", "utf8"));
  }
});
*/

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1800,
    height: 1100,
    webPreferences: {
      nodeIntegration: true, //
      contextIsolation: false, // must do these (nodeIntegration and contextIsolation flags) otherwise require is not recognized in the main process
      preload: path.join(__dirname, 'js/preload.js')
      // preload: 'js/preload.js'
    }
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
