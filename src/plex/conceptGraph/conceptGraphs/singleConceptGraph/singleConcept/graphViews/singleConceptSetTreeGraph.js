import React, { useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
// import { Link } from "react-router-dom";
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

export const VisNetwork_Sets = () => {
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
        });
        network.current.on("deselectEdge",function(params){
        });

        // NODES
        network.current.on("doubleClick",function(params){
        });
        network.current.on("selectNode",function(params){
            var nodes_arr = params.nodes;
            var numNodes = nodes_arr.length;
            if (numNodes==1) {
                var nodeID = nodes_arr[0];
                var node = nodes.get(nodeID);
                var node_slug = node.slug;
                highlightThisSet(node_slug)
                // jQuery(".singleSetContainer").css("background-color","#EFEFEF");
                // jQuery("#singleSetContainer_"+node_slug).css("background-color","green");
            }
        });
        network.current.on("deselectNode",function(params){
            highlightNoSet();
        });
      },
      [domNode, network, data, options]
    );

    return (
      <div style={{height:"100%",width:"100%"}} ref = { domNode } />
    );
}

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

const makeVisGraph_SetsOnly = (schemaSlug,networkElemID) => {
    var nodes_arr = [];
    var edges_arr = [];

    var currentConceptSqlID = window.currentConceptSqlID;
    var currentConceptSlug = window.aLookupConceptInfoBySqlID[currentConceptSqlID].slug
    var oCurrentConcept = window.lookupWordBySlug[currentConceptSlug];
    var supersetSlug = oCurrentConcept.conceptData.nodes.superset.slug;
    var oSchema = window.lookupWordBySlug[schemaSlug];
    var aNodes = oSchema.schemaData.nodes;
    var aRels = oSchema.schemaData.relationships;



/*
    var nextNode_slug = supersetSlug;
    var nextNode_wordType = "superset";
    var nextNode_conceptRole = "superset";
    var nextNode_x = 0;
    var nextNode_y = 0;
    var physics = false;
    var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_slug, slug: nextNode_slug, title: nextNode_slug, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: physics, x: nextNode_x, y: nextNode_y }
    nodes_arr.push(nextNode_vis_obj)
*/
    var aNodesToInclude = [];
    for (var r=0;r<aRels.length;r++) {
        var oNextRel = aRels[r];
        var rT_slug = oNextRel.relationshipType.slug;
        if (rT_slug=="subsetOf") {
            var nF_slug = oNextRel.nodeFrom.slug;
            var nT_slug = oNextRel.nodeTo.slug;
            if (!aNodesToInclude.includes(nF_slug)) {
                aNodesToInclude.push(nF_slug)
            }
            if (!aNodesToInclude.includes(nT_slug)) {
                aNodesToInclude.push(nT_slug)
            }
        }
    }

    console.log("aNodesToInclude before: "+JSON.stringify(aNodesToInclude,null,4))
    // cycle through schema_nodes_obj and put supersetFor_(this concept) at the top of the list,
    // and wordTypeFor_(this concept) next, then everything else after that.
    // This affects how it is displayed when doing hierarchical layout.
    var aSchemaNodes1 = [];
    var aSchemaNodes2 = [];
    var aSchemaNodes3 = [];
    var aSchemaNodes = [];
    for (var n=0;n<aNodesToInclude.length;n++) {
        // var nextNode_obj = aNodesToInclude[n];
        // var nextNode_slug = nextNode_obj.slug;
        var nextNode_slug = aNodesToInclude[n];
        var oNextNode = window.lookupWordBySlug[nextNode_slug];
        var inNode1or2 = false;
        if (oNextNode.hasOwnProperty("supersetData")) {
            if (oNextNode.supersetData.metaData.governingConcept.slug==currentConceptSlug) {
                aSchemaNodes1.push(nextNode_slug)
                inNode1or2 = true;
            }
        }
        if (oNextNode.hasOwnProperty("wordTypeData")) {
            if (oNextNode.wordTypeData.metaData.governingConcept.slug==currentConceptSlug) {
                aSchemaNodes2.push(nextNode_slug)
                inNode1or2 = true;
            }
        }
        if (!inNode1or2) {
            aSchemaNodes3.push(nextNode_slug)
        }
    }
    aNodesToInclude = jQuery.merge(aSchemaNodes1,aSchemaNodes2)
    aNodesToInclude = jQuery.merge(aNodesToInclude,aSchemaNodes3)
    console.log("aNodesToInclude after: "+JSON.stringify(aNodesToInclude,null,4)+"; aSchemaNodes1: "+JSON.stringify(aSchemaNodes1,null,4)+"; aSchemaNodes2: "+JSON.stringify(aSchemaNodes2,null,4)+"; aSchemaNodes3: "+JSON.stringify(aSchemaNodes3,null,4))

    for (var n=0;n<aNodesToInclude.length;n++) {
        var nextNode_slug = aNodesToInclude[n];
        var oNode = window.lookupWordBySlug[nextNode_slug];
        var nextNode_wordType = "word";
        // var nextNode_conceptRole = "word";
        var nextNode_group = "word";
        var nextNode_description = "";
        if (oNode.wordData.hasOwnProperty("description")) {
            nextNode_description = oNode.wordData.description;
        }
        if (oNode.wordData.wordTypes.includes("superset")) {
            nextNode_wordType = "superset";
            // nextNode_conceptRole = "superset";
            nextNode_group = "superset";
            if (oNode.supersetData.hasOwnProperty("description")) {
                nextNode_description = oNode.supersetData.description;
            }
        }
        if (oNode.wordData.wordTypes.includes("set")) {
            nextNode_wordType = "set";
            // nextNode_conceptRole = "set";
            nextNode_group = "set";
            if (oNode.setData.hasOwnProperty("description")) {
                nextNode_description = oNode.setData.description;
            }
            if (oNode.setData.metaData.types.includes("organizedBy")) {
                var nextNode_group = "set_organizedBy";
            }
        }
        var nextNode_name = oNode.wordData.name;
        var nextNode_VSTitle = nextNode_name;
        nextNode_VSTitle += "\n" + nextNode_slug;
        nextNode_VSTitle += "\n" + nextNode_description;
        var nextNode_label = nextNode_name;
        var physics = true;
        var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_label, slug: nextNode_slug, title: nextNode_VSTitle, group: nextNode_group, physics: physics}
        nodes_arr.push(nextNode_vis_obj)
    }
    for (var r=0;r<aRels.length;r++) {
        var oNextRel = aRels[r];
        var nextRel_nF_slug = oNextRel.nodeFrom.slug;
        var nextRel_rT_slug = oNextRel.relationshipType.slug;
        var nextRel_nT_slug = oNextRel.nodeTo.slug;
        var relationshipStringified = JSON.stringify(oNextRel);
        var nextRel_vis_obj = { from: nextRel_nF_slug, to: nextRel_nT_slug, nodeA: nextRel_nF_slug, nodeB: nextRel_nT_slug, relationshipType: nextRel_rT_slug, relationshipStringified:relationshipStringified }
        edges_arr = addEdgeWithStyling_visjsfunctions(edges_arr,nextRel_vis_obj);
    }

    nodes = new DataSet(nodes_arr);
    edges = new DataSet(edges_arr);
    data = {
        nodes,
        edges
    };
    ReactDOM.render(<VisNetwork_Sets clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        document.getElementById(networkElemID)
    )
}

const addNodeToSetsList = (slug) => {
    var nodeHTML = "";
    nodeHTML += "<div id='singleSetContainer_"+slug+"' class='singleSetContainer' data-slug='"+slug+"' style='border:1px solid black;margin-bottom:2px;' >";
    nodeHTML += slug;
    nodeHTML += "</div>";
    jQuery("#setsListContainer").append(nodeHTML)
}

const addNodeToSpecificInstancesList = (slug) => {
    var oWord = window.lookupWordBySlug[slug];
    var name = oWord.wordData.name;
    var nodeHTML = "";
    nodeHTML += "<div style='margin-bottom:2px;' >";
        nodeHTML += "<div id='singleSpecificInstanceCheckbox_"+slug+"' class='singleSpecificInstanceCheckbox' data-status='unchecked' data-slug='"+slug+"' style='border:1px solid black;margin-bottom:2px;width:12%;display:inline-block;text-align:center;' >";
        nodeHTML += "X";
        nodeHTML += "</div>";

        nodeHTML += "<div id='singleSpecificInstanceContainer_"+slug+"' class='singleSpecificInstanceContainer' data-slug='"+slug+"' style='border:1px solid black;margin-left:5px;width:80%;display:inline-block;' >";
        nodeHTML += name;
        nodeHTML += "</div>";
    nodeHTML += "</div>";
    jQuery("#specificInstancesListContainer").append(nodeHTML)
}

const highlightNoSet = () => {
    jQuery(".singleSpecificInstanceContainer").css("background-color","#EFEFEF")
    jQuery(".singleSetContainer").css("background-color","#EFEFEF")

    jQuery("#clickedWordContainer").val("")
    jQuery("#selectedSetContainer").html("")
}
const highlightThisSet = (set_slug) => {
    jQuery(".singleSpecificInstanceContainer").css("background-color","#EFEFEF")
    jQuery(".singleSetContainer").css("background-color","#EFEFEF")
    jQuery("#singleSetContainer_"+set_slug).css("background-color","green")

    jQuery("#selectedSetContainer").html(set_slug)

    var oSet = window.lookupWordBySlug[set_slug];
    var sSet = JSON.stringify(oSet,null,4);
    jQuery("#clickedWordContainer").val(sSet)

    var aSpecificInstances = oSet.globalDynamicData.specificInstances;
    for (var s=0;s<aSpecificInstances.length;s++) {
        var nextSi_slug = aSpecificInstances[s];
        jQuery("#singleSpecificInstanceContainer_"+nextSi_slug).css("background-color","orange")
    }
}

export default class SingleConceptSetTreeGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var currentConceptSqlID = window.currentConceptSqlID;
        var currentConceptSlug = window.aLookupConceptInfoBySqlID[currentConceptSqlID].slug
        var oCurrentConcept = window.lookupWordBySlug[currentConceptSlug];
        var supersetSlug = oCurrentConcept.conceptData.nodes.superset.slug;
        addNodeToSetsList(supersetSlug);
        var schemaSlug = oCurrentConcept.conceptData.nodes.schema.slug;
        var oSchema = window.lookupWordBySlug[schemaSlug];
        var networkElemID = "setsGraphElemID";
        makeVisGraph_SetsOnly(schemaSlug,networkElemID);
        var aNodes = oSchema.schemaData.nodes;
        for (var n=0;n<aNodes.length;n++) {
            var word_slug = aNodes[n].slug;
            var oWord = window.lookupWordBySlug[word_slug];
            if (oWord.wordData.wordTypes.includes("set")) {
                if (oWord.setData.metaData.governingConcepts.includes(currentConceptSlug)) {
                    addNodeToSetsList(word_slug);
                }
            }
        }
        var oSuperset = window.lookupWordBySlug[supersetSlug];
        var aSpecificInstances = oSuperset.globalDynamicData.specificInstances;
        for (var s=0;s<aSpecificInstances.length;s++) {
            var si_slug = aSpecificInstances[s];
            addNodeToSpecificInstancesList(si_slug);
        }
        jQuery(".singleSetContainer").click(function(){
            var set_slug = jQuery(this).data("slug");
            highlightThisSet(set_slug)
        })
        jQuery(".singleSpecificInstanceContainer").click(function(){
            jQuery(".singleSpecificInstanceContainer").css("background-color","#EFEFEF")
            jQuery(".singleSetContainer").css("background-color","#EFEFEF")
            jQuery(this).css("background-color","green")
            var si_slug = jQuery(this).data("slug");
            var oSi = window.lookupWordBySlug[si_slug];
            var sSi = JSON.stringify(oSi,null,4)
            jQuery("#clickedWordContainer").val(sSi)
        })
        jQuery(".singleSpecificInstanceCheckbox").click(function(){
            var currStatus = jQuery(this).data("status");
            if (currStatus=="unchecked") {
                jQuery(this).data("status","checked");
                jQuery(this).css("background-color","green")
            }
            if (currStatus=="checked") {
                jQuery(this).data("status","unchecked");
                jQuery(this).css("background-color","#EFEFEF")
            }
            var si_slug = jQuery(this).data("slug");
            var oSi = window.lookupWordBySlug[si_slug];
        })
        jQuery("#updateClickedWordButton").click(function(){
            var sWord = jQuery("#clickedWordContainer").val()
            var oWord = JSON.parse(sWord);
            MiscFunctions.createOrUpdateWordInAllTables(oWord)
        })
        jQuery("#add_isASpecificInstance_rels_button").click(function(){
            var parentSet_slug = jQuery("#selectedSetContainer").html();
            var oSchema_updated = MiscFunctions.cloneObj(oSchema);
            jQuery(".singleSpecificInstanceCheckbox").each(function(){
                var currStatus = jQuery(this).data("status")
                var si_slug = jQuery(this).data("slug")
                // console.log("add_isASpecificInstance_rels_button; si_slug: "+si_slug+"; currStatus: "+currStatus)
                if (currStatus=="checked") {
                    var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                    oNewRel.relationshipType.slug = "isASpecificInstanceOf";
                    oNewRel.nodeFrom.slug = si_slug;
                    oNewRel.nodeTo.slug = parentSet_slug;
                    var sNewRel = JSON.stringify(oNewRel,null,4);
                    // console.log("add_isASpecificInstance_rels_button; sNewRel: "+sNewRel)
                    oSchema_updated = MiscFunctions.updateSchemaWithNewRel(oSchema_updated,oNewRel,window.lookupWordBySlug);
                }
            })
            var sSchema_updated = JSON.stringify(oSchema_updated,null,4);
            var sSchema = JSON.stringify(oSchema,null,4);
            // console.log("add_isASpecificInstance_rels_button unedited: "+sSchema);
            // console.log("add_isASpecificInstance_rels_button updated: "+sSchema_updated);
            MiscFunctions.createOrUpdateWordInAllTables(oSchema_updated);
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
                        <div class="h2">Single Concept Set Tree Graph</div>

                        <div id="setsGraphElemID" style={{display:"inline-block",width:"1400px",height:"800px",border:"1px dashed grey"}}>
                        graph view
                        </div>

                        <br/>

                        <div style={{display:"inline-block",width:"1400px",height:"1400px",border:"1px dashed grey"}}>
                            <div style={{display:"inline-block",width:"300px",height:"600px",border:"1px dashed grey"}}>
                                <center>Sets</center>
                                <div id="setsListContainer" style={{overflow:"scroll",height:"550px"}}></div>
                            </div>
                            <div style={{display:"inline-block",width:"300px",height:"600px",border:"1px dashed grey"}}>
                                <center>Specific Instances</center>
                                <div id="specificInstancesListContainer" style={{overflow:"scroll",height:"550px"}}></div>
                            </div>
                            <div style={{display:"inline-block",width:"500px",height:"600px",border:"1px dashed grey"}}>
                                <center>clicked word</center>
                                <div id="updateClickedWordButton" className="doSomethingButton" >update clicked word with what you see</div><br/>
                                <textarea id="clickedWordContainer" style={{width:"100%",height:"500px",overflow:"scroll"}}>clickedWordContainer</textarea>
                            </div>

                            <br/>

                            <div style={{display:"inline-block",width:"1400px",height:"190px",border:"1px dashed grey"}}>
                                clear all Loki-pathway related globalDynamicData from:<br/>
                                <div className="doSomethingButton" >all sets</div>
                                <div className="doSomethingButton" >selected sets only</div>
                                <br/>
                                <div className="doSomethingButton" >all specific instances</div>
                                <div className="doSomethingButton" >selected specific instances only</div>
                                <br/>
                                add isASPecificInstance relationship(s) between the selected set on the left (green)
                                (<div id="selectedSetContainer" style={{display:"inline-block"}}></div>)
                                and all selected specific instances on the right (green checkbox) <br/>
                                <div id="add_isASpecificInstance_rels_button" className="doSomethingButton" >add</div>
                                <br/>
                                sever all isASpecificInstance rels to the selected specific instances (green checkbox) <br/>
                                <div className="doSomethingButton" >sever</div>
                            </div>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
