import * as MiscFunctions from '../../functions/miscFunctions.js'
import * as MiscIpfsFunctions from './miscIpfsFunctions.js'
import * as ConceptGraphLib from './conceptGraphLib.js'
import IpfsHttpClient from 'ipfs-http-client';

const cg = ConceptGraphLib.cg;

const jQuery = require("jquery");

export const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

export var gv = {};
gv.user = {};
gv.users = {};
gv.user.trust = {};
gv.users.ls = async (oOptions) => {
    // default options
    var cg_role = "grapevine" // default concept graph role
    var cg_ipns = await cg.conceptGraph.resolve(cg_role)

    var oProfile = {};
    oProfile.username = "JohnDoe"
    return oProfile;
}
gv.user.profile = async (cgid,oOptions) => {
    // default options
    var cg_role = "grapevine" // default concept graph role
    var cg_ipns = await cg.conceptGraph.resolve(cg_role)

    var oProfile = {};
    oProfile.username = "JohnDoe"
    return oProfile;
}
gv.user.trust.get = async (cgid,oOptions) => {
    // default options
    var cg_role = "grapevine" // default concept graph role
    var cg_ipns = await cg.conceptGraph.resolve(cg_role)
    console.log("gv.user.trust.get; cg_ipns: "+cg_ipns)

    var result = null;
    return result;
}
