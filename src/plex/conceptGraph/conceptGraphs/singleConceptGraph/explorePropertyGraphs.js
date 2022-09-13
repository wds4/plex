import React from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import ConceptGraphMasthead from '../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/singleConceptGraph_leftNav2.js';
import ReactJSONSchemaForm from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import * as MiscFunctions from '../../../functions/miscFunctions.js';
import sendAsync from '../../../renderer.js';
import * as VisStyleConstants from '../../../lib/visjs/visjs-style';

const jQuery = require("jquery");

// An array of nodes
export var nodes = new DataSet([
    { id: 1, label: 'Node 1' },
    { id: 2, label: 'Node 2' },
    { id: 3, label: 'Node 3' },
    { id: 4, label: 'Node 4' },
    { id: 5, label: 'Node 5' }
]);

// An array of edges
export var edges = new DataSet([
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 }
]);

var options = VisStyleConstants.options_vis_propertyTree;

export var network = {};

var data = {
    nodes,
    edges
};

const createConceptSelector = () => {
    var conceptSelectorHTML = "";
    // conceptSelectorHTML += "<center>Concept Selector</center>";

    var conceptGraphMainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug;
    var oConceptGraphMainSchema = window.lookupWordBySlug[conceptGraphMainSchema_slug];
    var aConcepts = oConceptGraphMainSchema.conceptGraphData.concepts;

    for (var c=0;c < aConcepts.length; c++) {
        var concept_slug = aConcepts[c];
        var oConcept = window.lookupWordBySlug[concept_slug];
        var word_name = oConcept.wordData.name;
        var word_title = oConcept.wordData.title;
        var concept_name = oConcept.conceptData.name;
        conceptSelectorHTML += "<div class='conceptSelectorButton' data-wordtitle='"+word_title+"' data-slug='"+concept_slug+"' id='conceptSelectorButton_"+concept_slug+"' style='background-color:#EFEFEF' >";
        conceptSelectorHTML += word_title;
        conceptSelectorHTML += "</div>";
    }
    jQuery("#conceptSelectorContainer").html(conceptSelectorHTML)
    jQuery(".conceptSelectorButton").click(function(){
        var slug = jQuery(this).data("slug")
        jQuery("#selectedConceptSlugContainer").html(slug)
        jQuery(".conceptSelectorButton").css("backgroundColor","#EFEFEF")
        jQuery(this).css("backgroundColor","green")
        createSpecificInstanceSelector(slug);
        var oConcept = window.lookupWordBySlug[slug];
        var jsonSchema_slug = oConcept.conceptData.nodes.JSONSchema.slug;
        var oForm = {};
        renderForm(jsonSchema_slug,oForm);
        jQuery("#rawFile_whole_Container").val("")
        jQuery("#rawFile_abbr_Container").val("")
    })
}

const processSelectedSpecificInstance = (specificInstance_slug) => {
    var selectedConcept_slug = jQuery("#selectedConceptSlugContainer").html()
    var oConcept = window.lookupWordBySlug[selectedConcept_slug];
    var jsonSchema_slug = oConcept.conceptData.nodes.JSONSchema.slug;
    var oSelectedSpecificInstance = window.lookupWordBySlug[specificInstance_slug]
    renderForm(jsonSchema_slug,oSelectedSpecificInstance);

    var propertyPath = oConcept.conceptData.propertyPath;
    var oRawFile_abbr = {};
    oRawFile_abbr[propertyPath] = MiscFunctions.cloneObj(oSelectedSpecificInstance[propertyPath]);
    var sRawFile_abbr = JSON.stringify(oRawFile_abbr,null,4)
    var sSelectedSpecificInstance = JSON.stringify(oSelectedSpecificInstance,null,4);
    jQuery("#rawFile_whole_Container").val(sSelectedSpecificInstance)
    jQuery("#rawFile_abbr_Container").val(sRawFile_abbr)
}

const renderForm = (slug,oForm) => {
    var oWord = window.lookupWordBySlug[slug]
    var oSchema = {};
    if (oWord.hasOwnProperty("propertyData")) {
        oSchema = oWord.propertyData;
    }
    if (oWord.hasOwnProperty("JSONSchemaData")) {
        oSchema = oWord;
    }
    ReactDOM.render(<ReactJSONSchemaForm
      schema={oSchema}
      formData={oForm}
      />,
        document.getElementById("renderedFormElem")
    )
}

const createSpecificInstanceSelector = (selectedConcept_slug) => {
    var selectedConcept_title = jQuery("#conceptSelectorButton_"+selectedConcept_slug).data("wordtitle")
    var siSelectorHTML = "";
    // siSelectorHTML += "<center>Specific Instance Selector ";
    // siSelectorHTML += "for Concept: "+selectedConcept_title+"</center>";

    var oConcept = window.lookupWordBySlug[selectedConcept_slug];
    var superset_slug = oConcept.conceptData.nodes.superset.slug;
    var oSuperset = window.lookupWordBySlug[superset_slug];
    var aSpecificInstances = oSuperset.globalDynamicData.specificInstances;

    for (var s=0; s < aSpecificInstances.length; s ++) {
        var nextSpecificInstance_slug = aSpecificInstances[s];
        siSelectorHTML += "<div class='siSelectorButton' data-slug='"+nextSpecificInstance_slug+"' style='background-color:#EFEFEF' >";
        siSelectorHTML += nextSpecificInstance_slug;
        siSelectorHTML += "</div>";
    }

    jQuery("#specificInstanceContainer").html(siSelectorHTML)

    jQuery(".siSelectorButton").click(function(){
        var slug = jQuery(this).data("slug")
        jQuery(".siSelectorButton").css("backgroundColor","#EFEFEF")
        jQuery(this).css("backgroundColor","green")
        processSelectedSpecificInstance(slug);
    })
}

export default class ExplorePropertyGraphs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        createConceptSelector();

        // createSpecificInstanceSelector();

        jQuery(".siDisplaySelectorButton").click(function(){
            jQuery(".siDisplaySelectorButton").css("backgroundColor","#EFEFEF")
            jQuery(this).css("backgroundColor","green")

            var whichButton = jQuery(this).data("whichbutton");
            jQuery(".rightPanel_epg").css("display","none");
            if (whichButton=="showFormButton") {
                jQuery("#renderedFormElem").css("display","block")
            }
            if (whichButton=="showRawFile_whole_Button") {
                jQuery("#rawFile_whole_Container").css("display","block")
            }
            if (whichButton=="showRawFile_abbr_Button") {
                jQuery("#rawFile_abbr_Container").css("display","block")
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
                        <div class="h2" >Explore Property Graphs - {window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>

                        <div style={{display:"inline-block",width:"66%",height:"900px",border:"1px solid black"}} >
                            <div style={{display:"inline-block",width:"100%",height:"33%",border:"1px solid black"}} >
                                <div style={{display:"inline-block",width:"50%",height:"100%",border:"1px solid black"}} >
                                    <center>CONCEPT SELECTOR</center>
                                    <div id="selectedConceptSlugContainer" style={{display:"none"}}></div>
                                    <div id="conceptSelectorContainer" style={{height:"90%",overflow:"scroll"}}  ></div>
                                </div>

                                <div style={{display:"inline-block",width:"50%",height:"100%",border:"1px solid black"}} >
                                    <center>SPECIFIC INSTANCE SELECTOR</center>
                                    <div id="specificInstanceContainer" style={{height:"90%",overflow:"scroll"}}  ></div>
                                </div>
                            </div>

                            <div id="graphContainer" style={{display:"inline-block",width:"100%",height:"67%",border:"1px solid black"}} >
                            graph
                            </div>
                        </div>

                        <div style={{display:"inline-block",width:"33%",height:"900px",border:"1px solid black"}} >
                            <div style={{textAlign:"center",display:"inline-block",width:"100%",height:"50px",border:"1px solid black"}} >
                                s.i. display method:
                                <div id="showFormButton" data-whichbutton="showFormButton" className="doSomethingButton siDisplaySelectorButton" >Form</div>
                                <div id="showRawFile_whole_Button" data-whichbutton="showRawFile_whole_Button" className="doSomethingButton siDisplaySelectorButton" >rawFile (whole)</div>
                                <div id="showRawFile_abbr_Button" data-whichbutton="showRawFile_abbr_Button" className="doSomethingButton siDisplaySelectorButton" >rawFile (abbr.)</div>
                            </div>

                            <div style={{display:"inline-block",width:"100%",height:"850px",border:"1px solid black",overflow:"scroll"}} >
                                <div id="renderedFormElem" className="rightPanel_epg" style={{height:"97%",overflow:"scroll"}} >JSONSchemaFormContainer</div>
                                <textarea id="rawFile_whole_Container" className="rightPanel_epg" style={{height:"97%",width:"100%",overflow:"scroll",display:"none"}} >rawFile_whole_Container</textarea>
                                <textarea id="rawFile_abbr_Container" className="rightPanel_epg" style={{height:"97%",width:"100%",overflow:"scroll",display:"none"}} >rawFile_abbr_Container</textarea>
                            </div>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
