import * as MiscFunctions from '../../../lib/miscFunctions.js';
import sendAsync from '../../../renderer';
const jQuery = require("jquery");

// look for user-entered rel: (nF) - canBeSubdividedInto - (nT)
// ???? OR (nF) - isADescriptorOf - (nT) ????
export const generateInitialPatternList = (words_in_obj) => {
    console.log("generateInitialPatternList canBeSubdividedInto")
    var output_obj = {};
    output_obj.patternInfo = {};
    output_obj.patternInfo.description = "(nF) - canBeSubdividedInto - (nT); nF and nT are both concepts";
    output_obj.patternInfo.action = {};
    output_obj.patternInfo.action.description = "create rel: (nF:set or superset) - isSubdividedBy - (nT:set or superset) and place in schemaFor[nF]";
    output_obj.numPatterns = {};
    output_obj.numPatterns.total = 0;
    output_obj.numPatterns.actionable = 0;
    output_obj.numPatterns.notActionable = 0;
    output_obj.numPatterns.error = 0;
    output_obj.numPatterns.dunnoYetIfActionable = 0;
    output_obj.rawRelationshipsList = [];
    output_obj.patternsList = [];

    var templatePattern_obj = {};
    // templatePattern_obj.nodesToAdd = []
    templatePattern_obj.actionable = null; // true, false, or null (=not yet checked)
    templatePattern_obj.completed = null; // true, false, or null (=not yet checked)
    templatePattern_obj.error = null; // true, false, or null
    templatePattern_obj.nextAction = null; // true, false, or null

    templatePattern_obj.nodesToAdd_obj = {}
    templatePattern_obj.nodesToAdd_obj.allNodesCompleted = null;
    templatePattern_obj.nodesToAdd_obj.nodeFrom = {};
    // templatePattern_obj.nodesToAdd_obj.spinoffSet = {};
    templatePattern_obj.nodesToAdd_obj.nodeTo = {};
    templatePattern_obj.nodesToAdd_obj.supersets = {};
    templatePattern_obj.nodesToAdd_obj.enumeration = {};
    // templatePattern_obj.nodesToAdd_obj.enumeration.slug = "";
    // templatePattern_obj.relationshipsToAdd = []
    templatePattern_obj.relationshipsToAdd_obj = {}
    templatePattern_obj.relationshipsToAdd_obj.allRelsCompleted = null;
    templatePattern_obj.relationshipsToAdd_obj.enumerates = {}
    templatePattern_obj.relationshipsToAdd_obj.isSubdividedBy = {}
    templatePattern_obj.relationshipsToAdd_obj.subsetOf = {}
    templatePattern_obj.relationshipsToAdd_obj.isTheSupersetFor = {}
    templatePattern_obj.relationshipsToAdd_obj.addToConceptGraphProperties = {}
    // templatePattern_obj.relationshipToAdd = {}
    // templatePattern_obj.schemaToAddRelationshipTo = "";
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

                if (nextRel_rT_slug=="canBeSubdividedInto") {
                    var enticingRel_canBeSubdividedInto_obj = MiscFunctions.cloneObj(nextRel_obj);
                    console.log("schema: "+nextWord_slug+"; nextRel_str: "+nextRel_str);

                    // console.log("nextRel_nF_slug: "+nextRel_nF_slug)
                    // console.log("nextRel_nT_slug: "+nextRel_nT_slug)
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
                    // nextRel_obj.relationshipType.canBeSubdividedIntoData.setMappings
                    // if canBeSubdividedIntoData does not exist, assume one relationship such that
                    // nextRel_obj.relationshipType.canBeSubdividedIntoData.setMappings[0].setFrom = (superset of nF)
                    // nextRel_obj.relationshipType.canBeSubdividedIntoData.setMappings[0].setTo = (superset of nT)

                    // If canBeSubdividedIntoData is absent, create it prior to the next processing step.
                    if (!nextRel_obj.relationshipType.hasOwnProperty("canBeSubdividedIntoData")) {
                        nextRel_obj.relationshipType.canBeSubdividedIntoData = {}
                        nextRel_obj.relationshipType.canBeSubdividedIntoData.setMappings = []
                        var nextSetMapping_obj = {}
                        nextSetMapping_obj.setFrom = nF_concept_rF_obj.conceptData.nodes.superset.slug;
                        nextSetMapping_obj.setTo = nT_concept_rF_obj.conceptData.nodes.superset.slug;
                        nextSetMapping_obj.enumerations = [];
                        nextSetMapping_obj.includeDependencies = false;
                        nextSetMapping_obj.property = "slug"; // Needto figure out where to put the option to change this!
                        nextRel_obj.relationshipType.canBeSubdividedIntoData.setMappings.push(nextSetMapping_obj)
                    }

                    // Determine the number of patterns.
                    var numSetMappings = nextRel_obj.relationshipType.canBeSubdividedIntoData.setMappings.length;
                    for (var m=0;m<numSetMappings;m++) {
                        var nextSetMapping_obj = nextRel_obj.relationshipType.canBeSubdividedIntoData.setMappings[m];
                        output_obj.numPatterns.total++;
                        output_obj.numPatterns.dunnoYetIfActionable++;
                        var nextPattern_obj = MiscFunctions.cloneObj(templatePattern_obj);

                        /////////////////////////// NODES //////////////////////////
                        // Note: might change nodesToAdd_obj to nodesThatMustBePresent_obj or nodes_obj or something like that
                        // because ??? some will be requires to exist, but not necessarily added  (???)

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

                        /*
                        nextPattern_obj.nodesToAdd_obj.spinoffSet.belongInSchema = nF_schema_slug;
                        nextPattern_obj.nodesToAdd_obj.spinoffSet.wordType = "set";
                        nextPattern_obj.nodesToAdd_obj.spinoffSet.slug = nextSetMapping_obj.setFromSpinoff;
                        nextPattern_obj.nodesToAdd_obj.spinoffSet.ipns = null;
                        nextPattern_obj.nodesToAdd_obj.spinoffSet.present = null;
                        if (words_in_obj.hasOwnProperty(nextSetMapping_obj.setFromSpinoff)) {
                              nextPattern_obj.nodesToAdd_obj.spinoffSet.ipns = words_in_obj[nextSetMapping_obj.setFromSpinoff].metaData.ipns;
                              nextPattern_obj.nodesToAdd_obj.spinoffSet.present = true;
                        } else {
                            nextPattern_obj.nodesToAdd_obj.spinoffSet.present = false;
                        }
                        */

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
                        nextPattern_obj.nodesToAdd_obj.supersets.belongInSchema = nT_schema_slug;
                        nextPattern_obj.nodesToAdd_obj.supersets.wordType = "superset";
                        nextPattern_obj.nodesToAdd_obj.supersets.parentSpecificInstances = [];
                        nextPattern_obj.nodesToAdd_obj.supersets.spawn = [];
                        if (words_in_obj.hasOwnProperty(nextSetMapping_obj.setTo)) {
                            nextPattern_obj.nodesToAdd_obj.supersets.parentSpecificInstances = words_in_obj[nextSetMapping_obj.setTo].globalDynamicData.specificInstances;
                        }
                        var numSpawnedSupersets = nextPattern_obj.nodesToAdd_obj.supersets.parentSpecificInstances.length;
                        var allSupersetsPresent = true;
                        for (var s=0;s<numSpawnedSupersets;s++) {
                            var nextSpawn_sI_slug = nextPattern_obj.nodesToAdd_obj.supersets.parentSpecificInstances[s];
                            var nextSpawn_obj = {};
                            var testRel_obj = MiscFunctions.blankRel_obj();
                            testRel_obj.relationshipType.slug = "isTheSupersetFor";
                            testRel_obj.nodeTo.slug = nextSpawn_sI_slug;
                            var fetchedRel_obj = MiscFunctions.fetchFirstRelIfExists(words_in_obj,testRel_obj);
                            if (fetchedRel_obj) {
                                nextSpawn_obj.slug = fetchedRel_obj.nodeFrom.slug;
                                nextSpawn_obj.ipns = words_in_obj[fetchedRel_obj.nodeFrom.slug].metaData.ipns;
                                nextSpawn_obj.present = true;
                            }
                            if (!fetchedRel_obj) {
                                nextSpawn_obj.slug = nextSpawn_sI_slug+"_plural";
                                nextSpawn_obj.ipns = null;
                                nextSpawn_obj.present = null;
                                allSupersetsPresent = false;
                            }
                            // fetchRelIfExists, where (x) -- isTheSupersetFor -- nextSpawn_sI_slug;
                            // if present, (x) is nextSpawn_obj.slug;
                            // if not, nextSpawn_obj.slug = nextSpawn_sI_slug+"_plural";

                            nextPattern_obj.nodesToAdd_obj.supersets.spawn.push(nextSpawn_obj);

                        }
                        nextPattern_obj.nodesToAdd_obj.supersets.allPresent = allSupersetsPresent;

                        // var nodeToAddenumeration_obj = {}
                        // nodeToAddenumeration_obj.wordType = "enumeration";
                        // nodeToAddenumeration_obj.slug = "enumeration_from_"+nextSetMapping_obj.setTo;
                        // nextPattern_obj.nodesToAdd.push(nodeToAddenumeration_obj);
                        ///////// NODES: enumeration
                        nextPattern_obj.nodesToAdd_obj.enumeration.belongsInSchema = nT_schema_slug;
                        nextPattern_obj.nodesToAdd_obj.enumeration.wordType = "enumeration";
                        nextPattern_obj.nodesToAdd_obj.enumeration.slugBase = "enumeration_from_"+nextSetMapping_obj.setTo;
                        nextPattern_obj.nodesToAdd_obj.enumeration.title = "Enumeration from "+nextSetMapping_obj.setTo;
                        nextPattern_obj.nodesToAdd_obj.enumeration.name = "enumeration from "+nextSetMapping_obj.setTo;
                        // nextPattern_obj.nodesToAdd_obj.enumeration.ipns = null;
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
                        var enticedEnumerations_arr = MiscFunctions.fetchEnticedEnumerations(words_in_obj,enticingRel_canBeSubdividedInto_obj,m);
                        if (enticedEnumerations_arr.length > 0) {
                            nextPattern_obj.nodesToAdd_obj.enumeration.present = true;
                        } else {
                            nextPattern_obj.nodesToAdd_obj.enumeration.present = false;
                        }
                        nextPattern_obj.nodesToAdd_obj.enumeration.alreadyExisting = enticedEnumerations_arr;

                        nextPattern_obj.nodesToAdd_obj.allNodesCompleted = (
                            nextPattern_obj.nodesToAdd_obj.nodeFrom.present
                            && nextPattern_obj.nodesToAdd_obj.nodeTo.present
                            && nextPattern_obj.nodesToAdd_obj.supersets.allPresent
                            && nextPattern_obj.nodesToAdd_obj.enumeration.present
                        )

                        /////////////////////////// RELATIONSHIPS //////////////////////////
                        ///////// RELATIONSHIPS: enumerates
                        nextPattern_obj.relationshipsToAdd_obj.enumerates.targetSchema = nT_schema_slug;
                        var relToAdd_enumerates_obj = MiscFunctions.blankRel_obj();
                        if (nextSetMapping_obj.setTo) {
                            relToAdd_enumerates_obj.relationshipType.slug = "enumerates";
                            relToAdd_enumerates_obj.nodeFrom.slug = nextSetMapping_obj.setTo;
                            if (nextPattern_obj.nodesToAdd_obj.enumeration.alreadyExisting.length > 0) {
                                relToAdd_enumerates_obj.nodeTo.slug = nextPattern_obj.nodesToAdd_obj.enumeration.alreadyExisting[0];
                            } else {
                                relToAdd_enumerates_obj.nodeTo.slug = nextPattern_obj.nodesToAdd_obj.enumeration.stemsFrom_setSlug
                            }
                        }
                        nextPattern_obj.relationshipsToAdd_obj.enumerates.present = null;
                        nextPattern_obj.relationshipsToAdd_obj.enumerates.relationship = relToAdd_enumerates_obj;
                        var isRelPresent_obj = MiscFunctions.fetchFirstRelIfExists(words_in_obj,relToAdd_enumerates_obj);
                        if (isRelPresent_obj) {
                            nextPattern_obj.relationshipsToAdd_obj.enumerates.present = true;
                        } else {
                            nextPattern_obj.relationshipsToAdd_obj.enumerates.present = false;
                        }

                        ///////// RELATIONSHIPS: isSubdividedBy
                        nextPattern_obj.relationshipsToAdd_obj.isSubdividedBy.targetSchema = nF_schema_slug;
                        var relToAdd_isSubdividedBy_obj = MiscFunctions.blankRel_obj();
                        // if (nextSetMapping_obj.setFromSpinoff) {
                            relToAdd_isSubdividedBy_obj.relationshipType.slug = "isSubdividedBy";
                            relToAdd_isSubdividedBy_obj.nodeFrom.slug = nextSetMapping_obj.setFrom;
                            relToAdd_isSubdividedBy_obj.nodeTo.slug = nextSetMapping_obj.setTo;
                        // }
                        nextPattern_obj.relationshipsToAdd_obj.isSubdividedBy.present = null;
                        nextPattern_obj.relationshipsToAdd_obj.isSubdividedBy.relationship = relToAdd_isSubdividedBy_obj
                        var isRelPresent_obj = MiscFunctions.fetchFirstRelIfExists(words_in_obj,relToAdd_isSubdividedBy_obj);
                        if (isRelPresent_obj) {
                            nextPattern_obj.relationshipsToAdd_obj.isSubdividedBy.present = true;
                        } else {
                            nextPattern_obj.relationshipsToAdd_obj.isSubdividedBy.present = false;
                        }

                        ///////// RELATIONSHIPS: subsetOf
                        // nextPattern_obj.relationshipsToAdd_obj.subsetOf.targetSchema = nF_schema_slug;
                        nextPattern_obj.relationshipsToAdd_obj.subsetOf.allPresent = null;
                        nextPattern_obj.relationshipsToAdd_obj.subsetOf.relationships = [];
                        var subsetOf_allPresent = true;
                        // or maybe subsetOf will go into both?

                        ///////// RELATIONSHIPS: isTheSupersetFor
                        // nextPattern_obj.relationshipsToAdd_obj.isTheSupersetFor.targetSchema = nT_schema_slug;
                        nextPattern_obj.relationshipsToAdd_obj.isTheSupersetFor.allPresent = null;
                        nextPattern_obj.relationshipsToAdd_obj.isTheSupersetFor.relationships = [];
                        var isTheSupersetFor_allPresent = true;
                        var numSpawn = nextPattern_obj.nodesToAdd_obj.supersets.spawn.length;
                        for (var s=0;s<numSpawn;s++) {
                            ///////// RELATIONSHIPS: isTheSupersetFor

                            var nextRel_isTheSupersetFor_obj = {};
                            nextRel_isTheSupersetFor_obj.targetSchema = nT_schema_slug;
                            nextRel_isTheSupersetFor_obj.present = null;
                            var nextSpawn_obj = nextPattern_obj.nodesToAdd_obj.supersets.spawn[s];
                            var nextSpecificInstance_slug = nextPattern_obj.nodesToAdd_obj.supersets.parentSpecificInstances[s];
                            var relToAdd_nextSpawn_isTheSupersetFor_obj = MiscFunctions.blankRel_obj();
                            relToAdd_nextSpawn_isTheSupersetFor_obj.relationshipType.slug = "isTheSupersetFor";
                            relToAdd_nextSpawn_isTheSupersetFor_obj.nodeFrom.slug = nextSpawn_obj.slug;
                            relToAdd_nextSpawn_isTheSupersetFor_obj.nodeTo.slug = nextSpecificInstance_slug;
                            nextRel_isTheSupersetFor_obj.relationship = relToAdd_nextSpawn_isTheSupersetFor_obj;
                            // nextPattern_obj.relationshipsToAdd_obj.isTheSupersetFor.relationships.push(relToAdd_nextSpawn_isTheSupersetFor_obj);
                            var isRelPresent_obj = MiscFunctions.fetchFirstRelIfExists(words_in_obj,relToAdd_nextSpawn_isTheSupersetFor_obj);
                            if (isRelPresent_obj) {
                                // nextPattern_obj.relationshipsToAdd_obj.isTheSupersetFor.present = true;
                                nextRel_isTheSupersetFor_obj.present = true;
                            } else {
                                // nextPattern_obj.relationshipsToAdd_obj.isTheSupersetFor.present = false;
                                nextRel_isTheSupersetFor_obj.present = false;
                                isTheSupersetFor_allPresent = false;
                            }
                            nextPattern_obj.relationshipsToAdd_obj.isTheSupersetFor.relationships.push(nextRel_isTheSupersetFor_obj)

                            ///////// RELATIONSHIPS: subsetOf
                            var nextRel_subsetOf_obj = {};
                            nextRel_subsetOf_obj.targetSchema = nF_schema_slug;
                            nextRel_subsetOf_obj.present = null;

                            var relToAdd_nextSpawn_subsetOf_obj = MiscFunctions.blankRel_obj();
                            relToAdd_nextSpawn_subsetOf_obj.relationshipType.slug = "subsetOf";
                            relToAdd_nextSpawn_subsetOf_obj.nodeFrom.slug = nextSpawn_obj.slug;
                            relToAdd_nextSpawn_subsetOf_obj.nodeTo.slug = nextSetMapping_obj.setFrom;
                            nextRel_subsetOf_obj.relationship = relToAdd_nextSpawn_subsetOf_obj;
                            // nextPattern_obj.relationshipsToAdd_obj.subsetOf.relationships.push(relToAdd_nextSpawn_subsetOf_obj);
                            var isRelPresent_obj = MiscFunctions.fetchFirstRelIfExists(words_in_obj,relToAdd_nextSpawn_subsetOf_obj);
                            if (isRelPresent_obj) {
                                // nextPattern_obj.relationshipsToAdd_obj.subsetOf.present = true;
                                nextRel_subsetOf_obj.present = true;
                            } else {
                                // nextPattern_obj.relationshipsToAdd_obj.subsetOf.present = false;
                                nextRel_subsetOf_obj.present = false;
                                subsetOf_allPresent = false;
                            }
                            nextPattern_obj.relationshipsToAdd_obj.subsetOf.relationships.push(nextRel_subsetOf_obj)
                        }
                        nextPattern_obj.relationshipsToAdd_obj.subsetOf.allPresent = subsetOf_allPresent;
                        nextPattern_obj.relationshipsToAdd_obj.isTheSupersetFor.allPresent = isTheSupersetFor_allPresent;

                        ///////// RELATIONSHIPS: addToConceptGraphProperties
                        // !!!!!! Still need to decide whether to add this relationship automatically or not !!!!!!
                        // For now, I do NOT add this automatically;
                        // If so, how to check whether it's already been added in some capacity?
                        // Perhaps witin enumerationData, maintain a list of every primaryProperty it feeds into, whether directly or indirectly
                        // Or perhaps within propertyData of every primaryProperty, maintain a list of every property that feeds into it?
                        nextPattern_obj.relationshipsToAdd_obj.addToConceptGraphProperties.targetSchema = nF_propertySchema_slug;
                        nextPattern_obj.relationshipsToAdd_obj.addToConceptGraphProperties.present = null;
                        var relToAdd_addToConceptGraphProperties_obj = MiscFunctions.blankRel_obj();
                        if (nextSetMapping_obj.setTo) {
                            relToAdd_addToConceptGraphProperties_obj.relationshipType.slug = "addToConceptGraphProperties";
                            relToAdd_addToConceptGraphProperties_obj.relationshipType.addToConceptGraphPropertiesData = {};
                            relToAdd_addToConceptGraphProperties_obj.relationshipType.addToConceptGraphPropertiesData.field = "choose one";
                            if (nextSetMapping_obj.hasOwnProperty("property")) {
                                relToAdd_addToConceptGraphProperties_obj.relationshipType.addToConceptGraphPropertiesData.field = nextSetMapping_obj.property;
                            }
                            relToAdd_addToConceptGraphProperties_obj.relationshipType.addToConceptGraphPropertiesData.includeDependencies = null;
                            if (nextPattern_obj.nodesToAdd_obj.enumeration.hasOwnProperty("includeDependencies")) {
                                relToAdd_addToConceptGraphProperties_obj.relationshipType.addToConceptGraphPropertiesData.includeDependencies = nextPattern_obj.nodesToAdd_obj.enumeration.includeDependencies;
                            }
                            if (nextPattern_obj.nodesToAdd_obj.enumeration.alreadyExisting.length > 0) {
                                relToAdd_addToConceptGraphProperties_obj.nodeFrom.slug = nextPattern_obj.nodesToAdd_obj.enumeration.alreadyExisting[0];
                            } else {
                                relToAdd_addToConceptGraphProperties_obj.nodeFrom.slug = nextPattern_obj.nodesToAdd_obj.enumeration.stemsFrom_setSlug
                            }
                            // relToAdd_addToConceptGraphProperties_obj.nodeFrom.slug = "enumeration_from_"+nextSetMapping_obj.setTo;
                            relToAdd_addToConceptGraphProperties_obj.nodeTo.slug = nF_primaryProperty_slug
                        }
                        nextPattern_obj.relationshipsToAdd_obj.addToConceptGraphProperties.relationship = relToAdd_addToConceptGraphProperties_obj
                        var isRelPresent_obj = MiscFunctions.fetchFirstRelIfExists(words_in_obj,relToAdd_addToConceptGraphProperties_obj);
                        if (isRelPresent_obj) {
                            nextPattern_obj.relationshipsToAdd_obj.addToConceptGraphProperties.present = true;
                        } else {
                            nextPattern_obj.relationshipsToAdd_obj.addToConceptGraphProperties.present = false;
                        }
                        // Need to decide how to handle this relationship! See above
                        // !!!!!!!! For now, OVERRIDE by UNcommenting the next line (stating addToConceptGraphProperties to be already present even if it isn't!)
                        // nextPattern_obj.relationshipsToAdd_obj.addToConceptGraphProperties.present = true;

                        nextPattern_obj.relationshipsToAdd_obj.allRelsCompleted = (
                            nextPattern_obj.relationshipsToAdd_obj.enumerates.present
                            && nextPattern_obj.relationshipsToAdd_obj.isSubdividedBy.present
                            && nextPattern_obj.relationshipsToAdd_obj.subsetOf.allPresent
                            && nextPattern_obj.relationshipsToAdd_obj.isTheSupersetFor.allPresent
                            && nextPattern_obj.relationshipsToAdd_obj.addToConceptGraphProperties.present
                        );


                        nextPattern_obj.actionable = false;
                        nextPattern_obj.nextAction = "none";
                        if (!nextPattern_obj.relationshipsToAdd_obj.allRelsCompleted) {
                            nextPattern_obj.nextAction = "addRels";
                            nextPattern_obj.actionable = true;
                        }
                        if (!nextPattern_obj.nodesToAdd_obj.allNodesCompleted) {
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

export const determineStatusOfActionPatterns = (words_in_obj,reports_canBeSubdividedInto_in_obj) => {
    console.log("flagActionsAsActionable canBeSubdividedInto")
    var reports_canBeSubdividedInto_out_obj = MiscFunctions.cloneObj(reports_canBeSubdividedInto_in_obj);

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
    var patternsList_arr = reports_canBeSubdividedInto_out_obj.patternsList;
    var numPatterns = patternsList_arr.length;
    for (var p=0;p<numPatterns;p++) {
        var nextPattern_obj = patternsList_arr[p];
        var isPatternActionsComplete = false;
        // cycle through each node

        // cycle through each relationship in relationshipsToAdd_obj


        /*
        var nextRelToAdd_obj = nextPattern_obj.relationshipToAdd;
        // now check to see if nextRelToAdd_obj is in currentRelationships_arr using isRelObjInArrayOfObj = (rel_obj,rels_arr)
        var isActionComplete = MiscFunctions.isRelObjInArrayOfObj(nextRelToAdd_obj,currentRelationships_arr)
        nextPattern_obj.actionable = !isActionComplete;
        nextPattern_obj.completed = isActionComplete;
        */

        if (isPatternActionsComplete) {
            completed_tot++;
        } else {
            actionable_tot++;
        }
    }
    reports_canBeSubdividedInto_out_obj.numPatterns.actionable = actionable_tot;
    reports_canBeSubdividedInto_out_obj.numPatterns.notActionable = completed_tot;
    reports_canBeSubdividedInto_out_obj.numPatterns.dunnoYetIfActionable = 0;

    return reports_canBeSubdividedInto_out_obj;
}

export const makeChanges = async (words_in_obj,reports_obj) => {
    var words_out_obj = MiscFunctions.cloneObj(words_in_obj);
    // var reports_str = JSON.stringify(reports_obj,null,4)
    // console.log("reports_str: "+reports_str)
    var numPatterns = reports_obj.canBeSubdividedInto.patternsList.length;
    for (var p=0;p<numPatterns;p++) {
        var nextPattern_obj = reports_obj.canBeSubdividedInto.patternsList[p]
        if (nextPattern_obj.actionable) {
            if (nextPattern_obj.nextAction=="addNodes") {
                var nextAction = "addNodes";
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

                // supersets
                if (!nextPattern_obj.nodesToAdd_obj.supersets.allPresent) {
                    var newWordType = nextPattern_obj.nodesToAdd_obj.supersets.wordType;
                    var schema_slug = nextPattern_obj.nodesToAdd_obj.supersets.belongInSchema;
                    var numSpawn = nextPattern_obj.nodesToAdd_obj.supersets.spawn.length;
                    for (var n=0;n<numSpawn;n++) {
                        if (!nextPattern_obj.nodesToAdd_obj.supersets.spawn[n].present) {
                            var newWord_slug = nextPattern_obj.nodesToAdd_obj.supersets.spawn[n].slug;
                            var newWord_obj = await MiscFunctions.createNewWordByTemplate(newWordType)
                            newWord_obj.wordData.slug = newWord_slug;
                            words_out_obj[newWord_slug] = newWord_obj;
                        }
                    }
                }

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
                // isTheSupersetFor
                if (!nextPattern_obj.relationshipsToAdd_obj.isTheSupersetFor.allPresent) {
                    nextAction += " add isTheSupersetFor ";
                    var isTheSupersetFor_rels_arr = nextPattern_obj.relationshipsToAdd_obj.isTheSupersetFor.relationships;
                    var numIsTheSupersetForRels = isTheSupersetFor_rels_arr.length;
                    console.log("numIsTheSupersetForRels: "+numIsTheSupersetForRels)
                    for (var r=0;r<numIsTheSupersetForRels;r++) {
                        var isTheSupersetFor_nextRel_obj = isTheSupersetFor_rels_arr[r];
                        if (!isTheSupersetFor_nextRel_obj.present) {
                            var schema_slug = isTheSupersetFor_nextRel_obj.targetSchema;
                            console.log("isTheSupersetFor schema_slug: "+schema_slug)
                            var schema_rF_obj = words_out_obj[schema_slug];
                            var relToAdd_obj = isTheSupersetFor_nextRel_obj.relationship;
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
            }
        }
    }

    /*
    for (const [nextWord_slug, nextWord_rF_obj] of Object.entries(words_in_obj)) {
        var nextWord_wordTypes_arr = nextWord_rF_obj.wordData.wordTypes;
        if (jQuery.inArray("schema",nextWord_wordTypes_arr) > -1) {
            // words_out_obj[nextWord_slug].wordData.numPatterns=numPatterns;
           // words_out_obj[nextWord_slug].wordData.nextAction=nextAction;
        }
    }
    */

    return words_out_obj;
}
