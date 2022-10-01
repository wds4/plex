import React, { useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/singleConcept_leftNav2.js';
import ReactJSONSchemaOldForm from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";

import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import sendAsync from '../../../../../renderer.js';
import * as VisStyleConstants from '../../../../../lib/visjs/visjs-style';

const jQuery = require("jquery");

// An array of nodes
export var nodes = new DataSet([
    { id: 1, label: 'Node 1' },
    { id: 2, label: 'Node 2' },
    { id: 3, label: 'Node 3' },
    { id: 4, label: 'Node 4' },
    { id: 5, label: 'Node 5' }
]);

// An array of edges
export var edges = new DataSet([
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 }
]);

var options = VisStyleConstants.options_vis_propertyTree;

export var network = {};

var data = {
    nodes,
    edges
};

const renderFormFromNode = (slug) => {
    var oWord = window.lookupWordBySlug[slug];
    var oSchema = {};
    if (oWord.hasOwnProperty("propertyData")) {
        oSchema = oWord.propertyData;
    }
    if (oWord.hasOwnProperty("JSONSchemaData")) {
        oSchema = oWord;
    }
    ReactDOM.render(<Form
        schema={oSchema}
        validator={validator}
        omitExtraData  />,
        document.getElementById("renderedFormElem")
    )
}

export const changeSelectedNode = (nodeID) => {
    jQuery("#selectedNodeContainer").html(nodeID)
    renderFormFromNode(nodeID)

    var oNode = window.lookupWordBySlug[nodeID];
    var sNode = JSON.stringify(oNode,null,4);
    jQuery("#selectedWordRawFileTextarea_unedited").val(sNode)
    jQuery("#selectedWordRawFileTextarea_edited").val(sNode)

    jQuery("#addAPropertyContainer").css("display","none")
    jQuery("#editThisPropertyContainer").css("display","none")
    jQuery("#renderedFormContainer").css("display","none")
    if (oNode.hasOwnProperty("propertyData")) {
        jQuery("#addAPropertyContainer").css("display","inline-block")
        jQuery("#editThisPropertyContainer").css("display","inline-block")

        var slug = oNode.wordData.slug;
        jQuery("#selectedWordSlugTextarea").html(slug)

        var type = oNode.propertyData.type;
        jQuery("#selectedWordTypeSelector").val(type)

        var property_key = oNode.propertyData.key;
        jQuery("#selectedWordKeyTextarea").val(property_key)

        var property_name = oNode.propertyData.name;
        jQuery("#selectedWordNameTextarea").val(property_name)

        var property_title = oNode.propertyData.title;
        jQuery("#selectedWordTitleTextarea").val(property_title)

        var property_description = oNode.propertyData.description;
        jQuery("#selectedWordDescriptionTextarea").val(property_description)

        jQuery("#selectedWordDefaultContainer").css("display","none");
        if (type=="string") {
            jQuery("#selectedWordDefaultContainer").css("display","block");
        }
        var property_default = oNode.propertyData.default;
        jQuery("#selectedWordDefaultTextarea").val(property_default)

        var property_required = oNode.propertyData.metaData.required;
        if (property_required==null) { property_required = "false"; }
        if (property_required==false) { property_required = "false"; }
        if (property_required==true) { property_required = "true"; }
        jQuery("#selectedWordRequiredSelector").val(property_required);

        var property_unique = oNode.propertyData.metaData.unique;
        if (property_unique==null) { property_unique = "false"; }
        if (property_unique==false) { property_unique = "false"; }
        if (property_unique==true) { property_unique = "true"; }
        jQuery("#selectedWordUniqueSelector").val(property_unique)
    }
    if ( (oNode.hasOwnProperty("propertyData")) || (oNode.hasOwnProperty("JSONSchemaData")) ) {
        jQuery("#renderedFormContainer").css("display","inline-block")
    }

}

export const VisNetwork_PropertyTree = () => {

    // A reference to the div rendered by this component
    var domNode = useRef(null);

    // A reference to the vis network instance
    network = useRef(null);

    useEffect(
      () => {
        network.current = new Network(domNode.current, data, options);
        network.current.fit();

        network.current.on("click",function(params){
            var nodes_arr = params.nodes;
            var numNodes = nodes_arr.length;
        });

        // EDGES
        network.current.on("selectEdge",function(params){
            // console.log("selectEdge event triggered")
            var edges_arr = params.edges;
            var numEdges = edges_arr.length;
            if (numEdges==1) {
                var edgeID = edges_arr[0];
                jQuery("#selectedEdge_bepm").html(edgeID)
            }
        });
        network.current.on("deselectEdge",function(params){
            jQuery("#selectedEdge_bepm").html("none")
        });

        // NODES
        network.current.on("selectNode",function(params){
            // console.log("selectNode event triggered")
            var nodes_arr = params.nodes;
            var numNodes = nodes_arr.length;
            if (numNodes==1) {
                var nodeID = nodes_arr[0];
                changeSelectedNode(nodeID);
            }
        });
        network.current.on("deselectNode",function(params){
            jQuery("#selectedNodeContainer").html("")
            jQuery("#selectedWordRawFileTextarea_unedited").val("")
        });
      },
      [domNode, network, data, options]
    );

    return (
      <div style={{height:"100%",width:"100%"}} ref = { domNode } />
    );
};

export const addEdgeWithStyling_visjsfunctions = (edges_arr,nextEdge_obj) => {
    var nextEdge_out_obj = MiscFunctions.cloneObj(nextEdge_obj);
    var relType = nextEdge_out_obj.relationshipType;
    var relationshipStringified = nextEdge_out_obj.relationshipStringified;
    var rel_obj = JSON.parse(relationshipStringified);
    var relationshipTypeData = relType+"Data";
    var rT_propertyField = "";
    if (rel_obj.relationshipType.hasOwnProperty(relationshipTypeData)) {
        rT_propertyField = rel_obj.relationshipType[relationshipTypeData].field;
    }

    nextEdge_out_obj.title = relType;

    nextEdge_out_obj.label = relType;
    if (rT_propertyField) {
        nextEdge_out_obj.title += ", FIELD: "+rT_propertyField;
    }
    var nextEdge_color = VisStyleConstants.edgeOptions_obj[relType].color;
    nextEdge_out_obj.color = nextEdge_color;

    var nextEdge_width = VisStyleConstants.edgeOptions_obj[relType].width;
    nextEdge_out_obj.width = nextEdge_width;
    var nextEdge_dashes = VisStyleConstants.edgeOptions_obj[relType].dashes;
    nextEdge_out_obj.dashes = nextEdge_dashes;
    var nextEdge_polarity = VisStyleConstants.edgeOptions_obj[relType].polarity;
    if (nextEdge_polarity=="reverse") {
        // console.log("polarity: reverse")
        nextEdge_out_obj.from = nextEdge_obj.nodeB;
        nextEdge_out_obj.to = nextEdge_obj.nodeA;
    }

    edges_arr.push(nextEdge_out_obj)
    return edges_arr;
}

export function reorganizeSchema_PropertyTree() {

}

// make graph from schema of type: plain schema or conceptSchema
// copied from addANewConcept.js
export function makeVisGraph_PropertyTree(mainSchemaSlug,propertySchemaSlug,networkElemID) {
    var mainSchema_rF_obj = JSON.parse(JSON.stringify(window.lookupWordBySlug[mainSchemaSlug]));
    var governingConcept_slug = mainSchema_rF_obj.schemaData.metaData.governingConcept.slug;
    var mainSchema_nodes_obj = mainSchema_rF_obj.schemaData.nodes;
    var mainSchema_rels_obj = mainSchema_rF_obj.schemaData.relationships;
    var numMainSchemaNodes = mainSchema_nodes_obj.length;
    var numMainSchemaRels = mainSchema_rels_obj.length;
    console.log("mainSchemaSlug: "+mainSchemaSlug+"; numMainSchemaNodes: "+numMainSchemaNodes+"; numMainSchemaRels: "+numMainSchemaRels)


    var propertySchema_rF_obj = JSON.parse(JSON.stringify(window.lookupWordBySlug[propertySchemaSlug]));
    var propertySchema_nodes_obj = propertySchema_rF_obj.schemaData.nodes;
    var propertySchema_rels_obj = propertySchema_rF_obj.schemaData.relationships;
    var numPropertySchemaNodes = propertySchema_nodes_obj.length;
    var numPropertySchemaRels = propertySchema_rels_obj.length;
    console.log("propertySchemaSlug: "+propertySchemaSlug+"; numPropertySchemaNodes: "+numPropertySchemaNodes+"; numPropertySchemaRels: "+numPropertySchemaRels)

    // combine main schema and property schema nodes and rels
    var schema_nodes_obj = [];
    var schema_rels_obj = []
    schema_nodes_obj = jQuery.merge(propertySchema_nodes_obj,mainSchema_nodes_obj)
    schema_rels_obj = jQuery.merge(propertySchema_rels_obj,mainSchema_rels_obj)
    var numNodes = schema_nodes_obj.length;
    var numRels = schema_rels_obj.length;
    console.log("numNodes: "+numNodes+"; numRels: "+numRels)

    // cycle through schema_nodes_obj and put JSONSchema at the top of the list;
    // this affects how it is displayed when doing hierarchical layout
    var aPropertyNodes1 = [];
    var aPropertyNodes2 = [];
    var aPropertyNodes = [];
    for (var n=0;n<numNodes;n++) {
        var nextNode_obj = schema_nodes_obj[n];
        var nextNode_slug = nextNode_obj.slug;
        var oNextNode = window.lookupWordBySlug[nextNode_slug];
        if (oNextNode.hasOwnProperty("JSONSchemaData")) {
            aPropertyNodes1.push(nextNode_obj)
        }
        if (!oNextNode.hasOwnProperty("JSONSchemaData")) {
            aPropertyNodes2.push(nextNode_obj)
        }
    }
    aPropertyNodes = jQuery.merge(aPropertyNodes1,aPropertyNodes2)

    var nextNode_obj = {};
    var nextEdge_obj = {};
    var nodes_arr = [];
    var edges_arr = [];
    var nodes_slugs_arr = [];
    var numSets = 0;
    // { id: aW_wordType_slug, label: aW_wordType_slug, conceptRole: 'wordType', group: 'wordType', x:0, y:0, physics:false },
    // nextEdge_obj = {from: aW_JSONSchema_slug, to: aW_wordType_slug, nodeA: aW_JSONSchema_slug, nodeB: aW_wordType_slug, relationshipType: 'isTheJSONSchemaFor' };

    /////////////// MAIN + PROPERTY SCHEMA (combined) /////////////////////
    for (var n=0;n<aPropertyNodes.length;n++) {
        var nextNode_obj = aPropertyNodes[n];
        var nextNode_slug = nextNode_obj.slug;
        console.log("n: "+n+"; nextNode_slug: "+nextNode_slug)
        var nextNode_rF_obj = window.lookupWordBySlug[nextNode_slug];
        var nextNode_wordType = nextNode_rF_obj.wordData.wordType;
        var nextNode_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;
        var nextNode_x = 0;
        var nextNode_y = 0;
        var nextNode_conceptRole = nextNode_wordType;
        var pendingDeletion = false;
        try {
            if (nextNode_wordType=="schema") {
                if (jQuery.inArray("propertySchema",nextNode_rF_obj.schemaData.metaData.types) > -1 ) {
                    nextNode_conceptRole = "propertySchema";
                }
            }
            if (nextNode_wordType=="property") {
                if (jQuery.inArray("primaryProperty",nextNode_rF_obj.propertyData.types) > -1 ) {
                    nextNode_conceptRole = "primaryProperty";
                }
                if (nextNode_rF_obj.propertyData.metaData.hasOwnProperty("pendingDeletion")) {
                    pendingDeletion = nextNode_rF_obj.propertyData.metaData.pendingDeletion;
                }
            }
            if (nextNode_wordType=="set") {
                if (jQuery.inArray("mainPropertiesSet",nextNode_rF_obj.setData.metaData.types) > -1 ) {
                    nextNode_conceptRole = "properties";
                }
            }
        } catch (e) {}

        // nextNode_x = -300;
        // nextNode_y = -300 + 100 * n;

        var showNode = false;
        var physics = true;

        var rVar = false;
        for (var r=0;r<numRels;r++) {
            var nextRel_obj = schema_rels_obj[r];
            var nextRel_nF_slug = nextRel_obj.nodeFrom.slug;
            var nextRel_rT_slug = nextRel_obj.relationshipType.slug;
            var nextRel_nT_slug = nextRel_obj.nodeTo.slug;
            if (nextRel_rT_slug=="restrictsValue") {
                if ( (nextNode_slug==nextRel_nF_slug) || (nextNode_slug==nextRel_nT_slug) ) {
                    showNode = true;
                    console.log("RESTRICTS VALUE: nextNode_slug: "+nextNode_slug)
                    rVar = true;
                }
            }
        }

        var interval = 200;

        if (nextNode_conceptRole=="primaryProperty") {
            nextNode_x = -interval;
            nextNode_y = 0;
            showNode = true;
            physics = false;
            // console.log("qwerty primaryProperty nextNode_slug: "+nextNode_slug)
        }
        if (nextNode_conceptRole=="property") {
            showNode = true;
            physics = true;
        }
        if (nextNode_conceptRole=="enumeration") {
            var target_slug = nextNode_rF_obj.enumerationData.restrictsValueData.nodeTo.slug;
            var oTarget = window.lookupWordBySlug[target_slug]
            console.log("target_slug: "+target_slug)
            if (oTarget.propertyData.metaData.governingConcept.slug == governingConcept_slug) {
                showNode = true;
                physics = true;
            }
        }
        if (nextNode_conceptRole=="JSONSchema") {
            if (nextNode_rF_obj.JSONSchemaData.metaData.governingConcept.slug==governingConcept_slug) {
                nextNode_x = interval;
                nextNode_y = 0;
                showNode = true;
                physics = false;
                // console.log("qwerty JSONSchema nextNode_slug: "+nextNode_slug)
            }
        }
        if (nextNode_conceptRole=="wordType") {
            nextNode_x = 0;
            nextNode_y = 0;
            showNode = false;
            physics = false;
        }
        if (nextNode_conceptRole=="superset") {
            nextNode_x = 0;
            nextNode_y = interval;
            if (!rVar) { showNode = false; }
            physics = false;
        }

        if (showNode) {
            var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_slug, slug: nextNode_slug, title: nextNode_slug, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: physics, x: nextNode_x, y: nextNode_y }
            // console.log("qwerty_showNode: nextNode_slug: "+nextNode_slug+"; nextNode_vis_obj: "+JSON.stringify(nextNode_vis_obj,null,4))
            if (pendingDeletion) {
                nextNode_vis_obj.color = {};
                nextNode_vis_obj.color.border = "red";
                nextNode_vis_obj.color.background = "#FFCCCC";
            }
            nodes_arr = MiscFunctions.pushObjIfNotAlreadyThere(nodes_arr,nextNode_vis_obj)
            nodes_slugs_arr = MiscFunctions.pushIfNotAlreadyThere(nodes_slugs_arr,nextNode_slug)
            // nodes_arr.push(nextNode_vis_obj)
            // nodes_slugs_arr.push(nextNode_slug)
        }
    }

    for (var n=0;n<numRels;n++) {
        var nextRel_obj = schema_rels_obj[n];
        var nextRel_nF_slug = nextRel_obj.nodeFrom.slug;
        var nextRel_rT_slug = nextRel_obj.relationshipType.slug;
        var nextRel_nT_slug = nextRel_obj.nodeTo.slug;
        console.log("nextRel_rT_slug: "+nextRel_rT_slug)
        var relationshipStringified = JSON.stringify(nextRel_obj);
        var addNextRel = false;
        if ( (jQuery.inArray(nextRel_nF_slug,nodes_slugs_arr) > -1) && (jQuery.inArray(nextRel_nT_slug,nodes_slugs_arr) > -1) ) {
            addNextRel = true;
        }
        if (nextRel_rT_slug=="isThePrimaryPropertyFor") {
            addNextRel = false;
        }
        if (nextRel_rT_slug=="restrictsValue") {
            addNextRel = true;
        }
        if (nextRel_rT_slug=="enumerates") {
            addNextRel = true;
        }
        if (addNextRel) {
            var nextRel_vis_obj = { from: nextRel_nF_slug, to: nextRel_nT_slug, nodeA: nextRel_nF_slug, nodeB: nextRel_nT_slug, relationshipType: nextRel_rT_slug, relationshipStringified:relationshipStringified }
            edges_arr = addEdgeWithStyling_visjsfunctions(edges_arr,nextRel_vis_obj);
            console.log("adding edge: nextRel_nF_slug: "+nextRel_nF_slug)
        }
        // edges_arr.push(nextRel_vis_obj)
    }

    nodes = new DataSet(nodes_arr);
    edges = new DataSet(edges_arr);
    data = {
        nodes,
        edges
    };
    ReactDOM.render(<VisNetwork_PropertyTree clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        document.getElementById(networkElemID)
    )
    // reorganizeSchema_PropertyTree();
}

export const updateNewProperty = () => {
    var sNewProperty = jQuery("#newPropertyRawFileTextarea_unedited").val()
    if (sNewProperty) {
        var oNewProperty = JSON.parse(sNewProperty);

        var newProperty_ipns = oNewProperty.metaData.ipns;

        var currentConceptSqlID = window.currentConceptSqlID;
        var currentConceptSlug = window.aLookupConceptInfoBySqlID[currentConceptSqlID].slug
        var oCurrentConcept = window.lookupWordBySlug[currentConceptSlug];
        var currentConceptSingular = oCurrentConcept.conceptData.name.singular;

        var newProperty_name = jQuery("#newPropertyNameTextarea").val();
        var newProperty_key = jQuery("#newPropertyKeyTextarea").val();
        var newProperty_type = jQuery("#newPropertyTypeSelector option:selected").val();
        var newProperty_required = jQuery("#newPropertyRequiredSelector option:selected").val();
        var newProperty_unique = jQuery("#newPropertyUniqueSelector option:selected").val();

        var oMetaData = oNewProperty.propertyData.metaData;
        oMetaData.governingConcept.slug = currentConceptSlug;
        delete oNewProperty.propertyData.metaData;
        var newPropertySlug = "property_"+currentConceptSingular+"_"+newProperty_key+"_"+newProperty_ipns.slice(-6);
        newPropertySlug = newPropertySlug.replaceAll(" ","-");
        oNewProperty.wordData.slug = newPropertySlug;
        oNewProperty.wordData.name = "property for "+currentConceptSingular+": "+newProperty_name;
        oNewProperty.wordData.title = "Property for "+currentConceptSingular+": "+newProperty_name;
        oNewProperty.wordData.description = jQuery("#newPropertyDescriptionTextarea").val()
        oNewProperty.wordData.governingConcepts.push(currentConceptSlug)

        if(jQuery("#newPropertySlugTextarea").val()) {
            oNewProperty.wordData.slug = jQuery("#newPropertySlugTextarea").val()
        }

        oNewProperty.propertyData.type = newProperty_type;
        oNewProperty.propertyData.slug = jQuery("#newPropertyKeyTextarea").val();
        oNewProperty.propertyData.key = jQuery("#newPropertyKeyTextarea").val();
        oNewProperty.propertyData.name = jQuery("#newPropertyNameTextarea").val()
        oNewProperty.propertyData.title = jQuery("#newPropertyTitleTextarea").val()
        oNewProperty.propertyData.description = jQuery("#newPropertyDescriptionTextarea").val()
        if (newProperty_type=="string") {
            oNewProperty.propertyData.default = jQuery("#newPropertyDefaultTextarea").val()
            var isDefaultNull = document.getElementById("newPropertyDefaultNullCheckbox").checked;
            if (isDefaultNull) {
                oNewProperty.propertyData.default = null;
            }
            jQuery("#newPropertyDefaultContainer").css("display","block")
        } else {
            delete oNewProperty.propertyData.default;
            jQuery("#newPropertyDefaultContainer").css("display","none")
        }
        if (newProperty_type=="object") {
            oNewProperty.propertyData.required = [];
            oNewProperty.propertyData.unique = [];
            oNewProperty.propertyData.properties = {};
        }
        if (newProperty_type=="array") {
            oNewProperty.propertyData.items = {};
        }
        oNewProperty.propertyData.metaData = oMetaData;
        oNewProperty.propertyData.metaData.required = newProperty_required;
        oNewProperty.propertyData.metaData.unique = newProperty_unique;

        var sUpdatedNewProperty = JSON.stringify(oNewProperty,null,4)
        jQuery("#newPropertyRawFileTextarea_edited").val(sUpdatedNewProperty)

        // make new relationship
        var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
        oNewRel.nodeFrom.slug = oNewProperty.wordData.slug
        oNewRel.relationshipType.slug = "addToConceptGraphProperties";
        oNewRel.relationshipType.addToConceptGraphPropertiesData = {}
        oNewRel.relationshipType.addToConceptGraphPropertiesData.includeDependencies = false;
        oNewRel.nodeTo.slug = jQuery("#selectedWordSlugTextarea").html()
        var sNewRel = JSON.stringify(oNewRel,null,4)
        jQuery("#newRelationshipTextarea_edited").val(sNewRel);

        // add new relationship to property schema and update property schema rawFile
        var sPropertySchema = jQuery("#propertySchemaRawFileTextarea_unedited").val();
        var oPropertySchema = JSON.parse(sPropertySchema);
        var oLRFBS = MiscFunctions.cloneObj(window.lookupWordBySlug);
        oLRFBS[oNewProperty.wordData.slug] = oNewProperty
        oPropertySchema = MiscFunctions.updateSchemaWithNewRel(oPropertySchema,oNewRel,oLRFBS);

        var sUpdatedPropertySchema = JSON.stringify(oPropertySchema,null,4);
        jQuery("#propertySchemaRawFileTextarea_edited").val(sUpdatedPropertySchema);
    }
}

export const generateNewProperty = async () => {
    var oNewProperty = await MiscFunctions.createNewWordByTemplate("property");

    var sNewProperty = JSON.stringify(oNewProperty,null,4);
    jQuery("#newPropertyRawFileTextarea_unedited").val(sNewProperty)
    updateNewProperty()
}

export const saveNewProperty = () => {

    var sUpdatedPropertySchema = jQuery("#propertySchemaRawFileTextarea_edited").val();
    var sUpdatedNewProperty = jQuery("#newPropertyRawFileTextarea_edited").val()
    var oUpdatedPropertySchema = JSON.parse(sUpdatedPropertySchema)
    var oUpdatedNewProperty = JSON.parse(sUpdatedNewProperty)
    MiscFunctions.createOrUpdateWordInAllTables(oUpdatedPropertySchema)
    MiscFunctions.createOrUpdateWordInAllTables(oUpdatedNewProperty)

}

export default class SingleConceptPropertyTreeGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var networkElemID = "propertyTreeGraphElemID";
        var currentConceptSqlID = window.currentConceptSqlID;
        var currentConceptSlug = window.aLookupConceptInfoBySqlID[currentConceptSqlID].slug
        var oCurrentConcept = window.lookupWordBySlug[currentConceptSlug];
        var mainSchemaSlug = oCurrentConcept.conceptData.nodes.schema.slug;
        var propertySchemaSlug = oCurrentConcept.conceptData.nodes.propertySchema.slug;
        makeVisGraph_PropertyTree(mainSchemaSlug,propertySchemaSlug,networkElemID)

        var oPropertySchema = window.lookupWordBySlug[propertySchemaSlug];
        var sPropertySchema = JSON.stringify(oPropertySchema,null,4)
        jQuery("#propertySchemaRawFileTextarea_unedited").val(sPropertySchema)

        jQuery("#editThisPropertyContainer").change(function(){
            console.log("editThisPropertyContainer a")
            var sWordUnedited = jQuery("#selectedWordRawFileTextarea_unedited").val()
            var oWord = JSON.parse(sWordUnedited)
            var newType = jQuery("#selectedWordTypeSelector option:selected").val()
            oWord.propertyData.type = newType;
            if (newType=="object") {
                if (!oWord.propertyData.hasOwnProperty("required")) {
                    oWord.propertyData.required = [];
                }
                if (!oWord.propertyData.hasOwnProperty("unique")) {
                    oWord.propertyData.unique = [];
                }
                if (!oWord.propertyData.hasOwnProperty("properties")) {
                    oWord.propertyData.properties = {};
                }
            }
            if (newType=="array") {
                if (!oWord.propertyData.hasOwnProperty("items")) {
                    oWord.propertyData.items = {};
                }
            }
            jQuery("#selectedWordDefaultContainer").css("display","none")
            if (newType=="string") {
                oWord.propertyData.default = jQuery("#selectedWordDefaultTextarea").val()
                // var isDefaultNull = jQuery("#selectedWordDefaultNullCheckbox").attr("checked");
                var isDefaultNull = document.getElementById("selectedWordDefaultNullCheckbox").checked;
                console.log("isDefaultNull: "+isDefaultNull)
                if (isDefaultNull) {
                    oWord.propertyData.default = null;
                }
                jQuery("#selectedWordDefaultContainer").css("display","block")
            }
            oWord.propertyData.key = jQuery("#selectedWordKeyTextarea").val()
            oWord.propertyData.slug = jQuery("#selectedWordKeyTextarea").val()
            oWord.propertyData.name = jQuery("#selectedWordNameTextarea").val()
            oWord.propertyData.title = jQuery("#selectedWordTitleTextarea").val()
            oWord.propertyData.description = jQuery("#selectedWordDescriptionTextarea").val()
            oWord.propertyData.metaData.required = jQuery("#selectedWordRequiredSelector option:selected").val()
            oWord.propertyData.metaData.unique = jQuery("#selectedWordUniqueSelector option:selected").val()

            var sWordEdited = JSON.stringify(oWord,null,4)
            jQuery("#selectedWordRawFileTextarea_edited").val(sWordEdited)
        })
        jQuery("#updateSelectedWord").click(function(){
            console.log("updateSelectedWord")
            var sWordEdited = jQuery("#selectedWordRawFileTextarea_edited").val()
            var oWordEdited = JSON.parse(sWordEdited);
            console.log("sWordEdited: "+sWordEdited)
            MiscFunctions.createOrUpdateWordInAllTables(oWordEdited)
        })
        jQuery("#generateNewProperty").click(function(){
            console.log("generateNewProperty")
            generateNewProperty()
        })
        jQuery("#saveNewProperty").click(function(){
            console.log("saveNewProperty")
            saveNewProperty();
        })

        jQuery("#addAPropertyFields").change(function(){
            updateNewProperty();
        })
    }
    render() {
        var currentConceptSqlID = window.currentConceptSqlID;
        var currentConceptSlug = window.aLookupConceptInfoBySqlID[currentConceptSqlID].slug
        var oCurrentConcept = window.lookupWordBySlug[currentConceptSlug];
        var jsonSchema_slug = oCurrentConcept.conceptData.nodes.JSONSchema.slug;
        var oJSONSchema = window.lookupWordBySlug[jsonSchema_slug];
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Single Concept Property Tree Graph !</div>

                        <div id="leftColumn" style={{display:"inline-block"}}>
                            <div id="propertyTreeGraphElemID"
                                style={{display:"inline-block",width:"900px",height:"400px",border:"1px dashed grey"}}
                                >
                                networkElemID
                            </div>
                        </div>

                        <div style={{display:"inline-block",width:"450px",height:"400px",border:"1px dashed grey",overflow:"scroll"}} >
                            <div id="renderedFormContainer" style={{display:"inline-block",width:"100%",height:"100%"}} >
                                <div id="selectedNodeContainer" >selectedNodeContainer</div>
                                <div id="renderedFormElem" style={{width:"440px",display:"inline-block",textAlign:"left"}} >
                                    <ReactJSONSchemaOldForm
                                        schema={oJSONSchema}
                                    />
                                </div>
                            </div>
                        </div>

                        <br/>

                        <div style={{display:"inline-block",width:"450px",height:"500px",border:"0px dashed red",padding:"5px"}} >
                            <div id="addAPropertyContainer" style={{display:"inline-block",width:"100%",height:"100%"}} >
                                <center>Add a Property </center>
                                <div id="addAPropertyFields">
                                    slug:<br/>
                                    <div style={{fontSize:"10px"}} >Best to leave slug empty and let it auto-generate! Should be: property_[wordType]_[new property key]</div>
                                    <textarea style={{backgroundColor:"#DFDFDF"}} id="newPropertySlugTextarea" className="textareaStyleF" ></textarea>
                                    <br/>
                                    key:<br/>
                                    <textarea id="newPropertyKeyTextarea" className="textareaStyleF" ></textarea>
                                    <br/>
                                    type:<br/>
                                    <select name="newPropertyTypeSelector" id="newPropertyTypeSelector" >
                                        <option value="" ></option>
                                        <option value="string" >string</option>
                                        <option value="integer" >integer</option>
                                        <option value="object" >object</option>
                                        <option value="array" >array</option>
                                        <option value="boolean" >boolean</option>
                                    </select>
                                    <br/>
                                    name:<br/>
                                    <textarea id="newPropertyNameTextarea" className="textareaStyleF" ></textarea>
                                    <br/>
                                    title:<br/>
                                    <textarea id="newPropertyTitleTextarea" className="textareaStyleF" ></textarea>
                                    <br/>
                                    description:<br/>
                                    <textarea id="newPropertyDescriptionTextarea" className="textareaStyleF" ></textarea>
                                    <br/>
                                    required:<br/>
                                    <select name="newPropertyRequiredSelector" id="newPropertyRequiredSelector" >
                                        <option value="false" >false</option>
                                        <option value="true" >true</option>
                                    </select>
                                    <br/>
                                    unique:<br/>
                                    <select name="newPropertyUniqueSelector" id="newPropertyUniqueSelector" >
                                        <option value="false" >false</option>
                                        <option value="true" >true</option>
                                    </select>
                                    <div id="newPropertyDefaultContainer">
                                        default:<br/>
                                        <input type="checkbox" id="newPropertyDefaultNullCheckbox" /> null<br/>
                                        <textarea id="newPropertyDefaultTextarea" className="textareaStyleF" ></textarea>
                                    </div>
                                </div>
                                <br/>
                                <div id="generateNewProperty" className="doSomethingButton">GENERATE NEW PROPERTY</div>
                                <div id="saveNewProperty" className="doSomethingButton">SAVE NEW PROPERTY</div>
                                <br/>
                                * save new word in SQL and update propertySchema with new rel: newProperty - addToConceptGraphProperties; includeDependencies:false; - property on the right
                                <br/>
                                new property:<br/>
                                unedited: <br/>
                                <textarea id="newPropertyRawFileTextarea_unedited" style={{width:"100%",height:"40%"}}></textarea>
                                <br/>
                                edited: <br/>
                                <textarea id="newPropertyRawFileTextarea_edited" style={{width:"100%",height:"40%"}}></textarea>
                                <br/>
                                unedited property schema:<br/>
                                <textarea id="propertySchemaRawFileTextarea_unedited" style={{width:"100%",height:"40%"}}></textarea>
                                <br/>
                                new relationship:<br/>
                                <textarea id="newRelationshipTextarea_edited" style={{width:"100%",height:"40%"}}></textarea>
                                <br/>
                                edited property schema:<br/>
                                <textarea id="propertySchemaRawFileTextarea_edited" style={{width:"100%",height:"40%"}}></textarea>
                            </div>
                        </div>

                        <div style={{display:"inline-block",width:"450px",height:"500px",border:"1px dashed grey",padding:"5px"}} >
                            <div id="editThisPropertyContainer" style={{display:"inline-block",width:"100%",height:"100%"}} >
                                <center>Edit this Property</center>
                                slug:<br/>
                                <div id="selectedWordSlugTextarea" className="textareaStyleF" ></div>
                                <br/>
                                key:<br/>
                                <textarea id="selectedWordKeyTextarea" className="textareaStyleF" ></textarea>
                                <br/>
                                type:<br/>
                                <select name="selectedWordTypeSelector" id="selectedWordTypeSelector" >
                                    <option value="" ></option>
                                    <option value="string" >string</option>
                                    <option value="integer" >integer</option>
                                    <option value="object" >object</option>
                                    <option value="array" >array</option>
                                    <option value="boolean" >boolean</option>
                                </select>
                                <br/>
                                name:<br/>
                                <textarea id="selectedWordNameTextarea" className="textareaStyleF" ></textarea>
                                <br/>
                                title:<br/>
                                <textarea id="selectedWordTitleTextarea" className="textareaStyleF" ></textarea>
                                <br/>
                                description:<br/>
                                <textarea id="selectedWordDescriptionTextarea" className="textareaStyleF" ></textarea>
                                <br/>
                                required:<br/>
                                <select name="selectedWordRequiredSelector" id="selectedWordRequiredSelector" >
                                    <option value="false" >false</option>
                                    <option value="true" >true</option>
                                </select>
                                <br/>
                                unique:<br/>
                                <select name="selectedWordUniqueSelector" id="selectedWordUniqueSelector" >
                                    <option value="false" >false</option>
                                    <option value="true" >true</option>
                                </select>
                                <div id="selectedWordDefaultContainer">
                                    default:<br/>
                                    <input type="checkbox" id="selectedWordDefaultNullCheckbox" /> null<br/>
                                    <textarea id="selectedWordDefaultTextarea" className="textareaStyleF" ></textarea>
                                </div>
                            </div>
                        </div>

                        <div style={{display:"inline-block",width:"450px",height:"500px",border:"1px dashed grey"}} >
                            <center>Selected Word</center>
                            unedited:<br/>
                            <textarea id="selectedWordRawFileTextarea_unedited" style={{width:"100%",height:"40%"}}></textarea>
                            <br/>
                            edited:<br/>
                            <textarea id="selectedWordRawFileTextarea_edited" style={{width:"100%",height:"40%"}}></textarea>
                            <div id="updateSelectedWord" className="doSomethingButton">UPDATE</div>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
