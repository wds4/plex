import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as ConceptGraphFunctions from '../../functions/conceptGraphFunctions.js';
import * as NeuroCoreFunctions from '../../functions/neuroCoreFunctions.js';
import * as A_a from './actions/actions-a.js';
import * as A_b from './actions/actions-b.js';
import * as A_c from './actions/actions-b.js';
import * as A_rV0 from './actions/actions-rV0.js';
import { oActionDataOutputTemplate } from './actions/constants.js';
const jQuery = require("jquery");

const updateRawFile = (oUpdatedRawFileLookup,oRawFileLookupCurrent,oRawFileLookupNew) => {
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
    // console.log("sUpdatedRawFileLookupPreexisting: "+sUpdatedRawFileLookupPreexisting)
    if (!sUpdatedRawFileLookupPreexisting) { sUpdatedRawFileLookupPreexisting = "{}"; }
    // var sUpdatedRawFileLookupPreexisting = '{ "wordTypeFor_dog": {} }';
    var oUpdatedRawFileLookupPreexisting = JSON.parse(sUpdatedRawFileLookupPreexisting);

    jQuery.each( oUpdatedRawFileLookupPreexisting, function( slug, oNode ) {
        oUpdatedRawFileLookupTrimmed[slug] = oNode;
    });

    console.log("oRawFileLookupNew: "+JSON.stringify(oRawFileLookupNew,null,4))
    jQuery.each( oRawFileLookupNew, function( slug, oNode ) {
        console.log("oRawFileLookupNew; slug: "+slug);
        oUpdatedRawFileLookupTrimmed[slug] = oNode;
    });

    var sRawFileLookupNew = JSON.stringify(oUpdatedRawFileLookupTrimmed,null,4)
    jQuery("#newUpdatedRawFileLookupContainer").html(sRawFileLookupNew)
    jQuery("#newUpdatedRawFileLookupContainer").val(sRawFileLookupNew)

    jQuery("#rawFileLookupUpdateButton").trigger("click")
}

// map the name of the action to one (or more?) functions required by that action
const executeSingleAction = async (actionName,oAuxiliaryData,oRawFileLookup) => {
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

    var nextPatternCode = "not applicable";
    var nextUniqueID = "not applicable";
    if (oAuxiliaryData.hasOwnProperty("oExtraAuxiliaryData")) {
        nextPatternCode = "unknown";
        nextUniqueID = "unknown";
        if (oAuxiliaryData.oExtraAuxiliaryData.hasOwnProperty("nextPatternCode")) {
            nextPatternCode = oAuxiliaryData.oExtraAuxiliaryData.nextPatternCode;
            var aFoo1 = nextPatternCode.split("(");
            var foo1 = aFoo1[1];
            var aFoo2 = foo1.split(")");
            nextUniqueID = aFoo2[0];
        }
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
                // MAY NEED TO FIX: include propertyData.metaData.governingConcept.slug (not currently supported)
                // OR iterate through all wordData.governingConcepts (not just the first one)
                // var nT_governingConcept_slug = oNodeTo.propertyData.metaData.governingConcept.slug;
                var nT_governingConcept_slug = oNodeTo.wordData.governingConcepts[0];
                var role3_slug = "";
                var role4_slug = "";
                var aRole6_slugs = [];
                if (oRFL.current.hasOwnProperty(nT_governingConcept_slug)) {
                    var oNodeToGovConcept = oRFL.current[nT_governingConcept_slug];
                    role3_slug = oNodeToGovConcept.conceptData.nodes.primaryProperty.slug;
                    role4_slug = oNodeToGovConcept.conceptData.nodes.superset.slug;
                }

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
                var actionCodes_role3 = [];
                var actionCodes_role4 = [];
                if (withSubsets==false) {
                    if (withDependencies==false) {
                        var patternName_role0 = "P.rV00.s1n.00 ("+uniqueID+")";
                        var patternName_role1 = "P.rV00.s1n.01 ("+uniqueID+")";
                        var patternName_role2 = "P.rV00.s1n.02 ("+uniqueID+")";
                        var patternName_role3 = "P.rV00.s1n.03 ("+uniqueID+")";
                        var patternName_role4 = "P.rV00.s1n.04 ("+uniqueID+")";
                        var patternName_role6 = "P.rV00.s1n.06 ("+uniqueID+")";
                        var aC = "A.rV00.u1n.tx ("+uniqueID+")";
                        var aC0 = "A.rV00.u1n.00 ("+uniqueID+")";
                        var aC1 = "A.rV00.u1n.01 ("+uniqueID+")";
                        var aC2 = "A.rV00.u1n.02 ("+uniqueID+")";
                        actionCodes_role0.push(aC);
                        actionCodes_role1.push(aC);
                        actionCodes_role2.push(aC);
                        actionCodes_role0.push(aC0);
                        actionCodes_role1.push(aC1);
                        actionCodes_role2.push(aC2);
                    }
                    if (withDependencies==true) {
                        var patternName_role0 = "P.rV01.s1n.00 ("+uniqueID+")";
                        var patternName_role1 = "P.rV01.s1n.01 ("+uniqueID+")";
                        var patternName_role2 = "P.rV01.s1n.02 ("+uniqueID+")";
                        var patternName_role3 = "P.rV01.s1n.03 ("+uniqueID+")";
                        var patternName_role4 = "P.rV01.s1n.04 ("+uniqueID+")";
                        var patternName_role6 = "P.rV01.s1n.06 ("+uniqueID+")";
                        var aC = "A.rV01.u1n.tx ("+uniqueID+")";
                        var aC0 = "A.rV01.u1n.00 ("+uniqueID+")";
                        var aC1 = "A.rV01.u1n.01 ("+uniqueID+")";
                        var aC2 = "A.rV01.u1n.02 ("+uniqueID+")";
                        actionCodes_role0.push(aC);
                        actionCodes_role1.push(aC);
                        actionCodes_role2.push(aC);
                        actionCodes_role0.push(aC0);
                        actionCodes_role1.push(aC1);
                        actionCodes_role2.push(aC2);
                    }
                }
                if (withSubsets==true) {
                    if (withDependencies==false) {
                        var patternName_role0 = "P.rV10.s1n.00 ("+uniqueID+")";
                        var patternName_role1 = "P.rV10.s1n.01 ("+uniqueID+")";
                        var patternName_role2 = "P.rV10.s1n.02 ("+uniqueID+")";
                        var patternName_role3 = "P.rV10.s1n.03 ("+uniqueID+")";
                        var patternName_role4 = "P.rV10.s1n.04 ("+uniqueID+")";
                        var patternName_role6 = "P.rV10.s1n.06 ("+uniqueID+")";
                        var aC = "A.rV10.u1n.tx ("+uniqueID+")";
                        var aC0 = "A.rV10.u1n.00 ("+uniqueID+")";
                        var aC1 = "A.rV10.u1n.01 ("+uniqueID+")";
                        var aC2 = "A.rV10.u1n.02 ("+uniqueID+")";
                        actionCodes_role0.push(aC);
                        actionCodes_role1.push(aC);
                        actionCodes_role2.push(aC);
                        actionCodes_role0.push(aC0);
                        actionCodes_role1.push(aC1);
                        actionCodes_role2.push(aC2);
                    }
                    if (withDependencies==true) {
                        var patternName_role0 = "P.rV11.s1n.00 ("+uniqueID+")";
                        var patternName_role1 = "P.rV11.s1n.01 ("+uniqueID+")";
                        var patternName_role2 = "P.rV11.s1n.02 ("+uniqueID+")";
                        var patternName_role3 = "P.rV11.s1n.03 ("+uniqueID+")";
                        var patternName_role4 = "P.rV11.s1n.04 ("+uniqueID+")";
                        var patternName_role6 = "P.rV11.s1n.06 ("+uniqueID+")";
                        var aC = "A.rV11.u1n.tx ("+uniqueID+")";
                        var aC0 = "A.rV11.u1n.00 ("+uniqueID+")";
                        var aC1 = "A.rV11.u1n.01 ("+uniqueID+")";
                        var aC2 = "A.rV11.u1n.02 ("+uniqueID+")";
                        actionCodes_role0.push(aC);
                        actionCodes_role1.push(aC);
                        actionCodes_role2.push(aC);
                        actionCodes_role0.push(aC0);
                        actionCodes_role1.push(aC1);
                        actionCodes_role2.push(aC2);
                    }
                }

                for (var s=0;s < nF_specificInstances.length;s++) {
                    var nextSpecificInstanceSlug = nF_specificInstances[s];
                    // check to see if role0 node already has corresponding superset underneath; if so, add superset to list of role6 nodes
                    var supersetSlug = NeuroCoreFunctions.fetchSupersetFromWordType(nextSpecificInstanceSlug,oRFL)
                    if (supersetSlug != false) {
                        aRole6_slugs.push(supersetSlug);
                    }
                }


                var oRestrictsValueManagement = MiscFunctions.cloneObj(window.restrictsValueManagement);
                var sRestrictsValueManagement = JSON.stringify(oRestrictsValueManagement,null,4);
                // console.log("A.rV.u2n.init; sRestrictsValueManagement: "+sRestrictsValueManagement);
                oRestrictsValueManagement.uniqueID = uniqueID;
                oRestrictsValueManagement.role0_slugs = nF_specificInstances;
                oRestrictsValueManagement.role1_slug = nF_slug;
                oRestrictsValueManagement.role2_slug = nT_slug;
                oRestrictsValueManagement.role3_slug = role3_slug;
                oRestrictsValueManagement.role4_slug = role4_slug;
                oRestrictsValueManagement.role6_slugs = aRole6_slugs;


                var nF_oRVM = MiscFunctions.cloneObj(oRestrictsValueManagement);
                var nT_oRVM = MiscFunctions.cloneObj(oRestrictsValueManagement);
                var role3_oRVM = MiscFunctions.cloneObj(oRestrictsValueManagement);
                var role4_oRVM = MiscFunctions.cloneObj(oRestrictsValueManagement);
                var role6_oRVM = MiscFunctions.cloneObj(oRestrictsValueManagement);
                nF_oRVM.thisNodeRole = "role1";
                nT_oRVM.thisNodeRole = "role2";
                role3_oRVM.thisNodeRole = "role3";
                role4_oRVM.thisNodeRole = "role4";
                role6_oRVM.thisNodeRole = "role6";

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
                    // check to see if role0 node already has corresponding superset underneath; if so, add superset to list of role6 nodes
                    var supersetSlug = NeuroCoreFunctions.fetchSupersetFromWordType(nextSpecificInstanceSlug,oRFL)
                    if (supersetSlug != false) {
                        var oSupersetNode = MiscFunctions.cloneObj(oRFL.current[supersetSlug]);
                        oSupersetNode = ConceptGraphFunctions.init_gDD_rVM_keys(oSupersetNode);
                        oSupersetNode.globalDynamicData.restrictsValueManagement[uniqueID] = role6_oRVM;
                        oSupersetNode.globalDynamicData.nodePatternCodes = MiscFunctions.pushIfNotAlreadyThere(oSupersetNode.globalDynamicData.nodePatternCodes,patternName_role6);
                        oRFL.updated[supersetSlug] = oSupersetNode;
                    }
                }

                oNodeFrom = ConceptGraphFunctions.init_gDD_rVM_keys(oNodeFrom);
                oNodeFrom.globalDynamicData.restrictsValueManagement[uniqueID] = nF_oRVM;
                oNodeFrom.globalDynamicData.nodePatternCodes = MiscFunctions.pushIfNotAlreadyThere(oNodeFrom.globalDynamicData.nodePatternCodes,patternName_role1);
                oNodeFrom.globalDynamicData.actionCodes = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeFrom.globalDynamicData.actionCodes,actionCodes_role1);

                oNodeTo = ConceptGraphFunctions.init_gDD_rVM_keys(oNodeTo);
                oNodeTo.globalDynamicData.restrictsValueManagement[uniqueID] = nT_oRVM;
                oNodeTo.globalDynamicData.nodePatternCodes = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.nodePatternCodes,patternName_role2);
                oNodeTo.globalDynamicData.actionCodes = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeTo.globalDynamicData.actionCodes,actionCodes_role2);

                if (oRFL.current.hasOwnProperty(role3_slug)) {
                    var oRole3 = MiscFunctions.cloneObj(oRFL.current[role3_slug]);
                    oRole3 = ConceptGraphFunctions.init_gDD_rVM_keys(oRole3);
                    oRole3.globalDynamicData.restrictsValueManagement[uniqueID] = role3_oRVM;
                    oRole3.globalDynamicData.nodePatternCodes = MiscFunctions.pushIfNotAlreadyThere(oRole3.globalDynamicData.nodePatternCodes,patternName_role3);
                    // oRole3.globalDynamicData.actionCodes = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oRole3.globalDynamicData.actionCodes,actionCodes_role3);
                    oRFL.updated[role3_slug] = oRole3;
                }

                if (oRFL.current.hasOwnProperty(role4_slug)) {
                    var oRole4 = MiscFunctions.cloneObj(oRFL.current[role4_slug]);
                    oRole4 = ConceptGraphFunctions.init_gDD_rVM_keys(oRole4);
                    oRole4.globalDynamicData.restrictsValueManagement[uniqueID] = role4_oRVM;
                    oRole4.globalDynamicData.nodePatternCodes = MiscFunctions.pushIfNotAlreadyThere(oRole4.globalDynamicData.nodePatternCodes,patternName_role4);
                    // oRole4.globalDynamicData.actionCodes = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oRole4.globalDynamicData.actionCodes,actionCodes_role4);
                    oRFL.updated[role4_slug] = oRole4;
                }

                oRFL.updated[nF_slug] = oNodeFrom;
                oRFL.updated[nT_slug] = oNodeTo;
            } catch (err) {
                console.log("javaScriptError with action a_rv_u2n_init; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.rV00.s1n.00":
            if (verboseConsole) { console.log("case A.rV00.s1n.00") }
            try {
                oNode.wordData.tag="A.rV00.s1n.00"
                oRFL.updated[node_slug] = oNode;
            } catch (err) {
                console.log("javaScriptError with action a_rv00_s1n_00; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.rV.s1n.connectSubsets":
            if (verboseConsole) { console.log("case A.rV.s1n.connectSubsets") }
            try {
                oNode.wordData.tag="A.rV.s1n.connectSubsets"
                // console.log("A.rV.s1n.connectSubsets oAuxiliaryData: "+JSON.stringify(oAuxiliaryData,null,4)+"; nextPatternCode: "+ nextPatternCode+"; nextUniqueID: "+ nextUniqueID);

                if (oNode.hasOwnProperty("wordTypeData")) {
                    var oWordTypeData = oNode.wordTypeData;
                    var governingConcept_slug = oWordTypeData.metaData.governingConcept.slug;
                    var oGoverningConcept = oRFL.current[governingConcept_slug];
                    var superset_slug = oGoverningConcept.conceptData.nodes.superset.slug;

                    if (oNode.globalDynamicData.hasOwnProperty("patternCodes")) {
                        var aPatternCodes = oNode.globalDynamicData.patternCodes;
                        for (var c=0;c < aPatternCodes.length; c++) {
                            var nextPatternCode_extended = aPatternCodes[c];
                            if (nextPatternCode_extended.includes("P.rV11")) {
                                var aFoo1 = nextPatternCode_extended.split("(");
                                var foo1 = aFoo1[1];
                                var aFoo2 = foo1.split(")");
                                var uniqueID = aFoo2[0];
                                var role5_slug = oNode.globalDynamicData.restrictsValueManagement.uniqueID.role5_slug;
                                var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                                oNewRel.nodeFrom.slug = superset_slug;
                                oNewRel.relationshipType.slug = "subsetOf";
                                oNewRel.nodeTo.slug = role5_slug;
                                // unfinished; next: add oNewRel to main schema for governingConcept of role5_slug

                            }
                        }
                    }
                }

                oRFL.updated[node_slug] = oNode;

            } catch (err) {
                console.log("javaScriptError with action a_rv_s1n_connectsubsets; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.u1n.makeSuperset":
            if (verboseConsole) { console.log("case A.c.u1n.makeSuperset") }
            try {
                // check whether this is already a wordType
                oNode.wordData.foo = "executing A.c.u1n.makeSuperset";
                var alreadyWordType = false;
                if (oNode.hasOwnProperty("wordTypeData")) {
                    alreadyWordType = true;
                    var oWordTypeData = oNode.wordTypeData;
                    var governingConcept_slug = oWordTypeData.metaData.governingConcept.slug;
                    // check to make sure superset exists for this governingConcept
                    var oGoverningConcept = oRFL.current[governingConcept_slug];
                    var superset_slug = oGoverningConcept.conceptData.nodes.superset.slug;
                    // if superset_slug exists, then no need to create another one

                    // delete the following - this was test to see whether it was possible to make a new word (which it is)
                    // var newSuperset_slug = "new_"+superset_slug;
                    // var oNewSuperset = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.superset);
                    // var oNewSuperset = await MiscFunctions.createNewWordByTemplate("superset");
                    // oNewSuperset.wordData.slug = newSuperset_slug;
                    // oRFL.new[newSuperset_slug] = oNewSuperset;
                    // console.log("newSuperset_slug: "+newSuperset_slug);
                }

                if (!alreadyWordType) {
                    oNode.wordTypeData = {};
                    var wT_slug = oNode.wordData.slug;
                    var wT_name = oNode.wordData.name;
                    var wT_title = oNode.wordData.title;
                    oNode.wordTypeData.slug = wT_slug
                    oNode.wordTypeData.name = wT_name;
                    oNode.wordTypeData.title = wT_title;
                    var superset_slug = "supersetFor_"+wT_slug;
                    var superset_name = "superset for "+wT_slug;
                    var superset_title = "Superset for "+wT_slug;
                    // unfiniished; next step: create superset node, then connect with relationship
                    var oNewSuperset = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.superset);
                    oNewSuperset.wordData.slug = superset_slug;
                    oNewSuperset.wordData.name = superset_name;
                    oNewSuperset.wordData.title = superset_title;
                    oRFL.new[superset_slug] = oNewSuperset;
                }
                oRFL.updated[node_slug] = oNode;
            } catch (err) {
                console.log("javaScriptError with action a_c_u1n_makesuperset; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.rV.s1n.addDependencySlugs":
            if (verboseConsole) { console.log("case A.rV.s1n.addDependencySlugs") }
            try {
                oNode.propertyData.includeDependencies = true;
                oNode.propertyData.dependencySlugs = [];
                // unfinished; need to populate dependencySlugs with role6_slugs

                var aPatternCodes = oNode.globalDynamicData.patternCodes;
                for (var c=0;c < aPatternCodes.length; c++) {
                    var nextPatternCode_extended = aPatternCodes[c];
                    if ( (nextPatternCode_extended.includes("P.rV11")) || (nextPatternCode_extended.includes("P.rV10")) ) {
                        var aFoo1 = nextPatternCode_extended.split("(");
                        var foo1 = aFoo1[1];
                        var aFoo2 = foo1.split(")");
                        var uniqueID = aFoo2[0];
                        var aRole6_slugs = oNode.globalDynamicData.restrictsValueManagement.uniqueID.role6_slugs
                        oNode.propertyData.dependencySlugs = aRole6_slugs
                    }
                }

                oRFL.updated[node_slug] = oNode;
            } catch (err) {
                console.log("javaScriptError with action a_rv_s1n_adddependencyslugs; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.rV.s1n.addOrganizedBySubset":
            if (verboseConsole) { console.log("case A.rV.s1n.addOrganizedBySubset") }
            try {
                // var uniqueID = "notPresent";
                var uniqueID = nextUniqueID;
                console.log("A.rV.s1n.addOrganizedBySubset_uniqueID: "+uniqueID);
                /*
                if (oNode.globalDynamicData.hasOwnProperty("restrictsValueManagement")) {
                    var oRVMs_role4 = oNode.globalDynamicData.restrictsValueManagement
                    jQuery.each(oRVMs_role4,function(uID,oRVM){
                        // INCOMPLETE; in principle I should do this for every uID ... ? currently I only do it for one uID (the last one, if there are more than one)
                        uniqueID = uID;
                    });
                }
                */
                var aSubsets = [];
                // current sets vs subsets depends on wordType = set vs superset; may want to standardize this in the future?
                if (oNode.globalDynamicData.hasOwnProperty("sets")) {
                    aSubsets = oNode.globalDynamicData.sets;
                }
                if (oNode.globalDynamicData.hasOwnProperty("subsets")) {
                    aSubsets = oNode.globalDynamicData.subsets;
                }
                var alreadyCreated = false;
                // look through every subset to determine whether the organizedBy subset has already been created; if yes, it will have same uniqueID and will be role5
                for (var s=0;s < aSubsets.length;s++) {
                    var nextSubsetSlug = aSubsets[s];
                    var oSubset = oRFL.current[nextSubsetSlug];
                    if (oSubset.globalDynamicData.hasOwnProperty("restrictsValueManagement")) {
                        var oRVMs_role5 = oSubset.globalDynamicData.restrictsValueManagement;
                        jQuery.each(oRVMs_role5,function(uID,oRVM){
                            if (uID == uniqueID) {
                                alreadyCreated = true;
                                console.log("alreadyCreated = true; uniqueID: "+uniqueID);
                            }
                        });
                    }
                }
                if (!alreadyCreated) {
                    // incomplete; need to create the new organizedBy subset, which will be role5, and then add subsetOf relationship
                    var newSubset_slug = "_organizedBy_";
                    var oNewSubset = await MiscFunctions.createNewWordByTemplate("set");
                    oNewSubset.wordData.slug = newSubset_slug;
                    oRFL.updated[newSubset_slug] = oNewSubset;
                }
            } catch (err) {
                console.log("javaScriptError with action a_rv_s1n_addorganizedbysubset; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.rV.u1r.canBeSubdividedInto":
            if (verboseConsole) { console.log("case A.rV.u1r.canBeSubdividedInto") }
            try {
                var nodeFrom_govConcept_slug = oNodeFrom.wordData.governingConcepts[0];
                var nodeTo_govConcept_slug = oNodeTo.wordData.governingConcepts[0];
                var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                oNewRel.nodeFrom.slug = nodeTo_govConcept_slug;
                oNewRel.relationshipType.slug = "canBeSubdividedInto";
                oNewRel.nodeTo.slug = nodeFrom_govConcept_slug;
                var oMainSchemaForConceptGraph = oRFL.current.mainSchemaForConceptGraph;
                oMainSchemaForConceptGraph = MiscFunctions.updateSchemaWithNewRel(oMainSchemaForConceptGraph,oNewRel,oRFL.current);
                oRFL.updated.mainSchemaForConceptGraph = oMainSchemaForConceptGraph;
            } catch (err) {
                console.log("javaScriptError with action a_rv_u1r_canbesubdividedinto; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;

        default:
            // code
            break;
    }

    return oRFL;
}

const executeQueuedS1nActions = async (oS1nPatternQueue,oMapPatternToActions,oRawFileLookup) => {
    var reportHTML = "";
    reportHTML += "executeQueuedS1nActions";
    reportHTML += "<br>";
    var oRawFileLookupB = MiscFunctions.cloneObj(oRawFileLookup)
    var verboseConsole = true;

    jQuery.each( oS1nPatternQueue, async function( pattern, aAuxiliaryData ) {
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
                // if (verboseConsole) { console.log("executeQueuedS1nActions; p: "+p+"; a: "+a+"; nextAction: "+nextAction) }
                oRawFileLookupB = MiscFunctions.cloneObj(await executeSingleAction(nextAction,oNextAuxData,oRawFileLookupB));
                // MiscFunctions.printObjToConsole(oRawFileLookup)
                // if (verboseConsole) { console.log { console.log("oRawFileLookupB.updated: "+JSON.stringify(oRawFileLookupB.updated,null,4)) }
                updateRawFile(oRawFileLookupB.updated,oRawFileLookup.current,oRawFileLookupB.new);
            }
        }
    });

    return reportHTML;
}

const executeQueuedS1rActions = async (oS1rPatternQueue,oMapPatternToActions,oRawFileLookup) => {
    var reportHTML = "";
    reportHTML += "executeQueuedS1rActions";
    reportHTML += "<br>";
    var oRawFileLookupB = MiscFunctions.cloneObj(oRawFileLookup)
    var verboseConsole = true;

    jQuery.each( oS1rPatternQueue, async function( pattern, aAuxiliaryData ) {
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
                oRawFileLookupB = MiscFunctions.cloneObj(await executeSingleAction(nextAction,oNextAuxData,oRawFileLookupB));
                // MiscFunctions.printObjToConsole(oRawFileLookup)
                // if (verboseConsole) { console.log { console.log("oRawFileLookupB.updated: "+JSON.stringify(oRawFileLookupB.updated,null,4)) }
                updateRawFile(oRawFileLookupB.updated,oRawFileLookup.current,oRawFileLookupB.new);
            }
        }
    });

    // oActionDataOutput.oRawFileLookup.updated = oRFL.updated;

    return reportHTML;
}

const executeQueuedS2rActions = async (oS2rPatternQueue,oMapPatternToActions,oRawFileLookup) => {
    var reportHTML = "";
    reportHTML += "executeQueuedS2rActions";
    reportHTML += "<br>";

    return reportHTML;
}

const runActionsOneTime = async (thisState) => {
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
        reportHTML += await executeQueuedS1nActions(oS1nPatternQueue,oMapPatternToActions,oRawFileLookup)
        reportHTML += await executeQueuedS1rActions(oS1rPatternQueue,oMapPatternToActions,oRawFileLookup)
        reportHTML += await executeQueuedS2rActions(oS2rPatternQueue,oMapPatternToActions,oRawFileLookup)
    }
    if (isS1nActionsChecked) {
        reportHTML += "running ALL ACTIONS triggered by S1n PATTERNS QUEUE";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\<br>";
        reportHTML += await executeQueuedS1nActions(oS1nPatternQueue,oMapPatternToActions,oRawFileLookup)
    }
    if (isS1rActionsChecked) {
        reportHTML += "running ALL ACTIONS triggered by S1r PATTERNS QUEUE";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\<br>";
        reportHTML += await executeQueuedS1rActions(oS1rPatternQueue,oMapPatternToActions,oRawFileLookup)
    }
    if (isS2rActionsChecked) {
        reportHTML += "running ALL ACTIONS triggered by S2r PATTERNS QUEUE";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\<br>";
        reportHTML += await executeQueuedS2rActions(oS2rPatternQueue,oMapPatternToActions,oRawFileLookup)
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
