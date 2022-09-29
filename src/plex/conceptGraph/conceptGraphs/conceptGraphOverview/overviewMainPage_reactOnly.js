import React from "react";
import ConceptGraphMasthead from '../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/conceptGraphs_leftNav2.js';
import * as MiscFunctions from '../../../functions/miscFunctions.js';
import * as CGOverviewHTMLFunctions from './functions/conceptGraphOverviewHTMLFunctions.js';
import * as CGOverviewFunctions from './functions/conceptGraphOverviewFunctions.js';
import * as CompactFileFormattingFunctions from './functions/translateBetweenCompactFileFormats.js';
import sendAsync from '../../../renderer.js';

const jQuery = require("jquery");

export default class SingleConceptGraphOverviewMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" style={{backgroundColor:"#CFCFCF"}} >
                        <ConceptGraphMasthead />
                        <div class="h2">QuikCreate: Concept Graph Overview</div>
                        <div class="h3">React only (without jQuery)</div>

                    </div>
                </fieldset>
            </>
        );
    }
}
