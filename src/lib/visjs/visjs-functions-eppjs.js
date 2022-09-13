
import React, { Component, createRef, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import * as VisStyleConstants from './visjs-style';
// import GenerateCompactConceptSummarySelector, { reorganizeConcept, addEdgeWithStyling } from '../../views/GenerateCompactConceptSummarySelector';
import { lookupRawFileBySlug_obj, templatesByWordType_obj, insertOrUpdateWordIntoMyDictionary, insertOrUpdateWordIntoMyConceptGraph } from '../../views/addANewConcept';
import * as MiscFunctions from '../miscFunctions.js';
import propertyTypes from '../../json/propertyTypes';
const jQuery = require("jquery");

export function createGraphNodesAndEdgesArraysFromSchemaSlug(schemaSlug) {
    // console.log("makeVisGraph_propertySchema_top_eppjs A; schemaSlug: "+schemaSlug)
    var schema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[schemaSlug]));
    var thisSchemaGoverningConcept_slug = schema_rF_obj.schemaData.metaData.governingConcept.slug;
    var schema_rF_str = JSON.stringify(schema_rF_obj,null,4);


    var schema_nodes_obj = schema_rF_obj.schemaData.nodes;
    var schema_rels_obj = schema_rF_obj.schemaData.relationships;
    var numNodes = schema_nodes_obj.length;
    var numRels = schema_rels_obj.length;

    // console.log("makeVisGraph_propertySchema_top_eppjs A; numNodes: "+numNodes+"; schema_rF_str: "+schema_rF_str)

    var nextNode_obj = {};
    var nextEdge_obj = {};
    var nodes_arr = [];
    var edges_arr = [];

    var numProp = {};
    var propNodeSpacer = 300;
    var propNodeMiniSpacer = 5;
    var numPropConst = 10;

    var numEnumerations = 0;

    // first, set addToConceptGraphProperties_xCounter = 0 for all type3 property nodes
    var lookupType3XXounterBySlug = {};
    for (var n=0;n<numNodes;n++) {
        var nextNode_obj = schema_nodes_obj[n];
        var nextNode_slug = nextNode_obj.slug;
        lookupType3XXounterBySlug[nextNode_slug] = 0;
    }

    // next, cycle through all relationships of relType: addToConceptGraphProperties and make sure
    // that addToConceptGraphProperties_xCounter for the nodeTo property is at least one greater than that for the nodeFrom property
    for (var z=0;z<5;z++) {
        for (var n=0;n<numRels;n++) {
            var nextRel_obj = schema_rels_obj[n];
            var nextRel_nF_slug = nextRel_obj.nodeFrom.slug;
            var nextRel_rT_slug = nextRel_obj.relationshipType.slug;
            var nextRel_nT_slug = nextRel_obj.nodeTo.slug;

            if (nextRel_rT_slug=="addToConceptGraphProperties") {
                var nextNode_nF_rF_obj = lookupRawFileBySlug_obj.edited[nextRel_nF_slug];
                var nextNode_nT_rF_obj = lookupRawFileBySlug_obj.edited[nextRel_nT_slug];
                var nT_type = nextNode_nT_rF_obj.propertyData.type;
                if (nextNode_nF_rF_obj.hasOwnProperty("propertyData")) {
                    var nF_type = nextNode_nF_rF_obj.propertyData.type;
                    if ((nF_type=="type3") && (nF_type=="type3")) {
                        if (lookupType3XXounterBySlug[nextRel_nF_slug] > lookupType3XXounterBySlug[nextRel_nT_slug]) {
                            // do nothing
                        } else {
                            lookupType3XXounterBySlug[nextRel_nT_slug] = lookupType3XXounterBySlug[nextRel_nF_slug] + 1;
                        }
                    }
                }
            }
        }
    }

    for (var n=0;n<numNodes;n++) {
        // console.log("makeVisGraph_propertySchema_top_eppjs n: "+n)
        var nextNode_obj = schema_nodes_obj[n];
        var nextNode_slug = nextNode_obj.slug;
        console.log("eppjs nextNode_slug: "+nextNode_slug)
        if (lookupRawFileBySlug_obj.edited.hasOwnProperty(nextNode_slug)) {
            var nextNode_rF_obj = lookupRawFileBySlug_obj.edited[nextNode_slug];
            var nextNode_wordType = nextNode_rF_obj.wordData.wordType;
            var nextNode_title = nextNode_rF_obj.wordData.title;
            var nextNode_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;

            var nextNode_label = nextNode_title;
            var nextNode_conceptRole = nextNode_wordType;
            if (nextNode_wordType=="schema") {
                if (jQuery.inArray("propertySchema",nextNode_rF_obj.schemaData.metaData.types) > -1 ) {
                    nextNode_conceptRole = "propertySchema";
                }
            }
            if (nextNode_wordType=="property") {
                if (jQuery.inArray("primaryProperty",nextNode_rF_obj.propertyData.metaData.types) > -1 ) {
                    nextNode_conceptRole = "primaryProperty";
                }
            }

            var nextNode_x = 0;
            var nextNode_y = 0;

            if (jQuery.inArray("enumeration",nextNode_wordTypes_arr) > -1) {
                nextNode_x = 0 - propNodeSpacer * numEnumerations;
                nextNode_y = 0;
                numEnumerations++;
            }

            var tempYShift = propNodeSpacer * 10;

            if (jQuery.inArray("set",nextNode_wordTypes_arr) > -1) {

                if (nextNode_rF_obj.setData.hasOwnProperty("metaData")) {
                    if (nextNode_rF_obj.setData.metaData.hasOwnProperty("types")) {
                        jQuery.each(propertyTypes,function(nextPropertyType,propTypeData_obj){
                            if (jQuery.inArray(nextPropertyType,nextNode_rF_obj.setData.metaData.types) > -1) {
                                nextNode_x = propNodeSpacer * propTypeData_obj["x-pos"];
                                nextNode_y = propNodeSpacer * propTypeData_obj["y-pos"];
                            }
                        })
                        if (jQuery.inArray("mainPropertiesSet",nextNode_rF_obj.setData.metaData.types) > -1) {
                            nextNode_x = propNodeSpacer;
                            nextNode_y = 0;
                        }
                    }
                }
            }

            if (nextNode_conceptRole=="primaryProperty") {
                nextNode_x = -propNodeSpacer;
                nextNode_y = propNodeSpacer/2;
            }
            if (nextNode_wordType=="property") {
                var xC = lookupType3XXounterBySlug[nextNode_slug];
                var nextNode_propertyData_obj = nextNode_rF_obj.propertyData;
                var nextNode_propType = nextNode_propertyData_obj.type;
                var nextNode_propTypes_arr = nextNode_rF_obj.propertyData.types;
                var propPolarity = -1;

                if (!numProp.hasOwnProperty(nextNode_propType)) {
                    numProp[nextNode_propType] = 0;
                }

                var numPropTypes = nextNode_propTypes_arr.length;
                for (var zz=0;zz<numPropTypes;zz++) {
                    var nextPT = nextNode_propTypes_arr[zz];
                    if (propertyTypes.hasOwnProperty(nextPT)) {
                        if (!numProp.hasOwnProperty(nextPT)) {
                            numProp[nextPT] = 0;
                        }
                        if ((nextNode_x==0) && (nextNode_y==0)) {
                            nextNode_x = propNodeSpacer * propertyTypes[nextPT]["x-pos"];
                        } else {
                            nextNode_x = Math.max(nextNode_x,propNodeSpacer * propertyTypes[nextPT]["x-pos"]);
                        }
                        nextNode_y = propNodeSpacer * (1 + propertyTypes[nextPT]["y-pos"] + numProp[nextPT])
                        numProp[nextPT]++;
                    }
                }

                var nextNode_propertyData_str = JSON.stringify(nextNode_propertyData_obj,null,4);
            }

            if (nextNode_wordType=="schema") {
                nextNode_x = propNodeSpacer/2;
                nextNode_y = -propNodeSpacer/2;
            }
            if (nextNode_wordType=="JSONSchema") {
                nextNode_x = -propNodeSpacer;
                nextNode_y = 0;
            }
            if (nextNode_wordType=="wordType") {
                nextNode_x = 0;
                nextNode_y = 0;
            }
            if (nextNode_wordType=="superset") {
                nextNode_x = 0;
                nextNode_y = propNodeSpacer/2;
            }
            if (nextNode_wordType=="concept") {
                nextNode_x = 0;
                nextNode_y = -propNodeSpacer/2;
            }
            if (nextNode_conceptRole=="propertySchema") {
                nextNode_x = - propNodeSpacer;
                nextNode_y = - propNodeSpacer/2;
            }
            if (nextNode_wordType=="property") {
                var nextNode_propertyParentConcepts_arr = nextNode_rF_obj.propertyData.metaData.parentConcepts;
                if (jQuery.inArray(thisSchemaGoverningConcept_slug,nextNode_propertyParentConcepts_arr) == -1) {
                    nextNode_wordType = "property_externalParentSchema";
                }
                if (jQuery.inArray("conceptForProperty",nextNode_propertyParentConcepts_arr) > -1) {
                    nextNode_wordType = "property_propertySchemaParentSchema";
                }
            }

            var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_label, slug: nextNode_slug, title: nextNode_title, group: nextNode_wordType, conceptRole: nextNode_conceptRole, x: nextNode_x, y: nextNode_y, physics: false }
            nodes_arr.push(nextNode_vis_obj)
        }
    }

    for (var n=0;n<numRels;n++) {
        var nextRel_obj = schema_rels_obj[n];
        var nextRel_nF_slug = nextRel_obj.nodeFrom.slug;
        var nextRel_rT_slug = nextRel_obj.relationshipType.slug;
        var relationshipTypeStringified = JSON.stringify(nextRel_obj.relationshipType);
        var nextRel_nT_slug = nextRel_obj.nodeTo.slug;

        var nextRel_vis_obj = { from: nextRel_nF_slug, to: nextRel_nT_slug, nodeA: nextRel_nF_slug, nodeB: nextRel_nT_slug, relationshipType: nextRel_rT_slug, relationshipTypeStringified: relationshipTypeStringified }

        var nextRel_rT_propertyField = "";
        if ( (nextRel_rT_slug=="addPropertyKey") || (nextRel_rT_slug=="addPropertyValue") || (nextRel_rT_slug=="propagateProperty") || (nextRel_rT_slug=="addToConceptGraphProperties" )) {
            var relTypeDataKey = nextRel_rT_slug+"Data";
            if (nextRel_obj.relationshipType.hasOwnProperty(relTypeDataKey)) {
                if (nextRel_obj.relationshipType[relTypeDataKey].hasOwnProperty("field")) {
                    nextRel_rT_propertyField = nextRel_obj.relationshipType[relTypeDataKey].field;
                }
            }
            nextRel_vis_obj.propertyField = nextRel_rT_propertyField;
        }
        edges_arr = addEdgeWithStyling_visjsfunctions(edges_arr,nextRel_vis_obj);
    }
    var nodesAndEdges_obj = {};
    nodesAndEdges_obj.nodes_arr = nodes_arr;
    nodesAndEdges_obj.edges_arr = edges_arr;

    return nodesAndEdges_obj;
}

export function addEdgeWithStyling_visjsfunctions(edges_arr,nextEdge_obj) {

    var nextEdge_out_obj = MiscFunctions.cloneObj(nextEdge_obj);
    var relType = nextEdge_out_obj.relationshipType;
    nextEdge_out_obj.title = relType;
    // console.log("addEdgeWithStyling_visjsfunctions; relType: "+relType)

    var rT_propertyField = nextEdge_out_obj.propertyField;
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
