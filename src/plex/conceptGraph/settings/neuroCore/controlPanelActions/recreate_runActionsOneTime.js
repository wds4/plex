import React from "react";
import sendAsync from '../../../../renderer.js';
const jQuery = require("jquery");
const electronFs = window.require('fs'); 

const actions_header = `import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as ConceptGraphFunctions from '../../functions/conceptGraphFunctions.js';
import * as NeuroCoreFunctions from '../../functions/neuroCoreFunctions.js';
import * as A_a from './actions/actions-a.js';
import * as A_b from './actions/actions-b.js';
import * as A_c from './actions/actions-b.js';
import * as A_rV0 from './actions/actions-rV0.js';
import { oActionDataOutputTemplate } from './actions/constants.js';
const jQuery = require("jquery");

const updateRawFile = async (oUpdatedRawFileLookup,oRawFileLookupCurrent,oRawFileLookupNew) => {
    // first eliminate any 'updated' nodes that are unchanged from current
    var oUpdatedRawFileLookupTrimmed = {};
    jQuery.each( oUpdatedRawFileLookup, function( slug, oNode ) {
        var oNodeCurrent = oRawFileLookupCurrent[slug];
        var oNodeUpdated = oUpdatedRawFileLookup[slug];
        var sNodeCurrent = JSON.stringify(oNodeCurrent,null,4);
        var sNodeUpdated = JSON.stringify(oNodeUpdated,null,4);
        if (sNodeCurrent != sNodeUpdated) {
            oUpdatedRawFileLookupTrimmed[slug] = oNode;
        }
    });

    // next merge new updated nodes with preexisting updated nodes
    var sUpdatedRawFileLookupPreexisting = jQuery("#newUpdatedRawFileLookupContainer").html()
    // console.log("sUpdatedRawFileLookupPreexisting: "+sUpdatedRawFileLookupPreexisting)
    if (!sUpdatedRawFileLookupPreexisting) { sUpdatedRawFileLookupPreexisting = "{}"; }
    // var sUpdatedRawFileLookupPreexisting = '{ "wordTypeFor_dog": {} }';
    var oUpdatedRawFileLookupPreexisting = JSON.parse(sUpdatedRawFileLookupPreexisting);

    jQuery.each( oUpdatedRawFileLookupPreexisting, function( slug, oNode ) {
        oUpdatedRawFileLookupTrimmed[slug] = oNode;
    });

    // console.log("oRawFileLookupNew: "+JSON.stringify(oRawFileLookupNew,null,4))
    jQuery.each( oRawFileLookupNew, function( slug, oNode ) {
        // console.log("oRawFileLookupNew; slug: "+slug);
        oUpdatedRawFileLookupTrimmed[slug] = oNode;
    });

    var sRawFileLookupNew = JSON.stringify(oUpdatedRawFileLookupTrimmed,null,4)
    jQuery("#newUpdatedRawFileLookupContainer").html(sRawFileLookupNew)
    jQuery("#newUpdatedRawFileLookupContainer").val(sRawFileLookupNew)

    jQuery("#rawFileLookupUpdateButton").trigger("click")
}

// map the name of the action to one (or more?) functions required by that action
const executeSingleAction = async (actionName,oAuxiliaryData,oRawFileLookup) => {
    var oRFL = MiscFunctions.cloneObj(oRawFileLookup)
    var verboseConsole = true;

    if (oAuxiliaryData.hasOwnProperty("relationship")) {
        var nF_slug = oAuxiliaryData.relationship.nodeFrom.slug;
        if (oRFL.updated.hasOwnProperty(nF_slug)) {
            var oNodeFrom = MiscFunctions.cloneObj(oRFL.updated[nF_slug]);
        } else {
            var oNodeFrom = MiscFunctions.cloneObj(oRFL.current[nF_slug]);
        }

        var nT_slug = oAuxiliaryData.relationship.nodeTo.slug;
        if (oRFL.updated.hasOwnProperty(nT_slug)) {
            var oNodeTo = MiscFunctions.cloneObj(oRFL.updated[nT_slug]);
        } else {
            var oNodeTo = MiscFunctions.cloneObj(oRFL.current[nT_slug]);
        }
    }

    if (oAuxiliaryData.hasOwnProperty("slug")) {
        // console.log("qwerty; oAuxiliaryData: "+JSON.stringify(oAuxiliaryData,null,4))
        var node_slug = oAuxiliaryData.slug;
        // console.log("qwerty; oAuxiliaryData: "+JSON.stringify(oAuxiliaryData,null,4)+"; node_slug: "+node_slug)
        if (oRFL.updated.hasOwnProperty(node_slug)) {
            var oNode = MiscFunctions.cloneObj(oRFL.updated[node_slug]);
        } else {
            var oNode = MiscFunctions.cloneObj(oRFL.current[node_slug]);
        }
        // console.log("qwerty; oNode: "+JSON.stringify(oNode,null,4))
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

    switch (actionName) {
`;


const actions_footer = `
        default:
            // code
            break;
    }

    oRFL.nonce = await MiscFunctions.timeout(20);

    return oRFL;
}

const executeQueuedS1nActions = async (oS1nPatternQueue,oMapPatternToActions,oRawFileLookup) => {
    jQuery("#runningActionsStatusIndicator").css("backgroundColor","yellow");
    var reportHTML = "";
    reportHTML += "executeQueuedS1nActions";
    reportHTML += "<br>";
    var oRawFileLookupB = MiscFunctions.cloneObj(oRawFileLookup)
    var verboseConsole = true;

    var aPatternList = Object.keys(oS1nPatternQueue);

    console.log("executeQueuedS1nActions_oS1nPatternQueue: "+JSON.stringify(oS1nPatternQueue,null,4)+"; aPatternList: "+JSON.stringify(aPatternList,null,4))
    for (var z=0;z<aPatternList.length;z++) {

        var pattern = aPatternList[z];
        var patternHTML = z + " " + pattern;
        jQuery("#runningActionsStatusIndicator").html(patternHTML);

        var aAuxiliaryData = oS1nPatternQueue[pattern];

        var numAuxData = aAuxiliaryData.length;
        console.log("executeQueuedS1nActions_oS1nPatternQueue; z: "+z+"; pattern: "+pattern+"; numAuxData: "+numAuxData)

        var aInducedActions = oMapPatternToActions[pattern];
        reportHTML += "pattern: "+pattern+"("+numAuxData+"); aInducedActions: "+JSON.stringify(aInducedActions,null,4);
        var numInducedActions = aInducedActions.length;
        reportHTML += "<br>";
        if (verboseConsole) { console.log("executeQueuedS1nActions; pattern: "+pattern+"; numAuxData: "+numAuxData+"; aInducedActions: "+JSON.stringify(aInducedActions,null,4) ) }

        for (var p=0;p<numAuxData;p++) {
            var oNextAuxData = aAuxiliaryData[p];
            if (verboseConsole) { console.log("executeQueuedS1nActions; numInducedActions: "+numInducedActions) }
            for (var a=0;a<numInducedActions;a++) {
                var nextAction = aInducedActions[a];
                // if (verboseConsole) { console.log("executeQueuedS1nActions; p: "+p+"; a: "+a+"; nextAction: "+nextAction) }
                oRawFileLookupB = MiscFunctions.cloneObj(await executeSingleAction(nextAction,oNextAuxData,oRawFileLookupB));
                // MiscFunctions.printObjToConsole(oRawFileLookup)
                // if (verboseConsole) { console.log { console.log("oRawFileLookupB.updated: "+JSON.stringify(oRawFileLookupB.updated,null,4)) }
                updateRawFile(oRawFileLookupB.updated,oRawFileLookup.current,oRawFileLookupB.new);
            }
        }
    }
    jQuery("#runningActionsStatusIndicator").css("backgroundColor","#CFCFCF");

    return reportHTML;
}

const executeQueuedS1rActions = async (oS1rPatternQueue,oMapPatternToActions,oRawFileLookup) => {
    jQuery("#runningActionsStatusIndicator").css("backgroundColor","#99ccff");
    var reportHTML = "";
    reportHTML += "executeQueuedS1rActions";
    reportHTML += "<br>";
    var oRawFileLookupB = MiscFunctions.cloneObj(oRawFileLookup)
    var verboseConsole = true;

    var aPatternList = Object.keys(oS1rPatternQueue);

    for (var z=0;z<aPatternList.length;z++) {

        var pattern = aPatternList[z];
        var patternHTML = z + " " + pattern;
        jQuery("#runningActionsStatusIndicator").html(patternHTML);

        var aAuxiliaryData = oS1rPatternQueue[pattern];

        var numAuxData = aAuxiliaryData.length;
        var aInducedActions = oMapPatternToActions[pattern];
        reportHTML += "pattern: "+pattern+"("+numAuxData+"); aInducedActions: "+JSON.stringify(aInducedActions,null,4);
        var numInducedActions = aInducedActions.length;
        reportHTML += "<br>";
        if (verboseConsole) { console.log("executeQueuedS1rActions; pattern: "+pattern+"; numAuxData: "+numAuxData+"; aInducedActions: "+JSON.stringify(aInducedActions,null,4) ) }
        for (var p=0;p<numAuxData;p++) {
            var oNextAuxData = aAuxiliaryData[p];
            // if (verboseConsole) { console.log("executeQueuedS1rActions; numInducedActions: "+numInducedActions) }
            for (var a=0;a<numInducedActions;a++) {
                var nextAction = aInducedActions[a];
                // if (verboseConsole) { console.log("executeQueuedS1rActions; p: "+p+"; a: "+a+"; nextAction: "+nextAction) }
                oRawFileLookupB = MiscFunctions.cloneObj(await executeSingleAction(nextAction,oNextAuxData,oRawFileLookupB));
                // MiscFunctions.printObjToConsole(oRawFileLookup)
                // if (verboseConsole) { console.log { console.log("oRawFileLookupB.updated: "+JSON.stringify(oRawFileLookupB.updated,null,4)) }
                updateRawFile(oRawFileLookupB.updated,oRawFileLookup.current,oRawFileLookupB.new);
            }
        }
    }

    jQuery("#runningActionsStatusIndicator").css("backgroundColor","#CFCFCF");

    // oActionDataOutput.oRawFileLookup.updated = oRFL.updated;

    return reportHTML;
}

const executeQueuedS2rActions = async (oS2rPatternQueue,oMapPatternToActions,oRawFileLookup) => {
    var reportHTML = "";
    reportHTML += "executeQueuedS2rActions";
    reportHTML += "<br>";

    return reportHTML;
}

const runActionsOneTime = async (thisState) => {
    window.neuroCore.oRFL.updated = {};
    var oActiveConceptGraph = thisState.activeConceptGraph;
    var oRawFileLookup = MiscFunctions.cloneObj(oActiveConceptGraph.rawFileLookup);
    // var oRawFileUpdatedLookup = oActiveConceptGraph.rawFileUpdatedLookup;
    var oPatterns = thisState.patterns;
    var oS1nPatternQueue = thisState.patterns.patternMatches.s1n;
    var oS1rPatternQueue = thisState.patterns.patternMatches.s1r;
    var oS2rPatternQueue = thisState.patterns.patternMatches.s2r;

    var oMapPatternToActions = thisState.patterns.mapPatternToActions;
    // console.log("oMapPatternToActions: "+JSON.stringify(oMapPatternToActions,null,4));

    var isAllActionsChecked = jQuery("#executeAllActions").prop("checked");
    var isS1nActionsChecked = jQuery("#executeS1nActions").prop("checked");
    var isS1rActionsChecked = jQuery("#executeS1nActions").prop("checked");
    var isS2rActionsChecked = jQuery("#executeS1nActions").prop("checked");
    var isJustOneActionChecked = jQuery("#justOneAction").prop("checked");
    var isMakeActionsListChecked = jQuery("#makeActionsList").prop("checked");

    var reportHTML = "";
    if (isAllActionsChecked) {
        reportHTML += "running ALL ACTIONS triggered by PATTERNS QUEUE";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
        reportHTML += await executeQueuedS1nActions(oS1nPatternQueue,oMapPatternToActions,oRawFileLookup)
        reportHTML += await executeQueuedS1rActions(oS1rPatternQueue,oMapPatternToActions,oRawFileLookup)
        reportHTML += await executeQueuedS2rActions(oS2rPatternQueue,oMapPatternToActions,oRawFileLookup)
    }
    if (isS1nActionsChecked) {
        reportHTML += "running ALL ACTIONS triggered by S1n PATTERNS QUEUE";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
        reportHTML += await executeQueuedS1nActions(oS1nPatternQueue,oMapPatternToActions,oRawFileLookup)
    }
    if (isS1rActionsChecked) {
        reportHTML += "running ALL ACTIONS triggered by S1r PATTERNS QUEUE";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
        reportHTML += await executeQueuedS1rActions(oS1rPatternQueue,oMapPatternToActions,oRawFileLookup)
    }
    if (isS2rActionsChecked) {
        reportHTML += "running ALL ACTIONS triggered by S2r PATTERNS QUEUE";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
        reportHTML += await executeQueuedS2rActions(oS2rPatternQueue,oMapPatternToActions,oRawFileLookup)
    }
    if (isJustOneActionChecked) {
        reportHTML += "running JUST THE FIRST ACTION triggered by the PATTERNS QUEUE";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
    }
    if (isMakeActionsListChecked) {
        reportHTML += "GENERATE ACTIONS QUEUE from the PATTERNS QUEUE)";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
    }
    jQuery("#neuroCoreReportContainer").html(reportHTML)
    jQuery("#neuroCoreReportContainer").val(reportHTML)

    // jQuery("#patternMatchesButton").trigger("click")

}

export { runActionsOneTime };

`;

const transferActionFunctions = async () => {
    console.log("updateConceptGraphActions_u1n")
    var sql = " SELECT * from conceptGraphActions_u1n ";
    console.log("updateNodeLookup sql: "+sql)

    var r = await sendAsync(sql).then( async (result) => {
        var aResult = result;
        var numRows = aResult.length;
        // console.log("updateConceptGraphActions_u1n numRows: "+numRows)
        var outputFile = "";
        outputFile += actions_header;
        for (var r=0;r<numRows;r++) {
            var oNextAction = aResult[r];
            var nextAction_id = oNextAction.id;
            var nextAction_actionName = oNextAction.actionName;
            var nextAction_opCodesB = oNextAction.opCodesB;
            var nextAction_patternsList = oNextAction.patternsList;
            var nextAction_javascript = oNextAction.javascript;
            var nextAction_javascript_formatted = "                "+nextAction_javascript.replaceAll("\n","\n                ")+"\n";

            var nextAction_actionName_converted = nextAction_actionName.replaceAll(".","_").toLowerCase();

            // console.log("updateConceptGraphActions_u1n nextAction_actionName: "+nextAction_actionName+"; nextAction_javascript: "+nextAction_javascript)

            window.lookupActionJavascriptByName[nextAction_actionName] = nextAction_javascript;
            // outputFile += nextAction_javascript;
            // outputFile += "\n\n";
            outputFile += `        case "`+nextAction_actionName+`": \n`;
            outputFile += `            if (verboseConsole) { console.log("case `+nextAction_actionName+`") } \n`;
            /*
            outputFile += `             // var oActionDataOutput = MiscFunctions.cloneObj(`;
            outputFile += `A_`+nextAction_opCodesB;
            outputFile += `.`+nextAction_actionName_converted;
            outputFile += `(oActionData)); \n`;
            */
            // outputFile += `/* \n`;
            outputFile += `            try { \n`;
            outputFile += nextAction_javascript_formatted;
            outputFile += `            } catch (err) {\n`;
            outputFile += `                console.log("javaScriptError with action `+nextAction_actionName_converted+`; err: "+err); \n`;
            outputFile += `                console.log("nF_slug: "+nF_slug+"; "); \n`;
            outputFile += `            } \n`;
            // outputFile += `\n */ `;
            // outputFile += ` \n             // oActionDataOutput.oRawFileLookup.updated = oRFL.updated; \n`;
            // outputFile += `             // oRFL = oActionDataOutput.oRawFileLookup; \n`;
            outputFile += `            break; \n`;
        }

        outputFile += actions_footer;

        electronFs.writeFile("src/plex/neuroCore/neuroCoreFunctions/runActionsOneTime.js", outputFile, (err) => {
            if (err)
                console.log(err);
            else {
                console.log("runActionsOneTime written successfully\n");
                // console.log("The written has the following contents:");
                // console.log(fs.readFileSync("src/plex/neuroCore/neuroCoreFunctions/runActionsOneTime.js", "utf8"));
            }
        });

        return true;
    })
    // alert("done with updateNodeLookup")

    return r;
}

export default class RecreateRunActionsOneTime extends React.Component {
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
                  Rewrite file: runActionsOneTime.js<br/>
                  (Do this every time code is updated in Table for Actions (u1n),
                  <br/>
                  by transferring data from SQL table: updateConceptGraphActions_u1n to runActionsOneTime.js.)
                  <br/>
                  ( src/plex/neuroCore/neuroCoreFunctions/runActionsOneTime.js)
                  <br/>
                  <div id="transferActionFunctionsButton" className="doSomethingButton">rewrite</div>
              </div>
          </>
        );
    }
}
