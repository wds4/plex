import React from 'react';
import Masthead from '../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/cgFe_conceptGraphsMainPage_leftNav2';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js';
import * as ConceptGraphInMfsFunctions from '../../lib/ipfs/conceptGraphInMfsFunctions.js';
// import * as MiscFunctions from '../../functions/miscFunctions.js';
// import * as InitDOMFunctions from '../../functions/transferSqlToDOM.js';

const jQuery = require("jquery");

var oPCGD = {
    "conceptGraphsDirectoryData": {
        "public": [

        ]
    }
}

const generateNewFile = async () => {
    var myPeerID = await MiscIpfsFunctions.returnMyPeerID();
    var myUsername = await MiscIpfsFunctions.returnMyUsername();

    var oConceptGraphsDirectory = await MiscFunctions.createNewWordByTemplate("conceptGraphsDirectory");
    oConceptGraphsDirectory.metaData.stewardPeerID = myPeerID;
    oConceptGraphsDirectory.metaData.stewardUsername = myUsername;
    oConceptGraphsDirectory.metaData.lastUpdate = Date.now();

    jQuery("#conceptGraphsDirectoryContainer").val(JSON.stringify(oConceptGraphsDirectory,null,4))
}

const saveThisRawFile = async () => {
    console.log("saveThisRawFile")
    var sConceptGraphsDirectory = jQuery("#conceptGraphsDirectoryContainer").val();
    var oConceptGraphsDirectory = JSON.parse(sConceptGraphsDirectory)

    var pCGb = window.ipfs.pCGb;
    var path = pCGb + "conceptGraphsDirectory/";
    var pathToFile = path + "node.txt";

    console.log("saveThisRawFile; path: "+path)
    console.log("saveThisRawFile; pathToFile: "+pathToFile)

    try { await MiscIpfsFunctions.ipfs.files.mkdir(path,{parents:true}) } catch (e) {}
    var fileToWrite = JSON.stringify(oConceptGraphsDirectory,null,4)
    try { await MiscIpfsFunctions.ipfs.files.rm(pathToFile, {recursive: true}) } catch (e) {}
    try { await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true}) } catch (e) {}
}

const loadExistingFile = async () => {
    var pCGb = window.ipfs.pCGb;
    var path = pCGb + "conceptGraphsDirectory/node.txt";
    var oConceptGraphsDirectory = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(path)
    if (oConceptGraphsDirectory) {
        jQuery("#conceptGraphsDirectoryContainer").val(JSON.stringify(oConceptGraphsDirectory,null,4))
    } else {
        jQuery("#conceptGraphsDirectoryContainer").val("file not available")
    }
}

const updateArrayOfLocalConceptGraphs = async () => {
    var pCGb = window.ipfs.pCGb;
    var aConceptGraphs = await ConceptGraphInMfsFunctions.returnListOfConceptGraphsInMFS(pCGb);
    console.log("aConceptGraphs: "+JSON.stringify(aConceptGraphs,null,4))
    var aLocal = [];
    for (var a=0;a<aConceptGraphs.length;a++) {
        var nextConceptGraphIpns = aConceptGraphs[a];
        var path = pCGb + nextConceptGraphIpns + "/words/mainSchemaForConceptGraph/node.txt"
        var oMainSchemaForConceptGraph = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(path)
        console.log("oMainSchemaForConceptGraph: "+JSON.stringify(oMainSchemaForConceptGraph,null,4))
        var wordSlug = oMainSchemaForConceptGraph.wordData.slug;
        var conceptGraphSlug = oMainSchemaForConceptGraph.conceptGraphData.slug;
        var conceptGraphName = oMainSchemaForConceptGraph.conceptGraphData.name;
        var conceptGraphTitle = oMainSchemaForConceptGraph.conceptGraphData.title;
        var oNextEntry = {};
        oNextEntry.slug = wordSlug
        oNextEntry.conceptGraphSlug = conceptGraphSlug
        oNextEntry.conceptGraphTitle = conceptGraphTitle
        oNextEntry.ipns = nextConceptGraphIpns
        aLocal.push(oNextEntry)
    }
    var sConceptGraphsDirectory = jQuery("#conceptGraphsDirectoryContainer").val();
    var oConceptGraphsDirectory = JSON.parse(sConceptGraphsDirectory)
    oConceptGraphsDirectory.conceptGraphsDirectoryData.local = aLocal;
    jQuery("#conceptGraphsDirectoryContainer").val(JSON.stringify(oConceptGraphsDirectory,null,4));
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////  PUBLIC  //////////////////////////////////////

const generateNewPublicFile = async () => {
    // var myPeerID = await MiscIpfsFunctions.returnMyPeerID();
    // var myUsername = await MiscIpfsFunctions.returnMyUsername();

    var oPublicConceptGraphsDirectory = MiscFunctions.cloneObj(oPCGD);
    console.log("oPublicConceptGraphsDirectory: "+ JSON.stringify(oPublicConceptGraphsDirectory,null,4))

    jQuery("#publicConceptGraphsDirectoryContainer").val(JSON.stringify(oPublicConceptGraphsDirectory,null,4))
}

const saveThisPublicRawFile = async () => {
    console.log("saveThisPublicRawFile")
    var sConceptGraphsDirectory = jQuery("#publicConceptGraphsDirectoryContainer").val();
    var oConceptGraphsDirectory = JSON.parse(sConceptGraphsDirectory)

    var pCG = window.ipfs.pCG;
    var path = pCG + "public/publicConceptGraphsDirectory/";
    var pathToFile = path + "node.txt";

    console.log("saveThisRawFile; path: "+path)
    console.log("saveThisRawFile; pathToFile: "+pathToFile)

    try { await MiscIpfsFunctions.ipfs.files.mkdir(path,{parents:true}) } catch (e) {}
    var fileToWrite = JSON.stringify(oConceptGraphsDirectory,null,4)
    try { await MiscIpfsFunctions.ipfs.files.rm(pathToFile, {recursive: true}) } catch (e) {}
    try { await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true}) } catch (e) {}
}

const loadExistingPublicFile = async () => {
    var pCG = window.ipfs.pCG;
    var path = pCG + "public/publicConceptGraphsDirectory/node.txt";
    var oPublicConceptGraphsDirectory = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(path)
    if (oPublicConceptGraphsDirectory) {
        jQuery("#publicConceptGraphsDirectoryContainer").val(JSON.stringify(oPublicConceptGraphsDirectory,null,4))
    } else {
        jQuery("#publicConceptGraphsDirectoryContainer").val("file not available")
    }
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

const populateSpecialRolesFields = async () => {
    var pCGb = window.ipfs.pCGb;
    var path = pCGb + "conceptGraphsDirectory/node.txt";
    var oConceptGraphsDirectory = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(path)

    var pCG = window.ipfs.pCG;
    var path = pCG + "public/publicConceptGraphsDirectory/node.txt";
    var oPublicConceptGraphsDirectory = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(path)

    if (oConceptGraphsDirectory) {
        var aLocalConceptGraphs = oConceptGraphsDirectory.conceptGraphsDirectoryData.localConceptGraphs;

        var aActive_cgSlug = oConceptGraphsDirectory.conceptGraphsDirectoryData.specialRoles.active;
        var viewing_cgSlug = oConceptGraphsDirectory.conceptGraphsDirectoryData.specialRoles.viewing;
        var neuroCore3Engine_cgSlug = oConceptGraphsDirectory.conceptGraphsDirectoryData.specialRoles.neuroCore3Engine;
        var neuroCore3Subject_cgSlug = oConceptGraphsDirectory.conceptGraphsDirectoryData.specialRoles.neuroCore3Subject;

        var aPublic = [];
        if (oPublicConceptGraphsDirectory) {
            aPublic = oPublicConceptGraphsDirectory.conceptGraphsDirectoryData.public;
        }

        jQuery("#plexActiveContainer").html(aActive_cgSlug[0])
        jQuery("#plexViewingContainer").html(viewing_cgSlug)
        jQuery("#neuroCore3EngineContainer").html(neuroCore3Engine_cgSlug)
        jQuery("#neuroCore3SubjectContainer").html(neuroCore3Subject_cgSlug)

        jQuery("#specialRolesSingleConceptGraphContainer").html("")
        for (var c=0;c<aLocalConceptGraphs.length;c++) {
            var oNextCg = aLocalConceptGraphs[c];
            var conceptGraphSlug = oNextCg.conceptGraphSlug
            var conceptGraphTitle = oNextCg.conceptGraphTitle
            var ipns = oNextCg.ipns
            var cgHTML = "";
            cgHTML += "<div style='margin-bottom:3px;' >"
                cgHTML += "<div style='display:inline-block;width:100px' >";
                cgHTML += conceptGraphSlug;
                cgHTML += "</div>"

                cgHTML += "<div data-cgslug='"+conceptGraphSlug+"' data-ipns='"+ipns+"' data-role='active' class='activeToggleButton specialRoleToggleButton' id='activeToggleButton_"+ipns+"' ";
                if (aActive_cgSlug.includes(conceptGraphSlug)) {
                    cgHTML += " data-status='yes' style='background-color:#00dd00;' ";
                } else {
                    cgHTML += " data-status='no' style='background-color:white;' ";
                }
                cgHTML += " >"
                cgHTML += "active"
                cgHTML += "</div>"

                cgHTML += "<div data-cgslug='"+conceptGraphSlug+"' data-ipns='"+ipns+"' data-role='nc3Engine' class='nc3EngineToggleButton specialRoleToggleButton' id='nc3EngineToggleButton_"+ipns+"' ";
                if (conceptGraphSlug==neuroCore3Engine_cgSlug) {
                    cgHTML += " data-status='yes' style='background-color:#00dd00;' ";
                } else {
                    cgHTML += " data-status='no' style='background-color:white;' ";
                }
                cgHTML += " >"
                cgHTML += "NC3 engine"
                cgHTML += "</div>"

                cgHTML += "<div data-cgslug='"+conceptGraphSlug+"' data-ipns='"+ipns+"' data-role='nc3Subject' class='nc3SubjectToggleButton specialRoleToggleButton' id='nc3SubjectToggleButton_"+ipns+"' ";
                if (conceptGraphSlug==neuroCore3Subject_cgSlug) {
                    cgHTML += " data-status='yes' style='background-color:#00dd00;' ";
                } else {
                    cgHTML += " data-status='no' style='background-color:white;' ";
                }
                cgHTML += " >"
                cgHTML += "NC3 subject"
                cgHTML += "</div>"

                cgHTML += "<div data-cgslug='"+conceptGraphSlug+"' data-ipns='"+ipns+"' data-role='public' class='publicToggleButton specialRoleToggleButton' id='publicToggleButton_"+ipns+"' ";
                if (aPublic.includes(ipns)) {
                    cgHTML += " data-status='yes' style='background-color:#00dd00;' ";
                } else {
                    cgHTML += " data-status='no' style='background-color:white;' ";
                }
                cgHTML += " >"
                cgHTML += "public"
                cgHTML += "</div>"

            cgHTML += "</div>"
            jQuery("#specialRolesSingleConceptGraphContainer").append(cgHTML)
        }
        jQuery(".specialRoleToggleButton").click(function(){
            var cg_ipns = jQuery(this).data("ipns")
            var status = jQuery(this).data("status")
            var role = jQuery(this).data("role")
            console.log("activeToggleButton clicked; status: "+status)
            if (status == "yes") {
                jQuery(this).data("status","no")
                jQuery(this).css("background-color","#EFEFEF")
                jQuery(this).css("border-color","orange")
            }
            if (status == "no") {
                if (role=="active") {
                    jQuery(".activeToggleButton").css("background-color","#EFEFEF")
                    jQuery(".activeToggleButton").data("status","no")
                }
                if (role=="nc3Engine") {
                    jQuery(".nc3EngineToggleButton").css("background-color","#EFEFEF")
                    jQuery(".nc3EngineToggleButton").data("status","no")
                }
                if (role=="nc3Subject") {
                    jQuery(".nc3SubjectToggleButton").css("background-color","#EFEFEF")
                    jQuery(".nc3SubjectToggleButton").data("status","no")
                }
                jQuery(this).data("status","yes")
                jQuery(this).css("background-color","#00dd00")
                jQuery(this).css("border-color","orange")
            }
        })
    }
}

export default class ConceptGraphsFrontEndManageDirectory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        await populateSpecialRolesFields()

        var pCGb = window.ipfs.pCGb;
        jQuery("#pCGbContainer").html(pCGb)
        var pCGd = pCGb + "conceptGraphsDirectory/node.txt";
        jQuery("#pCGdContainer").html(pCGd)
        jQuery("#pCGdContainer2").html(pCGd)

        var pCGpub = window.ipfs.pCGpub
        jQuery("#pCGpubContainer").html(pCGpub)
        jQuery("#pCGpubContainer2").html(pCGpub)

        jQuery("#generateNewFileButton").click(async function(){
            console.log("generateNewFileButton clicked")
            await generateNewFile();
        })
        jQuery("#createOrUpdateFileButton").click(async function(){
            console.log("createOrUpdateFileButton clicked")
            await saveThisRawFile();
        })
        jQuery("#loadExistingFileButton").click(async function(){
            console.log("loadExistingFileButton clicked")
            await loadExistingFile();
        })
        jQuery("#updateArrayOfLocalConceptGraphsButton").click(async function(){
            console.log("updateArrayOfLocalConceptGraphsButton clicked")
            await updateArrayOfLocalConceptGraphs();
        })

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

        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        jQuery("#showPublicConceptGraphsDirectoryButton").click(function(){
            jQuery(this).css("background-color","green")
            jQuery("#showConceptGraphsDirectoryButton").css("background-color","grey")
            jQuery("#conceptGraphsDirectoryBox").css("display","none")
            jQuery("#publicConceptGraphsDirectoryBox").css("display","block")
        })
        jQuery("#showConceptGraphsDirectoryButton").click(function(){
            jQuery(this).css("background-color","green")
            jQuery("#showPublicConceptGraphsDirectoryButton").css("background-color","grey")
            jQuery("#conceptGraphsDirectoryBox").css("display","block")
            jQuery("#publicConceptGraphsDirectoryBox").css("display","none")
        })

        jQuery("#implementSpecialRolesChangesButton").click(async function(){
            var pCGb = window.ipfs.pCGb;
            var path = pCGb + "conceptGraphsDirectory/node.txt";
            var oConceptGraphsDirectory = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(path)

            var pCG = window.ipfs.pCG;
            var path = pCG + "public/publicConceptGraphsDirectory/node.txt";
            var oPublicConceptGraphsDirectory = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(path)

            oPublicConceptGraphsDirectory.conceptGraphsDirectoryData.public = []

            oConceptGraphsDirectory.conceptGraphsDirectoryData.specialRoles.active = [];
            oConceptGraphsDirectory.conceptGraphsDirectoryData.specialRoles.public = [];
            oConceptGraphsDirectory.conceptGraphsDirectoryData.specialRoles.neuroCore3Engine = null;
            oConceptGraphsDirectory.conceptGraphsDirectoryData.specialRoles.neuroCore3Subject = null;

            jQuery(".activeToggleButton").each(function(i,obj){
                var status = jQuery(this).data("status")
                var cgSlug = jQuery(this).data("cgslug")
                if (status=="yes") {
                    oConceptGraphsDirectory.conceptGraphsDirectoryData.specialRoles.active.push(cgSlug)
                }
            })
            jQuery(".nc3EngineToggleButton").each(function(i,obj){
                var status = jQuery(this).data("status")
                var cgSlug = jQuery(this).data("cgslug")
                if (status=="yes") {
                    oConceptGraphsDirectory.conceptGraphsDirectoryData.specialRoles.neuroCore3Engine = cgSlug
                }
            })
            jQuery(".nc3SubjectToggleButton").each(function(i,obj){
                var status = jQuery(this).data("status")
                var cgSlug = jQuery(this).data("cgslug")
                if (status=="yes") {
                    oConceptGraphsDirectory.conceptGraphsDirectoryData.specialRoles.neuroCore3Subject = cgSlug
                }
            })
            jQuery(".publicToggleButton").each(function(i,obj){
                var status = jQuery(this).data("status")
                var cgSlug = jQuery(this).data("cgslug")
                var ipns = jQuery(this).data("ipns")
                if (status=="yes") {
                    oConceptGraphsDirectory.conceptGraphsDirectoryData.specialRoles.public.push(cgSlug)
                    oPublicConceptGraphsDirectory.conceptGraphsDirectoryData.public.push(ipns)
                }
            })
            jQuery("#conceptGraphsDirectoryContainer").val(JSON.stringify(oConceptGraphsDirectory,null,4));
            jQuery("#publicConceptGraphsDirectoryContainer").val(JSON.stringify(oPublicConceptGraphsDirectory,null,4));
            jQuery("#createOrUpdateFileButton").get(0).click()
            jQuery("#createOrUpdatePublicFileButton").get(0).click()
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                        <div class="h2">Manage Concept Graphs Directory (front end)</div>

                        <div style={{border:"1px solid orange",padding:"10px",fontSize:"10px",backgroundColor:"#DFDFDF"}} >
                            All front end concept graphs are stored in the Mutable File System along the following path:
                            <li><span style={{color:"red",marginRight:"20px"}} >pCGb</span><div id="pCGbContainer" style={{display:"inline-block",color:"red"}} >pCGb container</div></li>
                            <div>The file with the above information is stored at this location in the MFS:</div>
                            <li><span style={{color:"red",marginRight:"20px"}} >pCGd</span><div id="pCGdContainer" style={{display:"inline-block",color:"red"}} >pCGd container</div></li>
                            <div>The 10-character folder is unique to each node and should be known only to that node (? how secure - ? if need to chmod to make sure director is invisible + inaccessible).</div>
                            <div>File with publically available concept graph information is found at this path:</div>
                            <li><span style={{color:"red",marginRight:"20px"}} >pCGpub</span><div id="pCGpubContainer" style={{display:"inline-block",color:"red"}} >pCGpub container</div></li>
                        </div>

                        <div className="conceptGraphsPageBox" style={{marginTop:"10px"}} >
                            <div className="conceptGraphsPageLeftPanel" >
                            active:
                            </div>
                            <div className="conceptGraphsPageRightPanel" id="plexActiveContainer" >
                            plexActiveContainer
                            </div>
                            <div className="conceptGraphsPageDescriptionPanel" >
                            the concept graph(s) in active use to run this app. If more than one are active at any given time, there must be no conflicts between them,
                            e.g. no duplication of slugs, concept names, IPNS, etc. Future: may list mutiple subtypes of "active" (e.g. activeGrapevine, activeNeuroCore (to replace neuroCoreEngine),
                            activeConceptGraph, etc)
                            </div>
                        </div>

                        <div className="conceptGraphsPageBox" >
                            <div className="conceptGraphsPageLeftPanel" >
                            viewing:
                            </div>
                            <div className="conceptGraphsPageRightPanel" id="plexViewingContainer" >
                            plexViewingContainer
                            </div>
                            <div className="conceptGraphsPageDescriptionPanel" >
                            the concept graph that is being viewed
                            </div>
                        </div>

                        <div className="conceptGraphsPageBox" >
                            <div className="conceptGraphsPageLeftPanel" >
                            neuroCore3 active engine:
                            </div>
                            <div className="conceptGraphsPageRightPanel" id="neuroCore3EngineContainer" >
                            neuroCore3EngineContainer
                            </div>
                            <div className="conceptGraphsPageDescriptionPanel" >
                            the concept graph that runs NeuroCore3; concepts include action, pattern, etc.
                            </div>
                        </div>

                        <div className="conceptGraphsPageBox" >
                            <div className="conceptGraphsPageLeftPanel" >
                            neuroCore3 subject engine:
                            </div>
                            <div className="conceptGraphsPageRightPanel" id="neuroCore3SubjectContainer" >
                            neuroCore3SubjectContainer
                            </div>
                            <div className="conceptGraphsPageDescriptionPanel" >
                            the concept graph that is edited by NeuroCore3
                            </div>
                        </div>

                        <div style={{display:"inline-block",width:"400px",height:"650px",padding:"5px",backgroundColor:"#CFCFCF",marginRight:"5px"}}>
                            <center>manage special roles</center>
                            <div className="doSomethingButton" id="implementSpecialRolesChangesButton" >implement changes</div>
                            <div id="specialRolesSingleConceptGraphContainer" style={{border:"1px solid grey",padding:"5px",overflow:"scroll",fontSize:"10px"}} ></div>
                        </div>

                        <div style={{display:"inline-block",width:"750px",padding:"5px",backgroundColor:"#CFCFCF"}} >
                            <div className="doSomethingButton" id="showConceptGraphsDirectoryButton" style={{backgroundColor:"green"}} >show conceptGraphsDirectory</div>
                            <div className="doSomethingButton" id="showPublicConceptGraphsDirectoryButton" style={{backgroundColor:"grey"}} >show publicConceptGraphsDirectory</div>
                            <div id="conceptGraphsDirectoryBox" style={{display:"block",width:"700px",border:"1px solid blue",margin:"5px",padding:"5px"}} >
                                conceptGraphsDirectory:
                                <div className="doSomethingButton" id="loadExistingFileButton" >load existing file from MFS</div>
                                <div className="doSomethingButton" id="updateArrayOfLocalConceptGraphsButton" >update array of local concept graphs</div>
                                <div className="doSomethingButton" id="createOrUpdateFileButton" >save/update file (below)</div>
                                <div className="doSomethingButton" id="generateNewFileButton" style={{float:"right"}} >generate anew</div>
                                <div style={{clear:"both"}}></div>
                                <div style={{fontSize:"12px"}}><span style={{color:"red",marginRight:"20px"}} >pCGd</span><div id="pCGdContainer2" style={{display:"inline-block",color:"red"}} >pCGd container</div></div>
                                <textarea id="conceptGraphsDirectoryContainer" style={{width:"95%",height:"500px",fontSize:"12px"}} >
                                </textarea>
                            </div>

                            <div id="publicConceptGraphsDirectoryBox"  style={{display:"none",width:"700px",border:"1px solid blue",margin:"5px",padding:"5px"}} >
                                publicConceptGraphsDirectory:
                                <div className="doSomethingButton" id="loadExistingPublicFileButton" >load existing file from MFS</div><br/>
                                <div className="doSomethingButton" id="createOrUpdatePublicFileButton" >save/update file (below)</div>
                                <div className="doSomethingButton" id="generateNewPublicFileButton" style={{float:"right"}} >generate anew</div>
                                <div style={{clear:"both"}}></div>
                                <div style={{fontSize:"12px"}}><span style={{color:"red",marginRight:"20px"}} >pCGpub</span><div id="pCGpubContainer2" style={{display:"inline-block",color:"red"}} >pCGpub container</div></div>
                                <textarea id="publicConceptGraphsDirectoryContainer" style={{width:"95%",height:"500px",fontSize:"12px"}} >
                                </textarea>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
