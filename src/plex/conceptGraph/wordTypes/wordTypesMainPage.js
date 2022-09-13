import React, { useCallback } from "react";
import { Link } from "react-router-dom";
// import { NavLink, Link, Route, Router, useHistory } from "react-router-dom";
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/wordTypes_leftNav2.js';
import MakeNewEditOldWordType from './makeNewEditOldWordType.js';
import { generateSqlCommand_wordTypes } from '../settings/neuroCore/tableManagement/generateSqlCommandFxns.js'
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

const tableName = "wordTypes";

function makeTable(tableName,dDataSet) {
    var dtable = jQuery('#table_wordTypes').DataTable({
        data: dDataSet,
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
            { visible: false },
            { visible: false },
            { visible: false },
            { },
            { },
            { },
            { }
        ],
        "dom": '<"pull-left"f><"pull-right"l>tip'
    });
    // Add event listener for opening and closing details
    jQuery('#table_wordTypes tbody').on('click', 'td.details-control', function () {
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
            var template = d[5];
            var oTemplate = JSON.parse(template)
            var sTemplate = JSON.stringify(oTemplate,null,4)

            var expansionHTML = "";
            expansionHTML += "<div>";

            expansionHTML += "<textarea style=width:700px;height:600px; >";
            expansionHTML += sTemplate;
            expansionHTML += "</textarea>";

            expansionHTML += "</div>";

            row.child( expansionHTML ).show();
            tr.addClass('shown');
        }
    });
}

const toggleMakeEditPanel = (toggleButtonID,targetElemID) => {
    var currStatus = jQuery("#"+toggleButtonID).data("status");
    if (currStatus=="closed") {
        jQuery("#"+toggleButtonID).data("status","open");
        jQuery("#"+toggleButtonID).html("hide")
        // jQuery("#neuroCoreMonitoringPanel").css("display","block")
        jQuery("#"+targetElemID).animate({
            height: "500px",
            padding: "10px",
            borderWidth:"1px"
        },500);
    }
    if (currStatus=="open") {
        jQuery("#"+toggleButtonID).data("status","closed");
        jQuery("#"+toggleButtonID).html("show");
        // jQuery("#neuroCoreMonitoringPanel").css("display","none")
        jQuery("#"+targetElemID).animate({
            height: "0px",
            padding: "0px",
            borderWidth:"0px"
        },500);
    }
}

export default class WordTypesMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wordTypeLinks: []
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var sql = " SELECT * FROM "+tableName;
        var dDataSet = [];
        sendAsync(sql).then((result) => {
            var aResult = result;
            var numRows = aResult.length;
            console.log("numRows: "+numRows)
            for (var r=0;r<numRows;r++) {
                var oNextRow = aResult[r];
                var nextRow_id = oNextRow.id;
                var nextRow_slug = oNextRow.slug;
                var nextRow_name = oNextRow.name;
                var nextRow_template = oNextRow.template;
                var nextRow_schema = oNextRow.schema;
                var nextRow_description = oNextRow.description;
                var nextRow_backgroundColor = oNextRow.backgroundColor;
                var nextRow_borderColor = oNextRow.borderColor;
                var nextRow_shape = oNextRow.shape;
                var nextRow_borderWidth = oNextRow.borderWidth;
                var aNextPattern = [];

                // var nextRow_button = "<div data-queryid="+r+" data-sqlid="+nextRow_id+" id=nextRowButton_"+nextRow_id+" class='doSomethingButton_small nextRowEditButton' >load</div>";
                var nextRow_button2 = "<div data-queryid="+r+" data-sqlid="+nextRow_id+" id=nextRowButton2_"+nextRow_id+" class='doSomethingButton_small nextRowEditButton2' style=margin-right:5px; >VIEW / EDIT</div>";
                // var nextRow_button3 = "<Link class='navButton' to='/EditExistingWordTypePage/2' >Link</Link>";
                var nextRow_slug_html = nextRow_button2 + nextRow_slug;
                var nextRow_id_html = nextRow_button2 + nextRow_id;
                aNextPattern = ["",r,
                    nextRow_id_html,
                    nextRow_slug,
                    nextRow_name,
                    nextRow_template,
                    nextRow_schema,
                    nextRow_description,
                    nextRow_backgroundColor,
                    nextRow_borderColor,
                    nextRow_shape,
                    nextRow_borderWidth
                  ];
                dDataSet.push(aNextPattern);

                // create links to individual view / edit existing wordType page
                var oWordTypeData = {};
                oWordTypeData.pathname = "/EditExistingWordTypePage/"+nextRow_id;
                // oWordTypeData.pathname = "/EditExistingWordTypePage";
                oWordTypeData.wordtypesqlid = 'linkFrom_'+nextRow_id;
                oWordTypeData.wordtypeslug = nextRow_slug;
                // cGlinks2.push(cGlinks_obj)
                this.state.wordTypeLinks.push(oWordTypeData)
                this.forceUpdate();
            }
            var sResult = JSON.stringify(result,null,4)
            jQuery("#sqlResultContainer").html(sResult)
            jQuery("#sqlResultContainer").val(sResult)
            makeTable(tableName,dDataSet);

            jQuery(".nextRowEditButton2").click(function(){
                var sqlid = jQuery(this).data("sqlid");

                // alert("sqlid: "+sqlid)
                // jQuery("#linkFrom_"+sqlid).css("background-color","blue")
                // jQuery("#linkFrom_"+sqlid).click()
                // jQuery("#linkFrom_"+sqlid).trigger("click")
                jQuery("#linkFrom_"+sqlid).get(0).click();
            });

            jQuery(".nextRowEditButton").click(function(){
                var queryid = jQuery(this).data("queryid");
                jQuery("#currWordTypeSqlId").val(aResult[queryid].id)
                jQuery("#currWordTypeSqlId").html(aResult[queryid].id)

                jQuery("#newWordTypeSlug").val(aResult[queryid].slug)
                jQuery("#newWordTypeName").html(aResult[queryid].name)
                jQuery("#newWordTypeTemplate").val(JSON.stringify(JSON.parse(aResult[queryid].template),null,4))
                jQuery("#newWordTypeSchema").val(JSON.stringify(JSON.parse(aResult[queryid].schema),null,4))
                jQuery("#newWordTypeDescription").val(aResult[queryid].description)
                jQuery("#newWordTypeBackgroundColor").val(aResult[queryid].backgroundColor)
                jQuery("#newWordTypeBorderColor").val(aResult[queryid].borderColor)
                jQuery("#newWordTypeShape").val(aResult[queryid].shape)
                jQuery("#newWordTypeBorderWidth").val(aResult[queryid].borderWidth)
            })
        })

        jQuery("#toggleMakeEditPanelButton").click(function(){
            toggleMakeEditPanel("toggleMakeEditPanelButton","simpleElementBlockContainer")
        })

        jQuery("#generateSqlCommandButton_makeNew").click(function(){
            generateSqlCommand_wordTypes("makeNew",tableName)
        })

        jQuery("#generateSqlCommandButton_editExisting").click(function(){
            generateSqlCommand_wordTypes("editExisting",tableName)
        })

        jQuery("#generateSqlCommandButton_deleteExisting").click(function(){
            generateSqlCommand_wordTypes("deleteExisting",tableName)
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
    }

    render() {


        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Word Types Main Page</div>

                        <div style={{display:"none"}}>
                        {this.state.wordTypeLinks.map(link => (
                            <div >
                                <Link id={link.wordtypesqlid} class='navButton'
                                  to={link.pathname}
                                >{link.wordtypeslug}
                                </Link>
                            </div>
                        ))}
                        </div>

                        <div style={{display:"none"}}>
                            toggle make new / edit existing panel: <div className="doSomethingButton" id="toggleMakeEditPanelButton" data-status="closed" >show</div>
                            <div id="simpleElementBlockContainer" className="simpleElementBlock" >
                                <MakeNewEditOldWordType />
                            </div>
                        </div>

                        <div className="tableContainer" style={{marginTop:"20px",marginLeft:"20px"}} >
                            <table id="table_wordTypes" className="display" style={{color:"black",width:"95%"}} >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>slug</th>
                                        <th>name</th>
                                        <th>template</th>
                                        <th>schema</th>
                                        <th>description</th>
                                        <th>backgroundColor</th>
                                        <th>borderColor</th>
                                        <th>shape</th>
                                        <th>borderWidth</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>slug</th>
                                        <th>name</th>
                                        <th>template</th>
                                        <th>schema</th>
                                        <th>description</th>
                                        <th>backgroundColor</th>
                                        <th>borderColor</th>
                                        <th>shape</th>
                                        <th>borderWidth</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        SQL Result:<br/>
                        <div id="sqlResultContainer" >result</div>

                    </div>
                </fieldset>
            </>
        );
    }
}
