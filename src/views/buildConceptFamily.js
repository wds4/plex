
import React from "react";
// import * as Constants from '../conceptGraphMasthead.js';
import ConceptGraphMasthead from '../conceptGraphMasthead.js';
import Demo from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import AddANewConcept, { templatesByWordType_obj, insertOrUpdateWordIntoMyDictionary, insertOrUpdateWordIntoMyConceptGraph } from './addANewConcept';
import LeftNavbar from '../LeftNavbar';
import GenerateCompactConceptSummarySelector from './GenerateCompactConceptSummarySelector';
import IpfsHttpClient from 'ipfs-http-client';
import sendAsync from '../renderer';
import Type3Module from './buildConceptFamily/propertyType3Module';
const jQuery = require("jquery");

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

async function createPropertyTreeSchema() {
    var doesPropertyTreeSchemaAlreadyExist = false;
    var conceptgraphtablename = jQuery("#myConceptGraphSelector option:selected").data("tablename");
    var conceptgraphslug = jQuery("#myConceptGraphSelector option:selected").data("conceptgraphslug");
    var dictionarytablename = jQuery("#myConceptGraphSelector option:selected").data("dictionarytablename");
    console.log("createPropertyTreeSchema; conceptgraphtablename: "+conceptgraphtablename+"; dictionarytablename: "+dictionarytablename)
    var newSchema_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["schema"]));
    var newSchema_slug = "propertyTreeSchemaFor_"+conceptgraphslug;
    var newSchema_title = "Property Tree Schema for "+conceptgraphslug;
    newSchema_obj.wordData.slug = newSchema_slug;
    newSchema_obj.wordData.title = newSchema_title;
    newSchema_obj.schemaData.metaData.types.push("propertyTreeSchema");
    newSchema_obj.schemaData.types.push("propertyTreeSchema");

    newSchema_obj.globalDynamicData.myDictionaries = dictionarytablename;
    newSchema_obj.globalDynamicData.myConceptGraphs = conceptgraphtablename;

    var currentTime = Date.now();
    var newKeyname = "dictionaryWord_"+newSchema_slug+"_"+currentTime;
    var generatedKey_obj = await ipfs.key.gen(newKeyname, {
        type: 'rsa',
        size: 2048
    })
    var newSchema_ipns = generatedKey_obj["id"];
    var generatedKey_name = generatedKey_obj["name"];
    console.log("generatedKey_obj id: "+newSchema_ipns+"; name: "+generatedKey_name);
    newSchema_obj.metaData.ipns = newSchema_ipns;

    var sql = "";
    sql += " SELECT * FROM "+conceptgraphtablename;

    sendAsync(sql).then((words_arr) => {
        var numWords = words_arr.length;
        for (var w=0;w<numWords;w++) {
            var nextWord_str = words_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_ipns = nextWord_obj.metaData.ipns;
            console.log("w: "+w+"; nextWord_slug: "+nextWord_slug)
            var nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
            if (jQuery.inArray("property",nextWord_wordTypes_arr) > -1) {
                console.log("property")
                var nextWord_nodesElem_obj = {};
                nextWord_nodesElem_obj.slug = nextWord_slug;
                nextWord_nodesElem_obj.ipns = nextWord_ipns;
                newSchema_obj.schemaData.nodes.push(nextWord_nodesElem_obj);
                console.log("added")
            }
            // check to see whether mainSchemaForConceptGraph already exists!
            if (jQuery.inArray("schema",nextWord_wordTypes_arr) > -1) {
                var nextWord_schemaTypes_arr = nextWord_obj.schemaData.metaData.types;
                if (jQuery.inArray("propertyTreeSchema",nextWord_schemaTypes_arr) > -1) {
                    doesPropertyTreeSchemaAlreadyExist = true;
                }
            }
        }
        var newSchema_str = JSON.stringify(newSchema_obj,null,4);
        console.log("doesPropertyTreeSchemaAlreadyExist: "+doesPropertyTreeSchemaAlreadyExist+"; newSchema_str: "+newSchema_str)
        if (!doesPropertyTreeSchemaAlreadyExist) {
            console.log("inserting new schema into conceptGraph and dictionary tables")
            insertOrUpdateWordIntoMyConceptGraph(conceptgraphtablename,dictionarytablename,newSchema_str,newSchema_slug,newKeyname,newSchema_ipns);
            insertOrUpdateWordIntoMyDictionary(dictionarytablename,newSchema_str,newSchema_slug,newKeyname,newSchema_ipns);
        }
    });
}
async function createConceptGraphSchema() {
    var doesMainSchemaForCGAlreadyExist = false;
    var conceptgraphtablename = jQuery("#myConceptGraphSelector option:selected").data("tablename");
    var conceptgraphslug = jQuery("#myConceptGraphSelector option:selected").data("conceptgraphslug");
    var dictionarytablename = jQuery("#myConceptGraphSelector option:selected").data("dictionarytablename");
    console.log("createConceptGraphSchema; conceptgraphtablename: "+conceptgraphtablename+"; dictionarytablename: "+dictionarytablename)
    var newSchema_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["schema"]));
    var newSchema_slug = "schemaForConceptGraphFor_"+conceptgraphslug;
    var newSchema_title = "Schema for Concept Graph for "+conceptgraphslug;
    newSchema_obj.wordData.slug = newSchema_slug;
    newSchema_obj.wordData.title = newSchema_title;
    newSchema_obj.schemaData.metaData.types.push("mainSchemaForConceptGraph");
    newSchema_obj.schemaData.types.push("mainSchemaForConceptGraph");

    newSchema_obj.globalDynamicData.myDictionaries = dictionarytablename;
    newSchema_obj.globalDynamicData.myConceptGraphs = conceptgraphtablename;

    var currentTime = Date.now();
    var newKeyname = "dictionaryWord_"+newSchema_slug+"_"+currentTime;
    var generatedKey_obj = await ipfs.key.gen(newKeyname, {
        type: 'rsa',
        size: 2048
    })
    var newSchema_ipns = generatedKey_obj["id"];
    var generatedKey_name = generatedKey_obj["name"];
    console.log("generatedKey_obj id: "+newSchema_ipns+"; name: "+generatedKey_name);
    newSchema_obj.metaData.ipns = newSchema_ipns;

    var sql = "";
    sql += " SELECT * FROM "+conceptgraphtablename;

    sendAsync(sql).then((words_arr) => {
        var numWords = words_arr.length;
        for (var w=0;w<numWords;w++) {
            var nextWord_str = words_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_ipns = nextWord_obj.metaData.ipns;
            console.log("w: "+w+"; nextWord_slug: "+nextWord_slug)
            var nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
            if (jQuery.inArray("concept",nextWord_wordTypes_arr) > -1) {
                console.log("concept")
                var nextWord_nodesElem_obj = {};
                nextWord_nodesElem_obj.slug = nextWord_slug;
                nextWord_nodesElem_obj.ipns = nextWord_ipns;
                newSchema_obj.schemaData.nodes.push(nextWord_nodesElem_obj);
                console.log("added")
            }
            // check to see whether mainSchemaForConceptGraph already exists!
            if (jQuery.inArray("schema",nextWord_wordTypes_arr) > -1) {
                var nextWord_schemaTypes_arr = nextWord_obj.schemaData.metaData.types;
                if (jQuery.inArray("mainSchemaForConceptGraph",nextWord_schemaTypes_arr) > -1) {
                    doesMainSchemaForCGAlreadyExist = true;
                } else {
                    var nextWord_schemaImportsElem_obj = {};
                    nextWord_schemaImportsElem_obj.slug = nextWord_slug;
                    nextWord_schemaImportsElem_obj.ipns = nextWord_ipns;
                    newSchema_obj.schemaData.schemaImports.push(nextWord_schemaImportsElem_obj);
                }
            }
        }
        var newSchema_str = JSON.stringify(newSchema_obj,null,4);
        console.log("doesMainSchemaForCGAlreadyExist: "+doesMainSchemaForCGAlreadyExist+"; newSchema_str: "+newSchema_str)
        if (!doesMainSchemaForCGAlreadyExist) {
            console.log("inserting new schema into conceptGraph and dictionary tables")
            insertOrUpdateWordIntoMyConceptGraph(conceptgraphtablename,dictionarytablename,newSchema_str,newSchema_slug,newKeyname,newSchema_ipns);
            insertOrUpdateWordIntoMyDictionary(dictionarytablename,newSchema_str,newSchema_slug,newKeyname,newSchema_ipns);
        }
    });
}

async function createConceptGraphSelector() {
    var sql_selectMyConceptGraphs = " SELECT * FROM myConceptGraphs ";
    sendAsync(sql_selectMyConceptGraphs).then((result_mCG) => {
          var result_str = JSON.stringify(result_mCG,null,4);
          console.log("result_str: "+result_str)
          var cG_arr = result_mCG;
          var numConGraphs = cG_arr.length;
          console.log("numConGraphs: "+numConGraphs)
          var myConceptGraphSelectorHTML = "";
          myConceptGraphSelectorHTML += "<select id='myConceptGraphSelector' >";
          /*
          <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_pga" data-conceptgraphslug="pga" >Pretty Good Apps Main Concept Graph (new)</option>
          <option data-dictionarytablename="myDictionary_temporary" data-tablename="myConceptGraph_temporary" data-conceptgraphslug="temporary" selected >Concept Graph: Temporary For Testing Shit</option>
          <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_organisms" data-conceptgraphslug="organisms" >Concept Graph: Organisms</option>
          <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_epistemologies" data-conceptgraphslug="epistemologies" >Concept Graph: Epistemologies</option>
          <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_2WAY" data-conceptgraphslug="2WAY" >Concept Graph: 2WAY</option>
          */
          for (var c=0;c<numConGraphs;c++) {
              var nextConceptGraph_title = cG_arr[c].title;
              var nextConceptGraph_slug = cG_arr[c].slug;
              var nextConceptGraph_tableName = cG_arr[c].tableName;
              var nextConceptGraph_referenceDictionary_tableName = cG_arr[c].referenceDictionary_tableName
              console.log("nextConceptGraph_title: "+nextConceptGraph_title)
              myConceptGraphSelectorHTML += "<option data-dictionarytablename='"+nextConceptGraph_referenceDictionary_tableName+"' ";
              myConceptGraphSelectorHTML += " data-tablename='"+nextConceptGraph_tableName+"' ";
              myConceptGraphSelectorHTML += " data-conceptgraphslug='"+nextConceptGraph_slug+"' ";
              myConceptGraphSelectorHTML += " >"+nextConceptGraph_title+"</option>";
          }
          myConceptGraphSelectorHTML += "</select>";
    });
}

export default class BuildConceptFamily extends React.Component {
    componentDidMount() {
        // GenerateCompactConceptSummarySelector();
        jQuery("#myConceptGraphSelector").change(function(){
            GenerateCompactConceptSummarySelector();
        })
        jQuery("#createConceptGraphSchemaButton").click(function(){
            createConceptGraphSchema();
        })
        jQuery("#createPropertyTreeSchemaButton").click(function(){
            createPropertyTreeSchema();
        })
        var isConceptGraphSelectorCreated = false;
        jQuery("#toggleConceptGraphControlPanelButton").click(function(){
            var currState = jQuery("#conceptGraphControlPanelContainer").data("state")
            // console.log("toggleConceptGraphControlPanelButton clicked; currState: "+currState)
            if (currState=="hidden") {
                jQuery("#conceptGraphControlPanelContainer").data("state","visible")
                jQuery("#conceptGraphControlPanelContainer").css("display","block")
            } else {
                jQuery("#conceptGraphControlPanelContainer").data("state","hidden")
                jQuery("#conceptGraphControlPanelContainer").css("display","none")
            }
            if (!isConceptGraphSelectorCreated) {
                createConceptGraphSelector();
                isConceptGraphSelectorCreated = true;
            }
        })

    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div className="h2">Build Concept Family: {window.oTestVariable.foo}; {window.oTestVariable.foo1}</div>
                        <div className="doSomethingButton_small" id="toggleConceptGraphControlPanelButton" >toggle concept graph control panel</div>
                        <div data-state="hidden" id="conceptGraphControlPanelContainer" style={{display:"none",padding:"5px",border:"1px solid black"}} >
                            Select one of My Concept Graphs:
                            <select id="myConceptGraphSelector" >
                                <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_pga" data-conceptgraphslug="pga" >Pretty Good Apps Main Concept Graph (new)</option>
                                <option data-dictionarytablename="myDictionary_temporary" data-tablename="myConceptGraph_temporary" data-conceptgraphslug="temporary" selected >Concept Graph: Temporary For Testing Shit</option>
                                <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_organisms" data-conceptgraphslug="organisms" >Concept Graph: Organisms</option>
                                <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_epistemologies" data-conceptgraphslug="epistemologies" >Concept Graph: Epistemologies</option>
                                <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_2WAY" data-conceptgraphslug="2WAY" >Concept Graph: 2WAY</option>
                                <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_slashtags" data-conceptgraphslug="2WAY" >Concept Graph: Slashtags</option>
                            </select>
                            <div></div>

                            <br/>
                            Compact Concept Graph Summary:
                            <div className="doSomethingButton" id="loadCompactConceptGraphSummaryButton" >Load</div>
                            <div className="doSomethingButton" id="saveCompactConceptGraphSummaryButton" >Save</div>
                            <br/>
                            main concept graph schema: <div className="doSomethingButton" id="createConceptGraphSchemaButton" >create</div>
                            <div style={{fontSize:"10px",width:"80%"}} >
                            (creates schemaForConceptGraphFor_[slug for this conceptGraph], where:
                            schemaForConceptGraphFor_[]:schemaData.metaData.types and/or schemaForConceptGraphFor_[]:schemaData.types should contain mainSchemaForConceptGraph)
                            </div>
                            <br/>
                            property tree schema: <div className="doSomethingButton" id="createPropertyTreeSchemaButton" >create</div>
                            <div style={{fontSize:"10px",width:"80%"}}  >
                            (propertyListFor_[slug for this conceptGraph]; may be deprecating in favor of a single conceptForProperty, where:
                            1. schemaForProperty:schemaData.metaData.types and/or schemaForProperty:schemaData.types should have propertyTreeSchema, which perhaps I should change to schemaForProperty;
                            2. conceptForProperty.conceptData.metaData.types should contain conceptForProperty)
                            </div>
                        </div>
                        <AddANewConcept />
                    </div>
                </fieldset>
            </>
        );
    }
}

window.oTestVariable.foo1 = "bar2";
