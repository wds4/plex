import * as MiscFunctions from '../../../functions/miscFunctions.js';
import * as ConceptGraphFunctions from '../../../functions/conceptGraphFunctions.js';
import { oAPD_s1r, oAPD_s1n, addAuxiliaryPatternDataToQueue } from '../../executeSingleAction.js';
const jQuery = require("jquery");
const Ajv = require('ajv');
const ajv = new Ajv({
    allErrors: true,
    useDefaults: true,
    strictDefault: true
});

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
// 27 Sep 2022:
// see at about line 147
// P.r.s1n.initialProcessing
// activation line is commented out - makes power nap go faster
// but unsure whether this will skip needed actions or not
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

export const checkSingleS1nPattern = async (node_slug,patternName) => {
    var oCheckSingleS1nPatternOutput = {};
    var isPatternPresent = false;
    console.log("checkSingleS1nPattern; patternName: "+patternName+"; node_slug: "+node_slug)
    // var patternName = oNextPattern.patternName;

    // var oNode = oRawFileLookup[node_slug];
    var oNode = window.neuroCore.subject.oRFL.current[node_slug];
    var oAuxiliaryData = {};
    oAuxiliaryData.node = node_slug;
    var oExtraAuxiliaryData = {};

    var aActionsToTrigger = [];
    var oActionsToTrigger = {};
    var useAActionsToTriggerData = false;
    var useOActionsToTriggerData = false;

    var oAuxiliaryPatternData = {"searchMethod":"default"};
    var aAuxiliaryPatternData = [];
    var auxAssistedQueue = false;

    switch (patternName) {
        // ought to be u1n, not c1n
        case "P.c.c1n.conceptWithTemplating": // triggers a-c-u1n-applytemplatingconstraints
            try {
if (oNode.hasOwnProperty("conceptData")) {
    if (oNode.conceptData.hasOwnProperty("templating")) {
        var oTemplatingData = oNode.conceptData.templating
        var templateCreationEnabled = oTemplatingData.templateCreationEnabled
        if (templateCreationEnabled) {
            isPatternPresent = true;
        }
    }
}
            } catch (err) {
                console.log("javaScriptError with pattern p_c_c1n_conceptWithTemplating; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        // m = BESPOKE ACTIONS - code in the back end for temporary things that need to be done
        case "P.m.s1n.word": // triggers a-m-u1n-01
            try {
                /*
                if (oNode.hasOwnProperty("enumerationData")) {
                    isPatternPresent = true;
                }
                */
            } catch (err) {
                console.log("javaScriptError with pattern p_m_s1n_word; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;

        case "P.m.s1n.needsInitialProcessing": // may deprecate? need m when making r ?
            try {
                if (oNode.hasOwnProperty("wordData")) {
                    if (oNode.hasOwnProperty("metaData")) {
                        if (oNode.metaData.hasOwnProperty("neuroCore")) {
                            if (oNode.metaData.neuroCore.initialProcessing == false) {
                                isPatternPresent = true;
                            }
                        }
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_m_s1n_word; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.a.s1n.validation":
            // This will probably be a resource intensive pattern to search! Make sure to call it sparingly!
            try {
                var aParentJSONSchemaSequence = oNode.globalDynamicData.valenceData.parentJSONSchemaSequence;
                console.log("P.a.s1n.validation; node_slug: "+node_slug+"; aParentJSONSchemaSequence.length: "+aParentJSONSchemaSequence.length)
                for (var a=0;a<aParentJSONSchemaSequence.length;a++) {
                    // ? look to see whether this has already been tested and passed; metaData.neuroCore.parentJSONSchemaValidations[nextPJSchema_slug]
                    // if not, then use ajv to test validation
                    var nextPJSchema_slug = aParentJSONSchemaSequence[a];
                    var oParent = window.neuroCore.subject.oRFL.current[nextPJSchema_slug];
                    delete oParent["$id"];
                    var validate = ajv.compile(oParent);
                    var valid = validate(oNode);
                    if (valid) {
                        console.log("Successful validation! child: "+node_slug+"; parent: "+nextPJSchema_slug)
                    }
                    if (!valid) {
                        console.log("Failure to validate! child: "+node_slug+"; parent: "+nextPJSchema_slug)
                        isPatternPresent = true;
                        // if failure, then set isPatternPresent = true; which will trigger A.a.u1n.validation for this node
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_c_c1n_conceptwithoutprimaryproperty; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;

        case "P.r.s1n.initialProcessing":
        // triggers a-r-u1n-01
        // OR
        // use this to screen all nodes for initialProcessing == false, then feed into wordType-specific pattern search
        // advantage: one pattern search can be used to trigger initialProcessing for any node
        // but nodeType-specific search criteria, which may change with time, can be delegated to other patterns, not this one
            try {
                if (oNode.hasOwnProperty("wordData")) {
                    if (oNode.hasOwnProperty("metaData")) {
                        if (oNode.metaData.hasOwnProperty("neuroCore")) {
                            if (oNode.metaData.neuroCore.processedAsSpecificInstance == false) {
                                auxAssistedQueue = true;

                                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                                oAuxiliaryPatternData.patternName = "P.a.s1r.05";
                                oAuxiliaryPatternData.domains.aNodesFrom = [ node_slug ];
                                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                                oAuxiliaryPatternData.patternName = "P.a.s1r.06";
                                oAuxiliaryPatternData.domains.aNodesFrom = [ node_slug ];
                                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                                // need to do P.a.s1n.validation AFTER populating parentJSONSchemaSequence
                                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1n);
                                oAuxiliaryPatternData.patternName = "P.a.s1n.validation";
                                oAuxiliaryPatternData.domains.aNodes = [ node_slug ];
                                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                                addAuxiliaryPatternDataToQueue(aAuxiliaryPatternData)
                                // set aAuxiliaryPatternData to empty in case this node also triggers more Pattern searches (below)
                                aAuxiliaryPatternData = [];
                            }
                            if (oNode.metaData.neuroCore.initialProcessing == false) {
                                /////////////////////////////////////////////////////////////
                                /////////////////////////////////////////////////////////////
                                // 27 Sep 2022:
                                // not sure whether I need to uncomment this line or not!
                                // Is it necessary if a-r-u1n-01 (see line 420) does not (currently) do anything ???
                                // a-r-u1n-01 takes a long time and currently is set to do no action!
                                // isPatternPresent = true;
                                /////////////////////////////////////////////////////////////
                                /////////////////////////////////////////////////////////////

                                if (oNode.hasOwnProperty("enumerationData")) {
                                    auxAssistedQueue = true;
                                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1n);
                                    oAuxiliaryPatternData.patternName = "P.r.s1n.enumerationNeedsInitialProcessing";
                                    oAuxiliaryPatternData.domains.aNodes = [ node_slug ];
                                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                                    addAuxiliaryPatternDataToQueue(aAuxiliaryPatternData)
                                    console.log("P.r.s1n.initialProcessing; node_slug: "+node_slug+"; calling P.r.s1n.enumerationNeedsInitialProcessing")
                                }

                                if (oNode.hasOwnProperty("JSONSchemaData")) {
                                    auxAssistedQueue = true;
                                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                                    oAuxiliaryPatternData.patternName = "P.a.s1r.01";
                                    oAuxiliaryPatternData.domains.aNodesFrom = [ node_slug ];
                                    oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1n);
                                    oAuxiliaryPatternData.patternName = "P.r.s1n.jsonSchemaNeedsInitialProcessing";
                                    oAuxiliaryPatternData.domains.aNodes = [ node_slug ];
                                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                                    addAuxiliaryPatternDataToQueue(aAuxiliaryPatternData)
                                    console.log("P.r.s1n.initialProcessing; node_slug: "+node_slug+"; calling P.r.s1n.jsonSchemaNeedsInitialProcessing")
                                }

                                if (oNode.hasOwnProperty("propertyData")) {
                                    auxAssistedQueue = true;
                                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1n);
                                    oAuxiliaryPatternData.patternName = "P.r.s1n.propertyNeedsInitialProcessing";
                                    oAuxiliaryPatternData.domains.aNodes = [ node_slug ];
                                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                                    addAuxiliaryPatternDataToQueue(aAuxiliaryPatternData)
                                    console.log("P.r.s1n.initialProcessing; node_slug: "+node_slug+"; calling P.r.s1n.propertyNeedsInitialProcessing")
                                }

                                if (oNode.hasOwnProperty("propertyData")) {
                                    if (oNode.propertyData.metaData.types.includes("primaryProperty")) {
                                        auxAssistedQueue = true;
                                        oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1n);
                                        oAuxiliaryPatternData.patternName = "P.r.s1n.primaryPropertyNeedsInitialProcessing";
                                        oAuxiliaryPatternData.domains.aNodes = [ node_slug ];
                                        aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                                        addAuxiliaryPatternDataToQueue(aAuxiliaryPatternData)
                                        console.log("P.r.s1n.initialProcessing; node_slug: "+node_slug+"; calling P.r.s1n.primaryPropertyNeedsInitialProcessing")
                                    }
                                }

                                if (oNode.hasOwnProperty("conceptData")) {
                                    auxAssistedQueue = true;
                                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1n);
                                    oAuxiliaryPatternData.patternName = "P.r.s1n.conceptNeedsInitialProcessing";
                                    oAuxiliaryPatternData.domains.aNodes = [ node_slug ];
                                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                                    addAuxiliaryPatternDataToQueue(aAuxiliaryPatternData)
                                    console.log("P.r.s1n.initialProcessing; node_slug: "+node_slug+"; calling P.r.s1n.conceptNeedsInitialProcessing")
                                }
                                /*
                                if (oNode.hasOwnProperty("wordTypeData")) {
                                    auxAssistedQueue = true;
                                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1n);
                                    oAuxiliaryPatternData.patternName = "P.r.s1n.wordTypeNeedsInitialProcessing";
                                    oAuxiliaryPatternData.domains.aNodes = [ node_slug ];
                                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                                    addAuxiliaryPatternDataToQueue(aAuxiliaryPatternData)
                                    console.log("P.r.s1n.initialProcessing; node_slug: "+node_slug+"; calling P.r.s1n.wordTypeNeedsInitialProcessing")
                                }
                                */
                            }
                        }
                    }
                }
                console.log("P.r.s1n.initialProcessing; node_slug: "+node_slug+"; isPatternPresent: "+isPatternPresent)
            } catch (err) {
                console.log("javaScriptError with pattern p_r_s1n_initialprocessing; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;

        case "P.r.s1n.enumerationNeedsInitialProcessing":
            try {
                if (oNode.hasOwnProperty("enumerationData")) {
                    if (oNode.hasOwnProperty("metaData")) {
                        if (oNode.metaData.hasOwnProperty("neuroCore")) {
                            if (oNode.metaData.neuroCore.initialProcessing == false) {
                                isPatternPresent = true;

                                auxAssistedQueue = true;

                                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1n);
                                oAuxiliaryPatternData.patternName = "P.e.s1n.enumeration";
                                oAuxiliaryPatternData.domains.aNodes = [ node_slug ];
                                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                                // also add P.e.s1n.enumeration_withSubsets? check first to see if withSubsets == true
                                if (oNode.enumerationData.restrictsValueData.withSubsets == true) {
                                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1n);
                                    oAuxiliaryPatternData.patternName = "P.e.s1n.enumeration_withSubsets";
                                    oAuxiliaryPatternData.domains.aNodes = [ node_slug ];
                                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)
                                }

                                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                                oAuxiliaryPatternData.patternName = "P.e.s1r.enumerates";
                                oAuxiliaryPatternData.domains.aNodesFrom = [ node_slug ];
                                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                                addAuxiliaryPatternDataToQueue(aAuxiliaryPatternData)

                            }
                        }
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_r_s1n_enumerationNeedsInitialProcessing; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;

        case "P.r.s1n.jsonSchemaNeedsInitialProcessing": // triggers a-r-...

            try {
                if (oNode.hasOwnProperty("JSONSchemaData")) {
                    if (oNode.hasOwnProperty("metaData")) {
                        if (oNode.metaData.hasOwnProperty("neuroCore")) {
                            if (oNode.metaData.neuroCore.initialProcessing == false) {
                                isPatternPresent = true;
                                // currently this does not trigger any actions

                                // want this s1n pattern to trigger search for s1r pattern
                                // need to establish ability for one pattern to trigger search for another pattern without doing an action in between
                                auxAssistedQueue = true;
                                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                                oAuxiliaryPatternData.patternName = "P.b.s1r.12";
                                oAuxiliaryPatternData.domains.aNodesFrom = "_ANY_";
                                oAuxiliaryPatternData.domains.aNodesTo = [ node_slug ];
                                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                                addAuxiliaryPatternDataToQueue(aAuxiliaryPatternData)

                            }
                        }
                    }
                }
                console.log("P.r.s1n.jsonSchemaNeedsInitialProcessing; node_slug: "+node_slug+"; isPatternPresent: "+isPatternPresent)
            } catch (err) {
                console.log("javaScriptError with pattern p_r_s1n_propertyneedsinitialprocessing; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;

        case "P.r.s1n.propertyNeedsInitialProcessing": // triggers a-r-...
            try {
                if (oNode.hasOwnProperty("propertyData")) {
                    if (oNode.hasOwnProperty("metaData")) {
                        if (oNode.metaData.hasOwnProperty("neuroCore")) {
                            if (oNode.metaData.neuroCore.initialProcessing == false) {
                                isPatternPresent = true;

                                auxAssistedQueue = true;
                                oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                                oAuxiliaryPatternData.patternName = "P.b.s1r.03";
                                oAuxiliaryPatternData.domains.aNodesFrom = [ node_slug ];
                                oAuxiliaryPatternData.domains.aNodesTo = "_ANY_" ;
                                aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                                addAuxiliaryPatternDataToQueue(aAuxiliaryPatternData)

                            }
                        }
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_r_s1n_propertyneedsinitialprocessing; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;

        case "P.r.s1n.primaryPropertyNeedsInitialProcessing": // triggers a-r-...
            try {
                if (oNode.hasOwnProperty("propertyData")) {
                    if (oNode.propertyData.metaData.types.includes("primaryProperty")) {
                        if (oNode.hasOwnProperty("metaData")) {
                            if (oNode.metaData.hasOwnProperty("neuroCore")) {
                                if (oNode.metaData.neuroCore.initialProcessing == false) {
                                    isPatternPresent = true;

                                    auxAssistedQueue = true;
                                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                                    oAuxiliaryPatternData.patternName = "P.b.s1r.03";
                                    oAuxiliaryPatternData.domains.aNodesFrom = "_ANY_";
                                    oAuxiliaryPatternData.domains.aNodesTo = [ node_slug ];
                                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                                    oAuxiliaryPatternData = MiscFunctions.cloneObj(oAPD_s1r);
                                    oAuxiliaryPatternData.patternName = "P.b.s1r.12";
                                    oAuxiliaryPatternData.domains.aNodesFrom = [ node_slug ];
                                    oAuxiliaryPatternData.domains.aNodesTo = "_ANY_";
                                    aAuxiliaryPatternData.push(oAuxiliaryPatternData)

                                    addAuxiliaryPatternDataToQueue(aAuxiliaryPatternData)
                                }
                            }
                        }
                    }
                }
                console.log("P.r.s1n.primaryPropertyNeedsInitialProcessing; node_slug: "+node_slug+"; isPatternPresent: "+isPatternPresent)
            } catch (err) {
                console.log("javaScriptError with pattern p_r_s1n_propertyneedsinitialprocessing; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;

        case "P.r.s1n.conceptNeedsInitialProcessing":
        // maybe multiple triggers: action on this concept and on main schema, property schema, superset, etc
        // one action to check whether to set initialProcessing to true (ie complete)
            try {
                if (oNode.hasOwnProperty("conceptData")) {
                    if (oNode.hasOwnProperty("metaData")) {
                        if (oNode.metaData.hasOwnProperty("neuroCore")) {
                            if (oNode.metaData.neuroCore.initialProcessing == false) {
                                isPatternPresent = true;
                                aActionsToTrigger = [];
                                useAActionsToTriggerData = true;

                                // Future: if !nextSlug, check to see whether an appropriate word already exists but for some reason has not been
                                // recorded in this oConcept (oNode)
                                var nextSlug = oNode.conceptData.nodes.concept.slug;
                                if (!nextSlug) {
                                    aActionsToTrigger.push("a-c-c1r-connectconcep");
                                    aActionsToTrigger.push("a-c-u1n-updateconcept");
                                }

                                var nextSlug = oNode.conceptData.nodes.JSONSchema.slug;
                                if (!nextSlug) {
                                    aActionsToTrigger.push("a-c-c1n-createjsonschema");
                                }

                                nextSlug = oNode.conceptData.nodes.wordType.slug;
                                if (!nextSlug) {
                                    aActionsToTrigger.push("a-c-c1n-createwordtype");
                                }

                                nextSlug = oNode.conceptData.nodes.schema.slug;
                                if (!nextSlug) {
                                    aActionsToTrigger.push("a-c-c1n-createschema");
                                }

                                nextSlug = oNode.conceptData.nodes.primaryProperty.slug;
                                if (!nextSlug) {
                                    aActionsToTrigger.push("a-c-c1n-createprimaryproperty");
                                }

                                nextSlug = oNode.conceptData.nodes.properties.slug;
                                if (!nextSlug) {
                                    aActionsToTrigger.push("a-c-c1n-createproperties");
                                }

                                nextSlug = oNode.conceptData.nodes.superset.slug;
                                if (!nextSlug) {
                                    aActionsToTrigger.push("a-c-c1n-createsuperset");
                                }

                                nextSlug = oNode.conceptData.nodes.propertySchema.slug;
                                if (!nextSlug) {
                                    aActionsToTrigger.push("a-c-c1n-createpropertyschema");
                                }

                                var initialConceptProcessingComplete = false;
                                if (aActionsToTrigger.length == 0) {
                                    initialConceptProcessingComplete = true;
                                    aActionsToTrigger.push("a-r-u1n-updateinitialprocessing");
                                }

                            }
                        }
                    }
                }
                console.log("P.r.s1n.conceptNeedsInitialProcessing; node_slug: "+node_slug+"; isPatternPresent: "+isPatternPresent)
            } catch (err) {
                console.log("javaScriptError with pattern p_r_s1n_conceptneedsinitialprocessing; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
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
    // 28 July 2022: oExtraAuxiliaryData is used with rV patterns only and may be deprecated
    // For now, a pattern is either present or not; if present, next step is to trigger
    // each action in the array patternData.actions. The auxiliary information consists of node_slug (if s1n)
    // or nF_slug, nT_slug (if s1r). IOW, each action that is triggered gets fed the same information.
    // (1) Desire to trigger multiple actions, but to feed different information to different actions.
    // e.g.: node_slug1 to action1, but node_slug2 to action2.
    // (2) Also desire to trigger subset of actions, not all of them.
    // e.g.: if conceptData needs to create JSONSchema and superset but does not need to create wordType or any of the others.
    // Solution to (2): oActionsToTrigger which is an array of actions that should be triggered.
    // Solution to (1): oActionsToTrigger which contains auxiliary information about each given action
    // e.g. oCheckSingleS1nPatternOutput.oActionsToTrigger["a-c-c1n-createjsonschema"].actionSpecificPieceOfInfo = foo
    // For now (28 July 2022), I am using aActionsToTrigger but have not yet implemented oActionsToTrigger, which will be just an empty object for now {} .
    oCheckSingleS1nPatternOutput.aActionsToTrigger = aActionsToTrigger
    oCheckSingleS1nPatternOutput.oActionsToTrigger = oActionsToTrigger
    oCheckSingleS1nPatternOutput.useAActionsToTriggerData = useAActionsToTriggerData;
    oCheckSingleS1nPatternOutput.useOActionsToTriggerData = useOActionsToTriggerData; // currently always false; may use in future

    // console.log("checkSingleS1nPattern; node_slug: "+node_slug+"; oCheckSingleS1nPatternOutput.isPatternPresent: "+oCheckSingleS1nPatternOutput.isPatternPresent)
    oCheckSingleS1nPatternOutput.oAuxiliaryData = oAuxiliaryData;

    return oCheckSingleS1nPatternOutput;
}
