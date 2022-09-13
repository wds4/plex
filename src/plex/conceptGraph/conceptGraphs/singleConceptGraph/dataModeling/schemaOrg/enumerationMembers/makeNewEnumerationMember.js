import React from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../../navbars/leftNavbar2/singleConceptGraph_schemaOrg_enumerationMembers_leftNav2.js';
import ReactJSONSchemaOldForm from 'react-jsonschema-form';
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import * as MiscFunctions from '../../../../../../functions/miscFunctions.js';
import sendAsync from '../../../../../../renderer.js';

const jQuery = require("jquery");

export default class MakeNewEnumerationMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

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
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Make New Enumeration Member</div>

                    </div>
                </fieldset>
            </>
        );
    }
}
