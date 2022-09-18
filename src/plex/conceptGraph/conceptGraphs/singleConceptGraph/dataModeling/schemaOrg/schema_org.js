import React from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/singleConceptGraph_schemaOrg_leftNav2.js';
import ReactJSONSchemaOldForm from 'react-jsonschema-form';
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");

export default class DataModelingSchemaOrg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        // var dataModel_wordSlug = "dataModel_schema.org_fu88nw";
        var dataModel_wordSlug = "wordTypeFor_typesGraph";
        var oDataModel = window.lookupWordBySlug[dataModel_wordSlug];
        jQuery("#dataModelRawFileContainer").val(JSON.stringify(oDataModel,null,4))
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Schema.org Structured Data</div>

                        <div style={{display:"inline-block",width:"600px",height:"800px",border:"1px dashed grey"}} >
                            <center>The Schema.org Data Model</center>
                            <textarea id="dataModelRawFileContainer" style={{display:"inline-block",width:"95%",height:"700px"}} >dataModelRawFileContainer</textarea>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
