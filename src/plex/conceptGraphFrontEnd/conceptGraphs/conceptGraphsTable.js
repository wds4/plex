import React from "react";
import { Link } from "react-router-dom";
import Masthead from '../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/cgFe_conceptGraphsMainPage_leftNav2.js';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js';
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

function makeConceptGraphTable(cgDataSet) {
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

export default class ConceptGraphsFrontEndTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptGraphLinks: []
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var pCGb = window.ipfs.pCGb;
        jQuery("#pCGbContainer").html(pCGb)

        var cgDataSet = [];

        makeConceptGraphTable(cgDataSet);
    }
    render() {
        var pCGb = window.ipfs.pCGb;
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" style={{backgroundColor:"#BFBFBF"}} >
                        <Masthead />
                        <div class="h2">Table of Concept Graphs (front end)</div>

                        <div style={{border:"1px solid orange",padding:"10px",fontSize:"10px",backgroundColor:"#DFDFDF"}}>
                            All front end concept graphs are stored in the Mutable File System along the following path:
                            <div id="pCGbContainer" >pCGb container</div>
                            The 10-character folder is unique to each node and should be known only to that node (? how secure - ? if need to chmod to make sure director is invisible + inaccessible).
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
                    </div>
                </fieldset>
            </>
        );
    }
}
