import React from "react";
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../../../lib/ipfs/miscIpfsFunctions.js'
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleConceptGraph_leftNav2.js';
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");

export default class SingleConceptGraphPinToIPFS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var mainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug
        var oMainSchema = window.lookupWordBySlug[mainSchema_slug]
        var mainSchema_ipns = oMainSchema.metaData.ipns;
        jQuery("#mainSchemaIpnsContainer").html(mainSchema_ipns);
        jQuery("#establishPlexMutableFileButton").html("establish directory: /plex/conceptGraphs/"+mainSchema_ipns)
        var expectedPathA = "/plex/conceptGraphs/";
        var numConceptGraphs = 0;
        var isThisConceptGraphPresent = false;
        for await (const file of MiscIpfsFunctions.ipfs.files.ls(expectedPathA)) {
            console.log("expectedPathA: "+expectedPathA+"; file name: "+file.name)
            console.log("expectedPathA: "+expectedPathA+"; file type: "+file.type)
            numConceptGraphs++;
            if (file.name==mainSchema_ipns) {
                isThisConceptGraphPresent = true;
            }
        }
        var expectedPathB = expectedPathA + mainSchema_ipns + "/";
        console.log("numConceptGraphs: "+numConceptGraphs+"; isThisConceptGraphPresent: "+isThisConceptGraphPresent)
        if (isThisConceptGraphPresent) {
            jQuery("#hasPlexFileBeenEstablishedContainer").html("YES")
            jQuery("#establishPlexMutableFileButtonContainer").css("display","none");
        }
        jQuery("#numberOfConceptGraphsContainer").html(numConceptGraphs)
        jQuery("#establishPlexMutableFileButton").click(async function(){
            console.log("establishPlexMutableFileButton clicked")

            await MiscIpfsFunctions.ipfs.files.mkdir(expectedPathB);
            alert("created directory: "+expectedPathB)
        })
        jQuery("#deleteAllNodesButton").click(async function(){
            console.log("deleteAllNodesButton clicked")
        })
        jQuery("#populateAllNodesButton").click(async function(){
            console.log("populateAllNodesButton clicked")
            // await MiscIpfsFunctions.ipfs.files.write('/hello-world', new TextEncoder().encode('Hello, world!'), {create: true, flush: true})
            // var oAllNodes = MiscFunctions.cloneObj(window.lookupWordBySlug)
            var aAllNodes = Object.keys(window.lookupWordBySlug)
            for (var z=0;z < aAllNodes.length;z++) {
                var nextNode_slug = aAllNodes[z];
                var oNextNode = MiscFunctions.cloneObj(window.lookupWordBySlug[nextNode_slug]);
                var sNextNode = JSON.stringify(oNextNode,null,4)
                var nextNodePath = expectedPathB + nextNode_slug;
                // var nextNodePath = "/grapevineData/" + nextNode_slug + ".txt";
                console.log("adding file nextNodePath: "+nextNodePath)
                await MiscIpfsFunctions.ipfs.files.write(nextNodePath, new TextEncoder().encode(sNextNode), {create: true, flush: true})
            }
        })
        jQuery("#removeDirectoryButton").click(async function(){
            console.log("removeDirectoryButton clicked")
            await MiscIpfsFunctions.ipfs.files.rm(expectedPathB, { recursive: true });
            alert("removed this directory and its contents: "+expectedPathB)
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
                        <div class="h2">Pin this Concept Graph to the IPFS</div>

                        <pre>
                        expected result:<br/>
                        /plex/conceptGraphs/ipns to mainSchemaForConceptGraph for the concept graph (directory)/slug (wordSlug) for word (file)<br/>
                        <br/>
                        e.g.:<br/>
                        /plex/conceptGraphs/k2k4r8jya910bj45nxvwiw7pjqr611qv431331sx3py6ee2tiwxtmf6y/conceptFor_relationshipsTypes<br/>
                        k2k4r8jya910bj45nxvwiw7pjqr611qv431331sx3py6ee2tiwxtmf6y is a directory and is the IPNS for k2k4r8jya910bj45nxvwiw7pjqr611qv431331sx3py6ee2tiwxtmf6y<br/>
                        Every node in this concept graph (including the mainSchemaForConceptGraph) will be represented as a file in this directory
                        </pre>

                        <div style={{border:"1px dashed grey",padding:"5px"}} >
                            <div>
                                <div style={{display:"inline-block",width:"500px"}} >
                                mainSchemaForConceptGraph slug:
                                </div>
                                <div style={{display:"inline-block"}} >
                                {window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug}
                                </div>
                            </div>

                            <div>
                                <div style={{display:"inline-block",width:"500px"}} >
                                mainSchemaForConceptGraph IPNS:
                                </div>
                                <div id="mainSchemaIpnsContainer" style={{display:"inline-block"}} >
                                .
                                </div>
                            </div>

                            <div>
                                <div style={{display:"inline-block",width:"500px"}} >
                                number of concept graphs in /plex/conceptGraphs/:
                                </div>
                                <div id="numberOfConceptGraphsContainer" style={{display:"inline-block"}} >
                                ?
                                </div>
                            </div>

                            <div>
                                <div style={{display:"inline-block",width:"500px"}} >
                                Has this concept graph been established in the mutable file directory (under /plex/conceptGraphs)?
                                </div>

                                <div id="hasPlexFileBeenEstablishedContainer" style={{display:"inline-block"}} >
                                NO
                                </div>

                                <div id="establishPlexMutableFileButtonContainer"  >
                                    <div id="establishPlexMutableFileButton" className="doSomethingButton" >establish mutable file: /plex</div>
                                </div>
                            </div>
                        </div>

                        <div id="populateAllNodesButton" className="doSomethingButton" >populate all nodes for this concept graph</div>
                        <div id="deleteAllNodesButton" className="doSomethingButton" >delete all nodes in this concept graph directory</div>
                        <div id="removeDirectoryButton" className="doSomethingButton" >remove the directory for this concept graph</div>

                    </div>
                </fieldset>
            </>
        );
    }
}
