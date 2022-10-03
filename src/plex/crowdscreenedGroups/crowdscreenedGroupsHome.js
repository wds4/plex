import React from 'react';
import Masthead from '../mastheads/cGroupsMasthead.js';
import LeftNavbar1 from '../navbars/leftNavbar1/cGroups_leftNav1';
// import * as MiscFunctions from '../functions/miscFunctions.js';

const jQuery = require("jquery");

export default class CrowdscreenedGroupsHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");
        console.log("decentralized Proof of Personhood Home")
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Crowdscreened Groups Home</div>
                    </div>
                </fieldset>
            </>
        );
    }
}
