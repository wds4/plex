import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/neuroCore2_actions_all_leftNav2.js';
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

function makeTable(dDataSet) {
    // add text input box to each header cell
    jQuery('#table_conceptGraphAction_all thead th').each(function () {
        var title = jQuery(this).text();
        jQuery(this).html(title + '<br><input id="searchDiv_'+title+'" type="text" placeholder="Search ' + title + '" />');
    });
    var dtable = jQuery('#table_conceptGraphAction_all').DataTable({
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
    jQuery('#table_conceptGraphAction_all tbody').on('click', 'td.details-control', function () {
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

                // expansionHTML += "<br>";

                expansionHTML += "<div style=display:inline-block;>";
                expansionHTML += actionImageHTML;
                expansionHTML += "</div>";

            expansionHTML += "</div>";

            row.child( expansionHTML ).show();
            tr.addClass('shown');
        }
    });
}

export default class TableForActionsAll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patternLinks: [],
            actionLinks: []
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var dDataSet = [];

        var oSupersetForAction = window.lookupWordBySlug.supersetFor_action
        var aActions = oSupersetForAction.globalDynamicData.specificInstances;
        var aNextAction = [];

        for (var a=0;a<aActions.length;a++) {
            var action_slug = aActions[a];
            var oAction = window.lookupWordBySlug[action_slug]

            var nextRow_actionName = oAction.actionData.name;

            var nextRow_opCodesB = "";
            var nextRow_patternsList_html = "";
            var nextRow_javascript = "";
            var nextRow_description = "";

            if (oAction.actionData.hasOwnProperty("description")) {
                nextRow_description = oAction.actionData.description
            }

            if (oAction.actionData.hasOwnProperty("javascript")) {
                nextRow_javascript = oAction.actionData.javascript
            }

            var nextRow_javascript_html = `<pre style=display:inline-block;margin:0px;padding:0px;width:900px;overflow:scroll;max-height:100px; >`+nextRow_javascript+`</pre>`;

            var nextRow_id = window.lookupSqlIDBySlug[action_slug]

            var nextRow_actionNameSlug_ified = nextRow_actionName.replaceAll(".","_").toLowerCase();
            var nextRow_actionImage = "/assets/img/"+nextRow_actionNameSlug_ified+".png";
            var nextRow_actionImageHTML = "<div style=display:inline-block; ><img src='"+nextRow_actionImage+"' style=width:100px; /></div>";

            var nextRow_actionName_button = "<div data-sqlid="+nextRow_id+" id=nextRowButton_"+nextRow_id+" class='doSomethingButton_small nextRowViewEditButton' >VIEW/EDIT</div>";
            var nextRow_actionName_html = nextRow_actionName + "<br>" + nextRow_actionName_button + "<br>" + nextRow_actionImageHTML;

            aNextAction = [
                "",
                a,
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
            oActionData.pathname = "/NeuroCore2ViewEditActionAll/"+action_slug;
            oActionData.sqlid = 'linkFrom_'+nextRow_id;
            oActionData.name = nextRow_actionName;
            oActionData.slug = action_slug;
            this.state.actionLinks.push(oActionData)
            this.forceUpdate();
        }

        makeTable(dDataSet)

        jQuery(".nextRowViewEditButton").click(function(){
            var sqlid = jQuery(this).data("sqlid");
            // alert("sqlid: "+sqlid)
            jQuery("#linkFrom_"+sqlid).get(0).click();
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
                        <div class="h2">NeuroCore 0.2 Table for Actions: All Actions</div>

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

                        <div className="tableContainer" style={{width:"99%"}} >
                            <div style={{display:"inline-block",width:"350px"}}>Restrict by functional class (was opCodesB):</div>
                            <div className="doSomethingButton restrictByOpCodeBButton" data-opcodeb="a" >Loki Pathway</div>
                            <div className="doSomethingButton restrictByOpCodeBButton" data-opcodeb="b" >Property Tree</div>
                            <div className="doSomethingButton restrictByOpCodeBButton" data-opcodeb="c" >Concept Structure</div>
                            <div className="doSomethingButton restrictByOpCodeBButton" data-opcodeb="rV" >Restricts Value</div>
                            <br/>
                            <table id="table_conceptGraphAction_all" className="display" style={{color:"black",width:"95%"}} >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>actionName</th>
                                        <th>actionName</th>
                                        <th>purpose class(es)</th>
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
                                        <th>purpose class(es)</th>
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
