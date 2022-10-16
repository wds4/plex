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

    var rigor = (100 - rigorSlider.noUiSlider.get());
    // var lnRigor = Math.log10(rigor)
    var lnRigor = Math.log(rigor)

    for (var rr=1;rr<200;rr++) {
        var input = rr/100;

        var exponent = - (input) * lnRigor

        var fooA = Math.exp(exponent);
        var certainty = 100 * (1 - fooA)
        data.push([input,certainty])
    }

    const RigorChart = () => {
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

    render(<RigorChart />, document.getElementById("rigorChartContainer"));
}

export default class GrapevineVisualControlPanelBasicTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultRigor: null
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
        var starterValue1 = window.grapevine.starterRigor;
        noUiSlider.create(rigorSlider, {
            start: starterValue1,
            step: 1,
            range: {
                'max': 100,
                "min": 0
            }
        });
        rigorSlider.noUiSlider.on("update",updateRigor)
        rigorSlider.noUiSlider.on("change",drawRigorChart)

        drawRigorChart();
    }
    render() {
        return (
            <>
                <div style={{textAlign:"left"}}>
                    <div style={{textAlign:"center"}}>
                        <div style={{display:"inline-block",border:"1px solid black",borderRadius:"5px",width:"300px",padding:"5px"}}>
                            <div style={{fontSize:"14px",marginLeft:"5px"}} >
                                rigor:
                            </div>
                            <div style={{marginTop:"10px"}}>
                                <div id="rigorValueContainer" style={{display:"inline-block",width:"30px",marginLeft:"10px"}} ></div>
                                <div id="rigorSlider" style={{display:"inline-block",width:"200px",marginLeft:"20px",backgroundColor:"green"}} ></div>
                            </div>
                        </div>

                        <div style={{fontSize:"12px"}}>
                            <div style={{textAlign:"left",marginTop:"10px"}}>
                                Rigor is a parameter in the equation that controls the relationship between the Input (a.k.a. "Work")
                                and the Certainty of any composite score. Currently, the value for Rigor is the same for every composite score type,
                                although we may make it possible in the future to use different values for different composite score types.
                            </div>
                        </div>

                        <div id="rigorChartContainer" style={{width:"500px",height:"200px",backgroundColor:"#CFCFCF",marginTop:"10px"}}></div>

                    </div>
                </div>
            </>
        );
    }
}
