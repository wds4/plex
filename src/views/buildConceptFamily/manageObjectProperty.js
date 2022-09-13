import React from "react";
import IpfsHttpClient from 'ipfs-http-client';
import ReactJSONSchemaForm from 'react-jsonschema-form';
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

function createConceptSelector_mop() {

    var currentConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected ").data("tablename");

    var sql = "";
    sql += " SELECT * FROM "+currentConceptGraph_tableName;


    sendAsync(sql).then((words_arr) => {
        var conceptSelectorHTML = "";
        conceptSelectorHTML += "<select id=conceptSelector_mop >";

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

                conceptSelectorHTML += "<option data-ipns='"+nextWord_rF_wordType_ipns+"' data-slug='"+nextWord_rF_wordType_slug+"' data-thisconceptconceptslug='"+nextWord_rF_concept_slug+"' data-thisconceptschemaslug='"+nextWord_rF_schema_slug+"' data-thisconceptjsonschemaslug='"+nextWord_rF_JSONSchema_slug+"' data-thisconceptwordtypeslug='"+nextWord_rF_wordType_slug+"' data-thisconceptsupersetslug='"+nextWord_rF_superset_slug+"' data-thisconceptprimarypropertyslug='"+nextWord_rF_primaryProperty_slug+"' data-thisconceptpropertyschemaslug='"+nextWord_rF_propertySchema_slug+"' >";
                conceptSelectorHTML += nextWord_rF_wordType_slug;
                conceptSelectorHTML += "</option>";
            }

        }
        conceptSelectorHTML += "</select>";
        jQuery("#conceptSelectorContainer_mop").html(conceptSelectorHTML);

        // jQuery("#conceptSelector_mop").change(function(){
            // displayPrimaryProperty_mop();
            // highlightPropertys_mop();
        // });
        // displayPrimaryProperty_mop();
        // highlightPropertys_mop();

    });
}

function updatePropertyToEditSelector_mop() {
    var selectedPropType = jQuery("#editExisting_objectPropertyTypeSelector_mop option:selected").data("propertytype");
    var selectedConcept_wordType_slug = jQuery("#conceptSelector_mop option:selected").data("thisconceptwordtypeslug");
    var rel1Set_slug = "propertiesFor"+selectedConcept_wordType_slug.substr(0,1).toUpperCase()+selectedConcept_wordType_slug.substr(1)+"_"+selectedPropType;
    console.log("editExisting_objectPropertyTypeSelector_mop; rel1Set_slug: "+rel1Set_slug)
    var rel1Set_rF_obj = lookupRawFileBySlug_obj[rel1Set_slug];
    MiscFunctions.outputObjToConsole(rel1Set_rF_obj);
    var properties_specificInstances_arr = rel1Set_rF_obj.globalDynamicData.specificInstances;
    var numSpecificInstances = properties_specificInstances_arr.length;
    var selectorHTML = "";
    selectorHTML += "<select>";
    for (var s=0;s<numSpecificInstances;s++) {
        var nextSpecificInstance_slug = properties_specificInstances_arr[s];
        console.log("nextSpecificInstance_slug: "+nextSpecificInstance_slug)
        selectorHTML += "<option ";
        selectorHTML += " data-propertyslug='"+nextSpecificInstance_slug+"' ";
        selectorHTML += " >";
        selectorHTML += nextSpecificInstance_slug;
        selectorHTML += "</option>";
    }
    selectorHTML += "</select>";
    jQuery("#propertyToEditSelector_mop").html(selectorHTML);
}

export default class ManageObjectProperty extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        createConceptSelector_mop();
        // createType1PropertyList_mop();
        // createNewType1Property_mop();
        // jQuery("#createNewType1PropertyContainer_mop").html(newPropHTML);

        jQuery("#createNewPropertyButton_mop").click(async function(){
            var newPropTitle = jQuery("#newPropTitle_mop").val();
            var newPropDescription = jQuery("#newPropDescription_mop").val();
            var newPropType = jQuery("#objectPropertyTypeSelector_mop option:selected").data("propertytype");

            console.log("createNewPropertyButton clicked; newPropTitle: "+newPropTitle+"; newPropDescription: "+newPropDescription)

            var newProperty_obj = await MiscFunctions.createNewWordByTemplate("property");

            var selectedConcept_concept_slug = jQuery("#conceptSelector_mop option:selected").data("thisconceptconceptslug");
            var selectedConcept_wordType_slug = jQuery("#conceptSelector_mop option:selected").data("thisconceptwordtypeslug");
            var selectedConcept_primaryProperty_slug = jQuery("#conceptSelector_mop option:selected").data("thisconceptprimarypropertyslug");
            var selectedConcept_propertySchema_slug = jQuery("#conceptSelector_mop option:selected").data("thisconceptpropertyschemaslug");

            newProperty_obj.wordData.title = newPropTitle;
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
            // make rel1: newProperty_slug -- isASpecificInstanceOf -- propertiesFor[thisConcept]_type1 // OLD WAY
            // make rel1: newProperty_slug -- isASpecificInstanceOf -- propertiesFor[thisConcept]_string_extraProps
            // make rel2: hasKey=title -- addPropertyValue, field: newPropertyTitle -- newProperty_slug
            // make rel3: hasKey=description -- addPropertyValue, field: newPropertyDescription -- newProperty_slug
            // make rel4: newProperty_slug -- addToConceptGraphProperties, field: newPropertyTitle (significance of this field??) -- primaryPropertyFor[thisConcept]

            var rel1_obj = MiscFunctions.blankRel_obj();
            var rel2_obj = MiscFunctions.blankRel_obj();
            var rel3_obj = MiscFunctions.blankRel_obj();
            var rel4_obj = MiscFunctions.blankRel_obj();

            rel1_obj.relationshipType.slug = "isASpecificInstanceOf";
            rel2_obj.relationshipType.slug = "addPropertyValue";
            rel3_obj.relationshipType.slug = "addPropertyValue";
            rel4_obj.relationshipType.slug = "addToConceptGraphProperties";

            rel2_obj.relationshipType.addPropertyValueData = {};
            rel2_obj.relationshipType.addPropertyValueData.field = newPropTitle;

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
            rel3_obj.nodeFrom.slug = "property_uvr9qn"; // "hasKey=description",


            // rel1_obj.nodeTo.slug = propertiesFor[thisConcept]_type1
            rel2_obj.nodeTo.slug = newProperty_slug;
            rel3_obj.nodeTo.slug = newProperty_slug;
            rel4_obj.nodeTo.slug = selectedConcept_primaryProperty_slug;

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

            MiscFunctions.outputObjToConsole(rel1_obj);
            MiscFunctions.outputObjToConsole(rel2_obj);
            MiscFunctions.outputObjToConsole(rel3_obj);
            MiscFunctions.outputObjToConsole(rel4_obj);


            // First store the new word in SQL and in lookupRawFileBySlug_obj
            lookupRawFileBySlug_obj[newProperty_slug] = newProperty_obj;
            lookupRawFileBySlug_obj.edited[newProperty_slug] = newProperty_obj;
            MiscFunctions.outputObjToConsole(newProperty_obj);
            // MiscFunctions.createOrUpdateWordInAllTables(newProperty_obj);

            // Then update selectedConcept_primaryProperty_slug with 4 rels;
            // need to do this using a function that can accomodate newly created nodes
            var relsToAdd_arr = [];
            relsToAdd_arr.push(rel1_obj);
            relsToAdd_arr.push(rel2_obj);
            relsToAdd_arr.push(rel3_obj);
            relsToAdd_arr.push(rel4_obj);
            var propertySchema_rF_obj = lookupRawFileBySlug_obj[selectedConcept_propertySchema_slug];
            var updateOutput_obj = await MiscFunctions.updateSchemaWithNewRels(propertySchema_rF_obj,relsToAdd_arr,lookupRawFileBySlug_obj)
            MiscFunctions.outputObjToConsole(updateOutput_obj.schema_obj);
            lookupRawFileBySlug_obj[selectedConcept_propertySchema_slug] = updateOutput_obj.schema_obj;
            // MiscFunctions.updateWordInAllTables(updateOutput_obj.schema_obj);
        });

        jQuery("#editExisting_objectPropertyTypeSelector_mop").change(function(){
            updatePropertyToEditSelector_mop();
        });
        // updatePropertyToEditSelector_mop();
    }
    state = {
    }
    render() {
        return (
            <>
                <center>Manage Object Property</center>

                <fieldset style={{display:"inline-block",border:"1px solid black",width:"550px",height:"800px",padding:"5px",verticalAlign:"top"}} >
                    <center>Concept Selector</center>
                    concept: <div style={{display:"inline-block"}} id="conceptSelectorContainer_mop" >conceptSelectorContainer</div>
                    <br/>
                </fieldset>

                <fieldset style={{display:"inline-block",border:"1px solid black",width:"450px",height:"800px",padding:"5px",verticalAlign:"top"}} >
                    <div id="createNewType1PropertyContainer_mop"></div>

                    <fieldset style={{border:'1px solid black',padding:'3px'}} >
                        <center>Create New Object Property Input</center>
                        <div style={{fontSize:'10px'}}>
                            Examples: <br/>

                            object_1property: <br/>
                            <li>(slug: property_sgyh0r) title: Property for Comments; property for comments</li>
                            <li>title: Property for Confidence; description: property for confidence</li>

                            object_multiProperties: <br/>
                            <li>(slug: property_6vav5m) title: Property Module for ratingsFieldsData; description: Various fields for leaving ratings (Comments and Confidence)</li>

                            object_dependencies (takes input from an enumeration): <br/>
                            <li>(slug: property_module_ratingTemplateData) title: Property Module for ratingTemplateData; description: Select the ratingTemplate from the list of ratingTemplates</li>
                            <li>(slug: property_module_raterData) title: Property Module for raterData; description: Select the raterType and then the rater</li>
                        </div>

                        property type:
                        <select id="objectPropertyTypeSelector_mop" >
                            <option data-suffix="_1property" data-propertytype="object_1property" >object_1property</option>
                            <option data-suffix="_multiProperties" data-propertytype="object_multiProperties" >object_multiProperties</option>
                            <option data-suffix="_dependencies" data-propertytype="object_dependencies" >object_dependencies</option>
                        </select>

                        <div>
                            <div class="leftCol_mop" >
                            title:
                            </div>
                            <textarea id="newPropTitle_mop" style={{width:'300px',height:'25px'}} >
                            </textarea>
                        </div>

                        <div>
                            <div class="leftCol_mop" >
                            description:
                            </div>
                            <textarea id="newPropDescription_mop" style={{width:'300px',height:'25px'}} >
                            </textarea>
                        </div>

                        <div id="createNewPropertyButton_mop" class="doSomethingButton" >Create</div>
                    </fieldset>
                </fieldset>

                <fieldset style={{display:"inline-block",border:"1px sold black",width:"500px",height:"800px",padding:"5px",verticalAlign:"top"}}>
                    <center>Edit Existing Object Property</center>

                    display properties of property type:
                    <select id="editExisting_objectPropertyTypeSelector_mop" >
                        <option data-suffix="_1property" data-propertytype="object_1property" >object_1property</option>
                        <option data-suffix="_multiProperties" data-propertytype="object_multiProperties" >object_multiProperties</option>
                        <option data-suffix="_dependencies" data-propertytype="object_dependencies" >object_dependencies</option>
                    </select>

                    <br/>

                    Select which property to edit:
                    <div id="propertyToEditSelector_mop" >propertyToEditSelector_mop</div>

                    <fieldset style={{border:'1px solid black',padding:'3px'}} >
                        <center>Add Prop</center>
                        <center>(may deprecate this box; add props using Create/edit String Property button ... ??)</center>
                        <div>
                            <div class="leftCol_mop" >
                            title:
                            </div>
                            <textarea id="newPropTitle_mop" style={{width:'300px',height:'25px'}} >
                            </textarea>
                        </div>

                        <div>
                            <div class="leftCol_mop" >
                            description:
                            </div>
                            <textarea id="newPropDescription_mop" style={{width:'300px',height:'25px'}} >
                            </textarea>
                        </div>
                    </fieldset>

                    <fieldset style={{border:'1px solid black',padding:'3px'}} >
                        <center>Connect Property</center>
                    </fieldset>

                    <div id="editExistingPropertyButton_mop" class="doSomethingButton" >Update</div>
                </fieldset>
            </>
        );
    }
}
