import React, { useState } from 'react';
import { NavLink, Link, useHistory, useParams } from "react-router-dom";
// import * as Constants from '../../conceptGraphMasthead.js';
import ConceptGraphMasthead, { conceptGraphs_masthead_arr, conceptGraphsDataByTableName_obj } from '../../conceptGraphMasthead.js';
import LeftNavbar from '../../LeftNavbar';
import sendAsync from '../../renderer';
import * as Sqlite3Constants from '../../lib/sqlite3/sqlite3-constants';
import * as MiscFunctions from '../../lib/miscFunctions.js';

const myConceptGraph_class_fields = Sqlite3Constants.myConceptGraph_class_fields;

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

function IsValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function makeTable(tableName,dDataSet) {
    var dtable = jQuery('#table_myConceptGraph').DataTable({
        data: dDataSet,
        pageLength: 100,
        "columns": [
            {
                "class":          'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
            { visible: false },
            { visible: false },
            { visible: false },
            { visible: false },
            { },
            { },
            { },
            { visible: false },
            { visible: false },
            { visible: false },
            { visible: false },
            { visible: false },
            { visible: false },
            { visible: false },
            { visible: false }
        ],
        "dom": '<"pull-left"f><"pull-right"l>tip'
    });
    /*
    var activeConceptGraphTitle = "	Concept Graph: Temporary For Testing Shit";
    jQuery("#activeConceptGraphTitle").html(activeConceptGraphTitle);
    var activeConceptGraphTableName = "myConceptGraph_temporary";
    jQuery("#activeConceptGraphTableName").html(activeConceptGraphTableName);
    */
    // Setup - add a text input to each footer cell
    jQuery('#table_myConceptGraph tfoot th').each( function () {
        var title = jQuery(this).text();
        if (title) {
            jQuery(this).html( '<input id="searchField_'+title+'" type="text" placeholder="Search '+title+'" />' );
        }
    } );
    // Apply the search
    var coolFunc = dtable.columns().every( function () {
        var that = this;

        jQuery( 'input', this.footer() ).on( 'keyup change', function () {
            if ( that.search() !== this.value ) {
                that
                    .search( this.value )
                    .draw();
            }
        } );
    });

    // Add event listener for opening and closing details
    jQuery('#table_myConceptGraph tbody').on('click', 'td.details-control', function () {
        // console.log("clicked icon");
        var tr = jQuery(this).parents('tr');
        var row = dtable.row( tr );
        // console.log("row: "+row);
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }

        else {
            var d=row.data();
            var sqlid = d[2];
            var rawFile = d[3];
            if (IsValidJSONString(rawFile)) {
                rawFile = JSON.stringify(JSON.parse(rawFile),null,4);
            }
            var keyname = d[4];
            var slug = d[5];
            var wordTypes = d[6];
            var ipns_fs = d[7];
            var ipns = d[8];
            var next_ipfs = d[9];
            // console.log("keyname: "+ keyname);
            // console.log("rawFile: "+ rawFile);
            // console.log("slug: "+ slug);
            // console.log("wordTypes: "+ wordTypes);
            // console.log("ipns_fs: "+ ipns_fs);
            // hiddenText = document.getElementById(keyname).innerHTML;
            // document.getElementById('target_'+keyname).innerHTML = hiddenText;
            var uniqueID=sqlid;
            var expansionHTML = "";
                expansionHTML += "<div id='target_"+uniqueID+"' style='width:90%;' >"
                ////////////// TAB 1
                expansionHTML += "<div id="+uniqueID+"_tab1 data-tab-button='"+ uniqueID +"_content1' class=tableSelectButton_hiddenPanels >";
                expansionHTML += "current";
                expansionHTML += "</div>";
                ////////////// TAB 2
                expansionHTML += "<div id="+uniqueID+"_tab2 data-tab-button='"+ uniqueID +"_content2' class=tableSelectButton_hiddenPanels >";
                expansionHTML += "edit";
                expansionHTML += "</div>";
                ////////////// TAB 3
                expansionHTML += "<div id="+uniqueID+"_tab3 data-tab-button='"+ uniqueID +"_content3' class=tableSelectButton_hiddenPanels style=border-bottom:1px solid #EEEEEE; >";
                expansionHTML += "validation";
                expansionHTML += "</div>";

                expansionHTML += uniqueID;
                expansionHTML += "<div class=smallDictionaryDoSomethingButton id=fetchSingleFileFromIPFS_"+uniqueID+" onclick=fetchSingleFileFromIPFS('"+ipns+"') >fetch file from IPFS</div>";
                expansionHTML += "<br>";

                ////////////// CONTENT 1
                expansionHTML += "<div id="+uniqueID+"_content1 class=hidenPanel_contentBox >";
                    expansionHTML += "<pre style=background-color:#EFEFEF;width:90%;height:400px;overflow:scroll; >";
                    expansionHTML += rawFile;
                    expansionHTML += "</pre>";
                expansionHTML += "</div>";

                ////////////// CONTENT 2
                expansionHTML += "<div id="+uniqueID+"_content2 class=hidenPanel_contentBox style=display:none; >";
                    expansionHTML += "<div id=update_"+uniqueID+" data-sqlid='"+uniqueID+"' class=updateEntryButton >UPDATE</div>";
                    expansionHTML += "<br>";
                        expansionHTML += "Slug: <input type='text' rows='1' cols='40' style=inline-block; id=newSlug_"+uniqueID+" value='"+slug+"' ></input>";
                    expansionHTML += "wordTypes: ";
                        expansionHTML += "<input type='text' rows='1' cols='40' id=newWordWordTypes_"+uniqueID+" value='"+wordTypes+"' style=inline-block; >";
                        expansionHTML += "</input>";
                    expansionHTML += "<div>";
                        expansionHTML += "<textarea name=schemaText id=newWordJsonFile_"+uniqueID+" style=font-size:10px;width:80%;height:400px; >";
                        expansionHTML += rawFile;
                        expansionHTML += "</textarea>";
                    expansionHTML += "</div>";
                expansionHTML += "</div>";

                ////////////// CONTENT 3
                expansionHTML += "<div id="+uniqueID+"_content3 class=hidenPanel_contentBox >";
                    expansionHTML += "<pre style=background-color:#EFEFEF;width:90%;height:800px;overflow:scroll; >";
                    // validationResult_obj = validateWord(rawFile);
                    // validationResult_str = JSON.stringify(validationResult_obj,null,4);
                    // vR_obj = valResult_obj[slug];
                    /*
                    var vR_obj = validationBySlug_obj[slug];
                    var validationResult_str = JSON.stringify(vR_obj,null,4);

                    expansionHTML += validationResult_str;
                    */
                    expansionHTML += "</pre>";
                expansionHTML += "</div>";

            expansionHTML += "</div>";

            row.child( expansionHTML ).show();
            tr.addClass('shown');

            jQuery("#update_"+uniqueID).click(function(){
                var thisID = this.id;
                var sqlid = jQuery("#"+thisID).data("sqlid");
                var thisRawFile = jQuery("#newWordJsonFile_"+sqlid).val();
                var thisWordTypes = jQuery("#newWordWordTypes_"+sqlid).val();
                var thisSlug = jQuery("#newSlug_"+sqlid).val();
                // console.log("updateEntryButton; thisID: "+thisID+"; sqlid: "+sqlid+"; thisRawFile: "+thisRawFile+"; thisWordTypes: "+thisWordTypes);
                var updateCommands = "";
                updateCommands += " UPDATE "+tableName;
                updateCommands += " SET rawFile='"+ thisRawFile +"' ";
                updateCommands += " , slug='"+ thisSlug +"' ";
                updateCommands += " , wordTypes='"+ thisWordTypes +"' ";
                updateCommands += " WHERE id='"+sqlid+"' "
                // console.log("updateCommands: "+updateCommands);
                sendAsync(updateCommands)
            })

            jQuery(".tableSelectButton_hiddenPanels").click(function() {
                document.getElementById(uniqueID+"_content1").style.display="none";
                document.getElementById(uniqueID+"_content2").style.display="none";
                document.getElementById(uniqueID+"_content3").style.display="none";

                document.getElementById(uniqueID+"_tab1").style.borderBottom = "1px solid black";
                document.getElementById(uniqueID+"_tab2").style.borderBottom = "1px solid black";
                document.getElementById(uniqueID+"_tab3").style.borderBottom = "1px solid black";
            });
            jQuery(".tableSelectButton_hiddenPanels").click(function() {
                var dataTabId = this.getAttribute("data-tab-button");
                document.getElementById(dataTabId).style.display="block";
                this.style.borderBottom = "1px solid #EEEEEE";
                /*
                if (dataTabId == uniqueID+"_content1") {
                    document.getElementById(uniqueID+"_section_1").style.display="block";
                    currentTabState[uniqueID]=1;
                }
                if (dataTabId == uniqueID+"_content2") {
                    document.getElementById(uniqueID+"_section_2").style.display="block";
                    currentTabState[uniqueID]=2;
                }
                if (dataTabId == uniqueID+"_content3") {
                    document.getElementById(uniqueID+"_section_3").style.display="block";
                    currentTabState[uniqueID]=3;
                }
                */
            });
        }
    } );
    jQuery("#deleteFilteredWordsFromMyConceptGraph").click(function(){
        console.log("deleteFilteredWordsFromMyConceptGraph clicked")
        dtable.rows({"search":"applied" }).every( function () {
            var d = this.data();
            var id = d[2];
            var slug = d[5];
            console.log("slug: "+slug)
            var deleteRowCommands = " DELETE FROM "+tableName;
            deleteRowCommands += " WHERE id='"+id+"' ";
            console.log("deleteRowCommands: "+deleteRowCommands)
            sendAsync(deleteRowCommands);
            var currentResult = jQuery("#deletedFilteredWordsCount").html()
            var newResult=parseInt(currentResult);
            newResult++;
            jQuery("#deletedFilteredWordsCount").html(newResult);
        });
    });
    jQuery("#transferFilteredWordsFromThisToAnotherMyConceptGraph").click(function(){
        console.log("transferFilteredWordsFromThisToAnotherMyConceptGraph clicked")
        var transferToTableName = jQuery("#transferToMyConceptGraphSelector option:selected").data("mcgtablename")
        dtable.rows({"search":"applied" }).every( function () {
            var d = this.data();
            var id = d[2];
            var slug = d[5];
            var rawFile = d[3];
            var nextWord_obj = JSON.parse(rawFile);
            nextWord_obj.globalDynamicData.myConceptGraphs = [ transferToTableName ]
            console.log("slug: "+slug+"; rawFile: "+rawFile)
            MiscFunctions.createOrUpdateWordInAllTables(nextWord_obj);
        });
    });
    jQuery("#transferSelectedSchemaFromThisToAnotherMyConceptGraph").click(function(){

        var schemaToTransfer_slug = jQuery("#schemaToTransferSelector option:selected").data("slug")
        var transferToTableName = jQuery("#transferToMyConceptGraphSelector option:selected").data("mcgtablename")
        console.log("transferSelectedSchemaFromThisToAnotherMyConceptGraph clicked; schemaToTransfer_slug: "+schemaToTransfer_slug+"; transferToTableName: "+transferToTableName)
        var schemaToTransfer_rF = thisConceptGraph_rawFileLookup[schemaToTransfer_slug];
        console.log("schemaToTransfer_rF: "+schemaToTransfer_rF)
        var schemaToTransfer_obj = JSON.parse(schemaToTransfer_rF);
        var nodesToTransfer_arr = schemaToTransfer_obj.schemaData.nodes;
        var numNodesToTransfer = nodesToTransfer_arr.length;
        for (var n=0;n<numNodesToTransfer;n++) {
            var nextNodeToTransfer_slug = nodesToTransfer_arr[n].slug;
            var nextNodeToTransfer_rawFile = thisConceptGraph_rawFileLookup[nextNodeToTransfer_slug];
            var nextNodeToTransfer_obj = JSON.parse(nextNodeToTransfer_rawFile);
            nextNodeToTransfer_obj.globalDynamicData.myConceptGraphs = [ transferToTableName ]
            console.log("nextNodeToTransfer_slug: "+nextNodeToTransfer_slug+"; nextNodeToTransfer_rawFile: "+nextNodeToTransfer_rawFile)
            MiscFunctions.createOrUpdateWordInAllTables(nextNodeToTransfer_obj);
        }

        /*

            var nextWord_obj = JSON.parse(rawFile);
            nextWord_obj.globalDynamicData.myConceptGraphs = [ transferToTableName ]
            console.log("slug: "+slug+"; rawFile: "+rawFile)
            MiscFunctions.createOrUpdateWordInAllTables(nextWord_obj);
        */
    });
    jQuery("#mirrorFilteredWordsFromMyConceptGraphIntoConceptGraph").click(function(){
        // console.log("mirrorFilteredWordsFromMyConceptGraphIntoConceptGraph clicked")
        // SEE CORRESPONDING event listener in PGA-CGD (viewMyConceptGraph.js, same button name)
        // works I think in pgs-cgd
    });
    jQuery("#createIPNSForFilteredWordsFromMyConceptGraph").click(function(){
        // console.log("createIPNSForFilteredWordsFromMyConceptGraph clicked")
        // SEE CORRESPONDING event listener in PGA-CGD (viewMyConceptGraph.js, same button name)
        // maybe works but with issues in pga-cgd
    });
    jQuery("#createKeynameForFilteredWordsFromMyConceptGraph").click(function(){
        // console.log("createKeynameForFilteredWordsFromMyConceptGraph clicked")
        // SEE CORRESPONDING event listener in PGA-CGD (viewMyConceptGraph.js, same button name)
        // (works in PGA-CGD as of 8 July 2021)
    });
    jQuery("#updateIPFSForFilteredWordsFromMyConceptGraph").click(function(){
        // console.log("updateIPFSForFilteredWordsFromMyConceptGraph clicked")
        // SEE CORRESPONDING event listener in PGA-CGD (viewMyConceptGraph.js, same button name)
        // (not yet implemented in PGA-CGD as of 8 July 2021)
    });
}

function send(sql) {
    // console.log("send; sql: "+sql)
    sendAsync(sql).then((result) => this.setResponse({response: result}) );
}

async function makeConceptGraphSelector() {
  var sql2 = " SELECT * FROM myConceptGraphs ";
  //
  // var testLink = "<Link class='navButton' to='/'>test link</Link>";

  sendAsync(sql2).then((result) => {
        // this.setState({response: JSON.stringify(result,null,4) } )
        // var dDataSet = [];
        var conceptGraphs_arr = result;

        var numConceptGraphs = conceptGraphs_arr.length;
        console.log("numConceptGraphs: "+numConceptGraphs)
        var selectorHTML = "";
        selectorHTML += "<select id=transferToMyConceptGraphSelector >";
        for (var w=0;w<numConceptGraphs;w++) {
            var nextConceptGraph_id = conceptGraphs_arr[w].id;
            var nextConceptGraph_slug = conceptGraphs_arr[w].slug;
            var nextConceptGraph_title = conceptGraphs_arr[w].title;
            var nextConceptGraph_tableName = conceptGraphs_arr[w].tableName;
            var nextConceptGraph_description = conceptGraphs_arr[w].description;
            var nextConceptGraph_rootSchemaIPNS = conceptGraphs_arr[w].rootSchemaIPNS;
            var nextConceptGraph_refDictionary = conceptGraphs_arr[w].referenceDictionary_tableName;
            var nextConceptGraph_gDDKeywords = conceptGraphs_arr[w].globalDynamicData_keywords;
            var nextConceptGraph_rawFile = conceptGraphs_arr[w].rawFile;
            var nextConceptGraph_arr = ["",w,nextConceptGraph_id,
                nextConceptGraph_description,
                nextConceptGraph_title,
                nextConceptGraph_tableName,
                nextConceptGraph_slug,
                nextConceptGraph_rootSchemaIPNS,
                nextConceptGraph_title,
                nextConceptGraph_refDictionary,
                nextConceptGraph_tableName
              ];
            // dDataSet.push(nextConceptGraph_arr);
            selectorHTML += "<option ";
            selectorHTML += " data-mcgslug="+nextConceptGraph_slug+" ";
            selectorHTML += " data-mcgtablename="+nextConceptGraph_tableName+" ";
            selectorHTML += " data-mcgrootschemaipns="+nextConceptGraph_rootSchemaIPNS+" ";
            selectorHTML += " data-mcgid="+nextConceptGraph_id+" ";
            selectorHTML += " data-mcgtitle="+nextConceptGraph_title+" ";
            selectorHTML += " >";
            selectorHTML += nextConceptGraph_tableName;
            selectorHTML += "</option>";
        }
        selectorHTML += "</select>";
        jQuery("#selector_listOfMyConceptGraphs").html(selectorHTML);
  });
}

var thisConceptGraph_rawFileLookup = {};

export default class ViewMyConceptGraph extends React.Component {

    componentDidMount() {

        // works: this gets tablename from link passed as state variable, e.g. to: {state: {tablename: 'myConceptGraph_pga'}}
        // var tableName = this.props.location.state.tablename;
        // this gets tablename from link, e.g. ViewMyConceptGraph/myConceptGraph_pga
        var tableName = this.props.match.params.tablename
        // const { foo } = this.props.match.params
        // const { tablename } = this.props.location.state

        var sql = " SELECT * FROM "+tableName;
        sendAsync(sql).then((result) => {
              this.setState({response: JSON.stringify(result,null,4) } )
              var dDataSet = [];

              var words_arr = result;
              var numWords = words_arr.length;
              // console.log("numWords: "+numWords)
              var selectorHTML = "";
              selectorHTML += "<select id=schemaToTransferSelector >";
              for (var w=0;w<numWords;w++) {
                  var nextWord_id = words_arr[w].id;
                  var nextWord_slug = words_arr[w].slug;
                  var nextWord_keyname = words_arr[w].keyname;
                  var nextWord_ipns = words_arr[w].ipns;
                  var nextWord_ipfs = words_arr[w].ipfs;
                  var nextWord_wordTypes = words_arr[w].wordTypes;
                  var nextWord_title_rS = words_arr[w].title_rS;
                  var nextWord_table_rS = words_arr[w].table_rS;
                  var nextWord_comments_rS = words_arr[w].comments_rS;
                  var nextWord_rawFile = words_arr[w].rawFile;
                  var nextWord_lastUpdate_local = words_arr[w].lastUpdate_local;
                  var nextWord_referenceDictionary = words_arr[w].referenceDictionary;
                  var nextWord_keyname_reference = words_arr[w].keyname_reference;
                  var nextWord_slug_reference = words_arr[w].slug_reference;
                  var nextWord_ipns_reference = words_arr[w].ipns_reference;
                  var nextWord_lastUpdate_reference = words_arr[w].lastUpdate_reference;
                  var nextWord_lastUpdate_reference = words_arr[w].lastUpdate_reference;
                  var nextWord_whenCreated = words_arr[w].whenCreated;

                  console.log("nextWord_slug: "+nextWord_slug)
                  console.log("nextWord_keyname: "+nextWord_keyname)
                  console.log("nextWord_title_rS: "+nextWord_title_rS)
                  console.log("nextWord_ipns: "+nextWord_ipns)
                  console.log("nextWord_wordTypes: "+nextWord_wordTypes)



                  thisConceptGraph_rawFileLookup[nextWord_slug] = nextWord_rawFile;

                  var nextWord_IPNS_IPFS = nextWord_ipns+"<br/>"+nextWord_ipfs;
                  var nextWord_referenceDictionary_html = "create html";
                  var nextWord_arr = ["",w,
                      nextWord_id,
                      nextWord_rawFile,
                      nextWord_keyname,
                      nextWord_slug,
                      nextWord_wordTypes,
                      nextWord_IPNS_IPFS,
                      nextWord_ipns,
                      nextWord_ipfs,
                      nextWord_referenceDictionary,
                      nextWord_referenceDictionary_html,
                      nextWord_slug_reference,
                      nextWord_ipns_reference,
                      nextWord_keyname_reference,
                      nextWord_whenCreated
                    ];
                  dDataSet.push(nextWord_arr);

                  var nextWord_obj = JSON.parse(nextWord_rawFile);
                  if (nextWord_obj.hasOwnProperty("wordData")) {
                      var nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
                      if (jQuery.inArray("schema",nextWord_wordTypes_arr) > -1) {
                          selectorHTML += "<option ";
                          selectorHTML += " data-slug="+nextWord_slug+" ";
                          selectorHTML += " data-ipns="+nextWord_ipns+" ";
                          selectorHTML += " data-ipfs="+nextWord_ipfs+" ";
                          selectorHTML += " >";
                          selectorHTML += nextWord_slug;
                          selectorHTML += "</option>";
                      }
                  }
              }
              makeTable(tableName,dDataSet);

              selectorHTML += "</select>";
              jQuery("#selector_listOfSchemas").html(selectorHTML)
              makeConceptGraphSelector();
        });
        jQuery("#newWordButton").click(async function(){
            var newWordSlug = jQuery("#newWordSlug").val();
            var newWordTitle = jQuery("#newWordTitle").val();
            var newWordName = jQuery("#newWordName").val();
            var newWordWordType = jQuery("#newWordWordTypeSelector option:selected").data("wordtypeslug")

            var dictionaryTableName = conceptGraphsDataByTableName_obj[tableName].dictionaryTableName;

            var newWord_rF_obj = await MiscFunctions.createNewWordByTemplate(newWordWordType);
            newWord_rF_obj.wordData.slug = newWordSlug;
            newWord_rF_obj.wordData.name = newWordName;
            newWord_rF_obj.wordData.title = newWordTitle;
            newWord_rF_obj.globalDynamicData.myConceptGraphs = [ tableName ];
            newWord_rF_obj.globalDynamicData.myDictionaries = [ dictionaryTableName ];
            var newWord_rF_str = JSON.stringify(newWord_rF_obj,null,4)
            console.log("newWordButton clicked; newWord_rF_str: "+newWord_rF_str);
            MiscFunctions.createOrUpdateWordInAllTables(newWord_rF_obj);
        });
        jQuery("#createTableIfNotExistsButton").click(function(){
            var createTableCommands = "CREATE TABLE IF NOT EXISTS "+tableName+" ( ";
            createTableCommands += myConceptGraph_class_fields;
            createTableCommands += " ) ";
            sendAsync(createTableCommands);
            console.log("createTableCommands: "+createTableCommands)
        });
        jQuery("#initFilesButton").click(async function(){
            console.log("initFilesButton: ")

            var sql_init = " SELECT * FROM myConceptGraph_starterFiles ";

            sendAsync(sql_init).then((words_arr) => {
                  var numWords = words_arr.length;
                  console.log("numWords: "+numWords)
                  for (var w=0;w<numWords;w++) {
                      var nextWord_id = words_arr[w].id;
                      var nextWord_rF_str = words_arr[w].rawFile;
                      var nextWord_rF_obj = JSON.parse(nextWord_rF_str);
                      var dictionaryTableName = conceptGraphsDataByTableName_obj[tableName].dictionaryTableName;
                      nextWord_rF_obj.globalDynamicData.myConceptGraphs = [ tableName ]
                      nextWord_rF_obj.globalDynamicData.myDictionaries = [ dictionaryTableName ]
                      MiscFunctions.createOrUpdateWordInAllTables(nextWord_rF_obj);
                  }
            });

            /*
            var transferToTableName = jQuery("#transferToMyConceptGraphSelector option:selected").data("mcgtablename")
            dtable.rows({"search":"applied" }).every( function () {
                var d = this.data();
                var id = d[2];
                var slug = d[5];
                var rawFile = d[3];
                var nextWord_obj = JSON.parse(rawFile);
                nextWord_obj.globalDynamicData.myConceptGraphs = [ transferToTableName ]
                console.log("slug: "+slug+"; rawFile: "+rawFile)
                MiscFunctions.createOrUpdateWordInAllTables(nextWord_obj);
            });
            */
        });


    }
 
    constructor(props) {
        // alert("constructor")
         super(props);
         this.state = {};
         this.state.message = 'SELECT * FROM sqlite_master';
         this.state.response = null;
    }

    render() {

      return (
        <>
          <fieldset className="mainBody" >
              <LeftNavbar />
              <div className="mainPanel" >
                  <ConceptGraphMasthead />
                  <div class="h3">View My Concept Graph</div>

                  <center>
                      <div style={{display:"inline-block",fontSize:"20px",textAlign:"left"}}>
                      title: <div id="activeConceptGraphTitle" style={{display:"inline-block",color:"blue"}}>?</div>
                      <br/>
                      tableName: <div id="activeConceptGraphTableName" style={{display:"inline-block",color:"blue"}}>{this.props.match.params.tablename}</div>
                      </div>
                  </center>

                  <fieldset className="transferControlsContainer" >
                      <div className="h4" >Words Control Panel</div>
                      Actions on FILTERED words:<br/>
                      <div className="doSomethingButton" id="deleteFilteredWordsFromMyConceptGraph" >Delete</div>
                      processed words: <div style={{display:"inline-block"}} id="deletedFilteredWordsCount" >0</div>
                      <br/>

                      <div className="doSomethingButton" id="createKeynameForFilteredWordsFromMyConceptGraph" >Create keyname</div> if none already exists;
                      processed words: <div style={{display:"inline-block"}} id="processedKeynameCreationFilteredWordsCount" >0</div>
                      <br/>

                      <div className="doSomethingButton" id="createIPNSForFilteredWordsFromMyConceptGraph" >Create IPNS</div> if none already exists;
                      processed words: <div style={{display:"inline-block"}} id="processedIPNSCreationFilteredWordsCount" >0</div>
                      <br/>

                      <div className="doSomethingButton" id="updateIPFSForFilteredWordsFromMyConceptGraph" >Update IPFS</div>
                      processed words: <div style={{display:"inline-block"}} id="updateIPFSFilteredWordsCount" >0</div>
                      <br/>

                      <div className="doSomethingButton" id="transferFilteredWordsFromThisToAnotherMyConceptGraph" >Transfer Filtered Words</div>
                      or
                      <div className="doSomethingButton" id="transferSelectedSchemaFromThisToAnotherMyConceptGraph" >Transfer Selected Schema</div>:
                      <div id="selector_listOfSchemas" style={{display:"inline-block"}} >selector_listOfSchemas</div>
                      <br/>
                      to one of my conceptGraphs: <div id="selector_listOfMyConceptGraphs" style={{display:"inline-block"}} >selector_listOfMyConceptGraphs</div>
                      <br/>
                      processed words: <div style={{display:"inline-block"}} id="transferFilteredWordsToConceptGraphCount" >0</div>
                      <br/>
                  </fieldset>

                  <fieldset className="transferControlsContainer" >
                      <div className="h4" >Basic Concept Graph Maintenance Control Panel</div>
                      <div className="doSomethingButton" id="createTableIfNotExistsButton" >Create table if not exists</div>
                      <br/>
                      <div className="doSomethingButton" id="initFilesButton" >init by copying all files from myConceptGraph_starterFiles</div>
                  </fieldset>

                  <div className="tableContainer" >
                    <table id="table_myConceptGraph" className="display" style={{color:"black",width:"95%"}} >
                        <thead>
                            <tr>
                                <th></th>
                    	        	<th>r</th>
                  	            <th>id</th>
                  	            <th>rawFile</th>
                  	            <th>keyname</th>
                  	            <th>slug</th>
                  	            <th>wordType(s)</th>
                  	            <th>IPNS/IPFS</th>
                  	            <th>IPNS</th>
                  	            <th>IPFS</th>
                                <th>referenceDictionary</th>
                                <th>reference:<br/>slug/keyname/ipns/referenceDictionary</th>
                                <th>slug_reference</th>
                                <th>ipns_reference</th>
                                <th>keyname_reference</th>
                                <th>whenCreated</th>
                            </tr>
                        </thead>
                        <tfoot>
                            <tr>
                                <th></th>
                    	        	<th>r</th>
                  	            <th>id</th>
                  	            <th>rawFile</th>
                  	            <th>keyname</th>
                  	            <th>slug</th>
                  	            <th>wordType(s)</th>
                  	            <th>IPNS/IPFS</th>
                  	            <th>IPNS</th>
                  	            <th>IPFS</th>
                                <th>referenceDictionary</th>
                                <th>reference:<br/>slug/keyname/ipns/referenceDictionary</th>
                                <th>slug_reference</th>
                                <th>ipns_reference</th>
                                <th>keyname_reference</th>
                                <th>whenCreated</th>
                            </tr>
                        </tfoot>
                    </table>
                    New word slug: <input type="text" id="newWordSlug" style={{width:"400px"}}/>
                    <br/>
                    New word title: <input type="text" id="newWordTitle" style={{width:"400px"}}/>
                    <br/>
                    New word name: <input type="text" id="newWordName" style={{width:"400px"}}/>
                    <br/>
                    new word wordType:
                    <select id="newWordWordTypeSelector">
                        <option data-wordtypeslug="word" >word</option>
                        <option data-wordtypeslug="schema" >schema</option>
                    </select>
                    <br/>
                    <div className="doSomethingButton" id="newWordButton" >Add</div>
                  </div>
                  <div style={{width:"800px",height:"200px",overflow:"scroll"}}>
                      <pre>response: {this.state.response}</pre>
                  </div>
              </div>
          </fieldset>
        </>
      );
    }
}
