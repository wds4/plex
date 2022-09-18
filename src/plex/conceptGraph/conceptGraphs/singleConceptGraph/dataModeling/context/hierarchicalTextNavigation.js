import React from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/singleConceptGraph_context_leftNav2.js';
import ReactJSONSchemaOldForm from 'react-jsonschema-form';
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");

const openChildrenContainer = (parentNode_slug) => {
    jQuery("#childrenNodesContainer_"+parentNode_slug).css("display","block")
}

const closeChildrenContainer = (parentNode_slug) => {
    jQuery("#childrenNodesContainer_"+parentNode_slug).css("display","none")
}

const generateTypeHTML = (nextNode_slug,lookupChildTypes,isTopLevel) => {
    var propertyPath = jQuery("#propertyPathContainer").html()

    var aChildren = lookupChildTypes[nextNode_slug]
    var numChildren = aChildren.length;

    var oNextNode = window.lookupWordBySlug[nextNode_slug];
    var nextNode_name = oNextNode[propertyPath].name;
    var nextNodeHTML = "";
    nextNodeHTML += "<div style='padding:2px;";
    nextNodeHTML += "' > ";
        nextNodeHTML += "<div>";
            nextNodeHTML += "<div id='toggleChildrenOfTypesButton_"+nextNode_slug+"' data-slug='"+nextNode_slug+"' data-status='closed' class='toggleChildrenOfTypesButton' >";
            nextNodeHTML += numChildren;
            nextNodeHTML += "</div>";

            nextNodeHTML += "<div id='typeNameContainer_"+nextNode_name+"' data-slug='"+nextNode_slug+"' class='typeNameContainer' >";
            nextNodeHTML += nextNode_name
            nextNodeHTML += "</div>";
        nextNodeHTML += "</div>";
        nextNodeHTML += "<div id='childrenNodesContainer_"+nextNode_slug+"' data-parentslug='"+nextNode_slug+"' class='childrenNodesContainer' style='display:none;' >";
        for (var c=0;c<aChildren.length;c++) {
            var nextChildNode_slug = aChildren[c];
            // nextNodeHTML += nextChildNode_slug + "<br>";
            nextNodeHTML += generateTypeHTML(nextChildNode_slug,lookupChildTypes,false)
        }
        // nextNodeHTML += "childrenNodesContainer";
        nextNodeHTML += "</div>";
    nextNodeHTML += "</div>";

    return nextNodeHTML;
}
const generateFullHierarchy = (oDataModelSchema) => {
    var aNodes = oDataModelSchema.schemaData.nodes;
    var aRels = oDataModelSchema.schemaData.relationships;
    var lookupChildTypes = {};
    var lookupParentTypes = {};
    for (var n=0;n<aNodes.length;n++) {
        var nextNode_slug = aNodes[n].slug;
        if (!lookupChildTypes.hasOwnProperty(nextNode_slug)) {
            lookupChildTypes[nextNode_slug] = [];
        }
        if (!lookupParentTypes.hasOwnProperty(nextNode_slug)) {
            lookupParentTypes[nextNode_slug] = [];
        }
    }
    for (var r=0;r<aRels.length;r++) {
        var oNextRel = aRels[r];
        var relType = oNextRel.relationshipType.slug;
        if (relType="isAChildContextOf") {
            var childNode_slug = oNextRel.nodeFrom.slug;
            var parentNode_slug = oNextRel.nodeTo.slug;
            if (!lookupChildTypes[parentNode_slug].includes(childNode_slug)) {
                lookupChildTypes[parentNode_slug].push(childNode_slug)
            }
            if (!lookupParentTypes[childNode_slug].includes(parentNode_slug)) {
                lookupParentTypes[childNode_slug].push(parentNode_slug)
            }
        }
    }
    // a topLevelType is a node that has no parents
    var aTopLevelTypes = [];
    for (var n=0;n<aNodes.length;n++) {
        var nextNode_slug = aNodes[n].slug;
        var numParentNodes =lookupParentTypes[nextNode_slug]
        if (numParentNodes==0) {
            aTopLevelTypes.push(nextNode_slug);
        }
    }
    console.log("aTopLevelTypes: "+JSON.stringify(aTopLevelTypes,null,4))

    for (var n=0;n<aTopLevelTypes.length;n++) {
        var nextNode_slug = aTopLevelTypes[n];
        var nextNodeHTML = generateTypeHTML(nextNode_slug,lookupChildTypes,true)
        jQuery("#fullHierarchyContainer").append(nextNodeHTML)
    }
    jQuery(".toggleChildrenOfTypesButton").click(function(){
        var node_slug = jQuery(this).data("slug")
        processClickedToggleButton(node_slug);
    })

    var finishedAddingChildTypes = false;
    do {
        finishedAddingChildTypes = true;
        for (var n=0;n<aNodes.length;n++) {
            var parentNode_slug = aNodes[n].slug;
            var aChildNodes =lookupChildTypes[parentNode_slug]
        }
    } while (!finishedAddingChildTypes);
}

const processClickedToggleButton = (node_slug) => {
    var status = jQuery("#toggleChildrenOfTypesButton_"+node_slug).data("status")
    console.log("node_slug: "+node_slug+"; status: "+status)
    if (status=="closed") {
        jQuery("#toggleChildrenOfTypesButton_"+node_slug).data("status","open")
        openChildrenContainer(node_slug)
    }
    if (status=="open") {
        jQuery("#toggleChildrenOfTypesButton_"+node_slug).data("status","closed")
        closeChildrenContainer(node_slug)
    }
}
export default class SchemaOrgTextNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        // var dataModel_wordSlug = "dataModel_context_6x1dee";
        var dataModel_wordSlug = "wordTypeFor_contextGraph";
        var oDataModel = window.lookupWordBySlug[dataModel_wordSlug];
        var dataModelRuleset = oDataModel.dataModelData.ruleset;
        if (dataModelRuleset=="grapevine context 1.0") {
            var dataModelSchema_wordSlug = oDataModel.dataModelData.dataModelSchema.slug;
            console.log("dataModelSchema_wordSlug: "+dataModelSchema_wordSlug)
            var oDataModelSchema = window.lookupWordBySlug[dataModelSchema_wordSlug];
            jQuery("#dataModelSchemaRawFileContainer").val(JSON.stringify(oDataModelSchema,null,4))
            var oPrincipleDataTypes = oDataModel.dataModelData.principleDataTypes;
            var concept_types_wordSlug = oPrincipleDataTypes.context.concept_wordSlug;
            var oConcept_types = window.lookupWordBySlug[concept_types_wordSlug];
            var propertyPath = oConcept_types.conceptData.propertyPath;
            jQuery("#propertyPathContainer").html(propertyPath)
            generateFullHierarchy(oDataModelSchema)
        }
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Context Tree: Hierarchical Text Navigation</div>

                        <div id="propertyPathContainer">propertyPathContainer</div>

                        <div style={{display:"inline-block",width:"600px",height:"800px",border:"1px dashed grey"}} >
                            <center>Context Full Hierarchy</center>
                            <div id="fullHierarchyContainer" style={{overflow:"scroll"}} ></div>
                        </div>
                        <div style={{display:"inline-block",width:"600px",height:"800px",border:"1px dashed grey"}} >
                            <textarea id="dataModelSchemaRawFileContainer" style={{display:"inline-block",width:"95%",height:"700px"}} >dataModelSchemaRawFileContainer</textarea>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
