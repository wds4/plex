import React, { useState, useEffect } from "react";
import * as TransferSqlToDOM from '../functions/transferSqlToDOM.js'

const jQuery = require("jquery");

const NeuroCoreTimer = () => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        setTimeout(() => {
            setCount((count) => count + 1);
            var modFive = (count + 1) % 5;
            if (modFive==0) {
                var numChanges = jQuery("#numChangesMostRecentCycleContainer").html()
                var runContinuously = jQuery("#runContinuouslySelector option:selected").val();
                var mainPatternActionActivityStatus = jQuery("#mainPatternActionActivityStatusContainer").data("status")
                if ( (!window.mustReload_lookupWordBySlug) && (parseInt(numChanges) != 0) && (runContinuously=="yes") && (mainPatternActionActivityStatus=="idle")) {
                // if ( (!window.mustReload_lookupWordBySlug) && (runContinuously=="yes") && (mainPatternActionActivityStatus=="idle")) {
                    jQuery("#neuroCoreTimerCounterContainer").css("backgroundColor","green")
                    jQuery("#runPatternsActionsOneTimeButton").trigger("click")
                } else {
                    jQuery("#neuroCoreTimerCounterContainer").css("backgroundColor","red")
                }
            } else {
                jQuery("#neuroCoreTimerCounterContainer").css("backgroundColor","#CFCFCF")
            }
        }, 1000);
    }, [count]); // <- add empty brackets here
    if (count % 5 === 1) {
        if (window.mustReload_lookupWordBySlug) {
            console.log("need to call TransferSqlToDOM.updateNodeLookup()")
            var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName;
            TransferSqlToDOM.updateNodeLookup(true,conceptGraphTableName);
        }
    }
    return (
        <div style={{display:"inline-block"}} >
            <div id = "neuroCoreTimerCounterContainer" style={{display:"inline-block"}} >NeuroCore Timer! counter: {count}</div>
        </div>
    )
}

export default NeuroCoreTimer;

/*
// ASYNC FUNCTIONS THAT MUST BE DONE ONE AT A TIME
TransferSqlToDOM.updateNodeLookup(conceptGraphTableName);
InitDOMFunctions.loadSqlToDOM() ** this has THREE STEPS:
var res1 = await updateWordTypesLookup(t1); -- one query of wordTypes
var res2 = await updateVisjsStyle(); -- two queries of wordTypes and relationshipTypes (might break into two)
var res3 = await updateNodeLookup(conceptGraphTableName); -- one query of the active conceptGraph table

updateWordTypes -- one query of wordTypes
updateRelationshipTypes -- one query of relationshipTypes

REDO - FOR window DOM:
info to maintain:
window.currentConceptGraph
window.currentConceptGraphSqlID (not yet maintained)

window.currentConceptSqlID
window.aLookupConceptInfoBySqlID

tables to load once at startup:
wordTypes (currently I load it twice)
relationshipTypes
the active concept graph table into window DOM variables (active for the wider app)

FOR neuroCoreMonitoringPanel state variables:
the active concept graph (active for neuroCore) (selectedConceptGraph_tablename)
conceptGraphPatterns_s1n -- not yet implemented
conceptGraphPatterns_s1r
conceptGraphPatterns_s2r
myConceptGraphs

*/
