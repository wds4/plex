import React from "react";
import ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import * as MiscFunctions from '../../../../../../../../functions/miscFunctions.js';
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
                </div>
            </>
        );
    }
}
