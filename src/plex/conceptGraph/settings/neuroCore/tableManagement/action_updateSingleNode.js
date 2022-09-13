import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/neuroCore_actions_u1n_leftNav2.js';
import { generateSqlCommand_s1n } from './generateSqlCommandFxns.js'
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

const tableName = "conceptGraphActions_u1n";

function makeTable(tableName,dDataSet) {
    // add text input box to each header cell
    jQuery('#table_conceptGraphAction_u1n thead th').each(function () {
        var title = jQuery(this).text();
        jQuery(this).html(title + '<br><input id="searchDiv_'+title+'" type="text" placeholder="Search ' + title + '" />');
    });
    var dtable = jQuery('#table_conceptGraphAction_u1n').DataTable({
        data: dDataSet,
        pageLength: 100,
        "columns": [
            {
                "class":          'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
            { visible:false },
            { visible:false },
            { visible:false },
            { },
            { },
            { },
            { },
            { visible:false },
            { visible:false }
        ],
        order: [[3,"asc"]],
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
    jQuery('#table_conceptGraphAction_u1n tbody').on('click', 'td.details-control', function () {
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
            var actionName = d[3];
            var javascript = d[9];
            var description = d[8];

            var actionNameSlug_ified = actionName.replaceAll(".","_").toLowerCase();
            var actionImage = "/assets/img/"+actionNameSlug_ified+".png";
            var actionImageHTML = "<div style=display:inline-block; ><img src='"+actionImage+"' style=width:600px; /></div>";

            var expansionHTML = "";
            expansionHTML += "<div>";
                expansionHTML += "<div>";
                expansionHTML += "Description: "+ description;
                expansionHTML += "</div>";

                expansionHTML += "<pre style=display:inline-block;width:900px;overflow:scroll;background-color:yellow; >";
                expansionHTML += javascript;
                expansionHTML += "</pre>";

                expansionHTML += "<div style=display:inline-block;>";
                expansionHTML += actionImageHTML;
                expansionHTML += "</div>";

            expansionHTML += "</div>";

            row.child( expansionHTML ).show();
            tr.addClass('shown');
        }
    });
}

export default class TableForActionsUpdateSingleNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patternLinks: [],
            actionLinks: []
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var sql = " SELECT * FROM "+tableName+" ORDER BY actionName ASC ";
        var dDataSet = [];
        sendAsync(sql).then((result) => {
            var aResult = result;
            var numRows = aResult.length;
            console.log("numRows: "+numRows)
            var aPatternsList = [];
            var exportListHTML = "";
            for (var r=0;r<numRows;r++) {
                var oNextRow = aResult[r];
                var nextRow_id = oNextRow.id;
                var nextRow_actionName = oNextRow.actionName;
                var nextRow_opCodesB = oNextRow.opCodesB;
                var nextRow_patternsList = oNextRow.patternsList;
                var nextRow_description = oNextRow.description;
                var nextRow_javascript = oNextRow.javascript;
                var aNextAction = [];

                var nextRow_patternsList_html = "";
                var aPatterns = nextRow_patternsList.split(",");
                for (var s=0;s<aPatterns.length;s++) {
                    var nextPattern = aPatterns[s];
                    nextRow_patternsList_html += "<div class='doSomethingButton nextPatternViewEditButton' ";
                    nextRow_patternsList_html += " data-patternname='"+nextPattern+"' ";

                    var doesPatternExist = false;
                    if (jQuery.inArray(nextPattern,window.neuroCore.aS1nPatternsByName) > -1) {
                        doesPatternExist = true;
                    }
                    if (jQuery.inArray(nextPattern,window.neuroCore.aS1rPatternsByName) > -1) {
                        doesPatternExist = true;
                    }
                    if (jQuery.inArray(nextPattern,window.neuroCore.aS2rPatternsByName) > -1) {
                        doesPatternExist = true;
                    }
                    if (!doesPatternExist) {
                        nextRow_patternsList_html += " style=border-color:red;color:red;background-color:white; ";
                    }

                    nextRow_patternsList_html += " >";
                    nextRow_patternsList_html += nextPattern;
                    nextRow_patternsList_html += "</div>";
                    if (s+1<aPatterns.length) {
                        nextRow_patternsList_html += "<br>";
                    }
                    if (jQuery.inArray(nextPattern,aPatternsList) == -1) {
                        aPatternsList.push(nextPattern)
                        var oPatternData = {};
                        // need to determine which table to link to
                        oPatternData.pathname = "/";
                        console.log("is nextPattern: "+nextPattern+" in window.neuroCore.aS1nPatternsByName?"+JSON.stringify(window.neuroCore.aS1nPatternsByName,null,4))
                        console.log("is nextPattern: "+nextPattern+" in window.neuroCore.aS1rPatternsByName?"+JSON.stringify(window.neuroCore.aS1rPatternsByName,null,4))
                        console.log("is nextPattern: "+nextPattern+" in window.neuroCore.aS2rPatternsByName?"+JSON.stringify(window.neuroCore.aS2rPatternsByName,null,4))
                        if (jQuery.inArray(nextPattern,window.neuroCore.aS1nPatternsByName) > -1) {
                            oPatternData.pathname = "/NeuroCoreViewEditPatternSingleNode/"+nextPattern;
                            // console.log("nextPattern: "+nextPattern+"in aS1nPatternsByName")
                        }
                        if (jQuery.inArray(nextPattern,window.neuroCore.aS1rPatternsByName) > -1) {
                            oPatternData.pathname = "/NeuroCoreViewEditPatternSingleRelationship/"+nextPattern;
                            // console.log("nextPattern: "+nextPattern+"in aS1rPatternsByName")
                        }
                        if (jQuery.inArray(nextPattern,window.neuroCore.aS2rPatternsByName) > -1) {
                            oPatternData.pathname = "/NeuroCoreViewEditPatternDoubleRelationship/"+nextPattern;
                            // console.log("nextPattern: "+nextPattern+"in aS2rPatternsByName")
                        }

                        var nextPattern_x = nextPattern.replaceAll(".","_")
                        oPatternData.patternlink = 'patternLinkFrom_'+nextPattern_x;
                        oPatternData.name = nextPattern;
                        this.state.patternLinks.push(oPatternData)
                        this.forceUpdate();
                    }
                    // this.forceUpdate();
                }

                var nextRow_actionNameSlug_ified = nextRow_actionName.replaceAll(".","_").toLowerCase();
                var nextRow_actionImage = "/assets/img/"+nextRow_actionNameSlug_ified+".png";
                var nextRow_actionImageHTML = "<div style=display:inline-block; ><img src='"+nextRow_actionImage+"' style=width:100px; /></div>";

                var nextRow_javascript_html = `<pre style=display:inline-block;margin:0px;padding:0px;width:900px;overflow:scroll;max-height:100px; >`+nextRow_javascript+`</pre>`;

                var nextRow_actionName_button = "<div data-queryid="+r+" data-sqlid="+nextRow_id+" id=nextRowButton_"+nextRow_id+" class='doSomethingButton_small nextRowViewEditButton' >VIEW/EDIT</div>";
                var nextRow_actionName_html = nextRow_actionName + "<br>" + nextRow_actionName_button + "<br>" + nextRow_actionImageHTML;
                aNextAction = ["",r,
                    nextRow_id,
                    nextRow_actionName,
                    nextRow_actionName_html,
                    nextRow_opCodesB,
                    nextRow_patternsList_html,
                    nextRow_javascript_html,
                    nextRow_description,
                    nextRow_javascript
                  ];
                dDataSet.push(aNextAction);

                // create links to individual view / edit existing wordType page
                var oActionData = {};
                // oActionData.pathname = "/NeuroCoreViewEditActionUpdateSingleNode/"+nextRow_id;
                oActionData.pathname = "/NeuroCoreViewEditActionUpdateSingleNode/"+nextRow_actionName;
                oActionData.sqlid = 'linkFrom_'+nextRow_id;
                oActionData.name = nextRow_actionName;
                this.state.actionLinks.push(oActionData)
                this.forceUpdate();

                var nextRow_actionName_x = nextRow_actionName.replaceAll(".","-").toLowerCase();
                exportListHTML += nextRow_actionName;
                exportListHTML += "<br>"+nextRow_actionName_x;
                exportListHTML += "<br><br>";
            }
            // jQuery("#exportListContainer").html(exportListHTML)
            var sResult = JSON.stringify(result,null,4)
            jQuery("#sqlResultContainer").html(sResult)
            jQuery("#sqlResultContainer").val(sResult)
            makeTable(tableName,dDataSet);

            jQuery(".nextRowViewEditButton").click(function(){
                var sqlid = jQuery(this).data("sqlid");
                // alert("sqlid: "+sqlid)
                jQuery("#linkFrom_"+sqlid).get(0).click();
            })
            jQuery(".nextPatternViewEditButton").click(function(){
                var patternName = jQuery(this).data("patternname");
                // var sqlid = jQuery(this).data("sqlid");
                var patternName_x = patternName.replaceAll(".","_")
                // alert("patternName_x: "+patternName_x)
                jQuery("#patternLinkFrom_"+patternName_x).get(0).click();
            })
        })
        jQuery(".restrictByOpCodeBButton").click(function(){
            var opCodeB = jQuery(this).data("opcodeb");
            // console.log("restrictToLokiPathwayButton; opCodeB: "+opCodeB)
            jQuery('#searchDiv_opCodesB').val(opCodeB).change();
        });
        jQuery(".restrictByOpCodeCButton").click(function(){
            var opCodeC = jQuery(this).data("opcodec");
            // console.log("restrictToLokiPathwayButton; opCodeC: "+opCodeC)
            jQuery('#searchDiv_actionName').val(opCodeC).change();
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
                        <div class="h2">Table for Actions: Update Single Node</div>

                        <div id="exportListContainer" ></div>

                        <div style={{display:"none"}} >
                        {this.state.actionLinks.map(link => (
                            <div >
                                <Link id={link.sqlid} class='navButton'
                                  to={link.pathname}
                                >{link.name}
                                </Link>
                            </div>
                        ))}
                        </div>

                        <div style={{display:"none"}} >
                        {this.state.patternLinks.map(link => (
                            <div >
                                <Link id={link.patternlink} class='navButton'
                                  to={link.pathname}
                                >{link.name}
                                </Link>
                            </div>
                        ))}
                        </div>

                        <div className="tableContainer" style={{width:"99%"}} >
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
                            <table id="table_conceptGraphAction_u1n" className="display" style={{color:"black",width:"95%"}} >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>actionName</th>
                                        <th>actionName</th>
                                        <th>opCodesB</th>
                                        <th>patternsList</th>
                                        <th>javascript</th>
                                        <th>description</th>
                                        <th>javascript</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>actionName</th>
                                        <th>actionName</th>
                                        <th>opCodesB</th>
                                        <th>patternsList</th>
                                        <th>javascript</th>
                                        <th>description</th>
                                        <th>javascript</th>
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
