import React from "react";
import ConceptGraphMasthead from '../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/neuroCore_leftNav2.js';
import SyncPatternActionTables from './controlPanelActions/syncPatternActionTables.js'
import RecreateRunActionsOneTime from './controlPanelActions/recreate_runActionsOneTime.js'
import RecreatePatternsS1n from './controlPanelActions/recreate_patterns-s1n.js'
import sendAsync from '../../../renderer.js';
const jQuery = require("jquery"); 
const electronFs = window.require('fs');

export default class NeuroCoreSettingsControlPanel extends React.Component {
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
                    <div class="h2">NeuroCore Control Panel</div>
                    <RecreateRunActionsOneTime />
                    <RecreatePatternsS1n />
                    <SyncPatternActionTables />
                </div>
            </fieldset>
          </>
        );
    }
}
