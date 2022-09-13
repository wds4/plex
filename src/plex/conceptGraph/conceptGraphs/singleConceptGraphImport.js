import React from "react";
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/singleConceptGraph_leftNav2.js';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");

const loadCompactExportFiles = async () => {
    var sql = "";
    sql += " SELECT * from compactExports ";
    window.oCompactExports = {};
    var r = await sendAsync(sql).then( async (result) => {
        var aResult = result;
        var outputFile = "";
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

            if (!window.oCompactExports.hasOwnProperty(nextFile_conceptGraphTableName)) {
                window.oCompactExports[nextFile_conceptGraphTableName] = {};
            }
            if (!window.oCompactExports[nextFile_conceptGraphTableName].hasOwnProperty(nextFile_slugForContext)) {
                window.oCompactExports[nextFile_conceptGraphTableName][nextFile_slugForContext] = {};
            }
            window.oCompactExports[nextFile_conceptGraphTableName][nextFile_slugForContext][nextFile_filetype] = oRawFile;
        }
    });
}

const makeCompactGraphSourcesSelector = () => {
    var selectorHTML = "";
    selectorHTML += "<select id='compactGraphSourcesSelector' >";
    var aConceptGraphs = Object.keys(window.oCompactExports)
    console.log("makeCompactGraphSourcesSelector; aConceptGraphs.length: "+aConceptGraphs.length)
    for (var a=0;a<aConceptGraphs.length;a++) {
        var nextConceptGraph_tableName = aConceptGraphs[a];
        console.log("makeCompactGraphSourcesSelector; nextConceptGraph_tableName: "+nextConceptGraph_tableName)
        selectorHTML += "<option ";
        selectorHTML += " data-tablename='"+nextConceptGraph_tableName+"' ";
        selectorHTML += " >";
        selectorHTML += nextConceptGraph_tableName;
        selectorHTML += "</option>";
    }

    selectorHTML += "</select>";
    jQuery("#compactGraphSourcesSelectorContainer").html(selectorHTML)

    populateImportOptionsFields();
    jQuery("#compactGraphSourcesSelector").change(function(){
        populateImportOptionsFields();
    })
}

const populateImportOptionsFields = () => {
    var optionsHTML = "";
    var selectedConceptGraph_tableName = jQuery("#compactGraphSourcesSelector option:selected").data("tablename")
    if (selectedConceptGraph_tableName) {
        var oSlugForContext = window.oCompactExports[selectedConceptGraph_tableName];
        var aSlugForContext = Object.keys(oSlugForContext);
        for (var a=0;a<aSlugForContext.length;a++) {
            var nextSlugForContext = aSlugForContext[a];
            optionsHTML += "<div style='color:purple;background-color:#AFAFAF' >";
            optionsHTML += nextSlugForContext;
            optionsHTML += "</div>";

            var oFiletypes = window.oCompactExports[selectedConceptGraph_tableName][nextSlugForContext];
            var aFiletypes = Object.keys(oFiletypes);
            for (var c=0;c<aFiletypes.length;c++) {
                var nextFiletype = aFiletypes[c];
                optionsHTML += "<div style='border:1px dashed grey;' >";
                    optionsHTML += "<input class=importOptionCheckbox type=checkbox  ";
                    optionsHTML += " data-conceptgraphtablename='"+selectedConceptGraph_tableName+"' ";
                    optionsHTML += " data-filetype='"+nextFiletype+"' ";
                    optionsHTML += " data-conceptslug='"+nextSlugForContext+"' ";
                    optionsHTML += " > ";
                    optionsHTML += nextFiletype;
                    optionsHTML += " ( "+selectedConceptGraph_tableName+" ) ";
                optionsHTML += "</div>";
            }
        }
    }
    jQuery("#importOptionsContainer").html(optionsHTML);
    jQuery(".importOptionCheckbox").off().change(function(){
        processOptionCheckboxes();
    })
    jQuery("#queueRawFileInputsContainer").html("")
    jQuery("#queueContainer").html("")
}

const fullyAutomatedImportAndProcessing = async (queueNumber) => {
    window.oAutomatedImportData = {};
    window.oAutomatedImportData.running=true;
    var progressUpdateHTML = "";
    progressUpdateHTML = "starting import; queueNumber: "+queueNumber;
    jQuery("#automatedImport_updateProgressContainer").html(progressUpdateHTML)
    jQuery("#forAutomation_"+queueNumber+"_addAllConceptCores").get(0).click();
}

const addToQueue = (queueNumber,tablename,filetype,conceptSlug) => {
    var oRawFile = window.oCompactExports[tablename][conceptSlug][filetype];
    var sRawFile = JSON.stringify(oRawFile,null,4)

    var queueRawFileInputHTML = "";
    queueRawFileInputHTML += tablename + "."+filetype + "." + conceptSlug + ":";
    queueRawFileInputHTML += "<textarea style=width:600px;height:200px;margin-top:10px;>"
    queueRawFileInputHTML += sRawFile;
    queueRawFileInputHTML += "</textarea>"

    var commandName = "";
    var command2Name = "";
    var command3Name = "";
    var command4Name = "";
    var command5Name = "";

    if (filetype=="concept_entire") {
        commandName = "addAllConceptCores";
        command2Name = "addAllConceptProperties";
        command3Name = "addAllConceptSets";
        command4Name = "addAllConceptSpecificInstances";
    }

    if (filetype=="cg_entire") {
        commandName = "addAllConceptCores";
        command2Name = "addAllConceptProperties";
        command3Name = "addAllConceptSets";
        command4Name = "addAllConceptSpecificInstances";
        command5Name = "addAllEnumerations";
    }

    if (filetype=="concept_core") {
        commandName = "addConceptCore";
    }
    if (filetype=="concept_propertiesEntire") {
        commandName = "addPropertiesToConcept";
    }
    if (filetype=="concept_setsEntire") {
        commandName = "addSetsToConcept";
    }
    if (filetype=="concept_specificInstancesEntire") {
        commandName = "addAllSpecificInstancesPlusTree"
    }
    // si_all is identical to concept_specificInstancesEntire
    if (filetype=="si_all") {
        commandName = "addAllSpecificInstancesPlusTree"
    }

    // not yet implemented
    if (filetype=="si_selected") {
    }

    window.oCompactExports.aTransferCommandsQueue[queueNumber] = {};
    window.oCompactExports.aTransferCommandsQueue[queueNumber].commandName = commandName;
    window.oCompactExports.aTransferCommandsQueue[queueNumber].tablename = tablename;
    window.oCompactExports.aTransferCommandsQueue[queueNumber].conceptSlug = conceptSlug;
    window.oCompactExports.aTransferCommandsQueue[queueNumber].filetype = filetype;
    window.oCompactExports.aTransferCommandsQueue[queueNumber].oEnumerationsData = {};
    var oEnumerationsData = {};
    if (filetype=="cg_entire") {
        oEnumerationsData = MiscFunctions.cloneObj(window.oCompactExports[tablename][conceptSlug][filetype].enumerations);
    }
    window.oCompactExports.aTransferCommandsQueue[queueNumber].oEnumerationsData = oEnumerationsData;
    var oAuxData = MiscFunctions.cloneObj(window.oCompactExports[tablename][conceptSlug][filetype]);
    if (filetype=="cg_entire") {
        var oEnumerationsData = oAuxData.enumerations;
        oAuxData = oAuxData.concepts;
    }
    window.oCompactExports.aTransferCommandsQueue[queueNumber].oAuxiliaryData = oAuxData;

    var queueHTML = "";
    if ( (filetype=="concept_entire") || (filetype=="cg_entire") ) {
        queueHTML += "<div style='border:1px solid black;' >"
            queueHTML += "Fully automated import and processing of all checked concepts: "
            queueHTML += "<div id='automatedImportButton' data-queuenumber='"+queueNumber+"' class='doSomethingButton_small' >run</div> ";
            queueHTML += "<div>";
            queueHTML += "Progress: ";
            queueHTML += "<div id='automatedImport_updateProgressContainer' style='display:inline-block;margin-left:10px;background-color:orange;width:80%;padding:2px;' >";
            queueHTML += "progress update";
            queueHTML += "</div>";
            queueHTML += "</div>";
        queueHTML += "</div>";
    }
    queueHTML += "<div style='border:1px solid black;' >"
    queueHTML += "<div id='forAutomation_"+queueNumber+"_"+commandName+"' data-commandname='"+commandName+"' data-queuenumber='"+queueNumber+"' class='doSomethingButton_small runQueuedCommandButton' >run</div> ";
    queueHTML += "<div style='display:inline-block;' id='titleContainerFor_"+commandName+"' >";
    queueHTML += commandName;
    queueHTML += "</div>";
    queueHTML += " concept: "+conceptSlug;

    if ( (filetype=="concept_entire") || (filetype=="cg_entire") ) {
        queueHTML += "<div style='border:1px solid black;' >"
        queueHTML += "<div id='forAutomation_"+queueNumber+"_"+command2Name+"' data-commandname='"+command2Name+"' data-queuenumber='"+queueNumber+"' class='doSomethingButton_small runQueuedCommandButton' >run</div> ";
        queueHTML += "<div style='display:inline-block;' id='titleContainerFor_"+command2Name+"' >";
        queueHTML += command2Name;
        queueHTML += "</div>";
        queueHTML += " concept: "+conceptSlug;
        queueHTML += "</div>"

        queueHTML += "<div style='border:1px solid black;' >"
        queueHTML += "<div id='forAutomation_"+queueNumber+"_"+command3Name+"' data-commandname='"+command3Name+"' data-queuenumber='"+queueNumber+"' class='doSomethingButton_small runQueuedCommandButton' >run</div> ";
        queueHTML += "<div style='display:inline-block;' id='titleContainerFor_"+command3Name+"' >";
        queueHTML += command3Name;
        queueHTML += "</div>";
        queueHTML += " concept: "+conceptSlug;
        queueHTML += "</div>"

        queueHTML += "<div style='border:1px solid black;' >"
        queueHTML += "<div id='forAutomation_"+queueNumber+"_"+command4Name+"' data-commandname='"+command4Name+"' data-queuenumber='"+queueNumber+"' class='doSomethingButton_small runQueuedCommandButton' >run</div> ";
        queueHTML += "<div style='display:inline-block;' id='titleContainerFor_"+command4Name+"' >";
        queueHTML += command4Name;
        queueHTML += "</div>";
        queueHTML += " concept: "+conceptSlug;
        queueHTML += "</div>"

        if (filetype=="cg_entire") {
            queueHTML += "<div style='border:1px solid black;' >"
            queueHTML += "<div id='forAutomation_"+queueNumber+"_"+command5Name+"' data-commandname='"+command5Name+"' data-queuenumber='"+queueNumber+"' class='doSomethingButton_small runQueuedCommandButton' >run</div> ";
            queueHTML += "<div style='display:inline-block;' id='titleContainerFor_"+command5Name+"' >";
            queueHTML += command5Name;
            queueHTML += "</div>";
            queueHTML += " concept: "+conceptSlug;
            queueHTML += "</div>"
        }

        queueHTML += "<div style='border:1px solid black;' >"
        queueHTML += "<div id='checkAllSetsButton' class='doSomethingButton_small' >check all</div> ";
        queueHTML += "<div id='clearAllSetsButton' class='doSomethingButton_small' >uncheck all</div> ";
        queueHTML += "<br/>"
        queueHTML += "<div id='checkConceptGraphSetsButton' class='doSomethingButton_small' >check concept graph-related sets</div> ";
        queueHTML += "<div id='checkConceptGraphSetsLastStepButton' class='doSomethingButton_small' >cg sets for last step (add si)</div> ";
        queueHTML += "<br/>"
        queueHTML += "<div id='checkGrapevineSetsButton' class='doSomethingButton_small' >check grapevine-related sets</div> ";
        queueHTML += "<div id='checkOrganismSetsButton' class='doSomethingButton_small' >check organism-related sets</div> ";
        queueHTML += "</div>"

        var aConceptList = Object.keys(oAuxData)
        queueHTML += "<div style='height:150px;overflow:scroll;border:1px dashed grey;'>";
        queueHTML += "<div id='subsetButtonsContainer' ></div>";
        for (var a=0;a<aConceptList.length;a++) {
            var nextConcept_slug = aConceptList[a];
            queueHTML += "<div>";
                queueHTML += "<input data-slug='"+nextConcept_slug+"' class='concept_entire_concept_checkbox' type=checkbox /> ";
                queueHTML += nextConcept_slug;
            queueHTML += "</div>"
        }
        queueHTML += "</div>";
    }
    if (filetype=="cg_entire") {
        var aEnumerationList = Object.keys(oEnumerationsData)
        queueHTML += "<div style='height:150px;overflow:scroll;border:1px dashed grey;'>";
        for (var a=0;a<aEnumerationList.length;a++) {
            var nextEnumeration_slug = aEnumerationList[a];
            queueHTML += "<div>";
                queueHTML += "<input data-slug='"+nextEnumeration_slug+"' class='cg_entire_enumeration_checkbox' type=checkbox /> ";
                queueHTML += nextEnumeration_slug;
            queueHTML += "</div>"
        }
        queueHTML += "</div>";
    }
    queueHTML += "</div>"

    jQuery("#queueContainer").append(queueHTML)
    jQuery("#queueRawFileInputsContainer").append(queueRawFileInputHTML)

    jQuery("#automatedImportButton").click( async function(){
        var queueNumber = jQuery(this).data("queuenumber")
        fullyAutomatedImportAndProcessing(queueNumber);
    });

    jQuery(".runQueuedCommandButton").off("click")
    jQuery(".runQueuedCommandButton").click( async function(){
        console.log("runQueuedCommandButton clicked")
        var commandName = jQuery(this).data("commandname")
        var queueNumber = jQuery(this).data("queuenumber")
        console.log("runQueuedCommandButton clicked; commandName: "+commandName+"; queueNumber: "+queueNumber)
        jQuery("#titleContainerFor_"+commandName).css("color","orange");
        var fooResult = await runQueuedCommand(queueNumber,commandName);
        jQuery("#titleContainerFor_"+commandName).css("color","green");
        if (window.oAutomatedImportData.running == true) {
            /*
            if (commandName=="addAllConceptCores") {
                window.oAutomatedImportData.currentCommandName = "addAllConceptCores";
            }
            if (commandName=="addAllConceptProperties") {
                window.oAutomatedImportData.currentCommandName = "addAllConceptProperties";
            }
            if (commandName=="addAllConceptSets") {
                window.oAutomatedImportData.currentCommandName = "addAllConceptSets";
            }
            if (commandName=="addAllConceptSpecificInstances") {
                window.oAutomatedImportData.currentCommandName = "addAllConceptSpecificInstances";
            }
            */
            window.oAutomatedImportData.currentCommandName = commandName;
            window.oAutomatedImportData.currentStep = "takingPowerNap";
            window.oAutomatedImportData.currentQueueNumber=queueNumber;
            jQuery("#automatedImport_updateProgressContainer").html("getting ready to take a nap")
            var fooT = await MiscFunctions.timeout(2000)
            jQuery("#automatedImport_updateProgressContainer").html("Nap time!")
            jQuery("#takeANapButton").get(0).click();
        }
    });
    jQuery("#checkAllSetsButton").click(function(){
        jQuery("input.concept_entire_concept_checkbox").each(function(){
            jQuery(this).prop("checked",true)
        })
    });
    jQuery("#clearAllSetsButton").click(function(){
        jQuery("input.concept_entire_concept_checkbox").each(function(){
            jQuery(this).prop("checked",false)
        })
    });
    jQuery("#checkConceptGraphSetsButton").click(function(){
        /*
        // Omitting these for now from aCGList and aCG2List
        "conceptFor_patternInputField", "conceptFor_singleNodeFieldset_rcky1q","conceptFor_singleRelationshipFieldset_p6d4xm",
        "conceptFor_doubleRelationshipFieldset_5qfhtf", "conceptFor_neuroCoreActionPurposeClassification",
        */
        var aCGList = [
            "conceptFor_relationshipType",
            "conceptFor_action", "conceptFor_pattern",
            "conceptFor_propertyType",
            "conceptFor_nodeShape",

            "conceptFor_schema", "conceptFor_set","conceptFor_superset",
            "conceptFor_JSONSchema", "conceptFor_property", "conceptFor_word","conceptFor_concept",
            "conceptFor_conceptGraph","conceptFor_enumeration","conceptFor_wordType"
          ];
        jQuery("input.concept_entire_concept_checkbox").prop("checked",false)
        jQuery("input.concept_entire_concept_checkbox").each(function(){
            var foo_slug = jQuery(this).data("slug")
            if (aCGList.includes(foo_slug)) {
                jQuery(this).prop("checked",true)
            }
        })
    })
    jQuery("#checkConceptGraphSetsLastStepButton").click(function(){
        var aCG2List = [
          "conceptFor_relationshipType",
          "conceptFor_action", "conceptFor_pattern",
          "conceptFor_propertyType",
          "conceptFor_nodeShape"
          ];
        jQuery("input.concept_entire_concept_checkbox").prop("checked",false)
        jQuery("input.concept_entire_concept_checkbox").each(function(){
            var foo_slug = jQuery(this).data("slug")
            if (aCG2List.includes(foo_slug)) {
                jQuery(this).prop("checked",true)
            }
        })
    })
    jQuery("#checkGrapevineSetsButton").click(function(){
        var aCG3List = [
          "conceptFor_entity","conceptFor_entityType",
          "conceptFor_listing","conceptFor_post","conceptFor_selfDrivingCar","conceptFor_user",
          "conceptFor_rating","conceptFor_ratingTemplate"
          ];
        jQuery("input.concept_entire_concept_checkbox").prop("checked",false)
        jQuery("input.concept_entire_concept_checkbox").each(function(){
            var foo_slug = jQuery(this).data("slug")
            if (aCG3List.includes(foo_slug)) {
                jQuery(this).prop("checked",true)
            }
        })
    })
    jQuery("#checkOrganismSetsButton").click(function(){
        var aCG4List = [
          "conceptFor_animal","conceptFor_animalType",
          "conceptFor_bird","conceptFor_cat","conceptFor_cow","conceptFor_pig","conceptFor_dog","conceptFor_dogBreed",
          "conceptFor_fungus","conceptFor_germanShepherd","conceptFor_goldenRetriever","conceptFor_irishSetter","conceptFor_sheepDog",
          "conceptFor_kingdom","conceptFor_organism","conceptFor_plant"
          ];
        jQuery("input.concept_entire_concept_checkbox").prop("checked",false)
        jQuery("input.concept_entire_concept_checkbox").each(function(){
            var foo_slug = jQuery(this).data("slug")
            if (aCG4List.includes(foo_slug)) {
                jQuery(this).prop("checked",true)
            }
        })
    })
}

const addSingleConceptCore = async (conceptSlug,oAuxData) => {
    var activityLog = "";
    // first check to see whether this slug is already present in the target concept graph
    // console.log("runQueuedCommand; commandName: "+commandName)
    var alreadyExists = false;
    if (window.lookupWordBySlug.hasOwnProperty(conceptSlug)) {
        alreadyExists = true;
    }
    // console.log("runQueuedCommand; commandName: "+commandName+"; alreadyExists: "+alreadyExists)
    if (alreadyExists) {
        activityLog += conceptSlug + " already exists in this concept graph!";
        jQuery("#transferActivityLogContainer").append(activityLog)
    }
    if (!alreadyExists) {
        var oNewConcept = await MiscFunctions.createNewWordByTemplate("concept");
        oNewConcept.conceptData = {...oNewConcept.conceptData, ...oAuxData.conceptData};
        oNewConcept = MiscFunctions.populateWordDataFromPrimaryWordType(oNewConcept);
        var newConcept_slug = oNewConcept.wordData.slug;
        var newConcept_ipns = oNewConcept.metaData.ipns;

        oNewConcept.governingConceptNameSingular = oNewConcept.conceptData.name.singular;

        //////////////////////
        var newConcept_conceptNameSingular = oNewConcept.conceptData.name.singular;
        var newConcept_conceptNamePlural = oNewConcept.conceptData.name.plural;
        if (oNewConcept.conceptData.hasOwnProperty("oSlug")) {
            if (!oNewConcept.conceptData.oSlug.singular) {
                var aSingularChunks = newConcept_conceptNameSingular.split(" ");
                var sCurrConcept_conceptSlugSingular = "";
                for (var c=0;c<aSingularChunks.length;c++) {
                    var nextChunk = aSingularChunks[c];
                    if (nextChunk) {
                        if (c > 0) {
                            nextChunk = nextChunk[0].toUpperCase() + nextChunk.substring(1)
                        }
                        sCurrConcept_conceptSlugSingular += nextChunk;
                    }
                }
                oNewConcept.conceptData.oSlug.singular = sCurrConcept_conceptSlugSingular;
            }
            if (!oNewConcept.conceptData.oSlug.plural) {
                var aPluralChunks = newConcept_conceptNamePlural.split(" ");
                var sCurrConcept_conceptSlugPlural = "";
                for (var c=0;c<aPluralChunks.length;c++) {
                    var nextChunk = aPluralChunks[c];
                    if (nextChunk) {
                        if (c > 0) {
                            nextChunk = nextChunk[0].toUpperCase() + nextChunk.substring(1)
                        }
                        sCurrConcept_conceptSlugPlural += nextChunk;
                    }
                }
                oNewConcept.conceptData.oSlug.plural = sCurrConcept_conceptSlugPlural;
            }
        }
        if (oNewConcept.conceptData.hasOwnProperty("oTitle")) {
            if (!oNewConcept.conceptData.oTitle.singular) {
                var aSingularChunks = newConcept_conceptNameSingular.split(" ");
                var sCurrConcept_conceptTitleSingular = "";
                for (var c=0;c<aSingularChunks.length;c++) {
                    var nextChunk = aSingularChunks[c];
                    if (nextChunk) {
                        nextChunk = nextChunk[0].toUpperCase() + nextChunk.substring(1)
                        sCurrConcept_conceptTitleSingular += nextChunk;
                        if (c < aSingularChunks.length - 1) {
                            sCurrConcept_conceptTitleSingular += " ";
                        }
                    }
                }
                oNewConcept.conceptData.oTitle.singular = sCurrConcept_conceptTitleSingular;
            }
            if (!oNewConcept.conceptData.oTitle.plural) {
                var aPluralChunks = newConcept_conceptNamePlural.split(" ");
                var sCurrConcept_conceptTitlePlural = "";
                for (var c=0;c<aPluralChunks.length;c++) {
                    var nextChunk = aPluralChunks[c];
                    if (nextChunk) {
                        nextChunk = nextChunk[0].toUpperCase() + nextChunk.substring(1)
                        sCurrConcept_conceptTitlePlural += nextChunk;
                        if (c < aPluralChunks.length - 1) {
                            sCurrConcept_conceptTitlePlural += " ";
                        }
                    }
                }
                oNewConcept.conceptData.oTitle.plural = sCurrConcept_conceptTitlePlural;
            }
        }
        if (oNewConcept.conceptData.hasOwnProperty("oName")) {
            if (!oNewConcept.conceptData.oName.singular) {
                oNewConcept.conceptData.oName.singular = newConcept_conceptNameSingular;
            }
            if (!oNewConcept.conceptData.oName.plural) {
                oNewConcept.conceptData.oName.plural = newConcept_conceptNamePlural;
            }
        }

        var oNewWordType = await MiscFunctions.createNewWordByTemplate("wordType");
        oNewWordType.wordTypeData = {...oNewWordType.wordTypeData, ...oAuxData.wordTypeData};
        oNewWordType = MiscFunctions.populateWordDataFromPrimaryWordType(oNewWordType);
        var newWordType_slug = oNewWordType.wordData.slug;
        var newWordType_ipns = oNewWordType.metaData.ipns;
        oNewWordType.wordTypeData.metaData.governingConcept.slug = newConcept_slug;

        oNewConcept.conceptData.nodes.concept.slug = newConcept_slug;
        oNewConcept.conceptData.nodes.concept.ipns = newConcept_ipns;

        oNewConcept.conceptData.nodes.wordType.slug = newWordType_slug;
        oNewConcept.conceptData.nodes.wordType.ipns = newWordType_ipns;

        oNewConcept.metaData.replacementFor = conceptSlug;

        // console.log("oNewConcept: "+JSON.stringify(oNewConcept,null,4))
        // console.log("oNewWordType: "+JSON.stringify(oNewWordType,null,4))

        MiscFunctions.createOrUpdateWordInAllTables(oNewConcept);
        MiscFunctions.createOrUpdateWordInAllTables(oNewWordType);

        activityLog += newConcept_slug + " and " + newWordType_slug + " have been added!<br> <div style='color:orange;display:inline-block;' >TIME FOR A NAP!!</div><br/>";
        jQuery("#transferActivityLogContainer").append(activityLog)
    }
    // return something (junk) so next step awaits completeion of this function (is this necessary??)
    var fooResult = await MiscFunctions.timeout(10);
    return fooResult;
}

const addSingleConceptProperties = async (oAuxData,governingConcept_slug) => {
    console.log("addSingleConceptProperties; governingConcept_slug: "+governingConcept_slug+"; oAuxData: "+JSON.stringify(oAuxData,null,4))
    if (window.oOldWordReplacementMap.hasOwnProperty(governingConcept_slug)) {
        console.log("using oOldWordReplacementMap to replace "+governingConcept_slug+" with "+window.oOldWordReplacementMap[governingConcept_slug])
        governingConcept_slug = window.oOldWordReplacementMap[governingConcept_slug];

    }
    console.log("window.oOldWordReplacementMap: "+JSON.stringify(window.oOldWordReplacementMap,null,4))
    var oGoverningConcept = window.lookupWordBySlug[governingConcept_slug]
    var propertySchema_slug = oGoverningConcept.conceptData.nodes.propertySchema.slug;
    var oPropertySchema = window.lookupWordBySlug[propertySchema_slug]

    var activityLogAddition = "";
    var oProperties = MiscFunctions.cloneObj(oAuxData.propertiesData)
    var aRelationships = MiscFunctions.cloneObj(oAuxData.relationships)
    var aProperties = Object.keys(oProperties);
    var governingConceptNameSingular = oAuxData.governingConceptNameSingular;
    var governingConcept_conceptSlugSingular = oGoverningConcept.conceptData.slug;
    // OR: governingConcept_conceptSlugSingular = oGoverningConcept.conceptData.oSlug.singular;
    var oPropertyReplacementMap = {};
    for (var a=0;a<aProperties.length;a++) {
        var nextProperty_slug = aProperties[a];
        var alreadyExists = false;
        if (window.lookupWordBySlug.hasOwnProperty(nextProperty_slug)) {
            alreadyExists = true;
        }
        // need to check whether any property exists that has metaData.replacementFor == nextProperty_slug; if so, alreadyExists = true
        var replacement_slug = MiscFunctions.doesReplacementAlreadyExist(nextProperty_slug);
        if (replacement_slug) {
            alreadyExists = true;
            oPropertyReplacementMap[nextProperty_slug] = replacement_slug;
            window.oOldWordReplacementMap[nextProperty_slug] = replacement_slug
        }
        // console.log("a: "+a+"; nextProperty_slug: "+nextProperty_slug+"; alreadyExists: "+alreadyExists)
        if (alreadyExists) {
            activityLogAddition = nextProperty_slug + " already exists in this concept graph!<br/>";
            jQuery("#transferActivityLogContainer").append(activityLogAddition)
        }
        if (!alreadyExists) {
            var oNewProperty = await MiscFunctions.createNewWordByTemplate("property");
            oNewProperty.propertyData = {...oNewProperty.propertyData, ...oProperties[nextProperty_slug]};
            oNewProperty.propertyData.metaData = {...oNewProperty.propertyData.metaData, ...oProperties[nextProperty_slug].metaData};

            oNewProperty = MiscFunctions.populateWordDataFromPropertyData(oNewProperty,governingConceptNameSingular,governingConcept_conceptSlugSingular);

            var newProperty_slug = oNewProperty.wordData.slug;
            oNewProperty.metaData.replacementFor = nextProperty_slug;

            // console.log("oNewProperty: "+JSON.stringify(oNewProperty,null,4))

            MiscFunctions.createOrUpdateWordInAllTables(oNewProperty);

            oPropertyReplacementMap[nextProperty_slug] = newProperty_slug;
            activityLogAddition = newProperty_slug + " has been created to replace: " +nextProperty_slug + "!<br> <div style='color:orange;display:inline-block;' >TIME FOR A NAP!!</div><br/>";
            jQuery("#transferActivityLogContainer").append(activityLogAddition)
        }
    }
    // next, add relationships
    var aReplacedProperties = Object.keys(oPropertyReplacementMap)
    // console.log("oPropertyReplacementMap: "+JSON.stringify(oPropertyReplacementMap,null,4))
    // need this time delay to ensure all newly created words have been processed
    // prior to adding them to propertySchema.
    // (or just need to get await / async to work properly ? ... jQuery might be interfering somewhere ? )
    await MiscFunctions.timeout(2000);
    for (var a=0;a<aRelationships.length;a++) {
        var oNextRel = aRelationships[a];
        for (var p=0;p<aReplacedProperties.length;p++) {
            var nextOldProperty = aReplacedProperties[p];
            if (nextOldProperty == oNextRel.nodeFrom.slug) {
                oNextRel.nodeFrom.slug = oPropertyReplacementMap[nextOldProperty]
            }
            if (nextOldProperty == oNextRel.nodeTo.slug) {
                oNextRel.nodeTo.slug = oPropertyReplacementMap[nextOldProperty]
            }
        }
        // console.log("oNextRel: "+JSON.stringify(oNextRel,null,4))
        // replace updateSchemaWithNewRel with a function that looks in metaData.replacementFor to determine what to do
        oPropertySchema = MiscFunctions.updateSchemaWithNewRel(oPropertySchema,oNextRel,window.lookupWordBySlug)
    }
    // console.log("oPropertySchema: "+JSON.stringify(oPropertySchema,null,4))
    MiscFunctions.createOrUpdateWordInAllTables(oPropertySchema);
    activityLogAddition = propertySchema_slug + " has been updated. <br> <div style='color:orange;display:inline-block;' >TIME FOR A NAP!!</div><br/>";
    jQuery("#transferActivityLogContainer").append(activityLogAddition)

    // return something (junk) so next step awaits completeion of this function (is this necessary??)
    var fooResult = await MiscFunctions.timeout(10);
    return fooResult;
}
const addSingleSpecificInstance = async (specificInstanceSlug,oAuxData) => {
    var activityLogAddition = "";
    console.log("addSingleSpecificInstance; specificInstanceSlug: "+specificInstanceSlug)
    var governingConcept_slug = oAuxData.governingConcept.slug;
    var oGoverningConcept = window.lookupWordBySlug[governingConcept_slug];
    var singular = oGoverningConcept.conceptData.name.singular;
    var superset_slug = oGoverningConcept.conceptData.nodes.superset.slug;
    var oSuperset = window.lookupWordBySlug[superset_slug];
    var aExistingSpecificInstances = oSuperset.globalDynamicData.specificInstances;

    var propertyPath = oGoverningConcept.conceptData.propertyPath;
    var oSpecificInstanceData = oAuxData.specificInstancesData[specificInstanceSlug][propertyPath]
    var oNewSpecificInstance = oAuxData.specificInstancesData[specificInstanceSlug]

    // STILL NEED TO DO THIS
    // Simlar to adding new sets to a concept ( see: if (commandName=="addSetsToConcept") )
    // determine whether this specific instance already exists;
    // cycle through all existing words, wordSlug and oWord;
    // check to see if oWord[propertyPath].name == oSpecificInstanceData.name
    // [[ AND if wordSlug is already a specificInstance of the superset for this concept - ?? ]]
    // Probably ought to update the existing work and flag it, in preparation for adding relationships in later step:
    // oPreexistingSpecificInstance.metaData.replacementFor = specificInstanceSlug;
    var alreadyExists = false;
    var aWords = Object.keys(window.lookupWordBySlug)
    for (var w=0;w<aWords.length;w++) {
        var wordSlug = aWords[w];
        var oWord = window.lookupWordBySlug[wordSlug]
        if (aExistingSpecificInstances.includes(wordSlug)) {
            if (oWord.hasOwnProperty(propertyPath)) {
                if (oWord[propertyPath].hasOwnProperty("name")) {
                    if (oWord[propertyPath].name == oSpecificInstanceData.name) {
                        oSpecificInstanceReplacementMap[specificInstanceSlug] = wordSlug;
                        window.oOldWordReplacementMap[specificInstanceSlug] = wordSlug
                        alreadyExists = true;
                    }
                }
            }
        }
        // OR if it's already flagged as a replacement for this si
        if (oWord.metaData.hasOwnProperty("replacementFor")) {
            var rF_slug = oWord.metaData.replacementFor;
            if (rF_slug==specificInstanceSlug) {
                oSpecificInstanceReplacementMap[specificInstanceSlug] = wordSlug;
                window.oOldWordReplacementMap[specificInstanceSlug] = wordSlug
                alreadyExists = true;
            }
        }
    }
    // may be the new way to check if already exists:
    if (window.aOldReplacedWords.includes(specificInstanceSlug)) {
        alreadyExists = true;
    }
    if (window.aNewReplacerWords.includes(specificInstanceSlug)) {
        alreadyExists = true;
    }
    console.log("_alreadyExists_ specificInstanceSlug: "+specificInstanceSlug+"; alreadyExists: "+alreadyExists)
    console.log("_alreadyExists_ window.aOldReplacedWords: "+JSON.stringify(window.aOldReplacedWords,null,4))
    console.log("_alreadyExists_ window.aNewReplacerWords: "+JSON.stringify(window.aNewReplacerWords,null,4))
    if (alreadyExists) {
        activityLogAddition = specificInstanceSlug + " already exists in this concept graph!<br/>";
        jQuery("#transferActivityLogContainer").append(activityLogAddition)

    }
    if (!alreadyExists) {
        var oSpecificInstance_unedited = await MiscFunctions.createNewWordByTemplate("word");
        // oSpecificInstance_unedited.metaData.replacementFor = oAuxData
        oSpecificInstance_unedited.metaData.replacementFor = specificInstanceSlug;
        var newWord_ipns = oSpecificInstance_unedited.metaData.ipns;
        var newWord_slug = "";
        if (oNewSpecificInstance[propertyPath].hasOwnProperty("slug")) {
            newWord_slug = oNewSpecificInstance[propertyPath].slug;
        }
        if (newWord_slug) {
            oSpecificInstance_unedited.wordData.slug = singular+"_"+newWord_slug+"_"+newWord_ipns.substr(-6);
        } else {
            oSpecificInstance_unedited.wordData.slug = singular+"_"+newWord_ipns.substr(-6);
        }
        oSpecificInstance_unedited.wordData.wordType = singular;
        if (jQuery.inArray(singular,oSpecificInstance_unedited.wordData.wordTypes) == -1) {
            oSpecificInstance_unedited.wordData.wordTypes.push(singular)
        }
        if (oNewSpecificInstance[propertyPath].hasOwnProperty("name")) {
            var form_name = oNewSpecificInstance[propertyPath].name;
            oSpecificInstance_unedited.wordData.name = singular+": "+form_name;
        }
        if (oNewSpecificInstance[propertyPath].hasOwnProperty("title")) {
            var form_title = oNewSpecificInstance[propertyPath].title;
            oSpecificInstance_unedited.wordData.title = singular[0].toUpperCase() + singular.substring(1)+": "+form_title;
        }
        // jQuery.extend(oNewSpecificInstance,oSpecificInstance_unedited);
        oNewSpecificInstance = MiscFunctions.extendWithOrdering(oNewSpecificInstance,oSpecificInstance_unedited);
        oNewSpecificInstance.metaData.neuroCore.processedAsSpecificInstance = false;
        MiscFunctions.createOrUpdateWordInAllTables(oNewSpecificInstance);
        var newSpecificInstance_slug = oNewSpecificInstance.wordData.slug;
        var sNewSpecificInstance = JSON.stringify(oNewSpecificInstance,null,4);
        console.log("sNewSpecificInstance: "+sNewSpecificInstance)
        activityLogAddition = newSpecificInstance_slug + " has been created to replace: " +specificInstanceSlug + "!<br> <div style='color:orange;display:inline-block;' >TIME FOR A NAP!!</div><br/>";
        jQuery("#transferActivityLogContainer").append(activityLogAddition)
        oSpecificInstanceReplacementMap[specificInstanceSlug] = newSpecificInstance_slug;
    }
}

var oSpecificInstanceReplacementMap = {};

// deprecating oOldWordReplacementMap in place of window.oOldWordReplacementMap
var oOldWordReplacementMap = {};
export const updateOldWordReplacementMap = () => {
    console.log("updateOldWordReplacementMap")
    var oWRP = {};
    var aWords = Object.keys(window.lookupWordBySlug)
    for (var w=0;w<aWords.length;w++) {
        var wordSlug = aWords[w];
        var oWord = window.lookupWordBySlug[wordSlug]
        if (oWord.metaData.hasOwnProperty("replacementFor")) {
            var rF_slug = oWord.metaData.replacementFor;
            oWRP[rF_slug] = wordSlug;
            window.oOldWordReplacementMap[rF_slug] = wordSlug;
            window.aOldReplacedWords.push(rF_slug);
            window.aNewReplacerWords.push(wordSlug);
        }
    }

    return oWRP;
}
// oOldWordReplacementMap[oldConceptWordSlug] = thisConceptWordSlug
// [[ do this wherever I see jQuery("#transferActivityLogContainer").append(activityLogAddition) ]]

const addSingleConceptSets = async (oAuxData,governingConcept_slug) => {
    console.log("addSingleConceptSets; governingConcept_slug before: "+governingConcept_slug)
    if (window.oOldWordReplacementMap.hasOwnProperty(governingConcept_slug)) {
        governingConcept_slug = window.oOldWordReplacementMap[governingConcept_slug];
    }
    console.log("addSingleConceptSets; governingConcept_slug after: "+governingConcept_slug)
    var oGoverningConcept = window.lookupWordBySlug[governingConcept_slug]
    var mainSchema_slug = oGoverningConcept.conceptData.nodes.schema.slug;
    var oMainSchema = window.lookupWordBySlug[mainSchema_slug]
    var singular = oGoverningConcept.conceptData.name.singular;

    var activityLogAddition = "";
    var oSets = MiscFunctions.cloneObj(oAuxData.setsData)
    var aRelationships = MiscFunctions.cloneObj(oAuxData.relationshipsForSets)
    var aSets = Object.keys(oSets);
    for (var a=0;a<aSets.length;a++) {
        var nextSet_slug = aSets[a];
        var alreadyExists = false;
        if (window.lookupWordBySlug.hasOwnProperty(nextSet_slug)) {
            alreadyExists = true;
        }
        // console.log("addSingleConceptSets; adding: a "+a+"; nextSet_slug: "+nextSet_slug+"; alreadyExists: "+alreadyExists)
        if (alreadyExists) {
            activityLogAddition = nextSet_slug + " already exists in this concept graph!<br/>";
            jQuery("#transferActivityLogContainer").append(activityLogAddition)
        }
        if (!alreadyExists) {
            var oNewSet = await MiscFunctions.createNewWordByTemplate("set");
            oNewSet.setData = {...oNewSet.setData, ...oSets[nextSet_slug]};
            oNewSet.setData.metaData = {...oNewSet.setData.metaData, ...oSets[nextSet_slug].metaData};

            oNewSet = MiscFunctions.populateWordDataFromPrimaryWordType(oNewSet);

            var newSet_slug = oNewSet.wordData.slug;
            oNewSet.metaData.replacementFor = nextSet_slug;

            MiscFunctions.createOrUpdateWordInAllTables(oNewSet);

            activityLogAddition = newSet_slug + " has been created to replace: " +nextSet_slug + "!<br> <div style='color:orange;display:inline-block;' >TIME FOR A NAP!!</div><br/>";
            window.oOldWordReplacementMap[nextSet_slug] = newSet_slug
            jQuery("#transferActivityLogContainer").append(activityLogAddition)
        }
    }
    // next, add relationships
    await MiscFunctions.timeout(2000);
    for (var a=0;a<aRelationships.length;a++) {
        var oNextRel = aRelationships[a];
        var nF_slug = oNextRel.nodeFrom.slug;
        var nT_slug = oNextRel.nodeTo.slug;
        if (window.oOldWordReplacementMap.hasOwnProperty(nF_slug)) {
            oNextRel.nodeFrom.slug = window.oOldWordReplacementMap[nF_slug]
        }
        if (window.oOldWordReplacementMap.hasOwnProperty(nT_slug)) {
            oNextRel.nodeTo.slug = window.oOldWordReplacementMap[nT_slug]
        }
        oMainSchema = MiscFunctions.updateSchemaWithNewRel(oMainSchema,oNextRel,window.lookupWordBySlug)
    }
    MiscFunctions.createOrUpdateWordInAllTables(oMainSchema);
    activityLogAddition = mainSchema_slug + " has been updated. <br> <div style='color:orange;display:inline-block;' >TIME FOR A NAP!!</div><br/>";
    jQuery("#transferActivityLogContainer").append(activityLogAddition)

    // return something (junk) so next step awaits completeion of this function (is this necessary??)
    var fooResult = await MiscFunctions.timeout(10);
    return fooResult;
}

const addSingleConceptSpecificInstances = async (oAuxData,governingConcept_slug) => {
    if (window.oOldWordReplacementMap.hasOwnProperty(governingConcept_slug)) {
        governingConcept_slug = window.oOldWordReplacementMap[governingConcept_slug];
    }
    var oGoverningConcept = window.lookupWordBySlug[governingConcept_slug]
    var appendIpnsFragmentToSlug = false;
    if (oGoverningConcept.conceptData.hasOwnProperty("wordPropertiesConventions")) {
      if (oGoverningConcept.conceptData.wordPropertiesConventions.hasOwnProperty("appendIpnsFragmentToSlug")) {
          appendIpnsFragmentToSlug = oGoverningConcept.conceptData.wordPropertiesConventions.appendIpnsFragmentToSlug;
      }
    }
    // console.log("qwerty governingConcept_slug: "+governingConcept_slug+"; oGoverningConcept: "+JSON.stringify(oGoverningConcept,null,4))
    var mainSchema_slug = oGoverningConcept.conceptData.nodes.schema.slug;
    var oMainSchema = window.lookupWordBySlug[mainSchema_slug];
    var propertyPath = oGoverningConcept.conceptData.propertyPath;
    var singular = oGoverningConcept.conceptData.name.singular;
    var plural = oGoverningConcept.conceptData.name.plural;
    var concept_slugSingular = "";
    var concept_slugPlural = "";
    var concept_titleSingular = "";
    var concept_titlePlural = "";
    if (oGoverningConcept.conceptData.hasOwnProperty("oSlug")) {
        concept_slugSingular = oGoverningConcept.conceptData.oSlug.singular;
        concept_slugPlural = oGoverningConcept.conceptData.oSlug.plural;
    }
    if (oGoverningConcept.conceptData.hasOwnProperty("oTitle")) {
        concept_titleSingular = oGoverningConcept.conceptData.oTitle.singular;
        concept_titlePlural = oGoverningConcept.conceptData.oTitle.plural;
    }
    if (!concept_slugSingular) {
        var aSingularChunks = singular.split(" ");
        // console.log("qwertyyy making superset; sCurrConceptPlural: "+sCurrConceptPlural+"; aPluralChunks.length: "+aPluralChunks.length)
        for (var c=0;c<aSingularChunks.length;c++) {
            var nextChunk = aSingularChunks[c];
            if (nextChunk) {
                if (c > 0) {
                    nextChunk = nextChunk[0].toUpperCase() + nextChunk.substring(1)
                }
                concept_slugSingular += nextChunk;
            }
        }
    }
    if (!concept_titleSingular) {
        var aSingularChunks = singular.split(" ");
        // console.log("qwertyyy making superset; sCurrConceptPlural: "+sCurrConceptPlural+"; aPluralChunks.length: "+aPluralChunks.length)
        for (var c=0;c<aSingularChunks.length;c++) {
            var nextChunk = aSingularChunks[c];
            if (nextChunk) {
                nextChunk = nextChunk[0].toUpperCase() + nextChunk.substring(1)
                // console.log("qwertyyy making superset; nextChunk: "+nextChunk)
                concept_titleSingular += nextChunk;
                if (c < aSingularChunks.length - 1) {
                    concept_titleSingular += " ";
                }
            }
        }
    }

    var activityLogAddition = "";
    var oSpecificInstances = MiscFunctions.cloneObj(oAuxData.specificInstancesData)
    var aRelationships = MiscFunctions.cloneObj(oAuxData.relationshipsForSpecificInstances)
    var aSpecificInstances = Object.keys(oSpecificInstances);
    for (var a=0;a<aSpecificInstances.length;a++) {
        var nextSpecificInstance_slug = aSpecificInstances[a];
        var oSpecificInstanceData = oAuxData.specificInstancesData[nextSpecificInstance_slug][propertyPath]
        var oNewSpecificInstance = {};
        oNewSpecificInstance[propertyPath] = oAuxData.specificInstancesData[nextSpecificInstance_slug]
        var alreadyExists = false;
        if (window.lookupWordBySlug.hasOwnProperty(nextSpecificInstance_slug)) {
            alreadyExists = true;
        }
        // may be the new way to check if already exists:
        if (window.aOldReplacedWords.includes(nextSpecificInstance_slug)) {
            alreadyExists = true;
        }
        if (window.aNewReplacerWords.includes(nextSpecificInstance_slug)) {
            alreadyExists = true;
        }
        console.log("_alreadyExists_ specificInstanceSlug: "+nextSpecificInstance_slug+"; alreadyExists: "+alreadyExists)
        console.log("_alreadyExists_ window.aOldReplacedWords: "+JSON.stringify(window.aOldReplacedWords,null,4))
        console.log("_alreadyExists_ window.aNewReplacerWords: "+JSON.stringify(window.aNewReplacerWords,null,4))

        // console.log("addSingleConceptSpecificInstances; adding: a "+a+"; nextSpecificInstance_slug: "+nextSpecificInstance_slug+"; alreadyExists: "+alreadyExists)
        if (alreadyExists) {
            activityLogAddition = nextSpecificInstance_slug + " already exists in this concept graph!<br/>";
            jQuery("#transferActivityLogContainer").append(activityLogAddition)
        }
        if (!alreadyExists) {
            var oSpecificInstance_unedited = await MiscFunctions.createNewWordByTemplate("word");
            oSpecificInstance_unedited.metaData.replacementFor = nextSpecificInstance_slug;
            var newWord_ipns = oSpecificInstance_unedited.metaData.ipns;
            var newWord_slug = "";
            if (oNewSpecificInstance[propertyPath].hasOwnProperty("slug")) {
                newWord_slug = oNewSpecificInstance[propertyPath].slug;
            }
            if (newWord_slug) {
                oSpecificInstance_unedited.wordData.slug = concept_slugSingular + "_"+newWord_slug;
            }
            if (appendIpnsFragmentToSlug) {
                var addendum = "_"+newWord_ipns.substr(-6);
                oSpecificInstance_unedited.wordData.slug += addendum;
            }
            oSpecificInstance_unedited.wordData.wordType = concept_slugSingular;
            if (jQuery.inArray(singular,oSpecificInstance_unedited.wordData.wordTypes) == -1) {
                oSpecificInstance_unedited.wordData.wordTypes.push(concept_slugSingular)
            }
            if (oNewSpecificInstance[propertyPath].hasOwnProperty("name")) {
                var form_name = oNewSpecificInstance[propertyPath].name;
                oSpecificInstance_unedited.wordData.name = singular+": "+form_name;
            }
            if (oNewSpecificInstance[propertyPath].hasOwnProperty("title")) {
                var form_title = oNewSpecificInstance[propertyPath].title;
                oSpecificInstance_unedited.wordData.title = concept_titleSingular+": "+form_title;
            }
            oNewSpecificInstance = MiscFunctions.extendWithOrdering(oNewSpecificInstance,oSpecificInstance_unedited);
            oNewSpecificInstance.metaData.neuroCore.processedAsSpecificInstance = false;
            MiscFunctions.createOrUpdateWordInAllTables(oNewSpecificInstance);
            var newSpecificInstance_slug = oNewSpecificInstance.wordData.slug;
            var sNewSpecificInstance = JSON.stringify(oNewSpecificInstance,null,4);
            // console.log("sNewSpecificInstance: "+sNewSpecificInstance)
            activityLogAddition = newSpecificInstance_slug + " has been created to replace: " +nextSpecificInstance_slug + "!<br> <div style='color:orange;display:inline-block;' >TIME FOR A NAP!!</div><br/>";
            jQuery("#transferActivityLogContainer").append(activityLogAddition)
            oSpecificInstanceReplacementMap[nextSpecificInstance_slug] = newSpecificInstance_slug;
            window.oOldWordReplacementMap[nextSpecificInstance_slug] = newSpecificInstance_slug
        }
    }
    // next, add relationships
    await MiscFunctions.timeout(2000);
    for (var a=0;a<aRelationships.length;a++) {
        var oNextRel = aRelationships[a];
        var nF_slug = oNextRel.nodeFrom.slug;
        var nT_slug = oNextRel.nodeTo.slug;
        if (window.oOldWordReplacementMap.hasOwnProperty(nF_slug)) {
            oNextRel.nodeFrom.slug = window.oOldWordReplacementMap[nF_slug]
        }
        if (window.oOldWordReplacementMap.hasOwnProperty(nT_slug)) {
            oNextRel.nodeTo.slug = window.oOldWordReplacementMap[nT_slug]
        }
        oMainSchema = MiscFunctions.updateSchemaWithNewRel(oMainSchema,oNextRel,window.lookupWordBySlug)
    }
    MiscFunctions.createOrUpdateWordInAllTables(oMainSchema);
    activityLogAddition = mainSchema_slug + " has been updated. <br> <div style='color:orange;display:inline-block;' >TIME FOR A NAP!!</div><br/>";
    jQuery("#transferActivityLogContainer").append(activityLogAddition)

    // return something (junk) so next step awaits completeion of this function (is this necessary??)
    var fooResult = await MiscFunctions.timeout(10);
    return fooResult;
}

const addSingleEnumeration = async (nextEnumeration_slug,oEnumerationData) => {
    console.log("addSingleEnumeration; nextEnumeration_slug: "+nextEnumeration_slug+"; oEnumerationData: "+JSON.stringify(oEnumerationData,null,4))
    // create enumeration node

    var nF_source_slug = oEnumerationData.restrictsValueData.nodeFrom.slug;
    var nT_source_slug = oEnumerationData.restrictsValueData.nodeTo.slug;
    var sourceConceptSlug = oEnumerationData.restrictsValueData.nodeFrom.sourceConceptSlug
    var sourceSetSlug = oEnumerationData.restrictsValueData.nodeFrom.sourceSetSlug
    var targetConceptSlug = oEnumerationData.restrictsValueData.nodeTo.targetConceptSlug
    var targetPropertyKey = oEnumerationData.restrictsValueData.nodeTo.targetPropertyKey
    var aTargetPropertyKeyPaths = oEnumerationData.restrictsValueData.nodeTo.targetPropertyKeyPaths

    var uniquePropertyKey = oEnumerationData.restrictsValueData.uniquePropertyKey;

    var sourceConcept_wordSlug = MiscFunctions.findWordSlugFromConceptSlug(sourceConceptSlug)
    var targetConcept_wordSlug = MiscFunctions.findWordSlugFromConceptSlug(targetConceptSlug)

    // var targetPropertyKeyPath = aTargetPropertyKeyPaths[0];
    // var aTPKP = targetPropertyKeyPath.split(".")
    // var propertyPath = aTPKP[0];

    // Need to determine the slugs for nodeFrom (a set or superset) and nodeTo (a property)
    // These slugs should be preexisting within the present concept graph: window.lookupWordBySlug
    // Three places to look:
    // First, check whether restrictsValueData.nodeFrom.slug and restrictsValueData.nodeTo.slug exist within window.lookupWordBySlug
    // If not, see whether window.oOldWordReplacementMap is able to translate nF_slug and nT_slug into preexisting slugs
    // If not, use sourceConceptSlug and sourceSetSlug to find nF_slug
    // and targetConceptSlug, targetPropertyKey, and aTargetPropertyPath to find nT_slug

    var nF_slug = null;
    var nT_slug = null;

    console.log("nF_source_slug: "+nF_source_slug)
    if (window.lookupWordBySlug.hasOwnProperty(nF_source_slug)) {
        nF_slug = nF_source_slug;
    } else {
        if (window.oOldWordReplacementMap.hasOwnProperty(nF_source_slug)) {
            nF_slug = window.oOldWordReplacementMap[nF_source_slug]
        }
    }
    console.log("nF_slug: "+nF_slug)

    if (nF_slug==null) {
        if (window.lookupWordBySlug.hasOwnProperty(sourceSetSlug)) {
            nF_slug = sourceSetSlug
        }
    }
    if (nF_slug==null) {
        nF_slug = MiscFunctions.findSourceSetWordSlug(sourceConceptSlug,sourceSetSlug)
        // use sourceConceptSlug to find sourceConcept_wordSlug, then sourceSetSlug to find sourceSet_wordSlug and set that to nF_slug
    }

    var nodeToData = {};
    if (window.lookupWordBySlug.hasOwnProperty(nT_source_slug)) {
        nT_slug = nT_source_slug;
    } else {
        if (window.oOldWordReplacementMap.hasOwnProperty(nT_source_slug)) {
            nT_slug = window.oOldWordReplacementMap[nT_source_slug]
        }
    }

    if (nT_slug==null) {
        console.log("targetConceptSlug: "+targetConceptSlug+"; aTargetPropertyKeyPaths: "+JSON.stringify(aTargetPropertyKeyPaths,null,4))
        nT_slug = MiscFunctions.fetchPropertySlugFromKeyPath(targetConceptSlug,aTargetPropertyKeyPaths)
    }

    var setName = null;
    var setSlug = null;
    var setTitle = null;
    var sourceConceptSlug = null;
    var propertyPath = null;
    if (window.lookupWordBySlug.hasOwnProperty(nF_slug)) {
        var oNF = window.lookupWordBySlug[nF_slug]
        if (oNF.hasOwnProperty("setData")) {
            setName = oNF.setData.name;
            setSlug = oNF.setData.slug;
            setTitle = oNF.setData.title;
            var setGovConcept_wordSlug = oNF.setData.metaData.governingConcept.slug;
        }
        if (oNF.hasOwnProperty("supersetData")) {
            setName = oNF.supersetData.name;
            setSlug = oNF.supersetData.slug;
            setTitle = oNF.supersetData.title;
            var setGovConcept_wordSlug = oNF.supersetData.metaData.governingConcept.slug;
        }
        var oSetGovConcept = window.lookupWordBySlug[setGovConcept_wordSlug]
        sourceConceptSlug = oSetGovConcept.conceptData.slug;
        propertyPath = oSetGovConcept.conceptData.propertyPath;
    }

    var oNewEnumeration = await MiscFunctions.createNewWordByTemplate("enumeration");
    var newEnumeration_ipns = oNewEnumeration.metaData.ipns;

    var enumerationName = setName + " by " + uniquePropertyKey;
    var enumerationSlug = MiscFunctions.convertNameToSlug(enumerationName);
    // var enumerationTitle = MiscFunctions.convertNameToTitle(enumerationName);
    var enumerationTitle = setTitle + " by " + uniquePropertyKey;

    var enumeration_wordSlug = "enumerationOf_"+enumerationSlug + "_" + newEnumeration_ipns.slice(-6);;
    var enumeration_wordName = "enumeration of "+enumerationName;
    var enumeration_wordTitle = "Enumeration of "+enumerationTitle;



    oNewEnumeration.wordData.slug = enumeration_wordSlug;
    oNewEnumeration.wordData.name = enumeration_wordName;
    oNewEnumeration.wordData.title = enumeration_wordTitle;

    oNewEnumeration.enumerationData.slug = enumerationSlug;
    oNewEnumeration.enumerationData.name = enumerationName;
    oNewEnumeration.enumerationData.title = enumerationTitle;

    oNewEnumeration.enumerationData.restrictsValueData.nodeFrom.slug = nF_slug;
    oNewEnumeration.enumerationData.restrictsValueData.nodeFrom.sourceConceptSlug = sourceConceptSlug;
    oNewEnumeration.enumerationData.restrictsValueData.nodeFrom.sourceSetSlug = setSlug;

    oNewEnumeration.enumerationData.restrictsValueData.nodeTo.slug = nT_slug;
    oNewEnumeration.enumerationData.restrictsValueData.nodeTo.targetConceptSlug = targetConceptSlug;
    oNewEnumeration.enumerationData.restrictsValueData.nodeTo.targetPropertyKey = targetPropertyKey;
    oNewEnumeration.enumerationData.restrictsValueData.nodeTo.targetPropertyKeyPaths = aTargetPropertyKeyPaths;

    oNewEnumeration.enumerationData.restrictsValueData.targetPropertyType = oEnumerationData.restrictsValueData.targetPropertyType;
    oNewEnumeration.enumerationData.restrictsValueData.propertyPath = propertyPath;
    oNewEnumeration.enumerationData.restrictsValueData.uniquePropertyKey = oEnumerationData.restrictsValueData.uniquePropertyKey;
    oNewEnumeration.enumerationData.restrictsValueData.withSubsets = oEnumerationData.restrictsValueData.withSubsets;
    oNewEnumeration.enumerationData.restrictsValueData.withDependencies = oEnumerationData.restrictsValueData.withDependencies;
    oNewEnumeration.enumerationData.restrictsValueData.dependenciesPlacement = oEnumerationData.restrictsValueData.dependenciesPlacement;

    console.log("making oNewEnumeration; nF_slug: "+nF_slug+"; nT_slug: "+nT_slug)
    if (window.lookupWordBySlug.hasOwnProperty(nF_slug)) {
        var oNF = window.lookupWordBySlug[nF_slug]
        var nF_ipns = oNF.metaData.ipns;
    }
    if (window.lookupWordBySlug.hasOwnProperty(nT_slug)) {
        var oNT = window.lookupWordBySlug[nT_slug]
        var nT_ipns = oNT.metaData.ipns;
    }
    var uniqueID = nF_ipns.slice(-6)+"_restrictsValue_"+nT_ipns.slice(-6)
    oNewEnumeration.enumerationData.restrictsValueData.uniqueID = uniqueID;

    oNewEnumeration.enumerationData.nodeRolesManagement.uniqueID = uniqueID;
    oNewEnumeration.enumerationData.nodeRolesManagement.role1_slug = nF_slug;
    oNewEnumeration.enumerationData.nodeRolesManagement.role2_slug = nT_slug;

    console.log("oNewEnumeration: "+JSON.stringify(oNewEnumeration,null,4));

    // create 2 relationships: defines and enumerates
    var oNewRel1 = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
    var oNewRel2 = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
    oNewRel1.relationshipType.slug = "defines"
    oNewRel2.relationshipType.slug = "enumerates"

    oNewRel1.nodeFrom.slug = nF_slug;
    oNewRel1.nodeTo.slug = enumeration_wordSlug;
    oNewRel2.nodeFrom.slug = enumeration_wordSlug;
    oNewRel2.nodeTo.slug = nT_slug;

    console.log("oNewRel1: "+JSON.stringify(oNewRel1,null,4))
    console.log("oNewRel2: "+JSON.stringify(oNewRel2,null,4))

    var targetConcept_wordSlug = MiscFunctions.findWordSlugFromConceptSlug(targetConceptSlug)
    var oTargetConcept = window.lookupWordBySlug[targetConcept_wordSlug];
    var targetConcept_mainSchema_slug = oTargetConcept.conceptData.nodes.schema.slug;
    var oMainSchema = window.lookupWordBySlug[targetConcept_mainSchema_slug];
    var targetConcept_propertySchema_slug = oTargetConcept.conceptData.nodes.propertySchema.slug;
    var oPropertySchema = window.lookupWordBySlug[targetConcept_propertySchema_slug];

    var oRFL_ = MiscFunctions.cloneObj(window.lookupWordBySlug)
    oRFL_[oNewEnumeration.wordData.slug] = oNewEnumeration

    oMainSchema = MiscFunctions.updateSchemaWithNewRel(oMainSchema,oNewRel1,oRFL_)
    oPropertySchema = MiscFunctions.updateSchemaWithNewRel(oPropertySchema,oNewRel2,oRFL_)

    console.log("oMainSchema: "+JSON.stringify(oMainSchema,null,4))
    console.log("oPropertySchema: "+JSON.stringify(oPropertySchema,null,4))

    MiscFunctions.createOrUpdateWordInAllTables(oNewEnumeration);
    MiscFunctions.createOrUpdateWordInAllTables(oMainSchema);
    MiscFunctions.createOrUpdateWordInAllTables(oPropertySchema);
    var foo = await MiscFunctions.timeout(200)
}

const runQueuedCommand = async (queueNumber,commandName) => {
    window.oOldWordReplacementMap = updateOldWordReplacementMap();
    var oTransferCommandData = MiscFunctions.cloneObj(window.oCompactExports.aTransferCommandsQueue[queueNumber]);
    // var commandName = oTransferCommandData.commandName;
    var tablename = oTransferCommandData.tablename;
    var conceptSlug = oTransferCommandData.conceptSlug;
    var oEnumerationsData = oTransferCommandData.oEnumerationsData;
    console.log("runQueuedCommand; queueNumber: "+queueNumber+"; commandName: "+commandName+"; tablename: "+tablename+"; conceptSlug: "+conceptSlug)
    if (window.lookupWordBySlug.hasOwnProperty(conceptSlug)) {
        var oConcept = window.lookupWordBySlug[conceptSlug];
        var propertySchema_slug = oConcept.conceptData.nodes.propertySchema.slug;
        var oPropertySchema = window.lookupWordBySlug[propertySchema_slug];
        var mainSchema_slug = oConcept.conceptData.nodes.schema.slug;
        var oMainSchema = window.lookupWordBySlug[mainSchema_slug];
    }
    var filetype = oTransferCommandData.filetype;
    var oAuxData = oTransferCommandData.oAuxiliaryData;
    var activityLog = "";
    jQuery("#transferActivityLogContainer").html("")
    console.log("runQueuedCommand; commandName: "+commandName+"; queueNumber: "+queueNumber+"; conceptSlug: "+conceptSlug)
    var activityLogAddition = "";
    if (commandName=="addAllConceptSets") {
        var aConceptList = [];
        jQuery("input.concept_entire_concept_checkbox:checked").each(function(){
            var nextConcept_slug = jQuery(this).data("slug")
            aConceptList.push(nextConcept_slug)
        })
        for (var c=0;c<aConceptList.length;c++) {
            var nextConcept_slug = aConceptList[c];
            var oConceptSpecificAuxData = {};
            oConceptSpecificAuxData = oAuxData[nextConcept_slug];
            await addSingleConceptSets(oConceptSpecificAuxData,nextConcept_slug)
        }
    }
    if (commandName=="addAllEnumerations") {
        var aEnumList = [];
        jQuery("input.cg_entire_enumeration_checkbox:checked").each(function(){
            var nextEnumeration_slug = jQuery(this).data("slug")
            aEnumList.push(nextEnumeration_slug)
        })
        for (var c=0;c<aEnumList.length;c++) {
            var nextEnumeration_slug = aEnumList[c];
            var oEnumerationData = oEnumerationsData[nextEnumeration_slug]
            var fooResult = await addSingleEnumeration(nextEnumeration_slug,oEnumerationData)
        }
    }
    if (commandName=="addAllConceptSpecificInstances") {
        var aConceptList = [];
        jQuery("input.concept_entire_concept_checkbox:checked").each(function(){
            var nextConcept_slug = jQuery(this).data("slug")
            aConceptList.push(nextConcept_slug)
        })
        for (var c=0;c<aConceptList.length;c++) {
            var nextConcept_slug = aConceptList[c];
            var oConceptSpecificAuxData = {};
            oConceptSpecificAuxData = oAuxData[nextConcept_slug];
            var fooResult = await addSingleConceptSpecificInstances(oConceptSpecificAuxData,nextConcept_slug)
        }
    }
    if (commandName=="addAllConceptProperties") {
        var aConceptList = [];
        jQuery("input.concept_entire_concept_checkbox:checked").each(function(){
            var nextConcept_slug = jQuery(this).data("slug")
            aConceptList.push(nextConcept_slug)
        })
        for (var c=0;c<aConceptList.length;c++) {
            var nextConcept_slug = aConceptList[c];
            var oConceptSpecificAuxData = {};
            oConceptSpecificAuxData = oAuxData[nextConcept_slug];
            // console.log("addAllConceptProperties; nextConcept_slug: "+nextConcept_slug+"; oConceptSpecificAuxData: "+JSON.stringify(oConceptSpecificAuxData,null,4))
            // need to make this function:
            // await addSingleConceptProperties(nextConcept_slug,oConceptSpecificAuxData)
            await addSingleConceptProperties(oConceptSpecificAuxData,nextConcept_slug)
        }
    }
    // addSelectedSpecificInstance - not yet implemented / tested
    if (commandName=="addSelectedSpecificInstance") {
        await addSingleSpecificInstance(conceptSlug,oAuxData)
    }
    if (commandName=="addAllSpecificInstancesPlusTree") {
        // console.log("addAllSpecificInstancesPlusTree")
        oSpecificInstanceReplacementMap = {};
        var aRelationships = oAuxData.relationships;
        // cycle through and add each specific instance if not already present
        var oSIData = MiscFunctions.cloneObj(oAuxData.specificInstancesData);
        var aSISlugs = Object.keys(oSIData);
        for (var a=0;a<aSISlugs.length;a++) {
            var nextSISlug = aSISlugs[a];
            // console.log("addAllSpecificInstancesPlusTree; a: "+a+"; nextSISlug: "+nextSISlug)
            await addSingleSpecificInstance(nextSISlug,oAuxData)
        }
        // Then update oMainSchema with isASpecificInstanceOf relationships
        // similar to second half of addSetsToConcept step

        // many of the sets in aRelationships will have been replaced; therefore, make a lookup table to do the replacement

        var aWords = Object.keys(window.lookupWordBySlug)
        for (var w=0;w<aWords.length;w++) {
            var wordSlug = aWords[w];
            var oWord = window.lookupWordBySlug[wordSlug]
            if ( (oWord.hasOwnProperty("setData")) || (oWord.hasOwnProperty("supersetData")) ) {
                if (oWord.metaData.hasOwnProperty("replacementFor")) {
                    var rF_slug = oWord.metaData.replacementFor;
                    oSpecificInstanceReplacementMap[rF_slug] = wordSlug;
                }
            }
        }

        var aReplacedSpecificInstances = Object.keys(oSpecificInstanceReplacementMap)
        // console.log("oSpecificInstanceReplacementMap: "+JSON.stringify(oSpecificInstanceReplacementMap,null,4))
        await MiscFunctions.timeout(2000);
        // console.log("oMainSchema before update: "+JSON.stringify(oMainSchema,null,4))
        var aReplacedWords = Object.keys(oSpecificInstanceReplacementMap)
        for (var a=0;a<aRelationships.length;a++) {
            var oNextRel = aRelationships[a];
            var nF_slug = oNextRel.nodeFrom.slug;
            var nT_slug = oNextRel.nodeTo.slug;
            if (oSpecificInstanceReplacementMap.hasOwnProperty(nF_slug)) {
                oNextRel.nodeFrom.slug = oSpecificInstanceReplacementMap[nF_slug]
            }
            if (oSpecificInstanceReplacementMap.hasOwnProperty(nT_slug)) {
                oNextRel.nodeTo.slug = oSpecificInstanceReplacementMap[nT_slug]
            }
            // console.log("oNextRel: "+JSON.stringify(oNextRel,null,4))
            // replace updateSchemaWithNewRel with a function that looks in metaData.replacementFor to determine what to do
            oMainSchema = MiscFunctions.updateSchemaWithNewRel(oMainSchema,oNextRel,window.lookupWordBySlug)
        }
        /*
        for (var a=0;a<aRelationships.length;a++) {
            var oNextRel = aRelationships[a];
            for (var p=0;p<aReplacedSpecificInstances.length;p++) {
                var nextOldSi = aReplacedSpecificInstances[p];
                if (nextOldSi == oNextRel.nodeFrom.slug) {
                    oNextRel.nodeFrom.slug = oSpecificInstanceReplacementMap[nextOldSi]
                }
                if (nextOldSet == oNextRel.nodeTo.slug) {
                    oNextRel.nodeTo.slug = oSpecificInstanceReplacementMap[nextOldSi]
                }
            }
            console.log("oNextRel: "+JSON.stringify(oNextRel,null,4))
            // replace updateSchemaWithNewRel with a function that looks in metaData.replacementFor to determine what to do
            oMainSchema = MiscFunctions.updateSchemaWithNewRel(oMainSchema,oNextRel,window.lookupWordBySlug)
        }
        */
        console.log("oMainSchema updated: "+JSON.stringify(oMainSchema,null,4))
        MiscFunctions.createOrUpdateWordInAllTables(oMainSchema);
        activityLogAddition = mainSchema_slug + " has been updated. <br> <div style='color:orange;display:inline-block;' >TIME FOR A NAP!!</div><br/>";
        jQuery("#transferActivityLogContainer").append(activityLogAddition)

    }
    if (commandName=="addAllConceptCores") {
        var aConceptList = [];
        jQuery("input.concept_entire_concept_checkbox:checked").each(function(){
            var nextConcept_slug = jQuery(this).data("slug")
            aConceptList.push(nextConcept_slug)
        })
        for (var c=0;c<aConceptList.length;c++) {
            var nextConcept_slug = aConceptList[c];
            var oConceptSpecificAuxData = {};
            oConceptSpecificAuxData = oAuxData[nextConcept_slug];
            console.log("addAllConceptCores; nextConcept_slug: "+nextConcept_slug+"; oConceptSpecificAuxData: "+JSON.stringify(oConceptSpecificAuxData,null,4))
            await addSingleConceptCore(nextConcept_slug,oConceptSpecificAuxData)
        }
    }
    if (commandName=="addConceptCore") {
        await addSingleConceptCore(conceptSlug,oAuxData)
    }

    if (commandName=="addPropertiesToConcept") {
        await addSingleConceptProperties(oAuxData,conceptSlug)
    }
    if (commandName=="addSetsToConcept") {
        var oSets = MiscFunctions.cloneObj(oAuxData.setsData)
        var aRelationships = MiscFunctions.cloneObj(oAuxData.relationships)
        var aSets = Object.keys(oSets);
        // var governingConceptNameSingular = oAuxData.governingConceptNameSingular;
        // maybe ought to put plural into oAuxData? for sake of making the set's slug, title, name?
        // var governingConceptNamePlural = oAuxData.governingConceptNamePlural;
        var oSetReplacementMap = {};
        for (var a=0;a<aSets.length;a++) {
            var nextSet_slug = aSets[a];
            var alreadyExists = false;
            if (window.lookupWordBySlug.hasOwnProperty(nextSet_slug)) {
                alreadyExists = true;
            }
            // need to check whether any set exists that has metaData.replacementFor == nextSet_slug; if so, alreadyExists = true
            var replacement_slug = MiscFunctions.doesReplacementAlreadyExist(nextSet_slug);
            if (replacement_slug) {
                alreadyExists = true;
                oSetReplacementMap[nextSet_slug] = replacement_slug;
                window.oOldWordReplacementMap[nextSet_slug] = replacement_slug
            }
            console.log("a: "+a+"; nextSet_slug: "+nextSet_slug+"; alreadyExists: "+alreadyExists)
            if (alreadyExists) {
                activityLogAddition = nextSet_slug + " already exists in this concept graph!<br/>";
                jQuery("#transferActivityLogContainer").append(activityLogAddition)

            }
            if (!alreadyExists) {
                var oNewSet = await MiscFunctions.createNewWordByTemplate("set");
                oNewSet.setData = {...oNewSet.setData, ...oSets[nextSet_slug].setData};
                // oNewSet.setData.metaData = {...oNewSet.setData.metaData, ...oSets[nextProperty_slug].metaData};

                oNewSet = MiscFunctions.populateWordDataFromPrimaryWordType(oNewSet);

                var newSet_slug = oNewSet.wordData.slug;
                oNewSet.metaData.replacementFor = nextSet_slug;

                console.log("oNewSet: "+JSON.stringify(oNewSet,null,4))

                MiscFunctions.createOrUpdateWordInAllTables(oNewSet);

                oSetReplacementMap[nextSet_slug] = newSet_slug;
                activityLogAddition = newSet_slug + " has been created to replace: " +nextSet_slug + "!<br> <div style='color:orange;display:inline-block;' >TIME FOR A NAP!!</div><br/>";
                jQuery("#transferActivityLogContainer").append(activityLogAddition)
                window.oOldWordReplacementMap[nextSet_slug] = newSet_slug
            }
        }
        // Next, add relationships
        var aReplacedSets = Object.keys(oSetReplacementMap)
        console.log("oSetReplacementMap: "+JSON.stringify(oSetReplacementMap,null,4))
        // need this time delay to ensure all newly created words have been processed
        // prior to adding them to propertySchema.
        // (or just need to get await / async to work properly ? ... jQuery might be interfering somewhere ? )
        await MiscFunctions.timeout(2000);
        // console.log("oMainSchema before update: "+JSON.stringify(oMainSchema,null,4))
        for (var a=0;a<aRelationships.length;a++) {
            var oNextRel = aRelationships[a];
            for (var p=0;p<aReplacedSets.length;p++) {
                var nextOldSet = aReplacedSets[p];
                if (nextOldSet == oNextRel.nodeFrom.slug) {
                    oNextRel.nodeFrom.slug = oSetReplacementMap[nextOldSet]
                }
                if (nextOldSet == oNextRel.nodeTo.slug) {
                    oNextRel.nodeTo.slug = oSetReplacementMap[nextOldSet]
                }
            }
            console.log("oNextRel: "+JSON.stringify(oNextRel,null,4))
            // replace updateSchemaWithNewRel with a function that looks in metaData.replacementFor to determine what to do
            oMainSchema = MiscFunctions.updateSchemaWithNewRel(oMainSchema,oNextRel,window.lookupWordBySlug)
        }
        // console.log("oMainSchema updated: "+JSON.stringify(oMainSchema,null,4))
        MiscFunctions.createOrUpdateWordInAllTables(oMainSchema);
        activityLogAddition = mainSchema_slug + " has been updated. <br> <div style='color:orange;display:inline-block;' >TIME FOR A NAP!!</div><br/>";
        jQuery("#transferActivityLogContainer").append(activityLogAddition)
    }
    return true;
}
const processOptionCheckboxes = () => {
    console.log("importOptionCheckbox change ")
    jQuery("#queueContainer").html("")
    jQuery("#queueRawFileInputsContainer").html("")
    var queueNumber = 0;
    window.oCompactExports.aTransferCommandsQueue = [];
    jQuery("input:checked").each(function(){
        var tablename = jQuery(this).data("conceptgraphtablename");
        var filetype = jQuery(this).data("filetype");
        var conceptSlug = jQuery(this).data("conceptslug");
        console.log("importOptionCheckbox checked; tablename: "+tablename+"; filetype: "+filetype+"; conceptSlug: "+conceptSlug)
        addToQueue(queueNumber,tablename,filetype,conceptSlug);
        queueNumber++;
    })
}
export default class SingleConceptGraphImport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptGraphSqlID: null
        }
    }
    async componentDidMount() {
        await loadCompactExportFiles()
        makeCompactGraphSourcesSelector()
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" style={{backgroundColor:"#CFCFCF"}} >
                        <ConceptGraphMasthead />
                        <div class="h2">Concept Graph: Import from Compact Files</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>

                        <div style={{display:"inline-block",width:"700px",height:"900px",padding:"5px",border:"1px dashed grey"}}>
                            Available sources: <div id="compactGraphSourcesSelectorContainer" style={{display:"inline-block"}} ></div>
                            <br/>
                            <center>Import Options</center>
                            <div id="importOptionsContainer">importOptionsContainer</div>
                            <div id="queueRawFileInputsContainer">queueRawFileInputsContainer</div>
                        </div>

                        <div style={{display:"inline-block",width:"700px",height:"900px",padding:"5px",border:"1px dashed grey"}}>
                            <center><div id="patternActionQueueTitleContainer" style={{display:"inline-block"}}>Pattern-Action Queue</div></center>
                            <div id="queueContainer" >queueContainer</div>
                            <div id="transferActivityLogContainer" style={{backgroundColor:"#EFEFEF",border:"1px dashed grey"}}>transferActivityLogContainer</div>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
