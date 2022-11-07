import React from "react";
import ReactDOM from 'react-dom';
import * as MiscFunctions from '../../../../../../functions/miscFunctions.js';
import noUiSlider from "nouislider";
import "nouislider/distribute/nouislider.min.css";

const electronFs = window.require('fs');

const jQuery = require("jquery");

export default class VerdictCutoffsSliderModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compScoreDisplayPanelData: this.props.compScoreDisplayPanelData
        }
    }
    async componentDidMount() {
        const updateVerdictCutoffsFactor = () => {
            var [v1,v2] = verdictCutoffsSlider.noUiSlider.get();
            var verdictCutoffsDisapproveFactorValue = v1 / 100;
            var verdictCutoffsApproveFactorValue = v2 / 100;
            // this.props.verdictCutoffsSliderCallback(verdictCutoffsFactorValue1);
            jQuery("#verdictCutoffsDisapproveFactorValueContainer").html(verdictCutoffsDisapproveFactorValue)
            jQuery("#verdictCutoffsApproveFactorValueContainer").html(verdictCutoffsApproveFactorValue)
        }
        var verdictCutoffsSlider = document.getElementById('verdictCutoffsSlider');
        // var starterValue = this.state.defaultVerdictCutoffsFactor;
        var starterValueApprove = window.grapevine.starterDefaultVerdictAccept
        var starterValueDisapprove = window.grapevine.starterDefaultVerdictReject
        noUiSlider.create(verdictCutoffsSlider, {
            start: [starterValueDisapprove,starterValueApprove],
            connect: true,
            step: 1,
            range: {
                'max': 100,
                "min": -100
            }
        });
        verdictCutoffsSlider.noUiSlider.on("update",updateVerdictCutoffsFactor)
    }
    render() {
        return (
            <>
                <div style={{display:"inline-block",textAlign:"left"}} >
                    <center>
                        <div style={{display:"inline-block",fontSize:"12px"}} >VERDICT CUTOFFS</div>
                    </center>
                    <div style={{fontSize:"12px",marginBottom:"20px",width:"50%",textAlign:"left"}} >
                        Influence (average * certainty) cutoffs for whether update proposal is implemented or not, based on grapevine composite score calculations.
                    </div>
                    <div style={{marginBottom:"20px"}} >
                        <div id="verdictCutoffsDisapproveFactorValueContainer" style={{display:"inline-block",marginLeft:"10px",width:"30px",fontSize:"12px"}} >1.00</div>
                        <div style={{display:"inline-block",marginLeft:"5px",fontSize:"12px"}} >%</div>
                        <div style={{display:"inline-block",marginLeft:"10px",fontSize:"12px"}} >REJECT</div>
                        <div id="verdictCutoffsSlider" style={{display:"inline-block",width:"200px",marginLeft:"20px",backgroundColor:"blue"}} ></div>
                        <div id="verdictCutoffsApproveFactorValueContainer" style={{display:"inline-block",marginLeft:"10px",width:"30px",fontSize:"12px"}} >1.00</div>
                        <div style={{display:"inline-block",marginLeft:"5px",fontSize:"12px"}} >%</div>
                        <div style={{display:"inline-block",marginLeft:"20px",fontSize:"12px"}} >ACCEPT</div>
                    </div>
                    <div className="doSomethingButton" id="saveVerdictSettingsButton" >save verdict settings</div>
                </div>
            </>
        );
    }
}
