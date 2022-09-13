import sendAsync from '../renderer';
import { lookupRawFileBySlug_obj, templatesByWordType_obj } from '../views/addANewConcept';
import IpfsHttpClient from 'ipfs-http-client';
const jQuery = require("jquery"); 

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

export const outputObjToConsole = (obj) => {
    var str = JSON.stringify(obj,null,4);
    console.log("outputObjToConsole: "+str)
}

export const blankRel_obj = () => {
    var outputRel_obj = {};
    outputRel_obj.nodeFrom = {};
    outputRel_obj.relationshipType = {};
    outputRel_obj.nodeTo = {};

    return outputRel_obj;
}

export const createNewWordByTemplate = async (newWordType) => {
    var newWord_obj = cloneObj(templatesByWordType_obj[newWordType]);

    var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
    var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
    newWord_obj.globalDynamicData.myDictionaries.push(myDictionary);
    newWord_obj.globalDynamicData.myConceptGraphs.push(myConceptGraph);

    var randomNonce = Math.floor(Math.random() * 1000);
    var currentTime = Date.now();
    var newKeyname = "dictionaryWord_"+newWordType+"_"+currentTime+"_"+randomNonce;
    var generatedKey_obj = await ipfs.key.gen(newKeyname, {
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

    return newWord_obj;
}
export const replaceRelWithRel = (inputSchema_rF_obj,oldRel_obj,newRel_obj,lookupRawFileBySlug_obj) => {
    var outputSchema_rF_obj = cloneObj(inputSchema_rF_obj);
    var currentRels_arr = cloneObj(inputSchema_rF_obj.schemaData.relationships)
    outputSchema_rF_obj = removeRelFromSchema(outputSchema_rF_obj,oldRel_obj);
    outputSchema_rF_obj = updateSchemaWithNewRel(outputSchema_rF_obj,newRel_obj,lookupRawFileBySlug_obj)
    return outputSchema_rF_obj;
}
export const fooFunctionB = () => {
    var fooFunctioned = "foo functioned B";
    return fooFunctioned;
}

export const fooFunctionC = () => {
    var fooFunctioned = "foo functioned C";
    return fooFunctioned;
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

export const pushIfNotAlreadyThere = (item_arr,item_str) => {
    var item_new_arr = JSON.parse(JSON.stringify(item_arr));
    if (jQuery.inArray(item_str,item_new_arr) === -1) {
        item_new_arr.push(item_str);
    }
    return item_new_arr;
}

// fetchEnumerationIfExists inputs a word list (dictionary in conceptGraph format)
// enticingRel_obj which MUST be enticingRel_obj.relationshipType.slug == canBeSubdividedInto
// OR enticingRel_obj.relationshipType.slug == "map1ToN"
// (maybe in future, generalize to accept any relationshipType slug, since I mignt be adding more in the future)
// and the number of the setMapping
// and outputs all observed enumerations that correspond to that relationship (slug of each enumeration)
// If none exist, it outputs the empty set
export const fetchEnticedEnumerations = (words_in_obj,enticingRel_obj,whichSetMapping) => {
    var enumerations_arr = [];

    if (enticingRel_obj.relationshipType.slug == "canBeSubdividedInto" ) {
        var enticingSetMapping_obj = enticingRel_obj.relationshipType.canBeSubdividedIntoData.setMappings[whichSetMapping];
    }
    if (enticingRel_obj.relationshipType.slug == "map1ToN" ) {
        var enticingSetMapping_obj = enticingRel_obj.relationshipType.map1ToNData.setMappings[whichSetMapping];
    }
    // var setFrom_slug = enticingSetMapping_obj.setFrom;
    var conceptTo_slug = enticingRel_obj.nodeTo.slug;
    var setTo_slug = enticingSetMapping_obj.setTo;
    for (const [nextWord_slug, nextWord_rF_obj] of Object.entries(words_in_obj)) {
        var nextWord_wordTypes_arr = nextWord_rF_obj.wordData.wordTypes;
        if (jQuery.inArray("enumeration",nextWord_wordTypes_arr) > -1) {
            var enumBaseConcept_slug = nextWord_rF_obj.enumerationData.source.concept;
            var enumBaseSet_slug = nextWord_rF_obj.enumerationData.source.set;
            if ( (enumBaseConcept_slug==conceptTo_slug) && (enumBaseSet_slug==setTo_slug) ) {
                enumerations_arr.push(nextWord_slug)
            }
        }
    }

    return enumerations_arr;
}

// fetchFirstRelIfExists takes in a word list (dictionary in conceptGraph format) and a comparison rel
// and searches for the first rel in any schema in words_obj that matches the inputRel_obj
// The functions compares against nodeFrom_slug, relType_slug, and nodeTo_slug and requires all 3 to match;
// except if any of these fields in inputRel_obj are null or empty, it does not require a match.
// This can bus useful to look for a relationship of (a) -- (relType) -- (b), where either (a) or (b) is not known;
// the function can be used to discover (a) or (b).
// If no matching relationship is found, it returns false.
export const fetchFirstRelIfExists = (words_in_obj,inputRel_obj) => {
    var fetchedRel_obj = false;
    var inputRel_nodeFrom_slug = inputRel_obj.nodeFrom.slug;
    var inputRel_relType_slug = inputRel_obj.relationshipType.slug;
    var inputRel_nodeTo_slug = inputRel_obj.nodeTo.slug;

    for (const [nextWord_slug, nextWord_rF_obj] of Object.entries(words_in_obj)) {
        var nextWord_wordTypes_arr = nextWord_rF_obj.wordData.wordTypes;
        if (jQuery.inArray("schema",nextWord_wordTypes_arr) > -1) {
            var nextWord_rels_arr = nextWord_rF_obj.schemaData.relationships;
            var numRels = nextWord_rels_arr.length;
            for (var r=0;r<numRels;r++) {
                var nextRel_obj = nextWord_rels_arr[r];
                var nextRel_str = JSON.stringify(nextRel_obj,null,4);
                var nextRel_nF_slug = nextRel_obj.nodeFrom.slug;
                var nextRel_nT_slug = nextRel_obj.nodeTo.slug;
                var nextRel_rT_slug = nextRel_obj.relationshipType.slug;

                var matchFound = true;
                // compare nodeFrom
                if (inputRel_nodeFrom_slug) {
                    if (nextRel_nF_slug != inputRel_nodeFrom_slug) {
                        matchFound = false;
                    }
                }

                // compare relType
                if (inputRel_relType_slug) {
                    if (nextRel_rT_slug != inputRel_relType_slug) {
                        matchFound = false;
                    }
                }

                // compare nodeTo
                if (inputRel_nodeTo_slug) {
                    if (nextRel_nT_slug != inputRel_nodeTo_slug) {
                        matchFound = false;
                    }
                }

                if (matchFound) {
                    return nextRel_obj
                }
            }
        }
    }

    return fetchedRel_obj;
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
    return thisIsAMatch;
}

export const isWordObjInArrayOfObj = (word_obj,words_arr) => {
    var word_slug = word_obj["slug"];
    var word_ipns = word_obj["ipns"];
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

export const rearrangeKeys = (obj) => {
    var rearranged_obj = {};
    var keys_arr = Object.keys(obj).sort();
    jQuery.each(keys_arr,function(e,nextKey_str){
        rearranged_obj[nextKey_str] = obj[nextKey_str];
    })
    rearranged_obj = obj;
    return rearranged_obj;
}
// this function can make errors (false negative)
// if the objects are equal, if the objects are multilevel
// and if the keys of objects in lower levels are not in the same order
// This could be fixed by rearranging keys to be alphabetical all the way down, not just at the top level
// Also would need to address arrays
export const areObjectsEquivalent = (obj1,obj2) => {
    // first, order obj1 and obj2 so that keys are in alphabetical order
    obj1 = rearrangeKeys(obj1);
    obj2 = rearrangeKeys(obj2);
    var obj1_str = JSON.stringify(obj1);
    var obj2_str = JSON.stringify(obj2);
    if (obj1_str === obj2_str) {
        var result = true;
    } else {
        var result = false;
    }
    return result;
}

export const insertSchemaIntoSchemaImports = (schema_in_obj,schemaToInsert_slug,lookupRawFileBySlug_obj) => {
    var schema_out_obj = JSON.parse(JSON.stringify(schema_in_obj));
    var schemaToInsert_rF_obj = lookupRawFileBySlug_obj[schemaToInsert_slug];
    var schemaToInsert_ipns = schemaToInsert_rF_obj.metaData.ipns;

    var schemaImports_arr = schema_out_obj.schemaData.schemaImports;
    var numSchemaImports = schemaImports_arr.length;
    var alreadyPresent = false;
    for (var s=0;s<numSchemaImports;s++) {
        var nextSchemaImport_slug = schemaImports_arr[s].slug;
        var nextSchemaImport_ipns = schemaImports_arr[s].ipns;
        if ( (schemaToInsert_slug===nextSchemaImport_slug) && (schemaToInsert_ipns===nextSchemaImport_ipns) ) {
            alreadyPresent = true;
        }
    }
    if (!alreadyPresent) {
        var newSchema_obj = {};
        newSchema_obj.slug = schemaToInsert_slug;
        newSchema_obj.ipns = schemaToInsert_ipns;
        schema_out_obj.schemaData.schemaImports.push(newSchema_obj)
    }
    return schema_out_obj;
}
// adds node and its two nodes into the provided schema if not already there;
// returns the updated schema_obj
export const updateSchemaWithNewNode = (schema_in_obj,node_slug,lookupRawFileBySlug_obj) => {
    console.log("updateSchemaWithNewNode")
    var schema_out_obj = JSON.parse(JSON.stringify(schema_in_obj));
    var schema_out_slug = schema_out_obj.metaData.slug;
    var node_rF_obj = lookupRawFileBySlug_obj.edited[node_slug];
    var node_ipns = node_rF_obj.metaData.ipns;
    var node_obj = {};
    node_obj.slug = node_slug;
    node_obj.ipns = node_ipns;
    if (!isWordObjInArrayOfObj(node_obj,schema_out_obj.schemaData.nodes)) {
        console.log("updateSchemaWithNewRel; node_slug: "+node_slug+" is not yet in schema; node_ipns: "+node_ipns)
        schema_out_obj.schemaData.nodes.push(node_obj);
    }
    lookupRawFileBySlug_obj.edited[schema_out_slug] = JSON.parse(JSON.stringify(schema_out_obj));
    return schema_out_obj;
}
// reformulation of updateSchemaWithNewNode with these changes:
// abililty to add multiple nodes at once, so they must be submitted as an array of objects
// ability to accomodate nodes that have been newly created
// no need to pass lookupRawFileBySlug_obj
export const updateSchemaWithNewNodes = (schema_in_obj,nodes_arr) => {
    console.log("updateSchemaWithNewNodes")
    var schema_out_obj = JSON.parse(JSON.stringify(schema_in_obj));
    return schema_out_obj;
}

// subtracts rel from the provided schema if it is present
// as determined by nodeFrom.slug, relationshipType.slug, and nodeTo.slug
// An exact match (including [relationshipType]Data.fields) is not required --
// If an exact match is required, use removeRelFromSchema_strict
// returns the updated schema_obj
export const removeRelFromSchema = (schema_in_obj,rel_obj) => {
    // console.log("removeRelFromSchema")

    var nF_slug = rel_obj.nodeFrom.slug;
    var nT_slug = rel_obj.nodeTo.slug;
    var rT_slug = rel_obj.relationshipType.slug;

    var schema_out_obj = JSON.parse(JSON.stringify(schema_in_obj));
    var schema_out_slug = schema_out_obj.metaData.slug;

    var schema_in_rels_arr = JSON.parse(JSON.stringify(schema_in_obj.schemaData.relationships));
    var numRels_in = schema_in_rels_arr.length;
    var schema_out_rels_arr = [];

    for (var r=0;r<numRels_in;r++) {
        var nextRel_in_obj = schema_in_rels_arr[r];
        var nF_in_slug = nextRel_in_obj.nodeFrom.slug;
        var nT_in_slug = nextRel_in_obj.nodeTo.slug;
        var rT_in_slug = nextRel_in_obj.relationshipType.slug;

        var relsMatch = false;
        if ( (nF_slug===nF_in_slug) && (nT_slug===nT_in_slug) && (rT_slug===rT_in_slug) ) {
            relsMatch = true;
            console.log("relationship is a match! don't add it back!! Remove it from the schema!!!")
        }
        if (!relsMatch) {
            schema_out_rels_arr.push(nextRel_in_obj)
            // Remove nodeFrom and nodeTo if it is not otherwise in the schema ???
            // This is not yet implemented here.
            // Ought to create a pattern-action to remove stranded nodes from schemas
            // Maybe tag the schema for this procedure.
        }
    }
    schema_out_obj.schemaData.relationships = schema_out_rels_arr;
    return schema_out_obj;
}
export const removeRelFromSchema_strict = (schema_in_obj,rel_obj) => {
    // not yet implemented
    // plan: stringify relationships when making comparisions
}

// adds rel and its two nodes into the provided schema if they're not already there;
// returns the updated schema_obj
export const updateSchemaWithNewRel = (schema_in_obj,rel_obj,lookupRawFileBySlug_x_obj) => {
    // console.log("updateSchemaWithNewRel")
    var schema_out_obj = JSON.parse(JSON.stringify(schema_in_obj));
    var schema_out_slug = schema_out_obj.metaData.slug;

    var nF_slug = rel_obj.nodeFrom.slug;
    var nT_slug = rel_obj.nodeTo.slug;
    var rT_slug = rel_obj.relationshipType.slug;

    var addRelError = false;

    var nF_obj = {};
    var nF_rF_obj = lookupRawFileBySlug_x_obj[nF_slug];
    if (nF_rF_obj) {
        var nF_ipns = nF_rF_obj.metaData.ipns;
        nF_obj.slug = nF_slug;
        nF_obj.ipns = nF_ipns;
    } else {
        addRelError = true;
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
    // lookupRawFileBySlug_x_obj.edited[schema_out_slug] = schema_out_obj;
    console.log("updateSchemaWithNewRel_; addRelError: "+addRelError+"; nF_slug: "+nF_slug+"; nT_slug: "+nT_slug+"; rT_slug: "+rT_slug)
    return schema_out_obj;
}
// reformulation of updateSchemaWithNewNode with these changes:
// abililty to add multiple relationships at once, so they must be submitted as an array of objects
// ability to accomodate nodes that have been newly created
// no need to pass lookupRawFileBySlug_obj
export const updateSchemaWithNewRels = async (schema_in_obj,relsToAdd_arr,lookupRawFileBySlug_obj) => {
    // console.log("updateSchemaWithNewRels")
    var schema_out_obj = JSON.parse(JSON.stringify(schema_in_obj));
    var schema_slug = schema_out_obj.wordData.slug;

    var numRelsToAdd = relsToAdd_arr.length;
    // console.log("numRelsToAdd: "+numRelsToAdd)
    for (var r=0;r<numRelsToAdd;r++) {
        var nextRelToAdd_obj = relsToAdd_arr[r];
        outputObjToConsole(nextRelToAdd_obj);

        if (!isRelObjInArrayOfObj(nextRelToAdd_obj,schema_out_obj.schemaData.relationships)) {
            // console.log("updateSchemaWithNewRel; rel is not in schema")
            schema_out_obj.schemaData.relationships.push(nextRelToAdd_obj);

            var nF_slug = nextRelToAdd_obj.nodeFrom.slug;
            var nT_slug = nextRelToAdd_obj.nodeTo.slug;
            var rT_slug = nextRelToAdd_obj.relationshipType.slug;

            var nF_obj = {};
            var nF_rF_obj = lookupRawFileBySlug_obj[nF_slug];
            var nF_ipns = nF_rF_obj.metaData.ipns;
            nF_obj.slug = nF_slug;
            nF_obj.ipns = nF_ipns;

            var nT_obj = {};
            console.log("nT_slug: "+nT_slug)
            var nT_rF_obj = lookupRawFileBySlug_obj[nT_slug];
            var nT_ipns = nT_rF_obj.metaData.ipns;
            nT_obj.slug = nT_slug;
            nT_obj.ipns = nT_ipns;

            if (!isWordObjInArrayOfObj(nF_obj,schema_out_obj.schemaData.nodes)) {
                schema_out_obj.schemaData.nodes.push(nF_obj);
            }

            if (!isWordObjInArrayOfObj(nT_obj,schema_out_obj.schemaData.nodes)) {
                schema_out_obj.schemaData.nodes.push(nT_obj);
            }
        }
    }
    lookupRawFileBySlug_obj[schema_slug] = schema_out_obj
    var output_obj = {}
    output_obj.schema_obj = schema_out_obj;
    output_obj.lookupRawFileBySlug_obj = lookupRawFileBySlug_obj;

    // updateWordInAllTables(schema_out_obj);
    return output_obj;
}

export const updateWordInAllTables = (word_obj) => {
    var word_str = JSON.stringify(word_obj,null,4);
    var word_slug = word_obj.wordData.slug;
    var word_ipns = word_obj.metaData.ipns;
    var word_myDictionaries_arr = word_obj.globalDynamicData.myDictionaries;
    var word_myConceptGraphs_arr = word_obj.globalDynamicData.myConceptGraphs;
    var numDictionaries = word_myDictionaries_arr.length;
    var numConceptGraphs = word_myConceptGraphs_arr.length;
    for (var d=0;d<numDictionaries;d++) {
        var nextDictionary = word_myDictionaries_arr[d];

        var sql1 = "";
        sql1 += "UPDATE "+nextDictionary;
        sql1 += " SET rawFile='"+word_str+"' ";
        sql1 += " WHERE ipns='"+word_ipns+"' ";
        // console.log("sql1: "+sql1)
        sendAsync(sql1)
    }
    for (var c=0;c<numConceptGraphs;c++) {
        var nextConceptGraph = word_myConceptGraphs_arr[c];
        var sql2 = "";
        sql2 += "UPDATE "+nextConceptGraph;
        sql2 += " SET rawFile='"+word_str+"' ";
        sql2 += " , ipns='"+word_ipns+"' ";
        sql2 += " WHERE slug='"+word_slug+"' ";
        // console.log("sql2: "+sql2)
        sendAsync(sql2)
    }
    lookupRawFileBySlug_obj.edited[word_slug] = word_obj;
}

// note: this function requires metaData.keyname to exist!!
export const createOrUpdateWordInAllTables = (word_obj) => {
    var word_str = JSON.stringify(word_obj,null,4);
    var word_slug = word_obj.wordData.slug;
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
        sendAsync(insertRowCommands);

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

        var sql2 = "";
        sql2 += "UPDATE "+nextConceptGraph;
        sql2 += " SET rawFile='"+word_str+"' ";
        sql2 += " WHERE slug='"+word_slug+"' ";
        // console.log("sql2: "+sql2)
        sendAsync(sql2)

        var insertRowCommands = " INSERT OR IGNORE INTO "+nextConceptGraph;
        insertRowCommands += " (rawFile,slug,slug_reference,keyname_reference,ipns,ipns_reference,wordTypes,referenceDictionary,whenCreated) ";
        insertRowCommands += " VALUES('"+word_str+"','"+word_slug+"','"+word_slug+"','"+word_keyname+"','"+word_ipns+"','"+word_ipns+"','"+wordTypes+"','"+referenceDictionary+"','"+currentTime+"' ) ";
        // console.log("insertOrUpdateWordIntoMyConceptGraph insertRowCommands: "+insertRowCommands)
        sendAsync(insertRowCommands);

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
    // lookupRawFileBySlug_obj.edited[word_slug] = word_obj;
}
