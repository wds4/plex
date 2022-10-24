import React from "react";
import ReactDOM from 'react-dom';
import { render } from "react-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Chart } from "react-google-charts";
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import noUiSlider from "nouislider";
import "nouislider/distribute/nouislider.min.css";

const jQuery = require("jquery"); 

const drawRigorChart = () => {
    const options = {
        title: "Rigor",
        hAxis: {
            title:"Input (a.k.a. Work)",
            format:"decimal"
        },
        vAxis: {
            title:"Certainty",
            format:"decimal"
        }
    };
    var data = [
        ['X','Y']
    ]
    var rigorSlider = document.getElementById('rigorSlider');

    var rigorSliderValue = rigorSlider.noUiSlider.get()
    var currentRigor = rigorSliderValue / 100;
    var currentRigority = - Math.log(currentRigor)

    // var rigor = (100 - rigorSlider.noUiSlider.get());

    // var lnRigor = Math.log10(rigor)
    // var lnRigor = Math.log(rigor)

    for (var rr=1;rr<200;rr++) {
        var input = rr/100;
        var exponent = - input * currentRigority
        var fooA = Math.exp(exponent);
        var certainty = (1 - fooA) * 100
        // var exponent = - (input) * lnRigor
        data.push([input,certainty])
    }

    const RigorChart = () => {
        return (
            <>
                <Chart
                    chartType="LineChart"
                    data={data}
                    options={options}
                    width={"600px"}
                    height={"200px"}
                />
            </>
        );
    };

    render(<RigorChart />, document.getElementById("rigorChartContainer"));
}

export default class GrapevineVisualControlPanelBasicTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compScoreDisplayPanelData: this.props.compScoreDisplayPanelData
        }
    }

    async componentDidMount() {
        const updateRigor = () => {
            var rigorValue = rigorSlider.noUiSlider.get();
            var rigorValue = rigorValue / 100;
            this.props.rigorSliderCallback(rigorValue);
            jQuery("#rigorValueContainer").html(rigorValue)
        }
        var rigorSlider = document.getElementById('rigorSlider');
        // var starterValue1 = window.grapevine.starterRigor;
        var starterValueRigor = this.props.compScoreDisplayPanelData.rigor * 100;
        noUiSlider.create(rigorSlider, {
            start: starterValueRigor,
            step: 1,
            range: {
                'max': 100,
                "min": 0
            }
        });
        rigorSlider.noUiSlider.on("update",updateRigor)
        rigorSlider.noUiSlider.on("update",drawRigorChart)

        drawRigorChart();
    }
    render() {
        return (
            <>
                <div style={{textAlign:"left"}}>
                    <div style={{textAlign:"center"}}>

                        <div style={{backgroundColor:"#CFCFCF",marginTop:"10px"}}>
                            <div style={{textAlign:"left",marginTop:"10px",fontSize:"12px"}} >
                                Currently if either the Rigor of the Default Confidence is changed, then the other variable is also changed
                                in a manner so that for an unvetted user, eht Confidence (set by the user) and the Certainty (calculated using the Rigor Equation)
                                are equal. If Confidence goes up, Rigor goes down, and vice versa.
                            </div>
                            Decouple Rigor
                            <select id="decoupleRigorFromConfidenceForDefaultsSelector" >
                                <option value="couple" >no, leave coupled</option>
                                <option value="uncouple" >yes, uncouple</option>
                            </select>
                        </div>

                        <div style={{backgroundColor:"#CFCFCF",marginTop:"10px"}}>
                            <div style={{textAlign:"left",marginTop:"10px",fontSize:"12px"}}>
                                Rigor is a parameter in the equation that controls the relationship between the Input (a.k.a. "Work")
                                and the Certainty of any composite score. Currently, the value for Rigor is the same for every composite score type,
                                although we may make it possible in the future to use different values for different composite score types.
                            </div>

                            <div style={{display:"inline-block",border:"1px solid black",borderRadius:"5px",width:"300px",padding:"5px"}}>
                                <div style={{fontSize:"14px",marginLeft:"5px"}} >
                                    rigor:
                                </div>
                                <div style={{marginTop:"10px"}}>
                                    <div id="rigorValueContainer" style={{display:"inline-block",width:"30px",marginLeft:"10px"}} ></div>
                                    <div id="rigorSlider" style={{display:"inline-block",width:"200px",marginLeft:"20px",backgroundColor:"green"}} ></div>
                                </div>
                            </div>
                            <div id="rigorChartContainer" style={{width:"600px",height:"200px",backgroundColor:"#CFCFCF",marginTop:"10px"}}></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
