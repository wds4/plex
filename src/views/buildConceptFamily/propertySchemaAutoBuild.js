import React from "react";
import IpfsHttpClient from 'ipfs-http-client';
import sendAsync from '../../renderer';
import { lookupRawFileBySlug_obj, templatesByWordType_obj, insertOrUpdateWordIntoMyConceptGraphAndMyDictionary, insertOrUpdateWordIntoMyDictionary, insertOrUpdateWordIntoMyConceptGraph } from '../addANewConcept';
import * as MiscFunctions from '../../lib/miscFunctions.js';
import * as VisjsFunctions from '../../lib/visjs/visjs-functions.js';
import * as PropertyFormationFunctions from './propertyFormationFunctionsUsingRelationships.js';
import { highlightedNode_slug } from '../../lib/visjs/visjs-functions.js';
const jQuery = require("jquery");

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

function updatePropertiesForSelectedConceptContainer() {
    // console.log("updatePropertiesForSelectedConceptContainer")
    var selectedConcept_slug = jQuery("#conceptSelector_propSchemaAutoBuild option:selected").data("conceptslug");

    if (lookupRawFileBySlug_obj.hasOwnProperty(selectedConcept_slug)) {
        var currentConcept_rF_obj = lookupRawFileBySlug_obj[selectedConcept_slug]
        var propertiesForSelectedConcept_slug = "unknown";
        if (currentConcept_rF_obj.conceptData.nodes.hasOwnProperty("properties")) {
            propertiesForSelectedConcept_slug = currentConcept_rF_obj.conceptData.nodes.properties.slug;
        }
        // console.log("updatePropertiesForSelectedConceptContainer; propertiesForSelectedConcept_slug: "+propertiesForSelectedConcept_slug)
        jQuery("#propertiesForSelectedConceptContainer").html(propertiesForSelectedConcept_slug)
    }
}
function updatePropertySchemaRawFileContainer() {
    var selectedConcept_slug = jQuery("#conceptSelector_propSchemaAutoBuild option:selected").data("conceptslug");
    var selectedPropertySchema_slug = jQuery("#conceptSelector_propSchemaAutoBuild option:selected").data("propertyschemaslug");

    if (lookupRawFileBySlug_obj.hasOwnProperty(selectedPropertySchema_slug)) {
        var currentPropertySchema_rF_obj = lookupRawFileBySlug_obj[selectedPropertySchema_slug]
    } else {
        var currentPropertySchema_rF_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["schema"]));
        currentPropertySchema_rF_obj.wordData.slug = selectedPropertySchema_slug;
    }
    var currentPropertySchema_rF_str = JSON.stringify(currentPropertySchema_rF_obj,null,4);
    jQuery("#currentPropertySchema_propSchemaAutoBuild_rawFile").html(currentPropertySchema_rF_str)
    jQuery("#currentPropertySchema_propSchemaAutoBuild_rawFile").val(currentPropertySchema_rF_str)
    jQuery("#editedPropertySchema_propSchemaAutoBuild_rawFile").html(currentPropertySchema_rF_str)
    jQuery("#editedPropertySchema_propSchemaAutoBuild_rawFile").val(currentPropertySchema_rF_str)
}

function updateJSONSchemaRawFileContainer() {
    var selectedConcept_slug = jQuery("#conceptSelector_propSchemaAutoBuild option:selected").data("conceptslug");
    var selectedJSONSchema_slug = jQuery("#conceptSelector_propSchemaAutoBuild option:selected").data("jsonschemaslug");

    // console.log("updateJSONSchemaRawFileContainer; selectedJSONSchema_slug: "+selectedJSONSchema_slug)

    if (lookupRawFileBySlug_obj.hasOwnProperty(selectedJSONSchema_slug)) {
        var selectedJSONSchema_rF_obj = lookupRawFileBySlug_obj[selectedJSONSchema_slug]
    } else {
        var selectedJSONSchema_rF_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["JSONSchema"]));
        selectedJSONSchema_rF_obj.wordData.slug = selectedJSONSchema_slug;
    }
    var selectedJSONSchema_rF_str = JSON.stringify(selectedJSONSchema_rF_obj,null,4);
    jQuery("#selectedJSONSchema_current_rawFile").html(selectedJSONSchema_rF_str)
    jQuery("#selectedJSONSchema_current_rawFile").val(selectedJSONSchema_rF_str)
    jQuery("#selectedJSONSchema_edited_rawFile").html(selectedJSONSchema_rF_str)
    jQuery("#selectedJSONSchema_edited_rawFile").val(selectedJSONSchema_rF_str)
}

async function createSelectors_propSchemaAutoBuild() {
    var currentConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
    var sql = "";
    sql += " SELECT * FROM "+currentConceptGraph_tableName;

    sendAsync(sql).then((words_arr) => {
        // selectorHTML1: conceptSelector_propSchemaAutoBuild_Container
        var selectorHTML1 = "";
        selectorHTML1 += "<select id=conceptSelector_propSchemaAutoBuild >";

        var numWords = words_arr.length;
        for (var w=0;w<numWords;w++) {
            var nextWord_str = words_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_wordTypes = nextWord_obj.wordData.wordTypes;
            var nextWord_ipns = nextWord_obj.metaData.ipns;

            // console.log("createSelectors_propSchemaAutoBuild; nextWord_slug: "+nextWord_slug)

            var isWordType_concept = jQuery.inArray("concept",nextWord_wordTypes);
            var isWordType_property = jQuery.inArray("property",nextWord_wordTypes);

            if (isWordType_concept > -1 ) {
                // console.log("createSelectors_propSchemaAutoBuild; wordType is concept; nextWord_slug "+nextWord_slug)
                // var nextConcept_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[nextWord_slug]));
                // var nextConcept_rF_str = JSON.stringify(nextConcept_rF_obj,null,4);
                var nextConcept_rF_str = nextWord_str;
                var nextConcept_rF_obj = nextWord_obj;
                // console.log("createSelectors_propSchemaAutoBuild; wordType is concept; nextConcept_rF_str: "+nextConcept_rF_str)
                var nextConcept_JSONSchema_slug = nextConcept_rF_obj.conceptData.nodes.JSONSchema.slug;
                var nextConcept_wordType_slug = nextConcept_rF_obj.conceptData.nodes.wordType.slug;
                if (nextConcept_rF_obj.conceptData.nodes.hasOwnProperty("propertySchema")) {
                    var nextConcept_propertySchema_slug = nextConcept_rF_obj.conceptData.nodes.propertySchema.slug;
                } else {
                    var nextConcept_propertySchema_slug = "schemaForPropertiesFor"+nextConcept_wordType_slug.substr(0,1).toUpperCase()+nextConcept_wordType_slug.substr(1);
                    var nextConcept_propertySchema_rF_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["schema"]));
                }
                if (nextConcept_rF_obj.conceptData.nodes.hasOwnProperty("properties")) {
                    var nextConcept_properties_slug = nextConcept_rF_obj.conceptData.nodes.properties.slug;
                } else {
                    var nextConcept_properties_slug = "propertiesFor"+nextConcept_wordType_slug.substr(0,1).toUpperCase()+nextConcept_wordType_slug.substr(1);
                }

                selectorHTML1 += "<option data-conceptslug='"+nextWord_slug+"' data-propertiesslug='"+nextConcept_properties_slug+"' data-propertyschemaslug='"+nextConcept_propertySchema_slug+"' data-wordtypeslug='"+nextConcept_wordType_slug+"' data-jsonschemaslug='"+nextConcept_JSONSchema_slug+"' >";
                selectorHTML1 += nextConcept_wordType_slug;
                selectorHTML1 += "</option>";
            }
        }
        selectorHTML1 += "</select>";
        jQuery("#conceptSelector_propSchemaAutoBuild_Container").html(selectorHTML1)
        jQuery("#conceptSelector_propSchemaAutoBuild").change(function(){
            updatePropertySchemaRawFileContainer();
            updateJSONSchemaRawFileContainer();
            updatePropertiesForSelectedConceptContainer();
        })
        updatePropertySchemaRawFileContainer();
        updateJSONSchemaRawFileContainer();
        updatePropertiesForSelectedConceptContainer();
    });
}

var newProperties_arr = [];

async function createOrUpdatePropertyWord(parentProp_slug,propertyKey,propertyValue_obj) {
    var selectedPropertySchema_slug = jQuery("#conceptSelector_propSchemaAutoBuild option:selected").data("propertyschemaslug");
    var selectedConcept_slug = jQuery("#conceptSelector_propSchemaAutoBuild option:selected").data("conceptslug");
    // console.log("createOrUpdatePropertyWord; propertyKey: "+propertyKey+"; selectedPropertySchema_slug: "+selectedPropertySchema_slug);

    if (lookupRawFileBySlug_obj.edited.hasOwnProperty(propertyKey)) {
        // console.log("createOrUpdatePropertyWord This property already exists - propertyKey: "+propertyKey)
        newProperty_obj = lookupRawFileBySlug_obj.edited[propertyKey];
        newProperty_slug = propertyKey;
    } else {
        // console.log("createOrUpdatePropertyWord This property does NOT already exist and must be created de novo - propertyKey: "+propertyKey)
        var newProperty_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["property"]));
        var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
        var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
        newProperty_obj.globalDynamicData.myDictionaries.push(myDictionary);
        newProperty_obj.globalDynamicData.myConceptGraphs.push(myConceptGraph);

        var currentTime = Date.now();

        var randNonce = Math.floor(Math.random() * 1000);
        var newKeyname = "dictionaryWord_property_"+currentTime+"_"+randNonce;
        var generatedKey_obj = await ipfs.key.gen(newKeyname, {
            type: 'rsa',
            size: 2048
        })
        var newProperty_ipns = generatedKey_obj["id"];
        var generatedKey_name = generatedKey_obj["name"];
        // console.log("generatedKey_obj id: "+newProperty_ipns+"; name: "+generatedKey_name);
        newProperty_obj.metaData.ipns = newProperty_ipns;

        // Not sure whether slug should have the propertyKey within it or not
        // var newProperty_slug = "property_"+newProperty_ipns.slice(newProperty_ipns.length-6);
        var newProperty_slug = "property_"+propertyKey+"_"+newProperty_ipns.slice(newProperty_ipns.length-6);
        var newProperty_title = "Property for "+propertyKey+" ("+newProperty_slug+")";
        var newProperty_name = "property for "+propertyKey+" ("+newProperty_slug+")";

        newProperty_obj.wordData.slug = newProperty_slug;
        newProperty_obj.wordData.title = newProperty_title;
        newProperty_obj.wordData.name = newProperty_name;

        // store a preliminary version which will be updated later; it is needed so that
        // the updateSchemaWithNewRel function can access it to fetch ipns
        lookupRawFileBySlug_obj[newProperty_slug] = JSON.parse(JSON.stringify(newProperty_obj));
        lookupRawFileBySlug_obj.edited[newProperty_slug] = JSON.parse(JSON.stringify(newProperty_obj));
    }
    // first, create the newProperty_obj without worrying about whether it already exists; will check later to see if it already exists

    // CHANGE NAME OF DEFINITION
    if (lookupRawFileBySlug_obj.edited.hasOwnProperty(parentProp_slug)) {
        // console.log("createPropertyWord_; parent file has been created; parentProp_slug: "+parentProp_slug+"; propertyKey: "+propertyKey+"; newProperty_slug: "+newProperty_slug)
        // edit parent property file
        var newAndImprovedProperty_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[parentProp_slug]));
        var newAndImprovedProperty_str = JSON.stringify(newAndImprovedProperty_obj,null,4);
        // console.log("newAndImprovedProperty_str: "+newAndImprovedProperty_str)
        newAndImprovedProperty_obj.propertyData.JSONSchemaStyle.value.properties[propertyKey] = {};
        newAndImprovedProperty_obj.propertyData.JSONSchemaStyle.value.properties[propertyKey]["$ref"] = "#/definitions/"+newProperty_slug;
        var newProperty_x_obj = {};
        newProperty_x_obj.key = propertyKey;
        newProperty_x_obj.slug = newProperty_slug;
        newAndImprovedProperty_obj.propertyData.conceptGraphStyle.properties.push(newProperty_x_obj);
        /*
        // properties2 used temporarily for test purposes only
        if (!newAndImprovedProperty_obj.propertyData.conceptGraphStyle.hasOwnProperty("properties2")) {
            newAndImprovedProperty_obj.propertyData.conceptGraphStyle.properties2 = [];
        }
        newAndImprovedProperty_obj.propertyData.conceptGraphStyle.properties2.push(newProperty_x_obj);
        newAndImprovedProperty_obj.propertyData.conceptGraphStyle.properties.push(newProperty_slug);
        */

        // determine whether it is required by checking whether propertyKey is in required
        if (newAndImprovedProperty_obj.propertyData.JSONSchemaStyle.value.hasOwnProperty("required")) {
            if (jQuery.inArray(propertyKey,newAndImprovedProperty_obj.propertyData.JSONSchemaStyle.value.required) > -1) {
                newAndImprovedProperty_obj.propertyData.conceptGraphStyle.required.push(newProperty_slug);
            }
        }
        var newAndImprovedProperty_rF_str = JSON.stringify(newAndImprovedProperty_obj,null,4);
        lookupRawFileBySlug_obj[parentProp_slug] = JSON.parse(JSON.stringify(newAndImprovedProperty_obj));
        lookupRawFileBySlug_obj.edited[parentProp_slug] = JSON.parse(JSON.stringify(newAndImprovedProperty_obj));

        // add to propertySchema
        var newRel_obj = {};
        newRel_obj.nodeFrom = {};
        newRel_obj.relationshipType = {};
        newRel_obj.nodeTo = {};
        newRel_obj.nodeFrom.slug = newProperty_slug;
        newRel_obj.relationshipType.slug="addToConceptGraphProperties";
        newRel_obj.relationshipType.addToConceptGraphPropertiesData = {};
        newRel_obj.relationshipType.addToConceptGraphPropertiesData.field=propertyKey;
        newRel_obj.nodeTo.slug = parentProp_slug;
        var newRel_str = JSON.stringify(newRel_obj,null,4);
        // console.log("createPropertyWord; newRel_str: "+newRel_str);
        var propSchema_rF_str = jQuery("#editedPropertySchema_propSchemaAutoBuild_rawFile").val();
        var propSchema_rF_obj = JSON.parse(propSchema_rF_str);
        var propSchema_updated_rF_obj = MiscFunctions.updateSchemaWithNewRel(propSchema_rF_obj,newRel_obj,lookupRawFileBySlug_obj)
        var propSchema_updated_rF_str = JSON.stringify(propSchema_updated_rF_obj,null,4);
        jQuery("#editedPropertySchema_propSchemaAutoBuild_rawFile").val(propSchema_updated_rF_str);
        jQuery("#editedPropertySchema_propSchemaAutoBuild_rawFile").html(propSchema_updated_rF_str);
        var propSchema_updated_slug = propSchema_updated_rF_obj.wordData.slug;
        lookupRawFileBySlug_obj.edited[propSchema_updated_slug] = JSON.parse(JSON.stringify(propSchema_updated_rF_obj));

        jQuery("#newProperty_rF_"+parentProp_slug).html(newAndImprovedProperty_rF_str)
        jQuery("#newProperty_rF_"+parentProp_slug).val(newAndImprovedProperty_rF_str)
    } else {
        // console.log("createPropertyWord_; parent file has NOTE been created")
    }

    // process propertyValue_obj
    var propertyValue_processed_obj = JSON.parse(JSON.stringify(propertyValue_obj));
    if (propertyValue_processed_obj.hasOwnProperty("properties")) {
        // processProperties(propertyValue_processed_obj.properties)
        jQuery.each(propertyValue_processed_obj.properties,function(k,v){
            propertyValue_processed_obj.properties[k] = {};
            // SET DEFINITION TO BE SAME AS KEY -- this is later changed (see code above) so that key does not have to be identical to the definition
            propertyValue_processed_obj.properties[k]["$ref"] = "#/definitions/"+k;
        })
    }
    newProperty_obj.propertyData.JSONSchemaStyle.key = propertyKey;
    newProperty_obj.propertyData.JSONSchemaStyle.value = propertyValue_processed_obj;
    var newPropertyType = newProperty_obj.propertyData.JSONSchemaStyle.value.type;
    newProperty_obj.propertyData.conceptGraphStyle.type = newPropertyType;
    var newProperty_propertyType = "";
    if (newPropertyType=="object") {
        newProperty_propertyType = "type3";
        newProperty_obj.propertyData.type = newProperty_propertyType;
        if (jQuery.inArray("type3",newProperty_obj.propertyData.types) == -1) {
            newProperty_obj.propertyData.types.push("type3");
        }
        newProperty_obj.propertyData.conceptGraphStyle.type="object";
    }
    if (newPropertyType=="string") {
        newProperty_propertyType = "type1";
        newProperty_obj.propertyData.type = newProperty_propertyType;
        if (jQuery.inArray("type1",newProperty_obj.propertyData.types) == -1) {
            newProperty_obj.propertyData.types.push("type1");
        }
        newProperty_obj.propertyData.conceptGraphStyle.type="string";
    }
    // newProperty_obj.propertyData.conceptGraphStyle.type = null;
    newProperty_obj.propertyData.conceptGraphStyle.props = [];
    newProperty_obj.propertyData.conceptGraphStyle.properties = [];
    newProperty_obj.propertyData.conceptGraphStyle.required = [];
    newProperty_obj.propertyData.metaData = {};
    newProperty_obj.propertyData.metaData.parentConcepts = [];
    newProperty_obj.propertyData.metaData.parentConcepts.push(jQuery("#conceptSelector_propSchemaAutoBuild option:selected").data("conceptslug"));

    newProperties_arr.push(newProperty_slug)

    var newProperty_str = JSON.stringify(newProperty_obj,null,4);
    // console.log("newProperty_str: "+newProperty_str);
    var newPropertyHTMLa = "";
    var newPropertyHTMLb = "";
    newPropertyHTMLa += "<div id=toggleButton_"+newProperty_slug+" class='doSomethingButton togglePropertyRawFilesButton' data-newpropertyslug="+newProperty_slug+" >"+propertyKey+"</div>";
    newPropertyHTMLb += "<textarea id='newProperty_rF_"+newProperty_slug+"' class=newPropertyContainers style='display:none;width:530px;height:800px;overflow-y:scroll;' >";
    newPropertyHTMLb += newProperty_str;
    newPropertyHTMLb += "</textarea>";
    jQuery("#propertySlugsContainer").append(newPropertyHTMLa);
    jQuery("#propertyRawFilesContainer").append(newPropertyHTMLb);
    jQuery("#toggleButton_"+newProperty_slug).click(function(){
        jQuery(".togglePropertyRawFilesButton").css("backgroundColor","grey")
        jQuery(this).css("backgroundColor","green")
        jQuery(".newPropertyContainers").css("display","none");
        jQuery("#newProperty_rF_"+newProperty_slug).css("display","block");
    })

    lookupRawFileBySlug_obj[newProperty_slug] = JSON.parse(JSON.stringify(newProperty_obj));
    lookupRawFileBySlug_obj.edited[newProperty_slug] = JSON.parse(JSON.stringify(newProperty_obj));
    // update schemaForPropertiesFor[] with new property node and the relationship:
    // newProperty -isASpecificInstanceOf-- propertiesFor[concept]
    var newProperties_slug = jQuery("#propertiesForSelectedConceptContainer").html()
    if (newProperties_slug == "unknown") {
        // console.log("createPropertyWord; cannot create new relationship because propertiesFor(selectedConcept) is not known.");
    } else {
        var propertiesSubset_slug = newProperties_slug+"_"+newProperty_propertyType;
        var newRel_obj = {};
        newRel_obj.nodeFrom = {};
        newRel_obj.relationshipType = {};
        newRel_obj.nodeTo = {};
        newRel_obj.nodeFrom.slug = newProperty_slug;
        newRel_obj.relationshipType.slug="isASpecificInstanceOf";
        newRel_obj.nodeTo.slug = propertiesSubset_slug;
        var newRel_str = JSON.stringify(newRel_obj,null,4);
        // console.log("createPropertyWord; newRel_str: "+newRel_str);
        var propSchema_rF_str = jQuery("#editedPropertySchema_propSchemaAutoBuild_rawFile").val();
        var propSchema_rF_obj = JSON.parse(propSchema_rF_str);
        var propSchema_updated_rF_obj = MiscFunctions.updateSchemaWithNewRel(propSchema_rF_obj,newRel_obj,lookupRawFileBySlug_obj)
        var propSchema_updated_rF_str = JSON.stringify(propSchema_updated_rF_obj,null,4);
        lookupRawFileBySlug_obj.edited[selectedPropertySchema_slug] = JSON.parse(JSON.stringify(propSchema_updated_rF_obj));
        jQuery("#editedPropertySchema_propSchemaAutoBuild_rawFile").val(propSchema_updated_rF_str);
        jQuery("#editedPropertySchema_propSchemaAutoBuild_rawFile").html(propSchema_updated_rF_str);
    }
    /*
    var wordTypes = "word,property";
    insertOrUpdateWordIntoMyDictionary(myDictionary,newProperty_str,newProperty_slug,generatedKey_name,newProperty_ipns)
    insertOrUpdateWordIntoMyConceptGraph(myConceptGraph,myDictionary,newProperty_str,newProperty_slug,generatedKey_name,newProperty_ipns);

    */
    return newProperty_slug;
}

async function processProp(parentProp_slug,propKey,propValue,propDepth,cP) {
    // propDepth++;
    var propValueType = typeof propValue;
    // console.log("processProp; parentProp_slug: "+parentProp_slug+"; propKey: "+propKey+"; propDepth: "+propDepth+"; propValueType: "+propValueType);
    if (propKey=="properties") {
        processProperties(parentProp_slug,propValue,propDepth+1,cP)
    }
    if (propValueType=="string") {
        var newProp_obj = {};
        newProp_obj.key=propKey;
        newProp_obj.value=propValue;
        lookupRawFileBySlug_obj.edited[parentProp_slug].propertyData.conceptGraphStyle.props.push(newProp_obj);
    }
    if (propValueType=="array") {
    }
    if (propValueType=="integer") {
    }
    if (propValueType=="object") {
    }
}
/*
// note that we alternate between propertyKey (the value of which is obj) and propKey (the value of which is any type)
propertyKey: {
    propKey: propValue, // propValue may be a string, an integer, an array, an object, NULL, etc ...
    propKey: propValue,
    propKey: [],
    propKey: {  // if propKey == "properties" then propValue is an object
      propertyKey: propertyValue_obj,
      propertyKey: propertyValue_obj
  }
}
*/
function processPreexistingDefinition(preexistingDefinition_slug,parentProp_slug,propDepth,cPath) {
    // console.log("preexistingDefinition_slug: "+preexistingDefinition_slug+"; parentProp_slug: "+parentProp_slug+"; propDepth: "+propDepth+"; cPath: "+cPath);
    var selectedJSONSchema_rF_str = jQuery("#selectedJSONSchema_current_rawFile").val();
    var selectedJSONSchema_rF_obj = JSON.parse(selectedJSONSchema_rF_str);
    var preexistingDefinition_obj = selectedJSONSchema_rF_obj.definitions[preexistingDefinition_slug];
    var preexistingDefinition_str = JSON.stringify(preexistingDefinition_obj,null,4);
    // console.log("preexistingDefinition_str: "+preexistingDefinition_str);

    processProperty(parentProp_slug,preexistingDefinition_slug,preexistingDefinition_obj,propDepth,cPath)
    // processProperties(preexistingDefinition_slug,preexistingDefinition_obj,propDepth,cPath)
}
// input: a single key-value pair that follows properties: { .. } and returns the slug of the generated property
async function processProperty(parentProp_slug,propertyKey,propertyValue_obj,propDepth,cPath) {
    var propertyValue_str = JSON.stringify(propertyValue_obj,null,4);
    // console.log("propertyValue_str: "+propertyValue_str);
    if (propertyValue_obj.hasOwnProperty("$ref")) {
        // console.log("processProperties: hasOwnProperty $ref")
        var propertyValue_ref = propertyValue_obj["$ref"];
        var preexistingDefinition_slug = propertyValue_ref.substring(14);
        // console.log("createdPropertyWord_slug: "+createdPropertyWord_slug)
        processPreexistingDefinition(preexistingDefinition_slug,parentProp_slug,propDepth,cPath);
        var createdPropertyWord_slug = preexistingDefinition_slug;
    } else {
        // console.log("processProperty; parentProp_slug: "+parentProp_slug+"; propertyKey: "+propertyKey+"; propDepth: "+propDepth);
        var createdPropertyWord_slug = await createOrUpdatePropertyWord(parentProp_slug,propertyKey,propertyValue_obj);

        // console.log("processProperty; parentProp_slug: "+parentProp_slug+"; propertyKey: "+propertyKey+"; propDepth: "+propDepth+"; createdPropertyWord_slug: "+createdPropertyWord_slug);
        jQuery.each(propertyValue_obj, function (propKey, propValue) {
            // console.log("processProperties; propKey: "+propKey);
            var parentProp_slug = createdPropertyWord_slug;
            processProp(parentProp_slug,propKey,propValue,propDepth,cPath+"."+propertyKey+".properties")
        });
    }
    return createdPropertyWord_slug;
}

// input: the object that comes after properties: { .. }
async function processProperties(parentProp_slug,properties_obj,propDepth,currPath) {
    // console.log("processProperties; currPath: "+currPath);
    jQuery.each(properties_obj, async function (propertyKey, propertyValue) {
        // console.log("processProperties; propertyKey: "+propertyKey+": propDepth: "+propDepth);
        var createdPropertyWord_slug = await processProperty(parentProp_slug,propertyKey,propertyValue,propDepth,currPath);
        // console.log("processProperties; propertyKey: "+propertyKey+": propDepth: "+propDepth+"; createdPropertyWord_slug: "+createdPropertyWord_slug);
    });

}

// elements of props_arr are objects with format: { key: foo1, value: foo2 } where foo2 is a string or integer, not an object or array
function discoverSeedProperties_types1and2(props_arr) {
    var props_str = JSON.stringify(props_arr,null,4);
    // console.log("discoverSeedProperties_types1and2 props_str: "+props_str);
    // props_arr is the array of props from what is referred to as the target property
    var numPr = props_arr.length;
    var match = {};
    // match[s][p][t]
    // s will represent the candidate seed properties from schemaForProperties
    // p will represent the p-th element within property s
    // t will represent the t-th element within the target prop
    // match[s][p][t] = true means that element p from seed property s is identical to element t from the target array
    // fetch the list of type1 properties which are candidate seedProperties for props_arr
    // match[s] true means that every single element within seed s is a match for an element within the target
    // goal is to pick a match[s] which is true, and to pick the largest one (largest number of matching elements )
    match.atLeastOneMatch = false;
    match.bestMatch = {};
    match.bestMatch.number = 0;
    match.bestMatch.slug = null;
    match.bestMatch.title = null;
    match.bestMatch.propList = [];
    match.remainingProps_arr = [];

    // combine type0 and type1 properties together; fetch both sets of specificInstances then put them into one set
    // Future: make a new set node to put all of these in one place
    // (may change this later)
    var properties_type0_rF_obj = lookupRawFileBySlug_obj.edited.properties_type0;
    var properties_type0_arr = properties_type0_rF_obj.globalDynamicData.specificInstances;
    var numPropNodesT0 = properties_type0_arr.length;

    var properties_type1_rF_obj = lookupRawFileBySlug_obj.edited.properties_type1;
    var properties_type1_arr = properties_type1_rF_obj.globalDynamicData.specificInstances;
    var numPropNodesT1 = properties_type1_arr.length;

    var properties_tot_arr = JSON.parse(JSON.stringify(properties_type0_arr));
    for (var s=0;s<numPropNodesT1;s++) {
        var nextPropT1_slug = properties_type1_arr[s];
        properties_tot_arr.push(nextPropT1_slug);
    }

    var numPropNodesTot = properties_tot_arr.length;

    for (var s=0;s<numPropNodesTot;s++) {
        match[s] = {};
        var nextPropT1_slug = properties_tot_arr[s];
        var nextPropT1_rF_obj = lookupRawFileBySlug_obj.edited[nextPropT1_slug];
        var nextPropT1_title = nextPropT1_rF_obj.wordData.title;
        var nextPropT1_props_arr = nextPropT1_rF_obj.propertyData.conceptGraphStyle.props;
        var numProps = nextPropT1_props_arr.length;
        match[s].candidate = true;
        match[s].slug = nextPropT1_slug;
        match[s].title = nextPropT1_title;
        match[s].numProps = numProps;
        match[s].propList = nextPropT1_props_arr;
        // match[s].remainingProps_arr = [];
        // console.log("discoverSeedProperties_types1and2; nextPropT1_slug: "+nextPropT1_slug+"; nextPropT1_title: "+nextPropT1_title+"; numProps: "+numProps)
        // var nextPropT1_props_str = JSON.stringify(nextPropT1_props_arr,null,4);
        for (var p=0;p<numProps;p++) {
            match[s][p] = {};
            match[s][p].candidate = false;
            var nextProp_obj = nextPropT1_props_arr[p];
            for (var q=0;q<numPr;q++) {
                var nextPr_obj = props_arr[q];
                if ( (nextPr_obj.key==nextProp_obj.key) && (nextPr_obj.value==nextProp_obj.value) ) {
                    match[s][p].candidate = true;
                    // match[s][p][q] = true;
                } else {
                    // match[s][p][q] = false;
                    // match[s].remainingProps_arr.push(nextPr_obj);
                }
            }
            if (match[s][p].candidate == false) {
                match[s].candidate = false;

            }
        }
        if (match[s].candidate == true) {
            if (match[s].numProps > match.bestMatch.number) {
                match.atLeastOneMatch = true;
                match.bestMatch.number = match[s].numProps;
                match.bestMatch.slug = match[s].slug;
                match.bestMatch.title = match[s].title;
                match.bestMatch.propList = match[s].propList;
            }
        }
    }
    var bM_propList  = match.bestMatch.propList;
    var numInBmPropList = bM_propList.length;
    var propIsPresent = false;
    for (var q=0;q<numPr;q++) {
        var nextPr_obj = props_arr[q];
        propIsPresent = false;
        for (var l=0;l<numInBmPropList;l++) {
            var nextPropInBestMatch_obj = bM_propList[l];
            if ( (nextPropInBestMatch_obj.key == nextPr_obj.key) && (nextPropInBestMatch_obj.value == nextPr_obj.value) ) {
                propIsPresent = true;
            }
        }
        if (!propIsPresent) {
            match.remainingProps_arr.push(nextPr_obj)
        }
    }
    return match;
}

// goes through every property in the schema and explodes the contents of props array in terms of preexisting properties
// goal is to account for the entirely of the key-value pairs within props array
// processProps ALGORITHM
// 1. assume type: object (or type:string or whatever) is already created via isASpecificInstanceOf one of the propeties_typeX sets
// and so remove it
// 2. account for as many as possibe using preexisting type1 properties (which are of type:string and have multiple key-value pairs)
// next, account for as many as possibe using preexisting type0 properties (single key-value pair)
// next, account for as many as possible using preexisting hasKey properties
// next, create from scratch for whatever elements are left unaccounted for
var remainingProps = {};
function processProps() {
    // console.log("processProps; ");
    // fetch all type0, type1, type2, and type3 properties from the conceptGraph's conceptForProperty
    // (also include other properties from other concepts?? or assume they should all already be included in conceptForProperty?)
    var propertySchema_slug = jQuery("#conceptSelector_propSchemaAutoBuild option:selected").data("propertyschemaslug");
    var propertySchema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[propertySchema_slug]));
    var nodes_arr = propertySchema_rF_obj.schemaData.nodes;
    var numNodes = nodes_arr.length;
    remainingProps = {};
    for (var v=0;v<numNodes;v++) {
        var nextNode_obj = nodes_arr[v];
        var nextNode_slug = nextNode_obj.slug;
        var nextNode_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[nextNode_slug]));
        var nextNode_wordTypes_arr = nextNode_rF_obj.wordData.wordTypes;
        if (jQuery.inArray("property",nextNode_wordTypes_arr) > -1) {
            // console.log("processProps; next property node, nextNode_slug: "+nextNode_slug)
            var nextProperty_props_arr = nextNode_rF_obj.propertyData.conceptGraphStyle.props;
            var numProps = nextProperty_props_arr.length;
            // cycle through each property and see which preexisting properties
            var nextProperty_remaining_props_arr = JSON.parse(JSON.stringify(nextProperty_props_arr));
            /*
            var nextProperty_remaining_props_arr = [];
            for (var p=0;p<numProps;p++) {
                var nextProp_obj = nextProperty_props_arr[p];
                // Initiate the processProps ALGORITHM (detailed above)
                // step 1: remove { type: xyz }  from nextProperty_remaining_props_arr
                if (nextProp_obj.key == "type") {
                    // remove this key-value pair; assume it will be recreated via isASpecificInstanceOf the appropriate properties_ set
                } else {
                    nextProperty_remaining_props_arr.push(nextProp_obj);
                }
            }
            */
            // step 2:
            // cycle through this step until no more propagateProperty relationships are added
            var continueAddingSeedProps_type1 = true;
            var addSeedProps_numCycles = 0;
            do {
                // var discSeedPropertiesResponse_obj = discoverSeedProperties_types1and2(nextProperty_props_arr);
                var discSeedPropertiesResponse_obj = discoverSeedProperties_types1and2(nextProperty_remaining_props_arr);
                var discSeedPropertiesResponse_str = JSON.stringify(discSeedPropertiesResponse_obj,null,4);
                // console.log("processProps; discSeedPropertiesResponse_str: "+discSeedPropertiesResponse_str)
                var bestMatch_number = discSeedPropertiesResponse_obj.bestMatch.number;
                var bestMatch_slug = discSeedPropertiesResponse_obj.bestMatch.slug;
                var bestMatch_title = discSeedPropertiesResponse_obj.bestMatch.title;
                var bestMatch_propList_arr = discSeedPropertiesResponse_obj.bestMatch.propList;
                var bestMatch_propList_str = JSON.stringify(bestMatch_propList_arr,null,4)
                // console.log("processProps; discSeedPropertiesResponse_obj; for property with nextNode_slug: "+nextNode_slug+", this can be seeded by bestMatch_title: "+bestMatch_title+",bestMatch_slug: "+bestMatch_slug+" which will account for this many elements: "+bestMatch_number+"; bestMatch_propList_str: "+bestMatch_propList_str);
                continueAddingSeedProps_type1 = false;
                if (discSeedPropertiesResponse_obj.atLeastOneMatch) {
                    // create relationship and add to schema !
                    var newRel_obj = {};
                    newRel_obj.nodeFrom = {};
                    newRel_obj.relationshipType = {};
                    newRel_obj.nodeTo = {};
                    newRel_obj.nodeFrom.slug = bestMatch_slug;
                    newRel_obj.relationshipType.slug = "propagateProperty";
                    newRel_obj.nodeTo.slug = nextNode_slug;
                    var newRel_str = JSON.stringify(newRel_obj,null,4)
                    // console.log("newRel_str___: "+newRel_str)
                    var propertySchema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[propertySchema_slug]));
                    var propertySchema_updated_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_rF_obj,newRel_obj,lookupRawFileBySlug_obj);
                    var propertySchema_updated_rF_str = JSON.stringify(propertySchema_updated_rF_obj,null,4)
                    jQuery("#editedPropertySchema_propSchemaAutoBuild_rawFile").val(propertySchema_updated_rF_str);
                    jQuery("#editedPropertySchema_propSchemaAutoBuild_rawFile").html(propertySchema_updated_rF_str);
                    lookupRawFileBySlug_obj[propertySchema_slug] = JSON.parse(JSON.stringify(propertySchema_updated_rF_obj));
                    lookupRawFileBySlug_obj.edited[propertySchema_slug] = JSON.parse(JSON.stringify(propertySchema_updated_rF_obj));

                    nextProperty_remaining_props_arr = discSeedPropertiesResponse_obj.remainingProps_arr;
                    var nextProperty_remaining_props_str = JSON.stringify(nextProperty_remaining_props_arr,null,4);
                    // console.log("nextProperty_remaining_props_str: "+nextProperty_remaining_props_str)
                    addSeedProps_numCycles++;
                    if (addSeedProps_numCycles < 5) { continueAddingSeedProps_type1 = true; }
                }
            } while (continueAddingSeedProps_type1)

            remainingProps[nextNode_slug] = JSON.parse(JSON.stringify(nextProperty_remaining_props_arr));

            // for the remaining props:
            // if the required hasKey property already exists, account for property by using a one-step relationship :
            // -- addPropertyValue, field: [unaccounded for value] --
            // if hasKey does not already exist, create it using 2-step relationship; first relationship:
            // propertiesFor[wordType]_hasKey -- addPropertyKey, field: [unaccounted for field] -- new property of type: hasKey
            // and second rel like the one above using addPropertyValue

            var properties_hasKey_rF_obj = lookupRawFileBySlug_obj.edited.properties_hasKey;
            var properties_hasKey_arr = properties_hasKey_rF_obj.globalDynamicData.specificInstances;
            var numPropNodesHK = properties_hasKey_arr.length;

            var numRemainingProps = nextProperty_remaining_props_arr.length;
            // console.log("QWERTY nextNode_slug: "+nextNode_slug+"; numRemainingProps: "+numRemainingProps)
            for (var n=0;n<numRemainingProps;n++) {
                var nextProp_obj = nextProperty_remaining_props_arr[n];
                var nextProp_str = JSON.stringify(nextProp_obj,null,4);
                // console.log("QWERTY: nextProp_str"+nextProp_str)
                for (var h=0;h<numPropNodesHK;h++) {
                    var nextPropHK_slug = properties_hasKey_arr[h];
                    var nextPropHK_rF_obj = lookupRawFileBySlug_obj.edited[nextPropHK_slug];
                    var nextPropHK_props_arr = nextPropHK_rF_obj.propertyData.conceptGraphStyle.props;
                    var numProps = nextPropHK_props_arr.length; // there should be only one
                    if (numProps==1) {
                        var soleProp_obj = nextPropHK_props_arr[0];
                        // soleProp_obj.value should be null if this is properly formatted
                        if ((soleProp_obj.key==nextProp_obj.key) && (soleProp_obj.value==null)) {
                            // one-step relationship as described above
                            var oneStepRel_obj = {};
                            oneStepRel_obj.nodeFrom = {};
                            oneStepRel_obj.relationshipType = {};
                            oneStepRel_obj.nodeTo = {};
                            oneStepRel_obj.nodeFrom.slug = nextPropHK_slug;
                            oneStepRel_obj.relationshipType.slug = "addPropertyValue";
                            oneStepRel_obj.relationshipType.addPropertyValueData = {};
                            oneStepRel_obj.relationshipType.addPropertyValueData.field = nextProp_obj.value;
                            oneStepRel_obj.nodeTo.slug = nextNode_slug;
                        }
                    }
                    var oneStepRel_str = JSON.stringify(oneStepRel_obj,null,4);
                    // console.log("QWERTY: oneStepRel_str: "+oneStepRel_str)

                    var propertySchema_slug = jQuery("#conceptSelector_propSchemaAutoBuild option:selected").data("propertyschemaslug");
                    var propertySchema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[propertySchema_slug]));
                    var propertySchema_updated_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_rF_obj,oneStepRel_obj,lookupRawFileBySlug_obj);
                    var propertySchema_updated_rF_str = JSON.stringify(propertySchema_updated_rF_obj,null,4)
                    jQuery("#editedPropertySchema_propSchemaAutoBuild_rawFile").val(propertySchema_updated_rF_str);
                    jQuery("#editedPropertySchema_propSchemaAutoBuild_rawFile").html(propertySchema_updated_rF_str);
                    lookupRawFileBySlug_obj[propertySchema_slug] = JSON.parse(JSON.stringify(propertySchema_updated_rF_obj));
                    lookupRawFileBySlug_obj.edited[propertySchema_slug] = JSON.parse(JSON.stringify(propertySchema_updated_rF_obj));

                }
            }
        }
    }
}

async function propSchemaAutoBuild__processProperties() {
    // console.log("propSchemaAutoBuild__processProperties");
    var selectedJSONSchema_rF_str = jQuery("#selectedJSONSchema_current_rawFile").val();
    var selectedJSONSchema_rF_obj = JSON.parse(selectedJSONSchema_rF_str);
    var properties_obj = selectedJSONSchema_rF_obj.properties;
    var propDepth = 0;
    var currentPath = "";
    var parentProp_slug = "";
    // STEP 1:
    await processProperties(parentProp_slug,properties_obj,propDepth,currentPath)
    // STEP 2: Cycle through each property; look at props; reverse engineer props using:
    // propagateProperty, in the largest chunks possible
    // addPropertyValue
    // addPropertyField
    // might need to call Step 2 after processProperties is finished ... ?

}

var lookupKeynameBySlug_obj = {};

// outputs a new word_obj with the provided slug and of the provided wordType
async function makeNewWord_propSchemaAutoBuildPage(newWord_slug,newWord_wordType) {
    var newWord_obj = JSON.parse(JSON.stringify(templatesByWordType_obj[newWord_wordType]));
    newWord_obj.wordData.slug = newWord_slug;

    var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
    var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");
    newWord_obj.globalDynamicData.myDictionaries.push(myDictionary);
    newWord_obj.globalDynamicData.myConceptGraphs.push(myConceptGraph);

    var currentTime = Date.now();
    var newKeyname = "dictionaryWord_"+newWord_slug+"_"+currentTime;
    var generatedKey_obj = await ipfs.key.gen(newKeyname, {
        type: 'rsa',
        size: 2048
    })
    var newWord_ipns = generatedKey_obj["id"];
    var generatedKey_name = generatedKey_obj["name"];
    // console.log("generatedKey_obj id: "+newWord_ipns+"; name: "+generatedKey_name);
    newWord_obj.metaData.ipns = newWord_ipns;

    lookupRawFileBySlug_obj[newWord_slug] = JSON.parse(JSON.stringify(newWord_obj));
    lookupRawFileBySlug_obj.edited[newWord_slug] = JSON.parse(JSON.stringify(newWord_obj));

    lookupKeynameBySlug_obj[newWord_slug] = newKeyname;

    var newWord_str = JSON.stringify(newWord_obj,null,4);
    // console.log("newWord_str: "+newWord_str);
    return newWord_obj;
}

async function createStructureForPropertySchema(propertySchema_slug) {
    lookupKeynameBySlug_obj = {};

    var propertySchema_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[propertySchema_slug]));
    var propertySchema_rF_str = JSON.stringify(propertySchema_rF_obj,null,4);
    // console.log("propertySchema_rF_str: "+propertySchema_rF_str);
    // first add propertiesFor[thisSchema], assuming it already exists and has been added to the governing concept
    var governingConcept_slug = propertySchema_rF_obj.schemaData.metaData.governingConcept.slug;
    var governingConcept_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[governingConcept_slug]));
    var governingConcept_properties_slug = governingConcept_rF_obj.conceptData.nodes.properties.slug;
    var governingConcept_wordTpe_slug = governingConcept_rF_obj.conceptData.nodes.wordType.slug;
    // console.log("governingConcept_properties_slug: "+governingConcept_properties_slug);
    propertySchema_rF_obj = MiscFunctions.updateSchemaWithNewNode(propertySchema_rF_obj,governingConcept_properties_slug,lookupRawFileBySlug_obj);

    // next add standard properties subsets if they do not already exist

    var nextRel_obj = {};
    nextRel_obj.nodeFrom = {};
    nextRel_obj.relationshipType = {};
    nextRel_obj.nodeTo = {};
    nextRel_obj.relationshipType.slug="subsetOf";
    nextRel_obj.nodeTo.slug=governingConcept_properties_slug;

    var doesWordExist = [];
    doesWordExist.hasKey = false;
    doesWordExist.type0 = false;
    doesWordExist.type1 = false;
    doesWordExist.type2 = false;
    doesWordExist.type3 = false;
    doesWordExist.primaryProperty = false;

    var properties_hasKey_slug = governingConcept_properties_slug+"_hasKey";
    if (lookupRawFileBySlug_obj.hasOwnProperty(properties_hasKey_slug)) { doesWordExist.hasKey = true; }
    if (!doesWordExist.hasKey) {
        var properties_hasKey_title = "Properties for "+governingConcept_wordTpe_slug+": HasKey";
        var properties_hasKey_name = "properties for "+governingConcept_wordTpe_slug+": hasKey";
        var properties_hasKey_rF_obj = await makeNewWord_propSchemaAutoBuildPage(properties_hasKey_slug,"set");
        properties_hasKey_rF_obj.setData.name = properties_hasKey_name;
        properties_hasKey_rF_obj.wordData.name = properties_hasKey_name;
        properties_hasKey_rF_obj.setData.title = properties_hasKey_title;
        properties_hasKey_rF_obj.wordData.title = properties_hasKey_title;
        properties_hasKey_rF_obj.setData.metaData.types.push("properties_hasKey");
        lookupRawFileBySlug_obj.edited[properties_hasKey_slug] = JSON.parse(JSON.stringify(properties_hasKey_rF_obj));
        var nextRel_hK_obj = JSON.parse(JSON.stringify(nextRel_obj));
        nextRel_hK_obj.nodeFrom.slug = properties_hasKey_slug;
        propertySchema_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_rF_obj,nextRel_hK_obj,lookupRawFileBySlug_obj);
    }


    var properties_type0_slug = governingConcept_properties_slug+"_type0";
    if (lookupRawFileBySlug_obj.hasOwnProperty(properties_type0_slug)) { doesWordExist.type0 = true; }
    if (!doesWordExist.type0) {
        var properties_type0_title = "Properties for "+governingConcept_wordTpe_slug+": Type0";
        var properties_type0_name = "properties for "+governingConcept_wordTpe_slug+": type0";
        var properties_type0_rF_obj = await makeNewWord_propSchemaAutoBuildPage(properties_type0_slug,"set");
        properties_type0_rF_obj.setData.name = properties_type0_name;
        properties_type0_rF_obj.wordData.name = properties_type0_name;
        properties_type0_rF_obj.setData.title = properties_type0_title;
        properties_type0_rF_obj.wordData.title = properties_type0_title;
        properties_type0_rF_obj.setData.metaData.types.push("properties_type0");
        lookupRawFileBySlug_obj.edited[properties_type0_slug] = JSON.parse(JSON.stringify(properties_type0_rF_obj));
        var nextRel_t0_obj = JSON.parse(JSON.stringify(nextRel_obj));
        nextRel_t0_obj.nodeFrom.slug = properties_type0_slug;
        propertySchema_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_rF_obj,nextRel_t0_obj,lookupRawFileBySlug_obj);
    }


    var properties_type1_slug = governingConcept_properties_slug+"_type1";
    if (lookupRawFileBySlug_obj.hasOwnProperty(properties_type1_slug)) { doesWordExist.type1 = true; }
    if (!doesWordExist.type1) {
        var properties_type1_title = "Properties for "+governingConcept_wordTpe_slug+": Type1";
        var properties_type1_name = "properties for "+governingConcept_wordTpe_slug+": type1";
        var properties_type1_rF_obj = await makeNewWord_propSchemaAutoBuildPage(properties_type1_slug,"set");
        properties_type1_rF_obj.setData.name = properties_type1_name;
        properties_type1_rF_obj.wordData.name = properties_type1_name;
        properties_type1_rF_obj.setData.title = properties_type1_title;
        properties_type1_rF_obj.wordData.title = properties_type1_title;
        properties_type1_rF_obj.setData.metaData.types.push("properties_type1");
        lookupRawFileBySlug_obj.edited[properties_type1_slug] = JSON.parse(JSON.stringify(properties_type1_rF_obj));
        var nextRel_t1_obj = JSON.parse(JSON.stringify(nextRel_obj));
        nextRel_t1_obj.nodeFrom.slug = properties_type1_slug;
        propertySchema_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_rF_obj,nextRel_t1_obj,lookupRawFileBySlug_obj);
    }


    var properties_type2_slug = governingConcept_properties_slug+"_type2";
    if (lookupRawFileBySlug_obj.hasOwnProperty(properties_type2_slug)) { doesWordExist.type2 = true; }
    if (!doesWordExist.type2) {
        var properties_type2_title = "Properties for "+governingConcept_wordTpe_slug+": Type2";
        var properties_type2_name = "properties for "+governingConcept_wordTpe_slug+": type2";
        var properties_type2_rF_obj = await makeNewWord_propSchemaAutoBuildPage(properties_type2_slug,"set");
        properties_type2_rF_obj.setData.name = properties_type2_name;
        properties_type2_rF_obj.wordData.name = properties_type2_name;
        properties_type2_rF_obj.setData.title = properties_type2_title;
        properties_type2_rF_obj.wordData.title = properties_type2_title;
        properties_type2_rF_obj.setData.metaData.types.push("properties_type2");
        lookupRawFileBySlug_obj.edited[properties_type2_slug] = JSON.parse(JSON.stringify(properties_type2_rF_obj));
        var nextRel_t2_obj = JSON.parse(JSON.stringify(nextRel_obj));
        nextRel_t2_obj.nodeFrom.slug = properties_type2_slug;
        propertySchema_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_rF_obj,nextRel_t2_obj,lookupRawFileBySlug_obj);
    }


    var properties_type3_slug = governingConcept_properties_slug+"_type3";
    if (lookupRawFileBySlug_obj.hasOwnProperty(properties_type3_slug)) { doesWordExist.type3 = true; }
    if (!doesWordExist.type3) {
        var properties_type3_title = "Properties for "+governingConcept_wordTpe_slug+": Type3";
        var properties_type3_name = "properties for "+governingConcept_wordTpe_slug+": type3";
        var properties_type3_rF_obj = await makeNewWord_propSchemaAutoBuildPage(properties_type3_slug,"set");
        properties_type3_rF_obj.setData.name = properties_type3_name;
        properties_type3_rF_obj.wordData.name = properties_type3_name;
        properties_type3_rF_obj.setData.title = properties_type3_title;
        properties_type3_rF_obj.wordData.title = properties_type3_title;
        properties_type3_rF_obj.setData.metaData.types.push("properties_type3");
        lookupRawFileBySlug_obj.edited[properties_type3_slug] = JSON.parse(JSON.stringify(properties_type3_rF_obj));
        var nextRel_t3_obj = JSON.parse(JSON.stringify(nextRel_obj));
        nextRel_t3_obj.nodeFrom.slug = properties_type3_slug;
        propertySchema_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_rF_obj,nextRel_t3_obj,lookupRawFileBySlug_obj);
    }


    var primaryProperty_slug = "primaryPropertyFor"+governingConcept_wordTpe_slug.substr(0,1).toUpperCase()+governingConcept_wordTpe_slug.substr(1);
    if (lookupRawFileBySlug_obj.hasOwnProperty(primaryProperty_slug)) { doesWordExist.primaryProperty = true; }
    if (doesWordExist.primaryProperty) {
        var primaryProperty_rF_obj = lookupRawFileBySlug_obj[primaryProperty_slug];
    } else {
        var primaryProperty_rF_obj = await makeNewWord_propSchemaAutoBuildPage(primaryProperty_slug,"property");
    }
    var primaryProperty_title = "Primary Property for "+governingConcept_wordTpe_slug;
    var primaryProperty_name = "primary property for "+governingConcept_wordTpe_slug;
    primaryProperty_rF_obj.wordData.slug = primaryProperty_slug;
    primaryProperty_rF_obj.wordData.title = primaryProperty_title;
    primaryProperty_rF_obj.wordData.name = primaryProperty_name;
    primaryProperty_rF_obj.propertyData.type = "type3";
    primaryProperty_rF_obj.propertyData.types = MiscFunctions.pushIfNotAlreadyThere(primaryProperty_rF_obj.propertyData.types,"type3");
    primaryProperty_rF_obj.propertyData.JSONSchemaStyle.key = governingConcept_wordTpe_slug+"Data";
    primaryProperty_rF_obj.propertyData.metaData.parentConcept = governingConcept_slug;
    primaryProperty_rF_obj.propertyData.metaData.parentConcepts = MiscFunctions.pushIfNotAlreadyThere(primaryProperty_rF_obj.propertyData.metaData.parentConcepts,governingConcept_slug)
    primaryProperty_rF_obj.propertyData.metaData.type = "primaryProperty";
    primaryProperty_rF_obj.propertyData.metaData.types = MiscFunctions.pushIfNotAlreadyThere(primaryProperty_rF_obj.propertyData.metaData.types,"primaryProperty");
    lookupRawFileBySlug_obj.edited[primaryProperty_slug] = JSON.parse(JSON.stringify(primaryProperty_rF_obj));
    var nextRel_pP_obj = JSON.parse(JSON.stringify(nextRel_obj));
    nextRel_pP_obj.nodeFrom.slug = primaryProperty_slug;
    nextRel_pP_obj.relationshipType.slug = "isASpecificInstanceOf";
    nextRel_pP_obj.nodeTo.slug = properties_type3_slug;
    propertySchema_rF_obj = MiscFunctions.updateSchemaWithNewRel(propertySchema_rF_obj,nextRel_pP_obj,lookupRawFileBySlug_obj);


    lookupRawFileBySlug_obj.edited[propertySchema_slug] = JSON.parse(JSON.stringify(propertySchema_rF_obj));
    var propertySchema_rF_str = JSON.stringify(propertySchema_rF_obj,null,4)
    jQuery("#editedPropertySchema_propSchemaAutoBuild_rawFile").html(propertySchema_rF_str);
    jQuery("#editedPropertySchema_propSchemaAutoBuild_rawFile").val(propertySchema_rF_str);
}

function updatePropertySchemaIncludingSubsets() {
    var propSchema_updated_rF_str = jQuery("#editedPropertySchema_propSchemaAutoBuild_rawFile").val();
    var propSchema_updated_rF_obj = JSON.parse(propSchema_updated_rF_str);
    var proSchema_slug = propSchema_updated_rF_obj.wordData.slug;
    // console.log("updatePropertySchemaIncludingSubsets; proSchema_slug: "+proSchema_slug+"; propSchema_updated_rF_str: "+propSchema_updated_rF_str);

    var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
    var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");

    var nextNode_keyname = "__UNKNOWN__";
    insertOrUpdateWordIntoMyConceptGraphAndMyDictionary(propSchema_updated_rF_str,nextNode_keyname,myConceptGraph,myDictionary)

    var nodes_arr = propSchema_updated_rF_obj.schemaData.nodes;
    var numNodes = nodes_arr.length;
    for (var n=0;n<numNodes;n++) {
        var nextNode_obj = nodes_arr[n];
        var nextNode_slug = nextNode_obj.slug;
        var nextNode_rF_obj = lookupRawFileBySlug_obj.edited[nextNode_slug];
        var nextNode_rF_str = JSON.stringify(nextNode_rF_obj,null,4);
        nextNode_keyname = "__UNKNOWN__";
        if (lookupKeynameBySlug_obj.hasOwnProperty(nextNode_slug)) {
            nextNode_keyname = lookupKeynameBySlug_obj[nextNode_slug];
        }
        // console.log("nextNode_slug: "+nextNode_slug+"; nextNode_keyname: "+nextNode_keyname+"; nextNode_rF_str: "+nextNode_rF_str);
        insertOrUpdateWordIntoMyConceptGraphAndMyDictionary(nextNode_rF_str,nextNode_keyname,myConceptGraph,myDictionary)
    }

}


export default class PropertySchemaAutoBuild extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        createSelectors_propSchemaAutoBuild();
        jQuery("#propSchemaAutoBuild__processPropertiesButton").click(function(){
            propSchemaAutoBuild__processProperties()
        })
        jQuery("#propSchemaAutoBuild__processPropsButton").click(function(){
            processProps()
        })
        jQuery("#showCurrentPropertySchemaRawFile_propSchemaAutoBuild_Button").click(function(){
            // console.log("showCurrentPropertySchemaRawFile_propSchemaAutoBuild_Button")
            jQuery(".toggleButtonsPropertySchemas").css("backgroundColor","grey")
            jQuery(".containersPropertySchemas").css("display","none")
            jQuery("#showCurrentPropertySchemaRawFile_propSchemaAutoBuild_Button").css("backgroundColor","green")
            jQuery("#currentPropertySchema_propSchemaAutoBuild_rawFile").css("display","block")
        })
        jQuery("#showEditedPropertySchemaRawFile_propSchemaAutoBuild_Button").click(function(){
            // console.log("showEditedPropertySchemaRawFile_propSchemaAutoBuild_Button")
            jQuery(".toggleButtonsPropertySchemas").css("backgroundColor","grey")
            jQuery(".containersPropertySchemas").css("display","none")
            jQuery("#showEditedPropertySchemaRawFile_propSchemaAutoBuild_Button").css("backgroundColor","green")
            jQuery("#editedPropertySchema_propSchemaAutoBuild_rawFile").css("display","block")
        })
        jQuery("#showEditedPropertySchemaGraph_propSchemaAutoBuild_Button").click(function(){
            // console.log("showEditedPropertySchemaGraph_propSchemaAutoBuild_Button")
            jQuery(".toggleButtonsPropertySchemas").css("backgroundColor","grey")
            jQuery(".containersPropertySchemas").css("display","none")
            jQuery("#showEditedPropertySchemaGraph_propSchemaAutoBuild_Button").css("backgroundColor","green")
            jQuery("#editedPropertySchemaGraph_propSchemaAutoBuild").css("display","block")
            // var propertyTreeSchemaSlug = jQuery("#propertyTreeSchemaSlug").data("slug");
            var selectedPropertySchema_slug = jQuery("#conceptSelector_propSchemaAutoBuild option:selected").data("propertyschemaslug");
            var networkElemID = "editedPropertySchemaGraph_propSchemaAutoBuild";
            VisjsFunctions.makeVisGraph_propertySchema(selectedPropertySchema_slug,networkElemID);
        })

        jQuery("#showCurrentJSONSchemaRawFile_propSchemaAutoBuild_Button").click(function(){
            // console.log("showCurrentJSONSchemaRawFile_propSchemaAutoBuild_Button")
            jQuery(".toggleButtonsJSONSchemas").css("backgroundColor","grey")
            jQuery(".containersJSONSchemas").css("display","none")
            jQuery("#showCurrentJSONSchemaRawFile_propSchemaAutoBuild_Button").css("backgroundColor","green")
            jQuery("#selectedJSONSchema_current_rawFile").css("display","block")
        })
        jQuery("#showEditedJSONSchemaRawFile_propSchemaAutoBuild_Button").click(function(){
            // console.log("showEditedJSONSchemaRawFile_propSchemaAutoBuild_Button")
            jQuery(".toggleButtonsJSONSchemas").css("backgroundColor","grey")
            jQuery(".containersJSONSchemas").css("display","none")
            jQuery("#showEditedJSONSchemaRawFile_propSchemaAutoBuild_Button").css("backgroundColor","green")
            jQuery("#selectedJSONSchema_edited_rawFile").css("display","block")
        });

        /*
        jQuery("#updatePropertySchema_propSchemaAutoBuild_Button").click(function(){
            var editedPropertySchema_rF_str = jQuery("#editedPropertySchema_propSchemaAutoBuild_rawFile").val();
            var editedPropertySchema_rF_obj = JSON.stringify(editedPropertySchema_rF_str,null,4);
            // console.log("updatePropertySchema_propSchemaAutoBuild_Button; editedPropertySchema_rF_str: "+editedPropertySchema_rF_str)
            // MiscFunctions.updateWordInAllTables(editedPropertySchema_rF_obj);
        });
        */

        jQuery("#processForwardButton").click(function(){
            // console.log("processForwardButton")
            PropertyFormationFunctions.processForward_highlightedNode();
        });

        jQuery("#showHighlightedUneditedButton").click(function(){
            // console.log("showHighlightedUneditedButton")
            if (highlightedNode_slug) {
                var highlightedNode_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj[highlightedNode_slug]));
                var highlightedNode_rF_str = JSON.stringify(highlightedNode_rF_obj,null,4);
                jQuery("#visJsDisplay1").css("display","block");
                jQuery("#visJsDisplay1").html(highlightedNode_rF_str);
                jQuery("#visJsDisplay1").val(highlightedNode_rF_str);
            }
        });

        jQuery("#showHighlightedEditedButton").click(function(){
            // console.log("showHighlightedEditedButton")
            if (highlightedNode_slug) {
                var highlightedNode_rF_obj = JSON.parse(JSON.stringify(lookupRawFileBySlug_obj.edited[highlightedNode_slug]));
                var highlightedNode_rF_str = JSON.stringify(highlightedNode_rF_obj,null,4);
                jQuery("#visJsDisplay1").css("display","block");
                jQuery("#visJsDisplay1").html(highlightedNode_rF_str);
                jQuery("#visJsDisplay1").val(highlightedNode_rF_str);
            }
        });

        jQuery("#updatePropertyNodes_propSchemaAutoBuild_Button").click(function(){
            var numNewProperties = newProperties_arr.length;
            for (var n=0;n<numNewProperties;n++) {
                var nextNodeToUpdate_slug = newProperties_arr[n];
                var nextNodeToUpdate_str = jQuery("#newProperty_rF_"+nextNodeToUpdate_slug).val();
                var nextNodeToUpdate_obj = JSON.parse(nextNodeToUpdate_str);
                // console.log("updatePropertyNodes_propSchemaAutoBuild_Button; nextNodeToUpdate_str: "+nextNodeToUpdate_str)
                // MiscFunctions.updateWordInAllTables(nextNodeToUpdate_obj);
            }
        });
        jQuery("#createStructureForPropertySchemaButton").click(function(){
            // console.log("createStructureForPropertySchemaButton clicked")
            var selectedPropertySchema_slug = jQuery("#conceptSelector_propSchemaAutoBuild option:selected").data("propertyschemaslug");
            createStructureForPropertySchema(selectedPropertySchema_slug);
        });
        jQuery("#updatePropertySchemaIncludingSubsetsButton").click(function(){
            // console.log("updatePropertySchemaIncludingSubsetsButton clicked")
            updatePropertySchemaIncludingSubsets()
        });
        jQuery("#populateRequiredDefsListsButton").click(function(){
            // console.log("populateRequiredDefsListsButton clicked")
            var selectedPropertySchema_slug = jQuery("#conceptSelector_propSchemaAutoBuild option:selected").data("propertyschemaslug");
            PropertyFormationFunctions.populatePropertyRequiredDefinitionsLists(selectedPropertySchema_slug)
        });

        jQuery("#rebuildJSONSchemaDefinitionsButton").click(function(){
            // console.log("rebuildJSONSchemaDefinitionsButton clicked")
            var selectedPropertySchema_slug = jQuery("#conceptSelector_propSchemaAutoBuild option:selected").data("propertyschemaslug");
            var selectedJSONSchema_slug = jQuery("#conceptSelector_propSchemaAutoBuild option:selected").data("jsonschemaslug");
            PropertyFormationFunctions.rebuildJSONSchemaDefinitions(selectedJSONSchema_slug);
        });

        jQuery("#miscBUTTON").click(function(){
            // console.log("miscBUTTON clicked")
        });

    }
    state = {
    }
    render() {
        return (
            <>
                <center>Property Schema Auto Build</center>
                Pick a concept; generate propertySchema for the concept; input JSON Schema manually or take concept's JSON Schema to do this
                <br/>
                <fieldset style={{display:"inline-block",width:"400px",border:"1px solid black",padding:"5px",verticalAlign:"top"}} >
                    select the concept to edit:
                    <div id="conceptSelector_propSchemaAutoBuild_Container" >conceptSelector_propSchemaAutoBuild_Container</div>
                    properties: <div style={{display:"inline-block"}} id="propertiesForSelectedConceptContainer">propertiesForSelectedConceptContainer</div>
                    <br/>
                    edit JSON Schema: process reverse ("explode" from JSON Schema all the way backwards)
                    <div className="doSomethingButton" id="propSchemaAutoBuild__processPropertiesButton" >process property (explode)</div>
                    <div className="doSomethingButton" id="propSchemaAutoBuild__processPropsButton" >process props (explode)</div>
                    <div className="doSomethingButton" id="propSchemaAutoBuild__definitionsButton" >definitions</div>

                    <br/>
                    unexploded input JSON Schema:<br/>
                    <div className="doSomethingButton toggleButtonsJSONSchemas" id="showCurrentJSONSchemaRawFile_propSchemaAutoBuild_Button">current</div>
                    <div className="doSomethingButton toggleButtonsJSONSchemas" id="showEditedJSONSchemaRawFile_propSchemaAutoBuild_Button">edited</div>
                    <center>
                        <textarea className="containersJSONSchemas" id="selectedJSONSchema_current_rawFile" style={{width:"95%",height:"800px"}} ></textarea>
                        <textarea className="containersJSONSchemas" id="selectedJSONSchema_edited_rawFile" style={{width:"95%",height:"800px",display:"none"}} ></textarea>
                    </center>
                </fieldset>

                <fieldset style={{display:"inline-block",width:"550px",border:"1px solid black",padding:"5px",verticalAlign:"top"}} >
                    <center>Property Schema</center>
                    continue reverse processing (explode):
                    <div className="doSomethingButton" id="createStructureForPropertySchemaButton" >create propertySchema infrastructure</div>
                    <div className="doSomethingButton" id="updatePropertySchemaIncludingSubsetsButton" >Add/Edit propertySchema to SQL (including subsets)</div>
                    <br/>
                    show rawFile:
                    <div className="doSomethingButton toggleButtonsPropertySchemas" id="showCurrentPropertySchemaRawFile_propSchemaAutoBuild_Button">current</div>
                    <div className="doSomethingButton toggleButtonsPropertySchemas" id="showEditedPropertySchemaRawFile_propSchemaAutoBuild_Button">edited</div>
                    show graph:
                    <div className="doSomethingButton toggleButtonsPropertySchemas" id="showEditedPropertySchemaGraph_propSchemaAutoBuild_Button">show</div>
                    <br/>
                    <div className="doSomethingButton" id="processForwardButton">process forward</div>
                    show highlighted node JSON:
                    <div className="doSomethingButton" id="showHighlightedUneditedButton">unedited</div>
                    <div className="doSomethingButton" id="showHighlightedEditedButton">edited</div>
                    <br/>
                    <div className="doSomethingButton" id="populateRequiredDefsListsButton">populate req. defs lists</div>
                    <br/>
                    <div style={{display:"inline-block",width:"200px",fontSize:"10px"}}>rebuild definitions in JSON Schema assuming primaryProperty and all dependent properties have been established</div>
                    <div className="doSomethingButton" id="rebuildJSONSchemaDefinitionsButton">go</div>
                    <center>
                        <div style={{width:"95%",height:"800px"}} className="containersPropertySchemas" id="editedPropertySchemaGraph_propSchemaAutoBuild">editedPropertySchemaGraph_propSchemaAutoBuild</div>
                        <textarea className="containersPropertySchemas" id="currentPropertySchema_propSchemaAutoBuild_rawFile" style={{width:"95%",height:"800px"}} >current</textarea>
                        <textarea className="containersPropertySchemas" id="editedPropertySchema_propSchemaAutoBuild_rawFile" style={{width:"95%",height:"800px",display:"none"}} >edited</textarea>
                    </center>
                </fieldset>

                <fieldset style={{display:"inline-block",width:"550px",border:"1px solid black",padding:"5px",verticalAlign:"top"}} >
                    visjs display:
                    <textarea id="visJsDisplay1" style={{width:"95%",height:"800px",display:"none"}} ></textarea>
                    Properties:
                    <div id="propertySlugsContainer" ></div>
                    <div className="doSomethingButton" id="updatePropertyNodes_propSchemaAutoBuild_Button">Add/Update Property Nodes</div>
                    <div id="propertyRawFilesContainer" ></div>
                </fieldset>
            </>
        );
    }
}
