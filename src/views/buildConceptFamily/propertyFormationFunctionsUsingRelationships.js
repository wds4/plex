import React, { Component, createRef, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { highlightedNode_slug } from '../../lib/visjs/visjs-functions.js';
// import GenerateCompactConceptSummarySelector, { reorganizeConcept, addEdgeWithStyling } from '../../views/GenerateCompactConceptSummarySelector';
import { lookupRawFileBySlug_obj, templatesByWordType_obj, insertOrUpdateWordIntoMyDictionary, insertOrUpdateWordIntoMyConceptGraph, insertOrUpdateWordIntoMyConceptGraphAndMyDictionary } from '../../views/addANewConcept';
import * as MiscFunctions from '../../lib/miscFunctions.js';
const jQuery = require("jquery");

// assume all required properties within propertySchema have been built
// assum JSON Schema main property has been set
// cycle through definitions.indirect and add each one to JSON Schema definitions so that JSON Schema will be ready for use
export function rebuildJSONSchemaDefinitions(jsonSchema_slug) {
    var jsonSchema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[jsonSchema_slug]));
    var jsonSchema_rF_str = JSON.stringify(jsonSchema_rF_obj,null,4);
    console.log("qwerty populatePropertyRequiredDefinitionsLists; jsonSchema_slug: "+jsonSchema_slug+"; jsonSchema_rF_str: "+jsonSchema_rF_str)
    var mainPath = jsonSchema_rF_obj.JSONSchemaData.metaData.primaryProperty;
    var governingConcept_slug = jsonSchema_rF_obj.JSONSchemaData.metaData.governingConcept.slug;
    var governingConcept_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[governingConcept_slug]));
    var primaryProperty_slug = governingConcept_rF_obj.conceptData.nodes.primaryProperty.slug;
    var primaryProperty_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[primaryProperty_slug]));
    var definitionList_arr = primaryProperty_rF_obj.propertyData.definitions.indirect;
    var definitionList_str = JSON.stringify(definitionList_arr,null,4);
    console.log("definitionList_str: "+definitionList_str);
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

        var nextProperty_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[nextProperty_slug]));
        var nextProperty_rF_str = JSON.stringify(nextProperty_rF_obj,null,4);
        console.log("nextProperty_rF_str: "+nextProperty_rF_str)
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
    var jsonSchema_rF_str = JSON.stringify(jsonSchema_rF_obj,null,4);
    console.log("qwerty populatePropertyRequiredDefinitionsLists; jsonSchema_slug: "+jsonSchema_slug+"; jsonSchema_rF_str: "+jsonSchema_rF_str)
    // = jsonSchema_rF_obj.properties[mainPath]["$ref"];
    var newKeyname = "";
    var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
    var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
    insertOrUpdateWordIntoMyConceptGraphAndMyDictionary(jsonSchema_rF_str,newKeyname,myConceptGraph,myDictionary)
}
// Rebuild of rebuildJSONSchemaDefinitions, except: instead of updating automatically,
// return the modified word
// (for use in propertyDataFunctions)
export function rebuildJSONSchemaDefinitions2(jsonSchema_rF_obj) {
    // var jsonSchema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[jsonSchema_slug]));

    var jsonSchema_slug = jsonSchema_rF_obj.wordData.slug;
    var jsonSchema_rF_str = JSON.stringify(jsonSchema_rF_obj,null,4);
    // if (jsonSchema_slug === "JSONSchemaForRating_rateeData_user") { console.log("qwerty populatePropertyRequiredDefinitionsLists; jsonSchema_rF_str: "+jsonSchema_rF_str) }
    // var mainPath = jsonSchema_rF_obj.JSONSchemaData.metaData.primaryProperty;
    // var governingConcept_slug = jsonSchema_rF_obj.JSONSchemaData.metaData.governingConcept.slug;
    // var governingConcept_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[governingConcept_slug]));
    // var primaryProperty_slug = governingConcept_rF_obj.conceptData.nodes.primaryProperty.slug;
    var primaryProperty_slug = jsonSchema_rF_obj.JSONSchemaData.metaData.primaryPropertySlug;
    var primaryProperty_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[primaryProperty_slug]));
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

        var nextProperty_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[nextProperty_slug]));
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
// input a propertySchema
// cycle through every property
// determine required definitions for property_rF_obj.propertyData.definitions.direct and .indirect
// multiple cycles required to fill .indirect array
export function populatePropertyRequiredDefinitionsLists(propertySchema_slug) {
    console.log("populatePropertyRequiredDefinitionsLists; propertySchema_slug: "+propertySchema_slug)
    var propertySchema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[propertySchema_slug]));
    var nodes_arr = propertySchema_rF_obj.schemaData.nodes;
    var numNodes = nodes_arr.length;
    // first populate nextNode_rF_obj.propertyData.JSONSchemaStyle.requiredDefinitions.direct for each property
    for (var n=0;n<numNodes;n++) {
        var nextNode_obj = nodes_arr[n];
        var nextNode_slug = nextNode_obj.slug;
        var nextNode_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[nextNode_slug]));
        var nextNode_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;
        if (jQuery.inArray("property",nextNode_wordTypes_arr) > -1) {
            console.log("calculating definitions list for nextNode_slug: "+nextNode_slug )
            // get list of required definitions from nextNode_rF_obj.propertyData.JSONSchemaStyle.
            var properties_arr = nextNode_rF_obj.propertyData.conceptGraphStyle.properties;
            var numProps = properties_arr.length;
            if (!nextNode_rF_obj.propertyData.hasOwnProperty("definitions")) {
                nextNode_rF_obj.propertyData.definitions = {};
            }
            if (!nextNode_rF_obj.propertyData.definitions.hasOwnProperty("direct")) {
                nextNode_rF_obj.propertyData.definitions.direct = [];
            }
            if (!nextNode_rF_obj.propertyData.definitions.hasOwnProperty("indirect")) {
                nextNode_rF_obj.propertyData.definitions.indirect = [];
            }
            for (var p=0;p< numProps;p++) {
                var nextProp_obj = properties_arr[p];
                var nextProp_slug = nextProp_obj.slug;
                console.log("pushing nextProp_slug: "+nextProp_slug)
                if (jQuery.inArray(nextProp_slug,nextNode_rF_obj.propertyData.definitions.direct) == -1) {
                    nextNode_rF_obj.propertyData.definitions.direct.push(nextProp_slug)
                }
                if (jQuery.inArray(nextProp_slug,nextNode_rF_obj.propertyData.definitions.indirect) == -1) {
                    nextNode_rF_obj.propertyData.definitions.indirect.push(nextProp_slug)
                }
            }
            lookupRawFileBySlug_obj.edited[nextNode_slug] = JSON.parse(JSON.stringify(nextNode_rF_obj))
        }
    }

    // now cycle through all properties (parent property);
    // fetch the elements (property slugs; child properties) in definitions.indirect of the parent property,
    // fetch definitions.indirect from each (child) element,
    // and add the fetched elements to definitions.indirect of the parent property
    // keep doing this until no more changes are made
    var changesMade = false;
    var continueCycles = true;
    var numIterations = 0;
    do {
        changesMade = false;
        for (var n=0;n<numNodes;n++) {
            var nextNode_obj = nodes_arr[n];
            var nextNode_slug = nextNode_obj.slug;
            var nextNode_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[nextNode_slug]));
            var nextNode_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;
            if (jQuery.inArray("property",nextNode_wordTypes_arr) > -1) {
                var childProps_arr = nextNode_rF_obj.propertyData.definitions.indirect;
                var numChildProps = childProps_arr.length;
                for (var c=0;c<numChildProps;c++) {
                    var nextChildProp_slug = childProps_arr[c];
                    console.log("QWERTY A; nextChildProp_slug: "+nextChildProp_slug)
                    var nextChildProp_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[nextChildProp_slug]));
                    var nextChildProp_wordTypes_arr = nextChildProp_rF_obj.wordData.wordTypes;
                    if (jQuery.inArray("property",nextChildProp_wordTypes_arr) > -1) {
                        console.log("QWERTY B; nextChildProp_slug: "+nextChildProp_slug)
                        if (nextChildProp_rF_obj.propertyData.hasOwnProperty("definitions")) {
                            var grandChildProps_arr = nextChildProp_rF_obj.propertyData.definitions.indirect;
                            var numGrandChildProps = grandChildProps_arr.length;
                            for (var g=0;g<numGrandChildProps;g++) {
                                var nextGrandChildProp_slug = grandChildProps_arr[g];
                                if (jQuery.inArray(nextGrandChildProp_slug,nextNode_rF_obj.propertyData.definitions.indirect) == -1) {
                                    nextNode_rF_obj.propertyData.definitions.indirect.push(nextGrandChildProp_slug)
                                    changesMade = true;
                                }
                            }
                        }
                    }
                    if (jQuery.inArray("enumeration",nextChildProp_wordTypes_arr) > -1) {
                        console.log("QWERTY C; nextChildProp_slug: "+nextChildProp_slug)
                        if (nextChildProp_rF_obj.enumerationData.hasOwnProperty("definitions")) {
                            var grandChildProps_arr = nextChildProp_rF_obj.enumerationData.definitions.indirect;
                            // NEED_TO_DO:
                            // add and populate definitions {direct:null,indirect:null} to enumerationData when creating a new enumeration node (under Show Graphs)
                            // add grandChildProps to enumerationData, same steps as propertyData a few lines up
                            // var grandChildProps_arr = nextChildProp_rF_obj.propertyData.definitions.indirect;
                            var numGrandChildProps = grandChildProps_arr.length;
                            for (var g=0;g<numGrandChildProps;g++) {
                                var nextGrandChildProp_slug = grandChildProps_arr[g];
                                if (jQuery.inArray(nextGrandChildProp_slug,nextNode_rF_obj.propertyData.definitions.indirect) == -1) {
                                    nextNode_rF_obj.propertyData.definitions.indirect.push(nextGrandChildProp_slug)
                                    changesMade = true;
                                }
                            }
                        }
                    }
                }
            }
            lookupRawFileBySlug_obj.edited[nextNode_slug] = JSON.parse(JSON.stringify(nextNode_rF_obj))
        }
        console.log("completed iteration number: "+numIterations)
        numIterations++;
        if (changesMade) { continueCycles = true; }
        if (numIterations > 5) { continueCycles = false; }
    } while (continueCycles)

    /*
    var relationships_arr = propertySchema_rF_obj.schemaData.relationships;
    var numRels = relationships_arr.length;
    for (var r=0;r<numRels;r++) {
        var nextRel_obj = relationships_arr[r];
        var nextRel_nodeFrom_slug = nextRel_obj.nodeFrom.slug;
        var nextRel_relType_slug = nextRel_obj.relationshipType.slug;
        var nextRel_nodeTo_slug = nextRel_obj.nodeTo.slug;

        var nodeTo_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[nextRel_nodeTo_slug]));

    }
    */
}

// update the highlightedNode assuming it is a property
// method: cycle through all addToConceptGraphProperties relationships and make sure relevant definition is added to properties list
export function processForward_highlightedNode() {
    var propertySchema_slug = jQuery("#conceptSelector_propSchemaAutoBuild option:selected").data("propertyschemaslug");
    var propertySchema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[propertySchema_slug]));
    console.log("processForward; highlightedNode_slug: "+highlightedNode_slug+"; propertySchema_slug: "+propertySchema_slug);
    var highlightedNode_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[highlightedNode_slug]));
    var highlightedNode_wordTypes_arr = highlightedNode_rF_obj.wordData.wordTypes;
    if (jQuery.inArray("property",highlightedNode_wordTypes_arr) > -1) {
        highlightedNode_rF_obj.wordData.a="b";
        lookupRawFileBySlug_obj.edited[highlightedNode_slug] = JSON.parse(JSON.stringify(highlightedNode_rF_obj));
        console.log("processForward; highlighted node is property wordType ")
        var relationships_arr = propertySchema_rF_obj.schemaData.relationships;
        var numRels = relationships_arr.length;
        var newProperties1_arr = [];
        var newProperties2_obj = {};
        var newDependencies_obj = {};
        console.log("processForward; numRels: "+numRels)
        for (var r=0;r<numRels;r++) {
            var nextRel_obj = relationships_arr[r];
            var nextRel_nodeFrom_slug = nextRel_obj.nodeFrom.slug;
            var nextRel_relType_slug = nextRel_obj.relationshipType.slug;
            var nextRel_nodeTo_slug = nextRel_obj.nodeTo.slug;
            if (nextRel_nodeTo_slug==highlightedNode_slug) {
                // process incoming properties
                if (nextRel_relType_slug=="addToConceptGraphProperties") {
                    var nextRel_field = nextRel_obj.relationshipType.addToConceptGraphPropertiesData.field;
                    console.log("processForward; addToConceptGraphProperties; nextRel_nodeFrom_slug: "+nextRel_nodeFrom_slug+"; nextRel_field: "+nextRel_field)
                    var nextRel_dependencies = false;
                    if (nextRel_obj.relationshipType.addToConceptGraphPropertiesData.hasOwnProperty("dependencies")) {
                        nextRel_dependencies = nextRel_obj.relationshipType.addToConceptGraphPropertiesData.dependencies;
                    }
                    var nextProperty1_obj = {}
                    nextProperty1_obj.key = nextRel_field;
                    nextProperty1_obj.slug = nextRel_nodeFrom_slug;
                    newProperties1_arr.push(nextProperty1_obj)

                    newProperties2_obj[nextRel_field] = {};
                    newProperties2_obj[nextRel_field]["$ref"] = "#/definitions/"+nextRel_nodeFrom_slug;

                    if (nextRel_dependencies) {
                        var nextRel_nodeFrom_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[nextRel_nodeFrom_slug]));
                        if (nextRel_nodeFrom_rF_obj.hasOwnProperty("enumerationData")) {
                            var newDeps_obj = nextRel_nodeFrom_rF_obj.enumerationData.JSONSchemaStyle.dependencies;
                            var newDeps2_obj = newDeps_obj["$field"];
                            var newDeps2_str = JSON.stringify(newDeps2_obj);
                            // newDeps2_str = newDeps2_str.replace(/\$field/g,nextRel_field);
                            newDeps2_str = newDeps2_str.replace(/\$field/g,nextRel_field);
                            var newDeps3_obj = JSON.parse(newDeps2_str);
                            newDependencies_obj[nextRel_field] = newDeps3_obj;
                            // newDependencies_obj[nextRel_field] = newDeps2_obj;
                        }
                    }
                }
            }
        }
        highlightedNode_rF_obj.propertyData.conceptGraphStyle.properties = newProperties1_arr;
        if (!highlightedNode_rF_obj.propertyData.JSONSchemaStyle.value) {
            highlightedNode_rF_obj.propertyData.JSONSchemaStyle.value = {};
            highlightedNode_rF_obj.propertyData.JSONSchemaStyle.value.type = "object";
            // highlightedNode_rF_obj.propertyData.JSONSchemaStyle.value.properties = {};
        }
        highlightedNode_rF_obj.propertyData.JSONSchemaStyle.value.properties = newProperties2_obj;
        highlightedNode_rF_obj.propertyData.JSONSchemaStyle.value.dependencies = newDependencies_obj;
        lookupRawFileBySlug_obj.edited[highlightedNode_slug] = JSON.parse(JSON.stringify(highlightedNode_rF_obj))
        MiscFunctions.updateWordInAllTables(highlightedNode_rF_obj);
        // for the highlightedNode,
        // cycle through each relationship in propertySchema
        // make sure all
    }
}
