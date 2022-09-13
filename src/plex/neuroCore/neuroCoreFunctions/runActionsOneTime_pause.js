import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as ConceptGraphFunctions from '../../functions/conceptGraphFunctions.js';
import * as A_a from './actions/actions-a.js';
import * as A_b from './actions/actions-b.js';
import * as A_c from './actions/actions-b.js';
import * as A_rV0 from './actions/actions-rV0.js';
import { oActionDataOutputTemplate } from './actions/constants.js';
const jQuery = require("jquery");

const updateRawFile = (oUpdatedRawFileLookup) => {
    var sRawFileLookupNew = JSON.stringify(oUpdatedRawFileLookup,null,4)
    jQuery("#newUpdatedRawFileLookupContainer").html(sRawFileLookupNew)
    jQuery("#newUpdatedRawFileLookupContainer").val(sRawFileLookupNew)

    jQuery("#rawFileLookupUpdateButton").trigger("click")
}

// map the name of the action to one (or more?) functions required by that action
const executeSingleAction = (actionName,oAuxiliaryData,oRawFileLookup) => {
    var oActionData = {};
    oActionData.oAuxiliaryData = oAuxiliaryData;
    oActionData.oRawFileLookup = oRawFileLookup;
    var oRFL = MiscFunctions.cloneObj(oRawFileLookup)
    var verboseConsole = true;

    var oActionDataInput =  MiscFunctions.cloneObj(oActionData);
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
    console.log("nT_slug: "+JSON.stringify(nT_slug,null,4))
    if (oRFL.updated.hasOwnProperty(nT_slug)) {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.updated[nT_slug]);
    } else {
        var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);
    }
    var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);

    switch (actionName) {
         case "A.a.u1n.01": 
             if (verboseConsole) { console.log("case A.a.u1n.01") } 
             // var oActionDataOutput = MiscFunctions.cloneObj(A_a.a_a_u1n_01(oActionData)); 
              try { 
oNodeTo.globalDynamicData.valenceData.valenceL1 = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.valenceData.valenceL1, nF_slug);
oRFL.updated[nT_slug] = oNodeTo;
             } catch (err) { console.log("javaScriptError with action a_a_u1n_01; err: "+err) } 
             oActionDataOutput.oRawFileLookup.updated = oRFL.updated; 
             oRFL = oActionDataOutput.oRawFileLookup; 
             break; 
         case "A.a.u1n.02": 
             if (verboseConsole) { console.log("case A.a.u1n.02") } 
             // var oActionDataOutput = MiscFunctions.cloneObj(A_a.a_a_u1n_02(oActionData)); 
              try { 
oNodeFrom.globalDynamicData.valenceData.valenceL1 = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeFrom.globalDynamicData.valenceData.valenceL1,oNodeTo.globalDynamicData.valenceData.valenceL1);
oRFL.updated[nF_slug] = oNodeFrom;
             } catch (err) { console.log("javaScriptError with action a_a_u1n_02; err: "+err) } 
             oActionDataOutput.oRawFileLookup.updated = oRFL.updated; 
             oRFL = oActionDataOutput.oRawFileLookup; 
             break; 
         case "A.b.u1n.01": 
             if (verboseConsole) { console.log("case A.b.u1n.01") } 
             // var oActionDataOutput = MiscFunctions.cloneObj(A_b.a_b_u1n_01(oActionData)); 
              try { 
var key1 = oNodeFrom.propertyData.key
var obj1 = oNodeFrom.propertyData
delete obj1.key;
delete obj1.metaData;
oNodeTo.propertyData.properties[key1] = obj1
oRFL.updated[nT_slug] = oNodeTo;
             } catch (err) { console.log("javaScriptError with action a_b_u1n_01; err: "+err) } 
             oActionDataOutput.oRawFileLookup.updated = oRFL.updated; 
             oRFL = oActionDataOutput.oRawFileLookup; 
             break; 
         case "A.b.u1n.02": 
             if (verboseConsole) { console.log("case A.b.u1n.02") } 
             // var oActionDataOutput = MiscFunctions.cloneObj(A_b.a_b_u1n_02(oActionData)); 
              try { 
var arr1 = oNodeFrom.globalDynamicData.specificInstances;
var uniquePropertyKey = oAuxiliaryData.relationship.relationshipType.restrictsValueData.uniquePropertyKey;
var propertyPath = oAuxiliaryData.relationship.relationshipType.restrictsValueData.propertyPath;
var arr2 = ConceptGraphFunctions.translateSlugsToUniquePropertyValues(arr1,propertyPath,uniquePropertyKey);
oNodeTo.propertyData.enum = arr2;
oRFL.updated[nT_slug] = oNodeTo;
             } catch (err) { console.log("javaScriptError with action a_b_u1n_02; err: "+err) } 
             oActionDataOutput.oRawFileLookup.updated = oRFL.updated; 
             oRFL = oActionDataOutput.oRawFileLookup; 
             break; 
         case "A.b.u1n.03": 
             if (verboseConsole) { console.log("case A.b.u1n.03") } 
             // var oActionDataOutput = MiscFunctions.cloneObj(A_b.a_b_u1n_03(oActionData)); 
              try { 

             } catch (err) { console.log("javaScriptError with action a_b_u1n_03; err: "+err) } 
             oActionDataOutput.oRawFileLookup.updated = oRFL.updated; 
             oRFL = oActionDataOutput.oRawFileLookup; 
             break; 
         case "A.b.u1n.04": 
             if (verboseConsole) { console.log("case A.b.u1n.04") } 
             // var oActionDataOutput = MiscFunctions.cloneObj(A_b.a_b_u1n_04(oActionData)); 
              try { 
var key1 = oNodeFrom.propertyData.key;
var obj1 = oNodeFrom.propertyData;
delete obj1.key;
delete obj1.metaData;
oNodeTo.required = [key1];
oNodeTo.properties[key1] = obj1;
oRFL.updated[nT_slug] = oNodeTo;
             } catch (err) { console.log("javaScriptError with action a_b_u1n_04; err: "+err) } 
             oActionDataOutput.oRawFileLookup.updated = oRFL.updated; 
             oRFL = oActionDataOutput.oRawFileLookup; 
             break; 
         case "A.b.u1n.05": 
             if (verboseConsole) { console.log("case A.b.u1n.05") } 
             // var oActionDataOutput = MiscFunctions.cloneObj(A_b.a_b_u1n_05(oActionData)); 
              try { 

             } catch (err) { console.log("javaScriptError with action a_b_u1n_05; err: "+err) } 
             oActionDataOutput.oRawFileLookup.updated = oRFL.updated; 
             oRFL = oActionDataOutput.oRawFileLookup; 
             break; 
         case "A.b.u1n.06": 
             if (verboseConsole) { console.log("case A.b.u1n.06") } 
             // var oActionDataOutput = MiscFunctions.cloneObj(A_b.a_b_u1n_06(oActionData)); 
              try { 

             } catch (err) { console.log("javaScriptError with action a_b_u1n_06; err: "+err) } 
             oActionDataOutput.oRawFileLookup.updated = oRFL.updated; 
             oRFL = oActionDataOutput.oRawFileLookup; 
             break; 
         case "A.a.u1n.03": 
             if (verboseConsole) { console.log("case A.a.u1n.03") } 
             // var oActionDataOutput = MiscFunctions.cloneObj(A_a.a_a_u1n_03(oActionData)); 
              try { 
if (!oNodeTo.globalDynamicData.hasOwnProperty("subsets")) {
    oNodeTo.globalDynamicData.subsets = [];
}
oNodeTo.globalDynamicData.subsets = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.subsets,nF_slug);
oRFL.updated[nT_slug] = oNodeTo;
             } catch (err) { console.log("javaScriptError with action a_a_u1n_03; err: "+err) } 
             oActionDataOutput.oRawFileLookup.updated = oRFL.updated; 
             oRFL = oActionDataOutput.oRawFileLookup; 
             break; 
         case "A.a.u1n.04": 
             if (verboseConsole) { console.log("case A.a.u1n.04") } 
             // var oActionDataOutput = MiscFunctions.cloneObj(A_a.a_a_u1n_04(oActionData)); 
              try { 
if (!oNodeFrom.globalDynamicData.hasOwnProperty("subsets")) {
        oNodeFrom.globalDynamicData.subsets = [];
}
if (!oNodeTo.globalDynamicData.hasOwnProperty("subsets")) {
        oNodeTo.globalDynamicData.subsets = [];
}
oNodeTo.globalDynamicData.subsets = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeTo.globalDynamicData.subsets,oNodeFrom.globalDynamicData.subsets);
oRFL.updated[nT_slug] = oNodeTo;
             } catch (err) { console.log("javaScriptError with action a_a_u1n_04; err: "+err) } 
             oActionDataOutput.oRawFileLookup.updated = oRFL.updated; 
             oRFL = oActionDataOutput.oRawFileLookup; 
             break; 
         case "A.a.u1n.05": 
             if (verboseConsole) { console.log("case A.a.u1n.05") } 
             // var oActionDataOutput = MiscFunctions.cloneObj(A_a.a_a_u1n_05(oActionData)); 
              try { 
if (!oNodeFrom.globalDynamicData.hasOwnProperty("specificInstances")) {
        oNodeFrom.globalDynamicData.specificInstances = [];
}
if (!oNodeTo.globalDynamicData.hasOwnProperty("specificInstances")) {
        oNodeTo.globalDynamicData.specificInstances = [];
}
oNodeTo.globalDynamicData.specificInstances = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeTo.globalDynamicData.specificInstances,oNodeFrom.globalDynamicData.specificInstances);
oRFL.updated[nT_slug] = oNodeTo;
             } catch (err) { console.log("javaScriptError with action a_a_u1n_05; err: "+err) } 
             oActionDataOutput.oRawFileLookup.updated = oRFL.updated; 
             oRFL = oActionDataOutput.oRawFileLookup; 
             break; 
         case "A.a.u1n.06": 
             if (verboseConsole) { console.log("case A.a.u1n.06") } 
             // var oActionDataOutput = MiscFunctions.cloneObj(A_a.a_a_u1n_06(oActionData)); 
              try { 
oNodeFrom.globalDynamicData.valenceData.parentJSONSchemaSequence = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeFrom.globalDynamicData.valenceData.parentJSONSchemaSequence,oNodeTo.globalDynamicData.valenceData.valenceL1);
oRFL.updated[nF_slug] = oNodeFrom;
             } catch (err) { console.log("javaScriptError with action a_a_u1n_06; err: "+err) } 
             oActionDataOutput.oRawFileLookup.updated = oRFL.updated; 
             oRFL = oActionDataOutput.oRawFileLookup; 
             break; 
         case "A.a.u1n.07": 
             if (verboseConsole) { console.log("case A.a.u1n.07") } 
             // var oActionDataOutput = MiscFunctions.cloneObj(A_a.a_a_u1n_07(oActionData)); 
              try { 
oNodeTo.globalDynamicData.specificInstances = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.specificInstances,nF_slug);
oRFL.updated[nT_slug] = oNodeTo;
             } catch (err) { console.log("javaScriptError with action a_a_u1n_07; err: "+err) } 
             oActionDataOutput.oRawFileLookup.updated = oRFL.updated; 
             oRFL = oActionDataOutput.oRawFileLookup; 
             break; 


        default:
            // code
            break;
    }

    return oRFL;
}

const executeQueuedS1nActions = (oS1nPatternQueue,oMapPatternToActions,oRawFileLookup) => {
    var reportHTML = "";
    reportHTML += "executeQueuedS1nActions";
    reportHTML += "<br>";

    return reportHTML;
}

const executeQueuedS1rActions = (oS1rPatternQueue,oMapPatternToActions,oRawFileLookup) => {
    var reportHTML = "";
    reportHTML += "executeQueuedS1rActions";
    reportHTML += "<br>";
    var oRawFileLookupB = MiscFunctions.cloneObj(oRawFileLookup)
    var verboseConsole = true;

    jQuery.each( oS1rPatternQueue, function( pattern, aAuxiliaryData ) {
        var numAuxData = aAuxiliaryData.length;
        var aInducedActions = oMapPatternToActions[pattern];
        reportHTML += "pattern: "+pattern+"("+numAuxData+"); aInducedActions: "+JSON.stringify(aInducedActions,null,4);
        var numInducedActions = aInducedActions.length;
        reportHTML += "<br>";
        if (verboseConsole) { console.log("executeQueuedS1rActions; pattern: "+pattern+"; numAuxData: "+numAuxData+"; aInducedActions: "+JSON.stringify(aInducedActions,null,4) ) }
        for (var p=0;p<numAuxData;p++) {
            var oNextAuxData = aAuxiliaryData[p];
            // if (verboseConsole) { console.log("executeQueuedS1rActions; numInducedActions: "+numInducedActions) }
            for (var a=0;a<numInducedActions;a++) {
                var nextAction = aInducedActions[a];
                // if (verboseConsole) { console.log("executeQueuedS1rActions; p: "+p+"; a: "+a+"; nextAction: "+nextAction) }
                var oRawFileLookupB = MiscFunctions.cloneObj(executeSingleAction(nextAction,oNextAuxData,oRawFileLookup));
                // MiscFunctions.printObjToConsole(oRawFileLookup)
                // if (verboseConsole) { console.log { console.log("oRawFileLookupB.updated: "+JSON.stringify(oRawFileLookupB.updated,null,4)) }
                updateRawFile(oRawFileLookupB.updated);
            }
        }
    });

    // oActionDataOutput.oRawFileLookup.updated = oRFL.updated;

    return reportHTML;
}

const executeQueuedS2rActions = (oS2rPatternQueue,oMapPatternToActions,oRawFileLookup) => {
    var reportHTML = "";
    reportHTML += "executeQueuedS2rActions";
    reportHTML += "<br>";

    return reportHTML;
}

const runActionsOneTime = (thisState) => {
    var oActiveConceptGraph = thisState.activeConceptGraph;
    var oRawFileLookup = MiscFunctions.cloneObj(oActiveConceptGraph.rawFileLookup);
    // var oRawFileUpdatedLookup = oActiveConceptGraph.rawFileUpdatedLookup;
    var oPatterns = thisState.patterns;
    var oS1nPatternQueue = thisState.patterns.patternMatches.s1n;
    var oS1rPatternQueue = thisState.patterns.patternMatches.s1r;
    var oS2rPatternQueue = thisState.patterns.patternMatches.s2r;

    var oMapPatternToActions = thisState.patterns.mapPatternToActions;
    console.log("oMapPatternToActions: "+JSON.stringify(oMapPatternToActions,null,4));

    var aS1nPatternsRawSql = thisState.patterns.aS1nPatternsRawSql
    var aS1rPatternsRawSql = thisState.patterns.aS1rPatternsRawSql
    var aS2rPatternsRawSql = thisState.patterns.aS2rPatternsRawSql

    var isAllActionsChecked = jQuery("#executeAllActions").prop("checked");
    var isS1nActionsChecked = jQuery("#executeS1nActions").prop("checked");
    var isS1rActionsChecked = jQuery("#executeS1nActions").prop("checked");
    var isS2rActionsChecked = jQuery("#executeS1nActions").prop("checked");
    var isJustOneActionChecked = jQuery("#justOneAction").prop("checked");
    var isMakeActionsListChecked = jQuery("#makeActionsList").prop("checked");

    var reportHTML = "";
    if (isAllActionsChecked) {
        reportHTML += "running ALL ACTIONS triggered by PATTERNS QUEUE";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\<br>";
        reportHTML += executeQueuedS1nActions(oS1nPatternQueue,oMapPatternToActions,oRawFileLookup)
        reportHTML += executeQueuedS1rActions(oS1rPatternQueue,oMapPatternToActions,oRawFileLookup)
        reportHTML += executeQueuedS2rActions(oS2rPatternQueue,oMapPatternToActions,oRawFileLookup)
    }
    if (isS1nActionsChecked) {
        reportHTML += "running ALL ACTIONS triggered by S1n PATTERNS QUEUE";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\<br>";
        reportHTML += executeQueuedS1nActions(oS1nPatternQueue,oMapPatternToActions,oRawFileLookup)
    }
    if (isS1rActionsChecked) {
        reportHTML += "running ALL ACTIONS triggered by S1r PATTERNS QUEUE";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\<br>";
        reportHTML += executeQueuedS1rActions(oS1rPatternQueue,oMapPatternToActions,oRawFileLookup)
    }
    if (isS2rActionsChecked) {
        reportHTML += "running ALL ACTIONS triggered by S2r PATTERNS QUEUE";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\<br>";
        reportHTML += executeQueuedS2rActions(oS2rPatternQueue,oMapPatternToActions,oRawFileLookup)
    }
    if (isJustOneActionChecked) {
        reportHTML += "running JUST THE FIRST ACTION triggered by the PATTERNS QUEUE";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\<br>";
    }
    if (isMakeActionsListChecked) {
        reportHTML += "GENERATE ACTIONS QUEUE from the PATTERNS QUEUE)";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\<br>";
    }
    jQuery("#neuroCoreReportContainer").html(reportHTML)
    jQuery("#neuroCoreReportContainer").val(reportHTML)

    // jQuery("#patternMatchesButton").trigger("click")

}

export { runActionsOneTime };

