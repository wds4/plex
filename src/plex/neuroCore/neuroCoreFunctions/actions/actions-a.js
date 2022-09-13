import * as MiscFunctions from '../../../functions/miscFunctions.js';
import { oActionDataOutputTemplate } from './constants.js';
const jQuery = require("jquery"); 

const jsFromSQL_ = {};
jsFromSQL_.a_a_u1n_01 = `
console.log("jsFromSQL.a_a_u1n_01");
oNodeTo.globalDynamicData.valenceData.valenceL1 = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.valenceData.valenceL1,nF_slug)
oRFL.updated[nT_slug] = oNodeTo;
`;

export const a_a_u1n_01 = (oActionDataInput) => {
    var oAuxiliaryData = oActionDataInput.oAuxiliaryData;
    var oRFL = oActionDataInput.oRawFileLookup;
    var oActionDataOutput = MiscFunctions.cloneObj(oActionDataOutputTemplate);
    // console.log("a_a_u1n_01; oAuxiliaryData: "+JSON.stringify(oAuxiliaryData,null,4))
    var nF_slug = oAuxiliaryData.relationship.nodeFrom.slug;
    // console.log("nF_slug: "+JSON.stringify(nF_slug,null,4))
    if (oRFL.updated.hasOwnProperty(nF_slug)) {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.updated[nF_slug]);
    } else {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.current[nF_slug]);
    }
    var nT_slug = oAuxiliaryData.relationship.nodeTo.slug;
    console.log("nT_slug: "+JSON.stringify(nT_slug,null,4))
    if (oRFL.updated.hasOwnProperty(nT_slug)) {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.updated[nT_slug]);
    } else {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);
    }
    var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);

    // start: specific to this Action
    console.log("aboutToTriggerAction A: a_a_u1n_01; nF_slug / nT_slug: "+nF_slug+" / "+nT_slug)
    /*
    oNodeTo.globalDynamicData.valenceData.valenceL1 = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.valenceData.valenceL1,nF_slug)
    oRFL.updated[nT_slug] = oNodeTo;
    */
    try {

        console.log("NOT javaScriptError a")
        oNodeTo.globalDynamicData.valenceData.valenceL1 = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.valenceData.valenceL1,nF_slug)
        oRFL.updated[nT_slug] = oNodeTo;
        console.log("aboutToTriggerAction B: a_a_u1n_01; nF_slug / nT_slug: "+nF_slug+" / "+nT_slug)

        // eval(window.lookupActionJavascriptByName["A.a.u1n.01"]);
        // var F = new Function(window.lookupActionJavascriptByName["A.a.u1n.01"])
        // F(MiscFunctions,oNodeTo);
        // setTimeout(window.lookupActionJavascriptByName["A.a.u1n.01"],1)
    } catch(err) {
        console.log("javaScriptError with action a_a_u1n_01; err: "+err)
    }
    // end: specific to this Action

    oActionDataOutput.oRawFileLookup.updated = oRFL.updated;
    return oActionDataOutput;
}

export const a_a_u1n_02 = (oActionDataInput) => {
    var oAuxiliaryData = oActionDataInput.oAuxiliaryData;
    var oRFL = oActionDataInput.oRawFileLookup;
    var oActionDataOutput = MiscFunctions.cloneObj(oActionDataOutputTemplate);
    var nF_slug = oAuxiliaryData.relationship.nodeFrom.slug;
    if (oRFL.updated.hasOwnProperty(nF_slug)) {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.updated[nF_slug]);
    } else {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.current[nF_slug]);
    }
    var nT_slug = oAuxiliaryData.relationship.nodeTo.slug;
    if (oRFL.updated.hasOwnProperty(nT_slug)) {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.updated[nT_slug]);
    } else {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);
    }

    // start: specific to this Action
    // console.log("aboutToTriggerAction: a_a_u1n_02; nF_slug / nT_slug: "+nF_slug+" / "+nT_slug)
    // oNodeFrom.globalDynamicData.valenceData.valenceL1 = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeFrom.globalDynamicData.valenceData.valenceL1,oNodeTo.globalDynamicData.valenceData.valenceL1);
    // oRFL.updated[nF_slug] = oNodeFrom;
    try {
        // console.log("NOT javaScriptError a_a_u1n_02 a")

        console.log("aboutToTriggerAction: a_a_u1n_02; nF_slug / nT_slug: "+nF_slug+" / "+nT_slug)
        oNodeFrom.globalDynamicData.valenceData.valenceL1 = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeFrom.globalDynamicData.valenceData.valenceL1,oNodeTo.globalDynamicData.valenceData.valenceL1);
        oRFL.updated[nF_slug] = oNodeFrom;

        // eval(window.lookupActionJavascriptByName["A.a.u1n.02"]);
        // const F = new Function(window.lookupActionJavascriptByName["A.a.u1n.02"])
        // F(MiscFunctions);
        // setTimeout(window.lookupActionJavascriptByName["A.a.u1n.02"],1)
    } catch(err) {
        console.log("javaScriptError with action a_a_u1n_02; err: "+err)
    }
    // end: specific to this Action

    oActionDataOutput.oRawFileLookup.updated = oRFL.updated;
    return oActionDataOutput;
}

export const a_a_u1n_03 = (oActionDataInput) => {
    var oAuxiliaryData = oActionDataInput.oAuxiliaryData;
    var oRFL = oActionDataInput.oRawFileLookup;
    var oActionDataOutput = MiscFunctions.cloneObj(oActionDataOutputTemplate);
    var nF_slug = oAuxiliaryData.relationship.nodeFrom.slug;

    if (oRFL.updated.hasOwnProperty(nF_slug)) {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.updated[nF_slug]);
    } else {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.current[nF_slug]);
    }
    var nT_slug = oAuxiliaryData.relationship.nodeTo.slug;
    if (oRFL.updated.hasOwnProperty(nT_slug)) {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.updated[nT_slug]);
    } else {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);
    }

    // start: specific to this Action
    // console.log("aboutToTriggerAction: a_a_u1n_03; nF_slug / nT_slug: "+nF_slug+" / "+nT_slug)
    if (!oNodeTo.globalDynamicData.hasOwnProperty("subsets")) {
        oNodeTo.globalDynamicData.subsets = [];
    }
    oNodeTo.globalDynamicData.subsets = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.subsets,nF_slug);
    oRFL.updated[nT_slug] = oNodeTo;
    try {

    } catch(err) {
        console.log("javaScriptError with action a_a_u1n_03; err: "+err)
    }
    // end: specific to this Action

    oActionDataOutput.oRawFileLookup.updated = oRFL.updated;
    return oActionDataOutput;
}

export const a_a_u1n_04 = (oActionDataInput) => {
    var oAuxiliaryData = oActionDataInput.oAuxiliaryData;
    var oRFL = oActionDataInput.oRawFileLookup;
    var oActionDataOutput = MiscFunctions.cloneObj(oActionDataOutputTemplate);
    var nF_slug = oAuxiliaryData.relationship.nodeFrom.slug;
    if (oRFL.updated.hasOwnProperty(nF_slug)) {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.updated[nF_slug]);
    } else {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.current[nF_slug]);
    }
    var nT_slug = oAuxiliaryData.relationship.nodeTo.slug;
    if (oRFL.updated.hasOwnProperty(nT_slug)) {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.updated[nT_slug]);
    } else {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);
    }

    // start: specific to this Action
    // console.log("aboutToTriggerAction: a_a_u1n_04; nF_slug / nT_slug: "+nF_slug+" / "+nT_slug)
    if (!oNodeFrom.globalDynamicData.hasOwnProperty("subsets")) {
        oNodeFrom.globalDynamicData.subsets = [];
    }
    if (!oNodeTo.globalDynamicData.hasOwnProperty("subsets")) {
        oNodeTo.globalDynamicData.subsets = [];
    }
    oNodeTo.globalDynamicData.subsets = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeTo.globalDynamicData.subsets,oNodeFrom.globalDynamicData.subsets);
    oRFL.updated[nT_slug] = oNodeTo;
    try {

    } catch(err) {
        console.log("javaScriptError with action a_a_u1n_04; err: "+err)
    }
    // end: specific to this Action

    oActionDataOutput.oRawFileLookup.updated = oRFL.updated;
    return oActionDataOutput;
}

export const a_a_u1n_05 = (oActionDataInput) => {
    var oAuxiliaryData = oActionDataInput.oAuxiliaryData;
    var oRFL = oActionDataInput.oRawFileLookup;
    var oActionDataOutput = MiscFunctions.cloneObj(oActionDataOutputTemplate);
    var nF_slug = oAuxiliaryData.relationship.nodeFrom.slug;
    if (oRFL.updated.hasOwnProperty(nF_slug)) {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.updated[nF_slug]);
    } else {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.current[nF_slug]);
    }
    var nT_slug = oAuxiliaryData.relationship.nodeTo.slug;
    if (oRFL.updated.hasOwnProperty(nT_slug)) {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.updated[nT_slug]);
    } else {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);
    }
    // var oNodeFrom = MiscFunctions.cloneObj(oRFL.current[nF_slug]);
    // var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);

    // start: specific to this Action
    // console.log("aboutToTriggerAction: a_a_u1n_05; nF_slug / nT_slug: "+nF_slug+" / "+nT_slug+"; oNodeTo: "+JSON.stringify(oNodeTo,null,4))
    // console.log("aboutToTriggerAction: a_a_u1n_05; nF_slug / nT_slug: "+nF_slug+" / "+nT_slug)
    if (!oNodeFrom.globalDynamicData.hasOwnProperty("specificInstances")) {
        oNodeFrom.globalDynamicData.specificInstances = [];
    }
    if (!oNodeTo.globalDynamicData.hasOwnProperty("specificInstances")) {
        oNodeTo.globalDynamicData.specificInstances = [];
    }
    oNodeTo.globalDynamicData.specificInstances = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeTo.globalDynamicData.specificInstances,oNodeFrom.globalDynamicData.specificInstances);
    oRFL.updated[nT_slug] = oNodeTo;
    try {

    } catch(err) {
        console.log("javaScriptError with action a_a_u1n_05; err: "+err)
    }
    // end: specific to this Action

    oActionDataOutput.oRawFileLookup.updated = oRFL.updated;
    return oActionDataOutput;
}

export const a_a_u1n_06 = (oActionDataInput) => {
    var oAuxiliaryData = oActionDataInput.oAuxiliaryData;
    var oRFL = oActionDataInput.oRawFileLookup;
    var oActionDataOutput = MiscFunctions.cloneObj(oActionDataOutputTemplate);
    var nF_slug = oAuxiliaryData.relationship.nodeFrom.slug;
    if (oRFL.updated.hasOwnProperty(nF_slug)) {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.updated[nF_slug]);
    } else {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.current[nF_slug]);
    }
    var nT_slug = oAuxiliaryData.relationship.nodeTo.slug;
    if (oRFL.updated.hasOwnProperty(nT_slug)) {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.updated[nT_slug]);
    } else {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);
    }

    // start: specific to this Action
    // console.log("aboutToTriggerAction: a_a_u1n_06; nF_slug / nT_slug: "+nF_slug+" / "+nT_slug)
    oNodeFrom.globalDynamicData.valenceData.parentJSONSchemaSequence = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeFrom.globalDynamicData.valenceData.parentJSONSchemaSequence,oNodeTo.globalDynamicData.valenceData.valenceL1);
    oRFL.updated[nF_slug] = oNodeFrom;
    try {

    } catch(err) {
        console.log("javaScriptError with action a_a_u1n_06; err: "+err)
    }
    // end: specific to this Action

    oActionDataOutput.oRawFileLookup.updated = oRFL.updated;
    return oActionDataOutput;
}

export const a_a_u1n_07 = (oActionDataInput) => {
    var oAuxiliaryData = oActionDataInput.oAuxiliaryData;
    var oRFL = oActionDataInput.oRawFileLookup;
    var oActionDataOutput = MiscFunctions.cloneObj(oActionDataOutputTemplate);
    var nF_slug = oAuxiliaryData.relationship.nodeFrom.slug;
    if (oRFL.updated.hasOwnProperty(nF_slug)) {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.updated[nF_slug]);
    } else {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.current[nF_slug]);
    }
    var nT_slug = oAuxiliaryData.relationship.nodeTo.slug;
    if (oRFL.updated.hasOwnProperty(nT_slug)) {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.updated[nT_slug]);
    } else {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);
    }

    // start: specific to this Action
    // console.log("aboutToTriggerAction: a_a_u1n_07; nF_slug / nT_slug: "+nF_slug+" / "+nT_slug)
    oNodeTo.globalDynamicData.specificInstances = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.specificInstances,nF_slug);
    oRFL.updated[nT_slug] = oNodeTo;
    try {

    } catch(err) {
        console.log("javaScriptError with action a_a_u1n_07; err: "+err)
    }
    // end: specific to this Action

    oActionDataOutput.oRawFileLookup.updated = oRFL.updated;
    return oActionDataOutput;
}
