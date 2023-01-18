import React, { useState, useEffect, useRef }  from "react";
import ReactDOM from 'react-dom';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as VisjsFunctions from '../../functions/visjsFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
import * as ConceptGraphInMfsFunctions from '../../lib/ipfs/conceptGraphInMfsFunctions.js'
import * as CompScoreCalcFunctions from '../../lib/grapevine/compScoreCalcFunctions.js'
import * as ConceptGraphLib from '../../lib/ipfs/conceptGraphLib.js'
import * as GrapevineLib from '../../lib/ipfs/grapevineLib.js'
import Masthead from '../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/grapevine_leftNav1';
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import * as VisStyleConstants from '../../lib/visjs/visjs-style';
import AttenuationSlider from './modules/attenuationSlider.js'
import ControlPanel from './modules/controlPanel/controlPanel.js'
import CompScoreCalcPanel from './compScoreCalcPanel.js'

const cg = ConceptGraphLib.cg; 
const gv = GrapevineLib.gv;

const electronFs = window.require('fs');

const jQuery = require("jquery");

function ScoresCalculationTimer() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            var foo = jQuery("#scoresCalculationTimer").data("status")
            // console.log("ScoresCalculationTimer; count: "+count+"; foo: "+foo)
            if (foo=="run") {
                jQuery("#calculateScoresSingleIterationButton").get(0).click()
                if (count%5 == 0) {
                    jQuery("#changeUserCalcsDisplayButton").get(0).click()
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

var lookupCompositeScoreNumberByType = {};


const generateAllCompositeScoreTypes = async () => {
    var aCompositeScoreTypes = [];
    var compositeScoreType = "allInfluenceTypes_allContexts";
    aCompositeScoreTypes.push(compositeScoreType)

    console.log("makeInfluenceTypeSelector")
    // THIS IS THE OLD WAY TO LOOK UP WORDS ON THE CONCEPT GRAPH
    // NEED TO UPDATE THIS here and elsewhere on this page
    var mainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug
    var oMainSchema = window.lookupWordBySlug[mainSchema_slug]
    // var oMainSchema = await ConceptGraphInMfsFunctions.lookupWordBySlug[mainSchema_slug]
    var mainSchema_ipns = oMainSchema.metaData.ipns;
    var pCG = "/plex/conceptGraphs/";
    var pCG0_old = pCG + mainSchema_ipns + "/";
    var aInfluenceTypes = await fetchInfluenceTypes(pCG0_old);

    for (var i=0;i<aInfluenceTypes.length;i++) {
        var oNextInfluenceType = aInfluenceTypes[i];
        var nextInfluenceType_influenceTypeSlug = oNextInfluenceType.influenceTypeData.slug;
        // var compositeScoreType =  nextInfluenceType_influenceTypeSlug + "_allContexts"
        // aCompositeScoreTypes.push(compositeScoreType)

        var nextInfluenceType_associatedContextGraph_slug = oNextInfluenceType.influenceTypeData.contextGraph.slug;
        var oContextGraph = window.lookupWordBySlug[nextInfluenceType_associatedContextGraph_slug]
        var aContexts = oContextGraph.schemaData.nodes;
        for (var z=0;z<aContexts.length;z++) {
            var oNC = aContexts[z];
            var nextContext_slug = oNC.slug;
            var oNextContext = window.lookupWordBySlug[nextContext_slug]
            var nextContext_contextSlug = oNextContext.contextStructuredData_contextData.slug;

            var compositeScoreType =  nextInfluenceType_influenceTypeSlug + "_" + nextContext_contextSlug
            aCompositeScoreTypes.push(compositeScoreType)
        }
    }
    for (var x=0;x<aCompositeScoreTypes.length;x++) {
        var nextType = aCompositeScoreTypes[x];
        lookupCompositeScoreNumberByType[nextType] = x;
    }
    return aCompositeScoreTypes;
}

const makeInfluenceTypeSelector = async () => {
    console.log("makeInfluenceTypeSelector")
    var mainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug
    var oMainSchema = window.lookupWordBySlug[mainSchema_slug]
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
        // console.log("oNextInfluenceType: "+JSON.stringify(oNextInfluenceType,null,4))
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

const makeContextSelector = () => {
    var selectorHTML = "";
    selectorHTML += "<select id='contextSelector' >";

    var contextGraph_slug = jQuery("#influenceTypeSelector option:selected").data("contextgraphslug")
    var influenceType_slug = jQuery("#influenceTypeSelector option:selected").data("influencetypeslug")

    var oContextGraph = window.lookupWordBySlug[contextGraph_slug]
    var aContexts = oContextGraph.schemaData.nodes;
    for (var z=0;z<aContexts.length;z++) {
        var oNC = aContexts[z];
        var nextContext_slug = oNC.slug;
        var oNextContext = window.lookupWordBySlug[nextContext_slug]
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
                var username = node.username;
                jQuery("#usernameContainer").html(username)
                jQuery("#peerIDContainer").html(nodeID)
                jQuery("#changeUserCalcsDisplayButton").get(0).click()
                // drawScoreCalculationPanel(nodeID)
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

const makeVisGraph_Grapevine = async (userList,aRatingCidsByMe) => {
    console.log("makeVisGraph_Grapevine A")
    const oIpfsID = await MiscIpfsFunctions.ipfs.id();
    const myPeerID = oIpfsID.id;
    var nodes_arr = [];
    var nodes_slugs_arr = [];
    var edges_arr = [];
    var physics = true;
    var nextNode_wordType = "user";
    var nextNode_conceptRole = "user"
    var showNode = true;
    var listOfPeerIDs = [];
    for (var u=0;u<userList.length;u++) {
        var nextUserPeerID = userList[u];
        listOfPeerIDs.push(nextUserPeerID)
        var ipfsPath = "/grapevineData/users/"+nextUserPeerID+"/userProfile.txt";
        var nextNode_label = "anon";
        var nextNode_username = "anon";
        var nextNode_title = nextUserPeerID;

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

    console.log("makeVisGraph_Grapevine D")

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

var aGrapevineScores = [];

var lookupUserNumberByPeerID = {};

export const setupGrapevineCompositeScoreVars = async (aUserPeerIDs) => {
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
    for (var c=0;c<aCompositeScoreTypes.length;c++) {
        var nextCSType = aCompositeScoreTypes[c];
        aGrapevineScores[c] = {};
        aGrapevineScores[c].compositeScoreNumber = c;
        aGrapevineScores[c].compositeScoreType = nextCSType;
        aGrapevineScores[c].users = []
        for (var u=0;u<aUserPeerIDs.length;u++) {
            var nextPeerID = aUserPeerIDs[u];
            if (nextPeerID==myPeerID) {
                myUserNumber = u;
            }
            aGrapevineScores[c].users[u] = {}
            aGrapevineScores[c].users[u].userNumber = u;
            aGrapevineScores[c].users[u].peerID = nextPeerID;
            aGrapevineScores[c].users[u].username = lookupUsernameFromPeerID[nextPeerID];
            aGrapevineScores[c].users[u].avatarCid = lookupAvatarCidFromPeerID[nextPeerID];
            aGrapevineScores[c].users[u].seedUser = false;
            aGrapevineScores[c].users[u].compositeScoreData = MiscFunctions.cloneObj(window.compositeScoreData);
            if (nextPeerID == seedUserPeerID) {
                aGrapevineScores[c].users[u].compositeScoreData.seedUser = true;
                aGrapevineScores[c].users[u].compositeScoreData.selectedUser = true;
                aGrapevineScores[c].users[u].compositeScoreData.radiusMultiplier = 1.5;
                aGrapevineScores[c].users[u].compositeScoreData.standardCalculations.certainty = 100;
                aGrapevineScores[c].users[u].compositeScoreData.standardCalculations.average = 1;
                aGrapevineScores[c].users[u].compositeScoreData.standardCalculations.influence = 1
                aGrapevineScores[c].users[u].compositeScoreData.standardCalculations.input = 1000
            }
            aGrapevineScores[c].users[u].ratings = [] // all ratings where this user is the ratee
            aGrapevineScores[c].users[u].defaultRating = {} // default user rating
            aGrapevineScores[c].users[u].inheritedRatings = [] // inherited user rating (from separate Composite Score)
            aGrapevineScores[c].users[u].inverseRatings = [] // all ratings where this user is the rater
            // aGrapevineScores[c].users[u].calcDataRow = {}
            // aGrapevineScores[c].users[u].calcDataRow.default = MiscFunctions.cloneObj(window.calculationDataRow);
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
        // lookupRatingNumberBySlug[nextRatingSlug] = r
        var oRating = await ConceptGraphInMfsFunctions.lookupWordBySlug(nextRatingSlug)
        var ratingTemplateIPNS = oRating.ratingData.ratingTemplateData.ratingTemplateIPNS;
        if (ratingTemplateIPNS=="k2k4r8p570pjb0nx2xcldfq6sphb98vqokpxolmw74j4v8ijgr1l4lqj") {
            aAllRatings.push(nextRatingSlug)
        }
    }

    var lookupRatingNumberBySlug = {};
    for (var r=0;r<aAllRatings.length;r++) {
        var nextRatingSlug = aAllRatings[r];
        lookupRatingNumberBySlug[nextRatingSlug] = r
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
        for (var c=0;c<aCompositeScoreTypes.length;c++) {
            var nextCSType = aGrapevineScores[c].compositeScoreType;
            if (nextCSType == compositeScoreType_thisRating) {
                console.log("Got a hit! nextCSType: "+nextCSType)
                var numR = aGrapevineScores[c].users[rateeUserNumber].ratings.length;
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR] = {}
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR].ratingNumber = r;
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR].ratingSlug = nextRatingSlug;
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR].raterUserNumber = raterUserNumber;
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR].raterPeerID = raterPeerID;
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR].raterUsername = raterUsername;
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR].raterAvatarCid = raterAvatarCid;
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR].trustRating = trustRating;
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR].referenceTrustRating = referenceTrustRating;
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR].product = null;
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR].ratingAuthorInfluence = 0.5;
                if (referenceTrustRating) {
                    aGrapevineScores[c].users[rateeUserNumber].ratings[numR].rating = (trustRating / referenceTrustRating).toPrecision(4);
                }
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR].strat1Coeff = null;
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR].weightAdjusted = null;
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR].weight = null;
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR].raterInfluence = null;
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR].ratingConfidence = ratingConfidence;
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR].strat2Coeff = null;
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR].strat3Coeff = null;
                aGrapevineScores[c].users[rateeUserNumber].ratings[numR].attenuationFactor = null;
                aGrapevineScores[c].users[rateeUserNumber].fooR = {};

                var numIr = aGrapevineScores[c].users[raterUserNumber].inverseRatings.length;
                aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr] = {}
                aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].ratingNumber = r;
                aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].ratingSlug = nextRatingSlug;
                aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].rateeUserNumber = rateeUserNumber;
                aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].rateePeerID = rateePeerID;
                aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].rateeUsername = rateeUsername;
                aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].rateeAvatarCid = rateeAvatarCid;
                aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].trustRating = trustRating;
                aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].referenceTrustRating = referenceTrustRating;
                aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].product = null;
                if (trustRating) {
                    aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].rating = (referenceTrustRating / trustRating).toPrecision(4);
                }
                aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].strat1Coeff = null;
                aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].weightAdjusted = null;
                aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].weight = null;
                aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].raterInfluence = null;
                aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].ratingConfidence = ratingConfidence;
                aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].strat2Coeff = null;
                aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].strat3Coeff = null;
                aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].attenuationFactor = null;
                aGrapevineScores[c].users[raterUserNumber].fooIR = {};
                // the "rating" for inverseRating is the reciprocal of the rating for normal rating
                if (trustRating) {
                    aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].rating = (referenceTrustRating / trustRating).toPrecision(4);
                }
                if ((trustRating == 0) && (referenceTrustRating > 0)) {
                    // technically this would be infinite, but 1000 will suffice
                    aGrapevineScores[c].users[raterUserNumber].inverseRatings[numIr].rating = 1000;
                }
            }
            // aGrapevineScores[c].users[myUserNumber].ratings
        }
    }
}

const singleIterationCompositeScoreCalculations = async (compScoreDisplayPanelData) => {

    var nodeSizeRepresentation = jQuery("#nodeSizeRepresentationSelector option:selected").data("value")
    var compScoreNumber = jQuery("#compositeScoreNumberContainer").html()
    // console.log("singleIterationCompositeScoreCalculations; nodeSizeRepresentation: "+nodeSizeRepresentation)
    var seedUserPeerID = jQuery("#seedUserSelector option:selected").data("peerid")
    for (var c=0;c<aGrapevineScores.length;c++) {
        // console.log("singleIterationCompositeScoreCalculations; c: "+c)
        var nextCSType = aGrapevineScores[c].compositeScoreType;
        for (var u=0;u<aGrapevineScores[c].users.length;u++) {
            var nextPeerID = aGrapevineScores[c].users[u].peerID;
            // console.log("singleIterationCompositeScoreCalculations; u: "+u)
            // var mod1Slider = document.getElementById('mod1Slider');
            // var mod1FactorValue = mod1Slider.noUiSlider.get();
            // var mod1FactorValue = mod1FactorValue / 100; // mod1FactorValue same as strat1Coeff
            // var strat1Coeff = jQuery("#mod1FactorValueContainer").html()
            // var strat2Coeff = jQuery("#mod2FactorValueContainer").html()
            // var strat3Coeff = jQuery("#mod3FactorValueContainer").html()
            // var attenuationFactor = jQuery("#attenuationFactorValueContainer").html()

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
            for (var r=0;r<aGrapevineScores[c].users[u].ratings.length;r++) {
                // console.log("singleIterationCompositeScoreCalculations; work on this step next - 16 Oct 2022")
                // obtain needed values for calculations
                var nextRatingSlug = aGrapevineScores[c].users[u].ratings[r].ratingSlug // may not need this
                if (aVisualizedRatingSlugs.includes(nextRatingSlug)) {
                    // update opacity of this edge
                    var nextRatingCurrentOpacity = aGrapevineScores[c].users[u].ratings[r].ratingAuthorInfluence;
                    // var edgesIDs_arr = edges.getIds();
                    edges.update({id:nextRatingSlug,color: {opacity:nextRatingCurrentOpacity}});
                }
                var rateeUserNumber = u;
                var raterUserNumber = aGrapevineScores[c].users[u].ratings[r].raterUserNumber;
                var raterCurrentAverage = aGrapevineScores[c].users[raterUserNumber].compositeScoreData.standardCalculations.average;
                var raterCurrentInfluence = aGrapevineScores[c].users[raterUserNumber].compositeScoreData.standardCalculations.influence;
                var rateeCurrentInfluence = aGrapevineScores[c].users[rateeUserNumber].compositeScoreData.standardCalculations.influence;
                var trustRating = aGrapevineScores[c].users[u].ratings[r].trustRating;
                var referenceTrustRating = aGrapevineScores[c].users[u].ratings[r].referenceTrustRating;
                // var rating = raterCurrentAverage * (trustRating / referenceTrustRating);
                var rating =  (trustRating / referenceTrustRating);

                var mod1Coeff = raterCurrentAverage * strat1Coeff + 1 * (1 - strat1Coeff)

                var mod3Coeff = convertRatingToMod3Coeff(rating,strat3Coeff,strat4Coeff,strat5Coeff)
                var ratingConfidence = aGrapevineScores[c].users[u].ratings[r].ratingConfidence;
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
                aGrapevineScores[c].users[u].ratings[r].attenuationFactor = attenuationFactor;
                aGrapevineScores[c].users[u].ratings[r].strat1Coeff = strat1Coeff;
                aGrapevineScores[c].users[u].ratings[r].strat2Coeff = strat2Coeff_regular;
                aGrapevineScores[c].users[u].ratings[r].strat3Coeff = strat3Coeff;
                aGrapevineScores[c].users[u].ratings[r].strat4Coeff = strat4Coeff;
                aGrapevineScores[c].users[u].ratings[r].strat5Coeff = strat5Coeff;
                aGrapevineScores[c].users[u].ratings[r].mod1Coeff = parseFloat(mod1Coeff.toPrecision(4));;
                aGrapevineScores[c].users[u].ratings[r].mod3Coeff = mod3Coeff;
                aGrapevineScores[c].users[u].ratings[r].rating = parseFloat(rating.toPrecision(4));
                aGrapevineScores[c].users[u].ratings[r].raterInfluence = parseFloat(raterCurrentInfluence.toPrecision(4));
                aGrapevineScores[c].users[u].ratings[r].weight = parseFloat(weight.toPrecision(4));
                aGrapevineScores[c].users[u].ratings[r].weightAdjusted = parseFloat(weightAdjusted.toPrecision(4));
                aGrapevineScores[c].users[u].ratings[r].product = parseFloat(product.toPrecision(4));
                aGrapevineScores[c].users[u].ratings[r].ratingAuthorInfluence = raterCurrentInfluence;

            }
            // add Inherited User Score
            // console.log("oCompositeScoreTypeInheritanceLookup nextCSType: "+nextCSType)
            // console.log("oCompositeScoreTypeInheritanceLookup oCompositeScoreTypeInheritanceLookup[nextCSType]: "+JSON.stringify(oCompositeScoreTypeInheritanceLookup[nextCSType],null,4))

            if (nextCSType != "allInfluenceTypes_allContexts") {
                var aParentCSTypes = oCompositeScoreTypeInheritanceLookup[nextCSType].parents;
                for (var p=0;p<aParentCSTypes.length;p++) {
                    var parentCSType = aParentCSTypes[p];
                    var parentCSNumber = lookupCompositeScoreNumberByType[parentCSType];

                    var attenuationFactor_inherited = 1
                    var strat1Coeff_inherited = compScoreDisplayPanelData.strat1Coeff
                    var strat2Coeff_inherited = 1
                    var mod3Coeff_inherited = 1
                    var raterCurrentInfluence_inherited = 1;
                    // var rating_inherited = defaultUserTrustAverageScore;
                    var rating_inherited = 0.69;
                    try {
                        rating_inherited = aGrapevineScores[parentCSNumber].users[u].compositeScoreData.standardCalculations.average
                        // rating_inherited = 0.59;
                    } catch(e) {}
                    var ratingConfidence_inherited = defaultUserTrustConfidence;
                    try {
                        ratingConfidence_inherited = aGrapevineScores[parentCSNumber].users[u].compositeScoreData.standardCalculations.certainty
                        // rating_inherited = 0.59;
                    } catch(e) {}

                    var raterCurrentAverage_inherited = aGrapevineScores[parentCSNumber].users[u].compositeScoreData.standardCalculations.average;



                    var weight_inherited = (attenuationFactor_inherited * mod3Coeff_inherited * strat2Coeff_inherited * strat1Coeff_inherited * ratingConfidence_inherited * raterCurrentInfluence_inherited);

                    try {
                        weight_inherited = aGrapevineScores[parentCSNumber].users[u].compositeScoreData.standardCalculations.certainty
                        var weight_inherited_x = aGrapevineScores[parentCSNumber].users[u].compositeScoreData.standardCalculations.input
                        if (weight_inherited_x) {
                            weight_inherited = weight_inherited_x;
                        }
                        console.log("weight_inherited; typeof: "+typeof weight_inherited + " weight_inherited: "+weight_inherited)
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

                    aGrapevineScores[c].users[u].inheritedRatings[p] = {};
                    aGrapevineScores[c].users[u].inheritedRatings[p].parentCompositeScoreNumber = parentCSNumber;
                    aGrapevineScores[c].users[u].inheritedRatings[p].parentCompositeScoreType = parentCSType;

                    aGrapevineScores[c].users[u].inheritedRatings[p].attenuationFactor = attenuationFactor_inherited;
                    aGrapevineScores[c].users[u].inheritedRatings[p].strat1Coeff = strat1Coeff_inherited;
                    aGrapevineScores[c].users[u].inheritedRatings[p].strat2Coeff = strat2Coeff_inherited;
                    aGrapevineScores[c].users[u].inheritedRatings[p].mod3Coeff = mod3Coeff_inherited;
                    aGrapevineScores[c].users[u].inheritedRatings[p].rating = parseFloat(rating_inherited.toPrecision(4));
                    aGrapevineScores[c].users[u].inheritedRatings[p].raterInfluence = parseFloat(raterCurrentInfluence_inherited.toPrecision(4));
                    aGrapevineScores[c].users[u].inheritedRatings[p].ratingConfidence = parseFloat(ratingConfidence_inherited.toPrecision(4));
                    aGrapevineScores[c].users[u].inheritedRatings[p].weight = parseFloat(weight_inherited.toPrecision(4));
                    aGrapevineScores[c].users[u].inheritedRatings[p].weightAdjusted = parseFloat(weightAdjusted_inherited.toPrecision(4));
                    aGrapevineScores[c].users[u].inheritedRatings[p].product = parseFloat(product_inherited.toPrecision(4));
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

            aGrapevineScores[c].users[u].defaultRating = {}
            aGrapevineScores[c].users[u].defaultRating.attenuationFactor = attenuationFactor_default;
            aGrapevineScores[c].users[u].defaultRating.strat1Coeff = strat1Coeff_default;
            aGrapevineScores[c].users[u].defaultRating.strat2Coeff = strat2Coeff_default;
            aGrapevineScores[c].users[u].defaultRating.mod3Coeff = mod3Coeff_default;
            aGrapevineScores[c].users[u].defaultRating.rating = parseFloat(rating_default.toPrecision(4));
            aGrapevineScores[c].users[u].defaultRating.raterInfluence = parseFloat(raterCurrentInfluence_default.toPrecision(4));
            aGrapevineScores[c].users[u].defaultRating.ratingConfidence = parseFloat(ratingConfidence_default.toPrecision(4));
            aGrapevineScores[c].users[u].defaultRating.weight = parseFloat(weight_default.toPrecision(4));
            aGrapevineScores[c].users[u].defaultRating.weightAdjusted = parseFloat(weightAdjusted_default.toPrecision(4));
            aGrapevineScores[c].users[u].defaultRating.product = parseFloat(product_default.toPrecision(4));

            for (var r=0;r<aGrapevineScores[c].users[u].inverseRatings.length;r++) {
                // obtain needed values for calculations

                var nextRatingSlug = aGrapevineScores[c].users[u].inverseRatings[r].ratingSlug
                var raterUserNumber = u;
                var rateeUserNumber = aGrapevineScores[c].users[u].inverseRatings[r].rateeUserNumber;
                var raterCurrentInfluence = aGrapevineScores[c].users[raterUserNumber].compositeScoreData.standardCalculations.influence;
                var rateeCurrentInfluence = aGrapevineScores[c].users[rateeUserNumber].compositeScoreData.standardCalculations.influence;
                var rateeCurrentAverage_inverse = aGrapevineScores[c].users[rateeUserNumber].compositeScoreData.standardCalculations.average;
                var trustRating = aGrapevineScores[c].users[u].inverseRatings[r].trustRating;
                var referenceTrustRating = aGrapevineScores[c].users[u].inverseRatings[r].referenceTrustRating;
                if (trustRating > 0) {
                    // var rating_inverse = rateeCurrentAverage * (referenceTrustRating / trustRating);
                    var rating_inverse = (referenceTrustRating / trustRating);
                }
                if (trustRating == 0) {
                    var rating_inverse = 1000; //
                }
                var mod1Coeff_inverse = rateeCurrentAverage_inverse * strat1Coeff_inverse + 1 * (1 - strat1Coeff_inverse)

                var mod3Coeff_inverse = convertRatingToMod3Coeff(rating_inverse,strat3Coeff,strat4Coeff,strat5Coeff)
                var ratingConfidence = aGrapevineScores[c].users[u].inverseRatings[r].ratingConfidence;
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
                aGrapevineScores[c].users[u].inverseRatings[r].attenuationFactor = attenuationFactor;
                aGrapevineScores[c].users[u].inverseRatings[r].strat1Coeff = strat1Coeff_inverse;
                aGrapevineScores[c].users[u].inverseRatings[r].strat2Coeff = strat2Coeff_inverse;
                aGrapevineScores[c].users[u].inverseRatings[r].strat3Coeff = strat3Coeff;
                aGrapevineScores[c].users[u].inverseRatings[r].mod3Coeff = parseFloat(mod3Coeff_inverse.toPrecision(4));
                aGrapevineScores[c].users[u].inverseRatings[r].mod1Coeff = parseFloat(mod1Coeff_inverse.toPrecision(4));

                aGrapevineScores[c].users[u].inverseRatings[r].rating = parseFloat(rating_inverse.toPrecision(4));
                aGrapevineScores[c].users[u].inverseRatings[r].rateeInfluence = parseFloat(rateeCurrentInfluence.toPrecision(4));
                aGrapevineScores[c].users[u].inverseRatings[r].weight = parseFloat(weight.toPrecision(4));
                aGrapevineScores[c].users[u].inverseRatings[r].weightAdjusted = parseFloat(weightAdjusted.toPrecision(4));
                aGrapevineScores[c].users[u].inverseRatings[r].product = parseFloat(product.toPrecision(4));
            }

            var average = sumOfProducts / sumOfWeights
            var certainty = convertInputToCertainty(sumOfWeights,rigor)
            var influence = average * certainty
            if (seedUserPeerID == nextPeerID) {
                influence = 1;
                average = 1;
                certainty = 1;
            }
            aGrapevineScores[c].users[u].compositeScoreData.numberOfRatings = aGrapevineScores[c].users[u].ratings.length
            aGrapevineScores[c].users[u].compositeScoreData.standardCalculations.sumOfProducts = parseFloat(sumOfProducts.toPrecision(4));
            aGrapevineScores[c].users[u].compositeScoreData.standardCalculations.input = parseFloat(sumOfWeights.toPrecision(4));
            aGrapevineScores[c].users[u].compositeScoreData.standardCalculations.rigor = parseFloat(rigor.toPrecision(4));
            aGrapevineScores[c].users[u].compositeScoreData.standardCalculations.certainty = parseFloat(certainty.toPrecision(4));
            aGrapevineScores[c].users[u].compositeScoreData.standardCalculations.average = parseFloat(average.toPrecision(4));
            aGrapevineScores[c].users[u].compositeScoreData.standardCalculations.influence = parseFloat(influence.toPrecision(4));

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
            }
        }
    }
    // console.log("aGrapevineScores: "+JSON.stringify(aGrapevineScores,null,4))
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
    // set up a loop to call singleIterationCompositeScoreCalculations repeatedly
}

var defCon = window.grapevine.starterDefaultUserTrustConfidence / 100
var defAvg = window.grapevine.starterDefaultUserTrustAverageScore / 100
var defInf = parseFloat((defCon * defAvg).toPrecision(4));
window.compositeScoreData = {
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

var aCompositeScoreTypes = [];

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
    var cSN = lookupCompositeScoreNumberByType[cST];

    jQuery("#compositeScoreTypeContainer").html(cST)
    jQuery("#compositeScoreNumberContainer").html(cSN)
}

export default class GrapevineVisualizationMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compScoreDisplayPanelData: {
                attenuationFactor: window.grapevine.starterDefaultAttenuationFactor / 100,
                rigor: window.grapevine.starterRigor / 100,
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

    changeUserTrustScoreCalculationPage = () =>{
        // console.log("changeUserTrustScoreCalculationPage")
        //
        var newPeerID = jQuery("#peerIDContainer").html()
        var newUserNumber = lookupUserNumberByPeerID[newPeerID];
        // console.log("changeUserTrustScoreCalculationPage; newPeerID: "+newPeerID+"; newUserNumber: "+newUserNumber)

        var oSingleUserGrapevineScores_new = this.state.oSingleUserGrapevineScores
        var compScoreNumber = jQuery("#compositeScoreNumberContainer").html()
        oSingleUserGrapevineScores_new = MiscFunctions.cloneObj(aGrapevineScores[compScoreNumber].users[newUserNumber])
        // console.log("oSingleUserGrapevineScores_new: "+JSON.stringify(oSingleUserGrapevineScores_new,null,4))
        // oSingleUserGrapevineScores_new.avatarCid = "QmeZB53kw8XD318LKRTDS2BJDpHWKuBz4Dv47yNwbc2uof"
        // oSingleUserGrapevineScores_new.avatarCid = newAvatarCid
        // oSingleUserGrapevineScores_new.username = "dude"

        this.setState({oSingleUserGrapevineScores: oSingleUserGrapevineScores_new})

        // var imageCid = this.state.oSingleUserGrapevineScores.avatarCid;
        var imageCid = oSingleUserGrapevineScores_new.avatarCid;
        var img = document.getElementById("showCalculationsAvatarThumb") // the img tag you want it in
        img.src = "http://localhost:8080/ipfs/"+imageCid;
        //  img.src = "http://localhost:8080/ipfs/"+newAvatarCid;
    }

    async componentDidMount() {
        // var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        // compScoreDisplayPanelData_new.attenuationFactor = 0.2
        // this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        jQuery(".mainPanel").css("width","calc(100% - 100px)");

        await determineCompositeScoreInheritance();

        jQuery("#grapevineContainerElem").hover(function(){
                jQuery("#scoresCalculationTimer").css("border","1px solid red")
                jQuery("#scoresCalculationTimer").data("status","stop")
            }, function(){
                jQuery("#scoresCalculationTimer").css("border","1px solid green")
                jQuery("#scoresCalculationTimer").data("status","run")
        });
        aCompositeScoreTypes = await generateAllCompositeScoreTypes()
        console.log("aCompositeScoreTypes: "+JSON.stringify(aCompositeScoreTypes,null,4))

        console.log("qwerty componentDidMount")
        await makeInfluenceTypeSelector();
        var aUsers = await fetchUsersList()

        var oIpfsID = await MiscIpfsFunctions.ipfs.id();
        var myPeerID = oIpfsID.id;

        console.log("GrapevineVisualizationMainPage myPeerID: "+myPeerID)

        var masterUserList = [];
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
        console.log("sMasterUserList: "+sMasterUserList)

        var subsetUniqueIdentifier = false; // will default to superset
        var aCids = [];
        var subsetUniqueIdentifier = "supersetFor_rating"
        var aCids = await ConceptGraphInMfsFunctions.fetchArrayOfSpecificInstanceCidsFromMfs(subsetUniqueIdentifier)

        console.log("aCids: "+JSON.stringify(aCids,null,4))

        await makeVisGraph_Grapevine(masterUserList,aCids);

        await createSeedUserSelector(masterUserList,myPeerID)

        await setupGrapevineCompositeScoreVars(masterUserList);

        var compScoreDisplayPanelData = this.state.compScoreDisplayPanelData

        await runGrapevineCompositeScoreCalculations();
        jQuery("#calculateScoresSingleIterationButton").click(async function(){
            await singleIterationCompositeScoreCalculations(compScoreDisplayPanelData)
        })
        console.log("aGrapevineScores: "+JSON.stringify(aGrapevineScores,null,4))
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Grapevine Visualization Main Page</div>
                        <div style={{display:"inline-block"}} >
                            <div className="doSomethingButton" id="changeUserCalcsDisplayButton" onClick={this.changeUserTrustScoreCalculationPage} >change</div>

                            <div style={{display:"inline-block"}} >compositeScoreType:</div>
                            <div id="compositeScoreTypeContainer" style={{display:"inline-block"}} ></div>

                            <div style={{display:"inline-block"}} >compositeScoreNumber:</div>
                            <div id="compositeScoreNumberContainer" style={{display:"inline-block"}} ></div>
                        </div>

                        <center>
                            <div style={{}}>
                                <div style={{display:"inline-block",width:"500px"}} >
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

                                <div style={{display:"inline-block",width:"300px"}} >
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
                                <div id="grapevineContainerElem" style={{border:"1px dashed grey",display:"inline-block",width:"900px",height:"700px"}}>

                                </div>

                                <div style={{border:"1px dashed grey",display:"inline-block",width:"700px",height:"700px"}}>
                                    <center>
                                        Control Panel
                                        <div id="calculateScoresSingleIterationButton" className="doSomethingButton_small" style={{display:"none"} }>calculate scores single iteration</div>
                                    </center>
                                    <ControlPanel
                                        compScoreDisplayPanelData={this.state.compScoreDisplayPanelData}
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
                            <CompScoreCalcPanel
                                compScoreDisplayPanelData={this.state.compScoreDisplayPanelData}
                                oSingleUserGrapevineScores={this.state.oSingleUserGrapevineScores}
                            />
                        </center>
                    </div>
                </fieldset>
            </>
        );
    }
}
