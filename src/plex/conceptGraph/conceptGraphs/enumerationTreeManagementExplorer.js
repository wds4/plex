import React, { useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/singleConceptGraph_leftNav2.js';
import JSONSchemaOldForm from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
import * as MiscFunctions from '../../functions/miscFunctions.js';
import sendAsync from '../../renderer.js';
import * as VisStyleConstants from '../../lib/visjs/visjs-style';

const jQuery = require("jquery");

const renderForm = (targetJSONSchema_slug) => {
    var oSchema = window.lookupWordBySlug[targetJSONSchema_slug];
    ReactDOM.render(<Form
        validator={validator}
        schema={oSchema}
        />,
        document.getElementById("jsonSchemaFormBox")
    )
}

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

var options = VisStyleConstants.options_vis_restrictsPropertyManagement;

export var network = {};

var data = {
    nodes,
    edges
};

export const changeSelectedNode = (nodeID) => {

}

export const VisNetwork_Enumeration = () => {

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

const makeVisGraph_Enumeration = (oEnumeration) => {
    var viewStyle = jQuery("#graphViewingStyleButton").data("viewstyle")
    console.log("makeVisGraph_Enumeration; viewStyle: "+viewStyle)

    var oNRM = oEnumeration.enumerationData.nodeRolesManagement;
    var aRole0 = oNRM.role0_slugs;
    var role1_slug = oNRM.role1_slug;
    var role2_slug = oNRM.role2_slug;
    var role3_slug = oNRM.role3_slug;
    var role4_slug = oNRM.role4_slug;
    var role5_slug = oNRM.role5_slug;
    var aRole6 = oNRM.role6_slugs;
    var aRole7 = oNRM.role7_slugs;

    var oRVD = oEnumeration.enumerationData.restrictsValueData;
    var withSubsets = oRVD.withSubsets;
    var withDependencies = oRVD.withDependencies;
    var dependenciesPlacement = oRVD.dependenciesPlacement;
    var targetPropertyType = oRVD.targetPropertyType;


    var eGT = "?";
    if ( (withSubsets==false) && (withDependencies==false) ) {
        eGT = "A";
    }
    if ( (withSubsets==true) && (withDependencies==false) ) {
        eGT = "B";
    }
    if ( (withSubsets==false) && (withDependencies==true) ) {
        if (dependenciesPlacement=="upper") { eGT = "C ?"; }
        if (dependenciesPlacement=="lower") { eGT = "D ?"; }
    }
    if ( (withSubsets==true) && (withDependencies==true) ) {
        if (dependenciesPlacement=="upper") { eGT = "C"; }
        if (dependenciesPlacement=="lower") {
            eGT = "D";
            if (targetPropertyType=="array") {
                // eGT = "E";
            }
        }
    }

    var nodes_arr = []; // elements are objects
    var edges_arr = [];
    var aNodes = []; // elements are slugs

    ////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////           eGT == A         //////////////////////
    // gC1 govConcept_role1_slug  TOP LEFT
    // gC4 govConcept_role4_slug  TOP RIGHT
    //
    //  cG1                 gC4

    // gC1 --isAnAttributeOf--> gC4

    ////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////           eGT == C         //////////////////////
    // gC1 govConcept_role1_slug  TOP LEFT
    // gC4 govConcept_role4_slug  TOP RIGHT
    // gC6_i  govConcept_role6_slug  BOTTOM MIDDLE
    //
    //  cG1                 gC4
    //
    //          gC6_i

    // gC1 <--isPartitionedInto-- gC4
    // gC6_i --isASubsetOf--> gC4
    // gC6_i --isARealizationOf--> gC1
    ////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////           eGT == D         //////////////////////
    // gC1 govConcept_role1_slug  TOP LEFT
    // gC4 govConcept_role4_slug  TOP RIGHT
    // gC6_i  govConcept_role6_slug  BOTTOM LEFT
    // gC7_i  govConcept_role6_slug  BOTTOM RIGHT
    //
    //  cG1                 gC4
    //
    //    gC6_i       gC7_i

    // gC1 --isAnAttributeOfAComponentOf--> gC4
    // gC7_i --isASubsetOf--> gC4
    // gC6_i --isARealizationOf--> gC1

    var mainIncrement = 70;
    var topEdge = 150;
    if (aRole6) {
        topEdge += mainIncrement * aRole6.length;
    }
    var smallIncrement = 120;
    var smallYIncrement = 15;

    var verticalEdge = topEdge;

    var topLeft_x = 0;
    var topLeft_y = 0;

    var topRight_x = topEdge;
    var topRight_y = smallYIncrement * 2;

    var bottomLeft_x = mainIncrement;
    var bottomLeft_y = verticalEdge;

    var bottomMiddle_x = topEdge / 2;
    var bottomMiddle_y = verticalEdge;

    var bottomRight_x = topEdge - mainIncrement;
    var bottomRight_y = verticalEdge;

    // role 1
    if (role1_slug) {
        var oRole1 = window.lookupWordBySlug[role1_slug];
        if (oRole1.hasOwnProperty("supersetData")) {
            var gC1_slug = oRole1.supersetData.metaData.governingConcept.slug;
        }
        if (oRole1.hasOwnProperty("setData")) {
            var gC1_slug = oRole1.setData.metaData.governingConcept.slug;
        }
        var oGc1 = window.lookupWordBySlug[gC1_slug];
        var gC1_title = oGc1.conceptData.title;

        if (viewStyle=="showGreaterDetail") {
            var nextNode_slug = role1_slug;
            if (oRole1.hasOwnProperty("supersetData")) {
                var nextNode_wordType = "superset";
                var nextNode_conceptRole = "superset";
                var role1_title = oRole1.supersetData.title;
            }
            if (oRole1.hasOwnProperty("setData")) {
                var nextNode_wordType = "set";
                var nextNode_conceptRole = "set";
                var role1_title = oRole1.setData.title;
            }
            var nextNode_title = role1_title;
        }
        if (viewStyle=="showAsConcepts") {
            var nextNode_slug = gC1_slug;
            var nextNode_wordType = "concept";
            var nextNode_conceptRole = "concept";
            var nextNode_title = gC1_title;

        }
        var nextNode_x = topLeft_x;
        var nextNode_y = topLeft_y;
        var physics = false;

        var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_title, slug: nextNode_slug, title: nextNode_title, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: physics, x: nextNode_x, y: nextNode_y }
        if (!aNodes.includes(nextNode_slug)) {
            nodes_arr = MiscFunctions.pushObjIfNotAlreadyThere(nodes_arr,nextNode_vis_obj)
            aNodes.push(nextNode_slug)
        }
    }

    // role 2 and role 5
    if (viewStyle=="showGreaterDetail") {
        if (role2_slug) {
            var oRole2 = window.lookupWordBySlug[role2_slug];
            if (oRole2.hasOwnProperty("propertyData")) {
                var role2_title = oRole2.propertyData.title;
                var gC2_slug = oRole2.propertyData.metaData.governingConcept.slug;
            }
            var oGc2 = window.lookupWordBySlug[gC2_slug];
            var gC2_title = oGc2.conceptData.title;
            if ( (eGT == "C") || (eGT == "D")) {
                var nextNode_slug = role2_slug;
                var nextNode_wordType = "property";
                var nextNode_conceptRole = "property";
                var nextNode_title = role2_title;
                var physics = false;
                var nextNode_x = topRight_x;
                var nextNode_y = topRight_y;
                var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_title, slug: nextNode_slug, title: nextNode_title, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: physics, x: nextNode_x, y: nextNode_y }
                if (!aNodes.includes(nextNode_slug)) {
                    nodes_arr = MiscFunctions.pushObjIfNotAlreadyThere(nodes_arr,nextNode_vis_obj)
                    aNodes.push(nextNode_slug)
                }

                // role1_slug --enumeratesAndDefines--> role2_slug
                var rT_slug = "enumeratesAndDefines";
                var nF_slug = role1_slug
                var nT_slug = role2_slug
                var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
                oNextRel.relationshipType.slug = rT_slug;
                var relationshipStringified = JSON.stringify(oNextRel);
                var nextRel_vis_obj = { from: nF_slug, to: nT_slug, nodeA: nF_slug, nodeB: nT_slug, relationshipType: rT_slug, relationshipStringified: relationshipStringified }
                edges_arr = addEdgeWithStyling_visjsfunctions(edges_arr,nextRel_vis_obj);
                console.log("adding edge: nF_slug: "+nF_slug)
            }
        }
        if (role5_slug) {
            var oRole5 = window.lookupWordBySlug[role5_slug];
            if (oRole5.hasOwnProperty("setData")) {
                var role5_title = oRole5.setData.title;
            }
            if ( (eGT == "C") || (eGT == "D")) {
                var nextNode_slug = role5_slug;
                var nextNode_wordType = "set";
                var nextNode_conceptRole = "set";
                var nextNode_title = role5_title;
                var physics = false;
                var nextNode_x = topRight_x + smallIncrement;
                var nextNode_y = topRight_y + smallIncrement;
                var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_title, slug: nextNode_slug, title: nextNode_title, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: physics, x: nextNode_x, y: nextNode_y }
                if (!aNodes.includes(nextNode_slug)) {
                    nodes_arr = MiscFunctions.pushObjIfNotAlreadyThere(nodes_arr,nextNode_vis_obj)
                    aNodes.push(nextNode_slug)
                }

                // role5_slug --subsetOf--> role4_slug
                var rT_slug = "subsetOf";
                var nF_slug = role5_slug
                var nT_slug = role4_slug
                var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
                oNextRel.relationshipType.slug = rT_slug;
                var relationshipStringified = JSON.stringify(oNextRel);
                var nextRel_vis_obj = { from: nF_slug, to: nT_slug, nodeA: nF_slug, nodeB: nT_slug, relationshipType: rT_slug, relationshipStringified: relationshipStringified }
                edges_arr = addEdgeWithStyling_visjsfunctions(edges_arr,nextRel_vis_obj);
                console.log("adding edge: nF_slug: "+nF_slug)
            }
        }
    }

    // role 4
    if (role4_slug) {
        var oRole4 = window.lookupWordBySlug[role4_slug];
        if (oRole4.hasOwnProperty("supersetData")) {
            var gC4_slug = oRole4.supersetData.metaData.governingConcept.slug;
        }
        var oGc4 = window.lookupWordBySlug[gC4_slug];
        var gC4_title = oGc4.conceptData.title;
        var role4_title = oRole4.supersetData.title;

        if (viewStyle=="showGreaterDetail") {
            var nextNode_slug = role4_slug;
            var nextNode_wordType = "superset";
            var nextNode_conceptRole = "superset";
            var nextNode_title = role4_title;
            var nextNode_x = topRight_x + smallIncrement;
            var nextNode_y = topRight_y;
        }
        if (viewStyle=="showAsConcepts") {
            var nextNode_slug = gC4_slug;
            var nextNode_wordType = "concept";
            var nextNode_conceptRole = "concept";
            var nextNode_title = gC4_title;
            var nextNode_x = topRight_x;
            var nextNode_y = topRight_y;
        }
        var physics = false;

        var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_title, slug: nextNode_slug, title: nextNode_title, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: physics, x: nextNode_x, y: nextNode_y }
        if (!aNodes.includes(nextNode_slug)) {
            nodes_arr = MiscFunctions.pushObjIfNotAlreadyThere(nodes_arr,nextNode_vis_obj)
            aNodes.push(nextNode_slug)
        }
    }

    if (eGT == "A") {
        if (viewStyle=="showGreaterDetail") {
        }
        if (viewStyle=="showAsConcepts") {
            // gC1 --isAnAttributeOf--> gC4
            var rT_slug = "isAnAttributeOf";
            var nF_slug = gC1_slug
            var nT_slug = gC4_slug
            var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
            oNextRel.relationshipType.slug = rT_slug;
            var relationshipStringified = JSON.stringify(oNextRel);
            var nextRel_vis_obj = { from: nF_slug, to: nT_slug, nodeA: nF_slug, nodeB: nT_slug, relationshipType: rT_slug, relationshipStringified: relationshipStringified }
            edges_arr = addEdgeWithStyling_visjsfunctions(edges_arr,nextRel_vis_obj);
            console.log("adding edge: nF_slug: "+nF_slug)
        }
    }

    if (eGT == "C") {
        if (viewStyle=="showGreaterDetail") {
        }
        if (viewStyle=="showAsConcepts") {
            // gC1 <--isPartitionedInto-- gC4
            var rT_slug = "isPartitionedInto";
            var nF_slug = gC4_slug
            var nT_slug = gC1_slug
            var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
            oNextRel.relationshipType.slug = rT_slug;
            var relationshipStringified = JSON.stringify(oNextRel);
            var nextRel_vis_obj = { from: nF_slug, to: nT_slug, nodeA: nF_slug, nodeB: nT_slug, relationshipType: rT_slug, relationshipStringified: relationshipStringified }
            edges_arr = addEdgeWithStyling_visjsfunctions(edges_arr,nextRel_vis_obj);
            console.log("adding edge: nF_slug: "+nF_slug)
        }
    }

    if (eGT == "D") {
        if (viewStyle=="showGreaterDetail") {
        }
        if (viewStyle=="showAsConcepts") {
            // gC1 --isAnAttributeOfAComponentOf--> gC4
            var rT_slug = "isAnAttributeOfAComponentOf";
            var nF_slug = gC1_slug
            var nT_slug = gC4_slug
            var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
            oNextRel.relationshipType.slug = rT_slug;
            var relationshipStringified = JSON.stringify(oNextRel);
            var nextRel_vis_obj = { from: nF_slug, to: nT_slug, nodeA: nF_slug, nodeB: nT_slug, relationshipType: rT_slug, relationshipStringified: relationshipStringified }
            edges_arr = addEdgeWithStyling_visjsfunctions(edges_arr,nextRel_vis_obj);
            console.log("adding edge: nF_slug: "+nF_slug)
        }
    }

    // role 0
    if (aRole0) {
        for (var a=0;a<aRole0.length;a++) {
            var role0_slug = aRole0[a];
            var oRole0 = window.lookupWordBySlug[role0_slug];
            if (oRole0.hasOwnProperty("wordTypeData")) {
                var gC0_slug = oRole0.wordTypeData.metaData.governingConcept.slug;
                console.log("gC0_slug: "+gC0_slug)
                var oGc0 = window.lookupWordBySlug[gC0_slug];
                var gC0_title = oGc0.conceptData.title;
                if (viewStyle=="showGreaterDetail") {
                    var nextNode_slug = role0_slug;
                    var nextNode_wordType = "wordType";
                    var nextNode_conceptRole = "wordType";
                    var nextNode_title = oRole0.wordTypeData.title;
                    var physics = false;
                    console.log("eGT: "+eGT)
                    if ( (eGT == "C") || (eGT == "D")) {
                        var nextNode_x = bottomMiddle_x + a*mainIncrement - (aRole0.length * mainIncrement/2);
                        var nextNode_y = bottomMiddle_y + a * smallYIncrement;

                        var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_title, slug: nextNode_slug, title: nextNode_title, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: physics, x: nextNode_x, y: nextNode_y }
                        if (!aNodes.includes(nextNode_slug)) {
                            nodes_arr = MiscFunctions.pushObjIfNotAlreadyThere(nodes_arr,nextNode_vis_obj)
                            aNodes.push(nextNode_slug)
                        }

                        // role0_i --isASpecificInstanceOf--> role1_slug
                        var rT_slug = "isASpecificInstanceOf";
                        var nF_slug = role0_slug
                        var nT_slug = role1_slug
                        var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
                        oNextRel.relationshipType.slug = rT_slug;
                        var relationshipStringified = JSON.stringify(oNextRel);
                        var nextRel_vis_obj = { from: nF_slug, to: nT_slug, nodeA: nF_slug, nodeB: nT_slug, relationshipType: rT_slug, relationshipStringified: relationshipStringified }
                        edges_arr = addEdgeWithStyling_visjsfunctions(edges_arr,nextRel_vis_obj);
                        console.log("adding edge: nF_slug: "+nF_slug)
                    }
                }
            }
        }
    }

    // role 6
    if (aRole6) {
        for (var a=0;a<aRole6.length;a++) {
            var role6_slug = aRole6[a];
            var oRole6 = window.lookupWordBySlug[role6_slug];
            if (oRole6.hasOwnProperty("supersetData")) {
                var gC6_slug = oRole6.supersetData.metaData.governingConcept.slug;
            }
            var oGc6 = window.lookupWordBySlug[gC6_slug];
            var gC6_title = oGc6.conceptData.title;
            if (viewStyle=="showGreaterDetail") {
                var nextNode_slug = role6_slug;
                var nextNode_wordType = "superset";
                var nextNode_conceptRole = "superset";
                var nextNode_title = oRole6.supersetData.title;
                var physics = false;
                console.log("eGT: "+eGT)
                if ( (eGT == "C") || (eGT == "D")) {
                    var nextNode_x = bottomMiddle_x + a*mainIncrement - (aRole0.length * mainIncrement/2);
                    var nextNode_y = bottomMiddle_y + a * smallYIncrement + 2*mainIncrement;

                    var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_title, slug: nextNode_slug, title: nextNode_title, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: physics, x: nextNode_x, y: nextNode_y }
                    if (!aNodes.includes(nextNode_slug)) {
                        nodes_arr = MiscFunctions.pushObjIfNotAlreadyThere(nodes_arr,nextNode_vis_obj)
                        aNodes.push(nextNode_slug)
                    }

                    // role6_i --isTheSupersetFor--> role0_i
                    var rT_slug = "isTheSupersetFor";
                    var nF_slug = role6_slug
                    var nT_slug = aRole0[a];
                    var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
                    oNextRel.relationshipType.slug = rT_slug;
                    var relationshipStringified = JSON.stringify(oNextRel);
                    var nextRel_vis_obj = { from: nF_slug, to: nT_slug, nodeA: nF_slug, nodeB: nT_slug, relationshipType: rT_slug, relationshipStringified: relationshipStringified }
                    edges_arr = addEdgeWithStyling_visjsfunctions(edges_arr,nextRel_vis_obj);
                    console.log("adding edge: nF_slug: "+nF_slug)
                }
                if (eGT == "C") {
                    // role6_i --subsetOf--> role5_slug
                    var rT_slug = "subsetOf";
                    var nF_slug = role6_slug
                    var nT_slug = role5_slug
                    var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
                    oNextRel.relationshipType.slug = rT_slug;
                    var relationshipStringified = JSON.stringify(oNextRel);
                    var nextRel_vis_obj = { from: nF_slug, to: nT_slug, nodeA: nF_slug, nodeB: nT_slug, relationshipType: rT_slug, relationshipStringified: relationshipStringified }
                    edges_arr = addEdgeWithStyling_visjsfunctions(edges_arr,nextRel_vis_obj);
                    console.log("adding edge: nF_slug: "+nF_slug)
                }
            }
            if (viewStyle=="showAsConcepts") {
                var nextNode_slug = gC6_slug;
                var nextNode_wordType = "concept";
                var nextNode_conceptRole = "concept";
                var physics = false;
                console.log("eGT: "+eGT)
                if (eGT == "C") {
                    var nextNode_x = bottomMiddle_x + a*mainIncrement - (aRole6.length * mainIncrement/2);
                    var nextNode_y = bottomMiddle_y + a * smallYIncrement;

                    // gC6_i --isASubsetOf--> gC4
                    var rT_slug = "isASubsetOf";
                    var nF_slug = gC6_slug
                    var nT_slug = gC4_slug
                    var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
                    oNextRel.relationshipType.slug = rT_slug;
                    var relationshipStringified = JSON.stringify(oNextRel);
                    var nextRel_vis_obj = { from: nF_slug, to: nT_slug, nodeA: nF_slug, nodeB: nT_slug, relationshipType: rT_slug, relationshipStringified: relationshipStringified }
                    edges_arr = addEdgeWithStyling_visjsfunctions(edges_arr,nextRel_vis_obj);
                    console.log("adding edge: nF_slug: "+nF_slug)

                    // gC6_i --isARealizationOf--> gC1
                    var rT_slug = "isARealizationOf";
                    var nF_slug = gC6_slug
                    var nT_slug = gC1_slug
                    var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
                    oNextRel.relationshipType.slug = rT_slug;
                    var relationshipStringified = JSON.stringify(oNextRel);
                    var nextRel_vis_obj = { from: nF_slug, to: nT_slug, nodeA: nF_slug, nodeB: nT_slug, relationshipType: rT_slug, relationshipStringified: relationshipStringified }
                    edges_arr = addEdgeWithStyling_visjsfunctions(edges_arr,nextRel_vis_obj);
                    console.log("adding edge: nF_slug: "+nF_slug)
                }
                if (eGT == "D") {
                    var nextNode_x = bottomLeft_x + a*mainIncrement - (aRole6.length * mainIncrement/2);
                    var nextNode_y = bottomLeft_y + a * smallYIncrement;

                    // gC6_i --isARealizationOf--> gC1
                    var rT_slug = "isARealizationOf";
                    var nF_slug = gC6_slug
                    var nT_slug = gC1_slug
                    var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
                    oNextRel.relationshipType.slug = rT_slug;
                    var relationshipStringified = JSON.stringify(oNextRel);
                    var nextRel_vis_obj = { from: nF_slug, to: nT_slug, nodeA: nF_slug, nodeB: nT_slug, relationshipType: rT_slug, relationshipStringified: relationshipStringified }
                    edges_arr = addEdgeWithStyling_visjsfunctions(edges_arr,nextRel_vis_obj);
                    console.log("adding edge: nF_slug: "+nF_slug)
                }
                var nextNode_vis_obj = { id: nextNode_slug, label: gC6_title, slug: nextNode_slug, title: gC6_title, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: physics, x: nextNode_x, y: nextNode_y }
                if (!aNodes.includes(nextNode_slug)) {
                    nodes_arr = MiscFunctions.pushObjIfNotAlreadyThere(nodes_arr,nextNode_vis_obj)
                    aNodes.push(nextNode_slug)
                }
            }
        }
    }

    nodes = new DataSet(nodes_arr);
    edges = new DataSet(edges_arr);
    data = {
        nodes,
        edges
    };
    var networkElemID = "graphViewContainer";
    ReactDOM.render(<VisNetwork_Enumeration clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        document.getElementById(networkElemID)
    )
}

export function addEdgeWithStyling_visjsfunctions(edges_arr,nextEdge_obj) {
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

export default class RestrictsValueManagementExplorer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptGraphSqlID: null
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        jQuery("#graphViewToggleButton").click(function(){
            var currStatus = jQuery("#graphViewToggleButton").data("status");
            if (currStatus=="closed") {
                jQuery("#graphViewToggleButton").data("status","open");
                // jQuery("#graphViewToggleButton").html("hide NeuroCore")
                // jQuery("#neuroCoreMonitoringPanel").css("display","block")
                jQuery("#graphViewContainer").animate({
                    height: "600px",
                    padding: "10px",
                    borderWidth:"1px"
                },500);
            }
            if (currStatus=="open") {
                jQuery("#graphViewToggleButton").data("status","closed");
                // jQuery("#graphViewToggleButton").html("show NeuroCore");
                // jQuery("#neuroCoreMonitoringPanel").css("display","none")
                jQuery("#graphViewContainer").animate({
                    height: "0px",
                    padding: "0px",
                    borderWidth:"0px"
                },500);
            }
        })

        // For now, obtain list of all enumeration nodes by searching through the entire wordlist.
        // In future, use supersetFor_enumeration (or some appropriate subset, like enumerations_active.)
        var aEnumerations = [];
        var aWords = Object.keys(window.lookupWordBySlug);
        for (var w=0;w<aWords.length;w++) {
            var nextWord_slug = aWords[w];
            var oNextWord = window.lookupWordBySlug[nextWord_slug];
            if (oNextWord.hasOwnProperty("enumerationData")) {
                aEnumerations.push(nextWord_slug)
            }
        }
        jQuery("#enumerationsContainer").html("")
        for (var e=0;e<aEnumerations.length;e++) {
            var nextEnumeration_slug = aEnumerations[e];
            var oNextEnumeration = window.lookupWordBySlug[nextEnumeration_slug];
            var oRVD = oNextEnumeration.enumerationData.restrictsValueData;

            var targetPropertyType = oRVD.targetPropertyType;
            var propertyPath = oRVD.propertyPath;
            var uniquePropertyKey = oRVD.uniquePropertyKey;
            var withSubsets = oRVD.withSubsets;
            var withDependencies = oRVD.withDependencies;
            var dependenciesPlacement = oRVD.dependenciesPlacement;

            var nextUniqueID = oNextEnumeration.enumerationData.nodeRolesManagement.uniqueID;
            var role1_slug = oNextEnumeration.enumerationData.nodeRolesManagement.role1_slug;
            var role2_slug = oNextEnumeration.enumerationData.nodeRolesManagement.role2_slug;

            var oRole1 = window.lookupWordBySlug[role1_slug]
            var oRole2 = window.lookupWordBySlug[role2_slug]

            var role1_setName = role1_slug;
            if (oRole1.hasOwnProperty("supersetData")) {
                role1_setName = oRole1.supersetData.name;
            }
            if (oRole1.hasOwnProperty("setData")) {
                role1_setName = oRole1.setData.name;
            }

            var eGT = "?";
            var wS = "?";
            var wD = "?";
            var tPT = "?";
            var dP = ".";

            if ( (withSubsets==false) && (withDependencies==false) ) {
                eGT = "A";
            }
            if ( (withSubsets==true) && (withDependencies==false) ) {
                eGT = "B";
            }
            if ( (withSubsets==false) && (withDependencies==true) ) {
                if (dependenciesPlacement=="upper") { eGT = "C ?"; }
                if (dependenciesPlacement=="lower") { eGT = "D ?"; }
            }
            if ( (withSubsets==true) && (withDependencies==true) ) {
                if (dependenciesPlacement=="upper") { eGT = "C"; }
                if (dependenciesPlacement=="lower") { eGT = "D"; }
            }

            if (withSubsets==false) { wS = 0; }
            if (withSubsets==true) { wS = 1; }

            if (withDependencies==false) { wD = 0; }
            if (withDependencies==true) { wD = 1; }

            if (targetPropertyType=="string") { tPT = "S"; }
            if (targetPropertyType=="array") { tPT = "A"; }

            if (dependenciesPlacement=="lower") { dP = "L"; }
            if (dependenciesPlacement=="upper") { dP = "U"; }
            if (dependenciesPlacement==null) { dP = "-"; }

            var sentenceHTML = "";

            sentenceHTML += "<div ";
            sentenceHTML += " style='margin-right:10px;text-align:center;display:inline-block;width:25px;height:25px;";
            if (eGT=="A") { sentenceHTML += "background-color:#EFEFEF;border:4px solid #EFEFEF;"; }
            if (eGT=="B") { sentenceHTML += "background-color:#EFEFEF;border:4px solid green;"; }
            if (eGT=="C") { sentenceHTML += "background-color:purple;border:4px solid green;color:white;"; }
            if (eGT=="D") {
                if (targetPropertyType=="string") {
                    sentenceHTML += "background-color:yellow;border:4px solid green;";
                }
                if (targetPropertyType=="array") {
                    sentenceHTML += "background-color:red;border:4px solid green;color:white;"; 
                }
            }
            sentenceHTML += "'>";
            sentenceHTML += eGT;
            if ((eGT=="D") && (targetPropertyType=="array")) {
                sentenceHTML += "*";
            }
            sentenceHTML += "</div>";

            sentenceHTML += "<div ";
            sentenceHTML += " style='margin-right:3px;text-align:center;display:inline-block;border:1px solid black;width:20px;height:20px;";
            if (wS==0) { sentenceHTML += "background-color:#FFAAAA;"; }
            if (wS==1) { sentenceHTML += "background-color:#AAFFAA;"; }
            sentenceHTML += "'>";
            sentenceHTML += wS;
            sentenceHTML += "</div>";

            sentenceHTML += "<div ";
            sentenceHTML += " style='margin-right:3px;text-align:center;display:inline-block;border:1px solid black;width:20px;height:20px;";
            if (wD==0) { sentenceHTML += "background-color:#FFAAAA;"; }
            if (wD==1) { sentenceHTML += "background-color:#AAFFAA;"; }
            sentenceHTML += "'>";
            sentenceHTML += wD;
            sentenceHTML += "</div>";

            sentenceHTML += "<div ";
            sentenceHTML += " style='margin-right:3px;text-align:center;display:inline-block;border:1px solid black;width:20px;height:20px;";
            if (dP=="L") { sentenceHTML += "background-color:yellow;"; }
            if (dP=="U") { sentenceHTML += "background-color:purple;color:white;"; }
            sentenceHTML += "'>";
            sentenceHTML += dP;
            sentenceHTML += "</div>";

            sentenceHTML += "<div ";
            sentenceHTML += " style='margin-right:3px;text-align:center;display:inline-block;border:1px solid black;width:20px;height:20px;";
            if (tPT=="S") { sentenceHTML += "background-color:#AAAAFF;"; }
            if (tPT=="A") { sentenceHTML += "background-color:#333333;color:white"; }
            sentenceHTML += "'>";
            sentenceHTML += tPT;
            sentenceHTML += "</div>";

            sentenceHTML += "<div style='margin-left:20px;display:inline-block;width:300px' >";
            sentenceHTML += role1_setName;
            sentenceHTML += "</div>";

            sentenceHTML += "defines the allowed values of";

            sentenceHTML += "<div style='margin-left:50px;display:inline-block;width:300px' >";
            sentenceHTML += role2_slug;
            sentenceHTML += "</div>";

            var nextEnumerationHTML = "";
            nextEnumerationHTML += "<div>";

                nextEnumerationHTML += "<div ";
                nextEnumerationHTML += " data-uniqueid='"+nextUniqueID+"' ";
                nextEnumerationHTML += " data-enumerationslug='"+nextEnumeration_slug+"' ";
                nextEnumerationHTML += " class='uniqueIdContainer' ";
                nextEnumerationHTML += " style=display:inline-block;width:250px; ";
                nextEnumerationHTML += " >";
                    nextEnumerationHTML += nextUniqueID;
                nextEnumerationHTML += "</div>";

                nextEnumerationHTML += "<div style=display:inline-block;width:1000px; >";
                    nextEnumerationHTML += sentenceHTML;
                nextEnumerationHTML += "</div>";

            nextEnumerationHTML += "</div>";
            jQuery("#enumerationsContainer").append(nextEnumerationHTML)
        }
        jQuery(".uniqueIdContainer").click(function(){
            jQuery(".uniqueIdContainer").css("background-color","#EFEFEF");
            jQuery(this).css("background-color","orange");

            jQuery("#targetJSONSchemaContainer").html("")
            jQuery("#role0Container").html("")
            jQuery("#role1Container").html("")
            jQuery("#role2Container").html("")
            jQuery("#role3Container").html("")
            jQuery("#role4Container").html("")
            jQuery("#role5Container").html("")
            jQuery("#role6Container").html("")
            jQuery("#role7Container").html("")

            var clickedUniqueID = jQuery(this).data("uniqueid")
            jQuery("#uniqueIDContainer").html(clickedUniqueID)

            var clickedEnumerationSlug = jQuery(this).data("enumerationslug")
            var enumerationContainerHTML = "";
            enumerationContainerHTML += "<div ";
            enumerationContainerHTML += " data-slug='"+clickedEnumerationSlug+"' ";
            enumerationContainerHTML += " class='singleNodeContainer' ";
            enumerationContainerHTML += " >";
            enumerationContainerHTML += clickedEnumerationSlug;
            enumerationContainerHTML += "</div>";
            jQuery("#enumerationSlugContainer").html(enumerationContainerHTML)

            var oEnumeration = window.lookupWordBySlug[clickedEnumerationSlug];
            var oRVD = oEnumeration.enumerationData.restrictsValueData;
            var targetPropertyType = oRVD.targetPropertyType;
            var propertyPath = oRVD.propertyPath;
            var uniquePropertyKey = oRVD.uniquePropertyKey;
            var withSubsets = oRVD.withSubsets;
            var withDependencies = oRVD.withDependencies;
            var dependenciesPlacement = oRVD.dependenciesPlacement;

            var withSubsetsHTML = "unknown";
            if (withSubsets==false) { withSubsetsHTML = "false"; }
            if (withSubsets==true) { withSubsetsHTML = "true"; }
            jQuery("#subsetsContainer").html(withSubsetsHTML)

            var withDependenciesHTML = "unknown";
            if (withDependencies==false) { withDependenciesHTML = "false"; }
            if (withDependencies==true) { withDependenciesHTML = "true"; }
            jQuery("#dependenciesContainer").html(withDependenciesHTML)

            jQuery("#dependenciesUpVsDownContainer").html(dependenciesPlacement)

            var oNRM = oEnumeration.enumerationData.nodeRolesManagement;
            var aRole0 = oNRM.role0_slugs;
            var role1_slug = oNRM.role1_slug;
            var role2_slug = oNRM.role2_slug;
            var role3_slug = oNRM.role3_slug;
            var role4_slug = oNRM.role4_slug;
            var role5_slug = oNRM.role5_slug;
            var aRole6 = oNRM.role6_slugs;
            var aRole7 = oNRM.role7_slugs;

            // role1 node
            var nextNodeHTML = "";
            nextNodeHTML += "<div ";
            nextNodeHTML += " data-slug='"+role1_slug+"' ";
            nextNodeHTML += " class='singleNodeContainer' ";
            nextNodeHTML += " >";
            nextNodeHTML += role1_slug;
            nextNodeHTML += "</div>";
            jQuery("#role1Container").html(nextNodeHTML)

            // role2 node
            var nextNodeHTML = "";
            nextNodeHTML += "<div ";
            nextNodeHTML += " data-slug='"+role2_slug+"' ";
            nextNodeHTML += " class='singleNodeContainer' ";
            nextNodeHTML += " >";
            nextNodeHTML += role2_slug;
            nextNodeHTML += "</div>";
            jQuery("#role2Container").html(nextNodeHTML)

            if (role3_slug) {
                var oRole3 = window.lookupWordBySlug[role3_slug];
                var targetGoverningConcept_slug = oRole3.propertyData.metaData.governingConcept.slug;
                var oGovCon = window.lookupWordBySlug[targetGoverningConcept_slug];
                var targetJSONSchema_slug = oGovCon.conceptData.nodes.JSONSchema.slug;
                var targetSuperset_slug = oGovCon.conceptData.nodes.superset.slug;
                var oSuperset = window.lookupWordBySlug[targetSuperset_slug]
                var aSpecificInstances = oSuperset.globalDynamicData.specificInstances;
                var propertyPath = oGovCon.conceptData.propertyPath;

                jQuery("#specificInstancesListContainer").html("");
                for (var s=0;s<aSpecificInstances.length;s++) {
                    var nextSpecificInstance_slug = aSpecificInstances[s];
                    var oNextSpecificInstance = window.lookupWordBySlug[nextSpecificInstance_slug]
                    var oNextSpecificInstance_name = oNextSpecificInstance.wordData.name;
                    var nextSpecificInstanceHTML = "";
                    nextSpecificInstanceHTML += "<div class='specificInstanceButton' data-slug='"+nextSpecificInstance_slug+"' id='specificInstance_"+nextSpecificInstance_slug+"' >";
                    nextSpecificInstanceHTML += oNextSpecificInstance_name;
                    nextSpecificInstanceHTML += "</div>";
                    jQuery("#specificInstancesListContainer").append(nextSpecificInstanceHTML)
                }
                jQuery(".specificInstanceButton").click(function(){
                    var si_slug = jQuery(this).data("slug");
                    console.log("si_slug: "+si_slug);
                    var oSi = window.lookupWordBySlug[si_slug];
                    var sSi = JSON.stringify(oSi,null,4)
                    jQuery("#specificInstanceCompleteBox").val(sSi);

                    var oSi_parsed = {};
                    oSi_parsed[propertyPath] = oSi[propertyPath];
                    var sSi_parsed = JSON.stringify(oSi_parsed,null,4)
                    jQuery("#specificInstanceParsedBox").val(sSi_parsed);
                })

                var nextNodeHTML = "";
                nextNodeHTML += "<div ";
                nextNodeHTML += " data-slug='"+targetJSONSchema_slug+"' ";
                nextNodeHTML += " class='singleNodeContainer' ";
                nextNodeHTML += " >";
                nextNodeHTML += targetJSONSchema_slug;
                nextNodeHTML += "</div>";
                jQuery("#targetJSONSchemaContainer").html(nextNodeHTML)
                renderForm(targetJSONSchema_slug)

                // role0 nodes
                for (var z=0;z<aRole0.length;z++) {
                    var nextNode_slug = aRole0[z];
                    var nextNodeHTML = "";
                    nextNodeHTML += "<div ";
                    nextNodeHTML += " data-slug='"+nextNode_slug+"' ";
                    nextNodeHTML += " class='singleNodeContainer' ";
                    nextNodeHTML += " >";
                    nextNodeHTML += nextNode_slug;
                    nextNodeHTML += "</div>";
                    jQuery("#role0Container").append(nextNodeHTML)
                }

                // role6 nodes
                for (var z=0;z<aRole6.length;z++) {
                    var nextNode_slug = aRole6[z];
                    var nextNodeHTML = "";
                    nextNodeHTML += "<div ";
                    nextNodeHTML += " data-slug='"+nextNode_slug+"' ";
                    nextNodeHTML += " class='singleNodeContainer' ";
                    nextNodeHTML += " >";
                    nextNodeHTML += nextNode_slug;
                    nextNodeHTML += "</div>";
                    jQuery("#role6Container").append(nextNodeHTML)
                }

                // role7 nodes
                for (var z=0;z<aRole7.length;z++) {
                    var nextNode_slug = aRole7[z];
                    var nextNodeHTML = "";
                    nextNodeHTML += "<div ";
                    nextNodeHTML += " data-slug='"+nextNode_slug+"' ";
                    nextNodeHTML += " class='singleNodeContainer' ";
                    nextNodeHTML += " >";
                    nextNodeHTML += nextNode_slug;
                    nextNodeHTML += "</div>";
                    jQuery("#role7Container").append(nextNodeHTML)
                }

                // role3 node
                var nextNodeHTML = "";
                nextNodeHTML += "<div ";
                nextNodeHTML += " data-slug='"+role3_slug+"' ";
                nextNodeHTML += " class='singleNodeContainer' ";
                nextNodeHTML += " >";
                nextNodeHTML += role3_slug;
                nextNodeHTML += "</div>";
                jQuery("#role3Container").html(nextNodeHTML)

                // role4 node
                var nextNodeHTML = "";
                nextNodeHTML += "<div ";
                nextNodeHTML += " data-slug='"+role4_slug+"' ";
                nextNodeHTML += " class='singleNodeContainer' ";
                nextNodeHTML += " >";
                nextNodeHTML += role4_slug;
                nextNodeHTML += "</div>";
                jQuery("#role4Container").html(nextNodeHTML)

                // role5 node
                var nextNodeHTML = "";
                nextNodeHTML += "<div ";
                nextNodeHTML += " data-slug='"+role5_slug+"' ";
                nextNodeHTML += " class='singleNodeContainer' ";
                nextNodeHTML += " >";
                nextNodeHTML += role5_slug;
                nextNodeHTML += "</div>";
                jQuery("#role5Container").html(nextNodeHTML)
            }

            jQuery("#uneditedWordContainer").val("")

            jQuery(".singleNodeContainer").click(function(){
                jQuery(".singleNodeContainer").css("background-color","#EFEFEF")
                // jQuery(".governingRelationshipContainer").css("background-color","#EFEFEF")
                jQuery(this).css("background-color","orange")
                // add rawFile to textarea
                var clickedWord_slug = jQuery(this).data("slug")
                var oWord = window.lookupWordBySlug[clickedWord_slug];
                var sWord = JSON.stringify(oWord,null,4);
                jQuery("#uneditedWordContainer").val(sWord)
            })
            makeVisGraph_Enumeration(oEnumeration);
        });

        jQuery("#showSelecteWordBoxButton").click(function(){
            jQuery(this).css("background-color","green")
            jQuery("#showJsonSchemaFormBoxButton").css("background-color","#EFEFEF")
            jQuery("#showSpecificInstancesBoxButton").css("background-color","#EFEFEF")

            jQuery("#singleWordBox").css("display","block")
            jQuery("#jsonSchemaFormBox").css("display","none")
            jQuery("#specificInstancesBox").css("display","none")
        })
        jQuery("#showJsonSchemaFormBoxButton").click(function(){
            jQuery(this).css("background-color","green")
            jQuery("#showSelecteWordBoxButton").css("background-color","#EFEFEF")
            jQuery("#showSpecificInstancesBoxButton").css("background-color","#EFEFEF")

            jQuery("#singleWordBox").css("display","none")
            jQuery("#jsonSchemaFormBox").css("display","block")
            jQuery("#specificInstancesBox").css("display","none")
        })
        jQuery("#showSpecificInstancesBoxButton").click(function(){
            jQuery(this).css("background-color","green")
            jQuery("#showJsonSchemaFormBoxButton").css("background-color","#EFEFEF")
            jQuery("#showSelecteWordBoxButton").css("background-color","#EFEFEF")

            jQuery("#singleWordBox").css("display","none")
            jQuery("#jsonSchemaFormBox").css("display","none")
            jQuery("#specificInstancesBox").css("display","block")
        })

        jQuery("#showParsedSpecificInstanceButton").click(function(){
            jQuery(this).css("background-color","green")
            jQuery("#showFullSpecificInstanceButton").css("background-color","#EFEFEF")

            jQuery("#specificInstanceParsedBox").css("display","inline-block")
            jQuery("#specificInstanceCompleteBox").css("display","none")
        })
        jQuery("#showFullSpecificInstanceButton").click(function(){
            jQuery(this).css("background-color","green")
            jQuery("#showParsedSpecificInstanceButton").css("background-color","#EFEFEF")

            jQuery("#specificInstanceCompleteBox").css("display","inline-block")
            jQuery("#specificInstanceParsedBox").css("display","none")
        })
        jQuery("#graphViewingStyleButton").click(function(){
            var viewStyle = jQuery(this).data("viewstyle")
            if (viewStyle=="showAsConcepts") {
                jQuery(this).data("viewstyle","showGreaterDetail")
                jQuery(this).html("show greater detail")
            }
            if (viewStyle=="showGreaterDetail") {
                jQuery(this).data("viewstyle","showAsConcepts")
                jQuery(this).html("show as concepts")
            }
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" style={{backgroundColor:"#CFCFCF"}} >
                        <ConceptGraphMasthead />
                        <div class="h2">Enumeration Tree Management Explorer</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>

                        <div style={{fontSize:"12px",margin:"5px 0px 0px 20px"}} >
                            <div id="enumerationsContainer" style={{width:"100%"}}></div>
                            <div id="graphViewToggleButton" data-status="closed" className="doSomethingButton">toggle graph</div>
                            <div id="graphViewingStyleButton" data-viewstyle="showAsConcepts" className="doSomethingButton">show as concepts</div>
                        </div>

                        <div id="graphViewContainer"
                            style={{backgroundColor:"#EFEFEF",height:"0px",padding:"0px",border:"0px solid black",overflow:"hidden"}}
                            >
                            <center>graph view</center>
                        </div>

                        <div className="standardDoubleColumn" style={{fontSize:"12px",width:"500px",border:"1px solid black"}} >
                            <center>enumeration data</center>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    enumeration:
                                </div>
                                <div id="enumerationSlugContainer" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    uniqueID:
                                </div>
                                <div id="uniqueIDContainer" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    subsets:
                                </div>
                                <div id="subsetsContainer" className="leftColumnRightPanel" style={{width:"40px"}} ></div>
                                change: <select id="changeSubsetsSelector">
                                    <option value="false">false</option>
                                    <option value="true">true</option>
                                </select>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    dependencies:
                                </div>
                                <div id="dependenciesContainer" className="leftColumnRightPanel" style={{width:"40px"}}  ></div>
                                change: <select id="changeDependenciesSelector">
                                    <option value="false">false</option>
                                    <option value="true">true</option>
                                </select>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    up vs down:
                                </div>
                                <div id="dependenciesUpVsDownContainer" className="leftColumnRightPanel" style={{width:"40px"}}  >.</div>
                                change: <select id="changeDependenciesUpVsDownSelector">
                                    <option value="up">up</option>
                                    <option value="down">down</option>
                                </select>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    string vs array:
                                </div>
                                <div id="stringVsArrayContainer" className="leftColumnRightPanel" style={{width:"40px"}}  ></div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    JSONSchema:
                                </div>
                                <div id="targetJSONSchemaContainer" className="leftColumnRightPanel" ></div>
                            </div>

                            <center>nodes by role</center>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    role0:
                                </div>
                                <div id="role0Container" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    role1:
                                </div>
                                <div id="role1Container" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    role2:
                                </div>
                                <div id="role2Container" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    role3:
                                </div>
                                <div id="role3Container" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    role4:
                                </div>
                                <div id="role4Container" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    role5:
                                </div>
                                <div id="role5Container" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    role6:
                                </div>
                                <div id="role6Container" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    role7:
                                </div>
                                <div id="role7Container" className="leftColumnRightPanel" >
                                </div>
                            </div>

                            <br/>

                        </div>

                        <div style={{border:"1px solid grey",display:"inline-block",width:"800px",height:"900px",textAlign:"center"}} >
                            <div id="showSelecteWordBoxButton" className="doSomethingButton" >show selected word</div>
                            <div id="showJsonSchemaFormBoxButton" className="doSomethingButton" >show JSON Schema form</div>
                            <div id="showSpecificInstancesBoxButton" className="doSomethingButton" >show specific instances</div>
                            <div id="singleWordBox">
                                <div id="showUneditedSelecteWordButton" className="doSomethingButton" >unedited</div>
                                <div id="showEditedSelecteWordButton" className="doSomethingButton" >edited</div>
                                <div id="updateSelecteWordButton" className="doSomethingButton" >UPDATE (save edited)</div>
                                <textarea id="uneditedWordContainer" style={{display:"inline-block",width:"95%",height:"800px"}} ></textarea>
                            </div>
                            <div id="jsonSchemaFormBox" style={{display:"inline-block",width:"95%",height:"800px",textAlign:"left"}} >
                                jsonSchemaFormBox
                            </div>
                            <div id="specificInstancesBox" style={{display:"inline-block",width:"95%",height:"800px",textAlign:"left"}} >
                                <div id="specificInstancesBox" style={{display:"inline-block",width:"250px",height:"800px",overflow:"scroll",fontSize:"12px"}} >
                                    <center>specific instances</center>
                                    <div id="specificInstancesListContainer"></div>
                                </div>
                                <div style={{border:"1px dashed grey",height:"800px",width:"495px",display:"inline-block"}} >
                                    <div id="showParsedSpecificInstanceButton" className="doSomethingButton" style={{backgroundColor:"green"}} >parsed</div>
                                    <div id="showFullSpecificInstanceButton" className="doSomethingButton"  >full</div>
                                    <br/>
                                    <textarea id="specificInstanceCompleteBox" style={{display:"inline-block",width:"490px",height:"700px",overflow:"scroll",fontSize:"12px",display:"none"}} >
                                        specificInstanceCompleteBox
                                    </textarea>
                                    <textarea id="specificInstanceParsedBox" style={{display:"inline-block",width:"490px",height:"700px",overflow:"scroll",fontSize:"12px"}} >
                                        specificInstanceParsedBox
                                    </textarea>
                                </div>
                            </div>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
