import sendAsync from '../../renderer.js';

export const send = (sql) => {
    console.log("send; sql: "+sql)
    sendAsync(sql).then((result) => this.setResponse({response: result}) );
}
