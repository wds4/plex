import React, { useState } from 'react';
import { NavLink, Link, useHistory, useParams } from "react-router-dom";
import * as Constants from '../../conceptGraphMasthead.js';
import LeftNavbar from '../../LeftNavbar';
import sendAsync from '../../renderer';
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
    var dtable = jQuery('#table_myDictionary').DataTable({
        data: dDataSet,
        pageLength: 25,
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
    jQuery('#table_myDictionary tfoot th').each( function () {
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
    jQuery('#table_myDictionary tbody').on('click', 'td.details-control', function () {
        console.log("clicked icon");
        var tr = jQuery(this).parents('tr');
        var row = dtable.row( tr );
        console.log("row: "+row);
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
            console.log("keyname: "+ keyname);
            console.log("rawFile: "+ rawFile);
            console.log("slug: "+ slug);
            console.log("wordTypes: "+ wordTypes);
            console.log("ipns_fs: "+ ipns_fs);
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
                expansionHTML += "<div id="+uniqueID+"_content1 class=hidenPanel_contentBox style=display:none; >";
                    expansionHTML += "<pre style=background-color:#EFEFEF;width:90%;height:400px;overflow:scroll; >";
                    expansionHTML += rawFile;
                    expansionHTML += "</pre>";
                expansionHTML += "</div>";

                ////////////// CONTENT 2
                expansionHTML += "<div id="+uniqueID+"_content2 class=hidenPanel_contentBox style=display:none; >";
                    expansionHTML += "<div id=update_"+uniqueID+" class=updateEntryButton onclick=updateEntry('"+ipns+"')  >UPDATE</div>";
                    expansionHTML += "<br>";
                    expansionHTML += "Slug: <input type='text' rows='1' cols='40' style=inline-block; id=newSlug_"+uniqueID+" value='"+slug+"' onchange=turnYellow('"+uniqueID+"') ></input>";
                    expansionHTML += "wordTypes: "+wordTypes;
                    expansionHTML += "<div>";
                        expansionHTML += "<textarea onchange=turnYellow('"+uniqueID+"') name=schemaText id=newWordJsonFile_"+uniqueID+" style=font-size:10px;width:80%;height:400px; >";
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

    });
    jQuery("#deleteFilteredWordsFromMyDictionary").click(function(){
        console.log("deleteFilteredWordsFromMyDictionary clicked")
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
    jQuery("#transferFilteredWordsFromThisToAnotherMyDictionary").click(function(){
        console.log("transferFilteredWordsFromThisToAnotherMyDictionary clicked")
        // SEE CORRESPONDING event listener in PGA-CGD (viewMyDictionary.js, same button name)
        // not yet built out in pgs-cgd
    });
    jQuery("#mirrorFilteredWordsFromMyDictionaryIntoConceptGraph").click(function(){
        console.log("mirrorFilteredWordsFromMyDictionaryIntoConceptGraph clicked")
        // SEE CORRESPONDING event listener in PGA-CGD (viewMyDictionary.js, same button name)
        // works I think in pgs-cgd
    });
    jQuery("#createIPNSForFilteredWordsFromMyDictionary").click(function(){
        console.log("createIPNSForFilteredWordsFromMyDictionary clicked")
        // SEE CORRESPONDING event listener in PGA-CGD (viewMyDictionary.js, same button name)
        // maybe works but with issues in pga-cgd
    });
    jQuery("#createKeynameForFilteredWordsFromMyDictionary").click(function(){
        console.log("createKeynameForFilteredWordsFromMyDictionary clicked")
        // SEE CORRESPONDING event listener in PGA-CGD (viewMyDictionary.js, same button name)
        // (works in PGA-CGD as of 8 July 2021)
    });
    jQuery("#updateIPFSForFilteredWordsFromMyDictionary").click(function(){
        console.log("updateIPFSForFilteredWordsFromMyDictionary clicked")
        // SEE CORRESPONDING event listener in PGA-CGD (viewMyDictionary.js, same button name)
        // (not yet implemented in PGA-CGD as of 8 July 2021)
    });
}



function send(sql) {
    console.log("send; sql: "+sql)
    sendAsync(sql).then((result) => this.setResponse({response: result}) );
}


export default class ViewMyDictionary extends React.Component {

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
              console.log("numWords: "+numWords)
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
                  var nextWord_slug_oV = words_arr[w].slug_originalVersion;
                  var nextWord_ipns_oV = words_arr[w].ipns_originalVersion;
                  var nextWord_ipfs_oV = words_arr[w].ipfs_originalVersion;
                  var nextWord_externalDictionary_oV = words_arr[w].externalDictionary_originalVersion;
                  var nextWord_whenCreated = words_arr[w].whenCreated;

                  var originalVersion_html = nextWord_slug_oV;
                  originalVersion_html += "<br>";
                  originalVersion_html += nextWord_ipns_oV;
                  originalVersion_html += "<br>";
                  originalVersion_html += nextWord_ipfs_oV;
                  originalVersion_html += "<br>";
                  originalVersion_html += nextWord_externalDictionary_oV;

                  var nextWord_IPNS_IPFS = nextWord_ipns + "<br/>" + nextWord_ipns;
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
                      originalVersion_html,
                      nextWord_whenCreated
                    ];
                  dDataSet.push(nextWord_arr);
              }

              makeTable(tableName,dDataSet);
        });
        jQuery("#newWordButton").click(function(){
            var newWord = jQuery("#newWordInput").val();
            console.log("newWordButton clicked; newWord: "+newWord);
            var sql = "";
            sql += " INSERT OR IGNORE INTO "+tableName;
            sql += " (slug, rawFile) ";
            sql += " VALUES('"+newWord+"', '{}' ) ";
            console.log("sql: "+sql);
            sendAsync(sql);
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
                  {Constants.conceptGraphMasthead}
                  <div className="h3">View My Dictionary</div>

                  <fieldset className="transferControlsContainer" >
                      <div className="h4" >Words Control Panel</div>
                      Actions on FILTERED words:<br/>
                      <div className="doSomethingButton" id="deleteFilteredWordsFromMyDictionary" >Delete</div>
                      processed words: <div style={{display:"inline-block"}} id="deletedFilteredWordsCount" >0</div>
                      <br/>

                      <div className="doSomethingButton" id="createKeynameForFilteredWordsFromMyDictionary" >Create keyname</div> if none already exists;
                      processed words: <div style={{display:"inline-block"}} id="processedKeynameCreationFilteredWordsCount" >0</div>
                      <br/>

                      <div className="doSomethingButton" id="createIPNSForFilteredWordsFromMyDictionary" >Create IPNS</div> if none already exists;
                      processed words: <div style={{display:"inline-block"}} id="processedIPNSCreationFilteredWordsCount" >0</div>
                      <br/>

                      <div className="doSomethingButton" id="updateIPFSForFilteredWordsFromMyDictionary" >Update IPFS</div>
                      processed words: <div style={{display:"inline-block"}} id="updateIPFSFilteredWordsCount" >0</div>
                      <br/>

                      <div className="doSomethingButton" id="mirrorFilteredWordsFromMyDictionaryIntoConceptGraph" >Mirror</div>
                      in one of my conceptGraphs: <div id="selector_listOfMyConceptGraphs" style={{display:"inline-block"}} >selector_listOfMyConceptGraphs</div>
                      <br/>

                      <div className="doSomethingButton" id="transferFilteredWordsFromThisToAnotherMyDictionary" >Transfer</div>
                      from this to another of my dictionaries: <div id="selector_listOfMyDictionaries" style={{display:"inline-block"}} >selector_listOfMyDictionaries</div>
                      <br/>
                      processed words: <div style={{display:"inline-block"}} id="transferFilteredWordsToConceptGraphCount" >0</div>
                  </fieldset>

                  <center>
                      <div style={{display:"inline-block",fontSize:"20px",textAlign:"left"}}>
                      title: <div id="activeConceptGraphTitle" style={{display:"inline-block",color:"blue"}}>?</div>
                      <br/>
                      tableName: <div id="activeConceptGraphTableName" style={{display:"inline-block",color:"blue"}}>{this.props.match.params.tablename}</div>
                      </div>
                  </center>
                  <div className="tableContainer" >
                    <table id="table_myDictionary" className="display" style={{color:"black",width:"95%"}} >
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
                                <th>original version (only if originally<br/>copied from external dictionary):<br/>slug/ipns/ipfs/externalDictionary</th>
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
                                <th>original version (only if originally<br/>copied from external dictionary):<br/>slug/ipns/ipfs/externalDictionary</th>
                                <th>whenCreated</th>
                            </tr>
                        </tfoot>
                    </table>
                    New word: <input type="text" id="newWordInput" style={{width:"400px"}}/>
                    <div className="doSomethingButton" id="newWordButton" >Add</div>
                  </div>
                  <div style={{width:"800px",overflow:"scroll"}}>
                      <pre>response: {this.state.response}</pre>
                  </div>
              </div>
          </fieldset>
        </>
      );
    }
}
