
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

export const VisNetworkS = () => {

    // A reference to the div rendered by this component
    var domNode = useRef(null);

    // A reference to the vis network instance
    network = useRef(null);

    useEffect(
      () => {
        network.current = new Network(domNode.current, data, options);
        network.current.fit();

        network.current.on("click",function(params){
            var nodes_arr = params.nodes;
            var numNodes = nodes_arr.length;
        });

        // EDGES
        network.current.on("selectEdge",function(params){
            // console.log("selectEdge event triggered")
            var edges_arr = params.edges;
            var numEdges = edges_arr.length;
            if (numEdges==1) {
                var edgeID = edges_arr[0];
                jQuery("#selectedEdge_bepm").html(edgeID)
            }
        });
        network.current.on("deselectEdge",function(params){
            jQuery("#selectedEdge_bepm").html("none")
        });

        // NODES
        network.current.on("selectNode",function(params){
            // console.log("selectNode event triggered")
            var nodes_arr = params.nodes;
            var numNodes = nodes_arr.length;
            if (numNodes==1) {
                var nodeID = nodes_arr[0];
                jQuery("#selectedNode_bepm").html(nodeID)
            }
        });
        network.current.on("deselectNode",function(params){
            jQuery("#selectedNode_bepm").html("none")
        });
      },
      [domNode, network, data, options]
    );

    return (
      <div style={{height:"100%"}} ref = { domNode } />
    );
};

export function addEdgeWithStyling_visjsfunctions(edges_arr,nextEdge_obj) {

    var nextEdge_out_obj = MiscFunctions.cloneObj(nextEdge_obj);
    var relType = nextEdge_out_obj.relationshipType;
    var relationshipStringified = nextEdge_out_obj.relationshipStringified;
    var rel_obj = JSON.parse(relationshipStringified);
    var relationshipTypeData = relType+"Data";
    var rT_propertyField = "";
    if (rel_obj.relationshipType.hasOwnProperty(relationshipTypeData)) {
        rT_propertyField = rel_obj.relationshipType[relationshipTypeData].field;
    }

    nextEdge_out_obj.title = relType;
    // console.log("addEdgeWithStyling_visjsfunctions; relType: "+relType)


    nextEdge_out_obj.label = relType;
    if (rT_propertyField) {
        nextEdge_out_obj.title += ", FIELD: "+rT_propertyField;
    }
    var nextEdge_color = VisStyleConstants.edgeOptions_obj[relType].color;
    nextEdge_out_obj.color = nextEdge_color;

    var nextEdge_width = VisStyleConstants.edgeOptions_obj[relType].width;
    nextEdge_out_obj.width = nextEdge_width;
    var nextEdge_dashes = VisStyleConstants.edgeOptions_obj[relType].dashes;
    nextEdge_out_obj.dashes = nextEdge_dashes;
    var nextEdge_polarity = VisStyleConstants.edgeOptions_obj[relType].polarity;
    if (nextEdge_polarity=="reverse") {
        // console.log("polarity: reverse")
        nextEdge_out_obj.from = nextEdge_obj.nodeB;
        nextEdge_out_obj.to = nextEdge_obj.nodeA;
    }

    edges_arr.push(nextEdge_out_obj)
    return edges_arr;
}

export function addEnumerationToGraph() {
    var enumerationSlug = jQuery("#enumerationSelector_createPropertyModule option:selected").data("enumerationslug")
    var nodeToAdd_obj = {};
    nodeToAdd_obj.id = enumerationSlug;
    nodeToAdd_obj.label = enumerationSlug;
    nodeToAdd_obj.slug = enumerationSlug;
    nodeToAdd_obj.title = enumerationSlug;
    nodeToAdd_obj.group = "enumeration";
    nodeToAdd_obj.physics = false;
    nodes.update(nodeToAdd_obj);
}
export function changeNode_bepm(word_slug) {
    var nodeID = jQuery("#selectedNode_bepm").html()
    var word_rF_obj = lookupRawFileBySlug_obj[word_slug];
    var wordType = word_rF_obj.wordData.wordType;
    var nodeToUpdate_obj = {};
    nodeToUpdate_obj.id = nodeID;
    nodeToUpdate_obj.slug = word_slug;
    nodeToUpdate_obj.title = word_slug;
    nodeToUpdate_obj.label = word_slug;
    nodeToUpdate_obj.group = wordType;
    nodes.update(nodeToUpdate_obj);
}

export function changeEdge_bepm(relType) {
    var edgeToUpdate_obj = {};
    var edgeID = jQuery("#selectedEdge_bepm").html()

    var edge = edges.get(edgeID);
    // var relType = "inducesOrganizationOf";
    var field = jQuery("#fieldForInducesPartitioningOf").val();

    var relationshipTypeData = relType+"Data";

    edgeToUpdate_obj.id=edgeID;
    edgeToUpdate_obj.relationshipType = relType;
    edgeToUpdate_obj.propertyField = field;

    var nodeFromID = edge.from;
    var nodeToID = edge.to;
    var nodeFrom = nodes.get(nodeFromID);
    var nodeTo = nodes.get(nodeToID);

    edgeToUpdate_obj.nodeA = nodeFrom.slug;
    edgeToUpdate_obj.nodeB = nodeTo.slug;

    var relationshipStringified_obj = MiscFunctions.blankRel_obj();
    relationshipStringified_obj.nodeFrom.slug = nodeFrom.slug;
    relationshipStringified_obj.nodeTo.slug = nodeTo.slug;
    relationshipStringified_obj.relationshipType.slug = relType;
    if (field) {
        relationshipStringified_obj.relationshipType[relationshipTypeData]= {}
        relationshipStringified_obj.relationshipType[relationshipTypeData].field = field;
    }

    if ( (relType=="subsetOf") || (relType=="isASpecificInstanceOf") ) {
        edgeToUpdate_obj.nodeB = nodeFrom.slug;
        edgeToUpdate_obj.nodeA = nodeTo.slug;
        relationshipStringified_obj.nodeTo.slug = nodeFrom.slug;
        relationshipStringified_obj.nodeFrom.slug = nodeTo.slug;
    }

    var relationshipStringified = JSON.stringify(relationshipStringified_obj);
    edgeToUpdate_obj.relationshipStringified = relationshipStringified;

    edgeToUpdate_obj.title = relType;
    edgeToUpdate_obj.label = relType;
    if (field) {
        edgeToUpdate_obj.title += ", FIELD: "+field;
    }

    edgeToUpdate_obj.color = VisStyleConstants.edgeOptions_obj[relType].color;
    edgeToUpdate_obj.width = VisStyleConstants.edgeOptions_obj[relType].width;
    edgeToUpdate_obj.dashes = VisStyleConstants.edgeOptions_obj[relType].dashes;
    var edgeToUpdate_polarity = VisStyleConstants.edgeOptions_obj[relType].polarity;

    edges.update(edgeToUpdate_obj);

    // var nextRel_vis_obj = { from: nextRel_nF_slug, to: nextRel_nT_slug, nodeA: nextRel_nF_slug, nodeB: nextRel_nT_slug, relationshipType: nextRel_rT_slug, relationshipStringified: relationshipStringified }
}

export function reorganizeSchemaS() {
    // console.log("reorganizeSchema A")
    var edgeIDs_arr = edges.getIds();
    // console.log('edgeIDs_arr', edgeIDs_arr);
    var numEdgeIDs = edgeIDs_arr.length;
    var nodeIDs_arr = nodes.getIds();
    // console.log('edgeIDs_arr', edgeIDs_arr);
    var numNodeIDs = nodeIDs_arr.length;
    var enumNum = 0;
    for (var z=0;z<numNodeIDs;z++) {
        var nodeID = nodeIDs_arr[z];
        var node = nodes.get(nodeID);
        // console.log("z: "+z+"; nodeID: "+nodeID);
        var node_conceptRole = node.conceptRole;
        if (node_conceptRole=="wordType") {
            nodes.update({id:nodeID,x:0,y:0,physics:false });
        }
        if (node_conceptRole=="JSONSchema") {
            nodes.update({id:nodeID,x:-175,y:0,physics:false });
        }
        if (node_conceptRole=="concept") {
            nodes.update({id:nodeID,x:0,y:-150,physics:false });
        }
        if (node_conceptRole=="schema") {
            nodes.update({id:nodeID,x:125,y:-150,physics:false });
        }
        if (node_conceptRole=="superset") {
            nodes.update({id:nodeID,x:0,y:175,physics:false });
        }
        if (node_conceptRole=="propertySchema") {
            nodes.update({id:nodeID,x:-175,y:-150,physics:false });
        }
        if (node_conceptRole=="enumeration") {
            nodes.update({id:nodeID,x:350,y:-150 + enumNum * 100,physics:false });
            enumNum++;
        }
        // console.log("node_conceptRole: "+node_conceptRole)
        nodes.update({id:nodeID, numDirectDescendants: 0 });
    }
    for (var z=0;z<numEdgeIDs;z++) {
        var edgeID = edgeIDs_arr[z];
        var edge = edges.get(edgeID);
        var nodeFromID = edge.nodeA;
        var nodeToID = edge.nodeB;
        var relType = edge.relationshipType;
        var nodeFrom = nodes.get(nodeFromID);
        var nodeTo = nodes.get(nodeToID);
        if ( (relType=="subsetOf") || (relType=="isASpecificInstanceOf") ) {
            var nodeTo = nodes.get(nodeToID);
            var nodeDD = nodeTo.numDirectDescendants;
            nodeDD++;
            nodes.update({id:nodeToID, numDirectDescendants: nodeDD });
            nodes.update({id:nodeFromID, dirDescendantNumber: nodeDD });
        }
        if (relType=="enumerates") {
            nodes.update({id:nodeToID,x:-350});
        }
        if (relType=="enumeratesSingleValue") {
            nodes.update({id:nodeToID,x:-350});
        }
    }
    for (var i=0;i<10;i++) {
        for (var z=0;z<numEdgeIDs;z++) {
            var edgeID = edgeIDs_arr[z];
            var edge = edges.get(edgeID);
            var nodeFromID = edge.nodeA;
            var nodeToID = edge.nodeB;
            var relType = edge.relationshipType;
            var nodeTo = nodes.get(nodeToID);
            var nodeFrom = nodes.get(nodeFromID);
            if ( (relType=="subsetOf") || (relType=="isASpecificInstanceOf") ) {
                var nDD = nodeTo.numDirectDescendants;
                var ddN = nodeFrom.dirDescendantNumber;
                var nT_x = nodeTo.x;
                var nT_y = nodeTo.y;
                var nF_x = nT_x + 150 * ddN - 150*(nDD-0.5);
                var nF_y = nT_y + 150;
                nodes.update({id:nodeFromID,x:nF_x,y:nF_y,physics:false });
            }
            if ( relType=="isThePrimaryPropertyFor" ) {
                var x_new = nodeTo.x - 175;
                var y_new = nodeTo.y + 125;
                nodes.update({id:nodeFromID,x:x_new,y:y_new,physics:false });
                // console.log("reorganizeSchema isThePropertySchemaFor; x_new: "+x_new+"; y_new: "+y_new)
            }
            if ( relType=="isTheSetOfPropertiesFor" ) {
                var x_new = nodeTo.x + 175;
                var y_new = nodeTo.y;
                nodes.update({id:nodeFromID,x:x_new,y:y_new,physics:false });
                // console.log("reorganizeSchema isThePropertySchemaFor; x_new: "+x_new+"; y_new: "+y_new)
            }
            /*
            if ( relType=="enumerates" ) {
                var x_new = nodeFrom.x - 200;
                var y_new = nodeFrom.y + 50;
                nodes.update({id:nodeToID,x:x_new,y:y_new,physics:false });
                // console.log("reorganizeSchema enumerates")
            }
            */
        }
    }
    // network.fit();
}

export function updateSchema_bepm() {
      var schema_slug = jQuery("#depictedSchema_bepm").html()
      // console.log("updateSchema_bepm; schema_slug: "+schema_slug);
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
          // MiscFunctions.createOrUpdateWordInAllTables(node_rF_obj);
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
          var relTypeDataStringified = "{}";
          if (edge.hasOwnProperty("relationshipStringified")) {
              var relTypeDataStringified = edge.relationshipStringified;
          }
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
          if (edge.hasOwnProperty("relationshipStringified")) {
              var relTypeDataStringified = edge.relationshipStringified;
              relToReinsert_obj = JSON.parse(relTypeDataStringified);
          }
          var relToReinsert_str = JSON.stringify(relToReinsert_obj,null,4);
          // console.log("relToReinsert_str: "+relToReinsert_str);
          schema_rF_obj.schemaData.relationships.push(relToReinsert_obj);
      }
      var schema_rF_str = JSON.stringify(schema_rF_obj,null,4);
      // console.log("updateSchema_bepm; schema_rF_str: "+schema_rF_str);
      MiscFunctions.updateWordInAllTables(schema_rF_obj)
  }

// make graph from schema of type: plain schema or conceptSchema
// copied from addANewConcept.js
export function makeVisGraphS(schemaSlug,networkElemID) {
    jQuery("#depictedSchema_bepm").html(schemaSlug)
    var schema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[schemaSlug]));
    var schema_nodes_obj = schema_rF_obj.schemaData.nodes;
    var schema_rels_obj = schema_rF_obj.schemaData.relationships;
    var numNodes = schema_nodes_obj.length;
    var numRels = schema_rels_obj.length;
    // console.log("makeVisGraphS; schemaSlug: "+schemaSlug+"; numNodes: "+numNodes+"; numRels: "+numRels);

    var nextNode_obj = {};
    var nextEdge_obj = {};
    var nodes_arr = [];
    var edges_arr = [];
    // { id: aW_wordType_slug, label: aW_wordType_slug, conceptRole: 'wordType', group: 'wordType', x:0, y:0, physics:false },
    // nextEdge_obj = {from: aW_JSONSchema_slug, to: aW_wordType_slug, nodeA: aW_JSONSchema_slug, nodeB: aW_wordType_slug, relationshipType: 'isTheJSONSchemaFor' };

    for (var n=0;n<numNodes;n++) {
        var nextNode_obj = schema_nodes_obj[n];
        var nextNode_slug = nextNode_obj.slug;
        var nextNode_rF_obj = lookupRawFileBySlug_obj[nextNode_slug];
        var nextNode_wordType = nextNode_rF_obj.wordData.wordType;
        var nextNode_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;
        var nextNode_x = 0;
        var nextNode_y = 0;
        var nextNode_conceptRole = nextNode_wordType;
        if (nextNode_wordType=="schema") {
            if (jQuery.inArray("propertySchema",nextNode_rF_obj.schemaData.metaData.types) > -1 ) {
                nextNode_conceptRole = "propertySchema";
            }
        }

        if (nextNode_wordType=="schema") {
            nextNode_x = -100;
            nextNode_y = -100;
        }
        if (nextNode_wordType=="JSONSchema") {
            nextNode_x = -100;
            nextNode_y = 0;
        }
        if (nextNode_wordType=="wordType") {
            nextNode_x = 0;
            nextNode_y = 0;
        }
        if (nextNode_wordType=="superset") {
            nextNode_x = 0;
            nextNode_y = 100;
        }
        if (nextNode_wordType=="concept") {
            nextNode_x = 100;
            nextNode_y = -100;
        }
        var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_slug, slug: nextNode_slug, title: nextNode_slug, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: false, x: nextNode_x, y: nextNode_y }
        nodes_arr.push(nextNode_vis_obj)
    }

    for (var n=0;n<numRels;n++) {
        var nextRel_obj = schema_rels_obj[n];
        var nextRel_nF_slug = nextRel_obj.nodeFrom.slug;
        var nextRel_rT_slug = nextRel_obj.relationshipType.slug;
        var nextRel_nT_slug = nextRel_obj.nodeTo.slug;
        var relationshipStringified = JSON.stringify(nextRel_obj);
        var nextRel_vis_obj = { from: nextRel_nF_slug, to: nextRel_nT_slug, nodeA: nextRel_nF_slug, nodeB: nextRel_nT_slug, relationshipType: nextRel_rT_slug, relationshipStringified:relationshipStringified }
        edges_arr = addEdgeWithStyling_visjsfunctions(edges_arr,nextRel_vis_obj);
        // edges_arr.push(nextRel_vis_obj)
    }

    nodes = new DataSet(nodes_arr);
    edges = new DataSet(edges_arr);
    data = {
        nodes,
        edges
    };
    ReactDOM.render(<VisNetworkS clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        document.getElementById(networkElemID)
    )
    reorganizeSchemaS();
}
