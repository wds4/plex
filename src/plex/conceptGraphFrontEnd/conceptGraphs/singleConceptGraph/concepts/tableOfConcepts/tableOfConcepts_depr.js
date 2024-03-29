import React from "react";
import Masthead from '../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/cgFe_concepts_leftNav2';

const jQuery = require("jquery");

export default class TableOfConcepts extends React.Component {
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
                        <Masthead />
                        <div class="h2">Table of Concepts</div>
                        <div>Concepts table derived from the local Mutable File System</div>
                    </div>
                </fieldset>
            </>
        );
    }
}
