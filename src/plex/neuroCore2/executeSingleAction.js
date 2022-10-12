import * as MiscFunctions from '../functions/miscFunctions.js';
import * as ConceptGraphFunctions from '../functions/conceptGraphFunctions.js';
import * as NeuroCoreFunctions from '../functions/neuroCoreFunctions.js';
import * as ConceptGraphInMfsFunctions from '../lib/ipfs/conceptGraphInMfsFunctions.js';
const jQuery = require("jquery");
const Ajv = require('ajv');
const ajv = new Ajv({
    allErrors: true,
    useDefaults: true,
    strictDefault: true
});

/////////////////////////
// BACKUP9: 11 Oct 2022
// Currently functional for NeuroCore2
// Next step: try to modify this file in a way so that NeuroCore2 and NeuroCore3 can use it simultaneously
/////////////////////////


const timeout = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// 21 July 2022 MODIFYING:

// a-e-u1n-enumerates make some adustments? triggered by P.e.s1n.enumeration

// a-e-ma-enumeration_manageRole5 - debugging, starting 21 July

// a-e-u1n-enumeration_updateRole3, removing console.logs

// 20 July 2022 MODIFYING:

// fixing a-c-u1n-updatemainschemaforconceptgraph

// a-c-c1n-createprimaryproperty; (triggered by P.b.s1n.primaryProperty)
// make sure default properties (propably name, title, slug, description) propertyData.metaData.required
// and propertyData.metaData.unique
// are set to true depending on whether
// oMainSchemaForConceptGraph.conceptGraphData.required and .unique contain those properties

// the requiredDefinitions system: a-b-u1n-01 and a-b-u1n-04:

// a-b-u1n-01 update property from a property (triggered by p.b.s1r.03)
// 1. need to populate and then transmit up the tree propertydata.metaData.requiredDefinitions
// 2. need to add dependencies in the proper location, depending on whether it is upper or lower

// a-b-u1n-04 update JSON Schema from primaryProperty (triggered by p.b.s1r.12)
// 1. need to populate JSONSchema's definitions (oNodeTo.definitions) from oNodeFrom.propertydata.metaData.requiredDefinitions


// a-e-u1n-enumerates add functionality from A.e.u1n.enumeration_populateJSONSchemaDefinitions
// even though this would be redundant, having the requiredDefinitions system and the older a-e-u1n-enumerates system

const isAPDPresent = (nextPat,oAuxiliaryPatternData,whichNeuroCore) => {
    var result = false;
    var sAuxiliaryPatternData = JSON.stringify(oAuxiliaryPatternData);
    if (whichNeuroCore=="NeuroCore2") {
        var aAPDs = window.neuroCore.engine.oPatternsWithAuxiliaryDataQueue[nextPat]
    }
    if (whichNeuroCore=="NeuroCore3") {
        var aAPDs = window.ipfs.neuroCore.engine.oPatternsWithAuxiliaryDataQueue[nextPat]
    }
    for (var a=0;a<aAPDs.length;a++) {
        var oNextAPD = aAPDs[a];
        var sNextSPD = JSON.stringify(oNextAPD);
        if (sAuxiliaryPatternData==sNextSPD) {
            result = true;
        }
    }
    return result;
}

export const oAPD_s1r = {}
oAPD_s1r.searchMethod = "restrictedDomain"
oAPD_s1r.patternName = null;
oAPD_s1r.inputField = "singleRelationship"
oAPD_s1r.domains = {}
oAPD_s1r.domains.aNodesFrom = null;
oAPD_s1r.domains.aNodesTo = null;

export const oAPD_s1n = {}
oAPD_s1n.searchMethod = "restrictedDomain"
oAPD_s1n.patternName = null;
oAPD_s1n.inputField = "singleNode"
oAPD_s1n.domains = {}
oAPD_s1n.domains.domainSpecificationMethod = "explicitArray"; // explicitArray (basic method) vs globalDynamicDataSpecificInstances ()
oAPD_s1n.domains.aNodes = null;

export const executeSingleAction = async (oAction,nc2CycleNumber,singlePatternNumber,singleActionNumber,whichNeuroCore) => {
    var node_slug = null;
    var nF_slug = null;
    var nT_slug = null;

    var actionSlug = oAction.actionSlug;
    jQuery("#latestActionContainer").html(actionSlug);
    var r = oAction.r;
    var suffix = actionSlug + "_" + r;
    jQuery("#action_"+suffix).css("background-color","yellow")

    await timeout(0)

    var verboseConsole = true;

    if (whichNeuroCore=="NeuroCore2") {
        var oRFL = MiscFunctions.cloneObj(window.neuroCore.subject.oRFL)
        var oWindowNeuroCore = window.neuroCore
    }
    if (whichNeuroCore=="NeuroCore3") {
        var oRFL = MiscFunctions.cloneObj(window.ipfs.neuroCore.subject.oRFL)
        var oWindowNeuroCore = window.ipfs.neuroCore
    }

    var oAuxiliaryData = oAction.oAuxiliaryData;

    if (oAuxiliaryData.hasOwnProperty("relationship")) {
        var nF_slug = oAuxiliaryData.relationship.nodeFrom.slug;
        // var oNodeFrom = MiscFunctions.cloneObj(oRFL.current[nF_slug]);
        var oNodeFrom = NeuroCoreFunctions.fetchNewestRawFile(nF_slug,oRFL)

        var nT_slug = oAuxiliaryData.relationship.nodeTo.slug;
        // var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);
        var oNodeTo = NeuroCoreFunctions.fetchNewestRawFile(nT_slug,oRFL)
    }

    if (oAuxiliaryData.hasOwnProperty("node")) {
        var node_slug = oAuxiliaryData.node;
        // var oNode = MiscFunctions.cloneObj(oRFL.current[node_slug]);
        var oNode = NeuroCoreFunctions.fetchNewestRawFile(node_slug,oRFL)
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

    var oAuxiliaryPatternData = {"searchMethod":"default"};
    var aAuxiliaryPatternData = [];
    var auxAssistedQueue = false;

    // console.log("executeSingleAction! whichNeuroCore: "+whichNeuroCore+"; node_slug: "+node_slug+"; nF_slug: "+nF_slug+"; nT_slug: "+nT_slug)

    switch (actionSlug) {
        case "a-c-u1n-applytemplatingconstraints":
            if (verboseConsole) { console.log("case a-c-u1n-applytemplatingconstraints") }
            try {
                // triggered by "P.c.c1n.conceptWithTemplating"
                // use it to implement any templates for this concept that might exist
                // cycle through each template; generate oConstraint; then make sure the main JSONSchema for this concept
                // contains oConstraint as an element in the array: oJSONSchema.allOf
                if (oNode.hasOwnProperty("conceptData")) {
                    if (oNode.conceptData.hasOwnProperty("templating")) {
                        var jsonSchema_slug = oNode.conceptData.nodes.JSONSchema.slug;
                        // var oJSONSchema = window.lookupWordBySlug[jsonSchema_slug]
                        var oJSONSchema = NeuroCoreFunctions.fetchNewestRawFile(jsonSchema_slug,oRFL)
                        var oTemplatingData = oNode.conceptData.templating
                        var templateCreationEnabled = oTemplatingData.templateCreationEnabled
                        if (templateCreationEnabled) {
                            // console.log("implementing a-c-u1n-applytemplatingconstraints; oTemplatingData: "+JSON.stringify(oTemplatingData,null,4))
                            var templatingConcept_wordSlug = oTemplatingData.templatingConcept.wordSlug;
                            // var oTemplatingConcept = window.lookupWordBySlug[templatingConcept_wordSlug];
                            var oTemplatingConcept = NeuroCoreFunctions.fetchNewestRawFile(templatingConcept_wordSlug,oRFL)
                            var templatingSuperset_slug = oTemplatingConcept.conceptData.nodes.superset.slug;
                            // var oTemplatingSuperset = window.lookupWordBySlug[templatingSuperset_slug];
                            var oTemplatingSuperset = NeuroCoreFunctions.fetchNewestRawFile(templatingSuperset_slug,oRFL)
                            var aTemplates = oTemplatingSuperset.globalDynamicData.specificInstances;
                            var oAllOf = [];
                            for (var t=0;t < aTemplates.length;t++) {
                                var nextTemplate_slug = aTemplates[t];
                                console.log("a-c-u1n-applytemplatingconstraints; nextTemplate_slug: "+nextTemplate_slug)
                                // var oNextTemplate = window.lookupWordBySlug[nextTemplate_slug];
                                var oNextTemplate = NeuroCoreFunctions.fetchNewestRawFile(nextTemplate_slug,oRFL)
                                var oTemplateData = oNextTemplate.templateData;
                                var active = oTemplateData.active;
                                if (active == true) {
                                    var oConstraint = {};
                                    oConstraint.if = {};
                                    oConstraint.then = {};

                                    console.log("oTemplateData: "+JSON.stringify(oTemplateData,null,4))

                                    var oIndependentVariable = oTemplateData.independentVariable;
                                    var independentVariablePropertyKeyPath = oIndependentVariable.propertyKeyPath
                                    var independentVariableValue = oIndependentVariable.value

                                    var oIf = {};
                                    oIf.enum = [];
                                    oIf.enum.push(independentVariableValue)

                                    var aReversedPropertyKeys = independentVariablePropertyKeyPath.split(".");
                                    aReversedPropertyKeys.reverse();
                                    // We are going to cycle through each property key IN REVERSE!! Hence the .reverse()
                                    for (var k=0; k < aReversedPropertyKeys.length;k++) {
                                        var key = aReversedPropertyKeys[k];
                                        var oFoo1 = MiscFunctions.cloneObj(oIf);
                                        oIf = {};
                                        oIf[key] = MiscFunctions.cloneObj(oFoo1);
                                        var oFoo2 = MiscFunctions.cloneObj(oIf);
                                        oIf = {};
                                        oIf.properties = MiscFunctions.cloneObj(oFoo2);
                                    }
                                    console.log("oIf: "+JSON.stringify(oIf,null,4));
                                    oConstraint.if = MiscFunctions.cloneObj(oIf);

                                    var oThenAll = {};
                                    var aDependentVariables = oTemplateData.dependentVariables;
                                    for (var d=0;d < aDependentVariables.length; d++) {
                                        var oDependentVariable = aDependentVariables[d];
                                        var dependentVariablePropertyKeyPath = oDependentVariable.propertyKeyPath
                                        var dependentVariableValue = oDependentVariable.value
                                        console.log("d: "+d+"; dependentVariablePropertyKeyPath: "+dependentVariablePropertyKeyPath+"; dependentVariableValue: "+dependentVariableValue)
                                        var oThenNext = {};
                                        oThenNext.const = dependentVariableValue;
                                        oThenNext.enum = [];
                                        oThenNext.enum.push(dependentVariableValue)

                                        var aPropertyKeys = dependentVariablePropertyKeyPath.split(".");
                                        var aReversedPropertyKeys = dependentVariablePropertyKeyPath.split(".");
                                        aReversedPropertyKeys.reverse();
                                        for (var k=0; k < aReversedPropertyKeys.length;k++) {
                                            var key = aReversedPropertyKeys[k];
                                            var oFoo1 = MiscFunctions.cloneObj(oThenNext);
                                            oThenNext = {};
                                            oThenNext[key] = MiscFunctions.cloneObj(oFoo1);
                                            var oFoo2 = MiscFunctions.cloneObj(oThenNext);
                                            oThenNext = {};
                                            oThenNext.properties = MiscFunctions.cloneObj(oFoo2);
                                        }
                                        if (d==0) {
                                            oThenAll.properties = MiscFunctions.cloneObj(oThenNext.properties);
                                        }
                                        console.log("oThenNext: "+JSON.stringify(oThenNext,null,4));
                                        oThenAll = MiscFunctions.addAdditionalThenConstraint(oThenAll,oThenNext,aPropertyKeys)
                                    }
                                    oConstraint.then = MiscFunctions.cloneObj(oThenAll)
                                    console.log("oConstraint: "+JSON.stringify(oConstraint,null,4));
                                    oAllOf.push(oConstraint)
                                }
                            }
                            delete oJSONSchema["$id"]
                            oJSONSchema.allOf = oAllOf;
                            console.log("oJSONSchema: "+JSON.stringify(oJSONSchema,null,4));
                            oRFL.updated[jsonSchema_slug] = oJSONSchema;
                        }
                    }
                }
            } catch (err) {
                console.log("javaScriptError with action a-c-u1n-applytemplatingconstraints; err: "+err+"; node_slug: "+node_slug);
            }
            break;

        case "a-m-u1n-01":
            if (verboseConsole) { console.log("case a-m-u1n-01") }
            try {
                // triggered by "P.m.s1n.word"
                // use it to do bespoke edits that I code from the back-end, hopefully one-time only
                /*
                if (oNode.hasOwnProperty("enumerationData")) {
                    var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
                    oNewRel.nodeFrom.slug = node_slug;
                    oNewRel.relationshipType.slug = "isASpecificInstanceOf";
                    oNewRel.nodeTo.slug = "supersetFor_enumeration";
                    var schema_slug = "schemaFor_enumeration";
                    var oSchema = oRFL.current[schema_slug];
                    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oNewRel,oRFL.current);
                    oRFL.updated[schema_slug] = oSchema;
                }

                // oRFL.updated[node_slug] = oNode;
                */

            } catch (err) {
                console.log("javaScriptError with action a-m-u1n-01; err: "+err+"; node_slug: "+node_slug);
            }
            break;

        case "a-l2-c1r-isasubsetof":
            if (verboseConsole) { console.log("case a-l2-c1r-isasubsetof") }
            try {


                ////////// ******* start deprecate
                // triggered by P.a.umn.superset which produces oNode
                if (oNode) {
                    if (oNode.hasOwnProperty("supersetData")) {
                      // look at all aSubsets and aSubsetOf  (not just direct)
                      // if any elements are supersets, then create (concept) - isASubsetOf - (concept)
                      // I might deprecate this section of a-l2-c1r-isasubsetof
                      // in its place, a-e-u1n-enumeration_updateRole6 will do the trick
                    }
                }
                /////////// ******** end deprecate


                // keep this part
                // triggered by P.a.s1r.07 which produces oNodeFrom and oNodeTo
                if ( (oNodeFrom) && (oNodeTo) ) {
                    if ( (oNodeFrom.hasOwnProperty("supersetData")) && (oNodeTo.hasOwnProperty("supersetData")) ) {
                        var nF_govConcept_slug = oNodeFrom.supersetData.metaData.governingConcept.slug;
                        var nT_govConcept_slug = oNodeTo.supersetData.metaData.governingConcept.slug;
                        var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
                        oNewRel.nodeFrom.slug = nF_govConcept_slug;
                        oNewRel.relationshipType.slug = "isASubsetOf";
                        oNewRel.nodeTo.slug = nT_govConcept_slug;
                        console.log("a-l2-c1r-isasubsetof; oNewRel: "+JSON.stringify(oNewRel,null,4))
                    }
                }

            } catch (err) {
                console.log("javaScriptError with action a-l2-c1r-isasubsetof; err: "+err+"; node_slug: "+node_slug);
            }
            break;

        case "a-l2-c1r-isarealizationof":
            if (verboseConsole) { console.log("case a-l2-c1r-isarealizationof") }
            try {

            } catch (err) {
                console.log("javaScriptError with action a-l2-c1r-isarealizationof; err: "+err+"; node_slug: "+node_slug);
            }
            break;

        case "a-l2-c1r-canbesubdividedinto":
            if (verboseConsole) { console.log("case a-l2-c1r-canbesubdividedinto") }
            try {

            } catch (err) {
                console.log("javaScriptError with action a-l2-c1r-canbesubdividedinto; err: "+err+"; node_slug: "+node_slug);
            }
            break;

        case "a-a-u1n-validation":

            if (verboseConsole) { console.log("case a-a-u1n-validation") }
            try {
                console.log("a-a-u1n-validation; Trying to correct validation errors for "+node_slug+"!!")
                if (!oNode.metaData.neuroCore.hasOwnProperty("parentJSONSchemaValidations")) {
                    oNode.metaData.neuroCore.parentJSONSchemaValidations = {};
                }
                var aParentJSONSchemaSequence = oNode.globalDynamicData.valenceData.parentJSONSchemaSequence;
                for (var a=0;a<aParentJSONSchemaSequence.length;a++) {
                    var nextPJSchema_slug = aParentJSONSchemaSequence[a];
                    var oParent = oRFL.current[nextPJSchema_slug];
                    // var primaryProperty = Object.keys(oParent.properties)[0]; // may want to create a function to fetch primary property from any of the core concept wordTypes; function will detect the wordType
                    var primaryProperty = NeuroCoreFunctions.fetchPrimaryProperty(nextPJSchema_slug);
                    delete oParent["$id"];
                    var validate = ajv.compile(oParent);
                    var valid = validate(oNode);
                    if (valid) {
                        console.log("Successful validation! child: "+node_slug+"; parent: "+nextPJSchema_slug)
                        oNode.metaData.neuroCore.parentJSONSchemaValidations[nextPJSchema_slug] = "valid";
                    }
                    var aConceptGraphDefaultProperties = oWindowNeuroCore.subject.oMainSchemaForConceptGraph.conceptGraphData.defaultPropertyDescriptors
                    console.log("a-a-u1n-validation; aConceptGraphDefaultProperties: "+JSON.stringify(aConceptGraphDefaultProperties,null,4))
                    if (!valid) {
                        console.log("Failure to validate! child: "+node_slug+"; parent: "+nextPJSchema_slug)
                        // write code to fix basic validation errors
                        if (!oNode.hasOwnProperty(primaryProperty)) {
                            oNode[primaryProperty] = {};
                        }
                        // var aRequired = oParent.properties[primaryProperty].required;
                        // for (var p=0;p<aRequired.length;p++) {
                        for (var p=0;p<aConceptGraphDefaultProperties.length;p++) {
                            // var nextPropertyKey = aRequired[p];
                            var nextPropertyKey = aConceptGraphDefaultProperties[p];
                            console.log("a-a-u1n-validation; nextPropertyKey: "+nextPropertyKey)
                            if (!oNode[primaryProperty].hasOwnProperty(nextPropertyKey)) {
                                // first, do default if available
                                if (oParent.properties[primaryProperty].properties[nextPropertyKey].hasOwnProperty("default")) {
                                    var nextPropertyDefault = oParent.properties[primaryProperty].properties[nextPropertyKey].default;
                                    oNode[primaryProperty][nextPropertyKey] = nextPropertyDefault;
                                    console.log("a-a-u1n-validation; transferring from default: nextPropertyKey: "+nextPropertyKey)
                                }
                                // next, transfer from wordTypeData if available
                                // Future: may establish variable whether or not to do the transfer for each given propertyKey
                                // set it in oMainSchemaForConceptGraph; then able to override conceptGraph settings for any individual concept,
                                // meaning that if new specific instance is made for that concept, the concept settings take over
                                // transferValuesFromWordTypeDataOnInitialSetup or
                                // e.g. oMainSchemaForConceptGraph.conceptGraphData.transferValuesFromWordTypeDataOnInitialSetup = [ slug, title, name, description ]
                                // oMainSchema.schemaData.(then in metaData? )
                                // or oConcept.conceptData instead of in oMainSchema ? wherever the defaultPropertyDescriptors, required, unique overrides go
                                var nextPropertyType = oParent.properties[primaryProperty].properties[nextPropertyKey].type;
                                if (aConceptGraphDefaultProperties.includes(nextPropertyKey)) {
                                    console.log("a-a-u1n-validation; yes, "+nextPropertyKey+" is in aConceptGraphDefaultProperties")
                                    var wTD_nextProperty = oNode.wordTypeData[nextPropertyKey];
                                    console.log("a-a-u1n-validation; wTD_nextProperty: "+wTD_nextProperty)
                                    if (oNode.wordTypeData.hasOwnProperty(nextPropertyKey)) {
                                    // if (wTD_nextProperty != null) {
                                        console.log("a-a-u1n-validation; yes, wordTypeData hasOwnProperty: nextPropertyKey: "+nextPropertyKey)
                                        oNode[primaryProperty][nextPropertyKey] = oNode.wordTypeData[nextPropertyKey];
                                        console.log("a-a-u1n-validation; transferring from wordTypeData: nextPropertyKey: "+nextPropertyKey)
                                    } else {
                                        console.log("a-a-u1n-validation; no, wordTypeData does not hasOwnProperty: nextPropertyKey: "+nextPropertyKey)
                                    }
                                }
                            }

                            oNode.metaData.neuroCore.parentJSONSchemaValidations[nextPJSchema_slug] = "preliminaryCompleted";
                            var aTopLevelProperties = [
                              "wordData",
                              "wordTypeData",
                              primaryProperty,
                              "_REMAINDER_",
                              "globalDynamicData",
                              "metaData"
                            ]
                            oNode = MiscFunctions.reorderTopLevelProperties(oNode,aTopLevelProperties)
                            oRFL.updated[node_slug] = oNode;
                        }
                    }
                }

            } catch (err) {
                console.log("javaScriptError with action a-r-u1n-updateinitialprocessing; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-r-u1n-updateinitialprocessing":

            if (verboseConsole) { console.log("case a-r-u1n-updateinitialprocessing") }
            try {
                oNode.metaData.neuroCore.initialProcessing = true;
                oRFL.updated[node_slug] = oNode;

            } catch (err) {
                console.log("javaScriptError with action a-r-u1n-updateinitialprocessing; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-r-u1n-01":

            if (verboseConsole) { console.log("case a-r-u1n-01") }
            try {
                // look to see what node type it is; flag for subsequent actions

            } catch (err) {
                console.log("javaScriptError with action a-r-u1n-01; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-a-u1n-01":

            if (verboseConsole) { console.log("case a-a-u1n-01") }
            try {
                if (nT_slug=="wordTypeFor_cat") {
                    console.log("QWERTYCAT; oNodeTo before: "+JSON.stringify(oNodeTo,null,4))
                }
                oNodeTo.globalDynamicData.valenceData.valenceL1 = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.valenceData.valenceL1, nF_slug);
                oRFL.updated[nT_slug] = oNodeTo;
                if (nT_slug=="wordTypeFor_cat") {
                    console.log("QWERTYCAT; oNodeTo after: "+JSON.stringify(oNodeTo,null,4))
                }

                auxAssistedQueue = true;
                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.02";
                oAuxiliaryPatternData.domains.aNodesFrom = "_ANY_";
                oAuxiliaryPatternData.domains.aNodesTo = [ nT_slug ];
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

            } catch (err) {
                console.log("javaScriptError with action a-a-u1n-01; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-a-u1n-02":

            if (verboseConsole) { console.log("case a-a-u1n-02") }
            try {
                oNodeFrom.globalDynamicData.valenceData.valenceL1 = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeFrom.globalDynamicData.valenceData.valenceL1,oNodeTo.globalDynamicData.valenceData.valenceL1);
                oRFL.updated[nF_slug] = oNodeFrom;

                auxAssistedQueue = true;
                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.03";
                oAuxiliaryPatternData.domains.aNodesFrom = [ nF_slug ];
                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.05";
                oAuxiliaryPatternData.domains.aNodesFrom = [ nF_slug ];
                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.07";
                oAuxiliaryPatternData.domains.aNodesFrom = [ nF_slug ];
                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

            } catch (err) {
                console.log("javaScriptError with action a-a-u1n-02; err: "+err+"; node_slug: "+node_slug);
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

                auxAssistedQueue = true;
                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.02";
                oAuxiliaryPatternData.domains.aNodesFrom = [ nT_slug ];
                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.07";
                oAuxiliaryPatternData.domains.aNodesFrom = [ nT_slug ];
                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.08";
                oAuxiliaryPatternData.domains.aNodesFrom = [ nT_slug ];
                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

            } catch (err) {
                console.log("javaScriptError with action a-a-u1n-03; err: "+err+"; node_slug: "+node_slug);
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
                console.log("javaScriptError with action a-c-u1n-01; err: "+err+"; node_slug: "+node_slug);
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
                console.log("javaScriptError with action a-c-u1n-02; err: "+err+"; node_slug: "+node_slug);
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
        if (!oNodeFrom.supersetData.hasOwnProperty("metaData")) {
            oNodeFrom.supersetData.metaData = {};
        }
        if (!oNodeFrom.supersetData.metaData.supersetDatahasOwnProperty("governingConcepts")) {
            oNodeFrom.supersetData.metaData.governingConcepts = [];
        }
        oNodeFrom.supersetData.metaData.governingConcepts.push(governingConcept_slug);
    }

    oRFL.updated[nF_slug] = oNodeFrom;
}

            } catch (err) {
                console.log("javaScriptError with action a-c-u1n-03; err: "+err+"; node_slug: "+node_slug);
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
                console.log("javaScriptError with action a-c-u1n-10; err: "+err+"; node_slug: "+node_slug);
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

                auxAssistedQueue = true;
                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.02";
                oAuxiliaryPatternData.domains.aNodesFrom = [ nT_slug ];
                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.07";
                oAuxiliaryPatternData.domains.aNodesFrom = [ nT_slug ];
                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.08";
                oAuxiliaryPatternData.domains.aNodesFrom = [ nT_slug ];
                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

            } catch (err) {
                console.log("javaScriptError with action a-a-u1n-o4; err: "+err+"; node_slug: "+node_slug);
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
                console.log("javaScriptError with action a-c-u1n-11; err: "+err+"; node_slug: "+node_slug);
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

                auxAssistedQueue = true;
                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.02";
                oAuxiliaryPatternData.domains.aNodesFrom = [ nT_slug ];
                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                // completely guessing about putting P.a.s1r.03 here
                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.03";
                oAuxiliaryPatternData.domains.aNodesFrom = [ nT_slug ];
                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.07";
                oAuxiliaryPatternData.domains.aNodesFrom = [ nT_slug ];
                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.08";
                oAuxiliaryPatternData.domains.aNodesFrom = [ nT_slug ];
                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

            } catch (err) {
                console.log("javaScriptError with action a-a-u1n-05; err: "+err+"; node_slug: "+node_slug);
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
                console.log("javaScriptError with action a-c-u1n-12; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-a-u1n-06":

            if (verboseConsole) { console.log("case a-a-u1n-06") }
            try {
                oNodeFrom.globalDynamicData.valenceData.parentJSONSchemaSequence = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeFrom.globalDynamicData.valenceData.parentJSONSchemaSequence,oNodeTo.globalDynamicData.valenceData.valenceL1);
                oRFL.updated[nF_slug] = oNodeFrom;
                // doesn't trigger any subsequent pattern searches (?)

                auxAssistedQueue = true;
                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1n);
                oAuxiliaryPatternData.patternName = "P.a.s1n.validation";
                oAuxiliaryPatternData.domains.aNodes = [ nT_slug ];
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

            } catch (err) {
                console.log("javaScriptError with action a-a-u1n-06; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-a-u1n-07":

            if (verboseConsole) { console.log("case a-a-u1n-07") }
            try {
                oNodeTo.globalDynamicData.specificInstances = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.globalDynamicData.specificInstances,nF_slug);
                oRFL.updated[nT_slug] = oNodeTo;

                auxAssistedQueue = true;
                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.03";
                oAuxiliaryPatternData.domains.aNodesFrom = [ nT_slug ];
                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.04";
                oAuxiliaryPatternData.domains.aNodesFrom = [ nT_slug ];
                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

            } catch (err) {
                console.log("javaScriptError with action a-a-u1n-07; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-b-u1n-01":

            if (verboseConsole) { console.log("case a-b-u1n-01") }
            try {
                // property to property
                var nF_pendingDeletion = false;
                if (oNodeFrom.propertyData.metaData.hasOwnProperty("pendingDeletion")) {
                    nF_pendingDeletion = oNodeFrom.propertyData.metaData.pendingDeletion;
                }

                if (nF_pendingDeletion == false) {
                        var oNodeTo_pre = MiscFunctions.cloneObj(oNodeTo);
                        // console.log("a-b-u1n-01; oNodeTo_pre: "+JSON.stringify(oNodeTo_pre,null,4))
                        oNodeTo = NeuroCoreFunctions.fetchNewestRawFile(nT_slug,oRFL)

                        var key1 = MiscFunctions.cloneObj(oNodeFrom.propertyData.key)
                        var key2 = MiscFunctions.cloneObj(oNodeTo.propertyData.key)
                        var obj1 = MiscFunctions.cloneObj(oNodeFrom.propertyData)

                        var propertyFromType = oNodeFrom.propertyData.type;
                        // console.log("propertyFromType: "+propertyFromType)

                        var propertyToType = oNodeTo.propertyData.type;
                        // console.log("propertyToType: "+propertyToType)

                        ////////////////////////////////////////////////////
                        ///////////////// GOVERNING CONCEPT ////////////////
                        // Transfer governingConcept from nodeTo to nodeFrom
                        if (oNodeTo.propertyData.metaData.governingConcept.hasOwnProperty("slug")) {
                            var nT_gC_slug = oNodeTo.propertyData.metaData.governingConcept.slug;
                            oNodeFrom.propertyData.metaData.governingConcept.slug = nT_gC_slug;
                        }
                        ///////////////// GOVERNING CONCEPT ////////////////
                        ////////////////////////////////////////////////////


                        ///////////////////////////////////////////////////
                        ///////////////// CHILD PROPERTIES ////////////////
                        if (!oNodeFrom.propertyData.metaData.hasOwnProperty("pendingDeletion")) {
                            oNodeFrom.propertyData.metaData.pendingDeletion = false;
                        }
                        if (!oNodeTo.propertyData.metaData.hasOwnProperty("pendingDeletion")) {
                            oNodeTo.propertyData.metaData.pendingDeletion = false;
                        }
                        if (propertyToType=="object") {
                            if (!oNodeTo.propertyData.metaData.hasOwnProperty("childProperties")) {
                                oNodeTo.propertyData.metaData.childProperties = {};
                            }
                            if (!oNodeTo.propertyData.metaData.childProperties.hasOwnProperty("direct")) {
                                oNodeTo.propertyData.metaData.childProperties.direct = [];
                            }
                            if (!oNodeTo.propertyData.metaData.childProperties.hasOwnProperty("thisConcept")) {
                                oNodeTo.propertyData.metaData.childProperties.thisConcept = [];
                            }
                            if (!oNodeTo.propertyData.metaData.childProperties.hasOwnProperty("allConcepts")) {
                                oNodeTo.propertyData.metaData.childProperties.allConcepts = [];
                            }
                            if (!oNodeTo.propertyData.metaData.childProperties.direct.includes(nF_slug)) {
                                oNodeTo.propertyData.metaData.childProperties.direct.push(nF_slug)
                            }
                            if (!oNodeTo.propertyData.metaData.childProperties.thisConcept.includes(nF_slug)) {
                                oNodeTo.propertyData.metaData.childProperties.thisConcept.push(nF_slug)
                            }
                            if (!oNodeTo.propertyData.metaData.childProperties.allConcepts.includes(nF_slug)) {
                                oNodeTo.propertyData.metaData.childProperties.allConcepts.push(nF_slug)
                            }
                            if (propertyFromType=="object") {
                                if (!oNodeFrom.propertyData.metaData.hasOwnProperty("childProperties")) {
                                    oNodeFrom.propertyData.metaData.childProperties = {};
                                }
                                if (!oNodeFrom.propertyData.metaData.childProperties.hasOwnProperty("direct")) {
                                    oNodeFrom.propertyData.metaData.childProperties.direct = [];
                                }
                                if (!oNodeFrom.propertyData.metaData.childProperties.hasOwnProperty("thisConcept")) {
                                    oNodeFrom.propertyData.metaData.childProperties.thisConcept = [];
                                }
                                if (!oNodeFrom.propertyData.metaData.childProperties.hasOwnProperty("allConcepts")) {
                                    oNodeFrom.propertyData.metaData.childProperties.allConcepts = [];
                                }
                                var nF_direct = MiscFunctions.cloneObj(oNodeFrom.propertyData.metaData.childProperties.direct)
                                var nF_thisConcept = MiscFunctions.cloneObj(oNodeFrom.propertyData.metaData.childProperties.thisConcept)
                                var nF_allConcepts = MiscFunctions.cloneObj(oNodeFrom.propertyData.metaData.childProperties.allConcepts)
                                // push nF_direct to nT_thisConcept
                                oNodeTo.propertyData.metaData.childProperties.thisConcept = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeTo.propertyData.metaData.childProperties.thisConcept,nF_direct);
                                // push nF_thisConcept to nT_thisConcept
                                oNodeTo.propertyData.metaData.childProperties.thisConcept = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeTo.propertyData.metaData.childProperties.thisConcept,nF_thisConcept);
                                // push nF_direct to nT_allConcepts
                                oNodeTo.propertyData.metaData.childProperties.allConcepts = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeTo.propertyData.metaData.childProperties.allConcepts,nF_direct);
                                // push nF_allConcepts to nT_allConcepts
                                oNodeTo.propertyData.metaData.childProperties.allConcepts = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeTo.propertyData.metaData.childProperties.allConcepts,nF_allConcepts);

                                // Elsewhere: populate allConcepts for property that is the target of an enumeration
                            }
                        }
                        ///////////////// done with CHILD PROPERTIES ////////////////
                        /////////////////////////////////////////////////////////////


                        var key2 = oNodeTo.propertyData.key

                        var aPropertyFromRequiredDefinitions = [];
                        if (obj1.metaData.hasOwnProperty("requiredDefinitions")) {
                            aPropertyFromRequiredDefinitions = obj1.metaData.requiredDefinitions;
                        }

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

                        if (!oNodeFrom.propertyData.metaData.hasOwnProperty("propertyKeyPaths")) {
                            oNodeFrom.propertyData.metaData.propertyKeyPaths = [];
                        }
                        if (!oNodeTo.propertyData.metaData.hasOwnProperty("propertyKeyPaths")) {
                            oNodeTo.propertyData.metaData.propertyKeyPaths = [];
                        }

                        if (!oNodeTo.propertyData.metaData.hasOwnProperty("requiredDefinitions")) {
                            oNodeTo.propertyData.metaData.requiredDefinitions = [];
                        }
                        // add aPropertyFromRequiredDefinitions (from nodeFrom) to oNodeTo.propertyData.metaData.requiredDefinitions
                        oNodeTo.propertyData.metaData.requiredDefinitions = MiscFunctions.pushIfNotAlreadyThere_arrayToArray(oNodeTo.propertyData.metaData.requiredDefinitions,aPropertyFromRequiredDefinitions);

                        if (!oNodeTo.propertyData.hasOwnProperty("required")) {
                            oNodeTo.propertyData.required = [];
                        }
                        if (!oNodeTo.propertyData.hasOwnProperty("unique")) {
                            oNodeTo.propertyData.unique = [];
                        }
                        if (setAsRequired) {
                            oNodeTo.propertyData.required = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.propertyData.required,key1)
                        }
                        if (setAsUnique) {
                            oNodeTo.propertyData.unique = MiscFunctions.pushIfNotAlreadyThere(oNodeTo.propertyData.unique,key1)
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

                        if (includeDependencies) {
                            var dependencyPlacement = null;
                            if (obj1.hasOwnProperty("dependencyPlacement")) {
                                dependencyPlacement = obj1.dependencyPlacement;
                            }
                            console.log("includeDependencies! dependencyPlacement: "+dependencyPlacement+"; key1: "+key1+"; key2: "+key2+"; nF_slug: "+nF_slug+"; nT_slug: "+nT_slug)
                            // need to check whether this is upper or lower dependencies
                            // right now it does lower .... ?????
                            if (dependencyPlacement=="upper") {
                                if (!oNodeTo.hasOwnProperty("dependencies")) {
                                    oNodeTo.dependencies = {};
                                }
                                var aEnum = [];
                                if (obj1.hasOwnProperty("enum")) {
                                    aEnum = obj1.enum;
                                }
                                oNodeTo.dependencies[key2] = {};
                                oNodeTo.dependencies[key2].oneOf = [];

                                for (var d=0; d < aDependencySlugs.length; d++) {
                                    var nextSlug = aDependencySlugs[d];
                                    var nextEnum = aEnum[d];
                                    var oNextEntry = {};
                                    oNextEntry.required = [];
                                    oNextEntry.properties = {};
                                    console.log("includeDependencies! nextSlug: "+nextSlug)
                                    // NEED TO LEARN TO DIFFERENTIATE null from "null"
                                    // see. e.g. property types, where "null" is an option (although null should not be an option)
                                    // test: property types, enumeration, with dependencies
                                    // if ((nextSlug==null) || (nextSlug=="null")) {
                                    // if ((nextEnum==null) || (nextEnum=="null")) {
                                    if (nextEnum==null) {
                                        console.log("nextEnum == null")
                                        oNextEntry.properties[key2] = {};
                                        oNextEntry.properties[key2].properties = {};
                                        oNextEntry.properties[key2].properties[key1] = {};
                                        oNextEntry.properties[key2].properties[key1].enum = [ nextEnum ];
                                        oNodeTo.dependencies[key2].oneOf.push(oNextEntry);
                                    } else {
                                        var propertyPath = NeuroCoreFunctions.fetchPropertyPathFromSlug(nextSlug,oRFL);
                                        oNextEntry.required.push(propertyPath);
                                        oNextEntry.properties[propertyPath] = {};
                                        var refValue = "#/definitions/"+propertyPath;
                                        oNextEntry.properties[propertyPath]["$ref"] = refValue;
                                        oNextEntry.properties[key2] = {};
                                        oNextEntry.properties[key2].properties = {};
                                        oNextEntry.properties[key2].properties[key1] = {};
                                        oNextEntry.properties[key2].properties[key1].enum = [ nextEnum ];
                                        // oNextEntry.properties[key2].enum = [ nextEnum ];
                                        console.log("includeDependencies! refValue: "+refValue)
                                        oNodeTo.dependencies[key2].oneOf.push(oNextEntry);
                                        if (!oNodeTo.propertyData.metaData.requiredDefinitions.includes(propertyPath)) {
                                            oNodeTo.propertyData.metaData.requiredDefinitions.push(propertyPath)
                                        }
                                    }
                                }
                            }
                            if (dependencyPlacement=="lower") {
                                if (propertyFromType=="array") {
                                    console.log("propertyFromType == array");
                                    if (!oNodeTo.propertyData.hasOwnProperty("allOf")) {
                                        oNodeTo.propertyData.allOf = [];
                                    }
                                    oNodeTo.propertyData.allOf = [];
                                    var oNextIfThen = {};
                                    for (var d=0; d < aDependencySlugs.length; d++) {
                                        var nextSlug = aDependencySlugs[d];
                                        var propertyPath = NeuroCoreFunctions.fetchPropertyPathFromSlug(nextSlug,oRFL);
                                        var refValue = "#/definitions/"+propertyPath;

                                        var sTranslation = obj1.items.enum[d];
                                        // Alternatively, to calculate sTranslation, recalculate nextUniqueProperty from nextSlug; this will require uniquePropertyKey (name, title, slug, etc)
                                        // which right now is in enumerationData.restrictsValueData.uniquePropertyKey; I ought to transfer this to propertyData.metaData.uniquePropertyKey
                                        // var oNextWord = NeuroCoreFunctions.fetchNewestRawFile(nextSlug,oRFL)
                                        // var sTranslation = oNextWord[propertyPath][uniquePropertyKey];

                                        oNextIfThen = {};
                                        oNextIfThen.if = {};
                                        oNextIfThen.then = {};
                                        oNextIfThen.if.properties = {};
                                        oNextIfThen.then.properties = {};
                                        oNextIfThen.if.properties[key1] = {};
                                        oNextIfThen.if.properties[key1].contains = { "const": sTranslation }
                                        oNextIfThen.then.properties[propertyPath] = {};
                                        oNextIfThen.then.properties[propertyPath]["$ref"] = refValue;
                                        oNodeTo.propertyData.allOf.push(oNextIfThen)
                                    }
                                }
                                if (propertyFromType=="string") {
                                    console.log("propertyFromType == string")
                                    if (!oNodeTo.propertyData.hasOwnProperty("dependencies")) {
                                        oNodeTo.propertyData.dependencies = {};
                                    }
                                    var aEnum = [];
                                    if (obj1.hasOwnProperty("enum")) {
                                        aEnum = obj1.enum;
                                    }
                                    oNodeTo.propertyData.dependencies[key1] = {};
                                    oNodeTo.propertyData.dependencies[key1].oneOf = [];
                                    console.log("includeDependencies! aDependencySlugs.length: "+aDependencySlugs.length)
                                    for (var d=0; d < aDependencySlugs.length; d++) {
                                        var nextSlug = aDependencySlugs[d];
                                        console.log("includeDependencies! nextSlug: "+nextSlug)
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
                                        console.log("includeDependencies! refValue: "+refValue)
                                        oNodeTo.propertyData.dependencies[key1].oneOf.push(oNextEntry);
                                        if (!oNodeTo.propertyData.metaData.requiredDefinitions.includes(propertyPath)) {
                                            oNodeTo.propertyData.metaData.requiredDefinitions.push(propertyPath)
                                        }
                                    }
                                }
                            }
                        }
                        if (!oNodeTo.propertyData.hasOwnProperty("properties")) {
                            oNodeTo.propertyData.properties = {};
                        }
                        oNodeTo.propertyData.properties[key1] = MiscFunctions.cloneObj(obj1)

                        // Manage metaData.neuroCore variables
                        // 30 July 2022: is this step causing propertyData.type and propertyData.metaData to disappear from oNodeFrom ????
                        var nF_propertyType = oNodeFrom.propertyData.type;
                        if ( (nF_propertyType=="string") || (nF_propertyType=="integer") || (nF_propertyType=="boolean") ) {
                            oNodeFrom.metaData.neuroCore.initialProcessing = true;
                            oRFL.updated[nF_slug] = oNodeFrom;
                            // // window.neuroCore.oRFL.updated[nF_slug]nF_slug]nF_slug] = oNodeFrom;
                        }

                        if (oNodeTo.propertyData.metaData.types.includes("primaryProperty")) {
                            if (!oNodeFrom.propertyData.metaData.types.includes("topLevel")) {
                                oNodeFrom.propertyData.metaData.types.push("topLevel")
                                oRFL.updated[nF_slug] = oNodeFrom;
                                // // window.neuroCore.oRFL.updated[nF_slug]nF_slug]nF_slug] = oNodeFrom;
                            }
                            if (!oNodeTo.propertyData.metaData.propertyKeyPaths.includes(key2)) {
                                oNodeTo.propertyData.metaData.propertyKeyPaths.push(key2)
                            }
                        }


                        // if oNodeTo is primaryProperty
                        // AND if no changes have been made so far in this action
                        // AND if defaultPropertiesCreated is true, then set initialProcessing to true
                        var oNodeTo_post = MiscFunctions.cloneObj(oNodeTo);
                        var sNodeTo_pre = JSON.stringify(oNodeTo_pre);
                        var sNodeTo_post = JSON.stringify(oNodeTo_post);
                        // console.log("a-b-u1n-01 oNodeTo_pre: "+JSON.stringify(oNodeTo_pre,null,4))
                        // console.log("a-b-u1n-01 oNodeTo_post: "+JSON.stringify(oNodeTo_post,null,4))
                        if (oNodeTo.propertyData.metaData.types.includes("primaryProperty")) {
                            if (sNodeTo_pre == sNodeTo_post) {
                                if (oNodeTo.metaData.neuroCore.hasOwnProperty("defaultPropertiesCreated")) {
                                    if (oNodeTo.metaData.neuroCore.defaultPropertiesCreated == true) {
                                        oNodeTo.metaData.neuroCore.initialProcessing = true;
                                    }
                                }
                            }
                        } else {
                            // not sure if this is the best way to handle non-primaryProperty nodeTo
                            oNodeTo.metaData.neuroCore.initialProcessing = true;
                            if (sNodeTo_pre != sNodeTo_post) {
                                oNodeTo.metaData.neuroCore.initialProcessing = false;
                            }
                        }

                        for (var z=0;z<oNodeTo.propertyData.metaData.propertyKeyPaths.length;z++) {
                            var pKPath2 = oNodeTo.propertyData.metaData.propertyKeyPaths[z];
                            var pKPath1 = pKPath2 + "." + key1;
                            if (!oNodeFrom.propertyData.metaData.propertyKeyPaths.includes(pKPath1)) {
                                oNodeFrom.propertyData.metaData.propertyKeyPaths.push(pKPath1)
                            }
                        }
                } // end if nF_pendingDeletion == false (approx 300 lines of code)

                oRFL.updated[nF_slug] = oNodeFrom;
                // // window.neuroCore.oRFL.updated[nF_slug]nF_slug]nF_slug] = oNodeFrom;
                oRFL.updated[nT_slug] = oNodeTo;
                // // window.neuroCore.oRFL.updated[nF_slug]nF_slug]nT_slug] = oNodeTo;
            } catch (err) {
                console.log("javaScriptError with action a-b-u1n-01; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-b-u1n-02":
        // QWERTY
        // a-e-u1n-enumerates updates propertyFor_animal_type correctly (lowercase dog, cat, etc in propertyData.enum)
        // but then a-b-u1n-02 capitalizes them (Dog, Cat, etc)
        // Problem: a-b-u1n-02 is inactive! Why is it being triggered at all?
        // Should be triggered by P.b.s1r.08 and 09, which are also inactive!
        // Question: how is a-b-u1n-02 being triggered???

            if (verboseConsole) { console.log("case a-b-u1n-02") }
            try {
/*
// 12 Aug 2022: MAKING THIS INACTIVE by hand by commenting it out
// NOT SURE HOW IT's GETTING CALLED
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
// // window.neuroCore.oRFL.updated[nF_slug]nF_slug]nT_slug] = oNodeTo;
*/
            } catch (err) {
                console.log("javaScriptError with action a-b-u1n-02; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-b-u1n-03":

            if (verboseConsole) { console.log("case a-b-u1n-03") }
            try {
                // incomplete

            } catch (err) {
                console.log("javaScriptError with action a-b-u1n-03; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-b-u1n-04":

            if (verboseConsole) { console.log("case a-b-u1n-04") }
            try {
                // primaryProperty to JSONSchema
                var oNodeTo = NeuroCoreFunctions.fetchNewestRawFile(nT_slug,oRFL)
                var oNodeTo_pre = MiscFunctions.cloneObj(oNodeTo)
                var key1 = oNodeFrom.propertyData.key;
                var obj1 = oNodeFrom.propertyData;
                var aRequiredDefinitions = oNodeFrom.propertyData.metaData.requiredDefinitions;

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

                for (var d=0;d<aRequiredDefinitions.length;d++) {
                    var nextRequiredDefinition_propertyPath = aRequiredDefinitions[d];
                    if (!oNodeTo.definitions.hasOwnProperty(nextRequiredDefinition_propertyPath)) {
                        oNodeTo.definitions[nextRequiredDefinition_propertyPath] = {};
                    }
                }

                if (oNodeFrom.hasOwnProperty("dependencies")) {
                    var oDep1 = oNodeFrom.dependencies;
                    oNodeTo.dependencies = MiscFunctions.cloneObj(oDep1)
                }

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

                // if no changes were made, then initial processing of JSON Schema is complete
                // ** also require that oNodeFrom initialProcessing is also already complete (which means the feeding primaryProperty already has defaults made and loaded)
                var oNodeTo_post = MiscFunctions.cloneObj(oNodeTo)
                var sNodeTo_pre = JSON.stringify(oNodeTo_pre)
                var sNodeTo_post = JSON.stringify(oNodeTo_post)
                if (sNodeTo_pre == sNodeTo_post) {
                    if (oNodeFrom.metaData.neuroCore.initialProcessing == true) {
                        oNodeTo.metaData.neuroCore.initialProcessing = true;
                    }
                }

                oRFL.updated[nT_slug] = oNodeTo;
                // window.neuroCore.oRFL.updated[nF_slug]nT_slug] = oNodeTo;

            } catch (err) {
                console.log("javaScriptError with action a-b-u1n-04; err: "+err+"; node_slug: "+node_slug);
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
                // window.neuroCore.oRFL.updated[nF_slug]nT_slug] = oNodeTo;

            } catch (err) {
                console.log("javaScriptError with action a-b-u1n-05; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-b-u1n-06":

            if (verboseConsole) { console.log("case a-b-u1n-06") }
            try {
                // incomplete

            } catch (err) {
                console.log("javaScriptError with action a-b-u1n-06; err: "+err+"; node_slug: "+node_slug);
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

                auxAssistedQueue = true;
                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.03";
                oAuxiliaryPatternData.domains.aNodesFrom = [ nT_slug ];
                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.04";
                oAuxiliaryPatternData.domains.aNodesFrom = [ nT_slug ];
                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

            } catch (err) {
                console.log("javaScriptError with action a-a-u1n-08; err: "+err+"; node_slug: "+node_slug);
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
                console.log("javaScriptError with action a-rV-u1r-canBeSubdividedInto; err: "+err+"; node_slug: "+node_slug);
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
                console.log("javaScriptError with action a-rV-u2n-init; err: "+err+"; node_slug: "+node_slug);
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

                auxAssistedQueue = true;
                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.03";
                oAuxiliaryPatternData.domains.aNodesFrom = "_ANY_";
                oAuxiliaryPatternData.domains.aNodesTo = [ nF_slug ];
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.04";
                oAuxiliaryPatternData.domains.aNodesFrom = "_ANY_";
                oAuxiliaryPatternData.domains.aNodesTo = [ nF_slug ];
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.05";
                oAuxiliaryPatternData.domains.aNodesFrom = "_ANY_";
                oAuxiliaryPatternData.domains.aNodesTo = [ nF_slug ];
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.06";
                oAuxiliaryPatternData.domains.aNodesFrom = "_ANY_";
                oAuxiliaryPatternData.domains.aNodesTo = [ nF_slug ];
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.07";
                oAuxiliaryPatternData.domains.aNodesFrom = "_ANY_";
                oAuxiliaryPatternData.domains.aNodesTo = [ nF_slug ];
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                oAuxiliaryPatternData.patternName = "P.a.s1r.08";
                oAuxiliaryPatternData.domains.aNodesFrom = "_ANY_";
                oAuxiliaryPatternData.domains.aNodesTo = [ nF_slug ];
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

            } catch (err) {
                console.log("javaScriptError with action a-a-u1n-09; err: "+err+"; node_slug: "+node_slug);
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

                oNodeFrom.metaData.neuroCore.processedAsSpecificInstance = true;

                oRFL.updated[nF_slug] = oNodeFrom;

                // does not need to trigger any subsequent Pattern searches (?)

            } catch (err) {
                console.log("javaScriptError with action a-a-u1n-10; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-c-c1n-createjsonschema":

            if (verboseConsole) { console.log("case a-c-c1n-createjsonschema") }
            try {
                console.log("a-c-c1n-createjsonschema A")
                var specialNodeName = "JSONSchema";
                var newWordWordType = "JSONSchema";

                // common to all specialNode types
                var sCurrConceptSingular = oNode.conceptData.name.singular;
                var sCurrConceptPlural = oNode.conceptData.name.plural;
                var sCurrConcept_conceptSlug = oNode.conceptData.slug;
                var sCurrConcept_conceptTitle = oNode.conceptData.title;
                var oNewWord = await MiscFunctions.createNewWordByTemplate(newWordWordType)

                var newWord_slug = specialNodeName + "For_" + sCurrConcept_conceptSlug;
                var newWord_name = specialNodeName + " for " + sCurrConceptSingular;
                var newWord_title = specialNodeName.substr(0,1).toUpperCase()+specialNodeName.substr(1) + " for " + sCurrConcept_conceptTitle;
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
                // window.neuroCore.oRFL.updated[nF_slug]node_slug] = oNode;

                // specific to JSONSchema
                oNewWord.JSONSchemaData.slug = sCurrConcept_conceptSlug;
                oNewWord.JSONSchemaData.name = sCurrConceptSingular;
                oNewWord.JSONSchemaData.title = sCurrConcept_conceptTitle;
                oNewWord.JSONSchemaData.metaData.primaryProperty = "primaryPropertyFor_"+sCurrConcept_conceptSlug;
                oNewWord.JSONSchemaData.metaData.governingConcept.slug = governingConceptSlug;
                oNewWord.required = [ sCurrConceptSingular+"Data" ]

                oRFL.new[newWord_slug] = oNewWord;

                auxAssistedQueue = true;
                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1n);
                oAuxiliaryPatternData.patternName = "P.c.c1n.JSONSchema";
                oAuxiliaryPatternData.domains.aNodes = [ newWord_slug ];
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                // console.log("a-c-c1n-createjsonschema; aAuxiliaryPatternData: "+JSON.stringify(aAuxiliaryPatternData,null,4))

            } catch (err) {
                console.log("javaScriptError with action a-c-c1n-createjsonschema; err: "+err+"; node_slug: "+node_slug);
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
                var sCurrConcept_conceptSlug = oNode.conceptData.slug;
                var sCurrConcept_conceptTitle = oNode.conceptData.title;
                var oNewWord = await MiscFunctions.createNewWordByTemplate(newWordWordType)

                var newWord_slug = specialNodeName + "For_" + sCurrConcept_conceptSlug;
                var newWord_name = specialNodeName + " for " + sCurrConceptSingular;
                var newWord_title = specialNodeName.substr(0,1).toUpperCase()+specialNodeName.substr(1) + " for " + sCurrConcept_conceptTitle;
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
                // window.neuroCore.oRFL.updated[nF_slug]node_slug] = oNode;

                // specific to primaryProperty

                var primaryPropertyKey = sCurrConcept_conceptSlug+"Data";
                if (!oNewWord.propertyData.metaData.hasOwnProperty("propertyKeyPaths")) {
                    oNewWord.propertyData.metaData.propertyKeyPaths = [];
                }
                if (!oNewWord.propertyData.metaData.propertyKeyPaths.includes(primaryPropertyKey)) {
                    oNewWord.propertyData.metaData.propertyKeyPaths.push(primaryPropertyKey)
                }

                oNewWord.propertyData.metaData.types = ["primaryProperty"]
                oNewWord.propertyData.metaData.governingConcept.slug = governingConceptSlug;
                oNewWord.propertyData.types = ["primaryProperty"]
                oNewWord.propertyData.type = "object";
                oNewWord.propertyData.slug = sCurrConcept_conceptSlug+"Data";
                oNewWord.propertyData.key = primaryPropertyKey
                oNewWord.propertyData.name = sCurrConceptSingular+" data";
                oNewWord.propertyData.title = sCurrConcept_conceptTitle+" Data";
                oNewWord.propertyData.description = "data about this "+sCurrConceptSingular;
                oNewWord.propertyData.require = true; // whether this property is required in upstream property; may be overridden at upstream property; may deprecate this field
                oNewWord.propertyData.required = []; // list of properties that are required; applicable only if this property is an object
                oNewWord.propertyData.unique = []; // every property of type=object needs to have an unique array; if a property key is unique, then each specific instance must have a unique value
                oNewWord.propertyData.properties = {};

                oRFL.new[newWord_slug] = oNewWord;

                auxAssistedQueue = true;
                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1n);
                oAuxiliaryPatternData.patternName = "P.c.c1n.primaryProperty";
                oAuxiliaryPatternData.domains.aNodes = [ newWord_slug ];
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

            } catch (err) {
                console.log("javaScriptError with action a-c-c1n-createprimaryproperty; err: "+err+"; node_slug: "+node_slug);
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
                var sCurrConcept_conceptSlug = oNode.conceptData.slug;
                var sCurrConcept_conceptTitle = oNode.conceptData.title;
                var oNewWord = await MiscFunctions.createNewWordByTemplate(newWordWordType)

                var newWord_slug = specialNodeName + "For_" + sCurrConcept_conceptSlug;
                var newWord_name = specialNodeName + " for " + sCurrConceptSingular;
                var newWord_title = specialNodeName.substr(0,1).toUpperCase()+specialNodeName.substr(1) + " for " + sCurrConcept_conceptTitle;
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
                // window.neuroCore.oRFL.updated[nF_slug]node_slug] = oNode;

                // specific to properties
                oNewWord.setData.metaData.types = ["mainPropertiesSet"]
                oNewWord.setData.metaData.governingConcept.slug = governingConceptSlug;
                oNewWord.setData.slug = "propertiesFor_"+sCurrConcept_conceptSlug;
                oNewWord.setData.name = "properties for "+sCurrConceptSingular;
                oNewWord.setData.title = "Properties for "+sCurrConcept_conceptTitle.substr(0,1).toUpperCase()+sCurrConcept_conceptTitle.substr(1);;
                oNewWord.setData.description = "This is the set of all properties for this particular concept."

                oRFL.new[newWord_slug] = oNewWord;

                /*
                // P.c.c1n.properties does not yet exist (P.c.c1n.superset, etc do exist ... ) ... need to make it?
                auxAssistedQueue = true;
                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1n);
                oAuxiliaryPatternData.patternName = "P.c.c1n.properties";
                oAuxiliaryPatternData.domains.aNodes = [ newWord_slug ];
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)
                */

            } catch (err) {
                console.log("javaScriptError with action a-c-c1n-createproperties; err: "+err+"; node_slug: "+node_slug);
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
                var sCurrConcept_conceptSlug = oNode.conceptData.slug;
                var sCurrConcept_conceptTitle = oNode.conceptData.title;
                var oNewWord = await MiscFunctions.createNewWordByTemplate(newWordWordType)

                var newWord_slug = specialNodeName + "For_" + sCurrConcept_conceptSlug;
                var newWord_name = specialNodeName + " for " + sCurrConceptSingular;
                var newWord_title = specialNodeName.substr(0,1).toUpperCase()+specialNodeName.substr(1) + " for " + sCurrConcept_conceptTitle;
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
                // window.neuroCore.oRFL.updated[nF_slug]node_slug] = oNode;

                // specific to propertySchema
                oNewWord.schemaData.slug = sCurrConcept_conceptSlug;
                oNewWord.schemaData.name = sCurrConceptSingular;
                oNewWord.schemaData.title = sCurrConcept_conceptTitle;
                oNewWord.schemaData.metaData.types = ["propertySchema"]
                oNewWord.schemaData.types = ["propertySchema"]
                oNewWord.schemaData.metaData.governingConcept.slug = governingConceptSlug;

                oRFL.new[newWord_slug] = oNewWord;

                auxAssistedQueue = true;
                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1n);
                oAuxiliaryPatternData.patternName = "P.c.c1n.propertySchema";
                oAuxiliaryPatternData.domains.aNodes = [ newWord_slug ];
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

            } catch (err) {
                console.log("javaScriptError with action a-c-c1n-createpropertyschema; err: "+err+"; node_slug: "+node_slug);
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
                var sCurrConcept_conceptSlug = oNode.conceptData.slug;
                var sCurrConcept_conceptTitle = oNode.conceptData.title;
                var oNewWord = await MiscFunctions.createNewWordByTemplate(newWordWordType)

                var newWord_slug = specialNodeName + "For_" + sCurrConcept_conceptSlug;
                var newWord_name = specialNodeName + " for " + sCurrConceptSingular;
                var newWord_title = specialNodeName.substr(0,1).toUpperCase()+specialNodeName.substr(1) + " for " + sCurrConcept_conceptTitle;
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
                // window.neuroCore.oRFL.updated[nF_slug]node_slug] = oNode;

                // specific to schema
                oNewWord.schemaData.slug = sCurrConcept_conceptSlug;
                oNewWord.schemaData.name = sCurrConceptSingular;
                oNewWord.schemaData.title = sCurrConcept_conceptTitle;
                oNewWord.schemaData.metaData.types = ["conceptRelationships"]
                oNewWord.schemaData.metaData.governingConcept.slug = governingConceptSlug;
                oNewWord.schemaData.types = ["conceptRelationships"]

                oRFL.new[newWord_slug] = oNewWord;

                auxAssistedQueue = true;
                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1n);
                oAuxiliaryPatternData.patternName = "P.c.c1n.mainSchema";
                oAuxiliaryPatternData.domains.aNodes = [ newWord_slug ];
                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

            } catch (err) {
                console.log("javaScriptError with action a-c-c1n-createschema; err: "+err+"; node_slug: "+node_slug);
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
var sCurrConcept_conceptTitleSingular = oNode.conceptData.title;
var sCurrConcept_conceptTitlePlural = "";
// console.log("qwertyyy making superset; sCurrConcept_conceptTitlePlural A: "+sCurrConcept_conceptTitlePlural)
if (oNode.conceptData.hasOwnProperty("oTitle")) {
    sCurrConcept_conceptTitlePlural = oNode.conceptData.oTitle.plural;
}
if (!sCurrConcept_conceptTitlePlural) {
    // sCurrConceptPlural
    var aPluralChunks = sCurrConceptPlural.split(" ");
    // console.log("qwertyyy making superset; sCurrConceptPlural: "+sCurrConceptPlural+"; aPluralChunks.length: "+aPluralChunks.length)
    for (var c=0;c<aPluralChunks.length;c++) {
        var nextChunk = aPluralChunks[c];
        if (nextChunk) {
            nextChunk = nextChunk[0].toUpperCase() + nextChunk.substring(1)
            // console.log("qwertyyy making superset; nextChunk: "+nextChunk)
            sCurrConcept_conceptTitlePlural += nextChunk;
            if (c < aPluralChunks.length - 1) {
                sCurrConcept_conceptTitlePlural += " ";
            }
        }
    }
}
// console.log("qwertyyy making superset; sCurrConcept_conceptTitlePlural B: "+sCurrConcept_conceptTitlePlural)

var sCurrConcept_conceptSlug = oNode.conceptData.slug;
var sCurrConcept_conceptSlugPlural = "";
// console.log("qwertyyy making superset; sCurrConcept_conceptSlugPlural A: "+sCurrConcept_conceptSlugPlural)
if (oNode.conceptData.hasOwnProperty("oSlug")) {
    sCurrConcept_conceptSlugPlural = oNode.conceptData.oSlug.plural;
}
if (!sCurrConcept_conceptSlugPlural) {
    // sCurrConceptPlural
    var aPluralChunks = sCurrConceptPlural.split(" ");
    // console.log("qwertyyy making superset; sCurrConceptPlural: "+sCurrConceptPlural+"; aPluralChunks.length: "+aPluralChunks.length)
    var sCurrConcept_conceptSlugPlural = "";
    for (var c=0;c<aPluralChunks.length;c++) {
        var nextChunk = aPluralChunks[c];
        // console.log("qwertyyy making superset; nextChunk"+nextChunk)
        if (nextChunk) {
            if (c > 0) {
                nextChunk = nextChunk[0].toUpperCase() + nextChunk.substring(1)
            }
            sCurrConcept_conceptSlugPlural += nextChunk;
        }
    }
}
// console.log("qwertyyy making superset; sCurrConcept_conceptSlugPlural B: "+sCurrConcept_conceptSlugPlural)
var sCurrConcept_conceptTitle = oNode.conceptData.title;
var oNewWord = await MiscFunctions.createNewWordByTemplate(newWordWordType)

var newWord_slug = specialNodeName + "For_" + sCurrConcept_conceptSlug;
var newWord_name = specialNodeName + " for " + sCurrConceptSingular;
var newWord_title = specialNodeName.substr(0,1).toUpperCase()+specialNodeName.substr(1) + " for " + sCurrConcept_conceptTitleSingular;
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
// window.neuroCore.oRFL.updated[nF_slug]node_slug] = oNode;

// specific to superset
oNewWord.supersetData.slug = sCurrConcept_conceptSlugPlural;
oNewWord.supersetData.name = sCurrConceptPlural;
oNewWord.supersetData.title = sCurrConcept_conceptTitlePlural;
// oNewWord.supersetData.name = sCurrConceptPlural;
// oNewWord.supersetData.title = sCurrConceptPlural.substr(0,1).toUpperCase()+sCurrConceptPlural.substr(1);
oNewWord.supersetData.description = "This node represents the set of all "+sCurrConceptPlural+".";
oNewWord.supersetData.metaData.governingConcept.slug = governingConceptSlug;

oRFL.new[newWord_slug] = oNewWord;

auxAssistedQueue = true;
oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1n);
oAuxiliaryPatternData.patternName = "P.c.c1n.superset";
oAuxiliaryPatternData.domains.aNodes = [ newWord_slug ];
aAuxiliaryPatternData.push(oAuxiliaryPatternData)

            } catch (err) {
                console.log("javaScriptError with action a-c-c1n-createsuperset; err: "+err+"; node_slug: "+node_slug);
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
var sCurrConcept_conceptSlug = oNode.conceptData.slug;
var sCurrConcept_conceptTitle = oNode.conceptData.title;
var oNewWord = await MiscFunctions.createNewWordByTemplate(newWordWordType)

var newWord_slug = specialNodeName + "For_" + sCurrConcept_conceptSlug;
var newWord_name = specialNodeName + " for " + sCurrConceptSingular;
var newWord_title = specialNodeName.substr(0,1).toUpperCase()+specialNodeName.substr(1) + " for " + sCurrConcept_conceptTitle;
var newWord_ipns = oNewWord.metaData.ipns;

oNewWord.wordData.slug = newWord_slug;
oNewWord.wordData.name = newWord_name;
oNewWord.wordData.title = newWord_title;

oNewWord.wordData.governingConcepts = [];
var governingConceptSlug = oNode.wordData.slug;
oNewWord.wordData.governingConcepts.push(governingConceptSlug)
oNewWord.wordTypeData.metaData.governingConcept.slug = governingConceptSlug;

oNode = NeuroCoreFunctions.fetchNewestRawFile(node_slug,oRFL)
oNode.conceptData.nodes[specialNodeName].slug = newWord_slug;
oNode.conceptData.nodes[specialNodeName].ipns = newWord_ipns;

oRFL.updated[node_slug] = oNode;
// window.neuroCore.oRFL.updated[nF_slug]node_slug] = oNode;

// specific to wordType
oNewWord.wordTypeData.slug = sCurrConcept_conceptSlug;
oNewWord.wordTypeData.name = sCurrConceptSingular;
oNewWord.wordTypeData.title = sCurrConcept_conceptTitle
oNewWord.wordTypeData.metaData.governingConcept.slug = governingConceptSlug;

oRFL.new[newWord_slug] = oNewWord;

auxAssistedQueue = true;
oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1n);
oAuxiliaryPatternData.patternName = "P.c.c1n.wordType";
oAuxiliaryPatternData.domains.aNodes = [ newWord_slug ];
aAuxiliaryPatternData.push(oAuxiliaryPatternData)

            } catch (err) {
                console.log("javaScriptError with action a-c-c1n-createwordtype; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-c-c1r-connectconcep":

            if (verboseConsole) { console.log("case a-c-c1r-connectconcep") }
            try {
                var desiredParentSet_slug = "supersetFor_concept";
                var parentSchema_slug = "schemaFor_concept";

                // might turn all of the below into a NeuroCoreFunction ... ?
                var arr1 = oNode.globalDynamicData.specificInstanceOf;
                console.log("a-c-c1r-connectconcep; node_slug: "+node_slug+"; arr1: "+JSON.stringify(arr1,null,4))
                if (!arr1.includes(desiredParentSet_slug)) {
                    var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                    oNewRel.nodeFrom.slug = node_slug;
                    oNewRel.relationshipType.slug = "isASpecificInstanceOf";
                    oNewRel.nodeTo.slug = desiredParentSet_slug;
                    // now add the newRel to schema for concept, wordType, superset, etc
                    var oSchema = NeuroCoreFunctions.fetchNewestRawFile(parentSchema_slug,oRFL)
                    if (oSchema != false ) {
                        oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oNewRel,oRFL.current)
                        oRFL.updated[parentSchema_slug] = oSchema;

                        auxAssistedQueue = true;
                        oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                        oAuxiliaryPatternData.patternName = "P.a.s1r.05";
                        oAuxiliaryPatternData.domains.aNodesFrom = [ node_slug ];
                        oAuxiliaryPatternData.domains.aNodesTo = [ desiredParentSet_slug ];
                        aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                        oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                        oAuxiliaryPatternData.patternName = "P.a.s1r.07";
                        oAuxiliaryPatternData.domains.aNodesFrom = [ desiredParentSet_slug ];
                        oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                        aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                        oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                        oAuxiliaryPatternData.patternName = "P.a.s1r.08";
                        oAuxiliaryPatternData.domains.aNodesFrom = [ desiredParentSet_slug ];
                        oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                        aAuxiliaryPatternData.push(oAuxiliaryPatternData)
                    }
                }

            } catch (err) {
                console.log("javaScriptError with action a-c-c1r-connectconcep; err: "+err+"; node_slug: "+node_slug);
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

                    auxAssistedQueue = true;
                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.01";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ node_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.05";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ node_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = [ desiredParentSet_slug ];
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.07";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ desiredParentSet_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.08";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ desiredParentSet_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)
                }

            } catch (err) {
                console.log("javaScriptError with action a-c-c1r-connectjsonschema; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-c-c1r-connectprimaryproperty":

            if (verboseConsole) { console.log("case a-c-c1r-connectprimaryproperty") }
            try {
                // incomplete
                var desiredParentSet_slug = "properties_primaryProperties";
                var parentSchema_slug = "schemaFor_property";

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

                    auxAssistedQueue = true;
                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.03";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ desiredParentSet_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.04";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ desiredParentSet_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                    // .04 should be here twice so that desiredParentSet_slug can be in either role (nodeFrom or nodeTo)
                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.04";
                    oAuxiliaryPatternData.domains.aNodesFrom = "_ANY_";
                    oAuxiliaryPatternData.domains.aNodesTo = [ desiredParentSet_slug ];
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.06";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ node_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = [ desiredParentSet_slug ];
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.08";
                    oAuxiliaryPatternData.domains.aNodesFrom = "_ANY_";
                    oAuxiliaryPatternData.domains.aNodesTo = [ desiredParentSet_slug ];
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)
                }
            } catch (err) {
                console.log("javaScriptError with action a-c-c1r-connectprimaryproperty; err: "+err+"; node_slug: "+node_slug);
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

                    auxAssistedQueue = true;
                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.05";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ node_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = [ desiredParentSet_slug ];
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.07";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ desiredParentSet_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.08";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ desiredParentSet_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)
                }

            } catch (err) {
                console.log("javaScriptError with action a-c-c1r-connectpropertyschema; err: "+err+"; node_slug: "+node_slug);
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

                    auxAssistedQueue = true;
                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.05";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ node_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = [ desiredParentSet_slug ];
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.07";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ desiredParentSet_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.08";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ desiredParentSet_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)
                }

            } catch (err) {
                console.log("javaScriptError with action a-c-c1r-connectschema; err: "+err+"; node_slug: "+node_slug);
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

                    auxAssistedQueue = true;
                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.05";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ node_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = [ desiredParentSet_slug ];
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.07";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ desiredParentSet_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.08";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ desiredParentSet_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)
                }

            } catch (err) {
                console.log("javaScriptError with action a-c-c1r-connectsuperset; err: "+err+"; node_slug: "+node_slug);
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

                    auxAssistedQueue = true;
                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.05";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ node_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = [ desiredParentSet_slug ];
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.07";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ desiredParentSet_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                    oAuxiliaryPatternData.patternName = "P.a.s1r.08";
                    oAuxiliaryPatternData.domains.aNodesFrom = [ desiredParentSet_slug ];
                    oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)
                }

            } catch (err) {
                console.log("javaScriptError with action a-c-c1r-connectwordtype; err: "+err+"; node_slug: "+node_slug);
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
                if (oSchema != false ) {
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
                }

            } catch (err) {
                console.log("javaScriptError with action a-c-u1n-makebasicconceptrels; err: "+err+"; node_slug: "+node_slug);
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
                console.log("javaScriptError with action a-c-u1n-makesuperset; err: "+err+"; node_slug: "+node_slug);
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
                // window.neuroCore.oRFL.updated[nF_slug]node_slug] = oNode;

            } catch (err) {
                console.log("javaScriptError with action a-c-u1n-updateconcept; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-c-u1n-updatemainschemaforconceptgraph":

            if (verboseConsole) { console.log("case a-c-u1n-updatemainschemaforconceptgraph") }
            try {
var mainSchemaForConceptGraph_slug = "mainSchemaForConceptGraph";
var oMSFCG = NeuroCoreFunctions.fetchNewestRawFile(mainSchemaForConceptGraph_slug,oRFL);
// console.log("a-c-u1n-updatemainschemaforconceptgraph; oMSFCG before: "+JSON.stringify(oMSFCG,null,4))

var concept_slug = oNode.wordData.slug;
var oConcept = NeuroCoreFunctions.fetchNewestRawFile(concept_slug,oRFL);
var mainSchema_slug = oConcept.conceptData.nodes.schema.slug;
var propertySchema_slug = oConcept.conceptData.nodes.propertySchema.slug;

oMSFCG.conceptGraphData.concepts = MiscFunctions.pushIfNotAlreadyThere(oMSFCG.conceptGraphData.concepts,concept_slug)
if (mainSchema_slug) {
    oMSFCG.conceptGraphData.schemas = MiscFunctions.pushIfNotAlreadyThere(oMSFCG.conceptGraphData.schemas,mainSchema_slug)
}
if (propertySchema_slug) {
    oMSFCG.conceptGraphData.schemas = MiscFunctions.pushIfNotAlreadyThere(oMSFCG.conceptGraphData.schemas,propertySchema_slug)
}

// console.log("a-c-u1n-updatemainschemaforconceptgraph; oMSFCG after: "+JSON.stringify(oMSFCG,null,4))

oRFL.updated[mainSchemaForConceptGraph_slug] = MiscFunctions.cloneObj(oMSFCG);
// // window.neuroCore.oRFL.updated[nF_slug]mainSchemaForConceptGraph_slug] = MiscFunctions.cloneObj(oMSFCG);
            } catch (err) {
                console.log("javaScriptError with action a-c-u1n-updatemainschemaforconceptgraph; err: "+err+"; node_slug: "+node_slug);
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
                console.log("javaScriptError with action a-c-u1n-wordtype_in_wordtypes; err: "+err+"; node_slug: "+node_slug);
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
                console.log("javaScriptError with action a-a-u1n-cleanglobaldynamicdata; err: "+err+"; node_slug: "+node_slug);
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
                console.log("javaScriptError with action a-a-umn-populatespecificinstances; err: "+err+"; node_slug: "+node_slug);
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
var aRequiredPropertiesThisConceptGraph = ["slug","name","title"];
var aUniquePropertiesThisConceptGraph = ["slug","name","title"];
// if present, replace above array with data from mainSchemaForConceptGraph
var mainSchemaForCG_slug = "mainSchemaForConceptGraph";
var oMainSchemaForConceptGraph = NeuroCoreFunctions.fetchNewestRawFile(mainSchemaForCG_slug,oRFL)
if (oMainSchemaForConceptGraph.hasOwnProperty("conceptGraphData")) {
    if (oMainSchemaForConceptGraph.conceptGraphData.hasOwnProperty("defaultPropertyDescriptors")) {
        aDefaultPropertiesThisConceptGraph = oMainSchemaForConceptGraph.conceptGraphData.defaultPropertyDescriptors;
    }
    if (oMainSchemaForConceptGraph.conceptGraphData.hasOwnProperty("required")) {
        aRequiredPropertiesThisConceptGraph = oMainSchemaForConceptGraph.conceptGraphData.required;
    }
    if (oMainSchemaForConceptGraph.conceptGraphData.hasOwnProperty("unique")) {
        aUniquePropertiesThisConceptGraph = oMainSchemaForConceptGraph.conceptGraphData.unique;
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
var govConcept_conceptSingularName = oGoverningConcept.conceptData.name.singular;
var govConcept_conceptSlug = oGoverningConcept.conceptData.slug;
var govConcept_conceptTitle = oGoverningConcept.conceptData.title;

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

console.log("a-b-cmn-primaryproperty; aDefaultPropertiesThisConcept.length: "+aDefaultPropertiesThisConcept.length)
for (var x=0;x<aDefaultPropertiesThisConcept.length;x++) {
    var nextDP = aDefaultPropertiesThisConcept[x];
    if (!alreadyMade[nextDP]) {
        // make new word for slug
        var newItemName = nextDP;
        // console.log("a-b-cmn-primaryproperty; newItemName: "+newItemName)
        var newWord_slug = "propertyFor_"+govConcept_conceptSlug+"_"+newItemName;
        var newWord_title = "Property for "+govConcept_conceptTitle+": "+newItemName;
        var newWord_name = "property for "+govConcept_conceptSingularName+": "+newItemName;
        var newWord_description = "The top-level "+newItemName+" for this "+govConcept_conceptSingularName;

        var isThisPropertyRequired = false;
        var isThisPropertyUnique = false;
        if (aRequiredPropertiesThisConceptGraph.includes(nextDP)) {
            isThisPropertyRequired = true;
        }
        if (aUniquePropertiesThisConceptGraph.includes(nextDP)) {
            isThisPropertyUnique = true;
        }

        var oNewWordForSlug = await MiscFunctions.createNewWordByTemplate(newWordType);
        oNewWordForSlug.wordData.slug = newWord_slug;
        // console.log("a-b-cmn-primaryproperty; oNewWordForSlug A: "+JSON.stringify(oNewWordForSlug,null,4))

        oNewWordForSlug.wordData.title = newWord_title;
        oNewWordForSlug.wordData.name = newWord_name;
        oNewWordForSlug.wordData.description = newWord_description;

        oNewWordForSlug.propertyData.key = newItemName;
        oNewWordForSlug.propertyData.slug = MiscFunctions.convertNameToSlug(newItemName);
        oNewWordForSlug.propertyData.type = "string";
        oNewWordForSlug.propertyData.title = newItemName[0].toUpperCase() + newItemName.substring(1);
        oNewWordForSlug.propertyData.name = newItemName;
        oNewWordForSlug.propertyData.description = newWord_description;

        // console.log("a-b-cmn-primaryproperty; oNewWordForSlug B: "+JSON.stringify(oNewWordForSlug,null,4))

        oNewWordForSlug.wordData.governingConcepts.push(governingConcept_slug);
        oNewWordForSlug.propertyData.metaData.required = isThisPropertyRequired;
        oNewWordForSlug.propertyData.metaData.unique = isThisPropertyUnique;
        oNewWordForSlug.propertyData.metaData.governingConcept.slug = governingConcept_slug;
        oNewWordForSlug.propertyData.metaData.types.push("topLevel")

        // console.log("a-b-cmn-primaryproperty; oNewWordForSlug Z: "+JSON.stringify(oNewWordForSlug,null,4))

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

// if all defaults have already made, then set neuroCore.defaultPropertiesCreated to true
var allAlreadyMade = true;
for (var x=0;x<aDefaultPropertiesThisConcept.length;x++) {
    var nextDP = aDefaultPropertiesThisConcept[x];
    if (!alreadyMade[nextDP]) {
        allAlreadyMade = false;
    }
}
if (allAlreadyMade) {
    oNode.metaData.neuroCore.defaultPropertiesCreated = true;
    oRFL.updated[node_slug] = oNode;
}

            } catch (err) {
                console.log("javaScriptError with action a-b-cmn-primaryproperty; err: "+err+"; node_slug: "+node_slug);
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
                console.log("javaScriptError with action a-rv-s1n-adddependencyslugs; err: "+err+"; node_slug: "+node_slug);
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
                        var role1_title = oRole1.supersetData.title;
                    } else {
                        var role1_name = oRole1.wordData.name;
                        var role1_title = oRole1.wordData.title;
                    }
                    if (oRole4.hasOwnProperty("supersetData")) {
                        var role4_name = oRole4.supersetData.name;
                        var role4_title = oRole4.supersetData.title;
                    } else {
                        var role4_name = oRole4.wordData.name;
                        var role4_title = oRole4.wordData.title;
                    }
                    var role4_name = oRole4.supersetData.name;
                    var newSubset_slug = role4_slug+"_organizedBy_"+role1_slug;
                    var newSubset_title = role4_title[0].toUpperCase() + role4_title.substring(1)+" Organized by "+role1_title;
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
                console.log("javaScriptError with action a-rv-s1n-addorganizedbysubset; err: "+err+"; node_slug: "+node_slug);
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
                console.log("javaScriptError with action a-rv-s1n-connectsubsets; err: "+err+"; node_slug: "+node_slug);
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
                console.log("javaScriptError with action a-rv-s1n-updaterole5id; err: "+err+"; node_slug: "+node_slug);
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
                console.log("javaScriptError with action a-rv-u1n-populatejsonschemadefinitions; err: "+err+"; node_slug: "+node_slug);
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
                console.log("javaScriptError with action a-rv-u1n-transferrole6; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-rv00-s1n-00":

            if (verboseConsole) { console.log("case a-rv00-s1n-00") }
            try {
                oNode.wordData.tag="A.rV00.s1n.00"
                oRFL.updated[node_slug] = oNode;

            } catch (err) {
                console.log("javaScriptError with action a-rv00-s1n-00; err: "+err+"; node_slug: "+node_slug);
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
                console.log("javaScriptError with action a-e-u1n-enumeration_updateRole0; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-e-u1n-enumeration_updateRole3":

            if (verboseConsole) { console.log("case a-e-u1n-enumeration_updateRole3") }
            try {
                var oNRM = oNode.enumerationData.nodeRolesManagement;
                var role1_slug = oNRM.role1_slug;
                var role2_slug = oNRM.role2_slug;

                var oRole2 = NeuroCoreFunctions.fetchNewestRawFile(role2_slug,oRFL)
                // console.log("qwertyy: role2_slug: "+role2_slug)
                // console.log("qwertyy: oRole2: "+JSON.stringify(oRole2,null,4))
                var role2_governingConcept_slug = oRole2.propertyData.metaData.governingConcept.slug;
                // console.log("qwertyy: role2_governingConcept_slug: "+role2_governingConcept_slug)
                var oGoverningConcept = NeuroCoreFunctions.fetchNewestRawFile(role2_governingConcept_slug,oRFL)
                // console.log("qwertyy: oGoverningConcept: "+JSON.stringify(oGoverningConcept,null,4))
                var primaryProperty_slug = oGoverningConcept.conceptData.nodes.primaryProperty.slug;

                oNode.enumerationData.nodeRolesManagement.role3_slug = primaryProperty_slug;
                oRFL.updated[node_slug] = oNode;

            } catch (err) {
                console.log("javaScriptError with action a-e-u1n-enumeration_updateRole3; err: "+err+"; node_slug: "+node_slug);
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
                console.log("javaScriptError with action a-e-u1n-enumeration_updateRole4; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-e-u1n-enumeration_updateRole6":

            if (verboseConsole) { console.log("case a-e-u1n-enumeration_updateRole6") }
            try {
                var oNRM = oNode.enumerationData.nodeRolesManagement;
                var aRole0 = oNRM.role0_slugs;
                var role1_slug = oNRM.role1_slug;
                var role2_slug = oNRM.role2_slug;
                var role4_slug = oNRM.role4_slug;
                var aRole6_slugs = [];

                var oRole1 = NeuroCoreFunctions.fetchNewestRawFile(role1_slug,oRFL);
                if (oRole1.hasOwnProperty("setData")) {
                    var role1_govConcept_slug = oRole1.setData.metaData.governingConcept.slug;
                }
                if (oRole1.hasOwnProperty("supersetData")) {
                    var role1_govConcept_slug = oRole1.supersetData.metaData.governingConcept.slug;
                }

                var oRole4 = NeuroCoreFunctions.fetchNewestRawFile(role4_slug,oRFL);
                var role4_govConcept_slug = oRole4.supersetData.metaData.governingConcept.slug;

                if (aRole0.length > 0) {
                    for (var z=0;z<aRole0.length;z++) {
                        var nextRole0_slug = aRole0[z];
                        // check to see whether nextRole0_slug has or has not already been expanded into a full concept
                        // i.e. whether nextRole0_slug is already a wordType;
                        // if not, ??? flag it to be expanded into a concept ???
                        var supersetSlug = NeuroCoreFunctions.fetchSupersetFromWordType(nextRole0_slug,oRFL)
                        if (supersetSlug != false) {
                            aRole6_slugs.push(supersetSlug);

                            // take care of Layer 2 C2C relationship
                            var oRole6_next = NeuroCoreFunctions.fetchNewestRawFile(supersetSlug,oRFL)
                            var role6_next_govConcept_slug = oRole6_next.supersetData.metaData.governingConcept.slug;
                            var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)

                            oNewRel.nodeFrom.slug = role6_next_govConcept_slug;
                            oNewRel.relationshipType.slug = "isARealizationOf";
                            oNewRel.nodeTo.slug = role4_govConcept_slug;
                            // console.log("doingc2cstuff; oNewRel: "+JSON.stringify(oNewRel,null,4))

                            oNewRel.nodeFrom.slug = role6_next_govConcept_slug;
                            oNewRel.relationshipType.slug = "isASubsetOf";
                            oNewRel.nodeTo.slug = role1_govConcept_slug;
                            // console.log("doingc2cstuff; oNewRel: "+JSON.stringify(oNewRel,null,4))
                        }
                    }
                }
                oNode.enumerationData.nodeRolesManagement.role6_slugs = aRole6_slugs;
                oRFL.updated[node_slug] = oNode;

            } catch (err) {
                console.log("javaScriptError with action a-e-u1n-enumeration_updateRole6; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-e-ma-enumeration_manageRole5":

            if (verboseConsole) { console.log("case a-e-ma-enumeration_manageRole5") }
            try {
// edited 31 July 2022
// console.log("A a-e-ma-enumeration_manageRole5; node_slug: "+node_slug)
var oNRM = oNode.enumerationData.nodeRolesManagement;
var uniqueID = oNRM.uniqueID;
var aRole0 = oNRM.role0_slugs;
var role1_slug = oNRM.role1_slug;
var role2_slug = oNRM.role2_slug;
var role4_slug = oNRM.role4_slug;
var role5_slug = oNRM.role5_slug;
var aRole6 = oNRM.role6_slugs;

var dependenciesPlacement = oNode.enumerationData.restrictsValueData.dependenciesPlacement;

var oRole1 = NeuroCoreFunctions.fetchNewestRawFile(role1_slug,oRFL)
if (oRole1.hasOwnProperty("setData")) {
    var role1GoverningConcept_slug = oRole1.setData.metaData.governingConcept.slug;
}
if (oRole1.hasOwnProperty("supersetData")) {
    var role1GoverningConcept_slug = oRole1.supersetData.metaData.governingConcept.slug;
}
var oRole1GoverningConcept = NeuroCoreFunctions.fetchNewestRawFile(role1GoverningConcept_slug,oRFL)
var role1_name = "unknown";
if (oRole1.hasOwnProperty("supersetData")) {
    role1_name = oRole1.supersetData.name;
}
if (oRole1.hasOwnProperty("setData")) {
    role1_name = oRole1.setData.name;
}
var role1_concept_singular = oRole1GoverningConcept.conceptData.name.singular;
var role1_concept_slugSingular = oRole1GoverningConcept.conceptData.slug;
var role1_concept_titleSingular = oRole1GoverningConcept.conceptData.title;

// A.e.u1n.enumeration_updateRole4 should already have been run
var oRole4 = NeuroCoreFunctions.fetchNewestRawFile(role4_slug,oRFL)
var role4GoverningConcept_slug = oRole4.supersetData.metaData.governingConcept.slug;
var oRole4GoverningConcept = NeuroCoreFunctions.fetchNewestRawFile(role4GoverningConcept_slug,oRFL)
var role4GovConSchema_slug = oRole4GoverningConcept.conceptData.nodes.schema.slug;

var role4_name = oRole4.supersetData.name;
var role4_concept_plural = oRole4GoverningConcept.conceptData.name.plural;
var role4_concept_slugSingular = oRole4GoverningConcept.conceptData.slug;

// look to see whether role5_slug is already recorded and is a valid word in the concept graph word list
var alreadyCreated = false;
// alreadyCreated: role5 node exists AND has already been recorded inside enumerationData as such
if (role5_slug) {
    if (oRFL.current.hasOwnProperty(role5_slug)) {
        alreadyCreated = true;
        if (dependenciesPlacement=="upper") {
            // Need to make sure that any new subset rels between role6 nodes and the role5 node are added
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
        if (dependenciesPlacement=="lower") {
            // should there be some sort of one-to-one correspondence relationship established
            // between aRole6 and aRole7 nodes???
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
    for (var z=0;z < aSubsets.length;z++) {
        var nextSubsetSlug = aSubsets[z];
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
    }
    // if the role5 node has not been created, then create a new one
    if (!candidateRole5) {
        var oNewSubset = await MiscFunctions.createNewWordByTemplate("set");

        var newSubset_ipns = oNewSubset.metaData.ipns;

        var newSubset_word_slug = "setFor_"+role4_concept_slugSingular+"_organizedBy_"+role1_concept_slugSingular + "_"+ newSubset_ipns.slice(-6);
        var newSubset_word_title = "Set for "+role4_concept_plural[0].toUpperCase() + role4_concept_plural.substring(1)+" Organized by "+role1_concept_singular[0].toUpperCase() + role1_concept_singular.substring(1);
        var newSubset_word_name = "set for "+role4_concept_plural+" organized by "+role1_concept_singular;

        var newSubset_set_slug = role4_concept_slugSingular+"_organizedBy_"+role1_concept_slugSingular;
        var newSubset_set_title = role4_concept_plural[0].toUpperCase() + role4_concept_plural.substring(1)+" Organized by "+role1_concept_singular[0].toUpperCase() + role1_concept_singular.substring(1);
        var newSubset_set_name = role4_concept_plural+" organized by "+role1_concept_singular;


        oNewSubset.wordData.slug = newSubset_word_slug;
        oNewSubset.wordData.title = newSubset_word_title;
        oNewSubset.wordData.name = newSubset_word_name;
        oNewSubset.setData.slug = newSubset_set_slug;
        oNewSubset.setData.title = newSubset_set_title;
        oNewSubset.setData.name = newSubset_set_name;
        oNewSubset.wordData.governingConcepts = oRole4.wordData.governingConcepts;
        oNewSubset.setData.governingConcepts = oRole4.wordData.governingConcepts;
        oNewSubset.setData.metaData.governingConcept.slug = role4GoverningConcept_slug;
        oNewSubset.setData.metaData.types.push("organizedByEnumeration");
        oNode.enumerationData.nodeRolesManagement.role5_slug = newSubset_word_slug;
        oRFL.new[newSubset_word_slug] = oNewSubset;

        // now make new subsetOf relationship and add it to relevant schema
        var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
        oNewRel.nodeFrom.slug = newSubset_word_slug
        oNewRel.relationshipType.slug = "subsetOf";
        oNewRel.nodeTo.slug = role4_slug;

        var role4GovConSchema_slug = oRole4GoverningConcept.conceptData.nodes.schema.slug;
        var oRole4GovConSchema = NeuroCoreFunctions.fetchNewestRawFile(role4GovConSchema_slug,oRFL)
        var oRFL_x = MiscFunctions.cloneObj(oRFL.current);
        oRFL_x[newSubset_word_slug] = oNewSubset;
        oRole4GovConSchema = MiscFunctions.updateSchemaWithNewRel(oRole4GovConSchema,oNewRel,oRFL_x);
        oRFL.updated[role4GovConSchema_slug] = oRole4GovConSchema;

        if (dependenciesPlacement=="upper") {
            // now link the new set node (newSubset_word_slug, the new role5 node) to each role6 node via subsetOf relationship
            // add each new rel to oRole4GovConSchema (same as above)
            for (var x=0;x<aRole6.length;x++) {
                var nextRole6_slug = aRole6[x];

                var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                oNewRel.nodeFrom.slug = nextRole6_slug
                oNewRel.relationshipType.slug = "subsetOf";
                oNewRel.nodeTo.slug = newSubset_word_slug;

                var oRole4GovConSchema = NeuroCoreFunctions.fetchNewestRawFile(role4GovConSchema_slug,oRFL);
                oRole4GovConSchema = MiscFunctions.updateSchemaWithNewRel(oRole4GovConSchema,oNewRel,oRFL_x);
                oRFL.updated[role4GovConSchema_slug] = oRole4GovConSchema;
            }
        }
        if (dependenciesPlacement=="lower") {
            // need to do anything here? create role7 array, and set up a one-to-one correspondence
            // between aRole6 and aRole7 nodes??
        }
    }
}

oRFL.updated[node_slug] = oNode;

            } catch (err) {
                console.log("javaScriptError with action a-e-ma-enumeration_manageRole5; err: "+err+"; node_slug: "+node_slug);
            }
            break;
        case "a-e-u1n-enumerates":

            if (verboseConsole) { console.log("case a-e-u1n-enumerates") }
            try {
console.log("a-e-u1n-enumerates; nF_slug: "+nF_slug+"; nT_slug: "+nT_slug)
var oRVD = oNodeFrom.enumerationData.restrictsValueData;
var oNRM = oNodeFrom.enumerationData.nodeRolesManagement;

var aRole0 = oNRM.role0_slugs;

var targetPropertyType = oRVD.targetPropertyType;
var propertyPath = oRVD.propertyPath;
var uniquePropertyKey = oRVD.uniquePropertyKey;
var withSubsets = oRVD.withSubsets;
var withDependencies = oRVD.withDependencies;
var dependenciesPlacement = oRVD.dependenciesPlacement;
// assume provideNullOption == true unless stated otherwise
var provideNullOption = true;
if (oRVD.hasOwnProperty("provideNullOption")) {
    provideNullOption = oRVD.provideNullOption;
}
var aAdditionalOptions = [];
if (oRVD.hasOwnProperty("additionalOptions")) {
    aAdditionalOptions = oRVD.additionalOptions;
}

oNodeTo.propertyData.type = targetPropertyType;
console.log("a-e-u1n-enumerates; targetPropertyType: "+targetPropertyType+"; propertyPath: "+propertyPath+"; uniquePropertyKey: "+uniquePropertyKey)
var arr2 = ConceptGraphFunctions.translateSlugsToUniquePropertyValues(aRole0,propertyPath,uniquePropertyKey);
if (provideNullOption==true) {
    if (!arr2.includes(null)) {
        arr2.push(null)
    }
}
for (var x=0;x<aAdditionalOptions.length;x++) {
    var nextOption = aAdditionalOptions[x];
    if (!arr2.includes(nextOption)) {
        arr2.push(nextOption)
    }
}
if (targetPropertyType=="string") {
    oNodeTo.propertyData.enum = arr2;
}
if (targetPropertyType=="array") {
    oNodeTo.propertyData.items = {};
    oNodeTo.propertyData.items.enum = arr2;
}
oNodeTo.propertyData.includeDependencies = withDependencies;
if (withDependencies==true) {
    oNodeTo.propertyData.dependencySlugs = aRole0;
    oNodeTo.propertyData.dependencyPlacement = dependenciesPlacement;
}

// update JSONSchema with requisite definitions
// console.log("a-e-u1n-enumerates; oNodeTo: "+JSON.stringify(oNodeTo,null,4))
var governingConcept_slug = oNodeTo.propertyData.metaData.governingConcept.slug;
// console.log("a-e-u1n-enumerates; governingConcept_slug: "+governingConcept_slug)
var oGoverningConcept = NeuroCoreFunctions.fetchNewestRawFile(governingConcept_slug,oRFL)
var jsonSchema_slug = oGoverningConcept.conceptData.nodes.JSONSchema.slug;
var oJSONSchema = NeuroCoreFunctions.fetchNewestRawFile(jsonSchema_slug,oRFL)
for (var s=0;s < aRole0.length;s++) {
    var nextRole0_slug = aRole0[s];
    console.log("a-e-u1n-enumerates; nextRole0_slug: "+nextRole0_slug)
    var [nextDefinitionKey,oNextDefinition] = NeuroCoreFunctions.fetchMainDefinitionInfoFromWordType(nextRole0_slug,oRFL);
    console.log("a-e-u1n-enumerates; nextDefinitionKey: "+nextDefinitionKey)
    if (nextDefinitionKey != "_error_") {
        oJSONSchema.definitions[nextDefinitionKey]= oNextDefinition;
    }
}
oRFL.updated[jsonSchema_slug] = oJSONSchema;

oRFL.updated[nT_slug] = oNodeTo;

            } catch (err) {
                console.log("javaScriptError with action a-e-u1n-enumerates; err: "+err+"; node_slug: "+node_slug);
            }
            break;

        default:
            // code
            break;
    }

    var executeChanges = jQuery("#executeChangesSelector option:selected").val()

    var aNews = Object.keys(oRFL.new);
    // console.log("actionSlug: "+actionSlug+"; number of new words: "+aNews.length)
    var addToQueue = false;
    for (var x=0;x<aNews.length;x++) {
        addToQueue = true;
        var nextNew_slug = aNews[x];
        var oWord_new = oRFL.new[nextNew_slug]

        var newUniqueIdentifier = actionSlug + "_" + nextNew_slug + "_" + x + "_" + nc2CycleNumber + "_" + singlePatternNumber + "_" + singleActionNumber;

        oWindowNeuroCore.engine.oRecordOfUpdates[newUniqueIdentifier] = {}
        oWindowNeuroCore.engine.oRecordOfUpdates[newUniqueIdentifier].old = {};
        oWindowNeuroCore.engine.oRecordOfUpdates[newUniqueIdentifier].new = oWord_new;
        var infoHTML = "";
        infoHTML += "<div>";
            infoHTML += newUniqueIdentifier + "<br>";
            infoHTML += " <div class='doSomethingButton_small ";
            if (whichNeuroCore=="NeuroCore2") {
                infoHTML += "makeNewWordButton' ";
            }
            if (whichNeuroCore=="NeuroCore3") {
                infoHTML += "makeNewNeuroCore3WordButton' ";
            }
            infoHTML += " style='background-color:white;' ";
            infoHTML += " data-newuniqueidentifier='"+newUniqueIdentifier+"' ";
            infoHTML += " data-slug='"+nextNew_slug+"' ";
            infoHTML += " >";
            infoHTML += "CREATE";
            infoHTML += "</div>";
            infoHTML += "<div data-updateuniqueidentifier='"+newUniqueIdentifier+"' class='newUniqueIdentifier' style='display:inline-block;border-left:5px;' >";
            infoHTML += actionSlug+": creating new word "+nextNew_slug;
            infoHTML += "</div>";
        infoHTML += "</div>";
        // console.log(infoHTML)
        if (whichNeuroCore=="NeuroCore2") {
            jQuery("#neuroCore2ActivityLogContainer").append(infoHTML)
        }
        if (whichNeuroCore=="NeuroCore3") {
            jQuery("#neuroCore3ActivityLogContainer").append(infoHTML)
        }
        // console.log("executeChanges? "+executeChanges)
        if (executeChanges=="yes") {

            if (whichNeuroCore=="NeuroCore2") {
                await MiscFunctions.createOrUpdateWordInAllTables(oWord_new)
            }
            if (whichNeuroCore=="NeuroCore3") {
                await ConceptGraphInMfsFunctions.createOrUpdateWordInMFS(oWord_new)
            }
            oRFL.current[nextNew_slug] = oWord_new;
            oRFL.new[nextNew_slug] = oWord_new;
            oRFL.new[nextNew_slug] = oWord_new;
            oRFL.current[nextNew_slug] = oWord_new;
            // for now, currentConceptGraphSqlID will always be the same for active CG and neuroCore.subject CG
            if (oWindowNeuroCore.subject.currentConceptGraphSqlID==window.currentConceptGraphSqlID) {
                if (whichNeuroCore=="NeuroCore2") {
                    window.lookupWordBySlug[nextUpdate_slug] = oWord_updated;
                }
                if (whichNeuroCore=="NeuroCore3") {
                    // ? nothing to be done here since the ipfs-equivalent of window.lookupWordBySlug is a function which reads the MFS which gets updated in analagous fashion to when SQL gets updated
                }
            }
            oWindowNeuroCore.engine.changesMadeYetThisSupercycle = true;
            oWindowNeuroCore.engine.changesMadeYetThisCycle = true;
            addPatternsToQueue(actionSlug);
        }
        var oAuxiliaryPatternData = {"searchMethod":"default"};
        // addPatternsWithAuxiliaryPatternDataToQueue(actionSlug,oAuxiliaryPatternData);
    }

    var aUpdates = Object.keys(oRFL.updated);
    // console.log("actionSlug: "+actionSlug+"; number of updated words: "+aUpdates.length)
    for (var x=0;x<aUpdates.length;x++) {
        var nextUpdate_slug = aUpdates[x];
        // console.log("nextUpdate_slug: "+nextUpdate_slug);
        var oWord_current = MiscFunctions.cloneObj(oRFL.current[nextUpdate_slug]);
        var oWord_updated = MiscFunctions.cloneObj(oRFL.updated[nextUpdate_slug]);

        var sWord_current = JSON.stringify(oWord_current,null,4)
        var sWord_updated = JSON.stringify(oWord_updated,null,4)

        // console.log("sWord_current: "+sWord_current)
        // console.log("sWord_updated: "+sWord_updated)

        var updateUniqueIdentifier = actionSlug + "_" + nextUpdate_slug + "_" + x + "_" + nc2CycleNumber + "_" + singlePatternNumber + "_" + singleActionNumber;

        if (sWord_current != sWord_updated) {
            // console.log("actionSlug: "+actionSlug)
            addToQueue = true;

            var lastUpdate = Date.now();
            // console.log("lastUpdate: "+lastUpdate)
            oWord_updated.metaData.lastUpdate = lastUpdate;
            var sWord_updated = JSON.stringify(oWord_updated,null,4);

            oWindowNeuroCore.engine.oRecordOfUpdates[updateUniqueIdentifier] = {}
            oWindowNeuroCore.engine.oRecordOfUpdates[updateUniqueIdentifier].old = MiscFunctions.cloneObj(oWord_current);
            oWindowNeuroCore.engine.oRecordOfUpdates[updateUniqueIdentifier].new = MiscFunctions.cloneObj(oWord_updated);
            var infoHTML = "";
            infoHTML += "<div>";
                infoHTML += updateUniqueIdentifier + "<br>";
                infoHTML += "<div class='doSomethingButton_small ";
                if (whichNeuroCore=="NeuroCore2") {
                    infoHTML += "updateWordButton' ";
                }
                if (whichNeuroCore=="NeuroCore3") {
                    infoHTML += "updateNeuroCore3WordButton' ";
                }
                infoHTML += " data-updateuniqueidentifier='"+updateUniqueIdentifier+"' ";
                infoHTML += " data-slug='"+nextUpdate_slug+"' ";
                infoHTML += " >";
                infoHTML += "UPDATE";
                infoHTML += "</div>";
                infoHTML += "<div data-updateuniqueidentifier='"+updateUniqueIdentifier+"' ";
                if (whichNeuroCore=="NeuroCore2") {
                    infoHTML += " class='actionUpdatingWord' ";
                }
                if (whichNeuroCore=="NeuroCore3") {
                    infoHTML += " class='actionNeuroCore3UpdatingWord' ";
                }
                infoHTML += " style='display:inline-block;border-left:5px;' >";
                infoHTML += actionSlug+": updating word "+nextUpdate_slug;
                infoHTML += "</div>";
            infoHTML += "</div>";
            // console.log(infoHTML)
            if (whichNeuroCore=="NeuroCore2") {
                jQuery("#neuroCore2ActivityLogContainer").append(infoHTML)
            }
            if (whichNeuroCore=="NeuroCore3") {
                jQuery("#neuroCore3ActivityLogContainer").append(infoHTML)
            }
            // console.log("executeChanges? "+executeChanges)
            if (executeChanges=="yes") {
                if (whichNeuroCore=="NeuroCore2") {
                    await MiscFunctions.createOrUpdateWordInAllTables(oWord_updated)
                }
                if (whichNeuroCore=="NeuroCore3") {
                    await ConceptGraphInMfsFunctions.createOrUpdateWordInMFS(oWord_updated)
                }
                oRFL.current[nextUpdate_slug] = oWord_updated;
                oRFL.current[nextUpdate_slug] = oWord_updated;
                if (oWindowNeuroCore.subject.currentConceptGraphSqlID==window.currentConceptGraphSqlID) {
                    if (whichNeuroCore=="NeuroCore2") {
                        window.lookupWordBySlug[nextUpdate_slug] = oWord_updated;
                    }
                    if (whichNeuroCore=="NeuroCore3") {
                        // ? nothing to be done here since the ipfs-equivalent of window.lookupWordBySlug is a function which reads the MFS which gets updated in analagous fashion to when SQL gets updated
                    }
                }
                oWindowNeuroCore.engine.changesMadeYetThisSupercycle = true;
                oWindowNeuroCore.engine.changesMadeYetThisCycle = true;
                addPatternsToQueue(actionSlug);
            }
        }
    }
    if (addToQueue) {
        // console.log("addToQueue auxAssistedQueue: "+auxAssistedQueue)
        // auxAssistedQueue == true means that the array aAuxiliaryPatternData has been populated and is used in creation of the pattern queue
        // actionData.secondaryPatterns is no longer utilized, bc javascript contains all relevant info regarding secondary patterns
        if (auxAssistedQueue) {
            console.log("addToQueue aAuxiliaryPatternData.length: "+aAuxiliaryPatternData.length)
            console.log("calling addAuxiliaryPatternDataToQueue; whichNeuroCore: "+whichNeuroCore)
            addAuxiliaryPatternDataToQueue(aAuxiliaryPatternData,whichNeuroCore);
            // 29 July 2022:
            // step 1: get rid of plexNeuroCore; replace with window.neoroCore.engine ... (done, I think; need to delete plexNeuroCore and window.plexNeuroCore declaration to see if nothing breaks)
            // (also get rid of other variables; see TASKS under notesOnDOMVariables )
            // step 2: move the following block of code to addAuxiliaryPatternDataToQueue (done)
            // step 3: allow patterns to trigger addAuxiliaryPatternDataToQueue (done)
            // specifically, allow P.r.s1n.jsonSchemaNeedsInitialProcessing to trigger s1r Pattern search with node_slug in the nodeTo position


        }
        // will gradually deprecate cases where auxAssistedQueue == false
        // Make user of actionData.secondaryPatterns
        // (via aPats = oWindowNeuroCore.engine.oPatternsTriggeredByAction[actionSlug];)
        if (!auxAssistedQueue) {
            var aPats = oWindowNeuroCore.engine.oPatternsTriggeredByAction[actionSlug];
            // console.log("aPats: "+JSON.stringify(aPats,null,4))
            for (var p=0;p<aPats.length;p++) {
                var nextPat_slug = aPats[p];
                // var oPat = MiscFunctions.cloneObj(oRFL.current[nextPat_slug]);
                // console.log("nextPat_slug: "+nextPat_slug)
                var oPat = MiscFunctions.cloneObj(oWindowNeuroCore.engine.oRFL.current[nextPat_slug]);
                var nextPat_patternName = oPat.patternData.name;
                // console.log("qwerty nextPat_slug: "+nextPat_slug+"; nextPat_patternName: "+nextPat_patternName)
                oAuxiliaryPatternData.patternName = nextPat_patternName;
                var oAPD = MiscFunctions.cloneObj(oAuxiliaryPatternData);
                if (!oWindowNeuroCore.engine.oPatternsWithAuxiliaryDataQueue.hasOwnProperty(nextPat_slug)) {
                    oWindowNeuroCore.engine.oPatternsWithAuxiliaryDataQueue[nextPat_slug] = [];
                }
                var isAPDP = isAPDPresent(nextPat_slug,oAPD,whichNeuroCore);
                // console.log("qwerty nextPat_slug: "+nextPat_slug+"; nextPat_patternName: "+nextPat_patternName+"; isAPDP: "+isAPDP)
                if (!isAPDP) {
                    oWindowNeuroCore.engine.oPatternsWithAuxiliaryDataQueue[nextPat_slug].push(oAPD)
                }
            }
        }
    }

    jQuery("#action_"+suffix).css("background-color","green")
    oRFL.updated = {};
    oRFL.new = {};
    return oRFL;
}

export const addAuxiliaryPatternDataToQueue = (aAuxiliaryPatternData,whichNeuroCore) => {
    // console.log("addAuxiliaryPatternDataToQueue; aAuxiliaryPatternData: "+JSON.stringify(aAuxiliaryPatternData,null,4))
    for (var z=0;z<aAuxiliaryPatternData.length;z++) {
        var oAPD = aAuxiliaryPatternData[z];
        // console.log("addToQueue oAPD: "+JSON.stringify(oAPD,null,4))
        var pattName = oAPD.patternName;
        console.log("addAuxiliaryPatternDataToQueue; whichNeuroCore: "+whichNeuroCore)
        if (whichNeuroCore=="NeuroCore2") {
            var patt_wSlug = window.neuroCore.engine.oMapActionSlugToWordSlug[pattName];
            if (!window.neuroCore.engine.oPatternsWithAuxiliaryDataQueue.hasOwnProperty(patt_wSlug)) {
                window.neuroCore.engine.oPatternsWithAuxiliaryDataQueue[patt_wSlug] = [];
            }
            var isAPDP = isAPDPresent(patt_wSlug,oAPD,whichNeuroCore);
            if (!isAPDP) {
                window.neuroCore.engine.oPatternsWithAuxiliaryDataQueue[patt_wSlug].push(oAPD)
            }
        }


        if (whichNeuroCore=="NeuroCore3") {
            var patt_wSlug = window.ipfs.neuroCore.engine.oMapActionSlugToWordSlug[pattName];
            if (!window.ipfs.neuroCore.engine.oPatternsWithAuxiliaryDataQueue.hasOwnProperty(patt_wSlug)) {
                window.ipfs.neuroCore.engine.oPatternsWithAuxiliaryDataQueue[patt_wSlug] = [];
            }
            var isAPDP = isAPDPresent(patt_wSlug,oAPD,whichNeuroCore);
            if (!isAPDP) {
                window.ipfs.neuroCore.engine.oPatternsWithAuxiliaryDataQueue[patt_wSlug].push(oAPD)
            }
        }

    }
    var qHTML = "";
    qHTML += "<div style='background-color:red;' >";
    qHTML += pattName;
    qHTML += "</div>";
    // console.log("addToQueue qHTML: "+qHTML)
    jQuery("#patterns_queue_container").append(qHTML)
}

// NEW METHOD 25 July 2022
// 30 July 2022: addPatternsWithAuxiliaryPatternDataToQueue being deprecated
/*
export const addPatternsWithAuxiliaryPatternDataToQueue = (actionSlug,oAuxiliaryPatternData) => {
    var action_wordSlug = window.neuroCore.engine.oMapPatternNameToWordSlug[actionSlug];
    var oAct = window.neuroCore.engine.oRFL.current[action_wordSlug];
    var sAuxiliaryPatternData = JSON.stringify(oAuxiliaryPatternData);
    if (oAct.actionData.hasOwnProperty("secondaryPatterns")) {
        // go through secondaryPatterns.sets
        var aSets = [];
        if (oAct.actionData.secondaryPatterns.hasOwnProperty("sets")) {
            aSets = oAct.actionData.secondaryPatterns.sets;
        }
        for (var s=0;s<aSets.length;s++) {
            var nextSet_slug = aSets[s];
            var oNextSet = window.neuroCore.engine.oRFL.current[nextSet_slug];
            // console.log("qwerty nextSet_slug: "+nextSet_slug)
            var aNextSet_patterns = oNextSet.globalDynamicData.specificInstances;
            for (var z=0;z<aNextSet_patterns.length;z++) {
                var nextPattern_wordSlug = aNextSet_patterns[z];

            }
        }

        // go through secondaryPatterns.individualPatterns
        var aIndividualPatterns = [];
        if (oAct.actionData.secondaryPatterns.hasOwnProperty("individualPatterns")) {
            aIndividualPatterns = oAct.actionData.secondaryPatterns.individualPatterns;
        }
        for (var s=0;s<aIndividualPatterns.length;s++) {
            var nextPattern_patternName = aIndividualPatterns[s];
            var nextPattern_wordSlug = window.neuroCore.engine.oMapActionSlugToWordSlug[nextPattern_patternName];
            var oNextPattern = window.neuroCore.engine.oRFL.current[nextPattern_wordSlug]
            var nextPattern_patternSlug = oNextPattern.patternData.slug;
        }
    }
}
*/
// OLD METHOD
const addPatternsToQueue = (actionSlug) => {
    var action_wordSlug = window.neuroCore.engine.oMapPatternNameToWordSlug[actionSlug];
    var oAct = window.neuroCore.engine.oRFL.current[action_wordSlug];
    var sAct = JSON.stringify(oAct,null,4)
    // console.log("qwerty; sAct: "+sAct)

    if (oAct.actionData.hasOwnProperty("secondaryPatterns")) {
        // go through secondaryPatterns.sets
        var aSets = [];
        if (oAct.actionData.secondaryPatterns.hasOwnProperty("sets")) {
            aSets = oAct.actionData.secondaryPatterns.sets;
        }
        for (var s=0;s<aSets.length;s++) {
            var nextSet_slug = aSets[s];
            var oNextSet = window.neuroCore.engine.oRFL.current[nextSet_slug];
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
            var nextPattern_wordSlug = window.neuroCore.engine.oMapActionSlugToWordSlug[nextPattern_patternName];
            jQuery("#patternCheckbox_"+nextPattern_wordSlug).prop("checked",true);
            // console.log("qwerty nextPattern_patternName: "+nextPattern_wordSlug)
        }
    }
}
