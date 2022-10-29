import React from "react";
import Masthead from '../../../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../../../navbars/leftNavbar2/cgFe_singleConceptUpdates_leftNav2';
import * as ConceptGraphInMfsFunctions from '../../../../../../lib/ipfs/conceptGraphInMfsFunctions.js'
import * as MiscFunctions from '../../../../../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../../../../../lib/ipfs/miscIpfsFunctions.js'
import UpdateNewRawFile from './tabs/newRawFile.js'
import OverviewOfUpdates from './tabs/overviewOfUpdates.js'

const jQuery = require("jquery");

var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;

var oNodeRole = {};

var aAllSets = [];

const openChildrenContainer = (parentNode_slug) => {
    jQuery("#childrenNodesContainer_"+parentNode_slug).css("display","block")
}

const closeChildrenContainer = (parentNode_slug) => {
    jQuery("#childrenNodesContainer_"+parentNode_slug).css("display","none")
}

var aSpecificInstancesToAdd = [];
var aSetsToAdd = [];
var aNodesToAdd = [];

const processClickedNodeButton = (node_slug,type) => {
    console.log("processClickedNodeButton; type: "+type)
    var status = jQuery("#toggleChildrenOfTypesButton_"+node_slug).data("status")
    var nodeHTML = "";
    nodeHTML += "<div data-slug='"+node_slug+"' ";

    if (type=="specificInstance") {
        nodeHTML += " class='specificInstancesToAdd' >";
        nodeHTML += node_slug;
        nodeHTML += "</div>";
        jQuery("#addSpecificInstancesContainer").append(nodeHTML)
        console.log("processClickedNodeButton; node_slug A: "+node_slug)
        if (!aSpecificInstancesToAdd.includes(node_slug)) {
            console.log("processClickedNodeButton; node_slug B: "+node_slug)
            aSpecificInstancesToAdd.push(node_slug)
        }
    }
    if (type=="set") {
        nodeHTML += " class='setsToAdd' >";
        nodeHTML += node_slug;
        nodeHTML += "</div>";
        jQuery("#addSetsContainer").append(nodeHTML)
        if (!aSetsToAdd.includes(node_slug)) {
            aSetsToAdd.push(node_slug)
        }
    }
    if (!aNodesToAdd.includes(node_slug)) {
        aNodesToAdd.push(node_slug)
    }

    console.log("node_slug: "+node_slug+"; status: "+status)
}

export const generateNodeHTML = async (nextNode_slug,lookupChildTypes,isTopLevel) => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
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
            if (oNodeRole[nextNode_slug]=="specificInstance")  { nextNodeHTML += " data-type='specificInstance' style='border:0px' "; }
            if (oNodeRole[nextNode_slug]=="set")  { nextNodeHTML += " data-type='set' "; }
            nextNodeHTML += " >";
            if (oNodeRole[nextNode_slug]=="set")  { nextNodeHTML += numChildren; }
            if (oNodeRole[nextNode_slug]=="specificInstance")  { nextNodeHTML += " * "; }

            nextNodeHTML += "</div>";

            nextNodeHTML += "<div id='nodeNameContainer_"+nextNode_name+"' data-slug='"+nextNode_slug+"' class='nodeNameContainer' ";
            if (oNodeRole[nextNode_slug]=="specificInstance")  { nextNodeHTML += " data-type='specificInstance' style='color:purple;' "; }
            if (oNodeRole[nextNode_slug]=="set")  { nextNodeHTML += " data-type='set' "; }
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
        // console.log("qwerty makeNewUpdate; isSpecificInstance_nF: "+isSpecificInstance_nF+"; isSet_nT: "+isSet_nT)
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
        // console.log("lookupChildTypes: "+JSON.stringify(lookupChildTypes,null,4))
        var nextNodeHTML = await generateNodeHTML(nextNode_slug,lookupChildTypes,true)
        jQuery("#fullHierarchyContainer").append(nextNodeHTML)
    }
}

const redoUpdateRawFile = async () => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
    var sUpdate = jQuery("#newUpdateRawFileContainer1").val()
    var oUpdate = JSON.parse(sUpdate)

    oUpdate.updateData.updates.additions.nodes = [];
    // console.log("redoUpdateRawFile; aSpecificInstancesToAdd.length: "+aSpecificInstancesToAdd.length)
    for (var n=0;n<aSpecificInstancesToAdd.length;n++) {
        var nodeSlug = aSpecificInstancesToAdd[n];
        var oNxtNde = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,nodeSlug)
        var ipns = oNxtNde.metaData.ipns;
        // console.log("redoUpdateRawFile; siSlug: "+siSlug)
        var oNxtNode = {};
        oNxtNode.slug = nodeSlug;
        oNxtNode.ipns = ipns;
        oNxtNode.type = "specificInstance";
        oUpdate.updateData.updates.additions.nodes.push(oNxtNode);
    }
    for (var n=0;n<aSetsToAdd.length;n++) {
        var nodeSlug = aSetsToAdd[n];
        var oNxtNde = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,nodeSlug)
        var ipns = oNxtNde.metaData.ipns;
        // console.log("redoUpdateRawFile; siSlug: "+siSlug)
        var oNxtNode = {};
        oNxtNode.slug = nodeSlug;
        oNxtNode.ipns = ipns;
        oNxtNode.type = "set";
        oUpdate.updateData.updates.additions.nodes.push(oNxtNode);
    }

    var updateSchemaComments = jQuery("#updateCommentsContainer").val()
    oUpdate.updateData.comments = updateSchemaComments

    jQuery("#newUpdateRawFileContainer2").val(JSON.stringify(oUpdate,null,4))

}

export default class ConceptGraphsFrontEndSingleConceptMakeNewUpdate extends React.Component {
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
        var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
        var oConcept = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,conceptSlug)

        jQuery("#conceptTitleContainer").html(oConcept.conceptData.title)
        jQuery("#conceptDescriptionContainer").html(oConcept.conceptData.description)

        var propertyPath = oConcept.conceptData.propertyPath;
        jQuery("#propertyPathContainer").html(propertyPath)

        await generateConceptFullHierarchy(oConcept)

        jQuery(".nodeNameContainer").click(function(){
            console.log("nodeNameContainer clicked")
            var node_slug = jQuery(this).data("slug")
            var node_type = jQuery(this).data("type")
            processClickedNodeButton(node_slug,node_type);
        })

        jQuery("#openAllButton").click(async function(){
            jQuery(".childrenNodesContainer").css("display","block")
            jQuery(".toggleChildrenOfTypesButton").data("status","open")
        });
        jQuery("#closeAllButton").click(async function(){
            jQuery(".childrenNodesContainer").css("display","none")
            jQuery(".toggleChildrenOfTypesButton").data("status","closed")
        });
        var fooFxn = this.state.fooFunction
        jQuery("#generateNewRawFileButton").click(async function(){
            console.log("generateNewRawFileButton")
            var oUpdateSchema = await MiscFunctions.createNewWordByTemplate("schema");
            var myPeerID = await MiscIpfsFunctions.returnMyPeerID();
            var myUsername = await MiscIpfsFunctions.returnMyUsername();
            var mCG = "myConceptGraph_" + window.frontEndConceptGraph.viewingConceptGraph.slug
            oUpdateSchema.schemaData.nodesToRemove = []
            oUpdateSchema.globalDynamicData.myConceptGraphs = [mCG]
            oUpdateSchema.metaData.stewardPeerID = myPeerID;
            oUpdateSchema.metaData.stewardUsername = myUsername;
            oUpdateSchema.metaData.lastUpdate = Date.now();
            jQuery("#newUpdateRawFileContainer1").val(JSON.stringify(oUpdateSchema,null,4))
        })
        jQuery(".updateSchemaNavBarButton").click(function(){
            jQuery(".updateSchemaContentBox").css("display","none")
            var which = jQuery(this).data("which")
            jQuery("#updateSchemaContentBox_"+which).css("display","block")
        })
        jQuery("#updateCommentsContainer").change(function(){
            redoUpdateRawFile()
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
                        <div class="h4">Make New Update for Single Concept</div>

                        <div style={{verticalAlign:"middle"}}>
                            <div id="conceptTitleContainer" style={{display:"inline-block",fontSize:"28px",padding:"10px",color:"purple"}} >conceptTitleContainer</div>
                            <div id="conceptDescriptionContainer" style={{display:"inline-block",fontSize:"14px",padding:"10px",border:"1px solid green",borderRadius:"5px",verticalAlign:"top"}} >conceptDescriptionContainer</div>
                        </div>

                        <div style={{display:"inline-block",width:"600px",height:"800px",border:"1px dashed grey"}} >
                            <div id="propertyPathContainer" style={{display:"none"}} >propertyPathContainer</div>
                            <center>Main Schema</center>

                            <div id="openAllButton" className="doSomethingButton_small" >open all</div>
                            <div id="closeAllButton" className="doSomethingButton_small" >close all</div>
                            <div id="fullHierarchyContainer" style={{overflow:"scroll",fontSize:"10px"}} ></div>

                            <center>Additional Sets</center>

                            <center>Additional Specific Instances</center>
                        </div>

                        <div style={{display:"inline-block",width:"800px",height:"800px",border:"1px dashed grey",fontSize:"12px"}} >
                            <div class="h4">Edit Main Schema</div>
                            Comments / description of this update:
                            <textarea id="updateCommentsContainer" style={{width:"80%",height:"50px"}} ></textarea>
                            <div className="doSomethingButton" id="generateNewRawFileButton"  onclick={this.state.fooFunction} >generate new rawfile</div>

                            <div>
                                <div className="addUpdateLeftPanel">
                                    add sets:
                                </div>
                                <div id="addSetsContainer" className="addUpdateRightPanel">
                                    x
                                </div>
                            </div>

                            <div>
                                <div className="addUpdateLeftPanel">
                                    add specific instances:
                                </div>
                                <div id="addSpecificInstancesContainer" className="addUpdateRightPanel">
                                    x
                                </div>
                            </div>

                            <div>
                                <div className="updateSchemaNavBarButton" data-which="makeSubset" >Make subset</div>
                                <div className="updateSchemaNavBarButton" data-which="makeSpecificInstance" >Make specific instance</div>
                                <div className="updateSchemaNavBarButton" data-which="replaceNode" >replace node</div>
                                <div className="updateSchemaNavBarButton" data-which="deleteNode" >delete node</div>
                                <div className="updateSchemaNavBarButton" data-which="deleteRelationship" >delete rel.</div>
                                <div className="updateSchemaNavBarButton" data-which="updateRawFile" >update rawFile</div>
                                <div className="updateSchemaNavBarButton" data-which="overviewOfUpdates" >overview of updates</div>
                            </div>

                            <div className="updateSchemaContentBox" id="updateSchemaContentBox_makeSubset" style={{display:"block"}} >
                                Make subset
                            </div>

                            <div className="updateSchemaContentBox" id="updateSchemaContentBox_makeSpecificInstance" >
                                makeSpecificInstance
                            </div>

                            <div className="updateSchemaContentBox" id="updateSchemaContentBox_replaceNode" >
                                replaceNode
                            </div>

                            <div className="updateSchemaContentBox" id="updateSchemaContentBox_deleteNode" >
                                deleteNode
                                <div style={{fontSize:"10px",padding:"3px",backgroundColor:"#DFDFDF"}} >
                                To delete a node
                                </div>
                            </div>

                            <div className="updateSchemaContentBox" id="updateSchemaContentBox_deleteRelationship" >
                            deleteRelationship
                            </div>

                            <div className="updateSchemaContentBox" id="updateSchemaContentBox_updateRawFile" >
                                updateRawFile
                                <UpdateNewRawFile
                                />
                            </div>

                            <div className="updateSchemaContentBox" id="updateSchemaContentBox_overviewOfUpdates" >
                                <OverviewOfUpdates />
                            </div>

                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
