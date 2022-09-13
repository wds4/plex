import React from "react";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/neuroCore2_patterns_s1n_leftNav2.js';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");

var lookupNC1DescriptionByPatternName = {};
var lookupNC1JavascriptByPatternName = {};

const updateNC1Textareas = () => {
    var patternName = jQuery("#neuroCore1PatternSelector option:selected").data("patternname")

    var javascript = lookupNC1JavascriptByPatternName[patternName]
    jQuery("#javascript_nc1_container").val(javascript)

    var description = lookupNC1DescriptionByPatternName[patternName]
    jQuery("#description_nc1_container").val(description)
}

const makeNeuroCore1PatternSelector = (currentPattern_name) => {
    var tableName = "conceptGraphPatterns_s1n";

    var sql = " SELECT * FROM "+tableName +" ORDER BY patternName ASC ";
    sendAsync(sql).then((aResult) => {
        lookupNC1DescriptionByPatternName = {};
        lookupNC1JavascriptByPatternName = {};
        var neuroCore1PatternSelectorHTML = "";
        neuroCore1PatternSelectorHTML += "<select id='neuroCore1PatternSelector' >"
        for (var r=0;r<aResult.length;r++) {
            var oNextRow = aResult[r];
            var nextRow_id = oNextRow.id;
            var nextRow_patternName = oNextRow.patternName;
            var nextRow_description = oNextRow.description;
            var nextRow_javascript = oNextRow.javascript;

            lookupNC1DescriptionByPatternName[nextRow_patternName] = nextRow_description;
            lookupNC1JavascriptByPatternName[nextRow_patternName] = nextRow_javascript;

            neuroCore1PatternSelectorHTML += "<option ";
            neuroCore1PatternSelectorHTML += " data-patternname='"+nextRow_patternName+"' ";
            if (currentPattern_name==nextRow_patternName) {
                neuroCore1PatternSelectorHTML += " selected=true ";
            }
            neuroCore1PatternSelectorHTML += " >";
            neuroCore1PatternSelectorHTML += nextRow_patternName;
            neuroCore1PatternSelectorHTML += "</option>";
        }
        neuroCore1PatternSelectorHTML += "</select>";
        jQuery("#neuroCore1PatternSelectorContainer").html(neuroCore1PatternSelectorHTML);
        jQuery("#neuroCore1PatternSelector").change(function(){
            updateNC1Textareas()
        })
        updateNC1Textareas()
    });
}

const updateWord = () => {
    var sWord_unedited = jQuery("#patternRawFile_unedited_container").val();
    var oWord_unedited = JSON.parse(sWord_unedited)
    var oWord_edited = MiscFunctions.cloneObj(oWord_unedited);

    var javascript = jQuery("#javascript_container").val()
    var description = jQuery("#description_container").val()

    // oWord_edited.wordData.q="r";
    oWord_edited.patternData.singleNodeFieldsetData.javascript = javascript;
    oWord_edited.patternData.singleNodeFieldsetData.description = description;

    var sWord_edited = JSON.stringify(oWord_edited,null,4);
    jQuery("#patternRawFile_edited_container").val(sWord_edited);
}

export default class ViewEditPatternS1n extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patternSlug: null
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var pattern_slug = this.props.match.params.patternsqlid;
        console.log("pattern_slug: "+pattern_slug)
        this.setState({patternSlug: pattern_slug } )

        var oPattern = window.lookupWordBySlug[pattern_slug];

        var pattern_name = oPattern.patternData.name;

        makeNeuroCore1PatternSelector(pattern_name);

        var sPattern = JSON.stringify(oPattern,null,4);
        jQuery("#patternRawFile_unedited_container").val(sPattern)

        var javascript = "";
        var description = "";
        if (oPattern.patternData.hasOwnProperty("singleNodeFieldsetData")) {
            if (oPattern.patternData.singleNodeFieldsetData.hasOwnProperty("javascript")) {
                javascript = oPattern.patternData.singleNodeFieldsetData.javascript;
            }
            if (oPattern.patternData.singleNodeFieldsetData.hasOwnProperty("description")) {
                description = oPattern.patternData.singleNodeFieldsetData.description;
            }
        }
        jQuery("#javascript_container").val(javascript)
        jQuery("#description_container").val(description)

        jQuery("#javascript_container").change(function(){
            updateWord();
        })
        jQuery("#description_container").change(function(){
            updateWord();
        })
        jQuery("#updateWordButton").click(function(){
            var sWord = jQuery("#patternRawFile_edited_container").val();
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
                        <div class="h2">NeuroCore 0.2: View Edit Pattern (s1n)</div>

                        <div id="allInputFieldsContainer" style={{marginTop:"20px",marginLeft:"20px"}} >
                        javascript:<br/>
                        <textarea id="javascript_container" style={{width:"90%",height:"100px"}} ></textarea>
                        <br/>

                        description:<br/>
                        <textarea id="description_container" style={{width:"90%",height:"100px"}} ></textarea>
                        <br/>

                        unedited:<br/>
                        <textarea id="patternRawFile_unedited_container" style={{width:"90%",height:"200px"}} ></textarea>
                        <br/>

                        edited:
                        <div className="doSomethingButton" id="updateWordButton" >UPDATE</div>
                        <br/>
                        <textarea id="patternRawFile_edited_container" style={{width:"90%",height:"200px"}} ></textarea>

                        <br/>

                        <div id="neuroCore1PatternSelectorContainer">neuroCore1PatternSelectorContainer</div>
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
