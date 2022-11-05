import React from "react";
import ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import * as MiscFunctions from '../../../../../../../functions/miscFunctions.js';
import noUiSlider from "nouislider";
import "nouislider/distribute/nouislider.min.css";
import UpdateProposalsTab from './updateProposalsTab/updateProposalsTab.js'
import UsersTab from './usersTab/usersTab.js'
import DisplayTab from './displayTab/displayTab.js'
import BasicTab from './basicTab/basicTab.js'
import DefenseTab from './defenseTab/defenseTab.js'

const jQuery = require("jquery");

export default class GrapevineVisualControlPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compScoreDisplayPanelData: this.props.compScoreDisplayPanelData
        }
    }

    handleUpdateProposalVerdictAverageScoreCallback = (newUpdateProposalVerdictAverageScore) =>{
        console.log("controlPanel; handleUpdateProposalVerdictAverageScoreCallback; newUpdateProposalVerdictAverageScore: "+newUpdateProposalVerdictAverageScore)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.defaultUpdateProposalVerdictAverageScore = newUpdateProposalVerdictAverageScore
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        this.props.updateProposalVerdictAverageScoreSliderCallback(newUpdateProposalVerdictAverageScore)
    }

    handleUpdateProposalVerdictConfidenceCallback = (newUpdateProposalVerdictConfidence) =>{
        console.log("control panel page; newUpdateProposalVerdictConfidence: "+newUpdateProposalVerdictConfidence)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.defaultUpdateProposalVerdictConfidence = newUpdateProposalVerdictConfidence
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        this.props.updateProposalVerdictConfidenceSliderCallback(newUpdateProposalVerdictConfidence)
    }

    handleUserTrustAverageScoreCallback = (newUserTrustAverageScore) =>{
        console.log("controlPanel; handleUserTrustAverageScoreCallback; newUserTrustAverageScore: "+newUserTrustAverageScore)
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

    handleMod1Callback = (newMod1Factor) =>{
        console.log("control panel page;; newMod1Factor: "+newMod1Factor)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.strat1Coeff = newMod1Factor
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        this.props.mod1SliderCallback(newMod1Factor)
    }

    handleMod2Callback = (newMod2Factor) =>{
        console.log("control panel page;; newMod2Factor: "+newMod2Factor)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.strat2Coeff = newMod2Factor
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        this.props.mod2SliderCallback(newMod2Factor)
    }

    handleMod3Callback = (newMod3Factor) =>{
        console.log("control panel page;; newMod3Factor: "+newMod3Factor)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.strat3Coeff = newMod3Factor
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        this.props.mod3SliderCallback(newMod3Factor)
    }

    handleMod4Callback = (newMod4Factor) =>{
        console.log("control panel page;; newMod4Factor: "+newMod4Factor)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.strat4Coeff = newMod4Factor
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        this.props.mod4SliderCallback(newMod4Factor)
    }

    handleMod5Callback = (newMod5Factor) =>{
        console.log("control panel page;; newMod5Factor: "+newMod5Factor)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.strat5Coeff = newMod5Factor
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        this.props.mod5SliderCallback(newMod5Factor)
    }

    async componentDidMount() {
        /*
        var attenuationSlider = document.getElementById('attenuationSlider');
        noUiSlider.create(attenuationSlider, {
            start: 90,
            range: {
                'max': 100,
                "min": 0
            }
        });
        */
    }
    render() {
        return (
            <>
                <Tabs>
                    <TabList>
                        <Tab>Users</Tab>
                        <Tab>Update Proposals</Tab>
                        <Tab>Display</Tab>
                        <Tab>Basic</Tab>
                        <Tab>Defense</Tab>
                    </TabList>

                    <TabPanel>
                        <UsersTab
                            compScoreDisplayPanelData={this.props.compScoreDisplayPanelData}
                            defaultUserTrustAverageScore={this.props.defaultUserTrustAverageScore}
                            userTrustAverageScoreSliderCallback = {this.handleUserTrustAverageScoreCallback}
                            userTrustConfidenceSliderCallback = {this.handleUserTrustConfidenceCallback}
                        / >
                    </TabPanel>

                    <TabPanel>
                        <UpdateProposalsTab
                            compScoreDisplayPanelData={this.props.compScoreDisplayPanelData}
                            defaultUpdateProposalVerdictAverageScore={this.props.defaultUpdateProposalVerdictAverageScore}
                            updateProposalVerdictAverageScoreSliderCallback = {this.handleUpdateProposalVerdictAverageScoreCallback}
                            updateProposalVerdictConfidenceSliderCallback = {this.handleUpdateProposalVerdictConfidenceCallback}
                        / >
                    </TabPanel>

                    <TabPanel>
                        <DisplayTab

                        />
                    </TabPanel>

                    <TabPanel>
                        <BasicTab
                            compScoreDisplayPanelData={this.props.compScoreDisplayPanelData}
                            rigorSliderCallback = {this.handleRigorCallback}
                        />
                    </TabPanel>
                    <TabPanel>
                        <DefenseTab
                            compScoreDisplayPanelData={this.props.compScoreDisplayPanelData}
                            mod1SliderCallback = {this.handleMod1Callback}
                            mod2SliderCallback = {this.handleMod2Callback}
                            mod3SliderCallback = {this.handleMod3Callback}
                            mod4SliderCallback = {this.handleMod4Callback}
                            mod5SliderCallback = {this.handleMod5Callback}
                        />
                    </TabPanel>
                </Tabs>
            </>
        );
    }
}
