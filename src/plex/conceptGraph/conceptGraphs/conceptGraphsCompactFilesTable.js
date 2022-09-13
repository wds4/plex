import React from "react";
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/conceptGraphs_leftNav2.js';
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

function makeThisPageTable(compactFileDataSet) {
    // add text input box to each header cell
    jQuery('#table_compactFiles thead th').each(function () {
        var title = jQuery(this).text();
        jQuery(this).html(title + '<br><input id="searchDiv_'+title+'" type="text" placeholder="Search ' + title + '" />');
    });
    var dtable = jQuery('#table_compactFiles').DataTable({
        data: compactFileDataSet,
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
            { },
            { },
            { },
            { visible:false },
            { visible:false },
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
    jQuery('#table_compactFiles tbody').on('click', 'td.details-control', function () {
        var tr = jQuery(this).parents('tr');
        var row = dtable.row( tr );
        if ( row.child.isShown() ) {
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            var d=row.data();
            var sRawFile = d[7];

            var expansionHTML = "";
            expansionHTML += "<div>";

            expansionHTML += "<textarea style=width:700px;height:600px; >";
            expansionHTML += sRawFile;
            expansionHTML += "</textarea>";

            expansionHTML += "</div>";

            row.child( expansionHTML ).show();
            tr.addClass('shown');
        }
    });
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default class ConceptGraphsCompactFilesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        jQuery("#thisPageTableNameContainer").html("compactExports")

        var sql = " SELECT * FROM compactExports ";
        console.log("sql: "+sql)

        var compactFileDataSet = [];
        sendAsync(sql).then( async (result) => {
            var aResult = result;
            var numRows = aResult.length;
            console.log("numRows: "+numRows)
            for (var r=0;r<numRows;r++) {
                var progressHTML = "";
                progressHTML += "loading compactExports progress: ";
                progressHTML += r+1;
                progressHTML += " / ";
                progressHTML += numRows;
                jQuery("#thisPageTableNameContainer").html(progressHTML);
                await delay(0);

                var oNextRow = aResult[r];
                var nextRow_id = oNextRow.id;
                var nextRow_filetype = oNextRow.filetype;
                var nextRow_rawFile = oNextRow.rawFile;
                // var nextRow_name = oNextRow.name;
                var nextRow_conceptGraphTableName = oNextRow.conceptGraphTableName;
                var nextRow_description = oNextRow.description;
                var nextRow_uniqueID = oNextRow.uniqueID;
                var nextRow_slugForContext = oNextRow.slugForContext
                var aNextPattern = [];
                aNextPattern = [
                    "",
                    r,
                    nextRow_id,
                    nextRow_filetype,
                    nextRow_conceptGraphTableName,
                    nextRow_slugForContext,
                    nextRow_description,
                    nextRow_rawFile,
                    nextRow_uniqueID,
                    nextRow_id,
                  ];
                compactFileDataSet.push(aNextPattern);
            }
            jQuery("#thisPageTableNameContainer").css("display","none");
            makeThisPageTable(compactFileDataSet);
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
                        <div class="h2">Compact Concept Graph Imports / Exports Files: Table</div>

                        <div id="thisPageTableNameContainer" style={{display:"inline-block"}}>
                            thisPageTableNameContainer
                        </div>

                        <div className="tableContainer" style={{marginTop:"20px",marginLeft:"20px",overflow:"scroll"}} >
                            <table id="table_compactFiles" className="display" style={{color:"black",width:"95%"}} >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>filetype</th>
                                        <th>concept graph tableName</th>
                                        <th>slugForContext</th>
                                        <th>description</th>
                                        <th>rawFile</th>
                                        <th>uniqueID</th>
                                        <th>id</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>filetype</th>
                                        <th>concept graph tableName</th>
                                        <th>slugForContext</th>
                                        <th>description</th>
                                        <th>rawFile</th>
                                        <th>uniqueID</th>
                                        <th>id</th>
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
