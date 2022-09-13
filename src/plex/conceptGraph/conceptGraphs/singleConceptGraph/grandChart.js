import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/singleConceptGraph_leftNav2.js';
import sendAsync from '../../../renderer.js';

const jQuery = require("jquery");

const createGrandChart = () => {
    var mainSchemaForConceptGraph_slug = "mainSchemaForConceptGraph";
    var oMainSchemaForConceptGraph = window.lookupWordBySlug[mainSchemaForConceptGraph_slug];
    var aConcepts = oMainSchemaForConceptGraph.conceptGraphData.concepts;

    var aAllWordsInConceptGraph = Object.keys(window.lookupWordBySlug);

    var grandChartHTML = "";

    grandChartHTML += "<div class=mainSchemaForConceptGraph_singleConceptContainer style=font-size:16px;height:75px;background-color:#EFEFEF; >";

        grandChartHTML += "<div class=mainSchemaForConceptGraph_conceptID >";
        grandChartHTML += "CONCEPT ID";
        grandChartHTML += "</div>";

        grandChartHTML += "<div  id='columnID_1' class='mainSchemaForConceptGraph_dataCell topPanelCell' >";
        grandChartHTML += "concept";
        grandChartHTML += "</div>";

        grandChartHTML += "<div  id='columnID_2' class='mainSchemaForConceptGraph_dataCell topPanelCell' >";
        grandChartHTML += "schema";
        grandChartHTML += "</div>";

        grandChartHTML += "<div  id='columnID_3' class='mainSchemaForConceptGraph_dataCell topPanelCell' >";
        grandChartHTML += "JSON schema";
        grandChartHTML += "</div>";

        grandChartHTML += "<div  id='columnID_4' class='mainSchemaForConceptGraph_dataCell topPanelCell' >";
        grandChartHTML += "wordType";
        grandChartHTML += "</div>";

        grandChartHTML += "<div  id='columnID_5' class='mainSchemaForConceptGraph_dataCell topPanelCell' >";
        grandChartHTML += "superset";
        grandChartHTML += "</div>";

        grandChartHTML += "<div  id='columnID_6' class='mainSchemaForConceptGraph_dataCell topPanelCell' >";
        grandChartHTML += "property schema";
        grandChartHTML += "</div>";

        grandChartHTML += "<div  id='columnID_7' class='mainSchemaForConceptGraph_dataCell topPanelCell' >";
        grandChartHTML += "primary property";
        grandChartHTML += "</div>";

        grandChartHTML += "<div id='columnID_8' class='mainSchemaForConceptGraph_dataCell topPanelCell' >";
        grandChartHTML += "properties";
        grandChartHTML += "</div>";

        grandChartHTML += "<div id='columnID_9' class='mainSchemaForConceptGraph_dataCell topPanelCell' >";
        grandChartHTML += "sets";
        grandChartHTML += "</div>";

        grandChartHTML += "<div id='columnID_10' class='mainSchemaForConceptGraph_dataCell topPanelCell' >";
        grandChartHTML += "specific instances";
        grandChartHTML += "</div>";

        grandChartHTML += "<div id='columnID_11' class='mainSchemaForConceptGraph_dataCell topPanelCell' >";
        grandChartHTML += "* orphaned specific instances";
        grandChartHTML += "</div>";

        grandChartHTML += "<div id='columnID_12' class='mainSchemaForConceptGraph_dataCell topPanelCell' >";
        grandChartHTML += "** orphaned specific instances";
        grandChartHTML += "</div>";

    grandChartHTML += "</div>";

    for (var c=0;c<aConcepts.length;c++) {
        var conceptSlug = aConcepts[c]
        var oConcept = window.lookupWordBySlug[conceptSlug];
        var propertyPath = oConcept.conceptData.propertyPath;
        var singular = oConcept.conceptData.name.singular;

        var concept_slug = oConcept.conceptData.nodes.concept.slug;
        var schema_slug = oConcept.conceptData.nodes.schema.slug;
        var jsonSchema_slug = oConcept.conceptData.nodes.JSONSchema.slug;
        var wordType_slug = oConcept.conceptData.nodes.wordType.slug;
        var superset_slug = oConcept.conceptData.nodes.superset.slug;
        var propertySchema_slug = oConcept.conceptData.nodes.propertySchema.slug;
        var primaryProperty_slug = oConcept.conceptData.nodes.primaryProperty.slug;
        var properties_slug = oConcept.conceptData.nodes.properties.slug;

        var oSuperset = window.lookupWordBySlug[superset_slug];
        var aSubsets = oSuperset.globalDynamicData.subsets;
        var aSpecificInstances = oSuperset.globalDynamicData.specificInstances;

        // var aPotentialWords = [];
        var aOrphanedWords_byKey = [];
        var aOrphanedWords_byWordType = [];
        for (var w=0;w<aAllWordsInConceptGraph.length;w++) {
            var nextWord_slug = aAllWordsInConceptGraph[w];
            var oNextWord = window.lookupWordBySlug[nextWord_slug];
            if (oNextWord.hasOwnProperty(propertyPath)) {
                // aPotentialWords.push(nextWord_slug)
                if (jQuery.inArray(nextWord_slug,aSpecificInstances)==-1) {
                    aOrphanedWords_byKey.push(nextWord_slug)
                }
            }
            if (jQuery.inArray(singular,oNextWord.wordData.wordTypes) > -1) {
            // if (oNextWord.wordData.wordType == singular) {
                // aPotentialWords.push(nextWord_slug)
                if (jQuery.inArray(nextWord_slug,aSpecificInstances) == -1) {
                    aOrphanedWords_byWordType.push(nextWord_slug)
                }
            }
        }

        grandChartHTML += "<div class=mainSchemaForConceptGraph_singleConceptContainer data-conceptnumber='"+c+"' >";

            grandChartHTML += "<div class='mainSchemaForConceptGraph_conceptID conceptDataBox' id='conceptDataBox_"+c+"' style=background-color:#EFEFEF; >";
            grandChartHTML += "<div class=singleWordContainer >";
            grandChartHTML += conceptSlug;
            grandChartHTML += "</div>";
            grandChartHTML += "</div>";

            grandChartHTML += "<div class=mainSchemaForConceptGraph_dataCell data-columnnumber='1' >";
            grandChartHTML += "<div class=singleWordContainer >";
            grandChartHTML += concept_slug;
            grandChartHTML += "</div>";
            grandChartHTML += "</div>";

            grandChartHTML += "<div class=mainSchemaForConceptGraph_dataCell data-columnnumber='2' >";
            grandChartHTML += "<div class=singleWordContainer >";
            grandChartHTML += schema_slug;
            grandChartHTML += "</div>";
            grandChartHTML += "</div>";

            grandChartHTML += "<div class=mainSchemaForConceptGraph_dataCell data-columnnumber='3' >";
            grandChartHTML += "<div class=singleWordContainer >";
            grandChartHTML += jsonSchema_slug;
            grandChartHTML += "</div>";
            grandChartHTML += "</div>";

            grandChartHTML += "<div class=mainSchemaForConceptGraph_dataCell data-columnnumber='4' >";
            grandChartHTML += "<div class=singleWordContainer >";
            grandChartHTML += wordType_slug;
            grandChartHTML += "</div>";
            grandChartHTML += "</div>";

            grandChartHTML += "<div class=mainSchemaForConceptGraph_dataCell data-columnnumber='5' >";
            grandChartHTML += "<div class=singleWordContainer >";
            grandChartHTML += superset_slug;
            grandChartHTML += "</div>";
            grandChartHTML += "</div>";

            grandChartHTML += "<div class=mainSchemaForConceptGraph_dataCell data-columnnumber='6' >";
            grandChartHTML += "<div class=singleWordContainer >";
            grandChartHTML += propertySchema_slug;
            grandChartHTML += "</div>";
            grandChartHTML += "</div>";

            grandChartHTML += "<div class=mainSchemaForConceptGraph_dataCell data-columnnumber='7' >";
            grandChartHTML += "<div class=singleWordContainer >";
            grandChartHTML += primaryProperty_slug;
            grandChartHTML += "</div>";
            grandChartHTML += "</div>";

            grandChartHTML += "<div class=mainSchemaForConceptGraph_dataCell data-columnnumber='8' >";
            grandChartHTML += "<div class=singleWordContainer >";
            grandChartHTML += properties_slug;
            grandChartHTML += "</div>";
            grandChartHTML += "</div>";

            grandChartHTML += "<div class=mainSchemaForConceptGraph_dataCell data-columnnumber='9' >";
            for (var a=0;a<aSubsets.length;a++) {
                var nextSubset_slug = aSubsets[a];
                grandChartHTML += "<div class=singleWordContainer >";
                grandChartHTML += nextSubset_slug;
                grandChartHTML += "</div>";
            }
            grandChartHTML += "</div>";

            grandChartHTML += "<div class=mainSchemaForConceptGraph_dataCell data-columnnumber='10' >";
            for (var a=0;a<aSpecificInstances.length;a++) {
                var nextSpecificInstance_slug = aSpecificInstances[a];
                grandChartHTML += "<div class=singleWordContainer >";
                grandChartHTML += nextSpecificInstance_slug;
                grandChartHTML += "</div>";
            }
            grandChartHTML += "</div>";

            grandChartHTML += "<div class=mainSchemaForConceptGraph_dataCell data-columnnumber='11'  >";
            for (var a=0;a<aOrphanedWords_byKey.length;a++) {
                var nextSpecificInstance_slug = aOrphanedWords_byKey[a];
                grandChartHTML += "<div class=singleWordContainer >";
                grandChartHTML += nextSpecificInstance_slug;
                grandChartHTML += "</div>";
            }
            grandChartHTML += "</div>";

            grandChartHTML += "<div class=mainSchemaForConceptGraph_dataCell data-columnnumber='12'  >";
            for (var a=0;a<aOrphanedWords_byWordType.length;a++) {
                var nextSpecificInstance_slug = aOrphanedWords_byWordType[a];
                grandChartHTML += "<div class=singleWordContainer >";
                grandChartHTML += nextSpecificInstance_slug;
                grandChartHTML += "</div>";
            }
            grandChartHTML += "</div>";

        grandChartHTML += "</div>";
    }

    jQuery("#grandChartContainer").html(grandChartHTML);
    jQuery(".mainSchemaForConceptGraph_dataCell").click(function(){
        jQuery("#clickedWordTextareaContainer").val("");
        var cellContent = jQuery(this).html();
        var conceptNumber = jQuery(this).parent().data("conceptnumber")
        var columnNumber = jQuery(this).data("columnnumber")
        jQuery(".conceptDataBox").css("backgroundColor","#EFEFEF")
        jQuery("#conceptDataBox_"+conceptNumber).css("backgroundColor","yellow")
        jQuery(".topPanelCell").css("backgroundColor","#EFEFEF")
        jQuery("#columnID_"+columnNumber).css("backgroundColor","yellow")
        jQuery("#cellContentContainer").html(cellContent)
        jQuery("#cellContentContainer div").click(function(){
            var clickedSlug = jQuery(this).html();
            // alert("clickedSlug: "+clickedSlug)
            var oClickedSlug = window.lookupWordBySlug[clickedSlug]
            var sClickedSlug = JSON.stringify(oClickedSlug,null,4)
            jQuery("#clickedWordTextareaContainer").val(sClickedSlug)
            jQuery("#cellContentContainer .singleWordContainer").css("backgroundColor","#EFEFEF")
            jQuery(this).css("backgroundColor","yellow")
        })
    })
}

export default class GrandChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        createGrandChart();
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" style={{backgroundColor:"#CFCFCF"}} >
                        <ConceptGraphMasthead />
                        <div class="h2" >Grand Chart for {window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>

                        <div id="grandChartContainer"></div>
                        <div>
                        * "orphaned" by virtue of the fact that this word has this concept's propertyPath as a top-level key, but is not listed in the array of specificInstances inside this concept's superset
                        <br/>
                        ** "orphaned" by virtue of the fact that this word has this concept listed in its array of wordTypes, but is not listed in the array of specificInstances inside this concept's superset
                        </div>
                        <br/>
                        <div id="cellContentContainer" style={{backgroundColor:"#EFEFEF",display:"inline-block",width:"500px",height:"700px",overflow:"scroll"}}></div>
                        <textarea id="clickedWordTextareaContainer" style={{width:"700px",height:"700px",display:"inline-block"}}></textarea>
                    </div>
                </fieldset>
            </>
        );
    }
}
