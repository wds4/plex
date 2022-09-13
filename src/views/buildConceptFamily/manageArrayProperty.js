import React from "react";
import IpfsHttpClient from 'ipfs-http-client';
import ReactDOM from 'react-dom';
import sendAsync from '../../renderer';
import { lookupRawFileBySlug_obj, templatesByWordType_obj, insertOrUpdateWordIntoMyDictionary, insertOrUpdateWordIntoMyConceptGraph } from '../addANewConcept';
import * as MiscFunctions from '../../lib/miscFunctions.js';
const jQuery = require("jquery");

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

async function createEnumerationLinkageRel_map() {
    var rel_obj = MiscFunctions.blankRel_obj();
    var okToUpdateSchema = true;
    rel_obj.relationshipType.slug = "populatesArray";
    rel_obj.relationshipType.populatesArrayData = {};
    rel_obj.relationshipType.populatesArrayData.field = jQuery("#enumerationRelField_map").val();
    if (jQuery("#enumerationSelector_map option:selected").data("slug")) {
        rel_obj.nodeFrom.slug = jQuery("#enumerationSelector_map option:selected").data("slug");
    } else {
        rel_obj.nodeFrom.slug = "enumeration slug not available";
        okToUpdateSchema = false;
    }
    if (jQuery("#propertySelector2_map option:selected").data("propertyslug")) {
        rel_obj.nodeTo.slug = jQuery("#propertySelector2_map option:selected").data("propertyslug");
    } else {
        rel_obj.nodeTo.slug = "property slug not available";
        okToUpdateSchema = false;
    }

    var rel_str = JSON.stringify(rel_obj,null,4);
    jQuery("#newEnumerationRel_map").val(rel_str);

    // now adjust the edited version of schemaForProperties
    var schemaForProperties_rF_str = jQuery("#uneditedSchemaForProperties_rawFile").val();
    var schemaForProperties_rF_obj = JSON.parse(schemaForProperties_rF_str);
    // schemaForProperties_rF_obj.wordData.a="b";
    if (okToUpdateSchema) {
        var schemaForProperties_updated_rF_obj = await MiscFunctions.updateSchemaWithNewRel(schemaForProperties_rF_obj,rel_obj,lookupRawFileBySlug_obj)
        var schemaForProperties_updated_rF_str = JSON.stringify(schemaForProperties_updated_rF_obj,null,4);
        jQuery("#editedSchemaForProperties_rawFile").val(schemaForProperties_updated_rF_str);
    }
}

function addPropertiesOfThisSet_map(nextPropType,whichPropertySelector) {
    if (whichPropertySelector==1) {
        var selectedConcept_wordType_slug = jQuery("#conceptSelector1_map option:selected").data("thisconceptwordtypeslug");
    }
    if (whichPropertySelector==2) {
        var selectedConcept_wordType_slug = jQuery("#conceptSelector2_map option:selected").data("thisconceptwordtypeslug");
    }
    var propertySelectorHTML = "";
    if (selectedConcept_wordType_slug !== undefined) {
        var propertySet_slug = "propertiesFor"+selectedConcept_wordType_slug.substr(0,1).toUpperCase()+selectedConcept_wordType_slug.substr(1)+"_"+nextPropType;
        console.log("propertySet_slug: "+propertySet_slug)
        if (lookupRawFileBySlug_obj.hasOwnProperty(propertySet_slug)) {
            var propertySet_rF_obj = lookupRawFileBySlug_obj[propertySet_slug];
            var properties_specificInstances_arr = propertySet_rF_obj.globalDynamicData.specificInstances;
            var numSpecificInstances = properties_specificInstances_arr.length;
            for (var s=0;s<numSpecificInstances;s++) {
                var nextSpecificInstance_slug = properties_specificInstances_arr[s];
                var nextPropTitle = "";
                if (lookupRawFileBySlug_obj.hasOwnProperty(nextSpecificInstance_slug)) {
                    var nextSpecificInstance_rF_obj = lookupRawFileBySlug_obj[nextSpecificInstance_slug];
                    if (nextSpecificInstance_rF_obj.propertyData.hasOwnProperty("title")) {
                        nextPropTitle = nextSpecificInstance_rF_obj.propertyData.title;
                    }
                }
                console.log("nextSpecificInstance_slug: "+nextSpecificInstance_slug)
                propertySelectorHTML += "<option ";
                propertySelectorHTML += " data-propertyslug='"+nextSpecificInstance_slug+"' ";
                propertySelectorHTML += " data-propertytitle='"+nextPropTitle+"' ";
                propertySelectorHTML += " >";
                propertySelectorHTML += "("+nextPropType+") ";
                propertySelectorHTML += nextSpecificInstance_slug;
                propertySelectorHTML += " ("+nextPropTitle+") ";
                propertySelectorHTML += "</option>";
            }
        }
    }
    return propertySelectorHTML;
}

function createPropertySelectors_map() {
    var primaryProperty1_slug = jQuery("#conceptSelector1_map option:selected").data("thisconceptprimarypropertyslug");
    var propertySchema2_slug = jQuery("#conceptSelector2_map option:selected").data("thisconceptpropertyschemaslug");
    // var primaryProperty2_slug = jQuery("#conceptSelector2_map option:selected").data("thisconceptprimarypropertyslug");
    // propertySelector1 is the list of all object properties; it is what the new array property gets added to
    // propertySelector2 is the list of all array properties; enumeration gets linked to one of these (in Step 2)
    var propertySelector1HTML = "";
    var propertySelector2HTML = "";
    propertySelector1HTML += "<select id=propertySelector1_map>";
    propertySelector2HTML += "<select id=propertySelector2_map>";

    // first make propertySelector1
    propertySelector1HTML += "<option select=selected ";
    propertySelector1HTML += " data-propertyslug='"+primaryProperty1_slug+"' ";
    propertySelector1HTML += " >";
    propertySelector1HTML += "(primaryProperty) ";
    propertySelector1HTML += primaryProperty1_slug;
    propertySelector1HTML += "</option>";

    var nextPropType = "object_1property";
    propertySelector1HTML += addPropertiesOfThisSet_map(nextPropType,1);

    var nextPropType = "object_multiProperties";
    propertySelector1HTML += addPropertiesOfThisSet_map(nextPropType,1);

    var nextPropType = "object_dependencies";
    propertySelector1HTML += addPropertiesOfThisSet_map(nextPropType,1);

    // next, make propertySelector2
    var nextPropType = "array";
    propertySelector2HTML += addPropertiesOfThisSet_map(nextPropType,2);

    // ??? future:
    // var nextPropType = "array_string";
    // propertySelectorHTML += addPropertiesOfThisSet_map(nextPropType);

    propertySelector1HTML += "</select>";
    propertySelector2HTML += "</select>";

    jQuery("#propertySelector1Container_map").html(propertySelector1HTML);
    jQuery("#propertySelector2Container_map").html(propertySelector2HTML);

    console.log("propertySchema2_slug: "+propertySchema2_slug)
    var schemaForProperties_rF_obj = lookupRawFileBySlug_obj[propertySchema2_slug]
    var schemaForProperties_rF_str = JSON.stringify(schemaForProperties_rF_obj,null,4)
    jQuery("#uneditedSchemaForProperties_rawFile").val(schemaForProperties_rF_str);

    createEnumerationLinkageRel_map();
    jQuery("#propertySelector2_map").change(function(){
        createEnumerationLinkageRel_map();
    });
}

function createConceptSelector_map() {
    var currentConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
    var sql = "";
    sql += " SELECT * FROM "+currentConceptGraph_tableName;

    sendAsync(sql).then((words_arr) => {
        var conceptSelector1HTML = "";
        conceptSelector1HTML += "<select id=conceptSelector1_map >";
        var conceptSelector2HTML = "";
        conceptSelector2HTML += "<select id=conceptSelector2_map >";

        var enumerationSelectorHTML = "";
        enumerationSelectorHTML += "<select id=enumerationSelector_map >";

        var numWords = words_arr.length;
        var ind=0;
        for (var w=0;w<numWords;w++) {
            var nextWord_str = words_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_wordTypes = nextWord_obj.wordData.wordTypes;
            var nextWord_ipns = nextWord_obj.metaData.ipns;

            lookupRawFileBySlug_obj[nextWord_slug] = nextWord_obj;
            lookupRawFileBySlug_obj.edited[nextWord_slug] = nextWord_obj;

            if (jQuery.inArray("concept",nextWord_wordTypes) > -1) {
                var nextWord_rF_obj = nextWord_obj;
                var nextWord_rF_str = JSON.stringify(nextWord_rF_obj,null,4)
                // console.log("nextWord_slug: "+nextWord_slug+"; nextWord_rF_str: "+nextWord_rF_str)
                var nextWord_rF_wordType_slug = nextWord_rF_obj.conceptData.nodes.wordType.slug;
                var nextWord_rF_wordType_ipns = nextWord_rF_obj.conceptData.nodes.wordType.ipns;
                var nextWord_rF_superset_slug = nextWord_rF_obj.conceptData.nodes.superset.slug;
                var nextWord_rF_superset_ipns = nextWord_rF_obj.conceptData.nodes.superset.ipns;
                var nextWord_rF_schema_slug = nextWord_rF_obj.conceptData.nodes.schema.slug;
                var nextWord_rF_schema_ipns = nextWord_rF_obj.conceptData.nodes.schema.ipns;
                var nextWord_rF_JSONSchema_slug = nextWord_rF_obj.conceptData.nodes.JSONSchema.slug;
                var nextWord_rF_JSONSchema_ipns = nextWord_rF_obj.conceptData.nodes.JSONSchema.ipns;
                var nextWord_rF_concept_slug = nextWord_rF_obj.conceptData.nodes.concept.slug;
                var nextWord_rF_concept_ipns = nextWord_rF_obj.conceptData.nodes.concept.ipns;
                var nextWord_rF_primaryProperty_slug = nextWord_rF_obj.conceptData.nodes.primaryProperty.slug;
                var nextWord_rF_primaryProperty_ipns = nextWord_rF_obj.conceptData.nodes.primaryProperty.ipns;
                var nextWord_rF_propertySchema_slug = nextWord_rF_obj.conceptData.nodes.propertySchema.slug;
                var nextWord_rF_propertySchema_ipns = nextWord_rF_obj.conceptData.nodes.propertySchema.ipns;

                // console.log("qwerty nextWord_rF_propertySchema_slug: "+nextWord_rF_propertySchema_slug)
                var conceptSelectorHTML = "";
                conceptSelectorHTML += "<option data-ipns='"+nextWord_rF_wordType_ipns+"' data-slug='"+nextWord_rF_wordType_slug+"' data-thisconceptconceptslug='"+nextWord_rF_concept_slug+"' data-thisconceptschemaslug='"+nextWord_rF_schema_slug+"' data-thisconceptjsonschemaslug='"+nextWord_rF_JSONSchema_slug+"' data-thisconceptwordtypeslug='"+nextWord_rF_wordType_slug+"' data-thisconceptsupersetslug='"+nextWord_rF_superset_slug+"' data-thisconceptprimarypropertyslug='"+nextWord_rF_primaryProperty_slug+"' data-thisconceptpropertyschemaslug='"+nextWord_rF_propertySchema_slug+"' >";
                conceptSelectorHTML += nextWord_rF_wordType_slug;
                conceptSelectorHTML += "</option>";

                conceptSelector1HTML += conceptSelectorHTML;
                conceptSelector2HTML += conceptSelectorHTML;
            }

            if (jQuery.inArray("enumeration",nextWord_wordTypes) > -1) {
                var nextWord_rF_obj = nextWord_obj;
                var nextWord_rF_str = JSON.stringify(nextWord_rF_obj,null,4)
                console.log("enumeration; nextWord_slug: "+nextWord_slug+"; nextWord_rF_str: "+nextWord_rF_str)

                enumerationSelectorHTML += "<option data-ipns='"+nextWord_ipns+"' data-slug='"+nextWord_slug+"' >";
                enumerationSelectorHTML += nextWord_slug;
                enumerationSelectorHTML += "</option>";
            }
        }
        conceptSelector1HTML += "</select>";
        conceptSelector2HTML += "</select>";
        jQuery("#conceptSelectorContainer1_map").html(conceptSelector1HTML);
        jQuery("#conceptSelectorContainer2_map").html(conceptSelector2HTML);

        enumerationSelectorHTML += "</select>";
        jQuery("#enumerationSelectorContainer_map").html(enumerationSelectorHTML);

        createPropertySelectors_map();

        jQuery("#conceptSelector1_map").change(function(){
            createPropertySelectors_map();
        });
        jQuery("#conceptSelector2_map").change(function(){
            createPropertySelectors_map();
        });
    });
}

function showExampleOfSelectedArrayType() {
    var selectedArrayType = jQuery("#arrayPropertyTypeSelector_map option:selected").data("arraytype")
    var sample_obj = {};
    sample_obj.type = "array";
    if (jQuery("#newPropTitle_map").val()) { sample_obj.title = jQuery("#newPropTitle_map").val(); }
    if (jQuery("#newPropName_map").val()) { sample_obj.name = jQuery("#newPropName_map").val(); }
    if (jQuery("#newPropDescription_map").val()) { sample_obj.description = jQuery("#newPropDescription_map").val(); }

    var itemTypeString = {};
    itemTypeString.type = "string";
    itemTypeString.enum = ["one","two","three"];

    var itemTypeInteger = {};
    itemTypeInteger.type = "integer";
    itemTypeInteger.enum = [1,2,3];

    var itemTypeObject = {};
    itemTypeObject.type = "object";
    itemTypeObject.enum = [ {"a":"b"}, {"c":"d"}, {"e":"f"} ];

    var itemTypeArray = {};
    itemTypeArray.type = "array";
    itemTypeArray.enum = [ [1,2], [2,3], [1,3] ];

    if (selectedArrayType == "array") {
    }

    if (selectedArrayType == "array_string") {
        sample_obj.items = {};
        sample_obj.items = itemTypeString;
    }

    if (selectedArrayType == "array_integer") {
        sample_obj.items = {};
        sample_obj.items = itemTypeInteger;
    }

    if (selectedArrayType == "array_object") {
        sample_obj.items = {};
        sample_obj.items = itemTypeObject;
    }

    if (selectedArrayType == "array_array") {
        sample_obj.items = {};
        sample_obj.items = itemTypeArray;
    }

    if (selectedArrayType == "array_multi") {
        sample_obj.items = [];
        sample_obj.items.push(itemTypeString)
        sample_obj.items.push(itemTypeInteger)
    }

    var sample_str = JSON.stringify(sample_obj,null,4)
    jQuery("#sampleArrayJSONSchema").val(sample_str)
}

async function createNewProperty_map() {
    var newPropTitle = jQuery("#newPropTitle_map").val();
    var newPropName = jQuery("#newPropName_map").val();
    var newPropDescription = jQuery("#newPropDescription_map").val();
    var newPropType = jQuery("#arrayPropertyTypeSelector_map option:selected").data("arraytype");

    console.log("createNewPropertyButton clicked; newPropTitle: "+newPropTitle+"; newPropName: "+newPropName+"; newPropDescription: "+newPropDescription)

    var newProperty_obj = await MiscFunctions.createNewWordByTemplate("property");

    var selectedConcept_concept_slug = jQuery("#conceptSelector1_map option:selected").data("thisconceptconceptslug");
    var selectedConcept_wordType_slug = jQuery("#conceptSelector1_map option:selected").data("thisconceptwordtypeslug");
    var selectedConcept_primaryProperty_slug = jQuery("#conceptSelector1_map option:selected").data("thisconceptprimarypropertyslug");
    var selectedConcept_propertySchema_slug = jQuery("#conceptSelector1_map option:selected").data("thisconceptpropertyschemaslug");

    var selectedProperty_slug = jQuery("#propertySelector1_map option:selected").data("propertyslug");

    newProperty_obj.wordData.title = newPropTitle;
    newProperty_obj.wordData.name = newPropName;
    newProperty_obj.wordData.description = newPropDescription;
    newProperty_obj.propertyData.slug = newProperty_obj.wordData.slug;
    newProperty_obj.propertyData.title = newPropTitle;
    newProperty_obj.propertyData.description = newPropDescription;
    newProperty_obj.propertyData.metaData.parentConcept = selectedConcept_concept_slug;
    newProperty_obj.propertyData.metaData.parentConcepts.push(selectedConcept_concept_slug);

    var newProperty_slug = await newProperty_obj.wordData.slug;

    var newProperty_str = JSON.stringify(newProperty_obj,null,4);
    console.log("newProperty_str: "+newProperty_str)

    // Make 4 rels and add to propertySchemaFor[thisConcept]
    // make rel1: newProperty_slug -- isASpecificInstanceOf -- propertiesFor[thisConcept]_[newPropType] (i.e. newPropType = array, array_string, etc)
    // make rel2: hasKey=title -- addPropertyValue, field: newPropertyTitle -- newProperty_slug
    // make rel2b: hasKey=name -- addPropertyValue, field: newPropertyName -- newProperty_slug
    // make rel3: hasKey=description -- addPropertyValue, field: newPropertyDescription -- newProperty_slug
    // make rel4: newProperty_slug -- addToConceptGraphProperties, field: newPropertyTitle (significance of this field??) -- (selected slug from propertySelector1_map; selectedProperty_slug)

    var rel1_obj = MiscFunctions.blankRel_obj();
    var rel2_obj = MiscFunctions.blankRel_obj();
    var rel2b_obj = MiscFunctions.blankRel_obj();
    var rel3_obj = MiscFunctions.blankRel_obj();
    var rel4_obj = MiscFunctions.blankRel_obj();

    rel1_obj.relationshipType.slug = "isASpecificInstanceOf";
    rel2_obj.relationshipType.slug = "addPropertyValue";
    rel2b_obj.relationshipType.slug = "addPropertyValue";
    rel3_obj.relationshipType.slug = "addPropertyValue";
    rel4_obj.relationshipType.slug = "addToConceptGraphProperties";

    rel2_obj.relationshipType.addPropertyValueData = {};
    rel2_obj.relationshipType.addPropertyValueData.field = newPropTitle;

    rel2b_obj.relationshipType.addPropertyValueData = {};
    rel2b_obj.relationshipType.addPropertyValueData.field = newPropName;

    rel3_obj.relationshipType.addPropertyValueData = {};
    rel3_obj.relationshipType.addPropertyValueData.field = newPropDescription;

    rel4_obj.relationshipType.addToConceptGraphPropertiesData = {};
    rel4_obj.relationshipType.addToConceptGraphPropertiesData.field = newPropTitle;

    rel1_obj.nodeFrom.slug = newProperty_slug;
    rel4_obj.nodeFrom.slug = newProperty_slug;

    // TEMPORARY WORKAROUND:
    // eventually I will need to be able to look these two slugs up based on hasKey
    // ie make a function:
    // propertyType = "hasKey"
    // key = "title"
    // propertySlug = returnPropertySlug(propertyType,key)
    // returnPropertySlug will look into main concept graph propertySchema, look in properties of the specified type,
    // and return the (first?) one with the indicated key
    rel2_obj.nodeFrom.slug = "property_ycjxr1"; // "title": "hasKey=title",
    rel2b_obj.nodeFrom.slug = "property_8vlbc5"; // "name": "hasKey=name",
    rel3_obj.nodeFrom.slug = "property_uvr9qn"; // "hasKey=description",

    // rel1_obj.nodeTo.slug = propertiesFor[thisConcept]_type1
    rel2_obj.nodeTo.slug = newProperty_slug;
    rel2b_obj.nodeTo.slug = newProperty_slug;
    rel3_obj.nodeTo.slug = newProperty_slug;
    // rel4_obj.nodeTo.slug = selectedConcept_primaryProperty_slug; // OLD WAY
    rel4_obj.nodeTo.slug = selectedProperty_slug;

    // TEMPORARY
    // _multiProps_string is the new name for type1 property
    // Long term tenative plan:
    // each concept will have a way to look up the individual property sets of propertySchema, based on property type
    // Or perhaps just do a search through propertySchema and find the set with that type
    // Step1: (current) rel1Set_slug ends in _type1, which will automatically give it the prop: type:string
    // Step2: rel1Set_slug ends in _multiProps_string, or whatever I end up using in place of _type1
    // Step3: automate via the above process
    // var rel1Set_slug = "propertiesFor"+selectedConcept_wordType_slug.substr(0,1).toUpperCase()+selectedConcept_wordType_slug.substr(1)+"_multiProps_string";
    var rel1Set_slug = "propertiesFor"+selectedConcept_wordType_slug.substr(0,1).toUpperCase()+selectedConcept_wordType_slug.substr(1)+"_"+newPropType;
    rel1_obj.nodeTo.slug = rel1Set_slug

    console.log("rel1_obj: ")
    MiscFunctions.outputObjToConsole(rel1_obj);
    console.log("rel2_obj: ")
    MiscFunctions.outputObjToConsole(rel2_obj);
    console.log("rel2b_obj: ")
    MiscFunctions.outputObjToConsole(rel2b_obj);
    console.log("rel3_obj: ")
    MiscFunctions.outputObjToConsole(rel3_obj);
    console.log("rel4_obj: ")
    MiscFunctions.outputObjToConsole(rel4_obj);

    // First store the new word in SQL and in lookupRawFileBySlug_obj
    lookupRawFileBySlug_obj[newProperty_slug] = newProperty_obj;
    lookupRawFileBySlug_obj.edited[newProperty_slug] = newProperty_obj;
    MiscFunctions.outputObjToConsole(newProperty_obj);
    MiscFunctions.createOrUpdateWordInAllTables(newProperty_obj);

    // Then update selectedConcept_primaryProperty_slug with 4 rels;
    // need to do this using a function that can accomodate newly created nodes
    var relsToAdd_arr = [];
    relsToAdd_arr.push(rel1_obj);
    relsToAdd_arr.push(rel2_obj);
    relsToAdd_arr.push(rel2b_obj);
    relsToAdd_arr.push(rel3_obj);
    relsToAdd_arr.push(rel4_obj);
    var propertySchema_rF_obj = lookupRawFileBySlug_obj[selectedConcept_propertySchema_slug];
    var updateOutput_obj = await MiscFunctions.updateSchemaWithNewRels(propertySchema_rF_obj,relsToAdd_arr,lookupRawFileBySlug_obj)
    MiscFunctions.outputObjToConsole(updateOutput_obj.schema_obj);
    lookupRawFileBySlug_obj[selectedConcept_propertySchema_slug] = updateOutput_obj.schema_obj;
    MiscFunctions.updateWordInAllTables(updateOutput_obj.schema_obj);
}

export default class ManageArrayProperty extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        createConceptSelector_map();
        showExampleOfSelectedArrayType();
        jQuery("#arrayPropertyTypeSelector_map").change(function(){
            showExampleOfSelectedArrayType();
        });
        jQuery("#newPropTitle_map").change(function(){
            showExampleOfSelectedArrayType();
        });
        jQuery("#newPropName_map").change(function(){
            showExampleOfSelectedArrayType();
        });
        jQuery("#newPropDescription_map").change(function(){
            showExampleOfSelectedArrayType();
        });
        jQuery("#createNewPropertyButton_map").click(async function(){
            createNewProperty_map();
        });
        jQuery("#enumerationRelField_map").change(function(){
            createEnumerationLinkageRel_map();
        });
        jQuery("#updatePropertiesSchemaButton_map").click(function(){
            var editedSchemaForProperties_rF_str = jQuery("#editedSchemaForProperties_rawFile").val();
            var editedSchemaForProperties_rF_obj = JSON.parse(editedSchemaForProperties_rF_str);
            MiscFunctions.updateWordInAllTables(editedSchemaForProperties_rF_obj);
        });
    }
    state = {
    }
    render() {
        return (
            <>
                <center>Manage Array Property</center>

                <fieldset style={{display:"inline-block",border:"1px solid black",width:"550px",height:"800px",padding:"5px",verticalAlign:"top"}} >
                    <center>Concept Selector</center>
                    Concept 1: <div style={{display:"inline-block"}} id="conceptSelectorContainer1_map" >conceptSelectorContainer</div>
                    <br/>
                    add new array prop to this object property: <div style={{display:"inline-block"}} id="propertySelector1Container_map" >propertySelector1Container_map</div>
                    <br/><br/><br/>
                    (Step 2)
                    <br/>
                    Connect this enumeration: <div style={{display:"inline-block"}} id="enumerationSelectorContainer_map" >enumerationSelectorContainer_map</div>
                    <div style={{fontSize:"10px"}}>(Select from all enumerations within this Concept Graph.)</div>
                    <br/>
                    to an array property from Concept 2: <div style={{display:"inline-block"}} id="conceptSelectorContainer2_map" >conceptSelectorContainer</div>
                    <br/>
                    Select the array property:
                    <br/>
                    <div style={{display:"inline-block"}} id="propertySelector2Container_map" >propertySelector2Container_map</div>
                    <br/>
                    relationship field (title):
                    <textarea id="enumerationRelField_map" ></textarea>
                    <br/>
                    <div style={{fontSize:"10px"}}>by convention, make it the same as propertyData.title; e.g.: JSON-LD Schema Properties List</div>
                    <br/>
                    <div style={{fontSize:"10px"}}>(Select from all array properties within the selected Concept 2.)</div>
                    <br/>
                    <textarea style={{width:"500px",height:"250px"}} id="newEnumerationRel_map" >newEnumerationRel_map</textarea>
                    <br/>
                    schema for properties for [concept]:
                    <br/>
                    <div class="doSomethingButton" id="showUneditedSchemaButton_map" >unedited</div>
                    <div class="doSomethingButton" id="showEditedSchemaButton_map" >edited</div>
                    <div class="doSomethingButton" id="updatePropertiesSchemaButton_map" >Update in SQL</div>
                    <br/>
                    <textarea style={{width:"500px",height:"200px"}} id="uneditedSchemaForProperties_rawFile" >unedited schemaForPropertiesFor</textarea>
                    <textarea style={{width:"500px",height:"200px"}} id="editedSchemaForProperties_rawFile" >edited schemaForPropertiesFor</textarea>

                </fieldset>

                <fieldset style={{display:"inline-block",border:"1px solid black",width:"450px",height:"800px",padding:"5px",verticalAlign:"top"}} >
                    <div id="createNewType1PropertyContainer_map"></div>

                    <fieldset style={{border:'1px solid black',padding:'3px'}} >
                        <center>(Step 1) Create New Array Property</center>

                        Make a new property with type =
                        <select id="arrayPropertyTypeSelector_map" >
                            <option data-arraytype="array" >array</option>
                            <option data-arraytype="array_string" >array_string</option>
                            <option data-arraytype="array_integer" >array_integer</option>
                            <option data-arraytype="array_object" >array_object</option>
                            <option data-arraytype="array_array" >array_array</option>
                            <option data-arraytype="array_multi" >array_multi</option>
                        </select>
                        <br/>
                        and add it to the concept on the top of the left panel.
                        <div style={{fontSize:"10px"}}>For now, just use type=array; the rest will be calculated by looking at all relationships of the form: enumeration -- populatesArray, FIELD: string -- (property)</div>
                        and connect it to the object property on the top of the left panel.

                        <div>
                            <div class="leftCol_map" >
                            title:
                            </div>
                            <textarea id="newPropTitle_map" style={{width:'300px',height:'25px'}} >
                            </textarea>
                        </div>

                        <div>
                            <div class="leftCol_map" >
                            name:
                            </div>
                            <textarea id="newPropName_map" style={{width:'300px',height:'25px'}} >
                            </textarea>
                        </div>

                        <div>
                            <div class="leftCol_map" >
                            description:
                            </div>
                            <textarea id="newPropDescription_map" style={{width:'300px',height:'25px'}} >
                            </textarea>
                        </div>

                        <div id="createNewPropertyButton_map" class="doSomethingButton" >Create</div>
                    </fieldset>
                </fieldset>

                <fieldset style={{display:"inline-block",border:"1px sold black",width:"500px",height:"800px",padding:"5px",verticalAlign:"top"}}>
                    <center>How Array works</center>

                    Create property in JSON Schema like this:<br/>
                    <textarea id="sampleArrayJSONSchema" style={{width:"400px",height:"250px"}}></textarea>
                    <br/><br/>
                    Step 1: Upon initial setup, the newly created property is made a subset of propertiesFor[this concept]_array.
                    <br/><br/>
                    Step 2: add relationship to schemaForPropertiesFor[concept]:<br/>
                    enumeration -- populates array -- property FIELD: string (usually string but could also be integer, or mixed, or ? object or ? array )

                    <br/><br/>
                    (In future: can make subset of propertiesFor[this concept]_array_string, propertiesFor[this concept]_array_integer, etc.
                    But these subsets do not yet exist; not sure whether they need to exist?)

                </fieldset>

            </>
        );
    }
}
