import React, { useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/singleConcept_leftNav2.js';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import * as InitDOMFunctions from '../../../../../functions/transferSqlToDOM.js';
// import sendAsync from '../../../../../renderer.js';
import * as VisStyleConstants from '../../../../../lib/visjs/visjs-style';

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

var options = VisStyleConstants.options_vis_mainSchema;

export var network = {};

var data = {
    nodes,
    edges
};

export const VisNetwork_MainSchema = () => {

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

export async function reorganizeSchema_MainSchema() {
    var aNodeIDs = nodes.getIds();
    var numNodes = aNodeIDs.length;
    console.log("numNodes: "+numNodes)

    var interval = 200;

    var aEdgeIDs = edges.getIds();
    var numEdges = aEdgeIDs.length;
    console.log("numEdges: "+numEdges)
    for (var x=0;x<30;x++) {
        await timeout(20);
        console.log("step "+x)
        for (var n=0;n<numEdges;n++) {
            var edgeID = aEdgeIDs[n];
            var edge = edges.get(edgeID);
            // nodeFrom / nodeTo reversed ??????
            var nextEdge_nodeFrom_slug = edge.to;
            var nextEdge_nodeTo_slug = edge.from;
            var nextEdge_relationshipType_slug = edge.relationshipType;
            if ((nextEdge_relationshipType_slug=="isASubsetOf") || (nextEdge_relationshipType_slug=="isASpecificInstanceOf")) {
                console.log("isASubsetOf or isASubsetOf")
                var oNodeFrom = nodes.get(nextEdge_nodeFrom_slug);
                var oNodeTo = nodes.get(nextEdge_nodeTo_slug);

                var nodeFromConceptRole = oNodeFrom.conceptRole;
                var nodeToConceptRole = oNodeTo.conceptRole;

                var nodeFromSlug = oNodeFrom.slug;
                var nodeToSlug = oNodeTo.slug;

                if (nodeFromConceptRole=="tree") {
                    console.log("tree ")
                    var nodeFrom_y = oNodeFrom.y;
                    var nodeTo_y = oNodeTo.y;

                    var nodeFrom_y_target = nodeTo_y + interval;

                    var nodeFrom_y_increment = Math.floor(0.1 * (nodeFrom_y_target - nodeFrom_y));

                    oNodeFrom.y += nodeFrom_y_increment

                    nodes.update(oNodeFrom);
                    network.current.fit();
                    console.log("updating nodeFromSlug: "+nodeFromSlug+"; nodeToSlug: "+nodeToSlug+"; nodeFrom_y: "+nodeFrom_y+"; nodeTo_y: "+nodeTo_y+"; nodeFrom_y_increment: "+nodeFrom_y_increment)
                }
            }
        }
    }
    for (var x=0;x<30;x++) {
        await timeout(20);

        for (var n1=0;n1<numNodes;n1++) {
            var node1ID = aNodeIDs[n1];
            for (var n2=0;n2<numNodes;n2++) {
                if (n1 != n2) {
                    var node2ID = aNodeIDs[n2];

                    var oNode1 = nodes.get(node1ID);
                    var oNode2 = nodes.get(node2ID);

                    var node1ConceptRole = oNode1.conceptRole;
                    var node2ConceptRole = oNode2.conceptRole;

                    if ( (node1ConceptRole == "tree") && (node2ConceptRole == "tree") ) {
                        var xNode1 = oNode1.x;
                        var yNode1 = oNode1.y;

                        var xNode2 = oNode2.x;
                        var yNode2 = oNode2.y;

                        var xDistAbs = Math.abs(xNode2 - xNode1);
                        var yDistAbs = Math.abs(yNode2 - yNode1);

                        var cutoff = 200;
                        // var increment = Math.floor(Math.abs(xDistAbs * 0.1));
                        var increment = 20;
                        if ( (xDistAbs < cutoff) && (yDistAbs < 10) )  {
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
                            network.current.fit();
                        }
                    }
                }
            }
        }

        /*
        for (var n1=0;n1<numNodes;n1++){
            for (var n2=0;n2<numNodes;n2++){
                if (n1 != n2) {
                    var node1ID = aNodeIDs[n1];
                    var node2ID = aNodeIDs[n2];

                    var oNode1 = nodes.get(node1ID);
                    var oNode2 = nodes.get(node2ID);

                    var node1ConceptRole = oNode1.conceptRole;
                    var node2ConceptRole = oNode2.conceptRole;

                    if ( (node1ConceptRole == "tree") && (node2ConceptRole == "tree") ) {
                        var node1_x = oNode1.x;
                        var node2_x = oNode2.x;

                        var node1_y = oNode1.y;
                        var node2_y = oNode2.y;

                        var deltaY = Math.abs(node2_y - node1_y);

                        if (deltaY < 50) {
                            var deltaX = node2_x - node1_x;
                            var incrementX = Math.floor(0.1 * (200 - deltaX));

                            // oNode1.x -= incrementX;
                            oNode2.x += incrementX;

                            nodes.update(oNode1);
                            nodes.update(oNode2);
                        }
                    }
                }
            }
        }
        */
    }

    // network.current.fit();
}

// make graph from schema of type: plain schema or conceptSchema
// copied from addANewConcept.js
export function makeVisGraph_MainSchema(schemaSlug,networkElemID) {
    var currentConceptSqlID = window.currentConceptSqlID;
    var governingConceptSlug = window.aLookupConceptInfoBySqlID[currentConceptSqlID].slug
    jQuery("#depictedSchema_bepm").html(schemaSlug)
    var schema_rF_obj = JSON.parse(JSON.stringify(window.lookupWordBySlug[schemaSlug]));
    var schema_nodes_obj = schema_rF_obj.schemaData.nodes;
    var schema_rels_obj = schema_rF_obj.schemaData.relationships;
    var numNodes = schema_nodes_obj.length;
    var numRels = schema_rels_obj.length;

    // make sure no node is duplicated
    var aSchemaNodes = [];
    var aSchemaSlugs = [];
    for (var n=0;n<schema_nodes_obj.length;n++) {
        var nextNode_obj = schema_nodes_obj[n];
        var nextNode_slug = nextNode_obj.slug;
        if (!aSchemaSlugs.includes(nextNode_slug)) {
            aSchemaNodes.push(nextNode_obj)
            aSchemaSlugs.push(nextNode_slug)
        }
    }

    var nextNode_obj = {};
    var nextEdge_obj = {};
    var nodes_arr = [];
    var edges_arr = [];
    var nodes_slugs_arr = [];
    var numSets = 0;
    // { id: aW_wordType_slug, label: aW_wordType_slug, conceptRole: 'wordType', group: 'wordType', x:0, y:0, physics:false },
    // nextEdge_obj = {from: aW_JSONSchema_slug, to: aW_wordType_slug, nodeA: aW_JSONSchema_slug, nodeB: aW_wordType_slug, relationshipType: 'isTheJSONSchemaFor' };

    for (var n=0;n<aSchemaNodes.length;n++) {
        var nextNode_obj = aSchemaNodes[n];
        var nextNode_slug = nextNode_obj.slug;
        var nextNode_rF_obj = window.lookupWordBySlug[nextNode_slug];
        var nextNode_wordType = nextNode_rF_obj.wordData.wordType;
        var nextNode_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;
        // var nextNode_conceptRole = nextNode_wordType;
        var nextNode_conceptRole = "tree";
        try {
            if (nextNode_wordType=="superset") {
                if (nextNode_rF_obj.supersetData.metaData.governingConcept.slug==governingConceptSlug) {
                    nextNode_conceptRole = "superset";
                }
            }
            if (nextNode_wordType=="concept") {
                if (nextNode_slug == governingConceptSlug) {
                    nextNode_conceptRole = "concept";
                }
            }
            if (nextNode_wordType=="wordType") {
                if (nextNode_rF_obj.wordTypeData.metaData.governingConcept.slug==governingConceptSlug) {
                    nextNode_conceptRole = "wordType";
                }
            }
            if (nextNode_wordType=="JSONSchema") {
                if (nextNode_rF_obj.JSONSchemaData.metaData.governingConcept.slug==governingConceptSlug) {
                    nextNode_conceptRole = "JSONSchema";
                }
            }
            if (nextNode_wordType=="schema") {
                if (nextNode_rF_obj.schemaData.metaData.governingConcept.slug==governingConceptSlug) {
                    if (jQuery.inArray("propertySchema",nextNode_rF_obj.schemaData.metaData.types) > -1 ) {
                        nextNode_conceptRole = "propertySchema";
                    }
                    if (jQuery.inArray("conceptRelationships",nextNode_rF_obj.schemaData.metaData.types) > -1 ) {
                        nextNode_conceptRole = "mainSchema";
                    }
                }
            }
            if (nextNode_wordType=="property") {
                if (jQuery.inArray("primaryProperty",nextNode_rF_obj.propertyData.metaData.types) > -1 ) {
                    nextNode_conceptRole = "primaryProperty";
                }
            }
            if (nextNode_wordType=="set") {
                if (jQuery.inArray("mainPropertiesSet",nextNode_rF_obj.setData.metaData.types) > -1 ) {
                    nextNode_conceptRole = "properties";
                }
            }
        } catch (e) {}

        // nextNode_x = -300;
        // nextNode_y = -300 + 100 * n;

        var interval = 200;

        var nextNode_x = Math.floor(Math.random() * interval * 2) - interval;
        var nextNode_y = interval * 2;

        var showNode = true;
        var physics = false;

        if (nextNode_conceptRole=="properties") {
            nextNode_x = interval;
            nextNode_y = 0;
            showNode = true;
            physics = false;
        }
        if (nextNode_conceptRole=="propertySchema") {
            nextNode_x = interval;
            nextNode_y = -interval;
            showNode = true;
            physics = false;
        }
        if (nextNode_conceptRole=="primaryProperty") {
            nextNode_x = -interval;
            nextNode_y = interval;
            showNode = true;
            physics = false;
        }
        if (nextNode_conceptRole=="mainSchema") {
            nextNode_x = -interval;
            nextNode_y = -interval;
            showNode = true;
            physics = false;
        }
        if (nextNode_conceptRole=="JSONSchema") {
            nextNode_x = -interval;
            nextNode_y = 0;
            showNode = true;
            physics = false;
        }
        if (nextNode_conceptRole=="wordType") {
            nextNode_x = 0;
            nextNode_y = 0;
            showNode = true;
            physics = false;
        }
        if (nextNode_conceptRole=="superset") {
            nextNode_x = 0;
            nextNode_y = interval;
            showNode = true;
            physics = false;
        }
        if (nextNode_conceptRole=="concept") {
            nextNode_x = 0;
            nextNode_y = -interval;
            showNode = true;
            physics = false;
        }
        /*
        if (nextNode_conceptRole=="set") {
            nextNode_x = -3*interval + 2.5*interval * numSets;
            numSets++;
            nextNode_y = 3*interval;
            showNode = true;
            physics = false;
        }
        */
        if (nextNode_conceptRole=="enumeration") {
            showNode = false;
        }
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
    ReactDOM.render(<VisNetwork_MainSchema clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        document.getElementById(networkElemID)
    )
    reorganizeSchema_MainSchema();
}

export default class SingleConceptMainSchemaTreeGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        /*
        // moving this to the neuroCore component
        if (!window.initDOMFunctionsComplete) {
            var b = await InitDOMFunctions.loadSqlToDOM()
            timeout(100)
        }
        */

        var networkElemID = "mainSchemaGraphElemID";
        var currentConceptSqlID = window.currentConceptSqlID;
        var currentConceptSlug = window.aLookupConceptInfoBySqlID[currentConceptSqlID].slug
        var oCurrentConcept = window.lookupWordBySlug[currentConceptSlug];
        var schemaSlug = oCurrentConcept.conceptData.nodes.schema.slug;
        makeVisGraph_MainSchema(schemaSlug,networkElemID)
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Single Concept Main Schema Tree Graph</div>

                        <div id="leftColumn" style={{display:"inline-block"}}>
                            <div id="mainSchemaGraphElemID"
                                style={{display:"inline-block",width:"700px",height:"800px",border:"1px dashed grey"}}
                                >
                                networkElemID
                            </div>
                        </div>

                        <div id="wordInfoContainer"
                            style={{display:"inline-block",width:"550px",border:"1px dashed grey",padding:"10px"}}
                            >
                            <center>Selected Word Info</center>
                            selected word slug:<br/>
                            <div id="selectedWordSlugElem" className="divStyleF" >?</div>
                            <br/>
                            selected word rawFile:<br/>
                            <textarea id="selectedWordRawFileTextarea" style={{width:"500px",height:"700px"}} ></textarea>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
