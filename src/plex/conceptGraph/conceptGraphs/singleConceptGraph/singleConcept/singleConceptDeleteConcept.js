import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleConcept_leftNav2.js';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

export default class SingleConceptDelete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
                        <div class="h2">Single Concept: Delete Concept</div>
                        0. find main concept graph schema; from this, select all concepts; from this, select main schema and property schema of each concept
                        <br/>
                        1. Select main schema and property schema of this concept
                        <br/>
                        2. make List of all words in these 2 schemas
                        <br/>
                        3. remove from List any words that are directly present within main schema or property schema of any other concept in this concept graph
                        <br/>
                        4. remove from List any words directly present within main concept graph schema
                        <br/>
                        5. delete words on List from the Concept Graph, including main schema and property schema 
                    </div>
                </fieldset>
            </>
        );
    }
}
