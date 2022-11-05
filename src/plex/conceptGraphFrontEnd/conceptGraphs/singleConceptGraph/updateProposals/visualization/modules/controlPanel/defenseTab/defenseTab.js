import React from "react";
import ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import * as MiscFunctions from '../../../../../../../../functions/miscFunctions.js';
import noUiSlider from "nouislider";
import "nouislider/distribute/nouislider.min.css";
import Mod1Tab from './defenseMod1Tab.js'
import Mod2Tab from './defenseMod2Tab.js'
import Mod3Tab from './defenseMod3Tab.js'

const jQuery = require("jquery");


export default class GrapevineVisualControlPanelDefenseTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compScoreDisplayPanelData: this.props.compScoreDisplayPanelData
        }
    }

    handleMod1Callback = (newMod1Factor) =>{
        console.log("defenseTab page; newMod1Factor: "+newMod1Factor)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.strat1Coeff = newMod1Factor
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        this.props.mod1SliderCallback(newMod1Factor)
    }

    handleMod2Callback = (newMod2Factor) =>{
        console.log("defenseTab page; newMod2Factor: "+newMod2Factor)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.strat2Coeff = newMod2Factor
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        this.props.mod2SliderCallback(newMod2Factor)
    }

    handleMod3Callback = (newMod3Factor) =>{
        console.log("defenseTab page; newMod3Factor: "+newMod3Factor)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.strat3Coeff = newMod3Factor
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        this.props.mod3SliderCallback(newMod3Factor)
    }

    handleMod4Callback = (newMod4Factor) =>{
        console.log("defenseTab page; newMod4Factor: "+newMod4Factor)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.strat4Coeff = newMod4Factor
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        this.props.mod4SliderCallback(newMod4Factor)
    }

    handleMod5Callback = (newMod5Factor) =>{
        console.log("defenseTab page; newMod5Factor: "+newMod5Factor)
        var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        compScoreDisplayPanelData_new.strat5Coeff = newMod5Factor
        this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        this.props.mod5SliderCallback(newMod5Factor)
    }

    async componentDidMount() {

    }

    render() {
        return (
            <>
                <Tabs>
                    <TabList>
                        <Tab>Mod 1</Tab>
                        <Tab>Mod 2</Tab>
                        <Tab>Mod 3</Tab>
                    </TabList>

                    <TabPanel>
                        <Mod1Tab
                            compScoreDisplayPanelData={this.props.compScoreDisplayPanelData}
                            mod1SliderCallback = {this.handleMod1Callback}
                        />
                    </TabPanel>
                    <TabPanel>
                        <Mod2Tab
                            compScoreDisplayPanelData={this.props.compScoreDisplayPanelData}
                            mod2SliderCallback = {this.handleMod2Callback}
                        />
                    </TabPanel>
                    <TabPanel>
                        <Mod3Tab
                            compScoreDisplayPanelData={this.props.compScoreDisplayPanelData}
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
