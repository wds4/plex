import React from "react";
import IpfsHttpClient from 'ipfs-http-client';
import ReactJSONSchemaForm from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import ReactDOM from 'react-dom';
import sendAsync from '../../renderer';
import * as MiscFunctions from '../../lib/miscFunctions.js';
import * as VisjsFunctions from '../../lib/visjs/visjs-functions.js';
import * as VisjsFunctions_top_eppjs from '../../lib/visjs/visjs-functions-top-eppjs.js';
import * as VisjsFunctions_bottom_eppjs from '../../lib/visjs/visjs-functions-bottom-eppjs.js';
import * as PropertyFormationFunctions from './propertyFormationFunctionsUsingRelationships.js';
import { lookupRawFileBySlug_obj, templatesByWordType_obj, insertOrUpdateWordIntoMyDictionary, insertOrUpdateWordIntoMyConceptGraph } from '../addANewConcept';
const jQuery = require("jquery");

const Form = ReactJSONSchemaForm.default;

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

function processDefinitionsWithinProperty_eppjs(property_in_rF_obj) {
    var property_out_rF_obj = MiscFunctions.cloneObj(property_in_rF_obj);

    property_out_rF_obj.definitions = {};
    var definitions_arr = [];
    var definitions_obj = {};
    // definitions_obj.definitions = {};
    if (property_out_rF_obj.propertyData.hasOwnProperty("definitions")) {
        if (property_out_rF_obj.propertyData.definitions.hasOwnProperty("indirect")) {
            definitions_arr = property_out_rF_obj.propertyData.definitions.indirect;
        }
    }
    var numDefs = definitions_arr.length;
    // console.log("processDefinitionsWithinProperty_eppjs; numDefs: "+numDefs)
    for (var d=0;d<numDefs;d++) {
        var nextDef_slug = definitions_arr[d];
        // console.log("nextDef_slug: "+nextDef_slug)
        var nextDef_rF_obj = lookupRawFileBySlug_obj[nextDef_slug];
        if (nextDef_rF_obj.hasOwnProperty("propertyData")) {
            definitions_obj[nextDef_slug] = nextDef_rF_obj.propertyData.JSONSchemaStyle.value;
        }
        if (nextDef_rF_obj.hasOwnProperty("enumerationData")) {
            definitions_obj[nextDef_slug] = nextDef_rF_obj.enumerationData.JSONSchemaStyle.value;
            definitions_obj[nextDef_slug].dependencies = nextDef_rF_obj.enumerationData.JSONSchemaStyle.dependencies;
        }
    }

    return definitions_obj;
}
export function generateFormFromProperty_eppjs(propertySlug) {
    // console.log("generateFormFromProperty_eppjs; propertySlug: "+propertySlug)

    var property_rF_obj = lookupRawFileBySlug_obj[propertySlug];

    var definitions_arr = processDefinitionsWithinProperty_eppjs(property_rF_obj);

    var property_rF_str = JSON.stringify(property_rF_obj,null,4);
    // console.log("property_rF_str: "+property_rF_str)

    var schemaFromProperty_obj = property_rF_obj.propertyData.JSONSchemaStyle.value;
    if (schemaFromProperty_obj) {
        schemaFromProperty_obj.definitions = definitions_arr;

        jQuery("#propertyFormOutput").val("")
        var formData_obj = null;
        ReactDOM.render(
            <>
            <ReactJSONSchemaForm
                schema={schemaFromProperty_obj}
                onSubmit={onFormSubmit_prop_eppjs}
                onChange={onFormChange_prop_eppjs}
                />
            </>,
            document.getElementById('jsonSchemaFormFromSelectedPropertyContainer_eppjs')
        )
    }
}

function createSchemaImportSelectors_top_eppjs() {
    var selectedPropertySchema_top_slug = jQuery("#conceptSelector_top_eppjs option:selected").data("propertyschemaslug");
    if (lookupRawFileBySlug_obj.hasOwnProperty(selectedPropertySchema_top_slug)) {
        var selectedPropertySchema_top_rF_obj = lookupRawFileBySlug_obj[selectedPropertySchema_top_slug];
        var schemaImports_arr = selectedPropertySchema_top_rF_obj.schemaData.schemaImports;
        var numSchemaImports = schemaImports_arr.length;
        console.log("createSchemaImportSelectors_top_eppjs; numSchemaImports: "+numSchemaImports)

        var selectorHTML = "";
        selectorHTML += " schema imports: ";
        selectorHTML+= "<select id=schemaImportSelector_top_eppjs >";
        for (var i=0;i<numSchemaImports;i++) {
            var nextSchemaImport_slug = schemaImports_arr[i].slug;
            selectorHTML += "<option ";
            selectorHTML += " data-slug='"+nextSchemaImport_slug+"' ";
            selectorHTML += " >";
            selectorHTML += nextSchemaImport_slug;
            selectorHTML += "</option>";
        }
        selectorHTML += "</select>";

        jQuery("#selectSchemaImportContainer_top_eppjs").html(selectorHTML);
    }
}
async function createSelectors_eppjs() {
    var currentConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected ").data("tablename");

    var sql = "";
    sql += " SELECT * FROM "+currentConceptGraph_tableName;
    sendAsync(sql).then((words_arr) => {
        var selectorHTML1 = "";
        var selectorHTML2 = "";

        selectorHTML1 += "concept: ";
        selectorHTML1 += "<select id=conceptSelector_top_eppjs >";

        selectorHTML2 += "schema: ";
        selectorHTML2 += "<select id=conceptSelector_bottom_eppjs >";

        selectorHTML2 += "<option ";
        selectorHTML2 += " data-schematodisplayslug='schemaForProperty' ";
        selectorHTML2 += " >";
        selectorHTML2 += "schemaForProperty";
        selectorHTML2 += "</option>";

        var numWords = words_arr.length;
        for (var w=0;w<numWords;w++) {
            var nextWord_str = words_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_wordTypes = nextWord_obj.wordData.wordTypes;
            var nextWord_ipns = nextWord_obj.metaData.ipns;

            if (jQuery.inArray("concept",nextWord_wordTypes) > -1) {
                var nextConcept_rF_str = nextWord_str;
                var nextConcept_rF_obj = nextWord_obj;
                var nextConcept_concept_slug = nextConcept_rF_obj.conceptData.nodes.concept.slug;
                var nextConcept_wordType_slug = nextConcept_rF_obj.conceptData.nodes.wordType.slug;
                var nextConcept_schema_slug = nextConcept_rF_obj.conceptData.nodes.schema.slug;
                var nextConcept_JSONSchema_slug = nextConcept_rF_obj.conceptData.nodes.JSONSchema.slug;
                var nextConcept_primaryProperty_slug = nextConcept_rF_obj.conceptData.nodes.primaryProperty.slug;
                var nextConcept_properties_slug = nextConcept_rF_obj.conceptData.nodes.properties.slug;
                var nextConcept_propertySchema_slug = nextConcept_rF_obj.conceptData.nodes.propertySchema.slug;
                var nextConcept_superset_slug = nextConcept_rF_obj.conceptData.nodes.superset.slug;

                var selectorHTML = "";
                selectorHTML += "<option ";
                selectorHTML += " data-conceptslug='"+nextConcept_concept_slug+"' ";
                selectorHTML += " data-wordtypeslug='"+nextConcept_wordType_slug+"' ";
                selectorHTML += " data-schemaslug='"+nextConcept_schema_slug+"' ";
                selectorHTML += " data-jsonschemaslug='"+nextConcept_JSONSchema_slug+"' ";
                selectorHTML += " data-primarypropertyslug='"+nextConcept_primaryProperty_slug+"' ";
                selectorHTML += " data-propertiesslug='"+nextConcept_properties_slug+"' ";
                selectorHTML += " data-propertyschemaslug='"+nextConcept_propertySchema_slug+"' ";
                selectorHTML += " data-supersetslug='"+nextConcept_superset_slug+"' ";
                selectorHTML += " data-schematodisplayslug='"+nextConcept_propertySchema_slug+"' ";
                selectorHTML += " >";
                selectorHTML += nextConcept_wordType_slug;
                selectorHTML += "</option>";
                selectorHTML1 += selectorHTML;

                var selectorHTML = "";
                selectorHTML += "<option ";
                selectorHTML += " data-conceptslug='"+nextConcept_concept_slug+"' ";
                selectorHTML += " data-wordtypeslug='"+nextConcept_wordType_slug+"' ";
                selectorHTML += " data-schemaslug='"+nextConcept_schema_slug+"' ";
                selectorHTML += " data-jsonschemaslug='"+nextConcept_JSONSchema_slug+"' ";
                selectorHTML += " data-primarypropertyslug='"+nextConcept_primaryProperty_slug+"' ";
                selectorHTML += " data-propertiesslug='"+nextConcept_properties_slug+"' ";
                selectorHTML += " data-propertyschemaslug='"+nextConcept_propertySchema_slug+"' ";
                selectorHTML += " data-supersetslug='"+nextConcept_superset_slug+"' ";
                selectorHTML += " data-schematodisplayslug='"+nextConcept_propertySchema_slug+"' ";
                selectorHTML += " >";
                selectorHTML += nextConcept_propertySchema_slug;
                selectorHTML += "</option>";
                selectorHTML2 += selectorHTML;
            }
        }
        selectorHTML1 += "</select>";
        selectorHTML2 += "</select>";

        jQuery("#selectConceptContainer_top_eppjs").html(selectorHTML1);
        jQuery("#selectConceptContainer_bottom_eppjs").html(selectorHTML2);

        createSchemaImportSelectors_top_eppjs();

        jQuery("#conceptSelector_top_eppjs").change(function(){
            redrawPropertySchemaGraph_top_eppjs();
        });
        // redrawPropertySchemaGraph_top_eppjs();

        jQuery("#conceptSelector_bottom_eppjs").change(function(){
            redrawPropertySchemaGraph_bottom_eppjs();
        });
        // redrawPropertySchemaGraph_bottom_eppjs();
        setTimeout(function (){
            redrawPropertySchemaGraph_top_eppjs();
            redrawPropertySchemaGraph_bottom_eppjs();
        }, 2000);
    });
}

function onFormSubmit_jsonschema_eppjs() {

}
const onFormChange_jsonschema_eppjs = ({formData}, e) => {
    var formData_str = JSON.stringify(formData,null,4);
    jQuery("#jsonSchemaFormOutput").val(formData_str)
}

function onFormSubmit_prop_eppjs() {

}
const onFormChange_prop_eppjs = ({formData}, e) => {
    var formData_str = JSON.stringify(formData,null,4);
    jQuery("#propertyFormOutput").val(formData_str)
}

// refactored from createReactJsonSchemaForm_mcis() in ManageConceptSpecificInstances.js
function createReactJsonSchemaForm_eppjs() {
    var selectedJSONSchema_slug = jQuery("#conceptSelector_top_eppjs option:selected").data("jsonschemaslug");
    // console.log("selectedJSONSchema_slug: "+selectedJSONSchema_slug)
    var jsonSchema_rF_obj = lookupRawFileBySlug_obj[selectedJSONSchema_slug];

    var jsonSchema_rF_str = JSON.stringify(jsonSchema_rF_obj,null,4);
    var formData_obj = {};
    jQuery("#jsonSchemaFormOutput").val("")
    ReactDOM.render(
        <>
        <ReactJSONSchemaForm
            schema={jsonSchema_rF_obj}
            formData={formData_obj}
            onSubmit={onFormSubmit_jsonschema_eppjs}
            onChange={onFormChange_jsonschema_eppjs}
            />
        </>,
        document.getElementById('jsonSchemaFormContainer_eppjs')
    )
}

function redrawPropertySchemaGraph_top_eppjs() {
      var propertySchema_slug = jQuery("#conceptSelector_top_eppjs option:selected").data("propertyschemaslug");
      var networkElemID = "propertySchemaTopPanelContainer_eppjs";
      VisjsFunctions_top_eppjs.makeVisGraph_propertySchema_top_eppjs(propertySchema_slug,networkElemID);
      createReactJsonSchemaForm_eppjs();

      var propertySchema_rF_obj = lookupRawFileBySlug_obj[propertySchema_slug];
      var propertySchema_rF_str = JSON.stringify(propertySchema_rF_obj,null,4);
      jQuery("#propertySchema_unedited_rawFile_eppjs").html(propertySchema_rF_str)
      jQuery("#propertySchema_unedited_rawFile_eppjs").val(propertySchema_rF_str)

      jQuery("#containerForNewPropertyControlPanels_eppjs").html("");

      createSchemaImportSelectors_top_eppjs();
}
function redrawPropertySchemaGraph_bottom_eppjs() {
      var schemaToDisplayOnGraph_slug = jQuery("#conceptSelector_bottom_eppjs option:selected").data("schematodisplayslug");
      var networkElemID = "propertySchemaBottomPanelContainer_eppjs";
      VisjsFunctions_bottom_eppjs.makeVisGraph_propertySchema_bottom_eppjs(schemaToDisplayOnGraph_slug,networkElemID);
}

export default class EditPrimaryPropertyJSONSchema extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        createSelectors_eppjs();
        jQuery("#showUneditedPropertySchemaButton_eppjs").click(function(){
            jQuery("#showUneditedPropertySchemaButton_eppjs").css("backgroundColor","green")
            jQuery("#showEditedPropertySchemaButton_eppjs").css("backgroundColor","grey")
            jQuery("#showSelectedPropertyButton_eppjs").css("backgroundColor","grey")

            jQuery("#propertySchema_unedited_rawFile_eppjs").css("display","inline-block");
            jQuery("#propertySchema_edited_rawFile_eppjs").css("display","none");
            jQuery("#selectedProperty_rawFile_eppjs").css("display","none");
        })
        jQuery("#showEditedPropertySchemaButton_eppjs").click(function(){
            jQuery("#showUneditedPropertySchemaButton_eppjs").css("backgroundColor","grey")
            jQuery("#showEditedPropertySchemaButton_eppjs").css("backgroundColor","green");
            jQuery("#showSelectedPropertyButton_eppjs").css("backgroundColor","grey")

            jQuery("#propertySchema_unedited_rawFile_eppjs").css("display","none");
            jQuery("#propertySchema_edited_rawFile_eppjs").css("display","inline-block");
            jQuery("#selectedProperty_rawFile_eppjs").css("display","none");
        })
        jQuery("#showSelectedPropertyButton_eppjs").click(function(){
            jQuery("#showUneditedPropertySchemaButton_eppjs").css("backgroundColor","grey")
            jQuery("#showEditedPropertySchemaButton_eppjs").css("backgroundColor","grey");
            jQuery("#showSelectedPropertyButton_eppjs").css("backgroundColor","green")

            jQuery("#propertySchema_unedited_rawFile_eppjs").css("display","none");
            jQuery("#propertySchema_edited_rawFile_eppjs").css("display","none");
            jQuery("#selectedProperty_rawFile_eppjs").css("display","inline-block");
        })

        //////////////////////////
        jQuery("#mirrorPropertyButton").click(function(){
            // console.log("mirrorPropertyButton")
            var nodeToMirror_rF_str = jQuery("#selectedProperty_rawFile_eppjs").val()
            var nodeToMirror_rF_obj = JSON.parse(nodeToMirror_rF_str);
            var nodeToMirror_slug = nodeToMirror_rF_obj.wordData.slug;
            VisjsFunctions_top_eppjs.transferNodeToUpperPanel_eppjs(nodeToMirror_slug)
        })
        jQuery("#clonePropertyButton").click(function(){
            // console.log("clonePropertyButton")
        })
        jQuery("#changeRelationshipButton_eppjs").click(function(){
            // console.log("changeRelationshipButton_eppjs")
            VisjsFunctions_top_eppjs.changeRelationship_eppjs()
        })
        jQuery("#updatePropertySchemaButton_eppjs").click(function(){
            // console.log("updatePropertySchemaButton_eppjs")
            VisjsFunctions_top_eppjs.updateIndividualSchema_eppjs()
        })
        jQuery("#addNewPropertyButton_eppjs").click(function(){
            // console.log("addNewPropertyButton_eppjs")
            VisjsFunctions_top_eppjs.addNewProperty_eppjs()
        })
        jQuery("#cloneSelectedPropertyButton_top_eppjs").click(function(){
            // console.log("cloneSelectedPropertyButton_top_eppjs")
            var cloneDepth = 0; // setting this variable to zero means clone only the one property; do not clone properties which feed into it (do not iterate)
            VisjsFunctions_top_eppjs.cloneSelectedProperty_top_eppjs(cloneDepth)
        })
        jQuery("#overlaySchemaButton_top_eppjs").click(function(){
            VisjsFunctions_top_eppjs.overlaySchema_top_eppjs()
        })
    }
    state = {
    }
    render() {
        return (
            <>
                <center>Edit Property Schema for Selected Concept</center>
                <div style={{fontSize:"10px",textAlign:"center"}}>A concept's Property Schema yields that concept's Primary Property which in turn yield's that concept's JSON Schema</div>
                <br/>
                <div style={{width:"700px",border:"1px solid black",display:"inline-block"}} >
                    <center>
                        Property Schema of selected Concept
                        <div id="updatePropertySchemaButton_eppjs" className="doSomethingButton">Update</div>
                    </center>
                    <div style={{fontSize:"10px",textAlign:"center"}}>This is the Property Schema that we are editing.</div>

                    <div id="selectConceptContainer_top_eppjs" style={{display:"inline-block"}} >selectConceptContainer</div>
                    <br/>
                    <div id="selectSchemaImportContainer_top_eppjs" style={{display:"inline-block"}} >selectSchemaImportContainer_top_eppjs</div>
                    <div id="overlaySchemaButton_top_eppjs" className="doSomethingButton_small" >toggle overlay</div>
                    <br/>
                    <div id="addNewPropertyButton_eppjs" className="doSomethingButton">create new property</div>
                    <div id="cloneSelectedPropertyButton_top_eppjs" className="doSomethingButton">clone selected property</div>
                    <br/>
                    <div id="containerForNewPropertyControlPanels_eppjs" ></div>
                    <br/>
                    <select id="changeRelationshipSelector_eppjs" >
                        <option value="" data-slug="" ></option>
                        <option value="propagateProperty" data-slug="propagateProperty" >propagateProperty</option>
                        <option value="isASpecificInstanceOf" data-slug="isASpecificInstanceOf" >isASpecificInstanceOf</option>
                        <option value="subsetOf" data-slug="subsetOf" >subsetOf</option>
                        <option value="addPropertyKey" data-slug="addPropertyKey" >addPropertyKey</option>
                        <option value="addPropertyValue" data-slug="addPropertyValue" >addPropertyValue</option>
                        <option value="addToConceptGraphProperties" data-slug="addToConceptGraphProperties" >addToConceptGraphProperties</option>
                    </select>
                    field: <textarea id="fieldForNewRelationship" style={{display:"inline-block",width:"200px",height:"20px"}}>fieldForNewRelationship</textarea>
                    <div id="changeRelationshipButton_eppjs" className="doSomethingButton">update relationship</div>
                    <br/>
                    selectedEdge: <div id="selectedEdge_top_eppjs" style={{display:"inline-block"}} >selectedEdge</div>
                    <br/>
                    selectedNode: <div id="selectedNode_top_eppjs" style={{display:"inline-block"}} >selectedNode</div>
                    <br/>
                    <center>
                        <div id="propertySchemaTopPanelContainer_eppjs" style={{width:"99%",height:"450px",border:"1px solid black"}} ></div>
                    </center>

                    <center>Property Schema of selected Concept</center>
                    <div style={{fontSize:"10px",textAlign:"center"}}>Properties from this schema can be viewed and added to the above schema.</div>

                    <div id="selectConceptContainer_bottom_eppjs">selectConceptContainer</div>
                    highlighted property: <div id="highlightedProperty_lowerPanel_container" style={{display:"inline-block"}}>none</div>
                    <br/>
                    <div id="mirrorPropertyButton" className="doSomethingButton" >MIRROR</div><div id="clonePropertyButton" className="doSomethingButton" >CLONE</div>
                    <center>
                        <div id="propertySchemaBottomPanelContainer_eppjs" style={{width:"99%",height:"450px",border:"1px solid black"}} ></div>
                    </center>

                    upper panel property schema:
                    <div id="showUneditedPropertySchemaButton_eppjs" className="doSomethingButton">unedited</div>
                    <div id="showEditedPropertySchemaButton_eppjs" className="doSomethingButton">edited</div>
                    <br/>
                    selected property:
                    <div id="showSelectedPropertyButton_eppjs" className="doSomethingButton">show</div>
                    <center>
                        <textarea id="propertySchema_unedited_rawFile_eppjs" style={{width:"99%",height:"450px",border:"1px solid black"}} >unedited</textarea>
                        <textarea id="propertySchema_edited_rawFile_eppjs" style={{width:"99%",height:"450px",border:"1px solid black",display:"none"}} >edited</textarea>
                        <textarea id="selectedProperty_rawFile_eppjs" style={{width:"99%",height:"450px",border:"1px solid black",display:"none"}} >property</textarea>
                    </center>

                </div>

                <div style={{width:"810px",border:"1px solid black",display:"inline-block"}} >

                    <div style={{display:"inline-block"}}>
                        <center>Form generated by selected Property</center>
                        <div id="jsonSchemaFormFromSelectedPropertyContainer_eppjs"  style={{width:"400px",height:"800px",border:"1px solid black",display:"inline-block",overflowY:"scroll"}} ></div>
                    </div>

                    <div style={{display:"inline-block"}}>
                        <center>Form of the selected Concept</center>
                        <div id="jsonSchemaFormContainer_eppjs" style={{width:"400px",height:"800px",border:"1px solid black",display:"inline-block",overflowY:"scroll"}} ></div>
                    </div>


                    <div style={{width:"49%",height:"800px",border:"1px solid black",display:"inline-block"}} >
                        <center>File produced by Property form:</center>
                        <textarea id="propertyFormOutput" style={{width:"98%",height:"750px"}}> </textarea>
                    </div>
                    <div style={{width:"49%",height:"800px",border:"1px solid black",display:"inline-block"}} >
                        <center>File produced by JSON Schema form:</center>
                        <textarea id="jsonSchemaFormOutput" style={{width:"98%",height:"750px"}}> </textarea>
                    </div>

                </div>
            </>
        );
    }
}
