
import * as MiscFunctions from '../../../lib/miscFunctions.js';
import * as PatternsActions from './maintenanceOfXYZ_patternActionSpecs.js';
import * as PropertyFormationFunctions from '../../buildConceptFamily/propertyFormationFunctionsUsingRelationships.js';
import sendAsync from '../../../renderer';
const jQuery = require("jquery");

// coda for this pattern-match-function group: XYZ

export var words_XYZ_pre_rF_obj = {};
export var words_XYZ_post_rF_obj = {};

// fetchConceptGraph_XYZ is called by maintenanceOfXYZ
// fetchConceptGraph_XYZ obtains the full list of words from SQL;
// then calls identifyWordUpdates_XYZ to determine all edits that must be made
export const fetchConceptGraph_XYZ = async (conceptGrapTableName) => {
    words_XYZ_pre_rF_obj = {};
    words_XYZ_post_rF_obj = {};
    var sql = " SELECT * FROM "+conceptGrapTableName;
    console.log("sql: "+sql);

    sendAsync(sql).then( async (words_XYZ_pre_arr) => {
        var numWords = words_XYZ_pre_arr.length;

        var wordSelectorHTML = "";
        wordSelectorHTML += "<select id=wordSelector_XYZ >";

        for (var w=0;w<numWords;w++) {
            var nextWord = words_XYZ_pre_arr[w];
            var nextWord_rawFile_str = nextWord.rawFile;
            var nextWord_rawFile_obj = JSON.parse(nextWord_rawFile_str);
            var nextWord_slug = nextWord_rawFile_obj.wordData.slug;
            words_XYZ_pre_rF_obj[nextWord_slug]=JSON.parse(JSON.stringify(nextWord_rawFile_obj));
        }

        words_XYZ_post_rF_obj = await identifyWordUpdates_XYZ(words_XYZ_pre_rF_obj);

        var numWords_post = Object.keys(words_XYZ_post_rF_obj).length;
        console.log("numWords: "+numWords+"; numWords_post: "+numWords_post)
        var numUpdatedWords_XYZ = 0;
        jQuery.each(words_XYZ_post_rF_obj,function(nextWord_slug,word_obj){
            var word_original_obj = words_XYZ_pre_rF_obj[nextWord_slug];
            var word_updated_obj = words_XYZ_post_rF_obj[nextWord_slug];
            var word_original_str = JSON.stringify(word_original_obj);
            var word_updated_str = JSON.stringify(word_updated_obj);
            
            wordSelectorHTML += "<option data-slug="+nextWord_slug+" >";
            if (word_original_str != word_updated_str) {
                wordSelectorHTML += " *** UPDATED *** ";
                numUpdatedWords_XYZ ++;
            }
            wordSelectorHTML += nextWord_slug;
            wordSelectorHTML += "</option>";
        })
        /*
        for (var w=0;w<numWords;w++) {
            var nextWord = words_XYZ_pre_arr[w];
            var nextWord_rawFile_str = nextWord.rawFile;
            var nextWord_rawFile_obj = JSON.parse(nextWord_rawFile_str);
            var nextWord_slug = nextWord_rawFile_obj.wordData.slug;

            var word_original_obj = words_XYZ_pre_rF_obj[nextWord_slug];
            var word_updated_obj = words_XYZ_post_rF_obj[nextWord_slug];

            var word_original_str = JSON.stringify(word_original_obj);
            var word_updated_str = JSON.stringify(word_updated_obj);

            wordSelectorHTML += "<option data-slug="+nextWord_slug+" >";
            if (word_original_str != word_updated_str) {
                wordSelectorHTML += " *** UPDATED *** ";
                numUpdatedWords_XYZ ++;
            }
            wordSelectorHTML += nextWord_slug;
            wordSelectorHTML += "</option>";
        }
        */
        // var res = "fetchConceptGraph_XYZ is complete";
        // console.log("res: "+res)
        // return res;

        wordSelectorHTML += "</select>";
        jQuery("#numUpdatedWordsContainer_XYZ").html(numUpdatedWords_XYZ);

        jQuery("#wordSelectorElem_XYZ").html(wordSelectorHTML);
        jQuery("#wordSelectorElem_XYZ").change(function(){
            showSelectedWord_XYZ();
        });
        showSelectedWord_XYZ();

    });
}

// identifyWordUpdates_XYZ iterates through all pattern-actions in this group
// and executes them; output is an updated word list with all necessary changes
async function identifyWordUpdates_XYZ(words_in_obj) {
    var words_out_obj = MiscFunctions.cloneObj(words_in_obj);

    var newWord_slug = "brandNewWord";
    words_in_obj[newWord_slug] = {"newWord": "yup, a brand new word! - before"}
    words_out_obj[newWord_slug] = {"newWord": "yup, a brand new word! - after"}

    // var newWord_obj = await MiscFunctions.createNewWordByTemplate("word");
    // words_out_obj[newWord_slug] = await newWord_obj;

    jQuery.each(words_out_obj,function(nextWord_slug, nextWord_obj){
        var nextWord_wordTypes_arr = [];
        if (nextWord_obj.hasOwnProperty("wordData")) {
            nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
        }
        if (jQuery.inArray("schema",nextWord_wordTypes_arr) != -1 ) {
            // * test to make sure working *
            // nextWord_obj.wordData.foo = "maintenance of XYZ";
            // delete nextWord_obj.wordData.foo2;
            // * end test *

            // schema_rels_arr = schema_rels_arr.concat(nextWord_obj.schemaData.relationships);
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

    var output = {};
    output.words_in_obj = words_in_obj;
    output.words_out_obj = words_out_obj;
    return await words_out_obj;
    // return await output;
}

function showSelectedWord_XYZ() {
    var selectedWord_slug = jQuery("#wordSelectorElem_XYZ option:selected").data("slug");
    var word_pre_rF_obj = words_XYZ_pre_rF_obj[selectedWord_slug];
    var word_pre_rF_str = JSON.stringify(word_pre_rF_obj,null,4);
    var word_post_rF_obj = words_XYZ_post_rF_obj[selectedWord_slug];
    var word_post_rF_str = JSON.stringify(word_post_rF_obj,null,4);
    jQuery("#word_pre_elem").html(word_pre_rF_str);
    jQuery("#word_post_elem").html(word_post_rF_str);
}
