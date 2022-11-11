import * as MiscFunctions from '../../functions/miscFunctions.js'
import * as MiscIpfsFunctions from './miscIpfsFunctions.js'
import IpfsHttpClient from 'ipfs-http-client';

const jQuery = require("jquery");

export const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

export var gv = {};
gv.user = {};
gv.user.profile = async (cgid) => {
    var oProfile = {};
    oProfile.username = "JohnDoe"
    return oProfile;
}
