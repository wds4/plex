import * as MiscFunctions from '../../../lib/miscFunctions.js';
import sendAsync from '../../../renderer';
const jQuery = require("jquery");

// loof for user-entered rel: (nF) - isASubsetOf - (nT)
export const generateInitialPatternList = (words_in_obj) => {
    console.log("generateInitialPatternList isASubsetOf")
    var output_obj = {};
    output_obj.patternInfo = {};
    output_obj.patternInfo.description = "(nF) - isASubsetOf - (nT); nF and nT are both concepts";
    output_obj.patternInfo.action = {};
    output_obj.patternInfo.action.description = "create rel: (nF:superset) - subsetOf - (nT:superset) and place in schemaFor[nT]";
    output_obj.numPatterns = {};
    output_obj.numPatterns.total = 0;
    output_obj.numPatterns.actionable = 0;
    output_obj.numPatterns.notActionable = 0;
    output_obj.numPatterns.error = 0;
    output_obj.numPatterns.dunnoYetIfActionable = 0;
    output_obj.rawRelationshipsList = [];
    output_obj.patternsList = [];

    var templatePattern_obj = {};
    templatePattern_obj.relationshipToAdd = {}
    templatePattern_obj.schemaToAddRelationshipTo = "";
    templatePattern_obj.actionable = null; // true, false, or null (=not yet checked)
    templatePattern_obj.completed = null; // true, false, or null (=not yet checked)
    templatePattern_obj.error = null; // true, false, or null

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

                if (nextRel_rT_slug=="isASubsetOf") {
                    console.log("schema: "+nextWord_slug+"; nextRel_str: "+nextRel_str);

                    // console.log("nextRel_nF_slug: "+nextRel_nF_slug)
                    // console.log("nextRel_nT_slug: "+nextRel_nT_slug)
                    var nF_schema_slug = "";
                    var nT_schema_slug = "";
                    if (nF_concept_rF_obj.hasOwnProperty("conceptData")) {
                        nF_schema_slug = nF_concept_rF_obj.conceptData.nodes.schema.slug;
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
                    // nextRel_obj.relationshipType.isASubsetOfData.setMappings
                    // if isASubsetOfData does not exist, assume one relationship such that
                    // nextRel_obj.relationshipType.isASubsetOfData.setMappings[0].setFrom = (superset of nF)
                    // nextRel_obj.relationshipType.isASubsetOfData.setMappings[0].setTo = (superset of nT)

                    // If isASubsetOfData is absent, create it prior to the next processing step.
                    if (!nextRel_obj.relationshipType.hasOwnProperty("isASubsetOfData")) {
                        nextRel_obj.relationshipType.isASubsetOfData = {}
                        nextRel_obj.relationshipType.isASubsetOfData.setMappings = []
                        var nextSetMapping_obj = {}
                        nextSetMapping_obj.setFrom = nF_concept_rF_obj.conceptData.nodes.superset.slug;
                        nextSetMapping_obj.setTo = nT_concept_rF_obj.conceptData.nodes.superset.slug;
                        nextRel_obj.relationshipType.isASubsetOfData.setMappings.push(nextSetMapping_obj)
                    }

                    // Determine the number of patterns.
                    var numSetMappings = nextRel_obj.relationshipType.isASubsetOfData.setMappings.length;
                    for (var m=0;m<numSetMappings;m++) {
                        var nextSetMapping_obj = nextRel_obj.relationshipType.isASubsetOfData.setMappings[m];
                        output_obj.numPatterns.total++;
                        output_obj.numPatterns.dunnoYetIfActionable++;

                        var nextPattern_obj = MiscFunctions.cloneObj(templatePattern_obj);
                        var relToAdd_obj = MiscFunctions.blankRel_obj();
                        relToAdd_obj.relationshipType.slug = "subsetOf";
                        relToAdd_obj.nodeFrom.slug = nextSetMapping_obj.setFrom;
                        relToAdd_obj.nodeTo.slug = nextSetMapping_obj.setTo;
                        nextPattern_obj.relationshipToAdd = relToAdd_obj;
                        nextPattern_obj.schemaToAddRelationshipTo = nT_schema_slug;
                        output_obj.patternsList.push(nextPattern_obj)
                    }
                }
            }
        }
    }
    return output_obj;
}

export const determineStatusOfActionPatterns = (words_in_obj,reports_isASubsetOf_in_obj) => {
    console.log("flagActionsAsActionable isASubsetOf")
    var reports_isASubsetOf_out_obj = MiscFunctions.cloneObj(reports_isASubsetOf_in_obj);

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
    var patternsList_arr = reports_isASubsetOf_out_obj.patternsList;
    var numPatterns = patternsList_arr.length;
    for (var p=0;p<numPatterns;p++) {
        var nextPattern_obj = patternsList_arr[p];
        var nextRelToAdd_obj = nextPattern_obj.relationshipToAdd;
        // now check to see if nextRelToAdd_obj is in currentRelationships_arr using isRelObjInArrayOfObj = (rel_obj,rels_arr)
        var isActionComplete = MiscFunctions.isRelObjInArrayOfObj(nextRelToAdd_obj,currentRelationships_arr)
        nextPattern_obj.actionable = !isActionComplete;
        nextPattern_obj.completed = isActionComplete;
        if (isActionComplete) {
            completed_tot++;
        } else {
            actionable_tot++;
        }
    }
    reports_isASubsetOf_out_obj.numPatterns.actionable = actionable_tot;
    reports_isASubsetOf_out_obj.numPatterns.notActionable = completed_tot;
    reports_isASubsetOf_out_obj.numPatterns.dunnoYetIfActionable = 0;

    return reports_isASubsetOf_out_obj;
}

export const makeChanges = async (words_in_obj,reports_obj) => {
    var words_out_obj = MiscFunctions.cloneObj(words_in_obj);
    var numPatterns = reports_obj.isASubsetOf.patternsList.length;
    for (var p=0;p<numPatterns;p++) {
        var nextPattern_obj = reports_obj.isASubsetOf.patternsList[p]
        if (nextPattern_obj.actionable) {
            console.log("actionable: isASubsetOf pattern: "+p)
            var relToAdd_obj = nextPattern_obj.relationshipToAdd;
            var schema_slug = nextPattern_obj.schemaToAddRelationshipTo;
            var schema_rF_obj = MiscFunctions.cloneObj(words_in_obj[schema_slug]);
            words_out_obj[schema_slug] = MiscFunctions.updateSchemaWithNewRel(schema_rF_obj,relToAdd_obj,words_out_obj);
        }
    }
    return words_out_obj;
}
