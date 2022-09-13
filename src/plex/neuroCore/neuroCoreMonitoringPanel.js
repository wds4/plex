import React from 'react';
import SinglePatternSelector from './singlePatternSelector.js'
import ObjectLinkify from './objectLinkify.js';
// import NeuroCoreReport from './neuroCoreReport.js'
import * as MiscFunctions from '../functions/miscFunctions.js';
import * as InitDOMFunctions from '../functions/transferSqlToDOM.js';
import sendAsync from '../../renderer.js';
import { runPatternsOneTime } from './neuroCoreFunctions/runPatternsOneTime.js'
import { runActionsOneTime } from './neuroCoreFunctions/runActionsOneTime.js'
import { toggleNeuroCorePatternsPanel, toggleNeuroCoreActionsPanel, toggleNeuroCoreStatePanel, manageSinglePatternSelectorCheckboxes } from './uiFunctions.js'

const jQuery = require("jquery");

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const implementChanges = async (thisState) => {
    // alert("implementChanges")
    var summaryHTML = "";
    // summaryHTML += "summary";
    var oCurrentWords = thisState.activeConceptGraph.rawFileLookup.current;
    var oUpdatedWords = thisState.activeConceptGraph.rawFileLookup.updated;
    var oNewWords = thisState.activeConceptGraph.rawFileLookup.new;
    var oDeletedWords = thisState.activeConceptGraph.rawFileLookup.deleted;

    var aCurrentWords = Object.keys(oCurrentWords);
    var aUpdatedWords = Object.keys(oUpdatedWords);
    var aNewWords = Object.keys(oNewWords);
    var aDeletedWords = Object.keys(oDeletedWords);

    var numCurrentWords = aCurrentWords.length;
    var numUpdatedWords = aUpdatedWords.length;
    var numNewWords = aNewWords.length;
    var numDeletedWords = aDeletedWords.length;

    var numChanges = numUpdatedWords + numNewWords + numDeletedWords;

    var numIdentical = 0;
    for (var w=0;w<numUpdatedWords;w++) {
        var nextWord_slug = aUpdatedWords[w];
        var oUpdatedWord = oUpdatedWords[nextWord_slug];
        var oCurrentWord = oCurrentWords[nextWord_slug];

        var sUpdatedWord = JSON.stringify(oUpdatedWord,null,4)
        var sCurrentWord = JSON.stringify(oCurrentWord,null,4)

        // alert("nextWord_slug: "+nextWord_slug)
        // alert("oUpdatedWord: "+JSON.stringify(oUpdatedWord,null,4))

        await MiscFunctions.createOrUpdateWordInAllTables(oUpdatedWord)
    }
    if (numCurrentWords > 0) {
        jQuery("#numChangesMostRecentCycleContainer").html(numChanges)
    }
    jQuery("#loadActiveConceptGraphDataButton").trigger("click")
}

// window.oTestVariable.foo = "bar";
// var starterConceptGraph_tableName = "myConceptGraph_slashtags";
var starterConceptGraph_tableName = "myConceptGraph_temporary";
var activeConceptGraph_tableName = starterConceptGraph_tableName;

const oEmptyThisState = {
    activeConceptGraph: {
        rawFileLookup: {
            current: {},
            updated: {},
            new: {},
            deleted: {}
        },
        tableName: "",
        conceptGraphTitle: "",
        slugLists: {
            total: [],
            schemas: [],
            JSONSchemas: [],
            concepts: [],
            anotherSlugListArray: [],
            anotherSlugListObject: {},
            properties: []
        },
        relationshipLists: {
            all: []
        },
        anotherField: {
            subField: {}
        },
        testField: "initial field"
    },
    patterns:{
        patternsSelector: {
            topLevel: "allPatterns", // allPatterns, justOnePattern, selectedPatterns
            opCodeBSelector: "all", // all, restricted
            opCodeCSelector: "all" // all, restricted
        },
        mapPatternToActions: {},
        aS1nPatternsRawSql: [],
        aS1rPatternsRawSql: [],
        aS2rPatternsRawSql: [],
        opCodeB: {
            a: [],
            b: [],
            c: [],
            rV: {
                rV0: [],
                rV1: [],
                rV2: []
            }
        },
        opCodeC: {
              s1n: [],
              s1r: [],
              s2r: []
        },
        patternMatches: {
              s1n: {},
              s1r: {},
              s2r: {},
              u1n: {}
        },
        actionsQueue: {}
    }
}
async function runTestFunction() {
    var oNewSuperset = await MiscFunctions.createNewWordByTemplate("superset");
    // var oNewSuperset = {"a":"b"};
    console.log("rAoT; oNewSuperset: "+JSON.stringify(oNewSuperset,null,4))
}
export default class NeuroCoreMonitoringPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeConceptGraph: {
                rawFileLookup: {
                    current: {},
                    updated: {},
                    new: {},
                    deleted: {}
                },
                tableName: "",
                conceptGraphTitle: "",
                slugLists: {
                    total: [],
                    schemas: [],
                    JSONSchemas: [],
                    concepts: [],
                    anotherSlugListArray: [],
                    anotherSlugListObject: {},
                    properties: []
                },
                relationshipLists: {
                    all: []
                },
                anotherField: {
                    subField: {}
                },
                testField: "initial field"
            },
            patterns:{
                patternsSelector: {
                    topLevel: "allPatterns", // allPatterns, justOnePattern, selectedPatterns
                    opCodeBSelector: "all", // all, restricted
                    opCodeCSelector: "all" // all, restricted
                },
                mapPatternToActions: {},
                aS1nPatternsRawSql: [],
                aS1rPatternsRawSql: [],
                aS2rPatternsRawSql: [],
                aU1nActionsRawSql: [],
                opCodeB: {
                    a: [],
                    b: [],
                    c: [],
                    rV: {
                        rV0: [],
                        rV1: [],
                        rV2: []
                    }
                },
                opCodeC: {
                      s1n: [],
                      s1r: [],
                      s2r: []
                },
                patternMatches: {
                      s1n: {},
                      s1r: {},
                      s2r: {},
                      u1n: {}
                },
                actionsQueue: {

                }
            }
        }

        // fetch PATTERNS: s1n -- NOT YET IMPLEMENTED
        /*
        var sql_s1n = "SELECT * FROM conceptGraphPatterns_s1n";
        console.log("sql_s1n: "+sql_s1n)
        sendAsync(sql_s1n).then((result_s1n) => {
            var aResult_s1n = result_s1n;
            var numPatterns_s1n = aResult_s1n.length;
            var aS1nPatternsByName = []
            for (var ps1n=0;ps1n<numPatterns_s1n;ps1n++) {
                var oNextPattern_s1n = aResult_s1n[ps1n];
                var nextPatternName_s1n = oNextPattern_s1n.patternName;
                aS1nPatternsByName.push(nextPatternName_s1n)
            }
            window.neuroCore.aS1nPatternsByName = aS1nPatternsByName;
            console.log("window.neuroCore.aS1nPatternsByName: "+JSON.stringify(window.neuroCore.aS1nPatternsByName,null,4))
            this.setState(prevState => {
                var patterns = Object.assign({}, prevState.patterns);
                patterns.opCodeC.s1n = aS1nPatternsByName;
                patterns.aS1nPatternsRawSql = aResult_s1n;
                return { patterns };
            })
        })


        // fetch PATTERNS: s1r
        var sql_s1r = "SELECT * FROM conceptGraphPatterns_s1r";
        console.log("sql_s1r: "+sql_s1r)
        sendAsync(sql_s1r).then((result_s1r) => {
            var aResult_s1r = result_s1r;
            var numPatterns_s1r = aResult_s1r.length;
            var aS1rPatternsByName = []
            for (var ps1r=0;ps1r<numPatterns_s1r;ps1r++) {
                var oNextPattern_s1r = aResult_s1r[ps1r];
                var nextPatternName_s1r = oNextPattern_s1r.patternName;
                aS1rPatternsByName.push(nextPatternName_s1r)
            }
            window.neuroCore.aS1rPatternsByName = aS1rPatternsByName;
            console.log("window.neuroCore.aS1rPatternsByName: "+JSON.stringify(window.neuroCore.aS1rPatternsByName,null,4))
            this.setState(prevState => {
                var patterns = Object.assign({}, prevState.patterns);
                patterns.opCodeC.s1r = aS1rPatternsByName;
                patterns.aS1rPatternsRawSql = aResult_s1r;
                return { patterns };
            })
        })

        // fetch PATTERNS: s2r
        var sql_s2r = "SELECT * FROM conceptGraphPatterns_s2r";
        console.log("sql_s2r: "+sql_s2r)
        sendAsync(sql_s2r).then((result_s2r) => {
            var aResult_s2r = result_s2r;
            var numPatterns_s2r = aResult_s2r.length;
            var aS2rPatternsByName = []
            for (var ps2r=0;ps2r<numPatterns_s2r;ps2r++) {
                var oNextPattern = aResult_s2r[ps2r];
                var nextPatternName = oNextPattern.patternName;
                aS2rPatternsByName.push(nextPatternName)
            }
            window.neuroCore.aS2rPatternsByName = aS2rPatternsByName;
            console.log("window.neuroCore.aS2rPatternsByName: "+JSON.stringify(window.neuroCore.aS2rPatternsByName,null,4))
            this.setState(prevState => {
                var patterns = Object.assign({}, prevState.patterns);
                patterns.opCodeC.s2r = aS2rPatternsByName;
                patterns.aS2rPatternsRawSql = aResult_s2r;
                return { patterns };
            })
        })
        */
    }

    loadActiveConceptGraphData = async () => {
        window.neuroCore.oRFL = {};
        window.neuroCore.oRFL.updated = {};
        var selectedConceptGraph_tablename = jQuery("#neuroCoreConceptGraphSelector option:selected").data("tablename");
        var selectedConceptGraph_title = jQuery("#neuroCoreConceptGraphSelector option:selected").data("conceptgraphtitle");
        var sql = " SELECT * FROM "+selectedConceptGraph_tablename + " WHERE (deleted IS NULL) OR (deleted == '0' ) " ;
        // alert("sql: "+sql)
        var aSlugList = [];
        // var aActiveConceptGraph = [];
        var oActiveConceptRawFileLookup = {}
        var aSchemas = [];
        var aConcepts = [];
        var aJSONSchemas = [];
        var aProperties = [];
        var aRelationshipsAll = [];
        var numCurrNodes = Object.keys(this.state.activeConceptGraph.rawFileLookup.current).length;
        // console.log("qwerty numCurrNodes (loadActiveConceptGraphData, pre-setState): "+numCurrNodes)
        // if (numCurrNodes != 0) {
        sendAsync(sql).then((aResult) => {
            var numRows = aResult.length;
            console.log("numRows: "+numRows)
            for (var r=0;r<numRows;r++) {
                var oNextRow = aResult[r];
                var nextRow_id = oNextRow.id;
                var nextRow_slug = oNextRow.slug;
                var nextRow_title = oNextRow.title;
                var nextRow_rawFile = oNextRow.rawFile;

                var oRawFile = JSON.parse(nextRow_rawFile)
                var aWordTypes = oRawFile.wordData.wordTypes;
                if (jQuery.inArray("schema",aWordTypes) > -1) {
                    aSchemas.push(nextRow_slug)
                    var aRels = oRawFile.schemaData.relationships;
                    aRelationshipsAll = MiscFunctions.concatenateRels(aRelationshipsAll,aRels);
                }
                if (jQuery.inArray("concept",aWordTypes) > -1) {
                    aConcepts.push(nextRow_slug)
                }
                if (jQuery.inArray("JSONSchema",aWordTypes) > -1) {
                    aJSONSchemas.push(nextRow_slug)
                }
                if (jQuery.inArray("property",aWordTypes) > -1) {
                    aProperties.push(nextRow_slug)
                }

                oActiveConceptRawFileLookup[nextRow_slug] = oRawFile;

                aSlugList.push(nextRow_slug)
            }

            // console.log("qwerty; about to setState (loadActiveConceptGraphData)")

            this.setState(prevState => {
                var pState = Object.assign({}, prevState);

                var oPatterns = Object.assign({}, prevState.patterns);

                oPatterns.patternMatches = {};
                oPatterns.patternMatches.s1n = {};
                oPatterns.patternMatches.s1r = {};
                oPatterns.patternMatches.s2r = {};
                oPatterns.patternMatches.u1n = {};
                oPatterns.actionsQueue = {};

                var activeConceptGraph = Object.assign({}, prevState.activeConceptGraph);
                activeConceptGraph.rawFileLookup.current = oActiveConceptRawFileLookup;
                activeConceptGraph.rawFileLookup.updated = {};
                activeConceptGraph.rawFileLookup.new = {};
                activeConceptGraph.rawFileLookup.deleted = {};
                activeConceptGraph.tableName = selectedConceptGraph_tablename;
                activeConceptGraph.conceptGraphTitle = selectedConceptGraph_title;
                activeConceptGraph.slugLists.total = aSlugList;
                activeConceptGraph.slugLists.schemas = aSchemas;
                activeConceptGraph.slugLists.JSONSchemas = aJSONSchemas;
                activeConceptGraph.slugLists.concepts = aConcepts;
                // activeConceptGraph.slugLists.concepts = ["a", "b"];
                // activeConceptGraph.slugLists.anotherSlugListArray = ["c","d"];
                // activeConceptGraph.slugLists.anotherSlugListObject = {"c": "d"};
                activeConceptGraph.slugLists.properties = aProperties;
                activeConceptGraph.relationshipLists.all = aRelationshipsAll;
                // activeConceptGraph.anotherField.subField =  oActiveConceptRawFileLookup;

                var numCurrNodes = Object.keys(activeConceptGraph.rawFileLookup.current).length;
                // console.log("qwerty numCurrNodes (loadActiveConceptGraphData, post-setState A): "+numCurrNodes)
                // window.neuroCoreB = {"a":"b"};
                window.neuroCoreB = pState
                // window.neuroCoreB.activeConceptGraph = {};
                window.neuroCoreB.activeConceptGraph = activeConceptGraph;
                // console.log("window.neuroCoreB.patterns = oPatterns;")
                // window.neuroCoreB.patterns = oPatterns;
                // window.neuroCoreB.patterns.y = "z";
                // window.neuroCoreB.patterns.patternMatches = oPatterns.patternMatches;
                var fooBarHTML = JSON.stringify(window.neuroCoreB,null,4)
                jQuery("#windowNeuroCoreBContainer").val(fooBarHTML)

                var fooBar_updated_HTML = JSON.stringify(window.neuroCoreB.activeConceptGraph.rawFileLookup.updated,null,4)
                jQuery("#windowNeuroCoreB_updated_Container").val(fooBar_updated_HTML)

                var fooBar_patterns_HTML = JSON.stringify(window.neuroCoreB.patterns,null,4)
                jQuery("#windowNeuroCoreB_patterns_Container").val(fooBar_patterns_HTML)

                var fooBar_patternMatches_HTML = JSON.stringify(window.neuroCoreB.patterns.patternMatches,null,4)
                jQuery("#windowNeuroCoreB_patternMatches_Container").val(fooBar_patternMatches_HTML)

                var fooBar_actionsQueue_HTML = JSON.stringify(window.neuroCoreB.patterns.actionsQueue,null,4)
                jQuery("#windowNeuroCoreB_actionsQueue_Container").val(fooBar_actionsQueue_HTML)

                if (numCurrNodes > 0) {
                    return { activeConceptGraph, oPatterns };
                } else {
                    return { prevState };
                }

            },(updatedState) => {
                console.log("this.setState (loadActiveConceptGraphData) is complete ")

            });
            var numCurrNodes = Object.keys(this.state.activeConceptGraph.rawFileLookup.current).length;
            // console.log("qwerty numCurrNodes (loadActiveConceptGraphData, post-setState B): "+numCurrNodes)
        })
        // }
        var numCurrNodes = Object.keys(this.state.activeConceptGraph.rawFileLookup.current).length;
        // console.log("qwerty numCurrNodes (loadActiveConceptGraphData, post-setState C): "+numCurrNodes)
    }

    createConceptGraphSelector = (e) => {
        // console.log("createConceptGraphSelector")
        var sql = " SELECT * FROM myConceptGraphs ";
        var aConceptGraphs = [];

        sendAsync(sql).then((aResult) => {
            // var aResult = result;
            var numRows = aResult.length;
            console.log("numRows: "+numRows)
            for (var r=0;r<numRows;r++) {
                var oNextRow = aResult[r];
                var nextRow_id = oNextRow.id;
                var nextRow_slug = oNextRow.slug;
                var nextRow_title = oNextRow.title;
                var nextRow_tableName = oNextRow.tableName;
                var nextRow_description = oNextRow.description;
                var nextRow_rawFile = oNextRow.rawFile;
                var nextRow_dictionarytablename = oNextRow.referenceDictionary_tableName

                aConceptGraphs[r] = {};
                aConceptGraphs[r].dictionarytablename = nextRow_dictionarytablename;
                aConceptGraphs[r].tableName = nextRow_tableName;
                aConceptGraphs[r].slug = nextRow_slug;
                aConceptGraphs[r].title = nextRow_title;
            }
        }).then((bResult) => {
            var numConceptGraphs = aConceptGraphs.length;
            // alert("done; numConceptGraphs: "+numConceptGraphs)
            var selectorHTML = "";
            selectorHTML += "<select id='neuroCoreConceptGraphSelector' >";
            for (var c=0;c<numConceptGraphs;c++) {
                selectorHTML += "<option ";
                selectorHTML += " data-dictionarytablename="+aConceptGraphs[c].dictionarytablename+" ";
                selectorHTML += " data-tablename="+aConceptGraphs[c].tableName+" ";
                selectorHTML += " data-conceptgraphslug="+aConceptGraphs[c].slug+" ";
                selectorHTML += " data-conceptgraphtitle='"+aConceptGraphs[c].title+"' ";
                if (aConceptGraphs[c].tableName == activeConceptGraph_tableName) {
                    selectorHTML += " selected ";
                }
                selectorHTML += " >";
                selectorHTML += aConceptGraphs[c].title;
                selectorHTML += "</option>";
            }
            selectorHTML += "</select>";
            jQuery("#neuroCoreMainConceptGraphSelectorContainer").html(selectorHTML)
            jQuery("#neuroCoreConceptGraphSelector").change(function(){
                jQuery("#numChangesMostRecentCycleContainer").html("-1")

                jQuery("#loadActiveConceptGraphDataButton").trigger("click")
            })
            jQuery("#loadActiveConceptGraphDataButton").trigger("click")
        })
    }

    queryDatabase_s1n = async (e) => {
        // alert("reload s1n (table not yet created)")
        console.log("queryDatabase_s1n")
        // fetch PATTERNS: s1n
        var sql_s1n = "SELECT * FROM conceptGraphPatterns_s1n";
        console.log("sql_s1n: "+sql_s1n)
        var output = await sendAsync(sql_s1n).then( async (result_s1n) => {
            var aResult_s1n = result_s1n;
            var numPatterns_s1n = aResult_s1n.length;
            var aS1nPatternsByName = []
            var mapPatternToActions = this.state.patterns.mapPatternToActions;
            for (var ps1n=0;ps1n<numPatterns_s1n;ps1n++) {
                var oNextPattern_s1n = aResult_s1n[ps1n];
                var nextPatternName_s1n = oNextPattern_s1n.patternName;
                var sNextPatternActionList_s1n = oNextPattern_s1n.actionsList;
                // console.log("SELECT conceptGraphPatterns_s1n; ps1n: "+ps1n+"; sNextPatternActionList_s1n: "+sNextPatternActionList_s1n)
                var aNextPatternActionList_s1n = sNextPatternActionList_s1n.split(",");
                mapPatternToActions[nextPatternName_s1n] = aNextPatternActionList_s1n
                aS1nPatternsByName.push(nextPatternName_s1n);
            }
            window.neuroCore.aS1nPatternsByName = aS1nPatternsByName;
            // console.log("qwerty; about to setState (queryDatabase_s1n)")
            this.setState(prevState => {
                var patterns = Object.assign({}, prevState.patterns);
                patterns.opCodeC.s1n = aS1nPatternsByName;
                patterns.aS1nPatternsRawSql = aResult_s1n;
                patterns.mapPatternToActions = mapPatternToActions;
                return { patterns };
            })
            return true;
        })
        return output;
    }

    queryDatabase_s1r = async (e) => {
        console.log("queryDatabase_s1r")
        // alert("reload s1r")

        // fetch PATTERNS: s1r
        var sql_s1r = "SELECT * FROM conceptGraphPatterns_s1r";
        console.log("sql_s1r: "+sql_s1r)
        var output = await sendAsync(sql_s1r).then( async (result_s1r) => {
            var aResult_s1r = result_s1r;
            var numPatterns_s1r = aResult_s1r.length;
            var aS1rPatternsByName = []
            var mapPatternToActions = this.state.patterns.mapPatternToActions;
            for (var ps1r=0;ps1r<numPatterns_s1r;ps1r++) {
                var oNextPattern_s1r = aResult_s1r[ps1r];
                var nextPatternName_s1r = oNextPattern_s1r.patternName;
                var sNextPatternActionList_s1r = oNextPattern_s1r.actionsList;
                var aNextPatternActionList_s1r = sNextPatternActionList_s1r.split(",");
                mapPatternToActions[nextPatternName_s1r] = aNextPatternActionList_s1r
                aS1rPatternsByName.push(nextPatternName_s1r);
            }
            window.neuroCore.aS1rPatternsByName = aS1rPatternsByName;
            // console.log("qwerty; about to setState (queryDatabase_s1r)")
            this.setState(prevState => {
                var patterns = Object.assign({}, prevState.patterns);
                patterns.opCodeC.s1r = aS1rPatternsByName;
                patterns.aS1rPatternsRawSql = aResult_s1r;
                patterns.mapPatternToActions = mapPatternToActions;
                return { patterns };
            })
            return true;
        })
        return output;
    }

    queryDatabase_s2r = async (e) => {
        // console.log("queryDatabase_s2r")
        var sql_s2r = "SELECT * FROM conceptGraphPatterns_s2r";
        console.log("sql_s2r: "+sql_s2r)
        var output = await sendAsync(sql_s2r).then( async (result_s2r) => {
            var aResult_s2r = result_s2r;
            var numPatterns_s2r = aResult_s2r.length;
            var aS2rPatternsByName = [];
            var mapPatternToActions = this.state.patterns.mapPatternToActions;
            for (var ps2r=0;ps2r<numPatterns_s2r;ps2r++) {
                var oNextPattern = aResult_s2r[ps2r];
                var nextPatternName = oNextPattern.patternName;
                var sNextPatternActionList = oNextPattern.actionsList;
                var aNextPatternActionList = sNextPatternActionList.split(",");
                mapPatternToActions[nextPatternName] = aNextPatternActionList
                aS2rPatternsByName.push(nextPatternName)
            }
            window.neuroCore.aS2rPatternsByName = aS2rPatternsByName;
            // console.log("qwerty; about to setState (queryDatabase_s2r)")
            this.setState(prevState => {
                var patterns = Object.assign({}, prevState.patterns);
                patterns.opCodeC.s2r = aS2rPatternsByName;
                patterns.aS2rPatternsRawSql = aResult_s2r;
                patterns.mapPatternToActions = mapPatternToActions;
                return { patterns };
            })
            return true;
        })
    }

    queryDatabase_u1n = async (e) => {
        console.log("queryDatabase_u1n")
        var sql_u1n = "SELECT * FROM conceptGraphActions_u1n";
        console.log("sql_u1n: "+sql_u1n)
        var output = await sendAsync(sql_u1n).then( async (result_u1n) => {
            var aResult_u1n = result_u1n;
            var numActions_u1n = aResult_u1n.length;
            var aU1nActionsByName = [];
            var mapPatternToActions = this.state.patterns.mapPatternToActions;

            for (var au1n=0;au1n<numActions_u1n;au1n++) {
                var oNextAction = aResult_u1n[au1n];
                var nextActionName = oNextAction.actionName;
                // var sNextActionPatternList = oNextAction.patternsList;
                // var aNextActionPatternList = sNextActionPatternList.split(",");
                // mapPatternToActions[nextPatternName] = aNextPatternActionList
                aU1nActionsByName.push(nextActionName)
            }
            window.neuroCore.aU1nActionsByName = aU1nActionsByName;
            // console.log("qwerty; about to setState (queryDatabase_u1n)")
            this.setState(prevState => {
                var patterns = Object.assign({}, prevState.patterns);
                // patterns.opCodeC.u1n = aU1nActionsByName;
                patterns.aU1nActionsRawSql = aResult_u1n;
                // patterns.mapPatternToActions = mapPatternToActions;
                return { patterns };
            })

            return true;
        })
    }

    rPoT = () => {
        runPatternsOneTime(this.state)
    }

    rAoT = () => {
        runActionsOneTime(this.state)
        // runTestFunction();
    }

    rPAoT = async () => {
        // alert("rPAoT")
        jQuery("#mainPatternActionActivityStatusContainer").html("RUNNING PATTERNS")
        jQuery("#mainPatternActionActivityStatusContainer").data("status","running")
        // alert("rPAoT; should see RUNNING PATTERNS right now")
        timeout(2000)
        var numCurrNodes = Object.keys(this.state.activeConceptGraph.rawFileLookup.current).length;
        // console.log("qwerty numCurrNodes (rPAoT, pre-runPatternsOneTime): "+numCurrNodes)
        var date1 = await runPatternsOneTime(this.state)
        // alert("rPAoT runPatternsOneTime date: "+date1)
        jQuery("#mainPatternActionActivityStatusContainer").html("RUNNING ACTIONS")
        // alert("rPAoT; should see RUNNING ACTIONS right now")
        timeout(1000)
        var numCurrNodes = Object.keys(this.state.activeConceptGraph.rawFileLookup.current).length;
        // console.log("qwerty numCurrNodes (rPAoT, pre-runActionsOneTime): "+numCurrNodes)
        var date2 = await runActionsOneTime(this.state)
        // alert("rPAoT runActionsOneTime date: "+date2)
        var implementChangesSelector = jQuery("#implementChangesSelector option:selected").val();
        // alert("implementChangesSelector: "+implementChangesSelector)
        var numCurrNodes = Object.keys(this.state.activeConceptGraph.rawFileLookup.current).length;
        // console.log("qwerty numCurrNodes (rPAoT, before implementChanges): "+numCurrNodes)
        if (implementChangesSelector=="yes") {
            jQuery("#mainPatternActionActivityStatusContainer").html("IMPLEMENTING CHANGES")
            await implementChanges(this.state)
        }
        var numCurrNodes = Object.keys(this.state.activeConceptGraph.rawFileLookup.current).length;
        // console.log("qwerty numCurrNodes (rPAoT, after implementChanges): "+numCurrNodes)
        jQuery("#mainPatternActionActivityStatusContainer").html("COMPLETE")
        jQuery("#mainPatternActionActivityStatusContainer").data("status","idle")
    }

    showSummaryOfUpdatesInPanel = () => {
        var summaryHTML = "";
        // summaryHTML += "summary";
        var oCurrentWords = this.state.activeConceptGraph.rawFileLookup.current;
        var oUpdatedWords = this.state.activeConceptGraph.rawFileLookup.updated;
        var oNewWords = this.state.activeConceptGraph.rawFileLookup.new;
        var oDeletedWords = this.state.activeConceptGraph.rawFileLookup.deleted;

        var aCurrentWords = Object.keys(oCurrentWords);
        var aUpdatedWords = Object.keys(oUpdatedWords);
        var aNewWords = Object.keys(oNewWords);
        var aDeletedWords = Object.keys(oDeletedWords);

        var numCurrentWords = aCurrentWords.length;
        var numUpdatedWords = aUpdatedWords.length;
        var numNewWords = aNewWords.length;
        var numDeletedWords = aDeletedWords.length;

        summaryHTML += "numCurrentWords: "+numCurrentWords;
        summaryHTML += "<br>";
        summaryHTML += "numUpdatedWords: "+numUpdatedWords;
        summaryHTML += "<br>";
        summaryHTML += "numNewWords: "+numNewWords;
        summaryHTML += "<br>";
        summaryHTML += "numDeletedWords: "+numDeletedWords;
        summaryHTML += "<br>";

        summaryHTML += "UPDATES: <br>";
        var numIdentical = 0;
        for (var w=0;w<numUpdatedWords;w++) {
            var nextWord_slug = aUpdatedWords[w];
            var oUpdatedWord = oUpdatedWords[nextWord_slug];
            var oCurrentWord = oCurrentWords[nextWord_slug];

            var sUpdatedWord = JSON.stringify(oUpdatedWord,null,4)
            var sCurrentWord = JSON.stringify(oCurrentWord,null,4)

            summaryHTML += "<div ";
            if (sUpdatedWord == sCurrentWord) {
                numIdentical++;
                summaryHTML += " style=background-color:orange; ";
            }
            if (sUpdatedWord != sCurrentWord) {
                summaryHTML += " style=background-color:yellow; ";
            }

            summaryHTML += " >";
                summaryHTML += "<textarea style=width:600px;height:200px;display:inline-block; >";
                summaryHTML += sCurrentWord
                summaryHTML += "</textarea>";

                summaryHTML += "<textarea style=width:600px;height:200px;display:inline-block; >";
                summaryHTML += sUpdatedWord
                summaryHTML += "</textarea>";

                summaryHTML += "<div class=updateWords id=updataWordButton_"+nextWord_slug+" data-slug="+nextWord_slug+" style=display:inline-block; >";
                    summaryHTML += "<div class=doSomethingButton >";
                    summaryHTML += "UPDATE IN SQL"
                    summaryHTML += "</div>";
                summaryHTML += "</div>";
            summaryHTML += "</div>";
        }

        /*
        ///////////////////////////////////
        // SHOW wordTypeFor_pig for debugging purposes
        var nextWord_slug = "wordTypeFor_pig"
        var oUpdatedWord = oUpdatedWords[nextWord_slug];
        var oCurrentWord = oCurrentWords[nextWord_slug];

        var sUpdatedWord = JSON.stringify(oUpdatedWord,null,4)
        var sCurrentWord = JSON.stringify(oCurrentWord,null,4)

        summaryHTML += "<div ";
        if (sUpdatedWord == sCurrentWord) {
            numIdentical++;
            summaryHTML += " style=background-color:orange; ";
        }
        if (sUpdatedWord != sCurrentWord) {
            summaryHTML += " style=background-color:yellow; ";
        }

        summaryHTML += " >";
            summaryHTML += "<textarea style=width:600px;height:200px;display:inline-block; >";
            summaryHTML += sCurrentWord
            summaryHTML += "</textarea>";

            summaryHTML += "<textarea style=width:600px;height:200px;display:inline-block; >";
            summaryHTML += sUpdatedWord
            summaryHTML += "</textarea>";

            summaryHTML += "<div class=updateWords id=updataWordButton_"+nextWord_slug+" data-slug="+nextWord_slug+" style=display:inline-block; >";
                summaryHTML += "<div class=doSomethingButton >";
                summaryHTML += "UPDATE IN SQL"
                summaryHTML += "</div>";
            summaryHTML += "</div>";
        summaryHTML += "</div>";
        ///////////////////////////////////
        */


        summaryHTML = numIdentical + "<br>" + summaryHTML;
        jQuery("#neuroCoreReportContainer").html(summaryHTML)
        jQuery("#neuroCoreReportContainer").val(summaryHTML)
        jQuery(".updateWords").click(function(){
            var slug = jQuery(this).data("slug");
            alert("updateWords; slug: "+slug)
            MiscFunctions.createOrUpdateWordInAllTables(oUpdatedWords[slug])
        })
    }

    onChangePatternSelection = (event) => {
        // update state based on Patterns Selector checkboxes
        var allPatternsChecked = jQuery("#allPatterns").prop("checked")
        var justOnePatternChecked = jQuery("#justOnePattern").prop("checked")
        var selectedPatternsChecked = jQuery("#selectedPatterns").prop("checked")
        var currentTopLevel = "";
        if (allPatternsChecked) { currentTopLevel = "allPatterns" }
        if (justOnePatternChecked) { currentTopLevel = "justOnePattern" }
        if (selectedPatternsChecked) { currentTopLevel = "selectedPatterns" }
        // console.log("qwerty; about to setState (onChangePatternSelection)")
        this.setState(prevState => {
            var patterns = Object.assign({}, prevState.patterns);
            patterns.patternsSelector.topLevel = currentTopLevel;
            return { patterns };
        })
        var cTL = this.state.patterns.patternsSelector.topLevel;
        manageSinglePatternSelectorCheckboxes(currentTopLevel)
    }

    updateRawFileLookup = () => {

        // QWERTY
        // this magically works even if I comment it out ... where else is this being done ???
        // objectLinkify is accessing top level property incorrectly? tableName, conceptGraphTitle???
        // console.log("updateRawFileLookup B")

        var sUpdatedRawFileLookupUpdated = jQuery("#newUpdatedRawFileLookupContainer").html();
        var oUpdatedRawFileLookupUpdated = JSON.parse(sUpdatedRawFileLookupUpdated);
        // console.log("qwerty; about to setState (updateRawFileLookup)")
        var numCurrNodes = Object.keys(this.state.activeConceptGraph.rawFileLookup.current).length;
        // console.log("qwerty numCurrNodes (updateRawFileLookup, before setState): "+numCurrNodes)
        this.setState(prevState => {
            var activeConceptGraph = Object.assign({}, prevState.activeConceptGraph);
            // console.log(" *** qwerty; updateRawFileLookup *** ")
            var aCurrentSlugs = Object.keys(activeConceptGraph.rawFileLookup.current);
            var aUpdatedSlugs = Object.keys(activeConceptGraph.rawFileLookup.updated);
            var numC = aCurrentSlugs.length;
            var numU = aUpdatedSlugs.length;
            for (var u=0;u<numU;u++) {
                var nextUpdatedWord_slug = aUpdatedSlugs[u];
                // console.log("qwerty; nextUpdatedWord_slug: "+nextUpdatedWord_slug)
                var oWordCurrent = activeConceptGraph.rawFileLookup.current[nextUpdatedWord_slug];
                var oWordUpdated = activeConceptGraph.rawFileLookup.updated[nextUpdatedWord_slug];
                var sWordCurrent = JSON.stringify(oWordCurrent,null,4)
                var sWordUpdated = JSON.stringify(oWordUpdated,null,4)
                if (sWordCurrent==sWordUpdated) {
                    delete activeConceptGraph.rawFileLookup.updated[nextUpdatedWord_slug]
                    // console.log("EQUAL")

                }
                if (sWordCurrent != sWordUpdated) {
                    // console.log("UNEQUAL")
                    // console.log("sWordCurrent: "+sWordCurrent)
                    // console.log("sWordUpdated: "+sWordUpdated)
                }
            }
            // console.log("qwerty number current: "+numC+"; number updated: "+numU)
            activeConceptGraph.rawFileLookup.updated = oUpdatedRawFileLookupUpdated
            return { activeConceptGraph };
        })
        var numCurrNodes = Object.keys(this.state.activeConceptGraph.rawFileLookup.current).length;
        // console.log("qwerty numCurrNodes (updateRawFileLookup, after setState): "+numCurrNodes)
    }
    // update patternMatches after they are calculated
    updatePatternMatches = () => {
        // console.log("updatePatternMatches")
        var sPatternMatchesS1n = jQuery("#patternMatchesS1nContainer").html();
        var sPatternMatchesS1r = jQuery("#patternMatchesS1rContainer").html();
        var sPatternMatchesS2r = jQuery("#patternMatchesS2rContainer").html();
        var sPatternMatchesU1n = jQuery("#patternMatchesU1nContainer").html();

        var oPatternMatchesS1n = JSON.parse(sPatternMatchesS1n);
        var oPatternMatchesS1r = JSON.parse(sPatternMatchesS1r);
        var oPatternMatchesS2r = JSON.parse(sPatternMatchesS2r);
        var oPatternMatchesU1n = JSON.parse(sPatternMatchesU1n);

        // console.log("qwerty; about to setState (updatePatternMatches)")
        this.setState(prevState => {
            var patterns = Object.assign({}, prevState.patterns);
            patterns.patternMatches.s1n = oPatternMatchesS1n;
            patterns.patternMatches.s1r = oPatternMatchesS1r;
            patterns.patternMatches.s2r = oPatternMatchesS2r;
            patterns.patternMatches.u1n = oPatternMatchesU1n;
            return { patterns };
        })
    }

    async componentDidMount() {
        // alert("rendering NeuroCoreMonitoringPanel")
        jQuery("#runPatternsOneTimeButton").click(function(){
            // runPatternsOneTime()
        });
        jQuery("#neuroCorePatternsPanelToggleButton").click(function(){
            toggleNeuroCorePatternsPanel();
        });
        jQuery("#neuroCoreActionsPanelToggleButton").click(function(){
            toggleNeuroCoreActionsPanel();
        });
        jQuery("#neuroCoreStatePanelToggleButton").click(function(){
            toggleNeuroCoreStatePanel();
        });
        jQuery("#clearReportPanelButton").click(function(){
            jQuery("#neuroCoreReportContainer").html("")
            jQuery("#neuroCoreReportContainer").val("")
        });

        /*
        // ugly hack to address the problem that I don't know how to do multiple SQL queries
        // at the same time without them interfering with each other
        // 9 May 22: hack replaced with * below
        setTimeout( async function(){
            jQuery("#reloadS1nTableButton").trigger("click");
        },window.delays.reloadTableS1n);
        setTimeout( async function(){
            jQuery("#reloadS1rTableButton").trigger("click");
        },window.delays.reloadTableS1r);
        setTimeout( async function(){
            jQuery("#reloadS2rTableButton").trigger("click");
        },window.delays.reloadTableS2r);
        setTimeout( async function(){
            jQuery("#createConceptGraphSelectorButton").trigger("click");
        },window.delays.neoroCoreConceptGraphSelectorDelay);
        */

        // * below
        // load SQL data into the DOM (probably not good practice; should fix later)
        // init window.lookupWordTypeTemplate
        /*
        setTimeout( async function(){
            InitDOMFunctions.updateWordTypesLookup();
        },100);

        setTimeout( async function(){
            InitDOMFunctions.updateVisjsStyle();
        },1000);

        var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName="myConceptGraph_plex";
        setTimeout( async function(){
            InitDOMFunctions.updateNodeLookup(conceptGraphTableName);
        },2000);
        */
        console.log("NeuroCoreMonitoringPanel a")

        // console.log("NeuroCoreMonitoringPanel b")
        await timeout(400);
        // console.log("NeuroCoreMonitoringPanel c")
        var s1n = this.queryDatabase_s1n(true);
        await timeout(100);
        var s1r = this.queryDatabase_s1r(s1n);
        await timeout(100);
        var s2r = this.queryDatabase_s2r(s1r);
        await timeout(100);
        var u1n = this.queryDatabase_u1n(s2r);
        await timeout(100);
        this.createConceptGraphSelector(u1n);

        console.log("NeuroCoreMonitoringPanel z")

        jQuery("#patternMatchesS1nContainer").html("{}")
        jQuery("#patternMatchesS1rContainer").html("{}")
        jQuery("#patternMatchesS2rContainer").html("{}")
        jQuery("#patternMatchesU1nContainer").html("{}")

        var thisHereState = this.state;
        jQuery("#runPatternsOneTimeButtonB").click(function(){
            // runPatternsOneTime(thisHereState)

            runPatternsOneTime(window.neuroCoreB)

        })
        jQuery("#runActionsOneTimeButtonB").click(function(){
            // runActionsOneTime(thisHereState)
            runActionsOneTime(window.neuroCoreB)
        })
    }

    render() {
        // const {thisHereState} = this.state;
        const {patterns} = this.state;
        const {topLevel} = this.state.patterns.patternsSelector;
        jQuery("#"+topLevel).prop("checked",true);
        jQuery("#executeAllActions").prop("checked",true);
        const numCurrent = Object.keys(this.state.activeConceptGraph.rawFileLookup.current).length;
        const numUpdated = Object.keys(this.state.activeConceptGraph.rawFileLookup.updated).length;
        const numNew = Object.keys(this.state.activeConceptGraph.rawFileLookup.new).length;
        const numDeleted = Object.keys(this.state.activeConceptGraph.rawFileLookup.deleted).length;
        return (
          <>
            <center>NeuroCore Monitoring Panel</center>
            <div style={{display:"none"}}>
                <textarea id="windowNeuroCoreBContainer" style={{display:"inline-block",height:"200px",width:"400px"}}></textarea>
                <textarea id="windowNeuroCoreB_updated_Container" style={{display:"inline-block",height:"200px",width:"400px"}}></textarea>
                <textarea id="windowNeuroCoreB_patterns_Container" style={{display:"inline-block",height:"200px",width:"400px"}}></textarea>
                <textarea id="windowNeuroCoreB_patternMatches_Container" style={{display:"inline-block",height:"200px",width:"400px"}}></textarea>
                <textarea id="windowNeuroCoreB_actionsQueue_Container" style={{display:"inline-block",height:"200px",width:"400px"}}></textarea>
            </div>
            <div style={{fontSize:"10px"}} >
                <div style={{display:"inline-block",border:"1px dashed grey",padding:"5px"}} >
                    <div style={{display:"inline-block",width:"300px"}} >
                    NeuroCore Main Concept Graph Selector:<br/>
                    <div id="neuroCoreMainConceptGraphSelectorContainer" style={{display:"inline-block"}}>x</div>
                    </div>
                    <div style={{display:"inline-block",width:"300px",marginLeft:"20px"}}>
                        title: {this.state.activeConceptGraph.conceptGraphTitle}
                        <br/>
                        tableName: {this.state.activeConceptGraph.tableName}
                    </div>
                    <div style={{display:"inline-block",width:"150px"}}>
                        number of words: {this.state.activeConceptGraph.slugLists.total.length}
                        <br/>
                        number of concepts: {this.state.activeConceptGraph.slugLists.concepts.length}
                    </div>
                    <div style={{display:"inline-block",width:"150px"}}>
                        number of schemas: {this.state.activeConceptGraph.slugLists.schemas.length}
                        <br/>
                        number of JSONSchemas: {this.state.activeConceptGraph.slugLists.JSONSchemas.length}
                    </div>
                    <div style={{display:"inline-block",width:"150px"}}>
                        number of properties: {this.state.activeConceptGraph.slugLists.properties.length}
                        <br/>
                        number of relationships: {this.state.activeConceptGraph.relationshipLists.all.length}
                    </div>
                </div>

                <div style={{display:"inline-block",border:"1px dashed grey",padding:"1px",backgroundColor:"#EFEFEF",marginLeft:"10px"}} >
                    <div style={{display:"inline-block",border:"1px dashed grey",padding:"5px"}} >
                        <div className="doSomethingButton_small" onClick={this.createConceptGraphSelector} id="createConceptGraphSelectorButton" >create Concept Graph Selector</div>
                        <br/>
                        <div className="doSomethingButton_small" onClick={this.loadActiveConceptGraphData} id="loadActiveConceptGraphDataButton" >reload Concept Graph data from SQL</div>
                    </div>
                    <div style={{display:"inline-block",border:"1px dashed grey",padding:"5px"}} >
                        <button id="reloadS1nTableButton" onClick={this.queryDatabase_s1n} >reload s1n</button>
                        <br/>
                        <button id="reloadS1rTableButton" onClick={this.queryDatabase_s1r} >reload s1r</button>
                    </div>
                    <div style={{display:"inline-block",border:"1px dashed grey",padding:"5px"}} >
                        <button id="reloadS2rTableButton" onClick={this.queryDatabase_s2r} >reload s2r</button>
                    </div>
                    <div id="patternMatchesButton" style={{display:"inline-block"}} onClick={this.updatePatternMatches} >updatePatternMatches</div>
                    <div id="patternMatchesS1nContainer" style={{display:"none"}} ></div>
                    <div id="patternMatchesS1rContainer" style={{display:"none"}} ></div>
                    <div id="patternMatchesS2rContainer" style={{display:"none"}} ></div>
                    <div id="patternMatchesU1nContainer" style={{display:"none"}} ></div>
                </div>

                <br/>

                <div style={{display:"inline-block"}} >
                    <div style={{display:"inline-block",border:"1px solid black",padding:"1px 5px 1px 5px"}} >
                        Patterns:
                        <div style={{display:"inline-block",marginLeft:"5px"}}>
                            Status: <div style={{display:"inline-block"}}>off</div>
                        </div>
                        <div style={{display:"inline-block",marginLeft:"5px"}}>
                            run one time:
                            <div id="runPatternsOneTimeButton" onClick={this.rPoT} className="doSomethingButton_small">go</div>
                            <div id="runPatternsOneTimeButtonB" className="doSomethingButton_small">go B</div>
                        </div>
                        <div style={{display:"inline-block",marginLeft:"5px"}}>
                            Run continuously: <div className="doSomethingButton_small">start</div>
                        </div>
                    </div>

                    <div style={{display:"inline-block",marginLeft:"20px",border:"1px solid black",padding:"1px 5px 1px 5px"}} >
                        Actions:
                        <div style={{display:"inline-block",marginLeft:"5px"}}>
                            Status: <div style={{display:"inline-block"}}>off</div>
                        </div>
                        <div style={{display:"inline-block",marginLeft:"5px"}}>
                            run one time:
                            <div id="runActionsOneTimeButton" onClick={this.rAoT} className="doSomethingButton_small">go</div>
                            <div id="runActionsOneTimeButtonB" className="doSomethingButton_small">go B</div>
                        </div>
                        <div style={{display:"inline-block",marginLeft:"5px"}}>
                            Run continuously: <div className="doSomethingButton_small">start</div>
                        </div>
                    </div>

                    <div className="doSomethingButton_small" onClick={this.showSummaryOfUpdatesInPanel} id="showSummaryOfUpdatesInPanelButton" style={{marginLeft:"20px"}} data-status="closed">show summary of updates</div>

                    <div className="doSomethingButton_small" id="clearReportPanelButton" style={{marginLeft:"20px",marginRight:"20px"}} data-status="closed">clear Report Panel</div>

                    <br/>

                    <div style={{display:"inline-block",marginLeft:"5px"}}>
                        run patterns, then actions, then implement changes,
                        <select id="implementChangesSelector" >
                            <option value="no" >no</option>
                            <option value="yes" >yes</option>
                        </select>
                        one cycle: <div id="runPatternsActionsOneTimeButton" onClick={this.rPAoT} className="doSomethingButton_small">go</div>
                        Run continuously:
                        <select id="runContinuouslySelector" >
                            <option value="no" >no</option>
                            <option value="yes" >yes</option>
                        </select>
                    </div>

                    activity status indicators:
                    <div id="runningPatternsStatusIndicator" style={{marginLeft:"5px",display:"inline-block",padding:"3px",border:"1px solid black"}}>running patterns</div>
                    <div id="runningActionsStatusIndicator" style={{marginLeft:"5px",display:"inline-block",padding:"3px",border:"1px solid black"}}>running actions</div>
                    STATUS:
                    <div id="mainPatternActionActivityStatusContainer" data-status="idle" style={{marginLeft:"5px",display:"inline-block",padding:"3px",border:"1px solid black"}}>...</div>
                    Num changes most recent cycle: <div id="numChangesMostRecentCycleContainer" style={{marginLeft:"5px",display:"inline-block",padding:"3px",border:"1px solid black"}}>-1</div>
                </div>

                <br/>

                <div style={{display:"inline-block",padding:"5px"}} >
                    <div className="doSomethingButton_small" id="neuroCorePatternsPanelToggleButton" data-status="closed">show Patterns Panel</div>
                    <div className="doSomethingButton_small" id="neuroCoreActionsPanelToggleButton" data-status="closed">show Actions Panel</div>
                    <div className="doSomethingButton_small" id="neuroCoreStatePanelToggleButton" data-status="closed">show State Panel</div>
                </div>

                <br/>

                <div style={{display:"inline-block",padding:"5px",marginLeft:"20px"}} >
                Current: {numCurrent}
                </div>
                <div style={{display:"inline-block",padding:"5px",marginLeft:"20px"}} >
                Updated: {numUpdated}
                </div>
                <div style={{display:"inline-block",padding:"5px",marginLeft:"20px"}} >
                New: {numNew}
                </div>
                <div style={{display:"inline-block",padding:"5px",marginLeft:"20px"}} >
                Deleted: {numDeleted}
                </div>

                <br/>

                <div style={{display:"none"}} >
                    <div id="rawFileLookupUpdateButton" onClick={this.updateRawFileLookup} >rawFileLookupUpdateButton</div>
                    <div id="newUpdatedRawFileLookupContainer"  ></div>
                </div>

                <div className="neuroCoreStatePanel" id="neuroCoreStatePanel" >
                    <div className="neuroCoreStatePanelElement" style={{width:"750px",height:"100%"}}>
                        <ObjectLinkify objectToLinkifyEmpty={oEmptyThisState} objectToLinkifyFull={this.state} />
                    </div>
                    <div className="neuroCoreStatePanelElement" >
                        <center>this.state (empty)</center>
                        <pre style={{width:"100%",height:"100%"}} >
                        {JSON.stringify(oEmptyThisState,null,4)}
                        </pre>
                    </div>
                    <div className="neuroCoreStatePanelElement" >
                        <center>this.state.activeConceptGraph</center>
                        <pre style={{width:"100%",height:"100%"}} >{JSON.stringify(this.state.activeConceptGraph,null,4)}</pre>
                    </div>
                    <div className="neuroCoreStatePanelElement" >
                        <center>this.state.patterns</center>
                        <pre style={{width:"100%",height:"100%"}} >{JSON.stringify(this.state.patterns,null,4)}</pre>
                    </div>
                    <div className="neuroCoreStatePanelElement" >
                        <center>this.state.activeConceptGraph.rawFileLookup.current</center>
                        <pre style={{width:"100%",height:"100%"}} >{JSON.stringify(this.state.activeConceptGraph.rawFileLookup.current,null,4)}</pre>
                    </div>
                    <div className="neuroCoreStatePanelElement" >
                        <center>this.state.activeConceptGraph.rawFileLookup.updated</center>
                        <pre style={{width:"100%",height:"100%"}} >{JSON.stringify(this.state.activeConceptGraph.rawFileLookup.updated,null,4)}</pre>
                    </div>
                    <div className="neuroCoreStatePanelElement" >
                        <center>this.state.activeConceptGraph.rawFileLookup.new</center>
                        <pre style={{width:"100%",height:"100%"}} >{JSON.stringify(this.state.activeConceptGraph.rawFileLookup.new,null,4)}</pre>
                    </div>
                    <div className="neuroCoreStatePanelElement" >
                        <center>this.state.activeConceptGraph.rawFileLookup.deleted</center>
                        <pre style={{width:"100%",height:"100%"}} >{JSON.stringify(this.state.activeConceptGraph.rawFileLookup.deleted,null,4)}</pre>
                    </div>
                </div>
                <div className="neuroCorePatternsPanel" id="neuroCorePatternsPanel" >
                    <center>Patterns</center>
                    <br/>
                    <div onChange = {this.onChangePatternSelection} id="patternsSelectorContainer" className="ncmpInlineA">
                        <center>Patterns Selector {topLevel}</center>
                        <input id="allPatterns" name="patternsTop" type="radio"  />
                        <label for="allPatterns" class="ncmp-radio-checkbox-label">All Patterns</label>

                        <br/>

                        <input id="justOnePattern" name="patternsTop" type="radio"  />
                        <label for="justOnePattern" class="ncmp-radio-checkbox-label">use Single Pattern Selector (right)</label>

                        <br/>

                        <input id="selectedPatterns" name="patternsTop" type="radio" />
                        <label for="selectedPatterns" class="ncmp-radio-checkbox-label">Selected Categories:</label>

                        <br/>

                        <div style={{marginLeft:"30px"}}>
                            <center>opCode B</center>
                            <input id="allOpCodeB" name="patternsOpCodeB" type="radio" />
                            <label for="allOpCodeB" class="ncmp-radio-checkbox-label">All opCodeB</label>

                            <br/>

                            <input id="restrictedByOpCodeB" name="patternsOpCodeB" type="radio"  />
                            <label for="restrictedByOpCodeB" class="ncmp-radio-checkbox-label">restrict to these opCodeB:</label>

                            <div style={{marginLeft:"30px"}}>

                                <input id="checkbox-1" name="checkbox" type="checkbox"  />
                                <label for="checkbox-1" class="ncmp-radio-checkbox-label" >a</label>

                                <br/>

                                <input id="checkbox-1" name="checkbox" type="checkbox"  />
                                <label for="checkbox-1" class="ncmp-radio-checkbox-label">b</label>

                                <br/>

                                <input id="checkbox-1" name="checkbox" type="checkbox"  />
                                <label for="checkbox-1" class="ncmp-radio-checkbox-label">c</label>

                                <br/>

                                <input id="checkbox-1" name="checkbox" type="checkbox"  />
                                <label for="checkbox-1" class="ncmp-radio-checkbox-label">rV</label>

                            </div>

                            <center>opCode C</center>

                            <input id="allOpCodeC" name="patternsOpCodeC" type="radio" />
                            <label for="allOpCodeC" class="ncmp-radio-checkbox-label">all opCodeC</label>

                            <br/>

                            <input id="restrictedByOpCodeC" name="patternsOpCodeC" type="radio"  />
                            <label for="restrictedByOpCodeC" class="ncmp-radio-checkbox-label">restrict to these opCodeC</label>

                            <div style={{marginLeft:"30px"}}>

                                <input id="checkbox-s1n" name="checkbox" type="checkbox"  />
                                <label for="checkbox-s1n" class="ncmp-radio-checkbox-label">s1n ({this.state.patterns.aS1nPatternsRawSql.length})</label>

                                <br/>

                                <input id="checkbox-s1r" name="checkbox" type="checkbox"  />
                                <label for="checkbox-s1r" class="ncmp-radio-checkbox-label">s1r ({this.state.patterns.aS1rPatternsRawSql.length})</label>

                                <br/>

                                <input id="checkbox-s2r" name="checkbox" type="checkbox"  />
                                <label for="checkbox-s2r" class="ncmp-radio-checkbox-label">s2r ({this.state.patterns.aS2rPatternsRawSql.length})</label>

                            </div>

                        </div>

                    </div>
                    <div className="ncmpInlineA">
                        <SinglePatternSelector dataParentToChild = {patterns} />
                    </div>
                </div>

                <div className="neuroCoreActionsPanel" id="neuroCoreActionsPanel" >
                    <center>Actions</center>
                    <br/>

                    <input id="executeAllActions" name="mainActionSelector" type="radio"  />
                    <label for="executeAllActions" class="ncmp-radio-checkbox-label">go through Pattern Match list, execute all actions</label>

                    <br/>

                    <input id="executeS1nActions" name="mainActionSelector" type="radio"  />
                    <label for="executeS1nActions" class="ncmp-radio-checkbox-label">go through s1n Pattern Match list, execute all actions</label>

                    <br/>

                    <input id="executeS1rActions" name="mainActionSelector" type="radio"  />
                    <label for="executeS1rActions" class="ncmp-radio-checkbox-label">go through s1r Pattern Match list, execute all actions</label>

                    <br/>

                    <input id="executeS2rActions" name="mainActionSelector" type="radio"  />
                    <label for="executeS2rActions" class="ncmp-radio-checkbox-label">go through s2r Pattern Match list, execute all actions</label>

                    <br/>

                    <input id="justOneAction" name="mainActionSelector" type="radio"  />
                    <label for="justOneAction" class="ncmp-radio-checkbox-label">go through Pattern Match list, execute just the first actions</label>

                    <br/>

                    <input id="makeActionsList" name="mainActionSelector" type="radio"  />
                    <label for="makeActionsList" class="ncmp-radio-checkbox-label">go through Pattern Match list, generate an action list (but execute none of them)</label>
                </div>

                <div className="neuroCoreReportPanel" id="neuroCoreReportPanel" >
                    <pre id="neuroCoreReportContainer" style={{fontSize:"16px",width:"100%",height:"100%",backgroundColor:"white"}}>
                        report
                    </pre>
                </div>

                <br/>
                SQL Result:<br/>
                <div id="sqlResultContainer" >result</div>
            </div>

          </>
        );
    }
}
