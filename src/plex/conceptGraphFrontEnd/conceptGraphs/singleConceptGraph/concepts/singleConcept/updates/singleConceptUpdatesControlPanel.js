import React from "react";
import Masthead from '../../../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../../../navbars/leftNavbar2/cgFe_singleConceptUpdates_leftNav2';
import * as ConceptGraphInMfsFunctions from '../../../../../../lib/ipfs/conceptGraphInMfsFunctions.js';
import * as MiscFunctions from '../../../../../../functions/miscFunctions.js';

const jQuery = require("jquery");

const updateConceptWithNewUpdateProposalSettingsExecution_specifyConceptGraph = async (ipns,newExecutionSetting,oConcept) => {
    var oConceptUpdated = MiscFunctions.cloneObj(oConcept);
    if (!oConcept.conceptData.hasOwnProperty("updateProposalSettings")) {
        oConceptUpdated.conceptData.updateProposalSettings = {}
        oConceptUpdated.conceptData.updateProposalSettings.execution = null;
    }
    oConceptUpdated.conceptData.updateProposalSettings.execution = newExecutionSetting;
    return oConceptUpdated;
}

export default class ConceptGraphsFrontEndSingleConceptUpdatesControlPanel extends React.Component {
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
        // console.log("concept_current_slug: "+concept_current_slug)
        var oConceptCurrentlyViewing = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,concept_current_slug)

        if (oConceptCurrentlyViewing.conceptData.hasOwnProperty("updateProposalSettings")) {
            var currentExecutionSetting = oConceptCurrentlyViewing.conceptData.updateProposalSettings.execution;
            jQuery("#updateOption_"+currentExecutionSetting).prop("checked",true);
        }
        jQuery("#saveSettingsButton").click(async function(){
            jQuery(".updateOption").each(async function(i,obj) {
                var isChecked = jQuery(this).prop("checked")
                var val = jQuery(this).val()
                console.log("saveSettingsButton; isChecked: "+isChecked+"; val: "+val)
                if (isChecked) {
                    var oConceptCurrentlyViewing_updated = await updateConceptWithNewUpdateProposalSettingsExecution_specifyConceptGraph(viewingConceptGraph_ipns,val,oConceptCurrentlyViewing)
                    // console.log("oConceptCurrentlyViewing_updated: "+JSON.stringify(oConceptCurrentlyViewing_updated,null,4))
                    await ConceptGraphInMfsFunctions.addWordToMfsConceptGraph_specifyConceptGraph(viewingConceptGraph_ipns,oConceptCurrentlyViewing_updated)
                }
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
                        <div class="h2">Single Concept: Update Proposal Settings</div>

                        <center>
                            <div style={{textAlign:"left",display:"inline-block",marginTop:"20px"}} >
                            <center>Execution of individual update proposals</center>
                                <div>
                                    <input type="radio" class="updateOption" name="updateOption" id="updateOption_off" value="off" /><span style={{marginLeft:"10px"}} >off</span>
                                </div>
                                <div>
                                    <input type="radio" class="updateOption" name="updateOption" id="updateOption_manual" value="manual" /><span style={{marginLeft:"10px"}} >manual</span>
                                </div>
                                <div>
                                    <input type="radio" class="updateOption" name="updateOption" id="updateOption_automaticGrapevine" value="automaticGrapevine" /><span style={{marginLeft:"10px"}} >automatic: grapevine</span>
                                </div>
                                <div>
                                    <input type="radio" class="updateOption" name="updateOption" id="updateOption_automaticLinkToIpns" value="automaticLinkToIpns" /><span style={{marginLeft:"10px"}} >automatic: link to specific ipns</span>
                                </div>
                                <div className="doSomethingButton" id="saveSettingsButton" >save settings</div>
                            </div>
                        </center>
                    </div>
                </fieldset>
            </>
        );
    }
}
