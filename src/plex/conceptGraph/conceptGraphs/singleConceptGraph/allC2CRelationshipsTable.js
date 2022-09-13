import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/singleConceptGraph_c2cRels_leftNav2.js';
import * as MiscFunctions from '../../../functions/miscFunctions.js';
// import sendAsync from '../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

function makeThisPageTable(tableName,conceptDataSet) {
    var dtable = jQuery('#table_concepts').DataTable({
        data: conceptDataSet,
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
            { }
        ],
        "dom": '<"pull-left"f><"pull-right"l>tip'
    });
}

export default class AllC2CRelationshipsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var thisPageTableName = "unknown";
        var currCgID = window.currentConceptGraphSqlID;
        console.log("currCgID: "+currCgID)
        var conceptGraphMainSchemaSlug = window.aLookupConceptGraphInfoBySqlID[currCgID].mainSchema_slug;

        var oConceptGraphMainSchema = window.lookupWordBySlug[conceptGraphMainSchemaSlug];
        var aRels = oConceptGraphMainSchema.schemaData.relationships;
        var numRels = aRels.length;
        var c2cRelsDataSet = [];
        for (var r=0;r<numRels;r++) {
            var oNextRel = aRels[r];
            var aNextPattern = [];
            aNextPattern = ["",r,
                oNextRel.nodeFrom.slug,
                oNextRel.relationshipType.slug,
                oNextRel.nodeTo.slug
            ];
            c2cRelsDataSet.push(aNextPattern);
        }
        makeThisPageTable(thisPageTableName,c2cRelsDataSet);
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">All C2C Relationships (Table)</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>

                        <div className="tableContainer" style={{marginTop:"20px",marginLeft:"20px"}} >
                            <table id="table_concepts" className="display" style={{color:"black",width:"95%"}} >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>conceptFrom</th>
                                        <th>relationshipType</th>
                                        <th>conceptTo</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>conceptFrom</th>
                                        <th>relationshipType</th>
                                        <th>conceptTo</th>
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
