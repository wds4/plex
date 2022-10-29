import React from "react";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/singleConcept_sets_leftNav2.js';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery"); 

const saveNewSet = async () => {
    console.log("saveNewSet")
    var sNewWord = jQuery("#setTextarea_edited").val()
    var oNewWord = JSON.parse(sNewWord)

    var sSchema = jQuery("#schemaTextarea_edited").val()
    var oSchema = JSON.parse(sSchema)

    MiscFunctions.createOrUpdateWordInAllTables(oNewWord)
    MiscFunctions.createOrUpdateWordInAllTables(oSchema)
}

const makeSubsetOfSelector = (oConcept) => {
    var selectorPanelHTML = "";

    var supersetSlug = oConcept.conceptData.nodes.superset.slug;
    var oSuperset = window.lookupWordBySlug[supersetSlug];
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
    jQuery("#newSetSubsetOfSelectorContainer").html(selectorPanelHTML)
}

const updateSetRawFile = () => {
    console.log("updateSetRawFile")
    var conceptSlug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;

    var newSetSlug = jQuery("#newSetSlugField").val();
    var newSetTitle = jQuery("#newSetTitleField").val();
    var newSetName = jQuery("#newSetNameField").val();
    var newSetDescription = jQuery("#newSetDescriptionField").val();

    var sNewWord = jQuery("#setTextarea_unedited").val()
    var oNewWord = JSON.parse(sNewWord);
    if (newSetSlug) {
        oNewWord.wordData.slug = newSetSlug;
        oNewWord.setData.slug = newSetSlug;
    }
    oNewWord.wordData.title = newSetTitle;
    oNewWord.wordData.name = newSetName;
    oNewWord.wordData.description = newSetDescription;

    oNewWord.setData.title = newSetTitle;
    oNewWord.setData.name = newSetName;
    oNewWord.setData.description = newSetDescription;
    if (oNewWord.setData.metaData.hasOwnProperty("governingConcept")) {
        oNewWord.setData.metaData.governingConcept.slug = conceptSlug;
    }
    if (oNewWord.setData.metaData.hasOwnProperty("governingConcepts")) {
        oNewWord.setData.metaData.governingConcepts.push(conceptSlug);
    }
    var sNewWordUpdated = JSON.stringify(oNewWord,null,4);
    jQuery("#setTextarea_edited").val(sNewWordUpdated)
}

const updateMainSchemaRawFile = () => {
    console.log("updateMainSchemaRawFile")
    var sNewSet = jQuery("#setTextarea_edited").val()
    var oNewSet = JSON.parse(sNewSet);
    var oNewSet_slug = oNewSet.wordData.slug;

    var sSchemaUnedited = jQuery("#schemaTextarea_unedited").val()
    var oSchema = JSON.parse(sSchemaUnedited);
    console.log("updateMainSchemaRawFile b")
    // oSchema.wordData.a="b";
    // get list of existingSet that this will be a direct subset of
    var oExpandedLookup = MiscFunctions.cloneObj(window.lookupWordBySlug)
    oExpandedLookup[oNewSet_slug] = oNewSet;
    jQuery(".subsetOfCheckbox:checked").each(function(){
        var existingSet_slug = jQuery(this).data("slug")
        console.log("subsetOfCheckbox checked; existingSet_slug: "+existingSet_slug)
        var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
        oNextRel.nodeFrom.slug = oNewSet_slug;
        oNextRel.relationshipType.slug = "subsetOf";
        oNextRel.nodeTo.slug = existingSet_slug;
        oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oNextRel,oExpandedLookup)
    })
    // for each existingSet, make relationship: newSet - subsetOf - existingSet and add this rel to oSchema
    // then update schemaTextarea_edited

    var sSchemaEdited = JSON.stringify(oSchema,null,4);
    jQuery("#schemaTextarea_edited").val(sSchemaEdited)
    console.log("updateMainSchemaRawFile z")
}

export default class MakeNewSet extends React.Component {
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
        jQuery("#saveNewSetButton").click(function(){
            saveNewSet();
        })

        var oNewWord = await MiscFunctions.createNewWordByTemplate("set");
        oNewWord.setData.slug = oNewWord.wordData.slug;
        var sNewWord = JSON.stringify(oNewWord,null,4);
        jQuery("#setTextarea_unedited").val(sNewWord)
        updateSetRawFile();
        updateMainSchemaRawFile();
        jQuery("#newSetFieldsContainer").change(function(){
            console.log("newSetFieldsContainer clicked")
            updateSetRawFile();
            updateMainSchemaRawFile();
        })
        jQuery("#newSetSubsetOfSelectorContainer").change(function(){
            console.log("newSetSubsetOfSelectorContainer clicked")
            updateSetRawFile();
            updateMainSchemaRawFile();
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
                        <div class="h2">Make New Set</div>

                        <div className="standardDoubleColumn" style={{border:"1px dashed black",fontSize:"16px"}}>
                            <div id="newSetFieldsContainer" >
                                <div className="singleItemContainer" >
                                    <div className="leftColumnLeftPanelB" >
                                        slug
                                    </div>
                                    <textarea id="newSetSlugField" className="leftColumnRightPanelTextarea">
                                    </textarea>widgetsFromNewYork
                                </div>

                                <div className="singleItemContainer" >
                                    <div className="leftColumnLeftPanelB" >
                                        title
                                    </div>
                                    <textarea id="newSetTitleField" className="leftColumnRightPanelTextarea">
                                    </textarea>Widgets from New York
                                </div>

                                <div className="singleItemContainer" >
                                    <div className="leftColumnLeftPanelB" >
                                        name
                                    </div>
                                    <textarea id="newSetNameField" className="leftColumnRightPanelTextarea">
                                    </textarea>widgets from New York
                                </div>

                                <div className="singleItemContainer" >
                                    <div className="leftColumnLeftPanelB" >
                                        description
                                    </div>
                                    <textarea id="newSetDescriptionField" className="leftColumnRightPanelTextarea" style={{height:"50px"}} >
                                    </textarea>lorem ipsum
                                </div>
                            </div>

                            <div id="saveNewSetButton" className="doSomethingButton" style={{marginLeft:"130px"}}>save new Set in SQL</div>

                            <br/>
                            initial unedited:<br/>
                            <textarea id="setTextarea_unedited" style={{width:"600px",height:"300px"}}></textarea>
                            <br/>
                            edited:<br/>
                            <textarea id="setTextarea_edited" style={{width:"600px",height:"300px"}}></textarea>
                        </div>

                        <div className="standardDoubleColumn" style={{border:"1px dashed black"}}>
                            <div className="makeNewLeftPanel">
                            direct subset of:
                            </div>
                            <br/>
                            <div id="newSetSubsetOfSelectorContainer" style={{display:"inline-block",marginLeft:"20px"}}>
                            </div>

                            <br/>

                            <div id="updateSetRelationshipsButton" className="doSomethingButton" style={{marginLeft:"20px"}}>update relationships of this Set</div>

                            <br/>
                            schema, unedited:<br/>
                            <textarea id="schemaTextarea_unedited" style={{width:"600px",height:"300px"}}>schemaTextarea_unedited</textarea>
                            <br/>
                            schema, edited:<br/>
                            <textarea id="schemaTextarea_edited" style={{width:"600px",height:"300px"}}>schemaTextarea_edited</textarea>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
