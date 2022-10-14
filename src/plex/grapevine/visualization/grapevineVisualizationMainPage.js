import React, { useEffect, useRef }  from "react";
import ReactDOM from 'react-dom';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as VisjsFunctions from '../../functions/visjsFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
import * as ConceptGraphInMfsFunctions from '../../lib/ipfs/conceptGraphInMfsFunctions.js'
import Masthead from '../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/grapevine_leftNav1';
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import * as VisStyleConstants from '../../lib/visjs/visjs-style';
import AttenuationSlider from './modules/attenuationSlider.js'
import ControlPanel from './modules/controlPanel/controlPanel.js'

const electronFs = window.require('fs');

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

function editEdgeFunction() {

}
function deleteEdgeFunction() {

}
function deleteNodeFunction() {

}


// var groupOptions = window.visjs.groupOptions;
export const groupOptions={
    "analogy":{"shape":"circle","borderWidth":"3","color":{"background":"white","border":"black"}},
    "animal":{"shape":"circle","borderWidth":"3","color":{"background":"white","border":"black"}},
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
        color: { background: 'white', border: 'black' },
        widthConstraint: {
            minimum: 0,
            maximum: 100
        }
    },
	edges: {
	    hoverWidth: 5,
	    selectionWidth: 5,
	    color: {
	        hover: 'red'
	    },
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


const fetchInfluenceTypes = async (pCG0) => {

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

const makeInfluenceTypeSelector = async () => {
    console.log("makeInfluenceTypeSelector")
    var mainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug
    var oMainSchema = window.lookupWordBySlug[mainSchema_slug]
    var mainSchema_ipns = oMainSchema.metaData.ipns;
    var pCG = "/plex/conceptGraphs/";
    var pCG0 = pCG + mainSchema_ipns + "/";

    var aInfluenceTypes = await fetchInfluenceTypes(pCG0);
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

const makeContextSelector = () => {
    var selectorHTML = "";
    selectorHTML += "<select id='contextSelector' >";

    var contextGraph_slug = jQuery("#influenceTypeSelector option:selected").data("contextgraphslug")
    var oContextGraph = window.lookupWordBySlug[contextGraph_slug]
    var aContexts = oContextGraph.schemaData.nodes;
    for (var z=0;z<aContexts.length;z++) {
        var oNC = aContexts[z];
        var nextContext_slug = oNC.slug;
        var oNextContext = window.lookupWordBySlug[nextContext_slug]
        var nextContext_contextName = oNextContext.contextStructuredData_contextData.name;
        selectorHTML += "<option ";
        selectorHTML += " data-contextslug='"+nextContext_slug+"' ";
        selectorHTML += " >";
        selectorHTML += nextContext_contextName;
        selectorHTML += "</option>";
    }
    selectorHTML += "</select>";
    jQuery("#contextSelectorContainer").html(selectorHTML)
}

const fetchUsersList = async () => {
    var aUsers = [];
    const peerInfos = await MiscIpfsFunctions.ipfs.swarm.addrs();
    var numPeers = peerInfos.length;
    console.log("numPeers: "+numPeers);

    var outputHTML = "number of peers: "+numPeers+"<br>";
    jQuery("#swarmPeersData").html(outputHTML);
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
        var nextNode_title = nextUserPeerID;

        // var pathToImage = "~src/assets/grapevine/users/"+nextUserPeerID+"/avatar.png"
        // var pathToImage = "/grapevine/assets/users/12D3KooWDijvW15ZekGqSTFjkTJ8pTq5Hjm1UdJihq9fDMzeM6Cs/avatar.png"
        // var pathToImage = "localhost:3000/d447dfa5-e37b-478f-8b7b-a715e753fd3d";

        var pathToImage = "";

        console.log("qwerty start ipfsPath: "+ipfsPath)
        try {
            var chunks = []

            for await (const chunk of MiscIpfsFunctions.ipfs.files.read(ipfsPath)) {
                chunks.push(chunk)
                var chunk2 = new TextDecoder("utf-8").decode(chunk);
                var oUserProfile = JSON.parse(chunk2);
                console.log("qwerty oUserProfile: "+JSON.stringify(oUserProfile,null,4))
                nextNode_label = oUserProfile.username;
                nextNode_title = oUserProfile.username;

                var nextNode_imageCid = oUserProfile.imageCid;
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
        var borderColor = "black";
        var size = 25;

        if (nextUserPeerID == myPeerID) {
            borderWidth = 5;
            size = 50;
        }

        if (showNode) {
            var nextNode_vis_obj = {
                id: nextUserPeerID,
                label: nextNode_label,
                slug: nextNode_slug,
                title: nextNode_title,
                shape: shape,
                image: pathToImage,
                brokenImage:"/grapevine/assets/missingAvatar.png",
                group: nextNode_wordType,
                conceptRole: nextNode_conceptRole,
                physics: physics,
                borderWidth: borderWidth,
                size: size,
                color: {
                    border: borderColor
                }
            }
            // console.log("qwerty_showNode: nextNode_slug: "+nextNode_slug+"; nextNode_vis_obj: "+JSON.stringify(nextNode_vis_obj,null,4))
            nodes_arr = MiscFunctions.pushObjIfNotAlreadyThere(nodes_arr,nextNode_vis_obj)
            nodes_slugs_arr = MiscFunctions.pushIfNotAlreadyThere(nodes_slugs_arr,nextNode_slug)
        }
    }

    console.log("makeVisGraph_Grapevine B")

    /*
    // This function has been deprecated
    // fetch ratings
    var aRatingCidsByOthers = [];
    for (var u=0;u<listOfPeerIDs.length;u++) {
        var nextPeerID = listOfPeerIDs[u];
        if (nextPeerID != myPeerID) {
            var aRatingCids = await MiscIpfsFunctions.fetchLocalRatingsFromExternalMFS(nextPeerID)
            for (var a=0;a<aRatingCids.length;a++) {
                var nextRatingPath = aRatingCids[a];
                // var nextRatingCid = nextRatingPath.replace("/ipfs/","");
                aRatingCidsByOthers.push(nextRatingPath)
            }
        }
    }
    */

    console.log("makeVisGraph_Grapevine C")

    // aRatingCidsByOthers has been deprecated 
    // var aRatingCids = [...aRatingCidsByMe, ...aRatingCidsByOthers];
    var aRatingCids = aRatingCidsByMe

    for (var r=0;r<aRatingCids.length;r++) {
        var nextRatingCid = aRatingCids[r];
        var ipfsPath = nextRatingCid;
        console.log("ipfsPath: "+ipfsPath)
        for await (const chunk of MiscIpfsFunctions.ipfs.cat(ipfsPath)) {
            // console.info(chunk)
            var chunk2 = new TextDecoder("utf-8").decode(chunk);
            var oRating = JSON.parse(chunk2);
            var rating_wordSlug = oRating.wordData.slug;
            console.log("rating_wordSlug: "+rating_wordSlug)
            var width = 5;
            var color = "green";
            var title = "title";
            var label = "label";
            var raterPeerID = oRating.ratingData.raterData.userData.peerID;
            var rateePeerID = oRating.ratingData.rateeData.userData.peerID;
            var aRatingFieldsetNames = oRating.ratingData.ratingFieldsetData.ratingFieldsetNames;
            if (aRatingFieldsetNames.includes("trust fieldset")) {
                var ratingTemplateTitle = oRating.ratingData.ratingTemplateData.ratingTemplateTitle;
                var trustRating = oRating.ratingData.ratingFieldsetData.trustFieldsetData.trustRating;
                var referenceTrustRating = oRating.ratingData.ratingFieldsetData.trustFieldsetData.referenceTrustRating;
                var transitivity = oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.transitivity;
                var influenceCategoryName = oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.influenceCategoryData.influenceCategoryName;
                var topicName = oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.topicData.topicName;
                width = 10 * (trustRating / referenceTrustRating);
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
                    from: raterPeerID,
                    to: rateePeerID,
                    width: width,
                    color: color,
                    title: title,
                    label: label
                }
                edges_arr.push(nextRel_vis_obj)
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

export default class GrapevineVisualizationMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contactLinks: []
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");
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
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Grapevine Visualization Main Page</div>

                        <center>
                            <div>
                                <div style={{border:"1px dashed grey",display:"inline-block",width:"500px",height:"100px"}}>
                                    <AttenuationSlider />
                                </div>

                                <div style={{border:"1px dashed grey",display:"inline-block",width:"300px",height:"100px"}}>
                                    <center>viewing</center>
                                    <select>
                                        <option>user</option>
                                        <option>Proven Person</option>
                                    </select>
                                    <div id="swarmPeersData">swarmPeersData</div>
                                </div>

                                <div style={{border:"1px dashed grey",display:"inline-block",width:"300px",height:"100px"}}>
                                    <center>select trust / influence type</center>
                                    <div id="influenceTypeSelectorContainer" ></div>
                                </div>

                                <div style={{border:"1px dashed grey",display:"inline-block",width:"300px",height:"100px"}}>
                                    <center>select context</center>
                                    <div id="contextSelectorContainer" ></div>
                                </div>
                            </div>
                        </center>

                        <center>
                            <div>
                                <div id="grapevineContainerElem" style={{border:"1px dashed grey",display:"inline-block",width:"900px",height:"700px"}}>

                                </div>

                                <div style={{border:"1px dashed grey",display:"inline-block",width:"700px",height:"700px"}}>
                                    <center>Control Panel</center>
                                    <ControlPanel />
                                </div>
                            </div>

                            <div>
                                <div style={{border:"1px dashed grey",display:"inline-block",width:"1600px"}}>
                                    <center>Show Calculations</center>
                                </div>
                            </div>
                        </center>

                    </div>
                </fieldset>
            </>
        );
    }
}
