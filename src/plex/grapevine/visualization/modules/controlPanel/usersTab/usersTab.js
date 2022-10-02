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
        }
    }
    async componentDidMount() {
        const updateUsersDefAvScore = () => {
            var usersDefAvScoreValue = usersDefAvScoreSlider.noUiSlider.get();
            var usersDefAvScoreValue = usersDefAvScoreValue / 100;
            jQuery("#usersDefaultAverageScoreValueContainer").html(usersDefAvScoreValue)
        }
        var usersDefAvScoreSlider = document.getElementById('usersDefaultAverageScoreSlider');
        noUiSlider.create(usersDefAvScoreSlider, {
            start: 10,
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
            jQuery("#usersDefaultConfidenceValueContainer").html(usersDefConfidenceValue)
        }
        var usersDefConfidenceSlider = document.getElementById('usersDefaultConfidenceSlider');
        noUiSlider.create(usersDefConfidenceSlider, {
            start: 20,
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

                    </div>
                </div>
            </>
        );
    }
}
