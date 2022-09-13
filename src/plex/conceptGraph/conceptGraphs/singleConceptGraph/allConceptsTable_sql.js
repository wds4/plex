import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/singleConceptGraph_concepts_leftNav2.js';
import * as MiscFunctions from '../../../functions/miscFunctions.js';
import sendAsync from '../../../renderer.js';

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

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default class AllConceptsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptLinks: []
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var thisPageTableName = "unknown";
        var currCgID = window.currentConceptGraphSqlID;
        console.log("currCgID: "+currCgID)
        if (window.aLookupConceptGraphInfoBySqlID.hasOwnProperty(currCgID)) {
            thisPageTableName = ""+window.aLookupConceptGraphInfoBySqlID[currCgID].tableName;
        }
        jQuery("#thisPageTableNameContainer").html(thisPageTableName)

        var sql = " SELECT * FROM "+thisPageTableName;
        console.log("sql: "+sql)

        var conceptDataSet = [];
        var aConceptList = [];
        var aSchemaList = [];
        sendAsync(sql).then( async (result) => {
            var aResult = result;
            var numRows = aResult.length;
            console.log("numRows: "+numRows)
            for (var r=0;r<numRows;r++) {
                var progressHTML = "";
                progressHTML += "loading "+thisPageTableName + " progress: ";
                progressHTML += r+1;
                progressHTML += " / ";
                progressHTML += numRows;
                jQuery("#thisPageTableNameContainer").html(progressHTML);
                await delay(0);
                var oNextRow = aResult[r];
                var nextRow_id = oNextRow.id;
                var nextRow_slug = oNextRow.slug;
                // var nextRow_name = oNextRow.name;
                var nextRow_rawFile = oNextRow.rawFile;
                // var nextRow_name = oNextRow.name;
                var nextRow_ipfs = oNextRow.ipfs;
                var nextRow_ipns = oNextRow.ipns;
                var aNextPattern = [];

                window.aLookupConceptInfoBySqlID[nextRow_id] = {};
                window.aLookupConceptInfoBySqlID[nextRow_id].slug = nextRow_slug;
                window.aLookupConceptInfoBySqlID[nextRow_id].name = "dunno yet";
                window.aLookupConceptInfoBySqlID[nextRow_id].title = "dunno yet";

                var oNextWord = JSON.parse(nextRow_rawFile);
                var nextRow_name = "unknown";
                if (oNextWord.wordData.hasOwnProperty("name")) {
                    nextRow_name = oNextWord.wordData.name;
                    window.aLookupConceptInfoBySqlID[nextRow_id].name = nextRow_name;
                }
                var nextRow_title = "unknown";
                if (oNextWord.wordData.hasOwnProperty("title")) {
                    nextRow_title = oNextWord.wordData.title;
                    window.aLookupConceptInfoBySqlID[nextRow_id].title = nextRow_title;
                }

                var nextRow_wordTypes = "";
                var aWordTypes = oNextWord.wordData.wordTypes;
                var numWordTypes = aWordTypes.length;
                for (var t=0;t<numWordTypes;t++) {
                    var nextWordType = aWordTypes[t];
                    nextRow_wordTypes += nextWordType;
                    if (t+1 < numWordTypes) {
                        nextRow_wordTypes += ", "
                    }
                }

                var nextRow_IPNS_IPFS = nextRow_ipns + "<br>"+ nextRow_ipfs;
                var nextRow_button2 = "<div data-queryid="+r+" data-sqlid="+nextRow_id+" id=nextRowButton2_"+nextRow_id+" class='doSomethingButton_small nextRowEditButton2' style=margin-right:5px; >VIEW / EDIT</div>";
                var nextRow_id_html = nextRow_button2 + nextRow_id;

                if (jQuery.inArray("concept",aWordTypes) > -1) {
                    aNextPattern = ["",r,
                        nextRow_id_html,
                        nextRow_slug,
                        nextRow_name
                    ];
                    conceptDataSet.push(aNextPattern);
                    aConceptList.push(nextRow_slug)
                }
                if (jQuery.inArray("schema",aWordTypes) > -1) {
                    aSchemaList.push(nextRow_slug)
                }

                // create links to individual view / edit existing wordType page
                var oConceptData = {};
                oConceptData.pathname = "/SingleConceptGeneralInfo/"+nextRow_id;
                oConceptData.conceptsqlid = 'linkFrom_'+nextRow_id;
                oConceptData.conceptslug = nextRow_slug;
                this.state.conceptLinks.push(oConceptData)
                this.forceUpdate();
            }
            jQuery("#thisPageTableNameContainer").css("display","none");
            var sResult = JSON.stringify(result,null,4)
            jQuery("#sqlResultContainer").html(sResult)
            jQuery("#sqlResultContainer").val(sResult)

            makeThisPageTable(thisPageTableName,conceptDataSet);

            jQuery(".nextRowEditButton2").click(function(){
                var sqlid = jQuery(this).data("sqlid");
                jQuery("#linkFrom_"+sqlid).get(0).click();
            })
            MiscFunctions.updateMastheadBar();
            var conceptGraphMainSchemaSlug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug
            var oConceptGraphMainSchema = window.lookupWordBySlug[conceptGraphMainSchemaSlug];
            if (!oConceptGraphMainSchema.hasOwnProperty("conceptGraphData")) {
                oConceptGraphMainSchema.conceptGraphData = {};
            }
            oConceptGraphMainSchema.conceptGraphData.concepts = aConceptList;
            oConceptGraphMainSchema.conceptGraphData.schemas = aSchemaList;
            // reorder top-level properties
            var oWordData = oConceptGraphMainSchema.wordData;
            var oConceptGraphData = oConceptGraphMainSchema.conceptGraphData;
            var oSchemaData = oConceptGraphMainSchema.schemaData;
            var oGlobalDynamicData = oConceptGraphMainSchema.globalDynamicData;
            var oMetaData = oConceptGraphMainSchema.metaData;

            delete oConceptGraphMainSchema.wordData;
            delete oConceptGraphMainSchema.conceptGraphData;
            delete oConceptGraphMainSchema.schemaData;
            delete oConceptGraphMainSchema.globalDynamicData;
            delete oConceptGraphMainSchema.metaData;

            oConceptGraphMainSchema.wordData = oWordData
            oConceptGraphMainSchema.conceptGraphData = oConceptGraphData;
            oConceptGraphMainSchema.schemaData = oSchemaData;
            oConceptGraphMainSchema.globalDynamicData = oGlobalDynamicData;
            oConceptGraphMainSchema.metaData = oMetaData;

            var sConceptGraphMainSchema = JSON.stringify(oConceptGraphMainSchema,null,4);
            jQuery("#conceptGraphMainSchemaUpdatedTextarea").val(sConceptGraphMainSchema)
        })

        jQuery("#updateConceptGraphMainSchemaButton").click(function(){
            var sConceptGraphMainSchema = jQuery("#conceptGraphMainSchemaUpdatedTextarea").val();
            var oConceptGraphMainSchema = JSON.parse(sConceptGraphMainSchema);
            MiscFunctions.createOrUpdateWordInAllTables(oConceptGraphMainSchema);
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" style={{backgroundColor:"#CFCFCF"}} >
                        <ConceptGraphMasthead />
                        <div class="h2">All Concepts (Table)</div>
                        <div class="h3" >generated from SQL, with wordType: concept; {window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>
                        <div id="thisPageTableNameContainer" style={{display:"inline-block"}}>
                            thisPageTableNameContainer
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

                        <div className="tableContainer" style={{marginTop:"20px",marginLeft:"20px"}} >
                            <table id="table_concepts" className="display" style={{color:"black",width:"95%"}} >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>slug</th>
                                        <th>name</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>r</th>
                                        <th>id</th>
                                        <th>slug</th>
                                        <th>name</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <br/>
                        <div id="updateConceptGraphMainSchemaButton" className="doSomethingButton">UPDATE</div>update [conceptGraph].wordData.governingConcepts with above concepts
                        <br/>
                        <textarea id="conceptGraphMainSchemaUpdatedTextarea" style={{width:"800px",height:"600px"}}>conceptGraphMainSchemaUpdatedTextarea</textarea>

                        <div style={{display:"none"}}>
                            SQL Result:<br/>
                            <div id="sqlResultContainer" >result</div>
                        </div>

                    </div>

                </fieldset>
            </>
        );
    }
}
