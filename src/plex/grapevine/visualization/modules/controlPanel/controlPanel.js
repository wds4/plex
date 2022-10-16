import React from "react";
import ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import noUiSlider from "nouislider";
import "nouislider/distribute/nouislider.min.css";
import UsersTab from './usersTab/usersTab.js'
import DisplayTab from './displayTab/displayTab.js'
import BasicTab from './basicTab/basicTab.js'
import DefenseTab from './defenseTab/defenseTab.js'

const jQuery = require("jquery");

export default class GrapevineVisualControlPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compScoreDisplayPanelData: {
                attenuationFactor: null,
                rigor: null,
                defaultUserTrustAverageScore: null,
                defaultUserTrustConfidence: null
            },
        }
    }

    handleUserTrustAverageScoreCallback = (newUserTrustAverageScore) =>{
        // console.log("handleUserTrustAverageScoreCallback; newUserTrustAverageScore: "+newUserTrustAverageScore)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.defaultUserTrustAverageScore = newUserTrustAverageScore
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        this.props.userTrustAverageScoreSliderCallback(newUserTrustAverageScore)
    }

    handleUserTrustConfidenceCallback = (newUserTrustConfidence) =>{
        console.log("control panel page; newUserTrustConfidence: "+newUserTrustConfidence)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.defaultUserTrustConfidence = newUserTrustConfidence
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        this.props.userTrustConfidenceSliderCallback(newUserTrustConfidence)
    }

    handleRigorCallback = (newRigor) =>{
        console.log("control panel page; newRigor: "+newRigor)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.rigor = newRigor
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        this.props.rigorSliderCallback(newRigor)
    }

    async componentDidMount() {
        var attenuationSlider = document.getElementById('attenuationSlider');
        noUiSlider.create(attenuationSlider, {
            start: 90,
            range: {
                'max': 100,
                "min": 0
            }
        });
    }
    render() {
        return (
            <>
                <Tabs>
                    <TabList>
                        <Tab>Users</Tab>
                        <Tab>Display</Tab>
                        <Tab>Basic</Tab>
                        <Tab>Defense</Tab>
                    </TabList>

                    <TabPanel>
                        defaultUserTrustAverageScore: {this.state.compScoreDisplayPanelData.defaultUserTrustAverageScore}
                        <UsersTab
                            compScoreDisplayPanelData={this.props.compScoreDisplayPanelData}
                            userTrustAverageScoreSliderCallback = {this.handleUserTrustAverageScoreCallback}
                            userTrustConfidenceSliderCallback = {this.handleUserTrustConfidenceCallback}
                        / >
                    </TabPanel>
                    <TabPanel>
                        <DisplayTab />
                    </TabPanel>
                    <TabPanel>
                        <BasicTab
                            rigorSliderCallback = {this.handleRigorCallback}
                        />
                    </TabPanel>
                    <TabPanel>
                        <DefenseTab />
                    </TabPanel>
                </Tabs>
            </>
        );
    }
}
