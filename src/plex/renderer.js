const electron = window.require('electron');
const { ipcRenderer } = electron;
// const { ipcRenderer, contextBridge } = electron;

export default async function send(message) {
    return new Promise((resolve) => {
        ipcRenderer.once('asynchronous-reply', (_, arg) => {
            resolve(arg);
        });
        ipcRenderer.send('asynchronous-message', message);
    });
}

/*
// UPDATE Mam 2022:
(async () => {
    const result = await ipcRenderer.invoke('an-action', [1, 2, 3]);
    console.log(result); // prints "foo"
})();
*/
