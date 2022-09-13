import React from "react";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/neuroCore2_actions_all_leftNav2.js';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");

var lookupNC1DescriptionByActionName = {};
var lookupNC1JavascriptByActionName = {};

const updateNC1Textareas = () => {
    var actionName = jQuery("#neuroCore1ActionSelector option:selected").data("actionname")

    var javascript = lookupNC1JavascriptByActionName[actionName]
    jQuery("#javascript_nc1_container").val(javascript)

    var description = lookupNC1DescriptionByActionName[actionName]
    jQuery("#description_nc1_container").val(description)
}

const makeNeuroCore1ActionSelector = (currentAction_name) => {
    var tableName = "conceptGraphActions_u1n";

    var sql = " SELECT * FROM "+tableName +" ORDER BY actionName ASC ";
    sendAsync(sql).then((aResult) => {
        lookupNC1DescriptionByActionName = {};
        lookupNC1JavascriptByActionName = {};
        var neuroCore1ActionSelectorHTML = "";
        neuroCore1ActionSelectorHTML += "<select id='neuroCore1ActionSelector' >"
        for (var r=0;r<aResult.length;r++) {
            var oNextRow = aResult[r];
            var nextRow_id = oNextRow.id;
            var nextRow_actionName = oNextRow.actionName;
            var nextRow_description = oNextRow.description;
            var nextRow_javascript = oNextRow.javascript;

            lookupNC1DescriptionByActionName[nextRow_actionName] = nextRow_description;
            lookupNC1JavascriptByActionName[nextRow_actionName] = nextRow_javascript;

            neuroCore1ActionSelectorHTML += "<option ";
            neuroCore1ActionSelectorHTML += " data-actionname='"+nextRow_actionName+"' ";
            if (currentAction_name==nextRow_actionName) {
                neuroCore1ActionSelectorHTML += " selected=true ";
            }
            neuroCore1ActionSelectorHTML += " >";
            neuroCore1ActionSelectorHTML += nextRow_actionName;
            neuroCore1ActionSelectorHTML += "</option>";
        }
        neuroCore1ActionSelectorHTML += "</select>";
        jQuery("#neuroCore1ActionSelectorContainer").html(neuroCore1ActionSelectorHTML);
        jQuery("#neuroCore1ActionSelector").change(function(){
            updateNC1Textareas()
        })
        updateNC1Textareas()
    });
}

const updateWord = () => {
    var sWord_unedited = jQuery("#actionRawFile_unedited_container").val();
    var oWord_unedited = JSON.parse(sWord_unedited)
    var oWord_edited = MiscFunctions.cloneObj(oWord_unedited);

    var javascript = jQuery("#javascript_container").val()
    var description = jQuery("#description_container").val()

    // oWord_edited.wordData.q="r";
    oWord_edited.actionData.javascript = javascript;
    oWord_edited.actionData.description = description;

    var sWord_edited = JSON.stringify(oWord_edited,null,4);
    jQuery("#actionRawFile_edited_container").val(sWord_edited);
}

export default class ViewEditActionAll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actionSlug: null
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var action_slug = this.props.match.params.actionsqlid;
        this.setState({actionSlug: action_slug } )

        // console.log("action_slug: "+action_slug)

        var oAction = window.lookupWordBySlug[action_slug];

        var action_name = oAction.actionData.name;

        makeNeuroCore1ActionSelector(action_name);

        var sAction = JSON.stringify(oAction,null,4);
        jQuery("#actionRawFile_unedited_container").val(sAction)

        var javascript = "";
        if (oAction.actionData.hasOwnProperty("javascript")) {
            javascript = oAction.actionData.javascript;
        }
        jQuery("#javascript_container").val(javascript)

        var description = "";
        if (oAction.actionData.hasOwnProperty("description")) {
            description = oAction.actionData.description;
        }
        jQuery("#description_container").val(description)

        jQuery("#javascript_container").change(function(){
            updateWord();
        })
        jQuery("#description_container").change(function(){
            updateWord();
        })
        jQuery("#updateWordButton").click(function(){
            var sWord = jQuery("#actionRawFile_edited_container").val();
            var oWord = JSON.parse(sWord);
            MiscFunctions.createOrUpdateWordInAllTables(oWord)
        })
        jQuery("#transferFieldsButton").click(function(){
            var javascript = jQuery("#javascript_nc1_container").val()
            var description = jQuery("#description_nc1_container").val()

            jQuery("#javascript_container").val(javascript)
            jQuery("#description_container").val(description)

            updateWord();
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
                        <div class="h2">NeuroCore 0.2: View Edit Action</div>
                        <div id="allInputFieldsContainer" style={{marginTop:"20px"}} >
                            javascript:<br/>
                            <textarea id="javascript_container" style={{width:"90%",height:"200px"}} ></textarea>
                            <br/>

                            description:<br/>
                            <textarea id="description_container" style={{width:"90%",height:"200px"}} ></textarea>
                            <br/>

                            unedited:<br/>
                            <textarea id="actionRawFile_unedited_container" style={{width:"90%",height:"300px"}} ></textarea>
                            <br/>

                            edited:
                            <div className="doSomethingButton" id="updateWordButton" >UPDATE</div>
                            <br/>
                            <textarea id="actionRawFile_edited_container" style={{width:"90%",height:"300px"}} ></textarea>

                            <br/>

                            <div id="neuroCore1ActionSelectorContainer">neuroCore1ActionSelectorContainer</div>
                            <div className="doSomethingButton" id="transferFieldsButton" >transfer</div>
                            javascript:<br/>
                            <textarea id="javascript_nc1_container" style={{width:"90%",height:"300px"}} ></textarea>
                            <br/>

                            description:<br/>
                            <textarea id="description_nc1_container" style={{width:"90%",height:"300px"}} ></textarea>

                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
