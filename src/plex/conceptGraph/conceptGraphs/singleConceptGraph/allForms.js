import React from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/singleConceptGraph_leftNav2.js';
import ReactJSONSchemaForm from 'react-jsonschema-form';
import sendAsync from '../../../renderer.js';

const jQuery = require("jquery");

const onFormSubmit = ({formData}, e) => {
    var sFormData = JSON.stringify(formData,null,4);
    console.log("onFormSubmit; sFormData: "+sFormData)
}
const onFormChange = ({formData}, e) => {
    var sFormData = JSON.stringify(formData,null,4);
    console.log("onFormChange; sFormData: "+sFormData)
}

export default class AllForms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var conceptGraphMainSchemaSlug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug;
        var oConceptGraphMainSchema = window.lookupWordBySlug[conceptGraphMainSchemaSlug]
        var aConcepts = [];
        if (oConceptGraphMainSchema.hasOwnProperty("conceptGraphData")) {
            aConcepts = oConceptGraphMainSchema.conceptGraphData.concepts;
        }
        var numConcepts = aConcepts.length;
        // console.log("numConcepts: "+numConcepts)
        for (var c=0;c<numConcepts;c++) {
            var nextConceptSlug = aConcepts[c];
            // console.log("nextConceptSlug: "+nextConceptSlug)
            var oNextConcept = window.lookupWordBySlug[nextConceptSlug];

            try {
                var nextConcept_singular = oNextConcept.conceptData.name.singular;
                var nextConcept_plural = oNextConcept.conceptData.name.plural;
                var nextConcept_propertyPath = oNextConcept.conceptData.propertyPath;

                var nextSupersetSlug = oNextConcept.conceptData.nodes.superset.slug;
                // console.log("nextSupersetSlug: "+nextSupersetSlug)
                var oNextSuperset = window.lookupWordBySlug[nextSupersetSlug];

                var nextJSONSchemaSlug = oNextConcept.conceptData.nodes.JSONSchema.slug;
                var oJSONSchema = window.lookupWordBySlug[nextJSONSchemaSlug];

                var aSpecificInstances = oNextSuperset.globalDynamicData.specificInstances;
                var numSpecificInstances = aSpecificInstances.length;
                var nextConceptHTML = "";
                nextConceptHTML += "<div style='border:1px dashed grey;display:inline-block;width:400px;height:600px;overflow:scroll;padding:10px;' >";

                nextConceptHTML += "<div style='width:100px;text-align:right;display:inline-block;font-size:12px;' >";
                nextConceptHTML += "singular: ";
                nextConceptHTML += "</div>";

                nextConceptHTML += "<div style='text-align:left;margin-left:10px;display:inline-block;font-size:20px;' >";
                nextConceptHTML += nextConcept_singular;
                nextConceptHTML += "<div class=doSomethingButton_small id='linkToConcept_"+nextConceptSlug+"' >linkToConcept_</div>";
                nextConceptHTML += "</div>";

                nextConceptHTML += "<br>";

                nextConceptHTML += "<div style='width:100px;text-align:right;display:inline-block;font-size:12px;' >";
                nextConceptHTML += "plural: ";
                nextConceptHTML += "</div>";

                nextConceptHTML += "<div style='text-align:left;margin-left:10px;display:inline-block;font-size:20px;' >";
                nextConceptHTML += nextConcept_plural;
                nextConceptHTML += "</div>";

                nextConceptHTML += "<br>";

                nextConceptHTML += "<div style='height:100px;overflow:scroll;border:1px solid black;padding:10px;background-color:white;' >";
                for (var s=0;s<numSpecificInstances;s++) {
                    var nextSpecificInstance_slug = aSpecificInstances[s];
                    var oNextSpecificInstance = window.lookupWordBySlug[nextSpecificInstance_slug];
                    var nextSpecificInstance_name = oNextSpecificInstance[nextConcept_propertyPath].name;
                    nextConceptHTML += nextSpecificInstance_name;
                    nextConceptHTML += "<div class=doSomethingButton_small id='linkToSpecificInstance_"+nextSpecificInstance_slug+"' >linkToSpecificInstance_</div>";
                    nextConceptHTML += "<br>";
                }
                nextConceptHTML += "</div>";

                nextConceptHTML += "<br>";

                nextConceptHTML += "<div id='formContainer_"+nextConcept_singular+"'  ></div>";

                nextConceptHTML += "</div>";
                jQuery("#allFormsContainer").append(nextConceptHTML)

                ReactDOM.render(<ReactJSONSchemaForm schema={oJSONSchema} onSubmit={onFormSubmit} onChange={onFormChange}  />,
                    document.getElementById("formContainer_"+nextConcept_singular)
                )
            } catch (e) {
                var nextConceptHTML = "";
                nextConceptHTML += "<div style='border:1px dashed grey;display:inline-block;width:400px;height:600px;overflow:scroll;padding:10px;' >";
                nextConceptHTML += nextConceptSlug
                nextConceptHTML += "<br>";
                nextConceptHTML += e;
                nextConceptHTML += "</div>";
                jQuery("#allFormsContainer").append(nextConceptHTML)
            }
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
                        <div class="h2">All JSON Schema Forms (one for each concept)</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug}</div>

                        <div id="allFormsContainer"></div>
                    </div>

                </fieldset>
            </>
        );
    }
}
