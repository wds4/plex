import sendAsync from '../renderer.js';
import { loadNeuroCore2ConceptGraph } from '../neuroCore2/neuroCoreTopPanel.js';
import IpfsHttpClient from 'ipfs-http-client';
const jQuery = require("jquery");

const electronFs = window.require('fs');

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/*
let data = "This is a file containing a collection of books.";
electronFs.writeFile("src/plex/neuroCore/neuroCoreFunctions/bookzlz.txt", data, (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
    console.log("The written has the following contents:");
    // console.log(fs.readFileSync("books.txt", "utf8"));
  }
});
*/
// 27 July 2022: deprecating updateConceptGraphActions_u1n (used for neuroCore 0;1 but not neuroCore 0.2; was called by loadSqlToDOM but now commented out)
export const updateConceptGraphActions_u1n = async (res3) => {
    // console.log("updateConceptGraphActions_u1n")
    var sql = " SELECT * from conceptGraphActions_u1n ";

    var r = await sendAsync(sql).then( async (result) => {
        var aResult = result;
        var numRows = aResult.length;
        // console.log("updateConceptGraphActions_u1n numRows: "+numRows)
        var outputFile = "";
        for (var r=0;r<numRows;r++) {
            var oNextAction = aResult[r];
            var nextAction_id = oNextAction.id;
            var nextAction_actionName = oNextAction.actionName;
            var nextAction_opCodesB = oNextAction.opCodesB;
            var nextAction_patternsList = oNextAction.patternsList;
            var nextAction_javascript = oNextAction.javascript;

            // console.log("updateConceptGraphActions_u1n nextAction_actionName: "+nextAction_actionName+"; nextAction_javascript: "+nextAction_javascript)

            window.lookupActionJavascriptByName[nextAction_actionName] = nextAction_javascript;
            outputFile += nextAction_javascript;
            outputFile += "\n\n";
        }

        electronFs.writeFile("src/plex/neuroCore/neuroCoreFunctions/sqlJavascript.js", outputFile, (err) => {
          if (err)
            console.log(err);
          else {
            console.log("File written successfully\n");
            console.log("The written has the following contents:");
            // console.log(fs.readFileSync("books.txt", "utf8"));
          }
        });

        return true;
    })

    return r;
}

// poplate window.lookupWordBySlug -- this is NOT for use by NeuroCore!!!
// call ths wnever the active conceptGraph changes (which is the one at the bottom left of the masthead)
// 27 July 2022: window.neuroCore.subject.oRFL.current
// replace window.lookupWordBySlug with window.neuroCore.subject.oRFL.current
// replace window.allConceptGraphRelationships with window.neuroCore.subject.allConceptGraphRelationships
// window.lookupSqlIDBySlug -- deprecating ???
// window.lookupSlugBySqlID -- deprecating ???
export const updateNodeLookup2 = async (res2, conceptGraphTableName) => {
    // console.log("updateNodeLookup from transferSqlToDOM; conceptGraphTableName: "+conceptGraphTableName)
    if (conceptGraphTableName=="") {
        var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName;
    }
    var sql = " SELECT * from "+conceptGraphTableName;
    console.log("updateNodeLookup from transferSqlToDOM; sql: "+sql)

    var result = res2 + await sendAsync(sql).then( async (result) => {
        var aResult = result;
        var numRows = aResult.length;
        console.log("updateNodeLookup from transferSqlToDOM; numRows: "+numRows)
        window.lookupSqlIDBySlug = {};
        window.lookupSlugBySqlID = {};
        window.allConceptGraphRelationships = [];

        window.neuroCore.subject.allConceptGraphRelationships = [];
        window.neuroCore.subject.oRFL.current = {};
        window.neuroCore.subject.oRFL.new = {};
        window.neuroCore.subject.oRFL.updated = {};

        for (var r=0;r<numRows;r++) {
            if (r > 0) {
                // window.mustReload_lookupWordBySlug = false;
            }
            var oNextWord = aResult[r];
            var nextWord_id = oNextWord.id;
            var nextWord_slug = oNextWord.slug;
            var nextWord_rawFile = oNextWord.rawFile;
            var nextWord_deleted = oNextWord.deleted;
            var oNextWord = JSON.parse(nextWord_rawFile);
            if (nextWord_deleted != 1) {
                window.neuroCore.subject.oRFL.current[nextWord_slug] = oNextWord;
                window.lookupWordBySlug[nextWord_slug] = oNextWord;

                window.lookupSqlIDBySlug[nextWord_slug] = nextWord_id;
                window.lookupSlugBySqlID[nextWord_id] = nextWord_slug;
            }
            if (oNextWord.hasOwnProperty("schemaData")) {
                var aNextSchemaRels = oNextWord.schemaData.relationships;
                for (var z=0;z < aNextSchemaRels.length;z++ ) {
                    var oNextRel = aNextSchemaRels[z];
                    window.allConceptGraphRelationships.push(oNextRel)
                    window.neuroCore.subject.allConceptGraphRelationships.push(oNextRel)
                }
            }
            if (r == numRows - 1) {
                console.log("setting window.mustReload_lookupWordBySlug = false")
                window.mustReload_lookupWordBySlug = false;
            }
            console.log("updateNodeLookup from transferSqlToDOM; success: r="+r)
        }

        return "foo_"+numRows;
    })
    jQuery("#neuroCore2subjectContainer").html(conceptGraphTableName)
    // alert("done with updateNodeLookup")

    return result;
}
export const updateNodeLookup = async (foo,conceptGraphTableName) => {
    // console.log("updateNodeLookup from transferSqlToDOM; conceptGraphTableName: "+conceptGraphTableName)
    if (conceptGraphTableName=="") {
        var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName;
    }
    var sql = " SELECT * from "+conceptGraphTableName;
    console.log("updateNodeLookup from transferSqlToDOM; sql: "+sql)

    var result = foo + await sendAsync(sql).then( async (result) => {
        var aResult = result;
        var numRows = aResult.length;
        console.log("updateNodeLookup from transferSqlToDOM; numRows: "+numRows)
        window.lookupSqlIDBySlug = {};
        window.lookupSlugBySqlID = {};
        window.allConceptGraphRelationships = [];

        window.neuroCore.subject.allConceptGraphRelationships = [];
        window.neuroCore.subject.oRFL.current = {};
        window.neuroCore.subject.oRFL.new = {};
        window.neuroCore.subject.oRFL.updated = {};

        for (var r=0;r<numRows;r++) {
            if (r > 0) {
                // window.mustReload_lookupWordBySlug = false;
            }
            var oNextWord = aResult[r];
            var nextWord_id = oNextWord.id;
            var nextWord_slug = oNextWord.slug;
            var nextWord_rawFile = oNextWord.rawFile;
            var nextWord_deleted = oNextWord.deleted;
            var oNextWord = JSON.parse(nextWord_rawFile);
            if (nextWord_deleted != 1) {
                window.neuroCore.subject.oRFL.current[nextWord_slug] = oNextWord;
                window.lookupWordBySlug[nextWord_slug] = oNextWord;

                window.lookupSqlIDBySlug[nextWord_slug] = nextWord_id;
                // console.log("setting window.lookupSqlIDBySlug nextWord_slug: "+nextWord_slug+"; nextWord_id: "+nextWord_id)
                window.lookupSlugBySqlID[nextWord_id] = nextWord_slug;
            }
            if (oNextWord.hasOwnProperty("schemaData")) {
                var aNextSchemaRels = oNextWord.schemaData.relationships;
                for (var z=0;z < aNextSchemaRels.length;z++ ) {
                    var oNextRel = aNextSchemaRels[z];
                    window.allConceptGraphRelationships.push(oNextRel)
                    window.neuroCore.subject.allConceptGraphRelationships.push(oNextRel)
                }
            }
            if (r == numRows - 1) {
                console.log("setting window.mustReload_lookupWordBySlug = false")
                window.mustReload_lookupWordBySlug = false;
            }
            // console.log("updateNodeLookup from transferSqlToDOM; success: r="+r)
        }

        return "foo_"+numRows;
    })
    jQuery("#neuroCore2subjectContainer").html(conceptGraphTableName)
    // alert("done with updateNodeLookup")

    return result;
}

export const updateWordTypesLookup = async (foo) => {
    var sql = " SELECT * from wordTypes ";
    console.log("updateWordTypesLookup sql: "+sql)

    var result = await sendAsync(sql).then( async (result) => {
        var aResult = result;
        var numRows = aResult.length;
        console.log("updateWordTypesLookup numRows: "+numRows)
        for (var r=0;r<numRows;r++) {
            var oNextWord = aResult[r];
            var nextWord_id = oNextWord.id;
            var nextWord_slug = oNextWord.slug;
            // console.log("updateWordTypesLookup nextWord_id: "+nextWord_id+"; nextWord_slug: "+nextWord_slug)
            var nextWord_template = oNextWord.template;
            var oNextWord_template = JSON.parse(nextWord_template);
            window.lookupWordTypeTemplate[nextWord_slug] = oNextWord_template;
        }
        return true;
    })
    // alert("done with updateWordTypesLookup")
    return result;
}

export const updateVisjsStyle = async (res1) => {
    window.visjs = {};
    window.visjs.groupOptions = {};
    window.visjs.edgeOptions = {};

    var sql = " SELECT * from wordTypes ";
    console.log("updateVisjsStyle sql: "+sql)
    var result1 = await sendAsync(sql).then( async (result) => {
        var aResult = result;
        var numRows = aResult.length;
        console.log("updateVisjsStyle wordTypes numRows: "+numRows)
        for (var r=0;r<numRows;r++) {
            var oNextWord = aResult[r];
            var id = oNextWord.id;
            var slug = oNextWord.slug;
            var backgroundColor = oNextWord.backgroundColor;
            var borderColor = oNextWord.borderColor;
            var shape = oNextWord.shape;
            var borderWidth = oNextWord.borderWidth;
            window.visjs.groupOptions[slug] = {};
            window.visjs.groupOptions[slug].shape=shape;
            window.visjs.groupOptions[slug].borderWidth=borderWidth;
            window.visjs.groupOptions[slug].color = {};
            window.visjs.groupOptions[slug].color.background=backgroundColor;
            window.visjs.groupOptions[slug].color.border=borderColor;
        }
        return true;
    })

    // setTimeout( async function(){
    // "addPropertyKey":{"polarity":"","color":"blue","width":"2","dashes":false},
    var sql = " SELECT * from relationshipTypes ";
    console.log("updateVisjsStyle sql: "+sql)
    var result2 = await sendAsync(sql).then( async (result) => {
        var aResult = result;
        var numRows = aResult.length;
        console.log("updateVisjsStyle relationshipTypes numRows: "+numRows)
        for (var r=0;r<numRows;r++) {
            var oNextRel = aResult[r];
            var id = oNextRel.id;
            var slug = oNextRel.slug;
            var name = oNextRel.name;
            var polarity = oNextRel.polarity;
            var color = oNextRel.color;
            var width = oNextRel.width;
            var dashes = oNextRel.dashes;
            window.visjs.edgeOptions[slug] = {};
            window.visjs.edgeOptions[slug].polarity=polarity;
            window.visjs.edgeOptions[slug].color=color;
            window.visjs.edgeOptions[slug].width=width;
            window.visjs.edgeOptions[slug].dashes=dashes;
        }
        return true;
    })
    // },1000);
    // alert("done with updateVisjsStyle")
    return result1 + result2;
}
export const updateWordTypes = async () => {
    window.visjs = {};
    window.visjs.groupOptions = {};
    window.visjs.edgeOptions = {};

    var sql = " SELECT * from wordTypes ";
    console.log("updateVisjsStyle sql: "+sql)
    var result = await sendAsync(sql).then( async (result) => {
        var aResult = result;
        var numRows = aResult.length;
        console.log("updateVisjsStyle wordTypes numRows: "+numRows)
        for (var r=0;r<numRows;r++) {
            var oNextWord = aResult[r];
            var id = oNextWord.id;
            var slug = oNextWord.slug;
            var backgroundColor = oNextWord.backgroundColor;
            var borderColor = oNextWord.borderColor;
            var shape = oNextWord.shape;
            var borderWidth = oNextWord.borderWidth;
            window.visjs.groupOptions[slug] = {};
            window.visjs.groupOptions[slug].shape=shape;
            window.visjs.groupOptions[slug].borderWidth=borderWidth;
            window.visjs.groupOptions[slug].color = {};
            window.visjs.groupOptions[slug].color.background=backgroundColor;
            window.visjs.groupOptions[slug].color.border=borderColor;
        }
        return true;
    })
    return result;
}
export const updateRelationshipTypes = async () => {
    window.visjs = {};
    window.visjs.groupOptions = {};
    window.visjs.edgeOptions = {};

    var sql = " SELECT * from relationshipTypes ";
    console.log("updateVisjsStyle sql: "+sql)
    var result = await sendAsync(sql).then( async (result) => {
        var aResult = result;
        var numRows = aResult.length;
        console.log("updateVisjsStyle relationshipTypes numRows: "+numRows)
        for (var r=0;r<numRows;r++) {
            var oNextRel = aResult[r];
            var id = oNextRel.id;
            var slug = oNextRel.slug;
            var name = oNextRel.name;
            var polarity = oNextRel.polarity;
            var color = oNextRel.color;
            var width = oNextRel.width;
            var dashes = oNextRel.dashes;
            window.visjs.edgeOptions[slug] = {};
            window.visjs.edgeOptions[slug].polarity=polarity;
            window.visjs.edgeOptions[slug].color=color;
            window.visjs.edgeOptions[slug].width=width;
            window.visjs.edgeOptions[slug].dashes=dashes;
        }
        return true;
    })
    // },1000);
    // alert("done with updateVisjsStyle")
    return result;
}

export const loadSqlToDOM = async () => {
    console.log("loadSqlToDOM from transferSqlToDOM.js ")

    var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName;
    var t1 = await timeout(500)
    var res1 = await updateWordTypesLookup(t1);
    var t2 = await timeout(500)
    var res2 = await updateVisjsStyle(res1);
    var t3 = timeout(500)
    var res3 = await updateNodeLookup(res2,conceptGraphTableName);
    // var t4 = timeout(10)
    // var res4 = await updateConceptGraphActions_u1n(res3);

    var t5 = timeout(500)
    var res5 = await loadNeuroCore2ConceptGraph(res3);

    console.log("loadSqlToDOM; res1: "+res1+"; res2: "+res2+"; res3: "+res3)
    window.initDOMFunctionsComplete = true;

    /*
    setTimeout( async function(){
        updateWordTypesLookup();
    },100);

    setTimeout( async function(){
        updateVisjsStyle();
    },1000);
    setTimeout( async function(){
        updateNodeLookup(conceptGraphTableName);
    },2000);
    */
    return true;
}
