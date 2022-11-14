import React from "react";
import Masthead from '../../../../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../../../../navbars/leftNavbar2/cgFe_singleConceptUpdates_leftNav2';
import * as ConceptGraphInMfsFunctions from '../../../../../../../lib/ipfs/conceptGraphInMfsFunctions.js'
import * as MiscFunctions from '../../../../../../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../../../../../../lib/ipfs/miscIpfsFunctions.js'

const jQuery = require("jquery");

const redoUpdateRawFile = async (aTopLevelProperties,oConcept) => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
    var sUpdate = jQuery("#newUpdateRawFileContainer1").val()
    var oUpdate = JSON.parse(sUpdate)

    var ipfs = await ConceptGraphInMfsFunctions.convertSlugToCid_specifyConceptGraph(viewingConceptGraph_ipns,window.frontEndConceptGraph.viewingConcept.slug)

    var wordSlug = "conceptUpdateProposal";
    var wordTitle = "Concept Update Proposal: " + window.frontEndConceptGraph.viewingConcept.title;
    var wordName = "concept update proposal: " + window.frontEndConceptGraph.viewingConcept.name.singular;

    oUpdate.wordData.name = wordName;
    oUpdate.wordData.title = wordTitle;

    try {
        var prevIpns = oConcept.metaData.prevSource.ipns
        oUpdate.conceptUpdateProposalData.baseConceptData.ipns.synonyms.push(prevIpns)
    } catch (e) {}

    oUpdate.conceptUpdateProposalData.baseConceptData.slug.primary = window.frontEndConceptGraph.viewingConcept.slug
    oUpdate.conceptUpdateProposalData.baseConceptData.ipns.primary = window.frontEndConceptGraph.viewingConcept.ipns
    oUpdate.conceptUpdateProposalData.baseConceptData.name.primary = window.frontEndConceptGraph.viewingConcept.name
    oUpdate.conceptUpdateProposalData.baseConceptData.title.primary = window.frontEndConceptGraph.viewingConcept.title
    oUpdate.conceptUpdateProposalData.baseConceptData.ipfs.primary = ipfs;


    var updateSchemaComments = jQuery("#updateCommentsContainer").val()

    for (var p=0;p<aTopLevelProperties.length;p++) {
        var nextProperty = aTopLevelProperties[p];
        var nextElemID = nextProperty;
        var proposedValue = jQuery("#"+nextElemID).val()

        var oNextProposal = {};
        oNextProposal.propertyKey = nextProperty;
        oNextProposal.propertyValue = proposedValue;

        if (proposedValue != "") {
            oUpdate.conceptUpdateProposalData.updates.substitutions.topLevelPropertyValueChanges.push(oNextProposal)
        }
    }
    var myPeerID = await MiscIpfsFunctions.returnMyPeerID();
    var myUsername = await MiscIpfsFunctions.returnMyUsername();
    oUpdate.updateProposalData.author.peerID = myPeerID;
    oUpdate.updateProposalData.author.username = myUsername;
    oUpdate.updateProposalData.comments = updateSchemaComments
    oUpdate.updateProposalData.submissionTime = Date.now();

    jQuery("#newUpdateRawFileContainer2").val(JSON.stringify(oUpdate,null,4))

}

const generatePropertiesFields = (aTopLevelProperties,oConcept) => {

    jQuery("#propertiesFieldsContainer").html("")
    for (var p=0;p<aTopLevelProperties.length;p++) {
        var nextProperty = aTopLevelProperties[p];
        var currentPropertyValue = oConcept.conceptData[nextProperty]
        if (!currentPropertyValue) {
            currentPropertyValue = "";
        }
        if (nextProperty=="name-singular") {
            currentPropertyValue = oConcept.conceptData.name.singular
        }
        if (nextProperty=="name-plural") {
            currentPropertyValue = oConcept.conceptData.name.plural
        }
        var nextHTML = "";
        nextHTML += "<div style='padding:10px;margin-bottom:10px;border:1px solid green' >"
            nextHTML += "<div style='padding:5px;margin-bottom:5px;' >"
            nextHTML += "<div style='display:inline-block;width:100px;text-align:right;margin-right:10px;' >"
            nextHTML += nextProperty
            nextHTML += ":</div>"
            nextHTML += "<div style='display:inline-block;width:300px;min-height:25px;padding:2px;background-color:#DFDFDF;' >"
            nextHTML += currentPropertyValue
            nextHTML += "</div>"
            nextHTML += "</div>"

            nextHTML += "<textarea id='"+nextProperty+"' style='width:90%;height:50px;' >"
            // nextHTML +=
            nextHTML += "</textarea>"
        nextHTML += "</div>"

        jQuery("#propertiesFieldsContainer").append(nextHTML)
    }

}

export default class ConceptGraphsFrontEndSingleConceptMakeNewConceptUpdate extends React.Component {
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

        var oMainSchemaForConceptGraph = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,"mainSchemaForConceptGraph")
        var aDefaultProperties = oMainSchemaForConceptGraph.conceptGraphData.properties.default;

        var oConcept = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,conceptSlug)
        var wT_slug = oConcept.conceptData.nodes.wordType.slug;
        var oWordType = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,wT_slug)

        // need to do these for conceptFor_concept, not conceptFor_ viewing concept
        var oConceptForConcept = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,"conceptFor_concept")
        console.log("oConceptForConcept: "+JSON.stringify(oConceptForConcept,null,4))
        if (oConceptForConcept.conceptData.hasOwnProperty("defaultProperties")) {
            var aAdditionalDefaultProperties = oConceptForConcept.conceptData.defaultProperties.additional;
            var aOmitDefaultProperties = oConceptForConcept.conceptData.defaultProperties.omit;
        } else {
            var aAdditionalDefaultProperties = [];
            var aOmitDefaultProperties = [];
        }

        console.log("aDefaultProperties: "+JSON.stringify(aDefaultProperties,null,4))
        console.log("aAdditionalDefaultProperties: "+JSON.stringify(aAdditionalDefaultProperties,null,4))
        console.log("aOmitDefaultProperties: "+JSON.stringify(aOmitDefaultProperties,null,4))

        var aTopLevelProperties = [];
        for (var p=0;p<aDefaultProperties.length;p++) {
            var nextProperty = aDefaultProperties[p];
            if (!aOmitDefaultProperties.includes(nextProperty)) {
                aTopLevelProperties.push(nextProperty)
            }
        }
        for (var p=0;p<aAdditionalDefaultProperties.length;p++) {
            var nextProperty = aAdditionalDefaultProperties[p];
            if ( (!aOmitDefaultProperties.includes(nextProperty)) && (!aTopLevelProperties.includes(nextProperty)) ) {
                aTopLevelProperties.push(nextProperty)
            }
        }

        aTopLevelProperties.push("name-singular")
        aTopLevelProperties.push("name-plural")
        generatePropertiesFields(aTopLevelProperties,oConcept);

        console.log("aTopLevelProperties: "+JSON.stringify(aTopLevelProperties,null,4))

        jQuery("#generateNewRawFileButton").click(async function(){
            console.log("generateNewRawFileButton")
            var oUpdateSchema = await MiscFunctions.createNewWordByTemplate("conceptUpdateProposal");
            var myPeerID = await MiscIpfsFunctions.returnMyPeerID();
            var myUsername = await MiscIpfsFunctions.returnMyUsername();
            var mCG = "myConceptGraph_" + window.frontEndConceptGraph.viewingConceptGraph.slug
            oUpdateSchema.globalDynamicData.myConceptGraphs = [mCG]
            oUpdateSchema.metaData.stewardPeerID = myPeerID;
            oUpdateSchema.metaData.stewardUsername = myUsername;
            oUpdateSchema.metaData.lastUpdate = Date.now();
            jQuery("#newUpdateRawFileContainer1").val(JSON.stringify(oUpdateSchema,null,4))
            redoUpdateRawFile(aTopLevelProperties,oConcept)
        })
        jQuery("#controlPanelContainer").change(function(){
            redoUpdateRawFile(aTopLevelProperties,oConcept)
        })
        var conceptForConceptUpdates_slug = "conceptFor_conceptUpdateProposal"
        jQuery("#saveNewUpdateProposalButton").click(async function(){
            console.log("saveNewUpdateProposalButton clicked")
            var sUpdate = jQuery("#newUpdateRawFileContainer2").val()
            var oUpdate = JSON.parse(sUpdate)
            var fooResult = await ConceptGraphInMfsFunctions.addNewWordAsSpecificInstanceToConceptInMFS_specifyConceptGraph(viewingConceptGraph_ipns,oUpdate,conceptForConceptUpdates_slug)
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
                        <div class="h2">Make New Concept Update for Single Concept</div>

                        <div style={{fontSize:"12px"}}>
                            For now, concept update proposals will be limited to changes in top-level fields (e.g. description, name, title).
                            Future: May incorporate more complex changes; or may delegate more complex changes to other update proposal types.
                        </div>

                        Update proposals from other:
                        <select>
                            <option>no updates</option>
                            <option>list all: approve manually</option>
                            <option>list from *approved users; approve manually</option>
                            <option>list from *approved users; automatic updates</option>
                        </select>

                        *Approved users:
                        Influence type:
                        context:
                        score threshold

                        <div>
                            <div id="controlPanelContainer" style={{display:"inline-block",width:"600px",height:"800px",padding:"10px",border:"1px dashed grey"}} >
                                <center>Control Panel</center>
                                Comments / description of this update:
                                <textarea id="updateCommentsContainer" style={{width:"80%",height:"50px"}} ></textarea>

                                <div id="propertiesFieldsContainer">propertiesFieldsContainer</div>
                            </div>

                            <div style={{display:"inline-block",width:"600px",height:"800px",padding:"10px",border:"1px dashed grey"}} >
                                <center>Update: new rawFile</center>
                                <div className="doSomethingButton" id="generateNewRawFileButton" >generate new rawfile</div>
                                <div className="doSomethingButton" id="saveNewUpdateProposalButton" >save new update proposal</div>
                                <textarea id="newUpdateRawFileContainer1" style={{width:"95%",height:"300px"}} >newUpdateRawFileContainer1</textarea>
                                <textarea id="newUpdateRawFileContainer2" style={{width:"95%",height:"300px"}} >newUpdateRawFileContainer2</textarea>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
