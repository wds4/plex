import React from "react";
import { Link } from "react-router-dom";
import Masthead from '../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/cgFe_concepts_leftNav2.js';
import * as MiscFunctions from '../../../functions/miscFunctions.js';
import * as ConceptGraphInMfsFunctions from '../../../lib/ipfs/conceptGraphInMfsFunctions.js';
import sendAsync from '../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

function makeThisPageTable(conceptDataSet) {
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
            { "visible": false },
            { }
        ],
        "dom": '<"pull-left"f><"pull-right"l>tip'
    });
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default class AllConceptsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptLinks: [],
            conceptLinks2: []
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var conceptGraphMainSchema_slug = window.ipfs.activeConceptGraph.slug;
        // var oConceptGraphMainSchema = window.lookupWordBySlug[conceptGraphMainSchema_slug];

        var oConceptGraphMainSchema = await ConceptGraphInMfsFunctions.lookupWordBySlug(conceptGraphMainSchema_slug);

        var aConceptList = oConceptGraphMainSchema.conceptGraphData.concepts;

        var conceptDataSet = [];

        for (var c=0;c<aConceptList.length;c++) {
            var concept_slug = aConceptList[c];
            // var oConcept = window.lookupWordBySlug[concept_slug];
            var oConcept = await ConceptGraphInMfsFunctions.lookupWordBySlug(concept_slug);
            var concept_name = oConcept.conceptData.name.singular;
            var concept_ipns = oConcept.metaData.ipns;
            // var concept_slug = oConcept.wordData.slug;

            var r = 0;
            var nextRow_id = window.lookupSqlIDBySlug[concept_slug];
            var nextRow_old_button = "<div data-sqlid="+nextRow_id+" class='doSomethingButton_small nextRowEditButton_old' style=margin-right:5px; >VIEW / EDIT (back-end)</div>";
            var nextRow_button = "<div data-sqlid="+nextRow_id+" data-slug="+concept_slug+" data-ipns="+concept_ipns+" class='doSomethingButton_small nextRowEditButton' style=margin-right:5px; >VIEW / EDIT</div>";
            // var nextRow_id_html = nextRow_old_button + nextRow_button + nextRow_id;
            var nextRow_id_html = nextRow_old_button + nextRow_button;

            /*
            window.ipfs.aLookupConceptInfoBySqlID = [];
            window.ipfs.aLookupConceptInfoBySqlID[nextRow_id] = {};
            window.ipfs.aLookupConceptInfoBySqlID[nextRow_id].slug = concept_slug;
            window.ipfs.aLookupConceptInfoBySqlID[nextRow_id].name = oConcept.wordData.name;
            window.ipfs.aLookupConceptInfoBySqlID[nextRow_id].title = oConcept.wordData.title;
            */

            // This updates the Concept Name field in the masthead and is utilized in the back end to keep track
            window.aLookupConceptInfoBySqlID[nextRow_id] = {};
            window.aLookupConceptInfoBySqlID[nextRow_id].slug = concept_slug;
            window.aLookupConceptInfoBySqlID[nextRow_id].name = oConcept.wordData.name;
            window.aLookupConceptInfoBySqlID[nextRow_id].title = oConcept.wordData.title;


            // var concept_conceptName = oConcept.conceptData.name.singular;

            var aNextPattern = [
                "",
                c,
                nextRow_id_html,
                concept_slug,
                concept_name
            ];
            conceptDataSet.push(aNextPattern);

            // create links to individual view / edit existing wordType page
            var oConceptData = {};
            oConceptData.pathname = "/ConceptGraphsFrontEnd_SingleConceptMainPage/"+concept_slug;
            oConceptData.conceptsqlid = 'linkFrom_'+concept_slug;
            oConceptData.conceptslug = concept_slug;
            this.state.conceptLinks.push(oConceptData)

            // Links to back end concept page (stored in SQL, not MFS)
            var oConceptData2 = {};
            oConceptData2.pathname = "/SingleConceptGeneralInfo/"+nextRow_id;
            oConceptData2.conceptsqlid = 'linkOldFrom_'+nextRow_id;
            oConceptData2.conceptslug = concept_slug;
            this.state.conceptLinks2.push(oConceptData2)

            this.forceUpdate();
        }
        makeThisPageTable(conceptDataSet);

        jQuery(".nextRowEditButton").click(function(){
            // var sqlid = jQuery(this).data("sqlid");
            var slug = jQuery(this).data("slug");
            jQuery("#linkFrom_"+slug).get(0).click();
        })
        jQuery(".nextRowEditButton_old").click(function(){
            var sqlid = jQuery(this).data("sqlid");
            jQuery("#linkOldFrom_"+sqlid).get(0).click();
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" style={{backgroundColor:"#CFCFCF"}} >
                        <Masthead />
                        <div class="h2">All Concepts</div>
                        <div style={{marginLeft:"20px"}} >
                            This list of concepts is generated from the conceptGraphMainSchema at: conceptGraphData.concepts. If incomplete or incorrect, may need to run neuroCore to edit the list.
                        </div>

                        <div style={{display:"none"}}>
                        {this.state.conceptLinks.map(link => (
                            <div >
                                <Link id={link.conceptsqlid} class='navButton'
                                  to={link.pathname}
                                >{link.conceptname}
                                </Link>
                            </div>
                        ))}
                        </div>

                        <div style={{display:"none"}}>
                        {this.state.conceptLinks2.map(link => (
                            <div >
                                <Link id={link.conceptsqlid} class='navButton'
                                  to={link.pathname}
                                >{link.conceptname}
                                </Link>
                            </div>
                        ))}
                        </div>

                        <div className="tableContainer" style={{marginTop:"20px",marginLeft:"20px"}} >
                            <table id="table_concepts" className="display" style={{color:"black",width:"95%"}} >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>word-slug</th>
                                        <th>name</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>word-slug</th>
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
