
import React, { Component, createRef, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import ConceptGraphMasthead from '../../../conceptGraphMasthead.js';
import LeftNavbarMaintenance from '../../../LeftNavbar_Maintenance';
import * as MiscFunctions from '../../../lib/miscFunctions.js';

// MaintenanceFunctions: old page; may deprecate; replaced by Fxns_ ...
import * as MaintenanceFunctions from './c2cRelsMaintenanceFunctions.js';

import * as Fxns_isASubsetOf from './c2cRelsFxns_isASubsetOf.js';
import * as Fxns_isARealizationOf from './c2cRelsFxns_isARealizationOf.js';
import * as Fxns_canBeSubdividedInto from './c2cRelsFxns_canBeSubdividedInto.js';
import * as Fxns_map1ToN from './c2cRelsFxns_map1ToN.js';

import sendAsync from '../../../renderer';
const jQuery = require("jquery");

/*
New background maintenance tasks added Jan 2022
Another attept at "pattern-action"
Focus is mainly on actions triggered by user adding a "Layer 2" relationship:
- isASubsetOf
- isARealizationOf
- canBeSubdividedInto (which is new version of the older: isADescriptorOf)
- map1ToN

Problem with old methods: async tasks (creating new words) causing problems ... ?
Current strategy:
Break tasks down into groups. Each group has its own page of pattern-searching functions and action-performing functions.
Each pattern-searching function looks for a specific pattern, which triggers a specific task. Output includes:
- number of times patten is seen
- info needed to execute the subsequent task(s)

I will see a list of ALL patterns that are matched.
However, it will execute only the FIRST pattern-action that is triggered, not all of them.
(Or won't execute any, if just looking for patterns.)
It will also check to see whether an action is required or is already taken care of.

First find each match for each pattern.
Next check to see if each match is actionable or not.
Output lists of all matches; all actionable matches.
*/

var reports_obj = {};
// could move this function to c2cRelsMaintenanceFunctions.js ? if it gets big
async function updateWords_c2crm(words_in_rF_obj,patterns_c2crm) {
    var words_out_rF_obj = MiscFunctions.cloneObj(words_in_rF_obj)

    // Go through each family one at a time
    // Only make changes from one family!
    var unchangedSoFar = true;

    // Fxns_canBeSubdividedInto
    // As of 7 Feb 2022: Working, I think ...
    if (unchangedSoFar) {
        words_out_rF_obj = await Fxns_canBeSubdividedInto.makeChanges(words_in_rF_obj,patterns_c2crm)
        if (JSON.stringify(words_in_rF_obj) == JSON.stringify(words_out_rF_obj)) {
            console.log("after Fxns_canBeSubdividedInto, words_in == words_out")
            unchangedSoFar = true;
        } else {
            unchangedSoFar = false;
            console.log("after Fxns_canBeSubdividedInto, words_in NOT EQUAL TO words_out")
        }
    }

    // Fxns_isARealizationOf
    // As of 7 Feb 2022: makeChanges doesn't yet do anything
    if (unchangedSoFar) {
        words_out_rF_obj = await Fxns_isARealizationOf.makeChanges(words_in_rF_obj,patterns_c2crm)
        if (JSON.stringify(words_in_rF_obj) == JSON.stringify(words_out_rF_obj)) {
            console.log("after Fxns_isARealizationOf, words_in == words_out")
            unchangedSoFar = true;
        } else {
            unchangedSoFar = false;
            console.log("after Fxns_isARealizationOf, words_in NOT EQUAL TO words_out")
        }
    }

    // Fxns_isASubsetOf
    // As of 7 Feb 2022: makeChanges doesn't yet do anything
    if (unchangedSoFar) {
        words_out_rF_obj = await Fxns_isASubsetOf.makeChanges(words_in_rF_obj,patterns_c2crm)
        if (JSON.stringify(words_in_rF_obj) == JSON.stringify(words_out_rF_obj)) {
            console.log("after Fxns_isASubsetOf, words_in == words_out")
            unchangedSoFar = true;
        } else {
            unchangedSoFar = false;
            console.log("after Fxns_isASubsetOf, words_in NOT EQUAL TO words_out")
        }
    }

    // Fxns_map1ToN
    // As of 7 Feb 2022: makeChanges doesn't yet do anything
    if (unchangedSoFar) {
        words_out_rF_obj = await Fxns_map1ToN.makeChanges(words_in_rF_obj,patterns_c2crm)
        if (JSON.stringify(words_in_rF_obj) == JSON.stringify(words_out_rF_obj)) {
            console.log("after Fxns_map1ToN, words_in == words_out")
            unchangedSoFar = true;
        } else {
            unchangedSoFar = false;
            console.log("after Fxns_map1ToN, words_in NOT EQUAL TO words_out")
        }
    }

    return words_out_rF_obj;
}

function showSelectedWord_c2crm() {
    var selectedWord_slug = jQuery("#wordSelectorElem option:selected").data("slug");
    if (words_pre_rF_obj.hasOwnProperty(selectedWord_slug)) {
        var word_pre_rF_obj = words_pre_rF_obj[selectedWord_slug];
    } else {
        var word_pre_rF_obj = {};
        word_pre_rF_obj.note = "This word does not yet exist in the SQL database!!!"
    }

    var word_pre_rF_str = JSON.stringify(word_pre_rF_obj,null,4);
    var word_post_rF_obj = words_post_rF_obj[selectedWord_slug];
    var word_post_rF_str = JSON.stringify(word_post_rF_obj,null,4);
    jQuery("#word_pre_elem").html(word_pre_rF_str);
    jQuery("#word_post_elem").html(word_post_rF_str);
}

function findPatterns_c2crm(words_in_rF_obj) {
    var patterns_out_obj = {};

    // look for each pattern in each of the following families:
    /////////////////////////// FAMLIY: isASubsetOf; Fxns_isASubsetOf
    // First: add list of pattern-actions to report
    reports_obj.isASubsetOf = Fxns_isASubsetOf.generateInitialPatternList(words_in_rF_obj)
    // Next: update report with whether each pattern-action is actionable or has already been completed
    reports_obj.isASubsetOf = Fxns_isASubsetOf.determineStatusOfActionPatterns(words_in_rF_obj,reports_obj.isASubsetOf)

    /////////////////////////// FAMLIY: isARealizationOf; Fxns_isARealizationOf
    // First: add list of pattern-actions to report
    reports_obj.isARealizationOf = Fxns_isARealizationOf.generateInitialPatternList(words_in_rF_obj)
    // Next: update report with whether each pattern-action is actionable or has already been completed
    reports_obj.isARealizationOf = Fxns_isASubsetOf.determineStatusOfActionPatterns(words_in_rF_obj,reports_obj.isARealizationOf)

    /////////////////////////// FAMLIY: canBeSubdividedInto; Fxns_canBeSubdividedInto
    reports_obj.canBeSubdividedInto = Fxns_canBeSubdividedInto.generateInitialPatternList(words_in_rF_obj)
    // Next: update report with whether each pattern-action is actionable or has already been completed
    reports_obj.canBeSubdividedInto = Fxns_canBeSubdividedInto.determineStatusOfActionPatterns(words_in_rF_obj,reports_obj.canBeSubdividedInto)

    /////////////////////////// FAMLIY: map1ToN; Fxns_map1ToN
    reports_obj.map1ToN = Fxns_map1ToN.generateInitialPatternList(words_in_rF_obj)
    // Next: update report with whether each pattern-action is actionable or has already been completed
    reports_obj.map1ToN = Fxns_map1ToN.determineStatusOfActionPatterns(words_in_rF_obj,reports_obj.map1ToN)

    makeReport_c2crm(reports_obj);

    // return patterns_out_obj;
    return reports_obj;
}

var patterns_template_c2crm = {};
patterns_template_c2crm.numPositive = 0;
patterns_template_c2crm.isASubsetOf = {};

function makeReport_c2crm(reports_obj) {
    // var reports_str = JSON.stringify(reports_obj,null,4);
    // console.log("reports_str: "+reports_str)

    var reportHTML = "";
    reportHTML += "<center>Report</center>";

    reportHTML += "<div class='basicContainer2_small' style='background-color:#5a5f6b;color:white;' >";
    reportHTML += "<center>Action List</center>";
    // isASubsetOf
    var numPatterns_isASubsetOf = reports_obj.isASubsetOf.patternsList.length;
    for (var p=0;p<numPatterns_isASubsetOf;p++) {
        var nextPattern_isASubsetOf_obj = reports_obj.isASubsetOf.patternsList[p];
        if (nextPattern_isASubsetOf_obj.actionable) {
            reportHTML += "<div >";
            reportHTML += "isASubsetOf pattern "+p;
            reportHTML += " add rel: "+nextPattern_isASubsetOf_obj.relationshipToAdd.nodeFrom.slug;
            reportHTML += " -- "+nextPattern_isASubsetOf_obj.relationshipToAdd.relationshipType.slug;
            reportHTML += " -- "+nextPattern_isASubsetOf_obj.relationshipToAdd.nodeTo.slug;
            reportHTML += "</div >";
        }
    }
    // isARealizationOf
    var numPatterns_isARealizationOf = reports_obj.isARealizationOf.patternsList.length;
    for (var p=0;p<numPatterns_isARealizationOf;p++) {
        var nextPattern_isARealizationOf_obj = reports_obj.isARealizationOf.patternsList[p];
        if (nextPattern_isARealizationOf_obj.actionable) {
            reportHTML += "<div >";
            reportHTML += "isARealizationOf pattern "+p;
            reportHTML += " add rel: "+nextPattern_isARealizationOf_obj.relationshipToAdd.nodeFrom.slug;
            reportHTML += " -- "+nextPattern_isARealizationOf_obj.relationshipToAdd.relationshipType.slug;
            reportHTML += " -- "+nextPattern_isARealizationOf_obj.relationshipToAdd.nodeTo.slug;
            reportHTML += "</div >";
        }
    }

    // canBeSubdividedInto
    var numPatterns_canBeSubdividedInto = reports_obj.canBeSubdividedInto.patternsList.length;
    for (var p=0;p<numPatterns_canBeSubdividedInto;p++) {
        var nextPattern_canBeSubdividedInto_obj = reports_obj.canBeSubdividedInto.patternsList[p];
        if (nextPattern_canBeSubdividedInto_obj.actionable) {
            reportHTML += "<div >";
            reportHTML += "canBeSubdividedInto pattern "+p;
            reportHTML += "<br> ... report in progress ... <br>";
            // reportHTML += " add rel: "+nextPattern_canBeSubdividedInto_obj.relationshipToAdd.nodeFrom.slug;
            // reportHTML += " -- "+nextPattern_canBeSubdividedInto_obj.relationshipToAdd.relationshipType.slug;
            // reportHTML += " -- "+nextPattern_canBeSubdividedInto_obj.relationshipToAdd.nodeTo.slug;
            reportHTML += "</div >";
        }
    }

    // map1ToN
    var numPatterns_map1ToN = reports_obj.map1ToN.patternsList.length;
    for (var p=0;p<numPatterns_map1ToN;p++) {
        var nextPattern_map1ToN_obj = reports_obj.map1ToN.patternsList[p];
        if (nextPattern_map1ToN_obj.actionable) {
            reportHTML += "<div >";
            reportHTML += "map1ToN pattern "+p;
            reportHTML += "<br> ... report in progress ... <br>";
            /*
            reportHTML += " add rel: "+nextPattern_map1ToN_obj.relationshipToAdd.nodeFrom.slug;
            reportHTML += " -- "+nextPattern_map1ToN_obj.relationshipToAdd.relationshipType.slug;
            reportHTML += " -- "+nextPattern_map1ToN_obj.relationshipToAdd.nodeTo.slug;
            */
            reportHTML += "</div >";
        }
    }

    reportHTML += "</div >";

    var reports_str = JSON.stringify(reports_obj,null,4)
    var reports_isASubsetOf_str = JSON.stringify(reports_obj.isASubsetOf,null,4)
    var reports_isARealizationOf_str = JSON.stringify(reports_obj.isARealizationOf,null,4)
    var reports_canBeSubdividedInto_str = JSON.stringify(reports_obj.canBeSubdividedInto,null,4)
    var reports_map1ToN_str = JSON.stringify(reports_obj.map1ToN,null,4)

    ///////////////////////// isASubsetOf ///////////////////////////
    reportHTML += "<div class='basicContainer2_small' >";
        reportHTML += "<center>";
        reportHTML += "<div class=doSomethingButton_small data-state=hidden id=isASubsetOfButton_toggleContainerA >A</div> ";
        reportHTML += "<div class=doSomethingButton_small data-state=hidden id=isASubsetOfButton_toggleContainerB >B</div> ";
        reportHTML += "isASubsetOf ";
        reportHTML += " -------- ";
        reportHTML += reports_obj.isASubsetOf.rawRelationshipsList.length;
        reportHTML += " / ";
        reportHTML += reports_obj.isASubsetOf.numPatterns.total;
        reportHTML += " / ";
        reportHTML += reports_obj.isASubsetOf.numPatterns.actionable;
        reportHTML += " -------- ";
        reportHTML += " rels / patterns / actionable patterns";
        reportHTML += "</center>";

        reportHTML += "Pattern: "+reports_obj.isASubsetOf.patternInfo.description;
        reportHTML += "<br>";
        reportHTML += "Action: "+reports_obj.isASubsetOf.patternInfo.action.description;
        reportHTML += "<br>";
        reportHTML += "NUMBERS OF PATTERNS:";
        reportHTML += "total: "+reports_obj.isASubsetOf.numPatterns.total+"; ";
        reportHTML += "ACTIONABLE: Yes: "+reports_obj.isASubsetOf.numPatterns.actionable+"; ";
        reportHTML += "No: "+reports_obj.isASubsetOf.numPatterns.notActionable+"; ";
        reportHTML += "Dunno yet: "+reports_obj.isASubsetOf.numPatterns.dunnoYetIfActionable+"; ";

        reportHTML += "<pre id=isASubsetOfContainerA style='display:none;'>";
        reportHTML += reports_isASubsetOf_str;
        reportHTML += "</pre>";

        reportHTML += "<div id=isASubsetOfContainerB style='display:none;'>";
        reportHTML += "NUMBERS OF RELATIONSHIPS: ";
        reportHTML += reports_obj.isASubsetOf.rawRelationshipsList.length;
        reportHTML += "</div>";

    reportHTML += "</div>";

    ///////////////////////// isARealizationOf ///////////////////////////
    reportHTML += "<div class='basicContainer2_small' >";
        reportHTML += "<center>";
        reportHTML += "<div class=doSomethingButton_small data-state=hidden id=isARealizationOfButton_toggleContainerA >A</div> ";
        reportHTML += "<div class=doSomethingButton_small data-state=hidden id=isARealizationOfButton_toggleContainerB >B</div> ";
        reportHTML += "isARealizationOf ";
        reportHTML += " -------- ";
        reportHTML += reports_obj.isARealizationOf.rawRelationshipsList.length;
        reportHTML += " / ";
        reportHTML += reports_obj.isARealizationOf.numPatterns.total;
        reportHTML += " / ";
        reportHTML += reports_obj.isARealizationOf.numPatterns.actionable;
        reportHTML += " -------- ";
        reportHTML += " rels / patterns / actionable patterns ";
        reportHTML += "</center>";

        reportHTML += "Pattern: "+reports_obj.isARealizationOf.patternInfo.description;
        reportHTML += "<br>";
        reportHTML += "Action: "+reports_obj.isARealizationOf.patternInfo.action.description;
        reportHTML += "<br>";
        reportHTML += "NUMBERS OF PATTERNS:";
        reportHTML += "total: "+reports_obj.isARealizationOf.numPatterns.total+"; ";
        reportHTML += "ACTIONABLE: Yes: "+reports_obj.isARealizationOf.numPatterns.actionable+"; ";
        reportHTML += "No: "+reports_obj.isARealizationOf.numPatterns.notActionable+"; ";
        reportHTML += "Dunno yet: "+reports_obj.isARealizationOf.numPatterns.dunnoYetIfActionable+"; ";

        reportHTML += "<pre id=isARealizationOfContainerA style='display:none;'>";
        reportHTML += reports_isARealizationOf_str;
        reportHTML += "</pre>";

        reportHTML += "<div id=isARealizationOfContainerB style='display:none;'>";
        reportHTML += "NUMBERS OF RELATIONSHIPS:";
        reportHTML += reports_obj.isARealizationOf.rawRelationshipsList.length;
        reportHTML += "</div>";
    reportHTML += "</div>";

    var reports_canBeSubdividedInto_rawRelationships_str = JSON.stringify(reports_obj.canBeSubdividedInto.rawRelationshipsList,null,4)
    var reports_canBeSubdividedInto_patterns_str = JSON.stringify(reports_obj.canBeSubdividedInto.patternsList,null,4)
    ///////////////////////// canBeSubdividedInto ///////////////////////////
    reportHTML += "<div class='basicContainer2_small' >";
        reportHTML += "<center>";
        reportHTML += "<div class=doSomethingButton_small data-state=hidden id=canBeSubdividedIntoButton_toggleContainerA >A</div> ";
        reportHTML += "<div class=doSomethingButton_small data-state=hidden id=canBeSubdividedIntoButton_toggleContainerB >B</div> ";
        reportHTML += "<div class=doSomethingButton_small data-state=hidden id=canBeSubdividedIntoButton_toggleContainerR >R</div> ";
        reportHTML += "<div class=doSomethingButton_small data-state=hidden id=canBeSubdividedIntoButton_toggleContainerPA >P/A</div> ";
        reportHTML += "canBeSubdividedInto ";
        reportHTML += " -------- ";
        reportHTML += reports_obj.canBeSubdividedInto.rawRelationshipsList.length;
        reportHTML += " / ";
        reportHTML += reports_obj.canBeSubdividedInto.numPatterns.total;
        reportHTML += " / ";
        reportHTML += reports_obj.canBeSubdividedInto.numPatterns.actionable;
        reportHTML += " -------- ";
        reportHTML += " rels / patterns / actionable patterns ";
        reportHTML += "</center>";

        reportHTML += "Pattern: "+reports_obj.canBeSubdividedInto.patternInfo.description;
        reportHTML += "<br>";
        reportHTML += "Action: "+reports_obj.canBeSubdividedInto.patternInfo.action.description;
        reportHTML += "<br>";
        reportHTML += "NUMBERS OF PATTERNS:";
        reportHTML += "total: "+reports_obj.canBeSubdividedInto.numPatterns.total+"; ";
        reportHTML += "ACTIONABLE: Yes: "+reports_obj.canBeSubdividedInto.numPatterns.actionable+"; ";
        reportHTML += "No: "+reports_obj.canBeSubdividedInto.numPatterns.notActionable+"; ";
        reportHTML += "Dunno yet: "+reports_obj.canBeSubdividedInto.numPatterns.dunnoYetIfActionable+"; ";

        reportHTML += "<pre id=canBeSubdividedIntoContainerA style='display:none;'>";
        reportHTML += reports_canBeSubdividedInto_str;
        reportHTML += "</pre>";

        reportHTML += "<div id=canBeSubdividedIntoContainerB style='display:none;'>";
        reportHTML += "NUMBERS OF RELATIONSHIPS:";
        reportHTML += reports_obj.canBeSubdividedInto.rawRelationshipsList.length;
        reportHTML += "</div>";

        reportHTML += "<pre id=canBeSubdividedIntoContainerR style='display:none;'>";
        reportHTML += reports_canBeSubdividedInto_rawRelationships_str;
        reportHTML += "</pre>";

        reportHTML += "<pre id=canBeSubdividedIntoContainerPA style='display:none;'>";
        reportHTML += reports_canBeSubdividedInto_patterns_str;
        reportHTML += "</pre>";
    reportHTML += "</div>";

    ///////////////////////// map1ToN ///////////////////////////
    reportHTML += "<div class='basicContainer2_small' >";
        reportHTML += "<center>";
        reportHTML += "<div class=doSomethingButton_small data-state=hidden id=map1ToNButton_toggleContainerA >A</div> ";
        reportHTML += "<div class=doSomethingButton_small data-state=hidden id=map1ToNButton_toggleContainerB >B</div> ";
        reportHTML += "<div class=doSomethingButton_small data-state=hidden id=map1ToNButton_toggleContainerR >R</div> ";
        reportHTML += "<div class=doSomethingButton_small data-state=hidden id=map1ToNButton_toggleContainerPA >P/A</div> ";
        reportHTML += "map1ToN ";
        reportHTML += " -------- ";
        reportHTML += reports_obj.map1ToN.rawRelationshipsList.length;
        reportHTML += " / ";
        reportHTML += reports_obj.map1ToN.numPatterns.total;
        reportHTML += " / ";
        reportHTML += reports_obj.map1ToN.numPatterns.actionable;
        reportHTML += " -------- ";
        reportHTML += " rels / patterns / actionable patterns ";
        reportHTML += "</center>";

        reportHTML += "Pattern: "+reports_obj.map1ToN.patternInfo.description;
        reportHTML += "<br>";
        reportHTML += "Action: "+reports_obj.map1ToN.patternInfo.action.description;
        reportHTML += "<br>";
        reportHTML += "NUMBERS OF PATTERNS:";
        reportHTML += "total: "+reports_obj.map1ToN.numPatterns.total+"; ";
        reportHTML += "ACTIONABLE: Yes: "+reports_obj.map1ToN.numPatterns.actionable+"; ";
        reportHTML += "No: "+reports_obj.map1ToN.numPatterns.notActionable+"; ";
        reportHTML += "Dunno yet: "+reports_obj.map1ToN.numPatterns.dunnoYetIfActionable+"; ";

        reportHTML += "<pre id=map1ToNContainerA style='display:none;'>";
        reportHTML += reports_map1ToN_str;
        reportHTML += "</pre>";

        reportHTML += "<div id=map1ToNContainerB style='display:none;'>";
        reportHTML += "NUMBERS OF RELATIONSHIPS:";
        reportHTML += reports_obj.map1ToN.rawRelationshipsList.length;
        reportHTML += "</div>";
    reportHTML += "</div>";

    reportHTML += "<pre style='border:1px solid orange;height:150px;overflow:scroll;' >";
    reportHTML += reports_str;
    reportHTML += "</pre>";
    jQuery("#reportContainer").html(reportHTML);

    ///////////////////////// isASubsetOf ///////////////////////////
    jQuery("#isASubsetOfButton_toggleContainerA").click(function(){
        var currentState = jQuery(this).data("state");
        if (currentState=="hidden") {
            jQuery("#isASubsetOfContainerA").css("display","block")
            jQuery(this).data("state","shown");
            jQuery(this).css("backgroundColor","green");
        }
        if (currentState=="shown") {
            jQuery("#isASubsetOfContainerA").css("display","none")
            jQuery(this).data("state","hidden");
            jQuery(this).css("backgroundColor","grey");
        }
    });
    jQuery("#isASubsetOfButton_toggleContainerB").click(function(){
        var currentState = jQuery(this).data("state");
        if (currentState=="hidden") {
            jQuery("#isASubsetOfContainerB").css("display","block")
            jQuery(this).data("state","shown");
            jQuery(this).css("backgroundColor","green");
        }
        if (currentState=="shown") {
            jQuery("#isASubsetOfContainerB").css("display","none")
            jQuery(this).data("state","hidden");
            jQuery(this).css("backgroundColor","grey");
        }
    });

    ///////////////////////// isARealizationOf ///////////////////////////
    jQuery("#isARealizationOfButton_toggleContainerA").click(function(){
        var currentState = jQuery(this).data("state");
        if (currentState=="hidden") {
            jQuery("#isARealizationOfContainerA").css("display","block")
            jQuery(this).data("state","shown");
            jQuery(this).css("backgroundColor","green");
        }
        if (currentState=="shown") {
            jQuery("#isARealizationOfContainerA").css("display","none")
            jQuery(this).data("state","hidden");
            jQuery(this).css("backgroundColor","grey");
        }
    });
    jQuery("#isARealizationOfButton_toggleContainerB").click(function(){
        var currentState = jQuery(this).data("state");
        if (currentState=="hidden") {
            jQuery("#isARealizationOfContainerB").css("display","block")
            jQuery(this).data("state","shown");
            jQuery(this).css("backgroundColor","green");
        }
        if (currentState=="shown") {
            jQuery("#isARealizationOfContainerB").css("display","none")
            jQuery(this).data("state","hidden");
            jQuery(this).css("backgroundColor","grey");
        }
    });

    ///////////////////////// canBeSubdividedInto ///////////////////////////
    jQuery("#canBeSubdividedIntoButton_toggleContainerA").click(function(){
        var currentState = jQuery(this).data("state");
        if (currentState=="hidden") {
            jQuery("#canBeSubdividedIntoContainerA").css("display","block")
            jQuery(this).data("state","shown");
            jQuery(this).css("backgroundColor","green");
        }
        if (currentState=="shown") {
            jQuery("#canBeSubdividedIntoContainerA").css("display","none")
            jQuery(this).data("state","hidden");
            jQuery(this).css("backgroundColor","grey");
        }
    });
    jQuery("#canBeSubdividedIntoButton_toggleContainerB").click(function(){
        var currentState = jQuery(this).data("state");
        if (currentState=="hidden") {
            jQuery("#canBeSubdividedIntoContainerB").css("display","block")
            jQuery(this).data("state","shown");
            jQuery(this).css("backgroundColor","green");
        }
        if (currentState=="shown") {
            jQuery("#canBeSubdividedIntoContainerB").css("display","none")
            jQuery(this).data("state","hidden");
            jQuery(this).css("backgroundColor","grey");
        }
    });
    jQuery("#canBeSubdividedIntoButton_toggleContainerR").click(function(){
        var currentState = jQuery(this).data("state");
        if (currentState=="hidden") {
            jQuery("#canBeSubdividedIntoContainerR").css("display","block")
            jQuery(this).data("state","shown");
            jQuery(this).css("backgroundColor","green");
        }
        if (currentState=="shown") {
            jQuery("#canBeSubdividedIntoContainerR").css("display","none")
            jQuery(this).data("state","hidden");
            jQuery(this).css("backgroundColor","grey");
        }
    });
    jQuery("#canBeSubdividedIntoButton_toggleContainerPA").click(function(){
        var currentState = jQuery(this).data("state");
        if (currentState=="hidden") {
            jQuery("#canBeSubdividedIntoContainerPA").css("display","block")
            jQuery(this).data("state","shown");
            jQuery(this).css("backgroundColor","green");
        }
        if (currentState=="shown") {
            jQuery("#canBeSubdividedIntoContainerPA").css("display","none")
            jQuery(this).data("state","hidden");
            jQuery(this).css("backgroundColor","grey");
        }
    });

    ///////////////////////// map1ToN ///////////////////////////
    jQuery("#map1ToNButton_toggleContainerA").click(function(){
        var currentState = jQuery(this).data("state");
        if (currentState=="hidden") {
            jQuery("#map1ToNContainerA").css("display","block")
            jQuery(this).data("state","shown");
            jQuery(this).css("backgroundColor","green");
        }
        if (currentState=="shown") {
            jQuery("#map1ToNContainerA").css("display","none")
            jQuery(this).data("state","hidden");
            jQuery(this).css("backgroundColor","grey");
        }
    });
    jQuery("#map1ToNButton_toggleContainerB").click(function(){
        var currentState = jQuery(this).data("state");
        if (currentState=="hidden") {
            jQuery("#map1ToNContainerB").css("display","block")
            jQuery(this).data("state","shown");
            jQuery(this).css("backgroundColor","green");
        }
        if (currentState=="shown") {
            jQuery("#map1ToNContainerB").css("display","none")
            jQuery(this).data("state","hidden");
            jQuery(this).css("backgroundColor","grey");
        }
    });
}

var words_pre_rF_obj = {};
var words_post_rF_obj = {};
var numWords_original = 0;
var numWords_updated = 0;
var numNotValidJSON_original = 0;
var numValidButNoSlug_original = 0;
var numWords_original = 0;
var numUpdatedWords_c2crm = 0;
var numNewWords_c2crm = 0;
async function fetchConceptGraph_c2crm() {
    var conceptGrapTableName = jQuery("#myConceptGraphSelector option:selected").data("tablename");
    words_pre_rF_obj = {};
    words_post_rF_obj = {};
    var sql = " SELECT * FROM "+conceptGrapTableName;
    console.log("sql: "+sql);
    numWords_original = 0;
    numWords_updated = 0;
    numNotValidJSON_original = 0;
    numValidButNoSlug_original = 0;
    numWords_original = 0;
    numUpdatedWords_c2crm = 0;
    numNewWords_c2crm = 0;
    sendAsync(sql).then(async (words_original_arr) => {
          numWords_original = words_original_arr.length;
          console.log("fetchConceptGraph_c2crm via sql; numWords_original: "+numWords_original)
          var wordSelectorHTML = "";
          wordSelectorHTML += "<select id=wordSelector >";

          for (var w=0;w<numWords_original;w++) {
              var nextWord = words_original_arr[w];
              var nextWord_rawFile_str = nextWord.rawFile;
              var isValidJSON = MiscFunctions.isValidJSONString(nextWord_rawFile_str)
              if (isValidJSON) {
                  var nextWord_rawFile_obj = JSON.parse(nextWord_rawFile_str);
                  var nextWord_slug = "** valid JSON but no valid slug **";
                  if (nextWord_rawFile_obj.hasOwnProperty("wordData")) {
                      if (nextWord_rawFile_obj.wordData.hasOwnProperty("slug")) {
                          nextWord_slug = nextWord_rawFile_obj.wordData.slug;
                      }
                  }
                  if (nextWord_slug == "** valid JSON but no valid slug **") {
                      numValidButNoSlug_original++;
                  }
                  words_pre_rF_obj[nextWord_slug]=MiscFunctions.cloneObj(nextWord_rawFile_obj);
              } else {
                  numNotValidJSON_original ++;
              }
          }

          // look for patterns
          var patterns_c2crm = findPatterns_c2crm(words_pre_rF_obj);

          // words_post_rF_obj = MiscFunctions.cloneObj(words_pre_rF_obj);
          // THIS IS WHERE THE CHANGES OCCUR
          words_post_rF_obj = await updateWords_c2crm(words_pre_rF_obj,patterns_c2crm);

          for (var w=0;w<numWords_original;w++) {
              var nextWord = words_original_arr[w];
              var nextWord_rawFile_str = nextWord.rawFile;
              var nextWord_rawFile_obj = JSON.parse(nextWord_rawFile_str);
              var nextWord_slug = nextWord_rawFile_obj.wordData.slug;

              var word_original_obj = words_pre_rF_obj[nextWord_slug];
              var word_updated_obj = words_post_rF_obj[nextWord_slug];

              var word_original_str = JSON.stringify(word_original_obj);
              var word_updated_str = JSON.stringify(word_updated_obj);

              wordSelectorHTML += "<option data-slug="+nextWord_slug+" >";
              if (word_original_str != word_updated_str) {
                  wordSelectorHTML += " *** UPDATED *** ";
                  numUpdatedWords_c2crm ++;
              }
              wordSelectorHTML += nextWord_slug;
              wordSelectorHTML += "</option>";
          }
          // now cycle through each word in words_post_rF_obj; if it's not present in words_pre_rF_obj, then add it as another option
          for (const [nextWord_slug, nextWord_rF_obj] of Object.entries(words_post_rF_obj)) {

              if (!words_pre_rF_obj.hasOwnProperty(nextWord_slug)) {
                  wordSelectorHTML += "<option data-slug="+nextWord_slug+" >";
                  wordSelectorHTML += " *** NEW WORD *** ";
                  numNewWords_c2crm ++;
                  wordSelectorHTML += nextWord_slug;
                  wordSelectorHTML += "</option>";
              }

          }

          wordSelectorHTML += "</select>";
          jQuery("#numUpdatedWordsContainer_c2crm").html(numUpdatedWords_c2crm);
          jQuery("#numNewWordsContainer_c2crm").html(numNewWords_c2crm);

          jQuery("#wordSelectorElem").html(wordSelectorHTML);
          jQuery("#wordSelectorElem").change(function(){
              showSelectedWord_c2crm();
          });

          showSelectedWord_c2crm();

          updateBasicInfoBox_c2crm();
    });
}

function updateBasicInfoBox_c2crm() {
    var infoHTML = "";
    infoHTML += "Current: ";
    infoHTML += "numWords: "+numWords_original;
    infoHTML += " numNotValidJSON: "+numNotValidJSON_original;
    infoHTML += " numValidButNoSlug: "+numValidButNoSlug_original;
    infoHTML += "<br>";
    infoHTML += "Updated: ";
    infoHTML += " numUpdatedWords: "+numUpdatedWords_c2crm;

    jQuery("#basicInfoBox_c2crm").html(infoHTML);
}

export default class C2CRelsMaintenance extends React.Component {
    componentDidMount() {
        jQuery("#myConceptGraphSelector").change(function(){
            // console.log("myConceptGraphSelector changed");
            fetchConceptGraph_c2crm();
        })
        fetchConceptGraph_c2crm();
        jQuery("#updateConceptGraphButton").click(function(){
            jQuery.each(words_post_rF_obj,function(nextWord_slug,nextWord_obj){
                MiscFunctions.createOrUpdateWordInAllTables(nextWord_obj)
            })
        })
    }
    render() {
        return (
          <>
            <fieldset className="mainBody" >
                <LeftNavbarMaintenance />
                <div className="mainPanel" >
                    <ConceptGraphMasthead />
                    <div class="h2">C2C Rels Maintenance</div>
                    <br/>
                    <div className="doSomethingButton" id="updateConceptGraphButton">update concept graph</div>
                    <br/>
                    <div id="basicInfoBox_c2crm" style={{border:"1px solid grey",padding:"2px",width:"1200px"}}>
                    info
                    </div>

                    <div id="reportContainer" style={{backgroundColor:"#cad4ed",width:"1200px",height:"600px",border:"1px solid black",padding:"5px",overflow:"scroll"}}>
                        reportContainer
                    </div>

                    Select one word:<div id="wordSelectorElem" style={{display:"inline-block"}} >wordSelectorElem</div>
                    <div style={{display:"inline-block"}} > number of updated words: </div>
                    <div style={{display:"inline-block"}} id="numUpdatedWordsContainer_c2crm" >numUpdatedWordsContainer_c2crm</div>
                    <div style={{display:"inline-block",marginLeft:"20px"}} > number of new words: </div>
                    <div style={{display:"inline-block"}} id="numNewWordsContainer_c2crm" >numNewWordsContainer_c2crm</div>
                    <br/>
                    <div style={{width:"600px",height:"600px",overflow:"scroll",display:"inline-block",border:"1px solid black"}}>
                        <pre id="word_pre_elem">word_pre_elem</pre>
                    </div>
                    <div style={{width:"600px",height:"600px",overflow:"scroll",display:"inline-block",border:"1px solid black"}}>
                        <pre id="word_post_elem">word_post_elem</pre>
                    </div>

                </div>
            </fieldset>
          </>
        );
    }
}
