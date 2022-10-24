import React from "react";
import { Chart } from "react-google-charts";
import ReactDOM from 'react-dom';
import { render } from "react-dom";
// import { VictoryTheme, VictoryChart, VictoryLine, VictoryScatter } from "victory";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import noUiSlider from "nouislider";
import "nouislider/distribute/nouislider.min.css";

const jQuery = require("jquery");

const drawMod3Chart = () => {
    const options = {
        title: "Mod 3",
        hAxis: {
            title:"Rating",
            scaleType:"log",
            format:"decimal"
        },
        vAxis: {
            title:"Coefficient",
            format:"decimal"
        }
    };
    var data = [
        ['X','Y']
    ]
    var mod3Slider = document.getElementById('mod3Slider');
    var mod4Slider = document.getElementById('mod4Slider');
    var mod5Slider = document.getElementById('mod5Slider');
    var m3 = mod3Slider.noUiSlider.get() / 100;
    var m4 = mod4Slider.noUiSlider.get() / 100;
    var m5 = mod5Slider.noUiSlider.get() / 100;
    // var m3 = 0.9
    if (m3 < 1) {
        var m3z = 1 / (1 - m3);
    } else {
        var m3z = 100000;
    }
    // var m4 = 2
    // var m5 = 5
    for (var rr=1;rr<200;rr++) {
        var r = rr/10;
        var logRat = Math.log(r) / Math.log(m5);
        logRat = Math.abs(logRat);
        if (m4 > 0) {
            var logRatExp = Math.pow(logRat,m4);
        } else {
            var logRatExp = logRat;
        }
        var logRatExp = Math.pow(logRat,m4);
        var coeff = Math.pow(m3z,-logRatExp);
        // coeff = 1 / coeff;
        // if (coeff > 1) {coeff = 1}
        // if (coeff < 0) {coeff = 0}
        console.log("logRat, r, coeff "+logRat+", "+r+", "+coeff)
        data.push([r,coeff])
    }

    const Mod3Chart = () => {
        return (
            <>
                <Chart
                    chartType="LineChart"
                    data={data}
                    options={options}
                    width={"400px"}
                    height={"200px"}
                />
            </>
        );
    };

    render(<Mod3Chart />, document.getElementById("defenseMod3ChartContainer"));
}

export default class DefenseModification3Tab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compScoreDisplayPanelData: this.props.compScoreDisplayPanelData
        }
    }
    async componentDidMount() {
        ////////////////////////////////////////////////////////
        const updateMod3Factor = () => {
            var mod3FactorValue = mod3Slider.noUiSlider.get();
            var mod3FactorValue = mod3FactorValue / 100;
            jQuery("#mod3FactorValueContainer").html(mod3FactorValue)
            this.props.mod3SliderCallback(mod3FactorValue);
        }
        var mod3Slider = document.getElementById('mod3Slider');
        var starterValueUserMod3Coeff = this.props.compScoreDisplayPanelData.strat3Coeff * 100;
        noUiSlider.create(mod3Slider, {
            start: starterValueUserMod3Coeff,
            step: 1,
            range: {
                'max': 100,
                "min": 0
            }
        });
        mod3Slider.noUiSlider.on("update",updateMod3Factor)
        mod3Slider.noUiSlider.on("change",drawMod3Chart)

        ////////////////////////////////////////////////////////
        const updateMod4Factor = () => {
            var mod4FactorValue = mod4Slider.noUiSlider.get();
            var mod4FactorValue = mod4FactorValue / 100;
            jQuery("#mod4FactorValueContainer").html(mod4FactorValue)
            this.props.mod4SliderCallback(mod4FactorValue);
        }
        var mod4Slider = document.getElementById('mod4Slider');
        var starterValueUserMod4Coeff = this.props.compScoreDisplayPanelData.strat4Coeff * 100;
        noUiSlider.create(mod4Slider, {
            start: starterValueUserMod4Coeff,
            step: 1,
            range: {
                'max': 500,
                "min": 0
            }
        });
        mod4Slider.noUiSlider.on("update",updateMod4Factor)
        mod4Slider.noUiSlider.on("change",drawMod3Chart)

        ////////////////////////////////////////////////////////
        const updateMod5Factor = () => {
            var mod5FactorValue = mod5Slider.noUiSlider.get();
            var mod5FactorValue = mod5FactorValue / 100;
            jQuery("#mod5FactorValueContainer").html(mod5FactorValue)
            this.props.mod5SliderCallback(mod5FactorValue);
        }
        var mod5Slider = document.getElementById('mod5Slider');
        var starterValueUserMod5Coeff = this.props.compScoreDisplayPanelData.strat5Coeff * 100;
        noUiSlider.create(mod5Slider, {
            start: starterValueUserMod5Coeff,
            step: 1,
            range: {
                'max': 2000,
                "min": 101
            }
        });
        mod5Slider.noUiSlider.on("update",updateMod5Factor)
        mod5Slider.noUiSlider.on("change",drawMod3Chart)

        drawMod3Chart();
    }
    render() {
        return (
            <>
                <center>Defense Modification #3 Tab: Extreme Ratings</center>

                <div style={{fontSize:"12px"}}>
                    <div style={{textAlign:"left",backgroundColor:"orange",padding:"5px",fontStyle:"italic"}}>
                        Problem: What if Malicious User #1 rates Malicious User #2 with some ridiculously high score, like 10 million?
                    </div>

                    <div style={{textAlign:"left",marginTop:"10px",backgroundColor:"#CCFFCC",padding:"5px"}}>
                        Solution: Extreme (high or low) trust ratings are given less weight. (And each user gets to decide what constitutes "unreasonable.")
                    </div>
                </div>

                <div style={{backgroundColor:"#CFCFCF",marginTop:"10px"}}>
                    <div>
                        <div style={{display:"inline-block",fontSize:"12px"}} >Mod 3 FACTOR</div>
                        <div id="mod3FactorValueContainer" style={{display:"inline-block",marginLeft:"10px",width:"30px",fontSize:"12px"}} >1.00</div>
                        <div style={{display:"inline-block",marginLeft:"10px",fontSize:"12px"}} >OFF</div>
                        <div id="mod3Slider" style={{display:"inline-block",width:"200px",marginLeft:"20px",backgroundColor:"blue"}} ></div>
                        <div style={{display:"inline-block",marginLeft:"20px",fontSize:"12px"}} >ON</div>
                    </div>

                    <div style={{fontSize:"12px"}}>
                        <div style={{textAlign:"left",marginTop:"10px"}}>
                            Default: 1.00
                        </div>
                    </div>
                </div>

                <div style={{backgroundColor:"#CFCFCF",marginTop:"10px"}}>
                    <div>
                        <div style={{display:"inline-block",fontSize:"12px"}} >Mod 4 FACTOR</div>
                        <div id="mod4FactorValueContainer" style={{display:"inline-block",marginLeft:"10px",width:"30px",fontSize:"12px"}} >1.00</div>
                        <div style={{display:"inline-block",marginLeft:"10px",fontSize:"12px"}} >OFF</div>
                        <div id="mod4Slider" style={{display:"inline-block",width:"200px",marginLeft:"20px",backgroundColor:"blue"}} ></div>
                        <div style={{display:"inline-block",marginLeft:"20px",fontSize:"12px"}} >ON</div>
                    </div>

                    <div style={{fontSize:"12px"}}>
                        <div style={{textAlign:"left",marginTop:"10px"}}>
                            A parameter to modify the strength of Strategy 3.
                        </div>

                        <div style={{textAlign:"left",marginTop:"10px"}}>
                            Default: 2.00
                        </div>
                    </div>
                </div>

                <div style={{backgroundColor:"#CFCFCF",marginTop:"10px"}}>
                    <div>
                        <div style={{display:"inline-block",fontSize:"12px"}} >Mod 5 FACTOR</div>
                        <div id="mod5FactorValueContainer" style={{display:"inline-block",marginLeft:"10px",width:"30px",fontSize:"12px"}} >1.00</div>
                        <div style={{display:"inline-block",marginLeft:"10px",fontSize:"12px"}} >strict</div>
                        <div id="mod5Slider" style={{display:"inline-block",width:"200px",marginLeft:"20px",backgroundColor:"blue"}} ></div>
                        <div style={{display:"inline-block",marginLeft:"20px",fontSize:"12px"}} >loose</div>
                    </div>

                    <div style={{fontSize:"12px"}}>
                        <div style={{textAlign:"left",marginTop:"10px"}}>
                            A parameter to specify Strategy 3's boundary between a reasonable and an unreasonably high credibility score.
                        </div>

                        <div style={{textAlign:"left",marginTop:"10px"}}>
                            Default: 5.00
                        </div>
                    </div>
                </div>

                <div id="defenseMod3ChartContainer" style={{width:"500px",height:"200px",backgroundColor:"#CFCFCF",marginTop:"10px"}}></div>

            </>
        );
    }
}
