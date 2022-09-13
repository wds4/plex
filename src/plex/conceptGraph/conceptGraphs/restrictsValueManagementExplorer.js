import React, { useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/singleConceptGraph_leftNav2.js';
import JSONSchemaForm from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import * as MiscFunctions from '../../functions/miscFunctions.js';
import sendAsync from '../../renderer.js';
import * as VisStyleConstants from '../../lib/visjs/visjs-style';

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

var options = VisStyleConstants.options_vis_restrictsPropertyManagement;

export var network = {};

var data = {
    nodes,
    edges
};
var oActiveRVMByRole_reconstructed = MiscFunctions.cloneObj(window.restrictsValueManagement);
// may be deprecating these two vars in favor of oActiveRVMByRole_reconstructed
var oActiveRVMByRole1 = {};
var oActiveRVMByRole5 = null;


export const changeSelectedNode = (nodeID) => {

}

export const VisNetwork_RVM = () => {

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
                changeSelectedNode(nodeID);
            }
        });
        network.current.on("deselectNode",function(params){
            jQuery("#selectedNodeContainer").html("")
            jQuery("#selectedWordRawFileTextarea_unedited").val("")
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

const makeVisGraph_RVM = (clickedUniqueID) => {
    console.log("makeVisGraph_RVM")
    var nodes_arr = []; // elements are objects
    var edges_arr = [];

    var aNodes = []; // elements are slugs

    var rvmUnit = 400;

    var role1_x = 0;
    var role1_y = 0;

    var role2_x = rvmUnit;
    var role2_y = 0;

    var role3_x = rvmUnit * 2;
    var role3_y = 0;

    var role4_x = rvmUnit * 3;
    var role4_y = rvmUnit * 0.5;

    var role5_x = rvmUnit * 2;
    var role5_y = rvmUnit * 0.75;

    /*
    // role5 node may be more likely to have complete info, if it exists (will this remain true?)
    if (oActiveRVMByRole5) {
        var oActiveRVMByRole_ = MiscFunctions.cloneObj(oActiveRVMByRole5)
    } else {
        var oActiveRVMByRole_ = MiscFunctions.cloneObj(oActiveRVMByRole1)
    }
    */

    // ROLE_1
    var role1_slug = oActiveRVMByRole_reconstructed.role1_slug;
    var oRole1 = window.lookupWordBySlug[role1_slug];

    var nextNode_slug = role1_slug;
    var nextNode_wordType = "superset";
    var nextNode_conceptRole = "superset";
    var physics = false;
    var nextNode_x = role1_x;
    var nextNode_y = role1_y;
    var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_slug, slug: nextNode_slug, title: nextNode_slug, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: physics, x: nextNode_x, y: nextNode_y }
    if (!aNodes.includes(nextNode_slug)) {
        nodes_arr = MiscFunctions.pushObjIfNotAlreadyThere(nodes_arr,nextNode_vis_obj)
        aNodes.push(nextNode_slug)
    }

    // ROLE_2
    var role2_slug = oActiveRVMByRole_reconstructed.role2_slug;
    var oRole2 = window.lookupWordBySlug[role2_slug];

    var nextNode_slug = role2_slug;
    var nextNode_wordType = "property";
    var nextNode_conceptRole = "property";
    var physics = false;
    var nextNode_x = role2_x;
    var nextNode_y = role2_y;
    var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_slug, slug: nextNode_slug, title: nextNode_slug, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: physics, x: nextNode_x, y: nextNode_y }
    if (!aNodes.includes(nextNode_slug)) {
        nodes_arr = MiscFunctions.pushObjIfNotAlreadyThere(nodes_arr,nextNode_vis_obj)
        aNodes.push(nextNode_slug)
    }

    // ROLE_3
    var role3_slug = oActiveRVMByRole_reconstructed.role3_slug;
    var oRole3 = window.lookupWordBySlug[role3_slug];

    var nextNode_slug = role3_slug;
    var nextNode_wordType = "property";
    var nextNode_conceptRole = "primaryProperty";
    var physics = false;
    var nextNode_x = role3_x;
    var nextNode_y = role3_y;
    var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_slug, slug: nextNode_slug, title: nextNode_slug, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: physics, x: nextNode_x, y: nextNode_y }
    if (!aNodes.includes(nextNode_slug)) {
        nodes_arr = MiscFunctions.pushObjIfNotAlreadyThere(nodes_arr,nextNode_vis_obj)
        aNodes.push(nextNode_slug)
    }

    // ROLE_4
    var role4_slug = oActiveRVMByRole_reconstructed.role4_slug;
    var oRole4 = window.lookupWordBySlug[role4_slug];

    var nextNode_slug = role4_slug;
    var nextNode_wordType = "superset";
    var nextNode_conceptRole = "superset";
    var physics = false;
    var nextNode_x = role4_x;
    var nextNode_y = role4_y;
    var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_slug, slug: nextNode_slug, title: nextNode_slug, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: physics, x: nextNode_x, y: nextNode_y }
    if (!aNodes.includes(nextNode_slug)) {
        nodes_arr = MiscFunctions.pushObjIfNotAlreadyThere(nodes_arr,nextNode_vis_obj)
        aNodes.push(nextNode_slug)
    }

    // ROLE_5
    var role5_slug = oActiveRVMByRole_reconstructed.role5_slug;
    var oRole5 = window.lookupWordBySlug[role5_slug];

    var nextNode_slug = role5_slug;
    if (nextNode_slug) {
        var nextNode_wordType = "word";
        var nextNode_conceptRole = "word";
        var physics = false;
        var nextNode_x = role5_x;
        var nextNode_y = role5_y;
        var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_slug, slug: nextNode_slug, title: nextNode_slug, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: physics, x: nextNode_x, y: nextNode_y }
        if (!aNodes.includes(nextNode_slug)) {
            nodes_arr = MiscFunctions.pushObjIfNotAlreadyThere(nodes_arr,nextNode_vis_obj)
            aNodes.push(nextNode_slug)
        }
    }

    // ROLE_0
    var aRole0_slugs = oActiveRVMByRole_reconstructed.role0_slugs;
    for (var x=0; x < aRole0_slugs.length;x++) {
        var role0_slug = aRole0_slugs[x];
        var oRole0 = window.lookupWordBySlug[role0_slug];

        var role0_x = Math.floor(Math.random() * rvmUnit * 0.75 - rvmUnit * 0.375);
        var role0_y = rvmUnit + Math.floor(Math.random() * rvmUnit * 0.75 - rvmUnit* 0.375);

        var nextNode_slug = role0_slug;
        var nextNode_wordType = "wordType";
        var nextNode_conceptRole = "wordType";
        var physics = false;
        var nextNode_x = role0_x;
        var nextNode_y = role0_y;
        var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_slug, slug: nextNode_slug, title: nextNode_slug, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: physics, x: nextNode_x, y: nextNode_y }
        if (!aNodes.includes(nextNode_slug)) {
            nodes_arr = MiscFunctions.pushObjIfNotAlreadyThere(nodes_arr,nextNode_vis_obj)
            aNodes.push(nextNode_slug)
        }
    }

    // ROLE_6
    var aRole6_slugs = oActiveRVMByRole_reconstructed.role6_slugs;
    for (var x=0; x < aRole6_slugs.length;x++) {
        var role6_slug = aRole6_slugs[x];
        var oRole6 = window.lookupWordBySlug[role6_slug];

        var role6_x = Math.floor(Math.random() * rvmUnit * 0.75 - rvmUnit * 0.375);
        var role6_y = rvmUnit * 2 + Math.floor(Math.random() * rvmUnit * 0.75 - rvmUnit * 0.375);

        var nextNode_slug = role6_slug;
        var nextNode_wordType = "superset";
        var nextNode_conceptRole = "superset";
        var physics = false;
        var nextNode_x = role6_x;
        var nextNode_y = role6_y;
        var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_slug, slug: nextNode_slug, title: nextNode_slug, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: physics, x: nextNode_x, y: nextNode_y }
        if (!aNodes.includes(nextNode_slug)) {
            nodes_arr = MiscFunctions.pushObjIfNotAlreadyThere(nodes_arr,nextNode_vis_obj)
            aNodes.push(nextNode_slug)
        }
    }

    var aAllWords = Object.keys(window.lookupWordBySlug);
    for (var n=0;n<aAllWords.length;n++) {
        var nextWord_slug = aAllWords[n]
        var oNextWord = window.lookupWordBySlug[nextWord_slug]
        if (oNextWord.hasOwnProperty("schemaData")) {
            var aRels = oNextWord.schemaData.relationships;
            for (var r=0;r<aRels.length;r++) {
                var oNextRel = aRels[r];
                var nF_slug = oNextRel.nodeFrom.slug;
                var rT_slug = oNextRel.relationshipType.slug;
                var nT_slug = oNextRel.nodeTo.slug;
                if (aNodes.includes(nF_slug) && aNodes.includes(nT_slug)) {
                    // add this relationship to the graph
                    var relationshipStringified = JSON.stringify(oNextRel);
                    var nextRel_vis_obj = { from: nF_slug, to: nT_slug, nodeA: nF_slug, nodeB: nT_slug, relationshipType: rT_slug, relationshipStringified: relationshipStringified }
                    // edges_arr.push(nextRel_vis_obj)
                    edges_arr = addEdgeWithStyling_visjsfunctions(edges_arr,nextRel_vis_obj);
                    console.log("adding edge: nF_slug: "+nF_slug)
                }
            }
        }
    }

    nodes = new DataSet(nodes_arr);
    edges = new DataSet(edges_arr);
    data = {
        nodes,
        edges
    };
    var networkElemID = "graphViewContainer";
    ReactDOM.render(<VisNetwork_RVM clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        document.getElementById(networkElemID)
    )
}

const renderJSONSchemaForm = (targetJSONSchema_slug) => {
    var oSchema = window.lookupWordBySlug[targetJSONSchema_slug];
    ReactDOM.render(<JSONSchemaForm schema={oSchema} />,
        document.getElementById("jsonSchemaFormBox")
    )
}

export default class RestrictsValueManagementExplorer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptGraphSqlID: null
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var thisPageTableName = "unknown";
        var currCgID = window.currentConceptGraphSqlID;
        if (window.aLookupConceptGraphInfoBySqlID.hasOwnProperty(currCgID)) {
            thisPageTableName = ""+window.aLookupConceptGraphInfoBySqlID[currCgID].tableName;
        }

        var sql = " SELECT * FROM "+thisPageTableName+" WHERE (deleted IS NULL) OR (deleted = '0' ) ";
        console.log("sql: "+sql)

        var aUniqueIDs = [];
        var oNodeListByUniqueID = {};

        var oGovernanceOfUniqueID = {};

        sendAsync(sql).then( async (result) => {
            var aResult = result;
            var numRows = aResult.length;
            // console.log("numRows: "+numRows)
            oGovernanceOfUniqueID = {};
            for (var r=0;r<numRows;r++) {
                var oNextRow = aResult[r];
                var nextRow_id = oNextRow.id;
                var nextRow_slug = oNextRow.slug;
                var nextRow_rawFile = oNextRow.rawFile;
                var nextRow_ipfs = oNextRow.ipfs;
                var nextRow_ipns = oNextRow.ipns;
                var oNextWord = JSON.parse(nextRow_rawFile);

                if (oNextWord.hasOwnProperty("schemaData")) {
                    var aRels = oNextWord.schemaData.relationships;
                    for (var x=0; x < aRels.length;x++) {
                        var oNextRel = aRels[x];
                        var rT_slug = oNextRel.relationshipType.slug;
                        if (rT_slug=="restrictsValue") {
                            var uID = oNextRel.relationshipType.restrictsValueData.uniqueID;
                            oGovernanceOfUniqueID[uID] = {};
                            oGovernanceOfUniqueID[uID].propertySchemaSlug = nextRow_slug;
                            oGovernanceOfUniqueID[uID].oGoverningRelationship = oNextRel
                        }
                    }
                }

                if (oNextWord.globalDynamicData.hasOwnProperty("restrictsValueManagement")) {
                    // console.log("restrictsValueManagement; nextRow_slug: "+nextRow_slug)
                    var oRVM = oNextWord.globalDynamicData.restrictsValueManagement;
                    var arr1 = Object.keys(oRVM);
                    for (var u=0;u<arr1.length;u++) {
                        var nextUniqueID = arr1[u];
                        // console.log("restrictsValueManagement; u: "+u+"; nextUniqueID: "+nextUniqueID)
                        if (jQuery.inArray(nextUniqueID,aUniqueIDs) == -1) {
                            aUniqueIDs.push(nextUniqueID)
                            oNodeListByUniqueID[nextUniqueID] = []
                        }
                        oNodeListByUniqueID[nextUniqueID].push(nextRow_slug)
                    }
                }
            }
            jQuery("#uniqueIDsContainer").html("")
            for (var n=0;n<aUniqueIDs.length;n++) {
                var nextUniqueID = aUniqueIDs[n];

                var eGT = "?";
                var wS = "?";
                var wD = "?";
                var tPT = "?";
                var dP = ".";

                if (oGovernanceOfUniqueID.hasOwnProperty(nextUniqueID)) {
                    var oGoverningRelationship = oGovernanceOfUniqueID[nextUniqueID].oGoverningRelationship;
                    wS = oGoverningRelationship.relationshipType.restrictsValueData.withSubsets;
                    wD = oGoverningRelationship.relationshipType.restrictsValueData.withDependencies;
                    tPT = oGoverningRelationship.relationshipType.restrictsValueData.targetPropertyType;
                    if (oGoverningRelationship.relationshipType.restrictsValueData.hasOwnProperty("dependenciesPlacement")) {
                        dP = oGoverningRelationship.relationshipType.restrictsValueData.dependenciesPlacement;
                    }

                    if ( (wS==false) && (wD==false) ) {
                        eGT = "A";
                    }
                    if ( (wS==true) && (wD==false) ) {
                        eGT = "B";
                    }
                    if ( (wS==false) && (wD==true) ) {
                        if (dP=="upper") { eGT = "C ?"; }
                        if (dP=="lower") { eGT = "D ?"; }
                    }
                    if ( (wS==true) && (wD==true) ) {
                        if (dP=="upper") { eGT = "C"; }
                        if (dP=="lower") { eGT = "D"; }
                    }

                    if (wS==false) { wS = 0; }
                    if (wS==true) { wS = 1; }

                    if (wD==false) { wD = 0; }
                    if (wD==true) { wD = 1; }

                    if (tPT=="string") { tPT = "S"; }
                    if (tPT=="array") { tPT = "A"; }

                    if (dP=="lower") { dP = "L"; }
                    if (dP=="upper") { dP = "U"; }
                    if (dP==null) { dP = "-"; }
                }

                var sentenceHTML = "";

                sentenceHTML += "<div ";
                sentenceHTML += " style='margin-right:10px;text-align:center;display:inline-block;width:25px;height:25px;";
                if (eGT=="A") { sentenceHTML += "background-color:#EFEFEF;border:4px solid #EFEFEF;"; }
                if (eGT=="B") { sentenceHTML += "background-color:#EFEFEF;border:4px solid green;"; }
                if (eGT=="C") { sentenceHTML += "background-color:purple;border:4px solid green;color:white;"; }
                if (eGT=="D") { sentenceHTML += "background-color:yellow;border:4px solid green;"; }
                sentenceHTML += "'>";
                sentenceHTML += eGT;
                sentenceHTML += "</div>";

                sentenceHTML += "<div ";
                sentenceHTML += " style='margin-right:3px;text-align:center;display:inline-block;border:1px solid black;width:20px;height:20px;";
                if (wS==0) { sentenceHTML += "background-color:#FFAAAA;"; }
                if (wS==1) { sentenceHTML += "background-color:#AAFFAA;"; }
                sentenceHTML += "'>";
                sentenceHTML += wS;
                sentenceHTML += "</div>";

                sentenceHTML += "<div ";
                sentenceHTML += " style='margin-right:3px;text-align:center;display:inline-block;border:1px solid black;width:20px;height:20px;";
                if (wD==0) { sentenceHTML += "background-color:#FFAAAA;"; }
                if (wD==1) { sentenceHTML += "background-color:#AAFFAA;"; }
                sentenceHTML += "'>";
                sentenceHTML += wD;
                sentenceHTML += "</div>";

                sentenceHTML += "<div ";
                sentenceHTML += " style='margin-right:3px;text-align:center;display:inline-block;border:1px solid black;width:20px;height:20px;";
                if (dP=="L") { sentenceHTML += "background-color:yellow;"; }
                if (dP=="U") { sentenceHTML += "background-color:purple;color:white;"; }
                sentenceHTML += "'>";
                sentenceHTML += dP;
                sentenceHTML += "</div>";

                sentenceHTML += "<div ";
                sentenceHTML += " style='margin-right:3px;text-align:center;display:inline-block;border:1px solid black;width:20px;height:20px;";
                if (tPT=="S") { sentenceHTML += "background-color:#AAAAFF;"; }
                if (tPT=="A") { sentenceHTML += "background-color:#333333;color:white"; }
                sentenceHTML += "'>";
                sentenceHTML += tPT;
                sentenceHTML += "</div>";

                // console.log("n: "+n+"; nextUniqueID: "+nextUniqueID)
                if (oGovernanceOfUniqueID.hasOwnProperty(nextUniqueID)) {
                    var oGoverningRelationship = oGovernanceOfUniqueID[nextUniqueID].oGoverningRelationship;
                    var nF_slug = oGoverningRelationship.nodeFrom.slug;
                    var nT_slug = oGoverningRelationship.nodeTo.slug;

                    var oNodeFrom = window.lookupWordBySlug[nF_slug];
                    var nF_name = oNodeFrom.wordData.name;

                    var oNodeTo = window.lookupWordBySlug[nT_slug];
                    var nT_name = oNodeTo.wordData.name;
                    // sentenceHTML += "The value of this property: "+nT_slug+" is constrained by specific instances of this set or superset: "+nF_slug;

                    sentenceHTML += "<div style='margin-left:20px;display:inline-block;width:300px' >";
                    sentenceHTML += nF_name;
                    sentenceHTML += "</div>";

                    sentenceHTML += "defines the allowed values of";

                    sentenceHTML += "<div style='margin-left:50px;display:inline-block;width:300px' >";
                    sentenceHTML += nT_name;
                    sentenceHTML += "</div>";
                } else {
                    sentenceHTML += "error; governing relationship not found.";
                }


                var nextUniqueIdHTML = "";
                nextUniqueIdHTML += "<div>";
                    nextUniqueIdHTML += "<div ";
                    nextUniqueIdHTML += " data-uniqueid='"+nextUniqueID+"' ";
                    nextUniqueIdHTML += " class='uniqueIdContainer' ";
                    nextUniqueIdHTML += " style=display:inline-block;width:250px; ";
                    nextUniqueIdHTML += " >";
                        nextUniqueIdHTML += nextUniqueID;
                    nextUniqueIdHTML += "</div>";

                    nextUniqueIdHTML += "<div style=display:inline-block;width:1000px; >";
                        nextUniqueIdHTML += sentenceHTML;
                    nextUniqueIdHTML += "</div>";
                nextUniqueIdHTML += "</div>";
                jQuery("#uniqueIDsContainer").append(nextUniqueIdHTML)
            }
            jQuery(".uniqueIdContainer").click(function(){
                jQuery(".uniqueIdContainer").css("background-color","#EFEFEF");
                jQuery(this).css("background-color","orange");
                oActiveRVMByRole1 = {};
                oActiveRVMByRole5 = null;
                oActiveRVMByRole_reconstructed = MiscFunctions.cloneObj(window.restrictsValueManagement);
                jQuery("#nodesContainer").html("")
                jQuery("#uneditedWordContainer").val("")
                // jQuery("#uniqueIDContainer").html("")

                var clickedUniqueID = jQuery(this).data("uniqueid")
                jQuery("#uniqueIDContainer").html(clickedUniqueID)

                var governingPropertySchemaSlug = oGovernanceOfUniqueID[clickedUniqueID].propertySchemaSlug;
                var oGoverningRel = oGovernanceOfUniqueID[clickedUniqueID].oGoverningRelationship;
                var targetPropertyType = oGoverningRel.relationshipType.restrictsValueData.targetPropertyType;

                var depPlacement = ".";
                if (oGoverningRel.relationshipType.restrictsValueData.hasOwnProperty("dependenciesPlacement")) {
                    depPlacement = oGoverningRel.relationshipType.restrictsValueData.dependenciesPlacement;
                }
                var dP = "n/a";
                if (depPlacement=="lower") {
                    dP = "L";
                }
                if (depPlacement=="upper") {
                    dP = "U";
                }
                jQuery("#dependenciesUpVsDownContainer").html(dP)

                jQuery("#stringVsArrayContainer").html(targetPropertyType)
                var propertySchemaContainerHTML = "";
                propertySchemaContainerHTML += "<div ";
                propertySchemaContainerHTML += " data-slug='"+governingPropertySchemaSlug+"' ";
                propertySchemaContainerHTML += " class='singleNodeContainer' ";
                propertySchemaContainerHTML += " >";
                propertySchemaContainerHTML += governingPropertySchemaSlug;
                propertySchemaContainerHTML += "</div>";
                jQuery("#propertySchemaContainer").html(propertySchemaContainerHTML)
                var relationshipContainerHTML = "";
                relationshipContainerHTML += "<div ";
                relationshipContainerHTML += " data-uniqueid='"+clickedUniqueID+"' ";
                relationshipContainerHTML += " class='governingRelationshipContainer' ";
                relationshipContainerHTML += " >";
                relationshipContainerHTML += "click to view";
                relationshipContainerHTML += "</div>";
                jQuery("#relationshipContainer").html(relationshipContainerHTML)

                var arr2 = oNodeListByUniqueID[clickedUniqueID]
                jQuery("#role0Container").html("")
                jQuery("#role1Container").html("")
                jQuery("#role2Container").html("")
                jQuery("#role3Container").html("")
                jQuery("#role4Container").html("")
                jQuery("#role5Container").html("")
                jQuery("#role6Container").html("")
                for (var c=0;c<arr2.length;c++) {
                    var nextNode_slug = arr2[c];
                    var nextNodeHTML = "";
                    nextNodeHTML += "<div ";
                    nextNodeHTML += " data-slug='"+nextNode_slug+"' ";
                    nextNodeHTML += " class='singleNodeContainer' ";
                    nextNodeHTML += " >";
                    nextNodeHTML += nextNode_slug;
                    nextNodeHTML += "</div>";
                    jQuery("#nodesContainer").append(nextNodeHTML)
                    // console.log("qwerty nextNode_slug: "+nextNode_slug)
                    var oWord = window.lookupWordBySlug[nextNode_slug];
                    // console.log("qwerty oWord: "+JSON.stringify(oWord,null,4))
                    var thisNodeRole = oWord.globalDynamicData.restrictsValueManagement[clickedUniqueID].thisNodeRole
                    var roleID = thisNodeRole+"Container";
                    jQuery("#"+roleID).append(nextNodeHTML)

                    if (thisNodeRole == "role1") {
                        oActiveRVMByRole_reconstructed.role1_slug = nextNode_slug
                    }
                    if (thisNodeRole == "role2") {
                        oActiveRVMByRole_reconstructed.role2_slug = nextNode_slug
                    }
                    if (thisNodeRole == "role3") {
                        oActiveRVMByRole_reconstructed.role3_slug = nextNode_slug;
                        var oWord_role3 = window.lookupWordBySlug[nextNode_slug];
                        var targetGoverningConcept_slug = oWord_role3.propertyData.metaData.governingConcept.slug;
                        var oGovCon = window.lookupWordBySlug[targetGoverningConcept_slug];
                        var targetJSONSchema_slug = oGovCon.conceptData.nodes.JSONSchema.slug;
                        jQuery("#targetJSONSchemaContainer").html(targetJSONSchema_slug)
                        renderJSONSchemaForm(targetJSONSchema_slug)

                        var targetSuperset_slug = oGovCon.conceptData.nodes.superset.slug;
                        var oSuperset = window.lookupWordBySlug[targetSuperset_slug]
                        var aSpecificInstances = oSuperset.globalDynamicData.specificInstances;
                        var propertyPath = oGovCon.conceptData.propertyPath;
                        jQuery("#specificInstancesListContainer").html("");
                        for (var s=0;s<aSpecificInstances.length;s++) {
                            var nextSpecificInstance_slug = aSpecificInstances[s];
                            var oNextSpecificInstance = window.lookupWordBySlug[nextSpecificInstance_slug]
                            var oNextSpecificInstance_name = oNextSpecificInstance.wordData.name;
                            var nextSpecificInstanceHTML = "";
                            nextSpecificInstanceHTML += "<div class='specificInstanceButton' data-slug='"+nextSpecificInstance_slug+"' id='specificInstance_"+nextSpecificInstance_slug+"' >";
                            nextSpecificInstanceHTML += oNextSpecificInstance_name;
                            nextSpecificInstanceHTML += "</div>";
                            jQuery("#specificInstancesListContainer").append(nextSpecificInstanceHTML)
                        }
                        jQuery(".specificInstanceButton").click(function(){
                            var si_slug = jQuery(this).data("slug");
                            console.log("si_slug: "+si_slug);
                            var oSi = window.lookupWordBySlug[si_slug];
                            var sSi = JSON.stringify(oSi,null,4)
                            jQuery("#specificInstanceCompleteBox").val(sSi);

                            var oSi_parsed = {};
                            oSi_parsed[propertyPath] = oSi[propertyPath];
                            var sSi_parsed = JSON.stringify(oSi_parsed,null,4)
                            jQuery("#specificInstanceParsedBox").val(sSi_parsed);
                        })
                    }
                    if (thisNodeRole == "role4") {
                        oActiveRVMByRole_reconstructed.role4_slug = nextNode_slug
                    }
                    if (thisNodeRole == "role5") {
                        oActiveRVMByRole_reconstructed.role5_slug = nextNode_slug
                    }
                    if (thisNodeRole == "role0") {
                        if (!oActiveRVMByRole_reconstructed.role0_slugs.includes(nextNode_slug)) {
                            oActiveRVMByRole_reconstructed.role0_slugs.push(nextNode_slug);
                        }
                    }
                    if (thisNodeRole == "role6") {
                        if (!oActiveRVMByRole_reconstructed.role6_slugs.includes(nextNode_slug)) {
                            oActiveRVMByRole_reconstructed.role6_slugs.push(nextNode_slug);
                        }
                    }

                    if (thisNodeRole == "role1") {
                        oActiveRVMByRole1 = oWord.globalDynamicData.restrictsValueManagement[clickedUniqueID];
                        var aNodePatternCodes = oWord.globalDynamicData.nodePatternCodes;
                        for (var p=0;p<aNodePatternCodes.length;p++) {
                            var nextPatternCode = aNodePatternCodes[p];
                            if (nextPatternCode.includes(clickedUniqueID)) {
                                var aFoo1 = nextPatternCode.split(".");
                                var nextPatternCode_abbreviated = aFoo1[1];
                                jQuery("#patternCodeContainer").html(nextPatternCode_abbreviated)
                                var subsets = "unknown";
                                var dependencies = "unknown";
                                subsets = nextPatternCode_abbreviated.substring(2,3);
                                dependencies = nextPatternCode_abbreviated.substring(3,4);
                                jQuery("#subsetsContainer").html(subsets)
                                jQuery("#dependenciesContainer").html(dependencies)
                            }
                        }
                    }
                    if (thisNodeRole == "role5") {
                        oActiveRVMByRole5 = oWord.globalDynamicData.restrictsValueManagement[clickedUniqueID];
                    }
                }
                jQuery(".governingRelationshipContainer").click(function(){
                    jQuery(".singleNodeContainer").css("background-color","#EFEFEF")
                    jQuery(".governingRelationshipContainer").css("background-color","#EFEFEF")
                    jQuery(this).css("background-color","orange")
                    // add rawFile to textarea
                    var clickedUniqueID = jQuery(this).data("uniqueid")
                    var oGoverningRel = oGovernanceOfUniqueID[clickedUniqueID].oGoverningRelationship;
                    var sGoverningRel = JSON.stringify(oGoverningRel,null,4);
                    jQuery("#uneditedWordContainer").val(sGoverningRel)
                })

                jQuery(".singleNodeContainer").click(function(){
                    jQuery(".singleNodeContainer").css("background-color","#EFEFEF")
                    jQuery(".governingRelationshipContainer").css("background-color","#EFEFEF")
                    jQuery(this).css("background-color","orange")
                    // add rawFile to textarea
                    var clickedWord_slug = jQuery(this).data("slug")
                    var oWord = window.lookupWordBySlug[clickedWord_slug];
                    var sWord = JSON.stringify(oWord,null,4);
                    jQuery("#uneditedWordContainer").val(sWord)
                })
                makeVisGraph_RVM(clickedUniqueID);
            })
        })

        jQuery("#graphViewToggleButton").click(function(){
            var currStatus = jQuery("#graphViewToggleButton").data("status");
            if (currStatus=="closed") {
                jQuery("#graphViewToggleButton").data("status","open");
                // jQuery("#graphViewToggleButton").html("hide NeuroCore")
                // jQuery("#neuroCoreMonitoringPanel").css("display","block")
                jQuery("#graphViewContainer").animate({
                    height: "600px",
                    padding: "10px",
                    borderWidth:"1px"
                },500);
            }
            if (currStatus=="open") {
                jQuery("#graphViewToggleButton").data("status","closed");
                // jQuery("#graphViewToggleButton").html("show NeuroCore");
                // jQuery("#neuroCoreMonitoringPanel").css("display","none")
                jQuery("#graphViewContainer").animate({
                    height: "0px",
                    padding: "0px",
                    borderWidth:"0px"
                },500);
            }
        })
        jQuery("#changeRVMOptionsButton").click(function(){
            var currentUniqueID = jQuery("#uniqueIDContainer").html();
            var propertySchemaSlug = oGovernanceOfUniqueID[currentUniqueID].propertySchemaSlug;
            var oPropertySchema = window.lookupWordBySlug[propertySchemaSlug];
            var aRels = oPropertySchema.schemaData.relationships;
            var oPropertySchema_updated = MiscFunctions.cloneObj(oPropertySchema)
            oPropertySchema_updated.schemaData.relationships = [];

            var oGoverningRelationship = oGovernanceOfUniqueID[currentUniqueID].oGoverningRelationship;
            var oGoverningRelationship_updated = MiscFunctions.cloneObj(oGoverningRelationship);

            var updatedSubsetValue = jQuery("#changeSubsetsSelector option:selected").val();
            var updatedDependenciesValue = jQuery("#changeDependenciesSelector option:selected").val();
            var updatedDependenciesUpVsDownValue = jQuery("#changeDependenciesUpVsDownSelector option:selected").val();

            oGoverningRelationship_updated.relationshipType.restrictsValueData.withSubsets = false;
            if (updatedSubsetValue=="1") {
                oGoverningRelationship_updated.relationshipType.restrictsValueData.withSubsets = true;
            }
            oGoverningRelationship_updated.relationshipType.restrictsValueData.withDependencies = false;
            if (updatedDependenciesValue=="1") {
                oGoverningRelationship_updated.relationshipType.restrictsValueData.withDependencies = true;
            }

            var replaceRelationship = false;
            for (var r=0;r < aRels.length; r++) {
                var oNextRel = aRels[r];
                var rT_slug = oNextRel.relationshipType.slug;
                if (rT_slug=="restrictsValue") {
                    var uID = oNextRel.relationshipType.restrictsValueData.uniqueID;
                    if (uID==currentUniqueID) {
                        replaceRelationship = true;
                    }
                }
                if (replaceRelationship) {
                    oPropertySchema_updated.schemaData.relationships.push(oGoverningRelationship_updated)
                } else {
                    oPropertySchema_updated.schemaData.relationships.push(oNextRel)
                }
            }

            var sGoverningRelationship_original = JSON.stringify(oGoverningRelationship,null,4);
            var sGoverningRelationship_updated = JSON.stringify(oGoverningRelationship_updated,null,4);

            var sPropertySchema_original = JSON.stringify(oPropertySchema,null,4);
            var sPropertySchema_updated = JSON.stringify(oPropertySchema_updated,null,4);

            console.log("changeRVMOptionsButton; currentUniqueID: "+currentUniqueID+"; propertySchemaSlug: "+propertySchemaSlug+"; sGoverningRelationship_original: "+sGoverningRelationship_original+"; sGoverningRelationship_updated: "+sGoverningRelationship_updated)
            // console.log("changeRVMOptionsButton; currentUniqueID: "+currentUniqueID+"; propertySchemaSlug: "+propertySchemaSlug+"; sPropertySchema_original: "+sPropertySchema_original+"; sPropertySchema_updated: "+sPropertySchema_updated)
            MiscFunctions.createOrUpdateWordInAllTables(oPropertySchema_updated)
        })
        jQuery("#updateSelecteWordButton").click(function(){
            var sWord = jQuery("#uneditedWordContainer").val();
            var oWord = JSON.parse(sWord);
            MiscFunctions.createOrUpdateWordInAllTables(oWord)
        })

        jQuery("#showSelecteWordBoxButton").click(function(){
            jQuery(this).css("background-color","green")
            jQuery("#showJsonSchemaFormBoxButton").css("background-color","#EFEFEF")
            jQuery("#showSpecificInstancesBoxButton").css("background-color","#EFEFEF")

            jQuery("#singleWordBox").css("display","block")
            jQuery("#jsonSchemaFormBox").css("display","none")
            jQuery("#specificInstancesBox").css("display","none")
        })
        jQuery("#showJsonSchemaFormBoxButton").click(function(){
            jQuery(this).css("background-color","green")
            jQuery("#showSelecteWordBoxButton").css("background-color","#EFEFEF")
            jQuery("#showSpecificInstancesBoxButton").css("background-color","#EFEFEF")

            jQuery("#singleWordBox").css("display","none")
            jQuery("#jsonSchemaFormBox").css("display","block")
            jQuery("#specificInstancesBox").css("display","none")
        })
        jQuery("#showSpecificInstancesBoxButton").click(function(){
            jQuery(this).css("background-color","green")
            jQuery("#showJsonSchemaFormBoxButton").css("background-color","#EFEFEF")
            jQuery("#showSelecteWordBoxButton").css("background-color","#EFEFEF")

            jQuery("#singleWordBox").css("display","none")
            jQuery("#jsonSchemaFormBox").css("display","none")
            jQuery("#specificInstancesBox").css("display","block")
        })

        jQuery("#showParsedSpecificInstanceButton").click(function(){
            jQuery(this).css("background-color","green")
            jQuery("#showFullSpecificInstanceButton").css("background-color","#EFEFEF")

            jQuery("#specificInstanceParsedBox").css("display","inline-block")
            jQuery("#specificInstanceCompleteBox").css("display","none")
        })
        jQuery("#showFullSpecificInstanceButton").click(function(){
            jQuery(this).css("background-color","green")
            jQuery("#showParsedSpecificInstanceButton").css("background-color","#EFEFEF")

            jQuery("#specificInstanceCompleteBox").css("display","inline-block")
            jQuery("#specificInstanceParsedBox").css("display","none")
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" style={{backgroundColor:"#CFCFCF"}} >
                        <ConceptGraphMasthead />
                        <div class="h2">restrictsValueManagement Explorer</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>

                        <div style={{fontSize:"12px",margin:"5px 0px 0px 20px"}} >
                            <center>uniqueID</center>
                            <div id="uniqueIDsContainer" style={{width:"100%"}}></div>
                            <div id="graphViewToggleButton" data-status="closed" className="doSomethingButton">toggle graph</div>
                        </div>

                        <br/>

                        <div id="graphViewContainer"
                            style={{backgroundColor:"#EFEFEF",height:"0px",padding:"0px",border:"0px solid black",overflow:"hidden"}}
                            >
                            <center>graph view</center>
                        </div>

                        <div className="standardDoubleColumn" style={{fontSize:"12px",width:"500px",border:"1px solid black"}} >
                            <center>pattern code data</center>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    uniqueID:
                                </div>
                                <div id="uniqueIDContainer" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    pattern code:
                                </div>
                                <div id="patternCodeContainer" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    subsets:
                                </div>
                                <div id="subsetsContainer" className="leftColumnRightPanel" style={{width:"40px"}} ></div>
                                change: <select id="changeSubsetsSelector">
                                    <option value="0">0 </option>
                                    <option value="1">1</option>
                                </select>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    dependencies:
                                </div>
                                <div id="dependenciesContainer" className="leftColumnRightPanel" style={{width:"40px"}}  ></div>
                                change: <select id="changeDependenciesSelector">
                                    <option value="0">0 </option>
                                    <option value="1">1</option>
                                </select>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    up vs down:
                                </div>
                                <div id="dependenciesUpVsDownContainer" className="leftColumnRightPanel" style={{width:"40px"}}  >.</div>
                                change: <select id="changeDependenciesUpVsDownSelector">
                                    <option value="up">up</option>
                                    <option value="down">down</option>
                                </select>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    string vs array:
                                </div>
                                <div id="stringVsArrayContainer" className="leftColumnRightPanel" style={{width:"40px"}}  ></div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    JSONSchema:
                                </div>
                                <div id="targetJSONSchemaContainer" className="leftColumnRightPanel" ></div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    change options:
                                </div>
                                <div className="leftColumnRightPanel" style={{backgroundColor:"#CFCFCF"}}  >
                                    <div id="changeRVMOptionsButton" className="doSomethingButton_small">change</div>
                                </div>

                            </div>

                            <center>governance</center>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    propertySchema:
                                </div>
                                <div id="propertySchemaContainer" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    relationship:
                                </div>
                                <div id="relationshipContainer" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <center>nodes by role</center>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    role0:
                                </div>
                                <div id="role0Container" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    role1:
                                </div>
                                <div id="role1Container" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    role2:
                                </div>
                                <div id="role2Container" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    role3:
                                </div>
                                <div id="role3Container" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    role4:
                                </div>
                                <div id="role4Container" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    role5:
                                </div>
                                <div id="role5Container" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    role6:
                                </div>
                                <div id="role6Container" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <br/>

                            <center>nodes</center>
                            <div id="nodesContainer"></div>

                        </div>

                        <div style={{border:"1px solid grey",display:"inline-block",width:"800px",height:"900px",textAlign:"center"}} >
                            <div id="showSelecteWordBoxButton" className="doSomethingButton" >show selected word</div>
                            <div id="showJsonSchemaFormBoxButton" className="doSomethingButton" >show JSON Schema form</div>
                            <div id="showSpecificInstancesBoxButton" className="doSomethingButton" >show specific instances</div>
                            <div id="singleWordBox">
                                <div id="showUneditedSelecteWordButton" className="doSomethingButton" >unedited</div>
                                <div id="showEditedSelecteWordButton" className="doSomethingButton" >edited</div>
                                <div id="updateSelecteWordButton" className="doSomethingButton" >UPDATE (save edited)</div>
                                <textarea id="uneditedWordContainer" style={{display:"inline-block",width:"95%",height:"800px"}} ></textarea>
                            </div>
                            <div id="jsonSchemaFormBox" style={{display:"inline-block",width:"95%",height:"800px",textAlign:"left"}} >
                                jsonSchemaFormBox
                            </div>
                            <div id="specificInstancesBox" style={{display:"inline-block",width:"95%",height:"800px",textAlign:"left"}} >
                                <div id="specificInstancesBox" style={{display:"inline-block",width:"250px",height:"800px",overflow:"scroll",fontSize:"12px"}} >
                                    <center>specific instances</center>
                                    <div id="specificInstancesListContainer"></div>
                                </div>
                                <div style={{border:"1px dashed grey",height:"800px",width:"495px",display:"inline-block"}} >
                                    <div id="showParsedSpecificInstanceButton" className="doSomethingButton" style={{backgroundColor:"green"}} >parsed</div>
                                    <div id="showFullSpecificInstanceButton" className="doSomethingButton"  >full</div>
                                    <br/>
                                    <textarea id="specificInstanceCompleteBox" style={{display:"inline-block",width:"490px",height:"700px",overflow:"scroll",fontSize:"12px",display:"none"}} >
                                        specificInstanceCompleteBox
                                    </textarea>
                                    <textarea id="specificInstanceParsedBox" style={{display:"inline-block",width:"490px",height:"700px",overflow:"scroll",fontSize:"12px"}} >
                                        specificInstanceParsedBox
                                    </textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
