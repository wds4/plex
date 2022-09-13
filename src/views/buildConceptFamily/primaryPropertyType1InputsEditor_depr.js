import React from "react";
import IpfsHttpClient from 'ipfs-http-client';
import ReactJSONSchemaForm from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import ReactDOM from 'react-dom';
import sendAsync from '../../renderer';
import { lookupRawFileBySlug_obj, templatesByWordType_obj, insertOrUpdateWordIntoMyConceptGraphAndMyDictionary, insertOrUpdateWordIntoMyDictionary, insertOrUpdateWordIntoMyConceptGraph } from '../addANewConcept';
import * as MiscFunctions from '../../lib/miscFunctions.js';
import * as VisjsFunctions from '../../lib/visjs/visjs-functions.js';
import * as PropertyFormationFunctions from './propertyFormationFunctionsUsingRelationships.js';
import { highlightedNode_slug } from '../../lib/visjs/visjs-functions.js';
const jQuery = require("jquery");

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

const Form = ReactJSONSchemaForm.default;

function createReactJsonSchemaForm_ppt1is() {

    var jsonSchema_unedited_str = jQuery("#jsonSchema_unedited_rawFile").val();
    var jsonSchema_unedited_obj = {};
    jsonSchema_unedited_obj = JSON.parse(jsonSchema_unedited_str);

    var jsonSchema_edited_str = jQuery("#jsonSchema_edited_rawFile").val();
    var jsonSchema_edited_obj = {};
    jsonSchema_edited_obj = JSON.parse(jsonSchema_edited_str);

    ReactDOM.render(
        <>
        <ReactJSONSchemaForm
            schema={jsonSchema_unedited_obj}
            />
        </>,
        document.getElementById('jsonSchemaFormContainer_unedited_ppt1is')
    )

    ReactDOM.render(
        <>
        <ReactJSONSchemaForm
            schema={jsonSchema_edited_obj}
            />
        </>,
        document.getElementById('jsonSchemaFormContainer_edited_ppt1is')
    )
}

function createType1PropertyList_ppt1is() {
    var currentConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected ").data("tablename");

    var sql = "";
    sql += " SELECT * FROM "+currentConceptGraph_tableName;

    sendAsync(sql).then((words_arr) => {
        var numWords = words_arr.length;
        var ind=0;
        var type1PropertiesHTML = "";
        type1PropertiesHTML += "<fieldset id=availablePropertiesListContainer style='padding-bottom:20px;' >";
        for (var w=0;w<numWords;w++) {
            var nextWord_str = words_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_wordTypes = nextWord_obj.wordData.wordTypes;
            var nextWord_ipns = nextWord_obj.metaData.ipns;
            if (jQuery.inArray("property",nextWord_wordTypes) > -1) {
                var nextProperty_types_arr = nextWord_obj.propertyData.types;
                if (jQuery.inArray("type1",nextProperty_types_arr) > -1) {
                    // var nextProp_title = nextWord_obj.wordData.title;
                    // var nextProp_description = nextWord_obj.wordData.description;
                    type1PropertiesHTML += "<div data-propertyslug="+nextWord_slug+" data-currentconceptpropertieslist=absent class=type1PropContainer_ppt1is >";
                        type1PropertiesHTML += "<div>";
                            type1PropertiesHTML += "<div class=leftCol_ppt1is >";
                            type1PropertiesHTML += "slug: ";
                            type1PropertiesHTML += "</div>";
                            type1PropertiesHTML += "<div class=rightCol_ppt1is >";
                            type1PropertiesHTML += nextWord_slug;
                            type1PropertiesHTML += "</div>";
                        type1PropertiesHTML += "</div>";

                        type1PropertiesHTML += "<div>";
                            type1PropertiesHTML += "<div class=leftCol_ppt1is >";
                            type1PropertiesHTML += "key: ";
                            type1PropertiesHTML += "</div>";
                            type1PropertiesHTML += "<textarea id=propertyKey_"+nextWord_slug+" class=propKey style='width:300px;height:25px;' >";
                            // type1PropertiesHTML += nextWord_slug;
                            type1PropertiesHTML += "</textarea>";
                        type1PropertiesHTML += "</div>";

                        type1PropertiesHTML += "<div>";
                            type1PropertiesHTML += "<div class=leftCol_ppt1is >";
                            type1PropertiesHTML += "value: ";
                            type1PropertiesHTML += "</div>";
                            type1PropertiesHTML += "<textarea id=propertyValue_"+nextWord_slug+" class=propValue style='width:300px;height:25px;' >";
                            // type1PropertiesHTML += nextWord_slug;
                            type1PropertiesHTML += "</textarea>";
                        type1PropertiesHTML += "</div>";

                        /*
                        type1PropertiesHTML += "<div>";
                            type1PropertiesHTML += "<div class=leftCol_ppt1is >";
                            type1PropertiesHTML += "title: ";
                            type1PropertiesHTML += "</div>";
                            // type1PropertiesHTML += "<div class=rightCol_ppt1is >";
                            // type1PropertiesHTML += nextProp_title;
                            // type1PropertiesHTML += "</div>";
                            type1PropertiesHTML += "<textarea id=propertyTitle_"+nextWord_slug+" style='width:300px;height:25px;' >";
                            type1PropertiesHTML += nextProp_title;
                            type1PropertiesHTML += "</textarea>";
                        type1PropertiesHTML += "</div>";

                        type1PropertiesHTML += "<div>";
                            type1PropertiesHTML += "<div class=leftCol_ppt1is >";
                            type1PropertiesHTML += "description: ";
                            type1PropertiesHTML += "</div>";
                            type1PropertiesHTML += "<textarea id=propertyDescription_"+nextWord_slug+" style='width:300px;height:50px;' >";
                            type1PropertiesHTML += nextProp_description;
                            type1PropertiesHTML += "</textarea>";
                        type1PropertiesHTML += "</div>";
                        */

                        type1PropertiesHTML += "<div data-slug='"+nextWord_slug+"' id=update_"+nextWord_slug+" class='doSomethingButton updatePropertyButton' >Update</div>";

                    type1PropertiesHTML += "</div>";
                }
            }
        }
        type1PropertiesHTML += "</fieldset>";
        jQuery("#type1PropertiesContainer_ppt1is").html(type1PropertiesHTML);

        displayPrimaryProperty_ppt1is();
        jQuery(".type1PropContainer_ppt1is").click(function(){
            jQuery("#availablePropertiesListContainer").children().each(function(){
                jQuery(this).css("border","5px solid white");
            })
            jQuery(this).css("border","5px solid purple");
            var propertySlug = jQuery(this).data("propertyslug");
            var property_rF_obj = lookupRawFileBySlug_obj[propertySlug];
            var property_rF_str = JSON.stringify(property_rF_obj,null,4)
            jQuery("#showPropertyContainer_ppt1is").html(property_rF_str)
            jQuery("#showPropertyContainer_ppt1is").val(property_rF_str)

            var jsonSchema_selectedProperty_obj = property_rF_obj.propertyData.JSONSchemaStyle.value;
            if (!jsonSchema_selectedProperty_obj) {
                jsonSchema_selectedProperty_obj = {};
            }

            ReactDOM.render(
                <>
                <ReactJSONSchemaForm
                    schema={jsonSchema_selectedProperty_obj}
                    />
                </>,
                document.getElementById('jsonSchemaFormContainer_selectedProperty_ppt1is')
            )
        });
        jQuery(".updatePropertyButton").click(function(){
            var propertySlug = jQuery(this).data("slug");
            var property_rF_obj = lookupRawFileBySlug_obj[propertySlug];
            var propertyKey = jQuery("#propertyKey_"+propertySlug).val();
            var propertyValue = jQuery("#propertyValue_"+propertySlug).val();

            console.log("update_ clicked; propertySlug: "+propertySlug+"; propertyKey: "+propertyKey);

            /*
            var propertyTitle = jQuery("#propertyTitle_"+propertySlug).val();
            property_rF_obj.wordData.title = propertyTitle;
            property_rF_obj.propertyData.title = propertyTitle;

            var propertyDescription = jQuery("#propertyDescription_"+propertySlug).val();
            property_rF_obj.wordData.description = propertyDescription;
            property_rF_obj.propertyData.description = propertyDescription;
            */

            var property_rF_str = JSON.stringify(property_rF_obj,null,4);
            console.log("property_rF_str: "+property_rF_str);
        });
    });

}

function displayPrimaryProperty_ppt1is() {
    var selectedConcept_primaryProperty_slug = jQuery("#conceptSelector_ppt1is option:selected").data("thisconceptprimarypropertyslug");
    var primaryProperty_rF_obj = lookupRawFileBySlug_obj[selectedConcept_primaryProperty_slug];
    var primaryProperty_rF_str = JSON.stringify(primaryProperty_rF_obj,null,4)
    jQuery("#primaryProperty_unedited_rawFile").html(primaryProperty_rF_str)
    jQuery("#primaryProperty_unedited_rawFile").val(primaryProperty_rF_str)

    jQuery("#primaryProperty_edited_rawFile").html(primaryProperty_rF_str)
    jQuery("#primaryProperty_edited_rawFile").val(primaryProperty_rF_str)

    var selectedConcept_propertySchema_slug = jQuery("#conceptSelector_ppt1is option:selected").data("thisconceptpropertyschemaslug");
    console.log("selectedConcept_propertySchema_slug: "+selectedConcept_propertySchema_slug)
    var propertySchema_rF_obj = lookupRawFileBySlug_obj[selectedConcept_propertySchema_slug];
    var propertySchema_rF_str = JSON.stringify(propertySchema_rF_obj,null,4)
    jQuery("#propertySchema_unedited_rawFile").html(propertySchema_rF_str)
    jQuery("#propertySchema_unedited_rawFile").val(propertySchema_rF_str)

    jQuery("#propertySchema_edited_rawFile").html(propertySchema_rF_str)
    jQuery("#propertySchema_edited_rawFile").val(propertySchema_rF_str)

    var selectedConcept_JSONSchema_slug = jQuery("#conceptSelector_ppt1is option:selected").data("thisconceptjsonschemaslug");
    console.log("selectedConcept_JSONSchema_slug: "+selectedConcept_JSONSchema_slug)
    var jsonSchema_rF_obj = lookupRawFileBySlug_obj[selectedConcept_JSONSchema_slug];
    var jsonSchema_rF_str = JSON.stringify(jsonSchema_rF_obj,null,4)
    jQuery("#jsonSchema_unedited_rawFile").html(jsonSchema_rF_str)
    jQuery("#jsonSchema_unedited_rawFile").val(jsonSchema_rF_str)

    jQuery("#jsonSchema_edited_rawFile").html(jsonSchema_rF_str)
    jQuery("#jsonSchema_edited_rawFile").val(jsonSchema_rF_str)

    highlightPropertys_ppt1is();
    createReactJsonSchemaForm_ppt1is();
}

function highlightPropertys_ppt1is() {
    console.log("highlightPropertys_ppt1is")
    var selectedConcept_primaryProperty_slug = jQuery("#conceptSelector_ppt1is option:selected").data("thisconceptprimarypropertyslug");
    var primaryProperty_rF_obj = lookupRawFileBySlug_obj[selectedConcept_primaryProperty_slug];
    var activeProperties_arr = primaryProperty_rF_obj.propertyData.conceptGraphStyle.properties;
    var currState = jQuery("#toggleUnusedPropertiesButton").data("currentstate");
    jQuery("#availablePropertiesListContainer").children().each(function(){
        if (currState=="showing") {
            jQuery(this).css("display","block");
        }
        if (currState=="hidden") {
            jQuery(this).css("display","none");
        }
        jQuery(this).css("backgroundColor","white");
        jQuery(this).data("currentconceptpropertieslist","absent") // absent, present, needtoupdate, needtoadd
    })
    jQuery.each(activeProperties_arr,function(n,nextProp_obj){
        var nextProp_str = JSON.stringify(nextProp_obj,null,4)
        console.log("nextProp_str: ",nextProp_str)
        var nextProp_key = nextProp_obj.key;
        var nextProp_value = nextProp_obj.value;
        var nextProp_slug = nextProp_obj.slug;
        console.log("highlightPropertys_ppt1is nextProp_slug: "+nextProp_slug)
        // highlight this property on the properties list
        jQuery("#availablePropertiesListContainer").children().each(function(){
            var nextPropertySlug = jQuery(this).data("propertyslug");
            if (nextPropertySlug==nextProp_slug) {
                jQuery(this).css("backgroundColor","green");
                jQuery(this).css("display","block");
                jQuery(this).find("textarea.propKey").html(nextProp_key)
                jQuery(this).find("textarea.propKey").val(nextProp_key)
                jQuery(this).find("textarea.propValue").html(nextProp_value)
                jQuery(this).find("textarea.propValue").val(nextProp_value)
                jQuery(this).data("currentconceptpropertieslist","present")
            }
        })
    })
}

function createConceptSelector_ppt1is() {
    var currentConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected ").data("tablename");

    var sql = "";
    sql += " SELECT * FROM "+currentConceptGraph_tableName;

    sendAsync(sql).then((words_arr) => {
        var conceptSelectorHTML = "";
        conceptSelectorHTML += "<select id=conceptSelector_ppt1is >";

        var numWords = words_arr.length;
        var ind=0;
        for (var w=0;w<numWords;w++) {
            var nextWord_str = words_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_wordTypes = nextWord_obj.wordData.wordTypes;
            var nextWord_ipns = nextWord_obj.metaData.ipns;

            lookupRawFileBySlug_obj[nextWord_slug] = nextWord_obj;
            lookupRawFileBySlug_obj.edited[nextWord_slug] = nextWord_obj;

            if (jQuery.inArray("concept",nextWord_wordTypes) > -1) {
                var nextWord_rF_obj = nextWord_obj;
                var nextWord_rF_str = JSON.stringify(nextWord_rF_obj,null,4)
                console.log("nextWord_slug: "+nextWord_slug+"; nextWord_rF_str: "+nextWord_rF_str)
                var nextWord_rF_wordType_slug = nextWord_rF_obj.conceptData.nodes.wordType.slug;
                var nextWord_rF_wordType_ipns = nextWord_rF_obj.conceptData.nodes.wordType.ipns;
                var nextWord_rF_superset_slug = nextWord_rF_obj.conceptData.nodes.superset.slug;
                var nextWord_rF_superset_ipns = nextWord_rF_obj.conceptData.nodes.superset.ipns;
                var nextWord_rF_schema_slug = nextWord_rF_obj.conceptData.nodes.schema.slug;
                var nextWord_rF_schema_ipns = nextWord_rF_obj.conceptData.nodes.schema.ipns;
                var nextWord_rF_JSONSchema_slug = nextWord_rF_obj.conceptData.nodes.JSONSchema.slug;
                var nextWord_rF_JSONSchema_ipns = nextWord_rF_obj.conceptData.nodes.JSONSchema.ipns;
                var nextWord_rF_concept_slug = nextWord_rF_obj.conceptData.nodes.concept.slug;
                var nextWord_rF_concept_ipns = nextWord_rF_obj.conceptData.nodes.concept.ipns;
                var nextWord_rF_primaryProperty_slug = nextWord_rF_obj.conceptData.nodes.primaryProperty.slug;
                var nextWord_rF_primaryProperty_ipns = nextWord_rF_obj.conceptData.nodes.primaryProperty.ipns;
                var nextWord_rF_propertySchema_slug = nextWord_rF_obj.conceptData.nodes.propertySchema.slug;
                var nextWord_rF_propertySchema_ipns = nextWord_rF_obj.conceptData.nodes.propertySchema.ipns;

                // console.log("qwerty nextWord_rF_propertySchema_slug: "+nextWord_rF_propertySchema_slug)

                conceptSelectorHTML += "<option data-ipns='"+nextWord_rF_wordType_ipns+"' data-slug='"+nextWord_rF_wordType_slug+"' data-thisconceptconceptslug='"+nextWord_rF_concept_slug+"' data-thisconceptschemaslug='"+nextWord_rF_schema_slug+"' data-thisconceptjsonschemaslug='"+nextWord_rF_JSONSchema_slug+"' data-thisconceptwordtypeslug='"+nextWord_rF_wordType_slug+"' data-thisconceptsupersetslug='"+nextWord_rF_superset_slug+"' data-thisconceptprimarypropertyslug='"+nextWord_rF_primaryProperty_slug+"' data-thisconceptpropertyschemaslug='"+nextWord_rF_propertySchema_slug+"' >";
                conceptSelectorHTML += nextWord_rF_wordType_slug;
                conceptSelectorHTML += "</option>";
            }

        }
        conceptSelectorHTML += "</select>";
        jQuery("#conceptSelectorContainer_ppt1is").html(conceptSelectorHTML);
        jQuery("#conceptSelector_ppt1is").change(function(){
            displayPrimaryProperty_ppt1is();
            // highlightPropertys_ppt1is();
        });
        displayPrimaryProperty_ppt1is();
        // highlightPropertys_ppt1is();
    });
}

export default class PrimaryPropertyType1InputsEditor extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        createConceptSelector_ppt1is();
        createType1PropertyList_ppt1is();
        jQuery("#toggleUnusedPropertiesButton").click(function(){
            var currState = jQuery(this).data("currentstate");
            if (currState=="showing") {
                jQuery(this).data("currentstate","hidden")
                jQuery(this).html("show unused properties")
                jQuery(this).css("backgroundColor","grey");
            }
            if (currState=="hidden") {
                jQuery(this).data("currentstate","showing")
                jQuery(this).html("hide unused properties")
                jQuery(this).css("backgroundColor","green");
            }
            highlightPropertys_ppt1is();
        });
        jQuery("#showPrimaryPropertyUneditedButton_ppt1is").click(function(){
            jQuery("#showPrimaryPropertyUneditedButton_ppt1is").css("backgroundColor","green");
            jQuery("#showPrimaryPropertyEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPropertySchemaUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPropertySchemaEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showJSONSchemaUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showJSONSchemaEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showFormUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showFormEditedButton_ppt1is").css("backgroundColor","grey");

            jQuery("#primaryProperty_unedited_rawFile").css("display","block");
            jQuery("#primaryProperty_edited_rawFile").css("display","none");
            jQuery("#propertySchema_unedited_rawFile").css("display","none");
            jQuery("#propertySchema_edited_rawFile").css("display","none");
            jQuery("#jsonSchema_unedited_rawFile").css("display","none");
            jQuery("#jsonSchema_edited_rawFile").css("display","none");
            jQuery("#jsonSchemaFormContainer_unedited_ppt1is").css("display","none");
            jQuery("#jsonSchemaFormContainer_edited_ppt1is").css("display","none");
        });
        jQuery("#showPrimaryPropertyEditedButton_ppt1is").click(function(){
            jQuery("#showPrimaryPropertyUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPrimaryPropertyEditedButton_ppt1is").css("backgroundColor","green");
            jQuery("#showPropertySchemaUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPropertySchemaEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showJSONSchemaUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showJSONSchemaEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showFormUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showFormEditedButton_ppt1is").css("backgroundColor","grey");

            jQuery("#primaryProperty_unedited_rawFile").css("display","none");
            jQuery("#primaryProperty_edited_rawFile").css("display","block");
            jQuery("#propertySchema_unedited_rawFile").css("display","none");
            jQuery("#propertySchema_edited_rawFile").css("display","none");
            jQuery("#jsonSchema_unedited_rawFile").css("display","none");
            jQuery("#jsonSchema_edited_rawFile").css("display","none");
            jQuery("#jsonSchemaFormContainer_unedited_ppt1is").css("display","none");
            jQuery("#jsonSchemaFormContainer_edited_ppt1is").css("display","none");
        });
        jQuery("#showPropertySchemaUneditedButton_ppt1is").click(function(){
            jQuery("#showPrimaryPropertyUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPrimaryPropertyEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPropertySchemaUneditedButton_ppt1is").css("backgroundColor","green");
            jQuery("#showPropertySchemaEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showJSONSchemaUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showJSONSchemaEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showFormUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showFormEditedButton_ppt1is").css("backgroundColor","grey");

            jQuery("#primaryProperty_unedited_rawFile").css("display","none");
            jQuery("#primaryProperty_edited_rawFile").css("display","none");
            jQuery("#propertySchema_unedited_rawFile").css("display","block");
            jQuery("#propertySchema_edited_rawFile").css("display","none");
            jQuery("#jsonSchema_unedited_rawFile").css("display","none");
            jQuery("#jsonSchema_edited_rawFile").css("display","none");
            jQuery("#jsonSchemaFormContainer_unedited_ppt1is").css("display","none");
            jQuery("#jsonSchemaFormContainer_edited_ppt1is").css("display","none");
        });
        jQuery("#showPropertySchemaEditedButton_ppt1is").click(function(){
            jQuery("#showPrimaryPropertyUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPrimaryPropertyEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPropertySchemaUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPropertySchemaEditedButton_ppt1is").css("backgroundColor","green");
            jQuery("#showJSONSchemaUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showJSONSchemaEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showFormUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showFormEditedButton_ppt1is").css("backgroundColor","grey");

            jQuery("#primaryProperty_unedited_rawFile").css("display","none");
            jQuery("#primaryProperty_edited_rawFile").css("display","none");
            jQuery("#propertySchema_unedited_rawFile").css("display","none");
            jQuery("#propertySchema_edited_rawFile").css("display","block");
            jQuery("#jsonSchema_unedited_rawFile").css("display","none");
            jQuery("#jsonSchema_edited_rawFile").css("display","none");
            jQuery("#jsonSchemaFormContainer_unedited_ppt1is").css("display","none");
            jQuery("#jsonSchemaFormContainer_edited_ppt1is").css("display","none");
        });
        jQuery("#showJSONSchemaUneditedButton_ppt1is").click(function(){
            jQuery("#showPrimaryPropertyUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPrimaryPropertyEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPropertySchemaUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPropertySchemaEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showJSONSchemaUneditedButton_ppt1is").css("backgroundColor","green");
            jQuery("#showJSONSchemaEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showFormUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showFormEditedButton_ppt1is").css("backgroundColor","grey");

            jQuery("#primaryProperty_unedited_rawFile").css("display","none");
            jQuery("#primaryProperty_edited_rawFile").css("display","none");
            jQuery("#propertySchema_unedited_rawFile").css("display","none");
            jQuery("#propertySchema_edited_rawFile").css("display","none");
            jQuery("#jsonSchema_unedited_rawFile").css("display","block");
            jQuery("#jsonSchema_edited_rawFile").css("display","none");
            jQuery("#jsonSchemaFormContainer_unedited_ppt1is").css("display","none");
            jQuery("#jsonSchemaFormContainer_edited_ppt1is").css("display","none");
        });
        jQuery("#showJSONSchemaEditedButton_ppt1is").click(function(){
            jQuery("#showPrimaryPropertyUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPrimaryPropertyEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPropertySchemaUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPropertySchemaEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showJSONSchemaUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showJSONSchemaEditedButton_ppt1is").css("backgroundColor","green");
            jQuery("#showFormUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showFormEditedButton_ppt1is").css("backgroundColor","grey");

            jQuery("#primaryProperty_unedited_rawFile").css("display","none");
            jQuery("#primaryProperty_edited_rawFile").css("display","none");
            jQuery("#propertySchema_unedited_rawFile").css("display","none");
            jQuery("#propertySchema_edited_rawFile").css("display","none");
            jQuery("#jsonSchema_unedited_rawFile").css("display","none");
            jQuery("#jsonSchema_edited_rawFile").css("display","block");
            jQuery("#jsonSchemaFormContainer_unedited_ppt1is").css("display","none");
            jQuery("#jsonSchemaFormContainer_edited_ppt1is").css("display","none");
        });
        jQuery("#showFormUneditedButton_ppt1is").click(function(){
            jQuery("#showPrimaryPropertyUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPrimaryPropertyEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPropertySchemaUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPropertySchemaEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showJSONSchemaUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showJSONSchemaEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showFormUneditedButton_ppt1is").css("backgroundColor","green");
            jQuery("#showFormEditedButton_ppt1is").css("backgroundColor","grey");

            jQuery("#primaryProperty_unedited_rawFile").css("display","none");
            jQuery("#primaryProperty_edited_rawFile").css("display","none");
            jQuery("#propertySchema_unedited_rawFile").css("display","none");
            jQuery("#propertySchema_edited_rawFile").css("display","none");
            jQuery("#jsonSchema_unedited_rawFile").css("display","none");
            jQuery("#jsonSchema_edited_rawFile").css("display","none");
            jQuery("#jsonSchemaFormContainer_unedited_ppt1is").css("display","block");
            jQuery("#jsonSchemaFormContainer_edited_ppt1is").css("display","none");
        });
        jQuery("#showFormEditedButton_ppt1is").click(function(){
            jQuery("#showPrimaryPropertyUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPrimaryPropertyEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPropertySchemaUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showPropertySchemaEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showJSONSchemaUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showJSONSchemaEditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showFormUneditedButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showFormEditedButton_ppt1is").css("backgroundColor","green");

            jQuery("#primaryProperty_unedited_rawFile").css("display","none");
            jQuery("#primaryProperty_edited_rawFile").css("display","none");
            jQuery("#propertySchema_unedited_rawFile").css("display","none");
            jQuery("#propertySchema_edited_rawFile").css("display","none");
            jQuery("#jsonSchema_unedited_rawFile").css("display","none");
            jQuery("#jsonSchema_edited_rawFile").css("display","none");
            jQuery("#jsonSchemaFormContainer_unedited_ppt1is").css("display","none");
            jQuery("#jsonSchemaFormContainer_edited_ppt1is").css("display","block");
        });
        ////////////////////////////////
        jQuery("#showSelectedPropertyRawFileButton_ppt1is").click(function(){
            jQuery("#showSelectedPropertyRawFileButton_ppt1is").css("backgroundColor","green");
            jQuery("#showSelectedPropertyFormButton_ppt1is").css("backgroundColor","grey");

            jQuery("#showPropertyContainer_ppt1is").css("display","block");
            jQuery("#jsonSchemaFormContainer_selectedProperty_ppt1is").css("display","none");
        });
        jQuery("#showSelectedPropertyFormButton_ppt1is").click(function(){
            jQuery("#showSelectedPropertyRawFileButton_ppt1is").css("backgroundColor","grey");
            jQuery("#showSelectedPropertyFormButton_ppt1is").css("backgroundColor","green");

            jQuery("#showPropertyContainer_ppt1is").css("display","none");
            jQuery("#jsonSchemaFormContainer_selectedProperty_ppt1is").css("display","block");
        });
    }
    state = {
    }
    render() {
        return (
            <>
                <center>Primary Property Type1 Inputs Editor</center>

                <fieldset style={{display:"inline-block",border:"1px sold black",width:"550px",height:"800px",padding:"5px",verticalAlign:"top"}}>
                    <center>Concept Selector</center>
                    concept: <div style={{display:"inline-block"}} id="conceptSelectorContainer_ppt1is" >conceptSelectorContainer</div>
                    <br/>
                    Primary Property:
                    <div class="doSomethingButton" id="showPrimaryPropertyUneditedButton_ppt1is" >(unedited)</div>
                    <div class="doSomethingButton" id="showPrimaryPropertyEditedButton_ppt1is" >(edited)</div>
                    <br/>
                    Property Schema:
                    <div class="doSomethingButton" id="showPropertySchemaUneditedButton_ppt1is" >(unedited)</div>
                    <div class="doSomethingButton" id="showPropertySchemaEditedButton_ppt1is" >(edited)</div>
                    <br/>
                    JSON Schema:
                    <div class="doSomethingButton" id="showJSONSchemaUneditedButton_ppt1is" >(unedited)</div>
                    <div class="doSomethingButton" id="showJSONSchemaEditedButton_ppt1is" >(edited)</div>
                    <br/>
                    Form:
                    <div class="doSomethingButton" id="showFormUneditedButton_ppt1is" >(unedited)</div>
                    <div class="doSomethingButton" id="showFormEditedButton_ppt1is" >(edited)</div>
                    <br/>
                    <textarea id="primaryProperty_unedited_rawFile" style={{width:"98%",height:"800px"}} >primaryProperty_unedited_rawFile</textarea>
                    <textarea id="primaryProperty_edited_rawFile" style={{width:"98%",height:"800px"}} >primaryProperty_edited_rawFile</textarea>

                    <textarea id="propertySchema_unedited_rawFile" style={{width:"98%",height:"800px"}} >propertySchema_unedited_rawFile</textarea>
                    <textarea id="propertySchema_edited_rawFile" style={{width:"98%",height:"800px"}} >propertySchema_edited_rawFile</textarea>

                    <textarea id="jsonSchema_unedited_rawFile" style={{width:"98%",height:"800px"}} >jsonSchema_unedited_rawFile</textarea>
                    <textarea id="jsonSchema_edited_rawFile" style={{width:"98%",height:"800px"}} >jsonSchema_edited_rawFile</textarea>

                    <div id="jsonSchemaFormContainer_unedited_ppt1is" style={{width:"98%",height:"800px"}} >jsonSchemaFormContainer_unedited_ppt1is</div>
                    <div id="jsonSchemaFormContainer_edited_ppt1is" style={{width:"98%",height:"800px"}} >jsonSchemaFormContainer_edited_ppt1is</div>
                </fieldset>

                <fieldset style={{display:"inline-block",border:"1px sold black",width:"450px",height:"800px",padding:"5px",verticalAlign:"top"}}>
                    <center>Type1 Property Inputs Selector</center>
                    <div class="doSomethingButton" id="toggleUnusedPropertiesButton" data-currentstate="showing" >show unused properties</div>
                    <div style={{display:"inline-block"}} id="type1PropertiesContainer_ppt1is" >type1PropertiesContainer_ppt1is</div>
                </fieldset>

                <fieldset style={{display:"inline-block",border:"1px sold black",width:"500px",height:"800px",padding:"5px",verticalAlign:"top"}}>
                    <center>Show Selected Property</center>
                    <div class="doSomethingButton" id="showSelectedPropertyRawFileButton_ppt1is" >rawFile</div>
                    <div class="doSomethingButton" id="showSelectedPropertyFormButton_ppt1is" >form</div>
                    <textarea style={{width:"98%",height:"800px"}} id="showPropertyContainer_ppt1is" >showPropertyContainer_ppt1is</textarea>
                    <div id="jsonSchemaFormContainer_selectedProperty_ppt1is" style={{width:"98%",height:"800px"}} >jsonSchemaFormContainer_selectedProperty_ppt1is</div>
                </fieldset>
            </>
        );
    }
}
