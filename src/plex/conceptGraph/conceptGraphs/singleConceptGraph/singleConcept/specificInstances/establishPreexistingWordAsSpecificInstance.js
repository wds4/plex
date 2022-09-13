import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/singleConcept_specificInstances_leftNav2.js';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import ReactJSONSchemaForm from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");

const makeSubsetOfSelector = (oConcept) => {
    var selectorPanelHTML = "";

    var supersetSlug = oConcept.conceptData.nodes.superset.slug;
    var oSuperset = window.lookupWordBySlug[supersetSlug];

    selectorPanelHTML += "<div class=subsetOfCheckboxContainer >";
    selectorPanelHTML += "<input class=subsetOfCheckbox data-slug='"+supersetSlug+"' id='subsetOfCheckbox_"+nextSet+"' type=checkbox checked name=setCheckbox ></input> ";
    selectorPanelHTML += supersetSlug;
    selectorPanelHTML += "<br>";

    var aSets = oSuperset.globalDynamicData.subsets
    var numSets = aSets.length;
    for (var s=0;s<numSets;s++) {
        var nextSet = aSets[s];

        selectorPanelHTML += "<input class=subsetOfCheckbox data-slug='"+nextSet+"' id='subsetOfCheckbox_"+nextSet+"' type=checkbox name=setCheckbox ></input> ";
        selectorPanelHTML += nextSet;
        selectorPanelHTML += "<br>";
    }
    selectorPanelHTML += "<div>";
    jQuery("#newSetSubsetOfSelectorContainer_si").html(selectorPanelHTML)
}

const makePreexistingWordsContainers = async (oConcept) => {
    var propertyPath = oConcept.conceptData.propertyPath;
    var superset_slug = oConcept.conceptData.nodes.superset.slug;
    var oSuperset = window.lookupWordBySlug[superset_slug];
    var aCurrentSpecificInstances = oSuperset.globalDynamicData.specificInstances;

    var preexistingWordSelectorHTML = "";
    var suggestedWordsHTML = "";

    var aWordSlugs = Object.keys(window.lookupWordBySlug);

    preexistingWordSelectorHTML += "<select id='preexistingWordSelector' >";
    for (var w=0;w<aWordSlugs.length;w++) {
        var nextWord_slug = aWordSlugs[w];
        var oWord = window.lookupWordBySlug[nextWord_slug];

        preexistingWordSelectorHTML += "<option ";
        preexistingWordSelectorHTML += " data-slug='"+nextWord_slug+"' ";
        preexistingWordSelectorHTML += " >";
        preexistingWordSelectorHTML += nextWord_slug;
        preexistingWordSelectorHTML += "</option>";

        if (oWord.hasOwnProperty(propertyPath)) {
            var swPrefix = "";
            var marginLeft = "20px";
            if (jQuery.inArray(nextWord_slug,aCurrentSpecificInstances) > -1) {
                swPrefix = "* ";
                marginLeft = "10px";
            } else {

            }
            suggestedWordsHTML += "<div style='margin-left:"+marginLeft+"' class=suggestedWords ";
            suggestedWordsHTML += " data-slug='"+nextWord_slug+"' ";
            suggestedWordsHTML += " >";
            suggestedWordsHTML += swPrefix;
            suggestedWordsHTML += nextWord_slug;
            suggestedWordsHTML += "</div>";
        }
    }
    preexistingWordSelectorHTML += "</select>";

    jQuery("#preexistingWordSelectorContainer").html(preexistingWordSelectorHTML);
    jQuery("#preexistingWordSelector").change(function(){
        var word_slug = jQuery("#preexistingWordSelector option:selected").data("slug")
        processNewlySelectedWord(word_slug)
    })

    jQuery("#suggestedWordsContainer").html(suggestedWordsHTML);
    jQuery(".suggestedWords").click(function(){
        jQuery(".suggestedWords").css("backgroundColor","#EFEFEF")
        jQuery(this).css("backgroundColor","#CFCFCF")
        var word_slug = jQuery(this).data("slug");
        processNewlySelectedWord(word_slug)
    })
}

const processNewlySelectedWord = (newlySelectedWord_slug) => {
    var oWord = window.lookupWordBySlug[newlySelectedWord_slug];
    oWord.metaData.neuroCore.processedAsSpecificInstance = false;
    var sWord = JSON.stringify(oWord,null,4);
    jQuery("#selectedPreexistingWordTextarea").val(sWord)
    jQuery("#slectedWordContainer").html(newlySelectedWord_slug)

    var sSchema = jQuery("#schemaTextarea_unedited").val();
    var oSchema = JSON.parse(sSchema);
    // make changes: add new relationship
    var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
    oNewRel.nodeFrom.slug = newlySelectedWord_slug
    oNewRel.relationshipType.slug = "isASpecificInstanceOf";
    jQuery(".subsetOfCheckboxContainer input:checked").each(function(){
        var set_slug = jQuery(this).data("slug")
        // console.log("add set_slug: "+set_slug)
        oNewRel.nodeTo.slug = set_slug;
        oSchema = MiscFunctions.cloneObj(MiscFunctions.updateSchemaWithNewRel(oSchema,oNewRel,window.lookupWordBySlug));
    })

    var sSchema_updated = JSON.stringify(oSchema,null,4);
    jQuery("#schemaTextarea_edited").val(sSchema_updated);
}

export default class EstablishPreexistingWordAsSpecificInstance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var conceptSlug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;
        var oConcept = window.lookupWordBySlug[conceptSlug]

        var schema_slug = oConcept.conceptData.nodes.schema.slug;
        var oSchema = window.lookupWordBySlug[schema_slug]
        var sSchema = JSON.stringify(oSchema,null,4)
        jQuery("#schemaTextarea_unedited").val(sSchema);

        makeSubsetOfSelector(oConcept)

        makePreexistingWordsContainers(oConcept);

        jQuery(".subsetOfCheckbox").change(function(){
            var word_slug = jQuery("#slectedWordContainer").html()
            if (word_slug) { processNewlySelectedWord(word_slug) }
        })
        jQuery("#updateSchemaButton").click(function(){
            var sSchema_updated = jQuery("#schemaTextarea_edited").val();
            var oSchema_updated = JSON.parse(sSchema_updated)
            var schema_slug = oSchema_updated.wordData.slug;
            // console.log("sSchema_updated: "+sSchema_updated)
            MiscFunctions.createOrUpdateWordInAllTables(oSchema_updated);
            window.lookupWordBySlug[schema_slug] = oSchema_updated
            jQuery("#schemaTextarea_unedited").val(sSchema_updated);

            var sSpecificInstance = jQuery("#selectedPreexistingWordTextarea").val();
            var oSpecificInstance = JSON.parse(sSpecificInstance)
            var specificInstance_slug = oSpecificInstance.wordData.slug;

            MiscFunctions.createOrUpdateWordInAllTables(oSpecificInstance);
            window.lookupWordBySlug[specificInstance_slug] = oSpecificInstance
        })
    }
    render() {
        var currentConcept_slug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;
        var oConcept = window.lookupWordBySlug[currentConcept_slug];
        var propertyPath = oConcept.conceptData.propertyPath;
        var superset_slug = oConcept.conceptData.nodes.superset.slug;
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Establish Preexisting Word as a Specific Instance of this Concept</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>
                        <div class="h3" >{window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug}</div>

                        <div className="standardDoubleColumn" style={{border:"1px dashed grey"}}>
                            <center>Select Preexisting Word</center>
                            <div id="slectedWordContainer" style={{fontSize:"20px",height:"30px",backgroundColor:"#EFEFEF"}}></div>
                            <br/>
                            add new relationship(s) <br/>
                            [ (above word) - isASpecificInstanceOf - (checked sets on right) ]
                            <br/> to this concept's main schema:
                            <div id="updateSchemaButton" className="doSomethingButton">UPDATE SCHEMA (* and specific instance)</div>
                            <br/>
                            <div style={{fontSize:"10px"}}>* set metaData.neuroCore.processedAsSpecificInstance = false; triggers neuroCore to do its magic</div>
                            <br/>
                            <div id="preexistingWordSelectorContainer">preexistingWordSelectorContainer</div>
                            Suggested Words (because they have propertykey: {propertyPath})
                            <br/>
                            <div id="suggestedWordsContainer" style={{fontSize:"12px"}}>suggestedWordsContainer</div>
                            * = already present in specificInstances of {superset_slug}

                            <br/>
                            <textarea id="selectedPreexistingWordTextarea" style={{width:"600px",height:"300px"}}></textarea>

                        </div>

                        <div className="standardDoubleColumn" style={{border:"1px dashed grey"}}>
                            <center>Specific Instance Of:</center>
                            <br/>
                            <div id="newSetSubsetOfSelectorContainer_si" style={{display:"inline-block",marginLeft:"20px"}}>
                            </div>

                            <br/>
                            <textarea id="schemaTextarea_unedited" style={{width:"600px",height:"300px"}}></textarea>
                            <br/>
                            <textarea id="schemaTextarea_edited" style={{width:"600px",height:"300px"}}></textarea>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
