import React, { useState, useEffect } from "react";
import * as MiscFunctions from '../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../lib/ipfs/miscIpfsFunctions.js';
import * as ConceptGraphInMfsFunctions from '../lib/ipfs/conceptGraphInMfsFunctions.js';
// import * as ExecuteSingleAction from './executeSingleAction.js'
// import * as ExecuteSinglePattern_s1n from './neuroCoreFunctions/patterns/patterns-s1n.js'
import * as ExecuteSingleAction from '../neuroCore2/executeSingleAction.js'
import * as ExecuteSinglePattern_s1n from '../neuroCore2/neuroCoreFunctions/patterns/patterns-s1n.js'
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");

/*
const timeout = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const updateOldWordReplacementMapNeuroCore = () => {
    console.log("updateOldWordReplacementMap")
    window.ipfs.neuroCore.engine.oOldWordReplacementMap = {};
    window.ipfs.neuroCore.engine.aOldReplacedWords = [];
    window.ipfs.neuroCore.engine.aNewReplacerWords = [];
    var oWRP = {};
    var aWords = Object.keys(window.ipfs.neuroCore.engine.oRFL.current)
    for (var w=0;w<aWords.length;w++) {
        var wordSlug = aWords[w];
        var oWord = window.ipfs.neuroCore.engine.oRFL.current[wordSlug]
        if (oWord.metaData.hasOwnProperty("replacementFor")) {
            var rF_slug = oWord.metaData.replacementFor;
            oWRP[rF_slug] = wordSlug;
            window.ipfs.neuroCore.engine.oOldWordReplacementMap[rF_slug] = wordSlug;
            window.ipfs.neuroCore.engine.aOldReplacedWords.push(rF_slug);
            window.ipfs.neuroCore.engine.aNewReplacerWords.push(wordSlug);
        }
    }
    return oWRP;
}
*/


const executeSingleNeuroCore3Pattern_s1n = async (patternSlug,oAuxiliaryPatternData,whichNeuroCore) => {
    var oPattern = window.ipfs.neuroCore.engine.oRFL.current[patternSlug];
    var patternName = oPattern.patternData.name;
    var aActions = [];
    if (oPattern.patternData.hasOwnProperty("actions")) {
        aActions = oPattern.patternData.actions;
    }
    // var nodesAdditionalRestriction = false;

    var nodeAdditionalRestriction = false;

    var aNodes = [];
    // search through every node in the concept graph
    if (oAuxiliaryPatternData.searchMethod == "default") {
        // no additional requirements
        nodeAdditionalRestriction = false;
        // aNodes = Object.keys(window.lookupWordBySlug);
        aNodes = Object.keys(window.ipfs.neuroCore.subject.oRFL.current);
    }
    // limit the search to a specified set of nodes
    if (oAuxiliaryPatternData.searchMethod == "restrictedDomain") {
        if (oAuxiliaryPatternData.domains.domainSpecificationMethod == "explicitArray") {
            aNodes = oAuxiliaryPatternData.domains.aNodes;
        }
        // limit the search to a specified set of nodes
        if (oAuxiliaryPatternData.domains.domainSpecificationMethod == "globalDynamicDataSpecificInstances") {
            var wordSlug = oAuxiliaryPatternData.domains.wordSlug;
            // var oWord = MiscFunctions.cloneObj(window.lookupWordBySlug[wordSlug]);
            var oWord = MiscFunctions.cloneObj(window.ipfs.neuroCore.subject.oRFL.current[wordSlug]);
            aNodes = oWord.globalDynamicData.specificInstances;
        }
        nodeAdditionalRestriction = true;
        if ( (aNodes==null) || (aNodes=="_ANY_") ) {
            nodeAdditionalRestriction = false;
        }
    }

    for (var r=0;r<aNodes.length;r++) {
        var node_slug = aNodes[r];
        var oCheckSingleS1nPatternOutput = await ExecuteSinglePattern_s1n.checkSingleS1nPattern(node_slug,patternName,whichNeuroCore)

        var isPatternPresent = oCheckSingleS1nPatternOutput.isPatternPresent;
        if (isPatternPresent) {

            var oAuxiliaryData = oCheckSingleS1nPatternOutput.oAuxiliaryData;
            // if useAActionsToTriggerData is true, then aActions is defined within the pattern's javascript
            if (oCheckSingleS1nPatternOutput.useAActionsToTriggerData == true) {
                aActions = MiscFunctions.cloneObj(oCheckSingleS1nPatternOutput.aActionsToTrigger);
            }
            // if useAActionsToTriggerData is false, then use older method of triggering every action in aActions defined within patternData (i.e. all or none)
            // and passing identical information to each action
            console.log("found an s1n match! patternName: "+patternName+"; node_slug: "+node_slug+"; aActions: "+JSON.stringify(aActions,null,4))
            for (var z=0;z<aActions.length;z++) {
                var nextAction = aActions[z];

                var oNextAction = {}
                oNextAction.actionSlug = nextAction;
                oNextAction.r = r;
                oNextAction.oAuxiliaryData = oAuxiliaryData
                var sNextAction = JSON.stringify(oNextAction,null,4)

                var actionListHTML = "";
                actionListHTML += "<div style=margin:0px;padding:0px; >";
                actionListHTML += "<textarea id='action_"+nextAction+"_"+r+"' class='activeNeuroCore3ActionBox' style='display:inline-block;width:390px;height:100px;border:1px solid black;margin:0px;' ";
                actionListHTML += "";
                actionListHTML += " >";
                actionListHTML += sNextAction;
                actionListHTML += "</textarea>";
                actionListHTML += "</div>";
                jQuery("#actions_nc3_active_container").append(actionListHTML);
            }
        }
    }
}

const executeSingleNeuroCore3Pattern_s1r = (patternSlug,oAuxiliaryPatternData,whichNeuroCore) => {
    var oPattern = window.ipfs.neuroCore.engine.oRFL.current[patternSlug];

    var nodeFromAdditionalRestriction = false;
    var nodeToAdditionalRestriction = false;

    // search through every node in the concept graph
    if (oAuxiliaryPatternData.searchMethod == "default") {
        // no additional requirements
        nodeFromAdditionalRestriction = false;
        nodeToAdditionalRestriction = false;
    }
    // limit the search to a specified set of nodes
    if (oAuxiliaryPatternData.searchMethod == "restrictedDomain") {
        var aNodesFrom = oAuxiliaryPatternData.domains.aNodesFrom;
        var aNodesTo = oAuxiliaryPatternData.domains.aNodesTo;

        nodeFromAdditionalRestriction = true;
        if ( (aNodesFrom==null) || (aNodesFrom=="_ANY_") ) {
            nodeFromAdditionalRestriction = false;
        }

        nodeToAdditionalRestriction = true;
        if ( (aNodesTo==null) || (aNodesTo=="_ANY_") ) {
            nodeToAdditionalRestriction = false;
        }
    }

    var aActions = [];
    if (oPattern.patternData.hasOwnProperty("actions")) {
        aActions = oPattern.patternData.actions;
    }

    var wT_from = oPattern.patternData.singleRelationshipFieldsetData.wordType_from
    var relationshipType = oPattern.patternData.singleRelationshipFieldsetData.relationshipType
    var wT_to = oPattern.patternData.singleRelationshipFieldsetData.wordType_to

    // this is to fix a temporary error that applies only to these two relationshipTypes
    if (relationshipType=="relationshipType_isASpecificInstanceOf") {
        relationshipType = "isASpecificInstanceOf"
    }
    if (relationshipType=="relationshipType_subsetOf") {
        relationshipType = "subsetOf"
    }

    if (!wT_from) { wT_from = "ANY"; }
    if (!wT_to) { wT_to = "ANY"; }

    if (whichNeuroCore=="NeuroCore2") {
        var aRels = window.neuroCore.subject.allConceptGraphRelationships;
    }
    if (whichNeuroCore=="NeuroCore3") {
        var aRels = window.ipfs.neuroCore.subject.allConceptGraphRelationships;
    }
    for (var r=0;r<aRels.length;r++) {
        var oNextRel = aRels[r];
        // console.log("qwertyy; oNextRel: "+JSON.stringify(oNextRel,null,4))
        var nF_slug = oNextRel.nodeFrom.slug;
        var rT_slug = oNextRel.relationshipType.slug;
        var nT_slug = oNextRel.nodeTo.slug;

        var crit1 = false; // does rT match?
        var crit2 = false; // does nF wordType match?
        var crit3 = false; // does nT wordType match?

        var crit4 = false; // if nodeFromAdditionalRestriction==true, is nF in aNodesFrom?
        var crit5 = false; // if nodeToAdditionalRestriction==true, is nT in aNodesTo?

        // crit4
        if (nodeFromAdditionalRestriction==false) {
            crit4 = true;
        }
        if (nodeFromAdditionalRestriction==true) {
            if (aNodesFrom.includes(nF_slug)) {
                crit4 = true;
            }
        }

        // crit5
        if (nodeToAdditionalRestriction==false) {
            crit5 = true;
        }
        if (nodeToAdditionalRestriction==true) {
            if (aNodesTo.includes(nT_slug)) {
                crit5 = true;
            }
        }

        // crit1, crit2, crit3
        if (relationshipType==rT_slug) {
            crit1 = true;
            // console.log("crit1 true!")
        }

        // var oNodeFrom = window.lookupWordBySlug[nF_slug];
        var oNodeFrom = window.ipfs.neuroCore.subject.oRFL.current[nF_slug];
        // console.log("qwertyy; nF_slug: "+nF_slug+"; oNodeFrom: "+JSON.stringify(oNodeFrom,null,4))
        var nF_wordTypes = oNodeFrom.wordData.wordTypes;
        if (nF_wordTypes.includes(wT_from)) {
            crit2 = true;
            // console.log("crit2 true!")
        }
        if (wT_from=="ANY") {
            crit2 = true;
            // console.log("crit2 true!")
        }

        // var oNodeTo = window.lookupWordBySlug[nT_slug];
        var oNodeTo = window.ipfs.neuroCore.subject.oRFL.current[nT_slug];
        var nT_wordTypes = oNodeTo.wordData.wordTypes;
        if (nT_wordTypes.includes(wT_to)) {
            crit3 = true;
            // console.log("crit3 true!")
        }
        if (wT_to=="ANY") {
            crit3 = true;
            // console.log("crit3 true!")
        }
        // console.log("qwerty nF_slug: "+nF_slug+"; rT_slug: "+rT_slug+"; nT_slug: "+nT_slug+"; crit1: "+crit1+"; crit2: "+crit2+"; crit3: "+crit3+"; crit4: "+crit4+"; crit5: "+crit5)
        var doesPatternMatch = false;
        if ( (crit1) && (crit2) && (crit3) && (crit4) && (crit5) ) {
            var doesPatternMatch = true;
            for (var z=0;z<aActions.length;z++) {
                var nextAction = aActions[z];

                var oNextAction = {}
                oNextAction.actionSlug = nextAction;
                oNextAction.r = r;
                oNextAction.oAuxiliaryData = {};
                oNextAction.oAuxiliaryData.relationship = oNextRel;
                var sNextAction = JSON.stringify(oNextAction,null,4)

                var actionListHTML = "";
                actionListHTML += "<div style=margin:0px;padding:0px; >";
                actionListHTML += "<textarea id='action_"+nextAction+"_"+r+"' class='activeNeuroCore3ActionBox' style='display:inline-block;width:390px;height:100px;border:1px solid black;margin:0px;' ";
                actionListHTML += "";
                actionListHTML += " >";
                actionListHTML += sNextAction;
                actionListHTML += "</textarea>";
                actionListHTML += "</div>";
                jQuery("#actions_nc3_active_container").append(actionListHTML);
            }
        }
    }
}

const executeOneNeuroCore3Pattern = async (patternIndex,patternSlug,patternName,oAuxiliaryPatternData,whichNeuroCore) => {
    jQuery("#activeNeuroCore3Pattern_"+patternIndex).css("background-color","yellow");
    jQuery("#actions_nc3_active_container").html("");
    // console.log("oAuxiliaryPatternData: "+JSON.stringify(oAuxiliaryPatternData));
    // var oAuxiliaryPatternData = JSON.parse(sAuxiliaryPatternData);
    // var oAuxiliaryPatternData = {};

    console.log("executeOneNeuroCore3Pattern patternSlug: "+patternSlug)

    var oPattern = window.ipfs.neuroCore.engine.oRFL.current[patternSlug];

    // console.log("executeOneNeuroCore3Pattern patternSlug: "+patternSlug+"; oPattern: "+JSON.stringify(oPattern,null,4))
    var inputField = oPattern.patternData.inputField;

    if (inputField=="singleNode") {
        await executeSingleNeuroCore3Pattern_s1n(patternSlug,oAuxiliaryPatternData,whichNeuroCore)
    }
    if (inputField=="singleRelationship") {
        await executeSingleNeuroCore3Pattern_s1r(patternSlug,oAuxiliaryPatternData,whichNeuroCore)
    }
    if (inputField=="doubleRelationship") {
        // not yet complete
    }

    await MiscFunctions.timeout(0)

    jQuery("#activeNeuroCore3Pattern_"+patternIndex).css("background-color","green");
}

const makeNewWord = async (slugToCreate,newUniqueID,whichNeuroCore) => {
    if (whichNeuroCore=="NeuroCore2") {
        var oWord_new = window.neuroCore.engine.oRecordOfUpdates[newUniqueID].new;
        var fooResult = await MiscFunctions.createOrUpdateWordInAllTables(oWord_new)
        window.neuroCore.subject.oRFL.current[slugToCreate] = oWord_new;
        window.neuroCore.subject.oRFL.new[slugToCreate] = oWord_new;
        return fooResult;
    }
    if (whichNeuroCore=="NeuroCore3") {
        var oWord_new = window.ipfs.neuroCore.engine.oRecordOfUpdates[newUniqueID].new;
        var fooResult = await ConceptGraphInMfsFunctions.createOrUpdateWordInMFS(oWord_new)
        window.ipfs.neuroCore.subject.oRFL.current[slugToCreate] = oWord_new;
        window.ipfs.neuroCore.subject.oRFL.new[slugToCreate] = oWord_new;
        return fooResult;
    }
}

const updateWord = async (slugToUpdate,updateUniqueID,whichNeuroCore) => {
    if (whichNeuroCore=="NeuroCore2") {
        var oWord_old = window.neuroCore.engine.oRecordOfUpdates[updateUniqueID].old;
        var oWord_new = window.neuroCore.engine.oRecordOfUpdates[updateUniqueID].new;
        var fooResult = await MiscFunctions.createOrUpdateWordInAllTables(oWord_new)
        return fooResult;
    }
    if (whichNeuroCore=="NeuroCore3") {
        // NEED TO COMPLETE
        var oWord_old = window.ipfs.neuroCore.engine.oRecordOfUpdates[updateUniqueID].old;
        var oWord_new = window.ipfs.neuroCore.engine.oRecordOfUpdates[updateUniqueID].new;
        var fooResult = await ConceptGraphInMfsFunctions.createOrUpdateWordInMFS(oWord_new)
        return fooResult;
    }
}

const executeAllNeuroCore3Actions = async (nc2CycleNumber,p,whichNeuroCore) => {
    var aActiveActions = [];
    jQuery(".activeNeuroCore3ActionBox").each(function(index){
        var sAction = jQuery(this).html()
        var oAction = JSON.parse(sAction);
        aActiveActions.push(oAction)
    })

    for (var a=0;a<aActiveActions.length;a++) {
        var oNextActiveAction = aActiveActions[a];
        var oRFL_updated = await ExecuteSingleAction.executeSingleAction(oNextActiveAction,nc2CycleNumber,p,a,whichNeuroCore);
        // plexNeuroCore.oRFL = MiscFunctions.cloneObj(oRFL_updated);
        window.ipfs.neuroCore.subject.oRFL = MiscFunctions.cloneObj(oRFL_updated);
    }
    jQuery(".updateNeuroCore3WordButton").click(async function(){
        var slugToUpdate = jQuery(this).data("slug");
        var updateUniqueID = jQuery(this).data("updateuniqueidentifier");
        var fooResult = await updateWord(slugToUpdate,updateUniqueID,whichNeuroCore);
    })
    jQuery(".makeNewNeuroCore3WordButton").click(async function(){
        var slugToCreate = jQuery(this).data("slug");
        var newUniqueID = jQuery(this).data("newuniqueidentifier");
        var fooResult = await makeNewWord(slugToCreate,newUniqueID,whichNeuroCore);
    })
    jQuery(".actionNeuroCore3UpdatingWord").click(function(){
        var updateUniqueID = jQuery(this).data("updateuniqueidentifier");
        console.log("actionNeuroCore3UpdatingWord_clicked; updateUniqueID: "+updateUniqueID)

        var oWord_actionNeuroCore3UpdatingWord_old = { "error": "unknown", "type": "actionNeuroCore3UpdatingWord" };
        var oWord_actionNeuroCore3UpdatingWord_new = { "error": "unknown", "type": "actionNeuroCore3UpdatingWord" };
        if (window.ipfs.neuroCore.engine.oRecordOfUpdates.hasOwnProperty(updateUniqueID)) {
            oWord_actionNeuroCore3UpdatingWord_old = MiscFunctions.cloneObj(window.ipfs.neuroCore.engine.oRecordOfUpdates[updateUniqueID].old);
            oWord_actionNeuroCore3UpdatingWord_new = MiscFunctions.cloneObj(window.ipfs.neuroCore.engine.oRecordOfUpdates[updateUniqueID].new);
        }
        var sWord_actionNeuroCore3UpdatingWord_old = JSON.stringify(oWord_actionNeuroCore3UpdatingWord_old,null,4);
        var sWord_actionNeuroCore3UpdatingWord_new = JSON.stringify(oWord_actionNeuroCore3UpdatingWord_new,null,4);

        jQuery("#wordNeuroCore3OldContainer").val(sWord_actionNeuroCore3UpdatingWord_old)
        jQuery("#wordNeuroCore3NewContainer").val(sWord_actionNeuroCore3UpdatingWord_new)
    })
    jQuery(".newNeuroCore3UniqueIdentifier").click(function(){
        var updateUniqueID = jQuery(this).data("updateuniqueidentifier");
        console.log("newNeuroCore3UniqueIdentifier_clicked; updateUniqueID: "+updateUniqueID)

        var oWord_newNeuroCore3UniqueIdentifier_old = { "error": "unknown", "type": "newNeuroCore3UniqueIdentifier" };
        var oWord_newNeuroCore3UniqueIdentifier_new = { "error": "unknown", "type": "newNeuroCore3UniqueIdentifier" };
        if (window.ipfs.neuroCore.engine.oRecordOfUpdates.hasOwnProperty(updateUniqueID)) {
            oWord_newNeuroCore3UniqueIdentifier_old = MiscFunctions.cloneObj(window.ipfs.neuroCore.engine.oRecordOfUpdates[updateUniqueID].old);
            oWord_newNeuroCore3UniqueIdentifier_new = MiscFunctions.cloneObj(window.ipfs.neuroCore.engine.oRecordOfUpdates[updateUniqueID].new);
        }
        var sWord_newNeuroCore3UniqueIdentifier_old = JSON.stringify(oWord_newNeuroCore3UniqueIdentifier_old,null,4);
        var sWord_newNeuroCore3UniqueIdentifier_new = JSON.stringify(oWord_newNeuroCore3UniqueIdentifier_new,null,4);

        jQuery("#wordNeuroCore3OldContainer").val(sWord_newNeuroCore3UniqueIdentifier_old)
        jQuery("#wordNeuroCore3NewContainer").val(sWord_newNeuroCore3UniqueIdentifier_new)
    })
    // console.log("plexNeuroCore.oRecordOfUpdates: "+JSON.stringify(plexNeuroCore.oRecordOfUpdates,null,4))
}
var startingNeuroCore3Cycle0Time = 0;
export const startNeuroCore3 = async (neuroCore3CycleNumber) => {
    // here, changesMadeYetThisCycle actually indicates the previous cycle
    var whichNeuroCore = "NeuroCore3";
    if (window.ipfs.neuroCore.engine.changesMadeYetThisCycle == true) {
        var aAuxiliaryPatternData = [];
        var oAuxiliaryPatternData = {"searchMethod":"default","patternName":"P.r.s1n.initialProcessing"};
        aAuxiliaryPatternData.push(oAuxiliaryPatternData)
        ExecuteSingleAction.addAuxiliaryPatternDataToQueue(aAuxiliaryPatternData,whichNeuroCore)
    }
    window.ipfs.neuroCore.engine.changesMadeYetThisCycle = false;
    var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName;
    var foo = await MiscFunctions.updateNodeLookup4(neuroCore3CycleNumber,conceptGraphTableName);
    await MiscFunctions.timeout(100);
    console.log("startNeuroCore3; neuroCore3CycleNumber: "+neuroCore3CycleNumber)
    ////// always add a-r-u1n-updateinitialprocessing to the end of the pattern search
    var aAuxiliaryPatternData = [];
    var oAuxiliaryPatternData = {"searchMethod":"default","patternName":"P.r.s1n.initialProcessing"};
    aAuxiliaryPatternData.push(oAuxiliaryPatternData)
    //////
    if (neuroCore3CycleNumber==0) {
        window.ipfs.neuroCore.engine.changesMadeYetThisSupercycle = false;
        startingNeuroCore3Cycle0Time = Date.now();
        jQuery("#neuroCore3ActivityLogContainer").html("STARTING neuroCore3 <br>");
        window.ipfs.neuroCore.engine.oRecordOfUpdates = {};
        window.ipfs.neuroCore.engine.oPatternsWithAuxiliaryDataQueue = {};
        jQuery("#patterns_nc3_completed_container").html("")
        jQuery("#patterns_nc3_queue_container").html("")
        jQuery("#numberQueuedNeuroCore3PatternsContainer").html(0);
        jQuery("#neuroCore3ActivityLogContainer").html("")
        jQuery("#neuroCore3ActivityLogContainer").append("STARTING neuroCore3; neuroCore3CycleNumber: "+neuroCore3CycleNumber+"; time: "+startingNeuroCore3Cycle0Time+"<br><br>")
    }
    jQuery("#NC2StatusIndicator").html("running");
    jQuery("#NC2StatusIndicator").data("currentstatus","running");
    jQuery("#NC2StatusIndicator").css("background-color","orange");
    var repeatLoop = jQuery("#repeatLoopOverNeuroCore3PatternListSelector option:selected").val();
    if (repeatLoop=="managed") {
        jQuery(".neuroCore3PatternCheckbox").prop("checked",false);
    }
    var aActivePatterns = [];

    jQuery("#patterns_nc3_active_container .activeNeuroCore3PatternBox").each(function(index){
        var patternName = jQuery(this).data("patternname")
        var patternSlug = jQuery(this).data("patternslug")
        var patternIndex = jQuery(this).data("patternindex")
        var oAuxiliaryPatternData = jQuery(this).data("auxiliarypatterndata")
        // var oAuxiliaryPatternData = JSON.parse(sAuxiliaryPatternData)
        aActivePatterns.push([patternIndex,patternSlug,patternName,oAuxiliaryPatternData])
    })
    var cT = Date.now();
    var eT = cT - startingNeuroCore3Cycle0Time;
    jQuery("#neuroCore3ActivityLogContainer").append("Starting neuroCore3; neuroCore3CycleNumber: "+neuroCore3CycleNumber+"; aActivePatterns.length: "+aActivePatterns.length+"; elapsed time: "+eT+"<br>")
    // console.log("qwerty startNeuroCore3; neuroCore3CycleNumber: "+neuroCore3CycleNumber+"; aActivePatterns.length: "+aActivePatterns.length)
    if (aActivePatterns.length==0) {
        var cT = Date.now();
        var eT = cT - startingNeuroCore3Cycle0Time;
        jQuery("#neuroCore3ActivityLogContainer").append("<br>DONE with neuroCore3; no activePatterns left! elapsed time: " + eT )
        jQuery("#NC2StatusIndicator").html("off");
        jQuery("#NC2StatusIndicator").data("currentstatus","off");
        jQuery("#NC2StatusIndicator").css("background-color","#EFEFEF");
        document.getElementById("executeChangesNeuroCore3Selector").value="no";
        document.getElementById("repeatLoopOverNeuroCore3PatternListSelector").value="no";
    }
    if (aActivePatterns.length > 0) {
        for (var p=0;p<aActivePatterns.length;p++) {
            var nextActivePattern = aActivePatterns[p];
            // console.log("qwerty nextActivePattern p: "+p+"; ")
            await executeOneNeuroCore3Pattern(nextActivePattern[0],nextActivePattern[1],nextActivePattern[2],nextActivePattern[3],whichNeuroCore)

            await executeAllNeuroCore3Actions(neuroCore3CycleNumber,p,whichNeuroCore);
        }
        if (window.ipfs.neuroCore.engine.changesMadeYetThisCycle == true) {
            var aAuxiliaryPatternData = [];
            var oAuxiliaryPatternData = {"searchMethod":"default","patternName":"P.r.s1n.initialProcessing"};
            aAuxiliaryPatternData.push(oAuxiliaryPatternData)
        }
        // generate Patterns in Queue from window.ipfs.neuroCore.engine.oPatternsWithAuxiliaryDataQueue
        var oPWADQ = MiscFunctions.cloneObj(window.ipfs.neuroCore.engine.oPatternsWithAuxiliaryDataQueue);
        var aPWADQ = Object.keys(oPWADQ)
        var apIndex = 0;
        jQuery("#patterns_nc3_queue_container").html("");
        jQuery("#numberQueuedNeuroCore3PatternsContainer").html(apIndex)
        for (var p=0;p<aPWADQ.length;p++) {
            var pSlug = aPWADQ[p];
            var aAuxData = oPWADQ[pSlug]
            for (var d=0;d<aAuxData.length;d++) {
                var oAuxData = aAuxData[d];
                var sAuxiliaryPatternData = JSON.stringify(oAuxData)
                var pName = oAuxData.patternName;
                var nextActivePatternHTML = "";
                nextActivePatternHTML += "<div id='activeNeuroCore3Pattern_"+apIndex+"' data-auxiliarypatterndata='"+sAuxiliaryPatternData+"' data-patternindex='"+apIndex+"' data-patternname='"+pName+"' data-patternslug='"+pSlug+"' class='activeNeuroCore3PatternBox activeNeuroCore3Pattern_"+pName+"' ";
                nextActivePatternHTML += " style=font-size:10px; ";
                nextActivePatternHTML += " >";
                nextActivePatternHTML += pName;
                nextActivePatternHTML += " <br><li>searchMethod: "+oAuxData.searchMethod+"</li>";
                nextActivePatternHTML += "</div>";
                jQuery("#patterns_nc3_queue_container").append(nextActivePatternHTML)
                apIndex++;
                jQuery("#numberQueuedNeuroCore3PatternsContainer").html(apIndex)
            }
        }

        var cT = Date.now();
        var eT = cT - startingNeuroCore3Cycle0Time;
        jQuery("#neuroCore3ActivityLogContainer").append("Done with neuroCore3 cycle number: "+neuroCore3CycleNumber+"; elapsed time: "+eT+"<br><br>")
        // console.log("window.ipfs.neuroCore.engine.oPatternsWithAuxiliaryDataQueue: "+ JSON.stringify(window.ipfs.neuroCore.engine.oPatternsWithAuxiliaryDataQueue,null,4))
        // might need to deprecate repeatLoop=="always" or move this if loop outside the if (aActivePatterns.length > 0) requirement
        if (repeatLoop=="always") {
            populateActiveNeuroCore3PatternsFromQueue();
            var foo = neuroCore3CycleNumber + 1;
            startNeuroCore3(foo);
        }
        if (repeatLoop=="managed") {
            populateActiveNeuroCore3PatternsFromQueue();
            var numActivePatterns = jQuery("#numberActiveNeuroCore3PatternsContainer").html()
            // console.log("qwerty numActivePatterns: "+numActivePatterns)
            if (numActivePatterns > 0) {
                var foo = neuroCore3CycleNumber + 1;
                startNeuroCore3(foo);
            }
            if (numActivePatterns == 0) {
                jQuery("#NC2StatusIndicator").html("off");
                jQuery("#NC2StatusIndicator").data("currentstatus","off");
                jQuery("#NC2StatusIndicator").css("background-color","#EFEFEF");
                document.getElementById("executeChangesNeuroCore3Selector").value="no";
                document.getElementById("repeatLoopOverNeuroCore3PatternListSelector").value="no";
                if (window.oAutomatedImportData.running == true) {
                    var currStep = window.oAutomatedImportData.currentStep;
                    var queueNumber = window.oAutomatedImportData.currentQueueNumber;
                    if (currStep == "takingPowerNap") {
                        // trigger the slightly deeper nap
                        jQuery("#automatedImport_updateProgressContainer").html("... brief (1000 msec) arousal from sleep ...")
                        var fooVar = await MiscFunctions.timeout(1000)
                        window.oAutomatedImportData.currentStep = "takingDeeperNap";
                        jQuery("#automatedImport_updateProgressContainer").html("Taking a deeper nap!")
                        console.log("oAutomatedImport: takeADeeperNapButton")
                        jQuery("#takeADeeperNapButton").get(0).click();
                    }
                    if (currStep == "takingDeeperNap") {
                        // go back to import page and trigger the next command
                        window.oAutomatedImportData.currentStep = "done with naps!";
                        var cCN = window.oAutomatedImportData.currentCommandName;
                        if (cCN == "addAllConceptCores") {
                            // alert("current command name: "+cCN+"; time to trigger the next command: addAllConceptProperties!")
                            jQuery("#automatedImport_updateProgressContainer").html("time for: addAllConceptProperties!")
                            jQuery("#forAutomation_"+queueNumber+"_addAllConceptProperties").get(0).click();
                        }
                        if (cCN == "addAllConceptProperties") {
                            // alert("current command name: "+cCN+"; time to trigger the next command: addAllConceptSets !")
                            jQuery("#automatedImport_updateProgressContainer").html("time for: addAllConceptSets!")
                            jQuery("#forAutomation_"+queueNumber+"_addAllConceptSets").get(0).click();
                        }
                        if (cCN == "addAllConceptSets") {
                            // alert("current command name: "+cCN+"; time to trigger the next command: addAllConceptSets !")
                            jQuery("#automatedImport_updateProgressContainer").html("time for: addAllConceptSpecificInstances!")
                            jQuery("#forAutomation_"+queueNumber+"_addAllConceptSpecificInstances").get(0).click();
                        }
                        if (cCN == "addAllConceptSpecificInstances") {
                            // jQuery("#forAutomation_"+queueNumber+"_addAllConceptSpecificInstances").get(0).click();
                            jQuery("#automatedImport_updateProgressContainer").html("FINISHED!")
                            window.oAutomatedImportData.running = false;
                        }
                    }
                }
            }
        }
        if (repeatLoop=="no") {
            jQuery("#NC2StatusIndicator").html("off");
            jQuery("#NC2StatusIndicator").data("currentstatus","off");
            jQuery("#NC2StatusIndicator").css("background-color","#EFEFEF");
            document.getElementById("executeChangesNeuroCore3Selector").value="no";
            document.getElementById("repeatLoopOverNeuroCore3PatternListSelector").value="no";
        }
    }
}

export const selectAllPatterns = (set_slug) => {
    console.log("selectAllPatterns; set_slug: "+set_slug)
    var oSet = window.ipfs.neuroCore.engine.oRFL.current[set_slug]
    var aSi = oSet.globalDynamicData.specificInstances;
    for (var s=0;s<aSi.length;s++) {
        var nextPattern_slug = aSi[s];
        jQuery("#neuroCore3PatternCheckbox_"+nextPattern_slug).prop("checked",true);
    }
}
const deselectAllPatterns = (set_slug) => {
    var oSet = window.ipfs.neuroCore.engine.oRFL.current[set_slug];
    var aSi = oSet.globalDynamicData.specificInstances;
    for (var s=0;s<aSi.length;s++) {
        var nextPattern_slug = aSi[s];
        jQuery("#neuroCore3PatternCheckbox_"+nextPattern_slug).prop("checked",false);
    }
}

export const populateActiveNeuroCore3PatternsFromQueue = () => {
    jQuery("#patterns_nc3_completed_container").append("<div>next cycle</div>")
    jQuery("#patterns_nc3_completed_container").append(jQuery("#patterns_nc3_active_container").html())

    jQuery("#patterns_nc3_active_container").html(jQuery("#patterns_nc3_queue_container").html())
    jQuery("#numberActiveNeuroCore3PatternsContainer").html(jQuery("#numberQueuedNeuroCore3PatternsContainer").html())

    jQuery("#patterns_nc3_queue_container").html("")
    jQuery("#numberQueuedNeuroCore3PatternsContainer").html(0);
    window.ipfs.neuroCore.engine.oPatternsWithAuxiliaryDataQueue = {};
}

export const populateActiveNeuroCore3Patterns = () => {
    console.log("populateActiveNeuroCore3Patterns")
    jQuery("#patterns_nc3_active_container").html("")
    var numActivePatterns = 0;
    jQuery(".neuroCore3PatternCheckbox").each(function(index){
        var patternName = jQuery(this).data("patternname")
        var patternSlug = jQuery(this).data("patternslug")
        var isChecked = jQuery(this).prop("checked")
        if (isChecked) {
            // console.log("neuroCore3PatternCheckbox index: "+index+"; patternName: "+patternName)
            numActivePatterns++;
            var oAuxiliaryPatternData = {"searchMethod":"default"};
            var sAuxiliaryPatternData = JSON.stringify(oAuxiliaryPatternData);
            var nextActivePatternHTML = "";
            nextActivePatternHTML += "<div id='activeNeuroCore3Pattern_"+index+"' data-auxiliarypatterndata='"+sAuxiliaryPatternData+"' data-patternindex='"+index+"' data-patternname='"+patternName+"' data-patternslug='"+patternSlug+"' class='activeNeuroCore3PatternBox activeNeuroCore3Pattern_"+patternName+"' ";
            nextActivePatternHTML += " style=font-size:10px; ";
            nextActivePatternHTML += " >";
            nextActivePatternHTML += patternName;
            nextActivePatternHTML += " <br><li>searchMethod: default</li>";
            nextActivePatternHTML += "</div>";
            jQuery("#patterns_nc3_active_container").append(nextActivePatternHTML)
        }
    })
    jQuery("#numberActiveNeuroCore3PatternsContainer").html(numActivePatterns)
}

export const takeADeeperNap = () => {
    console.log("normaModeGoNeuroCore3Button clicked")
    // click deselect all
    jQuery("#deselectAllNeuroCore3PatternsButton").get(0).click();
    // click select normal mode
    jQuery("#selectAll_normalMode_NeuroCore3PatternsButton").get(0).click();
    // set both selectors to yes
    document.getElementById("executeChangesNeuroCore3Selector").value="yes";
    document.getElementById("repeatLoopOverNeuroCore3PatternListSelector").value="managed";
    // click the populate active patterns button
    jQuery("#populateActiveNeuroCore3PatternsButton").get(0).click();
    // then click the start button
    jQuery("#startNeuroCore3Button").get(0).click();
}

export default class NeuroCore3TopPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        var foo = true;

        jQuery("#reloadNeuroCore3Button").click(async function(){
            console.log("reloadNeuroCore3Button clicked")
            var foo = true;
            await ConceptGraphInMfsFunctions.loadNeuroCore3ConceptGraph(foo);
        })

        jQuery("#selectAllNeuroCore3PatternsButton").click(async function(){
            jQuery(".neuroCore3PatternCheckbox").prop("checked",true)
        })
        jQuery("#deselectAllNeuroCore3PatternsButton").click(async function(){
            jQuery(".neuroCore3PatternCheckbox").prop("checked",false)
        })

        jQuery("#selectAllS1nNeuroCore3PatternsButton").click(async function(){
            jQuery(".s1nNeuroCore3PatternCheckbox").prop("checked",true)
        })
        jQuery("#deselectAllS1nNeuroCore3PatternsButton").click(async function(){
            jQuery(".s1nNeuroCore3PatternCheckbox").prop("checked",false)
        })

        jQuery("#selectAllS1rNeuroCore3PatternsButton").click(async function(){
            jQuery(".s1rNeuroCore3PatternCheckbox").prop("checked",true)
        })
        jQuery("#deselectAllS1rNeuroCore3PatternsButton").click(async function(){
            jQuery(".s1rNeuroCore3PatternCheckbox").prop("checked",false)
        })

        jQuery("#selectAllS2rNeuroCore3PatternsButton").click(async function(){
            jQuery(".s2rNeuroCore3PatternCheckbox").prop("checked",true)
        })
        jQuery("#deselectAllS2rNeuroCore3PatternsButton").click(async function(){
            jQuery(".s2rNeuroCore3PatternCheckbox").prop("checked",false)
        })

        jQuery("#selectAll_loki_NeuroCore3PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_LokiPathwayMaintenance";
            selectAllPatterns(set_slug)
        })
        jQuery("#deselectAll_loki_NeuroCore3PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_LokiPathwayMaintenance";
            deselectAllPatterns(set_slug)
        })

        jQuery("#selectAll_propertyTree_NeuroCore3PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_propertyTreeMaintenance";
            selectAllPatterns(set_slug)
        })
        jQuery("#deselectAll_propertyTree_NeuroCore3PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_propertyTreeMaintenance";
            deselectAllPatterns(set_slug)
        })

        jQuery("#selectAll_conceptMaintenance_NeuroCore3PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_conceptStructure";
            selectAllPatterns(set_slug)
        })
        jQuery("#deselectAll_conceptMaintenance_NeuroCore3PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_conceptStructure";
            deselectAllPatterns(set_slug)
        })

        jQuery("#selectAll_rV_NeuroCore3PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_restrictsValueMaintenance";
            selectAllPatterns(set_slug)
        })
        jQuery("#deselectAll_rV_NeuroCore3PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_restrictsValueMaintenance";
            deselectAllPatterns(set_slug)
        })

        jQuery("#selectAll_enumeration_NeuroCore3PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_enumerationTreeMaintenance";
            selectAllPatterns(set_slug)
        })
        jQuery("#deselectAll_enumeration_NeuroCore3PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_enumerationTreeMaintenance";
            deselectAllPatterns(set_slug)
        })

        jQuery(".selectNeuroCore3PatternsButton").click(async function(){
            var set_slug = jQuery(this).data("setslug")
            selectAllPatterns(set_slug)
        })
        jQuery(".deselectNeuroCore3PatternsButton").click(async function(){
            var set_slug = jQuery(this).data("setslug")
            deselectAllPatterns(set_slug)
        })

        jQuery("#populateActiveNeuroCore3PatternsButton").click(async function(){
            populateActiveNeuroCore3Patterns();
        })
        jQuery("#startNeuroCore3Button").click(function(){
            console.log("startNeuroCore3Button clicked")
            var neuroCore3CycleNumber = 0;
            startNeuroCore3(neuroCore3CycleNumber);
        })
        jQuery("#normaModeGoNeuroCore3Button").click(function(){
            takeADeeperNap()
        })
    }
    render() {
        return (
            <>
                <div className="neuroCoreMonitoringPanel" id="neuroCore3MonitoringPanel" >
                    <center>
                      Neuro Core 3
                      <div style={{fontSize:"12px",textAlign:"left",display:"inline-block",marginLeft:"20px"}}>
                          <div style={{color:"grey",display:"inline-block",marginLeft:"30px"}}>plex active engine:</div> <div id="plexActiveEngineContainer" style={{display:"inline-block",marginLeft:"5px",color:"green"}}>pCG0</div>
                          <div style={{color:"grey",display:"inline-block",marginLeft:"30px"}}>neuroCore3 engine:</div> <div id="neuroCore3engineContainer" style={{display:"inline-block",marginLeft:"5px",color:"red"}}>pCG0</div>
                          <div style={{color:"grey",display:"inline-block",marginLeft:"30px"}}>neuroCore3 subject:</div> <div id="neuroCore3subjectContainer" style={{display:"inline-block",marginLeft:"5px",color:"purple"}}>pCG0</div>
                      </div>
                    </center>
                    execute changes: <select id="executeChangesNeuroCore3Selector" >
                        <option value="no" >no</option>
                        <option value="yes" >yes</option>
                    </select>

                    repeat loops over pattern list: <select id="repeatLoopOverNeuroCore3PatternListSelector" >
                        <option value="no" >no</option>
                        <option value="always" >yes - always</option>
                        <option value="managed" >yes - managed</option>
                    </select>
                    <div id="startNeuroCore3Button" className="doSomethingButton" >START</div>
                    load normal mode, set selectors to yes, then START:
                    <div id="normaModeGoNeuroCore3Button" className="doSomethingButton" >GO</div> (may be slow with large concept graphs)
                    <br/>

                    <div style={{display:"inline-block",border:"1px dashed grey",width:"300px",height:"700px",overflow:"scroll"}}>
                        <div id="reloadNeuroCore3Button" className="doSomethingButton" >reload all NeuroCore3 words</div>
                        <div id="populateActiveNeuroCore3PatternsButton" className="doSomethingButton">populate active patterns column</div>

                        <center>Choose Patterns</center>

                        <div id="selectAllNeuroCore3PatternsButton" className="doSomethingButton" data-setslug="" >select</div>
                        <div id="deselectAllNeuroCore3PatternsButton" className="doSomethingButton" data-setslug="" >deselect</div>
                        ALL
                        <hr/>

                        <div id="selectAll_devMode_NeuroCore3PatternsButton" className="doSomethingButton selectNeuroCore3PatternsButton" data-setslug="patterns_developerMode" >select</div>
                        <div id="deselectAll_devMode_NeuroCore3PatternsButton" className="doSomethingButton deselectNeuroCore3PatternsButton" data-setslug="patterns_developerMode" >deselect</div>
                        developer mode
                        <br/>

                        <div id="selectAll_normalMode_NeuroCore3PatternsButton" className="doSomethingButton selectNeuroCore3PatternsButton" data-setslug="patterns_normalMode" >select</div>
                        <div id="deselectAll_normalMode_NeuroCore3PatternsButton" className="doSomethingButton deselectNeuroCore3PatternsButton" data-setslug="patterns_normalMode" >deselect</div>
                        normal mode
                        <br/>

                        <div id="selectAll_deprecatedMode_NeuroCore3PatternsButton" className="doSomethingButton selectNeuroCore3PatternsButton" data-setslug="patterns_deprecated" >select</div>
                        <div id="deselectAll_deprecatedMode_NeuroCore3PatternsButton" className="doSomethingButton deselectNeuroCore3PatternsButton" data-setslug="patterns_deprecated" >deselect</div>
                        deprecated mode
                        <br/>

                        <div id="selectAll_incompleteMode_NeuroCore3PatternsButton" className="doSomethingButton selectNeuroCore3PatternsButton" data-setslug="patterns_incomplete" >select</div>
                        <div id="deselectAll_incompleteMode_NeuroCore3PatternsButton" className="doSomethingButton deselectNeuroCore3PatternsButton" data-setslug="patterns_incomplete" >deselect</div>
                        incomplete mode
                        <hr/>

                        <div id="selectAll_loki_NeuroCore3PatternsButton" className="doSomethingButton">select</div>
                        <div id="deselectAll_loki_NeuroCore3PatternsButton" className="doSomethingButton">deselect</div>
                        Loki pathway
                        <br/>

                        <div id="selectAll_propertyTree_NeuroCore3PatternsButton" className="doSomethingButton">select</div>
                        <div id="deselectAll_propertyTree_NeuroCore3PatternsButton" className="doSomethingButton">deselect</div>
                        property tree
                        <br/>

                        <div id="selectAll_conceptMaintenance_NeuroCore3PatternsButton" className="doSomethingButton">select</div>
                        <div id="deselectAll_conceptMaintenance_NeuroCore3PatternsButton" className="doSomethingButton">deselect</div>
                        concept structure
                        <br/>

                        <div id="selectAll_rV_NeuroCore3PatternsButton" className="doSomethingButton">select</div>
                        <div id="deselectAll_rV_NeuroCore3PatternsButton" className="doSomethingButton">deselect</div>
                        restricts value
                        <br/>

                        <div id="selectAll_enumeration_NeuroCore3PatternsButton" className="doSomethingButton">select</div>
                        <div id="deselectAll_enumeration_NeuroCore3PatternsButton" className="doSomethingButton">deselect</div>
                        enumeration
                        <hr/>

                        <div id="selectAllS1nNeuroCore3PatternsButton" className="doSomethingButton">select</div>
                        <div id="deselectAllS1nNeuroCore3PatternsButton" className="doSomethingButton">deselect</div>
                        s1n
                        <br/>

                        <div id="selectAllS1rNeuroCore3PatternsButton" className="doSomethingButton">select</div>
                        <div id="deselectAllS1rNeuroCore3PatternsButton" className="doSomethingButton">deselect</div>
                        s1r
                        <br/>

                        <div id="selectAllS2rNeuroCore3PatternsButton" className="doSomethingButton">select</div>
                        <div id="deselectAllS2rNeuroCore3PatternsButton" className="doSomethingButton">deselect</div>
                        s2r
                        <br/>

                        <center>single node</center>

                        <div id="neuroCore3Patterns_s1n_container"></div>

                        <center>single relationship</center>

                        <div id="neuroCore3Patterns_s1r_container"></div>

                        <center>double relationship</center>

                        <div id="neuroCore3Patterns_s2r_container"></div>
                    </div>

                    <div style={{display:"inline-block",border:"1px dashed grey",width:"250px",height:"700px",overflow:"scroll"}}>
                        <center>
                            Active Patterns
                            (<div style={{display:"inline-block"}} id="numberActiveNeuroCore3PatternsContainer">0</div>)
                        </center>
                        <div id="patterns_nc3_active_container"></div>
                        <center>
                            Patterns in Queue
                            (<div style={{display:"inline-block"}} id="numberQueuedNeuroCore3PatternsContainer">0</div>)
                        </center>
                        <div id="patterns_nc3_queue_container"></div>

                        <center>
                            Completed Patterns
                        </center>
                        <div id="patterns_nc3_completed_container"></div>
                    </div>

                    <div style={{display:"inline-block",border:"1px dashed grey",width:"300px",height:"700px",fontSize:"10px",overflow:"scroll"}}>
                        <center>Actions List</center>
                        <div id="actions_nc3_active_container"></div>
                    </div>

                    <div style={{display:"inline-block",border:"1px dashed grey",fontSize:"10px",width:"900px",height:"700px"}}>
                        <center>NeuroCore3 Activity Log</center>
                        <div id="neuroCore3ActivityLogContainer" style={{height:"380px",overflow:"scroll",backgroundColor:"#CFCFCF"}} ></div>

                        <div style={{display:"inline-block",border:"1px solid red",width:"900px",height:"300px"}}>
                            <textarea id="wordNeuroCore3OldContainer" style={{fontSize:"10px",display:"inline-block",border:"1px solid blue",width:"448px",height:"300px"}}></textarea>

                            <textarea id="wordNeuroCore3NewContainer" style={{fontSize:"10px",display:"inline-block",border:"1px dashed grey",width:"448px",height:"300px"}}></textarea>
                        </div>
                    </div>


                </div>
            </>
        );
    }
}
