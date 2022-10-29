import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleConcept_leftNav2.js';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

function makeThisPageTable(tableName,wordDataSet) {
    var dtable = jQuery('#table_words').DataTable({
        data: wordDataSet,
        pageLength: 50,
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
            { }
        ],
        "dom": '<"pull-left"f><"pull-right"l>tip',

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
            var oWord = window.lookupWordBySlug[slug];
            var sWord = JSON.stringify(oWord,null,4)

            var expansionHTML = "";
            expansionHTML += "<div>";
            expansionHTML += "<div data-status='pre' data-slug='"+slug+"' id='toggleTextareaButton_"+slug+"' class=doSomethingButton  >toggle edit box</div>";
            expansionHTML += "<div id='update_"+slug+"' data-slug='"+slug+"' class=doSomethingButton style=display:none; >UPDATE</div>";

            expansionHTML += "<textarea id='textarea_"+slug+"' style=width:700px;height:800px;display:none; >";
            expansionHTML += sWord;
            expansionHTML += "</textarea>";

            expansionHTML += "<pre id='pre_"+slug+"' >";
            expansionHTML += sWord;
            expansionHTML += "</pre>";

            expansionHTML += "</div>";

            row.child( expansionHTML ).show();
            tr.addClass('shown');
            jQuery("#toggleTextareaButton_"+slug).click(function(){
                var slug = jQuery(this).data("slug");
                var status = jQuery(this).data("status");
                // alert("clicked; slug: "+slug+"; status: "+status)
                if (status=="pre") {
                    jQuery(this).data("status","textarea");
                    jQuery("#textarea_"+slug).css("display","block")
                    jQuery("#update_"+slug).css("display","inline-block")
                    jQuery("#pre_"+slug).css("display","none")
                }
                if (status=="textarea") {
                    jQuery(this).data("status","pre");
                    jQuery("#textarea_"+slug).css("display","none")
                    jQuery("#update_"+slug).css("display","none")
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
        }
    });
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default class SingleConceptAllWordsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wordLinks: []
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var thisPageTableName = "unknown";
        var currCgID = window.currentConceptGraphSqlID;
        if (window.aLookupConceptGraphInfoBySqlID.hasOwnProperty(currCgID)) {
            thisPageTableName = ""+window.aLookupConceptGraphInfoBySqlID[currCgID].tableName;
        }
        jQuery("#thisPageTableNameContainer").html(thisPageTableName)

        var sql = " SELECT * FROM "+thisPageTableName;
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
                // progressHTML += "<br>";
                jQuery("#thisPageTableNameContainer").html(progressHTML);
                await delay(0);

                var oNextRow = aResult[r];
                var nextRow_id = oNextRow.id;
                var nextRow_slug = oNextRow.slug;
                var nextRow_rawFile = oNextRow.rawFile;
                // var nextRow_name = oNextRow.name;
                var nextRow_ipfs = oNextRow.ipfs;
                var nextRow_ipns = oNextRow.ipns;
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

                var nextRow_button2 = "<div data-queryid="+r+" data-slug="+nextRow_slug+" data-sqlid="+nextRow_id+" id=nextRowButton2_"+nextRow_id+" class='doSomethingButton_small nextRowEditButton' style=margin-right:5px; >VIEW / EDIT</div>";
                // var nextRow_slug_html = nextRow_button2 + nextRow_slug;
                var nextRow_id_html = nextRow_button2 + nextRow_id;
                aNextPattern = ["",r,
                    nextRow_id_html,
                    nextRow_slug,
                    nextRow_name,
                    nextRow_wordTypes,
                    nextRow_IPNS_IPFS
                ];
                wordDataSet.push(aNextPattern);

                // create links to individual view / edit existing wordType page
                var oWordData = {};
                oWordData.pathname = "/SingleConceptSingleWordGeneralInfo/"+nextRow_id;
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

            jQuery(".nextRowEditButton").click(function(){
                var sqlid = jQuery(this).data("sqlid");
                if (document.getElementById("linkFrom_"+sqlid)) {
                    jQuery("#linkFrom_"+sqlid).get(0).click();
                }
            })
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Single Concept All Words (table)</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>
                        <div class="h3" >{window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug}</div>

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
                        * currently showing ALL WORDS in this ENTIRE concept graph<br/>
                        need to enact a concept-specific restriction of entries in one of the following ways:<br/>
                        <li>special nodes only (8 total)</li>
                        <li>all nodes (direct) in main schema</li>
                        <li>all nodes (direct) in propertySchema</li>
                        <li>all nodes (direct) in main schema + propertySchema</li>
                        <li>all nodes (direct + indirect) in main schema</li>
                        <li>all nodes (direct + indirect) in main schema + propertySchema</li>

                        <div id="thisPageTableNameContainer" >
                            thisPageTableNameContainer
                        </div>

                        <div className="tableContainer" style={{marginTop:"20px",marginLeft:"20px"}} >
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
