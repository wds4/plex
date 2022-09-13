import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as ConceptGraphFunctions from '../../functions/conceptGraphFunctions.js';
import * as A_a from './actions/actions-a.js';
import * as A_b from './actions/actions-b.js';
import * as A_c from './actions/actions-b.js';
import * as A_rV0 from './actions/actions-rV0.js';
import { oActionDataOutputTemplate } from './actions/constants.js';
const jQuery = require("jquery");

const updateRawFile = (oUpdatedRawFileLookup,oRawFileLookupCurrent) => {
    // first eliminate any 'updated' nodes that are unchanged from current
    var oUpdatedRawFileLookupTrimmed = {};
    jQuery.each( oUpdatedRawFileLookup, function( slug, oNode ) {
        var oNodeCurrent = oRawFileLookupCurrent[slug];
        var oNodeUpdated = oUpdatedRawFileLookup[slug];
        var sNodeCurrent = JSON.stringify(oNodeCurrent,null,4);
        var sNodeUpdated = JSON.stringify(oNodeUpdated,null,4);
        if (sNodeCurrent != sNodeUpdated) {
            oUpdatedRawFileLookupTrimmed[slug] = oNode;
        }
    });

    // next merge new updated nodes with preexisting updated nodes
    var sUpdatedRawFileLookupPreexisting = jQuery("#newUpdatedRawFileLookupContainer").html()
    console.log("sUpdatedRawFileLookupPreexisting: "+sUpdatedRawFileLookupPreexisting)
    if (!sUpdatedRawFileLookupPreexisting) { sUpdatedRawFileLookupPreexisting = "{}"; }
    // var sUpdatedRawFileLookupPreexisting = '{ "wordTypeFor_dog": {} }';
    var oUpdatedRawFileLookupPreexisting = JSON.parse(sUpdatedRawFileLookupPreexisting);

    jQuery.each( oUpdatedRawFileLookupPreexisting, function( slug, oNode ) {
        oUpdatedRawFileLookupTrimmed[slug] = oNode;
    });

    var sRawFileLookupNew = JSON.stringify(oUpdatedRawFileLookupTrimmed,null,4)
    jQuery("#newUpdatedRawFileLookupContainer").html(sRawFileLookupNew)
    jQuery("#newUpdatedRawFileLookupContainer").val(sRawFileLookupNew)

    jQuery("#rawFileLookupUpdateButton").trigger("click")
}

// map the name of the action to one (or more?) functions required by that action
const executeSingleAction = (actionName,oAuxiliaryData,oRawFileLookup) => {
    var oRFL = MiscFunctions.cloneObj(oRawFileLookup)
    var verboseConsole = true;

    if (oAuxiliaryData.hasOwnProperty("relationship")) {
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
    }
    if (oAuxiliaryData.hasOwnProperty("slug")) {
        console.log("qwerty; oAuxiliaryData: "+JSON.stringify(oAuxiliaryData,null,4))
        var node_slug = oAuxiliaryData.slug;
        console.log("qwerty; oAuxiliaryData: "+JSON.stringify(oAuxiliaryData,null,4)+"; node_slug: "+node_slug)
        if (oRFL.updated.hasOwnProperty(node_slug)) {
            var oNode = MiscFunctions.cloneObj(oRFL.updated[node_slug]);
        } else {
            var oNode = MiscFunctions.cloneObj(oRFL.current[node_slug]);
        }
        console.log("qwerty; oNode: "+JSON.stringify(oNode,null,4))
    }

    switch (actionName) {
        case "A.a.u1n.01":
            if (verboseConsole) { console.log("case A.a.u1n.01") }
            try {
                oNodeTo.globalDynamicData.valenceData.valenceL1 = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.valenceData.valenceL1, nF_slug);
                oRFL.updated[nT_slug] = oNodeTo;
            } catch (err) {
                console.log("javaScriptError with action a_a_u1n_01; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.a.u1n.02":
            if (verboseConsole) { console.log("case A.a.u1n.02") }
            try {
                oNodeFrom.globalDynamicData.valenceData.valenceL1 = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeFrom.globalDynamicData.valenceData.valenceL1,oNodeTo.globalDynamicData.valenceData.valenceL1);
                oRFL.updated[nF_slug] = oNodeFrom;
            } catch (err) {
                console.log("javaScriptError with action a_a_u1n_02; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.b.u1n.01":
            if (verboseConsole) { console.log("case A.b.u1n.01") }
            try {
                var key1 = oNodeFrom.propertyData.key
                var obj1 = oNodeFrom.propertyData
                delete obj1.key;
                delete obj1.metaData;
                oNodeTo.propertyData.properties[key1] = obj1
                oRFL.updated[nT_slug] = oNodeTo;
            } catch (err) {
                console.log("javaScriptError with action a_b_u1n_01; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.b.u1n.02":
            if (verboseConsole) { console.log("case A.b.u1n.02") }
            try {
                var arr1 = oNodeFrom.globalDynamicData.specificInstances;
                var uniquePropertyKey = oAuxiliaryData.relationship.relationshipType.restrictsValueData.uniquePropertyKey;
                var propertyPath = oAuxiliaryData.relationship.relationshipType.restrictsValueData.propertyPath;
                var arr2 = ConceptGraphFunctions.translateSlugsToUniquePropertyValues(arr1,propertyPath,uniquePropertyKey);
                oNodeTo.propertyData.enum = arr2;
                oRFL.updated[nT_slug] = oNodeTo;
            } catch (err) {
                console.log("javaScriptError with action a_b_u1n_02; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.b.u1n.03":
            if (verboseConsole) { console.log("case A.b.u1n.03") }
            try {

            } catch (err) {
                console.log("javaScriptError with action a_b_u1n_03; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.b.u1n.04":
            if (verboseConsole) { console.log("case A.b.u1n.04") }
            try {
                var key1 = oNodeFrom.propertyData.key;
                var obj1 = oNodeFrom.propertyData;
                delete obj1.key;
                delete obj1.metaData;
                oNodeTo.required = [key1];
                oNodeTo.properties[key1] = obj1;
                oRFL.updated[nT_slug] = oNodeTo;
            } catch (err) {
                console.log("javaScriptError with action a_b_u1n_04; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.b.u1n.05":
            if (verboseConsole) { console.log("case A.b.u1n.05") }
            try {
                var arr1 = oNodeFrom.globalDynamicData.specificInstances;
                oNodeTo.propertyData.dependencySlugs = arr1;
                var uniquePropertyKey = oAuxiliaryData.relationship.relationshipType.restrictsValueData.uniquePropertyKey;
                var propertyPath = oAuxiliaryData.relationship.relationshipType.restrictsValueData.propertyPath;
                var arr2 = ConceptGraphFunctions.translateSlugsToUniquePropertyValues(arr1,propertyPath,uniquePropertyKey);
                oNodeTo.propertyData.enum = arr2;
                oRFL.updated[nT_slug] = oNodeTo;
            } catch (err) {
                console.log("javaScriptError with action a_b_u1n_05; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.b.u1n.06":
            if (verboseConsole) { console.log("case A.b.u1n.06") }
            try {

            } catch (err) {
                console.log("javaScriptError with action a_b_u1n_06; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.a.u1n.03":
            if (verboseConsole) { console.log("case A.a.u1n.03") }
            try {
                if (!oNodeTo.globalDynamicData.hasOwnProperty("subsets")) {
                    oNodeTo.globalDynamicData.subsets = [];
                }
                oNodeTo.globalDynamicData.subsets = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.subsets,nF_slug);
                oRFL.updated[nT_slug] = oNodeTo;
            } catch (err) {
                console.log("javaScriptError with action a_a_u1n_03; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.a.u1n.04":
            if (verboseConsole) { console.log("case A.a.u1n.04") }
            try {
                if (!oNodeFrom.globalDynamicData.hasOwnProperty("subsets")) {
                        oNodeFrom.globalDynamicData.subsets = [];
                }
                if (!oNodeTo.globalDynamicData.hasOwnProperty("subsets")) {
                        oNodeTo.globalDynamicData.subsets = [];
                }
                oNodeTo.globalDynamicData.subsets = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeTo.globalDynamicData.subsets,oNodeFrom.globalDynamicData.subsets);
                oRFL.updated[nT_slug] = oNodeTo;
            } catch (err) {
                console.log("javaScriptError with action a_a_u1n_04; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.a.u1n.05":
            if (verboseConsole) { console.log("case A.a.u1n.05") }
            try {
                if (!oNodeFrom.globalDynamicData.hasOwnProperty("specificInstances")) {
                        oNodeFrom.globalDynamicData.specificInstances = [];
                }
                if (!oNodeTo.globalDynamicData.hasOwnProperty("specificInstances")) {
                        oNodeTo.globalDynamicData.specificInstances = [];
                }
                oNodeTo.globalDynamicData.specificInstances = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeTo.globalDynamicData.specificInstances,oNodeFrom.globalDynamicData.specificInstances);
                oRFL.updated[nT_slug] = oNodeTo;
            } catch (err) {
                console.log("javaScriptError with action a_a_u1n_05; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.a.u1n.06":
            if (verboseConsole) { console.log("case A.a.u1n.06") }
            try {
                oNodeFrom.globalDynamicData.valenceData.parentJSONSchemaSequence = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeFrom.globalDynamicData.valenceData.parentJSONSchemaSequence,oNodeTo.globalDynamicData.valenceData.valenceL1);
                oRFL.updated[nF_slug] = oNodeFrom;
            } catch (err) {
                console.log("javaScriptError with action a_a_u1n_06; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.a.u1n.07":
            if (verboseConsole) { console.log("case A.a.u1n.07") }
            try {
                oNodeTo.globalDynamicData.specificInstances = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.specificInstances,nF_slug);
                oRFL.updated[nT_slug] = oNodeTo;
            } catch (err) {
                console.log("javaScriptError with action a_a_u1n_07; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.rV.u2n.init":
            if (verboseConsole) { console.log("case A.rV.u2n.init") }
            try {
                var sAuxiliaryData = JSON.stringify(oAuxiliaryData,null,4);
                console.log("A.rV.u2n.init; oAuxiliaryData: "+sAuxiliaryData);
                var nF_IPNS = oNodeFrom.metaData.ipns;
                var nT_IPNS = oNodeTo.metaData.ipns;
                var uniqueID = nF_IPNS.slice(-6) + "_restrictsValue_" + nT_IPNS.slice(-6);
                var nF_specificInstances = MiscFunctions.cloneObj(oNodeFrom.globalDynamicData.specificInstances);
                var targetPropertyType = "";
                var uniquePropertyKey = "";
                var withSubsets = false;
                var withDependencies = false;
                try {
                    targetPropertyType = oAuxiliaryData.relationship.relationshipType.restrictsValueData.targetPropertyType;
                    uniquePropertyKey = oAuxiliaryData.relationship.relationshipType.restrictsValueData.uniquePropertyKey;
                    withSubsets = oAuxiliaryData.relationship.relationshipType.restrictsValueData.withSubsets;
                    withDependencies = oAuxiliaryData.relationship.relationshipType.restrictsValueData.withDependencies;
                } catch (er) { console.log("javascriptError: "+er); }

                var actionCodes_role0 = [];
                var actionCodes_role1 = [];
                var actionCodes_role2 = [];
                if (withDependencies==true) {
                    var patternName_role0 = "P.rV0.s1n.00 ("+uniqueID+")";
                    var patternName_role1 = "P.rV0.s1n.01 ("+uniqueID+")";
                    var patternName_role2 = "P.rV0.s1n.02 ("+uniqueID+")";
                    var aC = "A.rV0.u1n.tx ("+uniqueID+")";
                    var aC0 = "A.rV0.u1n.00 ("+uniqueID+")";
                    var aC1 = "A.rV0.u1n.01 ("+uniqueID+")";
                    var aC2 = "A.rV0.u1n.02 ("+uniqueID+")";
                    actionCodes_role0.push(aC);
                    actionCodes_role1.push(aC);
                    actionCodes_role2.push(aC);
                    actionCodes_role0.push(aC0);
                    actionCodes_role1.push(aC1);
                    actionCodes_role2.push(aC2);
                }
                if (withDependencies==false) {
                    var patternName_role0 = "P.rV1.s1n.00 ("+uniqueID+")";
                    var patternName_role1 = "P.rV1.s1n.01 ("+uniqueID+")";
                    var patternName_role2 = "P.rV1.s1n.02 ("+uniqueID+")";
                    var aC = "A.rV1.u1n.tx ("+uniqueID+")";
                    var aC0 = "A.rV1.u1n.00 ("+uniqueID+")";
                    var aC1 = "A.rV1.u1n.01 ("+uniqueID+")";
                    var aC2 = "A.rV1.u1n.02 ("+uniqueID+")";
                    actionCodes_role0.push(aC);
                    actionCodes_role1.push(aC);
                    actionCodes_role2.push(aC);
                    actionCodes_role0.push(aC0);
                    actionCodes_role1.push(aC1);
                    actionCodes_role2.push(aC2);
                }
                var oRestrictsValueManagement = MiscFunctions.cloneObj(window.restrictsValueManagement);
                var sRestrictsValueManagement = JSON.stringify(oRestrictsValueManagement,null,4);
                console.log("A.rV.u2n.init; sRestrictsValueManagement: "+sRestrictsValueManagement);
                oRestrictsValueManagement.uniqueID = uniqueID;
                oRestrictsValueManagement.role0_slugs = nF_specificInstances;
                oRestrictsValueManagement.role1_slug = nF_slug;
                oRestrictsValueManagement.role2_slug = nT_slug;
                var nF_oRVM = MiscFunctions.cloneObj(oRestrictsValueManagement);
                var nT_oRVM = MiscFunctions.cloneObj(oRestrictsValueManagement);
                nF_oRVM.thisNodeRole = "role1";
                nT_oRVM.thisNodeRole = "role2";

                oNodeFrom = ConceptGraphFunctions.init_gDD_rVM_keys(oNodeFrom);
                oNodeFrom.globalDynamicData.restrictsValueManagement[uniqueID] = nF_oRVM;
                oNodeFrom.globalDynamicData.nodePatternCodes = MiscFunctions.pushIfNotAlreadyThere(oNodeFrom.globalDynamicData.nodePatternCodes,patternName_role1);
                oNodeFrom.globalDynamicData.actionCodes = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeFrom.globalDynamicData.actionCodes,actionCodes_role1);

                oNodeTo = ConceptGraphFunctions.init_gDD_rVM_keys(oNodeTo);
                oNodeTo.globalDynamicData.restrictsValueManagement[uniqueID] = nT_oRVM;
                oNodeTo.globalDynamicData.nodePatternCodes = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.nodePatternCodes,patternName_role2);
                oNodeTo.globalDynamicData.actionCodes = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeTo.globalDynamicData.actionCodes,actionCodes_role2);

                for (var s=0;s < nF_specificInstances.length;s++) {
                    var nextSpecificInstanceSlug = nF_specificInstances[s];
                    var oNextSpecificInstance = MiscFunctions.cloneObj(oRFL.current[nextSpecificInstanceSlug]);
                    oNextSpecificInstance = ConceptGraphFunctions.init_gDD_rVM_keys(oNextSpecificInstance);
                    var nextSpecificInstance_oRVM = MiscFunctions.cloneObj(oRestrictsValueManagement);
                    oNextSpecificInstance.globalDynamicData.restrictsValueManagement[uniqueID] = nextSpecificInstance_oRVM;
                    oNextSpecificInstance.globalDynamicData.restrictsValueManagement[uniqueID].thisNodeRole = "role0";
                    oNextSpecificInstance.globalDynamicData.nodePatternCodes = MiscFunctions.pushIfNotAlreadyThere(oNextSpecificInstance.globalDynamicData.nodePatternCodes,patternName_role0);
                    oNextSpecificInstance.globalDynamicData.actionCodes = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNextSpecificInstance.globalDynamicData.actionCodes,actionCodes_role0);
                    oRFL.updated[nextSpecificInstanceSlug] = ConceptGraphFunctions.init_gDD_rVM_keys(oNextSpecificInstance);
                }

                oRFL.updated[nF_slug] = oNodeFrom;
                oRFL.updated[nT_slug] = oNodeTo;
            } catch (err) {
                console.log("javaScriptError with action a_rv_u2n_init; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.rV0.s1n.00":
            if (verboseConsole) { console.log("case A.rV0.s1n.00") }
            try {
                console.log("qwerty; in A.rV0.s1n.00; node_slug: "+node_slug+"; oNode: "+JSON.stringify(oNode,null,4))
                var oNode_updated = MiscFunctions.cloneObj(oNode);
                oNode_updated.metaData.slug="changed";
                console.log("qwerty; in A.rV0.s1n.00; oNode_updated: "+JSON.stringify(oNode_updated,null,4))
                oRFL.updated[node_slug] = oNode_updated;
            } catch (err) {
                console.log("qwerty javaScriptError with action a_rv0_s1n_00; err: "+err);
                console.log("qwerty node_slug: "+node_slug+"; oNode: "+JSON.stringify(oNode,null,4));
            }
            break;
        case "A.rV1.s1n.00":
            if (verboseConsole) { console.log("case A.rV1.s1n.00") }
            try {
                console.log("qwerty; in A.rV1.s1n.00; node_slug: "+node_slug+"; oNode: "+JSON.stringify(oNode,null,4))
                var oNode_updated = MiscFunctions.cloneObj(oNode);
                oNode_updated.metaData.slug="changed";
                oRFL.updated[node_slug] = oNode_updated;
                console.log("qwerty; in A.rV1.s1n.00; oNode_updated: "+JSON.stringify(oNode_updated,null,4))
            } catch (err) {
                console.log("javaScriptError with action a_rv1_s1n_00; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
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
    var oRawFileLookupB = MiscFunctions.cloneObj(oRawFileLookup)
    var verboseConsole = true;

    jQuery.each( oS1nPatternQueue, function( pattern, aAuxiliaryData ) {
        var numAuxData = aAuxiliaryData.length;
        var aInducedActions = oMapPatternToActions[pattern];
        reportHTML += "pattern: "+pattern+"("+numAuxData+"); aInducedActions: "+JSON.stringify(aInducedActions,null,4);
        var numInducedActions = aInducedActions.length;
        reportHTML += "<br>";
        if (verboseConsole) { console.log("executeQueuedS1nActions; pattern: "+pattern+"; numAuxData: "+numAuxData+"; aInducedActions: "+JSON.stringify(aInducedActions,null,4) ) }
        for (var p=0;p<numAuxData;p++) {
            var oNextAuxData = aAuxiliaryData[p];
            // if (verboseConsole) { console.log("executeQueuedS1nActions; numInducedActions: "+numInducedActions) }
            for (var a=0;a<numInducedActions;a++) {
                var nextAction = aInducedActions[a];
                if (verboseConsole) { console.log("executeQueuedS1nActions; p: "+p+"; a: "+a+"; nextAction: "+nextAction) }
                oRawFileLookupB = MiscFunctions.cloneObj(executeSingleAction(nextAction,oNextAuxData,oRawFileLookupB));
                // MiscFunctions.printObjToConsole(oRawFileLookup)
                // if (verboseConsole) { console.log { console.log("oRawFileLookupB.updated: "+JSON.stringify(oRawFileLookupB.updated,null,4)) }
                updateRawFile(oRawFileLookupB.updated,oRawFileLookup.current);
            }
        }
    });

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
                oRawFileLookupB = MiscFunctions.cloneObj(executeSingleAction(nextAction,oNextAuxData,oRawFileLookupB));
                // MiscFunctions.printObjToConsole(oRawFileLookup)
                // if (verboseConsole) { console.log { console.log("oRawFileLookupB.updated: "+JSON.stringify(oRawFileLookupB.updated,null,4)) }
                updateRawFile(oRawFileLookupB.updated,oRawFileLookup.current);
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
