
import * as MiscFunctions from '../../lib/miscFunctions.js';
import { gDDPatterns, gDDActions } from './valenceTransfers.js';
import { lookupRawFileBySlug_obj, removeDuplicatesFromGlobalDynamicData } from '../addANewConcept.js';
const jQuery = require("jquery");

function fooFunction() {
    var fooFunctioned = "foo functioned";
    return fooFunctioned;
}

// inputs a relationship and outputs one or more indicated gddActions
function outputActions(rel_obj,words_in_obj) {
    var rel_str = JSON.stringify(rel_obj,null,4);
    // console.log("rel_str: "+rel_str)
    var actions_arr = [];
    var nF_slug = rel_obj.nodeFrom.slug;
    var rel_slug = rel_obj.relationshipType.slug;
    var nT_slug = rel_obj.nodeTo.slug;

    if ( (words_in_obj.hasOwnProperty(nF_slug)) && (words_in_obj.hasOwnProperty(nT_slug)) ) {
        var nF_obj = words_in_obj[nF_slug]
        var nT_obj = words_in_obj[nT_slug]

        var nF_str = JSON.stringify(nF_obj,null,4);
        var nT_str = JSON.stringify(nT_obj,null,4);
        console.log("nF_slug: "+nF_slug+"; nF_str: "+nF_str)
        console.log("nT_slug: "+nT_slug+"; nT_str: "+nT_str)

        if ( (nF_obj.hasOwnProperty("wordData")) && (nT_obj.hasOwnProperty("wordData")) ) {
            var nF_wordTypes = nF_obj.wordData.wordTypes;
            var nT_wordTypes = nT_obj.wordData.wordTypes;

            var numWordTypes_nF = nF_wordTypes.length;
            var numWordTypes_nT = nT_wordTypes.length;
            // cycle through each pattern and see if they match
            Object.entries(gDDPatterns).forEach(entry => {
                const [pattern_key, pattern_obj] = entry;
                var pattern_str = JSON.stringify(pattern_obj,null,4);

                var pattern_relType = pattern_obj.relationshipType;
                // console.log("gDDPatterns pattern_key: "+pattern_key+"; pattern_relType: "+pattern_relType+"; pattern_str: "+pattern_str);
                var pattern_nF_wT_arr = pattern_obj.nodeFrom.wordTypes;
                var pattern_nT_wT_arr = pattern_obj.nodeTo.wordTypes;
                var pattern_actions_arr = pattern_obj.actions;
                var numActions = pattern_actions_arr.length;
                var nF_match = false;
                var nT_match = false;

                if (jQuery.inArray("any",pattern_nF_wT_arr) != -1) {
                    nF_match = true;
                }
                if (jQuery.inArray("any",pattern_nT_wT_arr) != -1) {
                    nT_match = true;
                }

                for (var z=0;z<numWordTypes_nF;z++) {
                    var nextWordType = nF_wordTypes[z];
                    // console.log("nextWordType: "+nextWordType+"; "+jQuery.inArray(nextWordType,pattern_nF_wT_arr))
                    if (jQuery.inArray(nextWordType,pattern_nF_wT_arr) != -1) {
                        nF_match = true;
                    }
                }

                for (var z=0;z<numWordTypes_nT;z++) {
                    var nextWordType = nT_wordTypes[z];
                    // console.log("nextWordType: "+nextWordType+"; "+jQuery.inArray(nextWordType,pattern_nT_wT_arr))
                    if (jQuery.inArray(nextWordType,pattern_nT_wT_arr) != -1) {
                        nT_match = true;
                    }
                }

                if (
                    (rel_slug==pattern_relType) &&
                    (nF_match) &&
                    (nT_match)
                ) {
                    for (var a=0;a<numActions;a++) {
                        var nextAction_slug = pattern_actions_arr[a];
                        var nextAction_obj = {};
                        nextAction_obj.slug = nextAction_slug;
                        nextAction_obj.nodeFrom = nF_slug;
                        nextAction_obj.nodeTo = nT_slug;
                        actions_arr.push(nextAction_obj);
                        var actions_str = JSON.stringify(actions_arr,null,4)
                        // console.log("outputActions A actions_str: "+actions_str)
                    }
                }
            });
        }
    }
    var actions_str = JSON.stringify(actions_arr,null,4)
    // console.log("sortGlobalDynamicData actions_str: "+actions_str)
    return actions_arr;

}

function addNextItem(nA_source_str,nA_target_path,nA_target_obj) {
    var nA_target_path_split = nA_target_path.split(".");
    var numSteps_targetPath = nA_target_path_split.length;
    var nextStep_target_pointer = nA_target_obj;
    var nextStep_target_str = "";
    // console.log("numSteps_targetPath: "+numSteps_targetPath)
    for (var p=0;p<numSteps_targetPath;p++) {
        nextStep_target_str = nA_target_path_split[p];
        var hOP = nextStep_target_pointer.hasOwnProperty(nextStep_target_str);
        // console.log("numSteps_targetPath; p: "+p+"; nextStep_target_str: "+nextStep_target_str+"; hOP: "+hOP)
        if (!nextStep_target_pointer.hasOwnProperty(nextStep_target_str)) {
            if (p<numSteps_targetPath-1) {
                nextStep_target_pointer[nextStep_target_str] = {};
            } else {
                nextStep_target_pointer[nextStep_target_str] = [];
            }
        }
        nextStep_target_pointer = nextStep_target_pointer[nextStep_target_str];
    }
    // console.log("nA_source_str: "+nA_source_str);
    if (jQuery.inArray(nA_source_str,nextStep_target_pointer) == -1) {
        nextStep_target_pointer.push(nA_source_str);
    }
}

function removeDuplicateNodesAndRelsFromSchema(schema_in_obj) {
    var schema_out_obj = JSON.parse(JSON.stringify(schema_in_obj));

    // NODES
    var newNodeList_arr = [];
    var schema_out_nodes_arr = schema_out_obj.schemaData.nodes;
    var numNodes = schema_out_nodes_arr.length;
    for (var n=0;n<numNodes;n++) {
        var nextNode_obj = schema_out_nodes_arr[n];
        if (!MiscFunctions.isWordObjInArrayOfObj(nextNode_obj,newNodeList_arr)) {
            newNodeList_arr.push(nextNode_obj);
        }
    }
    schema_out_obj.schemaData.nodes = JSON.parse(JSON.stringify(newNodeList_arr));

    // RELATIONSHIPS
    var newRelsList_arr = [];
    var schema_out_rels_arr = schema_out_obj.schemaData.relationships;
    var numRels = schema_out_rels_arr.length;
    for (var n=0;n<numRels;n++) {
        var nextRel_obj = schema_out_rels_arr[n];
        if (!MiscFunctions.isRelObjInArrayOfObj(nextRel_obj,newRelsList_arr)) {
            newRelsList_arr.push(nextRel_obj);
        }
    }
    schema_out_obj.schemaData.relationships = JSON.parse(JSON.stringify(newRelsList_arr));

    return schema_out_obj;
}
/*
function removeDuplicateRelationshipsFromSchema(schema_in_obj) {
    var schema_out_obj = JSON.parse(JSON.stringify(schema_in_obj));
    return schema_out_obj;
}
*/
// inputs an object containing every word in a concept graph
// outputs the same object but with globalDynamicData for every word updated
// to reflect valenceTransfers
export const sortGlobalDynamicData = (words_in_obj) => {
    var words_out_obj = {};
    var schema_rels_arr = [];
    var completeActions_arr = [];
    words_out_obj = MiscFunctions.cloneObj(words_in_obj);
    // put together a list of all relationships by scraping them from each schema passed into the function
    Object.entries(words_out_obj).forEach(entry => {
        const [nextWord_slug, nextWord_obj] = entry;
        // console.log("nextWord_slug: "+nextWord_slug);
        var nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
        if (jQuery.inArray("schema",nextWord_wordTypes_arr) != -1 ) {
            // console.log("this is a schema: "+nextWord_slug)
            schema_rels_arr = schema_rels_arr.concat(nextWord_obj.schemaData.relationships);
        }
    });
    var schema_rels_str = JSON.stringify(schema_rels_arr,null,4)
    // console.log("schema_rels_str: "+schema_rels_str)
    // go through each relationship once and see if it matches any patterns in gDDPatterns
    // if so, add that pattern's actions to the completeActions list
    var numRels = schema_rels_arr.length;
    for (var r=0;r<numRels;r++) {
        var nextRel_obj = schema_rels_arr[r];
        var nextOutputActions_arr = outputActions(nextRel_obj,words_in_obj);
        var nextOutputActions_str = JSON.stringify(nextOutputActions_arr,null,4)
        // console.log("sortGlobalDynamicData nextOutputActions_str: "+nextOutputActions_str)
        completeActions_arr = completeActions_arr.concat(nextOutputActions_arr);
    }
    var completeActions_str = JSON.stringify(completeActions_arr,null,4)
    // console.log("sortGlobalDynamicData completeActions_str: "+completeActions_str)
    var numCompleteActions = completeActions_arr.length;
    // now cycle through each action in completeActions_arr and apply changes until there are no other changes to be made
    var actionIteration = 0;
    var continueActions = true;
    do {
        for (var a=0;a<numCompleteActions;a++) {
            var nextAction_obj = completeActions_arr[a];
            var nA_action_slug = nextAction_obj.slug;
            var nA_nF_slug = nextAction_obj.nodeFrom;
            var nA_nT_slug = nextAction_obj.nodeTo;

            // console.log("nA_action_slug: "+nA_action_slug);
            var nextAction_obj = gDDActions[nA_action_slug];
            var nextAction_str = JSON.stringify(nextAction_obj,null,4);
            // console.log("nextAction_str: "+nextAction_str);
            var nA_source_node = nextAction_obj.source.node;
            var nA_source_path = nextAction_obj.source.path;
            var nA_source_type = nextAction_obj.source.type;
            var nA_target_node = nextAction_obj.target.node;
            var nA_target_path = nextAction_obj.target.path;
            var nA_target_type = nextAction_obj.target.type;
            var nA_source_slug = "";
            var nA_target_slug = "";
            if (nA_source_node=="nodeFrom") {
                nA_source_slug = nA_nF_slug;
            }
            if (nA_source_node=="nodeTo") {
                nA_source_slug = nA_nT_slug;
            }
            if (nA_target_node=="nodeFrom") {
                nA_target_slug = nA_nF_slug;
            }
            if (nA_target_node=="nodeTo") {
                nA_target_slug = nA_nT_slug;
            }
            var nA_source_obj = words_out_obj[nA_source_slug];
            var nA_target_obj = words_out_obj[nA_target_slug];


            var nA_sourse_path_split = nA_source_path.split(".");
            var numSteps_sourcePath = nA_sourse_path_split.length;
            var nextStep_source_pointer = nA_source_obj;
            var nextStep_source_str = "";
            for (var s=0;s<numSteps_sourcePath;s++) {
                nextStep_source_str = nA_sourse_path_split[s];
                // var nextStep_source_pointer_str = JSON.stringify(nextStep_source_pointer,null,4);
                // console.log("numSteps_sourcePath; s: "+s+"; nextStep_source_str: "+nextStep_source_str+"; nextStep_source_pointer_str: "+nextStep_source_pointer_str)
                if (nextStep_source_pointer.hasOwnProperty(nextStep_source_str)) {
                    nextStep_source_pointer = nextStep_source_pointer[nextStep_source_str]
                } else {
                    nextStep_source_pointer = [];
                }
            }
            if (nA_source_type=="string") {
                var nA_source_str = nextStep_source_pointer;
                addNextItem(nA_source_str,nA_target_path,nA_target_obj);
            }
            if (nA_source_type=="array") {
                var numSourceItems = nextStep_source_pointer.length;
                for (var i = 0;i<numSourceItems;i++) {
                    var next_nA_source_str = nextStep_source_pointer[i];
                    addNextItem(next_nA_source_str,nA_target_path,nA_target_obj);
                }
            }
        }
        actionIteration++;
        if (actionIteration > 10) {
            continueActions = false;
        }
    } while (continueActions)
    // console.log("actionIteration: "+actionIteration)

    Object.entries(words_out_obj).forEach(entry_x => {
        var [nextWord_x_slug, nextWord_x_obj] = entry_x;
        // for EVERY word: remove duplicates from arrays in globalDynamicData
        words_out_obj[nextWord_x_slug] = removeDuplicatesFromGlobalDynamicData(nextWord_x_obj);
        // var fooBar_obj = words_out_obj[nextWord_x_slug];
        // fooBar_obj.foo = "bar";
    });
    Object.entries(words_out_obj).forEach(entry_y => {
        var [nextWord_y_slug, nextWord_y_obj] = entry_y;
        // for schemas only: remove duplicates in nodes and relationships
        var nextWord_wordTypes_y_arr = nextWord_y_obj.wordData.wordTypes;
        if (jQuery.inArray("schema",nextWord_wordTypes_y_arr) > -1 ) {
            words_out_obj[nextWord_y_slug] = removeDuplicateNodesAndRelsFromSchema(nextWord_y_obj);
        }
    });

    return words_out_obj;
}
