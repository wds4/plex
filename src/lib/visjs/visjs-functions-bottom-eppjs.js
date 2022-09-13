
import React, { Component, createRef, useEffect, useRef } from "react";
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

export const VisNetworkCustom = () => {

    // A reference to the div rendered by this component
    var domNode = useRef(null);

    // A reference to the vis network instance
    network = useRef(null);

    useEffect(
        () => {
          network.current = new Network(domNode.current, data, options);
          network.current.fit();

          network.current.on("click",function(params){
              // console.log("network current on click")
              var nodes_arr = params.nodes;
              var numNodes = nodes_arr.length;
              if (numNodes==1) {
                  var nodeID = nodes_arr[0];
                  var nodeInfo = nodes.get(nodeID);
                  var node_slug = nodeInfo.slug;
                  var node_rF_obj = lookupRawFileBySlug_obj.edited[node_slug];
                  if (node_rF_obj.hasOwnProperty("propertyData")) {
                      // console.log("clicked a property node ")
                      EppjsFunctions.generateFormFromProperty_eppjs(node_slug)
                  }
                  var node_title = node_rF_obj.wordData.title;
                  var node_rF_str = JSON.stringify(node_rF_obj,null,4);

                  var nodeHTML = "";
                  nodeHTML += node_title;
                  jQuery("#highlightedProperty_lowerPanel_container").html(nodeHTML)
                  jQuery("#selectedProperty_rawFile_eppjs").html(node_rF_str)
                  jQuery("#selectedProperty_rawFile_eppjs").val(node_rF_str)
              }
          });
          network.current.on("hoverNode",function(params){
          });
          network.current.on("blurNode",function(params){
          });
          network.current.on("clickNode",function(params){
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
export function makeVisGraph_propertySchema_bottom_eppjs(schemaSlug,networkElemID) {

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
