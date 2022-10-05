import React from "react";
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../../../lib/ipfs/miscIpfsFunctions.js'
import * as ConceptGraphInMfsFunctions from '../../../../lib/ipfs/conceptGraphInMfsFunctions.js'
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleConceptGraph_leftNav2.js';
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");

const reportMutableFilesTree = async (pCG0,path) => {
    var pathMinusPrefix = path.replace(pCG0,"./")
    for await (const file of MiscIpfsFunctions.ipfs.files.ls(path)) {
        var fileName = file.name;
        var fileType = file.type;
        var fileCid = file.cid;
        console.log("path: "+path+"; file name: "+fileName)
        console.log("path: "+path+"; file type: "+fileType)
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
        }
        reportHTML += "</div>";
        jQuery("#listOfAllPathsContainer").append(reportHTML)
        if (file.type=="directory") {
            var newPath=path+file.name+"/";
            await reportMutableFilesTree(pCG0,newPath)
        }
    }
}

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
        var pCG = "/plex/conceptGraphs/";
        var numConceptGraphs = 0;
        var isThisConceptGraphPresent = false;
        for await (const file of MiscIpfsFunctions.ipfs.files.ls(pCG)) {
            console.log("pCG: "+pCG+"; file name: "+file.name)
            console.log("pCG: "+pCG+"; file type: "+file.type)
            numConceptGraphs++;
            if (file.name==mainSchema_ipns) {
                isThisConceptGraphPresent = true;
            }
        }
        var pCG0 = pCG + mainSchema_ipns + "/";
        console.log("numConceptGraphs: "+numConceptGraphs+"; isThisConceptGraphPresent: "+isThisConceptGraphPresent)
        if (isThisConceptGraphPresent) {
            jQuery("#hasPlexFileBeenEstablishedContainer").html("YES")
            jQuery("#establishPlexMutableFileButtonContainer").css("display","none");
            jQuery("#pathToThisConceptGraphContainer").html(pCG0)
            jQuery("#listOfAllPathsContainer").html("")
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
                            jQuery("#clickedNodeRawFileContainer").html(chunk5)
                        } else {
                            jQuery("#clickedNodeRawFileContainer").html(chunk3)
                        }
                    } catch (e) {
                        console.log("error: "+e)
                        jQuery("#clickedNodeRawFileContainer").html(chunk3)
                    }
                }
            })
        }
        jQuery("#numberOfConceptGraphsContainer").html(numConceptGraphs)
        jQuery("#establishPlexMutableFileButton").click(async function(){
            console.log("establishPlexMutableFileButton clicked")
            await MiscIpfsFunctions.ipfs.files.mkdir(pCG0);
            alert("created directory: "+pCG0)
        })
        jQuery("#deleteAllDataButton").click(async function(){
            console.log("deleteAllDataButton clicked")
        })
        jQuery("#populateAllDataButton").click(async function(){
            console.log("populateAllDataButton clicked")
            // words: the central concept graph wordType; any node can be looked up here

            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"words/") } catch (e) {}

            // each of the other core wordTypes for concept graphs
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"concepts/") } catch (e) {}
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"wordTypes/") } catch (e) {}
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"schemas/") } catch (e) {}
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"JSONSchemas/") } catch (e) {}
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"supersets/") } catch (e) {}
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"sets/") } catch (e) {}
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"properties/") } catch (e) {}

            // each core wordType for ratings, reputation, etc
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"users/") } catch (e) {}
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"ratings/") } catch (e) {}
            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"ratingTemplates/") } catch (e) {}

            try { await MiscIpfsFunctions.ipfs.files.mkdir(pCG0+"influenceTypes/") } catch (e) {}

            var path = pCG0+"concepts/";
            var concept_wordSlug = "conceptFor_user";
            await ConceptGraphInMfsFunctions.populateSingleConcept(path,concept_wordSlug);
            MiscFunctions.timeout(200)
            var concept_wordSlug = "conceptFor_rating";
            await ConceptGraphInMfsFunctions.populateSingleConcept(path,concept_wordSlug);
            MiscFunctions.timeout(200)
            var concept_wordSlug = "conceptFor_influenceType";
            await ConceptGraphInMfsFunctions.populateSingleConcept(path,concept_wordSlug);
            // var path = pCG0+"concepts/"+concept_wordSlug+"/";
            /*
            // iterate through each concept

            // iterate through each word
            var aAllNodes = Object.keys(window.lookupWordBySlug)
            for (var z=0;z < aAllNodes.length;z++) {
                var nextNode_slug = aAllNodes[z];
                var oNextNode = MiscFunctions.cloneObj(window.lookupWordBySlug[nextNode_slug]);
                var sNextNode = JSON.stringify(oNextNode,null,4)
                var nextNodePath = pCG0 + nextNode_slug;
                console.log("adding file nextNodePath: "+nextNodePath)
                await MiscIpfsFunctions.ipfs.files.write(nextNodePath, new TextEncoder().encode(sNextNode), {create: true, flush: true})
            }
            */
            // redraw tree
            jQuery("#listOfAllPathsContainer").html("")
            await reportMutableFilesTree(pCG0,pCG0)
        })
        jQuery("#removeDirectoryButton").click(async function(){
            console.log("removeDirectoryButton clicked")
            await MiscIpfsFunctions.ipfs.files.rm(pCG0, { recursive: true });
            alert("removed this directory and its contents: "+pCG0)
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
                        <div class="h2">Push this Concept Graph to the IPFS Mutable File System (deprecating)</div>

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

                        <div style={{fontSize:"12px",border:"1px dashed grey",padding:"10px",marginBottom:"10px",height:"430px"}}>
                            <center>current MFS file structure for this concept graph</center>

                            <div style={{height:"400px",overflow:"scroll"}}>
                                <div style={{display:"inline-block"}} >
                                    <div style={{marginBottom:"5px"}}>
                                        pGC0 = <div style={{display:"inline-block"}} id="pathToThisConceptGraphContainer" >pathToThisConceptGraphContainer</div>
                                    </div>
                                    <div id="listOfAllPathsContainer" style={{display:"inline-block",width:"900px",border:"1px dashed purple",height:"380px",overflow:"scroll"}} ></div>
                                </div>

                                <div style={{display:"inline-block",height:"100%"}} >
                                    <div style={{marginBottom:"5px"}}>
                                        cid = <div style={{display:"inline-block"}} id="cidToThisFileContainer" >cidToThisFileContainer</div>
                                    </div>
                                    <textarea id="clickedNodeRawFileContainer" style={{display:"inline-block",width:"500px",height:"95%",border:"1px dashed grey",overflow:"scroll"}} ></textarea>
                                </div>
                            </div>
                        </div>

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
