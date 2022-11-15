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
    var fileType = typeof file;
    // var fileType = "string" // default

    if (fileType=="string") {
        var fileToAdd = file;
    }
    if (fileType=="object") {
        var fileToAdd = JSON.stringify(file,null,4);
    }
    var oFile = {
        content: fileToAdd
    }
    const addResult = await ipfs.add(oFile);
    return addResult.cid.toString();

    return false;
}

// cg.ipfs.publish to replace ConceptGraphInMfsFunctions.publishWordToIpfs
cg.ipfs.publish = async (file,oOptions) => {
    var fileType = typeof file;
    if (fileType=="string") {
        var fileToAdd = file;
        var oWord = JSON.parse(file)
    }
    if (fileType=="object") {
        var oWord = file;
        var fileToAdd = JSON.stringify(file,null,4);
    }
    var oFile = {
        content: fileToAdd
    }
    const addResult = await ipfs.add(oFile)

    var newCid = addResult.cid;
    console.info("added file cid: "+newCid)
    var recordedKeyname = oWord.metaData.keyname
    var options_publish = { key: recordedKeyname }
    var res = await ipfs.name.publish(newCid, options_publish)
    return true; // ? return more info
}

// cg.ipfs.returnMyPeerID REPLACES: MiscIpfsFunctions.returnMyPeerID
cg.ipfs.returnMyPeerID = async (oOptions) => {
    var slice10 = false // default
    if (oOptions) {
        if (oOptions.hasOwnProperty("slice10")) {
            slice10 = oOptions.slice10;
        }
    }
    var oIpfsID = await ipfs.id();
    var myPeerID = oIpfsID.id;
    // console.log("returnMyPeerID; myPeerID: "+myPeerID)
    if (!slice10) {
        return myPeerID
    }
    if (slice10) {
        return myPeerID.slice(-10);
    }
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

// cg.mfs.add replaces ConceptGraphInMfsFunctions.createOrUpdateWordInMFS
cg.mfs.add = async (oWord,oOptions) => {
    // Step 1: concept graph role
    var conceptGraphRole = "active" // default concept graph role
    if (oOptions) {
        if (oOptions.hasOwnProperty("conceptGraphRole")) {
            conceptGraphRole = oOptions.conceptGraphRole;
        }
    }
    var cg_ipns = await cg.conceptGraph.resolve(conceptGraphRole)
    console.log("cg.mfs.add; cg_ipns: "+cg_ipns)
    // End Step 1

    var fileToWrite = JSON.stringify(oWord,null,4)
    var path = await cg.mfs.path.get(oWord,{trunc:true})
    try { await ipfs.files.mkdir(path) } catch (e) {}
    var pathToFile = path + "node.txt";
    try { await ipfs.files.rm(pathToFile, {recursive: true}) } catch (e) {}
    try { await ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true}) } catch (e) {}
    var oWord = await cg.ipfs.publish(oWord)
    return true;
}
cg.mfs.update = {}
cg.mfs.publish = async (path,oOptions) => {

}
cg.mfs.path = {};
// TO_DO: incomplete; address different inputCgidTypes
cg.mfs.path.get = async (cgid,oOptions) => {
    console.log("cg.mfs.path.get; cgid: "+cgid)
    // set defaults
    var conceptGraphRole = "active" // default concept graph role
    if (oOptions) {
        if (oOptions.hasOwnProperty("conceptGraphRole")) {
            conceptGraphRole = oOptions.conceptGraphRole;
        }
    }
    var inputCgidType = "slug"
    if (oOptions) {
        if (oOptions.hasOwnProperty("inputCgidType")) {
            inputCgidType = oOptions.inputCgidType;
        }
    }
    var trunc = false;
    if (oOptions) {
        if (oOptions.hasOwnProperty("trunc")) {
            trunc = oOptions.trunc;
        }
    }

    var baseDir10 = await cg.mfs.baseDirectory({slice10:true})
    console.log("cg.mfs.path.get; baseDir10: "+baseDir10)
    var cg_ipns = await cg.conceptGraph.resolve(conceptGraphRole)
    console.log("cg.mfs.path.get; cg_ipns: "+cg_ipns)

    if (inputCgidType=="slug") {
        var slug = cgid;
    }
    if (inputCgidType=="ipns") {
        // find slug from its ipns
    }

    if (trunc) {
        var path = "/plex/conceptGraphs/"+baseDir10+"/"+cg_ipns+"/words/"+slug+"/";
    }
    if (!trunc) {
        var path = "/plex/conceptGraphs/"+baseDir10+"/"+cg_ipns+"/words/"+slug+"/node.txt";
    }

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

    // cg.words.ls({outputCgidType:"slug"})

    console.log("cg.cgids.ls; incomplete")
    return aResult;
}
cg.cgid.resolve = async (cgid,oOptions) => {
    console.log("cg.cgid.resolve; cgid: "+cgid);

    var result = null

    // set defaults
    var conceptGraphRole = "active" // default concept graph role
    if (oOptions) {
        if (oOptions.hasOwnProperty("conceptGraphRole")) {
            conceptGraphRole = oOptions.conceptGraphRole;
        }
    }
    var cg_ipns = await cg.conceptGraph.resolve(conceptGraphRole)
    // TO DO: need to run var inputCgidType = await cg.cgid.type.resolve(cgid)
    // If there is conflict between what oOptions.inputCgidType says and what cg.cgid.type.resolve returns, need to decide which one takes precedence
    // (probably cg.cgid.type.resolve takes precedence; use oOptionsinputCgidType only if cg.cgid.type.resolve returns an error )
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

// output the type of the input cgid
/* possible & common results include:
word (=node)
file (could be a word but stringified)
slug, name, or title
ipns (or ipfs - less likely)
[concept]-slug, e.g. post-slug
More types may be forthcoming.
Most common results: word, slug, ipns
*/
cg.cgid.type.resolve = async (cgid,oOptions) => {
    var result = null
    // TO DO: this function is very much incomplete - need to check for slug, ipns at a minimum
    // More complex: check for [concept]-slug. There will be instances where result is an array;
    // e.g., if input is "user" then cg.cgid.type.resolve output would be: [wordType-slug, concept-slug] -- in case of such duplicate possibilities, I need a way to decide which concepts take priority.
    // if cgid=user then for cg.cgid.get, I would include option concept:conceptFor_concept, which would be how to select from these two options.
    // if cgid is object, then result is probably word (= node), although more checks should be performed
    if (typeof cgid == "object") {
        result = "word";
        return result;
    }
    // use cg.cgids.ls to get full list of all cgids
    // if cgid is in slug list, then result = slug
    // if cgid is in ipns list, then result = ipns
    if (typeof cgid == "string") {
        var aWords_by_slug = await cg.words.ls({outputCgidType:"slug"})
        var aWords_by_ipns = await cg.words.ls({outputCgidType:"ipns"})
        if (aWords_by_slug.includes(cgid)) {
            result = "slug";
            return result;
        }
        if (aWords_by_ipns.includes(cgid)) {
            result = "ipns";
            return result;
        }
    }

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
// see cg.words.ls for idea on how to reconfigure options
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

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

cg.concepts = {}
cg.concept = {}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

cg.specificInstances = {};
cg.specificInstance = {};

// replaces ConceptGraphInMfsFunctions.addNewWordAsSpecificInstanceToConceptInMFS_specifyConceptGraph
// 13 Nov 2022: parent now must refer to a concept (not a set), and the corresponding superset is assumed;
// if other sets are to be used, put it into options.
// Need to update this in
cg.specificInstance.add = async (child,parent,oOptions) => {
    // Step 1: concept graph role
    var conceptGraphRole = "active" // default concept graph role
    if (oOptions) {
        if (oOptions.hasOwnProperty("conceptGraphRole")) {
            conceptGraphRole = oOptions.conceptGraphRole;
        }
    }
    var cg_ipns = await cg.conceptGraph.resolve(conceptGraphRole)
    console.log("cg.specificInstance.add; cg_ipns: "+cg_ipns)
    // End Step 1

    //////////////// determine oChild from child (which is cgid)
    var cgidType_child = await cg.cgid.type.resolve(child)
    /////// determine cgid type of child
    if ( (cgidType_child == "word") || (cgidType_child == "node")) {
        var oChild = MiscFunctions.cloneObj(child);
    }
    var child_wordSlug = oChild.wordData.slug;
    console.log("cg.specificInstance.add; cgidType_child: "+cgidType_child)

    //////////////// determine oParent (i.e. oSet) from parent (which is a cgid)

    var cgidType_parent = await cg.cgid.type.resolve(parent)
    /////// determine cgid type of child
    if ( (cgidType_parent == "word") || (cgidType_parent == "node")) {
        var oParentConcept = MiscFunctions.cloneObj(parent);
    }
    console.log("cg.specificInstance.add; cgidType_parent: "+cgidType_parent)
    if (cgidType_parent=="slug") {
        oParentConcept = await cg.cgid.resolve(parent,{inputCgidType:"slug"})
    }
    if (cgidType_parent=="ipns") {
        // INCOMPLETE
    }
    var superset_slug = oParentConcept.conceptData.nodes.superset.slug;
    var mainSchema_slug = oParentConcept.conceptData.nodes.schema.slug;
    var oMainSchema = await cg.cgid.resolve(mainSchema_slug);

    var aSets = [];
    aSets.push(superset_slug);
    // TO DO: look in options for other sets to be added and whether to omit superset
    // WORKING UP TO HERE as of 13 Nov 11:30 PM
    console.log("cg.specificInstance.add; oMainSchema: "+JSON.stringify(oMainSchema,null,4))

    for (var s=0;s<aSets.length;s++) {
        var set_slug = aSets[s];
        // var oSet = await lookupWordBySlug_specifyConceptGraph(ipns,set_slug);
        var oSet = await cg.cgid.resolve(set_slug,{inputCgidType:"slug"})
        var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
        oNewRel.nodeFrom.slug = child_wordSlug;
        oNewRel.relationshipType.slug = "isASpecificInstanceOf";
        oNewRel.nodeTo.slug = set_slug;

        console.log("addNewWordAsSpecificInstanceToConceptInMFS_specifyConceptGraph; oNewRel: "+JSON.stringify(oNewRel,null,4))

        var oMiniWordLookup = {};
        oMiniWordLookup[child_wordSlug] = oChild;
        oMiniWordLookup[set_slug] = oSet;
        // TO DO: replace this fxn with a library fxn; cg.schema.addRel()
        // oMainSchema = MiscFunctions.updateSchemaWithNewRel(oMainSchema,oNewRel,oMiniWordLookup)
        oMainSchema = await cg.schema.addRel(oMainSchema,oNewRel,{foo:oMiniWordLookup})
        console.log("addNewWordAsSpecificInstanceToConceptInMFS_specifyConceptGraph; oMainSchema: "+JSON.stringify(oMainSchema,null,4))
    }

    // await addWordToMfsConceptGraph_specifyConceptGraph(ipns,oChild);
    // await addWordToMfsConceptGraph_specifyConceptGraph(ipns,oMainSchema);
    var foo1 = await cg.mfs.update(oChild)
    var foo2 = await cg.mfs.update(oMainSchema)

}
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
cg.schema = {};
cg.schemas = {};
cg.schemas.ls = async (oOptions) => {}

// cg.schema.addRel will replace: MiscFunctions.updateSchemaWithNewRel
cg.schema.addRel = async (schema,oRel,oOptions) => {
    // Step 1 is replicated across many functions. Need to have a fxn for this step.
    // Step 1: concept graph role
    var conceptGraphRole = "active" // default concept graph role
    if (oOptions) {
        if (oOptions.hasOwnProperty("conceptGraphRole")) {
            conceptGraphRole = oOptions.conceptGraphRole;
        }
    }
    var cg_ipns = await cg.conceptGraph.resolve(conceptGraphRole)
    console.log("cg.schema.addRel: cg_ipns: "+cg_ipns)
    // End Step 1

    //////////////// determine oSchema from schema (which is a cgid)
    var oSchema = await cg.cgid.resolve(schema)

    // console.log("updateSchemaWithNewRel; schema_in_obj: "+JSON.stringify(schema_in_obj,null,4))
    var schema_out_obj = JSON.parse(JSON.stringify(oSchema));
    var schema_out_slug = schema_out_obj.wordData.slug;

    var nF_slug = oRel.nodeFrom.slug;
    var nT_slug = oRel.nodeTo.slug;
    var rT_slug = oRel.relationshipType.slug;

    var addRelError = false;

    var nF_obj = {};
    var nF_rF_obj = await cg.cgid.resolve(nF_slug);
    var nF_rF_str = JSON.stringify(nF_rF_obj,null,4);

    if (nF_rF_obj) {
        var nF_ipns = nF_rF_obj.metaData.ipns;
        nF_obj.slug = nF_slug;
        nF_obj.ipns = nF_ipns;
    } else {
        addRelError = true;
        console.log("addRelError! nF_rF_str: "+nF_rF_str)
    }

    var nT_obj = {};
    var nT_rF_obj = cg.cgid.resolve(nT_slug);
    var nT_rF_str = JSON.stringify(nT_rF_obj,null,4);

    if (nT_rF_obj) {
        var nT_ipns = nT_rF_obj.metaData.ipns;
        nT_obj.slug = nT_slug;
        nT_obj.ipns = nT_ipns;
    } else {
        addRelError = true;
        console.log("addRelError! nT_rF_str: "+nT_rF_str)
    }

    if (!addRelError) {
        if (!MiscFunctions.isRelObjInArrayOfObj(oRel,schema_out_obj.schemaData.relationships)) {
            // console.log("updateSchemaWithNewRel; rel is not in schema")
            schema_out_obj.schemaData.relationships.push(oRel);
        }
        if (!MiscFunctions.isWordObjInArrayOfObj(nF_obj,schema_out_obj.schemaData.nodes)) {
            // console.log("updateSchemaWithNewRel; nF_slug: "+nF_slug+" is not yet in schema; nF_ipns: "+nF_ipns)
            schema_out_obj.schemaData.nodes.push(nF_obj);
        }

        if (!MiscFunctions.isWordObjInArrayOfObj(nT_obj,schema_out_obj.schemaData.nodes)) {
            // console.log("updateSchemaWithNewRel; nT_slug: "+nT_slug+" is not yet in schema; nT_ipns: "+nT_ipns)
            schema_out_obj.schemaData.nodes.push(nT_obj);
        }
    }
    if (addRelError) {
        console.log("updateSchemaWithNewRel; ERROR!! oRel: "+JSON.stringify(oRel,null,4))
    }
    // lookupRawFileBySlug_x_obj.edited[schema_out_slug] = schema_out_obj;
    // console.log("updateSchemaWithNewRel_; addRelError: "+addRelError+"; nF_slug: "+nF_slug+"; nT_slug: "+nT_slug+"; rT_slug: "+rT_slug)
    // console.log("updateSchemaWithNewRel; schema_out_obj: "+JSON.stringify(schema_out_obj,null,4))
    return schema_out_obj;

}
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

cg.words = {};
cg.word = {};
cg.words.ls = async (oOptions) => {
    var conceptGraphRole = "active" // default concept graph role
    if (oOptions) {
        if (oOptions.hasOwnProperty("conceptGraphRole")) {
            conceptGraphRole = oOptions.conceptGraphRole;
        }
    }
    var cg_ipns = await cg.conceptGraph.resolve(conceptGraphRole)
    console.log("cg.words.ls; cg_ipns: "+cg_ipns)
    // should replace this with:
    // var cg_ipns = await cg.conceptGraph.resolve("active",oOptions)
    // or
    // var cg_ipns = await cg.conceptGraph.resolve("active",{options:oOptions})

    var outputCgidType = "ipns"; // default
    if (oOptions) {
        if (oOptions.hasOwnProperty("outputCgidType")) {
            outputCgidType = oOptions.outputCgidType;
        }
    }
    // var aWords = []
    // INCOMPLETE; need to use cg_ipns to look through MFS to find all words and populate aResult
    var base10 = await cg.mfs.baseDirectory({slice10:true})
    var path = "/plex/conceptGraphs/"+base10+"/"+cg_ipns+"/words/";
    console.log("cg.words.ls; path: "+path)
    var aWords_by_slug = [];
    var aWords_by_ipns = [];
    var aWords_by_node = [];
    try {
        for await (const file of ipfs.files.ls(path)) {
            var fileName = file.name;
            var fileType = file.type;
            var fileCid = file.cid;
            if ( (fileType=="directory") ) {
                aWords_by_slug.push(fileName);
                // need to fetch full object, then push to aWords_by_node and aWords_by_ipns
            }
        }
    } catch (e) {}
    console.log("cg.words.ls; aWords_by_slug: "+JSON.stringify(aWords_by_slug,null,4))
    if (outputCgidType=="ipns") {
        return aWords_by_ipns;
    }
    if (outputCgidType=="slug") {
        return aWords_by_slug;
    }
    if ((outputCgidType=="word") || (outputCgidType=="node")) {
        return aWords_by_node;
    }
}
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

cg.word.returnIpns = async (oWord, oOptions) => {
    var slice10 = false // default
    if (oOptions) {
        if (oOptions.hasOwnProperty("slice10")) {
            slice10 = oOptions.slice10;
        }
    }
    var ipns = oWord.metaData.ipns;
    if (!slice10) {
        return ipns
    }
    if (slice10) {
        return ipns.slice(-10);
    }
}
