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
        jQuery("#deleteAllDataButton").click(async function(){
            console.log("deleteAllDataButton clicked")
        })
        jQuery("#populateAllDataButton").click(async function(){
            console.log("populateAllDataButton clicked")
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
                        <div class="h2">Push this Concept Graph to the IPFS Mutable File System</div>

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

                        <div id="populateAllDataButton" className="doSomethingButton" >build entire MFS for this concept graph from scratch</div>
                        <div id="deleteAllDataButton" className="doSomethingButton" >delete this contents of this concept graph from the MFS</div>
                        <div id="removeDirectoryButton" className="doSomethingButton" >remove the directory for this concept graph from the MFS</div>

                        <div style={{fontSize:"12px",border:"1px dashed grey",padding:"10px",marginBottom:"10px"}}>
                            <p>Pushing the production concept graph to the MFS provides a convenient and efficient way for apps to look up data from the concept graph
                            without the necessity of looking up individual words to extract things like subsets from globalDynamicData. Each of the files stored
                            in the concept graph MFS is a node (a word) in the concept graph. These may be stored either as .txt or as .json files. Although for now all nodes
                            are json files, this may not always be the case.</p>
                            <br/>
                            <p>There will in general be multiple paths to any given node.</p>
                            <br/>
                            <p>Future: duplicate tree but use IPNS hash in place of word-slug for each node.</p>
                            <br/>
                            <p>Consider: duplicate trees using one (or all) of the *guaranteed unique* fields (slug, name, etc) e.g. influence can be used in place of conceptFor_influence</p>
                            <br/>
                            <p>To do: write functions to look up info on the concept graph MFS, with backup paths in case the primary desired path cannot be found.
                            <li>Example 1: function to look for list of verified users via verification method A, but if that is not found, fall back to verification method B, or simply no verification at all.</li>
                            <li>Example 2: function to look for data point using wordSlug (e.g. influenceType_objectiveReality_abc123), but if that cannot be found,
                            try alternative human-readable names or slugs, e.g. objectiveReality or objective reality or truth. the first option is more likely to find
                            the precise desired version of the data point; but if that is not available, may pull a less desired but nevertheless acceptable variation.</li>
                            </p>
                        </div>

                        <pre style={{height:"400px",overflow:"scroll",border:"1px dashed grey",padding:"10px"}}>
                        expected result:<br/>
                        pCG0 = /plex/conceptGraphs/ipns to mainSchemaForConceptGraph for the concept graph (directory)/slug (wordSlug) for word (file)/node.txt<br/>
                        Then for every node in the concept graph:<br/>
                        pCG0/words/slug (wordSlug) for word (file)/node.txt<br/>
                        <br/>
                        In addition, each major word type gives rise to the following structures:<br/>
                        pCG0/concepts/conceptFor_foo/node.txt<br/>
                        pCG0/wordTypes/wordTypeFor_foo/node.txt<br/>
                        pCG0/supersets/supersetFor_foo/node.txt<br/>
                        pCG0/JSONSchemas/JSONSchemaFor_foo/node.txt<br/>
                        pCG0/schemas/schemaFor_foo/node.txt<br/>
                        <br/>
                        Each concept gives rise to the following structures:<br/>
                        pCG0/concepts/conceptFor_foo/wordType/wordTypeFor_foo/node.txt<br/>
                        pCG0/concepts/conceptFor_foo/superset/supersetFor_foo/node.txt<br/>
                        pCG0/concepts/conceptFor_foo/sets/setOf_foo/node.txt<br/>
                        pCG0/concepts/conceptFor_foo/specificInstances/---_foo/node.txt<br/>
                        <br/>
                        Each set and superset gives rise to the following structures (essentially recreating data from globalDynamicData):<br/>
                        pCG0/concepts/conceptFor_foo/superset/allSpecificInstances/---_foo/node.txt<br/>
                        pCG0/concepts/conceptFor_foo/superset/directSpecificInstances/---_foo/node.txt<br/>
                        pCG0/concepts/conceptFor_foo/superset/allSubsets/setOf_foo/node.txt<br/>
                        pCG0/concepts/conceptFor_foo/superset/directSubsets/setOf_foo/node.txt<br/>
                        pCG0/concepts/conceptFor_foo/superset/directSubsets/setOf_foo/directSubsets/...<br/>
                        <br/>
                        e.g.:<br/>
                        /plex/conceptGraphs/k2k4r8jya910bj45nxvwiw7pjqr611qv431331sx3py6ee2tiwxtmf6y/conceptFor_relationshipsTypes/node.txt<br/>
                        k2k4r8jya910bj45nxvwiw7pjqr611qv431331sx3py6ee2tiwxtmf6y is a directory and is the IPNS for k2k4r8jya910bj45nxvwiw7pjqr611qv431331sx3py6ee2tiwxtmf6y<br/>
                        Every node in this concept graph (including the mainSchemaForConceptGraph) will be represented as a file in this directory
                        </pre>

                    </div>
                </fieldset>
            </>
        );
    }
}
