import React from "react";
import ReactDOM from 'react-dom';
import ConceptGraphMasthead from '../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/neuroCore2_leftNav2.js';
import JSONSchemaForm from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import sendAsync from '../../../renderer.js';
const jQuery = require("jquery");

const renderPatternForm = (oPattern) => {
    var oSchema = window.neuroCore.engine.oRFL.current.JSONSchemaFor_pattern;
    ReactDOM.render(<JSONSchemaForm
        schema={oSchema}
        formData={oPattern}
        />,
        document.getElementById("pattern_JSONSchemaContainer")
    )
}

const renderActionForm = (oAction) => {
    var oSchema = window.neuroCore.engine.oRFL.current.JSONSchemaFor_action;
    ReactDOM.render(<JSONSchemaForm
        schema={oSchema}
        formData={oAction}
        />,
        document.getElementById("action_JSONSchemaContainer")
    )
}

const populatePattern = (oPattern) => {
    var sPattern = JSON.stringify(oPattern,null,4);
    jQuery("#pattern_rawFileContainer").val(sPattern);

    var inputField = oPattern.patternData.inputField;
    // jQuery("#patternInputFieldContainer").html(inputField);

    var description = "none available";
    var javascriptOrRels = "none available";
    if (oPattern.patternData.hasOwnProperty("singleNodeFieldsetData")) {
        if (oPattern.patternData.singleNodeFieldsetData.hasOwnProperty("description")) {
            description = "";
            description += "<div style='background-color:orange;' >";
            description += oPattern.patternData.singleNodeFieldsetData.description;
            description += "</div>";
        }
        if (oPattern.patternData.singleNodeFieldsetData.hasOwnProperty("javascript")) {
            javascriptOrRels = "";

            javascriptOrRels += "<center >";
            javascriptOrRels += inputField;
            javascriptOrRels += "</center>";

            javascriptOrRels += "<textarea style='width:100%;height:170px' >";
            javascriptOrRels += oPattern.patternData.singleNodeFieldsetData.javascript;
            javascriptOrRels += "</textarea>";
        }
    }
    if (oPattern.patternData.hasOwnProperty("singleRelationshipFieldsetData")) {
        var wT_from = oPattern.patternData.singleRelationshipFieldsetData.wordType_from;
        var rT = oPattern.patternData.singleRelationshipFieldsetData.relationshipType;
        var wT_to = oPattern.patternData.singleRelationshipFieldsetData.wordType_to;

        if (!wT_from) { wT_from = "ANY"; }
        if (!wT_to) { wT_to = "ANY"; }

        javascriptOrRels = "";

        javascriptOrRels += "<center >";
        javascriptOrRels += inputField;
        javascriptOrRels += "</center>";

        javascriptOrRels += "<div >";
        javascriptOrRels += wT_from;
        javascriptOrRels += "</div>";

        javascriptOrRels += "<div >";
        javascriptOrRels += rT;
        javascriptOrRels += "</div>";

        javascriptOrRels += "<div >";
        javascriptOrRels += wT_to;
        javascriptOrRels += "</div>";
    }
    jQuery("#patternDescriptionContainer").html(description);
    jQuery("#patternJavascriptOrRelsContainer").html(javascriptOrRels);

    var patternName = oPattern.patternData.name;

    var patternNameSlug_ified = patternName.replaceAll(".","_").toLowerCase();
    var patternImage = "/assets/img/"+patternNameSlug_ified+".png";
    var patternImageHTML = "<div style=display:inline-block; ><img src='"+patternImage+"' style=width:100%; /></div>";

    jQuery("#patternImageContainer").html(patternImageHTML);

    renderPatternForm(oPattern);
}

const populateAction = (oAction) => {
    console.log("populateAction")
    var sAction = JSON.stringify(oAction,null,4);
    jQuery("#action_rawFileContainer").val(sAction);

    var description = "none available";
    var javascript = "none available";

    if (oAction.actionData.hasOwnProperty("description")) {
        description = "";
        description += "<div style='background-color:orange;' >";
        description += oAction.actionData.description;
        description += "</div>";
    }

    if (oAction.actionData.hasOwnProperty("javascript")) {
        javascript = "";
        javascript += "<textarea style='width:100%;height:200px' >";
        javascript += oAction.actionData.javascript;
        javascript += "</textarea>";
    }

    jQuery("#actionDescriptionContainer").html(description);
    jQuery("#actionJavascriptContainer").html(javascript);

    var actionName = oAction.actionData.name;

    var actionNameSlug_ified = actionName.replaceAll(".","_").toLowerCase();
    var actionImage = "/assets/img/"+actionNameSlug_ified+".png";
    var actionImageHTML = "<div style=display:inline-block; ><img src='"+actionImage+"' style=height:100%; /></div>";

    jQuery("#actionImageContainer").html(actionImageHTML);

    renderActionForm(oAction);
}

export default class NeuroCore2Overview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        /////////////// patterns
        var oSupersetPatterns = window.neuroCore.engine.oRFL.current.supersetFor_pattern;
        var aPatterns = oSupersetPatterns.globalDynamicData.specificInstances;
        aPatterns = aPatterns.sort();
        jQuery("#patternsContainer").html();
        for (var z=0;z<aPatterns.length;z++) {
            var nextPattern_wordSlug = aPatterns[z];
            var oNextPattern = window.neuroCore.engine.oRFL.current[nextPattern_wordSlug];
            var nextPattern_patternSlug = oNextPattern.patternData.slug;
            var nextPattern_name = oNextPattern.patternData.name;

            var nextPatternHTML = "";
            nextPatternHTML += "<div data-wordslug='"+nextPattern_wordSlug+"' data-patternslug='"+nextPattern_patternSlug+"' id='singlePattern_"+nextPattern_patternSlug+"' class='singlePatternBox' >";
            nextPatternHTML += nextPattern_name;
            nextPatternHTML += "</div>";

            jQuery("#patternsContainer").append(nextPatternHTML)
        }

        jQuery(".singlePatternBox").click(function(){
            var pattern_wordSlug = jQuery(this).data("wordslug")
            var pattern_patternSlug = jQuery(this).data("patternslug")
            var oPattern = window.neuroCore.engine.oRFL.current[pattern_wordSlug];
            populatePattern(oPattern);
            var aCorrespondingActions = oPattern.patternData.actions;
            jQuery(".singlePatternBox").css("background-color","#EFEFEF");
            jQuery(this).css("background-color","#00FF00");

            jQuery(".singlePatternBox").css("border","1px solid black");
            jQuery(this).css("border","1px solid red");

            jQuery(".singleActionBox").css("background-color","#EFEFEF");
            jQuery(".singleActionBox").css("display","none");
            if (aCorrespondingActions) {
                for (var x=0;x<aCorrespondingActions.length;x++) {
                    var nextAction_slug = aCorrespondingActions[x];
                    console.log("nextAction_slug: "+nextAction_slug)
                    jQuery("#singleAction_"+nextAction_slug).css("background-color","#00FF00");
                    jQuery("#singleAction_"+nextAction_slug).css("display","block");
                }
            } else {
                alert("no aCorrespondingActions")
            }
        })

        /////////////// actions
        var oSupersetActions = window.neuroCore.engine.oRFL.current.supersetFor_action;
        var aActions = oSupersetActions.globalDynamicData.specificInstances;
        aActions = aActions.sort();
        jQuery("#actionsContainer").html();
        for (var z=0;z<aActions.length;z++) {
            var nextAction_wordSlug = aActions[z];
            var oNextAction = window.neuroCore.engine.oRFL.current[nextAction_wordSlug];
            var nextAction_name = oNextAction.actionData.name;
            var nextAction_actionSlug = oNextAction.actionData.slug;

            var nextActionHTML = "";
            nextActionHTML += "<div data-wordslug='"+nextAction_wordSlug+"' data-actionslug='"+nextAction_actionSlug+"' id='singleAction_"+nextAction_actionSlug+"' class='singleActionBox' >";
            nextActionHTML += nextAction_actionSlug;
            nextActionHTML += "</div>";

            jQuery("#actionsContainer").append(nextActionHTML)
        }

        jQuery(".singleActionBox").click(function(){
            var action_wordSlug = jQuery(this).data("wordslug")
            console.log("action_wordSlug: "+action_wordSlug)
            var action_patternSlug = jQuery(this).data("actionslug")
            jQuery(".singleActionBox").css("background-color","#EFEFEF");
            jQuery(this).css("background-color","#00FF00");
            jQuery(".singleActionBox").css("border","1px solid black");
            jQuery(this).css("border","1px solid red");
            var oAction = window.neuroCore.engine.oRFL.current[action_wordSlug]
            populateAction(oAction);

            jQuery(".singlePatternBox").css("color","black");
            jQuery(".singlePatternBox").each(function(){
                var pattern_slug = jQuery(this).data("wordslug")
                var oP = window.neuroCore.engine.oRFL.current[pattern_slug];
                var aAxns = [];
                if (oP.patternData.hasOwnProperty("actions")) {
                    aAxns = oP.patternData.actions;
                }
                if (aAxns.includes(action_patternSlug)) {
                    jQuery(this).css("color","red")
                }
                console.log("pattern_slug: "+pattern_slug)
            })
        })

        jQuery("#showAllActionsButton").click(function(){
            // jQuery(".singleActionBox").css("background-color","#EFEFEF");
            jQuery(".singleActionBox").css("display","block");
        })

        jQuery("#pattern_rawFileButton").click(function(){
            jQuery(this).css("background-color","#00FF00")
            jQuery("#pattern_JSONSchemaButton").css("background-color","#EFEFEF")

            jQuery("#pattern_rawFileContainer").css("display","block")
            jQuery("#pattern_JSONSchemaContainer").css("display","none")
        })
        jQuery("#pattern_JSONSchemaButton").click(function(){
            jQuery(this).css("background-color","#00FF00")
            jQuery("#pattern_rawFileButton").css("background-color","#EFEFEF")

            jQuery("#pattern_rawFileContainer").css("display","none")
            jQuery("#pattern_JSONSchemaContainer").css("display","block")
        })
        jQuery("#action_rawFileButton").click(function(){
            jQuery(this).css("background-color","#00FF00")
            jQuery("#action_JSONSchemaButton").css("background-color","#EFEFEF")

            jQuery("#action_rawFileContainer").css("display","block")
            jQuery("#action_JSONSchemaContainer").css("display","none")
        })
        jQuery("#action_JSONSchemaButton").click(function(){
            jQuery(this).css("background-color","#00FF00")
            jQuery("#action_rawFileButton").css("background-color","#EFEFEF")

            jQuery("#action_rawFileContainer").css("display","none")
            jQuery("#action_JSONSchemaContainer").css("display","block")
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
                    <div class="h2">NeuroCore 0.2 Overview</div>

                    <div style={{display:"inline-block",width:"500px",height:"300px",border:"1px dashed grey"}}>
                        <center>
                            <div id="pattern_rawFileButton" className="doSomethingButton" >rawFile</div>
                            <div id="pattern_JSONSchemaButton" className="doSomethingButton" >JSON Schema</div>
                        </center>
                        <textarea id="pattern_rawFileContainer" style={{display:"none",width:"100%",height:"250px"}} >
                        </textarea>
                        <div id="pattern_JSONSchemaContainer" style={{overflow:"scroll",height:"250px"}} >pattern_JSONSchemaContainer</div>
                    </div>

                    <div style={{display:"inline-block",width:"200px",height:"300px",border:"1px dashed grey"}}>
                        <center>Patterns</center>
                        <div id="patternsContainer" style={{overflow:"scroll",height:"250px"}} ></div>
                    </div>

                    <div style={{display:"inline-block",width:"200px",height:"300px",border:"1px dashed grey"}}>
                        <center>Actions <div id="showAllActionsButton" className="doSomethingButton_small" >show all</div> </center>
                        <div id="actionsContainer" style={{overflow:"scroll",height:"250px"}} ></div>
                    </div>

                    <div style={{display:"inline-block",width:"500px",height:"300px",border:"1px dashed grey"}}>
                        <center>
                            <div id="action_rawFileButton" className="doSomethingButton" >rawFile</div>
                            <div id="action_JSONSchemaButton" className="doSomethingButton" >JSON Schema</div>
                        </center>
                        <textarea id="action_rawFileContainer" style={{display:"none",width:"100%",height:"250px"}} >
                        </textarea>
                        <div id="action_JSONSchemaContainer" style={{overflow:"scroll",height:"250px"}} >action_JSONSchemaContainer</div>
                    </div>

                    <br/>

                    <div style={{display:"inline-block",width:"700px",height:"600px",border:"1px dashed grey"}}>
                        <div id="patternDescriptionContainer" style={{display:"inline-block",width:"100%",height:"75px",border:"1px dashed grey",overflow:"scroll"}}>
                        description
                        </div>

                        <div id="patternJavascriptOrRelsContainer" style={{display:"inline-block",width:"100%",height:"200px",border:"1px dashed grey",overflow:"scroll"}}>
                        code (if single node) vs relationship(s) (if single or double relationship)
                        </div>

                        <div id="patternImageContainer" style={{display:"inline-block",width:"100%",height:"325px",border:"1px dashed grey",overflow:"scroll"}}>
                        image
                        </div>
                    </div>

                    <div style={{display:"inline-block",width:"700px",height:"600px",border:"1px dashed grey"}}>
                        <div id="actionDescriptionContainer" style={{display:"inline-block",width:"100%",height:"75px",border:"1px dashed grey",overflow:"scroll"}}>
                        description
                        </div>

                        <div id="actionJavascriptContainer" style={{display:"inline-block",width:"100%",height:"200px",border:"1px dashed grey",overflow:"scroll"}}>
                        code
                        </div>

                        <div id="actionImageContainer" style={{display:"inline-block",width:"100%",height:"325px",border:"1px dashed grey",overflow:"scroll"}}>
                        image
                        </div>
                    </div>

                </div>
            </fieldset>
          </>
        );
    }
}
