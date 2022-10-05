import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/conceptGraphs_leftNav2.js';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js';
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

const conceptGraphsTableName = "myConceptGraphs";

function makeConceptGraphTable(tableName,cgDataSet) {
    var dtable = jQuery('#table_conceptGraphs').DataTable({
        data: cgDataSet,
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
            { },
            { visible: false }
        ],
        "dom": '<"pull-left"f><"pull-right"l>tip'
    });
}

export default class ConceptGraphsMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptGraphLinks: []
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var sql = " SELECT * FROM "+conceptGraphsTableName;
        var cgDataSet = [];
        sendAsync(sql).then((result) => {
            var aResult = result;
            var numRows = aResult.length;
            console.log("numRows: "+numRows)
            window.aLookupConceptGraphInfoBySqlID = [];
            for (var r=0;r<numRows;r++) {
                var oNextRow = aResult[r];
                var nextRow_id = oNextRow.id;
                var nextRow_slug = oNextRow.slug;
                var nextRow_title = oNextRow.title;
                var nextRow_tableName = oNextRow.tableName;
                var nextRow_mainSchema_slug = oNextRow.mainSchema_slug;
                var nextRow_description = oNextRow.description;
                var aNextPattern = [];

                window.aLookupConceptGraphInfoBySqlID[nextRow_id] = {};
                window.aLookupConceptGraphInfoBySqlID[nextRow_id].slug = nextRow_slug;
                window.aLookupConceptGraphInfoBySqlID[nextRow_id].title = nextRow_title;
                window.aLookupConceptGraphInfoBySqlID[nextRow_id].tableName = nextRow_tableName;
                window.aLookupConceptGraphInfoBySqlID[nextRow_id].mainSchema_slug = nextRow_mainSchema_slug;

                // var nextRow_button = "<div data-queryid="+r+" data-sqlid="+nextRow_id+" id=nextRowButton_"+nextRow_id+" class='doSomethingButton_small nextRowEditButton' >load</div>";
                var nextRow_button2 = "<div data-queryid="+r+" data-sqlid="+nextRow_id+" id=nextRowButton2_"+nextRow_id+" class='doSomethingButton_small nextRowEditButton2' style=margin-right:5px; >VIEW / EDIT</div>";
                // var nextRow_button3 = "<Link class='navButton' to='/EditExistingWordTypePage/2' >Link</Link>";
                var nextRow_slug_html = nextRow_button2 + nextRow_slug;
                var nextRow_id_html = nextRow_button2 + nextRow_id;
                aNextPattern = ["",r,
                    nextRow_id_html,
                    nextRow_slug,
                    nextRow_title,
                    nextRow_tableName,
                    nextRow_mainSchema_slug,
                    nextRow_description
                  ];
                cgDataSet.push(aNextPattern);

                // create links to individual view / edit existing wordType page
                var oConceptGraphData = {};
                oConceptGraphData.pathname = "/EditExistingConceptGraphPage/"+nextRow_id;
                oConceptGraphData.conceptgraphsqlid = 'linkFrom_'+nextRow_id;
                oConceptGraphData.conceptgraphtitle = nextRow_title;
                this.state.conceptGraphLinks.push(oConceptGraphData)
                this.forceUpdate();
            }
            var sResult = JSON.stringify(result,null,4)
            jQuery("#sqlResultContainer").html(sResult)
            jQuery("#sqlResultContainer").val(sResult)

            makeConceptGraphTable(conceptGraphsTableName,cgDataSet);

            jQuery(".nextRowEditButton2").click(function(){
                var sqlid = jQuery(this).data("sqlid");
                jQuery("#linkFrom_"+sqlid).get(0).click();
            })
            MiscFunctions.updateMastheadBar();
        })

    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" style={{backgroundColor:"#BFBFBF"}} >
                        <ConceptGraphMasthead />
                        <div class="h2">Concept Graphs Main Page</div>

                        <div style={{display:"none"}}>
                        {this.state.conceptGraphLinks.map(link => (
                            <div >
                                <Link id={link.conceptgraphsqlid} class='navButton'
                                  to={link.pathname}
                                >{link.conceptgraphtitle}
                                </Link>
                            </div>
                        ))}
                        </div>

                        <div className="tableContainer" style={{marginTop:"20px",marginLeft:"20px"}} >
                            <table id="table_conceptGraphs" className="display" style={{color:"black",width:"95%"}} >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>slug</th>
                                        <th>title</th>
                                        <th>tableName</th>
                                        <th>mainSchema_slug</th>
                                        <th>description</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>slug</th>
                                        <th>title</th>
                                        <th>tableName</th>
                                        <th>mainSchema_slug</th>
                                        <th>description</th>
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
