import React from "react";
import ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
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
        }
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
                        <Mod1Tab />
                    </TabPanel>
                    <TabPanel>
                        <Mod2Tab />
                    </TabPanel>
                    <TabPanel>
                        <Mod3Tab />
                    </TabPanel>
                </Tabs>
            </>
        );
    }
}
