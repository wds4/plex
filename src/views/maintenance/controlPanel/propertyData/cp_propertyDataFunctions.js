
import * as MiscFunctions from '../../../../lib/miscFunctions.js';
import { ppa_rel_Patterns, ppa_rel_Actions, ppa_node_Patterns, ppa_node_Actions } from './propertyProcessActions.js';
// import * as PropertyFormationFunctions from '../../../buildConceptFamily/propertyFormationFunctionsUsingRelationships.js';
import sendAsync from '../../../../renderer';
import * as ControlPanelFunctions from '../maintenanceControlPanel.js';
const jQuery = require("jquery");

// coda for this pattern-match-function group: pDM (was XYZ)

export var words_pDM_pre_rF_obj = {};
export var words_pDM_post_rF_obj = {};

// fetchConceptGraph_pDM is called by maintenanceOfXYZ
// fetchConceptGraph_pDM obtains the full list of words from SQL;
// then calls identifyWordUpdates_pDM to determine all edits that must be made
export const cp_fetchConceptGraph_pDM = async (conceptGrapTableName,currentTaskNumber,updateChangedWords) => {
    words_pDM_pre_rF_obj = {};
    words_pDM_post_rF_obj = {};
    var sql = " SELECT * FROM "+conceptGrapTableName;
    // console.log("sql: "+sql);

    sendAsync(sql).then( async (words_pDM_pre_arr) => {
        var numWords = words_pDM_pre_arr.length;

        for (var w=0;w<numWords;w++) {
            var nextWord = words_pDM_pre_arr[w];
            var nextWord_rawFile_str = nextWord.rawFile;
            var nextWord_rawFile_obj = JSON.parse(nextWord_rawFile_str);
            var nextWord_slug = nextWord_rawFile_obj.wordData.slug;
            words_pDM_pre_rF_obj[nextWord_slug]=JSON.parse(JSON.stringify(nextWord_rawFile_obj));
        }

        words_pDM_post_rF_obj = identifyWordUpdates_pDM(words_pDM_pre_rF_obj);

        var numUpdatedWords_pDM = 0;
        for (var w=0;w<numWords;w++) {
            var nextWord = words_pDM_pre_arr[w];
            var nextWord_rawFile_str = nextWord.rawFile;
            var nextWord_rawFile_obj = JSON.parse(nextWord_rawFile_str);
            var nextWord_slug = nextWord_rawFile_obj.wordData.slug;

            var word_original_obj = words_pDM_pre_rF_obj[nextWord_slug];
            var word_updated_obj = words_pDM_post_rF_obj[nextWord_slug];

            var word_original_str = JSON.stringify(word_original_obj);
            var word_updated_str = JSON.stringify(word_updated_obj);

            if (word_original_str != word_updated_str) {
                numUpdatedWords_pDM ++;
                if (updateChangedWords) {
                   MiscFunctions.updateWordInAllTables(word_updated_obj)
                }
            }
        }
        ControlPanelFunctions.updateControlPanelDisplay(numUpdatedWords_pDM,currentTaskNumber);
        ControlPanelFunctions.proceedWithNextTask();
        return numUpdatedWords_pDM;
    });
}

// identifyWordUpdates_pDM iterates through all pattern-actions in this group
// and executes them; output is an updated word list with all necessary changes
function identifyWordUpdates_pDM_depr(words_in_obj) {
    var words_out_obj = MiscFunctions.cloneObj(words_in_obj);

    jQuery.each(words_out_obj,function(nextWord_slug, nextWord_obj){
        var nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
        if (jQuery.inArray("enumeration",nextWord_wordTypes_arr) != -1 ) {
            // * test to make sure working *
            nextWord_obj.wordData.foo = "maintenance of XYZ";
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

    return words_out_obj;
}

// rebuild of rebuildJSONSchemaDefinitions2 from:
// import * as PropertyFormationFunctions from '../../../buildConceptFamily/propertyFormationFunctionsUsingRelationships.js';
// Rebuild of rebuildJSONSchemaDefinitions, except: instead of updating automatically,
// return the modified word
// (for use in propertyDataFunctions)
export function rebuildJSONSchemaDefinitions_pDM(jsonSchema_rF_obj,words_out_obj) {
    var jsonSchema_rF_str = JSON.stringify(jsonSchema_rF_obj,null,4);
    // console.log("qwerty populatePropertyRequiredDefinitionsLists; jsonSchema_rF_str: "+jsonSchema_rF_str)
    var mainPath = jsonSchema_rF_obj.JSONSchemaData.metaData.primaryProperty;
    var governingConcept_slug = jsonSchema_rF_obj.JSONSchemaData.metaData.governingConcept.slug;

    // var governingConcept_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[governingConcept_slug]));
    var governingConcept_rF_obj = JSON.parse(JSON.stringify(words_out_obj[governingConcept_slug]));
    var primaryProperty_slug = governingConcept_rF_obj.conceptData.nodes.primaryProperty.slug;
    // var primaryProperty_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[primaryProperty_slug]));
    var primaryProperty_rF_obj = JSON.parse(JSON.stringify(words_out_obj[primaryProperty_slug]));
    var definitionList_arr = primaryProperty_rF_obj.propertyData.definitions.indirect;
    var definitionList_str = JSON.stringify(definitionList_arr,null,4);
    // console.log("definitionList_str: "+definitionList_str);
    var numDefs = definitionList_arr.length;
    // clear definitions
    jsonSchema_rF_obj.definitions = {};
    // repopulate definitions
    // first add the primaryProperty definition
    var nextDef_key = primaryProperty_rF_obj.propertyData.JSONSchemaStyle.key;
    var nextDef_value = primaryProperty_rF_obj.propertyData.JSONSchemaStyle.value;
    // var nextDef_dependencies = primaryProperty_rF_obj.propertyData.JSONSchemaStyle.dependencies;
    // jsonSchema_rF_obj.definitions[primaryProperty_slug] = {}
    // jsonSchema_rF_obj.definitions[primaryProperty_slug][nextDef_key] = nextDef_value;
    jsonSchema_rF_obj.definitions[primaryProperty_slug] = nextDef_value;
    // next add all dependent properties
    for (var d=0;d<numDefs;d++) {
        var nextProperty_slug = definitionList_arr[d];

        // var nextProperty_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[nextProperty_slug]));
        var nextProperty_rF_obj = JSON.parse(JSON.stringify(words_out_obj[nextProperty_slug]));
        var nextProperty_rF_str = JSON.stringify(nextProperty_rF_obj,null,4);
        // console.log("nextProperty_rF_str: "+nextProperty_rF_str)
        if (nextProperty_rF_obj.hasOwnProperty("propertyData")) {
            var nextDef_key = nextProperty_rF_obj.propertyData.JSONSchemaStyle.key;
            var nextDef_value = nextProperty_rF_obj.propertyData.JSONSchemaStyle.value;
        }
        if (nextProperty_rF_obj.hasOwnProperty("enumerationData")) {
            var nextDef_key = nextProperty_rF_obj.enumerationData.JSONSchemaStyle.key;
            var nextDef_value = nextProperty_rF_obj.enumerationData.JSONSchemaStyle.value;
        }
        // jsonSchema_rF_obj.definitions[nextProperty_slug] = {}
        // jsonSchema_rF_obj.definitions[nextProperty_slug][nextDef_key] = nextDef_value;
        jsonSchema_rF_obj.definitions[nextProperty_slug] = nextDef_value;
    }
    // var jsonSchema_rF_str = JSON.stringify(jsonSchema_rF_obj,null,4);
    // console.log("qwerty populatePropertyRequiredDefinitionsLists; jsonSchema_slug: "+jsonSchema_slug+"; jsonSchema_rF_str: "+jsonSchema_rF_str)
    // = jsonSchema_rF_obj.properties[mainPath]["$ref"];
    // var newKeyname = "";
    // var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
    // var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
    // insertOrUpdateWordIntoMyConceptGraphAndMyDictionary(jsonSchema_rF_str,newKeyname,myConceptGraph,myDictionary)
    return jsonSchema_rF_obj;
}

// export const sortPropertyData = (words_in_obj) => {
export const identifyWordUpdates_pDM = (words_in_obj) => {
    // console.log("qwerty sortPropertyData")
    var words_out_obj = {};
    var schema_rels_arr = [];
    var completeActions_node_arr = [];
    var completeActions_rel_arr = [];
    words_out_obj = MiscFunctions.cloneObj(words_in_obj);

    // put together a list of all relationships by scraping them from each schema passed into the function
    Object.entries(words_out_obj).forEach(entry => {
        const [nextWord_slug, nextWord_obj] = entry;
        // console.log("nextWord_slug: "+nextWord_slug);
        // words_out_obj[nextWord_slug].newPropA = "hello A";
        // words_in_obj[nextWord_slug].newPropB = "hello B";
        var nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
        if (jQuery.inArray("schema",nextWord_wordTypes_arr) != -1 ) {
            // console.log("this is a schema: "+nextWord_slug)
            schema_rels_arr = schema_rels_arr.concat(nextWord_obj.schemaData.relationships);
        }
    });
    var schema_rels_str = JSON.stringify(schema_rels_arr,null,4)
    // console.log("schema_rels_str: "+schema_rels_str)
    // go through each node once and see if it matches any patterns in ppa_node_Patterns
    // if so, add that pattern's actions to the completeActions_node_arr list
    Object.entries(words_out_obj).forEach(entry => {
        const [nextWord_slug, nextWord_obj] = entry;
        var nextOutputActions_node_arr = outputActions_node_propertyData(nextWord_obj);
        var nextOutputActions_node_str = JSON.stringify(nextOutputActions_node_arr,null,4)
        // console.log("sortPropertyData nextOutputActions_node_str: "+nextOutputActions_node_str)
        completeActions_node_arr = completeActions_node_arr.concat(nextOutputActions_node_arr);
    });

    var completeActions_node_str = JSON.stringify(completeActions_node_arr,null,4)
    // console.log("sortPropertyData completeActions_node_str: "+completeActions_node_str)
    var numCompleteNodeActions = completeActions_node_arr.length;
    // console.log("numCompleteNodeActions: "+numCompleteNodeActions)
    // now cycle through each action in completeActions_node_arr and apply changes until there are no other changes to be made
    var actionIteration = 0;
    var continueActions = true;
    do {
        continueActions = false;
        for (var a=0;a<numCompleteNodeActions;a++) {
            var nextAction_a_obj = completeActions_node_arr[a];
            var nA_action_slug = nextAction_a_obj.action; // this is the name of the action in question
            var nA_action_node = nextAction_a_obj.node; // this is the slug of the node

            var nextAction_obj = ppa_node_Actions[nA_action_slug];
            var nextAction_str = JSON.stringify(nextAction_obj,null,4);
            // console.log("qwerty nA_action_slug: "+nA_action_slug+"; nextAction_str: "+nextAction_str);

            if (nextAction_obj.hasOwnProperty("nodeMethod")) {
                var nextAction_method = nextAction_obj.nodeMethod;

                if (nextAction_method=="nodeMethod_0") {
                    var nA_sourceNode_obj = words_out_obj[nA_action_node];

                    var nA_source_path = nextAction_obj.source.path;
                    var nA_target_path1 = nextAction_obj.target.path1;
                    var nA_target_path2 = nextAction_obj.target.path2;

                    // setup path; should point to conceptGraphStyle
                    // conceptGraphStyle should have keys props, properties, required, and a few others
                    // each element in prop should be an object with two keys: "key": foo and "value": bar
                    // These are used to create the pair: foo: bar which is added to the target_path1_obj
                    var nA_source_path_split = nA_source_path.split(".");
                    var numSteps_sourcePath = nA_source_path_split.length;
                    var nextStep_sourcePath_pointer = nA_sourceNode_obj;
                    var nextStep_sourcePath_str = "";
                    for (var s=0;s<numSteps_sourcePath;s++) {
                        nextStep_sourcePath_str = nA_source_path_split[s];
                        if (nextStep_sourcePath_pointer.hasOwnProperty(nextStep_sourcePath_str)) {
                            nextStep_sourcePath_pointer = nextStep_sourcePath_pointer[nextStep_sourcePath_str]
                        } else {
                            nextStep_sourcePath_pointer = [];
                        }
                    }

                    var target_path1_obj = {};
                    var target_path2_obj = {}; // definitions

                    if (nA_sourceNode_obj.propertyData.conceptGraphStyle.hasOwnProperty("type")) {
                        target_path1_obj.type = nA_sourceNode_obj.propertyData.conceptGraphStyle.type;
                    }
                    var thisIsObjectType = false;
                    if (target_path1_obj.type == "object") {
                        thisIsObjectType = true;
                    }
                    if (nextStep_sourcePath_pointer.hasOwnProperty("properties")) {
                        if (nextStep_sourcePath_pointer.properties.length > 0) {
                            thisIsObjectType = true;
                        }
                    }
                    if (nA_sourceNode_obj.propertyData.type=="type1") {
                        nA_sourceNode_obj.propertyData.conceptGraphStyle.type="string";
                    }
                    if (nA_sourceNode_obj.propertyData.type=="type3") {
                        thisIsObjectType = true;
                    }
                    if (nA_sourceNode_obj.propertyData.type=="propertyModule") {
                        thisIsObjectType = true;
                    }

                    target_path2_obj.direct = [];
                    target_path2_obj.indirect = [];

                    if (nextStep_sourcePath_pointer.hasOwnProperty("props")) {
                        var props_arr = nextStep_sourcePath_pointer.props;
                        var props_arr_str = JSON.stringify(props_arr,null,4);
                        // console.log("qwerty nA_action_node: "+nA_action_node+"; props_arr_str: "+props_arr_str)
                        var numProps = props_arr.length;
                        for (var p=0;p<numProps;p++) {
                            var nextProp_obj = props_arr[p];
                            var nextProp_key = nextProp_obj.key;
                            var nextProp_value = nextProp_obj.value;
                            target_path1_obj[nextProp_key] = nextProp_value;
                            if ( (nextProp_key=="type") && (nextProp_value=="object") ) {
                                thisIsObjectType = true;
                            }
                        }
                    }

                    if (thisIsObjectType) {
                        target_path1_obj.required = [];
                        target_path1_obj.properties = {};
                        target_path1_obj.type = "object";
                        nA_sourceNode_obj.propertyData.conceptGraphStyle.type="object";
                        // target_path1_obj.dependencies = {};
                        if (nextStep_sourcePath_pointer.hasOwnProperty("properties")) {
                            var properties_arr = nextStep_sourcePath_pointer.properties;
                            var properties_arr_str = JSON.stringify(properties_arr,null,4);
                            // console.log("qwerty properties_arr_str: "+properties_arr_str)
                            var numProperties = properties_arr.length;
                            for (var p=0;p<numProperties;p++) {
                                var nextProperty_obj = properties_arr[p];
                                var nextProperty_key = nextProperty_obj.key;
                                var nextProperty_slug = nextProperty_obj.slug;
                                target_path1_obj.properties[nextProperty_key] = {};
                                target_path1_obj.properties[nextProperty_key]["$ref"] = "#/definitions/"+nextProperty_slug;
                                target_path2_obj.direct.push(nextProperty_slug);
                                target_path2_obj.indirect.push(nextProperty_slug);
                                if (nextStep_sourcePath_pointer.hasOwnProperty("required")) {
                                    var required_arr = nextStep_sourcePath_pointer.required;
                                    if (jQuery.inArray(nextProperty_slug,required_arr) > -1) {
                                        target_path1_obj.required.push(nextProperty_key)
                                    }
                                }
                                // if nextProperty_slug is actually wordType: enumeration, then need to add it to dependencies
                                var nextProperty_rF_obj = words_in_obj[nextProperty_slug];
                                var nextProperty_wordTypes = nextProperty_rF_obj.wordData.wordTypes;
                                if (jQuery.inArray("enumeration",nextProperty_wordTypes) > -1) {
                                    var enum_slugs = nextProperty_rF_obj.enumerationData.conceptGraphStyle.enum.slugs;
                                    var enum_uniqueField = nextProperty_rF_obj.enumerationData.conceptGraphStyle.enum.uniqueField;
                                    var numEnumSlugs = enum_slugs.length;
                                    target_path1_obj.dependencies = {};
                                    target_path1_obj.dependencies[nextProperty_key] = {}
                                    target_path1_obj.dependencies[nextProperty_key]["oneOf"] = [];

                                    var dependenciesFromEnum_arr = nextProperty_rF_obj.enumerationData.JSONSchemaStyle.dependencies["$field"].oneOf;
                                    var dependenciesFromEnum_str = JSON.stringify(dependenciesFromEnum_arr);
                                    var dependenciesFromEnum_updated_str = dependenciesFromEnum_str.replace(/\$field/g,nextProperty_key);
                                    var dependenciesFromEnum_updated_arr = JSON.parse(dependenciesFromEnum_updated_str);
                                    target_path1_obj.dependencies[nextProperty_key]["oneOf"] = dependenciesFromEnum_updated_arr;
                                }
                            }
                        }
                    }

                    var target_path1_str = JSON.stringify(target_path1_obj,null,4);
                    // console.log("qwerty target_path1_str: "+target_path1_str)

                    var target_path2_str = JSON.stringify(target_path2_obj,null,4);
                    // console.log("qwerty target_path2_str: "+target_path2_str)

                    var nA_target_path1_split = nA_target_path1.split(".");
                    var numSteps_targetPath1 = nA_target_path1_split.length;
                    var nextStep_targetPath1_pointer = nA_sourceNode_obj;
                    var nextStep_targetPath1_str = "";
                    for (var s=0;s<numSteps_targetPath1;s++) {
                        nextStep_targetPath1_str = nA_source_path_split[s];
                        if (nextStep_targetPath1_pointer.hasOwnProperty(nextStep_targetPath1_str)) {
                            nextStep_targetPath1_pointer = nextStep_targetPath1_pointer[nextStep_targetPath1_str]
                        } else {
                            nextStep_targetPath1_pointer = [];
                        }
                    }
                    // nextStep_targetPath1_pointer = target_path1_obj;
                    // nextStep_targetPath1_pointer = {};
                    // nA_target_path2 = target_path2_obj;
                    words_out_obj[nA_action_node].propertyData.JSONSchemaStyle.value = target_path1_obj;
                    if (thisIsObjectType) { words_out_obj[nA_action_node].propertyData.definitions = target_path2_obj; }

                    // move metaData to the end if it exists
                    if (words_out_obj[nA_action_node].propertyData.hasOwnProperty("metaData")) {
                        var mD_obj = JSON.parse(JSON.stringify(words_out_obj[nA_action_node].propertyData.metaData));
                        delete words_out_obj[nA_action_node].propertyData.metaData
                        words_out_obj[nA_action_node].propertyData.metaData = mD_obj;
                    }
                    words_out_obj = JSON.parse(JSON.stringify(words_out_obj));

                }

                // JSONSchema
                if (nextAction_method=="nodeMethod_2") {
                    // var nA_sourceNode_obj = words_out_obj[nA_action_node];
                    var selectedJSONSchema_slug = nA_action_node;
                    // console.log("nodeMethod_2; selectedJSONSchema_slug: "+selectedJSONSchema_slug);
                    // words_out_obj[selectedJSONSchema_slug] = PropertyFormationFunctions.rebuildJSONSchemaDefinitions2(words_out_obj[selectedJSONSchema_slug])
                    words_out_obj[selectedJSONSchema_slug] = rebuildJSONSchemaDefinitions_pDM(words_out_obj[selectedJSONSchema_slug],words_out_obj)
                    // PropertyFormationFunctions.rebuildJSONSchemaDefinitions2(selectedJSONSchema_slug)
                }
                // flesh out definitions.indirect
                if (nextAction_method=="nodeMethod_1") {
                    var nA_sourceNode_obj = words_out_obj[nA_action_node];
                    if (nA_sourceNode_obj.propertyData.hasOwnProperty("definitions")) {
                        var continueAddingDefinitions = true;
                        var numIterationsAddingDefs = 0;
                        do {
                            continueAddingDefinitions = false;
                            var currentDefinitions_indirect_arr = nA_sourceNode_obj.propertyData.definitions.indirect;
                            var numCurrentDefs = currentDefinitions_indirect_arr.length;
                            for (var d=0;d<numCurrentDefs;d++) {
                                var nextDefinition_slug = currentDefinitions_indirect_arr[d];
                                // console.log("nextDefinition_slug: "+nextDefinition_slug)
                                var nextDefinition_rF_obj = words_out_obj[nextDefinition_slug];
                                var nextDefinition_rF_str = JSON.stringify(nextDefinition_rF_obj,null,4);
                                // console.log("nextDefinition_rF_str: "+nextDefinition_rF_str)
                                if (nextDefinition_rF_obj.hasOwnProperty("propertyData")) {
                                    if (nextDefinition_rF_obj.propertyData.hasOwnProperty("definitions")) {
                                        var nextDef_definitions_indirect_arr = nextDefinition_rF_obj.propertyData.definitions.indirect;
                                        var numNextDefDefinitions = nextDef_definitions_indirect_arr.length;
                                        for (var f=0;f<numNextDefDefinitions;f++) {
                                            var nextDefDef_slug = nextDef_definitions_indirect_arr[f];
                                            if (jQuery.inArray(nextDefDef_slug,nA_sourceNode_obj.propertyData.definitions.indirect) == -1) {
                                                nA_sourceNode_obj.propertyData.definitions.indirect.push(nextDefDef_slug);
                                                continueAddingDefinitions = true;
                                            }
                                        }
                                    }
                                }
                                if (nextDefinition_rF_obj.hasOwnProperty("enumerationData")) {
                                    if (nextDefinition_rF_obj.enumerationData.hasOwnProperty("definitions")) {
                                        var nextDef_definitions_indirect_arr = nextDefinition_rF_obj.enumerationData.definitions.indirect;
                                        var numNextDefDefinitions = nextDef_definitions_indirect_arr.length;
                                        for (var f=0;f<numNextDefDefinitions;f++) {
                                            var nextDefDef_slug = nextDef_definitions_indirect_arr[f];
                                            if (jQuery.inArray(nextDefDef_slug,nA_sourceNode_obj.propertyData.definitions.indirect) == -1) {
                                                nA_sourceNode_obj.propertyData.definitions.indirect.push(nextDefDef_slug);
                                                continueAddingDefinitions = true;
                                            }
                                        }
                                    }
                                }
                            }
                            numIterationsAddingDefs++;
                            if (numIterationsAddingDefs > 5) { continueAddingDefinitions = false; }
                        } while (continueAddingDefinitions)
                    }
                }
            }

        }

        actionIteration++;
        // console.log("actionIteration: "+actionIteration)
        if (actionIteration < 3) {
            continueActions = true;
        }
    } while (continueActions)
    // console.log("actionIteration: "+actionIteration)

    // go through each relationship once and see if it matches any patterns in ppa_rel_Patterns
    // if so, add that pattern's actions to the completeActions_rel_arr list
    var numRels = schema_rels_arr.length;
    for (var r=0;r<numRels;r++) {
        var nextRel_obj = schema_rels_arr[r];
        var nextOutputActions_rel_arr = outputActions_rel_propertyData(nextRel_obj,words_in_obj);
        var nextOutputActions_rel_str = JSON.stringify(nextOutputActions_rel_arr,null,4)
        // console.log("sortPropertyData nextOutputActions_rel_str: "+nextOutputActions_rel_str)
        completeActions_rel_arr = completeActions_rel_arr.concat(nextOutputActions_rel_arr);
    }
    var completeActions_rel_str = JSON.stringify(completeActions_rel_arr,null,4)
    // console.log("sortPropertyData completeActions_rel_str: "+completeActions_rel_str)
    var numCompleteRelActions = completeActions_rel_arr.length;
    // console.log("numCompleteRelActions: "+numCompleteRelActions)
    // now cycle through each action in completeActions_rel_arr and apply changes until there are no other changes to be made
    var actionIteration = 0;
    var continueActions = true;
    do {
        continueActions = false;
        for (var a=0;a<numCompleteRelActions;a++) {
            var nextAction_a_obj = completeActions_rel_arr[a];
            var nA_action_slug = nextAction_a_obj.slug;
            // console.log("nA_action_slug: "+nA_action_slug);
            var nA_nF_slug = nextAction_a_obj.nodeFrom;
            var nA_nT_slug = nextAction_a_obj.nodeTo;
            var nA_rel_obj = nextAction_a_obj.rel;
            var nextAction_obj = ppa_rel_Actions[nA_action_slug];
            var nextAction_str = JSON.stringify(nextAction_obj,null,4);
            // console.log("nextAction_str: "+nextAction_str);

            if (nextAction_obj.hasOwnProperty("relMethod")) {
                var nextAction_method = nextAction_obj.relMethod;
                // relMethod_0: simplest method. Transfers data from location in nodeFrom to location in nodeTo (or vice versa)

                var nA_source_node = "";
                var nA_source_path = "";
                var nA_source_type = "";
                if (nextAction_obj.hasOwnProperty("source")) {
                    nA_source_node = nextAction_obj.source.node;
                    nA_source_path = nextAction_obj.source.path;
                    nA_source_type = nextAction_obj.source.type;
                }

                var nA_target_node = "";
                var nA_target_path = "";
                var nA_target_type = "";
                if (nextAction_obj.hasOwnProperty("target")) {
                    nA_target_node = nextAction_obj.target.node;
                    nA_target_path = nextAction_obj.target.path;
                    nA_target_type = nextAction_obj.target.type;
                }

                if (nextAction_obj.hasOwnProperty("intermediary")) {
                    var nA_intermediary_node = nextAction_obj.intermediary.node;
                    var nA_intermediary_path = nextAction_obj.intermediary.path;
                    var nA_intermediary_type = nextAction_obj.intermediary.type;
                }

                var nA_source_slug = "";
                if (nA_source_node=="nodeFrom") {
                    nA_source_slug = nA_nF_slug;
                }
                if (nA_source_node=="nodeTo") {
                    nA_source_slug = nA_nT_slug;
                }
                if (nA_source_node=="intermediary") {
                    if (nA_intermediary_node=="nodeFrom") {
                        nA_source_slug = nA_nF_slug;
                    }
                    if (nA_intermediary_node=="nodeTo") {
                        nA_source_slug = nA_nT_slug;
                    }
                }

                var nA_target_slug = "";
                if (nA_target_node=="nodeFrom") {
                    nA_target_slug = nA_nF_slug;
                }
                if (nA_target_node=="nodeTo") {
                    nA_target_slug = nA_nT_slug;
                }

                var nA_source_obj = words_out_obj[nA_source_slug];
                var nA_target_obj = words_out_obj[nA_target_slug];

                // if (nA_source_slug=="property_xgzhlf") { console.log("qwerty nA_source_slug: "+nA_source_slug+"; nA_target_slug: "+nA_target_slug) }

                var nA_sourse_path_split = nA_source_path.split(".");
                var numSteps_sourcePath = nA_sourse_path_split.length;
                var nextStep_source_pointer = nA_source_obj;
                var nA_source_str = JSON.stringify(nA_source_obj,null,4);
                // if (nA_source_slug=="property_xgzhlf") { console.log("qwerty nA_source_str: "+nA_source_str) }
                var nextStep_source_str = "";
                for (var s=0;s<numSteps_sourcePath;s++) {
                    nextStep_source_str = nA_sourse_path_split[s];
                    if (nextStep_source_str) {
                        if (nextStep_source_pointer.hasOwnProperty(nextStep_source_str)) {
                            nextStep_source_pointer = nextStep_source_pointer[nextStep_source_str]
                        } else {
                            nextStep_source_pointer = [];
                        }
                    }
                }

                // relMethod_enum_0: executing the actions originally implemented here:
                // jQuery("#recalculateEnumerationsButton_"+concept_x_slug).click from GenerateCompactConceptSummarySelector.js
                if (nextAction_method=="relMethod_enum_0") {
                    // console.log("relMethod_enum_0; nA_nF_slug: "+nA_nF_slug+"; nA_nT_slug: "+nA_nT_slug)

                    var set_rF_obj = JSON.parse(JSON.stringify(words_out_obj[nA_nF_slug]));

                    // var updatedEnumeration_obj = JSON.parse(JSON.stringify(words_out_obj[nA_nT_slug]))
                    var updatedEnumeration_obj = words_out_obj[nA_nT_slug];
                    var uniqueField_key = updatedEnumeration_obj.enumerationData.field;
                    var additionalFields_arr = [];
                    if (updatedEnumeration_obj.enumerationData.hasOwnProperty("additionalFields")) {
                        additionalFields_arr = updatedEnumeration_obj.enumerationData.additionalFields;
                    }
                    updatedEnumeration_obj.enumerationData.conceptGraphStyle.enumAdditionalFields = {};
                    var numAddFields = additionalFields_arr.length;
                    for (var f=0;f<numAddFields;f++) {
                        var nextAddField = additionalFields_arr[f];
                        updatedEnumeration_obj.enumerationData.conceptGraphStyle.enumAdditionalFields[nextAddField] = [];
                    }
                    var governingConcept_slug = updatedEnumeration_obj.enumerationData.source.concept;
                    var governingConcept_rF_obj = words_in_obj[governingConcept_slug];
                    var conceptPropertyPath = governingConcept_rF_obj.conceptData.propertyPath;
                    updatedEnumeration_obj.enumerationData.JSONSchemaStyle.dependencies = {};
                    updatedEnumeration_obj.enumerationData.JSONSchemaStyle.dependencies["$field"] = {};
                    updatedEnumeration_obj.enumerationData.JSONSchemaStyle.dependencies["$field"].oneOf = [];
                    var set_specificInstances_arr = set_rF_obj.globalDynamicData.specificInstances;
                    var numSpecificInstances = set_specificInstances_arr.length;
                    var enumList_arr = [];
                    var enumList_slugs_arr = [];
                    var definitionsList_arr = [];
                    for (var i=0;i<numSpecificInstances;i++) {
                        var nextDependenciesOption_obj = {};
                        nextDependenciesOption_obj.properties = {};
                        nextDependenciesOption_obj.required = [];
                        var nextSpecificInstance_slug = set_specificInstances_arr[i];
                        var nextSpecificInstance_rF_obj = JSON.parse(JSON.stringify(words_out_obj[nextSpecificInstance_slug]));
                        var nextSpecificInstance_key = nextSpecificInstance_slug;
                        if (nextSpecificInstance_rF_obj[conceptPropertyPath].hasOwnProperty(uniqueField_key)) {
                            var nextSpecificInstance_key = nextSpecificInstance_rF_obj[conceptPropertyPath][uniqueField_key];
                        }
                        enumList_arr.push(nextSpecificInstance_key);
                        enumList_slugs_arr.push(nextSpecificInstance_slug);
                        nextDependenciesOption_obj.properties["$field"] = {};
                        nextDependenciesOption_obj.properties["$field"].enum = [ nextSpecificInstance_key ];
                        for (var f=0;f<numAddFields;f++) {
                            var nextAddField = additionalFields_arr[f];
                            var nextSpecificInstance_additionalField_key = nextSpecificInstance_rF_obj[conceptPropertyPath][nextAddField];
                            nextDependenciesOption_obj.properties[nextAddField] = {};
                            nextDependenciesOption_obj.properties[nextAddField].default = nextSpecificInstance_additionalField_key;
                            nextDependenciesOption_obj.properties[nextAddField].enum = [ nextSpecificInstance_additionalField_key ];
                            updatedEnumeration_obj.enumerationData.conceptGraphStyle.enumAdditionalFields[nextAddField][i] = nextSpecificInstance_additionalField_key;
                        }
                        if (nextSpecificInstance_rF_obj.hasOwnProperty("wordTypeData")) {
                            var nextSpecificInstance_governingConcept_slug = nextSpecificInstance_rF_obj.wordTypeData.concept;
                            var nextSpecificInstance_governingConcept_rF_obj = JSON.parse(JSON.stringify(words_out_obj[nextSpecificInstance_governingConcept_slug]))
                            var nextSpecificInstance_primaryProperty_slug = nextSpecificInstance_governingConcept_rF_obj.conceptData.nodes.primaryProperty.slug;
                            var nextSpecificInstance_propertyPath = nextSpecificInstance_governingConcept_rF_obj.conceptData.propertyPath;
                            definitionsList_arr.push(nextSpecificInstance_primaryProperty_slug)
                            nextDependenciesOption_obj.properties[nextSpecificInstance_propertyPath] = {};
                            nextDependenciesOption_obj.properties[nextSpecificInstance_propertyPath]["$ref"] = "#/definitions/"+nextSpecificInstance_primaryProperty_slug;
                            nextDependenciesOption_obj.required = [nextSpecificInstance_propertyPath];
                        } else {
                            var errorMessage = "what is definition of specificInstance if sI is not a wordType? Can that happen? nextSpecificInstance_slug: "+nextSpecificInstance_slug;
                            // definitionsList_arr.push(errorMessage);
                        }
                        updatedEnumeration_obj.enumerationData.JSONSchemaStyle.dependencies["$field"].oneOf.push(nextDependenciesOption_obj)

                    }

                    updatedEnumeration_obj.enumerationData.conceptGraphStyle.enum = {};;
                    updatedEnumeration_obj.enumerationData.conceptGraphStyle.enum.uniqueField = enumList_arr;
                    updatedEnumeration_obj.enumerationData.conceptGraphStyle.enum.slugs = enumList_slugs_arr;
                    updatedEnumeration_obj.enumerationData.JSONSchemaStyle.value.enum = enumList_arr;
                    updatedEnumeration_obj.enumerationData.definitions.direct = definitionsList_arr;
                    updatedEnumeration_obj.enumerationData.definitions.indirect = definitionsList_arr;
                    // updatedEnumeration_obj.wordData.foo = "bar";

                    var updatedEnumeration_str = JSON.stringify(updatedEnumeration_obj,null,4);
                    // console.log("updatedEnumeration_str: "+updatedEnumeration_str)
                }

                if (nextAction_method=="relMethod_0") {
                    var nA_elementType = nextAction_obj.elementType;

                    if (nA_source_type=="string") {
                        var next_nA_source_xtype = nextStep_source_pointer;
                        addNextElement_ppa(next_nA_source_xtype,nA_target_path,nA_target_obj);
                    }
                    if (nA_source_type=="array") {
                        var numSourceItems = nextStep_source_pointer.length;
                        for (var i = 0;i<numSourceItems;i++) {
                            var next_nA_source_xtype = nextStep_source_pointer[i];
                            // if (nA_source_slug=="property_xgzhlf") { console.log("qwerty about to addNextElement_ppa") }

                            addNextElement_ppa(next_nA_source_xtype,nA_target_path,nA_target_obj);
                        }
                    }
                }

                // relMethod_1: source is specified by the slug in the intermediary (usually nodeFrom)
                if (nextAction_method=="relMethod_1") {
                    var nA_nF_obj = words_out_obj[nA_nF_slug];
                    var nA_nT_obj = words_out_obj[nA_nT_slug];

                    if (nA_nT_obj.setData.hasOwnProperty("propertyTypes")) {
                        var pT_arr = nA_nT_obj.setData.propertyTypes;
                        var numPT = pT_arr.length;
                        nA_nF_obj.propertyData.type = pT_arr[0];
                        for (var t=0;t<numPT;t++) {
                            var next_pT = pT_arr[t];
                            if (jQuery.inArray(next_pT,nA_nF_obj.propertyData.types) == -1) {
                                nA_nF_obj.propertyData.types.push(next_pT)
                                // console.log("qwerty ADDING next_pT: "+next_pT)
                            }
                        }
                    }

                    // if nA_nT_obj.setData.propertyTypes exists, then transfer elements in that array (e.g. type0, type1, etc)
                    // to nA_nF_obj.propertyData.type and nA_nF_obj.propertyData.types

                    var nA_intermediary_node = nextAction_obj.intermediary.node;
                    var nA_intermediary_path = nextAction_obj.intermediary.path;
                    var nA_intermediary_type = nextAction_obj.intermediary.type;

                    var nA_source_node = nextAction_obj.source.node;
                    var nA_source_path = nextAction_obj.source.path;
                    var nA_source_type = nextAction_obj.source.type;

                    var nA_target_node = nextAction_obj.target.node;
                    var nA_target_path = nextAction_obj.target.path;
                    var nA_target_type = nextAction_obj.target.type;



                    // console.log("relMethod_1; nA_source_node: "+nA_source_node+"; nA_intermediary_node: "+nA_intermediary_node+"; nA_target_node: "+nA_target_node)

                    var nA_target_slug = "";
                    if (nA_target_node=="nodeFrom") {
                        nA_target_slug = nA_nF_slug;
                    }
                    if (nA_target_node=="nodeTo") {
                        nA_target_slug = nA_nT_slug;
                    }

                    var nA_intermediary_slug = "";
                    if (nA_intermediary_node=="nodeFrom") {
                        nA_intermediary_slug = nA_nF_slug;
                    }
                    if (nA_intermediary_node=="nodeTo") {
                        nA_intermediary_slug = nA_nT_slug;
                    }

                    var nA_intermediary_obj = words_out_obj[nA_intermediary_slug];
                    var nA_target_obj = words_out_obj[nA_target_slug];

                    var nA_intermediary_path_split = nA_intermediary_path.split(".");
                    var numSteps_intermediaryPath = nA_intermediary_path_split.length;
                    var nextStep_intermediary_pointer = nA_intermediary_obj;
                    var nextStep_intermediary_str = "";
                    for (var s=0;s<numSteps_intermediaryPath;s++) {
                        nextStep_intermediary_str = nA_intermediary_path_split[s];
                        if (nextStep_intermediary_pointer.hasOwnProperty(nextStep_intermediary_str)) {
                            nextStep_intermediary_pointer = nextStep_intermediary_pointer[nextStep_intermediary_str]
                        } else {
                            nextStep_intermediary_pointer = [];
                        }
                    }

                    if (nA_intermediary_type=="array") {
                        var numIntermediaryItems = nextStep_intermediary_pointer.length;
                        for (var i = 0;i<numIntermediaryItems;i++) {
                            var next_nA_source_slug = nextStep_intermediary_pointer[i];
                            var nA_source_obj = words_out_obj[next_nA_source_slug];

                            var nA_sourse_path_split = nA_source_path.split(".");
                            var numSteps_sourcePath = nA_sourse_path_split.length;
                            var nextStep_source_pointer = nA_source_obj;
                            var nextStep_source_str = "";
                            for (var s=0;s<numSteps_sourcePath;s++) {
                                nextStep_source_str = nA_sourse_path_split[s];
                                if (nextStep_source_pointer.hasOwnProperty(nextStep_source_str)) {
                                    nextStep_source_pointer = nextStep_source_pointer[nextStep_source_str]
                                } else {
                                    nextStep_source_pointer = [];
                                }
                            }
                            if (nA_source_type=="string") {
                                var next_nA_source_xtype = nextStep_source_pointer;
                                // var nA_elementType = typeof next_nA_source_xtype;
                                addNextElement_ppa(next_nA_source_xtype,nA_target_path,nA_target_obj);
                            }
                            if (nA_source_type=="array") {
                                var numSourceItems = nextStep_source_pointer.length;
                                for (var i = 0;i<numSourceItems;i++) {
                                    var next_nA_source_xtype = nextStep_source_pointer[i];
                                    // var nA_elementType = typeof next_nA_source_xtype;
                                    addNextElement_ppa(next_nA_source_xtype,nA_target_path,nA_target_obj);
                                }
                            }
                        }
                    }
                }
                // relMethod_2: source incorporates one or more fields in [relationshipType]Data
                if (nextAction_method=="relMethod_2") {
                    // console.log("qwerty relMethod_2; ");
                    var nextRel_relType_slug = nextAction_obj.relationshipType;
                    var nextRel_relTypeData = nextRel_relType_slug+"Data";
                    // console.log("qwerty relMethod_2; nextRel_relTypeData: "+nextRel_relTypeData)

                    var nA_elementType = nextAction_obj.element.type;
                    var nA_createNew = nextAction_obj.element.createNew;
                    var nA_modifyExisting = nextAction_obj.element.modifyExisting;
                    var nA_relDataFields_arr = nextAction_obj.relationshipData.fields;

                    var nA_sourceType = nextAction_obj.source.type;

                    // console.log("qwerty relMethod_2; nextRel_relTypeData: "+nextRel_relTypeData+"; nA_elementType: "+nA_elementType+"; nA_createNew: "+nA_createNew)

                    if (nA_elementType=="string") {
                        // NOT YET IMPLEMENTED since object is all I've employed so far
                    }
                    if (nA_elementType=="object") {
                        if (nA_modifyExisting) {
                            // used by addPropertyValue
                            // first: fetch the existing object which needs to be modified
                            // it is identified as the first object in the target array that has a field which is null
                            // (may change this method in the future )
                            // console.log("qwerty ================ ");
                            var nextStep_source_pointer_str = JSON.stringify(nextStep_source_pointer,null,4);
                            // console.log("qwerty nextStep_source_pointer_str: "+nextStep_source_pointer_str)
                            var numElemsInSource = nextStep_source_pointer.length; // typically there will be just one ... ?
                            var sourceElem_unchanged_obj = {}
                            var sourceElem_changed_obj = {}
                            for (var z=0;z<numElemsInSource;z++) {
                                var nextElemInSource_obj = nextStep_source_pointer[z];
                                jQuery.each(nextElemInSource_obj,function(k,v){
                                    if (v==null) {
                                        var nextElemInSource_str = JSON.stringify(nextElemInSource_obj,null,4)
                                        // console.log("qwerty found a null! nextElemInSource_str: "+nextElemInSource_str);
                                        sourceElem_unchanged_obj = JSON.parse(JSON.stringify(nextElemInSource_obj))
                                        sourceElem_changed_obj = JSON.parse(JSON.stringify(nextElemInSource_obj))
                                        sourceElem_changed_obj[k] = nA_rel_obj.relationshipType[nextRel_relTypeData].field;
                                    }
                                })
                            }
                            addNextElement_ppa(sourceElem_changed_obj,nA_target_path,nA_target_obj);

                        }
                        if (nA_createNew) {
                            // used by addPropertyKey and addToConceptGraphProperties
                            // console.log("qwerty nA_createNew");
                            var newElement_obj = {};
                            jQuery.each(nextAction_obj.element.obj,function(k,v) {
                                // console.log("qwerty k: "+k)

                                if (nextAction_obj.element.obj[k].type == "object") {
                                    newElement_obj[k] = {};
                                }
                                if (nextAction_obj.element.obj[k].type == "string") {
                                    newElement_obj[k] = "";
                                    if (nextAction_obj.element.obj[k].value == "relationshipTypeData") {
                                      if (nA_rel_obj.hasOwnProperty("relationshipType")) {
                                          if (nA_rel_obj.relationshipType.hasOwnProperty(nextRel_relTypeData)) {
                                              if (nA_rel_obj.relationshipType[nextRel_relTypeData].hasOwnProperty("field")) {
                                                  newElement_obj[k] = nA_rel_obj.relationshipType[nextRel_relTypeData].field;
                                              }
                                          }
                                      }
                                    }
                                    if (nextAction_obj.element.obj[k].value == null) {
                                        newElement_obj[k] = null;
                                    }
                                    if (nextAction_obj.element.obj[k].value == "source") {
                                        // not yet finished!
                                        if (nA_source_type=="string") {
                                            // console.log("nA_source_type = string; nA_source_slug: "+nA_source_slug)
                                            newElement_obj[k] = nextStep_source_pointer;
                                            // NEED TO MAKE SURE THIS IS CORRECT!!! not yet sure it produces the right result!
                                        }
                                    }
                                }

                            });
                            var newElement_str = JSON.stringify(newElement_obj,null,4);
                            // console.log("qwerty relMethod_2 newElement_str: "+newElement_str)
                            // now need to add newElement_obj to the target
                            addNextElement_ppa(newElement_obj,nA_target_path,nA_target_obj);
                        }
                    }
                }

                // relMethod_3: reconstruct JSONSchema from its primaryProperty
                if (nextAction_method=="relMethod_3") {
                    var nA_wordType_rF_obj = words_out_obj[nA_nT_slug];
                    var nA_concept_slug = nA_wordType_rF_obj.wordTypeData.concept

                    var nA_concept_rF_obj = words_out_obj[nA_concept_slug];
                    var propPath = nA_concept_rF_obj.conceptData.propertyPath;

                    var nA_primaryProperty_slug = nA_nF_slug;
                    var nA_primaryProperty_rF_obj = words_out_obj[nA_primaryProperty_slug];
                    var primaryProperty_value_obj = nA_primaryProperty_rF_obj.propertyData.JSONSchemaStyle.value;

                    var nA_JSONSchema_slug = nA_concept_rF_obj.conceptData.nodes.JSONSchema.slug;
                    var nA_JSONSchema_rF_obj = words_out_obj[nA_JSONSchema_slug];

                    nA_JSONSchema_rF_obj.properties = {};
                    nA_JSONSchema_rF_obj.properties[propPath] = {}
                    nA_JSONSchema_rF_obj.properties[propPath]["$ref"] = "#/definitions/"+nA_primaryProperty_slug;

                    nA_JSONSchema_rF_obj.definitions[nA_primaryProperty_slug] = primaryProperty_value_obj;

                    var definitions_indirect_arr = nA_primaryProperty_rF_obj.propertyData.definitions.indirect;
                    var numDefs = definitions_indirect_arr.length;
                    for (var d=0;d<numDefs;d++) {
                        var nextDef_slug = definitions_indirect_arr[d];
                        var nextDef_rF_obj = words_out_obj[nextDef_slug];
                        if (nextDef_rF_obj.hasOwnProperty("propertyData")) {
                            var nextDef_value_obj = nextDef_rF_obj.propertyData.JSONSchemaStyle.value;
                            nA_JSONSchema_rF_obj.definitions[nextDef_slug] = nextDef_value_obj;
                        }

                    }

                }
            }
        }
        actionIteration++;
        // console.log("actionIteration: "+actionIteration)
        if (actionIteration < 2) {
            continueActions = true;
        }
    } while (continueActions)
    // console.log("actionIteration: "+actionIteration)

    return words_out_obj;
}


// inputs a node, checks to see if it matches any patterns in ppa_node_Patterns, and outputs one or more indicated ppa_node_Actions
function outputActions_node_propertyData(node_obj) {
    var actions_arr = [];

    var thisNode_slug = node_obj.wordData.slug;
    var thisNode_wT = node_obj.wordData.wordType;
    // cycle through each pattern and see if it is a match
    Object.entries(ppa_node_Patterns).forEach(entry => {
        const [pattern_key, pattern_obj] = entry;
        // var pattern_str = JSON.stringify(pattern_obj,null,4);
        // console.log("qwerty ppa_node_Patterns pattern_key: "+pattern_key+"; pattern_str: "+pattern_str);
        var pattern_wT_arr = pattern_obj.wordTypes;
        var pattern_actions_arr = pattern_obj.actions;
        var numPatternActions = pattern_actions_arr.length;
        // console.log("numPatternActions: "+numPatternActions)
        var patternMatch = false;
        // check to see if this node matches the pattern
        if (jQuery.inArray(thisNode_wT,pattern_wT_arr) > -1) {
            patternMatch = true;
        }
        if (patternMatch) {
            for (var a=0;a<numPatternActions;a++) {
                var nextAction_slug = pattern_actions_arr[a];
                var nextAction_obj = {};
                nextAction_obj.action = nextAction_slug;
                nextAction_obj.node = thisNode_slug;
                actions_arr.push(nextAction_obj);
            }
        }
    });
    // var actions_str = JSON.stringify(actions_arr,null,4)
    // console.log("qwerty outputActions_node_propertyData actions_str: "+actions_str)
    return actions_arr;
}
// inputs a relationship, checks to see if it matches any patterns in ppa_rel_Patterns, and outputs one or more indicated ppa_rel_Actions
function outputActions_rel_propertyData(rel_obj,words_in_obj) {
    // console.log("qwerty outputActions_rel_propertyData")
    var actions_arr = [];
    var nF_slug = rel_obj.nodeFrom.slug;
    var rel_slug = rel_obj.relationshipType.slug;
    var nT_slug = rel_obj.nodeTo.slug;

    var nF_obj = words_in_obj[nF_slug]
    var nT_obj = words_in_obj[nT_slug]

    var nF_wordTypes = nF_obj.wordData.wordTypes;
    var nT_wordTypes = nT_obj.wordData.wordTypes;

    var numWordTypes_nF = nF_wordTypes.length;
    var numWordTypes_nT = nT_wordTypes.length;
    // cycle through each pattern and see if they match
    Object.entries(ppa_rel_Patterns).forEach(entry => {
        const [pattern_key, pattern_obj] = entry;
        var pattern_str = JSON.stringify(pattern_obj,null,4);

        var pattern_relType = pattern_obj.relationshipType;
        // console.log("qwerty ppa_rel_Patterns pattern_key: "+pattern_key+"; pattern_relType: "+pattern_relType+"; pattern_str: "+pattern_str);
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
                nextAction_obj.rel = rel_obj;
                actions_arr.push(nextAction_obj);
                var actions_str = JSON.stringify(actions_arr,null,4)
                // console.log("qwerty outputActions_rel_propertyData A actions_str: "+actions_str)
            }
        }
    });
    var actions_str = JSON.stringify(actions_arr,null,4)
    // console.log("qwerty sortPropertyData actions_str: "+actions_str)
    return actions_arr;
}

// addNextElement_ppa adds an element to the target path of the target object
// nA_target_obj is a node_obj (word_obj) and nA_target_path is the path inside that word where the element is to be added
// the path should lead to an ARRAY (need to relax this assumption ??? )
// elementToAdd can be string or object (future: can be array? other type?)
function addNextElement_ppa(elementToAdd,nA_target_path,nA_target_obj) {
    var nA_target_slug = nA_target_obj.wordData.slug;
    // if (nA_target_slug=="primaryPropertyForProperty") { console.log("qwerty here in addNextElement_ppa") }
    var elementToAdd_type = typeof elementToAdd;
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
    if (elementToAdd_type=="string") {
        if (jQuery.inArray(elementToAdd,nextStep_target_pointer) == -1) {
            nextStep_target_pointer.push(elementToAdd);
        }
    }
    if (elementToAdd_type=="object") {
        var elementToAdd_str = JSON.stringify(elementToAdd,null,4)
        // if (nA_target_slug=="primaryPropertyForProperty") { console.log("qwerty element to add is object; elementToAdd_str: "+elementToAdd_str) }
        var numElemsInTarget = nextStep_target_pointer.length;
        var alreadyPresent = false;
        for (var e=0;e<numElemsInTarget;e++) {
            var nextElem_obj = nextStep_target_pointer[e];
            var nextElem_str = JSON.stringify(nextElem_obj,null,4)
            // if (nA_target_slug=="primaryPropertyForProperty") { console.log("qwerty checking nextElem_str: "+nextElem_str) }
            if (MiscFunctions.areObjectsEquivalent(elementToAdd,nextElem_obj)) {
                alreadyPresent = true;
                // if (nA_target_slug=="primaryPropertyForProperty") { console.log("qwerty element is already present") }
            } else {
                // if (nA_target_slug=="primaryPropertyForProperty") { console.log("qwerty element is NOT already present") }
            }
            ///////////////////////////////////////////////
            // TEMPORARY HACK
            // This is for when I alter relationship: enumeration -- addToConceptGraphProperties -- property by changing the field
            // Object is of the form: key: foo, slug: bar
            // When I change the field, I am changing foo but keeping bar the same
            // Problem: I end up with duplicate, ie two elements with same bar but diferent foo
            // I wish to remove the original element with matching foo
            // Temporary solution: instead of adding the new element, simply change the existing element
            // What I probably ought to do: create a new pattern - action (???) for this particular circumstance
            // Really I need to rework the overall organization of patterns-actions
            if (elementToAdd.hasOwnProperty("slug")) {
              if (nextElem_obj.hasOwnProperty("slug")) {
                if (elementToAdd.slug == nextElem_obj.slug) {
                  alreadyPresent = true;
                  nextStep_target_pointer[e].key = elementToAdd.key;
                }
              }
            }

            if (elementToAdd.hasOwnProperty("key")) {
              if (nextElem_obj.hasOwnProperty("key")) {
                if (elementToAdd.key == nextElem_obj.key) {
                  alreadyPresent = true;
                  nextStep_target_pointer[e].value = elementToAdd.value;
                }
              }
            }


            /*
            END TEMPORARY HACK
            */
            //////////////////////////////////////////////
        }
        if (!alreadyPresent) {
            nextStep_target_pointer.push(elementToAdd);
            // if (nA_target_slug=="primaryPropertyForProperty") { console.log("qwerty pushing another element") }
        }
    }
}
