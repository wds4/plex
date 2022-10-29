import React from 'react';
import Masthead from '../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/cgFe_conceptGraphsMainPage_leftNav2';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js';
// import * as MiscFunctions from '../../functions/miscFunctions.js';
// import * as InitDOMFunctions from '../../functions/transferSqlToDOM.js';

const jQuery = require("jquery");

export default class ConceptGraphsFrontEndMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title
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
                    <LeftNavbar2 viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                    <div className="mainPanel" >
                        <Masthead viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                        <div class="h2">Concept Graphs Main Page (front end)</div>

                    </div>
                </fieldset>
            </>
        );
    }
}
