import React from "react";
import Masthead from '../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/cgFe_singleConceptGraph_manualImports_leftNav2';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../../../lib/ipfs/miscIpfsFunctions.js';
import * as ConceptGraphInMfsFunctions from '../../../../lib/ipfs/conceptGraphInMfsFunctions.js';

const jQuery = require("jquery");

const returnListOfWordsInThisConceptGraphInMFS = async (path) => {
    var aWords = [];
    try {
        for await (const file of MiscIpfsFunctions.ipfs.files.ls(path)) {
            var fileName = file.name;
            var fileType = file.type;
            var fileCid = file.cid;
            // if ( (fileType=="directory") && (fileName != "mainSchemaForConceptGraph" ) ) {
            if (fileType=="directory") {
                aWords.push(fileName);
            }
        }
    } catch (e) {}
    return aWords;
}

const makeSelector = async (viewingConceptGraph_ipns,viewingConceptGraph_slug) => {
    var oMSFCG = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,viewingConceptGraph_slug);
    var selectorHTML = "";
    selectorHTML += "<select id='resourceSelector' >";
    var aResources = [];
    if (oMSFCG.metaData.hasOwnProperty("resources")) {
        aResources = oMSFCG.metaData.resources;
    }
    if (!oMSFCG.metaData.hasOwnProperty("resources")) {
        if (oMSFCG.metaData.hasOwnProperty("prevSource")) {
            var oPrevSource = oMSFCG.metaData.prevSource;
            aResources.push(oPrevSource)
        }
    }
    for (var r=0;r<aResources.length;r++) {
        var oResource = aResources[r];
        var ipns = oResource.ipns;
        var peerID = oResource.peerID;
        var username = oResource.username;
        selectorHTML += "<option "
        selectorHTML += " data-ipns='"+ipns+"' "
        selectorHTML += " data-peerid='"+peerID+"' "
        selectorHTML += " data-username='"+username+"' "
        selectorHTML += " >"
        selectorHTML += username;
        selectorHTML += "</option>";
    }
    selectorHTML += "</select>";
    jQuery("#resourceSelectorContainer").html(selectorHTML)

    await accessConceptListFromResource();
    jQuery("#resourceSelector").change(async function(){
        await accessConceptListFromResource();
    })
}

const accessConceptListFromResource = async () => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
    var pCGb = window.ipfs.pCGb;
    var path = pCGb + viewingConceptGraph_ipns + "/words/";

    var currentWordList = await returnListOfWordsInThisConceptGraphInMFS(path);
    var resource_ipns = jQuery("#resourceSelector option:selected").data("ipns");
    var peerID = jQuery("#resourceSelector option:selected").data("peerid");
    var username = jQuery("#resourceSelector option:selected").data("username");
    jQuery("#resourceIpnsContainer").html(resource_ipns)
    jQuery("#resourceUsernameContainer").html(username)
    jQuery("#resourcePeerIDContainer").html(peerID)
    var path = "/ipns/"+resource_ipns;
    var oResourceMSFCG = await ConceptGraphInMfsFunctions.fetchObjectByCatIpfsPath(path);
    // console.log("path: "+path+"; oResourceMSFCG: "+JSON.stringify(oResourceMSFCG,null,4))
    var aConcepts = oResourceMSFCG.conceptGraphData.aConcepts;
    for (var c=0;c<aConcepts.length;c++) {
        var oConceptData = aConcepts[c];
        var slug = oConceptData.slug;
        var ipns = oConceptData.ipns;
        var conceptHTML = "";
        conceptHTML += "<div ";
        if (!currentWordList.includes(slug)) {
            conceptHTML += " style='color:red;' ";
        }
        conceptHTML += " >";
        conceptHTML += "<input class='checkBoxForConceptToDownload' type='checkbox' ";
        conceptHTML += " id='checkBoxForConceptToDownload_"+slug+"' ";
        conceptHTML += " data-conceptslug='"+slug+"' ";
        conceptHTML += " data-conceptipns='"+ipns+"' ";
        conceptHTML += " />";
        conceptHTML += slug;
        conceptHTML += "</div>";
        jQuery("#conceptListContainer").append(conceptHTML)
    }
}

export default class ConceptGraphsFrontEndSingleConceptGraphManualImportsLinkedConceptGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
        var viewingConceptGraph_slug = "mainSchemaForConceptGraph";
        var pCGb = window.ipfs.pCGb;
        var pCG0 = pCGb + viewingConceptGraph_ipns + "/";
        await makeSelector(viewingConceptGraph_ipns,viewingConceptGraph_slug);

        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        jQuery("#importConceptButton").click(async function(){
            console.log("importConceptButton")
            var aConceptsToImport = [];
            var aConceptsToImport_ipns = [];
            jQuery(".checkBoxForConceptToDownload").each(function(i,obj){
                var isThisChecked = jQuery(this).prop("checked")
                var conSlug = jQuery(this).data("conceptslug")
                var conIpns = jQuery(this).data("conceptipns")
                // console.log("conSlug: "+conSlug+"; conIpns: "+conIpns+"; isThisChecked: "+isThisChecked)
                if (isThisChecked) {
                    aConceptsToImport.push(conSlug)
                    aConceptsToImport_ipns.push(conIpns)
                }
            })
            console.log("aConceptsToImport_ipns: "+JSON.stringify(aConceptsToImport_ipns,null,4))
            for (var c=0;c<aConceptsToImport_ipns.length;c++) {
                var ipns = aConceptsToImport_ipns[c]
                var slug = aConceptsToImport[c]
                // var ipfsPath = "/ipns/"+ipns;
                var path = pCG0+"words/"+slug+"/";
                console.log("path: "+path)

                try { await MiscIpfsFunctions.ipfs.files.mkdir(path) } catch (e) {}
                var pathToFile = path + "node.txt";
                var oNode = await ConceptGraphInMfsFunctions.fetchObjectByIPNS(ipns)
                var oNodeLocal = await ConceptGraphInMfsFunctions.convertExternalNodeToLocalWord(oNode);
                var fileToWrite = JSON.stringify(oNodeLocal,null,4)
                try { await MiscIpfsFunctions.ipfs.files.rm(pathToFile, {recursive: true}) } catch (e) {}
                try { await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true}) } catch (e) {}
            }
        })

        jQuery("#importConceptWordsButton").click(async function(){
            console.log("importConceptWordsButton")
            console.log("importConceptButton")
            var aConceptsToImport = [];
            var aConceptsToImport_ipns = [];
            jQuery(".checkBoxForConceptToDownload").each(function(i,obj){
                var isThisChecked = jQuery(this).prop("checked")
                var conSlug = jQuery(this).data("conceptslug")
                var conIpns = jQuery(this).data("conceptipns")
                // console.log("conSlug: "+conSlug+"; conIpns: "+conIpns+"; isThisChecked: "+isThisChecked)
                if (isThisChecked) {
                    aConceptsToImport.push(conSlug)
                    aConceptsToImport_ipns.push(conIpns)
                }
            })
        })

        jQuery("#importSchemasButton").click(async function(){
            console.log("importSchemasButton")
            var aConceptsToImport = [];
            var aConceptsToImport_ipns = [];
            jQuery(".checkBoxForConceptToDownload").each(function(i,obj){
                var isThisChecked = jQuery(this).prop("checked")
                var conSlug = jQuery(this).data("conceptslug")
                var conIpns = jQuery(this).data("conceptipns")
                // console.log("conSlug: "+conSlug+"; conIpns: "+conIpns+"; isThisChecked: "+isThisChecked)
                if (isThisChecked) {
                    aConceptsToImport.push(conSlug)
                    aConceptsToImport_ipns.push(conIpns)
                }
            })
            for (var c=0;c<aConceptsToImport.length;c++) {
                var concept_slug = aConceptsToImport[c]
                var ipns = aConceptsToImport_ipns[c]
                var oConcept = await ConceptGraphInMfsFunctions.fetchObjectByIPNS(ipns)
                // var oConcept = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,concept_slug)
                var oMainSchemaData = oConcept.conceptData.nodes.schema;
                var oPropertySchemaData = oConcept.conceptData.nodes.propertySchema;
                console.log("oMainSchemaData: "+JSON.stringify(oMainSchemaData,null,4))
                console.log("oPropertySchemaData: "+JSON.stringify(oPropertySchemaData,null,4))

                var mainSchema_slug = oMainSchemaData.slug;
                var ipns = oMainSchemaData.ipns;
                var path = pCG0+"words/"+mainSchema_slug+"/";
                try { await MiscIpfsFunctions.ipfs.files.mkdir(path) } catch (e) {}
                var pathToFile = path + "node.txt";
                var oNode = await ConceptGraphInMfsFunctions.fetchObjectByIPNS(ipns)
                var oNodeLocal = await ConceptGraphInMfsFunctions.convertExternalNodeToLocalWord(oNode);
                var fileToWrite = JSON.stringify(oNodeLocal,null,4)
                try { await MiscIpfsFunctions.ipfs.files.rm(pathToFile, {recursive: true}) } catch (e) {}
                try { await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true}) } catch (e) {}

                var propertySchema_slug = oPropertySchemaData.slug;
                var ipns = oPropertySchemaData.ipns;
                var path = pCG0+"words/"+propertySchema_slug+"/";
                console.log("importSchemasOfCheckedConceptsButton propertySchema_slug: "+propertySchema_slug+"; path: "+path+"; ipns: "+ipns)
                try { await MiscIpfsFunctions.ipfs.files.mkdir(path) } catch (e) {}
                var pathToFile = path + "node.txt";
                var oNode = await ConceptGraphInMfsFunctions.fetchObjectByIPNS(ipns)
                var oNodeLocal = await ConceptGraphInMfsFunctions.convertExternalNodeToLocalWord(oNode);
                var fileToWrite = JSON.stringify(oNodeLocal,null,4)
                try { await MiscIpfsFunctions.ipfs.files.rm(pathToFile, {recursive: true}) } catch (e) {}
                try { await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true}) } catch (e) {}
            }
        })

        jQuery("#importSchemasWordsButton").click(async function(){
            console.log("importSchemasWordsButton")
            var aConceptsToImport = [];
            var aConceptsToImport_ipns = [];
            jQuery(".checkBoxForConceptToDownload").each(function(i,obj){
                var isThisChecked = jQuery(this).prop("checked")
                var conSlug = jQuery(this).data("conceptslug")
                var conIpns = jQuery(this).data("conceptipns")
                // console.log("conSlug: "+conSlug+"; conIpns: "+conIpns+"; isThisChecked: "+isThisChecked)
                if (isThisChecked) {
                    aConceptsToImport.push(conSlug)
                    aConceptsToImport_ipns.push(conIpns)
                }
            })
            for (var c=0;c<aConceptsToImport.length;c++) {
                var concept_slug = aConceptsToImport[c]
                var ipns = aConceptsToImport_ipns[c]
                var oConcept = await ConceptGraphInMfsFunctions.fetchObjectByIPNS(ipns)
                // var oConcept = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,concept_slug)
                var oMainSchemaData = oConcept.conceptData.nodes.schema;
                var oPropertySchemaData = oConcept.conceptData.nodes.propertySchema;
                console.log("oMainSchemaData: "+JSON.stringify(oMainSchemaData,null,4))
                console.log("oPropertySchemaData: "+JSON.stringify(oPropertySchemaData,null,4))

                var mainSchema_slug = oMainSchemaData.slug;
                var ipns = oMainSchemaData.ipns;
                var path = pCG0+"words/"+mainSchema_slug+"/";
                try { await MiscIpfsFunctions.ipfs.files.mkdir(path) } catch (e) {}
                var pathToFile = path + "node.txt";
                var oMainSchema = await ConceptGraphInMfsFunctions.fetchObjectByIPNS(ipns)

                var aNodes = oMainSchema.schemaData.nodes;
                for (var n=0;n<aNodes.length;n++) {
                    var oNextNodeInfo = aNodes[n];
                    var ipns = oNextNodeInfo.ipns;
                    var slug = oNextNodeInfo.slug;
                    console.log("nextNode_slug: "+slug+"; nextNode_ipns: "+ipns)
                    var path = pCG0+"words/"+slug+"/";
                    try { await MiscIpfsFunctions.ipfs.files.mkdir(path) } catch (e) {}
                    var pathToFile = path + "node.txt";
                    var oNode = await ConceptGraphInMfsFunctions.fetchObjectByIPNS(ipns)
                    var oNodeLocal = await ConceptGraphInMfsFunctions.convertExternalNodeToLocalWord(oNode);
                    var fileToWrite = JSON.stringify(oNodeLocal,null,4)
                    try { await MiscIpfsFunctions.ipfs.files.rm(pathToFile, {recursive: true}) } catch (e) {}
                    try { await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true}) } catch (e) {}
                }

                var propertySchema_slug = oPropertySchemaData.slug;
                var ipns = oPropertySchemaData.ipns;
                var path = pCG0+"words/"+propertySchema_slug+"/";
                console.log("importSchemasOfCheckedConceptsButton propertySchema_slug: "+propertySchema_slug+"; path: "+path+"; ipns: "+ipns)
                try { await MiscIpfsFunctions.ipfs.files.mkdir(path) } catch (e) {}
                var pathToFile = path + "node.txt";
                var oPropertySchema = await ConceptGraphInMfsFunctions.fetchObjectByIPNS(ipns)

                var aNodes = oPropertySchema.schemaData.nodes;
                for (var n=0;n<aNodes.length;n++) {
                    var oNextNodeInfo = aNodes[n];
                    var ipns = oNextNodeInfo.ipns;
                    var slug = oNextNodeInfo.slug;
                    console.log("nextNode_slug: "+slug+"; nextNode_ipns: "+ipns)
                    var path = pCG0+"words/"+slug+"/";
                    try { await MiscIpfsFunctions.ipfs.files.mkdir(path) } catch (e) {}
                    var pathToFile = path + "node.txt";
                    var oNode = await ConceptGraphInMfsFunctions.fetchObjectByIPNS(ipns)
                    var oNodeLocal = await ConceptGraphInMfsFunctions.convertExternalNodeToLocalWord(oNode);
                    var fileToWrite = JSON.stringify(oNodeLocal,null,4)
                    try { await MiscIpfsFunctions.ipfs.files.rm(pathToFile, {recursive: true}) } catch (e) {}
                    try { await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true}) } catch (e) {}
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
                        <div class="h2">Manual import into this Concept Graph from Linked External Concept Graph</div>

                        <div style={{border:"1px solid green",display:"inline-block",fontSize:"12px",width:"600px",height:"850px",overflow:"scroll"}} >
                            <center>select resource (from options in metaData)</center>
                            <div id="resourceSelectorContainer" >resourceSelectorContainer</div>

                            <div style={{fontSize:"12px",marginTop:"10px"}} >
                                <div>
                                    <div style={{display:"inline-block",textAlign:"right",width:"100px"}} >IPNS: </div>
                                    <div id="resourceIpnsContainer" style={{display:"inline-block",marginLeft:"10px"}} >resourceIpnsContainer</div>
                                </div>
                                <div>
                                    <div style={{display:"inline-block",textAlign:"right",width:"100px"}} >username: </div>
                                    <div id="resourceUsernameContainer" style={{display:"inline-block",marginLeft:"10px"}} >resourceUsernameContainer</div>
                                </div>
                                <div>
                                    <div style={{display:"inline-block",textAlign:"right",width:"100px"}} >peerID: </div>
                                    <div id="resourcePeerIDContainer" style={{display:"inline-block",marginLeft:"10px"}} >resourcePeerIDContainer</div>
                                </div>
                            </div>

                            <div id="conceptListContainer" style={{marginTop:"10px"}} >conceptListContainer</div>
                        </div>

                        <div style={{border:"1px solid green",display:"inline-block",width:"600px",height:"850px"}} >
                            <center>import from external source to local MFS and IPFS (this will overwrite!)</center>
                            <div id="importConceptButton" className="doSomethingButton" >concept (single word only)</div>
                            <div id="importConceptWordsButton" className="doSomethingButton" >all 8 concept words (incomplete)</div>
                            <div id="importSchemasButton" className="doSomethingButton" >2 schemas</div>
                            <div id="importSchemasWordsButton" className="doSomethingButton" >all schemas words</div>
                            <div style={{fontSize:"12px",padding:"10px"}} >
                            2 Nov 2022: Make sure at least one other IPFS node is running. These buttons access the external concept using the external ipns address, use that oConcept to access
                            external ipns for concept nodes including both schemas, then use those schemas to access external ipns for each word in those schemas.
                            Then each externally-derived node is converted to a locally-controlled node and saved to the local currently-viewing concept graph and to the ipfs.
                            Words with identical slug names will be overwritten!
                            <br/>
                            ** After import, it will be necessary to run Update IPNS (currently under Download Concept Graph from External MFS, link at top right) which will replace all
                            external ipns addresses in all concept and schema nodes with locally-controlled ipns addresses.
                            </div>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
