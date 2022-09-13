import * as MiscFunctions from '../../../functions/miscFunctions.js';
import * as ConceptGraphFunctions from '../../../functions/conceptGraphFunctions.js';
import { oActionDataOutputTemplate } from './constants.js';

const jQuery = require("jquery");

// const fs = require('fs-extra');

// let data = "This is a file containing a collection of books.";

/*
fs.writeFile("books.txt", data, (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
    console.log("The written has the following contents:");
    // console.log(fs.readFileSync("books.txt", "utf8"));
  }
});
*/
const jsFromSQL = {};
jsFromSQL.a_b_u1n_01 = `
console.log("jsFromSQL.a_b_u1n_01");
var key1 = oNodeFrom.propertyData.key
var obj1 = oNodeFrom.propertyData
delete obj1.key;
delete obj1.metaData;
oNodeTo.propertyData.properties[key1] = obj1
oRFL.updated[nT_slug] = oNodeTo;
`;
/*
window.lookupActionJavascriptByName["A.b.u1n.01"] = `
console.log("lookupActionJavascriptByName A.b.u1n.01");
var key1 = oNodeFrom.propertyData.key
var obj1 = oNodeFrom.propertyData
delete obj1.key;
delete obj1.metaData;
oNodeTo.propertyData.properties[key1] = obj1
oRFL.updated[nT_slug] = oNodeTo;
`;
*/

export const a_b_u1n_01 = (oActionDataInput) => {
    var oAuxiliaryData = oActionDataInput.oAuxiliaryData;
    var oRFL = oActionDataInput.oRawFileLookup;
    var oActionDataOutput = MiscFunctions.cloneObj(oActionDataOutputTemplate);
    // console.log("a_b_u1n_01; oAuxiliaryData: "+JSON.stringify(oAuxiliaryData,null,4))
    var nF_slug = oAuxiliaryData.relationship.nodeFrom.slug;
    // console.log("nF_slug: "+JSON.stringify(nF_slug,null,4))
    if (oRFL.updated.hasOwnProperty(nF_slug)) {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.updated[nF_slug]);
    } else {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.current[nF_slug]);
    }
    var nT_slug = oAuxiliaryData.relationship.nodeTo.slug;
    // console.log("nT_slug: "+JSON.stringify(nT_slug,null,4))
    if (oRFL.updated.hasOwnProperty(nT_slug)) {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.updated[nT_slug]);
    } else {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);
    }

    // start: specific to this Action
    console.log("aboutToTriggerAction: a_b_u1n_01; nF_slug / nT_slug: "+nF_slug+" / "+nT_slug)
    console.log("oNodeFrom: "+JSON.stringify(oNodeFrom,null,4))
    try {
        /*
        var key1 = oNodeFrom.propertyData.key
        var obj1 = oNodeFrom.propertyData
        delete obj1.key;
        delete obj1.metaData;
        oNodeTo.propertyData.properties[key1] = obj1
        oRFL.updated[nT_slug] = oNodeTo;
        */
        // eval(jsFromSQL.a_b_u1n_01);
        eval(window.lookupActionJavascriptByName["A.b.u1n.01"]);
    } catch(err) {
        console.log("javaScriptError with action a_b_u1n_01; err: "+err)
    }
    // end: specific to this Action

    oActionDataOutput.oRawFileLookup.updated = oRFL.updated;
    return oActionDataOutput;
}

export const a_b_u1n_02 = (oActionDataInput) => {
    var oAuxiliaryData = oActionDataInput.oAuxiliaryData;
    var oRFL = oActionDataInput.oRawFileLookup;
    var oActionDataOutput = MiscFunctions.cloneObj(oActionDataOutputTemplate);
    console.log("a_b_u1n_02; oAuxiliaryData: "+JSON.stringify(oAuxiliaryData,null,4))
    var nF_slug = oAuxiliaryData.relationship.nodeFrom.slug;
    console.log("nF_slug: "+JSON.stringify(nF_slug,null,4))
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

    // start: specific to this Action
    console.log("aboutToTriggerAction: a_b_u1n_02; nF_slug / nT_slug: "+nF_slug+" / "+nT_slug)
    try {
        /*
        var arr1 = oNodeFrom.globalDynamicData.specificInstances
        var uniquePropertyKey = oAuxiliaryData.relationship.relationshipType.restrictsValueData.uniquePropertyKey
        var propertyPath = oAuxiliaryData.relationship.relationshipType.restrictsValueData.propertyPath
        var arr2 = ConceptGraphFunctions.translateSlugsToUniquePropertyValues(arr1,propertyPath,uniquePropertyKey)
        oNodeTo.propertyData.enum = arr2;
        oRFL.updated[nT_slug] = oNodeTo;
        */
        // eval(window.lookupActionJavascriptByName["A.b.u1n.02"]);
        // var F = new Function(window.lookupActionJavascriptByName["A.b.u1n.02"])
        // F();
        setTimeout(window.lookupActionJavascriptByName["A.b.u1n.02"],1)
    } catch(err) {
        console.log("javaScriptError with action a_b_u1n_02; err: "+err)
    }
    // end: specific to this Action

    oActionDataOutput.oRawFileLookup.updated = oRFL.updated;
    return oActionDataOutput;
}

export const a_b_u1n_03 = (oActionDataInput) => {
    var oAuxiliaryData = oActionDataInput.oAuxiliaryData;
    var oRFL = oActionDataInput.oRawFileLookup;
    var oActionDataOutput = MiscFunctions.cloneObj(oActionDataOutputTemplate);
    // console.log("a_b_u1n_03; oAuxiliaryData: "+JSON.stringify(oAuxiliaryData,null,4))
    var nF_slug = oAuxiliaryData.relationship.nodeFrom.slug;
    // console.log("nF_slug: "+JSON.stringify(nF_slug,null,4))
    if (oRFL.updated.hasOwnProperty(nF_slug)) {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.updated[nF_slug]);
    } else {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.current[nF_slug]);
    }
    var nT_slug = oAuxiliaryData.relationship.nodeTo.slug;
    // console.log("nT_slug: "+JSON.stringify(nT_slug,null,4))
    if (oRFL.updated.hasOwnProperty(nT_slug)) {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.updated[nT_slug]);
    } else {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);
    }

    // start: specific to this Action
    // console.log("aboutToTriggerAction: a_b_u1n_03; nF_slug / nT_slug: "+nF_slug+" / "+nT_slug)
    try {
        eval(window.lookupActionJavascriptByName["A.b.u1n.03"]);
    } catch(err) {
        console.log("javaScriptError with action a_b_u1n_03; err: "+err)
    }
    // end: specific to this Action

    oActionDataOutput.oRawFileLookup.updated = oRFL.updated;
    return oActionDataOutput;
}

export const a_b_u1n_04 = (oActionDataInput) => {
    var oAuxiliaryData = oActionDataInput.oAuxiliaryData;
    var oRFL = oActionDataInput.oRawFileLookup;
    var oActionDataOutput = MiscFunctions.cloneObj(oActionDataOutputTemplate);
    console.log("a_b_u1n_04; oAuxiliaryData: "+JSON.stringify(oAuxiliaryData,null,4))
    var nF_slug = oAuxiliaryData.relationship.nodeFrom.slug;
    console.log("nF_slug: "+JSON.stringify(nF_slug,null,4))
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

    // start: specific to this Action
    console.log("aboutToTriggerAction: a_b_u1n_04; nF_slug / nT_slug: "+nF_slug+" / "+nT_slug)
    try {
        /*
        var key1 = oNodeFrom.propertyData.key
        var obj1 = oNodeFrom.propertyData;
        delete obj1.key;
        delete obj1.metaData;
        oNodeTo.required = [key1];
        oNodeTo.properties[key1] = obj1
        oRFL.updated[nT_slug] = oNodeTo;
        */
        eval(window.lookupActionJavascriptByName["A.b.u1n.04"]);
    } catch(err) {
        console.log("javaScriptError with action a_b_u1n_04; err: "+err)
    }
    // end: specific to this Action

    oActionDataOutput.oRawFileLookup.updated = oRFL.updated;
    return oActionDataOutput;
}

export const a_b_u1n_05 = (oActionDataInput) => {
    var oAuxiliaryData = oActionDataInput.oAuxiliaryData;
    var oRFL = oActionDataInput.oRawFileLookup;
    var oActionDataOutput = MiscFunctions.cloneObj(oActionDataOutputTemplate);
    // console.log("a_b_u1n_05; oAuxiliaryData: "+JSON.stringify(oAuxiliaryData,null,4))
    var nF_slug = oAuxiliaryData.relationship.nodeFrom.slug;
    // console.log("nF_slug: "+JSON.stringify(nF_slug,null,4))
    if (oRFL.updated.hasOwnProperty(nF_slug)) {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.updated[nF_slug]);
    } else {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.current[nF_slug]);
    }
    var nT_slug = oAuxiliaryData.relationship.nodeTo.slug;
    // console.log("nT_slug: "+JSON.stringify(nT_slug,null,4))
    if (oRFL.updated.hasOwnProperty(nT_slug)) {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.updated[nT_slug]);
    } else {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);
    }

    // start: specific to this Action
    // console.log("aboutToTriggerAction: a_b_u1n_05; nF_slug / nT_slug: "+nF_slug+" / "+nT_slug)
    try {

    } catch(err) {
        console.log("javaScriptError with action a_b_u1n_05; err: "+err)
    }
    // end: specific to this Action

    oActionDataOutput.oRawFileLookup.updated = oRFL.updated;
    return oActionDataOutput;
}

export const a_b_u1n_06 = (oActionDataInput) => {
    var oAuxiliaryData = oActionDataInput.oAuxiliaryData;
    var oRFL = oActionDataInput.oRawFileLookup;
    var oActionDataOutput = MiscFunctions.cloneObj(oActionDataOutputTemplate);
    // console.log("a_b_u1n_06; oAuxiliaryData: "+JSON.stringify(oAuxiliaryData,null,4))
    var nF_slug = oAuxiliaryData.relationship.nodeFrom.slug;
    // console.log("nF_slug: "+JSON.stringify(nF_slug,null,4))
    if (oRFL.updated.hasOwnProperty(nF_slug)) {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.updated[nF_slug]);
    } else {
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.current[nF_slug]);
    }
    var nT_slug = oAuxiliaryData.relationship.nodeTo.slug;
    // console.log("nT_slug: "+JSON.stringify(nT_slug,null,4))
    if (oRFL.updated.hasOwnProperty(nT_slug)) {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.updated[nT_slug]);
    } else {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);
    }

    // start: specific to this Action
    // console.log("aboutToTriggerAction: a_b_u1n_06; nF_slug / nT_slug: "+nF_slug+" / "+nT_slug)
    try {

    } catch(err) {
        console.log("javaScriptError with action a_b_u1n_06; err: "+err)
    }
    // end: specific to this Action

    oActionDataOutput.oRawFileLookup.updated = oRFL.updated;
    return oActionDataOutput;
}
