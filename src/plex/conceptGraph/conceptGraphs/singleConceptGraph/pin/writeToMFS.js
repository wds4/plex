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
            var aCurrentTimes = []
            var currentTime = 0;
            var elapsedTime = 0;
            console.log("publishAllWordsButton clicked")
            for (var w=0;w<aWords.length;w++) {
                currentTime = Date.now();
                aCurrentTimes[w] = currentTime;

                var nextSlug = aWords[w];
                var oNextWord = window.lookupWordBySlug[nextSlug];
                var oNextWordStewardPeerID = oNextWord.metaData.stewardPeerID;
                /*
                // If steward is unknown and must be reassigned.
                // This is a PITA bc it means IPNS must be fixed in all schemas and concepts and in mainSchemaForConceptGraph
                if ( (oNextWordStewardPeerID != "QmWpLB32UFkrVTDHwstrf8wdFSen5kbrs1TGEzu8XaXtKQ") && (oNextWordStewardPeerID != "12D3KooWJpiTmrQGWG9oThj6MAMhMmm756htH2Co1TT6LsPsBWki") ) {
                    console.log("publishAllWordsButton, unknown steward; nextSlug: "+nextSlug)
                    var oNextWordUpdated = await ConceptGraphInMfsFunctions.republishWordToIpfsAndSqlAsNewSteward(oNextWord)
                    console.log("w = "+w+"; nextSlug: "+nextSlug)
                }
                */
                // normal operations:
                // console.log("oNextWord: "+JSON.stringify(oNextWord,null,4))
                var oNextWordUpdated = await ConceptGraphInMfsFunctions.republishWordToIpfsAndSqlIfSteward(oNextWord);
                elapsedTime = currentTime - aCurrentTimes[0];
                elapsedTime = Math.floor(elapsedTime/1000);
                console.log("w = "+w+"; nextSlug: "+nextSlug+"; elapsedTime: "+elapsedTime+" seconds")
                // console.log("oNextWordUpdated: "+JSON.stringify(oNextWordUpdated,null,4))
            }
        })
        jQuery("#updateAllSchemasButton").click(async function(){
            console.log("updateAllSchemasButton clicked")
            for (var w=0;w<aSchemas.length;w++) {
                var nextSchemaSlug = aSchemas[w];
                console.log("qwerty w = "+w+"; nextSchemaSlug: "+nextSchemaSlug)
                var oNextSchema = window.lookupWordBySlug[nextSchemaSlug];
                // console.log("oNextSchema: "+JSON.stringify(oNextSchema,null,4))
                var aNodes = MiscFunctions.cloneObj(oNextSchema.schemaData.nodes);
                var aNodes_updated = [];
                var aReAddedNodeSlugs = [];
                console.log("qwerty total number of nodes in schema "+nextSchemaSlug+": "+aNodes.length)
                for (var n=0;n<aNodes.length;n++) {
                    var oNextNodeInfo = aNodes[n];
                    var nn_perSchema_Slug = oNextNodeInfo.slug;
                    var nn_perSchema_Ipns = oNextNodeInfo.ipns;
                    var oNextWord = window.lookupWordBySlug[nn_perSchema_Slug];
                    var nn_perNode_Ipns = oNextWord.metaData.ipns;
                    oNextNodeInfo.ipns = nn_perNode_Ipns;
                    if ( (!oNextNodeInfo.hasOwnProperty("schemaData")) && (!oNextNodeInfo.hasOwnProperty("conceptData")) ) {
                        var nn_ipfs = await MiscIpfsFunctions.ipfs.resolve("/ipns/"+nn_perNode_Ipns)
                        nn_ipfs = nn_ipfs.replace("/ipfs/","")
                        oNextNodeInfo.ipfs = nn_ipfs
                    }
                    if (!aReAddedNodeSlugs.includes(nn_perSchema_Slug)) {
                        aNodes_updated.push(oNextNodeInfo)
                        aReAddedNodeSlugs.push(nn_perSchema_Slug)
                        console.log("qwerty adding oNextNodeInfo: "+JSON.stringify(oNextNodeInfo,null,4));
                    } else {
                        console.log("qwerty this node has already been added: "+nn_perSchema_Slug);
                    }
                    if (nn_perNode_Ipns != nn_perSchema_Ipns) {
                        console.log("qwerty node "+n+"; replacing ipns for slug: "+nn_perSchema_Slug+"; nn_perNode_Ipns: "+nn_perNode_Ipns+"; nn_perSchema_Ipns: "+nn_perSchema_Ipns)
                    }
                }
                oNextSchema.schemaData.nodes = aNodes_updated;
                var oNextSchemaUpdated = await ConceptGraphInMfsFunctions.republishWordToIpfsAndSqlIfSteward(oNextSchema);
                // console.log("oNextSchemaUpdated: "+JSON.stringify(oNextSchemaUpdated,null,4))
            }
        })
        jQuery("#updateAllConceptsButton").click(async function(){
            console.log("updateAllConceptsButton clicked")
            // for (var w=0;w<1;w++) {
            for (var w=0;w<aConcepts.length;w++) {
                var nextSlug = aConcepts[w];
                var oNextConcept = window.lookupWordBySlug[nextSlug];

                var nextConcept_slug = oNextConcept.conceptData.nodes.concept.slug;
                var nextWordType_slug = oNextConcept.conceptData.nodes.wordType.slug;
                var nextSchema_slug = oNextConcept.conceptData.nodes.schema.slug;
                var nextSuperset_slug = oNextConcept.conceptData.nodes.superset.slug;
                var nextJSONSchema_slug = oNextConcept.conceptData.nodes.JSONSchema.slug;
                var nextPrimaryProperty_slug = oNextConcept.conceptData.nodes.primaryProperty.slug;
                var nextPropertySchema_slug = oNextConcept.conceptData.nodes.propertySchema.slug;
                var nextProperties_slug = oNextConcept.conceptData.nodes.properties.slug;

                var oNextWordType = window.lookupWordBySlug[nextWordType_slug]
                var oNextSchema = window.lookupWordBySlug[nextSchema_slug]
                var oNextSuperset = window.lookupWordBySlug[nextSuperset_slug]
                var oNextJSONSchema = window.lookupWordBySlug[nextJSONSchema_slug]
                var oNextPrimaryProperty = window.lookupWordBySlug[nextPrimaryProperty_slug]
                var oNextPropertySchema = window.lookupWordBySlug[nextPropertySchema_slug]
                var oNextProperties = window.lookupWordBySlug[nextProperties_slug]

                var nextConcept_ipns = oNextConcept.metaData.ipns;
                var nextWordType_ipns = oNextWordType.metaData.ipns;
                var nextSchema_ipns = oNextSchema.metaData.ipns;
                var nextSuperset_ipns = oNextSuperset.metaData.ipns;
                var nextJSONSchema_ipns = oNextJSONSchema.metaData.ipns;
                var nextPrimaryProperty_ipns = oNextPrimaryProperty.metaData.ipns;
                var nextPropertySchema_ipns = oNextPropertySchema.metaData.ipns;
                var nextProperties_ipns = oNextProperties.metaData.ipns;

                oNextConcept.conceptData.nodes.concept.ipns = nextConcept_ipns;
                oNextConcept.conceptData.nodes.wordType.ipns = nextWordType_ipns;
                oNextConcept.conceptData.nodes.schema.ipns = nextSchema_ipns;
                oNextConcept.conceptData.nodes.superset.ipns = nextSuperset_ipns;
                oNextConcept.conceptData.nodes.JSONSchema.ipns = nextJSONSchema_ipns;
                oNextConcept.conceptData.nodes.primaryProperty.ipns = nextPrimaryProperty_ipns;
                oNextConcept.conceptData.nodes.propertySchema.ipns = nextPropertySchema_ipns;
                oNextConcept.conceptData.nodes.properties.ipns = nextProperties_ipns;

                var nn_ipfs = await MiscIpfsFunctions.ipfs.resolve("/ipns/"+nextConcept_ipns)
                nn_ipfs = nn_ipfs.replace("/ipfs/","")
                // oNextConcept.conceptData.nodes.concept.ipfs = nn_ipfs

                var nn_ipfs = await MiscIpfsFunctions.ipfs.resolve("/ipns/"+nextWordType_ipns)
                nn_ipfs = nn_ipfs.replace("/ipfs/","")
                oNextConcept.conceptData.nodes.wordType.ipfs = nn_ipfs

                var nn_ipfs = await MiscIpfsFunctions.ipfs.resolve("/ipns/"+nextSchema_ipns)
                nn_ipfs = nn_ipfs.replace("/ipfs/","")
                // oNextConcept.conceptData.nodes.schema.ipfs = nn_ipfs

                var nn_ipfs = await MiscIpfsFunctions.ipfs.resolve("/ipns/"+nextSuperset_ipns)
                nn_ipfs = nn_ipfs.replace("/ipfs/","")
                oNextConcept.conceptData.nodes.superset.ipfs = nn_ipfs

                var nn_ipfs = await MiscIpfsFunctions.ipfs.resolve("/ipns/"+nextJSONSchema_ipns)
                nn_ipfs = nn_ipfs.replace("/ipfs/","")
                oNextConcept.conceptData.nodes.JSONSchema.ipfs = nn_ipfs

                var nn_ipfs = await MiscIpfsFunctions.ipfs.resolve("/ipns/"+nextPrimaryProperty_ipns)
                nn_ipfs = nn_ipfs.replace("/ipfs/","")
                oNextConcept.conceptData.nodes.primaryProperty.ipfs = nn_ipfs

                var nn_ipfs = await MiscIpfsFunctions.ipfs.resolve("/ipns/"+nextPropertySchema_ipns)
                nn_ipfs = nn_ipfs.replace("/ipfs/","")
                // oNextConcept.conceptData.nodes.propertySchema.ipfs = nn_ipfs

                var nn_ipfs = await MiscIpfsFunctions.ipfs.resolve("/ipns/"+nextProperties_ipns)
                nn_ipfs = nn_ipfs.replace("/ipfs/","")
                oNextConcept.conceptData.nodes.properties.ipfs = nn_ipfs

                console.log("qwerty concept w = "+w+"; oNextConcept: "+JSON.stringify(oNextConcept,null,4))
                var oNextConcept = await ConceptGraphInMfsFunctions.republishWordToIpfsAndSqlIfSteward(oNextConcept);

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
