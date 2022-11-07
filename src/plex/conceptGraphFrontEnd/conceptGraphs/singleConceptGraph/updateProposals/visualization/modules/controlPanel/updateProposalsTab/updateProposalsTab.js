import React from "react";
import ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import * as MiscFunctions from '../../../../../../../../functions/miscFunctions.js';
import * as ConceptGraphInMfsFunctions from '../../../../../../../../lib/ipfs/conceptGraphInMfsFunctions.js'
import noUiSlider from "nouislider";
import "nouislider/distribute/nouislider.min.css";

const jQuery = require("jquery"); 

export default class GrapevineVisualControlPanelUpdateProposalsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compScoreDisplayPanelData: this.props.compScoreDisplayPanelData
        }
    }

    async componentDidMount() {
        var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;

        ////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////
        const updateUpdateProposalsDefConfidenceScore = () => {
            var updateProposalsDefConfidenceValue = updateProposalsDefConfidenceSlider.noUiSlider.get();
            var updateProposalsDefConfidenceValue = updateProposalsDefConfidenceValue / 100;
            this.props.updateProposalVerdictConfidenceSliderCallback(updateProposalsDefConfidenceValue);
            jQuery("#updateProposalsDefaultConfidenceValueContainer").html(updateProposalsDefConfidenceValue)
        }
        var updateProposalsDefConfidenceSlider = document.getElementById('updateProposalsDefaultConfidenceSlider');
        var starterValueUpdateProposalVerdictConfidence = this.props.compScoreDisplayPanelData.defaultUpdateProposalVerdictConfidence * 100;
        noUiSlider.create(updateProposalsDefConfidenceSlider, {
            start: starterValueUpdateProposalVerdictConfidence,
            step: 1,
            range: {
                'max': 100,
                "min": 0
            }
        });
        updateProposalsDefConfidenceSlider.noUiSlider.on("update",updateUpdateProposalsDefConfidenceScore)

        ////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////
        const updateUpdateProposalsDefAvScore = () => {
            var updateProposalsDefAvScoreValue = updateProposalsDefAvScoreSlider.noUiSlider.get();
            var updateProposalsDefAvScoreValue = updateProposalsDefAvScoreValue / 100;
            this.props.updateProposalVerdictAverageScoreSliderCallback(updateProposalsDefAvScoreValue);
            jQuery("#updateProposalsDefaultAverageScoreValueContainer").html(updateProposalsDefAvScoreValue)

            var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
            compScoreDisplayPanelData_new.defaultUpdateProposalVerdictAverageScore = updateProposalsDefAvScoreValue
            this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
            console.log("updateProposalsTab; new updateProposalsDefAvScoreValue: "+updateProposalsDefAvScoreValue)
        }
        var updateProposalsDefAvScoreSlider = document.getElementById('updateProposalsDefaultAverageScoreSlider');
        var starterValueUpdateProposalVerdictAverage = this.props.compScoreDisplayPanelData.defaultUpdateProposalVerdictAverageScore * 100;
        console.log("updateProposalTab starterValueUpdateProposalVerdictAverage: "+starterValueUpdateProposalVerdictAverage)
        noUiSlider.create(updateProposalsDefAvScoreSlider, {
            start: starterValueUpdateProposalVerdictAverage,
            step: 1,
            range: {
                'max': 100,
                "min": -100
            }
        });
        updateProposalsDefAvScoreSlider.noUiSlider.on("update",updateUpdateProposalsDefAvScore)

        ////////////////////////////////////////////////////////////
        // load existing updateProposalVerdictCompositeScore_multiSpecificInstance_superset; if it does not already exist, then
        // create a new one
        var multiSpecificInstances_slug = "updateProposalVerdictCompositeScore_multiSpecificInstance_superset";
        var oUpvCS = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,multiSpecificInstances_slug);
        if (!oUpvCS) {
            var oUpvCS = await MiscFunctions.createNewWordByTemplate("updateProposalVerdictCompositeScore");
        }
        jQuery("#upvCompositeScoreContainer1").val(JSON.stringify(oUpvCS,null,4))
        ////////////////////////////////////////////////////////////

        jQuery("#saveUpvCompositeScoreButton").click(async function(){
            var sUPVCS = jQuery("#upvCompositeScoreContainer2").val();
            var oUPVCS = JSON.parse(sUPVCS);
            var upvcs_slug = oUPVCS.wordData.slug;
            console.log("saveUpvCompositeScoreButton clicked; oUPVCS: "+JSON.stringify(oUPVCS,null,4));

            var concept_slug = "conceptFor_updateProposalVerdictCompositeScore";
            var oConcept = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,concept_slug);
            var superset_slug = oConcept.conceptData.nodes.superset.slug;
            var oSuperset = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,superset_slug);
            var mainSchema_slug = oConcept.conceptData.nodes.schema.slug;
            var oMainSchema = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,mainSchema_slug);

            var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
            oNewRel.nodeFrom.slug = upvcs_slug;
            oNewRel.relationshipType.slug = "areSpecificInstancesOf";
            oNewRel.nodeTo.slug = superset_slug;

            console.log("addNewWordAsSpecificInstanceToConceptInMFS_specifyConceptGraph; oNewRel: "+JSON.stringify(oNewRel,null,4))

            var oMiniWordLookup = {};
            oMiniWordLookup[upvcs_slug] = oUPVCS;
            oMiniWordLookup[superset_slug] = oSuperset;
            oMainSchema = MiscFunctions.updateSchemaWithNewRel(oMainSchema,oNewRel,oMiniWordLookup)
            console.log("addNewWordAsSpecificInstanceToConceptInMFS_specifyConceptGraph; oMainSchema: "+JSON.stringify(oMainSchema,null,4))

            await ConceptGraphInMfsFunctions.addWordToMfsConceptGraph_specifyConceptGraph(viewingConceptGraph_ipns,oUPVCS);
            await ConceptGraphInMfsFunctions.addWordToMfsConceptGraph_specifyConceptGraph(viewingConceptGraph_ipns,oMainSchema);
        })
    }
    render() {
        return (
            <>
                <div style={{textAlign:"left"}}>
                    <div style={{textAlign:"center"}}>
                        <div style={{display:"inline-block",border:"1px solid black",borderRadius:"5px",width:"300px",padding:"5px"}}>
                            <div style={{fontSize:"14px",marginLeft:"5px"}} >
                                default avg score:
                            </div>
                            <div style={{marginTop:"10px"}}>
                                <div id="updateProposalsDefaultAverageScoreValueContainer" style={{display:"inline-block",width:"30px",marginLeft:"10px"}} ></div>
                                <div id="updateProposalsDefaultAverageScoreSlider" style={{display:"inline-block",width:"200px",marginLeft:"20px",backgroundColor:"green"}} ></div>
                            </div>
                        </div>

                        <div style={{display:"inline-block",border:"1px solid black",borderRadius:"5px",width:"300px",padding:"5px",marginLeft:"10px"}}>
                            <div style={{fontSize:"14px",marginLeft:"5px"}} >
                                confidence:
                            </div>
                            <div style={{marginTop:"10px"}}>
                                <div id="updateProposalsDefaultConfidenceValueContainer" style={{display:"inline-block",width:"30px",marginLeft:"10px"}} ></div>
                                <div id="updateProposalsDefaultConfidenceSlider" style={{display:"inline-block",width:"200px",marginLeft:"20px",backgroundColor:"grey"}} ></div>
                            </div>
                        </div>
                    </div>
                    <div style={{marginTop:"5px"}} >
                        <textarea id="upvCompositeScoreContainer1" style={{width:"95%",height:"200px"}} >
                        </textarea>
                    </div>
                    <div style={{marginTop:"5px"}} >
                        <textarea id="upvCompositeScoreContainer2" style={{width:"95%",height:"300px"}} >
                        </textarea>
                    </div>
                    <div className="doSomethingButton" id="saveUpvCompositeScoreButton">save</div>
                </div>
            </>
        );
    }
}
