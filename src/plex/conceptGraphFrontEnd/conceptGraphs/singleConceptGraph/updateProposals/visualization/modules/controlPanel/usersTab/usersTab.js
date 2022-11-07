import React from "react";
import ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import * as MiscFunctions from '../../../../../../../../functions/miscFunctions.js';
import * as ConceptGraphInMfsFunctions from '../../../../../../../../lib/ipfs/conceptGraphInMfsFunctions.js'
import noUiSlider from "nouislider";
import "nouislider/distribute/nouislider.min.css";

const jQuery = require("jquery");

export default class GrapevineVisualControlPanelUsersTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compScoreDisplayPanelData: this.props.compScoreDisplayPanelData
        }
    }

    handleUpdateUserCompositeScoreData = () => {

        /*
        var oCSD = MiscFunctions.cloneObj(this.props.oSingleUpdateProposalVerdictScores);
        delete oCSD.ratings;
        delete oCSD.defaultRating;
        console.log("handleMupdateCompositeScoreDataod5Callback; oCSD: "+JSON.stringify(oCSD,null,4))
        // var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        // compScoreDisplayPanelData_new.strat5Coeff = newMod5Factor
        // this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        var sUpvCS1 = jQuery("#upvCompositeScoreContainer1").val()
        var oUpvCS1 = JSON.parse(sUpvCS1)

        var wordSlug = "updateProposalVerdictCompositeScore_multiSpecificInstance_superset"
        var wordName = "update proposal verdict composite score: multi specific instance, superset"
        var wordTitle = "Update Proposal Verdict Composite Score: Multi Specific Instance, superset"
        var wordDescription = "multiple specific instances stored in one file as one word, via the relationship: areSpecificInstancesOf the superset for the concept of updateProposalVerdictCompositeScore.";

        oUpvCS1.wordData.slug = wordSlug;
        oUpvCS1.wordData.name = wordName;
        oUpvCS1.wordData.title = wordTitle;
        oUpvCS1.wordData.description = wordDescription;

        console.log("updateCSDataButton clicked")
        oUpvCS1.aUpdateProposalVerdictCompositeScoreData = []
        oUpvCS1.aUpdateProposalVerdictCompositeScoreData.push(oCSD)

        jQuery("#upvCompositeScoreContainer2").val(JSON.stringify(oUpvCS1,null,4))
        */
    }

    async componentDidMount() {
        var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
        const updateUsersDefAvScore = () => {
            var usersDefAvScoreValue = usersDefAvScoreSlider.noUiSlider.get();
            var usersDefAvScoreValue = usersDefAvScoreValue / 100;
            this.props.userTrustAverageScoreSliderCallback(usersDefAvScoreValue);
            jQuery("#usersDefaultAverageScoreValueContainer").html(usersDefAvScoreValue)

            var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
            compScoreDisplayPanelData_new.defaultUserTrustAverageScore = usersDefAvScoreValue
            this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
            console.log("usersTab; new usersDefAvScoreValue: "+usersDefAvScoreValue)
        }
        var usersDefAvScoreSlider = document.getElementById('usersDefaultAverageScoreSlider');
        // var starterValue1 = this.state.compScoreDisplayPanelData.defaultUserTrustAverageScore;
        // var starterValueUserAvgTrust = this.props.compScoreDisplayPanelData.defaultUserTrustAverageScore;
        var starterValueUserAvgTrust = this.props.compScoreDisplayPanelData.defaultUserTrustAverageScore * 100;
        // var starterValueUserAvgTrust = this.props.defaultUserTrustAverageScore
        // var starterValueUserAvgTrust = 0.69
        console.log("userTab starterValueUserAvgTrust: "+starterValueUserAvgTrust)
        // var starterValue1 = window.grapevine.starterDefaultUserTrustAverageScore
        noUiSlider.create(usersDefAvScoreSlider, {
            start: starterValueUserAvgTrust,
            step: 1,
            range: {
                'max': 100,
                "min": 0
            }
        });
        usersDefAvScoreSlider.noUiSlider.on("update",updateUsersDefAvScore)

        const updateUsersDefConfidenceScore = () => {
            var usersDefConfidenceValue = usersDefConfidenceSlider.noUiSlider.get();
            var usersDefConfidenceValue = usersDefConfidenceValue / 100;
            this.props.userTrustConfidenceSliderCallback(usersDefConfidenceValue);
            jQuery("#usersDefaultConfidenceValueContainer").html(usersDefConfidenceValue)
        }
        var usersDefConfidenceSlider = document.getElementById('usersDefaultConfidenceSlider');
        // var starterValue2 = this.state.compScoreDisplayPanelData.defaultUserTrustConfidence;
        var starterValueUserTrustConfidence = this.props.compScoreDisplayPanelData.defaultUserTrustConfidence * 100;
        // var starterValue2 = window.grapevine.starterDefaultUserTrustConfidence
        // var starterValue2 = this.props.compScoreDisplayPanelData.defaultUserTrustConfidence;
        noUiSlider.create(usersDefConfidenceSlider, {
            start: starterValueUserTrustConfidence,
            step: 1,
            range: {
                'max': 100,
                "min": 0
            }
        });
        usersDefConfidenceSlider.noUiSlider.on("update",updateUsersDefConfidenceScore)

        ////////////////////////////////////////////////////////////
        // load existing userTrustCompositeScore_multiSpecificInstance_superset; if it does not already exist, then
        // create a new one
        var multiSpecificInstances_slug = "userTrustCompositeScore_multiSpecificInstance_superset";
        var oUtCS = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,multiSpecificInstances_slug);
        if (!oUtCS) {
            var oUtCS = await MiscFunctions.createNewWordByTemplate("userTrustCompositeScore");
        }
        jQuery("#utCompositeScoreContainer1").val(JSON.stringify(oUtCS,null,4))
        ////////////////////////////////////////////////////////////
    }
    render() {
        return (
            <>
                <div style={{textAlign:"left"}}>
                    <div style={{textAlign:"center"}}>
                        <div style={{display:"inline-block",border:"1px solid black",borderRadius:"5px",width:"300px",padding:"5px"}}>
                            <div style={{fontSize:"14px",marginLeft:"5px"}} >
                                default avg score for unvetted users:
                            </div>
                            <div style={{marginTop:"10px"}}>
                                <div id="usersDefaultAverageScoreValueContainer" style={{display:"inline-block",width:"30px",marginLeft:"10px"}} ></div>
                                <div id="usersDefaultAverageScoreSlider" style={{display:"inline-block",width:"200px",marginLeft:"20px",backgroundColor:"green"}} ></div>
                            </div>
                        </div>

                        <div style={{display:"inline-block",border:"1px solid black",borderRadius:"5px",width:"300px",padding:"5px",marginLeft:"10px"}}>
                            <div style={{fontSize:"14px",marginLeft:"5px"}} >
                                confidence:
                            </div>
                            <div style={{marginTop:"10px"}}>
                                <div id="usersDefaultConfidenceValueContainer" style={{display:"inline-block",width:"30px",marginLeft:"10px"}} ></div>
                                <div id="usersDefaultConfidenceSlider" style={{display:"inline-block",width:"200px",marginLeft:"20px",backgroundColor:"grey"}} ></div>
                            </div>
                        </div>

                        <div>
                            <div id="updateCSDataButton" className="doSomethingButton_small" onClick={this.handleUpdateUserCompositeScoreData} >update composite score data</div>
                            <div className="doSomethingButton_small" id="saveUserCompositeScoreButton">save</div>
                            <div style={{marginTop:"5px"}} >
                                <textarea id="utCompositeScoreContainer1" style={{width:"95%",height:"200px"}} >
                                </textarea>
                            </div>
                            <div style={{marginTop:"5px"}} >
                                <textarea id="utCompositeScoreContainer2" style={{width:"95%",height:"300px"}} >
                                </textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
