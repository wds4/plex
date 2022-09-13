import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleConcept_specificInstances_leftNav2.js';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

function makeThisPageTable(tableName,wordDataSet) {
    var dtable = jQuery('#table_specificInstances').DataTable({
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
            { }
        ],
        "dom": '<"pull-left"f><"pull-right"l>tip'
    });
}

export default class SingleConceptAllSpecificInstancesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            specificInstanceLinks: []
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var thisPageTableName = "unknown";
        var currCgID = window.currentConceptGraphSqlID;
        if (window.aLookupConceptGraphInfoBySqlID.hasOwnProperty(currCgID)) {
            thisPageTableName = ""+window.aLookupConceptGraphInfoBySqlID[currCgID].tableName;
        }

        var conceptSlug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;
        var oConcept = window.lookupWordBySlug[conceptSlug];
        var supersetSlug = oConcept.conceptData.nodes.superset.slug;
        var oSuperset = window.lookupWordBySlug[supersetSlug];
        var aSpecificInstances = [];
        try {
            aSpecificInstances = oSuperset.globalDynamicData.specificInstances;
            if (!aSpecificInstances) { aSpecificInstances = [] }
        } catch (e) {}
        aSpecificInstances = aSpecificInstances.sort();
        var numSpecificInstances = aSpecificInstances.length;
        var tableDataSet = [];
        var specialExportHTML = "";
        for (var s=0;s<numSpecificInstances;s++) {
            var nextRow_slug = aSpecificInstances[s];
            var oNextSpecificInstance = window.lookupWordBySlug[nextRow_slug]
            var nextRow_name = oNextSpecificInstance.wordData.name;

            var nextRow_button = "<div data-slug='"+nextRow_slug+"' class='doSomethingButton_small nextRowEditButton' style=margin-right:5px; >VIEW / EDIT</div>";
            // var nextRow_slug_html = nextRow_button2 + nextRow_slug;
            var nextRow_s_html = nextRow_button + s;

            var aNextRow = ["",
                nextRow_s_html,
                nextRow_slug,
                nextRow_name,
            ];
            tableDataSet.push(aNextRow);

            // create links to individual view / edit existing wordType page
            var oRowData = {};
            oRowData.pathname = "/SingleConceptSingleSpecificInstance/"+nextRow_slug;
            oRowData.name = nextRow_name;
            oRowData.slug = nextRow_slug;
            oRowData.linkFrom = "linkFrom_"+nextRow_slug
            this.state.specificInstanceLinks.push(oRowData)
            this.forceUpdate();
            // specialExportHTML += `"`+oNextSpecificInstance.actionData.slug+`",`;
            specialExportHTML += "<br>";
        }
        // jQuery("#specialExportContainer").html(specialExportHTML)
        makeThisPageTable(thisPageTableName,tableDataSet);

        jQuery(".nextRowEditButton").click(function(){
            var slug = jQuery(this).data("slug");
            jQuery("#linkFrom_"+slug).get(0).click();
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
                        <div class="h2">Single Concept All Specific Instances (table)</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>
                        <div class="h3" >{window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug}</div>

                        <div id="specialExportContainer" ></div>

                        <div style={{display:"none"}} >
                        {this.state.specificInstanceLinks.map(link => (
                            <div >
                                <Link id={link.linkFrom} slug={link.slug} class='navButton'
                                  to={link.pathname}
                                >{link.name}
                                </Link>
                            </div>
                        ))}
                        </div>

                        <div className="tableContainer" style={{marginTop:"20px",marginLeft:"20px"}} >
                            <table id="table_specificInstances" className="display" style={{color:"black",width:"95%"}} >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>slug</th>
                                        <th>name</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>slug</th>
                                        <th>name</th>
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
