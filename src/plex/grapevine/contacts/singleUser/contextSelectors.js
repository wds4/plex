import React, { useCallback, useState } from 'react';
import { NavLink, Link } from "react-router-dom";
import ReactDOM from 'react-dom';
import * as MiscFunctions from '../../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../../lib/ipfs/miscIpfsFunctions.js'
import { useDropzone } from "react-dropzone";
import { create, urlSource } from 'ipfs'

const jQuery = require("jquery");

const makeContextSelector = () => {
    console.log("makeContextSelector")
    var selectorHTML = "";
    selectorHTML += "<select id='contextSelector' >";
    var propertyPath = jQuery("#propertyPathContainer").html()

    var contextGraph_slug = jQuery("#influenceTypeSelector option:selected").data("contextgraphwordslug")
    var oContextGraph = window.lookupWordBySlug[contextGraph_slug]
    var aContexts = oContextGraph.schemaData.nodes;
    for (var z=0;z<aContexts.length;z++) {
        var oNC = aContexts[z];
        var nextContext_wordSlug = oNC.slug;
        var oNextContext = window.lookupWordBySlug[nextContext_wordSlug]
        var nextContext_contextName = oNextContext[propertyPath].name;
        var nextContext_ipns = oNextContext.metaData.ipns;
        var nextContext_name = oNextContext[propertyPath].name;
        var nextContext_title = oNextContext[propertyPath].title;
        selectorHTML += "<option ";
        selectorHTML += " data-contextwordslug='"+nextContext_wordSlug+"' ";
        selectorHTML += " data-contextipns='"+nextContext_ipns+"' ";
        selectorHTML += " data-contextname='"+nextContext_name+"' ";
        selectorHTML += " data-contexttitle='"+nextContext_title+"' ";
        selectorHTML += " >";
        selectorHTML += nextContext_contextName;
        selectorHTML += "</option>";
    }
    selectorHTML += "</select>";
    jQuery("#contextSelectorContainer").html(selectorHTML)



    generateFullHierarchy(oContextGraph)
}

const fetchInfluenceTypes = async (pCG0) => {

    var aResult = [];

    var pathToInfluenceTypes = pCG0 + "concepts/influenceType/superset/allSpecificInstances/slug/"
    console.log("fetchInfluenceTypes; pathToInfluenceTypes: "+pathToInfluenceTypes)
    for await (const file of MiscIpfsFunctions.ipfs.files.ls(pathToInfluenceTypes)) {
        var fileName = file.name;
        var fileType = file.type;
        console.log("fetchInfluenceTypes; file name: "+file.name)
        console.log("fetchInfluenceTypes; file type: "+file.type)
        if (fileType=="directory") {
            var pathToSpecificInstance = pathToInfluenceTypes + fileName + "/node.txt";
            for await (const siFile of MiscIpfsFunctions.ipfs.files.read(pathToSpecificInstance)) {
                var sNextSpecificInstanceRawFile = new TextDecoder("utf-8").decode(siFile);
                var oNextSpecificInstanceRawFile = JSON.parse(sNextSpecificInstanceRawFile);
                var nextInfluenceType_name = oNextSpecificInstanceRawFile.influenceTypeData.name;
                console.log("fetchInfluenceTypes; nextInfluenceType_name: "+nextInfluenceType_name)
                aResult.push(oNextSpecificInstanceRawFile)
            }
        }
    }
    return aResult;
}

const openChildrenContainer = (parentNode_slug) => {
    jQuery("#childrenNodesContainer_"+parentNode_slug).css("display","block")
}

const closeChildrenContainer = (parentNode_slug) => {
    jQuery("#childrenNodesContainer_"+parentNode_slug).css("display","none")
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

const generateTypeHTML = (nextNode_slug,lookupChildTypes,isTopLevel) => {
    var propertyPath = jQuery("#propertyPathContainer").html()

    var aChildren = lookupChildTypes[nextNode_slug]
    var numChildren = aChildren.length;

    var oNextNode = window.lookupWordBySlug[nextNode_slug];
    console.log("generateTypeHTML; nextNode_slug: "+nextNode_slug+"; oNextNode: "+JSON.stringify(oNextNode,null,4))
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
    console.log("generateFullHierarchy")
    jQuery("#fullHierarchyContainer").html("")
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

export default class ContextSelectors extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");

        var contextGraph_wordSlug = "conceptFor_contextGraph_svvy7z";
        var oCgConcept = window.lookupWordBySlug[contextGraph_wordSlug];
        var cgWordType_slug = oCgConcept.conceptData.nodes.wordType.slug;
        var oDataModel = window.lookupWordBySlug[cgWordType_slug];
        var oPrincipleDataTypes = oDataModel.dataModelData.principleDataTypes;
        var concept_types_wordSlug = oPrincipleDataTypes.context.concept_wordSlug;
        var oConcept_types = window.lookupWordBySlug[concept_types_wordSlug];
        var propertyPath = oConcept_types.conceptData.propertyPath;
        jQuery("#propertyPathContainer").html(propertyPath)

        var mainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug
        var oMainSchema = window.lookupWordBySlug[mainSchema_slug]
        var mainSchema_ipns = oMainSchema.metaData.ipns;
        var pCG = "/plex/conceptGraphs/";
        var pCG0 = pCG + mainSchema_ipns + "/";

        var aInfluenceTypes = await fetchInfluenceTypes(pCG0);
        console.log("aInfluenceTypes: "+JSON.stringify(aInfluenceTypes,null,4))
        var selectorHTML = "";
        selectorHTML += "<select id='influenceTypeSelector' >";
        for (var z=0;z<aInfluenceTypes.length;z++) {
            var oNextInfluenceType = aInfluenceTypes[z];
            var nextInfluenceType_name = oNextInfluenceType.influenceTypeData.name;
            var nextInfluenceType_title = oNextInfluenceType.influenceTypeData.title;
            var nextInfluenceType_wordSlug = oNextInfluenceType.wordData.slug;
            var nextInfluenceType_ipns = oNextInfluenceType.metaData.ipns;
            // console.log("oNextInfluenceType: "+JSON.stringify(oNextInfluenceType,null,4))
            var nextInfluenceType_associatedContextGraph_slug = oNextInfluenceType.influenceTypeData.contextGraph.slug;
            var oContextGraph = window.lookupWordBySlug[nextInfluenceType_associatedContextGraph_slug]
            var contextGraph_name = oContextGraph.contextGraphData.name;
            var contextGraph_title = oContextGraph.contextGraphData.title;
            var contextGraph_ipns = oContextGraph.metaData.ipns;
            selectorHTML += "<option ";
            selectorHTML += " data-contextgraphwordslug='"+nextInfluenceType_associatedContextGraph_slug+"' ";
            selectorHTML += " data-contextgraphname='"+contextGraph_name+"' ";
            selectorHTML += " data-contextgraphtitle='"+contextGraph_title+"' ";
            selectorHTML += " data-contextgraphipns='"+contextGraph_ipns+"' ";

            selectorHTML += " data-influencetypewordslug='"+nextInfluenceType_wordSlug+"' ";
            selectorHTML += " data-influencetypename='"+nextInfluenceType_name+"' ";
            selectorHTML += " data-influencetypetitle='"+nextInfluenceType_title+"' ";
            selectorHTML += " data-influencetypeipns='"+nextInfluenceType_ipns+"' ";
            selectorHTML += " >";
            selectorHTML += nextInfluenceType_name;
            selectorHTML += "</option>";
        }
        selectorHTML += "</select>";
        jQuery("#influenceTypeSelectorContainer").html(selectorHTML)
        makeContextSelector()
        jQuery("#influenceTypeSelector").change(function(){
            makeContextSelector()
        })
    }
    render() {

        return (
            <>
                <div>
                    <div style={{border:"1px dashed grey",display:"inline-block",width:"300px",height:"800px"}}>
                        <center>select trust / influence type</center>
                        <div id="influenceTypeSelectorContainer" ></div>
                        <div id="propertyPathContainer" style={{display:"none"}} >propertyPathContainer</div>
                        <center>select context</center>
                        <div id="contextSelectorContainer" ></div>
                        <div style={{border:"1px dashed purple",display:"inline-block",width:"95%",height:"500px",overflow:"scroll"}}>
                            <center>topics tree</center>
                            <div id="fullHierarchyContainer" style={{overflow:"scroll"}} ></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
