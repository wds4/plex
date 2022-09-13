
import React, { Component, createRef, useEffect, useRef } from "react";
import AddANewConcept, { loadWordsIntoLookup } from './views/addANewConcept';
import sendAsync from './renderer';
import * as MiscFunctions from './lib/miscFunctions.js';
const jQuery = require("jquery");

window.oTestVariable.foo1 = "bar1";

// window.oTestVariable.foo = "bar";
// var starterConceptGraph_tableName = "myConceptGraph_slashtags";
var starterConceptGraph_tableName = "myConceptGraph_temporary";
var activeConceptGraph_tableName = starterConceptGraph_tableName;

export var conceptGraphsDataByTableName_obj = {};

export var conceptGraphs_masthead_arr = [];
conceptGraphs_masthead_arr[0] = {};
conceptGraphs_masthead_arr[1] = {};
conceptGraphs_masthead_arr[2] = {};
conceptGraphs_masthead_arr[3] = {};
conceptGraphs_masthead_arr[4] = {};
conceptGraphs_masthead_arr[5] = {};
conceptGraphs_masthead_arr[6] = {};
conceptGraphs_masthead_arr[7] = {};
conceptGraphs_masthead_arr[8] = {};

conceptGraphs_masthead_arr[0].dictionarytablename = "myDictionary_pga";
conceptGraphs_masthead_arr[1].dictionarytablename = "myDictionary_temporary";
conceptGraphs_masthead_arr[2].dictionarytablename = "myDictionary_pga";
conceptGraphs_masthead_arr[3].dictionarytablename = "myDictionary_pga";
conceptGraphs_masthead_arr[4].dictionarytablename = "myDictionary_pga";
conceptGraphs_masthead_arr[5].dictionarytablename = "myDictionary_pga";
conceptGraphs_masthead_arr[6].dictionarytablename = "myDictionary_grapevine";
conceptGraphs_masthead_arr[7].dictionarytablename = "myDictionary_pga";
conceptGraphs_masthead_arr[8].dictionarytablename = "myDictionary_pga";

conceptGraphs_masthead_arr[0].tableName = "myConceptGraph_pga";
conceptGraphs_masthead_arr[1].tableName = "myConceptGraph_temporary";
conceptGraphs_masthead_arr[2].tableName = "myConceptGraph_organisms";
conceptGraphs_masthead_arr[3].tableName = "myConceptGraph_epistemologies";
conceptGraphs_masthead_arr[4].tableName = "myConceptGraph_2WAY";
conceptGraphs_masthead_arr[5].tableName = "myConceptGraph_slashtags";
conceptGraphs_masthead_arr[6].tableName = "myConceptGraph_grapevine";
conceptGraphs_masthead_arr[7].tableName = "myConceptGraph_starterFiles";
conceptGraphs_masthead_arr[8].tableName = "myConceptGraph_anotherTestGraph";

conceptGraphs_masthead_arr[0].slug = "pga";
conceptGraphs_masthead_arr[1].slug = "temporary";
conceptGraphs_masthead_arr[2].slug = "organisms";
conceptGraphs_masthead_arr[3].slug = "epistemologies";
conceptGraphs_masthead_arr[4].slug = "2WAY";
conceptGraphs_masthead_arr[5].slug = "slashtags";
conceptGraphs_masthead_arr[6].slug = "grapevine";
conceptGraphs_masthead_arr[7].slug = "starterFiles";
conceptGraphs_masthead_arr[8].slug = "anotherTestGraph";

conceptGraphs_masthead_arr[0].title = "Pretty Good Apps Main Concept Graph (new)";
conceptGraphs_masthead_arr[1].title = "Concept Graph: Temporary For Testing Shit";
conceptGraphs_masthead_arr[2].title = "Concept Graph: Organisms";
conceptGraphs_masthead_arr[3].title = "Concept Graph: Epistemologies";
conceptGraphs_masthead_arr[4].title = "Concept Graph: 2WAY";
conceptGraphs_masthead_arr[5].title = "Concept Graph: Slashtags";
conceptGraphs_masthead_arr[6].title = "Concept Graph: The Grapevine";
conceptGraphs_masthead_arr[7].title = "Concept Graph: Starter Files";
conceptGraphs_masthead_arr[8].title = "Concept Graph: Another Test Graph";

// console.log("PRELOAD HERE from conceptGraphMasthead; preloadVar = "+preloadVar);

function makeMastheadSelector() {
    var selectorHTML = "";
    selectorHTML += "<select id='myConceptGraphSelector' >";

    var numConceptGraphs_masthead = conceptGraphs_masthead_arr.length;
    for (var g=0;g<numConceptGraphs_masthead;g++) {
        var nextConceptGraph_tableName = conceptGraphs_masthead_arr[g].tableName;
        var nextConceptGraph_slug = conceptGraphs_masthead_arr[g].slug;
        var nextConceptGraph_title = conceptGraphs_masthead_arr[g].title;
        var nextConceptGraph_refDictionary = conceptGraphs_masthead_arr[g].dictionarytablename;

        selectorHTML += "<option ";
        selectorHTML += " data-dictionarytablename="+nextConceptGraph_refDictionary+" ";
        selectorHTML += " data-tablename="+nextConceptGraph_tableName+" ";
        selectorHTML += " data-conceptgraphslug="+nextConceptGraph_slug+" ";
        if (nextConceptGraph_tableName == activeConceptGraph_tableName) {
            selectorHTML += " selected ";
        }
        selectorHTML += " >";
        selectorHTML += nextConceptGraph_title;
        selectorHTML += "</option>";
    }
    /*
    selectorHTML += `
    <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_pga" data-conceptgraphslug="pga" >Pretty Good Apps Main Concept Graph (new)</option>
    <option data-dictionarytablename="myDictionary_temporary" data-tablename="myConceptGraph_temporary" data-conceptgraphslug="temporary" selected >Concept Graph: Temporary For Testing Shit</option>
    <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_organisms" data-conceptgraphslug="organisms" >Concept Graph: Organisms</option>
    <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_epistemologies" data-conceptgraphslug="epistemologies" >Concept Graph: Epistemologies</option>
    <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_2WAY" data-conceptgraphslug="2WAY" >Concept Graph: 2WAY</option>
    <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_slashtags" data-conceptgraphslug="2WAY" >Concept Graph: Slashtags</option>
    `;
    */
    /*
    var sql_masthead_m = " SELECT * FROM myConceptGraphs ";
    sendAsync(sql_masthead_m).then((conceptGraphs_masthead_arr) => {
          var numConceptGraphs_masthead = conceptGraphs_masthead_arr.length;
          console.log("numConceptGraphs_masthead: "+numConceptGraphs_masthead)
          for (var g=0;g<numConceptGraphs_masthead;g++) {
              var nextConceptGraph_tableName = conceptGraphs_masthead_arr[g].tableName;

              var nextConceptGraph_id = conceptGraphs_masthead_arr[g].id;
              var nextConceptGraph_slug = conceptGraphs_masthead_arr[g].slug;
              var nextConceptGraph_title = conceptGraphs_masthead_arr[g].title;

              var nextConceptGraph_description = conceptGraphs_masthead_arr[g].description;
              var nextConceptGraph_rootSchemaIPNS = conceptGraphs_masthead_arr[g].rootSchemaIPNS;
              var nextConceptGraph_refDictionary = conceptGraphs_masthead_arr[g].referenceDictionary_tableName;
              var nextConceptGraph_gDDKeywords = conceptGraphs_masthead_arr[g].globalDynamicData_keywords;
              var nextConceptGraph_rawFile = conceptGraphs_masthead_arr[g].rawFile;


              selectorHTML += "<option>";
              selectorHTML += nextConceptGraph_tableName;
              selectorHTML += "</option>";
          }

    });
    */
    selectorHTML += "</select>";
    jQuery("#mastheadSelectorID").html(selectorHTML)
    jQuery("#myConceptGraphSelector").change( function(){
        var selectedConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected").data("tablename")
        activeConceptGraph_tableName = selectedConceptGraph_tableName;
        loadWordsIntoLookup();
    })
}

function generateConceptGraphReport_masthead() {
    var conceptGrapTableName = jQuery("#myConceptGraphSelector option:selected").data("tablename");

    var reportHTML = "";
    reportHTML += "<center>";
    reportHTML += "Concept Graph Report";
    reportHTML += "</center>";
    reportHTML += "<br>";
    reportHTML += "Concept Graph sql table name: "+conceptGrapTableName;
    reportHTML += "<br>";

    var slugListHTML = "";
    var errorList1HTML = "";
    var schemaReportHTML = "";
    var slugErrorsHTML = "";
    var numSchemas = 0;
    var sqlWordList_arr = [];

    var sql = " SELECT * FROM "+conceptGrapTableName;
    sendAsync(sql).then(async (words_arr) => {
        var numWords = words_arr.length;
        reportHTML += "number of words in SQL: "+numWords;
        reportHTML += "<br>";
        console.log("generateConceptGraphReport_masthead via sql; numWords: "+numWords)
        var masterSlugList_obj = {};
        var masterIPNSList_obj = {};
        for (var w=0;w<numWords;w++) {
            var nextWord = words_arr[w];
            var nextWord_sql_slug = nextWord.slug;
            sqlWordList_arr.push(nextWord_sql_slug)
        }
        for (var w=0;w<numWords;w++) {
            var nextWord = words_arr[w];
            var nextWord_sql_slug = nextWord.slug;
            var nextWord_sql_ipns = nextWord.ipns;
            var nextWord_rawFile_str = nextWord.rawFile;
            var isValidJSON = MiscFunctions.isValidJSONString(nextWord_rawFile_str)
            var errorThisWord = false;
            var errorThisWordHTML = "ERROR! sql slug: "+nextWord_sql_slug;
            if (isValidJSON) {
                var nextWord_rawFile_obj = JSON.parse(nextWord_rawFile_str);
                if (nextWord_rawFile_obj.hasOwnProperty("wordData")) {
                    if (nextWord_rawFile_obj.wordData.hasOwnProperty("slug")) {
                        var nextWord_slug = nextWord_rawFile_obj.wordData.slug;
                        slugListHTML += nextWord_slug + "<br>";
                        var nextWord_wordTypes_arr = nextWord_rawFile_obj.wordData.wordTypes;
                        if (jQuery.inArray("schema",nextWord_wordTypes_arr) > -1) {
                            schemaReportHTML += "SCHEMA: "+nextWord_slug;
                            numSchemas++;
                            var nodes_arr = nextWord_rawFile_obj.schemaData.nodes;
                            var relationships_arr = nextWord_rawFile_obj.schemaData.relationships;
                            var numNodesInSchema = nodes_arr.length;
                            var numRelsInSchema = relationships_arr.length;
                            schemaReportHTML += "; NODES: "+numNodesInSchema+"; RELS: "+numRelsInSchema;
                            schemaReportHTML += "<br>";
                            for (var n=0;n<numNodesInSchema;n++) {
                                var nextNodeInSchema_obj = nodes_arr[n];
                                var nextNode_slug = nextNodeInSchema_obj.slug;

                                if (jQuery.inArray(nextNode_slug,sqlWordList_arr) == -1) {
                                    // Error! This word is not in the SQL database!
                                    schemaReportHTML += "<div style=color:red; >";
                                    schemaReportHTML += "ERROR!! "+nextNode_slug+" is in schema: "+nextWord_slug+" but is not in the SQL database!!";
                                    schemaReportHTML += "</div>";
                                }

                                var nextNode_ipns = nextNodeInSchema_obj.ipns;
                                if (!nextNode_slug) {
                                    // Error! there is no slug for this node!
                                }
                                if (!nextNode_ipns) {
                                    // Error! there is no ipns for this node!
                                }
                                // IPNS
                                if (!masterIPNSList_obj.hasOwnProperty(nextNode_ipns)) {
                                    masterIPNSList_obj[nextNode_ipns] = {};
                                    masterIPNSList_obj[nextNode_ipns].slugList = [];
                                }
                                if (jQuery.inArray(nextNode_slug,masterIPNSList_obj[nextNode_ipns].slugList) == -1) {
                                    masterIPNSList_obj[nextNode_ipns].slugList.push(nextNode_slug)
                                }
                                // Add schema slug to keep track of which schemas
                                if (!masterIPNSList_obj[nextNode_ipns].hasOwnProperty(nextNode_ipns)) {
                                    masterIPNSList_obj[nextNode_ipns][nextNode_slug] = [];
                                }
                                masterIPNSList_obj[nextNode_ipns][nextNode_slug].push(nextWord_slug); // nextWord_slug is the name of the schema

                                // SLUG
                                if (!masterSlugList_obj.hasOwnProperty(nextNode_slug)) {
                                    masterSlugList_obj[nextNode_slug] = {};
                                    masterSlugList_obj[nextNode_slug].ipnsList = [];
                                    // masterSlugList_obj[nextNode_slug].ipns = nextNode_ipns;
                                }
                                if (jQuery.inArray(nextNode_ipns,masterSlugList_obj[nextNode_slug].ipnsList) == -1) {
                                    masterSlugList_obj[nextNode_slug].ipnsList.push(nextNode_ipns)
                                }
                                // Add schema slug to keep track of which schemas
                                if (!masterSlugList_obj[nextNode_slug].hasOwnProperty(nextNode_ipns)) {
                                    masterSlugList_obj[nextNode_slug][nextNode_ipns] = [];
                                }
                                masterSlugList_obj[nextNode_slug][nextNode_ipns].push(nextWord_slug); // nextWord_slug is the name of the schema
                            }
                            for (var r=0;r<numRelsInSchema;r++) {
                                var nextRelInSchema_obj = relationships_arr[r];
                                var nextRel_nodeFrom_slug = nextRelInSchema_obj.nodeFrom.slug;
                                var nextRel_nodeTo_slug = nextRelInSchema_obj.nodeTo.slug;
                            }
                        }
                    }
                } else {
                    errorThisWord = true;
                    errorThisWordHTML += " ** rawFile: does not have wordData ** ";
                }
            } else {
                errorThisWord = true;
                errorThisWordHTML += " ** rawFile: not valid JSON ** ";
            }
            if (!nextWord_sql_ipns) {
                errorThisWord = true;
                errorThisWordHTML += " ** ipns missing from SQL table ** ";
            }
            if (errorThisWord) {
                errorList1HTML += errorThisWordHTML+"<br>";
            }
        }
        var masterSlugList_str = JSON.stringify(masterSlugList_obj,null,4);
        var masterIPNSList_str = JSON.stringify(masterIPNSList_obj,null,4);
        // Now cycle through masterSlugList_obj and look for any instances of:
        // one slug with either zero or multiple IPNS's
        for (const [nxtSlg_slug, nxtSlg_obj] of Object.entries(masterSlugList_obj)) {
            var nxtSlg_ipnsList = nxtSlg_obj.ipnsList;
            var numIpns = nxtSlg_ipnsList.length;
            if (numIpns == 0) {
                slugErrorsHTML += "ERROR! NO IPNS for slug: "+nxtSlg_slug+" which is in schemas: <br>";
            }
            if (numIpns > 1) {
                slugErrorsHTML += "ERROR! MULTIPLE IPNSs for slug: "+nxtSlg_slug+"; IPNSList is: ...  which is in schemas: <br>";
            }
        }
        // Now cycle through masterIPNSList_obj and look for any instances of:
        // one IPNS with either zero of multiple slugs
        reportHTML += "<center>SCHEMAS REPORT</center>";
        reportHTML += "number of schemas in SQL: "+numSchemas+"<br>";
        reportHTML += schemaReportHTML;
        reportHTML += slugErrorsHTML;

        reportHTML += "<br>";

        reportHTML += "<center>SQL table</center>";
        reportHTML += errorList1HTML;

        reportHTML += "<center>masterSlugList_str</center>";
        reportHTML += masterSlugList_str;

        reportHTML += "<center>masterIPNSList_str</center>";
        reportHTML += masterIPNSList_str;

        // reportHTML += slugListHTML;
        jQuery("#conceptGraphReportContainer").html(reportHTML)
    });

    /*
    for (const [nextWord_slug, nextWord_rF_obj] of Object.entries(words_in_obj)) {
        var nextWord_wordTypes_arr = nextWord_rF_obj.wordData.wordTypes;
        if (jQuery.inArray("schema",nextWord_wordTypes_arr) > -1) {
        }
    }
    */
}

export default class ConceptGraphMasthead extends React.Component {

    constructor(props) {
        super(props);
        this.state_masthead = {
            cglinks_masthead: [
                {
                    tablename: 'myConceptGraph_pga',
                    conceptgraphslug: 'pga',
                    tabletitle: 'Pretty Good Apps Main Concept Graph (new)',
                    dictionarytablename: 'myDictionary_pga'
                }
            ],
            oTestVarCGMasthead: this.props.oTestVar
        }
    }

    componentDidMount() {
        makeMastheadSelector();

        jQuery("#conceptGraphReportToggleButton").click(function(){
            var currState = jQuery(this).data("togglestate");
            console.log("currState: "+currState)
            if (currState=="hidden") {
                jQuery(this).data("togglestate","visible");
                jQuery("#conceptGraphReportContainer").css("display","block")
                generateConceptGraphReport_masthead();
            }
            if (currState=="visible") {
                jQuery(this).data("togglestate","hidden");
                jQuery("#conceptGraphReportContainer").css("display","none")
            }
        })
        /*
        var sql_masthead = " SELECT * FROM myConceptGraphs ";
        sendAsync(sql_masthead).then( async (result_x) => {
              // this.setState({response: JSON.stringify(result_x,null,4) } )
              var conceptGraphs_arr = result_x;
              var numConceptGraphs = conceptGraphs_arr.length;
              console.log("numConceptGraphs: "+numConceptGraphs)
              for (var m=0;m<numConceptGraphs;m++) {
                  var nextConceptGraph_id = conceptGraphs_arr[m].id;
                  var nextConceptGraph_slug = conceptGraphs_arr[m].slug;
                  var nextConceptGraph_title = conceptGraphs_arr[m].title;
                  var nextConceptGraph_tableName = conceptGraphs_arr[m].tableName;
                  var nextConceptGraph_description = conceptGraphs_arr[m].description;
                  var nextConceptGraph_rootSchemaIPNS = conceptGraphs_arr[m].rootSchemaIPNS;
                  var nextConceptGraph_refDictionary = conceptGraphs_arr[m].referenceDictionary_tableName;
                  var nextConceptGraph_gDDKeywords = conceptGraphs_arr[m].globalDynamicData_keywords;
                  var nextConceptGraph_rawFile = conceptGraphs_arr[m].rawFile;

                  var cGlinks_masthead_obj = {};
                  cGlinks_masthead_obj.tablename = nextConceptGraph_tableName;
                  cGlinks_masthead_obj.tabletitle = nextConceptGraph_title;
                  cGlinks_masthead_obj.conceptgraphslug = nextConceptGraph_slug;
                  cGlinks_masthead_obj.dictionarytablename = nextConceptGraph_refDictionary
                  this.state_masthead.cglinks_masthead.push(cGlinks_masthead_obj)
                  this.forceUpdate();
              }
              // this.forceUpdate();
        });
        */
    }
    render() {
        return (
          <>
              <center>
                  <div style={{fontSize:"20px",display:"inline-block",marginTop:"20px",color:"#003300"}}>
                  the
                  </div>
                  <div style={{fontSize:"24px",display:"inline-block",marginTop:"40px",color:"purple",marginRight:"10px"}}>
                  Pretty Good Apps
                  </div>
                  <div style={{fontSize:"48px",display:"inline-block",marginTop:"20px",color:"#5F5F5F",marginRight:"30px"}}>
                  Concept Graph
                  </div>
              </center>
              <h1>Hello {window.testVariable}</h1>
              <div className="landingPageSubBanner" >some pithy saying: {window.oTestVariable.foo}</div>
              <div style={{display:"inline-block"}}>
                  Masthead: select one of My Concept Graphs:
              </div>
              <div style={{display:"inline-block"}}>
                  <div id="mastheadSelectorID" >X</div>
              </div>
              <div id="conceptGraphReportToggleButton" className="doSomethingButton" data-togglestate="hidden" >Toggle Concept Graph Analysis Report</div>
              <pre id="conceptGraphReportContainer" style={{overflow:"scroll",height:"600px",width:"1200px",border:"1px solid black",display:"none"}} >Concept Graph Report</pre>

              <select style={{display:"none"}} id="myConceptGraphSelector_new" >
              {this.state_masthead.cglinks_masthead.map(link_masthead => (
                  <option data-tablename={link_masthead.tablename} data-conceptgraphslug={link_masthead.conceptgraphslug} data-dictionarytablename={link_masthead.dictionarytablename} >
                      {link_masthead.tabletitle}
                  </option>
              ))}
              </select>

          </>
        );
    }
}

export const conceptGraphMasthead = (
  <>
    <center>
        <div style={{fontSize:"20px",display:"inline-block",marginTop:"20px",color:"#003300"}}>
        the
        </div>
        <div style={{fontSize:"24px",display:"inline-block",marginTop:"40px",color:"purple",marginRight:"10px"}}>
        Pretty Good Apps
        </div>
        <div style={{fontSize:"48px",display:"inline-block",marginTop:"20px",color:"#5F5F5F",marginRight:"30px"}}>
        Concept Graph
        </div>
    </center>
    <div className="landingPageSubBanner" >some pithy saying</div>
    (deprecating .... )
  </>
);
