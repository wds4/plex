import React from "react";
import IpfsHttpClient from 'ipfs-http-client';
import ReactJSONSchemaForm from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
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

const Form = ReactJSONSchemaForm.default;

const onFormSubmit_mcis = ({formData}, e) => {
    // Fetch updated from editedSpecificInstance_rawFile rather than from formData
    // because editedSpecificInstance_rawFile is formData that has been reordered (see onFormChange_mcis)
    // var updatedWord_rF_str = JSON.stringify(formData,null,4);
    var updatedWord_rF_str = jQuery("#editedSpecificInstance_rawFile").val();
    var updatedWord_rF_obj = JSON.parse(updatedWord_rF_str);
    var updatedWord_slug = updatedWord_rF_obj.wordData.slug;
    // console.log("Data submitted; updatedWord_slug: "+updatedWord_slug+"; updatedWord_rF_str: " + updatedWord_rF_str);
    MiscFunctions.updateWordInAllTables(updatedWord_rF_obj);
}

const onFormChange_mcis = ({formData}, e) => {
    // reorder the top level keys so that they are unchanged from the original form
    var selectedSpecificInstance_slug = jQuery("#specificInstanceSelector_mcsi option:selected").data("slug");
    // var selectedSpecificInstance_rF_obj = lookupRawFileBySlug_obj[selectedSpecificInstance_slug];
    var selectedSpecificInstance_rF_str = jQuery("#currentSpecificInstance_rawFile").val();
    if (selectedSpecificInstance_rF_str != "current") {
        // console.log("selSpecificInstance_rF_str: "+selSpecificInstance_rF_str)
        var selectedSpecificInstance_rF_obj = JSON.parse(selectedSpecificInstance_rF_str);
        var reorderedFormData_obj = {};
        jQuery.each(selectedSpecificInstance_rF_obj,function(key,val){
            if (formData.hasOwnProperty(key)) {
                reorderedFormData_obj[key] = formData[key];
            } else {
                reorderedFormData_obj[key] = selectedSpecificInstance_rF_obj[key]
            }
        })
        // now add any keys that might not have been present already in the original form
        jQuery.each(formData,function(key,val){
            reorderedFormData_obj[key] = formData[key];
        });

        // var formData_str = JSON.stringify(formData,null,4);
        var formData_str = JSON.stringify(reorderedFormData_obj,null,4);
        jQuery("#editedSpecificInstance_rawFile").html(formData_str)
        jQuery("#editedSpecificInstance_rawFile").val(formData_str)
        // jQuery("#editedSpecificInstance_rawFile").html(selectedSpecificInstance_rF_str)
        // jQuery("#editedSpecificInstance_rawFile").val(selectedSpecificInstance_rF_str)
    }
}

function createReactJsonSchemaForm_mcis() {
    var selectedConcept_slug = jQuery("#conceptSelector_mcsi option:selected").data("thisconceptconceptslug");
    if (lookupRawFileBySlug_obj.hasOwnProperty(selectedConcept_slug)) {
        var selectedConcept_rF_obj = lookupRawFileBySlug_obj[selectedConcept_slug];
        var selectedConcept_JSONSchema_slug = selectedConcept_rF_obj.conceptData.nodes.JSONSchema.slug;
        var jsonSchema_rF_obj = lookupRawFileBySlug_obj[selectedConcept_JSONSchema_slug];

        var jsonSchema_rF_str = JSON.stringify(jsonSchema_rF_obj,null,4);
        jQuery("#jsonSchemaRawFileContainer_mcis").val(jsonSchema_rF_str);

        var formData_obj = {};

        var selectedSpecificInstance_slug = jQuery("#specificInstanceSelector_mcsi option:selected").data("slug");
        // console.log("selectedSpecificInstance_slug: "+selectedSpecificInstance_slug)
        if (selectedSpecificInstance_slug != "__BLANK__" ) {
            // console.log("selectedSpecificInstance_slug: "+selectedSpecificInstance_slug)
            var selectedSpecificInstance_rF_obj = lookupRawFileBySlug_obj[selectedSpecificInstance_slug];
            formData_obj = selectedSpecificInstance_rF_obj;
        }

        ReactDOM.render(
            <>
            <ReactJSONSchemaForm
                schema={jsonSchema_rF_obj}
                formData={formData_obj}
                onSubmit={onFormSubmit_mcis}
                onChange={onFormChange_mcis}
                />
                <div style={{fontSize:"10px"}}>
                Click Submit to update a preexisting Specific Instance in SQL<br/>
                To store a new Specific Instance in SQL, use the add button on the left panel.
                </div>
            </>,
            document.getElementById('jsonSchemaFormContainer_mcis')
        )

        var currSpecificInstance_rF_str = JSON.stringify(formData_obj,null,4);
        jQuery("#currentSpecificInstance_rawFile").html(currSpecificInstance_rF_str)
        jQuery("#currentSpecificInstance_rawFile").val(currSpecificInstance_rF_str)
        jQuery("#editedSpecificInstance_rawFile").html(currSpecificInstance_rF_str)
        jQuery("#editedSpecificInstance_rawFile").val(currSpecificInstance_rF_str)

        jQuery("#showCurrentSpecificInstanceRawFileButton").trigger("click");
    }
}

function createConceptSelector_mcsi() {
    var currentConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected ").data("tablename");

    var sql = "";
    sql += " SELECT * FROM "+currentConceptGraph_tableName;

    sendAsync(sql).then((words_arr) => {
        var conceptSelectorHTML = "";
        conceptSelectorHTML += "<select id=conceptSelector_mcsi >";

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

                conceptSelectorHTML += "<option data-ipns='"+nextWord_rF_wordType_ipns+"' data-slug='"+nextWord_rF_wordType_slug+"' data-thisconceptconceptslug='"+nextWord_rF_concept_slug+"' data-thisconceptschemaslug='"+nextWord_rF_schema_slug+"' data-thisconceptjsonschemaslug='"+nextWord_rF_JSONSchema_slug+"' data-thisconceptwordtypeslug='"+nextWord_rF_wordType_slug+"' data-thisconceptsupersetslug='"+nextWord_rF_superset_slug+"' >";
                conceptSelectorHTML += nextWord_rF_wordType_slug;
                conceptSelectorHTML += "</option>";
            }

        }
        conceptSelectorHTML += "</select>";
        jQuery("#conceptSelectorContainer_mcsi").html(conceptSelectorHTML);

        createSetSelector_mcsi();
        createSpecificInstanceSelector_mcsi();
        createReactJsonSchemaForm_mcis();

        jQuery("#conceptSelectorContainer_mcsi").change(function(){
            createSetSelector_mcsi();
            createSpecificInstanceSelector_mcsi();
            // createReactJsonSchemaForm_mcis();
        });
    });
}

function manageCheckboxes_mcis() {
    var sets_arr = [];
    jQuery('.checkboxForSets').each(function () {
        sets_arr.push( jQuery(this).data("slug") );
    });
    var numSets = sets_arr.length;
    // console.log("manageCheckboxes_mcis; numSets: "+numSets)
    var selectedSpecificInstance_slug = jQuery("#specificInstanceSelector_mcsi option:selected").data("slug");
    if (!selectedSpecificInstance_slug) {
        // console.log("manageCheckboxes_mcis; selectedSpecificInstance_slug DOES NOT exist")
        // make sure all checkboxes are set to blank
        for (var s=0;s<numSets;s++) {
            var nextSet_slug = sets_arr[s];
            // console.log("manageCheckboxes_mcis; nextSet_slug: "+nextSet_slug)
            jQuery("#checkbox_"+nextSet_slug).prop("checked", false);
        }
    }

    var selectedSchema_slug = jQuery("#conceptSelector_mcsi option:selected").data("thisconceptschemaslug");
    var selectedSchema_rF_obj = lookupRawFileBySlug_obj[selectedSchema_slug];
    var rels_arr = selectedSchema_rF_obj.schemaData.relationships;

    if (selectedSpecificInstance_slug) {
        // console.log("manageCheckboxes_mcis; selectedSpecificInstance_slug exists")
        var testRel_obj = {}
        testRel_obj.nodeFrom = {};
        testRel_obj.relationshipType = {};
        testRel_obj.nodeTo = {};
        testRel_obj.nodeFrom.slug = selectedSpecificInstance_slug;
        testRel_obj.relationshipType.slug = "isASpecificInstanceOf";
        for (var s=0;s<numSets;s++) {
            // jQuery("#checkbox_"+nextSet_slug).prop("checked", false);
            var nextSet_slug = sets_arr[s];
            var nextTestRel_obj = MiscFunctions.cloneObj(testRel_obj)
            nextTestRel_obj.nodeTo.slug = nextSet_slug;

            var isRelInSchema = MiscFunctions.isRelObjInArrayOfObj(nextTestRel_obj,rels_arr)

            // console.log("manageCheckboxes_mcis; nextSet_slug: "+nextSet_slug)
            if (isRelInSchema) {
                jQuery("#checkbox_"+nextSet_slug).prop("checked", true);
            } else {
                jQuery("#checkbox_"+nextSet_slug).prop("checked", false);
            }
        }
    }

}

function createSetSelector_mcsi() {
    var selectedConcept_slug = jQuery("#conceptSelector_mcsi option:selected").data("thisconceptconceptslug");
    console.log("createSetSelector_mcsi; selectedConcept_slug: "+selectedConcept_slug)
    if (lookupRawFileBySlug_obj.hasOwnProperty(selectedConcept_slug)) {
        var selectedConcept_rF_obj = lookupRawFileBySlug_obj[selectedConcept_slug];
        var selectedConcept_superset = selectedConcept_rF_obj.conceptData.nodes.superset.slug;
        var selectedConcept_sets_arr = selectedConcept_rF_obj.globalDynamicData.sets;
        var numSets = selectedConcept_sets_arr.length;

        var setCheckboxHTML = "";
        var setSelectorHTML = "";
        // setSelectorHTML += selectedConcept_slug;
        setSelectorHTML += "<select id=setSelector_mcsi >";
        setSelectorHTML += "<option data-slug="+selectedConcept_superset+" >";
        setSelectorHTML += selectedConcept_superset;
        setSelectorHTML += "</option>";

        setCheckboxHTML += "<input class=checkboxForSets data-slug="+selectedConcept_superset+" id=checkbox_"+selectedConcept_superset+" type=checkbox > ";
        setCheckboxHTML += selectedConcept_superset;
        setCheckboxHTML += "<br>";

        for (var s=0;s<numSets;s++) {
            var nextSet_slug = selectedConcept_sets_arr[s];
            setSelectorHTML += "<option data-slug="+nextSet_slug+" >";
            setSelectorHTML += nextSet_slug;
            setSelectorHTML += "</option>";

            setCheckboxHTML += "<input class=checkboxForSets data-slug="+nextSet_slug+" id=checkbox_"+nextSet_slug+" type=checkbox > ";
            setCheckboxHTML += nextSet_slug;
            setCheckboxHTML += "<br>";
        }
        setSelectorHTML += "</select>";

        setCheckboxHTML += "<div class=doSomethingButton_small id=updateSchemaForActiveConcept >update isASpecificInstanceOf rels<br>in schemaFor[this concept]</div>";
        jQuery("#setSelectorContainer_mcsi").html(setSelectorHTML)
        jQuery("#setCheckboxContainer_mcsi").html(setCheckboxHTML)
        jQuery("#setSelectorContainer_mcsi").change(function(){
            createSpecificInstanceSelector_mcsi();
        });
        jQuery("#updateSchemaForActiveConcept").click(function(){
            var selectedSchema_slug = jQuery("#conceptSelector_mcsi option:selected").data("thisconceptschemaslug");
            var selectedSchema_rF_obj = lookupRawFileBySlug_obj[selectedSchema_slug];
            var selectedSchema_rF_str = JSON.stringify(selectedSchema_rF_obj,null,4);
            var activeSpecificInstance_rF_str = jQuery("#editedSpecificInstance_rawFile").val()
            if (activeSpecificInstance_rF_str != "{}") {
                var activeSpecificInstance_rF_obj = JSON.parse(activeSpecificInstance_rF_str);
                var activeSpecificInstance_slug = activeSpecificInstance_rF_obj.wordData.slug;

                var updatedSchema_rF_obj = MiscFunctions.cloneObj(selectedSchema_rF_obj);
                var rels_arr = selectedSchema_rF_obj.schemaData.relationships;
                var numRels = rels_arr.length;
                var updatedRels_arr = [];
                // console.log("updateSchemaForActiveConcept; numRels: "+numRels)
                for (var r=0;r<numRels;r++) {
                    var nextRel_obj = rels_arr[r];
                    var markRelForRemoval = false;
                    if (  (nextRel_obj.relationshipType.slug == "isASpecificInstanceOf")
                          && (nextRel_obj.nodeFrom.slug == activeSpecificInstance_slug)
                        ) {
                        markRelForRemoval = true;
                        var nextRel_str = JSON.stringify(nextRel_obj,null,4);
                        // console.log("markRelForRemoval true; r: "+r+"; nextRel_str: "+nextRel_str)
                    }

                    if (!markRelForRemoval) {
                        updatedRels_arr.push(nextRel_obj)
                    }
                }

                updatedSchema_rF_obj.schemaData.relationships = updatedRels_arr;

                // now need to cycle through all checked checkboxes and add the corresponding relationship
                var sets_arr = [];
                var relToAdd_obj = {}
                relToAdd_obj.nodeFrom = {};
                relToAdd_obj.relationshipType = {};
                relToAdd_obj.nodeTo = {};
                relToAdd_obj.nodeFrom.slug = activeSpecificInstance_slug;
                relToAdd_obj.relationshipType.slug = "isASpecificInstanceOf";
                jQuery('.checkboxForSets').each(function () {
                    var nextSet_slug = jQuery(this).data("slug");
                    if (jQuery("#checkbox_"+nextSet_slug).prop("checked")) {
                        sets_arr.push( nextSet_slug );
                        // console.log("checked yes: nextSet_slug: "+nextSet_slug)
                        var nextRelToAdd_obj = MiscFunctions.cloneObj(relToAdd_obj);
                        nextRelToAdd_obj.nodeTo.slug = nextSet_slug;
                        updatedSchema_rF_obj = MiscFunctions.updateSchemaWithNewRel(updatedSchema_rF_obj,nextRelToAdd_obj,lookupRawFileBySlug_obj);
                    } else {
                        // console.log("checked NO: nextSet_slug: "+nextSet_slug)
                    }
                });
                var numSets = sets_arr.length;
                // console.log("updateSchemaForActiveConcept; numSets: "+numSets)

                var updatedSchema_rF_str = JSON.stringify(updatedSchema_rF_obj,null,4);

                MiscFunctions.updateWordInAllTables(updatedSchema_rF_obj)

                jQuery("#currentSchema_rawFile").html(selectedSchema_rF_str)
                jQuery("#currentSchema_rawFile").val(selectedSchema_rF_str)
                jQuery("#editedSchema_rawFile").html(updatedSchema_rF_str)
                jQuery("#editedSchema_rawFile").val(updatedSchema_rF_str)

                // console.log("updateSchemaForActiveConcept clicked; selectedSchema_slug: "+selectedSchema_slug+"; activeSpecificInstance_slug: "+activeSpecificInstance_slug)
            }
        })
    }
}

function createSpecificInstanceSelector_mcsi() {
    var selectedSet_slug = jQuery("#setSelector_mcsi option:selected").data("slug");
    if (lookupRawFileBySlug_obj.hasOwnProperty(selectedSet_slug)) {
        var selectedSet_rF_obj = lookupRawFileBySlug_obj[selectedSet_slug];
        var selectedSet_title = selectedSet_rF_obj.wordData.title;
        var selectedSet_rF_str = JSON.stringify(selectedSet_rF_obj,null,4);
        // console.log("selectedSet_rF_str: "+selectedSet_rF_str)

        var siSelectorHTML = "";
        siSelectorHTML += "<select id=specificInstanceSelector_mcsi >";

        var selectedSet_specificInstances_arr = selectedSet_rF_obj.globalDynamicData.specificInstances;
        var numSpecificInstances = selectedSet_specificInstances_arr.length;

        siSelectorHTML += "<option data-slug=__BLANK__ >";
        siSelectorHTML += " ==== specificInstancesFromSchema ====";
        siSelectorHTML += "</option>";
        for (var s=0;s<numSpecificInstances;s++) {
            var nextSpecificInstance_slug = selectedSet_specificInstances_arr[s];
            console.log("nextSpecificInstance_slug: "+nextSpecificInstance_slug)
            if (lookupRawFileBySlug_obj.hasOwnProperty(nextSpecificInstance_slug)) {
                var nextSpecificInstance_rF_obj = lookupRawFileBySlug_obj[nextSpecificInstance_slug];
                var nextSpecificInstance_title = nextSpecificInstance_rF_obj.wordData.title;
                siSelectorHTML += "<option data-slug="+nextSpecificInstance_slug+" >";
                siSelectorHTML += nextSpecificInstance_title;
                siSelectorHTML += " ("+nextSpecificInstance_slug+")";
                siSelectorHTML += "</option>";
            } else {
                console.log("ERROR! nextSpecificInstance_slug: "+nextSpecificInstance_slug+" not found in lookupRawFileBySlug_obj")
            }
        }
        siSelectorHTML += "<option data-slug=__BLANK__ >";
        siSelectorHTML += " ==== specificInstancesFromConceptGraph ====";
        siSelectorHTML += "</option>";

        var selectedWordType_slug = jQuery("#conceptSelector_mcsi option:selected").data("thisconceptwordtypeslug");
        jQuery.each(lookupRawFileBySlug_obj,function(word_slug,word_obj){
            if (word_obj.hasOwnProperty("wordData")) { // or could test: if word_slug != "edited"
                var word_wordTypes = word_obj.wordData.wordTypes;
                if (jQuery.inArray(selectedWordType_slug,word_wordTypes) > -1) {
                    var word_title = word_obj.wordData.title;
                    siSelectorHTML += "<option data-slug="+word_slug+" >";
                    siSelectorHTML += word_title;
                    siSelectorHTML += " ("+word_slug+")";
                    siSelectorHTML += "</option>";
                }
            }
        });

        siSelectorHTML += "</select>";
        jQuery("#specificInstanceSelectorContainer_mcsi").html(siSelectorHTML)
        jQuery("#specificInstanceSelector_mcsi").change(function(){
            createReactJsonSchemaForm_mcis();
            manageCheckboxes_mcis();
        })
        createReactJsonSchemaForm_mcis();
        manageCheckboxes_mcis();
    }
}

export default class ManageConceptSpecificInstances extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        createConceptSelector_mcsi();
        jQuery("#showCurrentSpecificInstanceRawFileButton").click(function(){
            jQuery("#currentSpecificInstance_rawFile").css("display","inline-block")
            jQuery("#editedSpecificInstance_rawFile").css("display","none")
            jQuery("#currentSchema_rawFile").css("display","none")
            jQuery("#editedSchema_rawFile").css("display","none")

            jQuery("#showCurrentSpecificInstanceRawFileButton").css("backgroundColor","green");
            jQuery("#showEditedSpecificInstanceRawFileButton").css("backgroundColor","grey");
            jQuery("#showCurrentSchemaRawFileButton").css("backgroundColor","grey");
            jQuery("#showEditedSchemaRawFileButton").css("backgroundColor","grey");
        });
        jQuery("#showEditedSpecificInstanceRawFileButton").click(function(){
            jQuery("#currentSpecificInstance_rawFile").css("display","none")
            jQuery("#editedSpecificInstance_rawFile").css("display","inline-block")
            jQuery("#currentSchema_rawFile").css("display","none")
            jQuery("#editedSchema_rawFile").css("display","none")

            jQuery("#showCurrentSpecificInstanceRawFileButton").css("backgroundColor","grey");
            jQuery("#showEditedSpecificInstanceRawFileButton").css("backgroundColor","green");
            jQuery("#showCurrentSchemaRawFileButton").css("backgroundColor","grey");
            jQuery("#showEditedSchemaRawFileButton").css("backgroundColor","grey");
        });
        jQuery("#showCurrentSchemaRawFileButton").click(function(){
            jQuery("#currentSpecificInstance_rawFile").css("display","none")
            jQuery("#editedSpecificInstance_rawFile").css("display","none")
            jQuery("#currentSchema_rawFile").css("display","inline-block")
            jQuery("#editedSchema_rawFile").css("display","none")

            jQuery("#showCurrentSpecificInstanceRawFileButton").css("backgroundColor","grey");
            jQuery("#showEditedSpecificInstanceRawFileButton").css("backgroundColor","grey");
            jQuery("#showCurrentSchemaRawFileButton").css("backgroundColor","green");
            jQuery("#showEditedSchemaRawFileButton").css("backgroundColor","grey");
        });
        jQuery("#showEditedSchemaRawFileButton").click(function(){
            jQuery("#currentSpecificInstance_rawFile").css("display","none")
            jQuery("#editedSpecificInstance_rawFile").css("display","none")
            jQuery("#currentSchema_rawFile").css("display","none")
            jQuery("#editedSchema_rawFile").css("display","inline-block")

            jQuery("#showCurrentSpecificInstanceRawFileButton").css("backgroundColor","grey");
            jQuery("#showEditedSpecificInstanceRawFileButton").css("backgroundColor","grey");
            jQuery("#showCurrentSchemaRawFileButton").css("backgroundColor","grey");
            jQuery("#showEditedSchemaRawFileButton").css("backgroundColor","green");
        });

        jQuery("#saveNewSpecificInstanceButton").click(async function(){
            var generatedKey_name = jQuery("#newSpecificInstanceKeyname").html()
            var newSpecificInstance_rF_str = jQuery("#editedSpecificInstance_rawFile").val()
            var newSpecificInstance_rF_obj = JSON.parse(newSpecificInstance_rF_str);
            var newSpecificInstance_slug = newSpecificInstance_rF_obj.wordData.slug;

            var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
            var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");

            var newWord_ipns = newSpecificInstance_rF_obj.metaData.ipns;

            // console.log("saveNewSpecificInstanceButton clicked; newSpecificInstance_slug: "+newSpecificInstance_slug+"; generatedKey_name: "+generatedKey_name+"; newWord_ipns: "+newWord_ipns+"; newSpecificInstance_rF_str: "+newSpecificInstance_rF_str)
            insertOrUpdateWordIntoMyDictionary(myDictionary,newSpecificInstance_rF_str,newSpecificInstance_slug,generatedKey_name,newWord_ipns)
            insertOrUpdateWordIntoMyConceptGraph(myConceptGraph,myDictionary,newSpecificInstance_rF_str,newSpecificInstance_slug,generatedKey_name,newWord_ipns);

        });
        jQuery("#makeNewSpecificInstanceButton").click(async function(){
            var selectedConcept_slug = jQuery("#conceptSelector_mcsi option:selected").data("thisconceptconceptslug");
            var selectedConcept_rF_obj = lookupRawFileBySlug_obj[selectedConcept_slug];
            var propertyPath = selectedConcept_rF_obj.conceptData.propertyPath;
            var selectedWordType_slug = jQuery("#conceptSelector_mcsi option:selected").data("thisconceptwordtypeslug");
            var newSpecificInstance_rF_obj = {};
            if (templatesByWordType_obj.hasOwnProperty(selectedWordType_slug)) {
                newSpecificInstance_rF_obj = JSON.parse(JSON.stringify(templatesByWordType_obj[selectedWordType_slug]));
            } else {
                var skeletonSpecificInstance_rF_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["word"]));
                var newSpecificInstance_rF_obj = {};
                var hasWordDataBeenAddedYet = false;
                jQuery.each(skeletonSpecificInstance_rF_obj,function(key,val){
                    newSpecificInstance_rF_obj[key] = skeletonSpecificInstance_rF_obj[key];
                    if (key=="wordData") {
                        newSpecificInstance_rF_obj[propertyPath] = {}
                    }
                })
            }

            newSpecificInstance_rF_obj.wordData.wordType = selectedWordType_slug;
            newSpecificInstance_rF_obj.wordData.wordTypes.push(selectedWordType_slug);

            var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
            var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
            newSpecificInstance_rF_obj.globalDynamicData.myDictionaries.push(myDictionary);
            newSpecificInstance_rF_obj.globalDynamicData.myConceptGraphs.push(myConceptGraph);

            var currentTime = Date.now();
            var newKeyname = "dictionaryWord_"+selectedWordType_slug+"_"+currentTime;
            jQuery("#newSpecificInstanceKeyname").html(newKeyname)
            var generatedKey_obj = await ipfs.key.gen(newKeyname, {
                type: 'rsa',
                size: 2048
            })
            var newSpecificInstance_ipns = generatedKey_obj["id"];
            var generatedKey_name = generatedKey_obj["name"];

            var newSpecificInstance_slug = selectedWordType_slug+"_"+newSpecificInstance_ipns.slice(newSpecificInstance_ipns.length-6);;
            newSpecificInstance_rF_obj.wordData.slug = newSpecificInstance_slug;

            newSpecificInstance_rF_obj.metaData.ipns = newSpecificInstance_ipns;

            var newSpecificInstance_rF_str = JSON.stringify(newSpecificInstance_rF_obj,null,4)
            jQuery("#currentSpecificInstance_rawFile").html(newSpecificInstance_rF_str)
            jQuery("#currentSpecificInstance_rawFile").val(newSpecificInstance_rF_str)
            jQuery("#editedSpecificInstance_rawFile").html(newSpecificInstance_rF_str)
            jQuery("#editedSpecificInstance_rawFile").val(newSpecificInstance_rF_str)
            // console.log("makeNewSpecificInstanceButton clicked; selectedWordType_slug: "+selectedWordType_slug+"; newSpecificInstance_rF_str: "+newSpecificInstance_rF_str)
        });
    }
    state = {
    }
    render() {
        return (
            <>
                <center>Manage Concept Specific Instances</center>
                <fieldset style={{display:"inline-block",width:"550px",border:"1px solid black",padding:"5px",verticalAlign:"top"}} >
                    <center>Concept - Set - Specific Instance Selectors</center>
                    concept: <div style={{display:"inline-block"}} id="conceptSelectorContainer_mcsi" >conceptSelectorContainer</div>
                    <br/>
                    set: <div style={{display:"inline-block"}} id="setSelectorContainer_mcsi" >setSelectorContainer</div>
                    <br/>
                    specific instance: <div style={{display:"inline-block"}} id="specificInstanceSelectorContainer_mcsi" >specificInstanceSelectorContainer</div>
                    <br/>
                    <div style={{display:"inline-block",fontSize:"12px",border:"1px solid grey",borderRadius:"5px",padding:"4px"}}>
                    this specific instance is a (direct) specificInstanceOf:
                    <div id="setCheckboxContainer_mcsi">setCheckboxContainer_mcsi</div>
                    </div>
                    <br/>
                    <div className="doSomethingButton_small" id="makeNewSpecificInstanceButton">make new specific instance</div>
                    <div className="doSomethingButton_small" id="saveNewSpecificInstanceButton">add new (edited) specific instance to SQL</div>
                    <div style={{display:"inline-block",fontSize:"9px",marginLeft:"5px"}} >don't forget to add, *then* update<br/>schemaFor[thisConcept] with new si!</div>
                    <div style={{display:"none"}} id="newSpecificInstanceKeyname">newSpecificInstanceKeyname</div>
                    <br/>
                    specificInstance rawFile:
                    <div className="doSomethingButton" id="showCurrentSpecificInstanceRawFileButton">current</div>
                    <div className="doSomethingButton" id="showEditedSpecificInstanceRawFileButton">edited</div>
                    <br/>
                    schema rawFile:
                    <div className="doSomethingButton" id="showCurrentSchemaRawFileButton">current</div>
                    <div className="doSomethingButton" id="showEditedSchemaRawFileButton">edited</div>
                    <br/>
                    <textarea id="currentSpecificInstance_rawFile" style={{width:"98%",height:"800px"}} >current</textarea>
                    <textarea id="editedSpecificInstance_rawFile" style={{width:"98%",height:"800px",display:"none"}} >edited</textarea>
                    <textarea id="currentSchema_rawFile" style={{width:"98%",height:"800px",display:"none"}} >current schema</textarea>
                    <textarea id="editedSchema_rawFile" style={{width:"98%",height:"800px",display:"none"}} >edited schema</textarea>
                </fieldset>

                <fieldset style={{display:"inline-block",width:"500px",border:"1px solid black",padding:"5px",verticalAlign:"top"}}>
                    <center>Specific Instance - Form</center>
                    <div id="jsonSchemaFormContainer_mcis">jsonSchemaFormContainer_mcis</div>
                </fieldset>

                <fieldset style={{display:"inline-block",width:"500px",border:"1px solid black",padding:"5px",verticalAlign:"top"}}>
                    <center>JSON Schema</center>
                    <textarea id="jsonSchemaRawFileContainer_mcis" style={{width:"98%",height:"800px"}} >jsonSchemaRawFileContainer_mcis</textarea>
                </fieldset>
            </>
        );
    }
}
