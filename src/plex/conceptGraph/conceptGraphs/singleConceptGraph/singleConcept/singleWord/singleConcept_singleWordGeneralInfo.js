import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/singleWord_concept_leftNav2.js';
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

export default class SingleWordMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wordSqlID: null
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var wordSqlID = this.props.match.params.wordsqlid;
        if (wordSqlID=="current") {
            wordSqlID = window.currentWordSqlID;
        } else {
             window.currentWordSqlID = wordSqlID;
        }
        this.setState({wordSqlID: wordSqlID } )

        var currentConceptGraphSqlID = window.currentConceptGraphSqlID;
        var currentConceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[currentConceptGraphSqlID].tableName;

        var sql = " SELECT * FROM "+currentConceptGraphTableName+" WHERE id='"+wordSqlID+"' ";
        console.log("sql: "+sql)
        sendAsync(sql).then( async (result) => {
            var oWordData = result[0];
            var sRawFile = oWordData.rawFile;
            var oRawData = JSON.parse(sRawFile)

            var wordSlug = oRawData.wordData.slug;
            var wordTitle = oRawData.wordData.title;
            var wordName = oRawData.wordData.name;
            var wordDescription = oRawData.wordData.description;

            jQuery("#currentWordRawFileField").html(sRawFile);

            jQuery("#currentWordSlugField").val(wordSlug);
            jQuery("#currentWordNameField").val(wordName);
            jQuery("#currentWordTitleField").val(wordTitle);
            jQuery("#currentWordDescriptionField").val(wordDescription);

            jQuery("#currentWordRawFileField").val(sRawFile);
        });
        jQuery("#currentWordSqlIdField").html(wordSqlID);
        jQuery("#updateWordButton").click(function(){
            var sRawFile = jQuery("#currentWordRawFileField").val();
            var sql = " UPDATE "+currentConceptGraphTableName+" SET rawFile=`"+sRawFile+"` WHERE id='"+wordSqlID+"' ";
            console.log("sql: "+sql)
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
                        <div class="h2" >Single Concept: Single Word Main Page</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>

                        <div id="allInputFieldsContainer" style={{marginTop:"20px"}} >
                            <div className="makeNewLeftPanel">sql ID</div>
                            <div id="currentWordSqlIdField" className="makeNewRightPanel" style={{backgroundColor:"#EFEFEF"}}>
                            </div>

                            <br/>

                            <div className="makeNewLeftPanel" >slug</div>
                            <textarea id="currentWordSlugField" className="makeNewRightPanel">
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel" >name</div>
                            <textarea id="currentWordNameField" className="makeNewRightPanel">
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel" >title</div>
                            <textarea id="currentWordTitleField" className="makeNewRightPanel">
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel" >description</div>
                            <textarea id="currentWordDescriptionField" className="makeNewRightPanel" style={{height:"50px"}}>
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel" >rawFile</div>
                            <textarea id="currentWordRawFileField" className="makeNewRightPanel" style={{height:"500px"}}>
                            </textarea>

                            <br/>
                            <div id="updateWordButton" className="doSomethingButton" style={{marginLeft:"320px"}}>update this word</div>
                            <br/>
                            <div id="deleteWordButton" className="doSomethingButton" style={{marginLeft:"320px"}}>delete this word (not yet functional)</div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
