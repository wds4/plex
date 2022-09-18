import React from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/singleConceptGraph_context_leftNav2.js';
import ReactJSONSchemaOldForm from 'react-jsonschema-form';
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");

export default class DataModelingContext extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var dataModel_concept_wordSlug = "conceptFor_contextGraph_svvy7z";
        var oDataModelConcept = window.lookupWordBySlug[dataModel_concept_wordSlug];
        // var dataModel_wordSlug = "wordTypeFor_contextGraph";
        var dataModel_wordSlug = oDataModelConcept.conceptData.nodes.wordType.slug;
        var oDataModelWordType = window.lookupWordBySlug[dataModel_wordSlug];
        jQuery("#dataModelRawFileContainer").val(JSON.stringify(oDataModelWordType,null,4))
        var dataModel_superset = oDataModelConcept.conceptData.nodes.superset.slug;
        var oDataModelSuperset = window.lookupWordBySlug[dataModel_superset];
        var aContextGraphs = oDataModelSuperset.globalDynamicData.specificInstances;
        for (var z=0;z<aContextGraphs.length;z++) {
            var nextContextGraph_slug = aContextGraphs[z];
            var oNextContextGraph = window.lookupWordBySlug[nextContextGraph_slug];
            var nextContextGraph_cgName = oNextContextGraph.contextGraphData.name;
            var cgHTML = "";
            cgHTML += "<div ";
            cgHTML += " >";
            cgHTML += nextContextGraph_cgName;
            cgHTML += "</div>";
            jQuery("#contextGraphsContainer").append(cgHTML)
        }
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Context Structured Data</div>

                        <div style={{display:"inline-block",height:"800px",border:"1px dashed grey"}} >
                            <center>The Context Data Model for the Grapevine (Trust) Rating System</center>
                            <div style={{display:"inline-block",width:"600px",height:"700px",border:"1px dashed grey",padding:"10px"}} >
                                <center>Context Graphs</center>
                                <div id="contextGraphsContainer" ></div>
                            </div>
                            <textarea id="dataModelRawFileContainer" style={{display:"inline-block",width:"600px",height:"700px"}} >dataModelRawFileContainer</textarea>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
