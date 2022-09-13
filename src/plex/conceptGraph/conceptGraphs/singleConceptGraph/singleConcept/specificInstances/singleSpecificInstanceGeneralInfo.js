import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/singleConcept_specificInstances_leftNav2.js';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import ReactJSONSchemaForm from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");

const uiSchema = {
    address: { 'ui:widget': 'hidden' },
}

const makeSubsetOfSelector = (oConcept,thisSpecificInstance_slug) => {
    var schema_slug = oConcept.conceptData.nodes.schema.slug;
    var oSchema = window.lookupWordBySlug[schema_slug];
    var aRels = oSchema.schemaData.relationships;

    var selectorPanelHTML = "";

    var supersetSlug = oConcept.conceptData.nodes.superset.slug;
    var oSuperset = window.lookupWordBySlug[supersetSlug];

    var oTestRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
    oTestRel.nodeFrom.slug = thisSpecificInstance_slug;
    oTestRel.relationshipType.slug = "isASpecificInstanceOf";
    oTestRel.nodeTo.slug = supersetSlug;

    var bDoesRelExist = MiscFunctions.isRelObjInArrayOfObj(oTestRel,aRels)

    selectorPanelHTML += "<input class=subsetOfCheckbox data-slug='"+supersetSlug+"' id='specificInstanceOfCheckbox_"+nextSet+"' type=checkbox ";
    if (bDoesRelExist) { selectorPanelHTML += " checked "; }
    selectorPanelHTML += " name=setCheckbox ></input> ";
    selectorPanelHTML += supersetSlug;
    selectorPanelHTML += "<br>";

    var aSets = oSuperset.globalDynamicData.subsets
    var numSets = aSets.length;
    for (var s=0;s<numSets;s++) {
        var nextSet = aSets[s];

        var oTestRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
        oTestRel.nodeFrom.slug = thisSpecificInstance_slug;
        oTestRel.relationshipType.slug = "isASpecificInstanceOf";
        oTestRel.nodeTo.slug = nextSet;

        var bDoesRelExist = MiscFunctions.isRelObjInArrayOfObj(oTestRel,aRels)

        selectorPanelHTML += "<input class=subsetOfCheckbox data-slug='"+nextSet+"' id='specificInstanceOfCheckbox_"+nextSet+"' type=checkbox ";
        if (bDoesRelExist) { selectorPanelHTML += " checked "; }
        selectorPanelHTML += " name=setCheckbox ></input> ";
        selectorPanelHTML += nextSet;
        selectorPanelHTML += "<br>";
    }
    jQuery("#newSetSubsetOfSelectorContainer").html(selectorPanelHTML)
}

const onFormSubmit = ({formData}, e) => {
    var sFormData = JSON.stringify(formData,null,4);
    console.log("sFormData: "+sFormData)
    var oUpdatedSpecificInstance = JSON.parse(sFormData);
    var sSpecificInstance_unedited = jQuery("#specificInstanceTextarea_unedited").val();
    var oSpecificInstance_unedited = JSON.parse(sSpecificInstance_unedited);

    var sConcept_slug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug
    var oConcept = window.lookupWordBySlug[sConcept_slug]
    var propertyPath = oConcept.conceptData.propertyPath;
    var singular = oConcept.conceptData.name.singular;

    oUpdatedSpecificInstance = MiscFunctions.extendWithOrdering(oSpecificInstance_unedited,oUpdatedSpecificInstance);
    var sUpdatedSpecificInstance = JSON.stringify(oUpdatedSpecificInstance,null,4);
    console.log("sUpdatedSpecificInstance: "+sUpdatedSpecificInstance)
    MiscFunctions.createOrUpdateWordInAllTables(oUpdatedSpecificInstance)
    /*
    // reorder top level properties
    var conceptSlug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;
    var oConcept = window.lookupWordBySlug[conceptSlug]
    var wordTypeName = oConcept.conceptData.name.singular;
    console.log("conceptSlug: "+conceptSlug+"; wordTypeName: "+wordTypeName)
    oWordToUpdate.wordData.wordTypes = MiscFunctions.pushIfNotAlreadyThere(oWordToUpdate.wordData.wordTypes,wordTypeName);
    var propertyPath = oConcept.conceptData.propertyPath;
    var aTopLevelProperties = ["wordData",propertyPath,"_REMAINDER_","globalDynamicData","metaData"]
    oWordToUpdate = MiscFunctions.reorderTopLevelProperties(oWordToUpdate,aTopLevelProperties)
    var sWordToUpdate = JSON.stringify(oWordToUpdate,null,4);
    console.log("sWordToUpdate: "+sWordToUpdate)
    // MiscFunctions.createOrUpdateWordInAllTables(oWordToUpdate)
    */

}

const onFormChange = ({formData}, e) => {
    var sSpecificInstance_unedited = jQuery("#specificInstanceTextarea_unedited").val();

    if (sSpecificInstance_unedited) {

    }
}

export default class SingleSpecificInstance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var specificInstance_slug = this.props.match.params.slug
        var oSpecificInstance = window.lookupWordBySlug[specificInstance_slug]
        var sSpecificInstance = JSON.stringify(oSpecificInstance,null,4)
        jQuery("#specificInstanceTextarea_unedited").val(sSpecificInstance)

        var conceptSlug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;
        var oConcept = window.lookupWordBySlug[conceptSlug]

        var schema_slug = oConcept.conceptData.nodes.schema.slug;
        var oSchema = window.lookupWordBySlug[schema_slug]
        var sSchema = JSON.stringify(oSchema,null,4)
        jQuery("#schemaTextarea").val(sSchema);

        makeSubsetOfSelector(oConcept,specificInstance_slug)

        jQuery("#updateSchemaToPanelButton").click(function(){
            var sSchema = jQuery("#schemaTextarea").val()
            var oSchema = JSON.parse(sSchema)

            // first, remove all isASpecificInstanceOf rels involving the present specific instance
            var aRels = oSchema.schemaData.relationships;
            var aRels_updated = [];
            for (var a=0;a<aRels.length;a++) {
                var oNextRel = aRels[a];
                var nodeFrom_slug = oNextRel.nodeFrom.slug;
                var rT_slug = oNextRel.relationshipType.slug;
                if (rT_slug != "isASpecificInstanceOf") {
                    aRels_updated.push(oNextRel);
                }
                if (rT_slug == "isASpecificInstanceOf") {
                    if (nodeFrom_slug != specificInstance_slug) {
                        aRels_updated.push(oNextRel);
                    }
                }
            }

            // next, add back all isASpecificInstanceOf rels based upon selected checkboxes above

            jQuery(".subsetOfCheckbox:checked").each(function(){
                var existingSet_slug = jQuery(this).data("slug")
                console.log("subsetOfCheckbox checked; existingSet_slug: "+existingSet_slug)
                var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                oNextRel.nodeFrom.slug = specificInstance_slug;
                oNextRel.relationshipType.slug = "isASpecificInstanceOf";
                oNextRel.nodeTo.slug = existingSet_slug;
                aRels_updated.push(oNextRel)
                // oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oNextRel,window.lookupWordBySlug)
            })

            // finally, update the textarea
            oSchema.schemaData.relationships = aRels_updated;
            var sSchema_updated = JSON.stringify(oSchema,null,4);
            jQuery("#schemaTextarea").val(sSchema_updated)

        })

        jQuery("#updateSchemaToSqlButton").click(function(){
            var sSchema = jQuery("#schemaTextarea").val()
            var oSchema = JSON.parse(sSchema)
            console.log("sSchema: "+sSchema)
            MiscFunctions.createOrUpdateWordInAllTables(oSchema)
        })
    }
    render() {
        var specificInstance_slug = this.props.match.params.slug
        var oSpecificInstance = window.lookupWordBySlug[specificInstance_slug]
        var currentConcept_slug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;
        var oConcept = window.lookupWordBySlug[currentConcept_slug];
        var jsonSchema_slug = oConcept.conceptData.nodes.JSONSchema.slug;
        var oJSONSchema = window.lookupWordBySlug[jsonSchema_slug];
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Show / Edit Single Specific Instance: {specificInstance_slug}</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>
                        <div class="h3" >{window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug}</div>

                        <div className="standardDoubleColumn" style={{border:"1px dashed black"}}>
                            <center>
                                <div style={{width:"600px",display:"inline-block",textAlign:"left"}} >
                                    <ReactJSONSchemaForm
                                        schema={oJSONSchema}
                                        formData={oSpecificInstance}
                                        onSubmit={onFormSubmit}
                                        onChange={onFormChange}
                                        uiSchema={uiSchema}
                                        omitExtraData
                                    />
                                </div>
                            </center>
                            <br/>
                            <textarea id="specificInstanceTextarea_unedited" style={{width:"600px",height:"700px"}}></textarea>
                            <br/>
                            <textarea id="specificInstanceTextarea_edited" style={{width:"600px",height:"700px"}}></textarea>
                        </div>

                        <div className="standardDoubleColumn" style={{border:"1px dashed grey"}}>
                            <center>Specific Instance Of:</center>
                            <br/>
                            <div id="newSetSubsetOfSelectorContainer" style={{display:"inline-block",marginLeft:"20px"}}>
                            </div>
                            Update specific instance set memberships:<br/>
                            update schema:
                            <div className="doSomethingButton" id="updateSchemaToPanelButton">transfer checkboxes (above) to panel (below)</div>
                            <div className="doSomethingButton" id="updateSchemaToSqlButton">transfer panel (below) to SQL</div>

                            <br/>
                            <textarea id="schemaTextarea" style={{width:"600px",height:"700px"}}></textarea>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
