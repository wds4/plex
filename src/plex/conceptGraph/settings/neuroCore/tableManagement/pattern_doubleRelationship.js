import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/neuroCore_patterns_s2r_leftNav2.js';
import { generateSqlCommand_s2r } from './generateSqlCommandFxns.js'
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

const tableName = "conceptGraphPatterns_s2r";

function makeTable(tableName,dDataSet) {
    // add text input box to each header cell
    jQuery('#table_conceptGraphPattern_s2r thead th').each(function () {
        var title = jQuery(this).text();
        jQuery(this).html('<input id="searchDiv_'+title+'" type="text" placeholder="Search ' + title + '" />');
    });
    var dtable = jQuery('#table_conceptGraphPattern_s2r').DataTable({
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
            { },
            { },
            { },
            { },
            { },
            { },
            { },
            { },
            { },
            { visible: false }
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
        }
    });
    // Add event listener for opening and closing details
    jQuery('#table_conceptGraphPattern_s2r tbody').on('click', 'td.details-control', function () {
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
            var patternName = d[3];

            var expansionHTML = "";
            expansionHTML += "<div>";
            expansionHTML += patternName;
            expansionHTML += "</div>";

            row.child( expansionHTML ).show();
            tr.addClass('shown');
        }
    });
}

export default class TableForPatternsDoubleRelationship extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patternLinks: [],
            actionLinks: []
        }
    }
    componentDidMount() {
        // jQuery(".mainBody").css("width","calc(100% - 800px)");
        jQuery(".mainPanel").css("width","calc(100% - 700px)");

        var sql = " SELECT * FROM "+tableName;
        var dDataSet = [];
        sendAsync(sql).then((result) => {
            var aResult = result;
            var numRows = aResult.length;
            console.log("numRows: "+numRows)
            var aActionsList = [];
            for (var r=0;r<numRows;r++) {
                var oNextRow = aResult[r];
                var nextRow_id = oNextRow.id;
                var nextRow_patternName = oNextRow.patternName;
                var nextRow_opCodesB = oNextRow.opCodesB;
                var nextRow_opCodeD = oNextRow.opCodeD;
                var nextRow_actionsList = oNextRow.actionsList;
                var nextRow_wordTypeA = oNextRow.wordType_A;
                var nextRow_relationshipTypeA = oNextRow.relationshipType_A;
                var nextRow_wordTypeB = oNextRow.wordType_B;
                var nextRow_relationshipTypeB = oNextRow.relationshipType_B;
                var nextRow_wordTypeC = oNextRow.wordType_C;
                var nextRow_description= oNextRow.description;
                var aNextPattern = [];

                // var nextRow_patternName_button = "<div data-queryid="+r+" data-sqlid="+nextRow_id+" id=nextRowButton_"+nextRow_id+" class='doSomethingButton_small nextRowEditButton' >load</div>";
                var nextRow_patternName_button = "<div data-queryid="+r+" data-sqlid="+nextRow_id+" id=nextRowButton_"+nextRow_id+" class='doSomethingButton_small nextRowViewEditButton' >VIEW/EDIT</div>";
                var nextRow_patternName_html = nextRow_patternName + "<br>" + nextRow_patternName_button;

                var nextRow_actionsList_html = "";
                var aActions = nextRow_actionsList.split(",");
                for (var s=0;s<aActions.length;s++) {
                    var nextAction = aActions[s];
                    nextRow_actionsList_html += "<div class='doSomethingButton nextActionViewEditButton' ";
                    nextRow_actionsList_html += " data-actionname='"+nextAction+"' ";

                    var doesActionExist = false;
                    if (jQuery.inArray(nextAction,window.neuroCore.aU1nActionsByName) > -1) {
                        doesActionExist = true;
                    }
                    if (!doesActionExist) {
                        nextRow_actionsList_html += " style=border-color:red;color:red;background-color:white; ";
                    }

                    nextRow_actionsList_html += " >";
                    nextRow_actionsList_html += nextAction;
                    nextRow_actionsList_html += "</div>";
                    if (s+1<aActions.length) {
                        nextRow_actionsList_html += "<br>";
                    }
                    if (jQuery.inArray(nextAction,aActionsList) == -1) {
                        aActionsList.push(nextAction)
                        var oActionData = {};
                        oActionData.pathname = "/NeuroCoreViewEditActionUpdateSingleNode/"+nextAction;
                        var nextAction_x = nextAction.replaceAll(".","_")
                        oActionData.actionlink = 'actionLinkFrom_'+nextAction_x;
                        oActionData.name = nextAction;
                        this.state.actionLinks.push(oActionData)
                        this.forceUpdate();
                    }
                }

                aNextPattern = ["",r,
                    nextRow_id,
                    nextRow_patternName,
                    nextRow_patternName_html,
                    nextRow_opCodesB,
                    nextRow_opCodeD,
                    nextRow_actionsList_html,
                    nextRow_wordTypeA,
                    nextRow_relationshipTypeA,
                    nextRow_wordTypeB,
                    nextRow_relationshipTypeB,
                    nextRow_wordTypeC,
                    nextRow_description
                  ];
                dDataSet.push(aNextPattern);

                // create links to individual view / edit existing wordType page
                var oPatternData = {};
                oPatternData.pathname = "/NeuroCoreViewEditPatternDoubleRelationship/"+nextRow_patternName;
                // oPatternData.pathname = "/NeuroCoreViewEditPatternDoubleRelationship/"+nextRow_id;
                oPatternData.sqlid = 'linkFrom_'+nextRow_id;
                oPatternData.name = nextRow_patternName;
                this.state.patternLinks.push(oPatternData)
                this.forceUpdate();
            }
            var sResult = JSON.stringify(result,null,4)
            jQuery("#sqlResultContainer").html(sResult)
            jQuery("#sqlResultContainer").val(sResult)
            makeTable(tableName,dDataSet);
            jQuery(".nextRowEditButton").click(function(){
                var queryid = jQuery(this).data("queryid");
                jQuery("#currPatternSqlId").val(aResult[queryid].id)
                jQuery("#currPatternSqlId").html(aResult[queryid].id)
                jQuery("#newPatternName").val(aResult[queryid].patternName)
                jQuery("#newPatternName").html(aResult[queryid].patternName)
                jQuery("#newOpCodesB").val(aResult[queryid].opCodesB)
                jQuery("#newOpCodeD").val(aResult[queryid].opCodeD)
                jQuery("#newActionsList").val(aResult[queryid].actionsList)
                jQuery("#newDescription").val(aResult[queryid].description)
                jQuery("#newWordTypeA").val(aResult[queryid].wordType_A)
                jQuery("#newRelationshipTypeA").val(aResult[queryid].relationshipType_A)
                jQuery("#newWordTypeB").val(aResult[queryid].wordType_B)
                jQuery("#newRelationshipTypeB").val(aResult[queryid].relationshipType_B)
                jQuery("#newWordTypeC").val(aResult[queryid].wordType_C)
            })
            jQuery(".nextRowViewEditButton").click(function(){
                var sqlid = jQuery(this).data("sqlid");
                jQuery("#linkFrom_"+sqlid).get(0).click();
            })
            jQuery(".nextActionViewEditButton").click(function(){
                var actionName = jQuery(this).data("actionname");
                // var sqlid = jQuery(this).data("sqlid");
                var actionName_x = actionName.replaceAll(".","_")
                // alert("actionName_x: "+actionName_x)
                jQuery("#actionLinkFrom_"+actionName_x).get(0).click();
            })
        })

        jQuery("#generateSqlCommandButton_makeNew").click(function(){
            generateSqlCommand_s2r("makeNew",tableName)
        })
        jQuery("#generateSqlCommandButton_editExisting").click(function(){
            generateSqlCommand_s2r("editExisting",tableName)
        })
        jQuery("#generateSqlCommandButton_deleteExisting").click(function(){
            generateSqlCommand_s2r("deleteExisting",tableName)
        })

        jQuery("#runSqlButton").click(function(){
            var sql = jQuery("#sqlCommandContainer").val();
            console.log("sql: "+sql)
            sendAsync(sql).then((result) => {
                var sResult = JSON.stringify(result,null,4)
                jQuery("#sqlResultContainer").html(sResult)
                jQuery("#sqlResultContainer").val(sResult)
            })
        })
        jQuery(".restrictByOpCodeBButton").click(function(){
            var opCodeB = jQuery(this).data("opcodeb");
            console.log("restrictToLokiPathwayButton; opCodeB: "+opCodeB)
            jQuery('#searchDiv_opCodesB').val(opCodeB).change();
        });
        jQuery(".restrictByOpCodeCButton").click(function(){
            var opCodeC = jQuery(this).data("opcodec");
            console.log("restrictToLokiPathwayButton; opCodeC: "+opCodeC)
            jQuery('#searchDiv_patternName').val(opCodeC).change();
        });
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Table for Patterns: Double Relationship</div>
                        <div class="h2">table: {tableName}</div>

                        <div style={{display:"none"}} >
                        {this.state.patternLinks.map(link => (
                            <div >
                                <Link id={link.sqlid} class='navButton'
                                  to={link.pathname}
                                >{link.name}
                                </Link>
                            </div>
                        ))}
                        </div>

                        <div style={{display:"none"}} >
                        {this.state.actionLinks.map(link => (
                            <div >
                                <Link id={link.actionlink} class='navButton'
                                  to={link.pathname}
                                >{link.name}
                                </Link>
                            </div>
                        ))}
                        </div>

                        <div className="simpleElementBlock">
                            <center>Add a New Pattern</center>
                            <div className="simpleElementInlineBlock500" >
                                sqlId:
                                <textarea id="currPatternSqlId" style={{width:"250px"}} ></textarea>
                            </div>

                            <div className="simpleElementInlineBlock500" >
                                patternName:
                                <textarea id="newPatternName" style={{width:"250px"}} ></textarea>
                            </div>

                            <div className="simpleElementInlineBlock500" >
                                opCodesB:
                                <textarea id="newOpCodesB" style={{width:"250px"}} >a,b,c</textarea>
                            </div>

                            <div className="simpleElementInlineBlock500" >
                                opCodeD:
                                <textarea id="newOpCodeD" style={{width:"250px"}} ></textarea>
                            </div>

                            <div className="simpleElementInlineBlock500" >
                                actionsList:
                                <textarea id="newActionsList" style={{width:"250px"}} >a,b,c</textarea>
                            </div>

                            <div className="simpleElementInlineBlock500" >
                                description:
                                <textarea id="newDescription" style={{width:"250px"}} ></textarea>
                            </div>

                            <div className="simpleElementInlineBlock500" >
                                wordType_A:
                                <textarea id="newWordTypeA" style={{width:"250px"}} ></textarea>
                            </div>

                            <div className="simpleElementInlineBlock500" >
                                relationshipType_A:
                                <textarea id="newRelationshipTypeA" style={{width:"250px"}} ></textarea>
                            </div>

                            <div className="simpleElementInlineBlock500" >
                                wordType_B:
                                <textarea id="newWordTypeB" style={{width:"250px"}} ></textarea>
                            </div>

                            <div className="simpleElementInlineBlock500" >
                                relationshipType_B:
                                <textarea id="newRelationshipTypeB" style={{width:"250px"}} ></textarea>
                            </div>

                            <div className="simpleElementInlineBlock500" >
                                wordType_C:
                                <textarea id="newWordTypeC" style={{width:"250px"}} ></textarea>
                            </div>

                            <textarea id="sqlCommandContainer" style={{width:"500px",height:"100px"}} ></textarea>
                            <br/><br/>
                            <div id="generateSqlCommandButton_makeNew" className="doSomethingButton">generate SQL command to MAKE NEW row</div>
                            <div id="generateSqlCommandButton_editExisting" className="doSomethingButton">generate SQL command to EDIT EXISTING row</div>
                            <div id="generateSqlCommandButton_deleteExisting" className="doSomethingButton">generate SQL command to DELETE EXISTING row</div>

                            <br/>
                            <div id="runSqlButton" className="doSomethingButton">execute SQL command</div>
                            <br/>
                            SQL Result:<br/>
                            <div id="sqlResultContainer" >result</div>
                        </div>

                        <div className="tableContainer" style={{width:"99%",overflowY:"scroll"}} >
                            <div style={{display:"inline-block",width:"350px"}}>Restrict by opCodesB (functional class):</div>
                            <div className="doSomethingButton restrictByOpCodeBButton" data-opcodeb="a" >Loki Pathway</div>
                            <div className="doSomethingButton restrictByOpCodeBButton" data-opcodeb="b" >Property Tree</div>
                            <div className="doSomethingButton restrictByOpCodeBButton" data-opcodeb="c" >Concept Structure</div>
                            <div className="doSomethingButton restrictByOpCodeBButton" data-opcodeb="rV" >Restricts Value</div>
                            <br/>
                            <div style={{display:"inline-block",width:"350px"}}>Restrict by opCodeC (type of action):</div>
                            <div className="doSomethingButton restrictByOpCodeCButton" data-opcodec="u1n" >update 1 node (u1n)</div>
                            <div className="doSomethingButton restrictByOpCodeCButton" data-opcodec="u2n" >update 2 nodes (u2n)</div>
                            <div className="doSomethingButton restrictByOpCodeCButton" data-opcodec="s1n" >select 1 node (s1n) (??)</div>
                            <br/>
                            <table id="table_conceptGraphPattern_s2r" className="display" style={{color:"black",width:"95%"}} >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>patternName</th>
                                        <th>patternName</th>
                                        <th>opCodesB</th>
                                        <th>opCodeD</th>
                                        <th>actionsList(s)</th>
                                        <th>wordType_A</th>
                                        <th>relationshipType_A</th>
                                        <th>wordType_B</th>
                                        <th>relationshipType_B</th>
                                        <th>wordType_C</th>
                                        <th>description</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>patternName</th>
                                        <th>patternName</th>
                                        <th>opCodesB</th>
                                        <th>opCodeD</th>
                                        <th>actionsList(s)</th>
                                        <th>wordType_A</th>
                                        <th>relationshipType_A</th>
                                        <th>wordType_B</th>
                                        <th>relationshipType_B</th>
                                        <th>wordType_C</th>
                                        <th>description</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
