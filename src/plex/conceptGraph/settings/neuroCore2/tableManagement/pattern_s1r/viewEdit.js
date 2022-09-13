import React from "react";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/neuroCore2_patterns_s1r_leftNav2.js';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");

export default class ViewEditPatternS1r extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actionSlug: null
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
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">NeuroCore 0.2: View Edit Pattern (s1r)</div>
                        <div id="allInputFieldsContainer" style={{marginTop:"20px"}} >

                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
