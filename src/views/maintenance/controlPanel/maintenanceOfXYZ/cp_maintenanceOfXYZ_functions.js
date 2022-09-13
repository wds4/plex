
import * as MiscFunctions from '../../../../lib/miscFunctions.js';
// import * as PatternsActions from './maintenanceOfXYZ_patternActionSpecs.js';
import * as PropertyFormationFunctions from '../../../buildConceptFamily/propertyFormationFunctionsUsingRelationships.js';
import sendAsync from '../../../../renderer';
import * as ControlPanelFunctions from '../maintenanceControlPanel.js';
const jQuery = require("jquery");

// coda for this pattern-match-function group: XYZ

export var words_XYZ_pre_rF_obj = {};
export var words_XYZ_post_rF_obj = {};

// fetchConceptGraph_XYZ is called by maintenanceOfXYZ
// fetchConceptGraph_XYZ obtains the full list of words from SQL;
// then calls identifyWordUpdates_XYZ to determine all edits that must be made
export const cp_fetchConceptGraph_XYZ = async (conceptGrapTableName,currentTaskNumber,updateChangedWords) => {
    words_XYZ_pre_rF_obj = {};
    words_XYZ_post_rF_obj = {};
    var sql = " SELECT * FROM "+conceptGrapTableName;
    // console.log("sql: "+sql);

    sendAsync(sql).then( async (words_XYZ_pre_arr) => {
        var numWords = words_XYZ_pre_arr.length;

        for (var w=0;w<numWords;w++) {
            var nextWord = words_XYZ_pre_arr[w];
            var nextWord_rawFile_str = nextWord.rawFile;
            var nextWord_rawFile_obj = JSON.parse(nextWord_rawFile_str);
            var nextWord_slug = nextWord_rawFile_obj.wordData.slug;
            words_XYZ_pre_rF_obj[nextWord_slug]=JSON.parse(JSON.stringify(nextWord_rawFile_obj));
        }

        words_XYZ_post_rF_obj = identifyWordUpdates_XYZ(words_XYZ_pre_rF_obj);

        var numUpdatedWords_XYZ = 0;
        for (var w=0;w<numWords;w++) {
            var nextWord = words_XYZ_pre_arr[w];
            var nextWord_rawFile_str = nextWord.rawFile;
            var nextWord_rawFile_obj = JSON.parse(nextWord_rawFile_str);
            var nextWord_slug = nextWord_rawFile_obj.wordData.slug;

            var word_original_obj = words_XYZ_pre_rF_obj[nextWord_slug];
            var word_updated_obj = words_XYZ_post_rF_obj[nextWord_slug];

            var word_original_str = JSON.stringify(word_original_obj);
            var word_updated_str = JSON.stringify(word_updated_obj);

            if (word_original_str != word_updated_str) {
                numUpdatedWords_XYZ ++;
                if (updateChangedWords) {
                   MiscFunctions.updateWordInAllTables(word_updated_obj)
                }
            }
        }
        ControlPanelFunctions.updateControlPanelDisplay(numUpdatedWords_XYZ,currentTaskNumber);
        ControlPanelFunctions.proceedWithNextTask();
        return numUpdatedWords_XYZ;
    });
}

// identifyWordUpdates_XYZ iterates through all pattern-actions in this group
// and executes them; output is an updated word list with all necessary changes
function identifyWordUpdates_XYZ(words_in_obj) {
    var words_out_obj = MiscFunctions.cloneObj(words_in_obj);

    // use this section for any tasks that should be done only once
    jQuery.each(words_out_obj,function(nextWord_slug, nextWord_obj){
        var nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
        if (jQuery.inArray("schema",nextWord_wordTypes_arr) != -1 ) {
            // * test to make sure working *
            // nextWord_obj.wordData.foo = "maintenance of XYZ";
            // delete nextWord_obj.wordData.foo2;
            // * end test *

            // schema_rels_arr = schema_rels_arr.concat(nextWord_obj.schemaData.relationships);
        }
    })

    // use this section for any tasks that should be done repeatedly
    // iterate at least min and at most max number of times through each action
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
