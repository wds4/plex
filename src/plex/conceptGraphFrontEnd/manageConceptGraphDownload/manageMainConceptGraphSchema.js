import React from 'react';
import Masthead from '../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/cgFe_manageDownloads_leftNav2.js';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
import * as ConceptGraphInMfsFunctions from '../../lib/ipfs/conceptGraphInMfsFunctions.js'
// import * as InitDOMFunctions from '../functions/transferSqlToDOM.js';

const jQuery = require("jquery");

export default class ManageConceptGraphDownload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var oIpfsID = await MiscIpfsFunctions.ipfs.id();
        var myPeerID = oIpfsID.id;

        var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
        jQuery("#ipnsForViewingMainSchemaForConceptGraphContainer").html(viewingConceptGraph_ipns)

        var keyname_forCompleteCGPathDir = "plex_pathToActiveConceptGraph_"+myPeerID.slice(-10);
        jQuery("#keynameForPathToCompleteConceptGraphContainer").html(keyname_forCompleteCGPathDir)

        var ipns_forCompleteCGPathDir = await ConceptGraphInMfsFunctions.returnIPNSForCompleteCGPathDir(keyname_forCompleteCGPathDir)
        jQuery("#ipnsForPathToCompleteConceptGraphContainer").html(ipns_forCompleteCGPathDir)
        var ipns10_forCompleteCGPathDir = ipns_forCompleteCGPathDir.slice(-10);

        var isIpns10DirPresent = await ConceptGraphInMfsFunctions.isIpns10DirPresent(ipns10_forCompleteCGPathDir);
        if (isIpns10DirPresent) {
            var resultHTML = "YES";
            jQuery("#isDirectory1PresentContainer").css("backgroundColor","green")
        }
        if (!isIpns10DirPresent) {
            var resultHTML = "NO";
            jQuery("#isDirectory1PresentContainer").css("backgroundColor","red")
        }
        jQuery("#isDirectory1PresentContainer").html(resultHTML)

        jQuery("#dirForPathToCompleteConceptGraphContainer1").html(ipns10_forCompleteCGPathDir)
        jQuery("#dirForPathToCompleteConceptGraphContainer2").html(ipns10_forCompleteCGPathDir)
        jQuery("#dirForPathToCompleteConceptGraphContainer3").html(ipns10_forCompleteCGPathDir)

        jQuery("#storeSeedMSFCGButton").click(async function(){
            console.log("storeSeedMSFCGButton clicked")
            var mainSchema_external_ipns = window.ipfs.mainSchemaForConceptGraph_defaultExternalIPNS
            var newIPNS = await ConceptGraphInMfsFunctions.addConceptGraphSeedToMFS(mainSchema_external_ipns,ipns10_forCompleteCGPathDir)
        })

        // var mainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug
        // var oMainSchema = window.lookupWordBySlug[mainSchema_slug]
        // var mainSchema_external_ipns = oMainSchema.metaData.ipns;
        // Default mainSchema ipns:
        // var mainSchema_external_ipns = "k2k4r8jya910bj45nxvwiw7pjqr611qv431331sx3py6ee2tiwxtmf6y";
        var mainSchema_external_ipns = window.ipfs.mainSchemaForConceptGraph_defaultExternalIPNS
        console.log("mainSchema_external_ipns: "+mainSchema_external_ipns)
        jQuery("#mainSchemaSeedIPNSContainer").html(mainSchema_external_ipns)

        var pathToLocalMSFCG = "/plex/conceptGraphs/"+ipns10_forCompleteCGPathDir+"/"+viewingConceptGraph_ipns+"/words/mainSchemaForConceptGraph/node.txt";
        // console.log("pathToLocalMSFCG: "+pathToLocalMSFCG)
        var oMainSchemaForConceptGraphLocal = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(pathToLocalMSFCG)
        var mainSchema_local_ipns = oMainSchemaForConceptGraphLocal.metaData.ipns;
        jQuery("#mainSchemaSeed_local_IPNSContainer").html(mainSchema_local_ipns)
        jQuery("#conceptGraphRootPathContainer").html(mainSchema_local_ipns)

        var isCgDirPresent = await ConceptGraphInMfsFunctions.isActiveConceptGraphDirPresent(ipns10_forCompleteCGPathDir,mainSchema_local_ipns);
        if (isCgDirPresent) {
            var resultHTML = "YES";
            jQuery("#isDirectory2PresentContainer").css("backgroundColor","green")
        }
        if (!isCgDirPresent) {
            var resultHTML = "NO";
            jQuery("#isDirectory2PresentContainer").css("backgroundColor","red")
        }
        jQuery("#isDirectory2PresentContainer").html(resultHTML)
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                    <div className="mainPanel" >
                        <Masthead viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                        <div class="h2">Manage mainSchemaForConceptGraph</div>

                        <div style={{border:"1px dashed grey",padding:"5px",fontSize:"12px",marginTop:"20px"}} >
                            <div style={{color:"purple"}} >Directory Generation (10 characters, unknown to other nodes)</div>

                            <div>
                                <div style={{display:"inline-block",width:"200px"}} >
                                keyname:
                                </div>
                                <div id="keynameForPathToCompleteConceptGraphContainer" style={{display:"inline-block",backgroundColor:"#DFDFDF",width:"500px"}} >
                                keynameForPathToCompleteConceptGraphContainer
                                </div>
                                <div style={{display:"inline-block",marginLeft:"20px",backgroundColor:"#EFEFEF"}} >
                                (derived from my peerID)
                                </div>
                            </div>
                            <div>
                                <div style={{display:"inline-block",width:"200px"}} >
                                IPNS:
                                </div>
                                <div id="ipnsForPathToCompleteConceptGraphContainer" style={{display:"inline-block",backgroundColor:"#DFDFDF",width:"500px"}} >
                                ipnsForPathToCompleteConceptGraphContainer
                                </div>
                                <div style={{display:"inline-block",marginLeft:"20px",backgroundColor:"#EFEFEF"}} >
                                (derived from above keyname)
                                </div>
                            </div>

                            <div>
                                <div style={{display:"inline-block",width:"200px"}} >
                                dir:
                                </div>
                                <div style={{display:"inline-block",backgroundColor:"#DFDFDF",width:"500px"}} >
                                    /plex/conceptGraphs/
                                    <div id="dirForPathToCompleteConceptGraphContainer1" style={{display:"inline-block"}} >
                                    dirForPathToCompleteConceptGraphContainer1
                                    </div>
                                </div>
                                <div style={{display:"inline-block",marginLeft:"20px"}} >
                                (last 10 chars of ipns) - directory exist?
                                </div>
                                <div id="isDirectory1PresentContainer" style={{display:"inline-block",marginLeft:"20px",backgroundColor:"red",width:"45px",textAlign:"center",color:"white"}} >
                                ?
                                </div>
                            </div>

                            <div>
                                <div style={{display:"inline-block",width:"200px"}} >
                                IPNS-viewing:
                                </div>
                                <div id="ipnsForViewingMainSchemaForConceptGraphContainer" style={{display:"inline-block",backgroundColor:"#DFDFDF",width:"500px"}} >
                                ipnsForViewingMainSchemaForConceptGraphContainer
                                </div>
                                <div style={{display:"inline-block",marginLeft:"20px",backgroundColor:"#EFEFEF"}} >
                                (the IPNS of mainSchemaForConceptGraph currently being viewed / edited)
                                </div>
                            </div>

                        </div>

                        <div style={{border:"1px dashed grey",padding:"5px",fontSize:"12px",marginTop:"20px"}} >
                            <div style={{color:"purple"}} >Download mainSchemaForConceptGraph from external source to local MFS</div>
                            <div>
                                <div style={{display:"inline-block",width:"500px"}} >
                                mainSchemaForConceptGraph externally-derived IPNS (seed):
                                </div>
                                <div id="mainSchemaSeedIPNSContainer" style={{display:"inline-block"}} >
                                </div>
                                <div style={{display:"inline-block",marginLeft:"20px",backgroundColor:"#EFEFEF"}} >
                                (hardcoded default)
                                </div>

                                <br/>

                                <div className="doSomethingButton_small" id="storeSeedMSFCGButton" >plant (or update) seed</div>
                            </div>
                            <div >
                            This is the seed IPNS which will be used to download the default Concept Graph from an external source.
                            Once downloaded, the mainSchemaForConceptGraph will be given a new IPNS, with the old one archived in metaData.
                            Next, each word will be placed in the MFS and given a new, local IPNS address. The same keynames will be used if present.
                            The old IPNS, author (if known), and keyname will be recorded.
                            </div>
                            <div >
                            pCGs = /plex/conceptGraphs/<div id="dirForPathToCompleteConceptGraphContainer2" style={{display:"inline-block"}} ></div>/mainSchemaForConceptGraph/node.txt
                            <br/>
                            pCGs is the path to the active "seed" node (with locally-controlled keyname and IPNS) for the Concept Graph.
                            </div>
                        </div>

                        <div style={{border:"1px dashed grey",padding:"5px",fontSize:"12px",marginTop:"20px"}} >
                            <div>
                                <div style={{display:"inline-block",width:"500px"}} >
                                mainSchemaForConceptGraph local IPNS:
                                </div>
                                <div id="mainSchemaSeed_local_IPNSContainer" style={{display:"inline-block"}} >
                                </div>

                            </div>
                            <div >
                            If pCGs (above) yields a functioning data file -- (slug: mainSchemaForConceptGraph, with keyname and IPNS under my control) --
                            its IPNS will be recorded here (above). This is the ACTIVE concept graph for this node.
                            (Other concept graphs may also be recorded in the Mutable File System. Switching the ACTIVE cg from one to another is achieved simply by replacing
                            the file at the end of the pCGs pathway.)
                            </div>
                            Root path via Mutable File System to the entirety of the CURRENTLY ACTIVE concept graph:
                            <div >
                            pGC0 = /plex/conceptGraphs/<div id="dirForPathToCompleteConceptGraphContainer3" style={{display:"inline-block"}} ></div>/<div id="conceptGraphRootPathContainer" style={{display:"inline-block"}} ></div>/

                            <div style={{display:"inline-block",marginLeft:"20px",width:"100px"}} >
                            directory exist?
                            </div>
                            <div id="isDirectory2PresentContainer" style={{display:"inline-block",marginLeft:"20px",backgroundColor:"red",width:"45px",textAlign:"center",color:"white"}} >
                            ?
                            </div>
                            <div style={{display:"inline-block",marginLeft:"20px"}} >
                            (if not - establish it with Build Skeleton Directory on next page)
                            </div>

                            </div>
                            <div >
                            The files under pGC0 will be managed on a separate page.
                            </div>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
