import React from "react";
import Masthead from '../../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/cgFe_singleConceptGraph_updates_leftNav2';
import * as ConceptGraphInMfsFunctions from '../../../../../lib/ipfs/conceptGraphInMfsFunctions.js';
import * as MiscIpfsFunctions from '../../../../../lib/ipfs/miscIpfsFunctions.js'
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';

const jQuery = require("jquery");

var oUP = {
    "updateProposals": {
        "local": [

        ],
        "external": [

        ]
    }
}

const generateNewPublicFile = async () => {
    var oPublicDirectory = MiscFunctions.cloneObj(oUP);
    console.log("oPublicDirectory: "+ JSON.stringify(oPublicDirectory,null,4))

    jQuery("#publicDirectoryContainer").val(JSON.stringify(oPublicDirectory,null,4))
}

const saveThisPublicRawFile = async () => {
    console.log("saveThisPublicRawFile")
    var sPublicDirectory = jQuery("#publicDirectoryContainer").val();
    var oPublicDirectory = JSON.parse(sPublicDirectory)

    var path = "/plex/conceptGraphs/public/updateProposals/";
    var pathToFile = path + "node.txt";

    console.log("saveThisRawFile; path: "+path)
    console.log("saveThisRawFile; pathToFile: "+pathToFile)

    try { await MiscIpfsFunctions.ipfs.files.mkdir(path,{parents:true}) } catch (e) {}
    var fileToWrite = JSON.stringify(oPublicDirectory,null,4)
    try { await MiscIpfsFunctions.ipfs.files.rm(pathToFile, {recursive: true}) } catch (e) {}
    try { await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true}) } catch (e) {}

    await ConceptGraphInMfsFunctions.publishEntireLocalMfsToIpfs();
}

const loadExistingPublicFile = async () => {
    var path = "/plex/conceptGraphs/public/updateProposals/node.txt";
    var oPublicDirectory = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(path)
    if (oPublicDirectory) {
        jQuery("#publicDirectoryContainer").val(JSON.stringify(oPublicDirectory,null,4))
    } else {
        jQuery("#publicDirectoryContainer").val("file not available")
    }
}

const addExternalProposals = async () => {
    // Fetch list of users. Multiple ways to do this.
    // (For now, fetch from grapevineData, which is the publically available file with list of peerIDs.
    // Future: obtain list from the appropriate set from the active concept graph.)

    // INCOMPLETE: need to check to make sure update proposal is not a duplicate
    var sPublicDirectory = jQuery("#publicDirectoryContainer").val();
    var oPublicDirectory = JSON.parse(sPublicDirectory)

    var path = "/grapevineData/users/masterUsersList.txt";
    var aMasterUsersList =  await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(path);
    console.log("aMasterUsersList: "+JSON.stringify(aMasterUsersList,null,4))

    for (var u=0;u<aMasterUsersList.length;u++) {
        var peerID = aMasterUsersList[u];
        path = "/ipns/"+peerID+"/plex/conceptGraphs/public/updateProposals/node.txt";
        console.log("path: "+path)
        var oUpdateProposals =  await ConceptGraphInMfsFunctions.fetchObjectByCatIpfsPath(path);
        //
        if (oUpdateProposals) {
            var aLocal = oUpdateProposals.updateProposals.local;
            // var aExternal = oUpdateProposals.updateProposals.external;
            for (var l=0;l<aLocal.length;l++) {
                var oUP = aLocal[l];
                oPublicDirectory.updateProposals.external.push(oUP);
            }
        }

        if (!oUpdateProposals) { oUpdateProposals = {};  }
        console.log("peerID: "+peerID+"; oUpdateProposals: "+JSON.stringify(oUpdateProposals,null,4))
    }
    // var path = "/plex/conceptGraphs/public/updateProposals/node.txt";

    if (oPublicDirectory) {
        jQuery("#publicDirectoryContainer").val(JSON.stringify(oPublicDirectory,null,4))
    } else {
        jQuery("#publicDirectoryContainer").val("file not available")
    }
}

const importProposalsToConceptGraph = async () => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
    var sPublicDirectory = jQuery("#publicDirectoryContainer").val();
    var oPublicDirectory = JSON.parse(sPublicDirectory)
    var conceptForUpdates_slug = "conceptFor_updateProposal"

    var aExternal = oPublicDirectory.updateProposals.external;
    for (var e=0;e<aExternal.length;e++) {
        var oUP = aExternal[e];
        var up_ipns = oUP.updateProposal.ipns;
        var path = "/ipns/"+up_ipns;
        var oUpdateProposal =  await ConceptGraphInMfsFunctions.fetchObjectByCatIpfsPath(path);
        console.log("oUpdateProposal: "+JSON.stringify(oUpdateProposal,null,4))
        if (!oUpdateProposal.updateProposalData.hasOwnProperty("originalProposalData")) {
            oUpdateProposal.updateProposalData.originalProposalData = {}
            if (!oUpdateProposal.updateProposalData.originalProposalData.slug) {
                oUpdateProposal.updateProposalData.originalProposalData.slug = oUpdateProposal.wordData.slug;
            }
            if (!oUpdateProposal.updateProposalData.originalProposalData.ipns) {
                oUpdateProposal.updateProposalData.originalProposalData.ipns = oUpdateProposal.metaData.ipns;
            }
        }

        var oUpdateProposalLocal = await ConceptGraphInMfsFunctions.convertExternalNodeToLocalWord(oUpdateProposal);
        console.log("oUpdateProposalLocal: "+JSON.stringify(oUpdateProposalLocal,null,4))

        var fooResult = await ConceptGraphInMfsFunctions.addNewWordAsSpecificInstanceToConceptInMFS_specifyConceptGraph(viewingConceptGraph_ipns,oUpdateProposalLocal,conceptForUpdates_slug)
    }
}

export default class ConceptGraphsFrontEndExternalUpdateProposals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;

        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        jQuery("#generateNewPublicFileButton").click(async function(){
            console.log("generateNewPublicFileButton clicked")
            await generateNewPublicFile();
        })
        jQuery("#createOrUpdatePublicFileButton").click(async function(){
            console.log("createOrUpdatePublicFileButton clicked")
            await saveThisPublicRawFile();
        })
        jQuery("#loadExistingPublicFileButton").click(async function(){
            console.log("loadExistingPublicFileButton clicked")
            await loadExistingPublicFile();
        })
        jQuery("#addExternalProposalsButton").click(async function(){
            console.log("addExternalProposalsButton clicked")
            await addExternalProposals();
        })
        jQuery("#importProposalsToConceptGraphButton").click(async function(){
            console.log("importProposalsToConceptGraphButton clicked")
            await importProposalsToConceptGraph();
        })

        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                    <div className="mainPanel" >
                        <Masthead viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                        <div class="h2">Search for All Update Proposals from External Nodes</div>

                        <div style={{fontSize:"12px"}}>
                        Cycle through the list of *trusted* contacts (influenceType: ontology; context: everything; threshold: adjustable; -- able to be adjusted)
                        and scrape the list of all known updateProposals from /plex/conceptGraphs/public/updateProposals/node.txt.
                        </div>

                        <div id="publicDirectoryBox"  style={{width:"700px",border:"1px solid blue",margin:"5px",padding:"5px"}} >
                            publicDirectory:
                            <div className="doSomethingButton" id="loadExistingPublicFileButton" >load existing file from MFS</div>
                            <div className="doSomethingButton" id="addExternalProposalsButton" >scrape proposals from external nodes & add to the below file</div>
                            <div className="doSomethingButton" id="importProposalsToConceptGraphButton" >import proposals from below file to the local currently-viewing concept graph</div>
                            <br/>
                            <div className="doSomethingButton" id="createOrUpdatePublicFileButton" >save/update file (below)</div>
                            <div className="doSomethingButton" id="generateNewPublicFileButton" style={{float:"right"}} >generate anew</div>
                            <div style={{fontSize:"12px"}}><span style={{color:"red",marginRight:"20px"}} >path</span><div id="pathContainer" style={{display:"inline-block",color:"red"}} >path container</div></div>
                            <textarea id="publicDirectoryContainer" style={{width:"95%",height:"500px",fontSize:"12px"}} >
                            </textarea>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
