import React from "react";
import Masthead from '../../../../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../../../../navbars/leftNavbar2/cgFe_singleConceptListsOfUpdates_leftNav2';
import * as ConceptGraphInMfsFunctions from '../../../../../../../lib/ipfs/conceptGraphInMfsFunctions.js';
import * as MiscIpfsFunctions from '../../../../../../../lib/ipfs/miscIpfsFunctions.js'
import * as MiscFunctions from '../../../../../../../functions/miscFunctions.js';

const jQuery = require("jquery");

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
                    updateHTML += "<div style='' ";
                    updateHTML += " class='singleUpdateProposalIdContainer' ";
                    updateHTML += " data-slug='"+slug+"' ";
                    updateHTML += " >";
                    updateHTML += slug;
                    updateHTML += "</div>";
                    jQuery("#availableUpdatesContainer").append(updateHTML)
                }
            }
        }
        jQuery(".singleUpdateProposalIdContainer").click(async function(){
            var concept_slug = jQuery(this).data("slug")
            var oUP = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,concept_slug)
            // console.log("singleUpdateProposalIdContainer; concept_slug: "+concept_slug)
            // console.log("singleUpdateProposalIdContainer; oUP: "+JSON.stringify(oUP,null,4))
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

                    nextHTML += "<div class='doSomethingButton' >";
                    nextHTML += "implement proposed update";
                    nextHTML += "</div>";
                nextHTML += "</div>";

                jQuery("#tlpvsContainer").append(nextHTML)
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
                        <div class="h2">Single Concept: Lists of Updates</div>
                        <div style={{fontSize:"12px",padding:"10px"}}>
                        This is a list of all update proposals in local currently-viewing concept graph that are:
                        <li>of type: concept (updateProposalData.type == concept)</li>
                        <li>conceptUpdateProposalData.baseConceptData shows a match to this concept (several ways to do this; easy way for starters is whether slug is identical; but match via synonym matching is more rigorous)</li>
                        </div>

                        <div style={{display:"inline-block",padding:"10px",border:"1px dashed grey",width:"600px",height:"800px",overflow:"scroll"}} >
                            <center>Available Updates</center>
                            <div id="availableUpdatesContainer" ></div>
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
