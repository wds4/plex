import * as MiscFunctions from '../../functions/miscFunctions.js'
import * as MiscIpfsFunctions from './miscIpfsFunctions.js'
import * as ConceptGraphInMfsFunctions from './conceptGraphInMfsFunctions.js'
import IpfsHttpClient from 'ipfs-http-client';

const jQuery = require("jquery");

export const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

/*
// returns publically-viewable userProfile (so not dependent on any single concept graph)
export const returnUserProfileFromMfsByPeerID = async (peerID) => {
    var mfsPath = "/grapevineData/users/"+peerID+"/userProfile.txt"
    var oUserProfile = await cg.mfs.get(mfsPath);
    return oUserProfile;
}
*/

/*
export const fetchObjectByLocalMutableFileSystemPath = async (path) => {
    console.log("fetchObjectByLocalMutableFileSystemPath; path: "+path)
    // var chunks = []
    try {
        var chunks1 = []
        for await (const chunk of ipfs.files.read(path)) {
            // chunks.push(chunk)
            var sResult1 = new TextDecoder("utf-8").decode(chunk);
            chunks1.push(sResult1)
            // console.log("qwertyyy sResult: "+sResult)
        }
        var sResult = chunks1.join('')
        // need to add check to make sure sResult is in json format
        var oResult = JSON.parse(sResult)
        return oResult;
    } catch (e) {
        console.log("error: "+e)
        return false;
    }
}
*/

export var cg = {};

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

cg.ipfs = {};

// incomplete
// cg.ipfs.add replaces addDataToIPFS (from profileMainPage) and probably some other functions too
// TO DO: detect filetype of input file
// also look at options for filetype )
// if object, stringify
// ? allow options to alter stringify parameters (although probably would not use much)
cg.ipfs.add = async (file,oOptions) => {
    var fileType = "string" // default

    if (fileType=="string") {
        const ipfsHash = await ipfs.add(file);
        return ipfsHash.cid.toString();
    }
    return false;
}

// cg.ipfs.returnMyPeerID REPLACES: MiscIpfsFunctions.returnMyPeerID
cg.ipfs.returnMyPeerID = async (oOptions) => {
    var oIpfsID = await ipfs.id();
    var myPeerID = oIpfsID.id;
    // console.log("returnMyPeerID; myPeerID: "+myPeerID)
    return myPeerID
}

// cg.ipfs.returnMyUsername REPLACES: MiscIpfsFunctions.returnMyUsername
cg.ipfs.returnMyUsername = async (oOptions) => {
    var ipfsPath = "/grapevineData/userProfileData/myProfile.txt";
    var chunks = []
    try {
        for await (const chunk of ipfs.files.read(ipfsPath)) {
            var sResult1 = new TextDecoder("utf-8").decode(chunk);
            chunks.push(sResult1)
        }
        var sResult = chunks.join("")
        var oMyUserData = JSON.parse(sResult)
        if (typeof oMyUserData == "object") {
            var myUsername = oMyUserData.username;
            return myUsername;
        }
    } catch (e) {}
    return false;
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

cg.mfs = {};
// cg.mfs.ls REPLACES:
cg.mfs.ls = async (oOptions) => {
    var aResult = []
    console.log("cg.mfs.ls; incomplete")
    return aResult;
}
// cg.mfs.get REPLACES: ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath
cg.mfs.get = async (path,oOptions) => {
    var convertToObject = true; // by default
    if (oOptions) {
        if (oOptions.hasOwnProperty("convertToObject")) {
            convertToObject = oOptions.convertToObject;
        }
    }
    // console.log("conceptGraph.mfs.get; path: "+path)
    // var chunks = []
    try {
        var chunks1 = []
        for await (const chunk of ipfs.files.read(path)) {
            // chunks.push(chunk)
            var sResult1 = new TextDecoder("utf-8").decode(chunk);
            chunks1.push(sResult1)
            // console.log("qwertyyy sResult: "+sResult)
        }
        var sResult = chunks1.join('')
        if (convertToObject == true) {
            // need to add check to make sure sResult is in json format
            var oResult = JSON.parse(sResult)
            return oResult;
        }
        if (convertToObject == false) {
            return sResult;
        }
    } catch (e) {
        console.log("error: "+e)
        return false;
    }
}
cg.mfs.path = {};
// TO_DO: incomplete; address different inputCgidTypes
cg.mfs.path.get = async (cgid,oOptions) => {
    console.log("cg.mfs.path.get; cgid: "+cgid)
    // set defaults
    var cg_role = "active" // default concept graph role
    var inputCgidType = "slug"
    if (oOptions) {
        if (oOptions.hasOwnProperty("inputCgidType")) {
            inputCgidType = oOptions.inputCgidType;
        }
    }

    var baseDir10 = await cg.mfs.baseDirectory({slice10:true})
    console.log("cg.mfs.path.get; baseDir10: "+baseDir10)
    var cg_ipns = await cg.conceptGraph.resolve(cg_role)
    console.log("cg.mfs.path.get; cg_ipns: "+cg_ipns)

    if (inputCgidType=="slug") {
        var slug = cgid;
    }
    if (inputCgidType=="ipns") {
        // find slug from its ipns
    }

    var path = "/plex/conceptGraphs/"+baseDir10+"/"+cg_ipns+"/words/"+slug+"/node.txt";
    console.log("cg.mfs.path.get; path: "+path)
    return path;
}
// cg.mfs.baseDirectory() replaces ConceptGraphInMfsFunctions.returnIPNSForCompleteCGPathDir(keyname_forActiveCGPathDir)
// EXCEPT I am now doing the slice(-10) step in this function rather than after it
cg.mfs.baseDirectory = async (oOptions) => {
    var slice10 = false;
    if (oOptions) {
        if (oOptions.hasOwnProperty("slice10")) {
            slice10 = oOptions.slice10;
        }
    }
    // keyname generated from myPeerID like this:
    var myPeerID = await cg.ipfs.returnMyPeerID();
    console.log("cg.mfs.baseDirectory-- myPeerID: "+myPeerID)
    var keyname_forActiveCGPathDir = "plex_pathToActiveConceptGraph_"+myPeerID.slice(-10);

    var ipns_forActiveCGPathDir = null;
    var aKeys = await MiscIpfsFunctions.ipfs.key.list()
    console.log("cg.mfs.baseDirectory-- numKeys: "+aKeys.length)
    var foundMatch = false;
    for (var k=0;k<aKeys.length;k++) {
        var oNext = aKeys[k];
        var name = oNext.name;
        var ipfs = oNext.id;
        if (name==keyname_forActiveCGPathDir) {
            console.log("cg.mfs.baseDirectory -- match: oNext: "+JSON.stringify(oNext,null,4))
            foundMatch = true;
            ipns_forActiveCGPathDir = ipfs;
        }
    }
    if (!foundMatch) {
        var generatedKey_obj = await ipfs.key.gen(keyname_forActiveCGPathDir, {
            type: 'rsa',
            size: 2048
        })
        console.log("cg.mfs.baseDirectory -- make new key: generatedKey_obj: "+JSON.stringify(generatedKey_obj,null,4))
        var ipns_forActiveCGPathDir = generatedKey_obj["id"];
        var generatedKey_name = generatedKey_obj["name"];
    }
    if (slice10 == false) {
        return ipns_forActiveCGPathDir;
    }
    if (slice10 == true) {
        return ipns_forActiveCGPathDir.slice(-10);
    }
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

cg.cgid = {};
cg.cgids = {};
cg.cgids.ls = async (oOptions) => {
    var aResult = []
    console.log("cg.cgids.ls; incomplete")
    return aResult;
}
cg.cgid.resolve = async (cgid,oOptions) => {
    console.log("cg.cgid.resolve; cgid: "+cgid)
    var result = null
    // set defaults
    var cg_role = "active" // default concept graph role
    var cg_ipns = await cg.conceptGraph.resolve(cg_role)

    var inputCgidType = "slug";
    if (oOptions) {
        if (oOptions.hasOwnProperty("inputCgidType")) {
            inputCgidType = oOptions.inputCgidType
        }
    }
    var outputCgidType = "word";
    if (oOptions) {
        if (oOptions.hasOwnProperty("outputCgidType")) {
            outputCgidType = oOptions.outputCgidType
        }
    }
    if (inputCgidType=="slug") {
        console.log("cg.cgid.resolve; inputCgidType == slug")
        var slug = cgid;
        var path = await cg.mfs.path.get(slug);
        var oWord = await cg.mfs.get(path)
        if (outputCgidType == "word") {
            result = oWord;
            return result;
        }

    }
    if (inputCgidType=="ipns") {

    }

    console.log("cg.cgid.resolve; incomplete")
    return result;
}
cg.cgid.type = {};
cg.cgid.type.resolve = async (cgid,oOptions) => {
    var result = null
    console.log("cg.cgid.type.resolve; incomplete")
    return result;
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

cg.conceptGraph = {}
cg.conceptGraphs = {}
cg.conceptGraph.role = {};
cg.conceptGraphs.roles = {};
cg.conceptGraphs.roles.reload = async (oOptions) => {
    // below: copied from ConceptGraphMfsFunctions.loadActiveIpfsConceptGraph
    // Need to clean this up as library / API gets fleshed out.
    // var oIpfsID = await ipfs.id();
    // var myPeerID = oIpfsID.id;

    // var myPeerID = cg.ipfs.returnMyPeerID();

    // var keyname_forActiveCGPathDir = "plex_pathToActiveConceptGraph_"+myPeerID.slice(-10);
    // var ipns_forActiveCGPathDir = await ConceptGraphInMfsFunctions.returnIPNSForCompleteCGPathDir(keyname_forActiveCGPathDir)
    // var ipns10_forActiveCGPathDir = ipns_forActiveCGPathDir.slice(-10);
    var ipns10_forActiveCGPathDir = await cg.mfs.baseDirectory({slice10:true});
    var pCGb = "/plex/conceptGraphs/" + ipns10_forActiveCGPathDir + "/";
    // var pCGs = "/plex/conceptGraphs/"+ipns10_forActiveCGPathDir+"/mainSchemaForConceptGraph/node.txt"
    var pCGs = pCGb + "mainSchemaForConceptGraph/node.txt"
    var oMainSchemaForConceptGraphLocal = await cg.mfs.get(pCGs)
    var mainSchema_local_ipns = oMainSchemaForConceptGraphLocal.metaData.ipns;
    // var pCG0 = "/plex/conceptGraphs/"+ipns10_forActiveCGPathDir+"/"+mainSchema_local_ipns+"/";
    var pCG0 = pCGb + mainSchema_local_ipns+"/";
    var pCGw = pCG0 + "words/";
    var pCGd = pCGb + "conceptGraphsDirectory/node.txt"
    var oConceptGraphsDirectory = await cg.mfs.get(pCGd)

    var neuroCore3Engine_cgSlug = oConceptGraphsDirectory.conceptGraphsDirectoryData.specialRoles.neuroCore3Engine;
    var neuroCore3Subject_cgSlug = oConceptGraphsDirectory.conceptGraphsDirectoryData.specialRoles.neuroCore3Subject;
    var aLocalConceptGraphs = oConceptGraphsDirectory.conceptGraphsDirectoryData.localConceptGraphs

    var viewing_cgSlug = oConceptGraphsDirectory.conceptGraphsDirectoryData.specialRoles.oViewing.conceptGraph;
    var viewing_conceptSlug = oConceptGraphsDirectory.conceptGraphsDirectoryData.specialRoles.oViewing.concept;
    window.frontEndConceptGraph.viewingConceptGraph.slug = viewing_cgSlug;
    window.frontEndConceptGraph.viewingConcept.slug = viewing_conceptSlug;
    var aActive = oConceptGraphsDirectory.conceptGraphsDirectoryData.specialRoles.active;

    for (var a=0;a<aLocalConceptGraphs.length;a++) {
        var oCG = aLocalConceptGraphs[a];
        var cgSlug = oCG.conceptGraphSlug
        var cgTitle = oCG.conceptGraphTitle
        var ipns = oCG.ipns
        if (cgSlug==neuroCore3Engine_cgSlug) {
            var mainSchema_ncEngine_ipns = ipns
            window.frontEndConceptGraph.neuroCore.engine.ipnsForMainSchemaForConceptGraph = ipns;
            window.frontEndConceptGraph.neuroCore.engine.title = cgTitle;
            window.frontEndConceptGraph.neuroCore.engine.slug = cgSlug;
        }
        if (cgSlug==neuroCore3Subject_cgSlug) {
            var mainSchema_ncSubject_ipns = ipns
            window.frontEndConceptGraph.neuroCore.subject.ipnsForMainSchemaForConceptGraph = ipns
            window.frontEndConceptGraph.neuroCore.subject.title = cgTitle;
            window.frontEndConceptGraph.neuroCore.subject.slug = cgSlug;
        }
        if (cgSlug==viewing_cgSlug) {
            window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph = ipns
            window.frontEndConceptGraph.viewingConceptGraph.title = cgTitle;
            window.frontEndConceptGraph.viewingConceptGraph.slug = cgSlug;
            var viewingConceptGraph_ipns = ipns;
        }
        if (aActive.includes(cgSlug)) {
            console.log("window.frontEndConceptGraph.activeConceptGraph.ipnsForMainSchemaForConceptGraph = ipns: "+ipns)
            window.frontEndConceptGraph.activeConceptGraph.ipnsForMainSchemaForConceptGraph = ipns
            window.frontEndConceptGraph.activeConceptGraph.title = cgTitle;
            window.frontEndConceptGraph.activeConceptGraph.slug = cgSlug;
        }
    }
}

// maybe change to cg.conceptGraph.role.resolve for clarity
// although not sure what else cg.conceptGraph.resolve could mean
cg.conceptGraph.resolve = async (role, oOptions) => {
    console.log("cg.conceptGraph.resolve; role: "+role)
    // default options:
    var outputCgidType = "ipns" // by default
    var reload = false // by default

    if (oOptions) {
        if (oOptions.outputCgidType) {
            outputCgidType = oOptions.outputCgidType;
        }
        if (oOptions.reload) {
            reload = oOptions.reload;
        }
    }
    // add code to set reload to true if DOM records have not yet been set

    if (reload == true) {
        await cg.conceptGraphs.roles.reload();
    }

    if (outputCgidType=="ipns") {
        if (role=="active") {
            return window.frontEndConceptGraph.activeConceptGraph.ipnsForMainSchemaForConceptGraph;
        }
        if (role=="neuroCore-engine") {
            return window.frontEndConceptGraph.neuroCore.engine.ipnsForMainSchemaForConceptGraph;
        }
        if (role=="neuroCore-subject") {
            return window.frontEndConceptGraph.neuroCore.subject.ipnsForMainSchemaForConceptGraph;
        }
        if (role=="currently-viewing") {
            return window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
        }
    }
    if (outputCgidType=="slug") {
        if (role=="active") {
            return window.frontEndConceptGraph.activeConceptGraph.slug;
        }
        if (role=="neuroCore-engine") {
            return window.frontEndConceptGraph.neuroCore.engine.slug;
        }
        if (role=="neuroCore-subject") {
            return window.frontEndConceptGraph.neuroCore.subject.slug;
        }
        if (role=="currently-viewing") {
            return window.frontEndConceptGraph.viewingConceptGraph.slug;
        }
    }
    // need to complete other options for outputCgidType

    // if nothing has been returned so far, then by default return viewingConceptGraph_ipns
    // may change this to activeConceptGraph_ipns or to error ?
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph
    var result = viewingConceptGraph_ipns;

    return result;
}
cg.resolve = async (role, oOptions) => {
    return "blah from cg.resolve";
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

cg.word = {};
// cg.word.create replaces MiscFunctions.createNewWordByTemplate()
cg.word.create = async (wordType, oOptions) => {
    // return "blah from conceptGraph.resolve";
    // console.log("createNewWordByTemplate; newWordType: "+newWordType)
    // var oFoo = window.lookupWordTypeTemplate[newWordType];
    // console.log("createNewWordByTemplate; oFoo: "+JSON.stringify(oFoo,null,4))
    var newWord_obj = MiscFunctions.cloneObj(window.lookupWordTypeTemplate[wordType]);

    // var myConceptGraph = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName;
    var myConceptGraph = cg.conceptGraph.resolve("active",{outputCgidType:"slug"})
    newWord_obj.globalDynamicData.myConceptGraphs.push(myConceptGraph);

    var randomNonce = Math.floor(Math.random() * 1000);
    var currentTime = Date.now();
    var newKeyname = "plexWord_"+wordType+"_"+currentTime+"_"+randomNonce;
    var generatedKey_obj = await ipfs.key.gen(newKeyname, {
        type: 'rsa',
        size: 2048
    })
    var newWord_ipns = generatedKey_obj["id"];
    var generatedKey_name = generatedKey_obj["name"];
    // console.log("generatedKey_obj id: "+newWord_ipns+"; name: "+generatedKey_name);
    newWord_obj.metaData.ipns = newWord_ipns;
    newWord_obj.metaData.keyname = newKeyname;

    var newWord_slug = wordType+"_"+newWord_ipns.slice(newWord_ipns.length-6);
    newWord_obj.wordData.slug = newWord_slug;

    return newWord_obj;
}
