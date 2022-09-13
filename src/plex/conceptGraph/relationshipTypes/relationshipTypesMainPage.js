import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/relationshipTypes_leftNav2.js';
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

const relTypesTableName = "relationshipTypes";

function makeRelTypesTable(tableName,dDataSet) {
    var dtable = jQuery('#table_relationshipTypes').DataTable({
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
            { },
            { },
            { },
            { }
        ],
        "dom": '<"pull-left"f><"pull-right"l>tip'
    });
}

export default class RelationshipTypesMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            relationshipTypeLinks: []
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var sql = " SELECT * FROM "+relTypesTableName;
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
                var nextRow_description = oNextRow.description;
                var nextRow_color = oNextRow.color;
                var nextRow_polarity= oNextRow.polarity;
                var nextRow_width = oNextRow.width;
                var nextRow_dashes = oNextRow.dashes;
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
                    nextRow_description,
                    nextRow_color,
                    nextRow_polarity,
                    nextRow_width,
                    nextRow_dashes
                  ];
                dDataSet.push(aNextPattern);

                // create links to individual view / edit existing wordType page
                var oRelTypeData = {};
                oRelTypeData.pathname = "/EditExistingRelationshipTypePage/"+nextRow_id;
                oRelTypeData.reltypesqlid = 'linkFrom_'+nextRow_id;
                oRelTypeData.reltypeslug = nextRow_slug;
                this.state.relationshipTypeLinks.push(oRelTypeData)
                this.forceUpdate();
            }
            var sResult = JSON.stringify(result,null,4)
            jQuery("#sqlResultContainer").html(sResult)
            jQuery("#sqlResultContainer").val(sResult)
            makeRelTypesTable(relTypesTableName,dDataSet);

            jQuery(".nextRowEditButton2").click(function(){
                var sqlid = jQuery(this).data("sqlid");
                jQuery("#linkFrom_"+sqlid).get(0).click();
            });
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
                        <div class="h2">Relationship Types Main Page</div>

                        <div style={{display:"none"}}>
                        {this.state.relationshipTypeLinks.map(link => (
                            <div >
                                <Link id={link.reltypesqlid} class='navButton'
                                  to={link.pathname}
                                >{link.reltypeslug}
                                </Link>
                            </div>
                        ))}
                        </div>

                        <div className="tableContainer" style={{marginTop:"20px",marginLeft:"20px"}} >
                            <table id="table_relationshipTypes" className="display" style={{color:"black",width:"95%"}} >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>slug</th>
                                        <th>name</th>
                                        <th>description</th>
                                        <th>color</th>
                                        <th>polarity</th>
                                        <th>width</th>
                                        <th>dashes</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>slug</th>
                                        <th>name</th>
                                        <th>description</th>
                                        <th>color</th>
                                        <th>polarity</th>
                                        <th>width</th>
                                        <th>dashes</th>
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
