import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/singleConceptGraph_words_leftNav2.js';
import * as MiscFunctions from '../../../functions/miscFunctions.js';
import sendAsync from '../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

function makeThisPageTable(tableName,wordDataSet) {
    // add text input box to each header cell
    jQuery('#table_words thead th').each(function () {
        var title = jQuery(this).text();
        jQuery(this).html(title + '<br><input id="searchDiv_'+title+'" type="text" placeholder="Search ' + title + '" />');
    });
    var dtable = jQuery('#table_words').DataTable({
        data: wordDataSet,
        pageLength: 100,
        "columns": [
            {
                "class":          'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
            { },
            { },
            { },
            { },
            { },
            { },
            { visible:false },
            { visible:false }
        ],
        "dom": '<"pull-left"f><"pull-right"l>tip',
        initComplete: function () {
            // Apply the search
            this.api()
                .columns()
                .every(function () {
                    var that = this;
                    jQuery('input', this.header()).on('keyup change clear', function () {
                        if (that.search() !== this.value) {
                            that.search(this.value).draw();
                        }
                    });
                });
        },

        "drawCallback": function( settings ) {
            try {
                jQuery(".nextRowEditButton").click(function(){
                    var sqlid = jQuery(this).data("sqlid");
                    jQuery("#linkFrom_"+sqlid).get(0).click();
                })
            } catch (e) {}
        }
    });
    // Add event listener for opening and closing details
    jQuery('#table_words tbody').on('click', 'td.details-control', function () {
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
            var slug = d[3];
            var sqlID = d[8];
            var oWord = window.lookupWordBySlug[slug];
            var sWord = JSON.stringify(oWord,null,4)

            var expansionHTML = "";
            expansionHTML += "<div>";
            expansionHTML += "<div data-status='pre' data-slug='"+slug+"' id='toggleTextareaButton_"+sqlID+"' data-sqlid='"+sqlID+"' class=doSomethingButton  >toggle edit box</div>";
            expansionHTML += "<div id='update_"+slug+"' data-slug='"+slug+"' class=doSomethingButton style=display:none; >UPDATE</div>";
            expansionHTML += "<div id='deleteBySqlID_"+sqlID+"' data-slug='"+slug+"' data-sqlid='"+sqlID+"' class=doSomethingButton style=display:none; >DELETE based on SQL ID: "+sqlID+"</div>";

            expansionHTML += "<textarea id='textarea_"+slug+"' style=width:700px;height:800px;display:none; >";
            expansionHTML += sWord;
            expansionHTML += "</textarea>";

            expansionHTML += "<pre id='pre_"+slug+"' >";
            expansionHTML += sWord;
            expansionHTML += "</pre>";

            expansionHTML += "</div>";

            row.child( expansionHTML ).show();
            tr.addClass('shown');
            jQuery("#toggleTextareaButton_"+sqlID).click(function(){
                var slug = jQuery(this).data("slug");
                // var sqlID = jQuery(this).data("sqlid");
                var status = jQuery(this).data("status");
                // alert("clicked; slug: "+slug+"; status: "+status)
                if (status=="pre") {
                    jQuery(this).data("status","textarea");
                    jQuery("#textarea_"+slug).css("display","block")
                    jQuery("#update_"+slug).css("display","inline-block")
                    jQuery("#deleteBySqlID_"+sqlID).css("display","inline-block")

                    jQuery("#pre_"+slug).css("display","none")
                }
                if (status=="textarea") {
                    jQuery(this).data("status","pre");
                    jQuery("#textarea_"+slug).css("display","none")
                    jQuery("#update_"+slug).css("display","none")
                    jQuery("#deleteBySqlID_"+sqlID).css("display","none")
                    jQuery("#pre_"+slug).css("display","block")
                }
            })
            jQuery("#update_"+slug).click(function(){
                var slug = jQuery(this).data("slug");
                var sWord = jQuery("#textarea_"+slug).val();
                var oWord = JSON.parse(sWord);
                MiscFunctions.createOrUpdateWordInAllTables(oWord);
                // alert("clicked; slug: "+slug+"; sWord: "+sWord)
            })
            jQuery("#deleteBySqlID_"+sqlID).click(function(){
                var word_myDictionaries_arr = oWord.globalDynamicData.myDictionaries;
                var word_myConceptGraphs_arr = oWord.globalDynamicData.myConceptGraphs;
                var numDictionaries = word_myDictionaries_arr.length;
                var numConceptGraphs = word_myConceptGraphs_arr.length;

                for (var d=0;d<numDictionaries;d++) {
                    var nextDictionary = word_myDictionaries_arr[d];

                    var updateRowCommands = " UPDATE "+nextDictionary;
                    updateRowCommands += " SET ";
                    updateRowCommands += " deleted = 1 ";
                    updateRowCommands += " WHERE id = '"+sqlID+"' ";
                    console.log("deleteWordFromAllTables updateRowCommands: "+updateRowCommands);
                    sendAsync(updateRowCommands);
                }

                for (var c=0;c<numConceptGraphs;c++) {
                    var nextConceptGraph = word_myConceptGraphs_arr[c];

                    var updateRowCommands = "";
                    updateRowCommands += "UPDATE "+nextConceptGraph;
                    updateRowCommands += " SET deleted = 1 ";
                    updateRowCommands += " WHERE id='"+sqlID+"' ";
                    console.log("deleteWordFromAllTables updateRowCommands: "+updateRowCommands)
                    sendAsync(updateRowCommands)
                }
            })
        }
    });
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default class AllWordsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wordLinks: []
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 800px)");
        var thisPageTableName = "unknown";
        var currCgID = window.currentConceptGraphSqlID;
        if (window.aLookupConceptGraphInfoBySqlID.hasOwnProperty(currCgID)) {
            thisPageTableName = ""+window.aLookupConceptGraphInfoBySqlID[currCgID].tableName;
        }
        jQuery("#thisPageTableNameContainer").html(thisPageTableName)

        var sql = " SELECT * FROM " + thisPageTableName + " WHERE ( deleted IS NULL OR deleted == 0 ) ";
        console.log("sql: "+sql)

        var wordDataSet = [];
        sendAsync(sql).then( async (result) => {
            var aResult = result;
            var numRows = aResult.length;
            console.log("numRows: "+numRows)
            for (var r=0;r<numRows;r++) {
                var progressHTML = "";
                progressHTML += "loading "+thisPageTableName + " progress: ";
                progressHTML += r+1;
                progressHTML += " / ";
                progressHTML += numRows;
                jQuery("#thisPageTableNameContainer").html(progressHTML);
                await delay(0);

                var oNextRow = aResult[r];
                var nextRow_id = oNextRow.id;
                var nextRow_slug = oNextRow.slug;
                var nextRow_rawFile = oNextRow.rawFile;
                // var nextRow_name = oNextRow.name;
                var nextRow_ipfs = oNextRow.ipfs;
                var nextRow_ipns = oNextRow.ipns;
                var nextRow_deleted = oNextRow.deleted;
                var aNextPattern = [];

                var oNextWord = JSON.parse(nextRow_rawFile);
                var nextRow_name = "unknown";
                if (oNextWord.wordData.hasOwnProperty("name")) {
                    nextRow_name = oNextWord.wordData.name;
                }

                var nextRow_wordTypes = "";
                var aWordTypes = oNextWord.wordData.wordTypes;
                var numWordTypes = aWordTypes.length;
                for (var t=0;t<numWordTypes;t++) {
                    var nextWordType = aWordTypes[t];
                    nextRow_wordTypes += nextWordType;
                    if (t+1 < numWordTypes) {
                        nextRow_wordTypes += ", "
                    }
                }

                var nextRow_IPNS_IPFS = nextRow_ipns + "<br>"+ nextRow_ipfs;

                var nextRow_button2 = "<div data-queryid="+r+" data-sqlid="+nextRow_id+" id=nextRowButton2_"+nextRow_id+" class='doSomethingButton_small nextRowEditButton2' style=margin-right:5px; >VIEW / EDIT</div>";
                // var nextRow_slug_html = nextRow_button2 + nextRow_slug;
                var nextRow_id_html = nextRow_button2 + nextRow_id;

                if (nextRow_deleted==1) {
                    nextRow_id_html = nextRow_button2 + "<div style='color:red;' >" + nextRow_id + " DELETED</div>";
                }
                aNextPattern = [
                    "",
                    r,
                    nextRow_id_html,
                    nextRow_slug,
                    nextRow_name,
                    nextRow_wordTypes,
                    nextRow_IPNS_IPFS,
                    nextRow_rawFile,
                    nextRow_id,
                  ];
                wordDataSet.push(aNextPattern);

                // create links to individual view / edit existing wordType page
                var oWordData = {};
                oWordData.pathname = "/SingleWordGeneralInfo/"+nextRow_id;
                oWordData.wordsqlid = 'linkFrom_'+nextRow_id;
                oWordData.wordname = nextRow_name;
                this.state.wordLinks.push(oWordData)
                this.forceUpdate();
            }
            jQuery("#thisPageTableNameContainer").css("display","none");
            var sResult = JSON.stringify(result,null,4)
            jQuery("#sqlResultContainer").html(sResult)
            jQuery("#sqlResultContainer").val(sResult)

            makeThisPageTable(thisPageTableName,wordDataSet);

            jQuery(".nextRowEditButton2").click(function(){
                var sqlid = jQuery(this).data("sqlid");
                jQuery("#linkFrom_"+sqlid).get(0).click();
            })
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
                        <div class="h2" >All Words (Table)</div>
                        <div class="h3" >generated from SQL; {Object.keys(window.lookupWordBySlug).length} words; {window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>
                        <div id="thisPageTableNameContainer" style={{display:"inline-block"}}>
                            thisPageTableNameContainer
                        </div>

                        <div style={{display:"none"}}>
                        {this.state.wordLinks.map(link => (
                            <div >
                                <Link id={link.wordsqlid} class='navButton'
                                  to={link.pathname}
                                >{link.wordslug}
                                </Link>
                            </div>
                        ))}
                        </div>

                        <div className="tableContainer" style={{marginTop:"20px",marginLeft:"20px",overflow:"scroll"}} >
                            <table id="table_words" className="display" style={{color:"black",width:"95%"}} >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>slug</th>
                                        <th>name</th>
                                        <th>wordTypes</th>
                                        <th>IPNS/IPFS</th>
                                        <th>rawFile</th>
                                        <th>id</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>slug</th>
                                        <th>name</th>
                                        <th>wordTypes</th>
                                        <th>IPNS/IPFS</th>
                                        <th>rawFile</th>
                                        <th>id</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div style={{display:"none"}}>
                            SQL Result:<br/>
                            <div id="sqlResultContainer" >result</div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
