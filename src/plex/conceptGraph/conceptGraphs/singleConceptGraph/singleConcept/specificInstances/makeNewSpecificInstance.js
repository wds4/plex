import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/singleConcept_specificInstances_leftNav2.js';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import ReactJSONSchemaOldForm from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import sendAsync from '../../../../../renderer.js';

/*
see:
https://react-jsonschema-form.readthedocs.io/en/latest/api-reference/form-props/
for properties such as:
liveOmit
omitExtraData
liveValidate

*/

const jQuery = require("jquery");

const uiSchema = {
    address: { 'ui:widget': 'hidden' },
}

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

const onFormSubmit = ({formData}, e) => {
    var sFormData = JSON.stringify(formData,null,4);
    console.log("onFormSubmit; sFormData: "+sFormData)

    var sNewWord = jQuery("#specificInstanceTextarea_edited").val()
    var oNewWord = JSON.parse(sNewWord)
    console.log("saveNewSpecificInstance; sNewWord: "+sNewWord)

    var sSchema = jQuery("#schemaTextarea_edited").val()
    var oSchema = JSON.parse(sSchema)

    window.lookupWordBySlug[oNewWord.wordData.slug] = oNewWord;
    window.lookupWordBySlug[oSchema.wordData.slug] = oSchema;

    MiscFunctions.createOrUpdateWordInAllTables(oNewWord)
    MiscFunctions.createOrUpdateWordInAllTables(oSchema)
}

const updateMainSchemaRawFile = () => {
    // console.log("updateMainSchemaRawFile")
    var sNewSpecificInstance = jQuery("#specificInstanceTextarea_edited").val()
    var oNewSpecificInstance = JSON.parse(sNewSpecificInstance);
    var newSpecificInstance_slug = oNewSpecificInstance.wordData.slug;

    var sSchemaUnedited = jQuery("#schemaTextarea_unedited").val()
    var oSchema = JSON.parse(sSchemaUnedited);
    // console.log("updateMainSchemaRawFile b")
    // oSchema.wordData.a="b";
    // get list of existingSet that this will be a direct subset of
    var oExpandedLookup = MiscFunctions.cloneObj(window.lookupWordBySlug)
    oExpandedLookup[newSpecificInstance_slug] = oNewSpecificInstance;
    jQuery(".subsetOfCheckbox:checked").each(function(){
        var existingSet_slug = jQuery(this).data("slug")
        // console.log("subsetOfCheckbox checked; existingSet_slug: "+existingSet_slug)
        var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
        oNextRel.nodeFrom.slug = newSpecificInstance_slug;
        oNextRel.relationshipType.slug = "isASpecificInstanceOf";
        oNextRel.nodeTo.slug = existingSet_slug;
        oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oNextRel,oExpandedLookup)
    })
    // for each existingSet, make relationship: newSet - subsetOf - existingSet and add this rel to oSchema
    // then update schemaTextarea_edited

    var sSchemaEdited = JSON.stringify(oSchema,null,4);
    jQuery("#schemaTextarea_edited").val(sSchemaEdited)
    // console.log("updateMainSchemaRawFile z")
}

const onFormChange = async ({formData}, e) => {
    var sNewSpecificInstance = await MiscFunctions.cloneObj(JSON.stringify(formData,null,4));
    // console.log("onFormChange; sFormData: "+sNewSpecificInstance)

    var sSpecificInstance_unedited = jQuery("#specificInstanceTextarea_unedited").val();

    // console.log("sSpecificInstance_unedited: "+sSpecificInstance_unedited)
    if (sSpecificInstance_unedited) {
        var sConcept_slug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug
        var oConcept = window.lookupWordBySlug[sConcept_slug]
        var propertyPath = oConcept.conceptData.propertyPath;
        var singular = oConcept.conceptData.name.singular;
        var concept_slugSingular = oConcept.conceptData.slug;

        var oSpecificInstance_unedited = JSON.parse(sSpecificInstance_unedited);

        var oNewSpecificInstance = JSON.parse(sNewSpecificInstance)

        var newWord_ipns = oSpecificInstance_unedited.metaData.ipns;
        var newWord_slug = "";
        if (oNewSpecificInstance[propertyPath].hasOwnProperty("slug")) {
            newWord_slug = oNewSpecificInstance[propertyPath].slug;
        }
        if (newWord_slug) {
            oSpecificInstance_unedited.wordData.slug = concept_slugSingular+"_"+newWord_slug+"_"+newWord_ipns.substr(-6);
        } else {
            oSpecificInstance_unedited.wordData.slug = concept_slugSingular+"_"+newWord_ipns.substr(-6);
        }
        oSpecificInstance_unedited.wordData.wordType = concept_slugSingular;
        if (jQuery.inArray(concept_slugSingular,oSpecificInstance_unedited.wordData.wordTypes) == -1) {
            oSpecificInstance_unedited.wordData.wordTypes.push(concept_slugSingular)
        }
        if (oNewSpecificInstance[propertyPath].hasOwnProperty("name")) {
            var form_name = oNewSpecificInstance[propertyPath].name;
            oSpecificInstance_unedited.wordData.name = singular+": "+form_name;
        }
        if (oNewSpecificInstance[propertyPath].hasOwnProperty("title")) {
            var form_title = oNewSpecificInstance[propertyPath].title;
            oSpecificInstance_unedited.wordData.title = singular[0].toUpperCase() + singular.substring(1)+": "+form_title;
        }

        // jQuery.extend(oNewSpecificInstance,oSpecificInstance_unedited);
        oNewSpecificInstance = MiscFunctions.extendWithOrdering(oNewSpecificInstance,oSpecificInstance_unedited);
        oNewSpecificInstance.metaData.neuroCore.processedAsSpecificInstance = false;
        var sNewSpecificInstance = JSON.stringify(oNewSpecificInstance,null,4);
        jQuery("#specificInstanceTextarea_edited").val(sNewSpecificInstance);
        updateMainSchemaRawFile();
    }
}

export default class MakeNewSpecificInstance extends React.Component {
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

        var oNewWord = await MiscFunctions.createNewWordByTemplate("word");
        var sNewWord = JSON.stringify(oNewWord,null,4);
        jQuery("#specificInstanceTextarea_unedited").val(sNewWord)
    }
    render() {
        var currentConcept_slug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;
        var oConcept = window.lookupWordBySlug[currentConcept_slug];
        var jsonSchema_slug = oConcept.conceptData.nodes.JSONSchema.slug;
        var oJSONSchema = window.lookupWordBySlug[jsonSchema_slug];
        var oBlankForm = {}; 
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Make New Specific Instance</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>
                        <div class="h3" >{window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug}</div>

                        <div className="standardDoubleColumn" style={{border:"1px dashed black"}}>
                            <center>
                                <div style={{width:"600px",display:"inline-block",textAlign:"left"}} >
                                    <Form
                                        schema={oJSONSchema}
                                        validator={validator}
                                        formData={oBlankForm}
                                        onSubmit={onFormSubmit}
                                        onChange={onFormChange}
                                        uiSchema={uiSchema}
                                        liveOmit
                                        omitExtraData
                                    />
                                </div>
                            </center>
                            <br/>
                            * Submit = store new word in SQL and update schema with new word + relationship
                            + update both words in window.lookupWordBySlug
                            <br/>
                            <textarea id="specificInstanceTextarea_unedited" style={{width:"600px",height:"300px"}}></textarea>
                            <br/>
                            <textarea id="specificInstanceTextarea_edited" style={{width:"600px",height:"300px"}}></textarea>
                        </div>

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
