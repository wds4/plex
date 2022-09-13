import React from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../../navbars/leftNavbar2/singleConceptGraph_schemaOrg_typeRelationships_leftNav2.js';
import ReactJSONSchemaOldForm from 'react-jsonschema-form';
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import * as MiscFunctions from '../../../../../../functions/miscFunctions.js';
import sendAsync from '../../../../../../renderer.js';

const jQuery = require("jquery");

const makeTypeSelectors = (oConcept_types) => {
    var superset_types_wordSlug = oConcept_types.conceptData.nodes.superset.slug;
    var oSuperset_types = window.lookupWordBySlug[superset_types_wordSlug];
    var aTypes = oSuperset_types.globalDynamicData.specificInstances;
    var propertyPath = oConcept_types.conceptData.propertyPath;
    jQuery("#propertyPathContainer").html(propertyPath)

    var selector1HTML = "";
    var selector2HTML = "";

    selector1HTML += "<select id='parentTypeSelector' >";
    selector2HTML += "<select id='childTypeSelector' >";

    var nextTypeHTML = "";
    for (var t=0;t<aTypes.length;t++) {
        var nextType_wordSlug = aTypes[t];
        var oNextType = window.lookupWordBySlug[nextType_wordSlug]
        var name = oNextType[propertyPath].name;
        nextTypeHTML = "";
        nextTypeHTML += "<option ";
        nextTypeHTML += " data-slug='"+nextType_wordSlug+"' ";
        nextTypeHTML += " >";
        nextTypeHTML += name;
        nextTypeHTML += "</option>";

        selector1HTML += nextTypeHTML;
        selector2HTML += nextTypeHTML;
    }

    selector1HTML += "</select>";
    selector2HTML += "</select>";

    jQuery("#parentTypeSelectorContainer").html(selector1HTML)
    jQuery("#childTypeSelectorContainer").html(selector2HTML)
}

const addRelationshipToRawFile = (specializedRelType) => {
    var selectedParentType_slug = jQuery("#parentTypeSelector option:selected").data("slug")
    var selectedChildType_slug = jQuery("#childTypeSelector option:selected").data("slug")
    var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
    oNewRel.nodeFrom.slug = selectedChildType_slug;
    oNewRel.relationshipType.slug = specializedRelType;
    oNewRel.nodeTo.slug = selectedParentType_slug;
    console.log("oNewRel: "+JSON.stringify(oNewRel,null,4))

    var sDataModelSchema = jQuery("#dataModelSchemaRawFileContainer_edited").val()
    var oDataModelSchema = JSON.parse(sDataModelSchema)
    oDataModelSchema = MiscFunctions.updateSchemaWithNewRel(oDataModelSchema,oNewRel,window.lookupWordBySlug)
    jQuery("#dataModelSchemaRawFileContainer_edited").val(JSON.stringify(oDataModelSchema,null,4))

    var oParent = window.lookupWordBySlug[selectedParentType_slug];
    var oChild = window.lookupWordBySlug[selectedChildType_slug];
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

export default class MakeNewSchemaOrgRelationship extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var dataModel_wordSlug = "dataModel_schema.org_fu88nw";
        var oDataModel = window.lookupWordBySlug[dataModel_wordSlug];
        jQuery("#dataModelRawFileContainer_unedited").val(JSON.stringify(oDataModel,null,4))
        var dataModelRuleset = oDataModel.dataModelData.ruleset;
        var specializedRelType = "foo";
        if (dataModelRuleset=="schema.org") {
            var dataModelSchema_wordSlug = oDataModel.dataModelData.dataModelSchema.slug;
            var oDataModelSchema = window.lookupWordBySlug[dataModelSchema_wordSlug];
            jQuery("#dataModelSchemaRawFileContainer_unedited").val(JSON.stringify(oDataModelSchema,null,4))
            jQuery("#dataModelSchemaRawFileContainer_edited").val(JSON.stringify(oDataModelSchema,null,4))
            var oPrincipleDataTypes = oDataModel.dataModelData.principleDataTypes;
            // console.log("oPrincipleDataTypes: "+JSON.stringify(oPrincipleDataTypes,null,4))
            var concept_types_wordSlug = oPrincipleDataTypes.type.concept_wordSlug;
            // console.log("concept_types_wordSlug: "+concept_types_wordSlug)
            var oConcept_types = window.lookupWordBySlug[concept_types_wordSlug];
            var aSpecializedRelType = oDataModel.dataModelData.specializedRelationshipTypes;
            var specializedRelType = aSpecializedRelType[0];
            makeTypeSelectors(oConcept_types);
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
                        <div class="h2">Schema.org: Make New type-to-type Relationship</div>

                        <div>
                            <div id="propertyPathContainer">propertyPathContainer</div>
                            <div style={{display:"inline-block",width:"600px",height:"500px"}} >
                                parent: <div id="parentTypeSelectorContainer" >parentTypeSelectorContainer</div>
                                child: <div id="childTypeSelectorContainer" >childTypeSelectorContainer</div>
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
