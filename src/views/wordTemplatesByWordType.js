import React, { useState } from 'react';
import { NavLink, Link } from "react-router-dom";
import * as Constants from '../conceptGraphMasthead.js';
import LeftNavbar from '../LeftNavbar';
import sendAsync from '../renderer';
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

function makeTable(dDataSet) {
    function updateEntry(id) {
        // console.log("updateEntry; id: "+id);
    }

    var dtable = jQuery('#table_templatesByWordType').DataTable({
        data: dDataSet,
        pageLength: 25,
        "columns": [
            {
                "className":          'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
            { visible: false },
            { visible: false },
            { visible: false },
            { }
        ],
        "dom": '<"pull-left"f><"pull-right"l>tip'
    });
    // Setup - add a text input to each footer cell
    jQuery('#table_templatesByWordType tfoot th').each( function () {
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
    jQuery('#table_templatesByWordType tbody').on('click', 'td.details-control', function () {
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
            var id = d[2];
            var rawFile = d[3];
            if (IsValidJSONString(rawFile)) {
                rawFile = JSON.stringify(JSON.parse(rawFile),null,4);
            }
            var wordType = d[4];
            var uniqueID=id;
            var expansionHTML = "<div id='target_"+uniqueID+"' style='width:90%;' >"
            expansionHTML += "<div id="+uniqueID+"_tab1 data-tab-button='"+ uniqueID +"_content1' class=tableSelectButton_hiddenPanels style=border-bottom:1px solid #EEEEEE; >";
            expansionHTML += "current";
            expansionHTML += "</div>";
            expansionHTML += "<div id="+uniqueID+"_tab2 data-tab-button='"+ uniqueID +"_content2' class=tableSelectButton_hiddenPanels >";
            expansionHTML += "edit";
            expansionHTML += "</div>";
            expansionHTML += uniqueID;
            // expansionHTML += "<div class=smallDictionaryDoSomethingButton id=fetchSingleFileFromIPFS_"+uniqueID+" onclick=fetchSingleFileFromIPFS('"+id+"') >fetch file from IPFS</div>";
            expansionHTML += "<br>";
            expansionHTML += "<div id="+uniqueID+"_content1 class=hidenPanel_contentBox >";
            expansionHTML += "<pre style=background-color:#EFEFEF;width:90%;height:400px;overflow:scroll; >";
            expansionHTML += rawFile;
            expansionHTML += "</pre>";
            expansionHTML += "</div>";

            expansionHTML += "<div id="+uniqueID+"_content2 class=hidenPanel_contentBox style=display:none; >";
            expansionHTML += "<div id=update_"+uniqueID+" data-sqlid='"+uniqueID+"' class=updateEntryButton >UPDATE</div>";
            expansionHTML += "<br>";

            expansionHTML += "wordType: <input type='text' rows='1' cols='40' style=inline-block; id=newWordType_"+uniqueID+" value='"+wordType+"' onchange=turnYellow('"+uniqueID+"') ></input>";

            expansionHTML += "<div ><textarea onchange=turnYellow('"+uniqueID+"') name=schemaText id=newWordJsonFile_"+uniqueID+" style=font-size:22px;width:80%;height:400px; >";
            expansionHTML += rawFile;
            expansionHTML += "</textarea></div>";
            expansionHTML += "</div>";
            expansionHTML += "</div>";

            row.child( expansionHTML ).show();
            tr.addClass('shown');

            // setWidth = currentWidth - 150;
            // document.getElementById('target_'+uniqueID).style.width = setWidth+"px";
            jQuery("#update_"+uniqueID).click(function(){
                var thisID = this.id;
                var sqlid = jQuery("#"+thisID).data("sqlid");
                var thisRawFile = jQuery("#newWordJsonFile_"+sqlid).val();
                var thisWordType = jQuery("#newWordType_"+sqlid).val();
                // console.log("updateEntryButton; thisID: "+thisID+"; sqlid: "+sqlid+"; thisRawFile: "+thisRawFile);
                var updateCommands = "";
                updateCommands += " UPDATE wordTemplatesByWordType ";
                updateCommands += " SET rawFile='"+ thisRawFile +"' ";
                updateCommands += " , wordType='"+ thisWordType +"' ";
                updateCommands += " WHERE id='"+sqlid+"' "
                // console.log("updateCommands: "+updateCommands);
                sendAsync(updateCommands)
            })

            jQuery(".tableSelectButton_hiddenPanels").click(function() {
                document.getElementById(uniqueID+"_content1").style.display="none";
                document.getElementById(uniqueID+"_content2").style.display="none";

                document.getElementById(uniqueID+"_tab1").style.borderBottom = "1px solid black";
                document.getElementById(uniqueID+"_tab2").style.borderBottom = "1px solid black";
            });

            jQuery(".tableSelectButton_hiddenPanels").click(function() {
                var dataTabId = this.getAttribute("data-tab-button");
                document.getElementById(dataTabId).style.display="block";
                this.style.borderBottom = "1px solid #EEEEEE";
                var currentTabState = {};
                /*
                if (dataTabId == uniqueID+"_content1") {
                    document.getElementById(uniqueID+"_section_1").style.display="block";
                    currentTabState[uniqueID]=1;
                }
                if (dataTabId == uniqueID+"_content2") {
                    document.getElementById(uniqueID+"_section_2").style.display="block";
                    currentTabState[uniqueID]=2;
                }
                */
            });

        }
    } );

}
function send() {

    var sql1 = " SELECT * FROM myConceptGraphs  ";
    // console.log("send; sql1: "+sql1)
    // sendAsync(sql).then((result) => setResponse(result));
    sendAsync(sql1).then((result) => this.setResponse({response: result}) );
}
export default class WordTemplatesByWordType extends React.Component {
    componentDidMount() {
        jQuery("#newWordTypeButton").click(function(){
            var newWordType = jQuery("#newWordTypeInput").val();
            // console.log("newWordTypeButton clicked; newWordType: "+newWordType);
            var sql = "";
            sql += " INSERT OR IGNORE INTO wordTemplatesByWordType  ";
            sql += " (wordType, rawFile) ";
            sql += " VALUES('"+newWordType+"', '{}' ) ";
            // console.log("sql: "+sql);
            sendAsync(sql);
        });

        var sql = " SELECT * FROM wordTemplatesByWordType ";
        sendAsync(sql).then((result) => {
              this.setState({response: JSON.stringify(result,null,4) } )
              var wordTypes_arr = result;
              var numWordTypes = wordTypes_arr.length;
              // console.log("numWordTypes: "+numWordTypes)
              var dDataSet = [];
              for (var w=0;w<numWordTypes;w++) {
                  var nextID = wordTypes_arr[w].id;
                  var nextWordTypeSlug = wordTypes_arr[w].wordType;
                  var nextRawFile = wordTypes_arr[w].rawFile;
                  var nextWordType = ["",w,nextID,nextRawFile,nextWordTypeSlug];
                  dDataSet.push(nextWordType);
              }
              makeTable(dDataSet)
        });
    }
    constructor(props) {
       super(props);
       this.state = {
         count: 0,
         message: 'SELECT * FROM sqlite_master',
         response: null
       };
     }

    render() {
      return (
        <>
          <fieldset className="mainBody" >
              <LeftNavbar />
              <div className="mainPanel" >
                  {Constants.conceptGraphMasthead}
                  <div className="h2">Word Templates by Word Type</div>
                  <div className="tableContainer" >
                  	<table id="table_templatesByWordType" className="display" style={{color:"black",width:"95%"}} >
                  	    <thead>
                  	        <tr>
                    	        	<th></th>
                    	        	<th>r</th>
                  	            <th>id</th>
                  	            <th>rawFile</th>
                  	            <th>wordType</th>
                  	        </tr>
                  	    </thead>
                  	    <tfoot>
                  	        <tr>
                    	        	<th></th>
                    	        	<th>r</th>
                  	            <th>id</th>
                  	            <th>rawFile</th>
                  	            <th>wordType</th>
                  	        </tr>
                  	    </tfoot>
                  	</table>
                  </div>
                  New wordType: <input type="text" id="newWordTypeInput" style={{width:"400px"}}/>
                  <div className="doSomethingButton" id="newWordTypeButton" >Add</div>
                  <div style={{width:"800px",overflow:"scroll"}}>
                      <pre>response: {this.state.response}</pre>
                  </div>
              </div>
          </fieldset>
        </>
      );
      // makeTable();
      // var sql = " SELECT * FROM wordTemplatesByWordType ";
      // send(sql);
    }
}

// export default WordTemplatesByWordType;
