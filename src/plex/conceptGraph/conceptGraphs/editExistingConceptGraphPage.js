import React from "react";
import { NavLink, Link } from "react-router-dom";
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/singleConceptGraph_leftNav2.js';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as TxSqlFunctions from '../../functions/transferSqlToDOM.js';
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const updateCurrentConceptGraph = async () => {

    var commandHTML = "";
    var currentConceptGraphSqlId = jQuery("#currentConceptGraphSqlIdField").html();
    var currentConceptGraphSlug = jQuery("#currentConceptGraphSlugField").val();
    var currentConceptGraphName = jQuery("#currentConceptGraphNameField").val();
    var currentConceptGraphTitle = jQuery("#currentConceptGraphTitleField").val();
    var currentConceptGraphTableName = jQuery("#currentConceptGraphTableNameField").val();
    var currentConceptGraphMainSchemaSlug = jQuery("#currentConceptGraphMainSchemaSlugField").val();
    var currentConceptGraphDescription = jQuery("#currentConceptGraphDescriptionField").val();

    var conceptGraphSqlID = window.currentConceptGraphSqlID;
    var conceptGraphMainSchemaSlug = window.aLookupConceptGraphInfoBySqlID[conceptGraphSqlID].mainSchema_slug;

    var oCurrentConceptGraph = window.lookupWordBySlug[conceptGraphMainSchemaSlug]

    // console.log("updateCurrentConceptGraph; conceptGraphMainSchemaSlug: "+conceptGraphMainSchemaSlug+"; ")

    oCurrentConceptGraph.conceptGraphData.slug = currentConceptGraphSlug
    oCurrentConceptGraph.conceptGraphData.name =currentConceptGraphName
    oCurrentConceptGraph.conceptGraphData.title = currentConceptGraphTitle
    oCurrentConceptGraph.conceptGraphData.description = currentConceptGraphDescription

    await MiscFunctions.createOrUpdateWordInAllTables(oCurrentConceptGraph)

    commandHTML += "UPDATE myConceptGraphs ";
    commandHTML += " SET ";
    commandHTML += " slug='"+currentConceptGraphSlug+"', ";
    commandHTML += " name='"+currentConceptGraphName+"', ";
    commandHTML += " title='"+currentConceptGraphTitle+"', ";
    commandHTML += " tableName='"+currentConceptGraphTableName+"', ";
    commandHTML += " mainSchema_slug='"+currentConceptGraphMainSchemaSlug+"', ";
    commandHTML += " description='"+currentConceptGraphDescription+"' ";
    commandHTML += " WHERE id='"+currentConceptGraphSqlId+"' ";

    console.log("updateCurrentConceptGraph commandHTML: "+commandHTML)

    jQuery("#sqlCommandContainer").html(commandHTML);
    jQuery("#sqlCommandContainer").val(commandHTML);

    var sql = commandHTML;
    console.log("sql: "+sql)
    sendAsync(sql).then((result) => {
        var sResult = JSON.stringify(result,null,4)
        jQuery("#sqlResultContainer_mNWTP").html(sResult)
        jQuery("#sqlResultContainer_mNWTP").val(sResult)
        console.log("sResult: "+sResult)
    })
}

const populateConceptGraphFields = async (foo, sqlid) => {
    var sql = " SELECT * FROM myConceptGraphs WHERE id='"+sqlid+"' ";
    console.log("sql: "+sql)

    var result = foo + await sendAsync(sql).then( async (result) => {
        var oConceptGraphData = result[0];
        console.log("oConceptGraphData: "+JSON.stringify(oConceptGraphData,null,4))
        var currConceptGraphSlug = oConceptGraphData.slug;
        var currConceptGraphName = oConceptGraphData.name;
        var currConceptGraphTitle = oConceptGraphData.title;
        var currConceptGraphTableName = oConceptGraphData.tableName;
        var currConceptGraphMainSchemaSlug = oConceptGraphData.mainSchema_slug;
        var currConceptGraphDescription = oConceptGraphData.description;

        jQuery("#currentConceptGraphSqlIdField").html(sqlid);
        jQuery("#currentConceptGraphSlugField").val(currConceptGraphSlug);
        jQuery("#currentConceptGraphNameField").val(currConceptGraphName);
        jQuery("#currentConceptGraphTitleField").val(currConceptGraphTitle);
        jQuery("#currentConceptGraphTableNameField").val(currConceptGraphTableName);
        jQuery("#currentConceptGraphMainSchemaSlugField").val(currConceptGraphMainSchemaSlug);
        jQuery("#currentConceptGraphDescriptionField").val(currConceptGraphDescription);

        return "foo_";
    })
    return result;
}

const doesTableExist = async (foo,conceptGraphTableName) => {
    var resultHTML = "";
    var sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='"+conceptGraphTableName+"' ";
    console.log("sql: "+sql)
    var output = foo + await sendAsync(sql).then( async (result) => {
        var numTables = result.length;
        if (numTables==1) {
            resultHTML += "YES ";
            jQuery("#makeTableButton").css("backgroundColor","#AFAFAF")
        } else {
            resultHTML += "NO ";
        }
        resultHTML += "<div style=font-size:12px;display:inline-block;vertical-align:middle; >";
        resultHTML += " number of tables called "+conceptGraphTableName+": "+numTables;
        resultHTML += "</ div>";

        jQuery("#doesTableExistContainer").html(resultHTML);
        return "moreFoo_"+numTables;
    });
    return output;
}

const doesThisConceptGraphHaveThisSlug = async (foo, conceptGraphTableName,conceptGraphMainSchemaSlug) => {
    var resultHTML = "";
    var sql = " SELECT * FROM "+conceptGraphTableName+" WHERE slug='"+conceptGraphMainSchemaSlug+"' ";
    console.log("sql: "+sql)
    var output = foo + await sendAsync(sql).then( async (result) => {
        var numTables = result.length;
        if (numTables==1) {
            resultHTML += "YES ";
            // jQuery("#makeMainSchemaButton").css("display","none")
            jQuery("#makeMainSchemaButton").css("backgroundColor","#AFAFAF")
        } else {
            resultHTML += "NO ";
        }
        resultHTML += "<div style=font-size:12px;display:inline-block;vertical-align:middle; >";
        resultHTML += " in table "+conceptGraphTableName+", number of words with slug="+conceptGraphMainSchemaSlug+": "+numTables;
        resultHTML += "</ div>";

        jQuery("#doesMainSchemaExistContainer").html(resultHTML);
        return "moreFoo_"+numTables;
    });
    return output;
}

export const updateNodeLookup3 = async (res2, conceptGraphTableName) => {
    // console.log("updateNodeLookup from transferSqlToDOM; conceptGraphTableName: "+conceptGraphTableName)
    if (conceptGraphTableName=="") {
        var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName;
    }
    var sql = " SELECT * from "+conceptGraphTableName;
    console.log("updateNodeLookup3 from EditExistingConceptGraphPage; sql: "+sql)

    var result = res2 + await sendAsync(sql).then( async (result) => {
        var aResult = result;
        console.log("updateNodeLookup3; aResult: "+JSON.stringify(aResult,null,4))
        var msgIfError = "SQLITE_ERROR: no such table: "+conceptGraphTableName;
        if (result == msgIfError) {
            console.log("Table "+conceptGraphTableName+" does not exist!")
        }
        if (result != msgIfError) {
            var numRows = aResult.length;
            console.log("updateNodeLookup from EditExistingConceptGraphPage; numRows: "+numRows)
            window.lookupWordBySlug = {};

            window.lookupSqlIDBySlug = {};
            window.lookupSlugBySqlID = {};

            window.allConceptGraphRelationships = [];

            window.neuroCore.subject.allConceptGraphRelationships = [];
            window.neuroCore.subject.oRFL.current = {};
            window.neuroCore.subject.oRFL.new = {};
            window.neuroCore.subject.oRFL.updated = {};

            for (var r=0;r<numRows;r++) {
                if (r > 0) {
                    // window.mustReload_lookupWordBySlug = false;
                }
                var oNextWord = aResult[r];
                var nextWord_id = oNextWord.id;
                var nextWord_slug = oNextWord.slug;
                var nextWord_rawFile = oNextWord.rawFile;
                var nextWord_deleted = oNextWord.deleted;
                var oNextWord = JSON.parse(nextWord_rawFile);
                if (nextWord_deleted != 1) {
                    window.neuroCore.subject.oRFL.current[nextWord_slug] = oNextWord;
                    window.lookupWordBySlug[nextWord_slug] = oNextWord;

                    window.lookupSqlIDBySlug[nextWord_slug] = nextWord_id;
                    window.lookupSlugBySqlID[nextWord_id] = nextWord_slug;
                }
                if (oNextWord.hasOwnProperty("schemaData")) {
                    var aNextSchemaRels = oNextWord.schemaData.relationships;
                    for (var z=0;z < aNextSchemaRels.length;z++ ) {
                        var oNextRel = aNextSchemaRels[z];
                        window.allConceptGraphRelationships.push(oNextRel)
                        window.neuroCore.subject.allConceptGraphRelationships.push(oNextRel)
                    }
                }
                if (r == numRows - 1) {
                    console.log("setting window.mustReload_lookupWordBySlug = false")
                    window.mustReload_lookupWordBySlug = false;
                }
                // console.log("updateNodeLookup from EditExistingConceptGraphPage; success: r="+r)
            }
        }
        return "foo_"+numRows;
    })
    jQuery("#neuroCore2subjectContainer").html(conceptGraphTableName)
    // alert("done with updateNodeLookup")

    return result;
}

export default class EditExistingConceptGraphPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptGraphSqlID: null,
            conceptGraphTableName: null,
            conceptGraphTableNamePath: null,
            conceptGraphMainSchemaSlug: null
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var previousConceptGraphSqlID = window.currentConceptGraphSqlID;

        var conceptGraphSqlID = this.props.match.params.conceptgraphsqlid
        if (conceptGraphSqlID=="current") {
            conceptGraphSqlID = window.currentConceptGraphSqlID;
        } else {
            // for now, navigating to this page resets both the "active" concept graph (the one being viewed below the masthead)
            // and the neuroCore subject concept graph to the same thing.
            // Future: may make it possible to set neuroCore subject concept graph to something other than the "active" concept graph
            window.currentConceptGraphSqlID = conceptGraphSqlID;
            window.neuroCore.subject.currentConceptGraphSqlID = conceptGraphSqlID;
        }

        var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[conceptGraphSqlID].tableName
        var conceptGraphMainSchemaSlug = window.aLookupConceptGraphInfoBySqlID[conceptGraphSqlID].mainSchema_slug;
        var conceptGraphTableNamePath = "/SQLViewSingleTablePage/"+conceptGraphTableName;

        this.setState({
            conceptGraphSqlID: conceptGraphSqlID,
            conceptGraphTableName: conceptGraphTableName,
            conceptGraphTableNamePath: conceptGraphTableNamePath,
            conceptGraphMainSchemaSlug: conceptGraphMainSchemaSlug
        })

        var newConceptGraphSqlID = window.currentConceptGraphSqlID;
        if (previousConceptGraphSqlID != newConceptGraphSqlID) {
            console.log("need to set Concept Slug to blank!")
            // window.currentConceptSqlID = 0;
            // window.aLookupConceptInfoBySqlID = [];
            /*
            window.currentConceptSqlID = conceptGraphSqlID;
            window.aLookupConceptInfoBySqlID[conceptGraphSqlID] = {};
            window.aLookupConceptInfoBySqlID[conceptGraphSqlID].name = conceptGraphTableName;
            window.aLookupConceptInfoBySqlID[conceptGraphSqlID].title = conceptGraphTableName;
            */
        }
        /*
        window.currentConceptSqlID = conceptGraphSqlID;
        window.aLookupConceptInfoBySqlID[conceptGraphSqlID] = {};
        window.aLookupConceptInfoBySqlID[conceptGraphSqlID].name = conceptGraphTableName;
        window.aLookupConceptInfoBySqlID[conceptGraphSqlID].title = conceptGraphTableName;
        */

        jQuery("#updateCurrentConceptGraphButton").click(function(){
            updateCurrentConceptGraph();
        })

        jQuery("#deleteCurrentConceptGraphButton").click(function(){
        })

        var t0 = 1;

        var t4 = await populateConceptGraphFields(t0,conceptGraphSqlID);

        MiscFunctions.updateMastheadBar();



        var t1 = await updateNodeLookup3(t0,conceptGraphTableName);
        var t2 = await doesTableExist(t0,conceptGraphTableName);
        var t3 = await doesThisConceptGraphHaveThisSlug(t0,conceptGraphTableName,conceptGraphMainSchemaSlug)
        /*
        setTimeout( async function(){
            var t1 = await updateNodeLookup3(t0,conceptGraphTableName);
        },1000);
        setTimeout( async function(){
            doesTableExist(t0,conceptGraphTableName);
        },3000);
        setTimeout( async function(){
            doesThisConceptGraphHaveThisSlug(t0,conceptGraphTableName,conceptGraphMainSchemaSlug)
        },4000);
        */
        /*
        // test whether a ssl table with name: conceptGraphTableName exists
        // doesTableExist(conceptGraphTableName);
        setTimeout( async function(){
            doesTableExist(conceptGraphTableName);
        },1000);

        // test whether conceptGraphMainSchemaSlug exists within this concept graph table
        // doesThisConceptGraphHaveThisSlug(conceptGraphTableName,conceptGraphMainSchemaSlug)
        setTimeout( async function(){
            doesThisConceptGraphHaveThisSlug(conceptGraphTableName,conceptGraphMainSchemaSlug)
        },2000);

        var t3 = timeout(10)

        setTimeout( async function(){
            TxSqlFunctions.updateNodeLookup(t3,conceptGraphTableName);
        },3000);

        setTimeout( async function(){
            MiscFunctions.updateNodeLookup(conceptGraphTableName);
        },5000);
        */

        var tableInfoButtonHTML = "";
        jQuery("#tableInfoInSettingsButton").attr("to","/SQLViewSingleTablePage/myConceptGraph_anotherTestGraph");

        jQuery("#makeTableButton").click(function(){
            console.log("makeTableButton")
            var newTableName = jQuery("#currentConceptGraphTableNameField").val()
            MiscFunctions.makeConceptGraphTable(newTableName)
        })

        jQuery("#makeMainSchemaButton").click(async function(){
            console.log("makeMainSchemaButton (not yet implemented)")
            var newMainSchemaSlug = jQuery("#currentConceptGraphMainSchemaSlugField").val();
            var myConceptGraph_tableName = jQuery("#currentConceptGraphTableNameField").val();
            // var oNewMainSchemaTemplate = window.lookupWordTypeTemplate.schema;

            var oNewMainSchemaTemplate = await MiscFunctions.createNewWordByTemplate("conceptGraph")

            oNewMainSchemaTemplate.wordData.slug = newMainSchemaSlug;
            oNewMainSchemaTemplate.wordData.name = "main schema for concept graph";
            oNewMainSchemaTemplate.wordData.title = "Main Schema for Concept Graph";
            oNewMainSchemaTemplate.schemaData.metaData.types.push("mainSchemaForConceptGraph");
            oNewMainSchemaTemplate.schemaData.types.push("mainSchemaForConceptGraph");
            oNewMainSchemaTemplate.globalDynamicData.myConceptGraphs = [myConceptGraph_tableName];
            var sNewMainSchemaTemplate = JSON.stringify(oNewMainSchemaTemplate,null,4);
            jQuery("#newMainSchemaContainer").val(sNewMainSchemaTemplate)
            jQuery("#newMainSchemaContainer").css("display","block")
            // need to have:
            // wordData.slug,
            // metaData.ipns, keyname
            // globalDynamicData.myDictionaries, myConceptGraphs
            MiscFunctions.createOrUpdateWordInAllTables(oNewMainSchemaTemplate)
        })
        jQuery("#deleteWordsInCurrentConceptGraphButton").click( async function(){
            var oMainSchemaForConceptGraph = window.lookupWordBySlug[conceptGraphMainSchemaSlug];
            oMainSchemaForConceptGraph.conceptGraphData.concepts = [];
            oMainSchemaForConceptGraph.conceptGraphData.schemas = [];
            oMainSchemaForConceptGraph.schemaData.nodes = [];
            oMainSchemaForConceptGraph.schemaData.schemaImports = [];
            oMainSchemaForConceptGraph.schemaData.relationships = [];
            await MiscFunctions.createOrUpdateWordInAllTables(oMainSchemaForConceptGraph)
            var sql = " DELETE from " + conceptGraphTableName
            sql += " WHERE slug != '"+conceptGraphMainSchemaSlug+"' ";
            sendAsync(sql).then((result) => {})

            console.log("deleteWordsInCurrentConceptGraphButton clicked; sql: "+sql)
            console.log("deleteWordsInCurrentConceptGraphButton clicked; oMainSchemaForConceptGraph: "+JSON.stringify(oMainSchemaForConceptGraph,null,4))
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
                        <div class="h2">Show / Edit Concept Graph General Info</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>

                        <div style={{marginTop:"20px"}}>
                            <div className="makeNewPanelContainer">
                                <div className="makeNewLeftPanel">
                                sql ID
                                </div>
                                <div id="currentConceptGraphSqlIdField" className="makeNewRightPanel" style={{backgroundColor:"#EFEFEF"}}>
                                </div>
                            </div>

                            <div className="makeNewPanelContainer">
                                <div className="makeNewLeftPanel">
                                slug
                                </div>
                                <textarea id="currentConceptGraphSlugField" className="makeNewRightPanel">
                                </textarea>
                            </div>

                            <div className="makeNewPanelContainer">
                                <div className="makeNewLeftPanel">
                                name
                                </div>
                                <textarea id="currentConceptGraphNameField" className="makeNewRightPanel">
                                </textarea>
                            </div>

                            <div className="makeNewPanelContainer">
                                <div className="makeNewLeftPanel">
                                title
                                </div>
                                <textarea id="currentConceptGraphTitleField" className="makeNewRightPanel">
                                </textarea>
                            </div>

                            <div className="makeNewPanelContainer">
                                <div className="makeNewLeftPanel">
                                tableName
                                </div>
                                <textarea id="currentConceptGraphTableNameField" className="makeNewRightPanel">
                                </textarea>
                                <Link id="tableInfoInSettingsButton" className='doSomethingButton' style={{verticalAlign:"top"}} to={this.state.conceptGraphTableNamePath} >view table info (in settings: SQL)</Link>
                            </div>

                            <div className="makeNewPanelContainer">
                                <div className="makeNewLeftPanel">
                                mainSchema_slug
                                </div>
                                <textarea id="currentConceptGraphMainSchemaSlugField" className="makeNewRightPanel">
                                </textarea>
                            </div>

                            <div className="makeNewPanelContainer">
                                <div className="makeNewLeftPanel">
                                description
                                </div>
                                <textarea id="currentConceptGraphDescriptionField" className="makeNewRightPanel" style={{height:"50px"}}>
                                </textarea>
                            </div>

                            <div className="makeNewPanelContainer">
                                <div className="makeNewLeftPanel">

                                </div>
                                <div style={{display:"inline-block",marginLeft:"20px"}} >
                                    <div id="updateCurrentConceptGraphButton" className="doSomethingButton" >update this Concept Graph with above fields</div>
                                    <br/>
                                    <div id="deleteWordsInCurrentConceptGraphButton" className="doSomethingButton" >DELETE EVERY WORD in this Concept Graph</div> <div style={{display:"inline-block",color:"red"}} >careful !!!</div>
                                    <br/>
                                    <div style={{fontSize:"12px"}} >Deletes every word EXCEPT mainSchemaForConceptGraph, which is edited to set conceptGraphData.concepts and .schemas to empty sets </div>
                                    <br/>
                                    <div id="deleteCurrentConceptGraphButton" className="doSomethingButton" >delete this Concept Graph (not yet functional)</div>
                                </div>
                            </div>

                            <br/><br/>

                            <div className="makeNewPanelContainer">
                                <div className="makeNewLeftPanel">
                                does table exist?
                                </div>
                                <div id="doesTableExistContainer" style={{display:"inline-block",marginLeft:"20px"}}  >
                                ?
                                </div>
                            </div>

                            <div className="makeNewPanelContainer">
                                <div className="makeNewLeftPanel">
                                does mainSchema exist?
                                </div>
                                <div id="doesMainSchemaExistContainer" style={{display:"inline-block",marginLeft:"20px"}}  >
                                ?
                                </div>
                            </div>

                            <div className="makeNewPanelContainer">
                                <div className="makeNewLeftPanel">

                                </div>
                                <div style={{display:"inline-block",marginLeft:"20px"}} >
                                    <div id="makeTableButton" className="doSomethingButton" >Make Table</div>
                                    <br/>
                                    <div id="makeMainSchemaButton" className="doSomethingButton" >Make Main Schema for this table</div>
                                </div>
                            </div>

                            <textarea id="newMainSchemaContainer" style={{display:"none",marginLeft:"320px",marginTop:"20px",width:"600px",height:"500px"}}>
                                newMainSchemaContainer
                            </textarea>

                            <div style={{display:"none" }}>
                                <div id="sqlCommandContainer" >sqlCommandContainer</div>

                                <br/>

                                <div id="sqlResultContainer_mNWTP" >sqlResultContainer_mNWTP</div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
