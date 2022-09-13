
import * as MiscFunctions from '../../../lib/miscFunctions.js';
import * as PatternsActions from './maintenanceOfSchemas_patternActionSpecs.js';
import * as PropertyFormationFunctions from '../../buildConceptFamily/propertyFormationFunctionsUsingRelationships.js';
import sendAsync from '../../../renderer';
const jQuery = require("jquery");

// coda for this pattern-match-function group: was XYZ, changed to schemas

export var words_schemas_pre_rF_obj = {};
export var words_schemas_post_rF_obj = {};

// fetchConceptGraph_schemas is called by maintenanceOfSchemas
// fetchConceptGraph_schemas obtains the full list of words from SQL;
// then calls identifyWordUpdates_schemas to determine all edits that must be made
export const fetchConceptGraph_schemas = async (conceptGrapTableName) => {
    words_schemas_pre_rF_obj = {};
    words_schemas_post_rF_obj = {};
    var sql = " SELECT * FROM "+conceptGrapTableName;
    console.log("sql: "+sql);

    sendAsync(sql).then( async (words_schemas_pre_arr) => {
        var numWords = words_schemas_pre_arr.length;

        var wordSelectorHTML = "";
        wordSelectorHTML += "<select id=wordSelector_schemas >";

        for (var w=0;w<numWords;w++) {
            var nextWord = words_schemas_pre_arr[w];
            var nextWord_rawFile_str = nextWord.rawFile;
            var nextWord_rawFile_obj = JSON.parse(nextWord_rawFile_str);
            var nextWord_slug = nextWord_rawFile_obj.wordData.slug;
            words_schemas_pre_rF_obj[nextWord_slug]=JSON.parse(JSON.stringify(nextWord_rawFile_obj));
        }

        words_schemas_post_rF_obj = identifyWordUpdates_schemas(words_schemas_pre_rF_obj);

        var numUpdatedWords_schemas = 0;
        for (var w=0;w<numWords;w++) {
            var nextWord = words_schemas_pre_arr[w];
            var nextWord_rawFile_str = nextWord.rawFile;
            var nextWord_rawFile_obj = JSON.parse(nextWord_rawFile_str);
            var nextWord_slug = nextWord_rawFile_obj.wordData.slug;

            var word_original_obj = words_schemas_pre_rF_obj[nextWord_slug];
            var word_updated_obj = words_schemas_post_rF_obj[nextWord_slug];

            var word_original_str = JSON.stringify(word_original_obj);
            var word_updated_str = JSON.stringify(word_updated_obj);

            wordSelectorHTML += "<option data-slug="+nextWord_slug+" >";
            if (word_original_str != word_updated_str) {
                wordSelectorHTML += " *** UPDATED *** ";
                numUpdatedWords_schemas ++;
            }
            wordSelectorHTML += nextWord_slug;
            wordSelectorHTML += "</option>";
        }
        // var res = "fetchConceptGraph_schemas is complete";
        // console.log("res: "+res)
        // return res;

        wordSelectorHTML += "</select>";
        jQuery("#numUpdatedWordsContainer_schemas").html(numUpdatedWords_schemas);

        jQuery("#wordSelectorElem_schemas").html(wordSelectorHTML);
        jQuery("#wordSelectorElem_schemas").change(function(){
            showSelectedWord_schemas();
        });
        showSelectedWord_schemas();

    });
}

// identifyWordUpdates_schemas iterates through all pattern-actions in this group
// and executes them; output is an updated word list with all necessary changes
function identifyWordUpdates_schemas(words_in_obj) {
    var words_out_obj = MiscFunctions.cloneObj(words_in_obj);

    jQuery.each(words_out_obj,function(nextWord_slug, nextWord_obj){
        var nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
        if (jQuery.inArray("schema",nextWord_wordTypes_arr) != -1 ) {
            // * test to make sure working *
            // nextWord_obj.wordData.foo = "maintenance of schemas";
            // delete nextWord_obj.wordData.foo2;
            // * end test *

            var nextSchema_nodes_arr = nextWord_obj.schemaData.nodes;
            var nextSchema_rels_arr = nextWord_obj.schemaData.relationships;

            ///////////// CHECK 1 /////////////////
            // Check 1: iterate through each node; check node entry against SQL data (from words_in_obj)
            // assert the IPNS value from SQL is the correct one and set the node's IPNS in schema to that
            nextWord_obj.schemaData.nodes = [];
            var numNodes = nextSchema_nodes_arr.length;
            for (var n=0;n<numNodes;n++) {
                var nextNode_obj = nextSchema_nodes_arr[n];
                var nextNode_slug = nextNode_obj.slug;
                var nextNode_ipns = nextNode_obj.ipns;
                var updatedNextNode = {};
                updatedNextNode.slug = nextNode_slug;
                updatedNextNode.ipns = nextNode_ipns;
                if (words_in_obj.hasOwnProperty(nextNode_slug)) {
                    updatedNextNode.ipns = words_in_obj[nextNode_slug].metaData.ipns;
                } 
                nextWord_obj.schemaData.nodes.push(updatedNextNode)
            }
            // Next, cycle through again and remove duplicate nodes
            var nextSchema2_nodes_arr = []
            var numNodes2 = nextWord_obj.schemaData.nodes.length;
            for (var n=0;n<numNodes2;n++) {
                var nextNode_obj = nextWord_obj.schemaData.nodes[n];
                if (!MiscFunctions.isWordObjInArrayOfObj(nextNode_obj,nextSchema2_nodes_arr)) {
                    nextSchema2_nodes_arr.push(nextNode_obj)
                }
            }
            nextWord_obj.schemaData.nodes = nextSchema2_nodes_arr;
            ///////////// END CHECK 1 /////////////////

            ///////////// CHECK 2 /////////////////
            // Remove any relationship in which:
            //  A -- subsetOf -- A
            //  A -- propagateProperty -- A
            var numRels = nextSchema_rels_arr.length;
            nextWord_obj.schemaData.relationships = [];
            for (var r=0;r<numRels;r++) {
                var nextRel_obj = nextSchema_rels_arr[r];
                var keepThisRel = true;
                if (nextRel_obj.nodeFrom.slug == nextRel_obj.nodeTo.slug) {
                    keepThisRel = false;
                }
                if (keepThisRel) {
                    nextWord_obj.schemaData.relationships.push(nextRel_obj)
                }
            }
            ///////////// END CHECK 2 /////////////////
        }
    })

    // iterate between min and max number of times through each action
    var iterations_min = 3;
    var iterations_max = 5;
    var actionIteration = 0;
    var continueActions = true;
    do {
        continueActions = false;

        // * test to make sure working *
        jQuery.each(words_out_obj,function(nextWord_slug, nextWord_obj){
            // nextWord_obj.wordData[actionIteration] = "bar";
            continueActions = true;
        })
        // * end test *

        actionIteration++;
        if (actionIteration < iterations_min) {
            continueActions = true;
        }
        if (actionIteration > iterations_max) {
            continueActions = false;
        }
    } while (continueActions)

    return words_out_obj;
}

function showSelectedWord_schemas() {
    var selectedWord_slug = jQuery("#wordSelectorElem_schemas option:selected").data("slug");
    var word_pre_rF_obj = words_schemas_pre_rF_obj[selectedWord_slug];
    var word_pre_rF_str = JSON.stringify(word_pre_rF_obj,null,4);
    var word_post_rF_obj = words_schemas_post_rF_obj[selectedWord_slug];
    var word_post_rF_str = JSON.stringify(word_post_rF_obj,null,4);
    jQuery("#word_pre_elem").html(word_pre_rF_str);
    jQuery("#word_post_elem").html(word_post_rF_str);
}
