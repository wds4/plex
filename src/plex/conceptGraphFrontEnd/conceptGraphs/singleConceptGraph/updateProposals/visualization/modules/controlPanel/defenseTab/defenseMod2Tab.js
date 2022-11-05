import React from "react";
import ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import * as MiscFunctions from '../../../../../../../../functions/miscFunctions.js';
import noUiSlider from "nouislider";
import "nouislider/distribute/nouislider.min.css";

const jQuery = require("jquery");


export default class DefenseModification2Tab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compScoreDisplayPanelData: this.props.compScoreDisplayPanelData
        }
    }
    async componentDidMount() {
        const updateMod2Factor = () => {
            var mod2FactorValue = mod2Slider.noUiSlider.get();
            var mod2FactorValue = mod2FactorValue / 100;
            jQuery("#mod2FactorValueContainer").html(mod2FactorValue)
            this.props.mod2SliderCallback(mod2FactorValue);
        }
        var mod2Slider = document.getElementById('mod2Slider');
        var starterValueUserMod2Coeff = this.props.compScoreDisplayPanelData.strat2Coeff * 100;
        noUiSlider.create(mod2Slider, {
            start: starterValueUserMod2Coeff,
            step: 1,
            range: {
                'max': 100,
                "min": 0
            }
        });
        mod2Slider.noUiSlider.on("update",updateMod2Factor)
    }
    render() {
        return (
            <>
                <center>Defense Modification #2 Tab</center>
                <center>Bidirectionality</center>

                <div>
                    <div style={{display:"inline-block",fontSize:"12px"}} >Mod 2 FACTOR</div>
                    <div id="mod2FactorValueContainer" style={{display:"inline-block",marginLeft:"10px",width:"30px",fontSize:"12px"}} >1.00</div>
                    <div style={{display:"inline-block",marginLeft:"10px",fontSize:"12px"}} >OFF</div>
                    <div id="mod2Slider" style={{display:"inline-block",width:"200px",marginLeft:"20px",backgroundColor:"blue"}} ></div>
                    <div style={{display:"inline-block",marginLeft:"20px",fontSize:"12px"}} >ON</div>
                </div>

                <div style={{fontSize:"12px"}}>
                    <div style={{textAlign:"left",marginTop:"10px",fontStyle:"italic"}}>
                        Problem: What if Malicious User #1 and Malicious User #2 use the grapevine trust system so that each rates the other with trust scores much greater than 1?
                        Won't this cause an unstable positive feedback loop?
                    </div>

                    <div style={{textAlign:"left",marginTop:"10px"}}>
                        Trust ratings affect the rater's average as well as the ratee's (assuming the rater is the reference user). In theory this is more appropriate,
                        since by definition, grapevine trust ratings are relative trust ratings between two users.
                        This also mitigates certain types of attacks such as a group of malicious user accounts upvoting each other
                        within a group to bootstrap reputation. When this modification is fully engaged, if Malicious User #1 upvotes Malicious User #2,
                        it has the effect of decreasing MU1's trust score as much as it increases MU2's score.
                    </div>

                    <div style={{textAlign:"left",marginTop:"10px"}}>
                        Default: 1.00
                    </div>
                </div>
            </>
        );
    }
}
