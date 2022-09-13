import sendAsync from '../renderer.js';
import IpfsHttpClient from 'ipfs-http-client';
import * as MiscFunctions from './miscFunctions.js';
const jQuery = require("jquery");

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

// input: conceptSlug; or oConcept; maybe expand to other possible inputs (validate input before proceeding)
// output: an array of unique fields for the top level (i.e. the primaryProperty)
// for most concepts, output will be: aPropertyKeys = [name, title, slug]
// May 2022: keys are located in oPrimaryProperty.propertyData.unique which is an array
// future: may keep a record of these in oConcept.conceptData for ease of fetching
// future: may make a function to fetch unique propertyKeys from any object property, not just the top level
// ==> will be called fetchUniquePropertyKeys and will input the propertySlug
export const fetchUniqueTopLevelPropertyKeys = (input) => {
    // validate that input is the slug for a concept in the active concept graph
    // future: may allow input to be the concept itself (in object or string form) or primaryProperty slug or word (object or string form)
    var aPropertyKeys = [];
    var oConcept = window.lookupWordBySlug[input];
    if (oConcept.hasOwnProperty("conceptData")) {
        var primaryPropertySlug = oConcept.conceptData.nodes.primaryProperty.slug;
        var oPrimaryProperty = window.lookupWordBySlug[primaryPropertySlug];
        if (oPrimaryProperty.propertyData.hasOwnProperty("unique")) {
            aPropertyKeys = oPrimaryProperty.propertyData.unique;
        }
    }

    return aPropertyKeys;
}

// input array of slugs (e.g. dog, cat); output an array of values (e.g. if title, then: Dog, Cat)
// uniqueKey usually would be something like "name" or "title"
export const translateSlugsToUniquePropertyValues = (aSlugs,propertyPath,uniquePropertyKey) => {
    // console.log("translateSlugsToUniquePropertyValues; propertyPath: "+propertyPath+"; uniquePropertyKey: "+uniquePropertyKey)
    var aValues = [];
    for (var s=0;s<aSlugs.length;s++) {
        var nextSlug = aSlugs[s];
        // console.log("translateSlugsToUniquePropertyValues; nextSlug: "+nextSlug)
        var oWord = window.lookupWordBySlug[nextSlug];
        // might want to add verification that uniqueKey is, in fact, expected to be unique in this concept
        var sTranslation = oWord[propertyPath][uniquePropertyKey];
        aValues.push(sTranslation);
    }
    return aValues;
}

// input oNode; output oNode with keys added if not already there:
// globalDynamicData.nodePatternCodes = [];
// globalDynamicData.actionCodes = [];
// globalDynamicData.restrictsValueManagement = {};
export const init_gDD_rVM_keys = (oNode) => {
    var oNode_updated = MiscFunctions.cloneObj(oNode);

    if (!oNode_updated.globalDynamicData.hasOwnProperty("nodePatternCodes")) {
        oNode_updated.globalDynamicData.nodePatternCodes = [];
    }
    if (!oNode_updated.globalDynamicData.hasOwnProperty("actionCodes")) {
        oNode_updated.globalDynamicData.actionCodes = [];
    }
    if (!oNode_updated.globalDynamicData.hasOwnProperty("restrictsValueManagement")) {
        oNode_updated.globalDynamicData.restrictsValueManagement = {};
    }

    return oNode_updated;
}
