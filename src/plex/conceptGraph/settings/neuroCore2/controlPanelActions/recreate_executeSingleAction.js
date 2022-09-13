import React from "react";
import sendAsync from '../../../../renderer.js';
const jQuery = require("jquery");
const electronFs = window.require('fs');

const actions_header = `import * as MiscFunctions from '../functions/miscFunctions.js';
import * as ConceptGraphFunctions from '../functions/conceptGraphFunctions.js';
import * as NeuroCoreFunctions from '../functions/neuroCoreFunctions.js';

const jQuery = require("jquery");

const timeout = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// isASpecificInstanceOf:
// P.a.s1r.05 and P.a.s1r.06
// A.a.u1n.06, A.a.u1n.07, A.a.u1n.08, A.a.u1n.10

export const executeSingleAction = async (oAction,plexNeuroCore) => {
    var actionSlug = oAction.actionSlug;
    jQuery("#latestActionContainer").html(actionSlug);
    // console.log("qwerty executeSingleAction; actionSlug: "+actionSlug)
    var r = oAction.r;
    var suffix = actionSlug + "_" + r;
    // console.log("executeSingleAction; suffix: "+suffix)
    jQuery("#action_"+suffix).css("background-color","yellow")

    await timeout(0)

    var verboseConsole = true;

    var oRFL = MiscFunctions.cloneObj(plexNeuroCore.oRFL)
    oRFL.updated = {};
    oRFL.new = {};
    oRFL.deleted = [];

    var oAuxiliaryData = oAction.oAuxiliaryData;

    if (oAuxiliaryData.hasOwnProperty("relationship")) {
        var nF_slug = oAuxiliaryData.relationship.nodeFrom.slug;
        var oNodeFrom = MiscFunctions.cloneObj(oRFL.current[nF_slug]);

        var nT_slug = oAuxiliaryData.relationship.nodeTo.slug;
        var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);
    }

    if (oAuxiliaryData.hasOwnProperty("node")) {
        var node_slug = oAuxiliaryData.node;
        var oNode = MiscFunctions.cloneObj(oRFL.current[node_slug]);
    }

    var nextPatternCode = "not applicable";
    var nextUniqueID = "not applicable";
    if (oAuxiliaryData.hasOwnProperty("oExtraAuxiliaryData")) {
        nextPatternCode = "unknown";
        nextUniqueID = "unknown";
        if (oAuxiliaryData.oExtraAuxiliaryData.hasOwnProperty("nextPatternCode")) {
            nextPatternCode = oAuxiliaryData.oExtraAuxiliaryData.nextPatternCode;
            var aFoo1 = nextPatternCode.split("(");
            var foo1 = aFoo1[1];
            var aFoo2 = foo1.split(")");
            nextUniqueID = aFoo2[0];
        }
    }

    var aCurrentSlugs = Object.keys(oRFL.current)
    var aUpdatedSlugs = Object.keys(oRFL.updated)
    var aNewSlugs = Object.keys(oRFL.new)

    var aAllSlugs = Array.from(new Set([...aCurrentSlugs, ...aUpdatedSlugs, ...aNewSlugs]));

    switch (actionSlug) {
`;

const actions_footer = `
        default:
            // code
            break;
    }

    var executeChanges = jQuery("#executeChangesSelector option:selected").val()

    var aNews = Object.keys(oRFL.new);
    // console.log("actionSlug: "+actionSlug+"; number of new words: "+aNews.length)
    for (var x=0;x<aNews.length;x++) {
        var nextNew_slug = aNews[x];
        var oWord_new = oRFL.new[nextNew_slug]

        var newUniqueIdentifier = actionSlug + "_" + nextNew_slug + "_" + x;

        window.plexNeuroCore.oRecordOfUpdates[newUniqueIdentifier] = {}
        window.plexNeuroCore.oRecordOfUpdates[newUniqueIdentifier].old = {};
        window.plexNeuroCore.oRecordOfUpdates[newUniqueIdentifier].new = oWord_new;
        var infoHTML = "";
        infoHTML += "<div data-updateuniqueidentifier='"+newUniqueIdentifier+"' class='newUniqueIdentifier' >";
        infoHTML += actionSlug+": creating new word "+nextNew_slug;
        infoHTML += "</div>";
        // console.log(infoHTML)
        jQuery("#neuroCore2ActivityLogContainer").append(infoHTML)
        // console.log("executeChanges? "+executeChanges)
        if (executeChanges=="yes") {
            await MiscFunctions.createOrUpdateWordInAllTables(oWord_new)
            plexNeuroCore.oRFL.updated[nextNew_slug] = oWord_new;
            plexNeuroCore.oRFL.new[nextNew_slug] = oWord_new;
            addPatternsToQueue(actionSlug,plexNeuroCore);
        }
    }

    var aUpdates = Object.keys(oRFL.updated);
    // console.log("actionSlug: "+actionSlug+"; number of updated words: "+aUpdates.length)
    for (var x=0;x<aUpdates.length;x++) {
        var nextUpdate_slug = aUpdates[x];
        var oWord_current = oRFL.current[nextUpdate_slug]
        var oWord_updated = oRFL.updated[nextUpdate_slug]

        var sWord_current = JSON.stringify(oWord_current,null,4)
        var sWord_updated = JSON.stringify(oWord_updated,null,4)

        // console.log("sWord_current: "+sWord_current)
        // console.log("sWord_updated: "+sWord_updated)

        var updateUniqueIdentifier = actionSlug + "_" + nextUpdate_slug + "_" + x;

        if (sWord_current != sWord_updated) {
            window.plexNeuroCore.oRecordOfUpdates[updateUniqueIdentifier] = {}
            window.plexNeuroCore.oRecordOfUpdates[updateUniqueIdentifier].old = oWord_current;
            window.plexNeuroCore.oRecordOfUpdates[updateUniqueIdentifier].new = oWord_updated;
            var infoHTML = "";
            infoHTML += "<div data-updateuniqueidentifier='"+updateUniqueIdentifier+"' class='actionUpdatingWord' >";
            infoHTML += actionSlug+": updating word "+nextUpdate_slug;
            infoHTML += "</div>";
            // console.log(infoHTML)
            jQuery("#neuroCore2ActivityLogContainer").append(infoHTML)
            // console.log("executeChanges? "+executeChanges)
            if (executeChanges=="yes") {
                await MiscFunctions.createOrUpdateWordInAllTables(oWord_updated)
                oRFL.current[nextUpdate_slug] = oWord_updated;
                // plexNeuroCore.oRFL.current[nextUpdate_slug] = oWord_updated;
                plexNeuroCore.oRFL.updated[nextUpdate_slug] = oWord_updated;
                window.lookupWordBySlug[nextUpdate_slug] = oWord_updated; // temporary; eventually, plexNeuroCore needs to handle all neuroCore2 changes
                addPatternsToQueue(actionSlug,plexNeuroCore);

            }
        }
    }
    jQuery("#action_"+suffix).css("background-color","green")

    return oRFL;
}

const addPatternsToQueue = (actionSlug,plexNeuroCore) => {
    console.log("qwerty; actionSlug: "+actionSlug)
    var action_wordSlug = plexNeuroCore.oMapActionSlugToWordSlug[actionSlug];
    console.log("qwerty; action_wordSlug: "+action_wordSlug)
    // var oAct = plexNeuroCore.oRFL.current[action_wordSlug];
    var oAct = window.lookupWordBySlug[action_wordSlug]; // temporary; eventually, plexNeuroCore should be handling this
    var sAct = JSON.stringify(oAct,null,4)
    console.log("qwerty; sAct: "+sAct)
    if (oAct.actionData.hasOwnProperty("secondaryPatterns")) {
        // go through secondaryPatterns.sets
        var aSets = [];
        if (oAct.actionData.secondaryPatterns.hasOwnProperty("sets")) {
            aSets = oAct.actionData.secondaryPatterns.sets;
        }
        for (var s=0;s<aSets.length;s++) {
            var nextSet_slug = aSets[s];
            // var oNextSet = plexNeuroCore.oRFL.current[nextSet_slug];
            var oNextSet = window.lookupWordBySlug[nextSet_slug]; // temporary; eventually, plexNeuroCore should be handling this
            // console.log("qwerty nextSet_slug: "+nextSet_slug)
            var aNextSet_patterns = oNextSet.globalDynamicData.specificInstances;
            for (var z=0;z<aNextSet_patterns.length;z++) {
                var nextPattern_wordSlug = aNextSet_patterns[z];
                jQuery("#patternCheckbox_"+nextPattern_wordSlug).prop("checked",true);
            }
        }

        // go through secondaryPatterns.individualPatterns
        var aIndividualPatterns = [];
        if (oAct.actionData.secondaryPatterns.hasOwnProperty("individualPatterns")) {
            aIndividualPatterns = oAct.actionData.secondaryPatterns.individualPatterns;
        }
        for (var s=0;s<aIndividualPatterns.length;s++) {
            var nextPattern_patternName = aIndividualPatterns[s];
            var nextPattern_wordSlug = plexNeuroCore.oMapPatternNameToWordSlug[nextPattern_patternName];
            jQuery("#patternCheckbox_"+nextPattern_wordSlug).prop("checked",true);
            // console.log("qwerty nextPattern_patternName: "+nextPattern_wordSlug)
        }
    }
}
`;

const transferActionFunctions = async () => {
    var outputFile = "";
    outputFile += actions_header;

    var oSupersetActions = window.lookupWordBySlug["supersetFor_action"];
    var aActions = oSupersetActions.globalDynamicData.specificInstances;
    for (var a=0;a<aActions.length;a++) {
        var nextAction_slug = aActions[a];
        var oAction = window.lookupWordBySlug[nextAction_slug]
        var action_name = oAction.actionData.name;
        var action_actionSlug = oAction.actionData.slug;

        var action_javascript = "";
        if (oAction.actionData.hasOwnProperty("javascript")) {
            var action_javascript = oAction.actionData.javascript;
        }
        var action_javascript_formatted = "                "+action_javascript.replaceAll("\n","\n                ")+"\n";

        outputFile += `        case "`+action_actionSlug+`":`;
        outputFile += "\n";



outputFile += `
            if (verboseConsole) { console.log("case `+action_actionSlug+`") }
            try {
`;
outputFile += action_javascript_formatted;
outputFile += `
            } catch (err) {
                console.log("javaScriptError with action `+action_actionSlug+`; err: "+err);
            }
            break;
`;





    }

    outputFile += actions_footer;

    electronFs.writeFile("src/plex/neuroCore2/executeSingleAction.js", outputFile, (err) => {
        if (err)
            console.log(err);
        else {
            console.log("executeSingleAction written successfully\n");
        }
    });
}


export default class RecreateExecuteSingleAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery("#transferActionFunctionsButton").click(function(){
            transferActionFunctions();
        })
    }
    render() {
        return (
          <>
              <div style={{border:"1px solid grey",margin:"5px",padding:"5px"}} >
                  Rewrite file: executeSingleAction.js<br/>
                  (Do this every time there are alterations to the concept for actions, within concept graph: plex; new specific instances or changes to code in existing specific instances.)
                  <br/>
                  ( src/plex/neuroCore2/executeSingleAction.js)
                  <br/>
                  <div id="transferActionFunctionsButton" className="doSomethingButton">rewrite</div>
              </div>
          </>
        );
    }
}
