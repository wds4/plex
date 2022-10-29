import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleConceptGraph_concepts_leftNav2.js';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");
// jQuery.DataTable = require("datatables.net");

export default class MakeNewConcept extends React.Component {
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

        jQuery("#makeNewRawFileButton").click(async function(){
            console.log("makeNewRawFileButton")
            var newConceptSlugSingular = jQuery("#newConceptSlugSingularField").val();
            var newConceptSlugPlural = jQuery("#newConceptSlugPluralField").val();
            var newConceptTitleSingular = jQuery("#newConceptTitleSingularField").val();
            var newConceptTitlePlural = jQuery("#newConceptTitlePluralField").val();
            var newConceptNameSingular = jQuery("#newConceptNameSingularField").val();
            var newConceptNamePlural = jQuery("#newConceptNamePluralField").val();
            var newConceptDescription = jQuery("#newConceptDescriptionField").val();
            var oConcept = await MiscFunctions.createNewWordByTemplate("concept");
            oConcept.wordData.slug = "conceptFor_"+newConceptSlugSingular;
            oConcept.wordData.name = "concept for "+newConceptNameSingular;
            oConcept.wordData.title = "Concept for "+newConceptTitleSingular;
            oConcept.wordData.description = newConceptDescription;
            oConcept.wordData.governingConcepts = [ "conceptFor_"+newConceptSlugSingular ];
            oConcept.conceptData.slug = newConceptSlugSingular;
            oConcept.conceptData.title = newConceptTitleSingular;
            oConcept.conceptData.name.singular = newConceptNameSingular;
            oConcept.conceptData.name.plural = newConceptNamePlural;

            oConcept.conceptData.oSlug.singular = newConceptSlugSingular;
            oConcept.conceptData.oSlug.plural = newConceptSlugPlural;
            oConcept.conceptData.oName.singular = newConceptNameSingular;
            oConcept.conceptData.oName.plural = newConceptNamePlural;
            oConcept.conceptData.oTitle.singular = newConceptTitleSingular;
            oConcept.conceptData.oTitle.plural = newConceptTitlePlural;

            oConcept.conceptData.description = newConceptDescription;
            oConcept.conceptData.propertyPath = newConceptSlugSingular+"Data";
            var sConcept = JSON.stringify(oConcept,null,4);
            jQuery("#newConceptRawFileField").val(sConcept);
        })
        jQuery("#saveThisRawFileButton").click(async function(){
            console.log("saveThisRawFileButton")
            var sConcept = jQuery("#newConceptRawFileField").val();
            var oConcept = JSON.parse(sConcept)
            MiscFunctions.createOrUpdateWordInAllTables(oConcept)
        })
        jQuery("#makeNewConceptButton").click(async function(){
            console.log("makeNewConceptButton")

            // step 1
            console.log("makeNewRawFileButton")
            var newConceptSlugSingular = jQuery("#newConceptSlugSingularField").val();
            var newConceptSlugPlural = jQuery("#newConceptSlugPluralField").val();
            var newConceptTitleSingular = jQuery("#newConceptTitleSingularField").val();
            var newConceptTitlePlural = jQuery("#newConceptTitlePluralField").val();
            var newConceptNameSingular = jQuery("#newConceptNameSingularField").val();
            var newConceptNamePlural = jQuery("#newConceptNamePluralField").val();
            var newConceptDescription = jQuery("#newConceptDescriptionField").val();
            var oConcept = await MiscFunctions.createNewWordByTemplate("concept");
            oConcept.wordData.slug = "conceptFor_"+newConceptSlugSingular;
            oConcept.wordData.name = "concept for "+newConceptNameSingular;
            oConcept.wordData.title = "Concept for "+newConceptTitleSingular;
            oConcept.wordData.description = newConceptDescription;
            oConcept.wordData.governingConcepts = [ "conceptFor_"+newConceptSlugSingular ];
            oConcept.conceptData.slug = newConceptSlugSingular;
            oConcept.conceptData.title = newConceptTitleSingular;
            oConcept.conceptData.name.singular = newConceptNameSingular;
            oConcept.conceptData.name.plural = newConceptNamePlural;

            oConcept.conceptData.oSlug.singular = newConceptSlugSingular;
            oConcept.conceptData.oSlug.plural = newConceptSlugPlural;
            oConcept.conceptData.oName.singular = newConceptNameSingular;
            oConcept.conceptData.oName.plural = newConceptNamePlural;
            oConcept.conceptData.oTitle.singular = newConceptTitleSingular;
            oConcept.conceptData.oTitle.plural = newConceptTitlePlural;

            oConcept.conceptData.description = newConceptDescription;
            oConcept.conceptData.propertyPath = newConceptSlugSingular+"Data";
            var sConcept = JSON.stringify(oConcept,null,4);
            jQuery("#newConceptRawFileField").val(sConcept);

            // step 2
            // console.log("saveThisRawFileButton")
            // var sConcept = jQuery("#newConceptRawFileField").val();
            // var oConcept = JSON.parse(sConcept)
            MiscFunctions.createOrUpdateWordInAllTables(oConcept)

        })
        jQuery("#newConceptNameSingularField").change(function(){
            var newConceptNameSingular = jQuery("#newConceptNameSingularField").val()
            // console.log("newConceptNameSingular: "+newConceptNameSingular)

            var aSingularChunks = newConceptNameSingular.split(" ");
            // title
            var newConceptAutoTitle = "";
            for (var c=0;c<aSingularChunks.length;c++) {
                var nextChunk = aSingularChunks[c];
                if (nextChunk) {
                    nextChunk = nextChunk[0].toUpperCase() + nextChunk.substring(1)
                    newConceptAutoTitle += nextChunk;
                    if (c < aSingularChunks.length - 1) {
                        newConceptAutoTitle += " ";
                    }
                }
            }
            // var autoTitle = newConceptNameSingular[0].toUpperCase() + newConceptNameSingular.substring(1)
            jQuery("#newConceptTitleSingularField").val(newConceptAutoTitle)

            // slug
            var newConceptAutoSlug = "";
            for (var c=0;c<aSingularChunks.length;c++) {
                var nextChunk = aSingularChunks[c];
                if (nextChunk) {
                    if (c > 0) {
                        nextChunk = nextChunk[0].toUpperCase() + nextChunk.substring(1)
                    }
                    newConceptAutoSlug += nextChunk;
                }
            }
            jQuery("#newConceptSlugSingularField").val(newConceptAutoSlug)
        })
        jQuery("#newConceptNamePluralField").change(function(){
            var newConceptNamePlural = jQuery("#newConceptNamePluralField").val()
            // console.log("newConceptNamePlural: "+newConceptNamePlural)

            var aPluralChunks = newConceptNamePlural.split(" ");
            // title
            var newConceptAutoTitle = "";
            for (var c=0;c<aPluralChunks.length;c++) {
                var nextChunk = aPluralChunks[c];
                if (nextChunk) {
                    nextChunk = nextChunk[0].toUpperCase() + nextChunk.substring(1)
                    newConceptAutoTitle += nextChunk;
                    if (c < aPluralChunks.length - 1) {
                        newConceptAutoTitle += " ";
                    }
                }
            }
            // var autoTitle = newConceptNamePlural[0].toUpperCase() + newConceptNamePlural.substring(1)
            jQuery("#newConceptTitlePluralField").val(newConceptAutoTitle)

            // slug
            var newConceptAutoSlug = "";
            for (var c=0;c<aPluralChunks.length;c++) {
                var nextChunk = aPluralChunks[c];
                if (nextChunk) {
                    if (c > 0) {
                        nextChunk = nextChunk[0].toUpperCase() + nextChunk.substring(1)
                    }
                    newConceptAutoSlug += nextChunk;
                }
            }
            jQuery("#newConceptSlugPluralField").val(newConceptAutoSlug)
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
                        <div class="h2">Make New Concept</div>
                        <div id="allInputFieldsContainer" style={{marginTop:"20px"}} >

                            <div className="makeNewLeftPanel" >name (singular)</div>
                            <textarea id="newConceptNameSingularField" className="makeNewRightPanel">
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel" >name (plural)</div>
                            <textarea id="newConceptNamePluralField" className="makeNewRightPanel">
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel" >title (singular)</div>
                            <textarea id="newConceptTitleSingularField" className="makeNewRightPanel" style={{backgroundColor:"#CFCFCF"}} >
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel" >title (plural)</div>
                            <textarea id="newConceptTitlePluralField" className="makeNewRightPanel" style={{backgroundColor:"#CFCFCF"}} >
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel" >slug (singular)</div>
                            <textarea id="newConceptSlugSingularField" className="makeNewRightPanel" style={{backgroundColor:"#CFCFCF"}} >
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel" >slug (plural)</div>
                            <textarea id="newConceptSlugPluralField" className="makeNewRightPanel" style={{backgroundColor:"#CFCFCF"}} >
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel" >description</div>
                            <textarea id="newConceptDescriptionField" className="makeNewRightPanel" style={{height:"50px"}}>
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel" >rawFile</div>
                            <textarea id="newConceptRawFileField" className="makeNewRightPanel" style={{height:"500px"}}>
                            </textarea>

                            <br/>

                            <div id="makeNewRawFileButton" className="doSomethingButton" style={{marginLeft:"320px"}}>make new rawFile (step 1)</div>
                            <br/>
                            <div id="saveThisRawFileButton" className="doSomethingButton" style={{marginLeft:"320px"}}>save this rawFile (step 2)</div>
                            <br/>
                            <div id="makeNewConceptButton" className="doSomethingButton" style={{marginLeft:"320px"}}>make new Concept (steps 1 + 2)</div>

                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
