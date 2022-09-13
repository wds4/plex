import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleConcept_leftNav2.js';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

export default class SingleConceptInitialization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptSqlID: null,
            conceptGraphTableSqlID: null,
            conceptGraphTableName: null,
            step2Relationships: [
                {
                    nodeFrom: "JSONSchema",
                    relType: "isTheJSONSchemaFor",
                    nodeTo: "wordType",
                    status: null,
                    relID: "relID_0",
                    whichSchema: "schema"
                },
                {
                    nodeFrom: "schema",
                    relType: "isTheSchemaFor",
                    nodeTo: "wordType",
                    status: null,
                    relID: "relID_1",
                    whichSchema: "schema"
                },
                {
                    nodeFrom: "concept",
                    relType: "isTheConceptFor",
                    nodeTo: "wordType",
                    status: null,
                    relID: "relID_2",
                    whichSchema: "schema"
                },
                {
                    nodeFrom: "superset",
                    relType: "isTheSupersetFor",
                    nodeTo: "wordType",
                    status: null,
                    relID: "relID_3",
                    whichSchema: "schema"
                },
                {
                    nodeFrom: "primaryProperty",
                    relType: "isThePrimaryPropertyFor",
                    nodeTo: "wordType",
                    status: null,
                    relID: "relID_4",
                    whichSchema: "schema"
                },
                {
                    nodeFrom: "propertySchema",
                    relType: "isThePropertySchemaFor",
                    nodeTo: "wordType",
                    status: null,
                    relID: "relID_5",
                    whichSchema: "schema"
                },
                {
                    nodeFrom: "properties",
                    relType: "isTheSetOfPropertiesFor",
                    nodeTo: "wordType",
                    status: null,
                    relID: "relID_6",
                    whichSchema: "schema"
                },
                {
                    nodeFrom: "primaryProperty",
                    relType: "addToConceptGraphProperties",
                    nodeTo: "JSONSchema",
                    status: null,
                    relID: "relID_7",
                    whichSchema: "propertySchema"
                }
            ]
        }
    }

    async componentDidMount() {
        MiscFunctions.updateWordTypesLookup();
        // var specialNodeWordtype = "set";
        // var oNewSuperset_y = await MiscFunctions.createNewWordByTemplate(specialNodeWordtype);
        // var oNewSuperset = {"a":"b"};
        // console.log("oNewSuperset_y: "+JSON.stringify(oNewSuperset_y,null,4))
        const makeNewSpecialNode = async (specialNodeName,specialNodeWordtype, foo) => {
            console.log("makeNewSpecialNode: "+specialNodeWordtype)

            var sCurrConcept = jQuery("#rightColTextarea").val();
            var oCurrConcept = JSON.parse(sCurrConcept);
            var sCurrConceptSingular = oCurrConcept.conceptData.name.singular;
            var sCurrConceptPlural = oCurrConcept.conceptData.name.plural;

            var oNewSpecialWord = await MiscFunctions.createNewWordByTemplate(specialNodeWordtype);
            oNewSpecialWord.wordData.slug = specialNodeName + "For_" + sCurrConceptSingular;
            oNewSpecialWord.wordData.name = specialNodeName + " for " + sCurrConceptSingular;
            oNewSpecialWord.wordData.title = specialNodeName.substr(0,1).toUpperCase()+specialNodeName.substr(1) + " for " + sCurrConceptSingular;

            oNewSpecialWord.wordData.governingConcepts = [];
            var governingConceptSlug = "conceptFor_"+sCurrConceptSingular
            oNewSpecialWord.wordData.governingConcepts.push(governingConceptSlug)

            if (specialNodeName=="superset") {
                oNewSpecialWord.supersetData.slug = sCurrConceptPlural;
                oNewSpecialWord.supersetData.name = sCurrConceptPlural;
                oNewSpecialWord.supersetData.title = sCurrConceptPlural.substr(0,1).toUpperCase()+sCurrConceptPlural.substr(1);
                oNewSpecialWord.supersetData.description = "This node represents the set of all "+sCurrConceptPlural+".";
                oNewSpecialWord.supersetData.metaData.governingConcept.slug = governingConceptSlug;
            }
            if (specialNodeName=="wordType") {
                oNewSpecialWord.wordTypeData.slug = sCurrConceptSingular;
                oNewSpecialWord.wordTypeData.name = sCurrConceptSingular;
                oNewSpecialWord.wordTypeData.title = sCurrConceptSingular.substr(0,1).toUpperCase()+sCurrConceptSingular.substr(1);
                oNewSpecialWord.wordTypeData.metaData.governingConcept.slug = governingConceptSlug;
            }
            if (specialNodeName=="primaryProperty") {
                oNewSpecialWord.propertyData.metaData.types = ["primaryProperty"]
                oNewSpecialWord.propertyData.metaData.governingConcept.slug = governingConceptSlug;
                oNewSpecialWord.propertyData.types = ["primaryProperty"]
                oNewSpecialWord.propertyData.type = "object";
                oNewSpecialWord.propertyData.key = sCurrConceptSingular+"Data";
                oNewSpecialWord.propertyData.name = sCurrConceptSingular+" data";
                oNewSpecialWord.propertyData.title = sCurrConceptSingular+" Data";
                oNewSpecialWord.propertyData.description = "data about this "+sCurrConceptSingular;
                oNewSpecialWord.propertyData.require = true; // whether this property is required in upstream property; may be overridden at upstream property; may deprecate this field
                oNewSpecialWord.propertyData.required = []; // list of properties that are required; applicable only if this property is an object
                oNewSpecialWord.propertyData.unique = []; // every property of type=object needs to have an unique array; if a property key is unique, then each specific instance must have a unique value
                oNewSpecialWord.propertyData.properties = {};
            }
            if (specialNodeName=="JSONSchema") {
                oNewSpecialWord.JSONSchemaData.metaData.primaryProperty = "primaryPropertyFor_"+sCurrConceptSingular;
                oNewSpecialWord.JSONSchemaData.metaData.governingConcept.slug = governingConceptSlug;
                oNewSpecialWord.required = [ sCurrConceptSingular+"Data" ]
                // oNewSpecialWord.properties = {}
                // oNewSpecialWord.properties[ sCurrConceptSingular+"Data" ] = {}
                // oNewSpecialWord.properties[ sCurrConceptSingular+"Data" ].type = "object";
            }
            if (specialNodeName=="properties") {
                oNewSpecialWord.setData.metaData.types = ["mainPropertiesSet"]
                oNewSpecialWord.setData.metaData.governingConcept.slug = governingConceptSlug;
                oNewSpecialWord.setData.slug = "propertiesFor_"+sCurrConceptSingular;
                oNewSpecialWord.setData.name = "properties for "+sCurrConceptSingular;
                oNewSpecialWord.setData.title = "Properties for "+sCurrConceptSingular.substr(0,1).toUpperCase()+sCurrConceptSingular.substr(1);;
                oNewSpecialWord.setData.description = "This is the set of all properties for this particular concept."
            }
            if (specialNodeName=="schema") {
                oNewSpecialWord.schemaData.metaData.types = ["conceptRelationships"]
                oNewSpecialWord.schemaData.metaData.governingConcept.slug = governingConceptSlug;
                oNewSpecialWord.schemaData.types = ["conceptRelationships"]
            }
            if (specialNodeName=="propertySchema") {
                oNewSpecialWord.schemaData.metaData.types = ["propertySchema"]
                oNewSpecialWord.schemaData.types = ["propertySchema"]
                oNewSpecialWord.schemaData.metaData.governingConcept.slug = governingConceptSlug;
            }

            var newSpecialWord_slug = oNewSpecialWord.wordData.slug;
            var newSpecialWord_ipns = oNewSpecialWord.metaData.ipns;

            oCurrConcept.conceptData.nodes[specialNodeName].slug=newSpecialWord_slug;
            oCurrConcept.conceptData.nodes[specialNodeName].ipns=newSpecialWord_ipns;

            var sNewSpecialWord = JSON.stringify(oNewSpecialWord,null,4)
            var sUpdatedConcept = JSON.stringify(oCurrConcept,null,4)

            jQuery("#rightColTextarea").val(sUpdatedConcept);

            jQuery("#specialWordContainer_"+specialNodeName).val(sNewSpecialWord)
            jQuery("#specialWordContainer_"+specialNodeName).css("display","block")

            return true;
        }

        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var conceptGraphSqlID = window.currentConceptGraphSqlID;
        var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[conceptGraphSqlID].tableName;

        var conceptSqlID = window.currentConceptSqlID;
        var conceptSlug = window.aLookupConceptInfoBySqlID[conceptSqlID].slug;

        var oConcept = window.lookupWordBySlug[conceptSlug]

        var jsonSchema_slug = oConcept.conceptData.nodes.JSONSchema.slug;
        var schema_slug = oConcept.conceptData.nodes.schema.slug;
        var wordType_slug = oConcept.conceptData.nodes.wordType.slug;
        var superset_slug = oConcept.conceptData.nodes.superset.slug;
        var concept_slug = oConcept.conceptData.nodes.concept.slug;
        var propertySchema_slug = oConcept.conceptData.nodes.propertySchema.slug;
        var primaryProperty_slug = oConcept.conceptData.nodes.primaryProperty.slug;
        var properties_slug = oConcept.conceptData.nodes.properties.slug;

        var currConSing = oConcept.conceptData.name.singular;
        var currConPlur = oConcept.conceptData.name.plural;

        var step1UpdateNeeded = false;
        if (!jsonSchema_slug) {
            step1UpdateNeeded = true;
            jQuery("#JSONSchemaMakeNewButton").css("display","inline-block")
            jQuery("#JSONSchemaMakeNewButton").data("status","absent")

            var bFoo1 = await makeNewSpecialNode("JSONSchema","JSONSchema", true)
        }
        if (!schema_slug) {
            step1UpdateNeeded = true;
            jQuery("#schemaMakeNewButton").css("display","inline-block")
            jQuery("#schemaMakeNewButton").data("status","absent")

            var bFoo2 = await makeNewSpecialNode("schema","schema", bFoo1)
        }
        if (!wordType_slug) {
            step1UpdateNeeded = true;
            jQuery("#wordTypeMakeNewButton").css("display","inline-block")
            jQuery("#wordTypeMakeNewButton").data("status","absent")

            var bFoo3 = await makeNewSpecialNode("wordType","wordType", bFoo2)
        }
        if (!superset_slug) {
            step1UpdateNeeded = true;
            jQuery("#supersetMakeNewButton").css("display","inline-block")
            jQuery("#supersetMakeNewButton").data("status","absent")

            var bFoo4 = await makeNewSpecialNode("superset","superset", bFoo3)
        }
        if (!concept_slug) {
            step1UpdateNeeded = true;
            var sCurrConcept = jQuery("#rightColTextarea").val();
            var oCurrConcept = JSON.parse(sCurrConcept);
            oCurrConcept.conceptData.nodes.concept.slug=conceptSlug;
            oCurrConcept.conceptData.nodes.concept.ipns=oConcept.metaData.ipns;
            var sUpdatedConcept = JSON.stringify(oCurrConcept,null,4)
            jQuery("#rightColTextarea").val(sUpdatedConcept);
        }
        if (!propertySchema_slug) {
            step1UpdateNeeded = true;
            jQuery("#propertySchemaMakeNewButton").css("display","inline-block")
            jQuery("#propertySchemaMakeNewButton").data("status","absent")

            var bFoo5 = await makeNewSpecialNode("propertySchema","schema",bFoo4)
        }
        if (!primaryProperty_slug) {
            step1UpdateNeeded = true;
            jQuery("#primaryPropertyMakeNewButton").css("display","inline-block")
            jQuery("#primaryPropertyMakeNewButton").data("status","absent")

            var bFoo6 = await makeNewSpecialNode("primaryProperty","property",bFoo5)
        }
        if (!properties_slug) {
            step1UpdateNeeded = true;
            jQuery("#propertiesMakeNewButton").css("display","inline-block")
            jQuery("#propertiesMakeNewButton").data("status","absent")

            var bFoo7 = await makeNewSpecialNode("properties","set",bFoo6)
        }

        jQuery(".makeNewSpecialNode").click(async function(){
            step1UpdateNeeded = true;
            var specialNodeWordtype = jQuery(this).data("wordtype")
            var specialNodeName = jQuery(this).data("specialwordname")
            var bFoo8 = makeNewSpecialNode(specialNodeName,specialNodeWordtype,true)
        })
        if (step1UpdateNeeded == true) {
            jQuery("#step2UpdateContainer").css("display","none")
        }
        var performStep2 = false;
        if (step1UpdateNeeded == false) {
            jQuery("#updateAllStep1WordsButton").css("display","none")
            jQuery("#step1StatusUpdate").html("STEP 1 COMPLETE")
            performStep2 = true;
        }
        var performStep3 = false;
        jQuery("#updateBothStep2WordsButton").click(async function(){
            console.log("updateBothStep2WordsButton clicked")

            var sSchema = jQuery("#rightColTextarea").val();
            var sPropertySchema = jQuery("#rightColTextarea2").val();

            var oSchema = JSON.parse(sSchema);
            var oPropertySchema = JSON.parse(sPropertySchema);

            MiscFunctions.createOrUpdateWordInAllTables(oSchema)
            MiscFunctions.createOrUpdateWordInAllTables(oPropertySchema)

            setTimeout( async function(){
                MiscFunctions.updateWordTypesLookup();
            },2000);
        });

        jQuery("#updateAllStep1WordsButton").click(async function(){
            console.log("updateAllStep1WordsButton clicked")

            var sNewWord = jQuery("#rightColTextarea").val()
            console.log("sNewWord: "+sNewWord)

            var oNewWord = JSON.parse(sNewWord);
            MiscFunctions.createOrUpdateWordInAllTables(oNewWord)

            jQuery(".makeNewSpecialNode").each(async function(){
                console.log("makeNewSpecialNode")
                var status = jQuery(this).data("status")
                if (status=="absent") {
                    var specialwordname = jQuery(this).data("specialwordname")
                    var sNewWord = jQuery("#specialWordContainer_"+specialwordname).val()
                    console.log("sNewWord: "+sNewWord)
                    var oNewWord = JSON.parse(sNewWord);
                    MiscFunctions.createOrUpdateWordInAllTables(oNewWord)
                }
                console.log("status: "+status)
            })
            setTimeout( async function(){
                MiscFunctions.updateWordTypesLookup();
            },2000);
        })

        if (performStep2) {
            var aStep2Relationships = this.state.step2Relationships;
            var numRels = aStep2Relationships.length;
            var oConceptGraph = window.lookupWordBySlug;

            var oSchema = window.lookupWordBySlug[schema_slug];
            var sSchema = JSON.stringify(oSchema,null,4);
            var aCurrentRels_schema = oSchema.schemaData.relationships;
            jQuery("#rightColTextarea").val(sSchema);

            var oPropertySchema = window.lookupWordBySlug[propertySchema_slug];
            var sPropertySchema = JSON.stringify(oPropertySchema,null,4);
            var aCurrentRels_propertySchema = oPropertySchema.schemaData.relationships;
            jQuery("#rightColTextarea2").val(sPropertySchema);
            var isStep2Complete = true;
            for (var r=0;r<numRels;r++) {
                var oNextStep2 = aStep2Relationships[r];
                var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                oNextRel.nodeFrom.slug=oConcept.conceptData.nodes[oNextStep2.nodeFrom].slug;
                oNextRel.relationshipType.slug=oNextStep2.relType;
                oNextRel.nodeTo.slug=oConcept.conceptData.nodes[oNextStep2.nodeTo].slug;
                var whichSchema = oNextStep2.whichSchema;
                if (whichSchema=="schema") {
                    var isRelPresent = MiscFunctions.isRelObjInArrayOfObj(oNextRel,aCurrentRels_schema);
                    console.log("isRelPresent: "+isRelPresent)
                    if (isRelPresent == false) {
                        console.log("rel must be added; sSchema: "+sSchema)
                        var sSchema = jQuery("#rightColTextarea").val();
                        var oSchema = JSON.parse(sSchema)
                        var oSchemaUpdated = MiscFunctions.updateSchemaWithNewRel(oSchema,oNextRel,oConceptGraph)
                        var sSchemaUpdated = JSON.stringify(oSchemaUpdated,null,4)
                        jQuery("#rightColTextarea").val(sSchemaUpdated);
                        jQuery("#relID_"+r).html("updating");
                        isStep2Complete = false;
                    } else {
                        jQuery("#relID_"+r).html("present");
                    }
                }
                if (whichSchema=="propertySchema") {
                    var isRelPresent = MiscFunctions.isRelObjInArrayOfObj(oNextRel,aCurrentRels_propertySchema);
                    console.log("isRelPresent: "+isRelPresent)
                    if (isRelPresent == false) {
                        console.log("rel must be added; sPropertySchema: "+sPropertySchema)
                        var sPropertySchema = jQuery("#rightColTextarea2").val();
                        var oPropertySchema = JSON.parse(sPropertySchema)
                        var oPropertySchemaUpdated = MiscFunctions.updateSchemaWithNewRel(oPropertySchema,oNextRel,oConceptGraph)
                        var sPropertySchemaUpdated = JSON.stringify(oPropertySchemaUpdated,null,4)
                        jQuery("#rightColTextarea2").val(sPropertySchemaUpdated);
                        jQuery("#relID_"+r).html("updating");
                        isStep2Complete = false;
                    } else {
                        jQuery("#relID_"+r).html("present");
                    }
                }
            }
            if (isStep2Complete == true) {
                jQuery("#updateBothStep2WordsButton").css("display","none");
                jQuery("#step2StatusUpdate").html("STEP 2 COMPLETE")
                performStep3 = true;
            }
        }
        if (performStep3) {
            var isStep3Complete = false
            var nameComplete = false;
            var titleComplete = false;
            var slugComplete = false;
            var descriptionComplete = false;
            jQuery("#step3UpdateContainer").css("display","block")
            // check to see whether requisite relationships are already present within
            var oPropertySchema = window.lookupWordBySlug[propertySchema_slug];
            var aPropertySchemaRels = oPropertySchema.schemaData.relationships;
            var numRels = aPropertySchemaRels.length;
            for (var r=0;r<numRels;r++) {
                var oNextRel = aPropertySchemaRels[r];
                var rT = oNextRel.relationshipType.slug;
                if (rT == "addToConceptGraphProperties") {
                    var nF = oNextRel.nodeFrom.slug;
                    var nT = oNextRel.nodeTo.slug;
                    if (nT == primaryProperty_slug) {
                        var oPropertyFrom = window.lookupWordBySlug[nF];
                        var propFromName = oPropertyFrom.propertyData.name;
                        if (propFromName=="name") {
                            jQuery("#namePropertySlugContainer").html(nF)
                            nameComplete = true;
                            jQuery("#newProperty_name_container").css("display","none")
                        }
                        if (propFromName=="title") {
                            jQuery("#titlePropertySlugContainer").html(nF)
                            titleComplete = true;
                            jQuery("#newProperty_title_container").css("display","none")
                        }
                        if (propFromName=="slug") {
                            jQuery("#slugPropertySlugContainer").html(nF)
                            slugComplete = true;
                            jQuery("#newProperty_slug_container").css("display","none")
                        }
                        if (propFromName=="description") {
                            jQuery("#descriptionPropertySlugContainer").html(nF)
                            descriptionComplete = true;
                            jQuery("#newProperty_description_container").css("display","none")
                        }
                    }
                }
                if ( (nameComplete) && (titleComplete) && (slugComplete) && (descriptionComplete) ) {
                    isStep3Complete = true
                }
            }
            console.log("isStep3Complete: "+isStep3Complete)
            if (isStep3Complete == true) {
                jQuery("#updatesStep3Button").css("display","none");
                jQuery("#step3StatusUpdate").html("STEP 3 COMPLETE")
                // performStep4 = true;
            }
        }
        jQuery(".makeNewPropertyNode").click(async function(){
            var starterpropertyname = jQuery(this).data("starterpropertyname")
            var starterpropertyslug = starterpropertyname.replaceAll(" ","-");
            var starterpropertytitle = starterpropertyname.charAt(0).toUpperCase() + starterpropertyname.slice(1);
            console.log("makeNewPropertyNode; starterpropertyname: "+starterpropertyname)
            var oNewProperty = await MiscFunctions.createNewWordByTemplate("property");
            // edite oNewProperty
            var newPropSlug = "propertyFor_"+currConSing+"_"+starterpropertyname;
            var newPropName = "property for "+currConSing+": "+starterpropertyname;
            var newPropTitle = "Property for "+currConSing+": "+starterpropertyname.charAt(0).toUpperCase() + starterpropertyname.slice(1);
            var newPropDescription = "The "+starterpropertyname+" for this "+currConSing;
            oNewProperty.wordData.slug = newPropSlug;
            oNewProperty.wordData.name = newPropName;
            oNewProperty.wordData.title = newPropTitle;
            oNewProperty.wordData.description = newPropDescription;
            oNewProperty.wordData.governingConcepts.push(concept_slug);
            oNewProperty.propertyData.key = starterpropertyname;
            oNewProperty.propertyData.type = "string";
            oNewProperty.propertyData.name = starterpropertyname;
            oNewProperty.propertyData.title = starterpropertytitle
            oNewProperty.propertyData.description = newPropDescription;
            if ( (starterpropertyname=="name") || (starterpropertyname=="title") || (starterpropertyname=="slug") ) {
                // oNewProperty.propertyData.unique = true;
            }

            var newPropertySlug = oNewProperty.wordData.slug;
            var sNewProperty = JSON.stringify(oNewProperty,null,4);
            jQuery("#starterPropertyRawFileContainer_"+starterpropertyname).val(sNewProperty)
            jQuery("#starterPropertyRawFileContainer_"+starterpropertyname).data("status","updated")
            var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
            oNewRel.relationshipType.slug = "addToConceptGraphProperties";
            oNewRel.relationshipType.addToConceptGraphPropertiesData = {};
            oNewRel.relationshipType.addToConceptGraphPropertiesData.includeDependencies = false;
            oNewRel.nodeFrom.slug = newPropertySlug;
            oNewRel.nodeTo.slug = primaryProperty_slug;
            var sNewRel = JSON.stringify(oNewRel,null,4);
            jQuery("#starterPropertyNewRelContainer_"+starterpropertyname).val(sNewRel)

            // update propertySchema
            var sPropertySchema = jQuery("#rightColTextarea2").val();
            var oPropertySchema = JSON.parse(sPropertySchema);
            var oCG = MiscFunctions.cloneObj(window.lookupWordBySlug);
            oCG[newPropertySlug] = oNewProperty;
            oPropertySchema = MiscFunctions.updateSchemaWithNewRel(oPropertySchema,oNewRel,oCG)
            var sPropertySchemaUpdated = JSON.stringify(oPropertySchema,null,4);
            jQuery("#rightColTextarea2").val(sPropertySchemaUpdated);
        })
        jQuery("#updatesStep3Button").click(function(){
            console.log("updatesStep3Button clicked")
            var sPropertySchema = jQuery("#rightColTextarea2").val();
            var oPropertySchema = JSON.parse(sPropertySchema);
            MiscFunctions.createOrUpdateWordInAllTables(oPropertySchema);
            jQuery(".newPropertyContainer").each(function(){
                var status = jQuery(this).data("status");
                if (status=="empty") {
                    // do not update
                    console.log("do not update")
                }
                if (status=="updated") {
                    var sNewProperty = jQuery(this).val();
                    console.log("update with new property: "+sNewProperty)
                    var oNewProperty = JSON.parse(sNewProperty);
                    MiscFunctions.createOrUpdateWordInAllTables(oNewProperty);
                }
            })

        });
    }
    render() {
        var conceptGraphSqlID = window.currentConceptGraphSqlID;
        var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[conceptGraphSqlID].tableName;

        var conceptSqlID = window.currentConceptSqlID;
        var conceptSlug = window.aLookupConceptInfoBySqlID[conceptSqlID].slug;

        var oConcept = window.lookupWordBySlug[conceptSlug]
        var sConcept = JSON.stringify(oConcept,null,4)

        var jsonSchema_slug = oConcept.conceptData.nodes.JSONSchema.slug;
        var schema_slug = oConcept.conceptData.nodes.schema.slug;
        var wordType_slug = oConcept.conceptData.nodes.wordType.slug;
        var superset_slug = oConcept.conceptData.nodes.superset.slug;
        var concept_slug = oConcept.conceptData.nodes.concept.slug;
        var propertySchema_slug = oConcept.conceptData.nodes.propertySchema.slug;
        var primaryProperty_slug = oConcept.conceptData.nodes.primaryProperty.slug;
        var properties_slug = oConcept.conceptData.nodes.properties.slug;

        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Single Concept Initialization</div>

                        <div className="standardDoubleColumn" style={{fontSize:"12px"}} >
                            Step 1: make sure all special nodes are present and listed within the concept node<br/>
                            <div id="step1StatusUpdate" ></div>

                            <div className="doSomethingButton_small" id="updateAllStep1WordsButton" >UPDATE ALL</div>
                            <br/>

                            <div className="singleItemContainer">
                                <div className="leftColumnLeftPanel" >
                                    JSONSchema:
                                </div>
                                <div id="JSONSchemaSlugContainer" className="leftColumnRightPanel specialWordContainer" >
                                    {jsonSchema_slug}
                                    <div id="JSONSchemaMakeNewButton" className="doSomethingButton_small makeNewSpecialNode" data-status="present" data-specialwordname="JSONSchema" data-wordtype="JSONSchema" style={{display:"none"}} >
                                        make new
                                    </div>
                                </div>
                            </div>

                            <div className="singleItemContainer">
                                <div className="leftColumnLeftPanel" >
                                    schema:
                                </div>
                                <div id="JSONSchemaSlugContainer" className="leftColumnRightPanel specialWordContainer" >
                                    {schema_slug}
                                    <div id="schemaMakeNewButton" className="doSomethingButton_small makeNewSpecialNode" data-status="present" data-specialwordname="schema" data-wordtype="schema" style={{display:"none"}} >
                                        make new
                                    </div>
                                </div>
                            </div>

                            <div className="singleItemContainer">
                                <div className="leftColumnLeftPanel" >
                                    wordType:
                                </div>
                                <div id="wordTypeSlugContainer" className="leftColumnRightPanel specialWordContainer" >
                                    {wordType_slug}
                                    <div id="wordTypeMakeNewButton" className="doSomethingButton_small makeNewSpecialNode" data-status="present" data-specialwordname="wordType" data-wordtype="wordType" style={{display:"none"}} >
                                        make new
                                    </div>
                                </div>
                            </div>

                            <div className="singleItemContainer">
                                <div className="leftColumnLeftPanel" >
                                    superset:
                                </div>
                                <div id="supersetSlugContainer" className="leftColumnRightPanel specialWordContainer" >
                                    {superset_slug}
                                    <div id="supersetMakeNewButton" className="doSomethingButton_small makeNewSpecialNode" data-status="present" data-specialwordname="superset" data-wordtype="superset" style={{display:"none"}} >
                                        make new
                                    </div>
                                </div>
                            </div>

                            <div className="singleItemContainer">
                                <div className="leftColumnLeftPanel" >
                                    concept:
                                </div>
                                <div id="conceptSlugContainer" className="leftColumnRightPanel specialWordContainer" >
                                    {concept_slug}
                                    <div id="conceptMakeNewButton" className="doSomethingButton_small makeNewSpecialNode" data-status="present" data-specialwordname="concept" data-wordtype="concept" style={{display:"none"}} >
                                        make new
                                    </div>
                                </div>
                            </div>

                            <div className="singleItemContainer">
                                <div className="leftColumnLeftPanel" >
                                    propertySchema:
                                </div>
                                <div id="propertySchemaSlugContainer" className="leftColumnRightPanel specialWordContainer" >
                                    {propertySchema_slug}
                                    <div id="propertySchemaMakeNewButton" className="doSomethingButton_small makeNewSpecialNode" data-status="present" data-specialwordname="propertySchema" data-wordtype="schema" style={{display:"none"}} >
                                        make new
                                    </div>
                                </div>
                            </div>

                            <div className="singleItemContainer">
                                <div className="leftColumnLeftPanel" >
                                    properties:
                                </div>
                                <div id="propertiesSlugContainer" className="leftColumnRightPanel specialWordContainer" >
                                    {properties_slug}
                                    <div id="propertiesMakeNewButton" className="doSomethingButton_small makeNewSpecialNode" data-status="present" data-specialwordname="properties" data-wordtype="set" style={{display:"none"}} >
                                        make new
                                    </div>
                                </div>
                            </div>

                            <div className="singleItemContainer">
                                <div className="leftColumnLeftPanel" >
                                    primaryProperty:
                                </div>
                                <div id="primaryPropertySlugContainer" className="leftColumnRightPanel specialWordContainer" >
                                    {primaryProperty_slug}
                                    <div id="primaryPropertyMakeNewButton" className="doSomethingButton_small makeNewSpecialNode" data-status="present" data-specialwordname="primaryProperty" data-wordtype="property" style={{display:"none"}} >
                                        make new
                                    </div>
                                </div>
                            </div>

                            <textarea id="specialWordContainer_JSONSchema" className="specialWordInitializationTextarea" >specialWordContainer_JSONSchema</textarea>
                            <textarea id="specialWordContainer_schema" className="specialWordInitializationTextarea" >specialWordContainer_JSONSchema</textarea>
                            <textarea id="specialWordContainer_concept" className="specialWordInitializationTextarea" >specialWordContainer_JSONSchema</textarea>
                            <textarea id="specialWordContainer_wordType" className="specialWordInitializationTextarea" >specialWordContainer_JSONSchema</textarea>
                            <textarea id="specialWordContainer_superset" className="specialWordInitializationTextarea" >specialWordContainer_JSONSchema</textarea>
                            <textarea id="specialWordContainer_primaryProperty" className="specialWordInitializationTextarea" >specialWordContainer_JSONSchema</textarea>
                            <textarea id="specialWordContainer_propertySchema" className="specialWordInitializationTextarea" >specialWordContainer_JSONSchema</textarea>
                            <textarea id="specialWordContainer_properties" className="specialWordInitializationTextarea" >specialWordContainer_JSONSchema</textarea>

                            <br/>
                            <div id="step2UpdateContainer">
                                Step 2: make sure all basic relationships are present within the schema node<br/>
                                <div id="step2StatusUpdate" ></div>

                                <div className="doSomethingButton_small" id="updateBothStep2WordsButton" >UPDATE BOTH SCHEMAS (main schema + property schema)</div>
                                <br/><br/>

                                <div className="singleItemContainer" >
                                    <div className="step2_panel1" >
                                        nodeFrom
                                    </div>
                                    <div className="step2_panel2" >
                                        relType
                                    </div>
                                    <div className="step2_panel3" >
                                        nodeTo
                                    </div>
                                    <div className="step2_panel4" >
                                        status
                                    </div>
                                </div>

                                {this.state.step2Relationships.map(oRel => (
                                    <div className="singleItemContainer" >
                                        <div className="step2_panel1" >{oRel.nodeFrom}</div>
                                        <div className="step2_panel2" >{oRel.relType}</div>
                                        <div className="step2_panel3" >{oRel.nodeTo}</div>
                                        <div className="step2_panel4" id={oRel.relID} >{oRel.status}</div>
                                    </div>
                                ))}

                            </div>

                            <br/>

                            <div id="step3UpdateContainer" style={{display:"none"}}>
                                Step 3: add starter properties: slug, name, title, description<br/>
                                <div id="step3StatusUpdate" ></div>

                                <div className="doSomethingButton_small" id="updatesStep3Button" >ALL UPDATES (add new property(ies) + update property schema)</div>
                                <br/><br/>

                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        name:
                                    </div>
                                    <div id="namePropertySlugContainer" className="leftColumnRightPanel starterPropertyContainer" >
                                        exist already?
                                        <div id="namePropertyMakeNewButton" className="doSomethingButton_small makeNewPropertyNode" data-status="present" data-starterpropertyname="name" >
                                            make new
                                        </div>
                                    </div>
                                </div>

                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        title:
                                    </div>
                                    <div id="titlePropertySlugContainer" className="leftColumnRightPanel starterPropertyContainer" >
                                        exist already?
                                        <div id="titlePropertyMakeNewButton" className="doSomethingButton_small makeNewPropertyNode" data-status="present" data-starterpropertyname="title" >
                                            make new
                                        </div>
                                    </div>
                                </div>

                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        slug:
                                    </div>
                                    <div id="slugPropertySlugContainer" className="leftColumnRightPanel starterPropertyContainer" >
                                        exist already?
                                        <div id="slugPropertyMakeNewButton" className="doSomethingButton_small makeNewPropertyNode" data-status="present" data-starterpropertyname="slug" >
                                            make new
                                        </div>
                                    </div>
                                </div>

                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        description:
                                    </div>
                                    <div id="descriptionPropertySlugContainer" className="leftColumnRightPanel starterPropertyContainer" >
                                        exist already?
                                        <div id="descriptionPropertyMakeNewButton" className="doSomethingButton_small makeNewPropertyNode" data-status="present" data-starterpropertyname="description" >
                                            make new
                                        </div>
                                    </div>
                                </div>

                                <br/>
                                <div id="newProperty_name_container" >
                                    name:<br/>
                                    <div>
                                        <textarea className="newPropertyContainer" data-status="empty" id="starterPropertyRawFileContainer_name" style={{width:"300px",height:"100px",display:"inline-block"}} >starterPropertyRawFileContainer_name</textarea>
                                        <textarea id="starterPropertyNewRelContainer_name" style={{width:"300px",height:"100px",display:"inline-block"}} >starterPropertyNewRelContainer_name</textarea>
                                    </div>
                                </div>

                                <br/>
                                <div id="newProperty_title_container" >
                                    title:<br/>
                                    <div>
                                        <textarea className="newPropertyContainer" data-status="empty" id="starterPropertyRawFileContainer_title" style={{width:"300px",height:"100px",display:"inline-block"}} >starterPropertyRawFileContainer_title</textarea>
                                        <textarea id="starterPropertyNewRelContainer_title" style={{width:"300px",height:"100px",display:"inline-block"}} >starterPropertyNewRelContainer_title</textarea>
                                    </div>
                                </div>

                                <br/>
                                <div id="newProperty_slug_container" >
                                    slug:<br/>
                                    <div>
                                        <textarea className="newPropertyContainer" data-status="empty" id="starterPropertyRawFileContainer_slug" style={{width:"300px",height:"100px",display:"inline-block"}} >starterPropertyRawFileContainer_slug</textarea>
                                        <textarea id="starterPropertyNewRelContainer_slug" style={{width:"300px",height:"100px",display:"inline-block"}} >starterPropertyNewRelContainer_slug</textarea>
                                    </div>
                                </div>

                                <br/>
                                <div id="newProperty_description_container" >
                                    description:<br/>
                                    <div>
                                        <textarea className="newPropertyContainer" data-status="empty" id="starterPropertyRawFileContainer_description" style={{width:"300px",height:"100px",display:"inline-block"}} >starterPropertyRawFileContainer_description</textarea>
                                        <textarea id="starterPropertyNewRelContainer_description" style={{width:"300px",height:"100px",display:"inline-block"}} >starterPropertyNewRelContainer_description</textarea>
                                    </div>
                                </div>
                            </div>



                        </div>

                        <div className="standardDoubleColumn" >
                            <textarea id="rightColTextarea" style={{width:"80%",height:"80%"}} >
                                {sConcept}
                            </textarea>

                            <textarea id="rightColTextarea2" style={{width:"80%",height:"80%"}} >
                                rightColTextarea2
                            </textarea>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
