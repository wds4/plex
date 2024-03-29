import React from 'react';
import { NavLink, Link } from "react-router-dom";
import Masthead from '../mastheads/eBooksMasthead.js';
import LeftNavbar1 from '../navbars/leftNavbar1/eBooks_leftNav1';
// import * as MiscFunctions from '../functions/miscFunctions.js';

const jQuery = require("jquery");

export default class EBooksHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");
        console.log("decentralized Twitter Home")
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">eBooks Home</div>

                    </div>
                </fieldset>
            </>
        );
    }
}
