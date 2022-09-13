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
    jQuery("#latestActionContainer").html(actionSlug);
    // console.log("qwerty executeSingleAction; actionSlug: "+actionSlug)
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

    if (oAuxiliaryData.hasOwnProperty("node")) {
        var node_slug = oAuxiliaryData.node;
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
        case "a-a-u1n-01":

            if (verboseConsole) { console.log("case a-a-u1n-01") }
            try {
                oNodeTo.globalDynamicData.valenceData.valenceL1 = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.valenceData.valenceL1, nF_slug); oRFL.updated[nT_slug] = oNodeTo;

            } catch (err) {
                console.log("javaScriptError with action a-a-u1n-01; err: "+err);
            }
            break;
        case "a-a-u1n-02":

            if (verboseConsole) { console.log("case a-a-u1n-02") }
            try {
                oNodeFrom.globalDynamicData.valenceData.valenceL1 = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeFrom.globalDynamicData.valenceData.valenceL1,oNodeTo.globalDynamicData.valenceData.valenceL1);
                oRFL.updated[nF_slug] = oNodeFrom;

            } catch (err) {
                console.log("javaScriptError with action a-a-u1n-02; err: "+err);
            }
            break;
        case "a-a-u1n-03":

            if (verboseConsole) { console.log("case a-a-u1n-03") }
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
                console.log("javaScriptError with action a-a-u1n-03; err: "+err);
            }
            break;
        case "a-c-u1n-01":

            if (verboseConsole) { console.log("case a-c-u1n-01") }
            try {
                var governingConcept_slug = oNodeTo.wordTypeData.metaData.governingConcept.slug;
                if (governingConcept_slug) {
                    oNodeFrom.JSONSchemaData.metaData.governingConcept.slug = governingConcept_slug;
                    oRFL.updated[nF_slug] = oNodeFrom;
                }

            } catch (err) {
                console.log("javaScriptError with action a-c-u1n-01; err: "+err);
            }
            break;
        case "a-c-u1n-02":

            if (verboseConsole) { console.log("case a-c-u1n-02") }
            try {
                var governingConcept_slug = oNodeTo.wordTypeData.metaData.governingConcept.slug;
                if (governingConcept_slug) {
                    oNodeFrom.supersetData.metaData.governingConcept.slug = governingConcept_slug;
                    oRFL.updated[nF_slug] = oNodeFrom;
                }

            } catch (err) {
                console.log("javaScriptError with action a-c-u1n-02; err: "+err);
            }
            break;
        case "a-c-u1n-03":

            if (verboseConsole) { console.log("case a-c-u1n-03") }
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
                console.log("javaScriptError with action a-c-u1n-03; err: "+err);
            }
            break;
        case "a-c-u1n-10":

            if (verboseConsole) { console.log("case a-c-u1n-10") }
            try {
                var governingConcept_slug = oNodeTo.wordTypeData.metaData.governingConcept.slug;
                if (governingConcept_slug) {
                    oNodeFrom.schemaData.metaData.governingConcept.slug = governingConcept_slug;
                    oRFL.updated[nF_slug] = oNodeFrom;
                }

            } catch (err) {
                console.log("javaScriptError with action a-c-u1n-10; err: "+err);
            }
            break;
        case "a-a-u1n-o4":

            if (verboseConsole) { console.log("case a-a-u1n-o4") }
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
                console.log("javaScriptError with action a-a-u1n-o4; err: "+err);
            }
            break;
        case "a-c-u1n-11":

            if (verboseConsole) { console.log("case a-c-u1n-11") }
            try {
                var governingConcept_slug = oNodeTo.wordTypeData.metaData.governingConcept.slug;
                if (governingConcept_slug) {
                    if (jQuery.inArray(governingConcept_slug,oNodeFrom.setData.metaData.governingConcepts) == -1) {
                        oNodeFrom.setData.metaData.governingConcepts.push(governingConcept_slug);
                    }
                    oRFL.updated[nF_slug] = oNodeFrom;
                }

            } catch (err) {
                console.log("javaScriptError with action a-c-u1n-11; err: "+err);
            }
            break;
        case "a-a-u1n-05":

            if (verboseConsole) { console.log("case a-a-u1n-05") }
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
                console.log("javaScriptError with action a-a-u1n-05; err: "+err);
            }
            break;
        case "a-c-u1n-12":

            if (verboseConsole) { console.log("case a-c-u1n-12") }
            try {
                var governingConcept_slug = oNodeTo.wordTypeData.metaData.governingConcept.slug;
                if (governingConcept_slug) {
                    oNodeFrom.schemaData.metaData.governingConcept.slug = governingConcept_slug;
                    oRFL.updated[nF_slug] = oNodeFrom;
                }

            } catch (err) {
                console.log("javaScriptError with action a-c-u1n-12; err: "+err);
            }
            break;
        case "a-a-u1n-06":

            if (verboseConsole) { console.log("case a-a-u1n-06") }
            try {
                oNodeFrom.globalDynamicData.valenceData.parentJSONSchemaSequence = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeFrom.globalDynamicData.valenceData.parentJSONSchemaSequence,oNodeTo.globalDynamicData.valenceData.valenceL1);
                oRFL.updated[nF_slug] = oNodeFrom;

            } catch (err) {
                console.log("javaScriptError with action a-a-u1n-06; err: "+err);
            }
            break;
        case "a-a-u1n-07":

            if (verboseConsole) { console.log("case a-a-u1n-07") }
            try {
                oNodeTo.globalDynamicData.specificInstances = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.specificInstances,nF_slug);
                oRFL.updated[nT_slug] = oNodeTo;

            } catch (err) {
                console.log("javaScriptError with action a-a-u1n-07; err: "+err);
            }
            break;
        case "a-b-u1n-01":

            if (verboseConsole) { console.log("case a-b-u1n-01") }
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
                console.log("javaScriptError with action a-b-u1n-01; err: "+err);
            }
            break;
        case "a-b-u1n-02":

            if (verboseConsole) { console.log("case a-b-u1n-02") }
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
                console.log("javaScriptError with action a-b-u1n-02; err: "+err);
            }
            break;
        case "a-b-u1n-03":

            if (verboseConsole) { console.log("case a-b-u1n-03") }
            try {
                // incomplete

            } catch (err) {
                console.log("javaScriptError with action a-b-u1n-03; err: "+err);
            }
            break;
        case "a-b-u1n-04":

            if (verboseConsole) { console.log("case a-b-u1n-04") }
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
                console.log("javaScriptError with action a-b-u1n-04; err: "+err);
            }
            break;
        case "a-b-u1n-05":

            if (verboseConsole) { console.log("case a-b-u1n-05") }
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
                console.log("javaScriptError with action a-b-u1n-05; err: "+err);
            }
            break;
        case "a-b-u1n-06":

            if (verboseConsole) { console.log("case a-b-u1n-06") }
            try {
                // incomplete

            } catch (err) {
                console.log("javaScriptError with action a-b-u1n-06; err: "+err);
            }
            break;
        case "a-a-u1n-08":

            if (verboseConsole) { console.log("case a-a-u1n-08") }
            try {
                if (!oNodeTo.globalDynamicData.hasOwnProperty("directSpecificInstances")) {
                    oNodeTo.globalDynamicData.directSpecificInstances = [];
                }
                oNodeTo.globalDynamicData.directSpecificInstances = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.directSpecificInstances,nF_slug);
                oRFL.updated[nT_slug] = oNodeTo;

            } catch (err) {
                console.log("javaScriptError with action a-a-u1n-08; err: "+err);
            }
            break;
        case "a-rV-u1r-canBeSubdividedInto":

            if (verboseConsole) { console.log("case a-rV-u1r-canBeSubdividedInto") }
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
                console.log("javaScriptError with action a-rV-u1r-canBeSubdividedInto; err: "+err);
            }
            break;
        case "a-rV-u2n-init":

            if (verboseConsole) { console.log("case a-rV-u2n-init") }
            try {
                var sAuxiliaryData = JSON.stringify(oAuxiliaryData,null,4);
                // console.log("A.rV.u2n.init; oAuxiliaryData: "+sAuxiliaryData);
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
                console.log("javaScriptError with action a-rV-u2n-init; err: "+err);
            }
            break;
        case "a-a-u1n-09":

            if (verboseConsole) { console.log("case a-a-u1n-09") }
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
                console.log("javaScriptError with action a-a-u1n-09; err: "+err);
            }
            break;
        case "a-a-u1n-10":

            if (verboseConsole) { console.log("case a-a-u1n-10") }
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
                console.log("javaScriptError with action a-a-u1n-10; err: "+err);
            }
            break;
        case "a-c-c1n-createjsonschema":

            if (verboseConsole) { console.log("case a-c-c1n-createjsonschema") }
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
                console.log("javaScriptError with action a-c-c1n-createjsonschema; err: "+err);
            }
            break;
        case "a-c-c1n-createprimaryproperty":

            if (verboseConsole) { console.log("case a-c-c1n-createprimaryproperty") }
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
                console.log("javaScriptError with action a-c-c1n-createprimaryproperty; err: "+err);
            }
            break;
        case "a-c-c1n-createproperties":

            if (verboseConsole) { console.log("case a-c-c1n-createproperties") }
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
                console.log("javaScriptError with action a-c-c1n-createproperties; err: "+err);
            }
            break;
        case "a-c-c1n-createpropertyschema":

            if (verboseConsole) { console.log("case a-c-c1n-createpropertyschema") }
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
                console.log("javaScriptError with action a-c-c1n-createpropertyschema; err: "+err);
            }
            break;
        case "a-c-c1n-createschema":

            if (verboseConsole) { console.log("case a-c-c1n-createschema") }
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
                console.log("javaScriptError with action a-c-c1n-createschema; err: "+err);
            }
            break;
        case "a-c-c1n-createsuperset":

            if (verboseConsole) { console.log("case a-c-c1n-createsuperset") }
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
                console.log("javaScriptError with action a-c-c1n-createsuperset; err: "+err);
            }
            break;
        case "a-c-c1n-createwordtype":

            if (verboseConsole) { console.log("case a-c-c1n-createwordtype") }
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
                console.log("javaScriptError with action a-c-c1n-createwordtype; err: "+err);
            }
            break;
        case "a-c-c1r-connectconcep":

            if (verboseConsole) { console.log("case a-c-c1r-connectconcep") }
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
                console.log("javaScriptError with action a-c-c1r-connectconcep; err: "+err);
            }
            break;
        case "a-c-c1r-connectjsonschema":

            if (verboseConsole) { console.log("case a-c-c1r-connectjsonschema") }
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
                console.log("javaScriptError with action a-c-c1r-connectjsonschema; err: "+err);
            }
            break;
        case "a-c-c1r-connectprimaryproperty":

            if (verboseConsole) { console.log("case a-c-c1r-connectprimaryproperty") }
            try {
                // incomplete

            } catch (err) {
                console.log("javaScriptError with action a-c-c1r-connectprimaryproperty; err: "+err);
            }
            break;
        case "a-c-c1r-connectpropertyschema":

            if (verboseConsole) { console.log("case a-c-c1r-connectpropertyschema") }
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
                console.log("javaScriptError with action a-c-c1r-connectpropertyschema; err: "+err);
            }
            break;
        case "a-c-c1r-connectschema":

            if (verboseConsole) { console.log("case a-c-c1r-connectschema") }
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
                console.log("javaScriptError with action a-c-c1r-connectschema; err: "+err);
            }
            break;
        case "a-c-c1r-connectsuperset":

            if (verboseConsole) { console.log("case a-c-c1r-connectsuperset") }
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
                console.log("javaScriptError with action a-c-c1r-connectsuperset; err: "+err);
            }
            break;
        case "a-c-c1r-connectwordtype":

            if (verboseConsole) { console.log("case a-c-c1r-connectwordtype") }
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
                console.log("javaScriptError with action a-c-c1r-connectwordtype; err: "+err);
            }
            break;
        case "a-c-u1n-makebasicconceptrels":

            if (verboseConsole) { console.log("case a-c-u1n-makebasicconceptrels") }
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
                console.log("javaScriptError with action a-c-u1n-makebasicconceptrels; err: "+err);
            }
            break;
        case "a-c-u1n-makesuperset":

            if (verboseConsole) { console.log("case a-c-u1n-makesuperset") }
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
                console.log("javaScriptError with action a-c-u1n-makesuperset; err: "+err);
            }
            break;
        case "a-c-u1n-updateconcept":

            if (verboseConsole) { console.log("case a-c-u1n-updateconcept") }
            try {
                oNode = NeuroCoreFunctions.fetchNewestRawFile(node_slug,oRFL)
                var node_ipns = oNode.metaData.ipns
                oNode.conceptData.nodes.concept.slug = node_slug;
                oNode.conceptData.nodes.concept.ipns = node_ipns;
                oRFL.updated[node_slug] = oNode;
                window.neuroCore.oRFL.updated[node_slug] = oNode;

            } catch (err) {
                console.log("javaScriptError with action a-c-u1n-updateconcept; err: "+err);
            }
            break;
        case "a-c-u1n-updatemainschemaforconceptgraph":

            if (verboseConsole) { console.log("case a-c-u1n-updatemainschemaforconceptgraph") }
            try {
                var mainSchemaForConceptGraph_slug = "mainSchemaForConceptGraph";
                var oMSFCG = NeuroCoreFunctions.fetchNewestRawFile(mainSchemaForConceptGraph_slug,oRFL);

                var concept_slug = oNode.wordData.slug;
                var oConcept = NeuroCoreFunctions.fetchNewestRawFile(concept_slug,oRFL);
                var mainSchema_slug = oConcept.conceptData.nodes.schema.slug;
                var propertySchema_slug = oConcept.conceptData.nodes.propertySchema.slug;

                oMSFCG.conceptGraphData.concepts = MiscFunctions.pushIfNotAlreadyThere(oMSFCG.conceptGraphData.concepts,concept_slug)
                oMSFCG.conceptGraphData.schemas = MiscFunctions.pushIfNotAlreadyThere(oMSFCG.conceptGraphData.schemas,mainSchema_slug)
                oMSFCG.conceptGraphData.schemas = MiscFunctions.pushIfNotAlreadyThere(oMSFCG.conceptGraphData.schemas,propertySchema_slug)

                oRFL.updated[mainSchemaForConceptGraph_slug] = MiscFunctions.cloneObj(oMSFCG);
                window.neuroCore.oRFL.updated[mainSchemaForConceptGraph_slug] = MiscFunctions.cloneObj(oMSFCG);


            } catch (err) {
                console.log("javaScriptError with action a-c-u1n-updatemainschemaforconceptgraph; err: "+err);
            }
            break;
        case "a-c-u1n-wordtype_in_wordtypes":

            if (verboseConsole) { console.log("case a-c-u1n-wordtype_in_wordtypes") }
            try {
                if (jQuery.inArray("wordType",oNode.wordData.wordTypes) == -1) {
                    oNode.wordData.wordTypes.push("wordType")
                }
                oRFL.updated[node_slug] = oNode;

            } catch (err) {
                console.log("javaScriptError with action a-c-u1n-wordtype_in_wordtypes; err: "+err);
            }
            break;
        case "a-a-u1n-cleanglobaldynamicdata":

            if (verboseConsole) { console.log("case a-a-u1n-cleanglobaldynamicdata") }
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
                console.log("javaScriptError with action a-a-u1n-cleanglobaldynamicdata; err: "+err);
            }
            break;
        case "a-a-umn-populatespecificinstances":

            if (verboseConsole) { console.log("case a-a-umn-populatespecificinstances") }
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
                console.log("javaScriptError with action a-a-umn-populatespecificinstances; err: "+err);
            }
            break;
        case "a-b-cmn-primaryproperty":

            if (verboseConsole) { console.log("case a-b-cmn-primaryproperty") }
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
                console.log("javaScriptError with action a-b-cmn-primaryproperty; err: "+err);
            }
            break;
        case "a-rv-s1n-adddependencyslugs":

            if (verboseConsole) { console.log("case a-rv-s1n-adddependencyslugs") }
            try {
                oNode.propertyData.includeDependencies = true;
                oNode.propertyData.dependencySlugs = [];
                var aRole0_slugs = oNode.globalDynamicData.restrictsValueManagement[nextUniqueID].role0_slugs
                oNode.propertyData.dependencySlugs = aRole0_slugs
                oRFL.updated[node_slug] = oNode;

            } catch (err) {
                console.log("javaScriptError with action a-rv-s1n-adddependencyslugs; err: "+err);
            }
            break;
        case "a-rv-s1n-addorganizedbysubset":

            if (verboseConsole) { console.log("case a-rv-s1n-addorganizedbysubset") }
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
                console.log("javaScriptError with action a-rv-s1n-addorganizedbysubset; err: "+err);
            }
            break;
        case "a-rv-s1n-connectsubsets":

            if (verboseConsole) { console.log("case a-rv-s1n-connectsubsets") }
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
                console.log("javaScriptError with action a-rv-s1n-connectsubsets; err: "+err);
            }
            break;
        case "a-rv-s1n-updaterole5id":

            if (verboseConsole) { console.log("case a-rv-s1n-updaterole5id") }
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
                console.log("javaScriptError with action a-rv-s1n-updaterole5id; err: "+err);
            }
            break;
        case "a-rv-u1n-populatejsonschemadefinitions":

            if (verboseConsole) { console.log("case a-rv-u1n-populatejsonschemadefinitions") }
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
                console.log("javaScriptError with action a-rv-u1n-populatejsonschemadefinitions; err: "+err);
            }
            break;
        case "a-rv-u1n-transferrole6":

            if (verboseConsole) { console.log("case a-rv-u1n-transferrole6") }
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
                console.log("javaScriptError with action a-rv-u1n-transferrole6; err: "+err);
            }
            break;
        case "a-rv00-s1n-00":

            if (verboseConsole) { console.log("case a-rv00-s1n-00") }
            try {
                oNode.wordData.tag="A.rV00.s1n.00"
                oRFL.updated[node_slug] = oNode;

            } catch (err) {
                console.log("javaScriptError with action a-rv00-s1n-00; err: "+err);
            }
            break;
        case "a-e-u1n-enumeration_updateRole0":

            if (verboseConsole) { console.log("case a-e-u1n-enumeration_updateRole0") }
            try {
                var oNRM = oNode.enumerationData.nodeRolesManagement;
                var role1_slug = oNRM.role1_slug;
                var role2_slug = oNRM.role2_slug;

                // var oRole1 = oRFL.current[role1_slug];
                var oRole1 = NeuroCoreFunctions.fetchNewestRawFile(role1_slug,oRFL)
                var aRole0_slugs = oRole1.globalDynamicData.specificInstances;

                oNode.enumerationData.nodeRolesManagement.role0_slugs = aRole0_slugs;
                oRFL.updated[node_slug] = oNode;

            } catch (err) {
                console.log("javaScriptError with action a-e-u1n-enumeration_updateRole0; err: "+err);
            }
            break;
        case "a-e-u1n-enumeration_updateRole3":

            if (verboseConsole) { console.log("case a-e-u1n-enumeration_updateRole3") }
            try {
                var oNRM = oNode.enumerationData.nodeRolesManagement;
                var role1_slug = oNRM.role1_slug;
                var role2_slug = oNRM.role2_slug;

                var oRole2 = NeuroCoreFunctions.fetchNewestRawFile(role2_slug,oRFL)
                console.log("qwertyy: role2_slug: "+role2_slug)
                console.log("qwertyy: oRole2: "+JSON.stringify(oRole2,null,4))
                var role2_governingConcept_slug = oRole2.propertyData.metaData.governingConcept.slug;
                console.log("qwertyy: role2_governingConcept_slug: "+role2_governingConcept_slug)
                var oGoverningConcept = NeuroCoreFunctions.fetchNewestRawFile(role2_governingConcept_slug,oRFL)
                console.log("qwertyy: oGoverningConcept: "+JSON.stringify(oGoverningConcept,null,4))
                var primaryProperty_slug = oGoverningConcept.conceptData.nodes.primaryProperty.slug;

                oNode.enumerationData.nodeRolesManagement.role3_slug = primaryProperty_slug;
                oRFL.updated[node_slug] = oNode;

            } catch (err) {
                console.log("javaScriptError with action a-e-u1n-enumeration_updateRole3; err: "+err);
            }
            break;
        case "a-e-u1n-enumeration_updateRole4":

            if (verboseConsole) { console.log("case a-e-u1n-enumeration_updateRole4") }
            try {
                var oNRM = oNode.enumerationData.nodeRolesManagement;
                var role1_slug = oNRM.role1_slug;
                var role2_slug = oNRM.role2_slug;

                var oRole2 = NeuroCoreFunctions.fetchNewestRawFile(role2_slug,oRFL)
                var role2_governingConcept_slug = oRole2.propertyData.metaData.governingConcept.slug;
                var oGoverningConcept = NeuroCoreFunctions.fetchNewestRawFile(role2_governingConcept_slug,oRFL)
                var superset_slug = oGoverningConcept.conceptData.nodes.superset.slug;

                oNode.enumerationData.nodeRolesManagement.role4_slug = superset_slug;
                oRFL.updated[node_slug] = oNode;

            } catch (err) {
                console.log("javaScriptError with action a-e-u1n-enumeration_updateRole4; err: "+err);
            }
            break;
        case "a-e-u1n-enumeration_updateRole6":

            if (verboseConsole) { console.log("case a-e-u1n-enumeration_updateRole6") }
            try {
                var oNRM = oNode.enumerationData.nodeRolesManagement;
                var aRole0 = oNRM.role0_slugs;
                var role1_slug = oNRM.role1_slug;
                var role2_slug = oNRM.role2_slug;
                var aRole6_slugs = [];

                if (aRole0.length > 0) {
                    for (var z=0;z<aRole0.length;z++) {
                        var nextRole0_slug = aRole0[z];
                        // check to see whether nextRole0_slug has or has not already been expanded into a full concept
                        // i.e. whether nextRole0_slug is already a wordType;
                        // if not, ??? flag it to be expanded into a concept ???
                        var supersetSlug = NeuroCoreFunctions.fetchSupersetFromWordType(nextRole0_slug,oRFL)
                        if (supersetSlug != false) {
                            aRole6_slugs.push(supersetSlug);
                        }
                    }
                }
                oNode.enumerationData.nodeRolesManagement.role6_slugs = aRole6_slugs;
                oRFL.updated[node_slug] = oNode;

            } catch (err) {
                console.log("javaScriptError with action a-e-u1n-enumeration_updateRole6; err: "+err);
            }
            break;
        case "a-e-ma-enumeration_manageRole5":

if (verboseConsole) { console.log("case a-e-ma-enumeration_manageRole5") }
try {

  
    // WORK IN PROGRESS as of 19 July 2022
var oNRM = oNode.enumerationData.nodeRolesManagement;
var uniqueID = oNRM.uniqueID;
var aRole0 = oNRM.role0_slugs;
var role1_slug = oNRM.role1_slug;
var role2_slug = oNRM.role2_slug;
var role4_slug = oNRM.role4_slug;
var role5_slug = oNRM.role5_slug;
var aRole6 = oNRM.role6_slugs;

console.log("a-e-ma-enumeration_manageRole5; node_slug: "+node_slug)

// A.e.u1n.enumeration_updateRole4 should already have been run
var oRole4 = NeuroCoreFunctions.fetchNewestRawFile(role4_slug,oRFL)

// look to see whether role5_slug is already recorded and is a valid word in the concept graph word list
var alreadyCreated = false;
// alreadyCreated: role5 node exists AND has already been recorded inside enumerationData as such
if (role5_slug) {
    if (oRFL.current.hasOwnProperty(role5_slug)) {
        alreadyCreated = true;
        // Need to make sure that any new subset rels between role6 nodes and the role5 node are added
        var oRole4GoverningConcept = oRFL.current[role4GoverningConcept_slug]
        var role4GovConSchema_slug = oRole4GoverningConcept.conceptData.nodes.schema.slug;
        for (var x=0;x<aRole6.length;x++) {
            var oRole4GovConSchema = NeuroCoreFunctions.fetchNewestRawFile(role4GovConSchema_slug,oRFL)
            var nextRole6_slug = aRole6[x];
            var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
            oNewRel.nodeFrom.slug = nextRole6_slug
            oNewRel.relationshipType.slug = "subsetOf";
            oNewRel.nodeTo.slug = role5_slug;
            oRole4GovConSchema = MiscFunctions.updateSchemaWithNewRel(oRole4GovConSchema,oNewRel,oRFL);
            oRFL.updated[role4GovConSchema_slug] = oRole4GovConSchema;
        }
    }
}
if (!alreadyCreated) {
    // if not already created and recorded,
    // look through every subset to determine whether one fits the criteria to be the organizedBy subset
    // if yes, it will have same uniqueID and will be role5
    var aSubsets = [];
    // current sets vs subsets depends on wordType = set vs superset; may want to standardize this in the future?
    if (oRole4.globalDynamicData.hasOwnProperty("sets")) {
        aSubsets = oRole4.globalDynamicData.sets;
    }
    if (oRole4.globalDynamicData.hasOwnProperty("subsets")) {
        aSubsets = oRole4.globalDynamicData.subsets;
    }
    var role5Identified = false;
    var role5_discovered_slug = null;
    for (var s=0;s < aSubsets.length;s++) {
        var nextSubsetSlug = aSubsets[s];
        console.log("a-e-ma-enumeration_manageRole5; nextSubsetSlug: "+nextSubsetSlug)
        var oSubset = NeuroCoreFunctions.fetchNewestRawFile(nextSubsetSlug,oRFL)
        var aSubsetSubsets = oSubset.globalDynamicData.subsets;
        // check whether this subset meets criteria to be role5 node:
        // every subset of nextSubsetSlug is in aRole6
        // every element of aRole6 is a subset of nextSubsetSlug
        // (more relaxed criteria?)
        var candidateRole5 = true;
        // candidateRole5: a set node already exists that meets criteria for role5, but has not yet been recorded as such in enumerationData
        for (var s=0;s<aSubsetSubsets.length;s++) {
            var nextSubsetSubset_slug = aSubsetSubsets[s];
            if (!aRole6.includes(nextSubsetSubset_slug)) {
                candidateRole5 = false;
            }
        }
        for (var s=0;s<aRole6.length;s++) {
            var nextRole0_slug = aRole6[s];
            if (!aSubsetSubsets.includes(nextRole0_slug)) {
                candidateRole5 = false;
            }
        }
        if (candidateRole5) {
            role5Identified = true;
            role5_discovered_slug = nextSubsetSlug;
            oNode.enumerationData.nodeRolesManagement.role5_slug = role5_discovered_slug;
            console.log("a-e-ma-enumeration_manageRole5; role5_discovered_slug: "+role5_discovered_slug)
            var oRole5_discovered = NeuroCoreFunctions.fetchNewestRawFile(role5_discovered_slug,oRFL)
            // oRole5_discovered = MiscFunctions.cloneObj(oRole5_discovered);
            if (oRole5_discovered.hasOwnProperty("setData")) {
                if (!oRole5_discovered.setData.metaData.types.includes("organizedByEnumeration")) {
                    oRole5_discovered.setData.metaData.types.push("organizedByEnumeration");
                    oRFL.updated[role5_discovered_slug] = oRole5_discovered;
                    // console.log("a-e-ma-enumeration_manageRole5; oRole5_discovered: "+JSON.stringify(oRole5_discovered,null,4))
                }
            }
        }
        // if the role5 node has not been created, then create a new one
        if (!candidateRole5) {
            var role4_name = oRole4.supersetData.name;
            var newSubset_slug = role4_slug+"_organizedBy_"+role4_slug;
            var newSubset_title = role4_name[0].toUpperCase() + role4_name.substring(1)+" Organized by "+role1_name;
            var newSubset_name = role4_name+" organized by "+role1_name;
            var oNewSubset = await MiscFunctions.createNewWordByTemplate("set");
            oNewSubset.wordData.slug = newSubset_slug;
            oNewSubset.wordData.title = newSubset_title;
            oNewSubset.wordData.name = newSubset_name;
            oNewSubset.setData.slug = newSubset_slug;
            oNewSubset.setData.title = newSubset_title;
            oNewSubset.setData.name = newSubset_name;
            var role4GoverningConcept_slug = oRole4.supersetData.metaData.governingConcept.slug;
            oNewSubset.wordData.governingConcepts = oRole4.wordData.governingConcepts;
            oNewSubset.setData.governingConcepts = oRole4.wordData.governingConcepts;
            oNewSubset.setData.metaData.governingConcept.slug = role4GoverningConcept_slug;
            oNode.enumerationData.nodeRolesManagement.role5_slug = newSubset_slug;
            oRFL.updated[newSubset_slug] = oNewSubset;

            // now make new subsetOf relationship and add it to relevant schema
            var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
            oNewRel.nodeFrom.slug = newSubset_slug
            oNewRel.relationshipType.slug = "subsetOf";
            oNewRel.nodeTo.slug = role4_slug;
            var oRole4GoverningConcept = oRFL.current[role4GoverningConcept_slug]
            var role4GovConSchema_slug = oRole4GoverningConcept.conceptData.nodes.schema.slug;
            var oRole4GovConSchema = NeuroCoreFunctions.fetchNewestRawFile(role4GovConSchema_slug,oRFL)
            var oRFL_x = MiscFunctions.cloneObj(oRFL.current);
            oRFL_x[role5_slug] = oNewSubset;
            oRole4GovConSchema = MiscFunctions.updateSchemaWithNewRel(oRole4GovConSchema,oNewRel,oRFL_x);
            oRFL.updated[role4GovConSchema_slug] = oRole4GovConSchema;
        }
    }
}

oRFL.updated[node_slug] = oNode;
            } catch (err) {
                console.log("javaScriptError with action a-e-ma-enumeration_manageRole5; err: "+err);
            }
            break;
        case "a-e-u1n-enumerates":

            if (verboseConsole) { console.log("case a-e-u1n-enumerates") }
            try {
var oRVD = oNodeFrom.enumerationData.restrictsValueData;
var oNRM = oNodeFrom.enumerationData.nodeRolesManagement;

var aRole0 = oNRM.role0_slugs;

var targetPropertyType = oRVD.targetPropertyType;
var propertyPath = oRVD.propertyPath;
var uniquePropertyKey = oRVD.uniquePropertyKey;
var withSubsets = oRVD.withSubsets;
var withDependencies = oRVD.withDependencies;
var dependenciesPlacement = oRVD.dependenciesPlacement;

oNodeTo.propertyData.type = targetPropertyType;
if (targetPropertyType=="string") {
    var arr2 = ConceptGraphFunctions.translateSlugsToUniquePropertyValues(aRole0,propertyPath,uniquePropertyKey);
    oNodeTo.propertyData.enum = arr2;
}
if (targetPropertyType=="array") {
    var arr2 = ConceptGraphFunctions.translateSlugsToUniquePropertyValues(aRole0,propertyPath,uniquePropertyKey);
    oNodeTo.propertyData.items = {};
    oNodeTo.propertyData.items.enum = arr2;
}
oNodeTo.propertyData.includeDependencies = withDependencies;
if (withDependencies==true) {
    oNodeTo.propertyData.dependencySlugs = aRole0;
    oNodeTo.propertyData.dependencyPlacement = dependenciesPlacement;
}

oRFL.updated[nT_slug] = oNodeTo;

            } catch (err) {
                console.log("javaScriptError with action a-e-u1n-enumerates; err: "+err);
            }
            break;

        default:
            // code
            break;
    }

    var executeChanges = jQuery("#executeChangesSelector option:selected").val()

    var aNews = Object.keys(oRFL.new);
    // console.log("actionSlug: "+actionSlug+"; number of new words: "+aNews.length)
    for (var x=0;x<aNews.length;x++) {
        var nextNew_slug = aNews[x];
        var oWord_new = oRFL.new[nextNew_slug]

        var newUniqueIdentifier = actionSlug + "_" + nextNew_slug + "_" + x;

        window.plexNeuroCore.oRecordOfUpdates[newUniqueIdentifier] = {}
        window.plexNeuroCore.oRecordOfUpdates[newUniqueIdentifier].old = {};
        window.plexNeuroCore.oRecordOfUpdates[newUniqueIdentifier].new = oWord_new;
        var infoHTML = "";
        infoHTML += "<div data-updateuniqueidentifier='"+newUniqueIdentifier+"' class='newUniqueIdentifier' >";
        infoHTML += actionSlug+": creating new word "+nextNew_slug;
        infoHTML += "</div>";
        // console.log(infoHTML)
        jQuery("#neuroCore2ActivityLogContainer").append(infoHTML)
        // console.log("executeChanges? "+executeChanges)
        if (executeChanges=="yes") {
            await MiscFunctions.createOrUpdateWordInAllTables(oWord_new)
            plexNeuroCore.oRFL.updated[nextNew_slug] = oWord_new;
            plexNeuroCore.oRFL.new[nextNew_slug] = oWord_new;
            addPatternsToQueue(actionSlug,plexNeuroCore);
        }
    }

    var aUpdates = Object.keys(oRFL.updated);
    console.log("actionSlug: "+actionSlug+"; number of updated words: "+aUpdates.length)
    for (var x=0;x<aUpdates.length;x++) {
        var nextUpdate_slug = aUpdates[x];
        var oWord_current = oRFL.current[nextUpdate_slug]
        var oWord_updated = oRFL.updated[nextUpdate_slug]

        var sWord_current = JSON.stringify(oWord_current,null,4)
        var sWord_updated = JSON.stringify(oWord_updated,null,4)

        console.log("sWord_current: "+sWord_current)
        console.log("sWord_updated: "+sWord_updated)

        var updateUniqueIdentifier = actionSlug + "_" + nextUpdate_slug + "_" + x;

        if (sWord_current != sWord_updated) {
            window.plexNeuroCore.oRecordOfUpdates[updateUniqueIdentifier] = {}
            window.plexNeuroCore.oRecordOfUpdates[updateUniqueIdentifier].old = oWord_current;
            window.plexNeuroCore.oRecordOfUpdates[updateUniqueIdentifier].new = oWord_updated;
            var infoHTML = "";
            infoHTML += "<div data-updateuniqueidentifier='"+updateUniqueIdentifier+"' class='actionUpdatingWord' >";
            infoHTML += actionSlug+": updating word "+nextUpdate_slug;
            infoHTML += "</div>";
            // console.log(infoHTML)
            jQuery("#neuroCore2ActivityLogContainer").append(infoHTML)
            // console.log("executeChanges? "+executeChanges)
            if (executeChanges=="yes") {
                await MiscFunctions.createOrUpdateWordInAllTables(oWord_updated)
                oRFL.current[nextUpdate_slug] = oWord_updated;
                // plexNeuroCore.oRFL.current[nextUpdate_slug] = oWord_updated;
                plexNeuroCore.oRFL.updated[nextUpdate_slug] = oWord_updated;
                window.lookupWordBySlug[nextUpdate_slug] = oWord_updated; // temporary; eventually, plexNeuroCore needs to handle all neuroCore2 changes
                addPatternsToQueue(actionSlug,plexNeuroCore);

            }
        }
    }
    jQuery("#action_"+suffix).css("background-color","green")

    return oRFL;
}

const addPatternsToQueue = (actionSlug,plexNeuroCore) => {
    console.log("qwerty; actionSlug: "+actionSlug)
    var action_wordSlug = plexNeuroCore.oMapActionSlugToWordSlug[actionSlug];
    console.log("qwerty; action_wordSlug: "+action_wordSlug)
    // var oAct = plexNeuroCore.oRFL.current[action_wordSlug];
    var oAct = window.lookupWordBySlug[action_wordSlug]; // temporary; eventually, plexNeuroCore should be handling this
    var sAct = JSON.stringify(oAct,null,4)
    console.log("qwerty; sAct: "+sAct)
    if (oAct.actionData.hasOwnProperty("secondaryPatterns")) {
        // go through secondaryPatterns.sets
        var aSets = [];
        if (oAct.actionData.secondaryPatterns.hasOwnProperty("sets")) {
            aSets = oAct.actionData.secondaryPatterns.sets;
        }
        for (var s=0;s<aSets.length;s++) {
            var nextSet_slug = aSets[s];
            // var oNextSet = plexNeuroCore.oRFL.current[nextSet_slug];
            var oNextSet = window.lookupWordBySlug[nextSet_slug]; // temporary; eventually, plexNeuroCore should be handling this
            // console.log("qwerty nextSet_slug: "+nextSet_slug)
            var aNextSet_patterns = oNextSet.globalDynamicData.specificInstances;
            for (var z=0;z<aNextSet_patterns.length;z++) {
                var nextPattern_wordSlug = aNextSet_patterns[z];
                jQuery("#patternCheckbox_"+nextPattern_wordSlug).prop("checked",true);
            }
        }

        // go through secondaryPatterns.individualPatterns
        var aIndividualPatterns = [];
        if (oAct.actionData.secondaryPatterns.hasOwnProperty("individualPatterns")) {
            aIndividualPatterns = oAct.actionData.secondaryPatterns.individualPatterns;
        }
        for (var s=0;s<aIndividualPatterns.length;s++) {
            var nextPattern_patternName = aIndividualPatterns[s];
            var nextPattern_wordSlug = plexNeuroCore.oMapPatternNameToWordSlug[nextPattern_patternName];
            jQuery("#patternCheckbox_"+nextPattern_wordSlug).prop("checked",true);
            // console.log("qwerty nextPattern_patternName: "+nextPattern_wordSlug)
        }
    }
}
