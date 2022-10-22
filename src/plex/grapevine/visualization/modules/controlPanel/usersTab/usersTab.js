import React from "react";
import ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
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

    async componentDidMount() {
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
    }
    render() {
        return (
            <>
                <div style={{textAlign:"left"}}>
                    <div style={{textAlign:"center"}}>
                        <div style={{display:"inline-block",border:"1px solid black",borderRadius:"5px",width:"300px",padding:"5px"}}>
                            <div style={{fontSize:"14px",marginLeft:"5px"}} >
                                default avg score state: ={this.state.compScoreDisplayPanelData.defaultUserTrustAverageScore}= props: ={this.props.compScoreDisplayPanelData.defaultUserTrustAverageScore}=  for unvetted users:
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

                    </div>
                </div>
            </>
        );
    }
}
