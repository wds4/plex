import React, { useState, useEffect, useRef }  from "react";
import ReactDOM from 'react-dom';
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import Masthead from '../../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/cgFe_singleConceptGraph_updates_leftNav2';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import * as VisjsFunctions from '../../../../../functions/visjsFunctions.js';
import * as MiscIpfsFunctions from '../../../../../lib/ipfs/miscIpfsFunctions.js'
import * as ConceptGraphInMfsFunctions from '../../../../../lib/ipfs/conceptGraphInMfsFunctions.js'
import * as CompScoreCalcFunctions from '../../../../../lib/grapevine/compScoreCalcFunctions.js'
import * as VisStyleConstants from '../../../../../lib/visjs/visjs-style';
import AttenuationSlider from './modules/attenuationSlider.js'
import ControlPanel from './modules/controlPanel/controlPanel.js'
import CompUserTrustScoreCalcPanel from './compUserTrustScoreCalcPanel.js'
import CompUpdateProposalVerdictScoreCalcPanel from './compUpdateProposalVerdictScoreCalcPanel.js'

const electronFs = window.require('fs');

const jQuery = require("jquery");

function ScoresCalculationTimer() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            var foo = jQuery("#scoresCalculationTimer").data("status")
            if (foo=="run") {
                jQuery("#calculateUserTrustScoresSingleIterationButton").get(0).click()
                jQuery("#calculateUpdateProposalVerdictScoresSingleIterationButton").get(0).click()
                if (count%5 == 0) {
                    jQuery("#changeUserCalcsDisplayButton").get(0).click()
                }
                if (count%5 == 1) {
                    jQuery("#changeUpdateProposalCalcsDisplayButton").get(0).click()
                }
            }
            setCount((count) => count + 1);
        }, 200);
    }, [count]); // <- add empty brackets here

    return <div>I've rendered {count} times!</div>;
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

function editEdgeFunction() {

}
function deleteEdgeFunction() {

}
function deleteNodeFunction() {

}

// var groupOptions = window.visjs.groupOptions;
export const groupOptions={

}

// var options = VisStyleConstants.options_vis_propertyTree;

// options_vis_c2c
var options = {
    clickToUse: true,
	interaction:{hover:true},
	manipulation: {
		enabled: true,
        editEdge: function(edgeData,callback) {
            editEdgeFunction(edgeData);
            callback(edgeData);
        },
        deleteEdge: function(edgeData,callback) {
            deleteEdgeFunction(edgeData);
            callback(edgeData);
        },
        deleteNode: function(nodeData,callback) {
            deleteNodeFunction(nodeData);
            callback(nodeData);
        }
	},
	physics: {
	    enabled: true
        // wind: { x:0, y:0.1 }
        // barnesHut: { gravitationalConstant: -30 }
        // stabilization: {iterations:2500}
    },
    /*
    physics: false,
    layout: {
        hierarchical: {
            direction: "UD", // UD, DU, LR, RL
            sortMethod: "hubsize" // directed vs hubsize
        }
    },
    */
    nodes:{
        margin: 10,
        borderWidth:1,
        color: { background: '#FFFFFF', border: '#000000' },
        widthConstraint: {
            minimum: 0,
            maximum: 100
        }
    },
	edges: {
	    hoverWidth: 5,
	    selectionWidth: 5,
        scaling: {
            min:1,
            max:10,
            label: {
                enabled: false,
                min:14,
                max:30
            },
            customScalingFunction: function (min,max,total,value) {
                if (max === min) {
                    return 0.5;
                }
                else {
                    var scale = 1 / (max - min);
                    return Math.max(0,(value - min)*scale);
                }
            }
        },
        arrows: {
            to: {
                enabled: true,
                type: "arrow"
            },
            middle: {
                enabled: false,
                type: "arrow"
            },
            from: {
                enabled: false,
                type: "circle" // or could do bar; however, it looks odd with arrowStrikethrough false
            }
        }
	},
	groups: groupOptions
};

export var network = {};

var data = {
    nodes,
    edges
};


const fetchInfluenceTypes_depr = async (pCG0) => {

    var aResult = [];

    var pathToInfluenceTypes = pCG0 + "concepts/influenceType/superset/allSpecificInstances/slug/"
    console.log("fetchInfluenceTypes; pathToInfluenceTypes: "+pathToInfluenceTypes)
    for await (const file of MiscIpfsFunctions.ipfs.files.ls(pathToInfluenceTypes)) {
        var fileName = file.name;
        var fileType = file.type;
        console.log("fetchInfluenceTypes; file name: "+file.name)
        console.log("fetchInfluenceTypes; file type: "+file.type)
        if (fileType=="directory") {
            var pathToSpecificInstance = pathToInfluenceTypes + fileName + "/node.txt";
            for await (const siFile of MiscIpfsFunctions.ipfs.files.read(pathToSpecificInstance)) {
                var sNextSpecificInstanceRawFile = new TextDecoder("utf-8").decode(siFile);
                var oNextSpecificInstanceRawFile = JSON.parse(sNextSpecificInstanceRawFile);
                var nextInfluenceType_name = oNextSpecificInstanceRawFile.influenceTypeData.name;
                console.log("fetchInfluenceTypes; nextInfluenceType_name: "+nextInfluenceType_name)
                aResult.push(oNextSpecificInstanceRawFile)
            }
        }
    }
    return aResult;
}

// to do: no longer need pCG0 as an argument in this function
const fetchInfluenceTypes = async (pCG0) => {
    var aResult = [];

    var supersetIt_slug = "supersetFor_influenceType";
    var oSuperset_iT = await ConceptGraphInMfsFunctions.lookupWordBySlug(supersetIt_slug)
    // console.log("determineCompositeScoreInheritance; oSuperset_iT: "+JSON.stringify(oSuperset_iT,null,4))
    var aInfluenceTypes = oSuperset_iT.globalDynamicData.specificInstances;
    for (var z=0;z<aInfluenceTypes.length;z++) {
        var iT_slug = aInfluenceTypes[z];
        var oInfluenceType = await ConceptGraphInMfsFunctions.lookupWordBySlug(iT_slug)
        aResult.push(oInfluenceType)
    }
    return aResult;
}

var lookupCompositeUserTrustScoreNumberByType = {};
var lookupCompositeUpdateProposalVerdictScoreNumberByType = {};

const generateAllCompositeUpdateProposalVerdictScoreTypes = async () => {
    var aCompositeUpdateProposalVerdictScoreTypes = [];
    var compositeScoreType = "standardAverage";
    aCompositeUpdateProposalVerdictScoreTypes.push(compositeScoreType)

    for (var x=0;x<aCompositeUpdateProposalVerdictScoreTypes.length;x++) {
        var nextType = aCompositeUpdateProposalVerdictScoreTypes[x];
        lookupCompositeUpdateProposalVerdictScoreNumberByType[nextType] = x;
    }
    return aCompositeUpdateProposalVerdictScoreTypes;
}

const generateAllCompositeUserTrustScoreTypes = async () => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
    var aCompositeUserTrustScoreTypes = [];
    var compositeScoreType = "allInfluenceTypes_allContexts";
    aCompositeUserTrustScoreTypes.push(compositeScoreType)

    console.log("makeInfluenceTypeSelector")
    // THIS IS THE OLD WAY TO LOOK UP WORDS ON THE CONCEPT GRAPH
    // NEED TO UPDATE THIS here and elsewhere on this page
    // var mainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug
    var mainSchema_slug = "mainSchemaForConceptGraph";
    // var oMainSchema = window.lookupWordBySlug[mainSchema_slug]
    var oMainSchema = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,mainSchema_slug);
    // var oMainSchema = await ConceptGraphInMfsFunctions.lookupWordBySlug[mainSchema_slug]
    var mainSchema_ipns = oMainSchema.metaData.ipns;
    var pCG = "/plex/conceptGraphs/";
    var pCG0_old = pCG + mainSchema_ipns + "/";
    var aInfluenceTypes = await fetchInfluenceTypes(pCG0_old);

    for (var i=0;i<aInfluenceTypes.length;i++) {
        var oNextInfluenceType = aInfluenceTypes[i];
        var nextInfluenceType_influenceTypeSlug = oNextInfluenceType.influenceTypeData.slug;

        var nextInfluenceType_associatedContextGraph_slug = oNextInfluenceType.influenceTypeData.contextGraph.slug;
        // var oContextGraph = window.lookupWordBySlug[nextInfluenceType_associatedContextGraph_slug]
        var oContextGraph = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,nextInfluenceType_associatedContextGraph_slug);
        var aContexts = oContextGraph.schemaData.nodes;
        for (var z=0;z<aContexts.length;z++) {
            var oNC = aContexts[z];
            var nextContext_slug = oNC.slug;
            // var oNextContext = window.lookupWordBySlug[nextContext_slug]
            var oNextContext = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,nextContext_slug);
            var nextContext_contextSlug = oNextContext.contextStructuredData_contextData.slug;

            var compositeScoreType =  nextInfluenceType_influenceTypeSlug + "_" + nextContext_contextSlug
            aCompositeUserTrustScoreTypes.push(compositeScoreType)
        }
    }
    for (var x=0;x<aCompositeUserTrustScoreTypes.length;x++) {
        var nextType = aCompositeUserTrustScoreTypes[x];
        lookupCompositeUserTrustScoreNumberByType[nextType] = x;
    }
    return aCompositeUserTrustScoreTypes;
}

const makeInfluenceTypeSelector = async () => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
    console.log("makeInfluenceTypeSelector")
    // var mainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug
    var mainSchema_slug = "mainSchemaForConceptGraph";
    // var oMainSchema = window.lookupWordBySlug[mainSchema_slug]
    var oMainSchema = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,mainSchema_slug);
    var mainSchema_ipns = oMainSchema.metaData.ipns;
    var pCG = "/plex/conceptGraphs/";
    var pCG0_old = pCG + mainSchema_ipns + "/";

    var aInfluenceTypes = await fetchInfluenceTypes(pCG0_old);
    console.log("aInfluenceTypes: "+JSON.stringify(aInfluenceTypes,null,4))

    var selectorHTML = "";
    selectorHTML += "<select id='influenceTypeSelector' >";
    for (var z=0;z<aInfluenceTypes.length;z++) {
        var oNextInfluenceType = aInfluenceTypes[z];
        var nextInfluenceType_name = oNextInfluenceType.influenceTypeData.name;
        var nextInfluenceType_title = oNextInfluenceType.influenceTypeData.title;
        var nextInfluenceType_slug = oNextInfluenceType.influenceTypeData.slug;
        var nextInfluenceType_associatedContextGraph_slug = oNextInfluenceType.influenceTypeData.contextGraph.slug;
        selectorHTML += "<option ";
        selectorHTML += " data-contextgraphslug='"+nextInfluenceType_associatedContextGraph_slug+"' ";
        selectorHTML += " data-influencetypeslug='"+nextInfluenceType_slug+"' ";
        if (nextInfluenceType_name=="attention") {
            selectorHTML += " selected ";
        }
        selectorHTML += " >";
        selectorHTML += nextInfluenceType_name;
        selectorHTML += "</option>";
    }
    selectorHTML += "</select>";
    jQuery("#influenceTypeSelectorContainer").html(selectorHTML)
    makeContextSelector()
    jQuery("#influenceTypeSelector").change(function(){
        makeContextSelector()
    })
}


var oCompositeScoreTypeInheritanceLookup = {}
// This function duplicates some of the work performed in the functions which create selectors for influence type and context;
// Ultimately those functions should be rewritten, replacing every instance of window.lookupWordBySlug[] with await ConceptGraphInMfsFunctions.lookupWordBySlug()
// In addition: parent and child inheritance should be calculated by concept-specific NeuroCore modules (sets of actions + patterns) for influenceType, contexts, etc
const determineCompositeScoreInheritance = async () => {
    oCompositeScoreTypeInheritanceLookup["allInfluenceTypes_allContexts"] = {};
    oCompositeScoreTypeInheritanceLookup["allInfluenceTypes_allContexts"].children = [];
    var supersetIt_slug = "supersetFor_influenceType";
    var oSuperset_iT = await ConceptGraphInMfsFunctions.lookupWordBySlug(supersetIt_slug)
    console.log("determineCompositeScoreInheritance; oSuperset_iT: "+JSON.stringify(oSuperset_iT,null,4))
    var aInfluenceTypes = oSuperset_iT.globalDynamicData.specificInstances;
    for (var z=0;z<aInfluenceTypes.length;z++) {
        var iT_slug = aInfluenceTypes[z];
        var oInfluenceType = await ConceptGraphInMfsFunctions.lookupWordBySlug(iT_slug)
        var iT_iTSlug = oInfluenceType.influenceTypeData.slug;
        var cG_slug = oInfluenceType.influenceTypeData.contextGraph.slug;
        var oConceptGraph = await ConceptGraphInMfsFunctions.lookupWordBySlug(cG_slug)
        var aNodes = oConceptGraph.schemaData.nodes;
        var aRels = oConceptGraph.schemaData.relationships;
        for (var n=0;n<aNodes.length;n++) {
            var c_slug = aNodes[n].slug;
            var oContext = await ConceptGraphInMfsFunctions.lookupWordBySlug(c_slug)
            // console.log("determineCompositeScoreInheritance; c_slug: "+c_slug)
            var c_cSlug = oContext.contextStructuredData_contextData.slug;
            var compositeScoreType = iT_iTSlug + "_" + c_cSlug;
            oCompositeScoreTypeInheritanceLookup[compositeScoreType] = {};
            oCompositeScoreTypeInheritanceLookup[compositeScoreType].parents = [];
            oCompositeScoreTypeInheritanceLookup[compositeScoreType].children = [];
            console.log("determineCompositeScoreInheritance; compositeScoreType: "+compositeScoreType)
        }
        for (var r=0;r<aRels.length;r++) {
            var oRel = aRels[r];
            var nF_slug = oRel.nodeFrom.slug;
            var rT_slug = oRel.relationshipType.slug;
            var nT_slug = oRel.nodeTo.slug;
            if (rT_slug=="isAChildContextOf") { // this should always be true
                var oNF = await ConceptGraphInMfsFunctions.lookupWordBySlug(nF_slug)
                var oNT = await ConceptGraphInMfsFunctions.lookupWordBySlug(nT_slug)
                var nF_cSlug = oNF.contextStructuredData_contextData.slug;
                var nT_cSlug = oNT.contextStructuredData_contextData.slug;
                var nF_cST = iT_iTSlug + "_" + nF_cSlug;
                var nT_cST = iT_iTSlug + "_" + nT_cSlug;
                oCompositeScoreTypeInheritanceLookup[nF_cST].parents.push(nT_cST)
                oCompositeScoreTypeInheritanceLookup[nT_cST].children.push(nF_cST)
            }
        }
    }
    // top level compositeScoreType(s) for each influence type are children of "allInfluenceTypes_allContexts"
    // find them by looking for compositeScoreTypes with empty parent array
    jQuery.each(oCompositeScoreTypeInheritanceLookup, function(cST,obj){
        console.log("oCompositeScoreTypeInheritanceLookup cST: "+cST+"; obj: "+JSON.stringify(obj,null,4))
        if (cST != "allInfluenceTypes_allContexts") {
            var aPar = obj.parents;
            if (aPar.length==0) {
                oCompositeScoreTypeInheritanceLookup[cST].parents.push("allInfluenceTypes_allContexts")
                oCompositeScoreTypeInheritanceLookup["allInfluenceTypes_allContexts"].children.push(cST)
            }
        }
    })

    console.log("determineCompositeScoreInheritance; oCompositeScoreTypeInheritanceLookup: "+JSON.stringify(oCompositeScoreTypeInheritanceLookup,null,4))
}

const makeContextSelector = async () => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
    var selectorHTML = "";
    selectorHTML += "<select id='contextSelector' >";

    var contextGraph_slug = jQuery("#influenceTypeSelector option:selected").data("contextgraphslug")
    var influenceType_slug = jQuery("#influenceTypeSelector option:selected").data("influencetypeslug")

    // var oContextGraph = window.lookupWordBySlug[contextGraph_slug]
    var oContextGraph = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,contextGraph_slug);
    var aContexts = oContextGraph.schemaData.nodes;
    for (var z=0;z<aContexts.length;z++) {
        var oNC = aContexts[z];
        var nextContext_slug = oNC.slug;
        // var oNextContext = window.lookupWordBySlug[nextContext_slug]
        var oNextContext = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,nextContext_slug);
        var nextContext_contextName = oNextContext.contextStructuredData_contextData.name;
        var nextContext_contextSlug = oNextContext.contextStructuredData_contextData.slug;
        selectorHTML += "<option ";
        selectorHTML += " data-contextslug='"+nextContext_slug+"' ";
        selectorHTML += " data-contextcontextslug='"+nextContext_contextSlug+"' ";
        selectorHTML += " data-contextcontextname='"+nextContext_contextName+"' ";
        if (nextContext_contextName=="everything") {
            selectorHTML += " selected ";
        }
        selectorHTML += " >";
        selectorHTML += nextContext_contextName;
        selectorHTML += "</option>";

        var compositeScoreType = influenceType_slug + "_" + nextContext_slug;
    }
    selectorHTML += "</select>";
    jQuery("#contextSelectorContainer").html(selectorHTML)

    determineCompositeScoreTypeAndNumber()
    jQuery("#contextSelector").change(function(){
        determineCompositeScoreTypeAndNumber()
    })

}

const fetchUsersList = async () => {
    var aUsers = [];
    const peerInfos = await MiscIpfsFunctions.ipfs.swarm.addrs();
    var numPeers = peerInfos.length;
    console.log("numPeers: "+numPeers);

    // var outputHTML = "number of peers: "+numPeers+"<br>";
    // jQuery("#swarmPeersData").html(outputHTML);
    peerInfos.forEach(info => {
        var nextPeerID = info.id;
        aUsers.push(nextPeerID)
        // addPeerToUserList(nextPeerID)
    })
    return aUsers;
}

export const VisNetwork_Grapevine = () => {

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
            }
        });
        network.current.on("deselectEdge",function(params){
        });

        // NODES
        network.current.on("selectNode",function(params){
            // console.log("selectNode event triggered")
            var nodes_arr = params.nodes;
            var numNodes = nodes_arr.length;
            if (numNodes==1) {
                var nodeID = nodes_arr[0];
                var node = nodes.get(nodeID);
                var wordType = node.wordType;

                console.log("selectNode; wordType: "+wordType)
                if (wordType == "user") {
                    var username = node.username;
                    jQuery("#usernameContainer").html(username)
                    jQuery("#peerIDContainer").html(nodeID)
                    jQuery("#changeUserCalcsDisplayButton").get(0).click()
                    jQuery("#compUserTrustScoreCalcPanelContainer").css("display","block")
                    jQuery("#compUpdateProposalVerdictScoreCalcPanelContainer").css("display","none")
                }
                if (wordType == "updateProposal") {
                    var upSlug = node.slug;
                    var upIpns = node.ipns;
                    jQuery("#upSlugContainer").html(upSlug)
                    jQuery("#upIpnsContainer").html(upIpns)
                    jQuery("#changeUpdateProposalCalcsDisplayButton").get(0).click()
                    jQuery("#compUserTrustScoreCalcPanelContainer").css("display","none")
                    jQuery("#compUpdateProposalVerdictScoreCalcPanelContainer").css("display","block")
                }
            }
        });
        network.current.on("deselectNode",function(params){
            jQuery("#usernameContainer").html("none")
        });
      },
      [domNode, network, data, options]
    );

    return (
        <div style={{height:"100%",width:"100%"}} ref = { domNode } />
    );
};

const loadImgURL = async (cid, mime, limit) => {
    if (cid == "" || cid == null || cid == undefined) {
        return false;
    }
    for await (const file of MiscIpfsFunctions.ipfs.get(cid)) {
        if (file.size > limit) {
            return false;
        }
        const content = [];
        if (file.content) {
            for await(const chunk of file.content) {
                content.push(chunk);
            }
            return URL.createObjectURL(new Blob(content, {type: mime}));
        }
    }
}

var lookupUsernameFromPeerID = {};
var lookupAvatarCidFromPeerID = {};
var aVisualizedRatingSlugs = []; // an array of all rating slugs shown in the graph; used for updating edge opacity

const makeVisGraph_updateProposalScoring = async (updateProposalList,userList,aRatingCidsByMe) => {
    console.log("makeVisGraph_updateProposalScoring; updateProposalList: "+JSON.stringify(updateProposalList,null,4))
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
    const oIpfsID = await MiscIpfsFunctions.ipfs.id();
    const myPeerID = oIpfsID.id;
    var nodes_arr = [];
    var nodes_slugs_arr = [];
    var edges_arr = [];
    var showNode = true;
    var listOfPeerIDs = [];

    ////////////// UPDATE PROPOSALS //////////////
    var shape_up = "hexagon";
    var physics_up = false;
    var borderWidth_up = 3;
    var size_up = 25;
    var borderColor_up = "#000000";
    var numUP = updateProposalList.length;
    for (var u=0;u<updateProposalList.length;u++) {
        var nexUP_slug = updateProposalList[u]
        var oUP = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,nexUP_slug);
        var ipns_up = oUP.updateProposalData.ipns;
        var author_username = oUP.updateProposalData.author.username;

        var nextNode_label = nexUP_slug;
        var nextNode_slug = nexUP_slug;
        var nextNode_username = author_username;
        var nextNode_title = nexUP_slug + "\n" + ipns_up;
        var nextNode_wordType = "updateProposal"
        var x_up = 300;
        var y_up = 500 * (u / numUP);

        var showNode = true;
        if (showNode) {
            var nextNode_vis_obj = {
                id: ipns_up,
                ipns: ipns_up,
                label: nextNode_label,
                slug: nextNode_slug,
                username: nextNode_username,
                title: nextNode_title,
                shape: shape_up,
                group: nextNode_wordType,
                wordType: nextNode_wordType,
                conceptRole: null,
                physics: physics_up,
                x: x_up,
                y: y_up,
                borderWidth: borderWidth_up,
                size: size_up,
                color: {
                    color:"#FFFFFF",
                    border: borderColor_up
                }
            }
            // console.log("qwerty_showNode: nextNode_slug: "+nextNode_slug+"; nextNode_vis_obj: "+JSON.stringify(nextNode_vis_obj,null,4))
            nodes_arr = MiscFunctions.pushObjIfNotAlreadyThere(nodes_arr,nextNode_vis_obj)
            nodes_slugs_arr = MiscFunctions.pushIfNotAlreadyThere(nodes_slugs_arr,nextNode_slug)
        }
    }

    ////////////// USERS //////////////
    var physics = true;
    var nextNode_wordType = "user";
    var nextNode_conceptRole = "user"
    for (var u=0;u<userList.length;u++) {
        var nextUserPeerID = userList[u];
        listOfPeerIDs.push(nextUserPeerID)
        var ipfsPath = "/grapevineData/users/"+nextUserPeerID+"/userProfile.txt";
        var nextNode_label = "anon";
        var nextNode_username = "anon";
        var nextNode_title = nextUserPeerID;
        var nextNode_wordType = "user";

        // var pathToImage = "~src/assets/grapevine/users/"+nextUserPeerID+"/avatar.png"
        // var pathToImage = "/grapevine/assets/users/12D3KooWDijvW15ZekGqSTFjkTJ8pTq5Hjm1UdJihq9fDMzeM6Cs/avatar.png"
        // var pathToImage = "localhost:3000/d447dfa5-e37b-478f-8b7b-a715e753fd3d";

        var pathToImage = "";

        // console.log("qwerty start ipfsPath: "+ipfsPath)
        try {
            var chunks = []

            for await (const chunk of MiscIpfsFunctions.ipfs.files.read(ipfsPath)) {
                chunks.push(chunk)
                var chunk2 = new TextDecoder("utf-8").decode(chunk);
                var oUserProfile = JSON.parse(chunk2);
                // console.log("qwerty oUserProfile: "+JSON.stringify(oUserProfile,null,4))
                nextNode_username = oUserProfile.username;
                nextNode_label = oUserProfile.username;
                nextNode_title = oUserProfile.username;

                lookupUsernameFromPeerID[nextUserPeerID] = nextNode_username;

                var nextNode_imageCid = oUserProfile.imageCid;
                lookupAvatarCidFromPeerID[nextUserPeerID] = nextNode_imageCid
                pathToImage = "http://localhost:8080/ipfs/"+nextNode_imageCid;

                if (nextNode_label=="drDave") {
                    var imgURL = await loadImgURL(nextNode_imageCid,"image/png", 524288)
                    console.log(nextNode_label + " imgURL: "+imgURL)
                }

            }
        } catch (e) {
            console.log("qwerty ipfsPath: "+ipfsPath+"; error: "+e)
        }

        var nextNode_slug = nextUserPeerID;

        // var pathToImage = "/grapevine/assets/users/"+nextUserPeerID+"/avatar.png"
        // var pathToImage = "http://localhost:8080/ipfs/QmeZB53kw8XD318LKRTDS2BJDpHWKuBz4Dv47yNwbc2uof";
        // var pathToImage = "http://bafybeihq6bfdneqcomarppbpoojs3ydrpegg4z4ozysppjgyevlilz5opi.ipfs.localhost:8080/";

        electronFs.readFile(pathToImage, (err) => {
            if (err){
                console.log("electronFs nextUserPeerID: "+nextUserPeerID+" err: "+err);
                pathToImage = "/grapevine/assets/users/12D3KooWDijvW15ZekGqSTFjkTJ8pTq5Hjm1UdJihq9fDMzeM6Cs/avatar.png"
            }
            else {
                console.log("director created successfully\n");
            }
        });

        var shape = "circularImage";
        var borderWidth = 1;
        var borderColor = "#000000";
        var size = window.grapevine.defaultNodeSize;

        if (nextUserPeerID == myPeerID) {
            borderWidth = 5;
            var borderColor = "#9900cc";
            size = window.grapevine.defaultNodeSize * 2;
        }

        if (showNode) {
            var nextNode_vis_obj = {
                id: nextUserPeerID,
                label: nextNode_label,
                slug: nextNode_slug,
                username: nextNode_username,
                title: nextNode_title,
                shape: shape,
                image: pathToImage,
                brokenImage: "/grapevine/assets/missingAvatar.png",
                group: nextNode_wordType,
                conceptRole: nextNode_conceptRole,
                wordType: nextNode_wordType,
                physics: physics,
                borderWidth: borderWidth,
                size: size,
                color: {
                    color:"#FFFFFF",
                    border: borderColor
                }
            }
            // console.log("qwerty_showNode: nextNode_slug: "+nextNode_slug+"; nextNode_vis_obj: "+JSON.stringify(nextNode_vis_obj,null,4))
            nodes_arr = MiscFunctions.pushObjIfNotAlreadyThere(nodes_arr,nextNode_vis_obj)
            nodes_slugs_arr = MiscFunctions.pushIfNotAlreadyThere(nodes_slugs_arr,nextNode_slug)
        }
    }

    // aRatingCidsByOthers has been deprecated
    // var aRatingCids = [...aRatingCidsByMe, ...aRatingCidsByOthers];
    var aRatingCids = aRatingCidsByMe

    for (var r=0;r<aRatingCids.length;r++) {
        var nextRatingCid = aRatingCids[r];
        var ipfsPath = nextRatingCid;
        // console.log("ipfsPath: "+ipfsPath)
        for await (const chunk of MiscIpfsFunctions.ipfs.cat(ipfsPath)) {
            // console.info(chunk)
            var chunk2 = new TextDecoder("utf-8").decode(chunk);
            var oRating = JSON.parse(chunk2);
            var rating_wordSlug = oRating.wordData.slug;
            // console.log("rating_wordSlug: "+rating_wordSlug)
            var width = 5;
            var color = "#009933";
            var title = "title";
            var label = "label";
            var opacity = 0.5;

            var aRatingFieldsetNames = oRating.ratingData.ratingFieldsetData.ratingFieldsetNames;
            if (aRatingFieldsetNames.includes("trust fieldset")) {
                var raterPeerID = oRating.ratingData.raterData.userData.peerID;
                var rateePeerID = oRating.ratingData.rateeData.userData.peerID;
                var ratingTemplateTitle = oRating.ratingData.ratingTemplateData.ratingTemplateTitle;
                var trustRating = oRating.ratingData.ratingFieldsetData.trustFieldsetData.trustRating;
                var referenceTrustRating = oRating.ratingData.ratingFieldsetData.trustFieldsetData.referenceTrustRating;
                var transitivity = oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.transitivity;
                var influenceCategoryName = oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.influenceCategoryData.influenceCategoryName;
                var topicName = oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.topicData.topicName;
                width = 5 * Math.sqrt(trustRating / referenceTrustRating);
                label = ratingTemplateTitle;
                title = ratingTemplateTitle;
                title += "\n";
                title += "rater: ";
            }
            if (aRatingFieldsetNames.includes("confidence fieldset")) {
                var confidence = oRating.ratingData.ratingFieldsetData.confidenceFieldsetData.confidence
            }
            if (aRatingFieldsetNames.includes("comments fieldset")) {
                var comments = oRating.ratingData.ratingFieldsetData.confidenceFieldsetData.comments
            }

            if ( (listOfPeerIDs.includes(raterPeerID)) && (listOfPeerIDs.includes(rateePeerID)) ) {
                var nextRel_vis_obj = {
                    id: rating_wordSlug,
                    from: raterPeerID,
                    to: rateePeerID,
                    width: width,
                    color: {
                        color: color,
                        opacity: opacity
                    },
                    title: title,
                    label: label
                }
                edges_arr.push(nextRel_vis_obj)
                aVisualizedRatingSlugs.push(rating_wordSlug)
                // edges_arr = VisjsFunctions.addEdgeWithStyling(edges_arr,nextRel_vis_obj);
                // console.log("adding edge: nextRel_nF_slug: "+nextRel_nF_slug)
            }
        }
    }

    nodes = new DataSet(nodes_arr);
    edges = new DataSet(edges_arr);
    data = {
        nodes,
        edges
    };
    ReactDOM.render(<VisNetwork_Grapevine clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        document.getElementById("grapevineContainerElem")
    )
}

var aUserTrustScores = [];
var aUpdateProposalVerdictScores = [];

var lookupUserNumberByPeerID = {};
var lookupUpdateProposalNumberBySlug = {};

export const setupGrapevineCompositeScoreVars_updateProposal = async (aUpdateProposalSlugs) => {
    var seedUserPeerID = jQuery("#seedUserSelector option:selected").data("peerid")
    for (var u=0;u<aUpdateProposalSlugs.length;u++) {
        var nextSlug = aUpdateProposalSlugs[u];
        lookupUpdateProposalNumberBySlug[nextSlug] = u
    }
    for (var c=0;c<aCompositeUpdateProposalVerdictScoreTypes.length;c++) {
        var nextCSType = aCompositeUpdateProposalVerdictScoreTypes[c];
        aUpdateProposalVerdictScores[c] = {};
        aUpdateProposalVerdictScores[c].compositeScoreNumber = c;
        aUpdateProposalVerdictScores[c].compositeScoreType = nextCSType; //  "standardAverage";
        aUpdateProposalVerdictScores[c].updateProposals = [];
        for (var u=0;u<aUpdateProposalSlugs.length;u++) {
            var nextUpSlug = aUpdateProposalSlugs[u];
            var oUP = await ConceptGraphInMfsFunctions.lookupWordBySlug(nextUpSlug)
            var updateProposalIPNS = oUP.updateProposalData.ipns;
            var authorPeerID = oUP.updateProposalData.author.peerID;
            var authorUsername = oUP.updateProposalData.author.username;
            aUpdateProposalVerdictScores[c].updateProposals[u] = {}
            aUpdateProposalVerdictScores[c].updateProposals[u].slug = "updateProposalVerdictCompositeScoreFor_"+nextUpSlug;
            aUpdateProposalVerdictScores[c].updateProposals[u].name = "update proposal verdict composite score for: "+nextUpSlug;
            aUpdateProposalVerdictScores[c].updateProposals[u].title = "Update Proposal Verdict Composite Score for: "+nextUpSlug;
            aUpdateProposalVerdictScores[c].updateProposals[u].updateProposalNumber = u;
            // aUpdateProposalVerdictScores[c].updateProposals[u].updateProposalSlug = nextUpSlug;
            // aUpdateProposalVerdictScores[c].updateProposals[u].updateProposalIPNS = updateProposalIPNS;
            aUpdateProposalVerdictScores[c].updateProposals[u].updateProposalData = {};
            aUpdateProposalVerdictScores[c].updateProposals[u].updateProposalData.slug = nextUpSlug;
            aUpdateProposalVerdictScores[c].updateProposals[u].updateProposalData.ipns = updateProposalIPNS;
            aUpdateProposalVerdictScores[c].updateProposals[u].updateProposalData.author = {};
            aUpdateProposalVerdictScores[c].updateProposals[u].updateProposalData.author.peerID = authorPeerID;
            aUpdateProposalVerdictScores[c].updateProposals[u].updateProposalData.author.username = authorUsername;

            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData = MiscFunctions.cloneObj(window.compositeUpdateProposalVerdictScoreData);

            aUpdateProposalVerdictScores[c].updateProposals[u].ratings = [] // all ratings where this updateProposal is the ratee
            aUpdateProposalVerdictScores[c].updateProposals[u].defaultRating = {
                rating: 0,
                raterInfluence: 1,
                weight: 0.02,
                weightAdjusted: 0.02,
                product: 0
            } // default updateProposal rating
        }
    }

    // cycle through each rating and populate .ratingsBySlug and .inverseRatingsBySlug
    var setFor_ratings_authoredLocally = window.grapevine.ratings.local.set;
    var setFor_ratings_authoredExternally = window.grapevine.ratings.external.set;
    var oSetLocalGen = await ConceptGraphInMfsFunctions.lookupWordBySlug(setFor_ratings_authoredLocally)
    var oSetExternalGen = await ConceptGraphInMfsFunctions.lookupWordBySlug(setFor_ratings_authoredExternally)
    var aSetLocalGen = oSetLocalGen.globalDynamicData.specificInstances;
    var aSetExternalGen = oSetExternalGen.globalDynamicData.specificInstances;

    var aAllRatings_pre = aSetLocalGen.concat(aSetExternalGen)
    // cycle through aAllRatings_pre and keep only those such that ratingTemplateIPNS = k2k4r8p570pjb0nx2xcldfq6sphb98vqokpxolmw74j4v8ijgr1l4lqj
    // ("ratingTemplateTitle": "Generic User Trust")
    var aAllRatings = [];
    for (var r=0;r<aAllRatings_pre.length;r++) {
        var nextRatingSlug = aAllRatings_pre[r];
        var oRating = await ConceptGraphInMfsFunctions.lookupWordBySlug(nextRatingSlug)
        var ratingTemplateWordSlug = oRating.ratingData.ratingTemplateData.ratingTemplateWordSlug;
        var ratingTemplateTitle = oRating.ratingData.ratingTemplateData.ratingTemplateTitle;
        var ratingTemplateIPNS = oRating.ratingData.ratingTemplateData.ratingTemplateIPNS;
        // if (ratingTemplateIPNS=="k2k4r8o7bep3q0qlwtcn23jph7p09ppww9xohtwzeo60gyan9206xhm0") {
        // if (ratingTemplateWordSlug=="ratingTemplate_rateUpdateProposal_06xhm0") {
        if (ratingTemplateTitle=="Rate Update Proposal") {
            aAllRatings.push(nextRatingSlug)
        }
    }

    for (var r=0;r<aAllRatings.length;r++) {
        var nextRatingSlug = aAllRatings[r];
        var oRating = await ConceptGraphInMfsFunctions.lookupWordBySlug(nextRatingSlug)
        var raterPeerID = oRating.ratingData.raterData.userData.peerID;
        var raterUserNumber = lookupUserNumberByPeerID[raterPeerID];
        var raterUsername = lookupUsernameFromPeerID[raterPeerID];
        var raterAvatarCid = lookupAvatarCidFromPeerID[raterPeerID];

        var rateeSlug = oRating.ratingData.rateeData.updateProposalData.slug;
        var rateeUserNumber = lookupUpdateProposalNumberBySlug[rateeSlug];

        var verdictRating = oRating.ratingData.ratingFieldsetData.booleanVerdictFieldsetData.verdict;
        var rating = 0;
        if ( (verdictRating == true) || (verdictRating == "true") ) {
            rating = 1;
        }
        if ( (verdictRating == false) || (verdictRating == "false") ) {
            rating = -1;
        }
        var ratingConfidence = oRating.ratingData.ratingFieldsetData.confidenceFieldsetData.confidence;

        var compositeScoreType_thisRating = "standardAverage";
        for (var c=0;c<aCompositeUpdateProposalVerdictScoreTypes.length;c++) {
            var nextCSType = aUpdateProposalVerdictScores[c].compositeScoreType;
            if (nextCSType == compositeScoreType_thisRating) {
                console.log("Got a hit! nextCSType: "+nextCSType)
                var numR = aUpdateProposalVerdictScores[c].updateProposals[rateeUserNumber].ratings.length;
                aUpdateProposalVerdictScores[c].updateProposals[rateeUserNumber].ratings[numR] = {}
                aUpdateProposalVerdictScores[c].updateProposals[rateeUserNumber].ratings[numR].ratingNumber = r;
                aUpdateProposalVerdictScores[c].updateProposals[rateeUserNumber].ratings[numR].ratingSlug = nextRatingSlug;
                aUpdateProposalVerdictScores[c].updateProposals[rateeUserNumber].ratings[numR].raterUserNumber = raterUserNumber;
                aUpdateProposalVerdictScores[c].updateProposals[rateeUserNumber].ratings[numR].raterPeerID = raterPeerID;
                aUpdateProposalVerdictScores[c].updateProposals[rateeUserNumber].ratings[numR].raterUsername = raterUsername;
                aUpdateProposalVerdictScores[c].updateProposals[rateeUserNumber].ratings[numR].raterAvatarCid = raterAvatarCid;
                aUpdateProposalVerdictScores[c].updateProposals[rateeUserNumber].ratings[numR].raterInfluence = null;

                aUpdateProposalVerdictScores[c].updateProposals[rateeUserNumber].ratings[numR].verdictRating = verdictRating;
                aUpdateProposalVerdictScores[c].updateProposals[rateeUserNumber].ratings[numR].rating = rating;
                aUpdateProposalVerdictScores[c].updateProposals[rateeUserNumber].ratings[numR].product = null;
                aUpdateProposalVerdictScores[c].updateProposals[rateeUserNumber].ratings[numR].ratingAuthorInfluence = 0.5;

                aUpdateProposalVerdictScores[c].updateProposals[rateeUserNumber].ratings[numR].weight = null;

                aUpdateProposalVerdictScores[c].updateProposals[rateeUserNumber].ratings[numR].ratingConfidence = ratingConfidence;
            }
        }
    }
}

export const setupGrapevineCompositeScoreVars_user = async (aUserPeerIDs) => {
    var seedUserPeerID = jQuery("#seedUserSelector option:selected").data("peerid")
    for (var u=0;u<aUserPeerIDs.length;u++) {
        var nextPeerID = aUserPeerIDs[u];
        lookupUserNumberByPeerID[nextPeerID] = u
    }
    var oIpfsID = await MiscIpfsFunctions.ipfs.id();
    var myPeerID = oIpfsID.id;
    // cycle through each type of composite score, then through each user
    // initialize data object
    var myUserNumber = null;
    for (var c=0;c<aCompositeUserTrustScoreTypes.length;c++) {
        var nextCSType = aCompositeUserTrustScoreTypes[c];
        aUserTrustScores[c] = {};
        aUserTrustScores[c].compositeScoreNumber = c;
        aUserTrustScores[c].compositeScoreType = nextCSType;
        aUserTrustScores[c].users = []
        for (var u=0;u<aUserPeerIDs.length;u++) {
            var nextPeerID = aUserPeerIDs[u];
            if (nextPeerID==myPeerID) {
                myUserNumber = u;
            }
            aUserTrustScores[c].users[u] = {}
            aUserTrustScores[c].users[u].userNumber = u;
            aUserTrustScores[c].users[u].peerID = nextPeerID;
            aUserTrustScores[c].users[u].username = lookupUsernameFromPeerID[nextPeerID];
            aUserTrustScores[c].users[u].avatarCid = lookupAvatarCidFromPeerID[nextPeerID];
            aUserTrustScores[c].users[u].seedUser = false;
            aUserTrustScores[c].users[u].compositeScoreData = MiscFunctions.cloneObj(window.compositeUserTrustScoreData);
            if (nextPeerID == seedUserPeerID) {
                aUserTrustScores[c].users[u].compositeScoreData.seedUser = true;
                aUserTrustScores[c].users[u].compositeScoreData.selectedUser = true;
                aUserTrustScores[c].users[u].compositeScoreData.radiusMultiplier = 1.5;
                aUserTrustScores[c].users[u].compositeScoreData.standardCalculations.certainty = 100;
                aUserTrustScores[c].users[u].compositeScoreData.standardCalculations.average = 1;
                aUserTrustScores[c].users[u].compositeScoreData.standardCalculations.influence = 1
                aUserTrustScores[c].users[u].compositeScoreData.standardCalculations.input = 1000
            }
            aUserTrustScores[c].users[u].ratings = [] // all ratings where this user is the ratee
            aUserTrustScores[c].users[u].defaultRating = {} // default user rating
            aUserTrustScores[c].users[u].inheritedRatings = [] // inherited user rating (from separate Composite Score)
            aUserTrustScores[c].users[u].inverseRatings = [] // all ratings where this user is the rater
            // aUserTrustScores[c].users[u].calcDataRow = {}
            // aUserTrustScores[c].users[u].calcDataRow.default = MiscFunctions.cloneObj(window.calculationDataRow);
        }
    }

    // cycle through each rating and populate .ratingsBySlug and .inverseRatingsBySlug
    var setFor_ratings_authoredLocally = window.grapevine.ratings.local.set;
    var setFor_ratings_authoredExternally = window.grapevine.ratings.external.set;
    var oSetLocalGen = await ConceptGraphInMfsFunctions.lookupWordBySlug(setFor_ratings_authoredLocally)
    var oSetExternalGen = await ConceptGraphInMfsFunctions.lookupWordBySlug(setFor_ratings_authoredExternally)
    var aSetLocalGen = oSetLocalGen.globalDynamicData.specificInstances;
    var aSetExternalGen = oSetExternalGen.globalDynamicData.specificInstances;

    var aAllRatings_pre = aSetLocalGen.concat(aSetExternalGen)
    // cycle through aAllRatings_pre and keep only those such that ratingTemplateIPNS = k2k4r8p570pjb0nx2xcldfq6sphb98vqokpxolmw74j4v8ijgr1l4lqj
    // ("ratingTemplateTitle": "Generic User Trust")
    var aAllRatings = [];
    for (var r=0;r<aAllRatings_pre.length;r++) {
        var nextRatingSlug = aAllRatings_pre[r];
        var oRating = await ConceptGraphInMfsFunctions.lookupWordBySlug(nextRatingSlug)
        var ratingTemplateWordSlug = oRating.ratingData.ratingTemplateData.ratingTemplateWordSlug;
        var ratingTemplateTitle = oRating.ratingData.ratingTemplateData.ratingTemplateTitle;
        var ratingTemplateIPNS = oRating.ratingData.ratingTemplateData.ratingTemplateIPNS;
        // if (ratingTemplateIPNS=="k2k4r8p570pjb0nx2xcldfq6sphb98vqokpxolmw74j4v8ijgr1l4lqj") {
        // if (ratingTemplateWordSlug=="ratingTemplate_genericUserTrust_1l4lqj") {
        if (ratingTemplateTitle=="Generic User Trust") {
            aAllRatings.push(nextRatingSlug)
        }
    }

    // var lookupRatingNumberBySlug = {};
    for (var r=0;r<aAllRatings.length;r++) {
        var nextRatingSlug = aAllRatings[r];
        // lookupRatingNumberBySlug[nextRatingSlug] = r
        var oRating = await ConceptGraphInMfsFunctions.lookupWordBySlug(nextRatingSlug)
        var raterPeerID = oRating.ratingData.raterData.userData.peerID;
        var rateePeerID = oRating.ratingData.rateeData.userData.peerID;
        var raterUserNumber = lookupUserNumberByPeerID[raterPeerID];
        var rateeUserNumber = lookupUserNumberByPeerID[rateePeerID];
        var raterUsername = lookupUsernameFromPeerID[raterPeerID];
        var rateeUsername = lookupUsernameFromPeerID[rateePeerID];
        var raterAvatarCid = lookupAvatarCidFromPeerID[raterPeerID];
        var rateeAvatarCid = lookupAvatarCidFromPeerID[rateePeerID];

        var trustRating = oRating.ratingData.ratingFieldsetData.trustFieldsetData.trustRating;
        var referenceTrustRating = oRating.ratingData.ratingFieldsetData.trustFieldsetData.referenceTrustRating;
        var referencePeerID = oRating.ratingData.ratingFieldsetData.trustFieldsetData.referenceData.userData.peerID;
        var ratingConfidence = oRating.ratingData.ratingFieldsetData.confidenceFieldsetData.confidence;

        var influenceCategoryIPNS = oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.influenceCategoryData.influenceCategoryIPNS
        var influenceCategoryName = oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.influenceCategoryData.influenceCategoryName
        var influenceCategoryWordSlug = oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.influenceCategoryData.influenceCategoryWordSlug
        var oInfluenceCategory = await ConceptGraphInMfsFunctions.lookupWordBySlug(influenceCategoryWordSlug)
        var influenceCategory_influenceTypeSlug = oInfluenceCategory.influenceTypeData.slug;
        var topicIPNS = oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.topicData.topicIPNS
        var topicName = oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.topicData.topicName
        var topicWordSlug = oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.topicData.topicWordSlug
        var oTopic = await ConceptGraphInMfsFunctions.lookupWordBySlug(topicWordSlug)
        var topic_topicSlug = oTopic.contextStructuredData_contextData.slug;
        var compositeScoreType_thisRating = influenceCategory_influenceTypeSlug + "_" +topic_topicSlug;
        for (var c=0;c<aCompositeUserTrustScoreTypes.length;c++) {
            var nextCSType = aUserTrustScores[c].compositeScoreType;
            if (nextCSType == compositeScoreType_thisRating) {
                console.log("Got a hit! nextCSType: "+nextCSType)
                var numR = aUserTrustScores[c].users[rateeUserNumber].ratings.length;
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR] = {}
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR].ratingNumber = r;
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR].ratingSlug = nextRatingSlug;
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR].raterUserNumber = raterUserNumber;
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR].raterPeerID = raterPeerID;
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR].raterUsername = raterUsername;
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR].raterAvatarCid = raterAvatarCid;
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR].trustRating = trustRating;
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR].referenceTrustRating = referenceTrustRating;
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR].product = null;
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR].ratingAuthorInfluence = 0.5;
                if (referenceTrustRating) {
                    aUserTrustScores[c].users[rateeUserNumber].ratings[numR].rating = (trustRating / referenceTrustRating).toPrecision(4);
                }
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR].strat1Coeff = null;
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR].weightAdjusted = null;
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR].weight = null;
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR].raterInfluence = null;
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR].ratingConfidence = ratingConfidence;
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR].strat2Coeff = null;
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR].strat3Coeff = null;
                aUserTrustScores[c].users[rateeUserNumber].ratings[numR].attenuationFactor = null;
                aUserTrustScores[c].users[rateeUserNumber].fooR = {};

                var numIr = aUserTrustScores[c].users[raterUserNumber].inverseRatings.length;
                aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr] = {}
                aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].ratingNumber = r;
                aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].ratingSlug = nextRatingSlug;
                aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].rateeUserNumber = rateeUserNumber;
                aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].rateePeerID = rateePeerID;
                aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].rateeUsername = rateeUsername;
                aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].rateeAvatarCid = rateeAvatarCid;
                aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].trustRating = trustRating;
                aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].referenceTrustRating = referenceTrustRating;
                aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].product = null;
                if (trustRating) {
                    aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].rating = (referenceTrustRating / trustRating).toPrecision(4);
                }
                aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].strat1Coeff = null;
                aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].weightAdjusted = null;
                aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].weight = null;
                aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].raterInfluence = null;
                aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].ratingConfidence = ratingConfidence;
                aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].strat2Coeff = null;
                aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].strat3Coeff = null;
                aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].attenuationFactor = null;
                aUserTrustScores[c].users[raterUserNumber].fooIR = {};
                // the "rating" for inverseRating is the reciprocal of the rating for normal rating
                if (trustRating) {
                    aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].rating = (referenceTrustRating / trustRating).toPrecision(4);
                }
                if ((trustRating == 0) && (referenceTrustRating > 0)) {
                    // technically this would be infinite, but 1000 will suffice
                    aUserTrustScores[c].users[raterUserNumber].inverseRatings[numIr].rating = 1000;
                }
            }
            // aUserTrustScores[c].users[myUserNumber].ratings
        }
    }
}

const singleIterationCompositeUpdateProposalVerdictScoreCalculations = async (compScoreDisplayPanelData) => {
    // need to replace compositeUserTrustScoreNumberBeingViewedContainer with
    // a new var for the score being used in this calc (e.g. the one corresponding to ontology, plexOntology)
    // (will need another set of selectors)
    var seedUserPeerID = jQuery("#seedUserSelector option:selected").data("peerid")
    var compScoreNumber = jQuery("#compositeUpdateProposalVerdictScoreNumberBeingViewedContainer").html()
    for (var c=0;c<aUpdateProposalVerdictScores.length;c++) { // as of 4 Nov 2022, length will be 1; the only verdictScore type is "standardAverage"
        for (var u=0;u<aUpdateProposalVerdictScores[c].updateProposals.length;u++) {
            var sumOfProducts = 0;
            var sumOfProducts_true = 0;
            var sumOfProducts_false = 0;
            var sumOfWeights = 0;
            var sumOfWeights_true = 0;
            var sumOfWeights_false = 0;
            var rigor = compScoreDisplayPanelData.rigor
            // var up_ipns = aUpdateProposalVerdictScores[c].updateProposals[u].updateProposalIPNS; // may not need this
            // var up_slug = aUpdateProposalVerdictScores[c].updateProposals[u].updateProposalSlug; // may not need this
            var up_ipns = aUpdateProposalVerdictScores[c].updateProposals[u].updateProposalData.ipns; // may not need this
            var up_slug = aUpdateProposalVerdictScores[c].updateProposals[u].updateProposalData.slug; // may not need this
            for (var r=0;r<aUpdateProposalVerdictScores[c].updateProposals[u].ratings.length;r++) {
                var nextRatingSlug = aUpdateProposalVerdictScores[c].updateProposals[u].ratings[r].ratingSlug // may not need this
                var raterUserNumber = aUpdateProposalVerdictScores[c].updateProposals[u].ratings[r].raterUserNumber;

                var raterCurrentAverage = aUserTrustScores[compScoreNumber].users[raterUserNumber].compositeScoreData.standardCalculations.average;
                var raterCurrentInfluence = aUserTrustScores[compScoreNumber].users[raterUserNumber].compositeScoreData.standardCalculations.influence;
                var ratingConfidence = aUpdateProposalVerdictScores[c].updateProposals[u].ratings[r].ratingConfidence
                var rating = aUpdateProposalVerdictScores[c].updateProposals[u].ratings[r].rating;
                var ratingConfidence_norm = ratingConfidence / 100;

                var verdictRating = aUpdateProposalVerdictScores[c].updateProposals[u].ratings[r].verdictRating;

                // do calculations
                var weight = raterCurrentInfluence * ratingConfidence_norm;
                var weightAdjusted = weight; // ? no need for adjustment in these rows; default score however will require adjustment
                var product = weightAdjusted * rating;

                if (rating==1) {
                    sumOfWeights_true += weightAdjusted;
                    sumOfProducts_true += product
                }
                if (rating==-1) {
                    sumOfWeights_false += weightAdjusted;
                    sumOfProducts_false += product
                }
                sumOfWeights += weightAdjusted;
                sumOfProducts += product

                // set new values
                aUpdateProposalVerdictScores[c].updateProposals[u].ratings[r].raterInfluence = parseFloat(raterCurrentInfluence.toPrecision(4));;
                aUpdateProposalVerdictScores[c].updateProposals[u].ratings[r].weight = parseFloat(weight.toPrecision(4));
                aUpdateProposalVerdictScores[c].updateProposals[u].ratings[r].weightAdjusted = parseFloat(weightAdjusted.toPrecision(4));
                aUpdateProposalVerdictScores[c].updateProposals[u].ratings[r].product = parseFloat(product.toPrecision(4));
                // aUpdateProposalVerdictScores[c].updateProposals[u].ratings[r].ratingAuthorInfluence = raterCurrentInfluence;

            }

            // add Default User Score
            // do calculations
            // aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.true.average = 0;
            // aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.false.average = 0;
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.sum.average = 0;

            var defaultUpdateProposalVerdictAverageScore = compScoreDisplayPanelData.defaultUpdateProposalVerdictAverageScore
            var defaultUpdateProposalVerdictConfidence = compScoreDisplayPanelData.defaultUpdateProposalVerdictConfidence

            var raterCurrentInfluence_default = 1;

            var rating_default = defaultUpdateProposalVerdictAverageScore;
            var ratingConfidence_default = defaultUpdateProposalVerdictConfidence;

            var weight_default = (ratingConfidence_default * raterCurrentInfluence_default);
            var weightAdjusted_default = weight_default - sumOfWeights;
            if (weightAdjusted_default < 0) { weightAdjusted_default = 0}
            var sumOfWeightsWithoutDefault = sumOfWeights;
            sumOfWeights += weightAdjusted_default;
            var product_default = (weightAdjusted_default * rating_default);
            sumOfProducts += product_default

            // set new values
            aUpdateProposalVerdictScores[c].updateProposals[u].defaultRating = {}
            aUpdateProposalVerdictScores[c].updateProposals[u].defaultRating.rating = parseFloat(rating_default.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].defaultRating.raterInfluence = parseFloat(raterCurrentInfluence_default.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].defaultRating.ratingConfidence = parseFloat(ratingConfidence_default.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].defaultRating.weight = parseFloat(weight_default.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].defaultRating.weightAdjusted = parseFloat(weightAdjusted_default.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].defaultRating.product = parseFloat(product_default.toPrecision(4));

            var average = sumOfProducts / sumOfWeights
            var certainty = convertInputToCertainty(sumOfWeights,rigor)
            var certaintyWithoutDefault = convertInputToCertainty(sumOfWeightsWithoutDefault,rigor)
            var certainty_true = convertInputToCertainty(sumOfWeights_true,rigor)
            var certainty_false = convertInputToCertainty(sumOfWeights_false,rigor)
            var influence = average * certainty
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.numberOfRatings = aUpdateProposalVerdictScores[c].updateProposals[u].ratings.length
            /*
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.sumOfProducts = parseFloat(sumOfProducts.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.input = parseFloat(sumOfWeights.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.inputWithoutDefault = parseFloat(sumOfWeightsWithoutDefault.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.certainty = parseFloat(certainty.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.average = parseFloat(average.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.influence = parseFloat(influence.toPrecision(4));
            */
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.rigor = parseFloat(rigor.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.seedUser = {}
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.seedUser.peerID = seedUserPeerID;
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.seedUser.username = null;
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.sum.sumOfProducts = parseFloat(sumOfProducts.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.sum.input = parseFloat(sumOfWeights.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.sum.certainty = parseFloat(certainty.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.sum.average = parseFloat(average.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.sum.influence = parseFloat(influence.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.sum.inputWithoutDefault = parseFloat(sumOfWeightsWithoutDefault.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.sum.certaintyWithoutDefault = parseFloat(certaintyWithoutDefault.toPrecision(4));

            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.true.sumOfProducts = parseFloat(sumOfProducts_true.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.true.input = parseFloat(sumOfWeights_true.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.true.certainty = parseFloat(certainty_true.toPrecision(4));

            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.false.sumOfProducts = parseFloat(sumOfProducts_false.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.false.input = parseFloat(sumOfWeights_false.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.false.certainty = parseFloat(certainty_false.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.lastUpdated = Date.now();

            /*
            //
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.numberOfRatings = aUserTrustScores[c].users[u].ratings.length
             = sumOfProducts = parseFloat(sumOfProducts.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.input = parseFloat(sumOfWeights.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.rigor = parseFloat(rigor.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.certainty = parseFloat(certainty.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.average = parseFloat(average.toPrecision(4));
            aUpdateProposalVerdictScores[c].updateProposals[u].compositeScoreData.standardCalculations.influence = parseFloat(influence.toPrecision(4));
            */
            var y_up = - average * 500 //
            // var y_up = 0 //
            // console.log("nodes.update; up_ipns: "+up_ipns)
            nodes.update({id:up_ipns,y:y_up});
        }
    }
}

const singleIterationCompositeUserTrustScoreCalculations = async (compScoreDisplayPanelData) => {
    var nodeSizeRepresentation = jQuery("#nodeSizeRepresentationSelector option:selected").data("value")
    var compScoreNumber = jQuery("#compositeUserTrustScoreNumberBeingViewedContainer").html()
    var seedUserPeerID = jQuery("#seedUserSelector option:selected").data("peerid")
    for (var c=0;c<aUserTrustScores.length;c++) {
        var nextCSType = aUserTrustScores[c].compositeScoreType;
        for (var u=0;u<aUserTrustScores[c].users.length;u++) {
            var nextPeerID = aUserTrustScores[c].users[u].peerID;

            var strat1Coeff = compScoreDisplayPanelData.strat1Coeff
            var strat1Coeff_inverse = compScoreDisplayPanelData.strat1Coeff

            var strat2Coeff_regular = 1 // strat1Coeff only applies to inverseRatings, so is set to unity for (regular) ratings
            var strat2Coeff_inverse = compScoreDisplayPanelData.strat2Coeff

            var strat3Coeff = compScoreDisplayPanelData.strat3Coeff
            var strat4Coeff = compScoreDisplayPanelData.strat4Coeff
            var strat5Coeff = compScoreDisplayPanelData.strat5Coeff
            var attenuationFactor = compScoreDisplayPanelData.attenuationFactor
            var rigor = compScoreDisplayPanelData.rigor

            var defaultUserTrustAverageScore = compScoreDisplayPanelData.defaultUserTrustAverageScore
            var defaultUserTrustConfidence = compScoreDisplayPanelData.defaultUserTrustConfidence

            var sumOfProducts = 0;
            var sumOfWeights = 0;
            for (var r=0;r<aUserTrustScores[c].users[u].ratings.length;r++) {
                // obtain needed values for calculations
                var nextRatingSlug = aUserTrustScores[c].users[u].ratings[r].ratingSlug // may not need this
                if (aVisualizedRatingSlugs.includes(nextRatingSlug)) {
                    // update opacity of this edge
                    var nextRatingCurrentOpacity = aUserTrustScores[c].users[u].ratings[r].ratingAuthorInfluence;
                    // var edgesIDs_arr = edges.getIds();
                    edges.update({id:nextRatingSlug,color: {opacity:nextRatingCurrentOpacity}});
                }
                var rateeUserNumber = u;
                var raterUserNumber = aUserTrustScores[c].users[u].ratings[r].raterUserNumber;
                var raterCurrentAverage = aUserTrustScores[c].users[raterUserNumber].compositeScoreData.standardCalculations.average;
                var raterCurrentInfluence = aUserTrustScores[c].users[raterUserNumber].compositeScoreData.standardCalculations.influence;
                var rateeCurrentInfluence = aUserTrustScores[c].users[rateeUserNumber].compositeScoreData.standardCalculations.influence;
                var trustRating = aUserTrustScores[c].users[u].ratings[r].trustRating;
                var referenceTrustRating = aUserTrustScores[c].users[u].ratings[r].referenceTrustRating;
                // var rating = raterCurrentAverage * (trustRating / referenceTrustRating);
                var rating =  (trustRating / referenceTrustRating);

                var mod1Coeff = raterCurrentAverage * strat1Coeff + 1 * (1 - strat1Coeff)

                var mod3Coeff = convertRatingToMod3Coeff(rating,strat3Coeff,strat4Coeff,strat5Coeff)
                var ratingConfidence = aUserTrustScores[c].users[u].ratings[r].ratingConfidence;
                // ratingConfidence should be recorded in oRatings as a percent and should be an integer (e.g. 75%) but converted here to decimal (e.g. 0.75)
                // But it's possible it was converted to decimal (0.75) at a previous step.
                // If we consider that percent could be a decimal with very low value (e.g. 0.1%) then I'll need to get rid of this check
                // and make sure I am keeping track properly of where the switch from pct to decimal happens
                if (ratingConfidence > 1) {
                    ratingConfidence = ratingConfidence / 100
                }

                // do calculations
                var weight = (attenuationFactor * mod3Coeff * strat2Coeff_regular * ratingConfidence * raterCurrentInfluence);
                // var weight = (attenuationFactor * mod3Coeff * strat2Coeff_regular * strat1Coeff * ratingConfidence * raterCurrentInfluence);
                // sumOfWeights += weight;
                // NEED TO DO FULL ADJUSTED WEIGHT CALCULATION
                var weightAdjusted = weight;
                // var weightAdjusted = weight - sumOfWeights;
                // if (weightAdjusted < 0) { weightAdjusted = 0}
                sumOfWeights += weightAdjusted;
                var product = (weightAdjusted * rating * mod1Coeff);
                sumOfProducts += product

                // set new values
                aUserTrustScores[c].users[u].ratings[r].attenuationFactor = attenuationFactor;
                aUserTrustScores[c].users[u].ratings[r].strat1Coeff = strat1Coeff;
                aUserTrustScores[c].users[u].ratings[r].strat2Coeff = strat2Coeff_regular;
                aUserTrustScores[c].users[u].ratings[r].strat3Coeff = strat3Coeff;
                aUserTrustScores[c].users[u].ratings[r].strat4Coeff = strat4Coeff;
                aUserTrustScores[c].users[u].ratings[r].strat5Coeff = strat5Coeff;
                aUserTrustScores[c].users[u].ratings[r].mod1Coeff = parseFloat(mod1Coeff.toPrecision(4));;
                aUserTrustScores[c].users[u].ratings[r].mod3Coeff = mod3Coeff;
                aUserTrustScores[c].users[u].ratings[r].rating = parseFloat(rating.toPrecision(4));
                aUserTrustScores[c].users[u].ratings[r].raterInfluence = parseFloat(raterCurrentInfluence.toPrecision(4));
                aUserTrustScores[c].users[u].ratings[r].weight = parseFloat(weight.toPrecision(4));
                aUserTrustScores[c].users[u].ratings[r].weightAdjusted = parseFloat(weightAdjusted.toPrecision(4));
                aUserTrustScores[c].users[u].ratings[r].product = parseFloat(product.toPrecision(4));
                aUserTrustScores[c].users[u].ratings[r].ratingAuthorInfluence = raterCurrentInfluence;

            }
            // add Inherited User Score
            // console.log("oCompositeScoreTypeInheritanceLookup nextCSType: "+nextCSType)
            // console.log("oCompositeScoreTypeInheritanceLookup oCompositeScoreTypeInheritanceLookup[nextCSType]: "+JSON.stringify(oCompositeScoreTypeInheritanceLookup[nextCSType],null,4))

            if (nextCSType != "allInfluenceTypes_allContexts") {
                var aParentCSTypes = oCompositeScoreTypeInheritanceLookup[nextCSType].parents;
                for (var p=0;p<aParentCSTypes.length;p++) {
                    var parentCSType = aParentCSTypes[p];
                    var parentCSNumber = lookupCompositeUserTrustScoreNumberByType[parentCSType];

                    var attenuationFactor_inherited = 1
                    var strat1Coeff_inherited = compScoreDisplayPanelData.strat1Coeff
                    var strat2Coeff_inherited = 1
                    var mod3Coeff_inherited = 1
                    var raterCurrentInfluence_inherited = 1;
                    // var rating_inherited = defaultUserTrustAverageScore;
                    var rating_inherited = 0.69;
                    try {
                        rating_inherited = aUserTrustScores[parentCSNumber].users[u].compositeScoreData.standardCalculations.average
                        // rating_inherited = 0.59;
                    } catch(e) {}
                    var ratingConfidence_inherited = defaultUserTrustConfidence;
                    try {
                        ratingConfidence_inherited = aUserTrustScores[parentCSNumber].users[u].compositeScoreData.standardCalculations.certainty
                        // rating_inherited = 0.59;
                    } catch(e) {}

                    var raterCurrentAverage_inherited = aUserTrustScores[parentCSNumber].users[u].compositeScoreData.standardCalculations.average;

                    var weight_inherited = (attenuationFactor_inherited * mod3Coeff_inherited * strat2Coeff_inherited * strat1Coeff_inherited * ratingConfidence_inherited * raterCurrentInfluence_inherited);

                    try {
                        weight_inherited = aUserTrustScores[parentCSNumber].users[u].compositeScoreData.standardCalculations.certainty
                        var weight_inherited_x = aUserTrustScores[parentCSNumber].users[u].compositeScoreData.standardCalculations.input
                        if (weight_inherited_x) {
                            weight_inherited = weight_inherited_x;
                        }
                        // console.log("weight_inherited; typeof: "+typeof weight_inherited + " weight_inherited: "+weight_inherited)
                        // rating_inherited = 0.59;
                    } catch(e) {}

                    // sumOfWeights += weight_inherited;
                    // NEED TO DO FULL ADJUSTED WEIGHT CALCULATION
                    var weightAdjusted_inherited = weight_inherited - sumOfWeights;
                    if (weightAdjusted_inherited < 0) { weightAdjusted_inherited = 0}
                    // var weightAdjusted_inherited = weight_inherited;
                    sumOfWeights += weightAdjusted_inherited;
                    var product_inherited = (weightAdjusted_inherited * rating_inherited);
                    sumOfProducts += product_inherited

                    aUserTrustScores[c].users[u].inheritedRatings[p] = {};
                    aUserTrustScores[c].users[u].inheritedRatings[p].parentCompositeScoreNumber = parentCSNumber;
                    aUserTrustScores[c].users[u].inheritedRatings[p].parentCompositeScoreType = parentCSType;

                    aUserTrustScores[c].users[u].inheritedRatings[p].attenuationFactor = attenuationFactor_inherited;
                    aUserTrustScores[c].users[u].inheritedRatings[p].strat1Coeff = strat1Coeff_inherited;
                    aUserTrustScores[c].users[u].inheritedRatings[p].strat2Coeff = strat2Coeff_inherited;
                    aUserTrustScores[c].users[u].inheritedRatings[p].mod3Coeff = mod3Coeff_inherited;
                    aUserTrustScores[c].users[u].inheritedRatings[p].rating = parseFloat(rating_inherited.toPrecision(4));
                    aUserTrustScores[c].users[u].inheritedRatings[p].raterInfluence = parseFloat(raterCurrentInfluence_inherited.toPrecision(4));
                    aUserTrustScores[c].users[u].inheritedRatings[p].ratingConfidence = parseFloat(ratingConfidence_inherited.toPrecision(4));
                    aUserTrustScores[c].users[u].inheritedRatings[p].weight = parseFloat(weight_inherited.toPrecision(4));
                    aUserTrustScores[c].users[u].inheritedRatings[p].weightAdjusted = parseFloat(weightAdjusted_inherited.toPrecision(4));
                    aUserTrustScores[c].users[u].inheritedRatings[p].product = parseFloat(product_inherited.toPrecision(4));
                }
            }

            // add Default User Score
            var attenuationFactor_default = 1
            var strat1Coeff_default = 1
            var strat2Coeff_default = 1
            var mod3Coeff_default = 1
            var raterCurrentInfluence_default = 1;
            var rating_default = defaultUserTrustAverageScore;
            var ratingConfidence_default = defaultUserTrustConfidence;
            var weight_default = (attenuationFactor_default * mod3Coeff_default * strat2Coeff_default * strat1Coeff_default * ratingConfidence_default * raterCurrentInfluence_default);
            // sumOfWeights += weight_default;
            // NEED TO DO FULL ADJUSTED WEIGHT CALCULATION
            // var weightAdjusted_default = weight_default;
            var weightAdjusted_default = weight_default - sumOfWeights;
            if (weightAdjusted_default < 0) { weightAdjusted_default = 0}
            sumOfWeights += weightAdjusted_default;
            var product_default = (weightAdjusted_default * rating_default);
            sumOfProducts += product_default

            aUserTrustScores[c].users[u].defaultRating = {}
            aUserTrustScores[c].users[u].defaultRating.attenuationFactor = attenuationFactor_default;
            aUserTrustScores[c].users[u].defaultRating.strat1Coeff = strat1Coeff_default;
            aUserTrustScores[c].users[u].defaultRating.strat2Coeff = strat2Coeff_default;
            aUserTrustScores[c].users[u].defaultRating.mod3Coeff = mod3Coeff_default;
            aUserTrustScores[c].users[u].defaultRating.rating = parseFloat(rating_default.toPrecision(4));
            aUserTrustScores[c].users[u].defaultRating.raterInfluence = parseFloat(raterCurrentInfluence_default.toPrecision(4));
            aUserTrustScores[c].users[u].defaultRating.ratingConfidence = parseFloat(ratingConfidence_default.toPrecision(4));
            aUserTrustScores[c].users[u].defaultRating.weight = parseFloat(weight_default.toPrecision(4));
            aUserTrustScores[c].users[u].defaultRating.weightAdjusted = parseFloat(weightAdjusted_default.toPrecision(4));
            aUserTrustScores[c].users[u].defaultRating.product = parseFloat(product_default.toPrecision(4));

            for (var r=0;r<aUserTrustScores[c].users[u].inverseRatings.length;r++) {
                // obtain needed values for calculations

                var nextRatingSlug = aUserTrustScores[c].users[u].inverseRatings[r].ratingSlug
                var raterUserNumber = u;
                var rateeUserNumber = aUserTrustScores[c].users[u].inverseRatings[r].rateeUserNumber;
                var raterCurrentInfluence = aUserTrustScores[c].users[raterUserNumber].compositeScoreData.standardCalculations.influence;
                var rateeCurrentInfluence = aUserTrustScores[c].users[rateeUserNumber].compositeScoreData.standardCalculations.influence;
                var rateeCurrentAverage_inverse = aUserTrustScores[c].users[rateeUserNumber].compositeScoreData.standardCalculations.average;
                var trustRating = aUserTrustScores[c].users[u].inverseRatings[r].trustRating;
                var referenceTrustRating = aUserTrustScores[c].users[u].inverseRatings[r].referenceTrustRating;
                if (trustRating > 0) {
                    // var rating_inverse = rateeCurrentAverage * (referenceTrustRating / trustRating);
                    var rating_inverse = (referenceTrustRating / trustRating);
                }
                if (trustRating == 0) {
                    var rating_inverse = 1000; //
                }
                var mod1Coeff_inverse = rateeCurrentAverage_inverse * strat1Coeff_inverse + 1 * (1 - strat1Coeff_inverse)

                var mod3Coeff_inverse = convertRatingToMod3Coeff(rating_inverse,strat3Coeff,strat4Coeff,strat5Coeff)
                var ratingConfidence = aUserTrustScores[c].users[u].inverseRatings[r].ratingConfidence;
                // ratingConfidence should be recorded in oRatings as a percent and should be an integer (e.g. 75%) but converted here to decimal (e.g. 0.75)
                // But it's possible it was converted to decimal (0.75) at a previous step.
                // If we consider that percent could be a decimal with very low value (e.g. 0.1%) then I'll need to get rid of this check
                // and make sure I am keeping track properly of where the switch from pct to decimal happens
                if (ratingConfidence > 1) {
                    ratingConfidence = ratingConfidence / 100
                }
                // do calculations
                var weight = (attenuationFactor * mod3Coeff_inverse * strat2Coeff_inverse * ratingConfidence * rateeCurrentInfluence);
                sumOfWeights += weight;
                // NEED TO DO FULL ADJUSTED WEIGHT CALCULATION
                var weightAdjusted = weight;
                var product = (weightAdjusted * rating_inverse * mod1Coeff_inverse);
                sumOfProducts += product

                // set new values
                aUserTrustScores[c].users[u].inverseRatings[r].attenuationFactor = attenuationFactor;
                aUserTrustScores[c].users[u].inverseRatings[r].strat1Coeff = strat1Coeff_inverse;
                aUserTrustScores[c].users[u].inverseRatings[r].strat2Coeff = strat2Coeff_inverse;
                aUserTrustScores[c].users[u].inverseRatings[r].strat3Coeff = strat3Coeff;
                aUserTrustScores[c].users[u].inverseRatings[r].mod3Coeff = parseFloat(mod3Coeff_inverse.toPrecision(4));
                aUserTrustScores[c].users[u].inverseRatings[r].mod1Coeff = parseFloat(mod1Coeff_inverse.toPrecision(4));

                aUserTrustScores[c].users[u].inverseRatings[r].rating = parseFloat(rating_inverse.toPrecision(4));
                aUserTrustScores[c].users[u].inverseRatings[r].rateeInfluence = parseFloat(rateeCurrentInfluence.toPrecision(4));
                aUserTrustScores[c].users[u].inverseRatings[r].weight = parseFloat(weight.toPrecision(4));
                aUserTrustScores[c].users[u].inverseRatings[r].weightAdjusted = parseFloat(weightAdjusted.toPrecision(4));
                aUserTrustScores[c].users[u].inverseRatings[r].product = parseFloat(product.toPrecision(4));
            }

            var average = sumOfProducts / sumOfWeights
            var certainty = convertInputToCertainty(sumOfWeights,rigor)
            var influence = average * certainty
            if (seedUserPeerID == nextPeerID) {
                influence = 1;
                average = 1;
                certainty = 1;
            }
            aUserTrustScores[c].users[u].compositeScoreData.numberOfRatings = aUserTrustScores[c].users[u].ratings.length
            aUserTrustScores[c].users[u].compositeScoreData.standardCalculations.sumOfProducts = parseFloat(sumOfProducts.toPrecision(4));
            aUserTrustScores[c].users[u].compositeScoreData.standardCalculations.input = parseFloat(sumOfWeights.toPrecision(4));
            aUserTrustScores[c].users[u].compositeScoreData.standardCalculations.rigor = parseFloat(rigor.toPrecision(4));
            aUserTrustScores[c].users[u].compositeScoreData.standardCalculations.certainty = parseFloat(certainty.toPrecision(4));
            aUserTrustScores[c].users[u].compositeScoreData.standardCalculations.average = parseFloat(average.toPrecision(4));
            aUserTrustScores[c].users[u].compositeScoreData.standardCalculations.influence = parseFloat(influence.toPrecision(4));

            aUserTrustScores[c].users[u].compositeScoreData.lastUpdated = Date.now()

            if (c==compScoreNumber) {
                if (nodeSizeRepresentation=="influence") {
                    var nodeSize = window.grapevine.defaultNodeSize * influence
                }
                if (nodeSizeRepresentation=="average") {
                    var nodeSize = window.grapevine.defaultNodeSize * average
                }
                if (nodeSizeRepresentation=="nothing") {
                    var nodeSize = window.grapevine.defaultNodeSize
                }
                // var nodeIDs_arr = nodes.getIds();
                nodes.update({id:nextPeerID,size:nodeSize,color:{opacity:certainty}});

                // update users table with composite score data if table is visible
                jQuery("#influence_"+nextPeerID).data("result",parseFloat(influence.toPrecision(4)))
                jQuery("#influence_"+nextPeerID).html(parseFloat(influence.toPrecision(4)))

                jQuery("#average_"+nextPeerID).data("result",parseFloat(average.toPrecision(4)))
                jQuery("#average_"+nextPeerID).html(parseFloat(average.toPrecision(4)))

                jQuery("#certainty_"+nextPeerID).data("result",parseFloat(certainty.toPrecision(4)))
                jQuery("#certainty_"+nextPeerID).html(parseFloat(certainty.toPrecision(4)))

                jQuery("#input_"+nextPeerID).data("result",parseFloat(sumOfWeights.toPrecision(4)))
                jQuery("#input_"+nextPeerID).html(parseFloat(sumOfWeights.toPrecision(4)))

                // jQuery("#influence_"+nextPeerID).val(parseFloat(influence.toPrecision(4)))
                // jQuery("#average_"+nextPeerID).val(parseFloat(average.toPrecision(4)))
                // jQuery("#certainty_"+nextPeerID).val(parseFloat(certainty.toPrecision(4)))
                // jQuery("#input_"+nextPeerID).val(parseFloat(sumOfWeights.toPrecision(4)))
            }
        }
    }
}

const convertRatingToMod3Coeff = (r,s3,s4,s5) => {
    if (r < 1) {
        var mod3Coeff = 1;
        return mod3Coeff;
    }
    // console.log("r,s3,s4,s5,mod3Coeff: s4: "+ s4)
    var s3z = 1 / (1 - s3);
    var logRat = Math.log(r) / Math.log(s5);
    logRat = Math.abs(logRat);
    if (s4 > 0) {
        var logRatExp = Math.pow(logRat,s4);
    } else {
        var logRatExp = logRat;
    }
    var logRatExp = Math.pow(logRat,s4);
    var mod3Coeff = Math.pow(s3z,-logRatExp);
    // console.log("r,s3,s4,s5,mod3Coeff: "+r+" "+s3+" "+s4+" "+s5+" "+mod3Coeff)
    // console.log("r,s3,s4,s5,mod3Coeff: typeof s4: "+typeof s4)

    return mod3Coeff;
}

const convertInputToCertainty = (input,rigor) => {
    var rigority = - Math.log(rigor)
    var fooB = - input * rigority
    var fooA = Math.exp(fooB);
    var certainty = (1 - fooA)
    return certainty;
}

const runGrapevineCompositeScoreCalculations = async () => {
    // set up a loop to call singleIterationCompositeUserTrustScoreCalculations repeatedly
}

var defUpCon = window.grapevine.starterDefaultUpdateProposalVerdictConfidence / 100
var defUpAvg = window.grapevine.starterDefaultUpdateProposalVerdictAverageScore / 100
// var defUpInf = parseFloat((defUpCon * defUpAvg).toPrecision(4));

var defCon = window.grapevine.starterDefaultUserTrustConfidence / 100
var defAvg = window.grapevine.starterDefaultUserTrustAverageScore / 100
var defInf = parseFloat((defCon * defAvg).toPrecision(4));
window.compositeUpdateProposalVerdictScoreData = {
    numberOfRatings: 0,
    standardCalculations: {
        true: {
            sumOfProducts: null,
            input: null,
            certainty: defUpCon,
        },
        false: {
            sumOfProducts: null,
            input: null,
            certainty: defUpCon,
        },
        sum: {
            sumOfProducts: null,
            input: null,
            certainty: defUpCon,
            average: defUpAvg,
        }
    },
    lastUpdated: null,
}
window.compositeUserTrustScoreData = {
    seedUser: false,
    selectedUser: false,
    numberOfRatings: 0,
    radiusMultiplier: 1,
    standardCalculations: {
        sumOfProducts: null,
        certainty: defCon,
        input: null,
        inputWithoutStrat2: null,
        average: defAvg,
        influence: defInf
    },
    notIncludingDefaults: {
        sumOfProducts: 0,
        certainty: 0,
        input: 0,
        inputWithoutStrat2: 0,
        average: 0,
        influence: 0,
    },
    lastUpdated: null,
}
window.calculationDataRow = {
    rater: null,
    product: null,
    rating: null,
    strat1Coeff: null,
    weightAdjusted: null,
    weight: null,
    raterInfluence: null,
    ratingConfidence: null,
    strat2Coeff: null,
    strat3Coeff: null,
    attenuationFactor: window.grapevine.starterDefaultAttenuationFactor / 100,
    lastUpdated: null
}

// each influenceType / context pair gives rise to one compositeUserTrustScoreType
var aCompositeUserTrustScoreTypes = [];

// For now (4 Nov 2022), there will be only one aCompositeUpdateProposalVerdictScoreType, which will be called "standardAverage;" in the future, may come up with more types
// The individual verdict ratings are boolean, with true = approve = endorse and false = disapprove = reject
// standardAverage composite score will calculate:
// the weight of true scores (sum of rater influence + confidence) and the weight of false scores
// the total weight (weight true - weight false)
// the confidence of the true score, false score, and total score
// This will be a standard way to process boolean ratings variables
// Presumably, other ways may also be proposed.
var aCompositeUpdateProposalVerdictScoreTypes = [];

const createSeedUserSelector = async (masterUserList,myPeerID) => {
    var selectorHTML = "";
    selectorHTML += "<select id='seedUserSelector' ";
    selectorHTML += " >";
    for (var u=0;u<masterUserList.length;u++) {
        var nextUserPeerID = masterUserList[u];
        var nextUserUsername = lookupUsernameFromPeerID[nextUserPeerID]
        selectorHTML += "<option ";
        selectorHTML += " data-peerid='"+nextUserPeerID+"' ";
        if (nextUserPeerID==myPeerID) {
            selectorHTML += " selected ";
        }
        selectorHTML += " >";
        selectorHTML += nextUserUsername;
        selectorHTML += "</option>";
    }
    selectorHTML += "</select>";

    jQuery("#seedUserSelectorContainer").html(selectorHTML)
}

const determineCompositeScoreTypeAndNumber = () => {
    var influenceType_slug = jQuery("#influenceTypeSelector option:selected").data("influencetypeslug")
    var context_contextSlug = jQuery("#contextSelector option:selected").data("contextcontextslug")

    var cST = influenceType_slug+"_"+context_contextSlug;
    var cSN = lookupCompositeUserTrustScoreNumberByType[cST];

    jQuery("#compositeScoreTypeContainer").html(cST)
    jQuery("#compositeUserTrustScoreNumberBeingViewedContainer").html(cSN)
}

// return array of slugs of all known updateProposals from the specified local concept graph
// array comes from all specific instances in superset of conceptFor_updateProposal
const returnArrayOfUpdateProposals_specifyConceptGraph = async (ipns) => {
    var aUpdateProposalList = [];
    var concept_up_slug = "conceptFor_updateProposal";
    var oConcept_up = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(ipns,concept_up_slug);
    var superset_up_slug = oConcept_up.conceptData.nodes.superset.slug;
    var oSuperset_up = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(ipns,superset_up_slug);
    aUpdateProposalList = oSuperset_up.globalDynamicData.specificInstances;

    return aUpdateProposalList;
}

export default class ConceptGraphsFrontEndVisualizeScoreCalculationsOfUpdateProposals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
            masterUsersList: [],
            masterUpdateProposalsList: [],
            compScoreDisplayPanelData: {
                attenuationFactor: window.grapevine.starterDefaultAttenuationFactor / 100,
                rigor: window.grapevine.starterRigor / 100,
                defaultUpdateProposalVerdictAverageScore: window.grapevine.starterDefaultUpdateProposalVerdictAverageScore / 100,
                defaultUpdateProposalVerdictConfidence: window.grapevine.starterDefaultUpdateProposalVerdictConfidence / 100,
                defaultUserTrustAverageScore: window.grapevine.starterDefaultUserTrustAverageScore / 100,
                defaultUserTrustConfidence: window.grapevine.starterDefaultUserTrustConfidence / 100,
                strat1Coeff: window.grapevine.starterStrat1Coeff / 100,
                strat2Coeff: window.grapevine.starterStrat2Coeff / 100,
                strat3Coeff: window.grapevine.starterStrat3Coeff / 100,
                strat4Coeff: window.grapevine.starterStrat4Coeff / 100,
                strat5Coeff: window.grapevine.starterStrat5Coeff / 100,
            },
            topLevelTrustCalculations: {
                defaultUserTrustScoreData: {

                }
            },
            contactLinks: [],
            oSingleUpdateProposalVerdictScores: {
                slug: null,
                name: null,
                title: null,
                updateProposalNumber: 0,
                updateProposalData: {
                    updateProposalIPNS: "--k2k4r8kw8hotgp7k85n1lf24rit3oonwxv0vxpn4bup63w9ar4curvqs",
                    updateProposalSlug: "--conceptUpdateProposal_curvqs",
                    author: {
                        peerID: "--qrstu67890",
                        username: "--johnDoe",
                    }
                },
                compositeScoreData: {
                    numberOfRatings: 0,
                    standardCalculations: {
                        rigor: null,
                        seedUser: {
                            peerID: null,
                            username: null
                        },
                        true: {
                            sumOfProducts: 0,
                            input: 0,
                            certainty: 0,
                        },
                        false: {
                            sumOfProducts: 0,
                            input: 0,
                            certainty: 0,
                        },
                        sum: {
                            sumOfProducts: 0,
                            input: 0,
                            certainty: 0,
                            average: null,
                            influence: null,
                            inputWithoutDefault: 0,
                            certaintyWithoutDefault: 0,
                        }
                    }
                },
                ratings: [

                ],
                defaultRating: {
                    rating: 0,
                    raterInfluence: 1,
                    weight: 0.02,
                    weightAdjusted: 0.02,
                    product: 0
                }
            },
            oSingleUserGrapevineScores: {
                "userNumber": 0,
                "peerID": "12D3KooWJpiTmrQGWG9oThj6MAMhMmm756htH2Co1TT6LsPsBWki",
                "username": "drDave",
                "avatarCid": "QmbRs5wrimekB4ChruzzokihpyrnMDGeFHkYqLkB1F53ho",
                "seedUser": false,
                "compositeScoreData": {
                    "seedUser": false,
                    "selectedUser": false,
                    "numberOfRatings": 1,
                    "radiusMultiplier": 1,
                    "standardCalculations": {
                        "sumOfProducts": 0.01283,
                        "certainty": 0.01806,
                        "input": 0.01784,
                        "inputWithoutStrat2": null,
                        "average": 0.7193,
                        "influence": 0.01299,
                        "rigor": 0.36
                    },
                    "notIncludingDefaults": {
                        "sumOfProducts": 0,
                        "certainty": 0,
                        "input": 0,
                        "inputWithoutStrat2": 0,
                        "average": 0,
                        "influence": 0
                    },
                    "lastUpdated": null
                },
                "ratings": [
                    {
                        "ratingNumber": 5,
                        "ratingSlug": "ratingOf_PsBWki_by_XaXtKQ_acxsu9",
                        "raterUserNumber": 2,
                        "raterPeerID": "QmWpLB32UFkrVTDHwstrf8wdFSen5kbrs1TGEzu8XaXtKQ",
                        "trustRating": "100.00",
                        "referenceTrustRating": "100.00",
                        "product": 0.01283,
                        "rating": 1,
                        "strat1Coeff": 0.81,
                        "weightAdjusted": 0.01584,
                        "weight": 0.01584,
                        "raterInfluence": 0.02,
                        "ratingConfidence": "88.00",
                        "strat2Coeff": 1,
                        "strat3Coeff": 1,
                        "attenuationFactor": 0.9
                    },
                    {
                        "ratingNumber": 6,
                        "ratingSlug": "ratingOf_PsBWki_by_XaXtKQ_acxsu9",
                        "raterUserNumber": 2,
                        "raterPeerID": "QmWpLB32UFkrVTDHwstrf8wdFSen5kbrs1TGEzu8XaXtKQ",
                        "trustRating": "100.00",
                        "referenceTrustRating": "100.00",
                        "product": 0.01283,
                        "rating": 1,
                        "strat1Coeff": 0.81,
                        "weightAdjusted": 0.01584,
                        "weight": 0.01584,
                        "raterInfluence": 0.02,
                        "ratingConfidence": "88.00",
                        "strat2Coeff": 1,
                        "strat3Coeff": 1,
                        "attenuationFactor": 0.9
                    }
                ],
                "defaultRating": {
                    "attenuationFactor": 1,
                    "strat1Coeff": 1,
                    "strat2Coeff": 1,
                    "strat3Coeff": 1,
                    "rating": 0.001,
                    "raterInfluence": 1,
                    "weight": 0.002,
                    "weightAdjusted": 0.002,
                    "product": 0.000002
                },
                "inheritedRatings": [],
                "inverseRatings": [
                    {
                        "ratingNumber": 3,
                        "ratingSlug": "ratingOf_XaXtKQ_by_PsBWki_4sbkq1",
                        "rateeUserNumber": 2,
                        "rateePeerID": "QmWpLB32UFkrVTDHwstrf8wdFSen5kbrs1TGEzu8XaXtKQ",
                        "trustRating": "100.00",
                        "referenceTrustRating": "100.00",
                        "product": null,
                        "rating": "1.000",
                        "strat1Coeff": 0.81,
                        "weightAdjusted": null,
                        "weight": null,
                        "raterInfluence": null,
                        "ratingConfidence": "100.00",
                        "strat2Coeff": 1,
                        "strat3Coeff": 1,
                        "attenuationFactor": 0.9,
                        "rateeInfluence": 0.02
                    },
                    {
                        "ratingNumber": 4,
                        "ratingSlug": "ratingOf_wsCR4a_by_PsBWki_cG4pji",
                        "rateeUserNumber": 8,
                        "rateePeerID": "12D3KooWAqYKPfgBzFWo8BtvQCebzZkgTGVhRsJMEkPKTWwsCR4a",
                        "trustRating": "0.00",
                        "referenceTrustRating": "100.00",
                        "product": null,
                        "rating": 1000,
                        "strat1Coeff": 0.81,
                        "weightAdjusted": null,
                        "weight": null,
                        "raterInfluence": null,
                        "ratingConfidence": "20.00",
                        "strat2Coeff": 1,
                        "strat3Coeff": 1,
                        "attenuationFactor": 0.9,
                        "rateeInfluence": 0.02
                    }
                ]
            }
        }
    }

    handleAttenuationSliderCallback = (newAttenuationFactor) =>{
        // this.setState({data: newAttenuationFactor})
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.attenuationFactor = newAttenuationFactor
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
    }

    handleUpdateProposalVerdictAverageScoreCallback = (newUpdateProposalVerdictAverageScore) =>{
        console.log("main page: newUpdateProposalVerdictAverageScore: "+newUpdateProposalVerdictAverageScore)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.defaultUpdateProposalVerdictAverageScore = newUpdateProposalVerdictAverageScore
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        console.log("main page B: newUpdateProposalVerdictAverageScore: "+newUpdateProposalVerdictAverageScore)
    }

    handleUpdateProposalVerdictConfidenceCallback = (newUpdateProposalVerdictConfidence) =>{
        console.log("main page; newUpdateProposalVerdictConfidence: "+newUpdateProposalVerdictConfidence)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.defaultUpdateProposalVerdictConfidence = newUpdateProposalVerdictConfidence
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
    }

    handleUserTrustAverageScoreCallback = (newUserTrustAverageScore) =>{
        console.log("main page: newUserTrustAverageScore: "+newUserTrustAverageScore)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.defaultUserTrustAverageScore = newUserTrustAverageScore
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        console.log("main page B: newUserTrustAverageScore: "+newUserTrustAverageScore)
    }

    handleUserTrustConfidenceCallback = (newUserTrustConfidence) =>{
        console.log("main page; newUserTrustConfidence: "+newUserTrustConfidence)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.defaultUserTrustConfidence = newUserTrustConfidence
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
    }

    handleRigorCallback = (newRigor) =>{
        console.log("main page; newRigor: "+newRigor)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.rigor = newRigor
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
    }

    handleMod1Callback = (newMod1Factor) =>{
        console.log("grapevineVisualization page; newMod1Factor: "+newMod1Factor)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.strat1Coeff = newMod1Factor
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
    }

    handleMod2Callback = (newMod2Factor) =>{
        console.log("grapevineVisualization page; newMod2Factor: "+newMod2Factor)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.strat2Coeff = newMod2Factor
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
    }

    handleMod3Callback = (newMod3Factor) =>{
        console.log("grapevineVisualization page; newMod3Factor: "+newMod3Factor)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.strat3Coeff = newMod3Factor
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
    }

    handleMod4Callback = (newMod4Factor) =>{
        console.log("grapevineVisualization page; newMod4Factor: "+newMod4Factor)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.strat4Coeff = newMod4Factor
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
    }

    handleMod5Callback = (newMod5Factor) =>{
        console.log("grapevineVisualization page; newMod5Factor: "+newMod5Factor)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.strat5Coeff = newMod5Factor
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
    }

    changeUserTrustScoreCalculationPage = () => {
        var newPeerID = jQuery("#peerIDContainer").html()
        var newUserNumber = lookupUserNumberByPeerID[newPeerID];
        if (newUserNumber) {

            var oSingleUserGrapevineScores_new = this.state.oSingleUserGrapevineScores
            var compScoreNumber = jQuery("#compositeUserTrustScoreNumberBeingViewedContainer").html()
            oSingleUserGrapevineScores_new = MiscFunctions.cloneObj(aUserTrustScores[compScoreNumber].users[newUserNumber])

            this.setState({oSingleUserGrapevineScores: oSingleUserGrapevineScores_new})

            var imageCid = oSingleUserGrapevineScores_new.avatarCid;
            var img = document.getElementById("showCalculationsAvatarThumb") // the img tag you want it in
            img.src = "http://localhost:8080/ipfs/"+imageCid;
        }
    }

    changeUpdateProposalVerdictScoreCalculationPage = () => {
        var newUpSlug = jQuery("#upSlugContainer").html()
        var newUpdateProposalNumber = lookupUpdateProposalNumberBySlug[newUpSlug];

        if (newUpdateProposalNumber) {
            var oSingleUpdateProposalVerdictScores_new = this.state.oSingleUpdateProposalVerdictScores
            var compScoreNumber = jQuery("#compositeUpdateProposalVerdictScoreNumberBeingViewedContainer").html() // for now, this is hardcoded to be 0 which means "standardAverage"
            console.log("changeUpdateProposalVerdictScoreCalculationPage; compScoreNumber: "+compScoreNumber+"; newUpSlug: "+newUpSlug+"; newUpdateProposalNumber: "+newUpdateProposalNumber+"; aUpdateProposalVerdictScores: "+JSON.stringify(aUpdateProposalVerdictScores,null,4))
            oSingleUpdateProposalVerdictScores_new = MiscFunctions.cloneObj(aUpdateProposalVerdictScores[compScoreNumber].updateProposals[newUpdateProposalNumber])

            this.setState({oSingleUpdateProposalVerdictScores: oSingleUpdateProposalVerdictScores_new})
        }
    }

    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;

        await determineCompositeScoreInheritance();

        jQuery("#grapevineContainerElem").hover(function(){
                jQuery("#scoresCalculationTimer").css("border","1px solid red")
                jQuery("#scoresCalculationTimer").data("status","stop")
            }, function(){
                jQuery("#scoresCalculationTimer").css("border","1px solid green")
                jQuery("#scoresCalculationTimer").data("status","run")
        });
        aCompositeUserTrustScoreTypes = await generateAllCompositeUserTrustScoreTypes()
        console.log("aCompositeUserTrustScoreTypes: "+JSON.stringify(aCompositeUserTrustScoreTypes,null,4))

        aCompositeUpdateProposalVerdictScoreTypes = await generateAllCompositeUpdateProposalVerdictScoreTypes()
        console.log("aCompositeUpdateProposalVerdictScoreTypes: "+JSON.stringify(aCompositeUpdateProposalVerdictScoreTypes,null,4))

        console.log("qwerty componentDidMount")
        await makeInfluenceTypeSelector();
        var aUsers = await fetchUsersList()

        var oIpfsID = await MiscIpfsFunctions.ipfs.id();
        var myPeerID = oIpfsID.id;

        console.log("GrapevineVisualizationMainPage myPeerID: "+myPeerID)

        var masterUserList = [];
        var updateProposalList = await returnArrayOfUpdateProposals_specifyConceptGraph(viewingConceptGraph_ipns)
        ////////////////////////////////////////////////////////////////
        /////////////////////// swarm peers ////////////////////////////
        var a1Users = await MiscIpfsFunctions.fetchUsersListViaSwarmPeers()
        console.log("GrapevineVisualizationMainPage a1Users: "+JSON.stringify(a1Users,null,4))
        var grouping = "swarmPeers";
        for (var u=0;u<a1Users.length;u++) {
            var nextPeerID = a1Users[u];
            masterUserList.push(nextPeerID)
            // var foo = await addPeerToUserList(myPeerID,nextPeerID,grouping)
            var oUserData = {};
            oUserData.pathname = "/SingleUserProfilePage/"+nextPeerID;
            oUserData.linkfromcid = 'linkFrom_'+nextPeerID;
            oUserData.cid = nextPeerID;
            this.state.contactLinks.push(oUserData)
            this.forceUpdate();
        }

        ////////////////////////////////////////////////////////////////
        /////////////////////// swarm addrs ////////////////////////////
        var a2Users = await MiscIpfsFunctions.fetchUsersListViaSwarmAddrs()
        console.log("GrapevineVisualizationMainPage a2Users: "+JSON.stringify(a2Users,null,4))
        var grouping = "swarmAddrs";
        for (var u=0;u<a2Users.length;u++) {
            var nextPeerID = a2Users[u];
            if (!masterUserList.includes(nextPeerID)) {
                masterUserList.push(nextPeerID)
                // var foo = await addPeerToUserList(myPeerID,nextPeerID,grouping)
                var oUserData = {};
                oUserData.pathname = "/SingleUserProfilePage/"+nextPeerID;
                oUserData.linkfromcid = 'linkFrom_'+nextPeerID;
                oUserData.cid = nextPeerID;
                this.state.contactLinks.push(oUserData)
                this.forceUpdate();
            }
        }

        ////////////////////////////////////////////////////////////////////
        /////////////////////// previously seen ////////////////////////////
        var a3Users = await MiscIpfsFunctions.fetchUsersFromMyGrapevineMFS()
        console.log("GrapevineVisualizationMainPage a3Users: "+JSON.stringify(a3Users,null,4))
        var grouping = "previouslySeen";
        for (var u=0;u<a3Users.length;u++) {
            var nextPeerID = a3Users[u];
            if (!masterUserList.includes(nextPeerID)) {
                masterUserList.push(nextPeerID)
                // var foo = await addPeerToUserList(myPeerID,nextPeerID,grouping)
                var oUserData = {};
                oUserData.pathname = "/SingleUserProfilePage/"+nextPeerID;
                oUserData.linkfromcid = 'linkFrom_'+nextPeerID;
                oUserData.cid = nextPeerID;
                this.state.contactLinks.push(oUserData)
                this.forceUpdate();
            }
        }

        /*
        ////////////////////////////////////////////////////////////////////
        /////////////////// scrape data from other users ///////////////////
        for (var u=0;u<a1Users.length;u++) {
            var nextPeerID = a1Users[u];
            // console.log("try fetchUsersFromExternalMFS from nextPeerID: "+nextPeerID)
            var a4Users = await MiscIpfsFunctions.fetchUsersFromExternalMFS(nextPeerID)
            console.log("GrapevineVisualizationMainPage nextPeerID: "+nextPeerID+"; a4Users: "+JSON.stringify(a4Users,null,4))
            var grouping = "scraped";
            for (var u=0;u<a4Users.length;u++) {
                var nextPeerID = a4Users[u];
                if (!masterUserList.includes(nextPeerID)) {
                    masterUserList.push(nextPeerID)
                    // addPeerToUserList(myPeerID,nextPeerID,grouping)
                    var oUserData = {};
                    oUserData.pathname = "/SingleUserProfilePage/"+nextPeerID;
                    oUserData.linkfromcid = 'linkFrom_'+nextPeerID;
                    oUserData.cid = nextPeerID;
                    this.state.contactLinks.push(oUserData)
                    this.forceUpdate();
                }
            }
        }
        */
        var sMasterUserList = JSON.stringify(masterUserList,null,4)
        this.setState({masterUsersList:masterUserList});
        this.forceUpdate();
        console.log("sMasterUserList: "+sMasterUserList)
        console.log("this.state.contactLinks: "+JSON.stringify(this.state.contactLinks,null,4))

        var subsetUniqueIdentifier = false; // will default to superset
        var aCids = [];
        var subsetUniqueIdentifier = "supersetFor_rating"
        var aCids = await ConceptGraphInMfsFunctions.fetchArrayOfSpecificInstanceCidsFromMfs(subsetUniqueIdentifier)

        console.log("aCids: "+JSON.stringify(aCids,null,4))

        await makeVisGraph_updateProposalScoring(updateProposalList,masterUserList,aCids);

        await createSeedUserSelector(masterUserList,myPeerID)

        await setupGrapevineCompositeScoreVars_user(masterUserList);
        await setupGrapevineCompositeScoreVars_updateProposal(updateProposalList);

        var compScoreDisplayPanelData = this.state.compScoreDisplayPanelData

        // await runGrapevineCompositeScoreCalculations();
        jQuery("#calculateUserTrustScoresSingleIterationButton").click(async function(){
            await singleIterationCompositeUserTrustScoreCalculations(compScoreDisplayPanelData)
        })

        jQuery("#calculateUpdateProposalVerdictScoresSingleIterationButton").click(async function(){
            await singleIterationCompositeUpdateProposalVerdictScoreCalculations(compScoreDisplayPanelData)
        })
        // console.log("aUserTrustScores: "+JSON.stringify(aUserTrustScores,null,4))
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                    <div className="mainPanel" >
                        <Masthead viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                        <div class="h2">Visualize Calculations of Update Proposals by Grapevine</div>

                        <div style={{display:"inline-block",fontSize:"10px"}} >


                            <div>
                                <div className="doSomethingButton" id="changeUserCalcsDisplayButton" onClick={this.changeUserTrustScoreCalculationPage} >change user</div>
                                <div style={{display:"inline-block",marginLeft:"5px"}} >compositeScoreType:</div>
                                <div id="compositeScoreTypeContainer" style={{display:"inline-block",marginLeft:"5px"}} ></div>
                                <div style={{display:"inline-block",marginLeft:"5px"}} >compositeScoreNumber:</div>
                                <div id="compositeUserTrustScoreNumberBeingViewedContainer" style={{display:"inline-block",marginLeft:"5px"}} ></div>
                            </div>
                            <div>
                                <div className="doSomethingButton" id="changeUpdateProposalCalcsDisplayButton" onClick={this.changeUpdateProposalVerdictScoreCalculationPage} >change update proposal</div>
                                <div style={{display:"inline-block",marginLeft:"5px"}} >compositeScoreNumber:</div>
                                <div id="compositeUpdateProposalVerdictScoreNumberBeingViewedContainer" style={{display:"inline-block",marginLeft:"5px"}} >0</div>
                            </div>
                        </div>

                        <center>
                            <div style={{}}>
                                <div style={{display:"inline-block",width:"450px"}} >
                                    <div>
                                        <div style={{display:"inline-block"}} >
                                            seed user:
                                        </div>
                                        <div id="seedUserSelectorContainer" style={{display:"inline-block",marginLeft:"10px"}} >seedUserSelectorContainer</div>
                                    </div>
                                    <AttenuationSlider
                                        attenuationSliderCallback = {this.handleAttenuationSliderCallback}
                                    />
                                </div>

                                <div style={{display:"inline-block",width:"250px"}} >
                                    <center>viewing</center>
                                    <select>
                                        <option>user</option>
                                        <option>Proven Person</option>
                                    </select>
                                    <select id="nodeSizeRepresentationSelector" >
                                        <option data-value="influence" >influence</option>
                                        <option data-value="average" >average</option>
                                        <option data-value="nothing" >nothing</option>
                                    </select>
                                </div>

                                <div style={{display:"inline-block",width:"300px"}} >
                                    <center>select trust / influence type</center>
                                    <div id="influenceTypeSelectorContainer" ></div>
                                </div>

                                <div style={{display:"inline-block",width:"150px"}} >
                                    <center>select context</center>
                                    <div id="contextSelectorContainer" ></div>
                                </div>

                                <div id="scoresCalculationTimer" data-status="run" style={{display:"inline-block"}} >
                                <ScoresCalculationTimer />
                                </div>

                            </div>
                        </center>

                        <center>
                            <div>
                                <div id="grapevineContainerElem" style={{border:"1px dashed grey",display:"inline-block",width:"750px",height:"700px"}}>

                                </div>

                                <div style={{border:"1px dashed grey",display:"inline-block",width:"700px",height:"700px"}}>
                                    <center>
                                        Control Panel
                                        <div id="calculateUpdateProposalVerdictScoresSingleIterationButton" className="doSomethingButton_small" >calculate update proposal verdict scores single iteration</div>
                                        <div id="calculateUserTrustScoresSingleIterationButton" className="doSomethingButton_small" style={{display:"none"}} >calculate user trust scores single iteration</div>
                                    </center>
                                    <ControlPanel
                                        compScoreDisplayPanelData={this.state.compScoreDisplayPanelData}
                                        masterUsersList = {this.state.masterUsersList}
                                        masterUpdateProposalsList = {this.state.masterUpdateProposalsList}

                                        defaultUpdateProposalVerdictAverageScore={this.state.compScoreDisplayPanelData.defaultUpdateProposalVerdictAverageScore}
                                        updateProposalVerdictAverageScoreSliderCallback = {this.handleUpdateProposalVerdictAverageScoreCallback}
                                        updateProposalVerdictConfidenceSliderCallback = {this.handleUpdateProposalVerdictConfidenceCallback}

                                        defaultUserTrustAverageScore={this.state.compScoreDisplayPanelData.defaultUserTrustAverageScore}
                                        userTrustAverageScoreSliderCallback = {this.handleUserTrustAverageScoreCallback}
                                        userTrustConfidenceSliderCallback = {this.handleUserTrustConfidenceCallback}

                                        rigorSliderCallback = {this.handleRigorCallback}
                                        mod1SliderCallback = {this.handleMod1Callback}
                                        mod2SliderCallback = {this.handleMod2Callback}
                                        mod3SliderCallback = {this.handleMod3Callback}
                                        mod4SliderCallback = {this.handleMod4Callback}
                                        mod5SliderCallback = {this.handleMod5Callback}
                                    />
                                </div>
                            </div>
                            <div id = "compUserTrustScoreCalcPanelContainer" >
                                <CompUserTrustScoreCalcPanel
                                    compScoreDisplayPanelData={this.state.compScoreDisplayPanelData}
                                    oSingleUserGrapevineScores={this.state.oSingleUserGrapevineScores}
                                />
                            </div>
                            <div id = "compUpdateProposalVerdictScoreCalcPanelContainer" >
                                <CompUpdateProposalVerdictScoreCalcPanel
                                    compScoreDisplayPanelData={this.state.compScoreDisplayPanelData}
                                    oSingleUpdateProposalVerdictScores={this.state.oSingleUpdateProposalVerdictScores}
                                />
                            </div>
                        </center>

                    </div>
                </fieldset>
            </>
        );
    }
}
