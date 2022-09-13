
import * as MiscFunctions from '../../../lib/miscFunctions.js';
import * as PatternsActions from './conceptsMaintenancePatternActionSpecs.js';
import * as PropertyFormationFunctions from '../../buildConceptFamily/propertyFormationFunctionsUsingRelationships.js';
import sendAsync from '../../../renderer';
const jQuery = require("jquery");

// coda for this pattern-match-function group was XYZ, changed to cm

export var words_cm_pre_rF_obj = {};
export var words_cm_post_rF_obj = {};

// fetchConceptGraph_cm is called by ConceptsMaintenance
// fetchConceptGraph_cm obtains the full list of words from SQL;
// then calls identifyWordUpdates_cm to determine all edits that must be made
export const fetchConceptGraph_cm = (conceptGrapTableName) => {
    words_cm_pre_rF_obj = {};
    words_cm_post_rF_obj = {};
    var sql = " SELECT * FROM "+conceptGrapTableName;
    console.log("sql: "+sql);
    sendAsync(sql).then((words_cm_pre_arr) => {
        var numWords = words_cm_pre_arr.length;

        var wordSelectorHTML = "";
        wordSelectorHTML += "<select id=wordSelector_cm >";

        for (var w=0;w<numWords;w++) {
            var nextWord = words_cm_pre_arr[w];
            var nextWord_rawFile_str = nextWord.rawFile;
            var nextWord_rawFile_obj = JSON.parse(nextWord_rawFile_str);
            var nextWord_slug = nextWord_rawFile_obj.wordData.slug;
            words_cm_pre_rF_obj[nextWord_slug]=JSON.parse(JSON.stringify(nextWord_rawFile_obj));
        }

        words_cm_post_rF_obj = identifyWordUpdates_cm(words_cm_pre_rF_obj);

        var numUpdatedWords_cm = 0;
        for (var w=0;w<numWords;w++) {
            var nextWord = words_cm_pre_arr[w];
            var nextWord_rawFile_str = nextWord.rawFile;
            var nextWord_rawFile_obj = JSON.parse(nextWord_rawFile_str);
            var nextWord_slug = nextWord_rawFile_obj.wordData.slug;

            var word_original_obj = words_cm_pre_rF_obj[nextWord_slug];
            var word_updated_obj = words_cm_post_rF_obj[nextWord_slug];

            var word_original_str = JSON.stringify(word_original_obj);
            var word_updated_str = JSON.stringify(word_updated_obj);

            wordSelectorHTML += "<option data-slug="+nextWord_slug+" >";
            if (word_original_str != word_updated_str) {
                wordSelectorHTML += " *** UPDATED *** ";
                numUpdatedWords_cm ++;
            }
            wordSelectorHTML += nextWord_slug;
            wordSelectorHTML += "</option>";
        }
        wordSelectorHTML += "</select>";
        jQuery("#numUpdatedWordsContainer_cm").html(numUpdatedWords_cm);

        jQuery("#wordSelectorElem_cm").html(wordSelectorHTML);
        jQuery("#wordSelectorElem_cm").change(function(){
            showSelectedWord_cm();
        });
        showSelectedWord_cm();
    });
}

// identifyWordUpdates_cm iterates through all pattern-actions in this group
// and executes them; output is an updated word list with all necessary changes
function identifyWordUpdates_cm(words_in_obj) {
    var words_out_obj = MiscFunctions.cloneObj(words_in_obj);


    // make sure each word has:
    // globalDynamicData.valenceData.valenceL1
    // globalDynamicData.valenceData.parentJSONSchemaSequence
    // for some reason, this will not act upon any propertySchemas if *** Section A *** (below) is allowed to run (words_out_obj gets overwritten, probably)
    jQuery.each(words_out_obj,function(nextWord_slug, nextWord_obj){
        if (!nextWord_obj.globalDynamicData.hasOwnProperty("valenceData")){
            nextWord_obj.globalDynamicData.valenceData = {};
        }
        if (!nextWord_obj.globalDynamicData.valenceData.hasOwnProperty("valenceL1")){
            nextWord_obj.globalDynamicData.valenceData.valenceL1 = [];
        }
        if (!nextWord_obj.globalDynamicData.valenceData.hasOwnProperty("parentJSONSchemaSequence")){
            nextWord_obj.globalDynamicData.valenceData.parentJSONSchemaSequence = [];
        }
        // nextWord_obj.foo = "bar";
    });

    /*
    // *** Section A ***
    // Make sure schemaForPropertiesFor[each concept] has the relationship:
    // primaryProperty_slug -- isASpecificInstanceOf -- the set: propertiesFor[the concept]_primaryProperty
    jQuery.each(words_out_obj,function(nextWord_slug, nextWord_obj){
        var nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
        if (jQuery.inArray("concept",nextWord_wordTypes_arr) != -1 ) {
            var primaryProperty_slug = nextWord_obj.conceptData.nodes.primaryProperty.slug;
            var propertySchema_slug = nextWord_obj.conceptData.nodes.propertySchema.slug;
            var propertySchema_rF_obj = words_in_obj[propertySchema_slug];
            var wordType_slug = nextWord_obj.conceptData.nodes.wordType.slug;
            var relToAdd_obj = MiscFunctions.blankRel_obj();
            relToAdd_obj.nodeFrom.slug = primaryProperty_slug;
            relToAdd_obj.relationshipType.slug = "isASpecificInstanceOf";
            relToAdd_obj.nodeTo.slug = "propertiesFor"+wordType_slug.substr(0,1).toUpperCase()+wordType_slug.substr(1)+"_primaryProperty";
            propertySchema_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_rF_obj,relToAdd_obj,words_in_obj);
            words_out_obj[propertySchema_slug] = propertySchema_rF_obj;
        }
    })
    */


    // Task 1: populate propertyData.metaData.parentConcepts;
    // within either schemaForProperty or within any of the schemas: propertySchemaFor[parent concept of that property]
    // if any property is recipient of
    // addToConceptGraphProperties, propagateProperty, addPropertyKey, addPropertyValue
    // then add the relevant concept to propertyData.metaData.parentConcepts (and propertyData.metaData.parentConcept ?)
    // when depicting propertySchemaFor[any concept], the appearance (border color?) of each property will be used to indicate
    // in which concept that property was created. A special appearance will be given to properties created within schemaForProperty
    jQuery.each(words_out_obj,function(nextWord_slug, nextWord_obj){
        var nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
        // do main schema for property
        if (nextWord_slug=="schemaForProperty") {
            var concept_slug = nextWord_obj.schemaData.metaData.governingConcept.slug;
            var rels_arr = nextWord_obj.schemaData.relationships;
            var numRels = rels_arr.length;
            for (var r=0;r<numRels;r++) {
                var nextRel_obj = rels_arr[r];
                var relType_slug = nextRel_obj.relationshipType.slug;
                var nF_slug = nextRel_obj.nodeFrom.slug;
                var nF_rF_obj = words_out_obj[nF_slug];
                var nF_wordTypes_arr = nF_rF_obj.wordData.wordTypes;
                var nT_slug = nextRel_obj.nodeTo.slug;
                var nT_rF_obj = words_out_obj[nT_slug];
                var nT_wordTypes_arr = nT_rF_obj.wordData.wordTypes;
                // Task 1:
                if ( (relType_slug=="addToConceptGraphProperties") || (relType_slug=="propagateProperty") || (relType_slug=="addPropertyKey") || (relType_slug=="addPropertyValue")) {
                    if (jQuery.inArray("property",nT_wordTypes_arr) > -1) {
                        nT_rF_obj.propertyData.metaData.parentConcept = concept_slug;
                        if (jQuery.inArray(concept_slug,nT_rF_obj.propertyData.metaData.parentConcepts) == -1) {
                            nT_rF_obj.propertyData.metaData.parentConcepts.push(concept_slug);
                        }
                        words_out_obj[nT_slug] = nT_rF_obj;
                    }
                }
            }
        }
        // cycle through each concept's propertySchemaFor[next concept]
        if (jQuery.inArray("concept",nextWord_wordTypes_arr) != -1 ) {
            var propertySchema_slug = nextWord_obj.conceptData.nodes.propertySchema.slug;
            var wordType_slug = nextWord_obj.conceptData.nodes.wordType.slug;
            var concept_slug = nextWord_obj.conceptData.nodes.concept.slug;
            console.log("concept_slug: "+concept_slug)
            console.log("propertySchema_slug: "+propertySchema_slug)
            var propertySchema_rF_obj = words_out_obj[propertySchema_slug];
            var propertySchema_rels_arr = propertySchema_rF_obj.schemaData.relationships;
            var numRels = propertySchema_rels_arr.length;
            for (var r=0;r<numRels;r++) {
                var nextRel_obj = propertySchema_rels_arr[r];
                var relType_slug = nextRel_obj.relationshipType.slug;
                var nF_slug = nextRel_obj.nodeFrom.slug;
                console.log("nF_slug: "+nF_slug)
                if (words_out_obj.hasOwnProperty(nF_slug)) {
                    var nF_rF_obj = words_out_obj[nF_slug];
                    var nF_wordTypes_arr = nF_rF_obj.wordData.wordTypes;
                    var nT_slug = nextRel_obj.nodeTo.slug;
                }
                console.log("nT_slug: "+nT_slug)
                if (words_out_obj.hasOwnProperty(nT_slug)) {
                    var nT_rF_obj = words_out_obj[nT_slug];
                    var nT_wordTypes_arr = nT_rF_obj.wordData.wordTypes;
                    // Task 1:
                    if ( (relType_slug=="addToConceptGraphProperties") || (relType_slug=="propagateProperty") || (relType_slug=="addPropertyKey") || (relType_slug=="addPropertyValue")) {
                        if (jQuery.inArray("property",nT_wordTypes_arr) > -1) {
                            nT_rF_obj.propertyData.metaData.parentConcept = concept_slug;
                            if (jQuery.inArray(concept_slug,nT_rF_obj.propertyData.metaData.parentConcepts) == -1) {
                                nT_rF_obj.propertyData.metaData.parentConcepts.push(concept_slug);
                            }
                            words_out_obj[nT_slug] = nT_rF_obj;
                        }
                    }
                }
            }
        }
    })
    // Task 2:
    // Within schemaForPropertiesFor[thatConcept]:
    // look at each instance of enumeration -- addToConceptGraphProperties -- property
    // and make the target property into a specific instance of the set: propertiesFor[thatConcept]_object_dependencies
    // (May rewrite this into enumprop_1)
    jQuery.each(words_out_obj,function(nextWord_slug, nextWord_obj){
        var nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
        if (jQuery.inArray("concept",nextWord_wordTypes_arr) != -1 ) {
            var propertySchema_slug = nextWord_obj.conceptData.nodes.propertySchema.slug;
            var wordType_slug = nextWord_obj.conceptData.nodes.wordType.slug;
            var concept_slug = nextWord_obj.conceptData.nodes.concept.slug;
            var propertySchema_rF_obj = words_out_obj[propertySchema_slug];
            var propertySchema_rels_arr = propertySchema_rF_obj.schemaData.relationships;
            var numRels = propertySchema_rels_arr.length;
            for (var r=0;r<numRels;r++) {
                var nextRel_obj = propertySchema_rels_arr[r];
                var relType_slug = nextRel_obj.relationshipType.slug;
                var nF_slug = nextRel_obj.nodeFrom.slug;
                if (words_out_obj.hasOwnProperty(nF_slug)) {
                    var nF_rF_obj = words_out_obj[nF_slug];
                    var nF_wordTypes_arr = nF_rF_obj.wordData.wordTypes;
                }
                var nT_slug = nextRel_obj.nodeTo.slug;
                if (words_out_obj.hasOwnProperty(nT_slug)) {
                    var nT_rF_obj = words_out_obj[nT_slug];
                    var nT_wordTypes_arr = nT_rF_obj.wordData.wordTypes;
                }
                // Task 2:
                if (nextRel_obj.relationshipType.slug=="addToConceptGraphProperties") {
                    if (jQuery.inArray("enumeration",nF_wordTypes_arr) > -1) {
                        if (jQuery.inArray("property",nT_wordTypes_arr) > -1) {
                            // create relationship:
                            // nT_slug -- isASpecificInstanceOf -- propertiesFor[thatConcept]_object_dependencies
                            var relToAdd_obj = MiscFunctions.blankRel_obj();
                            relToAdd_obj.nodeFrom.slug = nT_slug;
                            relToAdd_obj.relationshipType.slug = "isASpecificInstanceOf";
                            relToAdd_obj.nodeTo.slug = "propertiesFor"+wordType_slug.substr(0,1).toUpperCase()+wordType_slug.substr(1)+"_object_dependencies";
                            propertySchema_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_rF_obj,relToAdd_obj,words_out_obj);
                            words_out_obj[propertySchema_slug] = propertySchema_rF_obj;
                        }
                    }
                }
            }
        }
    })


    // Within schemaForPropertiesFor[thatConcept]:
    // look at each instance of property where:
    // propertyData.conceptGraphStyle.properties > 1
    // and make the relationship:
    // property -- isASpecificInstanceOf the set: propertiesFor[thatConcept]_object_multiProperties
    // (May rewrite this using the action-properties format )
    jQuery.each(words_out_obj,function(nextWord_slug, nextWord_obj){
        var nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
        if (jQuery.inArray("concept",nextWord_wordTypes_arr) != -1 ) {
            var propertySchema_slug = nextWord_obj.conceptData.nodes.propertySchema.slug;
            var wordType_slug = nextWord_obj.conceptData.nodes.wordType.slug;
            var propertySchema_rF_obj = words_out_obj[propertySchema_slug];
            var propertySchema_nodes_arr = propertySchema_rF_obj.schemaData.nodes;
            var numNodes = propertySchema_nodes_arr.length;
            for (var n=0;n<numNodes;n++) {
                var nextNode_obj = propertySchema_nodes_arr[n];
                var nextNode_slug = nextNode_obj.slug;
                if (words_out_obj.hasOwnProperty(nextNode_slug)) {
                    var nextNode_rF_obj = words_out_obj[nextNode_slug];
                    var nextNode_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;
                    if (jQuery.inArray("property",nextNode_wordTypes_arr) > -1) {
                        var thisPropertyParentConcepts_arr = nextNode_rF_obj.propertyData.metaData.parentConcepts;
                        if (jQuery.inArray(nextWord_slug,thisPropertyParentConcepts_arr) > -1) {
                            var numProps = 0;
                            var numProperties = 0;
                            if (nextNode_rF_obj.propertyData.conceptGraphStyle.hasOwnProperty("props")) {
                                numProps = nextNode_rF_obj.propertyData.conceptGraphStyle.props.length;
                            }
                            if (nextNode_rF_obj.propertyData.conceptGraphStyle.hasOwnProperty("properties")) {
                                numProperties = nextNode_rF_obj.propertyData.conceptGraphStyle.properties.length;
                            }
                            if (numProperties > 1) {
                                // create relationship:
                                // nextNode_slug -- isASpecificInstanceOf -- propertiesFor[thatConcept]_object_multiProperties
                                var relToAdd_obj = MiscFunctions.blankRel_obj();
                                relToAdd_obj.nodeFrom.slug = nextNode_slug;
                                relToAdd_obj.relationshipType.slug = "isASpecificInstanceOf";
                                relToAdd_obj.nodeTo.slug = "propertiesFor"+wordType_slug.substr(0,1).toUpperCase()+wordType_slug.substr(1)+"_object_multiProperties";
                                propertySchema_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_rF_obj,relToAdd_obj,words_out_obj);
                                words_out_obj[propertySchema_slug] = propertySchema_rF_obj;
                            }
                            if (numProperties == 1) {
                                // create relationship:
                                // nextNode_slug -- isASpecificInstanceOf -- propertiesFor[thatConcept]_object_1property
                                var relToAdd_obj = MiscFunctions.blankRel_obj();
                                relToAdd_obj.nodeFrom.slug = nextNode_slug;
                                relToAdd_obj.relationshipType.slug = "isASpecificInstanceOf";
                                relToAdd_obj.nodeTo.slug = "propertiesFor"+wordType_slug.substr(0,1).toUpperCase()+wordType_slug.substr(1)+"_object_1property";
                                propertySchema_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_rF_obj,relToAdd_obj,words_out_obj);
                                words_out_obj[propertySchema_slug] = propertySchema_rF_obj;
                            }
                            if (nextNode_rF_obj.propertyData.conceptGraphStyle.type=="string") {
                                if (numProps > 1) {
                                    // create relationship:
                                    // nextNode_slug -- isASpecificInstanceOf -- propertiesFor[thatConcept]_string_extraProps
                                    var relToAdd_obj = MiscFunctions.blankRel_obj();
                                    relToAdd_obj.nodeFrom.slug = nextNode_slug;
                                    relToAdd_obj.relationshipType.slug = "isASpecificInstanceOf";
                                    relToAdd_obj.nodeTo.slug = "propertiesFor"+wordType_slug.substr(0,1).toUpperCase()+wordType_slug.substr(1)+"_string_extraProps";
                                    propertySchema_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_rF_obj,relToAdd_obj,words_out_obj);
                                    words_out_obj[propertySchema_slug] = propertySchema_rF_obj;
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    // For each property, cycle through conceptGraphStyle.props and if key:type is found, then use its value to set conceptGraphStyle.type
    // This perhaps should be moved to propertyDataFunctions ???
    jQuery.each(words_out_obj,function(nextWord_slug, nextWord_obj){
        var nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
        if (jQuery.inArray("property",nextWord_wordTypes_arr) != -1 ) {
            if (nextWord_obj.propertyData.conceptGraphStyle.hasOwnProperty("props")) {
                var props_arr = nextWord_obj.propertyData.conceptGraphStyle.props;
                var numProps = props_arr.length;
                for (var p=0;p<numProps;p++) {
                    var nextProp_obj = props_arr[p];
                    if (nextProp_obj.key=="type") {
                        nextWord_obj.propertyData.conceptGraphStyle.type = nextProp_obj.value;
                        words_out_obj[nextWord_slug] = nextWord_obj;
                    }
                }
            }
        }
    });


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

function showSelectedWord_cm() {
    var selectedWord_slug = jQuery("#wordSelectorElem_cm option:selected").data("slug");
    var word_pre_rF_obj = words_cm_pre_rF_obj[selectedWord_slug];
    var word_pre_rF_str = JSON.stringify(word_pre_rF_obj,null,4);
    var word_post_rF_obj = words_cm_post_rF_obj[selectedWord_slug];
    var word_post_rF_str = JSON.stringify(word_post_rF_obj,null,4);
    jQuery("#word_pre_elem").html(word_pre_rF_str);
    jQuery("#word_post_elem").html(word_post_rF_str);
}
