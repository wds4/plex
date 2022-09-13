import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as ConceptGraphFunctions from '../../functions/conceptGraphFunctions.js';
import * as P_s1n from './patterns/patterns-s1n.js';
import { oPatternDataOutputTemplate } from './patterns/constants.js';
// import { updatePatternMatches } from '../neuroCoreMonitoringPanel.js'
const jQuery = require("jquery");

export const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// SINGLE NODE ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

/*
// moving this function to patterns/patterns-s1n.js
const checkSingleS1nPattern = (node_slug,oNextPattern,oRawFileLookup) => {
    var oCheckSingleS1nPatternOutput = {};
    oCheckSingleS1nPatternOutput.isPatternPresent = false;
    var patternName = oNextPattern.patternName;


    var oNode = oRawFileLookup[node_slug];

    switch (patternName) {
        case "P.rV0.s1n.00":
            try {
                var aNodePatternCodes = oNode.globalDynamicData.nodePatternCodes;
                for (var p=0;p<aNodePatternCodes.length;p++) {
                    var nextPatternCode = aNodePatternCodes[p];
                    if (nextPatternCode.includes("P.rV0.s1n.00")) {
                        oCheckSingleS1nPatternOutput.isPatternPresent = true;
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_rV0_s1n_00; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;
        case "P.rV1.s1n.00":
            try {
                var aNodePatternCodes = oNode.globalDynamicData.nodePatternCodes;
                for (var p=0;p<aNodePatternCodes.length;p++) {
                    var nextPatternCode = aNodePatternCodes[p];
                    if (nextPatternCode.includes("P.rV1.s1n.00")) {
                        oCheckSingleS1nPatternOutput.isPatternPresent = true;
                    }
                }
            } catch (err) {
                console.log("javaScriptError with pattern p_rV1_s1n_00; err: "+err);
                console.log("node_slug: "+node_slug+"; ");
            }
            break;

        default:
            // code
            break;
    }

    console.log("checkSingleS1nPattern; node_slug: "+node_slug+"; oCheckSingleS1nPatternOutput.isPatternPresent: "+oCheckSingleS1nPatternOutput.isPatternPresent)
    return oCheckSingleS1nPatternOutput;
}
*/

const runAllSingleNodePatterns = async (oActiveConceptGraph,aS1nPatternsRawSql,oRawFileLookup) => {
    console.log("runAllSingleNodePatterns")
    var numPatterns = aS1nPatternsRawSql.length;
    var aWords = oActiveConceptGraph.slugLists.total;
    var numWords = aWords.length;
    var oIdentifiedS1nPatternMatches = {};

    var outputHTML = "";
    outputHTML += "numWords: "+numWords;
    outputHTML += "<br>";
    outputHTML += "numPatterns: "+numPatterns;
    outputHTML += "<br>";
    outputHTML += "*** This function (runAllSingleNodePatterns) not yet fully implemented ***";
    outputHTML += "<br>";

    var numS1nPatternsFoundTotal = 0;
    var oNumS1nPatternsFound = {};
    for (var p=0;p<numPatterns;p++) {
        var oNextPattern = aS1nPatternsRawSql[p];
        var sNextPatternName = oNextPattern.patternName;
        oNumS1nPatternsFound[sNextPatternName] = 0;
        oIdentifiedS1nPatternMatches[sNextPatternName] = [];
    }

    for (var w=0;w<numWords;w++) {
        var nextWord_slug = aWords[w];

        for (var p=0;p<numPatterns;p++) {
            var oNextPattern = aS1nPatternsRawSql[p];
            var sNextPatternName = oNextPattern.patternName;

            var oCheckSingleS1nPatternOutput = await P_s1n.checkSingleS1nPattern(nextWord_slug,oNextPattern,oRawFileLookup);
            if (oCheckSingleS1nPatternOutput.isPatternPresent) {
                console.log("present!! w, p: "+w+", "+p+"; sNextPatternName"+sNextPatternName)
                numS1nPatternsFoundTotal++;
                oNumS1nPatternsFound[sNextPatternName]++;
                // for s1n, oAuxiliaryData is an object: { slug: nextWord_slug }
                // var oAuxiliaryData = {};
                var oAuxiliaryData = MiscFunctions.cloneObj(oCheckSingleS1nPatternOutput.oAuxiliaryData);
                oAuxiliaryData.slug = nextWord_slug;
                // console.log("oAuxiliaryData: "+JSON.stringify(oAuxiliaryData,null,4))
                oIdentifiedS1nPatternMatches = await addToIdentifiedPatternMatchesList(oIdentifiedS1nPatternMatches,sNextPatternName,oAuxiliaryData);
            }

        }

    }

    outputHTML += "Number of s1n pattern matches found: "+numS1nPatternsFoundTotal;
    outputHTML += "<br>";
    outputHTML += "oIdentifiedS1nPatternMatches: "+JSON.stringify(oIdentifiedS1nPatternMatches,null,4);
    outputHTML += "<br>";


    jQuery("#patternMatchesS1nContainer").html(JSON.stringify(oIdentifiedS1nPatternMatches,null,4))

    for (var p=0;p<numPatterns;p++) {
        var oNextPattern = aS1nPatternsRawSql[p];
        var sNextPatternName = oNextPattern.patternName;
        outputHTML += "sNextPatternName: "+sNextPatternName+"; number matches: "+oNumS1nPatternsFound[sNextPatternName];
        outputHTML += "<br>";
    }

    return outputHTML;
}

/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// SINGLE RELATIONSHIP ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

const checkSingleS1rPattern = async (oRel,oPattern,oRawFileLookup) => {
    var oCheckSingleS1rPatternOutput = {};
    oCheckSingleS1rPatternOutput.isPatternPresent = false;

    // oRel
    var rel_nodeFrom_slug = oRel.nodeFrom.slug;
    var rel_relType_slug = oRel.relationshipType.slug;
    var rel_nodeTo_slug = oRel.nodeTo.slug;

    // oPattern
    var pattern_wTf = oPattern.wordType_from;
    var pattern_rT = oPattern.relationshipType;
    var pattern_wTt = oPattern.wordType_to;

    // CONDITIONS
    var doesWFromMatch = false;
    var doesWToMatch = false;
    doesWFromMatch = MiscFunctions.doesWordTypeMatch(rel_nodeFrom_slug,pattern_wTf,oRawFileLookup)
    doesWToMatch = MiscFunctions.doesWordTypeMatch(rel_nodeTo_slug,pattern_wTt,oRawFileLookup)
    var doesRelTypeMatch = false;
    if (pattern_rT==rel_relType_slug) {
        doesRelTypeMatch = true;
    }

    if ( (doesWFromMatch) && (doesWToMatch) && (doesRelTypeMatch) ) {
        oCheckSingleS1rPatternOutput.isPatternPresent = true;
    }

    return oCheckSingleS1rPatternOutput;
}

const runOneSingleRelationshipPattern = async (oActiveConceptGraph,aS1rPatternsRawSql,sNextPatternName_one,oRawFileLookup) => {
    var numPatterns = aS1rPatternsRawSql.length;
    var aRels = oActiveConceptGraph.relationshipLists.all;
    var numRels = aRels.length;
    var oIdentifiedS1rPatternMatches = {};

    var outputHTML = "";
    outputHTML += "looking for s1r patterns: "+sNextPatternName_one;
    outputHTML += "<br>";

    var numS1rPatternsFoundTotal = 0;
    var oNumS1rPatternsFound = {};

    for (var p=0;p<numPatterns;p++) {
        var oNextPattern = aS1rPatternsRawSql[p];
        var sNextPatternName = oNextPattern.patternName;
        oNumS1rPatternsFound[sNextPatternName] = 0;
        oIdentifiedS1rPatternMatches[sNextPatternName] = [];
    }

    for (var r=0;r<numRels;r++) {
        var oNextRel = aRels[r];
        for (var p=0;p<numPatterns;p++) {
            var oNextPattern = aS1rPatternsRawSql[p];
            var sNextPatternName = oNextPattern.patternName;
            if (sNextPatternName==sNextPatternName_one) {
                var oCheckSingleS1rPatternOutput = await checkSingleS1rPattern(oNextRel,oNextPattern,oRawFileLookup);
                if (oCheckSingleS1rPatternOutput.isPatternPresent) {
                    // console.log("present!! r, p: "+r+", "+p+"; sNextPatternName"+sNextPatternName)
                    numS1rPatternsFoundTotal++;
                    oNumS1rPatternsFound[sNextPatternName]++;
                    // for s1r, oAuxiliaryData is an object: { relationship: oRel }
                    var oAuxiliaryData = {};
                    oAuxiliaryData.relationship = oNextRel;
                    // console.log("oAuxiliaryData: "+JSON.stringify(oAuxiliaryData,null,4))
                    oIdentifiedS1rPatternMatches = await addToIdentifiedPatternMatchesList(oIdentifiedS1rPatternMatches,sNextPatternName,oAuxiliaryData);
                }
            }
        }
    }

    return outputHTML;
}

const runAllSingleRelationshipPatterns = async (oActiveConceptGraph,aS1rPatternsRawSql,oRawFileLookup) => {
    var numPatterns = aS1rPatternsRawSql.length;
    var aRels = oActiveConceptGraph.relationshipLists.all;
    var numRels = aRels.length;
    var oIdentifiedS1rPatternMatches = {};

    var outputHTML = "";
    outputHTML += "numRels: "+numRels;
    outputHTML += "<br>";
    outputHTML += "number of s1r pattern types to look for: "+numPatterns;
    outputHTML += "<br>";

    var numS1rPatternsFoundTotal = 0;
    var oNumS1rPatternsFound = {};
    for (var p=0;p<numPatterns;p++) {
        var oNextPattern = aS1rPatternsRawSql[p];
        var sNextPatternName = oNextPattern.patternName;
        oNumS1rPatternsFound[sNextPatternName] = 0;
        oIdentifiedS1rPatternMatches[sNextPatternName] = [];
    }
    console.log("runAllSingleRelationshipPatterns; numRels: "+numRels+"; numPatterns: "+numPatterns)
    for (var r=0;r<numRels;r++) {
        var oNextRel = aRels[r];
        for (var p=0;p<numPatterns;p++) {
            var oNextPattern = aS1rPatternsRawSql[p];
            var sNextPatternName = oNextPattern.patternName;
            var oCheckSingleS1rPatternOutput = await checkSingleS1rPattern(oNextRel,oNextPattern,oRawFileLookup);
            if (oCheckSingleS1rPatternOutput.isPatternPresent) {
                // console.log("present!! r, p: "+r+", "+p+"; sNextPatternName"+sNextPatternName)
                numS1rPatternsFoundTotal++;
                oNumS1rPatternsFound[sNextPatternName]++;
                // for s1r, oAuxiliaryData is an object: { relationship: oRel }
                var oAuxiliaryData = {};
                oAuxiliaryData.relationship = oNextRel;
                // console.log("oAuxiliaryData: "+JSON.stringify(oAuxiliaryData,null,4))
                oIdentifiedS1rPatternMatches = await addToIdentifiedPatternMatchesList(oIdentifiedS1rPatternMatches,sNextPatternName,oAuxiliaryData);
            }
        }
    }

    outputHTML += "Number of s1r pattern matches found: "+numS1rPatternsFoundTotal;
    outputHTML += "<br>";
    outputHTML += "oIdentifiedS1rPatternMatches: "+JSON.stringify(oIdentifiedS1rPatternMatches,null,4);
    outputHTML += "<br>";

    jQuery("#patternMatchesS1rContainer").html(JSON.stringify(oIdentifiedS1rPatternMatches,null,4))

    for (var p=0;p<numPatterns;p++) {
        var oNextPattern = aS1rPatternsRawSql[p];
        var sNextPatternName = oNextPattern.patternName;
        outputHTML += "sNextPatternName: "+sNextPatternName+"; number matches: "+oNumS1rPatternsFound[sNextPatternName];
        outputHTML += "<br>";
    }

    return outputHTML;
}

/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// DOUBLE RELATIONSHIP ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

const checkSingleS2rPattern = async (oRel1,oRel2,oPattern,oRawFileLookup) => {
    var oCheckSingleS2rPatternOutput = {};
    oCheckSingleS2rPatternOutput.isPatternPresent = false;

    // oRel1
    var rel_nodeFrom1_slug = oRel1.nodeFrom.slug;
    var rel_relType1_slug = oRel1.relationshipType.slug;
    var rel_nodeTo1_slug = oRel1.nodeTo.slug;

    // oRel2
    var rel_nodeFrom2_slug = oRel2.nodeFrom.slug;
    var rel_relType2_slug = oRel2.relationshipType.slug;
    var rel_nodeTo2_slug = oRel2.nodeTo.slug;

    // oPattern
    var pattern_wTA = oPattern.wordType_A;
    var pattern_wTB = oPattern.wordType_B;
    var pattern_wTC = oPattern.wordType_C;
    var pattern_rTA = oPattern.relationshipType_A;
    var pattern_rTB = oPattern.relationshipType_B;

    // CONDITIONS
    var node1ToSlugEqualsNode2ToSlug = false; // this condition might be different in alternative implementations of double relationship patterns
    var doesRelTypeAMatch = false;
    var doesRelTypeBMatch = false
    var doesWordAMatch = false;
    var doesWordBMatch = false;
    var doesWordCMatch = false;

    if (rel_nodeTo1_slug==rel_nodeTo2_slug) {
        node1ToSlugEqualsNode2ToSlug = true;
    }
    var doesWordAMatch = MiscFunctions.doesWordTypeMatch(rel_nodeFrom1_slug,pattern_wTA,oRawFileLookup)
    var doesWordCMatch = MiscFunctions.doesWordTypeMatch(rel_nodeFrom2_slug,pattern_wTC,oRawFileLookup)
    var doesWordBMatch = MiscFunctions.doesWordTypeMatch(rel_nodeTo1_slug,pattern_wTB,oRawFileLookup)

    if (pattern_rTA==rel_relType1_slug) {
        doesRelTypeAMatch = true;
    }
    if (pattern_rTB==rel_relType2_slug) {
        doesRelTypeBMatch = true;
    }
    if ( (node1ToSlugEqualsNode2ToSlug) & (doesRelTypeAMatch) & (doesRelTypeBMatch) & (doesWordAMatch) & (doesWordBMatch) & (doesWordCMatch) ) {
        oCheckSingleS2rPatternOutput.isPatternPresent = true;
    }

    return oCheckSingleS2rPatternOutput;
}

const runAllDoubleRelationshipPatterns = async (oActiveConceptGraph,aS2rPatternsRawSql,oRawFileLookup) => {
    console.log("runAllDoubleRelationshipPatterns")
    var numPatterns = aS2rPatternsRawSql.length;
    var aRels = oActiveConceptGraph.relationshipLists.all;
    var numRels = aRels.length;
    var oIdentifiedS2rPatternMatches = {};

    var outputHTML = "";
    outputHTML += "numRels: "+numRels;
    outputHTML += "<br>";
    outputHTML += "number of s2r pattern types to look for: "+numPatterns;
    outputHTML += "<br>";

    var numS2rPatternsFoundTotal = 0;
    var oNumS2rPatternsFound = {};
    for (var p=0;p<numPatterns;p++) {
        var oNextPattern = aS2rPatternsRawSql[p];
        var sNextPatternName = oNextPattern.patternName;
        // console.log("oNextPattern "+p+"; "+JSON.stringify(oNextPattern,null,4))
        oNumS2rPatternsFound[sNextPatternName] = 0;
        oIdentifiedS2rPatternMatches[sNextPatternName] = [];
    }
    for (var r1=0;r1<numRels;r1++) {
        var oNextRel1 = aRels[r1];
        for (var r2=0;r2<numRels;r2++) {
            var oNextRel2 = aRels[r2];
            for (var p=0;p<numPatterns;p++) {
                var oNextPattern = aS2rPatternsRawSql[p];
                var sNextPatternName = oNextPattern.patternName;
                var oCheckSingleS2rPatternOutput = await checkSingleS2rPattern(oNextRel1,oNextRel2,oNextPattern,oRawFileLookup)

                if (oCheckSingleS2rPatternOutput.isPatternPresent) {
                    // console.log("present!! r1, r2, p: "+r1+", "+r2+", "+p+"; sNextPatternName"+sNextPatternName)
                    numS2rPatternsFoundTotal++;
                    oNumS2rPatternsFound[sNextPatternName]++;
                    // for s2r, oAuxiliaryData is an object: { relationship1: oRel1, relationship2: oRel2 }
                    var oAuxiliaryData = {};
                    oAuxiliaryData.relationship1 = oNextRel1;
                    oAuxiliaryData.relationship2 = oNextRel2;
                    // console.log("oAuxiliaryData: "+JSON.stringify(oAuxiliaryData,null,4))
                    oIdentifiedS2rPatternMatches = await addToIdentifiedPatternMatchesList(oIdentifiedS2rPatternMatches,sNextPatternName,oAuxiliaryData);
                }
            }
        }
    }

    outputHTML += "Number of s2r pattern matches found: "+numS2rPatternsFoundTotal;
    outputHTML += "<br>";

    jQuery("#patternMatchesS2rContainer").html(JSON.stringify(oIdentifiedS2rPatternMatches,null,4))

    for (var p=0;p<numPatterns;p++) {
        var oNextPattern = aS2rPatternsRawSql[p];
        var sNextPatternName = oNextPattern.patternName;
        outputHTML += "sNextPatternName: "+sNextPatternName+"; number matches: "+oNumS2rPatternsFound[sNextPatternName];
        outputHTML += "<br>";
    }

    return outputHTML;
}

/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// ALL PATTERN TYPES/ ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


const addToIdentifiedPatternMatchesList = async (oInput,sPatternName,oAuxiliaryData) => {
    var oOutput = MiscFunctions.cloneObj(oInput)
    // oOutput format:
    // oOutput[sPatternName] = [oAuxiliaryData1,oAuxiliaryData2, ...]; it can be the empty set
    // for s1n, oAuxiliaryData is an object: { slug: (the slug of the node) }
    // for s1r, oAuxiliaryData is an object: { relationship: oRel }
    // for s2r, oAuxiliaryData is an object: { relationship1: oRel1, relationship2: oRel2 }
    // The main purpose of this function is to make sure the same matching pattern is not represented multiple times

    var isMatchAlreadyAdded = false;

    var numCurrentMatches = oInput[sPatternName];
    for (var m=0;m<numCurrentMatches;m++) {
        var oNextMatchAuxData = oInput[sPatternName][m];
        if ( JSON.stringify(oNextMatchAuxData) == JSON.stringify(oAuxiliaryData) ) {
            isMatchAlreadyAdded = true;
        }
    }

    // MiscFunctions.printObjToConsole(oInput)
    if (!isMatchAlreadyAdded) {
        oOutput[sPatternName].push(oAuxiliaryData)
    }
    // oOutput[sPatternName].push(oAuxiliaryData)

    return oOutput;
}


const runPatternsOneTime = async (thState) => {
    jQuery("#newUpdatedRawFileLookupContainer").html("");
    window.neuroCoreB.patterns.patternMatches = {};
    window.neuroCoreB.patterns.patternMatches.s1n = {};
    window.neuroCoreB.patterns.patternMatches.s1r = {};
    window.neuroCoreB.patterns.patternMatches.s2r = {};
    window.neuroCoreB.patterns.patternMatches.u1n = {};
    window.neuroCoreB.patterns.actionsQueue = {};
    console.log("runPatternsOneTime")
    window.neuroCore.oRFL.updated = {};
    jQuery("#runningPatternsStatusIndicator").css("backgroundColor","yellow");
    var oActiveConceptGraph = MiscFunctions.cloneObj(thState.activeConceptGraph);
    var oRawFileLookup = oActiveConceptGraph.rawFileLookup.current;
    var oPatterns = MiscFunctions.cloneObj(thState.patterns);
    var aS1nPatterns = oPatterns.opCodeC.s1n;
    var aS1rPatterns = oPatterns.opCodeC.s1r;
    var aS2rPatterns = oPatterns.opCodeC.s2r;
    var aS1nPatternsRawSql = oPatterns.aS1nPatternsRawSql
    var aS1rPatternsRawSql = oPatterns.aS1rPatternsRawSql
    var aS2rPatternsRawSql = oPatterns.aS2rPatternsRawSql
    // console.log("aS1rPatternsRawSql: "+JSON.stringify(aS1rPatternsRawSql,null,4))

    var isAllPatternsChecked = jQuery("#allPatterns").prop("checked");
    var isJustOnePatternChecked = jQuery("#justOnePattern").prop("checked");
    var isSelectedPatternsChecked = jQuery("#selectedPatterns").prop("checked");

    var isAllOpCodeBChecked = jQuery("#allOpCodeB").prop("checked")
    var isAllOpCodeCChecked = jQuery("#allOpCodeC").prop("checked")

    var s1nChecked = jQuery("#checkbox-s1n").prop("checked")
    var s1rChecked = jQuery("#checkbox-s1r").prop("checked")
    var s2rChecked = jQuery("#checkbox-s2r").prop("checked")

    var reportHTML = "";
    if (isAllPatternsChecked) {
        reportHTML += "running ALL PATTERNS: batched by opCodeC CATEGORY";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
        reportHTML += "running ALL SINGLE NODE PATTERNS";
        reportHTML += "<br>";
        reportHTML += await runAllSingleNodePatterns(oActiveConceptGraph,aS1nPatternsRawSql,oRawFileLookup)
        reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
        reportHTML += "running ALL SINGLE RELATIONSHIP PATTERNS";
        reportHTML += "<br>";
        reportHTML += await runAllSingleRelationshipPatterns(oActiveConceptGraph,aS1rPatternsRawSql,oRawFileLookup)
        reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
        reportHTML += "running ALL DOUBLE RELATIONSHIP PATTERNS";
        reportHTML += "<br>";
        // reportHTML += runAllDoubleRelationshipPatterns(oActiveConceptGraph,aS2rPatternsRawSql,oRawFileLookup)
        reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
    }
    if (isJustOnePatternChecked) {
        reportHTML += "running INDIVIDUALLY SELECTED PATTERNS (not batched by opCodeC category)";
        reportHTML += "<br>";

        jQuery(".singlePatternCheckbox:checked").each(async function(){
            var thisIndex = jQuery(this).data("index");
            var thisPatternName = jQuery(this).data("name");
            console.log("singlePatternCheckbox; thisIndex: "+thisIndex+"; thisPatternName: "+thisPatternName)
            reportHTML += await runOneSingleRelationshipPattern(oActiveConceptGraph,aS1rPatternsRawSql,thisPatternName,oRawFileLookup);
        })

        reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
    }
    if (isSelectedPatternsChecked) {
        reportHTML += "running SELECTED PATTERNS (selected by opCodes B and C; running batched by opCodeC category)";
        reportHTML += "<br>";
        reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
        if (isAllOpCodeCChecked) {
            reportHTML += "running ALL SINGLE NODE PATTERNS";
            reportHTML += "<br>";
            reportHTML += await runAllSingleNodePatterns(oActiveConceptGraph,aS1nPatternsRawSql,oRawFileLookup)
            reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
            reportHTML += "running ALL SINGLE RELATIONSHIP PATTERNS";
            reportHTML += "<br>";
            reportHTML += await runAllSingleRelationshipPatterns(oActiveConceptGraph,aS1rPatternsRawSql,oRawFileLookup)
            reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
            reportHTML += "running ALL DOUBLE RELATIONSHIP PATTERNS";
            reportHTML += "<br>";
            reportHTML += await runAllDoubleRelationshipPatterns(oActiveConceptGraph,aS2rPatternsRawSql,oRawFileLookup)
            reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
        } else {
            if (s1nChecked) {
                reportHTML += "running ALL SINGLE NODE PATTERNS";
                reportHTML += "<br>";
                reportHTML += await runAllSingleNodePatterns(oActiveConceptGraph,aS1nPatternsRawSql,oRawFileLookup)
                reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
            }
            if (s1rChecked) {
                reportHTML += "running ALL SINGLE RELATIONSHIP PATTERNS";
                reportHTML += "<br>";
                reportHTML += await runAllSingleRelationshipPatterns(oActiveConceptGraph,aS1rPatternsRawSql,oRawFileLookup)
                reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
            }
            if (s2rChecked) {
                reportHTML += "running ALL DOUBLE RELATIONSHIP PATTERNS";
                reportHTML += "<br>";
                reportHTML += await runAllDoubleRelationshipPatterns(oActiveConceptGraph,aS2rPatternsRawSql,oRawFileLookup)
                reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\<br>";
            }
        }
    }
    jQuery("#neuroCoreReportContainer").html(reportHTML)
    jQuery("#neuroCoreReportContainer").val(reportHTML)
    jQuery("#runningPatternsStatusIndicator").css("backgroundColor","#CFCFCF");

    jQuery("#patternMatchesButton").trigger("click")

    var d = new Date();
    d.getTime();
    // alert(d)
    return d;

}

export { runPatternsOneTime };
