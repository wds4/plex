import React from "react";
import { Link } from "react-router-dom";
import Masthead from '../../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/cgFe_singleConceptGraph_listsOfUpdates_leftNav2';
import * as ConceptGraphInMfsFunctions from '../../../../../lib/ipfs/conceptGraphInMfsFunctions.js';
import * as MiscIpfsFunctions from '../../../../../lib/ipfs/miscIpfsFunctions.js'
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';

const jQuery = require("jquery");

var oUP = {
    "updateProposals": {
        "local": [

        ],
        "external": [

        ]
    }
}

async function makeThisPageTable(wordDataSet) {
    jQuery('#table_updateProposals thead th').each(function () {
        var title = jQuery(this).text();
        jQuery(this).html(title + '<br><input id="searchDiv_'+title+'" type="text" placeholder="Search ' + title + '" />');
    });
    var dtable = jQuery('#table_updateProposals').DataTable({
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
            { }
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
                    var ipns = jQuery(this).data("ipns");
                    var slug = jQuery(this).data("slug");
                    jQuery("#linkFrom_"+slug).get(0).click();
                })
                jQuery(".nextRowPublishButton").click(async function(){
                    var ipns = jQuery(this).data("ipns");
                    var slug = jQuery(this).data("slug");
                    console.log("nextRowPublishButton; slug: "+slug+"; ipns: "+ipns)
                    var myPeerID = await MiscIpfsFunctions.returnMyPeerID();
                    var myUsername = await MiscIpfsFunctions.returnMyUsername();

                    var oUpdateProposal = {};
                    oUpdateProposal.updateProposal = {};
                    oUpdateProposal.updateProposal.slug = slug;
                    oUpdateProposal.updateProposal.ipns = ipns;
                    oUpdateProposal.updateProposal.ipfs = null;
                    oUpdateProposal.author = {};
                    oUpdateProposal.author.peerID = myPeerID;
                    oUpdateProposal.author.ipns = myUsername;

                    var sPublicDirectory = jQuery("#publicDirectoryContainer").val();
                    var oPublicDirectory = JSON.parse(sPublicDirectory)
                    oPublicDirectory.updateProposals.local.push(oUpdateProposal)

                    jQuery("#publicDirectoryContainer").val(JSON.stringify(oPublicDirectory,null,4));

                })
            } catch (e) {}
        }
    });
    // Add event listener for opening and closing details
    jQuery('#table_updateProposals tbody').on('click', 'td.details-control', async function () {
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
            var word_slug = d[3];
            var pCGb = window.ipfs.pCGb;
            var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
            var path = pCGb + viewingConceptGraph_ipns + "/words/";
            var wordPath = path + word_slug + "/node.txt"
            var oWord = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(wordPath)
            var word_ipns = oWord.metaData.ipns;
            var sWord = JSON.stringify(oWord,null,4)

            var expansionHTML = "";
            expansionHTML += "<div>";

            expansionHTML += "<div data-status='pre' data-slug='"+word_slug+"' id='toggleTextareaButton_"+word_slug+"' class=doSomethingButton  >toggle edit box</div>";
            expansionHTML += "<div id='update_"+word_slug+"' data-slug='"+word_slug+"' class=doSomethingButton style=display:none; >UPDATE</div>";

            expansionHTML += "<textarea id='textarea_"+word_slug+"' style=width:700px;height:800px;display:none; >";
            expansionHTML += sWord;
            expansionHTML += "</textarea>";

            expansionHTML += "<pre id='pre_"+word_slug+"' style='width:1000px;,overflow:scroll;' >";
            expansionHTML += sWord;
            expansionHTML += "</pre>";

            expansionHTML += "</div>";

            row.child( expansionHTML ).show();
            tr.addClass('shown');

            jQuery("#toggleTextareaButton_"+word_slug).click(function(){
                var slug = jQuery(this).data("slug");
                var status = jQuery(this).data("status");
                // alert("clicked; slug: "+slug+"; status: "+status)
                if (status=="pre") {
                    jQuery(this).data("status","textarea");
                    jQuery("#textarea_"+slug).css("display","block")
                    jQuery("#update_"+slug).css("display","inline-block")
                    jQuery("#pre_"+slug).css("display","none")
                }
                if (status=="textarea") {
                    jQuery(this).data("status","pre");
                    jQuery("#textarea_"+slug).css("display","none")
                    jQuery("#update_"+slug).css("display","none")
                    jQuery("#pre_"+slug).css("display","block")
                }
            })
            jQuery("#update_"+word_slug).click(function(){
                var slug = jQuery(this).data("slug");
                var sWord = jQuery("#textarea_"+slug).val();
                var oWord = JSON.parse(sWord);
                var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph
                ConceptGraphInMfsFunctions.createOrUpdateWordInMFS_specifyConceptGraph(viewingConceptGraph_ipns,oWord);
            })
        }
    });
}

const generateNewPublicFile = async () => {
    var oPublicDirectory = MiscFunctions.cloneObj(oUP);
    console.log("oPublicDirectory: "+ JSON.stringify(oPublicDirectory,null,4))

    jQuery("#publicDirectoryContainer").val(JSON.stringify(oPublicDirectory,null,4))
}

const saveThisPublicRawFile = async () => {
    console.log("saveThisPublicRawFile")
    var sPublicDirectory = jQuery("#publicDirectoryContainer").val();
    var oPublicDirectory = JSON.parse(sPublicDirectory)

    var path = "/plex/conceptGraphs/public/updateProposals/";
    var pathToFile = path + "node.txt";

    console.log("saveThisRawFile; path: "+path)
    console.log("saveThisRawFile; pathToFile: "+pathToFile)

    try { await MiscIpfsFunctions.ipfs.files.mkdir(path,{parents:true}) } catch (e) {}
    var fileToWrite = JSON.stringify(oPublicDirectory,null,4)
    try { await MiscIpfsFunctions.ipfs.files.rm(pathToFile, {recursive: true}) } catch (e) {}
    try { await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true}) } catch (e) {}

    await ConceptGraphInMfsFunctions.publishEntireLocalMfsToIpfs();
}

const loadExistingPublicFile = async () => {
    var path = "/plex/conceptGraphs/public/updateProposals/node.txt";
    var oPublicDirectory = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(path)
    if (oPublicDirectory) {
        jQuery("#publicDirectoryContainer").val(JSON.stringify(oPublicDirectory,null,4))
    } else {
        jQuery("#publicDirectoryContainer").val("file not available")
    }
}

export default class ConceptGraphsFrontEndSingleConceptGraphAllKnownUpdateProposals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
            wordLinks: []
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var myPeerID = await MiscIpfsFunctions.returnMyPeerID();

        var path = "/plex/conceptGraphs/public/updateProposals/";
        jQuery("#pathContainer").html(path)

        var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
        var concept_updateProposal_slug = "conceptFor_updateProposal";
        var oConceptUP = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,concept_updateProposal_slug)
        var superset_UP_slug = oConceptUP.conceptData.nodes.superset.slug;
        var oSuperset_UP = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,superset_UP_slug)
        var aSpecificInstances = oSuperset_UP.globalDynamicData.specificInstances;

        var updateProposalDataSet = [];

        for (var x=0;x<aSpecificInstances.length;x++) {
            var slug = aSpecificInstances[x];

            var oUP = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,slug)
            var name = oUP.wordData.name;
            var ipns = oUP.metaData.ipns;
            var author = oUP.updateProposalData.author.username;
            var authorPeerID = oUP.updateProposalData.author.peerID;

            var nextRow_actions = "<div data-slug="+slug+" data-ipns="+ipns+" class='doSomethingButton_small nextRowEditButton' style=margin-right:5px; >VIEW / EDIT</div>";
            if (authorPeerID==myPeerID) {
                nextRow_actions += "<div data-slug="+slug+" data-ipns="+ipns+" class='doSomethingButton_small nextRowPublishButton' style=margin-right:5px; >PUBLISH (add to file below)</div>";
            }

            var aNextWord = [
                "",
                x,
                nextRow_actions,
                slug,
                name,
                author
            ];
            updateProposalDataSet.push(aNextWord);

            // create links to individual view / edit existing wordType page
            var oUpdateProposalData = {};
            oUpdateProposalData.pathname = "/ConceptGraphsFrontEndSingleConceptGraphSingleUpdateProposalMainPage/"+slug;
            oUpdateProposalData.link = 'linkFrom_'+slug;
            oUpdateProposalData.updateproposalslug = slug;
            this.state.wordLinks.push(oUpdateProposalData)

            this.forceUpdate();

        }
        makeThisPageTable(updateProposalDataSet);

        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        jQuery("#generateNewPublicFileButton").click(async function(){
            console.log("generateNewPublicFileButton clicked")
            await generateNewPublicFile();
        })
        jQuery("#createOrUpdatePublicFileButton").click(async function(){
            console.log("createOrUpdatePublicFileButton clicked")
            await saveThisPublicRawFile();
        })
        jQuery("#loadExistingPublicFileButton").click(async function(){
            console.log("loadExistingPublicFileButton clicked")
            await loadExistingPublicFile();
        })

        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                    <div className="mainPanel" >
                        <Masthead viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                        <div class="h2">All Known Update Proposals for this Concept Graph</div>

                        <div style={{fontSize:"12px"}}>
                        All update proposals that are recorded as specific instances of the superset of conceptFor_updateProposal in the viewing concept graph.
                        </div>

                        <div >
                        {this.state.wordLinks.map(link => (
                            <div >
                                <Link id={link.link} class='navButton'
                                  to={link.pathname}
                                >{link.updateproposalslug}
                                </Link>
                            </div>
                        ))}
                        </div>

                        <div className="tableContainer" style={{marginTop:"20px",marginLeft:"20px"}} >
                            <table id="table_updateProposals" className="display" style={{color:"black",width:"95%"}} >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>w</th>
                                        <th>actions</th>
                                        <th>slug</th>
                                        <th>name</th>
                                        <th>author</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>w</th>
                                        <th>actions</th>
                                        <th>slug</th>
                                        <th>name</th>
                                        <th>author</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div id="publicDirectoryBox"  style={{width:"700px",border:"1px solid blue",margin:"5px",padding:"5px"}} >
                            publicDirectory:
                            <div className="doSomethingButton" id="loadExistingPublicFileButton" >load existing file from MFS</div><br/>
                            <div className="doSomethingButton" id="createOrUpdatePublicFileButton" >save/update file (below)</div>
                            <div className="doSomethingButton" id="generateNewPublicFileButton" style={{float:"right"}} >generate anew</div>
                            <div style={{fontSize:"12px"}}><span style={{color:"red",marginRight:"20px"}} >path</span><div id="pathContainer" style={{display:"inline-block",color:"red"}} >path container</div></div>
                            <textarea id="publicDirectoryContainer" style={{width:"95%",height:"500px",fontSize:"12px"}} >
                            </textarea>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
