import React, { Component, createRef, useEffect, useRef } from "react";
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import ReactDOM from 'react-dom';
import sendAsync from '../renderer';
import * as VisStyleConstants from '../lib/visjs/visjs-style';
import { lookupRawFileBySlug_obj, templatesByWordType_obj, clearFieldsCompactConceptSummary, insertOrUpdateWordIntoMyConceptGraphAndMyDictionary } from './addANewConcept';
import * as MiscFunctions from '../lib/miscFunctions.js';
import * as VisjsFunctions from '../lib/visjs/visjs-functions.js';
import IpfsHttpClient from 'ipfs-http-client';
import propertyTypes from '../json/propertyTypes';

const jQuery = require("jquery");

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

var nodes = new DataSet([
  { id: 1, label: 'Node 1' },
  { id: 2, label: 'Node 2' },
  { id: 3, label: 'Node 3' },
  { id: 4, label: 'Node 4' },
  { id: 5, label: 'Node 5' }
]);

// An array of edges
var edges = new DataSet([
  { from: 2, to: 5 }
]);

var data = {
  nodes,
  edges
};

var network = {};

var options = VisStyleConstants.options_vis_c2c;

export const VisNetworkB = () => {

    // A reference to the div rendered by this component
    var domNode = useRef(null);

    // A reference to the vis network instance
    var network = useRef(null);

    useEffect(
      () => {
        network.current = new Network(domNode.current, data, options);
      },
      [domNode, network, data, options]
    );

    return (
      <div style={{height:"100%"}} ref = { domNode } />
    );

};


var conceptSlug = "foo";
// introduce activeWord variables for use in several (two?) functions
var activeWord_obj = {};
var aW_wordType_slug = "activeWord_wordType";
var aW_superset_slug = "activeWord_superset";
var aW_schema_slug = "activeWord_schema";
var aW_JSONSchema_slug = "activeWord_JSONSchema";
var aW_concept_slug = "activeWord_concept";
var aW_propertySchema_slug = "activeWord_propertySchema";
var aW_properties_slug = "activeWord_properties";
var aW_primaryProperty_slug = "activeWord_primaryProperty";

// "isASubsetOf":{"polarity":"reverse","color":"#AFAFAF","width":"1","dashes":false,"physics":true},
// used by addANewConcept
export function addEdgeWithStyling(edges_arr,nextEdge_obj) {
    var nextEdge_out_obj = MiscFunctions.cloneObj(nextEdge_obj);
    var relType = nextEdge_out_obj.relationshipType;
    var rT_propertyField = nextEdge_out_obj.propertyField;
    nextEdge_out_obj.label = relType;
    if (rT_propertyField) {
        nextEdge_out_obj.label += ", FIELD: "+rT_propertyField;
    }
    console.log("addEdgeWithStyling; relType: "+relType)
    var nextEdge_color = VisStyleConstants.edgeOptions_obj[relType].color;
    nextEdge_out_obj.color = nextEdge_color;

    var nextEdge_width = VisStyleConstants.edgeOptions_obj[relType].width;
    nextEdge_out_obj.width = nextEdge_width;
    var nextEdge_dashes = VisStyleConstants.edgeOptions_obj[relType].dashes;
    nextEdge_out_obj.dashes = nextEdge_dashes;
    var nextEdge_polarity = VisStyleConstants.edgeOptions_obj[relType].polarity;
    if (nextEdge_polarity=="reverse") {
        console.log("polarity: reverse")
        nextEdge_out_obj.from = nextEdge_obj.nodeB;
        nextEdge_out_obj.to = nextEdge_obj.nodeA;
    }
    edges_arr.push(nextEdge_out_obj)
    return edges_arr;
}
export function addEdgeWithStyling_mainconcept(edges_arr,nextEdge_obj) {
    var nextEdge_out_obj = MiscFunctions.cloneObj(nextEdge_obj);
    var relType = nextEdge_out_obj.relationshipType;
    var rT_propertyField = nextEdge_out_obj.propertyField;
    nextEdge_out_obj.label = relType;
    if (rT_propertyField) {
        nextEdge_out_obj.label += ", FIELD: "+rT_propertyField;
    }
    var nextEdge_color = VisStyleConstants.edgeOptions_obj[relType].color;
    nextEdge_out_obj.color = nextEdge_color;

    var nextEdge_width = VisStyleConstants.edgeOptions_obj[relType].width;
    nextEdge_out_obj.width = nextEdge_width;
    var nextEdge_dashes = VisStyleConstants.edgeOptions_obj[relType].dashes;
    nextEdge_out_obj.dashes = nextEdge_dashes;
    var nextEdge_polarity = VisStyleConstants.edgeOptions_obj[relType].polarity;
    if (nextEdge_polarity=="reverse") {
        console.log("polarity: reverse")
        nextEdge_out_obj.from = nextEdge_obj.nodeB;
        nextEdge_out_obj.to = nextEdge_obj.nodeA;
    }
    edges_arr.push(nextEdge_out_obj)
    return edges_arr;
}






async function makeSupersetOrSetContainer(concept_x_slug) {
    console.log("makeSupersetOrSetContainer for concept_x_slug: "+concept_x_slug)
    var concept_rF_obj = lookupRawFileBySlug_obj.edited[concept_x_slug];
    var concept_primaryProperty_slug = concept_rF_obj.conceptData.nodes.primaryProperty.slug;
    var concept_JSONSchema_slug = concept_rF_obj.conceptData.nodes.JSONSchema.slug;
    var concept_superset_slug = concept_rF_obj.conceptData.nodes.superset.slug;
    var concept_superset_ipns = concept_rF_obj.conceptData.nodes.superset.ipns;
    var concept_sets_arr = concept_rF_obj.globalDynamicData.sets;
    var numSets = concept_sets_arr.length;

    var enumerationHTML = "";
    enumerationHTML += "create Enumeration:";
    enumerationHTML += "<br>";
    enumerationHTML += "node: ";
    enumerationHTML += "<select id='createEnumerationSelector_"+concept_x_slug+"' >";
    enumerationHTML += "<option data-slug='"+concept_superset_slug+"' data-ipns='"+concept_superset_ipns+"' >";
    enumerationHTML += concept_superset_slug;
    enumerationHTML += "</option>";
    for (var s=0;s<numSets;s++) {
        var nextSet_slug = concept_sets_arr[s];
        var nextSet_rF_obj = lookupRawFileBySlug_obj.edited[nextSet_slug];
        var nextSet_ipns = nextSet_rF_obj.metaData.ipns;
        enumerationHTML += "<option data-slug='"+nextSet_slug+"' data-ipns='"+nextSet_ipns+"' >";
        enumerationHTML += nextSet_slug;
        enumerationHTML += "</option>";
    }
    enumerationHTML += "</select>";

    // make selector for which prop will be used as the uniquely-identifying field
    // fetch array of options from this concept's primaryProperty from: propertyData.conceptGraphStyle.uniqueValueProps
    // for now, name, title, and slug will be the defaults for all
    // NEED_TO_DO: create set of properties that are "unique field" properties, meaning that:
    // within that concept, any given specificInstance's value of that field must be unique
    // then popluate propertyData.conceptGraphStyle.uniqueValueProps automatically
    // then fetch the options from that array
    // ? need to add data-ipns = uniqueField_ipns ?
    // ? need to change uniqueField_slug to the slug of the property ?
    // ? rearrange property set tree; make it multilevel; change how it is displayed in visjs

    // to obtain options for uniqueField, can either look in JSONSchema or primaryProperty for this concept
    var primaryProperty_rF_obj = lookupRawFileBySlug_obj[concept_primaryProperty_slug];
    var jsonSchema_rF_obj = lookupRawFileBySlug_obj[concept_JSONSchema_slug];
    // var uniqueValueProps_arr = primaryProperty_rF_obj.propertyData.conceptGraphStyle.uniqueValueProps;
    var unique_arr = [];
    if (primaryProperty_rF_obj.propertyData.conceptGraphStyle.hasOwnProperty("unique")) {
        unique_arr = primaryProperty_rF_obj.propertyData.conceptGraphStyle.unique;
    }
    var numUnique = unique_arr.length;
    enumerationHTML += "<br>";
    enumerationHTML += "uniqueField: ";
    enumerationHTML += "<select id='createEnumerationUniqueFieldSelector_"+concept_x_slug+"' >";
    for (var u=0;u<numUnique;u++) {
        var uniqueField_key = unique_arr[u];
        console.log("uniqueField_key: "+uniqueField_key)
        enumerationHTML += "<option data-key='"+uniqueField_key+"' >";
        enumerationHTML += uniqueField_key;
        enumerationHTML += "</option>";
    }
    enumerationHTML += "</select>";

    // old selector for uniqueField:
    /*
    enumerationHTML += "<br>";
    enumerationHTML += "old uniqueField: ";
    enumerationHTML += "<select id='old_createEnumerationUniqueFieldSelector_"+concept_x_slug+"' >";
        var uniqueField_key = "name";
        enumerationHTML += "<option data-key='"+uniqueField_key+"' >";
        enumerationHTML += uniqueField_key;
        enumerationHTML += "</option>";
        var uniqueField_key = "title";
        enumerationHTML += "<option data-key='"+uniqueField_key+"' >";
        enumerationHTML += uniqueField_key;
        enumerationHTML += "</option>";
        var uniqueField_key = "slug";
        enumerationHTML += "<option data-key='"+uniqueField_key+"' >";
        enumerationHTML += uniqueField_key;
        enumerationHTML += "</option>";
    enumerationHTML += "</select>";
    */

    enumerationHTML += "<br>";
    enumerationHTML += "<div class=doSomethingButton id='createEnumerationButton_"+concept_x_slug+"' data-conceptslug="+concept_x_slug+" >create</div>";

    enumerationHTML += "<br>";
    enumerationHTML += "<div style='display:inline-block;font-size:10px;width:300px;' >recalculate all enumeration nodes</div>";
    enumerationHTML += "<div id='recalculateEnumerationsButton_"+concept_x_slug+"' data-conceptslug='"+concept_x_slug+"' class=doSomethingButton_small >recalculate</div>";

    jQuery("#supersetOrSetContainer").html(enumerationHTML)
    jQuery("#recalculateEnumerationsButton_"+concept_x_slug).click(function(){
        // cycle through every enumerates relationship within the concept's main schema and recalculate
        // the already-created enumeration node
        var concept_slug = jQuery(this).data("conceptslug");
        console.log("recalculateEnumerationsButton_"+concept_slug+" clicked; concept_x_slug: "+concept_slug)
        var concept_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[concept_slug]))
        var conceptPath = concept_rF_obj.conceptData.ReactJSONSchema.key;
        var concept_schema_slug = concept_rF_obj.conceptData.nodes.schema.slug;
        var schema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[concept_schema_slug]))
        var relationships_arr = schema_rF_obj.schemaData.relationships;
        var numRels = relationships_arr.length;
        for (var r=0;r<numRels;r++) {
            var nextRel_obj = relationships_arr[r];
            var nextRel_rT_slug = nextRel_obj.relationshipType.slug;
            var nextRel_nF_slug = nextRel_obj.nodeFrom.slug;
            var nextRel_nT_slug = nextRel_obj.nodeTo.slug;
            if (nextRel_rT_slug=="enumerates") {
                console.log(nextRel_nF_slug+" enumerates "+nextRel_nT_slug)
                var set_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[nextRel_nF_slug]))
                var updatedEnumeration_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[nextRel_nT_slug]))

                var uniqueField_key = updatedEnumeration_obj.enumerationData.field;
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
                    var nextSpecificInstance_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[nextSpecificInstance_slug]));
                    if (nextSpecificInstance_rF_obj[conceptPath].hasOwnProperty(uniqueField_key)) {
                        var nextSpecificInstance_key = nextSpecificInstance_rF_obj[conceptPath][uniqueField_key];
                    } else {
                        var nextSpecificInstance_key = nextSpecificInstance_slug;
                    }
                    enumList_arr.push(nextSpecificInstance_key);
                    enumList_slugs_arr.push(nextSpecificInstance_slug);
                    nextDependenciesOption_obj.properties["$field"] = {};
                    nextDependenciesOption_obj.properties["$field"].enum = [ nextSpecificInstance_key ];
                    if (nextSpecificInstance_rF_obj.hasOwnProperty("wordTypeData")) {
                        var nextSpecificInstance_governingConcept_slug = nextSpecificInstance_rF_obj.wordTypeData.concept;
                        var nextSpecificInstance_governingConcept_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[nextSpecificInstance_governingConcept_slug]))
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

                var updatedEnumeration_str = JSON.stringify(updatedEnumeration_obj,null,4);
                console.log("updatedEnumeration_str: "+updatedEnumeration_str)
                var newKeyname = "";
                var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
                var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
                insertOrUpdateWordIntoMyConceptGraphAndMyDictionary(updatedEnumeration_str,newKeyname,myConceptGraph,myDictionary)
            }
        }
    });
    jQuery("#createEnumerationButton_"+concept_x_slug).click(async function(){
        var concept_slug = jQuery(this).data("conceptslug")
        var set_slug = jQuery("#createEnumerationSelector_"+concept_slug+" option:selected").data("slug")
        var uniqueField_key = jQuery("#createEnumerationUniqueFieldSelector_"+concept_slug+" option:selected").data("key")
        console.log("createEnumerationSelector; concept_slug: "+concept_slug+"; set_slug: "+set_slug+"; uniqueField_key: "+uniqueField_key)

        var concept_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[concept_slug]))
        var conceptPath = concept_rF_obj.conceptData.ReactJSONSchema.key;
        var concept_schema_slug = concept_rF_obj.conceptData.nodes.schema.slug;
        var concept_schema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[concept_schema_slug]))

        var set_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[set_slug]));
        var set_title = "";
        var set_description = "";
        if (set_rF_obj.wordData.hasOwnProperty("title")) {
            set_title = set_rF_obj.wordData.title;
        }
        if (set_rF_obj.wordData.hasOwnProperty("description")) {
            set_description = set_rF_obj.wordData.description;
        }
        if (set_rF_obj.hasOwnProperty("setData")) {
            set_title = set_rF_obj.wordData.title;
            set_description = set_rF_obj.setData.description;
        }

        var set_specificInstances_arr = set_rF_obj.globalDynamicData.specificInstances;
        var numSpecificInstances = set_specificInstances_arr.length;
        var enumList_arr = [];
        for (var i=0;i<numSpecificInstances;i++) {
            var nextSpecificInstance_slug = set_specificInstances_arr[i];
            console.log("nextSpecificInstance_slug: "+nextSpecificInstance_slug)
            var nextSpecificInstance_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[nextSpecificInstance_slug]));
            if (nextSpecificInstance_rF_obj[conceptPath].hasOwnProperty(uniqueField_key)) {
                var nextSpecificInstance_key = nextSpecificInstance_rF_obj[conceptPath][uniqueField_key];
            } else {
                var nextSpecificInstance_key = nextSpecificInstance_slug;
            }
            enumList_arr.push(nextSpecificInstance_key);
        }

        var newEnumeration_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["enumeration"]));

        var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
        var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
        newEnumeration_obj.globalDynamicData.myDictionaries.push(myDictionary);
        newEnumeration_obj.globalDynamicData.myConceptGraphs.push(myConceptGraph);

        var currentTime = Date.now();
        var newKeyname = "dictionaryWord_property_"+currentTime;
        var generatedKey_obj = await ipfs.key.gen(newKeyname, {
            type: 'rsa',
            size: 2048
        })
        var newEnumeration_ipns = generatedKey_obj["id"];
        var generatedKey_name = generatedKey_obj["name"];
        console.log("generatedKey_obj id: "+newEnumeration_ipns+"; name: "+generatedKey_name);
        newEnumeration_obj.metaData.ipns = newEnumeration_ipns;

        var newEnumeration_slug = "enumerationFrom_"+set_slug+"_"+newEnumeration_ipns.slice(newEnumeration_ipns.length-6);
        var newEnumeration_name = "enumeration from "+set_slug+" ("+newEnumeration_ipns.slice(newEnumeration_ipns.length-6)+")";
        var newEnumeration_title = "Enumeration from "+set_slug+" ("+newEnumeration_ipns.slice(newEnumeration_ipns.length-6)+")";
        var newEnumeration_description = "";
        newEnumeration_obj.wordData.slug = newEnumeration_slug;
        newEnumeration_obj.wordData.name = newEnumeration_name;
        newEnumeration_obj.wordData.title = newEnumeration_title;

        newEnumeration_obj.enumerationData.name = newEnumeration_name;
        newEnumeration_obj.enumerationData.title = newEnumeration_title;
        newEnumeration_obj.enumerationData.description = newEnumeration_description;
        newEnumeration_obj.enumerationData.field = uniqueField_key;
        newEnumeration_obj.enumerationData.source = {};
        newEnumeration_obj.enumerationData.source.concept = concept_slug;
        newEnumeration_obj.enumerationData.source.set = set_slug;
        newEnumeration_obj.enumerationData.conceptGraphStyle.type = "string";

        newEnumeration_obj.enumerationData.JSONSchemaStyle.value = {};
        newEnumeration_obj.enumerationData.JSONSchemaStyle.value.type = "string";
        newEnumeration_obj.enumerationData.JSONSchemaStyle.value.title = set_title;
        newEnumeration_obj.enumerationData.JSONSchemaStyle.value.description = set_description;
        newEnumeration_obj.enumerationData.JSONSchemaStyle.value.enum = enumList_arr;

        lookupRawFileBySlug_obj[newEnumeration_slug] = newEnumeration_obj;
        lookupRawFileBySlug_obj.edited[newEnumeration_slug] = newEnumeration_obj;

        // update concept_rF_obj
        if (!concept_rF_obj.conceptData.hasOwnProperty("enumerations")) {
            concept_rF_obj.conceptData.enumerations = [];
        }
        if (jQuery.inArray(newEnumeration_slug,concept_rF_obj.conceptData.enumerations) == -1) {
            concept_rF_obj.conceptData.enumerations.push(newEnumeration_slug)
        }
        lookupRawFileBySlug_obj[concept_slug] = concept_rF_obj;
        lookupRawFileBySlug_obj.edited[concept_slug] = concept_rF_obj;
        var concept_rF_str = JSON.stringify(concept_rF_obj,null,4);
        console.log("QWERTY concept_rF_str: "+concept_rF_str)

        var enumRel_obj ={};
        enumRel_obj.nodeFrom = {};
        enumRel_obj.relationshipType = {};
        enumRel_obj.nodeTo = {};
        enumRel_obj.nodeFrom.slug = set_slug;
        enumRel_obj.relationshipType.slug = "enumerates";
        enumRel_obj.nodeTo.slug = newEnumeration_slug;

        var enumRel_str = JSON.stringify(enumRel_obj,null,4);
        var newEnumeration_str = JSON.stringify(newEnumeration_obj,null,4);
        console.log("createEnumerationSelector; concept_slug: "+concept_slug+"; conceptPath: "+conceptPath+"; concept_schema_slug: "+concept_schema_slug+"; set_slug: "+set_slug+"; newEnumeration_slug: "+newEnumeration_slug+"; enumRel_str: "+enumRel_str)
        console.log("QWERTY newEnumeration_str: "+newEnumeration_str);

        concept_schema_rF_obj = MiscFunctions.updateSchemaWithNewRel(concept_schema_rF_obj,enumRel_obj,lookupRawFileBySlug_obj);
        lookupRawFileBySlug_obj[concept_schema_slug] = concept_schema_rF_obj;
        lookupRawFileBySlug_obj.edited[concept_schema_slug] = concept_schema_rF_obj;

        var concept_schema_rF_str = JSON.stringify(concept_schema_rF_obj,null,4);
        console.log("QWERTY concept_schema_rF_str: "+concept_schema_rF_str)

        // when ready to store in SQL:
        //
        insertOrUpdateWordIntoMyConceptGraphAndMyDictionary(newEnumeration_str,newKeyname,myConceptGraph,myDictionary)
        insertOrUpdateWordIntoMyConceptGraphAndMyDictionary(concept_schema_rF_str,newKeyname,myConceptGraph,myDictionary)
        insertOrUpdateWordIntoMyConceptGraphAndMyDictionary(concept_rF_str,newKeyname,myConceptGraph,myDictionary)

    })
}
function createNodeFromAndNodeToSelectors(concept_slug) {
    var nodeFromSelectorHTML = "";
    var nodeToSelectorHTML = "";
    nodeFromSelectorHTML += "<select id=nodeFromSelector >";
    nodeToSelectorHTML += "<select id=nodeToSelector >";

    // add all sets from the main concept propertySchema
    var spacerOptionHTML = "";
    spacerOptionHTML += "<option data-slug='_blank_' data-ipns='_blank_' >";
    spacerOptionHTML += " ======== SETS (main concept propertySchema) ======== ";
    spacerOptionHTML += "</option>";
    nodeFromSelectorHTML += spacerOptionHTML;
    nodeToSelectorHTML += spacerOptionHTML;
    var propertySchema_slug = "schemaForProperty"
    var propertySchema_rF_obj = lookupRawFileBySlug_obj[propertySchema_slug];
    var propertySchema_nodes_arr = propertySchema_rF_obj.schemaData.nodes;
    var numNodes = propertySchema_nodes_arr.length;
    for (var n=0;n<numNodes;n++) {
        var nextNode_obj = propertySchema_nodes_arr[n];
        var nextNode_slug = nextNode_obj.slug;
        var nextNode_rF_obj = lookupRawFileBySlug_obj[nextNode_slug];
        var nextNode_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;
        var nextNode_ipns = nextNode_rF_obj.metaData.ipns;
        if (jQuery.inArray("set",nextNode_wordTypes_arr) > -1) {
            var nextOptionHTML = "";
            nextOptionHTML += "<option data-slug="+nextNode_slug+" data-ipns="+nextNode_ipns+" >";
            nextOptionHTML += nextNode_slug;
            nextOptionHTML += "</option>";

            nodeFromSelectorHTML += nextOptionHTML;
            nodeToSelectorHTML += nextOptionHTML;
        }
    }

    // add all sets from this propertySchema
    var spacerOptionHTML = "";
    spacerOptionHTML += "<option data-slug='_blank_' data-ipns='_blank_' >";
    spacerOptionHTML += " ======== SETS (this propertySchema) ======== ";
    spacerOptionHTML += "</option>";
    nodeFromSelectorHTML += spacerOptionHTML;
    nodeToSelectorHTML += spacerOptionHTML;
    var concept_rF_obj = lookupRawFileBySlug_obj[concept_slug];
    var propertySchema_slug = concept_rF_obj.conceptData.nodes.propertySchema.slug;
    var propertySchema_rF_obj = lookupRawFileBySlug_obj[propertySchema_slug];
    var propertySchema_nodes_arr = propertySchema_rF_obj.schemaData.nodes;
    var numNodes = propertySchema_nodes_arr.length;
    for (var n=0;n<numNodes;n++) {
        var nextNode_obj = propertySchema_nodes_arr[n];
        var nextNode_slug = nextNode_obj.slug;
        var nextNode_rF_obj = lookupRawFileBySlug_obj[nextNode_slug];
        var nextNode_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;
        var nextNode_ipns = nextNode_rF_obj.metaData.ipns;
        if (jQuery.inArray("set",nextNode_wordTypes_arr) > -1) {
            var nextOptionHTML = "";
            nextOptionHTML += "<option data-slug="+nextNode_slug+" data-ipns="+nextNode_ipns+" >";
            nextOptionHTML += nextNode_slug;
            nextOptionHTML += "</option>";

            nodeFromSelectorHTML += nextOptionHTML;
            nodeToSelectorHTML += nextOptionHTML;
        }
    }

    // add all properties
    var spacerOptionHTML = "";
    spacerOptionHTML += "<option data-slug='_blank_' data-ipns='_blank_' >";
    spacerOptionHTML += " ======== PROPERTIES ======== ";
    spacerOptionHTML += "</option>";
    nodeFromSelectorHTML += spacerOptionHTML;
    nodeToSelectorHTML += spacerOptionHTML;
    var currentConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
    var sql = "";
    sql += " SELECT * FROM "+currentConceptGraph_tableName;
    sendAsync(sql).then((words_x_arr) => {
        var numWords = words_x_arr.length;
        // console.log("qwerty numWords: "+numWords)
        for (var w=0;w<numWords;w++) {
            var nextWord_str = words_x_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_wordTypes = nextWord_obj.wordData.wordTypes;
            var nextWord_ipns = nextWord_obj.metaData.ipns;
            if (jQuery.inArray("property",nextWord_wordTypes) > -1) {
                var nextWord_title = nextWord_obj.wordData.title;
                var nextOptionHTML = "";
                nextOptionHTML += "<option data-slug="+nextWord_slug+" data-ipns="+nextWord_ipns+" >";
                nextOptionHTML += nextWord_title;
                nextOptionHTML += " ("+nextWord_slug+")";
                nextOptionHTML += "</option>";

                nodeFromSelectorHTML += nextOptionHTML;
                nodeToSelectorHTML += nextOptionHTML;
            }
        }
        nodeFromSelectorHTML += "</select>";
        nodeToSelectorHTML += "</select>";

        jQuery("#nodeFromSelectorContainer").html(nodeFromSelectorHTML)
        jQuery("#nodeFromSelectorContainer").val(nodeFromSelectorHTML)

        jQuery("#nodeToSelectorContainer").html(nodeToSelectorHTML)
        jQuery("#nodeToSelectorContainer").val(nodeToSelectorHTML)
    });
}

function makeEditPropertySchemaPanel(aW_concept_slug) {
    var aW_concept_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[aW_concept_slug]));
    var propertySchema_slug = aW_concept_rF_obj.conceptData.nodes.propertySchema.slug;
    var propertySchema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[propertySchema_slug]));
    var propertySchema_nodes_arr = propertySchema_rF_obj.schemaData.nodes;
    var numPropSchemaNodes = propertySchema_nodes_arr.length;

    var enumeration_slug = jQuery("#enumerationSelector option:selected").data("slug")
    var editPropertyHTML = "";

    editPropertyHTML += "<div style='border:1px solid black;padding:2px;'>";
        editPropertyHTML += "<center>add relationship</center>";
        editPropertyHTML += "nodeFrom: ";
        editPropertyHTML += "<div id=nodeFromSelectorContainer style=display:inline-block; >nodeFromSelectorContainer</div>";
        editPropertyHTML += "<br>";
        editPropertyHTML += "relationship: ";

        editPropertyHTML += "<select id=relationshipSelector style=display:inline-block;font-size:10px;margin-right:5px >";
            editPropertyHTML += "<option data-slug='addPropertyKey' >addPropertyKey</option>";
            editPropertyHTML += "<option data-slug='addPropertyValue' >addPropertyValue</option>";
            editPropertyHTML += "<option data-slug='propagateProperty' >propagateProperty</option>";
            editPropertyHTML += "<option data-slug='addToConceptGraphProperties' >addToConceptGraphProperties</option>";
            editPropertyHTML += "<option data-slug='isASpecificInstanceOf' >isASpecificInstanceOf</option>";
        editPropertyHTML += "</select>";

        editPropertyHTML += "<br>";
        editPropertyHTML += "relationship field: ";
        editPropertyHTML += "<textarea id=relationshipField style=display:inline-block;width:200px;height:25px; ></textarea>";
        editPropertyHTML += "<br>";
        editPropertyHTML += "nodeTo: ";
        editPropertyHTML += "<div id=nodeToSelectorContainer style=display:inline-block; >nodeToSelectorContainer</div>";
        editPropertyHTML += "<br>";

        editPropertyHTML += "<div class=doSomethingButton id=updatePropertySchema_"+aW_concept_slug+" data-propertyschemaslug="+propertySchema_slug+" >";
        editPropertyHTML += "update";
        editPropertyHTML += "</div>";

    editPropertyHTML += "</div>";

    // editPropertyHTML += "<div style='border:1px solid black;padding:2px;'>";
    editPropertyHTML += "Connect enumeration to a property in concept: "+aW_concept_slug;
    editPropertyHTML += "<br>";
    editPropertyHTML += "pick a property to connect to: ";
    editPropertyHTML += "<select id='targetPropertySelector' >";
    for (var p=0;p<numPropSchemaNodes;p++) {
        var nextNode_obj = propertySchema_nodes_arr[p];
        var nextNode_slug = nextNode_obj.slug;
        var nextNode_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[nextNode_slug]));
        var nextNode_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;
        if (jQuery.inArray("property",nextNode_wordTypes_arr) > -1) {
            editPropertyHTML += "<option data-slug='"+nextNode_slug+"' >";
            editPropertyHTML += nextNode_slug;
            editPropertyHTML += "</option>";
        }
    }
    editPropertyHTML += "</select>";
    editPropertyHTML += "<br>";
    editPropertyHTML += "relationshipType: addToConceptGraphProperties";
    editPropertyHTML += "<br>";
    editPropertyHTML += "field: <textarea style='width:380px;height:25px;' id=addToConceptGraphProperties_field ></textarea>";
    editPropertyHTML += "<br>";
    editPropertyHTML += "dependencies: <input type=checkbox checked id=addToConceptGraphProperties_dependencies />";
    editPropertyHTML += "<br>";
    editPropertyHTML += "<div style='display:inline-block;font-size:10px;width:300px;' >select an existing enumeration node (selector), selcte a superset or set (selector), connect via addToConceptGraphProperties relationship, and add relationship (and enumeration node) to propertySchema:</div>";
    editPropertyHTML += "<div id='connectEnumerationToPropertyButton_"+aW_concept_slug+"' data-conceptslug='"+aW_concept_slug+"' class=doSomethingButton_small >make addToConceptGraphProperties relationship</div>";
    // editPropertyHTML += "</div>";

    jQuery("#editPropertySchemaContainer").html(editPropertyHTML);
    jQuery("#updatePropertySchema_"+aW_concept_slug).click(function(){
        var propertyschemaslug = jQuery(this).data("propertyschemaslug");
        var nodeFromSlug = jQuery("#nodeFromSelector option:selected").data("slug");
        var nodeToSlug = jQuery("#nodeToSelector option:selected").data("slug");
        var relationshipTypeSlug = jQuery("#relationshipSelector option:selected").data("slug");
        var relationshipField = jQuery("#relationshipField").val();
        var nextRel_obj = {};
        nextRel_obj.nodeFrom = {};
        nextRel_obj.relationshipType = {};
        nextRel_obj.nodeTo = {};

        nextRel_obj.nodeFrom.slug = nodeFromSlug;
        nextRel_obj.relationshipType.slug = relationshipTypeSlug;
        if ( (relationshipTypeSlug=="addToConceptGraphProperties")
            || (relationshipTypeSlug=="addPropertyKey")
            || (relationshipTypeSlug=="addPropertyValue")
          ) {
            var retTypeData = relationshipTypeSlug + "Data";
            nextRel_obj.relationshipType[retTypeData] = {};
            nextRel_obj.relationshipType[retTypeData].field = relationshipField;
        }
        nextRel_obj.nodeTo.slug = nodeToSlug;
        var nextRel_str = JSON.stringify(nextRel_obj,null,4)
        console.log("updatePropertySchema_; propertyschemaslug: "+propertyschemaslug+"; relationshipTypeSlug: "+relationshipTypeSlug);
        console.log("nextRel_str: "+nextRel_str);

        var propertySchema_rF_obj = lookupRawFileBySlug_obj[propertyschemaslug];
        var propertySchema_rF_str = JSON.stringify(propertySchema_rF_obj,null,4);
        console.log("propertySchema_rF_str before: "+propertySchema_rF_str)

        propertySchema_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_rF_obj,nextRel_obj,lookupRawFileBySlug_obj);
        lookupRawFileBySlug_obj[propertySchema_slug] = propertySchema_rF_obj;
        lookupRawFileBySlug_obj.edited[propertySchema_slug] = propertySchema_rF_obj;
        MiscFunctions.updateWordInAllTables(propertySchema_rF_obj);

        var propertySchema_rF_str = JSON.stringify(propertySchema_rF_obj,null,4);
        console.log("propertySchema_rF_str after: "+propertySchema_rF_str)

    })
    createNodeFromAndNodeToSelectors(aW_concept_slug);
    jQuery("#enumerationSelector").change(function(){
        var selectedEnumeration_slug = jQuery("option:selected",this).data("slug")
        var selectedEnumeration_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[selectedEnumeration_slug]));
        var selectedEnumeration_title = selectedEnumeration_rF_obj.enumerationData.title;
        jQuery("#addToConceptGraphProperties_field").val(selectedEnumeration_title)
        jQuery("#addToConceptGraphProperties_field").html(selectedEnumeration_title)
        console.log("enumerationSelector; selectedEnumeration_slug: "+selectedEnumeration_slug+"; selectedEnumeration_title: "+selectedEnumeration_title)
    });
    jQuery("#connectEnumerationToPropertyButton_"+aW_concept_slug).click(function(){
        var concept_slug = jQuery(this).data("conceptslug");
        var concept_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[concept_slug]));
        var concept_rF_str = JSON.stringify(concept_rF_obj,null,4);
        console.log("concept_rF_str: "+concept_rF_str)
        var propertySchema_slug = concept_rF_obj.conceptData.nodes.propertySchema.slug;
        var propertySchema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[propertySchema_slug]));
        var nextNode_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;
        var targetProperty_slug = jQuery("#targetPropertySelector option:selected").data("slug");
        var prop_field = jQuery("#addToConceptGraphProperties_field").val();
        var prop_dependencies = jQuery("#addToConceptGraphProperties_dependencies").is(":checked")
        var selectedEnumeration_slug = jQuery("#enumerationSelector option:selected").data("slug")
        var newRel_obj = {};
        newRel_obj.nodeFrom = {};
        newRel_obj.relationshipType = {};
        newRel_obj.nodeTo = {};
        newRel_obj.nodeFrom.slug = selectedEnumeration_slug;
        newRel_obj.relationshipType.slug = "addToConceptGraphProperties";
        newRel_obj.relationshipType.addToConceptGraphPropertiesData = {};
        newRel_obj.relationshipType.addToConceptGraphPropertiesData.field = prop_field;
        newRel_obj.relationshipType.addToConceptGraphPropertiesData.dependencies = prop_dependencies;
        newRel_obj.nodeTo.slug = targetProperty_slug;
        var newRel_str = JSON.stringify(newRel_obj,null,4);
        console.log("qwerty connectEnumerationToPropertyButton_"+aW_concept_slug+"; concept_slug: "+concept_slug+"; newRel_str: "+newRel_str);

        propertySchema_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_rF_obj,newRel_obj,lookupRawFileBySlug_obj);
        lookupRawFileBySlug_obj[propertySchema_slug] = propertySchema_rF_obj;
        lookupRawFileBySlug_obj.edited[propertySchema_slug] = propertySchema_rF_obj;

        var propertySchema_rF_str = JSON.stringify(propertySchema_rF_obj,null,4);
        // console.log("qwerty propertySchema_rF_str: "+propertySchema_rF_str)

        var newKeyname = "";
        var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
        var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
        insertOrUpdateWordIntoMyConceptGraphAndMyDictionary(propertySchema_rF_str,newKeyname,myConceptGraph,myDictionary)

    })
}

export function makeVisGraphForConcept_mainschema(aW_concept_slug) {
    console.log("makeVisGraphForConcept_mainschema; aW_concept_slug: "+aW_concept_slug)
    activeWord_obj = lookupRawFileBySlug_obj[aW_concept_slug];
    aW_wordType_slug = activeWord_obj.conceptData.nodes.wordType.slug;
    aW_superset_slug = activeWord_obj.conceptData.nodes.superset.slug;
    aW_concept_slug = activeWord_obj.conceptData.nodes.concept.slug;
    aW_schema_slug = activeWord_obj.conceptData.nodes.schema.slug;
    aW_JSONSchema_slug = activeWord_obj.conceptData.nodes.JSONSchema.slug;
    var enumerations_arr = [];
    if (activeWord_obj.conceptData.hasOwnProperty("enumerations")) {
        enumerations_arr = activeWord_obj.conceptData.enumerations;
    }

    var sets_arr = activeWord_obj.globalDynamicData.sets;
    var si_arr = activeWord_obj.globalDynamicData.specificInstances;

    var nextNode_obj = {};
    var nodes_arr = [
        { id: aW_wordType_slug, label: aW_wordType_slug, slug: aW_wordType_slug, conceptRole: 'wordType', group: 'wordType', x:0, y:0, physics:false },
        { id: aW_JSONSchema_slug, label: aW_JSONSchema_slug, slug: aW_JSONSchema_slug, conceptRole: 'JSONSchema', group: 'JSONSchema', x:-100, y:0, physics:false },
        { id: aW_concept_slug, label: aW_concept_slug, slug: aW_concept_slug, conceptRole: 'concept', group: 'concept', x:100, y:-100, physics:false },
        { id: aW_schema_slug, label: aW_schema_slug, slug: aW_schema_slug, conceptRole: 'schema', group: 'schema', x:-100, y:-100, physics:false  },
        { id: aW_superset_slug, label: aW_superset_slug, slug: aW_superset_slug, conceptRole: 'superset', group: 'superset', x:0, y:100, physics:false }
    ]

    var nextEdge_obj = {};
    var edges_arr = [];

    nextEdge_obj = {from: aW_JSONSchema_slug, to: aW_wordType_slug, nodeA: aW_JSONSchema_slug, nodeB: aW_wordType_slug, relationshipType: 'isTheJSONSchemaFor' };
    edges_arr = addEdgeWithStyling_mainconcept(edges_arr,nextEdge_obj);
    nextEdge_obj = {from: aW_schema_slug, to: aW_wordType_slug, nodeA: aW_schema_slug, nodeB: aW_wordType_slug, relationshipType: 'isTheSchemaFor' };
    edges_arr = addEdgeWithStyling_mainconcept(edges_arr,nextEdge_obj);
    nextEdge_obj = {from: aW_concept_slug, to: aW_wordType_slug, nodeA: aW_concept_slug, nodeB: aW_wordType_slug, relationshipType: 'isTheConceptFor' };
    edges_arr = addEdgeWithStyling_mainconcept(edges_arr,nextEdge_obj);
    nextEdge_obj = {from: aW_superset_slug, to: aW_wordType_slug, nodeA: aW_superset_slug, nodeB: aW_wordType_slug, relationshipType: 'isTheSupersetFor' };
    edges_arr = addEdgeWithStyling_mainconcept(edges_arr,nextEdge_obj);

    if (activeWord_obj.conceptData.nodes.hasOwnProperty("propertySchema")) {
        aW_propertySchema_slug = activeWord_obj.conceptData.nodes.propertySchema.slug;
        nodes_arr.push({ id: aW_propertySchema_slug, label: aW_propertySchema_slug, slug: aW_propertySchema_slug, conceptRole: 'propertySchema', group: 'schema', x:0, y:100, physics:false })
        nextEdge_obj = {from: aW_propertySchema_slug, to: aW_wordType_slug, nodeA: aW_propertySchema_slug, nodeB: aW_wordType_slug, relationshipType: 'isThePropertySchemaFor' };
        edges_arr = addEdgeWithStyling_mainconcept(edges_arr,nextEdge_obj);
    }
    if (activeWord_obj.conceptData.nodes.hasOwnProperty("properties")) {
        aW_properties_slug = activeWord_obj.conceptData.nodes.properties.slug;
        nodes_arr.push({ id: aW_properties_slug, label: aW_properties_slug, slug: aW_properties_slug, conceptRole: 'propertiesSet', group: 'set', x:100, y:0, physics:false })
        nextEdge_obj = {from: aW_properties_slug, to: aW_wordType_slug, nodeA: aW_properties_slug, nodeB: aW_wordType_slug, relationshipType: 'isTheSetOfPropertiesFor' };
        edges_arr = addEdgeWithStyling_mainconcept(edges_arr,nextEdge_obj);
    }
    if (activeWord_obj.conceptData.nodes.hasOwnProperty("primaryProperty")) {
        aW_primaryProperty_slug = activeWord_obj.conceptData.nodes.primaryProperty.slug;
        nodes_arr.push({ id: aW_primaryProperty_slug, label: aW_primaryProperty_slug, slug: aW_primaryProperty_slug, conceptRole: 'primaryProperty', group: 'property', x:100, y:0, physics:false })
        nextEdge_obj = {from: aW_primaryProperty_slug, to: aW_wordType_slug, nodeA: aW_primaryProperty_slug, nodeB: aW_wordType_slug, relationshipType: 'isThePrimaryPropertyFor' };
        edges_arr = addEdgeWithStyling_mainconcept(edges_arr,nextEdge_obj);
    }

    // sets
    var numSets = sets_arr.length;
    for (var s =0;s<numSets;s++) {
        var nextSet_slug = sets_arr[s];
        var nextNode_obj = { id: nextSet_slug, label: nextSet_slug, slug: nextSet_slug, conceptRole: 'set', group: "set" };
        nodes_arr.push(nextNode_obj);

        if (lookupRawFileBySlug_obj.hasOwnProperty(nextSet_slug)) {
            var nextSet_obj = lookupRawFileBySlug_obj[nextSet_slug];
            var nextSet_subsetOf_arr = nextSet_obj.globalDynamicData.subsetOf;
            var numLinksTo = nextSet_subsetOf_arr.length;
            for (var l=0;l<numLinksTo;l++) {
                var nextLink = nextSet_subsetOf_arr[l];
                nextEdge_obj = {from: nextSet_slug, to: nextLink, nodeA: nextSet_slug, nodeB: nextLink, relationshipType: 'subsetOf' };
                edges_arr = addEdgeWithStyling_mainconcept(edges_arr,nextEdge_obj);
            }
        }
    }

    // specificInstances
    var numSpecificInstances = si_arr.length;
    for (var s =0;s<numSpecificInstances;s++) {
        var nextSi_slug = si_arr[s];
        console.log("makeVisGraphForConcept_mainschema; nextSi_slug: "+nextSi_slug)
        if (lookupRawFileBySlug_obj.hasOwnProperty(nextSi_slug)) {
            var nextSi_obj = lookupRawFileBySlug_obj[nextSi_slug];
            var nextNode_obj = { id: nextSi_slug, label: nextSi_slug, conceptRole: 'specificInstance', title: nextSi_slug, slug: nextSi_slug, group: "highlightedOption" };
            nodes_arr.push(nextNode_obj)

            var nextSi_specificInstanceOf_arr = nextSi_obj.globalDynamicData.specificInstanceOf;
            var numLinksTo = nextSi_specificInstanceOf_arr.length;
            for (var l=0;l<numLinksTo;l++) {
                var nextLink = nextSi_specificInstanceOf_arr[l];
                nextEdge_obj = {from: nextSi_slug, to: nextLink, nodeA: nextSi_slug, nodeB: nextLink, relationshipType: 'isASpecificInstanceOf' };
                edges_arr = addEdgeWithStyling_mainconcept(edges_arr,nextEdge_obj);
            }
        }
    }

    // enumerations
    var numEnumerations = enumerations_arr.length;
    for (var s =0;s<numEnumerations;s++) {
        var nextEnumeration_slug = enumerations_arr[s];
        console.log("makeVisGraphForConcept_mainschema; nextEnumeration_slug: "+nextEnumeration_slug)
        if (lookupRawFileBySlug_obj.hasOwnProperty(nextEnumeration_slug)) {
            var nextEnumeration_obj = lookupRawFileBySlug_obj[nextEnumeration_slug];
            var nextNode_obj = { id: nextEnumeration_slug, label: nextEnumeration_slug, conceptRole: 'enumeration', title: nextEnumeration_slug, slug: nextEnumeration_slug, group: "enumeration" };
            nodes_arr.push(nextNode_obj)
        }

        // nextEdge_obj = {from: nextEnumeration_slug, to: nextLink, nodeA: nextSi_slug, nodeB: nextLink, relationshipType: 'isASpecificInstanceOf' };
        // edges_arr = addEdgeWithStyling_mainconcept(edges_arr,nextEdge_obj);
    }

    nodes = new DataSet(nodes_arr);
    edges = new DataSet(edges_arr);

    // nodesB = new DataSet(nodes_arr);
    // var edgesB = new DataSet(edges_arr);

    data = {
        nodes,
        edges
    };

    ReactDOM.render(<VisNetworkB clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        document.getElementById('network_buildConceptPage')
    )

    VisjsFunctions.reorganizeConcept_mainschema();
}

function addConceptToConceptPanel(aW_concept_slug) {
    console.log("addConceptToConceptPanel; aW_concept_slug: "+aW_concept_slug)
    var aW_obj = lookupRawFileBySlug_obj[aW_concept_slug];

    aW_wordType_slug = aW_obj.conceptData.nodes.wordType.slug;
    aW_superset_slug = aW_obj.conceptData.nodes.superset.slug;
    aW_concept_slug = aW_obj.conceptData.nodes.concept.slug;
    aW_schema_slug = aW_obj.conceptData.nodes.schema.slug;
    aW_JSONSchema_slug = aW_obj.conceptData.nodes.JSONSchema.slug;
    aW_propertySchema_slug = "";
    aW_properties_slug = "";
    aW_primaryProperty_slug = "";
    if (aW_obj.conceptData.nodes.hasOwnProperty("propertySchema")) {
        aW_propertySchema_slug = aW_obj.conceptData.nodes.propertySchema.slug;
    }
    if (aW_obj.conceptData.nodes.hasOwnProperty("properties")) {
        aW_properties_slug = aW_obj.conceptData.nodes.properties.slug;
    }
    if (aW_obj.conceptData.nodes.hasOwnProperty("primaryProperty")) {
        aW_primaryProperty_slug = aW_obj.conceptData.nodes.primaryProperty.slug;
    }
    var enumerations_arr = [];
    if (aW_obj.conceptData.hasOwnProperty("enumerations")) {
        enumerations_arr = aW_obj.conceptData.enumerations;
    }

    var sets_arr = aW_obj.globalDynamicData.sets;
    var si_arr = aW_obj.globalDynamicData.specificInstances;

    var nextConceptHTML = "";
    nextConceptHTML += '<div class="singleConceptContainer" style="background-color:white;" >';
    nextConceptHTML += '<div class="doSomethingButton" data-currentstate="invisible" data-wordtype="'+aW_wordType_slug+'" id="toggleSingleConceptContainerButton_'+aW_wordType_slug+'" >+</div>';
    nextConceptHTML += aW_wordType_slug;

    nextConceptHTML += `
    <fieldset id="singleConceptSubContainer_`+aW_wordType_slug+`" style="display:none" >
        <div>
            <div class="smallFontLeftCol">compactConceptSummary:</div>

        </div>
        <div>
            <div class="smallFontLeftCol">path:</div>

        </div>
        <div>
            <div class="smallFontLeftCol">definition:</div>
        </div>
        <div>
            <div class="smallFontLeftCol">JSONSchema:</div>
            <div class="smallFontSecondCol showSlugRawFileButton" data-version=unedited data-slug=`+aW_JSONSchema_slug+` id=showFile_`+aW_JSONSchema_slug+` >`+aW_JSONSchema_slug+`</div>
        </div>
        <div>
            <div class="smallFontLeftCol">schema:</div>
            <div class="smallFontSecondCol showSlugRawFileButton" data-version=unedited data-slug=`+aW_schema_slug+` id=showFile_`+aW_schema_slug+` >`+aW_schema_slug+`</div>
        </div>
        <div>
            <div class="smallFontLeftCol">propertySchema:</div>
            <div class="smallFontSecondCol showSlugRawFileButton" data-version=unedited data-slug=`+aW_propertySchema_slug+` id=showFile_`+aW_propertySchema_slug+` >`+aW_propertySchema_slug+`</div>
        </div>
        <div>
            <div class="smallFontLeftCol">properties:</div>
            <div class="smallFontSecondCol showSlugRawFileButton" data-version=unedited data-slug=`+aW_properties_slug+` id=showFile_`+aW_properties_slug+` >`+aW_properties_slug+`</div>
        </div>
        <div>
            <div class="smallFontLeftCol">primaryProperty:</div>
            <div class="smallFontSecondCol showSlugRawFileButton" data-version=unedited data-slug=`+aW_primaryProperty_slug+` id=showFile_`+aW_primaryProperty_slug+` >`+aW_primaryProperty_slug+`</div>
        </div>
        <div>
            <div class="smallFontLeftCol">schema, edited:</div>
            <div class="smallFontSecondCol showSlugRawFileButton" data-version=edited data-slug=`+aW_schema_slug+` id=showFile_edited_`+aW_schema_slug+` >`+aW_schema_slug+` EDITED</div>
            <div class="doSomethingButton_small updateEditedSchema" data-slug=`+aW_schema_slug+` id="updateSchema_`+aW_schema_slug+`" >UPDATE</div>
        </div>
        <div>
            <div class="smallFontLeftCol">concept:</div>
            <div class="smallFontSecondCol showSlugRawFileButton" data-version=unedited data-slug=`+aW_concept_slug+` id=showFile_`+aW_concept_slug+` >`+aW_concept_slug+`</div>
        </div>
        <div>
            <div class="smallFontLeftCol">wordType:</div>
            <div class="smallFontSecondCol showSlugRawFileButton" data-version=unedited data-slug=`+aW_wordType_slug+` id=showFile_`+aW_wordType_slug+` >`+aW_wordType_slug+`</div>
        </div>
        <div>
            <div class="smallFontLeftCol">superset:</div>
            <div class="smallFontSecondCol showSlugRawFileButton" data-version=unedited data-slug=`+aW_superset_slug+` id=showFile_`+aW_superset_slug+` >`+aW_superset_slug+`</div>
        </div>
        <div>
            <div class="smallFontLeftCol">sets:</div>`;
            // sets
            var numSets = sets_arr.length;
            nextConceptHTML += `<div class="smallFontSecondCol" >`;
            for (var s =0;s<numSets;s++) {
                var nextSet_slug = sets_arr[s];
                nextConceptHTML += `<div class="showSlugRawFileButton" data-version=unedited data-slug=`+nextSet_slug+` id=showFile_`+nextSet_slug+` >`+nextSet_slug+`</div><br>`;
            }
            nextConceptHTML += `</div>;
        </div>
        <div>
            <div class="smallFontLeftCol">enumerations:</div>`;
            // sets
            var numEnumerations = enumerations_arr.length;
            nextConceptHTML += `<div class="smallFontSecondCol" >`;
            for (var s =0;s<numEnumerations;s++) {
                var nextEnumeration_slug = enumerations_arr[s];
                nextConceptHTML += `<div class="showSlugRawFileButton" data-version=unedited data-slug=`+nextEnumeration_slug+` id=showFile_`+nextEnumeration_slug+` >`+nextEnumeration_slug+`</div><br>`;
            }
            nextConceptHTML += `</div>;
        </div>
        <div>
            <div class="smallFontLeftCol">specificInstances:</div>`;
            // specificInstances
            var numSpecificInstances = si_arr.length;
            nextConceptHTML += `<div class="smallFontSecondCol" >`;
            for (var s =0;s<numSpecificInstances;s++) {
                var nextSi_slug = si_arr[s];
                nextConceptHTML += `<div class="showSlugRawFileButton" data-version=unedited data-slug=`+nextSi_slug+` id=showFile_`+nextSi_slug+` >`+nextSi_slug+`</div><br>`;
            }
            nextConceptHTML += `</div>;
        </div>
    </fieldset>
    <div style="position:absolute;right:10px;top:5px" >
        <div style="display:inline-block;font-size:10px;">show on graph: </div>
        <div id="showPropertySchemaOnGraph_`+aW_propertySchema_slug+`" data-propertyschemaslug="`+aW_propertySchema_slug+`" class="doSomethingButton" >property schema</div>
        <div id="showConceptOnGraph_`+aW_concept_slug+`" data-conceptslug="`+aW_concept_slug+`" class="doSomethingButton" >main schema (skeleton)</div>
    </div>
    `;
    nextConceptHTML += '</div>';
    jQuery("#activeConceptPanel").append(nextConceptHTML);
    jQuery("#updateSchema_"+aW_schema_slug).click(function(){
        var schema_slug = jQuery(this).data("slug");
        // console.log("updateEditedSchema; schema_slug: "+schema_slug)
        var updatedSchema_rF_obj = lookupRawFileBySlug_obj.edited[schema_slug];
        var schema_ipns = updatedSchema_rF_obj.metaData.ipns;
        var updatedSchema_rF_str = JSON.stringify(updatedSchema_rF_obj,null,4);
        var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
        var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
        var sql1 = "";
        sql1 += "UPDATE "+myConceptGraph;
        sql1 += " SET rawFile = '"+updatedSchema_rF_str+"' ";
        sql1 += " WHERE slug = '"+schema_slug+"' ";
        // console.log("sql1: "+sql1)
        var sql2 = "";
        sql2 += "UPDATE "+myDictionary;
        sql2 += " SET rawFile = '"+updatedSchema_rF_str+"' ";
        sql2 += " WHERE ipns = '"+schema_ipns+"' ";
        // console.log("sql2: "+sql2)
        sendAsync(sql1);
        sendAsync(sql2);
    })
    jQuery("#toggleSingleConceptContainerButton_"+aW_wordType_slug).click(function(){
        var thisConceptWordType = jQuery(this).data("wordtype");
        var currentState = jQuery(this).data("currentstate");
        // alert("toggle thisConceptWordType: "+thisConceptWordType+"; currentState: "+currentState)
        if (currentState=="invisible") {
            jQuery(this).data("currentstate","visible");
            jQuery("#singleConceptSubContainer_"+thisConceptWordType).css("display","block")
        } else {
            jQuery(this).data("currentstate","invisible");
            jQuery("#singleConceptSubContainer_"+thisConceptWordType).css("display","none")
        }

    })
    jQuery("#showConceptOnGraph_"+aW_concept_slug).click( function() {
        aW_concept_slug = jQuery(this).data("conceptslug")
        makeVisGraphForConcept_mainschema(aW_concept_slug);
        makeSupersetOrSetContainer(aW_concept_slug);
        jQuery("#editPropertySchemaContainer").html("");
        jQuery("#enumerationSelectorContainer").css("display","none");
        jQuery("#updateDisplayedSchemaContainer").css("display","none");
    });
    jQuery("#showPropertySchemaOnGraph_"+aW_propertySchema_slug).click( function() {
        aW_propertySchema_slug = jQuery(this).data("propertyschemaslug")
        var networkElemID = "network_buildConceptPage";
        jQuery("#supersetOrSetContainer").html("");
        VisjsFunctions.makeVisGraph_propertySchema(aW_propertySchema_slug,networkElemID);
        makeEditPropertySchemaPanel(aW_concept_slug);
        jQuery("#enumerationSelectorContainer").css("display","block");
    });

    var e = document.getElementsByClassName("showSlugRawFileButton");
    for (var i = 0; i < e.length; i++) {
        e[i].addEventListener('click', function (event) {
            var thisWord_slug = this.getAttribute("data-slug");
            var thisWord_version = this.getAttribute("data-version");
            if (thisWord_version=="edited") {
                var thisWord_obj = lookupRawFileBySlug_obj.edited[thisWord_slug];
                console.log("thisWord_version == edited")
            } else {
                var thisWord_obj = lookupRawFileBySlug_obj[thisWord_slug];
                console.log("thisWord_version == unedited")
            }
            var thisWord_str = JSON.stringify(thisWord_obj,null,4);
            console.log("thisWord_str: "+thisWord_str)
            jQuery("#showFilePanel").val(thisWord_str)
            jQuery("#showFilePanel").html(thisWord_str)
        });
    }
}

function GenerateCompactConceptSummarySelector() {
    console.log("GenerateCompactConceptSummarySelectorX")
    jQuery("#activeConceptPanel").html("");
    // alert("GenerateCompactConceptSummarySelectorX")
    var currentConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected ").data("tablename");

    console.log("loadWordsIntoLookup; currentConceptGraph_tableName: "+currentConceptGraph_tableName)

    var sql = "";
    sql += " SELECT * FROM "+currentConceptGraph_tableName;
    // console.log("GenerateCompactConceptSummarySelectorX sql: "+sql)

    sendAsync(sql).then((words_arr) => {
        // options are wordTypes
        var selectorHTML = "";
        selectorHTML += "<select id='compactConceptSummarySelector' >";

        // options are any words (or should be sets or specific instances only? that are not already wordTypes?)
        var selectorHTML2 = "";
        selectorHTML2 += "<select id='convertWordIntoNewWordTypeSelector' >";

        // options are any words (or should be sets only? that are not already supersets?)
        var selectorHTML3 = "";
        selectorHTML3 += "<select id='convertWordIntoNewSupersetSelector' >";

        var selectorHTML4 = "";
        selectorHTML4 += "<select id='existingWordTypeAsSpecificInstanceSelector' >";

        var selectorHTML5 = "";
        selectorHTML5 += "<select id='existingSupersetAsSetSelector' >";

        var selectorHTML6 = "";
        selectorHTML6 += "<select id='showIndividualSchemaSelector' >";

        // conceptSelector1 for adding concept relationships to mainSchemaForConceptGraph schema
        var selectorHTML7 = "";
        selectorHTML7 += "<select id='conceptSelector1' >";

        // conceptSelector2 for adding concept relationships to mainSchemaForConceptGraph schema
        var selectorHTML8 = "";
        selectorHTML8 += "<select id='conceptSelector2' >";

        // standardRelWord1Sel for adding standard relationships to mainSchemaForConceptGraph schema
        var selectorHTML9 = "";
        selectorHTML9 += "<select id='standardRelWord1Sel' >";
        var selectorHTML9_1 = "";
        selectorHTML9_1 += "<select id='standardRelWord1Sel' >";

        // standardRelWord2Sel for adding standard relationships to mainSchemaForConceptGraph schema
        var selectorHTML10 = "";
        selectorHTML10 += "<select id='standardRelWord2Sel' >";

        // propertyFromSelector for adding standard relationships to propertyTreeSchema
        var selectorHTML11 = "";
        selectorHTML11 += "<select id='propertyFromSelector' >";

        // propertyToSelector for adding standard relationships to propertyTreeSchema
        var selectorHTML12 = "";
        selectorHTML12 += "<select id='propertyToSelector' >";

        // select an enumeration so it can be used to modify / input into a property
        var selectorHTML13 = "";
        selectorHTML13 += "<select id='enumerationSelector' >";

        var propertiesListHTML = "";

        var result_str = JSON.stringify(words_arr,null,4);
        // console.log("GenerateCompactConceptSummarySelectorX result: "+result_str)
        var numWords = words_arr.length;
        var ind=0;
        for (var w=0;w<numWords;w++) {
            var nextWord_str = words_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_wordTypes = nextWord_obj.wordData.wordTypes;
            var nextWord_ipns = nextWord_obj.metaData.ipns;

            lookupRawFileBySlug_obj[nextWord_slug] = JSON.parse(JSON.stringify(nextWord_obj));
            lookupRawFileBySlug_obj.edited[nextWord_slug] = JSON.parse(JSON.stringify(nextWord_obj));

            var isWordType_wordType = jQuery.inArray("wordType",nextWord_wordTypes);
            var isWordType_set = jQuery.inArray("set",nextWord_wordTypes);
            var isWordType_concept = jQuery.inArray("concept",nextWord_wordTypes);
            var isWordType_superset = jQuery.inArray("superset",nextWord_wordTypes);
            var isWordType_schema = jQuery.inArray("schema",nextWord_wordTypes);
            var isWordType_JSONSchema = jQuery.inArray("JSONSchema",nextWord_wordTypes);
            var isWordType_property = jQuery.inArray("property",nextWord_wordTypes);
            var isWordType_enumeration = jQuery.inArray("enumeration",nextWord_wordTypes);

            if (isWordType_property > -1 ) {
                var nextWord_title = nextWord_obj.wordData.title;
                var nextWord_propertyData_obj = nextWord_obj.propertyData;
                var nextWord_propertyData_str = JSON.stringify(nextWord_propertyData_obj,null,4)
                var nextWord_propertyType = nextWord_obj.propertyData.type;
                var nextWord_propertyTypes = nextWord_obj.propertyData.types;
                propertiesListHTML += "<div style='border:1px solid grey; padding:2px;margin:1px;' >";
                    propertiesListHTML += nextWord_slug;
                    propertiesListHTML += "<br>";

                    propertiesListHTML += "type: ";
                    propertiesListHTML += "<select id='propertyTypeSelector_"+nextWord_slug+"' >";
                    propertiesListHTML += "<option data-propertytype='' ></option>";


                    jQuery.each(propertyTypes,function(nextPropertyType,obj){
                        // if (nextWord_propertyType==nextPropertyType) {
                        if (jQuery.inArray(nextPropertyType,nextWord_propertyTypes) > -1) {
                            propertiesListHTML += "<option data-propertytype='"+nextPropertyType+"' selected >"+nextPropertyType+"</option>";
                        } else {
                            propertiesListHTML += "<option data-propertytype='"+nextPropertyType+"' >"+nextPropertyType+"</option>";
                        }
                    })
                    /*
                    if (nextWord_propertyType=="hasKey") {
                        propertiesListHTML += "<option data-propertytype='hasKey' selected >hasKey</option>";
                    } else {
                        propertiesListHTML += "<option data-propertytype='hasKey' >hasKey</option>";
                    }

                    if (nextWord_propertyType=="type0") {
                        propertiesListHTML += "<option data-propertytype='type0' selected >type0</option>";
                    } else {
                        propertiesListHTML += "<option data-propertytype='type0' >type0</option>";
                    }

                    if (nextWord_propertyType=="type1") {
                        propertiesListHTML += "<option data-propertytype='type1' selected >type1</option>";
                    } else {
                        propertiesListHTML += "<option data-propertytype='type1' >type1</option>";
                    }

                    if (nextWord_propertyType=="type1i") {
                        propertiesListHTML += "<option data-propertytype='type1i' selected >type1i</option>";
                    } else {
                        propertiesListHTML += "<option data-propertytype='type1i' >type1i</option>";
                    }

                    if (nextWord_propertyType=="type1n") {
                        propertiesListHTML += "<option data-propertytype='type1n' selected >type1n</option>";
                    } else {
                        propertiesListHTML += "<option data-propertytype='type1n' >type1n</option>";
                    }

                    if (nextWord_propertyType=="type1a") {
                        propertiesListHTML += "<option data-propertytype='type1a' selected >type1a</option>";
                    } else {
                        propertiesListHTML += "<option data-propertytype='type1a' >type1a</option>";
                    }

                    if (nextWord_propertyType=="type1b") {
                        propertiesListHTML += "<option data-propertytype='type1b' selected >type1b</option>";
                    } else {
                        propertiesListHTML += "<option data-propertytype='type1b' >type1b</option>";
                    }

                    if (nextWord_propertyType=="type1null") {
                        propertiesListHTML += "<option data-propertytype='type1null' selected >type1null</option>";
                    } else {
                        propertiesListHTML += "<option data-propertytype='type1null' >type1null</option>";
                    }

                    if (nextWord_propertyType=="type2") {
                        propertiesListHTML += "<option data-propertytype='type2' selected >type2</option>";
                    } else {
                        propertiesListHTML += "<option data-propertytype='type2' >type2</option>";
                    }

                    if (nextWord_propertyType=="propertyModule") {
                        propertiesListHTML += "<option data-propertytype='propertyModule' selected >propertyModule</option>";
                    } else {
                        propertiesListHTML += "<option data-propertytype='propertyModule' >propertyModule</option>";
                    }

                    if (nextWord_propertyType=="type3") {
                        propertiesListHTML += "<option data-propertytype='type3' selected >type3</option>";
                    } else {
                        propertiesListHTML += "<option data-propertytype='type3' >type3</option>";
                    }
                    */

                    propertiesListHTML += "</select>";

                    propertiesListHTML += " title: <textarea id='propertyTitle_"+nextWord_slug+"' style='width:150px;height:20px;' >";
                    propertiesListHTML += nextWord_title;
                    propertiesListHTML += "</textarea>";

                    propertiesListHTML += "<div id='updateProperty_"+nextWord_slug+"' data-slug='"+nextWord_slug+"' data-ipns='"+nextWord_ipns+"' class='doSomethingButton_small updatePropertyButton' >";
                    propertiesListHTML += "update";
                    propertiesListHTML += "</div>";

                    propertiesListHTML += "<div id='showPropertyData_"+nextWord_slug+"' data-slug='"+nextWord_slug+"' data-ipns='"+nextWord_ipns+"' data-state='invisible' class='doSomethingButton_small showPropertyData' >";
                    propertiesListHTML += "toggle propertyData";
                    propertiesListHTML += "</div>";

                propertiesListHTML += "</div>";

                propertiesListHTML += "<pre id='propertyDataContainer_"+nextWord_slug+"' style='display:none;font-size:12px;' >";
                propertiesListHTML += nextWord_propertyData_str;
                propertiesListHTML += "</pre>";

                selectorHTML11 += "<option data-ipns='"+nextWord_ipns+"' data-slug='"+nextWord_slug+"' >";
                selectorHTML11 += nextWord_slug;
                selectorHTML11 += " ("+nextWord_title+")";
                selectorHTML11 += "</option>";

                selectorHTML12 += "<option data-ipns='"+nextWord_ipns+"' data-slug='"+nextWord_slug+"' >";
                selectorHTML12 += nextWord_slug;
                selectorHTML12 += " ("+nextWord_title+")";
                selectorHTML12 += "</option>";
            }

            if (isWordType_schema > -1 ) {
                var nextWord_schemaTypes_arr = nextWord_obj.schemaData.metaData.types;
                var schemaType = "simpleSchema";
                if (jQuery.inArray("conceptSchema",nextWord_schemaTypes_arr) > -1) {
                    schemaType = "conceptSchema";
                }
                if (jQuery.inArray("mainSchemaForConceptGraph",nextWord_schemaTypes_arr) > -1) {
                    schemaType = "mainSchemaForConceptGraph";
                    jQuery("#cgMainSchemaSlug").val(nextWord_slug);
                    jQuery("#cgMainSchemaSlug").html(nextWord_slug);
                    jQuery("#cgMainSchemaSlug").data("slug",nextWord_slug);
                }
                if (jQuery.inArray("propertyTreeSchema",nextWord_schemaTypes_arr) > -1) {
                    schemaType = "propertyTreeSchema";
                    jQuery("#propertyTreeSchemaSlug").val(nextWord_slug);
                    jQuery("#propertyTreeSchemaSlug").html(nextWord_slug);
                    jQuery("#propertyTreeSchemaSlug").data("slug",nextWord_slug);
                }
                selectorHTML6 += "<option data-ipns='"+nextWord_ipns+"' data-slug='"+nextWord_slug+"' data-schematype='"+schemaType+"' >";
                selectorHTML6 += nextWord_slug;
                selectorHTML6 += "</option>";
            }

            if (isWordType_concept > -1 ) {
                // var nextWord_rF_obj = lookupRawFileBySlug_obj[nextWord_slug];
                var nextWord_rF_obj = nextWord_obj;
                var nextWord_rF_str = JSON.stringify(nextWord_rF_obj,null,4)
                console.log("nextWord_slug: "+nextWord_slug+"; nextWord_rF_str: "+nextWord_rF_str)
                var nextWord_rF_wordType_slug = nextWord_rF_obj.conceptData.nodes.wordType.slug;
                var nextWord_rF_wordType_ipns = nextWord_rF_obj.conceptData.nodes.wordType.ipns;
                var nextWord_rF_superset_slug = nextWord_rF_obj.conceptData.nodes.superset.slug;
                var nextWord_rF_superset_ipns = nextWord_rF_obj.conceptData.nodes.superset.ipns;
                var nextWord_rF_schema_slug = nextWord_rF_obj.conceptData.nodes.schema.slug;
                var nextWord_rF_schema_ipns = nextWord_rF_obj.conceptData.nodes.schema.ipns;
                var nextWord_rF_JSONSchema_slug = nextWord_rF_obj.conceptData.nodes.JSONSchema.slug;
                var nextWord_rF_JSONSchema_ipns = nextWord_rF_obj.conceptData.nodes.JSONSchema.ipns;
                var nextWord_rF_concept_slug = nextWord_rF_obj.conceptData.nodes.concept.slug;
                var nextWord_rF_concept_ipns = nextWord_rF_obj.conceptData.nodes.concept.ipns;

                selectorHTML += "<option data-ipns='"+nextWord_rF_wordType_ipns+"' data-slug='"+nextWord_rF_wordType_slug+"' data-thisconceptconceptslug='"+nextWord_rF_concept_slug+"' data-thisconceptschemaslug='"+nextWord_rF_schema_slug+"' data-thisconceptjsonschemaslug='"+nextWord_rF_JSONSchema_slug+"' data-thisconceptwordtypeslug='"+nextWord_rF_wordType_slug+"' data-thisconceptsupersetslug='"+nextWord_rF_superset_slug+"' >";
                selectorHTML += "* "+nextWord_rF_wordType_slug + " - " +nextWord_rF_wordType_ipns;
                selectorHTML += "</option>";

                selectorHTML7 += "<option data-indexforselection='"+ind+"' data-ipns='"+nextWord_ipns+"' data-slug='"+nextWord_slug+"' data-thisconceptconceptslug='"+nextWord_rF_concept_slug+"' data-thisconceptschemaslug='"+nextWord_rF_schema_slug+"' data-thisconceptjsonschemaslug='"+nextWord_rF_JSONSchema_slug+"' data-thisconceptwordtypeslug='"+nextWord_rF_wordType_slug+"' data-thisconceptsupersetslug='"+nextWord_rF_superset_slug+"' >";
                selectorHTML7 += nextWord_slug;
                selectorHTML7 += "</option>";

                selectorHTML8 += "<option data-indexforselection='"+ind+"' data-ipns='"+nextWord_ipns+"' data-slug='"+nextWord_slug+"' data-thisconceptconceptslug='"+nextWord_rF_concept_slug+"' data-thisconceptschemaslug='"+nextWord_rF_schema_slug+"' data-thisconceptjsonschemaslug='"+nextWord_rF_JSONSchema_slug+"' data-thisconceptwordtypeslug='"+nextWord_rF_wordType_slug+"' data-thisconceptsupersetslug='"+nextWord_rF_superset_slug+"' >";
                selectorHTML8 += nextWord_slug;
                selectorHTML8 += "</option>";

                selectorHTML9 += "<option data-indexforselection='"+ind+"' data-ipns='"+nextWord_rF_superset_ipns+"' data-slug='"+nextWord_rF_superset_slug+"' data-thisconceptconceptslug='"+nextWord_rF_concept_slug+"' data-thisconceptschemaslug='"+nextWord_rF_schema_slug+"' data-thisconceptjsonschemaslug='"+nextWord_rF_JSONSchema_slug+"' data-thisconceptwordtypeslug='"+nextWord_rF_wordType_slug+"' data-thisconceptsupersetslug='"+nextWord_rF_superset_slug+"' >";
                selectorHTML9 += nextWord_rF_superset_slug;
                selectorHTML9 += "</option>";

                selectorHTML9_1 += "<option data-indexforselection='"+ind+"' data-ipns='"+nextWord_rF_superset_ipns+"' data-slug='"+nextWord_rF_superset_slug+"' data-thisconceptconceptslug='"+nextWord_rF_concept_slug+"' data-thisconceptschemaslug='"+nextWord_rF_schema_slug+"' data-thisconceptjsonschemaslug='"+nextWord_rF_JSONSchema_slug+"' data-thisconceptwordtypeslug='"+nextWord_rF_wordType_slug+"' data-thisconceptsupersetslug='"+nextWord_rF_superset_slug+"' >";
                selectorHTML9_1 += nextWord_rF_superset_slug;
                selectorHTML9_1 += "</option>";

                selectorHTML10 += "<option data-indexforselection='"+ind+"' data-ipns='"+nextWord_rF_superset_ipns+"' data-slug='"+nextWord_rF_superset_slug+"' data-thisconceptconceptslug='"+nextWord_rF_concept_slug+"' data-thisconceptschemaslug='"+nextWord_rF_schema_slug+"' data-thisconceptjsonschemaslug='"+nextWord_rF_JSONSchema_slug+"' data-thisconceptwordtypeslug='"+nextWord_rF_wordType_slug+"' data-thisconceptsupersetslug='"+nextWord_rF_superset_slug+"' >";
                selectorHTML10 += nextWord_rF_superset_slug;
                selectorHTML10 += "</option>";

                if (nextWord_rF_obj.conceptData.hasOwnProperty("metaData")) {
                    // console.log("conceptData.hasOwnProperty")
                    var conceptTypes_arr = nextWord_rF_obj.conceptData.metaData.types;
                    if (jQuery.inArray("conceptForProperty",conceptTypes_arr) > -1) {
                        // console.log("conceptData.hasOwnProperty inArray")
                        // add this concept's superset to selectors for properties
                        selectorHTML11 += "<option data-ipns='"+nextWord_rF_superset_ipns+"' data-slug='"+nextWord_rF_superset_slug+"' >";
                        selectorHTML11 += "superset: ";
                        selectorHTML11 += nextWord_rF_superset_slug;
                        selectorHTML11 += "</option>";

                        selectorHTML12 += "<option data-ipns='"+nextWord_rF_superset_ipns+"' data-slug='"+nextWord_rF_superset_slug+"' >";
                        selectorHTML12 += "superset: ";
                        selectorHTML12 += nextWord_rF_superset_slug;
                        selectorHTML12 += "</option>";

                        // add this concept's sets to selectors for properties
                        var conceptSets_arr = nextWord_rF_obj.globalDynamicData.sets;
                        var numConSets = conceptSets_arr.length;
                        for (var s=0;s<numConSets;s++) {
                            var nextSet_slug = conceptSets_arr[s];
                            if (lookupRawFileBySlug_obj.hasOwnProperty(nextSet_slug)) {
                                var nextSet_rF_obj = lookupRawFileBySlug_obj[nextSet_slug];
                                var nextSet_ipns = nextSet_rF_obj.metaData.ipns;
                                selectorHTML11 += "<option data-ipns='"+nextSet_ipns+"' data-slug='"+nextSet_slug+"' >";
                                selectorHTML11 += "set: ";
                                selectorHTML11 += nextSet_slug;
                                selectorHTML11 += "</option>";

                                selectorHTML12 += "<option data-ipns='"+nextSet_ipns+"' data-slug='"+nextSet_slug+"' >";
                                selectorHTML12 += "set: ";
                                selectorHTML12 += nextSet_slug;
                                selectorHTML12 += "</option>";
                            }
                        }
                    } else {
                        // console.log("conceptData.hasOwnProperty NOT inArray")
                    }
                }

                ind++;
            }

            if (isWordType_wordType > -1 ) {
                // console.log("GenerateCompactConceptSummarySelectorX CONCEPT nextWord_slug: "+nextWord_slug)

                selectorHTML4 += "<option data-ipns='"+nextWord_ipns+"' data-slug='"+nextWord_slug+"' >";
                selectorHTML4 += nextWord_slug;
                selectorHTML4 += "</option>";
            }
            if (isWordType_superset > -1 ) {
                selectorHTML5 += "<option data-ipns='"+nextWord_ipns+"' data-slug='"+nextWord_slug+"' >";
                selectorHTML5 += nextWord_slug;
                selectorHTML5 += "</option>";
            }
            if ( (isWordType_concept == -1 ) && (isWordType_schema == -1 ) && (isWordType_JSONSchema == -1 ) ) {
                if ( (isWordType_wordType == -1 ) && (isWordType_set == -1 ) && (isWordType_superset == -1 ) ) {
                    selectorHTML2 += "<option data-ipns='"+nextWord_ipns+"' data-slug='"+nextWord_slug+"' >";
                    selectorHTML2 += nextWord_slug;
                    selectorHTML2 += "</option>";
                }
                if ( (isWordType_set > -1 ) && (isWordType_superset == -1 )) {
                    selectorHTML3 += "<option data-ipns='"+nextWord_ipns+"' data-slug='"+nextWord_slug+"' >";
                    selectorHTML3 += nextWord_slug;
                    selectorHTML3 += "</option>";
                }
            }
            if (isWordType_enumeration > -1 ) {
                selectorHTML13 += "<option data-ipns='"+nextWord_ipns+"' data-slug='"+nextWord_slug+"' >";
                selectorHTML13 += nextWord_slug;
                selectorHTML13 += "</option>";
            }

            if (isWordType_concept > -1 ) {
                addConceptToConceptPanel(nextWord_slug);
            }
        }
        selectorHTML += "</select>";
        selectorHTML2 += "</select>";
        selectorHTML3 += "</select>";
        selectorHTML4 += "</select>";
        selectorHTML5 += "</select>";
        selectorHTML6 += "</select>";
        selectorHTML7 += "</select>";
        selectorHTML8 += "</select>";
        selectorHTML9 += "</select>";
        selectorHTML9_1 += "</select>";
        selectorHTML10 += "</select>";
        selectorHTML11 += "</select>";
        selectorHTML12 += "</select>";
        selectorHTML13 += "</select>";
        jQuery("#compactConceptSummarySelector").html(selectorHTML);
        jQuery("#convertWordIntoNewWordType").html(selectorHTML2);
        jQuery("#convertWordIntoNewSuperset").html(selectorHTML3);
        jQuery("#existingWordTypeAsSpecificInstance").html(selectorHTML4);
        jQuery("#existingSupersetAsSet").html(selectorHTML5);
        jQuery("#showIndividualSchema").html(selectorHTML6);
        jQuery("#conceptSelector1_container").html(selectorHTML7);
        jQuery("#conceptSelector2_container").html(selectorHTML8);
        jQuery("#standardRelWord1Sel_container").html(selectorHTML9);
        jQuery("#standardRelWord2Sel_container").html(selectorHTML10);
        jQuery("#propertyFromContainer").html(selectorHTML11);
        jQuery("#propertyToContainer").html(selectorHTML12);
        jQuery("#propertiesListContainer").html(propertiesListHTML);

        jQuery("#enumerationSelectorContainer").html(selectorHTML13);

        jQuery(".showPropertyData").click(function(){
            var propSlug = jQuery(this).data("slug");
            var propDataContainerState = jQuery(this).data("state");
            if (propDataContainerState=="invisible") {
                jQuery("#propertyDataContainer_"+propSlug).css("display","block")
                jQuery(this).data("state","visible");
            } else {
                jQuery("#propertyDataContainer_"+propSlug).css("display","none");
                jQuery(this).data("state","invisible");
            }
        });

        jQuery(".updatePropertyButton").click(function(){
            var property_slug = jQuery(this).data("slug");
            var property_title = jQuery("#propertyTitle_"+property_slug).val();
            var property_propertyType = jQuery("#propertyTypeSelector_"+property_slug+" option:selected").data("propertytype");
            console.log("updatePropertyButton; property_slug: "+property_slug+"; property_title: "+property_title)
            var property_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[property_slug]));
            property_obj.wordData.title=property_title;
            property_obj.propertyData.type=property_propertyType;
            if (!property_obj.propertyData.hasOwnProperty("types")) {
                property_obj.propertyData.types = [];
            }
            property_obj.propertyData.types.push(property_propertyType);
            lookupRawFileBySlug_obj.edited[property_slug] = JSON.parse(JSON.stringify(property_obj));
            MiscFunctions.updateWordInAllTables(property_obj);
        })

        jQuery("#conceptSelector1").change(function(){
            var selIndex = jQuery("#conceptSelector1 option:selected").data("indexforselection");
            console.log("conceptSelector1 changed; selIndex: "+selIndex)
            document.getElementById("standardRelWord1Sel").selectedIndex = selIndex;
        });
        jQuery("#standardRelWord1Sel").change(function(){
            var selIndex = jQuery("#standardRelWord1Sel option:selected").data("indexforselection");
            console.log("standardRelWord1Sel changed; selIndex: "+selIndex)
            document.getElementById("conceptSelector1").selectedIndex = selIndex;
        });
        jQuery("#conceptSelector2").change(function(){
            var selIndex = jQuery("#conceptSelector2 option:selected").data("indexforselection");
            console.log("conceptSelector2 changed; selIndex: "+selIndex)
            document.getElementById("standardRelWord2Sel").selectedIndex = selIndex;
        });
        jQuery("#standardRelWord2Sel").change(function(){
            var selIndex = jQuery("#standardRelWord2Sel option:selected").data("indexforselection");
            console.log("standardRelWord2Sel changed; selIndex: "+selIndex)
            document.getElementById("conceptSelector2").selectedIndex = selIndex;
        });

        jQuery("#convertWordIntoNewWordTypeSelector").change(function(){
            var newWordType_slug = jQuery("#convertWordIntoNewWordTypeSelector option:selected").val();
            var newWordType_ipns = jQuery("#convertWordIntoNewWordTypeSelector option:selected").data("ipns");
            console.log("convertWordIntoNewWordTypeSelector changed; newWordType_slug: "+newWordType_slug+"; newWordType_ipns: "+newWordType_ipns)
            clearFieldsCompactConceptSummary()
            jQuery("#newConceptSingular").val(newWordType_slug);
            jQuery("#newConceptSingular").html(newWordType_slug);

            jQuery("#ipns_wordType").val(newWordType_ipns);
            jQuery("#ipns_wordType").html(newWordType_ipns);
        });
        jQuery("#convertWordIntoNewSupersetSelector").change(function(){
            var newSuperset_slug = jQuery("#convertWordIntoNewSupersetSelector option:selected").val();
            var newWordType_ipns = jQuery("#convertWordIntoNewSupersetSelector option:selected").data("ipns");
            console.log("convertWordIntoNewSupersetSelector changed; newSuperset_slug: "+newSuperset_slug+"; newWordType_ipns: "+newWordType_ipns)
            clearFieldsCompactConceptSummary()
            jQuery("#newConceptPlural").val(newSuperset_slug);
            jQuery("#newConceptPlural").html(newSuperset_slug);

            jQuery("#ipns_superset").val(newWordType_ipns);
            jQuery("#ipns_superset").html(newWordType_ipns);
        });
    });
}

export default GenerateCompactConceptSummarySelector;
