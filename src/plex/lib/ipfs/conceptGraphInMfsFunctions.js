import * as MiscIpfsFunctions from './miscIpfsFunctions.js'
import IpfsHttpClient from 'ipfs-http-client';

export const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

// input word must contain metaData.keyname
// it is published to IPFS, which generates a cid
// Then keyname's ipfs and new cid are linked
export const publishWordToIpfs = async (oWord) => {
    var fileToWrite = JSON.stringify(oWord,null,4)
    var fileToWrite_encoded = new TextEncoder().encode(fileToWrite)
    var oFile = {
        path: "/",
        content: fileToWrite
    }
    const addResult = await MiscIpfsFunctions.ipfs.add(oFile)
    var newCid = addResult.cid;
    console.info("added file cid: "+newCid)
    var recordedKeyname = oWord.metaData.keyname
    var options_publish = { key: recordedKeyname }
    var res = await MiscIpfsFunctions.ipfs.name.publish(newCid, options_publish)
    return res;
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
