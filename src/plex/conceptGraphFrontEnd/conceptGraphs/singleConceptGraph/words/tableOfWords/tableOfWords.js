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

function makeThisPageTable(wordDataSet) {
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
            { },
            { },
            { },
            { },
            { },
            { }
        ],
        "dom": '<"pull-left"f><"pull-right"l>tip'
    });
}

const returnListOfWordsInThisConceptGraphInMFS = async (path) => {
    var aWords = [];
    try {
        for await (const file of MiscIpfsFunctions.ipfs.files.ls(path)) {
            var fileName = file.name;
            var fileType = file.type;
            var fileCid = file.cid;
            if ( (fileType=="directory") && (fileName != "mainSchemaForConceptGraph" ) ) {
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
        console.log("populateFields_from_wordsInMFS; path: "+path)
        var aWords = await returnListOfWordsInThisConceptGraphInMFS(path);
        console.log("populateFields_from_wordsInMFS; num words: "+aWords.length)

        var wordDataSet = [];

        for (var w=0;w<aWords.length;w++) {
            var word_slug = aWords[w];
            var wordPath = path + word_slug + "/node.txt"
            var oWord = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(wordPath)
            if (w==0) {
                console.log("oWord: "+JSON.stringify(oWord,null,4))
            }
            var word_ipns = oWord.metaData.ipns;
            var word_name = oWord.wordData.name;
            var aWordTypes = oWord.wordData.wordTypes;
            var sWordTypes = JSON.stringify(aWordTypes);

            var nextRow_button = "<div data-slug="+word_slug+" data-ipns="+word_ipns+" class='doSomethingButton_small nextRowEditButton' style=margin-right:5px; >VIEW / EDIT</div>";

            var aNextWord = [
                "",
                w,
                nextRow_button,
                word_slug,
                word_name,
                sWordTypes,
                word_ipns
            ];
            wordDataSet.push(aNextWord);

            /*
            var oWordData = {};
            oWordData.pathname = "/ConceptGraphsFrontEnd_SingleConceptMainPage/"+word_slug;
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
                    <LeftNavbar2 />
                    <div className="mainPanel" style={{backgroundColor:"#CFCFCF"}} >
                        <Masthead />
                        <div class="h2">All Words</div>

                        <div className="tableContainer" style={{marginTop:"20px",marginLeft:"20px"}} >
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
