
import React, { Component, createRef, useEffect, useRef } from "react";
import IpfsHttpClient from 'ipfs-http-client';
import ReactDOM from 'react-dom';
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import * as VisStyleConstants from './visjs-style';
import * as VisEppjsSharedFunctions from './visjs-functions-eppjs';
import * as EppjsFunctions from '../../views/buildConceptFamily/editPrimaryPropertyJSONSchema';
// import GenerateCompactConceptSummarySelector, { reorganizeConcept, addEdgeWithStyling } from '../../views/GenerateCompactConceptSummarySelector';
import { lookupRawFileBySlug_obj, templatesByWordType_obj, insertOrUpdateWordIntoMyDictionary, insertOrUpdateWordIntoMyConceptGraph } from '../../views/addANewConcept';
import * as MiscFunctions from '../miscFunctions.js';
import propertyTypes from '../../json/propertyTypes';
const jQuery = require("jquery");

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

// An array of nodes
export var nodes = new DataSet([
    { id: 1, label: 'Node 1' },
    { id: 2, label: 'Node 2' },
    { id: 3, label: 'Node 3' },
    { id: 4, label: 'Node 4' },
    { id: 5, label: 'Node 5' }
]);

// An array of edges
export var edges = new DataSet([
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 }
]);

var options = VisStyleConstants.options_vis_c2c;

export var network = {};

var data = {
    nodes,
    edges
};

export function overlaySchema_top_eppjs() {
    var schema_slug = jQuery("#schemaImportSelector_top_eppjs option:selected").data("slug")

    if (schema_slug === undefined) {
        console.log("overlaySchema_top_eppjs; schema_slug is undefined")
    } else {
        console.log("overlaySchema_top_eppjs; schema_slug: "+schema_slug)
        var schema_rF_obj = lookupRawFileBySlug_obj[schema_slug];
        var schema_nodes_arr = schema_rF_obj.schemaData.nodes;
        var schema_rels_arr = schema_rF_obj.schemaData.relationships;
        var numNodes = schema_nodes_arr.length;
        var numRels = schema_rels_arr.length;
        addNodesToGraphFromSchemaImport_top_eppjs(schema_nodes_arr)
        addRelsToGraph_top_eppjs(schema_rels_arr)
        /*
        for (var n=0;n<numNodes;n++) {
            var nextNode_obj = schema_nodes_arr[n];

        }
        for (var r=0;r<numRels;r++) {
            var nextRel_obj = schema_rels_arr[r];

        }
        */
    }
}

// This function returns rels that occur after clonedNode_slug from current schema, then creating a new rel by replacing clonedNode_slug with selectedNode_slug
function rels_afterClonedNode_toAddWhenCloning(schema_slug,selectedNode_slug,clonedNode_slug) {
    var relsToAdd_arr = [];
    var schema_rF_obj = MiscFunctions.cloneObj(lookupRawFileBySlug_obj[schema_slug]);
    var schema_rels_arr = schema_rF_obj.schemaData.relationships;
    var numRelsParent = schema_rels_arr.length;
    for (var r=0;r<numRelsParent;r++) {
        var nextRel_obj = schema_rels_arr[r];
        var nextRelType_slug = nextRel_obj.relationshipType.slug;
        if (nextRel_obj.nodeFrom.slug == selectedNode_slug) {
            if ( (nextRelType_slug=="propagateProperty") || (nextRelType_slug=="addPropertyKey") || (nextRelType_slug=="addPropertyValue") || (nextRelType_slug=="addToConceptGraphProperties") ) {
                nextRel_obj.nodeFrom.slug = clonedNode_slug;
                relsToAdd_arr.push(nextRel_obj);
            }
        }
    }

    return relsToAdd_arr;
}
// This function returns all rels that lead into clonedNode_slug from parental schema, then creating a new rel by replacing clonedNode_slug with selectedNode_slug
function rels_beforeClonedNode_toAddWhenCloning(schema_slug,selectedNode_slug,clonedNode_slug) {
    var relsToAdd_arr = [];
    var schema_rF_obj = MiscFunctions.cloneObj(lookupRawFileBySlug_obj[schema_slug]);
    var schema_rels_arr = schema_rF_obj.schemaData.relationships;
    var numRelsParent = schema_rels_arr.length;
    for (var r=0;r<numRelsParent;r++) {
        var nextRel_obj = schema_rels_arr[r];
        var nextRelType_slug = nextRel_obj.relationshipType.slug;
        if (nextRel_obj.nodeTo.slug == selectedNode_slug) {
            if ( (nextRelType_slug=="propagateProperty") || (nextRelType_slug=="addPropertyKey") || (nextRelType_slug=="addPropertyValue") || (nextRelType_slug=="addToConceptGraphProperties") ) {
                nextRel_obj.nodeTo.slug = clonedNode_slug;
                relsToAdd_arr.push(nextRel_obj);
            }
        }
    }

    return relsToAdd_arr;
}
// Clones a property in the top panel;
// reproduces the relationships that feed into it by
// examnation of the propertySchema of the parentSchema of the original property
// then each of those relationships are added to the current propertySchema
// This process will likely add properties from the parentSchema to the current propertySchema; however,
// cloneDepth
// those properties are MIRRORed rather than CLONED, unless the cloneDepth variable is set
// cloneDepth == 0 or == false: clone only the single property; do not iterate
// cloneDepth == 1:: iterate one level deep, then no more
export const cloneSelectedProperty_top_eppjs = async (cloneDepth) => {
    var selectedNodeID = jQuery("#selectedNode_top_eppjs").html()
    console.log("selectedNodeID: "+selectedNodeID)
    var selectedNode = nodes.get(selectedNodeID);
    var selectedNode_slug = selectedNode.slug;
    console.log("selectedNode_slug: "+selectedNode_slug)
    var selectedNode_rF_obj = lookupRawFileBySlug_obj[selectedNode_slug];
    var selectedNode_wordTypes_arr = selectedNode_rF_obj.wordData.wordTypes;
    // For now, clone only nodes that are properties. Future: if selectedNode is a set, clone each of its specificInstances
    // (call cloneSelectedProperty_top_eppjs on each property specificInstance of the set, passing the variable cloneDepth unchanged)
    if (jQuery.inArray("property",selectedNode_wordTypes_arr) > -1) {
        // Step 1: copy the original, then change ipns, parentConcept, and a few other things
        var newProperty_obj = MiscFunctions.cloneObj(selectedNode_rF_obj);

        var currentTime = Date.now();
        var newKeyname = "dictionaryWord_property_"+currentTime;
        var generatedKey_obj = await ipfs.key.gen(newKeyname, {
            type: 'rsa',
            size: 2048
        })
        var newProperty_ipns = generatedKey_obj["id"];
        var generatedKey_name = generatedKey_obj["name"];
        // console.log("generatedKey_obj id: "+newProperty_ipns+"; name: "+generatedKey_name);
        newProperty_obj.metaData.ipns = newProperty_ipns;

        var newProperty_slug = "property_"+newProperty_ipns.slice(newProperty_ipns.length-6);
        newProperty_obj.wordData.slug = newProperty_slug;
        newProperty_obj.wordData.title = newProperty_slug;
        newProperty_obj.wordData.name = newProperty_slug;
        newProperty_obj.wordData.description = "";

        newProperty_obj.globalDynamicData.specificInstanceOf = [];

        var newParentConcept_slug = jQuery("#conceptSelector_top_eppjs option:selected").data("conceptslug");
        newProperty_obj.propertyData.metaData.parentConcept = newParentConcept_slug;
        newProperty_obj.propertyData.metaData.parentConcepts = [];
        newProperty_obj.propertyData.metaData.parentConcepts.push(newParentConcept_slug);
        lookupRawFileBySlug_obj[newProperty_slug] = newProperty_obj;
        lookupRawFileBySlug_obj.edited[newProperty_slug] = newProperty_obj;

        var newProperty_str = JSON.stringify(newProperty_obj,null,4);

        // console.log("newProperty_str: "+newProperty_str);

        // Step 2: search main schema and propertySchema corresponding to the parentConcept of the original;
        // iterate through relationships and look for relationships where:
        // nodeTo.slug == selectedNode_slug; and relationshipType == one of the property-creation relationshipTypes (also look for subsetOf and isASpecificInstanceOf ???)
        // For those relationships, replace selectedNode_slug with newProperty_slug, then add the rel to the top graph
        // Future: within propertyData, replace parentConcept with parentSchema, which will sometimes be schemaForProperty or sometimes propertySchemaFor[any concept in the concept graph]
        // Once that is done, modify this step to iterate only through the parentSchema, not both schema types

        // var selectedPropertySchema_slug = jQuery("#conceptSelector_top_eppjs option:selected").data("propertyschemaslug");
        // console.log("updateIndividualSchema; selectedPropertySchema_slug: "+selectedPropertySchema_slug);
        // var selectedPropertySchema_rF_obj = MiscFunctions.cloneObj(lookupRawFileBySlug_obj[selectedPropertySchema_slug]);

        var selectedProperty_parentConcepts_arr = selectedNode_rF_obj.propertyData.metaData.parentConcepts;
        var numParentConcepts = selectedProperty_parentConcepts_arr.length;
        for (var p=0;p<numParentConcepts;p++) {
            var nextParentConcept_slug = selectedProperty_parentConcepts_arr[p];
            var nextParentConcept_rF_obj = lookupRawFileBySlug_obj[nextParentConcept_slug];
            var nextParentConcept_mainSchema_slug = nextParentConcept_rF_obj.conceptData.nodes.schema.slug;
            var nextParentConcept_propertySchema_slug = nextParentConcept_rF_obj.conceptData.nodes.propertySchema.slug;
            var relsToAdd_arr = [];

            // fetch and clone rels prior to the cloned node (parental main schema)
            relsToAdd_arr = rels_beforeClonedNode_toAddWhenCloning(nextParentConcept_mainSchema_slug,selectedNode_slug,newProperty_slug);
            var numRelsToAdd = relsToAdd_arr.length;
            // console.log("rels_beforeClonedNode_toAddWhenCloning (main schema); numRelsToAdd: "+numRelsToAdd)
            addRelsToGraph_top_eppjs(relsToAdd_arr);
            // selectedPropertySchema_rF_obj = MiscFunctions.updateSchemaWithNewRels(selectedPropertySchema_rF_obj,relsToAdd_arr,lookupRawFileBySlug_obj)
            // lookupRawFileBySlug_obj[selectedPropertySchema_slug] = selectedPropertySchema_rF_obj

            // fetch and clone rels prior to the cloned node (parental property schema)
            relsToAdd_arr = rels_beforeClonedNode_toAddWhenCloning(nextParentConcept_propertySchema_slug,selectedNode_slug,newProperty_slug);
            var numRelsToAdd = relsToAdd_arr.length;
            // console.log("rels_beforeClonedNode_toAddWhenCloning (propertySchema); numRelsToAdd: "+numRelsToAdd)
            addRelsToGraph_top_eppjs(relsToAdd_arr);
            // selectedPropertySchema_rF_obj = MiscFunctions.updateSchemaWithNewRels(selectedPropertySchema_rF_obj,relsToAdd_arr,lookupRawFileBySlug_obj)
            // lookupRawFileBySlug_obj[selectedPropertySchema_slug] = selectedPropertySchema_rF_obj

            // fetch and clone rels after the cloned node (this schema)
            var selectedPropertySchema_slug = jQuery("#conceptSelector_top_eppjs option:selected").data("propertyschemaslug");
            // var selectedPropertySchema_rF_obj = MiscFunctions.cloneObj(lookupRawFileBySlug_obj[selectedPropertySchema_slug]);
            relsToAdd_arr = rels_afterClonedNode_toAddWhenCloning(selectedPropertySchema_slug,selectedNode_slug,newProperty_slug);
            var numRelsToAdd = relsToAdd_arr.length;
            // console.log("rels_beforeClonedNode_toAddWhenCloning (selectedPropertySchema_slug: "+selectedPropertySchema_slug+"); numRelsToAdd: "+numRelsToAdd)
            addRelsToGraph_top_eppjs(relsToAdd_arr);

        }

    }
}

function addNodesToGraphFromSchemaImport_top_eppjs(nodesToAdd_arr) {
    var numNodesToAdd = nodesToAdd_arr.length;
    for (var n=0;n<numNodesToAdd;n++) {
        var nexNode_obj = nodesToAdd_arr[n];
        var nextNode_slug = nexNode_obj.slug;
        transferNodeFromSchemaImportToUpperPanel_eppjs(nextNode_slug)
    }
}

function addRelsToGraph_top_eppjs(relsToAdd_arr) {
    var numRelsToAdd = relsToAdd_arr.length;
    for (var r=0;r<numRelsToAdd;r++) {
        var nexRel_obj = relsToAdd_arr[r];
        // first add nodes if not already present
        var nodeFrom_slug = nexRel_obj.nodeFrom.slug;
        transferNodeToUpperPanel_eppjs(nodeFrom_slug)
        var nodeTo_slug = nexRel_obj.nodeTo.slug;
        transferNodeToUpperPanel_eppjs(nodeTo_slug)
        // then add edge if not already present
        addEdgeToUpperPanel_eppjs(nexRel_obj)
    }
}

export const addNewProperty_eppjs = async () => {

    var newProperty_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["property"]));

    var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
    var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
    newProperty_obj.globalDynamicData.myDictionaries.push(myDictionary);
    newProperty_obj.globalDynamicData.myConceptGraphs.push(myConceptGraph);

    var currentTime = Date.now();
    var newKeyname = "dictionaryWord_property_"+currentTime;
    var generatedKey_obj = await ipfs.key.gen(newKeyname, {
        type: 'rsa',
        size: 2048
    })
    var newProperty_ipns = generatedKey_obj["id"];
    var generatedKey_name = generatedKey_obj["name"];
    // console.log("generatedKey_obj id: "+newProperty_ipns+"; name: "+generatedKey_name);
    newProperty_obj.metaData.ipns = newProperty_ipns;

    var newProperty_slug = "property_"+newProperty_ipns.slice(newProperty_ipns.length-6);
    newProperty_obj.wordData.slug = newProperty_slug;
    newProperty_obj.wordData.title = newProperty_slug;
    newProperty_obj.wordData.name = newProperty_slug;

    var parentConcept_slug = jQuery("#conceptSelector_top_eppjs option:selected").data("conceptslug");
    newProperty_obj.propertyData.metaData.parentConcept = parentConcept_slug;
    newProperty_obj.propertyData.metaData.parentConcepts.push(parentConcept_slug);
    lookupRawFileBySlug_obj[newProperty_slug] = newProperty_obj;
    lookupRawFileBySlug_obj.edited[newProperty_slug] = newProperty_obj;

    var newProperty_str = JSON.stringify(newProperty_obj,null,4);

    // console.log("newProperty_str: "+newProperty_str);

    var newPropertyHTML = "";
    newPropertyHTML += "<div style='display:inline-block;border:1px solid black;padding:3px;' >";
    newPropertyHTML += "new property: "+newProperty_slug;
    newPropertyHTML += " <div data-slug="+newProperty_slug+" id='saveNewProperty_"+newProperty_slug+"' class=doSomethingButton_small>save in SQL</div>";
    newPropertyHTML += " <div data-slug="+newProperty_slug+" id='addNewPropertyToGraph_"+newProperty_slug+"' class=doSomethingButton_small>add to graph</div>";
    newPropertyHTML += "</div>";
    jQuery("#containerForNewPropertyControlPanels_eppjs").append(newPropertyHTML)
    jQuery("#saveNewProperty_"+newProperty_slug).click(function(){
        var propertyToSave_slug = jQuery(this).data("slug");
        var propertyToSave_rF_obj = lookupRawFileBySlug_obj[propertyToSave_slug];
        // console.log("saveNewProperty_ clicked; propertyToSave_slug: "+propertyToSave_slug);
        MiscFunctions.createOrUpdateWordInAllTables(propertyToSave_rF_obj)
    })
    jQuery("#addNewPropertyToGraph_"+newProperty_slug).click(function(){
        var propertyToAdd_slug = jQuery(this).data("slug");
        // console.log("addNewPropertyToGraph_ clicked; propertyToAdd_slug: "+propertyToAdd_slug);
        var nodeToAdd_obj = {};
        nodeToAdd_obj.id = propertyToAdd_slug;
        nodeToAdd_obj.label = propertyToAdd_slug;
        nodeToAdd_obj.slug = propertyToAdd_slug;
        nodeToAdd_obj.title = propertyToAdd_slug;
        nodeToAdd_obj.group = "property";
        nodeToAdd_obj.physics = false;
        nodes.update(nodeToAdd_obj);
    })
}
export const updateIndividualSchema_eppjs = () => {
    var schema_slug = jQuery("#conceptSelector_top_eppjs option:selected").data("propertyschemaslug");
    // console.log("updateIndividualSchema; schema_slug: "+schema_slug);
    var schema_rF_obj = MiscFunctions.cloneObj(lookupRawFileBySlug_obj[schema_slug]);
    schema_rF_obj.schemaData.nodes = [];
    schema_rF_obj.schemaData.relationships = [];
    var nodeIDs_arr = nodes.getIds();
    var edgeIDs_arr = edges.getIds();
    var numNodeIDs = nodeIDs_arr.length;
    var numEdgeIDs = edgeIDs_arr.length;
    // console.log('numNodeIDs', numNodeIDs);
    // console.log('numEdgeIDs', numEdgeIDs);
    for (var z=0;z<numNodeIDs;z++) {
        var nodeID = nodeIDs_arr[z];
        var node = nodes.get(nodeID);
        var node_slug = node.slug;
        // console.log("z: "+z+"; nodeID: "+nodeID+"; node_slug: "+node_slug);
        var node_rF_obj = MiscFunctions.cloneObj(lookupRawFileBySlug_obj[node_slug]);
        // The createOrUpdateWordInAllTables function is called to save any nodes that may have been created during this session,
        // e.g. by cloning nodes
        MiscFunctions.createOrUpdateWordInAllTables(node_rF_obj);
        var node_ipns = node_rF_obj.metaData.ipns;
        var nodeToReinsert_obj = {};
        nodeToReinsert_obj.slug = node_slug;
        nodeToReinsert_obj.ipns = node_ipns;
        schema_rF_obj.schemaData.nodes.push(nodeToReinsert_obj);
    }
    for (var z=0;z<numEdgeIDs;z++) {
        var edgeID = edgeIDs_arr[z];
        var edge = edges.get(edgeID);
        var nodeFrom_slug = edge.nodeA;
        var nodeTo_slug = edge.nodeB;
        var relTypeDataStringified = edge.relationshipTypeStringified;
        var relTypeData_obj = JSON.parse(relTypeDataStringified);
        var relationshipType_slug = edge.relationshipType;
        var relationshipTypeData = relationshipType_slug+"Data";
        // console.log("z: "+z+"; edgeID: "+edgeID+"; nodeFrom_slug: "+nodeFrom_slug);
        var relToReinsert_obj = MiscFunctions.blankRel_obj();
        relToReinsert_obj.nodeFrom.slug = nodeFrom_slug;
        relToReinsert_obj.relationshipType.slug = relationshipType_slug;
        relToReinsert_obj.nodeTo.slug = nodeTo_slug;
        if (relationshipTypeData != "isASpecificInstanceOfData") { // remove erroneously placed isASpecificInstanceOfData property
            if (relTypeData_obj.hasOwnProperty(relationshipTypeData)) {
                relToReinsert_obj.relationshipType[relationshipTypeData] = relTypeData_obj[relationshipTypeData];
            }
        }
        var relToReinsert_str = JSON.stringify(relToReinsert_obj,null,4);
        // console.log("relToReinsert_str: "+relToReinsert_str);
        schema_rF_obj.schemaData.relationships.push(relToReinsert_obj);
    }
    var schema_rF_str = JSON.stringify(schema_rF_obj,null,4);
    // console.log("updateIndividualSchema; schema_rF_str: "+schema_rF_str);
    MiscFunctions.updateWordInAllTables(schema_rF_obj)
}

export function changeRelationship_eppjs() {
    var edgeToUpdate_obj = {};
    var edgeID = jQuery("#selectedEdge_top_eppjs").html()

    var edge = edges.get(edgeID);
    var nodeFrom_slug = edge.from;
    var nodeTo_slug = edge.to;

    var relType = jQuery("#changeRelationshipSelector_eppjs option:selected").data("slug");
    var field = jQuery("#fieldForNewRelationship").val();
    edgeToUpdate_obj.id=edgeID;
    edgeToUpdate_obj.relationshipType = relType;
    edgeToUpdate_obj.title = relType;
    edgeToUpdate_obj.label = relType;
    if (field) {
        edgeToUpdate_obj.title += "\n FIELD: "+field;
    }
    edgeToUpdate_obj.color = VisStyleConstants.edgeOptions_obj[relType].color;
    edgeToUpdate_obj.width = VisStyleConstants.edgeOptions_obj[relType].width;
    edgeToUpdate_obj.dashes = VisStyleConstants.edgeOptions_obj[relType].dashes;
    var edgeToUpdate_polarity = VisStyleConstants.edgeOptions_obj[relType].polarity;
    edgeToUpdate_obj.from = nodeFrom_slug;
    edgeToUpdate_obj.to = nodeTo_slug;
    edgeToUpdate_obj.nodeA = nodeFrom_slug;
    edgeToUpdate_obj.nodeB = nodeTo_slug;
    if (edgeToUpdate_polarity=="reverse") {
        // console.log("polarity: reverse")
        edgeToUpdate_obj.nodeA = nodeTo_slug;
        edgeToUpdate_obj.nodeB = nodeFrom_slug;
    }

    var relTypeDataStringified_obj = {}
    relTypeDataStringified_obj.slug = relType;
    if ( (relType=="addPropertyKey") || (relType=="addPropertyValue") || (relType=="addToConceptGraphProperties" )) {
        var relTypeData = relType + "Data";
        relTypeDataStringified_obj[relTypeData] = {};
        relTypeDataStringified_obj[relTypeData].field = field;
    }
    var relTypeDataStringified_str = JSON.stringify(relTypeDataStringified_obj)

    edgeToUpdate_obj.relationshipTypeStringified = relTypeDataStringified_str;
    // edgeToUpdate_obj.propertyField

    edges.update(edgeToUpdate_obj);

    // var nextRel_vis_obj = { from: nextRel_nF_slug, to: nextRel_nT_slug, nodeA: nextRel_nF_slug, nodeB: nextRel_nT_slug, relationshipType: nextRel_rT_slug, relationshipTypeStringified: relationshipTypeStringified }
}

export function addEdgeToUpperPanel_eppjs(relToAdd_obj) {
    var relAlreadyAdded = false;
    var nodeFrom_slug = relToAdd_obj.nodeFrom.slug;
    var nodeTo_slug = relToAdd_obj.nodeTo.slug;
    var relType_slug = relToAdd_obj.relationshipType.slug;
    // first make sure the edge has not already been added
    var edgeIDs_arr = edges.getIds();
    var numEdges = edgeIDs_arr.length;
    for (var e=0;e<numEdges;e++) {
        var nextEdgeID = edgeIDs_arr[e];
        var edge = edges.get(nextEdgeID);
        var nextEdge_nodeFrom_slug = edge.nodeA;
        var nextEdge_nodeTo_slug = edge.nodeB;
        var nextEdge_relTypeDataStringified = edge.relationshipTypeStringified;
        var nextEdge_relTypeData_obj = JSON.parse(nextEdge_relTypeDataStringified);
        var nextEdge_relationshipType_slug = edge.relationshipType;
        if ( (nodeFrom_slug==nextEdge_nodeFrom_slug)
            && (nodeTo_slug==nextEdge_nodeTo_slug)
            && (relType_slug==nextEdge_relationshipType_slug)
          ) {
              relAlreadyAdded = true;
          }
    }
    if (!relAlreadyAdded) {
        var edgeToAdd_obj = {};
        edgeToAdd_obj.from = nodeFrom_slug;
        edgeToAdd_obj.to = nodeTo_slug;
        edgeToAdd_obj.nodeA = nodeFrom_slug;
        edgeToAdd_obj.nodeB = nodeTo_slug;
        if ( (relType_slug=="subsetOf") || (relType_slug=="isASpecificInstanceOf") ) {
            edgeToAdd_obj.nodeB = nodeFrom_slug;
            edgeToAdd_obj.nodeA = nodeTo_slug;
        }
        edgeToAdd_obj.relationshipType = relType_slug;
        var relationshipTypeStringified = JSON.stringify(relToAdd_obj)
        edgeToAdd_obj.relationshipTypeStringified = relationshipTypeStringified;
        edgeToAdd_obj.title = relType_slug;
        edgeToAdd_obj.label = relType_slug;
        var relTypeData = relType_slug+"Data";
        if (relToAdd_obj.relationshipType.hasOwnProperty(relTypeData)) {
            if (relToAdd_obj.relationshipType[relTypeData].hasOwnProperty("field")) {
                var field = relToAdd_obj.relationshipType[relTypeData].field;
                edgeToAdd_obj.title += "\n FIELD: "+field;
            }
        }
        edgeToAdd_obj.color = VisStyleConstants.edgeOptions_obj[relType_slug].color;
        edgeToAdd_obj.width = VisStyleConstants.edgeOptions_obj[relType_slug].width;
        edgeToAdd_obj.dashes = VisStyleConstants.edgeOptions_obj[relType_slug].dashes;

        edges.update(edgeToAdd_obj);
    }
}

export function transferNodeFromSchemaImportToUpperPanel_eppjs(node_slug) {
    // first make sure the node has not already been added
    var nodeIDs_arr = nodes.getIds();
    if (jQuery.inArray(node_slug,nodeIDs_arr) == -1) {
        var nodeToAdd_obj = {};
        var nexNode_rF_obj = lookupRawFileBySlug_obj[node_slug];
        var nodeToAdd_wordType = nexNode_rF_obj.wordData.wordType;
        nodeToAdd_obj.id = node_slug;
        nodeToAdd_obj.label = node_slug;
        nodeToAdd_obj.slug = node_slug;
        nodeToAdd_obj.title = node_slug;
        nodeToAdd_obj.group = nodeToAdd_wordType;
        nodeToAdd_obj.physics = false;
        nodes.update(nodeToAdd_obj);
    }
}

export function transferNodeToUpperPanel_eppjs(node_slug) {
    // first make sure the node has not already been added
    var nodeIDs_arr = nodes.getIds();
    if (jQuery.inArray(node_slug,nodeIDs_arr) == -1) {
        var nodeToAdd_obj = {};
        nodeToAdd_obj.id = node_slug;
        nodeToAdd_obj.label = node_slug;
        nodeToAdd_obj.slug = node_slug;
        nodeToAdd_obj.title = node_slug;
        nodeToAdd_obj.group = "property";
        nodeToAdd_obj.physics = false;
        nodes.update(nodeToAdd_obj);
    }
}

export const VisNetworkCustom = () => {

    // A reference to the div rendered by this component
    var domNode = useRef(null);

    // A reference to the vis network instance
    network = useRef(null);

    useEffect(
        () => {
          network.current = new Network(domNode.current, data, options);
          network.current.fit();

          // NODES
          network.current.on("click",function(params){
              // console.log("network current on click")
              // network.current.fit();
              var nodes_arr = params.nodes;
              var numNodes = nodes_arr.length;
              if (numNodes==1) {
                  var nodeID = nodes_arr[0];
                  var nodeInfo = nodes.get(nodeID);
                  var node_slug = nodeInfo.slug;
                  // console.log("clicked node; node_slug: "+node_slug)
                  var node_rF_obj = lookupRawFileBySlug_obj.edited[node_slug];
                  if (node_rF_obj.hasOwnProperty("propertyData")) {
                      // console.log("clicked a property node ")
                      EppjsFunctions.generateFormFromProperty_eppjs(node_slug)
                  }
                  var node_rF_str = JSON.stringify(node_rF_obj,null,4);
                  var nodeHTML = node_rF_str;
              }
          });
          network.current.on("hoverNode",function(params){
          });
          network.current.on("blurNode",function(params){
          });
          network.current.on("clickNode",function(params){
          });

          network.current.on("selectNode",function(params){
              // console.log("selectNode event triggered")
              var nodes_arr = params.nodes;
              var numNodes = nodes_arr.length;
              if (numNodes==1) {
                  var nodeID = nodes_arr[0];
                  var node = nodes.get(nodeID);
                  var node_slug = node.slug;

                  // console.log("selected node; nodeID: "+nodeID+"; node_slug: "+node_slug)

                  jQuery("#selectedNode_top_eppjs").html(nodeID)
              }
          });
          network.current.on("deselectNode",function(params){
              jQuery("#selectedNode_top_eppjs").html("none")
              // console.log("deselectNode event triggered")
          });

          // EDGES
          network.current.on("selectEdge",function(params){
              // console.log("selectEdge event triggered")
              var edges_arr = params.edges;
              var numEdges = edges_arr.length;
              if (numEdges==1) {
                  var edgeID = edges_arr[0];
                  var edge = edges.get(edgeID);
                  var nodeFrom_slug = edge.from;
                  var nodeTo_slug = edge.to;
                  var relTypeDataStringified_str = edge.relationshipTypeStringified;

                  var relTypeDataStringified_str = "{}";
                  if (edge.hasOwnProperty("relationshipTypeStringified")) {
                      relTypeDataStringified_str = edge.relationshipTypeStringified;
                  }
                  var relTypeDataStringified_obj = JSON.parse(relTypeDataStringified_str);

                  var relationshipType_slug = "";
                  if (edge.hasOwnProperty("relationshipType")) {
                      relationshipType_slug = edge.relationshipType;
                  }

                  // console.log("selected edge; edgeID: "+edgeID+"; nodeFrom_slug: "+nodeFrom_slug+"; nodeTo_slug: "+nodeTo_slug+"; relationshipType_slug: "+relationshipType_slug+"; relTypeDataStringified_str: "+relTypeDataStringified_str)

                  // jQuery("#changeRelationshipSelector_eppjs option[value='"+relationshipType_slug+"' ]").attr("selected","selected");
                  jQuery("#changeRelationshipSelector_eppjs").val(relationshipType_slug);
                  var relationshipTypeData = relationshipType_slug + "Data";

                  if (relTypeDataStringified_obj.hasOwnProperty(relationshipTypeData)) {
                      var edge_field = relTypeDataStringified_obj[relationshipTypeData].field;
                      jQuery("#fieldForNewRelationship").val(edge_field);
                  }

                  jQuery("#selectedEdge_top_eppjs").html(edgeID)
              }
          });
          network.current.on("deselectEdge",function(params){
              jQuery("#selectedEdge_top_eppjs").html("none")
              // console.log("deselectEdge event triggered")
          });
        },
        [domNode, network, data, options]
    );

    return (
        <div style={{height:"100%"}} ref = { domNode } />
    );
};

// make graph from schema of type: propertySchema
// refactor of makeVisGraph_propertySchema
export function makeVisGraph_propertySchema_top_eppjs(schemaSlug,networkElemID) {

    var nodesAndEdges_obj = VisEppjsSharedFunctions.createGraphNodesAndEdgesArraysFromSchemaSlug(schemaSlug)

    var nodes_arr = nodesAndEdges_obj.nodes_arr;
    var edges_arr = nodesAndEdges_obj.edges_arr;

    nodes = new DataSet(nodes_arr);
    edges = new DataSet(edges_arr);
    data = {
        nodes,
        edges
    };
    var numNodes = nodes_arr.length;
    var numEdges = edges_arr.length;
    ReactDOM.render(<VisNetworkCustom clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        document.getElementById(networkElemID)
    )
}
