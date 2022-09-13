import React from "react";
import IpfsHttpClient from 'ipfs-http-client';
import sendAsync from '../../renderer';
import { lookupRawFileBySlug_obj, templatesByWordType_obj, insertOrUpdateWordIntoMyConceptGraphAndMyDictionary, insertOrUpdateWordIntoMyDictionary, insertOrUpdateWordIntoMyConceptGraph } from '../addANewConcept';
import * as MiscFunctions from '../../lib/miscFunctions.js';
import * as VisjsFunctions from '../../lib/visjs/visjs-functions.js';
import * as VisjsBepmFunctions from '../../lib/visjs/visjs-functions-bepm.js';
import * as PropertyFormationFunctions from './propertyFormationFunctionsUsingRelationships.js';
import { highlightedNode_slug } from '../../lib/visjs/visjs-functions.js';
const jQuery = require("jquery");

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

async function createSelectors() {
    var currentConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected ").data("tablename");

    var sql = "";
    sql += " SELECT * FROM "+currentConceptGraph_tableName;
    sendAsync(sql).then((words_arr) => {
        var selectorHTML1 = "";
        selectorHTML1 += "select concept: ";
        selectorHTML1 += "<select id=conceptSelector_createPropertyModule >";

        var selectorHTML2 = "";
        selectorHTML2 += "select enumeration: ";
        selectorHTML2 += "<select id=enumerationSelector_createPropertyModule >";

        var selectorHTML3 = "";
        selectorHTML3 += "<select id=nodeSelector_bepm >";

        var numWords = words_arr.length;
        for (var w=0;w<numWords;w++) {
            var nextWord_str = words_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_wordTypes = nextWord_obj.wordData.wordTypes;
            var nextWord_ipns = nextWord_obj.metaData.ipns;

            if (jQuery.inArray("concept",nextWord_wordTypes) > -1) {
                var nextConcept_rF_str = nextWord_str;
                var nextConcept_rF_obj = nextWord_obj;
                var nextConcept_concept_slug = nextConcept_rF_obj.conceptData.nodes.concept.slug;
                var nextConcept_wordType_slug = nextConcept_rF_obj.conceptData.nodes.wordType.slug;
                var nextConcept_schema_slug = nextConcept_rF_obj.conceptData.nodes.schema.slug;
                var nextConcept_JSONSchema_slug = nextConcept_rF_obj.conceptData.nodes.JSONSchema.slug;
                var nextConcept_primaryProperty_slug = nextConcept_rF_obj.conceptData.nodes.primaryProperty.slug;
                var nextConcept_properties_slug = nextConcept_rF_obj.conceptData.nodes.properties.slug;
                var nextConcept_propertySchema_slug = nextConcept_rF_obj.conceptData.nodes.propertySchema.slug;
                var nextConcept_superset_slug = nextConcept_rF_obj.conceptData.nodes.superset.slug;

                selectorHTML1 += "<option ";
                selectorHTML1 += " data-conceptslug='"+nextConcept_concept_slug+"' ";
                selectorHTML1 += " data-wordtypeslug='"+nextConcept_wordType_slug+"' ";
                selectorHTML1 += " data-schemaslug='"+nextConcept_schema_slug+"' ";
                selectorHTML1 += " data-jsonschemaslug='"+nextConcept_JSONSchema_slug+"' ";
                selectorHTML1 += " data-primarypropertyslug='"+nextConcept_primaryProperty_slug+"' ";
                selectorHTML1 += " data-propertiesslug='"+nextConcept_properties_slug+"' ";
                selectorHTML1 += " data-propertyschemaslug='"+nextConcept_propertySchema_slug+"' ";
                selectorHTML1 += " data-supersetslug='"+nextConcept_superset_slug+"' ";
                selectorHTML1 += " >";
                selectorHTML1 += nextConcept_wordType_slug;
                selectorHTML1 += "</option>";
            }

            if (jQuery.inArray("enumeration",nextWord_wordTypes) > -1) {
                var nextEnumeration_rF_str = nextWord_str;
                var nextEnumeration_rF_obj = nextWord_obj;

                selectorHTML2 += "<option data-enumerationslug='"+nextWord_slug+"' >";
                selectorHTML2 += nextWord_slug;
                selectorHTML2 += "</option>";
            }

            selectorHTML3 += "<option ";
            selectorHTML3 += " data-slug='"+nextWord_slug+"' ";
            selectorHTML3 += " >";
            selectorHTML3 += nextWord_slug;
            selectorHTML3 += "</option>";
        }

        selectorHTML1 += "</select>";
        jQuery("#selectConceptContainer").html(selectorHTML1)

        selectorHTML2 += "</select>";
        jQuery("#selectEnumerationContainer").html(selectorHTML2)

        selectorHTML3 += "</select>";
        jQuery("#nodeSelectorContainer_bepm").html(selectorHTML3)

        updateNewPropertyModuleDisplay();
    });
}
function createNewPropertyModule() {
    var mainConceptSlug = jQuery("#conceptSelector_createPropertyModule option:selected").data("conceptslug");
    var mainEnumerationSlug = jQuery("#enumerationSelector_createPropertyModule option:selected").data("enumerationslug");
    var newPropModKey = jQuery("#newPropertyModuleKey").val();
    console.log("createNewPropertyModule; mainConceptSlug: "+mainConceptSlug+"; mainEnumerationSlug: "+mainEnumerationSlug+"; newPropModKey: "+newPropModKey);

    var mainConcept_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[mainConceptSlug]));
    if (!mainConcept_rF_obj.conceptData.hasOwnProperty("propertyModuleData")) {
        mainConcept_rF_obj.conceptData.propertyModuleData = {};
    }
    mainConcept_rF_obj.conceptData.propertyModuleData[newPropModKey] = {};
    mainConcept_rF_obj.conceptData.propertyModuleData[newPropModKey].key = newPropModKey;
    mainConcept_rF_obj.conceptData.propertyModuleData[newPropModKey].enumeration = {};
    mainConcept_rF_obj.conceptData.propertyModuleData[newPropModKey].enumeration.slug = mainEnumerationSlug;
    var mainConcept_rF_str = JSON.stringify(mainConcept_rF_obj,null,4);
    console.log("mainConcept_rF_str: "+mainConcept_rF_str);
    MiscFunctions.updateWordInAllTables(mainConcept_rF_obj)
}

async function recreatePropertyModule(propModuleKey) {
    console.log("recreatePropertyModule; propModuleKey: "+propModuleKey);
    var mainConceptSlug = jQuery("#conceptSelector_createPropertyModule option:selected").data("conceptslug");
    var mainConcept_rF_obj = JSON.parse(JSON.stringify(await lookupRawFileBySlug_obj.edited[mainConceptSlug]));
    var mainConcept_propertyPath_slug = mainConcept_rF_obj.conceptData.propertyPath;
    var mainConcept_superset_slug = mainConcept_rF_obj.conceptData.nodes.superset.slug;
    var mainConcept_schema_slug = mainConcept_rF_obj.conceptData.nodes.schema.slug;
    var mainConcept_JSONSchema_slug = mainConcept_rF_obj.conceptData.nodes.JSONSchema.slug;
    var mainConcept_propertySchema_slug = mainConcept_rF_obj.conceptData.nodes.propertySchema.slug;
    var mainConcept_primaryProperty_slug = mainConcept_rF_obj.conceptData.nodes.primaryProperty.slug;

    var mainConcept_schema_rF_obj = JSON.parse(JSON.stringify(await lookupRawFileBySlug_obj.edited[mainConcept_schema_slug]));
    var mainConcept_propertySchema_rF_obj = JSON.parse(JSON.stringify(await lookupRawFileBySlug_obj.edited[mainConcept_propertySchema_slug]));

    var propMod_obj = {};
    if (mainConcept_rF_obj.conceptData.hasOwnProperty("propertyModuleData")) {
        if (mainConcept_rF_obj.conceptData.propertyModuleData.hasOwnProperty(propModuleKey)) {
            propMod_obj = mainConcept_rF_obj.conceptData.propertyModuleData[propModuleKey];
        }
    }
    var propMod_str = JSON.stringify(propMod_obj,null,4);
    console.log("propMod_str: "+propMod_str)

    var enumerationSlug = propMod_obj.enumeration.slug;
    var enumeration_rF_obj = JSON.parse(JSON.stringify(await lookupRawFileBySlug_obj.edited[enumerationSlug]));
    var enumeration_rF_str = JSON.stringify(enumeration_rF_obj,null,4)
    console.log("enumeration_rF_str: "+enumeration_rF_str)
    var enumSourceConcept_slug = enumeration_rF_obj.enumerationData.source.concept;
    var enumSourceSet_slug = enumeration_rF_obj.enumerationData.source.set;

    if (!propMod_obj.hasOwnProperty("property")) {
        propMod_obj.property = {};
    }
    if (!propMod_obj.hasOwnProperty("set")) {
        propMod_obj.set = {};
    }
    if (!propMod_obj.hasOwnProperty("elements")) {
        propMod_obj.elements = {};
    }

    ///////////////////////////////////////////////////////
    // make property of subtype: propertyModule if doesn't already exist
    var newPropertySlug = "property_module_"+propModuleKey;
    var newPropertyTitle = "Property Module for "+propModuleKey;
    var newPropertyName = "property module for "+propModuleKey;
    if (propMod_obj.property.hasOwnProperty("slug")) {
        newPropertySlug = propMod_obj.property.slug;
    }
    // check to see if property already exists
    // if not, make the new word for the property
    if (lookupRawFileBySlug_obj.hasOwnProperty(newPropertySlug)) {
        var newProperty_rF_obj = lookupRawFileBySlug_obj.edited[newPropertySlug];
        var newProperty_rF_str = JSON.stringify(newProperty_rF_obj,null,4);
        console.log("newPropertySlug file already exists: "+newPropertySlug+"; newProperty_rF_str: "+newProperty_rF_str);
    }
    if (!lookupRawFileBySlug_obj.hasOwnProperty(newPropertySlug)) {
        var newPropertySlug = "property_module_"+propModuleKey;
        var newPropertyTitle = "Property Module for "+propModuleKey;
        var newPropertyName = "property module for "+propModuleKey;
        var newProperty_rF_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["property"]));
        newProperty_rF_obj.wordData.slug = newPropertySlug;
        var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
        var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
        newProperty_rF_obj.globalDynamicData.myDictionaries.push(myDictionary);
        newProperty_rF_obj.globalDynamicData.myConceptGraphs.push(myConceptGraph);

        var currentTime = Date.now();
        // var randNonce = Math.floor(Math.random() * 1000);
        var newKeyname = "dictionaryWord_"+propModuleKey+"_"+currentTime;
        var generatedKey_obj = await ipfs.key.gen(newKeyname, {
            type: 'rsa',
            size: 2048
        })
        var newProperty_ipns = generatedKey_obj["id"];
        var generatedKey_name = generatedKey_obj["name"];
        // console.log("generatedKey_obj id: "+newProperty_ipns+"; name: "+generatedKey_name);
        newProperty_rF_obj.metaData.ipns = newProperty_ipns;

        newProperty_rF_obj.wordData.slug = newPropertySlug;
        newProperty_rF_obj.wordData.title = newPropertyTitle;
        newProperty_rF_obj.wordData.name = newPropertyName;

        newProperty_rF_obj.propertyData.type = "propertyModule";
        newProperty_rF_obj.propertyData.types.push("propertyModule");

        var newProperty_rF_str = JSON.stringify(newProperty_rF_obj,null,4);
        console.log("newProperty_rF_str: "+newProperty_rF_str);

        // then add slug to propMod_obj
        propMod_obj.property.slug = newPropertySlug;

        insertOrUpdateWordIntoMyConceptGraphAndMyDictionary(newProperty_rF_str,newKeyname,myConceptGraph,myDictionary)
    }
    var blankRel_obj = {};
    blankRel_obj.nodeFrom = {};
    blankRel_obj.relationshipType = {};
    blankRel_obj.nodeTo = {};

    // in mainConcept_propertySchema_slug, add the relationship:
    // newPropertySlug -- addToConceptGraphProperties, field: propModuleKey (??) -- mainConcept_propertyPath_slug
    var relForPropertySchema1_obj = MiscFunctions.cloneObj(blankRel_obj);
    relForPropertySchema1_obj.nodeFrom.slug = newPropertySlug;
    relForPropertySchema1_obj.relationshipType.slug = "addToConceptGraphProperties";
    relForPropertySchema1_obj.relationshipType.addToConceptGraphPropertiesData = {};
    relForPropertySchema1_obj.relationshipType.addToConceptGraphPropertiesData.field = propModuleKey;
    relForPropertySchema1_obj.relationshipType.addToConceptGraphPropertiesData.dependencies = true;
    relForPropertySchema1_obj.nodeTo.slug = mainConcept_primaryProperty_slug;
    var relForPropertySchema1_str = JSON.stringify(relForPropertySchema1_obj,null,4);
    console.log("relForPropertySchema1_str: "+relForPropertySchema1_str);
    var mainConcept_propertySchema_rF_str = JSON.stringify(mainConcept_propertySchema_rF_obj,null,4)
    console.log("mainConcept_propertySchema_rF_str before: "+mainConcept_propertySchema_rF_str);
    // ADD THIS WHEN READY (need to make and add JSON for newPropertySlug first so its ipns exists so I can add it to the schema)
    mainConcept_propertySchema_rF_obj = MiscFunctions.updateSchemaWithNewRel(mainConcept_propertySchema_rF_obj,relForPropertySchema1_obj,lookupRawFileBySlug_obj);
    var mainConcept_propertySchema_rF_str = JSON.stringify(mainConcept_propertySchema_rF_obj,null,4)
    console.log("mainConcept_propertySchema_rF_str after1: "+mainConcept_propertySchema_rF_str);
    // in mainConcept_propertySchema_slug, also add the relationship:
    // enumerationSlug -- addToConceptGraphProperties, field: -- newPropertySlug
    var relForPropertySchema2_obj = MiscFunctions.cloneObj(blankRel_obj);
    relForPropertySchema2_obj.nodeFrom.slug = enumerationSlug;
    relForPropertySchema2_obj.relationshipType.slug = "addToConceptGraphProperties";
    relForPropertySchema2_obj.relationshipType.addToConceptGraphPropertiesData = {};
    // need to figure out what goes here:
    var enumSourceSet_fieldFromTitle = enumeration_rF_obj.enumerationData.JSONSchemaStyle.value.title;
    relForPropertySchema2_obj.relationshipType.addToConceptGraphPropertiesData.field = enumSourceSet_fieldFromTitle;
    relForPropertySchema2_obj.relationshipType.addToConceptGraphPropertiesData.dependencies = true;
    relForPropertySchema2_obj.nodeTo.slug = newPropertySlug;
    var relForPropertySchema2_str = JSON.stringify(relForPropertySchema2_obj,null,4);
    console.log("relForPropertySchema2_str: "+relForPropertySchema2_str);
    // ADD THIS WHEN READY (see above)
    mainConcept_propertySchema_rF_obj = MiscFunctions.updateSchemaWithNewRel(mainConcept_propertySchema_rF_obj,relForPropertySchema2_obj,lookupRawFileBySlug_obj);
    var mainConcept_propertySchema_rF_str = JSON.stringify(mainConcept_propertySchema_rF_obj,null,4)

    console.log("mainConcept_propertySchema_rF_str after2: "+mainConcept_propertySchema_rF_str);

    MiscFunctions.updateWordInAllTables(mainConcept_propertySchema_rF_obj);

    // make set of subtype: propertyModule if doesn't already exist
    // each module has its own set which is a subset of the mainConcept's superset
    // first make slug

    var newSetSlug = mainConcept_superset_slug+"_organizedBy_"+propModuleKey;
    var newSetTitle = mainConcept_superset_slug+" Organized by "+propModuleKey;
    var newSetName = mainConcept_superset_slug+" organized by "+propModuleKey;

    // then add slug to propMod_obj
    // propMod_obj.set = {};
    propMod_obj.set.slug = newSetSlug;

    if (lookupRawFileBySlug_obj.hasOwnProperty(newSetSlug)) {
        var newSet_rF_obj = lookupRawFileBySlug_obj.edited[newSetSlug];
        var newSet_rF_str = JSON.stringify(newSet_rF_obj,null,4);
        console.log("newSetSlug file already exists: "+newSetSlug+"; newSet_rF_str: "+newSet_rF_str);
    }
    if (!lookupRawFileBySlug_obj.hasOwnProperty(newSetSlug)) {
        // then make the new word for the set
        var newSet_rF_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["set"]));
        newSet_rF_obj.wordData.slug = newSetSlug;
        newSet_rF_obj.wordData.title = newSetTitle;
        newSet_rF_obj.wordData.name = newSetName;
        newSet_rF_obj.setData.slug = newSetSlug;
        newSet_rF_obj.setData.title = newSetTitle;
        newSet_rF_obj.setData.name = newSetName;
        newSet_rF_obj.setData.metaData.types.push("propertyModuleSet");
        newSet_rF_obj.setData.metaData.governingConcepts.push(mainConceptSlug);

        var currentTime = Date.now();
        var newSet_keyname = "dictionaryWord_"+newSetSlug+"_"+currentTime;
        var generatedKey_obj = await ipfs.key.gen(newSet_keyname, {
            type: 'rsa',
            size: 2048
        });
        var newSet_ipns = generatedKey_obj["id"];
        var generatedKey_name = generatedKey_obj["name"];
        // console.log("generatedKey_obj id: "+newProperty_ipns+"; name: "+generatedKey_name);
        newSet_rF_obj.metaData.ipns = newSet_ipns;

        var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
        var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
        newSet_rF_obj.globalDynamicData.myDictionaries.push(myDictionary);
        newSet_rF_obj.globalDynamicData.myConceptGraphs.push(myConceptGraph);

        var newSet_rF_str = JSON.stringify(newSet_rF_obj,null,4);
        console.log("newSet_rF_str: "+newSet_rF_str);

        insertOrUpdateWordIntoMyConceptGraphAndMyDictionary(newSet_rF_str,newSet_keyname,myConceptGraph,myDictionary)
    }

    // in the concept's main schema, add the relationship:
    // newSetSlug -- subsetOf -- mainConcept_superset_slug
    var relForMainSchema1_obj = MiscFunctions.cloneObj(blankRel_obj);
    relForMainSchema1_obj.nodeFrom.slug = newSetSlug;
    relForMainSchema1_obj.relationshipType.slug = "subsetOf";
    relForMainSchema1_obj.nodeTo.slug = mainConcept_superset_slug;
    var relForMainSchema1_str = JSON.stringify(relForMainSchema1_obj,null,4);
    console.log("relForMainSchema1_str: "+relForMainSchema1_str)
    // ADD THIS WHEN READY (see above)
    mainConcept_schema_rF_obj = MiscFunctions.updateSchemaWithNewRel(mainConcept_schema_rF_obj,relForMainSchema1_obj,lookupRawFileBySlug_obj);
    var mainConcept_schema_rF_str = JSON.stringify(mainConcept_schema_rF_obj,null,4);
    console.log("mainConcept_schema_rF_str:  "+mainConcept_schema_rF_str);
    MiscFunctions.updateWordInAllTables(mainConcept_schema_rF_obj);

    // next, subsets of newSetSlug must be generated if not already existing; one for each element of enumeration
    var enumSlugs_arr = enumeration_rF_obj.enumerationData.conceptGraphStyle.enum.slugs;
    var numEnumSlugs = enumSlugs_arr.length;
    var subsets_arr = [];
    for (var s=0;s<numEnumSlugs;s++) {
        var nextEnumSlug = enumSlugs_arr[s];
        propMod_obj.elements[nextEnumSlug] = {};
        var newSubsetSlug = mainConcept_superset_slug+"_organizedBy_"+propModuleKey+"_"+nextEnumSlug;
        var newSubsetTitle = mainConcept_superset_slug+" Organized by "+propModuleKey+"_"+nextEnumSlug;
        var newSubsetName = mainConcept_superset_slug+" organized by "+propModuleKey+"_"+nextEnumSlug;
        propMod_obj.elements[nextEnumSlug].slug = nextEnumSlug;
        propMod_obj.elements[nextEnumSlug].subset = newSubsetSlug;

        subsets_arr[s] = newSubsetSlug;

        if (lookupRawFileBySlug_obj.hasOwnProperty(newSubsetSlug)) {
            var newSubset_rF_obj = lookupRawFileBySlug_obj.edited[newSubsetSlug];
            var newSubset_rF_str = JSON.stringify(newSubset_rF_obj,null,4);
            console.log("newSubsetSlug file already exists: "+newSubsetSlug+"; newSubset_rF_str: "+newSubset_rF_str);
        }
        if (!lookupRawFileBySlug_obj.hasOwnProperty(newSubsetSlug)) {
            // then make the new word for the subset
            var newSubset_rF_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["set"]));
            newSubset_rF_obj.wordData.slug = newSubsetSlug;
            newSubset_rF_obj.wordData.title = newSubsetTitle;
            newSubset_rF_obj.wordData.name = newSubsetName;
            newSubset_rF_obj.setData.slug = newSubsetSlug;
            newSubset_rF_obj.setData.title = newSubsetTitle;
            newSubset_rF_obj.setData.name = newSubsetName;
            newSubset_rF_obj.setData.metaData.types.push("propertyModuleSubset");
            newSubset_rF_obj.setData.metaData.governingConcepts.push(mainConceptSlug);

            var currentTime = Date.now();
            var newSubset_keyname = "dictionaryWord_"+newSubsetSlug+"_"+currentTime;
            var generatedKey_obj = await ipfs.key.gen(newSubset_keyname, {
                type: 'rsa',
                size: 2048
            });
            var newSubset_ipns = generatedKey_obj["id"];
            var generatedKey_name = generatedKey_obj["name"];
            // console.log("generatedKey_obj id: "+newProperty_ipns+"; name: "+generatedKey_name);
            newSubset_rF_obj.metaData.ipns = newSubset_ipns;

            var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
            var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
            newSubset_rF_obj.globalDynamicData.myDictionaries.push(myDictionary);
            newSubset_rF_obj.globalDynamicData.myConceptGraphs.push(myConceptGraph);

            var newSubset_rF_str = JSON.stringify(newSubset_rF_obj,null,4);
            console.log("newSubset_rF_str: "+newSubset_rF_str);

            insertOrUpdateWordIntoMyConceptGraphAndMyDictionary(newSubset_rF_str,newSubset_keyname,myConceptGraph,myDictionary);
            lookupRawFileBySlug_obj[newSubsetSlug] = newSubset_rF_obj;
            lookupRawFileBySlug_obj.edited[newSubsetSlug] = newSubset_rF_obj;
        }
        // in the concept's main schema, add the relationship:
        // newSubetSlug -- subsetOf -- newSetSlug
        var relForMainSchema2_obj = MiscFunctions.cloneObj(blankRel_obj);
        relForMainSchema2_obj.nodeFrom.slug = newSubsetSlug;
        relForMainSchema2_obj.relationshipType.slug = "subsetOf";
        relForMainSchema2_obj.nodeTo.slug = newSetSlug;
        var relForMainSchema2_str = JSON.stringify(relForMainSchema2_obj,null,4);
        console.log("relForMainSchema2_str: "+relForMainSchema2_str)

        // ADD THIS WHEN READY (see above)
        mainConcept_schema_rF_obj = MiscFunctions.updateSchemaWithNewRel(mainConcept_schema_rF_obj,relForMainSchema2_obj,lookupRawFileBySlug_obj);

        for (var s=0;s<numEnumSlugs;s++) {
            var nextSubsetSlug = subsets_arr[s];
            // or maybe make singular enumeration, then property, then JSONSchema from scratch, instead of the above cloning step.
            var newJSONSchema_forNextSubset_slug = mainConcept_JSONSchema_slug+"_"+nextSubsetSlug;
            var newPropertyModule_forNextSubset_slug = "";
            var newPrimaryProperty_forNextSubset_slug = "";
            var newEnumeration_forNextSubset_slug = "";
            /////////////////// PROPERTY MODULE CREATION
            //
            // key, e.g. raterData (create when make Property Module )
            // an enumeration node (created previously, anchored to a set in a source concept, e.g. enumerationFrom_entityTypes_thatCanRate_0bi7qq)
            // a target set within a target concept (e.g. conceptForRating) - currently this is assumed to be the concept's superset, but need to relax this assumption
            // At the time of property module creation, this will be stored within conceptData.propertyModuleData
            // (or should I make this a relationship? stored where?)
            // Subsequent steps:
            // to be made anew: property e.g. property_module_raterData, which will be stored within propertySchema of target concept (although this could be mirrored or cloned elsewhere?)
            // also to be made anew: target set, which is a subset of

            /////////////////// PROPERTY MODULE STORAGE - need to create a pattern-action to do this
            // Look inside every concept to find every entry within conceptData.propertyModuleData
            // step 1: translate this into relationships:
            // Group 1: overlaps with main schema for target concept
            // * currently this is not a relationship, but is stored within conceptData.propertyModuleData
            // 12. enumerationSlug -- inducesPartitioningOf, field: propertyModuleKey -- target set (usually but not always superset of target concept)
            // 12. enumerationSlug -- inducesOrganizationOf, field: propertyModuleKey -- induced subset of target set
            // * this is the relationship that triggers creation of all the relationships below

            /////////////////// PROPERTY MODULE EXPANSION - need to create a pattern-action to do this
            // Group 2: To overlap with propertySchemaFor(parent)
            // 3. newPropertyModule_forNextSubset_slug -- addToConceptGraphProperties, field: () -- newPrimaryProperty_forNextSubset_slug
            // * field needs to match the one it is replacing!!
            // 4. newEnumeration_forNextSubset_slug -- addToConceptGraphProperties, field: () -- newPropertyModule_forNextSubset_slug
            // (5). propertyModule(the one that already exists) -- restrictionOfOptionProduces, field: (?) -- newPropertyModule_forNextSubset_slug
            // (6). enumeration (the one that already exists) -- restrictionOfOptionProduces, field: (?) -- newEnumeration_forNextSubset_slug
            // (7). primaryPropertyFor(the one that already exists) -- restrictionOfOptionProduces, field: (?) -- newPrimaryProperty_forNextSubset_slug
            // 8. newPrimaryProperty_forNextSubset_slug -- isASpecificInstanceOf -- propertiesFor(main concept)_primaryProperty
            // 9. newPropertyModule_forNextSubset_slug -- isASpecificInstanceOf -- propertiesFor(main concept)_object_dependencies


            // Group 3: to overlap with main schema for originating concept
            // 1. newJSONSchema_forNextSubset_slug -- isTheJSONSchemaFor -- nextSubsetSlug
            // 2. newPrimaryProperty_forNextSubset_slug -- isThePrimaryPropertyFor -- newJSONSchema_forNextSubset_slug
            // * note that for a fully formed concept, isThePrimaryPropertyFor points toward wordType, not JSONSchema
            // (10). enumerationFrom(parent enumeration) -- restrictionOfOptionProduces, field: (?) -- newEnumeration_forNextSubset_slug
            // (11) (the specificInstance ) -- isTheSelectedOptionFor -- newEnumeration_forNextSubset_slug



            ///////////////////// MAKE NODES:
            // JSONSchema for this subset
            // JSONSchema type: JSONSchema_subset (links directly to a set, not to a wordType; maybe change name of type?)
            // ** not identical; only one Property Module will input into it; it will be similar to one of the Property Modules
            // for the main Primary Property, except that it will have only one enumeration option.
            if (lookupRawFileBySlug_obj.hasOwnProperty(newJSONSchema_forNextSubset_slug)) {
            }
            if (!lookupRawFileBySlug_obj.hasOwnProperty(newJSONSchema_forNextSubset_slug)) {
                var newSubset_rF_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["JSONSchema"]));
            }


            // Property Module for this subset -- this is the module that receives input from the enumeration node
            if (lookupRawFileBySlug_obj.hasOwnProperty(newJSONSchema_forNextSubset_slug)) {
            }
            if (!lookupRawFileBySlug_obj.hasOwnProperty(newJSONSchema_forNextSubset_slug)) {
                var newSubset_rF_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["property"]));
            }



            // Primary Property for this subset -- this receives input from the property module
            // primaryPropertyFor(main concept)_(subsetSlug)
            if (lookupRawFileBySlug_obj.hasOwnProperty(newJSONSchema_forNextSubset_slug)) {
            }
            if (!lookupRawFileBySlug_obj.hasOwnProperty(newJSONSchema_forNextSubset_slug)) {
                var newSubset_rF_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["property"]));
            }


            // enumeration for this subset
            // enumeration type: subEnumeration? const? singleOptionEnumeration?
            // "singular enumeration" meaning same as parent enumeraiton except it only gives one option
            if (lookupRawFileBySlug_obj.hasOwnProperty(newJSONSchema_forNextSubset_slug)) {
            }
            if (!lookupRawFileBySlug_obj.hasOwnProperty(newJSONSchema_forNextSubset_slug)) {
                var newSubset_rF_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["enumeration"]));
            }



            ///////////////////// MAKE RELATIONSHIPS:
            // JSONSchemaFor(Concept)_(subset) -- isTheJSONSchemaFor -- (subset)
            var jsonSchema_subset_rel_obj = MiscFunctions.blankRel_obj();
            jsonSchema_subset_rel_obj.nodeFrom.slug = newJSONSchema_forNextSubset_slug;
            jsonSchema_subset_rel_obj.relationshipType.slug = "isTheJSONSchemaFor";
            jsonSchema_subset_rel_obj.nodeFrom.slug = nextSubsetSlug;
            // add it to the schema; this function will check to see if it's already there
            // (the JSONSchema slug needs to be named appropriately so it is not duplicated inadvertently!)
            // ADD THIS WHEN READY (see above)
            // mainConcept_schema_rF_obj = MiscFunctions.updateSchemaWithNewRel(mainConcept_schema_rF_obj,jsonSchema_subset_rel_obj,lookupRawFileBySlug_obj);
        }
    }

    var mainConcept_schema_rF_str = JSON.stringify(mainConcept_schema_rF_obj,null,4);
    console.log("mainConcept_schema_rF_str:  "+mainConcept_schema_rF_str);
    MiscFunctions.updateWordInAllTables(mainConcept_schema_rF_obj);

    mainConcept_rF_obj.conceptData.propertyModuleData[propModuleKey] = propMod_obj;
    var mainConcept_rF_str = JSON.stringify(mainConcept_rF_obj,null,4);
    console.log("mainConcept_rF_str: "+mainConcept_rF_str);
    MiscFunctions.updateWordInAllTables(mainConcept_rF_obj)

    var propMod_str = JSON.stringify(propMod_obj,null,4);
    console.log("propMod_str: "+propMod_str)

}

async function updateNewPropertyModuleDisplay() {
    // console.log("QWERTY updateNewPropertyModuleDisplay A")

    var mainConceptSlug = jQuery("#conceptSelector_createPropertyModule option:selected").data("conceptslug");
    // console.log("QWERTY updateNewPropertyModuleDisplay A1; mainConceptSlug: "+mainConceptSlug)
    var mainConcept_rF_obj = JSON.parse(JSON.stringify(await lookupRawFileBySlug_obj.edited[mainConceptSlug]));
    // console.log("QWERTY updateNewPropertyModuleDisplay A2")
    var mainConcept_propertyModules_obj = {};
    if (mainConcept_rF_obj.conceptData.hasOwnProperty("propertyModuleData")) {
        mainConcept_propertyModules_obj = mainConcept_rF_obj.conceptData.propertyModuleData;
    }
    var numKeys = 0;
    jQuery("#existingPropertyModulesContainer").html("");
    // console.log("QWERTY updateNewPropertyModuleDisplay B")
    jQuery.each(mainConcept_propertyModules_obj,function(propModuleKey,propMod_obj){
        var propMod_str = JSON.stringify(propMod_obj,null,4);
        console.log("propMod_str: "+propMod_str)
        var propMod_enumerationSlug = propMod_obj.enumeration.slug;
        var nextPropModHTML = "";
        nextPropModHTML += "<div style='border:1px solid black;padding:3px;margin:1px;' >";
        nextPropModHTML += "propertyModule key: " + propModuleKey;
        nextPropModHTML += "<br>";
        nextPropModHTML += "enumeration: " + propMod_enumerationSlug;
        nextPropModHTML += "<br>";
        nextPropModHTML += "<div class=doSomethingButton data-propertymodulekey='"+propModuleKey+"' id=recreatePropertyModule_"+propModuleKey+" >recreate Property Module</div>";
        nextPropModHTML += "<div class=doSomethingButton data-propertymodulekey='"+propModuleKey+"' id=deletePropertyModule_"+propModuleKey+" >delete Property Module</div>";
        nextPropModHTML += "<div class=doSomethingButton data-propertymodulekey='"+propModuleKey+"' id=drawPropertyModule_"+propModuleKey+" >draw Property Module</div>";
        nextPropModHTML += "</div>";
        jQuery("#existingPropertyModulesContainer").append(nextPropModHTML)
        jQuery("#recreatePropertyModule_"+propModuleKey).click(function(){
            var pModKey = jQuery(this).data("propertymodulekey")
            recreatePropertyModule(propModuleKey);
        })
        jQuery("#deletePropertyModule_"+propModuleKey).click(function(){
            var pModKey = jQuery(this).data("propertymodulekey")
            console.log("deletePropertyModule_ clicked; pModKey: "+pModKey);
        })
        jQuery("#drawPropertyModule_"+propModuleKey).click(function(){
            var pModKey = jQuery(this).data("propertymodulekey")
            console.log("drawPropertyModule_ clicked; pModKey: "+pModKey);
            var networkElemID = "network_propertyModulePage";
            VisjsFunctions.makeVisGraph_propertyModule(mainConceptSlug,pModKey,networkElemID)
        })
        numKeys++;
    })
    // console.log("QWERTY updateNewPropertyModuleDisplay C")
    if (numKeys==0) {
        jQuery("#existingPropertyModulesContainer").html(" none ");
    }
    // console.log("QWERTY updateNewPropertyModuleDisplay D")
}

function drawSelectedConceptMainSchema() {
    var mainConceptSlug = jQuery("#conceptSelector_createPropertyModule option:selected").data("conceptslug");
    var mainSchemaSlug = jQuery("#conceptSelector_createPropertyModule option:selected").data("schemaslug");
    console.log("drawSelectedConceptMainSchema; mainSchemaSlug: "+mainSchemaSlug)
    VisjsBepmFunctions.makeVisGraphS(mainSchemaSlug,"network_propertyModulePage")
}

export default class PropertyModules extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        // createConceptSelector();
        createSelectors();
        jQuery("#createNewPropertyModuleContainer").change(function(){
            updateNewPropertyModuleDisplay();
            // redrawPropertyModuleGraph();
        });
        jQuery("#createNewPropertyModuleButton").click(function(){
            createNewPropertyModule();
        });
        jQuery("#drawSelectedConceptMainSchemaButton").click(function(){
            drawSelectedConceptMainSchema();
        });
        jQuery("#addEnumerationToGraphButton").click(function(){
            VisjsBepmFunctions.addEnumerationToGraph();
        });
        jQuery("#changeEdgeButton_inducesPartitioningOf_bepm").click(function(){
            VisjsBepmFunctions.changeEdge_bepm("inducesPartitioningOf");
        });
        jQuery("#changeEdgeButton_inducesOrganizationOf_bepm").click(function(){
            VisjsBepmFunctions.changeEdge_bepm("inducesOrganizationOf");
        });
        jQuery("#updateSchemaButton_bepm").click(function(){
            VisjsBepmFunctions.updateSchema_bepm();
        });
        jQuery("#updateSelectedNodeButton_bepm").click(function(){
            var selectedNodeSlug_bepm = jQuery("#nodeSelector_bepm option:selected").data("slug")
            VisjsBepmFunctions.changeNode_bepm(selectedNodeSlug_bepm);
        });
        jQuery("#updateSelectedEdgeButton_bepm").click(function(){
            var selectedEdgeSlug_bepm = jQuery("#relationshipTypeSelector_bepm option:selected").data("slug")
            VisjsBepmFunctions.changeEdge_bepm(selectedEdgeSlug_bepm);
        });
    }
    state = {
    }
    render() {
        return (
            <>
                <center>Add/Edit Property Modules</center>
                <fieldset id="createNewPropertyModuleContainer" style={{display:"inline-block",border:"1px sold black",width:"550px",height:"700px",padding:"5px",verticalAlign:"top"}}>
                    <div id="selectConceptContainer" style={{display:"inline-block",marginRight:"10px"}}>selectConceptContainer</div>
                    <div id="drawSelectedConceptMainSchemaButton" className="doSomethingButton_small" >draw selected concept main schema</div>
                    <div id="updateSchemaButton_bepm" className="doSomethingButton_small" >UPDATE SCHEMA</div>
                    <br/>
                    depicted schema:<div id="depictedSchema_bepm" style={{display:"inline-block",color:"red"}} ></div>
                    <br/>
                    selected edge:<div id="selectedEdge_bepm" style={{display:"inline-block",color:"red"}} ></div>
                    <br/>
                    selected node:<div id="selectedNode_bepm" style={{display:"inline-block",color:"red"}} ></div>
                    <br/>
                    <div style={{border:"1px solid black",padding:"5px"}}>
                        <center>
                            update selected
                            <div id="updateSelectedNodeButton_bepm" className="doSomethingButton_small" >node</div>
                            or
                            <div id="updateSelectedEdgeButton_bepm" className="doSomethingButton_small" >edge</div>
                        </center>

                        <select id="relationshipTypeSelector_bepm" >
                            <option data-slug="isASpecificInstanceOf" >isASpecificInstanceOf</option>
                            <option data-slug="subsetOf" >subsetOf</option>
                        </select>

                        <div id="nodeSelectorContainer_bepm">nodeSelectorContainer_bepm</div>
                    </div>
                    <div style={{border:"1px solid black",padding:"5px"}}>
                        <div id="addEnumerationToGraphButton" className="doSomethingButton_small" >add enumeration to schema on right</div>
                        <br/>
                        <div id="changeEdgeButton_inducesPartitioningOf_bepm" className="doSomethingButton_small" >change selected edge to: inducesPartitioningOf</div>
                        <textarea id="fieldForInducesPartitioningOf" style={{display:"inline-block",width:"250px",height:"20px"}}></textarea>
                        <br/>
                        <div id="changeEdgeButton_inducesOrganizationOf_bepm" className="doSomethingButton_small" >change selected edge to: inducesOrganizationOf</div>
                    </div>

                    <center>Create New (or update existing) Property Module</center>
                    <div id="selectEnumerationContainer">selectEnumerationContainer</div>
                    <br/>
                    new (or existing) property module key: <textarea id="newPropertyModuleKey" style={{width:"200px",height:"20px"}} ></textarea>
                    <br/>
                    create/update property module: <div id="createNewPropertyModuleButton" className="doSomethingButton">go</div>

                    <center>Existing Property Modules for this concept</center>
                    <div id="existingPropertyModulesContainer">existingPropertyModulesContainer</div>

                </fieldset>
                <div style={{display:"inline-block",border:"1px solid black",width:"900px",height:"700px"}} id="network_propertyModulePage"></div>
            </>
        );
    }
}
