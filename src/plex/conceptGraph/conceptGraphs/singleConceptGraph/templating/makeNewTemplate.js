import React from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleConceptGraph_templating_leftNav2.js';
import ReactJSONSchemaOldForm from 'react-jsonschema-form';
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");

var uiSchema = {}
uiSchema.varType = { 'ui:widget': 'hidden' }
uiSchema.varNum = { 'ui:widget': 'hidden' }
uiSchema.propertySlug = { 'ui:widget': 'hidden' }
uiSchema.propertyKeyPath = { 'ui:widget': 'hidden' }

const onFormSubmit = ({formData}, e) => {
    var sFormData = JSON.stringify(formData,null,4);
    console.log("onFormSubmit; sFormData: "+sFormData)

    updateTemplateRawfile(formData);
}
const onFormChange = ({formData}, e) => {
    var sFormData = JSON.stringify(formData,null,4);
    console.log("onFormChange; sFormData: "+sFormData)

    updateTemplateRawfile(formData);
}

const renderForm = (varType,p,slug,propertyKeyPath) => {
    console.log("renderForm: varType: "+varType+"; p: "+p+"; slug: "+slug+"; propertyKeyPath: "+propertyKeyPath)
    if (window.lookupWordBySlug.hasOwnProperty(slug)) {
        var oWord = window.lookupWordBySlug[slug];
    }
    if (!window.lookupWordBySlug.hasOwnProperty(slug)) {
        var aPropertyKeyPaths = [ propertyKeyPath ];
        var concept_wordSlug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;
        var oConcept = window.lookupWordBySlug[concept_wordSlug];
        var concept_conceptSlug = oConcept.conceptData.slug;
        var propertySlug = MiscFunctions.fetchPropertySlugFromKeyPath(concept_conceptSlug,aPropertyKeyPaths)
        console.log("renderForm: propertySlug: "+propertySlug)
        var oWord = window.lookupWordBySlug[propertySlug];
        // if slug for this property has not been recorded, then use the propertyKeyPath to find it
        // (future: make a patter-action to do this)
    }
    var oSchema = {
      "type": "object",
      "properties": {}
    };
    oSchema.properties.varType = {}
    oSchema.properties.varType.type = "string";
    oSchema.properties.varType.default = varType
    oSchema.properties.varNum = {}
    oSchema.properties.varNum.type = "integer";
    oSchema.properties.varNum.default = p
    oSchema.properties.propertySlug = {}
    oSchema.properties.propertySlug.type = "string";
    oSchema.properties.propertySlug.default = slug
    oSchema.properties.propertyKeyPath = {}
    oSchema.properties.propertyKeyPath.type = "string";
    oSchema.properties.propertyKeyPath.default = propertyKeyPath
    if (oWord.hasOwnProperty("propertyData")) {
        oSchema.properties.propertyValue = oWord.propertyData;
    }
    if (oWord.hasOwnProperty("JSONSchemaData")) {
        oSchema = oWord;
    }

    if (varType=="independent") {
        var formElem = "independentVariablesFormsContainer_"+p;
    }
    if (varType=="dependent") {
        var formElem = "dependentVariablesFormsContainer_"+p;
    }
    ReactDOM.render(<Form
        validator={validator}
        schema={oSchema}
        onSubmit={onFormSubmit}
        onChange={onFormChange}
        uiSchema={uiSchema}
    />,
        document.getElementById(formElem)
    )
}

const updateTemplateRawfile = (formData) => {
    var actionType = jQuery("#newOrExistingSelector option:selected").data("actiontype");

    if (actionType == "makeNew") {
        var sNewTemplate = jQuery("#newTemplateRawfile_edited").val();
        var oTemplate = JSON.parse(sNewTemplate);
    }
    if (actionType == "editExisting") {
        var sNewTemplate = jQuery("#existingTemplateRawfile_edited").val();
        var oTemplate = JSON.parse(sNewTemplate);
    }

    if (formData) {
        var varType = formData.varType;
        var varNum = formData.varNum;
        var propertyValue = formData.propertyValue;
        var propertySlug = formData.propertySlug;
        var propertyKeyPath = formData.propertyKeyPath;

        if (varType=="dependent") {
            if (oTemplate.templateData.dependentVariables[varNum] == null) {
                oTemplate.templateData.dependentVariables[varNum] = {};
            }
            oTemplate.templateData.dependentVariables[varNum].propertyKeyPath = propertyKeyPath;
            oTemplate.templateData.dependentVariables[varNum].propertySlug = propertySlug;
            oTemplate.templateData.dependentVariables[varNum].value = propertyValue;
        }
        if (varType=="independent") {
            oTemplate.templateData.independentVariable.propertyKeyPath = propertyKeyPath;
            oTemplate.templateData.independentVariable.propertySlug = propertySlug;
            oTemplate.templateData.independentVariable.value = propertyValue;
        }
    }
    var childTemplatePropertyPath = window.templating.childTemplatePropertyPath;
    var childTemplateConceptSlug = window.templating.childTemplateConceptSlug;

    var currentTemplateNameField = jQuery("#currentTemplateNameField").val();
    var currentTemplateDescriptionField = jQuery("#currentTemplateDescriptionField").val();

    if (actionType=="makeNew") {
        oTemplate.templateData.independentVariable.value = currentTemplateNameField
    }

    if (actionType=="makeNew") {
        oTemplate[childTemplatePropertyPath].name = currentTemplateNameField;
        oTemplate[childTemplatePropertyPath].title = MiscFunctions.convertNameToTitle(currentTemplateNameField);
        oTemplate[childTemplatePropertyPath].slug = MiscFunctions.convertNameToSlug(currentTemplateNameField);
        oTemplate[childTemplatePropertyPath].description = currentTemplateDescriptionField;

        var currentTemplateTitleField = MiscFunctions.convertNameToTitle(currentTemplateNameField);
        var currentTemplateSlugField = MiscFunctions.convertNameToSlug(currentTemplateNameField);
        oTemplate.templateData.name = currentTemplateNameField;
        oTemplate.templateData.title = currentTemplateTitleField
        oTemplate.templateData.slug = currentTemplateSlugField;
        oTemplate.templateData.description = currentTemplateDescriptionField;

        var ipns = oTemplate.metaData.ipns;

        oTemplate.wordData.name = childTemplateConceptSlug + ": " + currentTemplateNameField;
        oTemplate.wordData.title = childTemplateConceptSlug[0].toUpperCase() + childTemplateConceptSlug.substring(1) + ": " + currentTemplateTitleField;
        oTemplate.wordData.slug = childTemplateConceptSlug + "_" + currentTemplateSlugField + "_" + ipns.slice(-6);
        oTemplate.wordData.description = currentTemplateDescriptionField;
    }

    // If templateData basic fields (name, title, etc) are blank, copy them from e.g. ratingTemplateData
    var templateConcept_wordSlug = jQuery("#templateConceptWordSlugContainer").html();
    var oTemplateConcept = window.lookupWordBySlug[templateConcept_wordSlug];
    var templateConceptPropertyPath = oTemplateConcept.conceptData.propertyPath;
    // var templateConcept_conceptName = oTemplateConcept.conceptData.name.singular;
    if (!oTemplate.templateData.slug) {
        oTemplate.templateData.slug = oTemplate[templateConceptPropertyPath].slug
    }
    if (!oTemplate.templateData.name) {
        oTemplate.templateData.name = oTemplate[templateConceptPropertyPath].name
    }
    if (!oTemplate.templateData.title) {
        oTemplate.templateData.title = oTemplate[templateConceptPropertyPath].title
    }

    var concept_wordSlug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;
    var oConcept = window.lookupWordBySlug[concept_wordSlug];
    if (!oTemplate.templateData.templatedConcept.wordSlug) {
        oTemplate.templateData.templatedConcept.wordSlug = concept_wordSlug;
    }
    if (!oTemplate.templateData.templatedConcept.conceptName) {
        oTemplate.templateData.templatedConcept.conceptName = oConcept.conceptData.name;
    }
    if (!oTemplate.wordData.wordTypes.includes("template")) {
        oTemplate.wordData.wordTypes.push("template")
    }

    var sNewTemplate_updated = JSON.stringify(oTemplate,null,4);
    if (actionType=="makeNew") {
        jQuery("#newTemplateRawfile_edited").val(sNewTemplate_updated);
    }
    if (actionType=="editExisting") {
        jQuery("#existingTemplateRawfile_edited").val(sNewTemplate_updated);
    }
}

const populatePreexistingTemplateRawFile = () => {
    var template_wordSlug = jQuery("#existingTemplateSelector option:selected").data("wordslug")
    var oTemplate = window.lookupWordBySlug[template_wordSlug];

    var aTopLevelProperties = [ "wordData", "templateData", "_REMAINDER_", "globalDynamicData", "metaData" ]
    oTemplate = MiscFunctions.reorderTopLevelProperties(oTemplate,aTopLevelProperties)

    jQuery("#existingTemplateRawfile_unedited").val(JSON.stringify(oTemplate,null,4))
    jQuery("#existingTemplateRawfile_edited").val(JSON.stringify(oTemplate,null,4))
}
const makeExistingTemplateSelector = (templateConcept_wordSlug) => {
    var oTemplatingConcept = window.lookupWordBySlug[templateConcept_wordSlug];
    var superset_slug = oTemplatingConcept.conceptData.nodes.superset.slug;
    var oSuperset = window.lookupWordBySlug[superset_slug];
    var aTemplates = oSuperset.globalDynamicData.specificInstances;
    var selectorHTML = "";
    selectorHTML += "<select id='existingTemplateSelector' >";
    for (var t=0;t < aTemplates.length;t++) {
        var nextTemplate_slug = aTemplates[t];
        var oNextTemplate = window.lookupWordBySlug[nextTemplate_slug];
        if (!oNextTemplate.hasOwnProperty("templateData")) {
            var templateConcept_wordSlug = jQuery("#templateConceptWordSlugContainer").html();
            var oTemplateConcept = window.lookupWordBySlug[templateConcept_wordSlug];
            var templateConceptPropertyPath = oTemplateConcept.conceptData.propertyPath;
            console.log("templateConceptPropertyPath: "+templateConceptPropertyPath)
            var oNewTemplate = MiscFunctions.cloneObj(window.lookupWordTypeTemplate["template"]);
            var oNewTemplate_templateData = oNewTemplate.templateData;
            oNextTemplate.templateData = MiscFunctions.cloneObj(oNewTemplate_templateData)
            var aTopLevelProperties = [ "wordData", "templateData", "_REMAINDER_", "globalDynamicData", "metaData" ]
            oNextTemplate = MiscFunctions.reorderTopLevelProperties(oNextTemplate,aTopLevelProperties)
            var template_templateName = oNextTemplate[templateConceptPropertyPath].name;
            var template_templateSlug = oNextTemplate[templateConceptPropertyPath].slug;
            var template_templateTitle = oNextTemplate[templateConceptPropertyPath].title;
        }
        if (oNextTemplate.hasOwnProperty("templateData")) {
            var template_templateName = oNextTemplate.templateData.name;
            var template_templateSlug = oNextTemplate.templateData.slug;
            var template_templateTitle = oNextTemplate.templateData.title;
        }
        selectorHTML += "<option ";
        selectorHTML += " data-wordslug='"+nextTemplate_slug+"' ";
        selectorHTML += " data-templateslug='"+template_templateSlug+"' ";
        selectorHTML += " data-templatename='"+template_templateName+"' ";
        selectorHTML += " data-templatetitle='"+template_templateTitle+"' ";
        selectorHTML += " >";
        if (template_templateName) { selectorHTML += template_templateName; } else { selectorHTML += nextTemplate_slug; }
        selectorHTML += "</option>";
    }
    selectorHTML += "</select>";
    jQuery("#editExistingTemplateSelectorContainer").html(selectorHTML)
    populatePreexistingTemplateRawFile()
    jQuery("#existingTemplateSelector").change(function(){
        populatePreexistingTemplateRawFile();
    })
}

export default class MakeNewTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var concept_wordSlug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;
        var oConcept = window.lookupWordBySlug[concept_wordSlug];
        var concept_conceptName = oConcept.conceptData.name;

        var templateCreationEnabled = false;
        var aPrimaryFields = [];
        var aDependentFields = [];
        if (oConcept.conceptData.hasOwnProperty("templating")) {
            var oTemplatingData = oConcept.conceptData.templating
            templateCreationEnabled = oTemplatingData.templateCreationEnabled
        }
        jQuery("#isThisConceptTemplatable").html(templateCreationEnabled)
        if (templateCreationEnabled) {
            var templateConcept_wordSlug = oTemplatingData.templatingConcept.wordSlug;
            jQuery("#templateConceptWordSlugContainer").html(templateConcept_wordSlug)
            var templateConcept_conceptSlug = oTemplatingData.templatingConcept.conceptSlug;
            var oTemplatingConcept = window.lookupWordBySlug[templateConcept_wordSlug];
            var propertyPath = oTemplatingConcept.conceptData.propertyPath;
            window.templating.childTemplatePropertyPath = propertyPath;
            window.templating.childTemplateConceptSlug = templateConcept_conceptSlug;
            var aParentJSONSchemaSequence_templateConcept = oTemplatingConcept.globalDynamicData.valenceData.parentJSONSchemaSequence;
            console.log("aParentJSONSchemaSequence_templateConcept: "+JSON.stringify(aParentJSONSchemaSequence_templateConcept,null,4))
            // future: use aParentJSONSchemaSequence_templateConcept to generate oNewTemplate
            // Need to complete MiscFunctions.createNewWordFromSchemas which will take aParentJSONSchemaSequence_templateConcept as input
            // Or could make alternate function which takes array of propertyPaths as input
            // For now, use MiscFunctions.createNewWordByTemplate(newWordWordType)
            var newWordWordType = oTemplatingConcept.conceptData.slug;
            if (!window.lookupWordTypeTemplate.hasOwnProperty(newWordWordType)) {
                var newWordWordType = "template";
            }
            var oNewTemplate = await MiscFunctions.createNewWordByTemplate(newWordWordType)
            oNewTemplate.templateData.templatedConcept.wordSlug = concept_wordSlug;
            oNewTemplate.templateData.templatedConcept.conceptName = concept_conceptName;
            oNewTemplate.wordData.wordTypes.push(templateConcept_conceptSlug);
            oNewTemplate.wordData.wordType = templateConcept_conceptSlug;

            var aTopLevelProperties = [ "wordData", "templateData", "_REMAINDER_", "globalDynamicData", "metaData" ]
            oNewTemplate = MiscFunctions.reorderTopLevelProperties(oNewTemplate,aTopLevelProperties)

            var sNewTemplate = JSON.stringify(oNewTemplate,null,4);
            jQuery("#newTemplateRawfile_unedited").val(sNewTemplate);
            jQuery("#newTemplateRawfile_edited").val(sNewTemplate);

            aPrimaryFields = oConcept.conceptData.templating.primaryFields
            var varType = "independent";
            jQuery("#independentVariablesFormsBox").html("")
            for (var p=0;p<aPrimaryFields.length;p++) {
                var containerHTML = "";
                containerHTML += "<div id='independentVariablesFormsContainer_"+p+"' ";
                containerHTML += " >independentVariablesFormsContainer</div>";
                jQuery("#independentVariablesFormsBox").append(containerHTML)
                var oNextPrimaryField = aPrimaryFields[p];
                var propertyKeyPath = oNextPrimaryField.propertyKeyPath;
                var property_wordSlug = oNextPrimaryField.property.wordSlug;
                renderForm(varType,p,property_wordSlug,propertyKeyPath)
            }
            aDependentFields = oConcept.conceptData.templating.dependentFields
            var varType = "dependent";
            jQuery("#dependentVariablesFormsBox").html("")
            for (var p=0;p<aDependentFields.length;p++) {
                var containerHTML = "";
                containerHTML += "<div id='dependentVariablesFormsContainer_"+p+"' ";
                containerHTML += " >dependentVariablesFormsContainer</div>";
                jQuery("#dependentVariablesFormsBox").append(containerHTML)
                var oNextField = aDependentFields[p];
                var propertyKeyPath = oNextField.propertyKeyPath;
                var property_wordSlug = oNextField.property.wordSlug;
                renderForm(varType,p,property_wordSlug,propertyKeyPath)
            }
            jQuery("#newOrExistingSelector").change(function(){
                var actionType = jQuery("#newOrExistingSelector option:selected").data("actiontype");
                if (actionType == "makeNew") {
                    jQuery(".newTemplateBoxesToToggle").css("display","block")
                    jQuery(".existingTemplateBoxesToToggle").css("display","none")
                }
                if (actionType == "editExisting") {
                    jQuery(".newTemplateBoxesToToggle").css("display","none")
                    jQuery(".existingTemplateBoxesToToggle").css("display","block")
                }
            })
            jQuery("#topLevelPropertiesContainer").change(function(){
                updateTemplateRawfile(null);
            })
            jQuery(".existingTemplateBoxesToToggle").css("display","none")
            makeExistingTemplateSelector(templateConcept_wordSlug);
        }
        jQuery("#saveNewTemplateButton").click(function(){
            console.log("saveNewTemplateButton clicked")
            // need to save new word as well as add it to the proper schema
        })
        jQuery("#updateExistingTempleteButton").click(function(){
            console.log("updateExistingTempleteButton clicked")
            var sUpdatedTemplate = jQuery("#existingTemplateRawfile_edited").val()
            var oUpdatedTemplate = JSON.parse(sUpdatedTemplate);
            MiscFunctions.createOrUpdateWordInAllTables(oUpdatedTemplate)
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Make New / Edit Existing Template (add a conditional constraint)</div>
                        <div>
                            <div>
                                Templatable: <div id="isThisConceptTemplatable" style={{display:"inline-block"}}>isThisConceptTemplatable</div>
                                <div id="templateConceptWordSlugContainer" style={{display:"block"}}>templateConceptWordSlugContainer</div>
                            </div>

                            <div >
                                <select id="newOrExistingSelector" >
                                    <option data-actiontype="makeNew" >Make New</option>
                                    <option data-actiontype="editExisting" >Edit Existing</option>
                                </select>
                                <div className="newTemplateBoxesToToggle" >
                                    <center>Make New</center>
                                    <div id="topLevelPropertiesContainer" >
                                        <div>
                                            <div className="makeNewLeftPanel">
                                            template name
                                            </div>
                                            <textarea id="currentTemplateNameField" className="makeNewRightPanel">
                                            </textarea>
                                        </div>

                                        <div>
                                            <div className="makeNewLeftPanel">
                                            description
                                            </div>
                                            <textarea id="currentTemplateDescriptionField" className="makeNewRightPanel" style={{height:"100px"}} >
                                            </textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="existingTemplateBoxesToToggle" >
                                    <center>or: Edit Existing</center>
                                    <div id="editExistingTemplateSelectorContainer">editExistingTemplateSelectorContainer</div>
                                    <div id="independentVariablesFormsBox" style={{display:"inline-block",width:"500px",padding:"10px",maxHeight:"300px",overflow:"scroll",marginLeft:"300px",border:"1px dashed grey"}} >
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div style={{display:"inline-block",width:"500px",height:"900px",overflow:"scroll"}}  >
                            <div id="dependentVariablesFormsBox" style={{display:"inline-block",width:"95%",padding:"10px",height:"400px",overflow:"scroll",border:"1px dashed grey"}} >
                            </div>

                            <div className="newTemplateBoxesToToggle" >
                                <center>new word template</center>
                                <textarea id="newTemplateRawfile_unedited" style={{display:"inline-block",width:"95%",height:"200px",overflow:"scroll"}} >
                                </textarea>
                            </div>

                            <div className="existingTemplateBoxesToToggle" >
                                <center>preexisting word to edit</center>
                                <textarea id="existingTemplateRawfile_unedited" style={{display:"inline-block",width:"95%",height:"200px",overflow:"scroll"}} >
                                </textarea>
                            </div>
                        </div>

                        <div style={{display:"inline-block",width:"700px",height:"900px",overflow:"scroll"}} >
                            <div className="newTemplateBoxesToToggle" >
                                <center>new word</center>
                                <div id='saveNewTemplateButton' className="doSomethingButton" >save new template</div>
                                <textarea id="newTemplateRawfile_edited" style={{display:"inline-block",width:"95%",height:"700px",overflow:"scroll"}} >
                                </textarea>
                            </div>
                            <div className="existingTemplateBoxesToToggle" >
                                <center>existing template</center>
                                <div id="updateExistingTempleteButton" className="doSomethingButton" >update existing template</div>
                                <textarea id="existingTemplateRawfile_edited" style={{display:"inline-block",width:"95%",height:"700px",overflow:"scroll"}} >
                                </textarea>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
