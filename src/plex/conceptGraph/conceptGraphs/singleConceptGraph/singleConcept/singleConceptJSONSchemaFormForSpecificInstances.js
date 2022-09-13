import React from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleConcept_specificInstances_leftNav2.js';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import ReactJSONSchemaForm from 'react-jsonschema-form';
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");

const uiSchema = {
    address: { 'ui:widget': 'hidden' },
}

const onFormSubmit = ({formData}, e) => {
    var sFormData = JSON.stringify(formData,null,4);
    // console.log("sFormData: "+sFormData)
    var oUpdatedSpecificInstance = JSON.parse(sFormData);

    var currentSpecificInstanceSlug = jQuery("#currentSpecificInstanceSlugContainer").html()
    var oSpecificInstance_unedited = window.lookupWordBySlug[currentSpecificInstanceSlug]

    oUpdatedSpecificInstance = MiscFunctions.extendWithOrdering(oSpecificInstance_unedited,oUpdatedSpecificInstance);
    // console.log("oUpdatedSpecificInstance: "+JSON.stringify(oUpdatedSpecificInstance,null,4))
    MiscFunctions.createOrUpdateWordInAllTables(oUpdatedSpecificInstance)

    /*
    // reorder top level properties
    var conceptSlug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;
    var oConcept = window.lookupWordBySlug[conceptSlug]
    var propertyPath = oConcept.conceptData.propertyPath;
    var aTopLevelProperties = ["wordData",propertyPath,"_REMAINDER_","globalDynamicData","metaData"]
    oUpdatedSpecificInstance = MiscFunctions.reorderTopLevelProperties(oUpdatedSpecificInstance,aTopLevelProperties)
    var sWordToUpdate = JSON.stringify(oUpdatedSpecificInstance,null,4);
    console.log("sWordToUpdate: "+sWordToUpdate)
    // MiscFunctions.createOrUpdateWordInAllTables(oWordToUpdate)
    */
}

const onFormChange = async ({formData}, e) => {
    var sFormData = JSON.stringify(formData,null,4);
    // console.log("onFormChange; sFormData: "+sFormData)
}

function createReactJsonSchemaForm(specificInstance_slug) {
    var currentConcept_slug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;
    var oConcept = window.lookupWordBySlug[currentConcept_slug];
    var jsonSchema_slug = oConcept.conceptData.nodes.JSONSchema.slug;
    var oJSONSchema = window.lookupWordBySlug[jsonSchema_slug];
    var oSpecificInstance = window.lookupWordBySlug[specificInstance_slug]

    jQuery("#currentSpecificInstanceSlugContainer").html(specificInstance_slug)

    ReactDOM.render(
        <>
        <ReactJSONSchemaForm
            schema={oJSONSchema}
            formData={oSpecificInstance}
            onSubmit={onFormSubmit}
            onChange={onFormChange}
            omitExtraData
            />
            <div style={{fontSize:"10px"}}>
            Click Submit to update a preexisting Specific Instance in SQL<br/>
            To store a new Specific Instance in SQL, use the add button on the left panel.
            </div>
        </>,
        document.getElementById('jsonSchemaFormContainer')
    )
}

export default class SingleConceptAllSpecificInstancesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSpecificInstanceSlug: null,
            specificInstanceLinks: []
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var thisPageTableName = "unknown";
        var currCgID = window.currentConceptGraphSqlID;
        if (window.aLookupConceptGraphInfoBySqlID.hasOwnProperty(currCgID)) {
            thisPageTableName = ""+window.aLookupConceptGraphInfoBySqlID[currCgID].tableName;
        }

        var conceptSlug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;
        var oConcept = window.lookupWordBySlug[conceptSlug];
        var supersetSlug = oConcept.conceptData.nodes.superset.slug;
        var oSuperset = window.lookupWordBySlug[supersetSlug];
        var aSpecificInstances = [];
        try {
            aSpecificInstances = oSuperset.globalDynamicData.specificInstances;
            if (!aSpecificInstances) { aSpecificInstances = [] }
        } catch (e) {}
        aSpecificInstances = aSpecificInstances.sort();
        var numSpecificInstances = aSpecificInstances.length;
        var tableDataSet = [];
        for (var s=0;s<numSpecificInstances;s++) {
            var nextRow_slug = aSpecificInstances[s];
            var oNextSpecificInstance = window.lookupWordBySlug[nextRow_slug]
            var nextRow_name = oNextSpecificInstance.wordData.name;

            var nextSpecificInstanceHTML = "";
            nextSpecificInstanceHTML += "<div class='specificInstanceButton' ";
            nextSpecificInstanceHTML += " data-slug='"+nextRow_slug+"' ";
            nextSpecificInstanceHTML += " >";
            nextSpecificInstanceHTML += nextRow_name;
            nextSpecificInstanceHTML += "</div>";
            jQuery("#conceptsListContainer").append(nextSpecificInstanceHTML)

            // create links to individual view / edit existing wordType page
            var oRowData = {};
            oRowData.pathname = "/SingleConceptSingleSpecificInstance/"+nextRow_slug;
            oRowData.name = nextRow_name;
            oRowData.slug = nextRow_slug;
            oRowData.linkFrom = "linkFrom_"+nextRow_slug
            this.state.specificInstanceLinks.push(oRowData)
            this.state.activeSpecificInstanceSlug = nextRow_slug
            if (s==0) {
                createReactJsonSchemaForm(nextRow_slug)
            }
        }
        jQuery(".specificInstanceButton").click(function(){
            var specificInstance_slug = jQuery(this).data("slug");
            console.log("specificInstance_slug: "+specificInstance_slug)
            createReactJsonSchemaForm(specificInstance_slug)
            jQuery(".specificInstanceButton").css("background-color","#EFEFEF")
            jQuery(this).css("background-color","yellow")
        })
    }
    render() {
        var currentConcept_slug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;
        var oConcept = window.lookupWordBySlug[currentConcept_slug];
        var jsonSchema_slug = oConcept.conceptData.nodes.JSONSchema.slug;
        var oJSONSchema = window.lookupWordBySlug[jsonSchema_slug];
        var specificInstance_slug = this.state.specificInstanceLinks;
        var oSpecificInstance = window.lookupWordBySlug[specificInstance_slug]
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Edit Specific Instance via JSON Schema Form</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>
                        <div class="h3" >{window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug}</div>
                        <div style={{marginTop:"20px"}}>

                            <div className="standardDoubleColumn" style={{fontSize:"12px",width:"500px"}} >
                                <div id="conceptsListContainer" style={{marginLeft:"20px"}}></div>
                            </div>

                            <div className="standardDoubleColumn" style={{fontSize:"12px",width:"650px"}} >
                                <center>
                                    <div id="currentSpecificInstanceSlugContainer" >currentSpecificInstanceSlugContainer</div>
                                </center>
                                <div id="jsonSchemaFormContainer" style={{width:"600px",display:"inline-block",textAlign:"left"}} >
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
