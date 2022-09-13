import React, { Component, createRef, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import * as VisStyleConstants from './visjs-style';
// import GenerateCompactConceptSummarySelector, { reorganizeConcept, addEdgeWithStyling } from '../../views/GenerateCompactConceptSummarySelector';
import { lookupRawFileBySlug_obj, templatesByWordType_obj, insertOrUpdateWordIntoMyDictionary, insertOrUpdateWordIntoMyConceptGraph } from '../../views/addANewConcept';
import * as MiscFunctions from '../miscFunctions.js';
import propertyTypes from '../../json/propertyTypes';
const jQuery = require("jquery");



// this is a hack to use nodesB in place of nodes; not sure why nodeB works but node does not in function reorganizeConcept_mainschemaB
// var nodesB = {};
// var edgesB = {};

export function reorganizeConcept_mainschemaB() {
    // console.log("reorganizeConcept_mainschemaB")
    var edgeIDs_arr = edges.getIds();
    // console.log('edgeIDs_arr', edgeIDs_arr);
    var numEdgeIDs = edgeIDs_arr.length;
    var nodeIDs_arr = nodes.getIds();
    // console.log('edgeIDs_arr', edgeIDs_arr);
    var numNodeIDs = nodeIDs_arr.length;
    var numEnum = 0;
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
        if (node_conceptRole=="propertiesSet") {
            nodes.update({id:nodeID,x:125,y:0,physics:false });
        }
        if (node_conceptRole=="primaryProperty") {
            nodes.update({id:nodeID,x:-175,y:125,physics:false });
        }
        if (node_conceptRole=="enumeration") {
            nodes.update({id:nodeID,x:350,y:-150,physics:false });
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
        if ( (relType=="subsetOf") || (relType=="isASpecificInstanceOf") ) {
            var nodeTo = nodes.get(nodeToID);
            if (nodeTo) {
                var nodeDD = nodeTo.numDirectDescendants;
                nodeDD++;
                nodes.update({id:nodeToID, numDirectDescendants: nodeDD });
                nodes.update({id:nodeFromID, dirDescendantNumber: nodeDD });
            }
        }
        if (relType=="enumerates") {
            nodes.update({id:nodeToID,x:-350});
        }
        if (relType=="enumeratesSingleValue") {
            nodes.update({id:nodeToID,x:-350});
        }
    }
    for (var i=0;i<50;i++) {
        for (var z=0;z<numEdgeIDs;z++) {
            var edgeID = edgeIDs_arr[z];
            var edge = edges.get(edgeID);
            var nodeFromID = edge.nodeA;
            var nodeToID = edge.nodeB;
            var relType = edge.relationshipType;
            if (relType=="subsetOf") {
                var nodeTo = nodes.get(nodeToID);
                var nDD = nodeTo.numDirectDescendants;
                var nodeFrom = nodes.get(nodeFromID);
                var ddN = nodeFrom.dirDescendantNumber;

                var nT_x = nodeTo.x;
                var nT_y = nodeTo.y;
                var nF_x = nT_x + 150 * ddN - 75*(nDD+1);
                var nF_y = nT_y + 150;
                nodes.update({id:nodeFromID,x:nF_x,y:nF_y,physics:false });
                /*
                var nF_x = nodeFrom.x;
                var nF_y = nodeFrom.y;
                var nT_x = nT_x - 150 * ddN + 150*(nDD-0.5);
                var nT_y = nT_y - 150;
                nodes.update({id:nodeToID,x:nT_x,y:nT_y,physics:false });
                */
            }
            if (relType=="isASpecificInstanceOf") {
                var nodeTo = nodes.get(nodeToID);
                if (nodeTo) {
                    var nDD = nodeTo.numDirectDescendants;
                    var nodeFrom = nodes.get(nodeFromID);
                    var ddN = nodeFrom.dirDescendantNumber;
                    var nT_x = nodeTo.x;
                    var nT_y = nodeTo.y;
                    var nF_x = nT_x + 150 * ddN - 75*(nDD+1);
                    var nF_y = nT_y + 150;
                    nodes.update({id:nodeFromID,x:nF_x,y:nF_y,physics:false });
                }
            }
        }
    }
    // network.fit();
}

export function reorganizeConcept_mainschema() {
    // console.log("reorganizeConcept_mainschema")
    var edgeIDs_arr = edges.getIds();
    // console.log('edgeIDs_arr', edgeIDs_arr);
    var numEdgeIDs = edgeIDs_arr.length;
    var nodeIDs_arr = nodes.getIds();
    // console.log('edgeIDs_arr', edgeIDs_arr);
    var numNodeIDs = nodeIDs_arr.length;
    var numEnum = 0;
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
        if (node_conceptRole=="propertiesSet") {
            nodes.update({id:nodeID,x:125,y:0,physics:false });
        }
        if (node_conceptRole=="primaryProperty") {
            nodes.update({id:nodeID,x:-175,y:125,physics:false });
        }
        if (node_conceptRole=="enumeration") {
            nodes.update({id:nodeID,x:350,y:-150,physics:false });
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
        if ( (relType=="subsetOf") || (relType=="isASpecificInstanceOf") ) {
            var nodeTo = nodes.get(nodeToID);
            if (nodeTo) {
                var nodeDD = nodeTo.numDirectDescendants;
                nodeDD++;
                nodes.update({id:nodeToID, numDirectDescendants: nodeDD });
                nodes.update({id:nodeFromID, dirDescendantNumber: nodeDD });
            }
        }
        if (relType=="enumerates") {
            nodes.update({id:nodeToID,x:-350});
        }
        if (relType=="enumeratesSingleValue") {
            nodes.update({id:nodeToID,x:-350});
        }
    }
    for (var i=0;i<50;i++) {
        for (var z=0;z<numEdgeIDs;z++) {
            var edgeID = edgeIDs_arr[z];
            var edge = edges.get(edgeID);
            var nodeFromID = edge.nodeA;
            var nodeToID = edge.nodeB;
            var relType = edge.relationshipType;
            if (relType=="subsetOf") {
                var nodeTo = nodes.get(nodeToID);
                var nDD = nodeTo.numDirectDescendants;
                var nodeFrom = nodes.get(nodeFromID);
                var ddN = nodeFrom.dirDescendantNumber;

                var nT_x = nodeTo.x;
                var nT_y = nodeTo.y;
                var nF_x = nT_x + 150 * ddN - 75*(nDD+1);
                var nF_y = nT_y + 150;
                nodes.update({id:nodeFromID,x:nF_x,y:nF_y,physics:false });
                /*
                var nF_x = nodeFrom.x;
                var nF_y = nodeFrom.y;
                var nT_x = nT_x - 150 * ddN + 150*(nDD-0.5);
                var nT_y = nT_y - 150;
                nodes.update({id:nodeToID,x:nT_x,y:nT_y,physics:false });
                */
            }
            if (relType=="isASpecificInstanceOf") {
                var nodeTo = nodes.get(nodeToID);
                if (nodeTo) {
                    var nDD = nodeTo.numDirectDescendants;
                    var nodeFrom = nodes.get(nodeFromID);
                    var ddN = nodeFrom.dirDescendantNumber;
                    var nT_x = nodeTo.x;
                    var nT_y = nodeTo.y;
                    var nF_x = nT_x + 150 * ddN - 75*(nDD+1);
                    var nF_y = nT_y + 150;
                    nodes.update({id:nodeFromID,x:nF_x,y:nF_y,physics:false });
                }
            }
        }
    }
    // network.fit();
}


export const updateIndividualSchema = () => {
    var schema_slug = jQuery("#nameOfSchemaBeingDisplayedContainer").html();
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
        console.log("z: "+z+"; nodeID: "+nodeID+"; node_slug: "+node_slug);
        var node_rF_obj = MiscFunctions.cloneObj(lookupRawFileBySlug_obj[node_slug]);
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

var data = {
    nodes,
    edges
};

var options = VisStyleConstants.options_vis_c2c;

export var network = {};

export var highlightedNode_slug = "";

export const VisNetworkCustom = () => {

    // A reference to the div rendered by this component
    var domNode = useRef(null);

    // A reference to the vis network instance
    network = useRef(null);

    useEffect(
        () => {
          network.current = new Network(domNode.current, data, options);
          network.current.fit();
          var reservedPanelByClick = false;

          network.current.on("click",function(params){
              // console.log("network current on click")
              reservedPanelByClick = false;
              var nodes_arr = params.nodes;
              var numNodes = nodes_arr.length;
              if (numNodes==1) {
                  var nodeID = nodes_arr[0];
                  var nodeInfo = nodes.get(nodeID);
                  var node_slug = nodeInfo.slug;
                  highlightedNode_slug = node_slug;
                  // console.log("clicked node; node_slug: "+node_slug)
                  var node_rF_obj = lookupRawFileBySlug_obj.edited[node_slug];
                  var node_rF_str = JSON.stringify(node_rF_obj,null,4);
                  var nodeHTML = node_rF_str;
                  jQuery("#visJsDisplay1").css("display","block");
                  jQuery("#visJsDisplay1").html(nodeHTML);
                  jQuery("#visJsDisplay1").val(nodeHTML);
                  jQuery("#visJsDisplay2").css("display","block");
                  jQuery("#visJsDisplay2").html(nodeHTML);
                  jQuery("#visJsDisplay2").val(nodeHTML);
                  reservedPanelByClick = true;
              }
              highlightedNode_slug = node_slug;
          });
          network.current.on("hoverNode",function(params){
              if (!reservedPanelByClick) {
                  var nodeID = params.node;
                  var nodeInfo = nodes.get(nodeID);
                  var node_slug = nodeInfo.slug;
                  var node_title = nodeInfo.title;
                  var node_rF_obj = lookupRawFileBySlug_obj.edited[node_slug];
                  var node_wordTypes_arr = [];
                  if (node_rF_obj) {
                      node_wordTypes_arr = node_rF_obj.wordData.wordTypes;
                  }
                  // console.log("QWERTY hover node: node_slug: "+node_slug)

                  var nodeHTML = "";
                  nodeHTML += "wordData slug: "+node_slug+"\n";
                  nodeHTML += "wordData title: "+node_title;
                  if (jQuery.inArray("property",node_wordTypes_arr) > -1) {
                      var nodeHTML = "";
                      var propertyData_obj = node_rF_obj.propertyData;
                      var propertyData_str = JSON.stringify(propertyData_obj,null,4);
                      nodeHTML += "wordData slug: "+node_slug+"\n";
                      nodeHTML += "wordData title: "+node_title+"\n\n";
                      nodeHTML += "propertyData: \n";
                      nodeHTML += propertyData_str;
                  }
                  if (jQuery.inArray("set",node_wordTypes_arr) > -1) {
                      var nodeHTML = "";
                      var setData_obj = node_rF_obj.setData;
                      var setData_str = JSON.stringify(setData_obj,null,4);
                      nodeHTML += "wordData slug: "+node_slug+"\n";
                      nodeHTML += "wordData title: "+node_title+"\n\n";
                      // var setData_slug = setData_obj.slug;
                      // var setData_title = setData_obj.title;
                      // var setData_description = setData_obj.description;
                      nodeHTML += "setData: \n";
                      nodeHTML += setData_str;
                  }

                  jQuery("#visJsDisplay1").css("display","block");
                  jQuery("#visJsDisplay1").html(nodeHTML);
                  jQuery("#visJsDisplay1").val(nodeHTML);
                  jQuery("#visJsDisplay2").css("display","block");
                  jQuery("#visJsDisplay2").html(nodeHTML);
                  jQuery("#visJsDisplay2").val(nodeHTML);
                  // console.log("nodeID: "+nodeID+"; node_slug: "+node_slug+"; node_title: "+node_title)
              }
          });
          network.current.on("blurNode",function(params){
              if (!reservedPanelByClick) {
                  jQuery("#visJsDisplay1").css("display","none");
                  jQuery("#visJsDisplay2").css("display","none");
              }
          });
          network.current.on("clickNode",function(params){
              var nodeID = params.nodes[0];
              var nodeInfo = nodes.get(nodeID);
              var node_slug = nodeInfo.slug;
              var node_title = nodeInfo.title;
              /*
              var nodeHTML = "";
              nodeHTML += node_title;
              jQuery("#visJsDisplay").html(nodeHTML);
              jQuery("#visJsDisplay").val(nodeHTML);
              jQuery("#showFilePanel").html(nodeHTML);
              jQuery("#showFilePanel").val(nodeHTML);
              */
              // console.log("nodeID: "+nodeID+"; node_slug: "+node_slug+"; node_title: "+node_title)
          });
        },
        [domNode, network, data, options]
    );

    return (
        <div style={{height:"100%"}} ref = { domNode } />
    );
};

function isEven(value) {
  	if (value%2 == 0)
  		  return true;
  	else
  		  return false;
}

export function reorganizeConcept_visjsfunctions() {
    // console.log("reorganizeConcept_visjsfunctions")
    var edgeIDs_arr = edges.getIds();
    // console.log('edgeIDs_arr', edgeIDs_arr);
    var numEdgeIDs = edgeIDs_arr.length;
    var nodeIDs_arr = nodes.getIds();
    // console.log('edgeIDs_arr', edgeIDs_arr);
    var numNodeIDs = nodeIDs_arr.length;
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
        if (node_conceptRole=="propertiesSet") {
            nodes.update({id:nodeID,x:125,y:0,physics:false });
        }
        if (node_conceptRole=="primaryProperty") {
            nodes.update({id:nodeID,x:-175,y:125,physics:false });
        }
        if (node_conceptRole=="enumeration") {
            nodes.update({id:nodeID,x:350,y:-150,physics:false });
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
    for (var i=0;i<50;i++) {
        for (var z=0;z<numEdgeIDs;z++) {
            var edgeID = edgeIDs_arr[z];
            var edge = edges.get(edgeID);
            var nodeFromID = edge.nodeA;
            var nodeToID = edge.nodeB;
            var relType = edge.relationshipType;
            if (relType=="subsetOf") {
                var nodeTo = nodes.get(nodeToID);
                var nDD = nodeTo.numDirectDescendants;
                var nodeFrom = nodes.get(nodeFromID);
                var ddN = nodeFrom.dirDescendantNumber;

                var nT_x = nodeTo.x;
                var nT_y = nodeTo.y;
                var nF_x = nT_x + 150 * ddN - 75*(nDD+1);
                var nF_y = nT_y + 150;
                nodes.update({id:nodeFromID,x:nF_x,y:nF_y,physics:false });
            }
            if (relType=="isASpecificInstanceOf") {
                var nodeTo = nodes.get(nodeToID);
                var nDD = nodeTo.numDirectDescendants;
                var nodeFrom = nodes.get(nodeFromID);
                var ddN = nodeFrom.dirDescendantNumber;
                var nT_x = nodeTo.x;
                var nT_y = nodeTo.y;
                var nF_x = nT_x + 150 * ddN - 75*(nDD+1);
                var nF_y = nT_y + 150;
                nodes.update({id:nodeFromID,x:nF_x,y:nF_y,physics:false });
            }
        }
    }
}

export function addEdgeWithStyling_visjsfunctions(edges_arr,nextEdge_obj) {

    var nextEdge_out_obj = MiscFunctions.cloneObj(nextEdge_obj);
    var relType = nextEdge_out_obj.relationshipType;
    nextEdge_out_obj.title = relType;
    // console.log("addEdgeWithStyling_visjsfunctions; relType: "+relType)

    var rT_propertyField = nextEdge_out_obj.propertyField;
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

function addNextNode(nodes_arr,nextNode_group,nextNode_slug,nextNode_x,nextNode_y) {
    var nodes_arr_out = JSON.parse(JSON.stringify(nodes_arr));
    var nextNode_conceptRole = nextNode_group;
    var nextNode_title = nextNode_slug;
    var nextNode_id = nextNode_slug;
    var nextNode_label = nextNode_slug;
    var nextNode_vis_obj = { id: nextNode_id, label: nextNode_label, slug: nextNode_slug, title: nextNode_title, group: nextNode_group, conceptRole: nextNode_conceptRole, physics: false, x: nextNode_x, y: nextNode_y }
    nodes_arr_out.push(nextNode_vis_obj)
    return nodes_arr_out;
}

// make graph for page for creating propertyModules
export function makeVisGraph_propertyModule(conceptSlug,propertyModuleKey,networkElemID) {
    // console.log("QWERTY makeVisGraph_propertyModule; conceptSlug: "+conceptSlug+"; propertyModuleKey: "+propertyModuleKey+"; networkElemID: "+networkElemID);
    var concept_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[conceptSlug]));

    var propertyModuleData_obj = concept_rF_obj.conceptData.propertyModuleData[propertyModuleKey];
    var enumeration_slug = propertyModuleData_obj.enumeration.slug;
    var enumeration_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[enumeration_slug]));

    var enumeratorSourceConcept_slug = enumeration_rF_obj.enumerationData.source.concept;
    var enumeratorSourceConcept_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[enumeratorSourceConcept_slug]));
    var enumeratorSourceSet_slug = enumeration_rF_obj.enumerationData.source.set;

    var property_slug = "";
    if (propertyModuleData_obj.hasOwnProperty("property")) {
        property_slug = propertyModuleData_obj.property.slug;
    }

    var concept_wordType_slug = concept_rF_obj.conceptData.nodes.wordType.slug;
    var concept_schema_slug = concept_rF_obj.conceptData.nodes.schema.slug;
    var concept_superset_slug = concept_rF_obj.conceptData.nodes.superset.slug;
    var concept_JSONSchema_slug = concept_rF_obj.conceptData.nodes.JSONSchema.slug;
    var concept_primaryProperty_slug = concept_rF_obj.conceptData.nodes.primaryProperty.slug;
    var concept_propertySchema_slug = concept_rF_obj.conceptData.nodes.propertySchema.slug;
    var concept_concept_slug = concept_rF_obj.conceptData.nodes.concept.slug;
    var concept_properties_slug = concept_rF_obj.conceptData.nodes.properties.slug;

    var schema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[concept_schema_slug]));
    var schema_nodes_obj = schema_rF_obj.schemaData.nodes;
    var schema_rels_obj = schema_rF_obj.schemaData.relationships;
    var numNodes = schema_nodes_obj.length;
    var numRels = schema_rels_obj.length;

    var nodes_arr = [];
    var edges_arr = [];
    var nextNode_conceptRole = "";
    var nextNode_x = 0;
    var nextNode_y = 0;
    var pmgInterval = 150;
    var pmgInterval_big = 500;
    var nextNode_group = "";
    var nextNode_slug = "";

    // set and its subsets
    var set_slug = "";
    if (propertyModuleData_obj.hasOwnProperty("set")) {
        set_slug = propertyModuleData_obj.set.slug;
        nextNode_group = "set_propertyModule";
        nextNode_slug = set_slug;
        nextNode_x = 0;
        nextNode_y = pmgInterval * 2;
        nodes_arr = addNextNode(nodes_arr,nextNode_group,nextNode_slug,nextNode_x,nextNode_y);
    }
    if (propertyModuleData_obj.hasOwnProperty("elements")) {
        var elements_obj = propertyModuleData_obj.elements;
        var nextElem_slug = "";
        var nextSubset_slug = "";
        var numElemsTot = 0;
        jQuery.each(elements_obj,function(key,val_obj){
            numElemsTot++;
        });
        var elemNum = 0;
        jQuery.each(elements_obj,function(key,val_obj){
            nextElem_slug =val_obj.slug;
            nextNode_group = "highlightedOption";
            nextNode_slug = nextElem_slug;
            nextNode_x = pmgInterval_big - (numElemsTot-1)*75 + elemNum*150;
            nextNode_y = pmgInterval * 3 + elemNum*20;
            nodes_arr = addNextNode(nodes_arr,nextNode_group,nextNode_slug,nextNode_x,nextNode_y);

            nextSubset_slug = val_obj.subset;

            nextNode_group = "set_propertyModuleSubset";
            nextNode_slug = nextSubset_slug;
            nextNode_x = - (numElemsTot-1)*75 + elemNum*150;
            nextNode_y = pmgInterval * 3 + elemNum*20;
            nodes_arr = addNextNode(nodes_arr,nextNode_group,nextNode_slug,nextNode_x,nextNode_y);
            elemNum++;
        });
    }

    // enumeration
    nextNode_group = "enumeration";
    nextNode_slug = enumeration_slug;
    nextNode_x = pmgInterval_big - 200;
    nextNode_y = 0;
    nodes_arr = addNextNode(nodes_arr,nextNode_group,nextNode_slug,nextNode_x,nextNode_y);

    // Enumerator Source Concept
    var enumSource_wordType_slug = enumeratorSourceConcept_rF_obj.conceptData.nodes.wordType.slug;
    var enumSource_superset_slug = enumeratorSourceConcept_rF_obj.conceptData.nodes.superset.slug;
    // enum source wordType
    nextNode_group = "wordType";
    nextNode_slug = enumSource_wordType_slug;
    nextNode_x = pmgInterval_big;
    nextNode_y = 0;
    nodes_arr = addNextNode(nodes_arr,nextNode_group,nextNode_slug,nextNode_x,nextNode_y);

    // enum source superset
    nextNode_group = "superset";
    nextNode_slug = enumSource_superset_slug;
    nextNode_x = pmgInterval_big;
    nextNode_y = pmgInterval;
    if (enumSource_superset_slug == enumeratorSourceSet_slug) {
        nextNode_slug += "_";
    }
    nodes_arr = addNextNode(nodes_arr,nextNode_group,nextNode_slug,nextNode_x,nextNode_y);

    // enum source superset
    nextNode_group = "set_enumerationSource";
    nextNode_slug = enumeratorSourceSet_slug;
    nextNode_x = pmgInterval_big;
    nextNode_y = pmgInterval*2;
    nodes_arr = addNextNode(nodes_arr,nextNode_group,nextNode_slug,nextNode_x,nextNode_y);

    ////////////////////////////////////////
    // Main Concept
    // wordType
    nextNode_group = "wordType";
    nextNode_slug = concept_wordType_slug;
    nextNode_x = 0;
    nextNode_y = 0;
    nodes_arr = addNextNode(nodes_arr,nextNode_group,nextNode_slug,nextNode_x,nextNode_y);

    // superset
    nextNode_group = "superset";
    nextNode_slug = concept_superset_slug;
    nextNode_x = 0;
    nextNode_y = pmgInterval;
    nodes_arr = addNextNode(nodes_arr,nextNode_group,nextNode_slug,nextNode_x,nextNode_y);

    /*
    // concept
    nextNode_group = "concept";
    nextNode_slug = concept_concept_slug;
    nextNode_x = 0;
    nextNode_y = - pmgInterval;
    nodes_arr = addNextNode(nodes_arr,nextNode_group,nextNode_slug,nextNode_x,nextNode_y);

    // schema
    nextNode_group = "schema";
    nextNode_slug = concept_schema_slug;
    nextNode_x = pmgInterval;
    nextNode_y = - pmgInterval;
    nodes_arr = addNextNode(nodes_arr,nextNode_group,nextNode_slug,nextNode_x,nextNode_y);

    // propertySchema
    nextNode_group = "schema";
    nextNode_slug = concept_propertySchema_slug;
    nextNode_x = - pmgInterval;
    nextNode_y = - pmgInterval;
    nodes_arr = addNextNode(nodes_arr,nextNode_group,nextNode_slug,nextNode_x,nextNode_y);

    // JSONSchema
    nextNode_group = "JSONSchema";
    nextNode_slug = concept_JSONSchema_slug;
    nextNode_x = - pmgInterval;
    nextNode_y = 0;
    nodes_arr = addNextNode(nodes_arr,nextNode_group,nextNode_slug,nextNode_x,nextNode_y);

    // properties
    nextNode_group = "properties";
    nextNode_slug = concept_properties_slug;
    nextNode_x = pmgInterval;
    nextNode_y = 0;
    nodes_arr = addNextNode(nodes_arr,nextNode_group,nextNode_slug,nextNode_x,nextNode_y);
    */

    var nodes_str = JSON.stringify(nodes_arr,null,4);
    var edges_str = JSON.stringify(edges_arr,null,4);

    // console.log("nodes_str: "+nodes_str)
    // console.log("edges_str: "+edges_str)

    nodes = new DataSet(nodes_arr);
    edges = new DataSet(edges_arr);
    data = {
        nodes,
        edges
    };
    jQuery("#updateDisplayedSchemaContainer").css("display","none");
    ReactDOM.render(<VisNetworkCustom clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        document.getElementById(networkElemID)
    )
    // reorganizeSchema___();
}

// make graph from schema of type: propertySchema
export function makeVisGraph_propertySchema(schemaSlug,networkElemID) {
    // console.log("makeVisGraph_propertySchema; schemaSlug: "+schemaSlug+"; networkElemID: "+networkElemID)
    var schema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[schemaSlug]));
    var thisSchemaGoverningConcept_slug = schema_rF_obj.schemaData.metaData.governingConcept.slug;
    var schema_rF_str = JSON.stringify(schema_rF_obj,null,4);
    // console.log("schema_rF_str: "+schema_rF_str);

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
    var numProp_hasKey = 0;
    var numProp_type0 = 0;
    var numProp_type1 = 0; // type=string
    var numProp_type1i = 0; // type=integer
    var numProp_type1n = 0; // type=number
    var numProp_type1a = 0; // type=array
    var numProp_type1b = 0; // type=boolean
    var numProp_type1null = 0; // type=null
    var numProp_type2 = 0;
    var numProp_propModule = 0;
    var numProp_type3 = 0;
    var numProp = {};
    var propNodeSpacer = 300;
    var propNodeMiniSpacer = 5;
    var numPropConst = 10;
    var propLocation_x_hasKey = -2 * propNodeSpacer;
    var propLocation_x_type0 = - propNodeSpacer;
    var propLocation_x_type1 = 0;
    var propLocation_x_type1i = propNodeSpacer;
    var propLocation_x_type1n = 2 * propNodeSpacer;
    var propLocation_x_type1a = 3 * propNodeSpacer;
    var propLocation_x_type1b = 3.3 * propNodeSpacer;
    var propLocation_x_type1null = 3.6 * propNodeSpacer;
    var propLocation_x_type2 = 4 * propNodeSpacer;
    var propLocation_x_propModule = 5 * propNodeSpacer;
    var propLocation_x_type3 = 6 * propNodeSpacer;
    var type3CounterXIncrement = 300;

    var numEnumerations = 0;

    // first, set addToConceptGraphProperties_xCounter = 0 for all type3 property nodes
    var lookupType3XXounterBySlug = {};
    for (var n=0;n<numNodes;n++) {
        var nextNode_obj = schema_nodes_obj[n];
        var nextNode_slug = nextNode_obj.slug;
        lookupType3XXounterBySlug[nextNode_slug] = 0;
    }

    // next, cycle through all relationships of relType: addToConceptGraphProperties and make sure
    // that addToConceptGraphProperties_xCounter for the nodeTo property is at least one greater than that for the nodeFrom property
    for (var z=0;z<5;z++) {
        for (var n=0;n<numRels;n++) {
            var nextRel_obj = schema_rels_obj[n];
            var nextRel_nF_slug = nextRel_obj.nodeFrom.slug;
            var nextRel_rT_slug = nextRel_obj.relationshipType.slug;
            var nextRel_nT_slug = nextRel_obj.nodeTo.slug;

            if (nextRel_rT_slug=="addToConceptGraphProperties") {
                var nextNode_nF_rF_obj = lookupRawFileBySlug_obj.edited[nextRel_nF_slug];
                var nextNode_nT_rF_obj = lookupRawFileBySlug_obj.edited[nextRel_nT_slug];
                var nT_type = nextNode_nT_rF_obj.propertyData.type;
                if (nextNode_nF_rF_obj.hasOwnProperty("propertyData")) {
                    var nF_type = nextNode_nF_rF_obj.propertyData.type;
                    if ((nF_type=="type3") && (nF_type=="type3")) {
                        if (lookupType3XXounterBySlug[nextRel_nF_slug] > lookupType3XXounterBySlug[nextRel_nT_slug]) {
                            // do nothing
                        } else {
                            lookupType3XXounterBySlug[nextRel_nT_slug] = lookupType3XXounterBySlug[nextRel_nF_slug] + 1;
                        }
                    }
                }
            }
        }
    }


    for (var n=0;n<numNodes;n++) {
        var nextNode_obj = schema_nodes_obj[n];
        var nextNode_slug = nextNode_obj.slug;
        if (lookupRawFileBySlug_obj.edited.hasOwnProperty(nextNode_slug)) {
            var nextNode_rF_obj = lookupRawFileBySlug_obj.edited[nextNode_slug];
            var nextNode_wordType = nextNode_rF_obj.wordData.wordType;
            var nextNode_title = nextNode_rF_obj.wordData.title;
            var nextNode_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;

            var nextNode_label = nextNode_title;
            var nextNode_conceptRole = nextNode_wordType;
            if (nextNode_wordType=="schema") {
                if (jQuery.inArray("propertySchema",nextNode_rF_obj.schemaData.metaData.types) > -1 ) {
                    nextNode_conceptRole = "propertySchema";
                }
            }
            if (nextNode_wordType=="property") {
                if (jQuery.inArray("primaryProperty",nextNode_rF_obj.propertyData.metaData.types) > -1 ) {
                    nextNode_conceptRole = "primaryProperty";
                }
            }

            var nextNode_x = 0;
            var nextNode_y = 0;

            if (jQuery.inArray("enumeration",nextNode_wordTypes_arr) > -1) {
                nextNode_x = 0 - propNodeSpacer * numEnumerations;
                nextNode_y = 0;
                numEnumerations++;
            }

            var tempYShift = propNodeSpacer * 10;

            if (jQuery.inArray("set",nextNode_wordTypes_arr) > -1) {
                // console.log("makeVisGraph_propertySchema; SET")

                if (nextNode_rF_obj.setData.hasOwnProperty("metaData")) {
                    if (nextNode_rF_obj.setData.metaData.hasOwnProperty("types")) {
                        jQuery.each(propertyTypes,function(nextPropertyType,propTypeData_obj){
                            if (jQuery.inArray(nextPropertyType,nextNode_rF_obj.setData.metaData.types) > -1) {
                                nextNode_x = propNodeSpacer * propTypeData_obj["x-pos"];
                                nextNode_y = propNodeSpacer * propTypeData_obj["y-pos"];
                            }
                        })

                        if (jQuery.inArray("mainPropertiesSet",nextNode_rF_obj.setData.metaData.types) > -1) {
                            nextNode_x = propNodeSpacer/2;
                            nextNode_y = 0;
                        }
                        if (jQuery.inArray("properties_hasKey",nextNode_rF_obj.setData.metaData.types) > -1) {
                            nextNode_x = propLocation_x_hasKey;
                            nextNode_y = tempYShift + propNodeSpacer;
                        }
                        if (jQuery.inArray("properties_type0",nextNode_rF_obj.setData.metaData.types) > -1) {
                            nextNode_x = propLocation_x_type0;
                            nextNode_y = tempYShift + propNodeSpacer;
                        }
                        if (jQuery.inArray("properties_type1",nextNode_rF_obj.setData.metaData.types) > -1) {
                            nextNode_x = propLocation_x_type1;
                            nextNode_y = tempYShift + propNodeSpacer;
                        }
                        if (jQuery.inArray("properties_type1i",nextNode_rF_obj.setData.metaData.types) > -1) {
                            nextNode_x = propLocation_x_type1i;
                            nextNode_y = tempYShift + propNodeSpacer;
                        }
                        if (jQuery.inArray("properties_type1n",nextNode_rF_obj.setData.metaData.types) > -1) {
                            nextNode_x = propLocation_x_type1n;
                            nextNode_y = tempYShift + propNodeSpacer;
                        }
                        if (jQuery.inArray("properties_type1a",nextNode_rF_obj.setData.metaData.types) > -1) {
                            nextNode_x = propLocation_x_type1a;
                            nextNode_y = tempYShift + propNodeSpacer;
                        }
                        if (jQuery.inArray("properties_type1b",nextNode_rF_obj.setData.metaData.types) > -1) {
                            nextNode_x = propLocation_x_type1b;
                            nextNode_y = tempYShift + propNodeSpacer;
                        }
                        if (jQuery.inArray("properties_type1null",nextNode_rF_obj.setData.metaData.types) > -1) {
                            nextNode_x = propLocation_x_type1null;
                            nextNode_y = tempYShift + propNodeSpacer;
                        }
                        if (jQuery.inArray("properties_type2",nextNode_rF_obj.setData.metaData.types) > -1) {
                            nextNode_x = propLocation_x_type2;
                            nextNode_y = tempYShift + propNodeSpacer;
                        }
                        if (jQuery.inArray("properties_propModule",nextNode_rF_obj.setData.metaData.types) > -1) {
                            nextNode_x = propLocation_x_propModule;
                            nextNode_y = tempYShift + propNodeSpacer;
                        }
                        if (jQuery.inArray("properties_type3",nextNode_rF_obj.setData.metaData.types) > -1) {
                            nextNode_x = propLocation_x_type3;
                            nextNode_y = tempYShift + propNodeSpacer;
                        }
                    }
                }
            }

            if (nextNode_conceptRole=="primaryProperty") {
                nextNode_x = -propNodeSpacer;
                nextNode_y = propNodeSpacer/2;
            }
            if (nextNode_wordType=="property") {
                var xC = lookupType3XXounterBySlug[nextNode_slug];
                var nextNode_propertyData_obj = nextNode_rF_obj.propertyData;
                var nextNode_propType = nextNode_propertyData_obj.type;
                var nextNode_propTypes_arr = nextNode_rF_obj.propertyData.types;
                var propPolarity = -1;

                /*
                if (nextNode_propType=="hasKey") {
                    propPolarity = -1;
                    if (isEven(numProp_hasKey)) { propPolarity = 1; }
                    nextNode_x = propLocation_x_hasKey + propPolarity * (numPropConst - numProp_hasKey) * propNodeMiniSpacer;
                    nextNode_y = tempYShift + propNodeSpacer * (numProp_hasKey + 2);
                    numProp_hasKey++;
                }
                if (nextNode_propType=="type0") {
                    propPolarity = -1;
                    if (isEven(numProp_type0)) { propPolarity = 1; }
                    nextNode_x = propLocation_x_type0 + propPolarity * (numPropConst - numProp_type0) * propNodeMiniSpacer;
                    nextNode_y = tempYShift + propNodeSpacer * (numProp_type0 + 2);
                    numProp_type0++;
                }
                if (nextNode_propType=="type1") {
                    propPolarity = -1;
                    if (isEven(numProp_type1)) { propPolarity = 1; }
                    nextNode_x = propLocation_x_type1 + propPolarity * (numPropConst - numProp_type1) * propNodeMiniSpacer;
                    nextNode_y = tempYShift + propNodeSpacer * (numProp_type1 + 2);
                    numProp_type1++;
                }
                if (nextNode_propType=="type1i") {
                    propPolarity = -1;
                    if (isEven(numProp_type1i)) { propPolarity = 1; }
                    nextNode_x = propLocation_x_type1i + propPolarity * (numPropConst - numProp_type1i) * propNodeMiniSpacer;
                    nextNode_y = tempYShift + propNodeSpacer * (numProp_type1i + 2);
                    numProp_type1i++;
                }
                if (nextNode_propType=="type1n") {
                    propPolarity = -1;
                    if (isEven(numProp_type1n)) { propPolarity = 1; }
                    nextNode_x = propLocation_x_type1n + propPolarity * (numPropConst - numProp_type1n) * propNodeMiniSpacer;
                    nextNode_y = tempYShift + propNodeSpacer * (numProp_type1n + 2);
                    numProp_type1n++;
                }
                if (nextNode_propType=="type1a") {
                    propPolarity = -1;
                    if (isEven(numProp_type1a)) { propPolarity = 1; }
                    nextNode_x = propLocation_x_type1a + propPolarity * (numPropConst - numProp_type1a) * propNodeMiniSpacer;
                    nextNode_y = tempYShift + propNodeSpacer * (numProp_type1a + 2);
                    numProp_type1a++;
                }
                if (nextNode_propType=="type1b") {
                    propPolarity = -1;
                    if (isEven(numProp_type1b)) { propPolarity = 1; }
                    nextNode_x = propLocation_x_type1b + propPolarity * (numPropConst - numProp_type1b) * propNodeMiniSpacer;
                    nextNode_y = tempYShift + propNodeSpacer * (numProp_type1b + 2);
                    numProp_type1b++;
                }
                if (nextNode_propType=="type1null") {
                    propPolarity = -1;
                    if (isEven(numProp_type1null)) { propPolarity = 1; }
                    nextNode_x = propLocation_x_type1null + propPolarity * (numPropConst - numProp_type1null) * propNodeMiniSpacer;
                    nextNode_y = tempYShift + propNodeSpacer * (numProp_type1null + 2);
                    numProp_type1null++;
                }
                if (nextNode_propType=="type2") {
                    propPolarity = -1;
                    if (isEven(numProp_type2)) { propPolarity = 1; }
                    nextNode_x = propLocation_x_type2 + propPolarity * (numPropConst - numProp_type2) * propNodeMiniSpacer;
                    nextNode_y = tempYShift + propNodeSpacer * (numProp_type2 + 2);
                    numProp_type2++;
                }
                if (nextNode_propType=="propertyModule") {
                    propPolarity = -1;
                    if (isEven(numProp_propModule)) { propPolarity = 1; }
                    nextNode_x = propLocation_x_propModule + propPolarity * (numPropConst - numProp_propModule) * propNodeMiniSpacer;
                    nextNode_y = tempYShift + propNodeSpacer * (numProp_propModule + 2);
                    numProp_propModule++;
                }
                if (nextNode_propType=="type3") {
                    // var xC = nextNode_rF_obj.addToConceptGraphProperties_xCounter;
                    propPolarity = -1;
                    if (isEven(numProp_type3)) { propPolarity = 1; }
                    nextNode_x = propLocation_x_type3 + propPolarity * (numPropConst - numProp_type3) * propNodeMiniSpacer + xC * type3CounterXIncrement;
                    nextNode_y = tempYShift + propNodeSpacer * (numProp_type3 + 2);
                    numProp_type3++;
                }
                */

                if (!numProp.hasOwnProperty(nextNode_propType)) {
                    numProp[nextNode_propType] = 0;
                }

                var numPropTypes = nextNode_propTypes_arr.length;
                for (var zz=0;zz<numPropTypes;zz++) {
                    var nextPT = nextNode_propTypes_arr[zz];
                    if (propertyTypes.hasOwnProperty(nextPT)) {
                        if (!numProp.hasOwnProperty(nextPT)) {
                            numProp[nextPT] = 0;
                        }
                        if ((nextNode_x==0) && (nextNode_y==0)) {
                            nextNode_x = propNodeSpacer * propertyTypes[nextPT]["x-pos"];
                        } else {
                            nextNode_x = Math.max(nextNode_x,propNodeSpacer * propertyTypes[nextPT]["x-pos"]);
                        }
                        nextNode_y = propNodeSpacer * (1 + propertyTypes[nextPT]["y-pos"] + numProp[nextPT])
                        numProp[nextPT]++;
                    }
                }
                /*
                if (propertyTypes.hasOwnProperty(nextNode_propType)) {
                    nextNode_x = propNodeSpacer * propertyTypes[nextNode_propType]["x-pos"]
                    nextNode_y = propNodeSpacer * (1 + propertyTypes[nextNode_propType]["y-pos"] + numProp[nextNode_propType])
                    numProp[nextNode_propType]++;
                }
                */

                var nextNode_propertyData_str = JSON.stringify(nextNode_propertyData_obj,null,4);
                // nextNode_title = nextNode_propertyData_str;
            }

            if (nextNode_wordType=="schema") {
                nextNode_x = propNodeSpacer/2;
                nextNode_y = -propNodeSpacer/2;
            }
            if (nextNode_wordType=="JSONSchema") {
                nextNode_x = -propNodeSpacer;
                nextNode_y = 0;
            }
            if (nextNode_wordType=="wordType") {
                nextNode_x = 0;
                nextNode_y = 0;
            }
            if (nextNode_wordType=="superset") {
                nextNode_x = 0;
                nextNode_y = propNodeSpacer/2;
            }
            if (nextNode_wordType=="concept") {
                nextNode_x = 0;
                nextNode_y = -propNodeSpacer/2;
            }
            if (nextNode_conceptRole=="propertySchema") {
                nextNode_x = - propNodeSpacer;
                nextNode_y = - propNodeSpacer/2;
            }
            if (nextNode_wordType=="property") {
                var nextNode_propertyParentConcepts_arr = nextNode_rF_obj.propertyData.metaData.parentConcepts;
                if (jQuery.inArray(thisSchemaGoverningConcept_slug,nextNode_propertyParentConcepts_arr) == -1) {
                    nextNode_wordType = "property_externalParentSchema";
                }
                if (jQuery.inArray("conceptForProperty",nextNode_propertyParentConcepts_arr) > -1) {
                    nextNode_wordType = "property_propertySchemaParentSchema";
                }
            }

            var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_label, slug: nextNode_slug, title: nextNode_title, group: nextNode_wordType, conceptRole: nextNode_conceptRole, x: nextNode_x, y: nextNode_y, physics: false }
            nodes_arr.push(nextNode_vis_obj)
        }
    }

    for (var n=0;n<numRels;n++) {
        var nextRel_obj = schema_rels_obj[n];
        var nextRel_nF_slug = nextRel_obj.nodeFrom.slug;
        var nextRel_rT_slug = nextRel_obj.relationshipType.slug;
        var relationshipTypeStringified = JSON.stringify(nextRel_obj.relationshipType);
        var nextRel_nT_slug = nextRel_obj.nodeTo.slug;

        var nextRel_vis_obj = { from: nextRel_nF_slug, to: nextRel_nT_slug, nodeA: nextRel_nF_slug, nodeB: nextRel_nT_slug, relationshipType: nextRel_rT_slug, relationshipTypeStringified: relationshipTypeStringified }

        /*
        if (nextRel_rT_slug=="subsetOf") {
            var nextRel_vis_obj = { from: nextRel_nF_slug, to: nextRel_nT_slug, nodeA: nextRel_nF_slug, nodeB: nextRel_nT_slug, relationshipType: nextRel_rT_slug }
        }
        if (nextRel_rT_slug=="isASpecificInstanceOf") {
            var nextRel_vis_obj = { from: nextRel_nF_slug, to: nextRel_nT_slug, nodeA: nextRel_nF_slug, nodeB: nextRel_nT_slug, relationshipType: nextRel_rT_slug }
        }
        */

        var nextRel_rT_propertyField = "";
        if ( (nextRel_rT_slug=="addPropertyKey") || (nextRel_rT_slug=="addPropertyValue") || (nextRel_rT_slug=="propagateProperty") || (nextRel_rT_slug=="addToConceptGraphProperties" )) {
            var relTypeDataKey = nextRel_rT_slug+"Data";
            if (nextRel_obj.relationshipType.hasOwnProperty(relTypeDataKey)) {
                if (nextRel_obj.relationshipType[relTypeDataKey].hasOwnProperty("field")) {
                    nextRel_rT_propertyField = nextRel_obj.relationshipType[relTypeDataKey].field;
                }
            }
            nextRel_vis_obj.propertyField = nextRel_rT_propertyField;
        }

        // console.log("adding edge n: "+n+"; "+nextRel_nF_slug+" "+nextRel_rT_slug+" "+nextRel_nT_slug)
        edges_arr = addEdgeWithStyling_visjsfunctions(edges_arr,nextRel_vis_obj);
        // edges_arr.push(nextRel_vis_obj)
    }

    nodes = new DataSet(nodes_arr);
    edges = new DataSet(edges_arr);
    data = {
        nodes,
        edges
    };
    jQuery("#nameOfSchemaBeingDisplayedContainer").html(schemaSlug);
    jQuery("#updateDisplayedSchemaContainer").css("display","inline-block");
    // ReactDOM.render(<VisNetworkB />,document.getElementById('network_buildConceptPage'))
    ReactDOM.render(<VisNetworkCustom clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        // networkElemID = 'network_buildConceptPage'
        document.getElementById(networkElemID)
    )

    // reorganizeSchema_propertySchema();
}
