import React from "react";
import ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import noUiSlider from "nouislider";
import "nouislider/distribute/nouislider.min.css";
import UsersTab from './usersTab/usersTab.js'
import DisplayTab from './displayTab/displayTab.js'
import DefenseTab from './defenseTab/defenseTab.js'

const jQuery = require("jquery");

export default class GrapevineVisualControlPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
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
                        <Tab>Defense</Tab>
                    </TabList>

                    <TabPanel>
                        <UsersTab/ >
                    </TabPanel>
                    <TabPanel>
                        <DisplayTab/ >
                    </TabPanel>
                    <TabPanel>
                        <DefenseTab/ >
                    </TabPanel>
                </Tabs>
            </>
        );
    }
}
