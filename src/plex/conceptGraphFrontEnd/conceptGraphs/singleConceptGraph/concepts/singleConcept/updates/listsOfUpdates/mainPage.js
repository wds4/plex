import React from "react";
import Masthead from '../../../../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../../../../navbars/leftNavbar2/cgFe_singleConceptListsOfUpdates_leftNav2';
import * as ConceptGraphInMfsFunctions from '../../../../../../../lib/ipfs/conceptGraphInMfsFunctions.js';
import * as MiscIpfsFunctions from '../../../../../../../lib/ipfs/miscIpfsFunctions.js'
import * as MiscFunctions from '../../../../../../../functions/miscFunctions.js';

const jQuery = require("jquery");

const executeConceptUpdate_topLevelPropertyValueChange_specifyConceptGraph = async (ipns,up_slug,concept_slug,changeNumber) => {
    var oUP = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(ipns,up_slug)
    var oCon = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(ipns,concept_slug)

    var oUpdates = oUP.conceptUpdateProposalData.updates
    var aTopLevelPVC = oUpdates.substitutions.topLevelPropertyValueChanges;
    var oTLPVC = aTopLevelPVC[changeNumber];

    var key = oTLPVC.propertyKey;
    var newVal = oTLPVC.propertyValue;

    oCon.conceptData[key] = newVal
    console.log("executeConceptUpdate_topLevelPropertyValueChange_specifyConceptGraph; oCon: "+JSON.stringify(oCon,null,4))
    // await ConceptGraphInMfsFunctions.addWordToMfsConceptGraph_specifyConceptGraph(ipns,oCon)
}

export default class ConceptGraphsFrontEndSingleConceptListOfUpdates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
        var concept_current_slug = window.frontEndConceptGraph.viewingConcept.slug;
        console.log("concept_current_slug: "+concept_current_slug)
        var oConceptCurrentlyViewing = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,concept_current_slug)

        var concept_updateProposal_slug = "conceptFor_updateProposal";
        var oConceptUP = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,concept_updateProposal_slug)
        var superset_UP_slug = oConceptUP.conceptData.nodes.superset.slug;
        var oSuperset_UP = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,superset_UP_slug)
        var aSpecificInstances = oSuperset_UP.globalDynamicData.specificInstances;

        for (var x=0;x<aSpecificInstances.length;x++) {
            var slug = aSpecificInstances[x];

            var oUP = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,slug)
            var name = oUP.wordData.name;
            var ipns = oUP.metaData.ipns;
            var author = oUP.updateProposalData.author.username;
            var authorPeerID = oUP.updateProposalData.author.peerID;
            var type = oUP.updateProposalData.type;
            if (type=="concept") {
                var oBaseConceptData = oUP.conceptUpdateProposalData.baseConceptData;
                var slug_primary = oBaseConceptData.slug.primary;
                if (slug_primary == concept_current_slug) {
                    console.log("found a match! slug_primary: "+slug_primary)
                    var updateHTML = "";
                    updateHTML += "<div>";
                        updateHTML += "<div style='display:inline-block;background-color:#CFCFCF;width:280px;padding:1px' ";
                        updateHTML += " class='singleUpdateProposalIdContainer' ";
                        updateHTML += " data-slug='"+slug+"' ";
                        updateHTML += " >";
                        updateHTML += slug;
                        updateHTML += "</div>";

                        updateHTML += "<div style='display:inline-block;padding:1px;margin-left:20px;' ";
                        updateHTML += " >";
                        updateHTML += "0.8";
                        updateHTML += "</div>";

                        updateHTML += "<div style='display:inline-block;padding:1px;margin-left:10px;' ";
                        updateHTML += " >";
                        updateHTML += "APPROVE";
                        updateHTML += "</div>";
                    updateHTML += "</div>";
                    jQuery("#availableUpdatesContainer").append(updateHTML)
                }
            }
        }
        jQuery(".singleUpdateProposalIdContainer").click(async function(){
            var updateProposal_slug = jQuery(this).data("slug")
            var oUP = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,updateProposal_slug)
            var oUpdates = oUP.conceptUpdateProposalData.updates
            var aTopLevelPVC = oUpdates.substitutions.topLevelPropertyValueChanges;

            for (var c=0;c<aTopLevelPVC.length;c++) {
                var oNextTLPVC = aTopLevelPVC[c];
                var key = oNextTLPVC.propertyKey;
                var val = oNextTLPVC.propertyValue;

                var currentValue = oConceptCurrentlyViewing.conceptData[key]

                var nextHTML = "";
                nextHTML += "<div>";
                    nextHTML += "<div>";
                        nextHTML += "<div style='width:100px;display:inline-block;textAlign:right;' >";
                        nextHTML += "property key: ";
                        nextHTML += "</div>";
                        nextHTML += "<div style='display:inline-block;marginLeft:10px' >";
                        nextHTML += key;
                        nextHTML += "</div>";
                    nextHTML += "</div>";

                    nextHTML += "<div>";
                        nextHTML += "<div style='width:100px;display:inline-block;textAlign:right;' >";
                        nextHTML += "current value: ";
                        nextHTML += "</div>";
                        nextHTML += "<div style='width:450px;display:inline-block;marginLeft:10px' >";
                        nextHTML += currentValue;
                        nextHTML += "</div>";
                    nextHTML += "</div>";

                    nextHTML += "<div>";
                        nextHTML += "<div style='width:100px;display:inline-block;textAlign:right;' >";
                        nextHTML += "proposed value: ";
                        nextHTML += "</div>";
                        nextHTML += "<div style='width:450px;display:inline-block;marginLeft:10px' >";
                        nextHTML += val;
                        nextHTML += "</div>";
                    nextHTML += "</div>";

                    nextHTML += "<div class='implementProposedUpdateButton doSomethingButton' ";
                    nextHTML += " data-upslug='"+updateProposal_slug+"' ";
                    nextHTML += " data-changenumber='"+c+"' ";
                    nextHTML += " >";
                    nextHTML += "implement proposed update";
                    nextHTML += "</div>";
                nextHTML += "</div>";

                jQuery("#tlpvsContainer").append(nextHTML)
            }
            jQuery(".implementProposedUpdateButton").click(async function(){
                var up_slug = jQuery(this).data("upslug")
                var changeNumber = jQuery(this).data("changenumber")
                console.log("implementProposedUpdateButton; up_slug: "+up_slug)
                await executeConceptUpdate_topLevelPropertyValueChange_specifyConceptGraph(viewingConceptGraph_ipns,up_slug,concept_current_slug,changeNumber)
            })
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
                        <div class="h2">Single Concept: Lists of Updates</div>
                        <div style={{fontSize:"12px",padding:"10px"}}>
                        This is a list of all update proposals in local currently-viewing concept graph that are:
                        <li>of type: concept (updateProposalData.type == concept)</li>
                        <li>conceptUpdateProposalData.baseConceptData shows a match to this concept (several ways to do this; easy way for starters is whether slug is identical; but match via synonym matching is more rigorous)</li>
                        </div>

                        <div style={{display:"inline-block",padding:"10px",border:"1px dashed grey",width:"600px",height:"800px",overflow:"scroll"}} >
                            <center>Available Updates</center>
                            <div style={{fontSize:"12px",marginTop:"10px",display:"inline-block",marginLeft:"300px"}} >Grapevine Score / Verdict</div>
                            <div id="availableUpdatesContainer" style={{fontSize:"12px",marginTop:"5px"}} ></div>
                        </div>

                        <div style={{display:"inline-block",padding:"10px",fontSize:"12px",border:"1px dashed grey",width:"600px",height:"800px",overflow:"scroll"}} >
                            <center>Selected Update Info</center>
                            <center>Top Level Property Value Substitutions</center>
                            <div id="tlpvsContainer" ></div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
