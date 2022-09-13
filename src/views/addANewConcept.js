import React, { Component, createRef, useEffect, useRef } from "react";
import * as MiscFunctions from '../lib/miscFunctions.js';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import ReactJSONSchemaForm from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import schema from '../json/schemaTest';
import conditionalDemo from '../json/conditionalDemo';
import grapevineConditionalDemo from '../json/grapevineConditionalDemo';
import propertyTypes from '../json/propertyTypes';
// import { DataSet, Network } from 'vis';
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
// import VisNetworkB from './VisNetworkB';
import * as TestConstants from './buildConceptFamily/conceptsInfo';
import * as VisStyleConstants from '../lib/visjs/visjs-style';
import GenerateCompactConceptSummarySelector, { reorganizeConcept, addEdgeWithStyling } from './GenerateCompactConceptSummarySelector';
// addEdgeWithStyling
import IpfsHttpClient from 'ipfs-http-client';
import sendAsync from '../renderer';
import Type3Module from './buildConceptFamily/propertyType3Module';
import EditPropertyList from './buildConceptFamily/editPropertyList';
import EditJSONSchema from './buildConceptFamily/editJSONSchema';
import ManageConceptSpecificInstances from './buildConceptFamily/ManageConceptSpecificInstances';
import PropertySchemaAutoBuild from './buildConceptFamily/propertySchemaAutoBuild';
import PropertyModules from './buildConceptFamily/propertyModules';
import PrimaryPropertyType1InputsEditor from './buildConceptFamily/primaryPropertyType1InputsEditor';
import EditPrimaryPropertyJSONSchema from './buildConceptFamily/editPrimaryPropertyJSONSchema';

import ManageStringProperty from './buildConceptFamily/manageStringProperty';
import ManageArrayProperty from './buildConceptFamily/manageArrayProperty';
import ManageObjectProperty from './buildConceptFamily/manageObjectProperty';
import ManageRequiredAndUniqueProperties from './buildConceptFamily/manageRequiredAndUniqueProperties';
import ManageConceptToConceptRelationships from './buildConceptFamily/manageConceptToConceptRelationships';

import EnumerationEditor from './buildConceptFamily/enumerationEditor';
import * as VisjsFunctions from '../lib/visjs/visjs-functions.js';



const Form = ReactJSONSchemaForm.default;
const jQuery = require("jquery");

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

function onFormSubmit (event) {
    // console.log("---Form submitted---");
    // console.log(event.formData);
}
function onFormChange (event) {
    // console.log("---Form changed---");
    // console.log(event.formData);
    var formData_str = JSON.stringify(event.formData,null,4);
    var formDataHTML = "";
    formDataHTML += "<center>formData</center>";
    formDataHTML += "<pre style=background-color:white; >";
    formDataHTML += formData_str;
    formDataHTML += "</pre>";
    jQuery("#updatedDemo_formData_B").html(formDataHTML);
}

function shoot() {
    // schema_obj.properties.title = {};
    // schema_obj.properties.title.type = "string";
    schema_str = document.getElementById("JSONSchema_rawFile_parent").value;
    schema_obj = JSON.parse(schema_str);
    // alert("new schema_str: "+schema_str);
    document.getElementById("schemaBeingEdited").innerHTML = schema_str;
    document.getElementById("schemaBeingEdited").value = schema_str;
    ReactDOM.render(<ReactJSONSchemaForm schema={schema_obj} />,document.getElementById('updatedDemo'))
}

function shoot_B() {
    // schema_obj.properties.title = {};
    // schema_obj.properties.title.type = "string";
    var schema_str_B = document.getElementById("JSONSchema_rawFile_parent_B").value;
    var schema_obj_B = JSON.parse(schema_str_B);
    // alert("new schema_str: "+schema_str);
    document.getElementById("schemaBeingEdited_B").innerHTML = schema_str_B;
    document.getElementById("schemaBeingEdited_B").value = schema_str_B;
    ReactDOM.render(
      <>
      <ReactJSONSchemaForm
        schema={schema_obj_B}
        onSubmit={onFormSubmit}
        onChange={onFormChange}
        />
      </>,
        document.getElementById('updatedDemo_B')
    )
}

let conditionalDemo_str = JSON.stringify(conditionalDemo,null,4);
let grapevineConditionalDemo_str = JSON.stringify(grapevineConditionalDemo,null,4);
// console.log("conditionalDemo_str: "+conditionalDemo_str)

let schema_obj = TestConstants.schema_obj;

let listOfConcepts_arr = TestConstants.listOfConcepts_arr;

let conceptsInfo_obj = TestConstants.conceptsInfo_obj;

let schema_str = JSON.stringify(schema_obj,null,4)

let schema_obj_B = TestConstants.schema_obj;
let schema_str_B = JSON.stringify(schema_obj_B,null,4)

export var lookupRawFileBySlug_obj = {};
lookupRawFileBySlug_obj.edited = {};
export async function loadWordsIntoLookup() {
    lookupRawFileBySlug_obj = {};
    lookupRawFileBySlug_obj.edited = {};
    var currentConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
    console.log("loadWordsIntoLookup; currentConceptGraph_tableName: "+currentConceptGraph_tableName)
    var sql = "";
    sql += " SELECT * FROM "+currentConceptGraph_tableName;
    sendAsync(sql).then((words_arr) => {
        var numWords = words_arr.length;
        for (var w=0;w<numWords;w++) {
            var nextWord = words_arr[w];
            var nextWord_rF_str = nextWord.rawFile;
            var nextWord_slug = nextWord.slug;
            // console.log("loadWordsIntoLookup; slug: "+nextWord_slug)
            var nextWord_rF_obj = JSON.parse(nextWord_rF_str);
            lookupRawFileBySlug_obj[nextWord_slug] = JSON.parse(JSON.stringify(nextWord_rF_obj));
            lookupRawFileBySlug_obj.edited[nextWord_slug] = JSON.parse(JSON.stringify(nextWord_rF_obj));
            // lookupRawFileBySlug_obj.edited[nextWord_slug].wordData.edited = "edited";
        }
    });
}

function send(sql) {
    // console.log("send; sql: "+sql)
    sendAsync(sql).then((result) => this.setResponse({response: result}) );
}

var templatesByWordType_obj={};
var sql_selectTemplates = " SELECT * FROM wordTemplatesByWordType ";
sendAsync(sql_selectTemplates).then((templates_arr) => {
    var numTemplates = templates_arr.length;
    // console.log("sql_selectTemplates, numTemplates: "+numTemplates)
    for (var t=0;t<numTemplates;t++) {
        var nextTemplate_obj = templates_arr[t];
        var nextWordType = nextTemplate_obj["wordType"];
        templatesByWordType_obj[nextWordType] = JSON.parse(nextTemplate_obj["rawFile"]);
    }
} );
export { templatesByWordType_obj };

function isRelObjInArrayOfObj(rel_obj,rels_arr) {
    var nodeFrom_slug = rel_obj["nodeFrom"]["slug"];
    var relType_slug = rel_obj["relationshipType"]["slug"];
    var nodeTo_slug = rel_obj["nodeTo"]["slug"];
    var numRels = rels_arr.length;
    var thisIsAMatch = false;
    for (var y=0;y<numRels;y++) {
        var nextNodeFrom_slug = rels_arr[y]["nodeFrom"]["slug"];
        var nextRelType_slug = rels_arr[y]["relationshipType"]["slug"];
        var nextNodeTo_slug = rels_arr[y]["nodeTo"]["slug"];

        if ( (nodeFrom_slug==nextNodeFrom_slug) && (relType_slug==nextRelType_slug) && (nodeTo_slug==nextNodeTo_slug) ) {
            thisIsAMatch = true;
        }
    }
    return thisIsAMatch;
}

function isWordObjInArrayOfObj(word_obj,words_arr) {
    var word_slug = word_obj["slug"];
    var word_ipns = word_obj["ipns"];
    var numWords = words_arr.length;
    var thisIsAMatch = false;
    for (var y=0;y<numWords;y++) {
        var nextWord_slug = words_arr[y]["slug"];
        var nextWord_ipns = words_arr[y]["ipns"];
        if ( (word_slug==nextWord_slug) && (word_ipns==nextWord_ipns) ) {
            thisIsAMatch = true;
        }
    }
    return thisIsAMatch;
}

// An array of nodes
var nodes = new DataSet([
  { id: 1, label: 'Node 1' },
  { id: 2, label: 'Node 2' },
  { id: 3, label: 'Node 3' },
  { id: 4, label: 'Node 4' },
  { id: 5, label: 'Node 5' }
]);

// An array of edges
var edges = new DataSet([
  { from: 1, to: 3 },
  { from: 1, to: 2 },
  { from: 2, to: 4 },
  { from: 2, to: 5 }
]);

var data = {
  nodes,
  edges
};

var options = VisStyleConstants.options_vis_c2c;

var network = {};

export var highlightedNode_slug = "";

export const VisNetworkB = () => {

    // A reference to the div rendered by this component
    var domNode = useRef(null);

    // A reference to the vis network instance
    network = useRef(null);

    useEffect(
      () => {
        network.current = new Network(domNode.current, data, options);
        network.current.fit();
        var reservedPanelByClick = false;

        network.current.on("click",function(params){
           // console.log("network current on click; VisNetworkB")
            reservedPanelByClick = false;
            var nodes_arr = params.nodes;
            var numNodes = nodes_arr.length;
            if (numNodes==1) {
                var nodeID = nodes_arr[0];
                var nodeInfo = nodes.get(nodeID);
                var node_slug = nodeInfo.slug;
                highlightedNode_slug = node_slug;
                // console.log("clicked node; node_slug: "+node_slug)
                var node_rF_obj = lookupRawFileBySlug_obj.edited[node_slug];
                var node_rF_str = JSON.stringify(node_rF_obj,null,4);
                var nodeHTML = node_rF_str;
                jQuery("#visJsDisplay1").css("display","block");
                jQuery("#visJsDisplay1").html(nodeHTML);
                jQuery("#visJsDisplay1").val(nodeHTML);
                jQuery("#visJsDisplay2").css("display","block");
                jQuery("#visJsDisplay2").html(nodeHTML);
                jQuery("#visJsDisplay2").val(nodeHTML);
                reservedPanelByClick = true;
            }
            highlightedNode_slug = node_slug;
        });
      },
      [domNode, network, data, options]
    );

    return (
      <div style={{height:"100%"}} ref = { domNode } />
    );
};

function clearFieldsCompactConceptSummary() {
    // console.log("clearFieldsCompactConceptSummary clicked");
    jQuery("#newConceptSingular").val("");
    jQuery("#newConceptSingular").html("");
    jQuery("#newConceptPlural").val("");
    jQuery("#newConceptPlural").html("");

    jQuery("#newConceptSingular_quickAdd").val("");
    jQuery("#newConceptSingular_quickAdd").html("");
    jQuery("#newConceptPlural_quickAdd").val("");
    jQuery("#newConceptPlural_quickAdd").html("");

    jQuery("#ipns_wordType").val("");
    jQuery("#ipns_wordType").html("");
    jQuery("#ipns_superset").val("");
    jQuery("#ipns_superset").html("");
    jQuery("#ipns_schema").val("");
    jQuery("#ipns_schema").html("");
    jQuery("#ipns_JSONSchema").val("");
    jQuery("#ipns_JSONSchema").html("");
    jQuery("#ipns_concept").val("");
    jQuery("#ipns_concept").html("");
    jQuery("#ipns_propertySchema").val("");
    jQuery("#ipns_propertySchema").html("");
    jQuery("#ipns_properties").val("");
    jQuery("#ipns_properties").html("");
    jQuery("#ipns_primaryProperty").val("");
    jQuery("#ipns_primaryProperty").html("");

    jQuery("#keyname_wordType").val("");
    jQuery("#keyname_wordType").html("");
    jQuery("#keyname_superset").val("");
    jQuery("#keyname_superset").html("");
    jQuery("#keyname_schema").val("");
    jQuery("#keyname_schema").html("");
    jQuery("#keyname_JSONSchema").val("");
    jQuery("#keyname_JSONSchema").html("");
    jQuery("#keyname_concept").val("");
    jQuery("#keyname_concept").html("");
    jQuery("#keyname_propertySchema").val("");
    jQuery("#keyname_propertySchema").html("");
    jQuery("#keyname_properties").val("");
    jQuery("#keyname_properties").html("");
    jQuery("#keyname_primaryProperty").val("");
    jQuery("#keyname_primaryProperty").html("");

    jQuery.each(propertyTypes,function(nextPropertyType,obj){
        if (obj.applyTo.propertySchemas===true) {
            jQuery("#keyname_propertySets_"+nextPropertyType).val("");
            jQuery("#keyname_propertySets_"+nextPropertyType).html("");
            jQuery("#ipns_propertySets_"+nextPropertyType).val("");
            jQuery("#ipns_propertySets_"+nextPropertyType).html("");
        }
    });

    jQuery("#addSetsContainer").html("");
    jQuery("#addSpecificInstancesContainer").html("");
    jQuery("#addSetsContainer").val("");
    jQuery("#addSpecificInstancesContainer").val("");
    newSets_arr = [];
    newSpecificInstances_arr = [];
    numLinksThisSet = {};
    numLinksThisSpecificInstance = {};
    // newProperties_arr = [];
}
export { clearFieldsCompactConceptSummary };

export function reorganizeSchema_mSCG() {
    // console.log("reorganizeSchema_mSCG")
    for (var x=0;x<50;x++) {
        setTimeout(function (){
            var edgeIDs_arr = edges.getIds();
            // console.log('edgeIDs_arr', edgeIDs_arr);
            var numEdgeIDs = edgeIDs_arr.length;
            // console.log('numEdgeIDs:'+ numEdgeIDs);

            // initialize some stuff to zero
            var numSubsetsOfThisConcept_arr = [];
            for (var z=0;z<numEdgeIDs;z++) {
                var edgeID = edgeIDs_arr[z];
                var edge = edges.get(edgeID);
                var reversedArrows = edge.reversedArrows;
                if (reversedArrows==false) {
                    var fromID = edge.from;
                    var toID = edge.to;
                } else {
                    var toID = edge.from;
                    var fromID = edge.to;
                }
                numSubsetsOfThisConcept_arr[toID]=0;
                numSubsetsOfThisConcept_arr[fromID]=0;
            }
            for (var z=0;z<numEdgeIDs;z++) {
                var edgeID = edgeIDs_arr[z];
                // console.log('edgeID:'+ edgeID);
                var edge = edges.get(edgeID);
                var relationshipType = edge.relationshipType;
                var reversedArrows = edge.reversedArrows;
                // console.log('relationshipType:'+ relationshipType);

                if (reversedArrows==false) {
                    var fromID = edge.from;
                    var toID = edge.to;
                } else {
                    var toID = edge.from;
                    var fromID = edge.to;
                }
                var nodeFrom = nodes.get(fromID);
                var nodeFrom_slug = nodeFrom.slug;
                var nodeFrom_wordType = nodeFrom.wordType;

                var nodeTo = nodes.get(toID);
                var nodeTo_slug = nodeTo.slug;
                var nodeTo_wordType = nodeTo.wordType;

                var nodeFrom_x = nodeFrom.x;
                var nodeFrom_y = nodeFrom.y;
                var nodeTo_x = nodeTo.x;
                var nodeTo_y = nodeTo.y;
                // console.log("nodeFrom_x: "+nodeFrom_x+"; nodeFrom_y: "+nodeFrom_y+"; nodeTo_x: "+nodeTo_x);

                var totNumSubsetsOfThisConcept_from = nodeFrom.totNumSubsetsOfThisConcept;
                var totNumSubsetsOfThisConcept_to = nodeTo.totNumSubsetsOfThisConcept;

                if (relationshipType=="isASubsetOf") {
                    var x_extra = 6* ( 2*numSubsetsOfThisConcept_arr[toID] - (totNumSubsetsOfThisConcept_to-1) );
                    var y_extra = 1* ( 2*numSubsetsOfThisConcept_arr[toID] - (totNumSubsetsOfThisConcept_to-1) );
                    numSubsetsOfThisConcept_arr[toID]++;
                    // console.log("nodeFrom_slug: "+nodeFrom_slug+"; z: "+z+"; x_extra: "+x_extra);
                    nodes.update({id:toID,physics:false});
                    var x_increment = (nodeTo_x - nodeFrom_x) / 5;
                    var y_increment = (nodeTo_y+200 - nodeFrom_y) / 5;
                    // console.log("nodeFrom_slug: "+nodeFrom_slug+"; x_increment: "+x_increment+"; y_increment: "+y_increment);
                    nodes.update({id:fromID,x:nodeFrom_x + x_increment +x_extra,y:nodeFrom_y + y_increment + y_extra,physics:false });
                }
                if (relationshipType=="isADependentPropertyFor") {
                    nodes.update({id:toID,physics:false});
                    nodes.update({id:fromID,physics:false});
                    var x_increment = (nodeTo_x + 200 - nodeFrom_x) / 5;
                    var y_increment = (nodeTo_y - nodeFrom_y) / 5;
                    nodes.update({id:fromID,x:nodeFrom_x + x_increment,y:nodeFrom_y + y_increment,physics:false });
                }
                if (relationshipType=="isARealizationOf") {
                    nodes.update({id:toID,physics:false});
                    var x_increment = (nodeFrom_x+200 - nodeTo_x) / 5;
                    var y_increment = (nodeFrom_y-100 - nodeTo_y) / 5;
                    nodes.update({id:toID,x:nodeTo_x + x_increment,y:nodeTo_y + y_increment,physics:false});
                }
            }
            // set totals which will be used on the next round
            for (var z=0;z<numEdgeIDs;z++) {
                var edgeID = edgeIDs_arr[z];
                var edge = edges.get(edgeID);
                var reversedArrows = edge.reversedArrows;
                if (reversedArrows==false) {
                    var fromID = edge.from;
                    var toID = edge.to;
                } else {
                    var toID = edge.from;
                    var fromID = edge.to;
                }
                var foo = numSubsetsOfThisConcept_arr[fromID];
                nodes.update({id:fromID,totNumSubsetsOfThisConcept:foo });
                var foo = numSubsetsOfThisConcept_arr[toID];
                nodes.update({id:toID,totNumSubsetsOfThisConcept:foo });
            }
        }, 500);
    }
}

/*
export function reorganizeSchema_mSCG_depr() {
    console.log("reorganizeSchema_mSCG")
    var edgeIDs_arr = edges.getIds();
    var numEdgeIDs = edgeIDs_arr.length;
    var nodeIDs_arr = nodes.getIds();
    var numNodeIDs = nodeIDs_arr.length;
    for (var z=0;z<numNodeIDs;z++) {
        var nodeID = nodeIDs_arr[z];
        var node = nodes.get(nodeID);
        console.log("z: "+z+"; nodeID: "+nodeID);
        var node_conceptRole = node.conceptRole;
        console.log("node_conceptRole: "+node_conceptRole)
        nodes.update({id:nodeID, numDirectDescendants: 0 });
    }
    for (var z=0;z<numEdgeIDs;z++) {
        var edgeID = edgeIDs_arr[z];
        var edge = edges.get(edgeID);
        var nodeFromID = edge.nodeA;
        var nodeToID = edge.nodeB;
        var relType = edge.relationshipType;
        if (relType=="isASubsetOf") {
            var nodeTo = nodes.get(nodeToID);
            var nodeDD = nodeTo.numDirectDescendants;
            nodeDD++;
            nodes.update({id:nodeToID, numDirectDescendants: nodeDD });
            nodes.update({id:nodeFromID, dirDescendantNumber: nodeDD });
        }
    }
    for (var i=0;i<10;i++) {
        for (var z=0;z<numEdgeIDs;z++) {
            var edgeID = edgeIDs_arr[z];
            var edge = edges.get(edgeID);
            var nodeFromID = edge.nodeA;
            var nodeToID = edge.nodeB;
            var relType = edge.relationshipType;
            if (relType=="isASubsetOf") {
                var nodeTo = nodes.get(nodeToID);
                var nDD = nodeTo.numDirectDescendants;
                var nodeFrom = nodes.get(nodeFromID);
                var ddN = nodeFrom.dirDescendantNumber;
                var midpoint_x = (nodeFrom.x + nodeTo.x) / 2;
                var midpoint_y = (nodeFrom.y + nodeTo.y) / 2;
                var desiredDisplacement_x = 50;
                var desiredDisplacement_y = 150;
                var nT_x = midpoint_x - desiredDisplacement_x;
                var nT_y = midpoint_y - desiredDisplacement_y;
                var nF_x = nT_x + desiredDisplacement_x * ddN - desiredDisplacement_x*(nDD-0.5);
                var nF_y = nT_y + desiredDisplacement_y;
                nodes.update({id:nodeFromID,x:nF_x,y:nF_y,physics:false });
                nodes.update({id:nodeToID,x:nT_x,y:nT_y,physics:false });
            }
            if (relType=="isARealizationOf") {
                var nodeTo = nodes.get(nodeToID);
                var nDD = nodeTo.numDirectDescendants;
                var nodeFrom = nodes.get(nodeFromID);
                var ddN = nodeFrom.dirDescendantNumber;
                var midpoint_x = (nodeFrom.x + nodeTo.x) / 2;
                var midpoint_y = (nodeFrom.y + nodeTo.y) / 2;
                var desiredDisplacement_x = - 50;
                var desiredDisplacement_y = 150;
                var nT_x = midpoint_x - desiredDisplacement_x;
                var nT_y = midpoint_y - desiredDisplacement_y;
                var nF_x = nT_x + desiredDisplacement_x * ddN - desiredDisplacement_x*(nDD-0.5);
                var nF_y = nT_y + desiredDisplacement_y;
                nodes.update({id:nodeFromID,x:nF_x,y:nF_y,physics:false });
                nodes.update({id:nodeToID,x:nT_x,y:nT_y,physics:false });
            }
        }
    }
}
*/
export function reorganizeSchema_propertySchema() {
    // console.log("reorganizeSchema_propertySchema")
    var edgeIDs_arr = edges.getIds();
    // console.log('edgeIDs_arr', edgeIDs_arr);
    var numEdgeIDs = edgeIDs_arr.length;
    var nodeIDs_arr = nodes.getIds();
    // console.log('edgeIDs_arr', edgeIDs_arr);
    var numNodeIDs = nodeIDs_arr.length;

    var numHasKeyNodes=0;
    var numType1Nodes=0;
    var numType3Nodes=0;
    for (var z=0;z<numNodeIDs;z++) {
        var nodeID = nodeIDs_arr[z];
        var node = nodes.get(nodeID);
        // console.log("z: "+z+"; nodeID: "+nodeID);
        var node_slug = node.slug;
        var node_rF_obj = lookupRawFileBySlug_obj[node_slug];
        if (node_rF_obj.wordData.wordType=="property") {
            if (node_rF_obj.propertyData.type=="hasKey") {
                nodes.update({id:nodeID,group:'property_hasKey',x:-300+120*numHasKeyNodes,y:250,physics:false });
                numHasKeyNodes++;
            }
            if (node_rF_obj.propertyData.type=="type1") {
                nodes.update({id:nodeID,group:'property_type1',x:-100,y:600+100*numType1Nodes,physics:false });
                numType1Nodes++;
            }
            if (node_rF_obj.propertyData.type=="type3") {
                nodes.update({id:nodeID,group:'property_type1',x:300,y:600+100*numType3Nodes,physics:false });
                numType1Nodes++;
            }
        }
        var node_conceptRole = node.conceptRole;
        if (node_conceptRole=="wordType") {
            nodes.update({id:nodeID,x:0,y:0,physics:false });
        }
        if (node_conceptRole=="JSONSchema") {
            nodes.update({id:nodeID,x:-175,y:0,physics:false });
        }
        if (node_conceptRole=="concept") {
            nodes.update({id:nodeID,x:0,y:-150,physics:false });
        }
        if (node_conceptRole=="schema") {
            nodes.update({id:nodeID,x:125,y:-150,physics:false });
        }
        if (node_conceptRole=="superset") {
            nodes.update({id:nodeID,x:0,y:175,physics:false });
        }
        if (node_conceptRole=="propertySchema") {
            nodes.update({id:nodeID,x:175,y:0,physics:false });
        }
        if (node_conceptRole=="primaryProperty") {
            nodes.update({id:nodeID,x:-175,y:-150,physics:false });
        }
        // console.log("node_conceptRole: "+node_conceptRole)
        nodes.update({id:nodeID, numDirectDescendants: 0 });
    }
    for (var z=0;z<numEdgeIDs;z++) {
        var edgeID = edgeIDs_arr[z];
        var edge = edges.get(edgeID);
        var nodeFromID = edge.nodeA;
        var nodeToID = edge.nodeB;
        var relType = edge.relationshipType;
        if ( (relType=="subsetOf") || (relType=="isASpecificInstanceOf") ) {
            var nodeTo = nodes.get(nodeToID);
            var nodeDD = nodeTo.numDirectDescendants;
            nodeDD++;
            nodes.update({id:nodeToID, numDirectDescendants: nodeDD });
            nodes.update({id:nodeFromID, dirDescendantNumber: nodeDD });
        }
    }
    for (var i=0;i<10;i++) {
        for (var z=0;z<numEdgeIDs;z++) {
            var edgeID = edgeIDs_arr[z];
            var edge = edges.get(edgeID);
            var nodeFromID = edge.nodeA;
            var nodeToID = edge.nodeB;
            var relType = edge.relationshipType;
            if ( (relType=="subsetOf") || (relType=="isASpecificInstanceOf") ) {
                var nodeTo = nodes.get(nodeToID);
                var nDD = nodeTo.numDirectDescendants;
                var nodeFrom = nodes.get(nodeFromID);
                var ddN = nodeFrom.dirDescendantNumber;
                var nT_x = nodeTo.x;
                var nT_y = nodeTo.y;
                var nF_x = nT_x + 150 * ddN - 150*(nDD-0.5);
                var nF_y = nT_y + 150;
                nodes.update({id:nodeFromID,x:nF_x,y:nF_y,physics:false });
            }
        }
    }







    /*
    // initialize some stuff to zero
    var numPropertyDescendantsOfThisNode_arr = [];
    for (var z=0;z<numEdgeIDs;z++) {
        var edgeID = edgeIDs_arr[z];
        var edge = edges.get(edgeID);
        var reversedArrows = edge.reversedArrows;
        if (reversedArrows==false) {
            var fromID = edge.from;
            var toID = edge.to;
        } else {
            var toID = edge.from;
            var fromID = edge.to;
        }
        numPropertyDescendantsOfThisNode_arr[toID]=0;
        numPropertyDescendantsOfThisNode_arr[fromID]=0;
    }
    for (var z=0;z<numEdgeIDs;z++) {
        var edgeID = edgeIDs_arr[z];
        console.log('edgeID:'+ edgeID);
        var edge = edges.get(edgeID);
        var relationshipType = edge.relationshipType;
        var reversedArrows = edge.reversedArrows;
        console.log('relationshipType:'+ relationshipType);

        if (reversedArrows==false) {
            var fromID = edge.from;
            var toID = edge.to;
        } else {
            var toID = edge.from;
            var fromID = edge.to;
        }
        var nodeFrom = nodes.get(fromID);
        var nodeFrom_slug = nodeFrom.slug;
        var nodeFrom_wordType = nodeFrom.wordType;

        var nodeTo = nodes.get(toID);
        var nodeTo_slug = nodeTo.slug;
        var nodeTo_wordType = nodeTo.wordType;

        var nodeFrom_x = nodeFrom.x;
        var nodeFrom_y = nodeFrom.y;
        var nodeTo_x = nodeTo.x;
        var nodeTo_y = nodeTo.y;
        console.log("nodeFrom_x: "+nodeFrom_x+"; nodeFrom_y: "+nodeFrom_y+"; nodeTo_x: "+nodeTo_x);

        var totNumSubsetsOfThisConcept_from = nodeFrom.totNumSubsetsOfThisConcept;
        var totNumSubsetsOfThisConcept_to = nodeTo.totNumSubsetsOfThisConcept;

        if (relationshipType=="addPropertyKey") {
            var x_extra = 6* ( 2*numPropertyDescendantsOfThisNode_arr[toID] - (totNumSubsetsOfThisConcept_to-1) );
            var y_extra = 1* ( 2*numPropertyDescendantsOfThisNode_arr[toID] - (totNumSubsetsOfThisConcept_to-1) );
            numPropertyDescendantsOfThisNode_arr[toID]++;
            // console.log("nodeFrom_slug: "+nodeFrom_slug+"; z: "+z+"; x_extra: "+x_extra);
            nodes.update({id:toID,physics:false});
            var x_increment = (nodeTo_x - nodeFrom_x) / 5;
            var y_increment = (nodeTo_y+200 - nodeFrom_y) / 5;
            console.log("nodeFrom_slug: "+nodeFrom_slug+"; x_increment: "+x_increment+"; y_increment: "+y_increment);
            nodes.update({id:fromID,x:nodeFrom_x + x_increment +x_extra,y:nodeFrom_y + y_increment + y_extra,physics:false });
        }

    }
    // set totals which will be used on the next round
    for (var z=0;z<numEdgeIDs;z++) {
        var edgeID = edgeIDs_arr[z];
        var edge = edges.get(edgeID);
        var reversedArrows = edge.reversedArrows;
        if (reversedArrows==false) {
            var fromID = edge.from;
            var toID = edge.to;
        } else {
            var toID = edge.from;
            var fromID = edge.to;
        }
        var foo = numPropertyDescendantsOfThisNode_arr[fromID];
        nodes.update({id:fromID,totNumSubsetsOfThisConcept:foo });
        var foo = numPropertyDescendantsOfThisNode_arr[toID];
        nodes.update({id:toID,totNumSubsetsOfThisConcept:foo });
    }
    */
    // network.fit();
}

export function reorganizeSchema() {
    // console.log("reorganizeSchema A")
    var edgeIDs_arr = edges.getIds();
    // console.log('edgeIDs_arr', edgeIDs_arr);
    var numEdgeIDs = edgeIDs_arr.length;
    var nodeIDs_arr = nodes.getIds();
    // console.log('edgeIDs_arr', edgeIDs_arr);
    var numNodeIDs = nodeIDs_arr.length;
    var enumNum = 0;
    for (var z=0;z<numNodeIDs;z++) {
        var nodeID = nodeIDs_arr[z];
        var node = nodes.get(nodeID);
        // console.log("z: "+z+"; nodeID: "+nodeID);
        var node_conceptRole = node.conceptRole;
        if (node_conceptRole=="wordType") {
            nodes.update({id:nodeID,x:0,y:0,physics:false });
        }
        if (node_conceptRole=="JSONSchema") {
            nodes.update({id:nodeID,x:-175,y:0,physics:false });
        }
        if (node_conceptRole=="concept") {
            nodes.update({id:nodeID,x:0,y:-150,physics:false });
        }
        if (node_conceptRole=="schema") {
            nodes.update({id:nodeID,x:125,y:-150,physics:false });
        }
        if (node_conceptRole=="superset") {
            nodes.update({id:nodeID,x:0,y:175,physics:false });
        }
        if (node_conceptRole=="propertySchema") {
            nodes.update({id:nodeID,x:-175,y:-150,physics:false });
        }
        if (node_conceptRole=="enumeration") {
            nodes.update({id:nodeID,x:350,y:-150 + enumNum * 100,physics:false });
            enumNum++;
        }
        // console.log("node_conceptRole: "+node_conceptRole)
        nodes.update({id:nodeID, numDirectDescendants: 0 });
    }
    for (var z=0;z<numEdgeIDs;z++) {
        var edgeID = edgeIDs_arr[z];
        var edge = edges.get(edgeID);
        var nodeFromID = edge.nodeA;
        var nodeToID = edge.nodeB;
        var relType = edge.relationshipType;
        var nodeFrom = nodes.get(nodeFromID);
        var nodeTo = nodes.get(nodeToID);
        if ( (relType=="subsetOf") || (relType=="isASpecificInstanceOf") ) {
            var nodeTo = nodes.get(nodeToID);
            var nodeDD = nodeTo.numDirectDescendants;
            nodeDD++;
            nodes.update({id:nodeToID, numDirectDescendants: nodeDD });
            nodes.update({id:nodeFromID, dirDescendantNumber: nodeDD });
        }
        if (relType=="enumerates") {
            nodes.update({id:nodeToID,x:-350});
        }
        if (relType=="enumeratesSingleValue") {
            nodes.update({id:nodeToID,x:-350});
        }
    }
    for (var i=0;i<10;i++) {
        for (var z=0;z<numEdgeIDs;z++) {
            var edgeID = edgeIDs_arr[z];
            var edge = edges.get(edgeID);
            var nodeFromID = edge.nodeA;
            var nodeToID = edge.nodeB;
            var relType = edge.relationshipType;
            var nodeTo = nodes.get(nodeToID);
            var nodeFrom = nodes.get(nodeFromID);
            if ( (relType=="subsetOf") || (relType=="isASpecificInstanceOf") ) {
                var nDD = nodeTo.numDirectDescendants;
                var ddN = nodeFrom.dirDescendantNumber;
                var nT_x = nodeTo.x;
                var nT_y = nodeTo.y;
                var nF_x = nT_x + 150 * ddN - 150*(nDD-0.5);
                var nF_y = nT_y + 150;
                nodes.update({id:nodeFromID,x:nF_x,y:nF_y,physics:false });
            }
            if ( relType=="isThePrimaryPropertyFor" ) {
                var x_new = nodeTo.x - 175;
                var y_new = nodeTo.y + 125;
                nodes.update({id:nodeFromID,x:x_new,y:y_new,physics:false });
                // console.log("reorganizeSchema isThePropertySchemaFor; x_new: "+x_new+"; y_new: "+y_new)
            }
            if ( relType=="isTheSetOfPropertiesFor" ) {
                var x_new = nodeTo.x + 175;
                var y_new = nodeTo.y;
                nodes.update({id:nodeFromID,x:x_new,y:y_new,physics:false });
                // console.log("reorganizeSchema isThePropertySchemaFor; x_new: "+x_new+"; y_new: "+y_new)
            }
            /*
            if ( relType=="enumerates" ) {
                var x_new = nodeFrom.x - 200;
                var y_new = nodeFrom.y + 50;
                nodes.update({id:nodeToID,x:x_new,y:y_new,physics:false });
                console.log("reorganizeSchema enumerates")
            }
            */
        }
    }
    // network.fit();
}

/*
// deprecated; moved to visjs-functions
// make graph from schema of type: propertySchema
function makeVisGraph_propertySchema(schemaSlug,networkElemID) {
    var schema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[schemaSlug]));
    var schema_rF_str = JSON.stringify(schema_rF_obj,null,4);
    console.log("schema_rF_str: "+schema_rF_str);

    var schema_nodes_obj = schema_rF_obj.schemaData.nodes;
    var schema_rels_obj = schema_rF_obj.schemaData.relationships;
    var numNodes = schema_nodes_obj.length;
    var numRels = schema_rels_obj.length;
    console.log("makeVisGraphS; schemaSlug: "+schemaSlug+"; numNodes: "+numNodes+"; numRels: "+numRels);

    var nextNode_obj = {};
    var nextEdge_obj = {};
    var nodes_arr = [];
    var edges_arr = [];
    // { id: aW_wordType_slug, label: aW_wordType_slug, conceptRole: 'wordType', group: 'wordType', x:0, y:0, physics:false },
    // nextEdge_obj = {from: aW_JSONSchema_slug, to: aW_wordType_slug, nodeA: aW_JSONSchema_slug, nodeB: aW_wordType_slug, relationshipType: 'isTheJSONSchemaFor' };

    for (var n=0;n<numNodes;n++) {
        var nextNode_obj = schema_nodes_obj[n];
        var nextNode_slug = nextNode_obj.slug;
        var nextNode_rF_obj = lookupRawFileBySlug_obj[nextNode_slug];
        var nextNode_wordType = nextNode_rF_obj.wordData.wordType;
        var nextNode_title = nextNode_rF_obj.wordData.title;
        var nextNode_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;

        var nextNode_conceptRole = nextNode_wordType;
        if (nextNode_wordType=="schema") {
            if (jQuery.inArray("propertySchema",nextNode_rF_obj.schemaData.metaData.types) > -1 ) {
                nextNode_conceptRole = "propertySchema";
            }
        }

        var nextNode_label = nextNode_slug;

        var nextNode_x = 0;
        var nextNode_y = 0;

        if (nextNode_wordType=="schema") {
            nextNode_x = 100;
            nextNode_y = -100;
        }
        if (nextNode_wordType=="JSONSchema") {
            nextNode_x = -100;
            nextNode_y = 0;
        }
        if (nextNode_wordType=="wordType") {
            nextNode_x = 0;
            nextNode_y = 0;
        }
        if (nextNode_wordType=="superset") {
            nextNode_x = 0;
            nextNode_y = 100;
        }
        if (nextNode_wordType=="concept") {
            nextNode_x = 0;
            nextNode_y = -100;
        }
        if (nextNode_conceptRole=="propertySchema") {
            nextNode_x = 100;
            nextNode_y = 0;
        }
        if (nextNode_conceptRole=="primaryProperty") {
            nextNode_x = -100;
            nextNode_y = -100;
        }

        if (nextNode_wordType=="property") {
            var nextNode_propertyData_obj = nextNode_rF_obj.propertyData;
            var nextNode_propertyData_str = JSON.stringify(nextNode_propertyData_obj,null,4);
            nextNode_label = nextNode_title;
            nextNode_title = nextNode_propertyData_str;
        }

        var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_label, slug: nextNode_slug, title: nextNode_title, group: nextNode_wordType, conceptRole: nextNode_conceptRole, x: nextNode_x, y: nextNode_y }
        nodes_arr.push(nextNode_vis_obj)
    }

    for (var n=0;n<numRels;n++) {
        var nextRel_obj = schema_rels_obj[n];
        var nextRel_nF_slug = nextRel_obj.nodeFrom.slug;
        var nextRel_rT_slug = nextRel_obj.relationshipType.slug;
        var nextRel_rT_propertyField = "";
        if (nextRel_rT_slug=="addPropertyKey") {
            nextRel_rT_propertyField = nextRel_obj.relationshipType.addPropertyKeyData.field;
        }
        if (nextRel_rT_slug=="addPropertyValue") {
            nextRel_rT_propertyField = nextRel_obj.relationshipType.addPropertyValueData.field;
        }
        var nextRel_nT_slug = nextRel_obj.nodeTo.slug;
        var nextRel_vis_obj = { from: nextRel_nF_slug, to: nextRel_nT_slug, nodeA: nextRel_nF_slug, nodeB: nextRel_nT_slug, relationshipType: nextRel_rT_slug, propertyField: nextRel_rT_propertyField }
        edges_arr = addEdgeWithStyling(edges_arr,nextRel_vis_obj);
        // edges_arr.push(nextRel_vis_obj)
    }

    nodes = new DataSet(nodes_arr);
    edges = new DataSet(edges_arr);
    data = {
        nodes,
        edges
    };

    // ReactDOM.render(<VisNetworkB />,document.getElementById('network_buildConceptPage'))
    ReactDOM.render(<VisNetworkB clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        // networkElemID = 'network_buildConceptPage'
        document.getElementById(networkElemID)
    )
    reorganizeSchema_propertySchema();
}
*/
// make graph for schema of type: mainSchemaForConceptGraph
function makeVisGraph_mSCG(schemaSlug) {
    var schema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[schemaSlug]));
    var schema_nodes_obj = schema_rF_obj.schemaData.nodes;
    var schema_rels_obj = schema_rF_obj.schemaData.relationships;
    var numNodes = schema_nodes_obj.length;
    var numRels = schema_rels_obj.length;
    // console.log("makeVisGraph_mSCG; schemaSlug: "+schemaSlug+"; numNodes: "+numNodes+"; numRels: "+numRels);

    var nextNode_obj = {};
    var nextEdge_obj = {};
    var nodes_arr = [];
    var edges_arr = [];

    for (var n=0;n<numNodes;n++) {
        var nextNode_obj = schema_nodes_obj[n];
        var nextNode_slug = nextNode_obj.slug;
        var nextNode_rF_obj = lookupRawFileBySlug_obj[nextNode_slug];
        var nextNode_wordType = nextNode_rF_obj.wordData.wordType;
        var nextNode_x = 0;
        var nextNode_y = 0;
        var nextNode_conceptRole = nextNode_wordType;
        if (nextNode_wordType=="schema") {
            if (jQuery.inArray("propertySchema",nextNode_rF_obj.schemaData.metaData.types) > -1 ) {
                nextNode_conceptRole = "propertySchema";
            }
        }

        if (nextNode_wordType=="concept") {
            // nextNode_x = 100;
            // nextNode_y = -100;
            nextNode_x = Math.floor(Math.random() * 300) - 150;
            nextNode_y = Math.floor(Math.random() * 300) - 150;
        }
        var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_slug, slug: nextNode_slug, title: nextNode_slug, totNumSubsetsOfThisConcept: 0, group: nextNode_wordType, conceptRole: nextNode_conceptRole, x: nextNode_x, y: nextNode_y, physics:false }
        nodes_arr.push(nextNode_vis_obj)
    }

    for (var n=0;n<numRels;n++) {
        var nextRel_obj = schema_rels_obj[n];
        var nextRel_nF_slug = nextRel_obj.nodeFrom.slug;
        var nextRel_rT_slug = nextRel_obj.relationshipType.slug;
        var nextRel_nT_slug = nextRel_obj.nodeTo.slug;
        var nextRel_vis_obj = { from: nextRel_nF_slug, to: nextRel_nT_slug, nodeA: nextRel_nF_slug, nodeB: nextRel_nT_slug, relationshipType: nextRel_rT_slug }
        edges_arr = addEdgeWithStyling(edges_arr,nextRel_vis_obj);
        // edges_arr.push(nextRel_vis_obj)
    }

    nodes = new DataSet(nodes_arr);
    edges = new DataSet(edges_arr);
    data = {
        nodes,
        edges
    };
    // ReactDOM.render(<VisNetworkB />,document.getElementById('network_buildConceptPage'))

    ReactDOM.render(<VisNetworkB clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        document.getElementById('network_buildConceptPage')
    )
    reorganizeSchema_mSCG();
}

// make graph from schema of type: plain schema or conceptSchema
function makeVisGraphS(schemaSlug) {
    var schema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[schemaSlug]));
    var schema_rF_str = JSON.stringify(schema_rF_obj,null,4);
    // console.log("schema_rF_str: "+schema_rF_str);

    var schema_nodes_obj = schema_rF_obj.schemaData.nodes;
    var schema_rels_obj = schema_rF_obj.schemaData.relationships;
    var numNodes = schema_nodes_obj.length;
    var numRels = schema_rels_obj.length;
    // console.log("makeVisGraphS; schemaSlug: "+schemaSlug+"; numNodes: "+numNodes+"; numRels: "+numRels);

    var nextNode_obj = {};
    var nextEdge_obj = {};
    var nodes_arr = [];
    var edges_arr = [];
    // { id: aW_wordType_slug, label: aW_wordType_slug, conceptRole: 'wordType', group: 'wordType', x:0, y:0, physics:false },
    // nextEdge_obj = {from: aW_JSONSchema_slug, to: aW_wordType_slug, nodeA: aW_JSONSchema_slug, nodeB: aW_wordType_slug, relationshipType: 'isTheJSONSchemaFor' };

    for (var n=0;n<numNodes;n++) {
        var nextNode_obj = schema_nodes_obj[n];
        var nextNode_slug = nextNode_obj.slug;
        var nextNode_rF_obj = lookupRawFileBySlug_obj[nextNode_slug];
        var nextNode_wordType = nextNode_rF_obj.wordData.wordType;
        var nextNode_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;
        var nextNode_x = 0;
        var nextNode_y = 0;
        var nextNode_conceptRole = nextNode_wordType;
        if (nextNode_wordType=="schema") {
            if (jQuery.inArray("propertySchema",nextNode_rF_obj.schemaData.metaData.types) > -1 ) {
                nextNode_conceptRole = "propertySchema";
            }
        }

        if (nextNode_wordType=="schema") {
            nextNode_x = -100;
            nextNode_y = -100;
        }
        if (nextNode_wordType=="JSONSchema") {
            nextNode_x = -100;
            nextNode_y = 0;
        }
        if (nextNode_wordType=="wordType") {
            nextNode_x = 0;
            nextNode_y = 0;
        }
        if (nextNode_wordType=="superset") {
            nextNode_x = 0;
            nextNode_y = 100;
        }
        if (nextNode_wordType=="concept") {
            nextNode_x = 100;
            nextNode_y = -100;
        }
        var nextNode_vis_obj = { id: nextNode_slug, label: nextNode_slug, slug: nextNode_slug, title: nextNode_slug, group: nextNode_wordType, conceptRole: nextNode_conceptRole, physics: false, x: nextNode_x, y: nextNode_y }
        nodes_arr.push(nextNode_vis_obj)
    }

    for (var n=0;n<numRels;n++) {
        var nextRel_obj = schema_rels_obj[n];
        var nextRel_nF_slug = nextRel_obj.nodeFrom.slug;
        var nextRel_rT_slug = nextRel_obj.relationshipType.slug;
        var nextRel_nT_slug = nextRel_obj.nodeTo.slug;
        var nextRel_vis_obj = { from: nextRel_nF_slug, to: nextRel_nT_slug, nodeA: nextRel_nF_slug, nodeB: nextRel_nT_slug, relationshipType: nextRel_rT_slug }
        edges_arr = addEdgeWithStyling(edges_arr,nextRel_vis_obj);
        // edges_arr.push(nextRel_vis_obj)
    }

    nodes = new DataSet(nodes_arr);
    edges = new DataSet(edges_arr);
    data = {
        nodes,
        edges
    };
    // ReactDOM.render(<VisNetworkB />,document.getElementById('network_buildConceptPage'))
    ReactDOM.render(<VisNetworkB clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        document.getElementById('network_buildConceptPage')
    )
    reorganizeSchema();
}

// this function, makeVisGraphB, is being deprecated; it handles conceptslug called from old concepts
function makeVisGraphB(conceptslug) {
    // console.log("makeVisGraphB; conceptslug: "+conceptslug)
    var superset_slug = "superset_for_";
    if (lookupRawFileBySlug_obj.hasOwnProperty(conceptslug)) {
        var concept_rF_obj = lookupRawFileBySlug_obj[conceptslug];
        if (concept_rF_obj.hasOwnProperty("conceptData")) {
            superset_slug = concept_rF_obj.conceptData.nodes.superset.slug;
        } else {
            superset_slug = "supserset_for_"+conceptslug;
        }
    }
    // var superset_slug = conceptsInfo_obj[conceptslug].superset;
    var wT = "wordType";
    var nodes_arr = [];
    var wordType_obj = { id: conceptslug, label: conceptslug, title: conceptslug, slug: conceptslug, group: wT, physics: false, x:0, y:0 };
    var superset_obj = { id: superset_slug, label: superset_slug, title: superset_slug, slug: superset_slug, group: "superset", physics: false, x:0, y: 150 };
    nodes_arr.push(wordType_obj)
    nodes_arr.push(superset_obj)
    // sets
    // var subsets_arr = conceptsInfo_obj[conceptslug]["allSets"][superset_slug].subsets;
    var subsets_arr = concept_rF_obj.globalDynamicData.subsets;
    if (!subsets_arr) { var subsets_arr = []; }
    var numSubsets = subsets_arr.length;
    for (var s =0;s<numSubsets;s++) {
        var nextSet_slug = subsets_arr[s];
        var nextSet_obj = { id: nextSet_slug, label: nextSet_slug, title: nextSet_slug, slug: nextSet_slug, group: "set" };
        nodes_arr.push(nextSet_obj)
    }

    // specificInstances
    // var si_arr = conceptsInfo_obj[conceptslug]["allSets"][superset_slug].specificInstances;
    var si_arr = concept_rF_obj.globalDynamicData.specificInstances;
    if (!si_arr) { var si_arr = []; }
    var numSpecificInstances = si_arr.length;
    for (var s =0;s<numSpecificInstances;s++) {
        var nextSi_slug = si_arr[s];
        var nextSi_obj = { id: nextSi_slug, label: nextSi_slug, title: nextSi_slug, slug: nextSi_slug, group: "highlightedOption" };
        nodes_arr.push(nextSi_obj)
    }

    nodes = new DataSet(nodes_arr);

    edges = new DataSet([
      {from:superset_slug, to: conceptslug, label:"subsetOf"}
    ]);

    data = {
      nodes,
      edges
    };

    ReactDOM.render(<VisNetworkB />,document.getElementById('network_buildConceptPage'))
}
export { makeVisGraphB };


let defaultData_obj = {};
defaultData_obj["type"] = "object";
defaultData_obj["title"] = "";
defaultData_obj["properties"] = {};
defaultData_obj["required"] = [];
defaultData_obj["required"].push("name");
defaultData_obj["properties"]["name"] = {};
defaultData_obj["properties"]["name"]["type"] = "string";
defaultData_obj["properties"]["name"]["title"] = "Name";
// defaultData_obj["required"].push("title");
defaultData_obj["properties"]["title"] = {};
defaultData_obj["properties"]["title"]["type"] = "string";
defaultData_obj["properties"]["title"]["title"] = "Title";
// defaultData_obj["required"].push("slug");
defaultData_obj["properties"]["slug"] = {};
defaultData_obj["properties"]["slug"]["type"] = "string";
defaultData_obj["properties"]["slug"]["title"] = "Slug";
/*
// defaultData_obj["required"].push("alias");
defaultData_obj["properties"]["alias"] = {};
defaultData_obj["properties"]["alias"]["type"] = "string";
*/
var numKeysGenerated = 0;
async function generateNewKey_cnwPage(myNewKey,target_id) {
    numKeysGenerated++;
    const generatedKey_obj = await ipfs.key.gen(myNewKey, {
        type: 'rsa',
        size: 2048
    })
    // console.log("new generatedKey_obj: "+generatedKey_obj)
    var generatedKey_id = generatedKey_obj["id"];
    var generatedKey_name = generatedKey_obj["name"];
    // console.log("generatedKey id in B: "+generatedKey_id+"; name: "+generatedKey_name+"; numKeysGenerated: "+numKeysGenerated);
    document.getElementById(target_id).value = generatedKey_id;

    return generatedKey_id;
}

function calculateFamilyUnit_B() {
    // console.log("calculateFamilyUnit_B");

    var e = document.getElementById("addPropertySelector_e_path_B");
    var conceptwordtype_path_B = e.options[e.selectedIndex].getAttribute("data-conceptwordtype");
    // console.log("conceptwordtype_path_B: "+conceptwordtype_path_B)
    // conceptwordtype_path = jQuery("#addPropertySelector_path option:selected ").data("conceptwordtype")

    var e = document.getElementById("addPropertySelector_e_key_B");
    var conceptwordtype_key_B = e.options[e.selectedIndex].getAttribute("data-conceptwordtype");
    // console.log("conceptwordtype_key_B: "+conceptwordtype_key_B)
    // conceptwordtype_key = jQuery("#addPropertySelector_key option:selected ").data("conceptwordtype")

    var e = document.getElementById("addPropertySelector_e_value_type_B");
    var valuetype_B = e.options[e.selectedIndex].getAttribute("data-valuetype");
    // console.log("valuetype_B: "+valuetype_B)
    // valuetype = jQuery("#addPropertySelector_value_type option:selected ").data("valuetype")

    var e = document.getElementById("addPropertySelector_e_value_targetA_B");
    var numOptions_value_targetA_B = e.options.length;
    // console.log("numOptions_value_targetA_B: "+numOptions_value_targetA_B)
    var valuetargetA_B = "";
    if (numOptions_value_targetA_B > 0) {
        valuetargetA_B = e.options[e.selectedIndex].getAttribute("data-valuetarget");
        // console.log("valuetargetA_B: "+valuetargetA_B)
    }

    var valuetargetA_slug_B = document.getElementById("addPropertySelector_value_targetA_slug_B").value;
    // console.log("valuetargetA_slug_B: "+valuetargetA_slug_B)

    var valuetargetA_title_B = document.getElementById("addPropertySelector_value_targetA_title_B").value;
    // console.log("valuetargetA_title_B: "+valuetargetA_title_B)

    var valuetargetA_description_B = document.getElementById("addPropertySelector_value_targetA_description_B").value;
    // console.log("valuetargetA_description_B: "+valuetargetA_description_B)

    // valuetargetA = jQuery("#addPropertySelector_value_targetA option:selected ").data("valuetarget")

    var e = document.getElementById("addPropertySelector_e_value_targetB_B");
    var valuetargetB_B = e.options[e.selectedIndex].getAttribute("data-valuetarget");
    // console.log("valuetargetB_B: "+valuetargetB_B)
    // valuetargetB = jQuery("#addPropertySelector_value_targetB option:selected ").data("valuetarget")

    var e = document.getElementById("addPropertySelector_e_value_field_B");
    var valuefield_B = e.options[e.selectedIndex].getAttribute("data-valuefield");
    // console.log("valuefield_B: "+valuefield_B)
    // valuefield = jQuery("#addPropertySelector_value_field option:selected ").data("valuefield")

    // deprecating extraPropertyKey probably
    var extraPropertyKey_B = "";

    var selectedPath_wT_rF_obj = lookupRawFileBySlug_obj[conceptwordtype_path_B];
    var selectedKey_concept_rF_obj = lookupRawFileBySlug_obj[conceptwordtype_key_B];

    var selectedPath_concept_slug = selectedPath_wT_rF_obj.wordTypeData.concept;
    var selectedPath_concept_rF_obj = lookupRawFileBySlug_obj[selectedPath_concept_slug];

    // nned to change propertyPath in conceptData so that his has a slug (animalData) and a title (Animal Data);
    // for now, use slug for both
    var path_B = selectedPath_concept_rF_obj.conceptData.propertyPath;
    var title_B = selectedPath_concept_rF_obj.conceptData.propertyPath;

    var key_B = "";

    if (conceptwordtype_key_B=="extraProperty") {
        key_B = extraPropertyKey_B;
    } else {
        if (conceptwordtype_key_B=="noConcept") {
            key_B = "?";
        } else {
            // key = conceptsInfo_obj[conceptwordtype_key]["wordType"]
            key_B = selectedPath_concept_rF_obj.conceptData.nodes.wordType.slug;
        }
    }
    // key = valuetargetA;
    key_B = valuetargetA_slug_B;

    var special_obj_B = {};
    var child_obj_B = {};
    var parent_obj_B = {};
    var schema_obj_B = {};
    var options_obj_B = {};

    var wordData_obj_B = {};

    var jsonSchemaSlug = "JSONSchemaFor"+conceptwordtype_path_B.charAt(0).toUpperCase() + conceptwordtype_path_B.slice(1);
    schema_obj_B = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[jsonSchemaSlug]));
    var parent_str_B_old = JSON.stringify(schema_obj_B,null,4);

    title_B = schema_obj_B.properties[path_B].title;
    var description_B = schema_obj_B.properties[path_B].description;

    wordData_obj_B = schema_obj_B.wordData;

    // wordData_obj_B["slug"] = jsonSchemaSlug;
    // wordData_obj_B["wordType"] = "JSONSchema";
    // wordData_obj_B["wordTypes"] = [ "word", "JSONSchema" ];

    options_obj_B["fields"] = {};
    schema_obj_B["wordData"] = wordData_obj_B;
    schema_obj_B["type"] = "object";
    // schema_obj_B["title"] = "top level";
    schema_obj_B["required"] = [];
    schema_obj_B["required"].push(path_B)
    schema_obj_B["definitions"] = {};
    schema_obj_B["properties"] = {};
    schema_obj_B["properties"][path_B] = {};
    schema_obj_B["properties"][path_B]["type"] = "object";
    schema_obj_B["properties"][path_B]["title"] = title_B;
    schema_obj_B["properties"][path_B]["description"] = description_B;
    schema_obj_B["properties"][path_B]["required"] = [];
    schema_obj_B["properties"][path_B]["properties"] = {};
    var isNameChecked = jQuery("#editConceptField_name_B").prop("checked");
    if (isNameChecked) {
        schema_obj_B["properties"][path_B]["properties"]["name"] = {}
        schema_obj_B["properties"][path_B]["properties"]["name"]["type"] = "string";
        schema_obj_B["properties"][path_B]["properties"]["name"]["title"] = "Name";
        schema_obj_B["properties"][path_B]["required"].push("name");
    }
    var isTitleChecked = jQuery("#editConceptField_title_B").prop("checked");
    if (isTitleChecked) {
        schema_obj_B["properties"][path_B]["properties"]["title"] = {}
        schema_obj_B["properties"][path_B]["properties"]["title"]["type"] = "string";
        schema_obj_B["properties"][path_B]["properties"]["title"]["title"] = "Title";
    }
    var isSlugChecked = jQuery("#editConceptField_slug_B").prop("checked");
    if (isSlugChecked) {
        schema_obj_B["properties"][path_B]["properties"]["slug"] = {}
        schema_obj_B["properties"][path_B]["properties"]["slug"]["type"] = "string";
        schema_obj_B["properties"][path_B]["properties"]["slug"]["title"] = "Slug";
    }
    var isAliasChecked = jQuery("#editConceptField_alias_B").prop("checked");
    if (isAliasChecked) {
        schema_obj_B["properties"][path_B]["properties"]["alias"] = {}
        schema_obj_B["properties"][path_B]["properties"]["alias"]["type"] = "string";
        schema_obj_B["properties"][path_B]["properties"]["alias"]["title"] = "Alias";
    }
    var numCustomType1Props = newCustomPropsType1_arr.length;
    for (var x=0;x<numCustomType1Props;x++) {
        var isNextPropChecked = jQuery("#customProp1checkbox_"+x).prop("checked");
        if (isNextPropChecked) {
            var nextPropName = jQuery("#customProp1name_"+x).val();
            schema_obj_B["properties"][path_B]["properties"][nextPropName] = {}
            schema_obj_B["properties"][path_B]["properties"][nextPropName]["type"] = "string";
            schema_obj_B["properties"][path_B]["properties"][nextPropName]["title"] = nextPropName.charAt(0).toUpperCase() + nextPropName.slice(1);
        }
    }

    if (conceptwordtype_key_B=="extraProperty") {
        child_obj_B[path_B] = {};
        child_obj_B[path_B][extraPropertyKey_B] = {};
    } else {
        if (conceptwordtype_key_B=="noConcept") {
            schema_obj_B["properties"][path_B]["type"] = "string";
            child_obj_B[path_B] = "";
        } else {
            child_obj_B[path_B] = {};
            // schema_obj_B["properties"][path_B]["dependencies"] = {};
            if (valuetype_B=="string") {
                var newProperty_slug_B = key_B;
                schema_obj_B["properties"][path_B]["required"].push(newProperty_slug_B);
                schema_obj_B["properties"][path_B]["properties"][newProperty_slug_B] = {}
                schema_obj_B["properties"][path_B]["properties"][newProperty_slug_B]["type"] = valuetype_B;
                schema_obj_B["properties"][path_B]["properties"][newProperty_slug_B]["title"] = valuetargetA_title_B;
                schema_obj_B["properties"][path_B]["properties"][newProperty_slug_B]["description"] = valuetargetA_description_B;
                schema_obj_B["properties"][path_B]["properties"][newProperty_slug_B]["enum"] = [];

                var inclDep_B = jQuery("#includeDependency_B").prop("checked");
                if (conceptwordtype_key_B != "noConcept") {
                    // var elements_arr_B = conceptsInfo_obj[conceptwordtype_key_B]["allSets"][valuetargetA_B][valuetargetB_B];
                    var selectedKey_valueTargetA_rF_obj = lookupRawFileBySlug_obj[valuetargetA_B];
                    var elements_arr_B = selectedKey_valueTargetA_rF_obj.globalDynamicData[valuetargetB_B];
                    var numElements_B = elements_arr_B.length;
                    var dependencies_obj_B = [];
                    // console.log("numElements: "+numElements);
                    for (var e=0;e<numElements_B;e++) {
                        var nextElemSlug_B = elements_arr_B[e];
                        var nextElem_rF_obj = lookupRawFileBySlug_obj[nextElemSlug_B];
                        // var nextElem_B = conceptsInfo_obj[conceptwordtype_key_B][valuetargetB_B][nextElemSlug_B][valuefield_B];
                        var nextElem_B = nextElem_rF_obj.wordData[valuefield_B];
                        // NEED_TO_DO: replace propertyPath with path: { slug: __, title: __ }
                        // for now, slug will be used for the title
                        var nextElem_rF_str = JSON.stringify(nextElem_rF_obj,null,4)
                        // console.log("nextElemSlug_B: "+nextElemSlug_B+"; valuefield_B: "+valuefield_B+"; nextElem_rF_str: "+nextElem_rF_str);
                        // var nextElem_path_B = nextElem_rF_obj.conceptData.propertyPath;
                        // var nextElem_title_B = nextElem_rF_obj.conceptData.propertyPath;
                        var nextElem_path_B = nextElemSlug_B+"Data";
                        var nextElem_title_B = nextElemSlug_B.charAt(0).toUpperCase() + nextElemSlug_B.slice(1)+" Data";
                        // var nextElem_path_B = conceptsInfo_obj[nextElemSlug_B]["path"];
                        // var nextElem_title_B = conceptsInfo_obj[nextElemSlug_B]["title"];
                        schema_obj_B["properties"][path_B]["properties"][newProperty_slug_B]["enum"].push(nextElem_B)
                        if (e==0) { schema_obj_B["properties"][path_B]["properties"][newProperty_slug_B]["default"] = nextElem_B; }
                        var nextDependency_B = {};
                        nextDependency_B["properties"] = {};
                        nextDependency_B["properties"][key_B] = {}
                        nextDependency_B["properties"][key_B]["enum"] = [];
                        nextDependency_B["properties"][key_B]["enum"].push(nextElem_B);
                        if (inclDep_B) {
                            nextDependency_B["properties"][nextElem_path_B] = {}
                            nextDependency_B["properties"][nextElem_path_B]["$ref"] = "#/definitions/"+nextElem_path_B;
                            nextDependency_B["required"] = [];
                            nextDependency_B["required"].push(nextElem_path_B)
                            dependencies_obj_B.push(nextDependency_B);
                            schema_obj_B["definitions"][nextElem_path_B] = JSON.parse(JSON.stringify(defaultData_obj));
                            schema_obj_B["definitions"][nextElem_path_B]["title"] = nextElem_title_B;
                        }
                    }
                    if (inclDep_B) {
                        schema_obj_B["properties"][path_B]["dependencies"] = {};
                        schema_obj_B["properties"][path_B]["dependencies"][key_B] = {};
                        schema_obj_B["properties"][path_B]["dependencies"][key_B]["oneOf"] = dependencies_obj_B;
                    }
                    var whichElem_B = "x";
                    if (numElements_B > 0) {
                        var whichElemNum_B = Math.floor(Math.random() * numElements_B);
                        var whichElem_slug_B = elements_arr_B[whichElemNum_B];
                        // console.log("conceptwordtype_key_B: "+conceptwordtype_key_B+"; valuetargetB_B: "+valuetargetB_B+"; whichElem_slug_B: "+whichElem_slug_B+"; valuefield_B: "+valuefield_B)
                        var whichElem_rF_obj_B = lookupRawFileBySlug_obj[whichElem_slug_B];
                        whichElem_B = whichElem_rF_obj_B.wordData[valuefield_B];
                        // whichElem_B = conceptsInfo_obj[conceptwordtype_key_B][valuetargetB_B][whichElem_slug_B][valuefield_B];
                    }
                    child_obj_B[path_B][key_B] = whichElem_B;
                    // console.log("child_obj_B; path_B: "+path_B+"; key_B: "+key_B+"; whichElem_B: "+whichElem_B)
                }
            }
            if (valuetype_B=="object") {
                var newProperty_slug_B = key_B;
                schema_obj_B["properties"][path_B]["required"].push(newProperty_slug_B);
                schema_obj_B["properties"][path_B]["properties"][newProperty_slug_B] = {}
                schema_obj_B["properties"][path_B]["properties"][newProperty_slug_B]["type"] = valuetype_B;
                schema_obj_B["properties"][path_B]["properties"][newProperty_slug_B]["title"] = "";
                schema_obj_B["properties"][path_B]["properties"][newProperty_slug_B]["required"] = [];
                schema_obj_B["properties"][path_B]["properties"][newProperty_slug_B]["properties"] = {};
                if (conceptwordtype_key_B != "noConcept") {
                    // var elements_arr_B = conceptsInfo_obj[conceptwordtype_key_B]["allSets"][valuetargetA_B][valuetargetB_B];
                    var selectedKey_valueTargetA_rF_obj = lookupRawFileBySlug_obj[valuetargetA_B];
                    var elements_arr_B = selectedKey_valueTargetA_rF_obj.globalDynamicData[valuetargetB_B];
                    var numElements_B = elements_arr_B.length;
                    var dependencies_obj_B = [];
                    for (var e=0;e<numElements_B;e++) {
                        var nextElemSlug_B = elements_arr_B[e];
                        var nextElem_rF_obj = lookupRawFileBySlug_obj[nextElemSlug_B];
                        // var nextElem_B = conceptsInfo_obj[conceptwordtype_key_B][valuetargetB_B][nextElemSlug_B][valuefield_B];
                        var nextElem_B = nextElem_rF_obj.wordData[valuefield_B];
                        // NEED_TO_DO: replace propertyPath with path: { slug: __, title: __ }
                        // for now, slug will be used for the title
                        // var nextElem_path_B = nextElem_rF_obj.conceptData.propertyPath;
                        // var nextElem_title_B = nextElem_rF_obj.conceptData.propertyPath;
                        var nextElem_path_B = nextElemSlug_B+"Data";
                        var nextElem_title_B = nextElemSlug_B.charAt(0).toUpperCase() + nextElemSlug_B.slice(1)+" Data";
                        // var nextElem_path_B = conceptsInfo_obj[nextElemSlug_B]["path"];
                        // var nextElem_title_B = conceptsInfo_obj[nextElemSlug_B]["title"];
                        schema_obj_B["properties"][path_B]["properties"][newProperty_slug_B]["properties"][nextElemSlug_B] = {};
                    }
                }
            }
        }
    }

    // now update Property Type 3 (Modules)
    var elem_arr = jQuery(".t3propertyNameTextarea");
    var numModules = elem_arr.length;
    for (var m=0;m<numModules;m++) {
        var nextElem = elem_arr[m];
        var nextModuleName = jQuery(nextElem).val();
        // console.log("nextModuleName: "+nextModuleName)
        schema_obj_B.properties[path_B].properties[nextModuleName] = {};
        schema_obj_B.properties[path_B].properties[nextModuleName].type = "object";
        schema_obj_B.properties[path_B].properties[nextModuleName].title = nextModuleName;
        schema_obj_B.properties[path_B].properties[nextModuleName].properties = {};
    }

    parent_obj_B = schema_obj_B;

    var special_str_B = JSON.stringify(special_obj_B,null,4);
    var child_str_B = JSON.stringify(child_obj_B,null,4);
    var parent_str_B = JSON.stringify(parent_obj_B,null,4);
    document.getElementById("JSONSchema_rawFile_special_B").innerHTML = special_str_B;
    document.getElementById("JSONSchema_rawFile_child_B").innerHTML = child_str_B;
    document.getElementById("JSONSchema_rawFile_parent_B").innerHTML = parent_str_B;
    document.getElementById("JSONSchema_rawFile_parent_B_old").innerHTML = parent_str_B_old;

    document.getElementById("JSONSchema_rawFile_special_B").value = special_str_B;
    document.getElementById("JSONSchema_rawFile_child_B").value = child_str_B;
    document.getElementById("JSONSchema_rawFile_parent_B").value = parent_str_B;
    document.getElementById("JSONSchema_rawFile_parent_B_old").value = parent_str_B_old;

    var conceptBeingEdited_slug = jQuery("#addPropertySelector_e_path_B option:selected").data("conceptslug");

    var propertyType2_c2cRel_obj = {}
    propertyType2_c2cRel_obj.nodeFrom = {};
    propertyType2_c2cRel_obj.relationshipType = {};
    propertyType2_c2cRel_obj.nodeTo = {};

    propertyType2_c2cRel_obj.nodeFrom.slug = conceptwordtype_key_B;
    propertyType2_c2cRel_obj.relationshipType.slug = "isADescriptorOf";
    propertyType2_c2cRel_obj.nodeTo.slug = conceptBeingEdited_slug;

    var pT2_set_slug = jQuery("#addPropertySelector_e_value_targetA_B option:selected").val();
    propertyType2_c2cRel_obj.relationshipType.isADescriptorOfData = {};
    propertyType2_c2cRel_obj.relationshipType.isADescriptorOfData.includeDependency = jQuery("#includeDependency_B").prop("checked");
    propertyType2_c2cRel_obj.relationshipType.isADescriptorOfData.set = pT2_set_slug;
    propertyType2_c2cRel_obj.relationshipType.isADescriptorOfData.property = jQuery("#addPropertySelector_e_value_field_B option:selected").val();

    // now make the standard relationships implied by this c2c rel
    // Iterate through all preexisting specificInstances of specified set (which is part of the nodeA concept),
    // check to make sure they are wordTypes, look up each one's descendent superset,
    // and add that superset as subsetOf the superset of the superset for nodeB concept
    // ??? Next: do the reverse: iterate through all preexisting sets of the nodeB concept; if it is a superset of another concept,
    // then take the corresponding wordType and make that a sI of nodeA concept
    // NOTE: the process of rearranging subsets and sI's from parent (super)set to child sets is not yet done;
    // should this be done manually? or specified within the c2c relationship??
    var propertyType2_inducedRel_obj = {}
    propertyType2_inducedRel_obj.nodeFrom = {};
    propertyType2_inducedRel_obj.relationshipType = {};
    propertyType2_inducedRel_obj.nodeTo = {};

    propertyType2_inducedRel_obj.nodeFrom.slug = "";
    propertyType2_inducedRel_obj.relationshipType.slug = "";
    propertyType2_inducedRel_obj.nodeTo.slug = "";

    var conceptBeingEdited_obj = lookupRawFileBySlug_obj[conceptBeingEdited_slug];
    var standardRel_nT_superset_slug = conceptBeingEdited_obj.conceptData.nodes.superset.slug;
    var standardRel_nT_schema_slug = conceptBeingEdited_obj.conceptData.nodes.schema.slug;

    jQuery("#propertyType2_c2cRels_container").html("");
    jQuery("#propertyType2_standardRels_container").html("");

    var pT2_set_obj = lookupRawFileBySlug_obj[pT2_set_slug];
    var pT2_set_str = JSON.stringify(pT2_set_obj,null,4);
    // console.log("pT2_set_str: "+pT2_set_str)
    if (pT2_set_obj != undefined) {
        if (pT2_set_obj.hasOwnProperty("globalDynamicData")) {
            var pT2_sI_arr = pT2_set_obj.globalDynamicData.specificInstances;
            var num_pT2_sI = pT2_sI_arr.length;
            // console.log("num_pT2_sI: "+num_pT2_sI)
            for (var s=0;s<num_pT2_sI;s++) {
                var next_sI_slug = pT2_sI_arr[s];
                var next_sI_obj = lookupRawFileBySlug_obj[next_sI_slug];
                var next_sI_concept_slug = next_sI_obj.wordTypeData.concept;
                var next_sI_concept_obj = lookupRawFileBySlug_obj[next_sI_concept_slug];
                var next_sI_superset_slug = next_sI_concept_obj.conceptData.nodes.superset.slug;
                // console.log("next_sI_slug: "+next_sI_slug);
                var nextStandardRel_obj = JSON.parse(JSON.stringify(propertyType2_inducedRel_obj));
                nextStandardRel_obj.nodeFrom.slug=next_sI_superset_slug;
                nextStandardRel_obj.relationshipType.slug="subsetOf";
                nextStandardRel_obj.nodeTo.slug=standardRel_nT_superset_slug;
                var nextStandardRel_str = JSON.stringify(nextStandardRel_obj,null,4);
                var nextStandardRelBox = "";
                nextStandardRelBox += "<div style='border:1px solid black;padding:2px' >";
                nextStandardRelBox += next_sI_superset_slug;
                nextStandardRelBox += "<div data-nump2tsi='"+s+"' id=updateSchema_"+standardRel_nT_schema_slug+" data-schemaslug="+standardRel_nT_schema_slug+" class='doSomethingButton_small addToStandardSchema' >add to and sql-update schema: </div>";
                nextStandardRelBox += standardRel_nT_schema_slug;
                nextStandardRelBox += "<br>";
                nextStandardRelBox += "<textarea id=nextStandardRel_"+s+" style='width:95%;height:250px;' >";
                nextStandardRelBox += nextStandardRel_str;
                nextStandardRelBox += "</textarea>";
                nextStandardRelBox += "</div>";
                jQuery("#propertyType2_standardRels_container").append(nextStandardRelBox);

                var nextC2cRel_obj = JSON.parse(JSON.stringify(propertyType2_inducedRel_obj));
                nextC2cRel_obj.nodeFrom.slug=next_sI_concept_slug;
                nextC2cRel_obj.relationshipType.slug="isASubsetOf";
                nextC2cRel_obj.nodeTo.slug=conceptBeingEdited_slug;
                var nextC2cRel_str = JSON.stringify(nextC2cRel_obj,null,4);
                var nextC2cRelBox = "";
                nextC2cRelBox += "<div style='border:1px solid black;padding:2px' >";
                nextC2cRelBox += next_sI_superset_slug;
                nextC2cRelBox += "<div data-nump2tsi='"+s+"' class='doSomethingButton_small addToCGMainSchema' >add to and sql-update CG Main Schema</div>";
                nextC2cRelBox += "<br>";
                nextC2cRelBox += "<textarea id=nextC2cRel_"+s+" style='width:95%;height:250px;' >";
                nextC2cRelBox += nextC2cRel_str;
                nextC2cRelBox += "</textarea>";
                nextC2cRelBox += "</div>";
                jQuery("#propertyType2_c2cRels_container").append(nextC2cRelBox);
            }
            jQuery(".addToStandardSchema").click(function(){
                var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
                var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
                var standardSchema_slug = jQuery(this).data("schemaslug");

                var nump2tsi = jQuery(this).data("nump2tsi");
                var nextRel_str = jQuery("#nextStandardRel_"+nump2tsi).val();
                var nextRel_obj = JSON.parse(nextRel_str);
                // console.log("addToStandardSchema clicked; nump2tsi: "+nump2tsi+"; nextRel_str: "+nextRel_str)

                var standardSchema_edited_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[standardSchema_slug]));
                var standardSchema_ed_updated_obj = MiscFunctions.updateSchemaWithNewRel(standardSchema_edited_obj,nextRel_obj,lookupRawFileBySlug_obj);
                var standardSchema_ed_updated_str = JSON.stringify(standardSchema_ed_updated_obj,null,4);
                // console.log("standardSchema_ed_updated_str: "+standardSchema_ed_updated_str);
                MiscFunctions.updateWordInAllTables(standardSchema_ed_updated_obj);
                lookupRawFileBySlug_obj.edited[standardSchema_slug] = JSON.parse(JSON.stringify(standardSchema_ed_updated_obj));
            })
            jQuery(".addToCGMainSchema").click(function(){
                var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
                var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
                var cgMainSchema_slug = jQuery("#cgMainSchemaSlug").val();

                var nump2tsi = jQuery(this).data("nump2tsi");
                var nextRel_str = jQuery("#nextC2cRel_"+nump2tsi).val();
                var nextRel_obj = JSON.parse(nextRel_str);
                // console.log("addToCGMainSchema clicked; nump2tsi: "+nump2tsi+"; nextRel_str: "+nextRel_str)

                var cgMainSchema_edited_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[cgMainSchema_slug]));
                var cgMainSchema_ed_updated_obj = MiscFunctions.updateSchemaWithNewRel(cgMainSchema_edited_obj,nextRel_obj,lookupRawFileBySlug_obj);
                var cgMainSchema_ed_updated_str = JSON.stringify(cgMainSchema_ed_updated_obj,null,4);
                // console.log("cgMainSchema_ed_updated_str: "+cgMainSchema_ed_updated_str);
                MiscFunctions.updateWordInAllTables(cgMainSchema_ed_updated_obj);
                lookupRawFileBySlug_obj.edited[cgMainSchema_slug] = JSON.parse(JSON.stringify(cgMainSchema_ed_updated_obj));
            })
        }
    }

    var propertyType2_c2cRel_str = JSON.stringify(propertyType2_c2cRel_obj,null,4);
    // var propertyType2_standardRel_str = JSON.stringify(propertyType2_standardRel_obj,null,4);
    document.getElementById("propertyType2_c2cRel_rF").innerHTML = propertyType2_c2cRel_str;
    document.getElementById("propertyType2_c2cRel_rF").value = propertyType2_c2cRel_str;

    // document.getElementById("propertyType2_standardRel_rF").innerHTML = propertyType2_standardRel_str;
    // document.getElementById("propertyType2_standardRel_rF").value = propertyType2_standardRel_str;

    shoot_B();

}

function calculateFamilyUnit() {
    // console.log("calculateFamilyUnit");

    var e = document.getElementById("addPropertySelector_e_path");
    var conceptwordtype_path = e.options[e.selectedIndex].getAttribute("data-conceptwordtype");
    // console.log("conceptwordtype_path: "+conceptwordtype_path)
    // conceptwordtype_path = jQuery("#addPropertySelector_path option:selected ").data("conceptwordtype")

    var e = document.getElementById("addPropertySelector_e_key");
    var conceptwordtype_key = e.options[e.selectedIndex].getAttribute("data-conceptwordtype");
    // console.log("conceptwordtype_key: "+conceptwordtype_key)
    // conceptwordtype_key = jQuery("#addPropertySelector_key option:selected ").data("conceptwordtype")

    var e = document.getElementById("addPropertySelector_e_value_type");
    var valuetype = e.options[e.selectedIndex].getAttribute("data-valuetype");
    // console.log("valuetype: "+valuetype)
    // valuetype = jQuery("#addPropertySelector_value_type option:selected ").data("valuetype")

    var e = document.getElementById("addPropertySelector_e_value_targetA");
    var numOptions_value_targetA = e.options.length;
    // console.log("numOptions_value_targetA: "+numOptions_value_targetA)
    var valuetargetA = "";
    if (numOptions_value_targetA > 0) {
        valuetargetA = e.options[e.selectedIndex].getAttribute("data-valuetarget");
        // console.log("valuetargetA: "+valuetargetA)
    }

    var valuetargetA_slug = document.getElementById("addPropertySelector_value_targetA_slug").value;
    // console.log("valuetargetA_slug: "+valuetargetA_slug)

    var valuetargetA_title = document.getElementById("addPropertySelector_value_targetA_title").value;
    // console.log("valuetargetA_title: "+valuetargetA_title)

    var valuetargetA_description = document.getElementById("addPropertySelector_value_targetA_description").value;
    // console.log("valuetargetA_description: "+valuetargetA_description)

    // valuetargetA = jQuery("#addPropertySelector_value_targetA option:selected ").data("valuetarget")

    var e = document.getElementById("addPropertySelector_e_value_targetB");
    var valuetargetB = e.options[e.selectedIndex].getAttribute("data-valuetarget");
    // console.log("valuetargetB: "+valuetargetB)
    // valuetargetB = jQuery("#addPropertySelector_value_targetB option:selected ").data("valuetarget")

    var e = document.getElementById("addPropertySelector_e_value_field");
    var valuefield = e.options[e.selectedIndex].getAttribute("data-valuefield");
    // console.log("valuefield: "+valuefield)
    // valuefield = jQuery("#addPropertySelector_value_field option:selected ").data("valuefield")

    // deprecating extraPropertyKey probably
    var extraPropertyKey = "";

    var path = conceptsInfo_obj[conceptwordtype_path]["path"];
    var title = conceptsInfo_obj[conceptwordtype_path]["title"];

    var key = "";
    if (conceptwordtype_key=="extraProperty") {
        key = extraPropertyKey;
    } else {
        if (conceptwordtype_key=="noConcept") {
            key = "?";
        } else {
            key = conceptsInfo_obj[conceptwordtype_key]["wordType"]
        }
    }
    // key = valuetargetA;
    key = valuetargetA_slug;

    var special_obj = {};
    var child_obj = {};
    var parent_obj = {};
    var schema_obj = {};
    var options_obj = {};

    var wordData_obj = {};
    wordData_obj["slug"] = "JSONSchemaFor"+conceptwordtype_path.charAt(0).toUpperCase() + conceptwordtype_path.slice(1);;
    wordData_obj["wordType"] = "JSONSchema";
    wordData_obj["wordTypes"] = [ "word", "JSONSchema" ];

    options_obj["fields"] = {};
    schema_obj["wordData"] = wordData_obj;
    schema_obj["type"] = "object";
    schema_obj["title"] = "top level";
    schema_obj["required"] = [];
    schema_obj["required"].push(path)
    schema_obj["definitions"] = {};
    /*
    schema_obj["definitions"]["postData"] = {};
    schema_obj["definitions"]["postData"]["title"] = "Post Data";
    schema_obj["definitions"]["postData"]["type"] = "string";

    schema_obj["definitions"]["userData"] = {};
    schema_obj["definitions"]["userData"]["title"] = "User Data";
    schema_obj["definitions"]["userData"]["type"] = "string";
    */
    schema_obj["properties"] = {};
    schema_obj["properties"][path] = {};
    schema_obj["properties"][path]["type"] = "object";
    schema_obj["properties"][path]["title"] = title;
    schema_obj["properties"][path]["required"] = [];
    schema_obj["properties"][path]["properties"] = {};
    schema_obj["properties"][path]["properties"]["name"] = {}
    schema_obj["properties"][path]["properties"]["name"]["type"] = "string";
    schema_obj["properties"][path]["properties"]["name"]["title"] = "Name";
    schema_obj["properties"][path]["required"].push("name");
    schema_obj["properties"][path]["properties"]["title"] = {}
    schema_obj["properties"][path]["properties"]["title"]["type"] = "string";
    schema_obj["properties"][path]["properties"]["title"]["title"] = "Title";
    schema_obj["properties"][path]["properties"]["slug"] = {}
    schema_obj["properties"][path]["properties"]["slug"]["type"] = "string";
    schema_obj["properties"][path]["properties"]["slug"]["title"] = "Slug";
    /*
    schema_obj["properties"]["name"] = {};
    schema_obj["properties"]["name"]["type"] = "string";
    schema_obj["properties"]["name"]["title"] = "name";
    schema_obj["required"].push("name")
    */

    if (conceptwordtype_key=="extraProperty") {
        child_obj[path] = {};
        child_obj[path][extraPropertyKey] = {};
    } else {
        if (conceptwordtype_key=="noConcept") {
            schema_obj["properties"][path]["type"] = "string";
            child_obj[path] = "";
        } else {
            child_obj[path] = {};
            schema_obj["properties"][path]["dependencies"] = {};
            if (valuetype=="string") {
                var newProperty_slug = key;
                schema_obj["properties"][path]["required"].push(newProperty_slug);
                schema_obj["properties"][path]["properties"][newProperty_slug] = {}
                schema_obj["properties"][path]["properties"][newProperty_slug]["type"] = valuetype;
                schema_obj["properties"][path]["properties"][newProperty_slug]["title"] = valuetargetA_title;
                schema_obj["properties"][path]["properties"][newProperty_slug]["description"] = valuetargetA_description;
                schema_obj["properties"][path]["properties"][newProperty_slug]["enum"] = [];

                // allElements_arr = conceptsInfo_obj[conceptwordtype_key][valuetargetB];
                if (conceptwordtype_key != "noConcept") {
                    var elements_arr = conceptsInfo_obj[conceptwordtype_key]["allSets"][valuetargetA][valuetargetB];
                    var numElements = elements_arr.length;
                    var dependencies_obj = [];
                    // console.log("numElements: "+numElements);
                    for (var e=0;e<numElements;e++) {
                        var nextElemSlug = elements_arr[e];
                        var nextElem = conceptsInfo_obj[conceptwordtype_key][valuetargetB][nextElemSlug][valuefield];
                        var nextElem_path = conceptsInfo_obj[nextElemSlug]["path"];
                        var nextElem_title = conceptsInfo_obj[nextElemSlug]["title"];
                        schema_obj["properties"][path]["properties"][newProperty_slug]["enum"].push(nextElem)
                        if (e==0) { schema_obj["properties"][path]["properties"][newProperty_slug]["default"] = nextElem; }
                        var nextDependency = {};
                        nextDependency["properties"] = {};
                        nextDependency["properties"][key] = {}
                        nextDependency["properties"][key]["enum"] = [];
                        nextDependency["properties"][key]["enum"].push(nextElem);
                        nextDependency["properties"][nextElem_path] = {}
                        nextDependency["properties"][nextElem_path]["$ref"] = "#/definitions/"+nextElem_path;
                        nextDependency["required"] = [];
                        nextDependency["required"].push(nextElem_path)
                        dependencies_obj.push(nextDependency);
                        schema_obj["definitions"][nextElem_path] = JSON.parse(JSON.stringify(defaultData_obj));
                        schema_obj["definitions"][nextElem_path]["title"] = nextElem_title;
                    }
                    schema_obj["properties"][path]["dependencies"] = {};
                    schema_obj["properties"][path]["dependencies"][key] = {};
                    schema_obj["properties"][path]["dependencies"][key]["oneOf"] = dependencies_obj;
                    var whichElem = "x";
                    if (numElements > 0) {
                        var whichElemNum = Math.floor(Math.random() * numElements);
                        // whichElemNum = 0;
                        var whichElem_slug = elements_arr[whichElemNum];
                        whichElem = conceptsInfo_obj[conceptwordtype_key][valuetargetB][whichElem_slug][valuefield];
                    }

                    child_obj[path][key] = whichElem;
                    // console.log("child_obj; path: "+path+"; key: "+key+"; whichElem: "+whichElem)
                }
            }
            if (valuetype=="object") {
                var newProperty_slug = key;
                schema_obj["properties"][path]["required"].push(newProperty_slug);
                schema_obj["properties"][path]["properties"][newProperty_slug] = {}
                schema_obj["properties"][path]["properties"][newProperty_slug]["type"] = valuetype;
                schema_obj["properties"][path]["properties"][newProperty_slug]["title"] = "";
                schema_obj["properties"][path]["properties"][newProperty_slug]["required"] = [];
                schema_obj["properties"][path]["properties"][newProperty_slug]["properties"] = {};
                if (conceptwordtype_key != "noConcept") {
                    var elements_arr = conceptsInfo_obj[conceptwordtype_key]["allSets"][valuetargetA][valuetargetB];
                    var numElements = elements_arr.length;
                    var dependencies_obj = [];
                    for (var e=0;e<numElements;e++) {
                        var nextElemSlug = elements_arr[e];
                        var nextElem = conceptsInfo_obj[conceptwordtype_key][valuetargetB][nextElemSlug][valuefield];
                        var nextElem_path = conceptsInfo_obj[nextElemSlug]["path"];
                        var nextElem_title = conceptsInfo_obj[nextElemSlug]["title"];
                        schema_obj["properties"][path]["properties"][newProperty_slug]["properties"][nextElemSlug] = {};
                        /*
                        var nextDependency = {};
                        nextDependency["properties"] = {};
                        nextDependency["properties"][key] = {}
                        nextDependency["properties"][key]["enum"] = [];
                        nextDependency["properties"][key]["enum"].push(nextElem);
                        nextDependency["properties"][nextElem_path] = {}
                        nextDependency["properties"][nextElem_path]["$ref"] = "#/definitions/"+nextElem_path;
                        nextDependency["required"] = [];
                        nextDependency["required"].push(nextElem_path)
                        dependencies_obj.push(nextDependency);
                        // schema_obj["definitions"][nextElem_path] = JSON.parse(JSON.stringify(defaultData_obj));
                        // schema_obj["definitions"][nextElem_path]["title"] = nextElem_title;
                        */
                    }

                }
                /*
                whichElem_slug = "x";
                if (numElements>0) { whichElem_slug = elements_arr[whichElemNum]; }
                var secondPath = conceptsInfo_obj[whichElem_slug]["path"]
                // secondPath = conceptsInfo_obj[conceptwordtype_key][valuetargetB][secondPath_slug][valuefield];
                child_obj[path][secondPath] = {};
                */
            }
        }
    }

    // schema_obj["options"] = options_obj;
    // parent_obj["schema"] = schema_obj;
    // parent_obj["options"] = options_obj;
    // parent_obj["options"] = options_obj;

    parent_obj = schema_obj;

    var special_str = JSON.stringify(special_obj,null,4);
    var child_str = JSON.stringify(child_obj,null,4);
    var parent_str = JSON.stringify(parent_obj,null,4);
    document.getElementById("JSONSchema_rawFile_special").innerHTML = special_str;
    document.getElementById("JSONSchema_rawFile_child").innerHTML = child_str;
    document.getElementById("JSONSchema_rawFile_parent").innerHTML = parent_str;

    document.getElementById("JSONSchema_rawFile_special").value = special_str;
    document.getElementById("JSONSchema_rawFile_child").value = child_str;
    document.getElementById("JSONSchema_rawFile_parent").value = parent_str;

    // jQuery("#JSONSchema_rawFile_special").val(special_str)
    // jQuery("#JSONSchema_rawFile_child").val(child_str)
    // jQuery("#JSONSchema_rawFile_parent").val(parent_str)
    // renderAlpacaForm();
    shoot();

}

function makeAddPropertySelector_path_B(words_arr) {
    var selectorHTML = "";
    selectorHTML += "<select value='0' id='addPropertySelector_e_path_B'  >";
    // var result_str = JSON.stringify(words_arr,null,4);
    // console.log("makeAddPropertySelector_path_B result: "+result_str)
    var numWords = words_arr.length;
    for (var w=0;w<numWords;w++) {
        var nextWord_str = words_arr[w]["rawFile"];
        var nextWord_obj = JSON.parse(nextWord_str);
        // console.log("nextWord_str: "+nextWord_str);
        var nextWord_slug = nextWord_obj.wordData.slug;
        var nextWord_wordTypes = nextWord_obj.wordData.wordTypes;
        var isWordType_wordType = jQuery.inArray("wordType",nextWord_wordTypes);
        if (isWordType_wordType > -1 ) {
            var nextWord_conceptSlug = nextWord_obj.wordTypeData.concept;
            // console.log("makeAddPropertySelector_path_B CONCEPT nextWord_slug: "+nextWord_slug)
            selectorHTML += '<option value="'+nextWord_slug+'" data-conceptslug="'+nextWord_conceptSlug+'" data-conceptwordtype="'+nextWord_slug+'" >'+nextWord_slug+'</option>';
        }
    }
    selectorHTML += "</select>";
    jQuery("#addPropertySelector_path_B").html(selectorHTML);
    jQuery("#addPropertySelector_e_path_B").change(function(){
        calculateFamilyUnit_B();
        setPropertyType1Checkboxes();
    })
}

function makeAddPropertySelector_path() {
    var numConcepts = listOfConcepts_arr.length;
    var selectorHTML = "";
    selectorHTML += "<select value='0' id='addPropertySelector_e_path'  >";
        for (var z=0;z<numConcepts;z++) {
            var nextConcept_slug = listOfConcepts_arr[z];
            var nextConcept_obj = conceptsInfo_obj[nextConcept_slug];
            var nextConcept_path = nextConcept_obj["path"];
            selectorHTML += '<option value="'+nextConcept_slug+'" data-conceptwordtype="'+nextConcept_slug+'" >'+nextConcept_slug+'</option>';
        }
    selectorHTML += "</select>";
    document.getElementById("addPropertySelector_path").innerHTML = selectorHTML;
    var e = document.getElementById('addPropertySelector_e_path');
    e.addEventListener('change', function (event) {
        // conceptwordtype = jQuery("#addPropertySelector_path option:selected ").data("conceptwordtype")
        // var ee = document.getElementById('addPropertySelector_path');
        var conceptwordtype =  e.value;
        // alert("conceptwordtype: "+conceptwordtype)
        // var conceptwordtype_str = JSON.stringify(conceptwordtype)
        // console.log("addPropertySelector_e_path changed; conceptwordtype: "+conceptwordtype);
        calculateFamilyUnit();
    });
}

function makeAddPropertySelector_B() {
    var currentConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
    var sql = "";
    sql += " SELECT * FROM "+currentConceptGraph_tableName;
    // console.log("makeAddPropertySelector_B sql: "+sql)

    sendAsync(sql).then((words_arr) => {
        makeAddPropertySelector_path_B(words_arr);
        makeAddPropertySelector_key_B(words_arr);
        makeAddPropertySelector_value_type_B(words_arr);
        makeAddPropertySelector_value_targetA_B(words_arr);
        makeAddPropertySelector_value_targetB_B(words_arr);

        makeAddPropertySelector_value_field_B(words_arr);
    });
}

function makeAddPropertySelector_key_B(words_arr) {
    // var numConcepts = listOfConcepts_arr.length;
    var selectorHTML = "";
    var selectorHTML2 = "";
    selectorHTML += "<select id=addPropertySelector_e_key_B >";
    selectorHTML2 += "<select id=addPropT3ConceptSelector_B >";
        selectorHTML += "<option data-conceptwordtype=noConcept >--none--</option>";
        selectorHTML += "<option data-conceptwordtype=extraProperty selected >--extraProperty--</option>";
        selectorHTML2 += "<option data-conceptwordtype=noConcept >--none--</option>";
        selectorHTML2 += "<option data-conceptwordtype=extraProperty selected >--extraProperty--</option>";
        var numWords = words_arr.length;
        for (var w=0;w<numWords;w++) {
            var nextWord_str = words_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_wordTypes = nextWord_obj.wordData.wordTypes;
            var isWordType_concept = jQuery.inArray("concept",nextWord_wordTypes);
            if (isWordType_concept > -1 ) {
                // console.log("makeAddPropertySelector_path_B CONCEPT nextWord_slug: "+nextWord_slug)
                selectorHTML += "<option data-conceptwordtype='"+nextWord_slug+"' >concept: "+nextWord_slug+"</option>";
                selectorHTML2 += "<option data-conceptwordtype='"+nextWord_slug+"' >concept: "+nextWord_slug+"</option>";
            }
        }
    selectorHTML += "</select>";
    selectorHTML2 += "</select>";
    document.getElementById("addPropertySelector_key_B").innerHTML = selectorHTML;

    var e = document.getElementById('addPropertySelector_e_key_B');
    e.addEventListener('change', function (event) {
        makeAddPropertySelector_value_targetA_B(words_arr);
        calculateFamilyUnit_B();
    });

    // deprecating addPropT3ConceptSelector_B:
    /*
    document.getElementById("addPropT3ConceptSelector_B").innerHTML = selectorHTML2;
    var e2 = document.getElementById('addPropT3ConceptSelector_B');
    e2.addEventListener('change', function (event) {
        // need to replace with appropriate fxn here:
        // makeAddPropertySelector_value_targetA_B(words_arr);
        calculateFamilyUnit_B();
    });
    */
}

function makeAddPropertySelector_key() {
    var numConcepts = listOfConcepts_arr.length;
    var selectorHTML = "";
    selectorHTML += "<select id=addPropertySelector_e_key >";
        selectorHTML += "<option data-conceptwordtype=noConcept >--none--</option>";
        selectorHTML += "<option data-conceptwordtype=extraProperty >--extraProperty--</option>";
        for (var z=0;z<numConcepts;z++) {
            var nextConcept_slug = listOfConcepts_arr[z];
            var nextConcept_obj = conceptsInfo_obj[nextConcept_slug];
            var nextConcept_path = nextConcept_obj["path"];
            selectorHTML += "<option data-conceptwordtype='"+nextConcept_slug+"' >concept: "+nextConcept_slug+"</option>";
        }
    selectorHTML += "</select>";
    document.getElementById("addPropertySelector_key").innerHTML = selectorHTML;
    var e = document.getElementById('addPropertySelector_e_key');
    e.addEventListener('change', function (event) {
        makeAddPropertySelector_value_targetA();
        calculateFamilyUnit();
    });
}

function makeAddPropertySelector_value_type_B(words_arr) {
    var selectorHTML = "";
    selectorHTML += "<select id=addPropertySelector_e_value_type_B >";
        selectorHTML += "<option data-valuetype=string >string</option>";
        selectorHTML += "<option data-valuetype=object >object</option>";
    selectorHTML += "</select>";
    document.getElementById("addPropertySelector_value_type_B").innerHTML = selectorHTML;
    var e = document.getElementById('addPropertySelector_e_value_type_B');
    e.addEventListener('change', function (event) {
        calculateFamilyUnit_B();
    });
}

function makeAddPropertySelector_value_type() {
    var numConcepts = listOfConcepts_arr.length;
    var selectorHTML = "";
    selectorHTML += "<select id=addPropertySelector_e_value_type >";
        selectorHTML += "<option data-valuetype=string >string</option>";
        selectorHTML += "<option data-valuetype=object >object</option>";
    selectorHTML += "</select>";
    document.getElementById("addPropertySelector_value_type").innerHTML = selectorHTML;
    var e = document.getElementById('addPropertySelector_e_value_type');
    e.addEventListener('change', function (event) {
        calculateFamilyUnit();
    });
}

function setTargetA_Defaults_B() {
    var targetA_slug_B = "targetA_slug";
    var targetA_title_B = "targetA_title";
    var targetA_description_B = "targetA_description";

    var e = document.getElementById("addPropertySelector_e_key_B");
    var conceptwordtype_key = e.options[e.selectedIndex].getAttribute("data-conceptwordtype");
    if ( (conceptwordtype_key != "extraProperty") && (conceptwordtype_key != "noConcept") ) {
        var e2 = document.getElementById("addPropertySelector_e_value_targetA_B");
        var nextAllSet_slug = e2.options[e2.selectedIndex].getAttribute("data-valuetarget");
        // console.log("targetA_slug; conceptwordtype_key: "+conceptwordtype_key+"; nextAllSet_slug: "+nextAllSet_slug)
        var selectedConcept_concept_rF_obj = lookupRawFileBySlug_obj[conceptwordtype_key];
        var selectedConcept_wT_slug = selectedConcept_concept_rF_obj.conceptData.nodes.wordType.slug;
        var selectedConcept_wT_rF_obj = lookupRawFileBySlug_obj[selectedConcept_wT_slug];
        targetA_slug_B = selectedConcept_wT_rF_obj.wordData.slug;
        targetA_title_B = selectedConcept_wT_rF_obj.wordData.title;
        targetA_description_B = selectedConcept_wT_rF_obj.wordData.description;
    }

    document.getElementById("addPropertySelector_value_targetA_slug_B").innerHTML = targetA_slug_B;
    document.getElementById("addPropertySelector_value_targetA_title_B").innerHTML = targetA_title_B;
    document.getElementById("addPropertySelector_value_targetA_description_B").innerHTML = targetA_description_B;
    document.getElementById("addPropertySelector_value_targetA_slug_B").value = targetA_slug_B;
    document.getElementById("addPropertySelector_value_targetA_title_B").value = targetA_title_B;
    document.getElementById("addPropertySelector_value_targetA_description_B").value = targetA_description_B;
}
function setTargetA_Defaults() {
    var targetA_slug = "targetA_slug";
    var targetA_title = "targetA_title";
    var targetA_description = "targetA_description";

    var e = document.getElementById("addPropertySelector_e_key");
    var conceptwordtype_key = e.options[e.selectedIndex].getAttribute("data-conceptwordtype");
    if ( (conceptwordtype_key != "extraProperty") && (conceptwordtype_key != "noConcept") ) {
        var e2 = document.getElementById("addPropertySelector_e_value_targetA");
        var nextAllSet_slug = e2.options[e2.selectedIndex].getAttribute("data-valuetarget");
        // console.log("targetA_slug; conceptwordtype_key: "+conceptwordtype_key+"; nextAllSet_slug: "+nextAllSet_slug)
        if (conceptsInfo_obj[conceptwordtype_key]["sets"].hasOwnProperty(nextAllSet_slug)) {
            if (conceptsInfo_obj[conceptwordtype_key]["sets"][nextAllSet_slug].hasOwnProperty("governingConcept")) {
                if (conceptsInfo_obj[conceptwordtype_key]["sets"][nextAllSet_slug]["governingConcept"].hasOwnProperty("slug")) {
                    targetA_slug = conceptsInfo_obj[conceptwordtype_key]["sets"][nextAllSet_slug]["governingConcept"]["slug"];
                }
                if (conceptsInfo_obj[conceptwordtype_key]["sets"][nextAllSet_slug]["governingConcept"].hasOwnProperty("title")) {
                    targetA_title = conceptsInfo_obj[conceptwordtype_key]["sets"][nextAllSet_slug]["governingConcept"]["title"];
                }
                if (conceptsInfo_obj[conceptwordtype_key]["sets"][nextAllSet_slug]["governingConcept"].hasOwnProperty("description")) {
                    targetA_description = conceptsInfo_obj[conceptwordtype_key]["sets"][nextAllSet_slug]["governingConcept"]["description"];
                }
            }
        }
    }

    document.getElementById("addPropertySelector_value_targetA_slug").innerHTML = targetA_slug;
    document.getElementById("addPropertySelector_value_targetA_title").innerHTML = targetA_title;
    document.getElementById("addPropertySelector_value_targetA_description").innerHTML = targetA_description;
    document.getElementById("addPropertySelector_value_targetA_slug").value = targetA_slug;
    document.getElementById("addPropertySelector_value_targetA_title").value = targetA_title;
    document.getElementById("addPropertySelector_value_targetA_description").value = targetA_description;

}

function makeAddPropertySelector_value_targetA_B(words_arr) {
    var selectorHTML = "";
    selectorHTML += "<select id=addPropertySelector_e_value_targetA_B >";
        var e = document.getElementById("addPropertySelector_e_key_B");
        var conceptwordtype_key = e.options[e.selectedIndex].getAttribute("data-conceptwordtype");
        // console.log("makeAddPropertySelector_value_targetA_B; conceptwordtype_key: "+conceptwordtype_key)
        if ( (conceptwordtype_key != "extraProperty") && (conceptwordtype_key != "noConcept") ) {
            var selectedConcept_wT_rF_obj = lookupRawFileBySlug_obj[conceptwordtype_key];
            var allSets_arr = [];
            var supersetSlug = selectedConcept_wT_rF_obj.conceptData.nodes.superset.slug;
            allSets_arr.push(supersetSlug);
            var sets_arr = [];
            if (selectedConcept_wT_rF_obj.hasOwnProperty("globalDynamicData")) {
                if (selectedConcept_wT_rF_obj.globalDynamicData.hasOwnProperty("sets")) {
                    sets_arr = selectedConcept_wT_rF_obj.globalDynamicData.sets;
                }
            }
            allSets_arr = allSets_arr.concat(sets_arr);
            var numAllSets = allSets_arr.length;
            for (var n=0;n<numAllSets;n++) {
                var nextAllSet_slug = allSets_arr[n];
                selectorHTML += "<option data-valuetarget="+nextAllSet_slug+" >"+nextAllSet_slug+"</option>";
            }
        }
    selectorHTML += "</select>";
    document.getElementById("addPropertySelector_value_targetA_B").innerHTML = selectorHTML;
    var e = document.getElementById('addPropertySelector_e_value_targetA_B');
    e.addEventListener('change', function (event) {
        setTargetA_Defaults_B()
        calculateFamilyUnit_B();
    });

    var e1 = document.getElementById('addPropertySelector_value_targetA_slug');
    e1.addEventListener('change', function (event) {
        calculateFamilyUnit_B();
    });
    var e2 = document.getElementById('addPropertySelector_value_targetA_title');
    e2.addEventListener('change', function (event) {
        calculateFamilyUnit_B();
    });
    var e3 = document.getElementById('addPropertySelector_value_targetA_description');
    e3.addEventListener('change', function (event) {
        calculateFamilyUnit_B();
    });

    setTargetA_Defaults_B();
}
function makeAddPropertySelector_value_targetA() {
    var numConcepts = listOfConcepts_arr.length;
    var selectorHTML = "";
    selectorHTML += "<select id=addPropertySelector_e_value_targetA >";
        // selectorHTML += "<option data-valuetarget=blank >--none--</option>";
        // selectorHTML += "<option data-valuetarget=specificInstances selected >specificInstances</option>";
        // selectorHTML += "<option data-valuetarget=subsets >subsets</option>";
        var e = document.getElementById("addPropertySelector_e_key");
        var conceptwordtype_key = e.options[e.selectedIndex].getAttribute("data-conceptwordtype");
        // console.log("makeAddPropertySelector_value_targetA; conceptwordtype_key: "+conceptwordtype_key)
        if ( (conceptwordtype_key != "extraProperty") && (conceptwordtype_key != "noConcept") ) {
            var allSets_arr = conceptsInfo_obj[conceptwordtype_key]["allSets"]
            var numAllSets = allSets_arr.length;
            for (var n=0;n<numAllSets;n++) {
                var nextAllSet_slug = allSets_arr[n];
                selectorHTML += "<option data-valuetarget="+nextAllSet_slug+" >"+nextAllSet_slug+"</option>";
            }
        }
    selectorHTML += "</select>";
    document.getElementById("addPropertySelector_value_targetA").innerHTML = selectorHTML;
    var e = document.getElementById('addPropertySelector_e_value_targetA');
    e.addEventListener('change', function (event) {
        setTargetA_Defaults()
        calculateFamilyUnit();
    });

    var e1 = document.getElementById('addPropertySelector_value_targetA_slug');
    e1.addEventListener('change', function (event) {
        calculateFamilyUnit();
    });
    var e2 = document.getElementById('addPropertySelector_value_targetA_title');
    e2.addEventListener('change', function (event) {
        calculateFamilyUnit();
    });
    var e3 = document.getElementById('addPropertySelector_value_targetA_description');
    e3.addEventListener('change', function (event) {
        calculateFamilyUnit();
    });

    setTargetA_Defaults();
}

function makeAddPropertySelector_value_targetB_B(words_arr) {
    var selectorHTML = "";
    selectorHTML += "<select id=addPropertySelector_e_value_targetB_B >";
        selectorHTML += "<option data-valuetarget=blank >--none--</option>";
        selectorHTML += "<option data-valuetarget=specificInstances selected >specificInstances</option>";
        selectorHTML += "<option data-valuetarget=subsets >subsets</option>";
    selectorHTML += "</select>";
    document.getElementById("addPropertySelector_value_targetB_B").innerHTML = selectorHTML;
    var e = document.getElementById('addPropertySelector_e_value_targetB_B');
    e.addEventListener('change', function (event) {
        calculateFamilyUnit_B();
    });
}
function makeAddPropertySelector_value_targetB() {
    var numConcepts = listOfConcepts_arr.length;
    var selectorHTML = "";
    selectorHTML += "<select id=addPropertySelector_e_value_targetB >";
        selectorHTML += "<option data-valuetarget=blank >--none--</option>";
        selectorHTML += "<option data-valuetarget=specificInstances selected >specificInstances</option>";
        selectorHTML += "<option data-valuetarget=subsets >subsets</option>";
    selectorHTML += "</select>";
    document.getElementById("addPropertySelector_value_targetB").innerHTML = selectorHTML;
    var e = document.getElementById('addPropertySelector_e_value_targetB');
    e.addEventListener('change', function (event) {
        calculateFamilyUnit();
    });
}

function makeAddPropertySelector_value_field_B(words_arr) {
    var selectorHTML = "";
    selectorHTML += "<select id=addPropertySelector_e_value_field_B >";
        selectorHTML += "<option data-valuefield=name >name</option>";
        selectorHTML += "<option data-valuefield=slug >slug</option>";
        selectorHTML += "<option data-valuefield=title >title</option>";
    selectorHTML += "</select>";
    document.getElementById("addPropertySelector_value_field_B").innerHTML = selectorHTML;
    var e = document.getElementById('addPropertySelector_e_value_field_B');
    e.addEventListener('change', function (event) {
        calculateFamilyUnit_B();
    });
}

function makeAddPropertySelector_value_field() {
    var numConcepts = listOfConcepts_arr.length;
    var selectorHTML = "";
    selectorHTML += "<select id=addPropertySelector_e_value_field >";
        selectorHTML += "<option data-valuefield=name >name</option>";
        selectorHTML += "<option data-valuefield=slug >slug</option>";
        selectorHTML += "<option data-valuefield=title >title</option>";
    selectorHTML += "</select>";
    document.getElementById("addPropertySelector_value_field").innerHTML = selectorHTML;
    var e = document.getElementById('addPropertySelector_e_value_field');
    e.addEventListener('change', function (event) {
        calculateFamilyUnit();
    });
};

const selector_path = [];
var numConcepts = listOfConcepts_arr.length;
for (var z=0;z<numConcepts;z++) {
    var nextConcept_slug = listOfConcepts_arr[z];
    var nextConcept_obj = conceptsInfo_obj[nextConcept_slug];
    var nextConcept_path = nextConcept_obj["path"];
    var nextEntry_obj = {}
    nextEntry_obj.slug=nextConcept_slug;
    nextEntry_obj.path=nextConcept_path;
    selector_path.push(nextEntry_obj);
}

var newSets_arr = [];
var newSpecificInstances_arr = [];
// var newProperties_arr = [];
var linksToOptions_arr = [];

function recalculateNewSpecificInstancesArray() {
    var numSpecificInstances = newSpecificInstances_arr.length;
    console.log("recalculateNewSpecificInstancesArray; numSpecificInstances: "+numSpecificInstances)
    for (var p=0;p<numSpecificInstances;p++) {
        newSpecificInstances_arr[p] = {};
        newSpecificInstances_arr[p]["title"] = jQuery("#siTitle_"+p).val();
        newSpecificInstances_arr[p]["slug"] = jQuery("#siSlug_"+p).val();
        newSpecificInstances_arr[p]["description"] = jQuery("#siDescription_"+p).val();
        newSpecificInstances_arr[p]["linksTo"] = jQuery("#siLinksToSelector_"+p+"_0 option:selected ").val();
    }
    var newSpecificInstances_str = JSON.stringify(newSpecificInstances_arr);
    console.log("recalculateNewSpecificInstancesArray, done; newSpecificInstances_str: "+newSpecificInstances_str)
}

function recalculateNewSetsArray() {
    var numSets = newSets_arr.length;
    for (var p=0;p<numSets;p++) {
        newSets_arr[p] = {};
        newSets_arr[p]["title"] = jQuery("#setTitle_"+p).val();
        newSets_arr[p]["slug"] = jQuery("#setSlug_"+p).val();
        newSets_arr[p]["description"] = jQuery("#setDescription_"+p).val();
        newSets_arr[p]["linksTo"] = jQuery("#setLinksToSelector_"+p+"_0 option:selected ").val();
    }
    var newSets_str = JSON.stringify(newSets_arr);
    // console.log("newSets_str: "+newSets_str)
}

function insertOrUpdateWordIntoMyDictionary(myDictionary,rawFile_str,slug,keyname,ipns) {
    // console.log("insertOrUpdateWordIntoMyDictionary; myDictionary: "+myDictionary+"; slug: "+slug+"; keyname: "+keyname+"; ipns: "+ipns );
    var currentTime = Date.now();
    var rawFile_obj = JSON.parse(rawFile_str);

    var wordTypes_arr = rawFile_obj["wordData"]["wordTypes"];
    var numWordTypes = wordTypes_arr.length;
    var wordTypes = "";
    for (var t=0;t<numWordTypes;t++) {
        wordTypes += wordTypes_arr[t];
        if (t+1<numWordTypes) { wordTypes += ","; }
    }

    var insertRowCommands = "";
    insertRowCommands += " INSERT OR IGNORE INTO "+myDictionary;
    insertRowCommands += " (rawFile,slug,keyname,ipns,wordTypes,whenCreated) ";
    insertRowCommands += " VALUES('"+rawFile_str+"','"+slug+"','"+keyname+"','"+ipns+"','"+wordTypes+"','"+currentTime+"' ) ";
    // console.log("insertRowCommands: "+insertRowCommands);
    sendAsync(insertRowCommands);

    var updateRowCommands = " UPDATE "+myDictionary;
    updateRowCommands += " SET ";
    updateRowCommands += " rawFile = '"+rawFile_str+"' ";
    updateRowCommands += " , slug = '"+slug+"' ";
    updateRowCommands += " , ipns = '"+ipns+"' ";
    updateRowCommands += " , wordTypes = '"+wordTypes+"' ";
    updateRowCommands += " WHERE keyname = '"+keyname+"' ";
    // console.log("updateRowCommands: "+updateRowCommands);
    sendAsync(updateRowCommands);
}
export { insertOrUpdateWordIntoMyDictionary };

function insertOrUpdateWordIntoMyConceptGraph(nextConceptGraphTableName,referenceDictionary,rawFile_str,slug,keyname,ipns) {
    var currentTime = Date.now();

    var rawFile_obj = JSON.parse(rawFile_str);
    var wordTypes_arr = rawFile_obj["wordData"]["wordTypes"];
    var numWordTypes = wordTypes_arr.length;
    var wordTypes = "";
    for (var t=0;t<numWordTypes;t++) {
        wordTypes += wordTypes_arr[t];
        if (t+1<numWordTypes) { wordTypes += ","; }
    }

    var insertRowCommands = " INSERT OR IGNORE INTO "+nextConceptGraphTableName;
    insertRowCommands += " (rawFile,slug,slug_reference,keyname_reference,ipns,ipns_reference,wordTypes,referenceDictionary,whenCreated) ";
    insertRowCommands += " VALUES('"+rawFile_str+"','"+slug+"','"+slug+"','"+keyname+"','"+ipns+"','"+ipns+"','"+wordTypes+"','"+referenceDictionary+"','"+currentTime+"' ) ";
    // console.log("insertOrUpdateWordIntoMyConceptGraph insertRowCommands: "+insertRowCommands)
    sendAsync(insertRowCommands);

    var updateRowCommands = " UPDATE "+nextConceptGraphTableName;
    updateRowCommands += " SET ";
    updateRowCommands += " rawFile = '"+rawFile_str+"' ";
    updateRowCommands += " , slug = '"+slug+"' ";
    updateRowCommands += " , slug_reference = '"+slug+"' ";
    updateRowCommands += " , keyname_reference = '"+keyname+"' ";
    updateRowCommands += " , wordTypes = '"+wordTypes+"' ";
    updateRowCommands += " , referenceDictionary = '"+referenceDictionary+"' ";
    updateRowCommands += " WHERE ipns_reference = '"+ipns+"' ";
    // console.log("insertOrUpdateWordIntoMyConceptGraph updateRowCommands: "+updateRowCommands)
    sendAsync(updateRowCommands);
}
export { insertOrUpdateWordIntoMyConceptGraph }

function insertOrUpdateWordIntoMyConceptGraphAndMyDictionary(rawFile_str,keyname,myConceptGraph,myDictionary) {
    var rawFile_obj = JSON.parse(rawFile_str);
    var slug = rawFile_obj.wordData.slug;
    var ipns = rawFile_obj.metaData.ipns;

    if ( (keyname != "") && (keyname != "__UNKNOWN__") ) {
        insertOrUpdateWordIntoMyDictionary(myDictionary,rawFile_str,slug,keyname,ipns);
    }

    insertOrUpdateWordIntoMyConceptGraph(myConceptGraph,myDictionary,rawFile_str,slug,keyname,ipns)
}
export { insertOrUpdateWordIntoMyConceptGraphAndMyDictionary }

var numLinksThisSet = {};
var numLinksThisSpecificInstance = {};

function addLinksToSiSelectorElement(siNum,n,selCon_sets_arr,si_specificInstanceOf_arr) {
    numLinksThisSpecificInstance[siNum]++;
    // console.log("numLinksThisSpecificInstance; siNum: "+siNum+"; numLinksThisSpecificInstance[siNum]: "+numLinksThisSpecificInstance[siNum])
    var numSetsThisConcept = selCon_sets_arr.length;
    var selectorHTML = "links to: ";
    selectorHTML += "<select id=siLinksToSelector_"+siNum+"_"+n+" >";
    selectorHTML += "<option>";
    selectorHTML += jQuery("#newConceptPlural").val();
    selectorHTML += "</option>";
    for (var s=0;s<numSetsThisConcept;s++) {
        var nextSet_slug = selCon_sets_arr[s];
        selectorHTML += "<option>";
        selectorHTML += nextSet_slug;
        selectorHTML += "</option>";
        // console.log("nextSet_slug: "+JSON.stringify(nextSet_slug))
    }
    selectorHTML += "</select>";
    selectorHTML += "<br>";
    jQuery("#siLinksToContainer_"+siNum).append(selectorHTML);
    // console.log("si_specificInstanceOf_arr[n]: "+si_specificInstanceOf_arr[n])
    if (si_specificInstanceOf_arr[n] != "") {
        jQuery("#siLinksToSelector_"+siNum+"_"+n).val(si_specificInstanceOf_arr[n])
    }
}
function addLinksToSetSelectorElement(setNum,n,selCon_sets_arr,set_subsetOf_arr) {
    numLinksThisSet[setNum]++;
    // console.log("numLinksThisSet; setNum: "+setNum+"; numLinksThisSet[setNum]: "+numLinksThisSet[setNum])
    var numSetsThisConcept = selCon_sets_arr.length;
    var selectorHTML = "links to: ";
    selectorHTML += "<select id=setLinksToSelector_"+setNum+"_"+n+" >";
    selectorHTML += "<option>";
    selectorHTML += jQuery("#newConceptPlural").val();
    selectorHTML += "</option>";
    for (var s=0;s<numSetsThisConcept;s++) {
        var nextSet_slug = selCon_sets_arr[s];
        selectorHTML += "<option>";
        selectorHTML += nextSet_slug;
        selectorHTML += "</option>";
        // console.log("nextSet_slug: "+JSON.stringify(nextSet_slug))
    }
    selectorHTML += "</select>";
    selectorHTML += "<br>";
    jQuery("#setLinksToContainer_"+setNum).append(selectorHTML);
    // console.log("set_subsetOf_arr[n]: "+set_subsetOf_arr[n])
    if (set_subsetOf_arr[n] != "") {
        jQuery("#setLinksToSelector_"+setNum+"_"+n).val(set_subsetOf_arr[n])
    }
}
// var lookupSpecificInstanceNumBySlug = {};
function addNextSpecificInstanceHTML(siNum,siSlug) {
    console.log("addNextSpecificInstanceHTML; siSlug: "+siSlug)
    numLinksThisSpecificInstance[siNum]=0;
    var siTitle = "";
    var siDescription = "";
    var siIPNS = "";
    var si_specificInstanceOf_arr = [];
    // var selectedConcept_wT_slug = jQuery("#compactConceptSummarySelector option:selected").val();
    var selectedConcept_wT_slug = jQuery("#compactConceptSummarySelector option:selected").data("slug");
    var selectedConcept_wT_rF_obj = lookupRawFileBySlug_obj[selectedConcept_wT_slug];
    var selectedConcept_concept_slug = selectedConcept_wT_rF_obj.wordTypeData.concept;
    var selCon_concept_rF_obj = lookupRawFileBySlug_obj[selectedConcept_concept_slug];
    var selCon_specificInstances_arr = selCon_concept_rF_obj.globalDynamicData.specificInstances;
    var selCon_propertyPath = selCon_concept_rF_obj.conceptData.propertyPath;
    var selCon_sets_arr = selCon_concept_rF_obj.globalDynamicData.sets;
    // console.log("selCon_concept_rF_obj: "+JSON.stringify(selCon_concept_rF_obj,null,4))
    if (siSlug) {
        // lookupSpecificInstanceNumBySlug[siSlug]=siNum;
        if (lookupRawFileBySlug_obj.hasOwnProperty(siSlug)) {
            // console.log("lookupSpecificInstanceNumBySlug[siSlug], siSlug: "+siSlug+"; selCon_propertyPath: "+selCon_propertyPath)
            var si_rF_obj = lookupRawFileBySlug_obj[siSlug];
            if (si_rF_obj.hasOwnProperty(selCon_propertyPath)) {
                siTitle = si_rF_obj[selCon_propertyPath].title;
                siDescription = si_rF_obj[selCon_propertyPath].description;
            } else {
                siTitle = si_rF_obj.wordData.title;
                siDescription = si_rF_obj.wordData.description;
            }
            si_specificInstanceOf_arr = si_rF_obj.globalDynamicData.specificInstanceOf;
            siIPNS = si_rF_obj.metaData.ipns;
        }
    }

    var numSi_SubsetOf = si_specificInstanceOf_arr.length;
    if (numSi_SubsetOf==0) {
        si_specificInstanceOf_arr.push(jQuery("#newConceptPlural").val())
        numSi_SubsetOf = 1;
    }

    // newSpecificInstances_arr[siNum] = {};
    console.log("newSpecificInstances_arr[siNum] = {}; siNum: "+siNum)
    var linkToNum = 0;
    var newItemHTML = "";
    newItemHTML += "<div id='newSpecificInstanceContainer_"+siNum+"' class=newItemContainer >";
        newItemHTML += "<div style=display:inline-block;position:absolute;right:10px;top:5px; ><input type=checkbox id='newSpecificInstanceDelete_"+siNum+"' /> delete</div>";
        newItemHTML += "SpecificInstance: ";
        newItemHTML += "Load existing wordType (see selector, above) into fields: ";
        newItemHTML += "<div class=doSomethingButton data-sinum="+siNum+" id=loadSiFieldsFromWordTypeSelector_"+siNum+" >load</div>";
        newItemHTML += "<br>";
        newItemHTML += "slug: <textarea id=siSlug_"+siNum+" value='"+siSlug+"' style=width:800px;>"+siSlug+"</textarea><br>";
        newItemHTML += "title: <textarea id=siTitle_"+siNum+" value='"+siTitle+"' style=width:800px;>"+siTitle+"</textarea><br>";
        newItemHTML += "description: <textarea id=siDescription_"+siNum+" value='"+siDescription+"' style=width:800px;height:60px; >"+siDescription+"</textarea><br>";

        newItemHTML += "<div id=siLinksToContainer_"+siNum+" >";
            newItemHTML += "selectors go here<br>";
        newItemHTML += "</div >";

        newItemHTML += "<div class=doSomethingButton data-sinum="+siNum+" data-linktonum="+numSi_SubsetOf+" id=addAnotherSiLinksToButton_"+siNum+" >+</div><br>";
        newItemHTML += "<div >";
            newItemHTML += "<div style=display:inline-block;background-color:white;>";
                newItemHTML += "keyname:<br>";
                newItemHTML += "<input class=ki type=text id=keyname_si_"+siNum+" ><br>";
            newItemHTML += "</div>";
            newItemHTML += "<div style=display:inline-block;background-color:white;>";
                newItemHTML += "IPNS:<br>";
                newItemHTML += "<input class=ki type=text id=ipns_si_"+siNum+" value='"+siIPNS+"' ><br>";
            newItemHTML += "</div>";
            newItemHTML += "<div class=doSomethingButton data-sinum="+siNum+" id=createNewSpecificInstanceKeynameButton_"+siNum+" >Create keyname</div>";
            newItemHTML += "<div class=doSomethingButton data-sinum="+siNum+" id=createNewSpecificInstanceIpnsButton_"+siNum+" >Create ipns</div>";
        newItemHTML += "</div >";
    newItemHTML += "</div>";
    jQuery("#addSpecificInstancesContainer").append(newItemHTML);
    jQuery("#loadSiFieldsFromWordTypeSelector_"+siNum).click(function(){
        var si_num = jQuery(this).data("sinum");
        var si_slug = jQuery("#existingWordTypeAsSpecificInstanceSelector option:selected").val();
        var si_ipns = jQuery("#existingWordTypeAsSpecificInstanceSelector option:selected").data("ipns");
        var si_rF_org = lookupRawFileBySlug_obj[si_slug];
        var si_title = si_rF_org.wordData.title;
        var si_description = si_rF_org.wordData.description;
        // console.log("loadSiFieldsFromWordTypeSelector_ clicked; si_num: "+si_num+"; si_slug: "+si_slug+"; si_ipns: "+si_ipns+"; si_title: "+si_title)
        jQuery("#siSlug_"+si_num).html(si_slug)
        jQuery("#siSlug_"+si_num).val(si_slug)
        jQuery("#siTitle_"+si_num).html(si_title)
        jQuery("#siTitle_"+si_num).val(si_title)
        jQuery("#ipns_si_"+si_num).html(si_ipns)
        jQuery("#ipns_si_"+si_num).val(si_ipns)
        jQuery("#siDescription_"+si_num).html(si_description)
        jQuery("#siDescription_"+si_num).val(si_description)
    });
    jQuery("#newSpecificInstanceContainer_"+siNum).change(function(){
        var currID = this.id;
        // console.log("currID: "+currID)
        recalculateNewSpecificInstancesArray();
    });

    jQuery("#addAnotherSiLinksToButton_"+siNum).click(function(){
        var clickedSiNum = jQuery("#addAnotherSiLinksToButton_"+siNum).data("sinum");
        var clickedLinkToNum = jQuery("#addAnotherSiLinksToButton_"+siNum).data("linktonum");
        addLinksToSiSelectorElement(clickedSiNum,clickedLinkToNum,selCon_sets_arr,si_specificInstanceOf_arr);
        // console.log("addAnotherSiLinksToButton_ clicked; clickedSiNum: "+clickedSiNum+"; clickedLinkToNum: "+clickedLinkToNum);
    });

    // console.log("selCon_specificInstances_arr: "+JSON.stringify(selCon_specificInstances_arr))
    for (var n=0;n<numSi_SubsetOf;n++) {
        addLinksToSiSelectorElement(siNum,n,selCon_sets_arr,si_specificInstanceOf_arr);
    }
    jQuery("#createNewSpecificInstanceKeynameButton_"+siNum).click(function(){
        var sN = jQuery(this).attr("data-sinum")
        // console.log("createNewSpecificInstanceKeynameButton_"+sN)
        var currentTime = Date.now();
        var newSlug = jQuery("#siSlug_"+sN).val()
        var newKeyname_word = "dictionaryWord_"+newSlug+"_"+currentTime;
        jQuery("#keyname_si_"+sN).val(newKeyname_word)
    });
    jQuery("#createNewSpecificInstanceIpnsButton_"+siNum).click(function(){
        var sN = jQuery(this).attr("data-sinum")
        // console.log("createNewSpecificInstanceIpnsButton_"+sN)
        var newKeyname_word = jQuery("#keyname_si_"+sN).val()
        generateNewKey_cnwPage(newKeyname_word,"ipns_si_"+sN);
    });

}
// var lookupSetNumBySlug = {};
function addNextSetHTML(setNum,setSlug) {
    numLinksThisSet[setNum]=0;
    var setTitle = "";
    var setDescription = "";
    var setIPNS = "";
    var set_subsetOf_arr = [];
    // var selectedConcept_wT_slug = jQuery("#compactConceptSummarySelector option:selected").val();
    var selectedConcept_wT_slug = jQuery("#compactConceptSummarySelector option:selected").data("slug");
    var selectedConcept_wT_rF_obj = lookupRawFileBySlug_obj[selectedConcept_wT_slug];
    var selectedConcept_concept_slug = selectedConcept_wT_rF_obj.wordTypeData.concept;
    var selCon_concept_rF_obj = lookupRawFileBySlug_obj[selectedConcept_concept_slug];
    var selCon_sets_arr = selCon_concept_rF_obj.globalDynamicData.sets;
    // console.log("selCon_concept_rF_obj: "+JSON.stringify(selCon_concept_rF_obj,null,4))
    if (setSlug) {
        // lookupSetNumBySlug[setSlug]=setNum;
        if (lookupRawFileBySlug_obj.hasOwnProperty(setSlug)) {
            var set_rF_obj = lookupRawFileBySlug_obj[setSlug];
            if (set_rF_obj.hasOwnProperty("setData")) {
                setTitle = set_rF_obj.setData.title;
                setDescription = set_rF_obj.setData.description;
            }
            set_subsetOf_arr = set_rF_obj.globalDynamicData.subsetOf;
            setIPNS = set_rF_obj.metaData.ipns;
        }
    }
    var numSet_SubsetOf = set_subsetOf_arr.length;
    if (numSet_SubsetOf==0) {
        set_subsetOf_arr.push(jQuery("#newConceptPlural").val())
        numSet_SubsetOf = 1;
    }

    newSets_arr[setNum] = {};
    var linkToNum = 0;
    var newItemHTML = "";
    newItemHTML += "<div data-setnum="+setNum+" id='newSetContainer_"+setNum+"' class=newItemContainer >";
        newItemHTML += "<div style=display:inline-block;position:absolute;right:10px;top:5px; ><input type=checkbox id='newSetDelete_"+setNum+"' /> delete</div>";
        newItemHTML += "Set number: "+setNum+"<br>";
        newItemHTML += "Load existing superset (see selector, above) into fields: ";
        newItemHTML += "<div class=doSomethingButton data-setnum="+setNum+" id=loadSetFieldsFromSupersetSelector_"+setNum+" >load</div>";
        newItemHTML += "<br>";
        newItemHTML += "slug: <textarea id=setSlug_"+setNum+" value='"+setSlug+"' style=width:800px;>"+setSlug+"</textarea><br>";
        newItemHTML += "title: <textarea id=setTitle_"+setNum+" value='"+setTitle+"' style=width:800px;>"+setTitle+"</textarea><br>";
        newItemHTML += "description: <textarea id=setDescription_"+setNum+" value='"+setDescription+"' style=width:800px;height:60px; >"+setDescription+"</textarea><br>";

        newItemHTML += "<div id=setLinksToContainer_"+setNum+" >";
            newItemHTML += "selectors go here<br>";
        newItemHTML += "</div >";

        newItemHTML += "<div class=doSomethingButton data-setnum="+setNum+" data-linktonum="+numSet_SubsetOf+" id=addAnotherSetLinksToButton_"+setNum+" >+</div><br>";
        newItemHTML += "<div >";
            newItemHTML += "<div style=display:inline-block;background-color:white;>";
                newItemHTML += "keyname:<br>";
                newItemHTML += "<input class=ki type=text id=keyname_set_"+setNum+" ><br>";
            newItemHTML += "</div>";
            newItemHTML += "<div style=display:inline-block;background-color:white;>";
                newItemHTML += "IPNS:<br>";
                newItemHTML += "<input class=ki type=text id=ipns_set_"+setNum+" value='"+setIPNS+"' ><br>";
            newItemHTML += "</div>";
            newItemHTML += "<div class=doSomethingButton data-setnum="+setNum+" id=createNewSetKeynameButton_"+setNum+" >Create keyname</div>";
            newItemHTML += "<div class=doSomethingButton data-setnum="+setNum+" id=createNewSetIpnsButton_"+setNum+" >Create ipns</div>";
        newItemHTML += "</div >";
    newItemHTML += "</div>";
    jQuery("#addSetsContainer").append(newItemHTML);
    jQuery("#loadSetFieldsFromSupersetSelector_"+setNum).click(function(){
        var set_num = jQuery(this).data("setnum");
        var set_slug = jQuery("#existingSupersetAsSetSelector option:selected").val();
        var set_ipns = jQuery("#existingSupersetAsSetSelector option:selected").data("ipns");
        var set_rF_org = lookupRawFileBySlug_obj[set_slug];
        var set_title = set_rF_org.wordData.title;
        var set_description = set_rF_org.wordData.description;
        // console.log("loadSetFieldsFromSupersetSelector_ clicked; set_num: "+set_num+"; set_slug: "+set_slug+"; set_ipns: "+set_ipns+"; set_title: "+set_title)
        jQuery("#setSlug_"+set_num).html(set_slug)
        jQuery("#setSlug_"+set_num).val(set_slug)
        jQuery("#setTitle_"+set_num).html(set_title)
        jQuery("#setTitle_"+set_num).val(set_title)
        jQuery("#ipns_set_"+set_num).html(set_ipns)
        jQuery("#ipns_set_"+set_num).val(set_ipns)
        jQuery("#setDescription_"+set_num).html(set_description)
        jQuery("#setDescription_"+set_num).val(set_description)
    });
    jQuery("#newSetContainer_"+setNum).change(function(){
        var currID = this.id;
        /*
        var thisSetNum = jQuery(this).data("setnum");
        var thisSetSlug = jQuery("#setSlug_"+thisSetNum).val();
        if (thisSetSlug) {
            lookupSetNumBySlug[thisSetSlug]=thisSetNum;
        }
        */
        // console.log("currID: "+currID)
        recalculateNewSetsArray();
    });
    jQuery("#addAnotherSetLinksToButton_"+setNum).click(function(){
        var clickedSetNum = jQuery("#addAnotherSetLinksToButton_"+setNum).data("setnum");
        var clickedLinkToNum = jQuery("#addAnotherSetLinksToButton_"+setNum).data("linktonum");
        addLinksToSetSelectorElement(clickedSetNum,clickedLinkToNum,selCon_sets_arr,set_subsetOf_arr);
        // console.log("addAnotherSetLinksToButton_ clicked; clickedSetNum: "+clickedSetNum+"; clickedLinkToNum: "+clickedLinkToNum);
    });

    // console.log("selCon_sets_arr: "+JSON.stringify(selCon_sets_arr))
    for (var n=0;n<numSet_SubsetOf;n++) {
        addLinksToSetSelectorElement(setNum,n,selCon_sets_arr,set_subsetOf_arr);
    }

    jQuery("#createNewSetKeynameButton_"+setNum).click(function(){
        var sN = jQuery(this).attr("data-setnum")
        // console.log("createNewSetKeynameButton_"+sN)
        var currentTime = Date.now();
        var newSlug = jQuery("#setSlug_"+sN).val()
        var newKeyname_word = "dictionaryWord_"+newSlug+"_"+currentTime;
        jQuery("#keyname_set_"+sN).val(newKeyname_word)
    });
    jQuery("#createNewSetIpnsButton_"+setNum).click(function(){
        var sN = jQuery(this).attr("data-setnum")
        // console.log("createNewSetIpnsButton_"+sN)
        var newKeyname_word = jQuery("#keyname_set_"+sN).val()
        generateNewKey_cnwPage(newKeyname_word,"ipns_set_"+sN);
    });
}

function removeDuplicatesFromGlobalDynamicData(word_in_obj) {
    var word_out_obj = JSON.parse(JSON.stringify(word_in_obj));
    // word_out_obj.a="b";
    // var word_out_slug = word_out_obj.wordData.slug;
    var word_out_str = JSON.stringify(word_out_obj,null,4);
    // console.log("removeDuplicatesFromGlobalDynamicData; word_out_str: "+word_out_str)
    jQuery.each(word_out_obj.globalDynamicData,function(propKey,propVal_arr){
        // console.log("removeDuplicatesFromGlobalDynamicData; propKey: "+propKey)
        // var fooTest = Array.isArray(propVal_arr);
        // console.log("removeDuplicatesFromGlobalDynamicData; typeof propVal_arr: "+fooTest)
        // because
        if (Array.isArray(propVal_arr)) {
            word_out_obj.globalDynamicData[propKey] = removeDuplicatesFromSimpleArray(word_out_obj.globalDynamicData[propKey])
        }
    });
    // remove duplicates from other places too, not just in globalDynamicData
    // (may want to change where this task is performed)
    if (word_out_obj.hasOwnProperty("propertyData")) {
        if (word_out_obj.propertyData.hasOwnProperty("types")) {
            word_out_obj.propertyData.types = removeDuplicatesFromSimpleArray(word_out_obj.propertyData.types)
        }
    }
    return word_out_obj;
}
export { removeDuplicatesFromGlobalDynamicData }

function removeDuplicatesFromSimpleArray(input_arr) {
    // var output_arr = JSON.parse(JSON.stringify(input_arr));
    var output_arr = [];
    var numEntries = input_arr.length;
    for (var a=0;a<numEntries;a++) {
        var nextEntry = input_arr[a];
        if (jQuery.inArray(nextEntry,output_arr) == -1) {
            output_arr.push(nextEntry);
        }
        // output_arr.push(nextEntry);
    }

    return output_arr;
}
export { removeDuplicatesFromSimpleArray }

function changeStandardRelsSelectorBox(newValue) {
    // console.log("changeStandardRelsSelectorBox")
    var elem1_arr = document.querySelectorAll("#standardRelWord1Sel option");
    var numElem1 = elem1_arr.length;
    var elem2_arr = document.querySelectorAll("#standardRelWord2Sel option");
    var numElem2 = elem2_arr.length;
    // console.log("numElem1: "+numElem1)
    if (newValue==0) {
        // console.log("change to subsetOf values");
        jQuery("#standardRelWord1Sel_prefix").html("the set of all")
        jQuery("#standardRelSelector_prefix").html("is a")
        jQuery("#standardRelWord2Sel_prefix").html("the set of all")
        // word1: superset
        for (var e=0;e<numElem1;e++) {
            var nextElem1 = elem1_arr[e];
            var nextElem1_newWord_slug = jQuery(nextElem1).data("thisconceptsupersetslug")
            jQuery(nextElem1).html(nextElem1_newWord_slug);
        }
        // word2: superset
        for (var e=0;e<numElem2;e++) {
            var nextElem2 = elem2_arr[e];
            var nextElem2_newWord_slug = jQuery(nextElem2).data("thisconceptsupersetslug")
            jQuery(nextElem2).html(nextElem2_newWord_slug);
        }
    }
    if (newValue==1) {
        // console.log("change to isASpecificInstanceOf values");
        jQuery("#standardRelWord1Sel_prefix").html("the abstract concept of a(n)")
        jQuery("#standardRelSelector_prefix").html("")
        jQuery("#standardRelWord2Sel_prefix").html("the set of all")
        // word1: wordType
        for (var e=0;e<numElem1;e++) {
            var nextElem1 = elem1_arr[e];
            var nextElem1_newWord_slug = jQuery(nextElem1).data("thisconceptwordtypeslug")
            jQuery(nextElem1).html(nextElem1_newWord_slug);
        }
        // word2: superset
        for (var e=0;e<numElem2;e++) {
            var nextElem2 = elem2_arr[e];
            var nextElem2_newWord_slug = jQuery(nextElem2).data("thisconceptsupersetslug")
            jQuery(nextElem2).html(nextElem2_newWord_slug);
        }
    }
    if (newValue==2) {
        // console.log("change to isASpecificInstanceOf values");
        jQuery("#standardRelWord1Sel_prefix").html("subsets or sI's of")
        jQuery("#standardRelSelector_prefix").html("")
        jQuery("#standardRelWord2Sel_prefix").html("a definition used within")
        // word1: superset (?)
        for (var e=0;e<numElem1;e++) {
            var nextElem1 = elem1_arr[e];
            var nextElem1_newWord_slug = jQuery(nextElem1).data("thisconceptsupersetslug")
            jQuery(nextElem1).html(nextElem1_newWord_slug);
        }
        // word2: JSONSchema
        for (var e=0;e<numElem2;e++) {
            var nextElem2 = elem2_arr[e];
            var nextElem2_newWord_slug = jQuery(nextElem2).data("thisconceptjsonschemaslug")
            jQuery(nextElem2).html(nextElem2_newWord_slug);
        }
    }
}

function setPropertyType1Checkboxes() {
    jQuery("#editConceptField_name_B").prop("checked",false);
    jQuery("#editConceptField_title_B").prop("checked",false);
    jQuery("#editConceptField_slug_B").prop("checked",false);
    jQuery("#editConceptField_alias_B").prop("checked",false);
    var js_rF_old_str = jQuery("#JSONSchema_rawFile_parent_B_old").html();
    var js_rF_old_obj = JSON.parse(js_rF_old_str);
    var mainPropertyPath = js_rF_old_obj.required[0];
    if (mainPropertyPath == undefined) {
        var js_rF_str = jQuery("#JSONSchema_rawFile_parent_B").html();
        var js_rF_obj = JSON.parse(js_rF_str);
        var mainPropertyPath = js_rF_obj.required[0];
    }
    // console.log("setPropertyType1Checkboxes; mainPropertyPath: "+mainPropertyPath);
    if (mainPropertyPath != undefined) {
        var oldProps_obj = js_rF_old_obj.properties[mainPropertyPath].properties;
        jQuery.each(oldProps_obj,function(nextProperty,nextPropInfo_obj){
            // console.log("nextProperty: "+nextProperty)
            if (nextProperty=="name") {
                jQuery("#editConceptField_name_B").prop("checked",true);
            }
            if (nextProperty=="title") {
                jQuery("#editConceptField_title_B").prop("checked",true);
            }
            if (nextProperty=="slug") {
                jQuery("#editConceptField_slug_B").prop("checked",true);
            }
            if (nextProperty=="alias") {
                jQuery("#editConceptField_alias_B").prop("checked",true);
            }
        });
    }
    calculateFamilyUnit_B();
}

function resetPropertyDataAllProperties() {
    // console.log("resetPropertyDataAllProperties")
    var propertyTreeSchemaSlug = jQuery("#propertyTreeSchemaSlug").data("slug");
    // console.log("resetPropertyDataAllProperties; propertyTreeSchemaSlug: "+propertyTreeSchemaSlug)
    var propertyTreeSchema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[propertyTreeSchemaSlug]));
    var propertyTreeSchema_nodes_arr = propertyTreeSchema_rF_obj.schemaData.nodes;
    var numNodes = propertyTreeSchema_nodes_arr.length;
    for (var n=0;n<numNodes;n++) {
        var nextNode_slug = propertyTreeSchema_nodes_arr[n].slug;
        var nextNode_ipns = propertyTreeSchema_nodes_arr[n].ipns;
        var nextNode_rF_obj = lookupRawFileBySlug_obj.edited[nextNode_slug];
        var nextNode_title = nextNode_rF_obj.wordData.title;
        var nextNode_description = nextNode_rF_obj.wordData.description;
        var nextNode_rF_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;
        if (jQuery.inArray("property",nextNode_rF_wordTypes_arr) > -1) {
            // console.log("resetPropertyDataAllProperties; nextNode_slug: "+nextNode_slug);
            nextNode_rF_obj.propertyData = {};
            nextNode_rF_obj.propertyData.slug = nextNode_slug;
            nextNode_rF_obj.propertyData.title = nextNode_title;
            nextNode_rF_obj.propertyData.description = nextNode_description;
            nextNode_rF_obj.propertyData.type = "";
            nextNode_rF_obj.propertyData.types = [];
            nextNode_rF_obj.propertyData.conceptGraphStyle = {};
            // nextNode_rF_obj.propertyData.conceptGraphStyle.type = null;
            nextNode_rF_obj.propertyData.conceptGraphStyle.props = [];
            nextNode_rF_obj.propertyData.conceptGraphStyle.properties = [];
            nextNode_rF_obj.propertyData.conceptGraphStyle.required = [];
            nextNode_rF_obj.propertyData.JSONSchemaStyle = {};
            nextNode_rF_obj.propertyData.JSONSchemaStyle.key = null;
            nextNode_rF_obj.propertyData.JSONSchemaStyle.value = {};
            nextNode_rF_obj.propertyData.metaData = {};
            nextNode_rF_obj.propertyData.metaData.parentConcepts = [];
            MiscFunctions.updateWordInAllTables(nextNode_rF_obj);
        }
    }
}

function clearPropConceptGraphStyle() {
    var propertyTreeSchemaSlug = jQuery("#propertyTreeSchemaSlug").data("slug");
    var propertyTreeSchema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[propertyTreeSchemaSlug]));
    var propertyTreeSchema_nodes_arr = propertyTreeSchema_rF_obj.schemaData.nodes;
    var numNodes = propertyTreeSchema_nodes_arr.length;
    for (var n=0;n<numNodes;n++) {
        var nextNode_slug = propertyTreeSchema_nodes_arr[n].slug;
        var nextNode_ipns = propertyTreeSchema_nodes_arr[n].ipns;
        var nextNode_rF_obj = lookupRawFileBySlug_obj.edited[nextNode_slug];
        var nextNode_rF_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;
        if (jQuery.inArray("property",nextNode_rF_wordTypes_arr) > -1) {
            // console.log("clearPropConceptGraphStyle; nextNode_slug: "+nextNode_slug);
            nextNode_rF_obj.propertyData.conceptGraphStyle = {};
            MiscFunctions.updateWordInAllTables(nextNode_rF_obj);
        }
    }
}

function addEntryToProperties(properties_arr,newEntry_obj) {
    var newEntry_key = newEntry_obj.key;
    var newEntry_value = newEntry_obj.value;
    var properties_out_arr = properties_arr;
    var numCurrentEntries = properties_out_arr.length;
    var entryAlreadyPresent = false;
    for (var e=0;e<numCurrentEntries;e++) {
        var nextCurrentEntry_obj = properties_out_arr[e];
        var nextCurrentEntry_key = nextCurrentEntry_obj.key;
        var nextCurrentEntry_value = nextCurrentEntry_obj.value;
        if ( (nextCurrentEntry_key==newEntry_key) && (nextCurrentEntry_value==newEntry_value) ) {
            entryAlreadyPresent = true;
        }
    }
    if (!entryAlreadyPresent) {
        properties_out_arr.push(newEntry_obj);
    }
    return properties_out_arr;
}

function calculatePropConceptGraphStyle_processOneRel(nextRel_obj) {
    var nextRel_nF_slug = nextRel_obj.nodeFrom.slug;
    var nextRel_rT_slug = nextRel_obj.relationshipType.slug;
    var nextRel_nT_slug = nextRel_obj.nodeTo.slug;
    // console.log("nextRel_rT_slug: "+nextRel_rT_slug);

    var nextRel_nF_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[nextRel_nF_slug]));
    var nextRel_nT_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[nextRel_nT_slug]));

    var nF_cgs_obj = {}
    var nT_cgs_obj = {}
    var nF_cgs_props_arr = []
    var nT_cgs_props_arr = []

    if (nextRel_nF_rF_obj.hasOwnProperty("propertyData")) {
        nF_cgs_obj = JSON.parse(JSON.stringify(nextRel_nF_rF_obj.propertyData.conceptGraphStyle));
        nF_cgs_props_arr = [];
        if (nextRel_nF_rF_obj.propertyData.conceptGraphStyle.hasOwnProperty("props")) {
            nF_cgs_props_arr = JSON.parse(JSON.stringify(nextRel_nF_rF_obj.propertyData.conceptGraphStyle.props));
        }
    }

    if (nextRel_nT_rF_obj.hasOwnProperty("propertyData")) {
        nT_cgs_obj = JSON.parse(JSON.stringify(nextRel_nT_rF_obj.propertyData.conceptGraphStyle));
        nT_cgs_props_arr = [];
        if (nextRel_nT_rF_obj.propertyData.conceptGraphStyle.hasOwnProperty("props")) {
            nT_cgs_props_arr = JSON.parse(JSON.stringify(nextRel_nT_rF_obj.propertyData.conceptGraphStyle.props));
        }
    }

    var nextRel_rT_propertyField = "";
    var nextRel_rT_key = nextRel_rT_slug+"Data";
    if (nextRel_obj.relationshipType.hasOwnProperty(nextRel_rT_key)) {
        nextRel_rT_propertyField = nextRel_obj.relationshipType[nextRel_rT_key].field;
        // console.log("calculatePropConceptGraphStyle; adding field YES; nextRel_rT_key: "+nextRel_rT_key+"; nextRel_rT_propertyField: "+nextRel_rT_propertyField)
    } else {
        // console.log("calculatePropConceptGraphStyle; adding field NO; nextRel_rT_key: "+nextRel_rT_key+"; nextRel_rT_propertyField: "+nextRel_rT_propertyField)
    }

    if (nextRel_rT_slug=="addPropertyKey") {
        var rTData = nextRel_rT_slug+"Data";
        var nextRel_rT_field = nextRel_obj.relationshipType[rTData].field;
        // nextRel_nT_rF_obj.propertyData.conceptGraphStyle = {};
        if (nextRel_nT_rF_obj.hasOwnProperty("propertyData")) {
            var propToAdd_obj = {};
            propToAdd_obj.key = nextRel_rT_field;
            propToAdd_obj.value = null;
            var propToAdd_str = JSON.stringify(propToAdd_obj,null,4);
            // console.log("propToAdd_str: "+propToAdd_str);
            nextRel_nT_rF_obj.propertyData.conceptGraphStyle.props = addEntryToProperties(nextRel_nT_rF_obj.propertyData.conceptGraphStyle.props,propToAdd_obj);
            // ? need to update nT_cgs_props_arr before continuing ?
            nT_cgs_obj = JSON.parse(JSON.stringify(nextRel_nT_rF_obj.propertyData.conceptGraphStyle));
            nT_cgs_props_arr = JSON.parse(JSON.stringify(nextRel_nT_rF_obj.propertyData.conceptGraphStyle.props));
            // nextRel_nT_rF_obj.propertyData.conceptGraphStyle.props.push(propToAdd_obj);
            // nextRel_nT_rF_obj.propertyData.conceptGraphStyle[nextRel_rT_field] = "__NULL__";
            // nextRel_nT_rF_obj.propertyData.JSONSchemaStyle[nextRel_rT_field] = null;
        }
        nextRel_nT_rF_obj.propertyData.type = "hasKey";
        if (jQuery.inArray("hasKey",nextRel_nT_rF_obj.propertyData.types) == -1) {
            nextRel_nT_rF_obj.propertyData.types.push("hasKey");
        }
        MiscFunctions.updateWordInAllTables(nextRel_nT_rF_obj);
        lookupRawFileBySlug_obj.edited[nextRel_nT_slug] = JSON.parse(JSON.stringify(nextRel_nT_rF_obj));
    }

    if (nextRel_rT_slug=="addPropertyValue") {
        var rTData = nextRel_rT_slug+"Data";
        var nextRel_rT_field = nextRel_obj.relationshipType[rTData].field;

        // going to deprecate this step in favor of replacement step below
        jQuery.each(nF_cgs_obj,function(propKey,propVal) {
            if (propVal=="__NULL__") {
                if (nextRel_rT_field=="__isEmptyArray__") {
                    nF_cgs_obj[propKey] = [];
                } else {
                    nF_cgs_obj[propKey] = nextRel_rT_field;
                }

            }
        });
        // replacement step:
        var propToMerge_obj = {};
        var numProps = nF_cgs_props_arr.length;
        for (var p=0;p<numProps;p++) {
            var nextProp_obj = nF_cgs_props_arr[p];
            var nextProp_key = nextProp_obj.key;
            if (nextProp_obj.value == null) {
                propToMerge_obj.key = nextProp_key;
                propToMerge_obj.value = nextRel_rT_field;
            }
        }
        var propToMerge_str = JSON.stringify(propToMerge_obj,null,4);
        // if (nextProp_key=="name") { console.log("QWERTY A propToMerge_str: "+propToMerge_str) }

        var nextRel_nT_rF_str = JSON.stringify(nextRel_nT_rF_obj,null,4);
        // if (nextProp_key=="name") { console.log("QWERTY B propToMerge_str; nextRel_nT_rF_str: "+nextRel_nT_rF_str) }

        nextRel_nT_rF_obj.propertyData.conceptGraphStyle.props = addEntryToProperties(nextRel_nT_rF_obj.propertyData.conceptGraphStyle.props,propToMerge_obj)

        var nextRel_nT_rF_str = JSON.stringify(nextRel_nT_rF_obj,null,4);
        // if (nextProp_key=="name") { console.log("QWERTY E propToMerge_str; nextRel_nT_rF_str: "+nextRel_nT_rF_str) }

        nT_cgs_obj = JSON.parse(JSON.stringify(nextRel_nT_rF_obj.propertyData.conceptGraphStyle));
        nT_cgs_props_arr = JSON.parse(JSON.stringify(nextRel_nT_rF_obj.propertyData.conceptGraphStyle.props));
        nextRel_nT_rF_obj.propertyData.type = "type0";
        if (jQuery.inArray("type0",nextRel_nT_rF_obj.propertyData.types) == -1) {
            nextRel_nT_rF_obj.propertyData.types.push("type0");
        }
        MiscFunctions.updateWordInAllTables(nextRel_nT_rF_obj);
        lookupRawFileBySlug_obj.edited[nextRel_nT_slug] = JSON.parse(JSON.stringify(nextRel_nT_rF_obj));
        nT_cgs_obj = JSON.parse(JSON.stringify(nextRel_nT_rF_obj.propertyData.conceptGraphStyle));
        nT_cgs_props_arr = JSON.parse(JSON.stringify(nextRel_nT_rF_obj.propertyData.conceptGraphStyle.props));
    }

    if (nextRel_rT_slug=="propagateProperty") {
        if (nextRel_nT_rF_obj.hasOwnProperty("propertyData")) {
            nextRel_nT_rF_obj.propertyData.conceptGraphStyle.props = jQuery.extend([], nF_cgs_props_arr, nT_cgs_props_arr);
            nT_cgs_props_arr = JSON.parse(JSON.stringify(nextRel_nT_rF_obj.propertyData.conceptGraphStyle.props));
            nT_cgs_obj = JSON.parse(JSON.stringify(nextRel_nT_rF_obj.propertyData.conceptGraphStyle));
            nextRel_nT_rF_obj.propertyData.type = "type1";
            if (jQuery.inArray("type1",nextRel_nT_rF_obj.propertyData.types) == -1) {
                nextRel_nT_rF_obj.propertyData.types.push("type1");
            }
            MiscFunctions.updateWordInAllTables(nextRel_nT_rF_obj);
            lookupRawFileBySlug_obj.edited[nextRel_nT_slug] = JSON.parse(JSON.stringify(nextRel_nT_rF_obj));
        }
    }

    if (nextRel_rT_slug=="addToConceptGraphProperties") {
        // console.log("addToConceptGraphProperties; nextRel_nT_slug: "+nextRel_nT_slug+"; nextRel_nF_slug: "+nextRel_nF_slug)
        if (jQuery.inArray(nextRel_nF_slug,nextRel_nT_rF_obj.propertyData.conceptGraphStyle.properties) == -1) {
            var nextRel_x_obj = {};
            nextRel_x_obj.key = nextRel_rT_propertyField;
            nextRel_x_obj.slug = nextRel_nF_slug;
            nextRel_nT_rF_obj.propertyData.conceptGraphStyle.properties = addEntryToProperties(nextRel_nT_rF_obj.propertyData.conceptGraphStyle.properties,nextRel_x_obj);
            // NEED_TO_DO: add a field under addToConceptGraphPropertiesData, required: true or false
            // do this step only if true
            if (jQuery.inArray(nextRel_rT_propertyField,nextRel_nT_rF_obj.propertyData.conceptGraphStyle.required) == -1) {
                nextRel_nT_rF_obj.propertyData.conceptGraphStyle.required.push(nextRel_rT_propertyField);
            }
            // console.log("addToConceptGraphProperties; pushing nextRel_nF_slug: "+nextRel_nF_slug+" into nextRel_nT_slug: "+nextRel_nT_slug)
        }
        nextRel_nT_rF_obj.propertyData.type = "type3";
        if (jQuery.inArray("type3",nextRel_nT_rF_obj.propertyData.types) == -1) {
            nextRel_nT_rF_obj.propertyData.types.push("type3");
        }
        MiscFunctions.updateWordInAllTables(nextRel_nT_rF_obj);
        lookupRawFileBySlug_obj.edited[nextRel_nT_slug] = JSON.parse(JSON.stringify(nextRel_nT_rF_obj));
    }

    if (nextRel_nT_rF_obj.hasOwnProperty("setData")) {
        if (!nextRel_nT_rF_obj.setData.hasOwnProperty("propagatePropertyInputs")) {
            nextRel_nT_rF_obj.setData.propagatePropertyInputs = [];
        }

        if (nextRel_rT_slug=="isASpecificInstanceOf") {
            var assignedPropertyType = "";
            if (nextRel_nT_slug=="properties_hasKey") { assignedPropertyType = "hasKey"; }
            if (nextRel_nT_slug=="properties_type0") { assignedPropertyType = "type0"; }
            if (nextRel_nT_slug=="properties_type1") { assignedPropertyType = "type1"; }
            if (nextRel_nT_slug=="properties_type2") { assignedPropertyType = "type2"; }
            if (nextRel_nT_slug=="properties_type3") { assignedPropertyType = "type3"; }
            if (nextRel_nF_rF_obj.hasOwnProperty("propertyData")) {
                // nextRel_nF_rF_obj.propertyData.type = assignedPropertyType;
                if (jQuery.inArray(assignedPropertyType,nextRel_nF_rF_obj.propertyData.types) == -1) {
                    nextRel_nF_rF_obj.propertyData.types.push(assignedPropertyType);
                    MiscFunctions.updateWordInAllTables(nextRel_nF_rF_obj);
                    lookupRawFileBySlug_obj.edited[nextRel_nF_slug] = JSON.parse(JSON.stringify(nextRel_nF_rF_obj));
                }
            }
            var numElements = nextRel_nT_rF_obj.setData.propagatePropertyInputs.length;
            // if (nextRel_nF_slug=="property_qbnufu") { console.log("QWERTY 0: nodeTo hasOwnProperty: setData; isASpecificInstanceOf; nextRel_nT_slug: "+nextRel_nT_slug+"; numElements: "+numElements) }
            for (var e=0;e<numElements;e++) {
                var nextElem_slug = nextRel_nT_rF_obj.setData.propagatePropertyInputs[e];
                // if (nextRel_nF_slug=="property_qbnufu") { console.log("QWERTY 1: "+e+"; nextElem_slug: "+nextElem_slug); }
                var nextElem_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[nextElem_slug]));
                var nextElem_rF_str = JSON.stringify(nextElem_rF_obj,null,4);
                // if (nextRel_nF_slug=="property_qbnufu") { console.log("QWERTY 2: "+e+"; nextElem_slug: "+nextElem_slug+"; nextElem_rF_str: "+nextElem_rF_str); }
                var nextElem_cgs_props_arr = JSON.parse(JSON.stringify(nextElem_rF_obj.propertyData.conceptGraphStyle.props));
                if (nextRel_nF_rF_obj.hasOwnProperty("propertyData")) {
                    // if (nextRel_nF_slug=="property_qbnufu") { console.log("QWERTY 3: "+e+"; "+nextRel_nF_slug+" hasOwnProperty propertyData yes"); }
                    // iterate through each element in source array and add it to target array if not already present
                    // target array: nextRel_nF_rF_obj.propertyData.conceptGraphStyle.props
                    // source array: nextElem_cgs_props_arr
                    // each is an array of objects with format: { key: foo, value: foo }
                    var numProps = nextElem_cgs_props_arr.length;
                    for (var z=0; z< numProps; z++) {
                        var nextProp_obj = nextElem_cgs_props_arr[z];
                        nextRel_nF_rF_obj.propertyData.conceptGraphStyle.props = addEntryToProperties(nextRel_nF_rF_obj.propertyData.conceptGraphStyle.props,nextProp_obj)
                    }
                    /*
                    var propType = "";
                    if (nextRel_nT_slug=="properties_hasKey") { propType="hasKey"; }
                    if (nextRel_nT_slug=="properties_type0") { propType="type0"; }
                    if (nextRel_nT_slug=="properties_type1") { propType="type1"; }
                    if (nextRel_nT_slug=="properties_type2") { propType="type2"; }
                    if (nextRel_nT_slug=="properties_type3") { propType="type3"; }

                    if (propType) {
                        console.log("ADDING PROPTYPE")
                        nextRel_nF_rF_obj.propertyData.type = propType;
                        if (jQuery.inArray(propType,nextRel_nF_rF_obj.propertyData.types) == -1) {
                            nextRel_nF_rF_obj.propertyData.types.push(propType);
                        }
                    }
                    */
                    // nextRel_nF_rF_obj.propertyData.conceptGraphStyle.props = jQuery.extend([], nextElem_cgs_props_arr, nextRel_nF_rF_obj.propertyData.conceptGraphStyle.props);
                    MiscFunctions.updateWordInAllTables(nextRel_nF_rF_obj);
                    lookupRawFileBySlug_obj.edited[nextRel_nF_slug] = JSON.parse(JSON.stringify(nextRel_nF_rF_obj));
                }
            }
        }

        // if (nextRel_nF_slug=="property_qbnufu") { console.log("QWERTY "); }

        if (nextRel_rT_slug=="propagateProperty") {
            if (jQuery.inArray(nextRel_nF_slug,nextRel_nT_rF_obj.setData.propagatePropertyInputs) == -1) {
                nextRel_nT_rF_obj.setData.propagatePropertyInputs.push(nextRel_nF_slug);
            }
            MiscFunctions.updateWordInAllTables(nextRel_nT_rF_obj);
            lookupRawFileBySlug_obj.edited[nextRel_nT_slug] = JSON.parse(JSON.stringify(nextRel_nT_rF_obj));
            // nT_cgs_props_arr = JSON.parse(JSON.stringify(nextRel_nT_rF_obj.propertyData.conceptGraphStyle.props));
            // nT_cgs_obj = JSON.parse(JSON.stringify(nextRel_nT_rF_obj.propertyData.conceptGraphStyle));
        }
        if (nextRel_rT_slug=="subsetOf") {
            // transfer all elements from nextRel_nT_rF_obj.setData.propagatePropertyInputs to nextRel_nT_rF_obj.setData.propagatePropertyInputs
            var numElements = nextRel_nT_rF_obj.setData.propagatePropertyInputs.length;
            for (var e=0;e<numElements;e++) {
                var nextElem_slug = nextRel_nT_rF_obj.setData.propagatePropertyInputs[e];
                // NEED_TO_DO: do the transfer from array to array
            }
        }

    }
}
function calculatePropConceptGraphStyle() {
    var propertyTreeSchemaSlug = jQuery("#propertyTreeSchemaSlug").data("slug");
    var propertyTreeSchema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[propertyTreeSchemaSlug]));
    var propertyTreeSchema_rels_arr = propertyTreeSchema_rF_obj.schemaData.relationships;
    var numRels = propertyTreeSchema_rels_arr.length;
    // console.log("QWERTY calculatePropConceptGraphStyle; propertyTreeSchemaSlug: "+propertyTreeSchemaSlug+"; numRels: "+numRels)
    for (var rr=0;rr<numRels;rr++) {
        var nextRel_obj = propertyTreeSchema_rels_arr[rr];
        calculatePropConceptGraphStyle_processOneRel(nextRel_obj);
    }

    // set type to the highest type in types array
    var propertyTreeSchema_nodes_arr = propertyTreeSchema_rF_obj.schemaData.nodes;
    var numNodes = propertyTreeSchema_nodes_arr.length;
    // console.log("QWERTY numNodes: "+numNodes)
    for (var n=0;n<numNodes;n++) {
        // console.log("QWERTY node: "+n)
        var nextNode_slug = propertyTreeSchema_nodes_arr[n].slug;
        var nextNode_ipns = propertyTreeSchema_nodes_arr[n].ipns;
        var nextNode_rF_obj = lookupRawFileBySlug_obj.edited[nextNode_slug];
        var nextNode_rF_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;
        if (jQuery.inArray("property",nextNode_rF_wordTypes_arr) > -1) {
            // console.log("QWERTY property node: "+nextNode_slug)
            var nextNode_types_arr = nextNode_rF_obj.propertyData.types;
            if (jQuery.inArray("hasKey",nextNode_types_arr) > -1) {
                nextNode_rF_obj.propertyData.type = "hasKey";
                // console.log(" !!! updated property type; nextNode_slug: "+nextNode_slug+"; new type: "+nextNode_rF_obj.propertyData.type)
            }
            if (jQuery.inArray("type0",nextNode_types_arr) > -1) {
                nextNode_rF_obj.propertyData.type = "type0";
                // console.log(" !!! updated property type; nextNode_slug: "+nextNode_slug+"; new type: "+nextNode_rF_obj.propertyData.type)
            }
            if (jQuery.inArray("type1",nextNode_types_arr) > -1) {
                nextNode_rF_obj.propertyData.type = "type1";
                // console.log(" !!! updated property type; nextNode_slug: "+nextNode_slug+"; new type: "+nextNode_rF_obj.propertyData.type)
            }
            if (jQuery.inArray("type2",nextNode_types_arr) > -1) {
                nextNode_rF_obj.propertyData.type = "type2";
                // console.log(" !!! updated property type; nextNode_slug: "+nextNode_slug+"; new type: "+nextNode_rF_obj.propertyData.type)
            }
            if (jQuery.inArray("type3",nextNode_types_arr) > -1) {
                nextNode_rF_obj.propertyData.type = "type3";
                // console.log(" !!! updated property type; nextNode_slug: "+nextNode_slug+"; new type: "+nextNode_rF_obj.propertyData.type)
            }
            // console.log("QWERTY updated property type; nextNode_slug: "+nextNode_slug+"; new type: "+nextNode_rF_obj.propertyData.type)
            MiscFunctions.updateWordInAllTables(nextNode_rF_obj);
            lookupRawFileBySlug_obj.edited[nextNode_slug] = JSON.parse(JSON.stringify(nextNode_rF_obj));
        }
    }

}

function clearPropJSONSchemaStyle() {
}

function calculatePropJSONSchemaStyle() {
    var propertyTreeSchemaSlug = jQuery("#propertyTreeSchemaSlug").data("slug");
    var propertyTreeSchema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[propertyTreeSchemaSlug]));
    var propertyTreeSchema_nodes_arr = propertyTreeSchema_rF_obj.schemaData.nodes;
    var numNodes = propertyTreeSchema_nodes_arr.length;
    // console.log("calculatePropJSONSchemaStyle; propertyTreeSchemaSlug: "+propertyTreeSchemaSlug+"; numNodes: "+numNodes);
    // cycle through each node; if wordType = property,
    // then translate propertyData.conceptGraphStyle into propertyData.JSONSchemaStyle and update the word_obj
    // in SQL databases and in lookupRawFileBySlug_obj.edited[]
    for (var n=0;n<numNodes;n++) {
        var nextWord_slug = propertyTreeSchema_nodes_arr[n].slug;
        // console.log("nextWord_slug: "+nextWord_slug);
        var nextWord_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[nextWord_slug]));
        var nextWord_wordTypes_arr = nextWord_rF_obj.wordData.wordTypes;
        if (jQuery.inArray("property",nextWord_wordTypes_arr) > -1) {
            var nW_cgs_props_arr = nextWord_rF_obj.propertyData.conceptGraphStyle.props;
            var numProps = nW_cgs_props_arr.length;
            for (var p=0;p<numProps;p++) {
                var nextProp_obj = nW_cgs_props_arr[p];
                nextWord_rF_obj.propertyData.JSONSchemaStyle.value[nextProp_obj.key] = nextProp_obj.value;
                if (nextProp_obj.key=="type") {
                    if (nextProp_obj.value=="object") {
                        nextWord_rF_obj.propertyData.JSONSchemaStyle.value.required = [];
                        nextWord_rF_obj.propertyData.JSONSchemaStyle.value.properties = {};
                    }
                }
            }
            var nW_cgs_obj = nextWord_rF_obj.propertyData.conceptGraphStyle;
            // var nW_jss_obj = nextWord_rF_obj.propertyData.JSONSchemaStyle;
            var nW_cgs_type = nW_cgs_obj.type;
            if (nW_cgs_obj.hasOwnProperty("properties")) {
                var nW_importedProperties_arr = nW_cgs_obj.properties;
                var numImportedProperties = nW_importedProperties_arr.length;
                for (var i=0;i<numImportedProperties;i++) {
                    var nextImportedProperty_key = nW_importedProperties_arr[i].key;
                    var nextImportedProperty_slug = nW_importedProperties_arr[i].slug;
                    nextWord_rF_obj.propertyData.JSONSchemaStyle.value.properties[nextImportedProperty_key] = {};
                    nextWord_rF_obj.propertyData.JSONSchemaStyle.value.properties[nextImportedProperty_key]["$ref"] = "#/dictionary/"+nextImportedProperty_slug;
                    if (jQuery.inArray(nextImportedProperty_key,nW_cgs_obj.required) > -1) {
                        if(jQuery.inArray(nextImportedProperty_key,nextWord_rF_obj.propertyData.JSONSchemaStyle.value.required) == -1) {
                            nextWord_rF_obj.propertyData.JSONSchemaStyle.value.required.push(nextImportedProperty_key);
                        }
                    }
                }
            }
            // }
        }
        var nextWord_rF_str = JSON.stringify(nextWord_rF_obj,null,4)
        // console.log("calculatePropJSONSchemaStyle; nextWord_rF_str: "+nextWord_rF_str)
        MiscFunctions.updateWordInAllTables(nextWord_rF_obj);
        lookupRawFileBySlug_obj.edited[nextWord_rF_obj] = JSON.parse(JSON.stringify(nextWord_rF_obj));
    }
}
async function createNewPropertyRelationship() {
    var propertyFrom_slug = jQuery("#propertyFromSelector option:selected").data("slug")
    var propertyFrom_ipns = jQuery("#propertyFromSelector option:selected").data("ipns")

    var propertyRelType_slug = jQuery("#propertyRelTypeSelector option:selected").data("slug")
    var propRelTypeData = propertyRelType_slug+"Data";
    var propertyRelationshipTypeField = jQuery("#propertyRelationshipTypeField").val()

    var propertyTo_slug = jQuery("#propertyToSelector option:selected").data("slug")
    var propertyTo_ipns = jQuery("#propertyToSelector option:selected").data("ipns")

    var relToAdd_obj = {};
    relToAdd_obj.nodeFrom = {};
    relToAdd_obj.relationshipType = {};
    relToAdd_obj.nodeTo = {};

    relToAdd_obj.nodeFrom.slug = propertyFrom_slug;
    relToAdd_obj.relationshipType.slug = propertyRelType_slug;
    relToAdd_obj.nodeTo.slug = propertyTo_slug;

    relToAdd_obj.relationshipType[propRelTypeData] = {};
    if (propertyRelationshipTypeField) {
        relToAdd_obj.relationshipType[propRelTypeData].field = propertyRelationshipTypeField;
    }


    var relToAdd_str = JSON.stringify(relToAdd_obj,null,4);
    // console.log("relToAdd_str: "+relToAdd_str);

    var schemaForProperty_slug = jQuery("#propertyTreeSchemaSlug").data("slug")
    var schemaForProperty_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[schemaForProperty_slug]));

    // console.log("updateSchemaWithNewRel; schemaForProperty_slug: "+schemaForProperty_slug);
    var schemaForProperty_updated_obj = MiscFunctions.updateSchemaWithNewRel(schemaForProperty_obj,relToAdd_obj,lookupRawFileBySlug_obj)
    MiscFunctions.updateWordInAllTables(schemaForProperty_updated_obj);
    lookupRawFileBySlug_obj[schemaForProperty_slug] = MiscFunctions.cloneObj(schemaForProperty_updated_obj);
    lookupRawFileBySlug_obj.edited[schemaForProperty_slug] = MiscFunctions.cloneObj(schemaForProperty_updated_obj);
}
async function createNewProperty() {
    var propertyTreeSchemaSlug = jQuery("#propertyTreeSchemaSlug").html();
    // console.log("createNewPropertyButton clicked; propertyTreeSchemaSlug: "+propertyTreeSchemaSlug)

    var newProperty_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["property"]));

    var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
    var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
    newProperty_obj.globalDynamicData.myDictionaries.push(myDictionary);
    newProperty_obj.globalDynamicData.myConceptGraphs.push(myConceptGraph);

    var currentTime = Date.now();
    var newKeyname = "dictionaryWord_property_"+currentTime;
    var generatedKey_obj = await ipfs.key.gen(newKeyname, {
        type: 'rsa',
        size: 2048
    })
    var newProperty_ipns = generatedKey_obj["id"];
    var generatedKey_name = generatedKey_obj["name"];
    // console.log("generatedKey_obj id: "+newProperty_ipns+"; name: "+generatedKey_name);
    newProperty_obj.metaData.ipns = newProperty_ipns;

    var newProperty_slug = "property_"+newProperty_ipns.slice(newProperty_ipns.length-6);
    newProperty_obj.wordData.slug = newProperty_slug;
    var newProperty_str = JSON.stringify(newProperty_obj,null,4);

    // console.log("newProperty_str: "+newProperty_str);

    var wordTypes = "word,property";
    insertOrUpdateWordIntoMyDictionary(myDictionary,newProperty_str,newProperty_slug,generatedKey_name,newProperty_ipns)
    insertOrUpdateWordIntoMyConceptGraph(myConceptGraph,myDictionary,newProperty_str,newProperty_slug,generatedKey_name,newProperty_ipns);

    // uncomment this and complete steps if want to add node automatically to propertyTreeSchema_obj
    // var propertyTreeSchema_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[propertyTreeSchemaSlug]));
    // lookupRawFileBySlug_obj.edited[propertyTreeSchemaSlug] = JSON.parse(JSON.stringify(propertyTreeSchema_obj));
    // MiscFunctions.updateWordInAllTables(propertyTreeSchema_obj);
}
/*
function createEnumerationFromSet() {
    console.log("createEnumerationFromSet");
}
*/

// qwerty
function makePropertyTypesInfoBox() {
    var newHTML1 = "";
    var newHTML2 = "";
    jQuery.each(propertyTypes,function(nextPropertyType,obj){
        // console.log("nextPropertyType: "+nextPropertyType+"; obj.applyTo.schemaForProperty: "+obj.applyTo.schemaForProperty)
        if (obj.applyTo.propertySchemas===true) {
            newHTML1 += "<div>";
                newHTML1 += "<div style=width:200px;display:inline-block;>"+nextPropertyType+"</div>";
                newHTML1 += "<input class='ki keynameField' type='text' id='keyname_propertySets_"+nextPropertyType+"' />";
                newHTML1 += "<input class='ki' type='text' id='ipns_propertySets_"+nextPropertyType+"' /><br/>";
            newHTML1 += "</div>";

            newHTML2 += "<div>";
                newHTML2 += "<div class=newWordContainer >";
                    newHTML2 += "<div class=floatRightBox >"+nextPropertyType+"</div>";
                    newHTML2 += "<div id='slugName_propertySets_"+nextPropertyType+"' class=topCenterSlug >slug name</div>";
                    newHTML2 += "<br/>";
                    newHTML2 += "<textarea id='rawFile_propertySets_"+nextPropertyType+"' class=newWordTextarea ></textarea>";
                newHTML2 += "</div>";
            newHTML2 += "</div>";
        }
    });

    jQuery("#propertyTypesDataContainer").html(newHTML1);
    jQuery("#setsForPropertyTypesContainer").html(newHTML2);
}

function importCustomProperties() {
    var propertyTreeSchemaSlug = jQuery("#propertyTreeSchemaSlug").html();
    // console.log("importCustomProperties clicked; propertyTreeSchemaSlug: "+propertyTreeSchemaSlug)
}
// I should replace newCustomPropsType1_arr with a counter since I don't use this array to store property names (I fetch them from textarea value)
var newCustomPropsType1_arr = [];
export default class AddANewConcept extends React.Component {
  componentDidMount() {
      // second iteration (panel C)
      makeAddPropertySelector_B();

      // first iteration
      makeAddPropertySelector_path();
      makeAddPropertySelector_key();
      makeAddPropertySelector_value_type();
      makeAddPropertySelector_value_targetA();
      makeAddPropertySelector_value_targetB();
      makeAddPropertySelector_value_field();
      /*
      var e = document.getElementById('showConceptGraphRels');
      e.addEventListener('click', function (event) {
          console.log("clicked showConceptGraphRels")
          // makeVisGraphB();
      });
      */
      var e2 = document.getElementsByClassName("showConceptOnGraph");
      for (var i = 0; i < e2.length; i++) {
          e2[i].addEventListener('click', function (event) {
              var thisSlug = this.getAttribute("data-conceptslug");
              makeVisGraphB(thisSlug);
          });
      }
      jQuery("#showIndividualSchemaButton").click(function(){
          var schemaIpns = jQuery("#showIndividualSchemaSelector option:selected").data("ipns");
          var schemaSlug = jQuery("#showIndividualSchemaSelector option:selected").data("slug");
          var schemaType = jQuery("#showIndividualSchemaSelector option:selected").data("schematype");
          jQuery("#updateDisplayedSchemaContainer").css("display","block");
          jQuery("#nameOfSchemaBeingDisplayedContainer").html(schemaSlug);
          // console.log("showIndividualSchemaButton clicked; schemaSlug: "+schemaSlug+"; schemaIpns: "+schemaIpns+"; schemaType: "+schemaType);
          if (schemaType=="mainSchemaForConceptGraph") {
              makeVisGraph_mSCG(schemaSlug);
          } else {
              makeVisGraphS(schemaSlug);
          }
      })

      /*
      jQuery("#createEnumerationFromSetButton").click(function(){
          console.log("createEnumerationFromSetButton clicked");
          createEnumerationFromSet();
      });
      */

      jQuery("#addSetButton").click(function(){
          var numSets = newSets_arr.length;
          // console.log("addSetButton clicked; numSets:"+numSets);
          var setNum = numSets;
          var setSlug = "";
          addNextSetHTML(setNum,setSlug);
      });
      jQuery("#addSpecificInstanceButton").click(function(){
          var numSpecificInstances = newSpecificInstances_arr.length;
          console.log("addSpecificInstanceButton clicked; numSpecificInstances: "+numSpecificInstances);
          var siNum = numSpecificInstances;
          var siSlug = "";
          addNextSpecificInstanceHTML(siNum,siSlug);
      });
      jQuery("#createKeynames").click(function(){
          // console.log("createKeynames")
          var currentTime = Date.now();
          // console.log("currentTime: "+currentTime)

          var newConceptSingular = jQuery("#newConceptSingular").val()
          var newConceptPlural = jQuery("#newConceptPlural").val()

          if ( (newConceptSingular) && (newConceptPlural) ) {
              var currentKeyname_concept = jQuery("#keyname_concept").val();
              var currentKeyname_superset = jQuery("#keyname_superset").val();
              var currentKeyname_schema = jQuery("#keyname_schema").val();
              var currentKeyname_JSONSchema = jQuery("#keyname_JSONSchema").val();
              var currentKeyname_wordType = jQuery("#keyname_wordType").val();
              var currentKeyname_propertySchema = jQuery("#keyname_propertySchema").val();
              var currentKeyname_properties = jQuery("#keyname_properties").val();
              var currentKeyname_primaryProperty = jQuery("#keyname_primaryProperty").val();

              var currentIPNS_concept = jQuery("#ipns_concept").val();
              var currentIPNS_superset = jQuery("#ipns_superset").val();
              var currentIPNS_schema = jQuery("#ipns_schema").val();
              var currentIPNS_JSONSchema = jQuery("#ipns_JSONSchema").val();
              var currentIPNS_wordType = jQuery("#ipns_wordType").val();
              var currentIPNS_propertySchema = jQuery("#ipns_propertySchema").val();
              var currentIPNS_properties = jQuery("#ipns_properties").val();
              var currentIPNS_primaryProperty = jQuery("#ipns_primaryProperty").val();

              var slugForConcept = "conceptFor"+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
              var slugForSuperset = newConceptPlural;
              var slugForSchema = "schemaFor"+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
              var slugForJSONSchema = "JSONSchemaFor"+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
              var slugForWordType = newConceptSingular;
              var slugForPropertySchema = "schemaForPropertiesFor"+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
              var slugForProperties = "propertiesFor"+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
              var slugForPrimaryProperty = "primaryPropertyFor"+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
              // console.log("slugForConcept: "+slugForConcept)

              var newKeyname_concept = "dictionaryWord_"+slugForConcept+"_"+currentTime+"_0";
              var newKeyname_superset = "dictionaryWord_"+slugForSuperset+"_"+currentTime+"_1";
              var newKeyname_schema = "dictionaryWord_"+slugForSchema+"_"+currentTime+"_2";
              var newKeyname_JSONSchema = "dictionaryWord_"+slugForJSONSchema+"_"+currentTime+"_3";
              var newKeyname_wordType = "dictionaryWord_"+slugForWordType+"_"+currentTime+"_4";
              var newKeyname_propertySchema = "dictionaryWord_"+slugForPropertySchema+"_"+currentTime+"_5";
              var newKeyname_properties = "dictionaryWord_"+slugForProperties+"_"+currentTime+"_6";
              var newKeyname_primaryProperty = "dictionaryWord_"+slugForPrimaryProperty+"_"+currentTime+"_7";
              // console.log("newKeyname_concept: "+newKeyname_concept)

              if (!currentIPNS_concept) { jQuery("#keyname_concept").val(newKeyname_concept); }
              if (!currentIPNS_superset) { jQuery("#keyname_superset").val(newKeyname_superset); }
              if (!currentIPNS_schema) { jQuery("#keyname_schema").val(newKeyname_schema); }
              if (!currentIPNS_JSONSchema) { jQuery("#keyname_JSONSchema").val(newKeyname_JSONSchema); }
              if (!currentIPNS_wordType) { jQuery("#keyname_wordType").val(newKeyname_wordType); }
              if (!currentIPNS_propertySchema) { jQuery("#keyname_propertySchema").val(newKeyname_propertySchema); }
              if (!currentIPNS_properties) { jQuery("#keyname_properties").val(newKeyname_properties); }
              if (!currentIPNS_primaryProperty) { jQuery("#keyname_primaryProperty").val(newKeyname_primaryProperty); }

              // qwerty
              var wordCounter = 7;
              jQuery.each(propertyTypes,function(nextPropertyType,obj){
                  console.log("nextPropertyType: "+nextPropertyType+"; obj.applyTo.schemaForProperty: "+obj.applyTo.schemaForProperty)
                  if (obj.applyTo.propertySchemas===true) {
                      var newWord_slug = slugForProperties+"_"+nextPropertyType;
                      wordCounter++;
                      var newWord_keyname = "dictionaryWord_"+newWord_slug+"_"+currentTime+"_"+wordCounter;
                      jQuery("#keyname_propertySets_"+nextPropertyType).val(newWord_keyname);
                  }
              });
          } else {
              alert("name, singular and name, plural fields must not be empty")
          }
      });
      jQuery("#createIPNS").click(function(){
          // console.log("createIPNS")

          var currentIpns_concept = jQuery("#ipns_concept").val();
          var currentIpns_superset = jQuery("#ipns_superset").val();
          var currentIpns_schema = jQuery("#ipns_schema").val();
          var currentIpns_JSONSchema = jQuery("#ipns_JSONSchema").val();
          var currentIpns_wordType = jQuery("#ipns_wordType").val();
          var currentIpns_propertySchema = jQuery("#ipns_propertySchema").val();
          var currentIpns_properties = jQuery("#ipns_properties").val();
          var currentIpns_primaryProperty = jQuery("#ipns_primaryProperty").val();

          var newKeyname_concept = jQuery("#keyname_concept").val();
          var newKeyname_superset = jQuery("#keyname_superset").val();
          var newKeyname_schema = jQuery("#keyname_schema").val();
          var newKeyname_JSONSchema = jQuery("#keyname_JSONSchema").val();
          var newKeyname_wordType = jQuery("#keyname_wordType").val();
          var newKeyname_propertySchema = jQuery("#keyname_propertySchema").val();
          var newKeyname_properties = jQuery("#keyname_properties").val();
          var newKeyname_primaryProperty = jQuery("#keyname_primaryProperty").val();

          if (!currentIpns_concept) { generateNewKey_cnwPage(newKeyname_concept,"ipns_concept"); }
          if (!currentIpns_superset) { generateNewKey_cnwPage(newKeyname_superset,"ipns_superset"); }
          if (!currentIpns_schema) { generateNewKey_cnwPage(newKeyname_schema,"ipns_schema"); }
          if (!currentIpns_JSONSchema) { generateNewKey_cnwPage(newKeyname_JSONSchema,"ipns_JSONSchema"); }
          if (!currentIpns_wordType) { generateNewKey_cnwPage(newKeyname_wordType,"ipns_wordType"); }
          if (!currentIpns_propertySchema) { generateNewKey_cnwPage(newKeyname_propertySchema,"ipns_propertySchema"); }
          if (!currentIpns_properties) { generateNewKey_cnwPage(newKeyname_properties,"ipns_properties"); }
          if (!currentIpns_primaryProperty) { generateNewKey_cnwPage(newKeyname_primaryProperty,"ipns_primaryProperty"); }

          // qwerty
          jQuery.each(propertyTypes,function(nextPropertyType,obj){
              // console.log("nextPropertyType: "+nextPropertyType+"; obj.applyTo.schemaForProperty: "+obj.applyTo.schemaForProperty)
              var currentIpns_propertySets = {};
              var newKeyname_propertySets = {};
              if (obj.applyTo.propertySchemas===true) {
                  var newConceptSingular = jQuery("#newConceptSingular").val()
                  var slugForProperties = "propertiesFor"+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
                  var newWord_slug = slugForProperties+"_"+nextPropertyType;
                  newKeyname_propertySets[nextPropertyType] = jQuery("#keyname_propertySets_"+nextPropertyType).val();
                  currentIpns_propertySets[nextPropertyType] = jQuery("#ipns_propertySets_"+nextPropertyType).val();
                  if (!currentIpns_propertySets[nextPropertyType]) { generateNewKey_cnwPage(newKeyname_propertySets[nextPropertyType],"ipns_propertySets_"+nextPropertyType); }
                  // jQuery("#ipns_propertySets_"+nextPropertyType).val(newWord_keyname);
              }
          });
      });
      jQuery("#makeNewConceptButton").click(function(){

          ////////////////////////////////////////////////////////
          ////////////////// INITIAL SETUP: 5 MAIN WORDS ///////////////
          var newConceptSingular = jQuery("#newConceptSingular").val()
          var newConceptPlural = jQuery("#newConceptPlural").val()
          var newConceptDescription = jQuery("#newConceptDescription").val()
          var newConceptProperty = jQuery("#newConceptProperty").val()
          var newConceptFirstPropertyDescription = jQuery("#newConceptFirstPropertyDescription").val();
          console.log("makeNewConceptButton clicked; newConceptSingular: "+newConceptSingular+"; newConceptPlural: "+newConceptPlural)

          // make slugs for 5+1 main nodes and check to see whether they already exist
          var slugForConcept = "conceptFor"+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
          var slugForSuperset = newConceptPlural;
          var slugForSchema = "schemaFor"+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
          var slugForJSONSchema = "JSONSchemaFor"+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
          var slugForWordType = newConceptSingular;
          var slugForPropertySchema = "schemaForPropertiesFor"+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
          var slugForProperties = "propertiesFor"+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
          var slugForPrimaryProperty = "primaryPropertyFor"+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);

          var newConcept_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["concept"]));
          var newSuperset_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["superset"]));
          var newSchema_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["schema"]));
          var newJSONSchema_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["JSONSchema"]));
          var newWordType_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["wordType"]));
          var newPropertySchema_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["schema"]));
          var newProperties_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["set"]));
          var newPrimaryProperty_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["property"]));

          if (lookupRawFileBySlug_obj.hasOwnProperty(slugForConcept)) {
              newConcept_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[slugForConcept]));
          }
          if (lookupRawFileBySlug_obj.hasOwnProperty(slugForSchema)) {
              newSchema_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[slugForSchema]));
          }
          if (lookupRawFileBySlug_obj.hasOwnProperty(slugForJSONSchema)) {
              newJSONSchema_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[slugForJSONSchema]));
          }
          if (lookupRawFileBySlug_obj.hasOwnProperty(slugForSuperset)) {
              newSuperset_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[slugForSuperset]));
          }
          if (lookupRawFileBySlug_obj.hasOwnProperty(slugForWordType)) {
              newWordType_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[slugForWordType]));
          }
          if (lookupRawFileBySlug_obj.hasOwnProperty(slugForPropertySchema)) {
              newPropertySchema_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[slugForPropertySchema]));
          }
          if (lookupRawFileBySlug_obj.hasOwnProperty(slugForProperties)) {
              newProperties_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[slugForProperties]));
          }
          if (lookupRawFileBySlug_obj.hasOwnProperty(slugForPrimaryProperty)) {
              newPrimaryProperty_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[slugForPrimaryProperty]));
          }

          // globalDynamicData basics for 5 main words
          var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
          var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
          newConcept_obj["globalDynamicData"]["myDictionaries"].push(myDictionary);
          newConcept_obj["globalDynamicData"]["myConceptGraphs"].push(myConceptGraph);
          newSuperset_obj["globalDynamicData"]["myDictionaries"].push(myDictionary);
          newSuperset_obj["globalDynamicData"]["myConceptGraphs"].push(myConceptGraph);
          newWordType_obj["globalDynamicData"]["myDictionaries"].push(myDictionary);
          newWordType_obj["globalDynamicData"]["myConceptGraphs"].push(myConceptGraph);
          newSchema_obj["globalDynamicData"]["myDictionaries"].push(myDictionary);
          newSchema_obj["globalDynamicData"]["myConceptGraphs"].push(myConceptGraph);
          newJSONSchema_obj["globalDynamicData"]["myDictionaries"] = MiscFunctions.pushIfNotAlreadyThere(newJSONSchema_obj["globalDynamicData"]["myDictionaries"],myDictionary);
          newJSONSchema_obj["globalDynamicData"]["myConceptGraphs"] = MiscFunctions.pushIfNotAlreadyThere(newJSONSchema_obj["globalDynamicData"]["myConceptGraphs"],myConceptGraph);
          newPropertySchema_obj["globalDynamicData"]["myDictionaries"].push(myDictionary);
          newPropertySchema_obj["globalDynamicData"]["myConceptGraphs"].push(myConceptGraph);
          newProperties_obj["globalDynamicData"]["myDictionaries"].push(myDictionary);
          newProperties_obj["globalDynamicData"]["myConceptGraphs"].push(myConceptGraph);
          newPrimaryProperty_obj["globalDynamicData"]["myDictionaries"].push(myDictionary);
          newPrimaryProperty_obj["globalDynamicData"]["myConceptGraphs"].push(myConceptGraph);

          ////////////////////////////////////////////////////////
          ///////////////////// MAKE SETS ////////////////////////
          jQuery("#sets_container").html("");

          var lookupSetNumBySlug = {};
          var numSets = newSets_arr.length;
          // console.log("makeNewConceptButton, sets; numSets: "+numSets);
          for (var p=0;p<numSets;p++) {
              var setSlug = jQuery("#setSlug_"+p).val();
              if (lookupRawFileBySlug_obj.hasOwnProperty(setSlug)) {
                  var newSet_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[setSlug]));
              } else {
                  var newSet_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["set"]));
              }
              var newSet_str = JSON.stringify(newSet_obj,null,4)
              // console.log("---newSet_str: "+newSet_str);

              var setTitle = jQuery("#setTitle_"+p).val();
              var setName = jQuery("#setName_"+p).val();
              var setDescription = jQuery("#setDescription_"+p).val();
              var setKeyname = jQuery("#keyname_set_"+p).val();
              var setIPNS = jQuery("#ipns_set_"+p).val();
              var setDelete = jQuery("#newSetDelete_"+p).prop("checked");
              // console.log("setDelete: "+setDelete)
              if (setDelete==false) {
                  // console.log("setDelete is false ");
                  lookupSetNumBySlug[setSlug]=p;

                  newSet_obj["wordData"]["slug"] = setSlug;
                  newSet_obj["wordData"]["title"] = setTitle;
                  newSet_obj["wordData"]["name"] = setName;
                  if (jQuery.inArray("set",newSet_obj["wordData"]["wordTypes"]) == -1) {
                      newSet_obj["wordData"]["wordTypes"].push("set");
                  }

                  newSet_obj["setData"] = {};
                  newSet_obj["setData"]["slug"] = setSlug;
                  newSet_obj["setData"]["name"] = setName;
                  newSet_obj["setData"]["title"] = setTitle;
                  newSet_obj["setData"]["description"] = setDescription;

                  for (var x=0;x<numLinksThisSet[p];x++) {
                      var setLinksTo = jQuery("#setLinksToSelector_"+p+"_"+x+" option:selected").val();
                      if (!newSet_obj.globalDynamicData.hasOwnProperty("subsetOf")) {
                          newSet_obj["globalDynamicData"]["subsetOf"] = [];
                      }
                      newSet_obj["globalDynamicData"]["subsetOf"].push(setLinksTo);
                  }

                  // move globalDynamicData to the end
                  var gDD_set_obj = {};
                  if (newSet_obj.hasOwnProperty("globalDynamicData")) {
                      var gDD_set_obj = JSON.parse(JSON.stringify(newSet_obj.globalDynamicData));
                  }
                  delete newSet_obj["globalDynamicData"];
                  newSet_obj["globalDynamicData"] = JSON.parse(JSON.stringify(gDD_set_obj));

                  // move metaData to the end
                  delete newSet_obj["metaData"];
                  newSet_obj["metaData"] = {};
                  newSet_obj["metaData"]["ipns"] = setIPNS;
                  if (jQuery.inArray(myDictionary,newSet_obj["globalDynamicData"]["myDictionaries"]) == -1) {
                      newSet_obj["globalDynamicData"]["myDictionaries"].push(myDictionary);
                  }
                  if (jQuery.inArray(myConceptGraph,newSet_obj["globalDynamicData"]["myConceptGraphs"]) == -1) {
                      newSet_obj["globalDynamicData"]["myConceptGraphs"].push(myConceptGraph);
                  }

                  var newSet_str = JSON.stringify(newSet_obj,null,4)
                  lookupRawFileBySlug_obj[setSlug] = JSON.parse(JSON.stringify(newSet_obj));

                  var setHTML = "<div class=singleSetWrapper >";
                  setHTML += "<div style=position:absolute;right:10px;top:5px; >SET</div><br>";
                  setHTML += "<textarea id=setRawFile_"+p+" style=width:800px;height:200px;>";
                  setHTML += newSet_str;
                  setHTML += "</textarea>";
                  setHTML += "</div>";
                  setHTML += "<br>";

                  jQuery("#sets_container").append(setHTML);

                  newConcept_obj["globalDynamicData"]["sets"].push(setSlug);
                  newSuperset_obj["globalDynamicData"]["subsets"].push(setSlug);

              } else {
                  // console.log("setDelete is not false ");
              }
          }

          ///////////// concept //////////////
          var titleForConcept = "Concept for "+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
          var nameForConcept = "concept for "+newConceptSingular;
          var propertyPath = newConceptSingular+"Data";
          var propertyPath_name = newConceptSingular + " data";
          var propertyPath_title = newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1) + " Data";
          var propertyPath_slug = newConceptSingular + "Data";
          var propertyPath_description = "everything there is to know about " + newConceptPlural;
          newConcept_obj["wordData"]["slug"]=slugForConcept;
          newConcept_obj["wordData"]["title"]=titleForConcept;
          newConcept_obj["wordData"]["name"]=nameForConcept;
          newConcept_obj["conceptData"]["name"]["singular"] = newConceptSingular;
          newConcept_obj["conceptData"]["name"]["plural"] = newConceptPlural;
          newConcept_obj["conceptData"]["description"] = newConceptDescription;
          newConcept_obj["conceptData"]["propertyPath"] = propertyPath;
          newConcept_obj["conceptData"]["ReactJSONSchema"]["key"] = propertyPath;
          newConcept_obj["conceptData"]["ReactJSONSchema"]["schema"]["required"] = ["name",propertyPath];
          newConcept_obj["conceptData"]["ReactJSONSchema"]["schema"]["properties"][propertyPath] = { "type": "string"}

          ///////////// superset //////////////
          var titleForSuperset = newConceptPlural.substr(0,1).toUpperCase()+newConceptPlural.substr(1);
          var nameForSuperset = newConceptPlural;
          newSuperset_obj["wordData"]["slug"]=slugForSuperset;
          newSuperset_obj["wordData"]["title"]=titleForSuperset;
          newSuperset_obj["wordData"]["name"]=nameForSuperset;
          newSuperset_obj.supersetData.metaData.governingConcept.slug = slugForConcept;

          ///////////// schema basics //////////////
          var titleForSchema = "Schema for "+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
          var nameForSchema = "schema for "+newConceptSingular;
          newSchema_obj["wordData"]["slug"]=slugForSchema;
          newSchema_obj["wordData"]["title"]=titleForSchema;
          newSchema_obj["wordData"]["name"]=nameForSchema;
          newSchema_obj.schemaData.metaData.governingConcept.slug = slugForConcept;
          newSchema_obj.schemaData.metaData.types = [];
          newSchema_obj.schemaData.metaData.types.push("conceptRelationships");
          newSchema_obj.schemaData.types = [];
          newSchema_obj.schemaData.types.push("conceptRelationships");

          ///////////// propertySchema basics //////////////
          var titleForPropertySchema = "Schema for Properties for "+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
          var nameForPropertySchema = "schema for properties for "+newConceptSingular;
          newPropertySchema_obj["wordData"]["slug"]=slugForPropertySchema;
          newPropertySchema_obj["wordData"]["title"]=titleForPropertySchema;
          newPropertySchema_obj["wordData"]["name"]=nameForPropertySchema;
          newPropertySchema_obj.schemaData.metaData.governingConcept.slug = slugForConcept;
          newPropertySchema_obj.schemaData.metaData.types = [];
          newPropertySchema_obj.schemaData.metaData.types.push("propertySchema");
          newPropertySchema_obj.schemaData.types = [];
          newPropertySchema_obj.schemaData.types.push("propertySchema");

          ///////////// properties basics //////////////
          var titleForProperties = "Properties for "+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
          var nameForProperties = "properties for "+newConceptSingular;
          newProperties_obj["wordData"]["slug"]=slugForProperties;
          newProperties_obj["wordData"]["title"]=titleForProperties;
          newProperties_obj["wordData"]["name"]=nameForProperties;
          newProperties_obj.setData.title = "Main "+titleForProperties;
          newProperties_obj.setData.metaData.types = [];
          newProperties_obj.setData.metaData.types.push("mainPropertiesSet");
          newProperties_obj.setData.metaData.governingConcepts = [];
          newProperties_obj.setData.metaData.governingConcepts.push(slugForConcept);

          ///////////// primaryProperty basics //////////////
          var titleForPrimaryProperty = "Primary Property for "+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
          var nameForPrimaryProperty = "primary property for "+newConceptSingular;
          newPrimaryProperty_obj.wordData.slug = slugForPrimaryProperty;
          newPrimaryProperty_obj.wordData.title = titleForPrimaryProperty;
          newPrimaryProperty_obj.wordData.name = nameForPrimaryProperty;
          newPrimaryProperty_obj.propertyData.type = "type3";
          newPrimaryProperty_obj.propertyData.types = [ "type3" ];
          newPrimaryProperty_obj.propertyData.JSONSchemaStyle.key = propertyPath;
          newPrimaryProperty_obj.propertyData.metaData.parentConcept = slugForConcept;
          newPrimaryProperty_obj.propertyData.metaData.parentConcepts = [ slugForConcept ];
          newPrimaryProperty_obj.propertyData.metaData.type = "primaryProperty";
          newPrimaryProperty_obj.propertyData.metaData.types = [ "primaryProperty" ];

          ///////////// JSONSchema //////////////
          var titleForJSONSchema = "JSON Schema for "+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
          var nameForJSONSchema = "JSON schema for "+newConceptSingular;
          newJSONSchema_obj["wordData"]["slug"]=slugForJSONSchema;
          newJSONSchema_obj["wordData"]["title"]=titleForJSONSchema;
          newJSONSchema_obj["wordData"]["name"]=nameForJSONSchema;
          newJSONSchema_obj["JSONSchemaData"]["metaData"]["governingConcept"]["slug"]=slugForConcept;
          newJSONSchema_obj["JSONSchemaData"]["metaData"]["primaryProperty"]=propertyPath;
          newJSONSchema_obj["JSONSchemaData"]["metaData"]["primaryPropertySlug"]=slugForPrimaryProperty;
          newJSONSchema_obj.definitions[slugForPrimaryProperty] = {};
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["type"] = "object";
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["name"] = propertyPath_name;
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["title"] = propertyPath_title;
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["slug"] = propertyPath_slug;
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["description"] = propertyPath_description;
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["required"] = ["name"];
          // newJSONSchema_obj.definitions[slugForPrimaryProperty]["default"] = {};
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"] = {};
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["name"] = {};
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["name"]["type"] = "string";
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["name"]["name"] = "name";
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["name"]["title"] = "Name";
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["name"]["slug"] = "name";
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["name"]["description"] = "The name of the "+newConceptSingular;
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["title"] = {};
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["title"]["type"] = "string";
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["title"]["name"] = "title";
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["title"]["title"] = "Title";
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["title"]["slug"] = "title";
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["title"]["description"] = "The Title of the "+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["slug"] = {};
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["slug"]["type"] = "string";
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["slug"]["name"] = "slug";
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["slug"]["title"] = "Slug";
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["slug"]["slug"] = "slug";
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["slug"]["description"] = "theSlugForThe"+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["alias"] = {};
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["alias"]["type"] = "string";
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["alias"]["name"] = "alias";
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["alias"]["title"] = "Alias";
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["alias"]["slug"] = "alias";
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["alias"]["alias"] = "alias";
          newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"]["alias"]["description"] = "theAliasForThe"+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
          if (newConceptProperty) {
              newJSONSchema_obj.definitions[slugForPrimaryProperty]["required"].push(newConceptProperty);
              newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"][newConceptProperty] = {};
              // newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"][newConceptProperty]["title"] = newConceptProperty.substr(0,1).toUpperCase()+newConceptProperty.substr(1);;
              newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"][newConceptProperty]["type"] = "string";
              newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"][newConceptProperty]["description"] = newConceptFirstPropertyDescription;
              newJSONSchema_obj.definitions[slugForPrimaryProperty]["properties"][newConceptProperty]["default"] = "";
          }
          newJSONSchema_obj["required"]=[ propertyPath ];
          newJSONSchema_obj["properties"] = {};
          newJSONSchema_obj["properties"][propertyPath] = {};
          newJSONSchema_obj["properties"][propertyPath]["$ref"] = "#/definitions/"+slugForPrimaryProperty;
          /*
          newJSONSchema_obj["properties"][propertyPath]["type"] = "object";
          newJSONSchema_obj["properties"][propertyPath]["title"] = propertyPath_title;
          newJSONSchema_obj["properties"][propertyPath]["description"] = "";
          newJSONSchema_obj["properties"][propertyPath]["required"] = ["name"];
          // newJSONSchema_obj["properties"][propertyPath]["default"] = {};
          newJSONSchema_obj["properties"][propertyPath]["properties"] = {};
          newJSONSchema_obj["properties"][propertyPath]["properties"]["name"] = {};
          newJSONSchema_obj["properties"][propertyPath]["properties"]["name"]["type"] = "string";
          newJSONSchema_obj["properties"][propertyPath]["properties"]["name"]["title"] = "Name";
          newJSONSchema_obj["properties"][propertyPath]["properties"]["title"] = {};
          newJSONSchema_obj["properties"][propertyPath]["properties"]["title"]["type"] = "string";
          newJSONSchema_obj["properties"][propertyPath]["properties"]["title"]["title"] = "Title";
          newJSONSchema_obj["properties"][propertyPath]["properties"]["slug"] = {};
          newJSONSchema_obj["properties"][propertyPath]["properties"]["slug"]["type"] = "string";
          newJSONSchema_obj["properties"][propertyPath]["properties"]["slug"]["title"] = "Slug";
          if (newConceptProperty) {
              newJSONSchema_obj["properties"][propertyPath]["required"].push(newConceptProperty);
              newJSONSchema_obj["properties"][propertyPath]["properties"][newConceptProperty] = {};
              // newJSONSchema_obj["properties"][propertyPath]["properties"][newConceptProperty]["title"] = newConceptProperty.substr(0,1).toUpperCase()+newConceptProperty.substr(1);;
              newJSONSchema_obj["properties"][propertyPath]["properties"][newConceptProperty]["type"] = "string";
              newJSONSchema_obj["properties"][propertyPath]["properties"][newConceptProperty]["description"] = newConceptFirstPropertyDescription;
              newJSONSchema_obj["properties"][propertyPath]["properties"][newConceptProperty]["default"] = "";
          }
          */

          ///////////// wordType //////////////
          var titleForWordType = newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
          var nameForWordType = newConceptSingular;
          newWordType_obj["wordData"]["slug"]=slugForWordType;
          newWordType_obj["wordData"]["title"]=titleForWordType;
          newWordType_obj["wordData"]["name"]=nameForWordType;
          newWordType_obj["wordTypeData"]["slug"]=slugForWordType;
          newWordType_obj["wordTypeData"]["title"]=titleForWordType;
          newWordType_obj["wordTypeData"]["name"]=nameForWordType;
          // newWordType_obj["wordTypeData"]["entry"]=slugForWordType;
          newWordType_obj["wordTypeData"]["concept"]=slugForConcept;
          newWordType_obj["wordTypeData"]["description"]=newConceptDescription;

          if (!newConcept_obj.conceptData.nodes.hasOwnProperty("propertySchema")) {
              newConcept_obj.conceptData.nodes.propertySchema = {};
              newConcept_obj.conceptData.nodes.propertySchema.slug = "";
              newConcept_obj.conceptData.nodes.propertySchema.ipns = "";
          }
          if (!newConcept_obj.conceptData.nodes.hasOwnProperty("properties")) {
              newConcept_obj.conceptData.nodes.properties = {};
              newConcept_obj.conceptData.nodes.properties.slug = "";
              newConcept_obj.conceptData.nodes.properties.ipns = "";
          }
          if (!newConcept_obj.conceptData.nodes.hasOwnProperty("primaryProperty")) {
              newConcept_obj.conceptData.nodes.primaryProperty = {};
              newConcept_obj.conceptData.nodes.primaryProperty.slug = "";
              newConcept_obj.conceptData.nodes.primaryProperty.ipns = "";
          }
          newConcept_obj["conceptData"]["nodes"]["concept"]["slug"] = slugForConcept;
          newConcept_obj["conceptData"]["nodes"]["superset"]["slug"] = slugForSuperset;
          newConcept_obj["conceptData"]["nodes"]["schema"]["slug"] = slugForSchema;
          newConcept_obj["conceptData"]["nodes"]["JSONSchema"]["slug"] = slugForJSONSchema;
          newConcept_obj["conceptData"]["nodes"]["wordType"]["slug"] = slugForWordType;
          newConcept_obj["conceptData"]["nodes"]["propertySchema"]["slug"] = slugForPropertySchema;
          newConcept_obj["conceptData"]["nodes"]["properties"]["slug"] = slugForProperties;
          newConcept_obj["conceptData"]["nodes"]["primaryProperty"]["slug"] = slugForPrimaryProperty;

          newConcept_obj["conceptData"]["nodes"]["concept"]["ipns"] = jQuery("#ipns_concept").val();
          newConcept_obj["conceptData"]["nodes"]["superset"]["ipns"] = jQuery("#ipns_superset").val();
          newConcept_obj["conceptData"]["nodes"]["schema"]["ipns"] = jQuery("#ipns_schema").val();
          newConcept_obj["conceptData"]["nodes"]["JSONSchema"]["ipns"] = jQuery("#ipns_JSONSchema").val();
          newConcept_obj["conceptData"]["nodes"]["wordType"]["ipns"] = jQuery("#ipns_wordType").val();
          newConcept_obj["conceptData"]["nodes"]["propertySchema"]["ipns"] = jQuery("#ipns_propertySchema").val();
          newConcept_obj["conceptData"]["nodes"]["properties"]["ipns"] = jQuery("#ipns_properties").val();
          newConcept_obj["conceptData"]["nodes"]["primaryProperty"]["ipns"] = jQuery("#ipns_primaryProperty").val();

          newConcept_obj["metaData"]["ipns"] = jQuery("#ipns_concept").val();
          newSuperset_obj["metaData"]["ipns"] = jQuery("#ipns_superset").val();
          newSchema_obj["metaData"]["ipns"] = jQuery("#ipns_schema").val();
          newJSONSchema_obj["metaData"]["ipns"] = jQuery("#ipns_JSONSchema").val();
          newWordType_obj["metaData"]["ipns"] = jQuery("#ipns_wordType").val();
          newPropertySchema_obj["metaData"]["ipns"] = jQuery("#ipns_propertySchema").val();
          newProperties_obj["metaData"]["ipns"] = jQuery("#ipns_properties").val();
          newPrimaryProperty_obj["metaData"]["ipns"] = jQuery("#ipns_primaryProperty").val();

          jQuery("#slug_concept").html(slugForConcept)
          jQuery("#slug_superset").html(slugForSuperset)
          jQuery("#slug_schema").html(slugForSchema)
          jQuery("#slug_JSONSchema").html(slugForJSONSchema)
          jQuery("#slug_wordType").html(slugForWordType)
          jQuery("#slug_propertySchema").html(slugForPropertySchema)
          jQuery("#slug_properties").html(slugForProperties)
          jQuery("#slug_primaryProperty").html(slugForPrimaryProperty)

          ///////// schema nodes
          var nextNode_concept_obj = {}
          var nextNode_superset_obj = {}
          var nextNode_schema_obj = {}
          var nextNode_JSONSchema_obj = {}
          var nextNode_wordType_obj = {}
          var nextNode_propertySchema_obj = {}
          var nextNode_properties_obj = {}
          var nextNode_primaryProperty_obj = {}

          nextNode_concept_obj["slug"] = slugForConcept;
          nextNode_superset_obj["slug"] = slugForSuperset;
          nextNode_schema_obj["slug"] = slugForSchema;
          nextNode_JSONSchema_obj["slug"] = slugForJSONSchema;
          nextNode_wordType_obj["slug"] = slugForWordType;
          nextNode_propertySchema_obj["slug"] = slugForPropertySchema;
          nextNode_properties_obj["slug"] = slugForProperties;
          nextNode_primaryProperty_obj["slug"] = slugForPrimaryProperty;

          nextNode_concept_obj["ipns"] = jQuery("#ipns_concept").val();
          nextNode_superset_obj["ipns"] = jQuery("#ipns_superset").val();
          nextNode_schema_obj["ipns"] = jQuery("#ipns_schema").val();
          nextNode_JSONSchema_obj["ipns"] = jQuery("#ipns_JSONSchema").val();
          nextNode_wordType_obj["ipns"] = jQuery("#ipns_wordType").val();
          nextNode_propertySchema_obj["ipns"] = jQuery("#ipns_propertySchema").val();
          nextNode_properties_obj["ipns"] = jQuery("#ipns_properties").val();
          nextNode_primaryProperty_obj["ipns"] = jQuery("#ipns_primaryProperty").val();

          if (!MiscFunctions.isWordObjInArrayOfObj(nextNode_concept_obj,newSchema_obj.schemaData.nodes)) {
              newSchema_obj.schemaData.nodes.push(nextNode_concept_obj);
          }
          if (!MiscFunctions.isWordObjInArrayOfObj(nextNode_superset_obj,newSchema_obj.schemaData.nodes)) {
              newSchema_obj.schemaData.nodes.push(nextNode_superset_obj);
          }
          if (!MiscFunctions.isWordObjInArrayOfObj(nextNode_schema_obj,newSchema_obj.schemaData.nodes)) {
              newSchema_obj.schemaData.nodes.push(nextNode_schema_obj);
          }
          if (!MiscFunctions.isWordObjInArrayOfObj(nextNode_JSONSchema_obj,newSchema_obj.schemaData.nodes)) {
              newSchema_obj.schemaData.nodes.push(nextNode_JSONSchema_obj);
          }
          if (!MiscFunctions.isWordObjInArrayOfObj(nextNode_wordType_obj,newSchema_obj.schemaData.nodes)) {
              newSchema_obj.schemaData.nodes.push(nextNode_wordType_obj);
          }
          if (!MiscFunctions.isWordObjInArrayOfObj(nextNode_propertySchema_obj,newSchema_obj.schemaData.nodes)) {
              newSchema_obj.schemaData.nodes.push(nextNode_propertySchema_obj);
          }
          if (!MiscFunctions.isWordObjInArrayOfObj(nextNode_properties_obj,newSchema_obj.schemaData.nodes)) {
              newSchema_obj.schemaData.nodes.push(nextNode_properties_obj);
          }
          if (!MiscFunctions.isWordObjInArrayOfObj(nextNode_primaryProperty_obj,newSchema_obj.schemaData.nodes)) {
              newSchema_obj.schemaData.nodes.push(nextNode_primaryProperty_obj);
          }

          ///////// schema relationships (basic concept relationshipTypes)
          var nextRel_obj = {};
          nextRel_obj["nodeFrom"] = { "slug": slugForJSONSchema };
          nextRel_obj["relationshipType"] = { "slug": "isTheJSONSchemaFor" };
          nextRel_obj["nodeTo"] = { "slug": slugForWordType };
          if (!MiscFunctions.isRelObjInArrayOfObj(nextRel_obj,newSchema_obj.schemaData.relationships)) {
              newSchema_obj.schemaData.relationships.push(nextRel_obj);
          }

          nextRel_obj = {}
          nextRel_obj["nodeFrom"] = { "slug": slugForSchema };
          nextRel_obj["relationshipType"] = { "slug": "isTheSchemaFor" };
          nextRel_obj["nodeTo"] = { "slug": slugForWordType };
          if (!MiscFunctions.isRelObjInArrayOfObj(nextRel_obj,newSchema_obj.schemaData.relationships)) {
              newSchema_obj.schemaData.relationships.push(nextRel_obj);
          }

          nextRel_obj = {}
          nextRel_obj["nodeFrom"] = { "slug": slugForConcept };
          nextRel_obj["relationshipType"] = { "slug": "isTheConceptFor" };
          nextRel_obj["nodeTo"] = { "slug": slugForWordType };
          if (!MiscFunctions.isRelObjInArrayOfObj(nextRel_obj,newSchema_obj.schemaData.relationships)) {
              newSchema_obj.schemaData.relationships.push(nextRel_obj);
          }

          nextRel_obj = {}
          nextRel_obj["nodeFrom"] = { "slug": slugForSuperset };
          nextRel_obj["relationshipType"] = { "slug": "isTheSupersetFor" };
          nextRel_obj["nodeTo"] = { "slug": slugForWordType };
          if (!MiscFunctions.isRelObjInArrayOfObj(nextRel_obj,newSchema_obj.schemaData.relationships)) {
              newSchema_obj.schemaData.relationships.push(nextRel_obj);
          }

          nextRel_obj = {}
          nextRel_obj["nodeFrom"] = { "slug": slugForPropertySchema };
          nextRel_obj["relationshipType"] = { "slug": "isThePropertySchemaFor" };
          nextRel_obj["nodeTo"] = { "slug": slugForWordType };
          if (!MiscFunctions.isRelObjInArrayOfObj(nextRel_obj,newSchema_obj.schemaData.relationships)) {
              newSchema_obj.schemaData.relationships.push(nextRel_obj);
          }

          nextRel_obj = {}
          nextRel_obj["nodeFrom"] = { "slug": slugForProperties };
          nextRel_obj["relationshipType"] = { "slug": "isTheSetOfPropertiesFor" };
          nextRel_obj["nodeTo"] = { "slug": slugForWordType };
          if (!MiscFunctions.isRelObjInArrayOfObj(nextRel_obj,newSchema_obj.schemaData.relationships)) {
              newSchema_obj.schemaData.relationships.push(nextRel_obj);
          }

          nextRel_obj = {}
          nextRel_obj["nodeFrom"] = { "slug": slugForPrimaryProperty };
          nextRel_obj["relationshipType"] = { "slug": "isThePrimaryPropertyFor" };
          nextRel_obj["nodeTo"] = { "slug": slugForWordType };
          if (!MiscFunctions.isRelObjInArrayOfObj(nextRel_obj,newSchema_obj.schemaData.relationships)) {
              newSchema_obj.schemaData.relationships.push(nextRel_obj);
          }

          ///////// schema relationships (subsetOf, isASpecificInstanceOf)

          var numSets = newSets_arr.length;
          var newSets_str = JSON.stringify(newSets_arr,null,4)
          // console.log("newSets_str; "+newSets_str);
          // console.log("makeNewConceptButton, sets; numSets: "+numSets);

          for (var p=0;p<numSets;p++) {
              var setDelete = jQuery("#newSetDelete_"+p).prop("checked");
              if (!setDelete) {
                  // var newSetSlug = newSets_arr[p]["slug"];
                  var newSetSlug = jQuery("#setSlug_"+p).val();
                  var newSetIPNS = jQuery("#ipns_set_"+p).val();
                  // console.log("makeNewConceptButton, sets; p: "+p+"; newSetSlug: "+newSetSlug);
                  // add relationship to schema
                  for (var x=0;x<numLinksThisSet[p];x++) {
                      var slugForLink = jQuery("#setLinksToSelector_"+p+"_"+x+" option:selected ").val();
                      nextRel_obj = {}
                      nextRel_obj["nodeFrom"] = { "slug": newSetSlug };
                      nextRel_obj["relationshipType"] = { "slug": "subsetOf" };
                      nextRel_obj["nodeTo"] = { "slug": slugForLink };
                      if (!isRelObjInArrayOfObj(nextRel_obj,newSchema_obj["schemaData"]["relationships"]) ) {
                          newSchema_obj["schemaData"]["relationships"].push(nextRel_obj);
                      }
                  }
                  // add new set node to schema if not already present
                  var newSet_obj = {};
                  newSet_obj["slug"] = newSetSlug;
                  newSet_obj["ipns"] = newSetIPNS;
                  if (!isWordObjInArrayOfObj(newSet_obj,newSchema_obj["schemaData"]["nodes"])) {
                      newSchema_obj["schemaData"]["nodes"].push(newSet_obj);
                  }
              }
          }

          var numSpecificInstances = newSpecificInstances_arr.length;
          var newSpecificInstances_str = JSON.stringify(newSpecificInstances_arr,null,4)
          console.log("newSpecificInstances_str; "+newSpecificInstances_str);
          console.log("makeNewConceptButton, specificInstances; numSpecificInstances: "+numSpecificInstances);
          for (var p=0;p<numSpecificInstances;p++) {
              var siDelete = jQuery("#newSpecificInstanceDelete_"+p).prop("checked");
              if (!siDelete) {
                  // var newSpecificInstanceSlug = newSpecificInstances_arr[p]["slug"];
                  // var newSpecificInstanceIPNS = newSpecificInstances_arr[p]["ipns"];
                  var newSpecificInstanceSlug = jQuery("#siSlug_"+p).val();
                  var newSpecificInstanceIPNS = jQuery("#ipns_si_"+p).val();
                  console.log("makeNewConceptButton, specificInstances; p: "+p+"; newSpecificInstanceSlug: "+newSpecificInstanceSlug);
                  // add relationship to schema
                  for (var x=0;x<numLinksThisSpecificInstance[p];x++) {
                      var slugForLink = jQuery("#siLinksToSelector_"+p+"_"+x+" option:selected ").val();
                      nextRel_obj = {}
                      nextRel_obj["nodeFrom"] = { "slug": newSpecificInstanceSlug };
                      nextRel_obj["relationshipType"] = { "slug": "isASpecificInstanceOf" };
                      nextRel_obj["nodeTo"] = { "slug": slugForLink };
                      if (!isRelObjInArrayOfObj(nextRel_obj,newSchema_obj["schemaData"]["relationships"]) ) {
                          newSchema_obj["schemaData"]["relationships"].push(nextRel_obj);
                      }
                  }
                  // add new set node to schema if not already present
                  var newSpecificInstance_obj = {};
                  newSpecificInstance_obj["slug"] = newSpecificInstanceSlug;
                  newSpecificInstance_obj["ipns"] = newSpecificInstanceIPNS;
                  if (!isWordObjInArrayOfObj(newSpecificInstance_obj,newSchema_obj["schemaData"]["nodes"])) {
                      newSchema_obj["schemaData"]["nodes"].push(newSpecificInstance_obj);
                  }
              }
          }

          ////////////////////////////////////////////////////////
          //////////////// MAKE SPECIFIC INSTANCES ///////////////
          jQuery("#specificInstances_container").html("");

          var lookupSpecificInstanceNumBySlug = {};
          var numSpecificInstances = newSpecificInstances_arr.length;
          // console.log("makeNewConceptButton, specificInstances; numSpecificInstances: "+numSpecificInstances);
          for (var p=0;p<numSpecificInstances;p++) {

              var specificInstanceSlug = jQuery("#siSlug_"+p).val();
              // if this word already exists, add to it; otherwise start with a blank "word" template
              if (lookupRawFileBySlug_obj.hasOwnProperty(specificInstanceSlug)) {
                  // console.log("making specificInstances; "+specificInstanceSlug+" already exists!")
                  var newSpecificInstance_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[specificInstanceSlug]));
              } else {
                  // console.log("making specificInstances; "+specificInstanceSlug+" does NOT already exist!")
                  var newSpecificInstance_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["word"]));
              }
              var newSpecificInstance_str = JSON.stringify(newSpecificInstance_obj,null,4)
              // console.log("---newSpecificInstance_str: "+newSpecificInstance_str);

              var specificInstanceTitle = jQuery("#siTitle_"+p).val();
              var specificInstanceName = jQuery("#siName_"+p).val();
              var specificInstanceDescription = jQuery("#siDescription_"+p).val();
              var specificInstanceKeyname = jQuery("#keyname_si_"+p).val();
              var specificInstanceIPNS = jQuery("#ipns_si_"+p).val();
              var siDelete = jQuery("#newSpecificInstanceDelete_"+p).prop("checked");

              /*
              if (lookupRawFileBySlug_obj.hasOwnProperty(specificInstanceSlug)) {
                  var newSpecificInstance_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[specificInstanceSlug]));
              } else {
                  var newSpecificInstance_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["word"]));
              }
              */

              if (siDelete==false) {
                  lookupSpecificInstanceNumBySlug[specificInstanceSlug]=p;

                  newSpecificInstance_obj["wordData"]["slug"] = specificInstanceSlug;
                  newSpecificInstance_obj["wordData"]["title"] = specificInstanceTitle;
                  newSpecificInstance_obj["wordData"]["name"] = specificInstanceName;
                  newSpecificInstance_obj["wordData"]["description"] = specificInstanceDescription;
                  newSpecificInstance_obj["wordData"]["wordType"] = slugForWordType;
                  newSpecificInstance_obj["wordData"]["wordTypes"].push(slugForWordType);

                  if (!newSpecificInstance_obj.hasOwnProperty(propertyPath)) {
                      newSpecificInstance_obj[propertyPath] = {}
                  }
                  newSpecificInstance_obj[propertyPath]["slug"] = specificInstanceSlug;
                  newSpecificInstance_obj[propertyPath]["title"] = specificInstanceTitle;
                  newSpecificInstance_obj[propertyPath]["name"] = specificInstanceName;
                  newSpecificInstance_obj[propertyPath]["description"] = specificInstanceDescription;

                  for (var x=0;x<numLinksThisSpecificInstance[p];x++) {
                      var siLinksTo = jQuery("#siLinksToSelector_"+p+"_"+x+" option:selected").val();
                      newSpecificInstance_obj["globalDynamicData"]["specificInstanceOf"].push(siLinksTo);
                  }

                  delete newSpecificInstance_obj["metaData"];
                  var gDD_obj = JSON.parse(JSON.stringify(newSpecificInstance_obj["globalDynamicData"]));
                  delete newSpecificInstance_obj["globalDynamicData"];
                  newSpecificInstance_obj["globalDynamicData"] = JSON.parse(JSON.stringify(gDD_obj));
                  newSpecificInstance_obj["globalDynamicData"]["myDictionaries"].push(myDictionary);
                  newSpecificInstance_obj["globalDynamicData"]["myConceptGraphs"].push(myConceptGraph);
                  newSpecificInstance_obj["metaData"] = {};
                  newSpecificInstance_obj["metaData"]["ipns"] = specificInstanceIPNS;

                  // eliminate duplicates from arrays of strings
                  newSpecificInstance_obj["globalDynamicData"]["myDictionaries"] = removeDuplicatesFromSimpleArray(newSpecificInstance_obj["globalDynamicData"]["myDictionaries"]);
                  newSpecificInstance_obj["globalDynamicData"]["myConceptGraphs"] = removeDuplicatesFromSimpleArray(newSpecificInstance_obj["globalDynamicData"]["myConceptGraphs"]);
                  newSpecificInstance_obj["globalDynamicData"]["specificInstanceOf"] = removeDuplicatesFromSimpleArray(newSpecificInstance_obj["globalDynamicData"]["specificInstanceOf"]);
                  newSpecificInstance_obj["wordData"]["wordTypes"] = removeDuplicatesFromSimpleArray(newSpecificInstance_obj["wordData"]["wordTypes"]);

                  var newSpecificInstance_str = JSON.stringify(newSpecificInstance_obj,null,4)
                  lookupRawFileBySlug_obj[specificInstanceSlug] = JSON.parse(JSON.stringify(newSpecificInstance_obj));

                  var siHTML = "<div class=singleSpecificInstanceWrapper >";
                  siHTML += "<div style=position:absolute;right:10px;top:5px;background-color:white; >SPECIFIC INSTANCE</div><br>";
                  siHTML += "<textarea id=siRawFile_"+p+" style=width:800px;height:200px;>";
                  siHTML += newSpecificInstance_str;
                  siHTML += "</textarea>";
                  siHTML += "</div>";

                  jQuery("#specificInstances_container").append(siHTML);
                  if (jQuery.inArray(specificInstanceSlug,newConcept_obj["globalDynamicData"]["specificInstances"]) > -1) {
                      newConcept_obj["globalDynamicData"]["specificInstances"].push(specificInstanceSlug);
                  }
                  if (jQuery.inArray(specificInstanceSlug,newSuperset_obj["globalDynamicData"]["specificInstances"]) > -1) {
                      newSuperset_obj["globalDynamicData"]["specificInstances"].push(specificInstanceSlug);
                  }
              }
          }

          //////////////// create sets for adding to schemaForProperties //////////////
          // qwerty
          var words_temp_obj = {}
          words_temp_obj[slugForProperties] = newProperties_obj;
          words_temp_obj[slugForPrimaryProperty] = newPrimaryProperty_obj;
          jQuery.each(propertyTypes,function(nextPropertyType,obj){
              // console.log("nextPropertyType: "+nextPropertyType+"; obj.applyTo.schemaForProperty: "+obj.applyTo.schemaForProperty)
              if (obj.applyTo.propertySchemas===true) {
                  var newWord_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["set"]));
                  var newWord_slug = slugForProperties+"_"+nextPropertyType;
                  var baseWord_slug = "properties_"+nextPropertyType
                  var newWord_title = titleForProperties+": "+nextPropertyType;
                  var newWord_name = nameForProperties+": "+nextPropertyType;
                  var newWord_ipns = jQuery("#ipns_propertySets_"+nextPropertyType).val();
                  var newWord_keyname = jQuery("#keyname_propertySets_"+nextPropertyType).val();
                  // var newConceptSingular = jQuery("#newConceptSingular").val()
                  // var slugForConcept = "conceptFor"+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
                  // var slugForProperties = "propertiesFor"+newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);

                  newWord_obj.wordData.slug = newWord_slug;
                  newWord_obj.wordData.title = newWord_title;
                  newWord_obj.wordData.name = newWord_name;

                  newWord_obj.setData.slug = newWord_slug;
                  newWord_obj.setData.title = newWord_title;
                  newWord_obj.setData.name = newWord_name;
                  newWord_obj.setData.metaData.types.push(nextPropertyType);
                  newWord_obj.setData.metaData.governingConcepts.push(slugForConcept);

                  newWord_obj.metaData.ipns = newWord_ipns;
                  newWord_obj.metaData.keyname = newWord_keyname;

                  newWord_obj.globalDynamicData.myDictionaries.push(myDictionary);
                  newWord_obj.globalDynamicData.myConceptGraphs.push(myConceptGraph);

                  var newWord_str = JSON.stringify(newWord_obj,null,4);
                  jQuery("#slugName_propertySets_"+nextPropertyType).html(newWord_slug);
                  jQuery("#rawFile_propertySets_"+nextPropertyType).html(newWord_str);

                  words_temp_obj[baseWord_slug] = lookupRawFileBySlug_obj[baseWord_slug];
                  words_temp_obj[newWord_slug] = newWord_obj;
                  words_temp_obj[newPropertySchema_obj.wordData.slug] = newPropertySchema_obj;
              }
          });
          // add relationships for propagateProperty and subsetOf
          jQuery.each(propertyTypes,function(nextPropertyType,obj){
              console.log("nextPropertyType: "+nextPropertyType+"; obj.applyTo.schemaForProperty: "+obj.applyTo.schemaForProperty)
              // check to see whether a set with the specified propertyType already exists; if not, add the corresponding promise function to array
              if (obj.applyTo.propertySchemas===true) {
                  var newWord_slug = slugForProperties+"_"+nextPropertyType;
                  var baseWord_slug = "properties_"+nextPropertyType
                  // add propagateProperty rel to propertySchema
                  var relToAdd_obj = MiscFunctions.blankRel_obj();
                  relToAdd_obj.nodeFrom.slug = baseWord_slug;
                  relToAdd_obj.relationshipType.slug = "propagateProperty";
                  relToAdd_obj.nodeTo.slug = newWord_slug;

                  newPropertySchema_obj = MiscFunctions.updateSchemaWithNewRel(newPropertySchema_obj,relToAdd_obj,words_temp_obj)

                  // add subsetOf rel to propertySchema
                  var whatIsThisSubsetOf = propertyTypes[nextPropertyType].subsetOf;
                  if (whatIsThisSubsetOf == "mainPropertiesSet") {
                      var whatIsThisSubsetOf_slug = slugForProperties;
                  } else {
                      var whatIsThisSubsetOf_slug = slugForProperties+"_"+whatIsThisSubsetOf;
                  }
                  var rel2ToAdd_obj = MiscFunctions.blankRel_obj();
                  rel2ToAdd_obj.nodeFrom.slug = newWord_slug;
                  rel2ToAdd_obj.relationshipType.slug = "subsetOf";
                  rel2ToAdd_obj.nodeTo.slug = whatIsThisSubsetOf_slug;
                  newPropertySchema_obj = MiscFunctions.updateSchemaWithNewRel(newPropertySchema_obj,rel2ToAdd_obj,words_temp_obj)
              }
          });
          // add primaryPropertyFor[Concept] to newPropertySchema_obj as well as isASpecificInstanceOf
          // slugForPrimaryProperty isASpecificInstanceOf propertiesFor[Concept]_primaryProperty
          var rel3ToAdd_obj = MiscFunctions.blankRel_obj();
          rel3ToAdd_obj.nodeFrom.slug = slugForPrimaryProperty;
          rel3ToAdd_obj.relationshipType.slug = "isASpecificInstanceOf";
          rel3ToAdd_obj.nodeTo.slug = slugForProperties+"_primaryProperty";
          newPropertySchema_obj = MiscFunctions.updateSchemaWithNewRel(newPropertySchema_obj,rel3ToAdd_obj,words_temp_obj)

          ////////////////// create 5+1 primary concept files ////////
          var newConcept_str = JSON.stringify(newConcept_obj,null,4);
          var newSuperset_str = JSON.stringify(newSuperset_obj,null,4);
          var newSchema_str = JSON.stringify(newSchema_obj,null,4);
          var newJSONSchema_str = JSON.stringify(newJSONSchema_obj,null,4);
          var newWordType_str = JSON.stringify(newWordType_obj,null,4);
          var newPropertySchema_str = JSON.stringify(newPropertySchema_obj,null,4);
          var newProperties_str = JSON.stringify(newProperties_obj,null,4);
          var newPrimaryProperty_str = JSON.stringify(newPrimaryProperty_obj,null,4);

          jQuery("#newConceptRawfile_concept").html(newConcept_str)
          jQuery("#newConceptRawfile_superset").html(newSuperset_str)
          jQuery("#newConceptRawfile_schema").html(newSchema_str)
          jQuery("#newConceptRawfile_JSONSchema").html(newJSONSchema_str)
          jQuery("#newConceptRawfile_wordType").html(newWordType_str)
          jQuery("#newConceptRawfile_propertySchema").html(newPropertySchema_str)
          jQuery("#newConceptRawfile_properties").html(newProperties_str)
          jQuery("#newConceptRawfile_primaryProperty").html(newPrimaryProperty_str)

      });
      jQuery("#insertOrUpdateNewConceptIntoTablesButton").click(function(){
          var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
          var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
          // console.log("insertOrUpdateNewConceptIntoTablesButton; currentConceptGraph_tableName: "+currentConceptGraph_tableName+"; currentDictionary_tableName:"+currentDictionary_tableName)

          // insert sets
          var numSets = newSets_arr.length;
          // console.log("inserting specific instances; numSets: "+numSets)
          for (var p=0;p<numSets;p++) {
              var setSlug = jQuery("#setSlug_"+p).val();
              var setTitle = jQuery("#setTitle_"+p).val();
              var setName = jQuery("#setName_"+p).val();
              var setKeyname = jQuery("#keyname_set_"+p).val();
              var setIPNS = jQuery("#ipns_set_"+p).val();
              var rawfile_str_x = jQuery("#setRawFile_"+p).val();
              var setDelete = jQuery("#newSetDelete_"+p).prop("checked");
              if (!setDelete) {
                  // console.log("specificInstanceRawFile_str "+rawfile_str_x);
                  insertOrUpdateWordIntoMyDictionary(myDictionary,rawfile_str_x,setSlug,setKeyname,setIPNS)
                  // console.log("inserting slug: "+setSlug+" into: "+myConceptGraph+"; rawfile_str_x: "+rawfile_str_x);
                  insertOrUpdateWordIntoMyConceptGraph(myConceptGraph,myDictionary,rawfile_str_x,setSlug,setKeyname,setIPNS);
              }
          }

          // insert specificInstances
          var numSpecificInstances = newSpecificInstances_arr.length;
          // console.log("inserting specific instances; numSpecificInstances: "+numSpecificInstances)
          for (var p=0;p<numSpecificInstances;p++) {
              var siSlug = jQuery("#siSlug_"+p).val();
              var siTitle = jQuery("#siTitle_"+p).val();
              var siName = jQuery("#siName_"+p).val();
              var siKeyname = jQuery("#keyname_si_"+p).val();
              var siIPNS = jQuery("#ipns_si_"+p).val();
              var rawfile_str_x = jQuery("#siRawFile_"+p).val();
              var siDelete = jQuery("#newSpecificInstanceDelete_"+p).prop("checked");
              if (!siDelete) {
                  // console.log("specificInstanceRawFile_str "+rawfile_str_x);
                  insertOrUpdateWordIntoMyDictionary(myDictionary,rawfile_str_x,siSlug,siKeyname,siIPNS)
                  // console.log("inserting slug: "+siSlug+" into: "+myConceptGraph+"; rawfile_str_x: "+rawfile_str_x);
                  insertOrUpdateWordIntoMyConceptGraph(myConceptGraph,myDictionary,rawfile_str_x,siSlug,siKeyname,siIPNS);
              }
          }

          // insert concept
          var slug = jQuery("#slug_concept").html()
          var keyname = jQuery("#keyname_concept").val()
          var ipns = jQuery("#ipns_concept").val()
          var rawfile_str_x = jQuery("#newConceptRawfile_concept").html()
          // console.log("insertOrUpdateNewConceptIntoTablesButton clicked; slug: "+slug+"; keyname: "+keyname+"; ipns: "+ipns+"; myDictionary: "+myDictionary+"; rawfile_str_x: "+rawfile_str_x)
          insertOrUpdateWordIntoMyDictionary(myDictionary,rawfile_str_x,slug,keyname,ipns)
          insertOrUpdateWordIntoMyConceptGraph(myConceptGraph,myDictionary,rawfile_str_x,slug,keyname,ipns);

          // insert superset
          var slug = jQuery("#slug_superset").html()
          var keyname = jQuery("#keyname_superset").val()
          var ipns = jQuery("#ipns_superset").val()
          var rawfile_str_x = jQuery("#newConceptRawfile_superset").html()
          // console.log("insertOrUpdateNewConceptIntoTablesButton clicked; slug: "+slug+"; keyname: "+keyname+"; ipns: "+ipns+"; myDictionary: "+myDictionary+"; rawfile_str_x: "+rawfile_str_x)
          insertOrUpdateWordIntoMyDictionary(myDictionary,rawfile_str_x,slug,keyname,ipns)
          insertOrUpdateWordIntoMyConceptGraph(myConceptGraph,myDictionary,rawfile_str_x,slug,keyname,ipns);

          // insert schema
          slug = jQuery("#slug_schema").html()
          keyname = jQuery("#keyname_schema").val()
          ipns = jQuery("#ipns_schema").val()
          rawfile_str_x = jQuery("#newConceptRawfile_schema").html()
          // console.log("insertOrUpdateNewConceptIntoTablesButton clicked; slug: "+slug+"; keyname: "+keyname+"; ipns: "+ipns+"; myDictionary: "+myDictionary+"; rawfile_str_x: "+rawfile_str_x)
          insertOrUpdateWordIntoMyDictionary(myDictionary,rawfile_str_x,slug,keyname,ipns)
          insertOrUpdateWordIntoMyConceptGraph(myConceptGraph,myDictionary,rawfile_str_x,slug,keyname,ipns);

          // insert JSONSchema
          slug = jQuery("#slug_JSONSchema").html()
          keyname = jQuery("#keyname_JSONSchema").val()
          ipns = jQuery("#ipns_JSONSchema").val()
          rawfile_str_x = jQuery("#newConceptRawfile_JSONSchema").html()
          // console.log("insertOrUpdateNewConceptIntoTablesButton clicked; slug: "+slug+"; keyname: "+keyname+"; ipns: "+ipns+"; myDictionary: "+myDictionary+"; rawfile_str_x: "+rawfile_str_x)
          insertOrUpdateWordIntoMyDictionary(myDictionary,rawfile_str_x,slug,keyname,ipns)
          insertOrUpdateWordIntoMyConceptGraph(myConceptGraph,myDictionary,rawfile_str_x,slug,keyname,ipns);

          // insert wordType
          slug = jQuery("#slug_wordType").html()
          keyname = jQuery("#keyname_wordType").val()
          ipns = jQuery("#ipns_wordType").val()
          rawfile_str_x = jQuery("#newConceptRawfile_wordType").html()
          // console.log("insertOrUpdateNewConceptIntoTablesButton clicked; slug: "+slug+"; keyname: "+keyname+"; ipns: "+ipns+"; myDictionary: "+myDictionary+"; rawfile_str_x: "+rawfile_str_x)
          insertOrUpdateWordIntoMyDictionary(myDictionary,rawfile_str_x,slug,keyname,ipns)
          insertOrUpdateWordIntoMyConceptGraph(myConceptGraph,myDictionary,rawfile_str_x,slug,keyname,ipns);

          // insert propertySchema
          slug = jQuery("#slug_propertySchema").html()
          keyname = jQuery("#keyname_propertySchema").val()
          ipns = jQuery("#ipns_propertySchema").val()
          rawfile_str_x = jQuery("#newConceptRawfile_propertySchema").html()
          // console.log("insertOrUpdateNewConceptIntoTablesButton clicked; slug: "+slug+"; keyname: "+keyname+"; ipns: "+ipns+"; myDictionary: "+myDictionary+"; rawfile_str_x: "+rawfile_str_x)
          insertOrUpdateWordIntoMyDictionary(myDictionary,rawfile_str_x,slug,keyname,ipns)
          insertOrUpdateWordIntoMyConceptGraph(myConceptGraph,myDictionary,rawfile_str_x,slug,keyname,ipns);

          // insert properties
          slug = jQuery("#slug_properties").html()
          var slugForProperties = slug;
          keyname = jQuery("#keyname_properties").val()
          ipns = jQuery("#ipns_properties").val()
          rawfile_str_x = jQuery("#newConceptRawfile_properties").html()
          // console.log("insertOrUpdateNewConceptIntoTablesButton clicked; slug: "+slug+"; keyname: "+keyname+"; ipns: "+ipns+"; myDictionary: "+myDictionary+"; rawfile_str_x: "+rawfile_str_x)
          insertOrUpdateWordIntoMyDictionary(myDictionary,rawfile_str_x,slug,keyname,ipns)
          insertOrUpdateWordIntoMyConceptGraph(myConceptGraph,myDictionary,rawfile_str_x,slug,keyname,ipns);

          // insert primaryProperty
          slug = jQuery("#slug_primaryProperty").html()
          keyname = jQuery("#keyname_primaryProperty").val()
          ipns = jQuery("#ipns_primaryProperty").val()
          rawfile_str_x = jQuery("#newConceptRawfile_primaryProperty").html()
          // console.log("insertOrUpdateNewConceptIntoTablesButton clicked; slug: "+slug+"; keyname: "+keyname+"; ipns: "+ipns+"; myDictionary: "+myDictionary+"; rawfile_str_x: "+rawfile_str_x)
          insertOrUpdateWordIntoMyDictionary(myDictionary,rawfile_str_x,slug,keyname,ipns)
          insertOrUpdateWordIntoMyConceptGraph(myConceptGraph,myDictionary,rawfile_str_x,slug,keyname,ipns);

          // insert sets into schemaForPropertiesFor[Concept]
          // qwerty
          jQuery.each(propertyTypes,function(nextPropertyType,obj){
              if (obj.applyTo.propertySchemas===true) {
                  var newWord_slug = slugForProperties+"_"+nextPropertyType;
                  var newWord_rF_str = jQuery("#rawFile_propertySets_"+nextPropertyType).html();
                  var newWord_rF_obj = JSON.parse(newWord_rF_str)
                  MiscFunctions.createOrUpdateWordInAllTables(newWord_rF_obj)
              }
          });


      });
      loadWordsIntoLookup();
      GenerateCompactConceptSummarySelector();
      jQuery("#clearFieldsCompactConceptSummary").click(function(){
          clearFieldsCompactConceptSummary();
      });
      jQuery("#loadCompactConceptSummary").click(function(){
          // var selectedConcept_wT_slug = jQuery("#compactConceptSummarySelector option:selected").val();
          var selectedConcept_wT_slug = jQuery("#compactConceptSummarySelector option:selected").data("slug");
          var selectedConcept_wT_rF_obj = lookupRawFileBySlug_obj[selectedConcept_wT_slug];
          if (!selectedConcept_wT_rF_obj.hasOwnProperty("wordTypeData")) {
              alert("wordTypeData is missing from "+selectedConcept_wT_slug)
          } else {
              var selectedConcept_concept_slug = selectedConcept_wT_rF_obj.wordTypeData.concept;
              // console.log("loadCompactConceptSummary; selectedConcept_wT_slug: "+selectedConcept_wT_slug+"; selectedConcept_concept_slug: "+selectedConcept_concept_slug);
              var selectedConcept_concept_rF_obj = lookupRawFileBySlug_obj[selectedConcept_concept_slug];
              var selectedConcept_superset_slug = selectedConcept_concept_rF_obj.conceptData.nodes.superset.slug;
              var selectedConcept_schema_slug = selectedConcept_concept_rF_obj.conceptData.nodes.schema.slug;
              var selectedConcept_JSONSchema_slug = selectedConcept_concept_rF_obj.conceptData.nodes.JSONSchema.slug;

              var selectedConcept_wordType_ipns = selectedConcept_concept_rF_obj.conceptData.nodes.wordType.ipns;
              var selectedConcept_concept_ipns = selectedConcept_concept_rF_obj.conceptData.nodes.concept.ipns;
              var selectedConcept_superset_ipns = selectedConcept_concept_rF_obj.conceptData.nodes.superset.ipns;
              var selectedConcept_schema_ipns = selectedConcept_concept_rF_obj.conceptData.nodes.schema.ipns;
              var selectedConcept_JSONSchema_ipns = selectedConcept_concept_rF_obj.conceptData.nodes.JSONSchema.ipns;

              var selectedConcept_propertySchema_slug = "";
              var selectedConcept_propertySchema_ipns = "";
              if (selectedConcept_concept_rF_obj.conceptData.nodes.hasOwnProperty("propertySchema")) {
                  selectedConcept_propertySchema_slug = selectedConcept_concept_rF_obj.conceptData.nodes.propertySchema.slug;
                  selectedConcept_propertySchema_ipns = selectedConcept_concept_rF_obj.conceptData.nodes.propertySchema.ipns;
              }

              var selectedConcept_properties_slug = "";
              var selectedConcept_properties_ipns = "";
              if (selectedConcept_concept_rF_obj.conceptData.nodes.hasOwnProperty("properties")) {
                  selectedConcept_properties_slug = selectedConcept_concept_rF_obj.conceptData.nodes.properties.slug;
                  selectedConcept_properties_ipns = selectedConcept_concept_rF_obj.conceptData.nodes.properties.ipns;
              }

              var selectedConcept_primaryProperty_slug = "";
              var selectedConcept_primaryProperty_ipns = "";
              if (selectedConcept_concept_rF_obj.conceptData.nodes.hasOwnProperty("primaryProperty")) {
                  selectedConcept_primaryProperty_slug = selectedConcept_concept_rF_obj.conceptData.nodes.primaryProperty.slug;
                  selectedConcept_primaryProperty_ipns = selectedConcept_concept_rF_obj.conceptData.nodes.primaryProperty.ipns;
              }

              jQuery("#ipns_wordType").val(selectedConcept_wordType_ipns);
              jQuery("#ipns_wordType").html(selectedConcept_wordType_ipns);
              jQuery("#ipns_superset").val(selectedConcept_superset_ipns);
              jQuery("#ipns_superset").html(selectedConcept_superset_ipns);
              jQuery("#ipns_schema").val(selectedConcept_schema_ipns);
              jQuery("#ipns_schema").html(selectedConcept_schema_ipns);
              jQuery("#ipns_JSONSchema").val(selectedConcept_JSONSchema_ipns);
              jQuery("#ipns_JSONSchema").html(selectedConcept_JSONSchema_ipns);
              jQuery("#ipns_concept").val(selectedConcept_concept_ipns);
              jQuery("#ipns_concept").html(selectedConcept_concept_ipns);
              jQuery("#ipns_propertySchema").val(selectedConcept_propertySchema_ipns);
              jQuery("#ipns_propertySchema").html(selectedConcept_propertySchema_ipns);
              jQuery("#ipns_properties").val(selectedConcept_properties_ipns);
              jQuery("#ipns_properties").html(selectedConcept_properties_ipns);
              jQuery("#ipns_primaryProperty").val(selectedConcept_primaryProperty_ipns);
              jQuery("#ipns_primaryProperty").html(selectedConcept_primaryProperty_ipns);

              jQuery("#newConceptSingular").val(selectedConcept_wT_slug);
              jQuery("#newConceptSingular").html(selectedConcept_wT_slug);
              jQuery("#newConceptPlural").val(selectedConcept_superset_slug);
              jQuery("#newConceptPlural").html(selectedConcept_superset_slug);

              newSets_arr = [];
              newSpecificInstances_arr = [];
              // newProperties_arr = [];

              if (selectedConcept_concept_rF_obj.hasOwnProperty("globalDynamicData")) {
                  newSets_arr = JSON.parse(JSON.stringify(selectedConcept_concept_rF_obj.globalDynamicData.sets));
                  newSpecificInstances_arr = selectedConcept_concept_rF_obj.globalDynamicData.specificInstances;
              }

              // add sets
              var numSets = newSets_arr.length;
              for (var s=0;s<numSets;s++) {
                  var nextSet_slug = newSets_arr[s];
                  // console.log("addSetButton; nextSet_slug: "+nextSet_slug)
                  addNextSetHTML(s,nextSet_slug);
              }

              // add specific instances
              var numSpecificInstances = newSpecificInstances_arr.length;
              for (var s=0;s<numSpecificInstances;s++) {
                  var nextSi_slug = newSpecificInstances_arr[s];
                  console.log("addSpecificInstanceButton; nextSi_slug: "+nextSi_slug)
                  addNextSpecificInstanceHTML(s,nextSi_slug);
              }
          }
      });
      jQuery("#reorganizeConceptButton").click(function(){
          // console.log("reorganizeConceptButton clicked")
          VisjsFunctions.reorganizeConcept_mainschema();
      })
      jQuery("#togglePanelAButton").click(function(){
          var panelVis = jQuery("#panelA").data("visibility");
          var bColor = jQuery(this).data("backgroundcolor");
          // console.log("togglePanelAButton clicked; panelVis: "+panelVis)
          if (panelVis=="visible") {
              jQuery("#panelA").data("visibility","invisible");
              jQuery("#panelA").css("display","none");
              jQuery("#togglePanelAButton").css("background-color",bColor);
              jQuery("#togglePanelAButton").css("color","grey");
              jQuery("#togglePanelAButton").css("border","2px solid grey");
          } else {
              jQuery("#panelA").data("visibility","visible");
              jQuery("#panelA").css("display","inline-block");
              jQuery("#togglePanelAButton").css("background-color","#DDFFDD");
              jQuery("#togglePanelAButton").css("color","#001100");
              jQuery("#togglePanelAButton").css("border","2px solid black");
          }
      })
      jQuery("#togglePanelBButton").click(function(){
          var panelVis = jQuery("#panelB").data("visibility");
          var bColor = jQuery(this).data("backgroundcolor");
          // console.log("togglePanelBButton clicked")
          if (panelVis=="visible") {
              jQuery("#panelB").data("visibility","invisible");
              jQuery("#panelB").css("display","none");
              jQuery("#togglePanelBButton").css("background-color",bColor);
              jQuery("#togglePanelBButton").css("color","grey");
              jQuery("#togglePanelBButton").css("border","2px solid grey");
          } else {
              jQuery("#panelB").data("visibility","visible");
              jQuery("#panelB").css("display","block");
              jQuery("#togglePanelBButton").css("background-color","#DDFFDD");
              jQuery("#togglePanelBButton").css("color","#001100");
              jQuery("#togglePanelBButton").css("border","2px solid black");
              // trigger CG Main Schema
              jQuery("#cgMainSchemaSlug").trigger("click");
          }
      })
      jQuery("#togglePanelCButton").click(function(){
          var panelVis = jQuery("#panelC").data("visibility");
          var bColor = jQuery(this).data("backgroundcolor");
          // console.log("togglePanelCButton clicked; bColor: "+bColor)
          if (panelVis=="visible") {
              jQuery("#panelC").data("visibility","invisible");
              jQuery("#panelC").css("display","none");
              jQuery("#togglePanelCButton").css("background-color",bColor);
              jQuery("#togglePanelCButton").css("color","grey");
              jQuery("#togglePanelCButton").css("border","2px solid grey");
          } else {
              jQuery("#panelC").data("visibility","visible");
              jQuery("#panelC").css("display","block");
              jQuery("#togglePanelCButton").css("background-color","#DDFFDD");
              jQuery("#togglePanelCButton").css("color","#001100");
              jQuery("#togglePanelCButton").css("border","2px solid black");
          }
          calculateFamilyUnit_B();
      })
      jQuery("#togglePanelDButton").click(function(){
          var panelVis = jQuery("#panelD").data("visibility");
          var bColor = jQuery(this).data("backgroundcolor");
          // console.log("togglePanelDButton clicked")
          if (panelVis=="visible") {
              jQuery("#panelD").data("visibility","invisible");
              jQuery("#panelD").css("display","none");
              jQuery("#togglePanelDButton").css("background-color",bColor);
              jQuery("#togglePanelDButton").css("color","grey");
              jQuery("#togglePanelDButton").css("border","2px solid grey");
          } else {
              jQuery("#panelD").data("visibility","visible");
              jQuery("#panelD").css("display","block");
              jQuery("#togglePanelDButton").css("background-color","#DDFFDD");
              jQuery("#togglePanelDButton").css("color","#001100");
              jQuery("#togglePanelDButton").css("border","2px solid black");
          }
      })
      jQuery("#togglePanelEButton").click(function(){
          var panelVis = jQuery("#panelE").data("visibility");
          var bColor = jQuery(this).data("backgroundcolor");
          // console.log("togglePanelEButton clicked")
          if (panelVis=="visible") {
              jQuery("#panelE").data("visibility","invisible");
              jQuery("#panelE").css("display","none");
              jQuery("#togglePanelEButton").css("background-color",bColor);
              jQuery("#togglePanelEButton").css("color","grey");
              jQuery("#togglePanelEButton").css("border","2px solid grey");
          } else {
              jQuery("#panelE").data("visibility","visible");
              jQuery("#panelE").css("display","block");
              jQuery("#togglePanelEButton").css("background-color","#DDFFDD");
              jQuery("#togglePanelEButton").css("color","#001100");
              jQuery("#togglePanelEButton").css("border","2px solid black");
          }
      })
      jQuery("#togglePanelFButton").click(function(){
          var panelVis = jQuery("#panelF").data("visibility");
          var bColor = jQuery(this).data("backgroundcolor");
          // console.log("togglePanelFButton clicked")
          if (panelVis=="visible") {
              jQuery("#panelF").data("visibility","invisible");
              jQuery("#panelF").css("display","none");
              jQuery("#togglePanelFButton").css("background-color",bColor);
              jQuery("#togglePanelFButton").css("color","grey");
              jQuery("#togglePanelFButton").css("border","2px solid grey");
          } else {
              jQuery("#panelF").data("visibility","visible");
              jQuery("#panelF").css("display","block");
              jQuery("#togglePanelFButton").css("background-color","#DDFFDD");
              jQuery("#togglePanelFButton").css("color","#001100");
              jQuery("#togglePanelFButton").css("border","2px solid black");
          }
      })
      jQuery("#togglePanelGButton").click(function(){
          var panelVis = jQuery("#panelG").data("visibility");
          var bColor = jQuery(this).data("backgroundcolor");
          // console.log("togglePanelGButton clicked")
          if (panelVis=="visible") {
              jQuery("#panelG").data("visibility","invisible");
              jQuery("#panelG").css("display","none");
              jQuery("#togglePanelGButton").css("background-color",bColor);
              jQuery("#togglePanelGButton").css("color","grey");
              jQuery("#togglePanelGButton").css("border","2px solid grey");
          } else {
              jQuery("#panelG").data("visibility","visible");
              jQuery("#panelG").css("display","block");
              jQuery("#togglePanelGButton").css("background-color","#DDFFDD");
              jQuery("#togglePanelGButton").css("color","#001100");
              jQuery("#togglePanelGButton").css("border","2px solid black");
          }
      })
      jQuery("#togglePanelHButton").click(function(){
          var panelVis = jQuery("#panelH").data("visibility");
          var bColor = jQuery(this).data("backgroundcolor");
          // console.log("togglePanelHButton clicked")
          if (panelVis=="visible") {
              jQuery("#panelH").data("visibility","invisible");
              jQuery("#panelH").css("display","none");
              jQuery("#togglePanelHButton").css("background-color",bColor);
              jQuery("#togglePanelHButton").css("color","grey");
              jQuery("#togglePanelHButton").css("border","2px solid grey");
          } else {
              jQuery("#panelH").data("visibility","visible");
              jQuery("#panelH").css("display","block");
              jQuery("#togglePanelHButton").css("background-color","#DDFFDD");
              jQuery("#togglePanelHButton").css("color","#001100");
              jQuery("#togglePanelHButton").css("border","2px solid black");
          }
      })
      jQuery("#togglePanelIButton").click(function(){
          var panelVis = jQuery("#panelI").data("visibility");
          var bColor = jQuery(this).data("backgroundcolor");
          // console.log("togglePanelIButton clicked")
          if (panelVis=="visible") {
              jQuery("#panelI").data("visibility","invisible");
              jQuery("#panelI").css("display","none");
              jQuery("#togglePanelIButton").css("background-color",bColor);
              jQuery("#togglePanelIButton").css("color","grey");
              jQuery("#togglePanelIButton").css("border","2px solid grey");
          } else {
              jQuery("#panelI").data("visibility","visible");
              jQuery("#panelI").css("display","block");
              jQuery("#togglePanelIButton").css("background-color","#DDFFDD");
              jQuery("#togglePanelIButton").css("color","#001100");
              jQuery("#togglePanelIButton").css("border","2px solid black");
          }
      })
      jQuery("#togglePanelJButton").click(function(){
          var panelVis = jQuery("#panelJ").data("visibility");
          var bColor = jQuery(this).data("backgroundcolor");
          // console.log("togglePanelJButton clicked")
          if (panelVis=="visible") {
              jQuery("#panelJ").data("visibility","invisible");
              jQuery("#panelJ").css("display","none");
              jQuery("#togglePanelJButton").css("background-color",bColor);
              jQuery("#togglePanelJButton").css("color","grey");
              jQuery("#togglePanelJButton").css("border","2px solid grey");
          } else {
              jQuery("#panelJ").data("visibility","visible");
              jQuery("#panelJ").css("display","block");
              jQuery("#togglePanelJButton").css("background-color","#DDFFDD");
              jQuery("#togglePanelJButton").css("color","#001100");
              jQuery("#togglePanelJButton").css("border","2px solid black");
          }
      })
      jQuery("#togglePanelKButton").click(function(){
          var panelVis = jQuery("#panelK").data("visibility");
          var bColor = jQuery(this).data("backgroundcolor");
          // console.log("togglePanelKButton clicked")
          if (panelVis=="visible") {
              jQuery("#panelK").data("visibility","invisible");
              jQuery("#panelK").css("display","none");
              jQuery("#togglePanelKButton").css("background-color",bColor);
              jQuery("#togglePanelKButton").css("color","grey");
              jQuery("#togglePanelKButton").css("border","2px solid grey");
          } else {
              jQuery("#panelK").data("visibility","visible");
              jQuery("#panelK").css("display","block");
              jQuery("#togglePanelKButton").css("background-color","#DDFFDD");
              jQuery("#togglePanelKButton").css("color","#001100");
              jQuery("#togglePanelKButton").css("border","2px solid black");
          }
      })
      jQuery("#togglePanelLButton").click(function(){
          var panelVis = jQuery("#panelL").data("visibility");
          var bColor = jQuery(this).data("backgroundcolor");
          // console.log("togglePanelLButton clicked")
          if (panelVis=="visible") {
              jQuery("#panelL").data("visibility","invisible");
              jQuery("#panelL").css("display","none");
              jQuery("#togglePanelLButton").css("background-color",bColor);
              jQuery("#togglePanelLButton").css("color","grey");
              jQuery("#togglePanelLButton").css("border","2px solid grey");
          } else {
              jQuery("#panelL").data("visibility","visible");
              jQuery("#panelL").css("display","block");
              jQuery("#togglePanelLButton").css("background-color","#DDFFDD");
              jQuery("#togglePanelLButton").css("color","#001100");
              jQuery("#togglePanelLButton").css("border","2px solid black");
          }
      })
      jQuery("#togglePanelMButton").click(function(){
          var panelVis = jQuery("#panelM").data("visibility");
          var bColor = jQuery(this).data("backgroundcolor");
          // console.log("togglePanelMButton clicked")
          if (panelVis=="visible") {
              jQuery("#panelM").data("visibility","invisible");
              jQuery("#panelM").css("display","none");
              jQuery("#togglePanelMButton").css("background-color",bColor);
              jQuery("#togglePanelMButton").css("color","grey");
              jQuery("#togglePanelMButton").css("border","2px solid grey");
          } else {
              jQuery("#panelM").data("visibility","visible");
              jQuery("#panelM").css("display","block");
              jQuery("#togglePanelMButton").css("background-color","#DDFFDD");
              jQuery("#togglePanelMButton").css("color","#001100");
              jQuery("#togglePanelMButton").css("border","2px solid black");
          }
      })
      jQuery("#togglePanelNButton").click(function(){
          var panelVis = jQuery("#panelN").data("visibility");
          var bColor = jQuery(this).data("backgroundcolor");
          // console.log("togglePanelNButton clicked")
          if (panelVis=="visible") {
              jQuery("#panelN").data("visibility","invisible");
              jQuery("#panelN").css("display","none");
              jQuery("#togglePanelNButton").css("background-color",bColor);
              jQuery("#togglePanelNButton").css("color","grey");
              jQuery("#togglePanelNButton").css("border","2px solid grey");
          } else {
              jQuery("#panelN").data("visibility","visible");
              jQuery("#panelN").css("display","block");
              jQuery("#togglePanelNButton").css("background-color","#DDFFDD");
              jQuery("#togglePanelNButton").css("color","#001100");
              jQuery("#togglePanelNButton").css("border","2px solid black");
          }
      })
      jQuery("#togglePanelOButton").click(function(){
          var panelVis = jQuery("#panelO").data("visibility");
          var bColor = jQuery(this).data("backgroundcolor");
          // console.log("togglePanelOButton clicked")
          if (panelVis=="visible") {
              jQuery("#panelO").data("visibility","invisible");
              jQuery("#panelO").css("display","none");
              jQuery("#togglePanelOButton").css("background-color",bColor);
              jQuery("#togglePanelOButton").css("color","grey");
              jQuery("#togglePanelOButton").css("border","2px solid grey");
          } else {
              jQuery("#panelO").data("visibility","visible");
              jQuery("#panelO").css("display","block");
              jQuery("#togglePanelOButton").css("background-color","#DDFFDD");
              jQuery("#togglePanelOButton").css("color","#001100");
              jQuery("#togglePanelOButton").css("border","2px solid black");
          }
      })
      jQuery("#togglePanelPButton").click(function(){
          var panelVis = jQuery("#panelP").data("visibility");
          var bColor = jQuery(this).data("backgroundcolor");
          // console.log("togglePanelPButton clicked")
          if (panelVis=="visible") {
              jQuery("#panelP").data("visibility","invisible");
              jQuery("#panelP").css("display","none");
              jQuery("#togglePanelPButton").css("background-color",bColor);
              jQuery("#togglePanelPButton").css("color","grey");
              jQuery("#togglePanelPButton").css("border","2px solid grey");
          } else {
              jQuery("#panelP").data("visibility","visible");
              jQuery("#panelP").css("display","block");
              jQuery("#togglePanelPButton").css("background-color","#DDFFDD");
              jQuery("#togglePanelPButton").css("color","#001100");
              jQuery("#togglePanelPButton").css("border","2px solid black");
          }
      })

      jQuery("#togglePanelQButton").click(function(){
          var panelVis = jQuery("#panelQ").data("visibility");
          var bColor = jQuery(this).data("backgroundcolor");
          // console.log("togglePanelQButton clicked")
          if (panelVis=="visible") {
              jQuery("#panelQ").data("visibility","invisible");
              jQuery("#panelQ").css("display","none");
              jQuery("#togglePanelQButton").css("background-color",bColor);
              jQuery("#togglePanelQButton").css("color","grey");
              jQuery("#togglePanelQButton").css("border","2px solid grey");
          } else {
              jQuery("#panelQ").data("visibility","visible");
              jQuery("#panelQ").css("display","block");
              jQuery("#togglePanelQButton").css("background-color","#DDFFDD");
              jQuery("#togglePanelQButton").css("color","#001100");
              jQuery("#togglePanelQButton").css("border","2px solid black");
          }
      })

      jQuery("#propertyType1Button").click(function(){
          // console.log("propertyType1Button clicked")
          var currState = jQuery("#propertyType1Panel").data("state");
          if (currState=="visible") {
              jQuery("#propertyType1Panel").data("state","invisible");
              jQuery("#propertyType1Panel").css("display","none");
              jQuery("#propertyType1Button").css("border","2px solid grey");
              jQuery("#propertyType1Button").css("background-color","#EFEFEF");
              jQuery("#propertyType1Button").css("color","grey");
          } else {
              jQuery("#propertyType1Panel").data("state","visible");
              jQuery("#propertyType1Panel").css("display","block");
              jQuery("#propertyType1Button").css("border","2px solid black");
              jQuery("#propertyType1Button").css("background-color","#DDFFDD");
              jQuery("#propertyType1Button").css("color","#001100");
              setPropertyType1Checkboxes();
          }
      })
      jQuery("#propertyType2Button").click(function(){
          // console.log("propertyType2Button clicked")
          var currState = jQuery("#propertyType2Panel").data("state");
          if (currState=="visible") {
              jQuery("#propertyType2Panel").data("state","invisible");
              jQuery("#propertyType2Panel").css("display","none");
              jQuery("#propertyType2Button").css("border","2px solid grey");
              jQuery("#propertyType2Button").css("background-color","#EFEFEF");
              jQuery("#propertyType2Button").css("color","grey");
          } else {
              jQuery("#propertyType2Panel").data("state","visible");
              jQuery("#propertyType2Panel").css("display","block");
              jQuery("#propertyType2Button").css("border","2px solid black");
              jQuery("#propertyType2Button").css("background-color","#DDFFDD");
              jQuery("#propertyType2Button").css("color","#001100");
          }
      })
      jQuery("#propertyType3Button").click(function(){
          // console.log("propertyType3Button clicked")
          var currState = jQuery("#propertyType3Panel").data("state");
          if (currState=="visible") {
              jQuery("#propertyType3Panel").data("state","invisible");
              jQuery("#propertyType3Panel").css("display","none");
              jQuery("#propertyType3Button").css("border","2px solid grey");
              jQuery("#propertyType3Button").css("background-color","#EFEFEF");
              jQuery("#propertyType3Button").css("color","grey");
          } else {
              jQuery("#propertyType3Panel").data("state","visible");
              jQuery("#propertyType3Panel").css("display","block");
              jQuery("#propertyType3Button").css("border","2px solid black");
              jQuery("#propertyType3Button").css("background-color","#DDFFDD");
              jQuery("#propertyType3Button").css("color","#001100");
          }
      })
      jQuery("#propertyType1Panel").change(function(){
          calculateFamilyUnit_B();
      });
      jQuery("#propertyType2Panel").change(function(){
          calculateFamilyUnit_B();
      });
      jQuery("#propertyType3Panel").change(function(){
          calculateFamilyUnit_B();
      });

      jQuery("#addNewPropertyType1Button").click(function(){
          var numCustomProps = newCustomPropsType1_arr.length;
          // console.log("addNewPropertyType1Button clicked")
          var newPropHTML = "";
          var nextProp = "";
          newCustomPropsType1_arr.push(nextProp);
          newPropHTML += "<div data-customprop1num="+numCustomProps+" >";
          newPropHTML += "<input id='customProp1checkbox_"+numCustomProps+"' data-customprop1num="+numCustomProps+" type=checkbox /> ";
          newPropHTML += "<textarea id='customProp1name_"+numCustomProps+"' data-customprop1num="+numCustomProps+" >";
          newPropHTML += "</textarea>";
          newPropHTML += "</div>";
          jQuery("#addNewPropertyType1Container").append(newPropHTML)
      });
      jQuery("#updateJSONSchema").click(function(){
          // console.log("updateJSONSchema clicked")

          var selectedTable = jQuery("#myConceptGraphSelector option:selected").data("tablename");

          var JSONSchema_rF_str = jQuery("#JSONSchema_rawFile_parent_B").val();

          var JSONSchema_rF_obj = JSON.parse(JSONSchema_rF_str);
          var jsIpns = JSONSchema_rF_obj.metaData.ipns;
          var slug = JSONSchema_rF_obj.wordData.slug;
          var sql = "";
          sql += " UPDATE "+selectedTable;
          sql += " SET rawFile ='"+JSONSchema_rF_str+"' ";
          sql += " WHERE slug ='"+slug+"' ";
          // console.log("sql: "+sql)
          sendAsync(sql);
      });
      jQuery("#updateJSONSchema_new").click(function(){
          // console.log("updateJSONSchema_new clicked")
          jQuery("#updateJSONSchema_new").css("backgroundColor","white");
          jQuery("#updateJSONSchema_old").css("backgroundColor","grey");
          jQuery("#JSONSchema_rawFile_parent_B").css("display","block");
          jQuery("#JSONSchema_rawFile_parent_B_old").css("display","none");
      });
      jQuery("#updateJSONSchema_old").click(function(){
          // console.log("updateJSONSchema_old clicked")
          jQuery("#updateJSONSchema_new").css("backgroundColor","grey");
          jQuery("#updateJSONSchema_old").css("backgroundColor","white");
          jQuery("#JSONSchema_rawFile_parent_B").css("display","none");
          jQuery("#JSONSchema_rawFile_parent_B_old").css("display","block");
      });
      jQuery("#conceptGraphMainSchemaInfoToggle").click(function(){
          // console.log("conceptGraphMainSchemaInfoToggle clicked")
          var currentState = jQuery(this).data("currentstate");
          if (currentState=="invisible") {
              jQuery(this).data("currentstate","visible");
              jQuery("#conceptGraphMainSchemaInfoContainer").css("display","block")
          } else {
              jQuery(this).data("currentstate","invisible");
              jQuery("#conceptGraphMainSchemaInfoContainer").css("display","none")
          }
      });
      jQuery("#propertyTreeSchemaInfoToggle").click(function(){
          // console.log("propertyTreeSchemaInfoToggle clicked")
          var currentState = jQuery(this).data("currentstate");
          if (currentState=="invisible") {
              jQuery(this).data("currentstate","visible");
              jQuery("#propertyTreeSchemaInfoContainer").css("display","block")
          } else {
              jQuery(this).data("currentstate","invisible");
              jQuery("#propertyTreeSchemaInfoContainer").css("display","none")
          }
      });
      jQuery("#addc2cRelationshipButton").click(function(){
          var concept1_slug = jQuery("#conceptSelector1 option:selected").data("slug");
          var concept2_slug = jQuery("#conceptSelector2 option:selected").data("slug");
          var concept1_rF_obj = lookupRawFileBySlug_obj[concept1_slug];
          var concept2_rF_obj = lookupRawFileBySlug_obj[concept2_slug];
          var concept1_ipns = concept1_rF_obj.metaData.ipns;
          var concept2_ipns = concept2_rF_obj.metaData.ipns;
          var c2cRS = jQuery("#c2cRelSelector option:selected").data("c2crelslug");
          // console.log("addc2cRelationshipButton clicked; c2cRS: "+c2cRS+"; concept1_slug: "+concept1_slug+"; concept2_slug: "+concept2_slug)
          var mainSchema_rW_str = jQuery("#showFileEditedPanel").html();
          var mainSchema_rW_obj = JSON.parse(mainSchema_rW_str);

          // add c2c relationship
          var newRel_obj = {};
          newRel_obj.nodeFrom = {};
          newRel_obj.relationshipType = {};
          newRel_obj.nodeTo = {};
          newRel_obj.nodeFrom.slug = concept1_slug;
          newRel_obj.relationshipType.slug = c2cRS;
          newRel_obj.nodeTo.slug = concept2_slug;
          if (!MiscFunctions.isRelObjInArrayOfObj(newRel_obj,mainSchema_rW_obj.schemaData.relationships)) {
              mainSchema_rW_obj.schemaData.relationships.push(newRel_obj);
          }
          var newNode_nF_obj = {};
          var newNode_nT_obj = {};
          newNode_nF_obj.slug = concept1_slug;
          newNode_nF_obj.ipns = concept1_ipns;
          newNode_nT_obj.slug = concept2_slug;
          newNode_nT_obj.ipns = concept2_ipns;
          if (!MiscFunctions.isWordObjInArrayOfObj(newNode_nF_obj,mainSchema_rW_obj.schemaData.nodes)) {
              mainSchema_rW_obj.schemaData.nodes.push(newNode_nF_obj);
          }
          if (!MiscFunctions.isWordObjInArrayOfObj(newNode_nT_obj,mainSchema_rW_obj.schemaData.nodes)) {
              mainSchema_rW_obj.schemaData.nodes.push(newNode_nT_obj);
          }
          var mainSchema_rW_updated_str = JSON.stringify(mainSchema_rW_obj,null,4);
          jQuery("#showFileEditedPanel").val(mainSchema_rW_updated_str);
          jQuery("#showFileEditedPanel").html(mainSchema_rW_updated_str);

          // add standard relationship
          var standardSchema_slug = jQuery("#standardRelWord2Sel option:selected").data("thisconceptschemaslug");
          var standardRS = jQuery("#standardRelSelector option:selected").data("standardrelslug");
          var standard1_slug = jQuery("#standardRelWord1Sel option:selected").html();
          var standard2_slug = jQuery("#standardRelWord2Sel option:selected").html();
          // console.log("adding standard relationship; standardSchema_slug: "+standardSchema_slug+"; standard1_slug: "+standard1_slug+"; standard2_slug: "+standard2_slug)
          var standard1_rF_obj = lookupRawFileBySlug_obj[standard1_slug];
          var standard2_rF_obj = lookupRawFileBySlug_obj[standard2_slug];
          var standard1_ipns = standard1_rF_obj.metaData.ipns;
          var standard2_ipns = standard2_rF_obj.metaData.ipns;

          var newRel_standard_obj = {};
          newRel_standard_obj.nodeFrom = {};
          newRel_standard_obj.relationshipType = {};
          newRel_standard_obj.nodeTo = {};
          newRel_standard_obj.nodeFrom.slug = standard1_slug;
          newRel_standard_obj.relationshipType.slug = standardRS;
          newRel_standard_obj.nodeTo.slug = standard2_slug;
          if (!MiscFunctions.isRelObjInArrayOfObj(newRel_standard_obj,lookupRawFileBySlug_obj.edited[standardSchema_slug].schemaData.relationships)) {
              lookupRawFileBySlug_obj.edited[standardSchema_slug].schemaData.relationships.push(newRel_standard_obj);
          }
          var newNode_nF_standard_obj = {};
          var newNode_nT_standard_obj = {};
          newNode_nF_standard_obj.slug = standard1_slug;
          newNode_nF_standard_obj.ipns = standard1_ipns;
          newNode_nT_standard_obj.slug = standard2_slug;
          newNode_nT_standard_obj.ipns = standard2_ipns;
          if (!MiscFunctions.isWordObjInArrayOfObj(newNode_nF_standard_obj,lookupRawFileBySlug_obj.edited[standardSchema_slug].schemaData.nodes)) {
              lookupRawFileBySlug_obj.edited[standardSchema_slug].schemaData.nodes.push(newNode_nF_standard_obj);
          }
          if (!MiscFunctions.isWordObjInArrayOfObj(newNode_nT_standard_obj,lookupRawFileBySlug_obj.edited[standardSchema_slug].schemaData.nodes)) {
              lookupRawFileBySlug_obj.edited[standardSchema_slug].schemaData.nodes.push(newNode_nT_standard_obj);
          }
      });
      jQuery("#cgMainSchemaSlug").click(function(){
          var cgMainSchemaSlug = jQuery(this).data("slug");
          var cgMainSchema_rF_obj = lookupRawFileBySlug_obj[cgMainSchemaSlug];
          var cgMainSchema_rF_str = JSON.stringify(cgMainSchema_rF_obj,null,4)
          // console.log("cgMainSchemaSlug clicked; cgMainSchemaSlug: "+cgMainSchemaSlug+"; cgMainSchema_rF_str: "+cgMainSchema_rF_str)
          jQuery("#showFilePanel").val(cgMainSchema_rF_str);
          jQuery("#showFilePanel").html(cgMainSchema_rF_str);
          jQuery("#showFileEditedPanel").val(cgMainSchema_rF_str);
          jQuery("#showFileEditedPanel").html(cgMainSchema_rF_str);
      });
      jQuery("#showMainSchemaForConceptGraphButton").click(function(){
          var cgMainSchemaSlug = jQuery("#cgMainSchemaSlug").data("slug");
          // console.log("showMainSchemaForConceptGraphButton clicked; cgMainSchemaSlug: "+cgMainSchemaSlug)
          makeVisGraph_mSCG(cgMainSchemaSlug);
      });
      jQuery("#showPropertyTreeSchemaButton").click(function(){
          var propertyTreeSchemaSlug = jQuery("#propertyTreeSchemaSlug").data("slug");
          // console.log("showPropertyTreeSchemaButton clicked; propertyTreeSchemaSlug: "+propertyTreeSchemaSlug)
          var networkElemID = 'network_buildConceptPage';
          VisjsFunctions.makeVisGraph_propertySchema(propertyTreeSchemaSlug,networkElemID);
      });
      jQuery("#showFileUneditedButton").click(function(){
          // console.log("showFileUneditedButton clicked; ")
          jQuery("#showFilePanel").css("display","inline-block");
          jQuery("#showFileEditedPanel").css("display","none");
      });
      jQuery("#showFileEditedButton").click(function(){
          // console.log("showFileEditedButton clicked; ")
          jQuery("#showFilePanel").css("display","none");
          jQuery("#showFileEditedPanel").css("display","inline-block");
      });
      jQuery("#showFileUpdateButton").click(function(){
          var mainSchema_rF_str = jQuery("#showFileEditedPanel").html();
          var mainSchema_rF_obj = JSON.parse(mainSchema_rF_str);
          var mainSchema_slug = mainSchema_rF_obj.wordData.slug;
          var mainSchema_ipns = mainSchema_rF_obj.metaData.ipns;
          // console.log("showFileUpdateButton clicked; mainSchema_slug: "+mainSchema_slug+"; mainSchema_ipns: "+mainSchema_ipns+"; mainSchema_rF_str: "+mainSchema_rF_str)
          var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
          var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
          var sql1 = "";
          sql1 += " UPDATE "+myConceptGraph;
          sql1 += " SET rawFile ='"+mainSchema_rF_str+"' ";
          sql1 += " WHERE slug ='"+mainSchema_slug+"' ";
          // console.log("sql1: "+sql1)
          var sql2 = "";
          sql2 += " UPDATE "+myDictionary;
          sql2 += " SET rawFile ='"+mainSchema_rF_str+"' ";
          sql2 += " WHERE ipns ='"+mainSchema_ipns+"' ";
          // console.log("sql2: "+sql2)
          sendAsync(sql1);
          sendAsync(sql2);
      });

      jQuery("#c2cRelSelector").change(function(){
          var newValue = jQuery(this).val();
          // console.log("newValue: "+newValue);
          jQuery("#standardRelSelector").val(newValue);
          changeStandardRelsSelectorBox(newValue)
      });
      jQuery("#standardRelSelector").change(function(){
          var newValue = jQuery(this).val();
          // console.log("newValue: "+newValue)
          jQuery("#c2cRelSelector").val(newValue);
          changeStandardRelsSelectorBox(newValue)
      });
      jQuery("#newConceptQuickAddButton").click(function(){
          var newConcept_singular = jQuery("#newConceptSingular_quickAdd").val();
          var newConcept_plural = jQuery("#newConceptPlural_quickAdd").val();
          console.log("newConceptQuickAddButton clicked; newConcept_singular: "+newConcept_singular+"; newConcept_plural: "+newConcept_plural)
          if ( (!newConcept_singular) || (!newConcept_plural) ) {
              alert("fields must not be empty")
          } else {
              // alert("OK to proceed")
              jQuery("#newConceptSingular").val(newConcept_singular);
              jQuery("#newConceptSingular").html(newConcept_singular);
              jQuery("#newConceptPlural").val(newConcept_plural);
              jQuery("#newConceptPlural").html(newConcept_plural);
              jQuery("#createKeynames").trigger("click");
              jQuery("#createIPNS").trigger("click");

              var iterNum = 0;
              // Need to make sure asynchronous creation of all five IPNS is complete before making word rawFiles
              // The setInterval technique below works although it's not exactly elegant
              // Ought to use callback or await
              var myVar = setInterval(function(){
                  iterNum++;
                  // console.log("iterNum: "+iterNum)
                  var currentIpns_concept = jQuery("#ipns_concept").val();
                  var currentIpns_superset = jQuery("#ipns_superset").val();
                  var currentIpns_schema = jQuery("#ipns_schema").val();
                  var currentIpns_JSONSchema = jQuery("#ipns_JSONSchema").val();
                  var currentIpns_wordType = jQuery("#ipns_wordType").val();
                  var currentIpns_propertySchema = jQuery("#ipns_propertySchema").val();
                  var currentIpns_properties = jQuery("#ipns_properties").val();
                  var currentIpns_primaryProperty = jQuery("#ipns_primaryProperty").val();
                  if ( (currentIpns_concept) && (currentIpns_superset) && (currentIpns_schema) && (currentIpns_JSONSchema) && (currentIpns_wordType) && (currentIpns_propertySchema) && (currentIpns_properties) && (currentIpns_primaryProperty) ) {
                      clearInterval(myVar);
                      jQuery("#makeNewConceptButton").trigger("click");
                      jQuery("#insertOrUpdateNewConceptIntoTablesButton").trigger("click");
                      jQuery("#clearFieldsCompactConceptSummary").trigger("click");
                  }
                  if (iterNum > 50) {
                      clearInterval(myVar);
                  }
              }, 4000);
          }
      })
      jQuery("#propType2_addC2cRelToCGMainSchemaButton").click(function(){
          var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
          var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
          var cgMainSchema_slug = jQuery("#cgMainSchemaSlug").val();
          var c2cRel_str = jQuery("#propertyType2_c2cRel_rF").val();
          var c2cRel_obj = JSON.parse(c2cRel_str);
          // console.log("propType2_addC2cRelToCGMainSchemaButton clicked; updating cgMainSchema_slug: "+cgMainSchema_slug)

          var cgMainSchema_edited_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[cgMainSchema_slug]));
          var cgMainSchema_ed_updated_obj = MiscFunctions.updateSchemaWithNewRel(cgMainSchema_edited_obj,c2cRel_obj,lookupRawFileBySlug_obj);
          var cgMainSchema_ed_updated_str = JSON.stringify(cgMainSchema_ed_updated_obj,null,4);
          // console.log("cgMainSchema_ed_updated_str: "+cgMainSchema_ed_updated_str);
          MiscFunctions.updateWordInAllTables(cgMainSchema_ed_updated_obj);
          lookupRawFileBySlug_obj.edited[cgMainSchema_slug] = JSON.parse(JSON.stringify(cgMainSchema_edited_obj));
      });
      jQuery("#addType2PropertyRelsButton").click(function(){
          // console.log("addType2PropertyRelsButton clicked")
      });
      jQuery("#createNewPropertyButton").click(function(){
          createNewProperty();
      })
      jQuery("#createNewPropertyRelationshipButton").click(function(){
          createNewPropertyRelationship();
      })
      jQuery("#calculatePropConceptGraphStyleButton").click(function(){
          calculatePropConceptGraphStyle();
      })
      jQuery("#clearPropConceptGraphStyleButton").click(function(){
          clearPropConceptGraphStyle();
      })
      jQuery("#calculatePropJSONSchemaStyleButton").click(function(){
          calculatePropJSONSchemaStyle();
      })
      jQuery("#clearPropJSONSchemaStyleButton").click(function(){
          clearPropJSONSchemaStyle();
      })
      jQuery("#importCustomPropertiesButton").click(function(){
          importCustomProperties();
      })
      jQuery("#resetPropertyDataAllPropertiesButton").click(function(){
          resetPropertyDataAllProperties();
      })
      jQuery("#updateIndividualSchemaButton").click(function(){
          VisjsFunctions.updateIndividualSchema();
      })
      makePropertyTypesInfoBox()
  }
  constructor(props) {
       super(props);
       {/*
       this.state = {};
       this.state.message = 'SELECT * FROM sqlite_master';
       this.state.response = null;
       */}
  }
  state = {
      type3ModuleList: []
  }

  addType3Module = () => {
      var modnum = this.state.type3ModuleList.length;
      var newData = {
          type3ModuleNum: modnum,
          type3ModNameId: "t3propertyName_"+modnum,
          type3ModConceptSelectorId: "t3propertyConceptSelector_"+modnum
      }
      this.setState(prevState => ({type3ModuleList: [...prevState.type3ModuleList, newData]}))
  }
  render() {

    return (
      <>
        <div style={{width:"80%"}}>
            Toggle:
            <div className="toggleButtonOff" id="togglePanelAButton" data-backgroundcolor="#EFEFEF" >Add/Edit an individual concept</div>
            <div className="toggleButtonOff" id="togglePanelBButton" data-backgroundcolor="#EFEFEF" >Show Graphs</div>
            <div className="toggleButtonOff" id="togglePanelIButton" data-backgroundcolor="#EFEFEF" >Build/Edit Property Module</div>
            <div className="toggleButtonOff" id="togglePanelGButton" data-backgroundcolor="#EFEFEF" >Manage Concept Specific Instances</div>
            <div className="toggleButtonOff" id="togglePanelLButton" data-backgroundcolor="#EFEFEF" >Edit Primary Property/ JSON Schema</div>
            <br/>
            <div className="toggleButtonOff" id="togglePanelMButton" data-backgroundcolor="#EFEFEF" >Create/edit String Property</div>
            <div className="toggleButtonOff" id="togglePanelNButton" data-backgroundcolor="#EFEFEF" >Create/edit Object Property</div>
            <div className="toggleButtonOff" id="togglePanelOButton" data-backgroundcolor="#EFEFEF" >Create/edit Array Property</div>
            <div className="toggleButtonOff" id="togglePanelPButton" data-backgroundcolor="#EFEFEF" >Manage Required and Unique Properties</div>
            <br/>
            <div className="toggleButtonOff" id="togglePanelKButton" data-backgroundcolor="#EFEFEF" >Build/Edit Enumeration</div>
            <div className="toggleButtonOff" id="togglePanelQButton" data-backgroundcolor="#EFEFEF" >Concept-to-Concept relationships</div>
            <br/>
            <div className="toggleButtonOff" id="togglePanelJButton" data-backgroundcolor="#EFEFEF" >Primary Property: Edit type1 inputs</div>
            <div className="toggleButtonOff" id="togglePanelHButton" data-backgroundcolor="#EFEFEF" >Property Schema Auto-Build</div>
            <br/>
            <div className="toggleButtonOff" id="togglePanelCButton" data-backgroundcolor="#CFCFCF" style={{backgroundColor:"#CFCFCF"}} >Edit individual concept definition</div>
            <div className="toggleButtonOff" id="togglePanelDButton" data-backgroundcolor="#CFCFCF" style={{backgroundColor:"#CFCFCF"}} >Edit individual concept definition (old/static dataset)</div>
            <div className="toggleButtonOff" id="togglePanelEButton" data-backgroundcolor="#CFCFCF" style={{backgroundColor:"#CFCFCF"}} >Edit Property List</div>
            <div className="toggleButtonOff" id="togglePanelFButton" data-backgroundcolor="#CFCFCF" style={{backgroundColor:"#CFCFCF"}} >Edit JSON Schema</div>
        </div>
        <div className="addNewConceptContainer" style={{display:"none",border:"1px solid black",padding:"5px"}} id="panelA" data-visibility="invisible" >
            <div style={{border:"1px solid black",padding:"2px"}}>
                New Concept quick add:
                <div className="doSomethingButton" id="newConcept_create_Button" >Create</div>
                <div className="doSomethingButton" id="newConcept_save_Button" >Save</div>
                <div className="doSomethingButton" id="newConceptQuickAddButton" >Create & Save</div>
                singular: <textarea className="textField_bfc" id="newConceptSingular_quickAdd" ></textarea>
                plural: <textarea className="textField_bfc" id="newConceptPlural_quickAdd" ></textarea>
            </div>
            select Compact Concept Summary from SQL for the concept of:
            <div id="compactConceptSummarySelector" style={{display:"inline-block"}} >compactConceptSummarySelector</div>
            <div className="doSomethingButton" id="loadCompactConceptSummary" >load</div>
            <div className="doSomethingButton" id="clearFieldsCompactConceptSummary" >clear fields</div>
            <br/>

            Add a new concept
            (or load existing word to expand into a new wordType):
            <div id="convertWordIntoNewWordType" style={{display:"inline-block"}} >x</div>
             or a new superset: <div id="convertWordIntoNewSuperset" style={{display:"inline-block"}} >x</div>
            <br/>
            <div className="leftCol_bfc" >name, singular:</div>
            <textarea className="textField_bfc" id="newConceptSingular" ></textarea> (wordType)

            <br/>
            <div className="leftCol_bfc" >name, plural:</div>
            <textarea className="textField_bfc" id="newConceptPlural" ></textarea> (superset)
            <br/>
            <div className="leftCol_bfc" >specificInstance fields:</div>
            <input type="checkbox" id="newConceptField_name" checked /> name
            <input type="checkbox" id="newConceptField_title"  /> title
            <input type="checkbox" id="newConceptField_slug"  /> slug
            <input type="checkbox" id="newConceptField_alias"  /> alias
            <br/>
            <div>
                add set <div className="doSomethingButton" id="addSetButton" >+</div>
                Or: take an existing superset from another concept and make it a set in this concept: <div id="existingSupersetAsSet" style={{display:"inline-block"}}>existingSupersetAsSet</div>
                <div className="addSomethingContainer" id="addSetsContainer"></div>
            </div>
            <div>
                make new specificInstance <div className="doSomethingButton" id="addSpecificInstanceButton" >+</div>
                Or: take an existing wordType and make it a specificInstance <div id="existingWordTypeAsSpecificInstance" style={{display:"inline-block"}}>existingWordTypeAsSpecificInstance</div>
                <div className="addSomethingContainer" id="addSpecificInstancesContainer"></div>
            </div>
            <div className="doSomethingButton" id="addNewConceptButton" >Add</div>
            <div className="doSomethingButton" id="clearNewConceptButton" >Clear</div>

            <div>
                <div style={{verticalAlign:"top",display:"inline-block"}}>
                    <div style={{display:"inline-block",backgroundColor:"white"}} >
                        select nodes:<br/>
                        <input type="checkbox" name="concept" checked /> concept<br/>
                        <input type="checkbox" name="superset" checked /> superset<br/>
                        <input type="checkbox" name="schema" checked /> schema<br/>
                        <input type="checkbox" name="JSONSchema" checked /> JSONSchema<br/>
                        <input type="checkbox" name="wordType" checked /> wordType<br/>
                        <input type="checkbox" name="propertySchema" checked /> propertySchema<br/>
                        <input type="checkbox" name="properties" checked /> properties<br/>
                        <input type="checkbox" name="primaryProperty" checked /> primaryProperty
                    </div>
                    <div style={{display:"inline-block",backgroundColor:"white"}} >
                        keynames:<br/>
                        <input className="ki keynameField" type="text" id="keyname_concept" /><br/>
                        <input className="ki keynameField" type="text" id="keyname_superset" /><br/>
                        <input className="ki keynameField" type="text" id="keyname_schema" /><br/>
                        <input className="ki keynameField" type="text" id="keyname_JSONSchema" /><br/>
                        <input className="ki keynameField" type="text" id="keyname_wordType" /><br/>
                        <input className="ki keynameField" type="text" id="keyname_propertySchema" /><br/>
                        <input className="ki keynameField" type="text" id="keyname_properties" /><br/>
                        <input className="ki keynameField" type="text" id="keyname_primaryProperty" />
                    </div>
                    <div style={{display:"inline-block",backgroundColor:"white"}} >
                        IPNS:<br/>
                        <input className="ki" type="text" id="ipns_concept" /><br/>
                        <input className="ki" type="text" id="ipns_superset" /><br/>
                        <input className="ki" type="text" id="ipns_schema" /><br/>
                        <input className="ki" type="text" id="ipns_JSONSchema" /><br/>
                        <input className="ki" type="text" id="ipns_wordType" /><br/>
                        <input className="ki" type="text" id="ipns_propertySchema" /><br/>
                        <input className="ki" type="text" id="ipns_properties" /><br/>
                        <input className="ki" type="text" id="ipns_primaryProperty" />
                    </div>
                </div>

                <div style={{verticalAlign:"top",display:"inline-block",overflow:"scroll",height:"200px"}}>
                    <div id="propertyTypesDataContainer" >propertyTypes</div>
                </div>

                <div>
                    <div className="doSomethingButton" id="createKeynames" >Create keynames</div>
                    <div className="doSomethingButton" id="createIPNS" >Create IPNS</div>
                    <div className="doSomethingButton" id="makeNewConceptButton" >Create new concept (5 words + sets + sI's)</div>
                    <div className="doSomethingButton" id="calculateValenceDataButton" >calculate Valence Data</div>
                    <br/>
                    <div className="doSomethingButton" id="insertOrUpdateNewConceptIntoTablesButton" >Insert/update new concept into table(s)</div>
                    <br/>deprecating(?):
                    <div className="doSomethingButton" id="generateCompactConceptSummary" >Generate Compact Concept Summary</div>
                    <div className="doSomethingButton" id="saveCompactConceptSummary" >Save Compact Concept Summary (make new entry)</div>
                    <br/>
                    <div className="doSomethingButton" id="updateCompactConceptSummary" >Update Compact Concept Summary (using id of loaded CSS)</div>
                    <div className="doSomethingButton" id="deleteCompactConceptSummary" >Delete Compact Concept Summary (using id of loaded CSS)</div>
                </div>


                <div style={{verticalAlign:"top",display:"inline-block"}}>
                    <div id="specificInstances_container" >specificInstances_container</div>
                    <br/>
                    <div id="sets_container" >sets_container</div>
                    <br/>
                    <div className="newWordContainer" id="ccs_container" style={{backgroundColor:"blue",display:"none"}} >
                        <div className="floatRightBox" style={{color:"white"}} >COMPACT CONCEPT SUMMARY</div>
                        <br/>
                        <textarea id="compactConceptSummary_rawFile" className="newWordTextarea" ></textarea>
                    </div>
                    <br/>
                    <div className="newWordContainer" >
                        <div class="floatRightBox" >concept (?rename: conceptMap)</div>
                        <div id="slug_concept" className="topCenterSlug" >slug name</div>
                        <br/>
                        <textarea id="newConceptRawfile_concept" className="newWordTextarea" ></textarea>
                    </div>
                    <br/>
                    <div className="newWordContainer" >
                        <div class="floatRightBox" >superset</div>
                        <div id="slug_superset" className="topCenterSlug" >slug name</div>
                        <br/>
                        <textarea id="newConceptRawfile_superset" className="newWordTextarea" ></textarea>
                    </div>
                    <br/>
                    <div className="newWordContainer" >
                        <div class="floatRightBox" >schema</div>
                        <div id="slug_schema" className="topCenterSlug" >slug name</div>
                        <br/>
                        <textarea id="newConceptRawfile_schema" className="newWordTextarea" ></textarea>
                    </div>
                    <br/>
                    <div className="newWordContainer" >
                        <div class="floatRightBox" >JSONSchema</div>
                        <div id="slug_JSONSchema" className="topCenterSlug" >slug name</div>
                        <br/>
                        <textarea id="newConceptRawfile_JSONSchema" className="newWordTextarea" ></textarea>
                    </div>
                    <br/>
                    <div className="newWordContainer" >
                        <div class="floatRightBox" >wordType</div>
                        <div id="slug_wordType" className="topCenterSlug" >slug name</div>
                        <br/>
                        <textarea id="newConceptRawfile_wordType" className="newWordTextarea" ></textarea>
                    </div>
                    <br/>
                    <div className="newWordContainer" >
                        <div class="floatRightBox" >propertySchema</div>
                        <div id="slug_propertySchema" className="topCenterSlug" >slug name</div>
                        <br/>
                        <textarea id="newConceptRawfile_propertySchema" className="newWordTextarea" ></textarea>
                    </div>
                    <br/>
                    <div className="newWordContainer" >
                        <div class="floatRightBox" >properties</div>
                        <div id="slug_properties" className="topCenterSlug" >slug name</div>
                        <br/>
                        <textarea id="newConceptRawfile_properties" className="newWordTextarea" ></textarea>
                    </div>
                    <br/>
                    <div className="newWordContainer" >
                        <div class="floatRightBox" >primaryProperty</div>
                        <div id="slug_primaryProperty" className="topCenterSlug" >slug name</div>
                        <br/>
                        <textarea id="newConceptRawfile_primaryProperty" className="newWordTextarea" ></textarea>
                    </div>
                </div>

                <div id="setsForPropertyTypesContainer" style={{verticalAlign:"top",display:"inline-block"}}>
                </div>

            </div>
        </div>

        <fieldset style={{height:"850px",border:"1px solid black",display:"none"}} id="panelB" data-visibility="invisible" >
            <div style={{display:"inline-block",height:"830px",width:"500px",border:"1px solid black",overflow:"scroll"}}>

                <div className="singleConceptContainer" style={{backgroundColor:"white",marginTop:"5px"}} >
                    <div className="doSomethingButton" id="propertyTreeSchemaInfoToggle" data-currentstate="invisible" >+</div>
                    Property Tree Schema
                    <div style={{position:"absolute",right:"10px",top:"5px"}} >
                        <div className="doSomethingButton" id="showPropertyTreeSchemaButton" >show on graph</div>
                    </div>

                    <fieldset id="propertyTreeSchemaInfoContainer" style={{display:"none",padding:"2px"}} >
                        <div style={{display:"inline-block",fontSize:"10px",color:"red"}}>make conceptForProperty if not already done; conceptData.metaData.type push conceptForProperty; automate this somehow</div>
                        <div style={{display:"inline-block",fontSize:"10px",marginRight:"5px"}}>Property Tree Schema:</div>
                        <div id="propertyTreeSchemaSlug" data-slug="schemaForProperty" style={{display:"inline-block",fontSize:"10px"}}>schemaForProperty</div>
                        <br/>
                        <div style={{display:"inline-block",fontSize:"10px",marginRight:"5px"}}>properties (from conceptGraph library):</div>
                        <br/>
                        <div id="propertiesListContainer" style={{display:"block",fontSize:"10px",marginLeft:"10px"}}>propertiesList</div>
                        <br/>
                        <div style={{display:"inline-block",fontSize:"10px",marginRight:"5px"}}>relationships (from property schema):</div>
                        <br/>
                        <div id="propertyRelatinshipsContainer" style={{display:"inline-block",fontSize:"10px",marginLeft:"10px"}}>propertyRelationships</div>
                        <br/>
                        <div className="doSomethingButton_small" id="createNewPropertyButton" >create new property</div>
                        <br/>
                        <div id="propertyFromContainer" style={{display:"inline-block",fontSize:"10px",marginRight:"5px"}}>propFrom</div>
                        <br/>
                        <select id="propertyRelTypeSelector" style={{display:"inline-block",fontSize:"10px",marginRight:"5px"}}>
                            <option data-slug="addPropertyKey" >addPropertyKey</option>
                            <option data-slug="addPropertyValue" >addPropertyValue</option>
                            <option data-slug="propagateProperty" >propagateProperty</option>
                            <option data-slug="addToConceptGraphProperties" >addToConceptGraphProperties</option>
                            <option data-slug="isASpecificInstanceOf" >isASpecificInstanceOf</option>
                        </select>
                        <br/>
                        relationship field: <textarea id="propertyRelationshipTypeField" style={{display:"inline-block",width:"200px",height:"20px"}}></textarea>
                        <br/>
                        <div id="propertyToContainer" style={{display:"inline-block",fontSize:"10px",marginRight:"5px"}}>propTo</div>
                        <br/>
                        <div className="doSomethingButton_small" id="createNewPropertyRelationshipButton" >create new relationship</div>
                        <br/>
                        <div className="doSomethingButton_small" id="calculatePropConceptGraphStyleButton" >calculate property conceptGraphStyle</div>
                        <div className="doSomethingButton_small" id="clearPropConceptGraphStyleButton" >clear</div>
                        <br/>
                        <div className="doSomethingButton_small" id="calculatePropJSONSchemaStyleButton" >calculate property JSONSchemaStyle</div>
                        <div className="doSomethingButton_small" id="clearPropJSONSchemaStyleButton" >clear</div>
                        <br/>
                        <div className="doSomethingButton_small" id="resetPropertyDataAllPropertiesButton" >reset propertyData for all properties</div>
                        <br/>
                        Add customized properties to schemaForProperty:
                        <div className="doSomethingButton_small" id="importCustomPropertiesButton" >add</div>
                    </fieldset>
                </div>

                <div className="singleConceptContainer" style={{backgroundColor:"white",marginTop:"5px"}} >
                    <div className="doSomethingButton" id="conceptGraphMainSchemaInfoToggle" data-currentstate="invisible" >+</div>
                    Concept Graph Main Schema
                    <div style={{position:"absolute",right:"10px",top:"5px"}} >
                        <div className="doSomethingButton" id="showMainSchemaForConceptGraphButton" >show on graph</div>
                    </div>

                    <fieldset id="conceptGraphMainSchemaInfoContainer" style={{display:"none"}} >
                        <div style={{display:"inline-block",fontSize:"10px",marginRight:"5px"}}>CG Main Schema:</div>
                        <div id="cgMainSchemaSlug" style={{display:"inline-block",fontSize:"10px"}}></div>
                        <br/>
                        <div style={{display:"inline-block",fontSize:"10px",marginRight:"5px"}}>c2c relationship:</div>
                        <br/>
                        <div id="conceptSelector1_container" style={{display:"inline-block"}} >sel1</div>
                        <select id="c2cRelSelector" style={{display:"inline-block"}} >
                            <option value="0" data-c2crelslug="isASubsetOf" >isASubsetOf</option>
                            <option value="1" data-c2crelslug="isARealizationOf" >isARealizationOf</option>
                            <option value="2" data-c2crelslug="isADescriptorOf" >isADescriptorOf</option>
                        </select>
                        <div id="conceptSelector2_container" style={{display:"inline-block"}} >sel2</div>
                        <br/>
                        <div style={{display:"inline-block",fontSize:"10px",marginRight:"5px"}} >standard relationship:</div>
                        <br/>
                        <div id="standardRelWord1Sel_prefix" style={{display:"inline-block",fontSize:"12px",marginRight:"5px"}} >the set of all</div>
                        <div id="standardRelWord1Sel_container" style={{display:"inline-block"}} >word1</div>
                        <br/>
                        <div id="standardRelSelector_prefix" style={{display:"inline-block",fontSize:"12px",marginRight:"5px"}} >is a</div>
                        <select id="standardRelSelector" style={{display:"inline-block"}} >
                            <option value="0" data-standardrelslug="subsetOf" >subsetOf</option>
                            <option value="1" data-standardrelslug="isASpecificInstanceOf" >isASpecificInstanceOf</option>
                            <option value="2" data-standardrelslug="definesInforms" >defines - informs</option>
                        </select>
                        <br/>
                        <div id="standardRelWord2Sel_prefix" style={{display:"inline-block",fontSize:"12px",marginRight:"5px"}} >the set of all</div>
                        <div id="standardRelWord2Sel_container" style={{display:"inline-block"}} >word2</div>
                        <br/>
                        <div className="doSomethingButton" id="addc2cRelationshipButton" >add rel</div>
                    </fieldset>
                </div>

                <div id="schemaPanel"></div>

                <center>Concepts</center>
                <div id="activeConceptPanel"></div>
                {/*
                {selector_path.map((option) => (
                    <div className="singleConceptContainer" >
                        <div className="doSomethingButton" >.</div>
                        {option.slug}
                        <div>
                            <div className="smallFontLeftCol">compactConceptSummary:</div>
                        </div>
                        <div>
                            <div className="smallFontLeftCol">path:</div>
                        </div>
                        <div>
                            <div className="smallFontLeftCol">definition:</div>
                        </div>
                        <div>
                            <div className="smallFontLeftCol">JSONSchema:</div>
                        </div>
                        <div>
                            <div className="smallFontLeftCol">schema:</div>
                        </div>
                        <div>
                            <div className="smallFontLeftCol">concept:</div>
                        </div>
                        <div>
                            <div className="smallFontLeftCol">wordType:</div>
                        </div>
                        <div>
                            <div className="smallFontLeftCol">superset:</div>
                        </div>
                        <div style={{position:"absolute",right:"10px",top:"5px"}} >
                            <div data-conceptslug={option.slug} className="doSomethingButton showConceptOnGraph" >show on graph</div>
                        </div>
                    </div>
                ))}
                */}
            </div>
            <div style={{display:"inline-block",height:"830px",width:"400px",border:"1px solid black"}}>

                <div className="doSomethingButton" id="reorganizeConceptButton" style={{display:"none"} }>reorganize concept</div>
                <br/>
                <div style={{display:"inline-block",marginLeft:"5px"}} id="showIndividualSchema" >showIndividualSchema container</div>
                <div className="doSomethingButton" id="showIndividualSchemaButton" >Show Schema</div>
                <br/>
                <div id="updateDisplayedSchemaContainer" style={{fontSize:"10px",marginLeft:"5px"}}>
                    showing schema: <div id="nameOfSchemaBeingDisplayedContainer" style={{display:"inline-block"}} ></div>
                    <br/>
                    <div className="doSomethingButton" id="updateIndividualSchemaButton" >UPDATE SCHEMA</div>
                </div>
                <br/>
                <div style={{display:"inline-block",marginLeft:"5px"}} id="supersetOrSetContainer" ></div>
                <div style={{display:"inline-block",marginLeft:"5px"}} id="editPropertySchemaContainer" ></div>
                <div style={{display:"none",marginLeft:"5px"}} id="enumerationSelectorContainer" >enumerationSelectorContainer</div>
                <center><div id="network_buildConceptPage"></div></center>
            </div>

            <div style={{display:"inline-block",height:"830px",width:"600px",border:"1px solid black"}} >
                <div className="h4">file:</div>
                <div className="doSomethingButton" id="showFileUneditedButton" >unedited</div>
                <div className="doSomethingButton" id="showFileEditedButton" >edited</div>
                <div className="doSomethingButton" id="showFileUpdateButton" >Update</div>
                visjs display:
                <textarea id="visJsDisplay2" style={{width:"95%",height:"800px",display:"none"}} ></textarea>
                <center><textarea id="showFilePanel" style={{display:"inline-block",height:"800px",width:"95%",border:"1px solid black"}} ></textarea></center>
                <center><textarea id="showFileEditedPanel" style={{display:"none",height:"800px",width:"95%",border:"1px solid black"}} ></textarea></center>
            </div>
        </fieldset>

        <fieldset className="JSONSchemaContainer" id="panelC" style={{display:"none"}} data-visibility="invisible" >

            <div className="addPropertyContainer" id="JSONSchemaContainer_controlPanel_B" style={{border:"1px solid blue"}} >
                <center>Add a Property</center>
                modify the concept/definition/JSON Schema of:<br/>
                <div id="addPropertySelector_path_B" style={{display:"inline-block"}} ></div>
                (formerly: "path")
                <br/>
                <div className="toggleButtonOff" id="propertyType1Button" >add/edit simple strings (name, title, etc)</div>
                <div className="toggleButtonOff" id="propertyType2Button" >add string: options = specificInstances (~complex)</div>
                <div className="toggleButtonOff" id="propertyType3Button" >modules (the complexist!!)</div>
                <br/>
                <fieldset id="propertyType1Panel" data-state="invisible" style={{border:"1px solid black",padding:"5px",display:"none"}}>
                    <center>Property Type 1</center>
                    <input type="checkbox" id="editConceptField_name_B" /> name
                    <br/>
                    <input type="checkbox" id="editConceptField_title_B"  /> title
                    <br/>
                    <input type="checkbox" id="editConceptField_slug_B"  /> slug
                    <br/>
                    <input type="checkbox" id="editConceptField_alias_B"  /> alias
                    <br/>
                    <div id="addNewPropertyType1Button" className="doSomethingButton">+</div>
                    <div id="addNewPropertyType1Container" ></div>
                </fieldset>
                <fieldset id="propertyType2Panel" data-state="invisible" style={{border:"1px solid black",padding:"5px",display:"none"}}>
                  <center>Property Type 2 <div className="doSomethingButton" id="addType2PropertyRelsButton" >Add Prop</div></center>
                    <div id="addPropertySelector_key_B" style={{display:"inline-block"}} ></div>
                    <br/> (formerly: "key")
                    <br/>
                    <input type="checkbox" id="includeDependency_B" /> include dependency
                    <br/>
                    description:<textarea id="editConceptField_description_B" style={{width:"200px",height:"20px"}} ></textarea>
                    <br/>
                    value type: <div id="addPropertySelector_value_type_B" style={{display:"inline-block"}} ></div><br/>
                    value targetA: <div id="addPropertySelector_value_targetA_B" style={{display:"inline-block"}} ></div><br/>
                    value targetA_slug: <textarea id="addPropertySelector_value_targetA_slug_B" style={{width:"200px",height:"20px"}} ></textarea><br/>
                    value targetA_title: <textarea id="addPropertySelector_value_targetA_title_B" style={{width:"200px",height:"20px"}} ></textarea><br/>
                    value targetA_description: <textarea id="addPropertySelector_value_targetA_description_B" style={{width:"200px",height:"20px"}} ></textarea><br/>
                    value targetB (?): <div id="addPropertySelector_value_targetB_B" style={{display:"inline-block"}} ></div><br/>
                    value field: <div id="addPropertySelector_value_field_B" style={{display:"inline-block"}} ></div>
                    <br/>
                    c2c rel;
                    <div className="doSomethingButton_small" id="propType2_addC2cRelToCGMainSchemaButton" >add to CG main schema</div>
                    <br/>
                    <textarea id="propertyType2_c2cRel_rF" style={{width:"95%",height:"250px"}} ></textarea>
                    <br/>
                    induced c2c rels:<br/>
                    <div id="propertyType2_c2cRels_container" >propertyType2_c2cRels_container</div>
                    <br/>
                    induced standard rels:<br/>
                    <div id="propertyType2_standardRels_container" >propertyType2_standardRels_container</div>
                    {/*<textarea id="propertyType2_standardRel_rF" style={{width:"95%",height:"60px"}} ></textarea>*/}
                </fieldset>
                <fieldset id="propertyType3Panel" data-state="invisible" style={{border:"1px solid black",padding:"5px",display:"none"}}>
                    <center>Property Type 3: Build Modules</center>
                    <button onClick={this.addType3Module}>Add Module</button>
                    {this.state.type3ModuleList.map( (option) =>
                      (
                        <>
                        <Type3Module modnum={option.type3ModuleNum} type3ModNameId={option.type3ModNameId} type3ModConceptSelectorId={option.type3ModConceptSelectorId} />
                        </>
                      )
                    )}
                    <br/>
                </fieldset>
            </div>

            <div style={{display:"inline-block",width:"400px",border:"1px solid blue"}} >
                <div id="updatedDemo_B" style={{display:"inline-block",width:"400px",border:"1px solid blue"}} >sample form to generate a specific instance</div>
                <div id="updatedDemo_formData_B" style={{display:"inline-block",width:"400px",border:"1px solid blue"}} >formData</div>
            </div>

            <div className="fileOuterContainer" style={{height:"1000px",width:"550px",border:"1px solid blue"}} id="JSONSchemaContainer_parent_B" >
                parent JSON Schema: <div id="updateJSONSchema" className="doSomethingButton" >UPDATE</div><br/>
                <div id="updateJSONSchema_new" className="tabButtonSelected" >new</div>
                <div id="updateJSONSchema_old" className="tabButtonDeselected" >old</div><br/>
                <textarea className="fileInnerContainer" style={{height:"900px",width:"530px"}} id="JSONSchema_rawFile_parent_B" ></textarea>
                <textarea className="fileInnerContainer" style={{height:"900px",width:"530px",display:"none"}} id="JSONSchema_rawFile_parent_B_old" ></textarea>
            </div>
            <div className="fileOuterContainer" style={{height:"200px",width:"530px"}} id="JSONSchemaContainer_conditionalDemo_B" >
                conditionalDemo:<br/>
                <textarea className="fileInnerContainer" style={{height:"180px",width:"550px"}} id="JSONSchema_rawFile_conditionalDemo_B" >{grapevineConditionalDemo_str}</textarea>
            </div>

            <div className="fileOuterContainer" style={{height:"200px",width:"530px"}} id="JSONSchemaContainer_special" >
                special:<br/>
                <textarea className="fileInnerContainer" style={{height:"180px",width:"100px"}}  id="JSONSchema_rawFile_special_B" ></textarea>
            </div>
            <div className="fileOuterContainer" style={{height:"200px",width:"530px"}} id="JSONSchemaContainer_child" >
                child:<br/>
                <textarea className="fileInnerContainer" style={{height:"180px",width:"100px"}} id="JSONSchema_rawFile_child_B" ></textarea>
            </div>
            <textarea className="standardTextarea" id="schemaBeingEdited_B">{schema_str_B}
            </textarea>
        </fieldset>

        <fieldset className="JSONSchemaContainer" id="panelD" style={{display:"none"}} data-visibility="invisible" >
            <div className="addPropertyContainer" id="JSONSchemaContainer_controlPanel" >
                <center>Add a Property</center>
                path:
                <div id="addPropertySelector_path" style={{display:"inline-block"}} ></div>

                <select>
                    {selector_path.map((option) => (
                        <option value={option.slug}>{option.slug}</option>
                    ))}
                </select>

                <br/>

                key:
                <div id="addPropertySelector_key" style={{display:"inline-block"}} ></div>

                <br/>
                <input type="checkbox" id="editConceptField_name" checked /> name
                <input type="checkbox" id="editConceptField_title"  /> title
                <input type="checkbox" id="editConceptField_slug"  /> slug
                <input type="checkbox" id="editConceptField_alias"  /> alias
                <br/>
                description:<textarea id="editConceptField_description" style={{width:"200px",height:"20px"}} ></textarea>
                <br/>

                value type: <div id="addPropertySelector_value_type" style={{display:"inline-block"}} ></div><br/>
                value targetA: <div id="addPropertySelector_value_targetA" style={{display:"inline-block"}} ></div><br/>
                value targetA_slug: <textarea id="addPropertySelector_value_targetA_slug" style={{width:"200px",height:"20px"}} ></textarea><br/>
                value targetA_title: <textarea id="addPropertySelector_value_targetA_title" style={{width:"200px",height:"20px"}} ></textarea><br/>
                value targetA_description: <textarea id="addPropertySelector_value_targetA_description" style={{width:"200px",height:"20px"}} ></textarea><br/>
                value targetB (?): <div id="addPropertySelector_value_targetB" style={{display:"inline-block"}} ></div><br/>
                value field: <div id="addPropertySelector_value_field" style={{display:"inline-block"}} ></div>

                <br/>

                <div className="doSomethingButton" >add</div>
                <div className="doSomethingButton" onclick="calculateFamilyUnit()" >recalc</div>
                <br/>
                <div class="doSomethingButton" onClick={shoot} id="loadSchemaButton">load schema</div>
                <br/>
                <div id="updatedDemo" style={{display:"inline-block",height:"400px",width:"400px"}} >ud</div>
            </div>
            <div className="fileOuterContainer" style={{height:"1000px",width:"530px"}} id="JSONSchemaContainer_parent" >
                parent:<br/>
                <textarea className="fileInnerContainer" style={{height:"1000px",width:"550px"}} id="JSONSchema_rawFile_parent" ></textarea>
            </div>
            <div className="fileOuterContainer" style={{height:"1000px",width:"530px"}} id="JSONSchemaContainer_conditionalDemo" >
                conditionalDemo:<br/>
                <textarea className="fileInnerContainer" style={{height:"1000px",width:"550px"}} id="JSONSchema_rawFile_conditionalDemo" >{grapevineConditionalDemo_str}</textarea>
            </div>

            <div className="fileOuterContainer" id="JSONSchemaContainer_special" >
                special:<br/>
                <textarea className="fileInnerContainer" style={{height:"700px",width:"100px"}}  id="JSONSchema_rawFile_special" ></textarea>
            </div>
            <div className="fileOuterContainer" id="JSONSchemaContainer_child" >
                child:<br/>
                <textarea className="fileInnerContainer" style={{height:"700px",width:"100px"}} id="JSONSchema_rawFile_child" ></textarea>
            </div>

            <textarea className="standardTextarea" id="schemaBeingEdited">{schema_str}
            </textarea>

            <div style={{width:"800px",overflow:"scroll"}}>
                <pre>sql response: {this.state.response}</pre>
            </div>
        </fieldset>

        <fieldset className="JSONSchemaContainer" id="panelE" style={{display:"none"}} data-visibility="invisible" >
            <EditPropertyList />
        </fieldset>

        <fieldset className="JSONSchemaContainer" id="panelF" style={{display:"none"}} data-visibility="invisible" >
            <EditJSONSchema />
        </fieldset>

        <fieldset className="JSONSchemaContainer" id="panelG" style={{display:"none"}} data-visibility="invisible" >
            <ManageConceptSpecificInstances />
        </fieldset>

        <fieldset className="PropertySchemaAutoBuildContainer" id="panelH" style={{display:"none"}} data-visibility="invisible" >
            <PropertySchemaAutoBuild />
        </fieldset>

        <fieldset className="PropertyModulesContainer" id="panelI" style={{display:"none",width:"95%"}} data-visibility="invisible" >
            <PropertyModules />
        </fieldset>

        <fieldset className="PrimaryPropertyType1InputsEditorContainer" id="panelJ" style={{display:"none",width:"95%"}} data-visibility="invisible" >
            <PrimaryPropertyType1InputsEditor />
        </fieldset>

        <fieldset className="BuildEditEnumerationContainer" id="panelK" style={{display:"none",width:"95%"}} data-visibility="invisible" >
            <EnumerationEditor />
        </fieldset>

        <fieldset className="BuildEditEnumerationContainer" id="panelL" style={{display:"none",width:"95%"}} data-visibility="invisible" >
            <EditPrimaryPropertyJSONSchema />
        </fieldset>

        <fieldset className="BuildEditEnumerationContainer" id="panelM" style={{display:"none",width:"95%"}} data-visibility="invisible" >
            <ManageStringProperty />
        </fieldset>

        <fieldset className="BuildEditEnumerationContainer" id="panelN" style={{display:"none",width:"95%"}} data-visibility="invisible" >
            <ManageObjectProperty />
        </fieldset>

        <fieldset className="BuildEditEnumerationContainer" id="panelO" style={{display:"none",width:"95%"}} data-visibility="invisible" >
            <ManageArrayProperty />
        </fieldset>

        <fieldset className="BuildEditEnumerationContainer" id="panelP" style={{display:"none",width:"95%"}} data-visibility="invisible" >
            <ManageRequiredAndUniqueProperties />
        </fieldset>

        <fieldset className="BuildEditEnumerationContainer" id="panelQ" style={{display:"none",width:"95%"}} data-visibility="invisible" >
            <ManageConceptToConceptRelationships />
        </fieldset>

      </>
    );
  }
  makeAddPropertySelector_value_field() {
    alert("d")
  }
}
