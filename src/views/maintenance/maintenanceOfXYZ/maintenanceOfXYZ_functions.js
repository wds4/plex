
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

        var words_XYZ_pre_pre_rF_obj = MiscFunctions.cloneObj(words_XYZ_pre_rF_obj);

        words_XYZ_post_rF_obj = await identifyWordUpdates_XYZ(words_XYZ_pre_rF_obj);

        var numWords_post = Object.keys(words_XYZ_post_rF_obj).length;
        console.log("numWords: "+numWords+"; numWords_post: "+numWords_post)
        var numNewWords_XYZ = 0;
        var numUpdatedWords_XYZ = 0;
        jQuery.each(words_XYZ_post_rF_obj,function(nextWord_slug,word_obj){
            var word_original_obj = words_XYZ_pre_rF_obj[nextWord_slug];
            var word_updated_obj = words_XYZ_post_rF_obj[nextWord_slug];
            var word_original_str = JSON.stringify(word_original_obj);
            var word_updated_str = JSON.stringify(word_updated_obj);

            wordSelectorHTML += "<option data-slug="+nextWord_slug+" >";
            if (!words_XYZ_pre_pre_rF_obj.hasOwnProperty(nextWord_slug)) {
                wordSelectorHTML += " *** NEW WORD *** ";
                numNewWords_XYZ ++;
            } else {
                if (word_original_str != word_updated_str) {
                    wordSelectorHTML += " *** UPDATED *** ";
                    numUpdatedWords_XYZ ++;
                }
            }
            wordSelectorHTML += nextWord_slug;
            wordSelectorHTML += "</option>";
        })

        wordSelectorHTML += "</select>";
        jQuery("#numNewWordsContainer_XYZ").html(numNewWords_XYZ);
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

/*
    // 2
    var newWord2_slug = "brandNewWord2";
    words_in_obj[newWord2_slug] = {"newWord": "yup, a brand new word! - 2 - before"}
    words_out_obj[newWord2_slug] = {"newWord": "yup, a brand new word! - 2 - after"}

    var newWord2_obj = await MiscFunctions.createNewWordByTemplate("word");
    newWord2_obj.wordData.title = "updated title";
    words_out_obj[newWord2_slug] = await newWord2_obj;

    // 3
    var newWord3_slug = "brandNewWord3";
    words_in_obj[newWord3_slug] = {"newWord": "yup, a brand new word! - 3 - before"}
    words_out_obj[newWord3_slug] = {"newWord": "yup, a brand new word! - 3 - after"}

    var newWord3_obj = await MiscFunctions.createNewWordByTemplate("word");
    newWord3_obj.wordData.title = "updated title";
    words_out_obj[newWord3_slug] = await newWord3_obj;

    // 4
    var newWord4_slug = "brandNewWord4";
    words_in_obj[newWord4_slug] = {"newWord": "yup, a brand new word! - 4 - before"}
    words_out_obj[newWord4_slug] = {"newWord": "yup, a brand new word! - 4 - after"}

    var newWord4_obj = await MiscFunctions.createNewWordByTemplate("word");
    newWord4_obj.wordData.title = "updated title";
    words_out_obj[newWord4_slug] = await newWord4_obj;

    // 5
    var newWord5_slug = "brandNewWord5";
    words_in_obj[newWord5_slug] = {"newWord": "yup, a brand new word! - 5 - before"}
    words_out_obj[newWord5_slug] = {"newWord": "yup, a brand new word! - 5 - after"}

    var newWord5_obj = await MiscFunctions.createNewWordByTemplate("word");
    newWord5_obj.wordData.title = "updated title";
    words_out_obj[newWord5_slug] = await newWord5_obj;
*/
    var newWords_obj = {
        "newWord10_slug": "brandNewWord10",
        "newWord11_slug": "brandNewWord11",
        "newWord12_slug": "brandNewWord12",
        "newWord13_slug": "brandNewWord13",
        "newWord14_slug": "brandNewWord14",
        "newWord15_slug": "brandNewWord15"
    };

    jQuery.each(newWords_obj,async function(slug1,slug2){
        var newWordNext_slug = slug2;
        words_in_obj[newWordNext_slug] = {"newWord": "yup, a brand new word! - "+slug2+" - before"}
        words_out_obj[newWordNext_slug] = {"newWord": "yup, a brand new word! - "+slug2+" - after"}

        var newWordNext_obj = await MiscFunctions.createNewWordByTemplate("word");
        newWordNext_obj.wordData.title = "updated title";
        words_out_obj[newWordNext_slug] = await newWordNext_obj;
    })

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
