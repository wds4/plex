import * as MiscFunctions from '../../../lib/miscFunctions.js';
import sendAsync from '../../../renderer';
const jQuery = require("jquery");

// look for user-entered rel: (nF) - map1ToN - (nT)
// ???? OR (nF) - isADescriptorOf - (nT) ????
export const generateInitialPatternList = (words_in_obj) => {
    console.log("generateInitialPatternList map1ToN")
    var output_obj = {};
    output_obj.patternInfo = {};
    output_obj.patternInfo.description = "(nF) - map1ToN - (nT); nF and nT are both concepts";
    output_obj.patternInfo.action = {};
    output_obj.patternInfo.action.description = "create rel: (nF:set or superset) - hasBeenMapped1ToN - (nT:set or superset) and place in schemaFor[nF]";
    output_obj.numPatterns = {};
    output_obj.numPatterns.total = 0;
    output_obj.numPatterns.actionable = 0;
    output_obj.numPatterns.notActionable = 0;
    output_obj.numPatterns.error = 0;
    output_obj.numPatterns.dunnoYetIfActionable = 0;
    output_obj.rawRelationshipsList = [];
    output_obj.patternsList = [];

    var templatePattern_obj = {};

    templatePattern_obj.actionable = null; // true, false, or null (=not yet checked)
    templatePattern_obj.completed = null; // true, false, or null (=not yet checked)
    templatePattern_obj.error = null; // true, false, or null
    templatePattern_obj.nextAction = null; // true, false, or null

    templatePattern_obj.nodesToAdd_obj = {}
    templatePattern_obj.nodesToAdd_obj.allNodesCompleted = null;
    templatePattern_obj.nodesToAdd_obj.nodeFrom = {};
    templatePattern_obj.nodesToAdd_obj.nodeFrom.present = null;
    // templatePattern_obj.nodesToAdd_obj.spinoffSet = {};
    templatePattern_obj.nodesToAdd_obj.nodeTo = {};
    templatePattern_obj.nodesToAdd_obj.nodeTo.present = null;
    // supersets not created for canBeSubdividedInto but not for map1ToN; this could be amended in the future
    // This is because canBeSubdividedInto produces the option to includeDependencies but map1ToN does not (for now)
    // Perhaps in future: if includeDependencies is selected, then create supersets if not already done (i.e. start process of turning targets into new concepts)
    // but if includeDependencies is not selected, then do not create supersets.
    // templatePattern_obj.nodesToAdd_obj.supersets = {};
    templatePattern_obj.nodesToAdd_obj.propertyWithArray = {};
    templatePattern_obj.nodesToAdd_obj.propertyWithArray.present = null;
    templatePattern_obj.nodesToAdd_obj.enumeration = {};
    templatePattern_obj.nodesToAdd_obj.enumeration.present = null;

    // templatePattern_obj.relationshipToAdd = {} // going to deprecate
    // templatePattern_obj.schemaToAddRelationshipTo = ""; // going to deprecate

    templatePattern_obj.relationshipsToAdd_obj = {}
    templatePattern_obj.relationshipsToAdd_obj.allRelsCompleted = null;
    templatePattern_obj.relationshipsToAdd_obj.enumerates = {}
    templatePattern_obj.relationshipsToAdd_obj.hasBeenMapped1ToN = {}
    templatePattern_obj.relationshipsToAdd_obj.subsetOf = {}
    templatePattern_obj.relationshipsToAdd_obj.addPropertyValue = {}
    templatePattern_obj.relationshipsToAdd_obj.populatesArray = {}
    templatePattern_obj.relationshipsToAdd_obj.addToConceptGraphProperties = {}


    for (const [nextWord_slug, nextWord_rF_obj] of Object.entries(words_in_obj)) {
        var nextWord_wordTypes_arr = nextWord_rF_obj.wordData.wordTypes;
        if (jQuery.inArray("schema",nextWord_wordTypes_arr) > -1) {
            var nextWord_rels_arr = nextWord_rF_obj.schemaData.relationships;
            var numRels = nextWord_rels_arr.length;
            for (var r=0;r<numRels;r++) {
                var nextRel_obj = nextWord_rels_arr[r];
                var nextRel_str = JSON.stringify(nextRel_obj,null,4);
                var nextRel_nF_slug = nextRel_obj.nodeFrom.slug;
                var nextRel_nT_slug = nextRel_obj.nodeTo.slug;
                var nextRel_rT_slug = nextRel_obj.relationshipType.slug;

                var nF_concept_rF_obj = words_in_obj[nextRel_nF_slug];
                var nT_concept_rF_obj = words_in_obj[nextRel_nT_slug];

                if (nextRel_rT_slug=="map1ToN") {
                    var enticingRel_map1ToN_obj = MiscFunctions.cloneObj(nextRel_obj);
                    console.log("schema: "+nextWord_slug+"; nextRel_str: "+nextRel_str);

                    var nF_schema_slug = "";
                    var nF_propertySchema_slug = "";
                    var nF_primaryProperty_slug = "";
                    var nT_schema_slug = "";
                    if (nF_concept_rF_obj.hasOwnProperty("conceptData")) {
                        nF_schema_slug = nF_concept_rF_obj.conceptData.nodes.schema.slug;
                        nF_propertySchema_slug = nF_concept_rF_obj.conceptData.nodes.propertySchema.slug;
                        nF_primaryProperty_slug = nF_concept_rF_obj.conceptData.nodes.primaryProperty.slug;
                    } else {
                        console.log("ERROR! nextRel_nF_slug: "+nextRel_nF_slug+" should have property: conceptData, but does not ")
                    }
                    if (nT_concept_rF_obj.hasOwnProperty("conceptData")) {
                        nT_schema_slug = nT_concept_rF_obj.conceptData.nodes.schema.slug;
                    } else {
                        console.log("ERROR! nextRel_nT_slug: "+nextRel_nT_slug+" should have property: conceptData, but does not ")
                    }


                    output_obj.rawRelationshipsList.push(MiscFunctions.cloneObj(nextRel_obj))

                    // Each single relationship can have multiple patterns, one for each element of
                    // nextRel_obj.relationshipType.map1ToNData.setMappings
                    // if map1ToNData does not exist, assume one relationship such that
                    // nextRel_obj.relationshipType.map1ToNData.setMappings[0].setFrom = (superset of nF)
                    // nextRel_obj.relationshipType.map1ToNData.setMappings[0].setTo = (superset of nT)

                    // If map1ToNData is absent, create it prior to the next processing step.
                    if (!nextRel_obj.relationshipType.hasOwnProperty("map1ToNData")) {
                        nextRel_obj.relationshipType.map1ToNData = {}
                        nextRel_obj.relationshipType.map1ToNData.setMappings = []
                        var nextSetMapping_obj = {}
                        nextSetMapping_obj.setFrom = nF_concept_rF_obj.conceptData.nodes.superset.slug;
                        nextSetMapping_obj.setTo = nT_concept_rF_obj.conceptData.nodes.superset.slug;
                        nextSetMapping_obj.enumerations = [];
                        nextSetMapping_obj.includeDependencies = false;
                        nextSetMapping_obj.property = "slug"; // Needto figure out where to put the option to change this!
                        nextSetMapping_obj.enumeratedPropertyWithArray = null;
                        nextRel_obj.relationshipType.map1ToNData.setMappings.push(nextSetMapping_obj)
                    }

                    // Determine the number of patterns.
                    var numSetMappings = nextRel_obj.relationshipType.map1ToNData.setMappings.length;
                    for (var m=0;m<numSetMappings;m++) {
                        var nextSetMapping_obj = nextRel_obj.relationshipType.map1ToNData.setMappings[m];
                        output_obj.numPatterns.total++;
                        output_obj.numPatterns.dunnoYetIfActionable++;
                        var nextPattern_obj = MiscFunctions.cloneObj(templatePattern_obj);

                        /////////////////////////// NODES //////////////////////////


                        ///////// NODES: nodeFrom
                        nextPattern_obj.nodesToAdd_obj.nodeFrom.belongInSchema = nF_schema_slug;
                        nextPattern_obj.nodesToAdd_obj.nodeFrom.wordType = "set";
                        nextPattern_obj.nodesToAdd_obj.nodeFrom.slug = nextSetMapping_obj.setFrom;
                        nextPattern_obj.nodesToAdd_obj.nodeFrom.ipns = null;
                        nextPattern_obj.nodesToAdd_obj.nodeFrom.present = null;
                        if (words_in_obj.hasOwnProperty(nextSetMapping_obj.setFrom)) {
                              nextPattern_obj.nodesToAdd_obj.nodeFrom.ipns = words_in_obj[nextSetMapping_obj.setFrom].metaData.ipns;
                              nextPattern_obj.nodesToAdd_obj.nodeFrom.present = true;
                        }


                        ///////// NODES: nodeTo
                        nextPattern_obj.nodesToAdd_obj.nodeTo.belongInSchema = nT_schema_slug;
                        nextPattern_obj.nodesToAdd_obj.nodeTo.wordType = "set";
                        nextPattern_obj.nodesToAdd_obj.nodeTo.slug = nextSetMapping_obj.setTo;
                        nextPattern_obj.nodesToAdd_obj.nodeTo.ipns = null;
                        nextPattern_obj.nodesToAdd_obj.nodeTo.present = null;
                        if (words_in_obj.hasOwnProperty(nextSetMapping_obj.setTo)) {
                              nextPattern_obj.nodesToAdd_obj.nodeTo.ipns = words_in_obj[nextSetMapping_obj.setTo].metaData.ipns;
                              nextPattern_obj.nodesToAdd_obj.nodeTo.present = true;
                        } else {
                            nextPattern_obj.nodesToAdd_obj.nodeTo.present = false;
                        }

                        ///////// NODES: supersets
                        // done for canBeSubdividedInto but not for map1ToN

                        ///////// NODES: enumeration
                        nextPattern_obj.nodesToAdd_obj.enumeration.belongsInSchema = nT_schema_slug;
                        nextPattern_obj.nodesToAdd_obj.enumeration.wordType = "enumeration";
                        nextPattern_obj.nodesToAdd_obj.enumeration.slugBase = "enumeration_from_"+nextSetMapping_obj.setTo;
                        nextPattern_obj.nodesToAdd_obj.enumeration.title = "Enumeration from "+nextSetMapping_obj.setTo;
                        nextPattern_obj.nodesToAdd_obj.enumeration.name = "enumeration from "+nextSetMapping_obj.setTo;
                        nextPattern_obj.nodesToAdd_obj.enumeration.stemsFrom_setSlug = nextSetMapping_obj.setTo;
                        nextPattern_obj.nodesToAdd_obj.enumeration.stemsFrom_conceptSlug = nextRel_obj.nodeTo.slug;
                        nextPattern_obj.nodesToAdd_obj.enumeration.property = "choose one";
                        if (nextSetMapping_obj.hasOwnProperty("property")) {
                            nextPattern_obj.nodesToAdd_obj.enumeration.property = nextSetMapping_obj.property;
                        }
                        nextPattern_obj.nodesToAdd_obj.enumeration.includeDependencies = null;
                        if (nextSetMapping_obj.hasOwnProperty("includeDependencies")) {
                            if (nextSetMapping_obj.includeDependencies==true) {
                                nextPattern_obj.nodesToAdd_obj.enumeration.includeDependencies = true;
                            }
                            if (nextSetMapping_obj.includeDependencies==false) {
                                nextPattern_obj.nodesToAdd_obj.enumeration.includeDependencies = false;
                            }
                        }
                        nextPattern_obj.nodesToAdd_obj.enumeration.present = null;
                        var enticedEnumerations_arr = MiscFunctions.fetchEnticedEnumerations(words_in_obj,enticingRel_map1ToN_obj,m);
                        if (enticedEnumerations_arr.length > 0) {
                            nextPattern_obj.nodesToAdd_obj.enumeration.present = true;
                        } else {
                            nextPattern_obj.nodesToAdd_obj.enumeration.present = false;
                        }
                        nextPattern_obj.nodesToAdd_obj.enumeration.alreadyExisting = enticedEnumerations_arr;

                        nextPattern_obj.nodesToAdd_obj.allNodesCompleted = (
                            nextPattern_obj.nodesToAdd_obj.nodeFrom.present
                            && nextPattern_obj.nodesToAdd_obj.nodeTo.present
                            // && nextPattern_obj.nodesToAdd_obj.supersets.allPresent
                            && nextPattern_obj.nodesToAdd_obj.enumeration.present
                        )

                        ///////// NODES: property -- this is the target of (enumeration) -- populatesArray -- (property)
                        nextPattern_obj.nodesToAdd_obj.propertyWithArray.belongInSchema = nT_schema_slug;
                        nextPattern_obj.nodesToAdd_obj.propertyWithArray.wordType = "property";
                        nextPattern_obj.nodesToAdd_obj.propertyWithArray.slug = null;
                        nextPattern_obj.nodesToAdd_obj.enumeration.slugBase = "property_from_"+nextSetMapping_obj.setTo;
                        nextPattern_obj.nodesToAdd_obj.enumeration.title = "Property from "+nextSetMapping_obj.setTo;
                        nextPattern_obj.nodesToAdd_obj.enumeration.name = "property from "+nextSetMapping_obj.setTo;
                        if (nextSetMapping_obj.hasOwnProperty("enumeratedPropertyWithArray")) {
                            nextPattern_obj.nodesToAdd_obj.propertyWithArray.slug = nextSetMapping_obj.enumeratedPropertyWithArray;
                        }
                        nextPattern_obj.nodesToAdd_obj.propertyWithArray.ipns = null;
                        nextPattern_obj.nodesToAdd_obj.propertyWithArray.present = null;

                        /////////////////////////// RELATIONSHIPS //////////////////////////
                        ///////// RELATIONSHIPS: enumerates
                        nextPattern_obj.relationshipsToAdd_obj.enumerates.targetSchema = nT_schema_slug;
                        nextPattern_obj.relationshipsToAdd_obj.enumerates.present = null;
                        var relToAdd_enumerates_obj = MiscFunctions.blankRel_obj();
                        if (nextSetMapping_obj.setTo) {
                            relToAdd_enumerates_obj.relationshipType.slug = "enumerates";
                            relToAdd_enumerates_obj.nodeFrom.slug = nextSetMapping_obj.setTo;
                            if (nextPattern_obj.nodesToAdd_obj.enumeration.alreadyExisting.length > 0) {
                                relToAdd_enumerates_obj.nodeTo.slug = nextPattern_obj.nodesToAdd_obj.enumeration.alreadyExisting[0];
                            } else {
                                relToAdd_enumerates_obj.nodeTo.slug = nextPattern_obj.nodesToAdd_obj.enumeration.slugBase;
                            }
                        }
                        nextPattern_obj.relationshipsToAdd_obj.enumerates.relationship = relToAdd_enumerates_obj;
                        var isRelPresent_obj = MiscFunctions.fetchFirstRelIfExists(words_in_obj,relToAdd_enumerates_obj);
                        if (isRelPresent_obj) {
                            nextPattern_obj.relationshipsToAdd_obj.enumerates.present = true;
                        } else {
                            nextPattern_obj.relationshipsToAdd_obj.enumerates.present = false;
                        }

                        ///////// RELATIONSHIPS: hasBeenMapped1ToN
                        nextPattern_obj.relationshipsToAdd_obj.hasBeenMapped1ToN.targetSchema = nF_schema_slug;
                        nextPattern_obj.relationshipsToAdd_obj.hasBeenMapped1ToN.present = null;
                        var relToAdd_hasBeenMapped1ToN_obj = MiscFunctions.blankRel_obj();
                        // if (nextSetMapping_obj.setFromSpinoff) {
                            relToAdd_hasBeenMapped1ToN_obj.relationshipType.slug = "hasBeenMapped1ToN";
                            relToAdd_hasBeenMapped1ToN_obj.nodeFrom.slug = nextSetMapping_obj.setFrom;
                            relToAdd_hasBeenMapped1ToN_obj.nodeTo.slug = nextSetMapping_obj.setTo;
                        // }
                        nextPattern_obj.relationshipsToAdd_obj.hasBeenMapped1ToN.relationship = relToAdd_hasBeenMapped1ToN_obj
                        var isRelPresent_obj = MiscFunctions.fetchFirstRelIfExists(words_in_obj,relToAdd_hasBeenMapped1ToN_obj);
                        if (isRelPresent_obj) {
                            nextPattern_obj.relationshipsToAdd_obj.hasBeenMapped1ToN.present = true;
                        } else {
                            nextPattern_obj.relationshipsToAdd_obj.hasBeenMapped1ToN.present = false;
                        }

                        ///////// RELATIONSHIPS: populatesArray
                        nextPattern_obj.relationshipsToAdd_obj.populatesArray.targetSchema = nF_schema_slug;
                        nextPattern_obj.relationshipsToAdd_obj.populatesArray.present = null;
                        var relToAdd_populatesArray_obj = MiscFunctions.blankRel_obj();
                        // if (nextSetMapping_obj.setFromSpinoff) {
                            relToAdd_populatesArray_obj.relationshipType.slug = "populatesArray";
                            relToAdd_populatesArray_obj.nodeFrom.slug = null;
                            if (nextPattern_obj.nodesToAdd_obj.enumeration.alreadyExisting.length > 0) {
                                relToAdd_populatesArray_obj.nodeFrom.slug = nextPattern_obj.nodesToAdd_obj.enumeration.alreadyExisting[0];
                            } else {
                                relToAdd_populatesArray_obj.nodeFrom.slug = nextPattern_obj.nodesToAdd_obj.enumeration.slugBase;
                            }
                            relToAdd_populatesArray_obj.nodeTo.slug = null;
                        // }
                        nextPattern_obj.relationshipsToAdd_obj.populatesArray.relationship = relToAdd_populatesArray_obj
                        var isRelPresent_obj = MiscFunctions.fetchFirstRelIfExists(words_in_obj,relToAdd_populatesArray_obj);
                        if (isRelPresent_obj) {
                            nextPattern_obj.relationshipsToAdd_obj.populatesArray.present = true;
                        } else {
                            nextPattern_obj.relationshipsToAdd_obj.populatesArray.present = false;
                        }

                        ///////// RELATIONSHIPS: subsetOf
                        nextPattern_obj.relationshipsToAdd_obj.subsetOf.allPresent = null;
                        nextPattern_obj.relationshipsToAdd_obj.subsetOf.relationships = [];

                        ///////// RELATIONSHIPS: addPropertyValue
                        nextPattern_obj.relationshipsToAdd_obj.addPropertyValue.allPresent = null;
                        nextPattern_obj.relationshipsToAdd_obj.addPropertyValue.relationships = [];
                            var addPropertyValue_nextRel = [];
                            // title
                            addPropertyValue_nextRel[0] = {};
                            addPropertyValue_nextRel[0].field = "Property For ";
                            addPropertyValue_nextRel[0].slug = "property_ycjxr1";
                            // description
                            addPropertyValue_nextRel[1] = {};
                            addPropertyValue_nextRel[1].field = "This is the property for ";
                            addPropertyValue_nextRel[1].slug = "property_uvr9qn";
                            // name
                            addPropertyValue_nextRel[2] = {};
                            addPropertyValue_nextRel[2].field = "property for ";
                            addPropertyValue_nextRel[2].slug = "property_8vlbc5";
                            var numAPVRels = addPropertyValue_nextRel.length;
                            ///////// RELATIONSHIPS: addPropertyValue: title -- slug: property_ycjxr1
                            for (var i=0;i<numAPVRels;i++) {
                                var nextRel_addPropertyValue_obj = {};
                                nextRel_addPropertyValue_obj.targetSchema = nT_schema_slug;
                                nextRel_addPropertyValue_obj.present = null;
                                var relToAdd_nextField_addPropertyValue_obj = MiscFunctions.blankRel_obj();
                                relToAdd_nextField_addPropertyValue_obj.relationshipType.slug = "addPropertyValue";
                                relToAdd_nextField_addPropertyValue_obj.addPropertyValueData = {};
                                relToAdd_nextField_addPropertyValue_obj.addPropertyValueData.field = addPropertyValue_nextRel[i].field;
                                relToAdd_nextField_addPropertyValue_obj.nodeFrom.slug = addPropertyValue_nextRel[i].slug;
                                relToAdd_nextField_addPropertyValue_obj.nodeTo.slug = null;
                                if (nextPattern_obj.nodesToAdd_obj.propertyWithArray.slug != null) {
                                    relToAdd_nextField_addPropertyValue_obj.nodeTo.slug = nextPattern_obj.nodesToAdd_obj.propertyWithArray.slug
                                }
                            }

                            ///////// RELATIONSHIPS: addPropertyValue: name
                            ///////// RELATIONSHIPS: addPropertyValue: description

                        ///////// RELATIONSHIPS: isTheSupersetFor
                        // done for canBeSubdividedInto but not for map1ToN

                        ///////// RELATIONSHIPS: addToConceptGraphProperties
                        // need to plan how from here on out is different for map1ToN than for canBeSubdividedInto
                        nextPattern_obj.relationshipsToAdd_obj.addToConceptGraphProperties.targetSchema = nF_propertySchema_slug;
                        nextPattern_obj.relationshipsToAdd_obj.addToConceptGraphProperties.present = null;
                        var relToAdd_addToConceptGraphProperties_obj = MiscFunctions.blankRel_obj();

                        nextPattern_obj.relationshipsToAdd_obj.allRelsCompleted = (
                            nextPattern_obj.relationshipsToAdd_obj.enumerates.present
                            && nextPattern_obj.relationshipsToAdd_obj.hasBeenMapped1ToN.present
                            && nextPattern_obj.relationshipsToAdd_obj.subsetOf.allPresent
                            // && nextPattern_obj.relationshipsToAdd_obj.isTheSupersetFor.allPresent
                            && nextPattern_obj.relationshipsToAdd_obj.addToConceptGraphProperties.present
                        );

                        /*
                        var relToAdd_obj = MiscFunctions.blankRel_obj();
                        relToAdd_obj.relationshipType.slug = "isSubdividedBy";
                        relToAdd_obj.nodeFrom.slug = nextSetMapping_obj.setFrom;
                        relToAdd_obj.nodeTo.slug = nextSetMapping_obj.setTo;
                        */
                        // nextPattern_obj.relationshipToAdd = relToAdd_obj;
                        // nextPattern_obj.schemaToAddRelationshipTo = nF_schema_slug;
                        nextPattern_obj.actionable = false;
                        nextPattern_obj.nextAction = "none";

                        if (nextPattern_obj.relationshipsToAdd_obj.allRelsCompleted == false) {
                            nextPattern_obj.nextAction = "addRels";
                            nextPattern_obj.actionable = true;
                        }
                        if (nextPattern_obj.nodesToAdd_obj.allNodesCompleted == false) {
                            nextPattern_obj.nextAction = "addNodes";
                            nextPattern_obj.actionable = true;
                        }


                        output_obj.patternsList.push(nextPattern_obj)
                    }
                }
            }
        }
    }
    return output_obj;
}

export const determineStatusOfActionPatterns = (words_in_obj,reports_map1ToN_in_obj) => {
    console.log("flagActionsAsActionable map1ToN")
    var reports_map1ToN_out_obj = MiscFunctions.cloneObj(reports_map1ToN_in_obj);

    var currentRelationships_arr = [];
    for (const [nextWord_slug, nextWord_rF_obj] of Object.entries(words_in_obj)) {
        var nextWord_wordTypes_arr = nextWord_rF_obj.wordData.wordTypes;
        if (jQuery.inArray("schema",nextWord_wordTypes_arr) > -1) {
            var nextWord_rels_arr = nextWord_rF_obj.schemaData.relationships;
            var numRels = nextWord_rels_arr.length;
            for (var r=0;r<numRels;r++) {
                var nextRel_obj = nextWord_rels_arr[r];
                if (!MiscFunctions.isRelObjInArrayOfObj(nextRel_obj,currentRelationships_arr)) {
                    currentRelationships_arr.push(nextRel_obj);
                }
            }
        }
    }

    var actionable_tot = 0;
    var completed_tot = 0;
    var patternsList_arr = reports_map1ToN_out_obj.patternsList;
    var numPatterns = patternsList_arr.length;
    for (var p=0;p<numPatterns;p++) {
        var nextPattern_obj = patternsList_arr[p];
        /*
        var nextRelToAdd_obj = nextPattern_obj.relationshipToAdd;
        now check to see if nextRelToAdd_obj is in currentRelationships_arr using isRelObjInArrayOfObj = (rel_obj,rels_arr)
        var isActionComplete = MiscFunctions.isRelObjInArrayOfObj(nextRelToAdd_obj,currentRelationships_arr)
        nextPattern_obj.actionable = !isActionComplete;
        nextPattern_obj.completed = isActionComplete;
        if (isActionComplete) {
            completed_tot++;
        } else {
            actionable_tot++;
        }
        */
    }
    reports_map1ToN_out_obj.numPatterns.actionable = actionable_tot;
    reports_map1ToN_out_obj.numPatterns.notActionable = completed_tot;
    reports_map1ToN_out_obj.numPatterns.dunnoYetIfActionable = 0;

    return reports_map1ToN_out_obj;
}

export const makeChanges = async (words_in_obj,reports_obj) => {
    var words_out_obj = MiscFunctions.cloneObj(words_in_obj);
    var numPatterns = reports_obj.map1ToN.patternsList.length;
    for (var p=0;p<numPatterns;p++) {
        var nextPattern_obj = reports_obj.map1ToN.patternsList[p]
        if (nextPattern_obj.actionable) {
            console.log("actionable: map1ToN pattern: "+p)
            if (nextPattern_obj.nextAction=="addNodes") {
                var nextAction = "addNodes";
                /*
                // nodeFrom
                if (!nextPattern_obj.nodesToAdd_obj.nodeFrom.present) {
                    var newWordType = nextPattern_obj.nodesToAdd_obj.nodeFrom.wordType;
                    var schema_slug = nextPattern_obj.nodesToAdd_obj.nodeFrom.belongInSchema;
                    var newWord_slug = nextPattern_obj.nodesToAdd_obj.nodeFrom.slug;
                    var newWord_obj = await MiscFunctions.createNewWordByTemplate(newWordType)
                    newWord_obj.wordData.slug = newWord_slug;
                    words_out_obj[newWord_slug] = newWord_obj;
                }

                // nodeTo
                if (!nextPattern_obj.nodesToAdd_obj.nodeTo.present) {
                    var newWordType = nextPattern_obj.nodesToAdd_obj.nodeTo.wordType;
                    var schema_slug = nextPattern_obj.nodesToAdd_obj.nodeTo.belongInSchema;
                    var newWord_slug = nextPattern_obj.nodesToAdd_obj.nodeTo.slug;
                    var newWord_obj = await MiscFunctions.createNewWordByTemplate(newWordType)
                    newWord_obj.wordData.slug = newWord_slug;
                    words_out_obj[newWord_slug] = newWord_obj;
                }
                */

                // enumeration
                if (!nextPattern_obj.nodesToAdd_obj.enumeration.present) {
                    var newWordType = nextPattern_obj.nodesToAdd_obj.enumeration.wordType;
                    var schema_slug = nextPattern_obj.nodesToAdd_obj.enumeration.belongInSchema;
                    var newWord_slug = nextPattern_obj.nodesToAdd_obj.enumeration.slugBase;
                    var newWord_title = nextPattern_obj.nodesToAdd_obj.enumeration.title;
                    var newWord_name = nextPattern_obj.nodesToAdd_obj.enumeration.name;
                    var newWord_obj = await MiscFunctions.createNewWordByTemplate(newWordType)
                    newWord_obj.wordData.slug = newWord_slug;
                    newWord_obj.wordData.title = newWord_title;
                    newWord_obj.wordData.name = newWord_name;
                    newWord_obj.enumerationData.slug = newWord_slug;
                    newWord_obj.enumerationData.title = newWord_title;
                    newWord_obj.enumerationData.name = newWord_name;
                    newWord_obj.enumerationData.source.concept = nextPattern_obj.nodesToAdd_obj.enumeration.stemsFrom_conceptSlug;
                    newWord_obj.enumerationData.source.set = nextPattern_obj.nodesToAdd_obj.nodeTo.slug;
                    newWord_obj.enumerationData.style.property = nextPattern_obj.nodesToAdd_obj.enumeration.property
                    newWord_obj.enumerationData.style.includeDependencies = nextPattern_obj.nodesToAdd_obj.enumeration.includeDependencies;
                    // newWord_obj.enumerationData.style.includeAdditionalFields = null;
                    words_out_obj[newWord_slug] = newWord_obj;
                }
            }
            if (nextPattern_obj.nextAction=="addRels") {
                var nextAction = "addRels";
                /*
                // enumerates
                if (!nextPattern_obj.relationshipsToAdd_obj.enumerates.present) {
                    nextAction += " add enumerates ";
                    var schema_slug = nextPattern_obj.relationshipsToAdd_obj.enumerates.targetSchema;
                    var schema_rF_obj = words_out_obj[schema_slug];
                    var relToAdd_obj = nextPattern_obj.relationshipsToAdd_obj.enumerates.relationship;
                    // console.log("updateSchemaWithNewRel - schema_slug: "+schema_slug)
                    words_out_obj[schema_slug] = MiscFunctions.updateSchemaWithNewRel(schema_rF_obj,relToAdd_obj,words_out_obj);
                }
                // isSubdividedBy
                if (!nextPattern_obj.relationshipsToAdd_obj.isSubdividedBy.present) {
                    nextAction += " add isSubdividedBy ";
                    var schema_slug = nextPattern_obj.relationshipsToAdd_obj.isSubdividedBy.targetSchema;
                    var schema_rF_obj = words_out_obj[schema_slug];
                    var relToAdd_obj = nextPattern_obj.relationshipsToAdd_obj.isSubdividedBy.relationship;
                    words_out_obj[schema_slug] = MiscFunctions.updateSchemaWithNewRel(schema_rF_obj,relToAdd_obj,words_out_obj);
                }
                // subsetOf
                if (!nextPattern_obj.relationshipsToAdd_obj.subsetOf.allPresent) {
                    nextAction += " add subsetOf ";
                    var subsetOf_rels_arr = nextPattern_obj.relationshipsToAdd_obj.subsetOf.relationships;
                    var numSubsetOfRels = subsetOf_rels_arr.length;
                    console.log("numSubsetOfRels: "+numSubsetOfRels)
                    for (var r=0;r<numSubsetOfRels;r++) {
                        var subsetOf_nextRel_obj = subsetOf_rels_arr[r];
                        if (!subsetOf_nextRel_obj.present) {
                            var schema_slug = subsetOf_nextRel_obj.targetSchema;
                            console.log("subsetOf schema_slug: "+schema_slug)
                            var schema_rF_obj = words_out_obj[schema_slug];
                            var relToAdd_obj = subsetOf_nextRel_obj.relationship;
                            words_out_obj[schema_slug] = MiscFunctions.updateSchemaWithNewRel(schema_rF_obj,relToAdd_obj,words_out_obj);
                        }
                    }
                }
                // addToConceptGraphProperties
                if (!nextPattern_obj.relationshipsToAdd_obj.addToConceptGraphProperties.present) {
                    nextAction += " add addToConceptGraphProperties ";
                    var schema_slug = nextPattern_obj.relationshipsToAdd_obj.addToConceptGraphProperties.targetSchema;
                    var schema_rF_obj = words_out_obj[schema_slug];
                    var relToAdd_obj = nextPattern_obj.relationshipsToAdd_obj.addToConceptGraphProperties.relationship;
                    words_out_obj[schema_slug] = MiscFunctions.updateSchemaWithNewRel(schema_rF_obj,relToAdd_obj,words_out_obj);
                }
                */
            }
        }
    }
    return words_out_obj;
}
