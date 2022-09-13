import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/neuroCore2_patterns_s1n_leftNav2.js';
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

function makeTable(dDataSet) {
    // add text input box to each header cell
    jQuery('#table_conceptGraphPattern_s1r thead th').each(function () {
        var title = jQuery(this).text();
        jQuery(this).html('<input id="searchDiv_'+title+'" type="text" placeholder="Search ' + title + '" />');
    });
    var dtable = jQuery('#table_conceptGraphPattern_s1r').DataTable({
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
            { visible: false },
            { visible: false },
            { },
            { },
            { visible: false }
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
    jQuery('#table_conceptGraphPattern_s1r tbody').on('click', 'td.details-control', function () {
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

export default class TableForPatternsSingleNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patternLinks: [],
            actionLinks: []
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 500px)");

        var dDataSet = [];

        var oSetForPatterns = window.lookupWordBySlug.patterns_singleNode
        // console.log("oSetForPatterns: "+JSON.stringify(oSetForPatterns,null,4))
        var aPatterns = oSetForPatterns.globalDynamicData.specificInstances;
        var aNextPattern = [];

        for (var a=0;a<aPatterns.length;a++) {
            var pattern_slug = aPatterns[a];
            var oPattern = window.lookupWordBySlug[pattern_slug]

            var nextRow_id = window.lookupSqlIDBySlug[pattern_slug]

            var nextRow_patternName = oPattern.patternData.name;
            var nextRow_description = "";
            if (oPattern.patternData.hasOwnProperty("description")) {
                nextRow_description = oPattern.patternData.description
            }

            var nextRow_opCodesB = "";
            var nextRow_opCodeD = "";
            var nextRow_actionsList_html = "";
            var nextRow_javascript = "";
            if (oPattern.patternData.singleNodeFieldsetData.hasOwnProperty("javascript")) {
                nextRow_javascript = oPattern.patternData.singleNodeFieldsetData.javascript;
            }

            var nextRow_javascript_html = `<pre style=display:inline-block;margin:0px;padding:0px;width:900px;overflow:scroll; >`+nextRow_javascript+`</pre>`;

            var nextRow_patternName_button = "<div data-sqlid="+nextRow_id+" id=nextRowButton_"+nextRow_id+" class='doSomethingButton_small nextRowViewEditButton' >VIEW/EDIT</div>";
            var nextRow_patternName_html = nextRow_patternName + "<br>" + nextRow_patternName_button;

            aNextPattern = [
                "",
                a,
                nextRow_id,
                nextRow_patternName,
                nextRow_patternName_html,
                nextRow_opCodesB,
                nextRow_opCodeD,
                nextRow_actionsList_html,
                nextRow_javascript_html,
                nextRow_description
            ];
            dDataSet.push(aNextPattern);

            // create links to individual view / edit existing wordType page
            var oPatternData = {};
            // oActionData.pathname = "/NeuroCoreViewEditActionUpdateSingleNode/"+nextRow_id;
            oPatternData.pathname = "/NeuroCore2ViewEditPatternSingleNode/"+pattern_slug;
            oPatternData.sqlid = 'linkFrom_'+nextRow_id;
            oPatternData.name = nextRow_patternName;
            oPatternData.slug = pattern_slug;
            this.state.patternLinks.push(oPatternData)
            this.forceUpdate();
        }

        makeTable(dDataSet)

        jQuery(".nextRowViewEditButton").click(function(){
            var sqlid = jQuery(this).data("sqlid");
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
                        <div class="h2">NeuroCore 0.2 Table for Patterns: Single Node</div>

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

                        <div className="tableContainer" style={{width:"99%",overflowY:"scroll"}} >
                            <table id="table_conceptGraphPattern_s1r" className="display" style={{color:"black",width:"95%"}} >
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
                                        <th>javascript</th>
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
                                        <th>javascript</th>
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
