import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/singleConcept_properties_leftNav2.js';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

export default class SingleProperty extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            propertySlug: null
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var propertySlug = this.props.match.params.slug;
        this.setState({propertySlug: propertySlug } )

        var currentConceptGraphSqlID = window.currentConceptGraphSqlID;
        var currentConceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[currentConceptGraphSqlID].tableName;

        var sql = " SELECT * FROM "+currentConceptGraphTableName+" WHERE slug='"+propertySlug+"' ";
        console.log("sql: "+sql);
        sendAsync(sql).then( async (result) => {
            var oWordData = result[0];
            var wordSqlID = oWordData.id;
            var sRawFile = oWordData.rawFile;

            var oRawData = JSON.parse(sRawFile)
            var wordSlug = oRawData.wordData.slug;
            var wordTitle = oRawData.wordData.title;
            var wordName = oRawData.wordData.name;
            var wordDescription = oRawData.wordData.description;

            var propertyKey = oRawData.propertyData.key;
            var propertyType = oRawData.propertyData.type;

            jQuery("#currentPropertyKeyField").html(propertyKey);
            jQuery("#currentPropertyTypeField").html(propertyType);

            jQuery("#currentWordSqlIdField").html(wordSqlID);

            jQuery("#currentWordRawFileField").html(sRawFile);
            jQuery("#currentWordRawFileField").val(sRawFile);

            jQuery("#currentWordSlugField").val(wordSlug);
            jQuery("#currentWordNameField").val(wordName);
            jQuery("#currentWordTitleField").val(wordTitle);
            jQuery("#currentWordDescriptionField").val(wordDescription);
        });
        jQuery("#updateWordButton").click(function(){
            var sRawFile = jQuery("#currentWordRawFileField").val();
            var oWord = JSON.parse(sRawFile);
            // var sql = " UPDATE "+currentConceptGraphTableName+" SET rawFile=`"+sRawFile+"` WHERE slug='"+propertySlug+"' ";
            // console.log("sql: "+sql)
            MiscFunctions.createOrUpdateWordInAllTables(oWord);
        })
        jQuery("#inputFieldsSubContainer").change(function(){
            var wordSlug = jQuery("#currentWordSlugField").val();
            var wordName = jQuery("#currentWordNameField").val();
            var wordTitle = jQuery("#currentWordTitleField").val();
            var wordDescription = jQuery("#currentWordDescriptionField").val();
            var sRawFile = jQuery("#currentWordRawFileField").val();
            var oWord = JSON.parse(sRawFile);
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
                        <div class="h2">Single Property</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>

                        <div id="allInputFieldsContainer" style={{marginTop:"20px"}} >
                            <div id="inputFieldsSubContainer">
                                <div className="makeNewLeftPanel">sql ID</div>
                                <div id="currentWordSqlIdField" className="makeNewRightPanel" style={{backgroundColor:"#EFEFEF"}}>
                                </div>

                                <br/>

                                <div className="makeNewLeftPanel" >key</div>
                                <textarea id="currentPropertyKeyField" className="makeNewRightPanel">
                                </textarea>

                                <br/>

                                <div className="makeNewLeftPanel" >type</div>
                                <textarea id="currentPropertyTypeField" className="makeNewRightPanel">
                                </textarea>

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

                            </div>

                            <div className="makeNewLeftPanel" >rawFile</div>
                            <textarea id="currentWordRawFileField" className="makeNewRightPanel" style={{height:"500px"}}>
                            </textarea>

                            <br/>
                            <div id="updateWordButton" className="doSomethingButton" style={{marginLeft:"320px"}}>update this property</div>
                            <br/>
                            <div id="deleteWordButton" className="doSomethingButton" style={{marginLeft:"320px"}}>delete this property (not yet functional)</div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
