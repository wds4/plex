import React from 'react';
import Masthead from '../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/cgFe_manageDownloads_leftNav2.js';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js';
import * as ConceptGraphInMfsFunctions from '../../lib/ipfs/conceptGraphInMfsFunctions.js'
// import * as MiscFunctions from '../functions/miscFunctions.js';
// import * as InitDOMFunctions from '../functions/transferSqlToDOM.js';

const jQuery = require("jquery");

export default class ManageConceptGraphUpdateIPNSs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
        var pCGb = window.ipfs.pCGb;
        var pCGw = pCGb + viewingConceptGraph_ipns + "/words/";

        // var pCGw = window.ipfs.pCGw;
        var aWords = [];
        var aSchemas = [];
        var aConcepts = [];
        var newIpnsLookup = {};
        for await (const file of MiscIpfsFunctions.ipfs.files.ls(pCGw)) {
            if (file.type=="directory") {
                var slug = file.name;
                console.log("slug: "+slug)
                // if (slug != "mainSchemaForConceptGraph") {
                    aWords.push(slug);
                    jQuery("#numWordsContainer").html(aWords.length)
                    // console.log("ManageConceptGraphUpdateIPNSs; slug: "+slug)
                    var oWord = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,slug);
                    if (!oWord) {
                        console.log("!oWord!: "+slug)
                    }
                    newIpnsLookup[slug] = oWord.metaData.ipns;
                    if (oWord.hasOwnProperty("schemaData")) {
                        console.log("oWord hasOwnProperty schemaData - slug:" + slug)
                        aSchemas.push(slug)
                        jQuery("#numSchemasContainer").html(aSchemas.length)
                    } else {
                        console.log("oWord does NOT hasOwnProperty schemaData - slug:" + slug)
                    }
                    if (oWord.hasOwnProperty("conceptData")) {
                        aConcepts.push(slug)
                        jQuery("#numConceptsContainer").html(aConcepts.length)
                    }
                    // var pathToNode = pCGw + file.name + "/node.txt";
                    // const nextNodeCid = await ipfs.resolve(pathToNode);
                // }
            }
        }
        jQuery("#numWordsContainer").html(aWords.length)
        jQuery("#numSchemasContainer").html(aSchemas.length)
        jQuery("#numConceptsContainer").html(aConcepts.length)
        var aWords2not1 = [];
        var numDuplicatedWords = 0;
        jQuery("#runBasicCheckButton").click( async function(){
            var aWords2 = []; // all the words in each schemaData
            var aIPNS2 = []; // all the IPNS hashes in each schemaData
            var numSchemasUpdated = 0;
            var numConceptsUpdated = 0;
            for (var s=0;s<aSchemas.length;s++) {
                var slug = aSchemas[s];
                console.log("oSchema slug: "+slug)
                var oSchema = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,slug);
                var sSchemaOld = JSON.stringify(oSchema)
                /*
                if (s==0) {
                    console.log("oSchema old: "+JSON.stringify(oSchema,null,4))
                }
                */

                var aNodes = oSchema.schemaData.nodes;
                jQuery("#wordsIn2Not1Container").html("")

                for (var n=0;n<aNodes.length;n++) {
                    var oNodeData = aNodes[n];
                    var nSlug = oNodeData.slug;
                    if (!aWords.includes(nSlug)) {
                        aWords2not1.push(nSlug)
                        var nHTML = "";
                        nHTML += "<div>=";
                        nHTML += nSlug;
                        nHTML += "=</div>";
                        jQuery("#wordsIn2Not1Container").append(nHTML)
                    }
                    if (aWords2.includes(nSlug)) {
                        var nHTML = "";
                        nHTML += "<div>-";
                        nHTML += nSlug;
                        nHTML += "-</div>";
                        console.log("schemaDuplicate; nSlug: "+nSlug+"numDuplicatedWords: "+numDuplicatedWords)
                        jQuery("#schemaDuplicatesContainer").append(nHTML)
                        numDuplicatedWords ++;
                        jQuery("#numDuplicatedWordsContainer").html(numDuplicatedWords)
                    }
                    if (!aWords2.includes(nSlug)) {
                        aWords2.push(nSlug)
                        jQuery("#numWords2Container").html(aWords2.length)
                    }
                    // var oldIpns = oNodeData.ipns;
                    var newIpns = newIpnsLookup[nSlug];
                    if (!aIPNS2.includes(newIpns)) {
                        aIPNS2.push(newIpns)
                        jQuery("#numIPNS2Container").html(aIPNS2.length)
                    }
                    oSchema.schemaData.nodes[n].ipns = newIpns;
                    delete oSchema.schemaData.nodes[n].ipfs;
                }

                var oSchema = MiscFunctions.removeDuplicateNodesFromSchema(oSchema);
                var sSchemaNew = JSON.stringify(oSchema)
                /*
                if (s==0) {
                    console.log("oSchema new: "+JSON.stringify(oSchema,null,4))
                }
                */
                if (sSchemaOld != sSchemaNew) {
                    var currentTime = Date.now()
                    oSchema.metaData.lastUpdate = currentTime;
                    numSchemasUpdated++;
                    jQuery("#numSchemasUpdatedContainer").html(numSchemasUpdated)
                    console.log("updating schema: oSchema: "+JSON.stringify(oSchema,null,4))
                    await ConceptGraphInMfsFunctions.addWordToMfsConceptGraph_specifyConceptGraph(viewingConceptGraph_ipns,oSchema)
                }
                if (sSchemaOld == sSchemaNew) {
                    console.log("sSchemaOld == sSchemaNewoSchema: slug: "+slug)
                }
            }
            for (var c=0;c<aConcepts.length;c++) {
                var slug = aConcepts[c];
                var oConcept = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,slug);
                var sConceptOld = JSON.stringify(oConcept)
                /*
                if (c==0) {
                    console.log("oConcept old: "+JSON.stringify(oConcept,null,4))
                }
                */
                var wordType_slug = oConcept.conceptData.nodes.wordType.slug;
                var superset_slug = oConcept.conceptData.nodes.superset.slug;
                var schema_slug = oConcept.conceptData.nodes.schema.slug;
                var jsonSchema_slug = oConcept.conceptData.nodes.JSONSchema.slug;
                var propertySchema_slug = oConcept.conceptData.nodes.propertySchema.slug;
                var properties_slug = oConcept.conceptData.nodes.properties.slug;
                var primaryProperty_slug = oConcept.conceptData.nodes.primaryProperty.slug;
                var concept_slug = oConcept.conceptData.nodes.concept.slug;

                var newIpns_wordType = newIpnsLookup[wordType_slug];
                var newIpns_superset = newIpnsLookup[superset_slug];
                var newIpns_schema = newIpnsLookup[schema_slug];
                var newIpns_jsonSchema = newIpnsLookup[jsonSchema_slug];
                var newIpns_propertySchema = newIpnsLookup[propertySchema_slug];
                var newIpns_properties = newIpnsLookup[properties_slug];
                var newIpns_primaryProperty = newIpnsLookup[primaryProperty_slug];
                var newIpns_concept = newIpnsLookup[concept_slug];

                oConcept.conceptData.nodes.wordType.ipns = newIpns_wordType
                oConcept.conceptData.nodes.superset.ipns = newIpns_superset
                oConcept.conceptData.nodes.schema.ipns = newIpns_schema
                oConcept.conceptData.nodes.JSONSchema.ipns = newIpns_jsonSchema
                oConcept.conceptData.nodes.propertySchema.ipns = newIpns_propertySchema
                oConcept.conceptData.nodes.properties.ipns = newIpns_properties
                oConcept.conceptData.nodes.primaryProperty.ipns = newIpns_primaryProperty
                oConcept.conceptData.nodes.concept.ipns = newIpns_concept

                delete oConcept.conceptData.nodes.wordType.ipfs;
                delete oConcept.conceptData.nodes.superset.ipfs;
                delete oConcept.conceptData.nodes.schema.ipfs;
                delete oConcept.conceptData.nodes.JSONSchema.ipfs;
                delete oConcept.conceptData.nodes.propertySchema.ipfs;
                delete oConcept.conceptData.nodes.properties.ipfs;
                delete oConcept.conceptData.nodes.primaryProperty.ipfs;
                delete oConcept.conceptData.nodes.concept.ipfs;

                var sConceptNew = JSON.stringify(oConcept)
                if (sConceptOld != sConceptNew) {
                    var currentTime = Date.now()
                    oConcept.metaData.lastUpdate = currentTime;
                    numConceptsUpdated++;
                    jQuery("#numConceptsUpdatedContainer").html(numConceptsUpdated)
                    await ConceptGraphInMfsFunctions.addWordToMfsConceptGraph_specifyConceptGraph(viewingConceptGraph_ipns,oConcept)
                }
                if (c==0) {
                    console.log("oConcept new: "+JSON.stringify(oConcept,null,4))
                }
            }
            jQuery("#numWords2Container").html(aWords2.length)
            jQuery("#numIPNS2Container").html(aIPNS2.length)
            if (aWords.length == aWords2.length) {
                jQuery("#aEbContainer").html("YES")
                jQuery("#aEbContainer").css("backgroundColor","green")
            } else {
                jQuery("#aEbContainer").html("NO")
                jQuery("#aEbContainer").css("backgroundColor","red")
            }

            if (aWords2.length == aIPNS2.length) {
                jQuery("#bEcContainer").html("YES")
                jQuery("#bEcContainer").css("backgroundColor","green")
            } else {
                jQuery("#bEcContainer").html("NO")
                jQuery("#bEcContainer").css("backgroundColor","red")
            }
            jQuery("#numSchemasUpdatedContainer").html(numSchemasUpdated)
            jQuery("#numConceptsUpdatedContainer").html(numConceptsUpdated)

            for (var x=0;x<aWords2.length;x++) {
                var slug2 = aWords2[x];
                if (!aWords.includes(slug2)) {
                    console.log("FOUNDONE!: slug2: "+slug2)
                }
            }
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                    <div className="mainPanel" >
                        <Masthead viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                        <div class="h2">Active Concept Graph: Update IPNS for each Word in SchemaData and ConceptData</div>
                        <div style={{width:"1200px",marginTop:"20px",fontSize:"10px"}} >
                        After downloading a concept graph from an external source, every word will have a new IPNS which is locally controlled.
                        However, slugs are unchanged.
                        Therefore, every schema and every concept need to update their records to reflect the updated IPNS.
                        </div>

                        <div style={{width:"800px",marginTop:"20px"}} >
                            <center>Mutable File System Active Concept Graph (found in pCG0/words/)</center>
                            <div>
                                <div className="leftColStyleH" >num words (A):</div>
                                <div className="rightColStyleH" id="numWordsContainer" ></div>
                                <div style={{display:"inline-block"}} >(total number of words in MFS at path: pCGw)</div>
                            </div>

                            <div>
                                <div className="leftColStyleH" >num schemas:</div>
                                <div className="rightColStyleH" id="numSchemasContainer" ></div>
                            </div>

                            <div>
                                <div className="leftColStyleH" >num concepts:</div>
                                <div className="rightColStyleH" id="numConceptsContainer" ></div>
                            </div>

                            <div>
                                <div className="leftColStyleH" >num words2 (B):</div>
                                <div className="rightColStyleH" id="numWords2Container" ></div>
                                <div style={{display:"inline-block"}} >(total number of unique words in all schemas)</div>
                            </div>

                            <div>
                                <div className="leftColStyleH" >num IPNS2 (C):</div>
                                <div className="rightColStyleH" id="numIPNS2Container" ></div>
                                <div style={{display:"inline-block"}} >(total number of unique IPNSs in all Schemas)</div>
                            </div>

                            <div>
                                <div className="leftColStyleH" >A = B?</div>
                                <div className="rightColStyleH" id="aEbContainer" ></div>
                            </div>

                            <div>
                                <div className="leftColStyleH" >B = C?</div>
                                <div className="rightColStyleH" id="bEcContainer" ></div>
                            </div>

                            <div>
                                <div className="leftColStyleH" >number schemas updated:</div>
                                <div className="rightColStyleH" id="numSchemasUpdatedContainer" ></div>
                            </div>

                            <div>
                                <div className="leftColStyleH" >number concepts updated</div>
                                <div className="rightColStyleH" id="numConceptsUpdatedContainer" ></div>
                            </div>

                            <div>
                                <div className="leftColStyleH" >number duplicate words in schemas</div>
                                <div className="rightColStyleH" id="numDuplicatedWordsContainer" ></div>
                            </div>

                            <div>
                                <div className="leftColStyleH" >words in schema but not MFS:</div>
                                <div className="rightColStyleH" id="wordsIn2Not1Container" ></div>
                            </div>
                            <div>
                                <div className="leftColStyleH" >words in schema more than once:</div>
                                <div className="rightColStyleH" id="schemaDuplicatesContainer" ></div>
                            </div>
                        </div>

                        <div id="runBasicCheckButton" className="doSomethingButton" >run basic consistency check</div>

                    </div>
                </fieldset>
            </>
        );
    }
}
