
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

            wordSelectorHTML += "<option data-slug="+nextWord_slug+" >";
            if (word_original_str != word_updated_str) {
                wordSelectorHTML += " *** UPDATED *** ";
                numUpdatedWords_XYZ ++;
            }
            wordSelectorHTML += nextWord_slug;
            wordSelectorHTML += "</option>";
        }
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
function identifyWordUpdates_XYZ(words_in_obj) {
    var words_out_obj = MiscFunctions.cloneObj(words_in_obj);

    // Purpose: erase data from various words to clean out entries that have been accumulated but need to be erased
    // This is most needed in properties and JSONSchema but may be needed elsewhere too
    // Ideally, this would be part of routine maintenance, but can be difficult
    // For globalDynamicDaya, it's easy (I think?? )
    // For properties and JSONSchema, in future: need a way to coordinate actions better.
    // Currently, pattern-actions are intended to be working all in parallel.
    // This works fine when erasure/ clearing is not one of the actions.
    // But when erasure/clearaince happens, then get problem:
    // if stepA --> stepB, and results of stepA are wiped, but action(s) on stepB are called before stepA has been reconstructed
    // Solution: group all actions together that are required to construct stepA; wipe old results, then run all of those actions together.
    // Wrap all of that into one single pattern-action.
    jQuery.each(words_out_obj,function(nextWord_slug, nextWord_obj){
        var nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;

        // reset globalDynamicData
        nextWord_obj.globalDynamicData.specificInstanceOf = [];
        nextWord_obj.globalDynamicData.subsets = [];
        nextWord_obj.globalDynamicData.specificInstances = [];
        if (nextWord_obj.globalDynamicData.hasOwnProperty("sets")) {
            nextWord_obj.globalDynamicData.sets = [];
        }
        nextWord_obj.globalDynamicData.valenceData.valenceL1 = [];
        nextWord_obj.globalDynamicData.valenceData.parentJSONSchemaSequence = [];

        if (jQuery.inArray("property",nextWord_wordTypes_arr) != -1 ) {
            nextWord_obj.propertyData.type = "";
            nextWord_obj.propertyData.types = [];
            nextWord_obj.propertyData.conceptGraphStyle.props = [];
            nextWord_obj.propertyData.conceptGraphStyle.properties = [];
            nextWord_obj.propertyData.JSONSchemaStyle.value = {};
            nextWord_obj.propertyData.definitions = {};
            nextWord_obj.propertyData.definitions.direct = [];
            nextWord_obj.propertyData.definitions.indirect = [];
        }
        if (jQuery.inArray("JSONSchema",nextWord_wordTypes_arr) != -1 ) {
            nextWord_obj.definitions = {};
            var primPropSlug = nextWord_obj.JSONSchemaData.metaData.primaryPropertySlug
            nextWord_obj.definitions[primPropSlug] = {};
        }
    })
    return words_out_obj;
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
