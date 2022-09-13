const { ipcMain } = require('electron');
const sqlite3 = require('sqlite3');

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
