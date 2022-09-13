import React, { useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/singleConcept_leftNav2.js';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import sendAsync from '../../../../../renderer.js';
import * as VisStyleConstants from '../../../../../lib/visjs/visjs-style';

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

var options = VisStyleConstants.options_vis_setsAndSpecificInstances;

export var network = {};

var data = {
    nodes,
    edges
};

export const VisNetwork_SetsAndSpecificInstances = () => {

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
                jQuery("#selectedEdgeIDContainer").html(edgeID)
            }
        });
        network.current.on("deselectEdge",function(params){
            jQuery("#selectedEdgeIDContainer").html("none")
        });

        // NODES
        network.current.on("doubleClick",function(params){
            // console.log("selectNode event triggered")
            /*
            var e = e || window.event;
            var dragX = e.mouseX, dragY = e.mouseY;
            console.log("X: "+dragX+" Y: "+dragY);
            */
            var nodes_arr = params.nodes;
            var numNodes = nodes_arr.length;
            if (numNodes==1) {
                var nodeID = nodes_arr[0];
                var node = nodes.get(nodeID);
                var currentPhysics = node.physics;
                if (currentPhysics==true) {
                    node.physics = false;
                    // a little bit of a hack to set these to undefined. Without doing this,
                    // node will revert back to its initial positions of x=0, y=0. Perhaps I should
                    // simply set x,y to undefined from the outset?
                    node.x = undefined;
                    node.y = undefined;
                }
                if (currentPhysics==false) {
                    node.physics = true;
                    // node.x = undefined;
                    // node.y = undefined;
                }

                /*
                node.allowedToMoveX = false;
                node.allowedToMoveY = false;
                var oPosition = nodes.getPosition(nodeID);
                console.log("x: "+oPosition.x+"; y: "+oPosition.y)
                node.x = oPosition.x;
                node.y = oPosition.y;
                */
                nodes.update(node);
            }
        });
        network.current.on("selectNode",function(params){
            // console.log("selectNode event triggered")
            var nodes_arr = params.nodes;
            var numNodes = nodes_arr.length;
            if (numNodes==1) {
                var nodeID = nodes_arr[0];
                jQuery("#selectedNodeIDContainer").html(nodeID)
                var oNode = window.lookupWordBySlug[nodeID];
                var sNode = JSON.stringify(oNode,null,4);
                jQuery("#selectedNodeRawFileTextarea").val(sNode)
            }
        });
        network.current.on("deselectNode",function(params){
            jQuery("#selectedNodeIDContainer").html("none")
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

export function reorganizeSchema_SetsAndSpecificInstances() {

}

// make graph from schema of type: plain schema or conceptSchema
// copied from addANewConcept.js
export function makeVisGraph_SetsAndSpecificInstances(schemaSlug,networkElemID) {
    var currentConceptSqlID = window.currentConceptSqlID;
    var governingConceptSlug = window.aLookupConceptInfoBySqlID[currentConceptSqlID].slug
    jQuery("#depictedSchema_bepm").html(schemaSlug)
    var schema_rF_obj = JSON.parse(JSON.stringify(window.lookupWordBySlug[schemaSlug]));
    var schema_nodes_obj = schema_rF_obj.schemaData.nodes;
    var schema_rels_obj = schema_rF_obj.schemaData.relationships;
    var numNodes = schema_nodes_obj.length;
    var numRels = schema_rels_obj.length;

    // cycle through schema_nodes_obj and put supersetFor_(this concept) at the top of the list,
    // and wordTypeFor_(this concept) next, then everything else after that.
    // This affects how it is displayed when doing hierarchical layout.
    var aSchemaNodes1 = [];
    var aSchemaNodes2 = [];
    var aSchemaNodes3 = [];
    var aSchemaNodes = [];
    var aSchemaNodeSlugs = [];
    for (var n=0;n<schema_nodes_obj.length;n++) {
        var nextNode_obj = schema_nodes_obj[n];
        var nextNode_slug = nextNode_obj.slug;
        var oNextNode = window.lookupWordBySlug[nextNode_slug];
        var inNode1or2 = false;
        // make sure not to include the same node more than once (mainly applicable for conceptFor_wordType and conceptFor_JSONSchema)
        if (!aSchemaNodeSlugs.includes(nextNode_slug)) {
            console.log("not_in_aSchemaNodeSlugs: "+nextNode_slug)
            if (oNextNode.hasOwnProperty("supersetData")) {
                if (oNextNode.supersetData.metaData.governingConcept.slug==governingConceptSlug) {
                    aSchemaNodes1.push(nextNode_obj)
                    aSchemaNodeSlugs.push(nextNode_slug)
                    console.log("add_to_aSchemaNodeSlugs 1: "+nextNode_slug)
                    inNode1or2 = true;
                }
            }
            if (oNextNode.hasOwnProperty("wordTypeData")) {
                if (oNextNode.wordTypeData.metaData.governingConcept.slug==governingConceptSlug) {
                    aSchemaNodes2.push(nextNode_obj)
                    aSchemaNodeSlugs.push(nextNode_slug)
                    console.log("add_to_aSchemaNodeSlugs 2: "+nextNode_slug)
                    inNode1or2 = true;
                }
            }
            if (!inNode1or2) {
                aSchemaNodes3.push(nextNode_obj)
                aSchemaNodeSlugs.push(nextNode_slug)
                console.log("add_to_aSchemaNodeSlugs 3: "+nextNode_slug)
            }
        }
    }
    // aSchemaNodes = jQuery.merge(aSchemaNodes1,aSchemaNodes2,aSchemaNodes3)
    console.log("aSchemaNodeSlugs after: "+JSON.stringify(aSchemaNodeSlugs,null,4))
    var aSchemaNodes = jQuery.merge(aSchemaNodes1,aSchemaNodes2)
    aSchemaNodes = jQuery.merge(aSchemaNodes,aSchemaNodes3)
    console.log("aSchemaNodes after: "+JSON.stringify(aSchemaNodes,null,4)+"; aSchemaNodes1: "+JSON.stringify(aSchemaNodes1,null,4)+"; aSchemaNodes2: "+JSON.stringify(aSchemaNodes2,null,4)+"; aSchemaNodes3: "+JSON.stringify(aSchemaNodes3,null,4))

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
        var nextNode_x = 0;
        var nextNode_y = 0;
        var nextNode_conceptRole = "tree";

        // var nextNode_conceptRole = nextNode_wordType;
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
                    nextNode_conceptRole = "schema";
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
            /*
            if (nextNode_wordType=="schema") {
                if (jQuery.inArray("propertySchema",nextNode_rF_obj.schemaData.metaData.types) > -1 ) {
                    nextNode_conceptRole = "propertySchema";
                }
            }
            if (nextNode_wordType=="property") {
                if (jQuery.inArray("primaryProperty",nextNode_rF_obj.propertyData.types) > -1 ) {
                    nextNode_conceptRole = "primaryProperty";
                }
            }
            if (nextNode_wordType=="set") {
                if (jQuery.inArray("mainPropertiesSet",nextNode_rF_obj.setData.metaData.types) > -1 ) {
                    nextNode_conceptRole = "properties";
                }
            }
            */
        } catch (e) {}

        // nextNode_x = -300;
        // nextNode_y = -300 + 100 * n;

        var showNode = true;
        var physics = false;

        var interval = 200;

        if (nextNode_conceptRole=="properties") {
            nextNode_x = interval;
            nextNode_y = 0;
            showNode = false;
            physics = false;
        }

        if (nextNode_conceptRole=="primaryProperty") {
            nextNode_x = -interval;
            nextNode_y = interval;
            showNode = false;
            physics = false;
        }
        if (nextNode_conceptRole=="schema") {
            nextNode_x = -interval;
            nextNode_y = -interval;
            showNode = true;
            physics = false;
        }
        if (nextNode_conceptRole=="mainSchema") {
            nextNode_x = interval;
            nextNode_y = -interval;
            showNode = false;
            physics = false;
        }
        if (nextNode_conceptRole=="propertySchema") {
            nextNode_x = interval;
            nextNode_y = -interval;
            showNode = false;
            physics = false;
        }
        if (nextNode_conceptRole=="JSONSchema") {
            nextNode_x = -interval;
            nextNode_y = 0;
            showNode = false;
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
            showNode = false;
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
    ReactDOM.render(<VisNetwork_SetsAndSpecificInstances clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        document.getElementById(networkElemID)
    )
    // reorganizeSchema_SetsAndSpecificInstances();
}

const updateMainSchema = () => {
    var sSchemaUnedited = jQuery("#mainSchemaRawFileUneditedTextarea").val();
    var oSchema = JSON.parse(sSchemaUnedited);
    oSchema.wordData.a="b";
    // first, eliminate every subsetOF and isASPecificInstanceOf from the schema
    oSchema = MiscFunctions.expungeFromSchemaAllRelsOfGivenType(oSchema,"subsetOf");
    oSchema = MiscFunctions.expungeFromSchemaAllRelsOfGivenType(oSchema,"isASpecificInstanceOf");
    // next, add back all subsetOf and isASpecificInstanceOf rels currently displayed on the graph
    var edgeIDs_arr = edges.getIds();
    var numEdges = edgeIDs_arr.length;
    for (var e=0;e<numEdges;e++) {
        var nextEdgeID = edgeIDs_arr[e];
        var edge = edges.get(nextEdgeID);
        // var nextEdge_nodeFrom_slug = edge.nodeA;
        // var nextEdge_nodeTo_slug = edge.nodeB;
        var nextEdge_nodeFrom_slug = edge.to;
        var nextEdge_nodeTo_slug = edge.from;
        var nextEdge_relationshipType_slug = edge.relationshipType;
        var oRel_obj = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
        // oRel_obj.nodeFrom.slug=edge.nodeA;
        // oRel_obj.nodeTo.slug=edge.nodeB;
        oRel_obj.nodeFrom.slug=edge.to;
        oRel_obj.nodeTo.slug=edge.from;
        if (nextEdge_relationshipType_slug=="subsetOf") {
            console.log("updateMainSchema; "+nextEdge_nodeFrom_slug+" - subsetOf - "+nextEdge_nodeTo_slug)
            oRel_obj.relationshipType.slug="subsetOf";
            oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oRel_obj,window.lookupWordBySlug)
        }
        if (nextEdge_relationshipType_slug=="isASpecificInstanceOf") {
            console.log("updateMainSchema; "+nextEdge_nodeFrom_slug+" - isASpecificInstanceOf - "+nextEdge_nodeTo_slug)
            oRel_obj.relationshipType.slug="isASpecificInstanceOf";
            oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oRel_obj,window.lookupWordBySlug)
        }
        // edges.update(edge);

        /*
        var nextEdge_relTypeDataStringified = edge.relationshipTypeStringified;
        var nextEdge_relTypeData_obj = JSON.parse(nextEdge_relTypeDataStringified);

        if ( (nodeFrom_slug==nextEdge_nodeFrom_slug)
            && (nodeTo_slug==nextEdge_nodeTo_slug)
            && (relType_slug==nextEdge_relationshipType_slug)
          ) {
              relAlreadyAdded = true;
          }
          */
    }
    // add pattern tag indicator to redo all Loki pathways that flow through this concept (or just redo them all?)
    var sSchemaEdited = JSON.stringify(oSchema,null,4);
    jQuery("#mainSchemaRawFileEditedTextarea").val(sSchemaEdited);
}

const changeEdge = (edgeID,relType) => {
    var edge = edges.get(edgeID);
    var nodeFrom_slug = edge.from;
    var nodeTo_slug = edge.to;
    var edgeToUpdate_obj = {};
    edgeToUpdate_obj.id=edgeID;
    edgeToUpdate_obj.relationshipType = relType;
    edgeToUpdate_obj.title = relType;
    edgeToUpdate_obj.label = relType;
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
    var nextRel_obj = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
    nextRel_obj.nodeFrom.slug = nodeFrom_slug
    nextRel_obj.relationshipType.slug = relType
    nextRel_obj.nodeTo.slug = nodeTo_slug;
    var relationshipStringified = JSON.stringify(nextRel_obj);
    edgeToUpdate_obj.relationshipStringified=relationshipStringified

    edges.update(edgeToUpdate_obj);

    updateMainSchema();
}
export default class SingleConceptSetAndSpecificInstanceTreeGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var networkElemID = "setsAndSpecificInstancesGraphElemID";
        var currentConceptSqlID = window.currentConceptSqlID;
        var currentConceptSlug = window.aLookupConceptInfoBySqlID[currentConceptSqlID].slug
        var oCurrentConcept = window.lookupWordBySlug[currentConceptSlug];
        var schemaSlug = oCurrentConcept.conceptData.nodes.schema.slug;
        makeVisGraph_SetsAndSpecificInstances(schemaSlug,networkElemID);
        var oSchema = window.lookupWordBySlug[schemaSlug];
        var sSchema = JSON.stringify(oSchema,null,4);
        jQuery("#mainSchemaRawFileUneditedTextarea").val(sSchema);
        updateMainSchema()
        jQuery("#saveMainSchemaInSqlButton").click(function(){
            updateMainSchema()
            var sSchemaEdited = jQuery("#mainSchemaRawFileEditedTextarea").val();
            var oSchemaEdited = JSON.parse(sSchemaEdited);
            console.log("saveMainSchemaInSqlButton clicked; sSchemaEdited: "+sSchemaEdited)
            MiscFunctions.createOrUpdateWordInAllTables(oSchemaEdited)
        })
        jQuery("#changeEdgeTo_subsetOf").click(function(){
            console.log("changeEdgeTo_subsetOf")
            var edgeID = jQuery("#selectedEdgeIDContainer").html();
            var relType = "subsetOf";
            changeEdge(edgeID,relType);
        })
        jQuery("#changeEdgeTo_isASpecificInstanceOf").click(function(){
            console.log("changeEdgeTo_subsetOf")
            var edgeID = jQuery("#selectedEdgeIDContainer").html();
            var relType = "isASpecificInstanceOf";
            changeEdge(edgeID,relType);
        })
        jQuery("#showSelectedNodeButton").click(function(){
            jQuery("#schemaContainer").css("display","none")
            jQuery("#selectedNodeContainer").css("display","inline-block")
        })
        jQuery("#showSchemaButton").click(function(){
            jQuery("#schemaContainer").css("display","inline-block")
            jQuery("#selectedNodeContainer").css("display","none")
        })
        jQuery("#updateSelectedNodeButton").click(function(){
            var sWord = jQuery("#selectedNodeRawFileTextarea").val();
            var oWord = JSON.parse(sWord);
            console.log("updateSelectedNodeButton clicked; sWord: "+sWord)
            MiscFunctions.createOrUpdateWordInAllTables(oWord)
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Single Concept Set and Specific Instance Tree Graph</div>

                        <div id="leftColumn" style={{display:"inline-block"}}>
                            selected edge ID: <div id="selectedEdgeIDContainer" style={{display:"inline-block"}}>none</div>
                            <br/>
                            selected node ID: <div id="selectedNodeIDContainer" style={{display:"inline-block"}}>none</div>
                            <br/>
                            change edge to:
                            <div id="changeEdgeTo_subsetOf" className="doSomethingButton">subsetOf</div>
                            <div id="changeEdgeTo_isASpecificInstanceOf" className="doSomethingButton">isASpecificInstanceOf</div>
                            <br/>
                            <div id="setsAndSpecificInstancesGraphElemID"
                                style={{display:"inline-block",width:"700px",height:"800px",border:"1px dashed grey"}}
                                >
                                networkElemID
                            </div>
                        </div>

                        <div id="rightColumn" style={{display:"inline-block"}}>
                            show:
                            <div id="showSelectedNodeButton" className="doSomethingButton">selected node</div>
                            <div id="showSchemaButton" className="doSomethingButton">main schema for this concept</div>
                            <br/>
                            <div id="schemaContainer" style={{display:"none",width:"600px",height:"800px",border:"1px dashed grey",padding:"5px"}} >
                                <div id="saveMainSchemaInSqlButton" className="doSomethingButton">UPDATE SCHEMA</div>
                                unedited<br/>
                                <textarea id="mainSchemaRawFileUneditedTextarea" style={{width:"90%",height:"300px"}} ></textarea>
                                <br/>
                                edited<br/>
                                <textarea id="mainSchemaRawFileEditedTextarea" style={{width:"90%",height:"300px"}} ></textarea>
                            </div>
                            <div id="selectedNodeContainer" style={{display:"inline-block",width:"600px",border:"1px dashed grey",padding:"5px"}} >
                                <div className="doSomethingButton" id="updateSelectedNodeButton">UPDATE</div>
                                <br/>
                                <textarea id="selectedNodeRawFileTextarea" style={{width:"90%",height:"900px"}} >selectedNodeRawFileUneditedTextarea</textarea>
                            </div>
                        </div>

                        <div id="rightColumn_deprecating" style={{display:"none"}}>
                            <center>deprecating this column</center>
                            <div id="setInfoContainer"
                                style={{display:"inline-block",width:"500px",height:"400px",border:"1px dashed grey",padding:"10px"}}
                                >
                                <center>Set Info</center>
                                set slug:<br/>
                                <div id="selectedSetInfoSlugElem" className="divStyleF" >?</div>
                                <br/>
                                set name:<br/>
                                <textarea id="selectedSetInfoNameTextarea" className="textareaStyleF" >?</textarea>
                                <br/>
                                set title:<br/>
                                <textarea id="selectedSetInfoTitleTextarea" className="textareaStyleF" >?</textarea>
                                <br/>
                                set description:<br/>
                                <textarea id="selectedSetInfoDescriptionTextarea" className="textareaStyleF" >?</textarea>
                                <br/>
                            </div>

                            <br/>

                            <div id="specificInstanceInfoContainer"
                                style={{display:"inline-block",width:"500px",height:"400px",border:"1px dashed grey",padding:"10px"}}
                                >
                                <center>Specific Instance Info</center>
                                specific instance slug:<br/>
                                <div id="selectedSpecificInstanceInfoSlugElem" className="divStyleF" >?</div>
                                <br/>
                                specific instance name:<br/>
                                <textarea id="selectedSpecificInstanceInfoNameTextarea" className="textareaStyleF" ></textarea>
                                <br/>
                                specific instance title:<br/>
                                <textarea id="selectedSpecificInstanceInfoTitleTextarea" className="textareaStyleF" ></textarea>
                                <br/>
                                specific instance description:<br/>
                                <textarea id="selectedSpecificInstanceInfoDescriptionTextarea" className="textareaStyleF" ></textarea>
                                <br/>
                            </div>

                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
