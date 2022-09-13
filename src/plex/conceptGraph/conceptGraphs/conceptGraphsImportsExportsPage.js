import React from "react";
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/conceptGraphs_leftNav2.js';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");

const updateConceptGraphRawfileFromIndividualConceptRawfiles = () => {
    var cgID = jQuery("#cg_entire_selector option:selected").data("cgid")
    var sCurrentConceptGraphRawfile = jQuery("#rawFileTextarea").val()
    var oCurrentConceptGraphRawfile = JSON.parse(sCurrentConceptGraphRawfile)

    var oCgRF = MiscFunctions.cloneObj(window.oCg_modified[cgID].rawFile);
    // console.log("oCgRF: "+JSON.stringify(oCgRF,null,4));

    jQuery(".conceptsListFieldsContainer").each(function(){
        var conceptNum = jQuery(this).data("conceptnum")
        var conceptNameSingular = jQuery("#conceptsList_nameSingular_"+conceptNum).val();
        var calculatedSlugSingular = MiscFunctions.convertNameToSlug(conceptNameSingular)
        var conceptSlug = "conceptFor_"+calculatedSlugSingular;
        oCgRF.concepts[conceptSlug] = JSON.parse(jQuery("#singleConceptRawFile_"+conceptNum).val());

    })
    // console.log("oCgRF: "+JSON.stringify(oCgRF,null,4));
    jQuery("#rawFileTextarea").val(JSON.stringify(oCgRF,null,4));
    window.oCg_modified[cgID].rawFile = MiscFunctions.cloneObj(oCgRF);

    if (JSON.stringify(window.oCg_entire[cgID].rawFile) == JSON.stringify(window.oCg_modified[cgID].rawFile)) {
        jQuery("#saveChangesButton").css("backgroundColor","#DFDFDF")
    }
    if (JSON.stringify(window.oCg_entire[cgID].rawFile) != JSON.stringify(window.oCg_modified[cgID].rawFile)) {
        jQuery("#saveChangesButton").css("backgroundColor","yellow")
    }
}
// window.oCg_modified[r]
const updateCurrentConceptGraphRawFile = () => {
    var cgID = jQuery("#cg_entire_selector option:selected").data("cgid")
    console.log("updateCurrentConceptGraphRawFile; cgID: "+cgID)
    var oCgRF = MiscFunctions.cloneObj(window.oCg_entire[cgID].rawFile);
    // console.log("updateCurrentConceptGraphRawFile; oCgRF A: "+JSON.stringify(oCgRF,null,4))
    oCgRF.conceptGraphData.slug = jQuery("#conceptGraphSlugTextarea").val();
    oCgRF.conceptGraphData.name = jQuery("#conceptGraphNameTextarea").val();
    oCgRF.conceptGraphData.title = jQuery("#conceptGraphTitleTextarea").val();
    oCgRF.conceptGraphData.description = jQuery("#conceptGraphDescriptionTextarea").val();
    oCgRF.conceptGraphData.concepts = [];

    jQuery(".conceptsListFieldsContainer").each(function(){
        var conceptNum = jQuery(this).data("conceptnum")
        var conceptNameSingular = jQuery("#conceptsList_nameSingular_"+conceptNum).val();
        var conceptNamePlural = jQuery("#conceptsList_namePlural_"+conceptNum).val();
        var calculatedSlugSingular = MiscFunctions.convertNameToSlug(conceptNameSingular)
        var calculatedSlugPlural = MiscFunctions.convertNameToSlug(conceptNamePlural)
        var calculatedTitleSingular = MiscFunctions.convertNameToTitle(conceptNameSingular)
        var calculatedTitlePlural = MiscFunctions.convertNameToTitle(conceptNamePlural)
        var conceptSlug = "conceptFor_"+calculatedSlugSingular;
        oCgRF.conceptGraphData.concepts.push(conceptSlug)

        var oConceptData = MiscFunctions.cloneObj(window.oConceptData);

        oConceptData.governingConceptNameSingular = conceptNameSingular;

        oConceptData.conceptData.slug = calculatedSlugSingular;
        oConceptData.conceptData.name.singular = conceptNameSingular
        oConceptData.conceptData.name.plural = conceptNamePlural
        oConceptData.conceptData.title = calculatedTitleSingular;

        oConceptData.conceptData.oName.singular = conceptNameSingular
        oConceptData.conceptData.oName.plural = conceptNamePlural

        oConceptData.conceptData.oSlug.singular = calculatedSlugSingular
        oConceptData.conceptData.oSlug.plural = calculatedSlugPlural

        oConceptData.conceptData.oTitle.singular = calculatedTitleSingular
        oConceptData.conceptData.oTitle.plural = calculatedTitlePlural

        oConceptData.conceptData.propertyPath = calculatedSlugSingular + "Data";

        // oConceptData.wordTypeData.slug = "wordTypeFor_"+calculatedSlugSingular;
        // oConceptData.wordTypeData.name = "word type for "+conceptNameSingular;
        // oConceptData.wordTypeData.title = "Word Type For "+calculatedTitleSingular;
        oConceptData.wordTypeData.slug = calculatedSlugSingular;
        oConceptData.wordTypeData.name = conceptNameSingular;
        oConceptData.wordTypeData.title = calculatedTitleSingular;

        var oPropertiesData = {};

        var propertySlug_primaryProperty = "primaryPropertyFor_"+calculatedSlugSingular;
        var propertySlug_slug = "propertyFor_"+calculatedSlugSingular+"_slug";
        var propertySlug_name = "propertyFor_"+calculatedSlugSingular+"_name";
        var propertySlug_title = "propertyFor_"+calculatedSlugSingular+"_title";
        var propertySlug_description = "propertyFor_"+calculatedSlugSingular+"_description";

        // primaryProperty
        var oPropertyData = MiscFunctions.cloneObj(window.oPropertyData_primaryProperty);
        oPropertyData.slug = calculatedSlugSingular+"Data";
        oPropertyData.key = calculatedSlugSingular+"Data";
        oPropertyData.name = conceptNameSingular+" data";
        oPropertyData.title = calculatedTitleSingular+" Data";
        oPropertyData.description = "data about this "+ conceptNameSingular;
        oPropertyData.metaData.governingConcept.slug = "conceptFor_"+calculatedSlugSingular;
        if (!oPropertiesData.hasOwnProperty(propertySlug_primaryProperty)) {
            oPropertiesData[propertySlug_primaryProperty] = MiscFunctions.cloneObj(oPropertyData)
        }

        // slug
        var oPropertyData = MiscFunctions.cloneObj(window.oPropertyData_slug);
        oPropertyData.description = "the slug for this "+ conceptNameSingular;
        oPropertyData.metaData.governingConcept.slug = "conceptFor_"+calculatedSlugSingular;
        if (!oPropertiesData.hasOwnProperty(propertySlug_slug)) {
            oPropertiesData[propertySlug_slug] = MiscFunctions.cloneObj(oPropertyData)
        }

        // name
        var oPropertyData = MiscFunctions.cloneObj(window.oPropertyData_name);
        oPropertyData.description = "the name for this "+ conceptNameSingular;
        oPropertyData.metaData.governingConcept.slug = "conceptFor_"+calculatedSlugSingular;
        if (!oPropertiesData.hasOwnProperty(propertySlug_name)) {
            oPropertiesData[propertySlug_name] = MiscFunctions.cloneObj(oPropertyData)
        }

        // title
        var oPropertyData = MiscFunctions.cloneObj(window.oPropertyData_title);
        oPropertyData.description = "the title for this "+ conceptNameSingular;
        oPropertyData.metaData.governingConcept.slug = "conceptFor_"+calculatedSlugSingular;
        if (!oPropertiesData.hasOwnProperty(propertySlug_title)) {
            oPropertiesData[propertySlug_title] = MiscFunctions.cloneObj(oPropertyData)
        }

        // description
        var oPropertyData = MiscFunctions.cloneObj(window.oPropertyData_description);
        oPropertyData.description = "the description for this "+ conceptNameSingular;
        oPropertyData.metaData.governingConcept.slug = "conceptFor_"+calculatedSlugSingular;
        if (!oPropertiesData.hasOwnProperty(propertySlug_description)) {
            oPropertiesData[propertySlug_description] = MiscFunctions.cloneObj(oPropertyData)
        }

        oConceptData.propertiesData = oPropertiesData;

        oCgRF.concepts[conceptSlug] = oConceptData;
    })
    jQuery("#rawFileTextarea").val(JSON.stringify(oCgRF,null,4))
    window.oCg_modified[cgID].rawFile = oCgRF;

    // redo concepts - expanded block using updated names
    populateSingleConcepts(cgID,oCgRF);
    // console.log("updateCurrentConceptGraphRawFile; oCgRF B: "+JSON.stringify(oCgRF,null,4))
}

const update_cg_entire_file = async () => {
    var sqlID = jQuery("#cg_entire_selector option:selected").data("sqlid")
    var sRawFile = jQuery("#rawFileTextarea").val();
    // var oRawFile = JSON.parse(sRawFile);
    // var rF_slug = oRawFile.conceptGraphData.slug;

    var sql = "";
    sql += " UPDATE compactExports ";
    sql += " SET ";
    sql += " rawFile = '"+sRawFile+"' ";
    sql += " WHERE id = '"+sqlID+"' ";
    console.log("update_cg_entire_file sql: "+sql)
    await sendAsync(sql).then( (result) => {
        console.log("update_cg_entire_file; sql result: "+JSON.stringify(result,null,4))
        jQuery("#saveChangesButton").css("backgroundColor","#DFDFDF")
    });
}

const delete_cg_entire_file = async () => {
    var sqlID = jQuery("#cg_entire_selector option:selected").data("sqlid")
    var sRawFile = jQuery("#rawFileTextarea").val();
    var oRawFile = JSON.parse(sRawFile);
    var rF_slug = oRawFile.conceptGraphData.slug;
    var conceptGraphTableName = "myConceptGraph_"+rF_slug;

    var sql = "";
    sql += " DELETE FROM compactExports WHERE conceptGraphTableName='"+conceptGraphTableName+"' ";

    console.log("delete_cg_entire_file sql: "+sql)
    await sendAsync(sql).then( async (result) => {
        console.log("delete_cg_entire_file; sql result: "+JSON.stringify(result,null,4))
    });
}

const createNew_cg_entire_file = async () => {
    var cgID = jQuery("#cg_entire_selector option:selected").data("cgid")
    var sRawFile = jQuery("#rawFileTextarea").val();
    var oRawFile = JSON.parse(sRawFile);
    var rF_slug = oRawFile.conceptGraphData.slug;
    var conceptGraphTableName = "myConceptGraph_"+rF_slug;
    var filetype = "cg_entire";
    var slugForContext = "__notApplicable__";
    var description = "";
    var uniqueID = conceptGraphTableName + "-" + filetype + "-" + slugForContext;

    var sql = "";
    sql += " INSERT OR IGNORE INTO compactExports ";
    sql += " ( rawFile,conceptGraphTableName,filetype,slugForContext,description,uniqueID ) ";
    sql += " VALUES( '"+sRawFile+"', '"+conceptGraphTableName+"', '"+filetype+"', '"+slugForContext+"', '"+description+"', '"+uniqueID+"'  ) ";
    console.log("createNew_cg_entire_file sql: "+sql)
    await sendAsync(sql);
}

const loadCgEntireFiles = async () => {
    var sql = "";
    sql += " SELECT * from compactExports WHERE filetype='cg_entire' ";
    // sql += " SELECT * from compactExports ";

    var r = await sendAsync(sql).then( async (aResult) => {
        var selectorHTML = "";
        selectorHTML += "<select id='cg_entire_selector' >";
        window.oCg_entire = [];
        window.oCg_modified = [];
        console.log("loadCgEntireFiles; aResult.length: "+aResult.length)
        for (var r=0;r<aResult.length;r++) {
            var oNextFile = aResult[r];
            var nextFile_id = oNextFile.id;
            var nextFile_uniqueID = oNextFile.uniqueID;
            var nextFile_rawFile = oNextFile.rawFile;
            var nextFile_conceptGraphTableName = oNextFile.conceptGraphTableName;
            var nextFile_filetype = oNextFile.filetype;
            var nextFile_slugForContext = oNextFile.slugForContext;
            var nextFile_description = oNextFile.description;

            var oRawFile = JSON.parse(nextFile_rawFile);

            window.oCg_entire[r] = {}
            window.oCg_entire[r].sqlID = nextFile_id;
            window.oCg_entire[r].uniqueID = nextFile_uniqueID;
            window.oCg_entire[r].rawFile = oRawFile;
            window.oCg_entire[r].conceptGraphTableName = nextFile_conceptGraphTableName;
            window.oCg_entire[r].slugForContext = nextFile_slugForContext;
            window.oCg_entire[r].description = nextFile_description;
            window.oCg_entire[r].conceptsList = [];
            window.oCg_entire[r].propertiesByConcept = {};

            window.oCg_modified[r] = MiscFunctions.cloneObj(window.oCg_entire[r]);

            selectorHTML += "<option ";
            selectorHTML += " data-cgid='"+r+"' data-sqlid='"+nextFile_id+"' ";
            selectorHTML += " >";
            selectorHTML += nextFile_conceptGraphTableName;
            selectorHTML += "</option>";
        }
        var r = aResult.length;
        var nextFile_conceptGraphTableName = "myConceptGraph_blankConceptGraph"
        window.oCg_entire[r] = {}
        window.oCg_entire[r].rawFile = MiscFunctions.cloneObj(window.oBlankConceptGraphRawFile);
        window.oCg_entire[r].conceptGraphTableName = nextFile_conceptGraphTableName;

        window.oCg_modified[r] = MiscFunctions.cloneObj(window.oCg_entire[r]);
        // next load a blank concept graph
        selectorHTML += "<option ";
        selectorHTML += " data-cgid='"+r+"' ";
        selectorHTML += " >";
        selectorHTML += nextFile_conceptGraphTableName;
        selectorHTML += "</option>";

        selectorHTML += "</select>";

        jQuery("#cg_entire_selectorContainer").html(selectorHTML)

        populateExplorer();
        jQuery("#cgBasicInfoButton").get(0).click();
        jQuery("#cg_entire_selector").change(function(){
            // var cgID = jQuery(this).data("cgid")
            populateExplorer();
        })
    });
}

const addAnotherEnumerationPanel = (enumerationNumber,nextEnumeration_slug,oSingleEnumeration) => {
    var cgID = jQuery("#cg_entire_selector option:selected").data("cgid")
    var nodeFrom = oSingleEnumeration.restrictsValueData.nodeFrom.slug;
    var nodeTo = oSingleEnumeration.restrictsValueData.nodeTo.slug;
    var uniquePropertyKey = oSingleEnumeration.restrictsValueData.uniquePropertyKey;
    var withSubsets = oSingleEnumeration.restrictsValueData.withSubsets;
    var withDependencies = oSingleEnumeration.restrictsValueData.withDependencies;
    var dependenciesPlacement = oSingleEnumeration.restrictsValueData.dependenciesPlacement;
    var sSingleEnumeration = JSON.stringify(oSingleEnumeration,null,4)

    var aConcepts = Object.keys(window.oCg_modified[cgID].rawFile.concepts);

    // var returnConceptSlugGivenSetSlug = {};
    var aAllSets = [];
    var aAllSetsByConcept = {};
    for (var c=0;c<aConcepts.length;c++) {
        var nC_slug = aConcepts[c];
        var inferredSuperset_slug = "supersetFor_"+window.oCg_modified[cgID].rawFile.concepts[nC_slug].conceptData.slug;
        aAllSetsByConcept[nC_slug] = [inferredSuperset_slug];
        if (!aAllSets.includes(inferredSuperset_slug)) {
            aAllSets.push(inferredSuperset_slug)
        }
        var aSts = Object.keys(window.oCg_modified[cgID].rawFile.concepts[nC_slug].setsData);
        for (var z=0;z<aSts.length;z++) {
            var st_slug = aSts[z];
            // returnConceptSlugGivenSetSlug[st_slug] = nC_slug;
            if (!aAllSets.includes(st_slug)) {
                aAllSets.push(st_slug)
            }
            if (!aAllSetsByConcept[nC_slug].includes(st_slug)) {
                aAllSetsByConcept[nC_slug].push(st_slug)
            }
        }
    }
    var aAllProperties = [];
    var aAllPropertiesByConcept = {};
    for (var c=0;c<aConcepts.length;c++) {
        var nC_slug = aConcepts[c];
        var aProps = Object.keys(window.oCg_modified[cgID].rawFile.concepts[nC_slug].propertiesData);
        aAllPropertiesByConcept[nC_slug] = aProps;
        for (var z=0;z<aProps.length;z++) {
            var prop_slug = aProps[z];
            if (!aAllProperties.includes(prop_slug)) {
                aAllProperties.push(prop_slug)
            }
        }
    }

    var enumerationPanelHTML = "";
    enumerationPanelHTML += "<div id='singleEnumerationPanel_"+nextEnumeration_slug+"' class=compactFilesExplorerPageSingleEnumerationPanel ";
        enumerationPanelHTML += " data-slug='"+nextEnumeration_slug+"' ";
        enumerationPanelHTML += " >";
        enumerationPanelHTML += "<center>"+nextEnumeration_slug+"</center>";

        enumerationPanelHTML += "<div id='enumerationCoreInfo_"+nextEnumeration_slug+"' data-enumerationslug='"+nextEnumeration_slug+"' data-whichblock='core' class='doSomethingButton pickSingleEnumerationPanelButton' style='background-color:green;' >core info</div>";
        enumerationPanelHTML += "<div data-enumerationslug='"+nextEnumeration_slug+"' data-whichblock='rawJSON' class='doSomethingButton pickSingleEnumerationPanelButton' >raw JSON</div>";
        enumerationPanelHTML += "<div data-enumerationnumber='"+enumerationNumber+"' data-cgid='"+cgID+"' class='doSomethingButton saveUpdateEnumerationButton' >save / update</div>";

        enumerationPanelHTML += "<div class='singleEnumerationInfoBlock' id='block_enumeration_rawJSON_"+nextEnumeration_slug+"' style='display:none;' >";
            enumerationPanelHTML += "<center>raw JSON</center>";
            enumerationPanelHTML += "<textarea id='singleEnumerationRawfile_"+cgID+"_"+enumerationNumber+"' style='width:400px;height:500px;' >"+sSingleEnumeration+"</textarea>";
        enumerationPanelHTML += "</div>";

        enumerationPanelHTML += "<div class='singleEnumerationInfoBlock' id='block_enumeration_core_"+nextEnumeration_slug+"' style='display:block;' >";
            enumerationPanelHTML += "<center>core info</center>";
            enumerationPanelHTML += "<div>";
                enumerationPanelHTML += "<div class=compactFilesExplorerPage_leftField >nodeFrom:</div>"
                enumerationPanelHTML += "<div class=compactFilesEnumerationPage_rightField >";
                    enumerationPanelHTML += "<select id='setSelectorAllSetsForEnumerationPanel_nodeFrom_"+cgID+"_"+enumerationNumber+"' data-enumerationnumber='"+enumerationNumber+"' class=enumerationPanelAllSetsSelector >";
                    enumerationPanelHTML += "<option ";
                    enumerationPanelHTML += " data-setslug='_NONE_' ";
                    enumerationPanelHTML += " >";
                    enumerationPanelHTML += "</option>";
                    for (var c=0;c<aAllSets.length;c++) {
                        var nxtSet_slug = aAllSets[c];
                        enumerationPanelHTML += "<option ";
                        enumerationPanelHTML += " data-setslug='"+nxtSet_slug+"' ";
                        if (nxtSet_slug == nodeFrom) {
                            enumerationPanelHTML += " selected ";
                        }
                        enumerationPanelHTML += " >";
                        enumerationPanelHTML += nxtSet_slug
                        enumerationPanelHTML += "</option>";
                    }
                    enumerationPanelHTML += "</select>";

                    enumerationPanelHTML += "<br/>";

                    enumerationPanelHTML += "<textarea id='nodeFromTextarea_"+cgID+"_"+enumerationNumber+"'' style='width:400px;' >"+nodeFrom+"</textarea>"

                    enumerationPanelHTML += "<div>";
                    enumerationPanelHTML += "reset: ";
                    enumerationPanelHTML += "<div class=enumerationPanelConceptSelectorContainer>";
                        enumerationPanelHTML += "<select id='conceptSelectorForEnumerationPanel_nodeFrom_"+cgID+"_"+enumerationNumber+"' data-enumerationnumber='"+enumerationNumber+"' data-whichnode='nodeFrom' class=enumerationPanelConceptSelector >";
                        enumerationPanelHTML += "<option ";
                        enumerationPanelHTML += " data-enumerationnumber='"+enumerationNumber+"' ";
                        enumerationPanelHTML += " data-conceptslug='__NONE__' ";
                        enumerationPanelHTML += " >";
                        enumerationPanelHTML += "</option>";
                        for (var c=0;c<aConcepts.length;c++) {
                            var nxtConcept_slug = aConcepts[c];
                            enumerationPanelHTML += "<option ";
                            enumerationPanelHTML += " data-conceptslug='"+nxtConcept_slug+"' ";
                            enumerationPanelHTML += " >";
                            enumerationPanelHTML += nxtConcept_slug
                            enumerationPanelHTML += "</option>";
                        }
                        enumerationPanelHTML += "</select>";
                    enumerationPanelHTML += "</div>";
                    enumerationPanelHTML += "<div id='enumerationNodeFromSetSelectorContainer_"+enumerationNumber+"' class='enumerationNodeFromSetSelectorContainer' style='display:inline-block;background-color:grey;' >";
                    enumerationPanelHTML += "set selector";
                    enumerationPanelHTML += "</div>";

                    enumerationPanelHTML += "</div>";

                enumerationPanelHTML += "</div>";

            enumerationPanelHTML += "</div>";
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            enumerationPanelHTML += "<div>";
                enumerationPanelHTML += "<div class=compactFilesExplorerPage_leftField >nodeTo:</div>"
                enumerationPanelHTML += "<div class=compactFilesEnumerationPage_rightField >";
                    enumerationPanelHTML += "<select id='propertySelectorAllPropertiesForEnumerationPanel_nodeTo_"+cgID+"_"+enumerationNumber+"' data-enumerationnumber='"+enumerationNumber+"' class=enumerationPanelAllPropertiesSelector >";
                    enumerationPanelHTML += "<option ";
                    enumerationPanelHTML += " data-propertyslug='_NONE_' ";
                    enumerationPanelHTML += " >";
                    enumerationPanelHTML += "</option>";
                    for (var c=0;c<aAllProperties.length;c++) {
                        var nxtProp_slug = aAllProperties[c];
                        enumerationPanelHTML += "<option ";
                        enumerationPanelHTML += " data-propertyslug='"+nxtProp_slug+"' ";
                        if (nxtProp_slug == nodeTo) {
                            enumerationPanelHTML += " selected ";
                        }
                        enumerationPanelHTML += " >";
                        enumerationPanelHTML += nxtProp_slug
                        enumerationPanelHTML += "</option>";
                    }
                    enumerationPanelHTML += "</select>";

                    enumerationPanelHTML += "<br/>";

                    enumerationPanelHTML += "<textarea id='nodeToTextarea_"+cgID+"_"+enumerationNumber+"'' style='width:400px;' >"+nodeTo+"</textarea>"

                    enumerationPanelHTML += "<div>";;
                    enumerationPanelHTML += "reset: ";
                    enumerationPanelHTML += "<div class=enumerationPanelConceptSelectorContainer>";
                        enumerationPanelHTML += "<select id='conceptSelectorForEnumerationPanel_nodeTo_"+cgID+"_"+enumerationNumber+"' data-enumerationnumber='"+enumerationNumber+"' data-whichnode='nodeTo' class=enumerationPanelConceptSelector >";
                        enumerationPanelHTML += "<option ";
                        enumerationPanelHTML += " data-enumerationnumber='"+enumerationNumber+"' ";
                        enumerationPanelHTML += " data-conceptslug='__NONE__' ";
                        enumerationPanelHTML += " >";
                        enumerationPanelHTML += "</option>";
                        for (var c=0;c<aConcepts.length;c++) {
                            var nxtConcept_slug = aConcepts[c];
                            enumerationPanelHTML += "<option ";
                            enumerationPanelHTML += " data-conceptslug='"+nxtConcept_slug+"' ";
                            enumerationPanelHTML += " >";
                            enumerationPanelHTML += nxtConcept_slug
                            enumerationPanelHTML += "</option>";
                        }
                        enumerationPanelHTML += "</select>";
                        enumerationPanelHTML += "</div>";;
                    enumerationPanelHTML += "<div id='enumerationNodeToPropertySelectorContainer_"+enumerationNumber+"' class='enumerationNodeToPropertySelectorContainer' style='display:inline-block;background-color:grey;' >";
                    enumerationPanelHTML += "property selector";
                    enumerationPanelHTML += "</div>";
                enumerationPanelHTML += "</div>";
            enumerationPanelHTML += "</div>";
            enumerationPanelHTML += "<div class='miscEnumerationSelectorsContainer' data-enumerationnumber='"+enumerationNumber+"' >";
                enumerationPanelHTML += "<div class=compactFilesExplorerPage_leftField >uniquePropertyKey:</div>"
                enumerationPanelHTML += "<select id=uniquePropertyKeySelector >";
                enumerationPanelHTML += "<option data-uniquepropertykey='' ></option>";

                enumerationPanelHTML += "<option data-uniquepropertykey='slug' ";
                if (uniquePropertyKey=="slug") { enumerationPanelHTML += " selected "; }
                enumerationPanelHTML += " >slug</option>";

                enumerationPanelHTML += "<option data-uniquepropertykey='name' ";
                if (uniquePropertyKey=="name") { enumerationPanelHTML += " selected "; }
                enumerationPanelHTML += " >name</option>";

                enumerationPanelHTML += "<option data-uniquepropertykey='title' ";
                if (uniquePropertyKey=="title") { enumerationPanelHTML += " selected "; }
                enumerationPanelHTML += " >title</option>";

                enumerationPanelHTML += "</select>";
            enumerationPanelHTML += "</div>";
            enumerationPanelHTML += "<div class='miscEnumerationSelectorsContainer' data-enumerationnumber='"+enumerationNumber+"' >";
                enumerationPanelHTML += "<div class=compactFilesExplorerPage_leftField >withSubsets:</div>"
                enumerationPanelHTML += "<select id=withSubsetsSelector >";

                enumerationPanelHTML += "<option data-withsubsets=null ";
                if ((withSubsets=="null") || (withSubsets==null)) { enumerationPanelHTML += " selected "; }
                enumerationPanelHTML += " >null</option>";

                enumerationPanelHTML += "<option data-withsubsets=true ";
                if ((withSubsets=="true") || (withSubsets==true)) { enumerationPanelHTML += " selected "; }
                enumerationPanelHTML += " >true</option>";

                enumerationPanelHTML += "<option data-withsubsets=false ";
                if ((withSubsets=="false") || (withSubsets==false)) { enumerationPanelHTML += " selected "; }
                enumerationPanelHTML += " >false</option>";

                enumerationPanelHTML += "</select>";
            enumerationPanelHTML += "</div>";
            enumerationPanelHTML += "<div class='miscEnumerationSelectorsContainer' data-enumerationnumber='"+enumerationNumber+"' >";
                enumerationPanelHTML += "<div class=compactFilesExplorerPage_leftField >withDependencies:</div>"
                enumerationPanelHTML += "<select id=withDependenciesSelector >";

                enumerationPanelHTML += "<option data-withdependencies=null ";
                if ((withDependencies=="null") || (withDependencies==null)) { enumerationPanelHTML += " selected "; }
                enumerationPanelHTML += " >null</option>";

                enumerationPanelHTML += "<option data-withdependencies=true ";
                if ((withDependencies=="true") || (withDependencies==true)) { enumerationPanelHTML += " selected "; }
                enumerationPanelHTML += " >true</option>";

                enumerationPanelHTML += "<option data-withdependencies=false ";
                if ((withDependencies=="false") || (withDependencies==false)) { enumerationPanelHTML += " selected "; }
                enumerationPanelHTML += " >false</option>";

                enumerationPanelHTML += "</select>";
            enumerationPanelHTML += "</div>";
            enumerationPanelHTML += "<div class='miscEnumerationSelectorsContainer' data-enumerationnumber='"+enumerationNumber+"' >";
                enumerationPanelHTML += "<div class=compactFilesExplorerPage_leftField >dependenciesPlacement:</div>"
                enumerationPanelHTML += "<select id=dependenciesPlacementSelector >";

                enumerationPanelHTML += "<option data-dependenciesplacement=null ";
                if ((dependenciesPlacement=="null") || (dependenciesPlacement==null)) { enumerationPanelHTML += " selected "; }
                enumerationPanelHTML += " >null</option>";

                enumerationPanelHTML += "<option data-dependenciesplacement='upper' ";
                if (dependenciesPlacement=="upper") { enumerationPanelHTML += " selected "; }
                enumerationPanelHTML += " >upper</option>";

                enumerationPanelHTML += "<option data-dependenciesplacement='lower' ";
                if (dependenciesPlacement=="lower") { enumerationPanelHTML += " selected "; }
                enumerationPanelHTML += " >lower</option>";

                enumerationPanelHTML += "</select>";
            enumerationPanelHTML += "</div>";
        enumerationPanelHTML += "</div>";
    enumerationPanelHTML += "</div>";
    return enumerationPanelHTML;
}

const populateSingleEnumerations = (oRawFile) => {
    var oConceptGraphData = oRawFile.conceptGraphData;
    var oEnumerations = oRawFile.enumerations;
    var aEnumerationList = Object.keys(oEnumerations);

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // redundant; these steps also performed in other function
    // ? make separate fxn to recalculate these whenever used
    var cgID = jQuery("#cg_entire_selector option:selected").data("cgid")
    var aConcepts = Object.keys(window.oCg_modified[cgID].rawFile.concepts);
    var aAllSets = [];
    var aAllSetsByConcept = {};
    for (var c=0;c<aConcepts.length;c++) {
        var nC_slug = aConcepts[c];
        var inferredSuperset_slug = "supersetFor_"+window.oCg_modified[cgID].rawFile.concepts[nC_slug].conceptData.slug;
        aAllSetsByConcept[nC_slug] = [ inferredSuperset_slug ];
        if (!aAllSets.includes(inferredSuperset_slug)) {
            aAllSets.push(inferredSuperset_slug)
        }
        var aSts = Object.keys(window.oCg_modified[cgID].rawFile.concepts[nC_slug].setsData);
        for (var z=0;z<aSts.length;z++) {
            var st_slug = aSts[z];
            // returnConceptSlugGivenSetSlug[st_slug] = nC_slug;
            if (!aAllSets.includes(st_slug)) {
                aAllSets.push(st_slug)
            }
            if (!aAllSetsByConcept[nC_slug].includes(st_slug)) {
                aAllSetsByConcept[nC_slug].push(st_slug)
            }
        }
    }
    var aAllProperties = [];
    var aAllPropertiesByConcept = {};
    for (var c=0;c<aConcepts.length;c++) {
        var nC_slug = aConcepts[c];
        var aProps = Object.keys(window.oCg_modified[cgID].rawFile.concepts[nC_slug].propertiesData);
        aAllPropertiesByConcept[nC_slug] = aProps;
        for (var z=0;z<aProps.length;z++) {
            var prop_slug = aProps[z];
            if (!aAllProperties.includes(prop_slug)) {
                aAllProperties.push(prop_slug)
            }
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    jQuery("#singleEnumerationSelectorContainer").html("");
    jQuery("#singleEnumerationsPanelsContainer").html("");

    var enumerationSelectorHTML = "";
    enumerationSelectorHTML += "<select id=singleEnumerationSelector >";
    for (var a=0;a<aEnumerationList.length;a++) {
        var nextEnumeration_slug = aEnumerationList[a];
        var oSingleEnumeration = oEnumerations[nextEnumeration_slug];

        enumerationSelectorHTML += "<option data-slug='"+nextEnumeration_slug+"' >";
        enumerationSelectorHTML += nextEnumeration_slug;
        enumerationSelectorHTML += "</option>";

        var enumerationPanelHTML = addAnotherEnumerationPanel(a,nextEnumeration_slug,oSingleEnumeration);
        jQuery("#singleEnumerationsPanelsContainer").append(enumerationPanelHTML);
    }
    jQuery(".miscEnumerationSelectorsContainer").off().change(function(){
        var cgID = jQuery("#cg_entire_selector option:selected").data("cgid")
        var eNum = jQuery(this).data("enumerationnumber");
        redetermineEnumerationRawfile(cgID,eNum)
    })
    var nextEnumeration_slug = "newEnumeration";
    var oSingleEnumeration = MiscFunctions.cloneObj(window.oBlankEnumeration);
    var enumerationPanelHTML = addAnotherEnumerationPanel(aEnumerationList.length,nextEnumeration_slug,oSingleEnumeration);
    jQuery("#singleEnumerationsPanelsContainer").append(enumerationPanelHTML);

    jQuery(".saveUpdateEnumerationButton").off().click(function(){
        console.log("saveUpdateEnumerationButton")
        var eNumber = jQuery(this).data("enumerationnumber")
        var cg_id = jQuery(this).data("cgid")

        var currentEnumerationRawFile = jQuery("#singleEnumerationRawfile_"+cg_id+"_"+eNumber).val()
        var oEnumerationRawFile = JSON.parse(currentEnumerationRawFile);
        var nF_slug = oEnumerationRawFile.restrictsValueData.nodeFrom.slug;

        var enumerationsInferredSlug = "enumerationOf_"+nF_slug+"_by_"+jQuery("#uniquePropertyKeySelector option:selected").data("uniquepropertykey");

        console.log("saveUpdateEnumerationButton; enumerationsInferredSlug: "+enumerationsInferredSlug)

        // now update main concept graph rawfile with new or updated enumeration
        var mainConceptGraphRawfile = jQuery("#rawFileTextarea").val();
        var oMainConceptGraphRawfile = JSON.parse(mainConceptGraphRawfile)
        oMainConceptGraphRawfile.enumerations[enumerationsInferredSlug] = oEnumerationRawFile;
        var mainConceptGraphRawfile_updated = JSON.stringify(oMainConceptGraphRawfile,null,4)

        // console.log("saveUpdateEnumerationButton; mainConceptGraphRawfile_updated: "+mainConceptGraphRawfile_updated)
        jQuery("#rawFileTextarea").val(mainConceptGraphRawfile_updated);
    });
    jQuery(".enumerationPanelConceptSelector").off().change(function(){
        var cgID = jQuery("#cg_entire_selector option:selected").data("cgid")
        var eNumber = jQuery(this).data("enumerationnumber")
        var whichNode = jQuery(this).data("whichnode")
        if (whichNode=="nodeFrom") {
            var selectorHTML = "";
            selectorHTML += "<select class=enumerationNodeFromSetSelector id='enumerationNodeFromSetSelector_"+cgID+"_"+eNumber+"' data-cgid='"+cgID+"' data-enumerationnumber='"+eNumber+"' >";
            var conceptSlug = jQuery("#conceptSelectorForEnumerationPanel_"+whichNode+"_"+cgID+"_"+eNumber+" option:selected").data("conceptslug")
            var aSetsThisConcept = aAllSetsByConcept[conceptSlug]
            for (var x=0;x<aSetsThisConcept.length;x++) {
                var nS = aSetsThisConcept[x];
                selectorHTML += "<option data-setslug='"+nS+"' >";
                selectorHTML += nS;
                selectorHTML += "</option>";
            }
            selectorHTML += "</select>";
            jQuery("#enumerationNodeFromSetSelectorContainer_"+eNumber).html(selectorHTML)
            var newSetSlug = jQuery("#enumerationNodeFromSetSelector_"+cgID+"_"+eNumber+" option:selected").data("setslug")
            jQuery("#nodeFromTextarea_"+cgID+"_"+eNumber).val(newSetSlug)
            document.getElementById("setSelectorAllSetsForEnumerationPanel_nodeFrom_"+cgID+"_"+eNumber).value=newSetSlug;
            jQuery(".enumerationNodeFromSetSelector").off().change(function(){
                var cg_id = jQuery(this).data("cgid")
                var enumNum = jQuery(this).data("enumerationnumber")
                var newSetSlug = jQuery("#enumerationNodeFromSetSelector_"+cg_id+"_"+enumNum+" option:selected").data("setslug")
                jQuery("#nodeFromTextarea_"+cg_id+"_"+enumNum).val(newSetSlug)
                document.getElementById("setSelectorAllSetsForEnumerationPanel_nodeFrom_"+cg_id+"_"+enumNum).value=newSetSlug;
                redetermineEnumerationRawfile(cg_id,enumNum)
            })
        }
        if (whichNode=="nodeTo") {
            var selectorHTML = "";
            selectorHTML += "<select class=enumerationNodeToPropertySelector id='enumerationNodeToPropertySelector_"+cgID+"_"+eNumber+"' data-cgid='"+cgID+"' data-enumerationnumber='"+eNumber+"' >";
            var conceptSlug = jQuery("#conceptSelectorForEnumerationPanel_"+whichNode+"_"+cgID+"_"+eNumber+" option:selected").data("conceptslug")
            var aPropertiesThisConcept = aAllPropertiesByConcept[conceptSlug]
            for (var x=0;x<aPropertiesThisConcept.length;x++) {
                var nP = aPropertiesThisConcept[x];
                selectorHTML += "<option data-propertyslug='"+nP+"' >";
                selectorHTML += nP;
                selectorHTML += "</option>";
            }
            selectorHTML += "</select>";
            jQuery("#enumerationNodeToPropertySelectorContainer_"+eNumber).html(selectorHTML)
            var newPropertySlug = jQuery("#enumerationNodeToPropertySelector_"+cgID+"_"+eNumber+" option:selected").data("propertyslug")
            jQuery("#nodeToTextarea_"+cgID+"_"+eNumber).val(newPropertySlug)
            document.getElementById("propertySelectorAllPropertiesForEnumerationPanel_nodeTo_"+cgID+"_"+eNumber).value=newPropertySlug;
            jQuery(".enumerationNodeToPropertySelector").off().change(function(){
                var cg_id = jQuery(this).data("cgid")
                var enumNum = jQuery(this).data("enumerationnumber")
                var newPropertySlug = jQuery("#enumerationNodeToPropertySelector_"+cg_id+"_"+enumNum+" option:selected").data("propertyslug")
                jQuery("#nodeToTextarea_"+cg_id+"_"+enumNum).val(newPropertySlug)
                document.getElementById("propertySelectorAllPropertiesForEnumerationPanel_nodeTo_"+cg_id+"_"+enumNum).value=newPropertySlug;
                redetermineEnumerationRawfile(cg_id,enumNum)
            })
        }
        console.log("enumerationPanelConceptSelector changed")
        redetermineEnumerationRawfile(cgID,eNumber)
    });
    enumerationSelectorHTML += "</select>";
    jQuery("#singleEnumerationSelectorContainer").html(enumerationSelectorHTML);

    showSingleEnumerationData();
    var slug = jQuery("#singleEnumerationSelector option:selected").data("slug")
    if (slug) {
        jQuery("#enumerationCoreInfo_"+slug).get(0).click();
    }
    jQuery("#singleEnumerationSelector").change(function(){
        showSingleEnumerationData();
        var slug = jQuery("#singleEnumerationSelector option:selected").data("slug")
        jQuery("#enumerationCoreInfo_"+slug).get(0).click();
    })

    jQuery(".pickSingleEnumerationPanelButton").click(function(){
        jQuery(".pickSingleEnumerationPanelButton").css("backgroundColor","grey")
        jQuery(this).css("backgroundColor","green")

        var enumerationSlug = jQuery(this).data("enumerationslug")
        var whichBlock = jQuery(this).data("whichblock")

        jQuery(".singleEnumerationInfoBlock").css("display","none")
        jQuery("#block_enumeration_"+whichBlock+"_"+enumerationSlug).css("display","block")
    })
}

const redetermineEnumerationRawfile = (cgID,eNumber) => {
    var currentRawFile = jQuery("#singleEnumerationRawfile_"+cgID+"_"+eNumber).val()
    console.log("currentRawFile: "+currentRawFile)
    var oRawFile = JSON.parse(currentRawFile);
    var nF_slug = jQuery("#setSelectorAllSetsForEnumerationPanel_nodeFrom_"+cgID+"_"+eNumber).val();
    var nT_slug = jQuery("#propertySelectorAllPropertiesForEnumerationPanel_nodeTo_"+cgID+"_"+eNumber).val();
    oRawFile.restrictsValueData.nodeFrom.slug = nF_slug
    oRawFile.restrictsValueData.nodeTo.slug = nT_slug
    oRawFile.restrictsValueData.uniquePropertyKey = jQuery("#uniquePropertyKeySelector option:selected").data("uniquepropertykey")
    oRawFile.restrictsValueData.withSubsets = jQuery("#withSubsetsSelector option:selected").data("withsubsets")
    oRawFile.restrictsValueData.withDependencies = jQuery("#withDependenciesSelector option:selected").data("withdependencies")
    oRawFile.restrictsValueData.dependenciesPlacement = jQuery("#dependenciesPlacementSelector option:selected").data("dependenciesplacement")
    console.log("oRawFile: "+JSON.stringify(oRawFile,null,4))
    var enumerationsInferredSlug = "enumerationOf_"+nF_slug+"_by_"+jQuery("#uniquePropertyKeySelector option:selected").data("uniquepropertykey");
    jQuery("#singleEnumerationRawfile_"+cgID+"_"+eNumber).val(JSON.stringify(oRawFile,null,4))
}
const returnAdditionalPropertyHTML = (cgID,conceptSlug,conceptNumber,parentPropertyNumber) => {
    var additionalPropertyHTML = "";

    var propCountNumber = window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber].length;
    window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber][propCountNumber] = {}
    window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber][propCountNumber].propertySlug = null;
    window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber][propCountNumber].propertyKey = null;
    window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber][propCountNumber].propertyKeyPaths = [];
    window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber][propCountNumber].propertyName = null;
    window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber][propCountNumber].propertyType = "string";
    window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber][propCountNumber].propertyStatusColor = "green";
    window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber][propCountNumber].required = false;
    window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber][propCountNumber].unique = false;
    var propertyType = "string";
    var additionalPropertyHTML = "";
    additionalPropertyHTML += "<div data-parentpropertynumber='"+parentPropertyNumber+"' data-propertynumber='"+propCountNumber+"' class='singlePropertyInfoBlock_"+conceptNumber+"' ";
    if (parentPropertyNumber == 0) {
        additionalPropertyHTML += " style='padding:0px;' ";
    }
    if (parentPropertyNumber != 0) {
        additionalPropertyHTML += " style='padding:1px 5px 1px 25px;' ";
    }
    additionalPropertyHTML += " >";
    additionalPropertyHTML += "<div class='propertyNumberBox'  >";
    additionalPropertyHTML += propCountNumber;
    additionalPropertyHTML += "</div>";
    additionalPropertyHTML += "<input id='propertyName_"+conceptNumber+"_"+propCountNumber+"' data-level='topLevel' value='extra property' type=text style='font-size:18px;margin-right:10px;width:300px;' >";
    additionalPropertyHTML += "<div style='display:inline-block;width:70px;' >";
        additionalPropertyHTML += "<select id='propertyType_"+conceptNumber+"_"+propCountNumber+"' >";
            additionalPropertyHTML += "<option value='string' ";
            if (propertyType=="string") { additionalPropertyHTML += " selected "; }
            additionalPropertyHTML += " >string</option>";

            additionalPropertyHTML += "<option value='object' ";
            if (propertyType=="object") { additionalPropertyHTML += " selected "; }
            additionalPropertyHTML += " >object</option>";

            additionalPropertyHTML += "<option value='array' ";
            if (propertyType=="array") { additionalPropertyHTML += " selected "; }
            additionalPropertyHTML += " >array</option>";

            additionalPropertyHTML += "<option value='integer' ";
            if (propertyType=="integer") { additionalPropertyHTML += " selected "; }
            additionalPropertyHTML += " >integer</option>";

            additionalPropertyHTML += "<option value='number' ";
            if (propertyType=="number") { additionalPropertyHTML += " selected "; }
            additionalPropertyHTML += " >number</option>";

            additionalPropertyHTML += "<option value='boolean' ";
            if (propertyType=="boolean") { additionalPropertyHTML += " selected "; }
            additionalPropertyHTML += " >boolean</option>";

            additionalPropertyHTML += "<option value='null' ";
            if (propertyType=="null") { additionalPropertyHTML += " selected "; }
            additionalPropertyHTML += " >string</null>";
        additionalPropertyHTML += "</select>";
    additionalPropertyHTML += "</div>";

    additionalPropertyHTML += "<div id='propertyAddChildButton_"+conceptNumber+"_"+propCountNumber+"' class='propertyAddChildBox' ";
    additionalPropertyHTML += " status='okToAddChild'  ";
    additionalPropertyHTML += " data-conceptnumber='"+conceptNumber+"' ";
    additionalPropertyHTML += " data-conceptslug='"+conceptSlug+"' ";
    additionalPropertyHTML += " data-propertynumber='"+propCountNumber+"' ";
    if (propertyType != "object") { additionalPropertyHTML += " style='color:#BBBBBB;background-color:#CFCFCF' "; }
    additionalPropertyHTML += " >";
    additionalPropertyHTML += "+";
    additionalPropertyHTML += "</div>";

    additionalPropertyHTML += "<div style='display:inline-block;width:90px;margin-left:10px;' >";
    additionalPropertyHTML += "<input id='propertyRequired_"+conceptNumber+"_"+propCountNumber+"' type=checkbox ";
    additionalPropertyHTML += " style=margin-right:3px; >";
    additionalPropertyHTML += "required";
    additionalPropertyHTML += "</div>";

    additionalPropertyHTML += "<div style='display:inline-block;width:80px;' >";
    additionalPropertyHTML += "<input id='propertyUnique_"+conceptNumber+"_"+propCountNumber+"' type=checkbox ";
    additionalPropertyHTML += " style=margin-right:3px; >";
    additionalPropertyHTML += "unique";
    additionalPropertyHTML += "</div>";

    additionalPropertyHTML += "<div id='propertyDeleteOrNot_"+conceptNumber+"_"+propCountNumber+"' data-status='green' class='propertyToggleStatusBox' >";
    additionalPropertyHTML += "X";
    additionalPropertyHTML += "</div>";

    // additionalPropertyHTML += "parent property number: "+parentPropertyNumber;

    additionalPropertyHTML += "<div id='propertyChildrenContainer_"+conceptNumber+"_"+propCountNumber+"' >";
    additionalPropertyHTML += "</div>";

    additionalPropertyHTML += "</div>";

    return additionalPropertyHTML;
}

const rebindPropertyAddChildBox = (cgID) => {
    jQuery(".propertyAddChildBox").off().click(function(){
        var conNum = jQuery(this).data("conceptnumber");
        var conSlug = jQuery(this).data("conceptnumber");
        var propNum = jQuery(this).data("propertynumber");
        var newPropertyHTML = returnAdditionalPropertyHTML(cgID,conSlug,conNum,propNum);
        jQuery("#propertyChildrenContainer_"+conNum+"_"+propNum).append(newPropertyHTML)
        rebindPropertyAddChildBox(cgID)
    })
    // while we're at it ... may as well rebind this too
    // might want to change name of foxn to reflect both rebindings
    jQuery(".propertyToggleStatusBox").off().click(function(){
        var currentStatus = jQuery(this).data("status");
        if (currentStatus=="green") {
            jQuery(this).data("status","red");
            jQuery(this).css("backgroundColor","red");
        }
        if (currentStatus=="red") {
            jQuery(this).data("status","green");
            jQuery(this).css("backgroundColor","green");
        }
        updatePropertiesForThisConcept()
    })
}

const populateSingleConcepts = (cgID,oRawFile) => {
    var oConceptGraphData = oRawFile.conceptGraphData;
    var oConcepts = oRawFile.concepts;
    var aConceptList = Object.keys(oConcepts);

    jQuery("#singleConceptSelectorContainer").html("");
    jQuery("#singleConceptsPanelsContainer").html("");

    var conceptSelectorHTML = "";
    conceptSelectorHTML += "<select id=singleConceptSelector >";
    window.oCg_entire[cgID].propertiesByConceptNumber = [];
    for (var a=0;a<aConceptList.length;a++) {
        var conceptNumber = a;
        var nextConcept_slug = aConceptList[a];
        var oSingleConcept = oConcepts[nextConcept_slug];
        var oWordTypeData = oSingleConcept.wordTypeData;
        var oConceptData = oSingleConcept.conceptData;

        var inferredSuperset_slug = "supersetFor_"+oConceptData.slug;
        var inferredSuperset_name = "superset for "+oConceptData.name.singular;

        var oPropertiesData = oSingleConcept.propertiesData;
        var oSetsData = oSingleConcept.setsData;
        var oSpecificInstancesData = oSingleConcept.specificInstancesData;

        var aProperties = Object.keys(oPropertiesData);
        var aSets = Object.keys(oSetsData);
        var aSpecificInstances = Object.keys(oSpecificInstancesData);

        var aRelationshipsForProperties = oSingleConcept.relationships;
        var aRelationshipsForSets = oSingleConcept.relationshipsForSets;
        var aRelationshipsForSpecificInstances = oSingleConcept.relationshipsForSpecificInstances;

        var singular = oConceptData.name.singular;
        var plural = oConceptData.name.plural;
        var description = oConceptData.description;

        window.oCg_entire[cgID].propertiesByConceptNumber[a] = [];

        var sSingleConcept = JSON.stringify(oSingleConcept,null,4)
        var conceptPanelHTML = "";
        conceptPanelHTML += "<div id='singleConceptPanel_"+nextConcept_slug+"' class=compactFilesExplorerPageSingleConceptPanel ";
            conceptPanelHTML += " data-slug='"+nextConcept_slug+"' ";
            conceptPanelHTML += " >";
            conceptPanelHTML += "<center>"+nextConcept_slug+"</center>";

            conceptPanelHTML += "<div data-conceptslug='"+nextConcept_slug+"' data-whichblock='rawJSON' class='doSomethingButton pickSingleConceptPanelButton' >raw JSON</div>";
            conceptPanelHTML += "<div id='coreInfo_"+nextConcept_slug+"' data-conceptslug='"+nextConcept_slug+"' data-whichblock='core' class='doSomethingButton pickSingleConceptPanelButton' style='background-color:green;' >core info</div>";
            conceptPanelHTML += "<div data-conceptslug='"+nextConcept_slug+"' data-whichblock='properties' class='doSomethingButton pickSingleConceptPanelButton' >properties</div>";
            conceptPanelHTML += "<div data-conceptslug='"+nextConcept_slug+"' data-whichblock='sets' class='doSomethingButton pickSingleConceptPanelButton' >sets</div>";
            conceptPanelHTML += "<div data-conceptslug='"+nextConcept_slug+"' data-whichblock='specificInstances' class='doSomethingButton pickSingleConceptPanelButton' >specific instances</div>";

            conceptPanelHTML += "<div class='singleConceptInfoBlock' id='block_rawJSON_"+nextConcept_slug+"' >";
                conceptPanelHTML += "<center>raw JSON</center>";
                conceptPanelHTML += "<textarea id='singleConceptRawFile_"+conceptNumber+"' style='width:95%;height:500px;' >"+sSingleConcept+"</textarea>";
            conceptPanelHTML += "</div>";

            conceptPanelHTML += "<div class='singleConceptInfoBlock' id='block_core_"+nextConcept_slug+"' style='display:block;' >";
                conceptPanelHTML += "<center>core info</center>";
                conceptPanelHTML += "<div>";
                    conceptPanelHTML += "<div class=compactFilesExplorerPage_leftField >singular:</div>"
                    conceptPanelHTML += "<textarea class=compactFilesExplorerPage_rightField >"+singular+"</textarea>"
                conceptPanelHTML += "</div>";
                conceptPanelHTML += "<div>";
                    conceptPanelHTML += "<div class=compactFilesExplorerPage_leftField >plural:</div>"
                    conceptPanelHTML += "<textarea class=compactFilesExplorerPage_rightField >"+plural+"</textarea>"
                conceptPanelHTML += "</div>";
                conceptPanelHTML += "<div>";
                    conceptPanelHTML += "<div class=compactFilesExplorerPage_leftField >description:</div>"
                    conceptPanelHTML += "<textarea class=compactFilesExplorerPage_rightField style=height:100px; >"+description+"</textarea>"
                conceptPanelHTML += "</div>";
            conceptPanelHTML += "</div>";

            /////////////////////// PROPERTIES ///////////////////////
            conceptPanelHTML += "<div class='singleConceptInfoBlock propertiesForSingleConceptInfoBlock' data-conceptslug='"+nextConcept_slug+"' data-conceptnumber='"+a+"' id='block_properties_"+nextConcept_slug+"' >";
            conceptPanelHTML += "<center>properties</center>";
            conceptPanelHTML += "<div style=background-color:#202020;color:#EFEFEF; >";
            conceptPanelHTML += "Top level properties:";
            conceptPanelHTML += "<div data-conceptslug='"+nextConcept_slug+"' data-conceptnumber='"+a+"' class='doSomethingButton_small makeNewTopLevelPropertyButton' style='font-size:14px;text-align:center;margin-left:10px;width:20px' >+</div>";
            conceptPanelHTML += "</div>";

            var propCountNumber = 0;
            for (var p=0;p<aProperties.length;p++) {
                // NEED_TO_FIX
                // For now, assume all properties are direct children of primaryProperty (which has property number = 0)
                // for more complex situations, I need to find a way to track parent property number and then append conceptPanelHTML
                // to the correct element.
                var parentPropertyNumber = 0;
                var nextProperty_slug = aProperties[p];
                var oPropertyData = oPropertiesData[nextProperty_slug];
                var propertyName = oPropertyData.name;
                var propertyType = oPropertyData.type;
                var required = oPropertyData.metaData.required;
                var unique = oPropertyData.metaData.unique;
                var aTypes = oPropertyData.metaData.types;
                var propertyKey = MiscFunctions.convertNameToSlug(propertyName);
                window.oCg_entire[cgID].propertiesByConceptNumber[a][p] = {};
                window.oCg_entire[cgID].propertiesByConceptNumber[a][p].propertySlug = nextProperty_slug;
                window.oCg_entire[cgID].propertiesByConceptNumber[a][p].propertyKey = propertyKey
                window.oCg_entire[cgID].propertiesByConceptNumber[a][p].propertyKepPaths = [ propertyKey ];
                window.oCg_entire[cgID].propertiesByConceptNumber[a][p].propertyName = propertyName;
                window.oCg_entire[cgID].propertiesByConceptNumber[a][p].propertyType = propertyType;
                window.oCg_entire[cgID].propertiesByConceptNumber[a][p].propertyStatusColor = "green";
                window.oCg_entire[cgID].propertiesByConceptNumber[a][p].required = required;
                window.oCg_entire[cgID].propertiesByConceptNumber[a][p].unique = unique;
                if (aTypes.includes("topLevel")) {
                    propCountNumber++;
                    oPropertiesData[nextProperty_slug].propertyNumber = propCountNumber;
                    conceptPanelHTML += "<div data-parentpropertynumber='"+parentPropertyNumber+"'  data-propertynumber='"+propCountNumber+"' class='singlePropertyInfoBlock_"+conceptNumber+"' >";
                        conceptPanelHTML += "<div class='propertyNumberBox'  >";
                        conceptPanelHTML += propCountNumber;
                        conceptPanelHTML += "</div>";

                        conceptPanelHTML += "<input id='propertyName_"+conceptNumber+"_"+propCountNumber+"' data-level='topLevel' value='"+propertyName+"' type=text style='font-size:18px;margin-right:10px;width:300px;' >";

                        conceptPanelHTML += "<div style='display:inline-block;width:70px;' >";
                            conceptPanelHTML += "<select id='propertyType_"+conceptNumber+"_"+propCountNumber+"' >";
                                conceptPanelHTML += "<option value='string' ";
                                if (propertyType=="string") { conceptPanelHTML += " selected "; }
                                conceptPanelHTML += " >string</option>";

                                conceptPanelHTML += "<option value='object' ";
                                if (propertyType=="object") { conceptPanelHTML += " selected "; }
                                conceptPanelHTML += " >object</option>";

                                conceptPanelHTML += "<option value='array' ";
                                if (propertyType=="array") { conceptPanelHTML += " selected "; }
                                conceptPanelHTML += " >array</option>";

                                conceptPanelHTML += "<option value='integer' ";
                                if (propertyType=="integer") { conceptPanelHTML += " selected "; }
                                conceptPanelHTML += " >integer</option>";

                                conceptPanelHTML += "<option value='number' ";
                                if (propertyType=="number") { conceptPanelHTML += " selected "; }
                                conceptPanelHTML += " >number</option>";

                                conceptPanelHTML += "<option value='boolean' ";
                                if (propertyType=="boolean") { conceptPanelHTML += " selected "; }
                                conceptPanelHTML += " >boolean</option>";

                                conceptPanelHTML += "<option value='null' ";
                                if (propertyType=="null") { conceptPanelHTML += " selected "; }
                                conceptPanelHTML += " >string</null>";
                            conceptPanelHTML += "</select>";
                        conceptPanelHTML += "</div>";

                        conceptPanelHTML += "<div id='propertyAddChildButton_"+conceptNumber+"_"+propCountNumber+"' class='propertyAddChildBox' ";
                        conceptPanelHTML += " status='okToAddChild'  ";
                        conceptPanelHTML += " data-conceptnumber='"+conceptNumber+"' ";
                        conceptPanelHTML += " data-conceptslug='"+nextConcept_slug+"' ";
                        conceptPanelHTML += " data-propertynumber='"+propCountNumber+"' ";
                        if (propertyType != "object") { conceptPanelHTML += " style='color:#BBBBBB;background-color:#CFCFCF' "; }
                        conceptPanelHTML += " >";
                        conceptPanelHTML += "+";
                        conceptPanelHTML += "</div>";

                        conceptPanelHTML += "<div style='display:inline-block;width:90px;margin-left:10px;' >";
                        conceptPanelHTML += "<input id='propertyRequired_"+conceptNumber+"_"+propCountNumber+"' type=checkbox ";
                        if ((required=="true") || (required==true)) { conceptPanelHTML += " checked "; }
                        conceptPanelHTML += " style=margin-right:3px; >";
                        conceptPanelHTML += "required";
                        conceptPanelHTML += "</div>";

                        conceptPanelHTML += "<div style='display:inline-block;width:80px;' >";
                        conceptPanelHTML += "<input id='propertyUnique_"+conceptNumber+"_"+propCountNumber+"' type=checkbox ";
                        if ((unique=="true") || (unique==true)) { conceptPanelHTML += " checked "; }
                        conceptPanelHTML += " style=margin-right:3px; >";
                        conceptPanelHTML += "unique";
                        conceptPanelHTML += "</div>";

                        conceptPanelHTML += "<div id='propertyDeleteOrNot_"+conceptNumber+"_"+propCountNumber+"' data-status='green' class='propertyToggleStatusBox' >";
                        conceptPanelHTML += "X";
                        conceptPanelHTML += "</div>";

                        conceptPanelHTML += "<div id='propertyChildrenContainer_"+conceptNumber+"_"+propCountNumber+"' >";
                        conceptPanelHTML += "</div>";

                    conceptPanelHTML += "</div>";
                }
            }
            window.oCg_modified[cgID] = MiscFunctions.cloneObj(window.oCg_entire[cgID]);
            conceptPanelHTML += "<div id='additionalTopLevelPropertiesElement_"+nextConcept_slug+"' ></div>";
            conceptPanelHTML += "<div style=background-color:#202020;color:#EFEFEF; >";
            conceptPanelHTML += "Lower level properties:";
            conceptPanelHTML += "<div data-conceptslug='"+nextConcept_slug+"' data-conceptnumber='"+a+"' class='doSomethingButton_small makeNewLowerLevelPropertyButton' style='font-size:14px;text-align:center;margin-left:10px;width:20px' >+</div>";
            conceptPanelHTML += "</div>";

            for (var p=0;p<aProperties.length;p++) {
                var nextProperty_slug = aProperties[p];
                var oPropertyData = oPropertiesData[nextProperty_slug];
                var propertyName = oPropertyData.name;
                var propertyType = oPropertyData.type;
                var required = oPropertyData.metaData.required;
                var unique = oPropertyData.metaData.unique;
                var aTypes = oPropertyData.metaData.types;
                if ( (!aTypes.includes("topLevel")) && (!aTypes.includes("primaryProperty"))) {
                    propCountNumber++;
                    oPropertiesData[nextProperty_slug].propertyNumber = propCountNumber;
                    conceptPanelHTML += "<div data-parentpropertynumber='"+parentPropertyNumber+"' data-propertynumber='"+propCountNumber+"' class='singlePropertyInfoBlock_"+conceptNumber+"' >";
                        conceptPanelHTML += "<div class='propertyNumberBox' >";
                        conceptPanelHTML += propCountNumber;
                        conceptPanelHTML += "</div>";

                        conceptPanelHTML += "<input id='propertyName_"+conceptNumber+"_"+propCountNumber+"' data-level='lowerLevel' value='"+propertyName+"' type=text class='propertyNameInputBox' style='font-size:18px;margin-right:10px;width:300px;' >";

                        conceptPanelHTML += "<div style='display:inline-block;width:70px;' >";
                            conceptPanelHTML += "<select id='propertyType_"+conceptNumber+"_"+propCountNumber+"' >";
                                conceptPanelHTML += "<option value='string' ";
                                if (propertyType=="string") { conceptPanelHTML += " selected "; }
                                conceptPanelHTML += " >string</option>";

                                conceptPanelHTML += "<option value='object' ";
                                if (propertyType=="object") { conceptPanelHTML += " selected "; }
                                conceptPanelHTML += " >object</option>";

                                conceptPanelHTML += "<option value='array' ";
                                if (propertyType=="array") { conceptPanelHTML += " selected "; }
                                conceptPanelHTML += " >array</option>";

                                conceptPanelHTML += "<option value='integer' ";
                                if (propertyType=="integer") { conceptPanelHTML += " selected "; }
                                conceptPanelHTML += " >integer</option>";

                                conceptPanelHTML += "<option value='number' ";
                                if (propertyType=="number") { conceptPanelHTML += " selected "; }
                                conceptPanelHTML += " >number</option>";

                                conceptPanelHTML += "<option value='boolean' ";
                                if (propertyType=="boolean") { conceptPanelHTML += " selected "; }
                                conceptPanelHTML += " >boolean</option>";

                                conceptPanelHTML += "<option value='null' ";
                                if (propertyType=="null") { conceptPanelHTML += " selected "; }
                                conceptPanelHTML += " >string</null>";
                            conceptPanelHTML += "</select>";
                        conceptPanelHTML += "</div>";

                        conceptPanelHTML += "<div id='propertyAddChildButton_"+conceptNumber+"_"+propCountNumber+"' class='propertyAddChildBox' ";
                        conceptPanelHTML += " status='okToAddChild'  ";
                        conceptPanelHTML += " data-conceptnumber='"+conceptNumber+"' ";
                        conceptPanelHTML += " data-conceptslug='"+nextConcept_slug+"' ";
                        conceptPanelHTML += " data-propertynumber='"+propCountNumber+"' ";
                        if (propertyType != "object") { conceptPanelHTML += " style='color:#BBBBBB;background-color:#CFCFCF' "; }
                        conceptPanelHTML += " >";
                        conceptPanelHTML += "+";
                        conceptPanelHTML += "</div>";

                        conceptPanelHTML += "<div style='display:inline-block;width:90px;margin-left:10px;' >";
                        conceptPanelHTML += "<input id='propertyRequired_"+conceptNumber+"_"+propCountNumber+"' type=checkbox ";
                        if ((required=="true") || (required==true)) { conceptPanelHTML += " checked "; }
                        conceptPanelHTML += " style=margin-right:3px; >";
                        conceptPanelHTML += "required";
                        conceptPanelHTML += "</div>";

                        conceptPanelHTML += "<div style='display:inline-block;width:80px;' >";
                        conceptPanelHTML += "<input id='propertyUnique_"+conceptNumber+"_"+propCountNumber+"' type=checkbox ";
                        if ((unique=="true") || (unique==true)) { conceptPanelHTML += " checked "; }
                        conceptPanelHTML += " style=margin-right:3px; >";
                        conceptPanelHTML += "unique";
                        conceptPanelHTML += "</div>";

                        conceptPanelHTML += "<div id='propertyDeleteOrNot_"+conceptNumber+"_"+propCountNumber+"' data-status='green' class='propertyToggleStatusBox' >";
                        conceptPanelHTML += "X";
                        conceptPanelHTML += "</div>";

                        conceptPanelHTML += "<div id='propertyChildrenContainer_"+conceptNumber+"_"+propCountNumber+"' >";
                        conceptPanelHTML += "</div>";

                        conceptPanelHTML += "<br/>";

                        for (var z=0;z<aRelationshipsForProperties.length;z++) {
                            var oNextRel = aRelationshipsForProperties[z];
                            var nF_slug = oNextRel.nodeFrom.slug;
                            if (nF_slug == nextProperty_slug) {
                                var nT_slug = oNextRel.nodeTo.slug;
                                conceptPanelHTML += "<div style=display:inline-block;margin-left:20px; >modifies:</div>"
                                conceptPanelHTML += "<div style='display:inline-block;margin-left:10px;' >";
                                conceptPanelHTML += "<span style=color:blue;>"+oPropertiesData[nT_slug].propertyNumber+"</span>";
                                conceptPanelHTML += " "+oPropertiesData[nT_slug].name;
                                conceptPanelHTML += "</div>";
                            }
                        }
                    conceptPanelHTML += "</div>";
                }
            }
            conceptPanelHTML += "<div id='additionalLowerLevelPropertiesElement_"+nextConcept_slug+"' ></div>";
            conceptPanelHTML += "</div>";

            //////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////// SETS //////////////////////////////////////////////
            conceptPanelHTML += "<div class='singleConceptInfoBlock' id='block_sets_"+nextConcept_slug+"' >";
                conceptPanelHTML += "<center>sets";
                conceptPanelHTML += "<div id='makeNewSetButton' class='makeNewSetButton' ";
                conceptPanelHTML += " data-conceptnumber='"+conceptNumber+"' ";
                conceptPanelHTML += " data-conceptgraphnumber='"+cgID+"' ";
                conceptPanelHTML += " data-numsetsthisconcept='"+aSets.length+"' ";
                conceptPanelHTML += " >";
                conceptPanelHTML += "+";
                conceptPanelHTML += "</div>";
                conceptPanelHTML += "</center>";

                conceptPanelHTML += "<div>";
                    conceptPanelHTML += "<select class='setSelector' data-conceptgraphnumber='"+cgID+"' data-conceptnumber='"+conceptNumber+"' id='setSelector_"+cgID+"_"+conceptNumber+"' >";
                    for (var s=0;s<aSets.length;s++) {
                        var nextSet_slug = aSets[s];
                        var oNextSet = oSetsData[nextSet_slug];
                        conceptPanelHTML += "<option ";
                        conceptPanelHTML += " data-setnumber='"+s+"' ";
                        conceptPanelHTML += " data-conceptnumber='"+conceptNumber+"' ";
                        conceptPanelHTML += " >";
                        conceptPanelHTML += nextSet_slug;
                        conceptPanelHTML += "</option>";
                    }
                    conceptPanelHTML += "<select>";
                conceptPanelHTML += "</div>";

                for (var s=0;s<aSets.length+1;s++) {
                    if (s==aSets.length) {
                        oNextSet = {
                            "slug": "",
                            "title": "",
                            "name": "",
                            "description": "",
                            "propertyDefinition": false,
                            "metaData": {
                                "types": [],
                                "governingConcept": {
                                    "slug": nextConcept_slug
                                },
                                "governingConcepts": [
                                    nextConcept_slug
                                ]
                            }
                        }
                        nextSet_slug = "";
                    } else {
                        var nextSet_slug = aSets[s];
                        var oNextSet = oSetsData[nextSet_slug];
                    }
                    var nextSet_title = oNextSet.title;
                    var nextSet_name = oNextSet.name;
                    var nextSet_description = oNextSet.description;

                    conceptPanelHTML += "<div class='singleSetInfoBlock' id='singleSetContainer_"+cgID+"_"+conceptNumber+"_"+s+"' style='border:1px solid purple;";
                    if (s>0) { conceptPanelHTML += "display:none;"; }
                    conceptPanelHTML += "' >";
                    conceptPanelHTML += "<center>";
                    conceptPanelHTML += nextSet_title;
                    conceptPanelHTML += "</center>";

                    conceptPanelHTML += "<div class='setInputFieldsContainer' data-cgid='"+cgID+"' data-conceptnumber='"+conceptNumber+"' data-setnumber='"+s+"' style='border:1px dashed grey;width:500px;height:480px;display:inline-block;padding:5px;overflow:scroll;' >";

                        conceptPanelHTML += "<div>";
                            conceptPanelHTML += "<div style=width:100px;display:inline-block;text-align:right; >";
                            conceptPanelHTML += "slug: ";
                            conceptPanelHTML += "</div>";
                            conceptPanelHTML += "<input id='setSlug_"+cgID+"_"+conceptNumber+"_"+s+"' value='"+nextSet_slug+"' style=width:300px;display:inline-block;margin-left:10px; />";
                        conceptPanelHTML += "</div>";

                        conceptPanelHTML += "<div>";
                            conceptPanelHTML += "<div style=width:100px;display:inline-block;text-align:right; >";
                            conceptPanelHTML += "name: ";
                            conceptPanelHTML += "</div>";
                            conceptPanelHTML += "<input id='setName_"+cgID+"_"+conceptNumber+"_"+s+"' value='"+nextSet_name+"' style=width:300px;display:inline-block;margin-left:10px; />";
                        conceptPanelHTML += "</div>";

                        conceptPanelHTML += "<div>";
                            conceptPanelHTML += "<div style=width:100px;display:inline-block;text-align:right; >";
                            conceptPanelHTML += "title: ";
                            conceptPanelHTML += "</div>";
                            conceptPanelHTML += "<input id='setTitle_"+cgID+"_"+conceptNumber+"_"+s+"' value='"+nextSet_title+"' style=width:300px;display:inline-block;margin-left:10px; />";
                        conceptPanelHTML += "</div>";

                        conceptPanelHTML += "<div>";
                            conceptPanelHTML += "<div style=width:100px;display:inline-block;text-align:right; >";
                            conceptPanelHTML += "description: ";
                            conceptPanelHTML += "</div>";
                            conceptPanelHTML += "<textarea id='setDescription_"+cgID+"_"+conceptNumber+"_"+s+"' style=width:300px;display:inline-block;margin-left:10px; />";
                            conceptPanelHTML += nextSet_description;
                            conceptPanelHTML += "</textarea>";
                        conceptPanelHTML += "</div>";

                        if (s < aSets.length) {
                            conceptPanelHTML += "<div class='doSomethingButton updateExistingSetButton' data-cgid='"+cgID+"' data-conceptnumber='"+conceptNumber+"' data-setnumber='"+s+"'  >update set (right)</div>";
                            conceptPanelHTML += "<div class='doSomethingButton updateExistingRelationshipsForSetButton' data-cgid='"+cgID+"' data-conceptnumber='"+conceptNumber+"' data-setnumber='"+s+"'  >update relationships (below)</div>";
                        }
                        if (s==aSets.length) {
                            conceptPanelHTML += "<div class='doSomethingButton saveNewSetButton' id='saveNewSetButton_"+cgID+"_"+conceptNumber+"_"+s+"' data-cgid='"+cgID+"' data-conceptnumber='"+conceptNumber+"' data-conceptslug='"+nextConcept_slug+"' data-setnumber='"+s+"' >save / update new set including relationships (below)</div>";
                        }

                        conceptPanelHTML += "<div>";
                        conceptPanelHTML += "subset of:";
                        conceptPanelHTML += "</div>";

                        conceptPanelHTML += "<div>";
                        conceptPanelHTML += "<input data-cgid='"+cgID+"' data-conceptnumber='"+conceptNumber+"' data-setnumber='"+s+"' data-nodetoslug='"+inferredSuperset_slug+"' class=setIsSubsetOfCheckbox type=checkbox style='margin-right:10px;' ";
                        for (var r=0;r<aRelationshipsForSets.length;r++) {
                            var oNxtRl = aRelationshipsForSets[r];
                            if (oNxtRl.nodeFrom.slug == nextSet_slug) {
                                if (oNxtRl.nodeTo.slug == inferredSuperset_slug) {
                                    conceptPanelHTML += " checked ";
                                }
                            }
                        }
                        conceptPanelHTML += " >";
                        conceptPanelHTML += inferredSuperset_name;
                        conceptPanelHTML += "</div>";

                        for (var z=0;z<aSets.length;z++) {
                            var nS_slug = aSets[z];
                            var oNS = oSetsData[nS_slug];
                            var nS_title = oNS.title
                            conceptPanelHTML += "<div>";
                            conceptPanelHTML += "<input data-cgid='"+cgID+"' data-conceptnumber='"+conceptNumber+"' data-setnumber='"+s+"' data-nodetoslug='"+nS_slug+"' class=setIsSubsetOfCheckbox type=checkbox style='margin-right:10px;' ";
                            for (var r=0;r<aRelationshipsForSets.length;r++) {
                                var oNxtRl = aRelationshipsForSets[r];
                                if (oNxtRl.nodeFrom.slug == nextSet_slug) {
                                    if (oNxtRl.nodeTo.slug == nS_slug) {
                                        conceptPanelHTML += " checked ";
                                    }
                                }
                            }
                            conceptPanelHTML += " >";
                            conceptPanelHTML += nS_title;
                            conceptPanelHTML += "</div>";
                        }
                    conceptPanelHTML += "</div>";
                    conceptPanelHTML += "<textarea id='setRawFile_"+cgID+"_"+conceptNumber+"_"+s+"' style='width:400px;height:480px;display:inline-block;overflow:scroll;' >";
                    conceptPanelHTML += JSON.stringify(oNextSet,null,4);
                    conceptPanelHTML += "</textarea>";
                    conceptPanelHTML += "</div>";
                }
            conceptPanelHTML += "</div>";

            /////////////////////// SPECIFIC INSTANCES ///////////////////////
            conceptPanelHTML += "<div class='singleConceptInfoBlock' id='block_specificInstances_"+nextConcept_slug+"' >";
                conceptPanelHTML += "<center>specific instances</center>";
                conceptPanelHTML += "<select id='specificInstanceSelector_"+cgID+"_"+conceptNumber+"' >";
                for (var s=0;s<aSpecificInstances.length;s++) {
                    var nextSpecificInstance_slug = aSpecificInstances[s];
                    var oNextSpecificInstance = oSpecificInstancesData[nextSpecificInstance_slug]
                    conceptPanelHTML += "<option>";
                    conceptPanelHTML += nextSpecificInstance_slug;
                    conceptPanelHTML += "</option>";
                }
                conceptPanelHTML += "<select>";
            conceptPanelHTML += "</div>";
        conceptPanelHTML += "</div>";
        jQuery("#singleConceptsPanelsContainer").append(conceptPanelHTML);
        jQuery(".updateExistingSetButton").off().click(function(){
            var conceptNumber = jQuery(this).data("conceptnumber")
            var cgID = jQuery(this).data("cgid")
            var setNum = jQuery(this).data("setnumber")
            var setRawFile = jQuery("#setRawFile_"+cgID+"_"+conceptNumber+"_"+setNum).val()
            console.log("updateExistingSetButton; setRawFile: "+setRawFile)
        });
        jQuery(".updateExistingRelationshipsForSetButton").off().click(function(){
            var conceptNumber = jQuery(this).data("conceptnumber")
            var cgID = jQuery(this).data("cgid")
            var setNum = jQuery(this).data("setnumber")
            var setRawFile = jQuery("#setRawFile_"+cgID+"_"+conceptNumber+"_"+setNum).val()
            console.log("updateExistingRelationshipsForSetButton; setRawFile: "+setRawFile)
        });
        jQuery(".saveNewSetButton").off().click(function(){
            var conceptNumber = jQuery(this).data("conceptnumber")
            var conceptSlug = jQuery(this).data("conceptslug")
            var cgID = jQuery(this).data("cgid")
            var setNum = jQuery(this).data("setnumber")
            var setRawFile = jQuery("#setRawFile_"+cgID+"_"+conceptNumber+"_"+setNum).val()
            console.log("saveNewSetButton; setRawFile: "+setRawFile)
            var oSetRawFile = JSON.parse(setRawFile);
            var newSet_slug = oSetRawFile.slug;
            // window.oCg_modified[cgID].rawFile.concepts[]
            var sCurrConceptRawfile = jQuery("#singleConceptRawFile_"+conceptNumber).val()
            var oCurrConceptRawfile = JSON.parse(sCurrConceptRawfile)
            oCurrConceptRawfile.setsData[newSet_slug] = oSetRawFile;
            // now update subsetOf relationships
            jQuery(".setIsSubsetOfCheckbox").each(function(){
                var con_num = jQuery(this).data("conceptnumber")
                var cg_id = jQuery(this).data("cgid")
                var set_num = jQuery(this).data("setnumber")
                var nT_slug = jQuery(this).data("nodetoslug")
                var isChecked = jQuery(this).prop("checked")
                if ( (cgID==cg_id) && (con_num==conceptNumber) && (set_num==setNum) && (isChecked) ) {
                    console.log("setIsSubsetOfCheckbox; con_num: "+con_num+"; conceptNumber: "+conceptNumber+"; cgID: "+cgID+"; cg_id: "+cg_id+"; set_num: "+set_num+"; setNum: "+setNum+"; nT_slug: "+nT_slug+"; isChecked: "+isChecked)
                    var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                    oNewRel.nodeFrom.slug = newSet_slug
                    oNewRel.relationshipType.slug = "subsetOf";
                    oNewRel.nodeTo.slug = nT_slug
                    console.log("oNewRel: "+JSON.stringify(oNewRel,null,4))
                    oCurrConceptRawfile.relationshipsForSets = MiscFunctions.pushObjIfNotAlreadyThere(oCurrConceptRawfile.relationshipsForSets,oNewRel)
                }
            })
            jQuery("#singleConceptRawFile_"+conceptNumber).val(JSON.stringify(oCurrConceptRawfile,null,4))

            // push changes from singleConceptRawFile_ to rawFileTextarea
            var sRawFileTextarea = jQuery("#rawFileTextarea").val()
            var oRawFileTextarea = JSON.parse(sRawFileTextarea)
            oRawFileTextarea.concepts[conceptSlug] = oCurrConceptRawfile;

            jQuery("#rawFileTextarea").val(JSON.stringify(oRawFileTextarea,null,4))
            window.oCg_modified[cgID].rawFile = oRawFileTextarea;

        });
        jQuery(".setInputFieldsContainer").off().change(function(){
            // console.log("setInputFieldsContainer changed")
            var conceptNumber = jQuery(this).data("conceptnumber")
            var cgID = jQuery(this).data("cgid")
            var setNum = jQuery(this).data("setnumber")
            var setSlug = jQuery("#setSlug_"+cgID+"_"+conceptNumber+"_"+setNum).val()
            var setName = jQuery("#setName_"+cgID+"_"+conceptNumber+"_"+setNum).val()
            var setTitle = jQuery("#setTitle_"+cgID+"_"+conceptNumber+"_"+setNum).val()
            var setDescription = jQuery("#setDescription_"+cgID+"_"+conceptNumber+"_"+setNum).val()
            var setRawFile = jQuery("#setRawFile_"+cgID+"_"+conceptNumber+"_"+setNum).val()
            // console.log("setInputFieldsContainer changed; setNum: "+setNum)
            var oSetRawFile = JSON.parse(setRawFile)
            oSetRawFile.slug = setSlug;
            oSetRawFile.name = setName;
            oSetRawFile.title = setTitle;
            oSetRawFile.description = setDescription;
            var updatedSetRawfile = JSON.stringify(oSetRawFile,null,4);
            jQuery("#setRawFile_"+cgID+"_"+conceptNumber+"_"+setNum).val(updatedSetRawfile)
        })
        jQuery(".setSelector").off().change(function(){
            jQuery(".singleSetInfoBlock").css("display","none")
            var conNum = jQuery(this).data("conceptnumber")
            var conGraNum = jQuery(this).data("conceptgraphnumber")
            var setNum = jQuery("#setSelector_"+conGraNum+"_"+conNum+" option:selected").data("setnumber");
            console.log("setSelector changed; conNum: "+conNum+"; conGraNum: "+conGraNum+"; setNum: "+setNum)
            jQuery("#singleSetContainer_"+conGraNum+"_"+conNum+"_"+setNum).css("display","block")
        })
        jQuery(".makeNewSetButton").off().click(function(){
            jQuery(".singleSetInfoBlock").css("display","none")
            var conNum = jQuery(this).data("conceptnumber")
            var conGraNum = jQuery(this).data("conceptgraphnumber")
            var setNum = jQuery(this).data("numsetsthisconcept")
            console.log("setSelector changed; conNum: "+conNum+"; conGraNum: "+conGraNum+"; setNum: "+setNum)
            jQuery("#singleSetContainer_"+conGraNum+"_"+conNum+"_"+setNum).css("display","block")
        })
        jQuery(".propertyAddChildBox").off().click(function(){
            var conNum = jQuery(this).data("conceptnumber");
            var conSlug = jQuery(this).data("conceptnumber");
            var propNum = jQuery(this).data("propertynumber");
            var newPropertyHTML = returnAdditionalPropertyHTML(cgID,conSlug,conNum,propNum);
            jQuery("#propertyChildrenContainer_"+conNum+"_"+propNum).append(newPropertyHTML)
            rebindPropertyAddChildBox(cgID)
        })
        conceptSelectorHTML += "<option data-slug='"+nextConcept_slug+"' data-conceptnumber='"+a+"' >";
        conceptSelectorHTML += nextConcept_slug;
        conceptSelectorHTML += "</option>";
    }
    conceptSelectorHTML += "</select>";
    jQuery("#singleConceptSelectorContainer").html(conceptSelectorHTML);

    jQuery(".propertyToggleStatusBox").off().click(function(){
        var currentStatus = jQuery(this).data("status");
        if (currentStatus=="green") {
            jQuery(this).data("status","red");
            jQuery(this).css("backgroundColor","red");
        }
        if (currentStatus=="red") {
            jQuery(this).data("status","green");
            jQuery(this).css("backgroundColor","green");
        }
        updatePropertiesForThisConcept()
    })

    jQuery(".propertiesForSingleConceptInfoBlock").off().change(function(){
        var conceptSlug = jQuery(this).data("conceptslug");
        var conceptNumber = jQuery(this).data("conceptnumber");
        console.log("propertiesForSingleConceptInfoBlock changed; conceptSlug: "+conceptSlug+"; conceptNumber: "+conceptNumber)
        updatePropertiesForThisConcept(conceptSlug,conceptNumber)
    })

    jQuery(".makeNewTopLevelPropertyButton").off().click(function(){
        var conceptSlug = jQuery(this).data("conceptslug")
        var conceptNumber = jQuery(this).data("conceptnumber")
        var parentPropertyNum = 0; // parent property is primeryProperty which has property number of 0
        var additionalPropertyHTML = returnAdditionalPropertyHTML(cgID,conceptSlug,conceptNumber,parentPropertyNum);
        jQuery("#additionalTopLevelPropertiesElement_"+conceptSlug).append(additionalPropertyHTML);
        jQuery(".propertyAddChildBox").off().click(function(){
            var conNum = jQuery(this).data("conceptnumber");
            var conSlug = jQuery(this).data("conceptnumber");
            var propNum = jQuery(this).data("propertynumber");
            var newPropertyHTML = returnAdditionalPropertyHTML(cgID,conSlug,conNum,propNum);
            jQuery("#propertyChildrenContainer_"+conNum+"_"+propNum).append(newPropertyHTML);
            rebindPropertyAddChildBox(cgID)
        })
        jQuery(".propertyToggleStatusBox").off().click(function(){
            var currentStatus = jQuery(this).data("status");
            if (currentStatus=="green") {
                jQuery(this).data("status","red");
                jQuery(this).css("backgroundColor","red");
            }
            if (currentStatus=="red") {
                jQuery(this).data("status","green");
                jQuery(this).css("backgroundColor","green");
            }
            updatePropertiesForThisConcept()
        })
    })
    // deprecating makeNewLowerLevelPropertyButton
    jQuery(".makeNewLowerLevelPropertyButton").off().click(function(){
        var conceptSlug = jQuery(this).data("conceptslug")
        var conceptNumber = jQuery(this).data("conceptnumber")

        /*
        var propCountNumber = window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber].length;
        window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber][propCountNumber] = {}
        window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber][propCountNumber].propertySlug = null;
        window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber][propCountNumber].propertyKey = null;
        window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber][propCountNumber].propertyName = null;
        window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber][propCountNumber].propertyType = "string";
        window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber][propCountNumber].propertyStatusColor = "green";
        window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber][propCountNumber].required = false;
        window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber][propCountNumber].unique = false;
        // var propertyType = "string";
        var additionalPropertyHTML = "";
        additionalPropertyHTML += "<div data-propertynumber='"+propCountNumber+"' class='singlePropertyInfoBlock_"+conceptNumber+"' >";
        additionalPropertyHTML += "<div class='propertyNumberBox' >";
        additionalPropertyHTML += propCountNumber;
        additionalPropertyHTML += "</div>";
        additionalPropertyHTML += "<input id='propertyName_"+conceptNumber+"_"+propCountNumber+"' data-level='lowerLevel' value='extra lower property' type=text style='font-size:18px;margin-right:10px;width:300px;' >";
        additionalPropertyHTML += "<div style='display:inline-block;width:70px;' >";
            additionalPropertyHTML += "<select id='propertyType_"+conceptNumber+"_"+propCountNumber+"' >";
                additionalPropertyHTML += "<option value='string' ";
                if (propertyType=="string") { additionalPropertyHTML += " selected "; }
                additionalPropertyHTML += " >string</option>";

                additionalPropertyHTML += "<option value='object' ";
                if (propertyType=="object") { additionalPropertyHTML += " selected "; }
                additionalPropertyHTML += " >object</option>";

                additionalPropertyHTML += "<option value='array' ";
                if (propertyType=="array") { additionalPropertyHTML += " selected "; }
                additionalPropertyHTML += " >array</option>";

                additionalPropertyHTML += "<option value='integer' ";
                if (propertyType=="integer") { additionalPropertyHTML += " selected "; }
                additionalPropertyHTML += " >integer</option>";

                additionalPropertyHTML += "<option value='number' ";
                if (propertyType=="number") { additionalPropertyHTML += " selected "; }
                additionalPropertyHTML += " >number</option>";

                additionalPropertyHTML += "<option value='boolean' ";
                if (propertyType=="boolean") { additionalPropertyHTML += " selected "; }
                additionalPropertyHTML += " >boolean</option>";

                additionalPropertyHTML += "<option value='null' ";
                if (propertyType=="null") { additionalPropertyHTML += " selected "; }
                additionalPropertyHTML += " >string</null>";
            additionalPropertyHTML += "</select>";
        additionalPropertyHTML += "</div>";

        additionalPropertyHTML += "<div id='propertyAddChildButton_"+conceptNumber+"_"+propCountNumber+"' class='propertyAddChildBox' ";
        additionalPropertyHTML += " status='okToAddChild'  ";
        additionalPropertyHTML += " data-conceptnumber='"+conceptNumber+"' ";
        additionalPropertyHTML += " data-propertynumber='"+propCountNumber+"' ";
        if (propertyType != "object") { additionalPropertyHTML += " style='color:#BBBBBB;background-color:#CFCFCF' "; }
        additionalPropertyHTML += " >";
        additionalPropertyHTML += "+";
        additionalPropertyHTML += "</div>";

        additionalPropertyHTML += "<div style='display:inline-block;width:90px;margin-left:10px;' >";
        additionalPropertyHTML += "<input id='propertyRequired_"+conceptNumber+"_"+propCountNumber+"' type=checkbox ";
        additionalPropertyHTML += " style=margin-right:3px; >";
        additionalPropertyHTML += "required";
        additionalPropertyHTML += "</div>";

        additionalPropertyHTML += "<div style='display:inline-block;width:80px;' >";
        additionalPropertyHTML += "<input id='propertyUnique_"+conceptNumber+"_"+propCountNumber+"' type=checkbox ";
        additionalPropertyHTML += " style=margin-right:3px; >";
        additionalPropertyHTML += "unique";
        additionalPropertyHTML += "</div>";

        additionalPropertyHTML += "<div id='propertyDeleteOrNot_"+conceptNumber+"_"+propCountNumber+"' data-status='green' class='propertyToggleStatusBox' >";
        additionalPropertyHTML += "X";
        additionalPropertyHTML += "</div>";

        additionalPropertyHTML += "<div id='propertyChildrenContainer_"+conceptNumber+"_"+propCountNumber+"' style='border:1px solid grey;' >";
        additionalPropertyHTML += "</div>";

        additionalPropertyHTML += "</div>";
        */
        var parentPropNum = 0; // this is not currect; applied so as not to throw an error; will be deprecating makeNewLowerLevelPropertyButton in any case
        var additionalPropertyHTML = returnAdditionalPropertyHTML(cgID,conceptSlug,conceptNumber,parentPropNum);
        jQuery("#additionalLowerLevelPropertiesElement_"+conceptSlug).append(additionalPropertyHTML);
        jQuery(".propertyAddChildBox").off().click(function(){
            var conNum = jQuery(this).data("conceptnumber");
            var conSlug = jQuery(this).data("conceptnumber");
            var propNum = jQuery(this).data("propertynumber");
            var newPropertyHTML = returnAdditionalPropertyHTML(cgID,conSlug,conNum,propNum);
            jQuery("#propertyChildrenContainer_"+conNum+"_"+propNum).append(newPropertyHTML);
            rebindPropertyAddChildBox(cgID);
        })
        jQuery(".propertyToggleStatusBox").off().click(function(){
            var currentStatus = jQuery(this).data("status");
            if (currentStatus=="green") {
                jQuery(this).data("status","red");
                jQuery(this).css("backgroundColor","red");
            }
            if (currentStatus=="red") {
                jQuery(this).data("status","green");
                jQuery(this).css("backgroundColor","green");
            }
            updatePropertiesForThisConcept()
        })
    })
    showSingleConceptData();
    var slug = jQuery("#singleConceptSelector option:selected").data("slug")
    if (slug) {
        jQuery("#coreInfo_"+slug).get(0).click();
    }
    jQuery("#singleConceptSelector").change(function(){
        showSingleConceptData();
        var slug = jQuery("#singleConceptSelector option:selected").data("slug")
        jQuery("#coreInfo_"+slug).get(0).click();
    })

    jQuery(".pickSingleConceptPanelButton").click(function(){
        jQuery(".pickSingleConceptPanelButton").css("backgroundColor","grey")
        jQuery(this).css("backgroundColor","green")

        var conceptSlug = jQuery(this).data("conceptslug")
        var whichBlock = jQuery(this).data("whichblock")

        jQuery(".singleConceptInfoBlock").css("display","none")
        jQuery("#block_"+whichBlock+"_"+conceptSlug).css("display","block")
    })
    console.log("conceptsListField: off")
    jQuery(".conceptsListField").off().change(function(){
        var conceptNum = jQuery(this).data("conceptnum")
        console.log("conceptsListField clicked; conceptNum: "+conceptNum)
        updateCurrentConceptGraphRawFile()
    })
}

// Review user-entered properties (under "concepts - expanded" button)
// and update:
// window.oCg_modified[cgID].propertiesByConceptNumber
// and
// window.oCg_modified[cgID].rawFile
// QWERTY
const updatePropertiesForThisConcept = async (conceptSlug,conceptNumber) => {
    var cgID = jQuery("#cg_entire_selector option:selected").data("cgid")
    var conceptSlug = jQuery("#singleConceptSelector option:selected").data("slug");
    var conceptNumber = jQuery("#singleConceptSelector option:selected").data("conceptnumber");
    var oCurrentProperties = MiscFunctions.cloneObj(window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber]);
    var oCurrentRawfile = MiscFunctions.cloneObj(window.oCg_modified[cgID].rawFile);
    var oUpdatedProperties = MiscFunctions.cloneObj(oCurrentProperties);
    var oUpdatedRawfile = MiscFunctions.cloneObj(oCurrentRawfile);

    var sSingleConceptJSON = jQuery("#singleConceptRawFile_"+conceptNumber).val();
    var oSingleConceptJSON = JSON.parse(sSingleConceptJSON)

    // console.log("oSingleConceptJSON A: "+JSON.stringify(oSingleConceptJSON,null,4))

    var concept_conceptNameSingular = oCurrentRawfile.concepts[conceptSlug].conceptData.slug;
    // could also do:
    // var concept_conceptNameSingular = oCurrentRawfile.concepts[conceptSlug].conceptData.oSlug.singular;
    // console.log("oCurrentRawfile: "+JSON.stringify(oCurrentRawfile,null,4))
    // do modifications to oUpdatedRawfile and oUpdatedPropertiesByConceptNumber
    // console.log("updatePropertiesForThisConcept triggered; conceptNumber: "+conceptNumber+"; oUpdatedProperties: "+JSON.stringify(oUpdatedProperties,null,4));
    var aProps = Object.keys(oSingleConceptJSON.propertiesData);
    var primPropSlug = aProps[0];
    var oPrimProp = MiscFunctions.cloneObj(oSingleConceptJSON.propertiesData[primPropSlug]);
    // now erase all oSingleConceptJSON.propertiesData except the primary property
    oSingleConceptJSON.propertiesData = {};
    oSingleConceptJSON.propertiesData[primPropSlug] = oPrimProp;
    oSingleConceptJSON.relationships = [];
    jQuery(".singlePropertyInfoBlock_"+conceptNumber).each(function(){
        var parentPropertyNumber = jQuery(this).data("parentpropertynumber");
        var propertyNumber = jQuery(this).data("propertynumber");
        var propertyName = jQuery("#propertyName_"+conceptNumber+"_"+propertyNumber).val();
        var propertyKey = MiscFunctions.convertNameToSlug(propertyName);
        var propertyTitle = MiscFunctions.convertNameToTitle(propertyName);

        var propertyKeyPaths = [];
        if (parentPropertyNumber == -1) {
            propertyKeyPaths = [propertyKey];
        }
        if (parentPropertyNumber > -1) {
            var parentPropertyKeyPaths = window.cgOverviewPage.concepts[conceptNumber].properties[parentPropertyNumber].propertyKeyPaths
            for (var x=0;x<parentPropertyKeyPaths.length;x++) {
                var parentKeyPath = parentPropertyKeyPaths[x];
                var childKeyPath = parentKeyPath + "." + propertyKey;
                propertyKeyPaths.push(childKeyPath)
            }
        }

        // deprecating use of data-level
        // var propertyLevel = jQuery("#propertyName_"+conceptNumber+"_"+propertyNumber).data("level");
        var propertyLevel = "lowerLevel"
        if (parentPropertyNumber==0) {
            propertyLevel = "topLevel"
        }

        var propertySlug = "propertyFor_"+concept_conceptNameSingular+"_"+propertyKey

        var propertyType = jQuery("#propertyType_"+conceptNumber+"_"+propertyNumber+" option:selected").val();

        var propertyRequired = jQuery("#propertyRequired_"+conceptNumber+"_"+propertyNumber).prop("checked");
        var propertyUnique = jQuery("#propertyUnique_"+conceptNumber+"_"+propertyNumber).prop("checked");

        var propertyStatusColor = jQuery("#propertyDeleteOrNot_"+conceptNumber+"_"+propertyNumber).data("status");

        if (propertyStatusColor=="green") {
            // console.log("propertyNumber: "+propertyNumber+"; propertyName: "+propertyName+"; propertySlug: "+propertySlug)
            oUpdatedProperties[propertyNumber].propertySlug = propertySlug
            oUpdatedProperties[propertyNumber].propertyKey = propertyKey;
            oUpdatedProperties[propertyNumber].propertyKeyPaths = propertyKeyPaths;
            oUpdatedProperties[propertyNumber].propertyName = propertyName;
            oUpdatedProperties[propertyNumber].propertyType = propertyType;
            oUpdatedProperties[propertyNumber].propertyStatusColor = propertyStatusColor;
            oUpdatedProperties[propertyNumber].required = propertyRequired;
            oUpdatedProperties[propertyNumber].unique = propertyUnique;

            oSingleConceptJSON.propertiesData[propertySlug] = MiscFunctions.cloneObj(window.oPropertyDataBlank)
            oSingleConceptJSON.propertiesData[propertySlug].slug = propertyKey
            oSingleConceptJSON.propertiesData[propertySlug].key = propertyKey
            oSingleConceptJSON.propertiesData[propertySlug].type = propertyType
            oSingleConceptJSON.propertiesData[propertySlug].name = propertyName
            oSingleConceptJSON.propertiesData[propertySlug].title = propertyTitle
            // Might not want to do this step; ought to add description field for user to input instead.
            // Or at least make no changes from previous description.
            if ((propertyName=="slug") || (propertyName=="name") || (propertyName=="title") || (propertyName=="description") ) {
                oSingleConceptJSON.propertiesData[propertySlug].description = "the "+propertyName+" for this "+concept_conceptNameSingular;
            }
            oSingleConceptJSON.propertiesData[propertySlug].metaData.governingConcept.slug = conceptSlug;
            oSingleConceptJSON.propertiesData[propertySlug].metaData.required = propertyRequired
            oSingleConceptJSON.propertiesData[propertySlug].metaData.unique = propertyUnique
            if (propertyLevel=="topLevel") {
                oSingleConceptJSON.propertiesData[propertySlug].metaData.types.push("topLevel")
            }
            // now add relationship
            // if (propertyLevel=="topLevel") {
                var oNextPropertyRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
                oNextPropertyRel.nodeFrom.slug = propertySlug
                oNextPropertyRel.relationshipType.slug = "addToConceptGraphProperties"
                oNextPropertyRel.relationshipType.addToConceptGraphPropertiesData = {};
                oNextPropertyRel.relationshipType.addToConceptGraphPropertiesData.includeDependencies = false;
                oNextPropertyRel.nodeTo.slug = oUpdatedProperties[parentPropertyNumber].propertySlug;
                oSingleConceptJSON.relationships.push(oNextPropertyRel)
            // }
        }
    })
    // console.log("oUpdatedProperties: "+JSON.stringify(oUpdatedProperties,null,4))
    window.oCg_modified[cgID].propertiesByConceptNumber[conceptNumber] = MiscFunctions.cloneObj(oUpdatedProperties);
    // console.log("oSingleConceptJSON B: "+JSON.stringify(oSingleConceptJSON,null,4))
    jQuery("#singleConceptRawFile_"+conceptNumber).val(JSON.stringify(oSingleConceptJSON,null,4));

    // now apply the changes to this concept to the concept graph rawfile
    updateConceptGraphRawfileFromIndividualConceptRawfiles();
}

const populateExplorer = async () => {
    var cgID = jQuery("#cg_entire_selector option:selected").data("cgid")
    var sqlID = jQuery("#cg_entire_selector option:selected").data("sqlid")
    // var oRawFile = window.oCg_entire[cgID].rawFile;
    var oRawFile = window.oCg_modified[cgID].rawFile;
    var sRawFile = JSON.stringify(oRawFile,null,4);
    jQuery("#rawFileTextarea").val(sRawFile);

    //////////////////////////////////////
    // POPULATE CONCEPT GRAPH BASIC INFO
    var oConceptGraphData = oRawFile.conceptGraphData;
    var oConcepts = oRawFile.concepts;
    var aConceptList = Object.keys(oConcepts);

    var cg_slug = oConceptGraphData.slug;
    var cg_name = oConceptGraphData.name;
    var cg_title = oConceptGraphData.title;
    var cg_description = oConceptGraphData.description;

    var cgBasicInfoHTML = "";

    cgBasicInfoHTML += "<div>";
        cgBasicInfoHTML += "<div class=compactFilesExplorerPage_leftField >sql ID:</div>";
        cgBasicInfoHTML += "<div class=compactFilesExplorerPage_rightField >"+sqlID+"</div>";
    cgBasicInfoHTML += "</div>";

    cgBasicInfoHTML += "<div>";
        cgBasicInfoHTML += "<div class=compactFilesExplorerPage_leftField >name:</div>";
        cgBasicInfoHTML += "<textarea id='conceptGraphNameTextarea' type=text class='compactFilesExplorerPage_rightField conceptGraphBasicInfoField' >"+cg_name+"</textarea>";
    cgBasicInfoHTML += "</div>";

    cgBasicInfoHTML += "<div>";
        cgBasicInfoHTML += "<div class=compactFilesExplorerPage_leftField >slug:</div>";
        cgBasicInfoHTML += "<textarea id='conceptGraphSlugTextarea' type=text class='compactFilesExplorerPage_rightField conceptGraphBasicInfoField' >"+cg_slug+"</textarea>";
    cgBasicInfoHTML += "</div>";

    cgBasicInfoHTML += "<div>";
        cgBasicInfoHTML += "<div class=compactFilesExplorerPage_leftField >title:</div>";
        cgBasicInfoHTML += "<textarea id='conceptGraphTitleTextarea' type=text class='compactFilesExplorerPage_rightField conceptGraphBasicInfoField' >"+cg_title+"</textarea>";
    cgBasicInfoHTML += "</div>";

    cgBasicInfoHTML += "<div>";
        cgBasicInfoHTML += "<div class=compactFilesExplorerPage_leftField >description:</div>";
        cgBasicInfoHTML += "<textarea id='conceptGraphDescriptionTextarea' class='compactFilesExplorerPage_rightField conceptGraphBasicInfoField' style=height:100px; >"+cg_description+"</textarea>";
    cgBasicInfoHTML += "</div>";

    jQuery("#cgBasicInfoContainer").html(cgBasicInfoHTML)
    jQuery(".conceptGraphBasicInfoField").change(function(){
        updateCurrentConceptGraphRawFile()
    })

    ////////////////////////////////////////////////////////////////////////////
    // POPULATE CONCEPTS LIST (conceptsList, interConceptsRelationshipsList)
    jQuery("#conceptsList").html("");
    jQuery("#interConceptsRelationshipsList").html("");

    var titleHTML = "";
    titleHTML += "<div style='border:1px dashed purple;margin-top:5px;' >";
        titleHTML += "<div style='display:inline-block;width:30px;color:blue;' >";
        titleHTML += "#";
        titleHTML += "</div>";

        titleHTML += "<div style='display:inline-block;width:280px;height:30px;' >";
        titleHTML += "name (singular)";
        titleHTML += "</div>";

        titleHTML += "<div style='display:inline-block;width:280px;height:30px;margin-left:20px;' >";
        titleHTML += "name (plural)";
        titleHTML += "</div>";
    titleHTML += "</div>";
    jQuery("#conceptsList").append(titleHTML);

    window.oCg_entire[cgID].conceptsList = [];
    for (var a=0;a<aConceptList.length;a++) {
        var nextConcept_slug = aConceptList[a];
        var oSingleConcept = oConcepts[nextConcept_slug];
        var oWordTypeData = oSingleConcept.wordTypeData;
        var oConceptData = oSingleConcept.conceptData;
        var oPropertiesData = oSingleConcept.propertiesData;
        var aRelationshipsForProperties = oSingleConcept.relationships;
        var oSetsData = oSingleConcept.setsData;
        var aRelationshipsForSets = oSingleConcept.relationshipsForSets;
        var oSpecificInstancesData = oSingleConcept.specificInstancesData;
        var aRelationshipsForSpecificInstances = oSingleConcept.relationshipsForSpecificInstances;

        window.oCg_entire[cgID].conceptsList[a] = nextConcept_slug;

        var singular = oConceptData.name.singular;
        var plural = oConceptData.name.plural;
        var description = oConceptData.description;

        var nextConceptHTML = "";
        nextConceptHTML += "<div class='conceptsListFieldsContainer' data-conceptnum='"+a+"' style='border:1px dashed purple;margin-top:5px;' >";
            nextConceptHTML += "<div style='display:inline-block;width:30px;color:blue;' >";
            nextConceptHTML += a;
            nextConceptHTML += "</div>";

            nextConceptHTML += "<textarea class='conceptsListField' id='conceptsList_nameSingular_"+a+"' style='display:inline-block;width:280px;height:30px;' >";
            nextConceptHTML += singular;
            nextConceptHTML += "</textarea>";

            nextConceptHTML += "<textarea class='conceptsListField' id='conceptsList_namePlural_"+a+"' style='display:inline-block;width:280px;height:30px;margin-left:20px;' >";
            nextConceptHTML += plural;
            nextConceptHTML += "</textarea>";
        nextConceptHTML += "</div>";
        jQuery("#conceptsList").append(nextConceptHTML);
    }
    window.oCg_modified[cgID].conceptsList = MiscFunctions.cloneObj(window.oCg_entire[cgID].conceptsList);

    ////////////////////////////////////////////////////////////////////////////
    // POPULATE SINGLE CONCEPTS  (singleConceptSelectorContainer, singleConceptsPanelsContainer)
    populateSingleConcepts(cgID,oRawFile)
    populateSingleEnumerations(oRawFile)
}

const showSingleConceptData = () => {
    var selectedConceptSlug = jQuery("#singleConceptSelector option:selected").data("slug")
    jQuery(".compactFilesExplorerPageSingleConceptPanel").css("display","none")
    jQuery("#singleConceptPanel_"+selectedConceptSlug).css("display","block")
}

const showSingleEnumerationData = () => {
    var selectedEnumerationSlug = jQuery("#singleEnumerationSelector option:selected").data("slug")
    jQuery(".compactFilesExplorerPageSingleEnumerationPanel").css("display","none")
    jQuery("#singleEnumerationPanel_"+selectedEnumerationSlug).css("display","block")
}

export default class ConceptGraphsImportsExportsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        loadCgEntireFiles();

        jQuery(".panelSelectorButton").click(function(){
            jQuery(".panelSelectorButton").css("backgroundColor","grey")
            jQuery(this).css("backgroundColor","green")

            var targetContainerID = jQuery(this).data("targetcontainerid")

            jQuery(".compactFilesExplorerPanel").css("display","none")
            jQuery("#"+targetContainerID).css("display","block")
        });
        jQuery("#makeNewEnumerationButton").click(function(){
            console.log("makeNewEnumerationButton clicked")
            var cgID = jQuery("#cg_entire_selector option:selected").data("cgid")
            var oRawFile = window.oCg_modified[cgID].rawFile;
            var oConceptGraphData = oRawFile.conceptGraphData;
            var oConcepts = oRawFile.concepts;
            var oEnumerations = oRawFile.enumerations;
            var aConceptList = Object.keys(oConcepts);
            var aEnumerationList = Object.keys(oEnumerations);
            var nextEnumerationNum = aEnumerationList.length;

            jQuery(".compactFilesExplorerPageSingleEnumerationPanel").css("display","none")
            var selectedEnumerationSlug = "newEnumeration";
            jQuery("#singleEnumerationPanel_"+selectedEnumerationSlug).css("display","block")
        });

        jQuery("#makeNewConceptButton").click(function(){
            console.log("makeNewConceptButton clicked")

            var cgID = jQuery("#cg_entire_selector option:selected").data("cgid")
            var oRawFile = window.oCg_modified[cgID].rawFile;
            var oConceptGraphData = oRawFile.conceptGraphData;
            var oConcepts = oRawFile.concepts;
            var aConceptList = Object.keys(oConcepts);
            var nextConceptNum = window.oCg_modified[cgID].conceptsList.length;
            window.oCg_modified[cgID].conceptsList[nextConceptNum] = null;
            var newConceptHTML = "";
            newConceptHTML += "<div class='conceptsListFieldsContainer' data-conceptnum='"+nextConceptNum+"' style='border:1px dashed purple;margin-top:5px;' >";
                newConceptHTML += "<div style='display:inline-block;width:30px;color:blue;' >";
                newConceptHTML += nextConceptNum;
                newConceptHTML += "</div>";

                newConceptHTML += "<textarea class='conceptsListField' data-conceptnum='"+nextConceptNum+"' id='conceptsList_nameSingular_"+nextConceptNum+"' style='display:inline-block;width:280px;height:30px;' >";
                // newConceptHTML += singular;
                newConceptHTML += "</textarea>";

                newConceptHTML += "<textarea class='conceptsListField' data-conceptnum='"+nextConceptNum+"' id='conceptsList_namePlural_"+nextConceptNum+"' style='display:inline-block;width:280px;height:30px;margin-left:20px;' >";
                // newConceptHTML += plural;
                newConceptHTML += "</textarea>";
            newConceptHTML += "</div>";
            jQuery("#conceptsList").append(newConceptHTML)

            jQuery(".conceptsListField").off().change(function(){
                updateCurrentConceptGraphRawFile()
            })
        });
        jQuery("#saveChangesButton").click(function(){
            console.log("saveChangesButton clicked")
            update_cg_entire_file();
        });
        jQuery("#saveNewCompactFileButton").click(function(){
            console.log("saveNewCompactFileButton clicked")
            createNew_cg_entire_file();
        })
        jQuery("#deleteCompactFileButton").click(function(){
            console.log("deleteCompactFileButton clicked")
            delete_cg_entire_file();
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Compact Concept Graph Imports / Exports Files</div>
                        <center>
                        <div style={{display:"inline-block",border:"1px dashed grey",width:"1000px",height:"900px",textAlign:"left"}}>
                            <center>Load Existing</center>
                            <div id="cg_entire_selectorContainer" style={{display:"inline-block"}} >cg_entire_selectorContainer</div>
                            <div id="saveChangesButton" className="doSomethingButton">save changes</div>
                            <div id="saveNewCompactFileButton" className="doSomethingButton">save as new compact file</div>
                            <div id="deleteCompactFileButton" className="doSomethingButton">delete this file</div>

                            <br/>

                            <div className="doSomethingButton panelSelectorButton" data-targetcontainerid="rawFileContainer" >rawFile</div>
                            <div id="cgBasicInfoButton" className="doSomethingButton panelSelectorButton" data-targetcontainerid="cgBasicInfoContainer" >cg basic info</div>
                            <div className="doSomethingButton panelSelectorButton" data-targetcontainerid="concepstListWithRelationshipsContainer" >concepts list with relationships</div>
                            <div id="conceptsContainerButton" className="doSomethingButton panelSelectorButton" data-targetcontainerid="conceptsContainer" >concepts - expanded</div>
                            <div id="enumerationsContainerButton" className="doSomethingButton panelSelectorButton" data-targetcontainerid="enumerationsContainer" >enumerations</div>

                            <div id="rawFileContainer" className="compactFilesExplorerPanel" >
                                <center>rawFileContainer</center>
                                <textarea id="rawFileTextarea" style={{width:"90%",height:"700px"}}>rawFileTextarea</textarea>
                            </div>

                            <div id="cgBasicInfoContainer" className="compactFilesExplorerPanel" >
                                <center>cgBasicInfoContainer</center>
                            </div>

                            <div id="concepstListWithRelationshipsContainer" className="compactFilesExplorerPanel" >
                                <center>
                                    Concepts List
                                    <div id="makeNewConceptButton" className="doSomethingButton_small" style={{marginLeft:"10px",width:"20px"}} >+</div>
                                </center>
                                <div id="conceptsList" style={{height:"400px",overflow:"scroll",border:"1px solid blue"}} >conceptsList</div>
                                <center>Inter-Concept Relationships</center>
                                <div id="interConceptsRelationshipsList" style={{height:"300px",overflow:"scroll",border:"1px solid blue"}} >interConceptsRelationshipsList</div>
                            </div>

                            <div id="conceptsContainer" className="compactFilesExplorerPanel" >
                                <center>Concepts</center>
                                <div id="singleConceptSelectorContainer" >singleConceptSelectorContainer</div>
                                <div id="singleConceptsPanelsContainer" >singleConceptsPanelsContainer</div>
                            </div>

                            <div id="enumerationsContainer" className="compactFilesExplorerPanel" >
                                <center>
                                    Enumerations
                                    <div id="makeNewEnumerationButton" className="doSomethingButton_small" style={{marginLeft:"10px",width:"20px"}} >+</div>
                                </center>
                                <div id="singleEnumerationSelectorContainer" >singleEnumerationSelectorContainer</div>
                                <div id="singleEnumerationsPanelsContainer" >singleEnumerationsPanelsContainer</div>
                            </div>

                        </div>
                        </center>

                    </div>
                </fieldset>
            </>
        );
    }
}
