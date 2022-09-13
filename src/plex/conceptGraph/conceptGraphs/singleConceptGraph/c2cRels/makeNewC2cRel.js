import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleConceptGraph_c2cRels_leftNav2.js';
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
    }
    if (c2cRelSlug=="isARealizationOf") {
        sentenceHTML += "A(n) "+sFromSingular;
        sentenceHTML += " ";
        sentenceHTML += "is a specific instance of a(n)";
        sentenceHTML += " ";
        sentenceHTML += sToSingular;
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

    var schemaFromSlug = oConceptFrom.conceptData.nodes.schema.slug;
    var oSchemaFrom = window.lookupWordBySlug[schemaFromSlug]

    var schemaToSlug = oConceptFrom.conceptData.nodes.schema.slug;
    var oSchemaTo = window.lookupWordBySlug[schemaToSlug]

    var sSchemaFrom = JSON.stringify(oSchemaFrom,null,4);
    var sSchemaTo = JSON.stringify(oSchemaTo,null,4);

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
        jQuery("#updateBothSchemasButton").click(function(){
            var sSchemaConceptGraph_updated = jQuery("#cgMainSchemaRawFileEditedTextarea").val();
            var sSchemaConcept2_updated = jQuery("#schema2RawFileEditedTextarea").val();
            var oSchemaConceptGraph_updated = JSON.parse(sSchemaConceptGraph_updated);
            var oSchemaConcept2_updated = JSON.parse(sSchemaConcept2_updated);
            console.log("sSchemaConceptGraph_updated: "+sSchemaConceptGraph_updated)
            console.log("sSchemaConcept2_updated: "+sSchemaConcept2_updated)
            MiscFunctions.createOrUpdateWordInAllTables(oSchemaConceptGraph_updated)
            MiscFunctions.createOrUpdateWordInAllTables(oSchemaConcept2_updated)
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
                        <div class="h2">Make New C2C Relationship</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName}</div>

                        <div style={{display:"inline-block",padding:"10px",width:"300px",height:"200px",border:"1px dashed grey",overflow:"scroll"}}>
                            concept1:
                            <div id="leftConceptSelectorContainer">leftConceptSelectorContainer</div>
                            <textarea id="concept1NewRelTextarea" style={{width:"90%",height:"100px"}}></textarea>
                        </div>

                        <div style={{display:"inline-block",padding:"10px",width:"300px",height:"200px",border:"1px dashed grey",overflow:"scroll"}}>
                            <select id="c2cRelSelector" >
                                <option value="isASubsetOf" >isASubsetOf</option>
                                <option value="isARealizationOf" >isARealizationOf</option>
                            </select>
                            <textarea id="conceptGraphMainSchemaNewRelTextarea" style={{width:"90%",height:"100px"}}></textarea>
                        </div>

                        <div style={{display:"inline-block",padding:"10px",width:"300px",height:"200px",border:"1px dashed grey",overflow:"scroll"}}>
                            concept2:
                            <div id="rightConceptSelectorContainer">rightConceptSelectorContainer</div>
                            <textarea id="concept2NewRelTextarea" style={{width:"90%",height:"100px"}}></textarea>
                        </div>

                        <br/>

                        <div style={{display:"inline-block",padding:"10px",width:"900px",height:"100px",border:"1px dashed grey"}}>
                            <div id="humanReadableSentenceSelector">humanReadableSentenceSelector</div>
                            <br/>
                            update both schemas with new relationships: <div id="updateBothSchemasButton" className="doSomethingButton">UPDATE</div>
                        </div>

                        <br/>

                        <div style={{display:"inline-block",padding:"10px",width:"400px",height:"500px",border:"1px dashed grey"}}>
                            schema1 rawFile:
                            <textarea id="schema1RawFileUneditedTextarea" style={{width:"90%",height:"200px"}}></textarea>
                            <textarea id="schema1RawFileEditedTextarea" style={{width:"90%",height:"200px"}}></textarea>
                        </div>

                        <div style={{display:"inline-block",padding:"10px",width:"400px",height:"500px",border:"1px dashed grey"}}>
                            conceptGraphMainSchema rawFile:
                            <textarea id="cgMainSchemaRawFileUneditedTextarea" style={{width:"90%",height:"200px"}}></textarea>
                            <textarea id="cgMainSchemaRawFileEditedTextarea" style={{width:"90%",height:"200px"}}></textarea>
                        </div>

                        <div style={{display:"inline-block",padding:"10px",width:"400px",height:"500px",border:"1px dashed grey"}}>
                            schema2 rawFile:
                            <textarea id="schema2RawFileUneditedTextarea" style={{width:"90%",height:"200px"}}></textarea>
                            <textarea id="schema2RawFileEditedTextarea" style={{width:"90%",height:"200px"}}></textarea>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
