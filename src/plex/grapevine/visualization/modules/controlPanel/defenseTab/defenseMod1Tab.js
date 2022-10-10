import React from "react";
import ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import noUiSlider from "nouislider";
import "nouislider/distribute/nouislider.min.css";

const jQuery = require("jquery");

export default class DefenseModification1Tab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
        const updateMod1Factor = () => {
            var mod1FactorValue = mod1Slider.noUiSlider.get();
            var mod1FactorValue = mod1FactorValue / 100;
            jQuery("#mod1FactorValueContainer").html(mod1FactorValue)
        }
        var mod1Slider = document.getElementById('mod1Slider');
        noUiSlider.create(mod1Slider, {
            start: 100,
            step: 1,
            range: {
                'max': 100,
                "min": 0
            }
        });
        mod1Slider.noUiSlider.on("update",updateMod1Factor)

    }
    render() {
        return (
            <>
                <center>Defense Modification #1 Tab</center>
                <center>Reference User</center>

                <div>
                    <div style={{display:"inline-block",fontSize:"12px"}} >Mod 1 FACTOR</div>
                    <div id="mod1FactorValueContainer" style={{display:"inline-block",marginLeft:"10px",width:"30px",fontSize:"12px"}} >1.00</div>
                    <div style={{display:"inline-block",marginLeft:"10px",fontSize:"12px"}} >OFF</div>
                    <div id="mod1Slider" style={{display:"inline-block",width:"200px",marginLeft:"20px",backgroundColor:"blue"}} ></div>
                    <div style={{display:"inline-block",marginLeft:"20px",fontSize:"12px"}} >ON</div>
                </div>

                <div style={{fontSize:"12px"}}>
                    <div style={{textAlign:"left",marginTop:"10px"}}>
                        All trust scores are (more appropriately) interpreted using the rater as the reference (rather than the poorly-defined "average user").
                        This practice is conceptually more appropriate (because the notion of average user has problems).
                        This Defense Modification effectively sharpens the filter between low-trust and high-trust groups.
                        (However, in some ways it may increase vulnerability to attack from bad actors?)
                    </div>

                    <div style={{textAlign:"left",marginTop:"10px"}}>
                        Default: 1.00
                    </div>
                </div>

            </>
        );
    }
}
