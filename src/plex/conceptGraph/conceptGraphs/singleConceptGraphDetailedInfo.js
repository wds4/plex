import React from "react";
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/singleConceptGraph_leftNav2.js';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js';
import * as ConceptGraphInMfsFunctions from '../../lib/ipfs/conceptGraphInMfsFunctions.js'
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");

const populateConceptGraphFields_from_myConceptGraphs = async (sqlid) => {
    var sql = " SELECT * FROM myConceptGraphs WHERE id='"+sqlid+"' ";
    console.log("sql: "+sql)

    sendAsync(sql).then((result) => {
        var oConceptGraphData = result[0];
        var currConceptGraphSlug = oConceptGraphData.slug;
        var currConceptGraphTitle = oConceptGraphData.title;
        var currConceptGraphTableName = oConceptGraphData.tableName;
        var currConceptGraphMainSchemaSlug = oConceptGraphData.mainSchema_slug;
        var currConceptGraphDescription = oConceptGraphData.description;

        jQuery("#currentConceptGraphSqlIdField").html(sqlid);
        jQuery("#currentConceptGraphSlugField").html(currConceptGraphSlug);
        jQuery("#currentConceptGraphTitleField").html(currConceptGraphTitle);
        jQuery("#currentConceptGraphTableNameField").html(currConceptGraphTableName);
        jQuery("#currentConceptGraphMainSchemaSlugField").html(currConceptGraphMainSchemaSlug);
        jQuery("#currentConceptGraphDescriptionField").html(currConceptGraphDescription);
    })
}

const populateConceptGraphFields_from_thisConceptGraphTable = async (conceptGraphTableName,cgMainSchemaSlug) => {
    var sql = " SELECT * FROM "+conceptGraphTableName+" WHERE slug='"+cgMainSchemaSlug+"' ";
    console.log("sql: "+sql)

    sendAsync(sql).then( async (result) => {
        var numResults = result.length;
        if (numResults==1) {
            var oMainSchemaData = result[0];
            var sMainSchemaRawFile = oMainSchemaData.rawFile;

            var oMainSchemaRawFile = JSON.parse(sMainSchemaRawFile)

            var conceptGraphIPNS = oMainSchemaRawFile.metaData.ipns;
            var conceptGraphKeyname = oMainSchemaRawFile.metaData.keyname;

            oMainSchemaRawFile = await ConceptGraphInMfsFunctions.republishWordToIpfsAndSqlIfSteward(oMainSchemaRawFile)

            /*
            var aKeys = await MiscIpfsFunctions.ipfs.key.list()
            console.log("SingleConceptGraphDetailedInfo-- numKeys: "+aKeys.length)
            var foundMatch = false;
            for (var k=0;k<aKeys.length;k++) {
                var oNext = aKeys[k];
                var name = oNext.name;
                var ipfs = oNext.id;
                if ((name==conceptGraphKeyname) && (ipfs==conceptGraphIPNS)) {
                    console.log("SingleConceptGraphDetailedInfo-- match: oNext: "+JSON.stringify(oNext,null,4))
                    foundMatch = true;
                    var options_publish = { key: conceptGraphKeyname }
                    var myPeerID = jQuery("#myCidMastheadContainer").html()
                    var myUsername = jQuery("#myUsernameMastheadContainer").html()
                    var currentTime = Date.now();
                    oMainSchemaRawFile.metaData.stewardPeerID = myPeerID;
                    oMainSchemaRawFile.metaData.stewardUsername = myUsername;
                    oMainSchemaRawFile.metaData.lastUpdate = currentTime;
                    var oUpdatedWord = await ConceptGraphInMfsFunctions.publishWordToIpfs(oMainSchemaRawFile)
                    // console.log("SingleConceptGraphDetailedInfo-- publishing word to ipfs; result: "+JSON.stringify(result,null,4))
                }
            }
            console.log("SingleConceptGraphDetailedInfo-- foundMatch: "+foundMatch);
            */

            var conceptGraphMainSchemaTitle = oMainSchemaRawFile.wordData.title;
            var conceptGraphMainSchemaName = oMainSchemaRawFile.wordData.name;
            var conceptGraphMainSchemaSlug = oMainSchemaRawFile.wordData.name;

            var aRels = oMainSchemaRawFile.schemaData.relationships;
            var numRels = aRels.length;
            jQuery("#numRelationshipsContainer").html(numRels)

            if (oMainSchemaRawFile.hasOwnProperty("conceptGraphData")) {
                var aConcepts = oMainSchemaRawFile.conceptGraphData.concepts;
                var aSchemas = oMainSchemaRawFile.conceptGraphData.schemas;
                var numConcepts = aConcepts.length;
                var numSchemas = aSchemas.length;
                jQuery("#numConceptsContainer").html(numConcepts)
                jQuery("#numSchemasContainer").html(numSchemas)
                for (var c=0;c<numConcepts;c++) {
                    var nextConceptSlug = aConcepts[c];
                    var nextConceptHTML = "";
                    nextConceptHTML += "<div style=display:inline-block; class=singleWordWrapper ";
                    nextConceptHTML += " data-slug='"+nextConceptSlug+"' ";
                    nextConceptHTML += " >";
                    nextConceptHTML += nextConceptSlug;
                    nextConceptHTML += "</div>";
                    nextConceptHTML += "<br>";
                    jQuery("#conceptsListContainer").append(nextConceptHTML)
                }
                for (var s=0;s<numSchemas;s++) {
                    var nextSchemaSlug = aSchemas[s];
                    var nextSchemaHTML = "";
                    nextSchemaHTML += "<div style=display:inline-block; class=singleWordWrapper ";
                    nextSchemaHTML += " data-slug='"+nextSchemaSlug+"' ";
                    nextSchemaHTML += " >";
                    nextSchemaHTML += nextSchemaSlug;
                    nextSchemaHTML += "</div>";
                    nextSchemaHTML += "<br>";
                    jQuery("#schemasListContainer").append(nextSchemaHTML)
                }
                jQuery(".singleWordWrapper").click(function(){
                    var clickedSlug = jQuery(this).data("slug");
                    var oClickedWord = window.lookupWordBySlug[clickedSlug];
                    var sClickedWord = JSON.stringify(oClickedWord,null,4)
                    jQuery("#rightColumnTextarea").val(sClickedWord);
                    jQuery(".singleWordWrapper").css("backgroundColor","#CFCFCF")
                    jQuery(this).css("backgroundColor","orange")
                });
            }

            jQuery("#rightColumnTextarea").val(JSON.stringify(oMainSchemaRawFile,null,4));
            jQuery("#currConceptGraphMainSchemaSlugField").html(conceptGraphMainSchemaSlug);
            jQuery("#currConceptGraphMainSchemaTitleField").val(conceptGraphMainSchemaTitle);
            jQuery("#currConceptGraphMainSchemaNameField").val(conceptGraphMainSchemaName);
        } else {
            jQuery("#rightColumnTextarea").val("error");
            jQuery("#currConceptGraphMainSchemaSlugField").html("error");
            jQuery("#currConceptGraphMainSchemaTitleField").val("error");
            jQuery("#currConceptGraphMainSchemaNameField").val("error");
        }
    })
}

const populateDataFromWindowLookupRawFile = async (amIStewardOfThisConceptGraph) => {
    var oRFL = MiscFunctions.cloneObj(window.lookupWordBySlug)
    var aSlugs = [];
    jQuery.each(oRFL, function(slug,oWord){
        aSlugs.push(slug)
    });
    // jQuery.each(oRFL, function(slug,oWord){
    for (var w=0;w<aSlugs.length;w++) {
        var slug = aSlugs[w];
        var oWord = oRFL[slug];
        var aWordTypes = oWord.wordData.wordTypes;
        if (jQuery.inArray("concept",aWordTypes) > -1) {
            await ConceptGraphInMfsFunctions.republishWordToIpfsAndSqlIfSteward(oWord);
            /*
            var amITheStewardOfThisConcept = await ConceptGraphInMfsFunctions.checkWordWhetherIAmSteward(oWord)
            if (amITheStewardOfThisConcept) {
                // await ConceptGraphInMfsFunctions.republishWordToIpfsAndSqlIfSteward(oWord);
            }
            */
        }
        if (jQuery.inArray("property",aWordTypes) > -1) {
            // console.log("slug: "+slug)
            var nextWordHTML = "";
            nextWordHTML += "<div style=display:inline-block; class=singleWordWrapper2 ";
            nextWordHTML += " data-slug='"+slug+"' ";
            nextWordHTML += " >";
            nextWordHTML += slug;
            nextWordHTML += "</div>";
            nextWordHTML += "<br>";

            var aPropertyTypes = oWord.propertyData.types
            if (jQuery.inArray("primaryProperty",aPropertyTypes) > -1) {
                jQuery("#primaryPropertiesListContainer").append(nextWordHTML)
            } else {
                jQuery("#notPrimaryPropertiesListContainer").append(nextWordHTML)
            }
        }
        if (jQuery.inArray("wordType",aWordTypes) > -1) {
            // console.log("slug: "+slug)
            var nextWordHTML = "";
            nextWordHTML += "<div style=display:inline-block; class=singleWordWrapper2 ";
            nextWordHTML += " data-slug='"+slug+"' ";
            nextWordHTML += " >";
            nextWordHTML += slug;
            nextWordHTML += "</div>";
            nextWordHTML += "<br>";
            jQuery("#wordTypesListContainer").append(nextWordHTML)
        }
        if (jQuery.inArray("set",aWordTypes) > -1) {
            // console.log("slug: "+slug)
            var nextWordHTML = "";
            nextWordHTML += "<div style=display:inline-block; class=singleWordWrapper2 ";
            nextWordHTML += " data-slug='"+slug+"' ";
            nextWordHTML += " >";
            nextWordHTML += slug;
            nextWordHTML += "</div>";
            nextWordHTML += "<br>";
            jQuery("#setsListContainer").append(nextWordHTML)
        }
        if (jQuery.inArray("superset",aWordTypes) > -1) {
            // console.log("slug: "+slug)
            var nextWordHTML = "";
            nextWordHTML += "<div style=display:inline-block; class=singleWordWrapper2 ";
            nextWordHTML += " data-slug='"+slug+"' ";
            nextWordHTML += " >";
            nextWordHTML += slug;
            nextWordHTML += "</div>";
            nextWordHTML += "<br>";
            jQuery("#supersetsListContainer").append(nextWordHTML)
        }
        if (jQuery.inArray("JSONSchema",aWordTypes) > -1) {
            // console.log("slug: "+slug)
            var nextWordHTML = "";
            nextWordHTML += "<div style=display:inline-block; class=singleWordWrapper2 ";
            nextWordHTML += " data-slug='"+slug+"' ";
            nextWordHTML += " >";
            nextWordHTML += slug;
            nextWordHTML += "</div>";
            nextWordHTML += "<br>";
            jQuery("#JSONSchemasListContainer").append(nextWordHTML)
        }
    }
    // })
    jQuery(".singleWordWrapper2").click(function(){
        var clickedSlug = jQuery(this).data("slug");
        // console.log("singleWordWrapper2; clickedSlug: "+clickedSlug)
        var oClickedWord = window.lookupWordBySlug[clickedSlug];
        var sClickedWord = JSON.stringify(oClickedWord,null,4)
        jQuery("#rightColumnTextarea").val(sClickedWord);
        jQuery(".singleWordWrapper2").css("backgroundColor","#CFCFCF")
        jQuery(this).css("backgroundColor","orange")
    });
}

const updateConceptGraphSchemaData = async (oConceptGraph) => {
    console.log("updateConceptGraphSchemaData")
}

export default class SingleConceptGraphDetailedInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptGraphSqlID: null,
            conceptGraphTableName: null,
            conceptGraphTableNamePath: null,
            conceptGraphMainSchemaSlug: null
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var conceptGraphSqlID = this.props.match.params.conceptgraphsqlid
        if (conceptGraphSqlID=="current") {
            conceptGraphSqlID = window.currentConceptGraphSqlID;
        } else {
            window.currentConceptGraphSqlID = conceptGraphSqlID;
        }

        var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[conceptGraphSqlID].tableName
        var conceptGraphMainSchemaSlug = window.aLookupConceptGraphInfoBySqlID[conceptGraphSqlID].mainSchema_slug;
        var conceptGraphTableNamePath = "/SQLViewSingleTablePage/"+conceptGraphTableName;

        this.setState({
            conceptGraphSqlID: conceptGraphSqlID,
            conceptGraphTableName: conceptGraphTableName,
            conceptGraphTableNamePath: conceptGraphTableNamePath,
            conceptGraphMainSchemaSlug: conceptGraphMainSchemaSlug
        })

        var oConceptGraph = window.lookupWordBySlug[conceptGraphMainSchemaSlug];

        var amIStewardOfThisConceptGraph = await ConceptGraphInMfsFunctions.checkWordWhetherIAmSteward(oConceptGraph)

        if (amIStewardOfThisConceptGraph) {
            await updateConceptGraphSchemaData(oConceptGraph)
        }

        populateDataFromWindowLookupRawFile(amIStewardOfThisConceptGraph);

        setTimeout( async function(){
            populateConceptGraphFields_from_myConceptGraphs(conceptGraphSqlID);
        },1000);

        setTimeout( async function(){
            populateConceptGraphFields_from_thisConceptGraphTable(conceptGraphTableName,conceptGraphMainSchemaSlug);
        },2000);

        jQuery("#updateConceptGraphButton").click(async function(){
            var sWord = jQuery("#rightColumnTextarea").val();
            var oWord = JSON.parse(sWord);
            var oWordUpdated = await ConceptGraphInMfsFunctions.republishWordToIpfsAndSqlIfSteward(oWord)
            MiscFunctions.createOrUpdateWordInAllTables(oWordUpdated);
            jQuery("#rightColumnTextarea").val(JSON.stringify(oWordUpdated,null,4));
        })
        jQuery(".showButton").click(function(){
            jQuery(".showButton").css("backgroundColor","grey")
            jQuery(this).css("backgroundColor","green")
            var elemIdToShow = jQuery(this).data("elemidtoshow");
            console.log("showButton; elemIdToShow: "+elemIdToShow)
            jQuery(".showSomethingBox").css("display","none")
            jQuery("#"+elemIdToShow).css("display","block")
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
                        <div class="h2">Show / Edit Concept Graph Detailed Info</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>
                        <div style={{marginTop:"20px"}}>
                            <div className="standardDoubleColumn" style={{fontSize:"12px",width:"650px"}} >
                                <div className="singleItemContainer" >

                                    <center>CG Data (from My Concept Graphs)</center>

                                    <div className="singleItemContainer" >
                                        <div className="leftColumnLeftPanel" >
                                            sql ID:
                                        </div>
                                        <div id="currentConceptGraphSqlIdField" className="leftColumnRightPanel" >
                                            ?
                                        </div>
                                    </div>

                                    <div className="singleItemContainer" >
                                        <div className="leftColumnLeftPanel" >
                                            slug:
                                        </div>
                                        <div id="currentConceptGraphSlugField" className="leftColumnRightPanel" >
                                            ?
                                        </div>
                                    </div>

                                    <div className="singleItemContainer" >
                                        <div className="leftColumnLeftPanel" >
                                            title:
                                        </div>
                                        <div id="currentConceptGraphTitleField" className="leftColumnRightPanel" >
                                            ?
                                        </div>
                                    </div>

                                    <div className="singleItemContainer" >
                                        <div className="leftColumnLeftPanel" >
                                            tableName:
                                        </div>
                                        <div id="currentConceptGraphTableNameField" className="leftColumnRightPanel" >
                                            ?
                                        </div>
                                    </div>

                                    <div className="singleItemContainer" >
                                        <div className="leftColumnLeftPanel" >
                                            mainSchema_slug:
                                        </div>
                                        <div id="currentConceptGraphMainSchemaSlugField" className="leftColumnRightPanel" >
                                            ?
                                        </div>
                                    </div>

                                    <div className="singleItemContainer" >
                                        <div className="leftColumnLeftPanel" >
                                            description:
                                        </div>
                                        <div id="currentConceptGraphDescriptionField" className="leftColumnRightPanel" >
                                            ?
                                        </div>
                                    </div>

                                    <br/><br/>

                                    <center>CG Main (Layer 2) Schema</center>

                                    <div className="singleItemContainer" >
                                        <div className="leftColumnLeftPanel" >
                                            slug:
                                        </div>
                                        <div id="currConceptGraphMainSchemaSlugField" className="leftColumnRightPanel" >
                                            ?
                                        </div>
                                    </div>

                                    <div className="singleItemContainer" >
                                        <div className="leftColumnLeftPanel" >
                                            title:
                                        </div>
                                        <textarea id="currConceptGraphMainSchemaTitleField" className="leftColumnRightPanelTextarea" >
                                            ?
                                        </textarea>
                                    </div>

                                    <div className="singleItemContainer" >
                                        <div className="leftColumnLeftPanel" >
                                            name:
                                        </div>
                                        <textarea id="currConceptGraphMainSchemaNameField" className="leftColumnRightPanelTextarea" >
                                            ?
                                        </textarea>
                                    </div>

                                    <br/><br/>

                                    <div className="singleItemContainer" >
                                        <div className="leftColumnLeftPanel" >
                                            num concepts:
                                        </div>
                                        <div id="numConceptsContainer" className="leftColumnRightPanel" >
                                            ?
                                        </div>
                                    </div>

                                    <div className="singleItemContainer" >
                                        <div className="leftColumnLeftPanel" >
                                            num schemas:
                                        </div>
                                        <div id="numSchemasContainer" className="leftColumnRightPanel" >
                                            ?
                                        </div>
                                    </div>

                                    <div className="singleItemContainer" >
                                        <div className="leftColumnLeftPanel" >
                                            num words:
                                        </div>
                                        <div id="" className="leftColumnRightPanel" >
                                            ?
                                        </div>
                                    </div>

                                    <div className="singleItemContainer" >
                                        <div className="leftColumnLeftPanel" >
                                            num C2C Rels:
                                        </div>
                                        <div id="numRelationshipsContainer" className="leftColumnRightPanel" >
                                            ?
                                        </div>
                                    </div>

                                    <br/><br/>
                                    <center>
                                    <div className="doSomethingButton showButton" data-elemidtoshow="showConceptsBox" id="showConceptsButton">Concepts</div>
                                    <div className="doSomethingButton showButton" data-elemidtoshow="showSchemasBox" id="showSchemasButton">Schemas</div>
                                    <div className="doSomethingButton showButton" data-elemidtoshow="showPrimaryPropertiesBox" id="showPrimaryPropertiesButton">primaryProperties</div>
                                    <div className="doSomethingButton showButton" data-elemidtoshow="showPropertiesBox" id="showPropertiesButton">properties (not primary)</div>
                                    <br/>
                                    <div className="doSomethingButton showButton" data-elemidtoshow="showWordTypesBox" id="showWordTypesButton">wordTypes</div>
                                    <div className="doSomethingButton showButton" data-elemidtoshow="showSupersetsBox" id="showSupersetsButton">supersets</div>
                                    <div className="doSomethingButton showButton" data-elemidtoshow="showSetsBox" id="showSetsButton">sets</div>
                                    <div className="doSomethingButton showButton" data-elemidtoshow="showJSONSchemasBox" id="showJSONSchemasButton">JSONSchemas</div>
                                    </center>

                                    <div className="showSomethingBox" id="showConceptsBox" >
                                        <center>Concepts</center>
                                        <div id="conceptsListContainer" style={{marginLeft:"200px"}} ></div>
                                    </div>

                                    <div className="showSomethingBox" id="showSchemasBox" >
                                        <center>Schemas</center>
                                        <div id="schemasListContainer" style={{marginLeft:"200px"}} ></div>
                                    </div>

                                    <div className="showSomethingBox" id="showPrimaryPropertiesBox" >
                                        <center>primaryProperties</center>
                                        <div id="primaryPropertiesListContainer" style={{marginLeft:"200px"}} ></div>
                                    </div>

                                    <div className="showSomethingBox" id="showPropertiesBox" >
                                        <center>properties (not primary)</center>
                                        <div id="notPrimaryPropertiesListContainer" style={{marginLeft:"200px"}} ></div>
                                    </div>

                                    <div className="showSomethingBox" id="showWordTypesBox" >
                                        <center>wordTypes</center>
                                        <div id="wordTypesListContainer" style={{marginLeft:"200px"}} ></div>
                                    </div>

                                    <div className="showSomethingBox" id="showSupersetsBox" >
                                        <center>supersets</center>
                                        <div id="supersetsListContainer" style={{marginLeft:"200px"}} ></div>
                                    </div>

                                    <div className="showSomethingBox" id="showSetsBox" >
                                        <center>sets</center>
                                        <div id="setsListContainer" style={{marginLeft:"200px"}} ></div>
                                    </div>

                                    <div className="showSomethingBox" id="showJSONSchemasBox" >
                                        <center>JSONSchemas</center>
                                        <div id="JSONSchemasListContainer" style={{marginLeft:"200px"}} ></div>
                                    </div>

                                </div>

                            </div>

                            <div className="standardDoubleColumn" style={{fontSize:"12px"}} >
                                <textarea id="rightColumnTextarea" style={{width:"80%",height:"700px"}}>
                                    rightColumnTextarea
                                </textarea>
                                <br/>
                                <div id="updateConceptGraphButton" className="doSomethingButton">UPDATE</div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
