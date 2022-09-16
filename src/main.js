// const { ipcMain } = require('electron');
// added contextBridge, ipcRenderer 16 Sep 2022
const { ipcRenderer, ipcMain } = require('electron');
const sqlite3 = require('sqlite3');
// not sure if fs line should be here or not (added 16 Sep 2022)
// const fs = require('fs')

const database = new sqlite3.Database('./public/db.sqlite3', (err) => {
    if (err) console.error('Database opening error: ', err);
});

ipcMain.on('asynchronous-message', (event, arg) => {
    const sql = arg;
    database.all(sql, (err, rows) => {
        event.reply('asynchronous-reply', (err && err.message) || rows);
    });
});

/*
// added contextBridge on 16 Sep 2022
contextBridge.exposeInMainWorld('electron', {
  startDrag: (fileName) => {
    ipcRenderer.send('ondragstart', path.join(process.cwd(), fileName))
  }
})
*/
/*
// update May 2022:
const awaitableProcess = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

ipcMain.handle('an-action', async (event, arg) => {
    // do stuff
    await awaitableProcess();
    return "foo";
});
*/
