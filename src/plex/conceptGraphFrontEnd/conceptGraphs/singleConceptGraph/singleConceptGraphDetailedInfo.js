import React from 'react';
import Masthead from '../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/cgFe_singleConceptGraph_leftNav2';
import * as ConceptGraphInMfsFunctions from '../../../lib/ipfs/conceptGraphInMfsFunctions.js';
// import * as MiscFunctions from '../../../functions/miscFunctions.js';
// import * as InitDOMFunctions from '../../../functions/transferSqlToDOM.js';

const jQuery = require("jquery");

const populateFields_from_oMainSchemaForConceptGraph = async (oMainConceptGraphSchema) => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
    jQuery("#rightColumnTextarea").val("loading ...");
    jQuery("#currConceptGraphMainSchemaSlugField").html("loading ...");
    jQuery("#currConceptGraphMainSchemaTitleField").val("loading ...");
    jQuery("#currConceptGraphMainSchemaNameField").val("loading ...");

    // oMainConceptGraphSchema = await ConceptGraphInMfsFunctions.republishWordToIpfsAndSqlIfSteward(oMainConceptGraphSchema)

    var conceptGraphMainSchemaTitle = oMainConceptGraphSchema.wordData.title;
    var conceptGraphMainSchemaName = oMainConceptGraphSchema.wordData.name;
    var conceptGraphMainSchemaSlug = oMainConceptGraphSchema.wordData.name;

    var currConceptGraphSlug = oMainConceptGraphSchema.conceptGraphData.slug;
    var currConceptGraphTitle = oMainConceptGraphSchema.conceptGraphData.title;
    var currConceptGraphDescription = oMainConceptGraphSchema.conceptGraphData.description;

    jQuery("#currentConceptGraphSlugField").html(currConceptGraphSlug);
    jQuery("#currentConceptGraphTitleField").html(currConceptGraphTitle);
    jQuery("#currentConceptGraphDescriptionField").html(currConceptGraphDescription);

    var aRels = oMainConceptGraphSchema.schemaData.relationships;
    var numRels = aRels.length;
    jQuery("#numRelationshipsContainer").html(numRels)

    if (oMainConceptGraphSchema.hasOwnProperty("conceptGraphData")) {
        var aConcepts = oMainConceptGraphSchema.conceptGraphData.concepts;
        var aSchemas = oMainConceptGraphSchema.conceptGraphData.schemas;
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
        jQuery(".singleWordWrapper").click(async function(){
            var clickedSlug = jQuery(this).data("slug");
            // var oClickedWord = window.lookupWordBySlug[clickedSlug];
            var oClickedWord = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,clickedSlug)
            var sClickedWord = JSON.stringify(oClickedWord,null,4)
            jQuery("#rightColumnTextarea").val(sClickedWord);
            jQuery(".singleWordWrapper").css("backgroundColor","#CFCFCF")
            jQuery(this).css("backgroundColor","orange")
        });
    }
    jQuery("#rightColumnTextarea").val(JSON.stringify(oMainConceptGraphSchema,null,4));
    jQuery("#currConceptGraphMainSchemaSlugField").html(conceptGraphMainSchemaSlug);
    jQuery("#currConceptGraphMainSchemaTitleField").val(conceptGraphMainSchemaTitle);
    jQuery("#currConceptGraphMainSchemaNameField").val(conceptGraphMainSchemaName);
}

const populateFields_from_wordsInMFS = async (ipnsForMainSchemaForConceptGraph) => {
    var pCGb = window.ipfs.pCGb;
    var path = pCGb + ipnsForMainSchemaForConceptGraph + "/words/";
    console.log("populateFields_from_wordsInMFS; path: "+path)
}

export default class SingleConceptGraphFrontEndDetailedInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var pCGb = window.ipfs.pCGb;
        var ipnsForMainSchemaForConceptGraph = this.props.match.params.ipnsForMainSchemaForConceptGraph
        if (ipnsForMainSchemaForConceptGraph == "current") {
            ipnsForMainSchemaForConceptGraph = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph
        }
        var conceptGraphDirectoryName = ipnsForMainSchemaForConceptGraph
        var path = pCGb + conceptGraphDirectoryName + "/words/mainSchemaForConceptGraph/node.txt"
        var oMainSchemaForConceptGraph = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(path)
        var cgSlug = oMainSchemaForConceptGraph.conceptGraphData.slug;
        var cgTitle = oMainSchemaForConceptGraph.conceptGraphData.title;
        var cgDescription = oMainSchemaForConceptGraph.conceptGraphData.description;
        var aConcepts = oMainSchemaForConceptGraph.conceptGraphData.aConcepts;

        window.frontEndConceptGraph.viewingConceptGraph.slug = cgSlug;
        window.frontEndConceptGraph.viewingConceptGraph.title = cgTitle;
        window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph = ipnsForMainSchemaForConceptGraph;

        await populateFields_from_oMainSchemaForConceptGraph(oMainSchemaForConceptGraph);

        await populateFields_from_wordsInMFS(ipnsForMainSchemaForConceptGraph);

        jQuery("#updateConceptGraphButton").click(async function(){
            console.log("updateConceptGraphButton clicked")
            var sUpdatedWord = jQuery("#rightColumnTextarea").val()
            var oUpdatedWord = JSON.parse(sUpdatedWord)
            await ConceptGraphInMfsFunctions.createOrUpdateWordInMFS_specifyConceptGraph(ipnsForMainSchemaForConceptGraph,oUpdatedWord)
        })

    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                    <div className="mainPanel" >
                        <Masthead viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                        <div class="h2">Single Concept Graph Detailed Info (front end)</div>
                        <div class="h3" >{window.frontEndConceptGraph.viewingConceptGraph.title}</div>
                        <div style={{marginTop:"20px"}}>
                            <div className="standardDoubleColumn" style={{fontSize:"12px",width:"650px"}} >
                                <div className="singleItemContainer" >

                                    <center>wordData</center>

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

                                    <br/>

                                    <center>conceptGraphData</center>

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
                                            description:
                                        </div>
                                        <div id="currentConceptGraphDescriptionField" className="leftColumnRightPanel" >
                                            ?
                                        </div>
                                    </div>

                                    <br/>

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
                                <div>
                                    <div style={{display:"inline-block",verticalAlign:"middle"}} >Update in MFS (at least one other node must be online for this to work!): </div>
                                    <div id="updateConceptGraphButton" className="doSomethingButton_small">UPDATE</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
