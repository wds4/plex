import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/singleConceptGraph_leftNav2.js';
import * as MiscFunctions from '../../../functions/miscFunctions.js';
import sendAsync from '../../../renderer.js';

const jQuery = require("jquery");

var aSchemas = [];
var aConcepts = [];

var oRelevantSchemas = {};
var oRelevantConcepts = {};

const loadSelectedWord = (selectedWord_slug) => {
    oRelevantSchemas[selectedWord_slug] = [];
    oRelevantConcepts[selectedWord_slug] = [];
    var oWord = window.lookupWordBySlug[selectedWord_slug];
    var sWord = JSON.stringify(oWord,null,4)
    jQuery("#singleWordRawfileTextarea").val(sWord)
    jQuery("#relevantSchemasContainer").html("")
    jQuery("#relevantConceptsContainer").html("")
    jQuery("#relevantRelationshipsContainer").html("")

    jQuery("#selectedSlugContainer").html(selectedWord_slug)

    for (var s=0;s<aSchemas.length;s++) {
        var nextSchema_slug = aSchemas[s];
        var oNextSchema = window.lookupWordBySlug[nextSchema_slug];
        var aNodes = oNextSchema.schemaData.nodes;
        for (var n=0;n<aNodes.length;n++) {
            var nextSchemaNode_slug = aNodes[n].slug;
            if (nextSchemaNode_slug==selectedWord_slug) {
                var aRelationships = oNextSchema.schemaData.relationships;

                if (jQuery.inArray(nextSchema_slug,oRelevantSchemas[selectedWord_slug]) == -1) {
                    oRelevantSchemas[selectedWord_slug].push(nextSchema_slug)
                    var schemaInfoHTML = "";
                    schemaInfoHTML += "<div>";
                    schemaInfoHTML += nextSchema_slug;
                    schemaInfoHTML += "</div>";
                    jQuery("#relevantSchemasContainer").append(schemaInfoHTML)
                }


                for (var r=0;r<aRelationships.length;r++) {
                    var oNextRel = aRelationships[r];
                    var nF_slug = oNextRel.nodeFrom.slug;
                    var rT_slug = oNextRel.relationshipType.slug;
                    var nT_slug = oNextRel.nodeTo.slug;

                    if ( (nF_slug == selectedWord_slug) || (nT_slug == selectedWord_slug) ) {
                        var relationshipInfoHTML = "";
                        relationshipInfoHTML += "<div>";
                            relationshipInfoHTML += "<div style=display:inline-block;width:300px;>";
                            relationshipInfoHTML += nF_slug;
                            relationshipInfoHTML += "</div>";

                            relationshipInfoHTML += "<div style=display:inline-block;width:300px;>";
                            relationshipInfoHTML += rT_slug;
                            relationshipInfoHTML += "</div>";

                            relationshipInfoHTML += "<div style=display:inline-block;width:300px;>";
                            relationshipInfoHTML += nT_slug;
                            relationshipInfoHTML += "</div>";

                            relationshipInfoHTML += "<div style=display:inline-block;width:300px;>";
                            relationshipInfoHTML += "("+nextSchema_slug+")";
                            relationshipInfoHTML += "</div>";
                        relationshipInfoHTML += "</div>";
                        jQuery("#relevantRelationshipsContainer").append(relationshipInfoHTML)
                    }
                }
            }
        }
    }

    for (var c=0;c<aConcepts.length;c++) {
        var nextConcept_slug = aConcepts[c];
        var oNextConcept = window.lookupWordBySlug[nextConcept_slug];

        var superset_slug = oNextConcept.conceptData.nodes.superset.slug;
        var jsonSchema_slug = oNextConcept.conceptData.nodes.JSONSchema.slug;
        var schema_slug = oNextConcept.conceptData.nodes.schema.slug;
        var concept_slug = oNextConcept.conceptData.nodes.concept.slug;
        var propertySchema_slug = oNextConcept.conceptData.nodes.propertySchema.slug;
        var properties_slug = oNextConcept.conceptData.nodes.properties.slug;
        var wordType_slug = oNextConcept.conceptData.nodes.wordType.slug;
        var primaryProperty_slug = oNextConcept.conceptData.nodes.primaryProperty.slug;

        if (
            (superset_slug==selectedWord_slug) ||
            (jsonSchema_slug==selectedWord_slug) ||
            (schema_slug==selectedWord_slug) ||
            (concept_slug==selectedWord_slug) ||
            (propertySchema_slug==selectedWord_slug) ||
            (properties_slug==selectedWord_slug) ||
            (wordType_slug==selectedWord_slug) ||
            (primaryProperty_slug==selectedWord_slug)
          )  {
              oRelevantSchemas[selectedWord_slug].push(nextConcept_slug)
              var conceptInfoHTML = "";
              conceptInfoHTML += "<div>";
              conceptInfoHTML += nextConcept_slug;
              conceptInfoHTML += "</div>";
              jQuery("#relevantConceptsContainer").append(conceptInfoHTML)
        }
    }
}

const makeSingleWordSelectors = () => {
    aSchemas = [];
    aConcepts = [];

    var singleWordSelectorHTML = "";
    var singleWordDynamicSelectorHTML = "";

    singleWordSelectorHTML += "<select id=singleWordSelector >";

    var aWords = Object.keys(window.lookupWordBySlug);

    for (var w=0;w<aWords.length;w++) {
        var nextWord_slug = aWords[w];
        var oNextWord = window.lookupWordBySlug[nextWord_slug];
        var aWordTypes = oNextWord.wordData.wordTypes;
        if (jQuery.inArray("schema",aWordTypes) > -1) {
            aSchemas.push(nextWord_slug)
        };
        if (jQuery.inArray("concept",aWordTypes) > -1) {
            aConcepts.push(nextWord_slug)
        };

        singleWordSelectorHTML += "<option ";
        singleWordSelectorHTML += " data-slug='"+nextWord_slug+"' ";
        singleWordSelectorHTML += " >";
        singleWordSelectorHTML += nextWord_slug;
        singleWordSelectorHTML += "</option>";

        singleWordDynamicSelectorHTML += "<div data-slug='"+nextWord_slug+"' class=dynamicSelector id='dynamicSelector_"+nextWord_slug+"' style=display:block; >";
        singleWordDynamicSelectorHTML += nextWord_slug;
        singleWordDynamicSelectorHTML += "</div>";

    }
    singleWordSelectorHTML += "</select>";

    jQuery("#singleWordSelectorContainer").html(singleWordSelectorHTML)

    jQuery("#singleWordDynamicSelectorContainer").html(singleWordDynamicSelectorHTML)
}

export default class ChangeSlug extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        makeSingleWordSelectors()

        var selectedWord_slug = jQuery("#singleWordSelector option:selected").data("slug")
        loadSelectedWord(selectedWord_slug)
        jQuery("#singleWordSelector").change(function(){
            var selectedWord_slug = jQuery("#singleWordSelector option:selected").data("slug")
            loadSelectedWord(selectedWord_slug)
        })
        jQuery("#slugEntryField").change(function(){
            var userText = jQuery(this).val();
            if (userText) {
                jQuery(".dynamicSelector").each(function(){
                    var nextSlug = jQuery(this).data("slug")
                    jQuery(this).css("display","none")
                    if (nextSlug.indexOf(userText) >= 0) {
                        jQuery(this).css("display","block")
                    }
                })
            } else {
                jQuery(".dynamicSelector").each(function(){
                    jQuery(this).css("display","block")
                })
            }
        })
        jQuery(".dynamicSelector").click(function(){
            var selectedWord_slug = jQuery(this).data("slug")
            loadSelectedWord(selectedWord_slug)
        })
        jQuery("#deleteThisWordButton").click(function(){
            var selectedWord_slug = jQuery("#selectedSlugContainer").html()
            var oWord = window.lookupWordBySlug[selectedWord_slug];
            MiscFunctions.deleteWordFromAllTables(oWord);

            var aRelevantSchemas = oRelevantSchemas[selectedWord_slug];

            for (var s=0; s < aRelevantSchemas.length;s++) {
                var nextSchema_slug = aRelevantSchemas[s];
                var oSchema = window.lookupWordBySlug[nextSchema_slug];
                console.log("oSchema: "+JSON.stringify(oSchema,null,4))
                var oSchema_updated = MiscFunctions.expungeWordFromSchema(oSchema,selectedWord_slug)
                MiscFunctions.createOrUpdateWordInAllTables(oSchema_updated);
                console.log("oSchema_updated: "+JSON.stringify(oSchema_updated,null,4))
            }
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
                        <div class="h2" >Delete Word</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>

                        <div>
                            <div style={{border:"1px dashed grey",width:"600px",display:"inline-block"}}>
                                <center><div id="selectedSlugContainer" style={{fontSize:"18px"}}></div></center>
                                Type slug here:<br/>
                                <textarea id="slugEntryField" style={{width:"400px",height:"30px"}}></textarea>
                                <br/>
                                <div id="singleWordDynamicSelectorContainer" style={{backgroundColor:"#DFDFDF",fontSize:"14px",width:"400px",height:"200px",overflow:"scroll"}}></div>
                                <br/>
                                <div id="singleWordSelectorContainer"></div>
                                <div id="deleteThisWordButton" className="doSomethingButton">DELETE</div>
                                <div style={{fontSize:"10px",width:"600px"}}>
                                    <li>remove word with this slug from all schemas in the box below (remove entry from schemaData.nodes and all rels from schemaData.relationships)</li>
                                    <li>set deleted = 1 for this slug in concept graph's database</li>
                                    <li>FOR globalDynamicData: this slug should be removed by the neuroCore Action: A.a.u1n.cleanGlobalDynamicData</li>
                                </div>
                                Selected slug's rawFile:<br/>
                                <textarea id="singleWordRawfileTextarea" style={{width:"600px",height:"200px"}}></textarea>
                            </div>

                            <div style={{border:"1px dashed grey",width:"600px",height:"600px",display:"inline-block"}}>
                            agdag
                            </div>
                        </div>
                        This word appears in the following schemas:<br/>
                        <div id="relevantSchemasContainer" style={{border:"1px solid black",width:"400px",padding:"5px",display:"inline-block"}}></div>
                        <br/><br/>
                        This word appears as one of the special words for the following concepts:<br/>
                        <div id="relevantConceptsContainer" style={{border:"1px solid black",width:"400px",padding:"5px",display:"inline-block"}}></div>
                        <br/><br/>
                        This word appears in the following relationships:<br/>
                        <div id="relevantRelationshipsContainer" style={{fontSize:"12px",border:"1px solid black",width:"1250px",padding:"5px",display:"inline-block"}}></div>
                    </div>
                </fieldset>
            </>
        );
    }
}
