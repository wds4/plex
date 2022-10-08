import * as MiscFunctions from '../../functions/miscFunctions.js'
import * as MiscIpfsFunctions from './miscIpfsFunctions.js'
import IpfsHttpClient from 'ipfs-http-client';

const jQuery = require("jquery");

export const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

export const isActiveConceptGraphDirPresent = async (ipns10_forActiveCGPathDir,mainSchema_local_ipns) => {
    var result = false;
    var path = "/plex/conceptGraphs/"+ipns10_forActiveCGPathDir+"/"
    try {
        for await (const file of MiscIpfsFunctions.ipfs.files.ls(path)) {
            var fileName = file.name;
            var fileType = file.type;
            var fileCid = file.cid;
            if ( (fileType=="directory") && (fileName == mainSchema_local_ipns) ) {
                result = true;
            }
        }
    } catch (e) {}
    return result;
}

export const isIpns10DirPresent = async (ipns10_forActiveCGPathDir) => {
    var result = false;
    var path = "/plex/conceptGraphs/"
    try {
        for await (const file of MiscIpfsFunctions.ipfs.files.ls(path)) {
            var fileName = file.name;
            var fileType = file.type;
            var fileCid = file.cid;
            if ( (fileType=="directory") && (fileName == ipns10_forActiveCGPathDir) ) {
                result = true;
            }
        }
    } catch (e) {}
    return result;
}

export const fetchListOfCurrentConceptGraphSlugs = async (pCG0) => {
    var aSlugs = [];
    var path = pCG0 + "words/"
    for await (const file of MiscIpfsFunctions.ipfs.files.ls(path)) {
        var fileName = file.name;
        var fileType = file.type;
        var fileCid = file.cid;
        if (fileType=="directory") {
            aSlugs.push(fileName);
        }
    }

    return aSlugs;
}

export const addOrUpdateWordInLocalConceptGraph = async (pCG0,ipns) => {
    var oNode = await fetchObjectByIPNS(ipns)
    var oNodeLocal = await convertExternalNodeToLocalWord(oNode);
    var node_slug = oNode.wordData.slug;
    var path = pCG0+"words/"+node_slug+"/";
    try { await MiscIpfsFunctions.ipfs.files.mkdir(path) } catch (e) {}
    var pathToFile = path + "node.txt";
    var fileToWrite = JSON.stringify(oNodeLocal,null,4)
    try { await MiscIpfsFunctions.ipfs.files.rm(pathToFile, {recursive: true}) } catch (e) {}
    try { await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true}) } catch (e) {}
}

// Used for creation of the directory used for local active concept graph
// /plex/concepgGraphs/[activePathDir]/
// where [activePathDir] is derived from the last 10 characters of the IPNS generated using keyname:
// plex_pathToActiveConceptGraph_[last 10 digits of local peerID]
// This function returns the IPNS; if IPNS not yet generated, it will generate it and then return it
export const returnIPNSForActiveCGPathDir = async (keyname_forActiveCGPathDir) => {
    // keyname generated from myPeerID like this:
    // var keyname_forActiveCGPathDir = "plex_pathToActiveConceptGraph_"+myPeerID.slice(-10);

    var ipns_forActiveCGPathDir = null;
    var aKeys = await MiscIpfsFunctions.ipfs.key.list()
    console.log("returnIPNSForActiveCGPathDir-- numKeys: "+aKeys.length)
    var foundMatch = false;
    for (var k=0;k<aKeys.length;k++) {
        var oNext = aKeys[k];
        var name = oNext.name;
        var ipfs = oNext.id;
        if (name==keyname_forActiveCGPathDir) {
            console.log("returnIPNSForActiveCGPathDir -- match: oNext: "+JSON.stringify(oNext,null,4))
            foundMatch = true;
            ipns_forActiveCGPathDir = ipfs;
        }
    }
    if (!foundMatch) {
        var generatedKey_obj = await MiscIpfsFunctions.ipfs.key.gen(keyname_forActiveCGPathDir, {
            type: 'rsa',
            size: 2048
        })
        console.log("returnIPNSForActiveCGPathDir -- make new key: generatedKey_obj: "+JSON.stringify(generatedKey_obj,null,4))
        var ipns_forActiveCGPathDir = generatedKey_obj["id"];
        var generatedKey_name = generatedKey_obj["name"];
    }
    return ipns_forActiveCGPathDir;
}

export const fetchObjectByLocalMutableFileSystemPath = async (path) => {
    // console.log("fetchObjectByLocalMutableFileSystemPath; path:")
    // var chunks = []
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
}
// returns an array of cids pointing to specific instances of a given a concept and a subset
export const fetchFromMutableFileSystem = async (conceptUniqueIdentifier,subsetUniqueIdentifier) => {

    // During development, convention will be for conceptUniqueIdentifier to be the wordSlug of the concept, e.g.:
    // conceptUniqueIdentifier = "conceptFor_rating"
    // and for subsetUniqueIdentifier to be false, which will default to the superset of the concept
    var aCids = [];
    var mainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug;
    var oMainSchema = window.lookupWordBySlug[mainSchema_slug]
    var mainSchema_ipns = oMainSchema.metaData.ipns;

    var ipfsID = await MiscIpfsFunctions.returnIpfsID();

    // var basePath = "/plex/conceptGraphs/"+mainSchema_ipns+"/concepts/"+conceptUniqueIdentifier+"/superset/allSpecificInstances/"
    var basePath = "/plex/conceptGraphs/"+mainSchema_ipns+"/concepts/conceptFor_rating/superset/allSpecificInstances/"

    console.log("fetchFromMutableFileSystem; basePath: "+basePath);

    for await (const file of ipfs.files.ls(basePath)) {
        console.log("fetchFromMutableFileSystem; file.type: "+file.type)
        if (file.type=="directory") {
            var pathToNode = "/ipns/"+ipfsID+"/"+basePath + file.name + "/node.txt";
            const nextNodeCid = await ipfs.resolve(pathToNode);
            console.log("fetchFromMutableFileSystem nextNodeCid: "+ nextNodeCid);
            aCids.push(nextNodeCid);
        }
    }

    return aCids;
}
// This function could be moved to MiscIpfsFunctions since it does not interact with MFS
export const fetchObjectByIPNS = async (ipns) => {
    var ipfsPath = "/ipns/"+ipns;
    console.log("fetchObjectByIPNS; ipfsPath: "+ipfsPath)

    for await (const chunk of MiscIpfsFunctions.ipfs.cat(ipfsPath)) {
        var chunk2 = new TextDecoder("utf-8").decode(chunk);
        try {
            var oWord = JSON.parse(chunk2);
            return oWord;
        } catch (e) {
            console.log("error: "+e)
            return false;
        }
    }
    // return false;
}

export const convertExternalNodeToLocalWord = async (oWordExternal) => {
    var oWordLocal = MiscFunctions.cloneObj(oWordExternal);

    var wordType = oWordExternal.wordData.wordType;

    var oldKeyname = oWordExternal.metaData.keyname;
    var oldIpns = oWordExternal.metaData.ipns;
    var prevStewardPeerID = oWordExternal.metaData.stewardPeerID;
    var prevStewardUsername = oWordExternal.metaData.stewardUsername;
    var prevLastUpdate = oWordExternal.metaData.lastUpdate;
    oWordLocal.metaData.prevSource = {};
    oWordLocal.metaData.prevSource.ipns = oldIpns;
    oWordLocal.metaData.prevSource.keyname = oldKeyname;
    oWordLocal.metaData.prevSource.peerID = prevStewardPeerID;
    oWordLocal.metaData.prevSource.username = prevStewardUsername;
    oWordLocal.metaData.prevSource.lastUpdate = prevLastUpdate;

    var myPeerID = jQuery("#myCidMastheadContainer").html()
    var myUsername = jQuery("#myUsernameMastheadContainer").html()

    var currentTime = Date.now();
    var randomNonce = Math.floor(Math.random() * 1000);
    var newKeyname = "plexWord_"+wordType+"_"+currentTime+"_"+randomNonce;
    var generatedKey_obj = await MiscIpfsFunctions.ipfs.key.gen(newKeyname, {
        type: 'rsa',
        size: 2048
    })
    var newWord_ipns = generatedKey_obj["id"];
    var generatedKey_name = generatedKey_obj["name"];
    oWordLocal.metaData.ipns = newWord_ipns;
    oWordLocal.metaData.keyname = newKeyname;
    oWordLocal.metaData.stewardPeerID = myPeerID;
    oWordLocal.metaData.stewardUsername = myUsername;
    oWordLocal.metaData.lastUpdate = currentTime;

    // note that, unlike addConceptGraphSeedToMFS, this function does not publish this word to IPFS.
    // Therefore there is not yet an IPFS hash associated with this word.
    // The ipns at this point is merely used as an internal identifier.

    return oWordLocal;
}

export const addConceptGraphSeedToMFS = async (ipns,ipns10_forActiveCGPathDir) => {
    var oMainSchema = await fetchObjectByIPNS(ipns)
    console.log("addConceptGraphSeedToMFS; oMainSchema: "+JSON.stringify(oMainSchema,null,4))

    var oldKeyname = oMainSchema.metaData.keyname;
    var oldIpns = oMainSchema.metaData.ipns;
    var prevStewardPeerID = oMainSchema.metaData.stewardPeerID;
    var prevStewardUsername = oMainSchema.metaData.stewardUsername;
    var prevLastUpdate = oMainSchema.metaData.lastUpdate;
    oMainSchema.metaData.prevSource = {};
    oMainSchema.metaData.prevSource.ipns = oldIpns;
    oMainSchema.metaData.prevSource.keyname = oldKeyname;
    oMainSchema.metaData.prevSource.peerID = prevStewardPeerID;
    oMainSchema.metaData.prevSource.username = prevStewardUsername;
    oMainSchema.metaData.prevSource.lastUpdate = prevLastUpdate;
    // var randomNonce = Math.floor(Math.random() * 1000);

    var myPeerID = jQuery("#myCidMastheadContainer").html()
    var myUsername = jQuery("#myUsernameMastheadContainer").html()
    // var oIpfsID = await MiscIpfsFunctions.ipfs.id();
    // var myPeerID = oIpfsID.id;

    var currentTime = Date.now();
    var newKeyname = "plexWord_mainSchemaForConceptGraph_"+currentTime;
    var generatedKey_obj = await MiscIpfsFunctions.ipfs.key.gen(newKeyname, {
        type: 'rsa',
        size: 2048
    })
    var newWord_ipns = generatedKey_obj["id"];
    var generatedKey_name = generatedKey_obj["name"];
    oMainSchema.metaData.ipns = newWord_ipns;
    oMainSchema.metaData.keyname = newKeyname;
    oMainSchema.metaData.stewardPeerID = myPeerID;
    oMainSchema.metaData.stewardUsername = myUsername;
    oMainSchema.metaData.lastUpdate = currentTime;

    var path1 = "/plex/conceptGraphs/"+ipns10_forActiveCGPathDir+"/mainSchemaForConceptGraph/";
    await MiscIpfsFunctions.ipfs.files.mkdir(path1,{parents:true});
    var sMainSchema = JSON.stringify(oMainSchema,null,4)
    var path2 = "/plex/conceptGraphs/"+ipns10_forActiveCGPathDir+"/mainSchemaForConceptGraph/node.txt";
    var fileToWrite_encoded = new TextEncoder().encode(sMainSchema)

    try { await MiscIpfsFunctions.ipfs.files.rm(path2) } catch (e) {}
    await MiscIpfsFunctions.ipfs.files.write(path2, fileToWrite_encoded, {create: true, flush: true})

    // var oStat = await MiscIpfsFunctions.ipfs.files.stat(path2)
    // var newCid = oStat.cid.toV1().toString('base16')
    // console.log("oStat: "+JSON.stringify(oStat,null,4))
    // console.log("addConceptGraphSeedToMFS cid: "+oStat.cid.toV1().toString('base16'))

    // var options_publish = { key: newKeyname }
    // var res = await MiscIpfsFunctions.ipfs.name.publish(path2, options_publish)

    var stats = await MiscIpfsFunctions.ipfs.files.stat(path2);
    var stats_str = JSON.stringify(stats);
    var thisPeerData_cid = stats.cid.string;
    console.log("thisPeerData_cid: " + thisPeerData_cid)
    var options_publish = { key: newKeyname }
    var res = await MiscIpfsFunctions.ipfs.name.publish(thisPeerData_cid, options_publish)

    return newWord_ipns
}
export const addConceptGraphSeedToMFS_old = async (oMainSchema) => {
    var path1 = "/plex/conceptGraphs/mainSchemaForConceptGraph/";
    await MiscIpfsFunctions.ipfs.files.mkdir(path1,{parents:true});
    var sMainSchema = JSON.stringify(oMainSchema,null,4)
    var path2 = "/plex/conceptGraphs/mainSchemaForConceptGraph/node.txt";
    var fileToWrite_encoded = new TextEncoder().encode(sMainSchema)

    try { await MiscIpfsFunctions.ipfs.files.rm(path2) } catch (e) {}
    await MiscIpfsFunctions.ipfs.files.write(path2, fileToWrite_encoded, {create: true, flush: true})

    var oStat = await MiscIpfsFunctions.ipfs.files.stat(path2)
    // console.log("oStat: "+JSON.stringify(oStat,null,4))
    console.log("addConceptGraphSeedToMFS cid: "+oStat.cid.toV1().toString('base16'))
}

// similar to publishWordToIpfs, except:
// MFS path to file must be specified
// the file is any arbitrary string
export const publishFileToMFS = async (sFile,pathToFile) => {
    var fileToWrite = sFile
    var fileToWrite_encoded = new TextEncoder().encode(fileToWrite)
    try { await MiscIpfsFunctions.ipfs.files.rm(pathToFile) } catch (e) {}
    await MiscIpfsFunctions.ipfs.files.write(pathToFile, fileToWrite_encoded, {create: true, flush: true})

    await MiscFunctions.timeout(100)

    // This step ??? publishes entier MFS so that others can see it
    // Better: publish only the file I just stored
    // Also: need to have a check or a field to determine whether this file should be published to public or not
    var stats = await MiscIpfsFunctions.ipfs.files.stat('/');
    var stats_str = JSON.stringify(stats);
    var thisPeerData_cid = stats.cid.string;
    console.log("thisPeerData_cid: " + thisPeerData_cid)
    var options_publish = { key: 'self' }
    var res = await MiscIpfsFunctions.ipfs.name.publish(thisPeerData_cid, options_publish)

    return res;
}

// input word must contain metaData.keyname
// it is published to IPFS, which generates a cid
// Then keyname's ipfs and new cid are linked
export const publishWordToIpfs = async (oWord) => {
    var fileToWrite = JSON.stringify(oWord,null,4)
    var fileToWrite_encoded = new TextEncoder().encode(fileToWrite)
    /*
    // I'm not sure how the path is applied
    var oFile = {
        path: "/tmpp/",
        content: fileToWrite
    }
    */
    var oFile = {
        content: fileToWrite
    }
    const addResult = await MiscIpfsFunctions.ipfs.add(oFile)
    var newCid = addResult.cid;
    console.info("added file cid: "+newCid)
    var recordedKeyname = oWord.metaData.keyname
    var options_publish = { key: recordedKeyname }
    var res = await MiscIpfsFunctions.ipfs.name.publish(newCid, options_publish)
    return oWord;
}

export const publishWordToIpfsAndUpdateSql = async (oWord) => {
    var fileToWrite = JSON.stringify(oWord,null,4)
    var fileToWrite_encoded = new TextEncoder().encode(fileToWrite)
    var oFile = {
        content: fileToWrite
    }
    const addResult = await MiscIpfsFunctions.ipfs.add(oFile)
    var newCid = addResult.cid;
    console.info("added file cid: "+newCid)
    var recordedKeyname = oWord.metaData.keyname
    var options_publish = { key: recordedKeyname }
    var res = await MiscIpfsFunctions.ipfs.name.publish(newCid, options_publish)
    await MiscFunctions.createOrUpdateWordInAllTables(oWord)
    return oWord;
}

// determine whether I am the steward of this word per metaData; same method as republishWordIfSteward
export const checkWordWhetherIAmSteward = async (oWord) => {
    var wordIPNS = oWord.metaData.ipns;
    var wordKeyname = oWord.metaData.keyname;

    var aKeys = await MiscIpfsFunctions.ipfs.key.list()
    console.log("checkWordWhetherIAmSteward-- numKeys: "+aKeys.length)
    var foundMatch = false;
    for (var k=0;k<aKeys.length;k++) {
        var oNext = aKeys[k];
        var name = oNext.name;
        var ipfs = oNext.id;
        if ((name==wordKeyname) && (ipfs==wordIPNS)) {
            console.log("checkWordWhetherIAmSteward-- match: oNext: "+JSON.stringify(oNext,null,4))
            foundMatch = true;
        }
    }
    console.log("checkWordWhetherIAmSteward-- foundMatch: "+foundMatch);
    return foundMatch;
}

// This function tests whether metaData.keyname and metaData.ipns are a match. If yes, it means I am the steward of this word
// and publishWordToIpfs, which updates the file on ipfs, which means other users can access the updated file using the ipns
// (Alternatively, could check whether metaData.stewardPeerID matches my peerID; but I will probably use this function to set that field)
export const republishWordIfSteward = async (oWord) => {
    var wordIPNS = oWord.metaData.ipns;
    var wordKeyname = oWord.metaData.keyname;

    var aKeys = await MiscIpfsFunctions.ipfs.key.list()
    console.log("republishWordIfSteward-- numKeys: "+aKeys.length)
    var foundMatch = false;
    for (var k=0;k<aKeys.length;k++) {
        var oNext = aKeys[k];
        var name = oNext.name;
        var ipfs = oNext.id;
        if ((name==wordKeyname) && (ipfs==wordIPNS)) {
            console.log("republishWordIfSteward-- match: oNext: "+JSON.stringify(oNext,null,4))
            foundMatch = true;
            var options_publish = { key: wordKeyname }
            var myPeerID = jQuery("#myCidMastheadContainer").html()
            var myUsername = jQuery("#myUsernameMastheadContainer").html()
            var currentTime = Date.now();
            oWord.metaData.stewardPeerID = myPeerID;
            oWord.metaData.stewardUsername = myUsername;
            oWord.metaData.lastUpdate = currentTime;
            var oWordUpdated = await publishWordToIpfs(oWord)
            console.log("republishWordIfSteward-- publishing word to ipfs")
            return oWordUpdated;
        }
    }
    console.log("republishWordIfSteward-- foundMatch: "+foundMatch);
    return oWord;
}
export const republishWordToIpfsAndSqlAsNewSteward = async (oWord) => {
    // var wordIPNS = oWord.metaData.ipns;
    // var wordKeyname = oWord.metaData.keyname;
    // if (!wordKeyname) {

    // }
    var wordType = oWord.wordData.wordType;
    var currentTime = Date.now();
    var newKeyname = "plexWord_"+wordType+"_"+currentTime;

    var generatedKey_obj = await MiscIpfsFunctions.ipfs.key.gen(newKeyname, {
        type: 'rsa',
        size: 2048
    })
    var newWord_ipns = generatedKey_obj["id"];
    var generatedKey_name = generatedKey_obj["name"];
    oWord.metaData.ipns = newWord_ipns;
    oWord.metaData.keyname = newKeyname;

    var options_publish = { key: newKeyname }
    var myPeerID = jQuery("#myCidMastheadContainer").html()
    var myUsername = jQuery("#myUsernameMastheadContainer").html()
    oWord.metaData.stewardPeerID = myPeerID;
    oWord.metaData.stewardUsername = myUsername;
    oWord.metaData.lastUpdate = currentTime;
    var oWordUpdated = await publishWordToIpfs(oWord)
    await MiscFunctions.createOrUpdateWordInAllTables(oWordUpdated)
    console.log("republishWordIfSteward-- publishing word to ipfs")
    return oWordUpdated;

}
export const republishWordToIpfsAndSqlIfSteward = async (oWord) => {
    var wordIPNS = oWord.metaData.ipns;
    var wordKeyname = oWord.metaData.keyname;

    var aKeys = await MiscIpfsFunctions.ipfs.key.list()
    console.log("republishWordIfSteward-- numKeys: "+aKeys.length)
    var foundMatch = false;
    for (var k=0;k<aKeys.length;k++) {
        var oNext = aKeys[k];
        var name = oNext.name;
        var ipfs = oNext.id;
        if ((name==wordKeyname) && (ipfs==wordIPNS)) {
            console.log("republishWordIfSteward-- match: oNext: "+JSON.stringify(oNext,null,4))
            foundMatch = true;
            var options_publish = { key: wordKeyname }
            var myPeerID = jQuery("#myCidMastheadContainer").html()
            var myUsername = jQuery("#myUsernameMastheadContainer").html()
            var currentTime = Date.now();
            oWord.metaData.stewardPeerID = myPeerID;
            oWord.metaData.stewardUsername = myUsername;
            oWord.metaData.lastUpdate = currentTime;
            var oWordUpdated = await publishWordToIpfs(oWord)
            await MiscFunctions.createOrUpdateWordInAllTables(oWordUpdated)
            console.log("republishWordIfSteward-- publishing word to ipfs")
            return oWordUpdated;
        }
    }
    console.log("republishWordIfSteward-- foundMatch: "+foundMatch);
    return oWord;
}

// convert from one unique identifier to another
// e.g. convertUniqueIdentifier("conceptSlug","wordSlug","user") will convert user to conceptFor_user

export const convertUniqueIdentifier = (uniqueIdType_in,uniqueIdType_out,input) => {
    // incomplete
    return input
}

export const addSpecificInstanceToConceptGraphMfs = async (conceptUniqueIdentifier,subsetUniqueIdentifier,oWord) => {
    // oWord must be a concept graph word, as an object, ready to save to the MFS
    // conceptUniqueIdentifier can be any of the (spaceless) unique identifiers for a concept (concept word slug, concept slug, ipfs)
    // convention during development will be concept word slug and set word slug
    // e.g.: conceptUniqueIdentifier = "conceptFor_user", "user", or "k2k4r8mnec62btj1p0qef63vtkf7zd89yb5mmtb5ygg9pkicdhoy4lg5"
    // convention: conceptUniqueIdentifier = "conceptFor_user"
    // same with subsetUniqueIdentifier, e.g. subsetUniqueIdentifier = "setFor_entities_organizedBy_entityType_9i5cll", "entities_organizedBy_entityType", "k2k4r8p5krqggm5g87gq6oxr8421zew6kp78m04zhasg7d3ptn9i5cll"
    // convention: subsetUniqueIdentifier = "setFor_entities_organizedBy_entityType_9i5cll"
    // if subsetUniqueIdentifier is null, false, 0, or not found, then default to the concept's superset

    var fileToWrite = JSON.stringify(oWord,null,4)
    var fileToWrite_encoded = new TextEncoder().encode(fileToWrite)
    // For starters, will use word slug as the unique identifier for all words when creating the path through the MFS
    // Future: look up the governing concept (e.g. conceptFor_user, determined from conceptUniqueIdentifier),
    // get list of all unique top level keys (eg: wordData.slug, userData.slug, userData.peerID, maybe metaData.ipns) and use them all
    var word_wordSlug = oWord.wordData.slug;

    // incomplete: find property path from conceptUniqueIdentifier, e.g. conceptUniqueIdentifier="conceptFor_entityType" and propertyPath = "entityTypeData"
    // var word_conceptSpecificSlug = oWord[propertyPath].slug;

    var mainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug;
    var oMainSchema = window.lookupWordBySlug[mainSchema_slug]
    var mainSchema_ipns = oMainSchema.metaData.ipns;

    var pathBase = "/plex/conceptGraphs/";
    var pathToConcept = pathBase + mainSchema_ipns + "/concepts/"+conceptUniqueIdentifier+"/";

    // test whether subset can be found and whether it exists in the concept graph
    // for starters during development, all specific instances will be added directly to superset
    var doesSubsetExist = false;
    if (!doesSubsetExist) {
        var pathToCreate = pathToConcept + "superset/allSpecificInstances/"+word_wordSlug+"/";
        try { await MiscIpfsFunctions.ipfs.files.mkdir(pathToCreate) } catch (e) {}

        var pathToCreate = pathToConcept + "superset/directSpecificInstances/"+word_wordSlug+"/";
        try { await MiscIpfsFunctions.ipfs.files.mkdir(pathToCreate) } catch (e) {}

        var pathToFile = pathToConcept + "superset/allSpecificInstances/"+word_wordSlug+"/node.txt";
        // need to remove file if already there
        try { await MiscIpfsFunctions.ipfs.files.rm(pathToFile) } catch (e) {}
        await MiscIpfsFunctions.ipfs.files.write(pathToFile, fileToWrite_encoded, {create: true, flush: true})

        var pathToFile = pathToConcept + "superset/directSpecificInstances/"+word_wordSlug+"/node.txt";
        // need to remove file if already there
        try { await MiscIpfsFunctions.ipfs.files.rm(pathToFile) } catch (e) {}
        await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true})
    }
}


const populateSuperset = async (path,oConcept) => {
    var conceptSlug = oConcept.conceptData.slug;
    var conceptPropertyPath = oConcept.conceptData.propertyPath;
    var superset_slug = oConcept.conceptData.nodes.superset.slug;
    var oSuperset = window.lookupWordBySlug[superset_slug];
    var aAllSubsets = oSuperset.globalDynamicData.subsets;
    var aDirectSubsets = oSuperset.globalDynamicData.directSubsets;
    var aAllSpecificInstances = oSuperset.globalDynamicData.specificInstances;
    var aDirectSpecificInstances = oSuperset.globalDynamicData.directSpecificInstances;

    var nextPath = path + "superset/";
    try {
        await MiscIpfsFunctions.ipfs.files.mkdir(nextPath,{"parents":true})
    } catch (e) {}

    try {
        var pathToFile = path + "superset/" + "node.txt";
        var fileToWrite = JSON.stringify(oSuperset,null,4)
        await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true})
    } catch (e) {}

    var nextPath = path + "superset/allSpecificInstances/";
    try { await MiscIpfsFunctions.ipfs.files.mkdir(nextPath) } catch (e) {}

    var nextPath = path + "superset/directSpecificInstances/";
    try { await MiscIpfsFunctions.ipfs.files.mkdir(nextPath) } catch (e) {}

    var nextPath = path + "superset/allSets/";
    try { await MiscIpfsFunctions.ipfs.files.mkdir(nextPath) } catch (e) {}

    var nextPath = path + "superset/directSubsets/";
    try { await MiscIpfsFunctions.ipfs.files.mkdir(nextPath) } catch (e) {}

    for (var z=0;z<aAllSpecificInstances.length;z++) {
        var nextSI_wordSlug = aAllSpecificInstances[z];
        var oNextNode = window.lookupWordBySlug[nextSI_wordSlug];
        var nextSI_ipns = oNextNode.metaData.ipns;
        var nextNode_nodeSpecificSlug = oNextNode[conceptPropertyPath].slug;

        var nextPath = path + "superset/allSpecificInstances/" +nextSI_wordSlug + "/";
        try {
            var pathToFile = nextPath + "node.txt";
            var fileToWrite = JSON.stringify(oNextNode,null,4)
            // console.log("populateSuperset; si: "+z+"; fileToWrite: "+fileToWrite)
            await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true, parents: true})
        } catch (e) {}

        var nextPath = path + "superset/allSpecificInstances/slug/" +nextSI_wordSlug + "/";
        try {
            var pathToFile = nextPath + "node.txt";
            var fileToWrite = JSON.stringify(oNextNode,null,4)
            // console.log("populateSuperset; si: "+z+"; fileToWrite: "+fileToWrite)
            await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true, parents: true})
        } catch (e) {}

        var nextPath = path + "superset/allSpecificInstances/ipns/" +nextSI_ipns + "/";
        try {
            var pathToFile = nextPath + "node.txt";
            var fileToWrite = JSON.stringify(oNextNode,null,4)
            // console.log("populateSuperset; si: "+z+"; fileToWrite: "+fileToWrite)
            await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true, parents: true})
        } catch (e) {}

        var nextPath = path + "superset/allSpecificInstances/"+conceptSlug+"/" +nextNode_nodeSpecificSlug + "/";
        try {
            var pathToFile = nextPath + "node.txt";
            var fileToWrite = JSON.stringify(oNextNode,null,4)
            // console.log("populateSuperset; si: "+z+"; fileToWrite: "+fileToWrite)
            await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true, parents: true})
        } catch (e) {}

    }
}

const populateSets = async (path,superset_slug) => {

    var nextPath = path + "sets/";
    try { await MiscIpfsFunctions.ipfs.files.mkdir(nextPath) } catch (e) {}

    var oSuperset = window.lookupWordBySlug[superset_slug];
    var aAllSubsets = oSuperset.globalDynamicData.subsets;

}

const populateWordType = async (path,wordType_slug) => {
    var oWordType = window.lookupWordBySlug[wordType_slug];

    var nextPath = path + "wordType/";
    try { await MiscIpfsFunctions.ipfs.files.mkdir(nextPath) } catch (e) {}

    try {
        var pathToFile = nextPath + "node.txt";
        var fileToWrite = JSON.stringify(oWordType,null,4)
        await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true})
    } catch (e) {}
}

const populateSingleConceptB = async (path,concept_wordSlug) => {
    var oConcept = window.lookupWordBySlug[concept_wordSlug];
    var superset_slug = oConcept.conceptData.nodes.superset.slug;

    var wordType_slug = oConcept.conceptData.nodes.wordType.slug;


    try { await MiscIpfsFunctions.ipfs.files.mkdir(path) } catch (e) {}

    var pathToFile = path + "node.txt";
    var fileToWrite = JSON.stringify(oConcept,null,4)
    try { await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true}) } catch (e) {}

    // wordType
    await populateWordType(path,wordType_slug)

    var nextPath = path + "properties/";
    try { await MiscIpfsFunctions.ipfs.files.mkdir(nextPath) } catch (e) {}

    // superset
    await populateSuperset(path,oConcept)

    // sets
    await populateSets(path,superset_slug)
}

export const populateSingleConcept = async (path,concept_wordSlug) => {
    console.log("populateSingleConcept; concept_wordSlug: "+concept_wordSlug+"; path: "+path)

    // all the various unique (unique in this context) identifiers to find this concept
    var oConcept = window.lookupWordBySlug[concept_wordSlug];
    var conceptSlug = oConcept.conceptData.slug;
    var conceptIPNS = oConcept.metaData.ipns;

    var nextUniqueIdentifier = concept_wordSlug;
    var pathNext = path + nextUniqueIdentifier + "/";
    populateSingleConceptB(pathNext,concept_wordSlug)

    var nextUniqueIdentifier = conceptSlug;
    var pathNext = path + nextUniqueIdentifier + "/";
    populateSingleConceptB(pathNext,concept_wordSlug)

    var nextUniqueIdentifier = conceptIPNS;
    var pathNext = path + nextUniqueIdentifier + "/";
    populateSingleConceptB(pathNext,concept_wordSlug)
}
