import * as MiscFunctions from '../functions/miscFunctions.js';
import * as ConceptGraphFunctions from '../functions/conceptGraphFunctions.js';
import * as NeuroCoreFunctions from '../functions/neuroCoreFunctions.js';

const jQuery = require("jquery"); 

const timeout = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// isASpecificInstanceOf:
// P.a.s1r.05 and P.a.s1r.06
// A.a.u1n.06, A.a.u1n.07, A.a.u1n.08, A.a.u1n.10

export const executeSingleAction = async (oAction,plexNeuroCore) => {
    var actionSlug = oAction.actionSlug;
    var r = oAction.r;
    var suffix = actionSlug + "_" + r;
    // console.log("executeSingleAction; suffix: "+suffix)
    jQuery("#action_"+suffix).css("background-color","yellow")

    await timeout(0)

    var verboseConsole = true;

    var oRFL = MiscFunctions.cloneObj(plexNeuroCore.oRFL)
    oRFL.updated = {};
    oRFL.new = {};
    oRFL.deleted = [];

    var oAuxiliaryData = oAction.oAuxiliaryData;

    if (oAuxiliaryData.hasOwnProperty("relationship")) {
        var nF_slug = oAuxiliaryData.relationship.nodeFrom.slug;
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.current[nF_slug]);

        var nT_slug = oAuxiliaryData.relationship.nodeTo.slug;
        var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);
    }

    if (oAuxiliaryData.hasOwnProperty("slug")) {
        var node_slug = oAuxiliaryData.slug;
        var oNode = MiscFunctions.cloneObj(oRFL.current[node_slug]);
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

    var aCurrentSlugs = Object.keys(oRFL.current)
    var aUpdatedSlugs = Object.keys(oRFL.updated)
    var aNewSlugs = Object.keys(oRFL.new)

    var aAllSlugs = Array.from(new Set([...aCurrentSlugs, ...aUpdatedSlugs, ...aNewSlugs]));

    switch (actionSlug) {
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
                var setAsRequired = false;
                var setAsUnique = false;
                if (obj1.hasOwnProperty("metaData")) {
                    if (obj1.metaData.hasOwnProperty("required")) {
                        if ((obj1.metaData.required == "true") || (obj1.metaData.required == true) ) {
                            setAsRequired = true;
                        }
                    }
                    if (obj1.metaData.hasOwnProperty("unique")) {
                        if ((obj1.metaData.unique == "true") || (obj1.metaData.unique == true) ) {
                            setAsUnique = true;
                        }
                    }
                }
                if (!oNodeTo.propertyData.hasOwnProperty("required")) {
                    oNodeTo.propertyData.required = [];
                }
                if (!oNodeTo.propertyData.hasOwnProperty("unique")) {
                    oNodeTo.propertyData.unique = [];
                }
                if (setAsRequired) {
                    oNodeTo.propertyData.required = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.propertyData.required,nT_slug)
                }
                if (setAsUnique) {
                    oNodeTo.propertyData.unique = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.propertyData.unique,nT_slug)
                }

                var includeDependencies = false;
                if (obj1.hasOwnProperty("includeDependencies")) {
                    includeDependencies = obj1.includeDependencies;
                }
                var aDependencySlugs =[];
                if (obj1.hasOwnProperty("dependencySlugs")) {
                    aDependencySlugs = obj1.dependencySlugs;
                }
                delete obj1.key;
                delete obj1.metaData;
                delete obj1.includeDependencies;
                delete obj1.dependencySlugs;
                oNodeTo = NeuroCoreFunctions.fetchNewestRawFile(nT_slug,oRFL)
                if (includeDependencies) {
                    if (!oNodeTo.propertyData.hasOwnProperty("dependencies")) {
                        oNodeTo.propertyData.dependencies = {};
                    }
                    var aEnum = [];
                    if (obj1.hasOwnProperty("enum")) {
                        aEnum = obj1.enum;
                    }
                    oNodeTo.propertyData.dependencies[key1] = {};
                    oNodeTo.propertyData.dependencies[key1].oneOf = [];
                    for (var d=0; d < aDependencySlugs.length; d++) {
                        var nextSlug = aDependencySlugs[d];
                        var propertyPath = NeuroCoreFunctions.fetchPropertyPathFromSlug(nextSlug,oRFL);
                        var nextEnum = aEnum[d];
                        var oNextEntry = {};
                        oNextEntry.properties = {};
                        oNextEntry.required = [propertyPath];
                        oNextEntry.properties[key1] = {};
                        oNextEntry.properties[key1].enum = [ nextEnum ];
                        oNextEntry.properties[propertyPath] = {};
                        var refValue = "#/definitions/"+propertyPath;
                        oNextEntry.properties[propertyPath]["$ref"] = refValue;
                        oNodeTo.propertyData.dependencies[key1].oneOf.push(oNextEntry);
                    }
                }
                if (!oNodeTo.propertyData.hasOwnProperty("properties")) {
                    oNodeTo.propertyData.properties = {};
                }
                oNodeTo.propertyData.properties[key1] = obj1
                oRFL.updated[nT_slug] = oNodeTo;
                window.neuroCore.oRFL.updated[nT_slug] = oNodeTo;
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
                oNodeTo = NeuroCoreFunctions.fetchNewestRawFile(nT_slug,oRFL)
                // var propertyType = oNodeTo.propertyData.type;
                var targetPropertyType = oAuxiliaryData.relationship.relationshipType.restrictsValueData.targetPropertyType;
                if (targetPropertyType=="string") {
                    oNodeTo.propertyData.enum = arr2;
                }
                if (targetPropertyType=="array") {
                    oNodeTo.propertyData.items = {};
                    oNodeTo.propertyData.items.enum = arr2;
                }

                oRFL.updated[nT_slug] = oNodeTo;
                window.neuroCore.oRFL.updated[nT_slug] = oNodeTo;
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

                var includeDependencies = false;
                if (obj1.hasOwnProperty("includeDependencies")) {
                    includeDependencies = obj1.includeDependencies;
                }
                var aDependencySlugs =[];
                if (obj1.hasOwnProperty("dependencySlugs")) {
                    aDependencySlugs = obj1.dependencySlugs;
                }
                delete obj1.key;
                delete obj1.metaData;
                delete obj1.includeDependencies;
                delete obj1.dependencySlugs;

                oNodeTo = NeuroCoreFunctions.fetchNewestRawFile(nT_slug,oRFL)
                /*
                if (includeDependencies) {
                    var aEnum = [];
                    if (obj1.hasOwnProperty("enum")) {
                        aEnum = obj1.enum;
                    }
                    for (var d=0; d < aDependencySlugs.length; d++) {
                        var nextSlug = aDependencySlugs[d];
                        var propertyPath = NeuroCoreFunctions.fetchPropertyPathFromSlug(nextSlug,oRFL);
                        var nextEnum = aEnum[d];
                        var oNextEntry = {};
                        oNextEntry.properties = {};
                        oNextEntry.required = [propertyPath];
                        oNextEntry.properties[key1] = {};
                        oNextEntry.properties[key1].enum = [ nextEnum ];
                        oNextEntry.properties[propertyPath] = {};
                        var refValue = "#/definitions/"+propertyPath;
                        oNextEntry.properties[propertyPath]["$ref"] = refValue;
                        oNodeTo.dependencies[key1].oneOf.push(oNextEntry);
                    }
                }
                */

                oNodeTo.required = [key1];
                oNodeTo.properties[key1] = obj1;
                oRFL.updated[nT_slug] = oNodeTo;
                window.neuroCore.oRFL.updated[nT_slug] = oNodeTo;
            } catch (err) {
                console.log("javaScriptError with action a_b_u1n_04; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.b.u1n.05":
            if (verboseConsole) { console.log("case A.b.u1n.05") }
            try {
                var arr1 = oNodeFrom.globalDynamicData.specificInstances;
                oNodeTo = NeuroCoreFunctions.fetchNewestRawFile(nT_slug,oRFL)

                var uniquePropertyKey = oAuxiliaryData.relationship.relationshipType.restrictsValueData.uniquePropertyKey;
                var propertyPath = oAuxiliaryData.relationship.relationshipType.restrictsValueData.propertyPath;
                var arr2 = ConceptGraphFunctions.translateSlugsToUniquePropertyValues(arr1,propertyPath,uniquePropertyKey);

                var targetPropertyType = oAuxiliaryData.relationship.relationshipType.restrictsValueData.targetPropertyType;
                if (targetPropertyType=="string") {
                    oNodeTo.propertyData.enum = arr2;
                    oNodeTo.propertyData.dependencySlugs = arr1;
                }
                if (targetPropertyType=="array") {
                    oNodeTo.propertyData.items = {};
                    oNodeTo.propertyData.items.enum = arr2;
                    oNodeTo.propertyData.items.dependencySlugs = arr1;
                }

                oRFL.updated[nT_slug] = oNodeTo;
                window.neuroCore.oRFL.updated[nT_slug] = oNodeTo;
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
                if (!oNodeTo.globalDynamicData.hasOwnProperty("directSubsets")) {
                    oNodeTo.globalDynamicData.directSubsets = [];
                }
                oNodeTo.globalDynamicData.directSubsets = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.directSubsets,nF_slug);
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
        case "a-a-u1n-05":
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
        case "a-a-u1n-06":
            if (verboseConsole) { console.log("case A.a.u1n.06") }
            try {
                console.log("case A.a.u1n.06")
                oNodeFrom.globalDynamicData.valenceData.parentJSONSchemaSequence = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeFrom.globalDynamicData.valenceData.parentJSONSchemaSequence,oNodeTo.globalDynamicData.valenceData.valenceL1);
                oRFL.updated[nF_slug] = oNodeFrom;
            } catch (err) {
                console.log("javaScriptError with action a_a_u1n_06; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "a-a-u1n-07":
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
                    nextSpecificInstance_oRVM.thisNodeRole = "role0";
                    if (!oNextSpecificInstance.globalDynamicData.restrictsValueManagement.hasOwnProperty(uniqueID)) {
                        oNextSpecificInstance.globalDynamicData.restrictsValueManagement[uniqueID] = nextSpecificInstance_oRVM;
                    }
                    oNextSpecificInstance.globalDynamicData.nodePatternCodes = NeuroCoreFunctions.removePatternCodesWithUniqueID(oNextSpecificInstance.globalDynamicData.nodePatternCodes,uniqueID);
                    oNextSpecificInstance.globalDynamicData.nodePatternCodes = MiscFunctions.pushIfNotAlreadyThere(oNextSpecificInstance.globalDynamicData.nodePatternCodes,patternName_role0);
                    oNextSpecificInstance.globalDynamicData.actionCodes = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNextSpecificInstance.globalDynamicData.actionCodes,actionCodes_role0);
                    oRFL.updated[nextSpecificInstanceSlug] = ConceptGraphFunctions.init_gDD_rVM_keys(oNextSpecificInstance);
                    // check to see if role0 node already has corresponding superset underneath; if so, add superset to list of role6 nodes
                    var supersetSlug = NeuroCoreFunctions.fetchSupersetFromWordType(nextSpecificInstanceSlug,oRFL)
                    if (supersetSlug != false) {
                        var oSupersetNode = MiscFunctions.cloneObj(oRFL.current[supersetSlug]);
                        oSupersetNode = ConceptGraphFunctions.init_gDD_rVM_keys(oSupersetNode);
                        if (!oSupersetNode.globalDynamicData.restrictsValueManagement.hasOwnProperty(uniqueID)) {
                                oSupersetNode.globalDynamicData.restrictsValueManagement[uniqueID] = role6_oRVM;
                        }
                        oNextSpecificInstance.globalDynamicData.nodePatternCodes = NeuroCoreFunctions.removePatternCodesWithUniqueID(oNextSpecificInstance.globalDynamicData.nodePatternCodes,uniqueID);
                        oSupersetNode.globalDynamicData.nodePatternCodes = MiscFunctions.pushIfNotAlreadyThere(oSupersetNode.globalDynamicData.nodePatternCodes,patternName_role6);
                        // oSupersetNode.globalDynamicData.actionCodes = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oSupersetNode.globalDynamicData.actionCodes,actionCodes_role6);
                        oRFL.updated[supersetSlug] = oSupersetNode;
                    }
                }

                oNodeFrom = ConceptGraphFunctions.init_gDD_rVM_keys(oNodeFrom);
                if (!oNodeFrom.globalDynamicData.restrictsValueManagement.hasOwnProperty(uniqueID)) {
                    oNodeFrom.globalDynamicData.restrictsValueManagement[uniqueID] = nF_oRVM;
                }
                oNodeFrom.globalDynamicData.nodePatternCodes = NeuroCoreFunctions.removePatternCodesWithUniqueID(oNodeFrom.globalDynamicData.nodePatternCodes,uniqueID);
                oNodeFrom.globalDynamicData.nodePatternCodes = MiscFunctions.pushIfNotAlreadyThere(oNodeFrom.globalDynamicData.nodePatternCodes,patternName_role1);
                oNodeFrom.globalDynamicData.actionCodes = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeFrom.globalDynamicData.actionCodes,actionCodes_role1);

                oNodeTo = ConceptGraphFunctions.init_gDD_rVM_keys(oNodeTo);
                if (!oNodeTo.globalDynamicData.restrictsValueManagement.hasOwnProperty(uniqueID)) {
                    oNodeTo.globalDynamicData.restrictsValueManagement[uniqueID] = nT_oRVM;
                }
                oNodeTo.globalDynamicData.nodePatternCodes = NeuroCoreFunctions.removePatternCodesWithUniqueID(oNodeTo.globalDynamicData.nodePatternCodes,uniqueID);
                oNodeTo.globalDynamicData.nodePatternCodes = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.nodePatternCodes,patternName_role2);
                oNodeTo.globalDynamicData.actionCodes = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeTo.globalDynamicData.actionCodes,actionCodes_role2);

                if (oRFL.current.hasOwnProperty(role3_slug)) {
                    var oRole3 = MiscFunctions.cloneObj(oRFL.current[role3_slug]);
                    oRole3 = ConceptGraphFunctions.init_gDD_rVM_keys(oRole3);
                    if (!oRole3.globalDynamicData.restrictsValueManagement.hasOwnProperty(uniqueID)) {
                        oRole3.globalDynamicData.restrictsValueManagement[uniqueID] = role3_oRVM;
                    }
                    oRole3.globalDynamicData.nodePatternCodes = NeuroCoreFunctions.removePatternCodesWithUniqueID(oRole3.globalDynamicData.nodePatternCodes,uniqueID);
                    oRole3.globalDynamicData.nodePatternCodes = MiscFunctions.pushIfNotAlreadyThere(oRole3.globalDynamicData.nodePatternCodes,patternName_role3);
                    // oRole3.globalDynamicData.actionCodes = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oRole3.globalDynamicData.actionCodes,actionCodes_role3);
                    oRFL.updated[role3_slug] = oRole3;
                }

                if (oRFL.current.hasOwnProperty(role4_slug)) {
                    var oRole4 = MiscFunctions.cloneObj(oRFL.current[role4_slug]);
                    oRole4 = ConceptGraphFunctions.init_gDD_rVM_keys(oRole4);
                    if (!oRole4.globalDynamicData.restrictsValueManagement.hasOwnProperty(uniqueID)) {
                        oRole4.globalDynamicData.restrictsValueManagement[uniqueID] = role4_oRVM;
                    }
                    oRole4.globalDynamicData.nodePatternCodes = NeuroCoreFunctions.removePatternCodesWithUniqueID(oRole4.globalDynamicData.nodePatternCodes,uniqueID);
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
                // oNode.wordData.tag="A.rV.s1n.connectSubsets"
                // console.log("A.rV.s1n.connectSubsets oAuxiliaryData: "+JSON.stringify(oAuxiliaryData,null,4)+"; nextPatternCode: "+ nextPatternCode+"; nextUniqueID: "+ nextUniqueID);
                var role5GoverningConcept_slug = oNode.setData.metaData.governingConcept.slug;
                var oRole5GoverningConcept = oRFL.current[role5GoverningConcept_slug];
                var schema_slug = oRole5GoverningConcept.conceptData.nodes.schema.slug;
                var oSchema = oRFL.current[schema_slug];
                var aRole6_slugs = oNode.globalDynamicData.restrictsValueManagement[nextUniqueID].role6_slugs
                for (var s=0; s < aRole6_slugs.length; s++) {
                    var nextRole6Slug = aRole6_slugs[s];
                    var oNextNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                    oNextNewRel.nodeFrom.slug = nextRole6Slug;
                    oNextNewRel.relationshipType.slug = "subsetOf";
                    oNextNewRel.nodeTo.slug = node_slug;
                    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oNextNewRel,oRFL.current);
                }
                oRFL.updated[schema_slug] = oSchema;
                oRFL.updated[node_slug] = oNode;


            } catch (err) {
                console.log("javaScriptError with action a_rv_s1n_connectsubsets; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.u1n.makeSuperset":
            if (verboseConsole) { console.log("case A.c.u1n.makeSuperset") }
            try {
                // might deprecate this action
                // check whether this is already a wordType
                // oNode.wordData.foo = "executing A.c.u1n.makeSuperset";
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
                    // oRFL.new[superset_slug] = oNewSuperset;
                    // make new relationship and add to schema
                    // may need to replace this with a more complete function to create full concept from wordType;
                    // as things are, I do not have a schema in which to store the isTheSupersetFor relationship
                    /*
                    var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                    oNewRel.nodeFrom.slug = superset_slug;
                    oNewRel.relationshipType.slug = "isTheSupersetFor";
                    oNewRel.nodeTo.slug = wT_slug;
                    var schemaSlug = NeuroCoreFunctions.fetchSchemaFromWordType(wT_slug,oRFL)
                    var oSchema = NeuroCoreFunctions.fetchNewestRawFile(schemaSlug,oRFL)
                    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oNewRel,oRFL.current);
                    oRFL.updated[schemaSlug] = oSchema;
                    */
                }
                // oRFL.updated[node_slug] = oNode;

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
                var aRole0_slugs = oNode.globalDynamicData.restrictsValueManagement[nextUniqueID].role0_slugs
                oNode.propertyData.dependencySlugs = aRole0_slugs
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
                var aSubsets = [];
                // current sets vs subsets depends on wordType = set vs superset; may want to standardize this in the future?
                if (oNode.globalDynamicData.hasOwnProperty("sets")) {
                    aSubsets = oNode.globalDynamicData.sets;
                }
                if (oNode.globalDynamicData.hasOwnProperty("subsets")) {
                    aSubsets = oNode.globalDynamicData.subsets;
                }
                // determine whether role5 node already exists
                var alreadyCreated = false;
                if (oNode.globalDynamicData.hasOwnProperty("restrictsValueManagement")) {
                    var oRVMs_role5 = oNode.globalDynamicData.restrictsValueManagement;
                    jQuery.each(oRVMs_role5,function(uID,oRVM){
                        if (uID == uniqueID) {
                            alreadyCreated = true;
                            console.log("alreadyCreated = true; uniqueID: "+uniqueID);
                        }
                    });
                }
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
                    var role1_slug = oNode.globalDynamicData.restrictsValueManagement[uniqueID].role1_slug;
                    var role2_slug = oNode.globalDynamicData.restrictsValueManagement[uniqueID].role2_slug;
                    var role3_slug = oNode.globalDynamicData.restrictsValueManagement[uniqueID].role3_slug;
                    var role4_slug = oNode.globalDynamicData.restrictsValueManagement[uniqueID].role4_slug;
                    var oRole1 = oRFL.current[role1_slug];
                    var oRole4 = oRFL.current[role4_slug];
                    if (oRole1.hasOwnProperty("supersetData")) {
                        var role1_name = oRole1.supersetData.name;
                    } else {
                        var role1_name = oRole1.wordData.name;
                    }
                    if (oRole4.hasOwnProperty("supersetData")) {
                        var role4_name = oRole4.supersetData.name;
                    } else {
                        var role4_name = oRole4.wordData.name;
                    }
                    var role4_name = oRole4.supersetData.name;
                    var newSubset_slug = role4_name+"_organizedBy_"+role1_name;
                    var newSubset_title = role4_name[0].toUpperCase() + role4_name.substring(1)+" Organized by "+role1_name;
                    var newSubset_name = role4_name+" organized by "+role1_name;
                    var oNewSubset = await MiscFunctions.createNewWordByTemplate("set");
                    oNewSubset.wordData.slug = newSubset_slug;
                    oNewSubset.wordData.title = newSubset_title;
                    oNewSubset.wordData.name = newSubset_name;
                    oNewSubset.setData.slug = newSubset_slug;
                    oNewSubset.setData.title = newSubset_title;
                    oNewSubset.setData.name = newSubset_name;
                    var role4GoverningConcept_slug = oRole4.wordData.governingConcepts[0];
                    oNewSubset.wordData.governingConcepts = oRole4.wordData.governingConcepts;
                    oNewSubset.setData.governingConcepts = oRole4.wordData.governingConcepts;
                    oNewSubset.setData.metaData.governingConcept.slug = role4GoverningConcept_slug;
                    oNewSubset = ConceptGraphFunctions.init_gDD_rVM_keys(oNewSubset);
                    var oRVM = MiscFunctions.cloneObj(oNode.globalDynamicData.restrictsValueManagement[uniqueID]);
                    oRVM.thisNodeRole = "role5";
                    var role5_slug = newSubset_slug
                    oRVM.role5_slug = role5_slug;
                    oNewSubset.globalDynamicData.restrictsValueManagement[uniqueID] = oRVM;
                    var nPC = nextPatternCode.replace(".04", ".05");
                    oNewSubset.globalDynamicData.nodePatternCodes.push(nPC);
                    oRFL.updated[newSubset_slug] = oNewSubset;
                    // update role5_slug in relevant other nodes
                    var aRole0_slugs = oRVM.role0_slugs;
                    var aRole6_slugs = oRVM.role6_slugs;
                    for (var s=0;s < aRole0_slugs.length;s++) {
                        var nextRole0Slug = aRole0_slugs[s];
                        var oNextRole0 = oRFL.current[nextRole0Slug];
                        oNextRole0.globalDynamicData.restrictsValueManagement[uniqueID].role5_slug = role5_slug;
                        oRFL.updated[nextRole0Slug] = oNextRole0;
                    }
                    for (var s=0;s < aRole6_slugs.length;s++) {
                        var nextRole6Slug = aRole6_slugs[s];
                        var oNextRole6 = oRFL.current[nextRole6Slug];
                        oNextRole6.globalDynamicData.restrictsValueManagement[uniqueID].role5_slug = role5_slug;
                        oRFL.updated[nextRole6Slug] = oNextRole6;
                    }
                    // now make new subsetOf relationship and add it to relevant schema
                    var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                    oNewRel.nodeFrom.slug = role5_slug
                    oNewRel.relationshipType.slug = "subsetOf";
                    oNewRel.nodeTo.slug = role4_slug;
                    var oRole4GoverningConcept = oRFL.current[role4GoverningConcept_slug]
                    var role4GovConSchema_slug = oRole4GoverningConcept.conceptData.nodes.schema.slug;
                    var oRole4GovConSchema = oRFL.current[role4GovConSchema_slug];
                    var oRFL_x = MiscFunctions.cloneObj(oRFL.current);
                    oRFL_x[role5_slug] = oNewSubset;
                    oRole4GovConSchema = MiscFunctions.updateSchemaWithNewRel(oRole4GovConSchema,oNewRel,oRFL_x);
                    oRFL.updated[role4GovConSchema_slug] = oRole4GovConSchema;
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
        case "A.c.c1n.createPrimaryProperty":
            if (verboseConsole) { console.log("case A.c.c1n.createPrimaryProperty") }
            try {
                var specialNodeName = "primaryProperty";
                var newWordWordType = "property";

                // common to all specialNode types
                var sCurrConceptSingular = oNode.conceptData.name.singular;
                var sCurrConceptPlural = oNode.conceptData.name.plural;
                var oNewWord = await MiscFunctions.createNewWordByTemplate(newWordWordType)

                var newWord_slug = specialNodeName + "For_" + sCurrConceptSingular;
                var newWord_name = specialNodeName + " for " + sCurrConceptSingular;
                var newWord_title = specialNodeName.substr(0,1).toUpperCase()+specialNodeName.substr(1) + " for " + sCurrConceptSingular;
                var newWord_ipns = oNewWord.metaData.ipns;

                oNewWord.wordData.slug = newWord_slug;
                oNewWord.wordData.name = newWord_name;
                oNewWord.wordData.title = newWord_title;

                oNewWord.wordData.governingConcepts = [];
                var governingConceptSlug = oNode.wordData.slug;
                oNewWord.wordData.governingConcepts.push(governingConceptSlug)

                oNode = NeuroCoreFunctions.fetchNewestRawFile(node_slug,oRFL)
                oNode.conceptData.nodes[specialNodeName].slug = newWord_slug;
                oNode.conceptData.nodes[specialNodeName].ipns = newWord_ipns;

                oRFL.updated[node_slug] = oNode;
                window.neuroCore.oRFL.updated[node_slug] = oNode;

                // specific to primaryProperty
                oNewWord.propertyData.metaData.types = ["primaryProperty"]
                oNewWord.propertyData.metaData.governingConcept.slug = governingConceptSlug;
                oNewWord.propertyData.types = ["primaryProperty"]
                oNewWord.propertyData.type = "object";
                oNewWord.propertyData.key = sCurrConceptSingular+"Data";
                oNewWord.propertyData.name = sCurrConceptSingular+" data";
                oNewWord.propertyData.title = sCurrConceptSingular+" Data";
                oNewWord.propertyData.description = "data about this "+sCurrConceptSingular;
                oNewWord.propertyData.require = true; // whether this property is required in upstream property; may be overridden at upstream property; may deprecate this field
                oNewWord.propertyData.required = []; // list of properties that are required; applicable only if this property is an object
                oNewWord.propertyData.unique = []; // every property of type=object needs to have an unique array; if a property key is unique, then each specific instance must have a unique value
                oNewWord.propertyData.properties = {};

                oRFL.new[newWord_slug] = oNewWord;
            } catch (err) {
                console.log("javaScriptError with action a_c_c1n_createprimaryproperty; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.c1n.createSchema":
            if (verboseConsole) { console.log("case A.c.c1n.createSchema") }
            try {
                var specialNodeName = "schema";
                var newWordWordType = "schema";

                // common to all specialNode types
                var sCurrConceptSingular = oNode.conceptData.name.singular;
                var sCurrConceptPlural = oNode.conceptData.name.plural;
                var oNewWord = await MiscFunctions.createNewWordByTemplate(newWordWordType)

                var newWord_slug = specialNodeName + "For_" + sCurrConceptSingular;
                var newWord_name = specialNodeName + " for " + sCurrConceptSingular;
                var newWord_title = specialNodeName.substr(0,1).toUpperCase()+specialNodeName.substr(1) + " for " + sCurrConceptSingular;
                var newWord_ipns = oNewWord.metaData.ipns;

                oNewWord.wordData.slug = newWord_slug;
                oNewWord.wordData.name = newWord_name;
                oNewWord.wordData.title = newWord_title;

                oNewWord.wordData.governingConcepts = [];
                var governingConceptSlug = oNode.wordData.slug;
                oNewWord.wordData.governingConcepts.push(governingConceptSlug)

                oNode = NeuroCoreFunctions.fetchNewestRawFile(node_slug,oRFL)
                oNode.conceptData.nodes[specialNodeName].slug = newWord_slug;
                oNode.conceptData.nodes[specialNodeName].ipns = newWord_ipns;

                oRFL.updated[node_slug] = oNode;
                window.neuroCore.oRFL.updated[node_slug] = oNode;

                // specific to schema
                oNewWord.schemaData.metaData.types = ["conceptRelationships"]
                oNewWord.schemaData.metaData.governingConcept.slug = governingConceptSlug;
                oNewWord.schemaData.types = ["conceptRelationships"]

                oRFL.new[newWord_slug] = oNewWord;
            } catch (err) {
                console.log("javaScriptError with action a_c_c1n_createschema; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.u1n.updateMainSchemaForConceptGraph":
            if (verboseConsole) { console.log("case A.c.u1n.updateMainSchemaForConceptGraph") }
            try {
                var mainSchemaForConceptGraph_slug = "mainSchemaForConceptGraph";
                var oMainSchemaForConceptGraph = NeuroCoreFunctions.fetchNewestRawFile(mainSchemaForConceptGraph_slug,oRFL);
                var concept_slug = oNode.wordData.slug;
                oMainSchemaForConceptGraph.conceptGraphData.concepts = MiscFunctions.pushIfNotAlreadyThere(oMainSchemaForConceptGraph.conceptGraphData.concepts,concept_slug)
                oRFL.updated[mainSchemaForConceptGraph_slug] = oMainSchemaForConceptGraph;
            } catch (err) {
                console.log("javaScriptError with action a_c_u1n_updatemainschemaforconceptgraph; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.c1n.createPropertySchema":
            if (verboseConsole) { console.log("case A.c.c1n.createPropertySchema") }
            try {
                var specialNodeName = "propertySchema";
                var newWordWordType = "schema";

                // common to all specialNode types
                var sCurrConceptSingular = oNode.conceptData.name.singular;
                var sCurrConceptPlural = oNode.conceptData.name.plural;
                var oNewWord = await MiscFunctions.createNewWordByTemplate(newWordWordType)

                var newWord_slug = specialNodeName + "For_" + sCurrConceptSingular;
                var newWord_name = specialNodeName + " for " + sCurrConceptSingular;
                var newWord_title = specialNodeName.substr(0,1).toUpperCase()+specialNodeName.substr(1) + " for " + sCurrConceptSingular;
                var newWord_ipns = oNewWord.metaData.ipns;

                oNewWord.wordData.slug = newWord_slug;
                oNewWord.wordData.name = newWord_name;
                oNewWord.wordData.title = newWord_title;

                oNewWord.wordData.governingConcepts = [];
                var governingConceptSlug = oNode.wordData.slug;
                oNewWord.wordData.governingConcepts.push(governingConceptSlug)

                oNode = NeuroCoreFunctions.fetchNewestRawFile(node_slug,oRFL)
                oNode.conceptData.nodes[specialNodeName].slug = newWord_slug;
                oNode.conceptData.nodes[specialNodeName].ipns = newWord_ipns;

                oRFL.updated[node_slug] = oNode;
                window.neuroCore.oRFL.updated[node_slug] = oNode;

                // specific to propertySchema
                oNewWord.schemaData.metaData.types = ["propertySchema"]
                oNewWord.schemaData.types = ["propertySchema"]
                oNewWord.schemaData.metaData.governingConcept.slug = governingConceptSlug;

                oRFL.new[newWord_slug] = oNewWord;
            } catch (err) {
                console.log("javaScriptError with action a_c_c1n_createpropertyschema; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.c1n.createSuperset":
            if (verboseConsole) { console.log("case A.c.c1n.createSuperset") }
            try {
                var specialNodeName = "superset";
                var newWordWordType = "superset";

                // common to all specialNode types
                var sCurrConceptSingular = oNode.conceptData.name.singular;
                var sCurrConceptPlural = oNode.conceptData.name.plural;
                var oNewWord = await MiscFunctions.createNewWordByTemplate(newWordWordType)

                var newWord_slug = specialNodeName + "For_" + sCurrConceptSingular;
                var newWord_name = specialNodeName + " for " + sCurrConceptSingular;
                var newWord_title = specialNodeName.substr(0,1).toUpperCase()+specialNodeName.substr(1) + " for " + sCurrConceptSingular;
                var newWord_ipns = oNewWord.metaData.ipns;

                oNewWord.wordData.slug = newWord_slug;
                oNewWord.wordData.name = newWord_name;
                oNewWord.wordData.title = newWord_title;

                oNewWord.wordData.governingConcepts = [];
                var governingConceptSlug = oNode.wordData.slug;
                oNewWord.wordData.governingConcepts.push(governingConceptSlug)

                oNode = NeuroCoreFunctions.fetchNewestRawFile(node_slug,oRFL)
                oNode.conceptData.nodes[specialNodeName].slug = newWord_slug;
                oNode.conceptData.nodes[specialNodeName].ipns = newWord_ipns;

                oRFL.updated[node_slug] = oNode;
                window.neuroCore.oRFL.updated[node_slug] = oNode;

                // specific to superset
                oNewWord.supersetData.slug = sCurrConceptPlural;
                oNewWord.supersetData.name = sCurrConceptPlural;
                oNewWord.supersetData.title = sCurrConceptPlural.substr(0,1).toUpperCase()+sCurrConceptPlural.substr(1);
                oNewWord.supersetData.description = "This node represents the set of all "+sCurrConceptPlural+".";
                oNewWord.supersetData.metaData.governingConcept.slug = governingConceptSlug;

                oRFL.new[newWord_slug] = oNewWord;
            } catch (err) {
                console.log("javaScriptError with action a_c_c1n_createsuperset; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.c1n.createJSONSchema":
            if (verboseConsole) { console.log("case A.c.c1n.createJSONSchema") }
            try {
                var specialNodeName = "JSONSchema";
                var newWordWordType = "JSONSchema";

                // common to all specialNode types
                var sCurrConceptSingular = oNode.conceptData.name.singular;
                var sCurrConceptPlural = oNode.conceptData.name.plural;
                var oNewWord = await MiscFunctions.createNewWordByTemplate(newWordWordType)

                var newWord_slug = specialNodeName + "For_" + sCurrConceptSingular;
                var newWord_name = specialNodeName + " for " + sCurrConceptSingular;
                var newWord_title = specialNodeName.substr(0,1).toUpperCase()+specialNodeName.substr(1) + " for " + sCurrConceptSingular;
                var newWord_ipns = oNewWord.metaData.ipns;

                oNewWord.wordData.slug = newWord_slug;
                oNewWord.wordData.name = newWord_name;
                oNewWord.wordData.title = newWord_title;

                oNewWord.wordData.governingConcepts = [];
                var governingConceptSlug = oNode.wordData.slug;
                oNewWord.wordData.governingConcepts.push(governingConceptSlug)

                oNode = NeuroCoreFunctions.fetchNewestRawFile(node_slug,oRFL)
                oNode.conceptData.nodes[specialNodeName].slug = newWord_slug;
                oNode.conceptData.nodes[specialNodeName].ipns = newWord_ipns;

                oRFL.updated[node_slug] = oNode;
                window.neuroCore.oRFL.updated[node_slug] = oNode;

                // specific to JSONSchema
                oNewWord.JSONSchemaData.metaData.primaryProperty = "primaryPropertyFor_"+sCurrConceptSingular;
                oNewWord.JSONSchemaData.metaData.governingConcept.slug = governingConceptSlug;
                oNewWord.required = [ sCurrConceptSingular+"Data" ]

                oRFL.new[newWord_slug] = oNewWord;
            } catch (err) {
                console.log("javaScriptError with action a_c_c1n_createjsonschema; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.c1n.createProperties":
            if (verboseConsole) { console.log("case A.c.c1n.createProperties") }
            try {
                var specialNodeName = "properties";
                var newWordWordType = "set";

                // common to all specialNode types
                var sCurrConceptSingular = oNode.conceptData.name.singular;
                var sCurrConceptPlural = oNode.conceptData.name.plural;
                var oNewWord = await MiscFunctions.createNewWordByTemplate(newWordWordType)

                var newWord_slug = specialNodeName + "For_" + sCurrConceptSingular;
                var newWord_name = specialNodeName + " for " + sCurrConceptSingular;
                var newWord_title = specialNodeName.substr(0,1).toUpperCase()+specialNodeName.substr(1) + " for " + sCurrConceptSingular;
                var newWord_ipns = oNewWord.metaData.ipns;

                oNewWord.wordData.slug = newWord_slug;
                oNewWord.wordData.name = newWord_name;
                oNewWord.wordData.title = newWord_title;

                oNewWord.wordData.governingConcepts = [];
                var governingConceptSlug = oNode.wordData.slug;
                oNewWord.wordData.governingConcepts.push(governingConceptSlug)

                oNode = NeuroCoreFunctions.fetchNewestRawFile(node_slug,oRFL)
                oNode.conceptData.nodes[specialNodeName].slug = newWord_slug;
                oNode.conceptData.nodes[specialNodeName].ipns = newWord_ipns;

                oRFL.updated[node_slug] = oNode;
                window.neuroCore.oRFL.updated[node_slug] = oNode;

                // specific to properties
                oNewWord.setData.metaData.types = ["mainPropertiesSet"]
                oNewWord.setData.metaData.governingConcept.slug = governingConceptSlug;
                oNewWord.setData.slug = "propertiesFor_"+sCurrConceptSingular;
                oNewWord.setData.name = "properties for "+sCurrConceptSingular;
                oNewWord.setData.title = "Properties for "+sCurrConceptSingular.substr(0,1).toUpperCase()+sCurrConceptSingular.substr(1);;
                oNewWord.setData.description = "This is the set of all properties for this particular concept."

                oRFL.new[newWord_slug] = oNewWord;
            } catch (err) {
                console.log("javaScriptError with action a_c_c1n_createproperties; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.c1n.createWordType":
            if (verboseConsole) { console.log("case A.c.c1n.createWordType") }
            try {
                var specialNodeName = "wordType";
                var newWordWordType = "wordType";

                // common to all specialNode types
                var sCurrConceptSingular = oNode.conceptData.name.singular;
                var sCurrConceptPlural = oNode.conceptData.name.plural;
                var oNewWord = await MiscFunctions.createNewWordByTemplate(newWordWordType)

                var newWord_slug = specialNodeName + "For_" + sCurrConceptSingular;
                var newWord_name = specialNodeName + " for " + sCurrConceptSingular;
                var newWord_title = specialNodeName.substr(0,1).toUpperCase()+specialNodeName.substr(1) + " for " + sCurrConceptSingular;
                var newWord_ipns = oNewWord.metaData.ipns;

                oNewWord.wordData.slug = newWord_slug;
                oNewWord.wordData.name = newWord_name;
                oNewWord.wordData.title = newWord_title;

                oNewWord.wordData.governingConcepts = [];
                var governingConceptSlug = oNode.wordData.slug;
                oNewWord.wordData.governingConcepts.push(governingConceptSlug)

                oNode = NeuroCoreFunctions.fetchNewestRawFile(node_slug,oRFL)
                oNode.conceptData.nodes[specialNodeName].slug = newWord_slug;
                oNode.conceptData.nodes[specialNodeName].ipns = newWord_ipns;

                oRFL.updated[node_slug] = oNode;
                window.neuroCore.oRFL.updated[node_slug] = oNode;

                // specific to wordType
                oNewWord.wordTypeData.slug = sCurrConceptSingular;
                oNewWord.wordTypeData.name = sCurrConceptSingular;
                oNewWord.wordTypeData.title = sCurrConceptSingular.substr(0,1).toUpperCase()+sCurrConceptSingular.substr(1);
                oNewWord.wordTypeData.metaData.governingConcept.slug = governingConceptSlug;

                oRFL.new[newWord_slug] = oNewWord;
            } catch (err) {
                console.log("javaScriptError with action a_c_c1n_createwordtype; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.u1n.updateConcept":
            if (verboseConsole) { console.log("case A.c.u1n.updateConcept") }
            try {
                oNode = NeuroCoreFunctions.fetchNewestRawFile(node_slug,oRFL)
                var node_ipns = oNode.metaData.ipns
                oNode.conceptData.nodes.concept.slug = node_slug;
                oNode.conceptData.nodes.concept.ipns = node_ipns;
                oRFL.updated[node_slug] = oNode;
                window.neuroCore.oRFL.updated[node_slug] = oNode;
            } catch (err) {
                console.log("javaScriptError with action a_c_u1n_updateconcept; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.u1n.makeBasicConceptRels":
            if (verboseConsole) { console.log("case A.c.u1n.makeBasicConceptRels") }
            try {
                var concept_slug = node_slug;
                var superset_slug = oNode.conceptData.nodes.superset.slug;
                var schema_slug = oNode.conceptData.nodes.schema.slug;
                var jsonSchema_slug = oNode.conceptData.nodes.JSONSchema.slug;
                var primaryProperty_slug = oNode.conceptData.nodes.primaryProperty.slug;
                var properties_slug = oNode.conceptData.nodes.properties.slug;
                var wordType_slug = oNode.conceptData.nodes.wordType.slug;
                var propertySchema_slug = oNode.conceptData.nodes.propertySchema.slug;

                var oSchema = NeuroCoreFunctions.fetchNewestRawFile(schema_slug,oRFL)
                var oPropertySchema = NeuroCoreFunctions.fetchNewestRawFile(propertySchema_slug,oRFL)

                var oRel1 = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                oRel1.nodeTo.slug = wordType_slug;
                var oRel2 = MiscFunctions.cloneObj(oRel1);
                var oRel3 = MiscFunctions.cloneObj(oRel1);
                var oRel4 = MiscFunctions.cloneObj(oRel1);
                var oRel5 = MiscFunctions.cloneObj(oRel1);
                var oRel6 = MiscFunctions.cloneObj(oRel1);
                var oRel7 = MiscFunctions.cloneObj(oRel1);
                var oRel8 = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);

                oSchema = NeuroCoreFunctions.fetchNewestRawFile(schema_slug,oRFL)

                if (concept_slug) {
                    oRel1.nodeFrom.slug = concept_slug;
                    oRel1.relationshipType.slug = "isTheConceptFor";
                    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oRel1,oRFL.current)
                }

                if (schema_slug) {
                    oRel2.nodeFrom.slug = schema_slug;
                    oRel2.relationshipType.slug = "isTheSchemaFor";
                    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oRel2,oRFL.current)
                }

                if (superset_slug) {
                    oRel3.nodeFrom.slug = superset_slug;
                    oRel3.relationshipType.slug = "isTheSupersetFor";
                    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oRel3,oRFL.current)
                }

                if (jsonSchema_slug) {
                    oRel4.nodeFrom.slug = jsonSchema_slug;
                    oRel4.relationshipType.slug = "isTheJSONSchemaFor";
                    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oRel4,oRFL.current)
                }

                if (propertySchema_slug) {
                    oRel5.nodeFrom.slug = propertySchema_slug;
                    oRel5.relationshipType.slug = "isThePropertySchemaFor";
                    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oRel5,oRFL.current)
                }

                if (properties_slug) {
                    oRel6.nodeFrom.slug = properties_slug;
                    oRel6.relationshipType.slug = "isTheSetOfPropertiesFor";
                    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oRel6,oRFL.current)
                }

                if (primaryProperty_slug) {
                    oRel7.nodeFrom.slug = primaryProperty_slug;
                    oRel7.relationshipType.slug = "isThePrimaryPropertyFor";
                    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oRel7,oRFL.current)
                }

                if ( (primaryProperty_slug) && (jsonSchema_slug) ) {
                    oRel8.nodeFrom.slug = primaryProperty_slug;
                    oRel8.relationshipType.slug = "addToConceptGraphProperties";
                    oRel8.nodeTo.slug = jsonSchema_slug;
                    oPropertySchema = MiscFunctions.updateSchemaWithNewRel(oPropertySchema,oRel8,oRFL.current)
                }

                oRFL.updated[schema_slug] = oSchema;
                oRFL.updated[propertySchema_slug] = oPropertySchema;

            } catch (err) {
                console.log("javaScriptError with action a_c_u1n_makebasicconceptrels; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.b.cmn.primaryProperty":
            if (verboseConsole) { console.log("case A.b.cmn.primaryProperty") }
            try {
                if (oNode.propertyData.metaData.hasOwnProperty("governingConcept")) {
                    var governingConcept_slug = oNode.propertyData.metaData.governingConcept.slug;
                } else {
                    var governingConcept_slug = oNode.wordData.governingConcepts[0];
                }

                var oGoverningConcept = NeuroCoreFunctions.fetchNewestRawFile(governingConcept_slug,oRFL);
                var propertySchema_slug = oGoverningConcept.conceptData.nodes.propertySchema.slug;
                var oPropertySchema = NeuroCoreFunctions.fetchNewestRawFile(propertySchema_slug,oRFL);

                var aDefaultPropertiesThisConceptGraph = ["slug","name","title","description"];
                // if present, replace above array with data from mainSchemaForConceptGraph
                var mainSchemaForCG_slug = "mainSchemaForConceptGraph";
                var oMainSchemaForConceptGraph = NeuroCoreFunctions.fetchNewestRawFile(mainSchemaForCG_slug,oRFL)
                if (oMainSchemaForConceptGraph.hasOwnProperty("conceptGraphData")) {
                    if (oMainSchemaForConceptGraph.conceptGraphData.hasOwnProperty("defaultPropertyDescriptors")) {
                        aDefaultPropertiesThisConceptGraph = oMainSchemaForConceptGraph.conceptGraphData.defaultPropertyDescriptors;
                    }
                }

                // now remove defaults that are omitted in this concept
                var aDefaultPropertiesToOmit = [];
                if (oGoverningConcept.conceptData.hasOwnProperty("defaultProperties")) {
                    aDefaultPropertiesToOmit = oGoverningConcept.conceptData.defaultProperties.omit;
                }
                var aDefaultPropertiesThisConcept = [];
                for (var x=0;x<aDefaultPropertiesThisConceptGraph.length;x++) {
                    var nextDP = aDefaultPropertiesThisConceptGraph[x];
                    if (!aDefaultPropertiesToOmit.includes(nextDP)) {
                        aDefaultPropertiesThisConcept.push(nextDP)
                    }
                }

                var aPropertySchemaRels = oPropertySchema.schemaData.relationships;

                var singular = oGoverningConcept.conceptData.name.singular;

                var alreadyMade_slug = false;
                var alreadyMade_title = false;
                var alreadyMade_name = false;
                var alreadyMade_description = false;

                var alreadyMade = {};
                for (var x=0;x<aDefaultPropertiesThisConcept.length;x++) {
                    var nextDP = aDefaultPropertiesThisConcept[x];
                    alreadyMade[nextDP]=false;
                }

                for (var r=0; r < aPropertySchemaRels.length;r++) {
                    var oNextRel = aPropertySchemaRels[r];
                    var nT_slug = oNextRel.nodeTo.slug;
                    if (nT_slug == node_slug) {
                        var rT_slug = oNextRel.relationshipType.slug;
                        if (rT_slug = "addToConceptGraphProperties") {
                            var nF_slug = oNextRel.nodeFrom.slug;
                            var oNodeFrom = NeuroCoreFunctions.fetchNewestRawFile(nF_slug,oRFL);
                            var nF_pD_name = oNodeFrom.propertyData.name;
                            for (var x=0;x<aDefaultPropertiesThisConcept.length;x++) {
                                var nextDP = aDefaultPropertiesThisConcept[x];
                                // console.log("qwerty nextDP: "+nextDP)
                                if (nF_pD_name == nextDP) {
                                    alreadyMade[nextDP]=true;
                                    // console.log("qwerty alreadyMade nextDP: "+nextDP)
                                }
                            }
                        }
                    }
                }

                var newWordType = "property";

                for (var x=0;x<aDefaultPropertiesThisConcept.length;x++) {
                    var nextDP = aDefaultPropertiesThisConcept[x];
                    if (!alreadyMade[nextDP]) {
                        // make new word for slug
                        var newItemName = nextDP;
                        var newWord_slug = "propertyFor_"+singular+"_"+newItemName;
                        var newWord_title = "Property for "+singular+": "+newItemName;
                        var newWord_name = "property for "+singular+": "+newItemName;
                        var newWord_description = "The top-level "+newItemName+" for this "+singular;

                        var oNewWordForSlug = await MiscFunctions.createNewWordByTemplate(newWordType);
                        oNewWordForSlug.wordData.slug = newWord_slug;

                        oNewWordForSlug.wordData.title = newWord_title;
                        oNewWordForSlug.wordData.name = newWord_name;
                        oNewWordForSlug.wordData.description = newWord_description;

                        oNewWordForSlug.propertyData.key = newItemName;
                        oNewWordForSlug.propertyData.type = "string";
                        oNewWordForSlug.propertyData.title = newItemName[0].toUpperCase() + newItemName.substring(1);
                        oNewWordForSlug.propertyData.name = newItemName;
                        oNewWordForSlug.propertyData.description = newWord_description;

                        oNewWordForSlug.wordData.governingConcepts.push(governingConcept_slug);
                        oNewWordForSlug.propertyData.metaData.governingConcept.slug = governingConcept_slug;

                        oRFL.new[newWord_slug] = oNewWordForSlug;

                        // create new rel and add it to propertySchema
                        var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                        oNewRel.nodeFrom.slug = newWord_slug
                        oNewRel.relationshipType.slug = "addToConceptGraphProperties";
                        oNewRel.nodeTo.slug = node_slug;
                        var oRFL_x = MiscFunctions.cloneObj(oRFL.current);
                        oRFL_x[newWord_slug] = oNewWordForSlug;
                        oPropertySchema = MiscFunctions.updateSchemaWithNewRel(oPropertySchema,oNewRel,oRFL_x)
                        oRFL.updated[propertySchema_slug] = oPropertySchema;
                    }
                }
            } catch (err) {
                console.log("javaScriptError with action a_b_cmn_primaryproperty; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.rV.u1n.populateJSONSchemaDefinitions":
            if (verboseConsole) { console.log("case A.rV.u1n.populateJSONSchemaDefinitions") }
            try {
                // find JSONSchema
                var governingConcept_slug = oNode.propertyData.metaData.governingConcept.slug;
                var oGoverningConcept = NeuroCoreFunctions.fetchNewestRawFile(governingConcept_slug,oRFL)
                var jsonSchema_slug = oGoverningConcept.conceptData.nodes.JSONSchema.slug;
                var oJSONSchema = NeuroCoreFunctions.fetchNewestRawFile(jsonSchema_slug,oRFL)
                var aRole0_slugs = oNode.globalDynamicData.restrictsValueManagement[nextUniqueID].role0_slugs;
                for (var s=0;s < aRole0_slugs.length;s++) {
                    var nextRole0_slug = aRole0_slugs[s];
                    var [nextDefinitionKey,oNextDefinition] = NeuroCoreFunctions.fetchMainDefinitionInfoFromWordType(nextRole0_slug,oRFL);
                    oJSONSchema.definitions[nextDefinitionKey]= oNextDefinition;
                }
                oRFL.updated[jsonSchema_slug] = oJSONSchema;

            } catch (err) {
                console.log("javaScriptError with action a_rv_u1n_populatejsonschemadefinitions; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.u1n.01":
            if (verboseConsole) { console.log("case A.c.u1n.01") }
            try {
                var governingConcept_slug = oNodeTo.wordTypeData.metaData.governingConcept.slug;
                if (governingConcept_slug) {
                    oNodeFrom.JSONSchemaData.metaData.governingConcept.slug = governingConcept_slug;
                    oRFL.updated[nF_slug] = oNodeFrom;
                }
            } catch (err) {
                console.log("javaScriptError with action a_c_u1n_01; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.u1n.02":
            if (verboseConsole) { console.log("case A.c.u1n.02") }
            try {
                var governingConcept_slug = oNodeTo.wordTypeData.metaData.governingConcept.slug;
                if (governingConcept_slug) {
                    oNodeFrom.supersetData.metaData.governingConcept.slug = governingConcept_slug;
                    oRFL.updated[nF_slug] = oNodeFrom;
                }
            } catch (err) {
                console.log("javaScriptError with action a_c_u1n_02; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.u1n.03":
            if (verboseConsole) { console.log("case A.c.u1n.03") }
            try {
                var governingConcept_slug = oNodeTo.supersetData.metaData.governingConcept.slug;
                if (governingConcept_slug) {
                    if (oNodeFrom.hasOwnProperty("setData")) {
                        if (!oNodeFrom.setData.metaData.governingConcepts.includes(governingConcept_slug)) {
                            oNodeFrom.setData.metaData.governingConcepts.push(governingConcept_slug);
                        }
                    }
                    if (oNodeFrom.hasOwnProperty("supersetData")) {
                        oNodeFrom.supersetData.metaData.governingConcept = governingConcept_slug;
                    }
                    oRFL.updated[nF_slug] = oNodeFrom;
                }
            } catch (err) {
                console.log("javaScriptError with action a_c_u1n_03; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.u1n.10":
            if (verboseConsole) { console.log("case A.c.u1n.10") }
            try {
                var governingConcept_slug = oNodeTo.wordTypeData.metaData.governingConcept.slug;
                if (governingConcept_slug) {
                    oNodeFrom.schemaData.metaData.governingConcept.slug = governingConcept_slug;
                    oRFL.updated[nF_slug] = oNodeFrom;
                }
            } catch (err) {
                console.log("javaScriptError with action a_c_u1n_10; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.u1n.11":
            if (verboseConsole) { console.log("case A.c.u1n.11") }
            try {
                var governingConcept_slug = oNodeTo.wordTypeData.metaData.governingConcept.slug;
                if (governingConcept_slug) {
                    if (jQuery.inArray(governingConcept_slug,oNodeFrom.setData.metaData.governingConcepts) == -1) {
                        oNodeFrom.setData.metaData.governingConcepts.push(governingConcept_slug);
                    }
                    oRFL.updated[nF_slug] = oNodeFrom;
                }
            } catch (err) {
                console.log("javaScriptError with action a_c_u1n_11; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.u1n.12":
            if (verboseConsole) { console.log("case A.c.u1n.12") }
            try {
                var governingConcept_slug = oNodeTo.wordTypeData.metaData.governingConcept.slug;
                if (governingConcept_slug) {
                    oNodeFrom.schemaData.metaData.governingConcept.slug = governingConcept_slug;
                    oRFL.updated[nF_slug] = oNodeFrom;
                }
            } catch (err) {
                console.log("javaScriptError with action a_c_u1n_12; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.a.umn.populateSpecificInstances":
            if (verboseConsole) { console.log("case A.a.umn.populateSpecificInstances") }
            try {
                var aSpecificInstances = oNode.globalDynamicData.specificInstances;
                var governingConcept_slug = oNode.supersetData.metaData.governingConcept.slug;
                var oGoverningConcept = NeuroCoreFunctions.fetchNewestRawFile(governingConcept_slug,oRFL)
                var governingConcept_wordType = oGoverningConcept.conceptData.nodes.wordType.slug;
                for (var s=0; s < aSpecificInstances.length; s++) {
                    var nextSpecificInstance_slug = aSpecificInstances[s];
                    var oNextSpecificInstance = NeuroCoreFunctions.fetchNewestRawFile(nextSpecificInstance_slug,oRFL)
                    oNextSpecificInstance.globalDynamicData.specificInstanceOf = MiscFunctions.pushIfNotAlreadyThere(oNextSpecificInstance.globalDynamicData.specificInstanceOf,governingConcept_wordType);
                    oRFL.updated[nextSpecificInstance_slug] = oNextSpecificInstance;
                }


            } catch (err) {
                console.log("javaScriptError with action a_a_umn_populatespecificinstances; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "a-a-u1n-08":
            if (verboseConsole) { console.log("case A.a.u1n.08") }
            try {
                if (!oNodeTo.globalDynamicData.hasOwnProperty("directSpecificInstances")) {
                    oNodeTo.globalDynamicData.directSpecificInstances = [];
                }
                oNodeTo.globalDynamicData.directSpecificInstances = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.directSpecificInstances,nF_slug);
                oRFL.updated[nT_slug] = oNodeTo;
            } catch (err) {
                console.log("javaScriptError with action a_a_u1n_08; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.a.u1n.09":
            if (verboseConsole) { console.log("case A.a.u1n.09") }
            try {
                if (!oNodeFrom.globalDynamicData.hasOwnProperty("subsetOf")) {
                    oNodeFrom.globalDynamicData.subsetOf = [];
                }
                oNodeFrom.globalDynamicData.subsetOf = MiscFunctions.pushIfNotAlreadyThere(oNodeFrom.globalDynamicData.subsetOf,nT_slug);
                if (!oNodeFrom.globalDynamicData.hasOwnProperty("directSubsetOf")) {
                    oNodeFrom.globalDynamicData.directSubsetOf = [];
                }
                oNodeFrom.globalDynamicData.directSubsetOf = MiscFunctions.pushIfNotAlreadyThere(oNodeFrom.globalDynamicData.directSubsetOf,nT_slug);
                oRFL.updated[nF_slug] = oNodeFrom;
            } catch (err) {
                console.log("javaScriptError with action a_a_u1n_09; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "a-a-u1n-10":
            if (verboseConsole) { console.log("case A.a.u1n.10") }
            try {
                if (!oNodeFrom.globalDynamicData.hasOwnProperty("specificInstanceOf")) {
                    oNodeFrom.globalDynamicData.specificInstanceOf = [];
                }
                oNodeFrom.globalDynamicData.specificInstanceOf = MiscFunctions.pushIfNotAlreadyThere(oNodeFrom.globalDynamicData.specificInstanceOf,nT_slug);

                if (!oNodeFrom.globalDynamicData.hasOwnProperty("directSpecificInstanceOf")) {
                    oNodeFrom.globalDynamicData.directSpecificInstanceOf = [];
                }
                oNodeFrom.globalDynamicData.directSpecificInstanceOf = MiscFunctions.pushIfNotAlreadyThere(oNodeFrom.globalDynamicData.directSpecificInstanceOf,nT_slug);

                var arr1 = [];
                if (oNodeTo.globalDynamicData.hasOwnProperty("subsetOf")) {
                    arr1 = oNodeTo.globalDynamicData.subsetOf;
                }
                oNodeFrom.globalDynamicData.specificInstanceOf = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeFrom.globalDynamicData.specificInstanceOf,arr1);

                oRFL.updated[nF_slug] = oNodeFrom;
            } catch (err) {
                console.log("javaScriptError with action a_a_u1n_10; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.rV.u1n.transferRole6":
            if (verboseConsole) { console.log("case A.rV.u1n.transferRole6") }
            try {
                var aSpecificInstances = oNode.globalDynamicData.specificInstances;
                var aRole6 = [];
                for (var z=0;z < aSpecificInstances.length;z++) {
                    var nextSpecificInstance_slug = aSpecificInstances[z];
                    var nextSuperset_slug = NeuroCoreFunctions.fetchSupersetFromWordType(nextSpecificInstance_slug,oRFL);
                    aRole6.push(nextSuperset_slug);
                }
                oNode.globalDynamicData.restrictsValueManagement[nextUniqueID].role6_slugs = aRole6;

                var role2_slug = oNode.globalDynamicData.restrictsValueManagement[nextUniqueID].role2_slug;
                if (role2_slug) {
                    var oRole2 = NeuroCoreFunctions.fetchNewestRawFile(role2_slug,oRFL)
                    oRole2.globalDynamicData.restrictsValueManagement[nextUniqueID].role6_slugs = aRole6;
                    oRFL.updated[role2_slug] = oRole2;
                }

                var role3_slug = oNode.globalDynamicData.restrictsValueManagement[nextUniqueID].role3_slug;
                if (role3_slug) {
                    var oRole3 = NeuroCoreFunctions.fetchNewestRawFile(role3_slug,oRFL)
                    oRole3.globalDynamicData.restrictsValueManagement[nextUniqueID].role6_slugs = aRole6;
                    oRFL.updated[role3_slug] = oRole3;
                }

                var role4_slug = oNode.globalDynamicData.restrictsValueManagement[nextUniqueID].role4_slug;
                if (role4_slug) {
                    var oRole4 = NeuroCoreFunctions.fetchNewestRawFile(role4_slug,oRFL)
                    oRole4.globalDynamicData.restrictsValueManagement[nextUniqueID].role6_slugs = aRole6;
                    oRFL.updated[role4_slug] = oRole4;
                }

                var role5_slug = oNode.globalDynamicData.restrictsValueManagement[nextUniqueID].role5_slug;
                if (role5_slug) {
                    var oRole5 = NeuroCoreFunctions.fetchNewestRawFile(role5_slug,oRFL)
                    oRole5.globalDynamicData.restrictsValueManagement[nextUniqueID].role6_slugs = aRole6;
                    oRFL.updated[role5_slug] = oRole5;
                }

            } catch (err) {
                console.log("javaScriptError with action a_rv_u1n_transferrole6; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.rV.s1n.updateRole5id":
            if (verboseConsole) { console.log("case A.rV.s1n.updateRole5id") }
            try {
                var aRole6 = oNode.globalDynamicData.restrictsValueManagement[nextUniqueID].role6_slugs;

                var role5_slug = node_slug

                var role1_slug = oNode.globalDynamicData.restrictsValueManagement[nextUniqueID].role1_slug;
                var role2_slug = oNode.globalDynamicData.restrictsValueManagement[nextUniqueID].role2_slug;
                var role3_slug = oNode.globalDynamicData.restrictsValueManagement[nextUniqueID].role3_slug;
                var role4_slug = oNode.globalDynamicData.restrictsValueManagement[nextUniqueID].role4_slug;

                if (role1_slug) {
                    var oRole1 =  NeuroCoreFunctions.fetchNewestRawFile(role1_slug,oRFL)
                    oRole1.globalDynamicData.restrictsValueManagement[nextUniqueID].role5_slug = role5_slug;
                    oRFL.updated[role1_slug] = oRole1;
                }
                if (role2_slug) {
                    var oRole2 =  NeuroCoreFunctions.fetchNewestRawFile(role2_slug,oRFL)
                    oRole2.globalDynamicData.restrictsValueManagement[nextUniqueID].role5_slug = role5_slug;
                    oRFL.updated[role2_slug] = oRole2;
                }
                if (role3_slug) {
                    var oRole3 =  NeuroCoreFunctions.fetchNewestRawFile(role3_slug,oRFL)
                    oRole3.globalDynamicData.restrictsValueManagement[nextUniqueID].role5_slug = role5_slug;
                    oRFL.updated[role3_slug] = oRole3;
                }
                if (role4_slug) {
                    var oRole4 =  NeuroCoreFunctions.fetchNewestRawFile(role4_slug,oRFL)
                    oRole4.globalDynamicData.restrictsValueManagement[nextUniqueID].role5_slug = role5_slug;
                    oRFL.updated[role4_slug] = oRole4;
                }

            } catch (err) {
                console.log("javaScriptError with action a_rv_s1n_updaterole5id; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.u1n.wordType_in_wordTypes":
            if (verboseConsole) { console.log("case A.c.u1n.wordType_in_wordTypes") }
            try {
                if (jQuery.inArray("wordType",oNode.wordData.wordTypes) == -1) {
                    oNode.wordData.wordTypes.push("wordType")
                }
                oRFL.updated[node_slug] = oNode;
            } catch (err) {
                console.log("javaScriptError with action a_c_u1n_wordtype_in_wordtypes; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.a.u1n.cleanGlobalDynamicData":
            if (verboseConsole) { console.log("case A.a.u1n.cleanGlobalDynamicData") }
            try {
                var aSpecificInstances = [];
                var aDirectSpecificInstances = [];
                var aSubsets = [];
                var aDirectSubsets = [];
                var aSets = [];

                var aSpecificInstanceOf = [];
                var aDirectSpecificInstanceOf = [];
                var aSubsetOf = [];
                var aDirectSubsetOf = [];

                var aParentJSONSchemaSequence = [];
                var aValenceL1 = [];

                //////////

                var runSpecificInstances = false;
                var runDirectSpecificInstances = false;
                var runSubsets = false;
                var runDirectSubsets = false;
                var runSets = false;

                var runSpecificInstanceOf = false;
                var runDirectSpecificInstanceOf = false;
                var runSubsetOf = false;
                var runDirectSubsetOf = false;

                var runParentJSONSchemaSequence = false;
                var runValenceL1 = false;

                ////////////

                if (oNode.globalDynamicData.hasOwnProperty("specificInstances")) {
                    aSpecificInstances = oNode.globalDynamicData.specificInstances;
                    runSpecificInstances = true;
                }

                if (oNode.globalDynamicData.hasOwnProperty("directSpecificInstances")) {
                    aDirectSpecificInstances = oNode.globalDynamicData.directSpecificInstances;
                    runDirectSpecificInstances = true;
                }

                if (oNode.globalDynamicData.hasOwnProperty("subsets")) {
                    aSubsets = oNode.globalDynamicData.subsets;
                    runSubsets = true;
                }

                if (oNode.globalDynamicData.hasOwnProperty("directSubsets")) {
                    aDirectSubsets = oNode.globalDynamicData.directSubsets;
                    runDirectSubsets = true;
                }

                if (oNode.globalDynamicData.hasOwnProperty("sets")) {
                    aSets = oNode.globalDynamicData.sets;
                    runSets = true;
                }

                if (oNode.globalDynamicData.hasOwnProperty("specificInstanceOf")) {
                    aSpecificInstanceOf = oNode.globalDynamicData.specificInstanceOf;
                    runSpecificInstanceOf = true;
                }
                if (oNode.globalDynamicData.hasOwnProperty("directSpecificInstanceOf")) {
                    aDirectSpecificInstanceOf = oNode.globalDynamicData.directSpecificInstanceOf;
                    runDirectSpecificInstanceOf = true;
                }
                if (oNode.globalDynamicData.hasOwnProperty("subsetOf")) {
                    aSubsetOf = oNode.globalDynamicData.subsetOf;
                    runSubsetOf = true;
                }
                if (oNode.globalDynamicData.hasOwnProperty("directSubsetOf")) {
                    aDirectSubsetOf = oNode.globalDynamicData.directSubsetOf;
                    runDirectSubsetOf = true;
                }

                if (oNode.globalDynamicData.hasOwnProperty("valenceData")) {
                    if (oNode.globalDynamicData.valenceData.hasOwnProperty("parentJSONSchemaSequence")) {
                        aParentJSONSchemaSequence = oNode.globalDynamicData.valenceData.parentJSONSchemaSequence;
                        runParentJSONSchemaSequence = true;
                    }
                    if (oNode.globalDynamicData.valenceData.hasOwnProperty("valenceL1")) {
                        aValenceL1 = oNode.globalDynamicData.valenceData.valenceL1;
                        runValenceL1 = true;
                    }
                }

                ////////////

                if (runSpecificInstances) {
                    oNode.globalDynamicData.specificInstances = [];
                    for (var a=0;a < aSpecificInstances.length; a++) {
                        var nextSpecificInstance_slug = aSpecificInstances[a];
                        if (aAllSlugs.includes(nextSpecificInstance_slug)) {
                            oNode.globalDynamicData.specificInstances.push(nextSpecificInstance_slug);
                        }
                    }
                }

                if (runDirectSpecificInstances) {
                    oNode.globalDynamicData.directSpecificInstances = [];
                    for (var a=0;a < aDirectSpecificInstances.length; a++) {
                        var nextDirectSpecificInstance_slug = aDirectSpecificInstances[a];
                        if (aAllSlugs.includes(nextDirectSpecificInstance_slug)) {
                            oNode.globalDynamicData.directSpecificInstances.push(nextDirectSpecificInstance_slug);
                        }
                    }
                }

                if (runSubsets) {
                    oNode.globalDynamicData.subsets = [];
                    for (var a=0;a < aSubsets.length; a++) {
                        var next_slug = aSubsets[a];
                        if (aAllSlugs.includes(next_slug)) {
                            oNode.globalDynamicData.subsets.push(next_slug);
                        }
                    }
                }
                if (runDirectSubsets) {
                    oNode.globalDynamicData.directSubsets = [];
                    for (var a=0;a < aDirectSubsets.length; a++) {
                        var next_slug = aDirectSubsets[a];
                        if (aAllSlugs.includes(next_slug)) {
                            oNode.globalDynamicData.directSubsets.push(next_slug);
                        }
                    }
                }
                if (runSets) {
                    oNode.globalDynamicData.sets = [];
                    for (var a=0;a < aSets.length; a++) {
                        var next_slug = aSets[a];
                        if (aAllSlugs.includes(next_slug)) {
                            oNode.globalDynamicData.sets.push(next_slug);
                        }
                    }
                }

                if (runSpecificInstanceOf) {
                    oNode.globalDynamicData.specificInstanceOf = [];
                    for (var a=0;a < aSpecificInstanceOf.length; a++) {
                        var next_slug = aSpecificInstanceOf[a];
                        if (aAllSlugs.includes(next_slug)) {
                            oNode.globalDynamicData.specificInstanceOf.push(next_slug);
                        }
                    }
                }
                if (runDirectSpecificInstanceOf) {
                    oNode.globalDynamicData.directSpecificInstanceOf = [];
                    for (var a=0;a < aDirectSpecificInstanceOf.length; a++) {
                        var next_slug = aDirectSpecificInstanceOf[a];
                        if (aAllSlugs.includes(next_slug)) {
                            oNode.globalDynamicData.directSpecificInstanceOf.push(next_slug);
                        }
                    }
                }
                if (runSubsetOf) {
                    oNode.globalDynamicData.subsetOf = [];
                    for (var a=0;a < aSubsetOf.length; a++) {
                        var next_slug = aSubsetOf[a];
                        if (aAllSlugs.includes(next_slug)) {
                            oNode.globalDynamicData.subsetOf.push(next_slug);
                        }
                    }
                }

                if (runDirectSubsetOf) {
                    oNode.globalDynamicData.directSubsetOf = [];
                    for (var a=0;a < aDirectSubsetOf.length; a++) {
                        var next_slug = aDirectSubsetOf[a];
                        if (aAllSlugs.includes(next_slug)) {
                            oNode.globalDynamicData.directSubsetOf.push(next_slug);
                        }
                    }
                }

                if (runParentJSONSchemaSequence) {
                    oNode.globalDynamicData.valenceData.parentJSONSchemaSequence = [];
                    for (var a=0;a < aParentJSONSchemaSequence.length; a++) {
                        var next_slug = aParentJSONSchemaSequence[a];
                        if (aAllSlugs.includes(next_slug)) {
                            oNode.globalDynamicData.valenceData.parentJSONSchemaSequence.push(next_slug);
                        }
                    }
                }
                if (runValenceL1) {
                    oNode.globalDynamicData.valenceData.valenceL1 = [];
                    for (var a=0;a < aValenceL1.length; a++) {
                        var next_slug = aValenceL1[a];
                        if (aAllSlugs.includes(next_slug)) {
                            oNode.globalDynamicData.valenceData.valenceL1.push(next_slug);
                        }
                    }
                }

                oRFL.updated[node_slug] = oNode;
            } catch (err) {
                console.log("javaScriptError with action a_a_u1n_cleanglobaldynamicdata; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.c1r.connectSuperset":
            if (verboseConsole) { console.log("case A.c.c1r.connectSuperset") }
            try {
                var desiredParentSet_slug = "supersetFor_superset";
                var parentSchema_slug = "schemaFor_superset";

                // might turn all of the below into a NeuroCoreFunction ... ?
                var arr1 = oNode.globalDynamicData.specificInstanceOf;
                if (!arr1.includes(desiredParentSet_slug)) {
                    var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                    oNewRel.nodeFrom.slug = node_slug;
                    oNewRel.relationshipType.slug = "isASpecificInstanceOf";
                    oNewRel.nodeTo.slug = desiredParentSet_slug;
                    // now add the newRel to schema for concept, wordType, superset, etc
                    var oSchema = NeuroCoreFunctions.fetchNewestRawFile(parentSchema_slug,oRFL)
                    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oNewRel,oRFL.current)
                    oRFL.updated[parentSchema_slug] = oSchema;
                }
            } catch (err) {
                console.log("javaScriptError with action a_c_c1r_connectsuperset; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.c1r.connectConcept":
            if (verboseConsole) { console.log("case A.c.c1r.connectConcept") }
            try {
                var desiredParentSet_slug = "supersetFor_concept";
                var parentSchema_slug = "schemaFor_concept";

                // might turn all of the below into a NeuroCoreFunction ... ?
                var arr1 = oNode.globalDynamicData.specificInstanceOf;
                if (!arr1.includes(desiredParentSet_slug)) {
                    var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                    oNewRel.nodeFrom.slug = node_slug;
                    oNewRel.relationshipType.slug = "isASpecificInstanceOf";
                    oNewRel.nodeTo.slug = desiredParentSet_slug;
                    // now add the newRel to schema for concept, wordType, superset, etc
                    var oSchema = NeuroCoreFunctions.fetchNewestRawFile(parentSchema_slug,oRFL)
                    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oNewRel,oRFL.current)
                    oRFL.updated[parentSchema_slug] = oSchema;
                }
            } catch (err) {
                console.log("javaScriptError with action a_c_c1r_connectconcept; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.c1r.connectWordType":
            if (verboseConsole) { console.log("case A.c.c1r.connectWordType") }
            try {
                var desiredParentSet_slug = "supersetFor_wordType";
                var parentSchema_slug = "schemaFor_wordType";

                // might turn all of the below into a NeuroCoreFunction ... ?
                var arr1 = oNode.globalDynamicData.specificInstanceOf;
                if (!arr1.includes(desiredParentSet_slug)) {
                    var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                    oNewRel.nodeFrom.slug = node_slug;
                    oNewRel.relationshipType.slug = "isASpecificInstanceOf";
                    oNewRel.nodeTo.slug = desiredParentSet_slug;
                    // now add the newRel to schema for concept, wordType, superset, etc
                    var oSchema = NeuroCoreFunctions.fetchNewestRawFile(parentSchema_slug,oRFL)
                    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oNewRel,oRFL.current)
                    oRFL.updated[parentSchema_slug] = oSchema;
                }
            } catch (err) {
                console.log("javaScriptError with action a_c_c1r_connectwordtype; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.c1r.connectJSONSchema":
            if (verboseConsole) { console.log("case A.c.c1r.connectJSONSchema") }
            try {
                var desiredParentSet_slug = "supersetFor_JSONSchema";
                var parentSchema_slug = "schemaFor_JSONSchema";

                // might turn all of the below into a NeuroCoreFunction ... ?
                var arr1 = oNode.globalDynamicData.specificInstanceOf;
                if (!arr1.includes(desiredParentSet_slug)) {
                    var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                    oNewRel.nodeFrom.slug = node_slug;
                    oNewRel.relationshipType.slug = "isASpecificInstanceOf";
                    oNewRel.nodeTo.slug = desiredParentSet_slug;
                    // now add the newRel to schema for concept, wordType, superset, etc
                    var oSchema = NeuroCoreFunctions.fetchNewestRawFile(parentSchema_slug,oRFL)
                    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oNewRel,oRFL.current)
                    oRFL.updated[parentSchema_slug] = oSchema;
                }
            } catch (err) {
                console.log("javaScriptError with action a_c_c1r_connectjsonschema; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.c1r.connectSchema":
            if (verboseConsole) { console.log("case A.c.c1r.connectSchema") }
            try {
                var desiredParentSet_slug = "mainSchemas";
                var parentSchema_slug = "schemaFor_schema";

                // might turn all of the below into a NeuroCoreFunction ... ?
                var arr1 = oNode.globalDynamicData.specificInstanceOf;
                if (!arr1.includes(desiredParentSet_slug)) {
                    var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                    oNewRel.nodeFrom.slug = node_slug;
                    oNewRel.relationshipType.slug = "isASpecificInstanceOf";
                    oNewRel.nodeTo.slug = desiredParentSet_slug;
                    // now add the newRel to schema for concept, wordType, superset, etc
                    var oSchema = NeuroCoreFunctions.fetchNewestRawFile(parentSchema_slug,oRFL)
                    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oNewRel,oRFL.current)
                    oRFL.updated[parentSchema_slug] = oSchema;
                }
            } catch (err) {
                console.log("javaScriptError with action a_c_c1r_connectschema; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.c1r.connectPropertySchema":
            if (verboseConsole) { console.log("case A.c.c1r.connectPropertySchema") }
            try {
                var desiredParentSet_slug = "propertySchemas";
                var parentSchema_slug = "schemaFor_schema";

                // might turn all of the below into a NeuroCoreFunction ... ?
                var arr1 = oNode.globalDynamicData.specificInstanceOf;
                if (!arr1.includes(desiredParentSet_slug)) {
                    var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                    oNewRel.nodeFrom.slug = node_slug;
                    oNewRel.relationshipType.slug = "isASpecificInstanceOf";
                    oNewRel.nodeTo.slug = desiredParentSet_slug;
                    // now add the newRel to schema for concept, wordType, superset, etc
                    var oSchema = NeuroCoreFunctions.fetchNewestRawFile(parentSchema_slug,oRFL)
                    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oNewRel,oRFL.current)
                    oRFL.updated[parentSchema_slug] = oSchema;
                }
            } catch (err) {
                console.log("javaScriptError with action a_c_c1r_connectpropertyschema; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        case "A.c.c1r.connectPrimaryProperty":
            if (verboseConsole) { console.log("case A.c.c1r.connectPrimaryProperty") }
            try {

            } catch (err) {
                console.log("javaScriptError with action a_c_c1r_connectprimaryproperty; err: "+err);
                console.log("nF_slug: "+nF_slug+"; ");
            }
            break;
        default:
            // code
            break;
    }

    var aUpdates = Object.keys(oRFL.updated);
    console.log("actionSlug: "+actionSlug+"; number of updated words: "+aUpdates.length)
    for (var x=0;x<aUpdates.length;x++) {
        var nextUpdate_slug = aUpdates[x];
        var oWord_current = oRFL.current[nextUpdate_slug]
        var oWord_updated = oRFL.updated[nextUpdate_slug]

        var sWord_current = JSON.stringify(oWord_current,null,4)
        var sWord_updated = JSON.stringify(oWord_updated,null,4)

        if (sWord_current != sWord_updated) {
            console.log("updating word "+nextUpdate_slug+" via action "+actionSlug)
            await MiscFunctions.createOrUpdateWordInAllTables(oWord_updated)
            plexNeuroCore.oRFL.current[nextUpdate_slug] = oWord_updated;
        }
    }

    jQuery("#action_"+suffix).css("background-color","green")
}
