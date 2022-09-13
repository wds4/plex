import React from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleConceptGraph_templating_leftNav2.js';
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");

export default class EditTemplateSettingsForConcept extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var concept_wordSlug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;
        var oConcept = window.lookupWordBySlug[concept_wordSlug];
        var templatable = false;
        var aPrimaryFields = [];
        var aDependentFields = [];
        if (oConcept.conceptData.hasOwnProperty("templating")) {
            templatable = oConcept.conceptData.templating.templatable
            aPrimaryFields = oConcept.conceptData.templating.primaryFields
            aDependentFields = oConcept.conceptData.templating.dependentFields
        }
        jQuery("#isThisConceptTemplatable").html(templatable)
        if (templatable) {

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
                        <div class="h2">Edit Template Settings For Concept</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>
                        <div class="h3" >{window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].title}</div>

                        <div>
                            Templatable: <div id="isThisConceptTemplatable" style={{display:"inline-block"}}>isThisConceptTemplatable</div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
