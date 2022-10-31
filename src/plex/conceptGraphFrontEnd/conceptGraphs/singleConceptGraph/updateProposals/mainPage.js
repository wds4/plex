import React from "react";
import Masthead from '../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/cgFe_singleConceptGraph_updates_leftNav2';

const jQuery = require("jquery");

export default class ConceptGraphsFrontEndSingleConceptGraphUpdateProposals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
        }
    }
    componentDidMount() {
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
                        <div class="h2">Update Proposals for this Concept Graph</div>
                    </div>
                </fieldset>
            </>
        );
    }
}
