import sendAsync from '../renderer.js';
import IpfsHttpClient from 'ipfs-http-client';
import * as MiscFunctions from './miscFunctions.js';
const jQuery = require("jquery");

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

/*
NeoroCore functions require an input, oRFL, which is an object with :
oRFL.current
oRFL.updated
( optional: oRFL.new )

with info such as e.g. oRLF.current.supersetFor_birds = { wordData: { slug: supersetFor_birds, .... } ...  }

UPDATE 31 July 2022: change this; no oRFL input is required; use window.neuroCore DOM variable to access this data
*/

export const fetchPrimaryProperty = (word_slug) => {
    var result = false;
    var oWord = window.neuroCore.subject.oRFL.current[word_slug];
    if (!oWord) {
        var oWord = window.neuroCore.engine.oRFL.current[word_slug];
    }
    if (oWord.hasOwnProperty("JSONSchemaData")) {
        result = Object.keys(oWord.properties)[0];
        return result
    }
    if (oWord.hasOwnProperty("conceptData")) {
        result = oWord.conceptData.primaryProperty;
        return result
    }
    return result;
}

// input wordTypeSlug; if this has a superset underneath it, return name of superset; if not, return false
export const fetchSupersetFromWordType = (wordTypeSlug,oRFL) => {
    var answer = false;

    try {
        var oWordType = oRFL.current[wordTypeSlug];
        if (oWordType.hasOwnProperty("wordTypeData")) {
            var oWordTypeData = oWordType.wordTypeData;
            var governingConcept_slug = oWordTypeData.metaData.governingConcept.slug;
            var oConcept = oRFL.current[governingConcept_slug];
            var supersetSlug = oConcept.conceptData.nodes.superset.slug;
            answer = supersetSlug;
        }
    } catch(e) {}

    return answer;
}

export const fetchSchemaFromWordType = (wordType_slug,oRFL) => {
    var schemaSlug = null;
    var oWordType = oRFL.current[wordType_slug];
    var oWordTypeData = oWordType.wordTypeData;
    var governingConcept_slug = oWordTypeData.metaData.governingConcept.slug;
    var oConcept = oRFL.current[governingConcept_slug];
    var schemaSlug = oConcept.conceptData.nodes.schema.slug;
    return schemaSlug;
}

export const fetchNewestRawFile = (wordSlug,oRFL) => {
    var oWord = false;
    if (oRFL.updated.hasOwnProperty(wordSlug)) {
        var oWord = MiscFunctions.cloneObj(oRFL.updated[wordSlug]);
    } else {
        if (oRFL.current.hasOwnProperty(wordSlug)) {
            var oWord = MiscFunctions.cloneObj(oRFL.current[wordSlug]);
        }
    }
    // console.log("fetchNewestRawFile; oWord: "+JSON.stringify(oWord,null,4))
    /*
    if (window.neuroCore.oRFL.updated.hasOwnProperty(wordSlug)) {
        var oWord = window.neuroCore.oRFL.updated[wordSlug];
    } else {
        if (oRFL.updated.hasOwnProperty(wordSlug)) {
            var oWord = oRFL.updated[wordSlug];
        } else {
            var oWord = oRFL.current[wordSlug];
        }
    }
    */
    // oWord = MiscFunctions.cloneObj(oWord);
    return oWord;
}

export const fetchPropertyPathFromSlug = (wordSlug,oRFL) => {
    var propertyPath = "error";
    try {
        var oWord = oRFL.current[wordSlug];
        var governingConcept_slug = oWord.wordTypeData.metaData.governingConcept.slug;
        var oGoverningConcept = oRFL.current[governingConcept_slug];
        if (oGoverningConcept) {
            propertyPath = oGoverningConcept.conceptData.propertyPath;
        }
    } catch (e) {}

    return propertyPath;
}

// returns array of definition keys, e.g. aDefinitionKeys = [dogData,cowData]
// Look inside oJSONSchema, find each occurrence of:
// $ref: "#/definitions/[definitionKey]" (e.g. definitionKey = dogData)
// and return array of definitionKeys
// !!! probably deprecating usage of this function.
export const fetchDefinitionKeysFromJSONSchema = (jsonSchemaSlug,oRFL) => {
    var aDefinitionKeys = [ "dogData" ];
    return aDefinitionKeys;
}

export const fetchMainDefinitionInfoFromWordType = (wordTypeSlug,oRFL) => {
    var aDefinitionInfo = [ "_error_", {"a": "b"} ];
    try {
        var oWordType = oRFL.current[wordTypeSlug];
        var governingConcept_slug = oWordType.wordTypeData.metaData.governingConcept.slug;
        var oGoverningConcept = oRFL.current[governingConcept_slug];
        var propertyPath = oGoverningConcept.conceptData.propertyPath;
        var jsonSchemaSlug = oGoverningConcept.conceptData.nodes.JSONSchema.slug;
        var oJSONSchema = oRFL.current[jsonSchemaSlug];
        var oDefinition = oJSONSchema.properties[propertyPath];

        var aDefinitionInfo = [ propertyPath, oDefinition ];
    } catch (err) {}
    return aDefinitionInfo;
}

// currently called by A.rV.u2n.init.
export const removePatternCodesWithUniqueID = (aPatternCodes,uniqueID) => {
    var aPatternCodes_output = [];
    for (var p=0;p < aPatternCodes.length;p++) {
        var nextPatternCode = aPatternCodes[p];
        if (!nextPatternCode.includes(uniqueID)) {
            aPatternCodes_output.push(nextPatternCode)
        }
    }
    // TEMPORARILY DISABLING the function of this function (it now simply returns the input array without changing it)
    // because currently the elements of this array get rearranged with each pass, the result being that NeuroCore iterates over and over
    // without stopping. Potential solutions: add a function to set elements of an array in alphabetical order; don't remove element if
    // it is simply going to be added right back on the same pass.
    // ALSO ought to depreceate away ActionCodes from A.rV.u2n.init
    // return aPatternCodes_output;
    return aPatternCodes;
}
