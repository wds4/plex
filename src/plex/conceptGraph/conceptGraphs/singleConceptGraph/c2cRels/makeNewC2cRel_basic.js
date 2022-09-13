import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleConceptGraph_leftNav2.js';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

export const makeConceptSelectors = () => {
    var currentConceptGraphSqlID = window.currentConceptGraphSqlID;
    var currentConceptGraphMainSchemaSlug = window.aLookupConceptGraphInfoBySqlID[currentConceptGraphSqlID].mainSchema_slug
    var oCurrentConceptGraphMainSchema = window.lookupWordBySlug[currentConceptGraphMainSchemaSlug];
    var aConcepts = oCurrentConceptGraphMainSchema.conceptGraphData.concepts;

    var outputHTML_left = "";
    var outputHTML_right = "";
    outputHTML_left += "<select id='conceptFromSelector' >";
    outputHTML_right += "<select id='conceptToSelector' >";
    var numConcepts = aConcepts.length;
    console.log("numConcepts: "+numConcepts)

    for (var c=0;c<numConcepts;c++) {
        var nextConceptSlug = aConcepts[c];
        var oNextConcept = window.lookupWordBySlug[nextConceptSlug];
        var nextConceptNameSingular = oNextConcept.conceptData.name.singular;

        var outputHTML = "";
        outputHTML += "<option ";
        outputHTML += " data-conceptslug='"+nextConceptSlug+"' ";
        outputHTML += " >";
        outputHTML += nextConceptNameSingular;
        outputHTML += "</option>";

        outputHTML_left += outputHTML;
        outputHTML_right += outputHTML;
    }

    outputHTML_left += "</select>";
    outputHTML_right += "</select>";

    jQuery("#leftConceptSelectorContainer").html(outputHTML_left)
    jQuery("#rightConceptSelectorContainer").html(outputHTML_right)
}

export const generateHumanReadableSentence = () => {
    var sentenceHTML = "";

    var conceptFromSlug = jQuery("#conceptFromSelector option:selected").data("conceptslug");
    var c2cRelSlug = jQuery("#c2cRelSelector option:selected").val();
    var conceptToSlug = jQuery("#conceptToSelector option:selected").data("conceptslug");

    var oConceptFrom = window.lookupWordBySlug[conceptFromSlug];
    var oConceptTo = window.lookupWordBySlug[conceptToSlug];

    var sFromSingular = oConceptFrom.conceptData.name.singular;
    var sToSingular = oConceptTo.conceptData.name.singular;

    var c1WordTypeSlug = oConceptFrom.conceptData.nodes.wordType.slug;
    var c2WordTypeSlug = oConceptTo.conceptData.nodes.wordType.slug;

    var supersetFromSlug = oConceptFrom.conceptData.nodes.superset.slug;
    var oSupersetFrom = window.lookupWordBySlug[supersetFromSlug];

    var supersetToSlug = oConceptTo.conceptData.nodes.superset.slug;
    var oSupersetTo = window.lookupWordBySlug[supersetToSlug];

    // change this to allow option for user to select subsets, not just superset
    var c1SetSlug = supersetFromSlug;
    var c2SetSlug = supersetToSlug;

    var c1SetName = oSupersetFrom.supersetData.name;
    var c2SetName = oSupersetTo.supersetData.name;

    if (c2cRelSlug=="isASubsetOf") {
        sentenceHTML += "The set of all " + c1SetName;
        sentenceHTML += " ";
        sentenceHTML += "is a subset of";
        sentenceHTML += " ";
        sentenceHTML += " the set of all " + c2SetName;

        jQuery("#wordType1RawFileEditedTextarea").val("")
    }
    if (c2cRelSlug=="isARealizationOf") {
        // sentenceHTML += "The abstract concept of a(n) "+sFromSingular;
        sentenceHTML += sFromSingular[0].toUpperCase() + sFromSingular.substring(1) + " (as an abstract idea)";
        sentenceHTML += " ";
        sentenceHTML += "is an example of a(n)";
        sentenceHTML += " ";
        sentenceHTML += sToSingular;
        sentenceHTML += ".";

        var oWordTypeFrom = window.lookupWordBySlug[c1WordTypeSlug];
        var oWordTypeFrom_updated = MiscFunctions.cloneObj(oWordTypeFrom)

        var c2PropertyPath = oConceptTo.conceptData.propertyPath;
        if (!oWordTypeFrom_updated.hasOwnProperty(c2PropertyPath)) {
            oWordTypeFrom_updated[c2PropertyPath] = {};
        }

        var aDefaultPropertyKeys = MiscFunctions.fetchDefaultPropertyKeys(conceptToSlug)
        for (var p=0;p<aDefaultPropertyKeys.length;p++) {
            var nextKey = aDefaultPropertyKeys[p];
            if (!oWordTypeFrom_updated[c2PropertyPath].hasOwnProperty(nextKey)) {
                oWordTypeFrom_updated[c2PropertyPath][nextKey] = null;
                if (nextKey == "name") {
                    oWordTypeFrom_updated[c2PropertyPath][nextKey] = oConceptFrom.conceptData.name.singular;
                } else {
                    if (oConceptFrom.conceptData.hasOwnProperty(nextKey)) {
                        oWordTypeFrom_updated[c2PropertyPath][nextKey] = oConceptFrom.conceptData[nextKey];
                    }
                }
            }
        }

        var aTopLevelProperties = ["wordData",c2PropertyPath,"_REMAINDER_","globalDynamicData","metaData"]
        oWordTypeFrom_updated = MiscFunctions.reorderTopLevelProperties(oWordTypeFrom_updated,aTopLevelProperties)

        var sWordTypeFrom_updated = JSON.stringify(oWordTypeFrom_updated,null,4)
        jQuery("#wordType1RawFileEditedTextarea").val(sWordTypeFrom_updated)
    }

    jQuery("#humanReadableSentenceSelector").html(sentenceHTML)

    // var oNewRelCon1 = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
    var oNewRelCon2 = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
    var oNewRelCGMainSchema = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);

    oNewRelCGMainSchema.nodeFrom.slug = conceptFromSlug;
    oNewRelCGMainSchema.relationshipType.slug = c2cRelSlug;
    oNewRelCGMainSchema.nodeTo.slug = conceptToSlug;

    // subsetOf
    oNewRelCon2.nodeFrom.slug = c1SetSlug;
    oNewRelCon2.nodeTo.slug = c2SetSlug;
    if (c2cRelSlug=="isASubsetOf") {
        oNewRelCon2.relationshipType.slug = "subsetOf";
    }
    // isARealizationOf
    if (c2cRelSlug=="isARealizationOf") {
        oNewRelCon2.nodeFrom.slug = c1WordTypeSlug;
        oNewRelCon2.nodeTo.slug = supersetToSlug;
        oNewRelCon2.relationshipType.slug = "isASpecificInstanceOf";
    }

    // var sNewRelCon1 = JSON.stringify(oNewRelCon1,null,4);
    var sNewRelCon2 = JSON.stringify(oNewRelCon2,null,4);
    var sNewRelCGMainSchema = JSON.stringify(oNewRelCGMainSchema,null,4);

    // console.log("sNewRelCon2: "+sNewRelCon2)
    // console.log("sNewRelCGMainSchema: "+sNewRelCGMainSchema)

    // jQuery("#concept1NewRelTextarea").val(sNewRelCon1)
    jQuery("#concept2NewRelTextarea").val(sNewRelCon2)
    jQuery("#conceptGraphMainSchemaNewRelTextarea").val(sNewRelCGMainSchema)

    // add new rels to the relevant schemas
    var oAllWords = MiscFunctions.cloneObj(window.lookupWordBySlug)
    var sSchemaConceptGraph = jQuery("#cgMainSchemaRawFileUneditedTextarea").val();
    var sSchemaConcept2 = jQuery("#schema2RawFileUneditedTextarea").val();
    // console.log("sSchemaConcept2: "+sSchemaConcept2)
    // console.log("sSchemaConceptGraph: "+sSchemaConceptGraph)

    var oSchemaConcept2 = JSON.parse(sSchemaConcept2);
    var oSchemaConceptGraph = JSON.parse(sSchemaConceptGraph)

    oSchemaConcept2 = MiscFunctions.updateSchemaWithNewRel(oSchemaConcept2,oNewRelCon2,oAllWords)
    oSchemaConceptGraph = MiscFunctions.updateSchemaWithNewRel(oSchemaConceptGraph,oNewRelCGMainSchema,oAllWords)

    var sSchemaConcept2_updated = JSON.stringify(oSchemaConcept2,null,4);
    var sSchemaConceptGraph_updated = JSON.stringify(oSchemaConceptGraph,null,4);

    jQuery("#cgMainSchemaRawFileEditedTextarea").val(sSchemaConceptGraph_updated);
    jQuery("#schema2RawFileEditedTextarea").val(sSchemaConcept2_updated);

}

export const fetchUneditedSchemaRawFiles = () => {
    var conceptFromSlug = jQuery("#conceptFromSelector option:selected").data("conceptslug");
    var conceptToSlug = jQuery("#conceptToSelector option:selected").data("conceptslug");

    var oConceptFrom = window.lookupWordBySlug[conceptFromSlug];
    var oConceptTo = window.lookupWordBySlug[conceptToSlug];

    var wordTypeFromSlug = oConceptFrom.conceptData.nodes.wordType.slug;
    var oWordTypeFrom = window.lookupWordBySlug[wordTypeFromSlug];

    var schemaFromSlug = oConceptFrom.conceptData.nodes.schema.slug;
    var oSchemaFrom = window.lookupWordBySlug[schemaFromSlug]

    var schemaToSlug = oConceptTo.conceptData.nodes.schema.slug;
    var oSchemaTo = window.lookupWordBySlug[schemaToSlug]

    var sWordTypeFrom = JSON.stringify(oWordTypeFrom,null,4);
    var sSchemaFrom = JSON.stringify(oSchemaFrom,null,4);
    var sSchemaTo = JSON.stringify(oSchemaTo,null,4);

    jQuery("#wordType1RawFileUneditedTextarea").val(sWordTypeFrom)
    jQuery("#schema1RawFileUneditedTextarea").val(sSchemaFrom)
    jQuery("#schema2RawFileUneditedTextarea").val(sSchemaTo)

    var currentConceptGraphSqlID = window.currentConceptGraphSqlID;
    var currentConceptGraphMainSchemaSlug = window.aLookupConceptGraphInfoBySqlID[currentConceptGraphSqlID].mainSchema_slug
    var oCurrentConceptGraphMainSchema = window.lookupWordBySlug[currentConceptGraphMainSchemaSlug];
    var sCurrentConceptGraphMainSchema = JSON.stringify(oCurrentConceptGraphMainSchema,null,4);
    jQuery("#cgMainSchemaRawFileUneditedTextarea").val(sCurrentConceptGraphMainSchema);
}

export default class MakeNewC2cRel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptSqlID: null,
            conceptGraphTableSqlID: null,
            conceptGraphTableName: null
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        makeConceptSelectors();
        fetchUneditedSchemaRawFiles();
        generateHumanReadableSentence();
        jQuery("#conceptFromSelector").change(function(){
            fetchUneditedSchemaRawFiles();
            generateHumanReadableSentence();
        })
        jQuery("#c2cRelSelector").change(function(){
            fetchUneditedSchemaRawFiles();
            generateHumanReadableSentence();
        })
        jQuery("#conceptToSelector").change(function(){
            fetchUneditedSchemaRawFiles();
            generateHumanReadableSentence();
        })
        jQuery("#updateBothSchemasButton").click(async function(){
            var sSchemaConceptGraph_updated = jQuery("#cgMainSchemaRawFileEditedTextarea").val();
            var sSchemaConcept2_updated = jQuery("#schema2RawFileEditedTextarea").val();
            var sWordTypeConcept1_updated = jQuery("#wordType1RawFileEditedTextarea").val();
            var oSchemaConceptGraph_updated = JSON.parse(sSchemaConceptGraph_updated);
            var oSchemaConcept2_updated = JSON.parse(sSchemaConcept2_updated);

            // console.log("sSchemaConceptGraph_updated: "+sSchemaConceptGraph_updated)
            // console.log("sSchemaConcept2_updated: "+sSchemaConcept2_updated)
            await MiscFunctions.createOrUpdateWordInAllTables(oSchemaConceptGraph_updated)
            await MiscFunctions.createOrUpdateWordInAllTables(oSchemaConcept2_updated)
            if (sWordTypeConcept1_updated) {
                var oWordTypeConcept1_updated = JSON.parse(sWordTypeConcept1_updated);
                await MiscFunctions.createOrUpdateWordInAllTables(oWordTypeConcept1_updated)
                console.log("sWordTypeConcept1_updated: "+sWordTypeConcept1_updated)
            }
        })
        jQuery("#displayDeveloperDetailsToggleButton").click(function(){
            var currStatus = jQuery(this).data("status")
            if (currStatus=="show") {
                jQuery(this).data("status","hide")
                jQuery(this).html("show developer details")
                jQuery("#schemasContainer").css("display","none")
                jQuery("#concept1NewRelTextarea").css("display","none")
                jQuery("#conceptGraphMainSchemaNewRelTextarea").css("display","none")
                jQuery("#concept2NewRelTextarea").css("display","none")
                jQuery("#concept1TitleContainer").css("display","none")
                jQuery("#concept2TitleContainer").css("display","none")
                jQuery("#explanationContainer").css("display","none")

                jQuery(".explanationBox").css("display","none")

                jQuery("#concept1Box").css("height","100px")
                jQuery("#c2cRelBox").css("height","100px")
                jQuery("#concept2Box").css("height","100px")

                jQuery("#concept1Box").css("border","0px dashed grey")
                jQuery("#c2cRelBox").css("border","0px dashed grey")
                jQuery("#concept2Box").css("border","0px dashed grey")
            }
            if (currStatus=="hide") {
                jQuery(this).data("status","show")
                jQuery(this).html("hide developer details")
                jQuery("#schemasContainer").css("display","inline")
                jQuery("#concept1NewRelTextarea").css("display","inline-block")
                jQuery("#conceptGraphMainSchemaNewRelTextarea").css("display","inline-block")
                jQuery("#concept2NewRelTextarea").css("display","inline-block")
                jQuery("#concept1TitleContainer").css("display","inline-block")
                jQuery("#concept2TitleContainer").css("display","inline-block")
                jQuery("#explanationContainer").css("display","inline-block")

                jQuery(".explanationBox").css("display","block")

                jQuery("#concept1Box").css("height","200px")
                jQuery("#c2cRelBox").css("height","200px")
                jQuery("#concept2Box").css("height","200px")

                jQuery("#concept1Box").css("border","1px dashed grey")
                jQuery("#c2cRelBox").css("border","1px dashed grey")
                jQuery("#concept2Box").css("border","1px dashed grey")
            }
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
                        <div style={{position:"relative"}}>
                            <div className="doSomethingButton" style={{position:"absolute",left:"5px",top:"5px"}} id="displayDeveloperDetailsToggleButton" data-status="hide">show developer details</div>
                            <div class="h2">Make New C2C Relationship (2 most basic types)</div>

                            <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName}</div>

                            <center>
                                <div style={{display:"inline-block",marginTop:"80px"}}>

                                    <div id="concept1Box" style={{display:"inline-block",padding:"10px",width:"300px",height:"200px",border:"0px dashed grey",overflow:"scroll"}}>
                                        <div id="concept1TitleContainer" style={{display:"none"}}>concept1:</div>
                                        <div id="leftConceptSelectorContainer">leftConceptSelectorContainer</div>
                                        <textarea id="concept1NewRelTextarea" style={{width:"90%",height:"100px",display:"none"}}></textarea>
                                    </div>

                                    <div id="c2cRelBox" style={{display:"inline-block",padding:"10px",width:"300px",height:"200px",border:"0px dashed grey",overflow:"scroll"}}>
                                        <div style={{display:"inline-block",width:"300px",height:"150px"}}>
                                            <select id="c2cRelSelector" >
                                                <option value="isASubsetOf" >isASubsetOf</option>
                                                <option value="isARealizationOf" >isARealizationOf</option>
                                            </select>
                                            <textarea id="conceptGraphMainSchemaNewRelTextarea" style={{width:"90%",height:"80px",display:"none"}}></textarea>
                                        </div>
                                        <div className="explanationBox" style={{fontSize:"12px",display:"none"}} >Add this relationship to mainSchemaForConceptGraph.</div>
                                    </div>

                                    <div id="concept2Box" style={{display:"inline-block",padding:"10px",width:"300px",height:"200px",border:"0px dashed grey",overflow:"scroll"}}>
                                        <div style={{display:"inline-block",width:"300px",height:"150px",border:"0px solid red"}}>
                                            <div id="concept2TitleContainer" style={{display:"none"}}>concept2:</div>
                                            <div id="rightConceptSelectorContainer">rightConceptSelectorContainer</div>
                                            <textarea id="concept2NewRelTextarea" style={{width:"90%",height:"80px",display:"none"}}></textarea>
                                        </div>
                                        <div className="explanationBox" style={{fontSize:"12px",display:"none"}} >Add this relationship to the main schema for the concept on the right.</div>
                                    </div>

                                    <br/>

                                    <div style={{textAlign:"left",display:"inline-block",padding:"10px",width:"900px",height:"100px",border:"1px dashed grey"}}>
                                        <div id="humanReadableSentenceSelector">humanReadableSentenceSelector</div>
                                        <br/>
                                        Add this to your concept graph. <div id="updateBothSchemasButton" className="doSomethingButton">ADD</div>
                                        <div id="explanationContainer" style={{display:"none"}} >(Update two schemas with new relationships.)</div>
                                    </div>
                                </div>
                            </center>

                            <div id="schemasContainer" style={{display:"none"}}>
                                <div style={{display:"inline-block",padding:"10px",width:"350px",height:"500px",border:"1px dashed grey"}}>
                                    wordType1 rawFile:
                                    <textarea className="rawFileTextarea" id="wordType1RawFileUneditedTextarea" style={{width:"95%",height:"200px"}}></textarea>
                                    <textarea className="rawFileTextarea" id="wordType1RawFileEditedTextarea" style={{width:"95%",height:"200px"}}></textarea>
                                </div>

                                <div style={{display:"inline-block",padding:"10px",width:"350px",height:"500px",border:"1px dashed grey"}}>
                                    schema1 rawFile:
                                    <textarea className="rawFileTextarea" id="schema1RawFileUneditedTextarea" style={{width:"95%",height:"200px"}}></textarea>
                                    <textarea className="rawFileTextarea" id="schema1RawFileEditedTextarea" style={{width:"95%",height:"200px"}}></textarea>
                                </div>

                                <div style={{display:"inline-block",padding:"10px",width:"350px",height:"500px",border:"1px dashed grey"}}>
                                    conceptGraphMainSchema rawFile:
                                    <textarea className="rawFileTextarea" id="cgMainSchemaRawFileUneditedTextarea" style={{width:"95%",height:"200px"}}></textarea>
                                    <textarea className="rawFileTextarea" id="cgMainSchemaRawFileEditedTextarea" style={{width:"95%",height:"200px"}}></textarea>
                                </div>

                                <div style={{display:"inline-block",padding:"10px",width:"350px",height:"500px",border:"1px dashed grey"}}>
                                    schema2 rawFile:
                                    <textarea className="rawFileTextarea" id="schema2RawFileUneditedTextarea" style={{width:"95%",height:"200px"}}></textarea>
                                    <textarea className="rawFileTextarea" id="schema2RawFileEditedTextarea" style={{width:"95%",height:"200px"}}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
