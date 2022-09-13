import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as ConceptGraphFunctions from '../../functions/conceptGraphFunctions.js';
import * as A_a from './actions/actions-a.js';
import * as A_b from './actions/actions-b.js';
import * as A_c from './actions/actions-b.js';
import * as A_rV0 from './actions/actions-rV0.js';
import { oActionDataOutputTemplate } from './actions/constants.js';
const jQuery = require("jquery");


/*
Every individual action function inputs a single object obj:
    obj.oAuxilaryData = {} - an ojbect whose format is particular to the Action Group
    Action Group = opCodeB? may redefine this at some point; ought to group Actions into Groups depending on
    what auxiliary data is required. Or ought to group them according to the types of updates? That may not be necessary.
    obj.oRawFileLookup = {} which carries state information from NeuroCoreMonitoringPanel; therefore:
    obj.oRawFileLookup.current = {}; This should contain the entire unaltered Concept Graph
    obj.oRawFileLookup.updated = {}; This should contain changes that have been made
And outputs a single object obj:
    obj.errors = {}
    obj.oRawFileLookup.updated = {} - nodes that have been updated by this action. No other nodes should be included.
        ? whether this should specify whether the updated node is any different from the current node,
        or whether that should be checked later.
    obj.oRawFileLookup.new = {} - contains nodes that are binge created anew by this action,
        and have been created (including IPNS) but haven't yet been put into SQL.
    obj.oRawFileLookup.deleted = [] - list of nodes that must be deleted from the ConceptGraph

*/

const updateRawFile = (oUpdatedRawFileLookup) => {
    var sRawFileLookupNew = JSON.stringify(oUpdatedRawFileLookup,null,4)
    jQuery("#newUpdatedRawFileLookupContainer").html(sRawFileLookupNew)
    jQuery("#newUpdatedRawFileLookupContainer").val(sRawFileLookupNew)

    jQuery("#rawFileLookupUpdateButton").trigger("click")
}
/*
const executeQueuedActions = () => {
    var reportHTML = "";
    reportHTML += "executeQueuedActions";
    reportHTML += "<br>";

    return reportHTML;
}
*/

// map the name of the action to one (or more?) functions required by that action
const executeSingleAction = (actionName,oAuxiliaryData,oRawFileLookup) => {
    var oActionData = {};
    oActionData.oAuxiliaryData = MiscFunctions.cloneObj(oAuxiliaryData);
    oActionData.oRawFileLookup = MiscFunctions.cloneObj(oRawFileLookup);
    var oRFL = MiscFunctions.cloneObj(oRawFileLookup)
    var verboseConsole = true;


    ////////// START EDITS /////////////
    var oActionDataInput =  MiscFunctions.cloneObj(oActionData);
    var oAuxiliaryData = MiscFunctions.cloneObj(oActionDataInput.oAuxiliaryData);
    // var oRFL = MiscFunctions.cloneObj(oActionDataInput.oRawFileLookup);
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
    // var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);
    ////////// END EDITS /////////////


    switch (actionName) {

        case "A.a.u1n.01":
            if (verboseConsole) { console.log("case A.a.u1n.01") }
            // var oActionDataOutput = MiscFunctions.cloneObj(A_a.a_a_u1n_01(oActionData));
            // oRFL = oActionDataOutput.oRawFileLookup;

            try {
                oNodeTo.globalDynamicData.valenceData.valenceL1 = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.valenceData.valenceL1, nF_slug);
                oRFL.updated[nT_slug] = MiscFunctions.cloneObj(oNodeTo);
                var sNodeTo = JSON.stringify(oNodeTo,null,4)
                console.log("trying a_a_u1n_01: new nT_slug: "+nT_slug+"; sNodeTo: "+sNodeTo)
            } catch (err) { console.log("javaScriptError with action a_a_u1n_01; err: "+err) }

            // oActionDataOutput.oRawFileLookup.updated = oRFL.updated;

            // oRFL = oActionDataOutput.oRawFileLookup;

            break;

        case "A.a.u1n.02":
            if (verboseConsole) { console.log("case A.a.u1n.02") }
            // var oActionDataOutput = MiscFunctions.cloneObj(A_a.a_a_u1n_02(oActionData));
            // oRFL = oActionDataOutput.oRawFileLookup;
            try {
                console.log("aboutToTriggerAction: a_a_u1n_02; nF_slug / nT_slug: "+nF_slug+" / "+nT_slug)
                oNodeFrom.globalDynamicData.valenceData.valenceL1 = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeFrom.globalDynamicData.valenceData.valenceL1,oNodeTo.globalDynamicData.valenceData.valenceL1);
                oRFL.updated[nF_slug] = oNodeFrom;
            } catch(err) {
                console.log("javaScriptError with action a_a_u1n_02; err: "+err)
            }
            break;
        /*
        case "A.a.u1n.03":
            if (verboseConsole) { console.log("case A.a.u1n.03") }
            var oActionDataOutput = MiscFunctions.cloneObj(A_a.a_a_u1n_03(oActionData));
            oRFL = oActionDataOutput.oRawFileLookup;
            break;

        case "A.a.u1n.04":
            if (verboseConsole) { console.log("case A.a.u1n.04") }
            var oActionDataOutput = MiscFunctions.cloneObj(A_a.a_a_u1n_04(oActionData));
            oRFL = oActionDataOutput.oRawFileLookup;
            break;
        case "A.a.u1n.05":
            if (verboseConsole) { console.log("case A.a.u1n.05") }
            var oActionDataOutput = MiscFunctions.cloneObj(A_a.a_a_u1n_05(oActionData));
            oRFL = oActionDataOutput.oRawFileLookup;
            break;
        case "A.a.u1n.06":
            if (verboseConsole) { console.log("case A.a.u1n.06") }
            var oActionDataOutput = MiscFunctions.cloneObj(A_a.a_a_u1n_06(oActionData));
            oRFL = oActionDataOutput.oRawFileLookup;
            break;

        case "A.a.u1n.07":
            if (verboseConsole) { console.log("case A.a.u1n.07") }
            var oActionDataOutput = MiscFunctions.cloneObj(A_a.a_a_u1n_07(oActionData));
            oRFL = oActionDataOutput.oRawFileLookup;
            break;



        case "A.b.u1n.01":
            if (verboseConsole) { console.log("case A.b.u1n.01") }
            var oActionDataOutput = MiscFunctions.cloneObj(A_b.a_b_u1n_01(oActionData));
            oRFL = oActionDataOutput.oRawFileLookup;
            break;
        case "A.b.u1n.02":
            if (verboseConsole) { console.log("case A.b.u1n.02") }
            var oActionDataOutput = MiscFunctions.cloneObj(A_b.a_b_u1n_02(oActionData));
            oRFL = oActionDataOutput.oRawFileLookup;
            break;
        case "A.b.u1n.03":
            if (verboseConsole) { console.log("case A.b.u1n.03") }
            break;
        case "A.b.u1n.04":
            if (verboseConsole) { console.log("case A.b.u1n.04") }
            var oActionDataOutput = MiscFunctions.cloneObj(A_b.a_b_u1n_04(oActionData));
            oRFL = oActionDataOutput.oRawFileLookup;
            break;
        case "A.b.u1n.05":
            if (verboseConsole) { console.log("case A.b.u1n.05") }
            break;
        case "A.b.u1n.06":
            if (verboseConsole) { console.log("case A.b.u1n.06") }
            break;


        case "A.c.u1n.01":
            if (verboseConsole) { console.log("case A.c.u1n.01") }
            break;
        case "A.c.u1n.02":
            if (verboseConsole) { console.log("case A.c.u1n.02") }
            break;
        case "A.c.u1n.03":
            if (verboseConsole) { console.log("case A.c.u1n.03") }
            break;
        case "A.c.u1n.04":
            if (verboseConsole) { console.log("case A.c.u1n.04") }
            break;
        case "A.c.u1n.05":
            if (verboseConsole) { console.log("case A.c.u1n.05") }
            break;
        case "A.c.u1n.06":
            if (verboseConsole) { console.log("case A.c.u1n.06") }
            break;
        case "A.c.u1n.07":
            if (verboseConsole) { console.log("case A.c.u1n.07") }
            break;
        case "A.c.u1n.08":
            if (verboseConsole) { console.log("case A.c.u1n.08") }
            break;
        case "A.c.u1n.09":
            if (verboseConsole) { console.log("case A.c.u1n.09") }
            break;
        case "A.c.u1n.10":
            if (verboseConsole) { console.log("case A.c.u1n.10") }
            break;
        case "A.c.u1n.11":
            if (verboseConsole) { console.log("case A.c.u1n.11") }
            break;
        case "A.c.u1n.12":
            if (verboseConsole) { console.log("case A.c.u1n.12") }
            break;


        case "A.rV0.u2n.init":
            if (verboseConsole) { console.log("case A.rV0.u2n.init") }
            break;
        case "A.rV0.u1n.tx":
            if (verboseConsole) { console.log("case A.rV0.u1n.tx") }
            break;
        case "A.rV0.u1n.00":
            if (verboseConsole) { console.log("case A.rV0.u1n.00") }
            break;
        case "A.rV0.u1n.01":
            if (verboseConsole) { console.log("case A.rV0.u1n.01") }
            break;
        case "A.rV0.u1n.02":
            if (verboseConsole) { console.log("case A.rV0.u1n.02") }
            break;
        case "A.rV0.u1n.03":
            if (verboseConsole) { console.log("case A.rV0.u1n.03") }
            break;
        case "A.rV0.u1n.04":
            if (verboseConsole) { console.log("case A.rV0.u1n.04") }
            break;
        case "A.rV0.u1n.05":
            if (verboseConsole) { console.log("case A.rV0.u1n.05") }
            break;
        case "A.rV0.u1n.06":
            if (verboseConsole) { console.log("case A.rV0.u1n.06") }
            break;

        default:
            // code
            break;
        */
    }
    /*
    if (nT_slug=="wordTypeFor_pig") {
        var oCurrent = oRFL.current[nT_slug]
        var oUpdated = oRFL.updated[nT_slug]
        var sCurrent = JSON.stringify(oCurrent,null,4);
        var sUpdated = JSON.stringify(oUpdated,null,4);
        console.log("THIS SHOULD WORK: nT_slug: "+nT_slug+"; sCurrent: "+sCurrent+"; sUpdated: "+sUpdated)
    }
    */
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
                var numSlugsCurrent_pre = Object.keys(oRawFileLookupB.current).length;
                var numSlugsUpdated_pre = Object.keys(oRawFileLookupB.updated).length;
                oRawFileLookupB = MiscFunctions.cloneObj(executeSingleAction(nextAction,oNextAuxData,oRawFileLookupB));
                var numSlugsCurrent_post = Object.keys(oRawFileLookupB.current).length;
                var numSlugsUpdated_post = Object.keys(oRawFileLookupB.updated).length;
                console.log("executeSingleAction a: "+a+"; numSlugsCurrent_pre: "+numSlugsCurrent_pre+"; numSlugsCurrent_post: "+numSlugsCurrent_post+"; numSlugsUpdated_pre: "+numSlugsUpdated_pre+"; numSlugsUpdated_post: "+numSlugsUpdated_post)

                /*
                var nT_slug = "wordTypeFor_pig";
                var oCurrent = oRawFileLookupB.current[nT_slug]
                var oUpdated = oRawFileLookupB.updated[nT_slug]
                var sCurrent = JSON.stringify(oCurrent,null,4);
                var sUpdated = JSON.stringify(oUpdated,null,4);
                console.log("FROM oRawFileLookupB: nT_slug: "+nT_slug+"; sCurrent: "+sCurrent+"; sUpdated: "+sUpdated)
                */

                // MiscFunctions.printObjToConsole(oRawFileLookup)
                // if (verboseConsole) { console.log { console.log("oRawFileLookupB.updated: "+JSON.stringify(oRawFileLookupB.updated,null,4)) }
                updateRawFile(oRawFileLookupB.updated);
            }
        }
    });

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
        reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
        reportHTML += executeQueuedS1nActions(oS1nPatternQueue,oMapPatternToActions,oRawFileLookup)
        reportHTML += executeQueuedS1rActions(oS1rPatternQueue,oMapPatternToActions,oRawFileLookup)
        reportHTML += executeQueuedS2rActions(oS2rPatternQueue,oMapPatternToActions,oRawFileLookup)
    }
    if (isS1nActionsChecked) {
        reportHTML += "running ALL ACTIONS triggered by S1n PATTERNS QUEUE";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
        reportHTML += executeQueuedS1nActions(oS1nPatternQueue,oMapPatternToActions,oRawFileLookup)
    }
    if (isS1rActionsChecked) {
        reportHTML += "running ALL ACTIONS triggered by S1r PATTERNS QUEUE";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
        reportHTML += executeQueuedS1rActions(oS1rPatternQueue,oMapPatternToActions,oRawFileLookup)
    }
    if (isS2rActionsChecked) {
        reportHTML += "running ALL ACTIONS triggered by S2r PATTERNS QUEUE";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
        reportHTML += executeQueuedS2rActions(oS2rPatternQueue,oMapPatternToActions,oRawFileLookup)
    }
    if (isJustOneActionChecked) {
        reportHTML += "running JUST THE FIRST ACTION triggered by the PATTERNS QUEUE";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
    }
    if (isMakeActionsListChecked) {
        reportHTML += "GENERATE ACTIONS QUEUE from the PATTERNS QUEUE)";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
    }
    jQuery("#neuroCoreReportContainer").html(reportHTML)
    jQuery("#neuroCoreReportContainer").val(reportHTML)

    // jQuery("#patternMatchesButton").trigger("click")

}

export { runActionsOneTime };
