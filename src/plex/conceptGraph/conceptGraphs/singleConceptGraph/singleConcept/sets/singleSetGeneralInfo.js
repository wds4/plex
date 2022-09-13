import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/singleConcept_sets_leftNav2.js';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");

const updateSet = async () => {
    console.log("updateSet")
    var commandHTML = "";
    var currSetSlug = jQuery("#currSetSlugField").val();
    var currSetTitle = jQuery("#currSetTitleField").val();
    var currSetName = jQuery("#currSetNameField").val();
    var currSetDescription = jQuery("#currSetDescriptionField").val();
}

const makeSubsetOfSelector = (oConcept,thisSet_slug) => {
    var schema_slug = oConcept.conceptData.nodes.schema.slug;
    var oSchema = window.lookupWordBySlug[schema_slug];
    var aRels = oSchema.schemaData.relationships;

    var selectorPanelHTML = "";

    var supersetSlug = oConcept.conceptData.nodes.superset.slug;
    var oSuperset = window.lookupWordBySlug[supersetSlug];

    var oTestRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
    oTestRel.nodeFrom.slug = thisSet_slug;
    oTestRel.relationshipType.slug = "subsetOf";
    oTestRel.nodeTo.slug = supersetSlug;

    var bDoesRelExist = MiscFunctions.isRelObjInArrayOfObj(oTestRel,aRels)

    selectorPanelHTML += "<input class=subsetOfCheckbox id='subsetOfCheckbox_"+nextSet+"' type=checkbox ";
    if (bDoesRelExist) { selectorPanelHTML += " checked "; }
    selectorPanelHTML += " name=setCheckbox ></input> ";
    selectorPanelHTML += supersetSlug;
    selectorPanelHTML += "<br>";

    var aSets = oSuperset.globalDynamicData.subsets
    var numSets = aSets.length;
    for (var s=0;s<numSets;s++) {
        var nextSet = aSets[s];

        var oTestRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
        oTestRel.nodeFrom.slug = thisSet_slug;
        oTestRel.relationshipType.slug = "subsetOf";
        oTestRel.nodeTo.slug = nextSet;

        var bDoesRelExist = MiscFunctions.isRelObjInArrayOfObj(oTestRel,aRels)

        selectorPanelHTML += "<input class=subsetOfCheckbox id='subsetOfCheckbox_"+nextSet+"' type=checkbox ";
        if (bDoesRelExist) { selectorPanelHTML += " checked "; }
        selectorPanelHTML += " name=setCheckbox ></input> ";
        selectorPanelHTML += nextSet;
        selectorPanelHTML += "<br>";
    }
    jQuery("#currSetSubsetOfSelectorContainer").html(selectorPanelHTML)
}

export default class SingleSet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var set_slug = this.props.match.params.slug
        var oSet = window.lookupWordBySlug[set_slug];
        var sSet = JSON.stringify(oSet,null,4);
        jQuery("#setTextarea").val(sSet);

        var set_name = "";
        var set_title = "";
        var set_description = "";
        try {
            set_name = oSet.setData.name;
        } catch (e) {}
        try {
            set_title = oSet.setData.title;
        } catch (e) {}
        try {
            set_description = oSet.setData.description;
        } catch (e) {}
        jQuery("#currSetSlugField").val(set_slug)
        jQuery("#currSetNameField").val(set_name)
        jQuery("#currSetTitleField").val(set_title)
        jQuery("#currSetDescriptionField").val(set_description)

        var conceptSlug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;
        var oConcept = window.lookupWordBySlug[conceptSlug]

        var schema_slug = oConcept.conceptData.nodes.schema.slug;
        var oSchema = window.lookupWordBySlug[schema_slug]
        var sSchema = JSON.stringify(oSchema,null,4)
        jQuery("#schemaTextarea").val(sSchema);

        makeSubsetOfSelector(oConcept,set_slug)

        jQuery("#updateSetButton").click(function(){
            updateSet();
        })
    }
    render() {
        var set_slug = this.props.match.params.slug
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Show / Edit Single Set: {set_slug}</div>
                        <div className="standardDoubleColumn" style={{border:"1px dashed black",fontSize:"16px"}}>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    slug
                                </div>
                                <textarea id="currSetSlugField" className="leftColumnRightPanelTextarea">
                                </textarea>widgetsFromNewYork
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    title
                                </div>
                                <textarea id="currSetTitleField" className="leftColumnRightPanelTextarea">
                                </textarea>Widgets from New York
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    name
                                </div>
                                <textarea id="currSetNameField" className="leftColumnRightPanelTextarea">
                                </textarea>widgets from New York
                            </div>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanelB" >
                                    description
                                </div>
                                <textarea id="currSetDescriptionField" className="leftColumnRightPanelTextarea" style={{height:"50px"}} >
                                </textarea>lorem ipsum
                            </div>

                            <div id="updateSetButton" className="doSomethingButton" style={{marginLeft:"130px"}}>update this Set</div>

                            <br/>
                            <textarea id="setTextarea" style={{width:"600px",height:"700px"}}></textarea>
                        </div>

                        <div className="standardDoubleColumn" style={{border:"1px dashed black"}}>
                            <div className="makeNewLeftPanel">
                            direct subset of:
                            </div>
                            <br/>
                            <div id="currSetSubsetOfSelectorContainer" style={{display:"inline-block",marginLeft:"20px"}}>
                            </div>

                            <br/>

                            <div id="updateSetRelationshipsButton" className="doSomethingButton" style={{marginLeft:"20px"}}>update relationships of this Set</div>

                            <br/>
                            <textarea id="schemaTextarea" style={{width:"600px",height:"700px"}}></textarea>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
