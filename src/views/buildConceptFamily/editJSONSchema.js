import React from "react";
import IpfsHttpClient from 'ipfs-http-client';
import sendAsync from '../../renderer';
import { lookupRawFileBySlug_obj, templatesByWordType_obj, insertOrUpdateWordIntoMyDictionary, insertOrUpdateWordIntoMyConceptGraph } from '../addANewConcept';
import * as MiscFunctions from '../../lib/miscFunctions';
const jQuery = require("jquery");

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

function updateType3Property_rawFile() {
    var selectedProperty_slug = jQuery("#type3PropertySelector option:selected").data("propertyslug");

    var selectedProperty_rF_obj = lookupRawFileBySlug_obj[selectedProperty_slug]
    var selectedProperty_rF_str = JSON.stringify(selectedProperty_rF_obj,null,4);
    // console.log("currentJSONSchema_rF_str: "+currentJSONSchema_rF_str)
    jQuery("#selectedType3Property_rawFile").html(selectedProperty_rF_str)
    jQuery("#selectedType3Property_rawFile").val(selectedProperty_rF_str)
}

function updateJSONSchemaRawFileContainer() {
    var selectedConcept_slug = jQuery("#conceptSelector option:selected").data("conceptslug");
    // console.log("selectedConcept_slug: "+selectedConcept_slug)
    var selectedJSONSchema_slug = jQuery("#conceptSelector option:selected").data("jsonschemaslug");

    var currentJSONSchema_rF_obj = lookupRawFileBySlug_obj[selectedJSONSchema_slug]
    var currentJSONSchema_rF_str = JSON.stringify(currentJSONSchema_rF_obj,null,4);
    // console.log("currentJSONSchema_rF_str: "+currentJSONSchema_rF_str)
    jQuery("#currentJSONSchema_rawFile").html(currentJSONSchema_rF_str)
    jQuery("#currentJSONSchema_rawFile").val(currentJSONSchema_rF_str)
    jQuery("#editedJSONSchema_rawFile").html(currentJSONSchema_rF_str)
    jQuery("#editedJSONSchema_rawFile").val(currentJSONSchema_rF_str)
}

function createSelectors_editJSONSchema() {
    var currentConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
    var sql = "";
    sql += " SELECT * FROM "+currentConceptGraph_tableName;

    // console.log("createSelectors_editJSONSchema; sql: "+sql)

    sendAsync(sql).then((words_arr) => {
        // selectorHTML1: conceptSelectorContainer
        var selectorHTML1 = "";
        selectorHTML1 += "<select id=conceptSelector >";

        var numWords = words_arr.length;
        for (var w=0;w<numWords;w++) {
            var nextWord_str = words_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_wordTypes = nextWord_obj.wordData.wordTypes;
            var nextWord_ipns = nextWord_obj.metaData.ipns;

            // console.log("createSelectors_editJSONSchema; nextWord_slug: "+nextWord_slug)

            var isWordType_concept = jQuery.inArray("concept",nextWord_wordTypes);
            var isWordType_property = jQuery.inArray("property",nextWord_wordTypes);

            if (isWordType_concept > -1 ) {
                // console.log("createSelectors_editJSONSchema; wordType is concept; nextWord_slug: "+nextWord_slug)
                var nextConcept_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[nextWord_slug]));
                var nextConcept_rF_str = JSON.stringify(nextConcept_rF_obj,null,4);
                // console.log("createSelectors_editJSONSchema; wordType is concept; nextConcept_rF_str: "+nextConcept_rF_str)
                var nextConcept_JSONSchema_slug = nextConcept_rF_obj.conceptData.nodes.JSONSchema.slug;
                var nextConcept_wordType_slug = nextConcept_rF_obj.conceptData.nodes.wordType.slug;

                selectorHTML1 += "<option data-conceptslug='"+nextWord_slug+"' data-wordtypeslug='"+nextConcept_wordType_slug+"' data-jsonschemaslug='"+nextConcept_JSONSchema_slug+"' >";
                selectorHTML1 += nextConcept_wordType_slug;
                selectorHTML1 += "</option>";
            }
        }
        selectorHTML1 += "</select>";
        jQuery("#conceptSelectorContainer").html(selectorHTML1)
        jQuery("#conceptSelector").change(function(){
            updateJSONSchemaRawFileContainer();
        })
        updateJSONSchemaRawFileContainer()

        // selectorHTML2: type3PropertySelectorContainer
        var selectorHTML2 = "";
        selectorHTML2 += "<select id=type3PropertySelector>";
        if (lookupRawFileBySlug_obj.hasOwnProperty("properties_type3")) {
            var properties_type3_rF_obj = lookupRawFileBySlug_obj["properties_type3"];
            var properties_type3_specificInstances_arr = properties_type3_rF_obj.globalDynamicData.specificInstances;
            var numT3Props = properties_type3_specificInstances_arr.length;
            for (var p=0;p<numT3Props;p++) {
                var nextProp_slug = properties_type3_specificInstances_arr[p];
                var nextProp_rF_obj = lookupRawFileBySlug_obj[nextProp_slug];
                var nextProp_title = nextProp_rF_obj.wordData.title;

                selectorHTML2 += "<option data-propertyslug='"+nextProp_slug+"' >";
                selectorHTML2 += nextProp_title;
                selectorHTML2 += "</option>";
            }
        }
        selectorHTML2 += "</select>";
        jQuery("#type3PropertySelectorContainer").html(selectorHTML2)
        jQuery("#type3PropertySelector").change(function(){
            updateType3Property_rawFile();
        })
        updateType3Property_rawFile()
    });
}

export default class EditJSONSchema extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        jQuery("#showCurrentJSONSchemaRawFileButton").click(function(){
            jQuery("#currentJSONSchema_rawFile").css("display","inline-block")
            jQuery("#editedJSONSchema_rawFile").css("display","none")

            jQuery("#showCurrentJSONSchemaRawFileButton").css("backgroundColor","green")
            jQuery("#showEditedJSONSchemaRawFileButton").css("backgroundColor","grey")
        });
        jQuery("#showEditedJSONSchemaRawFileButton").click(function(){
            jQuery("#currentJSONSchema_rawFile").css("display","none")
            jQuery("#editedJSONSchema_rawFile").css("display","inline-block")

            jQuery("#showCurrentJSONSchemaRawFileButton").css("backgroundColor","grey")
            jQuery("#showEditedJSONSchemaRawFileButton").css("backgroundColor","green")
        });
        createSelectors_editJSONSchema();
        jQuery("#updateJSONSchemaButton").click(function(){
            // console.log("updateJSONSchemaButton; update in myConceptGraphs, in myDictionaries, and lookupRawFileBySlug_obj.edited")
            var editedJSONSchema_rF_str = jQuery("#editedJSONSchema_rawFile").val();
            var editedJSONSchema_rF_obj = JSON.parse(editedJSONSchema_rF_str)
            // console.log("editedJSONSchema_rF_str: "+editedJSONSchema_rF_str)
            // MiscFunctions.updateWordInAllTables(editedJSONSchema_rF_obj)
        });
        jQuery("#editJSONSchema_primaryProperty").click(function(){
            // console.log("editJSONSchema_primaryProperty clicked");
            var editedJSONSchema_rF_str = jQuery("#editedJSONSchema_rawFile").val();
            var editedJSONSchema_rF_obj = JSON.parse(editedJSONSchema_rF_str)
            // console.log("editedJSONSchema_rF_str: "+editedJSONSchema_rF_str)
            // editedJSONSchema_rF_obj.wordData.foo="bar";
            var editedJSONSchema_updated_rF_str = JSON.stringify(editedJSONSchema_rF_obj,null,4)
            jQuery("#editedJSONSchema_rawFile").html(editedJSONSchema_updated_rF_str);
            jQuery("#editedJSONSchema_rawFile").val(editedJSONSchema_updated_rF_str);
        });
        jQuery("#editJSONSchema_definitions").click(function(){
            // console.log("editJSONSchema_definitions clicked");
        });
    }
    state = {
    }
    render() {
        return (
            <>
                <center>Edit JSON Schema</center>
                <fieldset style={{display:"inline-block",width:"500px",border:"1px solid black",padding:"5px",verticalAlign:"top"}} >
                    select the JSON Schema governing the abstract concept of:
                    <div id="conceptSelectorContainer" >conceptSelectorContainer</div>
                    <br/>
                    select a Type 3 Property to be the primary property for this JSON Schema:
                    <div id="type3PropertySelectorContainer" >type3PropertySelectorContainer</div>
                    <br/>
                    edit JSON Schema:
                    <div className="doSomethingButton" id="editJSONSchema_primaryProperty" >primary property</div>
                    <div className="doSomethingButton" id="editJSONSchema_definitions" >definitions</div>

                    <br/>
                    type 3 property:
                    <textarea id="selectedType3Property_rawFile" style={{width:"400px",height:"400px"}} ></textarea>

                </fieldset>

                <fieldset style={{display:"inline-block",width:"500px",border:"1px solid black",padding:"5px",verticalAlign:"top"}} >
                    JSONSchema rawFile:
                    <div className="doSomethingButton" id="showCurrentJSONSchemaRawFileButton">current</div>
                    <div className="doSomethingButton" id="showEditedJSONSchemaRawFileButton">edited</div>
                    <div className="doSomethingButton" id="updateJSONSchemaButton">UPDATE JSON SCHEMA</div>
                    <br/>
                    <textarea id="currentJSONSchema_rawFile" style={{width:"400px",height:"400px"}} >current</textarea>
                    <textarea id="editedJSONSchema_rawFile" style={{width:"400px",height:"400px",display:"none"}} >edited</textarea>
                </fieldset>
            </>
        );
    }
}
