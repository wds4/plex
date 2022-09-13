import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/singleConceptGraph_leftNav2.js';
import * as MiscFunctions from '../../../functions/miscFunctions.js';
import sendAsync from '../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

function makeThisPageTable(wordDataSet) {
    // add text input box to each header cell
    jQuery('#table_relationships thead th').each(function () {
        var title = jQuery(this).text();
        jQuery(this).html(title + '<br><input id="searchDiv_'+title+'" type="text" placeholder="Search ' + title + '" />');
    });
    var dtable = jQuery('#table_relationships').DataTable({
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
    jQuery('#table_relationships tbody').on('click', 'td.details-control', function () {
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
            var sRelationship = d[6];

            var expansionHTML = "";
            expansionHTML += "<div>";
            expansionHTML += "<textarea style=width:800px;height:300px; >";
            expansionHTML += sRelationship;
            expansionHTML += "</textarea>";
            expansionHTML += "</div>";

            row.child( expansionHTML ).show();
            tr.addClass('shown');
        }
    });
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default class AllRelationshipsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wordLinks: []
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 500px)");

        var relationshipDataSet = [];

        var aWords = Object.keys(window.lookupWordBySlug);
        for (var w=0;w<aWords.length;w++) {
            var nextWord_slug = aWords[w];
            var oNextWord = window.lookupWordBySlug[nextWord_slug];
            var aWordTypes = oNextWord.wordData.wordTypes;
            if (jQuery.inArray("schema",aWordTypes) > -1) {
                var aRelationships = oNextWord.schemaData.relationships;
                for (var r=0;r<aRelationships.length;r++) {
                    var oNextRel = aRelationships[r];
                    var sNextRel = JSON.stringify(oNextRel,null,4);
                    var nF_slug = oNextRel.nodeFrom.slug;
                    var rT_slug = oNextRel.relationshipType.slug;
                    var nT_slug = oNextRel.nodeTo.slug;

                    var aNextEntry = [
                      "",
                      r,
                      nF_slug,
                      rT_slug,
                      nT_slug,
                      nextWord_slug,
                      sNextRel
                    ];

                    relationshipDataSet.push(aNextEntry)

                }
            }
        }

        makeThisPageTable(relationshipDataSet);
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" style={{backgroundColor:"#CFCFCF"}} >
                        <ConceptGraphMasthead />
                        <div class="h2" >All Relationships (Table)</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>

                        <div className="tableContainer" style={{marginTop:"20px",marginLeft:"20px",overflow:"scroll"}} >
                            <table id="table_relationships" className="display" style={{color:"black",width:"95%"}} >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>nodeFrom</th>
                                        <th>relationshipType</th>
                                        <th>nodeTo</th>
                                        <th>schema source</th>
                                        <th>relationship</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>nodeFrom</th>
                                        <th>relationshipType</th>
                                        <th>nodeTo</th>
                                        <th>schema source</th>
                                        <th>relationship</th>
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
