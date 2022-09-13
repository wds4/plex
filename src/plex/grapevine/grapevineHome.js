import React from 'react';
import ConceptGraphMasthead from '../mastheads/conceptGraphMasthead.js';
import GrapevineMasthead from '../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../navbars/leftNavbar1/grapevine_leftNav1';
// import * as MiscFunctions from '../functions/miscFunctions.js';

const jQuery = require("jquery");

export default class GrapevineHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");
        console.log("the Grapevine Home")
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <GrapevineMasthead />
                        <div class="h2">The Grapevine Home!</div>
                    </div>
                </fieldset>
            </>
        );
    }
}
