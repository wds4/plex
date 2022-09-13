
import * as MiscFunctions from '../../../lib/miscFunctions.js';
import IpfsHttpClient from 'ipfs-http-client';
import * as PatternsActions from './maintenanceOfXYZ_patternActionSpecs.js';
import * as PropertyFormationFunctions from '../../buildConceptFamily/propertyFormationFunctionsUsingRelationships.js';
import { templatesByWordType_obj } from '../../addANewConcept';

import sendAsync from '../../../renderer';
const jQuery = require("jquery");

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

// coda for this pattern-match-function group: XYZ

export var words_XYZ_pre_rF_obj = {};
export var words_XYZ_post_rF_obj = {};

var newWords_obj = {};

export const createWordSelector_XYZ = () => {
    var wordSelectorHTML = "";
    wordSelectorHTML += "<select id=wordSelector_XYZ >";

    var numUpdatedWords_XYZ = 0;
    jQuery.each(words_XYZ_post_rF_obj,function(nextWord_slug,obj){

        var word_original_obj = words_XYZ_pre_rF_obj[nextWord_slug];
        var word_updated_obj = words_XYZ_post_rF_obj[nextWord_slug];

        var word_original_str = JSON.stringify(word_original_obj);
        var word_updated_str = JSON.stringify(word_updated_obj);

        wordSelectorHTML += "<option data-slug="+nextWord_slug+" >";
        /*
        if (word_original_obj.hasOwnProperty("newWord")) {
            wordSelectorHTML += " *** NEW WORD *** ";
            numUpdatedWords_XYZ ++;
        } else {
            if (word_original_str != word_updated_str) {
                wordSelectorHTML += " *** UPDATED *** ";
                numUpdatedWords_XYZ ++;
            }
        }
        */
        if (word_original_str != word_updated_str) {
            wordSelectorHTML += " *** UPDATED *** ";
            numUpdatedWords_XYZ ++;
        }

        wordSelectorHTML += nextWord_slug;
        wordSelectorHTML += "</option>";
    })

    jQuery.each(newWords_obj,function(nextWord_slug,obj){
        var word_original_obj = {};
        var word_updated_obj = newWords_obj[nextWord_slug];

        // words_XYZ_pre_rF_obj[nextWord_slug] = {"newWord": "yup, a brand new word!"}
        // words_XYZ_post_rF_obj[nextWord_slug] = word_updated_obj;

        var word_original_str = JSON.stringify(word_original_obj);
        var word_updated_str = JSON.stringify(word_updated_obj);

        wordSelectorHTML += "<option data-slug="+nextWord_slug+" >";
        wordSelectorHTML += " *** NEW WORD *** ";
        numUpdatedWords_XYZ ++;
        wordSelectorHTML += nextWord_slug;
        wordSelectorHTML += "</option>";

    })

    wordSelectorHTML += "</select>";
    jQuery("#numUpdatedWordsContainer_XYZ").html(numUpdatedWords_XYZ);
    jQuery("#wordSelectorElem_XYZ").html(wordSelectorHTML);
    jQuery("#wordSelectorElem_XYZ").change(function(){
        showSelectedWord_XYZ();
    });
    showSelectedWord_XYZ();
}

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

async function createNewNextOptionSubset(nextOptionSubset_slug) {
    var word_rF_obj = await MiscFunctions.createNewWordByTemplate("set");
    word_rF_obj.wordData.slug = nextOptionSubset_slug;
    newWords_obj[nextOptionSubset_slug] = word_rF_obj;

    return await word_rF_obj;
}
// identifyWordUpdates_XYZ iterates through all pattern-actions in this group
// and executes them; output is an updated word list with all necessary changes
async function identifyWordUpdates_XYZ(words_in_obj) {
    var words_out_obj = MiscFunctions.cloneObj(words_in_obj);
    var words_out_x_obj = MiscFunctions.cloneObj(words_in_obj);

    /*
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
    */
    var fooBarAsync = [];
    jQuery.each(words_out_x_obj,async function(nextWord_slug, nextWord_obj){
        var nextEntry_arr = [nextWord_slug,nextWord_obj];
        fooBarAsync.push(nextEntry_arr);
    });
    var numFooBarAsyncWords = fooBarAsync.length;
    // jQuery.each(words_out_x_obj,async function(nextWord_slug, nextWord_obj){
    for (var y=0;y<numFooBarAsyncWords;y++) {
        var nextWord_slug = fooBarAsync[y][0];
        var nextWord_obj = fooBarAsync[y][1];
        var nextWord_wordTypes_arr = [];
        if (nextWord_obj.hasOwnProperty("wordData")) {
            nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
        }
        if (jQuery.inArray("schema",nextWord_wordTypes_arr) != -1 ) {
            var nextSchema_nodes_arr = nextWord_obj.schemaData.nodes;
            var nextSchema_rels_arr = nextWord_obj.schemaData.relationships;

            var numNodes = nextSchema_nodes_arr.length;
            var numRels = nextSchema_rels_arr.length;

            //////// Look for PATTERN 1 or PATTERN 2
            var numPattern1 = 0;
            var numPattern2 = 0;
            for (var r=0;r<numRels;r++) {
                var nextRel_obj = nextSchema_rels_arr[r];
                var nodeFrom_slug = nextRel_obj.nodeFrom.slug;
                var relType = nextRel_obj.relationshipType.slug;
                var nodeTo_slug = nextRel_obj.nodeTo.slug;

                var nodeFrom_rF_obj = MiscFunctions.cloneObj(words_out_obj[nodeFrom_slug]);
                var nodeTo_rF_obj = MiscFunctions.cloneObj(words_out_obj[nodeTo_slug]);

                var nodeFrom_wordTypes_arr = nodeFrom_rF_obj.wordData.wordTypes;
                var nodeTo_wordTypes_arr = nodeTo_rF_obj.wordData.wordTypes;

                var pattern1detected = false;
                if (relType=="inducesPartitioningOf") {
                    if (jQuery.inArray("enumeration",nodeFrom_wordTypes_arr) > -1) {
                        if ( (jQuery.inArray("superset",nodeTo_wordTypes_arr) > -1) || (jQuery.inArray("set",nodeTo_wordTypes_arr) > -1) ) {
                            pattern1detected = true;
                        }
                    }
                }

                var pattern2detected = false;
                if (relType=="inducesOrganizationOf") {
                    if (jQuery.inArray("enumeration",nodeFrom_wordTypes_arr) > -1) {
                        if (jQuery.inArray("set",nodeTo_wordTypes_arr) > -1) {
                            pattern2detected = true;
                        }
                    }
                }

                if (pattern1detected) {
                    var propertyModuleKey = "";
                    if (nextRel_obj.relationshipType.hasOwnProperty("inducesPartitioningOfData")) {
                        propertyModuleKey = nextRel_obj.relationshipType.inducesPartitioningOfData.field;
                    }
                    var chiefEnumeration_slug = nodeFrom_slug;
                    var chiefEnumeration_rF_obj = nodeFrom_rF_obj;
                    // Need to complete pattern1 actions, which is to create the induced subset if does not already exist;
                    // this subset is referred to as sourceSet_slug under pattern2 (bc it is the source for later pattern2 things),
                    // but for pattern1 it will be referred to as inducedSubset_slug
                    // Then create the relationship:
                    // nodeFrom_slug (the inducing enumeration node) -- inducesOrganizationOfData, field: propertyModuleKey -- inducedSubset_slug
                    // Once complete, this will later trigger pattern2 (below)

                    // Step 1: check to see whether subset already exists; if not, make it

                    // Step 2: check to see whether relationship already exists; if not, make it

                }

                // if ( (pattern2detected) && (numPattern2==0) ) {
                if (pattern2detected) {

                    var propertyModuleKey = "";
                    if (nextRel_obj.relationshipType.hasOwnProperty("inducesOrganizationOfData")) {
                        propertyModuleKey = nextRel_obj.relationshipType.inducesOrganizationOfData.field;
                    }
                    var chiefEnumeration_slug = nodeFrom_slug;
                    var chiefEnumeration_rF_obj = nodeFrom_rF_obj;

                    var targetSet_slug = nodeTo_slug;
                    var targetSet_rF_obj = MiscFunctions.cloneObj(nodeTo_rF_obj);

                    var sourceConcept_slug = chiefEnumeration_rF_obj.enumerationData.source.concept;
                    var sourceConcept_rF_obj = MiscFunctions.cloneObj(words_out_obj[sourceConcept_slug]);
                    var sourceConcept_schema_slug = sourceConcept_rF_obj.conceptData.nodes.schema.slug;
                    var sourceConcept_schema_rF_obj = MiscFunctions.cloneObj(words_out_obj[sourceConcept_schema_slug]);

                    var sourceSet_slug = chiefEnumeration_rF_obj.enumerationData.source.set;

                    var propertyModule_slug = "property_module_"+propertyModuleKey;
                    var propertyModule_title = "Property Module: "+propertyModuleKey;
                    var propertyModule_name = "property module: "+propertyModuleKey;
                    console.log("numPattern2: "+numPattern2+"; propertyModuleKey: "+propertyModuleKey+"; propertyModule_slug: "+propertyModule_slug)
                    numPattern2++;
                    /*
                    // Not sure if this step is necessary; should this have already been built ????
                    if (!words_out_obj.hasOwnProperty(propertyModule_slug)) {
                        var propertyModule_slug = "property_module_"+propertyModuleKey;
                        var propertyModule_title = "Property Module for "+propertyModuleKey;
                        var propertyModule_name = "property module for "+propertyModuleKey;
                        var newProperty_rF_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["property"]));
                        newProperty_rF_obj.wordData.slug = propertyModule_slug;
                        var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
                        var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
                        newProperty_rF_obj.globalDynamicData.myDictionaries.push(myDictionary);
                        newProperty_rF_obj.globalDynamicData.myConceptGraphs.push(myConceptGraph);

                        var currentTime = Date.now();
                        // var randNonce = Math.floor(Math.random() * 1000);
                        var newKeyname = "dictionaryWord_"+propertyModuleKey+"_"+currentTime;
                        var generatedKey_obj = await ipfs.key.gen(newKeyname, {
                            type: 'rsa',
                            size: 2048
                        })
                        var newProperty_ipns = generatedKey_obj["id"];
                        var generatedKey_name = generatedKey_obj["name"];
                        // console.log("generatedKey_obj id: "+newProperty_ipns+"; name: "+generatedKey_name);
                        newProperty_rF_obj.metaData.ipns = newProperty_ipns;

                        newProperty_rF_obj.wordData.slug = propertyModule_slug;
                        newProperty_rF_obj.wordData.title = propertyModule_title;
                        newProperty_rF_obj.wordData.name = propertyModule_name;

                        newProperty_rF_obj.propertyData.type = "object_dependencies";
                        newProperty_rF_obj.propertyData.types.push("object_dependencies");

                        var newProperty_rF_str = JSON.stringify(newProperty_rF_obj,null,4);
                        console.log("newProperty_rF_str: "+newProperty_rF_str);

                        words_out_obj[propertyModule_slug] = await newProperty_rF_obj;

                        // then add slug to propMod_obj
                        // propMod_obj.property.slug = propertyModule_slug;
                    }
                    */


                    var targetConcepts_arr = targetSet_rF_obj.setData.metaData.governingConcepts;
                    var numTargetConcepts = targetConcepts_arr.length;
                    // ??? not sure whether there must be only one target concept or whether ALL governing concepts of the target set
                    // should become target concepts. If only one, then which one must be specified at an earlier point in the process.
                    // Usually, there will be only one entry in governingConcepts, so only one targetConcept.
                    for (var t=0;t<numTargetConcepts;t++) {
                        var nextTargetConcept_slug = targetConcepts_arr[t];
                        var nextTargetConcept_rF_obj = MiscFunctions.cloneObj(words_out_obj[nextTargetConcept_slug]);
                        var nextTargetConcept_schema_slug = nextTargetConcept_rF_obj.conceptData.nodes.schema.slug;
                        var nextTargetConcept_propertySchema_slug = nextTargetConcept_rF_obj.conceptData.nodes.propertySchema.slug;
                        var nextTargetConcept_propertySchema_rF_obj = MiscFunctions.cloneObj(words_out_obj[nextTargetConcept_propertySchema_slug]);
                        var nextTargetConcept_JSONSchema_slug = nextTargetConcept_rF_obj.conceptData.nodes.JSONSchema.slug;
                        var nextTargetConcept_primaryProperty_slug = nextTargetConcept_rF_obj.conceptData.nodes.primaryProperty.slug;
                        var nextTargetConcept_wordType_slug = nextTargetConcept_rF_obj.conceptData.nodes.wordType.slug;

                        var nextTargetConcept_propertyPath = nextTargetConcept_rF_obj.conceptData.propertyPath;

                        var nextTargetConcept_schema_rF_obj = MiscFunctions.cloneObj(words_out_obj[nextTargetConcept_schema_slug]);

                        if (!nextTargetConcept_rF_obj.conceptData.hasOwnProperty("propertyModuleData")) {
                            nextTargetConcept_rF_obj.conceptData.propertyModuleData = {};
                        }
                        var propertyModuleData_all_obj = nextTargetConcept_rF_obj.conceptData.propertyModuleData;
                        if (!propertyModuleData_all_obj.hasOwnProperty(propertyModuleKey)) {
                            propertyModuleData_all_obj[propertyModuleKey] = {};
                        }
                        propertyModuleData_all_obj[propertyModuleKey].key =  propertyModuleKey;
                        propertyModuleData_all_obj[propertyModuleKey].enumeration =  {};
                        propertyModuleData_all_obj[propertyModuleKey].enumeration.slug = chiefEnumeration_slug;
                        propertyModuleData_all_obj[propertyModuleKey].property =  {};
                        propertyModuleData_all_obj[propertyModuleKey].property.slug = propertyModule_slug;
                        propertyModuleData_all_obj[propertyModuleKey].set =  {};
                        propertyModuleData_all_obj[propertyModuleKey].set.slug = targetSet_slug;
                        propertyModuleData_all_obj[propertyModuleKey].elements =  {};
                        // still need to populate elements
                        // next, subsets of newSetSlug must be generated if not already existing; one for each element of enumeration
                        var options_arr = chiefEnumeration_rF_obj.enumerationData.conceptGraphStyle.enum.slugs;
                        var numOptions = options_arr.length;
                        for (var z=0;z<numOptions;z++) {
                        // for (var z=0;z<2;z++) {
                            var nextOption_slug = options_arr[z];
                            console.log("nextOption_slug: "+nextOption_slug)
                            var nextOptionSubset_slug = targetSet_slug+"_"+nextOption_slug;
                            // var nextOptionEnumeration_slug = chiefEnumeration_slug+"_"+nextOption_slug;
                            var nextOptionEnumeration_slug = "enumerationFrom_"+sourceSet_slug+"_"+nextOption_slug;
                            var nextOptionPropertyModule_slug = propertyModule_slug+"_"+nextOption_slug;
                            var nextOptionPropertySchema_slug = nextTargetConcept_propertySchema_slug+"_"+propertyModuleKey+"_"+nextOption_slug;
                            var nextOptionJSONSchema_slug = nextTargetConcept_JSONSchema_slug+"_"+propertyModuleKey+"_"+nextOption_slug;
                            var nextOptionPrimaryProperty_slug = nextTargetConcept_primaryProperty_slug+"_"+propertyModuleKey+"_"+nextOption_slug;
                            // any other way to check whether these have been created?
                            if (!words_out_obj.hasOwnProperty(nextOptionSubset_slug)) {
                                words_in_obj[nextOptionSubset_slug] = {"newWord": "yup, a brand new word! - "+nextOptionSubset_slug+" - before"}
                                words_out_obj[nextOptionSubset_slug] = {"newWord": "yup, a brand new word! - "+nextOptionSubset_slug+" - after"}
                                var newWord_subset_obj = await MiscFunctions.createNewWordByTemplate("set");
                                newWord_subset_obj.wordData.slug = nextOptionSubset_slug;
                                newWord_subset_obj.wordData.title = nextOptionSubset_slug;
                                newWord_subset_obj.wordData.name = nextOptionSubset_slug;
                                words_out_obj[nextOptionSubset_slug] = await newWord_subset_obj;
                            }
                            if (!words_out_obj.hasOwnProperty(nextOptionEnumeration_slug)) {
                                words_in_obj[nextOptionEnumeration_slug] = {"newWord": "yup, a brand new word! - "+nextOptionEnumeration_slug+" - before"}
                                words_out_obj[nextOptionEnumeration_slug] = {"newWord": "yup, a brand new word! - "+nextOptionEnumeration_slug+" - after"}
                                var nextOptionEnumeration_title = "Enumeration from "+sourceSet_slug+": "+nextOption_slug;
                                var nextOptionEnumeration_name = "enumeration from "+sourceSet_slug+": "+nextOption_slug;
                                var newWord_enumeration_obj = await MiscFunctions.createNewWordByTemplate("enumeration");
                                newWord_enumeration_obj.wordData.slug = nextOptionEnumeration_slug;
                                newWord_enumeration_obj.wordData.title = nextOptionEnumeration_title;
                                newWord_enumeration_obj.wordData.name = nextOptionEnumeration_name;
                                newWord_enumeration_obj.enumerationData.slug = nextOptionEnumeration_slug;
                                newWord_enumeration_obj.enumerationData.title = nextOptionEnumeration_title;
                                newWord_enumeration_obj.enumerationData.name = nextOptionEnumeration_name;
                                newWord_enumeration_obj.enumerationData.source.concept = sourceConcept_slug;
                                newWord_enumeration_obj.enumerationData.source.set = sourceSet_slug;
                                words_out_obj[nextOptionEnumeration_slug] = await newWord_enumeration_obj;
                            }
                            if (!words_out_obj.hasOwnProperty(nextOptionPropertyModule_slug)) {
                                words_in_obj[nextOptionPropertyModule_slug] = {"newWord": "yup, a brand new word! - "+nextOptionPropertyModule_slug+" - before"}
                                words_out_obj[nextOptionPropertyModule_slug] = {"newWord": "yup, a brand new word! - "+nextOptionPropertyModule_slug+" - after"}
                                var newWord_propertyModule_obj = await MiscFunctions.createNewWordByTemplate("property");
                                var nextOptionPropertyModule_title = propertyModule_title+"; "+nextOption_slug;
                                var nextOptionPropertyModule_name = propertyModule_name+"; "+nextOption_slug;
                                newWord_propertyModule_obj.wordData.slug = nextOptionPropertyModule_slug;
                                newWord_propertyModule_obj.wordData.title = nextOptionPropertyModule_title;
                                newWord_propertyModule_obj.wordData.name = nextOptionPropertyModule_name;
                                newWord_propertyModule_obj.propertyData.slug = nextOptionPropertyModule_slug;
                                newWord_propertyModule_obj.propertyData.title = nextOptionPropertyModule_title;
                                newWord_propertyModule_obj.propertyData.name = nextOptionPropertyModule_name;
                                newWord_propertyModule_obj.propertyData.metaData.parentConcept = nextTargetConcept_slug;
                                newWord_propertyModule_obj.propertyData.metaData.parentConcepts.push(nextTargetConcept_slug);
                                words_out_obj[nextOptionPropertyModule_slug] = await newWord_propertyModule_obj;

                            }
                            if (!words_out_obj.hasOwnProperty(nextOptionJSONSchema_slug)) {
                                words_in_obj[nextOptionJSONSchema_slug] = {"newWord": "yup, a brand new word! - "+nextOptionJSONSchema_slug+" - before"}
                                words_out_obj[nextOptionJSONSchema_slug] = {"newWord": "yup, a brand new word! - "+nextOptionJSONSchema_slug+" - after"}
                                var newWord_JSONSchema_obj = await MiscFunctions.createNewWordByTemplate("JSONSchema");
                                newWord_JSONSchema_obj.wordData.slug = nextOptionJSONSchema_slug;
                                newWord_JSONSchema_obj.wordData.title = nextOptionJSONSchema_slug;
                                newWord_JSONSchema_obj.wordData.name = nextOptionJSONSchema_slug;
                                newWord_JSONSchema_obj.JSONSchemaData.metaData.governingConcept.slug = nextTargetConcept_slug;
                                newWord_JSONSchema_obj.JSONSchemaData.metaData.primaryProperty = nextTargetConcept_propertyPath;
                                newWord_JSONSchema_obj.JSONSchemaData.metaData.primaryPropertySlug = nextOptionPrimaryProperty_slug;
                                newWord_JSONSchema_obj.JSONSchemaData.requiredDefinitions.push(nextOptionPrimaryProperty_slug);
                                newWord_JSONSchema_obj.definitions[nextOptionPrimaryProperty_slug] = {};
                                newWord_JSONSchema_obj.definitions[nextOptionPrimaryProperty_slug].type = "object";
                                newWord_JSONSchema_obj.definitions[nextOptionPrimaryProperty_slug].required = [];
                                newWord_JSONSchema_obj.definitions[nextOptionPrimaryProperty_slug].properties = {};
                                newWord_JSONSchema_obj.required.push(nextTargetConcept_propertyPath);
                                newWord_JSONSchema_obj.properties[nextTargetConcept_propertyPath] = {};
                                newWord_JSONSchema_obj.properties[nextTargetConcept_propertyPath]["$ref"] = "#/definitions/"+nextOptionPrimaryProperty_slug;
                                words_out_obj[nextOptionJSONSchema_slug] = await newWord_JSONSchema_obj;
                            }
                            if (!words_out_obj.hasOwnProperty(nextOptionPropertySchema_slug)) {
                                words_in_obj[nextOptionPropertySchema_slug] = {"newWord": "yup, a brand new word! - "+nextOptionPropertySchema_slug+" - before"}
                                words_out_obj[nextOptionPropertySchema_slug] = {"newWord": "yup, a brand new word! - "+nextOptionPropertySchema_slug+" - after"}
                                var nextOptionPropertySchema_obj = await MiscFunctions.createNewWordByTemplate("schema");
                                nextOptionPropertySchema_obj.wordData.slug = nextOptionPropertySchema_slug;
                                nextOptionPropertySchema_obj.wordData.title = nextOptionPropertySchema_slug;
                                nextOptionPropertySchema_obj.wordData.name = nextOptionPropertySchema_slug;
                                nextOptionPropertySchema_obj.schemaData.metaData.governingConcept.slug = nextTargetConcept_slug;
                                nextOptionPropertySchema_obj.schemaData.metaData.types = ["propertySchema"];
                                nextOptionPropertySchema_obj.schemaData.types = ["propertySchema"];
                                words_out_obj[nextOptionPropertySchema_slug] = await nextOptionPropertySchema_obj;
                            } else {
                                var nextOptionPropertySchema_obj = words_out_obj[nextOptionPropertySchema_slug];
                            }
                            if (!words_out_obj.hasOwnProperty(nextOptionPrimaryProperty_slug)) {
                                words_in_obj[nextOptionPrimaryProperty_slug] = {"newWord": "yup, a brand new word! - "+nextOptionPrimaryProperty_slug+" - before"}
                                words_out_obj[nextOptionPrimaryProperty_slug] = {"newWord": "yup, a brand new word! - "+nextOptionPrimaryProperty_slug+" - after"}
                                var nextOptionPrimaryProperty_obj = await MiscFunctions.createNewWordByTemplate("property");
                                nextOptionPrimaryProperty_obj.wordData.slug = nextOptionPrimaryProperty_slug;
                                nextOptionPrimaryProperty_obj.wordData.title = nextOptionPrimaryProperty_slug;
                                nextOptionPrimaryProperty_obj.wordData.name = nextOptionPrimaryProperty_slug;
                                nextOptionPrimaryProperty_obj.propertyData.slug = nextOptionPrimaryProperty_slug;
                                nextOptionPrimaryProperty_obj.propertyData.title = nextOptionPrimaryProperty_slug;
                                nextOptionPrimaryProperty_obj.propertyData.metaData.parentConcept = nextTargetConcept_slug;
                                nextOptionPrimaryProperty_obj.propertyData.metaData.parentConcepts.push(nextTargetConcept_slug);
                                words_out_obj[nextOptionPrimaryProperty_slug] = await nextOptionPrimaryProperty_obj;
                            }
                            propertyModuleData_all_obj[propertyModuleKey].elements[nextOption_slug] = {};
                            propertyModuleData_all_obj[propertyModuleKey].elements[nextOption_slug].slug = nextOption_slug;
                            propertyModuleData_all_obj[propertyModuleKey].elements[nextOption_slug].subset = nextOptionSubset_slug;
                            propertyModuleData_all_obj[propertyModuleKey].elements[nextOption_slug].enumeration = nextOptionEnumeration_slug;
                            propertyModuleData_all_obj[propertyModuleKey].elements[nextOption_slug].property = nextOptionPropertyModule_slug;
                            propertyModuleData_all_obj[propertyModuleKey].elements[nextOption_slug].propertySchema = nextOptionPropertySchema_slug;
                            propertyModuleData_all_obj[propertyModuleKey].elements[nextOption_slug].JSONSchema = nextOptionJSONSchema_slug;
                            propertyModuleData_all_obj[propertyModuleKey].elements[nextOption_slug].primaryProperty = nextOptionPrimaryProperty_slug;

                            // add rel to the main schema for target concept, nextTargetConcept_schema_slug
                            // 1. nextOptionJSONSchema_slug -- isTheJSONSchemaFor -- nextOptionSubset_slug


                            // add these rels to nextOptionPropertySchema_slug
                            // 2. nextOptionPropertyModule_slug -- addToConceptGraphProperties, field: propertyModuleKey -- nextOptionPrimaryProperty_slug
                            // 3. nextOptionEnumeration_slug -- addToConceptGraphProperties, field: propertyModuleKey -- nextOptionPropertyModule_slug
                            // 4. nextOptionPrimaryProperty_slug -- isASpecificInstanceOf -- propertiesFor(main concept)_primaryProperty
                            // 5. nextOptionPropertyModule_slug -- isASpecificInstanceOf -- propertiesFor(main concept)_object_dependencies
                            // 6. nextOptionPrimaryProperty_slug -- isThePrimaryPropertyFor -- nextOptionJSONSchema_slug


                            // optional rels:
                            // 7. propertyModule_slug -- restrictionOfOptionProduces, field: propertyModuleKey -- nextOptionPropertyModule_slug
                            // 8. chiefEnumeration_slug -- restrictionOfOptionProduces, field: propertyModuleKey -- nextOptionEnumeration_slug
                            // 9. nextTargetConcept_primaryProperty_slug -- restrictionOfOptionProduces, field: propertyModuleKey -- nextOptionPrimaryProperty_slug

                            // add rel to the main schema for source concept, sourceConcept_schema_slug
                            // 10. nextOption_slug -- enumeratesSingleValue -- nextOptionEnumeration_slug

                            // insert nextOptionPropertySchema_slug into schemaImports for nextTargetConcept_propertySchema_slug

                            nextTargetConcept_propertySchema_rF_obj = MiscFunctions.insertSchemaIntoSchemaImports(await nextTargetConcept_propertySchema_rF_obj,nextOptionPropertySchema_slug,await words_out_obj);
                            words_out_obj[nextTargetConcept_propertySchema_slug] = nextTargetConcept_propertySchema_rF_obj;

                            var newRel1_obj = MiscFunctions.blankRel_obj();
                            var newRel2_obj = MiscFunctions.blankRel_obj();
                            var newRel3_obj = MiscFunctions.blankRel_obj();
                            var newRel4_obj = MiscFunctions.blankRel_obj();
                            var newRel5_obj = MiscFunctions.blankRel_obj();
                            var newRel6_obj = MiscFunctions.blankRel_obj();
                            var newRel7_obj = MiscFunctions.blankRel_obj();
                            var newRel8_obj = MiscFunctions.blankRel_obj();
                            var newRel9_obj = MiscFunctions.blankRel_obj();
                            var newRel10_obj = MiscFunctions.blankRel_obj();

                            newRel1_obj.nodeTo.slug = nextOptionSubset_slug;
                            newRel2_obj.nodeTo.slug = nextOptionPrimaryProperty_slug
                            newRel3_obj.nodeTo.slug = nextOptionPropertyModule_slug
                            newRel4_obj.nodeTo.slug = "propertiesFor"+nextTargetConcept_wordType_slug.substr(0,1).toUpperCase()+nextTargetConcept_wordType_slug.substr(1)+"_primaryProperty";
                            newRel5_obj.nodeTo.slug = "propertiesFor"+nextTargetConcept_wordType_slug.substr(0,1).toUpperCase()+nextTargetConcept_wordType_slug.substr(1)+"_object_dependencies";
                            newRel6_obj.nodeTo.slug = nextOptionJSONSchema_slug;
                            newRel7_obj.nodeTo.slug = nextOptionPropertyModule_slug;
                            newRel8_obj.nodeTo.slug = nextOptionEnumeration_slug;
                            newRel9_obj.nodeTo.slug = nextOptionPrimaryProperty_slug;
                            newRel10_obj.nodeTo.slug = nextOptionEnumeration_slug;

                            newRel1_obj.nodeFrom.slug = nextOptionJSONSchema_slug;
                            newRel2_obj.nodeFrom.slug = nextOptionPropertyModule_slug;
                            newRel3_obj.nodeFrom.slug = nextOptionEnumeration_slug;
                            newRel4_obj.nodeFrom.slug = nextOptionPrimaryProperty_slug;
                            newRel5_obj.nodeFrom.slug = nextOptionPropertyModule_slug;
                            newRel6_obj.nodeFrom.slug = nextOptionPrimaryProperty_slug;
                            newRel7_obj.nodeFrom.slug = propertyModule_slug;
                            newRel8_obj.nodeFrom.slug = chiefEnumeration_slug;
                            newRel9_obj.nodeFrom.slug = nextTargetConcept_primaryProperty_slug;
                            newRel10_obj.nodeFrom.slug = nextOption_slug;

                            newRel1_obj.relationshipType.slug = "isTheJSONSchemaFor";
                            newRel2_obj.relationshipType.slug = "addToConceptGraphProperties";
                            newRel3_obj.relationshipType.slug = "addToConceptGraphProperties";
                            newRel4_obj.relationshipType.slug = "isASpecificInstanceOf";
                            newRel5_obj.relationshipType.slug = "isASpecificInstanceOf";
                            newRel6_obj.relationshipType.slug = "isThePrimaryPropertyFor";
                            newRel7_obj.relationshipType.slug = "restrictionOfOptionProduces";
                            newRel8_obj.relationshipType.slug = "restrictionOfOptionProduces";
                            newRel9_obj.relationshipType.slug = "restrictionOfOptionProduces";
                            newRel10_obj.relationshipType.slug = "enumeratesSingleValue";

                            newRel2_obj.relationshipType.addToConceptGraphPropertiesData = {};
                            newRel2_obj.relationshipType.addToConceptGraphPropertiesData.field = propertyModuleKey;
                            newRel3_obj.relationshipType.addToConceptGraphPropertiesData = {};
                            newRel3_obj.relationshipType.addToConceptGraphPropertiesData.field = propertyModuleKey;
                            newRel7_obj.relationshipType.restrictionOfOptionProducesData = {};
                            newRel7_obj.relationshipType.restrictionOfOptionProducesData.field = propertyModuleKey;
                            newRel8_obj.relationshipType.restrictionOfOptionProducesData = {};
                            newRel8_obj.relationshipType.restrictionOfOptionProducesData.field = propertyModuleKey;
                            newRel9_obj.relationshipType.restrictionOfOptionProducesData = {};
                            newRel9_obj.relationshipType.restrictionOfOptionProducesData.field = propertyModuleKey;

                            /*
                            var newRel2_str = JSON.stringify(newRel2_obj,null,4);
                            console.log("newRel2_str: "+newRel2_str);
                            var nextOptionPropertySchema_str = JSON.stringify(nextOptionPropertySchema_obj,null,4);
                            console.log("nextOptionPropertySchema_str before: "+nextOptionPropertySchema_str);
                            var nextOptionPropertySchema_str = JSON.stringify(nextOptionPropertySchema_obj,null,4);
                            console.log("nextOptionPropertySchema_str after: "+nextOptionPropertySchema_str);
                            */
                            nextTargetConcept_schema_rF_obj = MiscFunctions.updateSchemaWithNewRel(await nextTargetConcept_schema_rF_obj,newRel1_obj,await words_out_obj);
                            words_out_obj[nextTargetConcept_schema_slug] = nextTargetConcept_schema_rF_obj;

                            sourceConcept_schema_rF_obj = MiscFunctions.updateSchemaWithNewRel(await sourceConcept_schema_rF_obj,newRel10_obj,await words_out_obj);
                            words_out_obj[sourceConcept_schema_slug] = sourceConcept_schema_rF_obj;

                            /*
                            var newRel2_str = JSON.stringify(newRel2_obj,null,4);
                            console.log("newRel2_str: "+newRel2_str)
                            var nextOptionPropertySchema_str = JSON.stringify(nextOptionPropertySchema_obj,null,4);
                            console.log("nextOptionPropertySchema_str: "+nextOptionPropertySchema_str)
                            */
                            nextOptionPropertySchema_obj = MiscFunctions.updateSchemaWithNewRel(await nextOptionPropertySchema_obj,newRel2_obj,await words_out_obj);
                            words_out_obj[nextOptionPropertySchema_slug] = nextOptionPropertySchema_obj;
                            nextOptionPropertySchema_obj = MiscFunctions.updateSchemaWithNewRel(await nextOptionPropertySchema_obj,newRel3_obj,await words_out_obj);
                            words_out_obj[nextOptionPropertySchema_slug] = nextOptionPropertySchema_obj;
                            nextOptionPropertySchema_obj = MiscFunctions.updateSchemaWithNewRel(await nextOptionPropertySchema_obj,newRel4_obj,await words_out_obj);
                            words_out_obj[nextOptionPropertySchema_slug] = nextOptionPropertySchema_obj;
                            nextOptionPropertySchema_obj = MiscFunctions.updateSchemaWithNewRel(await nextOptionPropertySchema_obj,newRel5_obj,await words_out_obj);
                            words_out_obj[nextOptionPropertySchema_slug] = nextOptionPropertySchema_obj;
                            nextOptionPropertySchema_obj = MiscFunctions.updateSchemaWithNewRel(await nextOptionPropertySchema_obj,newRel6_obj,await words_out_obj);
                            words_out_obj[nextOptionPropertySchema_slug] = nextOptionPropertySchema_obj;
                            nextOptionPropertySchema_obj = MiscFunctions.updateSchemaWithNewRel(await nextOptionPropertySchema_obj,newRel7_obj,await words_out_obj);
                            words_out_obj[nextOptionPropertySchema_slug] = nextOptionPropertySchema_obj;
                            nextOptionPropertySchema_obj = MiscFunctions.updateSchemaWithNewRel(await nextOptionPropertySchema_obj,newRel8_obj,await words_out_obj);
                            words_out_obj[nextOptionPropertySchema_slug] = nextOptionPropertySchema_obj;
                            nextOptionPropertySchema_obj = MiscFunctions.updateSchemaWithNewRel(await nextOptionPropertySchema_obj,newRel9_obj,await words_out_obj);
                            words_out_obj[nextOptionPropertySchema_slug] = nextOptionPropertySchema_obj;
                        }
                        words_out_obj[nextTargetConcept_slug] = nextTargetConcept_rF_obj;
                    }
                }
            }
        }
    }

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

    var newWords_obj = {
        "newWord20_slug": "brandNewWord20",
        "newWord21_slug": "brandNewWord21",
        "newWord22_slug": "brandNewWord22",
        "newWord23_slug": "brandNewWord23",
        "newWord24_slug": "brandNewWord24",
        "newWord25_slug": "brandNewWord25"
    };

    jQuery.each(newWords_obj,async function(slug1,slug2){
        var newWordNext_slug = slug2;
        words_in_obj[newWordNext_slug] = {"newWord": "yup, a brand new word! - "+slug2+" - before"}
        words_out_obj[newWordNext_slug] = {"newWord": "yup, a brand new word! - "+slug2+" - after"}

        var newWordNext_obj = await MiscFunctions.createNewWordByTemplate("word");
        newWordNext_obj.wordData.title = "updated title";
        words_out_obj[newWordNext_slug] = await newWordNext_obj;
    })
    */

    return await words_out_obj;
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
