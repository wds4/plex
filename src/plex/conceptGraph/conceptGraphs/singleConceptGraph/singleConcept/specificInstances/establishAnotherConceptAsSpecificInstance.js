import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/singleConcept_specificInstances_leftNav2.js';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import ReactJSONSchemaForm from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");

const makeSubsetOfSelector = (oConcept) => {
    var selectorPanelHTML = "";

    var supersetSlug = oConcept.conceptData.nodes.superset.slug;
    var oSuperset = window.lookupWordBySlug[supersetSlug];

    selectorPanelHTML += "<input class=subsetOfCheckbox data-slug='"+supersetSlug+"' id='subsetOfCheckbox_"+nextSet+"' type=checkbox checked name=setCheckbox ></input> ";
    selectorPanelHTML += supersetSlug;
    selectorPanelHTML += "<br>";

    var aSets = oSuperset.globalDynamicData.subsets
    var numSets = aSets.length;
    for (var s=0;s<numSets;s++) {
        var nextSet = aSets[s];

        selectorPanelHTML += "<input class=subsetOfCheckbox data-slug='"+nextSet+"' id='subsetOfCheckbox_"+nextSet+"' type=checkbox name=setCheckbox ></input> ";
        selectorPanelHTML += nextSet;
        selectorPanelHTML += "<br>";
    }
    jQuery("#newSetSubsetOfSelectorContainer_si").html(selectorPanelHTML)
}

export default class EstablishAnotherConceptAsSpecificInstance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var conceptSlug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;
        var oConcept = window.lookupWordBySlug[conceptSlug]

        var schema_slug = oConcept.conceptData.nodes.schema.slug;
        var oSchema = window.lookupWordBySlug[schema_slug]
        var sSchema = JSON.stringify(oSchema,null,4)
        jQuery("#schemaTextarea_unedited").val(sSchema);

        makeSubsetOfSelector(oConcept)
    }
    render() {
        var currentConcept_slug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;
        var oConcept = window.lookupWordBySlug[currentConcept_slug];
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Establish Another Concept as a Specific Instance of this one</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>
                        <div class="h3" >{window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug}</div>

                        <div className="standardDoubleColumn" style={{border:"1px dashed grey"}}>
                            <center>Specific Instance Of:</center>
                            <br/>
                            <div id="newSetSubsetOfSelectorContainer_si" style={{display:"inline-block",marginLeft:"20px"}}>
                            </div>

                            <br/>
                            <textarea id="schemaTextarea_unedited" style={{width:"600px",height:"300px"}}></textarea>
                            <br/>
                            <textarea id="schemaTextarea_edited" style={{width:"600px",height:"300px"}}></textarea>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
