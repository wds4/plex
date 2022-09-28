import sendAsync from '../renderer.js';
import IpfsHttpClient from 'ipfs-http-client';
import * as NeuroCore2 from '../neuroCore2/neuroCoreTopPanel.js'
import * as MiscIpfsFunctions from '../lib/ipfs/miscIpfsFunctions.js'
const jQuery = require("jquery");

export const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const zeroThisJSONSchema = (oJSONSchemaData) => {
    var oZeroedJSONSchemaData = cloneObj(oJSONSchemaData);

    oZeroedJSONSchemaData.definitions = {};
    oZeroedJSONSchemaData.properties = {};
    oZeroedJSONSchemaData.allOf = [];

    return oZeroedJSONSchemaData;
}

export const zeroThisProperty = (oPropertyData) => {
    var oZeroedPropertyData = cloneObj(oPropertyData);
    var propertyType = oZeroedPropertyData.propertyData.type;

    if (propertyType=="array") {
        /*
        oZeroedPropertyData.propertyData.items = [];
        oZeroedPropertyData.propertyData.includeDependencies = null;
        oZeroedPropertyData.propertyData.dependencySlugs = null;
        oZeroedPropertyData.propertyData.dependencyPlacement = null;
        */
        delete oZeroedPropertyData.propertyData.items;
        delete oZeroedPropertyData.propertyData.includeDependencies;
        delete oZeroedPropertyData.propertyData.dependencySlugs;
        delete oZeroedPropertyData.propertyData.dependencyPlacement;
    }
    if (propertyType=="string") {
        /*
        oZeroedPropertyData.propertyData.enum = [];
        oZeroedPropertyData.propertyData.includeDependencies = null;
        oZeroedPropertyData.propertyData.dependencySlugs = null;
        oZeroedPropertyData.propertyData.dependencyPlacement = null;
        */
        delete oZeroedPropertyData.propertyData.enum;
        delete oZeroedPropertyData.propertyData.includeDependencies;
        delete oZeroedPropertyData.propertyData.dependencySlugs;
        delete oZeroedPropertyData.propertyData.dependencyPlacement;
    }
    if (propertyType=="object") {
        oZeroedPropertyData.propertyData.required = [];
        oZeroedPropertyData.propertyData.unique = [];
        oZeroedPropertyData.propertyData.properties = {};
        oZeroedPropertyData.propertyData.dependencies = {};
        oZeroedPropertyData.propertyData.metaData.requiredDefinitions = [];
        oZeroedPropertyData.propertyData.metaData.childProperties = {};
        oZeroedPropertyData.propertyData.metaData.childProperties.direct = [];
        oZeroedPropertyData.propertyData.metaData.childProperties.thisConcept = [];
        oZeroedPropertyData.propertyData.metaData.childProperties.allConcepts = [];
    }

    return oZeroedPropertyData
}
export const addAdditionalThenConstraint = (oThenAll_in,oThenNext,aPropertyKeys) => {
    var oThenAll = cloneObj(oThenAll_in);

    console.log("oThenAll a: "+JSON.stringify(oThenAll,null,4))

    var oCurrentThread = cloneObj(oThenAll_in);
    // console.log("oCurrentThread: "+JSON.stringify(oCurrentThread,null,4))
    var aMatchingKeys = [];
    var foundIt = false;
    var keyNext = "foo";
    for (var k=0;k < aPropertyKeys.length; k++) {
        var key = aPropertyKeys[k];
        console.log("k:"+k+"; key: "+key)
        if (foundIt == false) {
            if (!oCurrentThread.properties.hasOwnProperty(key)) {
                // found it!
                console.log("oCurrentThread does NOT have the key: "+key)
                foundIt = true;
                keyNext = key;
            }
            if (oCurrentThread.properties.hasOwnProperty(key)) {
                aMatchingKeys.push(key);
                var oCurrentThread = cloneObj(oCurrentThread.properties[key])
                console.log("oCurrentThread has the key: "+key)
            }
        }
    }
    console.log("aMatchingKeys: "+JSON.stringify(aMatchingKeys,null,4))
    console.log("keyNext:"+keyNext)
    var numMatchingKeys = aMatchingKeys.length;
    if (numMatchingKeys==1) {
        var key0 = aMatchingKeys[0];
        oThenAll.properties[key0].properties[keyNext] = oThenNext.properties[key0].properties[keyNext];
    }

    console.log("oThenAll b: "+JSON.stringify(oThenAll,null,4))

    return cloneObj(oThenAll);
}

export const findSourceSetWordSlug = (sourceConceptSlug,sourceSetSlug) => {
    var set_wordSlug = null;
    var concept_wordSlug = findWordSlugFromConceptSlug(sourceConceptSlug)
    var oConcept = window.lookupWordBySlug[concept_wordSlug]
    var superset_wordSlug = oConcept.conceptData.nodes.superset.slug;
    var oSuperset = window.lookupWordBySlug[superset_wordSlug]
    var supersetSlug = oSuperset.supersetData.slug;
    if (supersetSlug==sourceSetSlug) {
        set_wordSlug = superset_wordSlug
    } else {
        var aSets = oSuperset.metaData.subsets;
        for (var a=0;a<aSets.length;a++) {
            var nextSet_wordSlug = aSets[a];
            var oSet = window.lookupWordBySlug[nextSet_wordSlug]
            var nextSet_setSlug = oSet.setData.slug;
            if (nextSet_setSlug==sourceSetSlug) {
                set_wordSlug = nextSet_wordSlug;
            }
        }
    }

    return set_wordSlug;
}

export const findWordSlugFromConceptSlug = (conceptSlug) => {
    var wordSlug = null;

    var aWords = Object.keys(window.lookupWordBySlug)
    for (var w=0;w<aWords.length;w++) {
        var nextWord_slug = aWords[w];
        var oNextWord = window.lookupWordBySlug[nextWord_slug];
        if (oNextWord.hasOwnProperty("conceptData")) {
            var nextConcept_conceptSlug = oNextWord.conceptData.slug;
            if (nextConcept_conceptSlug==conceptSlug) {
                wordSlug = nextWord_slug;
            }
        }
    }

    return wordSlug;
}

export const fetchPropertySlugFromKeyPath = (concept_conceptSlug,aPropertyKeyPaths) => {
    console.log("fetchPropertySlugFromKeyPath; concept_conceptSlug: "+concept_conceptSlug)
    var property_wordSlug = null;
    var concept_wordSlug = null;
    var oConcept1 = {};
    /*
    var nodeToData = {};
    nodeToData.slug = null;
    nodeToData.targetConceptSlug = concept_conceptSlug;
    nodeToData.targetPropertyKey = null;
    nodeToData.targetPropertyKeyPaths = aPropertyKeyPaths;
    */

    var aWords = Object.keys(window.lookupWordBySlug)
    for (var w=0;w<aWords.length;w++) {
        var nextWord_slug = aWords[w];
        var oNextWord = window.lookupWordBySlug[nextWord_slug];
        if (oNextWord.hasOwnProperty("conceptData")) {
            var nextConcept_conceptSlug = oNextWord.conceptData.slug;
            if (nextConcept_conceptSlug==concept_conceptSlug) {
                concept_wordSlug = nextWord_slug;
                oConcept1 = oNextWord;
            }
        }
    }

    console.log("fetchPropertySlugFromKeyPath; concept_wordSlug: "+concept_wordSlug)

    // find the property p1 that meets two criteria:
    // 1) its key is nextKey
    // 2) there exists a relationship p1 -- addToConceptGraphProperties -- p_target where p_target is the previous p1
    if (concept_wordSlug != null) {
        var oConcept = window.lookupWordBySlug[concept_wordSlug]
        var primaryProperty_slug = oConcept.conceptData.nodes.primaryProperty.slug;
        var propertySchema_slug = oConcept.conceptData.nodes.propertySchema.slug;
        var oPropertySchema = window.lookupWordBySlug[propertySchema_slug];
        var aRels = oPropertySchema.schemaData.relationships;
        var propertyKeyPath = "";
        if (aPropertyKeyPaths.length > 0) {
            propertyKeyPath = aPropertyKeyPaths[0];
            var aKeys = propertyKeyPath.split(".");
            var p_target = primaryProperty_slug;
            for (var x=0;x<aKeys.length;x++) {
                var nextKey = aKeys[x];
                var foundIt = false;
                for (var r=0;r<aRels.length;r++) {
                    if (!foundIt) {
                        var oNextRel = aRels[r];
                        var rT = oNextRel.relationshipType.slug;
                        if (rT=="addToConceptGraphProperties") {
                            var nT = oNextRel.nodeTo.slug;
                            if (nT==p_target) {
                                var nF = oNextRel.nodeFrom.slug;
                                var oNF = window.lookupWordBySlug[nF]
                                var nF_key = oNF.propertyData.key;
                                if (nextKey == nF_key) {
                                    foundIt = true;
                                    p_target = nF;
                                    property_wordSlug = p_target;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    // nodeToData.slug = property_wordSlug;
    return property_wordSlug;
}

export const convertNameToDescription = (name) => {
    var description = "Provide a description of this "+name+".";
    return description;
}

export const convertNameToSlug = (name) => {
    var slug = name;
    if (name) {
        var slug = "";
        var aChunks = name.split(" ");
        for (var c=0;c<aChunks.length;c++) {
            var nextChunk = aChunks[c];
            if (nextChunk) {
                if (c > 0) {
                    nextChunk = nextChunk[0].toUpperCase() + nextChunk.substring(1)
                }
                slug += nextChunk;
            }
        }
    }
    return slug;
}

export const convertNameToTitle = (name) => {
    var title = name;
    if (name) {
        var title = "";
        var aChunks = name.split(" ");
        for (var c=0;c<aChunks.length;c++) {
            var nextChunk = aChunks[c];
            if (nextChunk) {
                nextChunk = nextChunk[0].toUpperCase() + nextChunk.substring(1)
                title += nextChunk;
                if (c < aChunks.length - 1) {
                    title += " ";
                }
            }
        }
    }
    return title;
}

export const fetchDefaultPropertyKeys = (concept_slug) => {
    var aPropertyKeys = [];
    var oMainSchemaForConceptGraph = window.lookupWordBySlug[window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug];
    var aDefaultPropertyKeys_cg = oMainSchemaForConceptGraph.conceptGraphData.properties.default;
    var oConcept = window.lookupWordBySlug[concept_slug];
    var aDefaultPropertyKeys_c_additional = oConcept.conceptData.defaultProperties.additional;
    var aDefaultPropertyKeys_c_omit = oConcept.conceptData.defaultProperties.omit;
    for (var p=0;p<aDefaultPropertyKeys_cg.length;p++) {
        var nextKey = aDefaultPropertyKeys_cg[p];
        if (!aDefaultPropertyKeys_c_omit.includes(nextKey)) {
            aPropertyKeys.push(nextKey)
        }
    }
    for (var p=0;p<aDefaultPropertyKeys_c_additional.length;p++) {
        var nextKey = aDefaultPropertyKeys_c_additional[p];
        if (!aPropertyKeys.includes(nextKey)) {
            aPropertyKeys.push(nextKey)
        }
    }
    return aPropertyKeys;
}

// look in window.lookupWordBySlug to see whether any word exists such that metaData.replacementFor == word_slug
export const doesReplacementAlreadyExist = (word_slug) => {
    var answer = false;
    var aWords = Object.keys(window.lookupWordBySlug)
    for (var w=0;w<aWords.length;w++) {
        var nextWord_slug = aWords[w];
        var oNextWord = window.lookupWordBySlug[nextWord_slug]
        if (oNextWord.metaData.hasOwnProperty("replacementFor")) {
            if (oNextWord.metaData.replacementFor == word_slug) {
                answer = nextWord_slug;
            }
        }
    }

    return answer;
}

export const populateWordDataFromPropertyData = (oWord,governingConceptNameSingular,governingConcept_conceptSlugSingular) => {
    var oWord_out = cloneObj(oWord);
    var wT = oWord.wordData.wordType;
    var ipns = oWord.metaData.ipns;

    var primaryWordTypeSlug = oWord.propertyData.key;
    var primaryWordTypeName = oWord.propertyData.name;
    var primaryWordTypeTitle = oWord.propertyData.title;
    var primaryWordTypeDescription = oWord.propertyData.description;
    if (oWord.propertyData.metaData.types.includes("primaryProperty")) {
        oWord_out.wordData.slug = "primaryPropertyFor_"+governingConcept_conceptSlugSingular;
        oWord_out.wordData.name = "primary property for "+governingConceptNameSingular;
        oWord_out.wordData.title = "Primary Property for "+governingConceptNameSingular;
    } else {
        oWord_out.wordData.slug = "propertyFor_"+governingConcept_conceptSlugSingular+"_"+primaryWordTypeSlug+"_"+ipns.slice(-6);
        oWord_out.wordData.name = "property for "+governingConceptNameSingular+": "+primaryWordTypeName;
        oWord_out.wordData.title = "Property for "+governingConceptNameSingular+": "+primaryWordTypeName;
    }
    oWord_out.wordData.description = primaryWordTypeDescription;

    return oWord_out;
}
export const populateWordDataFromPrimaryWordType = (oWord) => {
    var oWord_out = cloneObj(oWord);
    var wT = oWord.wordData.wordType;
    var ipns = oWord.metaData.ipns;
    // might want to automate this by looking up propertyPath for this wordType - (once neuroCore 0.2 is complete?)
    if (wT == "wordType") {
        var primaryWordTypeSlug = oWord.wordTypeData.slug;
        var primaryWordTypeName = oWord.wordTypeData.name;
        var primaryWordTypeTitle = oWord.wordTypeData.title;
        var primaryWordTypeDescription = oWord.wordTypeData.description;
        oWord_out.wordData.slug = "wordTypeFor_"+primaryWordTypeSlug;
        oWord_out.wordData.name = "wordType for "+primaryWordTypeName;
        oWord_out.wordData.title = "WordType for "+primaryWordTypeTitle;
        oWord_out.wordData.description = primaryWordTypeDescription;
    }
    if (wT == "concept") {
        var primaryWordTypeSlug = oWord.conceptData.slug;
        var primaryWordTypeName = oWord.conceptData.name.singular;
        var primaryWordTypeTitle = oWord.conceptData.title;
        var primaryWordTypeDescription = oWord.conceptData.description;
        oWord_out.wordData.slug = "conceptFor_"+primaryWordTypeSlug;
        oWord_out.wordData.name = "concept for "+primaryWordTypeName;
        oWord_out.wordData.title = "Concept for "+primaryWordTypeTitle;
        oWord_out.wordData.description = primaryWordTypeDescription;
    }
    if (wT == "set") {
        var primaryWordTypeSlug = oWord.setData.slug;
        var primaryWordTypeName = oWord.setData.name;
        var primaryWordTypeTitle = oWord.setData.title;
        var primaryWordTypeDescription = oWord.setData.description;
        oWord_out.wordData.slug = "setOf_"+primaryWordTypeSlug;
        oWord_out.wordData.name = "set of "+primaryWordTypeName;
        oWord_out.wordData.title = "Set of "+primaryWordTypeTitle;
        oWord_out.wordData.description = primaryWordTypeDescription;
    }
    if (wT == "property") {
        // make this into separate function since wordData.slug incorporates the govering concept name
    }
    return oWord_out;
}
export const pareDownPropertyData = (oPropertyData) => {
    var oPropertyData_out = cloneObj(oPropertyData);
    var mD = cloneObj(oPropertyData_out.metaData);
    delete oPropertyData_out.metaData;
    delete oPropertyData_out.types;
    delete oPropertyData_out.properties;
    delete oPropertyData_out.enum;
    oPropertyData_out.metaData = mD;
    /*
    var propertyType = oPropertyData_out.type;
    if (propertyType=="object") {

    }
    */
    var sPropertyData_out = JSON.stringify(oPropertyData_out,null,4)
    // console.log("pareDownPropertyData; sPropertyData_out: "+sPropertyData_out)
    return oPropertyData_out;
}

export const updateNodeLookup4 = async (res2, conceptGraphTableName) => {
    // console.log("updateNodeLookup from transferSqlToDOM; conceptGraphTableName: "+conceptGraphTableName)
    if (conceptGraphTableName=="") {
        var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName;
    }
    var sql = " SELECT * from "+conceptGraphTableName;
    console.log("updateNodeLookup4 from MiscFunctions; sql: "+sql)

    var result = res2 + await sendAsync(sql).then( async (result) => {
        var aResult = result;
        var numRows = aResult.length;
        console.log("updateNodeLookup4 from MiscFunctions; numRows: "+numRows)
        window.lookupWordBySlug = {};

        window.lookupSqlIDBySlug = {};
        window.lookupSlugBySqlID = {};

        window.allConceptGraphRelationships = [];

        window.neuroCore.subject.allConceptGraphRelationships = [];
        window.neuroCore.subject.oRFL.current = {};
        window.neuroCore.subject.oRFL.new = {};
        window.neuroCore.subject.oRFL.updated = {};
        window.neuroCore.subject.oMainSchemaForConceptGraph = {};

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
                if (oNextWord.schemaData.hasOwnProperty("relationships")) {
                    var aNextSchemaRels = oNextWord.schemaData.relationships;
                    for (var z=0;z < aNextSchemaRels.length;z++ ) {
                        var oNextRel = aNextSchemaRels[z];
                        window.allConceptGraphRelationships.push(oNextRel)
                        window.neuroCore.subject.allConceptGraphRelationships.push(oNextRel)
                    }
                }
            }
            if (oNextWord.hasOwnProperty("conceptGraphData")) {
                window.neuroCore.subject.oMainSchemaForConceptGraph = cloneObj(oNextWord);
            }
            if (r == numRows - 1) {
                console.log("setting window.mustReload_lookupWordBySlug = false")
                window.mustReload_lookupWordBySlug = false;
            }
            console.log("updateNodeLookup4 from MiscFunctions; success: r="+r)
        }

        return "foo_"+numRows;
    })
    jQuery("#neuroCore2subjectContainer").html(conceptGraphTableName)
    // alert("done with updateNodeLookup")

    return result;
}

// aTopLevelProperties = [ "wordData", "templateData", "_REMAINDER_", "globalDynamicData", "metaData" ]
export const reorderTopLevelProperties = (oWordIn,aTopLevelProperties) => {
    console.log("reorderTopLevelProperties; oWordIn: "+JSON.stringify(oWordIn,null,4))
    var oWord = cloneObj(oWordIn);
    // oWord.randomThingData = {"a":"b"};
    var oWordOut = {};
    var numTopLevelProperties = aTopLevelProperties.length;
    var oProps = {};
    for (var p=0;p<numTopLevelProperties;p++) {
        var nextKey = aTopLevelProperties[p];
        // console.log("step 1; p="+p+"; nextKey="+nextKey)
        if (nextKey != "_REMAINDER_") {
            if (oWordIn.hasOwnProperty(nextKey)) {
                oProps[nextKey] = cloneObj(oWordIn[nextKey]);
            } else {
                oProps[nextKey] = null;
            }
            delete oWord[nextKey];
        }
    }
    for (var p=0;p<numTopLevelProperties;p++) {
        var nextKey = aTopLevelProperties[p];
        // console.log("step 2; p="+p+"; nextKey="+nextKey)
        if (nextKey == "_REMAINDER_") {
            // merge everything left in oWord into oWordOut
            oWordOut = jQuery.extend({},oWordOut,oWord);
        } else {
            oWordOut[nextKey] = oWordIn[nextKey];
        }
    }

    console.log("reorderTopLevelProperties; oWordOut: "+JSON.stringify(oWordOut,null,4))

    return oWordOut;
}

// This function takes two words as inputs, merges them, and will make sure the keys are ordered properly
// For now (May 2022), it will simply make sure wordData is at the beginning and globalDynamicData, metaData are at the end
// Later, more keys will be accomodated for proper ordering.
export const extendWithOrdering = (oWord1,oWord2) => {
    var obj = {};
    var oWordOutput = {};

    jQuery.extend(obj,oWord1,oWord2);

    var oWordData = {};
    var oGlobalDynamicData = {};
    var oMetaData = {};

    oWordData.wordData = obj.wordData;
    oGlobalDynamicData.globalDynamicData = obj.globalDynamicData;
    oMetaData.metaData = obj.metaData;

    delete obj.wordData;
    delete obj.globalDynamicData;
    delete obj.metaData;

    jQuery.extend(oWordOutput,oWordData,obj,oGlobalDynamicData,oMetaData);

    return oWordOutput;
}
// poplate window.lookupWordBySlug -- this is NOT for use by NeuroCore!!!
// call ths wnever the active conceptGraph changes (which is the one at the bottom left of the masthead)
export const updateNodeLookup = async (conceptGraphTableName) => {
    var sql = " SELECT * from "+conceptGraphTableName;
    console.log("updateNodeLookup from miscFunctions; sql: "+sql)

    var output = await sendAsync(sql).then( async (result) => {
        var aResult = result;
        var numRows = aResult.length;
        console.log("updateNodeLookup from miscFunctions; numRows: "+numRows)
        window.lookupWordBySlug = {};
        for (var r=0;r<numRows;r++) {
            var oNextWord = aResult[r];
            var nextWord_id = oNextWord.id;
            var nextWord_slug = oNextWord.slug;
            var nextWord_rawFile = oNextWord.rawFile;
            var nextWord_deleted = oNextWord.deleted;
            var oNextWord_rawFile = JSON.parse(nextWord_rawFile);

            if (nextWord_deleted == 1) {
            } else {
                window.lookupWordBySlug[nextWord_slug] = oNextWord_rawFile;
            }
            console.log("updateNodeLookup from miscFunctions; success: r="+r)
        }
        return "moreFoo_"+numRows;
    })
    return output;
}
export const updateNodeLookup2 = async (foo, conceptGraphTableName) => {
    var sql = " SELECT * from "+conceptGraphTableName;
    console.log("updateNodeLookup from miscFunctions; sql: "+sql)

    var output = foo + await sendAsync(sql).then( async (result) => {
        var aResult = result;
        var numRows = aResult.length;
        console.log("updateNodeLookup from miscFunctions; numRows: "+numRows)
        window.lookupWordBySlug = {};
        for (var r=0;r<numRows;r++) {
            var oNextWord = aResult[r];
            var nextWord_id = oNextWord.id;
            var nextWord_slug = oNextWord.slug;
            var nextWord_rawFile = oNextWord.rawFile;
            var nextWord_deleted = oNextWord.deleted;
            var oNextWord_rawFile = JSON.parse(nextWord_rawFile);

            if (nextWord_deleted == 1) {
            } else {
                window.lookupWordBySlug[nextWord_slug] = oNextWord_rawFile;
            }
            console.log("updateNodeLookup from miscFunctions; success: r="+r)
        }
        return "moreFoo_"+numRows;
    })
    return output;
}

export const updateWordTypesLookup = async () => {
    var sql = " SELECT * from wordTypes ";
    console.log("sql: "+sql)

    sendAsync(sql).then( async (result) => {
        var aResult = result;
        var numRows = aResult.length;
        console.log("numRows: "+numRows)
        for (var r=0;r<numRows;r++) {
            var oNextWord = aResult[r];
            var nextWord_id = oNextWord.id;
            var nextWord_slug = oNextWord.slug;
            var nextWord_template = oNextWord.template;
            var oNextWord_template = JSON.parse(nextWord_template);
            window.lookupWordTypeTemplate[nextWord_slug] = oNextWord_template;
        }
    })
}

export const updateVisjsStyle = async () => {
    window.visjs = {};
    window.visjs.groupOptions = {};
    window.visjs.edgeOptions = {};

    var sql = " SELECT * from wordTypes ";
    console.log("sql: "+sql)
    var fooResult = await sendAsync(sql).then( async (result) => {
        var aResult = result;
        var numRows = aResult.length;
        console.log("numRows: "+numRows)
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
        var fooRes = await timeout(10);
        return fooRes;
    })

    setTimeout( async function(){
        // "addPropertyKey":{"polarity":"","color":"blue","width":"2","dashes":false},
        var sql = " SELECT * from relationshipTypes ";
        console.log("sql: "+sql)
        sendAsync(sql).then( async (result) => {
            var aResult = result;
            var numRows = aResult.length;
            console.log("numRows: "+numRows)
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
        })
    },1000);
    return fooResult;
}

export const makeConceptGraphTable = async (newTableName) => {
    console.log("makeConceptGraphTable; newTableName: "+newTableName)
    var conceptGraph_tableDefinition = "id INTEGER PRIMARY KEY , slug TEXT NULL , keyname TEXT NULL , ipns TEXT NULL , ipfs TEXT NULL , wordTypes TEXT NULL , title_rS TEXT NULL , table_rS TEXT NULL , comments_rS TEXT NULL , rawFile TEXT NULL , lastUpdate_local INTEGER NULL , referenceDictionary TEXT NULL , keyname_reference TEXT NULL , slug_reference TEXT NULL , ipns_reference TEXT NULL , lastUpdate_reference INTEGER NULL , globalDynamicData_keywords TEXT 'globalDynamicData' , whenCreated INTEGER NULL , deleted INTEGER NULL , UNIQUE(slug) , UNIQUE(keyname) , UNIQUE(ipns) ";
    var sql = "CREATE TABLE IF NOT EXISTS "+newTableName+" ("+conceptGraph_tableDefinition+");";
    console.log("sql: "+sql)
    sendAsync(sql).then((result) => {});
}

export const updateMastheadBar = () => {
    var conceptGraphTitle = returnConceptGraphInfo("title");
    jQuery("#conceptGraphTitleContainer_masthead").html(conceptGraphTitle)

    var conceptInfo = returnConceptInfo("name");
    jQuery("#conceptFieldContainer_masthead").html(conceptInfo)

    console.log("updateMastheadBar; conceptGraphTitle: "+conceptGraphTitle+"; conceptInfo: "+conceptInfo)
}

// input field: title, tableName, mainSchema_slug, slug, id
export const returnConceptGraphData = (field) => {
    var output = "";
    var currSqlID = window.currentConceptGraphSqlID;
    var thisField = currSqlID;
    try {
        thisField = window.aLookupConceptGraphInfoBySqlID[currSqlID][field];
    }
    catch(err) {
    }
    output += thisField;
    return output;
}

// input field: title, tableName, mainSchema_slug, slug, id
export const returnConceptGraphInfo = (field) => {
    var output = "";
    var currSqlID = window.currentConceptGraphSqlID;
    if (field=="title") {
        output += "<div style=display:inline-block;color:grey; >Concept Graph Title: </div>";
    }
    var thisField = currSqlID;
    try {
        thisField = window.aLookupConceptGraphInfoBySqlID[currSqlID][field];
    }
    catch(err) {
    }
    output += "<div style=display:inline-block;color:black; >";
    output += thisField;
    output += "</div>";
    return output;
}

// input field: title, name, slug, id
export const returnConceptInfo = (field) => {
    var output = "";
    var currSqlID = window.currentConceptSqlID;
    if (field=="slug") {
        output += "<div style=display:inline-block;color:grey; >Concept Slug: </div>";
    }
    if (field=="name") {
        output += "<div style=display:inline-block;color:grey; >Concept Name: </div>";
    }
    var thisField = currSqlID;
    var proceed = true;
    try {
        thisField = window.aLookupConceptInfoBySqlID[currSqlID][field];
    }
    catch(err) {
        proceed = false;
    }
    output += "<div style=display:inline-block;color:black; >";
    output += thisField;
    output += "</div>";
    if (!proceed) { output = ""; }
    return output;
}

export const printObjToConsole = (obj) => {
    console.log("printObjToConsole: "+JSON.stringify(obj,null,4))
}
// outputs boolean to indicate whether the slug is the indicated wordType
// output null if error
export const doesWordTypeMatch = (slug,wordType,oRawFileLookup) => {
    var answer = false;
    // console.log("doesWordTypeMatch")
    try {
        // console.log("slug: "+slug)
        var oWord = oRawFileLookup[slug]
        // console.log("slug: "+slug+"; oWord: "+JSON.stringify(oWord,null,4))
        var aWordTypes = oWord.wordData.wordTypes;
        if (jQuery.inArray(wordType,aWordTypes) > -1) {
            answer = true;
        }
        if (wordType=="ANY") {
            answer = true;
        }
    } catch(e) {
        console.log("ERROR in MiscFunctions, doesWordTypeMatch")
    }
    return answer;
}

export const cloneObj = (obj_in) => {
    /*
    // should check if valid obj, not if valid string !!
    if (isValidJSONString(obj_in)) {
        var obj_out = JSON.parse(JSON.stringify(obj_in));
    } else {
        var obj_out = JSON.parse(JSON.stringify(obj_in));
        // var obj_out = obj_in;
    }
    */
    var obj_out = JSON.parse(JSON.stringify(obj_in));
    return obj_out;
}

export const isValidJSONString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        // console.log("isValidJSONString false, str: "+str)
        return false;
    }
    // console.log("isValidJSONString true, str: "+str)
    return true;
}

export const pushObjIfNotAlreadyThere = (aInput,oItem) => {
    var alreadyPresent = false;
    if (typeof oItem == "object") {
        var sItem = JSON.stringify(JSON.parse(JSON.stringify(oItem,null,0)),null,0);
    } else {
        var sItem = oItem;
    }
    var aOutput = JSON.parse(JSON.stringify(aInput));
    var numItems = aOutput.length;
    for (var i=0;i<numItems;i++) {
        var oNextItem = aOutput[i];
        if (typeof oNextItem == "object") {
            var sNextItem = JSON.stringify(JSON.parse(JSON.stringify(oNextItem,null,0)),null,0);
        } else {
            var sNextItem = oNextItem;
        }
        if (sNextItem==sItem) {
            alreadyPresent = true;
        }
    }
    if (!alreadyPresent) {
        aOutput.push(oItem);
    }
    return aOutput;
}

export const pushIfNotAlreadyThere = (item_arr,item_str) => {
    // console.log("pushIfNotAlreadyThere")
    // console.log(item_str)
    // console.log(item_arr)
    var item_new_arr = JSON.parse(JSON.stringify(item_arr));
    if (jQuery.inArray(item_str,item_new_arr) === -1) {
        item_new_arr.push(item_str);
    }
    return item_new_arr;
}

export const pushIfNotAlreadyThere_arrayToArray = (destination_arr,source_arr) => {
    // console.log("pushIfNotAlreadyThere_arrayToArray")
    // console.log("source_arr: "+JSON.stringify(source_arr,null,0))
    // console.log("BEFORE: "+JSON.stringify(destination_arr,null,0))
    var destination_updated_arr = JSON.parse(JSON.stringify(destination_arr));
    var numSourceItems = source_arr.length;
    // console.log("numSourceItems: "+numSourceItems)
    for (var s=0;s<numSourceItems;s++) {
        var nextSourceItem = source_arr[s];
        var iA = jQuery.inArray(nextSourceItem,destination_updated_arr);
        // console.log("nextSourceItem: "+nextSourceItem+"; iA: "+iA)
        if (jQuery.inArray(nextSourceItem,destination_updated_arr) == -1) {
            destination_updated_arr.push(nextSourceItem);
        }
    }
    // console.log("AFTER: "+JSON.stringify(destination_updated_arr,null,0))

    return destination_updated_arr;
}

export const areRelsEqual = (oRel1, oRel2) => {
    var bRelsEq = false;
    var sRel1 = JSON.stringify(oRel1);
    var sRel2 = JSON.stringify(oRel2);
    if (sRel1==sRel2) {
        bRelsEq = true;
    }
    return bRelsEq;
}
// input two arrays of relationships
// iterate through each relationship in aRel2 and add it to aRel1 if not already present
// return updated aRel1
export const concatenateRels = (aRel1, aRel2) => {
    var aRelOut = cloneObj(aRel1);
    var numRel2 = aRel2.length;
    for (var r2=0;r2<numRel2;r2++) {
        var oNextRel2 = aRel2[r2];
        var addRel2 = true;
        var numRelOut = aRelOut.length;
        for (var r1=0;r1<numRelOut;r1++) {
            var oNextRelOut = aRelOut[r1];
            var bRelsEq = areRelsEqual(oNextRel2,oNextRelOut);
            if (bRelsEq) {
                addRel2 = false;
            }
        }
        if (addRel2) {
            aRelOut.push(oNextRel2)
        }
    }
    return aRelOut;
}

export const deleteWordFromAllTables = async (oWord) => {
    var word_str = JSON.stringify(oWord,null,4);
    var word_slug = oWord.wordData.slug;
    var word_ipns = oWord.metaData.ipns;
    var word_keyname = oWord.metaData.keyname;

    var word_myDictionaries_arr = oWord.globalDynamicData.myDictionaries;
    var word_myConceptGraphs_arr = oWord.globalDynamicData.myConceptGraphs;
    var numDictionaries = word_myDictionaries_arr.length;
    var numConceptGraphs = word_myConceptGraphs_arr.length;

    for (var d=0;d<numDictionaries;d++) {
        var nextDictionary = word_myDictionaries_arr[d];

        var updateRowCommands = " UPDATE "+nextDictionary;
        updateRowCommands += " SET ";
        updateRowCommands += " deleted = 1 ";
        updateRowCommands += " WHERE ipns = '"+word_ipns+"' ";
        console.log("deleteWordFromAllTables updateRowCommands: "+updateRowCommands);
        sendAsync(updateRowCommands);
    }

    for (var c=0;c<numConceptGraphs;c++) {
        var nextConceptGraph = word_myConceptGraphs_arr[c];

        var updateRowCommands = "";
        updateRowCommands += "UPDATE "+nextConceptGraph;
        updateRowCommands += " SET deleted = 1 ";
        updateRowCommands += " WHERE slug='"+word_slug+"' ";
        console.log("deleteWordFromAllTables updateRowCommands: "+updateRowCommands)
        sendAsync(updateRowCommands)
    }
}

// note: this function requires metaData.keyname to exist!!
// the new slug (if it has been changed) will be inside oNewWord
// may end up not neding this function; as long as ipns is unchanged and can be used to ID words correctly in all tables, then can use createOrUpdateWordInAllTables

export const updateWordMaybeNewSlugInAllTables = async (sOldSlug,oUpdatedWord) => {
    console.log("updateWordMaybeNewSlugInAllTables; sOldSlug: "+sOldSlug)
    var word_str = JSON.stringify(oUpdatedWord,null,4);
    var word_slug = oUpdatedWord.wordData.slug;
    var word_ipns = oUpdatedWord.metaData.ipns;
    var word_keyname = oUpdatedWord.metaData.keyname;

    var currentTime = Date.now();

    var wordTypes_arr = oUpdatedWord.wordData.wordTypes;
    var numWordTypes = wordTypes_arr.length;
    var wordTypes = "";
    for (var t=0;t<numWordTypes;t++) {
        wordTypes += wordTypes_arr[t];
        if (t+1<numWordTypes) { wordTypes += ","; }
    }

    var word_myDictionaries_arr = oUpdatedWord.globalDynamicData.myDictionaries;
    var word_myConceptGraphs_arr = oUpdatedWord.globalDynamicData.myConceptGraphs;
    var numDictionaries = word_myDictionaries_arr.length;
    var numConceptGraphs = word_myConceptGraphs_arr.length;
    for (var d=0;d<numDictionaries;d++) {
        var nextDictionary = word_myDictionaries_arr[d];

        var updateRowCommands = " UPDATE "+nextDictionary;
        updateRowCommands += " SET ";
        updateRowCommands += " rawFile = '"+word_str+"' ";
        updateRowCommands += " , slug = '"+word_slug+"' ";
        updateRowCommands += " , wordTypes = '"+wordTypes+"' ";
        updateRowCommands += " WHERE ipns = '"+word_ipns+"' ";
        // console.log("updateRowCommands: "+updateRowCommands);
        sendAsync(updateRowCommands);
    }

    var referenceDictionary = word_myDictionaries_arr[0];

    for (var c=0;c<numConceptGraphs;c++) {
        var nextConceptGraph = word_myConceptGraphs_arr[c];

        var updateRowCommands = " UPDATE "+nextConceptGraph;
        updateRowCommands += " SET ";
        updateRowCommands += " rawFile = '"+word_str+"' ";
        updateRowCommands += " , slug = '"+word_slug+"' ";
        updateRowCommands += " , slug_reference = '"+word_slug+"' ";
        updateRowCommands += " , keyname_reference = '"+word_keyname+"' ";
        updateRowCommands += " , wordTypes = '"+wordTypes+"' ";
        updateRowCommands += " , referenceDictionary = '"+referenceDictionary+"' ";
        updateRowCommands += " WHERE ipns_reference = '"+word_ipns+"' ";
        // console.log("insertOrUpdateWordIntoMyConceptGraph updateRowCommands: "+updateRowCommands)
        sendAsync(updateRowCommands);

    }
    // lookupRawFileBySlug_obj.edited[word_slug] = oUpdatedWord;
    window.mustReload_lookupWordBySlug = true;
    jQuery("#numChangesMostRecentCycleContainer").html("-1")
    // jQuery("#loadActiveConceptGraphDataButton").trigger("click")
}


// note: this function requires metaData.keyname to exist!!
export const createOrUpdateWordInAllTables = async (word_obj) => {
    // perhaps check whether word already exists or not so that only one of the two sql commands needs to be run (update vs insert)

    var word_str = JSON.stringify(word_obj,null,4);
    var word_slug = word_obj.wordData.slug;
    // console.log("createOrUpdateWordInAllTables; word_slug: "+word_slug)
    var word_ipns = word_obj.metaData.ipns;
    var word_keyname = word_obj.metaData.keyname;

    var currentTime = Date.now();

    var wordTypes_arr = word_obj.wordData.wordTypes;
    var numWordTypes = wordTypes_arr.length;
    var wordTypes = "";
    for (var t=0;t<numWordTypes;t++) {
        wordTypes += wordTypes_arr[t];
        if (t+1<numWordTypes) { wordTypes += ","; }
    }

    var word_myDictionaries_arr = word_obj.globalDynamicData.myDictionaries;
    var word_myConceptGraphs_arr = word_obj.globalDynamicData.myConceptGraphs;
    var numDictionaries = word_myDictionaries_arr.length;
    var numConceptGraphs = word_myConceptGraphs_arr.length;
    for (var d=0;d<numDictionaries;d++) {
        var nextDictionary = word_myDictionaries_arr[d];

        var insertRowCommands = "";
        insertRowCommands += " INSERT OR IGNORE INTO "+nextDictionary;
        insertRowCommands += " (rawFile,slug,keyname,ipns,wordTypes,whenCreated) ";
        insertRowCommands += " VALUES('"+word_str+"','"+word_slug+"','"+word_keyname+"','"+word_ipns+"','"+wordTypes+"','"+currentTime+"' ) ";
        // console.log("insertRowCommands: "+insertRowCommands);
        await sendAsync(insertRowCommands);

        var updateRowCommands = " UPDATE "+nextDictionary;
        updateRowCommands += " SET ";
        updateRowCommands += " rawFile = '"+word_str+"' ";
        updateRowCommands += " , slug = '"+word_slug+"' ";
        updateRowCommands += " , wordTypes = '"+wordTypes+"' ";
        updateRowCommands += " WHERE ipns = '"+word_ipns+"' ";
        // console.log("updateRowCommands: "+updateRowCommands);
        await sendAsync(updateRowCommands);
    }

    var referenceDictionary = word_myDictionaries_arr[0];

    var restartNeuroCore2 = false;

    for (var c=0;c<numConceptGraphs;c++) {
        var nextConceptGraph = word_myConceptGraphs_arr[c];

        var sql2 = "";
        sql2 += "UPDATE "+nextConceptGraph;
        sql2 += " SET rawFile='"+word_str+"' ";
        sql2 += ", ipns = '"+word_ipns+"' ";
        sql2 += ", ipns_reference = '"+word_ipns+"' ";
        sql2 += " WHERE slug='"+word_slug+"' ";
        sql2 += " AND (deleted IS NULL or deleted == 0) ";
        // console.log("sql2: "+sql2)
        var fooRes1 = await sendAsync(sql2).then( async (result) => {
            var fooR = await timeout(10);
            return fooR;
        });

        var insertRowCommands = " INSERT OR IGNORE INTO "+nextConceptGraph;
        insertRowCommands += " (rawFile,slug,slug_reference,keyname_reference,ipns,ipns_reference,wordTypes,referenceDictionary,whenCreated) ";
        insertRowCommands += " VALUES('"+word_str+"','"+word_slug+"','"+word_slug+"','"+word_keyname+"','"+word_ipns+"','"+word_ipns+"','"+wordTypes+"','"+referenceDictionary+"','"+currentTime+"' ) ";
        // console.log("insertOrUpdateWordIntoMyConceptGraph insertRowCommands: "+insertRowCommands)
        var fooRes2 = await sendAsync(insertRowCommands).then( async (result) => {
            var fooR = await timeout(10);
            return fooR;
        });

        var updateRowCommands = " UPDATE "+nextConceptGraph;
        updateRowCommands += " SET ";
        updateRowCommands += " rawFile = '"+word_str+"' ";
        updateRowCommands += " , slug = '"+word_slug+"' ";
        updateRowCommands += " , slug_reference = '"+word_slug+"' ";
        updateRowCommands += " , keyname_reference = '"+word_keyname+"' ";
        updateRowCommands += " , wordTypes = '"+wordTypes+"' ";
        updateRowCommands += " , referenceDictionary = '"+referenceDictionary+"' ";
        updateRowCommands += " WHERE ipns_reference = '"+word_ipns+"' ";
        // console.log("insertOrUpdateWordIntoMyConceptGraph updateRowCommands: "+updateRowCommands)
        var fooRes3 = await sendAsync(updateRowCommands).then( async (result) => {
            var fooR = await timeout(10);
            return fooR;
        });

        if (nextConceptGraph=="myConceptGraph_plex") {
            restartNeuroCore2 = true;
        }

    }

    var repeatLoop = jQuery("#repeatLoopOverPatternListSelector option:selected").val();
    if (restartNeuroCore2) {
        if (repeatLoop=="managed") {
            var currNeuroCore2Status = jQuery("#NC2StatusIndicator").data("currentstatus")
            if (currNeuroCore2Status=="off") {
                var set_slug = "patterns_byPurpose_LokiPathwayMaintenance";
                NeuroCore2.selectAllPatterns(set_slug)
                // alert("restarting NeuroCore2")
                await NeuroCore2.loadNeuroCore2ConceptGraph_b();
                NeuroCore2.populateActivePatterns();
                NeuroCore2.startNeuroCore2(0);
            }
        }
    }
    jQuery("#numChangesMostRecentCycleContainer").html("-1")

    // 29 July 2022
    // MAY WANT TO CHANGE HOW THIS WORKS
    // Rationale for use: this function (createOrUpdateWordInAllTables) may be triggered either above or below the masthead
    // i.e. either by neuroCore2 above the masthead or normal CG below the masthead)
    // Reagardless of which one does it, if currentConceptGraphSqlID is the same for neuroCore2 and for below the masthead,
    // then will want to update in javascript object in both places.
    // For now, this will reduce or eliminate the need to refresh both javascript objects which currently requires navigating to editExistingConceptGraphPage
    if (window.neuroCore.subject.currentConceptGraphSqlID==window.currentConceptGraphSqlID) {
        window.lookupWordBySlug[word_slug] = word_obj;
        window.neuroCore.subject.oRFL.current[word_slug] = word_obj;
    }

    // lookupRawFileBySlug_obj.edited[word_slug] = word_obj;
    // window.mustReload_lookupWordBySlug = true;

    // jQuery("#loadActiveConceptGraphDataButton").trigger("click")

    var fooResult = fooRes1 + fooRes2 + fooRes3 + await timeout(100);
    return fooResult;
}

export const createNewWordFromSchemas = async (aParentTemplates) => {
    // use ajv6 validator to generate skeleton template using parentJSONSchemas
}

export const createNewWordByTemplate = async (newWordType) => {
    // console.log("createNewWordByTemplate; newWordType: "+newWordType)
    // var oFoo = window.lookupWordTypeTemplate[newWordType];
    // console.log("createNewWordByTemplate; oFoo: "+JSON.stringify(oFoo,null,4))
    var newWord_obj = cloneObj(window.lookupWordTypeTemplate[newWordType]);

    var myConceptGraph = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName;
    newWord_obj.globalDynamicData.myConceptGraphs.push(myConceptGraph);

    var randomNonce = Math.floor(Math.random() * 1000);
    var currentTime = Date.now();
    var newKeyname = "plexWord_"+newWordType+"_"+currentTime+"_"+randomNonce;
    var generatedKey_obj = await MiscIpfsFunctions.ipfs.key.gen(newKeyname, {
        type: 'rsa',
        size: 2048
    })

    var newWord_ipns = generatedKey_obj["id"];
    var generatedKey_name = generatedKey_obj["name"];
    // console.log("generatedKey_obj id: "+newWord_ipns+"; name: "+generatedKey_name);
    newWord_obj.metaData.ipns = newWord_ipns;
    newWord_obj.metaData.keyname = newKeyname;

    var newWord_slug = newWordType+"_"+newWord_ipns.slice(newWord_ipns.length-6);
    newWord_obj.wordData.slug = newWord_slug;

    await timeout(200);

    return newWord_obj;
}

export const isRelObjInArrayOfObj = (rel_obj,rels_arr) => {
    var nodeFrom_slug = rel_obj["nodeFrom"]["slug"];
    var relType_slug = rel_obj["relationshipType"]["slug"];
    var nodeTo_slug = rel_obj["nodeTo"]["slug"];
    var numRels = rels_arr.length;
    var thisIsAMatch = false;
    for (var y=0;y<numRels;y++) {
        var nextNodeFrom_slug = rels_arr[y]["nodeFrom"]["slug"];
        var nextRelType_slug = rels_arr[y]["relationshipType"]["slug"];
        var nextNodeTo_slug = rels_arr[y]["nodeTo"]["slug"];

        if ( (nodeFrom_slug===nextNodeFrom_slug) && (relType_slug===nextRelType_slug) && (nodeTo_slug===nextNodeTo_slug) ) {
            thisIsAMatch = true;
        }
    }
    // console.log("nodeFrom_slug: "+nodeFrom_slug)
    // console.log("isRelObjInArrayOfObj rel_obj: "+JSON.stringify(rel_obj,null,4)+"; thisIsAMatch: "+thisIsAMatch)
    return thisIsAMatch;
}

export const isWordObjInArrayOfObj = (word_obj,words_arr) => {
    var word_slug = word_obj["slug"];
    var word_ipns = word_obj["ipns"];
    // console.log("isWordObjInArrayOfObj; word_slug: "+word_slug+"; word_ipns: "+word_ipns)
    var numWords = words_arr.length;
    var thisIsAMatch = false;
    for (var y=0;y<numWords;y++) {
        var nextWord_slug = words_arr[y]["slug"];
        var nextWord_ipns = words_arr[y]["ipns"];
        if ( (word_slug===nextWord_slug) && (word_ipns===nextWord_ipns) ) {
            thisIsAMatch = true;
        }
    }
    return thisIsAMatch;
}

export const updateSchemaWithNewRel = (schema_in_obj,rel_obj,lookupRawFileBySlug_x_obj) => {
    // console.log("updateSchemaWithNewRel; schema_in_obj: "+JSON.stringify(schema_in_obj,null,4))
    var schema_out_obj = JSON.parse(JSON.stringify(schema_in_obj));
    var schema_out_slug = schema_out_obj.wordData.slug;

    var nF_slug = rel_obj.nodeFrom.slug;
    var nT_slug = rel_obj.nodeTo.slug;
    var rT_slug = rel_obj.relationshipType.slug;

    var addRelError = false;

    var nF_obj = {};
    var nF_rF_obj = lookupRawFileBySlug_x_obj[nF_slug];
    var nF_rF_str = JSON.stringify(nF_rF_obj,null,4);

    if (nF_rF_obj) {
        var nF_ipns = nF_rF_obj.metaData.ipns;
        nF_obj.slug = nF_slug;
        nF_obj.ipns = nF_ipns;
    } else {
        addRelError = true;
        console.log("addRelError! nF_rF_str: "+nF_rF_str)
    }

    var nT_obj = {};
    var nT_rF_obj = lookupRawFileBySlug_x_obj[nT_slug];
    var nT_rF_str = JSON.stringify(nT_rF_obj,null,4);

    if (nT_rF_obj) {
        var nT_ipns = nT_rF_obj.metaData.ipns;
        nT_obj.slug = nT_slug;
        nT_obj.ipns = nT_ipns;
    } else {
        addRelError = true;
        console.log("addRelError! nT_rF_str: "+nT_rF_str)
    }

    if (!addRelError) {
        if (!isRelObjInArrayOfObj(rel_obj,schema_out_obj.schemaData.relationships)) {
            // console.log("updateSchemaWithNewRel; rel is not in schema")
            schema_out_obj.schemaData.relationships.push(rel_obj);
        }
        if (!isWordObjInArrayOfObj(nF_obj,schema_out_obj.schemaData.nodes)) {
            // console.log("updateSchemaWithNewRel; nF_slug: "+nF_slug+" is not yet in schema; nF_ipns: "+nF_ipns)
            schema_out_obj.schemaData.nodes.push(nF_obj);
        }

        if (!isWordObjInArrayOfObj(nT_obj,schema_out_obj.schemaData.nodes)) {
            // console.log("updateSchemaWithNewRel; nT_slug: "+nT_slug+" is not yet in schema; nT_ipns: "+nT_ipns)
            schema_out_obj.schemaData.nodes.push(nT_obj);
        }
    }
    if (addRelError) {
        console.log("updateSchemaWithNewRel; ERROR!! rel_obj: "+JSON.stringify(rel_obj,null,4))
    }
    // lookupRawFileBySlug_x_obj.edited[schema_out_slug] = schema_out_obj;
    // console.log("updateSchemaWithNewRel_; addRelError: "+addRelError+"; nF_slug: "+nF_slug+"; nT_slug: "+nT_slug+"; rT_slug: "+rT_slug)
    // console.log("updateSchemaWithNewRel; schema_out_obj: "+JSON.stringify(schema_out_obj,null,4))
    return schema_out_obj;
}

export const expungeWordFromSchema = (oSchema,wordToExpunge_slug) => {
    var oSchemaOutput = cloneObj(oSchema);
    var aCurrentWords = cloneObj(oSchema.schemaData.nodes);
    var aCurrentRels = cloneObj(oSchema.schemaData.relationships);
    oSchemaOutput.schemaData.nodes = [];
    oSchemaOutput.schemaData.relationships = [];

    for (var w=0;w < aCurrentWords.length; w++ ) {
        var oNextWord = aCurrentWords[w];
        var nextWord_slug = oNextWord.slug;
        if (nextWord_slug != wordToExpunge_slug) {
            oSchemaOutput.schemaData.nodes.push(oNextWord)
        }
    }

    for (var r=0;r < aCurrentRels.length; r++ ) {
        var oNextRel = aCurrentRels[r];
        var nF_slug = oNextRel.nodeFrom.slug;
        var nT_slug = oNextRel.nodeTo.slug;
        if ( (nF_slug != wordToExpunge_slug) && (nT_slug != wordToExpunge_slug) ) {
            oSchemaOutput.schemaData.relationships.push(oNextRel)
        }
    }

    return oSchemaOutput;
}

export const expungeFromSchemaAllRelsOfGivenType = (oSchema,sRelTypeSlug) => {
    var oSchemaOutput = cloneObj(oSchema);
    var aCurrentRels = cloneObj(oSchemaOutput.schemaData.relationships);
    oSchemaOutput.schemaData.relationships = [];
    var numRels = aCurrentRels.length;
    var aNewRelList = [];
    for (var r=0;r<numRels;r++) {
        var oNextRel = aCurrentRels[r];
        var rT = oNextRel.relationshipType.slug;
        if (rT != sRelTypeSlug) {
            aNewRelList.push(oNextRel)
        }
    }
    oSchemaOutput.schemaData.relationships = aNewRelList;
    return oSchemaOutput;
}
