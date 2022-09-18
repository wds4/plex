import React from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../../navbars/leftNavbar2/singleConceptGraph_context_contextRelationships_leftNav2.js';
import ReactJSONSchemaOldForm from 'react-jsonschema-form';
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import * as MiscFunctions from '../../../../../../functions/miscFunctions.js';
import sendAsync from '../../../../../../renderer.js';

const jQuery = require("jquery");

const makeContextSelectors = (oConcept_types) => {
    var superset_types_wordSlug = oConcept_types.conceptData.nodes.superset.slug;
    var oSuperset_types = window.lookupWordBySlug[superset_types_wordSlug];
    var aContexts = oSuperset_types.globalDynamicData.specificInstances;
    var propertyPath = oConcept_types.conceptData.propertyPath;
    jQuery("#propertyPathContainer").html(propertyPath)

    var selector1HTML = "";
    var selector2HTML = "";

    selector1HTML += "<select id='parentContextSelector' >";
    selector2HTML += "<select id='childContextSelector' >";

    var nextContextHTML = "";
    for (var t=0;t<aContexts.length;t++) {
        var nextContext_wordSlug = aContexts[t];
        var oNextContext = window.lookupWordBySlug[nextContext_wordSlug]
        var name = oNextContext[propertyPath].name;
        nextContextHTML = "";
        nextContextHTML += "<option ";
        nextContextHTML += " data-slug='"+nextContext_wordSlug+"' ";
        nextContextHTML += " >";
        nextContextHTML += name;
        nextContextHTML += "</option>";

        selector1HTML += nextContextHTML;
        selector2HTML += nextContextHTML;
    }

    selector1HTML += "</select>";
    selector2HTML += "</select>";

    jQuery("#parentContextSelectorContainer").html(selector1HTML)
    jQuery("#childContextSelectorContainer").html(selector2HTML)
}

const addRelationshipToRawFile = (specializedRelType) => {
    var selectedParentContext_slug = jQuery("#parentContextSelector option:selected").data("slug")
    var selectedChildContext_slug = jQuery("#childContextSelector option:selected").data("slug")
    var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
    oNewRel.nodeFrom.slug = selectedChildContext_slug;
    oNewRel.relationshipType.slug = specializedRelType;
    oNewRel.nodeTo.slug = selectedParentContext_slug;
    console.log("oNewRel: "+JSON.stringify(oNewRel,null,4))

    var sDataModelSchema = jQuery("#dataModelSchemaRawFileContainer_edited").val()
    var oDataModelSchema = JSON.parse(sDataModelSchema)
    oDataModelSchema = MiscFunctions.updateSchemaWithNewRel(oDataModelSchema,oNewRel,window.lookupWordBySlug)
    jQuery("#dataModelSchemaRawFileContainer_edited").val(JSON.stringify(oDataModelSchema,null,4))

    var oParent = window.lookupWordBySlug[selectedParentContext_slug];
    var oChild = window.lookupWordBySlug[selectedChildContext_slug];
    var propertyPath = jQuery("#propertyPathContainer").html()
    var parentName = oParent[propertyPath].name;
    var childName = oChild[propertyPath].name;
    var summaryHTML = "";
    summaryHTML += "<div style='background-color:#DFDFDF;' >";
        summaryHTML += "<div style='display:inline-block;width:200px' >";
        summaryHTML += parentName
        summaryHTML += "</div>";

        summaryHTML += "<div style='display:inline-block;width:200px' >";
        summaryHTML += childName
        summaryHTML += "</div>";
    summaryHTML += "</div>";
    jQuery("#newRelationshipsContainer").append(summaryHTML)
}

const updateDataModelSchema = () => {
    var sDataModelSchema = jQuery("#dataModelSchemaRawFileContainer_edited").val()
    var oDataModelSchema = JSON.parse(sDataModelSchema)
    MiscFunctions.createOrUpdateWordInAllTables(oDataModelSchema);
}

const makeContextGraphSelector = (oCgSuperset) => {
    var aSpecificInstances = oCgSuperset.globalDynamicData.specificInstances;
    var selectorHTML = "";
    selectorHTML += "<select id='contextGraphSelector' >";
    for (var z=0;z<aSpecificInstances.length;z++) {
        var nextSi_slug = aSpecificInstances[z];
        var oNextSi = window.lookupWordBySlug[nextSi_slug];
        var nextSi_contextGraphName = oNextSi.contextGraphData.name;
        selectorHTML += "<option ";
        selectorHTML += " data-slug='"+nextSi_slug+"' ";
        selectorHTML += " >";
        selectorHTML += nextSi_contextGraphName;
        selectorHTML += "</option>";
    }
    selectorHTML += "</select>";

    jQuery("#contextGraphSelectorContainer").html(selectorHTML)
    populateContextGraphRawFile()
    jQuery("#contextGraphSelector").change(function(){
        populateContextGraphRawFile()
    })
}

const populateContextGraphRawFile = () => {
    var dataModelSchema_wordSlug = jQuery("#contextGraphSelector option:selected").data("slug")
    var oDataModelSchema = window.lookupWordBySlug[dataModelSchema_wordSlug];
    jQuery("#dataModelSchemaRawFileContainer_unedited").val(JSON.stringify(oDataModelSchema,null,4))
    jQuery("#dataModelSchemaRawFileContainer_edited").val(JSON.stringify(oDataModelSchema,null,4))
}

export default class MakeNewSchemaOrgRelationship extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var contextGraph_wordSlug = "conceptFor_contextGraph_svvy7z";
        var oCgConcept = window.lookupWordBySlug[contextGraph_wordSlug];
        var cgWordType_slug = oCgConcept.conceptData.nodes.wordType.slug;
        var cgSuperset_slug = oCgConcept.conceptData.nodes.superset.slug;
        var oCgSuperset = window.lookupWordBySlug[cgSuperset_slug];
        // var dataModel_wordSlug = "dataModel_context_6x1dee";
        // var dataModel_wordSlug = "wordTypeFor_contextGraph";
        var oDataModel = window.lookupWordBySlug[cgWordType_slug];
        jQuery("#dataModelRawFileContainer_unedited").val(JSON.stringify(oDataModel,null,4))
        var dataModelRuleset = oDataModel.dataModelData.ruleset;
        var specializedRelType = "foo";
        makeContextGraphSelector(oCgSuperset);
        if (dataModelRuleset=="grapevine context 1.0") {
            var oPrincipleDataTypes = oDataModel.dataModelData.principleDataTypes;
            var concept_contexts_wordSlug = oPrincipleDataTypes.context.concept_wordSlug;
            var oConcept_contexts = window.lookupWordBySlug[concept_contexts_wordSlug];
            var aSpecializedRelType = oDataModel.dataModelData.specializedRelationshipTypes;
            var specializedRelType = aSpecializedRelType[0];
            makeContextSelectors(oConcept_contexts);
        }
        jQuery("#addRelationshipButton").click(function(){
            console.log("addRelationshipButton clicked")
            addRelationshipToRawFile(specializedRelType)
        })
        jQuery("#updateDataModelSchemaButton").click(function(){
            console.log("updateDataModelSchemaButton clicked")
            updateDataModelSchema()
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
                        <div class="h2">Context: Make New context-to-context Relationship</div>

                        <div>
                            <div id="propertyPathContainer">propertyPathContainer</div>
                            <div style={{display:"inline-block",width:"600px",height:"500px"}} >
                                <div>
                                    <div style={{display:"inline-block"}}>select context graph to edit: </div>
                                    <div id="contextGraphSelectorContainer" style={{display:"inline-block"}}>contextGraphSelectorContainer</div>
                                </div>
                                parent context: <div id="parentContextSelectorContainer" >parentContextSelectorContainer</div>
                                child context: <div id="childContextSelectorContainer" >childContextSelectorContainer</div>
                                <div className="doSomethingButton" id="addRelationshipButton" >add relationship</div>
                                <div id="newRelationshipsContainer" >
                                    <div>
                                        <div style={{display:"inline-block",width:"200px"}} >parent</div>
                                        <div style={{display:"inline-block",width:"200px"}} >child</div>
                                    </div>
                                </div>
                                <div className="doSomethingButton" id="updateDataModelSchemaButton" >save changes</div>
                            </div>
                            <div style={{display:"inline-block",width:"600px",height:"500px"}} >
                                <textarea id="dataModelRawFileContainer_unedited" style={{display:"inline-block",border:"1px dashed grey",width:"95%",height:"450px"}} >dataModelRawFileContainer_unedited</textarea>
                            </div>
                        </div>

                        <div>
                            <textarea id="dataModelSchemaRawFileContainer_unedited" style={{display:"inline-block",border:"1px dashed grey",width:"600px",height:"500px"}} >dataModelSchemaRawFileContainer_unedited</textarea>
                            <textarea id="dataModelSchemaRawFileContainer_edited" style={{display:"inline-block",border:"1px dashed grey",width:"600px",height:"500px"}} >dataModelSchemaRawFileContainer_unedited</textarea>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
