import React, { useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import ConceptGraphMasthead from '../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/neuroCore2_leftNav2.js';
import NeuroCore2ActionPatternGraph1 from './graphs/nc2ActionPatternGraph1.js';
import NeuroCore2ActionPatternGraph2 from './graphs/nc2ActionPatternGraph2.js';
import * as MiscFunctions from '../../../functions/miscFunctions.js';
import sendAsync from '../../../renderer.js';
import * as VisStyleConstants from '../../../lib/visjs/visjs-style';
const jQuery = require("jquery");

export const displayPatternInfo = (patternSlug) => {
    var oPattern = window.neuroCore.engine.oRFL.current[patternSlug];
    var sPattern = JSON.stringify(oPattern,null,4)
    var inputField = oPattern.patternData.inputField;
    var aActions = oPattern.patternData.actions;
    var basicHTML = "";
    basicHTML += "slug: "+patternSlug;
    basicHTML += "<br>";

    var descriptionHTML = "";
    var javascriptHTML = "";
    var actionsHTML = "";

    actionsHTML += "<pre style=width:99%; >";
    actionsHTML += JSON.stringify(aActions,null,4);
    actionsHTML += "</pre>";

    if (inputField=="singleNode") {
        var description = oPattern.patternData.singleNodeFieldsetData.description;
        var javascript = oPattern.patternData.singleNodeFieldsetData.javascript;

        // descriptionHTML += "<textarea style=width:99%;height:400px; >";
        descriptionHTML += description;
        // descriptionHTML += "</textarea>";

        // javascriptHTML += "<textarea style=width:99%;height:400px; >";
        javascriptHTML += javascript;
        // javascriptHTML += "</textarea>";
    }
    if (inputField=="singleRelationship") {
        var wordType_from = oPattern.patternData.singleRelationshipFieldsetData.wordType_from;
        var relationshipType = oPattern.patternData.singleRelationshipFieldsetData.relationshipType;
        var wordType_to = oPattern.patternData.singleRelationshipFieldsetData.wordType_to;
        /*
        javascriptHTML += "<div style='background-color:#DDDDFF' >";
        javascriptHTML += "<div style='display:inline-block;width:245px;font-size:12px;overflow:scroll;margin-left:5px;' >";
        javascriptHTML += wordType_from;
        javascriptHTML += "</div>";
        javascriptHTML += "<div style='display:inline-block;width:245px;font-size:12px;overflow:scroll;margin-left:5px;' >";
        javascriptHTML += relationshipType;
        javascriptHTML += "</div>";
        javascriptHTML += "<div style='display:inline-block;width:245px;font-size:12px;overflow:scroll;margin-left:5px;' >";
        javascriptHTML += wordType_to;
        javascriptHTML += "</div>";
        javascriptHTML += "<br>";
        javascriptHTML += "</div>";
        */

        javascriptHTML += wordType_from;
        javascriptHTML += "\n";
        javascriptHTML += relationshipType;
        javascriptHTML += "\n";
        javascriptHTML += wordType_to;
    }
    jQuery("#selectedPatternInfoBox").html(basicHTML)
    jQuery("#selectedPatternRawFileContainer").val(sPattern)

    jQuery("#selectedPatternDescriptionTextarea").html(descriptionHTML)
    jQuery("#selectedPatternJavascriptTextarea").html(javascriptHTML)
    jQuery("#selectedPatternActionsBox").html(actionsHTML)

}

export const displayActionInfo = (actionSlug) => {
    var oAction = window.neuroCore.engine.oRFL.current[actionSlug];
    var sAction = JSON.stringify(oAction,null,4)
    var actionName = oAction.actionData.name;
    var description = oAction.actionData.description;
    var javascript = oAction.actionData.javascript;
    var aPatterns_sets = [];
    var aPatterns_individualPatterns = [];
    if (oAction.actionData.hasOwnProperty("secondaryPatterns")) {
        if (oAction.actionData.secondaryPatterns.hasOwnProperty("sets")) {
            aPatterns_sets = oAction.actionData.secondaryPatterns.sets;
        }
        if (oAction.actionData.secondaryPatterns.hasOwnProperty("individualPatterns")) {
            var aPatterns_individualPatterns = oAction.actionData.secondaryPatterns.individualPatterns;
        }
    }

    var basicHTML = "";
    var descriptionHTML = "";
    var javascriptHTML = "";
    var patternsHTML = "";
    var imageHTML = "";
    var actionNameSlug_ified = actionName.replaceAll(".","_").toLowerCase();
    var actionImage = "/assets/img/"+actionNameSlug_ified+".png";
    var imageHTML = "<div style=display:inline-block; ><img src='"+actionImage+"' style=max-width:750px;max-height:500px; /></div>";

    basicHTML += "slug: "+actionSlug;
    basicHTML += "<br>";

    // descriptionHTML += "<textarea style=width:99%;height:400px; >";
    descriptionHTML += description;
    // descriptionHTML += "</textarea>";

    // javascriptHTML += "<textarea style=width:99%;height:400px; >";
    javascriptHTML += javascript;
    // javascriptHTML += "</textarea>";

    patternsHTML += "sets of patterns: ";
    patternsHTML += "<pre style=width:99%; >";
    patternsHTML += JSON.stringify(aPatterns_sets,null,4);
    patternsHTML += "</pre>";
    patternsHTML += "individual patterns: ";
    patternsHTML += "<pre style=width:99%; >";
    patternsHTML += JSON.stringify(aPatterns_individualPatterns,null,4);
    patternsHTML += "</pre>";

    jQuery("#selectedActionInfoBox").html(basicHTML)
    jQuery("#selectedActionRawFileContainer").val(sAction)

    jQuery("#selectedActionDescriptionTextarea").html(descriptionHTML)
    jQuery("#selectedActionJavascriptTextarea").html(javascriptHTML)
    jQuery("#selectedActionPatternsBox").html(patternsHTML)
    jQuery("#selectedActionImageBox").html(imageHTML)
}

export const displaySetInfo = (setSlug) => {
    var oSet = window.neuroCore.engine.oRFL.current[setSlug];
    var basicHTML = "";
    basicHTML += "slug: "+setSlug;
    basicHTML += "<br>";
    jQuery("#selectedSetInfoContainer").html(basicHTML)
}

export default class NeuroCore2Overview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        jQuery("#updateSelectedPatternButton").click(function(){
            var sWord = jQuery("#selectedPatternRawFileContainer").val();
            var oWord = JSON.parse(sWord)
            MiscFunctions.createOrUpdateWordInAllTables(oWord);
            // console.log("sWord: "+JSON.stringify(oWord,null,4));
        })

        jQuery("#updateSelectedActionButton").click(function(){
            var sWord = jQuery("#selectedActionRawFileContainer").val();
            var oWord = JSON.parse(sWord)
            MiscFunctions.createOrUpdateWordInAllTables(oWord);
            // console.log("sWord: "+JSON.stringify(oWord,null,4));
        })

        jQuery(".showPatternButton").click(function(){
            var whatToShow = jQuery(this).data("whattoshow");
            jQuery(".showPatternButton").css("backgroundColor","#DFDFDF");
            jQuery(this).css("backgroundColor","green");

            jQuery(".showPatternContainer").css("display","none");
            if (whatToShow=="basics") {
                jQuery("#selectedPatternInfoBox").css("display","block");
            }
            if (whatToShow=="rawFile") {
                jQuery("#selectedPatternRawFileBox").css("display","block");
            }
            if (whatToShow=="description") {
                jQuery("#selectedPatternDescriptionBox").css("display","block");
            }
            if (whatToShow=="javascript") {
                jQuery("#selectedPatternJavascriptBox").css("display","block");
            }
            if (whatToShow=="actions") {
                jQuery("#selectedPatternActionsBox").css("display","block");
            }
        })

        jQuery(".showActionButton").click(function(){
            var whatToShow = jQuery(this).data("whattoshow");
            jQuery(".showActionButton").css("backgroundColor","#DFDFDF");
            jQuery(this).css("backgroundColor","green");

            jQuery(".showActionContainer").css("display","none");
            if (whatToShow=="basics") {
                jQuery("#selectedActionInfoBox").css("display","block");
            }
            if (whatToShow=="rawFile") {
                jQuery("#selectedActionRawFileBox").css("display","block");
            }
            if (whatToShow=="description") {
                jQuery("#selectedActionDescriptionBox").css("display","block");
            }
            if (whatToShow=="javascript") {
                jQuery("#selectedActionJavascriptBox").css("display","block");
            }
            if (whatToShow=="patterns") {
                jQuery("#selectedActionPatternsBox").css("display","block");
            }
            if (whatToShow=="image") {
                jQuery("#selectedActionImageBox").css("display","block");
            }
        })

        jQuery(".showBlockButton").click(function(){
            var whatToShow = jQuery(this).data("whattoshow");
            jQuery(".showBlockButton").css("backgroundColor","#DFDFDF");
            jQuery(this).css("backgroundColor","green");

            jQuery(".bigBox").css("display","none");
            if (whatToShow=="all") {
                jQuery(".bigBox").css("display","block");
            }
            if (whatToShow=="pattern") {
                jQuery("#patternBox").css("display","block");
            }
            if (whatToShow=="action") {
                jQuery("#actionBox").css("display","block");
            }
            if (whatToShow=="set") {
                jQuery("#setBox").css("display","block");
            }
        })

        jQuery("#transferActionDescriptionButton").click(function(){
            var sWord = jQuery("selectedActionDescriptionTextarea").val();
        })
        jQuery("#transferActionJavascriptButton").click(function(){
            var sWord = jQuery("selectedActionJavascriptTextarea").val();
        })

        jQuery("#transferPatternDescriptionButton").click(function(){
            var sWord = jQuery("selectedPatternDescriptionTextarea").val();
        })
        jQuery("#transferPatternJavascriptButton").click(function(){
            var sWord = jQuery("selectedPatternJavascriptTextarea").val();
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
                    <div class="h2">NeuroCore 0.2 Graphical Overview</div>

                    <NeuroCore2ActionPatternGraph2 />
                    <NeuroCore2ActionPatternGraph1 />

                    <div style={{display:"inline-block",width:"770px",border:"1px dashed blue"}}>
                        <div>
                            show:
                            <div className="doSomethingButton_small showBlockButton" id="showBlockAllButton" data-whattoshow="all" >all</div>
                            <div className="doSomethingButton_small showBlockButton" id="showBlockPatternButton" data-whattoshow="pattern" >Pattern</div>
                            <div className="doSomethingButton_small showBlockButton" id="showBlockActionButton" data-whattoshow="action" >Action</div>
                            <div className="doSomethingButton_small showBlockButton" id="showBlockSetButton" data-whattoshow="set" >Set</div>
                        </div>
                        <div id="patternBox" className="bigBox" style={{display:"inline-block",width:"760px",height:"500px",overflow:"scroll",border:"1px dashed grey"}}>
                            <div style={{backgroundColor:"yellow",textAlign:"center"}}>
                                selected PATTERN info
                            </div>
                            <div>
                                show:
                                <div className="doSomethingButton_small showPatternButton" id="showPatternBasicInfoButton" data-whattoshow="basics" >basics</div>
                                <div className="doSomethingButton_small showPatternButton" id="showPatternRawFileButton" data-whattoshow="rawFile" >rawFile</div>
                                <div className="doSomethingButton_small showPatternButton" id="showPatternDescriptionButton" data-whattoshow="description" >description</div>
                                <div className="doSomethingButton_small showPatternButton" id="showPatternJavascriptButton" data-whattoshow="javascript" >javascript</div>
                                <div className="doSomethingButton_small showPatternButton" id="showPatternActionsButton" data-whattoshow="actions" >actions</div>
                            </div>

                            <div className="showPatternContainer" id="selectedPatternInfoBox">basics</div>

                            <div className="showPatternContainer" id="selectedPatternRawFileBox" >
                                <div className="doSomethingButton_small" id="updateSelectedPatternButton" >update rawFile</div>
                                <textarea id="selectedPatternRawFileContainer" style={{width:"99%",height:"400px"}}></textarea>
                            </div>

                            <div className="showPatternContainer" id="selectedPatternDescriptionBox" >
                                <div className="doSomethingButton_small" id="transferPatternDescriptionButton" >transfer to rawFile</div>
                                <textarea id="selectedPatternDescriptionTextarea" style={{width:"99%",height:"400px"}}></textarea>
                            </div>

                            <div className="showPatternContainer" id="selectedPatternJavascriptBox" >
                                <div className="doSomethingButton_small" id="transferPatternJavascriptButton" >transfer to rawFile</div>
                                <textarea id="selectedPatternJavascriptTextarea" style={{width:"99%",height:"400px"}}></textarea>
                            </div>

                            <div className="showPatternContainer" id="selectedPatternActionsBox" >
                                selectedPatternActionsBox
                            </div>
                        </div>

                        <div id="actionBox" className="bigBox" style={{display:"inline-block",width:"760px",height:"500px",overflow:"scroll",border:"1px dashed grey"}}>
                            <div style={{backgroundColor:"orange",textAlign:"center"}}>
                                selected ACTION info
                            </div>
                            <div>
                                show:
                                <div className="doSomethingButton_small showActionButton" id="showActionBasicInfoButton" data-whattoshow="basics" >basics</div>
                                <div className="doSomethingButton_small showActionButton" id="showActionRawFileButton" data-whattoshow="rawFile" >rawFile</div>
                                <div className="doSomethingButton_small showActionButton" id="showActionDescriptionButton" data-whattoshow="description" >description</div>
                                <div className="doSomethingButton_small showActionButton" id="showActionJavascriptButton" data-whattoshow="javascript" >javascript</div>
                                <div className="doSomethingButton_small showActionButton" id="showActionPatternsButton" data-whattoshow="patterns" >patterns</div>
                                <div className="doSomethingButton_small showActionButton" id="showActionImageButton" data-whattoshow="image" >image</div>
                            </div>

                            <div className="showActionContainer" id="selectedActionInfoBox"></div>

                            <div className="showActionContainer" id="selectedActionRawFileBox" >
                                <div className="doSomethingButton_small" id="updateSelectedActionButton" >update rawFile</div>
                                <textarea id="selectedActionRawFileContainer" style={{width:"99%",height:"400px"}}></textarea>
                            </div>

                            <div className="showActionContainer" id="selectedActionDescriptionBox" >
                                <div className="doSomethingButton_small" id="transferActionDescriptionButton" >transfer to rawFile</div>
                                <textarea id="selectedActionDescriptionTextarea" style={{width:"99%",height:"400px"}}></textarea>
                            </div>

                            <div className="showActionContainer" id="selectedActionJavascriptBox" >
                                <div className="doSomethingButton_small" id="transferActionJavascriptButton" >transfer to rawFile</div>
                                <textarea id="selectedActionJavascriptTextarea" style={{width:"99%",height:"400px"}}></textarea>
                            </div>

                            <div className="showActionContainer" id="selectedActionPatternsBox" >
                                selectedActionPatternsBox
                            </div>

                            <div className="showActionContainer" id="selectedActionImageBox" >
                                selectedActionImageBox
                            </div>
                        </div>

                        <div id="setBox" className="bigBox" style={{display:"inline-block",width:"700px",height:"500px",overflow:"scroll",border:"1px dashed grey"}}>
                            <div style={{backgroundColor:"#CFCFCF",textAlign:"center"}}>selected SET info</div>
                            <div id="selectedSetInfoContainer"></div>
                        </div>
                    </div>

                </div>
            </fieldset>
          </>
        );
    }
}
