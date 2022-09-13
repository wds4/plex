import React, { useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import ConceptGraphMasthead from '../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/singleConceptGraph_c2cRels_leftNav2.js';
import * as MiscFunctions from '../../../functions/miscFunctions.js';
// import sendAsync from '../../../renderer.js';
import * as VisStyleConstants from '../../../lib/visjs/visjs-style';

const jQuery = require("jquery");

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
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

var options = VisStyleConstants.options_vis_conceptGraphMainSchema;

export var network = {};

var data = {
    nodes,
    edges
};

export const VisNetwork_ConceptGraphMainSchema = () => {

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
                var oWord = window.lookupWordBySlug[nodeID];
                var sWord = JSON.stringify(oWord,null,4)
                jQuery("#selectedWordSlugElem").html(nodeID)
                jQuery("#selectedWordRawFileTextarea").html(sWord)
            }
        });
        network.current.on("deselectNode",function(params){
            jQuery("#selectedWordSlugElem").html("")
        });
      },
      [domNode, network, data, options]
    );

    return (
      <div style={{height:"100%",width:"100%"}} ref = { domNode } />
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

export async function reorganizeSchema_ConceptGraphMainSchema() {
    var aNodeIDs = nodes.getIds();
    var numNodes = aNodeIDs.length;
    console.log("numNodes: "+numNodes)

    var aEdgeIDs = edges.getIds();
    var numEdges = aEdgeIDs.length;
    console.log("numEdges: "+numEdges)
    for (var x=0;x<30;x++) {
        await timeout(20);
        console.log("step "+x)
        for (var n=0;n<numEdges;n++) {
            var edgeID = aEdgeIDs[n];
            var edge = edges.get(edgeID);
            var nextEdge_nodeFrom_slug = edge.from;
            var nextEdge_nodeTo_slug = edge.to;
            var nextEdge_relationshipType_slug = edge.relationshipType;
            if (nextEdge_relationshipType_slug=="isASubsetOf") {
                // console.log("isASubsetOf ")
                var oNodeFrom = nodes.get(nextEdge_nodeFrom_slug);
                var oNodeTo = nodes.get(nextEdge_nodeTo_slug);

                var xFromCurrent = oNodeFrom.x;
                var yFromCurrent = oNodeFrom.y;

                var xToCurrent = oNodeTo.x;
                var yToCurrent = oNodeTo.y;

                var xCurrentSeparation = xToCurrent - xFromCurrent;
                var yCurrentSeparation = yToCurrent - yFromCurrent;

                var xGoal = 50;
                var yGoal = 300;

                var xIncrement = (xGoal - xCurrentSeparation) / 10;
                var yIncrement = (yGoal - yCurrentSeparation) / 10;

                console.log("xIncrement: "+xIncrement+"; yIncrement: "+yIncrement+"xCurrentSeparation: "+xCurrentSeparation+"; yCurrentSeparation: "+yCurrentSeparation)

                oNodeTo.x += xIncrement;
                oNodeTo.y += yIncrement;

                oNodeFrom.x -= xIncrement;
                oNodeFrom.y -= yIncrement;

                nodes.update(oNodeTo);
                nodes.update(oNodeFrom);
            }
            if (nextEdge_relationshipType_slug=="isARealizationOf") {
                console.log("isARealizationOf ")
                var oNodeFrom = nodes.get(nextEdge_nodeFrom_slug);
                var oNodeTo = nodes.get(nextEdge_nodeTo_slug);

                var xFromCurrent = oNodeFrom.x;
                var yFromCurrent = oNodeFrom.y;

                var xToCurrent = oNodeTo.x;
                var yToCurrent = oNodeTo.y;

                var xCurrentSeparation = xToCurrent - xFromCurrent;
                var yCurrentSeparation = yToCurrent - yFromCurrent;

                var xGoal = -200;
                var yGoal = 250;

                var xIncrement = (xGoal - xCurrentSeparation) / 10;
                var yIncrement = (yGoal - yCurrentSeparation) / 10;

                console.log("xIncrement: "+xIncrement+"; yIncrement: "+yIncrement+"xCurrentSeparation: "+xCurrentSeparation+"; yCurrentSeparation: "+yCurrentSeparation)

                oNodeTo.x += xIncrement;
                oNodeTo.y += yIncrement;

                oNodeFrom.x -= xIncrement;
                oNodeFrom.y -= yIncrement;

                nodes.update(oNodeTo);
                nodes.update(oNodeFrom);
            }
        }
    }
    for (var x=0;x<30;x++) {
        await timeout(20);
        console.log("step "+x)
        // if nodes overlap, separate them along the x-axis
        for (var n1=0;n1<numNodes;n1++) {
            var node1ID = aNodeIDs[n1];
            for (var n2=0;n2<numNodes;n2++) {
                var node2ID = aNodeIDs[n2];

                var oNode1 = nodes.get(node1ID);
                var oNode2 = nodes.get(node2ID);

                var xNode1 = oNode1.x;
                var yNode1 = oNode1.y;

                var xNode2 = oNode2.x;
                var yNode2 = oNode2.y;

                var xDistAbs = Math.abs(xNode2 - xNode1);
                var yDistAbs = Math.abs(yNode2 - yNode1);

                var cutoff = 40;
                var increment = 2;
                if ( (xDistAbs < cutoff) && (yDistAbs < cutoff) )  {
                    // var randInt = Math.floor(Math.random()*10);
                    if (xNode1 < xNode2) {
                        oNode1.x -= increment;
                        oNode2.x += increment;
                    } else {
                        oNode1.x += increment;
                        oNode2.x -= increment;
                    }

                    nodes.update(oNode1);
                    nodes.update(oNode2);
                }
            }
        }
    }
}

// make graph from schema of type: plain schema or conceptSchema
// copied from addANewConcept.js
export function makeVisGraph_ConceptGraphMainSchema(schemaSlug,networkElemID) {
    console.log("schemaSlug: "+schemaSlug)
    var schema_rF_obj = JSON.parse(JSON.stringify(window.lookupWordBySlug[schemaSlug]));
    var schema_nodes_obj = schema_rF_obj.schemaData.nodes;
    var schema_rels_obj = schema_rF_obj.schemaData.relationships;
    var numNodes = schema_nodes_obj.length;
    var numRels = schema_rels_obj.length;

    var nextNode_obj = {};
    var nextEdge_obj = {};
    var nodes_arr = [];
    var edges_arr = [];
    var nodes_slugs_arr = [];
    var numSets = 0;

    for (var n=0;n<numNodes;n++) {
        var nextNode_obj = schema_nodes_obj[n];
        var nextNode_slug = nextNode_obj.slug;
        var nextNode_rF_obj = window.lookupWordBySlug[nextNode_slug];
        var nextNode_wordType = nextNode_rF_obj.wordData.wordType;
        var nextNode_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;
        var nextNode_x = Math.floor(Math.random() * 100) - 50;
        var nextNode_y = Math.floor(Math.random() * 100) - 50;
        var nextNode_conceptRole = nextNode_wordType;

        var interval = 200;

        var showNode = true;
        var physics = false;

        if (showNode) {
            var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_slug, slug: nextNode_slug, title: nextNode_slug, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: physics, x: nextNode_x, y: nextNode_y }
            nodes_arr.push(nextNode_vis_obj)
            nodes_slugs_arr.push(nextNode_slug)
        }
    }

    for (var n=0;n<numRels;n++) {
        var nextRel_obj = schema_rels_obj[n];
        var nextRel_nF_slug = nextRel_obj.nodeFrom.slug;
        var nextRel_rT_slug = nextRel_obj.relationshipType.slug;
        var nextRel_nT_slug = nextRel_obj.nodeTo.slug;
        var relationshipStringified = JSON.stringify(nextRel_obj);
        if ( (jQuery.inArray(nextRel_nF_slug,nodes_slugs_arr) > -1) && (jQuery.inArray(nextRel_nT_slug,nodes_slugs_arr) > -1) ) {
            var nextRel_vis_obj = { from: nextRel_nF_slug, to: nextRel_nT_slug, nodeA: nextRel_nF_slug, nodeB: nextRel_nT_slug, relationshipType: nextRel_rT_slug, relationshipStringified:relationshipStringified }
            edges_arr = addEdgeWithStyling_visjsfunctions(edges_arr,nextRel_vis_obj);
        }
        // edges_arr.push(nextRel_vis_obj)
    }

    nodes = new DataSet(nodes_arr);
    edges = new DataSet(edges_arr);
    data = {
        nodes,
        edges
    };
    ReactDOM.render(<VisNetwork_ConceptGraphMainSchema clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        document.getElementById(networkElemID)
    )
    reorganizeSchema_ConceptGraphMainSchema();
}

export default class AllC2CRelationshipsGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var thisPageTableName = "unknown";
        var currCgID = window.currentConceptGraphSqlID;
        console.log("currCgID: "+currCgID)
        var conceptGraphMainSchemaSlug = window.aLookupConceptGraphInfoBySqlID[currCgID].mainSchema_slug;

        /*
        var oConceptGraphMainSchema = window.lookupWordBySlug[conceptGraphMainSchemaSlug];
        var aRels = oConceptGraphMainSchema.schemaData.relationships;
        var numRels = aRels.length;
        var c2cRelsDataSet = [];
        for (var r=0;r<numRels;r++) {
            var oNextRel = aRels[r];
            var aNextPattern = [];
            aNextPattern = ["",r,
                oNextRel.nodeFrom.slug,
                oNextRel.relationshipType.slug,
                oNextRel.nodeTo.slug
            ];
            c2cRelsDataSet.push(aNextPattern);
        }

        var currentConceptSqlID = window.currentConceptSqlID;
        var currentConceptSlug = window.aLookupConceptInfoBySqlID[currentConceptSqlID].slug
        var oCurrentConcept = window.lookupWordBySlug[currentConceptSlug];
        var schemaSlug = oCurrentConcept.conceptData.nodes.schema.slug;
        */

        var networkElemID = "mainSchemaGraphElemID";

        makeVisGraph_ConceptGraphMainSchema(conceptGraphMainSchemaSlug,networkElemID)

    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">All C2C Relationships (Graph)</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>

                        <div id="leftColumn" style={{display:"inline-block"}}>
                            <div id="mainSchemaGraphElemID"
                                style={{display:"inline-block",width:"700px",height:"800px",border:"1px dashed grey"}}
                                >
                                networkElemID
                            </div>
                        </div>
                    </div>

                </fieldset>
            </>
        );
    }
}
