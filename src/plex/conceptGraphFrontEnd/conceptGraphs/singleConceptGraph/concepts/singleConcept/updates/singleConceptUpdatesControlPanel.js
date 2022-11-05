import React from "react";
import Masthead from '../../../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../../../navbars/leftNavbar2/cgFe_singleConceptUpdates_leftNav2';

const jQuery = require("jquery");

export default class ConceptGraphsFrontEndSingleConceptUpdatesControlPanel extends React.Component {
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
                        <div class="h2">Single Concept: Update Proposal Settings</div>

                        <center>
                            <div style={{textAlign:"left",display:"inline-block",marginTop:"20px"}} >
                            <center>Implementation of individual update proposals</center>
                                <div>
                                    <input type="radio" name="updateOption" value="off" /><span style={{marginLeft:"10px"}} >off</span>
                                </div>
                                <div>
                                    <input type="radio" name="updateOption" value="manual" /><span style={{marginLeft:"10px"}} >manual</span>
                                </div>
                                <div>
                                    <input type="radio" name="updateOption" value="automatic" /><span style={{marginLeft:"10px"}} >automatic: grapevine</span>
                                </div>
                                <div>
                                    <input type="radio" name="updateOption" value="link" /><span style={{marginLeft:"10px"}} >link to specific ipns</span>
                                </div>
                            </div>
                        </center>
                    </div>
                </fieldset>
            </>
        );
    }
}
