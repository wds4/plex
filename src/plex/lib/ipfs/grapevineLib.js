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

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
gv.compositeScores = {};
gv.compositeScore = {};
gv.compositeScore.get = async (cgid,oOptions) => {
    var peerID = cgid; // default for now; need to check for other possibilities, e.g. for cgid to be a username (but would not be unique ?)
    console.log("gv.compositeScore.get; peerID: "+peerID)
    // default options
    // TO_DO: autodetermine many of these based on analysis of cgid
    var cg_role = "active" // default concept graph role; maybe switch this to grapevine?
    var cg_ipns = await cg.conceptGraph.resolve(cg_role)
    console.log("gv.compositeScore.get; cg_ipns: "+cg_ipns)
    var sourceType = "multiSpecificInstance"
    var multiSpecificInstances_slug = "userTrustCompositeScore_multiSpecificInstance_superset";
    var entityType = "user"

    // currently this obtains scores by looking for this file; future: other sourceTypes, e.g. .csv files or ? individual specific instances of compositeScores
    var oMultiSpecificInstances = await cg.cgid.resolve(multiSpecificInstances_slug,{inputCgidType:"slug"})

    console.log("gv.compositeScore.get; oMultiSpecificInstances: "+JSON.stringify(oMultiSpecificInstances,null,4))

    var aUTCS = oMultiSpecificInstances.aUserTrustCompositeScoreData
    for (var u=0;u<aUTCS.length;u++) {
        var oUserScoreData = aUTCS[u];
        console.log("oUserScoreData: "+JSON.stringify(oUserScoreData,null,4))
        var pID = oUserScoreData.peerID;
        console.log("gv.compositeScore.get; pID: "+pID)
        if (pID == peerID) {
            var oCSD = oUserScoreData.compositeScoreData;
            return oCSD;
        }
    }

    var result = null;
    return result;
}
