import React from 'react';
import ConceptGraphMasthead from '../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../navbars/leftNavbar1/conceptGraph_leftNav1';
// import * as MiscFunctions from '../functions/miscFunctions.js';

const jQuery = require("jquery");

export default class DecentralizedProofOfPersonhoodHome extends React.Component {
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
                        <ConceptGraphMasthead />
                        <div class="h2">decentralized Proof of Personhood Home</div>
                    </div>
                </fieldset>
            </>
        );
    }
}
