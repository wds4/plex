import React from "react";
import Masthead from '../../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/cgFe_concepts_singleConcept_leftNav2';
import * as MiscIpfsFunctions from '../../../../../lib/ipfs/miscIpfsFunctions.js'
import * as ConceptGraphInMfsFunctions from '../../../../../lib/ipfs/conceptGraphInMfsFunctions.js'
import * as ConceptGraphLib from '../../../../../lib/ipfs/conceptGraphLib.js'
import * as GrapevineLib from '../../../../../lib/ipfs/grapevineLib.js'
const cg = ConceptGraphLib.cg;
const gv = GrapevineLib.gv;

const jQuery = require("jquery");

const openChildrenContainer = (parentNode_slug) => {
    jQuery("#childrenNodesContainer_"+parentNode_slug).css("display","block")
}

const closeChildrenContainer = (parentNode_slug) => {
    jQuery("#childrenNodesContainer_"+parentNode_slug).css("display","none")
}

const processClickedToggleButton = (node_slug) => {
    var status = jQuery("#toggleChildrenOfTypesButton_"+node_slug).data("status")
    console.log("node_slug: "+node_slug+"; status: "+status)
    if (status=="closed") {
        jQuery("#toggleChildrenOfTypesButton_"+node_slug).data("status","open")
        openChildrenContainer(node_slug)
    }
    if (status=="open") {
        jQuery("#toggleChildrenOfTypesButton_"+node_slug).data("status","closed")
        closeChildrenContainer(node_slug)
    }
}

const loadConceptData = async (cid) => {
    // console.log("loadConceptData; cid: "+ typeof cid)
    for await (const chunk2 of MiscIpfsFunctions.ipfs.cat(cid)) {
        var chunk3 = new TextDecoder("utf-8").decode(chunk2);
        try {
            var oConcept = JSON.parse(chunk3);
            if (typeof oConcept == "object") {
                var concept_wordSlug = oConcept.wordData.slug;
                var concept_conceptTitle = oConcept.conceptData.title;
                jQuery("#conceptTitleContainer").html(concept_conceptTitle)
            } else {
            }
        } catch (e) {
            console.log("error: "+e)
        }
    }
}

export const generateNodeHTML = async (nextNode_slug,lookupChildTypes,isTopLevel) => {
    // var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
    var viewingConceptGraph_ipns = await cg.conceptGraph.resolve("currently-viewing")
    // console.log("viewingConceptGraph_ipns: "+viewingConceptGraph_ipns)
    var propertyPath = jQuery("#propertyPathContainer").html()

    var aChildren = lookupChildTypes[nextNode_slug]
    var numChildren = aChildren.length;
    // console.log("numChildren: "+numChildren)

    var oNextNode = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,nextNode_slug);
    if (oNextNode.hasOwnProperty(propertyPath)) {
        var nextNode_name = oNextNode[propertyPath].name;
    }
    if (!oNextNode.hasOwnProperty(propertyPath)) {
        if (oNextNode.hasOwnProperty("setData")) {
            var nextNode_name = oNextNode.setData.name;
        }
        if (oNextNode.hasOwnProperty("supersetData")) {
            var nextNode_name = oNextNode.supersetData.name;
        }
    }
    var nextNodeHTML = "";
    nextNodeHTML += "<div style='padding:2px;";
    nextNodeHTML += "' > ";
        nextNodeHTML += "<div>";
            nextNodeHTML += "<div id='toggleChildrenOfTypesButton_"+nextNode_slug+"' data-slug='"+nextNode_slug+"' data-status='closed' class='toggleChildrenOfTypesButton' ";
            if (oNodeRole[nextNode_slug]=="specificInstance")  { nextNodeHTML += " style='border:0px' "; }
            nextNodeHTML += " >";
            if (oNodeRole[nextNode_slug]=="set")  { nextNodeHTML += numChildren; }
            if (oNodeRole[nextNode_slug]=="specificInstance")  { nextNodeHTML += " * "; }

            nextNodeHTML += "</div>";

            nextNodeHTML += "<div id='nodeNameContainer_"+nextNode_name+"' data-slug='"+nextNode_slug+"' class='nodeNameContainer' ";
            if (oNodeRole[nextNode_slug]=="specificInstance")  { nextNodeHTML += " style='color:purple;' "; }
            nextNodeHTML += " >";
            nextNodeHTML += nextNode_name
            nextNodeHTML += "</div>";
        nextNodeHTML += "</div>";
        nextNodeHTML += "<div id='childrenNodesContainer_"+nextNode_slug+"' data-parentslug='"+nextNode_slug+"' class='childrenNodesContainer' style='display:none;' >";
        // nextNodeHTML += "<div id='childrenNodesContainer_"+nextNode_slug+"' data-parentslug='"+nextNode_slug+"' class='childrenNodesContainer' >";
        for (var c=0;c<aChildren.length;c++) {
            var nextChildNode_slug = aChildren[c];
            // nextNodeHTML += nextChildNode_slug + "<br>";
            nextNodeHTML += await generateNodeHTML(nextChildNode_slug,lookupChildTypes,false)
        }
        // nextNodeHTML += "childrenNodesContainer";
        nextNodeHTML += "</div>";
    nextNodeHTML += "</div>";

    return nextNodeHTML;
}

var oNodeRole = {};

var aAllSets = [];

export const generateConceptFullHierarchy = async (oConcept) => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
    var propertyPath = jQuery("#propertyPathContainer").html()
    jQuery("#fullHierarchyContainer").html("")

    var mainSchema_slug = oConcept.conceptData.nodes.schema.slug;
    var oMainSchema = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,mainSchema_slug)
    // console.log("mainSchema_slug: "+mainSchema_slug+"; oMainSchema: "+JSON.stringify(oMainSchema,null,4))
    var aNodes = oMainSchema.schemaData.nodes;
    var aRels = oMainSchema.schemaData.relationships;
    // console.log("generateConceptFullHierarchy; aRels: "+JSON.stringify(aRels,null,4))
    var lookupChildTypes = {};
    var lookupParentTypes = {};
    for (var n=0;n<aNodes.length;n++) {
        var nextNode_slug = aNodes[n].slug;
        if (!lookupChildTypes.hasOwnProperty(nextNode_slug)) {
            lookupChildTypes[nextNode_slug] = [];
        }
        if (!lookupParentTypes.hasOwnProperty(nextNode_slug)) {
            lookupParentTypes[nextNode_slug] = [];
        }
    }
    for (var r=0;r<aRels.length;r++) {
        var oNextRel = aRels[r];
        var relType = oNextRel.relationshipType.slug;
        // console.log("r: "+r+"; relType: "+relType)
        var nF_slug = oNextRel.nodeFrom.slug;
        var nT_slug = oNextRel.nodeTo.slug;
        var oNF = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,nF_slug)
        var oNT = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,nT_slug)

        var isSpecificInstance_nF = false;
        if ( oNF.hasOwnProperty(propertyPath) ) {
            isSpecificInstance_nF = true;
        }

        var isSet_nF = false;
        if ( oNF.hasOwnProperty("setData") || oNF.hasOwnProperty("supersetData") ) {
            isSet_nF = true;
        }
        var isSet_nT = false;
        if ( (oNT.hasOwnProperty("setData")) || (oNT.hasOwnProperty("supersetData")) ) {
            isSet_nT = true;
        }
        if ((isSet_nF) && (isSet_nT)) {
            if (relType="subsetOf") {
                oNodeRole[nF_slug] = "set"
                oNodeRole[nT_slug] = "set"
                if (!aAllSets.includes(nF_slug)) {
                    aAllSets.push(nF_slug)
                }
                if (!aAllSets.includes(nT_slug)) {
                    aAllSets.push(nT_slug)
                }
                var childNode_slug = oNextRel.nodeFrom.slug;
                var parentNode_slug = oNextRel.nodeTo.slug;
                if (!lookupChildTypes[parentNode_slug].includes(childNode_slug)) {
                    lookupChildTypes[parentNode_slug].push(childNode_slug)
                }
                if (!lookupParentTypes[childNode_slug].includes(parentNode_slug)) {
                    lookupParentTypes[childNode_slug].push(parentNode_slug)
                }
            }
        }
        // console.log("qwerty singleConceptMainPage; isSpecificInstance_nF: "+isSpecificInstance_nF+"; isSet_nT: "+isSet_nT)
        if ((isSpecificInstance_nF) && (isSet_nT)) {
            if (relType="isASpecificInstanceOf") {
                // console.log("r: "+r+"; isASpecificInstanceOf a")
                oNodeRole[nF_slug] = "specificInstance"
                oNodeRole[nT_slug] = "set"
                if (!aAllSets.includes(nT_slug)) {
                    aAllSets.push(nT_slug)
                }
                var childNode_slug = oNextRel.nodeFrom.slug;
                var parentNode_slug = oNextRel.nodeTo.slug;
                if (!lookupChildTypes[parentNode_slug].includes(childNode_slug)) {
                    lookupChildTypes[parentNode_slug].push(childNode_slug)
                    // console.log("r: "+r+"; isASpecificInstanceOf b")
                }
                if (!lookupParentTypes[childNode_slug].includes(parentNode_slug)) {
                    lookupParentTypes[childNode_slug].push(parentNode_slug)
                    // console.log("r: "+r+"; isASpecificInstanceOf c")
                }
            }
        }
    }
    // a topLevelType is a node that has no parents
    var aTopLevelTypes = [];
    for (var n=0;n<aNodes.length;n++) {
        var nextNode_slug = aNodes[n].slug;
        var oNxtNde = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,nextNode_slug)
        var isMainPropertiesSet_nxtNode = false;
        var isSet_nxtNde = false;
        if ( oNxtNde.hasOwnProperty("setData") || oNxtNde.hasOwnProperty("supersetData") ) {
            isSet_nxtNde = true;
            if (oNxtNde.hasOwnProperty("setData")) {
                if (oNxtNde.setData.metaData.types.includes("mainPropertiesSet")) {
                    isMainPropertiesSet_nxtNode = true;
                }
            }
        }
        var numParentNodes =lookupParentTypes[nextNode_slug]
        if ((isSet_nxtNde) && (numParentNodes==0) && (!isMainPropertiesSet_nxtNode)) {
            aTopLevelTypes.push(nextNode_slug);
        }
    }
    // console.log("aTopLevelTypes: "+JSON.stringify(aTopLevelTypes,null,4))
    for (var n=0;n<aTopLevelTypes.length;n++) {
        var nextNode_slug = aTopLevelTypes[n];
        console.log("lookupChildTypes: "+JSON.stringify(lookupChildTypes,null,4))
        var nextNodeHTML = await generateNodeHTML(nextNode_slug,lookupChildTypes,true)
        jQuery("#fullHierarchyContainer").append(nextNodeHTML)
    }
}

const addSpecialWord = (oSpecialWord,specialWordType) => {
    var title = oSpecialWord.wordData.title;
    var slug = oSpecialWord.wordData.slug;
    var swHTML = "";
    swHTML += "<div class='singleItemContainer' >";
        swHTML += "<div class='leftColumnLeftPanel' >";
            swHTML += specialWordType;
        swHTML += "</div>";
        swHTML += "<div id='JSONSchemaSlugContainer' class='leftColumnRightPanel specialWordContainer' ";
        swHTML += " data-slug='"+slug+"' ";
        swHTML += " >";
            swHTML += title;
        swHTML += "</div>";
    swHTML += "</div>";
    jQuery("#specialWordsContainer").append(swHTML)
}

const generateConceptSpecialWordsList = async (oConcept) => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;

    jQuery("#specialWordsContainer").html("")

    var mainSchema_slug = oConcept.conceptData.nodes.schema.slug;
    var oMainSchema = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,mainSchema_slug)

    var superset_slug = oConcept.conceptData.nodes.superset.slug;
    var oSuperset = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,superset_slug)

    var jsonSchema_slug = oConcept.conceptData.nodes.JSONSchema.slug;
    var oJsonSchema = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,jsonSchema_slug)

    var propertySchema_slug = oConcept.conceptData.nodes.propertySchema.slug;
    var oPropertySchema = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,propertySchema_slug)

    var primaryProperty_slug = oConcept.conceptData.nodes.primaryProperty.slug;
    var oPrimaryProperty = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,primaryProperty_slug)

    var concept_slug = oConcept.conceptData.nodes.concept.slug;
    var oConcept = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,concept_slug)

    var properties_slug = oConcept.conceptData.nodes.properties.slug;
    var oProperties = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,properties_slug)

    var wordType_slug = oConcept.conceptData.nodes.wordType.slug;
    var oWordType = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,wordType_slug)

    addSpecialWord(oConcept,"concept")
    addSpecialWord(oWordType,"wordType")
    addSpecialWord(oJsonSchema,"JSONSchema")
    addSpecialWord(oSuperset,"superset")
    addSpecialWord(oMainSchema,"schema")
    addSpecialWord(oPropertySchema,"propertySchema")
    addSpecialWord(oPrimaryProperty,"primaryProperty")
    addSpecialWord(oProperties,"properties")
}

// cycle through every word in MFS; if word is of that concept's type (hasOwnProperty: [concept]Data), then delete it
//
const removeAllSpecificInstancesFromLocalMFS = async (concept_wordSlug) => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;

    var oConcept = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,concept_wordSlug)
    var propertyPath = oConcept.conceptData.propertyPath;
    console.log("removeAllSpecificInstancesFromLocalMFS; propertyPath: "+propertyPath)
    var path = window.ipfs.neuroCore.subject.pCGw
    for await (const file of MiscIpfsFunctions.ipfs.files.ls(path)) {
        var fileName = file.name;
        var fileType = file.type;
        var fileCid = file.cid;
        if (fileType=="directory") {
            var nextWord_path = path + fileName + "/node.txt";
            var oNextWord = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(nextWord_path)
            var nextWord_slug = oNextWord.wordData.slug;
            if (oNextWord.hasOwnProperty(propertyPath)) {
                console.log("removeAllSpecificInstancesFromLocalMFS time to delete: nextWord_slug: "+nextWord_slug)
                var path1 = window.ipfs.pCGw + nextWord_slug + "/";
                var path2 = window.ipfs.pCGw + nextWord_slug + "/node.txt";
                try { await MiscIpfsFunctions.ipfs.files.rm(path2, {recursive: true}) } catch (e) {}
                try { await MiscIpfsFunctions.ipfs.files.rm(path1, {recursive: true}) } catch (e) {}
            }
        }
    }
}

const removeAllSpecificInstancesFromAllSets = async (concept_wordSlug) => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
    for (var r=0;r<aAllSets.length;r++) {
        var nextSet_slug = aAllSets[r];
        console.log("removeAllSpecificInstancesFromAllSets; nextSet_slug: "+nextSet_slug)
        var oNextSet = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,nextSet_slug)
        oNextSet.globalDynamicData.specificInstances = [];
        oNextSet.globalDynamicData.directSpecificInstances = [];
        await ConceptGraphInMfsFunctions.createOrUpdateWordInMFS_specifyConceptGraph(viewingConceptGraph_ipns,oNextSet);
    }
}
const removeAllSpecificInstancesFromMainSchema = async (concept_wordSlug) => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
    var oConcept = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,concept_wordSlug)
    var mainSchema_slug = oConcept.conceptData.nodes.schema.slug;
    var oMainSchema = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,mainSchema_slug)
    // console.log("removeAllSpecificInstancesFromMainSchema; oMainSchema start: "+JSON.stringify(oMainSchema,null,4))
    var aRels = oMainSchema.schemaData.relationships;
    var aNodes = oMainSchema.schemaData.nodes;
    var aRelsUpdated = [];
    var aSpecificInstances = [];
    for (var r=0;r<aRels.length;r++) {
        var oNextRel = aRels[r];
        var rT_slug = oNextRel.relationshipType.slug;
        var deleteRel = false;
        if (rT_slug=="isASpecificInstanceOf") {
            deleteRel = true;
            var nF_slug = oNextRel.nodeFrom.slug;
            aSpecificInstances.push(nF_slug)
        }
        if (!deleteRel) {
            aRelsUpdated.push(oNextRel)
        }
    }
    var aNodesUpdated = [];
    for (var r=0;r<aNodes.length;r++) {
        var oNxtNde = aNodes[r];
        var nn_slug = oNxtNde.slug;
        var deleteNode = false;
        if (aSpecificInstances.includes(nn_slug)) {
            deleteNode = true;
        }
        if (!deleteNode) {
            aNodesUpdated.push(oNxtNde)
        }
    }
    oMainSchema.schemaData.nodes = aNodesUpdated;
    oMainSchema.schemaData.relationships = aRelsUpdated;
    // console.log("removeAllSpecificInstancesFromMainSchema; oMainSchema finish: "+JSON.stringify(oMainSchema,null,4))
    await ConceptGraphInMfsFunctions.createOrUpdateWordInMFS_specifyConceptGraph(viewingConceptGraph_ipns,oMainSchema);
}

export default class ConceptGraphsFrontEnd_SingleConceptMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var conceptSlug = this.props.match.params.conceptslug;
        if (conceptSlug=="current") {
            conceptSlug = window.frontEndConceptGraph.viewingConcept.slug
        }
        window.frontEndConceptGraph.viewingConcept.slug = conceptSlug;
        var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;

        var oConcept = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,conceptSlug)
        var concept_conceptTitle = oConcept.conceptData.title;
        var concept_conceptName = oConcept.conceptData.name;
        var concept_ipns = oConcept.metaData.ipns;
        window.frontEndConceptGraph.viewingConcept.title = concept_conceptTitle;
        window.frontEndConceptGraph.viewingConcept.name = concept_conceptName;
        window.frontEndConceptGraph.viewingConcept.ipns = concept_ipns;

        var propertyPath = oConcept.conceptData.propertyPath;
        jQuery("#propertyPathContainer").html(propertyPath)
        // console.log("conceptSlug: "+conceptSlug+"; oConcept: "+JSON.stringify(oConcept,null,4))
        jQuery("#conceptTitleContainer").html(oConcept.wordData.title)

        await generateConceptSpecialWordsList(oConcept)

        await generateConceptFullHierarchy(oConcept)

        jQuery(".toggleChildrenOfTypesButton").click(function(){
            var node_slug = jQuery(this).data("slug")
            processClickedToggleButton(node_slug);
        })
        jQuery(".specialWordContainer").click(async function(){
            jQuery("#wordRawFileContainer").val();
            var slug = jQuery(this).data("slug");
            console.log("show in wordRawFileContainer slug: "+slug)
            var oWord = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,slug)
            jQuery("#wordRawFileContainer").val(JSON.stringify(oWord,null,4));
        });
        jQuery(".nodeNameContainer").click(async function(){
            jQuery("#wordRawFileContainer").val();
            var slug = jQuery(this).data("slug");
            console.log("show in wordRawFileContainer slug: "+slug)
            var oWord = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,slug)
            jQuery("#wordRawFileContainer").val(JSON.stringify(oWord,null,4));
        });

        jQuery("#openAllButton").click(async function(){
            jQuery(".childrenNodesContainer").css("display","block")
            jQuery(".toggleChildrenOfTypesButton").data("status","open")
        });
        jQuery("#closeAllButton").click(async function(){
            jQuery(".childrenNodesContainer").css("display","none")
            jQuery(".toggleChildrenOfTypesButton").data("status","closed")
        });
        jQuery("#updateThisWordButton").click(async function(){
            var sWord = jQuery("#wordRawFileContainer").val();
            console.log("updateThisWordButton; sWord: "+sWord)
            var oWord = JSON.parse(sWord)
            await ConceptGraphInMfsFunctions.addWordToMfsConceptGraph_specifyConceptGraph(viewingConceptGraph_ipns,oWord)
        });
        jQuery("#showPrevSourceVersionButton").click(async function(){
            var sWord = jQuery("#wordRawFileContainer").val();
            console.log("showPrevSourceVersionButton; sWord: "+sWord)
            var oWord = JSON.parse(sWord)
            var oPrevSourceVersion = await ConceptGraphInMfsFunctions.returnPrevSourceVersionOfWordUsingIPNS(oWord)
            jQuery("#wordRawFileContainer").val(JSON.stringify(oPrevSourceVersion,null,4));
        });
        jQuery("#deleteAllSpecificInstancesButton").click(async function(){
            console.log("deleteAllSpecificInstancesButton")
            // remove all specific instances from the MFS directory
            await removeAllSpecificInstancesFromLocalMFS(conceptSlug);
            // remove all specific instances from the main schema
            await removeAllSpecificInstancesFromMainSchema(conceptSlug);
            // remove all specific instances from superset and from all sets
            await removeAllSpecificInstancesFromAllSets(conceptSlug);
        });
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                    <div className="mainPanel" >
                        <Masthead viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                        <div class="h2">
                            <div id="conceptTitleContainer" style={{display:"inline-block",marginRight:"20px"}}>conceptTitleContainer</div>
                        </div>

                        <div style={{marginTop:"20px"}}>
                            <div id="propertyPathContainer" style={{display:"none"}} >propertyPathContainer</div>

                            <div style={{display:"inline-block",width:"600px",height:"800px",border:"1px dashed grey"}} >
                                <div id="deleteAllSpecificInstancesButton" className="doSomethingButton_small" style={{borderColor:"red"}} >WIPE CLEAN ALL SPECIFIC INSTANCES</div>
                                <div style={{display:"inline-block",marginLeft:"5px",fontSize:"10px"}} >from active concept graph in MFS, from main schema, & from all sets</div>

                                <center>concept structural components</center>
                                <div id="specialWordsContainer" style={{marginBottom:"20px",fontSize:"12px"}} ></div>

                                <center>Sets and Specific Instances of this concept</center>

                                <div id="openAllButton" className="doSomethingButton_small" >open all</div>
                                <div id="closeAllButton" className="doSomethingButton_small" >close all</div>
                                <div id="fullHierarchyContainer" style={{overflow:"scroll",fontSize:"10px"}} ></div>
                            </div>
                            <div style={{display:"inline-block",width:"600px",height:"800px",border:"1px dashed grey"}} >
                                <textarea id="wordRawFileContainer" style={{display:"inline-block",width:"100%",height:"750px"}} >wordRawFileContainer</textarea>
                                <div id="updateThisWordButton" className="doSomethingButton_small" >UPDATE</div>
                                <div id="showPrevSourceVersionButton" className="doSomethingButton_small" >show prevSource version</div>
                            </div>
                        </div>


                    </div>
                </fieldset>
            </>
        );
    }
}
