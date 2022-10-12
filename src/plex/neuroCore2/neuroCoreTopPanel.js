import React, { useState, useEffect } from "react";
import * as MiscFunctions from '../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../lib/ipfs/miscIpfsFunctions.js';
import * as ConceptGraphInMfsFunctions from '../lib/ipfs/conceptGraphInMfsFunctions.js';
import * as ExecuteSingleAction from './executeSingleAction.js'
import * as ExecuteSinglePattern_s1n from './neuroCoreFunctions/patterns/patterns-s1n.js'
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");

const timeout = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var starterConceptGraph_tableName = "myConceptGraph_temporary";
var activeConceptGraph_tableName = starterConceptGraph_tableName;

export const loadPatterns = async () => {
    updateOldWordReplacementMapNeuroCore();
    if (window.neuroCore.engine.oRFL.current.hasOwnProperty("supersetFor_action")) {
        var oSupersetAction = window.neuroCore.engine.oRFL.current["supersetFor_action"]
        var aAct = oSupersetAction.globalDynamicData.specificInstances;
        for (var a=0;a<aAct.length;a++) {
            var nextAction_wordSlug = aAct[a];
            var oNextAction = window.neuroCore.engine.oRFL.current[nextAction_wordSlug]
            var nextAction_actionName = oNextAction.actionData.name;
            var nextAction_actionSlug = oNextAction.actionData.slug;
            // plexNeuroCore.oMapActionSlugToWordSlug[nextAction_actionSlug] = nextAction_wordSlug;
            // ???
            window.neuroCore.engine.oMapPatternNameToWordSlug[nextAction_actionSlug] = nextAction_wordSlug;
            // window.neuroCore.engine.oMapActionSlugToWordSlug[nextAction_actionSlug] = nextAction_wordSlug;
            // console.log("qwerty plexNeuroCore.oMapActionSlugToWordSlug; nextAction_actionSlug: "+nextAction_actionSlug+"; equals nextAction_wordSlug: "+nextAction_wordSlug)
        }
    }
    if (window.neuroCore.engine.oRFL.current.hasOwnProperty("patterns_singleNode")) {
        // s1n
        jQuery("#patterns_s1n_container").html("")
        var oPatterns_sN = window.neuroCore.engine.oRFL.current.patterns_singleNode;
        var aPatterns_sN = oPatterns_sN.globalDynamicData.specificInstances;
        for (var p=0;p<aPatterns_sN.length;p++) {
            var nextPattern_slug = aPatterns_sN[p];
            var oPattern = window.neuroCore.engine.oRFL.current[nextPattern_slug]
            var patternName = oPattern.patternData.name;
            var patternStatus = oPattern.patternData.status;
            if (patternStatus=="active") {
                // ???
                window.neuroCore.engine.oMapActionSlugToWordSlug[patternName] = nextPattern_slug;
                // window.neuroCore.engine.oMapPatternNameToWordSlug[patternName] = nextPattern_slug;
                var nextPatternHTML = "";
                nextPatternHTML += "<div class='neuroCore2SinglePatternContainer' ";
                nextPatternHTML += " >";
                    nextPatternHTML += "<input id='patternCheckbox_"+nextPattern_slug+"' data-patternslug='"+nextPattern_slug+"' data-patternname='"+patternName+"' class='patternCheckbox s1nPatternCheckbox' type='checkbox' style=margin-right:5px; />";
                    nextPatternHTML += patternName;
                nextPatternHTML += "</div>";
                jQuery("#patterns_s1n_container").append(nextPatternHTML)
            }
        }

        // s1r
        jQuery("#patterns_s1r_container").html("")
        var oPatterns_sR = window.neuroCore.engine.oRFL.current.patterns_singleRelationship
        var aPatterns_sR = oPatterns_sR.globalDynamicData.specificInstances;
        for (var p=0;p<aPatterns_sR.length;p++) {
            var nextPattern_slug = aPatterns_sR[p];
            var oPattern = window.neuroCore.engine.oRFL.current[nextPattern_slug]
            var patternName = oPattern.patternData.name;
            var patternStatus = oPattern.patternData.status;
            if (patternStatus=="active") {
                window.neuroCore.engine.oMapActionSlugToWordSlug[patternName] = nextPattern_slug;
                var nextPatternHTML = "";
                nextPatternHTML += "<div class='neuroCore2SinglePatternContainer' ";
                nextPatternHTML += " >";
                    nextPatternHTML += "<input id='patternCheckbox_"+nextPattern_slug+"' data-patternslug='"+nextPattern_slug+"' data-patternname='"+patternName+"' class='patternCheckbox s1rPatternCheckbox' type='checkbox' style=margin-right:5px; />";
                    nextPatternHTML += patternName;
                nextPatternHTML += "</div>";
                jQuery("#patterns_s1r_container").append(nextPatternHTML)
            }
        }
        // s2r
    }

    // populate window.neuroCore.engine.oPatternsTriggeredByAction
    if (window.neuroCore.engine.oRFL.current.hasOwnProperty("supersetFor_action")) {
        window.neuroCore.engine.oPatternsTriggeredByAction = {};
        var oSupersetAction = window.neuroCore.engine.oRFL.current["supersetFor_action"]
        var aActions = oSupersetAction.globalDynamicData.specificInstances;
        for (var a=0;a<aActions.length;a++) {
            var nextAction_slug = aActions[a];
            // var oAct = window.lookupWordBySlug[nextAction_slug];
            var oAct = window.neuroCore.engine.oRFL.current[nextAction_slug];
            var nextAction_actionSlug = oAct.actionData.slug;
            var nextAction_actionName = oAct.actionData.name;
            window.neuroCore.engine.oPatternsTriggeredByAction[nextAction_actionSlug] = [];
            if (oAct.actionData.hasOwnProperty("secondaryPatterns")) {
                // go through secondaryPatterns.individualPatterns
                var aIndividualPatterns = [];
                if (oAct.actionData.secondaryPatterns.hasOwnProperty("individualPatterns")) {
                    aIndividualPatterns = oAct.actionData.secondaryPatterns.individualPatterns;
                }
                for (var s=0;s<aIndividualPatterns.length;s++) {
                    var nextPattern_patternName = aIndividualPatterns[s];
                    var nextPattern_wordSlug = window.neuroCore.engine.oMapActionSlugToWordSlug[nextPattern_patternName];
                    if (!window.neuroCore.engine.oPatternsTriggeredByAction[nextAction_actionSlug].includes(nextPattern_wordSlug)) {
                        window.neuroCore.engine.oPatternsTriggeredByAction[nextAction_actionSlug].push(nextPattern_wordSlug);
                    }
                }

                // go through secondaryPatterns.sets
                var aSets = [];
                if (oAct.actionData.secondaryPatterns.hasOwnProperty("sets")) {
                    aSets = oAct.actionData.secondaryPatterns.sets;
                }
                for (var s=0;s<aSets.length;s++) {
                    var nextSet_slug = aSets[s];
                    var oNextSet = {}
                    // console.log("window.neuroCore.engine.aOldReplacedWords: "+JSON.stringify(window.neuroCore.engine.aOldReplacedWords,null,4))
                    if (window.neuroCore.engine.oRFL.current.hasOwnProperty(nextSet_slug)) {
                        oNextSet = window.neuroCore.engine.oRFL.current[nextSet_slug];
                    } else {
                        if (window.neuroCore.engine.aOldReplacedWords.includes(nextSet_slug)) {
                            oNextSet = window.neuroCore.engine.oRFL.current[window.neuroCore.engine.oOldWordReplacementMap[nextSet_slug]];
                        }
                    }
                    // console.log("qwerty nextSet_slug: "+nextSet_slug+"; oNextSet: "+JSON.stringify(oNextSet,null,4))
                    var aNextSet_patterns = oNextSet.globalDynamicData.specificInstances;
                    for (var z=0;z<aNextSet_patterns.length;z++) {
                        var nextPattern_wordSlug = aNextSet_patterns[z];
                        if (!window.neuroCore.engine.oPatternsTriggeredByAction[nextAction_actionSlug].includes(nextPattern_wordSlug)) {
                            window.neuroCore.engine.oPatternsTriggeredByAction[nextAction_actionSlug].push(nextPattern_wordSlug);
                        }
                    }
                }
            }
        }
        // var oFoo = JSON.stringify(window.neuroCore.engine.oPatternsTriggeredByAction,null,4);
        // console.log("window.neuroCore.engine.oPatternsTriggeredByAction: "+oFoo)
    }
    var fooResult = await MiscFunctions.timeout(10);
    return fooResult;
}
export const updateOldWordReplacementMapNeuroCore = () => {
    console.log("updateOldWordReplacementMap")
    window.neuroCore.engine.oOldWordReplacementMap = {};
    window.neuroCore.engine.aOldReplacedWords = [];
    window.neuroCore.engine.aNewReplacerWords = [];
    var oWRP = {};
    var aWords = Object.keys(window.neuroCore.engine.oRFL.current)
    for (var w=0;w<aWords.length;w++) {
        var wordSlug = aWords[w];
        var oWord = window.neuroCore.engine.oRFL.current[wordSlug]
        if (oWord.metaData.hasOwnProperty("replacementFor")) {
            var rF_slug = oWord.metaData.replacementFor;
            oWRP[rF_slug] = wordSlug;
            window.neuroCore.engine.oOldWordReplacementMap[rF_slug] = wordSlug;
            window.neuroCore.engine.aOldReplacedWords.push(rF_slug);
            window.neuroCore.engine.aNewReplacerWords.push(wordSlug);
        }
    }

    return oWRP;
}
export const loadNeuroCore2ConceptGraph = async (foo) => {
    var currentNeuroCoreSqlID = window.neuroCore.engine.currentConceptGraphSqlID;
    var currentNeuroCoreTablename = window.aLookupConceptGraphInfoBySqlID[currentNeuroCoreSqlID].tableName;
    // plan to deprecate plexNeuroCore
    /*
    plexNeuroCore.oRFL = {};
    plexNeuroCore.oRFL.current = {};
    plexNeuroCore.oRFL.updated = {};
    plexNeuroCore.oRFL.new = {};
    */
    // replacing plexNeuroCore with window.neuroCore.engine
    window.neuroCore.engine.oRFL = {};
    window.neuroCore.engine.oRFL.current = {};
    window.neuroCore.engine.oRFL.updated = {};
    window.neuroCore.engine.oRFL.new = {};
    var sql = " SELECT * FROM "+currentNeuroCoreTablename+" WHERE ( deleted IS NULL OR deleted == 0 ) ";

    console.log("loadNeuroCore2ConceptGraph; sql: "+sql)

    var r = await sendAsync(sql).then( async (aResult) => {
        // var aResult = result;
        var numRows = aResult.length;
        console.log("loadNeuroCore2ConceptGraph numRows: "+numRows)
        for (var r=0;r<numRows;r++) {
            var oNextRow = aResult[r];
            var id = oNextRow.id;
            var rawFile = oNextRow.rawFile;

            var oWord = JSON.parse(rawFile)
            var word_slug = oWord.wordData.slug;
            // console.log("loadNeuroCore2ConceptGraph r: "+r+";  word_slug: "+word_slug)
            window.neuroCore.engine.oRFL.current[word_slug] = oWord;
        }
        // await timeout(1000)
        await loadPatterns();
        return true;
    }).then( async (result) => {
        // await loadPatterns();
    })
    return r;
}
// same as loadNeuroCore2ConceptGraph but does not reload patterns

export const loadNeuroCore2ConceptGraph_b = async () => {
    console.log("loadNeuroCore2ConceptGraph_b")
    /*
    plexNeuroCore.oRFL = {};
    plexNeuroCore.oRFL.current = {};
    plexNeuroCore.oRFL.updated = {};
    plexNeuroCore.oRFL.new = {};
    */
    // replacing plexNeuroCore with window.neuroCore.engine
    window.neuroCore.engine.oRFL = {};
    window.neuroCore.engine.oRFL.current = {};
    window.neuroCore.engine.oRFL.updated = {};
    window.neuroCore.engine.oRFL.new = {};

    // var sql = " SELECT * FROM myConceptGraph_plex ";
    var sql = " SELECT * FROM myConceptGraph_plex WHERE ( deleted IS NULL OR deleted == 0 ) ";

    sendAsync(sql).then( async (aResult) => {
        // var aResult = result;
        var numRows = aResult.length;
        console.log("numRows: "+numRows)
        for (var r=0;r<numRows;r++) {
            var oNextRow = aResult[r];
            var id = oNextRow.id;
            var rawFile = oNextRow.rawFile;

            var oWord = JSON.parse(rawFile)
            var word_slug = oWord.wordData.slug;
            window.neuroCore.engine.oRFL.current[word_slug] = oWord;
        }
    })
}


const executeSinglePattern_s1n = async (patternSlug,oAuxiliaryPatternData,whichNeuroCore) => {
    var oPattern = window.neuroCore.engine.oRFL.current[patternSlug];
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
        // aNodes = Object.keys(plexNeuroCore.oRFL.current);
        aNodes = Object.keys(window.lookupWordBySlug);
    }
    // limit the search to a specified set of nodes
    if (oAuxiliaryPatternData.searchMethod == "restrictedDomain") {
        if (oAuxiliaryPatternData.domains.domainSpecificationMethod == "explicitArray") {
            aNodes = oAuxiliaryPatternData.domains.aNodes;
        }
        // limit the search to a specified set of nodes
        if (oAuxiliaryPatternData.domains.domainSpecificationMethod == "globalDynamicDataSpecificInstances") {
            var wordSlug = oAuxiliaryPatternData.domains.wordSlug;
            var oWord = MiscFunctions.cloneObj(window.lookupWordBySlug[wordSlug]);
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
                actionListHTML += "<textarea id='action_"+nextAction+"_"+r+"' class='activeActionBox' style='display:inline-block;width:390px;height:100px;border:1px solid black;margin:0px;' ";
                actionListHTML += "";
                actionListHTML += " >";
                actionListHTML += sNextAction;
                actionListHTML += "</textarea>";
                actionListHTML += "</div>";
                jQuery("#actions_active_container").append(actionListHTML);
            }
        }
    }
}

const executeSinglePattern_s1r = (patternSlug,oAuxiliaryPatternData,whichNeuroCore) => {
    var oPattern = window.neuroCore.engine.oRFL.current[patternSlug];

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

    var aRels = window.allConceptGraphRelationships;
    for (var r=0;r<aRels.length;r++) {
        // console.log("qwertyy; oNextRel: "+JSON.stringify(oNextRel,null,4))
        var oNextRel = aRels[r];
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

        var oNodeFrom = window.lookupWordBySlug[nF_slug];

        var nF_wordTypes = oNodeFrom.wordData.wordTypes;
        if (nF_wordTypes.includes(wT_from)) {
            crit2 = true;
            // console.log("crit2 true!")
        }
        if (wT_from=="ANY") {
            crit2 = true;
            // console.log("crit2 true!")
        }

        var oNodeTo = window.lookupWordBySlug[nT_slug];

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
                actionListHTML += "<textarea id='action_"+nextAction+"_"+r+"' class='activeActionBox' style='display:inline-block;width:390px;height:100px;border:1px solid black;margin:0px;' ";
                actionListHTML += "";
                actionListHTML += " >";
                actionListHTML += sNextAction;
                actionListHTML += "</textarea>";
                actionListHTML += "</div>";
                jQuery("#actions_active_container").append(actionListHTML);
            }
        }
    }
}

const executeOnePattern = async (patternIndex,patternSlug,patternName,oAuxiliaryPatternData,whichNeuroCore) => {
    jQuery("#activePattern_"+patternIndex).css("background-color","yellow");
    jQuery("#actions_active_container").html("");
    // console.log("oAuxiliaryPatternData: "+JSON.stringify(oAuxiliaryPatternData));
    // var oAuxiliaryPatternData = JSON.parse(sAuxiliaryPatternData);
    // var oAuxiliaryPatternData = {};

    console.log("executeOnePattern patternSlug: "+patternSlug)

    // var oPattern = window.lookupWordBySlug[patternSlug];
    // var oPattern = plexNeuroCore.oRFL.current[patternSlug];
    var oPattern = window.neuroCore.engine.oRFL.current[patternSlug];

    var inputField = oPattern.patternData.inputField;

    if (inputField=="singleNode") {
        await executeSinglePattern_s1n(patternSlug,oAuxiliaryPatternData,whichNeuroCore)
    }
    if (inputField=="singleRelationship") {
        await executeSinglePattern_s1r(patternSlug,oAuxiliaryPatternData,whichNeuroCore)
    }
    if (inputField=="doubleRelationship") {
        // not yet complete
    }

    await timeout(0)

    jQuery("#activePattern_"+patternIndex).css("background-color","green");
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

const executeAllActions = async (nc2CycleNumber,p,whichNeuroCore) => {
    var aActiveActions = [];
    jQuery(".activeActionBox").each(function(index){
        var sAction = jQuery(this).html()
        var oAction = JSON.parse(sAction);
        aActiveActions.push(oAction)
    })

    for (var a=0;a<aActiveActions.length;a++) {
        var oNextActiveAction = aActiveActions[a];

        var oRFL_updated = await ExecuteSingleAction.executeSingleAction(oNextActiveAction,nc2CycleNumber,p,a,whichNeuroCore);
        // plexNeuroCore.oRFL = MiscFunctions.cloneObj(oRFL_updated);
        window.neuroCore.subject.oRFL = MiscFunctions.cloneObj(oRFL_updated);
    }
    jQuery(".updateWordButton").click(async function(){
        var slugToUpdate = jQuery(this).data("slug");
        var updateUniqueID = jQuery(this).data("updateuniqueidentifier");
        var fooResult = await updateWord(slugToUpdate,updateUniqueID,whichNeuroCore);
    })
    jQuery(".makeNewWordButton").click(async function(){
        var slugToCreate = jQuery(this).data("slug");
        var newUniqueID = jQuery(this).data("newuniqueidentifier");
        var fooResult = await makeNewWord(slugToCreate,newUniqueID,whichNeuroCore);
    })
    jQuery(".actionUpdatingWord").click(function(){
        var updateUniqueID = jQuery(this).data("updateuniqueidentifier");
        console.log("actionUpdatingWord_clicked; updateUniqueID: "+updateUniqueID)

        var oWord_actionUpdatingWord_old = { "error": "unknown", "type": "actionUpdatingWord" };
        var oWord_actionUpdatingWord_new = { "error": "unknown", "type": "actionUpdatingWord" };
        if (window.neuroCore.engine.oRecordOfUpdates.hasOwnProperty(updateUniqueID)) {
            oWord_actionUpdatingWord_old = MiscFunctions.cloneObj(window.neuroCore.engine.oRecordOfUpdates[updateUniqueID].old);
            oWord_actionUpdatingWord_new = MiscFunctions.cloneObj(window.neuroCore.engine.oRecordOfUpdates[updateUniqueID].new);
        }
        var sWord_actionUpdatingWord_old = JSON.stringify(oWord_actionUpdatingWord_old,null,4);
        var sWord_actionUpdatingWord_new = JSON.stringify(oWord_actionUpdatingWord_new,null,4);

        jQuery("#wordOldContainer").val(sWord_actionUpdatingWord_old)
        jQuery("#wordNewContainer").val(sWord_actionUpdatingWord_new)
    })
    jQuery(".newUniqueIdentifier").click(function(){
        var updateUniqueID = jQuery(this).data("updateuniqueidentifier");
        console.log("newUniqueIdentifier_clicked; updateUniqueID: "+updateUniqueID)

        var oWord_newUniqueIdentifier_old = { "error": "unknown", "type": "newUniqueIdentifier" };
        var oWord_newUniqueIdentifier_new = { "error": "unknown", "type": "newUniqueIdentifier" };
        if (window.neuroCore.engine.oRecordOfUpdates.hasOwnProperty(updateUniqueID)) {
            oWord_newUniqueIdentifier_old = MiscFunctions.cloneObj(window.neuroCore.engine.oRecordOfUpdates[updateUniqueID].old);
            oWord_newUniqueIdentifier_new = MiscFunctions.cloneObj(window.neuroCore.engine.oRecordOfUpdates[updateUniqueID].new);
        }
        var sWord_newUniqueIdentifier_old = JSON.stringify(oWord_newUniqueIdentifier_old,null,4);
        var sWord_newUniqueIdentifier_new = JSON.stringify(oWord_newUniqueIdentifier_new,null,4);

        jQuery("#wordOldContainer").val(sWord_newUniqueIdentifier_old)
        jQuery("#wordNewContainer").val(sWord_newUniqueIdentifier_new)
    })
    // console.log("plexNeuroCore.oRecordOfUpdates: "+JSON.stringify(plexNeuroCore.oRecordOfUpdates,null,4))
}
var startingNeuroCore2Cycle0Time = 0;
export const startNeuroCore2 = async (neuroCore2CycleNumber) => {
    // here, changesMadeYetThisCycle actually indicates the previous cycle
    var whichNeuroCore = "NeuroCore2";
    if (window.neuroCore.engine.changesMadeYetThisCycle == true) {
        var aAuxiliaryPatternData = [];
        var oAuxiliaryPatternData = {"searchMethod":"default","patternName":"P.r.s1n.initialProcessing"};
        aAuxiliaryPatternData.push(oAuxiliaryPatternData)
        ExecuteSingleAction.addAuxiliaryPatternDataToQueue(aAuxiliaryPatternData,whichNeuroCore)
    }
    window.neuroCore.engine.changesMadeYetThisCycle = false;
    var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName;
    var foo = await MiscFunctions.updateNodeLookup4(neuroCore2CycleNumber,conceptGraphTableName);
    await timeout(100);
    console.log("startNeuroCore2; neuroCore2CycleNumber: "+neuroCore2CycleNumber)
    ////// always add a-r-u1n-updateinitialprocessing to the end of the pattern search
    var aAuxiliaryPatternData = [];
    var oAuxiliaryPatternData = {"searchMethod":"default","patternName":"P.r.s1n.initialProcessing"};
    aAuxiliaryPatternData.push(oAuxiliaryPatternData)
    if (neuroCore2CycleNumber==0) {
        window.neuroCore.engine.changesMadeYetThisSupercycle = false;
        startingNeuroCore2Cycle0Time = Date.now();
        jQuery("#neuroCore2ActivityLogContainer").html("STARTING neuroCore2 <br>");
        window.neuroCore.engine.oRecordOfUpdates = {};
        window.neuroCore.engine.oPatternsWithAuxiliaryDataQueue = {};
        jQuery("#patterns_completed_container").html("")
        jQuery("#patterns_queue_container").html("")
        jQuery("#numberQueuedPatternsContainer").html(0);
        jQuery("#neuroCore2ActivityLogContainer").html("")
        jQuery("#neuroCore2ActivityLogContainer").append("STARTING neuroCore2; neuroCore2CycleNumber: "+neuroCore2CycleNumber+"; time: "+startingNeuroCore2Cycle0Time+"<br><br>")
    }
    jQuery("#NC2StatusIndicator").html("running");
    jQuery("#NC2StatusIndicator").data("currentstatus","running");
    jQuery("#NC2StatusIndicator").css("background-color","orange");
    var repeatLoop = jQuery("#repeatLoopOverPatternListSelector option:selected").val();
    if (repeatLoop=="managed") {
        jQuery(".patternCheckbox").prop("checked",false);
    }
    var aActivePatterns = [];

    jQuery("#patterns_active_container .activePatternBox").each(function(index){
        var patternName = jQuery(this).data("patternname")
        var patternSlug = jQuery(this).data("patternslug")
        var patternIndex = jQuery(this).data("patternindex")
        var oAuxiliaryPatternData = jQuery(this).data("auxiliarypatterndata")
        // var oAuxiliaryPatternData = JSON.parse(sAuxiliaryPatternData)
        aActivePatterns.push([patternIndex,patternSlug,patternName,oAuxiliaryPatternData])
    })
    var cT = Date.now();
    var eT = cT - startingNeuroCore2Cycle0Time;
    jQuery("#neuroCore2ActivityLogContainer").append("Starting neuroCore2; neuroCore2CycleNumber: "+neuroCore2CycleNumber+"; aActivePatterns.length: "+aActivePatterns.length+"; elapsed time: "+eT+"<br>")
    // console.log("qwerty startNeuroCore2; neuroCore2CycleNumber: "+neuroCore2CycleNumber+"; aActivePatterns.length: "+aActivePatterns.length)
    if (aActivePatterns.length==0) {
        var cT = Date.now();
        var eT = cT - startingNeuroCore2Cycle0Time;
        jQuery("#neuroCore2ActivityLogContainer").append("<br>DONE with neuroCore2; no activePatterns left! elapsed time: " + eT )
        jQuery("#NC2StatusIndicator").html("off");
        jQuery("#NC2StatusIndicator").data("currentstatus","off");
        jQuery("#NC2StatusIndicator").css("background-color","#EFEFEF");
        document.getElementById("executeChangesSelector").value="no";
        document.getElementById("repeatLoopOverPatternListSelector").value="no";
    }
    if (aActivePatterns.length > 0) {
        for (var p=0;p<aActivePatterns.length;p++) {
            var nextActivePattern = aActivePatterns[p];
            // console.log("qwerty nextActivePattern p: "+p+"; ")
            await executeOnePattern(nextActivePattern[0],nextActivePattern[1],nextActivePattern[2],nextActivePattern[3],whichNeuroCore)

            await executeAllActions(neuroCore2CycleNumber,p,whichNeuroCore);
        }
        if (window.neuroCore.engine.changesMadeYetThisCycle == true) {
            var aAuxiliaryPatternData = [];
            var oAuxiliaryPatternData = {"searchMethod":"default","patternName":"P.r.s1n.initialProcessing"};
            aAuxiliaryPatternData.push(oAuxiliaryPatternData)
        }
        // generate Patterns in Queue from window.neuroCore.engine.oPatternsWithAuxiliaryDataQueue
        var oPWADQ = MiscFunctions.cloneObj(window.neuroCore.engine.oPatternsWithAuxiliaryDataQueue);
        var aPWADQ = Object.keys(oPWADQ)
        var apIndex = 0;
        jQuery("#patterns_queue_container").html("");
        jQuery("#numberQueuedPatternsContainer").html(apIndex)
        for (var p=0;p<aPWADQ.length;p++) {
            var pSlug = aPWADQ[p];
            var aAuxData = oPWADQ[pSlug]
            for (var d=0;d<aAuxData.length;d++) {
                var oAuxData = aAuxData[d];
                var sAuxiliaryPatternData = JSON.stringify(oAuxData)
                var pName = oAuxData.patternName;
                var nextActivePatternHTML = "";
                nextActivePatternHTML += "<div id='activePattern_"+apIndex+"' data-auxiliarypatterndata='"+sAuxiliaryPatternData+"' data-patternindex='"+apIndex+"' data-patternname='"+pName+"' data-patternslug='"+pSlug+"' class='activePatternBox activePattern_"+pName+"' ";
                nextActivePatternHTML += " style=font-size:10px; ";
                nextActivePatternHTML += " >";
                nextActivePatternHTML += pName;
                nextActivePatternHTML += " <br><li>searchMethod: "+oAuxData.searchMethod+"</li>";
                nextActivePatternHTML += "</div>";
                jQuery("#patterns_queue_container").append(nextActivePatternHTML)
                apIndex++;
                jQuery("#numberQueuedPatternsContainer").html(apIndex)
            }
        }

        var cT = Date.now();
        var eT = cT - startingNeuroCore2Cycle0Time;
        jQuery("#neuroCore2ActivityLogContainer").append("Done with neuroCore2 cycle number: "+neuroCore2CycleNumber+"; elapsed time: "+eT+"<br><br>")
        // console.log("window.neuroCore.engine.oPatternsWithAuxiliaryDataQueue: "+ JSON.stringify(window.neuroCore.engine.oPatternsWithAuxiliaryDataQueue,null,4))
        // might need to deprecate repeatLoop=="always" or move this if loop outside the if (aActivePatterns.length > 0) requirement
        if (repeatLoop=="always") {
            // populateActivePatterns();
            populateActivePatternsFromQueue();
            var foo = neuroCore2CycleNumber + 1;
            startNeuroCore2(foo);
        }
        if (repeatLoop=="managed") {
            populateActivePatternsFromQueue();
            var numActivePatterns = jQuery("#numberActivePatternsContainer").html()
            // console.log("qwerty numActivePatterns: "+numActivePatterns)
            if (numActivePatterns > 0) {
                // populateActivePatterns();
                var foo = neuroCore2CycleNumber + 1;
                startNeuroCore2(foo);
            }
            if (numActivePatterns == 0) {
                jQuery("#NC2StatusIndicator").html("off");
                jQuery("#NC2StatusIndicator").data("currentstatus","off");
                jQuery("#NC2StatusIndicator").css("background-color","#EFEFEF");
                document.getElementById("executeChangesSelector").value="no";
                document.getElementById("repeatLoopOverPatternListSelector").value="no";
                if (window.oAutomatedImportData.running == true) {
                    var currStep = window.oAutomatedImportData.currentStep;
                    var queueNumber = window.oAutomatedImportData.currentQueueNumber;
                    if (currStep == "takingPowerNap") {
                        // trigger the slightly deeper nap
                        jQuery("#automatedImport_updateProgressContainer").html("... brief (1000 msec) arousal from sleep ...")
                        var fooVar = await timeout(1000)
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
            document.getElementById("executeChangesSelector").value="no";
            document.getElementById("repeatLoopOverPatternListSelector").value="no";
        }
    }
}

export const selectAllPatterns = (set_slug) => {
    // var oSet = window.lookupWordBySlug[set_slug];
    console.log("selectAllPatterns; set_slug: "+set_slug)
    var oSet = window.neuroCore.engine.oRFL.current[set_slug]
    var aSi = oSet.globalDynamicData.specificInstances;
    for (var s=0;s<aSi.length;s++) {
        var nextPattern_slug = aSi[s];
        jQuery("#patternCheckbox_"+nextPattern_slug).prop("checked",true);
    }
}
const deselectAllPatterns = (set_slug) => {
    // var oSet = window.lookupWordBySlug[set_slug];
    var oSet = window.neuroCore.engine.oRFL.current[set_slug];
    var aSi = oSet.globalDynamicData.specificInstances;
    for (var s=0;s<aSi.length;s++) {
        var nextPattern_slug = aSi[s];
        jQuery("#patternCheckbox_"+nextPattern_slug).prop("checked",false);
    }
}

export const populateActivePatternsFromQueue = () => {
    jQuery("#patterns_completed_container").append("<div>next cycle</div>")
    jQuery("#patterns_completed_container").append(jQuery("#patterns_active_container").html())

    jQuery("#patterns_active_container").html(jQuery("#patterns_queue_container").html())
    jQuery("#numberActivePatternsContainer").html(jQuery("#numberQueuedPatternsContainer").html())

    jQuery("#patterns_queue_container").html("")
    jQuery("#numberQueuedPatternsContainer").html(0);
    window.neuroCore.engine.oPatternsWithAuxiliaryDataQueue = {};
}

export const populateActivePatterns = () => {
    // alert("populateActivePatterns")
    jQuery("#patterns_active_container").html("")
    var numActivePatterns = 0;
    jQuery(".patternCheckbox").each(function(index){
        var patternName = jQuery(this).data("patternname")
        var patternSlug = jQuery(this).data("patternslug")
        var isChecked = jQuery(this).prop("checked")
        if (isChecked) {
            // console.log("patternCheckbox index: "+index+"; patternName: "+patternName)
            numActivePatterns++;
            var oAuxiliaryPatternData = {"searchMethod":"default"};
            var sAuxiliaryPatternData = JSON.stringify(oAuxiliaryPatternData);
            var nextActivePatternHTML = "";
            nextActivePatternHTML += "<div id='activePattern_"+index+"' data-auxiliarypatterndata='"+sAuxiliaryPatternData+"' data-patternindex='"+index+"' data-patternname='"+patternName+"' data-patternslug='"+patternSlug+"' class='activePatternBox activePattern_"+patternName+"' ";
            nextActivePatternHTML += " style=font-size:10px; ";
            nextActivePatternHTML += " >";
            nextActivePatternHTML += patternName;
            nextActivePatternHTML += " <br><li>searchMethod: default</li>";
            nextActivePatternHTML += "</div>";
            jQuery("#patterns_active_container").append(nextActivePatternHTML)
        }
    })
    jQuery("#numberActivePatternsContainer").html(numActivePatterns)
}

export const takeADeeperNap = () => {
    console.log("normaModeGoNeuroCore2Button clicked")
    // click deselect all
    jQuery("#deselectAllPatternsButton").get(0).click();
    // click select normal mode
    jQuery("#selectAll_normalMode_PatternsButton").get(0).click();
    // set both selectors to yes
    document.getElementById("executeChangesSelector").value="yes";
    document.getElementById("repeatLoopOverPatternListSelector").value="managed";
    // click the populate active patterns button
    jQuery("#populateActivePatternsButton").get(0).click();
    // then click the start button
    jQuery("#startNeuroCore2Button").get(0).click();
}

export default class NeuroCore2TopPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        // load SQL data into the DOM (probably not good practice; should fix later)
        // init window.lookupWordTypeTemplate
        timeout(1000)
        var foo = true;
        await loadNeuroCore2ConceptGraph(foo);
        /*
        var oPatterns_s1r = window.lookupWordBySlug["patterns_singleRelationship"]

        // var oPatterns_s1r = window.neuroCore.oRFL.current.patterns_singleRelationship
        for (var p=0;p<aPatterns_s1r.length;p++) {
            var nextPattern_slug = aPatterns_s1r[p];
            var nextPatternHTML = "";
            nextPatternHTML += "<div>";
            nextPatternHTML += nextPattern_slug;
            nextPatternHTML += "</div>";
            jQuery("#patterns_s1r_container").append(nextPatternHTML)
        }
        */
        jQuery("#reloadPlexNeuroCoreButton").click(async function(){
            var foo = true;
            await loadNeuroCore2ConceptGraph(foo);
        })

        jQuery("#selectAllPatternsButton").click(async function(){
            jQuery(".patternCheckbox").prop("checked",true)
        })
        jQuery("#deselectAllPatternsButton").click(async function(){
            jQuery(".patternCheckbox").prop("checked",false)
        })

        jQuery("#selectAllS1nPatternsButton").click(async function(){
            jQuery(".s1nPatternCheckbox").prop("checked",true)
        })
        jQuery("#deselectAllS1nPatternsButton").click(async function(){
            jQuery(".s1nPatternCheckbox").prop("checked",false)
        })

        jQuery("#selectAllS1rPatternsButton").click(async function(){
            jQuery(".s1rPatternCheckbox").prop("checked",true)
        })
        jQuery("#deselectAllS1rPatternsButton").click(async function(){
            jQuery(".s1rPatternCheckbox").prop("checked",false)
        })

        jQuery("#selectAllS2rPatternsButton").click(async function(){
            jQuery(".s2rPatternCheckbox").prop("checked",true)
        })
        jQuery("#deselectAllS2rPatternsButton").click(async function(){
            jQuery(".s2rPatternCheckbox").prop("checked",false)
        })

        jQuery("#selectAll_loki_PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_LokiPathwayMaintenance";
            selectAllPatterns(set_slug)
        })
        jQuery("#deselectAll_loki_PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_LokiPathwayMaintenance";
            deselectAllPatterns(set_slug)
        })

        jQuery("#selectAll_propertyTree_PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_propertyTreeMaintenance";
            selectAllPatterns(set_slug)
        })
        jQuery("#deselectAll_propertyTree_PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_propertyTreeMaintenance";
            deselectAllPatterns(set_slug)
        })

        jQuery("#selectAll_conceptMaintenance_PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_conceptStructure";
            selectAllPatterns(set_slug)
        })
        jQuery("#deselectAll_conceptMaintenance_PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_conceptStructure";
            deselectAllPatterns(set_slug)
        })

        jQuery("#selectAll_rV_PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_restrictsValueMaintenance";
            selectAllPatterns(set_slug)
        })
        jQuery("#deselectAll_rV_PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_restrictsValueMaintenance";
            deselectAllPatterns(set_slug)
        })

        jQuery("#selectAll_enumeration_PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_enumerationTreeMaintenance";
            selectAllPatterns(set_slug)
        })
        jQuery("#deselectAll_enumeration_PatternsButton").click(async function(){
            var set_slug = "patterns_byPurpose_enumerationTreeMaintenance";
            deselectAllPatterns(set_slug)
        })

        jQuery(".selectPatternsButton").click(async function(){
            var set_slug = jQuery(this).data("setslug")
            selectAllPatterns(set_slug)
        })
        jQuery(".deselectPatternsButton").click(async function(){
            var set_slug = jQuery(this).data("setslug")
            deselectAllPatterns(set_slug)
        })

        jQuery("#populateActivePatternsButton").click(async function(){
            populateActivePatterns();
        })
        jQuery("#startNeuroCore2Button").click(function(){
            console.log("startNeuroCore2Button clicked")
            var neuroCore2CycleNumber = 0;
            startNeuroCore2(neuroCore2CycleNumber);
        })
        jQuery("#normaModeGoNeuroCore2Button").click(function(){
            takeADeeperNap()
        })
    }
    render() {
        return (
            <>
                <div className="neuroCoreMonitoringPanel" id="neuroCore2MonitoringPanel" >
                    <center>
                      Neuro Core 2:
                      <div style={{fontSize:"12px",textAlign:"left",display:"inline-block",marginLeft:"20px"}}>
                          <div style={{color:"grey",display:"inline-block",width:"150px"}}>neuroCore2 engine:</div> <div id="neuroCore2engineContainer" style={{display:"inline-block",color:"red"}}>myConceptGraph_plex</div><br/>
                          <div style={{color:"grey",display:"inline-block",width:"150px"}}>neuroCore2 subject:</div> <div id="neuroCore2subjectContainer" style={{display:"inline-block",color:"purple"}}></div>
                      </div>
                    </center>
                    execute changes: <select id="executeChangesSelector" >
                        <option value="no" >no</option>
                        <option value="yes" >yes</option>
                    </select>

                    repeat loops over pattern list: <select id="repeatLoopOverPatternListSelector" >
                        <option value="no" >no</option>
                        <option value="always" >yes - always</option>
                        <option value="managed" >yes - managed</option>
                    </select>
                    <div id="startNeuroCore2Button" className="doSomethingButton" >START</div>
                    load normal mode, set selectors to yes, then START:
                    <div id="normaModeGoNeuroCore2Button" className="doSomethingButton" >GO</div> (may be slow with large concept graphs)
                    <br/>

                    <div style={{display:"inline-block",border:"1px dashed grey",width:"300px",height:"700px",overflow:"scroll"}}>
                        <div id="reloadPlexNeuroCoreButton" className="doSomethingButton" >reload var plexNeuroCore</div>
                        <div id="populateActivePatternsButton" className="doSomethingButton">populate active patterns column</div>

                        <center>Choose Patterns</center>

                        <div id="selectAllPatternsButton" className="doSomethingButton" data-setslug="" >select</div>
                        <div id="deselectAllPatternsButton" className="doSomethingButton" data-setslug="" >deselect</div>
                        ALL
                        <hr/>

                        <div id="selectAll_devMode_PatternsButton" className="doSomethingButton selectPatternsButton" data-setslug="patterns_developerMode" >select</div>
                        <div id="deselectAll_devMode_PatternsButton" className="doSomethingButton deselectPatternsButton" data-setslug="patterns_developerMode" >deselect</div>
                        developer mode
                        <br/>

                        <div id="selectAll_normalMode_PatternsButton" className="doSomethingButton selectPatternsButton" data-setslug="patterns_normalMode" >select</div>
                        <div id="deselectAll_normalMode_PatternsButton" className="doSomethingButton deselectPatternsButton" data-setslug="patterns_normalMode" >deselect</div>
                        normal mode
                        <br/>

                        <div id="selectAll_deprecatedMode_PatternsButton" className="doSomethingButton selectPatternsButton" data-setslug="patterns_deprecated" >select</div>
                        <div id="deselectAll_deprecatedMode_PatternsButton" className="doSomethingButton deselectPatternsButton" data-setslug="patterns_deprecated" >deselect</div>
                        deprecated mode
                        <br/>

                        <div id="selectAll_incompleteMode_PatternsButton" className="doSomethingButton selectPatternsButton" data-setslug="patterns_incomplete" >select</div>
                        <div id="deselectAll_incompleteMode_PatternsButton" className="doSomethingButton deselectPatternsButton" data-setslug="patterns_incomplete" >deselect</div>
                        incomplete mode
                        <hr/>

                        <div id="selectAll_loki_PatternsButton" className="doSomethingButton">select</div>
                        <div id="deselectAll_loki_PatternsButton" className="doSomethingButton">deselect</div>
                        Loki pathway
                        <br/>

                        <div id="selectAll_propertyTree_PatternsButton" className="doSomethingButton">select</div>
                        <div id="deselectAll_propertyTree_PatternsButton" className="doSomethingButton">deselect</div>
                        property tree
                        <br/>

                        <div id="selectAll_conceptMaintenance_PatternsButton" className="doSomethingButton">select</div>
                        <div id="deselectAll_conceptMaintenance_PatternsButton" className="doSomethingButton">deselect</div>
                        concept structure
                        <br/>

                        <div id="selectAll_rV_PatternsButton" className="doSomethingButton">select</div>
                        <div id="deselectAll_rV_PatternsButton" className="doSomethingButton">deselect</div>
                        restricts value
                        <br/>

                        <div id="selectAll_enumeration_PatternsButton" className="doSomethingButton">select</div>
                        <div id="deselectAll_enumeration_PatternsButton" className="doSomethingButton">deselect</div>
                        enumeration
                        <hr/>

                        <div id="selectAllS1nPatternsButton" className="doSomethingButton">select</div>
                        <div id="deselectAllS1nPatternsButton" className="doSomethingButton">deselect</div>
                        s1n
                        <br/>

                        <div id="selectAllS1rPatternsButton" className="doSomethingButton">select</div>
                        <div id="deselectAllS1rPatternsButton" className="doSomethingButton">deselect</div>
                        s1r
                        <br/>

                        <div id="selectAllS2rPatternsButton" className="doSomethingButton">select</div>
                        <div id="deselectAllS2rPatternsButton" className="doSomethingButton">deselect</div>
                        s2r
                        <br/>

                        <center>single node</center>

                        <div id="patterns_s1n_container"></div>

                        <center>single relationship</center>

                        <div id="patterns_s1r_container"></div>

                        <center>double relationship</center>

                        <div id="patterns_s2r_container"></div>
                    </div>

                    <div style={{display:"inline-block",border:"1px dashed grey",width:"250px",height:"700px",overflow:"scroll"}}>
                        <center>
                            Active Patterns
                            (<div style={{display:"inline-block"}} id="numberActivePatternsContainer">0</div>)
                        </center>
                        <div id="patterns_active_container"></div>
                        <center>
                            Patterns in Queue
                            (<div style={{display:"inline-block"}} id="numberQueuedPatternsContainer">0</div>)
                        </center>
                        <div id="patterns_queue_container"></div>

                        <center>
                            Completed Patterns
                        </center>
                        <div id="patterns_completed_container"></div>
                    </div>

                    <div style={{display:"inline-block",border:"1px dashed grey",width:"300px",height:"700px",fontSize:"10px",overflow:"scroll"}}>
                        <center>Actions List</center>
                        <div id="actions_active_container"></div>
                    </div>

                    <div style={{display:"inline-block",border:"1px dashed grey",fontSize:"10px",width:"900px",height:"700px"}}>
                        <center>NeoroCore2 Activity Log</center>
                        <div id="neuroCore2ActivityLogContainer" style={{height:"380px",overflow:"scroll",backgroundColor:"#CFCFCF"}} ></div>

                        <div style={{display:"inline-block",border:"1px solid red",width:"900px",height:"300px"}}>
                            <textarea id="wordOldContainer" style={{fontSize:"10px",display:"inline-block",border:"1px solid blue",width:"448px",height:"300px"}}></textarea>

                            <textarea id="wordNewContainer" style={{fontSize:"10px",display:"inline-block",border:"1px dashed grey",width:"448px",height:"300px"}}></textarea>
                        </div>
                    </div>


                </div>
            </>
        );
    }
}
