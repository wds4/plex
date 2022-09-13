import React from "react";
import IpfsHttpClient from 'ipfs-http-client';
import ReactDOM from 'react-dom';
import sendAsync from '../../renderer';
import { lookupRawFileBySlug_obj, templatesByWordType_obj, insertOrUpdateWordIntoMyDictionary, insertOrUpdateWordIntoMyConceptGraph } from '../addANewConcept';
import * as MiscFunctions from '../../lib/miscFunctions.js';
const jQuery = require("jquery");

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

function updateSelectedProperty_mraup() {
    console.log("updateSelectedProperty_mraup")
    var selectedProperty_rF_str = jQuery("#selectedPropertyContainer_unedited_mraup").val()
    var selectedProperty_rF_obj = JSON.parse(selectedProperty_rF_str)

    var required_arr = [];
    jQuery('.checkboxForRequired').each(function() {
        var isChecked = jQuery(this).prop("checked");
        console.log("isChecked: "+isChecked)
        if (isChecked) { required_arr.push(jQuery(this).attr('name')); }
    });

    var required_str = JSON.stringify(required_arr,null,4);
    console.log("required_str: "+required_str)

    var unique_arr = [];
    jQuery('.checkboxForUnique').each(function() {
        var isChecked = jQuery(this).prop("checked");
        // console.log("isChecked: "+isChecked)
        if (isChecked) { unique_arr.push(jQuery(this).attr('name')); }
    });

    // var required_str = JSON.stringify(required_arr,null,4);
    // console.log("required_str: "+required_str)

    // selectedProperty_rF_obj.wordData.x="y";
    selectedProperty_rF_obj.propertyData.conceptGraphStyle.required = required_arr;
    selectedProperty_rF_obj.propertyData.conceptGraphStyle.unique = unique_arr;
    selectedProperty_rF_str = JSON.stringify(selectedProperty_rF_obj,null,4)

    jQuery("#selectedPropertyContainer_edited_mraup").val(selectedProperty_rF_str)
}

function makeCheckboxes_mraup() {
    var selectedProperty_slug = jQuery("#propertySelector_mraup option:selected").data("propertyslug");
    var checkboxesHTML = "";
    // checkboxesHTML += "selectedProperty_slug: "+selectedProperty_slug;

    if (lookupRawFileBySlug_obj.hasOwnProperty(selectedProperty_slug)) {
        var selectedProperty_rF_obj = lookupRawFileBySlug_obj[selectedProperty_slug];
        var selectedProperty_rF_str = JSON.stringify(selectedProperty_rF_obj,null,4)
        jQuery("#selectedPropertyContainer_unedited_mraup").val(selectedProperty_rF_str)
        jQuery("#selectedPropertyContainer_edited_mraup").val(selectedProperty_rF_str)

        var propertiesList_arr = selectedProperty_rF_obj.propertyData.conceptGraphStyle.properties;
        var propertiesList_required_arr = [];
        if (selectedProperty_rF_obj.propertyData.conceptGraphStyle.hasOwnProperty("required")) {
            propertiesList_required_arr = selectedProperty_rF_obj.propertyData.conceptGraphStyle.required;
        }
        var propertiesList_unique_arr = [];
        if (selectedProperty_rF_obj.propertyData.conceptGraphStyle.hasOwnProperty("unique")) {
            propertiesList_unique_arr = selectedProperty_rF_obj.propertyData.conceptGraphStyle.unique;
        }
        var numProperties = propertiesList_arr.length;
        checkboxesHTML += " required / unique <br/>";
        for (var p=0;p<numProperties;p++) {
            var nextProperty_obj = propertiesList_arr[p];
            var nextProperty_key = nextProperty_obj.key;
            var nextProperty_slug = nextProperty_obj.slug;
            checkboxesHTML += "<div id=checkboxesInnerContainer_mraup >";
            checkboxesHTML += "<input type=checkbox class=checkboxForRequired ";
            if (jQuery.inArray(nextProperty_slug,propertiesList_required_arr) > -1) {
                checkboxesHTML += " checked ";
            }
            checkboxesHTML += " id=checkbox1_"+nextProperty_slug+" name="+nextProperty_slug+" > / ";

            checkboxesHTML += "<input type=checkbox class=checkboxForUnique ";
            if (jQuery.inArray(nextProperty_slug,propertiesList_unique_arr) > -1) {
                checkboxesHTML += " checked ";
            }
            checkboxesHTML += " id=checkbox2_"+nextProperty_slug+" name='"+nextProperty_key+"' > ";
            checkboxesHTML += " "+nextProperty_key+" ";
                checkboxesHTML += "<div style=font-size:10px;display:inline-block; >";
                checkboxesHTML += "("+nextProperty_slug+")";
                checkboxesHTML += "</div>";
            checkboxesHTML += "</div>";
        }
        checkboxesHTML += "<div class=doSomethingButton id=updateSelectedPropertyButton_mraup >Update in SQL</div>";
    }
    jQuery("#checkboxesContainer_mraup").html(checkboxesHTML);
    jQuery("#updateSelectedPropertyButton_mraup").click(function(){
        console.log("updateSelectedPropertyButton_mraup")
        var selectedProperty_edited_rF_str = jQuery("#selectedPropertyContainer_edited_mraup").val()
        var selectedProperty_edited_rF_obj = JSON.parse(selectedProperty_edited_rF_str)
        MiscFunctions.updateWordInAllTables(selectedProperty_edited_rF_obj);
    })
    jQuery(".checkboxForRequired").change(function(){
        updateSelectedProperty_mraup();
    })
    jQuery(".checkboxForUnique").change(function(){
        updateSelectedProperty_mraup();
    })
}

function addPropertiesOfThisSet_mraup(nextPropType) {
    var selectedConcept_wordType_slug = jQuery("#conceptSelector_mraup option:selected").data("thisconceptwordtypeslug");
    var propertySelectorHTML = "";
    if (selectedConcept_wordType_slug !== undefined) {
        var propertySet_slug = "propertiesFor"+selectedConcept_wordType_slug.substr(0,1).toUpperCase()+selectedConcept_wordType_slug.substr(1)+"_"+nextPropType;
        console.log("propertySet_slug: "+propertySet_slug)
        if (lookupRawFileBySlug_obj.hasOwnProperty(propertySet_slug)) {
            var propertySet_rF_obj = lookupRawFileBySlug_obj[propertySet_slug];
            var properties_specificInstances_arr = propertySet_rF_obj.globalDynamicData.specificInstances;
            var numSpecificInstances = properties_specificInstances_arr.length;
            for (var s=0;s<numSpecificInstances;s++) {
                var nextSpecificInstance_slug = properties_specificInstances_arr[s];
                console.log("nextSpecificInstance_slug: "+nextSpecificInstance_slug)
                propertySelectorHTML += "<option ";
                propertySelectorHTML += " data-propertyslug='"+nextSpecificInstance_slug+"' ";
                propertySelectorHTML += " >";
                propertySelectorHTML += "("+nextPropType+") ";
                propertySelectorHTML += nextSpecificInstance_slug;
                propertySelectorHTML += "</option>";
            }
        }
    }
    return propertySelectorHTML;
}

function createPropertySelector_mraup() {
    var primaryProperty_slug = jQuery("#conceptSelector_mraup option:selected").data("thisconceptprimarypropertyslug");
    var propertySelectorHTML = "";
    propertySelectorHTML += "<select id=propertySelector_mraup >";
    propertySelectorHTML += "<option select=selected ";
    propertySelectorHTML += " data-propertyslug='"+primaryProperty_slug+"' ";
    propertySelectorHTML += " >";
    propertySelectorHTML += "(primaryProperty) ";
    propertySelectorHTML += primaryProperty_slug;
    propertySelectorHTML += "</option>";

    var nextPropType = "object_1property";
    propertySelectorHTML += addPropertiesOfThisSet_mraup(nextPropType);

    var nextPropType = "object_multiProperties";
    propertySelectorHTML += addPropertiesOfThisSet_mraup(nextPropType);

    var nextPropType = "object_dependencies";
    propertySelectorHTML += addPropertiesOfThisSet_mraup(nextPropType);

    propertySelectorHTML += "</select>";

    jQuery("#propertySelectorContainer_mraup").html(propertySelectorHTML);

    makeCheckboxes_mraup()
    jQuery("#propertySelector_mraup").change(function(){
        makeCheckboxes_mraup()
    })
}

function createConceptSelector_mraup() {
    var currentConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected ").data("tablename");

    var sql = "";
    sql += " SELECT * FROM "+currentConceptGraph_tableName;

    sendAsync(sql).then((words_arr) => {
        var conceptSelectorHTML = "";
        conceptSelectorHTML += "<select id=conceptSelector_mraup >";

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
                // console.log("nextWord_slug: "+nextWord_slug+"; nextWord_rF_str: "+nextWord_rF_str)
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
        jQuery("#conceptSelectorContainer_mraup").html(conceptSelectorHTML);

        createPropertySelector_mraup();
        jQuery("#conceptSelector_mraup").change(function(){
            // displayPrimaryProperty_mraup();
            // highlightPropertys_mraup();
            createPropertySelector_mraup();
        });
        // displayPrimaryProperty_mraup();
        // highlightPropertys_mraup();
    });
}

export default class ManageRequiredAndUniqueProperties extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        createConceptSelector_mraup();

        jQuery("#showSelectedPropertyButton_unedited").click(function(){
            jQuery("#selectedPropertyContainer_unedited_mraup").css("display","inline-block")
            jQuery("#selectedPropertyContainer_edited_mraup").css("display","none")

            jQuery("#showSelectedPropertyButton_unedited").css("backgroundColor","green");
            jQuery("#showSelectedPropertyButton_edited").css("backgroundColor","grey");
        });
        jQuery("#showSelectedPropertyButton_edited").click(function(){
            jQuery("#selectedPropertyContainer_unedited_mraup").css("display","none")
            jQuery("#selectedPropertyContainer_edited_mraup").css("display","inline-block")

            jQuery("#showSelectedPropertyButton_unedited").css("backgroundColor","grey");
            jQuery("#showSelectedPropertyButton_edited").css("backgroundColor","green");
        });

    }
    state = {
    }
    render() {
        return (
            <>
                <center>Manage Required and Unique Properties</center>

                <fieldset style={{display:"inline-block",border:"1px solid black",width:"550px",height:"800px",padding:"5px",verticalAlign:"top"}} >
                    <center>Concept Selector</center>
                    concept: <div style={{display:"inline-block"}} id="conceptSelectorContainer_mraup" >conceptSelectorContainer_mraup</div>
                    <br/>
                    manage required and unique for this property: <div style={{display:"inline-block"}} id="propertySelectorContainer_mraup" >propertySelectorContainer_mraup</div>
                    <br/>
                    <div style={{display:"inline-block"}} id="checkboxesContainer_mraup" >checkboxesContainer_mraup</div>
                </fieldset>

                <fieldset style={{display:"inline-block",border:"1px solid black",width:"550px",height:"800px",padding:"5px",verticalAlign:"top"}} >
                    <center>Selected Property being edited</center>

                    <div id="showSelectedPropertyButton_unedited" class="doSomethingButton_small">unedited</div>
                    <div id="showSelectedPropertyButton_edited" class="doSomethingButton_small">edited</div>
                    <textarea style={{width:"530px",height:"600px"}} id="selectedPropertyContainer_unedited_mraup">selectedPropertyContainer_unedited_mraup</textarea>
                    <textarea style={{width:"530px",height:"600px"}} id="selectedPropertyContainer_edited_mraup">selectedPropertyContainer_edited_mraup</textarea>

                </fieldset>
            </>
        );
    }
}
