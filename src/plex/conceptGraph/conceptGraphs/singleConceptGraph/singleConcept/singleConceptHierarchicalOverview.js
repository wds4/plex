import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleConcept_leftNav2.js';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

const populateConceptFields = async (currentConceptGraphTableName,wordsqlid) => {
    var sql = " SELECT * FROM "+currentConceptGraphTableName+" WHERE id='"+wordsqlid+"' ";
    console.log("sql: "+sql)

    sendAsync(sql).then((result) => {
        var oConceptData = result[0];
        var currConceptSlug = oConceptData.slug;
        var currConceptRawFile = oConceptData.rawFile;
        var oConceptData = JSON.parse(currConceptRawFile);


        ///////////////// propertyPath
        var propertyPath = "";
        try {
            propertyPath = oConceptData.conceptData.propertyPath;
        } catch (e) {}
        jQuery("#propertyPathContainer").html(propertyPath);

        ///////////////// schema
        var schema_slug = "";
        try {
            schema_slug = oConceptData.conceptData.nodes.schema.slug;
        } catch (e) {}
        jQuery("#schemaSlugContainer").html(schema_slug);

        ///////////////// JSONSchema
        var jsonSchema_slug = "";
        try {
            jsonSchema_slug = oConceptData.conceptData.nodes.JSONSchema.slug;
        } catch (e) {}
        jQuery("#JSONSchemaSlugContainer").html(jsonSchema_slug);

        ///////////////// wordType
        var wordType_slug = "";
        try {
            wordType_slug = oConceptData.conceptData.nodes.wordType.slug;
        } catch (e) {}
        jQuery("#wordTypeSlugContainer").html(wordType_slug);

        ///////////////// superset
        var superset_slug = "";
        try {
            superset_slug = oConceptData.conceptData.nodes.superset.slug;
        } catch (e) {}
        jQuery("#supersetSlugContainer").html(superset_slug);
        var oSuperset = window.lookupWordBySlug[superset_slug];

        ///////////////// concept
        var concept_slug = "";
        try {
            concept_slug = oConceptData.conceptData.nodes.concept.slug;
        } catch (e) {}
        console.log("concept_slug: "+concept_slug)
        jQuery("#conceptSlugContainer").html(concept_slug);

        ///////////////// properties
        var properties_slug = "";
        try {
            properties_slug = oConceptData.conceptData.nodes.properties.slug;
        } catch (e) {}
        jQuery("#propertiesSlugContainer").html(properties_slug);

        ///////////////// primaryProperty
        var primaryProperty_slug = "";
        try {
            primaryProperty_slug = oConceptData.conceptData.nodes.primaryProperty.slug;
        } catch (e) {}
        jQuery("#primaryPropertySlugContainer").html(primaryProperty_slug);

        ///////////////// propertySchema
        var propertySchema_slug = "";
        try {
            propertySchema_slug = oConceptData.conceptData.nodes.propertySchema.slug;
        } catch (e) {}
        jQuery("#propertySchemaSlugContainer").html(propertySchema_slug);




        ///////////////// singular
        var conceptNameSingular = "";
        try {
            var conceptNameSingular = oConceptData.conceptData.name.singular;
        } catch (e) {}
        jQuery("#singularNameContainer").html(conceptNameSingular);

        ///////////////// plural
        var conceptNamePlural = "";
        try {
            var conceptNamePlural = oConceptData.conceptData.name.plural;
        } catch (e) {}
        jQuery("#pluralNameContainer").html(conceptNamePlural);

        ///////////////// description
        var conceptDescription = "";
        try {
            var conceptDescription = oConceptData.conceptData.description;
        } catch (e) {}
        jQuery("#descriptionContainer").html(conceptDescription);

        ///////////////// properties
        var aProperties = [];
        try {
            aProperties = oConceptData.conceptData.properties;
            if (!aProperties) { aProperties = [] }
        } catch (e) {}
        var numProperties = aProperties.length;
        jQuery("#numberOfPropertiesContainer").html(numProperties);
        for (var s=0;s<numProperties;s++) {
            var nextProperty_slug = aProperties[s];
            var nextPropertyHTML = "";
            nextPropertyHTML += "<div class=singleItemContainer>";
                nextPropertyHTML += "<div class='leftColumnRightPanel propertyContainer' >";
                nextPropertyHTML += nextProperty_slug;
                nextPropertyHTML += "</div>";
            nextPropertyHTML += "</div>";
            jQuery("#propertiesContainer").append(nextPropertyHTML)
        }
        jQuery(".propertyContainer").click(function(){
            var propertySlug = jQuery(this).html();
            console.log("propertySlug: "+propertySlug)

            var sql = " SELECT * FROM "+currentConceptGraphTableName+" WHERE slug='"+propertySlug+"' ";
            console.log("sql: "+sql)
            sendAsync(sql).then((result) => {
                var oConceptData = result[0];
                var currConceptSlug = oConceptData.slug;
                var currConceptRawFile = oConceptData.rawFile;
                var oConceptData = JSON.parse(currConceptRawFile);
                jQuery("#rightColumnTextarea").val(currConceptRawFile)
            });
        })

        ///////////////// sets
        var aSets = [];
        try {
            aSets = oSuperset.globalDynamicData.subsets;
            if (!aSets) { aSets = [] }
        } catch (e) {}
        var numSets = aSets.length;
        jQuery("#numberOfSetsContainer").html(numSets);
        for (var s=0;s<numSets;s++) {
            var nextSet_slug = aSets[s];
            var nextSetHTML = "";
            nextSetHTML += "<div class=singleItemContainer>";
                nextSetHTML += "<div class='leftColumnRightPanel setContainer' >";
                nextSetHTML += nextSet_slug;
                nextSetHTML += "</div>";
            nextSetHTML += "</div>";
            jQuery("#setsContainer").append(nextSetHTML)
        }
        jQuery(".setContainer").click(function(){
            var setSlug = jQuery(this).html();
            console.log("setSlug: "+setSlug)

            var sql = " SELECT * FROM "+currentConceptGraphTableName+" WHERE slug='"+setSlug+"' ";
            console.log("sql: "+sql)
            sendAsync(sql).then((result) => {
                var oConceptData = result[0];
                var currConceptSlug = oConceptData.slug;
                var currConceptRawFile = oConceptData.rawFile;
                var oConceptData = JSON.parse(currConceptRawFile);
                jQuery("#rightColumnTextarea").val(currConceptRawFile)
            });
        })

        ///////////////// specific instances
        var aSpecificInstances = [];
        try {
            aSpecificInstances = oSuperset.globalDynamicData.specificInstances;
            if (!aSpecificInstances) { aSpecificInstances = [] }
        } catch (e) {}
        var numSpecificInstances = aSpecificInstances.length;
        jQuery("#numberOfSpecificInstancesContainer").html(numSpecificInstances);
        for (var s=0;s<numSpecificInstances;s++) {
            var nextSpecificInstance_slug = aSpecificInstances[s];
            var nextSpecificInstanceHTML = "";
            nextSpecificInstanceHTML += "<div class=singleItemContainer>";
                nextSpecificInstanceHTML += "<div class='leftColumnRightPanel specificInstanceContainer' >";
                nextSpecificInstanceHTML += nextSpecificInstance_slug;
                nextSpecificInstanceHTML += "</div>";
            nextSpecificInstanceHTML += "</div>";
            jQuery("#specificInstancesContainer").append(nextSpecificInstanceHTML)
        }
        jQuery(".specificInstanceContainer").click(function(){
            var specificInstanceSlug = jQuery(this).html();
            console.log("specificInstanceSlug: "+specificInstanceSlug)

            var sql = " SELECT * FROM "+currentConceptGraphTableName+" WHERE slug='"+specificInstanceSlug+"' ";
            console.log("sql: "+sql)
            sendAsync(sql).then((result) => {
                var oConceptData = result[0];
                var currConceptSlug = oConceptData.slug;
                var currConceptRawFile = oConceptData.rawFile;
                var oConceptData = JSON.parse(currConceptRawFile);
                jQuery("#rightColumnTextarea").val(currConceptRawFile)
            });
        })

        jQuery("#currentConceptSqlIdField").html(wordsqlid);
    })
}

export default class SingleConceptHierarchicalOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptSqlID: null
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var conceptSqlID = this.props.match.params.conceptsqlid
        if (conceptSqlID=="current") {
            conceptSqlID = window.currentConceptSqlID;
        } else {
            window.currentConceptSqlID = conceptSqlID;
        }

        this.setState({conceptSqlID: conceptSqlID } )

        var currentConceptGraphTableID = window.currentConceptGraphSqlID;
        var currentConceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[currentConceptGraphTableID].tableName;

        populateConceptFields(currentConceptGraphTableName,conceptSqlID);

        jQuery(".specialWordContainer").click(function(){
            var specialWordSlug = jQuery(this).html();
            console.log("specialWordSlug: "+specialWordSlug)
            var oWord = window.lookupWordBySlug[specialWordSlug];
            var aWordTypes = oWord.wordData.wordTypes;

            var sql = " SELECT * FROM "+currentConceptGraphTableName+" WHERE slug='"+specialWordSlug+"' ";
            console.log("sql: "+sql)
            sendAsync(sql).then((result) => {
                var oConceptData = result[0];
                var currConceptSlug = oConceptData.slug;
                var currConceptRawFile = oConceptData.rawFile;
                var oConceptData = JSON.parse(currConceptRawFile);
                jQuery("#rightColumnTextarea").val(currConceptRawFile)
            });

            jQuery("#schemaInfoContainer").css("display","none");
            if (jQuery.inArray("schema",aWordTypes) > -1) {
                jQuery("#schemaInfoContainer").css("display","inline-block")
                var aNodes = oWord.schemaData.nodes;
                var numNodes = aNodes.length;
                var aRels = oWord.schemaData.relationships;
                var numRels = aRels.length;
                jQuery("#nodesContainer").html("")
                for (var n=0;n<numNodes;n++) {
                    var nextNode_slug = aNodes[n].slug;
                    var nextNodeHTML = "";
                    nextNodeHTML += "<div class=singleItemContainer >";
                        nextNodeHTML += "<div class='leftColumnRightPanel' >";
                        nextNodeHTML += nextNode_slug;
                        nextNodeHTML += "</div>";
                    nextNodeHTML += "</div>";
                    jQuery("#nodesContainer").append(nextNodeHTML)
                }
                jQuery("#relsContainer").html("")
                for (var r=0;r<numRels;r++) {
                    var oNextRel = aRels[r];
                    var nextRel_nF_slug = oNextRel.nodeFrom.slug;
                    var nextRel_rT_slug = oNextRel.relationshipType.slug;
                    var nextRel_nT_slug = oNextRel.nodeTo.slug;
                    var nextRelHTML = "";
                    nextRelHTML += "<div class=singleItemContainer >";
                        nextRelHTML += "<div style=display:inline-block;width:225px; >";
                        nextRelHTML += nextRel_nF_slug;
                        nextRelHTML += "</div>";

                        nextRelHTML += "<div style=display:inline-block;width:200px; >";
                        nextRelHTML += nextRel_rT_slug;
                        nextRelHTML += "</div>";

                        nextRelHTML += "<div style=display:inline-block;width:200px; >";
                        nextRelHTML += nextRel_nT_slug;
                        nextRelHTML += "</div>";
                    nextRelHTML += "</div>";
                    jQuery("#relsContainer").append(nextRelHTML)
                }
            }
        })
        jQuery("#updateWordButton").click(function(){
            var sWord = jQuery("#rightColumnTextarea").val();
            // console.log("updateWordButton clicked; sWord: "+sWord)
            var oWord = JSON.parse(sWord);
            MiscFunctions.createOrUpdateWordInAllTables(oWord);
        });
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Single Concept: Hierarchical Overview</div>
                        <div style={{marginTop:"20px"}}>
                            <div className="standardDoubleColumn" style={{fontSize:"12px",width:"700px",overflow:"scroll",height:"800px"}} >
                                <div className="singleItemContainer" >
                                    <div className="leftColumnLeftPanel" >
                                        singular (name):
                                    </div>
                                    <div id="singularNameContainer" className="leftColumnRightPanel" >
                                        ?
                                    </div>
                                </div>

                                <div className="singleItemContainer" >
                                    <div className="leftColumnLeftPanel" >
                                        plural (name):
                                    </div>
                                    <div id="pluralNameContainer" className="leftColumnRightPanel" >
                                        ?
                                    </div>
                                </div>

                                <div className="singleItemContainer" >
                                    <div className="leftColumnLeftPanel" >
                                        description:
                                    </div>
                                    <div id="descriptionContainer" className="leftColumnRightPanel" style={{height:"40px",overflow:"scroll"}}>
                                        ?
                                    </div>
                                </div>

                                <br/>

                                <div className="singleItemContainer" >
                                    <div className="leftColumnLeftPanel" >
                                        number of words:
                                    </div>
                                    <div id="numberOfWordsContainer" className="leftColumnRightPanel" >
                                        ?
                                    </div>
                                </div>

                                <div className="singleItemContainer" >
                                    <div className="leftColumnLeftPanel" >
                                        number of relationships:
                                    </div>
                                    <div id="numberOfRelationshipsContainer" className="leftColumnRightPanel" >
                                        ?
                                    </div>
                                </div>

                                <div className="singleItemContainer" >
                                    <div className="leftColumnLeftPanel" >
                                        number of specific instances:
                                    </div>
                                    <div id="numberOfSpecificInstancesContainer" className="leftColumnRightPanel" >
                                        ?
                                    </div>
                                </div>

                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        number of sets:
                                    </div>
                                    <div id="numberOfSetsContainer" className="leftColumnRightPanel" >
                                        ?
                                    </div>
                                </div>

                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        number of properties:
                                    </div>
                                    <div id="numberOfPropertiesContainer" className="leftColumnRightPanel" >
                                        ?
                                    </div>
                                </div>

                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        path:
                                    </div>
                                    <div id="propertyPathContainer" className="leftColumnRightPanel" >
                                        fooData
                                    </div>
                                </div>

                                <br/>

                                <center>Special Words (slugs)</center>

                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        JSONSchema:
                                    </div>
                                    <div id="JSONSchemaSlugContainer" className="leftColumnRightPanel specialWordContainer" >
                                        foo
                                    </div>
                                </div>

                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        wordType:
                                    </div>
                                    <div id="wordTypeSlugContainer" className="leftColumnRightPanel specialWordContainer" >
                                        foo
                                    </div>
                                </div>

                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        superset:
                                    </div>
                                    <div id="supersetSlugContainer" className="leftColumnRightPanel specialWordContainer" >
                                        foo
                                    </div>
                                </div>

                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        concept:
                                    </div>
                                    <div id="conceptSlugContainer" className="leftColumnRightPanel specialWordContainer" >
                                        foo
                                    </div>
                                </div>

                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        schema:
                                    </div>
                                    <div id="schemaSlugContainer" className="leftColumnRightPanel specialWordContainer" >
                                        foo
                                    </div>
                                </div>

                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        propertySchema:
                                    </div>
                                    <div id="propertySchemaSlugContainer" className="leftColumnRightPanel specialWordContainer" >
                                        foo
                                    </div>
                                </div>

                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        properties:
                                    </div>
                                    <div id="propertiesSlugContainer" className="leftColumnRightPanel specialWordContainer" >
                                        foo
                                    </div>
                                </div>

                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        primaryProperty:
                                    </div>
                                    <div id="primaryPropertySlugContainer" className="leftColumnRightPanel specialWordContainer" >
                                        foo
                                    </div>
                                </div>

                                <br/>

                                <div style={{display:"inline-block",marginLeft:"10px",border:"1px dashed grey"}} >
                                    <center>Specific Instances</center>
                                    <div id="specificInstancesContainer" ></div>
                                </div>

                                <div style={{display:"inline-block",marginLeft:"10px",border:"1px dashed grey"}} >
                                    <center>Sets</center>
                                    <div id="setsContainer" style={{marginLeft:"10px"}} ></div>
                                </div>

                                <br/>

                                <div style={{display:"inline-block",marginLeft:"10px",border:"1px dashed grey"}} >
                                    <center>Properties</center>
                                    <div id="propertiesContainer" style={{marginLeft:"10px"}} ></div>
                                </div>

                            </div>

                            <div className="standardDoubleColumn" >
                                <textarea id="rightColumnTextarea" style={{width:"95%",height:"300px"}}>
                                    rightColumnTextarea
                                </textarea>

                                <div className="doSomethingButton" id="updateWordButton">UPDATE</div>

                                <br/>

                                <div id="schemaInfoContainer" style={{display:"inline-block",fontSize:"12px",margin:"10px 0px 0px 0px",width:"95%",border:"1px dashed grey"}} >
                                    <center>Schema information</center>

                                    <div style={{display:"inline-block",marginLeft:"10px"}} >
                                        <div id="relsContainer" style={{marginLeft:"10px"}} ></div>
                                    </div>

                                    <br/><br/>

                                    <div style={{display:"inline-block",marginLeft:"10px"}} >
                                        <div id="nodesContainer" style={{marginLeft:"10px"}} ></div>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </fieldset>
            </>
        );
    }
}
