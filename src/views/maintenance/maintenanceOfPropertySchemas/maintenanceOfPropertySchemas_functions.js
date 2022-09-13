
import * as MiscFunctions from '../../../lib/miscFunctions.js';
import * as PatternsActions from './maintenanceOfPropertySchemas_patternActionSpecs.js';
import * as PropertyFormationFunctions from '../../buildConceptFamily/propertyFormationFunctionsUsingRelationships.js';
import propertyTypes from '../../../json/propertyTypes';
import sendAsync from '../../../renderer';
const jQuery = require("jquery");

// coda for this pattern-match-function group: XYZ, changed to prs or PropertySchemas

export var words_prs_pre_rF_obj = {};
export var words_prs_post_rF_obj = {};

// fetchConceptGraph_prs is called by maintenanceOfPropertySchemas
// fetchConceptGraph_prs obtains the full list of words from SQL;
// then calls identifyWordUpdates_XYZ to determine all edits that must be made
export const fetchConceptGraph_prs = async (conceptGrapTableName) => {
    // words_prs_pre_rF_obj = {};
    // words_prs_post_rF_obj = {};
    var sql = " SELECT * FROM "+conceptGrapTableName;
    console.log("fetchConceptGraph_prs sql: "+sql);
    sendAsync(sql).then( async (words_prs_pre_arr) => {
        var numWords = words_prs_pre_arr.length;

        var wordSelectorHTML = "";
        wordSelectorHTML += "<select id=wordSelector_prs >";

        for (var w=0;w<numWords;w++) {
            var nextWord = words_prs_pre_arr[w];
            var nextWord_rawFile_str = nextWord.rawFile;
            var nextWord_rawFile_obj = JSON.parse(nextWord_rawFile_str);
            var nextWord_slug = nextWord_rawFile_obj.wordData.slug;
            words_prs_pre_rF_obj[nextWord_slug]=JSON.parse(JSON.stringify(nextWord_rawFile_obj));
        }
        words_prs_post_rF_obj = await identifyWordUpdates_prs(words_prs_pre_rF_obj);
    });
}

export const createWordSelector_prs = () => {
    var wordSelectorHTML = "";
    wordSelectorHTML += "<select id=wordSelector_prs >";

    var numUpdatedWords_prs = 0;
    jQuery.each(words_prs_post_rF_obj,function(nextWord_slug,obj){

        var word_original_obj = words_prs_pre_rF_obj[nextWord_slug];
        var word_updated_obj = words_prs_post_rF_obj[nextWord_slug];

        var word_original_str = JSON.stringify(word_original_obj);
        var word_updated_str = JSON.stringify(word_updated_obj);

        wordSelectorHTML += "<option data-slug="+nextWord_slug+" >";

        if (word_original_obj.hasOwnProperty("newWord")) {
            wordSelectorHTML += " *** NEW WORD *** ";
            numUpdatedWords_prs ++;
        } else {
            if (word_original_str != word_updated_str) {
                wordSelectorHTML += " *** UPDATED *** ";
                numUpdatedWords_prs ++;
            }
        }
        wordSelectorHTML += nextWord_slug;
        wordSelectorHTML += "</option>";
    })

    jQuery.each(newWords_obj,function(nextWord_slug,obj){
        var word_original_obj = {};
        var word_updated_obj = newWords_obj[nextWord_slug];

        words_prs_pre_rF_obj[nextWord_slug] = {"newWord": "yup, a brand new word!"}
        words_prs_post_rF_obj[nextWord_slug] = word_updated_obj;

        var word_original_str = JSON.stringify(word_original_obj);
        var word_updated_str = JSON.stringify(word_updated_obj);

        wordSelectorHTML += "<option data-slug="+nextWord_slug+" >";
        wordSelectorHTML += " *** NEW WORD *** ";
        numUpdatedWords_prs ++;
        wordSelectorHTML += nextWord_slug;
        wordSelectorHTML += "</option>";
    })

    wordSelectorHTML += "</select>";
    jQuery("#numUpdatedWordsContainer_prs").html(numUpdatedWords_prs);
    jQuery("#wordSelectorElem_prs").html(wordSelectorHTML);
    jQuery("#wordSelectorElem_prs").change(function(){
        showSelectedWord_prs();
    });
    showSelectedWord_prs();
}

// identifyWordUpdates_prs iterates through all pattern-actions in this group
// and executes them; output is an updated word list with all necessary changes
async function identifyWordUpdates_prs(words_in_obj) {
    var words_out_obj = MiscFunctions.cloneObj(words_in_obj);

    // the pattern of sets of properties will exist once in main schema for schemaForProperty and
    // once in every propertySchema for every concept.
    // Then propagateProperty will exist from each set in schemaForProperty to the corresponding set in propertySchema for each concept
    var schemaForProperty_slug = "schemaForProperty";
    var schemaForProperty_rF_obj = words_in_obj[schemaForProperty_slug];

    // First do the special case: update main schema for property, schemaForProperty
    // words_out_obj[schemaForProperty_slug] = await updateSchemaForPropertyWithNewArrayOfSets_prs(schemaForProperty_rF_obj,words_out_obj);
    // words_out_obj[schemaForProperty_slug] = await updatePropertySchemaSubsetRels_prs(words_out_obj[schemaForProperty_slug],words_out_obj)

    // update propertySchema for every concept
    var propertySchemaSlugs_arr = [];
    jQuery.each(words_out_obj,function(nextWord_slug, nextWord_obj){
        // console.log("nextWord_slug: "+nextWord_slug)
        var nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
        if (jQuery.inArray("concept",nextWord_wordTypes_arr) != -1 ) {
            var propertySchema_slug = nextWord_obj.conceptData.nodes.propertySchema.slug;
            propertySchemaSlugs_arr.push(propertySchema_slug)
        }
    })
    var numPropertySchemas = propertySchemaSlugs_arr.length;
    for (var s=0;s<numPropertySchemas;s++) {
        var propertySchema_slug = propertySchemaSlugs_arr[s];
        var propertySchema_rF_obj = MiscFunctions.cloneObj(words_in_obj[propertySchema_slug]);
        // words_out_obj[propertySchema_slug].wordData.fooooo="brrrrr";
        if (propertySchema_slug=="schemaForPropertiesForDog") {
            // ******************************************************* //
            // Currently I have to cycle through each of the following 3 functions
            // because I have not figured out how to do them sequentially using async
            // If I run all 3, the last one overwrites what comes before it
            // I need to feed the output of one to be the input to the next
            // !!! only do one at a time! above, set if (propertySchema_slug=="[schemaForPropertiesForBird]")
            // STEP 1: add all the new sets. This makes them all a subset of the main set for the propertySchema. (Superfluous subsetOf relationships will be removed later.)
            // words_out_obj[propertySchema_slug] = await updatePropertySchemaWithNewArrayOfSets_prs(propertySchema_rF_obj,words_out_obj);
            // STEP 2: use propagateProperty to connect sets from schemaForProperty to the sets for propertySchemaFor[each concept]
            // words_out_obj[propertySchema_slug] = updatePropertySchemaConnectSetsToMain_prs(propertySchema_rF_obj,words_out_obj);
            // STEP 3: add subsetOf relationships between sets as indicated by their type.
            // words_out_obj[propertySchema_slug] = updatePropertySchemaSubsetRels_prs(propertySchema_rF_obj,words_out_obj);
            // STEP 4: if a given concept's primaryProperty is absent, initialize by: adding primaryProperty, Standard Start Prop, and Standard Starter Properties, with relevant relationships
            // words_out_obj[propertySchema_slug] = initializePropertySchemaStandardStarters_prs(propertySchema_rF_obj,words_out_obj);
            // STEP 5: add relationship: primaryPropertyFor[] isASpecificInstanceOf propertiesFor[]_primaryProperty if not already added
            // words_out_obj[propertySchema_slug] = updatePropertySchemaSpecificInstanceRel_prs(propertySchema_rF_obj,words_out_obj);
        }

    }
    // createWordSelector_prs();

    return await words_out_obj;
}

const getPromise = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(`Promise resolved for ${time}s`)
        }, time)
    })
}

const getPropertyPromise = (time,nextPropertyType,propertySchema_out_rF_obj) => {
    return new Promise((resolve, reject) => {
        resolve( MiscFunctions.createNewWordByTemplate("set") )
    });
}

var newWords_obj = {};

function doArraysHaveAMatch(arr1,arr2) {
    var output = false;
    var num1 = arr1.length;
    var num2 = arr2.length;
    // console.log("doArraysHaveAMatch; num1: "+num1+"; num2: "+num2)
    for (var x=0;x<num1;x++) {
        for (var y=0;y<num2;y++) {
            var next1 = arr1[x];
            var next2 = arr2[y];
            if (next1 == next2) {
                output = true;
            }
        }
    }
    return output;
}

function updatePropertySchemaConnectSetsToMain_prs(propertySchema_in_rF_obj,words_out_obj) {
    var propertySchema_out_rF_obj = MiscFunctions.cloneObj(propertySchema_in_rF_obj);
    var propertySchema_slug = propertySchema_out_rF_obj.wordData.slug;
    var schemaForProperty_slug = "schemaForProperty";
    var schemaForProperty_rF_obj = words_out_obj[schemaForProperty_slug];
    var schemaForProperty_nodes_arr = schemaForProperty_rF_obj.schemaData.nodes;
    var numNodesMainSchema = schemaForProperty_nodes_arr.length;

    // cycle through each set node and
    // if there is a match of setData type, create the rel:
    // set(from the main schemaForProperty) -- propagateProperty -- set(from this propertySchema)
    var nodeList_arr = propertySchema_out_rF_obj.schemaData.nodes;
    var numNodes = nodeList_arr.length;
    for (var n=0;n<numNodes;n++) {
        var nextNode_obj = nodeList_arr[n];
        var nextNode_slug = nextNode_obj.slug;
        var nextNode_rF_obj = words_out_obj[nextNode_slug];
        if (nextNode_rF_obj.hasOwnProperty("setData")) {
            // now cycle through set nodes of main schemaForProperty
            for (var m=0;m<numNodesMainSchema;m++) {
                var nextNode_main_obj = schemaForProperty_nodes_arr[m];
                var nextNode_main_slug = nextNode_main_obj.slug;
                var nextNode_main_rF_obj = words_out_obj[nextNode_main_slug];
                if (nextNode_main_rF_obj.hasOwnProperty("setData")) {
                    var setTypes_arr = nextNode_rF_obj.setData.metaData.types;
                    var setTypes_main_arr = nextNode_main_rF_obj.setData.metaData.types;
                    var doTypesMatch = doArraysHaveAMatch(setTypes_arr,setTypes_main_arr);
                    // do not connect if set is type: mainPropertiesSet
                    if (jQuery.inArray("mainPropertiesSet",setTypes_arr) == -1) {
                        if (doTypesMatch) {
                            if (nextNode_main_slug != nextNode_slug) {
                                var relToAdd_obj = MiscFunctions.blankRel_obj();
                                relToAdd_obj.nodeFrom.slug = nextNode_main_slug;
                                relToAdd_obj.relationshipType.slug = "propagateProperty";
                                relToAdd_obj.nodeTo.slug = nextNode_slug;
                                var relToAdd_str = JSON.stringify(relToAdd_obj,null,4);
                                // console.log("relToAdd_str: "+relToAdd_str)
                                propertySchema_out_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_out_rF_obj,relToAdd_obj,words_out_obj)
                                // propertySchema_out_rF_obj.wordData.foo = "berr";
                                words_out_obj[propertySchema_slug] = propertySchema_out_rF_obj;
                            }
                        }
                    }
                }
            }
        }
    }
    // propertySchema_out_rF_obj.wordData.faa = "berr";
    return propertySchema_out_rF_obj;
}
function initializePropertySchemaStandardStarters_prs(propertySchema_in_rF_obj,words_out_obj) {
    var propertySchema_out_rF_obj = MiscFunctions.cloneObj(propertySchema_in_rF_obj);
    var governingConcept_slug = propertySchema_out_rF_obj.schemaData.metaData.governingConcept.slug;
    var governingConcept_rF_obj = MiscFunctions.cloneObj(words_out_obj[governingConcept_slug]);
    var primaryProperty_slug = governingConcept_rF_obj.conceptData.nodes.primaryProperty.slug;
    var primaryProperty_rF_obj = MiscFunctions.cloneObj(words_out_obj[primaryProperty_slug]);
    var primaryProperty_ipns = primaryProperty_rF_obj.metaData.ipns;

    var primaryProperty_obj = {};
    primaryProperty_obj.slug = primaryProperty_slug;
    primaryProperty_obj.ipns = primaryProperty_ipns;

    var isPrimaryPropertyPresent = MiscFunctions.isWordObjInArrayOfObj(primaryProperty_obj,propertySchema_out_rF_obj.schemaData.nodes);

    if (!isPrimaryPropertyPresent) {
        propertySchema_out_rF_obj.foo = "bar";
        // add these relationships:
        // 1. property_xgzhlf (Standard Starter Properties)-- propagateProperty -- primaryProperty_slug
        // 2. property_7dy3si (Standard Starter Props)-- propagateProperty -- primaryProperty_slug
        var relToAdd1_obj = MiscFunctions.blankRel_obj();
        var relToAdd2_obj = MiscFunctions.blankRel_obj();

        relToAdd1_obj.relationshipType.slug = "propagateProperty";
        relToAdd2_obj.relationshipType.slug = "propagateProperty";

        relToAdd1_obj.nodeTo.slug = primaryProperty_slug;
        relToAdd2_obj.nodeTo.slug = primaryProperty_slug;

        relToAdd1_obj.nodeFrom.slug = "property_xgzhlf";
        relToAdd2_obj.nodeFrom.slug = "property_7dy3si";

        propertySchema_out_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_out_rF_obj,relToAdd1_obj,words_out_obj);
        propertySchema_out_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_out_rF_obj,relToAdd2_obj,words_out_obj);

    }

    return propertySchema_out_rF_obj;
}

// add relationship: primaryPropertyFor[] isASpecificInstanceOf propertiesFor[]_primaryProperty if not already added
function updatePropertySchemaSpecificInstanceRel_prs(propertySchema_in_rF_obj,words_out_obj) {
    console.log("updatePropertySchemaSpecificInstanceRel_prs")
    var propertySchema_out_rF_obj = MiscFunctions.cloneObj(propertySchema_in_rF_obj);
    var thisPropertySchema_governingConcept_slug = propertySchema_out_rF_obj.schemaData.metaData.governingConcept.slug;

    var governingConcept_rF_obj = words_out_obj[thisPropertySchema_governingConcept_slug];
    var primaryProperty_slug = governingConcept_rF_obj.conceptData.nodes.primaryProperty.slug;
    var properties_slug = governingConcept_rF_obj.conceptData.nodes.properties.slug;
    var properties_primaryProperty_slug = properties_slug + "_primaryProperty";

    var newRel_obj = MiscFunctions.blankRel_obj();
    newRel_obj.nodeFrom.slug = primaryProperty_slug;
    newRel_obj.relationshipType.slug = "isASpecificInstanceOf";
    newRel_obj.nodeTo.slug = properties_primaryProperty_slug;

    var newRel_str = JSON.stringify(newRel_obj,null,4);
    console.log("newRel_str: "+newRel_str)

    propertySchema_out_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_out_rF_obj,newRel_obj,words_out_obj);

    return propertySchema_out_rF_obj;
}
function updatePropertySchemaSubsetRels_prs(propertySchema_in_rF_obj,words_out_obj) {
    var propertySchema_out_rF_obj = MiscFunctions.cloneObj(propertySchema_in_rF_obj);
    var thisPropertySchema_governingConcepts_arr = [ propertySchema_out_rF_obj.schemaData.metaData.governingConcept.slug ];

    var nodeList_arr = propertySchema_out_rF_obj.schemaData.nodes;
    var numNodes = nodeList_arr.length;
    for (var n=0;n<numNodes;n++) {
        var nextNode_obj = nodeList_arr[n];
        var nextNode_slug = nextNode_obj.slug;
        var nextNode_rF_obj = words_out_obj[nextNode_slug];
        if (nextNode_rF_obj.hasOwnProperty("setData")) {
            var nextNode_governingConcepts_arr = nextNode_rF_obj.setData.metaData.governingConcepts;
            var nextNode_setTypes_arr = nextNode_rF_obj.setData.metaData.types;
            var numSetTypes = nextNode_setTypes_arr.length;
            for (var t=0;t<numSetTypes;t++) {
                var nextSetType = nextNode_setTypes_arr[t];
                if (propertyTypes.hasOwnProperty(nextSetType)) {
                    var thisIsSubsetOfWhatType = propertyTypes[nextSetType].subsetOf;
                    // if (thisIsSubsetOfWhatType=="object") {
                        // now search through nodes for any that are of this type
                        for (var n2=0;n2<numNodes;n2++) {
                            var nextNode2_obj = nodeList_arr[n2];
                            var nextNode2_slug = nextNode2_obj.slug;
                            var nextNode2_rF_obj = words_out_obj[nextNode2_slug];
                            if (nextNode2_rF_obj.hasOwnProperty("setData")) {
                                var nextNode2_governingConcepts_arr = nextNode2_rF_obj.setData.metaData.governingConcepts;
                                var nextNode2_setTypes_arr = nextNode2_rF_obj.setData.metaData.types;
                                if (jQuery.inArray(thisIsSubsetOfWhatType,nextNode2_setTypes_arr) > -1) {
                                    // make sure both sets are part of this concept, not part of an outside governingConcept (ie conceptForProperty)
                                    var doGoverningConceptsMatch1 = doArraysHaveAMatch(nextNode_governingConcepts_arr,thisPropertySchema_governingConcepts_arr)
                                    var doGoverningConceptsMatch2 = doArraysHaveAMatch(nextNode2_governingConcepts_arr,thisPropertySchema_governingConcepts_arr)
                                    // if yes, add relationship
                                    if ((doGoverningConceptsMatch1) && (doGoverningConceptsMatch2)) {
                                        var newRel_obj = MiscFunctions.blankRel_obj();
                                        newRel_obj.nodeFrom.slug = nextNode_slug;
                                        newRel_obj.relationshipType.slug = "subsetOf";
                                        newRel_obj.nodeTo.slug = nextNode2_slug
                                        propertySchema_out_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_out_rF_obj,newRel_obj,words_out_obj);
                                    }
                                }
                            }
                        }
                    // }
                }
            }
        }
    }

    // propertySchema_out_rF_obj.foo="brrrrr";

    return propertySchema_out_rF_obj;
}

// This function is similar to updatePropertySchemaWithNewArrayOfSets_prs
// except that one works on every concept's propertySchema
// whereas this one works on main schema: schemaForProperty
async function updateSchemaForPropertyWithNewArrayOfSets_prs(schemaForProperty_in_rF_obj,words_out_obj) {
    var schemaForProperty_out_rF_obj = MiscFunctions.cloneObj(schemaForProperty_in_rF_obj);
    var governingConcept_slug = "conceptForProperty";
    var governingConcept_rF_obj = words_prs_pre_rF_obj[governingConcept_slug];
    var governingConcept_wordType_slug = governingConcept_rF_obj.conceptData.nodes.wordType.slug;
    var governingConcept_superset_slug = governingConcept_rF_obj.conceptData.nodes.superset.slug;
    var governingConcept_properties_slug = governingConcept_rF_obj.conceptData.nodes.properties.slug;
    var governingConcept_superset_rF_obj = words_prs_pre_rF_obj[governingConcept_superset_slug];

    // schemaForProperty_out_rF_obj.wordData.foo = "BRRRR";

    var currentNodes_arr = schemaForProperty_out_rF_obj.schemaData.nodes;
    var numCurrentNodes = currentNodes_arr.length;

    // first determine which types of sets are already present in propertySchema_out_rF_obj
    var setTypesAlreadyPresent_arr = [];
    for (var n=0;n<numCurrentNodes;n++) {
        var nextNode_obj = currentNodes_arr[n];
        var nextNode_slug = nextNode_obj.slug;
        var nextNode_rF_obj = words_out_obj[nextNode_slug];
        // var nextNode_str = JSON.stringify(nextNode_obj,null,4);
        // console.log("nextNode_str: "+nextNode_str)
        var nextNode_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;
        if (jQuery.inArray("set",nextNode_wordTypes_arr) > -1) {
            var setTypes_arr = nextNode_rF_obj.setData.metaData.types;
            setTypesAlreadyPresent_arr = setTypesAlreadyPresent_arr.concat(setTypes_arr)
        }
    }
    // var numSetTypesAlreadyPresent = setTypesAlreadyPresent_arr.length;
    // console.log("numSetTypesAlreadyPresent: "+numSetTypesAlreadyPresent)

    // then create the array of promise functions, each of which creates a new set
    var promiseAddProperty_arr = [];
    jQuery.each(propertyTypes,function(nextPropertyType,obj){
        // console.log("nextPropertyType: "+nextPropertyType+"; obj.applyTo.schemaForProperty: "+obj.applyTo.schemaForProperty)
        // check to see whether a set with the specified propertyType already exists; if not, add the corresponding promise function to array
        if (obj.applyTo.schemaForProperty===true) {
            if (jQuery.inArray(nextPropertyType,setTypesAlreadyPresent_arr) == -1) {
                var newSet_rF_obj = MiscFunctions.createNewWordByTemplate("set");
                promiseAddProperty_arr.push( [newSet_rF_obj,nextPropertyType] );
            }
        }
    });

    for (const [element,nextPropertyType] of promiseAddProperty_arr) {
        var newSet_rF_obj = await element;
        // console.log(nextPropertyType + " --- " + newSet_rF_obj.wordData.slug)

        newSet_rF_obj.setData.metaData.types.push(nextPropertyType)

        var newSet_slug = "properties_"+nextPropertyType;
        var newSet_title = "Properties: "+nextPropertyType;
        var newSet_name = "properties: "+nextPropertyType;

        newSet_rF_obj.wordData.slug = newSet_slug;
        newSet_rF_obj.wordData.title = newSet_title;
        newSet_rF_obj.wordData.name = newSet_name;
        newSet_rF_obj.setData.slug = newSet_slug;
        newSet_rF_obj.setData.title = newSet_title;
        newSet_rF_obj.setData.name = newSet_name;
        newSet_rF_obj.setData.metaData.governingConcepts.push(governingConcept_slug);
        var newSet_ipns = newSet_rF_obj.metaData.ipns;
        var nextWord_obj = {};
        nextWord_obj.slug = newSet_slug;
        nextWord_obj.ipns = newSet_ipns;

        words_prs_pre_rF_obj[newSet_slug] = { "newWord": "yup, a brand new word!" };
        words_prs_post_rF_obj[newSet_slug] = newSet_rF_obj;
        newWords_obj[newSet_slug] = newSet_rF_obj;

        var words_temp_obj = MiscFunctions.cloneObj(words_out_obj);
        words_temp_obj[newSet_slug] = newSet_rF_obj
        // propertySchema_out_rF_obj.schemaData.nodes.push(nextWord_obj);

        var newRel_obj = MiscFunctions.blankRel_obj();
        newRel_obj.nodeFrom.slug = newSet_slug;
        newRel_obj.relationshipType.slug = "subsetOf";
        newRel_obj.nodeTo.slug = governingConcept_superset_slug

        schemaForProperty_out_rF_obj = MiscFunctions.updateSchemaWithNewRel(schemaForProperty_out_rF_obj,newRel_obj,words_temp_obj);
    }


    return schemaForProperty_out_rF_obj;
}

async function updatePropertySchemaWithNewArrayOfSets_prs(propertySchema_in_rF_obj,words_out_obj) {
    var propertySchema_out_rF_obj = MiscFunctions.cloneObj(propertySchema_in_rF_obj);
    var governingConcept_slug = propertySchema_out_rF_obj.schemaData.metaData.governingConcept.slug;
    var governingConcept_rF_obj = words_prs_pre_rF_obj[governingConcept_slug];
    var governingConcept_wordType_slug = governingConcept_rF_obj.conceptData.nodes.wordType.slug;
    var governingConcept_superset_slug = governingConcept_rF_obj.conceptData.nodes.superset.slug;
    var governingConcept_properties_slug = governingConcept_rF_obj.conceptData.nodes.properties.slug;
    var governingConcept_superset_rF_obj = words_prs_pre_rF_obj[governingConcept_superset_slug];
    var governingConcept_superset_rF_str = JSON.stringify(governingConcept_superset_rF_obj,null,4)
    console.log("governingConcept_superset_rF_str: "+governingConcept_superset_rF_str)

    var currentNodes_arr = propertySchema_out_rF_obj.schemaData.nodes;
    var numCurrentNodes = currentNodes_arr.length;

    // first determine which types of sets are already present in propertySchema_out_rF_obj
    var setTypesAlreadyPresent_arr = [];
    for (var n=0;n<numCurrentNodes;n++) {
        var nextNode_obj = currentNodes_arr[n];
        var nextNode_slug = nextNode_obj.slug;
        var nextNode_rF_obj = words_out_obj[nextNode_slug];
        // var nextNode_str = JSON.stringify(nextNode_obj,null,4);
        // console.log("nextNode_slug: "+nextNode_slug+"; nextNode_str: "+nextNode_str)
        var nextNode_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;
        if (jQuery.inArray("set",nextNode_wordTypes_arr) > -1) {
            var setTypes_arr = nextNode_rF_obj.setData.metaData.types;
            setTypesAlreadyPresent_arr = setTypesAlreadyPresent_arr.concat(setTypes_arr)
        }
    }
    // var numSetTypesAlreadyPresent = setTypesAlreadyPresent_arr.length;
    // console.log("numSetTypesAlreadyPresent: "+numSetTypesAlreadyPresent)

    // then create the array of promise functions, each of which creates a new set
    var promiseAddProperty_arr = [];
    jQuery.each(propertyTypes,function(nextPropertyType,obj){
        // console.log("nextPropertyType: "+nextPropertyType+"; obj.applyTo.propertySchemas: "+obj.applyTo.propertySchemas)
        // check to see whether a set with the specified propertyType already exists; if not, add the corresponding promise function to array
        if (obj.applyTo.propertySchemas===true) {
            if (jQuery.inArray(nextPropertyType,setTypesAlreadyPresent_arr) == -1) {
                var newSet_rF_obj = MiscFunctions.createNewWordByTemplate("set");
                promiseAddProperty_arr.push( [newSet_rF_obj,nextPropertyType] );
            }
        }
    });

    for (const [element,nextPropertyType] of promiseAddProperty_arr) {
        var newSet_rF_obj = await element;
        // console.log(nextPropertyType + " --- " + newSet_rF_obj.wordData.slug)

        newSet_rF_obj.setData.metaData.types.push(nextPropertyType)

        var newSet_slug = "propertiesFor"+governingConcept_wordType_slug.substr(0,1).toUpperCase()+governingConcept_wordType_slug.substr(1)+"_"+nextPropertyType;
        var newSet_title = "Properties for "+governingConcept_wordType_slug.substr(0,1).toUpperCase()+governingConcept_wordType_slug.substr(1)+": "+nextPropertyType;
        var newSet_name = "properties for "+governingConcept_wordType_slug+": "+nextPropertyType;

        newSet_rF_obj.wordData.slug = newSet_slug;
        newSet_rF_obj.wordData.title = newSet_title;
        newSet_rF_obj.wordData.name = newSet_name;
        newSet_rF_obj.setData.slug = newSet_slug;
        newSet_rF_obj.setData.title = newSet_title;
        newSet_rF_obj.setData.name = newSet_name;
        newSet_rF_obj.setData.metaData.governingConcepts.push(governingConcept_slug);
        var newSet_ipns = newSet_rF_obj.metaData.ipns;
        var nextWord_obj = {};
        nextWord_obj.slug = newSet_slug;
        nextWord_obj.ipns = newSet_ipns;

        words_prs_pre_rF_obj[newSet_slug] = { "newWord": "yup, a brand new word!" };
        words_prs_post_rF_obj[newSet_slug] = newSet_rF_obj;
        newWords_obj[newSet_slug] = newSet_rF_obj;

        var words_temp_obj = MiscFunctions.cloneObj(words_out_obj);
        words_temp_obj[newSet_slug] = newSet_rF_obj
        // propertySchema_out_rF_obj.schemaData.nodes.push(nextWord_obj);

        var newRel_obj = MiscFunctions.blankRel_obj();
        newRel_obj.nodeFrom.slug = newSet_slug;
        newRel_obj.relationshipType.slug = "subsetOf";
        newRel_obj.nodeTo.slug = governingConcept_properties_slug

        propertySchema_out_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_out_rF_obj,newRel_obj,words_temp_obj);
    }

    var myPromiseArray = [getPromise(1000), getPromise(500), getPromise(3000)]
    for (const element of myPromiseArray) {
        let result = await element;
        // console.log(result)
    }

    /*
    jQuery.each(propertyTypes,function(nextPropertyType,obj){
        let count1 = Object.keys(words_prs_post_rF_obj).length
        let count2 = Object.keys(words_temp_obj).length
        let count3= Object.keys(words_out_obj).length
        var words_temp2_obj = MiscFunctions.cloneObj(await words_temp_obj);
        // console.log("adding relationships to properties; count1: "+count1+"; count2: "+count2+"; count3: "+count3)
        var governingConcept_slug = propertySchema_out_rF_obj.schemaData.metaData.governingConcept.slug;
        var governingConcept_rF_obj = words_prs_pre_rF_obj[governingConcept_slug];
        var governingConcept_properties_slug = governingConcept_rF_obj.conceptData.nodes.properties.slug;
        var newSet_slug = "propertiesFor"+governingConcept_wordType_slug.substr(0,1).toUpperCase()+governingConcept_wordType_slug.substr(1)+"_"+nextPropertyType;
        var newRel_obj = MiscFunctions.blankRel_obj();
        newRel_obj.nodeFrom.slug = newSet_slug;
        newRel_obj.relationshipType.slug = "subsetOf";
        newRel_obj.nodeTo.slug = governingConcept_properties_slug
        if (propertyTypes[nextPropertyType].subsetOf == "object") {
            // newRel_obj.nodeTo.slug = "propertiesFor"+governingConcept_wordType_slug.substr(0,1).toUpperCase()+governingConcept_wordType_slug.substr(1)+"_object";
        }
        // var words_temp_obj = MiscFunctions.cloneObj(words_out_obj);
        propertySchema_out_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_out_rF_obj,newRel_obj,words_temp2_obj);
    });
    */

    return await propertySchema_out_rF_obj;
}

function showSelectedWord_prs() {
    var selectedWord_slug = jQuery("#wordSelectorElem_prs option:selected").data("slug");
    // console.log("showSelectedWord_prs; selectedWord_slug: "+selectedWord_slug)
    var word_pre_rF_obj = words_prs_pre_rF_obj[selectedWord_slug];
    var word_pre_rF_str = JSON.stringify(word_pre_rF_obj,null,4);
    // console.log("word_pre_rF_str: "+word_pre_rF_str)
    var word_post_rF_obj = words_prs_post_rF_obj[selectedWord_slug];
    var word_post_rF_str = JSON.stringify(word_post_rF_obj,null,4);
    // console.log("word_post_rF_str: "+word_post_rF_str)
    jQuery("#word_pre_elem").html(word_pre_rF_str);
    jQuery("#word_post_elem").html(word_post_rF_str);
}
