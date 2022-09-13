import * as MiscFunctions from '../../../functions/miscFunctions.js';
import * as ConceptGraphFunctions from '../../../functions/conceptGraphFunctions.js';
const jQuery = require("jquery"); 

export const checkSingleS1nPattern = async (node_slug,patternName,oRawFileLookup) => {
    var oCheckSingleS1nPatternOutput = {};
    var isPatternPresent = false;
    console.log("checkSingleS1nPattern; patternName: "+patternName+"; node_slug: "+node_slug)
    // var patternName = oNextPattern.patternName;

    var oNode = oRawFileLookup[node_slug];
    var oAuxiliaryData = {};
    oAuxiliaryData.node = node_slug;
    var oExtraAuxiliaryData = {};

    switch (patternName) {
        case "P.rV11.s1n.00":
            try {
                var oExtraAuxiliaryData = {};
                if (oNode.globalDynamicData.hasOwnProperty("nodePatternCodes")) {
                    var aNodePatternCodes = oNode.globalDynamicData.nodePatternCodes;
                    for (var p=0;p < aNodePatternCodes.length;p++) {
                        var nextPatternCode = aNodePatternCodes[p];
                        if (nextPatternCode.includes("P.rV11.s1n.00")) {
                            isPatternPresent = true;
                            oExtraAuxiliaryData.nextPatternCode = nextPatternCode;
                        }
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_rv11_s1n_00; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.a.u1n.word":
            try {
                if (oNode.hasOwnProperty("wordData")) {
                    if (oNode.wordData.hasOwnProperty("slug")) {
                        isPatternPresent = true;
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_a_u1n_word; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.a.umn.superset":
            try {
                if (oNode.hasOwnProperty("supersetData")) {
                    isPatternPresent = true;
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_a_umn_superset; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.b.s1n.JSONSchema":
            try {
                if (oNode.hasOwnProperty("JSONSchemaData")) {
                    isPatternPresent = true;
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_b_s1n_jsonschema; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.b.s1n.primaryProperty":
            try {
                if (oNode.hasOwnProperty("propertyData")) {
                    var aPropertyTypes = oNode.propertyData.metaData.types;
                    if (jQuery.inArray("primaryProperty",aPropertyTypes) > -1) {
                        isPatternPresent = true;
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_b_s1n_primaryproperty; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.c.c1n.JSONSchema":
            try {
                if (oNode.hasOwnProperty("JSONSchemaData")) {
                    isPatternPresent = true;
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_c_c1n_jsonschema; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.c.c1n.concept":
            try {
                if (oNode.hasOwnProperty("conceptData")) {
                    isPatternPresent = true;
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_c_c1n_concept; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.c.c1n.conceptWithoutConcept":
            try {
                if (oNode.hasOwnProperty("conceptData")) {
                    var conceptSlug = oNode.conceptData.nodes.concept.slug;
                    if (!conceptSlug) {
                        isPatternPresent = true;
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_c_c1n_conceptwithoutconcept; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.c.c1n.conceptWithoutPrimaryProperty":
            try {
                if (oNode.hasOwnProperty("conceptData")) {
                    var primaryPropertySlug = oNode.conceptData.nodes.primaryProperty.slug;
                    if (!primaryPropertySlug) {
                        isPatternPresent = true;
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_c_c1n_conceptwithoutprimaryproperty; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.c.c1n.conceptWithoutPropertySchema":
            try {
                if (oNode.hasOwnProperty("conceptData")) {
                    var propertySchemaSlug = oNode.conceptData.nodes.propertySchema.slug;
                    if (!propertySchemaSlug) {
                        isPatternPresent = true;
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_c_c1n_conceptwithoutpropertyschema; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.c.c1n.conceptWithoutSchema":
            try {
                if (oNode.hasOwnProperty("conceptData")) {
                    var schemaSlug = oNode.conceptData.nodes.schema.slug;
                    if (!schemaSlug) {
                        isPatternPresent = true;
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_c_c1n_conceptwithoutschema; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.c.c1n.conceptWithoutSuperset":
            try {
                if (oNode.hasOwnProperty("conceptData")) {
                    var supersetSlug = oNode.conceptData.nodes.superset.slug;
                    if (!supersetSlug) {
                        isPatternPresent = true;
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_c_c1n_conceptwithoutsuperset; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.c.c1n.mainSchema":
            try {
                if (oNode.hasOwnProperty("schemaData")) {
                    if (oNode.schemaData.metaData.types.includes("conceptRelationships")) {
                        isPatternPresent = true;
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_c_c1n_mainschema; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.c.c1n.primaryProperty":
            try {
                if (oNode.hasOwnProperty("propertyData")) {
                    if (oNode.propertyData.metaData.types.includes("primaryProperty")) {
                        isPatternPresent = true;
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_c_c1n_primaryproperty; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.c.c1n.propertySchema":
            try {
                if (oNode.hasOwnProperty("schemaData")) {
                    if (oNode.schemaData.metaData.types.includes("propertySchema")) {
                        isPatternPresent = true;
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_c_c1n_propertyschema; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.c.c1n.superset":
            try {
                if (oNode.hasOwnProperty("supersetData")) {
                    isPatternPresent = true;
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_c_c1n_superset; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.c.c1n.wordType":
            try {
                if (oNode.hasOwnProperty("wordTypeData")) {
                    isPatternPresent = true;
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_c_c1n_wordtype; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.c.s1n.conceptWithoutJSONSchema":
            try {
                if (oNode.hasOwnProperty("conceptData")) {
                    var JSONSchemaSlug = oNode.conceptData.nodes.JSONSchema.slug;
                    if (!JSONSchemaSlug) {
                        isPatternPresent = true;
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_c_s1n_conceptwithoutjsonschema; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.c.s1n.conceptWithoutProperties":
            try {
                if (oNode.hasOwnProperty("conceptData")) {
                    var propertiesSlug = oNode.conceptData.nodes.properties.slug;
                    if (!propertiesSlug) {
                        isPatternPresent = true;
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_c_s1n_conceptwithoutproperties; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.c.s1n.conceptWithoutWordType":
            try {
                if (oNode.hasOwnProperty("conceptData")) {
                    var wordTypeSlug = oNode.conceptData.nodes.wordType.slug;
                    if (!wordTypeSlug) {
                        isPatternPresent = true;
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_c_s1n_conceptwithoutwordtype; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.rV00.s1n.00":
            try {
                var oExtraAuxiliaryData = {};
                if (oNode.globalDynamicData.hasOwnProperty("nodePatternCodes")) {
                    var aNodePatternCodes = oNode.globalDynamicData.nodePatternCodes;
                    for (var p=0;p < aNodePatternCodes.length;p++) {
                        var nextPatternCode = aNodePatternCodes[p];
                        if (nextPatternCode.includes("P.rV00.s1n.00")) {
                            isPatternPresent = true;
                            oExtraAuxiliaryData.nextPatternCode = nextPatternCode;
                        }
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_rv00_s1n_00; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.rV01.s1n.02":
            try {
                var oExtraAuxiliaryData = {};
                if (oNode.globalDynamicData.hasOwnProperty("nodePatternCodes")) {
                    var aNodePatternCodes = oNode.globalDynamicData.nodePatternCodes;
                    for (var p=0;p < aNodePatternCodes.length;p++) {
                        var nextPatternCode = aNodePatternCodes[p];
                        if (nextPatternCode.includes("P.rV01.s1n.02")) {
                            isPatternPresent = true;
                            oExtraAuxiliaryData.nextPatternCode = nextPatternCode;
                        }
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_rv01_s1n_02; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.rV10.s1n.00":
            try {
                var oExtraAuxiliaryData = {};
                if (oNode.globalDynamicData.hasOwnProperty("nodePatternCodes")) {
                    var aNodePatternCodes = oNode.globalDynamicData.nodePatternCodes;
                    for (var p=0;p < aNodePatternCodes.length;p++) {
                        var nextPatternCode = aNodePatternCodes[p];
                        if (nextPatternCode.includes("P.rV10.s1n.00")) {
                            isPatternPresent = true;
                            oExtraAuxiliaryData.nextPatternCode = nextPatternCode;
                        }
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_rv10_s1n_00; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.rV10.s1n.01":
            try {
                var oExtraAuxiliaryData = {};
                if (oNode.globalDynamicData.hasOwnProperty("nodePatternCodes")) {
                    var aNodePatternCodes = oNode.globalDynamicData.nodePatternCodes;
                    for (var p=0;p < aNodePatternCodes.length;p++) {
                        var nextPatternCode = aNodePatternCodes[p];
                        if (nextPatternCode.includes("P.rV10.s1n.01")) {
                            isPatternPresent = true;
                            oExtraAuxiliaryData.nextPatternCode = nextPatternCode;
                        }
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_rv10_s1n_01; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.rV10.s1n.04":
            try {
                var oExtraAuxiliaryData = {};
                if (oNode.globalDynamicData.hasOwnProperty("nodePatternCodes")) {
                    var aNodePatternCodes = oNode.globalDynamicData.nodePatternCodes;
                    for (var p=0;p < aNodePatternCodes.length;p++) {
                        var nextPatternCode = aNodePatternCodes[p];
                        if (nextPatternCode.includes("P.rV10.s1n.04")) {
                            isPatternPresent = true;
                            oExtraAuxiliaryData.nextPatternCode = nextPatternCode;
                        }
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_rv10_s1n_04; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.rV10.s1n.05":
            try {
                var oExtraAuxiliaryData = {};
                if (oNode.globalDynamicData.hasOwnProperty("nodePatternCodes")) {
                    var aNodePatternCodes = oNode.globalDynamicData.nodePatternCodes;
                    for (var p=0;p < aNodePatternCodes.length;p++) {
                        var nextPatternCode = aNodePatternCodes[p];
                        if (nextPatternCode.includes("P.rV10.s1n.05")) {
                            isPatternPresent = true;
                            oExtraAuxiliaryData.nextPatternCode = nextPatternCode;
                        }
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_rv10_s1n_05; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.rV11.s1n.01":
            try {
                var oExtraAuxiliaryData = {};
                if (oNode.globalDynamicData.hasOwnProperty("nodePatternCodes")) {
                    var aNodePatternCodes = oNode.globalDynamicData.nodePatternCodes;
                    for (var p=0;p < aNodePatternCodes.length;p++) {
                        var nextPatternCode = aNodePatternCodes[p];
                        if (nextPatternCode.includes("P.rV11.s1n.01")) {
                            isPatternPresent = true;
                            oExtraAuxiliaryData.nextPatternCode = nextPatternCode;
                        }
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_rv11_s1n_01; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.rV11.s1n.02":
            try {
                var oExtraAuxiliaryData = {};
                if (oNode.globalDynamicData.hasOwnProperty("nodePatternCodes")) {
                    var aNodePatternCodes = oNode.globalDynamicData.nodePatternCodes;
                    for (var p=0;p < aNodePatternCodes.length;p++) {
                        var nextPatternCode = aNodePatternCodes[p];
                        if (nextPatternCode.includes("P.rV11.s1n.02")) {
                            isPatternPresent = true;
                            oExtraAuxiliaryData.nextPatternCode = nextPatternCode;
                        }
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_rv11_s1n_02; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.rV11.s1n.04":
            try {
                var oExtraAuxiliaryData = {};
                if (oNode.globalDynamicData.hasOwnProperty("nodePatternCodes")) {
                    var aNodePatternCodes = oNode.globalDynamicData.nodePatternCodes;
                    for (var p=0;p < aNodePatternCodes.length;p++) {
                        var nextPatternCode = aNodePatternCodes[p];
                        if (nextPatternCode.includes("P.rV11.s1n.04")) {
                            isPatternPresent = true;
                            oExtraAuxiliaryData.nextPatternCode = nextPatternCode;
                        }
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_rv11_s1n_04; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.rV11.s1n.05":
            try {
                var oExtraAuxiliaryData = {};
                if (oNode.globalDynamicData.hasOwnProperty("nodePatternCodes")) {
                    var aNodePatternCodes = oNode.globalDynamicData.nodePatternCodes;
                    for (var p=0;p < aNodePatternCodes.length;p++) {
                        var nextPatternCode = aNodePatternCodes[p];
                        if (nextPatternCode.includes("P.rV11.s1n.05")) {
                            isPatternPresent = true;
                            oExtraAuxiliaryData.nextPatternCode = nextPatternCode;
                        }
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_rv11_s1n_05; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.e.s1n.enumeration":
            try {
                if (oNode.hasOwnProperty("enumerationData")) {
                    isPatternPresent = true;
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_e_s1n_enumeration; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.e.s1n.enumeration_withSubsets":
            try {
                if (oNode.hasOwnProperty("enumerationData")) {
                    if (oNode.enumerationData.hasOwnProperty("restrictsValueData")) {
                        if (oNode.enumerationData.restrictsValueData.withSubsets==true) {
                            isPatternPresent = true;
                        }
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_e_s1n_enumeration_withsubsets; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.e.s1n.enumeration_withDependencies_lower":
            try {
                if (oNode.hasOwnProperty("enumerationData")) {
                    if (oNode.enumerationData.hasOwnProperty("restrictsValueData")) {
                        if (oNode.enumerationData.restrictsValueData.withDependencies==true) {
                            if (oNode.enumerationData.restrictsValueData.dependenciesPlacement=="lower") {
                                isPatternPresent = true;
                            }
                        }
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_e_s1n_enumeration_withdependencies_lower; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.e.s1n.enumeration_withDependencies_upper":
            try {
                if (oNode.hasOwnProperty("enumerationData")) {
                    if (oNode.enumerationData.hasOwnProperty("restrictsValueData")) {
                        if (oNode.enumerationData.restrictsValueData.withDependencies==true) {
                            if (oNode.enumerationData.restrictsValueData.dependenciesPlacement=="upper") {
                                isPatternPresent = true;
                            }
                        }
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_e_s1n_enumeration_withdependencies_upper; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;

        default:
            // code
            break;
    }

    oCheckSingleS1nPatternOutput.isPatternPresent = isPatternPresent;
    oAuxiliaryData.oExtraAuxiliaryData = oExtraAuxiliaryData;

    // console.log("checkSingleS1nPattern; node_slug: "+node_slug+"; oCheckSingleS1nPatternOutput.isPatternPresent: "+oCheckSingleS1nPatternOutput.isPatternPresent)
    oCheckSingleS1nPatternOutput.oAuxiliaryData = oAuxiliaryData;
    return oCheckSingleS1nPatternOutput;
}
