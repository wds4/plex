import React from 'react';
import Masthead from '../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/cgFe_manageDownloads_leftNav2.js';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
import * as ConceptGraphInMfsFunctions from '../../lib/ipfs/conceptGraphInMfsFunctions.js'
// import * as InitDOMFunctions from '../functions/transferSqlToDOM.js';

const jQuery = require("jquery");

var numNodes = 0;
const reportMutableFilesTree = async (pCG0,path) => {
    var pathMinusPrefix = path.replace(pCG0,"./")
    for await (const file of MiscIpfsFunctions.ipfs.files.ls(path)) {
        var fileName = file.name;
        var fileType = file.type;
        var fileCid = file.cid;
        // console.log("path: "+path+"; file name: "+fileName)
        // console.log("path: "+path+"; file type: "+fileType)
        var reportHTML = "";
        reportHTML += "<div>";
        reportHTML += "<div style='display:inline-block;' >"+pathMinusPrefix+"</div>";
        if (fileType=="directory") {
            reportHTML += "<div style='display:inline-block;background-color:yellow;' >" + fileName + "</div>";
        }
        if (fileType=="file") {
            reportHTML += "<div class=ipfsMutableFilesFileContainer style='display:inline-block;background-color:orange;' ";
            reportHTML += " data-filename='"+fileName+"' ";
            reportHTML += " data-path='"+path+"' ";
            reportHTML += " data-cid='"+fileCid+"' ";
            reportHTML += " >";
            reportHTML += fileName;
            reportHTML += "</div>";
            if (fileName=="node.txt") { numNodes++; jQuery("#totalNumWordsContainer").html(numNodes) }
        }
        reportHTML += "</div>";
        jQuery("#listOfAllPathsContainer").append(reportHTML)
        if (file.type=="directory") {
            var newPath=path+file.name+"/";
            await reportMutableFilesTree(pCG0,newPath)
        }
    }
}

export default class ManageConceptGraphDownload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var oIpfsID = await MiscIpfsFunctions.ipfs.id();
        var myPeerID = oIpfsID.id;
        var keyname_forActiveCGPathDir = "plex_pathToActiveConceptGraph_"+myPeerID.slice(-10);
        var ipns_forActiveCGPathDir = await ConceptGraphInMfsFunctions.returnIPNSForActiveCGPathDir(keyname_forActiveCGPathDir)
        var ipns10_forActiveCGPathDir = ipns_forActiveCGPathDir.slice(-10);
        jQuery("#dirForPathToActiveConceptGraphContainer1").html(ipns10_forActiveCGPathDir)
        jQuery("#dirForPathToActiveConceptGraphContainer2").html(ipns10_forActiveCGPathDir)

        var pathToLocalMSFCG = "/plex/conceptGraphs/"+ipns10_forActiveCGPathDir+"/mainSchemaForConceptGraph/node.txt";
        var oMainSchemaForConceptGraphLocal = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(pathToLocalMSFCG)
        var mainSchema_local_ipns = oMainSchemaForConceptGraphLocal.metaData.ipns;
        jQuery("#conceptGraphRootPathContainer").html(mainSchema_local_ipns)

        var pCG0 = "/plex/conceptGraphs/"+ipns10_forActiveCGPathDir+"/"+mainSchema_local_ipns+"/";

        jQuery("#pathToThisConceptGraphContainer").html(pCG0)

        var pCG = "/plex/conceptGraphs/"+ipns10_forActiveCGPathDir+"/mainSchemaForConceptGraph/"
        for await (const file of MiscIpfsFunctions.ipfs.files.ls(pCG)) {
            var fileName = file.name;
            var fileType = file.type;
            var fileCid = file.cid;
            if (fileName=="node.txt") {
                var path = pCG + "node.txt";
                var pCGs = "/plex/conceptGraphs/"+ipns10_forActiveCGPathDir+"/mainSchemaForConceptGraph/";
                pCGs += "<div class=ipfsMutableFilesFileContainer style='display:inline-block;background-color:orange;' id='localMainSchemaForConceptGraphButton' ";
                pCGs += " data-filename='"+fileName+"' ";
                pCGs += " data-path='"+path+"' ";
                pCGs += " data-cid='"+fileCid+"' ";
                pCGs += " >";
                pCGs += "node.txt";
                pCGs += "<div>";

                jQuery("#pCGsContainer").html(pCGs)
            }
            console.log("path-: "+pCG+"; file name: "+fileName)
            console.log("path-: "+pCG+"; file type: "+fileType)
        }

        jQuery("#populateStarterDirectoryButton").click(async function(){
            console.log("populateStarterDirectoryButton clicked")
            // words: the central concept graph wordType; any node can be looked up here

            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0) } catch (e) {}

            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"words/") } catch (e) {}

            // each of the other core wordTypes for concept graphs
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"concepts/") } catch (e) {}
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"wordTypes/") } catch (e) {}
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"schemas/") } catch (e) {}
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"JSONSchemas/") } catch (e) {}
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"supersets/") } catch (e) {}
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"sets/") } catch (e) {}
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"properties/") } catch (e) {}

            // now add mainSchemaForConceptGraph as the first word to this concept graph
            var slug = "mainSchemaForConceptGraph";
            var path = pCG0+"words/"+slug+"/";
            try { await MiscIpfsFunctions.ipfs.files.mkdir(path) } catch (e) {}
            var pathToFile = path + "node.txt";
            var fileToWrite = JSON.stringify(oMainSchemaForConceptGraphLocal,null,4)
            try { await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true}) } catch (e) {}

            /*
            // each core wordType for ratings, reputation, etc
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"users/") } catch (e) {}
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"ratings/") } catch (e) {}
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"ratingTemplates/") } catch (e) {}

            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"influenceTypes/") } catch (e) {}
            */

            // redraw tree
            jQuery("#listOfAllPathsContainer").html("")
            await reportMutableFilesTree(pCG0,pCG0,numNodes)
        })

        const importConcepts = async () => {
            // jQuery("#localMainSchemaForConceptGraphButton").get(0).click();
            // var pathToLocalMSFCG = "/plex/conceptGraphs/"+ipns10_forActiveCGPathDir+"/mainSchemaForConceptGraph/node.txt";
            // var oMainSchemaForConceptGraphLocal = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(pathToLocalMSFCG)
            var aConcepts = oMainSchemaForConceptGraphLocal.conceptGraphData.aConcepts;
            jQuery("#clickedNodeRawFileContainer").val(JSON.stringify(aConcepts,null,4))
            console.log("importConceptsButton clicked; numConcepts: "+aConcepts.length)
            for (var c=0;c<aConcepts.length;c++) {
            // for (var c=0;c<10;c++) {
                var oNextConceptInfo = aConcepts[c]
                var stewardPeerID = oNextConceptInfo.stewardPeerID;
                var slug = oNextConceptInfo.slug;
                var ipns = oNextConceptInfo.ipns;
                var ipfsPath = "/ipns/"+ipns;
                console.log("c = "+c+"; slug: "+slug+"; ipfsPath: "+ipfsPath)
                var path = pCG0+"words/"+slug+"/";
                try { await MiscIpfsFunctions.ipfs.files.mkdir(path) } catch (e) {}
                var pathToFile = path + "node.txt";
                var oNode = await ConceptGraphInMfsFunctions.fetchObjectByIPNS(ipns)
                // console.log("oNode: "+JSON.stringify(oNode,null,4))
                var oNodeLocal = await ConceptGraphInMfsFunctions.convertExternalNodeToLocalWord(oNode);
                // console.log("oNodeLocal: "+JSON.stringify(oNodeLocal,null,4))
                var fileToWrite = JSON.stringify(oNodeLocal,null,4)
                try { await MiscIpfsFunctions.ipfs.files.rm(pathToFile, {recursive: true}) } catch (e) {}
                try { await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true}) } catch (e) {}
                //
                // 7 Oct 2022: if failure, next option would be to try mfsPath from stewardPeerID. These mfs paths are not yet determined:
                // mfsPath1 = "/ipns/"+stewardPeerID+"/plex/dictionary/"+ipns+"/node.txt";
                // mfsPath2 = "/ipns/"+stewardPeerID+"/plex/conceptGraphs/"+ipns+"/node.txt";
                // mfsPath3 = "/ipns/"+stewardPeerID+"/plex/conceptGraphs/"+msfcgIpns+"/words/"+slug+"/node.txt" -- but this requires knowing msfcgIpns,
                // which is the ipns of stewardPeerID's mainSchemaForConceptGraph, which can be derived from:
                // "/ipns/"+stewardPeerID+"/plex/conceptGraphs/mainSchemaForConceptGraph/node.txt
                // ?? might add /plex/conceptGraphs/public
            }
            return true;
        }
        // Step (a)
        jQuery("#importConceptsButton").click(async function(){
            var fooResult = await importConcepts()
        });

        const importSchemas = async () => {
            console.log("importSchemasButton clicked")
            var path = pCG0 + "words/"
            var numConcepts = 0;
            for await (const file of MiscIpfsFunctions.ipfs.files.ls(path)) {
                var fileName = file.name;
                var fileType = file.type;
                var fileCid = file.cid;
                if (fileType=="directory") {
                    var nextWord_path = path + fileName + "/node.txt";
                    var oNextWord = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(nextWord_path)
                    if (oNextWord.hasOwnProperty("conceptData")) {
                        var mainSchema_slug = oNextWord.conceptData.nodes.schema.slug;
                        var mainSchema_ipns = oNextWord.conceptData.nodes.schema.ipns;
                        var propertySchema_slug = oNextWord.conceptData.nodes.propertySchema.slug;
                        var propertySchema_ipns = oNextWord.conceptData.nodes.propertySchema.ipns;
                        console.log("concept number: "+numConcepts+"; next propertySchema_slug: "+propertySchema_slug+"; mainSchema_slug: "+mainSchema_slug)
                        // if (numConcepts < 1) {
                            await ConceptGraphInMfsFunctions.addOrUpdateWordInLocalConceptGraph(pCG0,mainSchema_ipns)
                            await ConceptGraphInMfsFunctions.addOrUpdateWordInLocalConceptGraph(pCG0,propertySchema_ipns)
                        // }
                        numConcepts++
                    }
                }
            }
            return true;
        }
        // Step (b)
        jQuery("#importSchemasButton").click(async function(){
            var fooResult = await importSchemas()
        });

        const importAdditionalSchemas = async () => {
            console.log("importAdditionalSchemasButton clicked")
            var aAdditionalSchemas = oMainSchemaForConceptGraphLocal.conceptGraphData.aAdditionalSchemas;
            // incomplete!
            return true;
        }
        // Step (c)
        jQuery("#importAdditionalSchemasButton").click(async function(){
            var fooResult = await importAdditionalSchemas()
        });

        const importAllWords = async () => {
            console.log("importAllWordsButton clicked")
            var aCurrentLocalConceptGraphSlugs = await ConceptGraphInMfsFunctions.fetchListOfCurrentConceptGraphSlugs(pCG0)
            console.log("aCurrentLocalConceptGraphSlugs: "+JSON.stringify(aCurrentLocalConceptGraphSlugs,null,4))

            var path = pCG0 + "words/"
            var numSchemas = 0;
            for await (const file of MiscIpfsFunctions.ipfs.files.ls(path)) {
                var fileName = file.name;
                var fileType = file.type;
                var fileCid = file.cid;
                if (fileType=="directory") {
                    var nextWord_path = path + fileName + "/node.txt";
                    var oNextWord = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(nextWord_path)
                    if (oNextWord.hasOwnProperty("schemaData")) {
                        var aNodes = oNextWord.schemaData.nodes;
                        console.log("s = "+numSchemas+"; schema slug: "+fileName)
                        // if (numSchemas < 10) {
                            for (var n=0;n<aNodes.length;n++) {
                                var oNextNodeInfo = aNodes[n];
                                var nextNode_ipns = oNextNodeInfo.ipns;
                                var nextNode_slug = oNextNodeInfo.slug;
                                console.log("s = "+numSchemas+"; schema slug: "+fileName+"; nextNode_slug: "+nextNode_slug)
                                // first make sure this ipns or this node is not already in my concept graph
                                if (!aCurrentLocalConceptGraphSlugs.includes(nextNode_slug)) {
                                    console.log("s = "+numSchemas+"; schema slug: "+fileName+"; ADDING nextNode_slug: "+nextNode_slug)
                                    await ConceptGraphInMfsFunctions.addOrUpdateWordInLocalConceptGraph(pCG0,nextNode_ipns)
                                }
                            }
                        // }
                        numSchemas++
                    }
                }
            }
            return true;
        }
        // Step (d)
        jQuery("#importAllWordsButton").click(async function(){
            var fooResult = await importAllWords()
        });
        jQuery("#importAThroughDButton").click(async function(){
            console.log("importAThroughDButton clicked")
            var fooResult = await importConcepts() // step (a)
            var fooResult = await importSchemas() // step (b)
            var fooResult = await importAdditionalSchemas() // step (c)
            var fooResult = await importAllWords() // step (d)
        });

        jQuery("#listOfAllPathsContainer").html("")
        numNodes = 0;
        await reportMutableFilesTree(pCG0,pCG0)

        jQuery(".ipfsMutableFilesFileContainer").click(async function(){
            var fileName = jQuery(this).data("filename")
            var path = jQuery(this).data("path")
            var cid = jQuery(this).data("cid")
            console.log("ipfsMutableFilesFileContainer clicked; fileName: "+fileName+"; path: "+path+"; cid: "+cid)
            jQuery("#cidToThisFileContainer").html(cid)
            for await (const chunk2 of MiscIpfsFunctions.ipfs.cat(cid)) {
                var chunk3 = new TextDecoder("utf-8").decode(chunk2);
                try {
                    var chunk4 = JSON.parse(chunk3);
                    if (typeof chunk4 == "object") {
                        var chunk5 = JSON.stringify(chunk4,null,4);
                        jQuery("#clickedNodeRawFileContainer").val(chunk5)
                    } else {
                        jQuery("#clickedNodeRawFileContainer").val(chunk3)
                    }
                } catch (e) {
                    console.log("error: "+e)
                    jQuery("#clickedNodeRawFileContainer").val(chunk3)
                }
            }
        })

        var aCurrentLocalConceptGraphSlugs = await ConceptGraphInMfsFunctions.fetchListOfCurrentConceptGraphSlugs(pCG0)
        /*
        var aWordsFromSql = Object.keys(window.lookupWordBySlug);
        for (var w=0;w<aWordsFromSql.length;w++) {
            var nW = aWordsFromSql[w];
            if (!aCurrentLocalConceptGraphSlugs.includes(nW)) {
                console.log("NOT IN aCurrentLocalConceptGraphSlugs: "+nW)
            }
        }
        */

        // populate list of concepts available for download in conceptsAvailableForDownloadOuterContainer
        var oMainSchemaForConceptGraphLocal = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(window.ipfs.pCGs)
        console.log("oMainSchemaForConceptGraphLocal; window.ipfs.pCGs: "+window.ipfs.pCGs+"; oMainSchemaForConceptGraphLocal: "+JSON.stringify(oMainSchemaForConceptGraphLocal,null,4))
        if (oMainSchemaForConceptGraphLocal) {
            var aAvailableConcepts = oMainSchemaForConceptGraphLocal.conceptGraphData.aConcepts;
            for (var c=0;c<aAvailableConcepts.length;c++) {
                var oNxtCncpt = aAvailableConcepts[c]
                var nxtConcept_slug = oNxtCncpt.slug;
                var nextConceptHTML = "";
                nextConceptHTML += "<div>";
                    nextConceptHTML += "<input type='checkbox' style='display:inline-block;margin-right:5px;' ";
                    nextConceptHTML += " id='checkBoxForConceptToDownload_"+nxtConcept_slug+"' ";
                    nextConceptHTML += " data-conceptslug='"+nxtConcept_slug+"' ";
                    nextConceptHTML += " class='checkBoxForConceptToDownload' ";
                    if (aCurrentLocalConceptGraphSlugs.includes(nxtConcept_slug)) {
                        nextConceptHTML += " disabled ";
                        console.log("YES IN aCurrentLocalConceptGraphSlugs: "+nxtConcept_slug)
                    }
                    if (!aCurrentLocalConceptGraphSlugs.includes(nxtConcept_slug)) {
                        nextConceptHTML += " enabled ";
                        console.log("NOT IN aCurrentLocalConceptGraphSlugs: "+nxtConcept_slug)
                    }
                    nextConceptHTML += " />";

                    nextConceptHTML += "<div style='display:inline-block;' ";
                    nextConceptHTML += " data-conceptslug='"+nxtConcept_slug+"' ";
                    // nextConceptHTML += " class='checkBoxForConceptToDownload' ";
                    nextConceptHTML += " >";
                    nextConceptHTML += nxtConcept_slug;
                    nextConceptHTML += "</div>";
                    if (aCurrentLocalConceptGraphSlugs.includes(nxtConcept_slug)) {
                        nextConceptHTML += "<div style='display:inline-block;margin-left:5px;color:#BFBFBF' > already present locally; no need for download</div>";
                    }
                nextConceptHTML += "</div>";
                jQuery("#conceptsAvailableForDownloadInnerContainer").append(nextConceptHTML)

            }
            jQuery("#checkAllButton").click(function(){
                jQuery(".checkBoxForConceptToDownload").prop("checked",true)
            })
            jQuery("#uncheckAllButton").click(function(){
                jQuery(".checkBoxForConceptToDownload").prop("checked",false)
            })
            jQuery(".checkBoxForConceptToDownload").click(function(){
                var conceptSlug = jQuery(this).data("conceptslug")
                var isChecked = jQuery("#checkBoxForConceptToDownload_"+conceptSlug).prop("checked")
                console.log("clicked conceptSlug: "+conceptSlug+"; isChecked: "+isChecked)
            })
        }
        jQuery("#toggleConceptsListButton").click(async function(){
            var currStatus = jQuery(this).data("status")
            console.log("toggleConceptsListButton clicked; status: "+currStatus)
            if (currStatus=="closed") {
                jQuery("#conceptsAvailableForDownloadOuterContainer").animate({
                    height: "300px",
                    padding: "10px",
                    borderWidth:"1px",
                    marginBottom:"10px"
                },500);
                jQuery(this).data("status","open")
            }
            if (currStatus=="open") {
                jQuery("#conceptsAvailableForDownloadOuterContainer").animate({
                    height: "0px",
                    padding: "0px",
                    borderWidth:"0px",
                    marginBottom:"0px"
                },500);
                jQuery(this).data("status","closed")
            }
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Download Concept Graph from External Source</div>

                        <div style={{border:"1px dashed grey",padding:"5px",fontSize:"10px",marginTop:"20px"}} >

                            <div >
                            pCGs = /plex/conceptGraphs/<div id="dirForPathToActiveConceptGraphContainer1" style={{display:"inline-block"}} ></div>/mainSchemaForConceptGraph/node.txt
                            </div>

                            <div >
                            pGC0 = /plex/conceptGraphs/<div id="dirForPathToActiveConceptGraphContainer2" style={{display:"inline-block"}} ></div>/<div id="conceptGraphRootPathContainer" style={{display:"inline-block"}} ></div>/
                            </div>

                            <div >
                            total number of words: <div id="totalNumWordsContainer" style={{display:"inline-block"}} ></div>
                            </div>

                            <div >
                                Assuming the following:
                                <li>mainSchemaForConceptGraph exists at pCGs</li>
                                <li>mainSchemaForConceptGraph is under my stewardship</li>
                                <li>pCG0 has been created</li>
                                Next step: download Concept Graph from external source (next box)
                            </div>
                        </div>
                        <div id="populateStarterDirectoryButton" className="doSomethingButton" >build skeleton directory for this concept graph</div>
                        <div style={{fontSize:"10px"}}>
                        populate /words/ from node at end of pCGs
                        </div>
                        <div id="toggleConceptsListButton" data-status="closed" className="doSomethingButton" >+</div>
                        <div id="importCheckedConceptsButton" className="doSomethingButton" >import checked (and enabled) concept words only (incomplete)</div>
                        <br/>
                        <div id="importConceptsButton" className="doSomethingButton" >a. import EVERY concept word from conceptGraphData.aConcepts (will overwrite!)</div>
                        <div id="importSchemasButton" className="doSomethingButton" >b. import both schemas from each concept (will overwrite!)</div>
                        <div id="importAdditionalSchemasButton" className="doSomethingButton" >c. import any additional schemas from conceptGraphData.aAdditionalSchemas (will overwrite!)</div>
                        <div id="importAllWordsButton" className="doSomethingButton" >d. cycle through all schemas; import all words (will overwrite!)</div>
                        <div id="importAThroughDButton" className="doSomethingButton" >steps a-d (will overwrite!)</div>

                        <div id="conceptsAvailableForDownloadOuterContainer" style={{fontSize:"10px",border:"0px dashed grey",padding:"0px",marginBottom:"0px",height:"0px",overflow:"scroll"}}>
                            <center>concepts listed in local schema - available for download</center>
                            <div id="checkAllButton" className="doSomethingButton_small" >check all</div>
                            <div id="uncheckAllButton" className="doSomethingButton_small" >uncheck all</div>
                            <div id="conceptsAvailableForDownloadInnerContainer" >
                            </div>
                        </div>

                        <div style={{fontSize:"10px",border:"1px dashed grey",padding:"10px",marginBottom:"10px",height:"600px"}}>
                            <center>current MFS file structure for the active concept graph</center>

                            <div style={{height:"560px"}}>
                                <div style={{display:"inline-block",height:"100%"}} >
                                    <div>
                                        pGCs = <div style={{display:"inline-block"}} id="pCGsContainer" >pCGsContainer</div>
                                    </div>
                                    <div >
                                        pGC0 = <div style={{display:"inline-block"}} id="pathToThisConceptGraphContainer" >pathToThisConceptGraphContainer</div>
                                    </div>
                                    <div id="listOfAllPathsContainer" style={{display:"inline-block",width:"900px",border:"1px dashed purple",height:"95%",overflow:"scroll"}} ></div>
                                </div>

                                <div style={{display:"inline-block",height:"100%"}} >
                                    <div style={{marginBottom:"5px"}}>
                                        cid = <div style={{display:"inline-block"}} id="cidToThisFileContainer" >cidToThisFileContainer</div>
                                    </div>
                                    <textarea id="clickedNodeRawFileContainer" style={{fontSize:"10px",display:"inline-block",width:"550px",height:"95%",border:"1px dashed grey",overflow:"scroll"}} ></textarea>
                                </div>
                            </div>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
