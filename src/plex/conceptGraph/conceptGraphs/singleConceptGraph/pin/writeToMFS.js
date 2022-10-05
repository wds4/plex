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
        console.log("mainSchema_ipns: "+mainSchema_ipns)
        jQuery("#mainSchemaSeedIPNSContainer").html(mainSchema_ipns)

        jQuery("#storeSeedMSFCGButton").click(async function(){
            console.log("storeSeedMSFCGButton clicked")
            var newIPNS = await ConceptGraphInMfsFunctions.addConceptGraphSeedToMFS(oMainSchema)
        })
        jQuery("#updateSeedMSFCGButton").click(async function(){
            console.log("storeSeedMSFCGButton clicked")
            // await ConceptGraphInMfsFunctions.updateConceptGraphSeedToMFS(oMainSchema)
        })



        var oRFL = MiscFunctions.cloneObj(window.lookupWordBySlug);
        var aWords = Object.keys(oRFL)
        var aSchemas = [];
        var aConcepts = [];
        for (var w=0;w<aWords.length;w++) {
            var nextSlug = aWords[w];
            var oNextWord = window.lookupWordBySlug[nextSlug];
            if (oNextWord.hasOwnProperty("schemaData")) {
                aSchemas.push(nextSlug)
            }
            if (oNextWord.hasOwnProperty("conceptData")) {
                aConcepts.push(nextSlug)
            }
        }
        jQuery("#numWordsTotalContainer").html(aWords.length);
        jQuery("#numSchemasTotalContainer").html(aSchemas.length);
        jQuery("#numConceptsTotalContainer").html(aConcepts.length);

        jQuery("#publishAllWordsButton").click(async function(){
            console.log("publishAllWordsButton clicked")
            for (var w=8;w<9;w++) {
                var nextSlug = aWords[w];
                var oNextWord = window.lookupWordBySlug[nextSlug];
                console.log("w = "+w+"; nextSlug: "+nextSlug)
                console.log("oNextWord: "+JSON.stringify(oNextWord,null,4))
                var oNextWordUpdated = await ConceptGraphInMfsFunctions.republishWordToIpfsAndSqlIfSteward(oNextWord);
                console.log("oNextWordUpdated: "+JSON.stringify(oNextWordUpdated,null,4))
            }
        })
        jQuery("#updateAllSchemasButton").click(async function(){
            console.log("updateAllSchemasButton clicked")
            for (var w=0;w<aSchemas.length;w++) {
                var nextSlug = aSchemas[w];
                var oNextWord = window.lookupWordBySlug[nextSlug];
            }
        })
        jQuery("#updateAllConceptsButton").click(async function(){
            console.log("updateAllConceptsButton clicked")
            for (var w=0;w<aConcepts.length;w++) {
                var nextSlug = aConcepts[w];
                var oNextWord = window.lookupWordBySlug[nextSlug];
            }
        })
        jQuery("#updateMainSchemaForConceptGraphButton").click(async function(){
            console.log("updateMainSchemaForConceptGraphButton clicked")
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

                        <div style={{border:"1px dashed grey",padding:"5px",fontSize:"12px"}} >
                            <center>Prepare Concept Graph: update and publish from local SQL to IPFS</center>

                            <div style={{backgroundColor:"#BBFFBB",padding:"5px",marginBottom:"20px"}} >
                                <div >
                                Cycle through all words in SQL; if I control the key - ipns pair within metaData, then I will ipfs.add the word,
                                update stewardPeerID / lastUpdate / stewardUsername,
                                then ipfs.publish the word so that its ipns resolves to its latest ipfs.
                                </div>
                                <div className="doSomethingButton" id="publishAllWordsButton" >publish all words</div>
                                <div >
                                    <div style={{display:"inline-block"}} >num words updated:</div>
                                    <div id="numWordsCompletedContainer" style={{display:"inline-block",marginLeft:"5px"}} >?</div>
                                    <br/>
                                    <div style={{display:"inline-block"}} >num words total:</div>
                                    <div id="numWordsTotalContainer" style={{display:"inline-block",marginLeft:"5px"}} >?</div>
                                </div>
                            </div>

                            <div style={{backgroundColor:"#BBFFBB",padding:"5px",marginBottom:"20px"}} >
                                <div >
                                Cycle through all schemas
                                </div>
                                <div className="doSomethingButton" id="updateAllSchemasButton" >update and publish all schemas</div>
                                <div >
                                    <div style={{display:"inline-block"}} >num schemas updated:</div>
                                    <div id="numSchemasCompletedContainer" style={{display:"inline-block",marginLeft:"5px"}} >?</div>
                                    <br/>
                                    <div style={{display:"inline-block"}} >num schemas total:</div>
                                    <div id="numSchemasTotalContainer" style={{display:"inline-block",marginLeft:"5px"}} >?</div>
                                </div>
                            </div>

                            <div style={{backgroundColor:"#BBFFBB",padding:"5px",marginBottom:"20px"}} >
                                <div >
                                Cycle through all concepts
                                </div>
                                <div className="doSomethingButton" id="updateAllConceptsButton" >update all concepts</div>
                                <div >
                                    <div style={{display:"inline-block"}} >num concepts updated:</div>
                                    <div id="numConceptsCompletedContainer" style={{display:"inline-block",marginLeft:"5px"}} >?</div>
                                    <br/>
                                    <div style={{display:"inline-block"}} >num concepts total:</div>
                                    <div id="numConceptsTotalContainer" style={{display:"inline-block",marginLeft:"5px"}} >?</div>
                                </div>
                            </div>

                            <div style={{backgroundColor:"#BBFFBB",padding:"5px",marginBottom:"20px"}} >
                                <div >
                                update mainSchemaForConceptGraph
                                </div>
                                <div className="doSomethingButton" id="updateMainSchemaForConceptGraphButton" >update mainSchemaForConceptGraph</div>
                            </div>
                        </div>

                        <div style={{border:"1px dashed grey",padding:"5px",fontSize:"12px",marginTop:"20px"}} >
                            <div>
                                <div style={{display:"inline-block",width:"500px"}} >
                                mainSchemaForConceptGraph IPNS (seed):
                                </div>
                                <div id="mainSchemaSeedIPNSContainer" style={{display:"inline-block"}} >
                                </div>
                                <div className="doSomethingButton_small" id="storeSeedMSFCGButton" >plant seed</div>
                                <div className="doSomethingButton_small" id="updateSeedMSFCGButton" >update seed</div>
                            </div>
                            <div >
                            This is the seed IPNS which will be used to download the default Concept Graph from an external source.
                            Once downloaded, the mainSchemaForConceptGraph will be given a new IPNS, with the old one archived in metaData.
                            Next, each word will be placed in the MFS and given a new, local IPNS address. The same keynames will be used if present.
                            The old IPNS, author (if known), and keyname will be recorded.
                            </div>
                            <div >
                            pCG0 = /plex/conceptGraphs/mainSchemaForConceptGraph/node.txt -- IPNS will be derived from this.
                            </div>
                        </div>


                    </div>
                </fieldset>
            </>
        );
    }
}
