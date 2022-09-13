import React from "react";
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/singleConceptGraph_leftNav2.js';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");

const populateConceptGraphsTextareas = () => {
    makeExportFile_conceptGraph_core();
    makeExportFile_conceptGraph_conceptList();
    makeExportFile_conceptGraph_enumerations();
    makeExportFile_conceptGraph_entire();
}
const makeExportFile_conceptGraph_enumerations = () => {
    var oEnumerationsFile = {};

    var conceptGraphMainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug;
    var oConceptGraphMainSchema = window.lookupWordBySlug[conceptGraphMainSchema_slug];

    // incomplete
}

const parseEnumeration = (oEnumeration) => {
      var oEnumerationData = oEnumeration.enumerationData;
      /*
      oEnumerationData.nodeRolesManagement.uniqueID = null;
      oEnumerationData.nodeRolesManagement.role0_slugs = [];
      oEnumerationData.nodeRolesManagement.role3_slug = null;
      oEnumerationData.nodeRolesManagement.role4_slug = null;
      oEnumerationData.nodeRolesManagement.role5_slug = null;
      oEnumerationData.nodeRolesManagement.role6_slugs = [];
      oEnumerationData.nodeRolesManagement.role7_slugs = [];
      */
      delete oEnumerationData.slug;
      delete oEnumerationData.name;
      delete oEnumerationData.title;
      delete oEnumerationData.description;
      delete oEnumerationData.metaData;
      delete oEnumerationData.restrictsValueData.propertyPath;
      delete oEnumerationData.nodeRolesManagement;
      delete oEnumerationData.restrictsValueData.uniqueID;
      return oEnumerationData;
}

const makeExportFile_conceptGraph_entire = () => {
    var sCoreFile = jQuery("#cg_core_textarea").val();
    var oCoreFile = JSON.parse(sCoreFile)

    var sConceptList = jQuery("#cg_conceptList_textarea").val();
    var aConceptList = JSON.parse(sConceptList)

    var oExportFile = MiscFunctions.cloneObj(oCoreFile)

    var sConcept_entire = jQuery("#concept_entire_textarea").val();
    var oConcept_entire = JSON.parse(sConcept_entire)

    var oEnumerations = {};
    var aEnumerationsList = [];
    var superset_slug = "supersetFor_enumeration";
    var oSuperset = window.lookupWordBySlug[superset_slug];
    aEnumerationsList = oSuperset.globalDynamicData.specificInstances;
    for (var c=0;c<aEnumerationsList.length;c++) {
        var nextEnumerationSlug = aEnumerationsList[c];
        var oEnumeration = window.lookupWordBySlug[nextEnumerationSlug];
        var oEnumerationData = parseEnumeration(oEnumeration)
        oEnumerations[nextEnumerationSlug] = oEnumerationData;
    }

    oExportFile.concepts = oConcept_entire;
    oExportFile.enumerations = oEnumerations;

    var sExportFile = JSON.stringify(oExportFile,null,4)
    jQuery("#cg_entire_textarea").val(sExportFile);
    jQuery("#cg_entire_button").css("color","purple").data("state","created")
}

const makeExportFile_conceptGraph_core = () => {
    var oExportFile = {};

    var conceptGraphMainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug;
    var oConceptGraphMainSchema = window.lookupWordBySlug[conceptGraphMainSchema_slug];

    oExportFile.conceptGraphData = MiscFunctions.cloneObj(oConceptGraphMainSchema.conceptGraphData);

    delete oExportFile.conceptGraphData.schemas;

    var sExportFile = JSON.stringify(oExportFile,null,4)
    jQuery("#cg_core_textarea").val(sExportFile);
    jQuery("#cg_core_button").css("color","purple").data("state","created")
}

const makeExportFile_conceptGraph_conceptList = () => {
    var oExportFile = {};

    var conceptGraphMainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug;
    var oConceptGraphMainSchema = window.lookupWordBySlug[conceptGraphMainSchema_slug];

    oExportFile = MiscFunctions.cloneObj(oConceptGraphMainSchema.conceptGraphData.concepts);
    delete oExportFile.schemas;

    var sExportFile = JSON.stringify(oExportFile,null,4)
    jQuery("#cg_conceptList_textarea").val(sExportFile);
    jQuery("#cg_conceptList_button").css("color","purple").data("state","created")
}

const makeSpecificInstancesSelector = () => {
    var aList = [];

    var currentConcept_slug = jQuery("#conceptSelector option:selected").data("slug")
    console.log("makeSpecificInstancesSelector; currentConcept_slug: "+currentConcept_slug)
    var oConcept = window.lookupWordBySlug[currentConcept_slug];
    var superset_slug = oConcept.conceptData.nodes.superset.slug;
    var oSuperset = window.lookupWordBySlug[superset_slug];
    aList = oSuperset.globalDynamicData.specificInstances;

    var selectorHTML = "";
    selectorHTML += "<select id='specificInstancesSelector' >";

    for (var c=0;c<aList.length;c++) {
        var nextSlug = aList[c];
        selectorHTML += "<option ";
        selectorHTML += " data-slug='"+nextSlug+"' ";
        selectorHTML += " >";
        selectorHTML += nextSlug;
        selectorHTML += "</option>";
    }

    selectorHTML += "</select>";

    jQuery("#specificInstancesSelectorContainer").html(selectorHTML)

    jQuery("#specificInstancesSelector").change(function(){
        populateSpecificInstances_selected_textarea();
    })
}

const makePropertiesSelector = () => {
    var aList = [];

    var currentConcept_slug = jQuery("#conceptSelector option:selected").data("slug")
    var aWords = Object.keys(window.lookupWordBySlug)
    for (var c=0;c<aWords.length;c++) {
        var nextSlug = aWords[c];
        var oWord = window.lookupWordBySlug[nextSlug];
        if (oWord.hasOwnProperty("propertyData")) {
            if (oWord.wordData.hasOwnProperty("governingConcepts")) {
                if (oWord.wordData.governingConcepts.includes(currentConcept_slug)) {
                    aList.push(nextSlug)
                }
            }
        }
    }

    var selectorHTML = "";
    selectorHTML += "<select id='propertiesSelector' >";
    for (var c=0;c<aList.length;c++) {
        var nextSlug = aList[c];
        selectorHTML += "<option ";
        selectorHTML += " data-slug='"+nextSlug+"' ";
        selectorHTML += " >";
        selectorHTML += nextSlug;
        selectorHTML += "</option>";
    }
    selectorHTML += "</select>";

    jQuery("#propertiesSelectorContainer").html(selectorHTML)

    jQuery("#propertiesSelector").change(function(){
        populateProperties_selected_textarea();
    })
}

const makeEnumerationsSelector = () => {
    var aList = [];

    var superset_slug = "supersetFor_enumeration"
    var oSuperset = window.lookupWordBySlug[superset_slug];
    aList = oSuperset.globalDynamicData.specificInstances;

    var selectorHTML = "";
    selectorHTML += "<select id='enumerationsSelector' >";
    for (var c=0;c<aList.length;c++) {
        var nextSlug = aList[c];
        selectorHTML += "<option ";
        selectorHTML += " data-slug='"+nextSlug+"' ";
        selectorHTML += " >";
        selectorHTML += nextSlug;
        selectorHTML += "</option>";
    }
    selectorHTML += "</select>";

    jQuery("#enumerationsSelectorContainer").html(selectorHTML)

    jQuery("#enumerationsSelector").change(function(){
        populateEnumerations_selected_textarea();
    })
}

const makeSetsSelector = () => {
    var aList = [];

    var currentConcept_slug = jQuery("#conceptSelector option:selected").data("slug")
    console.log("makeSpecificInstancesSelector; currentConcept_slug: "+currentConcept_slug)
    var oConcept = window.lookupWordBySlug[currentConcept_slug];
    var superset_slug = oConcept.conceptData.nodes.superset.slug;
    var oSuperset = window.lookupWordBySlug[superset_slug];
    aList = oSuperset.globalDynamicData.subsets;

    var selectorHTML = "";
    selectorHTML += "<select id='setsSelector' >";
    for (var c=0;c<aList.length;c++) {
        var nextSlug = aList[c];
        selectorHTML += "<option ";
        selectorHTML += " data-slug='"+nextSlug+"' ";
        selectorHTML += " >";
        selectorHTML += nextSlug;
        selectorHTML += "</option>";
    }
    selectorHTML += "</select>";

    jQuery("#setsSelectorContainer").html(selectorHTML)

    jQuery("#setsSelector").change(function(){
        populateSets_selected_textarea();
    })
}

const makeConceptsSelector = () => {
    var aConceptList = [];
    var conceptGraphMainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug;
    var oConceptGraphMainSchema = window.lookupWordBySlug[conceptGraphMainSchema_slug];

    aConceptList = oConceptGraphMainSchema.conceptGraphData.concepts.sort();

    var selectorHTML = "";
    selectorHTML += "<select id='conceptSelector' >";

    for (var c=0;c<aConceptList.length;c++) {
        var concept_slug = aConceptList[c];
        var oConcept = window.lookupWordBySlug[concept_slug];
        var concept_name = oConcept.conceptData.name.singular;

        var nextRow_id = window.lookupSqlIDBySlug[concept_slug];

        selectorHTML += "<option ";
        selectorHTML += " data-slug='"+concept_slug+"' ";
        selectorHTML += " >";
        selectorHTML += concept_name;
        selectorHTML += "</option>";
    }
    selectorHTML += "</select>";

    jQuery("#conceptsSelectorContainer").html(selectorHTML)

    jQuery("#conceptSelector").change(function(){
        makeAllSelectors();
        populateAllTextareas()
    })
}
const makeAllSelectors = () => {
    makeSpecificInstancesSelector()
    makePropertiesSelector()
    makeSetsSelector()
    makeEnumerationsSelector()
}
const populateAllTextareas = () => {
    populateConceptsTextareas();
    populateSpecificInstancesTextareas();
    populatePropertiesTextareas();
    populateSetsTextareas();
    populateConceptGraphsTextareas()
}
const populateConceptsTextareas = () => {
    // selected
    populateConcepts_selected_textarea();
    // entire - do this last since I pull data from work above
    populateConcepts_list_entire_textarea();
}
const populateConcepts_list_entire_textarea = () => {
    var aConceptList = [];
    var conceptGraphMainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug;
    var oConceptGraphMainSchema = window.lookupWordBySlug[conceptGraphMainSchema_slug];
    aConceptList = oConceptGraphMainSchema.conceptGraphData.concepts.sort();

    var oConcepts_entire = {};

    for (var c=0;c<aConceptList.length;c++) {
        var concept_slug = aConceptList[c];

        var oConcept = window.lookupWordBySlug[concept_slug];
        var propertyPath = oConcept.conceptData.propertyPath;

        var superset_slug = oConcept.conceptData.nodes.superset.slug;
        var oSuperset = window.lookupWordBySlug[superset_slug];
        var mainSchema_slug = oConcept.conceptData.nodes.schema.slug;
        var oMainSchema = window.lookupWordBySlug[mainSchema_slug];
        var propertySchema_slug = oConcept.conceptData.nodes.propertySchema.slug;
        var oPropertySchema = window.lookupWordBySlug[propertySchema_slug];
        var wT_slug = oConcept.conceptData.nodes.wordType.slug;
        var oWordType = window.lookupWordBySlug[wT_slug]

        var oWordType_core = {};
        oWordType_core.wordTypeData = MiscFunctions.cloneObj(oWordType.wordTypeData)
        delete oWordType_core.wordTypeData.metaData;

        var oConcept_core = {};
        oConcept_core.conceptData = MiscFunctions.cloneObj(oConcept.conceptData)
        delete oConcept_core.conceptData.nodes;
        delete oConcept_core.conceptData.metaData;

        var oProperties_core = {};
        oProperties_core.governingConceptNameSingular = concept_slug;
        oProperties_core.propertiesData = {};
        oProperties_core.relationships = []; // might rename thie relationshipsForProperties

        var oSets_core = {};
        oSets_core.setsData = {};
        oSets_core.relationshipsForSets = [];

        var oSpecificInstances_core = {};
        oSpecificInstances_core.specificInstancesData = {};
        oSpecificInstances_core.relationshipsForSpecificInstances = [];

        var aPropertiesList = [];

        var aSetsList = oSuperset.globalDynamicData.subsets;
        // not sure whether to include superset_slug here -- probably not
        // aSetsList.push(superset_slug);

        var aSpecificInstancesList = oSuperset.globalDynamicData.specificInstances;

        var aWords = Object.keys(window.lookupWordBySlug)
        for (var w=0;w<aWords.length;w++) {
            var nextSlug = aWords[w];
            var oWord = window.lookupWordBySlug[nextSlug];
            if (oWord.hasOwnProperty("propertyData")) {
                if (oWord.wordData.hasOwnProperty("governingConcepts")) {
                    if (oWord.wordData.governingConcepts.includes(concept_slug)) {
                        aPropertiesList.push(nextSlug)
                    }
                }
            }
        }

        //////////////////// PROPERTIES ////////////////////
        // propertiesData
        for (var p=0;p<aPropertiesList.length;p++) {
            var property_slug = aPropertiesList[p];

            var oProperty = window.lookupWordBySlug[property_slug]
            // console.log("property_slug: "+property_slug+"; oProperty: "+JSON.stringify(oProperty,null,4))
            if (oProperty.propertyData.metaData.hasOwnProperty("governingConcept")) {
                if (oProperty.propertyData.metaData.governingConcept.hasOwnProperty("slug")) {
                    if (oProperty.propertyData.metaData.governingConcept.slug) {
                        var govConcept_slug = oProperty.propertyData.metaData.governingConcept.slug;
                        var oGoverningConcept = window.lookupWordBySlug[govConcept_slug]
                        var governingConceptNameSingular = oGoverningConcept.conceptData.name.singular;
                        oProperties_core.governingConceptNameSingular = governingConceptNameSingular;
                        oProperties_core.propertiesData[property_slug] = MiscFunctions.cloneObj(oProperty.propertyData)
                        oProperties_core.propertiesData[property_slug] = MiscFunctions.pareDownPropertyData(oProperties_core.propertiesData[property_slug])
                    }
                }
            }
        }
        // relationships (from propertySchema)
        // redundant
        // var propertySchema_slug = oGoverningConcept.conceptData.nodes.propertySchema.slug;
        // var oPropertySchema = window.lookupWordBySlug[propertySchema_slug];
        var aRels = oPropertySchema.schemaData.relationships;
        for (var r=0;r<aRels.length;r++) {
            var oNextRel = aRels[r];
            var rT_slug = oNextRel.relationshipType.slug;
            if (rT_slug == "addToConceptGraphProperties") {
                oProperties_core.relationships.push(oNextRel)
            }
        }

        ////////////////////////// SETS ////////////////////////////
        // setsData
        for (var p=0;p<aSetsList.length;p++) {
            var set_slug = aSetsList[p];
            var oSet = window.lookupWordBySlug[set_slug]
            var oSet_selected = {};
            if (oSet.hasOwnProperty("setData")) {
                oSet_selected = MiscFunctions.cloneObj(oSet.setData)
                // delete oSet_selected.setData.metaData;
            }
            if (oSet.hasOwnProperty("supersetData")) {
                oSet_selected = MiscFunctions.cloneObj(oSet.supersetData)
                // delete oSet_selected.supersetData.metaData;
            }
            oSets_core.setsData[set_slug] = oSet_selected;
        }

        // relationshipsForSets (from mainSchema )
        var aRels = oMainSchema.schemaData.relationships;
        for (var r=0;r<aRels.length;r++) {
            var oNextRel = aRels[r];
            var rT_slug = oNextRel.relationshipType.slug;
            if (rT_slug == "subsetOf") {
                oSets_core.relationshipsForSets.push(oNextRel)
            }
        }

        //////////////////// SPECIFIC INSTANCES ////////////////////
        // specificInstancesData
        for (var p=0;p<aSpecificInstancesList.length;p++) {
            var si_slug = aSpecificInstancesList[p];
            var oSi = window.lookupWordBySlug[si_slug]
            var oSi_selected = {};
            if (oSi.hasOwnProperty(propertyPath)) {
                oSi_selected = MiscFunctions.cloneObj(oSi[propertyPath])
            }
            oSpecificInstances_core.specificInstancesData[si_slug] = oSi_selected;
        }

        // relationshipsForSpecificInstances (from mainSchema )
        var aRels = oMainSchema.schemaData.relationships;
        for (var r=0;r<aRels.length;r++) {
            var oNextRel = aRels[r];
            var rT_slug = oNextRel.relationshipType.slug;
            if (rT_slug == "isASpecificInstanceOf") {
                oSpecificInstances_core.relationshipsForSpecificInstances.push(oNextRel)
            }
        }

        var oCore = Object.assign(oWordType_core,oConcept_core,oProperties_core,oSets_core,oSpecificInstances_core)
        oConcepts_entire[concept_slug] = oCore;
    }

    var sConcepts_entire = JSON.stringify(oConcepts_entire,null,4)
    var sConcepts_list = JSON.stringify(aConceptList,null,4)
    jQuery("#concept_entire_textarea").val(sConcepts_entire);
    jQuery("#concept_entire_button").css("color","purple").data("state","created")
    jQuery("#concept_list_textarea").val(sConcepts_list);
    jQuery("#concept_list_button").css("color","purple").data("state","created")

}
const populateConcepts_selected_textarea = () => {
    var concept_slug = jQuery("#conceptSelector option:selected").data("slug");
    var oConcept = window.lookupWordBySlug[concept_slug]

    var wT_slug = oConcept.conceptData.nodes.wordType.slug;
    var oWordType = window.lookupWordBySlug[wT_slug]
    var oWordType_core = {};
    oWordType_core.wordTypeData = MiscFunctions.cloneObj(oWordType.wordTypeData)
    // delete oWordType_core.wordData;
    // delete oWordType_core.globalDynamicData;
    // delete oWordType_core.metaData;
    delete oWordType_core.wordTypeData.metaData;

    var oConcept_core = MiscFunctions.cloneObj(oConcept)
    delete oConcept_core.wordData;
    delete oConcept_core.globalDynamicData;
    delete oConcept_core.metaData;
    delete oConcept_core.conceptData.nodes;
    delete oConcept_core.conceptData.metaData;

    var oCore = Object.assign(oWordType_core,oConcept_core)
    var sCore = JSON.stringify(oCore,null,4)
    jQuery("#concept_core_textarea").val(sCore);
    jQuery("#concept_core_button").css("color","purple").data("state","created")
}
const populateSpecificInstancesTextareas = () => {
    // selected
    populateSpecificInstances_selected_textarea();
    // tree
    populateSpecificInstances_tree_textarea();
    // entire - do this last since I pull data from work above
    populateSpecificInstances_list_entire_textarea();
}
const populateSpecificInstances_list_entire_textarea = () => {
    var currentConcept_slug = jQuery("#conceptSelector option:selected").data("slug")
    // console.log("makeSpecificInstancesSelector; currentConcept_slug: "+currentConcept_slug)
    var oConcept = window.lookupWordBySlug[currentConcept_slug];
    var propertyPath = oConcept.conceptData.propertyPath;
    var superset_slug = oConcept.conceptData.nodes.superset.slug;
    var oSuperset = window.lookupWordBySlug[superset_slug];
    var aSpecificInstances = oSuperset.globalDynamicData.specificInstances;

    var oSpecificInstances_all = {};
    oSpecificInstances_all.governingConcept = {};
    oSpecificInstances_all.governingConcept.slug = currentConcept_slug;
    oSpecificInstances_all.specificInstancesData = {};

    for (var a=0;a<aSpecificInstances.length;a++) {
        var nextSpecificInstance_slug = aSpecificInstances[a];
        var oNextSpecificInstance = window.lookupWordBySlug[nextSpecificInstance_slug];
        var oNextParedDownSpecificInstanceData = {}
        if (oNextSpecificInstance.hasOwnProperty(propertyPath)) {
            oNextParedDownSpecificInstanceData[propertyPath] = MiscFunctions.cloneObj(oNextSpecificInstance[propertyPath])
        } else {
            oNextParedDownSpecificInstanceData[propertyPath] = {};
        }
        delete oNextParedDownSpecificInstanceData[propertyPath].metaData;
        oSpecificInstances_all.specificInstancesData[nextSpecificInstance_slug] = oNextParedDownSpecificInstanceData;
    }

    var sSpecificInstances_tree = jQuery("#si_tree_textarea").val();
    var oSpecificInstances_tree = JSON.parse(sSpecificInstances_tree)
    oSpecificInstances_all.relationships = oSpecificInstances_tree.relationships;

    var sSpecificInstances_all = JSON.stringify(oSpecificInstances_all,null,4)
    var sSpecificInstances_list = JSON.stringify(aSpecificInstances,null,4)
    jQuery("#si_all_textarea").val(sSpecificInstances_all);
    jQuery("#si_all_button").css("color","purple").data("state","created")
    jQuery("#si_list_textarea").val(sSpecificInstances_list);
    jQuery("#si_list_button").css("color","purple").data("state","created")

    jQuery("#concept_specificInstancesEntire_textarea").val(sSpecificInstances_all);
    jQuery("#concept_specificInstancesEntire_button").css("color","purple").data("state","created")
}
const populateSpecificInstances_tree_textarea = () => {
    var oSpecificInstances_tree = {};
    oSpecificInstances_tree.governingConcept = {};
    oSpecificInstances_tree.relationships = [];
    var currentConcept_slug = jQuery("#conceptSelector option:selected").data("slug")
    oSpecificInstances_tree.governingConcept.slug = currentConcept_slug;
    var oConcept = window.lookupWordBySlug[currentConcept_slug];
    var schema_slug = oConcept.conceptData.nodes.schema.slug;
    var oSchema = window.lookupWordBySlug[schema_slug];
    var aRels = oSchema.schemaData.relationships;
    for (var r=0;r<aRels.length;r++) {
        var oNextRel = aRels[r];
        var rT_slug = oNextRel.relationshipType.slug;
        if (rT_slug == "isASpecificInstanceOf") {
            oSpecificInstances_tree.relationships.push(oNextRel)
        }
        // oSpecificInstances_tree.relationships.push(oNextRel)
    }
    var sSpecificInstances_tree = JSON.stringify(oSpecificInstances_tree,null,4)
    jQuery("#si_tree_textarea").val(sSpecificInstances_tree);
    jQuery("#si_tree_button").css("color","purple").data("state","created")
}
const populateSpecificInstances_selected_textarea = () => {
    var concept_slug = jQuery("#conceptSelector option:selected").data("slug");
    var oConcept = window.lookupWordBySlug[concept_slug]
    var propertyPath = oConcept.conceptData.propertyPath;
    var specificInstance_slug = jQuery("#specificInstancesSelector option:selected").data("slug");
    if (!specificInstance_slug) {
        jQuery("#si_selected_textarea").val("");
    } else {
        var oSpecificInstance = window.lookupWordBySlug[specificInstance_slug]
        /*
        var oSpecificInstance_selected = MiscFunctions.cloneObj(oSpecificInstance)
        delete oSpecificInstance_selected.wordData;
        delete oSpecificInstance_selected.globalDynamicData;
        delete oSpecificInstance_selected.metaData;
        */
        var oSpecificInstance_selected = {};
        oSpecificInstance_selected.governingConcept = {};
        oSpecificInstance_selected.governingConcept.slug = concept_slug;
        if (oSpecificInstance.hasOwnProperty(propertyPath)) {
            oSpecificInstance_selected[propertyPath] = MiscFunctions.cloneObj(oSpecificInstance[propertyPath])
        } else {
            oSpecificInstance_selected[propertyPath] = {};
        }
        delete oSpecificInstance_selected[propertyPath].metaData;
        var sSpecificInstance_selected = JSON.stringify(oSpecificInstance_selected,null,4)
        jQuery("#si_selected_textarea").val(sSpecificInstance_selected);
        jQuery("#si_selected_button").css("color","purple").data("state","created")
    }
}
const populatePropertiesTextareas = () => {
    // selected
    populateProperties_selected_textarea();
    // tree
    populateProperties_tree_textarea();
    // entire - do this last since I pull data from work above
    populateProperties_list_entire_textarea();
}
const populateProperties_list_entire_textarea = () => {
    var currentConcept_slug = jQuery("#conceptSelector option:selected").data("slug")
    var oConcept = window.lookupWordBySlug[currentConcept_slug];
    var governingConceptNameSingular = oConcept.conceptData.name.singular;

    var aProperties = [];
    var aWords = Object.keys(window.lookupWordBySlug)
    for (var c=0;c<aWords.length;c++) {
        var nextSlug = aWords[c];
        var oWord = window.lookupWordBySlug[nextSlug];
        if (oWord.hasOwnProperty("propertyData")) {
            if (oWord.wordData.hasOwnProperty("governingConcepts")) {
                if (oWord.wordData.governingConcepts.includes(currentConcept_slug)) {
                    aProperties.push(nextSlug)
                }
            }
        }
    }

    var oProperties_entire = {};
    oProperties_entire.governingConceptNameSingular = governingConceptNameSingular;
    oProperties_entire.propertiesData = {};

    for (var a=0;a<aProperties.length;a++) {
        var nextProperty_slug = aProperties[a];
        var oNextProperty = window.lookupWordBySlug[nextProperty_slug];
        var oNextParedDownPropertyData = {}
        oNextParedDownPropertyData = MiscFunctions.pareDownPropertyData(oNextProperty.propertyData);
        oProperties_entire.propertiesData[nextProperty_slug] = oNextParedDownPropertyData;
    }

    var sProperties_tree = jQuery("#properties_tree_textarea").val();
    var oProperties_tree = JSON.parse(sProperties_tree)
    oProperties_entire.relationships = oProperties_tree.relationships;

    var sProperties_entire = JSON.stringify(oProperties_entire,null,4)
    var sProperties_list = JSON.stringify(aProperties,null,4)
    jQuery("#properties_entire_textarea").val(sProperties_entire);
    jQuery("#properties_entire_button").css("color","purple").data("state","created")
    jQuery("#properties_list_textarea").val(sProperties_list);
    jQuery("#properties_list_button").css("color","purple").data("state","created")

    jQuery("#concept_propertiesEntire_textarea").val(sProperties_entire);
    jQuery("#concept_propertiesEntire_button").css("color","purple").data("state","created")

}
const populateProperties_tree_textarea = () => {
    var currentConcept_slug = jQuery("#conceptSelector option:selected").data("slug")
    var oConcept = window.lookupWordBySlug[currentConcept_slug];
    var governingConceptNameSingular = oConcept.conceptData.name.singular;

    var oProperties_tree = {};
    oProperties_tree.governingConceptNameSingular = governingConceptNameSingular;
    oProperties_tree.relationships = [];

    var propertySchema_slug = oConcept.conceptData.nodes.propertySchema.slug;
    var oPropertySchema = window.lookupWordBySlug[propertySchema_slug];
    var aRels = oPropertySchema.schemaData.relationships;
    for (var r=0;r<aRels.length;r++) {
        var oNextRel = aRels[r];
        var rT_slug = oNextRel.relationshipType.slug;
        if (rT_slug == "addToConceptGraphProperties") {
            oProperties_tree.relationships.push(oNextRel)
        }
    }
    var sProperties_tree = JSON.stringify(oProperties_tree,null,4)
    jQuery("#properties_tree_textarea").val(sProperties_tree);
    jQuery("#properties_tree_button").css("color","purple").data("state","created")
}
const populateProperties_selected_textarea = () => {
      var property_slug = jQuery("#propertiesSelector option:selected").data("slug");
      if (!property_slug) {
          jQuery("#properties_selected_textarea").val("");
      } else {
          var oProperty = window.lookupWordBySlug[property_slug]

          var oProperty_selected = {};
          if (oProperty.propertyData.metaData.hasOwnProperty("governingConcept")) {
              if (oProperty.propertyData.metaData.governingConcept.hasOwnProperty("slug")) {
                  if (oProperty.propertyData.metaData.governingConcept.slug) {
                      var govConcept_slug = oProperty.propertyData.metaData.governingConcept.slug;
                      var oGoverningConcept = window.lookupWordBySlug[govConcept_slug]
                      var governingConceptNameSingular = oGoverningConcept.conceptData.name.singular;
                      oProperty_selected.governingConceptNameSingular = governingConceptNameSingular;
                  }
              }
          }
          oProperty_selected.propertyData = MiscFunctions.cloneObj(oProperty.propertyData)
          // delete oProperty_selected.wordData;
          // delete oProperty_selected.globalDynamicData;
          // delete oProperty_selected.metaData;
          oProperty_selected.propertyData = MiscFunctions.pareDownPropertyData(oProperty_selected.propertyData)
          var sProperty_selected = JSON.stringify(oProperty_selected,null,4)
          jQuery("#properties_selected_textarea").val(sProperty_selected);
          jQuery("#properties_selected_button").css("color","purple").data("state","created")
      }
}
const populateSetsTextareas = () => {
    populateEnumerations_selected_textarea()
    // selected
    populateSets_selected_textarea();
    // tree
    populateSets_tree_textarea();
    // entire - do this last since I pull data from work above
    populateSets_list_entire_textarea();
}
const populateSets_tree_textarea = () => {
    var oSets_tree = {};
    oSets_tree.relationships = [];
    var currentConcept_slug = jQuery("#conceptSelector option:selected").data("slug")
    var oConcept = window.lookupWordBySlug[currentConcept_slug];
    // var propertyPath = oConcept.conceptData.propertyPath;
    var schema_slug = oConcept.conceptData.nodes.schema.slug;
    var oSchema = window.lookupWordBySlug[schema_slug];
    var aRels = oSchema.schemaData.relationships;
    for (var r=0;r<aRels.length;r++) {
        var oNextRel = aRels[r];
        var rT_slug = oNextRel.relationshipType.slug;
        if (rT_slug == "subsetOf") {
            oSets_tree.relationships.push(oNextRel)
        }
    }
    var sSets_tree = JSON.stringify(oSets_tree,null,4)
    jQuery("#sets_tree_textarea").val(sSets_tree);
    jQuery("#sets_tree_button").css("color","purple").data("state","created")
}
const populateSets_list_entire_textarea = () => {
    console.log("populateSets_list_entire_textarea")
    var currentConcept_slug = jQuery("#conceptSelector option:selected").data("slug")
    var oConcept = window.lookupWordBySlug[currentConcept_slug];
    var propertyPath = oConcept.conceptData.propertyPath;
    var superset_slug = oConcept.conceptData.nodes.superset.slug;
    var oSuperset = window.lookupWordBySlug[superset_slug];
    var aSets = oSuperset.globalDynamicData.subsets;
    var oSets_entire = {};
    oSets_entire.setsData = {};
    for (var a=0;a<aSets.length;a++) {
        var nextSet_slug = aSets[a];
        var oNextSet = window.lookupWordBySlug[nextSet_slug];
        var oNextParedDownSetData = {}
        console.log("nextSet_slug: "+nextSet_slug+"; oNextSet: "+JSON.stringify(oNextSet,null,4))
        if (oNextSet.hasOwnProperty("setData")) {
            oNextParedDownSetData = MiscFunctions.cloneObj(oNextSet.setData);
            oNextParedDownSetData.superset = false;
        }
        if (oNextSet.hasOwnProperty("supersetData")) {
            oNextParedDownSetData = MiscFunctions.cloneObj(oNextSet.supersetData);
            oNextParedDownSetData.superset = true;
        }
        delete oNextParedDownSetData.metaData;
        oSets_entire.setsData[nextSet_slug] = {}
        oSets_entire.setsData[nextSet_slug].setData = oNextParedDownSetData;
    }

    var sSets_tree = jQuery("#sets_tree_textarea").val();
    var oSets_tree = JSON.parse(sSets_tree)
    oSets_entire.relationships = oSets_tree.relationships;

    var sSets_entire = JSON.stringify(oSets_entire,null,4)
    var sSets_list = JSON.stringify(aSets,null,4)
    jQuery("#sets_entire_textarea").val(sSets_entire);
    jQuery("#sets_entire_button").css("color","purple").data("state","created")
    jQuery("#sets_list_textarea").val(sSets_list);
    jQuery("#sets_list_button").css("color","purple").data("state","created")

    jQuery("#concept_setsEntire_textarea").val(sSets_entire);
    jQuery("#concept_setsEntire_button").css("color","purple").data("state","created")
}

const populateEnumerations_selected_textarea = () => {
    var enumeration_slug = jQuery("#enumerationsSelector option:selected").data("slug");
    console.log("populateEnumerations_selected_textarea; enumeration_slug: "+enumeration_slug)
    if (!enumeration_slug) {
        jQuery("#cg_enumerations_textarea").val("");
    } else {
        var oEnumeration = window.lookupWordBySlug[enumeration_slug];
        var oEnumeration_selected = {};
        oEnumeration_selected.enumerationData = MiscFunctions.cloneObj(oEnumeration.enumerationData)
        oEnumeration_selected.enumerationData = parseEnumeration(oEnumeration);
        var sEnumeration_selected = JSON.stringify(oEnumeration_selected,null,4)
        jQuery("#cg_enumerations_textarea").val(sEnumeration_selected);
        jQuery("#cg_enumerations_button").css("color","purple").data("state","created")
    }
}
const populateSets_selected_textarea = () => {
    var set_slug = jQuery("#setsSelector option:selected").data("slug");
    if (!set_slug) {
        jQuery("#sets_selected_textarea").val("");
    } else {
        var oSet = window.lookupWordBySlug[set_slug]
        var oSet_selected = MiscFunctions.cloneObj(oSet)
        delete oSet_selected.wordData;
        delete oSet_selected.globalDynamicData;
        delete oSet_selected.metaData;
        delete oSet_selected.setData.metaData;
        var sSet_selected = JSON.stringify(oSet_selected,null,4)
        jQuery("#sets_selected_textarea").val(sSet_selected);
        jQuery("#sets_selected_button").css("color","purple").data("state","created")
    }
}

const makeDictionarySelector = () => {
    var selectorHTML = "";
    selectorHTML += "<select id='dictionarySelector' >";

    var aList = Object.keys(window.lookupWordBySlug).sort();

    for (var c=0;c<aList.length;c++) {
        var nextSlug = aList[c];
        selectorHTML += "<option ";
        selectorHTML += " data-slug='"+nextSlug+"' ";
        selectorHTML += " >";
        selectorHTML += nextSlug;
        selectorHTML += "</option>";
    }

    selectorHTML += "</select>";

    jQuery("#dictionarySelectorContainer").html(selectorHTML)

    var word_slug = jQuery("#dictionarySelector option:selected").data("slug");
    populateDictionaryTextarea(word_slug);
    jQuery("#dictionarySelector").change(function(){
        jQuery(".exportPageButton1").css("backgroundColor","#DFDFDF")
        var word_slug = jQuery("#dictionarySelector option:selected").data("slug");
        populateDictionaryTextarea(word_slug)
    })
}

const populateDictionaryTextarea = (word_slug) => {
    if (!word_slug) {
        jQuery("#singleWordTextarea").val("");
    } else {
        var oWord = window.lookupWordBySlug[word_slug]
        var sWord = JSON.stringify(oWord,null,4)
        jQuery("#singleWordTextarea").val(sWord);
    }
}

const createOrUpdateCompactFile = async (conceptGraphTableName,sRawFile,filetype,slugForContext,description) => {
    var uniqueID = conceptGraphTableName + "-" + filetype + "-" + slugForContext;

    var sql = "";
    sql += "INSERT OR IGNORE INTO compactExports "
    sql += " (uniqueID,rawFile,conceptGraphTableName,filetype,slugForContext,description) ";
    sql += " VALUES(";
    sql += " '"+uniqueID+"', ";
    sql += " '"+sRawFile+"', ";
    sql += " '"+conceptGraphTableName+"', ";
    sql += " '"+filetype+"', ";
    sql += " '"+slugForContext+"', ";
    sql += " '"+description+"' ";
    sql += ") ";
    await sendAsync(sql);
    console.log("saveUpdateFileTypeButton clicked; uniqueID: "+uniqueID+"; sql: "+sql)

    var sql2 = "";
    sql2 += "UPDATE compactExports ";
    sql2 += " SET rawFile='"+sRawFile+"' ";
    sql2 += ", description = '"+description+"' ";
    sql2 += " WHERE uniqueID='"+uniqueID+"' ";
    await sendAsync(sql2);

    console.log("saveUpdateFileTypeButton clicked; uniqueID: "+uniqueID+"; sql2: "+sql2)
}

export default class SingleConceptGraphCompactExport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptGraphSqlID: null
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        // Left (larger) Panel
        makeConceptsSelector()

        jQuery(".contextSelectorButton").click(function(){
            // jQuery(".exportTextarea").css("display","none");
            jQuery(".filetypeContainer").css("display","none");
            var context = jQuery(this).data("context");
            // jQuery("#"+context+"_textarea").css("display","block");
            jQuery("#"+context+"_container").css("display","block");

            jQuery(".contextSelectorButton").css("backgroundColor","#DFDFDF")
            jQuery(this).css("backgroundColor","green")
        })

        makeAllSelectors();

        // make all export files
        // move to populateAllTextareas()
        // makeExportFile_conceptGraph_core();
        // makeExportFile_conceptGraph_conceptList();

        populateAllTextareas();

        // Right (smaller) Panel
        makeDictionarySelector()

        jQuery(".exportPageButton1").click(function(){
            jQuery(".exportPageButton1").css("backgroundColor","#DFDFDF")
            jQuery(this).css("backgroundColor","green")
            var showOnRight = jQuery(this).data("showonright")
            if (showOnRight=="conceptGraph") {
                var word_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug;
                populateDictionaryTextarea(word_slug)
            }
            if (showOnRight=="concept") {
                var word_slug = jQuery("#conceptSelector option:selected").data("slug");
                populateDictionaryTextarea(word_slug)
            }
            if (showOnRight=="specificInstance") {
                var word_slug = jQuery("#specificInstancesSelector option:selected").data("slug");
                populateDictionaryTextarea(word_slug)
            }
            if (showOnRight=="property") {
                var word_slug = jQuery("#propertiesSelector option:selected").data("slug");
                populateDictionaryTextarea(word_slug)
            }
            if (showOnRight=="set") {
                var word_slug = jQuery("#setsSelector option:selected").data("slug");
                populateDictionaryTextarea(word_slug)
            }
        })
        jQuery(".saveUpdateFileTypeButton").click(async function(){
            var filetype = jQuery(this).data("filetype")
            var sRawFile = jQuery("#"+filetype+"_textarea").val()
            var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName;
            var description = "";

            var slugForContext = "__notApplicable__";
            if ( (filetype=="concept_core") || (filetype=="concept_propertiesEntire") || (filetype=="concept_setsEntire") || (filetype=="concept_specificInstancesEntire") ) {
                slugForContext = jQuery("#conceptSelector option:selected").data("slug")
            }
            if (filetype=="si_all") {
                slugForContext = jQuery("#conceptSelector option:selected").data("slug")
            }
            if (filetype=="si_selected") {
                slugForContext = jQuery("#specificInstancesSelector option:selected").data("slug")
            }
            if (filetype=="properties_selected") {
                slugForContext = jQuery("#propertiesSelector option:selected").data("slug")
            }
            if (filetype=="sets_selected") {
                slugForContext = jQuery("#setsSelector option:selected").data("slug")
            }

            createOrUpdateCompactFile(conceptGraphTableName,sRawFile,filetype,slugForContext,description)
        })
        jQuery("#saveUpdateAllButton").click(function(){
            // console.log("saveUpdateAllButton clicked")
            var description = "";
            var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName;
            jQuery(".contextSelectorButton").each(function(){
                var state = jQuery(this).data("state")
                var filetype = jQuery(this).data("context")
                var slugForContext = "__notApplicable__";
                // console.log("saveUpdateAllButton; filetype: "+filetype)
                if ( (filetype=="concept_core") || (filetype=="concept_propertiesEntire") || (filetype=="concept_setsEntire") || (filetype=="concept_specificInstancesEntire") ) {
                    slugForContext = jQuery("#conceptSelector option:selected").data("slug")
                    // console.log("saveUpdateAllButton; slugForContext: "+slugForContext)
                }

                if (filetype=="si_all") {
                    slugForContext = jQuery("#conceptSelector option:selected").data("slug")
                }
                if (filetype=="si_selected") {
                    slugForContext = jQuery("#specificInstancesSelector option:selected").data("slug")
                }
                if (filetype=="properties_selected") {
                    slugForContext = jQuery("#propertiesSelector option:selected").data("slug")
                }
                if (filetype=="sets_selected") {
                    slugForContext = jQuery("#setsSelector option:selected").data("slug")
                }
                // console.log("saveUpdateAllButton; filetype: "+filetype+"; state: "+state)
                if (state=="created") {
                    var sRawFile = jQuery("#"+filetype+"_textarea").val();
                    // console.log("sRawFile: "+sRawFile);
                    createOrUpdateCompactFile(conceptGraphTableName,sRawFile,filetype,slugForContext,description)
                }
            })
        })
        jQuery("#deleteAllButton").click( async function(){
            console.log("deleteAllButton clicked")
            var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName;
            var sql = "";
            sql += " DELETE FROM compactExports WHERE conceptGraphTableName='"+conceptGraphTableName+"' ";
            console.log("deleteAllButton sql: "+sql)
            await sendAsync(sql);
        });
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" style={{backgroundColor:"#CFCFCF"}} >
                        <ConceptGraphMasthead />
                        <div class="h2">Concept Graph Compact Export Files</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>
                        <div style={{width:"700px",display:"inline-block"}}>
                            <div style={{fontSize:"12px",width:"100%",backgroundColor:"#EFEFEF",border:"1px dashed grey",padding:"3px"}}>
                            <i>Compact Export Files</i> allow for all essential data within a concept graph (or an individual concept) to be exported in JSON format,
                            sufficient to rebuilt the entire Concept Graph from scratch, but without IPFS (or IPNS) pointers to any specific files (other than possibly the Export Files themselves).
                            These are intended to be as compact as possible. globalDynamicData and metaData, in particular, are absent from Compact Export Files.
                            </div>

                            <div>
                                <div className="exportPageElem1" >
                                    <div style={{width:"150px",display:"inline-block",marginRight:"30px"}}>
                                    Concept Graph:
                                    </div>
                                    <div id="enumerationsSelectorContainer" style={{display:"inline-block"}}>selector</div>
                                    <div data-showonright="conceptGraph" className="doSomethingButton_small exportPageButton1" > ==> </div>
                                </div>
                                <div style={{marginLeft:"75px"}} >
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="cg_entire_button" data-context="cg_entire" >ENTIRE</div>
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="cg_core_button" data-context="cg_core" >Core only</div>
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="cg_conceptList_button" data-context="cg_conceptList" >conceptList</div>
                                    <div style={{display:"inline-block",fontSize:"22px",color:"purple"}}> | </div>
                                    <div style={{display:"inline-block",fontSize:"12px",color:"black",verticalAlign:"sub",marginLeft:"5px"}}> selected: </div>
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="cg_enumerations_button" data-context="cg_enumerations" >Enumeration</div>
                                </div>
                            </div>

                            <div>
                                <div className="exportPageElem1" >
                                    <div style={{width:"150px",display:"inline-block",marginRight:"30px"}}>
                                    Concepts:
                                    </div>
                                    <div id="conceptsSelectorContainer" style={{display:"inline-block"}}>selector</div>
                                    <div data-showonright="concept" className="doSomethingButton_small exportPageButton1" > ==> </div>
                                </div>
                                <div style={{marginLeft:"75px"}} >
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="concept_entire_button" data-context="concept_entire" >ENTIRE</div>
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="concept_list_button" data-context="concept_list" >list</div>
                                    <div style={{display:"inline-block",fontSize:"22px",color:"purple"}}> | </div>
                                    <div style={{display:"inline-block",fontSize:"12px",color:"black",verticalAlign:"sub",marginLeft:"5px"}}> selected: </div>
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="concept_core_button" data-context="concept_core" >core</div>
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="concept_propertiesEntire_button" data-context="concept_propertiesEntire" >properties</div>
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="concept_setsEntire_button" data-context="concept_setsEntire" >sets</div>
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="concept_specificInstancesEntire_button" data-context="concept_specificInstancesEntire" >specific instances</div>
                                </div>
                            </div>

                            <div>
                                <div className="exportPageElem1" >
                                    <div style={{width:"150px",display:"inline-block",marginRight:"30px"}}>
                                    specific instances:
                                    </div>
                                    <div id="specificInstancesSelectorContainer" style={{display:"inline-block"}}>selector</div>
                                    <div data-showonright="specificInstance" className="doSomethingButton_small exportPageButton1" > ==> </div>
                                </div>
                                <div style={{marginLeft:"75px"}} >
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="si_all_button" data-context="si_all" >ENTIRE</div>
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="si_list_button" data-context="si_list" >list</div>
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="si_tree_button" data-context="si_tree" >tree</div>
                                    <div style={{display:"inline-block",fontSize:"22px",color:"purple"}}> | </div>
                                    <div style={{display:"inline-block",fontSize:"12px",color:"black",verticalAlign:"sub",marginLeft:"5px"}}> selected: </div>
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="si_selected_button" data-context="si_selected" >core</div>
                                </div>
                            </div>

                            <div>
                                <div className="exportPageElem1" >
                                    <div style={{width:"150px",display:"inline-block",marginRight:"30px"}}>
                                    properties:
                                    </div>
                                    <div id="propertiesSelectorContainer" style={{display:"inline-block"}}>selector</div>
                                    <div data-showonright="property" className="doSomethingButton_small exportPageButton1" > ==> </div>
                                </div>
                                <div style={{marginLeft:"75px"}} >
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="properties_entire_button" data-context="properties_entire" >ENTIRE</div>
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="properties_list_button" data-context="properties_list" >list</div>
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="properties_tree_button" data-context="properties_tree" >tree</div>
                                    <div style={{display:"inline-block",fontSize:"22px",color:"purple"}}> | </div>
                                    <div style={{display:"inline-block",fontSize:"12px",color:"black",verticalAlign:"sub",marginLeft:"5px"}}> selected: </div>
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="properties_selected_button" data-context="properties_selected" >core</div>
                                </div>
                            </div>

                            <div>
                                <div className="exportPageElem1" >
                                    <div style={{width:"150px",display:"inline-block",marginRight:"30px"}}>
                                    sets:
                                    </div>
                                    <div id="setsSelectorContainer" style={{display:"inline-block"}}>selector</div>
                                    <div data-showonright="set" className="doSomethingButton_small exportPageButton1" > ==> </div>
                                </div>
                                <div style={{marginLeft:"75px"}} >
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="sets_entire_button" data-context="sets_entire" >ENTIRE</div>
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="sets_list_button" data-context="sets_list" >list</div>
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="sets_tree_button" data-context="sets_tree" >tree</div>
                                    <div style={{display:"inline-block",fontSize:"22px",color:"purple"}}> | </div>
                                    <div style={{display:"inline-block",fontSize:"12px",color:"black",verticalAlign:"sub",marginLeft:"5px"}}> selected: </div>
                                    <div className="doSomethingButton contextSelectorButton" data-state="notCreated" id="sets_selected_button" data-context="sets_selected" >core</div>
                                </div>
                            </div>

                            <div style={{fontSize:"14px"}}>
                            save / update ALL files (purple)<div id="saveUpdateAllButton" className="doSomethingButton" >save / update</div>
                            delete ALL SQL files (this conceptGraph) <div id="deleteAllButton" className="doSomethingButton" >DELETE</div>
                            </div>

                            <div id="cg_entire_container" className="filetypeContainer">
                                <div data-filetype="cg_entire" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: cg_entire
                                <textarea id="cg_entire_textarea" className="exportTextarea" style={{display:"block"}}>
                                cg_entire_textarea
                                </textarea>
                            </div>
                            <div id="cg_core_container" className="filetypeContainer">
                                <div data-filetype="cg_core" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: cg_core
                                <textarea id="cg_core_textarea" className="exportTextarea" >
                                cg_core_textarea
                                </textarea>
                            </div>
                            <div id="cg_conceptList_container" className="filetypeContainer">
                                <div data-filetype="cg_conceptList" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: cg_conceptList
                                <textarea id="cg_conceptList_textarea" className="exportTextarea" >
                                cg_conceptList_textarea
                                </textarea>
                            </div>
                            <div id="cg_enumerations_container" className="filetypeContainer">
                                <div data-filetype="cg_enumerations" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: cg_enumerations
                                <textarea id="cg_enumerations_textarea" className="exportTextarea" >
                                cg_enumerations_textarea
                                </textarea>
                            </div>

                            <div id="concept_entire_container" className="filetypeContainer">
                                <div data-filetype="concept_entire" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: concept_entire
                                <textarea id="concept_entire_textarea" className="exportTextarea" >
                                concept_entire_textarea
                                </textarea>
                            </div>
                            <div id="concept_list_container" className="filetypeContainer">
                                <div data-filetype="concept_list" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: concept_list
                                <textarea id="concept_list_textarea" className="exportTextarea" >
                                concept_list_textarea
                                </textarea>
                            </div>
                            <div id="concept_core_container" className="filetypeContainer">
                                <div data-filetype="concept_core" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: concept_core
                                <textarea id="concept_core_textarea" className="exportTextarea" >
                                concept_core_textarea
                                </textarea>
                            </div>
                            <div id="concept_propertiesEntire_container" className="filetypeContainer">
                                <div data-filetype="concept_propertiesEntire" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: concept_propertiesEntire
                                <textarea id="concept_propertiesEntire_textarea" className="exportTextarea" >
                                concept_propertiesEntire_textarea
                                </textarea>
                            </div>
                            <div id="concept_setsEntire_container" className="filetypeContainer">
                                <div data-filetype="concept_setsEntire" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: concept_setsEntire
                                <textarea id="concept_setsEntire_textarea" className="exportTextarea" >
                                concept_setsEntire_textarea
                                </textarea>
                            </div>
                            <div id="concept_specificInstancesEntire_container" className="filetypeContainer">
                                <div data-filetype="concept_specificInstancesEntire" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: concept_specificInstancesEntire
                                <textarea id="concept_specificInstancesEntire_textarea" className="exportTextarea" >
                                concept_specificInstancesEntire_textarea
                                </textarea>
                            </div>

                            <div id="si_all_container" className="filetypeContainer">
                                <div data-filetype="si_all" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: si_all
                                <textarea id="si_all_textarea" className="exportTextarea" >
                                si_all_textarea
                                </textarea>
                            </div>
                            <div id="si_list_container" className="filetypeContainer">
                                <div data-filetype="si_list" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: si_list
                                <textarea id="si_list_textarea" className="exportTextarea" >
                                si_list_textarea
                                </textarea>
                            </div>
                            <div id="si_selected_container" className="filetypeContainer">
                                <div data-filetype="si_selected" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: si_selected
                                <textarea id="si_selected_textarea" className="exportTextarea" >
                                si_selected_textarea
                                </textarea>
                            </div>
                            <div id="si_tree_container" className="filetypeContainer">
                                <div data-filetype="si_tree" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: si_tree
                                <textarea id="si_tree_textarea" className="exportTextarea" >
                                si_tree_textarea
                                </textarea>
                            </div>

                            <div id="properties_entire_container" className="filetypeContainer">
                                <div data-filetype="properties_entire" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: properties_entire
                                <textarea id="properties_entire_textarea" className="exportTextarea" >
                                properties_entire_textarea
                                </textarea>
                            </div>
                            <div id="properties_list_container" className="filetypeContainer">
                                <div data-filetype="properties_list" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: properties_list
                                <textarea id="properties_list_textarea" className="exportTextarea" >
                                properties_list_textarea
                                </textarea>
                            </div>
                            <div id="properties_selected_container" className="filetypeContainer">
                                <div data-filetype="properties_selected" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: properties_selected
                                <textarea id="properties_selected_textarea" className="exportTextarea" >
                                properties_selected_textarea
                                </textarea>
                            </div>
                            <div id="properties_tree_container" className="filetypeContainer">
                                <div data-filetype="properties_tree" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: properties_tree
                                <textarea id="properties_tree_textarea" className="exportTextarea" >
                                properties_tree_textarea
                                </textarea>
                            </div>

                            <div id="sets_entire_container" className="filetypeContainer">
                                <div data-filetype="sets_entire" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: sets_entire
                                <textarea id="sets_entire_textarea" className="exportTextarea" >
                                sets_entire_textarea
                                </textarea>
                            </div>
                            <div id="sets_list_container" className="filetypeContainer">
                                <div data-filetype="sets_list" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: sets_list
                                <textarea id="sets_list_textarea" className="exportTextarea" >
                                sets_list_textarea
                                </textarea>
                            </div>
                            <div id="sets_selected_container" className="filetypeContainer">
                                <div data-filetype="sets_selected" class="doSomethingButton saveUpdateFileTypeButton" >save / update</div>
                                filetype: sets_selected
                                <textarea id="sets_selected_textarea" className="exportTextarea" >
                                sets_selected_textarea
                                </textarea>
                            </div>
                            <div id="sets_tree_container" className="filetypeContainer">
                                <div data-filetype="sets_tree" class="doSomethingButton saveUpdateFileTypeButton"  >save / update</div>
                                filetype: sets_tree
                                <textarea id="sets_tree_textarea" className="exportTextarea" >
                                sets_tree_textarea
                                </textarea>
                            </div>

                        </div>
                        <div style={{width:"600px",marginLeft:"10px",display:"inline-block",border:"1px dashed grey"}} >
                            <center>dictionary</center>
                            all words:<br/>
                            <div id="dictionarySelectorContainer"></div>

                            <textarea id="singleWordTextarea" style={{width:"95%",height:"800px"}}></textarea>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
