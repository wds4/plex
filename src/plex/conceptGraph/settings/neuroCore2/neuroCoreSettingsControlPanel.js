import React from "react";
import ConceptGraphMasthead from '../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/neuroCore2_leftNav2.js';
import RecreateExecuteSingleAction from './controlPanelActions/recreate_executeSingleAction.js'
import RecreatePatternsS1n from './controlPanelActions/recreate_patterns-s1n.js'
import sendAsync from '../../../renderer.js';
const jQuery = require("jquery");
const electronFs = window.require('fs');

export default class NeuroCore2SettingsControlPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
    }
    render() {
        return (
          <>
            <fieldset className="mainBody" >
                <LeftNavbar1 />
                <LeftNavbar2 />
                <div className="mainPanel" >
                    <ConceptGraphMasthead />
                    <div class="h2">NeuroCore 0.2 Control Panel</div>
                    <RecreateExecuteSingleAction />
                    <RecreatePatternsS1n />
                </div>
            </fieldset>
          </>
        );
    }
}
