import React from "react";
import { Link } from "react-router-dom";
import Masthead from '../../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/cgFe_words_leftNav2.js';
// import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../../../../lib/ipfs/miscIpfsFunctions.js';
import * as ConceptGraphInMfsFunctions from '../../../../../lib/ipfs/conceptGraphInMfsFunctions.js';
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

async function makeThisPageTable(wordDataSet) {
    jQuery('#table_words thead th').each(function () {
        var title = jQuery(this).text();
        jQuery(this).html(title + '<br><input id="searchDiv_'+title+'" type="text" placeholder="Search ' + title + '" />');
    });
    var dtable = jQuery('#table_words').DataTable({
        data: wordDataSet,
        pageLength: 100,
        "columns": [
            {
                "class":          'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
            { visible: false },
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
                    var sqlid = jQuery(this).data("sqlid");
                    jQuery("#linkFrom_"+sqlid).get(0).click();
                })
            } catch (e) {}
        }
    });
    // Add event listener for opening and closing details
    jQuery('#table_words tbody').on('click', 'td.details-control', async function () {
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
            expansionHTML += "<div data-status='pre' data-slug='"+word_slug+"' id='publishToIpfsButton_"+word_slug+"' class=doSomethingButton  >publish to IPFS</div>";
            expansionHTML += "<div id='update_"+word_slug+"' data-slug='"+word_slug+"' class=doSomethingButton style=display:none; >UPDATE</div>";

            expansionHTML += "<textarea id='textarea_"+word_slug+"' style=width:700px;height:800px;display:none; >";
            expansionHTML += sWord;
            expansionHTML += "</textarea>";

            expansionHTML += "<pre id='pre_"+word_slug+"' >";
            expansionHTML += sWord;
            expansionHTML += "</pre>";

            expansionHTML += "</div>";

            row.child( expansionHTML ).show();
            tr.addClass('shown');

            jQuery("#publishToIpfsButton_"+word_slug).click(async function(){
                var slug = jQuery(this).data("slug");
                var sWord = jQuery("#textarea_"+slug).val();
                var oWord = JSON.parse(sWord);
                await ConceptGraphInMfsFunctions.publishWordToIpfs(oWord);
            })
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

const returnListOfWordsInThisConceptGraphInMFS = async (path) => {
    var aWords = [];
    try {
        for await (const file of MiscIpfsFunctions.ipfs.files.ls(path)) {
            var fileName = file.name;
            var fileType = file.type;
            var fileCid = file.cid;
            // if ( (fileType=="directory") && (fileName != "mainSchemaForConceptGraph" ) ) {
            if (fileType=="directory") {
                aWords.push(fileName);
            }
        }
    } catch (e) {}
    return aWords;
}

export default class AllWordsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
            wordLinks: []
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
        var viewingConceptGraph_slug = window.frontEndConceptGraph.viewingConceptGraph.slug;
        var viewingConceptGraph_title = window.frontEndConceptGraph.viewingConceptGraph.title;

        var pCGb = window.ipfs.pCGb;
        var path = pCGb + viewingConceptGraph_ipns + "/words/";
        // console.log("populateFields_from_wordsInMFS; path: "+path)
        var aWords = await returnListOfWordsInThisConceptGraphInMFS(path);
        // console.log("populateFields_from_wordsInMFS; num words: "+aWords.length)

        var wordDataSet = [];

        for (var w=0;w<aWords.length;w++) {
            var word_slug = aWords[w];
            var wordPath = path + word_slug + "/node.txt"
            var oWord = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(wordPath)
            var word_ipns = oWord.metaData.ipns;
            var word_name = oWord.wordData.name;
            var aWordTypes = oWord.wordData.wordTypes;
            var sWordTypes = JSON.stringify(aWordTypes);

            var nextRow_button = "<div data-slug="+word_slug+" data-ipns="+word_ipns+" class='doSomethingButton_small nextRowEditButton' style=margin-right:5px; >VIEW / EDIT</div>";

            var aNextWord = [
                "",
                w,
                w + " " + nextRow_button,
                word_slug,
                word_name,
                sWordTypes,
                word_ipns
            ];
            wordDataSet.push(aNextWord);

            /*
            var oWordData = {};
            oWordData.pathname = "/ConceptGraphsFrontEnd_SingleWordMainPage/"+word_slug;
            oWordData.conceptsqlid = 'linkFrom_'+word_slug;
            oWordData.conceptslug = word_slug;
            this.state.conceptLinks.push(oWordData)

            this.forceUpdate();
            */
        }
        makeThisPageTable(wordDataSet);

    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 viewingConceptGraphTitle={this.state.viewingConceptGraphTitle}  />
                    <div className="mainPanel" style={{backgroundColor:"#CFCFCF"}} >
                        <Masthead viewingConceptGraphTitle={this.state.viewingConceptGraphTitle}  />
                        <div class="h2">All Words</div>

                        <div className="tableContainer" style={{marginTop:"20px",marginLeft:"20px", width:"1350px",overflow:"scroll"}} >
                            <table id="table_words" className="display" style={{color:"black",width:"95%"}} >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>w</th>
                                        <th>button</th>
                                        <th>slug</th>
                                        <th>name</th>
                                        <th>wordTypes</th>
                                        <th>IPNS/IPFS</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>w</th>
                                        <th>button</th>
                                        <th>slug</th>
                                        <th>name</th>
                                        <th>wordTypes</th>
                                        <th>IPNS/IPFS</th>
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
