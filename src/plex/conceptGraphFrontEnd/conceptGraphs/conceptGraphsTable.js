import React from "react";
import { Link } from "react-router-dom";
import Masthead from '../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/cgFe_conceptGraphsMainPage_leftNav2.js';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js';
import * as ConceptGraphInMfsFunctions from '../../lib/ipfs/conceptGraphInMfsFunctions.js';
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

const returnListOfConceptGraphsInMFS = async (pCGb) => {
    var aConceptGraphs = [];
    try {
        for await (const file of MiscIpfsFunctions.ipfs.files.ls(pCGb)) {
            var fileName = file.name;
            var fileType = file.type;
            var fileCid = file.cid;
            if ( (fileType=="directory") && (fileName != "mainSchemaForConceptGraph" ) ) {
                aConceptGraphs.push(fileName);
            }
        }
    } catch (e) {}
    return aConceptGraphs;
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
        var aConceptGraphs = await returnListOfConceptGraphsInMFS(pCGb);
        console.log("aConceptGraphs: "+JSON.stringify(aConceptGraphs,null,4))

        var cgDataSet = [];

        for (var z=0;z<aConceptGraphs.length;z++) {
            var nextDirectory = aConceptGraphs[z];
            var ipnsForMainSchemaForConceptGraph = nextDirectory;
            console.log("aConceptGraphs nextDirectory: "+nextDirectory)
            var path = pCGb + nextDirectory + "/words/mainSchemaForConceptGraph/node.txt"
            var oMainSchemaForConceptGraph = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(path)
            console.log("oMainSchemaForConceptGraph: "+JSON.stringify(oMainSchemaForConceptGraph,null,4))
            var cgSlug = oMainSchemaForConceptGraph.conceptGraphData.slug;
            var cgTitle = oMainSchemaForConceptGraph.conceptGraphData.title;
            var cgDescription = oMainSchemaForConceptGraph.conceptGraphData.description;
            var aConcepts = oMainSchemaForConceptGraph.conceptGraphData.aConcepts;
            var numConcepts = aConcepts.length;

            var button_html = "";
            button_html += "<div class='doSomethingButton_small viewSingleConceptGraphButton' ";
            button_html += " data-ipns='"+ipnsForMainSchemaForConceptGraph+"' ";
            button_html += " >";
            button_html += "VIEW";
            button_html += "</div>";

            // functions: NeuroCore engine, NeuroCore subject, active (can have multiple active ?), inactive (means: editing only ?)
            var aCgFunctions = [ "function" ];
            var sCgFunctions = "function";

            var aNextPattern = [
                "",
                z,
                button_html,
                cgSlug,
                cgTitle,
                sCgFunctions,
                ipnsForMainSchemaForConceptGraph,
                cgDescription
              ];
            cgDataSet.push(aNextPattern);

            // create links to individual view / edit existing wordType page
            var oConceptGraphData = {};
            oConceptGraphData.pathname = "/ConceptGraphsFrontEndSingleConceptGraphMainPage/"+ipnsForMainSchemaForConceptGraph;
            oConceptGraphData.conceptgraphbuttonid = 'linkFrom_'+ipnsForMainSchemaForConceptGraph;
            oConceptGraphData.conceptgraphtitle = cgTitle;
            this.state.conceptGraphLinks.push(oConceptGraphData)
            this.forceUpdate();
        }

        makeConceptGraphTable(cgDataSet);

        jQuery(".viewSingleConceptGraphButton").click(function(){
            var ipns = jQuery(this).data("ipns")
            jQuery("#linkFrom_"+ipns).get(0).click()
        })
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
                            <div>The 10-character folder is unique to each node and should be known only to that node (? how secure - ? if need to chmod to make sure director is invisible + inaccessible).</div>
                            <div>This table is obtained using ipfs.files.ls to find all directories at the end of the above pathway.</div>
                        </div>

                        <div style={{display:"none"}} >
                        {this.state.conceptGraphLinks.map(link => (
                            <div >
                                <Link id={link.conceptgraphbuttonid} class='navButton'
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
                                        <th>link</th>
                                        <th>slug</th>
                                        <th>title</th>
                                        <th>functions</th>
                                        <th>ipns</th>
                                        <th>description</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>link</th>
                                        <th>slug</th>
                                        <th>title</th>
                                        <th>functions</th>
                                        <th>ipns</th>
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
