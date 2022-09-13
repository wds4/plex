import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleConceptGraph_concepts_leftNav2.js';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

var aSchemas = [];
var aConcepts = [];

const loadSelectedWord = (selectedWord_slug) => {
    var oWord = window.lookupWordBySlug[selectedWord_slug];
    var sWord = JSON.stringify(oWord,null,4)
    jQuery("#singleWordRawfileTextarea").val(sWord)

    jQuery("#selectedSlugContainer").html(selectedWord_slug)
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

const editNewConcept = () => {
    console.log("editNewConcept")
    var sNewConcept = jQuery("#newConceptRawFileField").val();
    var oNewConcept = JSON.parse(sNewConcept)
    var oNewConcept_edited = MiscFunctions.cloneObj(oNewConcept);

    var newConceptSingular = jQuery("#newConceptSingularField").val();
    var newConceptPlural = jQuery("#newConceptPluralField").val();
    var newConceptDescription = jQuery("#newConceptDescriptionField").val();

    var newRole = jQuery("#newRoleSelector option:selected").val();
    var sExistingWordRawfile = jQuery("#singleWordRawfileTextarea").val();
    var oExistingWord = JSON.parse(sExistingWordRawfile);
    var existingWord_slug = oExistingWord.wordData.slug;
    var existingWord_ipns = oExistingWord.metaData.ipns;

    var newConcept_ipns = oNewConcept.metaData.ipns;
    var newConcept_wordSlug = "conceptFor_"+newConceptSingular+"_"+newConcept_ipns.substr(-6);

    oNewConcept_edited.wordData.slug = newConcept_wordSlug
    oNewConcept_edited.wordData.name = "concept for "+newConceptSingular;
    oNewConcept_edited.wordData.title = "Concept for "+newConceptSingular;
    oNewConcept_edited.wordData.description = newConceptDescription;
    oNewConcept_edited.wordData.governingConcepts = [ "conceptFor_"+newConceptSingular ];
    oNewConcept_edited.conceptData.name.singular = newConceptSingular;
    oNewConcept_edited.conceptData.name.plural = newConceptPlural;
    oNewConcept_edited.conceptData.description = newConceptDescription;
    oNewConcept_edited.conceptData.propertyPath = newConceptSingular+"Data";

    oNewConcept_edited.conceptData.nodes.concept.slug = newConcept_wordSlug;
    oNewConcept_edited.conceptData.nodes.concept.ipns = newConcept_ipns;

    oNewConcept_edited.conceptData.nodes[newRole].slug = existingWord_slug;
    oNewConcept_edited.conceptData.nodes[newRole].ipns = existingWord_ipns;

    var sNewConcept_edited = JSON.stringify(oNewConcept_edited,null,4)
    jQuery("#newConceptRawFileEditedField").val(sNewConcept_edited);
}

const editSelectedSlug = () => {
    var sSelectedWordRawFile = jQuery("#singleWordRawfileTextarea").val();
    var oSelectedWordRawFile = JSON.parse(sSelectedWordRawFile)
    var oSelectedWordRawFile_edited = MiscFunctions.cloneObj(oSelectedWordRawFile);


    var newConceptSingular = jQuery("#newConceptSingularField").val();
    var newConceptPlural = jQuery("#newConceptPluralField").val();

    var sNewConcept = jQuery("#newConceptRawFileField").val();
    var oNewConcept = JSON.parse(sNewConcept)
    var newConcept_ipns = oNewConcept.metaData.ipns;

    var newConcept_wordSlug = "conceptFor_"+newConceptSingular+"_"+newConcept_ipns.substr(-6);

    var newRole = jQuery("#newRoleSelector option:selected").val();

    if (newRole=="wordType") {
        oSelectedWordRawFile_edited.wordTypeData = {};
        oSelectedWordRawFile_edited.wordTypeData.slug = newConceptSingular;
        oSelectedWordRawFile_edited.wordTypeData.name = newConceptSingular;
        oSelectedWordRawFile_edited.wordTypeData.title = newConceptSingular.substr(0,1).toUpperCase()+newConceptSingular.substr(1);
        oSelectedWordRawFile_edited.wordTypeData.metaData = {};
        oSelectedWordRawFile_edited.wordTypeData.metaData.governingConcept = {};
        oSelectedWordRawFile_edited.wordTypeData.metaData.governingConcept.slug = newConcept_wordSlug;

        oSelectedWordRawFile_edited.wordData.wordType = "wordType";
        if (!oSelectedWordRawFile_edited.wordData.wordTypes.includes("wordType")) {
            oSelectedWordRawFile_edited.wordData.wordTypes.push("wordType")
        }
    }

    if (newRole=="superset") {
        oSelectedWordRawFile_edited.supersetData = {};
        oSelectedWordRawFile_edited.supersetData.slug = newConceptPlural;
        oSelectedWordRawFile_edited.supersetData.name = newConceptPlural;
        oSelectedWordRawFile_edited.supersetData.title = newConceptPlural.substr(0,1).toUpperCase()+newConceptPlural.substr(1);
        oSelectedWordRawFile_edited.supersetData.metaData = {};
        oSelectedWordRawFile_edited.supersetData.metaData.governingConcept = {};
        oSelectedWordRawFile_edited.supersetData.metaData.governingConcept.slug = newConcept_wordSlug;

        oSelectedWordRawFile_edited.wordData.wordType = "superset";
        if (!oSelectedWordRawFile_edited.wordData.wordTypes.includes("superset")) {
            oSelectedWordRawFile_edited.wordData.wordTypes.push("superset")
        }
    }

    var aTopLevelProperties = ["wordData","wordTypeData","supersetData","_REMAINDER_","globalDynamicData","metaData"];
    oSelectedWordRawFile_edited = MiscFunctions.reorderTopLevelProperties(oSelectedWordRawFile_edited,aTopLevelProperties)

    var oSelectedWordRawFile_edited = JSON.stringify(oSelectedWordRawFile_edited,null,4)

    jQuery("#singleWordEditedRawfileTextarea").val(oSelectedWordRawFile_edited);

}

const editBothWords = () => {
    editNewConcept();
    editSelectedSlug();
}

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

        jQuery("#makeNewRawFileButton").click(async function(){
            console.log("makeNewRawFileButton")
            // var newConceptSingular = jQuery("#newConceptSingularField").val();
            // var newConceptPlural = jQuery("#newConceptPluralField").val();
            // var newConceptDescription = jQuery("#newConceptDescriptionField").val();
            var oConcept = await MiscFunctions.createNewWordByTemplate("concept");
            /*
            oConcept.wordData.slug = "conceptFor_"+newConceptSingular;
            oConcept.wordData.name = "concept for "+newConceptSingular;
            oConcept.wordData.title = "Concept for "+newConceptSingular;
            oConcept.wordData.description = newConceptDescription;
            oConcept.wordData.governingConcepts = [ "conceptFor_"+newConceptSingular ];
            oConcept.conceptData.name.singular = newConceptSingular;
            oConcept.conceptData.name.plural = newConceptPlural;
            oConcept.conceptData.description = newConceptDescription;
            oConcept.conceptData.propertyPath = newConceptSingular+"Data";
            */
            var sConcept = JSON.stringify(oConcept,null,4);
            jQuery("#newConceptRawFileField").val(sConcept);

            editBothWords()
        })
        jQuery("#saveThisRawFileAndUpdateWordButton").click(async function(){
            console.log("saveThisRawFileAndUpdateWordButton")
            var sConcept = jQuery("#newConceptRawFileEditedField").val();
            var oConcept = JSON.parse(sConcept)
            console.log("sConcept: "+sConcept)
            MiscFunctions.createOrUpdateWordInAllTables(oConcept)
            var sUpdatedWord = jQuery("#singleWordEditedRawfileTextarea").val();
            var oUpdatedWord = JSON.parse(sUpdatedWord)
            console.log("sUpdatedWord: "+sUpdatedWord)
            MiscFunctions.createOrUpdateWordInAllTables(oUpdatedWord)
        })
        jQuery(".newConceptOptionField").change(function(){
            editBothWords();
        })
        jQuery("#newRoleSelector").change(function(){
            editBothWords();
        })
        jQuery("#singleWordRawfileTextarea").change(function(){
            editBothWords();
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
                        <div class="h2">Expand Existing Word into New Concept</div>
                        <div id="allInputFieldsContainer" style={{marginTop:"20px"}} >
                            <div style={{display:"inline-block",width:"600px"}}>
                                <center>Existing Word</center>
                                <center><div id="selectedSlugContainer" style={{fontSize:"18px",backgroundColor:"orange"}}></div></center>
                                Type slug here:<br/>
                                <textarea id="slugEntryField" style={{width:"400px",height:"30px"}}></textarea>
                                <br/>
                                <div id="singleWordDynamicSelectorContainer" style={{backgroundColor:"#DFDFDF",fontSize:"14px",width:"400px",height:"200px",overflow:"scroll"}}></div>
                                <br/>
                                <div id="singleWordSelectorContainer"></div>

                                new role of existing word:
                                <select id="newRoleSelector" >
                                    <option value="wordType" >wordType</option>
                                    <option value="superset" >superset</option>
                                </select>

                                <br/>

                                Selected slug's rawFile:<br/>
                                <textarea id="singleWordRawfileTextarea" style={{width:"100%",height:"200px"}}></textarea>

                                <br/>

                                Selected slug's rawFile, edited:<br/>
                                <textarea id="singleWordEditedRawfileTextarea" style={{width:"100%",height:"200px"}}></textarea>
                            </div>

                            <div style={{display:"inline-block",width:"800px"}}>
                                <center>New Concept</center>

                                <br/>

                                <div className="makeNewLeftPanelB" >singular</div>
                                <textarea id="newConceptSingularField" className="newConceptOptionField makeNewRightPanel">
                                </textarea>

                                <br/>

                                <div className="makeNewLeftPanelB" >plural</div>
                                <textarea id="newConceptPluralField" className="newConceptOptionField makeNewRightPanel">
                                </textarea>

                                <br/>

                                <div className="makeNewLeftPanelB" >description</div>
                                <textarea id="newConceptDescriptionField" className="newConceptOptionField makeNewRightPanel" style={{height:"50px"}}>
                                </textarea>

                                <br/>

                                <div className="makeNewLeftPanelB" >rawFile</div>
                                <textarea id="newConceptRawFileField" className="makeNewRightPanel" style={{height:"200px"}}>
                                </textarea>

                                <br/>

                                <div className="makeNewLeftPanelB" >edited rawFile</div>
                                <textarea id="newConceptRawFileEditedField" className="makeNewRightPanel" style={{height:"400px"}}>
                                </textarea>

                                <br/>

                                <div id="makeNewRawFileButton" className="doSomethingButton" style={{marginLeft:"170px"}}>make new rawFile (step 1)</div>
                                <br/>
                                <div id="saveThisRawFileAndUpdateWordButton" className="doSomethingButton" style={{marginLeft:"170px"}}>save this rawFile (above) and update word (left) (step 2)</div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
